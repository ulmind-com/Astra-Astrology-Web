"use client";

import * as React from "react";
import Link from "next/link";
import {
  PartyPopper,
  CalendarDays,
  Sparkles,
  ArrowRight,
  Flame,
  Sun,
  Moon,
  Star,
  Heart,
  Search,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";

interface FestivalItem {
  name: Record<string, string>;
  date: Record<string, string>;
  tithi: Record<string, string>;
  category: "major" | "vrat" | "jayanti";
  desc: Record<string, string>;
  gradient: string;
  glow: string;
  badge: Record<string, string>;
}

const FESTIVALS_2026: FestivalItem[] = [
  {
    name: { en: "Makar Sankranti", bn: "মকর সংক্রান্তি", hi: "मकर संक्रांति" },
    date: { en: "January 14, 2026", bn: "১৪ জানুয়ারি, ২০২৬", hi: "14 जनवरी 2026" },
    tithi: { en: "Magha Krishna Paksha", bn: "মাঘ কৃষ্ণ পক্ষ", hi: "माघ कृष्ण पक्ष" },
    category: "major",
    desc: {
      en: "Sun's transition into Capricorn (Makara). Auspicious day for holy dip, charity, and harvesting celebrations.",
      bn: "সূর্যের মকর রাশিতে উত্তরায়ণ প্রবেশ। পুণ্যস্নান, দান এবং পৌষ সংক্রান্তির পিঠেপুলির উৎসব।",
      hi: "सूर्य का मकर राशि में उत्तरायण प्रवेश। पवित्र स्नान, दान और तिल-गुड़ का पावन पर्व।",
    },
    gradient: "from-[#ffb347] to-[#ff8a00]",
    glow: "rgba(255,138,0,0.3)",
    badge: { en: "Harvest & Solar", bn: "সূর্য সংক্রান্তি", hi: "सौर पर्व" },
  },
  {
    name: { en: "Saraswati Puja (Vasant Panchami)", bn: "সরস্বতী পূজা (বসন্ত পঞ্চমী)", hi: "सरस्वती पूजा (बसंत पंचमी)" },
    date: { en: "January 23, 2026", bn: "২৩ জানুয়ারি, ২০২৬", hi: "23 जनवरी 2026" },
    tithi: { en: "Magha Shukla Panchami", bn: "মাঘ শুক্ল পঞ্চমী", hi: "माघ शुक्ल पंचमी" },
    category: "major",
    desc: {
      en: "Celebration of Goddess Saraswati, learning, arts, and the arrival of the spring season.",
      bn: "বিদ্যা ও সংগীতের দেবী সরস্বতীর আরাধনা, হাতেখড়ি ও বসন্ত ঋতুর আগমন।",
      hi: "विद्या, ज्ञान और कला की देवी मां सरस्वती की आराधना और वसंत ऋतु का स्वागत।",
    },
    gradient: "from-[#ffd34d] to-[#f5a300]",
    glow: "rgba(245,163,0,0.34)",
    badge: { en: "Wisdom & Arts", bn: "বিদ্যা ও জ্ঞান", hi: "विद्या व ज्ञान" },
  },
  {
    name: { en: "Maha Shivaratri", bn: "মহা শিবরাত্রি", hi: "महा शिवरात्रि" },
    date: { en: "February 16, 2026", bn: "১৬ ফেব্রুয়ারি, ২০২৬", hi: "16 फ़रवरी 2026" },
    tithi: { en: "Phalguna Krishna Chaturdashi", bn: "ফাল্গুন কৃষ্ণ চতুর্দশী", hi: "फाल्गुन कृष्ण चतुर्दशी" },
    category: "vrat",
    desc: {
      en: "The great night of Lord Shiva. Night-long fasting, Rudrabhishek, and deep spiritual meditation.",
      bn: "মহাদেব শিবের মহা উপবাস ও ব্রত। চার প্রহরে শিবলিঙ্গে অভিষেক এবং আত্মশুদ্ধি।",
      hi: "भगवान शिव की महान महारात्रि। निर्जला व्रत, रुद्राभिषेक और चार प्रहर की विशेष पूजा।",
    },
    gradient: "from-[#8b7bff] to-[#5a3ff2]",
    glow: "rgba(90,63,242,0.3)",
    badge: { en: "Major Vrat", bn: "প্রধান ব্রত", hi: "महाव्रत" },
  },
  {
    name: { en: "Holi & Dol Yatra", bn: "হোলি ও দোলযাত্রা", hi: "होली एवं धुलेंडी" },
    date: { en: "March 4, 2026", bn: "৪ মার্চ, ২০২৬", hi: "4 मार्च 2026" },
    tithi: { en: "Phalguna Purnima", bn: "ফাল্গুনী পূর্ণিমা", hi: "फाल्गुन पूर्णिमा" },
    category: "major",
    desc: {
      en: "The festival of colors and love, celebrating Radha-Krishna divine love and the victory of good over evil.",
      bn: "রঙ ও আনন্দের উৎসব। রাধাকৃষ্ণের দোল পূর্ণিমা ও অশুভের বিনাশে সত্যের জয়।",
      hi: "रंगों और उल्लास का महापर्व। होलिका दहन, राधा-कृष्ण का रंगोत्सव और सामाजिक समरसता।",
    },
    gradient: "from-[#ff6b8b] to-[#e63950]",
    glow: "rgba(230,57,80,0.32)",
    badge: { en: "Colors of Joy", bn: "রঙের উৎসব", hi: "रंगोत्सव" },
  },
  {
    name: { en: "Chaitra Navratri & Ram Navami", bn: "বাসন্তী নবরাত্রি ও রাম নবমী", hi: "चैत्र नवरात्रि व राम नवमी" },
    date: { en: "March 20 – 28, 2026", bn: "২০ – ২৮ মার্চ, ২০২৬", hi: "20 – 28 मार्च 2026" },
    tithi: { en: "Chaitra Shukla Pratipada to Navami", bn: "চৈত্র শুক্লা প্রতিপদ থেকে নবমী", hi: "चैत्र शुक्ल प्रतिपदा से नवमी" },
    category: "major",
    desc: {
      en: "9 sacred nights dedicated to Goddess Durga and the birth anniversary of Maryada Purushottam Lord Rama.",
      bn: "মা দুর্গার নয় রূপের আরাধনা এবং শ্রীরামচন্দ্রের জন্মজয়ন্তী মহোৎসব।",
      hi: "मां दुर्गा के नौ दिव्य स्वरूपों की उपासना और मर्यादा पुरुषोत्तम भगवान श्री राम का जन्मोत्सव।",
    },
    gradient: "from-[#ff8fb0] to-[#ff4f8b]",
    glow: "rgba(255,79,139,0.3)",
    badge: { en: "9 Holy Nights", bn: "৯ পবিত্র রাত্রি", hi: "नवरात्रि" },
  },
  {
    name: { en: "Hanuman Jayanti", bn: "হনুমান জয়ন্তী", hi: "हनुमान जयंती" },
    date: { en: "April 2, 2026", bn: "২ এপ্রিল, ২০২৬", hi: "2 अप्रैल 2026" },
    tithi: { en: "Chaitra Purnima", bn: "চৈত্র পূর্ণিমা", hi: "चैत्र पूर्णिमा" },
    category: "jayanti",
    desc: {
      en: "Birth celebration of Lord Hanuman, the embodiment of devotion, strength, courage, and selfless service.",
      bn: "বজরংবলী শ্রী হনুমানের জন্ম তিথি। সুন্দরকাণ্ড পাঠ, সিঁদুর অর্পণ ও সংকট মুক্তির প্রার্থনা।",
      hi: "संकटमोचन श्री हनुमान जी का जन्मोत्सव। सुंदरकांड पाठ, सिंदूर अर्पण और शक्ति संचय।",
    },
    gradient: "from-[#ff7043] to-[#d84315]",
    glow: "rgba(216,67,21,0.32)",
    badge: { en: "Strength & Devotion", bn: "বীরত্ব ও ভক্তি", hi: "भक्ति व बल" },
  },
  {
    name: { en: "Akshaya Tritiya", bn: "অক্ষয় তৃতীয়া", hi: "अक्षय तृतीया" },
    date: { en: "April 20, 2026", bn: "২০ এপ্রিল, ২০২৬", hi: "20 अप्रैल 2026" },
    tithi: { en: "Vaishakha Shukla Tritiya", bn: "বৈশাখ শুক্ল তৃতীয়া", hi: "वैशाख शुक्ल तृतीया" },
    category: "major",
    desc: {
      en: "A self-proven eternal auspicious day. Highest merit for gold purchases, charity, and new ventures.",
      bn: "অনন্ত ফলদায়ী স্বयंसিদ্ধ অক্ষয় মুহূর্ত। সোনা কেনা, দান ও গৃহপ্রবেশের জন্য সর্বশ্রেষ্ঠ।",
      hi: "अक्षय पुण्य फल देने वाली स्वयं सिद्ध शुभ तिथि। स्वर्ण क्रय, दान और नए कार्यों का श्रीगणेश।",
    },
    gradient: "from-[#ffd34d] to-[#e07b00]",
    glow: "rgba(224,123,0,0.34)",
    badge: { en: "Eternal Prosperity", bn: "অক্ষয় সমৃদ্ধি", hi: "अक्षय समृद्धि" },
  },
  {
    name: { en: "Jagannath Rath Yatra", bn: "জগন্নাথ রথযাত্রা", hi: "जगन्नाथ रथ यात्रा" },
    date: { en: "July 16, 2026", bn: "১৬ জুলাই, ২০২৬", hi: "16 जुलाई 2026" },
    tithi: { en: "Ashadha Shukla Dwitiya", bn: "আষাঢ় শুক্লা দ্বিতীয়া", hi: "आषाढ़ शुक्ल द्वितीया" },
    category: "major",
    desc: {
      en: "Lord Jagannath, Balabhadra, and Subhadra's journey on grand chariots to Gundicha Temple.",
      bn: "প্রভু জগন্নাথ, বলভদ্র ও মা সুভদ্রার পুরীর রথযাত্রা এবং মাসির বাড়ি গুন্ডিচায় গমন।",
      hi: "महाप्रभु जगन्नाथ, बलभद्र व सुभद्रा की भव्य रथयात्रा और मौसी बाड़ी गुंडिचा मंदिर गमन।",
    },
    gradient: "from-[#38d39f] to-[#0f9d6e]",
    glow: "rgba(15,157,110,0.3)",
    badge: { en: "Divine Chariot", bn: "পবিত্র রথ", hi: "दिव्य रथ" },
  },
  {
    name: { en: "Raksha Bandhan", bn: "রাখীবন্ধন", hi: "रक्षा बंधन" },
    date: { en: "August 28, 2026", bn: "২৮ আগস্ট, ২০২৬", hi: "28 अगस्त 2026" },
    tithi: { en: "Shravana Purnima", bn: "শ্রাবণ পূর্ণিমা", hi: "श्रावण पूर्णिमा" },
    category: "major",
    desc: {
      en: "The sacred bond of love and protection between brothers and sisters. Also celebrated as Jhulan Yatra.",
      bn: "ভাই-বোনের চিরন্তন ভালোবাসা ও সুরক্ষার পবিত্র রাখি উৎসব।",
      hi: "भाई-बहन के अटूट स्नेह और सुरक्षा का पावन पर्व। रक्षा सूत्र बंधन एवं श्रावणी उपाकर्म।",
    },
    gradient: "from-[#6fb1ff] to-[#2b6fe0]",
    glow: "rgba(43,111,224,0.3)",
    badge: { en: "Sibling Love", bn: "স্নেহ ও বন্ধন", hi: "स्नेह सूत्र" },
  },
  {
    name: { en: "Krishna Janmashtami", bn: "শ্রীকৃষ্ণ জন্মাষ্টমী", hi: "श्री कृष्ण जन्माष्टमी" },
    date: { en: "September 4, 2026", bn: "৪ সেপ্টেম্বর, ২০২৬", hi: "4 सितम्बर 2026" },
    tithi: { en: "Bhadrapada Krishna Ashtami", bn: "ভাদ্র কৃষ্ণ অষ্টমী", hi: "भाद्रपद कृष्ण अष्टमी" },
    category: "vrat",
    desc: {
      en: "The divine advent of Lord Krishna at midnight. Fasting, midnight puja, and Dahi Handi festivities.",
      bn: "ভগবান শ্রীকৃষ্ণের মধ্যরাতে দিব্য আবির্ভাব। নির্জলা উপবাস, নন্দোৎসব ও ভাগবত কথা।",
      hi: "भगवान श्री कृष्ण का मध्यरात्रि में प्राकट्य दिवस। व्रत, माखन-मिश्री भोग और दही हांडी उत्सव।",
    },
    gradient: "from-[#8b7bff] to-[#5a3ff2]",
    glow: "rgba(90,63,242,0.3)",
    badge: { en: "Divine Avatar", bn: "শ্রীকৃষ্ণ আবির্ভাব", hi: "कृष्णावतार" },
  },
  {
    name: { en: "Sharad Navratri & Durga Puja", bn: "শারদীয়া দুর্গাপূজা ও নবরাত্রি", hi: "शारदीय नवरात्रि व दुर्गा पूजा" },
    date: { en: "October 11 – 20, 2026", bn: "১১ – ২০ অক্টোবর, ২০২৬", hi: "11 – 20 अक्टूबर 2026" },
    tithi: { en: "Ashwina Shukla Pratipada to Dashami", bn: "আশ্বিন শুক্লা প্রতিপদ থেকে দশমী", hi: "आश्विन शुक्ल प्रतिपदा से दशमी" },
    category: "major",
    desc: {
      en: "Bengal's magnificent Durga Puja & all-India Navratri, culminating in Dussehra (Vijayadashami).",
      bn: "বাঙালির প্রাণের মহোৎসব দুর্গাপূজা—মহাষষ্ঠী থেকে বিজয়া দশমী। অসুরের ওপর মায়ের জয়।",
      hi: "महिषासुरमर्दिनी मां दुर्गा की महापूजा और असत्य पर सत्य की विजय का प्रतीक विजयादशमी।",
    },
    gradient: "from-[#ff6b8b] to-[#e63950]",
    glow: "rgba(230,57,80,0.32)",
    badge: { en: "Grandest Festival", bn: "মহোৎসব", hi: "महापर्व" },
  },
  {
    name: { en: "Diwali & Kali Puja (Lakshmi Puja)", bn: "দীপাবলি ও কালীপূজা", hi: "दीपावली व लक्ष्मी पूजा" },
    date: { en: "November 8, 2026", bn: "৮ নভেম্বর, ২০২৬", hi: "8 नवम्बर 2026" },
    tithi: { en: "Kartika Amavasya", bn: "কার্তিক অমাবস্যা", hi: "कार्तिक अमावस्या" },
    category: "major",
    desc: {
      en: "Festival of lights, welcoming Goddess Lakshmi and Lord Ganesha. In Bengal, nighttime Maa Kali adoration.",
      bn: "আলোর মহা উৎসব দীপাবলি ও নিশারাতে মা কালীর মহাশক্তি আরাধনা।",
      hi: "प्रकाश पर्व दीपावली। मां लक्ष्मी, गणेश जी एवं कुबेर पूजन तथा अंधकार पर प्रकाश की विजय।",
    },
    gradient: "from-[#ffd34d] to-[#f5a300]",
    glow: "rgba(245,163,0,0.34)",
    badge: { en: "Festival of Lights", bn: "আলোর উৎসব", hi: "दीपोत्सव" },
  },
  {
    name: { en: "Chhath Puja", bn: "ছট পূজা", hi: "छठ पूजा (सूर्य षष्ठी)" },
    date: { en: "November 14 – 15, 2026", bn: "১৪ – ১৫ নভেম্বর, ২০২৬", hi: "14 – 15 नवम्बर 2026" },
    tithi: { en: "Kartika Shukla Shashthi", bn: "কার্তিক শুক্ল ষষ্ঠী", hi: "कार्तिक शुक्ल षष्ठी" },
    category: "vrat",
    desc: {
      en: "Ancient 4-day rigorous Vedic ritual worshipping Sun God (Surya) and Chhathi Maiya for family well-being.",
      bn: "ভগবান সূর্যদেব ও ষষ্ঠী মায়ের উদ্দেশ্যে নিবেদিত পরম নিষ্ঠার মহা পবিত্র চারদিনের ব্রত।",
      hi: "सूर्य देव और छठी मइया को समर्पित चार दिवसीय कठिन और सबसे पवित्र लोकपर्व।",
    },
    gradient: "from-[#ff7043] to-[#d84315]",
    glow: "rgba(216,67,21,0.3)",
    badge: { en: "Sun Worship", bn: "সূর্য উপাসনা", hi: "सूर्य उपासना" },
  },
];

const T = {
  en: {
    badge: "Vedic Festivals & Vrat",
    title: "Hindu Festivals & Vrat Calendar 2026",
    subtitle:
      "A complete guide to sacred Vedic festivals, auspicious vrats, and lunar celebrations throughout 2026 with precise tithis and significance.",
    searchPlaceholder: "Search festival (e.g. Diwali, Shivaratri, Holi)...",
    filterAll: "All Festivals",
    filterMajor: "Major Festivals",
    filterVrat: "Fasting & Vrat",
    filterJayanti: "Jayanti & Days",
    vratRulesTitle: "Vedic Significance of Vrats & Fasts",
    vratRulesDesc:
      "In Vedic astrology and Sanatana Dharma, fasts (Vrats) are not merely dietary restrictions. They are sacred alignments designed to cleanse the physical body, purify the mind, and harmonize individual consciousness with planetary and lunar vibrations on peak energetic tithis like Ekadashi, Purnima, and Amavasya.",
    livePanchangTitle: "Live Daily Tithi & Panchang Available",
    livePanchangSub:
      "Track every upcoming Ekadashi, Purnima, Sankranti, and Amavasya in real-time with our Swiss Ephemeris-backed Daily Horoscope & Panchang engine.",
    livePanchangCta: "Check Today's Tithi in Daily Horoscope",
    consultTitle: "Planning a Special Puja or Havan?",
    consultSub:
      "Our verified Vedic pandits and astrologers provide authentic guidance on festival rituals, auspicious sankalp timings, and personalized dosha shanti.",
    consultCta: "Consult a Vedic Astrologer",
  },
  bn: {
    badge: "বৈদিক উৎসব ও ব্রত",
    title: "হিন্দু উৎসব ও ব্রত পঞ্জিকা ২০২৬",
    subtitle:
      "২০২৬ সালের প্রধান হিন্দু উৎসব, পবিত্র উপবাস ও ব্রত তিথির সম্পূর্ণ সহায়িকা—নির্ভুল তিথি, তারিখ ও আধ্যাত্মিক তাৎপর্য সহ।",
    searchPlaceholder: "উৎসব খুঁজুন (যেমন: দুর্গাপূজা, দীপাবলি, শিবরাত্রি)...",
    filterAll: "সকল উৎসব",
    filterMajor: "প্রধান উৎসব",
    filterVrat: "ব্রত ও উপবাস",
    filterJayanti: "জয়ন্তী ও বিশেষ দিন",
    vratRulesTitle: "ব্রত ও উপবাসের বৈদিক তাৎপর্য",
    vratRulesDesc:
      "বৈদিক শাস্ত্র ও সনাতন ধর্মে ব্রত কেবলমাত্র উপবাস নয়; এটি দেহ, মন ও আত্মাকে পবিত্র করার এক গভীর তপস্যা। একাদশী, পূর্ণিমা ও অমাবস্যার মতো বিশেষ তিথিতে গ্রহ ও চন্দ্রের শক্তির সাথে সুরসংগতি বজায় রেখে আধ্যাত্মিক উন্নতি ও শারীরিক আরোগ্য লাভ হয়।",
    livePanchangTitle: "লাইভ দৈনিক তিথি ও পঞ্জিকা উপলব্ধ",
    livePanchangSub:
      "প্রতিটি একাদশী, পূর্ণিমা, অমাবস্যা ও সংক্রান্তির নির্ভুল তিথি মুহূর্ত রিয়েল-টাইমে দেখতে আমাদের দৈনিক রাশিফল ও পঞ্চাঙ্গ ব্যবহার করুন।",
    livePanchangCta: "আজকের তিথি রাশিফলে দেখুন",
    consultTitle: "বিশেষ পূজা বা যজ্ঞের পরিকল্পনা করছেন?",
    consultSub:
      "উৎসবের শাস্ত্রীয় নিয়ম, শুভ সংকল্প মুহূর্ত এবং গৃহশান্তির জন্য আমাদের সার্টিফাইড বৈদিক জ্যোতিষী ও পণ্ডিতদের সাথে সরাসরি পরামর্শ করুন।",
    consultCta: "বৈদিক জ্যোতিষীর সাথে কথা বলুন",
  },
  hi: {
    badge: "वैदिक त्योहार एवं व्रत",
    title: "हिन्दू त्योहार एवं व्रत कैलेंडर 2026",
    subtitle:
      "वर्ष 2026 के सभी प्रमुख हिन्दू पर्व, पावन व्रत और तिथियों की प्रामाणिक मार्गदर्शिका—सटीक तिथि, मुहूर्त और आध्यात्मिक महत्व के साथ।",
    searchPlaceholder: "त्योहार खोजें (उदा: दीवाली, होली, शिवरात्रि)...",
    filterAll: "सभी त्योहार",
    filterMajor: "प्रमुख पर्व",
    filterVrat: "व्रत एवं उपवास",
    filterJayanti: "जयंती व विशेष दिवस",
    vratRulesTitle: "व्रत एवं उपवास का वैदिक महत्व",
    vratRulesDesc:
      "वैदिक परंपरा और सनातन धर्म में व्रत केवल अन्न त्याग नहीं, अपितु शरीर और मन की शुद्धि की वैज्ञानिक साधना है। एकादशी, पूर्णिमा और अमावस्या जैसी ऊर्जावान तिथियों पर उपवास करने से ग्रहों के प्रतिकूल प्रभाव शांत होते हैं और आत्मिक शांति प्राप्त होती है।",
    livePanchangTitle: "लाइव दैनिक तिथि व पंचांग उपलब्ध",
    livePanchangSub:
      "आगामी एकादशी, पूर्णिमा, संक्रांति और प्रदोष व्रत की सटीक तिथि स्विस एफेमेरिस आधारित हमारे दैनिक राशिफल एवं पंचांग में देखें।",
    livePanchangCta: "आज की तिथि दैनिक राशिफल में देखें",
    consultTitle: "त्योहार पर विशेष पूजा या अनुष्ठान?",
    consultSub:
      "शास्त्रोक्त विधि-विधान, शुभ संकल्प मुहूर्त और विशेष पूजन हेतु हमारे प्रमाणित वैदिक विद्वानों एवं ज्योतिषियों से परामर्श लें।",
    consultCta: "वैदिक ज्योतिषी से बात करें",
  },
};

export default function FestivalsPage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as
    | "en"
    | "bn"
    | "hi";
  const t = T[lang];

  const [search, setSearch] = React.useState("");
  const [activeFilter, setActiveFilter] = React.useState<"all" | "major" | "vrat" | "jayanti">("all");

  const filtered = React.useMemo(() => {
    return FESTIVALS_2026.filter((f) => {
      if (activeFilter !== "all" && f.category !== activeFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const n = (f.name[lang] || f.name.en).toLowerCase();
      const d = (f.desc[lang] || f.desc.en).toLowerCase();
      const dt = (f.date[lang] || f.date.en).toLowerCase();
      return n.includes(q) || d.includes(q) || dt.includes(q);
    });
  }, [search, activeFilter, lang]);

  return (
    <div className="min-h-screen bg-surface-muted/30 text-foreground flex flex-col font-sans pb-24">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-100/90 text-pink-950 border border-pink-300 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <PartyPopper className="size-3.5 text-pink-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1a1208]">
            {t.title}
          </h1>

          <p className="text-sm sm:text-base text-[#6b5f4d] max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8b6a1a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-full border border-[#ece0ac] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1a1208] placeholder:text-[#998a72] focus:border-amber-400 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: t.filterAll },
              { id: "major", label: t.filterMajor },
              { id: "vrat", label: t.filterVrat },
              { id: "jayanti", label: t.filterJayanti },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  activeFilter === tab.id
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white text-[#766545] border border-[#ece0ac] hover:bg-[#fff9e6]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Festival Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((fest, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-[22px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-5 sm:p-6 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400 hover:shadow-[0_16px_36px_-12px_rgba(240,200,50,0.45)] flex flex-col justify-between"
            >
              {/* Corner ambient glow */}
              <div
                className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundColor: fest.glow }}
              />

              <div>
                {/* Header: Date + Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50/90 border border-amber-200/80 px-2.5 py-1 rounded-full">
                    <CalendarDays className="size-3 text-amber-600" />
                    <span>{fest.date[lang]}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#8b5e0a] bg-[#fff6d8] px-2.5 py-0.5 rounded-full border border-amber-300/50">
                    {fest.badge[lang]}
                  </span>
                </div>

                {/* Festival Name */}
                <h3 className="text-lg font-black tracking-tight text-[#1a1208] mb-1 group-hover:text-amber-800 transition-colors">
                  {fest.name[lang]}
                </h3>

                {/* Tithi subtitle */}
                <p className="text-[11.5px] font-semibold text-amber-900/70 mb-3 flex items-center gap-1">
                  <Moon className="size-3 text-amber-600" />
                  <span>{fest.tithi[lang]}</span>
                </p>

                {/* Description */}
                <p className="text-xs text-[#6b5f4d] leading-relaxed mb-4">
                  {fest.desc[lang]}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#f2e9b0]/80 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-[#8b6a1a]">
                  {lang === "bn" ? "২০২৬ পঞ্জিকা তিথি" : lang === "hi" ? "2026 पंचांग तिथि" : "2026 Vedic Calendar"}
                </span>
                <Link
                  href="/daily-horoscope"
                  className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-900 transition-colors"
                >
                  <span>{lang === "bn" ? "তিথি দেখুন" : lang === "hi" ? "तिथि देखें" : "View Tithi"}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-[24px] border border-[#ece0ac] bg-white">
            <p className="text-sm font-semibold text-[#766545]">
              {lang === "bn"
                ? "কোন উৎসব খুঁজে পাওয়া যায়নি।"
                : lang === "hi"
                ? "कोई त्योहार नहीं मिला।"
                : "No festivals matched your search."}
            </p>
          </div>
        )}

        {/* Vrat & Fasting Vedic Significance */}
        <section className="rounded-[24px] border border-[#ece0ac] bg-gradient-to-b from-white to-[#fffdf3] p-6 sm:p-8 shadow-[0_6px_22px_-12px_rgba(26,18,8,0.1)]">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="size-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1a1208]">
              {t.vratRulesTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed">
            {t.vratRulesDesc}
          </p>
        </section>

        {/* Live Panchang CTA */}
        <section className="rounded-[24px] border-2 border-amber-300 bg-gradient-to-r from-[#fffbeb] to-[#fff7d1] p-6 sm:p-8 shadow-[0_8px_24px_-10px_rgba(240,200,50,0.35)]">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="size-5 text-amber-600" />
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1a1208]">
              {t.livePanchangTitle}
            </h2>
          </div>
          <p className="text-sm text-[#6b5f4d] leading-relaxed mb-5">
            {t.livePanchangSub}
          </p>
          <Link
            href="/daily-horoscope"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            {t.livePanchangCta}
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
