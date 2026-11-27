"use client";

import * as React from "react";
import {
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Star,
  RotateCw,
  Crown,
  Heart,
  CircleDot,
  Sun,
  Moon,
  Compass,
  Scale,
  Orbit,
  Eye,
  BookOpen,
  Shield,
  Hourglass,
  Zap,
  Globe,
  Feather,
  Gem,
  KeyRound,
} from "lucide-react";
import type { DrawnCardDetail, TarotCard } from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { CARD_NAMES_LOCALIZED, ELEMENTS_LOCALIZED } from "@/lib/tarot-translations";

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

const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  Fire: <Flame className="w-3.5 h-3.5 text-amber-600" />,
  Water: <Droplets className="w-3.5 h-3.5 text-cyan-700" />,
  Air: <Wind className="w-3.5 h-3.5 text-sky-700" />,
  Earth: <Mountain className="w-3.5 h-3.5 text-emerald-700" />,
  Spirit: <Sparkles className="w-3.5 h-3.5 text-amber-700" />,
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "border-amber-300 bg-amber-50 text-amber-900",
  Water: "border-cyan-300 bg-cyan-50 text-cyan-900",
  Air: "border-sky-300 bg-sky-50 text-sky-900",
  Earth: "border-emerald-300 bg-emerald-50 text-emerald-900",
  Spirit: "border-amber-300 bg-amber-50 text-amber-950",
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

function formatArcanaCrest(card: TarotCard): string {
  if (card.arcana === "major") {
    const roman = ROMAN_NUMERALS[card.number] ?? String(card.number);
    return `${roman} · MAJOR`;
  }
  const suitLabel = (card.suit || "MINOR").toUpperCase();
  return `${suitLabel} · ${card.number}`;
}

function renderCardEmblem(card: TarotCard) {
  const cls = "w-9 h-9 sm:w-11 sm:h-11 drop-shadow-xs";
  if (card.arcana === "major") {
    const num = card.number;
    switch (num) {
      case 0:
        return <Feather className={`${cls} text-sky-700`} />;
      case 1:
        return <Sparkles className={`${cls} text-amber-600`} />;
      case 2:
        return <Moon className={`${cls} text-indigo-700`} />;
      case 3:
        return <Gem className={`${cls} text-emerald-700`} />;
      case 4:
        return <Crown className={`${cls} text-amber-700`} />;
      case 5:
        return <KeyRound className={`${cls} text-amber-800`} />;
      case 6:
        return <Heart className={`${cls} text-rose-600`} />;
      case 7:
        return <Compass className={`${cls} text-amber-700`} />;
      case 8:
        return <Flame className={`${cls} text-orange-600`} />;
      case 9:
        return <Eye className={`${cls} text-amber-800`} />;
      case 10:
        return <Orbit className={`${cls} text-amber-600`} />;
      case 11:
        return <Scale className={`${cls} text-amber-800`} />;
      case 12:
        return <Hourglass className={`${cls} text-sky-700`} />;
      case 13:
        return <Shield className={`${cls} text-stone-700`} />;
      case 14:
        return <Droplets className={`${cls} text-cyan-700`} />;
      case 15:
        return <Zap className={`${cls} text-rose-700`} />;
      case 16:
        return <Zap className={`${cls} text-amber-600`} />;
      case 17:
        return <Star className={`${cls} text-sky-600`} />;
      case 18:
        return <Moon className={`${cls} text-cyan-800`} />;
      case 19:
        return <Sun className={`${cls} text-amber-600`} />;
      case 20:
        return <BookOpen className={`${cls} text-amber-700`} />;
      case 21:
        return <Globe className={`${cls} text-emerald-700`} />;
      default:
        return <Crown className={`${cls} text-amber-700`} />;
    }
  }
  if (card.suit === "wands") return <Flame className={`${cls} text-amber-600`} />;
  if (card.suit === "cups") return <Heart className={`${cls} text-cyan-700`} />;
  if (card.suit === "swords") return <Wind className={`${cls} text-sky-700`} />;
  return <CircleDot className={`${cls} text-emerald-700`} />;
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
    sm: "w-48 sm:w-52 h-76 sm:h-84 text-xs",
    md: "w-56 sm:w-60 h-88 sm:h-96 text-sm",
    lg: "w-68 sm:w-72 h-104 text-base",
  }[size];

  if (!cardData) {
    return (
      <div
        className={`${sizeClasses} rounded-2xl border-2 border-dashed border-amber-300 bg-white/90 flex flex-col items-center justify-center p-4 text-center text-stone-400 shadow-xs ${className}`}
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

  const localizedName = CARD_NAMES_LOCALIZED[language]?.[cardData.id] || cardData.name;
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

  const auraGlowClass =
    cardData.element === "Fire"
      ? "bg-amber-400"
      : cardData.element === "Water"
      ? "bg-cyan-400"
      : cardData.element === "Air"
      ? "bg-sky-300"
      : "bg-emerald-400";

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Position Header above the Card */}
      {showPositionHeader && cardDetail && (
        <div className="mb-3 text-center max-w-[230px]">
          <span className="inline-block text-[11px] font-bold tracking-wider text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
            {cardDetail.position_title}
          </span>
          <p className="text-[11px] text-stone-600 font-semibold mt-1 leading-snug">
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
            className="tarot-3d-flipper shadow-[0_14px_34px_rgba(64,31,7,0.14)] group-hover:shadow-[0_24px_52px_rgba(169,92,12,0.28)]"
            data-flipped={isFlipped ? "true" : "false"}
          >
            {/* ==================== FRONT FACE (Luxury Warm Parchment & 3D Foil) ==================== */}
            <div
              className={`tarot-3d-face p-3.5 sm:p-4 flex flex-col justify-between border-2 bg-gradient-to-b from-[#fffdfa] via-[#fff7ed] to-[#fdebd6] ${
                isReversed ? "border-amber-600" : "border-amber-400"
              }`}
            >
              {/* Clipped Background Filigree + Specular Glare + Holographic Gold Foil */}
              <div className="tarot-3d-clip">
                {/* Engraved Sacred Mandala Watermark */}
                <svg
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                  className="absolute inset-0 m-auto w-[86%] h-[86%] text-amber-500/[0.11] pointer-events-none"
                >
                  <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" />
                  <circle cx="100" cy="100" r="68" fill="none" stroke="currentColor" strokeWidth="0.8" />
                  <polygon points="100,22 167,138 33,138" fill="none" stroke="currentColor" strokeWidth="0.9" />
                  <polygon points="100,178 167,62 33,62" fill="none" stroke="currentColor" strokeWidth="0.9" />
                  <circle cx="100" cy="100" r="24" fill="none" stroke="currentColor" strokeWidth="0.9" />
                </svg>

                <div className="tarot-3d-foil" />
                <div className="tarot-3d-glare" />
              </div>

              {/* Elevated Inner Gold Filigree Frame & Corner Crescent Brackets */}
              <div className="tarot-z-frame absolute inset-1.5 rounded-xl border border-amber-400/65 pointer-events-none" />
              <div className="tarot-z-frame absolute inset-2.5 rounded-lg border border-dashed border-amber-400/40 pointer-events-none" />
              <div className="tarot-z-frame absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-600 rounded-tl pointer-events-none" />
              <div className="tarot-z-frame absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-600 rounded-tr pointer-events-none" />
              <div className="tarot-z-frame absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-600 rounded-bl pointer-events-none" />
              <div className="tarot-z-frame absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-600 rounded-br pointer-events-none" />

              {/* Top Floating Badge Row (Z-Plane 18px) */}
              <div className="tarot-z-mid flex items-center justify-between relative z-10 gap-1">
                <span className="text-[10px] font-serif font-bold tracking-wider text-amber-950 bg-amber-100/95 border border-amber-300 px-2 py-0.5 rounded shadow-2xs">
                  {formatArcanaCrest(cardData)}
                </span>

                {cardData.vedic_graha && (
                  <span className="text-[10px] font-bold text-amber-950 bg-white/90 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs whitespace-nowrap">
                    <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                    <span>{cardData.vedic_graha}</span>
                  </span>
                )}
              </div>

              {/* Center Hero Sacred Medallion (Deepest Z-Plane 28px Parallax Pop) */}
              <div className="tarot-z-hero flex-1 flex flex-col items-center justify-center my-2 relative z-10">
                <div className={`absolute w-28 h-28 rounded-full blur-xl opacity-35 ${auraGlowClass}`} />

                {/* Orbiting Celestial Ring */}
                <div
                  aria-hidden="true"
                  className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-dashed border-amber-500/45 animate-spin [animation-duration:28s] motion-reduce:animate-none pointer-events-none"
                />

                {/* Raised 3D Gold Medallion */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-amber-500/90 bg-gradient-to-br from-[#fffefb] via-[#fff2db] to-[#fadcb4] flex items-center justify-center shadow-[0_10px_24px_rgba(180,100,14,0.22),inset_0_2px_6px_rgba(255,255,255,0.9)] transition-transform duration-300 group-hover:scale-105 relative ${
                    isReversed ? "rotate-180" : ""
                  }`}
                >
                  <div className="absolute inset-1.5 rounded-full border border-amber-400/50 pointer-events-none" />
                  {renderCardEmblem(cardData)}
                </div>

                {isReversed && (
                  <div className="mt-2 flex items-center gap-1 text-[9px] font-bold text-rose-800 bg-rose-50/95 border border-rose-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <RotateCw className="w-2.5 h-2.5 rotate-180" />
                    <span>
                      {language === "bn" ? "উল্টো" : language === "hi" ? "उल्टा" : "Reversed"}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Title & Cosmic Tags (Z-Plane 18px) */}
              <div className="tarot-z-mid relative z-10 text-center">
                <h4 className="font-serif font-bold text-stone-950 text-xs sm:text-sm tracking-wide leading-tight group-hover:text-amber-800 transition-colors">
                  {localizedName}
                </h4>
                <p className="text-[10px] text-stone-600 font-semibold mt-1 leading-tight">
                  {cardData.astrology}
                </p>

                <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full border font-bold flex items-center gap-1 shadow-2xs ${
                      ELEMENT_COLORS[cardData.element] || "border-stone-200 bg-stone-50 text-stone-700"
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

            {/* ==================== BACK FACE (Mahogany-Rosewood Temple Velvet + 24K Shatkona) ==================== */}
            <div className="tarot-3d-face tarot-3d-face--back p-4 flex flex-col items-center justify-center border-2 border-amber-400/90 bg-gradient-to-br from-[#26140e] via-[#402116] to-[#1a0d09] text-amber-200 shadow-lg">
              <div className="tarot-3d-clip">
                <div className="tarot-3d-foil" />
                <div className="tarot-3d-glare" />
              </div>

              {/* Sacred Shatkona Geometry Mandala */}
              <div className="tarot-z-frame absolute inset-2.5 rounded-xl border border-amber-400/45 flex items-center justify-center pointer-events-none">
                <svg viewBox="0 0 160 160" aria-hidden="true" className="w-[84%] h-[84%] text-amber-300/40">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="80" cy="80" r="56" fill="none" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
                  <polygon points="80,18 134,112 26,112" fill="none" stroke="currentColor" strokeWidth="1.1" />
                  <polygon points="80,142 134,48 26,48" fill="none" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </div>

              <div className="tarot-z-hero relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-300/80 flex items-center justify-center mb-2.5 shadow-[0_0_20px_rgba(243,148,25,0.4)]">
                  <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                </div>
                <span className="font-serif text-xs font-bold text-amber-200 tracking-[0.2em] uppercase">
                  DivinLink
                </span>
                <p className="text-[10px] text-amber-300/90 font-medium mt-1">
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
