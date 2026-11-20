"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Coins,
  Heart,
  Shield,
  Briefcase,
  Activity,
  Compass,
  Moon,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

interface Props {
  activeTab?: string;
  onSelectFilter?: (type: string, value: string) => void;
}

export function ShopByWhatMatters({ onSelectFilter }: Props) {
  const { language } = useLanguage();
  const [tab, setTab] = React.useState<"purpose" | "rashi" | "planet" | "crystal">("purpose");

  const purposes = [
    {
      id: "wealth",
      title_bn: "ধন ও অর্থলাভ (Wealth)",
      title_en: "Wealth & Prosperity",
      desc_bn: "পায়রাইট, ধন যোগ পিরামিড, সিট্রিন ও শ্রীকুবের যন্ত্র",
      desc_en: "Pyrite, Dhan Yog Pyramid, Citrine & Kuber Yantra",
      color: "border-amber-400 bg-amber-50/50 hover:bg-amber-100/60",
      icon: Coins,
      tag: "wealth",
    },
    {
      id: "love",
      title_bn: "প্রেম ও দাম্পত্য (Love)",
      title_en: "Love & Relationships",
      desc_bn: "রোজ কোয়ার্টজ, ২-মুখী রুদ্রাক্ষ ও শুক্র কবচ",
      desc_en: "Rose Quartz, 2-Mukhi Rudraksha & Venus Sets",
      color: "border-rose-300 bg-rose-50/50 hover:bg-rose-100/60",
      icon: Heart,
      tag: "love",
    },
    {
      id: "protection",
      title_bn: "সুরক্ষা ও নজরদোষ (Protection)",
      title_en: "Protection & Evil Eye",
      desc_bn: "করুঙ্গালি মালা, ব্ল্যাক ট্যুরমালাইন ও কীর্তিমুখ কবচ",
      desc_en: "Karungali Mala, Black Tourmaline & Evil Eye Bands",
      color: "border-stone-400 bg-stone-50/70 hover:bg-stone-100",
      icon: Shield,
      tag: "protection",
    },
    {
      id: "career",
      title_bn: "চাকরি ও পদোন্নতি (Career)",
      title_en: "Career & Business Growth",
      desc_bn: "তাম্র সূর্য যন্ত্র, ১০ ও ১২-মুখী রুদ্রাক্ষ ও টাইগার আই",
      desc_en: "Surya Yantra, 10 & 12 Mukhi Rudraksha & Tiger Eye",
      color: "border-orange-300 bg-orange-50/50 hover:bg-orange-100/60",
      icon: Briefcase,
      tag: "career",
    },
    {
      id: "peace",
      title_bn: "মানসিক শান্তি ও নিদ্রা (Peace)",
      title_en: "Calm & Stress Relief",
      desc_bn: "অ্যামেথিস্ট ক্রিস্টাল ডোম ও ৫-মুখী রুদ্রাক্ষ মালা",
      desc_en: "Amethyst Crystal Dome & 5-Mukhi Rudraksha Mala",
      color: "border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/60",
      icon: Moon,
      tag: "peace",
    },
    {
      id: "dosha",
      title_bn: "কুণ্ডলী গ্রহদোষ নিবারণ (Doshas)",
      title_en: "Kundli Planetary Doshas",
      desc_bn: "শনির সাড়েসাতি, মাঙ্গলিক ও রাহু-কেতু মহাপ্রতিকার",
      desc_en: "Saturn Sade Sati, Manglik & Rahu-Ketu Cures",
      color: "border-purple-300 bg-purple-50/50 hover:bg-purple-100/60",
      icon: Flame,
      tag: "dosha",
    },
  ];

  const rashis = [
    { id: "aries", name_bn: "মেষ (Aries)", symbol: "♈", stone: "Red Coral & Carnelian" },
    { id: "taurus", name_bn: "বৃষ (Taurus)", symbol: "♉", stone: "Rose Quartz & Diamond" },
    { id: "gemini", name_bn: "মিথুন (Gemini)", symbol: "♊", stone: "Emerald & Agate" },
    { id: "cancer", name_bn: "কর্কট (Cancer)", symbol: "♋", stone: "Moonstone & Pearl" },
    { id: "leo", name_bn: "সিংহ (Leo)", symbol: "♌", stone: "Sunstone & Pyrite" },
    { id: "virgo", name_bn: "কন্যা (Virgo)", symbol: "♍", stone: "Green Jade & Peridot" },
    { id: "libra", name_bn: "তুলা (Libra)", symbol: "♎", stone: "Opal & Rose Quartz" },
    { id: "scorpio", name_bn: "বৃশ্চিক (Scorpio)", symbol: "♏", stone: "Black Obsidian & Coral" },
    { id: "sagittarius", name_bn: "ধনু (Sagittarius)", symbol: "♐", stone: "Yellow Topaz & Citrine" },
    { id: "capricorn", name_bn: "মকর (Capricorn)", symbol: "♑", stone: "Blue Sapphire & 7-Mukhi" },
    { id: "aquarius", name_bn: "কুম্ভ (Aquarius)", symbol: "♒", stone: "Amethyst & Karungali" },
    { id: "pisces", name_bn: "মীন (Pisces)", symbol: "♓", stone: "Aquamarine & 5-Mukhi" },
  ];

  const planets = [
    { id: "sun", name: "☉ রবি (Sun)", remedy: "12-Mukhi Rudraksha, Ruby, Copper Surya Yantra" },
    { id: "moon", name: "☽ চন্দ্র (Moon)", remedy: "2-Mukhi Rudraksha, Pearl, Moonstone Bracelet" },
    { id: "mars", name: "♂ মঙ্গল (Mars)", remedy: "3-Mukhi Rudraksha, Red Coral, Mangal Kavach" },
    { id: "mercury", name: "☿ বুধ (Mercury)", remedy: "4-Mukhi Rudraksha, Emerald, Green Aventurine" },
    { id: "jupiter", name: "♃ বৃহস্পতি (Jupiter)", remedy: "5-Mukhi Rudraksha, Yellow Sapphire, Citrine" },
    { id: "venus", name: "♀ শুক্র (Venus)", remedy: "6-Mukhi Rudraksha, Diamond, Shukra Yantra" },
    { id: "saturn", name: "♄ শনি (Saturn)", remedy: "7-Mukhi Rudraksha, Blue Sapphire, Iron Ring" },
    { id: "rahu", name: "☊ রাহু (Rahu)", remedy: "8-Mukhi Rudraksha, Gomed, Solid Silver Cube" },
    { id: "ketu", name: "☋ কেতু (Ketu)", remedy: "9-Mukhi Rudraksha, Cat's Eye, Ashwagandha Root" },
  ];

  const crystals = [
    { id: "pyrite", name: "পায়রাইট (Pyrite)", benefit: "আকর্ষণ করে অফুরন্ত ধন, অর্থ ও সৌভাগ্য" },
    { id: "citrine", name: "সিট্রিন (Citrine)", benefit: "বাণিজ্য উন্নতি, ব্যবসায় সমৃদ্ধি ও ক্যাশ ফ্লো" },
    { id: "rose_quartz", name: "রোজ কোয়ার্টজ (Rose Quartz)", benefit: "প্রেমের স্থায়িত্ব, দাম্পত্য কলহ শান্তি ও আকর্ষণ" },
    { id: "amethyst", name: "অ্যামেথিস্ট (Amethyst)", benefit: "দুশ্চিন্তা ও অনিদ্রা দূরীকরণ, তৃতীয় নেত্র জাগ্রত" },
    { id: "tiger_eye", name: "টাইগার আই (Tiger Eye)", benefit: "আত্মবিশ্বাস, সাহসিকতা ও দৃষ্টিদোষ নিবারণ" },
    { id: "selenite", name: "সেলিনাইট (Selenite)", benefit: "অন্যান্য সমস্ত ক্রিস্টাল চার্জিং ও ঘরের ইতিবাচক শক্তি" },
  ];

  return (
    <div className="w-full rounded-3xl border-2 border-stone-200/90 bg-white p-5 sm:p-8 shadow-xs space-y-6">
      {/* Title & Description */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <Sparkles className="size-3.5 text-amber-600" />
          <span>Shop by What Matters</span>
        </div>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900">
          {language === "bn"
            ? "আপনার জীবনের মূল সমস্যা ও অভীষ্ট লক্ষ্য বেছে নিন"
            : "Tell us what you want to attract. We'll show what works."}
        </h2>
        <p className="text-xs sm:text-sm text-stone-500">
          {language === "bn"
            ? "শাস্ত্রীয় মতে প্রতিটি গ্রহ ও ইচ্ছার জন্য রয়েছে সুনির্দিষ্ট পবিত্র রত্ন, রুদ্রাক্ষ ও ক্রিস্টাল প্রতিকার।"
            : "Every sacred remedy is laboratory tested and individually consecrated on the banks of Varanasi."}
        </p>
      </div>

      {/* 4 Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto scrollbar-none gap-2">
        <button
          type="button"
          onClick={() => setTab("purpose")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 ${
            tab === "purpose"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {language === "bn" ? "🎯 উদ্দেশ্য ভিত্তিক (By Purpose)" : "🎯 By Purpose"}
        </button>
        <button
          type="button"
          onClick={() => setTab("rashi")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 ${
            tab === "rashi"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {language === "bn" ? "♈ রাশি ভিত্তিক (By Rashi)" : "♈ By Zodiac"}
        </button>
        <button
          type="button"
          onClick={() => setTab("planet")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 ${
            tab === "planet"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {language === "bn" ? "🪐 গ্রহ প্রতিকার (By Planet)" : "🪐 By Planet"}
        </button>
        <button
          type="button"
          onClick={() => setTab("crystal")}
          className={`pb-3 px-4 font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer border-b-2 ${
            tab === "crystal"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          {language === "bn" ? "💎 পবিত্র ক্রিস্টাল (By Crystal)" : "💎 By Crystal"}
        </button>
      </div>

      {/* Tab 1: By Purpose */}
      {tab === "purpose" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {purposes.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectFilter?.("purpose", p.tag)}
                className={`text-left rounded-2xl border-2 p-4 transition-all cursor-pointer group flex flex-col justify-between ${p.color}`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-amber-800 group-hover:scale-110 transition-transform">
                      <Icon className="size-5" />
                    </div>
                    <ChevronRight className="size-4 text-stone-400 group-hover:translate-x-1 group-hover:text-amber-700 transition-all" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors">
                    {language === "bn" ? p.title_bn : p.title_en}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium">
                    {language === "bn" ? p.desc_bn : p.desc_en}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-200/50 flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span>Explore Collection</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-stone-200">
                    100% Cashback
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Tab 2: By Rashi */}
      {tab === "rashi" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {rashis.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSelectFilter?.("rashi", r.id)}
              className="text-left rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50/60 hover:border-amber-400 p-3.5 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl text-amber-700 font-serif">{r.symbol}</span>
                <span className="font-bold text-xs text-stone-900 group-hover:text-amber-800">
                  {r.name_bn}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 truncate">{r.stone}</p>
              <div className="mt-2 text-[10px] text-amber-700 font-bold">
                ১০০% প্রাণ-প্রতিষ্ঠিত
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Tab 3: By Planet */}
      {tab === "planet" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {planets.map((pl) => (
            <button
              key={pl.id}
              type="button"
              onClick={() => onSelectFilter?.("planet", pl.id)}
              className="text-left rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50/60 hover:border-amber-400 p-3.5 transition-all cursor-pointer group"
            >
              <h4 className="font-bold text-xs text-stone-900 group-hover:text-amber-800 mb-1">
                {pl.name}
              </h4>
              <p className="text-xs text-stone-600 line-clamp-1">{pl.remedy}</p>
            </button>
          ))}
        </div>
      )}

      {/* Tab 4: By Crystal */}
      {tab === "crystal" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {crystals.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectFilter?.("crystal", c.id)}
              className="text-left rounded-2xl border border-stone-200 bg-stone-50 hover:bg-amber-50/60 hover:border-amber-400 p-3.5 transition-all cursor-pointer group"
            >
              <h4 className="font-bold text-xs text-stone-900 group-hover:text-amber-800 mb-1">
                {c.name}
              </h4>
              <p className="text-xs text-stone-600">{c.benefit}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
