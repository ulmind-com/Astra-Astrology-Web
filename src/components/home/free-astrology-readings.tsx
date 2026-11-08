"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Heart,
  Orbit,
  CalendarDays,
  Sparkles,
  Hash,
  Compass,
  Leaf,
  Star,
  Flame,
  Hand,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { READINGS_TRANSLATIONS } from "@/lib/home-translations";

interface ReadingCardItem {
  label: string;
  href: string;
  Icon: LucideIcon;
  fg: string; // icon color
  bg: string; // icon tile bg
  glow: string; // card right glow gradient start
}

const READINGS_LIST: ReadingCardItem[] = [
  { label: "Kundli", href: "/kundli", Icon: BookOpen, fg: "text-amber-600", bg: "bg-amber-100", glow: "from-amber-200/40" },
  { label: "Match Making", href: "/kundli-matching", Icon: HeartHandshake, fg: "text-rose-600", bg: "bg-rose-100", glow: "from-rose-200/40" },
  { label: "Love", href: "/astrologers", Icon: Heart, fg: "text-red-500", bg: "bg-red-100", glow: "from-red-200/40" },
  { label: "Planet Transits", href: "/dasha-calculator", Icon: Orbit, fg: "text-blue-600", bg: "bg-blue-100", glow: "from-blue-200/40" },
  { label: "Panchang", href: "/nakshatra-calculator", Icon: CalendarDays, fg: "text-teal-600", bg: "bg-teal-100", glow: "from-teal-200/40" },
  { label: "Tarot", href: "/astrologers", Icon: Sparkles, fg: "text-purple-600", bg: "bg-purple-100", glow: "from-purple-200/40" },
  { label: "Numerology", href: "/numerology", Icon: Hash, fg: "text-orange-600", bg: "bg-orange-100", glow: "from-orange-200/40" },
  { label: "Vastu", href: "/vastu", Icon: Compass, fg: "text-green-600", bg: "bg-green-100", glow: "from-green-200/40" },
  { label: "Remedies", href: "/astrologers", Icon: Leaf, fg: "text-emerald-600", bg: "bg-emerald-100", glow: "from-emerald-200/40" },
  { label: "Zodiac Signs", href: "/rashi-calculator", Icon: Star, fg: "text-indigo-600", bg: "bg-indigo-100", glow: "from-indigo-200/40" },
  { label: "Festivals", href: "/daily-horoscope", Icon: Flame, fg: "text-pink-600", bg: "bg-pink-100", glow: "from-pink-200/40" },
  { label: "Spirituality", href: "/ai-astrologer", Icon: Hand, fg: "text-violet-600", bg: "bg-violet-100", glow: "from-violet-200/40" },
];

export function FreeAstrologyReadings() {
  const { language } = useLanguage();
  const t = READINGS_TRANSLATIONS[language] || READINGS_TRANSLATIONS.en;

  const subtitle =
    language === "en"
      ? "Explore traditional Vedic & modern tools — free to start, read by practitioners who consult daily."
      : t.subtitle;

  return (
    <section id="readings" className="relative bg-transparent py-10 sm:py-14 border-b border-stone-200/80">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#c2410c]">
              {language === "bn" ? "ক্যাটাগরি অনুযায়ী" : language === "hi" ? "श्रेणी अनुसार" : "Browse by Tool"}
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1208] sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6b5f4d]">{subtitle}</p>
          </div>

          <Link
            href="/astrologers"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-5 py-2.5 text-sm font-bold text-[#8b5e0a] shadow-2xs transition-colors hover:bg-stone-50 hover:border-brand-400 sm:self-end"
          >
            {language === "bn" ? "সব দেখুন" : language === "hi" ? "सभी देखें" : "View all tools"}
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Category cards — icon panel + label */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {READINGS_LIST.map((r) => {
            const label = t.items[r.label] || r.label;
            const Icon = r.Icon;
            return (
              <Link
                key={r.label}
                href={r.href}
                className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-2.5 shadow-[0_4px_16px_-6px_rgba(26,18,8,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-md"
              >
                {/* inner tinted panel with decorations + centered icon */}
                <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-stone-50 to-stone-100/70 py-7">
                  {/* faint celestial decorations */}
                  <Sparkles className="pointer-events-none absolute left-3 top-3 size-4 text-[#cdbb8a] opacity-30" />
                  <Sun className="pointer-events-none absolute left-4 bottom-3 size-5 text-[#cdbb8a] opacity-25" />
                  <Moon className="pointer-events-none absolute right-4 top-4 size-4 text-[#cdbb8a] opacity-25" />
                  <Star className="pointer-events-none absolute right-3 bottom-3 size-3.5 text-[#cdbb8a] opacity-30" />

                  {/* centered circle icon */}
                  <span
                    className={`relative flex size-14 items-center justify-center rounded-full border border-current bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 ${r.fg}`}
                  >
                    <Icon className="size-6" />
                  </span>
                </div>

                {/* label below panel */}
                <span className="mt-2.5 pb-1 text-center text-[13px] font-bold leading-tight text-[#1a1208]">
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
