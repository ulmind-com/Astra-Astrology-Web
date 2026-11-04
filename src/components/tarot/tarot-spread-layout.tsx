"use client";

import * as React from "react";
import type { DrawnCardDetail } from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { TarotCardView } from "./tarot-card-view";

interface TarotSpreadLayoutProps {
  spreadId: string;
  cards: DrawnCardDetail[];
  flippedState: boolean[];
  onFlipCard: (index: number) => void;
  language?: AstrologyLanguage;
  onSelectCardDetail?: (card: DrawnCardDetail) => void;
}

export function TarotSpreadLayout({
  spreadId,
  cards,
  flippedState,
  onFlipCard,
  language = "bn",
  onSelectCardDetail,
}: TarotSpreadLayoutProps) {
  if (!cards || cards.length === 0) return null;

  // Single card layout (Daily guidance)
  if (cards.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <TarotCardView
          cardDetail={cards[0]}
          isFlipped={flippedState[0] ?? true}
          language={language}
          onFlip={() => {
            onFlipCard(0);
            onSelectCardDetail?.(cards[0]);
          }}
          size="lg"
        />
      </div>
    );
  }

  // 3-card layout (Past - Present - Future)
  if (spreadId === "past_present_future" || cards.length === 3) {
    return (
      <div className="relative py-6">
        {/* Golden connecting celestial beam */}
        <div className="hidden md:block absolute top-[45%] left-16 right-16 h-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent -z-0 pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center justify-items-center">
          {cards.map((c, idx) => (
            <div key={idx} className="relative z-10">
              <TarotCardView
                cardDetail={c}
                isFlipped={flippedState[idx] ?? true}
                language={language}
                onFlip={() => {
                  onFlipCard(idx);
                  onSelectCardDetail?.(c);
                }}
                size="md"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4-card Crossroad layout (Two choices)
  if (spreadId === "two_choices" && cards.length === 4) {
    return (
      <div className="py-6 flex flex-col items-center gap-8">
        {/* Top: Final Harmonizing Guidance */}
        <div>
          <TarotCardView
            cardDetail={cards[3]}
            isFlipped={flippedState[3] ?? true}
            language={language}
            onFlip={() => {
              onFlipCard(3);
              onSelectCardDetail?.(cards[3]);
            }}
            size="sm"
          />
        </div>

        {/* Middle: Path A and Path B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-center">
          <TarotCardView
            cardDetail={cards[1]}
            isFlipped={flippedState[1] ?? true}
            language={language}
            onFlip={() => {
              onFlipCard(1);
              onSelectCardDetail?.(cards[1]);
            }}
            size="sm"
          />
          <TarotCardView
            cardDetail={cards[2]}
            isFlipped={flippedState[2] ?? true}
            language={language}
            onFlip={() => {
              onFlipCard(2);
              onSelectCardDetail?.(cards[2]);
            }}
            size="sm"
          />
        </div>

        {/* Bottom: Current Root Situation */}
        <div>
          <TarotCardView
            cardDetail={cards[0]}
            isFlipped={flippedState[0] ?? true}
            language={language}
            onFlip={() => {
              onFlipCard(0);
              onSelectCardDetail?.(cards[0]);
            }}
            size="sm"
          />
        </div>
      </div>
    );
  }

  // 5-card layout (Career / Love)
  if (cards.length === 5) {
    return (
      <div className="py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 justify-items-center items-start">
          {cards.map((c, idx) => (
            <TarotCardView
              key={idx}
              cardDetail={c}
              isFlipped={flippedState[idx] ?? true}
              language={language}
              onFlip={() => {
                onFlipCard(idx);
                onSelectCardDetail?.(c);
              }}
              size="sm"
            />
          ))}
        </div>
      </div>
    );
  }

  // Grand Celtic Cross (10 cards)
  return (
    <div className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center items-start">
        {cards.map((c, idx) => (
          <TarotCardView
            key={idx}
            cardDetail={c}
            isFlipped={flippedState[idx] ?? true}
            language={language}
            onFlip={() => {
              onFlipCard(idx);
              onSelectCardDetail?.(c);
            }}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
