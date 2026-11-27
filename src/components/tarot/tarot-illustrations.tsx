/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import type { TarotCard } from "@/types/tarot";

interface TarotIllustrationProps {
  card: TarotCard;
  isReversed?: boolean;
}

const ELEMENT_MOOD: Record<
  string,
  { mountBg: string; sparkBg: string; ringBorder: string }
> = {
  Fire: {
    mountBg: "from-[#f5e7c9] via-[#edd7ac] to-[#e4c38d]",
    sparkBg: "rgba(217, 119, 6, 0.85)",
    ringBorder: "border-amber-700/30",
  },
  Water: {
    mountBg: "from-[#e6edf2] via-[#dbe6ee] to-[#cad8e4]",
    sparkBg: "rgba(14, 116, 144, 0.8)",
    ringBorder: "border-cyan-800/30",
  },
  Air: {
    mountBg: "from-[#eef1f5] via-[#e2e7ef] to-[#d2dbe6]",
    sparkBg: "rgba(3, 105, 161, 0.8)",
    ringBorder: "border-sky-800/30",
  },
  Earth: {
    mountBg: "from-[#efe8d2] via-[#e5dcc0] to-[#d6cba5]",
    sparkBg: "rgba(5, 150, 105, 0.82)",
    ringBorder: "border-emerald-800/30",
  },
  Spirit: {
    mountBg: "from-[#f6ead0] via-[#ecdbba] to-[#dfc79b]",
    sparkBg: "rgba(180, 83, 9, 0.88)",
    ringBorder: "border-amber-800/35",
  },
};

function getDeckImagePath(card: TarotCard): string {
  if (card.arcana === "major") {
    const num = Math.max(0, Math.min(21, card.number));
    return `/images/tarot/cards/major_${num}.webp`;
  }
  const validSuit =
    card.suit === "wands" ||
    card.suit === "cups" ||
    card.suit === "swords" ||
    card.suit === "pentacles"
      ? card.suit
      : "pentacles";
  const num = Math.max(1, Math.min(14, card.number));
  return `/images/tarot/cards/${validSuit}_${num}.webp`;
}

export function TarotIllustration({ card, isReversed = false }: TarotIllustrationProps) {
  const mood = ELEMENT_MOOD[card.element] || ELEMENT_MOOD.Spirit;
  const src = getDeckImagePath(card);

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-xl border border-amber-400/80 bg-gradient-to-b ${mood.mountBg} p-1.5 flex items-center justify-center select-none shadow-inner`}
    >
      {/* Subtle Radial Warm Temple Matte Behind Mounted Plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,253,247,0.85) 0%, rgba(217,183,124,0.18) 65%, rgba(120,66,22,0.22) 100%)",
        }}
      />

      {/* Genuine Authentic 1909 Rider-Waite Engraving from PDF */}
      <div
        className={`relative z-10 h-full w-full flex items-center justify-center transition-transform duration-700 ${
          isReversed ? "rotate-180" : ""
        }`}
      >
        <img
          src={src}
          alt={card.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`tarot-art-breath max-h-full w-auto max-w-full object-contain rounded-[6px] border ${mood.ringBorder} shadow-[0_6px_16px_rgba(36,22,16,0.26)]`}
        />
      </div>

      {/* Subtle Sweeping Sunbeam Glaze */}
      <div
        aria-hidden="true"
        className="tarot-sunbeam-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 z-20 opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 250, 232, 0.55) 50%, transparent 100%)",
        }}
      />

      {/* Unobtrusive Corner Kinetic Gold Spangle Sparks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        <span
          className="tarot-spark-float absolute w-1.5 h-1.5 rounded-full"
          style={{
            top: "8%",
            left: "8%",
            backgroundColor: mood.sparkBg,
            animationDelay: "0s",
          }}
        />
        <span
          className="tarot-spark-float absolute w-1 h-1 rounded-full"
          style={{
            top: "10%",
            right: "8%",
            backgroundColor: mood.sparkBg,
            animationDelay: "1.6s",
          }}
        />
        <span
          className="tarot-spark-float absolute w-1 h-1 rounded-full"
          style={{
            bottom: "8%",
            left: "9%",
            backgroundColor: mood.sparkBg,
            animationDelay: "2.4s",
          }}
        />
        <span
          className="tarot-spark-float absolute w-1.5 h-1.5 rounded-full"
          style={{
            bottom: "9%",
            right: "9%",
            backgroundColor: mood.sparkBg,
            animationDelay: "0.9s",
          }}
        />
      </div>

      {/* Inner Brass Frame Bevel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 z-30 rounded-lg border border-amber-500/30"
      />
    </div>
  );
}
