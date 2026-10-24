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
  AlertTriangle,
  Camera,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Flame,
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
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Waves,
  Wind,
  XCircle,
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
import type {
  PalmReadingAvailability,
  PalmScanResponse,
} from "@/types";

const CREASE_THEME: Record<
  string,
  { color: string; border: string; bg: string; text: string; icon: typeof Heart }
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
};

export default function PalmReadingPage() {
  const { isSignedIn } = useAuth();

  const [language, setLanguage] = React.useState<PalmLanguage>("bn");
  const t = PALM_TRANSLATIONS[language];

  const [availability, setAvailability] = React.useState<PalmReadingAvailability | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState<PalmScanResponse | null>(null);
  const [activeTab, setActiveTab] = React.useState<"overview" | "scan3d" | "lines" | "forecasts" | "details">("overview");
  const [showOverlay, setShowOverlay] = React.useState(true);

  const fileInput = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  // --- live camera ------------------------------------------------------
  const [cameraOn, setCameraOn] = React.useState(false);
  const [cameraError, setCameraError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<PalmStatus | null>(null);
  const [holdProgress, setHoldProgress] = React.useState(0);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const overlayRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const capturingRef = React.useRef(false);
  const alignedSinceRef = React.useRef<number | null>(null);

  const HOLD_MS = 600; // Calibrated for responsive, smooth capture

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
    alignedSinceRef.current = null;
    setHoldProgress(0);
    setStatus(null);
    setCameraOn(false);
  }, []);

  React.useEffect(() => stopCamera, [stopCamera]);

  const scanBlob = React.useCallback(async (blob: Blob, previewUrl: string) => {
    setPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return previewUrl;
    });
    setResult(null);
    setScanning(true);
    try {
      const response = await palmReadingApi.scan(blob);
      setResult(response);
      if (response.status === "ok") {
        toast.success(
          language === "bn"
            ? `${response.sections.length}টি গভীর বিশ্লেষণ সম্পন্ন হয়েছে!`
            : language === "hi"
              ? `${response.sections.length} विश्लेषण सफलतापूर्वक प्राप्त हुए!`
              : `${response.sections.length} detailed findings identified from your palm.`,
        );
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          120,
        );
      } else {
        toast.info(response.message || t.rejectedTitle);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The scan could not be completed.");
    } finally {
      setScanning(false);
      capturingRef.current = false;
    }
  }, [language, t.rejectedTitle]);

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

          if (next.aligned) {
            if (alignedSinceRef.current === null) alignedSinceRef.current = performance.now();
            const held = performance.now() - alignedSinceRef.current;
            setHoldProgress(Math.min(1, held / HOLD_MS));

            if (held >= HOLD_MS && !capturingRef.current) {
              capturingRef.current = true;
              setHoldProgress(1);
              const blob = await captureFrame(element);
              stopCamera();
              await scanBlob(blob, URL.createObjectURL(blob));
              return;
            }
          } else {
            alignedSinceRef.current = null;
            setHoldProgress(0);
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
        toast.success(
          language === "bn"
            ? `${response.sections.length}টি গভীর বিশ্লেষণ সম্পন্ন হয়েছে!`
            : language === "hi"
              ? `${response.sections.length} विश्लेषण प्राप्त हुए!`
              : `${response.sections.length} findings from your palm.`,
        );
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          120,
        );
      } else {
        toast.info(response.message || t.rejectedTitle);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The scan could not be completed.");
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
      ["heart_line", "head_line", "life_line", "fate_line", "line_relationship"].includes(s.feature),
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
          "line_relationship",
          "career_forecast",
          "relationship_forecast",
          "health_forecast",
          "hand_type",
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
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-ink-950">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className="block max-h-[70vh] w-full object-contain"
                    />
                    <canvas
                      ref={overlayRef}
                      className="pointer-events-none absolute inset-0 size-full object-contain"
                    />

                    {/* Framing guide ring */}
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-[12%] rounded-[36px] border-2 border-dashed transition-colors duration-300",
                        status?.aligned ? "border-emerald-400" : "border-white/35",
                      )}
                    />

                    {/* Guidance pill */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                      <div
                        className={cn(
                          "mx-auto flex max-w-sm items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur-md transition-colors",
                          status?.aligned ? "bg-emerald-600/90" : "bg-ink-950/80",
                        )}
                      >
                        {status?.aligned ? (
                          <CheckCircle2 className="size-4 shrink-0 text-white" />
                        ) : (
                          <Hand className="size-4 shrink-0 text-white/80" />
                        )}
                        <span className="text-xs font-bold text-white">
                          {status?.guidance ?? t.lookingForHand}
                        </span>
                        {status?.handedness && (
                          <span className="ml-auto shrink-0 text-[10px] font-semibold text-white/80">
                            {status.handedness === "Left" ? t.leftHand : t.rightHand}
                          </span>
                        )}
                      </div>

                      {holdProgress > 0 && (
                        <div className="mx-auto mt-2 h-1.5 max-w-sm overflow-hidden rounded-full bg-white/25">
                          <div
                            className="h-full rounded-full bg-emerald-400 transition-[width] duration-100"
                            style={{ width: `${holdProgress * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual trigger button: always available */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <Button
                      onClick={async () => {
                        const element = videoRef.current;
                        if (!element || capturingRef.current) return;
                        capturingRef.current = true;
                        const blob = await captureFrame(element);
                        stopCamera();
                        await scanBlob(blob, URL.createObjectURL(blob));
                      }}
                      disabled={scanning}
                      className="gap-2 bg-emerald-600 font-bold hover:bg-emerald-700"
                    >
                      <Camera className="size-4" />
                      {t.captureNow}
                    </Button>
                    <Button variant="outline" onClick={stopCamera} disabled={scanning}>
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
                    disabled={scanning}
                    className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/50 p-10 transition-all hover:bg-brand-50 disabled:opacity-60"
                  >
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-400 text-ink-950 shadow-sm">
                      <Camera className="size-6" />
                    </span>
                    <span className="text-base font-bold text-foreground">
                      {t.scanWithCamera}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t.scanCameraSubtitle}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={scanning}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface-muted py-3.5 text-xs font-bold text-foreground transition-colors hover:bg-surface disabled:opacity-60"
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
                    { id: "scan3d", label: t.tabs.scan3d, icon: Move3d },
                    { id: "lines", label: t.tabs.lines, icon: Waves },
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
                          <h3 className="text-sm font-extrabold text-foreground">
                            {t.creasesTitle}
                          </h3>
                          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                            {result.creases.map((crease) => {
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

      <SiteFooter />
    </>
  );
}
