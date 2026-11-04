"use client";

import * as React from "react";
import type { DrawnCardDetail } from "@/types/tarot";
import { TarotCardView } from "./tarot-card-view";

interface TarotSpreadLayoutProps {
  spreadId: string;
  cards: DrawnCardDetail[];
  flippedState: boolean[];
  onFlipCard: (index: number) => void;
  onSelectCardDetail?: (card: DrawnCardDetail) => void;
}

export function TarotSpreadLayout({
  spreadId,
  cards,
  flippedState,
  onFlipCard,
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
        {/* Connecting celestial energy beam */}
        <div className="hidden md:block absolute top-[45%] left-16 right-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent -z-0 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center justify-items-center">
          {cards.map((c, idx) => (
            <div key={idx} className="relative z-10">
              <TarotCardView
                cardDetail={c}
                isFlipped={flippedState[idx] ?? true}
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
      <div className="py-6 flex flex-col items-center gap-6">
        {/* Top: Final Resolution */}
        <div>
          <TarotCardView
            cardDetail={cards[3]}
            isFlipped={flippedState[3] ?? true}
            onFlip={() => {
              onFlipCard(3);
              onSelectCardDetail?.(cards[3]);
            }}
            size="sm"
          />
        </div>

        {/* Middle: Choice A and Choice B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
          <TarotCardView
            cardDetail={cards[1]}
            isFlipped={flippedState[1] ?? true}
            onFlip={() => {
              onFlipCard(1);
              onSelectCardDetail?.(cards[1]);
            }}
            size="sm"
          />
          <TarotCardView
            cardDetail={cards[2]}
            isFlipped={flippedState[2] ?? true}
            onFlip={() => {
              onFlipCard(2);
              onSelectCardDetail?.(cards[2]);
            }}
            size="sm"
          />
        </div>

        {/* Bottom: Current Root */}
        <div>
          <TarotCardView
            cardDetail={cards[0]}
            isFlipped={flippedState[0] ?? true}
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

  // 5-card layout (Love / Career)
  if (cards.length === 5) {
    return (
      <div className="py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 justify-items-center items-center">
          {cards.map((c, idx) => (
            <TarotCardView
              key={idx}
              cardDetail={c}
              isFlipped={flippedState[idx] ?? true}
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

  // Grand Celtic Cross (10 cards) or general multi-card layout
  return (
    <div className="py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
        {cards.map((c, idx) => (
          <TarotCardView
            key={idx}
            cardDetail={c}
            isFlipped={flippedState[idx] ?? true}
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

