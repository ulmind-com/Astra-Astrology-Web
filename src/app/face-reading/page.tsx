"use client";

/**
 * Face reading — with real-time alignment feedback and auto-capture.
 *
 * Flow:
 * 1. User opens camera → live feed appears inside an oval guide.
 * 2. Every ~80ms we run a lightweight face detection (VIDEO mode) and show:
 *    - A colour-coded oval border (red → amber → green) reflecting alignment.
 *    - A circular progress ring that fills as quality stays above threshold.
 *    - A text hint ("Move closer", "Look straight", "Hold still…").
 * 3. When quality ≥ 0.65 for 1.5 s straight, we auto-capture the frame,
 *    run the full measurement, and send the ratios to the backend.
 * 4. The photo never leaves this device — only ~20 ratios are transmitted.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Camera,
  Check,
  Loader2,
  RefreshCw,
  ScanFace,
  Upload,
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
const HOLD_DURATION_MS = 1500;
/** Quality threshold to start counting the hold-still timer. */
const GOOD_QUALITY = 0.65;
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
      toast.error(e.message);
      setStage("intro");
    },
  });

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="text-center">
          <span className="medallion mx-auto flex size-16 items-center justify-center rounded-full">
            <ScanFace className="size-7" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">
            Face reading
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Samudrik Shastra reads character in the proportions of a face — the
            forehead, the eyes, the nose, the set of the mouth and jaw.
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
        ) : (
          <Capture
            coins={availability.coins}
            canAfford={availability.can_afford}
            balance={availability.balance_coins}
            busy={submit.isPending || stage === "measuring"}
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

  // Real-time feedback state
  const [faceStatus, setFaceStatus] = React.useState<LiveFaceStatus | null>(null);
  /** 0→1, how far through the "hold still" countdown we are. */
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
        if (capturingRef.current) return; // might have captured while awaiting

        setFaceStatus(status);

        if (status.detected && status.quality >= GOOD_QUALITY && !status.warning) {
          // Face is well-aligned — advance the hold timer
          if (holdStartRef.current === 0) holdStartRef.current = now;
          const elapsed = now - holdStartRef.current;
          const progress = Math.min(1, elapsed / HOLD_DURATION_MS);
          setHoldProgress(progress);

          if (progress >= 1) {
            // Auto-capture!
            capturingRef.current = true;
            setHoldProgress(1);
            await doCapture();
            return; // stop the loop
          }
        } else {
          // Not aligned — reset hold
          holdStartRef.current = 0;
          setHoldProgress(0);
        }
      } catch {
        // Detection can occasionally throw on bad frames — just skip.
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function doCapture() {
    if (!videoRef.current) return;
    setError(null);
    onMeasuring();
    try {
      const result = await measureImage(videoRef.current);
      if (result.warning) {
        // Shouldn't happen often after the live check, but handle it
        setError(result.warning);
        capturingRef.current = false;
        holdStartRef.current = 0;
        setHoldProgress(0);
        onCancelled();
        // Restart the loop
        runDetectionLoop();
        return;
      }
      stopCamera();
      onMeasured(result);
    } catch (e) {
      setError(
        e instanceof NoFaceError
          ? e.message
          : "Could not measure that photo. Try again in better light.",
      );
      capturingRef.current = false;
      holdStartRef.current = 0;
      setHoldProgress(0);
      onCancelled();
      runDetectionLoop();
    }
  }

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
      // Start the real-time detection loop
      runDetectionLoop();
    } catch {
      setError(
        "Could not open the camera. Allow camera access, or upload a photo instead.",
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
      if (result.warning) {
        setError(result.warning);
        onCancelled();
        return;
      }
      onMeasured(result);
    } catch (e) {
      setError(
        e instanceof NoFaceError
          ? e.message
          : "Could not measure that photo. Try again in better light.",
      );
      onCancelled();
    }
  }

  // Derive the guide colour and hint text from the live status
  const guideState = React.useMemo(() => {
    if (!faceStatus) return { color: "border-brand-300/40", hint: "Detecting face…", tone: "neutral" as const };
    if (!faceStatus.detected) return { color: "border-red-400/80", hint: "Move your face into the oval", tone: "bad" as const };
    if (faceStatus.warning) return { color: "border-amber-400/80", hint: faceStatus.warning, tone: "warn" as const };
    if (holdProgress < 1) return { color: "border-emerald-400/90", hint: "Perfect — hold still…", tone: "good" as const };
    return { color: "border-emerald-400", hint: "Captured!", tone: "good" as const };
  }, [faceStatus, holdProgress]);

  // SVG progress ring params
  const ringRadius = 48;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - holdProgress);

  return (
    <div className="mt-8 space-y-5">
      <div className="card-surface overflow-hidden">
        <div className="relative aspect-[4/3] bg-ink-900/5">
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn("size-full object-cover [transform:scaleX(-1)]", !live && "hidden")}
          />
          {!live && (
            <div className="flex size-full flex-col items-center justify-center gap-3 p-8 text-center">
              <Camera className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Face the camera straight on, in even light.
                <br />
                No glasses, hair off the forehead.
              </p>
            </div>
          )}

          {/* ─── Live alignment overlay ─── */}
          {live && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Oval guide with colour feedback */}
              <div
                className={cn(
                  "relative h-[78%] w-[54%] rounded-[50%] border-[3px] transition-colors duration-300",
                  guideState.color,
                )}
              >
                {/* Corner scan lines for visual effect */}
                <span className="absolute -left-1 -top-1 h-5 w-5 rounded-tl-full border-l-2 border-t-2 border-inherit" />
                <span className="absolute -right-1 -top-1 h-5 w-5 rounded-tr-full border-r-2 border-t-2 border-inherit" />
                <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-bl-full border-b-2 border-l-2 border-inherit" />
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-br-full border-b-2 border-r-2 border-inherit" />
              </div>

              {/* Progress ring — small circular indicator */}
              {faceStatus?.detected && !faceStatus.warning && holdProgress > 0 && (
                <div className="absolute left-1/2 top-[12%] -translate-x-1/2">
                  <svg width="108" height="108" className="drop-shadow-lg">
                    {/* Background ring */}
                    <circle
                      cx="54" cy="54" r={ringRadius}
                      fill="none"
                      stroke="rgb(255 255 255 / 0.12)"
                      strokeWidth="4"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="54" cy="54" r={ringRadius}
                      fill="none"
                      stroke="rgb(52 211 153 / 0.9)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      strokeDashoffset={ringOffset}
                      className="transition-[stroke-dashoffset] duration-100 ease-linear"
                      style={{ transform: "rotate(-90deg)", transformOrigin: "54px 54px" }}
                    />
                    {/* Percentage text */}
                    <text
                      x="54" y="54"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-white text-lg font-bold"
                      style={{ fontSize: "18px", fontFamily: "var(--font-display)" }}
                    >
                      {Math.round(holdProgress * 100)}%
                    </text>
                  </svg>
                </div>
              )}

              {/* Hint text at the bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors duration-300",
                    guideState.tone === "bad" && "bg-red-500/20 text-red-200",
                    guideState.tone === "warn" && "bg-amber-500/20 text-amber-200",
                    guideState.tone === "good" && "bg-emerald-500/20 text-emerald-200",
                    guideState.tone === "neutral" && "bg-white/10 text-white/70",
                  )}
                >
                  {guideState.tone === "good" && holdProgress < 1 && (
                    <Loader2 className="mr-1.5 inline size-3 animate-spin" />
                  )}
                  {guideState.hint}
                </span>
              </div>

              {/* Quality score badge */}
              {faceStatus?.detected && (
                <div className="absolute right-3 top-3">
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm",
                      (faceStatus.quality ?? 0) >= GOOD_QUALITY
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300",
                    )}
                  >
                    {Math.round((faceStatus.quality ?? 0) * 100)}% aligned
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          {live ? (
            <>
              <Button
                onClick={() => videoRef.current && doCapture()}
                loading={busy}
                className="flex-1"
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
              <Button onClick={startCamera} disabled={busy} loading={modelLoading} className="flex-1">
                <Camera className="size-4" />
                Use the camera
              </Button>
              <Button
                variant="secondary"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
              >
                <Upload className="size-4" />
                Upload a photo
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

      {busy && (
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Measuring facial proportions…
        </p>
      )}

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

      <div className="card-surface p-5 text-sm">
        <p className="font-semibold">
          <Check className="mr-1.5 inline size-4 text-success" />
          Your photo never leaves this device
        </p>
        <p className="mt-1.5 leading-relaxed text-muted-foreground">
          The measuring happens here, in your browser. What we receive is about
          twenty proportions — the width of your nose against the width of your
          face, and so on. The picture itself is never uploaded and never
          stored.
        </p>
        {coins > 0 && (
          <p className="mt-3 text-muted-foreground">
            A reading costs <strong className="text-foreground">{coins} coins</strong>,
            taken when the reading is made.
          </p>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- reading */
function Reading({ reading, onAgain }: { reading: FaceReading; onAgain: () => void }) {
  return (
    <div className="mt-8 space-y-4">
      <div className="card-glow rounded-2xl p-6 text-center">
        <p className="font-display text-lg font-semibold">Your reading</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {reading.sections.length} features read
          {reading.coins_charged > 0 && ` · ${reading.coins_charged} coins`}
        </p>
      </div>

      {reading.sections.map((section, i) => (
        <article key={`${section.feature}-${section.option}-${i}`} className="card-surface p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">{section.label}</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.feature_label}
              {section.area ? ` · ${section.area}` : ""}
            </span>
          </div>
          <p className="mt-3 leading-relaxed text-muted-foreground">{section.meaning}</p>
        </article>
      ))}

      <p className="px-2 text-xs leading-relaxed text-muted-foreground">
        Face reading is a traditional practice, offered here for reflection. It
        is not a medical, psychological or financial assessment, and nothing in
        it should be treated as one.
      </p>

      <Button variant="secondary" onClick={onAgain} className="w-full">
        <RefreshCw className="size-4" />
        Read another face
      </Button>
    </div>
  );
}
