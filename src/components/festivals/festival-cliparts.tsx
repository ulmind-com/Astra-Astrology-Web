import React from "react";

/**
 * Ultra-Pro Sacred Vedic Festival Cliparts
 * Handcrafted vector artwork with rich golden gradients, spiritual iconography & temple aesthetics.
 */

interface ClipartProps {
  className?: string;
}

// 1. Makar Sankranti: Radiant Surya Mandala, Soaring Golden Kite & Sacred Sugarcane
export function MakarSankrantiClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="sunGlow" cx="60" cy="60" r="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="1" stopColor="#D97706" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldKite" x1="40" y1="20" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="caneGreen" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#4ADE80" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
      </defs>
      {/* Sun glow halo */}
      <circle cx="60" cy="60" r="52" fill="url(#sunGlow)" />
      {/* Sacred Sun rays */}
      <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.75">
        <line x1="60" y1="12" x2="60" y2="20" />
        <line x1="60" y1="100" x2="60" y2="108" />
        <line x1="12" y1="60" x2="20" y2="60" />
        <line x1="100" y1="60" x2="108" y2="60" />
        <line x1="26" y1="26" x2="32" y2="32" />
        <line x1="88" y1="88" x2="94" y2="94" />
        <line x1="26" y1="94" x2="32" y2="88" />
        <line x1="88" y1="32" x2="94" y2="26" />
      </g>
      {/* Sugarcane stalks left & right */}
      <path d="M30 105 C32 80 25 55 20 40" stroke="url(#caneGreen)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M32 90 C38 85 42 75 40 70" stroke="url(#caneGreen)" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 65 C20 60 18 50 20 45" stroke="url(#caneGreen)" strokeWidth="2" strokeLinecap="round" />
      <path d="M90 105 C88 80 95 55 100 40" stroke="url(#caneGreen)" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M88 90 C82 85 78 75 80 70" stroke="url(#caneGreen)" strokeWidth="2" strokeLinecap="round" />
      {/* Sacred Earthen Pot (Handi / Handi of Til-Gur) */}
      <ellipse cx="60" cy="98" rx="22" ry="12" fill="#92400E" />
      <ellipse cx="60" cy="92" rx="16" ry="6" fill="#FBBF24" />
      <path d="M42 96 C42 108 78 108 78 96 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      {/* Soaring Golden Kite */}
      <g transform="rotate(-12 60 48)">
        <polygon points="60,20 84,48 60,76 36,48" fill="url(#goldKite)" stroke="#78350F" strokeWidth="1.5" />
        <line x1="60" y1="20" x2="60" y2="76" stroke="#78350F" strokeWidth="1.5" />
        <path d="M36 48 Q60 38 84 48" stroke="#78350F" strokeWidth="1.5" fill="none" />
        {/* Kite tail */}
        <path d="M60 76 Q64 88 58 96 Q52 104 60 110" stroke="#EF4444" strokeWidth="2" fill="none" strokeLinecap="round" />
        <polygon points="60,76 56,84 64,84" fill="#DC2626" />
      </g>
    </svg>
  );
}

// 2. Saraswati Puja: Divine Golden Veena, Blooming Sacred Lotus & Peacock Feather
export function SaraswatiPujaClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="saraswatiHalo" cx="60" cy="55" r="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" stopOpacity="0.45" />
          <stop offset="0.7" stopColor="#F59E0B" stopOpacity="0.15" />
          <stop offset="1" stopColor="#B45309" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="veenaWood" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="0.4" stopColor="#D97706" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="lotusWhite" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#FEF3C7" />
          <stop offset="1" stopColor="#FDE68A" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="55" r="50" fill="url(#saraswatiHalo)" />
      {/* Sacred White/Gold Lotus Throne at Base */}
      <g transform="translate(18, 76)">
        <path d="M42 28 C28 28 16 18 10 10 C18 18 30 20 42 22 C54 20 66 18 74 10 C68 18 56 28 42 28 Z" fill="#F59E0B" opacity="0.8" />
        <path d="M42 24 C30 24 20 14 18 0 C24 10 34 16 42 18 C50 16 60 10 66 0 C64 14 54 24 42 24 Z" fill="url(#lotusWhite)" stroke="#F59E0B" strokeWidth="1" />
        <path d="M42 22 C36 22 28 14 30 2 C34 10 38 14 42 16 C46 14 50 10 54 2 C56 14 48 22 42 22 Z" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
      </g>
      {/* Divine Veena (Danda & Gourd resonators) */}
      <g transform="rotate(-32 60 55)">
        {/* Main Gourd */}
        <circle cx="36" cy="68" r="16" fill="url(#veenaWood)" stroke="#78350F" strokeWidth="1.5" />
        <circle cx="36" cy="68" r="10" fill="#92400E" />
        <circle cx="36" cy="68" r="4" fill="#FBBF24" />
        {/* Secondary Upper Gourd */}
        <circle cx="86" cy="40" r="10" fill="url(#veenaWood)" stroke="#78350F" strokeWidth="1.5" />
        {/* Danda (Long Stem) */}
        <rect x="36" y="50" width="58" height="6" rx="2" fill="url(#veenaWood)" stroke="#78350F" strokeWidth="1" />
        {/* Veena Frets */}
        <line x1="50" y1="48" x2="50" y2="58" stroke="#FDE68A" strokeWidth="1.5" />
        <line x1="58" y1="48" x2="58" y2="58" stroke="#FDE68A" strokeWidth="1.5" />
        <line x1="66" y1="48" x2="66" y2="58" stroke="#FDE68A" strokeWidth="1.5" />
        <line x1="74" y1="48" x2="74" y2="58" stroke="#FDE68A" strokeWidth="1.5" />
        <line x1="82" y1="48" x2="82" y2="58" stroke="#FDE68A" strokeWidth="1.5" />
        {/* Strings */}
        <line x1="36" y1="52" x2="94" y2="52" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
        <line x1="36" y1="54" x2="94" y2="54" stroke="#FFFFFF" strokeWidth="1" opacity="0.9" />
        {/* Dragon head / Yali carving end */}
        <path d="M94 53 C100 50 102 42 98 38 C94 36 90 42 94 48 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
      </g>
      {/* Sacred Peacock Feather Accent */}
      <g transform="translate(74, 18) rotate(15)">
        <path d="M12 36 C12 24 20 12 26 2 C22 14 20 26 20 38 Z" fill="#0D9488" />
        <ellipse cx="22" cy="14" rx="8" ry="12" fill="#0284C7" />
        <circle cx="22" cy="14" r="5" fill="#4338CA" />
        <circle cx="22" cy="14" r="2.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}

// 3. Maha Shivaratri: Golden Trishula, Damru, Radiant Crescent Moon & Bilva Patra
export function MahaShivaratriClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="shivaHalo" cx="60" cy="50" r="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#4F46E5" stopOpacity="0.15" />
          <stop offset="1" stopColor="#1E1B4B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldTrishul" x1="50" y1="10" x2="70" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A" />
          <stop offset="0.4" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="50" r="50" fill="url(#shivaHalo)" />
      {/* Divine Crescent Moon (Chandra) */}
      <path d="M42 26 C42 14 52 8 60 8 C52 14 50 24 56 32 C50 30 42 28 42 26 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" filter="drop-shadow(0 0 4px #93C5FD)" />
      {/* Central Trishula Shaft */}
      <line x1="60" y1="12" x2="60" y2="108" stroke="url(#goldTrishul)" strokeWidth="4" strokeLinecap="round" />
      {/* Sacred Central Blade */}
      <path d="M60 12 C58 20 54 28 54 36 L66 36 C66 28 62 20 60 12 Z" fill="url(#goldTrishul)" stroke="#78350F" strokeWidth="1" />
      {/* Left Trident Prong */}
      <path d="M60 44 C42 44 32 30 34 18 C36 28 46 36 56 36" stroke="url(#goldTrishul)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <polygon points="34,18 31,24 37,24" fill="url(#goldTrishul)" />
      {/* Right Trident Prong */}
      <path d="M60 44 C78 44 88 30 86 18 C84 28 74 36 64 36" stroke="url(#goldTrishul)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <polygon points="86,18 83,24 89,24" fill="url(#goldTrishul)" />
      {/* Sacred Damru bound to shaft */}
      <g transform="translate(60, 52)">
        <polygon points="-12,-10 12,-10 0,0 -12,10 12,10 0,0" fill="#92400E" stroke="#FDE68A" strokeWidth="1" />
        <ellipse cx="-12" cy="-10" rx="3" ry="5" fill="#FBBF24" />
        <ellipse cx="12" cy="-10" rx="3" ry="5" fill="#FBBF24" />
        <ellipse cx="-12" cy="10" rx="3" ry="5" fill="#FBBF24" />
        <ellipse cx="12" cy="10" rx="3" ry="5" fill="#FBBF24" />
        {/* Damru cords & beater beads */}
        <path d="M0 0 Q-10 12 -16 10" stroke="#F8FAFC" strokeWidth="1.2" fill="none" />
        <circle cx="-16" cy="10" r="2.5" fill="#F59E0B" />
        <path d="M0 0 Q10 -12 16 -10" stroke="#F8FAFC" strokeWidth="1.2" fill="none" />
        <circle cx="16" cy="-10" r="2.5" fill="#F59E0B" />
      </g>
      {/* Sacred 3-Leaf Bilva Patra at base */}
      <g transform="translate(60, 86)">
        <path d="M0 0 C-6 -8 -4 -16 0 -22 C4 -16 6 -8 0 0 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
        <path d="M0 0 C-10 -4 -18 0 -24 -2 C-18 -8 -10 -8 0 0 Z" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
        <path d="M0 0 C10 -4 18 0 24 -2 C18 -8 10 -8 0 0 Z" fill="#16A34A" stroke="#15803D" strokeWidth="1" />
        <circle cx="0" cy="-11" r="1.5" fill="#FEF08A" />
      </g>
    </svg>
  );
}

// 4. Holi & Dol Yatra: Ornate Brass Pichkari, Gulal Cloud & Divine Peacock Feather
export function HoliDolYatraClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="holiBurst" cx="60" cy="55" r="50">
          <stop stopColor="#F43F5E" stopOpacity="0.4" />
          <stop offset="0.4" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="0.7" stopColor="#06B6D4" stopOpacity="0.2" />
          <stop offset="1" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brassPichkari" x1="20" y1="80" x2="80" y2="20">
          <stop stopColor="#FDE68A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="55" r="50" fill="url(#holiBurst)" />
      {/* Vibrant Gulal color splashes */}
      <path d="M22 36 C16 28 24 16 34 22 C40 18 50 24 46 32 C54 36 48 46 38 44 C34 52 24 48 22 36 Z" fill="#EC4899" opacity="0.8" />
      <path d="M78 26 C72 18 82 10 90 16 C98 12 106 20 100 28 C108 34 100 44 92 40 C86 48 76 42 78 26 Z" fill="#3B82F6" opacity="0.8" />
      <path d="M82 66 C76 58 84 50 94 54 C100 48 110 56 104 64 C112 70 104 80 96 76 C90 84 80 78 82 66 Z" fill="#10B981" opacity="0.75" />
      <path d="M18 72 C12 64 22 56 30 60 C36 54 46 62 40 70 C48 76 40 86 32 82 C26 90 16 84 18 72 Z" fill="#F59E0B" opacity="0.85" />
      {/* Traditional Clay Matki (Color pot) */}
      <ellipse cx="60" cy="94" rx="22" ry="10" fill="#92400E" />
      <ellipse cx="60" cy="88" rx="16" ry="6" fill="#EC4899" />
      <path d="M42 92 C42 106 78 106 78 92 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
      {/* Royal Brass Pichkari firing colors diagonally */}
      <g transform="rotate(-40 60 60)">
        {/* Barrel */}
        <rect x="30" y="56" width="55" height="8" rx="2" fill="url(#brassPichkari)" stroke="#78350F" strokeWidth="1" />
        {/* Rings */}
        <line x1="45" y1="55" x2="45" y2="65" stroke="#78350F" strokeWidth="1.5" />
        <line x1="60" y1="55" x2="60" y2="65" stroke="#78350F" strokeWidth="1.5" />
        <line x1="75" y1="55" x2="75" y2="65" stroke="#78350F" strokeWidth="1.5" />
        {/* Nozzle */}
        <polygon points="85,57 95,59 95,61 85,63" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        {/* Handle plunger */}
        <line x1="15" y1="60" x2="30" y2="60" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
        <circle cx="15" cy="60" r="4" fill="#B45309" stroke="#78350F" strokeWidth="1" />
      </g>
    </svg>
  );
}

// 5. Chaitra Navratri & Ram Navami: Sacred Kodanda Bow & Arrow, Kalash & Surya Aura
export function ChaitraNavratriRamNavamiClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="ramHalo" cx="60" cy="50" r="50">
          <stop stopColor="#FDE047" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#F97316" stopOpacity="0.2" />
          <stop offset="1" stopColor="#C2410C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldBow" x1="30" y1="10" x2="90" y2="90">
          <stop stopColor="#FDE68A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="50" r="50" fill="url(#ramHalo)" />
      {/* Surya Vansh Rays */}
      <circle cx="60" cy="38" r="18" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      {/* Lord Rama's Kodanda Bow */}
      <path d="M32 82 C28 54 44 26 72 16" stroke="url(#goldBow)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <line x1="32" y1="82" x2="72" y2="16" stroke="#FEF08A" strokeWidth="1.2" strokeDasharray="2 1" />
      {/* Arrow (Baan) */}
      <g transform="rotate(32 60 50)">
        <line x1="20" y1="50" x2="88" y2="50" stroke="url(#goldBow)" strokeWidth="2.5" strokeLinecap="round" />
        {/* Arrow Tip */}
        <polygon points="88,50 78,44 80,50 78,56" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
        {/* Arrow Feathers */}
        <line x1="22" y1="46" x2="28" y2="50" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="22" y1="54" x2="28" y2="50" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Sacred Navratri Kalash with Mango Leaves & Coconut */}
      <g transform="translate(68, 62)">
        <ellipse cx="20" cy="38" rx="14" ry="7" fill="#78350F" />
        <path d="M10 36 C10 48 30 48 30 36 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
        <path d="M12 30 C12 24 28 24 28 30 Z" fill="#D97706" />
        {/* Mango Leaves */}
        <path d="M20 25 C14 18 10 20 6 22 C12 24 16 26 20 25 Z" fill="#16A34A" />
        <path d="M20 25 C26 18 30 20 34 22 C28 24 24 26 20 25 Z" fill="#16A34A" />
        <path d="M20 25 C18 16 20 12 20 8 C22 12 22 16 20 25 Z" fill="#22C55E" />
        {/* Coconut with sacred Tilak */}
        <circle cx="20" cy="18" r="6" fill="#92400E" stroke="#78350F" strokeWidth="1" />
        <line x1="17" y1="18" x2="23" y2="18" stroke="#DC2626" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

// 6. Bengali New Year: Traditional Auspicious Kula, Haal Khata & Ektara
export function PohelaBoishakhClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="boishakhHalo" cx="60" cy="55" r="50">
          <stop stopColor="#FECDD3" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#FDE047" stopOpacity="0.25" />
          <stop offset="1" stopColor="#E11D48" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="55" r="50" fill="url(#boishakhHalo)" />
      {/* Traditional Painted Bamboo Kula (উৎসবে আল্পনা আঁকা কুলা) */}
      <path d="M30 30 C30 20 90 20 90 30 C90 70 80 92 60 96 C40 92 30 70 30 30 Z" fill="#FEF3C7" stroke="#DC2626" strokeWidth="2.5" />
      {/* Red & Gold Border Alpana dots */}
      <path d="M36 34 C36 28 84 28 84 34 C84 66 76 86 60 90 C44 86 36 66 36 34 Z" fill="#FFFBEB" stroke="#B45309" strokeWidth="1" strokeDasharray="3 3" />
      {/* Traditional Haal Khata (Red auspicious accounting ledger) */}
      <g transform="translate(42, 42)">
        <rect x="0" y="0" width="36" height="44" rx="3" fill="#DC2626" stroke="#B91C1C" strokeWidth="1.5" />
        <line x1="8" y1="0" x2="8" y2="44" stroke="#FDE047" strokeWidth="1.5" />
        {/* Golden Swastik & Om Motif on ledger */}
        <circle cx="22" cy="22" r="8" fill="#FDE047" />
        <path d="M19 22 L25 22 M22 19 L22 25 M19 19 L19 22 M25 25 L25 22" stroke="#991B1B" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      {/* Folk Music Ektara angled */}
      <g transform="rotate(35 60 60) translate(22, 12)">
        <ellipse cx="20" cy="62" rx="10" ry="8" fill="#B45309" stroke="#78350F" strokeWidth="1" />
        <rect x="18" y="22" width="4" height="40" fill="#F59E0B" />
        <line x1="20" y1="20" x2="20" y2="60" stroke="#FFFFFF" strokeWidth="1" />
        <circle cx="20" cy="20" r="3" fill="#DC2626" />
      </g>
    </svg>
  );
}

// 7. Akshaya Tritiya: Overflowing Golden Kalash with Gold Coins & Blooming Lotus
export function AkshayaTritiyaClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="wealthHalo" cx="60" cy="60" r="50">
          <stop stopColor="#FDE047" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="1" stopColor="#B45309" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="solidGold" x1="30" y1="40" x2="90" y2="100">
          <stop stopColor="#FEF08A" />
          <stop offset="0.4" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#wealthHalo)" />
      {/* Overflowing Gold Coins Rain */}
      <g fill="#FDE047" stroke="#B45309" strokeWidth="1">
        <circle cx="48" cy="26" r="6" />
        <circle cx="72" cy="28" r="5.5" />
        <circle cx="60" cy="20" r="7" />
        <circle cx="34" cy="38" r="5" />
        <circle cx="86" cy="40" r="5" />
        <circle cx="45" cy="40" r="6.5" />
        <circle cx="62" cy="34" r="7" />
        <circle cx="75" cy="42" r="6" />
      </g>
      {/* Royal Golden Kalash (Swarna Kumbha) */}
      <ellipse cx="60" cy="98" rx="26" ry="10" fill="#78350F" />
      {/* Neck */}
      <path d="M48 46 L72 46 L68 54 L52 54 Z" fill="url(#solidGold)" stroke="#78350F" strokeWidth="1" />
      {/* Pot Belly */}
      <path d="M50 54 C36 58 32 82 42 94 C48 98 72 98 78 94 C88 82 84 58 70 54 Z" fill="url(#solidGold)" stroke="#78350F" strokeWidth="1.5" />
      {/* Auspicious Shubh Labh engraving */}
      <circle cx="60" cy="74" r="10" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
      <path d="M56 74 L64 74 M60 70 L60 78 M56 70 L56 74 M64 78 L64 74" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      {/* Golden Lotus base petals */}
      <path d="M30 96 C40 90 50 96 60 98 C70 96 80 90 90 96 C80 106 40 106 30 96 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
    </svg>
  );
}

// 8. Guru Purnima: Sacred Charan Paduka, Palm-Leaf Scripture & Radiant Purnima Moon
export function GuruPurnimaClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="purnimaGlow" cx="60" cy="50" r="50">
          <stop stopColor="#FFFFFF" stopOpacity="0.6" />
          <stop offset="0.4" stopColor="#FEF08A" stopOpacity="0.3" />
          <stop offset="0.8" stopColor="#F59E0B" stopOpacity="0.1" />
          <stop offset="1" stopColor="#B45309" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Radiant Full Moon in backdrop */}
      <circle cx="60" cy="46" r="38" fill="url(#purnimaGlow)" />
      <circle cx="60" cy="46" r="30" fill="#FFFDF0" stroke="#FDE047" strokeWidth="1.5" opacity="0.9" />
      {/* Palm Leaf Scripture (Vedic Granth) */}
      <g transform="translate(24, 76)">
        <rect x="0" y="0" width="72" height="12" rx="2" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.2" />
        <line x1="8" y1="4" x2="64" y2="4" stroke="#78350F" strokeWidth="0.8" strokeDasharray="3 2" />
        <line x1="8" y1="8" x2="64" y2="8" stroke="#78350F" strokeWidth="0.8" strokeDasharray="3 2" />
        <rect x="4" y="6" width="64" height="12" rx="2" fill="#FDE68A" stroke="#B45309" strokeWidth="1.2" opacity="0.9" />
        {/* Red sacred cord tied in center */}
        <line x1="36" y1="-2" x2="36" y2="20" stroke="#DC2626" strokeWidth="2.5" />
      </g>
      {/* Sacred Wooden/Golden Guru Paduka (Charan) */}
      <g transform="translate(36, 40)">
        {/* Left Paduka */}
        <path d="M8 8 C8 0 18 0 18 8 L18 28 C18 36 6 36 6 28 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" />
        <circle cx="13" cy="8" r="2.5" fill="#DC2626" />
        <circle cx="13" cy="8" r="1" fill="#FEF08A" />
        {/* Right Paduka */}
        <path d="M30 8 C30 0 40 0 40 8 L40 28 C40 36 28 36 28 28 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" />
        <circle cx="35" cy="8" r="2.5" fill="#DC2626" />
        <circle cx="35" cy="8" r="1" fill="#FEF08A" />
      </g>
    </svg>
  );
}

// 9. Krishna Janmashtami: Lord Krishna's Golden Bansuri, Peacock Feather & Dahi Handi
export function KrishnaJanmashtamiClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="krishnaHalo" cx="60" cy="55" r="50">
          <stop stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="0.6" stopColor="#6366F1" stopOpacity="0.2" />
          <stop offset="1" stopColor="#1E1B4B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldFlute" x1="20" y1="40" x2="100" y2="40">
          <stop stopColor="#FDE68A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="55" r="50" fill="url(#krishnaHalo)" />
      {/* Hanging Dahi Handi with ropes */}
      <g transform="translate(60, 65)">
        {/* Hanging Jute ropes */}
        <line x1="-16" y1="-50" x2="-14" y2="10" stroke="#A16207" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="16" y1="-50" x2="14" y2="10" stroke="#A16207" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="0" y1="-50" x2="0" y2="10" stroke="#A16207" strokeWidth="1.5" strokeDasharray="3 2" />
        {/* Clay Pot */}
        <ellipse cx="0" cy="30" rx="20" ry="10" fill="#78350F" />
        <path d="M-18 10 C-18 34 18 34 18 10 Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
        {/* Dripping White Makkhan (Butter) */}
        <path d="M-16 10 C-12 16 -10 12 -6 18 C-2 12 2 16 6 12 C10 16 14 12 16 10 C16 4 -16 4 -16 10 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="0" cy="24" r="3" fill="#FFFFFF" />
      </g>
      {/* Divine Peacock Feather (Mor Pankh) atop Flute */}
      <g transform="translate(32, 12) rotate(-15)">
        <path d="M14 42 C14 26 24 14 32 2 C28 16 26 28 26 44 Z" fill="#0D9488" />
        <ellipse cx="28" cy="16" rx="10" ry="14" fill="#0284C7" />
        <circle cx="28" cy="16" r="6" fill="#4338CA" />
        <circle cx="28" cy="16" r="3" fill="#FBBF24" />
      </g>
      {/* Divine Golden Bansuri (Flute) placed across */}
      <g transform="rotate(-24 60 55)">
        <rect x="22" y="52" width="76" height="6.5" rx="3" fill="url(#goldFlute)" stroke="#78350F" strokeWidth="1" />
        {/* Finger Holes */}
        <circle cx="45" cy="55.2" r="1.5" fill="#78350F" />
        <circle cx="53" cy="55.2" r="1.5" fill="#78350F" />
        <circle cx="61" cy="55.2" r="1.5" fill="#78350F" />
        <circle cx="69" cy="55.2" r="1.5" fill="#78350F" />
        <circle cx="77" cy="55.2" r="1.5" fill="#78350F" />
        <circle cx="85" cy="55.2" r="1.5" fill="#78350F" />
        {/* Red Silk Tassel */}
        <path d="M24 55 Q20 64 22 72" stroke="#DC2626" strokeWidth="2" fill="none" />
        <circle cx="22" cy="72" r="2.5" fill="#F59E0B" />
      </g>
    </svg>
  );
}

// 10. Maha Durga Puja & Dussehra: Ma Durga's Golden Trishul, Dhunuchi & Conch Shell
export function DurgaPujaDussehraClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="durgaHalo" cx="60" cy="50" r="50">
          <stop stopColor="#F43F5E" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="1" stopColor="#991B1B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldDurga" x1="50" y1="10" x2="70" y2="105">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="50" r="50" fill="url(#durgaHalo)" />
      {/* Ma Durga's Divine Third Eye & Sindoor Bindi motif */}
      <ellipse cx="60" cy="24" rx="4" ry="7" fill="#DC2626" />
      <circle cx="60" cy="24" r="2" fill="#FEF08A" />
      {/* Mighty Mahishasuramardini Trishula */}
      <line x1="60" y1="14" x2="60" y2="106" stroke="url(#goldDurga)" strokeWidth="4.5" strokeLinecap="round" />
      {/* Center Spear */}
      <polygon points="60,10 52,32 68,32" fill="url(#goldDurga)" stroke="#78350F" strokeWidth="1" />
      {/* Left curved wing */}
      <path d="M60 40 C42 40 32 26 34 16 C36 26 46 32 56 32" stroke="url(#goldDurga)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Right curved wing */}
      <path d="M60 40 C78 40 88 26 86 16 C84 26 74 32 64 32" stroke="url(#goldDurga)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Sacred Dhunuchi (Earthen Incense Burner) with fragrant smoke on left */}
      <g transform="translate(18, 58)">
        <ellipse cx="14" cy="28" rx="12" ry="5" fill="#78350F" />
        <path d="M4 28 L10 40 L18 40 L24 28 Z" fill="#92400E" stroke="#78350F" strokeWidth="1" />
        <rect x="12" y="40" width="4" height="12" rx="1" fill="#78350F" />
        {/* Swirling divine fragrant Dhuno smoke */}
        <path d="M14 26 Q10 16 18 8 Q24 0 16 -6" stroke="#FEF3C7" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />
        <circle cx="14" cy="24" r="2.5" fill="#EA580C" />
      </g>
      {/* Sacred Victory Conch (Shankha) on right */}
      <g transform="translate(76, 68) rotate(-15)">
        <path d="M12 2 C6 8 2 18 4 26 C8 32 22 30 26 22 C30 14 20 6 12 2 Z" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1.2" />
        <path d="M12 6 C10 14 10 22 16 26" stroke="#D97706" strokeWidth="1" fill="none" />
        <circle cx="12" cy="4" r="2" fill="#DC2626" />
      </g>
    </svg>
  );
}

// 11. Dhanteras & Diwali: Radiant Royal Diya, Goddess Lakshmi Lotus & Gold Sparkles
export function DhanterasDiwaliClipart({ className = "size-20" }: ClipartProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="diwaliGlow" cx="60" cy="50" r="50">
          <stop stopColor="#FDE047" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="#F97316" stopOpacity="0.3" />
          <stop offset="1" stopColor="#7C2D12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brassDiya" x1="20" y1="60" x2="100" y2="100">
          <stop stopColor="#FEF08A" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <radialGradient id="flameFire" cx="60" cy="38" r="16">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.3" stopColor="#FEF08A" />
          <stop offset="0.7" stopColor="#F97316" />
          <stop offset="1" stopColor="#DC2626" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="50" r="50" fill="url(#diwaliGlow)" />
      {/* Festive Rangoli Ring base */}
      <circle cx="60" cy="90" r="32" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
      {/* Sacred Royal Brass Diya */}
      <g transform="translate(60, 72)">
        <ellipse cx="0" cy="18" rx="32" ry="10" fill="#78350F" />
        <path d="M-30 10 C-30 26 30 26 30 10 C24 16 -24 16 -30 10 Z" fill="url(#brassDiya)" stroke="#78350F" strokeWidth="1.5" />
        {/* Lip / Wick spout */}
        <path d="M-12 10 Q0 6 12 10 Q0 14 -12 10 Z" fill="#92400E" />
        {/* Stand pedestal */}
        <path d="M-10 24 L10 24 L14 30 L-14 30 Z" fill="url(#brassDiya)" stroke="#78350F" strokeWidth="1" />
      </g>
      {/* Radiant Divine Flame (Deepak Jyoti) */}
      <g>
        <path d="M60 16 C52 30 48 42 54 52 C58 58 62 58 66 52 C72 42 68 30 60 16 Z" fill="url(#flameFire)" filter="drop-shadow(0 0 6px #F59E0B)" />
        {/* Inner white hot core */}
        <path d="M60 28 C56 36 54 44 58 48 C60 50 62 50 64 48 C66 44 64 36 60 28 Z" fill="#FFFFFF" opacity="0.9" />
      </g>
      {/* Showering Golden Diwali Sparkles */}
      <g fill="#FDE047">
        <circle cx="26" cy="34" r="2" />
        <polygon points="26,26 27.5,31 32,32 27.5,33 26,38 24.5,33 20,32 24.5,31" fill="#FDE047" />
        <circle cx="94" cy="34" r="2" />
        <polygon points="94,26 95.5,31 100,32 95.5,33 94,38 92.5,33 88,32 92.5,31" fill="#FDE047" />
      </g>
    </svg>
  );
}

/**
 * Universal Festival Clipart Dispatcher by festival ID or key
 */
export function FestivalClipart({ id, className }: { id: string; className?: string }) {
  const norm = id.toLowerCase();
  if (norm.includes("makar") || norm.includes("sankranti")) {
    return <MakarSankrantiClipart className={className} />;
  }
  if (norm.includes("saraswati") || norm.includes("vasant") || norm.includes("panchami")) {
    return <SaraswatiPujaClipart className={className} />;
  }
  if (norm.includes("shiva") || norm.includes("shivaratri")) {
    return <MahaShivaratriClipart className={className} />;
  }
  if (norm.includes("holi") || norm.includes("dol")) {
    return <HoliDolYatraClipart className={className} />;
  }
  if (norm.includes("navratri") || norm.includes("ram") || norm.includes("chaitra")) {
    return <ChaitraNavratriRamNavamiClipart className={className} />;
  }
  if (norm.includes("pohela") || norm.includes("boishakh") || norm.includes("bengali")) {
    return <PohelaBoishakhClipart className={className} />;
  }
  if (norm.includes("akshaya") || norm.includes("tritiya")) {
    return <AkshayaTritiyaClipart className={className} />;
  }
  if (norm.includes("guru") || norm.includes("purnima")) {
    return <GuruPurnimaClipart className={className} />;
  }
  if (norm.includes("krishna") || norm.includes("janmashtami")) {
    return <KrishnaJanmashtamiClipart className={className} />;
  }
  if (norm.includes("durga") || norm.includes("dussehra") || norm.includes("dashami")) {
    return <DurgaPujaDussehraClipart className={className} />;
  }
  if (norm.includes("diwali") || norm.includes("dhanteras") || norm.includes("kali") || norm.includes("deepavali")) {
    return <DhanterasDiwaliClipart className={className} />;
  }

  // Fallback
  return <DhanterasDiwaliClipart className={className} />;
}
