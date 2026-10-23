"use client";

/**
 * Palm reading.
 *
 * The page is built around one idea: show the user what was actually read. A palm
 * reading is only worth as much as the tracing behind it, so the live preview shows
 * the tracking while the shot is still being framed, the traced overlay sits beside
 * the findings, each finding states the measurement that produced it and the
 * document the rule came from, and anything the photo could not support is listed
 * as not assessed rather than quietly left out.
 */

import * as React from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  FileText,
  Hand,
  Info,
  Loader2,
  RefreshCw,
  Ruler,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { palmReadingApi } from "@/lib/api";
import {
  captureFrame,
  detectFromVideo,
  drawHandOverlay,
  type PalmStatus,
} from "@/lib/palm-measure";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type {
  PalmReadingAvailability,
  PalmScanResponse,
} from "@/types";

const CREASE_COLOUR: Record<string, string> = {
  heart: "bg-rose-500",
  head: "bg-blue-500",
  life: "bg-emerald-500",
  fate: "bg-amber-500",
};

export default function PalmReadingPage() {
  const { isSignedIn } = useAuth();

  const [availability, setAvailability] = React.useState<PalmReadingAvailability | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const [result, setResult] = React.useState<PalmScanResponse | null>(null);
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
  // Guards against the capture firing twice while the first upload is in flight.
  const capturingRef = React.useRef(false);
  // The hand has to stay aligned for a moment before the shot is taken, so a
  // frame that happens to pass while the hand is moving is not what gets used.
  const alignedSinceRef = React.useRef<number | null>(null);

  const HOLD_MS = 900;

  // Cost and guidance are fetched before the camera opens, so the user knows what
  // it costs and what makes a readable photo before they take one.
  React.useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    palmReadingApi
      .availability()
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch(() => {
        /* The page still works; the cost line is simply not shown. */
      });
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  // Revoke the object URL when it is replaced, or the blob leaks for the session.
  React.useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /** Resolve once the video element has been committed to the DOM, or give up. */
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

  // Releasing the camera when the page goes away matters: a stream left running
  // keeps the recording indicator lit and drains the battery.
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
        toast.success(`${response.sections.length} findings from your palm.`);
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          120,
        );
      } else {
        toast.info(response.message || "That frame could not be read.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The scan could not be completed.");
    } finally {
      setScanning(false);
      capturingRef.current = false;
    }
  }, []);

  const startCamera = React.useCallback(async () => {
    setCameraError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // The rear camera focuses closer and resolves the creases far better than
        // a selfie camera, so it is requested first.
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);

      // The <video> is only mounted once cameraOn is true, so it does not exist
      // yet on this tick. Wait for React to commit it before attaching the stream;
      // without this the camera light comes on and the preview stays blank.
      const video = await waitForVideo();
      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setCameraOn(false);
        setCameraError("The camera preview could not be started. Please try again.");
        return;
      }
      video.srcObject = stream;
      await video.play().catch(() => {
        /* Some browsers reject play() until the user gestures again; the loop
           below still reads frames once the element starts. */
      });

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

          // Hold-to-capture. The hand must stay aligned for HOLD_MS before the
          // frame is taken, so a shot is never grabbed mid-movement.
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
          // A single dropped frame is not worth stopping the preview for.
        }

        frameRef.current = requestAnimationFrame(() => void loop());
      };

      frameRef.current = requestAnimationFrame(() => void loop());
    } catch (error) {
      setCameraOn(false);
      const name = (error as { name?: string })?.name;
      setCameraError(
        name === "NotAllowedError"
          ? "Camera access was refused. Allow it in your browser settings, or upload a photo instead."
          : name === "NotFoundError"
            ? "No camera was found on this device. You can upload a photo instead."
            : "The camera could not be opened. You can upload a photo instead.",
      );
    }
  }, [scanBlob, stopCamera, waitForVideo]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a photo.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("That photo is larger than 20 MB. Please use a smaller one.");
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
        toast.success(`${response.sections.length} findings from your palm.`);
        setTimeout(
          () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
          120,
        );
      } else {
        // A rejected photo is a normal outcome and costs nothing, so it is not
        // reported as an error.
        toast.info(response.message || "That photo could not be read.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The scan could not be completed.",
      );
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

  const byArea = React.useMemo(() => {
    if (!result?.sections) return [];
    const groups = new Map<string, typeof result.sections>();
    for (const section of result.sections) {
      const area = section.area || "General";
      groups.set(area, [...(groups.get(area) ?? []), section]);
    }
    return [...groups.entries()];
  }, [result]);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
        <header className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-brand-100/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-900">
            <Hand className="size-3" />
            Palm reading
          </span>
          <h1 className="font-display mt-3 text-2xl font-extrabold text-foreground sm:text-4xl">
            Scan your palm, live
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Hold your open hand up to the camera. Twenty-one points are tracked as
            you move, and the shot is taken on its own once your palm is steady and
            square to the lens. The principal creases are then traced from that
            frame, and every finding shows the measurement behind it and the source
            it was read from.
          </p>
        </header>

        {!isSignedIn ? (
          <div className="mx-auto mt-8 max-w-md rounded-3xl border border-border bg-surface p-6 text-center">
            <p className="text-sm font-semibold text-foreground">
              Sign in to scan your palm.
            </p>
          </div>
        ) : (
          <>
            {/* Capture */}
            <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-border bg-surface p-5 sm:p-7">
              {availability && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-muted p-3.5">
                  <span className="text-xs font-semibold text-foreground">
                    {availability.coins_required > 0
                      ? `${availability.coins_required} coins per reading`
                      : "Free"}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-bold",
                      availability.can_afford
                        ? "bg-emerald-50 text-emerald-800"
                        : "bg-amber-50 text-amber-900",
                    )}
                  >
                    Balance {availability.wallet_balance}
                  </span>
                </div>
              )}

              {availability?.requires?.length ? (
                <div className="mb-5 rounded-2xl border border-brand-300/70 bg-brand-50 p-4">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-800">
                    <Info className="size-3" />
                    For a readable photo
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

              {/* Live camera. The preview is what makes this usable: the user can
                  see the tracking sitting on their hand and knows the shot is good
                  before it is taken, rather than discovering afterwards. */}
              {cameraOn ? (
                <div className="space-y-3">
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

                    {/* Framing guide */}
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute inset-[12%] rounded-[32px] border-2 border-dashed transition-colors duration-300",
                        status?.aligned ? "border-emerald-400/80" : "border-white/30",
                      )}
                    />

                    {/* Guidance */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3">
                      <div
                        className={cn(
                          "mx-auto flex max-w-sm items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur-md transition-colors",
                          status?.aligned ? "bg-emerald-500/90" : "bg-ink-950/75",
                        )}
                      >
                        {status?.aligned ? (
                          <CheckCircle2 className="size-4 shrink-0 text-white" />
                        ) : (
                          <Hand className="size-4 shrink-0 text-white/80" />
                        )}
                        <span className="text-xs font-bold text-white">
                          {status?.guidance ?? "Looking for your hand…"}
                        </span>
                        {status?.handedness && (
                          <span className="ml-auto shrink-0 text-[10px] font-semibold text-white/70">
                            {status.handedness} hand
                          </span>
                        )}
                      </div>

                      {/* Hold-to-capture progress */}
                      {holdProgress > 0 && (
                        <div className="mx-auto mt-2 h-1 max-w-sm overflow-hidden rounded-full bg-white/25">
                          <div
                            className="h-full rounded-full bg-emerald-400 transition-[width] duration-100"
                            style={{ width: `${holdProgress * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Per-check feedback, so the user can see exactly what is wrong. */}
                  {status?.found && status.checks.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {status.checks.map((check) => (
                        <span
                          key={check.id}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors",
                            check.ok
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-amber-100 text-amber-900",
                          )}
                        >
                          {check.ok ? (
                            <CheckCircle2 className="size-2.5" />
                          ) : (
                            <XCircle className="size-2.5" />
                          )}
                          {check.hint}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-2">
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
                    >
                      <Camera className="size-4" /> Capture now
                    </Button>
                    <Button variant="outline" onClick={stopCamera} disabled={scanning}>
                      Stop camera
                    </Button>
                  </div>
                </div>
              ) : preview ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="The palm photo being read"
                    className="mx-auto max-h-80 rounded-2xl border border-border object-contain"
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={reset} disabled={scanning}>
                      <RefreshCw className="size-4" /> Scan again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => void startCamera()}
                    disabled={scanning}
                    className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-10 transition-colors hover:bg-brand-50 disabled:opacity-60"
                  >
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-300">
                      <Camera className="size-6 text-ink-950" />
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      Scan your palm with the camera
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Hold your open palm steady and it captures itself
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInput.current?.click()}
                    disabled={scanning}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface-muted py-3 text-xs font-semibold text-foreground transition-colors hover:bg-surface disabled:opacity-60"
                  >
                    <Upload className="size-3.5" />
                    Or upload a photo instead
                  </button>

                  {cameraError && (
                    <p className="rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
                      {cameraError}
                    </p>
                  )}
                </div>
              )}

              {scanning && (
                <p className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand-900">
                  <Loader2 className="size-4 animate-spin" />
                  Tracing the creases…
                </p>
              )}
            </section>

            {/* Rejected */}
            {result && result.status !== "ok" && (
              <section className="mx-auto mt-5 max-w-3xl rounded-3xl border border-amber-300 bg-amber-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-amber-950">
                  <AlertTriangle className="size-5 shrink-0 text-amber-600" />
                  That photo could not be read
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-amber-900">
                  {result.message}
                </p>
                <p className="mt-2 text-[11px] font-semibold text-amber-900">
                  You have not been charged.
                </p>

                {result.quality_checks.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
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
                        <span className={check.passed ? "text-amber-900/70" : "text-amber-950"}>
                          {check.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Reading */}
            {result && result.status === "ok" && (
              <div ref={resultsRef} className="mt-8 space-y-5">
                {/* What was traced */}
                <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
                  <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
                    <Sparkles className="size-5 shrink-0 text-brand-600" />
                    What was read from your photo
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The lines drawn here are the ones the reading is based on. If a
                    line looks wrong, the finding that depends on it is wrong too.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {result.overlay_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={result.overlay_image}
                        alt="Your palm with the traced creases drawn on it"
                        className="w-full rounded-2xl border border-border"
                      />
                    )}

                    <div className="space-y-2">
                      {result.hand_type?.type && (
                        <div className="rounded-2xl bg-brand-100 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-800">
                            Hand type
                          </p>
                          <p className="mt-0.5 text-lg font-extrabold text-ink-950">
                            {result.hand_type.type}
                          </p>
                          <p className="text-[11px] text-brand-900">
                            {result.hand_type.reason}
                          </p>
                        </div>
                      )}

                      {result.creases.map((crease) => (
                        <div
                          key={crease.name}
                          className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-3 py-2.5"
                        >
                          <span
                            className={cn(
                              "size-3 shrink-0 rounded-full",
                              CREASE_COLOUR[crease.name] ?? "bg-muted-foreground",
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-bold text-foreground">
                              {crease.elemental_name}
                            </span>
                            {crease.found ? (
                              <span className="block text-[10px] text-muted-foreground">
                                {crease.termination_zone
                                  ? `ends at the ${crease.termination_zone} mount`
                                  : "traced"}
                              </span>
                            ) : (
                              <span className="block text-[10px] text-amber-700">
                                not clear enough in this photo
                              </span>
                            )}
                          </span>
                          {crease.found && (
                            <span
                              className="shrink-0 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-foreground"
                              title="How far the traced line stands above the surrounding skin. Higher is a clearer line."
                            >
                              {crease.contrast.toFixed(1)}×
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.warnings.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-3.5">
                      {result.warnings.map((warning, index) => (
                        <p key={index} className="text-[11px] leading-relaxed text-amber-950">
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </section>

                {/* Findings */}
                {byArea.map(([area, sections]) => (
                  <section
                    key={area}
                    className="rounded-3xl border border-border bg-surface-muted/60 p-5 sm:p-7"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                      {area}
                    </h3>
                    <div className="mt-3 grid grid-cols-1 items-start gap-3 md:grid-cols-2">
                      {sections.map((section) => (
                        <article
                          key={`${section.feature}-${section.option}`}
                          className="rounded-2xl border border-border bg-white p-4"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                            {section.feature_label}
                          </p>
                          <p className="mt-0.5 text-sm font-extrabold text-foreground">
                            {section.label}
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {section.meaning}
                          </p>

                          {section.because.length > 0 && (
                            <div className="mt-3 rounded-xl bg-brand-50 p-2.5">
                              <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                                <Ruler className="size-3" />
                                Measured
                              </p>
                              <ul className="mt-1 space-y-0.5">
                                {section.because.map((reason, index) => (
                                  <li
                                    key={index}
                                    className="text-[11px] leading-relaxed text-brand-950"
                                  >
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {section.source && (
                            <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80">
                              <FileText className="size-2.5" />
                              {section.source}
                            </p>
                          )}
                        </article>
                      ))}
                    </div>
                  </section>
                ))}

                {/* Not assessed — stated rather than omitted */}
                {result.skipped.length > 0 && (
                  <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
                    <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                      <Info className="size-4 shrink-0 text-muted-foreground" />
                      Not assessed from this photo
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      These are part of palmistry but could not be read here. They are
                      listed rather than guessed at.
                    </p>
                    <ul className="mt-3 space-y-2">
                      {result.skipped.map((item, index) => (
                        <li
                          key={index}
                          className="rounded-xl bg-surface-muted px-3.5 py-2.5"
                        >
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

                <p className="text-center text-[11px] text-muted-foreground">
                  Scanned in {Math.round(result.processing_ms)} ms
                  {result.coins_charged > 0 && ` · ${result.coins_charged} coins`}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
