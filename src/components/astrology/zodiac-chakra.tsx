"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface ZodiacChakraProps {
  className?: string;
  speedSeconds?: number;
}

/**
 * ZodiacChakra - Authentic, uncut celestial chakra with modern kinetic astrological animation.
 * 
 * Key Design Principles:
 * 1. UNBROKEN ARTWORK: The sacred chakra illustration is 100% whole, uncut, and pristine.
 *    No artificial slicing or severed wings/lines.
 * 2. ROTATING CELESTIAL ORBITS: Concentric SVG astrological orbit rings (outer degree ring,
 *    inner sacred geometry, compass star rays) rotate continuously around the wheel center.
 * 3. CELESTIAL LEVITATION: Smooth floating breathing motion across the vertical axis.
 * 4. 3D GYROSCOPIC TILT: Interactive mouse parallax tilting in real-time.
 * 5. RADIANT AURA & SPARKLES: Warm golden solar pulse and twinkling constellation stars.
 */
export function ZodiacChakra({ className = "", speedSeconds = 60 }: ZodiacChakraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle, luxurious 3D tilt (-5 to +5 degrees)
    const rotateX = -((y - centerY) / centerY) * 5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative select-none w-full flex items-center justify-center ${className}`}
      style={{ perspective: 1200 }}
    >
      {/* 1. Dynamic Radiant Solar Aura Glow */}
      <div
        className="absolute inset-[-6%] rounded-full bg-gradient-to-tr from-[#f6d7c2]/45 via-[#faebd9]/40 to-[#f9e5a8]/35 blur-3xl pointer-events-none transition-all duration-700 ease-out animate-celestial-pulse"
        style={{
          transform: isHovered ? "scale(1.08)" : "scale(1)",
          opacity: isHovered ? 0.95 : 0.75,
        }}
        aria-hidden
      />

      {/* 2. Floating 3D Gyroscopic Container */}
      <div
        className="relative z-10 w-full aspect-square transition-transform duration-300 ease-out animate-celestial-float"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.018 : 1})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 3. Concentric Rotating Astrological Orbit Rings (Behind the Chakra) */}
        {/* Center of rotation is exactly (441, 375), matching the sun and main wheel */}
        <svg
          viewBox="0 0 882 882"
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d6a17b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#b06d4e" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Group A: Clockwise Rotating Celestial Degree Ring */}
          <g
            className="animate-celestial-spin"
            style={{
              transformOrigin: "441px 375px",
              animationDuration: isHovered ? "35s" : "65s",
            }}
          >
            {/* Outer Astrological Dashed Orbit */}
            <circle
              cx="441"
              cy="375"
              r="340"
              stroke="#b06d4e"
              strokeWidth="1.2"
              strokeDasharray="6 12"
              opacity="0.32"
            />
            {/* Fine Outer Boundary Track */}
            <circle
              cx="441"
              cy="375"
              r="348"
              stroke="#d6a17b"
              strokeWidth="0.8"
              opacity="0.22"
            />
            {/* 12 Astrological Degree Star Nodes (Every 30 degrees) */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (deg) => {
                const rad = (deg * Math.PI) / 180;
                const x = 441 + 340 * Math.cos(rad);
                const y = 375 + 340 * Math.sin(rad);
                return (
                  <g key={deg} transform={`translate(${x}, ${y})`}>
                    <circle r="2.2" fill="#b06d4e" opacity="0.6" />
                    <circle r="4" stroke="#d6a17b" strokeWidth="0.6" opacity="0.35" />
                  </g>
                );
              }
            )}
          </g>

          {/* Group B: Counter-Clockwise Rotating Sacred Geometry Orbit */}
          <g
            className="animate-celestial-spin-reverse"
            style={{
              transformOrigin: "441px 375px",
              animationDuration: isHovered ? "45s" : "85s",
            }}
          >
            {/* Inner Precision Dotted Track */}
            <circle
              cx="441"
              cy="375"
              r="318"
              stroke="#b06d4e"
              strokeWidth="1"
              strokeDasharray="2 8"
              opacity="0.28"
            />
            {/* 4 Cardinal Diamond Glyphs at Solstices/Equinoxes */}
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x = 441 + 318 * Math.cos(rad);
              const y = 375 + 318 * Math.sin(rad);
              return (
                <rect
                  key={`cardinal-${deg}`}
                  x={x - 2.5}
                  y={y - 2.5}
                  width="5"
                  height="5"
                  fill="#b06d4e"
                  opacity="0.5"
                  transform={`rotate(45 ${x} ${y})`}
                />
              );
            })}
          </g>

          {/* Group C: Very Subtle 8-Point Celestial Compass Rays */}
          <g
            className="animate-celestial-spin"
            style={{
              transformOrigin: "441px 375px",
              animationDuration: "140s",
            }}
          >
            {[0, 45, 90, 135].map((deg) => (
              <line
                key={`ray-${deg}`}
                x1={441 - 360 * Math.cos((deg * Math.PI) / 180)}
                y1={375 - 360 * Math.sin((deg * Math.PI) / 180)}
                x2={441 + 360 * Math.cos((deg * Math.PI) / 180)}
                y2={375 + 360 * Math.sin((deg * Math.PI) / 180)}
                stroke="#d6a17b"
                strokeWidth="0.8"
                strokeDasharray="4 24"
                opacity="0.18"
              />
            ))}
          </g>
        </svg>

        {/* 4. The 100% Uncut, Pristine Sacred Chakra Illustration */}
        <div className="relative z-10 w-full h-full">
          <Image
            src="/zodiac-chakra.png"
            alt="Exact Celestial Zodiac Chakra showing all 12 signs, constellations, radiant sun, wings and lunar phases"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 820px"
            priority
            unoptimized
            className="object-contain select-none"
          />
        </div>

        {/* 5. Twinkling Cosmic Sparkle Accents */}
        <span
          className="absolute top-[8%] left-[12%] text-[#b06d4e] text-lg font-serif select-none pointer-events-none animate-celestial-twinkle-1"
          aria-hidden
        >
          ✦
        </span>
        <span
          className="absolute top-[14%] right-[10%] text-[#d6a17b] text-base font-serif select-none pointer-events-none animate-celestial-twinkle-2"
          aria-hidden
        >
          ✧
        </span>
        <span
          className="absolute bottom-[22%] left-[6%] text-[#b06d4e] text-sm font-serif select-none pointer-events-none animate-celestial-twinkle-3"
          aria-hidden
        >
          ✦
        </span>
        <span
          className="absolute bottom-[18%] right-[8%] text-[#d6a17b] text-base font-serif select-none pointer-events-none animate-celestial-twinkle-1"
          aria-hidden
        >
          ✧
        </span>

      </div>
    </div>
  );
}
