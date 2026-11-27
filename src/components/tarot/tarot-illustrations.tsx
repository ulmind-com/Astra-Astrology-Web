/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import type { TarotCard } from "@/types/tarot";

interface TarotIllustrationProps {
  card: TarotCard;
  isReversed?: boolean;
}

interface ArtTreatment {
  src: string;
  objectPosition?: string;
  washClass: string;
  ringColor: string;
  sparkBg: string;
  filterStyle?: string;
}

const MAJOR_TREATMENT_MAP: Record<number, ArtTreatment> = {
  // 0: The Fool — dawn sky oracle
  0: {
    src: "/images/tarot/major-oracle.webp",
    objectPosition: "50% 18%",
    washClass: "from-sky-900/20 via-transparent to-amber-900/45",
    ringColor: "rgba(253, 230, 138, 0.45)",
    sparkBg: "rgba(254, 243, 199, 0.9)",
    filterStyle: "brightness(1.04) saturate(1.08)",
  },
  // 1: The Magician — sacred flame & zodiac wheel
  1: {
    src: "/images/tarot/suit-wands.webp",
    objectPosition: "50% 25%",
    washClass: "from-amber-900/25 via-transparent to-orange-950/55",
    ringColor: "rgba(251, 191, 36, 0.5)",
    sparkBg: "rgba(253, 224, 71, 0.95)",
    filterStyle: "contrast(1.04) saturate(1.12)",
  },
  // 2: The High Priestess — crescent lunar mystic
  2: {
    src: "/images/tarot/major-moon.webp",
    objectPosition: "50% 45%",
    washClass: "from-indigo-950/20 via-transparent to-slate-950/45",
    ringColor: "rgba(199, 210, 254, 0.45)",
    sparkBg: "rgba(224, 231, 255, 0.9)",
  },
  // 3: The Empress — blooming golden orchard coin
  3: {
    src: "/images/tarot/suit-pentacles.webp",
    objectPosition: "50% 25%",
    washClass: "from-emerald-950/15 via-transparent to-amber-950/40",
    ringColor: "rgba(251, 191, 36, 0.48)",
    sparkBg: "rgba(254, 240, 138, 0.9)",
    filterStyle: "saturate(1.06)",
  },
  // 4: The Emperor — blazing solar crown
  4: {
    src: "/images/tarot/major-sun.webp",
    objectPosition: "50% 45%",
    washClass: "from-amber-950/15 via-transparent to-orange-950/45",
    ringColor: "rgba(253, 224, 71, 0.5)",
    sparkBg: "rgba(254, 240, 138, 0.95)",
    filterStyle: "hue-rotate(-8deg) saturate(1.08)",
  },
  // 5: The Hierophant — sacred Vedic scroll & temple pillars
  5: {
    src: "/images/tarot/major-scroll.webp",
    objectPosition: "50% 50%",
    washClass: "from-amber-900/20 via-transparent to-stone-950/45",
    ringColor: "rgba(245, 158, 11, 0.48)",
    sparkBg: "rgba(253, 230, 138, 0.9)",
  },
  // 6: The Lovers — temple archway oracle under golden sun-wheel
  6: {
    src: "/images/tarot/major-oracle.webp",
    objectPosition: "50% 42%",
    washClass: "from-rose-950/20 via-transparent to-amber-950/45",
    ringColor: "rgba(253, 186, 116, 0.45)",
    sparkBg: "rgba(254, 215, 170, 0.9)",
    filterStyle: "saturate(1.12)",
  },
  // 7: The Chariot — golden celestial astrolabe navigation
  7: {
    src: "/images/tarot/suit-swords.webp",
    objectPosition: "50% 50%",
    washClass: "from-amber-950/15 via-transparent to-stone-950/50",
    ringColor: "rgba(251, 191, 36, 0.5)",
    sparkBg: "rgba(253, 224, 71, 0.92)",
    filterStyle: "brightness(1.08) contrast(1.06)",
  },
  // 8: Strength — luminous desert Agni fire
  8: {
    src: "/images/tarot/suit-wands.webp",
    objectPosition: "50% 42%",
    washClass: "from-orange-900/15 via-transparent to-red-950/45",
    ringColor: "rgba(251, 146, 60, 0.5)",
    sparkBg: "rgba(253, 186, 116, 0.95)",
    filterStyle: "saturate(1.15)",
  },
  // 9: The Hermit — mystic night lantern star
  9: {
    src: "/images/tarot/major-star.webp",
    objectPosition: "50% 45%",
    washClass: "from-indigo-950/20 via-transparent to-slate-950/50",
    ringColor: "rgba(253, 224, 71, 0.48)",
    sparkBg: "rgba(254, 249, 195, 0.95)",
  },
  // 10: Wheel of Fortune — cosmic Vedic kundli-chakra
  10: {
    src: "/images/tarot/major-scroll.webp",
    objectPosition: "50% 56%",
    washClass: "from-amber-950/15 via-transparent to-amber-950/45",
    ringColor: "rgba(245, 158, 11, 0.52)",
    sparkBg: "rgba(253, 224, 71, 0.95)",
    filterStyle: "contrast(1.06) saturate(1.1)",
  },
  // 11: Justice — cosmic temple equilibrium
  11: {
    src: "/images/tarot/suit-swords.webp",
    objectPosition: "54% 48%",
    washClass: "from-slate-900/20 via-transparent to-amber-950/45",
    ringColor: "rgba(226, 232, 240, 0.45)",
    sparkBg: "rgba(254, 240, 138, 0.9)",
    filterStyle: "contrast(1.08) brightness(1.06)",
  },
  // 12: The Hanged Man — tranquil twilight sacred waters
  12: {
    src: "/images/tarot/suit-cups.webp",
    objectPosition: "50% 40%",
    washClass: "from-cyan-950/25 via-transparent to-slate-950/55",
    ringColor: "rgba(125, 211, 252, 0.45)",
    sparkBg: "rgba(186, 230, 253, 0.9)",
  },
  // 13: Death — eclipsed crescent transition
  13: {
    src: "/images/tarot/major-moon.webp",
    objectPosition: "50% 50%",
    washClass: "from-stone-950/30 via-transparent to-slate-950/60",
    ringColor: "rgba(214, 211, 209, 0.45)",
    sparkBg: "rgba(253, 230, 138, 0.85)",
    filterStyle: "contrast(1.1) saturate(0.82)",
  },
  // 14: Temperance — luminous flowing river lamps
  14: {
    src: "/images/tarot/suit-cups.webp",
    objectPosition: "45% 58%",
    washClass: "from-sky-950/20 via-transparent to-amber-950/45",
    ringColor: "rgba(253, 224, 71, 0.45)",
    sparkBg: "rgba(254, 240, 138, 0.9)",
    filterStyle: "saturate(1.1)",
  },
  // 15: The Devil — deep obsidian ember staff
  15: {
    src: "/images/tarot/suit-wands.webp",
    objectPosition: "50% 35%",
    washClass: "from-rose-950/25 via-transparent to-stone-950/60",
    ringColor: "rgba(251, 113, 133, 0.42)",
    sparkBg: "rgba(253, 186, 116, 0.92)",
    filterStyle: "hue-rotate(-14deg) contrast(1.08)",
  },
  // 16: The Tower — cosmic lightning storm orb
  16: {
    src: "/images/tarot/major-star.webp",
    objectPosition: "50% 38%",
    washClass: "from-slate-950/25 via-transparent to-amber-950/55",
    ringColor: "rgba(251, 191, 36, 0.52)",
    sparkBg: "rgba(254, 240, 138, 0.95)",
    filterStyle: "contrast(1.12)",
  },
  // 17: The Star — 8-pointed blazing Nakshatra star
  17: {
    src: "/images/tarot/major-star.webp",
    objectPosition: "50% 50%",
    washClass: "from-blue-950/15 via-transparent to-indigo-950/40",
    ringColor: "rgba(253, 224, 71, 0.55)",
    sparkBg: "rgba(254, 249, 195, 0.95)",
  },
  // 18: The Moon — gilded crescent reflection
  18: {
    src: "/images/tarot/major-moon.webp",
    objectPosition: "50% 50%",
    washClass: "from-indigo-950/15 via-transparent to-blue-950/45",
    ringColor: "rgba(253, 224, 71, 0.5)",
    sparkBg: "rgba(254, 243, 199, 0.95)",
  },
  // 19: The Sun — radiant Suryadev medallion
  19: {
    src: "/images/tarot/major-sun.webp",
    objectPosition: "50% 48%",
    washClass: "from-amber-900/10 via-transparent to-orange-950/35",
    ringColor: "rgba(253, 224, 71, 0.55)",
    sparkBg: "rgba(255, 251, 235, 0.98)",
    filterStyle: "saturate(1.08)",
  },
  // 20: Judgement — temple gateway awakening
  20: {
    src: "/images/tarot/major-oracle.webp",
    objectPosition: "50% 36%",
    washClass: "from-amber-950/15 via-transparent to-stone-950/40",
    ringColor: "rgba(253, 230, 138, 0.48)",
    sparkBg: "rgba(254, 243, 199, 0.95)",
  },
  // 21: The World — complete celestial zodiac temple
  21: {
    src: "/images/tarot/major-oracle.webp",
    objectPosition: "50% 28%",
    washClass: "from-emerald-950/15 via-transparent to-amber-950/40",
    ringColor: "rgba(251, 191, 36, 0.52)",
    sparkBg: "rgba(254, 249, 195, 0.95)",
    filterStyle: "brightness(1.05) saturate(1.1)",
  },
};

const SUIT_TREATMENT_MAP: Record<string, ArtTreatment> = {
  wands: {
    src: "/images/tarot/suit-wands.webp",
    objectPosition: "50% 42%",
    washClass: "from-amber-950/15 via-transparent to-orange-950/45",
    ringColor: "rgba(251, 191, 36, 0.5)",
    sparkBg: "rgba(253, 224, 71, 0.95)",
  },
  cups: {
    src: "/images/tarot/suit-cups.webp",
    objectPosition: "50% 50%",
    washClass: "from-cyan-950/20 via-transparent to-indigo-950/55",
    ringColor: "rgba(125, 211, 252, 0.5)",
    sparkBg: "rgba(224, 242, 254, 0.92)",
  },
  swords: {
    src: "/images/tarot/suit-swords.webp",
    objectPosition: "52% 48%",
    washClass: "from-slate-900/20 via-transparent to-sky-950/50",
    ringColor: "rgba(253, 224, 71, 0.48)",
    sparkBg: "rgba(224, 242, 254, 0.9)",
  },
  pentacles: {
    src: "/images/tarot/suit-pentacles.webp",
    objectPosition: "50% 45%",
    washClass: "from-amber-950/10 via-transparent to-emerald-950/40",
    ringColor: "rgba(251, 191, 36, 0.5)",
    sparkBg: "rgba(254, 240, 138, 0.92)",
  },
};

function getCardArt(card: TarotCard): ArtTreatment {
  if (card.arcana === "major") {
    return MAJOR_TREATMENT_MAP[card.number] || MAJOR_TREATMENT_MAP[0];
  }
  const base = SUIT_TREATMENT_MAP[card.suit || "pentacles"] || SUIT_TREATMENT_MAP.pentacles;

  // Give Ace / Court / Numbered Minor cards subtle visual variation in framing
  const yShift = card.number === 1 ? "42%" : card.number >= 11 ? "34%" : "52%";
  const hueOffset = ((card.number % 5) - 2) * 5;
  return {
    ...base,
    objectPosition: `50% ${yShift}`,
    filterStyle: hueOffset !== 0 ? `hue-rotate(${hueOffset}deg) saturate(1.06)` : base.filterStyle,
  };
}

export function TarotIllustration({ card, isReversed = false }: TarotIllustrationProps) {
  const art = getCardArt(card);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl border border-amber-400/75 bg-[#1b110d] select-none">
      {/* 1. Painted Vintage / Vedic Rider-Waite Illustration with subtle Ken-Burns motion */}
      <div
        className={`w-full h-full ${isReversed ? "rotate-180" : ""} transition-transform duration-700`}
      >
        <img
          src={art.src}
          alt={card.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={{
            objectPosition: art.objectPosition || "50% 50%",
            filter: art.filterStyle,
          }}
          className="tarot-art-breath w-full h-full object-cover"
        />
      </div>

      {/* 2. Atmospheric vignette + bottom readability wash */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${art.washClass}`}
      />

      {/* 3. Subtle Sweeping Sunbeam Glaze */}
      <div
        aria-hidden="true"
        className="tarot-sunbeam-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 opacity-35"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255, 245, 214, 0.35) 50%, transparent 100%)",
        }}
      />

      {/* 4. Ultra-Delicate Slow-Orbiting Sacred Astrolabe Hairline Ring */}
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="tarot-ring-orbit pointer-events-none absolute inset-0 m-auto w-[78%] h-[78%] opacity-45"
      >
        <circle
          cx="60"
          cy="60"
          r="53"
          fill="none"
          stroke={art.ringColor}
          strokeWidth="0.6"
          strokeDasharray="2 5"
        />
        <circle cx="60" cy="7" r="1.4" fill={art.sparkBg} />
        <circle cx="60" cy="113" r="1.4" fill={art.sparkBg} />
      </svg>

      {/* 5. Floating Kinetic Light Motes */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="tarot-spark-float absolute w-1.5 h-1.5 rounded-full blur-[0.3px]"
          style={{
            top: "18%",
            left: "20%",
            backgroundColor: art.sparkBg,
            animationDelay: "0s",
          }}
        />
        <span
          className="tarot-spark-float absolute w-1 h-1 rounded-full"
          style={{
            top: "28%",
            right: "18%",
            backgroundColor: art.sparkBg,
            animationDelay: "1.4s",
          }}
        />
        <span
          className="tarot-spark-float absolute w-1.5 h-1.5 rounded-full blur-[0.3px]"
          style={{
            bottom: "22%",
            left: "26%",
            backgroundColor: art.sparkBg,
            animationDelay: "2.3s",
          }}
        />
        <span
          className="tarot-spark-float absolute w-1 h-1 rounded-full"
          style={{
            bottom: "28%",
            right: "24%",
            backgroundColor: art.sparkBg,
            animationDelay: "0.7s",
          }}
        />
      </div>

      {/* 6. Crisp Brass Inner Bevel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 rounded-lg border border-amber-200/35"
      />
    </div>
  );
}
