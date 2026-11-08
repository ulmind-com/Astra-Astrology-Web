"use client";

import {
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartHandshake,
  Layers,
  PartyPopper,
  ScrollText,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useLanguage } from "@/providers/language-provider";

interface ServiceItem {
  icon: React.ElementType;
  href: string;
  /** Tailwind gradient classes for the icon tile */
  tile: string;
  /** Glow / accent color */
  glow: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
}

const SERVICES: ServiceItem[] = [
  {
    icon: ScrollText,
    href: "/kundli",
    tile: "from-[#ffb347] to-[#ff8a00]",
    glow: "rgba(255,138,0,0.35)",
    title: { en: "Free Kundli", bn: "ফ্রি কুণ্ডলী", hi: "फ्री कुंडली" },
    subtitle: {
      en: "Detailed birth chart in 60 sec",
      bn: "৬০ সেকেন্ডে জন্মছক",
      hi: "60 सेकंड में जन्म कुंडली",
    },
  },
  {
    icon: HeartHandshake,
    href: "/kundli-matching",
    tile: "from-[#ff6b8b] to-[#e63950]",
    glow: "rgba(230,57,80,0.32)",
    title: { en: "Kundali Matching", bn: "কুণ্ডলী মিলন", hi: "कुंडली मिलान" },
    subtitle: {
      en: "Guna milan compatibility score",
      bn: "গুণ মিলন স্কোর",
      hi: "गुण मिलान स्कोर",
    },
  },
  {
    icon: Sun,
    href: "/daily-horoscope",
    tile: "from-[#ffd34d] to-[#f5a300]",
    glow: "rgba(245,163,0,0.34)",
    title: { en: "Daily Horoscope", bn: "দৈনিক রাশিফল", hi: "दैनिक राशिफल" },
    subtitle: {
      en: "Fresh reading for all 12 signs",
      bn: "১২ রাশির আজকের ভাগ্য",
      hi: "सभी 12 राशियों के लिए",
    },
  },
  {
    icon: CalendarDays,
    href: "/panchang",
    tile: "from-[#8b7bff] to-[#5a3ff2]",
    glow: "rgba(90,63,242,0.3)",
    title: { en: "Panchang", bn: "পঞ্জিকা", hi: "पंचांग" },
    subtitle: {
      en: "Daily tithi, nakshatra & yoga",
      bn: "দৈনিক তিথি ও নক্ষত্র",
      hi: "दैनिक तिथि व नक्षत्र",
    },
  },
  {
    icon: Clock,
    href: "/muhurat",
    tile: "from-[#38d39f] to-[#0f9d6e]",
    glow: "rgba(15,157,110,0.3)",
    title: { en: "Subh Muhurat", bn: "শুভ মুহূর্ত", hi: "शुभ मुहूर्त" },
    subtitle: {
      en: "Auspicious timings for big days",
      bn: "শুভ কাজের সময়",
      hi: "शुभ कार्य का समय",
    },
  },
  {
    icon: PartyPopper,
    href: "/festivals",
    tile: "from-[#ff8fb0] to-[#ff4f8b]",
    glow: "rgba(255,79,139,0.3)",
    title: { en: "Festivals", bn: "উৎসব", hi: "त्योहार" },
    subtitle: {
      en: "2026 Hindu festival calendar",
      bn: "২০২৬ উৎসব ক্যালেন্ডার",
      hi: "2026 त्योहार कैलेंडर",
    },
  },
  {
    icon: Layers,
    href: "/tarot",
    tile: "from-[#6fb1ff] to-[#2b6fe0]",
    glow: "rgba(43,111,224,0.3)",
    title: { en: "Tarot Reading", bn: "ট্যারো রিডিং", hi: "टैरो रीडिंग" },
    subtitle: {
      en: "3-card love, career & finance",
      bn: "প্রেম, ক্যারিয়ার ও অর্থ",
      hi: "प्रेम, करियर व धन",
    },
  },
  {
    icon: Sparkles,
    href: "/numerology",
    tile: "from-[#c08bff] to-[#8b2fe0]",
    glow: "rgba(139,47,224,0.3)",
    title: { en: "Numerology", bn: "সংখ্যাতত্ত্ব", hi: "अंक ज्योतिष" },
    subtitle: {
      en: "Lucky numbers & name analysis",
      bn: "ভাগ্য সংখ্যা ও নাম",
      hi: "भाग्यांक व नाम विश्लेषण",
    },
  },
];

const SECTION_COPY = {
  en: { kicker: "Our Services", heading1: "Our ", heading2: "Services", sub: "Everything you need for daily guidance — crafted by verified Vedic experts." },
  bn: { kicker: "আমাদের সেবা", heading1: "আমাদের ", heading2: "সেবা", sub: "দৈনিক দিকনির্দেশনার সবকিছু — সার্টিফাইড বৈদিক বিশেষজ্ঞদের তৈরি।" },
  hi: { kicker: "हमारी सेवाएं", heading1: "हमारी ", heading2: "सेवाएं", sub: "दैनिक मार्गदर्शन के लिए सब कुछ — प्रमाणित वैदिक विशेषज्ञों द्वारा।" },
};

export function OurServicesSection() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as "en" | "bn" | "hi";
  const copy = SECTION_COPY[lang];
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="bg-transparent py-12 sm:py-16 border-b border-stone-200/80">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#c08a12]">
              {copy.kicker}
            </span>
            <h2 className="mt-1.5 text-3xl sm:text-5xl font-black tracking-tight text-[#1a1208] leading-none">
              {copy.heading1}
              <span className="bg-gradient-to-r from-[#f5a300] to-[#e07b00] bg-clip-text text-transparent">
                {copy.heading2}
              </span>
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[#6b5f4d] max-w-md">{copy.sub}</p>
          </div>

          {/* Scroll controls */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll left"
              className="flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-[#8b6a1a] hover:bg-[#fcd404] hover:text-[#1c1304] hover:border-[#d9af00] transition-all cursor-pointer shadow-xs"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll right"
              className="flex size-10 items-center justify-center rounded-full border border-stone-200 bg-white text-[#8b6a1a] hover:bg-[#fcd404] hover:text-[#1c1304] hover:border-[#d9af00] transition-all cursor-pointer shadow-xs"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        {/* Horizontal scroll rail */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <Link
                key={svc.title.en}
                href={svc.href}
                className="group relative snap-start shrink-0 w-[158px] sm:w-[250px] overflow-hidden rounded-[18px] sm:rounded-[22px] border border-stone-200 bg-white p-3.5 sm:p-5 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.1)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-lg"
              >
                {/* Decorative corner glow */}
                <div
                  className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  style={{ backgroundColor: svc.glow }}
                />

                {/* Icon tile */}
                <div
                  className={`relative flex size-11 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${svc.tile} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}
                  style={{ boxShadow: `0 8px 18px -6px ${svc.glow}` }}
                >
                  <Icon className="size-5 sm:size-7 stroke-[2]" />
                </div>

                {/* Text */}
                <h3 className="relative mt-3 sm:mt-5 text-[13px] sm:text-[15px] font-extrabold tracking-tight text-[#1a1208]">
                  {svc.title[lang]}
                </h3>
                <p className="relative mt-1 text-[10.5px] sm:text-[11.5px] leading-snug text-[#766545] min-h-[28px] sm:min-h-[32px]">
                  {svc.subtitle[lang]}
                </p>

                {/* Arrow */}
                <div className="relative mt-2.5 sm:mt-4 flex items-center justify-between">
                  <span className="h-px flex-1 bg-gradient-to-r from-[#efe3b0] to-transparent" />
                  <span className="ml-3 flex size-7 sm:size-8 items-center justify-center rounded-full bg-[#fef6d8] text-[#9a7414] transition-all duration-300 group-hover:bg-[#fcd404] group-hover:text-[#1c1304]">
                    <ArrowUpRight className="size-3.5 sm:size-4 stroke-[2.4]" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
