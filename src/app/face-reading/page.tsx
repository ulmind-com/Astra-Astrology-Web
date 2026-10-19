"use client";

/**
 * Robust MediaPipe + OpenCV Facial Scanning System (Stages A through H).
 *
 * Provides real-time camera alignment guidance, live laser scanline, hold countdown,
 * instant OpenCV + MediaPipe 3D biometric scanning, visual landmark mesh overlay,
 * and multi-language Vedic Samudrik Shastra interpretation (English, বাংলা, हिंदी).
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Globe,
  Info,
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
  detectFromVideo,
  type LiveFaceStatus,
} from "@/lib/face-measure";
import {
  type FaceReadingLanguage,
  I18N_UI,
  translateReadingSection,
} from "@/lib/face-reading-i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { FaceReading, FaceScanResponse } from "@/types";

type Stage = "intro" | "measuring" | "reading" | "rejected";

/** How long alignment must stay ≥ GOOD_QUALITY before auto-capture (ms). */
const HOLD_DURATION_MS = 1200;
/** Quality threshold to start counting the hold-still timer. */
const GOOD_QUALITY = 0.58;
/** Target detection interval (ms) — ~12 fps, light on CPU. */
const DETECT_INTERVAL_MS = 80;

export default function FaceReadingPage() {
  const { isSignedIn } = useAuth();
  const [stage, setStage] = React.useState<Stage>("intro");
  const [scanResult, setScanResult] = React.useState<FaceScanResponse | null>(null);
  const [reading, setReading] = React.useState<FaceReading | null>(null);
  const [rejectedInfo, setRejectedInfo] = React.useState<{ issues: string[]; message?: string | null } | null>(null);
  const [language, setLanguage] = React.useState<FaceReadingLanguage>("bn");

  const ui = I18N_UI[language];

  const { data: availability, isLoading } = useQuery({
    queryKey: ["face-reading", "availability"],
    queryFn: () => faceReadingApi.availability(),
    enabled: isSignedIn,
  });

  const scanMutation = useMutation({
    mutationFn: (image: File | Blob | string) => faceReadingApi.scan(image),
    onSuccess: (result) => {
      if (result.status === "REJECTED") {
        setRejectedInfo({
          issues: result.warnings && result.warnings.length > 0
            ? result.warnings
            : ["Image quality did not meet facial scanning standards."],
          message: result.error_message || "Could not detect a clear frontal face suitable for scanning.",
        });
        setStage("rejected");
        return;
      }
      setScanResult(result);
      if (result.reading) {
        setReading(result.reading);
      }
      setStage("reading");
    },
    onError: (e: ApiError) => {
      toast.error(e.message || "Face scanning failed. Please try again.");
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
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink-950">
            {ui.title}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground text-sm leading-relaxed">
            {ui.subtitle}
          </p>

          {/* Language Selector Bar */}
          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-cream-200/80 p-1.5 border border-ink-900/10 shadow-sm backdrop-blur-sm">
            <span className="text-[11px] font-medium text-ink-700 pl-2 pr-1 flex items-center gap-1">
              <Globe className="size-3.5 text-brand-800" />
              {ui.langLabel}:
            </span>
            {(["bn", "hi", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 cursor-pointer",
                  language === l
                    ? "bg-white text-ink-950 shadow-sm border border-brand-300"
                    : "text-ink-700/80 hover:text-ink-950 hover:bg-white/50",
                )}
              >
                {l === "bn" ? "বাংলা" : l === "hi" ? "हिंदी" : "English"}
              </button>
            ))}
          </div>
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
          <Reading
            reading={reading}
            scanResult={scanResult}
            language={language}
            onAgain={() => {
              setReading(null);
              setScanResult(null);
              setStage("intro");
            }}
          />
        ) : stage === "rejected" && rejectedInfo ? (
          <RejectedView
            language={language}
            issues={rejectedInfo.issues}
            message={rejectedInfo.message}
            onRetry={() => {
              setRejectedInfo(null);
              setStage("intro");
            }}
          />
        ) : stage === "measuring" || scanMutation.isPending ? (
          <MeasuringView language={language} />
        ) : (
          <Capture
            language={language}
            coins={availability.coins}
            canAfford={availability.can_afford}
            balance={availability.balance_coins}
            busy={scanMutation.isPending}
            onMeasuring={() => setStage("measuring")}
            onScanImage={(img) => scanMutation.mutate(img)}
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
  language,
  coins,
  canAfford,
  balance,
  busy,
  onMeasuring,
  onScanImage,
  onCancelled,
}: {
  language: FaceReadingLanguage;
  coins: number;
  canAfford: boolean;
  balance: number;
  busy: boolean;
  onMeasuring: () => void;
  onScanImage: (fileOrBlob: File | Blob) => void;
  onCancelled: () => void;
}) {
  const ui = I18N_UI[language];

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

  // Capture current high-res frame from video and submit to OpenCV MediaPipe pipeline
  const doCapture = React.useCallback(async () => {
    if (!videoRef.current || capturingRef.current) return;
    capturingRef.current = true;

    // Flash animation
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 260);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    onMeasuring();
    stopCamera();

    canvas.toBlob((blob) => {
      if (blob) {
        onScanImage(blob);
      } else {
        setError("Failed to capture video frame.");
        onCancelled();
      }
    }, "image/jpeg", 0.95);
  }, [onMeasuring, stopCamera, onScanImage, onCancelled]);

  // Real-time alignment loop
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
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
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
        "Could not access camera. Please allow camera permission, or upload a clear frontal photo below.",
      );
    } finally {
      setModelLoading(false);
    }
  }

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    onMeasuring();
    stopCamera();
    onScanImage(file);
    event.target.value = "";
  }

  // Visual state derived from live feedback
  const isAligned = Boolean(faceStatus?.detected && faceStatus.quality >= GOOD_QUALITY && !faceStatus.warning);
  const ringCircumference = 2 * Math.PI * 40; // r=40
  const ringOffset = ringCircumference * (1 - holdProgress);

  return (
    <div className="card-surface mt-8 space-y-6 p-6 sm:p-8 rounded-2xl border border-ink-900/10 shadow-soft">
      {error && (
        <Alert tone="error" className="text-left">
          {error}
        </Alert>
      )}

      {/* Camera Live View or Idle Placeholder */}
      <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-2xl bg-ink-950 border-2 border-ink-900/20 shadow-inner">
        {/* Flash overlay */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-30 bg-white transition-opacity duration-200",
            flashActive ? "opacity-95" : "opacity-0",
          )}
        />

        <video
          ref={videoRef}
          playsInline
          muted
          className={cn(
            "size-full object-cover transition-opacity duration-300 -scale-x-100",
            live ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Biometric Laser Scanline Animation */}
        {live && (
          <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <div className="laser-scanline" />
          </div>
        )}

        {/* Biometric Alignment Oval Overlay */}
        {live && (
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-4">
            <div
              className={cn(
                "relative aspect-[3/4] w-48 sm:w-56 rounded-[50%] border-2 transition-all duration-300",
                isAligned
                  ? "border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.55)] scale-[1.02]"
                  : faceStatus?.detected
                  ? "border-amber-400/90 shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                  : "border-white/40 border-dashed",
              )}
            >
              {/* Corner crosshairs */}
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/70" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white/70" />
              <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-6 w-0.5 bg-white/70" />
              <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-6 w-0.5 bg-white/70" />
            </div>

            {/* Live Alignment Feedback Pill */}
            <div className="mt-4 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold tracking-wide transition-all duration-300 shadow-md">
              {faceStatus?.warning ? (
                <span className="text-amber-200 bg-amber-950/70 px-3 py-1 rounded-full border border-amber-400/30">
                  {faceStatus.warning}
                </span>
              ) : isAligned ? (
                <span className="text-emerald-200 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-emerald-400" />
                  {holdProgress > 0
                    ? `${ui.holdStill} ${Math.ceil((1 - holdProgress) * (HOLD_DURATION_MS / 1000))}s`
                    : ui.perfectKeepStill}
                </span>
              ) : faceStatus?.detected ? (
                <span className="text-sky-200 bg-sky-950/70 px-3 py-1 rounded-full border border-sky-400/30">
                  {ui.centerFace}
                </span>
              ) : (
                <span className="text-white/80 bg-black/60 px-3 py-1 rounded-full border border-white/20">
                  {ui.lookStraight}
                </span>
              )}
            </div>

            {/* Hold-Still Progress Ring */}
            {holdProgress > 0 && (
              <div className="absolute top-3 right-3 z-25 flex items-center justify-center">
                <svg className="size-12 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="rgba(0,0,0,0.4)"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    className="transition-all duration-100"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-white">
                  {Math.round(holdProgress * 100)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Camera Idle Placeholder */}
        {!live && (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-cream-200">
            <span className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <Camera className="size-8 text-cream-100" />
            </span>
            <p className="max-w-xs text-xs text-cream-200/80 leading-relaxed">
              {ui.cameraReady}
            </p>
          </div>
        )}
      </div>

      {/* Wallet / Cost Pill */}
      {coins > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Wallet className="size-3.5 text-brand-700" />
            {ui.costLabel} <strong className="text-foreground">{coins} {ui.coins}</strong>
          </span>
          <span className="text-ink-400">·</span>
          <span className="text-muted-foreground">
            {ui.balanceLabel} <strong className="text-foreground">{balance} {ui.coins}</strong>
          </span>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!live ? (
          <Button
            onClick={startCamera}
            disabled={busy || modelLoading || (coins > 0 && !canAfford)}
            className="flex-1"
          >
            {modelLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Camera className="size-4" />
            )}
            {ui.startCamera}
          </Button>
        ) : (
          <>
            <Button
              onClick={doCapture}
              disabled={busy}
              className={cn(
                "flex-1 transition-all",
                isAligned && "shadow-glow bg-emerald-600 hover:bg-emerald-700 text-white",
              )}
            >
              <ScanFace className="size-4" />
              {isAligned ? ui.captureReady : ui.captureManual}
            </Button>
            <Button variant="secondary" onClick={stopCamera} disabled={busy}>
              {ui.stopCamera}
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          disabled={busy || (coins > 0 && !canAfford)}
          className="flex-1 sm:flex-initial"
        >
          <Upload className="size-4" />
          {ui.uploadPhoto}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          onChange={onFile}
          className="hidden"
        />
      </div>

      {coins > 0 && !canAfford && (
        <Alert tone="warning" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
          <div className="text-sm">
            {language === "bn"
              ? `মুখাবয়ব বিশ্লেষণের জন্য আপনার ${coins} কয়েন প্রয়োজন, কিন্তু আপনার বর্তমান ব্যালেন্স ${balance} কয়েন।`
              : language === "hi"
              ? `मुखाकृति विश्लेषण के लिए आपको ${coins} कॉइन्स की आवश्यकता है, लेकिन आपका बैलेंस ${balance} कॉइन्स है।`
              : `You need ${coins} coins for a face reading, but your balance is ${balance} coins.`}
          </div>
          <Link
            href="/account/wallet"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors shrink-0"
          >
            <Wallet className="size-3.5" />
            {language === "bn" ? "ওয়ালেট রিচার্জ করুন" : language === "hi" ? "वॉलेट रीचार्ज करें" : "Recharge Wallet"}
          </Link>
        </Alert>
      )}

      {/* Guidance and Quality Standards Checklist */}
      <div className="rounded-xl bg-cream-100/70 p-4 border border-ink-900/5 text-left space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-900">
          <Sparkles className="size-3.5 text-brand-700" />
          {ui.tipsTitle}
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>{ui.tip1}</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>{ui.tip2}</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>{ui.tip3}</span>
          </li>
          <li className="flex items-start gap-1.5">
            <CheckCircle2 className="size-3.5 text-brand-600 mt-0.5 shrink-0" />
            <span>{ui.tip4}</span>
          </li>
        </ul>

        <div className="pt-2 border-t border-ink-900/10 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-600" />
            {ui.privacyNote}
          </span>
          {coins > 0 && (
            <span>
              {ui.costLabel} <strong className="text-foreground">{coins} {ui.coins}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- rejected view */
function RejectedView({
  language,
  issues,
  message,
  onRetry,
}: {
  language: FaceReadingLanguage;
  issues: string[];
  message?: string | null;
  onRetry: () => void;
}) {
  const isBn = language === "bn";
  const isHi = language === "hi";

  return (
    <div className="card-surface mt-8 p-8 rounded-2xl border border-rose-500/20 shadow-lift text-center space-y-6">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50 border border-rose-200 shadow-sm">
        <AlertTriangle className="size-8 text-rose-600" />
      </span>

      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950">
          {isBn ? "স্ক্যান সম্পন্ন হয়নি" : isHi ? "स्कैन पूरा नहीं हुआ" : "Scan Unsuccessful"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {message || (isBn
            ? "সঠিক ফলাফলের জন্য ছবিটি প্রয়োজনীয় মান পূরণ করতে পারেনি।"
            : isHi
            ? "सटीक परिणाम के लिए छवि आवश्यक गुणवत्ता मानक को पूरा नहीं कर सकी।"
            : "The image did not meet the quality criteria required for an accurate reading.")}
        </p>
      </div>

      {issues.length > 0 && (
        <div className="bg-rose-50/60 p-4 rounded-xl text-left border border-rose-200/50 max-w-md mx-auto space-y-2">
          <p className="text-xs font-bold text-rose-900 uppercase tracking-wider">
            {isBn ? "শনাক্ত ত্রুটিসমূহ:" : isHi ? "पहचानी गई समस्याएं:" : "Detected Issues:"}
          </p>
          <ul className="text-xs text-rose-800 space-y-1.5 list-disc pl-4">
            {issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200/60 max-w-md mx-auto flex items-center justify-center gap-2 text-xs font-medium text-emerald-800">
        <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
        <span>
          {isBn
            ? "আপনার ব্যালেন্স থেকে কোনো কয়েন কাটা হয়নি।"
            : isHi
            ? "आपके बैलेंस से कोई कॉइन नहीं काटा गया।"
            : "No coins were charged for this attempt."}
        </span>
      </div>

      <div className="pt-2">
        <Button onClick={onRetry} className="w-full sm:w-auto px-8">
          <RefreshCw className="size-4" />
          {isBn ? "আবার চেষ্টা করুন" : isHi ? "पुनः प्रयास करें" : "Try Again"}
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- measuring animation view */
function MeasuringView({ language }: { language: FaceReadingLanguage }) {
  const ui = I18N_UI[language];
  const [stepIndex, setStepIndex] = React.useState(0);
  const steps = [ui.step1, ui.step2, ui.step3, ui.step4];

  React.useEffect(() => {
    const t1 = setTimeout(() => setStepIndex(1), 500);
    const t2 = setTimeout(() => setStepIndex(2), 1200);
    const t3 = setTimeout(() => setStepIndex(3), 1900);
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
          {ui.measuringTitle}
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
function Reading({
  reading,
  scanResult,
  language,
  onAgain,
}: {
  reading: FaceReading;
  scanResult: FaceScanResponse | null;
  language: FaceReadingLanguage;
  onAgain: () => void;
}) {
  const ui = I18N_UI[language];
  const [viewMode, setViewMode] = React.useState<"grouped" | "primary">("grouped");
  const [showBiometrics, setShowBiometrics] = React.useState(false);

  // Group sections by canonical Vedic facial feature order
  const groupedFeatures = React.useMemo(() => {
    const order = [
      "face_shape",
      "forehead",
      "eyebrows",
      "eyes",
      "nose",
      "lips",
      "chin",
      "cheeks",
    ];
    const map = new Map<string, typeof reading.sections>();
    for (const s of reading.sections) {
      const list = map.get(s.feature) || [];
      list.push(s);
      map.set(s.feature, list);
    }
    return order
      .filter((f) => map.has(f))
      .map((f) => ({
        feature: f,
        items: map.get(f)!,
      }));
  }, [reading.sections]);

  const qualityScorePct = Math.round((scanResult?.quality_score ?? reading.quality) * 100);
  const isAccepted = scanResult?.status !== "RETAKE_RECOMMENDED";

  return (
    <div className="mt-8 space-y-6">
      {/* Top Header Card */}
      <div className="card-glow rounded-2xl p-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 flex-wrap justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm",
              isAccepted
                ? "bg-emerald-500/15 text-emerald-800 border border-emerald-300/40"
                : "bg-amber-500/15 text-amber-800 border border-amber-300/40",
            )}
          >
            <Sparkles className="size-3.5" />
            {qualityScorePct}% {ui.scanPrecision} ({scanResult?.status || "ACCEPTED"})
          </span>
          {scanResult?.processing_duration_ms && (
            <span className="text-[11px] font-medium text-muted-foreground bg-cream-200/70 px-2.5 py-1 rounded-full">
              {scanResult.processing_duration_ms} ms
            </span>
          )}
        </div>

        <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950">
          {ui.resultsTitle}
        </h2>
        <p className="text-sm text-muted-foreground">
          {groupedFeatures.length}{" "}
          {language === "bn"
            ? "টি প্রধান অঙ্গের বৈদিক সমুদ্রিক বিশ্লেষণ"
            : language === "hi"
            ? "मुख्य अंगों का सामुद्रिक शास्त्र विश्लेषण"
            : "facial features analyzed with Samudrik Shastra"}
          {reading.coins_charged > 0 && ` · ${reading.coins_charged} ${ui.coinsDebited}`}
        </p>

        {/* View Mode Switcher */}
        <div className="inline-flex items-center gap-1 rounded-full bg-cream-200/70 p-1 border border-ink-900/10 text-xs mt-1">
          <button
            type="button"
            onClick={() => setViewMode("grouped")}
            className={cn(
              "rounded-full px-3 py-1 font-semibold transition-all cursor-pointer",
              viewMode === "grouped"
                ? "bg-white text-ink-950 shadow-sm"
                : "text-ink-700/80 hover:text-ink-950",
            )}
          >
            {language === "bn" ? "অঙ্গভিত্তিক সম্পূর্ণ বিশ্লেষণ" : language === "hi" ? "अंगवार विस्तृत विश्लेषण" : "Detailed by Feature"}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("primary")}
            className={cn(
              "rounded-full px-3 py-1 font-semibold transition-all cursor-pointer",
              viewMode === "primary"
                ? "bg-white text-ink-950 shadow-sm"
                : "text-ink-700/80 hover:text-ink-950",
            )}
          >
            {language === "bn" ? "১টি করে প্রধান লক্ষণ" : language === "hi" ? "मुख्य लक्षण मात्र" : "Primary Traits Only"}
          </button>
        </div>
      </div>

      {/* 3D Facial Mesh Visualization Card */}
      {scanResult?.visualization_image && (
        <div className="card-surface p-6 rounded-2xl border border-ink-900/10 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-ink-900/10 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-brand-700" />
              <h3 className="font-display text-base font-bold text-ink-950">
                {language === "bn" ? "OpenCV ত্রিমাত্রিক ফেস মেশ ও ল্যান্ডমার্ক স্ক্যান" : language === "hi" ? "OpenCV 3D फेस मेश व लैंडमार्क स्कैन" : "OpenCV 3D Biometric Face Mesh Scan"}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              478 Biometric Nodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Visualizer Image */}
            <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-brand-400/30 shadow-inner bg-ink-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scanResult.visualization_image}
                alt="OpenCV 3D Facial Mesh Overlay"
                className="size-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] bg-black/60 backdrop-blur-sm text-white/90 py-1 rounded">
                MediaPipe Face Landmarker · {scanResult.model_version}
              </div>
            </div>

            {/* Quality & Head Pose Telemetry */}
            <div className="space-y-3 text-xs">
              <div className="bg-cream-100/70 p-3.5 rounded-xl border border-ink-900/5 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-ink-900">
                  <Compass className="size-4 text-brand-700" />
                  <span>
                    {language === "bn" ? "মাথার অবস্থান ও অ্যাঙ্গেল (Head Pose)" : language === "hi" ? "सिर की स्थिति व कोण (Head Pose)" : "3D Head Pose Orientation"}
                  </span>
                </div>
                {scanResult.head_pose ? (
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white p-2 rounded-lg border border-ink-900/5 shadow-2xs">
                      <div className="text-[10px] text-muted-foreground uppercase">Yaw (সাইড)</div>
                      <div className="text-sm font-bold text-ink-900">{scanResult.head_pose.yaw}°</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-ink-900/5 shadow-2xs">
                      <div className="text-[10px] text-muted-foreground uppercase">Pitch (উপর/নিচ)</div>
                      <div className="text-sm font-bold text-ink-900">{scanResult.head_pose.pitch}°</div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-ink-900/5 shadow-2xs">
                      <div className="text-[10px] text-muted-foreground uppercase">Roll (কাত)</div>
                      <div className="text-sm font-bold text-ink-900">{scanResult.head_pose.roll}°</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Frontal alignment detected</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-cream-100/70 p-3 rounded-xl border border-ink-900/5">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    {language === "bn" ? "শার্পনেস / ফোকাস" : language === "hi" ? "शार्पनेस / फोकस" : "Sharpness Score"}
                  </span>
                  <span className="text-sm font-bold text-ink-900">
                    {scanResult.quality_checks.blur_score.toFixed(1)} / 100+
                  </span>
                </div>
                <div className="bg-cream-100/70 p-3 rounded-xl border border-ink-900/5">
                  <span className="text-[10px] text-muted-foreground uppercase block">
                    {language === "bn" ? "মুখের ফ্রেম কভারেজ" : language === "hi" ? "फेस फ्रेम कवरेज" : "Face Frame Coverage"}
                  </span>
                  <span className="text-sm font-bold text-ink-900">
                    {Math.round(scanResult.quality_checks.face_coverage_pct * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Render Exactly 1 Card per Facial Feature */}
      <div className="grid grid-cols-1 gap-4">
        {groupedFeatures.map(({ feature, items }) => {
          const displayItems = viewMode === "primary" ? [items[0]] : items;
          const firstTr = translateReadingSection(displayItems[0], language);

          return (
            <article
              key={feature}
              className="card-surface p-6 rounded-2xl border border-ink-900/10 shadow-soft hover:shadow-lift transition-shadow space-y-4"
            >
              {/* Feature Header Badge */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-ink-900/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-500" />
                  <h3 className="font-display text-lg font-bold text-ink-950">
                    {firstTr.featureLabel}
                  </h3>
                </div>
                {firstTr.areaLabel && (
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                    {firstTr.areaLabel}
                  </span>
                )}
              </div>

              {/* Trait Insights */}
              <div className="space-y-4">
                {displayItems.map((item, idx) => {
                  const tr = translateReadingSection(item, language);

                  return (
                    <div
                      key={`${item.feature}-${item.option}-${idx}`}
                      className={cn(
                        "space-y-1.5",
                        idx > 0 && "pt-3.5 border-t border-dashed border-ink-900/10",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-semibold text-ink-900 text-base">
                          {tr.label}
                        </h4>
                        {displayItems.length > 1 && (
                          <span className="text-[10px] font-semibold text-muted-foreground bg-cream-100 px-2 py-0.5 rounded">
                            {language === "bn" ? `বৈশিষ্ট্য ${idx + 1}` : language === "hi" ? `लक्षण ${idx + 1}` : `Aspect ${idx + 1}`}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 leading-relaxed text-sm text-ink-700">
                        {tr.meaning}
                      </p>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      {/* Expandable Technical Biometric Ratios */}
      {scanResult?.measurement_details && Object.keys(scanResult.measurement_details).length > 0 && (
        <div className="card-surface p-4 rounded-xl border border-ink-900/10 text-xs">
          <button
            type="button"
            onClick={() => setShowBiometrics(!showBiometrics)}
            className="flex w-full items-center justify-between font-semibold text-ink-800 hover:text-ink-950"
          >
            <span className="flex items-center gap-1.5">
              <Info className="size-4 text-brand-700" />
              {language === "bn"
                ? "২৩টি বৈদিক জ্যামিতিক অনুপাত ও পরিমাপ টেবিল দেখুন"
                : language === "hi"
                ? "23 वैदिक ज्यामितीय अनुपात व माप तालिका देखें"
                : "View 23 Vedic Biometric Proportions & Ratios Table"}
            </span>
            {showBiometrics ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </button>

          {showBiometrics && (
            <div className="mt-3 pt-3 border-t border-ink-900/10 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-ink-900/10 text-[10px] uppercase text-muted-foreground">
                    <th className="py-1.5 pr-2">Metric</th>
                    <th className="py-1.5 px-2">Value</th>
                    <th className="py-1.5 px-2">Formula</th>
                    <th className="py-1.5 pl-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5 text-[11px]">
                  {Object.entries(scanResult.measurement_details).map(([key, item]) => (
                    <tr key={key} className="hover:bg-cream-100/50">
                      <td className="py-1.5 pr-2 font-mono font-medium text-brand-900">{key}</td>
                      <td className="py-1.5 px-2 font-mono font-bold text-ink-950">{item.value.toFixed(4)}</td>
                      <td className="py-1.5 px-2 font-mono text-muted-foreground text-[10px]">{item.formula}</td>
                      <td className="py-1.5 pl-2 text-ink-700">{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <p className="px-2 text-center text-xs leading-relaxed text-muted-foreground">
        {ui.disclaimer}
      </p>

      <Button variant="secondary" onClick={onAgain} className="w-full">
        <RefreshCw className="size-4" />
        {ui.readAnother}
      </Button>
    </div>
  );
}
