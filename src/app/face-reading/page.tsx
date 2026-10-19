"use client";

/**
 * Face reading.
 *
 * The photograph is measured on this device and then discarded — what reaches
 * the server is about twenty ratios. That is said plainly on screen, because
 * it is the kind of claim people are right to be sceptical about and it
 * happens to be true.
 */

import { useMutation, useQuery } from "@tanstack/react-query";
import { Camera, Check, Loader2, RefreshCw, ScanFace, Upload, Wallet } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Alert, Button, LoadingBlock } from "@/components/ui";
import { faceReadingApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { NoFaceError, measureImage, type MeasureResult } from "@/lib/face-measure";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { FaceReading } from "@/types";

type Stage = "intro" | "capturing" | "measuring" | "reading";

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
  const [live, setLive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // A camera left running after the component goes is the classic leak here —
  // the light stays on and people notice.
  const stopCamera = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }, []);

  React.useEffect(() => stopCamera, [stopCamera]);

  async function startCamera() {
    setError(null);
    try {
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
    } catch {
      setError(
        "Could not open the camera. Allow camera access, or upload a photo instead.",
      );
    }
  }

  async function measure(source: HTMLVideoElement | HTMLImageElement) {
    setError(null);
    onMeasuring();
    try {
      const result = await measureImage(source);
      if (result.warning) {
        setError(result.warning);
        onCancelled();
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
      onCancelled();
    }
  }

  function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = new Image();
    image.onload = () => {
      void measure(image);
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => setError("That file could not be opened as an image.");
    image.src = URL.createObjectURL(file);
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="card-surface overflow-hidden">
        <div className="relative aspect-[4/3] bg-ink-900/5">
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn("size-full object-cover", !live && "hidden")}
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

          {/* A guide to stand in, so the capture is square-on first time. */}
          {live && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="h-[78%] w-[58%] rounded-[50%] border-2 border-dashed border-brand-300/80" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          {live ? (
            <>
              <Button
                onClick={() => videoRef.current && measure(videoRef.current)}
                loading={busy}
                className="flex-1"
              >
                <ScanFace className="size-4" />
                Read my face
              </Button>
              <Button variant="secondary" onClick={stopCamera} disabled={busy}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={startCamera} disabled={busy} className="flex-1">
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
          Measuring…
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
