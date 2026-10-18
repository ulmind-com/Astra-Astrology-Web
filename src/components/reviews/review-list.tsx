"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquareQuote } from "lucide-react";
import * as React from "react";

import { Stars } from "@/components/reviews/stars";
import { Button, EmptyState, LoadingBlock } from "@/components/ui";
import { reviewApi } from "@/lib/api";
import { REVIEW_KIND_LABELS } from "@/types";

const PAGE = 10;

function when(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Public. Anyone can read these, signed in or not. */
export function ReviewList({ astrologerId }: { astrologerId: string }) {
  const [limit, setLimit] = React.useState(PAGE);

  const { data, isLoading } = useQuery({
    queryKey: ["reviews", astrologerId, limit],
    queryFn: () => reviewApi.forAstrologer(astrologerId, { limit }),
    placeholderData: (previous) => previous,
  });

  if (isLoading && !data) return <LoadingBlock label="Loading reviews…" />;

  const summary = data?.summary;
  const items = data?.items ?? [];

  if (!summary?.count) {
    return (
      <EmptyState
        icon={MessageSquareQuote}
        title="No reviews yet"
        description="Reviews appear here after someone has had a consultation."
      />
    );
  }

  const most = Math.max(...Object.values(summary.breakdown), 1);

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------- the average */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="text-center sm:w-40">
          <p className="text-5xl font-semibold tabular-nums leading-none">
            {summary.average.toFixed(1)}
          </p>
          <Stars value={summary.average} className="mt-2" />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {summary.count} review{summary.count === 1 ? "" : "s"}
          </p>
        </div>

        {/* Five down to one, because that is the order people read them in. */}
        <ul className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.breakdown[star] ?? 0;
            return (
              <li key={star} className="flex items-center gap-2.5 text-xs">
                <span className="w-3 tabular-nums text-muted-foreground">{star}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-900/[0.06]">
                  <span
                    className="block h-full rounded-full bg-gold-400"
                    style={{ width: `${(count / most) * 100}%` }}
                  />
                </span>
                <span className="w-6 text-right tabular-nums text-muted-foreground">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ----------------------------------------------------- the list */}
      <ul className="divide-y divide-border">
        {items.map((review) => (
          <li key={review.id} className="py-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Stars value={review.stars} size="sm" />
              <span className="text-sm font-semibold">
                {review.author_name ?? "Someone"}
              </span>
              <span className="text-xs text-muted-foreground">
                {REVIEW_KIND_LABELS[review.kind]} · {when(review.created_at)}
              </span>
            </div>
            {review.text && (
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {review.text}
              </p>
            )}
          </li>
        ))}
      </ul>

      {items.length < (data?.total ?? 0) && (
        <Button variant="secondary" onClick={() => setLimit((n) => n + PAGE)}>
          Show more reviews
        </Button>
      )}
    </div>
  );
}
