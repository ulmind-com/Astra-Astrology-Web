"use client";

import React from "react";

interface CelestialZodiacHaloProps {
  size?: number;
  className?: string;
  speedSeconds?: number;
}

/**
 * Mathematically balanced, perfectly centered Royal Vedic Zodiac Halo.
 * Replaces asymmetric raster images with a pure, sharp, non-wobbling vector SVG.
 * Center is strictly (200, 200) in a 400x400 viewBox.
 */
export function CelestialZodiacHalo({
  size = 280,
  className = "",
  speedSeconds = 70,
}: CelestialZodiacHaloProps) {
  // Pre-calculate 12 Zodiac star nodes at exact 30-degree angles
  const zodiacNodes = React.useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 30 * Math.PI) / 180;
      const r = 168;
      const x = 200 + r * Math.cos(angle);
      const y = 200 + r * Math.sin(angle);

      const rInner = 142;
      const xInner = 200 + rInner * Math.cos(angle);
      const yInner = 200 + rInner * Math.sin(angle);

      return {
        index: i,
        angleDeg: i * 30,
        x,
        y,
        xInner,
        yInner,
      };
    });
  }, []);

  // Pre-calculate 36 fine astral tick marks
  const astralTicks = React.useMemo(() => {
    return Array.from({ length: 36 }).map((_, i) => {
      const angle = (i * 10 * Math.PI) / 180;
      const r1 = 186;
      const r2 = i % 3 === 0 ? 176 : 180;
      return {
        x1: 200 + r1 * Math.cos(angle),
        y1: 200 + r1 * Math.sin(angle),
        x2: 200 + r2 * Math.cos(angle),
        y2: 200 + r2 * Math.sin(angle),
        isMajor: i % 3 === 0,
      };
    });
  }, []);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Radiant Golden Ambient Aura Glow behind SVG */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.32) 0%, rgba(245,158,11,0.18) 45%, rgba(217,119,6,0.06) 65%, transparent 75%)",
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        fill="none"
        className="size-full animate-spin will-change-transform"
        style={{
          animationDuration: `${speedSeconds}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          transformOrigin: "center center",
        }}
      >
        <defs>
          <linearGradient id="goldChakraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#FCD34D" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="goldRingGlow" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.8" />
          </linearGradient>

          <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Outer Astral Orbit Rings */}
        <circle
          cx="200"
          cy="200"
          r="192"
          stroke="url(#goldChakraGrad)"
          strokeWidth="1"
          strokeDasharray="2 4"
          opacity={0.4}
        />
        <circle
          cx="200"
          cy="200"
          r="186"
          stroke="url(#goldRingGlow)"
          strokeWidth="1.5"
          opacity={0.65}
        />
        <circle
          cx="200"
          cy="200"
          r="176"
          stroke="url(#goldChakraGrad)"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity={0.5}
        />

        {/* 2. 36 Fine Astrological Degree Ticks */}
        {astralTicks.map((tick, idx) => (
          <line
            key={idx}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke="#F59E0B"
            strokeWidth={tick.isMajor ? 1.8 : 0.9}
            strokeLinecap="round"
            opacity={tick.isMajor ? 0.8 : 0.4}
          />
        ))}

        {/* 3. 12 Sacred Zodiac Radial Rays & House Dividers */}
        {zodiacNodes.map((node) => (
          <g key={node.index}>
            {/* Radial Spoke from Mid Ring to Inner Core */}
            <line
              x1={node.xInner}
              y1={node.yInner}
              x2={200 + 72 * Math.cos((node.angleDeg * Math.PI) / 180)}
              y2={200 + 72 * Math.sin((node.angleDeg * Math.PI) / 180)}
              stroke="url(#goldChakraGrad)"
              strokeWidth="1.2"
              strokeDasharray="2 3"
              opacity={0.45}
            />

            {/* Constellation Star Node (Diamond) */}
            <polygon
              points={`
                ${node.x},${node.y - 4.5} 
                ${node.x + 4.5},${node.y} 
                ${node.x},${node.y + 4.5} 
                ${node.x - 4.5},${node.y}
              `}
              fill="url(#goldRingGlow)"
              filter="url(#subtleGlow)"
            />

            {/* Micro Cusp Satellite Dot */}
            <circle
              cx={node.xInner}
              cy={node.yInner}
              r="2"
              fill="#FFFBEB"
              opacity={0.8}
            />
          </g>
        ))}

        {/* 4. Mid Sacred Geometry Ring (Hexagram & Star of Dharma) */}
        <circle
          cx="200"
          cy="200"
          r="142"
          stroke="url(#goldChakraGrad)"
          strokeWidth="1.8"
          opacity={0.7}
        />

        {/* Interlaced 12-petaled Sacred Lotus Arcs */}
        {zodiacNodes.map((node, i) => {
          const nextNode = zodiacNodes[(i + 1) % 12];
          return (
            <path
              key={`petal-${i}`}
              d={`M ${node.xInner} ${node.yInner} Q 200 200 ${nextNode.xInner} ${nextNode.yInner}`}
              stroke="#F59E0B"
              strokeWidth="0.8"
              fill="none"
              opacity={0.35}
            />
          );
        })}

        {/* 5. Inner Orbit Ring Encircling Central Emblem */}
        <circle
          cx="200"
          cy="200"
          r="92"
          stroke="url(#goldRingGlow)"
          strokeWidth="1.6"
          strokeDasharray="5 3"
          opacity={0.7}
        />
        <circle
          cx="200"
          cy="200"
          r="80"
          stroke="url(#goldChakraGrad)"
          strokeWidth="1"
          opacity={0.5}
        />

        {/* 6. Cardinal Sun Sparkles */}
        <path
          d="M 200 10 Q 200 20 206 20 Q 200 20 200 30 Q 200 20 194 20 Q 200 20 200 10 Z"
          fill="#FDE68A"
        />
        <path
          d="M 200 370 Q 200 380 206 380 Q 200 380 200 390 Q 200 380 194 380 Q 200 380 200 370 Z"
          fill="#FDE68A"
        />
        <path
          d="M 10 200 Q 20 200 20 206 Q 20 200 30 200 Q 20 200 20 194 Q 20 200 10 200 Z"
          fill="#FDE68A"
        />
        <path
          d="M 370 200 Q 380 200 380 206 Q 380 200 390 200 Q 380 200 380 194 Q 380 200 370 200 Z"
          fill="#FDE68A"
        />
      </svg>
    </div>
  );
}
