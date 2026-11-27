/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";
import {
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  RotateCw,
} from "lucide-react";
import type { DrawnCardDetail, TarotCard } from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { CARD_NAMES_LOCALIZED, ELEMENTS_LOCALIZED } from "@/lib/tarot-translations";

import { TarotIllustration } from "./tarot-illustrations";
import "./tarot-card-3d.css";

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

const ELEMENT_JEWELED_STYLES: Record<string, string> = {
  Fire: "border-amber-500/50 text-amber-300 bg-amber-950/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
  Water: "border-sky-500/50 text-sky-300 bg-sky-950/40 shadow-[0_0_8px_rgba(14,165,233,0.2)]",
  Air: "border-indigo-400/50 text-indigo-200 bg-indigo-950/40 shadow-[0_0_8px_rgba(99,102,241,0.2)]",
  Earth: "border-emerald-500/50 text-emerald-300 bg-emerald-950/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
  Spirit: "border-purple-400/50 text-purple-200 bg-purple-950/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]",
};

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="w-3 h-3 text-amber-400 shrink-0" />,
  Water: <Droplets className="w-3 h-3 text-sky-400 shrink-0" />,
  Air: <Wind className="w-3 h-3 text-indigo-300 shrink-0" />,
  Earth: <Mountain className="w-3 h-3 text-emerald-400 shrink-0" />,
  Spirit: <Sparkles className="w-3 h-3 text-purple-300 shrink-0" />,
};

const ROMAN_NUMERALS = [
  "0",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
];

function parseCardTitleAndSubtitle(rawName: string, card: TarotCard) {
  const match = rawName.match(/^(.*?)\s*[\(（](.*?)[\)）]$/);
  if (match) {
    return {
      title: match[1].trim(),
      subtitle: match[2].trim(),
    };
  }
  return {
    title: rawName,
    subtitle: card.astrology || "",
  };
}

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

  const tiltRef = React.useRef<HTMLDivElement>(null);
  const animStateRef = React.useRef({
    rx: 0,
    ry: 0,
    tx: 0,
    ty: 0,
    gx: 50,
    gy: 50,
    tgx: 50,
    tgy: 50,
    active: false,
    rafId: 0,
  });

  const runSpringLoop = React.useCallback(() => {
    const el = tiltRef.current;
    const s = animStateRef.current;
    if (!el) {
      s.rafId = 0;
      return;
    }

    const lerp = s.active ? 0.18 : 0.11;
    s.rx += (s.tx - s.rx) * lerp;
    s.ry += (s.ty - s.ry) * lerp;
    s.gx += (s.tgx - s.gx) * lerp;
    s.gy += (s.tgy - s.gy) * lerp;

    el.style.setProperty("--rx", `${s.rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${s.ry.toFixed(2)}deg`);
    el.style.setProperty("--cs", s.active ? "1.03" : "1");
    el.style.setProperty("--gx", `${s.gx.toFixed(1)}%`);
    el.style.setProperty("--gy", `${s.gy.toFixed(1)}%`);
    el.style.setProperty("--foil-x", `${((s.gx - 50) * 0.45).toFixed(2)}%`);
    el.style.setProperty("--foil-y", `${((s.gy - 50) * 0.45).toFixed(2)}%`);
    el.style.setProperty("--glare-op", s.active ? "1" : "0");

    const settled =
      !s.active &&
      Math.abs(s.rx) < 0.04 &&
      Math.abs(s.ry) < 0.04 &&
      Math.abs(s.gx - 50) < 0.25 &&
      Math.abs(s.gy - 50) < 0.25;

    if (settled) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--cs", "1");
      el.style.setProperty("--glare-op", "0");
      s.rafId = 0;
      return;
    }

    s.rafId = window.requestAnimationFrame(runSpringLoop);
  }, []);

  React.useEffect(() => {
    return () => {
      if (animStateRef.current.rafId) {
        window.cancelAnimationFrame(animStateRef.current.rafId);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

    const s = animStateRef.current;
    s.active = true;
    s.tx = (0.5 - py) * 20;
    s.ty = (px - 0.5) * 20;
    s.tgx = px * 100;
    s.tgy = py * 100;

    if (!s.rafId) {
      s.rafId = window.requestAnimationFrame(runSpringLoop);
    }
  };

  const handlePointerLeave = () => {
    const s = animStateRef.current;
    s.active = false;
    s.tx = 0;
    s.ty = 0;
    s.tgx = 50;
    s.tgy = 50;
    if (!s.rafId) {
      s.rafId = window.requestAnimationFrame(runSpringLoop);
    }
  };

  const sizeClasses = {
    sm: "w-52 sm:w-56 h-[400px] sm:h-[424px] text-xs",
    md: "w-56 sm:w-64 h-[444px] sm:h-[472px] text-sm",
    lg: "w-68 sm:w-72 h-[492px] sm:h-[516px] text-base",
  }[size];

  if (!cardData) {
    return (
      <div
        className={`${sizeClasses} rounded-2xl border border-dashed border-[#d4af37]/40 bg-[#120910]/90 flex flex-col items-center justify-center p-4 text-center text-[#d4ba94] shadow-xs ${className}`}
      >
        <Sparkles className="w-7 h-7 animate-pulse text-[#f39419] mb-2" />
        <span className="text-xs font-serif font-semibold text-[#fae8b2]">
          {language === "bn"
            ? "কার্ড নির্বাচনের অপেক্ষায়"
            : language === "hi"
            ? "कार्ड चयन प्रतीक्षित"
            : "Awaiting Draw"}
        </span>
      </div>
    );
  }

  const rawLocalizedName = CARD_NAMES_LOCALIZED[language]?.[cardData.id] || cardData.name;
  const { title, subtitle } = parseCardTitleAndSubtitle(rawLocalizedName, cardData);
  const localizedElement = ELEMENTS_LOCALIZED[language]?.[cardData.element] || cardData.element;

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
        <div className="mb-3 text-center max-w-[240px]">
          <span className="inline-block text-[11px] font-serif font-bold tracking-wider text-[#fae8b2] bg-[#1a0f18]/90 border border-[#d4af37]/40 px-3 py-1 rounded-full shadow-xs">
            {cardDetail.position_title}
          </span>
          <p className="text-[11px] text-[#d4ba94] font-medium mt-1 leading-snug">
            {cardDetail.position_role}
          </p>
        </div>
      )}

      {/* 3D Interactive Pointer-Tracking Card Container */}
      <div
        onClick={onFlip}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`${sizeClasses} tarot-3d-stage relative cursor-pointer group hover:z-20`}
      >
        <div ref={tiltRef} className="tarot-3d-tilt">
          <div
            className="tarot-3d-flipper"
            data-flipped={isFlipped ? "true" : "false"}
          >
            {/* ==================== FRONT FACE (Museum-Grade Midnight Temple Velvet + 24K Gold) ==================== */}
            <div
              className={`tarot-3d-face p-3 sm:p-3.5 flex flex-col justify-between border bg-[radial-gradient(130%_120%_at_50%_0%,#22131e_0%,#120910_52%,#080306_100%)] ${
                isReversed ? "border-rose-500/50" : "border-[#e2b755]/45"
              }`}
            >
              {/* Clipped Specular Glare + Holographic Gold Foil */}
              <div className="tarot-3d-clip">
                <div className="tarot-3d-foil" />
                <div className="tarot-3d-glare" />
              </div>

              {/* Dual 24K Gold Foil Hairline Border */}
              <div className="tarot-z-frame absolute inset-1.5 rounded-xl border border-[#d4af37]/28 pointer-events-none" />

              {/* Celestial 4-Point Gold Star Corner Pips */}
              <span className="tarot-z-frame absolute top-2 left-2 text-[#d4af37]/65 text-[8px] leading-none pointer-events-none select-none">
                ✦
              </span>
              <span className="tarot-z-frame absolute top-2 right-2 text-[#d4af37]/65 text-[8px] leading-none pointer-events-none select-none">
                ✦
              </span>
              <span className="tarot-z-frame absolute bottom-2 left-2 text-[#d4af37]/65 text-[8px] leading-none pointer-events-none select-none">
                ✦
              </span>
              <span className="tarot-z-frame absolute bottom-2 right-2 text-[#d4af37]/65 text-[8px] leading-none pointer-events-none select-none">
                ✦
              </span>

              {/* Imperial Crest Header (Z-Plane 18px) */}
              <div className="tarot-z-mid flex items-center justify-between px-1 pt-0.5 pb-1 relative z-10">
                <span className="font-cinzel text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-[#c8a97e]/80 truncate max-w-[90px]">
                  {cardData.arcana === "major" ? "Major Arcana" : (cardData.suit || "Minor")}
                </span>

                <div className="flex items-center gap-1">
                  <span className="font-cinzel font-bold text-xs sm:text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#fae8b2] via-[#f7d070] to-[#d4af37] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    {cardData.arcana === "major"
                      ? ROMAN_NUMERALS[cardData.number] ?? cardData.number
                      : cardData.number}
                  </span>
                </div>

                {cardData.vedic_graha ? (
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-medium tracking-wide text-[#f0cb7e]/90 bg-[#1f121a]/70 px-2 py-0.5 rounded-full border border-[#d4af37]/25 shadow-2xs whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-[#f39419] shrink-0" />
                    <span>{cardData.vedic_graha}</span>
                  </div>
                ) : (
                  <div className="w-10" />
                )}
              </div>

              {/* Center Painted Rider-Waite Artwork Window (Z-Plane 28px) */}
              <div className="tarot-z-hero flex-1 flex flex-col my-1.5 relative z-10 min-h-0">
                <div className="relative flex-1 w-full min-h-[120px] rounded-xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <TarotIllustration card={cardData} isReversed={isReversed} />
                </div>

                {isReversed && (
                  <div className="self-center -mt-2.5 z-20 flex items-center gap-1 text-[9px] font-bold text-rose-300 bg-rose-950/90 border border-rose-500/40 px-2.5 py-0.5 rounded-full shadow-xs">
                    <RotateCw className="w-2.5 h-2.5 rotate-180" />
                    <span>
                      {language === "bn" ? "উল্টো" : language === "hi" ? "उल्टा" : "Reversed"}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Typographic Hierarchy & Jeweled Micro-tags (Z-Plane 18px) */}
              <div className="tarot-z-mid relative z-10 text-center px-1 pb-0.5">
                <h4 className="font-serif font-bold text-xs sm:text-sm tracking-wide leading-tight truncate text-transparent bg-clip-text bg-gradient-to-b from-[#fffaf0] via-[#fdefcc] to-[#dfba6f] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {title}
                </h4>

                {subtitle && (
                  <p className="text-[10px] sm:text-[11px] font-serif italic text-[#d4ba94] mt-0.5 leading-snug truncate">
                    {subtitle}
                  </p>
                )}

                {cardData.astrology && cardData.astrology !== subtitle && (
                  <p className="text-[9px] tracking-[0.14em] uppercase text-[#9c8266] font-medium mt-0.5 truncate">
                    {cardData.astrology}
                  </p>
                )}

                {/* Micro-tags: Element & Orientation */}
                <div className="mt-1.5 flex items-center justify-center gap-1.5 flex-nowrap">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full border font-medium inline-flex items-center gap-1 shadow-2xs whitespace-nowrap ${
                      ELEMENT_JEWELED_STYLES[cardData.element] || "border-[#d4af37]/30 text-[#d4ba94] bg-[#150c12]/80"
                    }`}
                  >
                    {ELEMENT_ICONS[cardData.element]}
                    <span>{localizedElement}</span>
                  </span>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap shadow-2xs ${
                      isReversed
                        ? "border-rose-500/40 text-rose-300 bg-rose-950/40"
                        : "border-emerald-500/40 text-emerald-300 bg-emerald-950/40"
                    }`}
                  >
                    {orientationLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* ==================== BACK FACE (Royal Burgundy Velvet & 24K Gold Mandala Back) ==================== */}
            <div className="tarot-3d-face tarot-3d-face--back overflow-hidden border border-[#d4af37]/50 bg-[#12080e] shadow-lg flex items-center justify-center">
              <img
                src="/images/tarot/card-back.webp"
                alt=""
                loading="lazy"
                draggable={false}
                className="tarot-art-breath absolute inset-0 w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/65 pointer-events-none"
              />
              <div className="tarot-3d-clip">
                <div className="tarot-3d-foil" />
                <div className="tarot-3d-glare" />
              </div>

              <div className="tarot-z-hero relative z-10 flex flex-col items-center text-center px-3.5 py-2.5 rounded-2xl bg-[#12080e]/85 backdrop-blur-sm border border-[#d4af37]/45 shadow-[0_8px_28px_rgba(0,0,0,0.7)]">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse mb-1" />
                <span className="font-serif text-[11px] font-bold text-[#fae8b2] tracking-[0.2em] uppercase">
                  DivinLink
                </span>
                <p className="text-[10px] text-[#d4ba94]/90 font-medium mt-0.5">
                  {language === "bn" ? "স্পর্শ করুন" : language === "hi" ? "स्पर्श करें" : "Tap to reveal"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
