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
 * 1. Diwali & Kali Puja:
 * Radiant golden earthen diya on blooming lotus base, glowing flame & spark auras.
 */
export function DiwaliLakshmiDiyaClipart({
  size = 56,
  color = palette.gold500,
  secondaryColor = "#F97316",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="diwaliDiyaFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id="diwaliDiyaPot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="diwaliGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Glow */}
        <circle cx="50" cy="40" r="36" fill="url(#diwaliGlow)" />

        {/* Lotus Petal Base */}
        <path d="M 50 84 C 40 84 32 76 34 70 C 40 74 46 76 50 76 C 54 76 60 74 66 70 C 68 76 60 84 50 84 Z" fill="#EC4899" opacity={0.85} />
        <path d="M 30 76 C 22 74 20 66 24 62 C 28 66 32 70 36 72 Z" fill="#DB2777" opacity={0.7} />
        <path d="M 70 76 C 78 74 80 66 76 62 C 72 66 68 70 64 72 Z" fill="#DB2777" opacity={0.7} />

        {/* Earthen Terracotta Diya Clay Bowl */}
        <path d="M 20 54 Q 50 78 80 54 Q 72 70 50 72 Q 28 70 20 54 Z" fill="url(#diwaliDiyaPot)" />
        <ellipse cx="50" cy="54" rx="30" ry="6" fill="#B45309" stroke={color} strokeWidth="1" />

        {/* Ghee Pool */}
        <ellipse cx="50" cy="54" rx="22" ry="3.5" fill="#FBBF24" />

        {/* Flickering Flame with Core */}
        <path d="M 50 52 C 40 44 42 26 50 12 C 58 26 60 44 50 52 Z" fill="url(#diwaliDiyaFlame)" />
        <path d="M 50 49 C 45 44 46 32 50 22 C 54 32 55 44 50 49 Z" fill="#FFFFFF" opacity={0.9} />

        {/* Radiant Sparkle Stars */}
        <path d="M 50 6 Q 50 9 53 9 Q 50 9 50 12 Q 50 9 47 9 Q 50 9 50 6 Z" fill="#FDE047" />
        <circle cx="26" cy="30" r="1.5" fill={color} />
        <circle cx="74" cy="30" r="1.5" fill={color} />
        <circle cx="18" cy="44" r="1" fill={secondaryColor} />
        <circle cx="82" cy="44" r="1" fill={secondaryColor} />
      </svg>
    </div>
  );
}

/**
 * 2. Maha Durga Puja:
 * Sacred Golden Trishul (Trident), Divine Third Eye, Conch Shell & Sindoor Halo.
 */
export function DurgaPujaTrishulClipart({
  size = 56,
  color = "#E11D48",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="durgaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="sindoorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BE123C" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#BE123C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Auspicious Red/Gold Aura */}
        <circle cx="50" cy="50" r="46" fill="url(#sindoorGlow)" />
        <circle cx="50" cy="50" r="40" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} fill="none" />

        {/* Central Trishul Staff (Gold) */}
        <rect x="48" y="32" width="4" height="54" rx="2" fill="url(#durgaGold)" />

        {/* Trishul Prongs (Left, Center, Right) */}
        {/* Center Spear */}
        <path d="M 50 10 L 55 34 L 50 32 L 45 34 Z" fill="url(#durgaGold)" />
        {/* Left Crescent Prong */}
        <path d="M 46 34 C 34 32 24 24 24 16 C 24 28 36 40 48 42 Z" fill="url(#durgaGold)" />
        {/* Right Crescent Prong */}
        <path d="M 54 34 C 66 32 76 24 76 16 C 76 28 64 40 52 42 Z" fill="url(#durgaGold)" />

        {/* Divine Third Eye (Trinetra) in center */}
        <path d="M 38 52 Q 50 42 62 52 Q 50 62 38 52 Z" fill="#FFFBEB" stroke="#B45309" strokeWidth="1" />
        <circle cx="50" cy="52" r="3.5" fill="#BE123C" />
        <circle cx="50" cy="52" r="1.5" fill="#1E293B" />

        {/* Sacred Conch (Shankha) & Marigold Garland Accent */}
        <path d="M 40 68 Q 50 74 60 68" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="70" r="2" fill="#BE123C" />
        <circle cx="50" cy="72" r="2.5" fill="#F59E0B" />
        <circle cx="56" cy="70" r="2" fill="#BE123C" />
      </svg>
    </div>
  );
}

/**
 * 3. Maha Shivaratri:
 * Holy Shiva Trishul, Sacred Damru drum, Bilva Leaf & Neelkanth Crescent Moon.
 */
export function ShivaratriTrishulDamruClipart({
  size = 56,
  color = "#6366F1",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="shivaBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id="shivaMoon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C7D2FE" />
          </linearGradient>
        </defs>

        {/* Celestial Midnight Aura */}
        <circle cx="50" cy="50" r="45" fill="#4F46E5" opacity={0.12} />
        <circle cx="50" cy="50" r="40" stroke="#818CF8" strokeWidth="1" strokeDasharray="4 2" opacity={0.4} fill="none" />

        {/* Sacred Crescent Moon (Chandra) on crest */}
        <path d="M 52 14 A 12 12 0 1 0 68 34 A 9 9 0 1 1 52 14 Z" fill="url(#shivaMoon)" />

        {/* Trishul Shaft */}
        <line x1="50" y1="20" x2="50" y2="88" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

        {/* Trishul Head */}
        <path d="M 50 16 L 54 32 L 50 30 L 46 32 Z" fill="#94A3B8" />
        <path d="M 46 32 C 36 30 28 22 30 16 C 30 26 38 36 48 38 Z" fill="#94A3B8" />
        <path d="M 54 32 C 64 30 72 22 70 16 C 70 26 62 36 52 38 Z" fill="#94A3B8" />

        {/* Sacred Damru (Hourglass drum) attached to staff */}
        <polygon points="40,46 60,46 48,54 40,46" fill="#F59E0B" />
        <polygon points="40,62 60,62 48,54 40,62" fill="#D97706" />
        <line x1="40" y1="46" x2="60" y2="46" stroke="#92400E" strokeWidth="1.5" />
        <line x1="40" y1="62" x2="60" y2="62" stroke="#92400E" strokeWidth="1.5" />
        <circle cx="48" cy="54" r="2.5" fill="#B45309" />
        {/* Damru beads */}
        <line x1="48" y1="54" x2="34" y2="52" stroke="#D97706" strokeWidth="1" />
        <circle cx="34" cy="52" r="2" fill="#F59E0B" />
        <line x1="48" y1="54" x2="62" y2="56" stroke="#D97706" strokeWidth="1" />
        <circle cx="62" cy="56" r="2" fill="#F59E0B" />

        {/* Sacred Belpatra (Bilva 3-Leaf) at bottom */}
        <path d="M 50 72 C 46 66 42 66 44 72 C 46 76 50 76 50 72 Z" fill="#10B981" />
        <path d="M 50 72 C 54 66 58 66 56 72 C 54 76 50 76 50 72 Z" fill="#10B981" />
        <path d="M 50 70 C 47 62 53 62 50 70 Z" fill="#059669" />
      </svg>
    </div>
  );
}

/**
 * 4. Holi & Dol Yatra:
 * Colorful clay bowls of organic Gulal powders, festive splashes & joyous Pichkari stream.
 */
export function HoliColorsPitchkariClipart({
  size = 56,
  color = "#EC4899",
  secondaryColor = "#8B5CF6",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="holiPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#DB2777" />
          </linearGradient>
          <linearGradient id="holiYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <linearGradient id="holiCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Vibrant Splash Halo */}
        <path d="M 50 18 Q 65 14 72 26 Q 84 38 78 52 Q 86 68 70 76 Q 50 86 32 78 Q 16 66 22 48 Q 14 30 30 22 Z" fill="#FDF2F8" opacity={0.6} />

        {/* Left Bowl (Gulal Pink) */}
        <ellipse cx="34" cy="68" rx="18" ry="7" fill="#BE185D" />
        <path d="M 18 66 Q 34 84 50 66 Z" fill="#9D174D" />
        {/* Pink powder mound */}
        <path d="M 20 65 Q 34 46 48 65 Z" fill="url(#holiPink)" />

        {/* Right Bowl (Yellow Chandan / Abir) */}
        <ellipse cx="66" cy="68" rx="18" ry="7" fill="#B45309" />
        <path d="M 50 66 Q 66 84 82 66 Z" fill="#78350F" />
        {/* Yellow powder mound */}
        <path d="M 52 65 Q 66 46 80 65 Z" fill="url(#holiYellow)" />

        {/* Water Pichkari Gun */}
        <g transform="rotate(-35 50 40)">
          <rect x="38" y="24" width="24" height="8" rx="3" fill="#059669" />
          <rect x="30" y="26" width="8" height="4" rx="1" fill="#10B981" />
          <rect x="62" y="26.5" width="12" height="3" fill="#D97706" />
          <circle cx="76" cy="28" r="2.5" fill="#F59E0B" />
        </g>

        {/* Dynamic Flying Droplets & Powder Clouds */}
        <circle cx="30" cy="34" r="4" fill="#EC4899" />
        <circle cx="20" cy="42" r="2.5" fill="#F472B6" />
        <circle cx="72" cy="32" r="3.5" fill="#F59E0B" />
        <circle cx="84" cy="40" r="2.5" fill="#FDE047" />
        <circle cx="50" cy="22" r="3" fill="#06B6D4" />
      </svg>
    </div>
  );
}

/**
 * 5. Saraswati Puja / Vasant Panchami:
 * Sacred Veena, Vedic Grantha manuscript & Peacock feather (Mayur Pankh).
 */
export function SaraswatiVeenaBookClipart({
  size = 56,
  color = "#EAB308",
  secondaryColor = "#10B981",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="veenaWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="peacockFeather" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>

        {/* Radiant Knowledge Halo */}
        <circle cx="50" cy="50" r="44" fill="#FEF3C7" opacity={0.5} />
        <circle cx="50" cy="50" r="38" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 3" opacity={0.6} fill="none" />

        {/* Sacred Grantha (Palm-leaf manuscript) at base */}
        <rect x="26" y="70" width="48" height="12" rx="3" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
        <line x1="30" y1="74" x2="70" y2="74" stroke="#D97706" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="30" y1="78" x2="64" y2="78" stroke="#D97706" strokeWidth="1" strokeDasharray="4 2" />

        {/* Classical Veena Diagonal Body */}
        <g transform="rotate(-30 50 48)">
          {/* Lower Gourd Resonator */}
          <circle cx="30" cy="50" r="14" fill="url(#veenaWood)" stroke="#F59E0B" strokeWidth="1" />
          <circle cx="30" cy="50" r="6" fill="#FBBF24" />
          {/* Veena Neck / Fretboard */}
          <rect x="30" y="47" width="44" height="6" rx="2" fill="url(#veenaWood)" />
          {/* Upper Dragon / Swan Head Pegbox */}
          <circle cx="76" cy="50" r="7" fill="url(#veenaWood)" />
          {/* Strings */}
          <line x1="30" y1="48" x2="76" y2="48" stroke="#FFFBEB" strokeWidth="0.8" />
          <line x1="30" y1="50" x2="76" y2="50" stroke="#FFFBEB" strokeWidth="0.8" />
          <line x1="30" y1="52" x2="76" y2="52" stroke="#FFFBEB" strokeWidth="0.8" />
        </g>

        {/* Mayur Pankh (Peacock Feather) standing upright */}
        <path d="M 66 40 C 60 26 72 16 78 24 C 82 32 72 44 66 40 Z" fill="url(#peacockFeather)" />
        <circle cx="72" cy="27" r="3.5" fill="#FBBF24" />
        <circle cx="72" cy="27" r="1.5" fill="#3B82F6" />
      </svg>
    </div>
  );
}

/**
 * 6. Krishna Janmashtami:
 * Golden Bansuri Flute with Peacock Feather, Holy Makhan Handi & butter drips.
 */
export function KrishnaFluteFeatherClipart({
  size = 56,
  color = "#3B82F6",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="krishnaFlute" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="makhanPot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        {/* Celestial Midnight Aura */}
        <circle cx="50" cy="50" r="44" fill="#EFF6FF" opacity={0.6} />

        {/* Makhan Matka (Butter Earthen Pot) */}
        <path d="M 32 60 C 26 68 30 84 50 84 C 70 84 74 68 68 60 Z" fill="url(#makhanPot)" stroke="#B45309" strokeWidth="1" />
        <ellipse cx="50" cy="60" rx="18" ry="5" fill="#FEF3C7" />
        {/* Overflowing Makhan (Butter foam) */}
        <path d="M 36 60 Q 42 54 48 57 Q 54 52 62 58 Q 50 63 36 60 Z" fill="#FFFFFF" />
        <path d="M 46 60 Q 48 68 47 72" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Divine Golden Bansuri Flute (diagonal across pot) */}
        <g transform="rotate(-28 50 40)">
          <rect x="16" y="38" width="68" height="6" rx="2" fill="url(#krishnaFlute)" stroke="#B45309" strokeWidth="0.8" />
          {/* Finger Holes */}
          <circle cx="36" cy="41" r="1.2" fill="#78350F" />
          <circle cx="44" cy="41" r="1.2" fill="#78350F" />
          <circle cx="52" cy="41" r="1.2" fill="#78350F" />
          <circle cx="60" cy="41" r="1.2" fill="#78350F" />
          <circle cx="68" cy="41" r="1.2" fill="#78350F" />

          {/* Golden Tassel (Ghanti) */}
          <path d="M 20 44 L 18 54 M 20 44 L 22 54" stroke="#D97706" strokeWidth="1" />
          <circle cx="18" cy="55" r="1.5" fill="#EF4444" />
          <circle cx="22" cy="55" r="1.5" fill="#F59E0B" />
        </g>

        {/* Mayur Pankh Crown (Peacock feather tucked into flute) */}
        <path d="M 30 32 C 22 18 36 10 42 20 C 46 28 34 38 30 32 Z" fill="#047857" />
        <circle cx="35" cy="21" r="4.5" fill="#06B6D4" />
        <circle cx="35" cy="21" r="2" fill="#1E3A8A" />
      </svg>
    </div>
  );
}

/**
 * 7. Makar Sankranti:
 * Radiant Uttarayana Surya Chakra, soaring festival Kite & Sugarcane stalks.
 */
export function SankrantiSunKiteClipart({
  size = 56,
  color = "#F59E0B",
  secondaryColor = "#10B981",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="sankrantiSun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="kiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Golden Uttarayana Solar Chakra on background */}
        <circle cx="44" cy="52" r="24" fill="url(#sankrantiSun)" />
        <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
          <line x1="44" y1="22" x2="44" y2="26" />
          <line x1="44" y1="78" x2="44" y2="82" />
          <line x1="14" y1="52" x2="18" y2="52" />
          <line x1="70" y1="52" x2="74" y2="52" />
          <line x1="23" y1="31" x2="26" y2="34" />
          <line x1="62" y1="70" x2="65" y2="73" />
        </g>

        {/* Soaring Colorful Patang (Festival Kite) */}
        <polygon points="65,12 85,28 65,44 45,28" fill="url(#kiteGrad)" stroke="#FFFFFF" strokeWidth="1" />
        <line x1="65" y1="12" x2="65" y2="44" stroke="#FFFBEB" strokeWidth="1" />
        <path d="M 45 28 Q 65 34 85 28" stroke="#FFFBEB" strokeWidth="1" fill="none" />
        {/* Kite tail */}
        <polygon points="65,44 60,52 70,52" fill="#FBBF24" />
        <path d="M 65 52 Q 62 60 67 66 Q 63 74 68 80" stroke="#F59E0B" strokeWidth="1" fill="none" />

        {/* Sugarcane (Ikshu) stalks at bottom */}
        <line x1="22" y1="84" x2="28" y2="60" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <line x1="28" y1="84" x2="32" y2="62" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 28 60 Q 22 52 14 56" stroke="#059669" strokeWidth="1.5" fill="none" />
        <path d="M 32 62 Q 38 54 44 58" stroke="#10B981" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

/**
 * 8. Navratri & Ghatasthapana:
 * Sacred Mangal Ghat Kalash with sprouted barley (Jowar), coconut & red Chunri ribbon.
 */
export function NavratriGhatSthapanaClipart({
  size = 56,
  color = "#E11D48",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="ghatCopper" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#9A3412" />
          </linearGradient>
          <linearGradient id="coconutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>
        </defs>

        {/* Auspicious Shakti Aura */}
        <circle cx="50" cy="50" r="44" fill="#FFF1F2" opacity={0.6} />

        {/* Earthen Ghat Tray with sprouted sacred barley grass (Jowar) */}
        <ellipse cx="50" cy="80" rx="36" ry="8" fill="#78350F" />
        <path d="M 20 80 Q 24 70 28 78 Q 34 68 38 78 Q 44 66 50 78 Q 56 66 62 78 Q 68 68 72 78 Q 78 70 80 80 Z" fill="#16A34A" />

        {/* Sacred Copper Kalash Pot */}
        <path d="M 32 54 C 28 66 32 76 50 76 C 68 76 72 66 68 54 Z" fill="url(#ghatCopper)" />
        <ellipse cx="50" cy="54" rx="18" ry="4" fill="#C2410C" stroke="#FDBA74" strokeWidth="1" />

        {/* Red Mauli thread wrapped around Kalash neck */}
        <rect x="40" y="52" width="20" height="3" fill="#BE123C" />
        {/* Auspicious Golden Swastika on Kalash */}
        <path d="M 48 61 L 52 61 M 50 59 L 50 67 M 48 59 L 48 61 M 52 65 L 52 67" stroke="#FDE047" strokeWidth="1.2" strokeLinecap="round" />

        {/* Mango Leaves (5 leaves spreading out) */}
        <path d="M 50 52 C 40 44 32 40 28 42 C 34 46 44 50 50 52 Z" fill="#15803D" />
        <path d="M 50 52 C 60 44 68 40 72 42 C 66 46 56 50 50 52 Z" fill="#15803D" />
        <path d="M 50 52 C 42 38 38 30 42 28 C 46 36 48 44 50 52 Z" fill="#16A34A" />
        <path d="M 50 52 C 58 38 62 30 58 28 C 54 36 52 44 50 52 Z" fill="#16A34A" />

        {/* Consecrated Coconut with red Chunri cloth & tilak */}
        <circle cx="50" cy="34" r="10" fill="url(#coconutGrad)" />
        <path d="M 44 32 C 48 26 52 26 56 32 Z" fill="#BE123C" />
        <circle cx="50" cy="35" r="1.5" fill="#EF4444" />
      </svg>
    </div>
  );
}

/**
 * 9. Jagannath Rath Yatra:
 * Grand Nandighosa Chariot Spoke Wheel, holy Flag & sacred garland.
 */
export function RathYatraChariotWheelClipart({
  size = 56,
  color = "#D97706",
  secondaryColor = "#DC2626",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="chariotWood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="40%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {/* Sacred Halo */}
        <circle cx="50" cy="50" r="44" fill="#FEF3C7" opacity={0.5} />

        {/* Grand Wooden Rath Wheel (Outer & Inner Rims) */}
        <circle cx="50" cy="54" r="34" stroke="url(#chariotWood)" strokeWidth="6" fill="none" />
        <circle cx="50" cy="54" r="30" stroke="#78350F" strokeWidth="1" fill="none" />
        <circle cx="50" cy="54" r="10" fill="url(#chariotWood)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="50" cy="54" r="4" fill="#FEF3C7" />

        {/* 16 Sacred Spokes */}
        <g stroke="#B45309" strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="20" x2="50" y2="44" />
          <line x1="50" y1="64" x2="50" y2="88" />
          <line x1="16" y1="54" x2="40" y2="54" />
          <line x1="60" y1="54" x2="84" y2="54" />
          <line x1="26" y1="30" x2="43" y2="47" />
          <line x1="57" y1="61" x2="74" y2="78" />
          <line x1="74" y1="30" x2="57" y2="47" />
          <line x1="43" y1="61" x2="26" y2="78" />
        </g>

        {/* Sacred Dhwaja Flag at crest */}
        <line x1="50" y1="18" x2="50" y2="6" stroke="#92400E" strokeWidth="2" />
        <polygon points="50,6 74,12 50,18" fill="#DC2626" />
        <circle cx="58" cy="12" r="2" fill="#FBBF24" />
      </svg>
    </div>
  );
}

/**
 * 10. Raksha Bandhan:
 * Traditional golden Rakhi with floral dial, sacred silk thread & Rudraksha bead.
 */
export function RakshaBandhanSacredThreadClipart({
  size = 56,
  color = "#E11D48",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="rakhiGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
        </defs>

        {/* Sacred Protective Aura */}
        <circle cx="50" cy="50" r="44" fill="#FFF1F2" opacity={0.6} />

        {/* Silk Rakhi Ties extending left and right */}
        <path d="M 10 50 Q 25 44 40 50" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 10 52 Q 25 56 40 50" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 60 50 Q 75 44 90 50" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M 60 50 Q 75 56 90 52" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Side Rudraksha Beads */}
        <circle cx="32" cy="48" r="4" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />
        <circle cx="68" cy="48" r="4" fill="#78350F" stroke="#F59E0B" strokeWidth="1" />

        {/* Center Golden Medallion Flower */}
        <circle cx="50" cy="50" r="18" fill="#BE123C" />
        <circle cx="50" cy="50" r="15" fill="url(#rakhiGold)" stroke="#BE123C" strokeWidth="1.5" />
        {/* Inner Floral Petals */}
        <circle cx="50" cy="43" r="3" fill="#DC2626" />
        <circle cx="50" cy="57" r="3" fill="#DC2626" />
        <circle cx="43" cy="50" r="3" fill="#DC2626" />
        <circle cx="57" cy="50" r="3" fill="#DC2626" />
        {/* Core Jewel */}
        <circle cx="50" cy="50" r="4" fill="#FFFBEB" stroke="#EAB308" strokeWidth="1" />
      </svg>
    </div>
  );
}

/**
 * 11. Chhath Puja:
 * Sacred Bamboo Soop with fresh harvest offerings, Sugarcane & rising Surya Arghya oblations.
 */
export function ChhathPujaSuryaArghyaClipart({
  size = 56,
  color = "#EA580C",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="chhathSun" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>

        {/* Rising Dawn Sun on Horizon */}
        <path d="M 22 52 A 28 28 0 0 1 78 52 Z" fill="url(#chhathSun)" />
        {/* Morning Sun Rays */}
        <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="20" x2="50" y2="14" />
          <line x1="30" y1="30" x2="26" y2="24" />
          <line x1="70" y1="30" x2="74" y2="24" />
        </g>

        {/* River Water Ripple Waves */}
        <path d="M 12 54 Q 30 50 50 54 Q 70 58 88 54" stroke="#38BDF8" strokeWidth="2.5" fill="none" />
        <path d="M 16 62 Q 34 58 52 62 Q 72 66 84 62" stroke="#0284C7" strokeWidth="2" fill="none" />

        {/* Sacred Bamboo Daura / Soop basket holding Thekua and fruits */}
        <path d="M 32 64 L 68 64 L 62 82 L 38 82 Z" fill="#D97706" stroke="#78350F" strokeWidth="1.5" />
        {/* Offerings: Coconut, Banana & Diya in Soop */}
        <circle cx="44" cy="62" r="5" fill="#78350F" />
        <circle cx="56" cy="62" r="4.5" fill="#FBBF24" />
        {/* Earthen Diya flame in Soop */}
        <path d="M 50 56 Q 47 48 50 42 Q 53 48 50 56 Z" fill="#EF4444" />
        <circle cx="50" cy="46" r="1.5" fill="#FDE047" />
      </svg>
    </div>
  );
}

/**
 * 12. Hanuman Jayanti:
 * Golden Celestial Gada (Mace), Sacred Sindoor Tilak & Sanjeevani Hill aura.
 */
export function HanumanGadaSanjeevaniClipart({
  size = 56,
  color = "#EA580C",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="hanumanGada" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* Courage & Devotion Saffron Aura */}
        <circle cx="50" cy="50" r="44" fill="#FFF7ED" opacity={0.6} />
        <circle cx="50" cy="50" r="40" stroke="#F97316" strokeWidth="1" strokeDasharray="3 3" opacity={0.5} fill="none" />

        {/* Sacred Sindoor Tilak on top */}
        <path d="M 46 14 Q 50 8 54 14 L 54 26 Q 50 30 46 26 Z" fill="#DC2626" />
        <circle cx="50" cy="22" r="2" fill="#FEF08A" />

        {/* Celestial Gada (Mace) */}
        <g transform="rotate(30 50 54)">
          {/* Shaft */}
          <rect x="47" y="32" width="6" height="54" rx="2" fill="url(#hanumanGada)" stroke="#78350F" strokeWidth="1" />
          {/* Heavy Mace Head */}
          <circle cx="50" cy="30" r="16" fill="url(#hanumanGada)" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="50" cy="30" r="10" stroke="#FEF08A" strokeWidth="1.5" fill="none" />
          {/* Spikes / Crown */}
          <polygon points="50,10 46,16 54,16" fill="#F59E0B" />
          <polygon points="32,30 38,26 38,34" fill="#F59E0B" />
          <polygon points="68,30 62,26 62,34" fill="#F59E0B" />
          {/* Pommel */}
          <circle cx="50" cy="88" r="4" fill="#D97706" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 13. Akshaya Tritiya:
 * Overflowing Golden Kalash with glittering coins, blooming pink lotus & eternal Lakshmi aura.
 */
export function AkshayaTritiyaGoldKalashClipart({
  size = 56,
  color = palette.gold500,
  secondaryColor = "#EC4899",
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="akshayaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="30%" stopColor="#FDE047" />
            <stop offset="70%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
        </defs>

        {/* Infinite Prosperity Halo */}
        <circle cx="50" cy="50" r="44" fill="#FEFCE8" opacity={0.6} />

        {/* Blooming Lotus Base */}
        <path d="M 50 86 C 36 86 28 78 30 70 C 38 76 44 78 50 78 C 56 78 62 76 70 70 C 72 78 64 86 50 86 Z" fill="#F472B6" />
        <path d="M 26 76 C 18 72 18 64 24 62 C 28 66 32 70 36 72 Z" fill="#DB2777" />
        <path d="M 74 76 C 82 72 82 64 76 62 C 72 66 68 70 64 72 Z" fill="#DB2777" />

        {/* Golden Pot */}
        <path d="M 32 50 C 26 64 30 76 50 76 C 70 76 74 64 68 50 Z" fill="url(#akshayaGold)" stroke="#CA8A04" strokeWidth="1" />
        <ellipse cx="50" cy="50" rx="18" ry="4" fill="#CA8A04" />

        {/* Overflowing Gold Coins */}
        <circle cx="50" cy="42" r="5" fill="url(#akshayaGold)" stroke="#A16207" strokeWidth="0.8" />
        <circle cx="42" cy="46" r="4.5" fill="url(#akshayaGold)" stroke="#A16207" strokeWidth="0.8" />
        <circle cx="58" cy="46" r="4.5" fill="url(#akshayaGold)" stroke="#A16207" strokeWidth="0.8" />
        <circle cx="46" cy="36" r="4" fill="url(#akshayaGold)" stroke="#A16207" strokeWidth="0.8" />
        <circle cx="54" cy="36" r="4" fill="url(#akshayaGold)" stroke="#A16207" strokeWidth="0.8" />

        {/* Falling shower of golden coins */}
        <circle cx="26" cy="56" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />
        <circle cx="74" cy="56" r="3" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.5" />
        <circle cx="22" cy="68" r="2.5" fill="#FDE047" />
        <circle cx="78" cy="68" r="2.5" fill="#FDE047" />
      </svg>
    </div>
  );
}

/**
 * 14. Pohela Boishakh (Bengali New Year):
 * Red Haalkhata ledger book, Mangal Kalash, sacred Shankha conch & auspicious Swastika.
 */
export function PohelaBoishakhHaalkhataClipart({
  size = 56,
  color = "#DC2626",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="haalkhataRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        {/* Auspicious New Year Aura */}
        <circle cx="50" cy="50" r="44" fill="#FEF2F2" opacity={0.6} />

        {/* Traditional Red Haalkhata Book (open view) */}
        <rect x="22" y="32" width="56" height="48" rx="4" fill="url(#haalkhataRed)" stroke="#B91C1C" strokeWidth="1.5" />
        <line x1="50" y1="32" x2="50" y2="80" stroke="#7F1D1D" strokeWidth="2" />
        {/* Golden Swastika on Haalkhata cover */}
        <path d="M 34 52 L 40 52 M 37 49 L 37 57 M 34 49 L 34 52 M 40 55 L 40 57" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />

        {/* Yellow Marigold Garland border */}
        <circle cx="26" cy="36" r="2" fill="#F59E0B" />
        <circle cx="74" cy="36" r="2" fill="#F59E0B" />
        <circle cx="26" cy="76" r="2" fill="#F59E0B" />
        <circle cx="74" cy="76" r="2" fill="#F59E0B" />

        {/* Mangal Kalash at top right */}
        <path d="M 64 26 C 62 32 64 36 72 36 C 80 36 82 32 80 26 Z" fill="#D97706" />
        <circle cx="72" cy="22" r="4" fill="#15803D" />
        <circle cx="72" cy="18" r="2" fill="#DC2626" />
      </svg>
    </div>
  );
}

/**
 * 15. Guru Purnima:
 * Holy Guru Charan Paduka (sacred sandals), blooming lotus petals & radiant blessing halo.
 */
export function GuruPurnimaPadukaClipart({
  size = 56,
  color = "#D97706",
  secondaryColor = palette.gold500,
}: ClipartProps) {
  return (
    <div className="inline-flex items-center justify-center shrink-0" style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id="padukaGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
        </defs>

        {/* Divine Purnima Full Moon Aura */}
        <circle cx="50" cy="50" r="44" fill="#FFFBEB" opacity={0.7} />
        <circle cx="50" cy="50" r="40" stroke="#FBBF24" strokeWidth="1" strokeDasharray="4 2" opacity={0.6} fill="none" />

        {/* Blooming White/Pink Lotus Throne */}
        <path d="M 50 84 C 36 84 26 74 28 66 C 36 72 44 74 50 74 C 56 74 64 72 72 66 C 74 74 64 84 50 84 Z" fill="#FBCFE8" />

        {/* Sacred Charan Paduka Pair (Left & Right Wooden/Gold Sandals) */}
        {/* Left Paduka */}
        <path d="M 36 32 C 32 32 30 42 30 52 C 30 62 34 66 38 66 C 42 66 44 62 44 52 C 44 42 40 32 36 32 Z" fill="url(#padukaGold)" stroke="#A16207" strokeWidth="1" />
        <circle cx="36" cy="38" r="2.5" fill="#78350F" />
        <circle cx="36" cy="38" r="1.2" fill="#FEF08A" />

        {/* Right Paduka */}
        <path d="M 64 32 C 60 32 56 42 56 52 C 56 62 60 66 64 66 C 68 66 70 62 70 52 C 70 42 68 32 64 32 Z" fill="url(#padukaGold)" stroke="#A16207" strokeWidth="1" />
        <circle cx="64" cy="38" r="2.5" fill="#78350F" />
        <circle cx="64" cy="38" r="1.2" fill="#FEF08A" />

        {/* Fresh Jasmine / Marigold Flower Petals dropped around */}
        <circle cx="24" cy="46" r="2" fill="#F59E0B" />
        <circle cx="76" cy="46" r="2" fill="#F59E0B" />
        <circle cx="50" cy="24" r="2.5" fill="#DC2626" />
      </svg>
    </div>
  );
}
