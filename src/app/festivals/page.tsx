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
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";

interface FestivalItem {
  id: string;
  name: Record<string, string>;
  date: Record<string, string>;
  tithi: Record<string, string>;
  category: "major" | "vrat" | "jayanti";
  desc: Record<string, string>;
  badge: Record<string, string>;
  icon: LucideIcon;
  iconBg: string;
}

const FESTIVALS_2026: FestivalItem[] = [
  {
    id: "makar-sankranti",
    name: { en: "Makar Sankranti", bn: "মকর সংক্রান্তি", hi: "मकर संक्रांति" },
    date: { en: "January 14, 2026", bn: "১৪ জানুয়ারি, ২০২৬", hi: "14 जनवरी 2026" },
    tithi: { en: "Magha Krishna Paksha", bn: "মাঘ কৃষ্ণ পক্ষ", hi: "माघ कृष्ण पक्ष" },
    category: "major",
    desc: {
      en: "Sun's transition into Capricorn (Makara). Auspicious day for holy dip, charity, and harvesting celebrations.",
      bn: "সূর্যের মকর রাশিতে উত্তরায়ণ প্রবেশ। পুণ্যস্নান, দান এবং পৌষ সংক্রান্তির পিঠেপুলির উৎসব।",
      hi: "सूर्य का मकर राशि में उत्तरायण प्रवेश। पवित्र स्नान, दान और तिल-गुड़ का पावन पर्व।",
    },
    badge: { en: "Harvest & Solar", bn: "সূর্য সংক্রান্তি", hi: "सौर पर्व" },
    icon: Sun,
    iconBg: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "saraswati-puja",
    name: { en: "Saraswati Puja (Vasant Panchami)", bn: "সরস্বতী পূজা (বসন্ত পঞ্চমী)", hi: "सरस्वती पूजा (बसंत पंचमी)" },
    date: { en: "January 23, 2026", bn: "২৩ জানুয়ারি, ২০২৬", hi: "23 जनवरी 2026" },
    tithi: { en: "Magha Shukla Panchami", bn: "মাঘ শুক্ল পঞ্চমী", hi: "माघ शुक्ल पंचमी" },
    category: "major",
    desc: {
      en: "Celebration of Goddess Saraswati, learning, arts, and the arrival of the spring season.",
      bn: "বিদ্যা ও সংগীতের দেবী সরস্বতীর আরাধনা, শিশুদের হাতেখড়ি ও বসন্ত ঋতুর আগমন।",
      hi: "विद्या, ज्ञान और कला की देवी मां सरस्वती की आराधना और वसंत ऋतु का स्वागत।",
    },
    badge: { en: "Wisdom & Arts", bn: "বিদ্যা ও জ্ঞান", hi: "विद्या व ज्ञान" },
    icon: Sparkles,
    iconBg: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  {
    id: "maha-shivaratri",
    name: { en: "Maha Shivaratri", bn: "মহা শিবরাত্রি", hi: "महा शिवरात्रि" },
    date: { en: "February 16, 2026", bn: "১৬ ফেব্রুয়ারি, ২০২৬", hi: "16 फ़रवरी 2026" },
    tithi: { en: "Phalguna Krishna Chaturdashi", bn: "ফাল্গুন কৃষ্ণ চতুর্দশী", hi: "फाल्गुन कृष्ण चतुर्दशी" },
    category: "vrat",
    desc: {
      en: "The great night of Lord Shiva. Night-long fasting, Rudrabhishek, and deep spiritual meditation.",
      bn: "মহাদেব শিবের মহা উপবাস ও ব্রত। চার প্রহরে শিবলিঙ্গে অভিষেক এবং আত্মশুদ্ধি।",
      hi: "भगवान शिव की महान महारात्रि। निर्जला व्रत, रुद्राभिषेक और चार प्रहर की विशेष पूजा।",
    },
    badge: { en: "Major Vrat", bn: "প্রধান ব্রত", hi: "महाव्रत" },
    icon: Flame,
    iconBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    id: "holi-dol-yatra",
    name: { en: "Holi & Dol Yatra", bn: "হোলি ও দোলযাত্রা", hi: "होली एवं धुलेंडी" },
    date: { en: "March 4, 2026", bn: "৪ মার্চ, ২০২৬", hi: "4 मार्च 2026" },
    tithi: { en: "Phalguna Purnima", bn: "ফাল্গুনী পূর্ণিমা", hi: "फाल्गुन पूर्णिमा" },
    category: "major",
    desc: {
      en: "The festival of colors and love, celebrating Radha-Krishna divine love and victory of good over evil.",
      bn: "রঙ ও আনন্দের উৎসব। রাধাকৃষ্ণের দোল পূর্ণিমা ও অশুভের বিনাশে সত্যের জয়।",
      hi: "रंगों और उल्लास का महापर्व। होलिका दहन, राधा-कृष्ण का रंगोत्सव और सामाजिक समरसता।",
    },
    badge: { en: "Colors of Joy", bn: "রঙের উৎসব", hi: "रंगोत्सव" },
    icon: Heart,
    iconBg: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    id: "chaitra-navratri-ram-navami",
    name: { en: "Chaitra Navratri & Ram Navami", bn: "বাসন্তী নবরাত্রি ও রাম নবমী", hi: "चैत्र नवरात्रि व राम नवमी" },
    date: { en: "March 20 – 28, 2026", bn: "২০ – ২৮ মার্চ, ২০২৬", hi: "20 – 28 मार्च 2026" },
    tithi: { en: "Chaitra Shukla Pratipada to Navami", bn: "চৈত্র শুক্লা প্রতিপদ থেকে নবমী", hi: "चैत्र शुक्ल प्रतिपदा से नवमी" },
    category: "major",
    desc: {
      en: "9 sacred nights dedicated to Goddess Durga and birth anniversary of Maryada Purushottam Lord Rama.",
      bn: "মা দুর্গার নয় রূপের আরাধনা এবং শ্রীরামচন্দ্রের জন্মজয়ন্তী মহোৎসব।",
      hi: "मां दुर्गा के नौ दिव्य स्वरूपों की उपासना और मर्यादा पुरुषोत्तम भगवान श्री राम का जन्मोत्सव।",
    },
    badge: { en: "Navratri", bn: "নবরাত্রি", hi: "नवरात्रि" },
    icon: Star,
    iconBg: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "hanuman-jayanti",
    name: { en: "Hanuman Jayanti", bn: "হনুমান জয়ন্তী", hi: "हनुमान जयंती" },
    date: { en: "April 2, 2026", bn: "২ এপ্রিল, ২০২৬", hi: "2 अप्रैल 2026" },
    tithi: { en: "Chaitra Purnima", bn: "চৈত্র পূর্ণিমা", hi: "चैत्र पूर्णिमा" },
    category: "jayanti",
    desc: {
      en: "Birth celebration of Lord Hanuman, the embodiment of devotion, strength, courage, and selfless service.",
      bn: "বজরংবলী শ্রী হনুমানের জন্ম তিথি। সুন্দরকাণ্ড পাঠ, সিঁদুর অর্পণ ও সংকট মুক্তির প্রার্থনা।",
      hi: "संकटमोचन श्री हनुमान जी का जन्मोत्सव। सुंदरकांड पाठ, सिंदूर अर्पण और शक्ति संचय।",
    },
    badge: { en: "Strength & Devotion", bn: "বীরত্ব ও ভক্তি", hi: "भक्ति व बल" },
    icon: Flame,
    iconBg: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "pohela-boishakh",
    name: { en: "Bengali New Year (Pohela Boishakh)", bn: "পহেলা বৈশাখ (শুভ নববর্ষ ১৪৩৩)", hi: "पोइला बैसाख" },
    date: { en: "April 15, 2026", bn: "১৫ এপ্রিল, ২০২৬", hi: "15 अप्रैल 2026" },
    tithi: { en: "Boishakh 1 (Solar Mesha)", bn: "১ বৈশাখ (সৌর মেষ সংক্রান্তি)", hi: "बैसाख संक्रांति" },
    category: "major",
    desc: {
      en: "Traditional Bengali New Year. Hal khata business accounting opening, Lakshmi-Ganesha puja.",
      bn: "বাঙালির শুভ নববর্ষ ১৪৩৩। নতুন হালখাতা উন্মোচন, ব্যবসায়ী প্রতিষ্ঠানে লক্ষ্মী-গণেশ পূজা।",
      hi: "पारंपरिक बंगाली नववर्ष। व्यापारियों का नया बहीखाता आरंभ और लक्ष्मी-गणेश पूजन।",
    },
    badge: { en: "New Year", bn: "শুভ নববর্ষ", hi: "नववर्ष" },
    icon: Sun,
    iconBg: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "akshaya-tritiya",
    name: { en: "Akshaya Tritiya", bn: "অক্ষয় তৃতীয়া", hi: "अक्षय तृतीया" },
    date: { en: "April 20, 2026", bn: "২০ এপ্রিল, ২০২৬", hi: "20 अप्रैल 2026" },
    tithi: { en: "Vaishakha Shukla Tritiya", bn: "বৈশাখ শুক্লা তৃতীয়া", hi: "वैशाख शुक्ल तृतीया" },
    category: "major",
    desc: {
      en: "Supreme eternal muhurat for buying gold, starting new business ventures, and permanent wealth rituals.",
      bn: "চিরস্থায়ী শুভ মুহূর্ত। সোনা কেনা, নতুন ব্যবসা শুরু ও অক্ষয় লক্ষ্মী কৃপা লাভের শ্রেষ্ঠ দিন।",
      hi: "स्वर्ण खरीद, नया व्यापार आरंभ और अक्षय फल की प्राप्ति हेतु सर्वोत्तम अबूझ मुहूर्त।",
    },
    badge: { en: "Eternal Muhurat", bn: "অক্ষয় মুহূর্ত", hi: "अबूझ मुहूर्त" },
    icon: Sparkles,
    iconBg: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "jagannath-rath-yatra",
    name: { en: "Jagannath Rath Yatra", bn: "জগন্নাথ রথযাত্রা", hi: "जगन्नाथ रथ यात्रा" },
    date: { en: "July 16, 2026", bn: "১৬ জুলাই, ২০২৬", hi: "16 जुलाई 2026" },
    tithi: { en: "Ashadha Shukla Dwitiya", bn: "আষাঢ় শুক্লা দ্বিতীয়া", hi: "आषाढ़ शुक्ल द्वितीया" },
    category: "major",
    desc: {
      en: "Lord Jagannath, Balabhadra, and Subhadra's journey on grand chariots to Gundicha Temple.",
      bn: "প্রভু জগন্নাথ, বলভদ্র ও মা সুভদ্রার পুরীর রথযাত্রা এবং মাসির বাড়ি গুন্ডিচায় গমন।",
      hi: "महाप्रभु जगन्नाथ, बलभद्र व सुभद्रा की भव्य रथयात्रा और मौसी बाड़ी गुंडिचा मंदिर गमन।",
    },
    badge: { en: "Divine Chariot", bn: "পবিত্র রথ", hi: "दिव्य रथ" },
    icon: Star,
    iconBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    id: "guru-purnima",
    name: { en: "Guru Purnima", bn: "গুরু পূর্ণিমা", hi: "गुरु पूर्णिमा" },
    date: { en: "July 29, 2026", bn: "২৯ জুলাই, ২০২৬", hi: "29 जुलाई 2026" },
    tithi: { en: "Ashadha Purnima", bn: "আষাঢ়ী পূর্ণিমা", hi: "आषाढ़ पूर्णिमा" },
    category: "vrat",
    desc: {
      en: "Sacred homage to spiritual masters, teachers, and Maharishi Veda Vyasa.",
      bn: "আধ্যাত্মিক গুরু ও পথপ্রদর্শকদের চরণে শ্রদ্ধা নিবেদন ও বেদব্যাস জয়ন্তী।",
      hi: "आध्यात्मिक गुरुओं, आचार्यों के प्रति कृतज्ञता समर्पण और महर्षि वेदव्यास जयंती।",
    },
    badge: { en: "Guru Veneration", bn: "গুরু বন্দনা", hi: "गुरु वंदना" },
    icon: Moon,
    iconBg: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "raksha-bandhan",
    name: { en: "Raksha Bandhan", bn: "রাখীবন্ধন", hi: "रक्षा बंधन" },
    date: { en: "August 28, 2026", bn: "২৮ আগস্ট, ২০২৬", hi: "28 अगस्त 2026" },
    tithi: { en: "Shravana Purnima", bn: "শ্রাবণ পূর্ণিমা", hi: "श्रावण पूर्णिमा" },
    category: "major",
    desc: {
      en: "Sacred bond of protection and unconditional love between brothers and sisters.",
      bn: "ভাই ও বোনের পবিত্র স্নেহবন্ধন ও সুরক্ষার অঙ্গীকার উৎসব।",
      hi: "भाई-बहन के पवित्र प्रेम और रक्षा के संकल्प का महापर्व।",
    },
    badge: { en: "Bond of Love", bn: "স্নেহের বন্ধন", hi: "स्नेह बंधन" },
    icon: Heart,
    iconBg: "bg-pink-100 text-pink-700 border-pink-200",
  },
  {
    id: "krishna-janmashtami",
    name: { en: "Krishna Janmashtami", bn: "শ্রীকৃষ্ণ জন্মাষ্টমী", hi: "श्रीकृष्ण जन्माष्टमी" },
    date: { en: "September 4, 2026", bn: "৪ সেপ্টেম্বর, ২০২৬", hi: "4 सितंबर 2026" },
    tithi: { en: "Bhadrapada Krishna Ashtami", bn: "ভাদ্র কৃষ্ণ অষ্টমী", hi: "भाद्रपद कृष्ण अष्टमी" },
    category: "major",
    desc: {
      en: "Divine appearance day of Lord Krishna in Rohini Nakshatra. Fasting, midnight puja and abhishek.",
      bn: "রোহিণী নক্ষত্রে ভগবান শ্রীকৃষ্ণের মর্ত্যে শুভাগমন। নির্জলা ব্রত ও মধ্যরাতের রাজকীয় পূজা।",
      hi: "रोहिणी नक्षत्र में भगवान श्री कृष्ण का जन्मोत्सव। रात्रि जागरण, अभिषेक और माखन भोग।",
    },
    badge: { en: "Avatara Jayanti", bn: "অবতার জয়ন্তী", hi: "अवतार जयंती" },
    icon: Star,
    iconBg: "bg-sky-100 text-sky-700 border-sky-200",
  },
  {
    id: "maha-durga-puja-dussehra",
    name: { en: "Maha Durga Puja & Dussehra", bn: "শারদীয়া দুর্গাপূজা ও বিজয়া দশমী", hi: "दुर्गा पूजा एवं दशहरा" },
    date: { en: "October 16 – 20, 2026", bn: "১৬ – ২০ অক্টোবর, ২০২৬", hi: "16 – 20 अक्टूबर 2026" },
    tithi: { en: "Ashwin Shukla Shashthi to Dashami", bn: "আশ্বিন শুক্লা ষষ্ঠী থেকে দশমী", hi: "आश्विन शुक्ल षष्ठी से दशमी" },
    category: "major",
    desc: {
      en: "Grand celebration of Mahishasuramardini Goddess Durga and victory of Lord Rama over Ravana.",
      bn: "মহিষাসুরমর্দিনী মা দুর্গার মহোৎসব, সন্ধিপূজা, কুমারী পূজা এবং দশমীতে বিজয়ার শুভাশিস।",
      hi: "मां दुर्गा का महाउत्सव, शस्त्र पूजन, रामलीला और रावण दहन पर अधर्म पर धर्म की विजय।",
    },
    badge: { en: "Grand Festival", bn: "মহোৎসব", hi: "महापर्व" },
    icon: PartyPopper,
    iconBg: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    id: "dhanteras-diwali",
    name: { en: "Dhanteras & Diwali (Kali Puja)", bn: "ধনতেরাস, দীপাবলি ও শ্যামা পূজা", hi: "धनतेरस, दीपावली व महालक्ष्मी पूजन" },
    date: { en: "November 6 – 8, 2026", bn: "৬ – ৮ নভেম্বর, ২০২৬", hi: "6 – 8 नवंबर 2026" },
    tithi: { en: "Kartika Krishna Trayodashi & Amavasya", bn: "কার্তিকী কৃষ্ণা ত্রয়োদশী ও অমাবস্যা", hi: "कार्तिक कृष्ण त्रयोदशी व अमावस्या" },
    category: "major",
    desc: {
      en: "Festival of lights, welcoming Goddess Mahalakshmi, Kuber and worship of Ma Kali.",
      bn: "আলোর মহা উৎসব। মা লক্ষ্মী ও কুবেরের আবাহন, অমাবস্যার নিশীথ রাতে মা কালীর পূজা।",
      hi: "प्रकाश पर्व। समुद्र मंथन से प्रकट मां लक्ष्मी, कुबेर और भगवान धन्वंतरि की विशेष आराधना।",
    },
    badge: { en: "Lights & Wealth", bn: "ধনলক্ষ্মী ও দীপাবলি", hi: "दीपावली" },
    icon: Flame,
    iconBg: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    id: "chhath-puja",
    name: { en: "Chhath Puja", bn: "ছট পূজা", hi: "छठ पूजा (सूर्य षष्ठी)" },
    date: { en: "November 14 – 15, 2026", bn: "১৪ – ১৫ নভেম্বর, ২০২৬", hi: "14 – 15 नवम्बर 2026" },
    tithi: { en: "Kartika Shukla Shashthi", bn: "কার্তিক শুক্ল ষষ্ঠী", hi: "कार्तिक शुक्ल षष्ठी" },
    category: "vrat",
    desc: {
      en: "Ancient 4-day rigorous Vedic ritual worshipping Sun God (Surya) and Chhathi Maiya for family well-being.",
      bn: "ভগবান সূর্যদেব ও ষষ্ঠী মায়ের উদ্দেশ্যে নিবেদিত পরম নিষ্ঠার মহা পবিত্র চারদিনের ব্রত।",
      hi: "सूर्य देव और छठी मइया को समर्पित चार दिवसीय कठिन और सबसे पवित्र लोकपर्व।",
    },
    badge: { en: "Sun Worship", bn: "সূর্য উপাসনা", hi: "सूर्य उपासना" },
    icon: Sun,
    iconBg: "bg-orange-100 text-orange-700 border-orange-200",
  },
];

const T = {
  en: {
    badge: "Vedic Festivals & Vrat 2026",
    heroTitle: "Auspicious Festivals Calendar 2026",
    heroSubtitle:
      "Exact Vedic tithis, dates, significance, and rituals for every major Hindu festival and sacred vrat.",
    searchPlaceholder: "Search festival (e.g. Diwali, Shivaratri, Holi)...",
    filterAll: "All Festivals",
    filterMajor: "Major Festivals",
    filterVrat: "Fasting & Vrats",
    filterJayanti: "Jayanti & Days",
    vratRulesTitle: "Vedic Significance of Vrats & Fasts",
    vratRulesDesc:
      "In Vedic astrology and Sanatana Dharma, fasts (Vrats) are sacred alignments designed to cleanse the physical body, purify the mind, and harmonize individual consciousness with planetary and lunar vibrations on peak energetic tithis like Ekadashi, Purnima, and Amavasya.",
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
    badge: "বৈদিক উৎসব ও ব্রত পঞ্জিকা ২০২৬",
    heroTitle: "২০২৬ সালের সকল বৈদিক উৎসব ও ব্রত",
    heroSubtitle:
      "পূজা, উপবাস ও মহোৎসবের সঠিক তিথি, শাস্ত্রীয় মাহাত্ম্য ও বিশুদ্ধ সনাতন পালনবিধি।",
    searchPlaceholder: "উৎসব বা ব্রত খুঁজুন (যেমন: দুর্গাপূজা, দীপাবলি, শিবরাত্রি)...",
    filterAll: "সকল উৎসব",
    filterMajor: "প্রধান মহোৎসব",
    filterVrat: "পবিত্র ব্রত ও উপবাস",
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
    badge: "वैदिक पर्व व व्रत 2026",
    heroTitle: "2026 के प्रमुख हिंदू त्योहार एवं व्रत",
    heroSubtitle:
      "पूजा, उपवास और महापर्वों की सटीक तिथि, शास्त्रीय महात्म्य एवं विधि-विधान।",
    searchPlaceholder: "त्योहार खोजें (उदा: दीवाली, होली, शिवरात्रि)...",
    filterAll: "सभी त्योहार",
    filterMajor: "प्रमुख महापर्व",
    filterVrat: "पवित्र व्रत एवं उपवास",
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
    <div className="min-h-screen bg-[#faf8f5] text-foreground flex flex-col font-sans pb-24">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Mobile-Consistent Cosmic ToolHero Banner */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#2b1a52] via-[#5a2d86] to-[#7c3aed] p-6 sm:p-10 text-white shadow-xl">
          {/* Subtle cosmic orbs & stars matching mobile ToolHero */}
          <div className="pointer-events-none absolute -top-12 -right-8 size-44 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 size-36 rounded-full bg-pink-500/15 blur-2xl" />
          <div className="pointer-events-none absolute top-4 right-1/4 size-1.5 rounded-full bg-white/90" />
          <div className="pointer-events-none absolute top-12 right-12 size-1 rounded-full bg-white/70" />
          <div className="pointer-events-none absolute bottom-8 right-1/3 size-1 rounded-full bg-white/80" />

          <div className="relative z-10 max-w-2xl">
            {/* Pulsing Sacred Medallion matching mobile ToolHero */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-[#fcd404] text-[#1c1304] shadow-lg ring-4 ring-[#fcd404]/30">
                <PartyPopper className="size-7" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-200 backdrop-blur-xs">
                <Sparkles className="size-3 text-amber-300" />
                {t.badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
              {t.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search box matching mobile app */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8b6a1a]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[#1a1208] placeholder:text-[#998a72] focus:border-amber-400 focus:outline-hidden shadow-2xs"
            />
          </div>

          {/* Category filter pills matching mobile app */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all", label: t.filterAll },
              { id: "major", label: t.filterMajor },
              { id: "vrat", label: t.filterVrat },
              { id: "jayanti", label: t.filterJayanti },
            ].map((tab) => {
              const active = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#fcd404] text-[#1c1304] shadow-xs border border-[#d9af00]"
                      : "bg-white text-[#6b5f4d] border border-stone-200 hover:border-amber-300 hover:bg-[#fffdf5]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Festival Cards Grid with Mobile Consistent Sacred Icon Medallions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((fest) => {
            const Icon = fest.icon;
            const name = fest.name[lang] || fest.name.en;
            const date = fest.date[lang] || fest.date.en;
            const tithi = fest.tithi[lang] || fest.tithi.en;
            const desc = fest.desc[lang] || fest.desc.en;
            const badge = fest.badge[lang] || fest.badge.en;

            return (
              <div
                key={fest.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-stone-200 bg-white p-5 shadow-[0_6px_20px_-10px_rgba(26,18,8,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-[0_12px_28px_-10px_rgba(245,158,11,0.18)]"
              >
                <div>
                  {/* Top Header: Mobile App Consistent Medallion, Title & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Sacred Icon Medallion */}
                      <div
                        className={`flex size-11 items-center justify-center rounded-xl border shadow-2xs group-hover:scale-105 transition-transform ${fest.iconBg}`}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold tracking-tight text-[#1a1208] group-hover:text-amber-900 transition-colors line-clamp-1">
                          {name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#8b7d63]">
                          <CalendarDays className="size-3 text-[#d97706]" />
                          <span>{date}</span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full border border-amber-300/60 bg-[#fff8db] px-2.5 py-0.5 text-[11px] font-bold text-[#8b5e0a]">
                      {badge}
                    </span>
                  </div>

                  {/* Tithi Row matching mobile app */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold text-amber-900/80">
                    <Moon className="size-3.5 text-[#d97706]" />
                    <span>{tithi}</span>
                  </div>

                  {/* Description */}
                  <p className="mt-2 text-xs text-[#6b5f4d] leading-relaxed line-clamp-3">
                    {desc}
                  </p>
                </div>

                {/* Card Footer matching mobile & home section */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[#8b6a1a]">
                    {lang === "bn" ? "পবিত্র তিথি মহিমা" : lang === "hi" ? "पवित्र तिथि महात्म्य" : "Sacred Tithi Ritual"}
                  </span>
                  <Link
                    href="/daily-horoscope"
                    className="inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 transition-colors"
                  >
                    <span>{lang === "bn" ? "তিথি দেখুন" : lang === "hi" ? "तिथि देखें" : "View Tithi"}</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 rounded-[24px] border border-stone-200 bg-white">
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
        <section className="rounded-[24px] border border-stone-200 bg-white p-6 sm:p-8 shadow-[0_6px_20px_-10px_rgba(26,18,8,0.06)]">
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
        <section className="rounded-[24px] border border-amber-300 bg-gradient-to-r from-[#fffbeb] to-[#fff7d1] p-6 sm:p-8 shadow-[0_8px_24px_-10px_rgba(240,200,50,0.25)]">
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
            className="inline-flex items-center gap-2 rounded-full bg-[#fcd404] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#1c1304] shadow-sm transition-all hover:bg-amber-400"
          >
            {t.livePanchangCta}
            <ArrowRight className="size-4" />
          </Link>
        </section>

        {/* Consult CTA */}
        <section className="rounded-[24px] border border-stone-200 bg-white p-6 sm:p-8 shadow-[0_4px_14px_-6px_rgba(26,18,8,0.04)] text-center">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#1a1208] mb-2">
            {t.consultTitle}
          </h2>
          <p className="text-sm text-[#6b5f4d] max-w-lg mx-auto mb-5">
            {t.consultSub}
          </p>
          <Link
            href="/astrologers"
            className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50/70 px-6 py-2.5 text-xs sm:text-sm font-bold text-[#8b5e0a] shadow-xs transition-all hover:bg-amber-100"
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
