"use client";

import * as React from "react";
import Link from "next/link";
import {
  Flame,
  ShoppingBag,
  Scroll,
  CalendarDays,
  Clock,
  PartyPopper,
  GraduationCap,
  Bot,
  Sparkles,
  Sun,
  Orbit,
  Heart,
  Hand,
  ScanFace,
  Hash,
  Home,
  Hourglass,
  Moon,
  Gem,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export interface AstroToolItem {
  key: string;
  title: Record<string, string>;
  short: Record<string, string>;
  desc: Record<string, string>;
  icon: LucideIcon;
  route: string;
  badge?: Record<string, string>;
}

export const HOME_TOOL_RAIL: AstroToolItem[] = [
  {
    key: "purohits",
    title: { en: "Vedic Purohits", bn: "অনলাইন পূজা ও হোমহোম", hi: "वैदिक पुरोहित व पूजा" },
    short: { en: "Live Puja", bn: "লাইভ পূজা", hi: "लाइव पूजा" },
    desc: { en: "Book Vedic Pandits & live online havans", bn: "বৈদিক পুরোহিত বুকিং", hi: "पंडित जी बुकिंग" },
    icon: Flame,
    route: "/purohits",
    badge: { en: "LIVE", bn: "লাইভ", hi: "लाइव" },
  },
  {
    key: "annual_horoscope",
    title: { en: "Annual Lal Kitab", bn: "বার্ষিক বর্ষফল ২০২৬", hi: "वार्षिक वर्षफल 2026" },
    short: { en: "Varshphal", bn: "বর্ষফল", hi: "वर्षफल" },
    desc: { en: "1-year prediction & Lal Kitab Mahaupay", bn: "১ বছরের সোলার রিটার্ন মহাউপায়", hi: "1-वर्षीय लाल किताब महा-उपाय" },
    icon: Scroll,
    route: "/annual-horoscope",
    badge: { en: "HOT", bn: "সেরা", hi: "खास" },
  },
  {
    key: "panchang",
    title: { en: "Vedic Panchang", bn: "দৈনিক পঞ্জিকা", hi: "दैनिक पंचांग" },
    short: { en: "Panchang", bn: "পঞ্জিকা", hi: "पंचांग" },
    desc: { en: "Tithi, Nakshatra, Horas & Choghadiya", bn: "তিথি, নক্ষত্র ও সূর্যোদয়", hi: "तिथि, नक्षत्र व चौघड़िया" },
    icon: CalendarDays,
    route: "/panchang",
  },
  {
    key: "muhurat",
    title: { en: "Shubh Muhurat", bn: "শুভ মুহূর্ত ও কাল", hi: "शुभ मुहूर्त" },
    short: { en: "Muhurat", bn: "মুহূর্ত", hi: "मुहूर्त" },
    desc: { en: "Vivah, Griha Pravesh & auspicious timings", bn: "বিবাহ, গৃহপ্রবেশ ও যাত্রা", hi: "विवाह व गृह प्रवेश" },
    icon: Clock,
    route: "/muhurat",
  },
  {
    key: "festivals",
    title: { en: "Festivals 2026", bn: "উৎসব ও ব্রত পঞ্জিকা", hi: "त्योहार व व्रत" },
    short: { en: "Festivals", bn: "উৎসব", hi: "त्योहार" },
    desc: { en: "Sanatan calendar, holy vrats & tithis", bn: "সনাতন ধর্মীয় উৎসব ও ব্রত", hi: "सनातन पर्व व व्रत तिथियां" },
    icon: PartyPopper,
    route: "/festivals",
  },
  {
    key: "courses",
    title: { en: "Gurukul Courses", bn: "গুরুকুল শিক্ষা", hi: "गुरुकुल विद्या" },
    short: { en: "Gurukul", bn: "গুরুকুল", hi: "गुरुकुल" },
    desc: { en: "Sacred occult wisdom & masterclasses", bn: "জ্যোতিষ ও সনাতন শাস্ত্র পাঠ", hi: "प्रमाणित ज्योतिष पाठ्यक्रम" },
    icon: GraduationCap,
    route: "/courses",
  },
  {
    key: "ai_astrologer",
    title: { en: "AI Astrologer", bn: "এআই জ্যোতিষী", hi: "एआई ज्योतिषी" },
    short: { en: "AI Guru", bn: "এআই গুরু", hi: "एआई गुरु" },
    desc: { en: "24/7 Vedic RAG & Swiss Ephemeris", bn: "তাৎক্ষণিক শাস্ত্রীয় গণনা", hi: "24/7 वैदिक विश्लेषण" },
    icon: Bot,
    route: "/ai-astrologer",
    badge: { en: "AI", bn: "এআই", hi: "एआई" },
  },
  {
    key: "tarot",
    title: { en: "Tarot Reading", bn: "ট্যারো রিডিং", hi: "टैरो कार्ड" },
    short: { en: "Tarot", bn: "ট্যারো", hi: "टैरो" },
    desc: { en: "78-card chrono-astrology oracle", bn: "রহস্যময় ট্যারো নির্দেশনা", hi: "मार्गदर्शक कार्ड वाचन" },
    icon: Sparkles,
    route: "/tarot",
  },
  {
    key: "horoscope",
    title: { en: "Daily Horoscope", bn: "দৈনিক রাশিফল", hi: "दैनिक राशिफल" },
    short: { en: "Horoscope", bn: "রাশিফল", hi: "राशिफल" },
    desc: { en: "Today's moon transit & panchang", bn: "আজকের গ্রহের প্রভাব", hi: "आज का चंद्र गोचर" },
    icon: Sun,
    route: "/daily-horoscope",
  },
  {
    key: "kundli",
    title: { en: "Kundli", bn: "জন্মকুণ্ডলী", hi: "जन्म कुंडली" },
    short: { en: "Kundli", bn: "কুণ্ডলী", hi: "कुंडली" },
    desc: { en: "Full birth chart & planets", bn: "সম্পূর্ণ লগ্ন ও গ্রহ অবস্থান", hi: "ग्रह भाव व लग्न चार्ट" },
    icon: Orbit,
    route: "/kundli",
  },
  {
    key: "matching",
    title: { en: "Kundli Matching", bn: "যোটক বিচার", hi: "कुंडली मिलान" },
    short: { en: "Matching", bn: "যোটক", hi: "मिलान" },
    desc: { en: "Guna milan compatibility", bn: "৩৬ অষ্টকূট গুণ মিলন", hi: "अष्टकूट गुण मिलान" },
    icon: Heart,
    route: "/kundli-matching",
  },
  {
    key: "shop",
    title: { en: "AstroStore", bn: "পবিত্র স্টোর", hi: "एस्ट्रो स्टोर" },
    short: { en: "AstroStore", bn: "স্টোর", hi: "स्टोर" },
    desc: { en: "Consecrated Rudraksha & Gemstones", bn: "সিদ্ধ রুদ্রাক্ষ ও রত্ন", hi: "अभिमंत्रित रुद्राक्ष" },
    icon: ShoppingBag,
    route: "/shop",
  },
  {
    key: "palm",
    title: { en: "Palm Reading", bn: "হস্তরেখা বিচার", hi: "हस्तरेखा" },
    short: { en: "Palm", bn: "হস্তরেখা", hi: "हस्तरेखा" },
    desc: { en: "Lines & mounts decoded", bn: "করতল রেখা বিশ্লেষণ", hi: "हथेली रेखाएं" },
    icon: Hand,
    route: "/palm-reading",
  },
  {
    key: "face",
    title: { en: "Face Reading", bn: "মুখাবয়ব বিচার", hi: "समुद्रिक शास्त्र" },
    short: { en: "Face", bn: "সমুদ্রিক", hi: "फेस" },
    desc: { en: "AI samudrika reading", bn: "সমুদ্রিক লক্ষণ শাস্ত্র", hi: "चेहरा पठन" },
    icon: ScanFace,
    route: "/face-reading",
  },
  {
    key: "numerology",
    title: { en: "Numerology", bn: "সংখ্যা জ্যোতিষ", hi: "अंक ज्योतिष" },
    short: { en: "Numerology", bn: "সংখ্যাতত্ত্ব", hi: "अंकविद्या" },
    desc: { en: "Lo Shu grid & Mulank", bn: "মূলাঙ্ক, ভাগ্যাঙ্ক ও লো শু গ্রিড", hi: "मूलांक व भाग्यशाली अंक" },
    icon: Hash,
    route: "/numerology",
  },
  {
    key: "vastu",
    title: { en: "Vastu Shastra", bn: "বাস্তু শাস্ত্র", hi: "वास्तु शास्त्र" },
    short: { en: "Vastu", bn: "বাস্তু", hi: "वास्तु" },
    desc: { en: "16 Zones & remedies", bn: "১৬টি বাস্তু দিক ও শান্তি", hi: "16 दिशाएं व वास्तु शांति" },
    icon: Home,
    route: "/vastu",
  },
  {
    key: "dasha",
    title: { en: "Dasha Calculator", bn: "দশা ক্যালকুলেটর", hi: "दशा कैलकुलेटर" },
    short: { en: "Dasha", bn: "দশা", hi: "दशा" },
    desc: { en: "Vimshottari & timeline", bn: "বিংশোত্তরী ও যোগিনী দশা", hi: "विंशोत्तरी व योगिनी" },
    icon: Hourglass,
    route: "/dasha-calculator",
  },
  {
    key: "rashi",
    title: { en: "Rashi Finder", bn: "রাশি নির্ণয়", hi: "राशि निर्धारण" },
    short: { en: "Rashi", bn: "রাশি", hi: "राशि" },
    desc: { en: "Your moon sign", bn: "সঠিক চন্দ্র রাশি নির্ণয়", hi: "सटीक चंद्र राशि" },
    icon: Moon,
    route: "/rashi-calculator",
  },
  {
    key: "nakshatra",
    title: { en: "Nakshatra", bn: "নক্ষত্র নির্ণয়", hi: "नक्षत्र" },
    short: { en: "Nakshatra", bn: "নক্ষত্র", hi: "नक्षत्र" },
    desc: { en: "Birth star & pada", bn: "জন্ম নক্ষত্র ও পদ", hi: "जन्म नक्षत्र व पद" },
    icon: Sparkles,
    route: "/nakshatra-calculator",
  },
  {
    key: "kp",
    title: { en: "KP Astrology", bn: "কেপি জ্যোতিষ", hi: "केपी ज्योतिष" },
    short: { en: "KP", bn: "কেপি", hi: "केपी" },
    desc: { en: "Krishnamurti sub-lords", bn: "কৃষ্ণমূর্তি পদ্ধতি সাব-লর্ড", hi: "कृष्णमूर्ति पद्धति" },
    icon: Gem,
    route: "/kp-calculator",
  },
  {
    key: "verify",
    title: { en: "Verification Hub", bn: "সনদ যাচাইকরণ", hi: "सत्यापन केंद्र" },
    short: { en: "Verify", bn: "যাচাই", hi: "सत्यापन" },
    desc: { en: "Cryptographic certificate ledger", bn: "ডিজিটাল সনদ ও প্রেসক্রিপশন", hi: "डिजिटल प्रमाण पत्र" },
    icon: ShieldCheck,
    route: "/verify",
  },
];

export function ToolRail() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as "en" | "bn" | "hi";
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative group/rail">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/95 border border-amber-300 shadow-md text-amber-900 flex items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-opacity hover:bg-amber-50 cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {HOME_TOOL_RAIL.map((tool) => {
            const Icon = tool.icon;
            const badge = tool.badge?.[lang];
            return (
              <Link
                key={tool.key}
                href={tool.route}
                className="group relative flex flex-col items-center shrink-0 w-[72px] sm:w-[76px] transition-transform duration-200 hover:-translate-y-1 focus:outline-hidden"
              >
                {/* Glow & Circular Dot */}
                <div className="relative size-16 sm:size-[68px] rounded-full bg-gradient-to-tr from-[#f59e0b] via-[#fbbf24] to-[#fef08a] p-[2px] shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all duration-300 group-hover:shadow-[0_8px_24px_rgba(245,158,11,0.55)] group-hover:scale-105">
                  <div className="size-full rounded-full bg-gradient-to-b from-[#fffbeb] via-[#fef3c7] to-[#fde68a] flex items-center justify-center text-amber-950 border border-amber-300/80">
                    <Icon className="size-7 sm:size-[30px] stroke-[2.2] text-amber-950 transition-transform duration-200 group-hover:scale-110" />
                  </div>

                  {/* Badge */}
                  {badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shadow-xs border border-white">
                      {badge}
                    </span>
                  )}
                </div>

                {/* Compact Label */}
                <span className="mt-2 text-center text-xs font-bold text-stone-800 leading-tight group-hover:text-amber-900 transition-colors line-clamp-1">
                  {tool.short[lang]}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/95 border border-amber-300 shadow-md text-amber-900 flex items-center justify-center opacity-0 group-hover/rail:opacity-100 transition-opacity hover:bg-amber-50 cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
