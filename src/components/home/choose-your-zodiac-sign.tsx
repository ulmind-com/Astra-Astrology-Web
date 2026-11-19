"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export interface ZodiacSignMeta {
  id: string;
  name: string;
  bengaliName: string;
  hindiName: string;
  sanskrit: string;
  dates: string;
  icon: string;
  element: "Fire" | "Earth" | "Air" | "Water";
}

export const ZODIAC_SIGNS_DATA: ZodiacSignMeta[] = [
  {
    id: "aries",
    name: "Aries",
    bengaliName: "মেষ",
    hindiName: "मेष",
    sanskrit: "Mesha",
    dates: "Mar 21 - Apr 19",
    icon: "/images/zodiac/medallions/aries.png",
    element: "Fire",
  },
  {
    id: "taurus",
    name: "Taurus",
    bengaliName: "বৃষ",
    hindiName: "वृषभ",
    sanskrit: "Vrishabha",
    dates: "Apr 20 - May 20",
    icon: "/images/zodiac/medallions/taurus.png",
    element: "Earth",
  },
  {
    id: "gemini",
    name: "Gemini",
    bengaliName: "মিথুন",
    hindiName: "मिथुन",
    sanskrit: "Mithuna",
    dates: "May 21 - Jun 21",
    icon: "/images/zodiac/medallions/gemini.png",
    element: "Air",
  },
  {
    id: "cancer",
    name: "Cancer",
    bengaliName: "কর্কট",
    hindiName: "कर्क",
    sanskrit: "Karka",
    dates: "Jun 22 - Jul 22",
    icon: "/images/zodiac/medallions/cancer.png",
    element: "Water",
  },
  {
    id: "leo",
    name: "Leo",
    bengaliName: "সিংহ",
    hindiName: "सिंह",
    sanskrit: "Simha",
    dates: "Jul 23 - Aug 22",
    icon: "/images/zodiac/medallions/leo.png",
    element: "Fire",
  },
  {
    id: "virgo",
    name: "Virgo",
    bengaliName: "কন্যা",
    hindiName: "कन्या",
    sanskrit: "Kanya",
    dates: "Aug 23 - Sept 22",
    icon: "/images/zodiac/medallions/virgo.png",
    element: "Earth",
  },
  {
    id: "libra",
    name: "Libra",
    bengaliName: "তুলা",
    hindiName: "तुला",
    sanskrit: "Tula",
    dates: "Sept 23 - Oct 23",
    icon: "/images/zodiac/medallions/libra.png",
    element: "Air",
  },
  {
    id: "scorpio",
    name: "Scorpio",
    bengaliName: "বৃশ্চিক",
    hindiName: "वृश्चिक",
    sanskrit: "Vrishchika",
    dates: "Oct 24 - Nov 22",
    icon: "/images/zodiac/medallions/scorpio.png",
    element: "Water",
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    bengaliName: "ধনু",
    hindiName: "धनु",
    sanskrit: "Dhanu",
    dates: "Nov 23 - Dec 21",
    icon: "/images/zodiac/medallions/sagittarius.png",
    element: "Fire",
  },
  {
    id: "capricorn",
    name: "Capricorn",
    bengaliName: "মকর",
    hindiName: "मकर",
    sanskrit: "Makara",
    dates: "Dec 22 - Jan 19",
    icon: "/images/zodiac/medallions/capricorn.png",
    element: "Earth",
  },
  {
    id: "aquarius",
    name: "Aquarius",
    bengaliName: "কুম্ভ",
    hindiName: "कुंभ",
    sanskrit: "Kumbha",
    dates: "Jan 20 - Feb 18",
    icon: "/images/zodiac/medallions/aquarius.png",
    element: "Air",
  },
  {
    id: "pisces",
    name: "Pisces",
    bengaliName: "মীন",
    hindiName: "मीन",
    sanskrit: "Meena",
    dates: "Feb 19 - Mar 20",
    icon: "/images/zodiac/medallions/pisces.png",
    element: "Water",
  },
];

interface Props {
  className?: string;
  onSelectSign?: (signId: string) => void;
  selectedSignId?: string;
}

export function ChooseYourZodiacSign({ className = "", onSelectSign, selectedSignId }: Props) {
  const { language } = useLanguage();

  return (
    <section className={`py-12 sm:py-16 bg-white select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Section Heading (Matching InstaAstro Screenshot) */}
        <div className="space-y-2 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            {language === "bn"
              ? "আপনার রাশি বেছে নিন"
              : language === "hi"
              ? "अपनी राशि चुनें"
              : "Choose your Zodiac Sign"}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium max-w-xl mx-auto">
            {language === "bn"
              ? "আজকের নির্ভুল বৈদিক রাশিফল, শুভ রঙ ও গ্রহের দিকনির্দেশনা জানতে আপনার রাশিতে ক্লিক করুন।"
              : "Select your zodiac sign to explore today's cosmic forecast, lucky attributes, and Vedic planetary guidance."}
          </p>
        </div>

        {/* 12 Zodiac Signs Grid (2 Rows of 6 on Desktop, Responsive 3/4 on Mobile) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-y-7 sm:gap-y-9 gap-x-3 sm:gap-x-6">
          {ZODIAC_SIGNS_DATA.map((sign) => {
            const isSelected = selectedSignId === sign.id;
            const displayName =
              language === "bn" ? `${sign.name} (${sign.bengaliName})` : language === "hi" ? `${sign.name} (${sign.hindiName})` : sign.name;

            const cardContent = (
              <div
                className={`group flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                  isSelected ? "scale-105" : "hover:-translate-y-1.5"
                }`}
              >
                {/* Circular Golden Ring Container (Exact Screenshot Style) */}
                <div
                  className={`relative size-20 sm:size-22 md:size-24 rounded-full border flex items-center justify-center p-2.5 sm:p-3 transition-all duration-300 ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/80 ring-4 ring-amber-400/30 shadow-[0_0_24px_rgba(245,158,11,0.35)]"
                      : "border-amber-300/80 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 shadow-xs group-hover:border-amber-400 group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.22)] group-hover:bg-amber-50/60"
                  }`}
                >
                  <Image
                    src={sign.icon}
                    alt={sign.name}
                    width={80}
                    height={80}
                    priority={false}
                    className="size-14 sm:size-16 md:size-17 object-contain transform transition-transform duration-300 group-hover:scale-110 drop-shadow-xs"
                    unoptimized
                  />
                </div>

                {/* Sign Name */}
                <span
                  className={`mt-2.5 sm:mt-3 font-semibold text-xs sm:text-sm tracking-tight transition-colors line-clamp-1 ${
                    isSelected ? "text-amber-700 font-bold" : "text-stone-900 group-hover:text-amber-600"
                  }`}
                >
                  {sign.name}
                </span>

                {/* Date Range (Exact InstaAstro Screenshot Style) */}
                <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-0.5 whitespace-nowrap">
                  {sign.dates}
                </span>
              </div>
            );

            if (onSelectSign) {
              return (
                <button
                  key={sign.id}
                  type="button"
                  onClick={() => onSelectSign(sign.id)}
                  className="focus:outline-none"
                  aria-label={`Select ${sign.name}`}
                >
                  {cardContent}
                </button>
              );
            }

            return (
              <Link
                key={sign.id}
                href={`/daily-horoscope/${sign.id}`}
                className="focus:outline-none"
                aria-label={`View daily horoscope for ${sign.name}`}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
