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
  Crown,
  Heart,
  CircleDot,
} from "lucide-react";
import type { DrawnCardDetail, TarotCard } from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { CARD_NAMES_LOCALIZED, ELEMENTS_LOCALIZED } from "@/lib/tarot-translations";

interface TarotCardViewProps {
  cardDetail?: DrawnCardDetail | null;
  card?: TarotCard;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: "sm" | "md" | "lg";
  showPositionHeader?: boolean;
  language?: AstrologyLanguage;
  className?: string;
}

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="w-3 h-3 text-amber-600" />,
  Water: <Droplets className="w-3 h-3 text-cyan-600" />,
  Air: <Wind className="w-3 h-3 text-sky-600" />,
  Earth: <Mountain className="w-3 h-3 text-emerald-600" />,
  Spirit: <Sparkles className="w-3 h-3 text-purple-600" />,
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "border-amber-200 bg-amber-50 text-amber-800",
  Water: "border-cyan-200 bg-cyan-50 text-cyan-800",
  Air: "border-sky-200 bg-sky-50 text-sky-800",
  Earth: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Spirit: "border-purple-200 bg-purple-50 text-purple-800",
};

export function TarotCardView({
  cardDetail,
  card: cardProp,
  isFlipped = true,
  onFlip,
  size = "md",
  showPositionHeader = true,
  language = "bn",
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
        className={`${sizeClasses} rounded-2xl border-2 border-dashed border-amber-300 bg-white/80 flex flex-col items-center justify-center p-4 text-center text-slate-400 shadow-xs ${className}`}
      >
        <Sparkles className="w-6 h-6 animate-pulse text-amber-500 mb-2" />
        <span className="text-xs font-semibold">
          {language === "bn" ? "কার্ড নির্বাচনের অপেক্ষায়" : language === "hi" ? "कार्ड चयन प्रतीक्षित" : "Awaiting Draw"}
        </span>
      </div>
    );
  }

  const localizedName =
    CARD_NAMES_LOCALIZED[language]?.[cardData.id] || cardData.name;
  const localizedElement =
    ELEMENT_LOCALIZED_NAME(cardData.element, language);

  function ELEMENT_LOCALIZED_NAME(elem: string, lang: AstrologyLanguage): string {
    return ELEMENTS_LOCALIZED[lang]?.[elem] || elem;
  }

  const orientationLabel = isReversed
    ? language === "bn"
      ? "উল্টো (অন্তর্মুখী)"
      : language === "hi"
      ? "उल्टा (आंतरिक)"
      : "Reversed"
    : language === "bn"
    ? "সোজা (জাগ্রত)"
    : language === "hi"
    ? "सीधा (सकारात्मक)"
    : "Upright";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Position Header */}
      {showPositionHeader && cardDetail && (
        <div className="mb-2.5 text-center">
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full shadow-xs">
            {cardDetail.position_title}
          </span>
          <p className="text-[11px] text-slate-600 font-medium mt-1 line-clamp-1 max-w-[200px]">
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
          className="w-full h-full duration-700 transition-all rounded-2xl shadow-md hover:shadow-xl relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >
          {/* Card Front (Face Up) - Authentic Ivory/Gold Parchment */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-3 sm:p-4 flex flex-col justify-between overflow-hidden border-2 border-amber-400 bg-gradient-to-b from-white via-amber-50/20 to-white shadow-sm ${
              isReversed ? "border-amber-500" : ""
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Celestial Ornate Inner Border */}
            <div className="absolute inset-1.5 rounded-xl border border-amber-300/60 pointer-events-none" />

            {/* Top Bar: Number & Graha */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {cardData.arcana === "major" ? `Arcana ${cardData.number}` : `${cardData.suit?.toUpperCase()} ${cardData.number}`}
              </span>

              {cardData.vedic_graha && (
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-950 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  {cardData.vedic_graha}
                </span>
              )}
            </div>

            {/* Center Sacred Symbolism */}
            <div className="flex-1 flex flex-col items-center justify-center my-1 relative z-10">
              {/* Radial Glow */}
              <div
                className={`absolute w-24 h-24 rounded-full blur-xl opacity-30 ${
                  cardData.element === "Fire"
                    ? "bg-amber-400"
                    : cardData.element === "Water"
                    ? "bg-cyan-400"
                    : cardData.element === "Air"
                    ? "bg-sky-300"
                    : "bg-emerald-400"
                }`}
              />

              {/* Archetype Sacred Emblem */}
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-amber-100/60 flex items-center justify-center shadow-md transform transition-transform group-hover:scale-105 ${
                  isReversed ? "rotate-180" : ""
                }`}
              >
                {cardData.arcana === "major" ? (
                  <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 drop-shadow-sm" />
                ) : cardData.suit === "wands" ? (
                  <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 drop-shadow-sm" />
                ) : cardData.suit === "cups" ? (
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-600 drop-shadow-sm" />
                ) : cardData.suit === "swords" ? (
                  <Wind className="w-8 h-8 sm:w-10 sm:h-10 text-sky-600 drop-shadow-sm" />
                ) : (
                  <CircleDot className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 drop-shadow-sm" />
                )}
              </div>

              {/* Reversed indicator tag */}
              {isReversed && (
                <div className="mt-1 flex items-center gap-1 text-[9px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  <RotateCw className="w-2.5 h-2.5 rotate-180" />
                  <span>{language === "bn" ? "উল্টো" : language === "hi" ? "उल्टा" : "Reversed"}</span>
                </div>
              )}
            </div>

            {/* Bottom Section: Name & Element */}
            <div className="z-10 text-center">
              <h4 className="font-serif font-bold text-slate-900 tracking-wide line-clamp-1 group-hover:text-amber-700 transition-colors">
                {localizedName}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mt-0.5">
                {cardData.astrology}
              </p>

              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span
                  className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 shadow-2xs ${
                    ELEMENT_COLORS[cardData.element] || "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  {ELEMENT_ICONS[cardData.element]}
                  <span>{localizedElement}</span>
                </span>

                <span
                  className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                    isReversed
                      ? "border-rose-200 bg-rose-50 text-rose-800"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800"
                  }`}
                >
                  {orientationLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Card Back (Face Down) - Luxurious Royal Navy & Gold Filigree */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col items-center justify-center border-2 border-amber-400/90 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] shadow-md overflow-hidden text-amber-300"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Sacred Geometry Mandala Motif */}
            <div className="absolute inset-2 rounded-xl border border-amber-400/40 flex items-center justify-center pointer-events-none">
              <div className="absolute w-24 h-24 rounded-full border border-amber-400/30" />
              <div className="absolute w-16 h-16 rounded-full border border-amber-300/40 rotate-45" />
              <div className="absolute w-10 h-10 rounded-full border border-amber-200/50" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-1.5 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <span className="font-serif text-[11px] font-bold text-amber-200 tracking-widest uppercase">
                Astra Arcana
              </span>
              <p className="text-[10px] text-amber-300/80 mt-1">
                {language === "bn" ? "স্পর্শ করুন" : language === "hi" ? "स्पर्श करें" : "Tap to reveal"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
