"use client";

/**
 * Robust MediaPipe + OpenCV Facial Scanning System (Stages A through H).
 *
 * Provides real-time camera alignment guidance, live laser scanline, hold countdown,
 * instant OpenCV + MediaPipe 3D biometric scanning, visual landmark mesh overlay,
 * Tri-Zone timeline analysis (0-28, 28-50, 50+ yrs), Pancha Mahabhuta & Mahapurusha,
 * Dharmender Kumar Bansal Kundli-Face synchronization, and multi-language
 * Vedic Samudrik Shastra interpretation (English, বাংলা, हिंदी).
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Flame,
  Globe,
  Info,
  Layers,
  Loader2,
  RefreshCw,
  ScanFace,
  ShieldCheck,
  Sparkles,
  Upload,
  UserCheck,
  Wallet,
  Zap,
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
  drawLiveFaceMesh,
  type LiveFaceStatus,
} from "@/lib/face-measure";
import {
  type FaceReadingLanguage,
  I18N_UI,
  translateReadingSection,
} from "@/lib/face-reading-i18n";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import type { FaceReading, FaceScanResponse } from "@/types";

type Stage = "intro" | "measuring" | "reading" | "rejected";
type ReadingTab = "features" | "trizone" | "mahabhuta" | "kundlisync" | "forehead" | "remedies";

/** Quality threshold to consider the face well-positioned in frame. */
const GOOD_QUALITY = 0.58;
/** Target detection interval (ms) — ~16 fps, smooth and CPU-light. */
const DETECT_INTERVAL_MS = 60;

export default function FaceReadingPage() {
  const { isSignedIn } = useAuth();
  const [stage, setStage] = React.useState<Stage>("intro");
  const [scanResult, setScanResult] = React.useState<FaceScanResponse | null>(null);
  const [reading, setReading] = React.useState<FaceReading | null>(null);
  const [rejectedInfo, setRejectedInfo] = React.useState<{ issues: string[]; message?: string | null } | null>(null);
  const { language, setLanguage } = useLanguage();

  // Optional Kundli-Face Synchronization State
  const [birthDetails, setBirthDetails] = React.useState({
    dob: "1995-05-15",
    tob: "12:00",
    pob: "Kolkata, India",
    lat: 22.5726,
    lon: 88.3639,
    tz: 5.5,
  });
  const [enableKundliSync, setEnableKundliSync] = React.useState(false);

  const ui = I18N_UI[language];

  const { data: availability, isLoading } = useQuery({
    queryKey: ["face-reading", "availability"],
    queryFn: () => faceReadingApi.availability(),
    enabled: isSignedIn,
  });

  const scanMutation = useMutation({
    mutationFn: ({ image, birthDetails }: { image: File | Blob | string; birthDetails?: Record<string, any> }) =>
      faceReadingApi.scan(image, birthDetails),
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
      <main className="mx-auto max-w-4xl px-4 py-10">
        <header className="text-center">
          <span className="medallion mx-auto flex size-16 items-center justify-center rounded-full shadow-glow">
            <ScanFace className="size-8 text-brand-900" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-ink-950">
            {ui.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-sm leading-relaxed">
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
            birthDetails={birthDetails}
            setBirthDetails={setBirthDetails}
            enableKundliSync={enableKundliSync}
            setEnableKundliSync={setEnableKundliSync}
            onMeasuring={() => setStage("measuring")}
            onScanImage={(img, bDetails) =>
              scanMutation.mutate({ image: img, birthDetails: bDetails })
            }
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
  birthDetails,
  setBirthDetails,
  enableKundliSync,
  setEnableKundliSync,
  onMeasuring,
  onScanImage,
  onCancelled,
}: {
  language: FaceReadingLanguage;
  coins: number;
  canAfford: boolean;
  balance: number;
  busy: boolean;
  birthDetails: { dob: string; tob: string; pob: string; lat: number; lon: number; tz: number };
  setBirthDetails: React.Dispatch<React.SetStateAction<{ dob: string; tob: string; pob: string; lat: number; lon: number; tz: number }>>;
  enableKundliSync: boolean;
  setEnableKundliSync: React.Dispatch<React.SetStateAction<boolean>>;
  onMeasuring: () => void;
  onScanImage: (fileOrBlob: File | Blob, birthDetails?: Record<string, any>) => void;
  onCancelled: () => void;
}) {
  const ui = I18N_UI[language];

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const animFrameRef = React.useRef<number>(0);
  const capturingRef = React.useRef(false);
  const autoStartedRef = React.useRef(false);

  const [live, setLive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [modelLoading, setModelLoading] = React.useState(false);
  const [flashActive, setFlashActive] = React.useState(false);

  // Real-time feedback state
  const [faceStatus, setFaceStatus] = React.useState<LiveFaceStatus | null>(null);

  const stopCamera = React.useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = 0;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    capturingRef.current = false;
    setLive(false);
    setFaceStatus(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  React.useEffect(() => stopCamera, [stopCamera]);

  // Capture current high-res frame from video and submit to OpenCV MediaPipe pipeline
  const doCapture = React.useCallback(async () => {
    if (!videoRef.current || capturingRef.current) return;
    if (coins > 0 && !canAfford) return;
    capturingRef.current = true;

    // Flash animation
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 260);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    onMeasuring();
    stopCamera();

    canvas.toBlob((blob) => {
      if (blob) {
        onScanImage(blob, enableKundliSync ? birthDetails : undefined);
      } else {
        setError("Failed to capture video frame.");
        onCancelled();
      }
    }, "image/jpeg", 0.98);
  }, [coins, canAfford, onMeasuring, stopCamera, onScanImage, enableKundliSync, birthDetails, onCancelled]);

  // Real-time alignment & 3D facial mesh rendering loop
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

        // Continuously render 3D facial mesh markings on the mirrored canvas
        if (canvasRef.current && videoRef.current) {
          const vW = videoRef.current.videoWidth || 640;
          const vH = videoRef.current.videoHeight || 480;
          if (canvasRef.current.width !== vW || canvasRef.current.height !== vH) {
            canvasRef.current.width = vW;
            canvasRef.current.height = vH;
          }

          if (status.landmarks) {
            const isCurrentlyAligned = Boolean(
              status.detected && status.quality >= GOOD_QUALITY && !status.warning,
            );
            await drawLiveFaceMesh(canvasRef.current, status.landmarks, isCurrentlyAligned);
          } else {
            const ctx = canvasRef.current.getContext("2d");
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      } catch {
        // Skip occasional frame glitch
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  const startCamera = React.useCallback(async () => {
    setError(null);
    try {
      setModelLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1920, min: 1280 },
          height: { ideal: 1080, min: 720 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setLive(true);
      runDetectionLoop();
    } catch {
      setError(
        language === "bn"
          ? "ক্যামেরা এক্সেস করা যায়নি। অনুগ্রহ করে ব্রাউজারে ক্যামেরা পারমিশন দিন, অথবা নিচে ছবি আপলোড করুন।"
          : language === "hi"
          ? "कैमरा ऐक्सेस नहीं हो सका। कृपया ब्राउज़र में कैमरा अनुमति दें, या नीचे फोटो अपलोड करें।"
          : "Could not access camera. Please allow camera permission in your browser, or upload a photo below.",
      );
    } finally {
      setModelLoading(false);
    }
  }, [language, runDetectionLoop]);

  // Auto-start camera when the page opens so user sees live face & 3D markings immediately
  React.useEffect(() => {
    if (!autoStartedRef.current) {
      autoStartedRef.current = true;
      startCamera();
    }
  }, [startCamera]);

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    onMeasuring();
    stopCamera();
    onScanImage(file, enableKundliSync ? birthDetails : undefined);
    event.target.value = "";
  }

  // Visual state derived from live feedback
  const isAligned = Boolean(faceStatus?.detected && faceStatus.quality >= GOOD_QUALITY && !faceStatus.warning);

  return (
    <div className="card-surface mt-6 sm:mt-8 space-y-5 sm:space-y-6 p-4 sm:p-8 rounded-2xl border border-ink-900/10 shadow-soft">
      {error && (
        <Alert tone="error" className="text-left">
          {error}
        </Alert>
      )}

      {/* Camera Live View or Idle Placeholder */}
      <div className="relative mx-auto aspect-[3/4] sm:aspect-[4/3] max-w-sm sm:max-w-md overflow-hidden rounded-2xl bg-ink-950 border-2 border-ink-900/20 shadow-inner">
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

        {/* Live 3D Facial Mesh & Biometric Wireframe Canvas */}
        <canvas
          ref={canvasRef}
          className={cn(
            "pointer-events-none absolute inset-0 size-full object-cover -scale-x-100 z-[15] transition-opacity duration-200",
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
                "relative aspect-[3/4] w-44 sm:w-56 rounded-[50%] border-2 transition-all duration-300",
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
                <span className="text-emerald-200 bg-emerald-950/70 px-3.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                  <UserCheck className="size-3.5 text-emerald-400" />
                  {ui.alignedReady}
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
          </div>
        )}

        {/* Camera Idle Placeholder */}
        {!live && (
          <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center text-cream-200">
            <span className="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              {modelLoading ? (
                <Loader2 className="size-8 text-amber-400 animate-spin" />
              ) : (
                <Camera className="size-8 text-cream-100" />
              )}
            </span>
            <p className="max-w-xs text-xs text-cream-200/80 leading-relaxed">
              {modelLoading ? ui.cameraStarting : ui.cameraReady}
            </p>
          </div>
        )}
      </div>

      {/* Kundli Synchronization Toggle & Configuration */}
      <div className="rounded-xl border border-brand-500/20 bg-gradient-to-r from-cream-100/90 via-white to-brand-50/40 p-4 text-left space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-900 shadow-2xs">
              <Compass className="size-4" />
            </span>
            <div>
              <span className="text-xs font-bold text-ink-950 block">
                {language === "bn"
                  ? "বৈদিক কুণ্ডলী ও লগ্ন সামঞ্জস্য (ঐচ্ছিক)"
                  : language === "hi"
                  ? "वैदिक कुंडली व लग्न संरेखण (वैकल्पिक)"
                  : "Vedic Kundli & Lagna Sync (Optional)"}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {language === "bn"
                  ? "১২টি ভাব, কালপুরুষ নক্ষত্র ও তিল বিচারের সাথে ১০০% নিখুঁত মেলবন্ধন"
                  : language === "hi"
                  ? "12 भाव, कालपुरुष नक्षत्र व तिल विचार के साथ 100% सटीक मिलान"
                  : "Synchronize with 12 Bhavas, Kalpurush 10 Nakshatras & Til Vichar"}
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={enableKundliSync}
              onChange={(e) => setEnableKundliSync(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>

        {enableKundliSync && (
          <div className="pt-3 border-t border-ink-900/10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase text-ink-600 mb-1">
                {language === "bn" ? "জন্ম তারিখ" : language === "hi" ? "जन्म तिथि" : "Birth Date"}
              </label>
              <input
                type="date"
                value={birthDetails.dob}
                onChange={(e) => setBirthDetails((prev) => ({ ...prev, dob: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-ink-900/15 bg-white text-ink-900 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-ink-600 mb-1">
                {language === "bn" ? "জন্ম সময়" : language === "hi" ? "जन्म समय" : "Birth Time"}
              </label>
              <input
                type="time"
                value={birthDetails.tob}
                onChange={(e) => setBirthDetails((prev) => ({ ...prev, tob: e.target.value }))}
                className="w-full px-2.5 py-1.5 rounded-lg border border-ink-900/15 bg-white text-ink-900 text-xs focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-ink-600 mb-1">
                {language === "bn" ? "জন্মস্থান" : language === "hi" ? "जन्म स्थान" : "Birth Place"}
              </label>
              <select
                value={birthDetails.pob}
                onChange={(e) => {
                  const val = e.target.value;
                  const presets: Record<string, { lat: number; lon: number; tz: number }> = {
                    "Kolkata, India": { lat: 22.5726, lon: 88.3639, tz: 5.5 },
                    "New Delhi, India": { lat: 28.6139, lon: 77.209, tz: 5.5 },
                    "Mumbai, India": { lat: 19.076, lon: 72.8777, tz: 5.5 },
                    "Dhaka, Bangladesh": { lat: 23.8103, lon: 90.4125, tz: 6.0 },
                    "Bengaluru, India": { lat: 12.9716, lon: 77.5946, tz: 5.5 },
                  };
                  const match = presets[val] || presets["Kolkata, India"];
                  setBirthDetails((prev) => ({
                    ...prev,
                    pob: val,
                    lat: match.lat,
                    lon: match.lon,
                    tz: match.tz,
                  }));
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-ink-900/15 bg-white text-ink-900 text-xs focus:ring-1 focus:ring-brand-500"
              >
                <option value="Kolkata, India">Kolkata, WB</option>
                <option value="New Delhi, India">New Delhi</option>
                <option value="Mumbai, India">Mumbai</option>
                <option value="Dhaka, Bangladesh">Dhaka</option>
                <option value="Bengaluru, India">Bengaluru</option>
              </select>
            </div>
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
              disabled={busy || (coins > 0 && !canAfford)}
              className={cn(
                "flex-1 transition-all h-11 text-base font-semibold",
                isAligned
                  ? "shadow-glow bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-brand-500 hover:bg-brand-600 text-ink-950",
              )}
            >
              <ScanFace className="size-5" />
              {isAligned ? ui.captureReady : ui.captureManual}
            </Button>
            <Button variant="secondary" onClick={stopCamera} disabled={busy} className="h-11">
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
  const isBn = language === "bn";
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = React.useState<ReadingTab>("features");
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
      "ears",
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

  const triZone = scanResult?.tri_zone_analysis || reading.tri_zone_analysis;
  const mahabhuta = scanResult?.pancha_mahabhuta || reading.pancha_mahabhuta;
  const kundliSync = scanResult?.kundli_sync || reading.kundli_sync;

  const tabs: Array<{ id: ReadingTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "features", label: ui.tabFeatures || (isBn ? "সামুদ্রিক লক্ষণ" : isHi ? "सामुद्रिक लक्षण" : "Features"), icon: ScanFace },
    { id: "trizone", label: ui.tabTriZone || (isBn ? "ত্রিকাল ও আয়ু মণ্ডল" : isHi ? "त्रिकाल व आयु मंडल" : "Tri-Zone"), icon: Calendar },
    { id: "mahabhuta", label: ui.tabMahabhuta || (isBn ? "পঞ্চ মহাভূত ও মহাপুরুষ" : isHi ? "पंच महाभूत व महापुरुष" : "5 Elements"), icon: Flame },
    { id: "kundlisync", label: ui.tabKundliSync || (isBn ? "কুণ্ডলী-মুখ সামঞ্জস্য" : isHi ? "कुंडली संरेखण" : "Kundli Sync"), icon: Compass },
    { id: "forehead", label: ui.tabForehead || (isBn ? "সপ্তগ্রহ কপাল রেখা" : isHi ? "ललाट रेखाएं" : "Forehead Lines"), icon: Sparkles },
    { id: "remedies", label: ui.tabRemedies || (isBn ? "বৈদিক প্রতিকার ও রত্ন" : isHi ? "वैदिक उपाय व रत्न" : "Remedies"), icon: ShieldCheck },
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Top Header Card */}
      <div className="card-glow rounded-2xl p-4 sm:p-6 text-center space-y-4">
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
            {qualityScorePct}% {ui.scanPrecision}
          </span>
          {kundliSync?.sync_available && (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-brand-500/20 text-brand-950 border border-brand-400/40">
              <Compass className="size-3.5 text-brand-800" />
              {isBn ? "১০০% বৈদিক কুণ্ডলী সামঞ্জস্য সক্রিয়" : isHi ? "100% वैदिक कुंडली संरेखित" : "Kundli Synchronized"}
            </span>
          )}
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink-950">
          {ui.resultsTitle}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {groupedFeatures.length}{" "}
          {isBn
            ? "টি প্রধান অঙ্গের বৈদিক সামুদ্রিক শাস্ত্র ও কুষ্ঠি সমন্বিত বিশ্লেষণ"
            : isHi
            ? "मुख्य अंगों का सामुद्रिक शास्त्र व कुंडली संरेखित विश्लेषण"
            : "facial features analyzed with Samudrik Shastra"}
          {reading.coins_charged > 0 && ` · ${reading.coins_charged} ${ui.coinsDebited}`}
        </p>

        {/* 6-Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-ink-900/10 pt-3 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0",
                  isActive
                    ? "bg-brand-500 text-ink-950 shadow-sm border border-brand-400/40 font-bold"
                    : "text-ink-700 hover:text-ink-950 hover:bg-cream-200/60 bg-cream-100/50 border border-ink-900/5",
                )}
              >
                <Icon className={cn("size-3.5", isActive ? "text-ink-950" : "text-brand-700")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- Tab 1: Samudrika Lakshana (Features) ---------------- */}
      {activeTab === "features" && (
        <div className="space-y-6">
          {/* View Mode Switcher */}
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1 rounded-full bg-cream-200/70 p-1 border border-ink-900/10 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("grouped")}
                className={cn(
                  "rounded-full px-3 py-1 font-semibold transition-all cursor-pointer",
                  viewMode === "grouped" ? "bg-white text-ink-950 shadow-sm" : "text-ink-700/80 hover:text-ink-950",
                )}
              >
                {isBn ? "অঙ্গভিত্তিক সম্পূর্ণ বিশ্লেষণ" : isHi ? "अंगवार विस्तृत विश्लेषण" : "Detailed by Feature"}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("primary")}
                className={cn(
                  "rounded-full px-3 py-1 font-semibold transition-all cursor-pointer",
                  viewMode === "primary" ? "bg-white text-ink-950 shadow-sm" : "text-ink-700/80 hover:text-ink-950",
                )}
              >
                {isBn ? "১টি করে প্রধান লক্ষণ" : isHi ? "मुख्य लक्षण मात्र" : "Primary Traits Only"}
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
                    {isBn ? "মুখাবয়ব বিশ্লেষণ মানচিত্র" : isHi ? "मुखाकृति विश्लेषण मानचित्र" : "Facial Analysis Mapping"}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-xl border border-brand-400/20 shadow-inner bg-ink-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={scanResult.visualization_image}
                    alt="Facial Analysis"
                    className="size-full object-cover"
                  />
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-cream-100/70 p-3.5 rounded-xl border border-ink-900/5 space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-ink-900">
                      <Compass className="size-4 text-brand-700" />
                      <span>{isBn ? "মাথার অবস্থান" : isHi ? "सिर की स्थिति" : "Head Orientation"}</span>
                    </div>
                    {scanResult.head_pose ? (
                      <div className="grid grid-cols-3 gap-2 text-center pt-1">
                        <div className="bg-white p-2 rounded-lg border border-ink-900/5 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground uppercase">{isBn ? "পার্শ্ব" : "Yaw"}</div>
                          <div className="text-sm font-bold text-ink-900">{scanResult.head_pose.yaw}°</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-ink-900/5 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground uppercase">{isBn ? "উল্লম্ব" : "Pitch"}</div>
                          <div className="text-sm font-bold text-ink-900">{scanResult.head_pose.pitch}°</div>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-ink-900/5 shadow-2xs">
                          <div className="text-[10px] text-muted-foreground uppercase">{isBn ? "হেলন" : "Roll"}</div>
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
                        {isBn ? "স্পষ্টতা" : "Clarity"}
                      </span>
                      <span className="text-sm font-bold text-ink-900">
                        {scanResult.quality_checks.blur_score.toFixed(1)} / 100
                      </span>
                    </div>
                    <div className="bg-cream-100/70 p-3 rounded-xl border border-ink-900/5">
                      <span className="text-[10px] text-muted-foreground uppercase block">
                        {isBn ? "ফ্রেমের অনুপাত" : "Frame Coverage"}
                      </span>
                      <span className="text-sm font-bold text-ink-900">
                        {scanResult.quality_checks.face_coverage_pct >= 1
                          ? `${scanResult.quality_checks.face_coverage_pct.toFixed(1)}%`
                          : `${(scanResult.quality_checks.face_coverage_pct * 100).toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 gap-4">
            {groupedFeatures.map(({ feature, items }) => {
              const displayItems = viewMode === "primary" ? [items[0]] : items;
              const firstTr = translateReadingSection(displayItems[0], language);

              return (
                <article
                  key={feature}
                  className="card-surface p-6 rounded-2xl border border-ink-900/10 shadow-soft hover:shadow-lift transition-shadow space-y-4"
                >
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
                                {isBn ? `বৈশিষ্ট্য ${idx + 1}` : isHi ? `लक्षण ${idx + 1}` : `Aspect ${idx + 1}`}
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
        </div>
      )}

      {/* ---------------- Tab 2: Tri-Zone Timeline ---------------- */}
      {activeTab === "trizone" && (
        <div className="space-y-6">
          {triZone ? (
            <>
              <div className="card-surface p-6 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-cream-50 via-cream-100/70 to-brand-50/30 space-y-4 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-900/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-900 shadow-2xs">
                      <Calendar className="size-4.5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-ink-950">
                        {isBn ? "ত্রিকাল ও আয়ু মণ্ডল বিশ্লেষণ (০–২৮, ২৮–৫০, ৫০+ বছর)" : isHi ? "त्रिकाल व आयु मंडल विश्लेषण" : "Tri-Zone Temporal Life-Span Balance"}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {isBn ? "কপাল (পূর্বপুণ্য/বাল্যকাল), মধ্যভাগ (পুরুষার্থ/যৌবন), ও চিবুক (স্থায়িত্ব/বার্ধক্য)" : "Samata Tri-Kuta 1:1:1 Classical Vedic Proportion"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-3 py-1 rounded-full bg-white font-bold text-brand-950 border border-brand-300 shadow-2xs">
                      {triZone.ratio_str}
                    </span>
                    <span
                      className={cn(
                        "text-xs px-3 py-1 rounded-full font-bold",
                        triZone.status === "balanced"
                          ? "bg-emerald-500/15 text-emerald-900 border border-emerald-400/30"
                          : "bg-amber-500/15 text-amber-900 border border-amber-400/30",
                      )}
                    >
                      {triZone.status === "balanced"
                        ? (isBn ? "আদর্শ সমতা ত্রিকূট সমন্বয়" : isHi ? "आदर्श समता त्रिकूट" : "Harmonious Balance")
                        : (isBn ? "অঞ্চলীয় প্রভাব লক্ষণ" : isHi ? "क्षेत्रीय प्रभाव" : "Zonal Prominence")}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/90 border border-brand-300/30 text-xs leading-relaxed text-ink-850">
                  {isBn ? (triZone.desc_bn || triZone.desc_en) : isHi ? (triZone.desc_hi || triZone.desc_en) : triZone.desc_en}
                </div>
              </div>

              {/* 3 Era Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {triZone.eras.map((era, idx) => (
                  <div
                    key={idx}
                    className="card-surface p-5 rounded-2xl border border-ink-900/10 space-y-3 bg-white shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {isBn ? (era.era_name_bn || era.era_name) : era.era_name} ({era.age_span})
                      </span>
                      <span className="font-mono text-sm font-bold text-ink-900">
                        {era.score_pct}%
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-ink-950">
                      {isBn ? (era.era_name_bn || era.era_name) : era.era_name}
                    </h4>
                    <div className="w-full bg-cream-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={cn(
                          "h-2 rounded-full transition-all duration-500",
                          idx === 0 ? "bg-brand-600" : idx === 1 ? "bg-amber-600" : "bg-indigo-600",
                        )}
                        style={{ width: `${Math.min(era.score_pct * 2.5, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-ink-700 leading-relaxed">
                      {isBn ? (era.forecast_bn || era.forecast_en) : era.forecast_en}
                    </p>
                    {era.rulers && (
                      <div className="text-[10px] text-muted-foreground pt-1 border-t border-ink-900/5">
                        {isBn ? `অধিপতি ও প্রভাব: ${era.rulers}` : `Rulers: ${era.rulers}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground bg-cream-50 rounded-2xl border border-ink-900/10">
              {isBn ? "ত্রিকাল অনুপাত বিশ্লেষণ প্রক্রিয়াধীন…" : "Tri-Zone analysis data processing…"}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Tab 3: Pancha Mahabhuta & Mahapurusha ---------------- */}
      {activeTab === "mahabhuta" && (
        <div className="space-y-6">
          {mahabhuta ? (
            <>
              <div className="card-surface p-6 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-amber-50/40 via-cream-50 to-orange-50/30 space-y-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-800 shadow-2xs">
                      <Flame className="size-5" />
                    </span>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-orange-900">
                        {isBn ? "প্রধান বৈদিক তত্ত্ব" : isHi ? "प्रमुख वैदिक तत्व" : "Dominant Vedic Element"}
                      </div>
                      <h3 className="font-display text-lg font-bold text-ink-950">
                        {isBn ? (mahabhuta.element_bn || mahabhuta.dominant_element) : isHi ? (mahabhuta.element_hi || mahabhuta.dominant_element) : mahabhuta.dominant_element}
                      </h3>
                    </div>
                  </div>

                  {mahabhuta.mahapurusha && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-amber-500/20 text-brand-950 border border-brand-400/40 text-xs font-bold">
                      <Sparkles className="size-3.5 text-brand-800" />
                      <span>{isBn ? (mahabhuta.mahapurusha_bn || mahabhuta.mahapurusha) : mahabhuta.mahapurusha}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs leading-relaxed text-ink-800 p-3.5 rounded-xl bg-white/80 border border-brand-200/40">
                  {isBn ? (mahabhuta.traits_bn || mahabhuta.traits_en) : isHi ? (mahabhuta.traits_hi || mahabhuta.traits_en) : mahabhuta.traits_en}
                </p>

                {/* 5 Element Meters */}
                <div className="space-y-2.5 pt-1">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-ink-600">
                    {isBn ? "পঞ্চ মহাভূত শতাংশ বিভাজন" : isHi ? "पंच महाभूत प्रतिशत विभाजन" : "Pancha Mahabhuta Distribution"}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                    {/* Fire */}
                    <div className="p-3 rounded-xl bg-white border border-rose-200/60 shadow-2xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-rose-700 uppercase block">{isBn ? "অগ্নি (মঙ্গল)" : "Fire (Mars)"}</span>
                      <div className="text-base font-bold text-rose-950">{mahabhuta.scores.fire ?? 0}%</div>
                      <div className="w-full bg-rose-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${mahabhuta.scores.fire ?? 0}%` }} />
                      </div>
                    </div>

                    {/* Earth */}
                    <div className="p-3 rounded-xl bg-white border border-emerald-200/60 shadow-2xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block">{isBn ? "পৃথিবী (বুধ)" : "Earth (Mercury)"}</span>
                      <div className="text-base font-bold text-emerald-950">{mahabhuta.scores.earth ?? 0}%</div>
                      <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${mahabhuta.scores.earth ?? 0}%` }} />
                      </div>
                    </div>

                    {/* Water */}
                    <div className="p-3 rounded-xl bg-white border border-sky-200/60 shadow-2xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-sky-700 uppercase block">{isBn ? "জল (শুক্র)" : "Water (Venus)"}</span>
                      <div className="text-base font-bold text-sky-950">{mahabhuta.scores.water ?? 0}%</div>
                      <div className="w-full bg-sky-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${mahabhuta.scores.water ?? 0}%` }} />
                      </div>
                    </div>

                    {/* Air */}
                    <div className="p-3 rounded-xl bg-white border border-violet-200/60 shadow-2xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-violet-700 uppercase block">{isBn ? "বায়ু (শনি)" : "Air (Saturn)"}</span>
                      <div className="text-base font-bold text-violet-950">{mahabhuta.scores.air ?? 0}%</div>
                      <div className="w-full bg-violet-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: `${mahabhuta.scores.air ?? 0}%` }} />
                      </div>
                    </div>

                    {/* Ether */}
                    <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs text-center space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">{isBn ? "আকাশ (বৃহস্পতি)" : "Ether (Jupiter)"}</span>
                      <div className="text-base font-bold text-amber-950">{mahabhuta.scores.ether ?? 0}%</div>
                      <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${mahabhuta.scores.ether ?? 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-muted-foreground bg-cream-50 rounded-2xl border border-ink-900/10">
              {isBn ? "পঞ্চ মহাভূত গণনা উপলব্ধ নেই।" : "5 Elements data not available."}
            </div>
          )}
        </div>
      )}

      {/* ---------------- Tab 4: Dharmender Kumar Bansal Kundli-Face Alignment ---------------- */}
      {activeTab === "kundlisync" && (
        <div className="space-y-6">
          {kundliSync?.sync_available ? (
            <>
              {/* Lagna & Lagna Lord Banner */}
              <div className="card-surface p-6 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-cream-50 via-cream-100/70 to-brand-50/30 space-y-4 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-900/10 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-900 shadow-2xs">
                      <Compass className="size-5" />
                    </span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-brand-900">
                        {isBn ? "ধর্মেন্দ্র কুমার বনসল বৈদিক কুণ্ডলী-মুখ সমন্বয়" : "Dharmender Bansal Kundli-Face Alignment"}
                      </div>
                      <h3 className="font-display text-lg font-bold text-ink-950">
                        {isBn ? kundliSync.ascendant_sign_bn : isHi ? kundliSync.ascendant_sign_hi : kundliSync.ascendant_sign} (লগ্নেশ: {kundliSync.ascendant_lord})
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-brand-500/15 text-brand-950 border border-brand-400/30">
                    {isBn ? "১০০% নির্ভুল বৈদিক সূত্র" : "Classical Vedic Rules"}
                  </span>
                </div>

                {/* Lagna Physiognomy & First House Conjunction */}
                {kundliSync.first_house_conjunction && (
                  <div className="p-4 rounded-xl bg-white/90 border border-brand-300/30 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-brand-700" />
                      <h4 className="font-display text-sm font-bold text-ink-950">
                        {isBn ? kundliSync.first_house_conjunction.title_bn : isHi ? kundliSync.first_house_conjunction.title_hi : kundliSync.first_house_conjunction.title_en}
                      </h4>
                    </div>
                    <p className="text-xs leading-relaxed text-ink-800">
                      {isBn ? kundliSync.first_house_conjunction.meaning_bn : isHi ? kundliSync.first_house_conjunction.meaning_hi : kundliSync.first_house_conjunction.meaning_en}
                    </p>
                  </div>
                )}

                {/* Kalpurush 10 Nakshatras Highlight */}
                {kundliSync.kalpurush_highlight && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-brand-50/50 border border-amber-300/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <BookOpen className="size-3.5 text-amber-800" />
                        {isBn ? "কালপুরুষের মুখস্থ ১০ নক্ষত্র চক্র" : "Kalpurush 10 Nakshatras on Face"}
                      </span>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {kundliSync.kalpurush_highlight.nakshatra} ({isBn ? "অধিপতি:" : "Lord:"} {kundliSync.kalpurush_highlight.lord})
                      </span>
                    </div>
                    <p className="text-xs text-ink-800 leading-relaxed">
                      {isBn ? kundliSync.kalpurush_highlight.explanation_bn : kundliSync.kalpurush_highlight.explanation_en}
                    </p>
                  </div>
                )}
              </div>

              {/* 12 Bhavas to 12 Face Zones Grid */}
              {kundliSync.house_correlations && kundliSync.house_correlations.length > 0 && (
                <div className="card-surface p-6 rounded-2xl border border-ink-900/10 space-y-4 shadow-soft">
                  <div className="flex items-center justify-between border-b border-ink-900/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="size-4 text-brand-700" />
                      <h3 className="font-display text-base font-bold text-ink-950">
                        {isBn ? "১২টি ভাব ও মুখের অঙ্গের বৈদিক অবস্থান" : isHi ? "12 भाव व चेहरे के अंगों का संरेखण" : "12 Bhavas to Face Zones Correlation"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {kundliSync.house_correlations.map((h) => (
                      <div
                        key={h.house}
                        className="p-3.5 rounded-xl bg-white border border-ink-900/10 shadow-2xs space-y-2 hover:border-brand-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex size-6 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-900">
                            {h.house}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-800 bg-brand-50 px-2 py-0.5 rounded">
                            {isBn ? h.face_part_bn : h.face_part}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-ink-950 text-xs">
                            {isBn ? h.house_name_bn : h.house_name}
                          </div>
                          {h.planets_occupying && (
                            <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
                              {isBn ? `অবস্থিত গ্রহ: ${h.planets_occupying}` : `Occupying: ${h.planets_occupying}`}
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-700 leading-relaxed border-t border-ink-900/5 pt-1.5">
                          {isBn ? h.significance_bn : h.significance_en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Til & Masaka Vichar (Bansal astrological moles & marks) */}
              {kundliSync.til_masaka && kundliSync.til_masaka.length > 0 && (
                <div className="card-surface p-6 rounded-2xl border border-ink-900/10 space-y-4 shadow-soft">
                  <div className="flex items-center justify-between border-b border-ink-900/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="size-4 text-brand-700" />
                      <h3 className="font-display text-base font-bold text-ink-950">
                        {isBn ? "তিল ও মসক বিচার (মুখের চিহ্নের সাথে শরীরের মিল)" : "Til & Masaka Vichar (Facial Marks to Body Alignment)"}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {kundliSync.til_masaka.map((til, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white border border-ink-900/10 shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink-900 text-xs">
                            {isBn ? til.zone_bn : til.zone_en}
                          </span>
                          <span className="text-[10px] font-bold text-brand-800 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                            {til.planet}
                          </span>
                        </div>
                        <div className="text-[11px] text-brand-950 font-medium">
                          {isBn ? til.type_bn : til.type_en}
                        </div>
                        <p className="text-[11px] text-ink-700 leading-relaxed pt-1 border-t border-ink-900/5">
                          {isBn ? til.body_correlation_bn : til.body_correlation_en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card-surface p-8 text-center space-y-4 rounded-2xl border border-brand-400/30 bg-gradient-to-br from-cream-50 to-brand-50/20 shadow-soft">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-500/15 text-brand-900">
                <Compass className="size-7" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink-950">
                  {isBn ? "বৈদিক কুণ্ডলী সামঞ্জস্য সংযুক্ত করুন" : "Enable Vedic Kundli Synchronization"}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {isBn
                    ? "আপনার জন্ম তারিখ ও সময় প্রদান করে স্ক্যান করলে ধর্মেন্দ্র কুমার বনসলের গ্রন্থানুসারে ১২টি ভাব, লগ্ন ও কালপুরুষের নক্ষত্র সমন্বিত ১০০% নিখুঁত জ্যোতিষীয় সামঞ্জস্য উন্মোচিত হবে।"
                    : "Enter your birth details before scanning to unlock 100% accurate correlation with 12 Bhavas, Lagna Lord, and Kalpurush Nakshatras."}
                </p>
              </div>
              <Button onClick={onAgain} variant="secondary">
                <RefreshCw className="size-4" />
                {isBn ? "নতুন স্ক্যানে জন্ম বিবরণ যোগ করুন" : "Scan Again with Birth Details"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ---------------- Tab 5: Planetary Forehead Lines ---------------- */}
      {activeTab === "forehead" && (
        <div className="space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-brand-500/20 shadow-soft bg-gradient-to-br from-cream-50 via-cream-100/60 to-brand-50/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-900/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-900 shadow-2xs">
                  <Sparkles className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-950">
                    {isBn
                      ? "কপালের রেখা ও গ্রহীয় ভাঁজ বিশ্লেষণ"
                      : isHi
                      ? "माथे की रेखाएं व ग्रह सिलवटें विश्लेषण"
                      : "Forehead Lines & Planetary Folds Analysis"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {isBn
                      ? "বৈদিক সমুদ্র শাস্ত্র গ্রহীয় রেখা বিশ্লেষণ (শনি, বৃহস্পতি, মঙ্গল, সূর্য, চন্দ্র, শুক্র, বুধ)"
                      : isHi
                      ? "वैदिक सामुद्रिक शास्त्र ग्रहीय रेखा विश्लेषण"
                      : "Vedic Samudrika Shastra planetary crease line biometrics"}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold bg-brand-500/15 text-brand-900 border border-brand-400/30">
                {scanResult?.forehead_lines_count === 0
                  ? (isBn ? "মসৃণ কপাল (০টি রেখা)" : isHi ? "चिकना माथा (0 रेखाएं)" : "Smooth Forehead (0 lines)")
                  : `${scanResult?.forehead_lines_count || 0} ${isBn ? "টি গ্রহীয় রেখা সনাক্ত" : isHi ? "ग्रहीय रेखाएं मिलीं" : "Planetary Lines Detected"}`}
              </span>
            </div>

            {/* Shastra Interpretation Box */}
            {scanResult?.forehead_lines_shastra && (
              <div className="p-4 rounded-xl bg-white/90 border border-brand-300/30 shadow-xs space-y-1.5">
                <h4 className="font-display text-sm font-bold text-brand-950 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-brand-600" />
                  {isBn
                    ? scanResult.forehead_lines_shastra.title_bn || scanResult.forehead_lines_shastra.title_en
                    : scanResult.forehead_lines_shastra.title_en}
                </h4>
                <p className="text-xs leading-relaxed text-ink-800">
                  {isBn
                    ? scanResult.forehead_lines_shastra.meaning_bn || scanResult.forehead_lines_shastra.meaning_en
                    : scanResult.forehead_lines_shastra.meaning_en}
                </p>
              </div>
            )}

            {/* Individual Detected Planetary Lines Grid */}
            {scanResult?.forehead_lines_data && scanResult.forehead_lines_data.length > 0 && (
              <div className="space-y-2 pt-1">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-ink-600">
                  {isBn ? "সনাক্তকৃত গ্রহীয় রেখাসমূহ" : isHi ? "पहचानी गई ग्रहीय रेखाएं" : "Identified Planetary Tracks"}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scanResult.forehead_lines_data.map((lineTrack, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/80 border border-ink-900/5 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex size-5 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-900">
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-bold text-ink-900">{lineTrack.planet_name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            {isBn ? "প্রস্থ:" : "Width:"} {lineTrack.width_px}px · {lineTrack.is_continuous ? (isBn ? "অটুট" : "Continuous") : (isBn ? "খণ্ডিত" : "Segmented")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-200">
                          {Math.round(lineTrack.prominence * 100)}% {isBn ? "গভীরতা" : "depth"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Tab 6: Vedic Remedies & Gemstones ---------------- */}
      {activeTab === "remedies" && (
        <div className="space-y-6">
          <div className="card-surface p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-cream-50 via-emerald-50/20 to-brand-50/30 space-y-4 shadow-soft">
            <div className="flex items-center justify-between border-b border-ink-900/10 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-800 shadow-2xs">
                  <ShieldCheck className="size-4.5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink-950">
                    {isBn ? "সামুদ্রিক ও বৈদিক শাস্ত্রীয় প্রতিকার (Upayas)" : isHi ? "सामुद्रिक व वैदिक उपाय" : "Classical Vedic Remedies & Upayas"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {isBn ? "মুখাবয়ব ও কুণ্ডলীভিত্তিক রত্ন, বীজমন্ত্র ও জীবনচর্চার শাস্ত্রীয় নির্দেশনা" : "Vedic Gemstones, Mantras & Remedial Practices"}
                  </p>
                </div>
              </div>
            </div>

            {kundliSync?.remedies && kundliSync.remedies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {kundliSync.remedies.map((rem, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-ink-900/10 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {rem.category}
                      </span>
                      {rem.gemstone && (
                        <span className="text-[11px] font-bold text-brand-900 bg-brand-50 px-2 py-0.5 rounded">
                          {rem.gemstone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-800 leading-relaxed">
                      {isBn ? rem.upaya_bn || rem.upaya_en : rem.upaya_en}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-ink-900/10 shadow-2xs space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-brand-900 font-bold">
                    <Sparkles className="size-4" />
                    <span>{isBn ? "সামুদ্রিক কপাল ও তেজ বর্ধন উপাচার" : "Samudrika Tejas Upaya"}</span>
                  </div>
                  <p className="text-ink-700 leading-relaxed">
                    {isBn
                      ? "প্রতিদিন প্রাতঃকালে তাম্র পাত্রে সূর্যদেবকে অর্ঘ্য নিবেদন করুন এবং কপালে চন্দন বা জাফরানের তিলক ধারণ করুন। এটি মুখমণ্ডলের ঔজ্জ্বল্য ও সৌভাগ্য বৃদ্ধি করে।"
                      : "Offer water to Surya Deva in a copper vessel at sunrise and apply pure sandalwood tilak to enhance forehead vitality and auspicious aura."}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-ink-900/10 shadow-2xs space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-brand-900 font-bold">
                    <ShieldCheck className="size-4" />
                    <span>{isBn ? "নয়ন ও দৃষ্টি সুরক্ষা" : "Chakshu & Drashti Protection"}</span>
                  </div>
                  <p className="text-ink-700 leading-relaxed">
                    {isBn
                      ? "চক্ষুর তেজ রক্ষার জন্য নিয়মিত গায়ত্রী মন্ত্র জপ করুন এবং ত্রাটক ধ্যান অভ্যাস করুন। এটি দৃষ্টির সংবেদনশীলতা ও ষষ্ঠ ইন্দ্রিয় জাগ্রত করে।"
                      : "Practice Trataka meditation and regular recitation of Gayatri Mantra to protect eyesight and awaken inner intuition."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
              {isBn
                ? `${Object.keys(scanResult.measurement_details).length}টি বৈদিক জ্যামিতিক অনুপাত ও পরিমাপ টেবিল দেখুন`
                : isHi
                ? `${Object.keys(scanResult.measurement_details).length} वैदिक ज्यामितीय अनुपात व माप तालिका देखें`
                : `View ${Object.keys(scanResult.measurement_details).length} Vedic Biometric Proportions & Ratios Table`}
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
