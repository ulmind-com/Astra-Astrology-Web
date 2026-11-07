"use client";

import * as React from "react";
import Link from "next/link";
import {
  Clock,
  Star,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Heart,
  Home,
  Car,
  Briefcase,
  GraduationCap,
  Gem,
  Plane,
  Baby,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";

interface MuhuratItem {
  icon: React.ElementType;
  name: Record<string, string>;
  desc: Record<string, string>;
  gradient: string;
  glow: string;
}

const MUHURATS: MuhuratItem[] = [
  {
    icon: Heart,
    name: { en: "Marriage (Vivah)", bn: "বিবাহ মুহূর্ত", hi: "विवाह मुहूर्त" },
    desc: {
      en: "Auspicious planetary alignments for wedding ceremonies to ensure lifelong harmony.",
      bn: "আজীবন সৌহার্দ্য নিশ্চিত করতে বিবাহ অনুষ্ঠানের জন্য শুভ গ্রহ সংস্থান।",
      hi: "आजीवन सामंजस्य सुनिश्चित करने के लिए विवाह संस्कार हेतु शुभ ग्रह स्थिति।",
    },
    gradient: "from-[#ff6b8b] to-[#e63950]",
    glow: "rgba(230,57,80,0.3)",
  },
  {
    icon: Home,
    name: { en: "Griha Pravesh", bn: "গৃহ প্রবেশ", hi: "गृह प्रवेश" },
    desc: {
      en: "Sacred timing for entering a new home to attract prosperity and peace.",
      bn: "সমৃদ্ধি ও শান্তি আকৃষ্ট করতে নতুন গৃহে প্রবেশের পবিত্র সময়।",
      hi: "समृद्धि और शांति आकर्षित करने हेतु नए घर में प्रवेश का शुभ समय।",
    },
    gradient: "from-[#38d39f] to-[#0f9d6e]",
    glow: "rgba(15,157,110,0.3)",
  },
  {
    icon: Car,
    name: { en: "Vehicle Purchase", bn: "গাড়ি কেনা", hi: "वाहन खरीद" },
    desc: {
      en: "Best times to purchase and first-drive a new vehicle for safety and longevity.",
      bn: "নিরাপত্তা ও দীর্ঘায়ুর জন্য নতুন গাড়ি কেনা ও প্রথম চালানোর সেরা সময়।",
      hi: "सुरक्षा और दीर्घायु के लिए नया वाहन खरीदने और पहली सवारी का सर्वोत्तम समय।",
    },
    gradient: "from-[#6fb1ff] to-[#2b6fe0]",
    glow: "rgba(43,111,224,0.3)",
  },
  {
    icon: Briefcase,
    name: { en: "Business Start (Vyapar)", bn: "ব্যবসা শুরু", hi: "व्यापार आरम्भ" },
    desc: {
      en: "Optimal muhurat for launching businesses, signing contracts, and new ventures.",
      bn: "ব্যবসা শুরু, চুক্তি স্বাক্ষর ও নতুন উদ্যোগের জন্য সর্বোত্তম মুহূর্ত।",
      hi: "व्यापार शुरू करने, अनुबंध हस्ताक्षर और नए उद्यम के लिए सर्वोत्तम मुहूर्त।",
    },
    gradient: "from-[#ffd34d] to-[#f5a300]",
    glow: "rgba(245,163,0,0.3)",
  },
  {
    icon: GraduationCap,
    name: { en: "Education Start (Vidya Arambh)", bn: "বিদ্যা আরম্ভ", hi: "विद्या आरम्भ" },
    desc: {
      en: "Auspicious time to begin education, join a new school, or start learning a skill.",
      bn: "শিক্ষা শুরু, নতুন স্কুলে ভর্তি বা দক্ষতা শেখার শুভ সময়।",
      hi: "शिक्षा आरम्भ, नए विद्यालय में प्रवेश या कौशल सीखने का शुभ समय।",
    },
    gradient: "from-[#8b7bff] to-[#5a3ff2]",
    glow: "rgba(90,63,242,0.3)",
  },
  {
    icon: Gem,
    name: { en: "Gold & Jewellery Purchase", bn: "সোনা কেনা", hi: "स्वर्ण खरीद" },
    desc: {
      en: "Best timings for buying gold, silver, and precious stones for maximum benefit.",
      bn: "সর্বাধিক লাভের জন্য সোনা, রূপা ও মূল্যবান পাথর কেনার সেরা সময়।",
      hi: "अधिकतम लाभ के लिए सोना, चांदी और रत्न खरीदने का सर्वोत्तम समय।",
    },
    gradient: "from-[#ffb347] to-[#ff8a00]",
    glow: "rgba(255,138,0,0.3)",
  },
  {
    icon: Plane,
    name: { en: "Travel (Yatra)", bn: "যাত্রা", hi: "यात्रा" },
    desc: {
      en: "Safe and auspicious travel timings based on Disha Shoola and planetary positions.",
      bn: "দিশাশূল ও গ্রহ অবস্থান অনুসারে নিরাপদ ও শুভ যাত্রার সময়।",
      hi: "दिशा शूल और ग्रह स्थिति के अनुसार सुरक्षित और शुभ यात्रा का समय।",
    },
    gradient: "from-[#c08bff] to-[#8b2fe0]",
    glow: "rgba(139,47,224,0.3)",
  },
  {
    icon: Baby,
    name: { en: "Naming Ceremony (Namakaran)", bn: "নামকরণ", hi: "नामकरण" },
    desc: {
      en: "Vedic-approved timings for naming a newborn based on Nakshatra and planetary ruler.",
      bn: "নক্ষত্র ও গ্রহ অধিপতি অনুসারে নবজাতকের নামকরণের বৈদিক-অনুমোদিত সময়।",
      hi: "नक्षत्र और ग्रह स्वामी के अनुसार नवजात के नामकरण का वैदिक-अनुमोदित समय।",
    },
    gradient: "from-[#ff8fb0] to-[#ff4f8b]",
    glow: "rgba(255,79,139,0.3)",
  },
];

const T = {
  en: {
    badge: "Vedic Muhurat",
    title: "Shubh Muhurat",
    subtitle:
      "Auspicious timings for life's most important events — calculated using classical Vedic astrology principles.",
    typesTitle: "Types of Muhurats",
    scienceTitle: "The Science Behind Muhurat",
    scienceDesc:
      "Muhurat (मुहूर्त) is the Vedic science of selecting the most auspicious time for important activities. It considers the positions of the Moon, Sun, and planets, along with Tithi, Nakshatra, Yoga, Karana, and the ascendant (Lagna) to determine windows of time where cosmic energies are most supportive of success. A properly selected Muhurat removes obstacles and brings divine blessings to any endeavour.",
    liveTitle: "Hora & Choghadiya Available Now",
    liveSub:
      "Our Daily Horoscope page features a complete 24-hour Planetary Hora timeline and 16 Vedic Choghadiya muhurats — calculated from your local sunrise and sunset. Use them for day-to-day muhurat decisions.",
    liveCta: "View Today's Hora & Choghadiya",
    consultTitle: "Need a Personalised Muhurat?",
    consultSub:
      "For weddings, Griha Pravesh, business launches, and other major events — consult our verified Vedic astrologers for a personalised Muhurat based on your birth chart.",
    consultCta: "Consult an Astrologer",
  },
  bn: {
    badge: "বৈদিক মুহূর্ত",
    title: "শুভ মুহূর্ত",
    subtitle:
      "জীবনের সবচেয়ে গুরুত্বপূর্ণ ঘটনাগুলোর জন্য শুভ সময় — ক্লাসিক্যাল বৈদিক জ্যোতিষ নীতি অনুসারে গণনাকৃত।",
    typesTitle: "মুহূর্তের প্রকারভেদ",
    scienceTitle: "মুহূর্তের পেছনের বিজ্ঞান",
    scienceDesc:
      "মুহূর্ত হলো গুরুত্বপূর্ণ কাজের জন্য সবচেয়ে শুভ সময় নির্বাচনের বৈদিক বিজ্ঞান। এটি চন্দ্র, সূর্য ও গ্রহের অবস্থান এবং তিথি, নক্ষত্র, যোগ, করণ ও লগ্ন বিবেচনা করে এমন সময়কাল নির্ধারণ করে যখন মহাজাগতিক শক্তি সাফল্যের জন্য সবচেয়ে সহায়ক। সঠিকভাবে নির্বাচিত মুহূর্ত বাধা দূর করে এবং যে কোনো কাজে দৈবিক আশীর্বাদ আনে।",
    liveTitle: "হোরা ও চৌঘড়িয়া এখনই উপলব্ধ",
    liveSub:
      "আমাদের দৈনিক রাশিফল পৃষ্ঠায় সম্পূর্ণ ২৪ ঘণ্টার গ্রহ হোরা টাইমলাইন এবং ১৬টি বৈদিক চৌঘড়িয়া মুহূর্ত রয়েছে — আপনার স্থানীয় সূর্যোদয় ও সূর্যাস্ত থেকে গণনাকৃত।",
    liveCta: "আজকের হোরা ও চৌঘড়িয়া দেখুন",
    consultTitle: "ব্যক্তিগত মুহূর্ত প্রয়োজন?",
    consultSub:
      "বিবাহ, গৃহ প্রবেশ, ব্যবসা শুরু এবং অন্যান্য বড় অনুষ্ঠানের জন্য — আপনার জন্ম কুষ্ঠি অনুসারে ব্যক্তিগত মুহূর্ত নির্ধারণে আমাদের সার্টিফাইড বৈদিক জ্যোতিষীদের সাথে পরামর্শ করুন।",
    consultCta: "জ্যোতিষীর সাথে পরামর্শ করুন",
  },
  hi: {
    badge: "वैदिक मुहूर्त",
    title: "शुभ मुहूर्त",
    subtitle:
      "जीवन की सबसे महत्वपूर्ण घटनाओं के लिए शुभ समय — शास्त्रीय वैदिक ज्योतिष सिद्धांतों के अनुसार गणित।",
    typesTitle: "मुहूर्त के प्रकार",
    scienceTitle: "मुहूर्त के पीछे का विज्ञान",
    scienceDesc:
      "मुहूर्त महत्वपूर्ण कार्यों के लिए सबसे शुभ समय चुनने का वैदिक विज्ञान है। यह चंद्रमा, सूर्य और ग्रहों की स्थिति, तिथि, नक्षत्र, योग, करण और लग्न को ध्यान में रखते हुए ऐसे समय की खिड़कियां निर्धारित करता है जब ब्रह्मांडीय ऊर्जाएं सफलता के लिए सबसे अनुकूल हों। सही ढंग से चयनित मुहूर्त बाधाओं को दूर करता है और किसी भी कार्य में दिव्य आशीर्वाद लाता है।",
    liveTitle: "होरा व चौघड़िया अभी उपलब्ध",
    liveSub:
      "हमारे दैनिक राशिफल पृष्ठ में 24 घंटे की ग्रह होरा टाइमलाइन और 16 वैदिक चौघड़िया मुहूर्त उपलब्ध हैं — आपके स्थानीय सूर्योदय और सूर्यास्त से गणित।",
    liveCta: "आज की होरा व चौघड़िया देखें",
    consultTitle: "व्यक्तिगत मुहूर्त चाहिए?",
    consultSub:
      "विवाह, गृह प्रवेश, व्यापार शुभारंभ और अन्य बड़े आयोजनों के लिए — अपनी जन्म कुंडली के अनुसार व्यक्तिगत मुहूर्त के लिए हमारे प्रमाणित वैदिक ज्योतिषियों से परामर्श करें।",
    consultCta: "ज्योतिषी से परामर्श करें",
  },
};

export default function MuhuratPage() {
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
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/90 text-emerald-950 border border-emerald-300 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <Clock className="size-3.5 text-emerald-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1a1208]">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-[#6b5f4d] max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Muhurat Types Grid */}
        <section>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1208] text-center mb-6">
            {t.typesTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MUHURATS.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="group rounded-[20px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-5 shadow-[0_4px_14px_-6px_rgba(26,18,8,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-10px_rgba(240,200,50,0.4)]"
                >
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.gradient} text-white shadow-md mb-4 transition-transform duration-300 group-hover:scale-105`}
                    style={{ boxShadow: `0 6px 14px -4px ${m.glow}` }}
                  >
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#1a1208] mb-1.5">
                    {m.name[lang]}
                  </h3>
                  <p className="text-[11.5px] text-[#766545] leading-relaxed">
                    {m.desc[lang]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Science Section */}
        <section className="rounded-[24px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-6 sm:p-8 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.1)]">
          <div className="flex items-center gap-2 mb-3">
            <Star className="size-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1208]">
              {t.scienceTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed">
            {t.scienceDesc}
          </p>
        </section>

        {/* Hora & Choghadiya CTA */}
        <section className="rounded-[24px] border-2 border-amber-300 bg-gradient-to-r from-[#fffbeb] to-[#fff7d1] p-6 sm:p-8 shadow-[0_8px_24px_-10px_rgba(240,200,50,0.35)]">
          <div className="flex items-center gap-2 mb-3">
            <CalendarDays className="size-5 text-amber-600" />
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

