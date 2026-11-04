"use client";

import * as React from "react";
import {
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Moon,
  Compass,
  Star,
  RotateCw,
  Eye,
  Crown,
  Heart,
  Briefcase,
  Shield,
  CircleDot,
} from "lucide-react";
import type { DrawnCardDetail, TarotCard } from "@/types/tarot";

interface TarotCardViewProps {
  cardDetail?: DrawnCardDetail | null;
  card?: TarotCard;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: "sm" | "md" | "lg";
  showPositionHeader?: boolean;
  className?: string;
}

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="w-3 h-3 text-amber-400" />,
  Water: <Droplets className="w-3 h-3 text-cyan-400" />,
  Air: <Wind className="w-3 h-3 text-sky-300" />,
  Earth: <Mountain className="w-3 h-3 text-emerald-400" />,
  Spirit: <Sparkles className="w-3 h-3 text-purple-400" />,
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "border-amber-500/50 bg-amber-500/10 text-amber-300",
  Water: "border-cyan-500/50 bg-cyan-500/10 text-cyan-300",
  Air: "border-sky-500/50 bg-sky-500/10 text-sky-300",
  Earth: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  Spirit: "border-purple-500/50 bg-purple-500/10 text-purple-300",
};

export function TarotCardView({
  cardDetail,
  card: cardProp,
  isFlipped = true,
  onFlip,
  size = "md",
  showPositionHeader = true,
  className = "",
}: TarotCardViewProps) {
  const cardData = cardDetail?.card || cardProp;
  const orientation = cardDetail?.orientation || "upright";
  const isReversed = orientation === "reversed";

  const sizeClasses = {
    sm: "w-36 h-56 text-xs",
    md: "w-52 h-80 text-sm",
    lg: "w-64 h-96 text-base",
  }[size];

  if (!cardData) {
    return (
      <div
        className={`${sizeClasses} rounded-2xl border border-dashed border-amber-500/30 bg-zinc-950/60 flex items-center justify-center p-4 text-center text-zinc-500 ${className}`}
      >
        <Sparkles className="w-6 h-6 animate-pulse text-amber-500/40 mb-2" />
        <span>Awaiting Draw</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Position Header (e.g. Past, Present, Future) */}
      {showPositionHeader && cardDetail && (
        <div className="mb-2 text-center">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 bg-amber-950/50 border border-amber-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
            {cardDetail.position_title}
          </span>
          <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1 max-w-[200px]">
            {cardDetail.position_role}
          </p>
        </div>
      )}

      {/* 3D Flip Card Container */}
      <div
        onClick={onFlip}
        className={`${sizeClasses} relative cursor-pointer group`}
        style={{ perspective: "1200px" }}
      >
        <div
          className="w-full h-full duration-700 transition-all rounded-2xl shadow-2xl relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >
          {/* Card Front (Face Up) */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden border border-amber-400/40 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-[0_0_30px_rgba(217,119,6,0.18)] ${
              isReversed ? "border-amber-600/40" : ""
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Celestial Ornate Inner Border */}
            <div className="absolute inset-1.5 rounded-xl border border-amber-500/20 pointer-events-none" />

            {/* Top Bar: Number & Graha */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-serif font-bold text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                {cardData.arcana === "major" ? `Arcana ${cardData.number}` : `${cardData.suit?.toUpperCase()} ${cardData.number}`}
              </span>

              {cardData.vedic_graha && (
                <span className="text-[11px] font-medium text-amber-200/90 bg-zinc-900/80 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  {cardData.vedic_graha}
                </span>
              )}
            </div>

            {/* Center Mystical Artwork / Symbolism */}
            <div className="flex-1 flex flex-col items-center justify-center my-1 relative z-10">
              {/* Radial Glow */}
              <div
                className={`absolute w-28 h-28 rounded-full blur-2xl opacity-30 ${
                  cardData.element === "Fire"
                    ? "bg-amber-500"
                    : cardData.element === "Water"
                    ? "bg-cyan-500"
                    : cardData.element === "Air"
                    ? "bg-sky-400"
                    : "bg-emerald-500"
                }`}
              />

              {/* Archetype Sacred Emblem */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-400/50 bg-gradient-to-b from-zinc-950/90 to-zinc-900/90 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] transform transition-transform group-hover:scale-105 ${
                  isReversed ? "rotate-180" : ""
                }`}
              >
                {cardData.arcana === "major" ? (
                  <Crown className="w-10 h-10 text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
                ) : cardData.suit === "wands" ? (
                  <Flame className="w-10 h-10 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                ) : cardData.suit === "cups" ? (
                  <Heart className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                ) : cardData.suit === "swords" ? (
                  <Wind className="w-10 h-10 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]" />
                ) : (
                  <CircleDot className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                )}
              </div>

              {/* Reversed indicator overlay */}
              {isReversed && (
                <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/70 border border-rose-500/30 px-2 py-0.5 rounded-full">
                  <RotateCw className="w-2.5 h-2.5 rotate-180" />
                  <span>Reversed</span>
                </div>
              )}
            </div>

            {/* Bottom Section: Name & Element */}
            <div className="z-10 text-center">
              <h4 className="font-serif font-bold text-amber-100 tracking-wide line-clamp-1 group-hover:text-amber-300 transition-colors drop-shadow-sm">
                {cardData.name}
              </h4>
              <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                {cardData.astrology}
              </p>

              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                    ELEMENT_COLORS[cardData.element] || "border-zinc-700 text-zinc-300"
                  }`}
                >
                  {ELEMENT_ICONS[cardData.element]}
                  <span>{cardData.element}</span>
                </span>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    isReversed
                      ? "border-rose-500/40 bg-rose-950/40 text-rose-300"
                      : "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                  }`}
                >
                  {isReversed ? "Reversed" : "Upright"}
                </span>
              </div>
            </div>
          </div>

          {/* Card Back (Face Down) */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col items-center justify-center border-2 border-amber-500/50 bg-gradient-to-br from-indigo-950 via-zinc-950 to-purple-950 shadow-[0_0_25px_rgba(147,51,234,0.25)] overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Sacred Geometry Mandala Motif */}
            <div className="absolute inset-2 rounded-xl border border-amber-400/30 flex items-center justify-center">
              <div className="absolute w-28 h-28 rounded-full border border-amber-500/20 animate-spin-slow" />
              <div className="absolute w-20 h-20 rounded-full border border-amber-400/30 rotate-45" />
              <div className="absolute w-12 h-12 rounded-full border border-amber-300/40" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/40 flex items-center justify-center mb-2 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <span className="font-serif text-xs font-semibold text-amber-300 tracking-widest uppercase">
                Astra Arcana
              </span>
              <p className="text-[10px] text-zinc-400 mt-1">Tap to reveal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

