"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookOpen,
  HeartHandshake,
  Heart,
  Orbit,
  CalendarDays,
  Sparkles,
  Hash,
  Compass,
  Leaf,
  Star,
  Flame,
  Hand,
  Clock,
  ScanFace,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";

interface ToolItem {
  id: string;
  category: "core" | "daily" | "divine" | "remedies";
  title: { en: string; bn: string; hi: string };
  subtitle: { en: string; bn: string; hi: string };
  href: string;
  badge?: string;
  icon: React.ElementType;
  gradient: string;
  borderHover: string;
}

const TOOLS_CATALOG: ToolItem[] = [
  {
    id: "kundli",
    category: "core",
    title: { en: "Free Janam Kundli", bn: "ফ্রি জন্ম কুন্ডলী", hi: "निःशुल्क जन्म कुंडली" },
    subtitle: {
      en: "Detailed Lagna (D1), Navamsha (D9) birth chart & planetary positions in 60 sec",
      bn: "লগ্ন ও নবমাংশ ছক, গ্রহের অবস্থান এবং বিস্তারিত দোষ বিশ্লেষণ",
      hi: "विस्तृत लग्न, नवमांश चक्र और ग्रह स्थिति विश्लेषण",
    },
    href: "/kundli",
    badge: "100% Free",
    icon: BookOpen,
    gradient: "from-amber-500/10 to-orange-500/10 text-amber-700",
    borderHover: "hover:border-amber-400 hover:shadow-amber-500/10",
  },
  {
    id: "kundli-matching",
    category: "core",
    title: { en: "Kundli Matching (36 Gunas)", bn: "যোটক বিচার ও ৩৬ গুণ মিলন", hi: "कुंडली मिलान (३६ गुण)" },
    subtitle: {
      en: "Ashtakoot Milan compatibility score, Manglik Dosha report & marital harmony",
      bn: "বিবাহের অষ্টকূট বিচার, মাঙ্গলিক দোষ ও দাম্পত্য সুখের সার্বিক বিশ্লেষণ",
      hi: "अष्टकूट मिलान, मांगलिक विचार व वैवाहिक अनुकूलता",
    },
    href: "/kundli-matching",
    badge: "Popular",
    icon: HeartHandshake,
    gradient: "from-rose-500/10 to-pink-500/10 text-rose-700",
    borderHover: "hover:border-rose-400 hover:shadow-rose-500/10",
  },
  {
    id: "daily-horoscope",
    category: "daily",
    title: { en: "Daily Horoscope", bn: "দৈনিক রাশিফল", hi: "दैनिक राशिफल" },
    subtitle: {
      en: "Daily personalized transit forecast, lucky color, number & life meters for all 12 signs",
      bn: "১২ রাশির আজকের গ্রহের প্রভাব, শুভ রং, শুভ সংখ্যা এবং প্রেম ও কর্মের মাত্রা",
      hi: "सभी १२ राशियों का दैनिक फलादेश, शुभ रंग एवं अंक",
    },
    href: "/daily-horoscope",
    badge: "Daily",
    icon: Sun,
    gradient: "from-yellow-500/10 to-amber-500/10 text-amber-600",
    borderHover: "hover:border-amber-400 hover:shadow-amber-500/10",
  },
  {
    id: "panchang",
    category: "daily",
    title: { en: "Vedic Daily Panchang", bn: "দৈনিক বৈদিক পঞ্জিকা ও পঞ্চাঙ্গ", hi: "दैनिक वैदिक पंचांग" },
    subtitle: {
      en: "Swiss Ephemeris authentic Tithi, Nakshatra, Yoga, Karana, Vara, Panchak & 24 Horas",
      bn: "সুইস এফিমেরিস ভিত্তিক তিথি, নক্ষত্র, যোগ, করণ, পঞ্চক দোষ, শুভ মুহূর্ত ও হোরা",
      hi: "प्रामाणिक तिथि, नक्षत्र, योग, करण, पंचक व चौघड़िया मुहूर्त",
    },
    href: "/panchang",
    badge: "Vedic Precision",
    icon: CalendarDays,
    gradient: "from-teal-500/10 to-emerald-500/10 text-teal-700",
    borderHover: "hover:border-teal-400 hover:shadow-teal-500/10",
  },
  {
    id: "festivals",
    category: "daily",
    title: { en: "Festivals & Vrat (2025–2029)", bn: "সনাতন উৎসব ও ব্রত পঞ্জিকা", hi: "सनातन व्रत व त्यौहार" },
    subtitle: {
      en: "Multi-year authentic Hindu almanac, tithi muhurat, rituals & spiritual spotlight",
      bn: "২০২৫-২০২৯ হিন্দু উৎসব বর্ষপঞ্জি, পূজা ও ব্রতের শুভ তিথি ও তাৎপর্য",
      hi: "२०२५-२०२९ के सभी प्रमुख व्रत, त्यौहार व वैदिक तिथियां",
    },
    href: "/festivals",
    badge: "2025-2029",
    icon: Flame,
    gradient: "from-pink-500/10 to-rose-500/10 text-pink-700",
    borderHover: "hover:border-pink-400 hover:shadow-pink-500/10",
  },
  {
    id: "muhurat",
    category: "daily",
    title: { en: "Subh Muhurat Guide", bn: "শুভ মুহূর্ত নির্ণয়", hi: "शुभ मुहूर्त" },
    subtitle: {
      en: "Auspicious timing for marriage, Griha Pravesh, vehicle purchase & new business ventures",
      bn: "বিবাহ, গৃহপ্রবেশ, নতুন বাহন ক্রয় ও ব্যবসায়িক উদ্যোগের প্রশস্ত লগ্ন",
      hi: "विवाह, गृह प्रवेश, वाहन क्रय एवं व्यापार आरंभ के शुभ मुहूर्त",
    },
    href: "/muhurat",
    badge: "Auspicious",
    icon: Clock,
    gradient: "from-emerald-500/10 to-teal-500/10 text-emerald-700",
    borderHover: "hover:border-emerald-400 hover:shadow-emerald-500/10",
  },
  {
    id: "tarot",
    category: "divine",
    title: { en: "78 Arcana Tarot Reading", bn: "ট্যারো কার্ড রিডিং", hi: "टैरो कार्ड रीडिंग" },
    subtitle: {
      en: "Major and Minor Arcana divine spreads for love, decision clarity and personal breakthroughs",
      bn: "প্রেম, মানসিক স্পষ্টতা ও ক্যারিয়ারের জন্য দৈব ট্যারো নির্দেশনা",
      hi: "प्रेम, करियर और जीवन की दिशा के लिए टैरो मार्गदर्शन",
    },
    href: "/tarot",
    badge: "Instant",
    icon: Sparkles,
    gradient: "from-purple-500/10 to-indigo-500/10 text-purple-700",
    borderHover: "hover:border-purple-400 hover:shadow-purple-500/10",
  },
  {
    id: "numerology",
    category: "core",
    title: { en: "Vedic & Chaldean Numerology", bn: "নিউমারোলজি ও সংখ্যাতত্ত্ব", hi: "अंकशास्त्र (न्यूमरोलॉजी)" },
    subtitle: {
      en: "Calculate your Mulank, Bhagyank, Life Path number, name harmony & lucky years",
      bn: "আপনার মূলাঙ্ক, ভাগ্যাঙ্ক, নামের শুভ কম্পন এবং শুভ বর্ষ নির্ণয়",
      hi: "मूलांक, भाग्यांक, नामांक एवं भाग्यशाली वर्षों का विश्लेषण",
    },
    href: "/numerology",
    badge: "Numbers",
    icon: Hash,
    gradient: "from-orange-500/10 to-amber-500/10 text-orange-700",
    borderHover: "hover:border-orange-400 hover:shadow-orange-500/10",
  },
  {
    id: "rashi-calculator",
    category: "core",
    title: { en: "Moon Sign (Rashi) Calculator", bn: "চন্দ্র রাশি ক্যালকুলেটর", hi: "चंद्र राशि कैलकुलेटर" },
    subtitle: {
      en: "Determine your exact Vedic Moon Sign (Chandra Rashi), ruling graha & personality matrix",
      bn: "আপনার সঠিক জন্ম চন্দ্র রাশি, অধিপতি গ্রহ ও স্বভাব বিচার",
      hi: "अपनी सटीक जन्म चंद्र राशि, स्वामी ग्रह एवं स्वभाव जानें",
    },
    href: "/rashi-calculator",
    badge: "Chandra",
    icon: Star,
    gradient: "from-indigo-500/10 to-blue-500/10 text-indigo-700",
    borderHover: "hover:border-indigo-400 hover:shadow-indigo-500/10",
  },
  {
    id: "dasha-calculator",
    category: "core",
    title: { en: "Vimshottari Dasha Timeline", bn: "বিংশোত্তরী দশা টাইমলাইন", hi: "विंशोत्तरी महादशा" },
    subtitle: {
      en: "120-year planetary Mahadasha, Antardasha & Pratyantar dasha cycle roadmap",
      bn: "১২০ বছরের মহাদশা, অন্তর্দশা ও প্রত্যন্তর্দশার নির্ভুল মহাজাগতিক কালরেখা",
      hi: "१२० वर्षीय महादशा, अंतर्दशा एवं प्रत्यंतर दशा समयरेखा",
    },
    href: "/dasha-calculator",
    badge: "120 Years",
    icon: Orbit,
    gradient: "from-blue-500/10 to-cyan-500/10 text-blue-700",
    borderHover: "hover:border-blue-400 hover:shadow-blue-500/10",
  },
  {
    id: "palm-reading",
    category: "divine",
    title: { en: "3D AI Palm Reading", bn: "৩ডি এআই হস্তরেখা বিচার", hi: "३डी एआई हस्तरेखा" },
    subtitle: {
      en: "3D real-time hand scan for Heart, Head, Life and Fate lines with planetary mount analysis",
      bn: "হাতের প্রধান রেখাসমূহ এবং গ্রহপর্বত বিচার আধুনিক এআই থ্রিডি ক্যামেরার মাধ্যমে",
      hi: "हस्तरेखा एवं पर्वतों का ३डी एआई कैमरा परीक्षण",
    },
    href: "/palm-reading",
    badge: "3D AI",
    icon: Hand,
    gradient: "from-violet-500/10 to-purple-500/10 text-violet-700",
    borderHover: "hover:border-violet-400 hover:shadow-violet-500/10",
  },
  {
    id: "face-reading",
    category: "divine",
    title: { en: "AI Face Reading (Samudrika)", bn: "এআই মুখাবয়ব পাঠ (সামুদ্রিক শাস্ত্র)", hi: "सामुद्रिक मुख परीक्षण" },
    subtitle: {
      en: "Ancient Samudrika Shastra facial geometry analysis for fortune, career and destiny",
      bn: "মুখের গঠন, চোখ, কপাল ও বৈশিষ্ট্যের আলোকে ভবিষ্যৎ ও চরিত্র বিচার",
      hi: "सामुद्रिक शास्त्र आधारित मुखाकृति एवं भाग्य परीक्षण",
    },
    href: "/face-reading",
    badge: "AI Vision",
    icon: ScanFace,
    gradient: "from-cyan-500/10 to-blue-500/10 text-cyan-700",
    borderHover: "hover:border-cyan-400 hover:shadow-cyan-500/10",
  },
  {
    id: "vastu",
    category: "remedies",
    title: { en: "16-Zone Vastu Shastra Guide", bn: "১৬-জোন বাস্তু শাস্ত্র ও প্রতিকার", hi: "१६-ज़ोन वास्तु शास्त्र" },
    subtitle: {
      en: "Directional energy audit, Pancha Tattva balance and non-demolition remedies for home & office",
      bn: "গৃহ ও অফিসের ১৬টি দিক, পঞ্চতত্ত্ব সমন্বয় ও সহজ প্রতিকার",
      hi: "दिशा संतुलन, पंचतत्व सामंजस्य एवं सरल वास्तु उपाय",
    },
    href: "/vastu",
    badge: "16 Zones",
    icon: Compass,
    gradient: "from-green-500/10 to-emerald-500/10 text-green-700",
    borderHover: "hover:border-green-400 hover:shadow-green-500/10",
  },
  {
    id: "ai-astrologer",
    category: "divine",
    title: { en: "24/7 Sacred AI Astrologer", bn: "২৪/৭ বৈদিক এআই জ্যোতিষী", hi: "२४/७ वैदिक एआई ज्योतिषी" },
    subtitle: {
      en: "Instant answers on love, career and health trained on Brihat Parashara Hora Shastra",
      bn: "বৃহৎপরাশরের বৈদিক নিয়মে প্রশিক্ষিত চব্বিশ ঘণ্টা এআই জ্যোতিষীয় সমাধান",
      hi: "प्राचीन वैदिक ग्रंथों पर आधारित चौबीसों घंटे तत्काल समाधान",
    },
    href: "/ai-astrologer",
    badge: "Always Online",
    icon: Sparkles,
    gradient: "from-amber-500/10 to-yellow-500/10 text-amber-700",
    borderHover: "hover:border-amber-400 hover:shadow-amber-500/10",
  },
];

export default function FreeReadingsPage() {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = React.useState<
    "all" | "core" | "daily" | "divine" | "remedies"
  >("all");

  const filteredTools = React.useMemo(() => {
    if (selectedCategory === "all") return TOOLS_CATALOG;
    return TOOLS_CATALOG.filter((t) => t.category === selectedCategory);
  }, [selectedCategory]);

  const langKey = (["en", "bn", "hi"].includes(language) ? language : "en") as
    | "en"
    | "bn"
    | "hi";

  return (
    <div className="min-h-screen bg-[#fff8f3] text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 w-full pb-24">
        {/* Luxury Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF9EE] via-[#fff8f3] to-white border-b border-stone-200/80 py-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-200/40 via-orange-100/20 to-transparent blur-3xl opacity-70" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-50/80 px-4 py-1 text-xs font-bold text-amber-900 shadow-2xs mb-4">
              <Sparkles className="size-3.5 text-amber-600" />
              <span>
                {language === "bn"
                  ? "১০০% নিখরচায় প্রামাণ্য বৈদিক টুলস"
                  : language === "hi"
                  ? "१००% निःशुल्क प्रामाणिक वैदिक उपकरण"
                  : "100% Free Authentic Vedic Toolkit"}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#1d1a1c] tracking-tight max-w-3xl mx-auto">
              {language === "bn"
                ? "ফ্রি বৈদিক জ্যোতিষ ও ভাগ্যফল কেন্দ্র"
                : language === "hi"
                ? "निःशुल्क वैदिक ज्योतिष एवं फलादेश केंद्र"
                : "Free Vedic Astrology Readings & Calculators"}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
              {language === "bn"
                ? "সুইস এফিমেরিস দ্বারা চালিত জন্মকুন্ডলী, যোটক বিচার, দৈনিক পঞ্জিকা, শুভ মুহূর্ত ও সংখ্যাতত্ত্বের পূর্ণাঙ্গ সম্ভার।"
                : language === "hi"
                ? "स्विस एफिमेरिस द्वारा संचालित जन्म कुंडली, मिलान, दैनिक पंचांग, मुहूर्त एवं अंकशास्त्र का संपूर्ण संग्रह।"
                : "Explore authentic traditional Vedic charts, planetary transits, matchmaking, panchang and biometric readings powered by Swiss Ephemeris."}
            </p>

            {/* Category Filter Pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {[
                { id: "all", label: language === "bn" ? "সকল টুলস" : language === "hi" ? "सभी उपकरण" : "All Tools" },
                { id: "core", label: language === "bn" ? "কুন্ডলী ও গণনা" : language === "hi" ? "कुंडली व गणना" : "Kundli & Core" },
                { id: "daily", label: language === "bn" ? "দৈনিক পঞ্জিকা ও সময়" : language === "hi" ? "दैनिक पंचांग व समय" : "Daily & Transits" },
                { id: "divine", label: language === "bn" ? "ট্যারো ও এআই" : language === "hi" ? "टैरो व एआई" : "Tarot & AI" },
                { id: "remedies", label: language === "bn" ? "বাস্তু ও প্রতিকার" : language === "hi" ? "वास्तु व उपाय" : "Vastu & Remedies" },
              ].map((c) => {
                const active = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id as any)}
                    className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm"
                        : "border border-stone-200 bg-white text-stone-700 hover:border-amber-300 hover:text-amber-800 shadow-2xs"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tools Catalog Grid */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-stone-200/90 bg-white p-6 shadow-[0_6px_20px_-10px_rgba(26,18,8,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${tool.borderHover}`}
                >
                  <div>
                    {/* Top Row: Icon tile + Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-2xs transition-transform duration-300 group-hover:scale-105`}
                      >
                        <Icon className="size-7" />
                      </div>

                      {tool.badge && (
                        <span className="rounded-full border border-amber-300/60 bg-[#fceade] px-2.5 py-0.5 text-[11px] font-bold text-[#8b5e0a] shadow-2xs">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                      {tool.title[langKey] || tool.title.en}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                      {tool.subtitle[langKey] || tool.subtitle.en}
                    </p>
                  </div>

                  {/* Footer link */}
                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:text-amber-900">
                    <span>
                      {language === "bn"
                        ? "গণনা শুরু করুন"
                        : language === "hi"
                        ? "अभी शुरू करें"
                        : "Launch Tool"}
                    </span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Trust Banner at bottom */}
          <div className="mt-14 rounded-3xl border border-amber-200/90 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/50 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-stone-900">
                  {language === "bn"
                    ? "সুইস এফিমেরিস ও বৈদিক শাস্ত্রের বিশুদ্ধ হিসাব"
                    : language === "hi"
                    ? "स्विस एफिमेरिस एवं वैदिक शास्त्रों की शुद्ध गणना"
                    : "Swiss Ephemeris & Pure Vedic Precision"}
                </h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  {language === "bn"
                    ? "সমস্ত গ্রহের ডিগ্রি, তিথি ও নক্ষত্র আন্তর্জাতিক মান অনুযায়ী সেকেন্ডের নির্ভুলতায় নির্ণীত।"
                    : "Every planetary position, tithi and nakshatra is computed with sub-arcsecond accuracy."}
                </p>
              </div>
            </div>

            <Link
              href="/astrologers"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-stone-950 shadow-sm transition-transform hover:scale-105"
            >
              <span>
                {language === "bn"
                  ? "বিশেষজ্ঞ জ্যোতিষীর পরামর্শ নিন"
                  : language === "hi"
                  ? "ज्योतिषी से परामर्श लें"
                  : "Talk to Astrologer"}
              </span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
