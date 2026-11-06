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
    <section className="relative bg-transparent py-10 sm:py-14 border-b border-[#f2e9b0]/60">
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
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-[#eadf9a]/70 bg-white p-5 shadow-sm"
              >
                <div className="mx-auto size-[72px] rounded-full bg-stone-200" />
                <div className="mt-4 h-4 w-1/2 rounded bg-stone-200" />
                <div className="mt-3 h-3 w-2/3 rounded bg-stone-100" />
                <div className="mt-4 h-9 rounded-lg bg-stone-100" />
              </div>
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[#eadf9a] bg-white/60 p-8 text-center">
            <p className="text-sm font-semibold text-[#1a1208]">No astrologers available right now.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((a) => {
              const href = `/astrologers/${a.slug}`;
              const badge = badgeFor(a);
              return (
                <div
                  key={a.id}
                  className="flex flex-col rounded-2xl border border-[#eadf9a] bg-white p-5 shadow-[0_6px_20px_-10px_rgba(26,18,8,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-[0_18px_36px_-14px_rgba(240,210,80,0.5)]"
                >
                  {/* avatar + badge */}
                  <div className="flex items-start justify-between">
                    <Link href={href} className="relative block">
                      <span className="block size-[72px] overflow-hidden rounded-full ring-2 ring-emerald-400/70">
                        {a.avatarUrl ? (
                          <Image
                            src={a.avatarUrl}
                            alt={a.name}
                            width={72}
                            height={72}
                            className="size-full object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center bg-gradient-to-br from-[#ffd700] to-[#ffaa00] text-xl font-extrabold text-[#1a1208]">
                            {a.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </span>
                      {a.isOnline && (
                        <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </Link>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* name + verified */}
                  <Link href={href} className="mt-3 flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-[#1a1208]">{a.name}</h3>
                    <BadgeCheck className="size-4 fill-emerald-500 text-white" />
                  </Link>

                  {/* tags */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {a.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#eadf9a] bg-[#fffdf5] px-2.5 py-0.5 text-[11px] font-semibold text-[#6b5f4d]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* languages + exp */}
                  <p className="mt-3 text-xs font-medium text-[#524436]">
                    {a.languages.join(" · ")}
                  </p>
                  <p className="text-xs text-[#8b7d63]">
                    {a.experienceYears} {t.yrs}
                  </p>

                  {/* rating + price */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[#1a1208]">
                      <Star className="size-4 fill-[#e08c12] text-[#e08c12]" />
                      {a.rating}
                      <span className="ml-1 text-xs font-medium text-[#8b7d63]">
                        · {formatNumber(a.orders)}+
                      </span>
                    </span>
                    <span className="text-sm font-extrabold text-[#1a1208]">
                      ₹{a.pricePerMin}
                      <span className="text-xs font-normal text-[#6b5f4d]">{t.min}</span>
                    </span>
                  </div>

                  {/* actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2.5">
                    <Link
                      href={`/chat/${a.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d9b64a] bg-[#fffdf5] py-2.5 text-sm font-bold text-[#8b5e0a] transition-colors hover:bg-[#fff3c4]"
                    >
                      <MessageCircle className="size-4" />
                      {t.chat}
                    </Link>
                    <Link
                      href={`/call/${a.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                    >
                      <Phone className="size-4" />
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
