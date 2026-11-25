"use client";

/**
 * AiAvatar — Live 3D robot avatar for the AI chat stream.
 *
 * Uses a **singleton offscreen WebGL renderer** (`SharedAvatarRenderer`) so
 * even a 100-message conversation creates only ONE extra WebGL context.
 * Each `<AiAvatar>` subscribes a tiny `<canvas>` that receives blits every
 * frame via `ctx.drawImage()`.
 *
 * Falls back gracefully:
 *   1. If the browser has `prefers-reduced-motion: reduce` → still renders
 *      robot but with minimal animation (handled inside SharedAvatarRenderer).
 *   2. If WebGL fails entirely → shows the existing Lottie logo animation.
 *   3. If Lottie also fails → shows a static <Bot> icon.
 */

import dynamic from "next/dynamic";
import { Bot } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/* ---------- Lazy imports (never SSR) ---------- */

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => null,
});

/* ---------- Lottie fallback (shared fetch, same as before) ---------- */

let cachedLottie: unknown | null = null;
let lottieInFlight: Promise<unknown | null> | null = null;

function loadLottieAnimation(): Promise<unknown | null> {
  if (cachedLottie) return Promise.resolve(cachedLottie);
  if (!lottieInFlight) {
    lottieInFlight = fetch("/ai-logo.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        cachedLottie = data;
        return data;
      })
      .catch(() => null)
      .finally(() => {
        lottieInFlight = null;
      });
  }
  return lottieInFlight;
}

/* ---------- Reduced-motion subscription ---------- */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readMotionPreference(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

/* ---------- Component ---------- */

export function AiAvatar({
  size = 44,
  className,
  /** Animate only while the astrologer is actually saying something. */
  active = true,
}: {
  size?: number;
  className?: string;
  active?: boolean;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [webglReady, setWebglReady] = React.useState(false);
  const [webglFailed, setWebglFailed] = React.useState(false);
  const [lottieData, setLottieData] = React.useState<unknown | null>(null);

  const still = React.useSyncExternalStore(
    subscribeToMotionPreference,
    readMotionPreference,
    () => false,
  );

  // Try the 3D robot first
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Dynamic import to avoid bundling Three.js when SSR
    let unsubscribe: (() => void) | null = null;
    let alive = true;

    import("@/lib/ai-robot-scene").then(({ getSharedAvatarRenderer }) => {
      if (!alive || !canvas) return;
      const renderer = getSharedAvatarRenderer();
      unsubscribe = renderer.subscribe(
        canvas,
        () => {
          if (alive) setWebglReady(true);
        },
        () => {
          if (alive) {
            queueMicrotask(() => {
              if (alive) setWebglFailed(true);
            });
          }
        },
      );
    }).catch(() => {
      if (alive) setWebglFailed(true);
    });

    return () => {
      alive = false;
      unsubscribe?.();
    };
  }, []);

  // Lottie fallback: only load if WebGL fails
  React.useEffect(() => {
    if (!webglFailed) return;
    let alive = true;
    loadLottieAnimation().then((data) => {
      if (alive && data) setLottieData(data);
    });
    return () => {
      alive = false;
    };
  }, [webglFailed]);

  // Internal canvas resolution (sharp on retina, shared renderer is 128×128)
  const canvasPx = 128;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-[0_4px_14px_rgba(217,119,6,0.35)] ring-1 ring-amber-300/50",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* Layer 1: 3D robot canvas (always mounted for subscription) */}
      <canvas
        ref={canvasRef}
        width={canvasPx}
        height={canvasPx}
        className={cn(
          "absolute inset-0 block size-full transition-opacity duration-300",
          webglReady && !webglFailed ? "opacity-100" : "opacity-0",
        )}
        aria-hidden
      />

      {/* Layer 2: Lottie fallback when WebGL fails */}
      {webglFailed && lottieData ? (
        <Lottie
          animationData={lottieData}
          loop={active && !still}
          autoplay={!still}
          style={{ width: "118%", height: "118%" }}
        />
      ) : webglFailed && !lottieData ? (
        /* Layer 3: Static icon fallback */
        <Bot className="text-white" style={{ width: size * 0.5, height: size * 0.5 }} />
      ) : null}
    </span>
  );
}
