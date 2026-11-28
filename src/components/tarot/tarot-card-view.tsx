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

const ELEMENT_WARM_STYLES: Record<string, string> = {
  Fire: "border-orange-200 bg-orange-50 text-orange-950",
  Water: "border-sky-200 bg-sky-50 text-sky-950",
  Air: "border-indigo-200 bg-indigo-50 text-indigo-950",
  Earth: "border-emerald-200 bg-emerald-50 text-emerald-950",
  Spirit: "border-purple-200 bg-purple-50 text-purple-950",
};

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="w-3 h-3 text-orange-600 shrink-0" />,
  Water: <Droplets className="w-3 h-3 text-sky-600 shrink-0" />,
  Air: <Wind className="w-3 h-3 text-indigo-600 shrink-0" />,
  Earth: <Mountain className="w-3 h-3 text-emerald-600 shrink-0" />,
  Spirit: <Sparkles className="w-3 h-3 text-purple-600 shrink-0" />,
};

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

    const angle = 115 + (s.gx - 50) * 0.5;

    el.style.setProperty("--rx", `${s.rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${s.ry.toFixed(2)}deg`);
    el.style.setProperty("--cs", s.active ? "1.03" : "1");
    el.style.setProperty("--gx", `${s.gx.toFixed(1)}%`);
    el.style.setProperty("--gy", `${s.gy.toFixed(1)}%`);
    el.style.setProperty("--foil-x", `${((s.gx - 50) * 0.45).toFixed(2)}%`);
    el.style.setProperty("--foil-y", `${((s.gy - 50) * 0.45).toFixed(2)}%`);
    el.style.setProperty("--foil-angle", `${angle.toFixed(1)}deg`);
    el.style.setProperty("--glare-op", s.active ? "1" : "0");
    el.style.setProperty("--halo-op", s.active ? "1" : "0");

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
      el.style.setProperty("--halo-op", "0");
      el.removeAttribute("data-active");
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

    if (tiltRef.current) {
      tiltRef.current.setAttribute("data-active", "true");
    }

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

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const px = Math.min(1, Math.max(0, (touch.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (touch.clientY - rect.top) / rect.height));

    const s = animStateRef.current;
    s.active = true;
    s.tx = (0.5 - py) * 20;
    s.ty = (px - 0.5) * 20;
    s.tgx = px * 100;
    s.tgy = py * 100;

    if (tiltRef.current) {
      tiltRef.current.setAttribute("data-active", "true");
    }

    if (!s.rafId) {
      s.rafId = window.requestAnimationFrame(runSpringLoop);
    }
  };

  const handleTouchEnd = () => {
    const s = animStateRef.current;
    s.active = false;
    s.tx = 0;
    s.ty = 0;
    s.tgx = 50;
    s.tgy = 50;
    if (tiltRef.current) {
      tiltRef.current.removeAttribute("data-active");
    }
    if (!s.rafId) {
      s.rafId = window.requestAnimationFrame(runSpringLoop);
    }
  };

  const cardSizes = {
    sm: "w-48 sm:w-52 h-[330px] sm:h-[358px]",
    md: "w-56 sm:w-60 h-[386px] sm:h-[412px]",
    lg: "w-64 sm:w-68 h-[440px] sm:h-[468px]",
  }[size];

  if (!cardData) {
    return (
      <div
        className={`${cardSizes} rounded-2xl border-2 border-dashed border-amber-300/80 bg-white/90 flex flex-col items-center justify-center p-4 text-center text-stone-500 shadow-xs ${className}`}
      >
        <Sparkles className="w-7 h-7 animate-pulse text-amber-500 mb-2" />
        <span className="text-xs font-serif font-bold text-amber-950">
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
        <div className="mb-2.5 text-center max-w-[240px]">
          <span className="inline-block text-[11px] font-bold tracking-wider text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-0.5 rounded-full shadow-2xs">
            {cardDetail.position_title}
          </span>
          <p className="text-[11px] text-stone-600 font-semibold mt-1 leading-snug">
            {cardDetail.position_role}
          </p>
        </div>
      )}

      {/* 3D Interactive Pointer-Tracking Physical Tarot Card Stage */}
      <div
        onClick={onFlip}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`${cardSizes} tarot-3d-stage relative cursor-pointer group hover:z-20`}
      >
        <div ref={tiltRef} className="tarot-3d-tilt tarot-idle-float">
          <div
            className="tarot-3d-flipper"
            data-flipped={isFlipped ? "true" : "false"}
          >
            {/* ==================== FRONT FACE (Authentic 24K Gilded Vellum Card & Heroic Artwork) ==================== */}
            <div className="tarot-3d-face flex flex-col items-center justify-center bg-transparent">
              {/* Clipped Specular Glare + Holographic Prismatic Iridescent Foil */}
              <div className="tarot-3d-clip">
                <div className="tarot-3d-foil" />
                <div className="tarot-3d-glare" />
              </div>

              {/* Full Bleed Physical Tarot Card Artwork */}
              <TarotIllustration card={cardData} isReversed={isReversed} />

              {/* If Reversed: subtle indicator pill floating at bottom of card */}
              {isReversed && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 text-[10px] font-bold text-rose-900 bg-rose-50/95 border border-rose-300 px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                  <RotateCw className="w-2.5 h-2.5 rotate-180" />
                  <span>
                    {language === "bn" ? "উল্টো" : language === "hi" ? "उल्टा" : "Reversed"}
                  </span>
                </div>
              )}
            </div>

            {/* ==================== BACK FACE (Royal Burgundy Velvet & 24K Gold Mandala Back) ==================== */}
            <div className="tarot-3d-face tarot-3d-face--back overflow-hidden rounded-2xl border-2 border-[#e0b44a] bg-[#1a080d] shadow-lg flex items-center justify-center">
              <img
                src="/images/tarot/card-back.webp"
                alt=""
                loading="lazy"
                draggable={false}
                className="tarot-art-breath absolute inset-0 w-full h-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"
              />
              <div className="tarot-3d-clip">
                <div className="tarot-3d-foil" />
                <div className="tarot-3d-glare" />
              </div>

              <div className="tarot-z-crest relative z-10 flex flex-col items-center text-center px-3.5 py-2.5 rounded-2xl bg-[#12080e]/85 backdrop-blur-sm border border-[#d4af37]/45 shadow-[0_8px_28px_rgba(0,0,0,0.7)]">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse mb-1" />
                <span className="font-serif text-[11px] font-bold text-[#fae8b2] tracking-[0.2em] uppercase">
                  DivinLink
                </span>
                <p className="text-[10px] text-[#d4ba94]/90 font-medium mt-0.5">
                  {language === "bn" ? "স্পর্শ করুন" : language === "hi" ? "স্পর্শ करें" : "Tap to reveal"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== ELEGANT SANCTUARY TYPOGRAPHY & METADATA (Below the Card) ==================== */}
      <div className="mt-3 text-center max-w-[230px] w-full px-1">
        {/* Bengali Title */}
        <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base tracking-wide leading-tight group-hover:text-amber-700 transition-colors">
          {title}
        </h4>

        {/* Spiritual Subtitle */}
        {subtitle && (
          <p className="text-xs sm:text-[13px] font-serif italic text-amber-900/80 mt-0.5 leading-snug">
            {subtitle}
          </p>
        )}

        {/* Astrological Ruler / Sign */}
        {cardData.astrology && cardData.astrology !== subtitle && (
          <p className="text-[10px] tracking-wider uppercase text-stone-500 font-medium mt-0.5">
            {cardData.astrology}
          </p>
        )}

        {/* Warm Sanctuary Micro-tags Row */}
        <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
          {cardData.vedic_graha && (
            <span className="text-[10px] font-bold text-amber-950 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs whitespace-nowrap">
              <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-amber-600 shrink-0" />
              <span>{cardData.vedic_graha}</span>
            </span>
          )}

          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold inline-flex items-center gap-1 shadow-2xs whitespace-nowrap ${
              ELEMENT_WARM_STYLES[cardData.element] || "border-amber-200 bg-amber-50 text-amber-950"
            }`}
          >
            {ELEMENT_ICONS[cardData.element]}
            <span>{localizedElement}</span>
          </span>

          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold whitespace-nowrap shadow-2xs ${
              isReversed
                ? "border-rose-300 bg-rose-50 text-rose-900"
                : "border-emerald-300 bg-emerald-50 text-emerald-900"
            }`}
          >
            {orientationLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
