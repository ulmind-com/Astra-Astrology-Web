"use client";

import { Lottie } from "lottie-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface LottieAstrologyProps {
  /** How large to render the animation. Defaults to 420px. */
  size?: number;
  /** Extra classes on the outer wrapper. */
  className?: string;
  /** Whether to show the decorative ring + glow behind the wheel. */
  decorative?: boolean;
}

/**
 * Renders the rotating Astro Wheel Lottie animation.
 *
 * Usage:
 *   <LottieAstrology size={480} decorative />
 *
 * The animation JSON is fetched lazily from /astrology-lottie.json (public)
 * so it is never bundled into the JS chunk.
 */
export function LottieAstrology({
  size = 420,
  className,
  decorative = true,
}: LottieAstrologyProps) {
  const [animationData, setAnimationData] = React.useState<object | null>(null);

  // Lazy-fetch so it never bloats the JS bundle.
  React.useEffect(() => {
    fetch("/astrology-lottie.json")
      .then((r) => r.json())
      .then(setAnimationData)
      .catch(console.error);
  }, []);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {decorative && (
        <>
          {/* Deep cosmic glow behind the wheel */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgb(139 44 234 / 0.38) 0%, rgb(109 40 217 / 0.2) 42%, transparent 72%)",
              filter: "blur(20px)",
            }}
          />
          {/* Outer slow-rotating ring */}
          <span
            className="pointer-events-none absolute rounded-full border border-brand-300/[0.18]"
            style={{
              inset: "3%",
              animation: "spin 40s linear infinite",
              boxShadow:
                "0 0 48px -12px rgb(168 85 247 / 0.55), inset 0 0 48px -12px rgb(168 85 247 / 0.18)",
            }}
          />
          {/* Mid ring — counter-rotate */}
          <span
            className="pointer-events-none absolute rounded-full border border-gold-300/[0.12]"
            style={{
              inset: "13%",
              animation: "spin-reverse 28s linear infinite",
            }}
          />
          {/* Inner gentle pulse halo */}
          <span
            className="pointer-events-none absolute rounded-full"
            style={{
              inset: "27%",
              background: "rgb(109 28 197 / 0.08)",
              animation: "pulse-scale 4s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Shimmer placeholder while loading */}
      {!animationData && (
        <div
          className="absolute rounded-full shimmer opacity-20"
          style={{ inset: "10%" }}
        />
      )}

      {/* The Lottie wheel — rendered only once data is loaded */}
      {animationData && (
        <Lottie
          src={animationData as Parameters<typeof Lottie>[0]["src"]}
          loop
          autoplay
          style={{
            width: size * 0.82,
            height: size * 0.82,
            position: "relative",
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}
