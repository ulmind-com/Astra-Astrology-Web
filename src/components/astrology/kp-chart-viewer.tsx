"use client";

import * as React from "react";
import type { KPPlanetDetail, KPCuspDetail } from "@/types";
import { Download, Eye, Sparkles } from "lucide-react";

export type KPChartStyle = "north" | "south" | "east" | "wheel";
export type KPChartMode = "combine" | "rashi" | "bhav";

interface KPChartViewerProps {
  planets: KPPlanetDetail[];
  cusps: KPCuspDetail[];
  ascendantSignIndex: number; // 0=Aries, 9=Capricorn, etc.
  userName?: string;
  birthDate?: string;
  birthTime?: string;
  moonSignName?: string;
  nakshatraName?: string;
  language?: "en" | "bn" | "hi";
  className?: string;
}

const ZODIAC_NAMES_EN = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const NAKSHATRAS_27 = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "P. Phalguni", "U. Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyestha",
  "Moola", "P. Shada", "U. Ashada", "Shravana", "Dhanishta", "Shatabhisha",
  "P.Bd.Pada", "U.Bd.Pada", "Revati"
];

// Planet color palette matching screenshots
const PLANET_COLORS: Record<string, string> = {
  Asc: "#15803d", // Green
  Su: "#b45309",  // Amber-orange
  Mo: "#451a03",  // Dark brown / charcoal
  Ma: "#b91c1c",  // Red
  Me: "#047857",  // Emerald
  Ju: "#1e3a8a",  // Navy blue
  Ve: "#4338ca",  // Indigo
  Sa: "#14532d",  // Deep green/slate
  Ra: "#3b0764",  // Deep violet
  Ke: "#701a75",  // Magenta violet
};

export function KPChartViewer({
  planets,
  cusps,
  ascendantSignIndex,
  userName = "Native",
  birthDate = "",
  birthTime = "",
  moonSignName = "",
  nakshatraName = "",
  language = "en",
  className = "",
}: KPChartViewerProps) {
  const [chartStyle, setChartStyle] = React.useState<KPChartStyle>("north");
  const [chartMode, setChartMode] = React.useState<KPChartMode>("rashi");
  const [selectedPlanet, setSelectedPlanet] = React.useState<string | null>(null);
  const chartRef = React.useRef<HTMLDivElement>(null);

  // Map planets to houses based on chartMode:
  // In "rashi" mode, house = sign_index relative to Ascendant (Equal Sign) or natural zodiac
  // In "bhav" mode, house = planet.bhav_house (Placidus Bhava Chalit)
  // In "combine" mode, we show both
  const planetsByHouse = React.useMemo(() => {
    const map: Record<number, KPPlanetDetail[]> = {};
    for (let h = 1; h <= 12; h++) map[h] = [];

    planets.forEach((p) => {
      let targetHouse = p.bhav_house;
      if (chartMode === "rashi") {
        targetHouse = p.rashi_house;
      }
      if (targetHouse >= 1 && targetHouse <= 12) {
        map[targetHouse].push(p);
      }
    });

    return map;
  }, [planets, chartMode]);

  // Planet format helper: "Asc¹⁹", "Ra®¹⁴"
  const formatPlanetLabel = (p: KPPlanetDetail) => {
    const deg = Math.floor(p.degree_in_sign);
    const retro = p.is_retrograde ? "®" : "";
    return { name: p.code || p.name, retro, deg };
  };

  // Sign number inside North Indian house (1=Aries ... 12=Pisces)
  const getNorthHouseSignNumber = (houseNum: number) => {
    return ((ascendantSignIndex + (houseNum - 1)) % 12) + 1;
  };

  // Download chart image SVG/Canvas
  const handleDownload = () => {
    if (!chartRef.current) return;
    const svgEl = chartRef.current.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `KP_Chart_${userName || "native"}_${chartStyle}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // North Indian Diamond Chart Renderer
  // -------------------------------------------------------------
  const renderNorthChart = () => {
    // Standard North Indian Diamond Kundali (viewBox 0 0 500 500)
    // House 1: Top Center Diamond (250,0) (500,250) (250,250) (0,250)
    // House 2: Top Left Triangle
    // House 3: Top Left Outer Triangle
    // House 4: Left Diamond
    // House 5: Bottom Left Outer Triangle
    // House 6: Bottom Left Triangle
    // House 7: Bottom Center Diamond
    // House 8: Bottom Right Triangle
    // House 9: Bottom Right Outer Triangle
    // House 10: Right Diamond
    // House 11: Top Right Outer Triangle
    // House 12: Top Right Triangle

    const housePositions: Record<number, { textPos: [number, number]; signPos: [number, number] }> = {
      1: { textPos: [250, 160], signPos: [250, 240] },
      2: { textPos: [180, 75], signPos: [195, 110] },
      3: { textPos: [75, 75], signPos: [120, 120] },
      4: { textPos: [160, 250], signPos: [235, 255] },
      5: { textPos: [75, 415], signPos: [125, 375] },
      6: { textPos: [175, 420], signPos: [195, 385] },
      7: { textPos: [250, 340], signPos: [250, 275] },
      8: { textPos: [320, 420], signPos: [305, 385] },
      9: { textPos: [425, 415], signPos: [375, 375] },
      10: { textPos: [340, 250], signPos: [265, 255] },
      11: { textPos: [425, 75], signPos: [375, 120] },
      12: { textPos: [320, 75], signPos: [305, 110] },
    };

    return (
      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-[520px] aspect-square mx-auto select-none font-sans drop-shadow-md"
      >
        <rect width="500" height="500" fill="#ffffff" stroke="#e08e33" strokeWidth="3" />

        {/* Outer Square border */}
        <line x1="0" y1="0" x2="500" y2="0" stroke="#e08e33" strokeWidth="3" />
        <line x1="500" y1="0" x2="500" y2="500" stroke="#e08e33" strokeWidth="3" />
        <line x1="500" y1="500" x2="0" y2="500" stroke="#e08e33" strokeWidth="3" />
        <line x1="0" y1="500" x2="0" y2="0" stroke="#e08e33" strokeWidth="3" />

        {/* Main Diagonals */}
        <line x1="0" y1="0" x2="500" y2="500" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="500" y1="0" x2="0" y2="500" stroke="#e08e33" strokeWidth="2.5" />

        {/* Inner Diamond connecting midpoints */}
        <polygon
          points="250,0 500,250 250,500 0,250"
          fill="none"
          stroke="#e08e33"
          strokeWidth="2.5"
        />

        {/* House Content */}
        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((h) => {
          const { textPos, signPos } = housePositions[h];
          const signNum = getNorthHouseSignNumber(h);
          const housePlanets = planetsByHouse[h] || [];

          return (
            <g key={`north-house-${h}`}>
              {/* House / Sign Number */}
              <text
                x={signPos[0]}
                y={signPos[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
                fontWeight="700"
                fill="#475569"
                className="opacity-75"
              >
                {signNum}
              </text>

              {/* Planets inside house */}
              <g transform={`translate(${textPos[0]}, ${textPos[1]})`}>
                {housePlanets.map((p, idx) => {
                  const { name, retro, deg } = formatPlanetLabel(p);
                  const isHighlighted = selectedPlanet === p.name;
                  const color = PLANET_COLORS[p.name] || "#1e293b";
                  const yOffset = (idx - (housePlanets.length - 1) / 2) * 22;

                  return (
                    <text
                      key={p.name}
                      x="0"
                      y={yOffset}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isHighlighted ? "17" : "15"}
                      fontWeight="700"
                      fill={color}
                      className={`cursor-pointer transition-all duration-150 ${
                        isHighlighted ? "underline filter drop-shadow" : ""
                      }`}
                      onClick={() => setSelectedPlanet(selectedPlanet === p.name ? null : p.name)}
                    >
                      {name}
                      {retro && <tspan fontSize="11" dy="-3">{retro}</tspan>}
                      <tspan fontSize="11" dy={retro ? "0" : "-5"} fontWeight="600">
                        {deg}
                      </tspan>
                    </text>
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>
    );
  };

  // -------------------------------------------------------------
  // South Indian Chart Renderer (Matching screenshot 2)
  // -------------------------------------------------------------
  const renderSouthChart = () => {
    // 4x4 grid. Outer 12 cells are zodiac signs (Pisces at top-left, Aries, Taurus, Gemini...)
    // Inner 2x2 cells merged into native info box
    // Cell size: 125 x 125, Total: 500 x 500
    const cellSignMap: Record<string, { x: number; y: number; signIdx: number }> = {
      "0,0": { x: 0, y: 0, signIdx: 11 },   // Pisces
      "1,0": { x: 125, y: 0, signIdx: 0 },  // Aries
      "2,0": { x: 250, y: 0, signIdx: 1 },  // Taurus
      "3,0": { x: 375, y: 0, signIdx: 2 },  // Gemini
      "3,1": { x: 375, y: 125, signIdx: 3 },// Cancer
      "3,2": { x: 375, y: 250, signIdx: 4 },// Leo
      "3,3": { x: 375, y: 375, signIdx: 5 },// Virgo
      "2,3": { x: 250, y: 375, signIdx: 6 },// Libra
      "1,3": { x: 125, y: 375, signIdx: 7 },// Scorpio
      "0,3": { x: 0, y: 375, signIdx: 8 },  // Sagittarius
      "0,2": { x: 0, y: 250, signIdx: 9 },  // Capricorn
      "0,1": { x: 0, y: 125, signIdx: 10 }, // Aquarius
    };

    return (
      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-[520px] aspect-square mx-auto select-none font-sans drop-shadow-md"
      >
        <rect width="500" height="500" fill="#ffffff" stroke="#e08e33" strokeWidth="3" />

        {/* Grid lines */}
        {/* Horizontal */}
        <line x1="0" y1="125" x2="500" y2="125" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="0" y1="250" x2="125" y2="250" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="375" y1="250" x2="500" y2="250" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="0" y1="375" x2="500" y2="375" stroke="#e08e33" strokeWidth="2.5" />

        {/* Vertical */}
        <line x1="125" y1="0" x2="125" y2="500" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="250" y1="0" x2="250" y2="125" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="250" y1="375" x2="250" y2="500" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="375" y1="0" x2="375" y2="500" stroke="#e08e33" strokeWidth="2.5" />

        {/* Center Native Info Box */}
        <g transform="translate(250, 250)" textAnchor="middle" className="select-none">
          <text y="-50" fontSize="16" fontWeight="700" fill="#1e293b">
            {userName}
          </text>
          <text y="-25" fontSize="13" fontWeight="600" fill="#475569">
            {birthDate}
          </text>
          <text y="0" fontSize="13" fontWeight="600" fill="#475569">
            {birthTime}
          </text>
          <text y="28" fontSize="14" fontWeight="700" fill="#d97706">
            {moonSignName || "Scorpio"}
          </text>
          <text y="52" fontSize="13" fontWeight="600" fill="#64748b">
            {nakshatraName || "Jyeshtha"}
          </text>
        </g>

        {/* 12 Outer cells */}
        {Object.entries(cellSignMap).map(([key, cell]) => {
          const { x, y, signIdx } = cell;
          // In South chart, house number relative to Ascendant
          const houseNum = ((signIdx - ascendantSignIndex + 12) % 12) + 1;
          // Planets in this sign
          const cellPlanets = planets.filter((p) => p.sign_index === signIdx);

          return (
            <g key={key}>
              {/* House Number in bottom right corner of cell */}
              <text
                x={x + 115}
                y={y + 115}
                textAnchor="end"
                dominantBaseline="alphabetic"
                fontSize="12"
                fontWeight="700"
                fill="#64748b"
              >
                {houseNum}
              </text>

              {/* Planets inside cell */}
              <g transform={`translate(${x + 62}, ${y + 55})`}>
                {cellPlanets.map((p, idx) => {
                  const { name, retro, deg } = formatPlanetLabel(p);
                  const isHighlighted = selectedPlanet === p.name;
                  const color = PLANET_COLORS[p.name] || "#1e293b";
                  const yOffset = (idx - (cellPlanets.length - 1) / 2) * 19;

                  return (
                    <text
                      key={p.name}
                      x="0"
                      y={yOffset}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isHighlighted ? "15" : "13.5"}
                      fontWeight="700"
                      fill={color}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlanet(selectedPlanet === p.name ? null : p.name)}
                    >
                      {name}
                      {retro && <tspan fontSize="10" dy="-2">{retro}</tspan>}
                      <tspan fontSize="10" dy={retro ? "0" : "-4"} fontWeight="600">
                        {deg}°
                      </tspan>
                    </text>
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>
    );
  };

  // -------------------------------------------------------------
  // East Indian (Bengali) Chart Renderer (Matching screenshot 3)
  // -------------------------------------------------------------
  const renderEastChart = () => {
    // East Indian chart format: Outer square divided into 4 triangles and 4 corner trapezoids
    return (
      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-[520px] aspect-square mx-auto select-none font-sans drop-shadow-md"
      >
        <rect width="500" height="500" fill="#ffffff" stroke="#e08e33" strokeWidth="3" />

        {/* Diagonal corners */}
        <line x1="0" y1="0" x2="166" y2="166" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="500" y1="0" x2="334" y2="166" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="0" y1="500" x2="166" y2="334" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="500" y1="500" x2="334" y2="334" stroke="#e08e33" strokeWidth="2.5" />

        {/* Central square */}
        <rect
          x="166"
          y="166"
          width="168"
          height="168"
          fill="none"
          stroke="#e08e33"
          strokeWidth="2.5"
        />

        {/* Internal division lines */}
        <line x1="166" y1="0" x2="166" y2="500" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="334" y1="0" x2="334" y2="500" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="0" y1="166" x2="500" y2="166" stroke="#e08e33" strokeWidth="2.5" />
        <line x1="0" y1="334" x2="500" y2="334" stroke="#e08e33" strokeWidth="2.5" />

        {/* House/Sign boxes for East Indian */}
        {([
          { h: 1, x: 420, y: 250, sign: getNorthHouseSignNumber(1) },
          { h: 2, x: 375, y: 195, sign: getNorthHouseSignNumber(2) },
          { h: 3, x: 345, y: 140, sign: getNorthHouseSignNumber(3) },
          { h: 4, x: 250, y: 100, sign: getNorthHouseSignNumber(4) },
          { h: 5, x: 190, y: 140, sign: getNorthHouseSignNumber(5) },
          { h: 6, x: 140, y: 190, sign: getNorthHouseSignNumber(6) },
          { h: 7, x: 100, y: 250, sign: getNorthHouseSignNumber(7) },
          { h: 8, x: 140, y: 310, sign: getNorthHouseSignNumber(8) },
          { h: 9, x: 190, y: 360, sign: getNorthHouseSignNumber(9) },
          { h: 10, x: 250, y: 400, sign: getNorthHouseSignNumber(10) },
          { h: 11, x: 345, y: 360, sign: getNorthHouseSignNumber(11) },
          { h: 12, x: 375, y: 310, sign: getNorthHouseSignNumber(12) },
        ]).map(({ h, x, y, sign }) => {
          const housePlanets = planetsByHouse[h] || [];
          return (
            <g key={`east-${h}`}>
              <text
                x={x - 20}
                y={y - 15}
                fontSize="12"
                fontWeight="700"
                fill="#64748b"
              >
                {sign}
              </text>
              <g transform={`translate(${x}, ${y})`}>
                {housePlanets.map((p, idx) => {
                  const { name, retro, deg } = formatPlanetLabel(p);
                  const isHighlighted = selectedPlanet === p.name;
                  const color = PLANET_COLORS[p.name] || "#1e293b";
                  const yOffset = (idx - (housePlanets.length - 1) / 2) * 18;

                  return (
                    <text
                      key={p.name}
                      x="0"
                      y={yOffset}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={isHighlighted ? "14.5" : "13"}
                      fontWeight="700"
                      fill={color}
                      className="cursor-pointer"
                      onClick={() => setSelectedPlanet(selectedPlanet === p.name ? null : p.name)}
                    >
                      {name}
                      {retro && <tspan fontSize="9" dy="-2">{retro}</tspan>}
                      <tspan fontSize="9" dy={retro ? "0" : "-3"} fontWeight="600">
                        {deg}
                      </tspan>
                    </text>
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>
    );
  };

  // -------------------------------------------------------------
  // AppliedJyotish Circular Wheel Renderer (Matching screenshot 4)
  // -------------------------------------------------------------
  const renderWheelChart = () => {
    const cx = 250;
    const cy = 250;
    const rOuter = 240;
    const rMiddle = 200;
    const rInner = 140;

    return (
      <svg
        viewBox="0 0 500 500"
        className="w-full max-w-[520px] aspect-square mx-auto select-none font-sans drop-shadow-md"
      >
        <circle cx={cx} cy={cy} r={rOuter} fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={rMiddle} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={rInner} fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />

        {/* 27 Nakshatra outer divisions */}
        {NAKSHATRAS_27.map((nak, i) => {
          const angle = (i * 360) / 27 - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + rMiddle * Math.cos(rad);
          const y1 = cy + rMiddle * Math.sin(rad);
          const x2 = cx + rOuter * Math.cos(rad);
          const y2 = cy + rOuter * Math.sin(rad);

          // Text position
          const midRad = ((angle + 360 / 54) * Math.PI) / 180;
          const tx = cx + (rMiddle + 20) * Math.cos(midRad);
          const ty = cy + (rMiddle + 20) * Math.sin(midRad);
          const rot = angle + 360 / 54 + 90;

          return (
            <g key={`nak-${nak}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="1" />
              <text
                x={tx}
                y={ty}
                fontSize="6.5"
                fontWeight="600"
                fill="#475569"
                textAnchor="middle"
                dominantBaseline="central"
                transform={`rotate(${rot}, ${tx}, ${ty})`}
              >
                {nak}
              </text>
            </g>
          );
        })}

        {/* 12 Rashi Spoke Lines & Zodiac Symbols */}
        {ZODIAC_NAMES_EN.map((sign, i) => {
          const angle = i * 30 - 90;
          const rad = (angle * Math.PI) / 180;
          const x1 = cx + rInner * Math.cos(rad);
          const y1 = cy + rInner * Math.sin(rad);
          const x2 = cx + rMiddle * Math.cos(rad);
          const y2 = cy + rMiddle * Math.sin(rad);

          // Zodiac Glyph
          const midAngle = angle + 15;
          const midRad = (midAngle * Math.PI) / 180;
          const gx = cx + (rInner + 30) * Math.cos(midRad);
          const gy = cy + (rInner + 30) * Math.sin(midRad);

          return (
            <g key={`sign-spoke-${sign}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="1.5" />
              <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#e2e8f0" strokeDasharray="2,3" />
              <text
                x={gx}
                y={gy}
                fontSize="18"
                fill="#94a3b8"
                textAnchor="middle"
                dominantBaseline="central"
                className="opacity-60"
              >
                {ZODIAC_SYMBOLS[i]}
              </text>
            </g>
          );
        })}

        {/* Planets placed by exact degree */}
        {planets.map((p) => {
          // Angle in degrees from top (Aries 0° = top)
          const angle = p.longitude - 90;
          const rad = (angle * Math.PI) / 180;
          const px = cx + 85 * Math.cos(rad);
          const py = cy + 85 * Math.sin(rad);
          const isHighlighted = selectedPlanet === p.name;
          const color = PLANET_COLORS[p.name] || "#1e293b";

          return (
            <g
              key={`wheel-planet-${p.name}`}
              className="cursor-pointer transition-transform"
              onClick={() => setSelectedPlanet(selectedPlanet === p.name ? null : p.name)}
            >
              <circle
                cx={px}
                cy={py}
                r={isHighlighted ? "13" : "11"}
                fill="#ffffff"
                stroke={color}
                strokeWidth={isHighlighted ? "3" : "1.8"}
                className="filter drop-shadow-sm"
              />
              <text
                x={px}
                y={py}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fontWeight="800"
                fill={color}
              >
                {p.name}
              </text>
            </g>
          );
        })}

        {/* Center Logo */}
        <circle cx={cx} cy={cy} r="18" fill="#f1f5f9" stroke="#cbd5e1" />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="9"
          fontWeight="bold"
          fill="#d97706"
        >
          KP
        </text>
      </svg>
    );
  };

  return (
    <div
      ref={chartRef}
      className={`relative rounded-2xl bg-white border border-amber-200/80 p-4 sm:p-6 shadow-sm ${className}`}
    >
      {/* Top Header Controls: Mode Toggles and Style Buttons (matching screenshot) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-100">
        {/* Mode Selector: [Combine] [Rashi] [Bhav] */}
        <div className="inline-flex rounded-lg bg-amber-50/80 p-1 border border-amber-200">
          {(["combine", "rashi", "bhav"] as const).map((mode) => {
            const isActive = chartMode === mode;
            const labels = {
              combine: language === "bn" ? "সম্মিলিত" : language === "hi" ? "संयुक्त" : "Combine",
              rashi: language === "bn" ? "রাশি" : language === "hi" ? "राशि" : "Rashi",
              bhav: language === "bn" ? "ভাব" : language === "hi" ? "भाव" : "Bhav",
            };
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setChartMode(mode)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  isActive
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-amber-900 hover:text-amber-950 hover:bg-amber-100/60"
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>

        {/* Style Selector: [North] [South] [East] [AppliedJyotish (Wheel)] */}
        <div className="inline-flex rounded-lg bg-amber-50/80 p-1 border border-amber-200">
          {(["north", "south", "east", "wheel"] as const).map((style) => {
            const isActive = chartStyle === style;
            const styleLabels = {
              north: language === "bn" ? "উত্তর ভারত" : language === "hi" ? "उत्तर" : "North",
              south: language === "bn" ? "দক্ষিণ ভারত" : language === "hi" ? "दक्षिण" : "South",
              east: language === "bn" ? "পূর্ব ভারত" : language === "hi" ? "पूर्व" : "East",
              wheel: "AppliedJyotish",
            };
            return (
              <button
                key={style}
                type="button"
                onClick={() => setChartStyle(style)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  isActive
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-amber-900 hover:text-amber-950 hover:bg-amber-100/60"
                }`}
              >
                {styleLabels[style]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart SVG Canvas */}
      <div className="py-4">
        {chartStyle === "north" && renderNorthChart()}
        {chartStyle === "south" && renderSouthChart()}
        {chartStyle === "east" && renderEastChart()}
        {chartStyle === "wheel" && renderWheelChart()}
      </div>

      {/* Bottom Planet Pill Selector & Download Button (Matching user screenshot) */}
      <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {planets.map((p) => {
            const isSelected = selectedPlanet === p.name;
            const color = PLANET_COLORS[p.name] || "#1e293b";
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => setSelectedPlanet(isSelected ? null : p.name)}
                className={`px-2.5 py-1 text-xs font-bold rounded-full border transition-all ${
                  isSelected
                    ? "bg-amber-500 text-white border-amber-600 shadow-xs scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50"
                }`}
              >
                <span style={{ color: isSelected ? "#ffffff" : color }}>{p.name}</span>
                <span className="ml-1 text-[10px] opacity-75">
                  {Math.floor(p.degree_in_sign)}°
                </span>
              </button>
            );
          })}
          {selectedPlanet && (
            <button
              type="button"
              onClick={() => setSelectedPlanet(null)}
              className="text-xs text-amber-700 hover:underline px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          title="Download Chart SVG"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save SVG</span>
        </button>
      </div>
    </div>
  );
}
