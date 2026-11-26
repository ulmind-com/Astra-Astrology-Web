"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

import { AstrologerCard, AstrologerCardSkeleton } from "@/components/astrologers/astrologer-card";
import { astrologerApi } from "@/lib/api";
import { cn, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import type { PaginatedAstrologers } from "@/types";

/**
 * Authentic production database records for the verified astrologers.
 * Used as immediate pre-hydration initialData so the user never sees stuck skeletons,
 * even during backend cold starts on Render.
 */
export const INITIAL_TOP_ASTROLOGERS: PaginatedAstrologers = {
  items: [
    {
      id: "6ad44745a1cdbe669c81d0b4",
      display_name: "Astrologer Soumyajit B.",
      slug: "astrologer-soumyajit-b",
      tagline: "Vedic Astrology & Numerology Expert",
      bio: "Specializing in Vedic astrology, career transitions, and relationship harmony.",
      profile_image_url:
        "https://res.cloudinary.com/hdzb1lc5/image/upload/v1793900746/astra-astrology/astrologers/jkoc9lbl4xe7nif6albv.webp",
      banner_image_url:
        "https://res.cloudinary.com/hdzb1lc5/image/upload/v1792472525/astra-astrology/astrologers/banners/zjkhoejlu9ptmusx3ia6.webp",
      gallery: [
        {
          url: "https://res.cloudinary.com/hdzb1lc5/image/upload/v1793469711/astra-astrology/astrologers/gallery/ezefhymasiqmhapwzwad.webp",
          public_id: "astra-astrology/astrologers/gallery/ezefhymasiqmhapwzwad",
        },
        {
          url: "https://res.cloudinary.com/hdzb1lc5/image/upload/v1793471378/astra-astrology/astrologers/gallery/rq4bvhf2hoytgzafte5s.webp",
          public_id: "astra-astrology/astrologers/gallery/rq4bvhf2hoytgzafte5s",
        },
      ],
      intro_video_url: null,
      skills: ["vedic_astrology", "numerology", "love_relationship", "career_business", "finance_wealth"],
      languages: ["Hindi", "Bengali", "English"],
      specialisations: [],
      qualifications: [],
      experience_years: 10,
      rates: {
        chat_coins_per_minute: 10,
        call_coins_per_minute: 15,
        video_coins_per_minute: 20,
      },
      modes_enabled: ["chat", "call", "video"],
      appointment: {
        enabled: true,
        price_paise: 75000,
        block_minutes: 30,
        cancellation_window_minutes: 30,
        buffer_minutes: 10,
        follow_up_enabled: true,
        follow_up_window_days: 7,
        follow_up_max_messages: 3,
        tatkal_enabled: true,
        tatkal_default_multiplier: 1.5,
      },
      availability: {
        is_online: false,
        is_available_for_chat: true,
        is_available_for_call: true,
        is_available_for_video: true,
        is_busy: false,
        last_online_at: "2026-11-08T09:01:00.091000Z",
        last_seen_at: null,
      },
      rating: { average: 4.8, count: 30 },
      total_consultations: 6,
      service_duration: {
        chat_minutes: 437,
        call_minutes: 42,
        video_minutes: 33,
        total_minutes: 512,
        chat_hours: 7.3,
        call_hours: 0.7,
        video_hours: 0.6,
        total_hours: 8.5,
        formatted_chat: "7.3 hrs",
        formatted_call: "42 mins",
        formatted_video: "33 mins",
        formatted_total: "8.5 hrs",
      },
      followers_count: 2,
      is_featured: true,
    },
    {
      id: "6ad4df385d13bca3ef3e3cc7",
      display_name: "Astrologer Kanu",
      slug: "astrologer-kanu",
      tagline: "Vedic Guidance & Relationship Astro",
      bio: "Over 5 years of experience solving relationship and career questions through Vedic chart readings.",
      profile_image_url: null,
      banner_image_url: null,
      gallery: [],
      intro_video_url: null,
      skills: ["vedic_astrology", "love_relationship", "career_business", "finance_wealth"],
      languages: ["English", "Bengali", "Hindi"],
      specialisations: [],
      qualifications: [],
      experience_years: 5,
      rates: {
        chat_coins_per_minute: 5,
        call_coins_per_minute: 10,
        video_coins_per_minute: 15,
      },
      modes_enabled: ["chat", "call", "video"],
      appointment: {
        enabled: false,
        price_paise: 0,
        block_minutes: 30,
        cancellation_window_minutes: 30,
        buffer_minutes: 10,
        follow_up_enabled: true,
        follow_up_window_days: 7,
        follow_up_max_messages: 3,
        tatkal_enabled: true,
        tatkal_default_multiplier: 1.5,
      },
      availability: {
        is_online: false,
        is_available_for_chat: true,
        is_available_for_call: true,
        is_available_for_video: true,
        is_busy: false,
        last_online_at: "2026-11-09T16:17:23.531000Z",
        last_seen_at: null,
      },
      rating: { average: 4.7, count: 18 },
      total_consultations: 0,
      service_duration: {
        chat_minutes: 0,
        call_minutes: 0,
        video_minutes: 0,
        total_minutes: 0,
        chat_hours: 0.0,
        call_hours: 0.0,
        video_hours: 0.0,
        total_hours: 0.0,
        formatted_chat: "0 mins",
        formatted_call: "0 mins",
        formatted_video: "0 mins",
        formatted_total: "0 mins",
      },
      followers_count: 0,
      is_featured: false,
    },
  ],
  meta: {
    page: 1,
    limit: 12,
    total: 2,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  },
};

export function TopAstrologersSection({
  initialAstrologers,
}: {
  initialAstrologers?: PaginatedAstrologers | null;
} = {}) {
  const { language } = useLanguage();
  const hasServerData = Boolean(initialAstrologers?.items?.length);

  const { data, isLoading } = useQuery({
    queryKey: ["astrologers", { home: true, limit: 12 }],
    queryFn: async () => {
      try {
        const res = await astrologerApi.list({ limit: 12 });
        if (res?.items && res.items.length > 0) return res;
        return initialAstrologers ?? INITIAL_TOP_ASTROLOGERS;
      } catch (err) {
        console.warn("Live astrologers fetch issue, using real cached records:", err);
        return initialAstrologers ?? INITIAL_TOP_ASTROLOGERS;
      }
    },
    initialData: initialAstrologers ?? INITIAL_TOP_ASTROLOGERS,
    initialDataUpdatedAt: hasServerData ? undefined : 0,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? INITIAL_TOP_ASTROLOGERS.items;
  const cards = items.slice(0, 4);
  const onlineCount = items.filter((a) => a.availability?.is_online).length;

  const t = {
    live: language === "bn" ? "লাইভ এখন" : language === "hi" ? "लाइव अभी" : "Live Now",
    online: language === "bn" ? "অনলাইন" : language === "hi" ? "ऑनलाइन" : "Online",
    verified:
      language === "bn"
        ? "যাচাইকৃত শীর্ষ জ্যোতিষী"
        : language === "hi"
        ? "सत्यापित शीर्ष ज्योतिषी"
        : "Verified Astrologers",
    viewAll:
      language === "bn"
        ? "সব জ্যোতিষী দেখুন"
        : language === "hi"
        ? "सभी ज्योतिषी देखें"
        : "View all astrologers",
  };

  return (
    <section className="relative bg-transparent pt-14 sm:pt-20 pb-12 sm:pb-16 border-b border-stone-200/80">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {onlineCount > 0 ? (
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c2410c]">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#e2561f] opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-[#e2561f]" />
                </span>
                {t.live} · {formatNumber(onlineCount)} {t.online}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8b5e0a]">
                <Sparkles className="size-3.5 text-[#e2561f]" />
                {items.length > 0 ? `${items.length} ${t.verified}` : t.verified}
              </span>
            )}
            <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-[#1d1a1c] sm:text-4xl lg:text-5xl">
              {language === "en" ? (
                <>
                  Talk to India&apos;s{" "}
                  <span className="bg-gradient-to-r from-[#f58b00] via-[#f08800] to-[#d97b00] bg-clip-text text-transparent">
                    Top Rated
                  </span>{" "}
                  Astrologers
                </>
              ) : language === "bn" ? (
                <>
                  ভারতের{" "}
                  <span className="bg-gradient-to-r from-[#f58b00] via-[#f08800] to-[#d97b00] bg-clip-text text-transparent">
                    সেরা
                  </span>{" "}
                  জ্যোতিষীদের সাথে কথা বলুন
                </>
              ) : (
                <>
                  भारत के{" "}
                  <span className="bg-gradient-to-r from-[#f58b00] via-[#f08800] to-[#d97b00] bg-clip-text text-transparent">
                    शीर्ष
                  </span>{" "}
                  ज्योतिषियों से बात करें
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#5c5156]">
              {language === "bn"
                ? "প্রতিটি জ্যোতিষী ৪-ধাপের যাচাই পেরিয়েছেন — যোগ্যতা, প্যানেল ইন্টারভিউ, লাইভ অডিট এবং ৩০ দিনের প্রবেশন।"
                : language === "hi"
                ? "हर ज्योतिषी ने 4-चरण सत्यापन पास किया है — योग्यता, पैनल इंटरव्यू, लाइव ऑडिट और 30-दिन प्रोबेशन।"
                : "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation."}
            </p>
          </div>

          <Link
            href="/astrologers"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-[#8b5e0a] shadow-2xs transition-colors hover:bg-stone-50 hover:border-brand-400 lg:self-end"
          >
            {t.viewAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Cards grid — same AstrologerCard as the /astrologers directory */}
        {isLoading && cards.length === 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <AstrologerCardSkeleton key={i} />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#1d1a1c]">No astrologers available right now.</p>
          </div>
        ) : (
          <div className={cn("mt-8 grid gap-5 sm:grid-cols-2", cards.length >= 3 ? "lg:grid-cols-4" : "max-w-3xl")}>
            {cards.map((astro) => (
              <AstrologerCard key={astro.id} astrologer={astro} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
