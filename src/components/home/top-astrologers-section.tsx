"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

import { AstrologerCard, AstrologerCardSkeleton } from "@/components/astrologers/astrologer-card";
import { astrologerApi } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";

export function TopAstrologersSection() {
  const { language } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["astrologers", { home: true, limit: 12 }],
    queryFn: () => astrologerApi.list({ limit: 12 }),
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

  const items = data?.items ?? [];
  const cards = items.slice(0, 4);
  const onlineCount =
    (data as { total?: number } | undefined)?.total ?? (items.length > 0 ? 1240 : 0);

  const t = {
    live: language === "bn" ? "লাইভ এখন" : language === "hi" ? "लाइव अभी" : "Live Now",
    online: language === "bn" ? "অনলাইন" : language === "hi" ? "ऑनलाइन" : "Online",
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
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-[#8b5e0a] shadow-2xs transition-colors hover:bg-stone-50 hover:border-brand-400 lg:self-end"
          >
            {t.viewAll}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Cards grid — same AstrologerCard as the /astrologers directory */}
        {isLoading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <AstrologerCardSkeleton key={i} />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center">
            <p className="text-sm font-semibold text-[#1a1208]">No astrologers available right now.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((astro) => (
              <AstrologerCard key={astro.id} astrologer={astro} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
