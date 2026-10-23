"use client";

/**
 * Palm reading.
 *
 * The page is built around one idea: show the user what was actually read. A palm
 * reading from a photograph is only worth as much as the tracing behind it, so the
 * traced overlay sits beside the findings, each finding states the measurement that
 * produced it and the document the rule came from, and anything the photo could not
 * support is listed as not assessed rather than quietly left out.
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
            Read your palm from a photograph
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
            Your hand is measured from twenty-one tracked points and the principal
            creases are traced from the photo itself. Every finding below shows the
            measurement behind it and the source it was read from, and the traced
            lines are shown so you can check them yourself.
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

              {preview ? (
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="The palm photo you uploaded"
                    className="mx-auto max-h-80 rounded-2xl border border-border object-contain"
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" onClick={reset} disabled={scanning}>
                      <RefreshCw className="size-4" /> Use a different photo
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={scanning}
                  className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50/40 p-10 transition-colors hover:bg-brand-50 disabled:opacity-60"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-300">
                    <Camera className="size-6 text-ink-950" />
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    Take or choose a photo of your open palm
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Upload className="size-3" />
                    Your photo is used for this scan and the reading it produces
                  </span>
                </button>
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
