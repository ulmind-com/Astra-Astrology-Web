/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import type { TarotCard } from "@/types/tarot";

interface TarotIllustrationProps {
  card: TarotCard;
  isReversed?: boolean;
}

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
  const src = getDeckImagePath(card);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-[#d4af37]/35 bg-gradient-to-b from-[#160d13] via-[#0e070c] to-[#140b11] p-2 flex items-center justify-center select-none shadow-[inset_0_3px_12px_rgba(0,0,0,0.85)]">
      {/* Subtle Radial Warm Sanctuary Matte Behind Mounted Plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(247,208,112,0.12) 0%, rgba(18,9,16,0.3) 60%, rgba(8,3,6,0.8) 100%)",
        }}
      />

      {/* Genuine Authentic 1909 Rider-Waite Engraving Plate Window */}
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
          className="tarot-art-breath max-h-full w-auto max-w-full object-contain rounded-xs border border-[#d4af37]/25 shadow-[0_6px_20px_rgba(0,0,0,0.7)]"
        />
      </div>

      {/* Subtle Sweeping Sunbeam Glaze */}
      <div
        aria-hidden="true"
        className="tarot-sunbeam-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 z-20 opacity-25"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 245, 214, 0.45) 50%, transparent 100%)",
        }}
      />

      {/* Inner Antique Brass Beveled Fillet */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 z-30 rounded-lg border border-[#d4af37]/20"
      />
    </div>
  );
}
