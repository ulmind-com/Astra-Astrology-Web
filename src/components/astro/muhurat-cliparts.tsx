"use client";

import React from "react";

export interface ClipartProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  className?: string;
}

/**
 * 1. Abhijit Muhurat (Golden Hour of Supreme Victory):
 * Radiant 12-ray celestial Surya Chakra with golden core, diamond aura & victory crown.
 */
export function AbhijitSunVictoryClipart({
  size = 56,
  color = "#f59e0b",
  secondaryColor = "#fde68a",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="abhijitSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="30%" stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="70%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="abhijitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Outer Aura Halo */}
        <circle cx="50" cy="50" r="48" fill="url(#abhijitGlow)" />
        <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.6} fill="none" />
        <circle cx="50" cy="50" r="34" stroke={secondaryColor} strokeWidth="0.8" opacity={0.4} fill="none" />

        {/* 12 Radiant Sun Rays */}
        <g stroke={color} strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="8" x2="50" y2="18" />
          <line x1="50" y1="82" x2="50" y2="92" />
          <line x1="8" y1="50" x2="18" y2="50" />
          <line x1="82" y1="50" x2="92" y2="50" />
          <line x1="20" y1="20" x2="28" y2="28" />
          <line x1="72" y1="72" x2="80" y2="80" />
          <line x1="80" y1="20" x2="72" y2="28" />
          <line x1="20" y1="80" x2="28" y2="72" />
        </g>

        {/* Diagonal Diamond Ray Accents */}
        <polygon points="50,14 53,24 50,22 47,24" fill={color} />
        <polygon points="50,86 53,76 50,78 47,76" fill={color} />
        <polygon points="14,50 24,53 22,50 24,47" fill={color} />
        <polygon points="86,50 76,53 78,50 76,47" fill={color} />

        {/* Central Brilliant Surya Disc */}
        <circle cx="50" cy="50" r="22" fill="url(#abhijitSunGrad)" />

        {/* Inner Auspicious Swastika / Sun Wheel Core */}
        <circle cx="50" cy="50" r="8" fill="#FFFBEB" opacity={0.8} />
        <circle cx="50" cy="50" r="4" fill="#B45309" />

        {/* Twinkling Crown Sparkles */}
        <path d="M 50 28 Q 50 33 55 33 Q 50 33 50 38 Q 50 33 45 33 Q 50 33 50 28 Z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * 2. Vivah (Holy Marriage Union):
 * Sacred Vedic Vivah Yajna Agni Kund, garland petals & holy knotted bond.
 */
export function VivahKnotClipart({
  size = 56,
  color = "#EC4899",
  secondaryColor = "#f59e0b",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="1" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="1" />
            <stop offset="100%" stopColor="#DB2777" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Circular Garland Rim */}
        <circle cx="50" cy="50" r="44" stroke={secondaryColor} strokeWidth="1" strokeDasharray="4 3" opacity={0.45} fill="none" />

        {/* Sacred Step Kund Base (Havan Kund) */}
        <path d="M 24 74 L 76 74 L 70 86 L 30 86 Z" fill="#78350F" opacity={0.8} />
        <path d="M 20 72 L 80 72 L 78 76 L 22 76 Z" fill="#92400E" />

        {/* Holy Agni (Sacred Fire Flames) */}
        <path
          d="M 50 32 C 40 46 42 62 50 70 C 58 62 60 46 50 32 Z"
          fill="url(#fireGrad)"
        />
        <path
          d="M 44 48 C 38 56 40 66 48 70 C 44 64 42 56 44 48 Z"
          fill="#F59E0B"
          opacity={0.85}
        />
        <path
          d="M 56 48 C 62 56 60 66 52 70 C 56 64 58 56 56 48 Z"
          fill="#F59E0B"
          opacity={0.85}
        />
        <path
          d="M 50 48 C 47 55 48 64 50 68 C 52 64 53 55 50 48 Z"
          fill="#FEF08A"
        />

        {/* Two Intertwined Wedding Garlands / Hearts (Top) */}
        <path
          d="M 38 20 C 33 14 24 16 24 23 C 24 31 38 41 38 41 C 38 41 52 31 52 23 C 52 16 43 14 38 20 Z"
          fill="url(#heartGrad)"
          opacity={0.9}
        />
        <path
          d="M 62 20 C 57 14 48 16 48 23 C 48 31 62 41 62 41 C 62 41 76 31 76 23 C 76 16 67 14 62 20 Z"
          fill="url(#heartGrad)"
          opacity={0.9}
        />

        {/* Divine Golden Knot Tie */}
        <circle cx="50" cy="27" r="4.5" fill={secondaryColor} />
        <circle cx="50" cy="27" r="2.5" fill="#FFFBEB" />
      </svg>
    </div>
  );
}

/**
 * 3. Griha Pravesh (Auspicious Home Entry):
 * Sacred Temple Gopuram / Home Doorway with Mangal Kalash & Mango Leaves.
 */
export function GrihaKalashClipart({
  size = 56,
  color = "#10B981",
  secondaryColor = "#f59e0b",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="kalashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="40%" stopColor={secondaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Sacred Toran Arch */}
        <path
          d="M 18 84 L 18 38 C 18 20 82 20 82 38 L 82 84"
          stroke={secondaryColor}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 2"
        />

        {/* Auspicious Home Roof Peak */}
        <polygon points="50,12 86,38 14,38" fill="none" stroke={secondaryColor} strokeWidth="1.5" />
        <circle cx="50" cy="12" r="3" fill={secondaryColor} />

        {/* Doorway Frame */}
        <rect x="26" y="38" width="48" height="46" rx="4" fill="none" stroke={color} strokeWidth="1.2" opacity={0.6} />

        {/* Mangal Kalash (Center) */}
        <path
          d="M 38 78 Q 50 84 62 78 L 59 62 Q 50 58 41 62 Z"
          fill="url(#kalashGrad)"
        />
        {/* Kalash Neck & Rim */}
        <rect x="42" y="58" width="16" height="4" rx="1.5" fill={secondaryColor} />

        {/* Mango Leaves (Amra Pallava) */}
        <path d="M 50 58 L 40 46 M 50 58 L 50 42 M 50 58 L 60 46" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        {/* Holy Coconut (Nariyal) with Tilak */}
        <circle cx="50" cy="46" r="6" fill="#78350F" />
        <circle cx="50" cy="44" r="1.5" fill="#EF4444" />

        {/* Auspicious Shubh Swastika on Door */}
        <g stroke={secondaryColor} strokeWidth="1.2" strokeLinecap="square">
          <line x1="50" y1="24" x2="50" y2="34" />
          <line x1="45" y1="29" x2="55" y2="29" />
          <line x1="50" y1="24" x2="54" y2="24" />
          <line x1="50" y1="34" x2="46" y2="34" />
          <line x1="45" y1="29" x2="45" y2="25" />
          <line x1="55" y1="29" x2="55" y2="33" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 4. Vehicle Purchase (Vahan Kharid):
 * Sacred Chariot / Steering Wheel with Protective Raksha Shield & Golden Wings.
 */
export function VehicleChariotClipart({
  size = 56,
  color = "#3B82F6",
  secondaryColor = "#f59e0b",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="chariotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFF6FF" stopOpacity="1" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Celestial Orbit */}
        <circle cx="50" cy="50" r="44" stroke={secondaryColor} strokeWidth="1" strokeDasharray="3 3" opacity={0.4} fill="none" />

        {/* Protective Raksha Crest / Wings */}
        <path d="M 12 48 Q 30 36 44 48 L 44 54 Q 30 44 12 56 Z" fill={secondaryColor} opacity={0.65} />
        <path d="M 88 48 Q 70 36 56 48 L 56 54 Q 70 44 88 56 Z" fill={secondaryColor} opacity={0.65} />

        {/* Chariot Sun Wheel Outer Rim */}
        <circle cx="50" cy="50" r="28" stroke="url(#chariotGrad)" strokeWidth="4.5" fill="none" />
        <circle cx="50" cy="50" r="32" stroke={secondaryColor} strokeWidth="1" opacity={0.5} fill="none" />

        {/* 8 Sacred Chariot Spokes (Ashoka/Surya Chakra) */}
        <g stroke={secondaryColor} strokeWidth="2" strokeLinecap="round">
          <line x1="50" y1="22" x2="50" y2="78" />
          <line x1="22" y1="50" x2="78" y2="50" />
          <line x1="30" y1="30" x2="70" y2="70" />
          <line x1="70" y1="30" x2="30" y2="70" />
        </g>

        {/* Center Golden Hub */}
        <circle cx="50" cy="50" r="8" fill={secondaryColor} />
        <circle cx="50" cy="50" r="4" fill="#FFFFFF" />

        {/* Auspicious Garland Dots around Wheel */}
        <circle cx="50" cy="14" r="2.5" fill="#EF4444" />
        <circle cx="86" cy="50" r="2.5" fill="#EF4444" />
        <circle cx="50" cy="86" r="2.5" fill="#EF4444" />
        <circle cx="14" cy="50" r="2.5" fill="#EF4444" />
      </svg>
    </div>
  );
}

/**
 * 5. Vyapar (Business Start & Commerce):
 * Kuber Pot of Gold Coins, Blooming Lotus & Auspicious Shubh-Labh Aura.
 */
export function VyaparLakshmiClipart({
  size = 56,
  color = "#f59e0b",
  secondaryColor = "#D97706",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="goldPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="60%" stopColor="#FBBF24" stopOpacity="1" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Aura Circle */}
        <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity={0.4} fill="none" />

        {/* Blooming Sacred Lotus Base (Padma) */}
        <path d="M 50 86 C 40 76 26 78 24 86 C 36 90 46 88 50 86 Z" fill="#F472B6" opacity={0.7} />
        <path d="M 50 86 C 60 76 74 78 76 86 C 64 90 54 88 50 86 Z" fill="#F472B6" opacity={0.7} />
        <path d="M 50 88 C 45 78 55 78 50 88 Z" fill="#EC4899" />

        {/* Kuber Treasure Kalash / Wealth Urn */}
        <path
          d="M 28 62 C 28 82 72 82 72 62 L 66 48 L 34 48 Z"
          fill="url(#goldPotGrad)"
        />
        <rect x="32" y="44" width="36" height="6" rx="2" fill={secondaryColor} />

        {/* Overflowing Gold Coins */}
        <circle cx="50" cy="38" r="7" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="40" cy="42" r="6" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="60" cy="42" r="6" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="45" cy="30" r="5.5" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="55" cy="30" r="5.5" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />
        <circle cx="50" cy="22" r="5" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="0.8" />

        {/* Divine Sparkles */}
        <path d="M 28 26 Q 28 30 32 30 Q 28 30 28 34 Q 28 30 24 30 Q 28 30 28 26 Z" fill={color} />
        <path d="M 72 24 Q 72 28 76 28 Q 72 28 72 32 Q 72 28 68 28 Q 72 28 72 24 Z" fill={color} />
      </svg>
    </div>
  );
}

/**
 * 6. Suvarna (Gold & Jewellery Purchase):
 * Brilliant Cut Radiant Gemstone & Ingot Bar with Prismatic Celestial Aura.
 */
export function SuvarnaGoldClipart({
  size = 56,
  color = "#f59e0b",
  secondaryColor = "#F59E0B",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="30%" stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="70%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="1" />
            <stop offset="50%" stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Circular Aura */}
        <circle cx="50" cy="50" r="44" stroke={color} strokeWidth="1" strokeDasharray="4 2" opacity={0.4} fill="none" />

        {/* Faceted Brilliant Gemstone (Top Center) */}
        <polygon points="32,32 68,32 80,48 50,78 20,48" fill="url(#gemGrad)" />
        {/* Gem Facet Lines */}
        <line x1="32" y1="32" x2="50" y2="48" stroke="#FFFFFF" strokeWidth="1" opacity={0.8} />
        <line x1="68" y1="32" x2="50" y2="48" stroke="#FFFFFF" strokeWidth="1" opacity={0.8} />
        <line x1="20" y1="48" x2="80" y2="48" stroke="#FFFFFF" strokeWidth="1" opacity={0.6} />
        <line x1="50" y1="48" x2="50" y2="78" stroke="#78350F" strokeWidth="1" opacity={0.4} />
        <line x1="20" y1="48" x2="50" y2="48" stroke="#78350F" strokeWidth="0.8" opacity={0.3} />
        <line x1="80" y1="48" x2="50" y2="48" stroke="#78350F" strokeWidth="0.8" opacity={0.3} />

        {/* Table Facet Top Highlight */}
        <polygon points="38,32 62,32 56,40 44,40" fill="#FFFFFF" opacity={0.6} />

        {/* Golden Ingot Bar Base */}
        <polygon points="26,74 74,74 70,84 30,84" fill="url(#barGrad)" />
        <polygon points="26,74 30,70 70,70 74,74" fill="#FEF3C7" opacity={0.6} />

        {/* Sparkle Glint */}
        <path d="M 68 28 Q 68 32 72 32 Q 68 32 68 36 Q 68 32 64 32 Q 68 32 68 28 Z" fill="#FFFFFF" />
        <circle cx="28" cy="46" r="1.5" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

/**
 * 7. Vidya Arambha (Education & Learning):
 * Saraswati Veena strings, Sacred Palm Leaf Manuscript & Peacock Feather Quill.
 */
export function VidyaSaraswatiClipart({
  size = 56,
  color = "#8B5CF6",
  secondaryColor = "#f59e0b",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EDE9FE" stopOpacity="1" />
            <stop offset="40%" stopColor="#C4B5FD" stopOpacity="1" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="veenaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
            <stop offset="60%" stopColor={secondaryColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#92400E" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Aura Ring */}
        <circle cx="50" cy="50" r="44" stroke={secondaryColor} strokeWidth="1" strokeDasharray="3 3" opacity={0.4} fill="none" />

        {/* Sacred Open Grantha (Vedic Book / Scripture) */}
        <path
          d="M 50 62 C 38 56 22 58 16 62 L 16 80 C 22 76 38 74 50 80 C 62 74 78 76 84 80 L 84 62 C 78 58 62 56 50 62 Z"
          fill="url(#bookGrad)"
        />
        <path d="M 50 62 L 50 80" stroke="#5B21B6" strokeWidth="1.5" />
        {/* Book Ribbon Bookmark */}
        <path d="M 50 80 L 46 88 L 50 86 L 54 88 Z" fill="#EF4444" />

        {/* Sacred Veena Dandi (Neck & Resonator Gourd) */}
        <path
          d="M 28 20 Q 50 44 68 56"
          stroke="url(#veenaGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Veena Peghead / Dragon Crest */}
        <circle cx="26" cy="18" r="5" fill={secondaryColor} />
        {/* Veena Sounding Gourd Base */}
        <circle cx="68" cy="56" r="9" fill="url(#veenaGrad)" />
        <circle cx="68" cy="56" r="5" fill="#78350F" />

        {/* Sacred Veena Strings (3 Divine Saraswati Tants) */}
        <line x1="28" y1="20" x2="68" y2="56" stroke="#FFFFFF" strokeWidth="0.8" opacity={0.9} />
        <line x1="27" y1="22" x2="67" y2="58" stroke="#FEF08A" strokeWidth="0.8" opacity={0.7} />

        {/* Sacred Saraswati Akshara / Divine Lotus Accent (Top Right) */}
        <path
          d="M 72 26 C 68 18 58 20 62 28 C 54 26 56 36 66 34 C 70 38 78 34 76 28 C 80 24 76 18 72 26 Z"
          fill="#EC4899"
          opacity={0.8}
        />
        <circle cx="68" cy="28" r="2" fill="#FEF08A" />
      </svg>
    </div>
  );
}

/**
 * 8. Yatra (Auspicious Travel & Journeys):
 * Celestial Compass Star, Winged Celestial Wheels & North Star Pointer.
 */
export function YatraDishaClipart({
  size = 56,
  color = "#0EA5E9",
  secondaryColor = "#f59e0b",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="compassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0F9FF" stopOpacity="1" />
            <stop offset="50%" stopColor="#7DD3FC" stopOpacity="1" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Outer Celestial Compass Ring */}
        <circle cx="50" cy="50" r="44" stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
        <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="2" fill="url(#compassGrad)" opacity={0.25} />

        {/* 4 Cardinal Direction Prongs */}
        <line x1="50" y1="8" x2="50" y2="15" stroke={secondaryColor} strokeWidth="2" />
        <line x1="50" y1="85" x2="50" y2="92" stroke={secondaryColor} strokeWidth="2" />
        <line x1="8" y1="50" x2="15" y2="50" stroke={secondaryColor} strokeWidth="2" />
        <line x1="85" y1="50" x2="92" y2="50" stroke={secondaryColor} strokeWidth="2" />

        {/* Compass Dial Pointer - North (Red) & South (Gold) */}
        <polygon points="50,18 56,50 50,46" fill="#EF4444" />
        <polygon points="50,18 44,50 50,46" fill="#DC2626" />
        <polygon points="50,82 56,50 50,54" fill={secondaryColor} />
        <polygon points="50,82 44,50 50,54" fill="#B45309" />

        {/* East & West Points */}
        <polygon points="82,50 50,44 54,50" fill={color} />
        <polygon points="18,50 50,44 46,50" fill={color} />

        {/* Center Golden Pivot */}
        <circle cx="50" cy="50" r="6" fill="#FFFBEB" stroke={secondaryColor} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="2.5" fill="#EF4444" />
      </svg>
    </div>
  );
}

/**
 * 9. Namakaran (Naming Ceremony):
 * Auspicious Baby Cradle with Lotus Petals & Protective Swastika Blessing.
 */
export function NamakaranBabyClipart({
  size = 56,
  color = "#F43F5E",
  secondaryColor = "#f59e0b",
  className = "",
}: ClipartProps) {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id="cradleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1F2" stopOpacity="1" />
            <stop offset="50%" stopColor="#FDA4AF" stopOpacity="1" />
            <stop offset="100%" stopColor="#E11D48" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Halo */}
        <circle cx="50" cy="50" r="44" stroke={secondaryColor} strokeWidth="1" strokeDasharray="3 3" opacity={0.4} fill="none" />

        {/* Celestial Cradle Moon Arc */}
        <path
          d="M 22 46 C 22 76 78 76 78 46"
          stroke="url(#cradleGrad)"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Cradle Stand / Rocker */}
        <path d="M 30 72 L 20 86 M 70 72 L 80 86" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 16 86 Q 50 92 84 86" stroke={secondaryColor} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Baby Lotus Blossom in Cradle */}
        <path d="M 50 40 C 44 32 36 34 36 42 C 36 50 50 58 50 58 C 50 58 64 50 64 42 C 64 34 56 32 50 40 Z" fill="#FB7185" />
        <circle cx="50" cy="34" r="5" fill="#FFE4E6" />
        <circle cx="50" cy="34" r="2" fill="#E11D48" />

        {/* Auspicious Tilak & Blessings Stars */}
        <path d="M 50 16 Q 50 20 54 20 Q 50 20 50 24 Q 50 20 46 20 Q 50 20 50 16 Z" fill={secondaryColor} />
        <circle cx="28" cy="28" r="1.5" fill={secondaryColor} />
        <circle cx="72" cy="28" r="1.5" fill={secondaryColor} />
      </svg>
    </div>
  );
}

/**
 * 10. Shubh & Rahu Kaal Shield Clipart:
 * High-impact Vedic shield contrasting Auspicious Amrit / Shubh against inauspicious Rahu Kaal.
 */
export function ShubhKaalShieldClipart({
  size = 56,
  isAuspicious = true,
  className = "",
}: {
  size?: number;
  isAuspicious?: boolean;
  className?: string;
}) {
  const mainColor = isAuspicious ? "#10B981" : "#EF4444";
  const lightColor = isAuspicious ? "#D1FAE5" : "#FEE2E2";

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Shield Outer Path */}
        <path
          d="M 50 12 Q 80 18 80 44 C 80 70 50 88 50 88 C 50 88 20 70 20 44 Q 20 18 50 12 Z"
          fill={lightColor}
          stroke={mainColor}
          strokeWidth="2.5"
        />

        {/* Inner Shield Rim */}
        <path
          d="M 50 20 Q 72 24 72 44 C 72 64 50 78 50 78 C 50 78 28 64 28 44 Q 28 24 50 20 Z"
          fill="none"
          stroke={mainColor}
          strokeWidth="1"
          strokeDasharray="3 2"
          opacity={0.6}
        />

        {isAuspicious ? (
          /* Auspicious Check / Golden Sunburst */
          <g fill={mainColor}>
            <path d="M 50 28 Q 50 36 58 36 Q 50 36 50 44 Q 50 36 42 36 Q 50 36 50 28 Z" />
            <path
              d="M 38 48 L 46 56 L 64 38 L 68 42 L 46 64 L 34 52 Z"
              fill={mainColor}
            />
          </g>
        ) : (
          /* Rahu Kaal Caution / Crossed Trident */
          <g stroke={mainColor} strokeWidth="3" strokeLinecap="round">
            <line x1="38" y1="36" x2="62" y2="60" />
            <line x1="62" y1="36" x2="38" y2="60" />
            <circle cx="50" cy="48" r="16" stroke={mainColor} strokeWidth="1.5" fill="none" opacity={0.3} />
          </g>
        )}
      </svg>
    </div>
  );
}
