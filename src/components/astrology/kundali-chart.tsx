"use client";

import * as React from "react";
import type { ChartStyleType, PlanetPosition } from "@/types";

interface KundaliChartProps {
  planets: PlanetPosition[];
  ascendantRashiIndex: number; // 0 to 11 (0=Aries, 1=Taurus...)
  chartStyle?: ChartStyleType;
  className?: string;
}

const RASHI_SHORT = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
];

export function KundaliChart({
  planets,
  ascendantRashiIndex,
  chartStyle = "north_indian",
  className = "",
}: KundaliChartProps) {
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

  const renderPlanetBadges = (list: PlanetPosition[]) => {
    if (!list || list.length === 0) return null;
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[90%]">
        {list.map((p) => {
          const isMoon = p.name === "Moon";
          return (
            <span
              key={p.name}
              className={`inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-[9px] font-bold tabular-nums shadow-2xs ${
                isMoon
                  ? "bg-amber-500 text-amber-950 ring-1 ring-amber-400 font-extrabold"
                  : "bg-surface-muted/90 text-foreground border border-border/70"
              }`}
            >
              <span>{p.name.slice(0, 2)}</span>
              <span className="text-[7.5px] opacity-75">{Math.floor(p.degree_in_sign)}°</span>
            </span>
          );
        })}
      </div>
    );
  };

  // ---------------------------------------------------------------------------
  // 1. NORTH INDIAN DIAMOND CHART
  // ---------------------------------------------------------------------------
  if (chartStyle === "north_indian") {
    return (
      <div className={`relative w-full max-w-[420px] aspect-square mx-auto select-none ${className}`}>
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm">
          {/* Outer Border */}
          <rect x="5" y="5" width="390" height="390" className="fill-card stroke-brand-500/60" strokeWidth="2.5" rx="6" />

          {/* Diagonals */}
          <line x1="5" y1="5" x2="395" y2="395" className="stroke-brand-500/50" strokeWidth="1.5" />
          <line x1="395" y1="5" x2="5" y2="395" className="stroke-brand-500/50" strokeWidth="1.5" />

          {/* Inner Diamond connecting midpoints */}
          <polygon
            points="200,5 395,200 200,395 5,200"
            className="fill-transparent stroke-brand-500/60"
            strokeWidth="2"
          />
        </svg>

        {/* House Content Overlays (12 Houses) */}
        {/* House 1: Top Diamond (Center) */}
        <div className="absolute top-[8%] left-[26%] w-[48%] h-[35%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute top-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400">
            {getHouseRashiNum(1)}
          </span>
          <span className="text-[10px] font-black uppercase text-brand-700 dark:text-brand-300">
            Lagna (Asc)
          </span>
          {renderPlanetBadges(planetsByHouse[1])}
        </div>

        {/* House 2: Top-Left Triangle */}
        <div className="absolute top-[2%] left-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute top-1 right-2 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(2)}
          </span>
          {renderPlanetBadges(planetsByHouse[2])}
        </div>

        {/* House 3: Left-Top Triangle */}
        <div className="absolute top-[26%] left-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute top-1 right-1 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(3)}
          </span>
          {renderPlanetBadges(planetsByHouse[3])}
        </div>

        {/* House 4: Left Diamond */}
        <div className="absolute top-[26%] left-[8%] w-[35%] h-[48%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute left-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400">
            {getHouseRashiNum(4)}
          </span>
          {renderPlanetBadges(planetsByHouse[4])}
        </div>

        {/* House 5: Left-Bottom Triangle */}
        <div className="absolute bottom-[26%] left-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute bottom-1 right-1 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(5)}
          </span>
          {renderPlanetBadges(planetsByHouse[5])}
        </div>

        {/* House 6: Bottom-Left Triangle */}
        <div className="absolute bottom-[2%] left-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute bottom-1 right-2 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(6)}
          </span>
          {renderPlanetBadges(planetsByHouse[6])}
        </div>

        {/* House 7: Bottom Diamond */}
        <div className="absolute bottom-[8%] left-[26%] w-[48%] h-[35%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute bottom-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400">
            {getHouseRashiNum(7)}
          </span>
          {renderPlanetBadges(planetsByHouse[7])}
        </div>

        {/* House 8: Bottom-Right Triangle */}
        <div className="absolute bottom-[2%] right-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute bottom-1 left-2 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(8)}
          </span>
          {renderPlanetBadges(planetsByHouse[8])}
        </div>

        {/* House 9: Right-Bottom Triangle */}
        <div className="absolute bottom-[26%] right-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute bottom-1 left-1 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(9)}
          </span>
          {renderPlanetBadges(planetsByHouse[9])}
        </div>

        {/* House 10: Right Diamond */}
        <div className="absolute top-[26%] right-[8%] w-[35%] h-[48%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute right-1 text-[10px] font-extrabold text-brand-600 dark:text-brand-400">
            {getHouseRashiNum(10)}
          </span>
          {renderPlanetBadges(planetsByHouse[10])}
        </div>

        {/* House 11: Right-Top Triangle */}
        <div className="absolute top-[26%] right-[2%] w-[22%] h-[24%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute top-1 left-1 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(11)}
          </span>
          {renderPlanetBadges(planetsByHouse[11])}
        </div>

        {/* House 12: Top-Right Triangle */}
        <div className="absolute top-[2%] right-[4%] w-[25%] h-[22%] flex flex-col items-center justify-center p-1 pointer-events-none">
          <span className="absolute top-1 left-2 text-[10px] font-bold text-muted-foreground">
            {getHouseRashiNum(12)}
          </span>
          {renderPlanetBadges(planetsByHouse[12])}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. SOUTH INDIAN SQUARE CHART
  // ---------------------------------------------------------------------------
  // Standard fixed signs: Pisces (11), Aries (0), Taurus (1), Gemini (2)...
  // Clockwise 4x4 grid with empty 2x2 center
  const southIndianGridOrder = [
    11, 0, 1, 2,   // Top row: Pisces, Aries, Taurus, Gemini
    10, -1, -1, 3, // Row 2: Aquarius, [center], [center], Cancer
    9, -1, -1, 4,  // Row 3: Capricorn, [center], [center], Leo
    8, 7, 6, 5,    // Bottom row: Sagittarius, Scorpio, Libra, Virgo
  ];

  if (chartStyle === "south_indian") {
    return (
      <div className={`relative w-full max-w-[420px] aspect-square mx-auto select-none ${className}`}>
        <div className="grid grid-cols-4 grid-rows-4 w-full h-full border-2 border-brand-500/70 bg-card rounded-xl overflow-hidden shadow-sm">
          {southIndianGridOrder.map((signIdx, idx) => {
            if (signIdx === -1) {
              // Center Empty Area (4 inner cells)
              if (idx === 5) {
                return (
                  <div
                    key="center-area"
                    className="col-span-2 row-span-2 bg-surface-muted/30 flex flex-col items-center justify-center p-3 text-center border border-border/40"
                  >
                    <span className="text-xs font-bold text-foreground">South Indian</span>
                    <span className="text-[10px] text-muted-foreground">Fixed Zodiac Grid</span>
                    <span className="mt-1 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                      Asc: {RASHI_SHORT[ascendantRashiIndex]}
                    </span>
                  </div>
                );
              }
              return null; // Covered by col-span-2 row-span-2
            }

            const isAscendant = signIdx === ascendantRashiIndex;
            const signPlanets = planetsBySign[signIdx] || [];

            return (
              <div
                key={idx}
                className={`border border-border/60 p-1 flex flex-col justify-between ${
                  isAscendant ? "bg-brand-500/[0.07]" : "bg-card"
                }`}
              >
                <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground">
                  <span>{RASHI_SHORT[signIdx]}</span>
                  {isAscendant && (
                    <span className="text-brand-600 dark:text-brand-400 font-extrabold uppercase">
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
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. EAST INDIAN (BENGALI) CHART
  // ---------------------------------------------------------------------------
  return (
    <div className={`relative w-full max-w-[420px] aspect-square mx-auto select-none ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-sm">
        <rect x="5" y="5" width="390" height="390" className="fill-card stroke-brand-500/70" strokeWidth="2.5" rx="6" />
        {/* Grid lines */}
        <line x1="135" y1="5" x2="135" y2="395" className="stroke-brand-500/50" strokeWidth="1.5" />
        <line x1="265" y1="5" x2="265" y2="395" className="stroke-brand-500/50" strokeWidth="1.5" />
        <line x1="5" y1="135" x2="395" y2="135" className="stroke-brand-500/50" strokeWidth="1.5" />
        <line x1="5" y1="265" x2="395" y2="265" className="stroke-brand-500/50" strokeWidth="1.5" />
        {/* Diagonals in corner cells */}
        <line x1="5" y1="5" x2="135" y2="135" className="stroke-brand-500/40" strokeWidth="1" />
        <line x1="265" y1="5" x2="395" y2="135" className="stroke-brand-500/40" strokeWidth="1" />
        <line x1="5" y1="395" x2="135" y2="265" className="stroke-brand-500/40" strokeWidth="1" />
        <line x1="265" y1="265" x2="395" y2="395" className="stroke-brand-500/40" strokeWidth="1" />
      </svg>
      {/* Center Label */}
      <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] flex flex-col items-center justify-center p-1 text-center pointer-events-none">
        <span className="text-xs font-bold text-foreground">East Indian</span>
        <span className="text-[10px] text-muted-foreground">বাংলা ছক</span>
        <span className="text-[10px] font-bold text-brand-600">
          লগ্ন: {RASHI_SHORT[ascendantRashiIndex]}
        </span>
      </div>
      {/* House 1 top-center */}
      <div className="absolute top-[4%] left-[36%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-brand-600">লগ্ন {getHouseRashiNum(1)}</span>
        {renderPlanetBadges(planetsByHouse[1])}
      </div>
      {/* House 4 left-center */}
      <div className="absolute top-[36%] left-[4%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-muted-foreground">{getHouseRashiNum(4)}</span>
        {renderPlanetBadges(planetsByHouse[4])}
      </div>
      {/* House 7 bottom-center */}
      <div className="absolute bottom-[4%] left-[36%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-muted-foreground">{getHouseRashiNum(7)}</span>
        {renderPlanetBadges(planetsByHouse[7])}
      </div>
      {/* House 10 right-center */}
      <div className="absolute top-[36%] right-[4%] w-[28%] h-[28%] flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-muted-foreground">{getHouseRashiNum(10)}</span>
        {renderPlanetBadges(planetsByHouse[10])}
      </div>
    </div>
  );
}
