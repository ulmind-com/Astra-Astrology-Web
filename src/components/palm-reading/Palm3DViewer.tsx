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
  className?: string;
}

// Planetary Mount metadata
const MOUNT_META: Record<
  string,
  {
    nameBn: string;
    nameHi: string;
    nameEn: string;
    sym: string;
    planetBn: string;
    planetHi: string;
    planetEn: string;
    color: string;
    glow: string;
    nodeIdx: number;
    defaultElev: number;
    descBn: string;
    descEn: string;
  }
> = {
  jupiter: {
    nameBn: "বৃহস্পতি পর্বত",
    nameHi: "बृहस्पति पर्वत",
    nameEn: "Mount of Jupiter",
    sym: "♃",
    planetBn: "জ্ঞান, নেতৃত্ব ও উচ্চাকাঙ্ক্ষা",
    planetHi: "ज्ञान, नेतृत्व और महत्वाकांक्षा",
    planetEn: "Wisdom, Leadership & Ambition",
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.5)",
    nodeIdx: 5, // Index MCP
    defaultElev: 4.8,
    descBn: "তর্জনীর গোড়ায় অবস্থিত। উচ্চাকাঙ্ক্ষা ও স্বাধীন নেতৃত্বের পরিমাপ।",
    descEn: "Base of index finger. Denotes executive ambition and sovereign dignity.",
  },
  saturn: {
    nameBn: "শনি পর্বত",
    nameHi: "शनि पर्वत",
    nameEn: "Mount of Saturn",
    sym: "♄",
    planetBn: "শৃঙ্খলাপরায়ণতা ও ধৈর্য",
    planetHi: "अनुशासन और न्यायप्रियता",
    planetEn: "Discipline & Perseverance",
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.5)",
    nodeIdx: 9, // Middle MCP
    defaultElev: 3.9,
    descBn: "মধ্যমার পাদদেশে অবস্থিত। দায়িত্ববোধ ও ভাগ্যরেখার মূল স্তম্ভ।",
    descEn: "Base of middle finger. Governs responsibility and serious purpose.",
  },
  sun: {
    nameBn: "রবি/সূর্য পর্বত",
    nameHi: "सूर्य पर्वत",
    nameEn: "Mount of Apollo / Sun",
    sym: "☉",
    planetBn: "খ্যাতি, তেজ ও শিল্পকলা",
    planetHi: "प्रतिष्ठा और रचनात्मकता",
    planetEn: "Fame, Radiance & Artistry",
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.5)",
    nodeIdx: 13, // Ring MCP
    defaultElev: 4.2,
    descBn: "অনামিকার নিচে অবস্থিত। সৃজনশীল প্রতিভা ও সামাজিক সুনামের নির্দেশক।",
    descEn: "Base of ring finger. Illuminates creative charisma and public acclaim.",
  },
  mercury: {
    nameBn: "বুধ পর্বত",
    nameHi: "बुध पर्वत",
    nameEn: "Mount of Mercury",
    sym: "♿",
    planetBn: "বাণিজ্য, বাগ্মিতা ও মেধা",
    planetHi: "व्यापार और वाक्पटुता",
    planetEn: "Commerce & Eloquence",
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.5)",
    nodeIdx: 17, // Pinky MCP
    defaultElev: 3.7,
    descBn: "কনিষ্ঠার নিচে অবস্থিত। ব্যবসায়িক বুদ্ধি ও তীক্ষ্ণ যোগাযোগ ক্ষমতা।",
    descEn: "Base of little finger. Governs sharp communication and commercial insight.",
  },
  venus: {
    nameBn: "শুক্র পর্বত",
    nameHi: "शुक्र पर्वत",
    nameEn: "Mount of Venus",
    sym: "♀",
    planetBn: "জীবনীশক্তি, প্রেম ও ঐশ্বর্য",
    planetHi: "जीवन ऊर्जा और आकर्षण",
    planetEn: "Vitality, Love & Radiance",
    color: "#ec4899",
    glow: "rgba(236, 72, 153, 0.5)",
    nodeIdx: 2, // Thumb MCP
    defaultElev: 6.2,
    descBn: "বৃদ্ধাঙ্গুলির গোড়ায় অবস্থিত বিশাল উন্নত পর্বত। ওজস ও শারীরিক প্রাণশক্তির উৎস।",
    descEn: "Base of thumb. Primary reservoir of physical stamina and passion.",
  },
  moon: {
    nameBn: "চন্দ্র পর্বত",
    nameHi: "चंद्र पर्वत",
    nameEn: "Mount of Moon",
    sym: "☽",
    planetBn: "কল্পনা, অন্তর্দৃষ্টি ও ভ্রমণ",
    planetHi: "कल्पना और अंतर्ज्ञान",
    planetEn: "Intuition & Subconscious",
    color: "#06b6d4",
    glow: "rgba(6, 182, 212, 0.5)",
    nodeIdx: 0, // Wrist lateral
    defaultElev: 4.5,
    descBn: "করতলের নিম্ন বহিরাংশে অবস্থিত। কল্পনাপ্রবণতা ও গভীর ষষ্ঠেন্দ্রিয়।",
    descEn: "Percussion of lower palm. Governs imagination, poetry and overseas travel.",
  },
};

// 3D Volumetric Mesh Triangles connecting joints and palm surface facets
const VOLUMETRIC_FACETS: ReadonlyArray<readonly [number, number, number]> = [
  // Thenar (Venus) Dome
  [0, 1, 2],
  [1, 2, 5],
  [0, 2, 5],
  // Plain of Mars & Central Hollow
  [0, 5, 9],
  [0, 9, 13],
  [0, 13, 17],
  // Metacarpal Knuckle Arch
  [5, 6, 9],
  [6, 9, 10],
  [9, 10, 13],
  [10, 13, 14],
  [13, 14, 17],
  [14, 17, 18],
  // Inter-finger webbing
  [6, 7, 10],
  [7, 10, 11],
  [10, 11, 14],
  [11, 14, 15],
  [14, 15, 18],
  [15, 18, 19],
];

// Safe rounded rectangle for cross-browser canvas support (Safari, older WebViews)
function safeRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    const radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export function Palm3DViewer({
  landmarks3D,
  worldLandmarksMm,
  mountElevations = {},
  palmCupDepthMm = 4.8,
  flexibilityData = {},
  fingerInclinations = {},
  handedness = "Right",
  language = "bn",
  className,
}: Palm3DViewerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // 3D Orbit Camera Controls (Spherical Euler angles in radians)
  const [rotX, setRotX] = React.useState(-0.25); // Pitch
  const [rotY, setRotY] = React.useState(0.1);   // Yaw
  const [zoom, setZoom] = React.useState(1.05);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [activeMount, setActiveMount] = React.useState<string>("jupiter");

  // Visual Shading Modes:
  // "topography" -> Volumetric 3D Elevation Heatmap & Shaded Domes
  // "wireframe"  -> Futuristic Cyber Holographic Mesh & Bones
  // "hollow"     -> Plain of Mars Depth Contour Radar
  const [renderMode, setRenderMode] = React.useState<"topography" | "wireframe" | "hollow">("topography");

  // Normalized 3D Point coordinates centered at palm midpoint
  const processedPoints = React.useMemo<Pt[]>(() => {
    if (landmarks3D && landmarks3D.length >= 21) {
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
        x: (p[0] - cx) * 2.4,
        y: (p[1] - cy) * 2.4,
        z: ((p[2] || 0) - cz) * 2.4,
      }));
    }

    // High-fidelity anatomical 3D curved palm coordinates
    return [
      { x: 0.0, y: 0.46, z: 0.0 },    // 0: Wrist
      { x: -0.20, y: 0.32, z: 0.04 }, // 1: Thumb CMC (Venus slope)
      { x: -0.32, y: 0.18, z: 0.08 }, // 2: Thumb MCP (Venus summit)
      { x: -0.42, y: 0.06, z: 0.05 }, // 3: Thumb IP
      { x: -0.48, y: -0.04, z: 0.02 },// 4: Thumb TIP
      { x: -0.18, y: 0.04, z: 0.04 }, // 5: Index MCP (Jupiter summit)
      { x: -0.22, y: -0.16, z: 0.01 },// 6: Index PIP
      { x: -0.24, y: -0.30, z: -0.01 },// 7: Index DIP
      { x: -0.25, y: -0.42, z: -0.02 },// 8: Index TIP
      { x: -0.04, y: 0.01, z: 0.03 }, // 9: Middle MCP (Saturn summit)
      { x: -0.05, y: -0.20, z: 0.01 },// 10: Middle PIP
      { x: -0.05, y: -0.36, z: -0.01 },// 11: Middle DIP
      { x: -0.05, y: -0.50, z: -0.02 },// 12: Middle TIP
      { x: 0.11, y: 0.03, z: 0.035 }, // 13: Ring MCP (Sun summit)
      { x: 0.12, y: -0.18, z: 0.01 }, // 14: Ring PIP
      { x: 0.13, y: -0.32, z: -0.01 },// 15: Ring DIP
      { x: 0.14, y: -0.44, z: -0.02 },// 16: Ring TIP
      { x: 0.25, y: 0.09, z: 0.025 }, // 17: Pinky MCP (Mercury summit)
      { x: 0.28, y: -0.08, z: 0.0 },  // 18: Pinky PIP
      { x: 0.30, y: -0.20, z: -0.01 },// 19: Pinky DIP
      { x: 0.31, y: -0.30, z: -0.02 },// 20: Pinky TIP
    ];
  }, [landmarks3D]);

  // Touch and mouse drag handlers for 360° orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setRotY((prev) => prev + dx * 0.012);
    setRotX((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.012)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

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
    setRotY((prev) => prev + dx * 0.014);
    setRotX((prev) => Math.max(-1.4, Math.min(1.4, prev + dy * 0.014)));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  // Main 3D Render Loop
  const draw3DScene = React.useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Deep Cosmic Celestial Background
    const bgGrad = ctx.createRadialGradient(
      width / 2,
      height / 2,
      20,
      width / 2,
      height / 2,
      width * 0.7,
    );
    bgGrad.addColorStop(0, "#090d16");
    bgGrad.addColorStop(0.6, "#040711");
    bgGrad.addColorStop(1, "#02040a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 3D Perspective Projection Matrix
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const fov = 520;
    const scale = Math.min(width, height) * 0.88 * zoom;
    const centerX = width / 2;
    const centerY = height / 2 + 10;

    // Project 3D points
    const projected = processedPoints.map((pt, idx) => {
      // Rotation around Y (Yaw)
      const x1 = pt.x * cosY + pt.z * sinY;
      const y1 = pt.y;
      const z1 = -pt.x * sinY + pt.z * cosY;

      // Rotation around X (Pitch)
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX + 2.5; // Z Camera distance offset

      const pScale = fov / (fov + z2 * 130);
      const px = centerX + x2 * scale * pScale;
      const py = centerY + y2 * scale * pScale;

      return {
        origIdx: idx,
        x: px,
        y: py,
        z: z2,
        scale: pScale,
        raw3D: { x: x2, y: y2, z: z2 },
      };
    });

    // 1. Draw 3D Volumetric Surface Facets (Topography Relief Shading)
    if (renderMode === "topography" || renderMode === "wireframe") {
      // Directional light vector (coming from top-left front)
      const lightDir = { x: 0.35, y: -0.65, z: 0.68 };
      const lightNorm = Math.hypot(lightDir.x, lightDir.y, lightDir.z);
      lightDir.x /= lightNorm;
      lightDir.y /= lightNorm;
      lightDir.z /= lightNorm;

      // Sort facets by painter's algorithm (deepest Z first)
      const sortedFacets = [...VOLUMETRIC_FACETS].map((facet) => {
        const p1 = projected[facet[0]];
        const p2 = projected[facet[1]];
        const p3 = projected[facet[2]];
        const avgZ = (p1.z + p2.z + p3.z) / 3;
        return { facet, p1, p2, p3, avgZ };
      }).sort((a, b) => b.avgZ - a.avgZ);

      for (const { facet, p1, p2, p3 } of sortedFacets) {
        // Calculate 3D surface normal
        const v1x = p2.raw3D.x - p1.raw3D.x;
        const v1y = p2.raw3D.y - p1.raw3D.y;
        const v1z = p2.raw3D.z - p1.raw3D.z;

        const v2x = p3.raw3D.x - p1.raw3D.x;
        const v2y = p3.raw3D.y - p1.raw3D.y;
        const v2z = p3.raw3D.z - p1.raw3D.z;

        const nx = v1y * v2z - v1z * v2y;
        const ny = v1z * v2x - v1x * v2z;
        const nz = v1x * v2y - v1y * v2x;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        const dot = Math.max(0.12, (nx / nLen) * lightDir.x + (ny / nLen) * lightDir.y + (nz / nLen) * lightDir.z);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();

        if (renderMode === "topography") {
          // Dynamic elevation color gradient
          const intensity = Math.floor(dot * 210);
          const r = Math.floor(16 + intensity * 0.15);
          const g = Math.floor(70 + intensity * 0.65);
          const b = Math.floor(95 + intensity * 0.85);

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.55)`;
          ctx.fill();

          ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0.2, dot * 0.8)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          // Cyber Wireframe mode
          ctx.fillStyle = "rgba(56, 189, 248, 0.05)";
          ctx.fill();
          ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    // 2. Central Plain of Mars Volumetric Hollow Cup
    const wristP = projected[0];
    const idxP = projected[5];
    const midP = projected[9];
    const pinkP = projected[17];
    if (wristP && idxP && midP && pinkP) {
      const mx = (wristP.x + idxP.x + midP.x + pinkP.x) / 4;
      const my = (wristP.y + idxP.y + midP.y + pinkP.y) / 4;
      const cupR = 34 * zoom * wristP.scale;

      ctx.save();
      // Concentric depth depression rings
      const depthGrad = ctx.createRadialGradient(mx, my, 2, mx, my, cupR);
      depthGrad.addColorStop(0, "rgba(56, 189, 248, 0.5)");
      depthGrad.addColorStop(0.5, "rgba(2, 132, 199, 0.2)");
      depthGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = depthGrad;
      ctx.beginPath();
      ctx.arc(mx, my, cupR, 0, Math.PI * 2);
      ctx.fill();

      // Sonar contour depth rings
      ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mx, my, cupR * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Plain of Mars HUD crosshairs
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(mx - 14, my);
      ctx.lineTo(mx + 14, my);
      ctx.moveTo(mx, my - 14);
      ctx.lineTo(mx, my + 14);
      ctx.stroke();

      // Elevation Badge
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      safeRoundRect(ctx, mx - 38, my + 24, 76, 18, 4);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();
      ctx.font = "bold 9px sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "center";
      ctx.fillText(`♂ Mars -${palmCupDepthMm.toFixed(1)}mm`, mx, my + 36);
      ctx.restore();
    }

    // 3. Shaded 3D Finger Bone Cylinders
    for (const [a, b] of HAND_CONNECTIONS) {
      const pa = projected[a];
      const pb = projected[b];
      if (!pa || !pb) continue;

      const avgZ = (pa.z + pb.z) / 2;
      const alpha = Math.max(0.3, Math.min(1.0, 1.5 - avgZ * 0.35));

      ctx.save();
      const boneGrad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
      boneGrad.addColorStop(0, `rgba(52, 211, 153, ${alpha})`);
      boneGrad.addColorStop(0.5, `rgba(56, 189, 248, ${alpha})`);
      boneGrad.addColorStop(1, `rgba(251, 191, 36, ${alpha})`);

      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.lineWidth = Math.max(2.5, 6 * ((pa.scale + pb.scale) / 2));
      ctx.strokeStyle = boneGrad;
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(56, 189, 248, 0.6)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }

    // 4. Volumetric 3D Joint Nodes with Sphere Lighting
    const sortedNodes = [...projected].sort((a, b) => b.z - a.z);
    for (const node of sortedNodes) {
      const radius = Math.max(4, 8.5 * node.scale);

      ctx.save();
      // Outer aura
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 1.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3D Sphere Specular Shading
      const radGrad = ctx.createRadialGradient(
        node.x - radius * 0.3,
        node.y - radius * 0.3,
        radius * 0.1,
        node.x,
        node.y,
        radius,
      );
      radGrad.addColorStop(0, "#ffffff");
      radGrad.addColorStop(0.35, "#38bdf8");
      radGrad.addColorStop(0.85, "#0369a1");
      radGrad.addColorStop(1, "#082f49");

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = radGrad;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // 5. Floating 3D Planetary Mount Beacons with Laser Tethers
    Object.entries(MOUNT_META).forEach(([key, meta]) => {
      const pt = projected[meta.nodeIdx];
      if (!pt) return;

      const elev = mountElevations[key] || meta.defaultElev;
      const isSelected = activeMount === key;
      const name = language === "bn" ? meta.nameBn : language === "hi" ? meta.nameHi : meta.nameEn;

      // Laser Tether extending upward into 3D space
      const tetherH = 34 * pt.scale;
      const bx = pt.x;
      const by = pt.y - tetherH;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = isSelected ? 2 : 1.2;
      ctx.stroke();

      // Floating 3D Beacon Sphere
      ctx.beginPath();
      ctx.arc(bx, by, isSelected ? 14 : 11, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
      ctx.fill();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.shadowColor = meta.color;
      ctx.shadowBlur = isSelected ? 14 : 8;
      ctx.stroke();

      // Planet Symbol
      ctx.font = `bold ${isSelected ? 13 : 11}px sans-serif`;
      ctx.fillStyle = meta.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(meta.sym, bx, by);

      // Millimeter Height Floating Tag
      const tagTxt = `${name} +${elev.toFixed(1)}mm`;
      ctx.font = "bold 9px sans-serif";
      const tw = ctx.measureText(tagTxt).width;

      ctx.fillStyle = isSelected ? "rgba(30, 27, 75, 0.95)" : "rgba(15, 23, 42, 0.88)";
      safeRoundRect(ctx, bx - tw / 2 - 6, by - 26, tw + 12, 16, 4);
      ctx.fill();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.fillText(tagTxt, bx, by - 18);
      ctx.restore();
    });
  } catch (err) {
    console.warn("Palm3DViewer draw3DScene error:", err);
  }
  }, [
    activeMount,
    language,
    mountElevations,
    palmCupDepthMm,
    processedPoints,
    renderMode,
    rotX,
    rotY,
    zoom,
  ]);

  React.useEffect(() => {
    draw3DScene();
  }, [draw3DScene]);

  return (
    <div className={cn("relative flex flex-col overflow-hidden rounded-3xl border border-brand-300/80 bg-ink-950 text-white shadow-2xl", className)}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-400/30">
            <Move3d className="size-5" />
          </span>
          <div>
            <h4 className="text-sm font-black text-white">
              {language === "bn"
                ? "ত্রিমাত্রিক ৩ডি হস্ত টপোগ্রাফি মডেল"
                : language === "hi"
                ? "त्रिविमीय 3D हस्त स्थलाकृति मॉडल"
                : "3D Volumetric Palm Topography"}
            </h4>
            <p className="text-[10px] text-white/70">
              {language === "bn"
                ? "৩৬০° ড্র্যাগ রোটেশন · মিলিমিটার পর্বত উচ্চতা · সারফেস রিলিফ"
                : "360° Drag Orbit · Millimeter Mount Elevations · Surface Heatmap"}
            </p>
          </div>
        </div>

        {/* Shading Mode Switcher */}
        <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/15 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRenderMode("topography")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer",
              renderMode === "topography" ? "bg-brand-500 text-ink-950 font-black shadow-sm" : "text-white/80 hover:text-white",
            )}
          >
            <Mountain className="size-3.5" />
            <span>{language === "bn" ? "৩ডি রিলিফ" : "3D Relief"}</span>
          </button>

          <button
            type="button"
            onClick={() => setRenderMode("wireframe")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer",
              renderMode === "wireframe" ? "bg-brand-500 text-ink-950 font-black shadow-sm" : "text-white/80 hover:text-white",
            )}
          >
            <Layers className="size-3.5" />
            <span>{language === "bn" ? "ওয়্যারফ্রেম" : "Wireframe"}</span>
          </button>

          <button
            type="button"
            onClick={() => setRenderMode("hollow")}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer",
              renderMode === "hollow" ? "bg-brand-500 text-ink-950 font-black shadow-sm" : "text-white/80 hover:text-white",
            )}
          >
            <Activity className="size-3.5" />
            <span>{language === "bn" ? "মঙ্গল তল" : "Mars Cup"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive 3D Canvas */}
      <div
        className="relative h-[480px] sm:h-[560px] w-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <canvas ref={canvasRef} className="size-full" />

        {/* On-screen 3D Controls HUD */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1 text-[10px] font-mono text-cyan-300/80 bg-black/60 p-2.5 rounded-xl border border-white/10 backdrop-blur-xs">
          <span>YAW: {(rotY * (180 / Math.PI)).toFixed(0)}°</span>
          <span>PITCH: {(rotX * (180 / Math.PI)).toFixed(0)}°</span>
          <span>ZOOM: {(zoom * 100).toFixed(0)}%</span>
          <span className="text-emerald-400">STATUS: 360° 3D ORBIT ACTIVE</span>
        </div>

        {/* Zoom & Reset Buttons */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
            className="flex size-8 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 border border-white/15"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
            className="flex size-8 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 border border-white/15"
            title="Zoom Out"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => {
              setRotX(-0.25);
              setRotY(0.1);
              setZoom(1.05);
            }}
            className="flex size-8 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 border border-white/15"
            title="Reset View"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>

        {/* Orbit Drag Helper Pill */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 px-4 py-1.5 text-[11px] font-bold text-white/90 border border-white/15 shadow-lg backdrop-blur-md">
            <Orbit className="size-3.5 text-cyan-400 animate-spin" />
            {language === "bn"
              ? "হাতটি ৩৬০° কোণে ঘুরিয়ে দেখতে মাউস বা টাচ টেনে নিন"
              : "Drag with mouse or touch to rotate 360° in 3D"}
          </span>
        </div>
      </div>

      {/* Mount Elevation Quick Selector Bar */}
      <div className="border-t border-white/10 bg-black/50 p-3">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          {Object.entries(MOUNT_META).map(([key, meta]) => {
            const isSelected = activeMount === key;
            const elev = mountElevations[key] || meta.defaultElev;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveMount(key)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                  isSelected
                    ? "bg-white/20 border border-white/30 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white",
                )}
              >
                <span
                  className="flex size-5 items-center justify-center rounded-full text-[10px] font-black"
                  style={{ backgroundColor: meta.color, color: "#000" }}
                >
                  {meta.sym}
                </span>
                <span>{language === "bn" ? meta.nameBn : meta.nameEn}</span>
                <span className="font-mono text-cyan-300">+{elev.toFixed(1)}mm</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
