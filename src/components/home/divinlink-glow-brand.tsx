"use client";

import * as React from "react";
import { logo, type EffectInstance } from "glowdots";
import { cn } from "@/lib/utils";

interface DivinLinkGlowBrandProps {
  className?: string;
  source?: string;
  bloom?: number;
  clickBurst?: boolean;
}

export function DivinLinkGlowBrand({
  className,
  source = "/logo.png",
  bloom = 0.45,
  clickBurst = true,
}: DivinLinkGlowBrandProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<EffectInstance | null>(null);

  React.useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    try {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }

      // Pure ambient design particle emblem
      const inst = logo(target, {
        source,
        preserveColors: true,
        bloom,
        clickBurst,
        count: 24000,
        size: 1.5,
        intensity: 1.4,
        softness: 0.35,
        dust: 0.08,
        scale: 1.0,
        depth: 0.06,
        interaction: "swirl",
        interactionRadius: 0.4,
        interactionStrength: 0.65,
        pointerTarget: "window",
        holdCharge: false,
        orbit: false,
        idleMotion: true,
        entranceDuration: 1.2,
        pauseOffscreen: false,
      });

      instanceRef.current = inst;

      const canvas = target.querySelector("canvas");
      if (canvas) {
        canvas.style.zIndex = "1";
      }
    } catch (err) {
      console.warn("[glowdots] Logo initialization error:", err);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [source, bloom, clickBurst]);

  return (
    <div
      id="brand"
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center select-none overflow-visible",
        className
      )}
      style={{ touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
