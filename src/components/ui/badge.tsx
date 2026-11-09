import * as React from "react";

import { cn } from "@/lib/utils";

type Tone = "brand" | "gold" | "green" | "red" | "neutral" | "blue";

// Small pills. The brand yellow is reserved for the ones that are genuinely
// about this product; status tones stay quiet so they never read as a button.
const TONES: Record<Tone, string> = {
  brand: "bg-brand-300 text-brand-950",
  gold: "bg-gold-100 text-gold-700 border border-gold-400/40",
  green: "bg-success-surface text-success border border-success/20",
  red: "bg-danger-surface text-danger border border-danger/25",
  blue: "bg-info-surface text-info border border-info/20",
  neutral: "bg-surface-muted text-muted-foreground border border-border",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold leading-none",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

/** The green/grey/amber dot used for an astrologer's online state. */
export function StatusDot({ online, busy }: { online: boolean; busy?: boolean }) {
  const liveGreen = online && !busy;
  const tone = busy
    ? "bg-amber-400 shadow-[0_0_0_1.5px_#fff,0_0_8px_1px_rgba(251,191,36,0.6)]"
    : online
      ? "bg-emerald-500 shadow-[0_0_0_1.5px_#fff,0_0_9px_1.5px_rgba(16,185,129,0.65)]"
      : "bg-slate-300 shadow-[0_0_0_1.5px_#fff]";
  return (
    <span className="relative flex size-3" aria-hidden>
      {liveGreen && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
      )}
      <span className={cn("relative inline-flex size-3 rounded-full", tone)} />
    </span>
  );
}
