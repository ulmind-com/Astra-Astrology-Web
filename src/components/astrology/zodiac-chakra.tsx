"use client";

import React from "react";
import Image from "next/image";

interface ZodiacChakraProps {
  className?: string;
  speedSeconds?: number;
}

/**
 * ZodiacChakra - An authentic celestial astrological chakra wheel.
 * Features:
 * 1. Smooth 360-degree continuous celestial rotation for the inner Zodiac Wheel
 *    (12 Signs, Constellations, Radiant Golden Sun, Astrological Name Ring).
 * 2. Elegantly anchored Base Layer (Perspective Guides, Left Moon Badge,
 *    Right Sun Badge, Wings Flourish, and 5 Lunar Phases).
 * 3. Modern interactive hover dynamics: gentle acceleration and celestial aura glow.
 * 4. 100% transparent vector alignment with zero rectangular box/border mismatch.
 */
export function ZodiacChakra({
  className = "",
  speedSeconds = 60,
}: ZodiacChakraProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`group relative select-none w-full flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Dynamic Celestial Golden Aura Glow */}
      <div
        className={`absolute inset-[-8%] rounded-full bg-gradient-to-tr from-[#f6d7c2]/50 via-[#faebd9]/40 to-[#f9e5a8]/35 blur-3xl pointer-events-none transition-all duration-700 ease-out ${
          isHovered ? "opacity-100 scale-105" : "opacity-75 scale-100"
        }`}
        aria-hidden
      />

      {/* 2. Main Sacred Artwork Canvas (Strict 882x882 aspect ratio) */}
      <div className="relative z-10 w-full aspect-square transition-transform duration-700 ease-out group-hover:scale-[1.015]">
        
        {/* Layer A: Anchored Base Artwork (Guides, Badges, Wings, Lunar Phases) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Image
            src="/zodiac-chakra-base.png"
            alt="Celestial Zodiac Guides, Wings and Lunar Phases"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 760px"
            priority
            unoptimized
            className="object-contain"
          />
        </div>

        {/* Layer B: Rotating Sacred Zodiac Wheel (12 Signs, Constellations & Radiant Sun) */}
        {/* Math: In 882x882 canvas, wheel box is 608x608 from x=137, y=38 */}
        {/* Left: 137/882 = 15.533%, Top: 38/882 = 4.308%, Width/Height: 608/882 = 68.934% */}
        {/* Center of this box is EXACTLY (441, 342), the dead center of the circular wheel! */}
        <div
          className="absolute z-20"
          style={{
            left: "15.533%",
            top: "4.308%",
            width: "68.934%",
            height: "68.934%",
            transformOrigin: "center center",
            animation: `spin ${isHovered ? speedSeconds / 2 : speedSeconds}s linear infinite`,
            willChange: "transform",
          }}
        >
          <Image
            src="/zodiac-chakra-wheel.png"
            alt="Rotating 12 Zodiac Signs Wheel"
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 550px"
            priority
            unoptimized
            className="object-contain drop-shadow-[0_2px_12px_rgba(176,109,78,0.14)]"
          />
        </div>

      </div>
    </div>
  );
}
