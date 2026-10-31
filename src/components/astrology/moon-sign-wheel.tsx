"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import type { AstrologyLanguage } from "@/types";
import { translatePlanetName, translateRashiName } from "@/lib/kundli-translations";

interface MoonSignWheelProps {
  activeRashiIndex?: number | null;
  activeNakshatraIndex?: number | null;
  onSelectRashi?: (index: number) => void;
  language?: AstrologyLanguage;
}

const ZODIAC_SIGNS = [
  { index: 0, name: "Aries", hindi: "Mesha", symbol: "♈", lord: "Mars", element: "Fire" },
  { index: 1, name: "Taurus", hindi: "Vrisha", symbol: "♉", lord: "Venus", element: "Earth" },
  { index: 2, name: "Gemini", hindi: "Mithuna", symbol: "♊", lord: "Mercury", element: "Air" },
  { index: 3, name: "Cancer", hindi: "Karka", symbol: "♋", lord: "Moon", element: "Water" },
  { index: 4, name: "Leo", hindi: "Simha", symbol: "♌", lord: "Sun", element: "Fire" },
  { index: 5, name: "Virgo", hindi: "Kanya", symbol: "♍", lord: "Mercury", element: "Earth" },
  { index: 6, name: "Libra", hindi: "Tula", symbol: "♎", lord: "Venus", element: "Air" },
  { index: 7, name: "Scorpio", hindi: "Vrischika", symbol: "♏", lord: "Mars", element: "Water" },
  { index: 8, name: "Sagittarius", hindi: "Dhanu", symbol: "♐", lord: "Jupiter", element: "Fire" },
  { index: 9, name: "Capricorn", hindi: "Makara", symbol: "♑", lord: "Saturn", element: "Earth" },
  { index: 10, name: "Aquarius", hindi: "Kumbha", symbol: "♒", lord: "Saturn", element: "Air" },
  { index: 11, name: "Pisces", hindi: "Meena", symbol: "♓", lord: "Jupiter", element: "Water" },
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "P. Phalguni", "U. Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "P. Ashadha", "U. Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "P. Bhadrapada", "U. Bhadrapada", "Revati"
];

export function MoonSignWheel({
  activeRashiIndex = null,
  activeNakshatraIndex = null,
  onSelectRashi,
  language = "en",
}: MoonSignWheelProps) {
  const [hoveredRashi, setHoveredRashi] = React.useState<number | null>(null);

  const displayIndex = hoveredRashi !== null ? hoveredRashi : activeRashiIndex;
  const currentSign = displayIndex !== null ? ZODIAC_SIGNS[displayIndex] : null;

  // Center coordinates
  const cx = 300;
  const cy = 300;

  // Radii
  const rInner = 120;
  const rMiddle = 215;
  const rOuter = 285;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[540px] aspect-square select-none">
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full drop-shadow-md transition-transform duration-500"
        >
          <defs>
            {/* Gradients */}
            <radialGradient id="centerSunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="60%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.1" />
            </radialGradient>

            <linearGradient id="activeSignGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.75" />
            </linearGradient>

            <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#fef08a" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background circles */}
          <circle cx={cx} cy={cy} r={rOuter} className="fill-card stroke-border/80" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={rMiddle} className="fill-surface-muted/30 stroke-border/60" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r={rInner} className="fill-background stroke-border/60" strokeWidth="1.5" />

          {/* 1. Outer Ring: 27 Nakshatras */}
          {NAKSHATRAS.map((nak, i) => {
            const angleStep = 360 / 27;
            const startAngle = i * angleStep - 90;
            const endAngle = (i + 1) * angleStep - 90;
            const midAngle = startAngle + angleStep / 2;

            const isNakActive = activeNakshatraIndex === i;

            // Arc path between rMiddle and rOuter
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const midRad = (midAngle * Math.PI) / 180;

            const x1 = cx + rMiddle * Math.cos(startRad);
            const y1 = cy + rMiddle * Math.sin(startRad);
            const x2 = cx + rOuter * Math.cos(startRad);
            const y2 = cy + rOuter * Math.sin(startRad);

            const textR = (rMiddle + rOuter) / 2;
            const tx = cx + textR * Math.cos(midRad);
            const ty = cy + textR * Math.sin(midRad);

            // Compute tangent text rotation so it curves nicely
            let textRotation = midAngle + 90;
            if (midAngle > 0 && midAngle < 180) {
              textRotation += 180;
            }

            return (
              <g key={nak}>
                {/* Separator line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  className="stroke-border/50"
                  strokeWidth="1"
                />

                {/* Active Nakshatra highlight dot */}
                {isNakActive && (
                  <circle
                    cx={tx}
                    cy={ty}
                    r="12"
                    className="fill-amber-500/30 stroke-amber-500 animate-pulse"
                    strokeWidth="1.5"
                  />
                )}

                {/* Nakshatra Label */}
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                  className={`text-[8.5px] font-medium tracking-tighter ${
                    isNakActive ? "fill-amber-600 dark:fill-amber-400 font-bold" : "fill-muted-foreground/80"
                  }`}
                >
                  {nak}
                </text>
              </g>
            );
          })}

          {/* 2. Middle Ring: 12 Zodiac Signs */}
          {ZODIAC_SIGNS.map((sign, i) => {
            const angleStep = 360 / 12;
            const startAngle = i * angleStep - 90;
            const endAngle = (i + 1) * angleStep - 90;
            const midAngle = startAngle + angleStep / 2;

            const isSignActive = activeRashiIndex === i;
            const isHovered = hoveredRashi === i;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const midRad = (midAngle * Math.PI) / 180;

            // Arc points
            const x1Inner = cx + rInner * Math.cos(startRad);
            const y1Inner = cy + rInner * Math.sin(startRad);
            const x1Outer = cx + rMiddle * Math.cos(startRad);
            const y1Outer = cy + rMiddle * Math.sin(startRad);

            const x2Inner = cx + rInner * Math.cos(endRad);
            const y2Inner = cy + rInner * Math.sin(endRad);
            const x2Outer = cx + rMiddle * Math.cos(endRad);
            const y2Outer = cy + rMiddle * Math.sin(endRad);

            const sectorPath = `
              M ${x1Inner} ${y1Inner}
              L ${x1Outer} ${y1Outer}
              A ${rMiddle} ${rMiddle} 0 0 1 ${x2Outer} ${y2Outer}
              L ${x2Inner} ${y2Inner}
              A ${rInner} ${rInner} 0 0 0 ${x1Inner} ${y1Inner}
              Z
            `;

            const iconR = rInner + 30;
            const textR = rInner + 62;
            const ix = cx + iconR * Math.cos(midRad);
            const iy = cy + iconR * Math.sin(midRad);
            const tx = cx + textR * Math.cos(midRad);
            const ty = cy + textR * Math.sin(midRad);

            let textRotation = midAngle + 90;
            if (midAngle > 0 && midAngle < 180) {
              textRotation += 180;
            }

            return (
              <g
                key={sign.name}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredRashi(i)}
                onMouseLeave={() => setHoveredRashi(null)}
                onClick={() => onSelectRashi?.(i)}
              >
                {/* Sector fill */}
                <path
                  d={sectorPath}
                  className={`transition-colors duration-200 ${
                    isSignActive
                      ? "fill-amber-500/25 stroke-amber-500"
                      : isHovered
                      ? "fill-brand-500/15 stroke-brand-500/50"
                      : "fill-transparent stroke-border/50 hover:fill-surface-muted/50"
                  }`}
                  strokeWidth={isSignActive ? "2" : "1"}
                />

                {/* Glyph Symbol */}
                <text
                  x={ix}
                  y={iy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-base font-bold ${
                    isSignActive || isHovered
                      ? "fill-brand-600 dark:fill-brand-400 font-extrabold"
                      : "fill-foreground/80"
                  }`}
                >
                  {sign.symbol}
                </text>

                {/* Sign Label */}
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                  className={`text-[10px] font-bold tracking-tight ${
                    isSignActive
                      ? "fill-brand-600 dark:fill-brand-400 font-black"
                      : isHovered
                      ? "fill-foreground font-bold"
                      : "fill-foreground/90"
                  }`}
                >
                  {sign.name}
                </text>
              </g>
            );
          })}

          {/* 3. Innermost Center: Sun & Moon Orbit */}
          <circle cx={cx} cy={cy} r="65" className="fill-brand-500/10 stroke-brand-500/30" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="35" fill="url(#centerSunGlow)" />

          {/* Radiating Sun Rays */}
          {[...Array(12)].map((_, idx) => {
            const a = (idx * 30 * Math.PI) / 180;
            const x1 = cx + 38 * Math.cos(a);
            const y1 = cy + 38 * Math.sin(a);
            const x2 = cx + 46 * Math.cos(a);
            const y2 = cy + 46 * Math.sin(a);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#eab308"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Center Sun Symbol */}
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-amber-950 font-bold text-lg select-none pointer-events-none"
          >
            ☉
          </text>

          {/* 8 Moon Phases orbiting Sun */}
          {[
            { phase: "🌑", angle: 0 },
            { phase: "🌒", angle: 45 },
            { phase: "🌓", angle: 90 },
            { phase: "🌔", angle: 135 },
            { phase: "🌕", angle: 180 },
            { phase: "🌖", angle: 225 },
            { phase: "🌗", angle: 270 },
            { phase: "🌘", angle: 315 },
          ].map((m, idx) => {
            const rad = (m.angle * Math.PI) / 180;
            const mx = cx + 88 * Math.cos(rad);
            const my = cy + 88 * Math.sin(rad);
            return (
              <text
                key={idx}
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs select-none opacity-80"
              >
                {m.phase}
              </text>
            );
          })}
        </svg>

        {/* Center Pill Display on Hover / Selection */}
        {currentSign && (
          <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 rounded-full border border-brand-500/40 bg-card/95 backdrop-blur-md px-4 py-1.5 shadow-md flex items-center gap-2 text-xs">
            <span className="text-amber-500 font-bold">{currentSign.symbol}</span>
            <span className="font-bold text-foreground">
              {language === "bn"
                ? `${translateRashiName(currentSign.name, "bn")} (${currentSign.name})`
                : language === "hi"
                ? `${translateRashiName(currentSign.name, "hi")} (${currentSign.name})`
                : `${currentSign.name} (${currentSign.hindi})`}
            </span>
            <span className="text-muted-foreground text-[11px]">
              · {language === "bn" ? "অধিপতি:" : language === "hi" ? "स्वामी:" : "Lord:"}{" "}
              <strong className="text-foreground">
                {language === "bn"
                  ? translatePlanetName(currentSign.lord, "bn")
                  : language === "hi"
                  ? translatePlanetName(currentSign.lord, "hi")
                  : currentSign.lord}
              </strong>
            </span>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground max-w-sm">
        <Sparkles className="inline-block size-3.5 text-amber-500 mr-1" />
        {language === "bn"
          ? "১২ রাশি ও ২৭ নক্ষত্রের মহাজাগতিক বৈদিক চক্র।"
          : language === "hi"
          ? "१२ राशि एवं २७ नक्षत्रों का खगोलीय वैदिक चक्र।"
          : "Interactive Vedic Zodiac Wheel showing the 12 Rashis (Moon Signs) and 27 Nakshatras."}
      </p>
    </div>
  );
}
