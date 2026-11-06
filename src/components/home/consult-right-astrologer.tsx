"use client";

import {
  Briefcase,
  Heart,
  IndianRupee,
  Lightbulb,
  UserRound,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/providers/language-provider";
import { CONSULT_CATEGORIES_TRANSLATIONS } from "@/lib/home-translations";

interface ConsultCategory {
  label: string;
  href: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CONSULT_CATEGORIES: ConsultCategory[] = [
  {
    label: "Love & Relationship",
    href: "/astrologers",
    image: "/images/consult/love-relationship.jpg",
    icon: Heart,
  },
  {
    label: "Marriage & Kundli",
    href: "/kundli-matching",
    image: "/images/consult/marriage-kundli.jpg",
    icon: Users,
  },
  {
    label: "Career",
    href: "/astrologers",
    image: "/images/consult/career.jpg",
    icon: Briefcase,
  },
  {
    label: "Woman Astrologer",
    href: "/astrologers",
    image: "/images/consult/woman-astrologer.jpg",
    icon: UserRound,
  },
  {
    label: "Business",
    href: "/astrologers",
    image: "/images/consult/business.jpg",
    icon: Lightbulb,
  },
  {
    label: "Money",
    href: "/astrologers",
    image: "/images/consult/money.jpg",
    icon: IndianRupee,
  },
];

export function ConsultRightAstrologer() {
  const { language } = useLanguage();
  const t = CONSULT_CATEGORIES_TRANSLATIONS[language] || CONSULT_CATEGORIES_TRANSLATIONS.en;

  return (
    <section className="relative bg-white py-8 sm:py-12 border-b border-[#f2e9b0]/60">
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

        {/* 6 Cards Grid (6 cols on desktop, 3 on tablet, 2 on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
          {CONSULT_CATEGORIES.map((cat) => {
            const localized = t.categories[cat.label] || cat.label;
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl border border-[#ebd881] bg-[#fffcf0] shadow-[0_4px_16px_-4px_rgba(26,18,8,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#fcd404] hover:shadow-[0_14px_30px_-10px_rgba(240,210,80,0.5)] flex flex-col items-center justify-center p-4 sm:p-5 text-center min-h-[110px] sm:min-h-[130px]"
              >
                {/* Card visual from screenshot */}
                <div className="relative aspect-[375/222] w-full max-w-[140px] rounded-xl overflow-hidden mb-2.5 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={cat.image}
                    alt={localized}
                    fill
                    className="object-contain"
                    sizes="140px"
                  />
                </div>

                <span className="font-bold text-xs sm:text-[13px] text-[#1a1208] group-hover:text-[#8b5e0a] transition-colors leading-tight">
                  {localized}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
