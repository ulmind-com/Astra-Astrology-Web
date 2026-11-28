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

function CardCornerPip({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none text-[#d4af37] ${className}`}
    >
      <path
        d="M2 14V5C2 3.34315 3.34315 2 5 2H14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="5" cy="5" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function TarotIllustration({ card, isReversed = false }: TarotIllustrationProps) {
  const src = getDeckImagePath(card);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#ffffff] via-[#fffcf5] to-[#f8f1e2] p-1.5 sm:p-2 border-2 border-[#e0b44a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.8),inset_0_2px_6px_rgba(212,175,55,0.2)] flex items-center justify-center select-none">
      {/* Subtle Inner Hairline Bevel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 rounded-xl border border-amber-400/40"
      />

      {/* 4 Delicate Gilded Corner Flourishes */}
      <div aria-hidden="true" className="pointer-events-none">
        <CardCornerPip className="absolute top-1.5 left-1.5" />
        <CardCornerPip className="absolute top-1.5 right-1.5 rotate-90" />
        <CardCornerPip className="absolute bottom-1.5 right-1.5 rotate-180" />
        <CardCornerPip className="absolute bottom-1.5 left-1.5 -rotate-90" />
      </div>

      {/* Subtle Radial Warm Sanctuary Matte Behind Mounted Plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(254,243,199,0.8) 0%, rgba(253,230,138,0.2) 60%, rgba(245,158,11,0.08) 100%)",
        }}
      />

      {/* Genuine Authentic 1909 Rider-Waite Engraving Plate Window (Fills 85-90% Heroically) */}
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
          className="tarot-art-breath h-full w-auto max-w-full object-contain rounded-lg shadow-[0_4px_16px_rgba(70,40,15,0.18),0_0_1px_rgba(180,83,9,0.3)] border border-amber-400/40"
        />
      </div>

      {/* Subtle Sweeping Sunbeam Glaze */}
      <div
        aria-hidden="true"
        className="tarot-sunbeam-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 z-20 opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}
