"use client";

import { Bookmark, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, StatusDot } from "@/components/ui";
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

function getAstrologerBanner(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return BANNERS[Math.abs(hash) % BANNERS.length];
}

export function AstrologerCard({ astrologer }: { astrologer: AstrologerPublic }) {
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
        toast.success("Removed from saved astrologers.");
      } else {
        ids.push(astrologer.id);
        setBookmarked(true);
        toast.success("Saved to favorites.");
      }
      localStorage.setItem("astra_saved_astrologers", JSON.stringify(ids));
    } catch {
      setBookmarked(!bookmarked);
    }
  };

  const primarySkill = astrologer.skills[0];
  const remainingSkillsCount = Math.max(0, astrologer.skills.length - 1);
  const bannerSrc = getAstrologerBanner(astrologer.id);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[28px] sm:rounded-[30px]",
        "bg-white border border-black/[0.08] shadow-[0_10px_30px_-15px_rgba(26,18,8,0.08)]",
        "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(26,18,8,0.16)]",
      )}
    >
      {/* 3D Top Banner */}
      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-brand-900">
        <Image
          src={bannerSrc}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Featured badge */}
        {astrologer.is_featured && (
          <div className="absolute left-3.5 top-3.5 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-white border border-white/20 shadow-xs">
              ✦ Featured
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 px-5 pb-5 pt-0">
        {/* Avatar & Bookmark row */}
        <div className="flex items-end justify-between -mt-10 sm:-mt-11 mb-3">
          {/* Overlapping Avatar with Status Dot */}
          <div className="relative">
            <div className="size-[72px] sm:size-20 rounded-full ring-[3.5px] ring-white shadow-md bg-white overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-102">
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
        <div className="grid grid-cols-3 divide-x divide-black/[0.08] border-y border-black/[0.07] py-3 my-4 text-center">
          {/* Rating */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="flex items-center gap-1 font-bold text-sm text-ink-950 tabular-nums">
              <Star className="size-3.5 fill-gold-500 text-gold-500 shrink-0" />
              <span>{rating.count > 0 ? rating.average.toFixed(1) : "5.0"}</span>
            </div>
            <span className="mt-0.5 text-[11px] text-muted-foreground font-normal">rating</span>
          </div>

          {/* Experience / Consultations */}
          <div className="flex flex-col items-center justify-center px-1">
            <span className="font-bold text-sm text-ink-950 tabular-nums">
              {astrologer.experience_years > 0
                ? `${astrologer.experience_years}+ yrs`
                : astrologer.total_consultations > 0
                  ? `${formatNumber(astrologer.total_consultations)}+`
                  : "Expert"}
            </span>
            <span className="mt-0.5 text-[11px] text-muted-foreground font-normal">
              {astrologer.experience_years > 0 ? "exp" : "consults"}
            </span>
          </div>

          {/* Rate */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="flex items-baseline justify-center gap-0.5 font-bold text-sm text-ink-950 tabular-nums">
              <span>{formatCoins(price)}</span>
              <span className="text-[11px] font-normal text-muted-foreground">/min</span>
            </div>
            <span className="mt-0.5 text-[11px] text-muted-foreground font-normal">rate</span>
          </div>
        </div>

        {/* Action Button: Get In Touch */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-center w-full rounded-full bg-ink-950 group-hover:bg-black text-white py-3 px-5 text-sm font-semibold tracking-wide shadow-xs transition-all duration-200 active:scale-[0.98]">
            Get In Touch
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AstrologerCardSkeleton() {
  return (
    <div className="rounded-[28px] sm:rounded-[30px] overflow-hidden bg-white border border-black/[0.08] shadow-soft p-0 flex flex-col justify-between">
      <div className="shimmer h-32 sm:h-36 w-full" />
      <div className="px-5 pb-5 pt-0 flex flex-col flex-1">
        <div className="flex items-end justify-between -mt-10 sm:-mt-11 mb-3">
          <div className="shimmer size-18 sm:size-20 rounded-full ring-[3.5px] ring-white" />
          <div className="shimmer size-10 rounded-full" />
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
        <div className="shimmer h-11 w-full rounded-full mt-auto" />
      </div>
    </div>
  );
}
