/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface TarotFanDeckProps {
  selectedIndices: number[];
  targetCount: number;
  isShuffling: boolean;
  onTogglePick: (deckIndex: number) => void;
  language: "en" | "bn" | "hi";
}

const TOTAL_CARDS = 78;
const ARC_SIZE = 26;

export function TarotFanDeck({
  selectedIndices,
  targetCount,
  isShuffling,
  onTogglePick,
  language,
}: TarotFanDeckProps) {
  // 3 graceful arched tiers of 26 cards each (0..25, 26..51, 52..77) so all 78 cards fan cleanly on any screen
  const [activeTier, setActiveTier] = React.useState<0 | 1 | 2>(0);
  const startIdx = activeTier * ARC_SIZE;

  const tierLabels =
    language === "bn"
      ? ["প্রথম মণ্ডল (১–২৬)", "দ্বিতীয় মণ্ডল (২৭–৫২)", "তৃতীয় মণ্ডল (৫৩–৭৮)"]
      : language === "hi"
      ? ["प्रथम मंडल (1–26)", "द्वितीय मंडल (27–52)", "तृतीय मंडल (53–78)"]
      : ["First Arc (1–26)", "Second Arc (27–52)", "Third Arc (53–78)"];

  return (
    <div
      className={`relative rounded-3xl border border-amber-300/70 bg-gradient-to-b from-[#251216] via-[#170c10] to-[#261414] p-5 sm:p-7 shadow-[0_20px_56px_rgba(36,22,16,0.24)] overflow-hidden transition-all duration-500 ${
        isShuffling ? "scale-[0.985] opacity-65" : "scale-100 opacity-100"
      }`}
    >
      {/* Subtle Celestial Starfield Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 25%, rgba(253,224,71,0.18) 0, transparent 42%), radial-gradient(circle at 82% 30%, rgba(243,148,25,0.16) 0, transparent 38%)",
        }}
      />

      {/* Header & Arc Selector */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-xs text-amber-100/90 font-medium text-center sm:text-left">
          {language === "bn"
            ? `বাঁকা আর্কের কার্ডগুলো স্পর্শ করে আপনার ${targetCount}টি কার্ড বেছে নিন:`
            : language === "hi"
            ? `धनुषाकार पंक्ति से अपने अंतर्ज्ञान से ${targetCount} कार्ड चुनें:`
            : `Sweep across the arched deck and pick ${targetCount} intuitive cards:`}
        </p>

        <div className="inline-flex items-center justify-center gap-1 rounded-full bg-black/40 border border-amber-400/35 p-1">
          <button
            type="button"
            onClick={() => setActiveTier((prev) => ((prev + 2) % 3) as 0 | 1 | 2)}
            aria-label="Previous Deck Arc"
            className="size-7 rounded-full flex items-center justify-center text-amber-200 hover:bg-amber-500/20 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[0, 1, 2].map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier as 0 | 1 | 2)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                activeTier === tier
                  ? "bg-[#f39419] text-stone-950 shadow-xs"
                  : "text-amber-200/80 hover:text-white"
              }`}
            >
              {tierLabels[tier]}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveTier((prev) => ((prev + 1) % 3) as 0 | 1 | 2)}
            aria-label="Next Deck Arc"
            className="size-7 rounded-full flex items-center justify-center text-amber-200 hover:bg-amber-500/20 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Curved Radial Desktop Tarot Fan Stage */}
      <div className="relative z-10 hidden md:flex items-end justify-center h-[296px] pt-8 pb-4 select-none overflow-hidden">
        <div className="relative w-full max-w-[920px] h-[236px]">
          {Array.from({ length: ARC_SIZE }).map((_, localIdx) => {
            const cardIndex = startIdx + localIdx;
            if (cardIndex >= TOTAL_CARDS) return null;

            const pickOrder = selectedIndices.indexOf(cardIndex);
            const isChosen = pickOrder !== -1;

            // Radial parabolic fan curve (-25deg .. +25deg)
            const t = localIdx / (ARC_SIZE - 1);
            const norm = t * 2 - 1;
            const angleDeg = norm * 25;
            const leftPct = 6 + t * 88;
            const arcLiftPx = (1 - norm * norm) * 46;

            return (
              <button
                key={cardIndex}
                type="button"
                onClick={() => onTogglePick(cardIndex)}
                aria-label={`Tarot card ${cardIndex + 1}`}
                style={{
                  left: `${leftPct}%`,
                  bottom: `${18 + arcLiftPx + (isChosen ? 36 : 0)}px`,
                  transform: `translateX(-50%) rotate(${isShuffling ? norm * 6 : angleDeg}deg) scale(${
                    isChosen ? 1.1 : 1
                  })`,
                  zIndex: isChosen ? 40 + pickOrder : localIdx + 1,
                }}
                className={`tarot-pick-card group absolute w-[90px] h-[144px] rounded-xl border-2 origin-bottom cursor-pointer hover:!z-50 hover:-translate-y-7 hover:scale-110 bg-[#1a0b0e] ${
                  isChosen
                    ? "border-amber-300 shadow-[0_14px_32px_rgba(243,148,25,0.65)] ring-2 ring-amber-200/80"
                    : "border-amber-400/75 hover:border-amber-200 shadow-[0_10px_24px_rgba(0,0,0,0.55)]"
                }`}
              >
                <img
                  src="/images/tarot/card-back-fan.webp"
                  alt=""
                  loading="eager"
                  draggable={false}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-200 ${
                    isChosen ? "opacity-90 brightness-110" : "opacity-95 group-hover:brightness-110"
                  }`}
                />
                {isChosen && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-amber-500/25 pointer-events-none"
                  />
                )}

                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-serif font-extrabold transition-transform ${
                      isChosen
                        ? "border-amber-100 bg-[#f39419] text-stone-950 shadow-[0_0_16px_rgba(243,148,25,0.8)] scale-105"
                        : "border-amber-300/70 bg-black/55 text-amber-200 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all"
                    }`}
                  >
                    {isChosen ? pickOrder + 1 : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile / Tablet Curved Swipeable Strip */}
      <div className="relative z-10 md:hidden flex items-end gap-2.5 overflow-x-auto pb-4 pt-6 px-2 snap-x">
        {Array.from({ length: ARC_SIZE }).map((_, localIdx) => {
          const cardIndex = startIdx + localIdx;
          if (cardIndex >= TOTAL_CARDS) return null;
          const pickOrder = selectedIndices.indexOf(cardIndex);
          const isChosen = pickOrder !== -1;

          return (
            <button
              key={cardIndex}
              type="button"
              onClick={() => onTogglePick(cardIndex)}
              aria-label={`Tarot card ${cardIndex + 1}`}
              className={`tarot-pick-card shrink-0 snap-center w-16 h-26 rounded-xl border-2 transition-transform flex flex-col items-center justify-center cursor-pointer relative bg-[#1a0b0e] ${
                isChosen
                  ? "border-amber-300 -translate-y-3 shadow-[0_12px_24px_rgba(243,148,25,0.55)] ring-2 ring-amber-200/75"
                  : "border-amber-400/75 shadow-md"
              }`}
            >
              <img
                src="/images/tarot/card-back-fan.webp"
                alt=""
                loading="lazy"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              {isChosen && (
                <div
                  aria-hidden="true"
                  className="relative z-10 w-6 h-6 rounded-full border border-amber-100 bg-[#f39419] text-stone-950 flex items-center justify-center text-[11px] font-serif font-extrabold shadow-md"
                >
                  {pickOrder + 1}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick selected counter strip */}
      <div className="relative z-10 flex items-center justify-center gap-2 pt-2 text-[11px] text-amber-200/85">
        <span>
          {language === "bn"
            ? `বাছাইকৃত: ${selectedIndices.length} / ${targetCount} · মোট ৭৮ কার্ড (৩টি মণ্ডল)`
            : language === "hi"
            ? `चयनित: ${selectedIndices.length} / ${targetCount} · कुल 78 कार्ड`
            : `Selected: ${selectedIndices.length} / ${targetCount} · Complete 78-Card Arched Deck`}
        </span>
      </div>
    </div>
  );
}
