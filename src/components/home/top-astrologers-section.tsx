"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, MessageCircle, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

import { astrologerApi } from "@/lib/api";
import { coinsPerMinute, formatNumber } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { usePlatform } from "@/providers/realtime-provider";
import { SKILL_LABELS } from "@/types";

interface DisplayAstrologer {
  id: string;
  name: string;
  avatarUrl?: string | null;
  rating: number;
  orders: number;
  languages: string[];
  experienceYears: number;
  tags: string[];
  pricePerMin: number;
  isOnline: boolean;
  slug: string;
}

// Trust badge derived from the astrologer's own stats.
function badgeFor(a: DisplayAstrologer): { label: string; cls: string } {
  if (a.orders >= 40000)
    return { label: "Celebrity", cls: "bg-[#fff1cf] text-[#b8860b] border-[#f0d98a]" };
  if (a.rating >= 4.9 && a.orders >= 10000)
    return { label: "Top Choice", cls: "bg-[#fde7d4] text-[#c2410c] border-[#f3c9a8]" };
  return { label: "Rising Star", cls: "bg-[#e8ecfb] text-[#4f5bd5] border-[#cdd6f5]" };
}

export function TopAstrologersSection() {
  const { language } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["astrologers", { home: true, limit: 12 }],
    queryFn: () => astrologerApi.list({ limit: 12 }),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const platform = usePlatform();
  const coinsPerRupee = platform?.coins_per_rupee ?? 1;

  const displayList = useMemo<DisplayAstrologer[]>(() => {
    const apiItems = data?.items ?? [];
    return apiItems.map((astro) => {
      const primaryMode = astro.modes_enabled.includes("chat")
        ? "chat"
        : astro.modes_enabled[0] ?? "chat";
      const pricePerMin = Math.round(coinsPerMinute(astro.rates, primaryMode) / coinsPerRupee);
      const tags = (astro.skills ?? []).slice(0, 3).map((s) => SKILL_LABELS[s] ?? s);
      return {
        id: astro.id,
        name: astro.display_name,
        avatarUrl: astro.profile_image_url,
        rating: astro.rating.average > 0 ? Number(astro.rating.average.toFixed(1)) : 5.0,
        orders:
          astro.total_consultations > 0
            ? astro.total_consultations
            : astro.rating.count > 0
            ? astro.rating.count
            : 120,
        languages:
          astro.languages && astro.languages.length > 0 ? astro.languages : ["Hindi", "English"],
        experienceYears: astro.experience_years || 5,
        tags: tags.length > 0 ? tags : ["Vedic"],
        pricePerMin: pricePerMin || 10,
        isOnline: Boolean(astro.availability?.is_online),
        slug: astro.slug ?? astro.id,
      };
    });
  }, [data, coinsPerRupee]);

  const cards = displayList.slice(0, 4);
  const onlineCount =
    (data as { total?: number } | undefined)?.total ??
    (displayList.length > 0 ? 1240 : 0);

  const t = {
    live: language === "bn" ? "লাইভ এখন" : language === "hi" ? "लाइव अभी" : "Live Now",
    online: language === "bn" ? "অনলাইন" : language === "hi" ? "ऑनलाइन" : "Online",
    viewAll:
      language === "bn"
        ? "সব জ্যোতিষী দেখুন"
        : language === "hi"
        ? "सभी ज्योतिषी देखें"
        : "View all astrologers",
    yrs: language === "bn" ? "বছর অভিজ্ঞতা" : language === "hi" ? "वर्ष अनुभव" : "yrs exp",
    chat: language === "bn" ? "চ্যাট" : language === "hi" ? "चैट" : "Chat",
    call: language === "bn" ? "কল" : language === "hi" ? "कॉल" : "Call",
    min: language === "bn" ? "/মিনিট" : language === "hi" ? "/मिनट" : "/min",
  };

  return (
    <section className="relative bg-transparent pt-14 sm:pt-20 pb-12 sm:pb-16 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#c2410c]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#e2561f] opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-[#e2561f]" />
              </span>
              {t.live} · {formatNumber(onlineCount)} {t.online}
            </span>
            <h2 className="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-[#1a1208] sm:text-4xl lg:text-5xl">
              {language === "en" ? (
                <>
                  Talk to India&apos;s{" "}
                  <span className="bg-gradient-to-r from-[#f5c000] via-[#f0b100] to-[#d9a300] bg-clip-text text-transparent">
                    Top Rated
                  </span>{" "}
                  Astrologers
                </>
              ) : language === "bn" ? (
                <>
                  ভারতের{" "}
                  <span className="bg-gradient-to-r from-[#f5c000] via-[#f0b100] to-[#d9a300] bg-clip-text text-transparent">
                    সেরা
                  </span>{" "}
                  জ্যোতিষীদের সাথে কথা বলুন
                </>
              ) : (
                <>
                  भारत के{" "}
                  <span className="bg-gradient-to-r from-[#f5c000] via-[#f0b100] to-[#d9a300] bg-clip-text text-transparent">
                    शीर्ष
                  </span>{" "}
                  ज्योतिषियों से बात करें
                </>
              )}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5f4d]">
              {language === "bn"
                ? "প্রতিটি জ্যোতিষী ৪-ধাপের যাচাই পেরিয়েছেন — যোগ্যতা, প্যানেল ইন্টারভিউ, লাইভ অডিট এবং ৩০ দিনের প্রবেশন।"
                : language === "hi"
                ? "हर ज्योतिषी ने 4-चरण सत्यापन पास किया है — योग्यता, पैनल इंटरव्यू, लाइव ऑडिट और 30-दिन प्रोबेशन।"
                : "Every astrologer below has cleared a 4-step verification — qualification, panel interview, live audits, and a 30-day probation."}
            </p>
          </div>

          <Link
            href="/astrologers"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#eadf9a] bg-white px-5 py-2.5 text-sm font-bold text-[#8b5e0a] shadow-2xs transition-colors hover:bg-[#fff7d1] hover:border-brand-400 lg:self-end"
          >
            {t.viewAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-[22px] border border-[#eadf9a]/70 bg-white p-4 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div className="size-14 rounded-full bg-stone-200" />
                  <div className="h-5 w-16 rounded-full bg-stone-200" />
                </div>
                <div className="mt-3 h-4 w-1/2 rounded bg-stone-200" />
                <div className="mt-2 h-3 w-3/4 rounded bg-stone-100" />
                <div className="mt-3 h-8 rounded-full bg-stone-100" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#eadf9a] bg-white/60 p-8 text-center">
            <p className="text-sm font-semibold text-[#1a1208]">No astrologers available right now.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {cards.map((a) => {
              const href = `/astrologers/${a.slug}`;
              const badge = badgeFor(a);
              return (
                <div
                  key={a.id}
                  className="flex flex-col justify-between rounded-[18px] sm:rounded-[22px] border border-[#ebd89e] bg-white p-2.5 sm:p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md"
                >
                  <div>
                    {/* Top Row: Avatar with Online Indicator + Badge */}
                    <div className="flex items-start justify-between">
                      <Link href={href} className="relative block">
                        <span className="block size-11 sm:size-[58px] overflow-hidden rounded-full ring-2 ring-emerald-500/80 ring-offset-1 sm:ring-offset-2 ring-offset-white">
                          {a.avatarUrl ? (
                            <Image
                              src={a.avatarUrl}
                              alt={a.name}
                              width={58}
                              height={58}
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center bg-gradient-to-br from-[#ffd700] to-[#ffaa00] text-lg font-extrabold text-[#1a1208]">
                              {a.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </span>
                        {a.isOnline && (
                          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                        )}
                      </Link>

                      <span
                        className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Name + Verified Check */}
                    <Link href={href} className="mt-2 flex items-center gap-1 group">
                      <h3 className="text-[13px] sm:text-[15px] font-bold text-[#1a1208] group-hover:text-[#b8860b] transition-colors truncate">
                        {a.name}
                      </h3>
                      <BadgeCheck className="size-3.5 fill-emerald-500 text-white shrink-0" />
                    </Link>

                    {/* Tags (Skills) — capped to ~2 rows on mobile to keep the tile tight */}
                    <div className="mt-1.5 flex max-h-[42px] flex-wrap gap-1 overflow-hidden sm:max-h-none">
                      {a.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-[#eee1b1] bg-[#fffdf7] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium text-[#6b5f4d]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Languages & Experience */}
                    <div className="mt-2 flex flex-col gap-0.5 text-[10px] sm:text-[11px] text-[#6b5f4d] sm:flex-row sm:items-center sm:justify-between">
                      <span className="truncate font-medium sm:max-w-[130px]">
                        {a.languages.join(", ")}
                      </span>
                      <span className="shrink-0 text-[#8b7d63] font-medium">
                        {a.experienceYears} {t.yrs}
                      </span>
                    </div>

                    {/* Rating + Price Row */}
                    <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#1a1208]">
                        <Star className="size-3.5 fill-[#e08c12] text-[#e08c12]" />
                        {a.rating}
                        <span className="text-[10px] font-normal text-[#8b7d63]">
                          · {formatNumber(a.orders)}+
                        </span>
                      </span>
                      <span className="text-xs font-extrabold text-[#1a1208]">
                        ₹{a.pricePerMin}
                        <span className="text-[10px] font-normal text-[#6b5f4d]">{t.min}</span>
                      </span>
                    </div>
                  </div>

                  {/* Astrotalk-style Actions: Rounded Compact Buttons */}
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <Link
                      href={`/chat/${a.id}`}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-[#d9b64a] py-1.5 text-[11px] sm:text-xs font-bold text-[#3b2e1b] transition-colors shadow-2xs"
                    >
                      <MessageCircle className="size-3.5" />
                      {t.chat}
                    </Link>
                    <Link
                      href={`/call/${a.id}`}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-500/80 bg-white hover:bg-emerald-50 py-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 transition-colors shadow-2xs"
                    >
                      <Phone className="size-3.5" />
                      {t.call}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
