"use client";

import { Languages, MessageCircle, Phone, Star, Video } from "lucide-react";
import Link from "next/link";

import { Avatar, Badge, StatusDot } from "@/components/ui";
import {
  baseRate,
  cn,
  effectiveRate,
  formatCurrency,
  formatNumber,
  hasDiscount,
} from "@/lib/utils";
import { MODE_LABELS, SKILL_LABELS, type AstrologerPublic } from "@/types";

const MODE_ICONS = { chat: MessageCircle, call: Phone, video: Video } as const;

export function AstrologerCard({ astrologer }: { astrologer: AstrologerPublic }) {
  const { availability, rates, rating } = astrologer;
  const href = `/astrologers/${astrologer.slug ?? astrologer.id}`;

  // Chat is the headline price when it is offered, otherwise the first mode.
  const primaryMode = astrologer.modes_enabled.includes("chat")
    ? "chat"
    : (astrologer.modes_enabled[0] ?? "chat");
  const price = effectiveRate(rates, primaryMode);
  const discounted = hasDiscount(rates, primaryMode);

  return (
    <Link
      href={href}
      className="card-surface group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar src={astrologer.profile_image_url} name={astrologer.display_name} size="lg" />
          <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-surface p-0.5">
            <StatusDot online={availability.is_online} busy={availability.is_busy} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-300">
              {astrologer.display_name}
            </h3>
            {astrologer.is_featured && <Badge tone="gold">Featured</Badge>}
          </div>

          {astrologer.tagline && (
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {astrologer.tagline}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {rating.count > 0 && (
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-gold-400 text-gold-400" />
                <span className="font-medium text-foreground">
                  {rating.average.toFixed(1)}
                </span>
                ({formatNumber(rating.count)})
              </span>
            )}
            <span>{astrologer.experience_years} yrs exp</span>
            {astrologer.total_consultations > 0 && (
              <span>{formatNumber(astrologer.total_consultations)} consults</span>
            )}
          </div>
        </div>
      </div>

      {astrologer.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {astrologer.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} tone="brand">
              {SKILL_LABELS[skill]}
            </Badge>
          ))}
          {astrologer.skills.length > 3 && (
            <Badge>+{astrologer.skills.length - 3}</Badge>
          )}
        </div>
      )}

      {astrologer.languages.length > 0 && (
        <p className="mt-3 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <Languages className="size-3.5 shrink-0" />
          {astrologer.languages.join(", ")}
        </p>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <div className="flex items-center gap-1.5">
          {astrologer.modes_enabled.map((mode) => {
            const Icon = MODE_ICONS[mode];
            return (
              <span
                key={mode}
                title={MODE_LABELS[mode]}
                className="flex size-7 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground"
              >
                <Icon className="size-3.5" />
              </span>
            );
          })}
        </div>

        <div className="text-right">
          {discounted && (
            <span className="mr-1.5 text-xs text-muted-foreground line-through">
              {formatCurrency(baseRate(rates, primaryMode))}
            </span>
          )}
          <span
            className={cn(
              "font-semibold",
              discounted ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
            )}
          >
            {price > 0 ? formatCurrency(price) : "Free"}
          </span>
          <span className="text-xs text-muted-foreground">/min</span>
        </div>
      </div>
    </Link>
  );
}

export function AstrologerCardSkeleton() {
  return (
    <div className="card-surface p-5">
      <div className="flex gap-4">
        <div className="shimmer size-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-4 w-2/3 rounded" />
          <div className="shimmer h-3 w-full rounded" />
          <div className="shimmer h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="mt-4 flex gap-1.5">
        <div className="shimmer h-5 w-20 rounded-full" />
        <div className="shimmer h-5 w-16 rounded-full" />
      </div>
      <div className="mt-5 flex justify-between">
        <div className="shimmer h-7 w-20 rounded-lg" />
        <div className="shimmer h-5 w-16 rounded" />
      </div>
    </div>
  );
}
