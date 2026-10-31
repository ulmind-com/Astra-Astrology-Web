"use client";

import * as React from "react";
import Image from "next/image";
import {
  Compass,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Layers,
  Shield,
  HelpCircle,
  Sliders,
  Check,
  FlipHorizontal,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Camera,
  Crosshair,
  MapPin,
  Video,
  Eye,
  ArrowRight,
  ArrowLeft,
  Search,
  X,
  Info,
  ChevronRight,
  ChevronDown,
  Calendar,
  Zap,
} from "lucide-react";

import { toast } from "sonner";
import { Button } from "@/components/ui";
import type { AstrologyLanguage } from "@/types";
import {
  VASTU_PADAS,
  VASTU_CATEGORIES,
  DIR16_ORDER,
  DIR16_FULL,
  DIR16_FULL_BN,
  ZONE_COLORS,
  ENTRANCE_RATINGS,
  type VastuPada,
  type VastuCategory,
  padaIndexForDegree,
  direction16,
  dirCenter,
  signedDelta,
  bestGuidance,
  activePada,
} from "@/lib/vastu/compass-data";
import { lifeDimension, type LifeDimension } from "@/lib/vastu/life-dimensions-data";
import { entranceEntry, type PadaEntry, type PadaBlock } from "@/lib/vastu/entrance-padas-data";
import { zoneAnalysis, splitZone, zonePreamble, type ZoneBlock } from "@/lib/vastu/zone-analysis-data";

// ---------------------------------------------------------------------------
// Props Interface
// ---------------------------------------------------------------------------
export interface VastuCompassProps {
  language?: AstrologyLanguage;
  onAngleSelect?: (degree: number) => void;
}

// ---------------------------------------------------------------------------
// Polar & SVG Arc Math (N5 Dial Exact Geometry)
// ---------------------------------------------------------------------------
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}

function sectorPath(cx: number, cy: number, rIn: number, rOut: number, a1: number, a2: number) {
  const p1o = polar(cx, cy, rOut, a1);
  const p2o = polar(cx, cy, rOut, a2);
  const p1i = polar(cx, cy, rIn, a1);
  const p2i = polar(cx, cy, rIn, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${p1i.x} ${p1i.y} L ${p1o.x} ${p1o.y} A ${rOut} ${rOut} 0 ${large} 1 ${p2o.x} ${p2o.y} L ${p2i.x} ${p2i.y} A ${rIn} ${rIn} 0 ${large} 0 ${p1i.x} ${p1i.y} Z`;
}

function arcPath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const p1 = polar(cx, cy, r, a1);
  const p2 = polar(cx, cy, r, a2);
  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${p2.x} ${p2.y}`;
}

export function VastuCompass({ language = "bn", onAngleSelect }: VastuCompassProps) {
  // Current compass heading (0.0° - 359.9°)
  const [heading, setHeading] = React.useState<number>(0.0);
  const [selectedCategorySlug, setSelectedCategorySlug] = React.useState<string>("main-entrance");
  const [activeTab, setActiveTab] = React.useState<"compass" | "analysis" | "nexus">("compass");
  const [analysisSubTab, setAnalysisSubTab] = React.useState<"effects" | "treatment">("effects");
  const [nexusSubTab, setNexusSubTab] = React.useState<"residential" | "commercial" | "remedies">("residential");

  // Interactive controls
  const [isSensorActive, setIsSensorActive] = React.useState<boolean>(false);
  const [isFlipped180, setIsFlipped180] = React.useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = React.useState<boolean>(false);
  const [categorySearch, setCategorySearch] = React.useState<string>("");
  const [isCameraActive, setIsCameraActive] = React.useState<boolean>(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);

  // SVG Refs & drag tracking
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const isDragging = React.useRef<boolean>(false);

  // Stop camera on unmount
  React.useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Effective heading after 180° flip
  const effectiveHeading = React.useMemo(() => {
    let h = isFlipped180 ? (heading + 180) % 360 : heading;
    return (h + 360) % 360;
  }, [heading, isFlipped180]);

  // Notify parent of angle selection
  React.useEffect(() => {
    onAngleSelect?.(Math.round(effectiveHeading * 10) / 10);
  }, [effectiveHeading, onAngleSelect]);

  // Active Category
  const activeCategory = React.useMemo<VastuCategory>(() => {
    return (
      VASTU_CATEGORIES.find((c) => c.slug === selectedCategorySlug) ||
      VASTU_CATEGORIES[0]
    );
  }, [selectedCategorySlug]);

  // Derived Vastu properties
  const deg = Math.round(effectiveHeading);
  const dir16 = React.useMemo(() => direction16(effectiveHeading), [effectiveHeading]);
  const pada = React.useMemo(() => activePada(effectiveHeading, VASTU_PADAS), [effectiveHeading]);
  const isBestDirection = React.useMemo(
    () => activeCategory.best_directions.includes(dir16),
    [activeCategory, dir16]
  );
  const isAvoidDirection = React.useMemo(
    () => activeCategory.avoid_directions.includes(dir16),
    [activeCategory, dir16]
  );
  const guide = React.useMemo(
    () => bestGuidance(effectiveHeading, activeCategory.best_directions),
    [effectiveHeading, activeCategory]
  );
  const dimension = React.useMemo(() => lifeDimension(dir16), [dir16]);

  // Category Zone Document (7,000-line dataset)
  const zoneDoc = React.useMemo(() => {
    return zoneAnalysis(activeCategory.slug, dir16, language === "bn" ? "bn" : "en");
  }, [activeCategory.slug, dir16, language]);

  const zonePreambleBlocks = React.useMemo(() => {
    return zonePreamble(activeCategory.slug, language === "bn" ? "bn" : "en");
  }, [activeCategory.slug, language]);

  const zoneDocSplit = React.useMemo(() => {
    return splitZone(zoneDoc);
  }, [zoneDoc]);

  // Entrance 32 Padas Research Documents
  const residentialEntry = React.useMemo(() => entranceEntry("residential", pada.code), [pada.code]);
  const commercialEntry = React.useMemo(() => entranceEntry("commercial", pada.code), [pada.code]);
  const remedyEntry = React.useMemo(() => entranceEntry("remedies", pada.code), [pada.code]);

  // ---------------------------------------------------------------------------
  // Touch & Mouse Drag to Rotate Compass
  // ---------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateAngleFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateAngleFromEvent(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const updateAngleFromEvent = (e: React.PointerEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = e.clientX - cx;
    const y = e.clientY - cy;

    // Angle clockwise from 12 o'clock (0° North)
    let angleRad = Math.atan2(x, -y);
    let angleDeg = (angleRad * 180) / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    setHeading(Math.round(angleDeg));
  };

  // Fine-tuning adjustment buttons
  const adjustHeading = (delta: number) => {
    setHeading((prev) => ((prev + delta) % 360 + 360) % 360);
  };

  // ---------------------------------------------------------------------------
  // Device Compass Sensor (Mobile Web Orientation API)
  // ---------------------------------------------------------------------------
  const requestSensorPermission = async () => {
    if (isSensorActive) {
      setIsSensorActive(false);
      window.removeEventListener("deviceorientation", handleOrientation);
      toast.info(language === "bn" ? "সেন্সর নিষ্ক্রিয় করা হয়েছে।" : "Sensor deactivated.");
      return;
    }

    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === "function"
    ) {
      try {
        const perm = await (DeviceOrientationEvent as any).requestPermission();
        if (perm === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
          setIsSensorActive(true);
          toast.success(language === "bn" ? "কম্পাস সেন্সর সক্রিয়!" : "Compass sensor active!");
        } else {
          toast.error(language === "bn" ? "সেন্সর অনুমতি প্রত্যাখ্যাত।" : "Sensor permission denied.");
        }
      } catch (err) {
        toast.error(language === "bn" ? "সেন্সর সংযোগ ব্যর্থ।" : "Failed to connect sensor.");
      }
    } else if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
      setIsSensorActive(true);
      toast.success(language === "bn" ? "ডিজিটাল কম্পাস সেন্সর সক্রিয়!" : "Digital compass active!");
    } else {
      toast.error(
        language === "bn"
          ? "আপনার ডিভাইসে ম্যাগনেটিক সেন্সর পাওয়া যায়নি।"
          : "Magnetic sensor not supported."
      );
    }
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    let compassHeading = 0;
    if ((e as any).webkitCompassHeading) {
      // iOS Safari provides true compass heading directly
      compassHeading = (e as any).webkitCompassHeading;
    } else if (e.alpha !== null) {
      // Android absolute orientation
      compassHeading = 360 - e.alpha;
    }
    setHeading(Math.round(compassHeading));
  };

  React.useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // AR Live Camera Mode
  // ---------------------------------------------------------------------------
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
      if (!isSensorActive) {
        requestSensorPermission();
      }
      toast.success(language === "bn" ? "📷 লাইভ এআর ক্যামেরা চালু হয়েছে!" : "AR Camera activated!");
    } catch (err) {
      setCameraError(
        language === "bn"
          ? "ক্যামেরা অ্যাক্সেস পাওয়া যায়নি। ব্রাউজারের অনুমতি নিশ্চিত করুন।"
          : "Camera access unavailable or denied."
      );
      toast.error(language === "bn" ? "ক্যামেরা চালু করা যায়নি।" : "Failed to open camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // ---------------------------------------------------------------------------
  // Filtered Categories for Picker Modal
  // ---------------------------------------------------------------------------
  const filteredCategories = React.useMemo(() => {
    if (!categorySearch.trim()) return VASTU_CATEGORIES;
    const q = categorySearch.toLowerCase();
    return VASTU_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.name_bn.toLowerCase().includes(q) ||
        c.slug.includes(q)
    );
  }, [categorySearch]);

  const categoriesArchitecture = React.useMemo(
    () => filteredCategories.filter((c) => c.category_group === "architecture"),
    [filteredCategories]
  );
  const categoriesObjects = React.useMemo(
    () => filteredCategories.filter((c) => c.category_group === "objects"),
    [filteredCategories]
  );

  // ---------------------------------------------------------------------------
  // SVG Dimensions & Dial Constants
  // ---------------------------------------------------------------------------
  const dialSize = 400;
  const c = dialSize / 2; // 200
  const rRim = c * 0.995; // 199
  const rDegNum = c * 0.905; // 181
  const rDegIn = c * 0.855; // 171
  const rArc = c * 0.828; // 165.6 (category verdict band)
  const rWindOut = c * 0.802; // 160.4
  const rWindIn = c * 0.638; // 127.6
  const rPadaOut = rWindIn; // 127.6
  const rPadaIn = c * 0.536; // 107.2
  const rFace = rPadaIn; // 107.2

  // 360 protractor ticks
  const ticks = React.useMemo(() => Array.from({ length: 360 }, (_, i) => i), []);

  // 16 wind sectors
  const windSectors = React.useMemo(() => {
    return DIR16_ORDER.map((dir, i) => ({
      dir,
      center: i * 22.5,
      color: ZONE_COLORS[dir] || "#CFE8F5",
    }));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* ---------------------------------------------------------------------
          TOP NAVIGATION TABS (Compass / 16-Zone Analysis / 32 Padas 7D Nexus)
      --------------------------------------------------------------------- */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-muted/60 border border-border/80 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab("compass")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "compass"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Compass className="size-4" />
          <span>
            {language === "bn"
              ? "কম্পাস ও লাইভ পর্যবেক্ষণ"
              : language === "hi"
              ? "कम्पास एवं लाइव प्रेक्षण"
              : "Compass Dial"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("analysis")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "analysis"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Layers className="size-4" />
          <span>
            {language === "bn"
              ? "১৬ জোন বিশ্লেষণ"
              : language === "hi"
              ? "16 ज़ोन विश्लेषण"
              : "16-Zone Deep Dive"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("nexus")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "nexus"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Sparkles className="size-4" />
          <span>
            {language === "bn"
              ? "৩২ পদ ও ৭ডি নেক্সাস"
              : language === "hi"
              ? "32 पद एवं 7D नेक्सस"
              : "32 Padas Nexus"}
          </span>
        </button>
      </div>

      {/* ---------------------------------------------------------------------
          ACTIVE CATEGORY HEADER & QUICK SELECTOR
      --------------------------------------------------------------------- */}
      <div className="card-surface p-4 rounded-2xl border border-border/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-2xl shadow-xs">
            {activeCategory.icon}
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {language === "bn"
                ? "নির্বাচিত বাস্তু উপাদান"
                : language === "hi"
                ? "चयनित वास्तु तत्व"
                : "Selected Vastu Element"}
            </div>
            <div className="text-base font-extrabold text-foreground flex items-center gap-2">
              <span>{language === "bn" ? activeCategory.name_bn : activeCategory.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {activeCategory.category_group === "architecture"
                  ? language === "bn"
                    ? "স্থাপত্য"
                    : language === "hi"
                    ? "कक्ष"
                    : "Room"
                  : language === "bn"
                  ? "উপকরণ"
                  : language === "hi"
                  ? "वस्तु"
                  : "Object"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPickerOpen(true)}
            className="rounded-xl border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/10 gap-1.5"
          >
            <Sliders className="size-3.5" />
            <span>
              {language === "bn"
                ? "৩৮টি ক্যাটাগরি ব্রাউজ করুন"
                : language === "hi"
                ? "38 श्रेणियां देखें"
                : "Change Category (38)"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFlipped180(!isFlipped180)}
            className={`rounded-xl border gap-1.5 text-xs font-bold ${
              isFlipped180
                ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-border text-muted-foreground"
            }`}
            title="180° Flip: Toggle door entrance facing vs room placement facing"
          >
            <FlipHorizontal className="size-3.5" />
            <span>180°</span>
          </Button>
        </div>
      </div>

      {/* ---------------------------------------------------------------------
          CATEGORY PICKER MODAL (Full 38 Categories Grouped into Architecture & Objects)
      --------------------------------------------------------------------- */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
          <div className="bg-background rounded-3xl border border-border shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <Compass className="size-5 text-amber-500" />
                  <span>
                    {language === "bn"
                      ? "৩৮টি বাস্তু উপাদান থেকে নির্বাচন করুন"
                      : "Select Vastu Element (38)"}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {language === "bn"
                    ? "সঠিক দিক নির্ণয়ের জন্য আপনার কাঙ্ক্ষিত ঘর বা আসবাব নির্বাচন করুন"
                    : "Select room or object to visualize exact Vedic best/avoid directional sectors."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="size-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder={
                    language === "bn"
                      ? "ক্যাটাগরি অনুসন্ধান করুন (যেমন: রান্নাঘর, বেডরুম, বোরওয়েল)..."
                      : "Search categories (e.g. Kitchen, Toilet, Borewell)..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Category Groups List */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {/* 1. Architecture Group */}
              {categoriesArchitecture.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Layers className="size-3.5" />
                    <span>
                      {language === "bn"
                        ? `স্থাপত্য ও কক্ষসমূহ (${categoriesArchitecture.length})`
                        : `Architecture & Rooms (${categoriesArchitecture.length})`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {categoriesArchitecture.map((cat) => {
                      const isSelected = cat.slug === selectedCategorySlug;
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => {
                            setSelectedCategorySlug(cat.slug);
                            setIsPickerOpen(false);
                            toast.success(
                              language === "bn"
                                ? `উপাদান পরিবর্তিত: ${cat.name_bn}`
                                : `Selected: ${cat.name}`
                            );
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500 shadow-xs"
                              : "border-border/80 hover:border-amber-500/50 hover:bg-muted/50"
                          }`}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-foreground truncate">
                              {language === "bn" ? cat.name_bn : cat.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {language === "bn" ? cat.name : cat.name_bn}
                            </div>
                          </div>
                          {isSelected && <Check className="size-4 text-amber-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Objects & Utilities Group */}
              {categoriesObjects.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="size-3.5" />
                    <span>
                      {language === "bn"
                        ? `যন্ত্রপাতি ও আসবাবপত্র (${categoriesObjects.length})`
                        : `Objects & Appliances (${categoriesObjects.length})`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {categoriesObjects.map((cat) => {
                      const isSelected = cat.slug === selectedCategorySlug;
                      return (
                        <button
                          key={cat.slug}
                          type="button"
                          onClick={() => {
                            setSelectedCategorySlug(cat.slug);
                            setIsPickerOpen(false);
                            toast.success(
                              language === "bn"
                                ? `উপাদান পরিবর্তিত: ${cat.name_bn}`
                                : `Selected: ${cat.name}`
                            );
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? "bg-amber-500/15 border-amber-500 shadow-xs"
                              : "border-border/80 hover:border-amber-500/50 hover:bg-muted/50"
                          }`}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-foreground truncate">
                              {language === "bn" ? cat.name_bn : cat.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {language === "bn" ? cat.name : cat.name_bn}
                            </div>
                          </div>
                          {isSelected && <Check className="size-4 text-amber-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
          AR LIVE CAMERA VIEW OVERLAY MODAL
      --------------------------------------------------------------------- */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="relative flex-1">
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 bg-gradient-to-b from-black/60 via-transparent to-black/70">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 text-white">
                  <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-extrabold uppercase tracking-wider">
                    {language === "bn" ? "লাইভ এআর ক্যামেরা" : "Live AR View"}
                  </span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={stopCamera}
                  className="rounded-full pointer-events-auto"
                >
                  <X className="size-4 mr-1" />
                  <span>{language === "bn" ? "বন্ধ করুন" : "Close"}</span>
                </Button>
              </div>

              {/* Crosshair target in center */}
              <div className="relative flex items-center justify-center">
                <Crosshair className="size-20 text-amber-400/80 stroke-1 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-amber-400" />
              </div>

              {/* Bottom AR info card */}
              <div className="w-full max-w-sm rounded-2xl bg-black/80 backdrop-blur-md p-4 text-white border border-white/20 text-center space-y-1">
                <div className="text-3xl font-black text-amber-400">{deg}°</div>
                <div className="text-sm font-bold">{dir16} ({pada.code})</div>
                <div
                  className={`text-xs font-bold ${
                    isBestDirection ? "text-emerald-400" : isAvoidDirection ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {isBestDirection
                    ? language === "bn"
                      ? "✓ এই দিকটি এই উপাদানের জন্য সর্বশ্রেষ্ঠ!"
                      : "✓ Ideal Placement!"
                    : isAvoidDirection
                    ? language === "bn"
                      ? "⚠️ এই দিকটি সম্পূর্ণ বর্জনীয়!"
                      : "⚠️ Prohibited Placement!"
                    : language === "bn"
                    ? "মধ্যম / শর্তসাপেক্ষ অবস্থান"
                    : "Neutral / Conditional"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 1: COMPASS WHEEL & LIVE VERDICT
      ===================================================================== */}
      {activeTab === "compass" && (
        <div className="space-y-6">
          {/* 1. Compass Stage */}
          <div className="card-surface p-4 sm:p-6 rounded-3xl border border-border/80 shadow-sm flex flex-col items-center">
            {/* Live Bearing Numerical Readout */}
            <div className="flex items-center justify-between w-full max-w-md mb-3 px-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                  {deg}
                </span>
                <span className="text-2xl font-bold text-amber-500">°</span>
              </div>

              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-foreground">
                  {DIR16_FULL[dir16] ?? dir16}
                </div>
                <div className="text-xs font-bold text-muted-foreground flex items-center justify-end gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold">
                    {pada.code}
                  </span>
                  <span>· {language === "bn" ? pada.deity_bn : pada.name}</span>
                </div>
              </div>
            </div>

            {/* SVG Compass Wheel Container */}
            <div className="relative select-none touch-none flex items-center justify-center py-2">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${dialSize} ${dialSize}`}
                className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] cursor-grab active:cursor-grabbing drop-shadow-md"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >
                <defs>
                  {/* Outer Gold Rim Gradient */}
                  <linearGradient id="rimGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#E8C77A" />
                    <stop offset="50%" stopColor="#C9962B" />
                    <stop offset="100%" stopColor="#A8761A" />
                  </linearGradient>

                  {/* Inner Dial Paper Background */}
                  <radialGradient id="paperGrad" cx="50%" cy="45%" r="70%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#FFFDF5" />
                  </radialGradient>

                  {/* Still Center Face Radial Gradient */}
                  <radialGradient id="faceGrad" cx="50%" cy="40%" r="72%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#F4FAF3" />
                  </radialGradient>
                </defs>

                {/* --- Static Base Rings --- */}
                <circle cx={c} cy={c} r={rRim} fill="url(#rimGrad)" />
                <circle cx={c} cy={c} r={rRim - 3} fill="url(#paperGrad)" />
                <circle
                  cx={c}
                  cy={c}
                  r={rDegIn}
                  fill="none"
                  stroke="#C9962B"
                  strokeWidth={1}
                  strokeOpacity={0.55}
                />

                {/* =========================================================
                    ROTATING DIAL (Rotates by -effectiveHeading)
                ========================================================= */}
                <g transform={`rotate(${-effectiveHeading}, ${c}, ${c})`}>
                  {/* --- 1. Degree Protractor (360 Ticks) --- */}
                  {ticks.map((d) => {
                    const isMajor = d % 10 === 0;
                    const isMed = d % 5 === 0;
                    const tickLen = isMajor ? 13 : isMed ? 8 : 5;
                    const o = polar(c, c, rRim - 5, d);
                    const inn = polar(c, c, rRim - 5 - tickLen, d);
                    return (
                      <line
                        key={`t${d}`}
                        x1={o.x}
                        y1={o.y}
                        x2={inn.x}
                        y2={inn.y}
                        stroke={isMajor ? "#2C1B11" : "#A8761A"}
                        strokeWidth={isMajor ? 1.4 : isMed ? 0.9 : 0.6}
                        strokeOpacity={isMajor ? 0.8 : isMed ? 0.5 : 0.3}
                      />
                    );
                  })}

                  {/* Degree Numbers Every 10° */}
                  {ticks
                    .filter((d) => d % 10 === 0)
                    .map((d) => {
                      const p = polar(c, c, rDegNum, d);
                      const isCardinal = d % 90 === 0;
                      return (
                        <text
                          key={`n${d}`}
                          x={p.x}
                          y={p.y}
                          fill={isCardinal ? "#D5432E" : "#2C1B11"}
                          fontSize={isCardinal ? 12 : 9.5}
                          fontWeight={isCardinal ? "900" : "700"}
                          fillOpacity={isCardinal ? 1 : 0.75}
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${d}, ${p.x}, ${p.y})`}
                        >
                          {d}
                        </text>
                      );
                    })}

                  {/* --- 2. Category Verdict Arc Band (Green Best, Red Avoid) --- */}
                  {windSectors.map((z) => {
                    const isBest = activeCategory.best_directions.includes(z.dir);
                    const isAvoid = activeCategory.avoid_directions.includes(z.dir);
                    if (!isBest && !isAvoid) return null;
                    return (
                      <path
                        key={`arc-${z.dir}`}
                        d={arcPath(c, c, rArc, z.center - 11.25, z.center + 11.25)}
                        stroke={isBest ? "#2E9E5B" : "#D5432E"}
                        strokeWidth={4.5}
                        strokeLinecap="round"
                        fill="none"
                        opacity={0.95}
                      />
                    );
                  })}

                  {/* --- 3. 16 Winds On Authentic Pastel Colors --- */}
                  {windSectors.map((z) => (
                    <path
                      key={`wind-sec-${z.dir}`}
                      d={sectorPath(c, c, rWindIn, rWindOut, z.center - 11.25, z.center + 11.25)}
                      fill={z.color}
                      stroke="#FFFFFF"
                      strokeWidth={0.8}
                    />
                  ))}

                  {/* 16 Wind Text Labels */}
                  {windSectors.map((z) => {
                    const isCardinal = z.dir.length === 1;
                    const pt = polar(c, c, (rWindOut + rWindIn) / 2, z.center);
                    return (
                      <text
                        key={`wind-label-${z.dir}`}
                        x={pt.x}
                        y={pt.y}
                        fill="#2C1B11"
                        fontSize={isCardinal ? 16 : z.dir.length === 2 ? 12 : 10}
                        fontWeight={isCardinal ? "900" : "800"}
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${z.center}, ${pt.x}, ${pt.y})`}
                      >
                        {z.dir}
                      </text>
                    );
                  })}

                  {/* --- 4. 32 Pada Codes Ring with Dividers --- */}
                  <circle
                    cx={c}
                    cy={c}
                    r={(rPadaOut + rPadaIn) / 2}
                    fill="none"
                    stroke="#FFFDF7"
                    strokeWidth={rPadaOut - rPadaIn}
                  />

                  {/* Radial Divider Lines for 32 Padas */}
                  {VASTU_PADAS.map((p) => {
                    const b = p.center_deg - 5.625;
                    const o = polar(c, c, rPadaOut, b);
                    const inn = polar(c, c, rPadaIn, b);
                    return (
                      <line
                        key={`p-div-${p.code}`}
                        x1={o.x}
                        y1={o.y}
                        x2={inn.x}
                        y2={inn.y}
                        stroke="#C9962B"
                        strokeWidth={0.7}
                        strokeOpacity={0.4}
                      />
                    );
                  })}

                  {/* Active Pada Lit Sector Highlight */}
                  {pada && (
                    <>
                      <path
                        d={sectorPath(c, c, rPadaIn, rWindOut, pada.center_deg - 5.625, pada.center_deg + 5.625)}
                        fill="#C9962B"
                        opacity={0.2}
                      />
                      <path
                        d={sectorPath(c, c, rPadaIn, rWindOut, pada.center_deg - 5.625, pada.center_deg + 5.625)}
                        fill="none"
                        stroke="#A8761A"
                        strokeWidth={1.8}
                      />
                    </>
                  )}

                  {/* Pada Code Texts */}
                  {VASTU_PADAS.map((p) => {
                    const isActive = p.code === pada?.code;
                    const pt = polar(c, c, (rPadaOut + rPadaIn) / 2, p.center_deg);
                    return (
                      <text
                        key={`p-txt-${p.code}`}
                        x={pt.x}
                        y={pt.y}
                        fill={isActive ? "#A8761A" : "#2C1B11"}
                        fillOpacity={isActive ? 1 : 0.8}
                        fontSize={isActive ? 11 : 9.5}
                        fontWeight={isActive ? "900" : "700"}
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${p.center_deg}, ${pt.x}, ${pt.y})`}
                      >
                        {p.code}
                      </text>
                    );
                  })}

                  {/* True North Pointer (Red Triangle on rotating dial) */}
                  <polygon
                    points={`${c},${c - rWindOut - 3} ${c - 5},${c - rWindOut + 8} ${c + 5},${c - rWindOut + 8}`}
                    fill="#D5432E"
                  />
                </g>

                {/* =========================================================
                    STILL CENTER FACE (Never rotates!)
                ========================================================= */}
                <circle cx={c} cy={c} r={rFace} fill="url(#faceGrad)" />
                <circle
                  cx={c}
                  cy={c}
                  r={rFace}
                  fill="none"
                  stroke="#C9962B"
                  strokeWidth={1.4}
                  strokeOpacity={0.65}
                />

                {/* Shree Medallion Artwork */}
                <image
                  href="/vastu/shree.png"
                  x={c - 40}
                  y={c - rFace * 0.45}
                  width={80}
                  height={80}
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* Dynamic Label Under Medallion */}
                <text
                  x={c}
                  y={c + rFace * 0.4}
                  fill="#2C1B11"
                  fontSize={14}
                  fontWeight="900"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {language === "bn" ? activeCategory.name_bn : activeCategory.name}
                </text>

                <text
                  x={c}
                  y={c + rFace * 0.62}
                  fill="#A8761A"
                  fontSize={11}
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {dir16} ({deg}°)
                </text>

                {/* Top Heading Needle Pointer */}
                <polygon
                  points={`${c},${c - rRim + 14} ${c - 8},${c - rRim - 3} ${c + 8},${c - rRim - 3}`}
                  fill="#833501"
                />
              </svg>
            </div>

            {/* Touch Rotate Hint */}
            <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5 mt-1">
              <RotateCcw className="size-3" />
              <span>
                {language === "bn"
                  ? "কম্পাসটি ঘোরাতে হাত দিয়ে স্পর্শ করে ড্র্যাগ করুন"
                  : "Touch or drag the compass wheel to rotate"}
              </span>
            </div>

            {/* Interactive Control Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 w-full">
              {/* Fine-Tuning Step Buttons */}
              <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1 gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustHeading(-5)}
                  className="h-8 px-2 text-xs font-bold"
                >
                  -5°
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustHeading(-1)}
                  className="h-8 px-2 text-xs font-bold"
                >
                  -1°
                </Button>
                <div className="w-[1px] h-4 bg-border my-auto" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustHeading(1)}
                  className="h-8 px-2 text-xs font-bold"
                >
                  +1°
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustHeading(5)}
                  className="h-8 px-2 text-xs font-bold"
                >
                  +5°
                </Button>
              </div>

              {/* Digital Sensor Button */}
              <Button
                variant={isSensorActive ? "primary" : "outline"}
                size="sm"
                onClick={requestSensorPermission}
                className="h-9 rounded-xl font-bold gap-1.5"
              >
                <Smartphone className="size-3.5" />
                <span>
                  {isSensorActive
                    ? language === "bn"
                      ? "সেন্সর অন"
                      : "Sensor On"
                    : language === "bn"
                    ? "লাইভ সেন্সর"
                    : "Live Sensor"}
                </span>
              </Button>

              {/* AR Camera Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={startCamera}
                className="h-9 rounded-xl font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 gap-1.5 hover:bg-amber-500/10"
              >
                <Camera className="size-3.5" />
                <span>{language === "bn" ? "এআর ক্যামেরা" : "AR Camera"}</span>
              </Button>

              {/* Reset to North Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHeading(0)}
                className="h-9 rounded-xl font-bold text-muted-foreground hover:text-foreground"
                title="Reset to 0° True North"
              >
                <RotateCcw className="size-3.5 mr-1" />
                <span>0° N</span>
              </Button>
            </div>

            {/* Quick 16-Direction Shortcut Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-lg">
              {DIR16_ORDER.map((d, i) => {
                const targetDeg = i * 22.5;
                const isSelected = dir16 === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setHeading(targetDeg)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                      isSelected
                        ? "bg-amber-500 text-white shadow-xs scale-105"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* -----------------------------------------------------------------
              2. GUIDANCE HUD (Terracotta & Gold Brackets)
          ----------------------------------------------------------------- */}
          <div
            className={`relative rounded-2xl p-4 sm:p-5 border shadow-sm transition-all overflow-hidden ${
              isBestDirection
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-100"
                : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-100"
            }`}
          >
            {/* Left Vertical Accent Rule */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                isBestDirection ? "bg-emerald-500" : "bg-[#B1510B]"
              }`}
            />

            {/* 4 Gold Corner Brackets */}
            <div className="absolute top-2 left-3 size-3 border-t-2 border-l-2 border-[#C9962B] rounded-tl-sm pointer-events-none" />
            <div className="absolute top-2 right-3 size-3 border-t-2 border-r-2 border-[#C9962B] rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-2 left-3 size-3 border-b-2 border-l-2 border-[#C9962B] rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-2 right-3 size-3 border-b-2 border-r-2 border-[#C9962B] rounded-br-sm pointer-events-none" />

            <div className="flex items-center justify-center gap-3 text-center pl-2">
              {isBestDirection ? (
                <>
                  <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm sm:text-base font-black tracking-wide text-emerald-700 dark:text-emerald-300">
                      {language === "bn"
                        ? `✓ ${activeCategory.name_bn}-এর জন্য এটি সর্বশ্রেষ্ঠ দিক!`
                        : `✓ LOCKED ON BEST DIRECTION FOR ${activeCategory.name.toUpperCase()}`}
                    </div>
                    <div className="text-xs font-medium text-emerald-800/80 dark:text-emerald-200/80 mt-0.5">
                      {language === "bn"
                        ? `এই দিকটি (${dir16}) আপনার উপাদানটির জন্য সম্পূর্ণ শাস্ত্রসম্মত ও সর্বোচ্চ শুভফল প্রদানকারী।`
                        : `Current bearing ${deg}° (${dir16}) perfectly aligns with positive planetary vibrations.`}
                    </div>
                  </div>
                </>
              ) : guide ? (
                <>
                  {guide.delta >= 0 ? (
                    <ArrowRight className="size-6 text-[#B1510B] dark:text-amber-400 shrink-0" />
                  ) : (
                    <ArrowLeft className="size-6 text-[#B1510B] dark:text-amber-400 shrink-0" />
                  )}
                  <div>
                    <div className="text-sm sm:text-base font-black tracking-wide text-[#B1510B] dark:text-amber-300">
                      {language === "bn"
                        ? `সর্বোত্তম স্থান ${guide.dir} (${DIR16_FULL[guide.dir] ?? guide.dir})-এ পৌঁছাতে ${
                            guide.delta >= 0 ? "ডানে" : "বামে"
                          } ${Math.abs(Math.round(guide.delta))}° ঘুরুন`
                        : `Turn ${guide.delta >= 0 ? "Right" : "Left"} ${Math.abs(
                            Math.round(guide.delta)
                          )}° to reach ${DIR16_FULL[guide.dir] ?? guide.dir}`}
                    </div>
                    <div className="text-xs font-medium text-muted-foreground mt-0.5">
                      {language === "bn"
                        ? `নিকটবর্তী শুভ জোন: ${guide.dir} (কেন্দ্র ${dirCenter(guide.dir)}°)`
                        : `Nearest optimal direction: ${guide.dir} (center ${dirCenter(guide.dir)}°)`}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-sm font-bold text-muted-foreground">
                  {language === "bn"
                    ? "কম্পাসটি ঘুরিয়ে আপনার ঘরের সঠিক দিক নির্ণয় করুন।"
                    : "Rotate compass to observe direction guidance."}
                </div>
              )}
            </div>
          </div>

          {/* -----------------------------------------------------------------
              3. CURRENT PLACEMENT VERDICT CARD
          ----------------------------------------------------------------- */}
          <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/80 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                  {language === "bn" ? "বর্তমান অবস্থান ফলাফল" : "Current Placement Verdict"}
                </div>
                <div className="text-lg font-black text-foreground flex items-center gap-2">
                  <span>{language === "bn" ? activeCategory.name_bn : activeCategory.name}</span>
                  <span className="text-muted-foreground">in</span>
                  <span className="text-primary">{dir16} ({DIR16_FULL[dir16] ?? dir16})</span>
                </div>
              </div>

              {/* Verdict Pill Badge */}
              <div
                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs ${
                  isBestDirection
                    ? "bg-emerald-500 text-white"
                    : isAvoidDirection
                    ? "bg-red-500 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                {isBestDirection
                  ? language === "bn"
                    ? "সর্বশ্রেষ্ঠ (Best)"
                    : "Excellent / Best"
                  : isAvoidDirection
                  ? language === "bn"
                    ? "বর্জনীয় (Avoid)"
                    : "Prohibited / Avoid"
                  : language === "bn"
                  ? "মধ্যম (Neutral)"
                  : "Average / Conditional"}
              </div>
            </div>

            {/* 6 Key Elemental Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "পদ ও দেবতা" : "Pada & Deity"}
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">
                  {pada.code} · {language === "bn" ? pada.deity_bn : pada.name}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "তত্ত্ব (Element)" : "Element"}
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5 flex items-center gap-1.5">
                  {pada.element === "Fire" && <Flame className="size-4 text-orange-500" />}
                  {pada.element === "Water" && <Droplets className="size-4 text-sky-500" />}
                  {pada.element === "Air" && <Wind className="size-4 text-emerald-500" />}
                  {pada.element === "Earth" && <Mountain className="size-4 text-amber-600" />}
                  <span>{pada.element}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "জীবন ক্ষেত্র" : "Life Aspect"}
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5 truncate">
                  {language === "bn" ? pada.life_aspect_bn : pada.life_aspect}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "কোণ (Kon)" : "Corner / Kon"}
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5 truncate">
                  {pada.corner}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "অভিভাবক দেবতা" : "Dikpala Lord"}
                </div>
                <div className="text-sm font-extrabold text-foreground mt-0.5">
                  {pada.lord}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "প্রবেশদ্বার রেটিং" : "Entrance Rating"}
                </div>
                <div
                  className="text-sm font-extrabold mt-0.5"
                  style={{ color: pada.entrance_rating_color }}
                >
                  {pada.entrance_rating_label}
                </div>
              </div>
            </div>

            {/* Quick Benefit & Remedy Box */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-medium text-foreground leading-relaxed">
                <strong className="text-primary font-bold">
                  {language === "bn" ? "বাস্তু প্রভাব: " : "Vastu Impact: "}
                </strong>
                {language === "bn" ? activeCategory.benefit_bn : activeCategory.benefit}
              </div>

              {activeCategory.remedy && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-foreground leading-relaxed flex items-start gap-2.5">
                  <ShieldAlert className="size-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-700 dark:text-amber-300 font-bold">
                      {language === "bn" ? "প্রস্তাবিত প্রতিকার: " : "Recommended Remedy: "}
                    </strong>
                    {language === "bn" ? activeCategory.remedy_bn : activeCategory.remedy}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: 16-ZONE DEEP DIVE (Effects & Treatments from Zone Analysis)
      ===================================================================== */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {/* Sub-tab Switch: Effects vs Treatment */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-muted/60 border border-border/80">
            <button
              type="button"
              onClick={() => setAnalysisSubTab("effects")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                analysisSubTab === "effects"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Zap className="size-4" />
              <span>{language === "bn" ? "বাস্তু প্রভাব (Effects)" : "Vastu Effects"}</span>
            </button>

            <button
              type="button"
              onClick={() => setAnalysisSubTab("treatment")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                analysisSubTab === "treatment"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="size-4" />
              <span>{language === "bn" ? "প্রতিকার ও সমাধান (Treatments)" : "Treatments & Remedies"}</span>
            </button>
          </div>

          {/* Life Dimension Card (Principles & Life Area) */}
          {dimension && (
            <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    {dir16} ({DIR16_FULL[dir16] ?? dir16})
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-foreground">
                    {dimension.title}
                  </h4>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary font-black text-xs uppercase tracking-wider">
                  {dimension.attribute}
                </div>
              </div>

              {dimension.principle && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 italic text-sm text-foreground">
                  &ldquo;{dimension.principle}&rdquo;
                </div>
              )}

              {dimension.context && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dimension.context}
                </p>
              )}

              {/* Positive Expression vs Shadow Expression */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                  <div className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span>{dimension.positiveLabel}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {dimension.positive.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-emerald-950 dark:text-emerald-100 flex items-start gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-2">
                  <div className="text-xs font-black uppercase text-red-800 dark:text-red-300 flex items-center gap-1.5">
                    <AlertTriangle className="size-4 text-red-500" />
                    <span>{dimension.shadowLabel}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {dimension.shadow.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-red-950 dark:text-red-100 flex items-start gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Category-Specific Detailed Blocks from 7,000-line Zone Analysis */}
          <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/80 shadow-2xs space-y-4">
            <div className="border-b border-border/60 pb-3">
              <h4 className="text-base font-black text-foreground flex items-center gap-2">
                <span>{activeCategory.icon}</span>
                <span>
                  {language === "bn" ? activeCategory.name_bn : activeCategory.name} &mdash;{" "}
                  {dir16} জোন বিশ্লেষণ
                </span>
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {zoneDoc?.heading || `${activeCategory.name} in ${DIR16_FULL[dir16] ?? dir16}`}
              </p>
            </div>

            {/* Preamble if present */}
            {analysisSubTab === "effects" && zonePreambleBlocks && zonePreambleBlocks.length > 0 && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                {zonePreambleBlocks.map((b, i) => (
                  <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                    {b.text}
                  </p>
                ))}
              </div>
            )}

            {/* Main Content Blocks */}
            {(() => {
              const blocks =
                analysisSubTab === "effects" ? zoneDocSplit.effects : zoneDocSplit.treatment;

              if (blocks.length === 0) {
                return (
                  <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
                    {analysisSubTab === "effects"
                      ? language === "bn"
                        ? "এই জোনের জন্য কোনো প্রতিকূল প্রভাব নেই (এটি একটি অত্যন্ত শুভ অবস্থান)।"
                        : "No adverse effects noted. This is an ideal zone."
                      : language === "bn"
                      ? "এই জোনে কোনো বিশেষ প্রতিকার প্রয়োজন নেই। স্থানটি পরিষ্কার ও পরিচ্ছন্ন রাখুন।"
                      : "No special remedies needed. Keep the area tidy and well-ventilated."}
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {blocks.map((block: ZoneBlock, idx: number) => {
                    if (block.t === "h") {
                      return (
                        <h5
                          key={idx}
                          className="text-sm font-extrabold text-foreground pt-2 flex items-center gap-1.5"
                        >
                          <ChevronRight className="size-4 text-amber-500" />
                          <span>{block.text}</span>
                        </h5>
                      );
                    }
                    if (block.t === "label") {
                      return (
                        <div key={idx} className="text-xs text-foreground leading-relaxed">
                          <strong className="text-primary font-bold">{block.label}: </strong>
                          <span>{block.text}</span>
                        </div>
                      );
                    }
                    if (block.t === "li") {
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground">
                          <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span className="leading-relaxed">{block.text}</span>
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="text-xs text-foreground leading-relaxed">
                        {block.text}
                      </p>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Color Spectrum Recommendations for this Zone */}
          <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/80 shadow-2xs space-y-3">
            <h4 className="text-sm font-black text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>{language === "bn" ? "বাস্তু বর্ণ বিন্যাস (Colour Alignment Matrix)" : "Colour Intelligence Matrix"}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "স্বাভাবিক রঙ (Self Colour)" : "Self Colour"}
                </div>
                <div className="text-xs font-bold text-foreground">{pada.self_colour}</div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                  {language === "bn" ? "বর্ধক রঙ (Enhancing Colour)" : "Enhancing Colour"}
                </div>
                <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                  {pada.enhance_colour}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                <div className="text-[10px] font-bold uppercase text-muted-foreground">
                  {language === "bn" ? "গ্রহণযোগ্য রঙ (Acceptable Colour)" : "Acceptable Colour"}
                </div>
                <div className="text-xs font-bold text-foreground">{pada.acceptable_colour}</div>
              </div>

              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-1">
                <div className="text-[10px] font-bold uppercase text-red-700 dark:text-red-300">
                  {language === "bn" ? "ধ্বংসাত্মক বর্জনীয় রঙ (Destructive Colour)" : "Destructive Colour (Avoid)"}
                </div>
                <div className="text-xs font-bold text-red-950 dark:text-red-100">
                  {pada.destruct_colour}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: 32 PADAS & 7D NEXUS DEEP DIVE
      ===================================================================== */}
      {activeTab === "nexus" && (
        <div className="space-y-6">
          {/* Asta Dikpala Deity Hero Card with Authentic Deity Artwork */}
          <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/80 shadow-2xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Deity Artwork Image */}
              {pada.art_image && (
                <div className="relative size-32 sm:size-40 shrink-0 rounded-2xl bg-gradient-to-b from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center p-2 shadow-inner">
                  <Image
                    src={pada.art_image}
                    alt={pada.lord}
                    width={150}
                    height={150}
                    className="object-contain max-h-full drop-shadow-md"
                  />
                </div>
              )}

              {/* Deity Details */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-black">
                    {pada.code}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {pada.corner}
                  </span>
                  {pada.isGoldenDoor && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center gap-1">
                      <Sparkles className="size-3" />
                      <span>{language === "bn" ? "স্বর্ণদ্বার (Golden Door)" : "Golden Door"}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {pada.lord} ({pada.deity_english})
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    {language === "bn" ? "বাস্তু গুণাবলী: " : "Vastu Association: "}
                  </strong>
                  {pada.vastu_association}
                </p>

                {/* 5 Sacred 7D Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <div className="text-[9px] font-bold uppercase text-muted-foreground">Planet</div>
                    <div className="text-xs font-extrabold text-foreground">{pada.planet}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <div className="text-[9px] font-bold uppercase text-muted-foreground">Day</div>
                    <div className="text-xs font-extrabold text-foreground">{pada.day}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <div className="text-[9px] font-bold uppercase text-muted-foreground">Metal</div>
                    <div className="text-xs font-extrabold text-foreground">{pada.metal}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/40 border border-border/60">
                    <div className="text-[9px] font-bold uppercase text-muted-foreground">Shape</div>
                    <div className="text-xs font-extrabold text-foreground">{pada.shape}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Entrance Deep Dive Section (Residential / Commercial / Remedies) */}
          <div className="card-surface p-5 sm:p-6 rounded-3xl border border-border/80 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div>
                <h4 className="text-base font-black text-foreground flex items-center gap-2">
                  <Compass className="size-4 text-amber-500" />
                  <span>
                    {language === "bn"
                      ? `${pada.code} (${language === "bn" ? pada.deity_bn : pada.name}) প্রবেশদ্বার গবেষণা`
                      : `${pada.code} (${pada.name}) Entrance Research`}
                  </span>
                </h4>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {language === "bn" ? "আবাসিক, বাণিজ্যিক ও প্রতিকার নির্দেশিকা" : "Residential, Commercial & Remedies"}
                </div>
              </div>

              {/* Sub-Tabs for Entrance Research */}
              <div className="flex items-center rounded-xl bg-muted/60 p-1 border border-border/60">
                <button
                  type="button"
                  onClick={() => setNexusSubTab("residential")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    nexusSubTab === "residential"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {language === "bn" ? "আবাসিক প্রভাব" : "Residential"}
                </button>
                <button
                  type="button"
                  onClick={() => setNexusSubTab("commercial")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    nexusSubTab === "commercial"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {language === "bn" ? "বাণিজ্যিক প্রভাব" : "Commercial"}
                </button>
                <button
                  type="button"
                  onClick={() => setNexusSubTab("remedies")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    nexusSubTab === "remedies"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {language === "bn" ? "প্রতিকার" : "Remedies"}
                </button>
              </div>
            </div>

            {/* Display Selected Entrance Dataset */}
            {(() => {
              const currentEntry =
                nexusSubTab === "residential"
                  ? residentialEntry
                  : nexusSubTab === "commercial"
                  ? commercialEntry
                  : remedyEntry;

              if (!currentEntry) {
                return (
                  <div className="p-5 text-center text-xs text-muted-foreground bg-muted/20 rounded-2xl">
                    {language === "bn"
                      ? "এই পদের জন্য কোনো অতিরিক্ত ডাটা নথিবদ্ধ নেই।"
                      : "No supplementary entries for this pada."}
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  <h5 className="text-sm font-extrabold text-primary">
                    {currentEntry.heading}
                  </h5>
                  <div className="space-y-2">
                    {currentEntry.blocks.map((b: PadaBlock, i: number) => {
                      if (b.t === "li") {
                        return (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-foreground">
                            <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span className="leading-relaxed">{b.text}</span>
                          </div>
                        );
                      }
                      return (
                        <p key={i} className="text-xs text-foreground leading-relaxed">
                          {b.text}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
