"use client";

import {
  ChevronRight,
  Compass,
  Crosshair,
  Download,
  Eye,
  Highlighter,
  Info,
  Maximize2,
  Minimize2,
  Moon,
  PenTool,
  RefreshCw,
  Sparkles,
  Sun,
  Trash2,
  Undo2,
  X,
  Zap,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Alert, Button, Modal } from "@/components/ui";
import { whiteboardApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRealtime, useWhiteboardEvents } from "@/providers/realtime-provider";
import type {
  WhiteboardData,
  WhiteboardDrishti,
  WhiteboardPlanet,
  WhiteboardStroke,
  WhiteboardStrokePoint,
} from "@/types";

// ------------------------------------------------------------- Vedic Reference Data

export const HOUSE_INFO: Record<
  number,
  {
    name_en: string;
    name_bn: string;
    sanskrit: string;
    significations_en: string;
    significations_bn: string;
    karaka: string;
  }
> = {
  1: {
    name_en: "1st House (Lagna / Ascendant)",
    name_bn: "১ম ঘর (লগ্ন ভাব)",
    sanskrit: "Tanu Bhava",
    significations_en: "Self, physical body, vitality, personality, life path",
    significations_bn: "আত্মা, শরীর, স্বাস্থ্য, ব্যক্তিত্ব, জীবনীশক্তি ও জীবনের গতি",
    karaka: "Sun (সূর্য)",
  },
  2: {
    name_en: "2nd House (Dhana / Wealth)",
    name_bn: "২য় ঘর (ধন ও পরিবার)",
    sanskrit: "Dhana Bhava",
    significations_en: "Accumulated wealth, savings, speech, family, nutrition, eye sight",
    significations_bn: "সঞ্চিত ধন, পারিবারিক সম্পর্ক, বাকপটুতা, খাদ্য, চোখ",
    karaka: "Jupiter (বৃহস্পতি)",
  },
  3: {
    name_en: "3rd House (Sahaja / Courage)",
    name_bn: "৩য় ঘর (সহজ / পরাক্রম)",
    sanskrit: "Sahaja Bhava",
    significations_en: "Courage, initiative, younger siblings, short journeys, communication",
    significations_bn: "সাহস, উদ্যম, কনিষ্ঠ ভাইবোন, স্বল্প ভ্রমণ, হস্তশিল্প ও যোগাযোগ",
    karaka: "Mars (মঙ্গল)",
  },
  4: {
    name_en: "4th House (Sukha / Home)",
    name_bn: "৪র্থ ঘর (সুখ ও মাতৃ ভাব)",
    sanskrit: "Sukha Bhava",
    significations_en: "Mother, mental peace, home, real estate, vehicles, education",
    significations_bn: "মাতা, মানসিক শান্তি, গৃহ, জমি-বাড়ি, যানবাহন, প্রাথমিক শিক্ষা",
    karaka: "Moon (চন্দ্র) & Venus (শুক্র)",
  },
  5: {
    name_en: "5th House (Putra / Intellect)",
    name_bn: "৫ম ঘর (পুত্র ও পূর্বপুণ্য)",
    sanskrit: "Putra Bhava",
    significations_en: "Children, creativity, intellect, romance, past karma, speculation",
    significations_bn: "সন্তানসন্ততি, উচ্চশিক্ষা, পূর্বজন্মের পুণ্য, সৃজনশীলতা, প্রেম",
    karaka: "Jupiter (বৃহস্পতি)",
  },
  6: {
    name_en: "6th House (Ari / Enemies & Health)",
    name_bn: "৬ষ্ঠ ঘর (শত্রু, ঋণ ও রোগ)",
    sanskrit: "Ari Bhava",
    significations_en: "Obstacles, enemies, debts, diseases, daily service, litigation",
    significations_bn: "রোগ, শত্রু, ঋণ, প্রতিযোগিতা, মামলা-মোকদ্দমা, কর্মক্ষেত্রের শ্রম",
    karaka: "Mars (মঙ্গল) & Saturn (শনি)",
  },
  7: {
    name_en: "7th House (Yuvati / Marriage)",
    name_bn: "৭ম ঘর (জায়া / দাম্পত্য ও অংশীদারি)",
    sanskrit: "Yuvati Bhava",
    significations_en: "Spouse, marriage, business partnerships, public relations",
    significations_bn: "জীবনসঙ্গী, বিবাহিত জীবন, ব্যবসায়িক পার্টনার, জনসম্পর্ক",
    karaka: "Venus (শুক্র) & Jupiter (বৃহস্পতি)",
  },
  8: {
    name_en: "8th House (Randhra / Longevity)",
    name_bn: "৮ম ঘর (আয়ু ও রূপান্তর)",
    sanskrit: "Randhra Bhava",
    significations_en: "Longevity, sudden transformations, occult, inheritance, research",
    significations_bn: "আয়ু, আকস্মিক পরিবর্তন, গুহ্যবিদ্যা, উত্তরাধিকার, রূপান্তর",
    karaka: "Saturn (শনি)",
  },
  9: {
    name_en: "9th House (Bhagya / Fortune)",
    name_bn: "৯ম ঘর (ভাগ্য ও ধর্ম ভাব)",
    sanskrit: "Dharma / Bhagya Bhava",
    significations_en: "Fortune, higher wisdom, Guru, father, spirituality, long journeys",
    significations_bn: "ভাগ্য, ধর্ম, গুরুকৃপা, পিতা, আধ্যাত্মিকতা, দূর ভ্রমণ ও তীর্থযাত্রা",
    karaka: "Jupiter (বৃহস্পতি) & Sun (সূর্য)",
  },
  10: {
    name_en: "10th House (Karma / Career)",
    name_bn: "১০ম ঘর (কর্ম ও যশ ভাব)",
    sanskrit: "Karma Bhava",
    significations_en: "Career, profession, social standing, authority, fame, governance",
    significations_bn: "কর্মজীবন, পদমর্যাদা, সম্মান, রাজযোগ, প্রশাসনিক কর্তৃত্ব, প্রতিষ্ঠা",
    karaka: "Sun, Mercury, Jupiter, Saturn",
  },
  11: {
    name_en: "11th House (Labha / Gains)",
    name_bn: "১১শ ঘর (লাভ ও সিদ্ধি ভাব)",
    sanskrit: "Labha Bhava",
    significations_en: "Gains, regular cashflow, elder siblings, wishes fulfillment, networks",
    significations_bn: "উপার্জন, সমৃদ্ধি, জ্যেষ্ঠ ভাইবোন, মনোবাঞ্ছা পূরণ, বন্ধু ও নেটওয়ার্ক",
    karaka: "Jupiter (বৃহস্পতি)",
  },
  12: {
    name_en: "12th House (Vyaya / Expenses)",
    name_bn: " ১২শ ঘর (ব্যয় ও মোক্ষ ভাব)",
    sanskrit: "Vyaya Bhava",
    significations_en: "Expenses, foreign residence, subconscious, spirituality, liberation",
    significations_bn: "ব্যয়, দূরদেশ ভ্রমণ, হাসপাতাল/বিচ্ছিন্নতা, শয়নসুখ, মোক্ষলাভ",
    karaka: "Saturn (শনি) & Ketu (কেতু)",
  },
};

export const RASHI_NAMES: Record<
  number,
  { en: string; bn: string; lord: string; symbol: string }
> = {
  1: { en: "Aries", bn: "মেষ", lord: "Mars", symbol: "♈" },
  2: { en: "Taurus", bn: "বৃষ", lord: "Venus", symbol: "♉" },
  3: { en: "Gemini", bn: "মিথুন", lord: "Mercury", symbol: "♊" },
  4: { en: "Cancer", bn: "কর্কট", lord: "Moon", symbol: "♋" },
  5: { en: "Leo", bn: "সিংহ", lord: "Sun", symbol: "♌" },
  6: { en: "Virgo", bn: "কন্যা", lord: "Mercury", symbol: "♍" },
  7: { en: "Libra", bn: "তুলা", lord: "Venus", symbol: "♎" },
  8: { en: "Scorpio", bn: "বৃশ্চিক", lord: "Mars", symbol: "♏" },
  9: { en: "Sagittarius", bn: "ধনু", lord: "Jupiter", symbol: "♐" },
  10: { en: "Capricorn", bn: "মকর", lord: "Saturn", symbol: "♑" },
  11: { en: "Aquarius", bn: "কুম্ভ", lord: "Saturn", symbol: "♒" },
  12: { en: "Pisces", bn: "মীন", lord: "Jupiter", symbol: "♓" },
};

export const NORTH_INDIAN_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 250, y: 125 },
  2: { x: 125, y: 55 },
  3: { x: 55, y: 125 },
  4: { x: 125, y: 250 },
  5: { x: 55, y: 375 },
  6: { x: 125, y: 445 },
  7: { x: 250, y: 375 },
  8: { x: 375, y: 445 },
  9: { x: 445, y: 375 },
  10: { x: 375, y: 250 },
  11: { x: 445, y: 125 },
  12: { x: 375, y: 55 },
};

export const NORTH_INDIAN_POLYGONS: Record<number, string> = {
  1: "250,0 375,125 250,250 125,125",
  2: "0,0 250,0 125,125",
  3: "0,0 125,125 0,250",
  4: "0,250 125,125 250,250 125,375",
  5: "0,250 125,375 0,500",
  6: "0,500 125,375 250,500",
  7: "250,250 375,375 250,500 125,375",
  8: "250,500 375,375 500,500",
  9: "375,375 500,250 500,500",
  10: "375,125 500,250 375,375 250,250",
  11: "500,0 500,250 375,125",
  12: "250,0 500,0 375,125",
};

// South Indian 4x4 Grid layout (fixed signs clockwise)
const SOUTH_GRID_COORDS: Record<number, { col: number; row: number }> = {
  12: { col: 0, row: 0 },
  1: { col: 1, row: 0 },
  2: { col: 2, row: 0 },
  3: { col: 3, row: 0 },
  4: { col: 3, row: 1 },
  5: { col: 3, row: 2 },
  6: { col: 3, row: 3 },
  7: { col: 2, row: 3 },
  8: { col: 1, row: 3 },
  9: { col: 0, row: 3 },
  10: { col: 0, row: 2 },
  11: { col: 0, row: 1 },
};

// ------------------------------------------------------------- Component Props

interface CosmicWhiteboardProps {
  callId: string;
  peerUserId?: string;
  role?: "astrologer" | "seeker";
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

export function CosmicWhiteboard({
  callId,
  peerUserId,
  role = "seeker",
  isOpen,
  onClose,
  className,
  theme: propTheme,
  onToggleTheme,
}: CosmicWhiteboardProps) {
  // Theme State (Supports Ultra Pro Light & Dark)
  const [internalTheme, setInternalTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("astra_whiteboard_theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "light";
  });
  const currentTheme = propTheme || internalTheme;
  const isDark = currentTheme === "dark";

  const handleToggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      const next = isDark ? "light" : "dark";
      setInternalTheme(next);
      if (typeof window !== "undefined") {
        localStorage.setItem("astra_whiteboard_theme", next);
      }
    }
  };

  // Whiteboard State
  const [data, setData] = React.useState<WhiteboardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [showTransit, setShowTransit] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"d1" | "d9" | "transit" | "freehand">("d1");
  const [chartStyle, setChartStyle] = React.useState<"north" | "south">("north");
  const [activeDrishti, setActiveDrishti] = React.useState<WhiteboardDrishti | null>(null);
  const [hoveredHouse, setHoveredHouse] = React.useState<number | null>(null);
  const [selectedHouse, setSelectedHouse] = React.useState<number | null>(null);
  const [laserPoint, setLaserPoint] = React.useState<{ x: number; y: number } | null>(null);

  // Canvas Ref
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // 1. Initial Load
  const fetchWhiteboard = React.useCallback(async () => {
    try {
      const wb = await whiteboardApi.get(callId);
      setData(wb);
      setActiveTab(wb.active_tab || "d1");
      setChartStyle((wb.chart_style as any) === "south" ? "south" : "north");
      if (wb.drishti) setActiveDrishti(wb.drishti);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load cosmic whiteboard");
    } finally {
      setLoading(false);
    }
  }, [callId]);

  React.useEffect(() => {
    if (isOpen) {
      void fetchWhiteboard();
    }
  }, [isOpen, fetchWhiteboard]);

  // 2. Realtime WebSocket Listener (Syncs strokes, aspects, tabs from Astrologer)
  useWhiteboardEvents(
    React.useCallback(
      (event) => {
        if (!isOpen) return;

        if (event.type === "whiteboard_event") {
          const payload = event.data;
          if (payload.call_id && payload.call_id !== callId) return;

          setData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              version: payload.version ?? prev.version,
              strokes: payload.strokes ?? prev.strokes,
              drishti: payload.drishti !== undefined ? payload.drishti : prev.drishti,
              highlighted_houses: payload.highlighted_houses ?? prev.highlighted_houses,
              active_tab: payload.active_tab ?? prev.active_tab,
              is_open: payload.is_open ?? prev.is_open,
            };
          });

          if (payload.active_tab) setActiveTab(payload.active_tab);
          if (payload.drishti !== undefined) setActiveDrishti(payload.drishti);
        } else if (event.type === "whiteboard_live") {
          const frame = event.data;
          if (frame.call_id && frame.call_id !== callId) return;

          if (frame.laser) {
            setLaserPoint(frame.laser);
          } else if (frame.live_stroke) {
            // Draw temporary live stroke segment on canvas
            const ctx = canvasRef.current?.getContext("2d");
            if (ctx && frame.live_stroke.points?.length > 1) {
              const pts = frame.live_stroke.points;
              ctx.save();
              ctx.strokeStyle = frame.live_stroke.color;
              ctx.lineWidth = frame.live_stroke.width;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              if (frame.live_stroke.tool === "highlighter") {
                ctx.globalAlpha = 0.45;
                ctx.lineWidth = 14;
              }
              ctx.beginPath();
              ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
              ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      },
      [isOpen, callId],
    ),
  );

  // 3. Redraw Canvas Strokes
  const redrawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = data?.strokes || [];
    for (const s of strokes) {
      if (s.tool === "stamp" && s.points.length > 0) {
        ctx.save();
        ctx.font = "28px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.stamp_icon || "🕉️", s.points[0].x, s.points[0].y);
        ctx.restore();
        continue;
      }

      if (s.points.length < 2) continue;

      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (s.tool === "highlighter") {
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = Math.max(s.width, 14);
      }

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }, [data?.strokes]);

  React.useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Laser Pointer Decay Timer
  React.useEffect(() => {
    if (!laserPoint) return;
    const t = setTimeout(() => setLaserPoint(null), 1200);
    return () => clearTimeout(t);
  }, [laserPoint]);

  // House Click (for inspecting meanings)
  const handleHouseClick = (houseNum: number) => {
    setSelectedHouse((prev) => (prev === houseNum ? null : houseNum));
  };

  // 4. Download High-Res Marked Kundali Snapshot for Keepsake
  const handleDownloadSnapshot = async () => {
    try {
      const svg = document.getElementById(`cosmic-chart-svg-${callId}`);
      const canvas = canvasRef.current;
      if (!svg || !canvas) {
        toast.error("Could not capture chart");
        return;
      }

      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = 1000;
      exportCanvas.height = 1100;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) return;

      const clientName = data?.client_name || "Seeker";
      const dateStr = new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const ascSign = data?.asc_sign_num ? RASHI_NAMES[data.asc_sign_num] : null;

      if (isDark) {
        // Dark Cosmic Starry Background
        const bgGrad = ctx.createLinearGradient(0, 0, 1000, 1100);
        bgGrad.addColorStop(0, "#090d16");
        bgGrad.addColorStop(0.5, "#0b1329");
        bgGrad.addColorStop(1, "#030712");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1000, 1100);

        // Star particles
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        for (let i = 0; i < 70; i++) {
          const sx = (i * 137.5) % 1000;
          const sy = (i * 223.7) % 1100;
          ctx.fillRect(sx, sy, (i % 3) + 1, (i % 3) + 1);
        }

        // Title & Header Banner
        ctx.fillStyle = "#F59E0B";
        ctx.font = "bold 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ASTRA ASTROLOGY • LIVE COSMIC CONSULTATION", 500, 45);

        ctx.fillStyle = "#E2E8F0";
        ctx.font = "16px sans-serif";
        ctx.fillText(
          `Consultation with ${clientName}  |  Date: ${dateStr}  |  Lagna: ${ascSign?.en || "Aries"} (${ascSign?.bn || "মেষ"})`,
          500,
          75,
        );
      } else {
        // Sacred Light Ivory Parchment Keepsake Background
        const bgGrad = ctx.createLinearGradient(0, 0, 1000, 1100);
        bgGrad.addColorStop(0, "#fffdf6");
        bgGrad.addColorStop(0.5, "#faf3e1");
        bgGrad.addColorStop(1, "#f2e6cb");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1000, 1100);

        // Gold decorative outer border
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 3;
        ctx.strokeRect(18, 18, 964, 1064);

        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 1;
        ctx.strokeRect(24, 24, 952, 1052);

        // Title & Header Banner
        ctx.fillStyle = "#9a3412";
        ctx.font = "bold 26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("ASTRA ASTROLOGY • SACRED KUNDALI CONSULTATION", 500, 48);

        ctx.fillStyle = "#78350f";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(
          `Consultation with ${clientName}  |  Date: ${dateStr}  |  Lagna: ${ascSign?.en || "Aries"} (${ascSign?.bn || "মেষ"})`,
          500,
          78,
        );
      }

      // Render SVG Chart onto offscreen image
      const svgXml = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 50, 95, 900, 900);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        img.onerror = reject;
        img.src = svgUrl;
      });

      // Overlay the markings canvas
      ctx.drawImage(canvas, 50, 95, 900, 900);

      // Watermark footer
      ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.7)" : "rgba(120, 53, 15, 0.75)";
      ctx.font = "14px sans-serif";
      ctx.fillText(
        "Astra Astrology Authentic Vedic Analysis • Live Chamber Sacred Whiteboard",
        500,
        1040,
      );

      // Trigger download
      const pngUrl = exportCanvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `Astra-Cosmic-Chart-${(data?.client_name || "Seeker").replace(/\s+/g, "_")}-${Date.now()}.png`;
      a.click();
      toast.success("Cosmic chart keepsake downloaded!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to download chart");
    }
  };

  if (!isOpen) return null;

  const ascSignNum = data?.asc_sign_num || 1;
  const planetsList = (data?.planets || []).map((p) => {
    const house = activeTab === "d9" ? p.d9_house_num || p.house_num : p.house_num;
    const sign = activeTab === "d9" ? p.d9_sign_num || p.sign_num : p.sign_num;
    return { ...p, house_num: house, sign_num: sign };
  });

  const transitPlanetsList = data?.transit_planets || [];

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl transition-all duration-300 z-30 overflow-hidden backdrop-blur-2xl shadow-2xl",
        isDark
          ? "border border-amber-500/30 bg-[#090e1c]/95 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-amber-500/20"
          : "border border-[#e2d5a3] bg-[#fffdfa]/98 text-[#1a1208] shadow-[0_25px_60px_-12px_rgba(180,130,40,0.25)] ring-1 ring-[#f5e6b5]",
        fullscreen
          ? "fixed inset-2 md:inset-6 z-50 h-[calc(100vh-3rem)]"
          : "absolute inset-x-2 bottom-2 top-16 md:inset-auto md:right-4 md:top-16 md:w-[580px] md:h-[calc(100vh-6rem)]",
        className,
      )}
    >
      {/* ---------------- Header Toolbar ---------------- */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 border-b px-3.5 py-2.5 transition-colors",
          isDark
            ? "border-white/10 bg-gradient-to-r from-[#0d1424] to-[#080d1a]"
            : "border-[#e5d7a6] bg-gradient-to-r from-[#fff9eb] via-[#fdf5df] to-[#f9eed0]",
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg transition-colors",
              isDark
                ? "bg-amber-500/20 text-amber-400"
                : "bg-amber-100 text-amber-700 border border-amber-300/60 shadow-2xs",
            )}
          >
            <Sparkles className="size-4 animate-spin-slow" />
          </div>
          <div>
            <h3
              className={cn(
                "text-xs font-bold tracking-wide flex items-center gap-1.5",
                isDark ? "text-amber-300" : "text-[#78350f] font-black",
              )}
            >
              Astrologer&apos;s Whiteboard (কসমিক হোয়াইটবোর্ড)
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                  isDark
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300/80 shadow-2xs",
                )}
              >
                Live Sync
              </span>
            </h3>
            <p className={cn("text-[10px]", isDark ? "text-white/60" : "text-[#8c6d32] font-medium")}>
              Lagna: {RASHI_NAMES[ascSignNum]?.bn} ({RASHI_NAMES[ascSignNum]?.en} {ascSignNum})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold transition-all border",
              isDark
                ? "border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                : "border-[#ded09b] bg-white text-[#78350f] hover:bg-[#fff7d6] shadow-2xs",
            )}
            title={isDark ? "Switch to Sacred Light Mode" : "Switch to Celestial Dark Mode"}
          >
            {isDark ? (
              <>
                <Sun className="size-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="size-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownloadSnapshot}
            className={cn(
              "h-7 px-2 text-[10px] font-semibold border transition-colors",
              isDark
                ? "border-white/10 text-white hover:bg-white/10"
                : "border-[#ded09b] text-[#5c4a22] hover:bg-[#faeed1] hover:text-[#1a1208] bg-white/90 shadow-2xs font-bold",
            )}
            title="Download high-resolution marked cosmic chart keepsake"
          >
            <Download className="size-3 mr-1 text-amber-500" />
            Download
          </Button>

          <button
            onClick={() => setFullscreen((v) => !v)}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              isDark
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-[#766545] hover:bg-[#faeed1] hover:text-[#1a1208]",
            )}
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>

          <button
            onClick={onClose}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              isDark
                ? "text-white/70 hover:bg-rose-500/20 hover:text-rose-300"
                : "text-[#766545] hover:bg-rose-100 hover:text-rose-700",
            )}
            title="Close Whiteboard"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* ---------------- Subheader Tabs & Quick Toggles ---------------- */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 border-b px-3 py-1.5 text-xs transition-colors",
          isDark
            ? "border-white/10 bg-night-950/80"
            : "border-[#e5d7a6] bg-[#fbf5e4]/90",
        )}
      >
        <div
          className={cn(
            "flex items-center rounded-xl p-0.5 border transition-colors",
            isDark
              ? "bg-black/50 border-white/10"
              : "bg-[#f2e7c6]/75 border-[#dfd29f]",
          )}
        >
          {(
            [
              { id: "d1", label: "D1 Lagna (জন্ম)" },
              { id: "d9", label: "D9 Navamsha (নবাংশ)" },
              { id: "freehand", label: "Freehand (ক্যানভাস)" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
                activeTab === t.id
                  ? isDark
                    ? "bg-amber-500 text-slate-950 font-black shadow-sm"
                    : "bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-extrabold shadow-sm"
                  : isDark
                    ? "text-white/70 hover:text-white"
                    : "text-[#766545] hover:text-[#1a1208] font-bold",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowTransit((v) => !v)}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-bold transition-colors",
              showTransit
                ? isDark
                  ? "border-emerald-400 bg-emerald-950/60 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "border-emerald-600 bg-emerald-100/90 text-emerald-900 shadow-2xs font-bold ring-1 ring-emerald-400/50"
                : isDark
                  ? "border-white/10 bg-white/5 text-white/60 hover:text-white"
                  : "border-[#ded09b] bg-white/90 text-[#766545] hover:text-[#1a1208] font-semibold",
            )}
            title="Toggle current real-time planetary transits (গোচর)"
          >
            <Eye className="size-3" />
            Gochar (গোচর)
          </button>

          <button
            onClick={() => setChartStyle((s) => (s === "north" ? "south" : "north"))}
            className={cn(
              "flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] transition-colors",
              isDark
                ? "border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
                : "border-[#ded09b] bg-white/90 text-[#766545] hover:bg-[#fff9e6] font-semibold shadow-2xs",
            )}
            title="Toggle North Diamond vs South Grid chart style"
          >
            <Compass className="size-3 text-amber-500" />
            {chartStyle === "north" ? "North (ডায়মন্ড)" : "South (গ্রিড)"}
          </button>
        </div>
      </div>

      {/* Active Drishti Explanation Banner (Controlled by Astrologer) */}
      {activeDrishti && (
        <div
          className={cn(
            "flex items-center justify-between px-3 py-1 text-[11px] font-medium border-b transition-colors",
            activeDrishti.nature === "auspicious"
              ? isDark
                ? "bg-emerald-950/60 text-emerald-200 border-emerald-500/30"
                : "bg-emerald-50 text-emerald-950 border-emerald-300 font-bold shadow-2xs"
              : activeDrishti.nature === "challenging"
                ? isDark
                  ? "bg-rose-950/60 text-rose-200 border-rose-500/30"
                  : "bg-rose-50 text-rose-950 border-rose-300 font-bold shadow-2xs"
                : isDark
                  ? "bg-sky-950/60 text-sky-200 border-sky-500/30"
                  : "bg-sky-50 text-sky-950 border-sky-300 font-bold shadow-2xs",
          )}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 shrink-0" />
            <span>
              {activeDrishti.label_bn} — House {activeDrishti.from_house} → Aspects:{" "}
              {activeDrishti.aspects_houses.map((h) => `${h}th`).join(", ")}
            </span>
          </div>
          <span className="text-[10px] opacity-80 font-mono font-bold">
            {activeDrishti.nature.toUpperCase()}
          </span>
        </div>
      )}

      {/* ---------------- Main Chart + Live Canvas ---------------- */}
      <div
        className={cn(
          "relative flex-1 overflow-auto flex items-center justify-center p-2 select-none transition-colors",
          isDark
            ? "bg-gradient-to-b from-[#080d1a] via-[#091024] to-[#040711]"
            : "bg-gradient-to-b from-[#fffef8] via-[#faf4e5] to-[#f4ebd6]",
        )}
      >
        {loading ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-2 text-xs font-semibold animate-pulse",
              isDark ? "text-amber-300" : "text-[#9a3412]",
            )}
          >
            <Sparkles className="size-6 animate-spin-slow" />
            Connecting to Astrologer&apos;s Cosmic Whiteboard...
          </div>
        ) : (
          <div className="relative aspect-square w-full max-w-[500px]">
            {/* North Indian Diamond Chart SVG */}
            {chartStyle === "north" ? (
              <svg
                id={`cosmic-chart-svg-${callId}`}
                viewBox="0 0 500 500"
                className="size-full overflow-visible drop-shadow-md"
              >
                <defs>
                  <marker
                    id="drishti-arrow-auspicious"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
                  </marker>
                  <marker
                    id="drishti-arrow-challenging"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
                  </marker>
                  <marker
                    id="drishti-arrow-neutral"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8" />
                  </marker>
                </defs>

                <rect
                  width="500"
                  height="500"
                  fill={isDark ? "#080d1a" : "#fffef9"}
                  stroke={isDark ? "#d97706" : "#b45309"}
                  strokeWidth="2.5"
                />

                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
                  const pts = NORTH_INDIAN_POLYGONS[houseNum];
                  const signNum = ((ascSignNum - 1 + houseNum - 1) % 12) + 1;
                  const center = NORTH_INDIAN_CENTERS[houseNum];
                  const isHighlighted = (data?.highlighted_houses || []).includes(houseNum);
                  const isDrishtiTarget = activeDrishti?.aspects_houses.includes(houseNum);
                  const isDrishtiSource = activeDrishti?.from_house === houseNum;
                  const isHouseHovered = hoveredHouse === houseNum || selectedHouse === houseNum;

                  const natalInHouse = planetsList.filter((p) => p.house_num === houseNum);
                  const transitInHouse = showTransit
                    ? transitPlanetsList.filter((p) => {
                        const trHouse = ((p.sign_num - ascSignNum + 12) % 12) + 1;
                        return trHouse === houseNum;
                      })
                    : [];

                  return (
                    <g
                      key={houseNum}
                      onClick={() => handleHouseClick(houseNum)}
                      onMouseEnter={() => setHoveredHouse(houseNum)}
                      onMouseLeave={() => setHoveredHouse(null)}
                      className="cursor-pointer transition-colors"
                    >
                      <polygon
                        points={pts}
                        fill={
                          isDrishtiSource
                            ? isDark
                              ? "#78350f"
                              : "#fed7aa"
                            : isDrishtiTarget
                              ? isDark
                                ? "rgba(16, 185, 129, 0.22)"
                                : "rgba(16, 185, 129, 0.2)"
                              : isHighlighted
                                ? isDark
                                  ? "rgba(245, 158, 11, 0.25)"
                                  : "rgba(245, 158, 11, 0.22)"
                                : isHouseHovered
                                  ? isDark
                                    ? "#1e293b"
                                    : "#faeed4"
                                  : isDark
                                    ? "#0b1329"
                                    : houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10
                                      ? "#fdfbf4"
                                      : "#fbf6e9"
                        }
                        stroke={
                          isDrishtiTarget
                            ? isDark
                              ? "#10B981"
                              : "#059669"
                            : isDrishtiSource
                              ? isDark
                                ? "#F59E0B"
                                : "#c2410c"
                              : isHighlighted
                                ? isDark
                                  ? "#FBBF24"
                                  : "#d97706"
                                : "#b45309"
                        }
                        strokeWidth={isDrishtiTarget || isHighlighted ? "2.5" : "1.3"}
                      />

                      <text
                        x={
                          houseNum === 1
                            ? center.x
                            : houseNum === 2
                              ? center.x - 20
                              : houseNum === 4
                                ? center.x - 30
                                : houseNum === 7
                                  ? center.x
                                  : houseNum === 10
                                    ? center.x + 30
                                    : center.x
                        }
                        y={
                          houseNum === 1
                            ? center.y - 35
                            : houseNum === 7
                              ? center.y + 40
                              : center.y - 18
                        }
                        fill={isDark ? "#fbbf24" : "#9a3412"}
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="select-none opacity-90"
                      >
                        {signNum}
                      </text>

                      <text
                        x={center.x}
                        y={center.y - 5}
                        fill={isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(120, 53, 15, 0.65)"}
                        fontSize="9"
                        textAnchor="middle"
                        className="select-none font-semibold"
                      >
                        {HOUSE_INFO[houseNum]?.name_bn?.split(" ")[0]} ({houseNum})
                      </text>

                      <g transform={`translate(${center.x}, ${center.y + 10})`}>
                        {natalInHouse.map((p, idx) => {
                          const yOffset = idx * 13;
                          return (
                            <text
                              key={p.name}
                              x="0"
                              y={yOffset}
                              fill={
                                p.is_retrograde
                                  ? isDark
                                    ? "#f87171"
                                    : "#dc2626"
                                  : isDark
                                    ? "#fef08a"
                                    : "#1c1917"
                              }
                              fontSize="11"
                              fontWeight={isDark ? "600" : "700"}
                              textAnchor="middle"
                              className="select-none"
                            >
                              {p.symbol || p.code || p.name.slice(0, 2)}
                              {p.is_retrograde ? " (R)" : ""}
                              {p.degree !== undefined ? ` ${Math.round(p.degree)}°` : ""}
                            </text>
                          );
                        })}
                      </g>

                      {transitInHouse.length > 0 && (
                        <g transform={`translate(${center.x}, ${center.y + 25 + natalInHouse.length * 10})`}>
                          {transitInHouse.map((tp, idx) => (
                            <text
                              key={tp.name}
                              x="0"
                              y={idx * 11}
                              fill={isDark ? "#34d399" : "#047857"}
                              fontSize="9.5"
                              fontWeight="bold"
                              textAnchor="middle"
                              className="select-none"
                            >
                              [TR] {tp.code || tp.name.slice(0, 2)}
                            </text>
                          ))}
                        </g>
                      )}
                    </g>
                  );
                })}

                <polygon
                  points="250,0 500,250 250,500 0,250"
                  fill="none"
                  stroke={isDark ? "#d97706" : "#b45309"}
                  strokeWidth="2"
                />

                <line x1="0" y1="0" x2="500" y2="500" stroke={isDark ? "#b45309" : "#d97706"} strokeWidth="1.5" />
                <line x1="500" y1="0" x2="0" y2="500" stroke={isDark ? "#b45309" : "#d97706"} strokeWidth="1.5" />

                {activeDrishti &&
                  activeDrishti.aspects_houses.map((targetHouse) => {
                    const fromC = NORTH_INDIAN_CENTERS[activeDrishti.from_house];
                    const toC = NORTH_INDIAN_CENTERS[targetHouse];
                    const markerId =
                      activeDrishti.nature === "auspicious"
                        ? "drishti-arrow-auspicious"
                        : activeDrishti.nature === "challenging"
                          ? "drishti-arrow-challenging"
                          : "drishti-arrow-neutral";
                    const strokeColor =
                      activeDrishti.nature === "auspicious"
                        ? "#10B981"
                        : activeDrishti.nature === "challenging"
                          ? "#EF4444"
                          : "#38BDF8";

                    const midX = (fromC.x + toC.x) / 2;
                    const midY = (fromC.y + toC.y) / 2;
                    const dx = toC.x - fromC.x;
                    const dy = toC.y - fromC.y;
                    const ctrlX = midX - dy * 0.15;
                    const ctrlY = midY + dx * 0.15;

                    return (
                      <g key={targetHouse}>
                        <path
                          d={`M ${fromC.x} ${fromC.y} Q ${ctrlX} ${ctrlY} ${toC.x} ${toC.y}`}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="2.5"
                          strokeDasharray="6,4"
                          markerEnd={`url(#${markerId})`}
                          className="animate-pulse"
                        />
                      </g>
                    );
                  })}
              </svg>
            ) : (
              /* South Indian 4x4 Grid SVG */
              <svg
                id={`cosmic-chart-svg-${callId}`}
                viewBox="0 0 500 500"
                className="size-full overflow-visible drop-shadow-md"
              >
                <rect
                  width="500"
                  height="500"
                  fill={isDark ? "#080d1a" : "#fffef9"}
                  stroke={isDark ? "#d97706" : "#b45309"}
                  strokeWidth="2.5"
                />
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((signNum) => {
                  const coord = SOUTH_GRID_COORDS[signNum];
                  const x = coord.col * 125;
                  const y = coord.row * 125;
                  const houseNum = ((signNum - ascSignNum + 12) % 12) + 1;
                  const isLagna = houseNum === 1;
                  const isDrishtiTarget = activeDrishti?.aspects_houses.includes(houseNum);
                  const isDrishtiSource = activeDrishti?.from_house === houseNum;
                  const natalInHouse = planetsList.filter((p) => p.house_num === houseNum);

                  return (
                    <g
                      key={signNum}
                      onClick={() => handleHouseClick(houseNum)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={x}
                        y={y}
                        width="125"
                        height="125"
                        fill={
                          isDrishtiSource
                            ? isDark
                              ? "#78350f"
                              : "#fed7aa"
                            : isDrishtiTarget
                              ? isDark
                                ? "rgba(16, 185, 129, 0.22)"
                                : "rgba(16, 185, 129, 0.2)"
                              : isLagna
                                ? isDark
                                  ? "rgba(245, 158, 11, 0.2)"
                                  : "rgba(245, 158, 11, 0.18)"
                                : isDark
                                  ? "#0b1329"
                                  : "#fbf6e9"
                        }
                        stroke="#b45309"
                        strokeWidth="1.2"
                      />
                      <text
                        x={x + 8}
                        y={y + 16}
                        fill={isDark ? "#fbbf24" : "#9a3412"}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {RASHI_NAMES[signNum]?.bn} ({signNum})
                      </text>
                      {isLagna && (
                        <text
                          x={x + 115}
                          y={y + 16}
                          fill={isDark ? "#f59e0b" : "#b45309"}
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          [LAGNA]
                        </text>
                      )}
                      <g transform={`translate(${x + 62}, ${y + 40})`}>
                        {natalInHouse.map((p, idx) => (
                          <text
                            key={p.name}
                            x="0"
                            y={idx * 14}
                            fill={isDark ? "#fef08a" : "#1c1917"}
                            fontSize="10"
                            fontWeight={isDark ? "600" : "700"}
                            textAnchor="middle"
                          >
                            {p.symbol || p.name}
                          </text>
                        ))}
                      </g>
                    </g>
                  );
                })}
                <rect
                  x="125"
                  y="125"
                  width="250"
                  height="250"
                  fill={isDark ? "#030712" : "#fefce8"}
                  stroke={isDark ? "#d97706" : "#b45309"}
                />
                <text
                  x="250"
                  y="235"
                  fill={isDark ? "#f59e0b" : "#b45309"}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  ASTRA ASTROLOGY
                </text>
                <text
                  x="250"
                  y="260"
                  fill={isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(120, 53, 15, 0.75)"}
                  fontSize="11"
                  fontWeight="medium"
                  textAnchor="middle"
                >
                  South Indian Grid View
                </text>
              </svg>
            )}

            {/* Collaborative HTML5 Canvas Overlay */}
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="absolute inset-0 size-full touch-none z-10 pointer-events-none cursor-default"
            />

            {/* Live Laser Pointer Marker from Astrologer */}
            {laserPoint && (
              <div
                className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 shadow-[0_0_12px_#ef4444] animate-ping"
                style={{
                  left: `${(laserPoint.x / 500) * 100}%`,
                  top: `${(laserPoint.y / 500) * 100}%`,
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* ---------------- House Inspector Footnote ---------------- */}
      {(hoveredHouse || selectedHouse) && (
        <div
          className={cn(
            "border-t px-3 py-2 text-xs transition-colors",
            isDark
              ? "border-white/10 bg-night-950/95 text-white"
              : "border-[#e2d5a3] bg-gradient-to-r from-[#fff9ea] to-[#fbf4de] text-[#1a1208] shadow-xs",
          )}
        >
          {(() => {
            const h = hoveredHouse || selectedHouse || 1;
            const info = HOUSE_INFO[h];
            const sign = ((ascSignNum - 1 + h - 1) % 12) + 1;
            const inHouse = planetsList.filter((p) => p.house_num === h);

            return (
              <div className="flex flex-col gap-1">
                <div
                  className={cn(
                    "flex items-center justify-between font-bold",
                    isDark ? "text-amber-300" : "text-[#854d0e] font-black",
                  )}
                >
                  <span>
                    {info.name_bn} ({info.name_en}) • Sign: {RASHI_NAMES[sign]?.bn} ({RASHI_NAMES[sign]?.en})
                  </span>
                  <span
                    className={cn(
                      "text-[10px]",
                      isDark ? "text-white/60" : "text-[#78350f]/80 font-bold",
                    )}
                  >
                    Karaka: {info.karaka}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-[11px] leading-relaxed",
                    isDark ? "text-white/80" : "text-[#57482f] font-medium",
                  )}
                >
                  {info.significations_bn}
                </p>
                {inHouse.length > 0 && (
                  <p
                    className={cn(
                      "text-[10px] font-semibold",
                      isDark ? "text-emerald-300" : "text-[#065f46] font-bold",
                    )}
                  >
                    Planets in House:{" "}
                    {inHouse
                      .map((p) => `${p.name}${p.is_retrograde ? " (R)" : ""} ${p.degree ? `${Math.round(p.degree)}°` : ""}`)
                      .join(", ")}
                  </p>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}

