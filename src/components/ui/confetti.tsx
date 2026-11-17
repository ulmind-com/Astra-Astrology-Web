"use client";

import confetti from "canvas-confetti";

export interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  shapes?: ("circle" | "square")[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
}

/**
 * Sacred Celestial Confetti burst (Gold, Saffron, Amber, Emerald, Ruby)
 * Ideal for high Kundli match score, course certification, & purchase celebrations.
 */
export function fireCelestialConfetti(customOptions?: ConfettiOptions) {
  const count = customOptions?.particleCount ?? 120;
  const defaults = {
    origin: { y: 0.65 },
    colors: ["#fcd404", "#f59e0b", "#d97706", "#10b981", "#ef4444", "#ffffff"],
    zIndex: 9999,
  };

  try {
    confetti({
      ...defaults,
      ...customOptions,
      particleCount: Math.floor(count * 0.25),
      spread: 30,
      startVelocity: 55,
    });

    confetti({
      ...defaults,
      ...customOptions,
      particleCount: Math.floor(count * 0.2),
      spread: 60,
    });

    confetti({
      ...defaults,
      ...customOptions,
      particleCount: Math.floor(count * 0.35),
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    confetti({
      ...defaults,
      ...customOptions,
      particleCount: Math.floor(count * 0.1),
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    confetti({
      ...defaults,
      ...customOptions,
      particleCount: Math.floor(count * 0.1),
      spread: 120,
      startVelocity: 45,
    });
  } catch (err) {
    console.warn("Confetti animation omitted:", err);
  }
}
