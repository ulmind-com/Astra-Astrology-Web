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
  Shield,
  Layers,
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
  Fire: <Flame className="w-3.5 h-3.5 text-amber-600" />,
  Water: <Droplets className="w-3.5 h-3.5 text-cyan-600" />,
  Air: <Wind className="w-3.5 h-3.5 text-sky-600" />,
  Earth: <Mountain className="w-3.5 h-3.5 text-emerald-600" />,
  Spirit: <Sparkles className="w-3.5 h-3.5 text-purple-600" />,
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "border-amber-300 bg-amber-50 text-amber-900",
  Water: "border-cyan-300 bg-cyan-50 text-cyan-900",
  Air: "border-sky-300 bg-sky-50 text-sky-900",
  Earth: "border-emerald-300 bg-emerald-50 text-emerald-900",
  Spirit: "border-purple-300 bg-purple-50 text-purple-900",
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

  // Generous luxury proportions so titles, grahas, and symbols NEVER get truncated
  const sizeClasses = {
    sm: "w-48 sm:w-52 h-76 sm:h-84 text-xs",
    md: "w-56 sm:w-60 h-88 sm:h-96 text-sm",
    lg: "w-68 sm:w-72 h-104 text-base",
  }[size];

  if (!cardData) {
    return (
      <div
        className={`${sizeClasses} rounded-2xl border-2 border-dashed border-amber-300 bg-white/90 flex flex-col items-center justify-center p-4 text-center text-slate-400 shadow-xs ${className}`}
      >
        <Sparkles className="w-7 h-7 animate-pulse text-amber-500 mb-2" />
        <span className="text-xs font-semibold">
          {language === "bn"
            ? "কার্ড নির্বাচনের অপেক্ষায়"
            : language === "hi"
            ? "कार्ड चयन प्रतीक्षित"
            : "Awaiting Draw"}
        </span>
      </div>
    );
  }

  const localizedName =
    CARD_NAMES_LOCALIZED[language]?.[cardData.id] || cardData.name;
  const localizedElement =
    ELEMENTS_LOCALIZED[language]?.[cardData.element] || cardData.element;

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
      {/* Position Header above the Card */}
      {showPositionHeader && cardDetail && (
        <div className="mb-3 text-center max-w-[220px]">
          <span className="inline-block text-[11px] font-bold tracking-wider text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
            {cardDetail.position_title}
          </span>
          <p className="text-[11px] text-slate-600 font-semibold mt-1 leading-snug">
            {cardDetail.position_role}
          </p>
        </div>
      )}

      {/* 3D Flip Card Container with Luxury Gold Card Frame */}
      <div
        onClick={onFlip}
        className={`${sizeClasses} relative cursor-pointer group`}
        style={{ perspective: "1400px" }}
      >
        <div
          className="w-full h-full duration-700 transition-all rounded-2xl shadow-md hover:shadow-2xl relative"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >
          {/* Card Front (Face Up) - Authentic Luxury Ivory & Gold Parchment */}
          <div
            className={`absolute inset-0 w-full h-full rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden border-2 border-amber-400 bg-gradient-to-b from-white via-amber-50/30 to-amber-100/20 shadow-md ${
              isReversed ? "border-amber-500" : ""
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Ornate Inner Gold Filigree Borders */}
            <div className="absolute inset-1.5 rounded-xl border border-amber-400/60 pointer-events-none" />
            <div className="absolute inset-2.5 rounded-lg border border-dashed border-amber-300/40 pointer-events-none" />

            {/* Corner Filigree Flourishes */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500 rounded-tl" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500 rounded-tr" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500 rounded-bl" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500 rounded-br" />

            {/* Top Bar: Arcana/Suit Badge & Vedic Graha */}
            <div className="flex items-center justify-between z-10 gap-1">
              <span className="text-[10px] font-serif font-bold text-amber-950 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded shadow-2xs">
                {cardData.arcana === "major"
                  ? `Arcana ${cardData.number}`
                  : `${cardData.suit?.toUpperCase()} ${cardData.number}`}
              </span>

              {cardData.vedic_graha && (
                <span className="text-[10px] font-bold text-amber-950 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs whitespace-nowrap">
                  <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                  <span>{cardData.vedic_graha}</span>
                </span>
              )}
            </div>

            {/* Center Sacred Tableau / Archetype Artwork Area */}
            <div className="flex-1 flex flex-col items-center justify-center my-2 relative z-10">
              {/* Outer Radiant Glow */}
              <div
                className={`absolute w-28 h-28 rounded-full blur-xl opacity-35 ${
                  cardData.element === "Fire"
                    ? "bg-amber-400"
                    : cardData.element === "Water"
                    ? "bg-cyan-400"
                    : cardData.element === "Air"
                    ? "bg-sky-300"
                    : "bg-emerald-400"
                }`}
              />

              {/* Archetype Sacred Emblem Tableau with Gold Frame */}
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center shadow-md transform transition-transform group-hover:scale-105 relative ${
                  isReversed ? "rotate-180" : ""
                }`}
              >
                {/* Inner corner flourishes on tableau */}
                <div className="absolute inset-1 rounded-xl border border-amber-300/40 pointer-events-none" />

                {cardData.arcana === "major" ? (
                  <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 drop-shadow-sm" />
                ) : cardData.suit === "wands" ? (
                  <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-amber-600 drop-shadow-sm" />
                ) : cardData.suit === "cups" ? (
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-600 drop-shadow-sm" />
                ) : cardData.suit === "swords" ? (
                  <Wind className="w-10 h-10 sm:w-12 sm:h-12 text-sky-600 drop-shadow-sm" />
                ) : (
                  <CircleDot className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 drop-shadow-sm" />
                )}
              </div>

              {/* Reversed indicator seal */}
              {isReversed && (
                <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <RotateCw className="w-2.5 h-2.5 rotate-180" />
                  <span>
                    {language === "bn" ? "উল্টো" : language === "hi" ? "उल्टा" : "Reversed"}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Section: Name, Astrological Sign, Element & Orientation */}
            <div className="z-10 text-center">
              <h4 className="font-serif font-bold text-slate-950 text-xs sm:text-sm tracking-wide leading-tight group-hover:text-amber-800 transition-colors">
                {localizedName}
              </h4>
              <p className="text-[10px] text-slate-600 font-semibold mt-1 leading-tight">
                {cardData.astrology}
              </p>

              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                <span
                  className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 shadow-2xs ${
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

          {/* Card Back (Face Down) - Royal Midnight Navy with Radiant Gold Filigree */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-4 flex flex-col items-center justify-center border-2 border-amber-400 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] shadow-md overflow-hidden text-amber-300"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {/* Sacred Geometry Mandala Motif */}
            <div className="absolute inset-2.5 rounded-xl border border-amber-400/40 flex items-center justify-center pointer-events-none">
              <div className="absolute w-28 h-28 rounded-full border border-amber-400/30" />
              <div className="absolute w-20 h-20 rounded-full border border-amber-300/40 rotate-45" />
              <div className="absolute w-12 h-12 rounded-full border border-amber-200/50" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-2 shadow-sm">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <span className="font-serif text-xs font-bold text-amber-200 tracking-widest uppercase">
                Astra Arcana
              </span>
              <p className="text-[10px] text-amber-300/90 font-medium mt-1">
                {language === "bn" ? "স্পর্শ করুন" : language === "hi" ? "स्पर्श करें" : "Tap to reveal"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
