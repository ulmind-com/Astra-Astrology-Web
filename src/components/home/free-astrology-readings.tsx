"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/providers/language-provider";
import { READINGS_TRANSLATIONS } from "@/lib/home-translations";

interface ReadingCardItem {
  label: string;
  href: string;
  image: string;
}

const READINGS_LIST: ReadingCardItem[] = [
  {
    label: "Kundli",
    href: "/kundli",
    image: "/images/readings-kundli.jpg",
  },
  {
    label: "Match Making",
    href: "/kundli-matching",
    image: "/images/readings-matchmaking.jpg",
  },
  {
    label: "Love",
    href: "/astrologers",
    image: "/images/readings-love.jpg",
  },
  {
    label: "Planet Transits",
    href: "/dasha-calculator",
    image: "/images/readings-transits.jpg",
  },
  {
    label: "Panchang",
    href: "/nakshatra-calculator",
    image: "/images/readings-panchang.jpg",
  },
  {
    label: "Tarot",
    href: "/astrologers",
    image: "/images/readings-tarot.jpg",
  },
  {
    label: "Numerology",
    href: "/numerology",
    image: "/images/readings-numerology.jpg",
  },
  {
    label: "Vastu",
    href: "/vastu",
    image: "/images/readings-vastu.jpg",
  },
  {
    label: "Remedies",
    href: "/astrologers",
    image: "/images/readings-remedies.jpg",
  },
  {
    label: "Zodiac Signs",
    href: "/rashi-calculator",
    image: "/images/readings-zodiac.jpg",
  },
  {
    label: "Festivals",
    href: "/daily-horoscope",
    image: "/images/readings-festivals.jpg",
  },
  {
    label: "Spirituality",
    href: "/ai-astrologer",
    image: "/images/readings-spirituality.jpg",
  },
];

export function FreeAstrologyReadings() {
  const { language } = useLanguage();
  const t = READINGS_TRANSLATIONS[language] || READINGS_TRANSLATIONS.en;

  return (
    <section id="readings" className="relative bg-transparent py-8 sm:py-12 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
            {t.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6b5f4d]">
            {t.subtitle}
          </p>
        </div>

        {/* 12 Cards Grid (6 cols on desktop, 3 or 4 on tablet, 2 or 3 on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
          {READINGS_LIST.map((reading) => {
            const localizedLabel = t.items[reading.label] || reading.label;
            return (
              <Link
                key={reading.label}
                href={reading.href}
                className="group flex flex-col items-center gap-2.5 text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#eadf9a] bg-stone-100 shadow-[0_4px_16px_-4px_rgba(26,18,8,0.06)] transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-brand-400 group-hover:shadow-[0_16px_32px_-10px_rgba(240,210,80,0.6)]">
                  <Image
                    src={reading.image}
                    alt={localizedLabel}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
                  />
                </div>

                <span className="font-bold text-xs sm:text-[14px] text-[#1a1208] group-hover:text-[#8b5e0a] transition-colors line-clamp-1">
                  {localizedLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
