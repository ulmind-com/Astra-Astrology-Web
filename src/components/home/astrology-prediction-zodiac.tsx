"use client";

import Link from "next/link";
import React from "react";
import { useLanguage } from "@/providers/language-provider";
import { ZODIAC_PREDICTION_TRANSLATIONS } from "@/lib/home-translations";

interface ZodiacSignItem {
  id: string;
  name: string;
  sanskrit: string;
  dates: string;
  image: string;
}

const ZODIAC_SIGNS: ZodiacSignItem[] = [
  {
    id: "aries",
    name: "Aries",
    sanskrit: "Mesha",
    dates: "Mar 21 - Apr 19",
    image: "/images/zodiac/vedic/mesha.svg",
  },
  {
    id: "taurus",
    name: "Taurus",
    sanskrit: "Vrishabha",
    dates: "Apr 20 - May 20",
    image: "/images/zodiac/vedic/rishabha.svg",
  },
  {
    id: "gemini",
    name: "Gemini",
    sanskrit: "Mithuna",
    dates: "May 21 - Jun 20",
    image: "/images/zodiac/vedic/mithuna.svg",
  },
  {
    id: "cancer",
    name: "Cancer",
    sanskrit: "Karka",
    dates: "Jun 21 - Jul 22",
    image: "/images/zodiac/vedic/kataka.svg",
  },
  {
    id: "leo",
    name: "Leo",
    sanskrit: "Simha",
    dates: "Jul 23 - Aug 22",
    image: "/images/zodiac/vedic/simha.svg",
  },
  {
    id: "virgo",
    name: "Virgo",
    sanskrit: "Kanya",
    dates: "Aug 23 - Sep 22",
    image: "/images/zodiac/vedic/kanya.svg",
  },
  {
    id: "libra",
    name: "Libra",
    sanskrit: "Tula",
    dates: "Sep 23 - Oct 22",
    image: "/images/zodiac/vedic/thula.svg",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    sanskrit: "Vrishchika",
    dates: "Oct 23 - Nov 21",
    image: "/images/zodiac/vedic/vrischika.svg",
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    sanskrit: "Dhanu",
    dates: "Nov 22 - Dec 21",
    image: "/images/zodiac/vedic/dhanus.svg",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    sanskrit: "Makara",
    dates: "Dec 22 - Jan 19",
    image: "/images/zodiac/vedic/makara.svg",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    sanskrit: "Kumbha",
    dates: "Jan 20 - Feb 18",
    image: "/images/zodiac/vedic/kumbha.svg",
  },
  {
    id: "pisces",
    name: "Pisces",
    sanskrit: "Meena",
    dates: "Feb 19 - Mar 20",
    image: "/images/zodiac/vedic/meena.svg",
  },
];

export function AstrologyPredictionZodiac() {
  const { language } = useLanguage();
  const t = ZODIAC_PREDICTION_TRANSLATIONS[language] || ZODIAC_PREDICTION_TRANSLATIONS.en;

  return (
    <section className="relative bg-white py-8 sm:py-12 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
              {t.title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6b5f4d]">
              {t.subtitle}
            </p>
          </div>

          <Link
            href="/daily-horoscope"
            className="rounded-full border border-[#eadf9a] bg-[#fffdf5] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#8b5e0a] hover:bg-[#fff7d1] hover:border-brand-400 transition-colors shadow-2xs"
          >
            {t.viewAll}
          </Link>
        </div>

        {/* 12 Zodiac Signs Grid (2 rows of 6 on desktop, 3 or 4 on mobile) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {ZODIAC_SIGNS.map((sign) => {
            const localized = t.signs[sign.id] || { name: sign.name, sanskrit: sign.sanskrit, dates: sign.dates };
            return (
              <Link
                key={sign.id}
                href={`/daily-horoscope?sign=${sign.id}`}
                className="group relative flex flex-col items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl border border-[#efe6bd]/70 bg-gradient-to-b from-white to-[#fffdf3] shadow-[0_1px_2px_rgba(26,18,8,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-300 hover:shadow-[0_14px_30px_-10px_rgba(201,154,20,0.45)] text-center overflow-hidden"
              >
                {/* subtle top sheen */}
                <span className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-gradient-to-b from-[#fff4c2]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Temple-grade gold medallion badge (astro-icons vedic art) */}
                <div className="relative flex items-center justify-center size-16 sm:size-[72px] rounded-full bg-gradient-to-br from-[#fdf6da] to-[#f3e3a0] ring-1 ring-[#d9b64a] shadow-[inset_0_1px_3px_rgba(255,255,255,0.85),0_5px_12px_-4px_rgba(201,154,20,0.4)] transition-all duration-300 group-hover:ring-brand-500 group-hover:shadow-[inset_0_1px_3px_rgba(255,255,255,0.95),0_10px_20px_-6px_rgba(201,154,20,0.6)] group-hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sign.image}
                    alt={localized.name}
                    width={72}
                    height={72}
                    className="size-10 sm:size-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-bold text-sm sm:text-[0.95rem] text-[#1a1208] group-hover:text-[#8b5e0a] transition-colors">
                    {localized.name}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#a08a5e] font-semibold tracking-wide">
                    {localized.sanskrit}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[#b8ab8f] font-medium hidden sm:block">
                    {localized.dates}
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
