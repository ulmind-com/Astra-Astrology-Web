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
  CheckCircle2,
  AlertTriangle,
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
  onRetake?: () => void;
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

export function PalmBiometricMeshViewer({
  result,
  previewUrl,
  language,
  className,
  onRetake,
}: PalmBiometricMeshViewerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

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

  const imageSrc =
    viewMode === "crease_lines" && result.overlay_image
      ? result.overlay_image
      : previewUrl || result.overlay_image || "";

  // True only if backend detected 21 real landmarks
  const hasValidLandmarks = Boolean(
    result.landmarks_3d && Array.isArray(result.landmarks_3d) && result.landmarks_3d.length >= 21
  );

  const landmarks: number[][] = React.useMemo(() => {
    if (result.landmarks_3d && result.landmarks_3d.length >= 21) {
      return result.landmarks_3d;
    }
    return [];
  }, [result.landmarks_3d]);

  // Render 3D Biometric Mesh Canvas Overlay
  const renderMesh = React.useCallback(() => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || viewMode !== "mesh_overlay") return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      if (!hasValidLandmarks || landmarks.length < 21) return;

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
        ctx.fillStyle = "rgba(56, 189, 248, 0.08)";
        ctx.fill();
        ctx.restore();
      }

      // Draw Wireframe Edges
      ctx.save();
      for (const [startIdx, endIdx] of EXTENDED_MESH_EDGES) {
        const a = landmarks[startIdx];
        const b = landmarks[endIdx];
        if (!a || !b) continue;

        ctx.beginPath();
        ctx.moveTo(toX(a[0]), toY(a[1]));
        ctx.lineTo(toX(b[0]), toY(b[1]));
        ctx.strokeStyle = "rgba(56, 189, 248, 0.40)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // Draw Main Bone Skeletal Struts with Laser Glow
      for (const [aIdx, bIdx] of HAND_CONNECTIONS) {
        const a = landmarks[aIdx];
        const b = landmarks[bIdx];
        if (!a || !b) continue;

        const xa = toX(a[0]);
        const ya = toY(a[1]);
        const xb = toX(b[0]);
        const yb = toY(b[1]);

        const grad = ctx.createLinearGradient(xa, ya, xb, yb);
        grad.addColorStop(0, "#38bdf8");
        grad.addColorStop(1, "#0284c7");

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xa, ya);
        ctx.lineTo(xb, yb);
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = grad;
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 2. Draw Plain of Mars (Concave Palm Cup Radar Center)
    if (landmarks[0] && landmarks[9]) {
      const mx = (toX(landmarks[0][0]) + toX(landmarks[9][0])) / 2;
      const my = (toY(landmarks[0][1]) + toY(landmarks[9][1])) / 2;
      const cupDepth = result.palm_cup_depth_mm || 4.8;

      ctx.save();
      // Glowing radar concentric rings
      for (let r = 14; r <= 32; r += 9) {
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Crosshair
      ctx.beginPath();
      ctx.moveTo(mx - 18, my);
      ctx.lineTo(mx + 18, my);
      ctx.moveTo(mx, my - 18);
      ctx.lineTo(mx, my + 18);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.65)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Mars Badge
      const text = `♂ Mars -${cupDepth.toFixed(1)}mm`;
      ctx.font = "bold 9px sans-serif";
      const tw = ctx.measureText(text).width;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      safeRoundRect(ctx, mx - tw / 2 - 5, my + 24, tw + 10, 16, 4);
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, mx, my + 32);
      ctx.restore();
    }

    // 3. Draw 21 3D Joint Landmark Spheres (Nodes)
    if (showNodes) {
      for (let i = 0; i < landmarks.length; i += 1) {
        const pt = landmarks[i];
        const px = toX(pt[0]);
        const py = toY(pt[1]);
        const pz = pt[2] || 0;

        const zScale = 1.0 - Math.max(-0.4, Math.min(0.4, pz)) * 0.5;
        const r = Math.max(3.5, (w / 160) * zScale);

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
        const ptRaw = landmarks[m.nodeIdx];
        if (!ptRaw) continue;

        // Position the mount beacon within the anatomical fleshy pad of each planet
        let nx = ptRaw[0];
        let ny = ptRaw[1];
        if (landmarks[0]) {
          if (m.id === "venus") {
            // Venus mount sits on fleshy thenar eminence between thumb base (node 2) and wrist (node 0)
            nx = landmarks[2][0] * 0.52 + landmarks[0][0] * 0.48;
            ny = landmarks[2][1] * 0.52 + landmarks[0][1] * 0.48;
          } else {
            // Upper mounts (Jupiter, Saturn, Sun, Mercury) sit 18% down from knuckle toward wrist
            nx = ptRaw[0] * 0.82 + landmarks[0][0] * 0.18;
            ny = ptRaw[1] * 0.82 + landmarks[0][1] * 0.18;
          }
        }

        const x = toX(nx);
        const y = toY(ny);
        const elev = elevations[m.id as keyof typeof elevations] || 4.0;
        const name = language === "bn" ? m.nameBn : language === "hi" ? m.nameHi : m.nameEn;

        ctx.save();
        // Beacon ring
        ctx.beginPath();
        ctx.arc(x, y - 22, 10, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.fill();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Planet Symbol
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = m.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(m.sym, x, y - 22);

        // Elevation Badge Tag
        const tagText = `${name} +${elev.toFixed(1)}mm`;
        ctx.font = "bold 9px sans-serif";
        const textW = ctx.measureText(tagText).width;

        ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
        safeRoundRect(ctx, x - textW / 2 - 5, y - 42, textW + 10, 15, 4);
        ctx.fill();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tagText, x, y - 34);

        // Pointer line from beacon to mount center
        ctx.beginPath();
        ctx.moveTo(x, y - 12);
        ctx.lineTo(x, y - 2);
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Sacred Marks Holographic Glowing Pinpoints
    if (showSacredMarks && result.sacred_marks) {
      // Hand bounding box for boundary enforcement
      let lmMinX = 1.0;
      let lmMaxX = 0.0;
      let lmMinY = 1.0;
      let lmMaxY = 0.0;
      for (const p of landmarks) {
        if (p[0] < lmMinX) lmMinX = p[0];
        if (p[0] > lmMaxX) lmMaxX = p[0];
        if (p[1] < lmMinY) lmMinY = p[1];
        if (p[1] > lmMaxY) lmMaxY = p[1];
      }
      const padLmX = (lmMaxX - lmMinX) * 0.08;
      const padLmY = (lmMaxY - lmMinY) * 0.08;

      const foundMarks = result.sacred_marks.filter((m) => m.found && m.location_norm);
      for (const sm of foundMarks) {
        const smNormX = sm.location_norm[0];
        const smNormY = sm.location_norm[1];

        // Strict anatomical safety guard: never render sacred marks outside the hand region
        if (
          smNormX < lmMinX - padLmX ||
          smNormX > lmMaxX + padLmX ||
          smNormY < lmMinY - padLmY ||
          smNormY > lmMaxY + padLmY
        ) {
          continue;
        }

        const sx = toX(smNormX);
        const sy = toY(smNormY);
        const label = language === "bn" ? sm.sanskrit_name : sm.name;

        // Skip if outside canvas
        if (sx < 10 || sx > w - 10 || sy < 10 || sy > h - 10) continue;

        ctx.save();
        // Radiant golden aura
        ctx.beginPath();
        ctx.arc(sx, sy, 11, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(245, 158, 11, 0.22)";
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 1.4;
        ctx.shadowColor = "#f59e0b";
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Star glyph
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#fef08a";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✦", sx, sy);

        // Sacred Name Micro Badge
        ctx.font = "bold 9px sans-serif";
        const wTxt = ctx.measureText(label).width;
        const tagX = Math.max(wTxt / 2 + 6, Math.min(w - wTxt / 2 - 6, sx));
        const tagY = sy + 18 < h - 18 ? sy + 18 : sy - 18;

        ctx.fillStyle = "rgba(18, 18, 28, 0.88)";
        safeRoundRect(ctx, tagX - wTxt / 2 - 5, tagY - 7, wTxt + 10, 15, 4);
        ctx.fill();
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.fillStyle = "#fde047";
        ctx.fillText(label, tagX, tagY);
        ctx.restore();
      }
    }
  } catch (err) {
    console.warn("PalmBiometricMeshViewer renderMesh error:", err);
  }
  }, [
    hasValidLandmarks,
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

  // Adjust canvas resolution dynamically to match image perfectly with zero distortion
  const syncCanvasDimensions = React.useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const w = img.naturalWidth || img.clientWidth || 800;
    const h = img.naturalHeight || img.clientHeight || 1060;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    renderMesh();
  }, [renderMesh]);

  const handleImageLoad = () => {
    syncCanvasDimensions();
  };

  React.useEffect(() => {
    syncCanvasDimensions();
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      syncCanvasDimensions();
    }

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => {
        syncCanvasDimensions();
      });
      ro.observe(img);
      return () => ro.disconnect();
    }
  }, [syncCanvasDimensions, imageSrc, viewMode]);

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

      {/* Layer Filters (Visible in mesh overlay mode when landmarks exist) */}
      {viewMode === "mesh_overlay" && hasValidLandmarks && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted/60 px-4 py-2 text-xs">
          <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-brand-600" />
            {language === "bn" ? "বায়োমেট্রিক লেয়ার ফিল্টার:" : "Biometric Layer Controls:"}
          </span>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowNodes(!showNodes)}
              className={cn(
                "rounded-md px-2 py-0.5 border transition-all",
                showNodes ? "bg-brand-500/15 border-brand-500 text-brand-900 font-extrabold" : "bg-surface border-border text-muted-foreground",
              )}
            >
              ✓ {language === "bn" ? "২১টি জয়েন্ট নোড" : "21 Landmark Nodes"}
            </button>

            <button
              type="button"
              onClick={() => setShowWebbing(!showWebbing)}
              className={cn(
                "rounded-md px-2 py-0.5 border transition-all",
                showWebbing ? "bg-cyan-500/15 border-cyan-500 text-cyan-900 font-extrabold" : "bg-surface border-border text-muted-foreground",
              )}
            >
              ✓ {language === "bn" ? "পলিগোনাল ওয়েবিং" : "Polygonal Mesh"}
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
          /* Image Overlay Display with Pixel-Perfect Canvas Placement */
          <div ref={containerRef} className="relative w-full max-w-lg mx-auto flex items-center justify-center p-3">
            {imageSrc ? (
              <div className="relative inline-block mx-auto max-h-[540px] rounded-2xl overflow-hidden shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Palm Biometric Analysis"
                  onLoad={handleImageLoad}
                  className="max-h-[540px] w-auto max-w-full block select-none rounded-2xl"
                />

                {viewMode === "mesh_overlay" && hasValidLandmarks && (
                  <canvas
                    ref={canvasRef}
                    className="pointer-events-none absolute inset-0 size-full rounded-2xl"
                  />
                )}

                {/* If user selected 3D Node Mesh mode but landmarks were rejected/low-confidence */}
                {viewMode === "mesh_overlay" && !hasValidLandmarks && (
                  <div className="absolute inset-x-3 bottom-3 rounded-2xl border border-amber-500/40 bg-black/85 p-3.5 text-center backdrop-blur-md">
                    <p className="text-xs font-bold text-amber-300">
                      {language === "bn"
                        ? "হাতের বায়োমেট্রিক ফ্রেম সম্পূর্ণ স্পষ্ট হয়নি। সঠিক ফলাফলের জন্য করতলটি আলোতে সোজা করে ধরুন।"
                        : "Palm biometric joints not fully resolved in this wide shot. Frame your open palm closer to the camera."}
                    </p>
                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewMode("model_3d")}
                        className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-bold text-ink-950 shadow hover:bg-brand-400"
                      >
                        {language === "bn" ? "৩৬০° ৩ডি মডেল দেখুন" : "View 3D Model"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("crease_lines")}
                        className="rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30"
                      >
                        {language === "bn" ? "রেখা স্ক্যান দেখুন" : "View Creases"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
          <span className="text-xs font-black text-brand-700">
            {hasValidLandmarks ? "21 Joint Nodes" : "3D Model Simulated"}
          </span>
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
