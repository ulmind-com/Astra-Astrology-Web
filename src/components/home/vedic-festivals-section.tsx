"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { FestivalClipart } from "@/components/festivals/festival-cliparts";
import { astrologyApi, type WebFestivalItem } from "@/lib/api";

interface FestivalItem {
  id: string;
  name: Record<string, string>;
  date: Record<string, string>;
  tithi: Record<string, string>;
  category: "major" | "vrat" | "jayanti";
  desc: Record<string, string>;
  badge: Record<string, string>;
  glowColor: string;
}

const HOME_FESTIVALS: FestivalItem[] = [
  {
    id: "makar-sankranti",
    name: { en: "Makar Sankranti", bn: "মকর সংক্রান্তি", hi: "मकर संक्रांति" },
    date: { en: "January 14, 2026", bn: "১৪ জানুয়ারি, ২০২৬", hi: "14 जनवरी 2026" },
    tithi: { en: "Magha Krishna Paksha", bn: "মাঘ কৃষ্ণ পক্ষ", hi: "माघ कृष्ण पक्ष" },
    category: "major",
    desc: {
      en: "Sun's transition into Capricorn. Auspicious day for holy dips, solar charity & harvesting celebrations.",
      bn: "সূর্যের মকর রাশিতে উত্তরায়ণ প্রবেশ। পুণ্যস্নান, দান ও পৌষ সংক্রান্তির পিঠেপুলির মহোৎসব।",
      hi: "सूर्य का मकर राशि में उत्तरायण प्रवेश। पवित्र स्नान, दान और तिल-गुड़ का पावन पर्व।",
    },
    badge: { en: "Solar Festival", bn: "সূর্য সংক্রান্তি", hi: "सौर पर्व" },
    glowColor: "#f59e0b",
  },
  {
    id: "saraswati-puja",
    name: { en: "Saraswati Puja (Vasant Panchami)", bn: "সরস্বতী পূজা (বসন্ত পঞ্চমী)", hi: "सरस्वती पूजा (बसंत पंचमी)" },
    date: { en: "January 23, 2026", bn: "২৩ জানুয়ারি, ২০২৬", hi: "23 जनवरी 2026" },
    tithi: { en: "Magha Shukla Panchami", bn: "মাঘ শুক্ল পঞ্চমী", hi: "माघ शुक्ल पंचमी" },
    category: "major",
    desc: {
      en: "Celebration of Goddess Saraswati, divine wisdom, arts, learning, and arrival of spring.",
      bn: "বিদ্যা ও সংগীতের দেবী সরস্বতীর আরাধনা, শিশুদের হাতেখড়ি ও বসন্ত ঋতুর শুভ সূচনা।",
      hi: "विद्या, ज्ञान और कला की देवी मां सरस्वती की आराधना और वसंत ऋतु का स्वागत।",
    },
    badge: { en: "Wisdom & Arts", bn: "বিদ্যা ও জ্ঞান", hi: "विद्या व ज्ञान" },
    glowColor: "#eab308",
  },
  {
    id: "maha-shivaratri",
    name: { en: "Maha Shivaratri", bn: "মহা শিবরাত্রি", hi: "महा शिवरात्रि" },
    date: { en: "February 16, 2026", bn: "১৬ ফেব্রুয়ারি, ২০২৬", hi: "16 फ़रवरी 2026" },
    tithi: { en: "Phalguna Krishna Chaturdashi", bn: "ফাল্গুন কৃষ্ণ চতুর্দশী", hi: "फाल्गुन कृष्ण चतुर्दशी" },
    category: "vrat",
    desc: {
      en: "The great night of Lord Shiva. Night-long fasting, Rudrabhishek & deep spiritual meditation.",
      bn: "মহাদেব শিবের মহা উপবাস ও ব্রত। চার প্রহরে শিবলিঙ্গে অভিষেক ও আত্মশুদ্ধির সাধনা।",
      hi: "भगवान शिव की महान महारात्रि। निर्जला व्रत, रुद्राभिषेक और चार प्रहर की विशेष पूजा।",
    },
    badge: { en: "Major Vrat", bn: "প্রধান ব্রত", hi: "महाव्रत" },
    glowColor: "#6366f1",
  },
  {
    id: "holi-dol-yatra",
    name: { en: "Holi & Dol Yatra", bn: "হোলি ও দোলযাত্রা", hi: "होली एवं धुलेंडी" },
    date: { en: "March 4, 2026", bn: "৪ মার্চ, ২০২৬", hi: "4 मार्च 2026" },
    tithi: { en: "Phalguna Purnima", bn: "ফাল্গুনী পূর্ণিমা", hi: "फाल्गुन पूर्णिमा" },
    category: "major",
    desc: {
      en: "The festival of divine colors & love, celebrating Radha-Krishna and victory of righteousness.",
      bn: "রঙ ও আনন্দের উৎসব। রাধাকৃষ্ণের দোল পূর্ণিমা ও অশুভের বিনাশে সত্যের বিজয়।",
      hi: "रंगों और उल्लास का महापर्व। होलिका दहन, राधा-कृष्ण का रंगोत्सव और सामाजिक समरसता।",
    },
    badge: { en: "Colors of Joy", bn: "রঙের উৎসব", hi: "रंगोत्सव" },
    glowColor: "#ec4899",
  },
  {
    id: "pohela-boishakh",
    name: { en: "Pohela Boishakh (New Year)", bn: "পহেলা বৈশাখ (শুভ নববর্ষ ১৪৩৩)", hi: "पोइলা बैसाख" },
    date: { en: "April 15, 2026", bn: "১৫ এপ্রিল, ২০২৬", hi: "15 अप्रैल 2026" },
    tithi: { en: "Boishakh 1 (Solar Mesha)", bn: "১ বৈশাখ (সৌর মেষ সংক্রান্তি)", hi: "बैसाख संक्रांति" },
    category: "major",
    desc: {
      en: "Traditional Bengali New Year. Auspicious Haal Khata accounting opening & Lakshmi-Ganesha puja.",
      bn: "বাঙালির শুভ নববর্ষ ১৪৩৩। নতুন হালখাতা উন্মোচন, ব্যবসায়ী প্রতিষ্ঠানে লক্ষ্মী-গণেশ পূজা।",
      hi: "पारंपरिक बंगाली नववर्ष। व्यापारियों का नया बहीखाता आरंभ और लक्ष्मी-गणेश पूजन।",
    },
    badge: { en: "New Year", bn: "শুভ নববর্ষ", hi: "नववर्ष" },
    glowColor: "#e11d48",
  },
  {
    id: "akshaya-tritiya",
    name: { en: "Akshaya Tritiya", bn: "অক্ষয় তৃতীয়", hi: "अक्षय तृतीया" },
    date: { en: "April 20, 2026", bn: "২০ এপ্রিল, ২০২৬", hi: "20 अप्रैल 2026" },
    tithi: { en: "Vaishakha Shukla Tritiya", bn: "বৈশাখ শুক্লা তৃতীয়া", hi: "वैशाख शुक्ल तृतीया" },
    category: "major",
    desc: {
      en: "Supreme eternal muhurat for purchasing gold, beginning new ventures & eternal wealth rituals.",
      bn: "চিরস্থায়ী শুভ মুহূর্ত। সোনা কেনা, নতুন ব্যবসা শুরু ও অক্ষয় লক্ষ্মী কৃপা লাভের শ্রেষ্ঠ দিন।",
      hi: "स्वर्ण खरीद, नया व्यापार आरंभ और अक्षय फल की प्राप्ति हेतु सर्वोत्तम अबूझ मुहूर्त।",
    },
    badge: { en: "Eternal Muhurat", bn: "অক্ষয় মুহূর্ত", hi: "अबूझ मुहूर्त" },
    glowColor: "#f59e0b",
  },
  {
    id: "krishna-janmashtami",
    name: { en: "Krishna Janmashtami", bn: "শ্রীকৃষ্ণ জন্মাষ্টমী", hi: "श्रीकृष्ण जन्माष्टमी" },
    date: { en: "September 4, 2026", bn: "৪ সেপ্টেম্বর, ২০২৬", hi: "4 सितंबर 2026" },
    tithi: { en: "Bhadrapada Krishna Ashtami", bn: "ভাদ্র কৃষ্ণ অষ্টমী", hi: "भाद्रपद कृष्ण अष्टमी" },
    category: "major",
    desc: {
      en: "Divine appearance of Lord Krishna in Rohini Nakshatra. Midnight royal puja & Dahi Handi.",
      bn: "রোহিণী নক্ষত্রে ভগবান শ্রীকৃষ্ণের মর্ত্যে শুভাগমন। নির্জলা ব্রত ও মধ্যরাতের রাজকীয় পূজা।",
      hi: "रोहिणी नक्षत्र में भगवान श्री कृष्ण का जन्मोत्सव। रात्रि जागरण, अभिषेक और माखन भोग।",
    },
    badge: { en: "Avatara Jayanti", bn: "অবতার জয়ন্তী", hi: "अवतार जयंती" },
    glowColor: "#0284c7",
  },
  {
    id: "durga-puja-dussehra",
    name: { en: "Durga Puja & Dussehra", bn: "শারদীয়া দুর্গাপূজা ও বিজয়া দশমী", hi: "दुर्गा पूजा एवं दशहरा" },
    date: { en: "October 16 – 20, 2026", bn: "১৬ – ২০ অক্টোবর, ২০২৬", hi: "16 – 20 अक्टूबर 2026" },
    tithi: { en: "Ashwin Shukla Shashthi to Dashami", bn: "আশ্বিন শুক্লা ষষ্ঠী থেকে দশমী", hi: "आश्विन शुक्ल षष्ठी से दशमी" },
    category: "major",
    desc: {
      en: "Grand celebration of Mahishasuramardini Goddess Durga and victory of good over evil.",
      bn: "মহিষাসুরমর্দিনী মা দুর্গার মহোৎসব, সন্ধিপূজা, কুমারী পূজা এবং দশমীতে বিজয়ার শুভাশিস।",
      hi: "मां दुर्गा का महाउत्सव, शस्त्र पूजन, रामलीला और रावण दहन पर अधर्म पर धर्म की विजय।",
    },
    badge: { en: "Grand Festival", bn: "মহোৎসব", hi: "महापर्व" },
    glowColor: "#dc2626",
  },
  {
    id: "dhanteras-diwali",
    name: { en: "Dhanteras & Diwali (Kali Puja)", bn: "ধনতেরাস, দীপাবলি ও শ্যামা পূজা", hi: "धनतेरस, दीपावली व महालक्ष्मी पूजन" },
    date: { en: "November 6 – 8, 2026", bn: "৬ – ৮ নভেম্বর, ২০২৬", hi: "6 – 8 नवंबर 2026" },
    tithi: { en: "Kartika Krishna Trayodashi & Amavasya", bn: "কার্তিকী কৃষ্ণা ত্রয়োদশী ও অমাবস্যা", hi: "कार्तिक कृष्ण त्रयोदशी व अमावस्या" },
    category: "major",
    desc: {
      en: "Grand festival of lights, welcoming Goddess Mahalakshmi, Kuber, and worship of Ma Kali.",
      bn: "আলোর মহা উৎসব। মা লক্ষ্মী ও কুবেরের আবাহন, অমাবস্যার নিশীথ রাতে মা কালীর পূজা।",
      hi: "प्रकाश पर्व। समुद्र मंथन से प्रकट मां लक्ष्मी, कुबेर और भगवान धन्वंतरि की विशेष आराधना।",
    },
    badge: { en: "Lights & Wealth", bn: "ধনলক্ষ্মী ও দীপাবলি", hi: "दीपावली" },
    glowColor: "#f59e0b",
  },
];

export function VedicFestivalsSection() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const isBn = language === "bn";
  const isHi = language === "hi";

  const t = {
    badge: isBn ? "সনাতন পঞ্জিকা ২০২৬" : isHi ? "सनातन पंचांग 2026" : "Vedic Calendar 2026",
    title: isBn
      ? "শুভ বৈদিক উৎসব ও ব্রত পঞ্জিকা"
      : isHi
      ? "प्रमुख वैदिक पर्व एवं व्रत"
      : "Auspicious Vedic Festivals & Holy Vrats",
    subtitle: isBn
      ? "শাস্ত্রীয় তিথি, ব্রতের নিয়ম ও মহোৎসবের মাহাত্ম্য সহ ২০২৬ সালের সম্পূর্ণ আধ্যাত্মিক নির্দেশিকা।"
      : isHi
      ? "शास्त्रीय तिथियां, व्रत के नियम और महापर्वों के महात्म्य सहित 2026 की संपूर्ण पंचांग सूची।"
      : "Precise Vedic lunar tithis, sacred rituals, and fasting rules for every major spiritual celebration in 2026.",
    viewAll: isBn ? "সকল উৎসব ও তিথি দেখুন" : isHi ? "सभी त्योहार देखें" : "View All Festivals",
    viewTithi: isBn ? "পূর্ণ তিথি দেখুন" : isHi ? "पूरी तिथि देखें" : "View Tithi Details",
    all: isBn ? "সকল উৎসব" : isHi ? "सभी पर्व" : "All Festivals",
    major: isBn ? "প্রধান মহোৎসব" : isHi ? "प्रमुख महापर्व" : "Major Festivals",
    vrat: isBn ? "পবিত্র ব্রত ও উপবাস" : isHi ? "पवित्र व्रत" : "Sacred Vrats",
  };

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { data: festivalData } = useQuery({
    queryKey: ["festivals", "calendar", currentYear, filter],
    queryFn: () => astrologyApi.festivals(currentYear, filter === "all" ? undefined : filter),
    staleTime: 1000 * 60 * 30,
  });

  const liveFestivals = festivalData?.festivals ?? [];
  const displayFestivals = useMemo(() => {
    if (liveFestivals.length > 0) {
      return liveFestivals.slice(0, 6).map((fest: WebFestivalItem) => ({
        id: fest.id,
        name: fest.name,
        date: fest.date_formatted || { en: fest.date, bn: fest.date, hi: fest.date },
        tithi: fest.tithi,
        category: fest.category,
        desc: fest.desc,
        badge: fest.badge,
        glowColor: fest.accent_color || "#f59e0b",
      }));
    }
    const base = filter === "all" ? HOME_FESTIVALS : HOME_FESTIVALS.filter((f) => f.category === filter);
    return base.slice(0, 6);
  }, [liveFestivals, filter]);

  return (
    <section className="relative overflow-hidden bg-transparent py-12 sm:py-16 border-b border-stone-200/80">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#c2410c]">
              <Sun className="size-3.5 text-[#e2561f]" />
              {t.badge}
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#1d1a1c]">
              {t.title}
            </h2>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#5c5156]">
              {t.subtitle}
            </p>
          </div>

          <Link
            href="/festivals"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#8b5e0a] shadow-2xs transition-all hover:bg-amber-50 hover:border-amber-300 sm:self-end"
          >
            <span>{t.viewAll}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Filter Chips matching mobile app */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: t.all },
            { id: "major", label: t.major },
            { id: "vrat", label: t.vrat },
          ].map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  active
                    ? "bg-[#f39419] text-[#1d1a1c] shadow-xs border border-[#d97b0b]"
                    : "bg-white text-[#5c5156] border border-stone-200 hover:border-amber-300 hover:bg-[#fff8f3]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3-Column Luxury Grid with Handcrafted Spiritual Vector Cliparts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayFestivals.map((fest) => {
            const name = fest.name[language] || fest.name.en;
            const date = fest.date[language] || fest.date.en;
            const tithi = fest.tithi[language] || fest.tithi.en;
            const desc = fest.desc[language] || fest.desc.en;
            const badge = fest.badge[language] || fest.badge.en;

            return (
              <div
                key={fest.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#f7d3a3]/90 bg-gradient-to-b from-white via-white to-[#fff8f3] p-5 shadow-[0_6px_20px_-10px_rgba(26,18,8,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-[0_12px_28px_-10px_rgba(245,158,11,0.22)]"
              >
                {/* Subtle festive glow orb in background */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
                  style={{ backgroundColor: fest.glowColor }}
                />

                <div>
                  {/* Top Header: Clipart + Badges */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff8f3] to-[#fbdeca] p-2 ring-1 ring-[#f4be78] shadow-xs group-hover:scale-105 transition-transform">
                      <FestivalClipart id={fest.id} className="size-full" />
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="rounded-full border border-amber-300/60 bg-[#fceade] px-2.5 py-0.5 text-[11px] font-bold text-[#8b5e0a] shadow-2xs">
                        {badge}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#8b7d63]">
                        <CalendarDays className="size-3 text-amber-600" />
                        <span>{date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title & Tithi */}
                  <h3 className="text-lg font-bold tracking-tight text-[#1d1a1c] group-hover:text-amber-900 transition-colors line-clamp-1">
                    {name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-900/80">
                    <Moon className="size-3 text-amber-600" />
                    <span>{tithi}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-[#5c5156] leading-relaxed line-clamp-3">
                    {desc}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="mt-5 pt-3 border-t border-[#fbdcc8]/80 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#8a7f83]">
                    {isBn ? "পবিত্র তিথি মহিমা" : isHi ? "पवित्र तिथि महात्म्य" : "Sacred Tithi Ritual"}
                  </span>
                  <Link
                    href="/festivals"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
                  >
                    <span>{t.viewTithi}</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
