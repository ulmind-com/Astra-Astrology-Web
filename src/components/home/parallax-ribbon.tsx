"use client";

import React, { useEffect, useState } from "react";

const CELESTIAL_WORDS = [
  "VEDIC HOROSCOPE",
  "KUNDLI MATCHING",
  "12 CELESTIAL HOUSES",
  "NAKSHATRA & PADA",
  "VIMSHOTTARI DASHA",
  "KP SYSTEM ASTROLOGY",
  "CHINESE ZODIAC",
  "TAROT & INTUITION",
  "SAMUDRIKA FACE READING",
  "CHALDEAN NUMEROLOGY",
  "VASTU SHASTRA",
];

export function ParallaxRibbon() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax horizontal offset: moves smoothly as you scroll
  const offset = (scrollY * 0.22) % 1200;

  return (
    <div className="relative w-full overflow-hidden py-4 bg-[#f8efe6] border-y border-[#ebd7c8]/80 select-none">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#faecd9]/40 via-transparent to-[#faecd9]/40 pointer-events-none" />

      {/* Moving Text Track with combined CSS marquee + Parallax scroll offset */}
      <div
        className="flex whitespace-nowrap will-change-transform"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {/* Render twice for continuous seamless repetition */}
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center gap-8 shrink-0 pr-8">
            {CELESTIAL_WORDS.map((word, i) => (
              <React.Fragment key={`${copyIndex}-${i}`}>
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-[#866e5f] hover:text-[#b06d4e] transition-colors">
                  {word}
                </span>
                <span className="text-[#b06d4e] text-xs font-serif opacity-70">
                  ✦
                </span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
