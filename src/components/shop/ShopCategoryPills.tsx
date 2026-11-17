"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Gem,
  Coins,
  Crown,
  Compass,
  Gift,
  Heart,
  Shield,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export function ShopCategoryPills() {
  const { language } = useLanguage();

  const categories = [
    {
      id: "zodiac",
      label_bn: "রাশি ব্রেসলেট",
      label_en: "Zodiac Store",
      icon: Sparkles,
      color: "from-amber-500 to-yellow-600",
      link: "/shop?purpose=zodiac",
      badge: "Free Selenite",
    },
    {
      id: "wealth",
      label_bn: "পায়রাইট ও ধন যোগ",
      label_en: "Pyrite & Wealth",
      icon: Coins,
      color: "from-amber-600 to-orange-600",
      link: "/shop?purpose=wealth",
      badge: "Bestseller",
    },
    {
      id: "rudraksha",
      label_bn: "সিদ্ধ রুদ্রাক্ষ",
      label_en: "Siddh Rudraksha",
      icon: Flame,
      color: "from-red-600 to-amber-700",
      link: "/shop?category=rudraksha",
      badge: "Kashi Energized",
    },
    {
      id: "gemstones",
      label_bn: "বৈদিক রত্নপাথর",
      label_en: "Vedic Gemstones",
      icon: Gem,
      color: "from-emerald-600 to-teal-700",
      link: "/shop?category=gemstones",
      badge: "Lab Certified",
    },
    {
      id: "karungali",
      label_bn: "করুঙ্গালি মালা",
      label_en: "Karungali Wood",
      icon: Shield,
      color: "from-stone-700 to-stone-900",
      link: "/shop?purpose=protection",
      badge: "Protection",
    },
    {
      id: "love",
      label_bn: "প্রেম ও আকর্ষণ",
      label_en: "Love & Harmony",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      link: "/shop?purpose=love",
      badge: "Rose Quartz",
    },
    {
      id: "vastu",
      label_bn: "বাস্তু ও ধন কচ্ছপ",
      label_en: "Vastu & Tortoise",
      icon: Compass,
      color: "from-teal-600 to-cyan-700",
      link: "/shop?purpose=vastu",
      badge: "Abundance",
    },
    {
      id: "combos",
      label_bn: "২০২৬ ভাগ্য কম্বো",
      label_en: "Destiny Combos",
      icon: Gift,
      color: "from-purple-600 to-indigo-700",
      link: "/shop?purpose=combos",
      badge: "Big Savings",
    },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
          <Layers className="size-4 text-amber-700" />
          <span>{language === "bn" ? "প্রতিকার ক্যাটাগরি ব্রাউজ করুন" : "Browse by Sacred Category"}</span>
        </h3>
        <span className="text-xs text-amber-800 font-semibold">
          100% Consecrated • Lab Tested
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.id}
              href={c.link}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Circular Badge */}
              <div className="relative mb-2">
                <div
                  className={`size-14 sm:size-16 rounded-full bg-gradient-to-br ${c.color} p-0.5 shadow-md group-hover:scale-108 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
                >
                  <div className="size-full rounded-full bg-[#1c120c] flex items-center justify-center text-amber-200 group-hover:bg-transparent group-hover:text-white transition-colors">
                    <Icon className="size-6 sm:size-7" />
                  </div>
                </div>

                {c.badge && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs uppercase tracking-tighter">
                    {c.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 group-hover:text-amber-800 transition-colors line-clamp-1">
                {language === "bn" ? c.label_bn : c.label_en}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
