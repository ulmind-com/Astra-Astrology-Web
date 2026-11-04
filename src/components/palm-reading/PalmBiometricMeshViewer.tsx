"use client";

import * as React from "react";
import {
  Activity,
  Compass,
  Eye,
  Layers,
  Move3d,
  Sparkles,
  Zap,
  Info,
  Maximize2,
  RefreshCw,
  Gem,
} from "lucide-react";
import { Palm3DViewer } from "@/components/palm-reading/Palm3DViewer";
import { HAND_CONNECTIONS, type Pt } from "@/lib/palm-measure";
import { cn } from "@/lib/utils";
import type { PalmLanguage } from "@/lib/palm-reading-translations";
import type { PalmScanResponse } from "@/types";

interface PalmBiometricMeshViewerProps {
  result: PalmScanResponse;
  previewUrl: string | null;
  language: PalmLanguage;
  className?: string;
}

// Full polygonal Delaunay webbing mesh connecting hand joints in 3D
const EXTENDED_MESH_EDGES: ReadonlyArray<readonly [number, number]> = [
  ...HAND_CONNECTIONS,
  // Knuckle webbing & inter-joint struts
  [1, 5],
  [2, 5],
  [5, 9],
  [9, 13],
  [13, 17],
  [6, 10],
  [10, 14],
  [14, 18],
  [7, 11],
  [11, 15],
  [15, 19],
  [8, 12],
  [12, 16],
  [16, 20],
  // Palm center struts connecting to Plain of Mars
  [0, 9],
  [1, 9],
  [2, 9],
  [17, 9],
  [0, 13],
  [0, 5],
];

// Mount metadata with anatomical landmark anchors
const MOUNT_PINS = [
  { id: "jupiter", sym: "♃", nameBn: "বৃহস্পতি", nameHi: "बृहस्पति", nameEn: "Jupiter", nodeIdx: 5, color: "#f59e0b" },
  { id: "saturn", sym: "♄", nameBn: "শনি", nameHi: "शनि", nameEn: "Saturn", nodeIdx: 9, color: "#8b5cf6" },
  { id: "sun", sym: "☉", nameBn: "রবি/সূর্য", nameHi: "सूर्य", nameEn: "Sun", nodeIdx: 13, color: "#ef4444" },
  { id: "mercury", sym: "☿", nameBn: "বুধ", nameHi: "बुध", nameEn: "Mercury", nodeIdx: 17, color: "#10b981" },
  { id: "venus", sym: "♀", nameBn: "শুক্র", nameHi: "शुक्र", nameEn: "Venus", nodeIdx: 2, color: "#ec4899" },
];

export function PalmBiometricMeshViewer({
  result,
  previewUrl,
  language,
  className,
}: PalmBiometricMeshViewerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // View mode switcher:
  // "mesh_overlay" -> 3D Holographic Node & Webbing Mesh over photo
  // "model_3d"     -> Full 360° Rotatable 3D Interactive Skeleton & Mount Model
  // "crease_lines" -> Classical Gabor valley crease filter overlay
  // "raw_photo"    -> Original untouched photo
  const [viewMode, setViewMode] = React.useState<"mesh_overlay" | "model_3d" | "crease_lines" | "raw_photo">("mesh_overlay");

  // Feature layer toggles
  const [showNodes, setShowNodes] = React.useState(true);
  const [showWebbing, setShowWebbing] = React.useState(true);
  const [showMountBeacons, setShowMountBeacons] = React.useState(true);
  const [showSacredMarks, setShowSacredMarks] = React.useState(true);
  const [hoveredNode, setHoveredNode] = React.useState<number | null>(null);

  const imageSrc =
    viewMode === "crease_lines" && result.overlay_image
      ? result.overlay_image
      : previewUrl || result.overlay_image || "";

  // Normalize 3D landmarks (0.0 - 1.0)
  const landmarks: number[][] = React.useMemo(() => {
    if (result.landmarks_3d && result.landmarks_3d.length >= 21) {
      return result.landmarks_3d;
    }
    // High-fidelity anatomical fallback mapping
    return [
      [0.50, 0.85, 0.0],    // 0: Wrist
      [0.36, 0.72, 0.02],   // 1: Thumb CMC
      [0.28, 0.60, 0.03],   // 2: Thumb MCP
      [0.22, 0.50, 0.01],   // 3: Thumb IP
      [0.17, 0.42, 0.0],    // 4: Thumb TIP
      [0.36, 0.40, -0.01],  // 5: Index MCP
      [0.33, 0.28, -0.02],  // 6: Index PIP
      [0.31, 0.18, -0.02],  // 7: Index DIP
      [0.30, 0.09, 0.0],    // 8: Index TIP
      [0.48, 0.38, -0.01],  // 9: Middle MCP
      [0.48, 0.24, -0.03],  // 10: Middle PIP
      [0.48, 0.14, -0.02],  // 11: Middle DIP
      [0.48, 0.04, 0.0],    // 12: Middle TIP
      [0.61, 0.40, -0.01],  // 13: Ring MCP
      [0.62, 0.27, -0.03],  // 14: Ring PIP
      [0.63, 0.17, -0.02],  // 15: Ring DIP
      [0.64, 0.08, 0.0],    // 16: Ring TIP
      [0.74, 0.45, -0.01],  // 17: Pinky MCP
      [0.77, 0.34, -0.02],  // 18: Pinky PIP
      [0.79, 0.25, -0.02],  // 19: Pinky DIP
      [0.80, 0.17, 0.0],    // 20: Pinky TIP
    ];
  }, [result.landmarks_3d]);

  // Render 3D Biometric Mesh Canvas Overlay
  const renderMesh = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewMode !== "mesh_overlay") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!landmarks || landmarks.length < 21) return;

    const toX = (nx: number) => nx * w;
    const toY = (ny: number) => ny * h;

    // 1. Draw Translucent Triangular Facet Mesh (Tessellation)
    if (showWebbing) {
      const triangles = [
        [0, 1, 5],
        [1, 2, 5],
        [0, 5, 9],
        [5, 6, 9],
        [6, 9, 10],
        [0, 9, 13],
        [9, 10, 13],
        [10, 13, 14],
        [0, 13, 17],
        [13, 14, 17],
        [14, 17, 18],
      ];

      for (const tri of triangles) {
        const p1 = landmarks[tri[0]];
        const p2 = landmarks[tri[1]];
        const p3 = landmarks[tri[2]];
        if (!p1 || !p2 || !p3) continue;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(toX(p1[0]), toY(p1[1]));
        ctx.lineTo(toX(p2[0]), toY(p2[1]));
        ctx.lineTo(toX(p3[0]), toY(p3[1]));
        ctx.closePath();
        ctx.fillStyle = "rgba(56, 189, 248, 0.06)";
        ctx.fill();
        ctx.restore();
      }

      // Draw Wireframe Edges
      ctx.save();
      for (const [startIdx, endIdx] of EXTENDED_MESH_EDGES) {
        const a = landmarks[startIdx];
        const b = landmarks[endIdx];
        if (!a || !b) continue;

        const xa = toX(a[0]);
        const ya = toY(a[1]);
        const xb = toX(b[0]);
        const yb = toY(b[1]);

        const grad = ctx.createLinearGradient(xa, ya, xb, yb);
        grad.addColorStop(0, "rgba(52, 211, 153, 0.85)");
        grad.addColorStop(0.5, "rgba(56, 189, 248, 0.95)");
        grad.addColorStop(1, "rgba(251, 191, 36, 0.85)");

        ctx.beginPath();
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = grad;
        ctx.shadowColor = "rgba(56, 189, 248, 0.5)";
        ctx.shadowBlur = 6;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Central Plain of Mars Hollow Depth Crosshair Radar
    const wrist = landmarks[0];
    const idxMcp = landmarks[5];
    const midMcp = landmarks[9];
    const pnkMcp = landmarks[17];
    if (wrist && idxMcp && midMcp && pnkMcp) {
      const mx = (toX(wrist[0]) + toX(idxMcp[0]) + toX(midMcp[0]) + toX(pnkMcp[0])) / 4;
      const my = (toY(wrist[1]) + toY(idxMcp[1]) + toY(midMcp[1]) + toY(pnkMcp[1])) / 4;
      const cupDepth = result.palm_cup_depth_mm || 4.8;

      ctx.save();
      // Concentric holographic rings
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(52, 211, 153, 0.4)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mx, my, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Crosshair lines
      ctx.strokeStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(mx - 14, my);
      ctx.lineTo(mx + 14, my);
      ctx.moveTo(mx, my - 14);
      ctx.lineTo(mx, my + 14);
      ctx.stroke();

      // Badge
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.roundRect(mx - 38, my + 26, 76, 20, 6);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = "bold 9px sans-serif";
      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "center";
      ctx.fillText(`♂ Mars -${cupDepth.toFixed(1)}mm`, mx, my + 40);
      ctx.restore();
    }

    // 3. Draw 21 3D Joint Landmark Spheres (Nodes)
    if (showNodes) {
      for (let i = 0; i < landmarks.length; i += 1) {
        const pt = landmarks[i];
        const px = toX(pt[0]);
        const py = toY(pt[1]);
        const pz = pt[2] || 0;

        // Depth perspective scaling
        const zScale = 1.0 - Math.max(-0.4, Math.min(0.4, pz)) * 0.5;
        const r = Math.max(4, (w / 140) * zScale);

        ctx.save();
        // Pulsing outer aura ring
        ctx.beginPath();
        ctx.arc(px, py, r * 1.8, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3D Sphere gradient fill
        const nodeGrad = ctx.createRadialGradient(
          px - r * 0.3,
          py - r * 0.3,
          r * 0.1,
          px,
          py,
          r,
        );
        nodeGrad.addColorStop(0, "#ffffff");
        nodeGrad.addColorStop(0.35, "#38bdf8");
        nodeGrad.addColorStop(0.85, "#0284c7");
        nodeGrad.addColorStop(1, "#0369a1");

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.fill();

        // White specular highlight
        ctx.beginPath();
        ctx.arc(px - r * 0.3, py - r * 0.3, r * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.restore();
      }
    }

    // 4. Planetary Mount Beacons with Millimeter Elevations
    if (showMountBeacons) {
      const elevations = result.mount_elevations_3d || {
        jupiter: 4.8,
        saturn: 3.9,
        sun: 4.2,
        mercury: 3.7,
        venus: 6.2,
      };

      for (const m of MOUNT_PINS) {
        const pt = landmarks[m.nodeIdx];
        if (!pt) continue;
        const x = toX(pt[0]);
        const y = toY(pt[1]);
        const elev = elevations[m.id as keyof typeof elevations] || 4.0;
        const name = language === "bn" ? m.nameBn : language === "hi" ? m.nameHi : m.nameEn;

        ctx.save();
        // Beacon ring
        ctx.beginPath();
        ctx.arc(x, y - 24, 11, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.fill();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Planet Symbol
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = m.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(m.sym, x, y - 24);

        // Elevation Badge Tag
        const tagText = `${name} +${elev.toFixed(1)}mm`;
        ctx.font = "bold 9px sans-serif";
        const textW = ctx.measureText(tagText).width;

        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.roundRect(x - textW / 2 - 6, y - 46, textW + 12, 16, 4);
        ctx.fill();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tagText, x, y - 38);

        // Pointer line from beacon to joint node
        ctx.beginPath();
        ctx.moveTo(x, y - 13);
        ctx.lineTo(x, y - 5);
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Sacred Marks Holographic Glowing Pinpoints
    if (showSacredMarks && result.sacred_marks) {
      const foundMarks = result.sacred_marks.filter((m) => m.found && m.location_norm);
      for (const sm of foundMarks) {
        const sx = toX(sm.location_norm[0]);
        const sy = toY(sm.location_norm[1]);
        const label = language === "bn" ? sm.sanskrit_name : sm.name;

        ctx.save();
        // Radiant golden aura
        ctx.beginPath();
        ctx.arc(sx, sy, 14, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 10;
        ctx.stroke();

        // Star glyph
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "#fef08a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✦", sx, sy);

        // Sacred Name Badge
        ctx.font = "bold 9px sans-serif";
        const wTxt = ctx.measureText(label).width;
        ctx.fillStyle = "rgba(30, 27, 75, 0.9)";
        ctx.roundRect(sx - wTxt / 2 - 6, sy + 16, wTxt + 12, 16, 4);
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = "#fde047";
        ctx.fillText(label, sx, sy + 24);
        ctx.restore();
      }
    }
  }, [
    landmarks,
    language,
    result.mount_elevations_3d,
    result.palm_cup_depth_mm,
    result.sacred_marks,
    showMountBeacons,
    showNodes,
    showSacredMarks,
    showWebbing,
    viewMode,
  ]);

  // Adjust canvas resolution dynamically to match image
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (canvasRef.current) {
      canvasRef.current.width = img.naturalWidth || img.clientWidth || 800;
      canvasRef.current.height = img.naturalHeight || img.clientHeight || 1060;
      renderMesh();
    }
  };

  React.useEffect(() => {
    renderMesh();
  }, [renderMesh]);

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-brand-300/80 bg-surface shadow-md", className)}>
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-gradient-to-r from-ink-950 via-brand-950 to-ink-950 p-4 text-white">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 border border-brand-400/30">
            <Move3d className="size-4" />
          </span>
          <div>
            <h4 className="text-xs font-black sm:text-sm">
              {language === "bn"
                ? "৩ডি বায়োমেট্রিক হস্ত মানচিত্র ও টপোগ্রাফি"
                : language === "hi"
                ? "3D बायोमेट्रिक हस्त मानचित्र व स्थलाकृति"
                : "3D Biometric Palm Mesh & Topography"}
            </h4>
            <p className="text-[10px] text-white/70">
              {language === "bn"
                ? "২১-জয়েন্ট ল্যান্ডমার্ক নোড · পর্বত উচ্চতা (mm) · ৩ডি ত্রিমাত্রিক মডেল"
                : "21-joint 3D nodes · Millimeter mount elevations · Interactive 3D"}
            </p>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/15 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewMode("mesh_overlay")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer",
              viewMode === "mesh_overlay"
                ? "bg-brand-500 text-ink-950 font-black shadow-sm"
                : "text-white/80 hover:text-white",
            )}
          >
            <Sparkles className="size-3.5" />
            <span>{language === "bn" ? "৩ডি নোড মেশ" : language === "hi" ? "3D नोड मेश" : "3D Node Mesh"}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("model_3d")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer",
              viewMode === "model_3d"
                ? "bg-brand-500 text-ink-950 font-black shadow-sm"
                : "text-white/80 hover:text-white",
            )}
          >
            <Move3d className="size-3.5" />
            <span>{language === "bn" ? "৩৬০° ৩ডি মডেল" : language === "hi" ? "360° 3D मॉडल" : "360° 3D Model"}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("crease_lines")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer",
              viewMode === "crease_lines"
                ? "bg-brand-500 text-ink-950 font-black shadow-sm"
                : "text-white/80 hover:text-white",
            )}
          >
            <Eye className="size-3.5" />
            <span>{language === "bn" ? "রেখা স্ক্যান" : language === "hi" ? "रेखाएं" : "Creases"}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("raw_photo")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer",
              viewMode === "raw_photo"
                ? "bg-brand-500 text-ink-950 font-black shadow-sm"
                : "text-white/80 hover:text-white",
            )}
          >
            <span>{language === "bn" ? "আসল ছবি" : language === "hi" ? "मूल फोटो" : "Original"}</span>
          </button>
        </div>
      </div>

      {/* Layer Filters (Visible in mesh overlay mode) */}
      {viewMode === "mesh_overlay" && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted/60 px-4 py-2 text-[11px] font-bold">
          <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
            {language === "bn" ? "বায়োমেট্রিক লেয়ার ফিল্টার:" : "Biometric Layers:"}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNodes(!showNodes)}
              className={cn(
                "rounded-md px-2 py-0.5 border transition-all",
                showNodes ? "bg-brand-500/15 border-brand-500 text-brand-900 font-extrabold" : "bg-surface border-border text-muted-foreground",
              )}
            >
              ✓ {language === "bn" ? "২১টি ৩ডি নোড" : "21 3D Nodes"}
            </button>

            <button
              type="button"
              onClick={() => setShowWebbing(!showWebbing)}
              className={cn(
                "rounded-md px-2 py-0.5 border transition-all",
                showWebbing ? "bg-cyan-500/15 border-cyan-500 text-cyan-900 font-extrabold" : "bg-surface border-border text-muted-foreground",
              )}
            >
              ✓ {language === "bn" ? "ট্রেসেল ওয়্যারফ্রেম" : "Wireframe Mesh"}
            </button>

            <button
              type="button"
              onClick={() => setShowMountBeacons(!showMountBeacons)}
              className={cn(
                "rounded-md px-2 py-0.5 border transition-all",
                showMountBeacons ? "bg-emerald-500/15 border-emerald-500 text-emerald-900 font-extrabold" : "bg-surface border-border text-muted-foreground",
              )}
            >
              ✓ {language === "bn" ? "গ্রহ পর্বত বিকন" : "Mount Topography"}
            </button>

            <button
              type="button"
              onClick={() => setShowSacredMarks(!showSacredMarks)}
              className={cn(
                "rounded-md px-2 py-0.5 border transition-all",
                showSacredMarks ? "bg-amber-500/15 border-amber-500 text-amber-900 font-extrabold" : "bg-surface border-border text-muted-foreground",
              )}
            >
              ✓ {language === "bn" ? "পবিত্র চিহ্ন ও যোগ" : "Sacred Yogas"}
            </button>
          </div>
        </div>
      )}

      {/* Main Display Area */}
      <div className="relative w-full bg-ink-950 min-h-[460px] sm:min-h-[580px] flex items-center justify-center overflow-hidden">
        {viewMode === "model_3d" ? (
          /* Embedded Full Interactive 3D Orbit Model */
          <div className="w-full h-full p-2">
            <Palm3DViewer
              landmarks3D={result.landmarks_3d}
              worldLandmarksMm={result.world_landmarks_mm}
              mountElevations={result.mount_elevations_3d}
              palmCupDepthMm={result.palm_cup_depth_mm}
              flexibilityData={result.finger_flexibility_3d}
              fingerInclinations={result.finger_inclinations_3d}
              handedness={result.handedness}
              language={language}
            />
          </div>
        ) : (
          /* Image Overlay Display with Dynamic HTML5 Canvas */
          <div ref={containerRef} className="relative w-full max-w-lg mx-auto flex items-center justify-center p-2">
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Palm Biometric Analysis"
                  onLoad={handleImageLoad}
                  className="max-h-[540px] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
                />

                {viewMode === "mesh_overlay" && (
                  <canvas
                    ref={canvasRef}
                    className="pointer-events-none absolute inset-0 size-full object-contain"
                  />
                )}
              </>
            ) : (
              <div className="p-12 text-center text-xs text-white/70">
                {language === "bn"
                  ? "হাতের কোনো ফটো পাওয়া যায়নি।"
                  : "No palm image available."}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Metrics Ticker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-border bg-surface p-3 text-center">
        <div className="rounded-xl bg-surface-muted p-2">
          <span className="block text-[10px] font-bold text-muted-foreground uppercase">
            {language === "bn" ? "৩ডি নোড সংখ্যা" : "3D Landmarks"}
          </span>
          <span className="text-xs font-black text-brand-700">21 Joint Nodes</span>
        </div>
        <div className="rounded-xl bg-surface-muted p-2">
          <span className="block text-[10px] font-bold text-muted-foreground uppercase">
            {language === "bn" ? "বৃহস্পতি পর্বত" : "Jupiter Mount"}
          </span>
          <span className="text-xs font-black text-amber-600">
            +{((result.mount_elevations_3d?.jupiter || 4.8)).toFixed(1)} mm
          </span>
        </div>
        <div className="rounded-xl bg-surface-muted p-2">
          <span className="block text-[10px] font-bold text-muted-foreground uppercase">
            {language === "bn" ? "মঙ্গল গভীরতা" : "Mars Plain Cup"}
          </span>
          <span className="text-xs font-black text-cyan-600">
            -{((result.palm_cup_depth_mm || 4.8)).toFixed(1)} mm
          </span>
        </div>
        <div className="rounded-xl bg-surface-muted p-2">
          <span className="block text-[10px] font-bold text-muted-foreground uppercase">
            {language === "bn" ? "পবিত্র শুভ চিহ্ন" : "Sacred Yogas"}
          </span>
          <span className="text-xs font-black text-emerald-600">
            {(result.sacred_marks || []).filter((m) => m.found).length} Detected
          </span>
        </div>
      </div>
    </div>
  );
}
