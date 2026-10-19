"use client";

/**
 * Face reading — with real-time biometric alignment guidance, progress ring,
 * laser scanline animation, and auto-capture.
 *
 * Flow:
 * 1. User opens camera → live mirrored feed inside a biometric oval guide.
 * 2. Visual guide lines indicate:
 *    - Eye level guideline ("── Eye Level ──")
 *    - Center vertical alignment axis
 *    - Chin placement curve
 * 3. Every ~80ms we run a lightweight face detection (VIDEO mode) and provide:
 *    - Real-time status: "Look straight", "Move closer", "Keep head level", etc.
 *    - Dynamic border color: White (searching) → Amber (adjusting) → Radiant Green (aligned).
 *    - Animated green laser scan beam across the face.
 *    - Real-time circular progress ring (0% → 100%) as the face remains aligned.
 * 4. When quality ≥ 0.60 for ~1.2s straight, auto-capture snaps the frame with
 *    a camera flash effect, calculates Samudrik Shastra proportions, and submits.
 * 5. While reading, an immersive Vedic analysis view with step-by-step progress
 *    is displayed.
 * 6. Privacy: Photo is processed client-side only — only ~20 ratios are transmitted.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Camera,
  Check,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ScanFace,
  Sparkles,
  Upload,
  UserCheck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert, Button, LoadingBlock } from "@/components/ui";
import { faceReadingApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import {
  NoFaceError,
  measureImage,
  detectFromVideo,
  type MeasureResult,
  type LiveFaceStatus,
} from "@/lib/face-measure";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { FaceReading } from "@/types";

type Stage = "intro" | "capturing" | "measuring" | "reading";

/** How long quality must stay ≥ GOOD_QUALITY before auto-capture (ms). */
const HOLD_DURATION_MS = 1200;
/** Quality threshold to start counting the hold-still timer. */
const GOOD_QUALITY = 0.60;
/** Target detection interval (ms) — ~12 fps, light on CPU. */
const DETECT_INTERVAL_MS = 80;

export default function FaceReadingPage() {
  const { isSignedIn } = useAuth();
  const [stage, setStage] = React.useState<Stage>("intro");
  const [reading, setReading] = React.useState<FaceReading | null>(null);

  const { data: availability, isLoading } = useQuery({
    queryKey: ["face-reading", "availability"],
    queryFn: () => faceReadingApi.availability(),
    enabled: isSignedIn,
  });

  const submit = useMutation({
    mutationFn: (m: MeasureResult) => faceReadingApi.submit(m.measurements, m.quality),
    onSuccess: (result) => {
      setReading(result);
      setStage("reading");
    },
    onError: (e: ApiError) => {
      toast.error(e.message || "Face reading failed. Please try again.");
      setStage("intro");
    },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="text-center">
          <span className="medallion mx-auto flex size-16 items-center justify-center rounded-full shadow-glow">
            <ScanFace className="size-8 text-brand-900" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
            Samudrik Shastra Face Reading
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">
            Ancient Vedic physiognomy reads your character, strengths, and destiny in the
            classical proportions of your forehead, eyes, nose, lips, and jawline.
          </p>
        </header>

        {!isSignedIn ? (
          <div className="card-surface mt-8 p-8 text-center">
            <p className="text-muted-foreground">Sign in to have your face read.</p>
            <Link href="/login?next=/face-reading" className="mt-5 inline-block">
              <Button>Sign in</Button>
            </Link>
          </div>
        ) : isLoading ? (
          <LoadingBlock />
        ) : !availability?.enabled ? (
          <Alert tone="info" className="mt-8">
            Face reading is not available at the moment.
          </Alert>
        ) : stage === "reading" && reading ? (
          <Reading reading={reading} onAgain={() => { setReading(null); setStage("intro"); }} />
        ) : stage === "measuring" || submit.isPending ? (
          <MeasuringView />
        ) : (
          <Capture
            coins={availability.coins}
            canAfford={availability.can_afford}
            balance={availability.balance_coins}
            busy={submit.isPending}
            onMeasuring={() => setStage("measuring")}
            onMeasured={(m) => submit.mutate(m)}
            onCancelled={() => setStage("intro")}
          />
        )}
      </main>
      <SiteFooter />
    </>
  );
}

/* --------------------------------------------------------------- capture */
function Capture({
  coins,
  canAfford,
  balance,
  busy,
  onMeasuring,
  onMeasured,
  onCancelled,
}: {
  coins: number;
  canAfford: boolean;
  balance: number;
  busy: boolean;
  onMeasuring: () => void;
  onMeasured: (m: MeasureResult) => void;
  onCancelled: () => void;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animFrameRef = React.useRef<number>(0);
  const holdStartRef = React.useRef<number>(0);
  const capturingRef = React.useRef(false);

  const [live, setLive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [modelLoading, setModelLoading] = React.useState(false);
  const [flashActive, setFlashActive] = React.useState(false);

  // Real-time feedback state
  const [faceStatus, setFaceStatus] = React.useState<LiveFaceStatus | null>(null);
  /** 0→1, progress of hold-still timer. */
  const [holdProgress, setHoldProgress] = React.useState(0);

  const stopCamera = React.useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = 0;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    capturingRef.current = false;
    setLive(false);
    setFaceStatus(null);
    setHoldProgress(0);
    holdStartRef.current = 0;
  }, []);

  React.useEffect(() => stopCamera, [stopCamera]);

  // Capture current frame and submit
  const doCapture = React.useCallback(async () => {
    if (!videoRef.current || capturingRef.current) return;
    capturingRef.current = true;

    // Flash animation
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 260);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    onMeasuring();
    try {
      const result = await measureImage(canvas);
      if (result.warning && result.quality < 0.55) {
        setError(result.warning);
        capturingRef.current = false;
        holdStartRef.current = 0;
        setHoldProgress(0);
        onCancelled();
        runDetectionLoop();
        return;
      }
      stopCamera();
      onMeasured(result);
    } catch (e) {
      setError(
        e instanceof NoFaceError
          ? e.message
          : "Could not clearly measure your face. Please ensure good lighting and look straight ahead.",
      );
      capturingRef.current = false;
      holdStartRef.current = 0;
      setHoldProgress(0);
      onCancelled();
      runDetectionLoop();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMeasuring, onMeasured, onCancelled, stopCamera]);

  // ─── real-time detection loop ───
  const runDetectionLoop = React.useCallback(() => {
    let lastDetect = 0;

    const loop = async () => {
      if (!videoRef.current || capturingRef.current || videoRef.current.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      if (now - lastDetect < DETECT_INTERVAL_MS) {
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }
      lastDetect = now;

      try {
        const status = await detectFromVideo(videoRef.current, now);
        if (capturingRef.current) return;

        setFaceStatus(status);

        if (status.detected && status.quality >= GOOD_QUALITY && !status.warning) {
          // Face is well-aligned — advance hold countdown
          if (holdStartRef.current === 0) holdStartRef.current = now;
          const elapsed = now - holdStartRef.current;
          const progress = Math.min(1, elapsed / HOLD_DURATION_MS);
          setHoldProgress(progress);

          if (progress >= 1) {
            // Auto-capture!
            await doCapture();
            return;
          }
        } else {
          // Alignment broke — reset hold timer
          holdStartRef.current = 0;
          setHoldProgress(0);
        }
      } catch {
        // Skip occasional frame glitch
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, [doCapture]);

  async function startCamera() {
    setError(null);
    try {
      setModelLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setLive(true);
      runDetectionLoop();
    } catch {
      setError(
        "Could not access the camera. Please allow camera permissions, or upload a clear frontal photo instead.",
      );
    } finally {
      setModelLoading(false);
    }
  }

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = new Image();
    image.onload = () => {
      void measureFromImage(image);
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => setError("That file could not be opened as an image.");
    image.src = URL.createObjectURL(file);
  }

  async function measureFromImage(image: HTMLImageElement) {
    setError(null);
    onMeasuring();
    try {
      const result = await measureImage(image);
      if (result.warning && result.quality < 0.55) {
        setError(result.warning);
        onCancelled();
        return;
      }
      onMeasured(result);
    } catch (e) {
      setError(
        e instanceof NoFaceError
          ? e.message
          : "Could not measure that photo. Make sure the face is well lit and looking straight ahead.",
      );
      onCancelled();
    }
  }

  // Visual cues derived from live detector
  const guideState = React.useMemo(() => {
    if (!faceStatus) {
      return {
        color: "border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.15)]",
        hint: "Position your face inside the oval",
        tone: "neutral" as const,
      };
    }
    if (!faceStatus.detected) {
      return {
        color: "border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.3)]",
        hint: "Move your face into the frame",
        tone: "warn" as const,
      };
    }
    if (faceStatus.warning) {
      return {
        color: "border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.45)]",
        hint: faceStatus.warning,
        tone: "warn" as const,
      };
    }
    if (holdProgress < 1) {
      return {
        color: "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)]",
        hint: `Aligned! Hold still (${Math.round(holdProgress * 100)}%)`,
        tone: "good" as const,
      };
    }
    return {
      color: "border-emerald-300 shadow-[0_0_35px_rgba(110,231,183,0.8)]",
      hint: "Face Captured!",
      tone: "good" as const,
    };
  }, [faceStatus, holdProgress]);

  // Progress ring calculations
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - holdProgress);

  return (
    <div className="mt-8 space-y-5">
      <div className="card-surface overflow-hidden rounded-2xl border border-ink-900/10 shadow-lift">
        <div className="relative aspect-[4/3] bg-ink-950 overflow-hidden">
          {/* Mirrored video feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn("size-full object-cover [transform:scaleX(-1)]", !live && "hidden")}
          />

          {/* Shutter flash animation overlay */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-30 bg-white transition-opacity duration-200",
              flashActive ? "opacity-80" : "opacity-0",
            )}
          />

          {/* Camera inactive placeholder */}
          {!live && (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center text-cream-100">
              <span className="flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                <Camera className="size-8 text-brand-300" />
              </span>
              <p className="font-display font-medium text-lg">Align your face for Vedic analysis</p>
              <p className="max-w-xs text-xs text-cream-200/80 leading-relaxed">
                Look straight at the camera with even lighting. Remove glasses and keep hair off your forehead for highest precision.
              </p>
            </div>
          )}

          {/* ─── Live alignment biometric overlay ─── */}
          {live && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none"
            >
              {/* Top status bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                <span className="flex items-center gap-1.5 rounded-full bg-ink-950/70 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/10">
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  AI Vision Active
                </span>
                {faceStatus?.detected && (
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border",
                      (faceStatus.quality ?? 0) >= GOOD_QUALITY
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/40",
                    )}
                  >
                    {Math.round((faceStatus.quality ?? 0) * 100)}% Aligned
                  </span>
                )}
              </div>

              {/* Central Biometric Oval Guide */}
              <div
                className={cn(
                  "relative h-[80%] w-[58%] rounded-[50%] border-[3px] transition-all duration-300 flex items-center justify-center overflow-hidden",
                  guideState.color,
                )}
              >
                {/* Horizontal Eye Level Guideline */}
                <div className="absolute top-[38%] left-0 right-0 flex items-center justify-center">
                  <div className="w-full border-t border-dashed border-white/30" />
                  <span className="absolute bg-ink-950/60 px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider text-white/75 backdrop-blur-sm uppercase">
                    Eye Level
                  </span>
                </div>

                {/* Vertical Center Axis */}
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-white/20" />

                {/* Chin Placement Guideline */}
                <div className="absolute bottom-[8%] left-0 right-0 flex justify-center">
                  <span className="rounded-full bg-ink-950/60 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm border border-white/10">
                    Chin Position
                  </span>
                </div>

                {/* Animated Green Laser Scanline (when aligned) */}
                {guideState.tone === "good" && (
                  <div className="animate-scanline pointer-events-none absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399]" />
                )}

                {/* High-tech Corner Brackets on the Oval */}
                <span className="absolute -left-1 -top-1 size-6 rounded-tl-full border-l-3 border-t-3 border-inherit" />
                <span className="absolute -right-1 -top-1 size-6 rounded-tr-full border-r-3 border-t-3 border-inherit" />
                <span className="absolute -bottom-1 -left-1 size-6 rounded-bl-full border-b-3 border-l-3 border-inherit" />
                <span className="absolute -bottom-1 -right-1 size-6 rounded-br-full border-b-3 border-r-3 border-inherit" />

                {/* Circular Progress Indicator when scanning */}
                {faceStatus?.detected && !faceStatus.warning && holdProgress > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-ink-950/80 p-3.5 backdrop-blur-md border border-emerald-500/40 shadow-glow">
                      <svg width="92" height="92" className="drop-shadow-lg">
                        <circle
                          cx="46"
                          cy="46"
                          r={ringRadius}
                          fill="none"
                          stroke="rgb(255 255 255 / 0.15)"
                          strokeWidth="5"
                        />
                        <circle
                          cx="46"
                          cy="46"
                          r={ringRadius}
                          fill="none"
                          stroke="rgb(52 211 153 / 1)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringOffset}
                          className="transition-[stroke-dashoffset] duration-100 ease-linear"
                          style={{ transform: "rotate(-90deg)", transformOrigin: "46px 46px" }}
                        />
                        <text
                          x="46"
                          y="46"
                          textAnchor="middle"
                          dominantBaseline="central"
                          className="fill-white text-base font-bold font-mono"
                        >
                          {Math.round(holdProgress * 100)}%
                        </text>
                      </svg>
                      <span className="mt-1 text-[11px] font-semibold tracking-wider text-emerald-300 uppercase animate-pulse">
                        Scanning…
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Guidance Pill & Linear Progress Bar */}
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 px-4 z-20">
                <span
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-md border transition-all duration-300 shadow-md",
                    guideState.tone === "warn" && "bg-amber-500/30 text-amber-100 border-amber-400/50",
                    guideState.tone === "good" && "bg-emerald-500/30 text-emerald-100 border-emerald-400/50",
                    guideState.tone === "neutral" && "bg-ink-900/70 text-white/90 border-white/20",
                  )}
                >
                  {guideState.tone === "good" && holdProgress < 1 && (
                    <Loader2 className="size-3.5 animate-spin text-emerald-300" />
                  )}
                  {guideState.hint}
                </span>

                {/* Progress bar at bottom */}
                {holdProgress > 0 && (
                  <div className="h-1.5 w-44 rounded-full bg-white/20 overflow-hidden shadow-sm">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-brand-300 transition-all duration-100 ease-linear shadow-[0_0_8px_#34d399]"
                      style={{ width: `${Math.round(holdProgress * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Camera action buttons */}
        <div className="flex flex-wrap items-center gap-3 p-5 bg-surface">
          {live ? (
            <>
              <Button
                onClick={() => void doCapture()}
                disabled={busy}
                className="flex-1 shadow-glow"
              >
                <ScanFace className="size-4" />
                Capture now
              </Button>
              <Button variant="secondary" onClick={stopCamera} disabled={busy}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={startCamera}
                disabled={busy}
                loading={modelLoading}
                className="flex-1 shadow-glow"
              >
                <Camera className="size-4" />
                Start Camera Scan
              </Button>
              <Button
                variant="secondary"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
              >
                <Upload className="size-4" />
                Upload a Photo
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onFile}
              />
            </>
          )}
        </div>
      </div>

      {error && <Alert tone="warning">{error}</Alert>}

      {!canAfford && coins > 0 && (
        <Alert tone="warning">
          <Wallet className="mr-1.5 inline size-4" />
          This reading costs {coins} coins; you have {balance}.{" "}
          <Link href="/account/wallet" className="font-semibold underline">
            Add coins
          </Link>
        </Alert>
      )}

      {/* Helpful Tips Card */}
      <div className="card-surface p-5 text-sm space-y-3">
        <div className="flex items-center gap-2 font-semibold text-ink-900">
          <UserCheck className="size-4 text-emerald-600" />
          How to get the most accurate scan
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>Look directly at the camera at eye level.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>Ensure soft, even lighting without harsh shadows.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>Keep your hair away from your forehead and eyebrows.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>Maintain a neutral facial expression while holding still.</span>
          </li>
        </ul>

        <div className="pt-2 border-t border-ink-900/10 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-600" />
            Zero image storage — 100% processed on your device
          </span>
          {coins > 0 && (
            <span>Cost: <strong className="text-foreground">{coins} coins</strong></span>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- measuring animation view */
function MeasuringView() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const steps = [
    "Mapping 478 high-precision facial coordinates…",
    "Calculating forehead, eye, and jawline proportions…",
    "Cross-referencing Vedic Samudrik Shastra treatises…",
    "Synthesizing your personalized character & destiny report…",
  ];

  React.useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 700);
    const t2 = setTimeout(() => setStepIndex(2), 1500);
    const t3 = setTimeout(() => setStepIndex(3), 2300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="card-surface mt-8 p-8 text-center space-y-6 rounded-2xl shadow-lift border border-ink-900/10">
      <div className="relative mx-auto size-24">
        <div className="absolute inset-0 rounded-full border-2 border-brand-400/40 animate-ping" />
        <div className="relative flex size-full items-center justify-center rounded-full bg-brand-50 border-2 border-brand-300 shadow-glow">
          <ScanFace className="size-10 text-brand-800 animate-pulse" />
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink-950">
          Analyzing Vedic Facial Proportions
        </h2>
        <p className="mt-2 text-sm text-brand-700 font-medium">
          {steps[stepIndex]}
        </p>
      </div>

      <div className="mx-auto max-w-sm space-y-2.5 text-left text-xs bg-cream-50 p-4 rounded-xl border border-ink-900/5">
        {steps.map((text, idx) => (
          <div
            key={idx}
            className={cn(
              "flex items-center gap-2.5 transition-all duration-300",
              idx <= stepIndex ? "text-ink-900 font-medium" : "opacity-35 text-muted-foreground",
            )}
          >
            {idx < stepIndex ? (
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            ) : idx === stepIndex ? (
              <Loader2 className="size-4 text-brand-600 animate-spin shrink-0" />
            ) : (
              <span className="size-4 rounded-full border border-muted-foreground/30 shrink-0 inline-block" />
            )}
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- reading results */
function Reading({ reading, onAgain }: { reading: FaceReading; onAgain: () => void }) {
  return (
    <div className="mt-8 space-y-5">
      <div className="card-glow rounded-2xl p-6 text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Sparkles className="size-3.5" />
          {Math.round(reading.quality * 100)}% Scan Precision
        </span>
        <h2 className="font-display text-2xl font-bold tracking-tight">Your Vedic Physiognomy Analysis</h2>
        <p className="text-sm text-muted-foreground">
          {reading.sections.length} facial features decoded
          {reading.coins_charged > 0 && ` · ${reading.coins_charged} coins debited`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {reading.sections.map((section, i) => (
          <article
            key={`${section.feature}-${section.option}-${i}`}
            className="card-surface p-6 rounded-2xl border border-ink-900/10 shadow-soft hover:shadow-lift transition-shadow"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-900/5 pb-3">
              <h3 className="font-display text-lg font-semibold text-ink-950">{section.label}</h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                {section.feature_label}
                {section.area ? ` · ${section.area}` : ""}
              </span>
            </div>
            <p className="mt-3 leading-relaxed text-sm text-ink-700">{section.meaning}</p>
          </article>
        ))}
      </div>

      <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
        Samudrik Shastra is a revered traditional system of character reading offered here for personal self-reflection.
      </p>

      <Button variant="secondary" onClick={onAgain} className="w-full">
        <RefreshCw className="size-4" />
        Read Another Face
      </Button>
    </div>
  );
}
