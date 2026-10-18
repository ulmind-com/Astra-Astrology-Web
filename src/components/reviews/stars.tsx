"use client";

import { Star } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const SIZES = { sm: "size-3.5", md: "size-5", lg: "size-9" } as const;

/**
 * Stars, either to read or to set.
 *
 * Read-only is a row of spans with one label for the whole thing — five
 * separate "star" labels would be read out one by one by a screen reader and
 * tell nobody the rating. Interactive is a radio group, so it can be reached
 * and set from the keyboard as well as tapped.
 */
export function Stars({
  value,
  onChange,
  size = "md",
  className,
}: {
  value: number;
  onChange?: (next: number) => void;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const interactive = Boolean(onChange);
  const shown = hovered ?? value;

  if (!interactive) {
    return (
      <span
        className={cn("inline-flex items-center gap-0.5", className)}
        role="img"
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden
            className={cn(
              SIZES[size],
              star <= Math.round(value)
                ? "fill-gold-400 text-gold-500"
                : "fill-ink-900/10 text-ink-900/20",
            )}
          />
        ))}
      </span>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Your rating"
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          onMouseEnter={() => setHovered(star)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(null)}
          onClick={() => onChange?.(star)}
          className="rounded-full p-1 transition-transform hover:scale-110 focus-visible:scale-110"
        >
          <Star
            className={cn(
              SIZES[size],
              star <= shown
                ? "fill-gold-400 text-gold-500"
                : "fill-ink-900/10 text-ink-900/20",
            )}
          />
        </button>
      ))}
    </div>
  );
}

/** The average beside its star row, as it appears on a card or a profile. */
export function RatingSummaryLine({
  average,
  count,
  size = "sm",
  className,
}: {
  average: number;
  count: number;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (!count) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>No reviews yet</span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Stars value={average} size={size} />
      <span className="text-sm font-semibold tabular-nums">{average.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">
        ({count} review{count === 1 ? "" : "s"})
      </span>
    </span>
  );
}
