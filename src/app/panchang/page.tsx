"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Sun,
  Moon,
  Sparkles,
  Star,
  Clock,
  ArrowRight,
  Compass,
  Eye,
  BookOpen,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";

const T = {
  en: {
    badge: "Vedic Panchang",
    title: "Daily Vedic Panchang",
    subtitle:
      "The five-limbed Vedic calendar system — know Tithi, Nakshatra, Yoga, Karana & Vara for any day to plan auspicious activities.",
    whyTitle: "Why Panchang Matters",
    whyDesc:
      "Panchang (पंचांग) literally means 'five limbs'. It is the ancient Hindu calendar and almanac that records the five key elements of cosmic time. Every auspicious activity in Vedic tradition — from weddings to business launches — is timed using Panchang data.",
    elements: [
      {
        icon: "Moon",
        name: "Tithi",
        desc: "Lunar day — one of 30 tithis in a lunar month. Determines the auspiciousness of activities.",
      },
      {
        icon: "Star",
        name: "Nakshatra",
        desc: "Lunar mansion — the Moon's position among 27 star groups. Governs personality and daily fortune.",
      },
      {
        icon: "Compass",
        name: "Yoga",
        desc: "Sun-Moon angular combination — one of 27 yogas indicating overall day quality.",
      },
      {
        icon: "Eye",
        name: "Karana",
        desc: "Half of a tithi — one of 11 karanas. Used for timing specific short-duration tasks.",
      },
      {
        icon: "CalendarDays",
        name: "Vara (Day)",
        desc: "Weekday ruled by a planet — Sunday (Sun), Monday (Moon), Tuesday (Mars), etc.",
      },
    ],
    liveTitle: "Live Panchang Data",
    liveSub:
      "Our Daily Horoscope page includes a full live Panchang section with today's Tithi, Nakshatra, Yoga, Karana, Sunrise/Sunset, Rahu Kaal, and Abhijit Muhurat — all calculated in real-time using Swiss Ephemeris.",
    liveCta: "View Today's Panchang in Daily Horoscope",
    consultTitle: "Need Personalized Guidance?",
    consultSub:
      "Consult our verified Vedic astrologers for muhurat selection, event timing, and personalized Panchang-based advice.",
    consultCta: "Talk to an Astrologer",
  },
  bn: {
    badge: "বৈদিক পঞ্জিকা",
    title: "দৈনিক বৈদিক পঞ্জিকা",
    subtitle:
      "পঞ্চাঙ্গ — পাঁচটি বৈদিক সময়ের উপাদান। যে কোনো দিনের তিথি, নক্ষত্র, যোগ, করণ ও বার জেনে শুভ কাজের পরিকল্পনা করুন।",
    whyTitle: "পঞ্জিকা কেন গুরুত্বপূর্ণ",
    whyDesc:
      "পঞ্চাঙ্গ (পঞ্জিকা) শব্দের অর্থ 'পাঁচটি অঙ্গ'। এটি প্রাচীন হিন্দু ক্যালেন্ডার যা মহাজাগতিক সময়ের পাঁচটি মূল উপাদান লিপিবদ্ধ করে। বৈদিক ঐতিহ্যে বিবাহ থেকে ব্যবসা শুরু — সবকিছু পঞ্চাঙ্গ অনুসারে নির্ধারিত হয়।",
    elements: [
      {
        icon: "Moon",
        name: "তিথি",
        desc: "চান্দ্র দিন — এক চান্দ্র মাসে ৩০টি তিথি। কাজের শুভাশুভ নির্ধারণ করে।",
      },
      {
        icon: "Star",
        name: "নক্ষত্র",
        desc: "চন্দ্রের নক্ষত্রে অবস্থান — ২৭টি নক্ষত্রের মধ্যে। ব্যক্তিত্ব ও দৈনিক ভাগ্য নিয়ন্ত্রণ করে।",
      },
      {
        icon: "Compass",
        name: "যোগ",
        desc: "সূর্য-চন্দ্রের কৌণিক সংমিশ্রণ — ২৭টি যোগের একটি। দিনের সামগ্রিক মান নির্দেশ করে।",
      },
      {
        icon: "Eye",
        name: "করণ",
        desc: "তিথির অর্ধেক — ১১টি করণের একটি। স্বল্পমেয়াদী কাজের সময় নির্ধারণে ব্যবহৃত।",
      },
      {
        icon: "CalendarDays",
        name: "বার (দিন)",
        desc: "গ্রহ শাসিত সপ্তাহের দিন — রবি (সূর্য), সোম (চন্দ্র), মঙ্গল (মঙ্গল গ্রহ) ইত্যাদি।",
      },
    ],
    liveTitle: "লাইভ পঞ্চাঙ্গ ডেটা",
    liveSub:
      "আমাদের দৈনিক রাশিফল পৃষ্ঠায় আজকের সম্পূর্ণ লাইভ পঞ্চাঙ্গ রয়েছে — তিথি, নক্ষত্র, যোগ, করণ, সূর্যোদয়/সূর্যাস্ত, রাহু কাল ও অভিজিৎ মুহূর্ত — সবকিছু সুইস এফেমেরিস দিয়ে রিয়েল-টাইমে গণনাকৃত।",
    liveCta: "দৈনিক রাশিফলে আজকের পঞ্চাঙ্গ দেখুন",
    consultTitle: "ব্যক্তিগত নির্দেশনা প্রয়োজন?",
    consultSub:
      "মুহূর্ত নির্বাচন, অনুষ্ঠানের সময় নির্ধারণ ও পঞ্চাঙ্গ-ভিত্তিক পরামর্শের জন্য আমাদের সার্টিফাইড বৈদিক জ্যোতিষীদের সাথে পরামর্শ করুন।",
    consultCta: "জ্যোতিষীর সাথে কথা বলুন",
  },
  hi: {
    badge: "वैदिक पंचांग",
    title: "दैनिक वैदिक पंचांग",
    subtitle:
      "पंचांग — पांच वैदिक समय तत्व। किसी भी दिन की तिथि, नक्षत्र, योग, करण व वार जानकर शुभ कार्यों की योजना बनाएं।",
    whyTitle: "पंचांग क्यों महत्वपूर्ण है",
    whyDesc:
      "पंचांग शब्द का अर्थ है 'पांच अंग'। यह प्राचीन हिन्दू कैलेंडर है जो ब्रह्मांडीय समय के पांच मुख्य तत्वों को दर्ज करता है। वैदिक परंपरा में विवाह से लेकर व्यापार शुरू करने तक — सब कुछ पंचांग के अनुसार तय होता है।",
    elements: [
      {
        icon: "Moon",
        name: "तिथि",
        desc: "चंद्र दिवस — एक चंद्र मास में 30 तिथियां। कार्यों की शुभता निर्धारित करती है।",
      },
      {
        icon: "Star",
        name: "नक्षत्र",
        desc: "चंद्रमा की 27 नक्षत्रों में स्थिति। व्यक्तित्व और दैनिक भाग्य को नियंत्रित करता है।",
      },
      {
        icon: "Compass",
        name: "योग",
        desc: "सूर्य-चंद्र कोणीय संयोजन — 27 योगों में से एक। दिन की समग्र गुणवत्ता दर्शाता है।",
      },
      {
        icon: "Eye",
        name: "करण",
        desc: "तिथि का आधा भाग — 11 करणों में से एक। लघु कार्यों के समय निर्धारण में उपयोगी।",
      },
      {
        icon: "CalendarDays",
        name: "वार (दिन)",
        desc: "ग्रह शासित सप्ताह का दिन — रविवार (सूर्य), सोमवार (चंद्र), मंगलवार (मंगल) आदि।",
      },
    ],
    liveTitle: "लाइव पंचांग डेटा",
    liveSub:
      "हमारे दैनिक राशिफल पृष्ठ में आज का पूर्ण लाइव पंचांग शामिल है — तिथि, नक्षत्र, योग, करण, सूर्योदय/सूर्यास्त, राहु काल और अभिजित मुहूर्त — सब कुछ स्विस एफेमेरिस से रियल-टाइम में गणित।",
    liveCta: "दैनिक राशिफल में आज का पंचांग देखें",
    consultTitle: "व्यक्तिगत मार्गदर्शन चाहिए?",
    consultSub:
      "मुहूर्त चयन, कार्यक्रम समय निर्धारण और पंचांग-आधारित सलाह के लिए हमारे प्रमाणित वैदिक ज्योतिषियों से परामर्श करें।",
    consultCta: "ज्योतिषी से बात करें",
  },
};

const ICON_MAP: Record<string, React.ElementType> = {
  Moon,
  Star,
  Compass,
  Eye,
  CalendarDays,
};

export default function PanchangPage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as
    | "en"
    | "bn"
    | "hi";
  const t = T[lang];

  return (
    <div className="min-h-screen bg-surface-muted/30 text-foreground flex flex-col font-sans pb-24">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-10 flex-1 w-full space-y-12">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1a1208]">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-[#6b5f4d] max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Why Panchang Matters */}
        <section className="rounded-[24px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-6 sm:p-8 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.1)]">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="size-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1208]">
              {t.whyTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed">{t.whyDesc}</p>
        </section>

        {/* 5 Elements of Panchang */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.elements.map((el, idx) => {
            const Icon = ICON_MAP[el.icon] || Star;
            return (
              <div
                key={idx}
                className="group rounded-[20px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-5 shadow-[0_4px_14px_-6px_rgba(26,18,8,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-10px_rgba(240,200,50,0.4)]"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffd34d] to-[#f5a300] text-white shadow-md mb-4">
                  <Icon className="size-6" />
                </div>
                <h3 className="text-base font-bold text-[#1a1208] mb-1.5">
                  {el.name}
                </h3>
                <p className="text-xs text-[#766545] leading-relaxed">
                  {el.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Panchang CTA */}
        <section className="rounded-[24px] border-2 border-amber-300 bg-gradient-to-r from-[#fffbeb] to-[#fff7d1] p-6 sm:p-8 shadow-[0_8px_24px_-10px_rgba(240,200,50,0.35)]">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="size-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1a1208]">
              {t.liveTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed mb-5">
            {t.liveSub}
          </p>
          <Link
            href="/daily-horoscope"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            {t.liveCta}
            <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Consult CTA */}
        <section className="rounded-[24px] border border-[#ece0ac] bg-white p-6 sm:p-8 shadow-[0_4px_14px_-6px_rgba(26,18,8,0.06)] text-center">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1a1208] mb-2">
            {t.consultTitle}
          </h2>
          <p className="text-sm text-[#6b5f4d] max-w-lg mx-auto mb-5">
            {t.consultSub}
          </p>
          <Link
            href="/astrologers"
            className="inline-flex items-center gap-2 rounded-full border-2 border-amber-400 bg-white px-6 py-3 text-sm font-bold text-[#8b5e0a] shadow-sm transition-all hover:bg-[#fff7d1] hover:shadow-md"
          >
            {t.consultCta}
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

