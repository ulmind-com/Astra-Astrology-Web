"use client";

import * as React from "react";
import type { ChartStyleType, PlanetPosition } from "@/types";
import { Sparkles, Sun, Moon as MoonIcon } from "lucide-react";

interface KundaliChartProps {
  planets: PlanetPosition[];
  ascendantRashiIndex: number; // 0 to 11 (0=Aries, 1=Taurus...)
  chartStyle?: ChartStyleType;
  className?: string;
  language?: "en" | "bn" | "hi";
}

const RASHI_SHORT = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
];

const RASHI_BN = [
  "মেষ", "বৃষ", "মিথুন", "কর্কট", "সিংহ", "কন্যা", "তুলা", "বৃশ্চিক", "ধনু", "মকর", "কুম্ভ", "মীন"
];

const RASHI_HI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
];

export function KundaliChart({
  planets,
  ascendantRashiIndex,
  chartStyle = "north_indian",
  className = "",
  language = "en",
}: KundaliChartProps) {
  // Theme state: "parchment" (warm sacred gold) or "cosmic" (deep midnight gold)
  const [theme, setTheme] = React.useState<"parchment" | "cosmic">("parchment");

  // Map planets to houses (1 to 12)
  const planetsByHouse = React.useMemo(() => {
    const map: Record<number, PlanetPosition[]> = {};
    for (let h = 1; h <= 12; h++) map[h] = [];
    for (const p of planets) {
      if (p.house >= 1 && p.house <= 12) {
        map[p.house].push(p);
      }
    }
    return map;
  }, [planets]);

  // Map planets to zodiac signs (0 to 11) for South Indian chart
  const planetsBySign = React.useMemo(() => {
    const map: Record<number, PlanetPosition[]> = {};
    for (let s = 0; s < 12; s++) map[s] = [];
    for (const p of planets) {
      if (p.sign_index >= 0 && p.sign_index < 12) {
        map[p.sign_index].push(p);
      }
    }
    return map;
  }, [planets]);

  // Sign number inside each house in North Indian chart (1=Aries to 12=Pisces)
  const getHouseRashiNum = (houseNum: number) => {
    return ((ascendantRashiIndex + (houseNum - 1)) % 12) + 1;
  };

  const getAscendantLabel = () => {
    if (language === "bn") return "লগ্ন";
    if (language === "hi") return "लग्न";
    return "Lagna (Asc)";
  };

  // Theme styling tokens
  const isCosmic = theme === "cosmic";
  const bgFill = isCosmic ? "#0d111c" : "#fffef7";
  const strokeColor = isCosmic ? "#eab308" : "#c59b27";
  const strokeSubtle = isCosmic ? "rgba(234, 179, 8, 0.35)" : "rgba(197, 155, 39, 0.45)";
  const textColor = isCosmic ? "#fef08a" : "#78350f";
  const ascColor = isCosmic ? "#f59e0b" : "#991b1b";

  const renderPlanetBadges = (list: PlanetPosition[]) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[95%]">
        {list.map((p) => {
          const isMoon = p.name === "Moon";
          return (
            <span
              key={p.name}
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9.5px] font-bold tabular-nums shadow-xs transition-transform ${
                isMoon
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white ring-1 ring-amber-300 font-black scale-105"
                  : isCosmic
                  ? "bg-slate-800/90 text-amber-100 border border-amber-500/30"
                  : "bg-white text-ink-950 border border-amber-300/80 shadow-2xs"
              }`}
            >
              <span>{p.name.slice(0, 2)}</span>
              <span className={`text-[8px] ${isMoon ? "text-amber-100" : isCosmic ? "text-amber-300/80" : "text-ink-600"}`}>
                {Math.floor(p.degree_in_sign)}°
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Chart Theme & Style Bar */}
      <div className="flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>
            {chartStyle === "north_indian"
              ? "North Indian (Diamond)"
              : chartStyle === "south_indian"
              ? "South Indian (Fixed Grid)"
              : "East Indian (Bengali)"}
          </span>
        </div>

        {/* Theme Mode Toggle (Parchment vs Cosmic) */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-muted p-1 border border-border/70 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setTheme("parchment")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
              !isCosmic
                ? "bg-white text-amber-900 shadow-2xs font-bold border border-amber-200"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun className="size-3 text-amber-500" />
            <span>Parchment</span>
          </button>
          <button
            type="button"
            onClick={() => setTheme("cosmic")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all ${
              isCosmic
                ? "bg-slate-900 text-amber-300 shadow-2xs font-bold border border-amber-500/40"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MoonIcon className="size-3 text-amber-400" />
            <span>Cosmic</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          CHART RENDERER
      --------------------------------------------------------------------- */}
      <div
        className={`relative w-full max-w-[440px] aspect-square mx-auto rounded-2xl overflow-hidden select-none border-2 transition-colors duration-200 ${
          isCosmic
            ? "bg-[#0d111c] border-amber-500/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
            : "bg-[#fffef7] border-amber-400/80 shadow-[0_8px_30px_rgba(217,119,6,0.12)]"
        }`}
      >
        {/* ===================================================================
            1. NORTH INDIAN DIAMOND CHART
        =================================================================== */}
        {chartStyle === "north_indian" && (
          <>
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Chart Canvas */}
              <rect x="0" y="0" width="400" height="400" fill={bgFill} />

              {/* Outer Border */}
              <rect x="6" y="6" width="388" height="388" fill="none" stroke={strokeColor} strokeWidth="2.5" rx="10" />

              {/* Diagonals */}
              <line x1="6" y1="6" x2="394" y2="394" stroke={strokeSubtle} strokeWidth="1.8" />
              <line x1="394" y1="6" x2="6" y2="394" stroke={strokeSubtle} strokeWidth="1.8" />

              {/* Inner Diamond connecting midpoints */}
              <polygon
                points="200,6 394,200 200,394 6,200"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.2"
              />
            </svg>

            {/* Overlays for 12 Houses */}
            {/* House 1: Top Diamond (Center) */}
            <div className="absolute top-[8%] left-[26%] w-[48%] h-[35%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute top-1 text-[11px] font-black" style={{ color: textColor }}>
                {getHouseRashiNum(1)}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider mb-0.5" style={{ color: ascColor }}>
                {getAscendantLabel()}
              </span>
              {renderPlanetBadges(planetsByHouse[1])}
            </div>

            {/* House 2: Top-Left Triangle */}
            <div className="absolute top-[2%] left-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute top-1 right-2 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(2)}
              </span>
              {renderPlanetBadges(planetsByHouse[2])}
            </div>

            {/* House 3: Left-Top Triangle */}
            <div className="absolute top-[26%] left-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute top-1 right-1 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(3)}
              </span>
              {renderPlanetBadges(planetsByHouse[3])}
            </div>

            {/* House 4: Left Diamond */}
            <div className="absolute top-[26%] left-[8%] w-[35%] h-[48%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute left-1.5 text-[11px] font-black" style={{ color: textColor }}>
                {getHouseRashiNum(4)}
              </span>
              {renderPlanetBadges(planetsByHouse[4])}
            </div>

            {/* House 5: Left-Bottom Triangle */}
            <div className="absolute bottom-[26%] left-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute bottom-1 right-1 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(5)}
              </span>
              {renderPlanetBadges(planetsByHouse[5])}
            </div>

            {/* House 6: Bottom-Left Triangle */}
            <div className="absolute bottom-[2%] left-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute bottom-1 right-2 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(6)}
              </span>
              {renderPlanetBadges(planetsByHouse[6])}
            </div>

            {/* House 7: Bottom Diamond */}
            <div className="absolute bottom-[8%] left-[26%] w-[48%] h-[35%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute bottom-1 text-[11px] font-black" style={{ color: textColor }}>
                {getHouseRashiNum(7)}
              </span>
              {renderPlanetBadges(planetsByHouse[7])}
            </div>

            {/* House 8: Bottom-Right Triangle */}
            <div className="absolute bottom-[2%] right-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute bottom-1 left-2 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(8)}
              </span>
              {renderPlanetBadges(planetsByHouse[8])}
            </div>

            {/* House 9: Right-Bottom Triangle */}
            <div className="absolute bottom-[26%] right-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute bottom-1 left-1 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(9)}
              </span>
              {renderPlanetBadges(planetsByHouse[9])}
            </div>

            {/* House 10: Right Diamond */}
            <div className="absolute top-[26%] right-[8%] w-[35%] h-[48%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute right-1.5 text-[11px] font-black" style={{ color: textColor }}>
                {getHouseRashiNum(10)}
              </span>
              {renderPlanetBadges(planetsByHouse[10])}
            </div>

            {/* House 11: Right-Top Triangle */}
            <div className="absolute top-[26%] right-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute top-1 left-1 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(11)}
              </span>
              {renderPlanetBadges(planetsByHouse[11])}
            </div>

            {/* House 12: Top-Right Triangle */}
            <div className="absolute top-[2%] right-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
              <span className="absolute top-1 left-2 text-[10px] font-bold opacity-80" style={{ color: textColor }}>
                {getHouseRashiNum(12)}
              </span>
              {renderPlanetBadges(planetsByHouse[12])}
            </div>
          </>
        )}

        {/* ===================================================================
            2. SOUTH INDIAN SQUARE CHART
        =================================================================== */}
        {chartStyle === "south_indian" && (
          <div className="grid grid-cols-4 grid-rows-4 w-full h-full p-1.5">
            {[
              11, 0, 1, 2,   // Top: Pisces, Aries, Taurus, Gemini
              10, -1, -1, 3, // Row 2: Aquarius, center, center, Cancer
              9, -1, -1, 4,  // Row 3: Capricorn, center, center, Leo
              8, 7, 6, 5,    // Bottom: Sagittarius, Scorpio, Libra, Virgo
            ].map((signIdx, idx) => {
              if (signIdx === -1) {
                if (idx === 5) {
                  return (
                    <div
                      key="center-area"
                      className="col-span-2 row-span-2 flex flex-col items-center justify-center p-3 text-center border-2 border-dashed rounded-xl"
                      style={{
                        borderColor: strokeSubtle,
                        backgroundColor: isCosmic ? "rgba(13, 17, 28, 0.6)" : "rgba(255, 254, 247, 0.7)",
                      }}
                    >
                      <span className="text-xs font-bold" style={{ color: textColor }}>South Indian</span>
                      <span className="text-[10px] opacity-75" style={{ color: textColor }}>Fixed Zodiac Grid</span>
                      <span className="mt-1 text-[11px] font-extrabold" style={{ color: ascColor }}>
                        {getAscendantLabel()}: {RASHI_SHORT[ascendantRashiIndex]}
                      </span>
                    </div>
                  );
                }
                return null;
              }

              const isAscendant = signIdx === ascendantRashiIndex;
              const signPlanets = planetsBySign[signIdx] || [];

              return (
                <div
                  key={idx}
                  className="p-1 flex flex-col justify-between border transition-colors rounded-sm"
                  style={{
                    borderColor: strokeSubtle,
                    backgroundColor: isAscendant
                      ? isCosmic ? "rgba(234, 179, 8, 0.12)" : "rgba(217, 119, 6, 0.08)"
                      : "transparent",
                  }}
                >
                  <div className="flex items-center justify-between text-[9.5px] font-bold">
                    <span style={{ color: textColor }}>{RASHI_SHORT[signIdx]}</span>
                    {isAscendant && (
                      <span className="font-extrabold uppercase text-[8.5px]" style={{ color: ascColor }}>
                        ASC
                      </span>
                    )}
                  </div>
                  <div className="my-auto flex flex-wrap gap-0.5 justify-center">
                    {renderPlanetBadges(signPlanets)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ===================================================================
            3. EAST INDIAN (BENGALI) CHART
        =================================================================== */}
        {chartStyle === "east_indian" && (
          <>
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <rect x="0" y="0" width="400" height="400" fill={bgFill} />
              <rect x="6" y="6" width="388" height="388" fill="none" stroke={strokeColor} strokeWidth="2.5" rx="10" />

              {/* Grid lines */}
              <line x1="135" y1="6" x2="135" y2="394" stroke={strokeSubtle} strokeWidth="1.6" />
              <line x1="265" y1="6" x2="265" y2="394" stroke={strokeSubtle} strokeWidth="1.6" />
              <line x1="6" y1="135" x2="394" y2="135" stroke={strokeSubtle} strokeWidth="1.6" />
              <line x1="6" y1="265" x2="394" y2="265" stroke={strokeSubtle} strokeWidth="1.6" />

              {/* Corner Diagonals */}
              <line x1="6" y1="6" x2="135" y2="135" stroke={strokeSubtle} strokeWidth="1.5" />
              <line x1="265" y1="6" x2="394" y2="135" stroke={strokeSubtle} strokeWidth="1.5" />
              <line x1="6" y1="394" x2="135" y2="265" stroke={strokeSubtle} strokeWidth="1.5" />
              <line x1="265" y1="265" x2="394" y2="394" stroke={strokeSubtle} strokeWidth="1.5" />
            </svg>

            {/* Center Label */}
            <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] flex flex-col items-center justify-center p-1 text-center pointer-events-none">
              <span className="text-xs font-bold" style={{ color: textColor }}>East Indian</span>
              <span className="text-[10px] opacity-75" style={{ color: textColor }}>বাংলা ঐতিহ্যবাহী ছক</span>
              <span className="mt-1 text-[11px] font-extrabold" style={{ color: ascColor }}>
                {getAscendantLabel()}: {language === "bn" ? RASHI_BN[ascendantRashiIndex] : RASHI_SHORT[ascendantRashiIndex]}
              </span>
            </div>

            {/* House 1 top-center */}
            <div className="absolute top-[4%] left-[36%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-extrabold mb-0.5" style={{ color: ascColor }}>
                {getAscendantLabel()} {getHouseRashiNum(1)}
              </span>
              {renderPlanetBadges(planetsByHouse[1])}
            </div>

            {/* House 4 left-center */}
            <div className="absolute top-[36%] left-[4%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold" style={{ color: textColor }}>{getHouseRashiNum(4)}</span>
              {renderPlanetBadges(planetsByHouse[4])}
            </div>

            {/* House 7 bottom-center */}
            <div className="absolute bottom-[4%] left-[36%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold" style={{ color: textColor }}>{getHouseRashiNum(7)}</span>
              {renderPlanetBadges(planetsByHouse[7])}
            </div>

            {/* House 10 right-center */}
            <div className="absolute top-[36%] right-[4%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-bold" style={{ color: textColor }}>{getHouseRashiNum(10)}</span>
              {renderPlanetBadges(planetsByHouse[10])}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
