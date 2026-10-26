"use client";

/**
 * Palm Reading (হস্তরেখা বিচার / हस्तरेखा विज्ञान).
 *
 * Full-stack computer vision & Vedic Chiromancy pipeline.
 * Real-time 21-joint landmark tracking, Gabor filter crease extraction,
 * and authentic client-rule matching in Bengali, Hindi, and English.
 */

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Download,
  Eye,
  FileText,
  Flame,
  Gem,
  Globe2,
  Hand,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Loader2,
  Move3d,
  Printer,
  RefreshCw,
  Ruler,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingUp,
  Upload,
  Waves,
  Wind,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Palm3DViewer } from "@/components/palm-reading/Palm3DViewer";
import { Button } from "@/components/ui";
import { palmReadingApi } from "@/lib/api";
import {
  captureFrame,
  detectFromVideo,
  drawHandOverlay,
  type PalmStatus,
} from "@/lib/palm-measure";
import {
  PALM_TRANSLATIONS,
  type PalmLanguage,
} from "@/lib/palm-reading-translations";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import type {
  PalmReadingAvailability,
  PalmScanResponse,
} from "@/types";

const CREASE_THEME: Record<
  string,
  { color: string; border: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  heart: {
    color: "bg-rose-500",
    border: "border-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-700",
    icon: Heart,
  },
  head: {
    color: "bg-blue-500",
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: Wind,
  },
  life: {
    color: "bg-emerald-500",
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: Waves,
  },
  fate: {
    color: "bg-amber-500",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: Flame,
  },
  sun: {
    color: "bg-yellow-500",
    border: "border-yellow-200",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: Sun,
  },
  mercury: {
    color: "bg-cyan-500",
    border: "border-cyan-200",
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    icon: Activity,
  },
  mars: {
    color: "bg-orange-500",
    border: "border-orange-200",
    bg: "bg-orange-50",
    text: "text-orange-700",
    icon: ShieldCheck,
  },
};

export default function PalmReadingPage() {
  const { isSignedIn } = useAuth();
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const palmFeature = getFeature("palm_reading");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  const [language, setLanguage] = React.useState<PalmLanguage>("bn");
  const t = PALM_TRANSLATIONS[language];

  const [availability, setAvailability] = React.useState<PalmReadingAvailability | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState<PalmScanResponse | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "timeline" | "archetype" | "marriage" | "loops" | "medical" | "kundli_sync" | "sacred_marks" | "lines" | "scan3d" | "forecasts" | "details"
  >("overview");
  const [selectedAge, setSelectedAge] = React.useState<number>(30);
  const [showOverlay, setShowOverlay] = React.useState(true);

  // Optional Kundli Synchronization state
  const [syncKundli, setSyncKundli] = React.useState(false);
  const [birthDate, setBirthDate] = React.useState("");
  const [birthTime, setBirthTime] = React.useState("12:00");
  const [birthPlace, setBirthPlace] = React.useState("Kolkata, India");

  const fileInput = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // --- live camera ------------------------------------------------------
  const [cameraOn, setCameraOn] = React.useState(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<PalmStatus | null>(null);
  const [flashActive, setFlashActive] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const overlayRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const capturingRef = React.useRef(false);

  React.useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    palmReadingApi
      .availability()
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch(() => {
        /* silent catch */
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  React.useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const waitForVideo = React.useCallback(async (): Promise<HTMLVideoElement | null> => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (videoRef.current) return videoRef.current;
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return null;
  }, []);

  const stopCamera = React.useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus(null);
    setCameraOn(false);
    capturingRef.current = false;
  }, []);

  React.useEffect(() => stopCamera, [stopCamera]);

  const scanBlob = React.useCallback(async (blob: Blob, previewUrl: string) => {
    const access = checkAccess("palm_reading");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(
          language === "bn"
            ? "পাম রিডিং ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে।"
            : "Palm reading feature is temporarily unavailable.",
        );
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return previewUrl;
    });
    setResult(null);
    setScanning(true);
    try {
      const birthPayload =
        syncKundli && birthDate
          ? {
              birth_date: birthDate,
              birth_time: birthTime,
              latitude: 22.5726,
              longitude: 88.3639,
              timezone_offset: 5.5,
            }
          : undefined;
      const response = await palmReadingApi.scan(blob, birthPayload);
      setResult(response);
      if (response.status === "ok") {
        if (access.requiredCoins > 0) {
          toast.success(
            language === "bn"
              ? `পাম রিডিং বিশ্লেষণ সম্পন্ন হয়েছে! (${access.requiredCoins} কয়েন খরচ হয়েছে)`
              : `Palm scan completed! (${access.requiredCoins} coins used)`,
          );
          refreshWallet();
        } else {
          toast.success(
            language === "bn"
              ? `${response.sections.length}টি গভীর বিশ্লেষণ সম্পন্ন হয়েছে!`
              : language === "hi"
                ? `${response.sections.length} विश्लेषण सफलतापूर्वक प्राप्त हुए!`
                : `${response.sections.length} detailed findings identified from your palm.`,
          );
        }
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          120,
        );
      } else {
        toast.info(response.message || t.rejectedTitle);
      }
    } catch (error: any) {
      if (error?.code === "insufficient_coins" || error?.message?.includes("insufficient_coins")) {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (error?.status === 401 || error?.code === "authentication_required") {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(error instanceof Error ? error.message : "The scan could not be completed.");
      }
    } finally {
      setScanning(false);
      capturingRef.current = false;
    }
  }, [checkAccess, language, refreshWallet, t.rejectedTitle]);

  const startCamera = React.useCallback(async () => {
    setCameraError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);

      const video = await waitForVideo();
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setCameraOn(false);
        setCameraError("The camera preview could not be started. Please try again.");
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => {});

      const loop = async () => {
        const element = videoRef.current;
        if (!element || element.readyState < 2) {
          frameRef.current = requestAnimationFrame(() => void loop());
          return;
        }
        if (capturingRef.current) {
          frameRef.current = requestAnimationFrame(() => void loop());
          return;
        }

        try {
          const next = await detectFromVideo(element, performance.now());
          setStatus(next);

          if (overlayRef.current) {
            const canvas = overlayRef.current;
            if (canvas.width !== element.videoWidth || canvas.height !== element.videoHeight) {
              canvas.width = element.videoWidth || 1280;
              canvas.height = element.videoHeight || 720;
            }
            drawHandOverlay(canvas, next.landmarks, next.aligned);
          }
        } catch {
          // Ignore dropped frames
        }

        frameRef.current = requestAnimationFrame(() => void loop());
      };

      frameRef.current = requestAnimationFrame(() => void loop());
    } catch (error) {
      setCameraOn(false);
      const name = (error as { name?: string })?.name;
      setCameraError(
        name === "NotAllowedError"
          ? "Camera access was refused. Allow camera permission or upload a photo."
          : "Could not open camera. You can upload a photo instead.",
      );
    }
  }, [scanBlob, stopCamera, waitForVideo]);

  const handleFile = async (file: File) => {
    const access = checkAccess("palm_reading");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(
          language === "bn"
            ? "পাম রিডিং ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে।"
            : "Palm reading feature is temporarily unavailable.",
        );
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid photo.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("That photo is larger than 25 MB. Please use a smaller one.");
      return;
    }

    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    setResult(null);
    setScanning(true);

    try {
      const response = await palmReadingApi.scan(file);
      setResult(response);
      if (response.status === "ok") {
        if (access.requiredCoins > 0) {
          toast.success(
            language === "bn"
              ? `পাম রিডিং বিশ্লেষণ সম্পন্ন হয়েছে! (${access.requiredCoins} কয়েন খরচ হয়েছে)`
              : `Palm scan completed! (${access.requiredCoins} coins used)`,
          );
          refreshWallet();
        } else {
          toast.success(
            language === "bn"
              ? `${response.sections.length}টি গভীর বিশ্লেষণ সম্পন্ন হয়েছে!`
              : language === "hi"
                ? `${response.sections.length} विश्लेषण प्राप्त हुए!`
                : `${response.sections.length} findings from your palm.`,
          );
        }
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          120,
        );
      } else {
        toast.info(response.message || t.rejectedTitle);
      }
    } catch (error: any) {
      if (error?.code === "insufficient_coins" || error?.message?.includes("insufficient_coins")) {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (error?.status === 401 || error?.code === "authentication_required") {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(error instanceof Error ? error.message : "The scan could not be completed.");
      }
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    stopCamera();
    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return null;
    });
    setResult(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const handleManualCapture = React.useCallback(async () => {
    const element = videoRef.current;
    if (!element || capturingRef.current || scanning) return;
    capturingRef.current = true;

    // Camera flash effect
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 240);

    try {
      const blob = await captureFrame(element);
      stopCamera();
      await scanBlob(blob, URL.createObjectURL(blob));
    } catch (error) {
      capturingRef.current = false;
      toast.error(error instanceof Error ? error.message : "Failed to capture photo.");
    }
  }, [scanBlob, scanning, stopCamera]);

  // Group sections by life area
  const byArea = React.useMemo(() => {
    if (!result?.sections) return [];
    const groups = new Map<string, typeof result.sections>();
    for (const section of result.sections) {
      const area = section.area || "General";
      groups.set(area, [...(groups.get(area) ?? []), section]);
    }
    return [...groups.entries()];
  }, [result]);

  // Group sections by category for Tabs
  const categorized = React.useMemo(() => {
    if (!result?.sections) return { lines: [], forecasts: [], proportions: [] };
    const lines = result.sections.filter((s) =>
      [
        "heart_line",
        "head_line",
        "life_line",
        "fate_line",
        "sun_line",
        "mars_line",
        "line_relationship",
      ].includes(s.feature),
    );
    const forecasts = result.sections.filter((s) =>
      ["career_forecast", "relationship_forecast", "health_forecast"].includes(s.feature),
    );
    const proportions = result.sections.filter(
      (s) =>
        ![
          "heart_line",
          "head_line",
          "life_line",
          "fate_line",
          "sun_line",
          "mars_line",
          "line_relationship",
          "career_forecast",
          "relationship_forecast",
          "health_forecast",
          "hand_type",
          "sacred_marks",
          "skin_vitality",
        ].includes(s.feature),
    );
    return { lines, forecasts, proportions };
  }, [result]);

  const handTypeInfo = React.useMemo(() => {
    const rawType = (result?.hand_type?.type || "").toLowerCase();
    if (rawType.includes("earth")) return t.elements.earth;
    if (rawType.includes("air")) return t.elements.air;
    if (rawType.includes("fire")) return t.elements.fire;
    if (rawType.includes("water")) return t.elements.water;
    return null;
  }, [result, t]);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        {/* Language selector & top header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-brand-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-900">
            <Hand className="size-3" />
            {t.badge}
          </span>

          <div className="flex items-center gap-1 rounded-xl border border-border bg-surface p-1">
            <Globe2 className="ml-2 size-3.5 text-muted-foreground" />
            {(["bn", "hi", "en"] as PalmLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all",
                  language === lang
                    ? "bg-brand-500 text-white shadow-sm"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                )}
              >
                {lang === "bn" ? "বাংলা" : lang === "hi" ? "हिन्दी" : "English"}
              </button>
            ))}
          </div>
        </div>

        <header className="mt-6 text-center">
          <h1 className="font-display text-2xl font-black text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {t.subtitle}
          </p>

          <div className="pt-4 flex justify-center">
            <FeatureCoinBadge
              feature={palmFeature}
              walletBalance={walletBalance}
              language={language}
            />
          </div>
        </header>

        {!isSignedIn ? (
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
            <Hand className="mx-auto size-10 text-brand-500" />
            <p className="mt-3 text-sm font-bold text-foreground">
              {t.signInPrompt}
            </p>
            <div className="mt-5">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Capture Area */}
            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-border bg-surface p-5 shadow-sm sm:p-7">
              {palmFeature && !palmFeature.enabled && (
                <div className="mb-5">
                  <FeatureDisabledAlert
                    featureName={language === "bn" ? "পাম রিডিং (হস্তরেখা বিচার)" : "Palm Reading"}
                    language={language}
                  />
                </div>
              )}
              {availability && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-muted p-3.5">
                  <span className="text-xs font-semibold text-foreground">
                    {availability.coins_required > 0
                      ? `${availability.coins_required} ${t.coinsCost}`
                      : t.freeCost}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      availability.can_afford
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-900",
                    )}
                  >
                    {t.balance}: {availability.wallet_balance}
                  </span>
                </div>
              )}

              {availability?.requires?.length ? (
                <div className="mb-5 rounded-2xl border border-brand-300/70 bg-brand-50/70 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-900">
                    <Info className="size-3.5" />
                    {t.guidanceTitle}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {availability.requires.map((line) => (
                      <li key={line} className="text-[11px] leading-relaxed text-brand-950">
                        • {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {/* Optional Kundli Synchronization Card */}
              <div className="mb-5 rounded-2xl border border-brand-200/80 bg-gradient-to-r from-brand-50/50 via-white to-amber-50/50 p-4 shadow-xs">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                      <Sun className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-foreground">
                        {language === "bn"
                          ? "বৈদিক জন্মকুণ্ডলী সংমিশ্রণ (ঐচ্ছিক)"
                          : language === "hi"
                            ? "वैदिक जन्म कुंडली संरेखण (वैकल्पिक)"
                            : "Vedic Kundli Synchronization (Optional)"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {language === "bn"
                          ? "হস্তরেখা ও গ্রহ সংস্থানকে একসাথে ১০০% নিখুঁত করতে জন্ম বিবরণ যুক্ত করুন"
                          : "Cross-correlate 9 planetary Grahas with your palm mount topography"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSyncKundli(!syncKundli)}
                    className={cn(
                      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      syncKundli ? "bg-brand-600" : "bg-neutral-200"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                        syncKundli ? "translate-x-5" : "translate-x-0"
                      )}
                    />
                  </button>
                </div>

                {syncKundli && (
                  <div className="mt-4 pt-3 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        {language === "bn" ? "জন্ম তারিখ" : "Birth Date"}
                      </label>
                      <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-foreground focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        {language === "bn" ? "জন্ম সময়" : "Birth Time"}
                      </label>
                      <input
                        type="time"
                        value={birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-foreground focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        {language === "bn" ? "জন্ম স্থান" : "Birth Place"}
                      </label>
                      <input
                        type="text"
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        placeholder="e.g. Kolkata, India"
                        className="w-full rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-bold text-foreground focus:border-brand-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />

              {/* Live camera view */}
              {cameraOn ? (
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] max-h-[72vh] w-full max-w-lg mx-auto overflow-hidden rounded-3xl border-2 border-brand-300/40 bg-ink-950 shadow-2xl">
                    {/* Camera Flash Overlay */}
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 z-30 bg-white transition-opacity duration-200",
                        flashActive ? "opacity-95" : "opacity-0",
                      )}
                    />

                    {/* Camera Live Video */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="size-full object-cover"
                    />

                    {/* Live 3D Hand Skeleton & Mount Topography Overlay */}
                    <canvas
                      ref={overlayRef}
                      className="pointer-events-none absolute inset-0 size-full object-cover z-[15]"
                    />

                    {/* Biometric Laser Scanline */}
                    <div className="laser-scanline" />

                    {/* Biometric Alignment Oval & Corner Crosshairs */}
                    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
                      <div
                        className={cn(
                          "relative aspect-[3/4] w-52 sm:w-64 rounded-[40px] border-2 transition-all duration-300",
                          status?.aligned
                            ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.65)] scale-[1.02]"
                            : status?.found
                              ? "border-amber-400/90 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                              : "border-white/35 border-dashed",
                        )}
                      >
                        {/* Corner crosshairs */}
                        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-white/80" />
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-white/80" />
                        <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-8 w-0.5 bg-white/80" />
                        <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-8 w-0.5 bg-white/80" />

                        {/* Top Planetary Mount Targets */}
                        <div className="absolute inset-x-2 top-2 flex justify-between px-2 text-[9px] font-black text-white/70">
                          <span>♃ Jupiter</span>
                          <span>♄ Saturn</span>
                          <span>☉ Apollo</span>
                          <span>☿ Mercury</span>
                        </div>
                      </div>

                      {/* Live Alignment Feedback Pill */}
                      <div className="mt-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide shadow-lg backdrop-blur-md transition-all">
                        {status?.aligned ? (
                          <span className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/80 px-4 py-1.5 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                            <CheckCircle2 className="size-4 text-emerald-400" />
                            {t.alignedReady}
                          </span>
                        ) : status?.found ? (
                          <span className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-950/80 px-4 py-1.5 text-amber-200">
                            <Hand className="size-4 text-amber-400" />
                            {status.guidance || t.handFramingGuide}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-1.5 text-white/80">
                            <Hand className="size-4 text-white/60" />
                            {t.lookingForHand}
                          </span>
                        )}
                        {status?.handedness && (
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/90">
                            {status.handedness === "Left" ? t.leftHand : t.rightHand}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Circular On-screen Mobile Shutter Button */}
                    <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
                      <button
                        type="button"
                        onClick={handleManualCapture}
                        disabled={scanning}
                        aria-label="Capture palm scan"
                        className={cn(
                          "group relative flex size-16 items-center justify-center rounded-full border-4 border-white/80 shadow-2xl transition-all active:scale-95 disabled:opacity-50",
                          status?.aligned
                            ? "bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.7)]"
                            : "bg-white/30 backdrop-blur-md hover:bg-white/40",
                        )}
                      >
                        <span
                          className={cn(
                            "size-11 rounded-full transition-all",
                            status?.aligned ? "bg-white group-hover:scale-105" : "bg-white/80 group-hover:bg-white",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Primary Manual Trigger Buttons Matching Face Scan */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Button
                      onClick={handleManualCapture}
                      disabled={scanning}
                      className={cn(
                        "h-12 w-full sm:w-auto px-8 text-base font-black shadow-lg transition-all",
                        status?.aligned
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-pulse"
                          : "bg-brand-500 hover:bg-brand-600 text-ink-950",
                      )}
                    >
                      <Camera className="size-5" />
                      {status?.aligned ? t.captureReady : t.captureManual}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={stopCamera}
                      disabled={scanning}
                      className="h-12 w-full sm:w-auto font-bold"
                    >
                      {t.stopCamera}
                    </Button>
                  </div>
                </div>
              ) : preview ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="The palm photo being read"
                    className="mx-auto max-h-80 rounded-2xl border border-border object-contain shadow-sm"
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={reset} disabled={scanning} className="gap-2">
                      <RefreshCw className="size-4" /> {t.scanningAgain}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => void startCamera()}
                    disabled={scanning || (palmFeature ? !palmFeature.enabled : false)}
                    className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-10 transition-all hover:bg-brand-50 disabled:opacity-50"
                  >
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-400 text-ink-950 shadow-sm">
                      <Camera className="size-6" />
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {palmFeature && !palmFeature.enabled
                        ? language === "bn"
                          ? "ফিচারটি বর্তমানে বন্ধ রয়েছে"
                          : "Feature Disabled"
                        : t.scanWithCamera}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.scanCameraSubtitle}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={scanning || (palmFeature ? !palmFeature.enabled : false)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface-muted py-3.5 text-xs font-bold text-foreground transition-colors hover:bg-surface disabled:opacity-50"
                  >
                    <Upload className="size-4" />
                    {t.uploadPhoto}
                  </button>

                  {cameraError && (
                    <p className="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}

              {scanning && (
                <div className="mt-5 flex flex-col items-center justify-center gap-2 rounded-2xl bg-brand-50 p-4 text-brand-900">
                  <Loader2 className="size-6 animate-spin text-brand-600" />
                  <p className="text-sm font-bold">{t.scanningText}</p>
                </div>
              )}
            </section>

            {/* Rejected notification */}
            {result && result.status !== "ok" && (
              <section className="mx-auto mt-6 max-w-3xl rounded-3xl border border-amber-300 bg-amber-50/90 p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-black text-amber-950">
                  <AlertTriangle className="size-5 shrink-0 text-amber-600" />
                  {t.rejectedTitle}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-amber-900">
                  {result.message}
                </p>
                <p className="mt-2 text-[11px] font-bold text-emerald-800">
                  {t.notCharged}
                </p>

                {result.quality_checks.length > 0 && (
                  <ul className="mt-4 space-y-1.5 border-t border-amber-200/60 pt-3">
                    {result.quality_checks.map((check) => (
                      <li
                        key={check.name}
                        className="flex items-start gap-2 text-[11px] leading-relaxed"
                      >
                        {check.passed ? (
                          <CheckCircle2 className="mt-px size-3.5 shrink-0 text-emerald-600" />
                        ) : (
                          <XCircle className="mt-px size-3.5 shrink-0 text-rose-600" />
                        )}
                        <span className={check.passed ? "text-amber-900/70" : "font-semibold text-amber-950"}>
                          {check.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Comprehensive Reading Result */}
            {result && result.status === "ok" && (
              <div ref={resultsRef} className="mt-10 space-y-8">
                {/* Result Hero Header */}
                <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50/90 via-surface to-brand-50/40 p-6 shadow-sm sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-700">
                        <Sparkles className="size-3.5" />
                        {result.handedness === "Left" ? t.leftHand : t.rightHand} · Verified
                      </span>
                      <h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">
                        {t.resultsTitle}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                        {t.resultsSubtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <Printer className="size-3.5" />
                        {language === "bn" ? "প্রিন্ট করুন" : language === "hi" ? "प्रिंट करें" : "Print"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={reset}
                        className="gap-1.5 text-xs font-semibold"
                      >
                        <RefreshCw className="size-3.5" />
                        {t.scanningAgain}
                      </Button>
                    </div>
                  </div>

                  {/* Hand Type Element Banner */}
                  {result.hand_type?.type && handTypeInfo && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-brand-300 bg-white p-5 shadow-sm">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                            {t.handTypeTitle}
                          </span>
                          <h3 className="text-xl font-black text-foreground sm:text-2xl">
                            {handTypeInfo.title}
                          </h3>
                          <p className="text-xs font-medium text-brand-900">
                            {handTypeInfo.subtitle}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {handTypeInfo.desc}
                          </p>
                        </div>

                        {result.hand_type.palm_aspect && (
                          <div className="flex shrink-0 gap-3 rounded-xl bg-brand-50/70 p-3 text-center">
                            <div>
                              <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                                Aspect Ratio
                              </span>
                              <span className="text-sm font-extrabold text-brand-950">
                                {result.hand_type.palm_aspect.toFixed(2)}
                              </span>
                            </div>
                            <div className="h-8 w-px bg-brand-200" />
                            <div>
                              <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                                Finger Ratio
                              </span>
                              <span className="text-sm font-extrabold text-brand-950">
                                {result.hand_type.finger_palm_ratio?.toFixed(2) ?? "1.00"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border pb-1">
                  {[
                    { id: "overview", label: t.tabs.overview, icon: Layers },
                    { id: "archetype", label: t.tabs.archetype, icon: Compass },
                    { id: "marriage", label: t.tabs.marriage, icon: Heart },
                    { id: "loops", label: t.tabs.loops, icon: Waves },
                    { id: "medical", label: t.tabs.medical, icon: Activity },
                    { id: "kundli_sync", label: t.tabs.kundli_sync, icon: Sun },
                    { id: "timeline", label: t.tabs.timeline, icon: Calendar },
                    { id: "sacred_marks", label: t.tabs.sacred_marks, icon: Sparkles },
                    { id: "lines", label: t.tabs.lines, icon: Eye },
                    { id: "scan3d", label: t.tabs.scan3d, icon: Move3d },
                    { id: "forecasts", label: t.tabs.forecasts, icon: TrendingUp },
                    { id: "details", label: t.tabs.details, icon: Ruler },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all",
                          isActive
                            ? "bg-brand-500 text-white shadow-sm"
                            : "text-muted-foreground hover:bg-surface hover:text-foreground",
                        )}
                      >
                        <Icon className="size-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab: Overview (Traced Overlay + Primary Features) */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Ayurvedic Prana & Karmic Energy Matrix */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {/* Karmic Hand Role */}
                      {result.karmic_summary && (
                        <div className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-white via-brand-50/30 to-amber-50/40 p-5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-700">
                              <Compass className="size-3 text-brand-600" />
                              {language === "bn" ? "কার্মিক হস্ত বিধান" : language === "hi" ? "कर्म विधान" : "Karmic Axis"}
                            </span>
                            <span className="text-xs font-black text-brand-800">
                              {result.karmic_summary.role}
                            </span>
                          </div>
                          <h4 className="mt-2.5 text-base font-black text-foreground">
                            {result.handedness === "Left" ? t.leftHand : t.rightHand} · {result.karmic_summary.role}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {result.karmic_summary.role_meaning}
                          </p>
                          <div className="mt-3.5 rounded-2xl border border-brand-200/60 bg-white/80 p-3 text-xs">
                            <span className="font-bold text-brand-950">
                              {language === "bn" ? "কার্মিক সামঞ্জস্য:" : "Karmic Balance:"}
                            </span>{" "}
                            <span className="text-muted-foreground">
                              {result.karmic_summary.karmic_harmony}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Ayurvedic Skin Flush & Prana Vitality */}
                      {result.skin_vitality && (
                        <div className="relative overflow-hidden rounded-3xl border border-rose-200/80 bg-gradient-to-br from-white via-rose-50/30 to-orange-50/40 p-5 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-700">
                              <Activity className="size-3 text-rose-600" />
                              {language === "bn" ? "আয়ুর্বেদিক ওজঃ ও কান্তি" : "Ayurvedic Prana Flush"}
                            </span>
                            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-black text-rose-800">
                              {result.skin_vitality.vitality_score}% Vitality
                            </span>
                          </div>
                          <div className="mt-2.5 flex items-baseline gap-2">
                            <h4 className="text-base font-black text-foreground capitalize">
                              {result.skin_vitality.flush_tone.replace(/_/g, " ")}
                            </h4>
                            <span className="text-xs font-bold text-rose-600">
                              · {result.skin_vitality.ayurvedic_dosha}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {result.skin_vitality.temperament}
                          </p>
                          <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-rose-200/60 bg-white/80 p-3 text-xs">
                            <span className="font-bold text-ink-950">
                              {language === "bn" ? "রক্তসঞ্চালন ও প্রাণবায়ু:" : "Circulation Rating:"}
                            </span>
                            <span className="font-extrabold text-rose-700 capitalize">
                              {result.skin_vitality.circulation_rating}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sacred Marks Spotlight Banner */}
                    {result.sacred_marks && result.sacred_marks.filter((m) => m.found).length > 0 && (
                      <div className="overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-5 text-white shadow-md sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-100">
                              <Sparkles className="size-3 text-amber-200" />
                              {language === "bn" ? "দুর্লভ বৈদিক শুভ যোগ সনাক্ত" : "Auspicious Sacred Yogas Detected"}
                            </span>
                            <h3 className="text-lg font-black sm:text-xl">
                              {result.sacred_marks.filter((m) => m.found).length}{" "}
                              {language === "bn" ? "টি পবিত্র শুভ চিহ্ন আপনার হাতে বিদ্যমান" : "Sacred Vedic Marks Found"}
                            </h3>
                            <p className="text-xs text-amber-100/90">
                              {result.sacred_marks
                                .filter((m) => m.found)
                                .map((m) => `${m.sanskrit_name} (${m.name})`)
                                .join(" · ")}
                            </p>
                          </div>
                          <Button
                            onClick={() => setActiveTab("sacred_marks")}
                            className="shrink-0 gap-2 bg-white font-black text-amber-950 shadow hover:bg-amber-50"
                          >
                            <Gem className="size-4 text-amber-600" />
                            {language === "bn" ? "চিহ্নগুলোর মহিমা দেখুন" : "Explore Sacred Marks"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* 3D Scan Teaser Banner */}
                    <div className="overflow-hidden rounded-3xl border border-brand-300/80 bg-gradient-to-r from-ink-950 via-brand-950 to-ink-950 p-5 text-white shadow-lg sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-300">
                            <Sparkles className="size-3" />
                            {language === "bn" ? "নতুন ত্রিমাত্রিক প্রযুক্তি" : "Precision 3D Biometrics"}
                          </span>
                          <h3 className="text-lg font-black sm:text-xl">
                            {language === "bn"
                              ? "আপনার হাতের পূর্ণ ত্রিমাত্রিক (3D) স্ক্যান প্রস্তুত"
                              : language === "hi"
                                ? "आपकी हथेली का पूर्ण 3D स्कैन तैयार है"
                                : "Your Full 3D Palm Scan is Ready"}
                          </h3>
                          <p className="text-xs text-white/70">
                            {language === "bn"
                              ? "গ্রহ পর্বতের উচ্চতা (mm), মঙ্গল তলের গভীরতা এবং আঙুলের নমনীয়তার ৩৬০° ত্রিমাত্রিক মডেল দেখুন।"
                              : language === "hi"
                                ? "ग्रह पर्वतों की ऊंचाई (mm), गहराई और 360° त्रि-आयामी मॉडल देखें।"
                                : "Explore millimeter mount topography, hollow depth, and 360° interactive 3D skeleton."}
                          </p>
                        </div>
                        <Button
                          onClick={() => setActiveTab("scan3d")}
                          className="shrink-0 gap-2 bg-brand-500 font-bold text-white hover:bg-brand-600"
                        >
                          <Move3d className="size-4" />
                          {language === "bn" ? "৩ডি স্ক্যান দেখুন" : language === "hi" ? "3D स्कैन देखें" : "View 3D Scan"}
                        </Button>
                      </div>
                    </div>

                    {/* Visual Overlay Section */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                      <div className="lg:col-span-5">
                        <div className="overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-sm">
                          <div className="mb-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">
                              {language === "bn"
                                ? "হাতের রেখা স্ক্যান ভিউ"
                                : language === "hi"
                                  ? "हस्तरेखा स्कैन दृश्य"
                                  : "Traced Crease Overlay"}
                            </span>
                            {result.overlay_image && preview && (
                              <button
                                type="button"
                                onClick={() => setShowOverlay(!showOverlay)}
                                className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700"
                              >
                                <Eye className="size-3" />
                                {showOverlay
                                  ? language === "bn"
                                    ? "আসল ছবি"
                                    : "Show Original"
                                  : language === "bn"
                                    ? "স্ক্যান রেখা"
                                    : "Show Overlay"}
                              </button>
                            )}
                          </div>

                          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-ink-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={showOverlay && result.overlay_image ? result.overlay_image : preview || ""}
                              alt="Palm Analysis"
                              className="size-full object-contain"
                            />
                          </div>

                          <p className="mt-2.5 text-center text-[10px] text-muted-foreground">
                            {language === "bn"
                              ? "উচ্চ স্পষ্টতাসম্পন্ন গাবর ফিল্টার এবং ল্যান্ডমার্ক দ্বারা চিহ্নিত রেখা"
                              : "Precision Gabor valley filters and MediaPipe landmarks"}
                          </p>
                        </div>
                      </div>

                      {/* Crease Gauges Summary */}
                      <div className="space-y-3 lg:col-span-7">
                        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-extrabold text-foreground">
                              {t.creasesTitle}
                            </h3>
                            <span className="text-[11px] font-bold text-brand-700">
                              {result.creases.filter((c) => c.found).length +
                                (result.secondary_lines
                                  ? Object.values(result.secondary_lines).filter((c) => c.found).length
                                  : 0)}{" "}
                              {language === "bn" ? "টি রেখা চিহ্নিত" : "Traced Lines"}
                            </span>
                          </div>
                          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {[
                              ...result.creases,
                              ...(result.secondary_lines ? Object.values(result.secondary_lines) : []),
                            ].map((crease) => {
                              const theme = CREASE_THEME[crease.name] || CREASE_THEME.heart;
                              const Icon = theme.icon;
                              const localizedInfo = t.lines[crease.name as keyof typeof t.lines];
                              return (
                                <div
                                  key={crease.name}
                                  className={cn(
                                    "rounded-2xl border p-3.5 transition-all",
                                    crease.found ? theme.border : "border-border bg-surface-muted/60",
                                    crease.found ? theme.bg : "",
                                  )}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                      <Icon className={cn("size-3.5", theme.text)} />
                                      {localizedInfo?.name || crease.elemental_name}
                                    </span>
                                    {crease.found ? (
                                      <span
                                        className="rounded-md bg-white px-2 py-0.5 text-[10px] font-black text-foreground shadow-xs"
                                        title={t.contrastTooltip}
                                      >
                                        {crease.contrast.toFixed(1)}×
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-amber-700 font-semibold">
                                        {t.notClearLabel}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                    {localizedInfo?.desc}
                                  </p>
                                  {crease.termination_zone && (
                                    <span className="mt-2 inline-block rounded-md bg-white/80 px-2 py-0.5 text-[10px] font-bold text-ink-900">
                                      📍 {crease.termination_zone} {t.endsAtMount}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Top Highlights */}
                        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                            {language === "bn" ? "প্রধান বৈশিষ্ট্যসমূহ" : "Core Findings Summary"}
                          </h4>
                          <div className="mt-3 space-y-2.5">
                            {result.sections.slice(0, 4).map((sec) => (
                              <div
                                key={`${sec.feature}-${sec.option}`}
                                className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface-muted/40 p-3"
                              >
                                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-600" />
                                <div>
                                  <span className="text-xs font-bold text-foreground">
                                    {t.featureLabels[sec.feature] || sec.feature_label}: {sec.label}
                                  </span>
                                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                                    {sec.meaning}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Life Areas Detailed Grid */}
                    <div className="space-y-6 pt-4">
                      {byArea.map(([area, sections]) => (
                        <div
                          key={area}
                          className="rounded-3xl border border-border bg-surface-muted/40 p-5 sm:p-7 shadow-xs"
                        >
                          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                            <span className="size-2 rounded-full bg-brand-500" />
                            <h3 className="text-xs font-black uppercase tracking-wider text-brand-800">
                              {t.areas[area] || area}
                            </h3>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            {sections.map((section) => (
                              <article
                                key={`${section.feature}-${section.option}`}
                                className="flex flex-col justify-between rounded-2xl border border-border bg-white p-4.5 shadow-xs transition-shadow hover:shadow-sm"
                              >
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                                    {t.featureLabels[section.feature] || section.feature_label}
                                  </span>
                                  <h4 className="mt-0.5 text-sm font-black text-foreground">
                                    {section.label}
                                  </h4>
                                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                    {section.meaning}
                                  </p>
                                </div>

                                <div className="mt-4 border-t border-border/60 pt-3">
                                  {section.because.length > 0 && (
                                    <div className="rounded-xl bg-brand-50/60 p-2.5">
                                      <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                                        <Ruler className="size-3" />
                                        {t.measuredLabel}
                                      </p>
                                      <ul className="mt-1 space-y-0.5">
                                        {section.because.map((reason, index) => (
                                          <li
                                            key={index}
                                            className="text-[11px] font-medium text-brand-950"
                                          >
                                            {reason}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {section.source && (
                                    <p className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/75">
                                      <FileText className="size-3" />
                                      {section.source}
                                    </p>
                                  )}
                                </div>
                              </article>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Vedic Temperament Archetypes (Nature through palm.docx) */}
                {activeTab === "archetype" && (
                  <div className="space-y-6">
                    {/* Hero Archetype Card */}
                    {result.temperament_archetype ? (
                      <div className="overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-950 via-ink-950 to-brand-950 p-6 text-white shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-300">
                            <Compass className="size-3" />
                            {result.temperament_archetype.elemental_signature} Element Signature
                          </span>
                          <span className="text-xs font-bold text-white/70">
                            {language === "bn" ? "প্রকৃতি মিল" : "Affinity Match"}:{" "}
                            <strong className="text-brand-300 text-sm">
                              {result.temperament_archetype.affinity_score_pct}%
                            </strong>
                          </span>
                        </div>

                        <div className="mt-4">
                          <h3 className="text-2xl font-black text-white sm:text-3xl">
                            {result.temperament_archetype.primary_archetype}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-brand-300">
                            {result.temperament_archetype.vedic_archetype_name}
                          </p>
                          <p className="mt-3 text-xs leading-relaxed text-white/80 max-w-2xl">
                            {result.temperament_archetype.description}
                          </p>
                        </div>

                        {/* Vedic Strengths */}
                        {result.temperament_archetype.vedic_strengths?.length ? (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {result.temperament_archetype.vedic_strengths.map((str, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md"
                              >
                                <Sparkles className="size-3 text-brand-300" />
                                {str}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        {/* Growth Counsel Card */}
                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                            <div>
                              <h4 className="text-xs font-bold text-white">
                                {language === "bn" ? "আধ্যাত্মিক ও কর্মজীবনের নির্দেশিকা" : "Karmic Growth & Life Counsel"}
                              </h4>
                              <p className="mt-1 text-xs text-white/75 leading-relaxed">
                                {result.temperament_archetype.growth_counsel}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Secondary Affinity */}
                        {result.temperament_archetype.secondary_affinity && (
                          <div className="mt-4 flex items-center justify-between rounded-xl bg-black/30 px-4 py-2 text-xs">
                            <span className="text-white/70">
                              {language === "bn" ? "দ্বিতীয় প্রধান প্রভাব" : "Secondary Archetype Influence"}:{" "}
                              <strong className="text-white">
                                {result.temperament_archetype.secondary_affinity.title} (
                                {result.temperament_archetype.secondary_affinity.vedic_name})
                              </strong>
                            </span>
                            <span className="font-bold text-brand-300">
                              {result.temperament_archetype.secondary_affinity.affinity_pct}%
                            </span>
                          </div>
                        )}

                        <p className="mt-4 text-[10px] text-white/50 flex items-center gap-1 font-semibold">
                          <FileText className="size-3" />
                          {result.temperament_archetype.source}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-border bg-white p-6 text-center text-muted-foreground">
                        {language === "bn" ? "প্রকৃতি বিশ্লেষণ প্রস্তুত হচ্ছে..." : "Evaluating temperament archetype..."}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Authentic Marriage Cards (IMG_2718 - IMG_2729) */}
                {activeTab === "marriage" && (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-950 via-ink-950 to-purple-950 p-6 text-white shadow-xl">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-300 w-fit">
                          <Heart className="size-3" />
                          {language === "bn" ? "বৈদিক বিবাহ ও দাম্পত্য রেখা বিচার" : "Vedic Vivaha Rekha & Relationship Cards"}
                        </span>
                        <h3 className="text-xl font-black sm:text-2xl">
                          {language === "bn"
                            ? "বিবাহ ও জীবনসঙ্গী সম্বন্ধীয় শাস্ত্রীয় যোগ"
                            : language === "hi"
                              ? "विवाह एवं वैवाहिक जीवन के शास्त्रीय योग"
                              : "Soul Bonds, Marriage Lines & Partnership Destiny"}
                        </h3>
                        <p className="text-xs text-white/75 max-w-2xl leading-relaxed">
                          {language === "bn"
                            ? "বুধ পর্বতের নিম্নে বিবাহ রেখা, চন্দ্র থেকে ভাগ্যরেখায় মিলন এবং জীবনরেখা সহায়ক রেখার ১২টি প্রামাণ্য কার্ড বিশ্লেষণ।"
                            : "Direct analysis of the 12 authentic classical relationship configurations, Moon-to-Fate lines, and Mercury percussion creases."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(result.marriage_patterns || []).map((pat, idx) => (
                        <div
                          key={idx}
                          className="rounded-3xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-rose-200"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-bold text-rose-700">
                              <Heart className="size-3" />
                              Card #{pat.card_id} · {pat.category}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                                pat.auspicious ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"
                              )}
                            >
                              {pat.auspicious ? "Auspicious Union" : "Karmic Growth Phase"}
                            </span>
                          </div>

                          <h4 className="mt-3 text-base font-extrabold text-foreground">{pat.name}</h4>
                          <p className="text-xs font-semibold text-rose-600">{pat.vedic_title}</p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pat.description}</p>

                          {pat.remedy && (
                            <div className="mt-4 rounded-xl bg-surface-muted p-3 border border-border/60">
                              <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {language === "bn" ? "শাস্ত্রীয় প্রতিকার ও উপায়" : "Vedic Upaya / Remedy"}
                              </span>
                              <span className="mt-0.5 block text-xs font-semibold text-foreground">
                                {pat.remedy}
                              </span>
                            </div>
                          )}

                          <p className="mt-3 text-[10px] font-semibold text-muted-foreground/70 flex items-center gap-1">
                            <FileText className="size-3" />
                            Reference: {pat.image_ref}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Palmer Dermatoglyphic Loops (Loops.docx) */}
                {activeTab === "loops" && (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-950 via-ink-950 to-blue-950 p-6 text-white shadow-xl">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-300 w-fit">
                          <Waves className="size-3" />
                          {language === "bn" ? "হাতের চর্মরেখা লুপ ও প্যাটার্ন" : "Palmer Dermatoglyphics & Energy Loops"}
                        </span>
                        <h3 className="text-xl font-black sm:text-2xl">
                          {language === "bn"
                            ? "১১টি চর্মরেখা লুপের শক্তি সংমিশ্রণ"
                            : language === "hi"
                              ? "११ त्वचा-रेखा लूप और ऊर्जा संयोजन"
                              : "11 Palmer Dermatoglyphic Loops (Digito-Palmer Flows)"}
                        </h3>
                        <p className="text-xs text-white/75 max-w-2xl leading-relaxed">
                          {language === "bn"
                            ? "ক্লায়েন্টের Loops.docx নির্দেশিকা অনুসারে হাতের তালু ও আঙুলের সংযোগস্থলের প্রাকৃতিক লুপসমূহের পুঙ্খানুপুঙ্খ বিশ্লেষণ।"
                            : "Loops bind the energies of two fingers or mounts: Leisure (Mercury-Sun), Industry (Saturn), Raja Leadership (Jupiter), Sensitivity, and Courage."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(result.dermatoglyphic_loops || []).map((loop, idx) => (
                        <div
                          key={idx}
                          className="rounded-3xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-cyan-200"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-bold text-cyan-800">
                              <Waves className="size-3" />
                              {loop.category}
                            </span>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              {Math.round(loop.confidence * 100)}% Confidence
                            </span>
                          </div>

                          <h4 className="mt-3 text-base font-extrabold text-foreground">{loop.name}</h4>
                          <p className="text-xs font-semibold text-cyan-600">{loop.sanskrit_name}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground font-medium">
                            Location: {loop.location}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{loop.meaning}</p>

                          <p className="mt-3 text-[10px] font-semibold text-muted-foreground/70 flex items-center gap-1">
                            <FileText className="size-3" />
                            Citation: {loop.source}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Medical Chirology & Health (Health palmistry.docx) */}
                {activeTab === "medical" && (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-950 via-ink-950 to-teal-950 p-6 text-white shadow-xl">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300 w-fit">
                          <Activity className="size-3" />
                          {language === "bn" ? "শারীরিক স্বাস্থ্য ও আয়ুর্বেদিক বিচার" : "Medical Chirology & Ayurvedic Constitution"}
                        </span>
                        <h3 className="text-xl font-black sm:text-2xl">
                          {language === "bn"
                            ? "তালুর বর্ণ, সেরোটোনিন ও দৈহিক রোগপ্রতিরোধ ক্ষমতা"
                            : language === "hi"
                              ? "हथेली का रंग, सेरोटोनिन एवं स्वास्थ्य निदान"
                              : "Colorimetric Pallor, Neuro-Chemistry & Health Diagnostic"}
                        </h3>
                        <p className="text-xs text-white/75 max-w-2xl leading-relaxed">
                          {language === "bn"
                            ? "Health palmistry.docx ভিত্তিক রক্তসঞ্চালন, যকৃতের অবস্থা, সেরোটোনিন নিঃসরণ ও সংবেদনশীল অঙ্গের বিশ্লেষণ।"
                            : "Rigorous clinical chirology assessing palm flush pallor (Anemia, Pitta, Hypertension, Oxygenation), Serotonin balance, and Gut-Brain axis."}
                        </p>
                      </div>
                    </div>

                    {result.medical_constitution && (
                      <div className="space-y-4">
                        {/* Pallor & Agni Card */}
                        <div className="rounded-3xl border border-border bg-white p-6 shadow-xs">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                              <Activity className="size-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground">
                                {language === "bn" ? "তালুর বর্ণ ও বিপাকীয় লক্ষণ" : "Pallor Diagnosis & Metabolic State"}
                              </h4>
                              <p className="text-xs font-extrabold text-emerald-700">
                                {result.medical_constitution.pallor_diagnosis.state}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {result.medical_constitution.pallor_diagnosis.clinical_significance}
                          </p>
                          <div className="mt-3 rounded-xl bg-surface-muted p-3 border border-border">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {language === "bn" ? "আয়ুর্বেদিক প্রতিকার ও পথ্য" : "Ayurvedic Rasayana & Remedy"}
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-foreground">
                              {result.medical_constitution.pallor_diagnosis.ayurvedic_remedy}
                            </span>
                          </div>
                        </div>

                        {/* Serotonin & Neuro Axis Card */}
                        <div className="rounded-3xl border border-border bg-white p-6 shadow-xs">
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                              <Sparkles className="size-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground">
                                {language === "bn" ? "সেরোটোনিন ও মানসিক স্থিতি অক্ষ" : "Neuro-Serotonin Axis & Resilience"}
                              </h4>
                              <p className="text-xs font-extrabold text-purple-700">
                                {result.medical_constitution.neuro_serotonin_axis.status}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                            {result.medical_constitution.neuro_serotonin_axis.explanation}
                          </p>
                          <div className="mt-3 rounded-xl bg-surface-muted p-3 border border-border">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {language === "bn" ? "সেরোটোনিন উদ্দীপক বৈদিক উপায়" : "Vedic Neuro-Upaya"}
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-foreground">
                              {result.medical_constitution.neuro_serotonin_axis.vedic_neuro_upaya}
                            </span>
                          </div>
                        </div>

                        {/* Organ Sensitivities Grid */}
                        <div className="rounded-3xl border border-border bg-white p-6 shadow-xs">
                          <h4 className="text-sm font-bold text-foreground mb-3">
                            {language === "bn" ? "সংবেদনশীল অঙ্গ ও প্রতিবর্ত রেখা" : "Organ Meridian Sensitivities"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {result.medical_constitution.organ_sensitivities?.map((org, i) => (
                              <div key={i} className="rounded-2xl border border-border bg-surface-muted/50 p-3.5">
                                <span className="block text-xs font-extrabold text-foreground">{org.organ}</span>
                                <span className="block text-[10px] text-brand-600 font-bold">{org.marker}</span>
                                <span className="mt-1 block text-[11px] text-muted-foreground">{org.advice}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Nail & Minerals */}
                        <div className="rounded-3xl border border-border bg-white p-6 shadow-xs">
                          <h4 className="text-sm font-bold text-foreground mb-3">
                            {language === "bn" ? "নখের লক্ষণ ও খনিজ সূচক" : "Nail & Mineral Diagnostics"}
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {Object.entries(result.medical_constitution.nail_mineral_diagnostics || {}).map(([k, v]) => (
                              <div key={k} className="rounded-xl border border-border bg-surface-muted/40 p-3">
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {k.replace(/_/g, " ")}
                                </span>
                                <span className="mt-1 block text-xs font-semibold text-foreground">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Kundli-Palm Planetary Synchronization */}
                {activeTab === "kundli_sync" && (
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-950 via-ink-950 to-orange-950 p-6 text-white shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">
                          <Sun className="size-3" />
                          {language === "bn" ? "কুণ্ডলী ও হস্তরেখা ঐক্যবদ্ধ সংমিশ্রণ" : "Kundli-Palm Planetary Synchronization"}
                        </span>
                        <span className="text-xs font-bold text-white/70">
                          {language === "bn" ? "ঐক্যবদ্ধ সামঞ্জস্য" : "Concordance"}:{" "}
                          <strong className="text-amber-300 text-sm">
                            {result.kundli_palm_sync?.overall_alignment_pct ?? 91}%
                          </strong>
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-white sm:text-2xl">
                        {language === "bn"
                          ? "৯টি গ্রহের অবস্থান ও ৭টি পর্বত উচ্চতার পারস্পরিক যোগ"
                          : language === "hi"
                            ? "९ ग्रहों की स्थिति एवं ७ पर्वतों का समन्वय"
                            : "9 Grahas Aligned with 7 Palm Mount Topographies"}
                      </h3>
                      <p className="mt-2 text-xs text-white/80 max-w-2xl leading-relaxed">
                        {result.kundli_palm_sync?.karmic_harmony_verdict}
                      </p>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          {language === "bn" ? "সার্বজনীন প্রধান প্রতিকার" : "Master Astrological Remedy"}
                        </span>
                        <p className="mt-1 text-xs text-white/85 leading-relaxed font-semibold">
                          {result.kundli_palm_sync?.master_remedy}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(result.kundli_palm_sync?.planets || []).map((pl, idx) => (
                        <div
                          key={idx}
                          className="rounded-3xl border border-border bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-amber-200"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-base font-extrabold text-foreground">
                              {pl.graha} ({pl.english_name})
                            </span>
                            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                              {pl.alignment_pct}% Match
                            </span>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground font-medium">
                            <span>Mount: {pl.palm_mount}</span>
                            <span className="font-bold text-foreground">{pl.elevation_mm} mm</span>
                          </div>

                          <div className="mt-2">
                            <span className="inline-block rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-bold text-brand-700">
                              {pl.manifestation_potency}
                            </span>
                          </div>

                          <div className="mt-4 border-t border-border/60 pt-3 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-[11px]">Gemstone:</span>
                              <span className="font-bold text-foreground text-[11px]">{pl.gemstone_upaya}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-muted-foreground">Mantra:</span>
                              <span className="block text-[10px] font-mono text-ink-950 font-semibold bg-surface-muted p-1.5 rounded-lg mt-0.5">
                                {pl.vedic_mantra}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Chronological Age Timeline (আয়ু ও জীবনরেখা কালক্রম) */}
                {activeTab === "timeline" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-950 via-ink-950 to-brand-950 p-6 text-white shadow-lg">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-300 w-fit">
                          <Clock className="size-3" />
                          {language === "bn" ? "সমুদ্রিক শাস্ত্রীয় আয়ু নির্ণয়" : "Samudrika Shastra Chronological Timeline"}
                        </span>
                        <h3 className="text-xl font-black sm:text-2xl">
                          {language === "bn"
                            ? "জীবন ও ভাগ্যরেখা ভিত্তিক কালানুক্রমিক জীবনচক্র"
                            : language === "hi"
                              ? "जीवन एवं भाग्य रेखा आधारित कालक्रम"
                              : "Age Milestones & Vitality Timeline"}
                        </h3>
                        <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
                          {language === "bn"
                            ? "জীবনরেখার প্রারম্ভ (বৃদ্ধাঙ্গুলি ও তর্জনীর মধ্যস্থল) থেকে মণিবন্ধ এবং ভাগ্যরেখার বিস্তার পরিমাপ করে ৬টি বয়সের গুরুত্বপূর্ণ সন্ধিক্ষণ নির্ধারণ করা হয়েছে।"
                            : "Proportional projection along the Life corridor and central Saturn axis divides your life path into 6 distinct karmic epochs."}
                        </p>
                      </div>
                    </div>

                    {result.timeline && result.timeline.length > 0 ? (
                      <div className="space-y-6">
                        {/* Interactive Age Selector */}
                        <div className="rounded-3xl border border-border bg-white p-6 shadow-xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-brand-700">
                                {language === "bn" ? "ইন্টারেক্টিভ বয়স নির্দেশক" : "Interactive Age Selector"}
                              </span>
                              <h4 className="text-base font-black text-foreground">
                                {language === "bn" ? "বয়স নির্বাচন করুন:" : "Select an Age Epoch:"}{" "}
                                <span className="text-brand-600 font-extrabold">{selectedAge} {language === "bn" ? "বছর" : "Years"}</span>
                              </h4>
                            </div>

                            {/* Milestone Quick Buttons */}
                            <div className="flex flex-wrap gap-2">
                              {result.timeline.map((m) => (
                                <button
                                  key={m.age}
                                  type="button"
                                  onClick={() => setSelectedAge(m.age)}
                                  className={cn(
                                    "rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
                                    selectedAge === m.age
                                      ? "bg-brand-500 text-white shadow-sm scale-105"
                                      : "bg-surface-muted text-muted-foreground hover:bg-brand-50 hover:text-brand-700",
                                  )}
                                >
                                  {m.age} {language === "bn" ? "বছর" : "yrs"}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Range Slider */}
                          <div className="space-y-2 pt-2">
                            <input
                              type="range"
                              min={18}
                              max={75}
                              value={selectedAge}
                              onChange={(e) => setSelectedAge(Number(e.target.value))}
                              className="w-full accent-brand-500 cursor-pointer h-2 bg-brand-100 rounded-lg appearance-none"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                              <span>18 {language === "bn" ? "বছর (কৈশোর)" : "yrs"}</span>
                              <span>35 {language === "bn" ? "বছর (যৌবন)" : "yrs"}</span>
                              <span>50 {language === "bn" ? "বছর (প্রৌঢ়)" : "yrs"}</span>
                              <span>75+ {language === "bn" ? "বছর (বার্ধক্য)" : "yrs"}</span>
                            </div>
                          </div>

                          {/* Selected Age Milestone Details */}
                          {(() => {
                            // Find closest milestone
                            const activeMilestone = result.timeline.reduce((prev, curr) =>
                              Math.abs(curr.age - selectedAge) < Math.abs(prev.age - selectedAge) ? curr : prev,
                            );
                            return (
                              <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50/50 p-5 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-brand-500 text-white px-3 py-1 text-xs font-black">
                                      {activeMilestone.age_range}
                                    </span>
                                    <span className="text-xs font-bold text-brand-900">
                                      {activeMilestone.phase}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-muted-foreground">
                                      {language === "bn" ? "জীবনীশক্তি অনুপাত:" : "Vitality Ratio:"}
                                    </span>
                                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                                      {activeMilestone.vitality_pct}%
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <h5 className="text-sm font-black text-foreground">
                                    {language === "bn" ? "প্রধান কেন্দ্রবিন্দু:" : "Core Focus:"} {activeMilestone.focus}
                                  </h5>
                                  <p className="text-xs leading-relaxed text-muted-foreground">
                                    {activeMilestone.forecast}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 border-t border-brand-200/60 pt-3 text-[11px] text-muted-foreground">
                                  <span className="font-semibold">
                                    📍 {language === "bn" ? "নিয়ামক রেখা:" : "Governing Axis:"} {activeMilestone.primary_line}
                                  </span>
                                  <span>•</span>
                                  <span className="font-semibold text-emerald-700">
                                    {activeMilestone.auspicious
                                      ? language === "bn" ? "✓ শুভ ফলদায়ক সময়কাল" : "Auspicious Phase"
                                      : language === "bn" ? "সতর্কতা ও আত্মশুদ্ধি প্রয়োজন" : "Caution Recommended"}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Full Chronological Milestones Grid */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-700">
                            {language === "bn" ? "পূর্ণ ৬টি পর্যায়ক্রমিক কালচক্র" : "All 6 Chronological Epochs"}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.timeline.map((m) => (
                              <div
                                key={m.age}
                                onClick={() => setSelectedAge(m.age)}
                                className={cn(
                                  "cursor-pointer rounded-3xl border p-5 transition-all shadow-xs",
                                  selectedAge === m.age
                                    ? "border-brand-500 bg-brand-50/70 shadow-md ring-2 ring-brand-300"
                                    : "border-border bg-white hover:border-brand-300 hover:bg-surface-muted/50",
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="rounded-full bg-brand-100 text-brand-800 px-2.5 py-0.5 text-[11px] font-black">
                                    {m.age_range}
                                  </span>
                                  <span className="text-[11px] font-bold text-emerald-700">
                                    {m.vitality_pct}% {language === "bn" ? "প্রাণশক্তি" : "Vitality"}
                                  </span>
                                </div>
                                <h5 className="mt-2 text-sm font-black text-foreground">
                                  {m.phase}
                                </h5>
                                <p className="mt-1 text-[11px] font-semibold text-brand-700">
                                  {m.focus}
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                                  {m.forecast}
                                </p>
                                <div className="mt-3 border-t border-border/50 pt-2 text-[10px] text-muted-foreground flex justify-between">
                                  <span>{m.primary_line}</span>
                                  <span className="font-bold text-brand-600">
                                    {selectedAge === m.age ? "✓ নির্বাচিত" : "নির্বাচন করুন →"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-8 text-center text-xs text-muted-foreground">
                        {language === "bn"
                          ? "জীবনরেখার স্পষ্টতার অভাবে কালানুক্রমিক কালচক্র নির্ধারণ করা যায়নি।"
                          : "Timeline milestones require a distinct Life or Fate line corridor."}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Sacred Marks & Auspicious Yogas (পবিত্র বৈদিক শুভ যোগ ও চিহ্ন) */}
                {activeTab === "sacred_marks" && (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-600 via-brand-600 to-amber-700 p-6 text-white shadow-lg">
                      <div className="flex flex-col gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-100 w-fit">
                          <Gem className="size-3 text-amber-200" />
                          {language === "bn" ? "পবিত্র সমুদ্রিক লক্ষণ" : "Authentic Vedic Sacred Signs"}
                        </span>
                        <h3 className="text-xl font-black sm:text-2xl">
                          {language === "bn"
                            ? "তালুর পবিত্র শুভ যোগ ও দুর্লভ ঈশ্বরীয় চিহ্ন"
                            : language === "hi"
                              ? "हथेली के पवित्र शुभ चिह्न एवं राजयोग"
                              : "Sacred Marks & Auspicious Vedic Yogas"}
                        </h3>
                        <p className="text-xs text-amber-100/90 max-w-2xl leading-relaxed">
                          {language === "bn"
                            ? "প্রাচীন সমুদ্রিক শাস্ত্র অনুসারে হাতের তালুতে বিশেষ জ্যামিতিক রেখা সংযোগে গঠিত গুপ্ত চতুষ্কোণ, ত্রিশূল, মৎস্য এবং রক্ষা কবচ জাতকের পূর্বজন্মের পুণ্যফল ও দৈব আশীর্বাদ নির্দেশ করে।"
                            : "Vedic Chiromancy identifies divine geometric formations—the Mystic Cross, Shiva Trishula, Matsya, and Protective Square—as signatures of spiritual evolution and divine protection."}
                        </p>
                      </div>
                    </div>

                    {result.sacred_marks && result.sacred_marks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {result.sacred_marks.map((mark) => (
                          <div
                            key={mark.id}
                            className={cn(
                              "relative overflow-hidden rounded-3xl border p-6 transition-all shadow-xs",
                              mark.found
                                ? "border-amber-300 bg-gradient-to-b from-white via-amber-50/20 to-amber-50/50 shadow-sm"
                                : "border-border bg-surface-muted/40 opacity-70",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-700">
                                  <Sparkles className="size-3 text-amber-600" />
                                  {mark.sanskrit_name}
                                </span>
                                <h4 className="text-lg font-black text-foreground">
                                  {mark.name}
                                </h4>
                              </div>

                              <span
                                className={cn(
                                  "rounded-full px-3 py-1 text-[11px] font-black",
                                  mark.found
                                    ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs"
                                    : "bg-surface text-muted-foreground border border-border",
                                )}
                              >
                                {mark.found
                                  ? language === "bn" ? "✓ সনাক্ত হয়েছে" : "Found"
                                  : language === "bn" ? "সুপ্ত বা অনুপস্থিত" : "Not Present"}
                              </span>
                            </div>

                            <div className="mt-3.5 space-y-2">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-bold text-muted-foreground">
                                  {language === "bn" ? "প্রকৃতি ও বিরলতা:" : "Rarity Index:"}
                                </span>
                                <span className="font-black text-amber-800">
                                  {mark.rarity}
                                </span>
                              </div>

                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {mark.significance}
                              </p>
                            </div>

                            <div className="mt-4 border-t border-amber-200/60 pt-3 flex items-center justify-between text-[11px]">
                              <span className="font-mono text-muted-foreground">
                                📍 {language === "bn" ? "তালু স্থানাঙ্ক:" : "Coords:"} [{mark.location_norm.map((n) => n.toFixed(2)).join(", ")}]
                              </span>
                              <span className="font-bold text-amber-700">
                                {mark.auspicious ? "★ পরম কল্যাণকর যোগ" : "নিরীক্ষণাধীন"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-8 text-center text-xs text-muted-foreground">
                        {language === "bn"
                          ? "এই ফটোতে কোনো বিশেষ বৈদিক চিহ্ন স্পষ্টভাবে ধরা পড়েনি।"
                          : "No distinct sacred marks were visible at this resolution."}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: 3D Palm Scan & Topography */}
                {activeTab === "scan3d" && (
                  <div className="space-y-6">
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

                    {/* 3D Reading Findings Sections */}
                    {result.sections.filter((s) =>
                      ["mounts_3d", "finger_flexibility_3d", "palm_hollow_3d"].includes(s.feature),
                    ).length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-black text-foreground">
                          {language === "bn"
                            ? "ত্রিমাত্রিক পরিমাপভিত্তিক শাস্ত্রীয় ফলাফল"
                            : language === "hi"
                              ? "3D माप आधारित शास्त्रीय निष्कर्ष"
                              : "3D Metric-Derived Interpretations"}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          {result.sections
                            .filter((s) =>
                              ["mounts_3d", "finger_flexibility_3d", "palm_hollow_3d"].includes(s.feature),
                            )
                            .map((section, idx) => (
                              <article
                                key={idx}
                                className="flex flex-col justify-between rounded-3xl border border-brand-200/80 bg-surface p-5 shadow-sm transition-all hover:border-brand-400"
                              >
                                <div className="space-y-2.5">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-700">
                                      {t.featureLabels[section.feature] ?? section.feature_label}
                                    </span>
                                    {section.area && (
                                      <span className="text-[10px] font-semibold text-muted-foreground">
                                        {t.areas[section.area] ?? section.area}
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="text-base font-black text-foreground">
                                    {section.label}
                                  </h4>

                                  <p className="text-xs leading-relaxed text-muted-foreground">
                                    {section.meaning}
                                  </p>
                                </div>

                                <div className="mt-4 border-t border-border/60 pt-3 text-[10px]">
                                  {section.because.length > 0 && (
                                    <p className="font-mono text-muted-foreground">
                                      <span className="font-bold text-foreground">
                                        {t.measuredLabel}:
                                      </span>{" "}
                                      {section.because.join(", ")}
                                    </p>
                                  )}
                                  {section.source && (
                                    <p className="mt-1 text-muted-foreground/80">
                                      <span className="font-semibold">{t.sourceDocLabel}:</span>{" "}
                                      {section.source}
                                    </p>
                                  )}
                                </div>
                              </article>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab: Lines */}
                {activeTab === "lines" && (
                  <div className="space-y-6">
                    {/* Secondary Lines Spotlight */}
                    {result.secondary_lines && Object.values(result.secondary_lines).some((l) => l.found) && (
                      <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs">
                        <div className="flex items-center gap-2 border-b border-amber-200/70 pb-3">
                          <Sparkles className="size-4 text-amber-600" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                            {language === "bn" ? "চিহ্নিত অপ্রধান ও বিশেষ রেখাসমূহ" : "Traced Secondary & Auxiliary Creases"}
                          </h4>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {Object.values(result.secondary_lines)
                            .filter((l) => l.found)
                            .map((line) => {
                              const theme = CREASE_THEME[line.name] || CREASE_THEME.sun;
                              const Icon = theme.icon;
                              const localized = t.lines[line.name as keyof typeof t.lines];
                              return (
                                <div
                                  key={line.name}
                                  className="rounded-2xl border border-amber-200/80 bg-white p-4 shadow-xs"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                                      <Icon className={cn("size-3.5", theme.text)} />
                                      {localized?.name || line.elemental_name}
                                    </span>
                                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-900">
                                      {line.contrast.toFixed(1)}×
                                    </span>
                                  </div>
                                  <p className="mt-2 text-xs text-muted-foreground">
                                    {localized?.desc}
                                  </p>
                                  {line.termination_zone && (
                                    <span className="mt-2 inline-block text-[10px] font-bold text-amber-800">
                                      📍 {line.termination_zone} {t.endsAtMount}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {categorized.lines.map((section) => (
                        <article
                          key={`${section.feature}-${section.option}`}
                          className="rounded-3xl border border-border bg-white p-6 shadow-xs"
                        >
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-600">
                            {t.featureLabels[section.feature] || section.feature_label}
                          </span>
                          <h4 className="mt-1 text-base font-black text-foreground">
                            {section.label}
                          </h4>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {section.meaning}
                          </p>
                          {section.because.length > 0 && (
                            <div className="mt-4 rounded-xl bg-brand-50/70 p-3">
                              <span className="text-[10px] font-bold text-brand-800 uppercase">
                                {t.measuredLabel}
                              </span>
                              <p className="mt-0.5 text-xs font-semibold text-brand-950">
                                {section.because.join(", ")}
                              </p>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Forecasts */}
                {activeTab === "forecasts" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {categorized.forecasts.map((section) => (
                        <article
                          key={`${section.feature}-${section.option}`}
                          className="rounded-3xl border border-brand-200/80 bg-gradient-to-b from-white to-brand-50/40 p-6 shadow-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-brand-600" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-brand-700">
                              {t.featureLabels[section.feature] || section.feature_label}
                            </span>
                          </div>
                          <h4 className="mt-2 text-base font-black text-foreground">
                            {section.label}
                          </h4>
                          <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                            {section.meaning}
                          </p>
                          {section.source && (
                            <p className="mt-4 text-[10px] font-semibold text-muted-foreground/80">
                              • {section.source}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab: Details & Geometry */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="rounded-3xl border border-border bg-white p-6 shadow-xs">
                      <h3 className="text-sm font-black text-foreground">
                        {language === "bn" ? "তালুর পুঙ্খানুপুঙ্খ গাণিতিক অনুপাত" : "Hand Geometry Ratios"}
                      </h3>
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(result.measurements).map(([key, val]) => (
                          <div
                            key={key}
                            className="rounded-2xl border border-border bg-surface-muted/50 p-3"
                          >
                            <span className="block text-[10px] font-bold text-muted-foreground uppercase">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="text-sm font-black text-foreground">
                              {typeof val === "number" ? val.toFixed(3) : val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Not Assessed Disclaimer */}
                {result.skipped.length > 0 && (
                  <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                      <Info className="size-4 shrink-0 text-muted-foreground" />
                      {t.notAssessedTitle}
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {t.notAssessedSubtitle}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {result.skipped.map((item, index) => (
                        <li key={index} className="rounded-xl bg-surface-muted px-3.5 py-2.5">
                          <span className="text-xs font-bold text-foreground">
                            {item.feature_label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">
                            {item.reason}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <div className="text-center text-[11px] text-muted-foreground">
                  {t.scanSpeedFooter}: {Math.round(result.processing_ms)} ms
                  {result.coins_charged > 0 && ` · ${result.coins_charged} coins`}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={palmFeature?.name || (language === "bn" ? "পাম রিডিং" : "Palm Reading")}
        requiredCoins={palmFeature?.coins ?? 25}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </>
  );
}
