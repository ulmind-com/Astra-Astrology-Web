"use client";

import { Bookmark, MessageSquare, Phone, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, StatusDot } from "@/components/ui";
import { useLanguage } from "@/providers/language-provider";
import { ASTROLOGERS_I18N } from "@/lib/astrologers-translations";
import { cn, coinsPerMinute, formatNumber } from "@/lib/utils";
import {
  SKILL_LABELS,
  type AstrologerPublic,
  formatCoins,
} from "@/types";

const BANNERS = [
  "/banners/banner-3.jpg",
  "/banners/banner-2.jpg",
  "/banners/banner-1.jpg",
];

export function getAstrologerBanner(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return BANNERS[Math.abs(hash) % BANNERS.length];
}

export function AstrologerCard({ astrologer }: { astrologer: AstrologerPublic }) {
  const { language } = useLanguage();
  const t = ASTROLOGERS_I18N[language] || ASTROLOGERS_I18N.en;
  const router = useRouter();
  const { availability, rates, rating } = astrologer;
  const href = `/astrologers/${astrologer.slug ?? astrologer.id}`;

  const primaryMode = astrologer.modes_enabled.includes("chat")
    ? "chat"
    : (astrologer.modes_enabled[0] ?? "chat");
  const price = coinsPerMinute(rates, primaryMode);

  const isOnline = availability.is_online;
  const isBusy = availability.is_busy;

  const [bookmarked, setBookmarked] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("astra_saved_astrologers");
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        if (ids.includes(astrologer.id)) setBookmarked(true);
      }
    } catch {
      // ignore localStorage error
    }
  }, [astrologer.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("astra_saved_astrologers");
      let ids: string[] = saved ? JSON.parse(saved) : [];
      if (bookmarked) {
        ids = ids.filter((id) => id !== astrologer.id);
        setBookmarked(false);
        toast.success(t.bookmarkRemoved);
      } else {
        ids.push(astrologer.id);
        setBookmarked(true);
        toast.success(t.bookmarkSaved);
      }
      localStorage.setItem("astra_saved_astrologers", JSON.stringify(ids));
    } catch {
      setBookmarked(!bookmarked);
    }
  };

  const primarySkill = astrologer.skills[0];
  const remainingSkillsCount = Math.max(0, astrologer.skills.length - 1);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[28px] sm:rounded-[30px]",
        "bg-white border border-black/[0.08] shadow-[0_10px_30px_-15px_rgba(26,18,8,0.08)]",
        "press focus-ring hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(26,18,8,0.16)]",
      )}
    >
      {/* Card Content — compact, no banner */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Avatar & Bookmark row */}
        <div className="flex items-start justify-between mb-2.5">
          {/* Avatar with Status Dot */}
          <div className="relative">
            {astrologer.is_featured && (
              <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                {t.featuredBadge}
              </span>
            )}
            <div
              className={cn(
                "size-16 rounded-full ring-2 ring-offset-2 ring-offset-white shadow-sm bg-white overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105",
                isBusy
                  ? "ring-amber-400/80"
                  : isOnline
                    ? "ring-emerald-500/90"
                    : "ring-slate-300/80",
              )}
            >
              <Avatar
                src={astrologer.profile_image_url}
                name={astrologer.display_name}
                size="lg"
                className="size-full rounded-full ring-0 shadow-none"
              />
            </div>
            <span className="absolute bottom-0.5 right-0.5 rounded-full bg-white p-[3px] shadow-xs">
              <StatusDot online={isOnline} busy={isBusy} />
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark astrologer"}
            onClick={handleBookmark}
            className={cn(
              "size-10 rounded-full border border-black/[0.08] bg-white flex items-center justify-center transition-all duration-200 shadow-2xs shrink-0 active:scale-95",
              bookmarked
                ? "text-ink-950 bg-brand-100/60 border-brand-400/50"
                : "text-ink-600 hover:text-ink-950 hover:bg-black/[0.03]",
            )}
          >
            <Bookmark
              className={cn(
                "size-4.5 transition-colors",
                bookmarked ? "fill-ink-950 text-ink-950" : "text-ink-600",
              )}
            />
          </button>
        </div>

        {/* Astrologer Name & Tagline */}
        <div className="mt-1">
          <h3 className="font-display font-bold text-lg sm:text-[19px] leading-tight text-ink-950 tracking-tight transition-colors duration-200 group-hover:text-brand-900 line-clamp-1">
            {astrologer.display_name}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground leading-relaxed">
            {astrologer.tagline ||
              (astrologer.specialisations?.length
                ? astrologer.specialisations.join(" · ")
                : "Vedic Astrologer & Consultant")}
          </p>
        </div>

        {/* Skill Pill Row */}
        <div className="mt-3.5 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-200/50 text-brand-950 border border-brand-400/40 px-3 py-1 text-xs font-semibold shadow-2xs">
            <span className="size-4 rounded-full bg-brand-400/40 text-brand-950 flex items-center justify-center text-[10px]">
              ✦
            </span>
            <span>{primarySkill ? SKILL_LABELS[primarySkill] : "Vedic Astrology"}</span>
          </span>
          {remainingSkillsCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-surface-muted border border-border/80 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              +{remainingSkillsCount}
            </span>
          )}
        </div>

        {/* 3-Column Metrics Stats Row */}
        <div className="grid grid-cols-3 divide-x divide-black/[0.08] border-y border-black/[0.07] py-2.5 my-3 text-center">
          {/* Rating */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="flex items-center gap-1 font-bold text-sm text-ink-950 tabular-nums">
              <Star className="size-3.5 fill-gold-500 text-gold-500 shrink-0" />
              <span>{rating.count > 0 ? rating.average.toFixed(1) : "5.0"}</span>
            </div>
            <span className="mt-0.5 text-[11px] text-muted-foreground font-normal">{t.ratingLabel}</span>
          </div>

          {/* Experience / Consultations */}
          <div className="flex flex-col items-center justify-center px-1">
            <span className="font-bold text-sm text-ink-950 tabular-nums">
              {astrologer.experience_years > 0
                ? `${astrologer.experience_years}${t.yearsSuffix}`
                : astrologer.total_consultations > 0
                  ? `${formatNumber(astrologer.total_consultations)}+`
                  : "Expert"}
            </span>
            <span className="mt-0.5 text-[11px] text-muted-foreground font-normal">
              {astrologer.experience_years > 0 ? t.expLabel : t.consultsLabel}
            </span>
          </div>

          {/* Rate */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="flex items-baseline justify-center gap-0.5 font-bold text-sm text-ink-950 tabular-nums">
              <span>{formatCoins(price)}</span>
              <span className="text-[11px] font-normal text-muted-foreground">{t.perMinute}</span>
            </div>
            <span className="mt-0.5 text-[11px] text-muted-foreground font-normal">{t.rateLabel}</span>
          </div>
        </div>


        {/* Action Buttons: Chat + Call (both open the profile/booking page) */}
        <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            aria-label={`${t.chat} — ${astrologer.display_name}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`${href}?mode=chat`);
            }}
            className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white py-2.5 px-3 text-sm font-semibold tracking-wide shadow-[0_6px_16px_-6px_rgba(217,119,6,0.55)] transition-all duration-200 hover:brightness-105 active:scale-[0.97]"
          >
            <MessageSquare className="size-4 shrink-0" />
            <span>{t.chat}</span>
          </button>
          <button
            type="button"
            aria-label={`${t.call} — ${astrologer.display_name}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`${href}?mode=call`);
            }}
            className="flex items-center justify-center gap-1.5 rounded-full bg-ink-950 text-white py-2.5 px-3 text-sm font-semibold tracking-wide shadow-xs transition-all duration-200 hover:bg-black active:scale-[0.97]"
          >
            <Phone className="size-4 shrink-0" />
            <span>{t.call}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

export function AstrologerCardSkeleton() {
  return (
    <div className="rounded-[28px] sm:rounded-[30px] overflow-hidden bg-white border border-black/[0.08] shadow-soft p-0 flex flex-col justify-between">
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2.5">
          <div className="shimmer size-16 rounded-full" />
          <div className="shimmer size-9 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="shimmer h-5 w-3/5 rounded-lg" />
          <div className="shimmer h-3.5 w-4/5 rounded-lg" />
        </div>
        <div className="mt-3.5 flex gap-2">
          <div className="shimmer h-6 w-28 rounded-full" />
          <div className="shimmer h-6 w-10 rounded-full" />
        </div>
        <div className="grid grid-cols-3 divide-x divide-black/[0.08] border-y border-black/[0.07] py-3 my-4">
          <div className="flex flex-col items-center gap-1">
            <div className="shimmer h-4 w-10 rounded" />
            <div className="shimmer h-2.5 w-8 rounded" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="shimmer h-4 w-12 rounded" />
            <div className="shimmer h-2.5 w-8 rounded" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="shimmer h-4 w-14 rounded" />
            <div className="shimmer h-2.5 w-8 rounded" />
          </div>
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <div className="shimmer h-11 w-full rounded-full" />
          <div className="shimmer h-11 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
