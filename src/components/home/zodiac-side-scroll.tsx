"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface ZodiacSign {
  id: string;
  name: string;
  sanskrit: string;
  symbol: string;
  dates: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  ruler: string;
  traits: string[];
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    sanskrit: "Mesha",
    symbol: "♈",
    dates: "Mar 21 – Apr 19",
    element: "Fire",
    ruler: "Mars",
    traits: ["Bold", "Pioneer", "Passionate"],
  },
  {
    id: "taurus",
    name: "Taurus",
    sanskrit: "Vrishabha",
    symbol: "♉",
    dates: "Apr 20 – May 20",
    element: "Earth",
    ruler: "Venus",
    traits: ["Grounded", "Patient", "Devoted"],
  },
  {
    id: "gemini",
    name: "Gemini",
    sanskrit: "Mithuna",
    symbol: "♊",
    dates: "May 21 – Jun 20",
    element: "Air",
    ruler: "Mercury",
    traits: ["Curious", "Witty", "Adaptable"],
  },
  {
    id: "cancer",
    name: "Cancer",
    sanskrit: "Karka",
    symbol: "♋",
    dates: "Jun 21 – Jul 22",
    element: "Water",
    ruler: "Moon",
    traits: ["Intuitive", "Protective", "Empathetic"],
  },
  {
    id: "leo",
    name: "Leo",
    sanskrit: "Simha",
    symbol: "♌",
    dates: "Jul 23 – Aug 22",
    element: "Fire",
    ruler: "Sun",
    traits: ["Radiant", "Generous", "Courageous"],
  },
  {
    id: "virgo",
    name: "Virgo",
    sanskrit: "Kanya",
    symbol: "♍",
    dates: "Aug 23 – Sep 22",
    element: "Earth",
    ruler: "Mercury",
    traits: ["Analytical", "Helpful", "Precise"],
  },
  {
    id: "libra",
    name: "Libra",
    sanskrit: "Tula",
    symbol: "♎",
    dates: "Sep 23 – Oct 22",
    element: "Air",
    ruler: "Venus",
    traits: ["Harmonious", "Diplomatic", "Fair"],
  },
  {
    id: "scorpio",
    name: "Scorpio",
    sanskrit: "Vrishchika",
    symbol: "♏",
    dates: "Oct 23 – Nov 21",
    element: "Water",
    ruler: "Mars / Pluto",
    traits: ["Magnetic", "Deep", "Resilient"],
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    sanskrit: "Dhanu",
    symbol: "♐",
    dates: "Nov 22 – Dec 21",
    element: "Fire",
    ruler: "Jupiter",
    traits: ["Optimistic", "Free-spirited", "Wise"],
  },
  {
    id: "capricorn",
    name: "Capricorn",
    sanskrit: "Makara",
    symbol: "♑",
    dates: "Dec 22 – Jan 19",
    element: "Earth",
    ruler: "Saturn",
    traits: ["Ambitious", "Disciplined", "Enduring"],
  },
  {
    id: "aquarius",
    name: "Aquarius",
    sanskrit: "Kumbha",
    symbol: "♒",
    dates: "Jan 20 – Feb 18",
    element: "Air",
    ruler: "Saturn / Uranus",
    traits: ["Innovative", "Visionary", "Humanitarian"],
  },
  {
    id: "pisces",
    name: "Pisces",
    sanskrit: "Meena",
    symbol: "♓",
    dates: "Feb 19 – Mar 20",
    element: "Water",
    ruler: "Jupiter / Neptune",
    traits: ["Compassionate", "Artistic", "Mystical"],
  },
];

const ELEMENT_STYLES = {
  Fire: {
    badge: "bg-amber-500/10 text-amber-700 border-amber-500/25",
    glow: "hover:border-amber-400/40 hover:shadow-[0_10px_24px_-6px_rgba(217,119,6,0.18)]",
    symbolBg: "bg-amber-100/70 text-amber-800 border-amber-300/50",
  },
  Earth: {
    badge: "bg-emerald-500/10 text-emerald-800 border-emerald-500/25",
    glow: "hover:border-emerald-400/40 hover:shadow-[0_10px_24px_-6px_rgba(16,185,129,0.18)]",
    symbolBg: "bg-emerald-100/70 text-emerald-800 border-emerald-300/50",
  },
  Air: {
    badge: "bg-sky-500/10 text-sky-800 border-sky-500/25",
    glow: "hover:border-sky-400/40 hover:shadow-[0_10px_24px_-6px_rgba(14,165,233,0.18)]",
    symbolBg: "bg-sky-100/70 text-sky-800 border-sky-300/50",
  },
  Water: {
    badge: "bg-indigo-500/10 text-indigo-800 border-indigo-500/25",
    glow: "hover:border-indigo-400/40 hover:shadow-[0_10px_24px_-6px_rgba(99,102,241,0.18)]",
    symbolBg: "bg-indigo-100/70 text-indigo-800 border-indigo-300/50",
  },
};

export function ZodiacSideScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedElement, setSelectedElement] = useState<string>("All");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll boundary to update button states
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const filteredSigns =
    selectedElement === "All"
      ? ZODIAC_SIGNS
      : ZODIAC_SIGNS.filter((s) => s.element === selectedElement);

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 bg-gradient-to-b from-[#fffaf5] via-[#faf3eb] to-[#fffaf5] border-y border-[#ebd7c8]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[#b06d4e] mb-2">
              <Sparkles className="size-4" />
              <span className="text-xs sm:text-sm font-serif italic tracking-wide font-medium">
                Celestial Alignments
              </span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold tracking-tight text-[#4D4664]">
              The 12 Zodiac Constellations
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#665e75] max-w-xl">
              Scroll through the celestial houses to reveal elemental energies, ruling deities, and cosmic alignments.
            </p>
          </div>

          {/* Right: Filter Chips & Arrow Buttons */}
          <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
            {/* Element Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#f3e5d7]/70 border border-[#e5cebd]">
              {["All", "Fire", "Earth", "Air", "Water"].map((elem) => (
                <button
                  key={elem}
                  type="button"
                  onClick={() => setSelectedElement(elem)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                    selectedElement === elem
                      ? "bg-[#b06d4e] text-white shadow-sm"
                      : "text-[#5e5369] hover:text-[#b06d4e]"
                  }`}
                >
                  {elem}
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`flex size-10 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fbf1e7] text-[#4D4664] transition-all duration-200 hover:bg-[#faebd9] hover:scale-105 active:scale-95 ${
                  !canScrollLeft ? "opacity-40 cursor-not-allowed" : "shadow-sm"
                }`}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`flex size-10 items-center justify-center rounded-full border border-[#d6b7a2] bg-[#fbf1e7] text-[#4D4664] transition-all duration-200 hover:bg-[#faebd9] hover:scale-105 active:scale-95 ${
                  !canScrollRight ? "opacity-40 cursor-not-allowed" : "shadow-sm"
                }`}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Side-Scroll Track with Hidden Scrollbar & Snap */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="scrollbar-none flex gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {filteredSigns.map((sign) => {
            const style = ELEMENT_STYLES[sign.element];
            return (
              <Link
                key={sign.id}
                href={`/daily-horoscope?sign=${sign.id}`}
                className={`group shrink-0 snap-start w-[270px] sm:w-[290px] rounded-2xl border border-[#ebd7c8] bg-[#fdf9f4] p-5 transition-all duration-300 hover:-translate-y-1.5 ${style.glow}`}
              >
                {/* Top: Symbol Glyphs & Element Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex size-13 items-center justify-center rounded-2xl border text-2xl font-serif shadow-sm transition-transform duration-300 group-hover:scale-110 ${style.symbolBg}`}
                  >
                    {sign.symbol}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${style.badge}`}
                  >
                    {sign.element}
                  </span>
                </div>

                {/* Name & Sanskrit Counterpart */}
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#4D4664] group-hover:text-[#b06d4e] transition-colors">
                      {sign.name}
                    </h3>
                    <span className="text-xs font-serif italic text-[#8d7b92]">
                      ({sign.sanskrit})
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#7d7388] font-medium">
                    {sign.dates}
                  </p>
                </div>

                {/* Ruler Planet & Traits */}
                <div className="mt-4 pt-3.5 border-t border-[#f0e2d5] text-xs">
                  <div className="flex items-center justify-between text-[#635870]">
                    <span className="text-muted-foreground font-medium">Ruler:</span>
                    <span className="font-semibold text-[#4D4664]">{sign.ruler}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {sign.traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-md bg-[#f5ebe1] px-2 py-0.5 text-[10px] font-semibold text-[#5c4f69]"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive CTA Link */}
                <div className="mt-4 pt-2 flex items-center justify-between text-[11px] font-bold text-[#b06d4e] uppercase tracking-wider">
                  <span>Explore Horoscope</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    ──────▶
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
