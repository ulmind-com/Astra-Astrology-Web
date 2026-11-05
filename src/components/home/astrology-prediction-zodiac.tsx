"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

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
    image: "/images/zodiac/aries.png",
  },
  {
    id: "taurus",
    name: "Taurus",
    sanskrit: "Vrishabha",
    dates: "Apr 20 - May 20",
    image: "/images/zodiac/taurus.png",
  },
  {
    id: "gemini",
    name: "Gemini",
    sanskrit: "Mithuna",
    dates: "May 21 - Jun 20",
    image: "/images/zodiac/gemini.png",
  },
  {
    id: "cancer",
    name: "Cancer",
    sanskrit: "Karka",
    dates: "Jun 21 - Jul 22",
    image: "/images/zodiac/cancer.png",
  },
  {
    id: "leo",
    name: "Leo",
    sanskrit: "Simha",
    dates: "Jul 23 - Aug 22",
    image: "/images/zodiac/leo.png",
  },
  {
    id: "virgo",
    name: "Virgo",
    sanskrit: "Kanya",
    dates: "Aug 23 - Sep 22",
    image: "/images/zodiac/virgo.png",
  },
  {
    id: "libra",
    name: "Libra",
    sanskrit: "Tula",
    dates: "Sep 23 - Oct 22",
    image: "/images/zodiac/libra.png",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    sanskrit: "Vrishchika",
    dates: "Oct 23 - Nov 21",
    image: "/images/zodiac/scorpio.png",
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    sanskrit: "Dhanu",
    dates: "Nov 22 - Dec 21",
    image: "/images/zodiac/sagittarius.png",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    sanskrit: "Makara",
    dates: "Dec 22 - Jan 19",
    image: "/images/zodiac/capricorn.png",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    sanskrit: "Kumbha",
    dates: "Jan 20 - Feb 18",
    image: "/images/zodiac/aquarius.png",
  },
  {
    id: "pisces",
    name: "Pisces",
    sanskrit: "Meena",
    dates: "Feb 19 - Mar 20",
    image: "/images/zodiac/pisces.png",
  },
];

export function AstrologyPredictionZodiac() {
  return (
    <section className="relative bg-white py-8 sm:py-12 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold tracking-tight text-[#1a1208]">
              Today&apos;s Astrology Prediction
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6b5f4d]">
              Select your zodiac sign to unlock today&apos;s personalized horoscope and planetary insights.
            </p>
          </div>

          <Link
            href="/daily-horoscope"
            className="rounded-full border border-[#eadf9a] bg-[#fffdf5] px-4 py-1.5 text-xs sm:text-sm font-bold text-[#8b5e0a] hover:bg-[#fff7d1] hover:border-brand-400 transition-colors shadow-2xs"
          >
            View All
          </Link>
        </div>

        {/* 12 Zodiac Signs Grid (2 rows of 6 on desktop, 3 or 4 on mobile) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-5">
          {ZODIAC_SIGNS.map((sign) => (
            <Link
              key={sign.id}
              href={`/daily-horoscope?sign=${sign.id}`}
              className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border border-transparent hover:border-[#f2e9b0] hover:bg-[#fffdf2] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_-6px_rgba(240,210,80,0.4)] text-center"
            >
              <div className="relative size-16 sm:size-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={sign.image}
                  alt={sign.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              <span className="mt-2 font-bold text-xs sm:text-sm text-[#1a1208] group-hover:text-[#8b5e0a] transition-colors">
                {sign.name}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#8b7e6b] font-medium hidden sm:block">
                {sign.sanskrit}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
