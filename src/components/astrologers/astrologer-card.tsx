"use client";

import { Languages, MessageCircle, Phone, Star, Video } from "lucide-react";
import Link from "next/link";

import { Avatar, Badge, StatusDot } from "@/components/ui";
import { cn, coinsPerMinute, formatNumber } from "@/lib/utils";
import {
  MODE_LABELS, SKILL_LABELS, type AstrologerPublic,
  coinWord,
  formatCoins,
} from "@/types";

const MODE_ICONS = { chat: MessageCircle, call: Phone, video: Video } as const;

export function AstrologerCard({ astrologer }: { astrologer: AstrologerPublic }) {
  const { availability, rates, rating } = astrologer;
  const href = `/astrologers/${astrologer.slug ?? astrologer.id}`;

  const primaryMode = astrologer.modes_enabled.includes("chat")
    ? "chat"
    : (astrologer.modes_enabled[0] ?? "chat");
  const price = coinsPerMinute(rates, primaryMode);

  const isOnline = availability.is_online;
  const isBusy = availability.is_busy;

  return (
    <Link
      href={href}
      className={cn(
        "card-surface group relative flex flex-col overflow-hidden p-0",
        "hover:card-glow hover:-translate-y-1 hover:shadow-lift",
        "transition-all duration-300",
      )}
    >
      {/* Top accent line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 transition-opacity duration-300",
          isOnline && !isBusy
            ? "bg-gradient-to-r from-transparent via-success to-transparent opacity-80"
            : isBusy
            ? "bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60"
            : "bg-gradient-to-r from-transparent via-brand-400/50 to-transparent opacity-0 group-hover:opacity-100",
        )}
      />

      {/* Featured badge */}
      {astrologer.is_featured && (
        <div className="absolute right-3 top-3">
          <Badge tone="gold" className="shadow-gold">
            ✦ Featured
          </Badge>
        </div>
      )}

      <div className="flex flex-col gap-4 p-5">
        {/* Header row: avatar + name + meta */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <div className="ring-2 ring-brand-400/25 rounded-full transition-all duration-300 group-hover:ring-brand-400/50">
              <Avatar src={astrologer.profile_image_url} name={astrologer.display_name} size="lg" />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 rounded-full bg-surface-solid p-[3px] shadow-md">
              <StatusDot online={isOnline} busy={isBusy} />
            </span>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-start gap-2 pr-6">
              <h3
                className={cn(
                  "truncate font-semibold leading-tight tracking-tight text-foreground",
                  "transition-colors duration-200 group-hover:text-brand-300",
                )}
              >
                {astrologer.display_name}
              </h3>
            </div>

            {astrologer.tagline && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground leading-relaxed">
                {astrologer.tagline}
              </p>
            )}

            {/* Availability label */}
            <p
              className={cn(
                "mt-1 text-[10px] font-medium uppercase tracking-widest",
                isOnline && !isBusy
                  ? "text-success"
                  : isBusy
                  ? "text-gold-400"
                  : "text-muted-foreground/60",
              )}
            >
              {isOnline && !isBusy ? "● Online" : isBusy ? "◉ In Session" : "○ Offline"}
            </p>
          </div>
        </div>

        {/* Stats row: rating, experience, consultations */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          {rating.count > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/10 px-2 py-0.5 border border-gold-400/25">
              <Star className="size-3 fill-gold-400 text-gold-400" />
              <span className="font-semibold text-gold-300">{rating.average.toFixed(1)}</span>
              <span className="text-muted-foreground">({formatNumber(rating.count)})</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <span className="size-1 rounded-full bg-brand-400/50" />
            {astrologer.experience_years} yrs
          </span>
          {astrologer.total_consultations > 0 && (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <span className="size-1 rounded-full bg-brand-400/50" />
              {formatNumber(astrologer.total_consultations)} consults
            </span>
          )}
        </div>

        {/* Skills */}
        {astrologer.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {astrologer.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} tone="brand">
                {SKILL_LABELS[skill]}
              </Badge>
            ))}
            {astrologer.skills.length > 3 && (
              <Badge tone="neutral">+{astrologer.skills.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Languages */}
        {astrologer.languages.length > 0 && (
          <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            <Languages className="size-3.5 shrink-0 text-brand-400/70" />
            <span className="truncate">{astrologer.languages.join(" · ")}</span>
          </p>
        )}
      </div>

      {/* Footer: modes + price */}
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 bg-surface-muted/40 px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          {astrologer.modes_enabled.map((mode) => {
            const Icon = MODE_ICONS[mode];
            return (
              <span
                key={mode}
                title={MODE_LABELS[mode]}
                className={cn(
                  "flex size-7 items-center justify-center rounded-lg border border-border/60",
                  "bg-surface-muted text-muted-foreground",
                  "transition-all duration-200",
                  "group-hover:border-brand-400/40 group-hover:text-brand-300",
                )}
              >
                <Icon className="size-3.5" />
              </span>
            );
          })}
        </div>

        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-foreground">{formatCoins(price)}</span>
            <span className="text-[11px] text-muted-foreground">{coinWord(price)}/min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AstrologerCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden p-0">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex gap-3.5">
          <div className="shimmer size-16 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="shimmer h-4 w-3/5 rounded-lg" />
            <div className="shimmer h-3 w-4/5 rounded-lg" />
            <div className="shimmer h-3 w-2/5 rounded-lg" />
          </div>
        </div>
        <div className="shimmer h-5 w-2/5 rounded-full" />
        <div className="flex gap-1.5">
          <div className="shimmer h-5 w-20 rounded-full" />
          <div className="shimmer h-5 w-16 rounded-full" />
          <div className="shimmer h-5 w-14 rounded-full" />
        </div>
        <div className="shimmer h-3.5 w-3/5 rounded-lg" />
      </div>
      <div className="flex justify-between border-t border-border/60 bg-surface-muted/30 px-5 py-3.5">
        <div className="flex gap-1.5">
          <div className="shimmer h-7 w-7 rounded-lg" />
          <div className="shimmer h-7 w-7 rounded-lg" />
        </div>
        <div className="shimmer h-5 w-20 rounded-lg" />
      </div>
    </div>
  );
}
