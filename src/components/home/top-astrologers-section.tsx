"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Languages,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useRef, useState } from "react";

import { Avatar } from "@/components/ui";
import { astrologerApi } from "@/lib/api";
import { cn, coinsPerMinute, formatNumber } from "@/lib/utils";
import { usePlatform } from "@/providers/realtime-provider";
import { SKILL_LABELS, type AstrologerPublic } from "@/types";

interface DisplayAstrologer {
  id: string;
  name: string;
  avatarUrl?: string | null;
  rating: number;
  orders: number;
  languages: string[];
  experienceYears: number;
  speciality: string;
  pricePerMin: number;
  originalPricePerMin?: number;
  flatDealBadge?: string;
  isOnline: boolean;
  canCall: boolean;
  slug: string;
}

const FALLBACK_ASTROLOGERS: DisplayAstrologer[] = [
  {
    id: "astro-shifali",
    name: "Tarot Shifali",
    avatarUrl: "/images/astrologers/avatar-shifali.jpg",
    rating: 4.58,
    orders: 6344,
    languages: ["Hindi"],
    experienceYears: 5,
    speciality: "Tarot Reading",
    pricePerMin: 12,
    originalPricePerMin: 30,
    flatDealBadge: "FLATDEAL 12",
    isOnline: true,
    canCall: true,
    slug: "tarot-shifali",
  },
  {
    id: "astro-snehh",
    name: "Tarot Snehh",
    avatarUrl: "/images/astrologers/avatar-snehh.jpg",
    rating: 4.91,
    orders: 4645,
    languages: ["English", "Hindi"],
    experienceYears: 11,
    speciality: "Tarot Reading, Love",
    pricePerMin: 69,
    originalPricePerMin: 85,
    flatDealBadge: "SPECIAL",
    isOnline: true,
    canCall: true,
    slug: "tarot-snehh",
  },
  {
    id: "astro-guruyogi",
    name: "Dr Guruyogi",
    avatarUrl: "/images/astrologers/avatar-guruyogi.jpg",
    rating: 4.97,
    orders: 10203,
    languages: ["Bangla", "English", "Hindi"],
    experienceYears: 20,
    speciality: "Vedic Astrology, Kundli",
    pricePerMin: 55,
    originalPricePerMin: 70,
    flatDealBadge: "TOP RATED",
    isOnline: true,
    canCall: true,
    slug: "dr-guruyogi",
  },
  {
    id: "astro-hridesh",
    name: "Astro Hridesh",
    avatarUrl: "/images/experts/expert-hridesh-photo.jpg",
    rating: 4.93,
    orders: 7840,
    languages: ["Hindi", "English"],
    experienceYears: 14,
    speciality: "Vedic Astrology, Prashna",
    pricePerMin: 45,
    originalPricePerMin: 60,
    flatDealBadge: "VERIFIED",
    isOnline: true,
    canCall: true,
    slug: "astro-hridesh",
  },
];

export function TopAstrologersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { data } = useQuery({
    queryKey: ["astrologers", { home: true, limit: 12 }],
    queryFn: () => astrologerApi.list({ limit: 12 }),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const platform = usePlatform();
  const coinsPerRupee = platform?.coins_per_rupee ?? 1;

  const displayList = useMemo<DisplayAstrologer[]>(() => {
    const apiItems = data?.items ?? [];
    if (apiItems.length === 0) {
      return FALLBACK_ASTROLOGERS;
    }

    const mapped: DisplayAstrologer[] = apiItems.map((astro) => {
      const primaryMode = astro.modes_enabled.includes("chat")
        ? "chat"
        : astro.modes_enabled[0] ?? "chat";
      const pricePerMin = Math.round(
        coinsPerMinute(astro.rates, primaryMode) / coinsPerRupee,
      );
      const originalPrice = Math.round(pricePerMin * 1.4);
      const isOnline = astro.availability.is_online;
      const skills = astro.skills.slice(0, 2).map((s) => SKILL_LABELS[s] ?? s);

      return {
        id: astro.id,
        name: astro.display_name,
        avatarUrl: astro.profile_image_url,
        rating: astro.rating.average > 0 ? Number(astro.rating.average.toFixed(2)) : 4.8,
        orders: astro.total_consultations > 0 ? astro.total_consultations : 1250,
        languages: astro.languages.length > 0 ? astro.languages : ["Hindi", "English"],
        experienceYears: astro.experience_years || 6,
        speciality: skills.join(", ") || "Vedic Astrology",
        pricePerMin: pricePerMin || 25,
        originalPricePerMin: originalPrice > pricePerMin ? originalPrice : undefined,
        flatDealBadge: pricePerMin < 20 ? `FLATDEAL ${pricePerMin}` : "POPULAR",
        isOnline: isOnline,
        canCall: astro.modes_enabled.includes("call"),
        slug: astro.slug ?? astro.id,
      };
    });

    // Merge fallback items if apiItems has fewer than 4 items
    if (mapped.length < 4) {
      const existingNames = new Set(mapped.map((m) => m.name.toLowerCase()));
      const extra = FALLBACK_ASTROLOGERS.filter(
        (f) => !existingNames.has(f.name.toLowerCase()),
      );
      return [...mapped, ...extra];
    }

    return mapped;
  }, [data, coinsPerRupee]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 380;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative bg-white py-8 sm:py-12 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header with Title and 'View All' */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
              Top Online Astrologers
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6b5f4d]">
              Connect instantly via private chat or call with India&apos;s most verified astrologers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/astrologers"
              className="rounded-full border border-[#eadf9a] bg-[#fffdf5] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#8b5e0a] hover:bg-[#fff7d1] hover:border-brand-400 transition-colors shadow-2xs"
            >
              View All
            </Link>

            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`flex size-8 items-center justify-center rounded-full border border-[#e3d58f] bg-[#fffbe8] text-[#1a1208] transition-all ${
                  !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:bg-[#fef7cf]"
                }`}
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`flex size-8 items-center justify-center rounded-full border border-[#e3d58f] bg-[#fffbe8] text-[#1a1208] transition-all ${
                  !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:bg-[#fef7cf]"
                }`}
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel / Cards Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="scrollbar-none flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"
        >
          {displayList.map((astro) => {
            const isFollowed = followedIds[astro.id];
            const href = `/astrologers/${astro.slug}`;

            return (
              <div
                key={astro.id}
                className="group shrink-0 snap-start w-[310px] sm:w-[340px] rounded-2xl border border-[#eadf9a] bg-white p-4.5 shadow-[0_4px_16px_-4px_rgba(26,18,8,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-[0_14px_30px_-10px_rgba(240,210,80,0.45)] flex flex-col justify-between"
              >
                {/* Top Row: Avatar on left, Details on right */}
                <div>
                  <div className="flex items-start gap-3.5">
                    {/* Left: Circular Avatar with Online Dot & Star Rating */}
                    <div className="flex flex-col items-center shrink-0">
                      <Link href={href} className="relative block">
                        <div className="relative size-16 sm:size-[70px] rounded-full overflow-hidden border-2 border-[#fff3b3] shadow-sm">
                          {astro.avatarUrl ? (
                            <Image
                              src={astro.avatarUrl}
                              alt={astro.name}
                              fill
                              className="object-cover"
                              sizes="70px"
                            />
                          ) : (
                            <div className="size-full bg-gradient-to-br from-brand-300 to-gold-400 flex items-center justify-center font-bold text-lg text-ink-900">
                              {astro.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Online Badge Dot */}
                        {astro.isOnline && (
                          <span
                            className="absolute top-0 right-0 size-3.5 rounded-full bg-emerald-500 ring-2 ring-white"
                            title="Online now"
                          >
                            <span className="absolute inset-0 size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          </span>
                        )}
                      </Link>

                      {/* Rating pill directly under avatar */}
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#fff9db] border border-[#f2e28a] px-2 py-0.5 text-[11px] font-bold text-[#8b5e0a]">
                        <Star className="size-3 fill-[#e08c12] text-[#e08c12]" />
                        <span>{astro.rating}</span>
                        <span className="text-[#a18c64] font-normal">|</span>
                        <span className="text-[10px] font-medium text-[#6b5f4d]">
                          {formatNumber(astro.orders)}
                        </span>
                      </div>
                    </div>

                    {/* Right: Name + Follow Button + Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <Link href={href} className="min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-[#1a1208] truncate group-hover:text-[#8b5e0a] transition-colors">
                            {astro.name}
                          </h3>
                        </Link>

                        {/* Follow Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleFollow(astro.id, e)}
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold transition-all ${
                            isFollowed
                              ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                              : "border-[#e3d58f] bg-[#fffdf2] text-[#8b5e0a] hover:bg-[#fff7d1]"
                          }`}
                        >
                          {isFollowed ? "Following" : "+ Follow"}
                        </button>
                      </div>

                      {/* Languages */}
                      <p className="mt-1.5 text-xs text-[#524436] flex items-center gap-1.5 truncate">
                        <Languages className="size-3.5 text-[#8b5e0a] shrink-0" />
                        <span className="truncate">{astro.languages.join(", ")}</span>
                      </p>

                      {/* Experience */}
                      <p className="mt-1 text-xs text-[#524436] flex items-center gap-1.5 truncate">
                        <GraduationCap className="size-3.5 text-[#8b5e0a] shrink-0" />
                        <span>{astro.experienceYears} Years</span>
                      </p>

                      {/* Speciality */}
                      <p className="mt-1 text-xs text-[#524436] flex items-center gap-1.5 truncate">
                        <Sparkles className="size-3.5 text-[#8b5e0a] shrink-0" />
                        <span className="truncate">{astro.speciality}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Pricing on Left + Action Buttons on Right */}
                <div className="mt-4 pt-3 border-t border-[#f2e9b0]/80 flex items-center justify-between gap-2">
                  {/* Price & Flatdeal badge */}
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-sm sm:text-base text-[#1a1208]">
                        ₹{astro.pricePerMin}
                        <span className="text-xs font-normal text-[#6b5f4d]">/Min</span>
                      </span>
                      {astro.originalPricePerMin && (
                        <span className="text-xs text-[#9c8e7b] line-through font-medium">
                          ₹{astro.originalPricePerMin}/Min
                        </span>
                      )}
                    </div>
                    {astro.flatDealBadge && (
                      <span className="inline-block mt-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 tracking-wider">
                        {astro.flatDealBadge}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons: Chat & Call */}
                  <div className="flex items-center gap-1.5">
                    <Link href={`/chat/${astro.id}`}>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 shadow-sm transition-colors"
                      >
                        <MessageCircle className="size-3.5" />
                        <span>CHAT</span>
                      </button>
                    </Link>

                    {astro.canCall ? (
                      <Link href={`/call/${astro.id}`}>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-full border border-teal-600 text-teal-800 bg-teal-50 hover:bg-teal-100 font-bold text-xs px-3 py-1.5 transition-colors"
                        >
                          <Phone className="size-3.5 text-teal-700" />
                          <span>CALL</span>
                        </button>
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 text-stone-400 font-bold text-xs px-2.5 py-1.5 cursor-not-allowed">
                        OFFLINE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
