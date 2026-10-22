"use client";

import * as React from "react";
import type { KundliChartPlanet } from "@/types";

export type ChartStyleType = "north" | "south" | "east" | "wheel";

interface KundliDiamondChartProps {
  title?: string;
  planets: KundliChartPlanet[];
  ascSignNum: number; // 1 (Aries) to 12 (Pisces)
  isNavamsa?: boolean;
  chartStyle?: ChartStyleType;
  className?: string;
}

// Fixed South Indian Zodiac box indices (row, col) in a 4x4 grid
// 0=Pisces, 1=Aries, 2=Taurus, 3=Gemini, 4=Cancer, 5=Leo, 6=Virgo, 7=Libra, 8=Scorpio, 9=Sagittarius, 10=Capricorn, 11=Aquarius
const SOUTH_INDIAN_SIGNS = [
  { signNum: 12, name: "Pisces", col: 0, row: 0 },
  { signNum: 1, name: "Aries", col: 1, row: 0 },
  { signNum: 2, name: "Taurus", col: 2, row: 0 },
  { signNum: 3, name: "Gemini", col: 3, row: 0 },
  { signNum: 4, name: "Cancer", col: 3, row: 1 },
  { signNum: 5, name: "Leo", col: 3, row: 2 },
  { signNum: 6, name: "Virgo", col: 3, row: 3 },
  { signNum: 7, name: "Libra", col: 2, row: 3 },
  { signNum: 8, name: "Scorpio", col: 1, row: 3 },
  { signNum: 9, name: "Sagittarius", col: 0, row: 3 },
  { signNum: 10, name: "Capricorn", col: 0, row: 2 },
  { signNum: 11, name: "Aquarius", col: 0, row: 1 },
];

// House center coordinates & sign number positions for 400x400 SVG North Indian Chart
const HOUSE_GEOMETRY = [
  // House 1 (Lagna / Center Top Diamond)
  { house: 1, signPos: { x: 200, y: 155 }, planetPos: { x: 200, y: 95 } },
  // House 2 (Top Left Triangle)
  { house: 2, signPos: { x: 145, y: 65 }, planetPos: { x: 100, y: 38 } },
  // House 3 (Upper Left Triangle)
  { house: 3, signPos: { x: 65, y: 145 }, planetPos: { x: 38, y: 100 } },
  // House 4 (Left Diamond)
  { house: 4, signPos: { x: 155, y: 200 }, planetPos: { x: 95, y: 200 } },
  // House 5 (Lower Left Triangle)
  { house: 5, signPos: { x: 65, y: 255 }, planetPos: { x: 38, y: 300 } },
  // House 6 (Bottom Left Triangle)
  { house: 6, signPos: { x: 145, y: 335 }, planetPos: { x: 100, y: 362 } },
  // House 7 (Center Bottom Diamond)
  { house: 7, signPos: { x: 200, y: 245 }, planetPos: { x: 200, y: 305 } },
  // House 8 (Bottom Right Triangle)
  { house: 8, signPos: { x: 255, y: 335 }, planetPos: { x: 300, y: 362 } },
  // House 9 (Lower Right Triangle)
  { house: 9, signPos: { x: 335, y: 255 }, planetPos: { x: 362, y: 300 } },
  // House 10 (Right Diamond)
  { house: 10, signPos: { x: 245, y: 200 }, planetPos: { x: 305, y: 200 } },
  // House 11 (Upper Right Triangle)
  { house: 11, signPos: { x: 335, y: 145 }, planetPos: { x: 362, y: 100 } },
  // House 12 (Top Right Triangle)
  { house: 12, signPos: { x: 255, y: 65 }, planetPos: { x: 300, y: 38 } },
];

export function KundliDiamondChart({
  title,
  planets,
  ascSignNum,
  isNavamsa = false,
  chartStyle = "north",
  className = "",
}: KundliDiamondChartProps) {
  // Group planets by house (1 to 12) for North chart
  const planetsByHouse = React.useMemo(() => {
    const map: Record<number, KundliChartPlanet[]> = {};
    for (let h = 1; h <= 12; h++) map[h] = [];

    planets.forEach((p) => {
      const targetHouse = isNavamsa ? p.d9_house_num : p.house_num;
      if (targetHouse >= 1 && targetHouse <= 12) {
        map[targetHouse].push(p);
      }
    });

    return map;
  }, [planets, isNavamsa]);

  // Group planets by sign (1 to 12) for South & East charts
  const planetsBySign = React.useMemo(() => {
    const map: Record<number, KundliChartPlanet[]> = {};
    for (let s = 1; s <= 12; s++) map[s] = [];

    planets.forEach((p) => {
      const targetSign = isNavamsa ? p.d9_sign_num : p.sign_num;
      if (targetSign >= 1 && targetSign <= 12) {
        map[targetSign].push(p);
      }
    });

    return map;
  }, [planets, isNavamsa]);

  // Sign number inside each house: ((ascSignNum - 1 + (houseNum - 1)) % 12) + 1
  const getHouseSignNumber = (houseNum: number) => {
    return (((ascSignNum - 1) + (houseNum - 1)) % 12) + 1;
  };

  const getPlanetColor = (name: string) => {
    return name === "Asc"
      ? "#0369a1"
      : name === "Sun"
      ? "#b45309"
      : name === "Moon"
      ? "#334155"
      : name === "Mars"
      ? "#b91c1c"
      : name === "Mercury"
      ? "#047857"
      : name === "Jupiter"
      ? "#1e3a8a"
      : name === "Venus"
      ? "#4338ca"
      : name === "Saturn"
      ? "#14532d"
      : "#6b21a8";
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <div className="mb-3">
          <span className="inline-block rounded-lg border-2 border-amber-300 bg-amber-50/70 dark:bg-amber-950/40 px-4 py-1 text-sm font-bold text-amber-900 dark:text-amber-200 shadow-2xs">
            {title}
          </span>
        </div>
      )}

      <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-square rounded-xl bg-white dark:bg-stone-900 shadow-xs border border-amber-200/80 p-2">
        {chartStyle === "south" ? (
          // South Indian 4x4 Grid Chart
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0" y="0" width="400" height="400" fill="transparent" />
            <rect x="4" y="4" width="392" height="392" fill="none" stroke="#ea580c" strokeWidth="3.5" rx="4" />
            {/* Horizontal & Vertical grid lines */}
            <line x1="4" y1="100" x2="396" y2="100" stroke="#ea580c" strokeWidth="2" />
            <line x1="4" y1="200" x2="100" y2="200" stroke="#ea580c" strokeWidth="2" />
            <line x1="300" y1="200" x2="396" y2="200" stroke="#ea580c" strokeWidth="2" />
            <line x1="4" y1="300" x2="396" y2="300" stroke="#ea580c" strokeWidth="2" />

            <line x1="100" y1="4" x2="100" y2="396" stroke="#ea580c" strokeWidth="2" />
            <line x1="200" y1="4" x2="200" y2="100" stroke="#ea580c" strokeWidth="2" />
            <line x1="200" y1="300" x2="200" y2="396" stroke="#ea580c" strokeWidth="2" />
            <line x1="300" y1="4" x2="300" y2="396" stroke="#ea580c" strokeWidth="2" />

            {/* Center Box Label */}
            <text x="200" y="195" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#c2410c">
              {isNavamsa ? "D9 NAVAMSA" : "D1 RASI"}
            </text>
            <text x="200" y="215" textAnchor="middle" fontSize="11" fill="#78716c">
              South Indian Style
            </text>

            {/* Render 12 South Indian boxes */}
            {SOUTH_INDIAN_SIGNS.map((box) => {
              const bx = box.col * 100;
              const by = box.row * 100;
              const signPlanets = planetsBySign[box.signNum] || [];
              const isAscSign = box.signNum === ascSignNum;

              return (
                <g key={`south-${box.signNum}`}>
                  {/* Ascendant line if Lagna falls in this sign */}
                  {isAscSign && (
                    <line x1={bx + 6} y1={by + 6} x2={bx + 35} y2={by + 35} stroke="#0284c7" strokeWidth="2" />
                  )}
                  {/* Sign label */}
                  <text
                    x={bx + 8}
                    y={by + 16}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#a8a29e"
                  >
                    {box.signNum}
                  </text>
                  {isAscSign && (
                    <text
                      x={bx + 24}
                      y={by + 16}
                      fontSize="9"
                      fontWeight="bold"
                      fill="#0284c7"
                    >
                      Asc
                    </text>
                  )}

                  {/* Planets inside this sign box */}
                  {signPlanets.map((p, pIdx) => {
                    const px = bx + 50 + (pIdx % 2 === 0 ? -20 : 20);
                    const py = by + 40 + Math.floor(pIdx / 2) * 20;
                    return (
                      <text
                        key={`south-p-${box.signNum}-${p.name}`}
                        x={px}
                        y={py}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill={getPlanetColor(p.name)}
                      >
                        {p.code}
                        <tspan dx="1" dy="-3" fontSize="8" fill="#64748b">
                          {p.degree}
                        </tspan>
                      </text>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        ) : (
          // North Indian Diamond Chart (Default & AppliedJyotish matching Screenshot 2)
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background fill */}
            <rect x="0" y="0" width="400" height="400" fill="transparent" />

            {/* Outer Border (Warm Orange / Amber matching screenshots) */}
            <rect
              x="4"
              y="4"
              width="392"
              height="392"
              fill="none"
              stroke="#ea580c"
              strokeWidth="3.5"
              rx="4"
            />

            {/* Two Main Diagonals */}
            <line x1="4" y1="4" x2="396" y2="396" stroke="#ea580c" strokeWidth="2.5" />
            <line x1="396" y1="4" x2="4" y2="396" stroke="#ea580c" strokeWidth="2.5" />

            {/* Inscribed Diamond: (200,4) -> (396,200) -> (200,396) -> (4,200) -> (200,4) */}
            <polygon
              points="200,4 396,200 200,396 4,200"
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
            />

            {/* Render Sign Numbers & Planets for each of the 12 houses */}
            {HOUSE_GEOMETRY.map((geo) => {
              const hNum = geo.house;
              const signNum = getHouseSignNumber(hNum);
              const housePlanets = planetsByHouse[hNum] || [];

              return (
                <g key={`house-${hNum}`}>
                  {/* Sign Number (Small, red/orange colored in corners) */}
                  <text
                    x={geo.signPos.x}
                    y={geo.signPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="13"
                    fontWeight="800"
                    fill="#c2410c"
                    className="font-mono opacity-90"
                  >
                    {signNum}
                  </text>

                  {/* Planets placed inside House */}
                  {housePlanets.length > 0 && (
                    <g>
                      {housePlanets.map((p, pIdx) => {
                        const count = housePlanets.length;
                        let offsetX = 0;
                        let offsetY = 0;

                        if (count === 1) {
                          offsetX = 0;
                          offsetY = 0;
                        } else if (count === 2) {
                          offsetX = pIdx === 0 ? -16 : 16;
                          offsetY = 0;
                        } else if (count === 3) {
                          if (pIdx === 0) {
                            offsetX = -16;
                            offsetY = -10;
                          } else if (pIdx === 1) {
                            offsetX = 16;
                            offsetY = -10;
                          } else {
                            offsetX = 0;
                            offsetY = 12;
                          }
                        } else {
                          const row = Math.floor(pIdx / 2);
                          const col = pIdx % 2;
                          offsetX = col === 0 ? -18 : 18;
                          offsetY = row === 0 ? -10 : 12;
                        }

                        const px = geo.planetPos.x + offsetX;
                        const py = geo.planetPos.y + offsetY;
                        const retroChar = p.is_retrograde && p.name !== "Asc" ? "®" : "";

                        return (
                          <g key={`p-${hNum}-${p.name}-${pIdx}`} className="cursor-default">
                            <text
                              x={px}
                              y={py}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="11"
                              fontWeight="800"
                              fill={getPlanetColor(p.name)}
                            >
                              {p.code}
                              {retroChar && (
                                <tspan fontSize="8" fontWeight="bold">
                                  {retroChar}
                                </tspan>
                              )}
                              <tspan
                                dx="1"
                                dy="-4"
                                fontSize="8"
                                fontWeight="bold"
                                fill="#64748b"
                              >
                                {p.degree}
                              </tspan>
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
