"use client";

import { Lottie } from "lottie-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface LottieAstrologyProps {
  /** Size in pixels (width & height). */
  size?: number;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Whether to show decorative concentric celestial rings & cosmic aura. */
  decorative?: boolean;
  /** Preset variant:
   * - "hero-backdrop": Grand celestial astrolabe rotating behind hero content
   * - "emblem": Focused showcase medallion with glowing orbital rings
   * - "minimal": Clean rotating wheel without outer rings or extra glow
   */
  variant?: "hero-backdrop" | "emblem" | "minimal";
  /** Optional click handler */
  onClick?: () => void;
}

export function LottieAstrology({
  size,
  className,
  decorative = true,
  variant = "emblem",
  onClick,
}: LottieAstrologyProps) {
  const [animationData, setAnimationData] = React.useState<object | null>(null);

  // Lazy-fetch so it never bloats the JS bundle.
  React.useEffect(() => {
    let isMounted = true;
    fetch("/astrology-lottie.json")
      .then((r) => r.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch((err) => {
        console.error("Failed to load astrology animation:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultSize =
    variant === "hero-backdrop" ? 680 : variant === "emblem" ? 380 : 160;
  const dimension = size ?? defaultSize;

  if (variant === "hero-backdrop") {
    return (
      <div
        className={cn(
          "pointer-events-none relative flex items-center justify-center select-none",
          className
        )}
        style={{ width: dimension, height: dimension }}
        aria-hidden
      >
        {/* Multitier cosmic aura */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgb(168 85 247 / 0.28) 0%, rgb(245 158 11 / 0.12) 36%, rgb(109 40 217 / 0.06) 58%, transparent 72%)",
            filter: "blur(36px)",
          }}
        />

        {/* Outer celestial orbital ring (clockwise 60s) */}
        <span
          className="pointer-events-none absolute rounded-full border border-gold-300/[0.22]"
          style={{
            inset: "-4%",
            animation: "spin 60s linear infinite",
            boxShadow:
              "0 0 50px -10px rgb(245 158 11 / 0.25), inset 0 0 30px -10px rgb(168 85 247 / 0.2)",
          }}
        >
          {/* Subtle celestial quadrant pips */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-gold-300/80 shadow-[0_0_8px_#fde047]" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1.5 rounded-full bg-gold-300/80 shadow-[0_0_8px_#fde047]" />
          <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-gold-300/80 shadow-[0_0_8px_#fde047]" />
          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-gold-300/80 shadow-[0_0_8px_#fde047]" />
        </span>

        {/* Mid dashed astrological coordinate ring (counter-clockwise 45s) */}
        <span
          className="pointer-events-none absolute rounded-full border border-dashed border-brand-300/[0.25]"
          style={{
            inset: "5%",
            animation: "spin-reverse 45s linear infinite",
          }}
        />

        {/* Inner gentle pulse halo */}
        <span
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: "18%",
            background:
              "radial-gradient(circle, rgb(168 85 247 / 0.12) 0%, transparent 70%)",
            animation: "pulse-scale 6s ease-in-out infinite",
          }}
        />

        {/* Lottie wheel animation */}
        {animationData && (
          <div
            className="relative flex items-center justify-center"
            style={{
              width: dimension * 0.92,
              height: dimension * 0.92,
              filter: "drop-shadow(0 0 35px rgb(245 158 11 / 0.35))",
            }}
          >
            <Lottie
              src={animationData as Parameters<typeof Lottie>[0]["src"]}
              loop
              autoplay
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
    );
  }

  // Emblem / Minimal preset
  return (
    <div
      onClick={onClick}
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: dimension, height: dimension }}
      aria-hidden={!onClick}
    >
      {decorative && (
        <>
          {/* Radial warm gold + amethyst glow */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgb(245 158 11 / 0.22) 0%, rgb(168 85 247 / 0.24) 42%, rgb(109 40 217 / 0.1) 64%, transparent 75%)",
              filter: "blur(24px)",
            }}
          />
          {/* Outer rotating ring */}
          <span
            className="pointer-events-none absolute rounded-full border border-gold-300/[0.3]"
            style={{
              inset: "0%",
              animation: "spin 50s linear infinite",
              boxShadow:
                "0 0 35px -8px rgb(245 158 11 / 0.4), inset 0 0 25px -8px rgb(168 85 247 / 0.3)",
            }}
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-gold-200 shadow-[0_0_6px_#fde047]" />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1.5 rounded-full bg-gold-200 shadow-[0_0_6px_#fde047]" />
          </span>
          {/* Mid dashed ring */}
          <span
            className="pointer-events-none absolute rounded-full border border-dashed border-brand-300/[0.28]"
            style={{
              inset: "8%",
              animation: "spin-reverse 35s linear infinite",
            }}
          />
        </>
      )}

      {/* Shimmer placeholder while loading */}
      {!animationData && (
        <div
          className="absolute rounded-full shimmer opacity-25"
          style={{ inset: "6%" }}
        />
      )}

      {/* Lottie wheel animation */}
      {animationData && (
        <div
          className="relative flex items-center justify-center"
          style={{
            width: decorative ? dimension * 0.88 : dimension,
            height: decorative ? dimension * 0.88 : dimension,
            filter: "drop-shadow(0 0 28px rgb(245 158 11 / 0.35))",
          }}
        >
          <Lottie
            src={animationData as Parameters<typeof Lottie>[0]["src"]}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
