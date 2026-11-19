"use client";

import React from "react";

const palette = {
  gold300: "#FCD34D",
  gold400: "#FBBF24",
  gold500: "#F59E0B",
  gold600: "#D97706",
  gold700: "#B45309",
  gold800: "#92400E",
  gold900: "#78350F",
  brand950: "#1E1305",
};

export interface ClipartProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  className?: string;
}





/**
 * 1. Tithi (Lunar Day) Clipart:
 * Sacred Chandra (Moon) with crescent radiance, glowing aura & twinkling celestial stars.
 */
export function TithiMoonClipart({
  size = 44,
  color = palette.gold500,
  secondaryColor = palette.gold300,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="40%" stopColor={secondaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Outer Halo Disc */}
        <circle cx="50" cy="50" r="46" fill="url(#haloGrad)" />
        <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.6} fill="none" />

        {/* Crescent Chandra */}
        <path
          d="M 36 22 A 32 32 0 1 0 74 74 A 25 25 0 1 1 36 22 Z"
          fill="url(#moonGrad)"
        />

        {/* Subtle Crater Embellishments */}
        <circle cx="44" cy="52" r="3" fill="#D97706" opacity={0.35} />
        <circle cx="52" cy="64" r="2.2" fill="#D97706" opacity={0.3} />
        <circle cx="38" cy="62" r="2" fill="#D97706" opacity={0.25} />

        {/* Star Sparkle (Top Right) */}
        <path
          d="M 72 26 Q 72 32 78 32 Q 72 32 72 38 Q 72 32 66 32 Q 72 32 72 26 Z"
          fill={color}
        />
        {/* Secondary Tiny Star */}
        <circle cx="82" cy="46" r="1.5" fill="#FDE68A" />
        <circle cx="28" cy="36" r="1.2" fill="#FDE68A" />
      </svg>
    </div>
  );
}

/**
 * 2. Nakshatra (Lunar Mansion / Constellation) Clipart:
 * Sacred 8-pointed geometric Vedic star (Ashtadala) with cosmic constellation orbital lines.
 */
export function NakshatraStarClipart({
  size = 44,
  color = palette.gold500,
  secondaryColor = palette.gold300,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="50%" stopColor={secondaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Orbital Ellipse */}
        <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity={0.4} fill="none" />
        <circle cx="50" cy="50" r="32" stroke={color} strokeWidth="0.75" opacity={0.3} fill="none" />

        {/* 8-point geometric star */}
        {/* Main 4-point cardinal diamond */}
        <polygon points="50,14 61,42 86,50 61,58 50,86 39,58 14,50 39,42" fill="url(#starGrad)" />
        {/* Diagonal 4-point diamond */}
        <polygon points="50,26 58,44 74,50 58,56 50,74 42,56 26,50 42,44" fill={color} opacity={0.7} />

        {/* Center Radiant Core */}
        <circle cx="50" cy="50" r="6" fill="#FFFBEB" />
        <circle cx="50" cy="50" r="2.5" fill={palette.gold700} />

        {/* Constellation Nodes */}
        <circle cx="24" cy="24" r="2" fill={color} />
        <circle cx="76" cy="76" r="2" fill={color} />
        <circle cx="76" cy="24" r="1.5" fill={color} opacity={0.7} />
        <circle cx="24" cy="76" r="1.5" fill={color} opacity={0.7} />
      </svg>
    </div>
  );
}

/**
 * 3. Yoga (Solar-Lunar Cosmic Harmony) Clipart:
 * Sacred union of Surya (Sun) and Soma (Moon) interlocking in eternal celestial yoga.
 */
export function YogaUnionClipart({
  size = 44,
  color = palette.gold500,
  secondaryColor = "#D97706",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Circular Aura */}
        <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity={0.45} fill="none" />

        {/* Solar Rays on Left Side */}
        <g stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="50" x2="8" y2="50" />
          <line x1="24" y1="32" x2="15" y2="23" />
          <line x1="24" y1="68" x2="15" y2="77" />
          <line x1="38" y1="20" x2="34" y2="10" />
          <line x1="38" y1="80" x2="34" y2="90" />
        </g>

        {/* Half Sun (Left side) */}
        <path d="M 50 24 A 26 26 0 0 0 50 76 Z" fill="url(#sunGrad)" />

        {/* Crescent Moon (Right side embracing Sun) */}
        <path
          d="M 50 24 A 26 26 0 0 1 50 76 A 21 21 0 0 0 50 24 Z"
          fill="#FEF3C7"
          stroke={color}
          strokeWidth="1"
        />

        {/* Center Bindu (Cosmic Point of Union) */}
        <circle cx="50" cy="50" r="4" fill="#92400E" />
        <circle cx="50" cy="50" r="1.5" fill="#FFF" />
      </svg>
    </div>
  );
}

/**
 * 4. Karana (Half-Tithi Duration) Clipart:
 * Sacred Mangal Kalash (Divine Pot) with mango leaves (Amra Pallava) and blessed coconut.
 */
export function KaranaKalashClipart({
  size = 44,
  color = palette.gold500,
  secondaryColor = "#D97706",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="kalashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="40%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="1" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
            <stop offset="100%" stopColor="#047857" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Sacred Aura */}
        <circle cx="50" cy="52" r="44" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.35} fill="none" />

        {/* Sacred Mango Leaves Sprouting from Neck */}
        {/* Left Leaf */}
        <path d="M 50 42 C 34 32 30 18 34 16 C 42 16 48 30 50 42 Z" fill="url(#leafGrad)" />
        {/* Right Leaf */}
        <path d="M 50 42 C 66 32 70 18 66 16 C 58 16 52 30 50 42 Z" fill="url(#leafGrad)" />
        {/* Center Leaf */}
        <path d="M 50 42 C 44 26 46 12 50 10 C 54 12 56 26 50 42 Z" fill="#34D399" />

        {/* Sacred Coconut on Top */}
        <circle cx="50" cy="27" r="10" fill="#92400E" />
        <circle cx="50" cy="22" r="3" fill="#D97706" />

        {/* Kalash Neck Ring */}
        <rect x="41" y="40" width="18" height="6" rx="2" fill={secondaryColor} />

        {/* Main Kalash Body / Pot */}
        <path
          d="M 43 46 C 26 49 24 78 36 84 C 42 87 58 87 64 84 C 76 78 74 49 57 46 Z"
          fill="url(#kalashGrad)"
        />

        {/* Kalash Base Pedestal */}
        <rect x="38" y="83" width="24" height="5" rx="2" fill={secondaryColor} />

        {/* Auspicious Swastika / Tilak Mark on Kalash */}
        <path
          d="M 50 56 L 50 72 M 42 64 L 58 64 M 50 56 L 56 56 M 58 64 L 58 70 M 50 72 L 44 72 M 42 64 L 42 58"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * 5. Vara (Weekday Planetary Ruler) Clipart:
 * Radiant 12-ray Surya Chariot Wheel with divine planetary orb and golden spokes.
 */
export function VaraSunClipart({
  size = 44,
  color = palette.gold500,
  secondaryColor = "#D97706",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Radiant Sun Rays */}
        <g stroke={color} strokeWidth="2.5" strokeLinecap="round">
          <line x1="50" y1="12" x2="50" y2="4" />
          <line x1="50" y1="88" x2="50" y2="96" />
          <line x1="12" y1="50" x2="4" y2="50" />
          <line x1="88" y1="50" x2="96" y2="50" />
          <line x1="23" y1="23" x2="17" y2="17" />
          <line x1="77" y1="77" x2="83" y2="83" />
          <line x1="23" y1="77" x2="17" y2="83" />
          <line x1="77" y1="23" x2="83" y2="17" />
        </g>

        {/* Outer Wheel Rim */}
        <circle cx="50" cy="50" r="35" stroke="url(#wheelGrad)" strokeWidth="4" fill="none" />
        <circle cx="50" cy="50" r="30" stroke={secondaryColor} strokeWidth="1" strokeDasharray="3 2" fill="none" />

        {/* 8 Surya Chariot Spokes */}
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="20" y1="50" x2="80" y2="50" />
          <line x1="29" y1="29" x2="71" y2="71" />
          <line x1="29" y1="71" x2="71" y2="29" />
        </g>

        {/* Central Solar Hub */}
        <circle cx="50" cy="50" r="12" fill="url(#wheelGrad)" />
        <circle cx="50" cy="50" r="6" fill="#DC2626" />
        <circle cx="50" cy="50" r="2.5" fill="#FFF" />
      </svg>
    </div>
  );
}

/**
 * 6. Vedic Disha Shoola Compass Clipart:
 * Sacred 8-Direction Lotus Compass (Ashta Dikpala) indicating cardinal & ordinal directions.
 * Dynamically highlights the inauspicious Disha Shoola travel direction in crimson red.
 */
export function VedicCompassClipart({
  size = 110,
  blockedDirection = "North",
  isBn = false,
}: {
  size?: number;
  blockedDirection?: string;
  isBn?: boolean;
}) {
  const norm = (blockedDirection || "").toLowerCase();
  const isNorth = norm.includes("north") || norm.includes("উত্তর");
  const isSouth = norm.includes("south") || norm.includes("দক্ষিণ");
  const isEast = norm.includes("east") || norm.includes("পূর্ব");
  const isWest = norm.includes("west") || norm.includes("পশ্চিম");
  const isNE = norm.includes("north-east") || norm.includes("northeast") || norm.includes("ঈশান");
  const isSE = norm.includes("south-east") || norm.includes("southeast") || norm.includes("অগ্নি");
  const isSW = norm.includes("south-west") || norm.includes("southwest") || norm.includes("নৈঋত");
  const isNW = norm.includes("north-west") || norm.includes("northwest") || norm.includes("বায়ু");

  const gold = palette.gold500;
  const darkGold = palette.gold700;
  const danger = "#EF4444";

  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 160 160">
        <defs>
          <linearGradient id="compassBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Outer Dial Circle */}
        <circle cx="80" cy="80" r="76" stroke={gold} strokeWidth="1.5" fill="none" opacity={0.6} />
        <circle cx="80" cy="80" r="72" stroke={darkGold} strokeWidth="0.8" strokeDasharray="3 3" fill="none" />
        <circle cx="80" cy="80" r="66" fill="url(#compassBg)" stroke={gold} strokeWidth="1.2" />

        {/* Cardinal Petals */}
        {/* NORTH */}
        <polygon
          points="80,18 87,70 80,80 73,70"
          fill={isNorth ? danger : "#DC2626"}
        />
        <polygon
          points="80,18 73,70 80,80"
          fill={isNorth ? "#991B1B" : "#B91C1C"}
        />

        {/* SOUTH */}
        <polygon
          points="80,142 87,90 80,80 73,90"
          fill={isSouth ? danger : darkGold}
        />
        <polygon
          points="80,142 73,90 80,80"
          fill={isSouth ? "#991B1B" : palette.gold800}
        />

        {/* EAST */}
        <polygon
          points="142,80 90,87 80,80 90,73"
          fill={isEast ? danger : darkGold}
        />
        <polygon
          points="142,80 90,87 80,80"
          fill={isEast ? "#991B1B" : palette.gold800}
        />

        {/* WEST */}
        <polygon
          points="18,80 70,87 80,80 70,73"
          fill={isWest ? danger : darkGold}
        />
        <polygon
          points="18,80 70,73 80,80"
          fill={isWest ? "#991B1B" : palette.gold800}
        />

        {/* Diagonal Pointers */}
        {/* NE */}
        <polygon points="124,36 86,74 80,80 84,70" fill={isNE ? danger : gold} opacity={0.8} />
        {/* NW */}
        <polygon points="36,36 74,74 80,80 70,84" fill={isNW ? danger : gold} opacity={0.8} />
        {/* SE */}
        <polygon points="124,124 86,86 80,80 84,90" fill={isSE ? danger : gold} opacity={0.8} />
        {/* SW */}
        <polygon points="36,124 74,86 80,80 70,76" fill={isSW ? danger : gold} opacity={0.8} />

        {/* Central Astrological Gem / Hub */}
        <circle cx="80" cy="80" r="11" fill="#FFF" stroke={gold} strokeWidth="2" />
        <circle cx="80" cy="80" r="6" fill={palette.gold700} />
        <circle cx="80" cy="80" r="2.5" fill="#FFF" />

        {/* Direction Labels */}
        <text
          x="80"
          y="14"
          fill={isNorth ? danger : "#B91C1C"}
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {isBn ? "উ (N)" : "N"}
        </text>

        <text
          x="80"
          y="155"
          fill={isSouth ? danger : palette.gold900}
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {isBn ? "দ (S)" : "S"}
        </text>

        <text
          x="153"
          y="83"
          fill={isEast ? danger : palette.gold900}
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {isBn ? "পূ" : "E"}
        </text>

        <text
          x="7"
          y="83"
          fill={isWest ? danger : palette.gold900}
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          {isBn ? "প" : "W"}
        </text>
      </svg>
    </div>
  );
}

/**
 * 7. Surya-Chandra Horizon Arc Clipart:
 * Panoramic celestial hemisphere depicting sunrise to sunset, with Abhijit Muhurat at the apex
 * and Rahu Kaal window marked directly along the arc.
 */
export function SuryaChandraHorizonArc({
  sunrise = "05:42 AM",
  sunset = "05:35 PM",
  abhijit = "11:38 AM - 12:24 PM",
  rahuKaal = "04:15 PM - 05:40 PM",
  isBn = false,
}: {
  sunrise?: string;
  sunset?: string;
  abhijit?: string;
  rahuKaal?: string;
  isBn?: boolean;
}) {
  return (
    <div className="w-full flex items-center justify-center">
      <svg width="100%" height={155} viewBox="0 0 360 155">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFBEB" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Sky Fill under Arch */}
        <path
          d="M 30 135 A 150 115 0 0 1 330 135 Z"
          fill="url(#skyGrad)"
        />

        {/* Celestial Semicircle Track */}
        <path
          d="M 30 135 A 150 115 0 0 1 330 135"
          fill="none"
          stroke="url(#arcGlow)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Orbital Dotted Companion Arc */}
        <path
          d="M 45 135 A 135 102 0 0 1 315 135"
          fill="none"
          stroke="#D97706"
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity={0.4}
        />

        {/* Horizon Baseline */}
        <line x1="15" y1="135" x2="345" y2="135" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="6 4" />

        {/* ================= EAST / SUNRISE (Left) ================= */}
        <g transform="translate(30, 135)">
          {/* Glowing Sun disc */}
          <circle cx="0" cy="0" r="14" fill="#FDE68A" opacity={0.6} />
          <circle cx="0" cy="0" r="9" fill="#F59E0B" />
          <circle cx="0" cy="0" r="5" fill="#FFF" />
          {/* Rays */}
          <line x1="-12" y1="-7" x2="-18" y2="-11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="-14" x2="0" y2="-21" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="-7" x2="18" y2="-11" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Sunrise Label */}
        <text x="32" y="150" fill="#92400E" fontSize="10" fontWeight="bold" textAnchor="middle">
          {isBn ? "সূর্যোদয়" : "Sunrise"} {sunrise}
        </text>

        {/* ================= ZENITH / ABHIJIT MUHURAT (Apex Center) ================= */}
        <g transform="translate(180, 20)">
          {/* Auspicious Jewel Beacon */}
          <circle cx="0" cy="0" r="18" fill="rgba(16, 185, 129, 0.18)" />
          <circle cx="0" cy="0" r="11" fill="#10B981" />
          <circle cx="0" cy="0" r="5" fill="#FFF" />
          {/* Crown Peak */}
          <polygon points="0,-16 -4,-11 4,-11" fill="#F59E0B" />
        </g>

        <text x="180" y="44" fill="#065F46" fontSize="10" fontWeight="bold" textAnchor="middle">
          ✨ {isBn ? "অভিজিৎ মুহূর্ত" : "Abhijit Muhurat"}
        </text>
        <text x="180" y="56" fill="#047857" fontSize="9" fontWeight="600" textAnchor="middle">
          {abhijit}
        </text>

        {/* ================= WEST / SUNSET (Right) ================= */}
        <g transform="translate(330, 135)">
          {/* Twilight Sun disc */}
          <circle cx="0" cy="0" r="14" fill="#FED7AA" opacity={0.6} />
          <circle cx="0" cy="0" r="9" fill="#EA580C" />
          <circle cx="0" cy="0" r="5" fill="#FFF" />
          {/* Rays */}
          <line x1="-12" y1="-7" x2="-18" y2="-11" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="-14" x2="0" y2="-21" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="-7" x2="18" y2="-11" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Sunset Label */}
        <text x="328" y="150" fill="#9A3412" fontSize="10" fontWeight="bold" textAnchor="middle">
          {isBn ? "সূর্যাস্ত" : "Sunset"} {sunset}
        </text>

        {/* ================= RAHU KAAL BADGE ON ARC ================= */}
        <g transform="translate(268, 70)">
          <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#EF4444" opacity={0.92} />
          <text x="0" y="3" fill="#FFF" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            ⚠ {isBn ? "রাহু কাল" : "Rahu Kaal"}
          </text>
        </g>
        <text x="268" y="93" fill="#B91C1C" fontSize="8.5" fontWeight="600" textAnchor="middle">
          {rahuKaal}
        </text>
      </svg>
    </div>
  );
}


