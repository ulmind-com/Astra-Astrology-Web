"use client";

import * as React from "react";
import { Sparkles, Star } from "lucide-react";

interface NakshatraWheelProps {
  activeNakshatraIndex?: number | null;
  activePada?: number | null;
  onSelectNakshatra?: (index: number) => void;
  language?: "en" | "bn" | "hi";
}

const NAKSHATRAS_WHEEL_DATA = [
  { index: 0, name_en: "Ashwini", name_bn: "অশ্বিনী", name_hi: "अश्विनी", lord: "Ketu", deity: "Ashwini Kumaras" },
  { index: 1, name_en: "Bharani", name_bn: "ভরণী", name_hi: "भरणी", lord: "Venus", deity: "Yamaraja" },
  { index: 2, name_en: "Krittika", name_bn: "কৃত্তিকা", name_hi: "कृत्तिका", lord: "Sun", deity: "Agni" },
  { index: 3, name_en: "Rohini", name_bn: "রোহিণী", name_hi: "रोहिणी", lord: "Moon", deity: "Brahma" },
  { index: 4, name_en: "Mrigashira", name_bn: "মৃগশিরা", name_hi: "मृगशिरा", lord: "Mars", deity: "Soma" },
  { index: 5, name_en: "Ardra", name_bn: "আর্দ্রা", name_hi: "आर्द्रा", lord: "Rahu", deity: "Rudra" },
  { index: 6, name_en: "Punarvasu", name_bn: "পুনর্বসু", name_hi: "पुनर्वसु", lord: "Jupiter", deity: "Aditi" },
  { index: 7, name_en: "Pushya", name_bn: "পুষ্যা", name_hi: "पुष्य", lord: "Saturn", deity: "Brihaspati" },
  { index: 8, name_en: "Ashlesha", name_bn: "অশ্লেষা", name_hi: "आश्लेषा", lord: "Mercury", deity: "Nagas" },
  { index: 9, name_en: "Magha", name_bn: "মঘা", name_hi: "मघा", lord: "Ketu", deity: "Pitris" },
  { index: 10, name_en: "P. Phalguni", name_bn: "পূর্বাফাল্গুনী", name_hi: "पूर्वाफाल्गुनी", lord: "Venus", deity: "Bhaga" },
  { index: 11, name_en: "U. Phalguni", name_bn: "উত্তরাফাল্গুনী", name_hi: "उत्तराफाल्गुनी", lord: "Sun", deity: "Aryaman" },
  { index: 12, name_en: "Hasta", name_bn: "হস্তা", name_hi: "हस्त", lord: "Moon", deity: "Savitar" },
  { index: 13, name_en: "Chitra", name_bn: "চিত্রা", name_hi: "चित्रा", lord: "Mars", deity: "Vishwakarma" },
  { index: 14, name_en: "Swati", name_bn: "স্বাতী", name_hi: "स्वाति", lord: "Rahu", deity: "Vayu" },
  { index: 15, name_en: "Vishakha", name_bn: "বিশাখা", name_hi: "विशाखा", lord: "Jupiter", deity: "Indragni" },
  { index: 16, name_en: "Anuradha", name_bn: "অনুরাধা", name_hi: "अनुराधा", lord: "Saturn", deity: "Mitra" },
  { index: 17, name_en: "Jyeshtha", name_bn: "জ্যেষ্ঠা", name_hi: "ज्येष्ठा", lord: "Mercury", deity: "Indra" },
  { index: 18, name_en: "Mula", name_bn: "মূলা", name_hi: "मूल", lord: "Ketu", deity: "Nirriti" },
  { index: 19, name_en: "P. Ashadha", name_bn: "পূর্বাষাঢ়া", name_hi: "पूर्वाषाढ़ा", lord: "Venus", deity: "Apah" },
  { index: 20, name_en: "U. Ashadha", name_bn: "উত্তরাষাঢ়া", name_hi: "उत्तराषाढ़ा", lord: "Sun", deity: "Vishwadevas" },
  { index: 21, name_en: "Shravana", name_bn: "শ্রবণা", name_hi: "श्रवण", lord: "Moon", deity: "Vishnu" },
  { index: 22, name_en: "Dhanishta", name_bn: "ধনিষ্ঠা", name_hi: "धनिष्ठा", lord: "Mars", deity: "Ashta Vasus" },
  { index: 23, name_en: "Shatabhisha", name_bn: "শতভিষা", name_hi: "शतभिषा", lord: "Rahu", deity: "Varuna" },
  { index: 24, name_en: "P. Bhadrapada", name_bn: "পূর্বভাদ্রপদ", name_hi: "पूर्वाभाद्रपद", lord: "Jupiter", deity: "Aja Ekapada" },
  { index: 25, name_en: "U. Bhadrapada", name_bn: "উত্তরভাদ্রপদ", name_hi: "उत्तराभाद्रपद", lord: "Saturn", deity: "Ahirbudhnya" },
  { index: 26, name_en: "Revati", name_bn: "রেবতী", name_hi: "रेवती", lord: "Mercury", deity: "Pushan" },
];

export function NakshatraWheel({
  activeNakshatraIndex = null,
  activePada = null,
  onSelectNakshatra,
  language = "bn",
}: NakshatraWheelProps) {
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  const displayIdx = hoveredIdx !== null ? hoveredIdx : activeNakshatraIndex;
  const currentStar = displayIdx !== null ? NAKSHATRAS_WHEEL_DATA[displayIdx] : null;

  const cx = 300;
  const cy = 300;
  const rInner = 140;
  const rOuter = 280;
  const numSectors = 27;
  const sectorDeg = 360 / numSectors;

  // Path helper for donut sector
  const getSectorPath = (index: number) => {
    // 0 deg at top = -90 deg in Cartesian
    const startAngle = (index * sectorDeg - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sectorDeg - 90) * (Math.PI / 180);

    const x1 = cx + rOuter * Math.cos(startAngle);
    const y1 = cy + rOuter * Math.sin(startAngle);
    const x2 = cx + rOuter * Math.cos(endAngle);
    const y2 = cy + rOuter * Math.sin(endAngle);

    const x3 = cx + rInner * Math.cos(endAngle);
    const y3 = cy + rInner * Math.sin(endAngle);
    const x4 = cx + rInner * Math.cos(startAngle);
    const y4 = cy + rInner * Math.sin(startAngle);

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;
  };

  const getTextPosition = (index: number) => {
    const midAngle = ((index + 0.5) * sectorDeg - 90) * (Math.PI / 180);
    const textRadius = (rInner + rOuter) / 2;
    const x = cx + textRadius * Math.cos(midAngle);
    const y = cy + textRadius * Math.sin(midAngle);
    const rotationDeg = (index + 0.5) * sectorDeg;
    // Flip text if on bottom half so it remains readable
    const flip = rotationDeg > 90 && rotationDeg < 270;
    const textRotation = flip ? rotationDeg + 180 : rotationDeg;

    return { x, y, rotation: textRotation };
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-[580px] mx-auto">
      <div className="relative w-full aspect-square">
        <svg viewBox="0 0 600 600" className="w-full h-full drop-shadow-xl transition-all duration-300">
          <defs>
            <radialGradient id="nakshatraBgGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="1" />
            </radialGradient>

            <linearGradient id="activeGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.9" />
            </linearGradient>

            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#312e81" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#1e1b4b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* Deep celestial background circle */}
          <circle cx={cx} cy={cy} r={rOuter + 8} fill="url(#nakshatraBgGlow)" stroke="#334155" strokeWidth="2" />

          {/* 27 Nakshatra Sectors */}
          {NAKSHATRAS_WHEEL_DATA.map((nak) => {
            const isNative = activeNakshatraIndex === nak.index;
            const isHovered = hoveredIdx === nak.index;
            const pathData = getSectorPath(nak.index);
            const { x, y, rotation } = getTextPosition(nak.index);

            let sectorFill = nak.index % 2 === 0 ? "rgba(30, 41, 59, 0.45)" : "rgba(15, 23, 42, 0.65)";
            let strokeColor = "rgba(71, 85, 105, 0.4)";
            let strokeW = 1;

            if (isNative) {
              sectorFill = "url(#activeGoldGradient)";
              strokeColor = "#fef08a";
              strokeW = 3;
            } else if (isHovered) {
              sectorFill = "rgba(99, 102, 241, 0.6)";
              strokeColor = "#a5b4fc";
              strokeW = 2;
            }

            const displayName = language === "bn" ? nak.name_bn : (language === "hi" ? nak.name_hi : nak.name_en);

            return (
              <g
                key={nak.index}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIdx(nak.index)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onSelectNakshatra && onSelectNakshatra(nak.index)}
              >
                <path
                  d={pathData}
                  fill={sectorFill}
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  className="transition-colors duration-200"
                />
                <text
                  x={x}
                  y={y}
                  transform={`rotate(${rotation}, ${x}, ${y})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={isNative ? "10.5" : "9.5"}
                  fontWeight={isNative ? "bold" : "500"}
                  fill={isNative ? "#1e1b4b" : isHovered ? "#ffffff" : "#cbd5e1"}
                  className="pointer-events-none tracking-tight select-none font-medium"
                >
                  {displayName}
                </text>
              </g>
            );
          })}

          {/* Inner Central Hub */}
          <circle cx={cx} cy={cy} r={rInner} fill="url(#hubGradient)" stroke="#6366f1" strokeWidth="2.5" />
          <circle cx={cx} cy={cy} r={rInner - 6} fill="none" stroke="#e0e7ff" strokeOpacity="0.2" strokeDasharray="4 4" />

          {/* Central Hub Display Content */}
          {currentStar ? (
            <g className="select-none pointer-events-none">
              <circle
                cx={cx}
                cy={cy - 56}
                r="18"
                fill="rgba(245, 158, 11, 0.2)"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text x={cx} y={cy - 52} textAnchor="middle" fill="#fbbf24" fontSize="16" fontWeight="bold">
                ★
              </text>

              <text
                x={cx}
                y={cy - 20}
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#ffffff"
                className="font-display tracking-wide"
              >
                {language === "bn" ? currentStar.name_bn : (language === "hi" ? currentStar.name_hi : currentStar.name_en)}
              </text>

              <text x={cx} y={cy + 2} textAnchor="middle" fontSize="12" fill="#94a3b8" fontWeight="500">
                {currentStar.name_en} {activePada && activeNakshatraIndex === currentStar.index ? `• Pada ${activePada}` : ""}
              </text>

              <rect
                x={cx - 75}
                y={cy + 16}
                width="150"
                height="24"
                rx="12"
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#6366f1"
                strokeWidth="1"
              />
              <text x={cx} y={cy + 32} textAnchor="middle" fontSize="11" fill="#c7d2fe" fontWeight="600">
                Lord: {currentStar.lord}
              </text>

              <text x={cx} y={cy + 56} textAnchor="middle" fontSize="11" fill="#cbd5e1" fontStyle="italic">
                Deity: {currentStar.deity}
              </text>

              {activeNakshatraIndex === currentStar.index && (
                <text x={cx} y={cy + 76} textAnchor="middle" fontSize="10.5" fill="#fde047" fontWeight="bold">
                  {language === "bn" ? "★ আপনার জন্ম নক্ষত্র" : language === "hi" ? "★ आपका जन्म नक्षत्र" : "★ Your Birth Star"}
                </text>
              )}
            </g>
          ) : (
            <g className="select-none pointer-events-none">
              <text x={cx} y={cy - 12} textAnchor="middle" fontSize="15" fontWeight="600" fill="#e2e8f0">
                {language === "bn" ? "২৭টি বৈদিক নক্ষত্র" : language === "hi" ? "27 वैदिक नक्षत्र" : "27 Vedic Nakshatras"}
              </text>
              <text x={cx} y={cy + 14} textAnchor="middle" fontSize="12" fill="#94a3b8">
                {language === "bn" ? "নক্ষত্রে ক্লিক করে জানুন" : language === "hi" ? "नक्षत्र पर क्लिक करें" : "Hover or click to inspect"}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
          <span className="font-medium text-foreground">
            {language === "bn" ? "আপনার জন্ম নক্ষত্র" : language === "hi" ? "आपका जन्म नक्षत्र" : "Your Birth Star"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-indigo-500" />
          <span className="font-medium text-foreground">
            {language === "bn" ? "নির্বাচিত নক্ষত্র" : language === "hi" ? "चयनित नक्षत्र" : "Selected Star"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-slate-700 border border-slate-600" />
          <span>{language === "bn" ? "অন্যান্য নক্ষত্র" : language === "hi" ? "अन्य नक्षत्र" : "Other Stars"}</span>
        </div>
      </div>
    </div>
  );
}
