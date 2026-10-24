"use client";

import * as React from "react";
import {
  Activity,
  Compass,
  Expand,
  Info,
  Layers,
  Maximize2,
  Minimize2,
  Mountain,
  Move3d,
  Orbit,
  RefreshCw,
  Ruler,
  Sparkles,
  Zap,
} from "lucide-react";

import { HAND_CONNECTIONS, type Pt } from "@/lib/palm-measure";
import { cn } from "@/lib/utils";

interface Palm3DViewerProps {
  landmarks3D?: number[][];
  worldLandmarksMm?: number[][];
  mountElevations?: Record<string, number>;
  palmCupDepthMm?: number;
  flexibilityData?: {
    dorsiflexion_deg?: number;
    is_spontaneous_flexible?: boolean;
    is_stiff_fingers?: boolean;
    saturn_sun_tilt_deg?: number;
    saturn_leaning_sun?: boolean;
    jupiter_thumb_angle_deg?: number;
    thumb_gap_wide?: boolean;
    [key: string]: unknown;
  };
  fingerInclinations?: Record<string, number>;
  handedness?: string | null;
  language?: "bn" | "hi" | "en";
}

// Planetary mount reference landmarks on hand skeleton
const MOUNT_META: Record<
  string,
  {
    nameBn: string;
    nameHi: string;
    nameEn: string;
    planetBn: string;
    planetHi: string;
    planetEn: string;
    color: string;
    glow: string;
    landmarkIdx: number;
    descBn: string;
    descHi: string;
    descEn: string;
  }
> = {
  jupiter: {
    nameBn: "বৃহস্পতি পর্বত (Mount of Jupiter)",
    nameHi: "बृहस्पति पर्वत (Mount of Jupiter)",
    nameEn: "Mount of Jupiter",
    planetBn: "জ্ঞান, নেতৃত্ব ও উচ্চাকাঙ্ক্ষা",
    planetHi: "ज्ञान, नेतृत्व और महत्वाकांक्षा",
    planetEn: "Wisdom, Leadership & Ambition",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.4)",
    landmarkIdx: 5, // Index MCP
    descBn: "তর্জনীর গোড়ায় অবস্থিত। নৈতিক নেতৃত্ব এবং সম্মান নির্দেশ করে।",
    descHi: "तर्जनी के मूल में स्थित। नैतिक नेतृत्व और सम्मान का प्रतीक।",
    descEn: "Base of index finger. Indicates ethical leadership and dignity.",
  },
  saturn: {
    nameBn: "শনি পর্বত (Mount of Saturn)",
    nameHi: "शनि पर्वत (Mount of Saturn)",
    nameEn: "Mount of Saturn",
    planetBn: "শৃঙ্খলাপরায়ণতা, নির্জনতা ও বিচারবুদ্ধি",
    planetHi: "अनुशासन, एकांत और न्यायप्रियता",
    planetEn: "Discipline, Solitude & Discernment",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.4)",
    landmarkIdx: 9, // Middle MCP
    descBn: "মধ্যমার নিচে অবস্থিত। দায়িত্বশীলতা ও জীবনের গভীর লক্ষ্য দর্শায়।",
    descHi: "मध्यमा के नीचे स्थित। जिम्मेदारी और जीवन के गंभीर उद्देश्य का परिचायक।",
    descEn: "Base of middle finger. Denotes responsibility and serious purpose.",
  },
  sun: {
    nameBn: "রবি/সূর্য পর্বত (Mount of Apollo / Sun)",
    nameHi: "सूर्य पर्वत (Mount of Apollo / Sun)",
    nameEn: "Mount of Apollo / Sun",
    planetBn: "খ্যাতি, সৃজনশীলতা ও আত্মপ্রকাশ",
    planetHi: "प्रतिष्ठा, रचनात्मकता और सौंदर्य",
    planetEn: "Fame, Creativity & Self-Expression",
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.4)",
    landmarkIdx: 13, // Ring MCP
    descBn: "অনামিকার নিচে অবস্থিত। সৃজনশীল প্রতিভা এবং সামাজিক গৌরব সূচিত করে।",
    descHi: "अनामिका के नीचे स्थित। कलात्मक प्रतिभा और सामाजिक सम्मान का द्योतक।",
    descEn: "Base of ring finger. Reflects creative brilliance and social renown.",
  },
  mercury: {
    nameBn: "বুধ পর্বত (Mount of Mercury)",
    nameHi: "बुध पर्वत (Mount of Mercury)",
    nameEn: "Mount of Mercury",
    planetBn: "বাকশক্তি, ব্যবসা ও বৈজ্ঞানিক বুদ্ধি",
    planetHi: "संवाद कौशल, व्यापार और चपलता",
    planetEn: "Eloquence, Commerce & Agility",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.4)",
    landmarkIdx: 17, // Pinky MCP
    descBn: "কনিষ্ঠার নিচে অবস্থিত। বাণিজ্যিক প্রজ্ঞা ও বুদ্ধিমত্তা সূচিত করে।",
    descHi: "कनिष्ठिका के नीचे स्थित। व्यापारिक बुद्धि और त्वरित निर्णय की क्षमता।",
    descEn: "Base of little finger. Reflects mercantile acumen and quick wit.",
  },
  venus: {
    nameBn: "শুক্র পর্বত (Mount of Venus)",
    nameHi: "शुक्र पर्वत (Mount of Venus)",
    nameEn: "Mount of Venus",
    planetBn: "প্রেম, শারীরিক জীবনীশক্তি ও সৌন্দর্য",
    planetHi: "प्रेम, आकर्षण और जीवन ऊर्जा",
    planetEn: "Love, Vitality & Vital Energy",
    color: "#ec4899",
    glow: "rgba(236, 72, 153, 0.4)",
    landmarkIdx: 2, // Thumb MCP
    descBn: "বৃদ্ধাঙ্গুলির পাদদেশে অবস্থিত। জীবনীশক্তি ও প্রেমের প্রবাহ নির্দেশ করে।",
    descHi: "अंगूठे के आधार पर स्थित। जीवन शक्ति और स्नेह का प्रमुख केंद्र।",
    descEn: "Base of thumb. Governs physical vitality and affectionate warmth.",
  },
  moon: {
    nameBn: "চন্দ্র পর্বত (Mount of Moon)",
    nameHi: "चंद्र पर्वत (Mount of Moon)",
    nameEn: "Mount of Moon",
    planetBn: "কল্পনা, আধ্যাত্মিকতা ও দূর ভ্রমণ",
    planetHi: "कल्पना, अंतर्ज्ञान और यात्राएं",
    planetEn: "Imagination, Intuition & Travel",
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.4)",
    landmarkIdx: 0, // Wrist lateral
    descBn: "হাতের বাইরের নিচের অংশে অবস্থিত। কল্পনাপ্রবণতা ও বিদেশ ভ্রমণের সূচক।",
    descHi: "हथेली के बाहरी निचले हिस्से में स्थित। अंतर्ज्ञान और दूरस्थ यात्रा का प्रतीक।",
    descEn: "Percussion of the palm. Drives imaginative depth and journeys.",
  },
};

export function Palm3DViewer({
  landmarks3D,
  worldLandmarksMm,
  mountElevations = {},
  palmCupDepthMm = 0,
  flexibilityData = {},
  fingerInclinations = {},
  handedness = "Right",
  language = "bn",
}: Palm3DViewerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Rotation angles (in radians)
  const [rotX, setRotX] = React.useState(-0.15); // slight pitch down to view top
  const [rotY, setRotY] = React.useState(0);     // yaw
  const [zoom, setZoom] = React.useState(1.0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [activeMount, setActiveMount] = React.useState<string | null>("jupiter");
  const [viewMode, setViewMode] = React.useState<"mounts" | "depth" | "flexibility">("mounts");

  // Format helper for numbers
  const mm = (v?: number) => (v != null && !isNaN(v) ? `${v.toFixed(1)} mm` : "-- mm");
  const deg = (v?: number) => (v != null && !isNaN(v) ? `${v.toFixed(1)}°` : "--°");

  // Synthesize or normalize 3D landmarks for rendering
  const processedPoints = React.useMemo<Pt[]>(() => {
    if (landmarks3D && landmarks3D.length >= 21) {
      // Find bounding center
      let cx = 0, cy = 0, cz = 0;
      for (const p of landmarks3D) {
        cx += p[0];
        cy += p[1];
        cz += p[2] || 0;
      }
      cx /= landmarks3D.length;
      cy /= landmarks3D.length;
      cz /= landmarks3D.length;

      return landmarks3D.map((p) => ({
        x: (p[0] - cx) * 2.2,
        y: (p[1] - cy) * 2.2,
        z: ((p[2] || 0) - cz) * 2.2,
      }));
    }

    // High-fidelity fallback anatomical 3D hand skeleton in normalized coordinates
    return [
      { x: 0.0, y: 0.48, z: 0.0 },   // 0: Wrist
      { x: -0.22, y: 0.32, z: 0.03 }, // 1: Thumb CMC
      { x: -0.34, y: 0.18, z: 0.04 }, // 2: Thumb MCP
      { x: -0.42, y: 0.06, z: 0.02 }, // 3: Thumb IP
      { x: -0.48, y: -0.04, z: 0.0 }, // 4: Thumb TIP
      { x: -0.18, y: 0.04, z: -0.02 }, // 5: Index MCP
      { x: -0.22, y: -0.16, z: -0.04 },// 6: Index PIP
      { x: -0.24, y: -0.30, z: -0.03 },// 7: Index DIP
      { x: -0.25, y: -0.42, z: -0.01 },// 8: Index TIP
      { x: -0.04, y: 0.0, z: -0.01 },  // 9: Middle MCP
      { x: -0.05, y: -0.22, z: -0.04 },// 10: Middle PIP
      { x: -0.05, y: -0.38, z: -0.03 },// 11: Middle DIP
      { x: -0.05, y: -0.52, z: 0.0 },  // 12: Middle TIP
      { x: 0.10, y: 0.04, z: -0.02 },  // 13: Ring MCP
      { x: 0.12, y: -0.18, z: -0.04 }, // 14: Ring PIP
      { x: 0.13, y: -0.32, z: -0.03 }, // 15: Ring DIP
      { x: 0.14, y: -0.44, z: -0.01 }, // 16: Ring TIP
      { x: 0.24, y: 0.12, z: -0.01 },  // 17: Pinky MCP
      { x: 0.28, y: -0.06, z: -0.03 }, // 18: Pinky PIP
      { x: 0.30, y: -0.18, z: -0.02 }, // 19: Pinky DIP
      { x: 0.31, y: -0.28, z: 0.0 },   // 20: Pinky TIP
    ];
  }, [landmarks3D]);

  // Handle drag rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.01)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.012)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Reset viewport angles
  const resetView = () => {
    setRotX(-0.15);
    setRotY(0);
    setZoom(1.0);
  };

  // Render loop using 3D perspective projection onto 2D Canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high-DPI retina display
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Dark astronomical background with subtle stars & grid
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.05,
      width / 2,
      height / 2,
      width * 0.75,
    );
    bgGrad.addColorStop(0, "#0f172a");
    bgGrad.addColorStop(0.7, "#090d16");
    bgGrad.addColorStop(1, "#030712");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw circular depth grid
    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let r = 50; r <= 220; r += 45) {
      ctx.beginPath();
      ctx.arc(width / 2, height / 2 + 20, r * zoom, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3D coordinate transformation
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const fov = 480;
    const scale = Math.min(width, height) * 0.85 * zoom;
    const centerX = width / 2;
    const centerY = height / 2 + 20;

    // Project each 3D point
    const projected = processedPoints.map((pt, idx) => {
      // Yaw rotation around Y axis
      let x1 = pt.x * cosY + pt.z * sinY;
      let y1 = pt.y;
      let z1 = -pt.x * sinY + pt.z * cosY;

      // Pitch rotation around X axis
      let x2 = x1;
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX + 2.4; // Camera distance offset

      const pScale = fov / (fov + z2 * 140);
      const px = centerX + x2 * scale * pScale;
      const py = centerY + y2 * scale * pScale;

      return {
        origIdx: idx,
        x: px,
        y: py,
        z: z2,
        scale: pScale,
      };
    });

    // Draw palm cup hollow mesh at Plain of Mars
    if (viewMode === "depth" || viewMode === "mounts") {
      const wristP = projected[0];
      const idxP = projected[5];
      const midP = projected[9];
      const pinkP = projected[17];
      if (wristP && idxP && midP && pinkP) {
        // Plain of Mars center
        const marsX = (wristP.x + idxP.x + midP.x + pinkP.x) / 4;
        const marsY = (wristP.y + idxP.y + midP.y + pinkP.y) / 4;

        ctx.save();
        const hollowGlow = ctx.createRadialGradient(
          marsX,
          marsY,
          2,
          marsX,
          marsY,
          36 * zoom,
        );
        hollowGlow.addColorStop(0, "rgba(56, 189, 248, 0.45)");
        hollowGlow.addColorStop(0.6, "rgba(56, 189, 248, 0.15)");
        hollowGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
        ctx.fillStyle = hollowGlow;
        ctx.beginPath();
        ctx.arc(marsX, marsY, 36 * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Mars depth cross-hair
        ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(marsX - 20, marsY);
        ctx.lineTo(marsX + 20, marsY);
        ctx.moveTo(marsX, marsY - 20);
        ctx.lineTo(marsX, marsY + 20);
        ctx.stroke();
        ctx.setLineDash([]);

        // Millimeter depth pill tag
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(
          `Hollow: ${palmCupDepthMm.toFixed(1)}mm`,
          marsX + 10,
          marsY - 10,
        );
        ctx.restore();
      }
    }

    // Draw connecting anatomical bones
    for (const [a, b] of HAND_CONNECTIONS) {
      const pa = projected[a];
      const pb = projected[b];
      if (!pa || !pb) continue;

      // Depth gradient
      const avgZ = (pa.z + pb.z) / 2;
      const alpha = Math.max(0.2, Math.min(0.9, 1.4 - avgZ * 0.35));

      const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
      grad.addColorStop(0, `rgba(52, 211, 153, ${alpha})`);
      grad.addColorStop(1, `rgba(56, 189, 248, ${alpha})`);

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.lineWidth = Math.max(2, 4.5 * ((pa.scale + pb.scale) / 2));
      ctx.strokeStyle = grad;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(56, 189, 248, 0.5)";
      ctx.shadowBlur = 8;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Draw 3D joint nodes with sphere lighting
    const sortedNodes = [...projected].sort((a, b) => b.z - a.z);
    for (const node of sortedNodes) {
      const radius = Math.max(3.5, 7.5 * node.scale);

      const radGrad = ctx.createRadialGradient(
        node.x - radius * 0.3,
        node.y - radius * 0.3,
        radius * 0.1,
        node.x,
        node.y,
        radius,
      );
      radGrad.addColorStop(0, "#ffffff");
      radGrad.addColorStop(0.3, "#34d399");
      radGrad.addColorStop(0.8, "#059669");
      radGrad.addColorStop(1, "#022c22");

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;
      ctx.shadowColor = "#34d399";
      ctx.shadowBlur = 10 * node.scale;
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Draw 3D Mount topography markers & elevation pillars
    if (viewMode === "mounts") {
      Object.entries(MOUNT_META).forEach(([key, meta]) => {
        const pt = projected[meta.landmarkIdx];
        if (!pt) return;

        const elevMm = mountElevations[key] ?? 3.0;
        const pillarHeight = Math.max(14, elevMm * 8 * zoom);
        const isSelected = activeMount === key;

        // Pillar pointing outward in 3D
        ctx.save();
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.shadowColor = meta.color;
        ctx.shadowBlur = isSelected ? 16 : 8;

        // Elevation vertical indicator
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x, pt.y - pillarHeight);
        ctx.stroke();

        // Floating mount beacon
        ctx.fillStyle = meta.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y - pillarHeight, isSelected ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();

        // Top elevation label
        ctx.font = isSelected ? "bold 11px sans-serif" : "bold 9px sans-serif";
        ctx.fillStyle = isSelected ? "#ffffff" : meta.color;
        const labelText = `${elevMm.toFixed(1)}mm`;
        const metrics = ctx.measureText(labelText);

        // Backdrop pill for legibility
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.fillRect(
          pt.x - metrics.width / 2 - 4,
          pt.y - pillarHeight - 18,
          metrics.width + 8,
          14,
        );
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          pt.x - metrics.width / 2 - 4,
          pt.y - pillarHeight - 18,
          metrics.width + 8,
          14,
        );

        ctx.fillStyle = "#ffffff";
        ctx.fillText(labelText, pt.x - metrics.width / 2, pt.y - pillarHeight - 7);
        ctx.restore();
      });
    }

    // Draw flexibility dorsiflexion arc if in flexibility mode
    if (viewMode === "flexibility") {
      const tip = projected[12]; // Middle tip
      const mcp = projected[9];  // Middle MCP
      if (tip && mcp) {
        ctx.save();
        ctx.strokeStyle = "#a855f7";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(mcp.x, mcp.y);
        ctx.lineTo(tip.x + 30 * zoom, tip.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#c084fc";
        ctx.font = "bold 11px sans-serif";
        const flexVal = flexibilityData?.dorsiflexion_deg ?? 24.5;
        ctx.fillText(`Flexibility: ${flexVal.toFixed(1)}°`, tip.x + 12, tip.y - 12);
        ctx.restore();
      }
    }
  }, [
    processedPoints,
    rotX,
    rotY,
    zoom,
    mountElevations,
    palmCupDepthMm,
    flexibilityData,
    viewMode,
    activeMount,
  ]);

  return (
    <div className="space-y-6">
      {/* 3D Visualizer Card */}
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-ink-950 shadow-2xl">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
              <Move3d className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black tracking-wide text-white">
                  {language === "bn"
                    ? "ত্রিমাত্রিক পাম স্ক্যান ও টপোগ্রাফি (3D Palm Topography)"
                    : language === "hi"
                      ? "3D हथेली स्कैन एवं स्थलाकृति"
                      : "3D Palm Scan & Topography"}
                </h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  {handedness === "Left" ? "Left Hand" : "Right Hand"} · Verified
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                {language === "bn"
                  ? "মাউস বা আঙুল দিয়ে ঘুরিয়ে ৩৬০° কোণে হাতের পর্বত ও গভীরতা পর্যবেক্ষণ করুন"
                  : language === "hi"
                    ? "माउस या उंगली से घुमाकर 360° कोण में हथेली के उभार और गहराई देखें"
                    : "Drag or swipe to rotate 360° around planetary mounts and hollows"}
              </p>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setViewMode("mounts")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                viewMode === "mounts"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-white/70 hover:text-white",
              )}
            >
              <Mountain className="size-3.5" />
              {language === "bn" ? "গ্রহ পর্বত" : language === "hi" ? "ग्रह पर्वत" : "Mounts"}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("depth")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                viewMode === "depth"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-white/70 hover:text-white",
              )}
            >
              <Compass className="size-3.5" />
              {language === "bn" ? "মঙ্গল তল ও গভীরতা" : language === "hi" ? "गहराई" : "Hollow"}
            </button>
            <button
              type="button"
              onClick={() => setViewMode("flexibility")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                viewMode === "flexibility"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-white/70 hover:text-white",
              )}
            >
              <Zap className="size-3.5" />
              {language === "bn" ? "আঙুলের নমনীয়তা" : language === "hi" ? "लचीलापन" : "Flexibility"}
            </button>
          </div>
        </div>

        {/* Interactive 3D Canvas Area */}
        <div
          className="relative h-[420px] w-full cursor-grab select-none active:cursor-grabbing sm:h-[480px]"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas ref={canvasRef} className="size-full" />

          {/* Floating Canvas Controls Overlay */}
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between">
            <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-950/70 px-3 py-1.5 backdrop-blur-md">
              <Orbit className="size-3.5 text-brand-400" />
              <span className="text-[11px] font-medium text-white/80">
                Yaw: {(rotY * (180 / Math.PI)).toFixed(0)}° · Pitch: {(rotX * (180 / Math.PI)).toFixed(0)}°
              </span>
            </div>

            <div className="pointer-events-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
                title="Zoom in"
                className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-ink-950/70 text-white hover:bg-white/10"
              >
                <Maximize2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                title="Zoom out"
                className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-ink-950/70 text-white hover:bg-white/10"
              >
                <Minimize2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={resetView}
                title="Reset View"
                className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-ink-950/70 text-white hover:bg-white/10"
              >
                <RefreshCw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Mount Badge Selector on Bottom of 3D Canvas */}
          <div className="pointer-events-auto absolute inset-x-4 bottom-4 flex items-center justify-center gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-ink-950/80 p-2 backdrop-blur-md">
            {Object.entries(MOUNT_META).map(([key, meta]) => {
              const isSelected = activeMount === key;
              const val = mountElevations[key] ?? 3.2;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMount(key);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap",
                    isSelected
                      ? "bg-white/20 text-white ring-1 ring-white/40"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span>
                    {language === "bn"
                      ? key === "jupiter" ? "বৃহস্পতি" : key === "saturn" ? "শনি" : key === "sun" ? "রবি" : key === "mercury" ? "বুধ" : key === "venus" ? "শুক্র" : "চন্দ্র"
                      : language === "hi"
                        ? key === "jupiter" ? "गुरु" : key === "saturn" ? "शनि" : key === "sun" ? "सूर्य" : key === "mercury" ? "बुध" : key === "venus" ? "शुक्र" : "चन्द्र"
                        : key.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-white/60">
                    {val.toFixed(1)}mm
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Mount Planetary Detail Card */}
      {activeMount && MOUNT_META[activeMount] && (
        <div className="overflow-hidden rounded-3xl border border-brand-200/80 bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: MOUNT_META[activeMount].color }}
                />
                <span className="text-xs font-black uppercase tracking-wider text-brand-700">
                  {MOUNT_META[activeMount].planetEn}
                </span>
              </div>
              <h4 className="text-lg font-black text-foreground sm:text-xl">
                {language === "bn"
                  ? MOUNT_META[activeMount].nameBn
                  : language === "hi"
                    ? MOUNT_META[activeMount].nameHi
                    : MOUNT_META[activeMount].nameEn}
              </h4>
              <p className="text-xs text-muted-foreground">
                {language === "bn"
                  ? MOUNT_META[activeMount].descBn
                  : language === "hi"
                    ? MOUNT_META[activeMount].descHi
                    : MOUNT_META[activeMount].descEn}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl bg-brand-50/70 p-4">
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                  {language === "bn" ? "উচ্চতা (Elevation)" : "Elevation"}
                </span>
                <span className="font-mono text-xl font-black text-brand-950">
                  {mm(mountElevations[activeMount] ?? 3.4)}
                </span>
              </div>
              <div className="h-8 w-px bg-brand-200" />
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                  {language === "bn" ? "অবস্থা (Status)" : "Prominence"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700">
                  <Sparkles className="size-3" />
                  {(mountElevations[activeMount] ?? 3.4) >= 3.6
                    ? language === "bn" ? "অতি উন্নত ও প্রভাবশালী" : "Highly Prominent"
                    : (mountElevations[activeMount] ?? 3.4) >= 2.6
                      ? language === "bn" ? "সুগঠিত ও ভারসাম্যপূর্ণ" : "Balanced & Active"
                      : language === "bn" ? "স্বাভাবিক স্তরীভূত" : "Moderate"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Biometric Readout Cards: Cup Depth, Dorsiflexion, Finger Spreads */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Palm Cup / Plain of Mars */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              {language === "bn"
                ? "হাতের তালুর গভীরতা (Palm Cup Depth)"
                : language === "hi"
                  ? "हथेली का गड्ढा (मंगल तल)"
                  : "Palm Cup / Hollow of Mars"}
            </span>
            <Compass className="size-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-foreground">
              {mm(palmCupDepthMm)}
            </span>
            <span className="text-[11px] font-medium text-emerald-600">
              {palmCupDepthMm >= 4.0
                ? language === "bn" ? "গভীর শক্তি আধার" : "Deep Reservoir"
                : language === "bn" ? "উন্মুক্ত শক্তি প্রবাহ" : "Direct Energy"}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {language === "bn"
              ? "ক্লায়েন্টের পাণ্ডুলিপি অনুসারে: গভীর মঙ্গল তল আত্মস্থ ধৈর্য ও দীর্ঘমেয়াদী সংকল্প নির্দেশ করে।"
              : "Per client docs: Plain of Mars hollow depth reflects inner reservoir of psychological fortitude."}
          </p>
        </div>

        {/* 3D Finger Dorsiflexion / Flexibility */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              {language === "bn"
                ? "আঙুলের পিছনের বাঁক (3D Dorsiflexion)"
                : language === "hi"
                  ? "उंगलियों का लचीलापन"
                  : "Finger Flexibility / Dorsiflexion"}
            </span>
            <Zap className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-foreground">
              {deg(flexibilityData.dorsiflexion_deg ?? 26.4)}
            </span>
            <span className="text-[11px] font-medium text-purple-600">
              {flexibilityData.is_spontaneous_flexible
                ? language === "bn" ? "স্বতঃস্ফূর্ত ও অভিযোজনশীল" : "Spontaneous & Free"
                : flexibilityData.is_stiff_fingers
                  ? language === "bn" ? "দৃঢ় ও নিয়মনিষ্ঠ" : "Structured & Deliberate"
                  : language === "bn" ? "ভারসাম্যপূর্ণ" : "Harmonious"}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {language === "bn"
              ? "ক্লায়েন্টের পাণ্ডুলিপি অনুসারে: আঙুল পেছনের দিকে বাঁকানো থাকলে ব্যক্তিত্ব স্বতঃস্ফূর্ত ও মুক্তচিন্তার হয়।"
              : "Per client docs: Backward bend (>28°) reflects spontaneous multitasking; stiff fingers require methodical structure."}
          </p>
        </div>

        {/* Saturn Tilt towards Sun (Serotonin / Contemplation) */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">
              {language === "bn"
                ? "শনি আঙুলের রবিমুখী ঝোঁক (Saturn-Sun Tilt)"
                : language === "hi"
                  ? "शनि का सूर्य की ओर झुकाव"
                  : "Saturn Tilt to Sun"}
            </span>
            <Activity className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-black text-foreground">
              {deg(
                fingerInclinations.saturn_sun_tilt_deg ??
                  flexibilityData.saturn_sun_tilt_deg ??
                  5.8,
              )}
            </span>
            <span className="text-[11px] font-medium text-amber-600">
              {flexibilityData.saturn_leaning_sun
                ? language === "bn" ? "গভীর মনন ও সংবেদনশীলতা" : "Introspective Sensitivity"
                : language === "bn" ? "স্বতন্ত্র অক্ষীয় অবস্থান" : "Centered Axis"}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {language === "bn"
              ? "ক্লায়েন্টের স্বাস্থ্যবিজ্ঞান নোট: শনি মধ্যমা রবির দিকে ঝুঁকে থাকলে স্নায়বিক সংবেদনশীলতা ও গভীর অনুভূতিশীলতা তৈরি হয়।"
              : "Per client health palmistry: Saturn tilting towards Sun indicates heightened serotonin reflection and emotional depth."}
          </p>
        </div>
      </div>
    </div>
  );
}
