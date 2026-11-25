"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  BookOpen,
  Calendar,
  Sun,
  Moon,
  Info,
  CheckCircle2,
  ChevronRight,
  Compass,
  Sunrise,
  Sunset,
  Zap,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { useLanguage } from "@/providers/language-provider";
import {
  AbhijitSunVictoryClipart,
  GrihaKalashClipart,
  NamakaranBabyClipart,
  ShubhKaalShieldClipart,
  SuvarnaGoldClipart,
  VehicleChariotClipart,
  VidyaSaraswatiClipart,
  VivahKnotClipart,
  VyaparLakshmiClipart,
  YatraDishaClipart,
} from "@/components/astro/muhurat-cliparts";
import { DAY_CHOGHADIYA, getPanchangKaalTimes } from "@/lib/muhurat-helper";
import {
  astrologyApi,
  type MuhuratData,
  type MuhuratChoghadiyaSlotData,
  type MuhuratHoraSlotData,
  type MuhuratMilestoneItemData,
} from "@/lib/api";

type FilterCategory = "all" | "milestone" | "wealth" | "wisdom";
type SubViewTab = "milestones" | "choghadiya" | "horas";

interface MuhuratCategory {
  id: string;
  category: "milestone" | "wealth" | "wisdom";
  clipart: React.ComponentType<{ size?: number; color?: string; secondaryColor?: string; className?: string }>;
  accentColor: string;
  name: Record<string, string>;
  deckTitle: Record<string, string>;
  tagline: Record<string, string>;
  desc: Record<string, string>;
  shloka: string;
  shlokaMeaning: Record<string, string>;
  bestNakshatras: string;
  bestTithis: string;
  bestVara: string;
  bestChoghadiya: string;
  caution: string;
  scriptureRef: string;
}

const MUHURATS: MuhuratCategory[] = [
  {
    id: "vivah",
    category: "milestone",
    clipart: VivahKnotClipart,
    accentColor: "#F43F5E",
    name: {
      en: "Marriage (Vivah)",
      bn: "শুভ বিবাহ মুহূর্ত",
      hi: "शुभ विवाह मुहूर्त",
    },
    deckTitle: {
      en: "Marriage (Vivah)",
      bn: "শুভ বিবাহ",
      hi: "शुभ विवाह",
    },
    tagline: {
      en: "Sacred bond of seven vows under divine celestial witness",
      bn: "সপ্তপদী ও অগ্নিসাক্ষী রেখে আজীবন সৌহার্দ্য বন্ধন",
      hi: "अग्नि साक्षी एवं सप्तपदी द्वारा आजीवन पावन परिणय सूत्र",
    },
    desc: {
      en: "Optimal planetary alignments ensuring everlasting marital fidelity, prosperity, and family harmony.",
      bn: "আজীবন দাম্পত্য সুখ, সৌহার্দ্য ও বংশবৃদ্ধির জন্য শাস্ত্রীয় গ্রহ-নক্ষত্র ও লগ্ন বিচার।",
      hi: "सुखी दांपत्य जीवन, वंश वृद्धि और पारिवारिक सौहार्द हेतु सर्वश्रेष्ठ लग्न व ग्रह स्थिति।",
    },
    shloka: "॥ धर्मे च अर्थे च कामे च नातिचरामि ॥",
    shlokaMeaning: {
      en: "“In righteous duty, prosperity, and love, I shall remain devoted forever.”",
      bn: "“ধর্ম, অর্থ ও কামে আমি আজীবন তোমার প্রতি নিষ্ঠাবান থাকিব।”",
      hi: "“धर्म, अर्थ और काम में मैं सदैव तुम्हारा साथ निभाऊँगा।”",
    },
    bestNakshatras: "Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, Revati",
    bestTithis: "Shukla Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi",
    bestVara: "Monday (Chandra), Wednesday (Budha), Thursday (Guru), Friday (Shukra)",
    bestChoghadiya: "Amrit, Shubh, Labh (Day & Godhuli Kaal)",
    caution: "Strictly avoid combustion of Jupiter (Guru Astha) or Venus (Shukra Astha), Bhadra Vishti Karana, Chaturmasya, and solar/lunar eclipses.",
    scriptureRef: "Muhurat Chintamani · Vivah Prakarana (Sl. 12-24)",
  },
  {
    id: "griha",
    category: "milestone",
    clipart: GrihaKalashClipart,
    accentColor: "#D97706",
    name: {
      en: "Griha Pravesh",
      bn: "গৃহপ্রবেশ মুহূর্ত",
      hi: "गृह प्रवेश मुहूर्त",
    },
    deckTitle: {
      en: "Griha Pravesh",
      bn: "গৃহপ্রবেশ",
      hi: "गृह प्रवेश",
    },
    tagline: {
      en: "Consecrating home soil with Mangal Kalash & Vastu Purusha blessings",
      bn: "মঙ্গল কলশ স্থাপন ও বাস্তু পুরুষের আশীর্বাদে শান্তি লাভ",
      hi: "मंगल कलश एवं वास्तु पुरुष कृपा से सुख-समृद्धि वास",
    },
    desc: {
      en: "Auspicious solar transitions (Uttarayana preferred) for new dwelling entry to ensure generational peace and immunity from negative energies.",
      bn: "নতুন বাস্তুতে পরিবারের সুখ, শান্তি ও ধনবৃদ্ধির জন্য শাস্ত্রীয় গৃহপ্রবেশ লগ্ন।",
      hi: "नए घर में वास करने पर वंश वृद्धि, सकारात्मक ऊर्जा और धन प्रवाह सुनिश्चित करने हेतु।",
    },
    shloka: "॥ ॐ वास्तुपुरुषाय नमः सर्वविघ्नविनाशाय सर्वसौख्यप्रदायिने ॥",
    shlokaMeaning: {
      en: "“Salutations to Vastu Purusha, remover of all obstacles and bestowal of supreme felicity.”",
      bn: "“বাস্তু পুরুষকে প্রণাম, যিনি সর্ব বিঘ্ন হরণকারী এবং সর্ব সৌখ্য প্রদানকারী।”",
      hi: "“वास्तु पुरुष को प्रणाम, जो समस्त विघ्नों के नाशक और परम सुख के प्रदाता हैं।”",
    },
    bestNakshatras: "Rohini, Mrigashira, Pushya, Uttara Phalguni, Hasta, Chitra, Anuradha, Uttara Ashadha, Uttara Bhadrapada, Revati",
    bestTithis: "Shukla Paksha Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi",
    bestVara: "Monday, Wednesday, Thursday, Friday",
    bestChoghadiya: "Amrit, Shubh, Labh (Morning to Midday)",
    caution: "Avoid Tuesday, Sunday, Amavasya, Rikta Tithis (4th, 9th, 14th), and moving in when the female head is in advanced pregnancy.",
    scriptureRef: "Brihat Samhita · Vastu Vidya (Adhyaya 53)",
  },
  {
    id: "vehicle",
    category: "wealth",
    clipart: VehicleChariotClipart,
    accentColor: "#0284C7",
    name: {
      en: "Vehicle Purchase (Vahan)",
      bn: "যানবাহন ক্রয় মুহূর্ত",
      hi: "वाहन क्रय मुहूर्त",
    },
    deckTitle: {
      en: "Vehicle (Vahan)",
      bn: "যানবাহন ক্রয়",
      hi: "वाहन क्रय",
    },
    tagline: {
      en: "Protection on every journey under the chariot wheel of Surya",
      bn: "পথের সুরক্ষায় ও নিরাপদ যাত্রায় নতুন গাড়ি ক্রয়ের ক্ষণ",
      hi: "मार्ग रक्षा एवं दुर्घटना मुक्त यात्रा हेतु शुभ वाहन मुहूर्त",
    },
    desc: {
      en: "Fortunate planetary periods for purchasing, taking delivery, and inaugural drives to safeguard against road perils.",
      bn: "নিরাপদ ভ্রমণ, দীর্ঘস্থায়িত্ব ও দুর্ঘটনা রোধের উদ্দেশ্যে নতুন যান ক্রয়ের সঠিক ক্ষণ।",
      hi: "सुरक्षित यात्रा, दीर्घायु और सुखद सफर सुनिश्चित करने के लिए वाहन डिलीवरी का समय।",
    },
    shloka: "॥ भद्रं कर्णेभिः शृणुयाम देवा भद्रं पश्येमाक्षभिर्यजत्राः ॥",
    shlokaMeaning: {
      en: "“May we hear and behold only what is auspicious through every turn of our journey.”",
      bn: "“আমাদের পথের প্রতিটি পদক্ষেপে শুভ ও কল্যাণ বর্ষিত হোক।”",
      hi: "“हमारी हर यात्रा में शुभता, सुरक्षा एवं मंगलमय दर्शन प्राप्त हों।”",
    },
    bestNakshatras: "Ashwini, Rohini, Punarvasu, Pushya, Hasta, Swati, Shravana, Dhanishta, Shatabhisha",
    bestTithis: "Pratipada, Tritiya, Panchami, Shashthi, Dashami, Ekadashi, Purnima",
    bestVara: "Wednesday, Thursday, Friday, Sunday (Surya Day)",
    bestChoghadiya: "Amrit, Shubh, Char (Moving energy)",
    caution: "Avoid taking delivery during Rahu Kaal, Yamaghanta, Saturdays, and Tuesdays for private passenger cars.",
    scriptureRef: "Muhurat Ganapati · Vahan Prakarana",
  },
  {
    id: "business",
    category: "wealth",
    clipart: VyaparLakshmiClipart,
    accentColor: "#059669",
    name: {
      en: "Business Start (Vyapar)",
      bn: "ব্যবসা ও বাণিজ্য আরম্ভ",
      hi: "व्यापार एवं प्रतिष्ठान आरम्भ",
    },
    deckTitle: {
      en: "Business (Vyapar)",
      bn: "ব্যবসা আরম্ভ",
      hi: "व्यापार आरम्भ",
    },
    tagline: {
      en: "Invoking Mahalakshmi & Kuber for thriving commerce and profit",
      bn: "মা লক্ষ্মী ও কুবেরের কৃপায় লাভজনক বাণিজ্যের সূচনা",
      hi: "महालक्ष्मी व कुबेर कृपा से धन-धान्य एवं व्यापार वृद्धि",
    },
    desc: {
      en: "Optimal celestial configurations for opening commercial shops, signing contracts, incorporating startups, and ledger opening.",
      bn: "নতুন দোকান, স্টার্টআপ বা বাণিজ্যিক চুক্তির মাধ্যমে নিরবচ্ছিন্ন ধনপ্রাপ্তির যোগ।",
      hi: "दुकान उद्घाटन, नई फर्म स्थापना या बड़े व्यावसायिक अनुबंध हस्ताक्षर का श्रेष्ठ समय।",
    },
    shloka: "॥ ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्यं नाशय नाशय ॥",
    shlokaMeaning: {
      en: "“O Divine Empress Lakshmi of the three realms, dissipate all lack and grant enduring prosperity.”",
      bn: "“হে ত্রিভুবন জননী মহালক্ষ্মী, আমাদের সর্বপ্রকার দারিদ্র্য বিনাশ করিয়া চিরসমৃদ্ধি প্রদান করুন।”",
      hi: "“हे त्रिभुवन व्यापिनी महालक्ष्मी, हमारे समस्त अभावों का नाश कर अक्षय धन वैभव प्रदान करें।”",
    },
    bestNakshatras: "Ashwini, Rohini, Pushya, Uttara Phalguni, Hasta, Chitra, Anuradha, Revati",
    bestTithis: "Shukla Pratipada, Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi",
    bestVara: "Wednesday (Budha - Commerce Lord), Thursday (Guru - Fortune), Friday (Shukra - Wealth)",
    bestChoghadiya: "Labh (Profit), Amrit (Permanence), Shubh (Growth)",
    caution: "Never begin under Rikta Tithis (4th, 9th, 14th) or during combust Mercury (Budha Astha).",
    scriptureRef: "Muhurta Chintamani · Vyapar Prakarana",
  },
  {
    id: "gold",
    category: "wealth",
    clipart: SuvarnaGoldClipart,
    accentColor: "#EAB308",
    name: {
      en: "Gold & Jewellery (Suvarna)",
      bn: "স্বর্ণ ও রত্ন ক্রয় মুহূর্ত",
      hi: "स्वर्ण एवं आभूषण क्रय",
    },
    deckTitle: {
      en: "Gold & Jewels",
      bn: "স্বর্ণ ক্রয়",
      hi: "स्वर्ण क्रय",
    },
    tagline: {
      en: "Preserving Lakshmi in pure yellow metal under Pushya & Ravi Yoga",
      bn: "পবিত্র পুখ্য নক্ষত্র ও রবিযোগে লক্ষ্মী স্বরূপ স্বর্ণ সঞ্চয়",
      hi: "पुष्य नक्षत्र व रवि योग में अक्षय लक्ष्मी स्वरूप स्वर्ण अर्जन",
    },
    desc: {
      en: "Fortuitous muhurats for buying bullion, ornamental jewellery, and consecrated gemstones for wealth multiplication.",
      bn: "ধাতব সম্পদ বৃদ্ধি এবং জ্যোতিষীয় রত্ন ধারণের জন্য সর্বশ্রেষ্ঠ পুণ্য সময়।",
      hi: "सोने-चांदी के सिक्के, जेवर अथवा ज्योतिषी रत्नों की खरीद हेतु परम कल्याणकारी मुहूर्त।",
    },
    shloka: "॥ ॐ हिरण्यगर्भाय नमः हिरण्यवर्णायै देव्यै नमस्तुते ॥",
    shlokaMeaning: {
      en: "“Salutations to the golden primordial source and the golden-complexioned Divine Mother.”",
      bn: "“হিরণ্যগর্ভ ও সুবর্ণবর্ণা দেবী মহালক্ষ্মীকে শত কোটি প্রণাম।”",
      hi: "“सुवर्ण स्वरूप हिरण्यगर्भ एवं सुवर्णमयी भगवती को बारंबार नमन।”",
    },
    bestNakshatras: "Pushya (Supreme for Gold), Rohini, Hasta, Swati, Anuradha, Shravana, Shatabhisha",
    bestTithis: "Dvitiya, Tritiya, Panchami, Saptami, Dashami, Ekadashi, Trayodashi, Purnima",
    bestVara: "Thursday (Guru - Ruler of Gold), Sunday (Surya), Friday",
    bestChoghadiya: "Amrit, Shubh, Labh",
    caution: "Avoid purchase during Bhadra and solar eclipses; consecrated gemstone rings should be set in daylight hours.",
    scriptureRef: "Skanda Purana · Suvarna Mahatmya",
  },
  {
    id: "education",
    category: "wisdom",
    clipart: VidyaSaraswatiClipart,
    accentColor: "#6366F1",
    name: {
      en: "Education & Vidya (Akshararambha)",
      bn: "বিদ্যারম্ভ ও দীক্ষা",
      hi: "विद्यारम्भ एवं शिक्षा",
    },
    deckTitle: {
      en: "Education (Vidya)",
      bn: "বিদ্যারম্ভ",
      hi: "विद्यारम्भ",
    },
    tagline: {
      en: "Invoking Devi Saraswati for wisdom, sharpness of intellect, and rhetoric",
      bn: "দেবী সরস্বতীর চরণে জ্ঞান, বাগ্মিতা ও একাগ্রতা অর্জনের পবিত্র ক্ষণ",
      hi: "माँ सरस्वती के पावन सानिध्य में ज्ञानार्जन व एकाग्रता का शुभारंभ",
    },
    desc: {
      en: "Golden hours for enrolling in universities, starting new courses, competitive exam prep, and Vedic initiation.",
      bn: "নতুন শিক্ষাবর্ষ, উচ্চশিক্ষা, গবেষণাপত্র প্রকাশ ও আধ্যাত্মিক দীক্ষার জন্য প্রশস্ত।",
      hi: "नवीन पाठ्यक्रम, उच्च शिक्षा, कोचिंग प्रवेश एवं परीक्षा की तैयारी हेतु शुभ मुहूर्त।",
    },
    shloka: "॥ सरस्वति नमस्तुभ्यं वरदे कामरूपिणि विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥",
    shlokaMeaning: {
      en: "“O Goddess Saraswati, granter of boons, I begin my studies; may I always achieve success.”",
      bn: "“হে বরদায়িনী দেবী সরস্বতী, আমি বিদ্যাচর্চা আরম্ভ করিতেছি; আমার সর্বদা সাফল্য হউক।”",
      hi: "“हे वरदायिनी माँ सरस्वती, मैं विद्या आरम्भ कर रहा हूँ; मुझे सदा सफलता प्राप्त हो।”",
    },
    bestNakshatras: "Ashwini, Rohini, Mrigashira, Punarvasu, Pushya, Hasta, Chitra, Swati, Anuradha, Shravana, Dhanishta, Shatabhisha, Revati",
    bestTithis: "Shukla Dvitiya, Tritiya, Panchami (Vasant Panchami), Dashami, Ekadashi, Trayodashi",
    bestVara: "Wednesday (Budha - Intellect), Thursday (Guru - Wisdom), Sunday",
    bestChoghadiya: "Labh (Absorption), Amrit (Permanence), Shubh (Wisdom)",
    caution: "Avoid Amavasya, Ashtami, and combust Jupiter/Mercury.",
    scriptureRef: "Brihat Jyotisha · Vidya Prakarana",
  },
  {
    id: "yatra",
    category: "wisdom",
    clipart: YatraDishaClipart,
    accentColor: "#14B8A6",
    name: {
      en: "Travel & Expedition (Yatra)",
      bn: "যাত্রা ও ভ্রমণ মুহূর্ত",
      hi: "यात्रा एवं गमन मुहूर्त",
    },
    deckTitle: {
      en: "Travel (Yatra)",
      bn: "যাত্রা আরম্ভ",
      hi: "यात्रा आरम्भ",
    },
    tagline: {
      en: "Harmonizing planetary hora and Disha Shoola for effortless triumph",
      bn: "দিকশূল বর্জন ও গ্রহের অনুকূলতায় কার্য সিদ্ধির নিরাপদ পথচলা",
      hi: "दिशाशूल परिहार पूर्वक सुरक्षित व सफल यात्रा का पावन योग",
    },
    desc: {
      en: "Vedic criteria to avoid directional affliction (Disha Shoola) and travel in harmony with the ruling planetary hora for triumphs.",
      bn: "দূরপাল্লার সফর, বিদেশে চাকরি বা তীর্থযাত্রার প্রাক্কালে শুভ ক্ষণ ও দিক নির্ণয়।",
      hi: "तीर्थ यात्रा, विदेश गमन अथवा महत्वपूर्ण व्यापारिक यात्रा हेतु सर्वोत्तम समय।",
    },
    shloka: "॥ यात्राकाले शुभाः सर्वे ग्रहाः सन्तु प्रसन्नाः सुखदाः शिवाः ॥",
    shlokaMeaning: {
      en: "“May all nine planets be peaceful, gentle, and auspicious during my expedition.”",
      bn: "“যাত্রাকালে নবগ্রহ প্রসন্ন হয়ে পথকে নির্বিঘ্ন ও সুখদায়ক করুক।”",
      hi: "“यात्रा काल में सभी ग्रह शुभ, शांत एवं कल्याणकारी फल प्रदान करें।”",
    },
    bestNakshatras: "Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Anuradha, Shravana, Dhanishta, Revati",
    bestTithis: "Shukla Dvitiya, Tritiya, Panchami, Saptami, Dashami, Trayodashi",
    bestVara: "Wednesday, Thursday, Friday (Avoid Friday for West travel, Sunday/Friday for South)",
    bestChoghadiya: "Char (Motion), Labh (Gain), Amrit (Protection)",
    caution: "Never embark toward a direction burdened by active Disha Shoola without scriptural remedy, nor during Rahu Kaal.",
    scriptureRef: "Brihat Samhita · Yatra Adhyaya",
  },
  {
    id: "namakaran",
    category: "milestone",
    clipart: NamakaranBabyClipart,
    accentColor: "#A855F7",
    name: {
      en: "Namakaran Sanskar",
      bn: "নামকরণ সংস্কার",
      hi: "नामकरण संस्कार",
    },
    deckTitle: {
      en: "Namakaran",
      bn: "নামকরণ",
      hi: "नामकरण",
    },
    tagline: {
      en: "Imbuing the newborn with their Nakshatra syllable and lifelong fortune",
      bn: "নবজাতকের জন্ম নক্ষত্র অনুযায়ী শুভ নাম ও পরমায়ু প্রার্থনা",
      hi: "शिशु के जन्म नक्षत्र व चंद्र राशि के अनुसार सौभाग्यशाली नामकरण",
    },
    desc: {
      en: "Sacred Vedic sacrament held on the 10th, 11th, 12th, or 16th day after birth to invoke longevity, intellect, and stellar fortune.",
      bn: "শিশুর দীর্ঘায়ু, যশ ও সৌভাগ্য বৃদ্ধির উদ্দেশ্যে শাস্ত্রীয় নিয়মে শুভ নাম প্রদান।",
      hi: "नवजात शिशु के दीर्घायु, यश और तेज की वृद्धि हेतु वैदिक नामकरण का पावन समय।",
    },
    shloka: "॥ आयुष्यं वर्चस्वं पुष्टिं यशः कीर्तिं च वर्धताम् ॥",
    shlokaMeaning: {
      en: "“May this child flourish with long life, spiritual radiance, strength, and honorable fame.”",
      bn: "“এই শিশু পরমায়ু, প্রজ্ঞা, শারীরিক পুষ্টি ও নির্মল যশ লাভ করুক।”",
      hi: "“यह शिशु दीर्घायु, आध्यात्मिक तेज, बल और उच्च कीर्ति प्राप्त करे।”",
    },
    bestNakshatras: "Rohini, Uttara Phalguni, Uttara Ashadha, Uttara Bhadrapada, Hasta, Chitra, Anuradha, Revati",
    bestTithis: "Shukla Dvitiya, Tritiya, Panchami, Saptami, Dashami, Trayodashi",
    bestVara: "Monday, Wednesday, Thursday, Friday",
    bestChoghadiya: "Amrit, Shubh",
    caution: "Avoid Amavasya, Rikta Tithis (4th, 9th, 14th), and Janma Nakshatra if unafflicted options are available.",
    scriptureRef: "Parashara Grihya Sutra · Namakaran Vidhana",
  },
];

export default function MuhuratPage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as "en" | "bn" | "hi";

  const [activeCategory, setActiveCategory] = React.useState<FilterCategory>("all");
  const [activeSubView, setActiveSubView] = React.useState<SubViewTab>("milestones");
  const [choghadiyaPeriod, setChoghadiyaPeriod] = React.useState<"day" | "night">("day");

  // Fallback calculation in case of network latency
  const fallbackKaal = React.useMemo(() => {
    return getPanchangKaalTimes(new Date());
  }, []);

  // Live Swiss Ephemeris Backend Query
  const { data: apiData, isLoading: isMuhuratLoading } = useQuery<MuhuratData>({
    queryKey: ["vedic-muhurat-data", lang],
    queryFn: () => astrologyApi.getMuhurat({ language: lang }),
    staleTime: 5 * 60_000,
  });

  // Resolved core timings
  const abhijitFormatted = apiData?.abhijit?.formatted || fallbackKaal.abhijit.formatted;
  const rahuFormatted = apiData?.rahu_kaal?.formatted || fallbackKaal.rahuKaal.formatted;
  const gulikaFormatted = apiData?.gulika_kaal?.formatted || fallbackKaal.gulika.formatted;
  const yamaFormatted = apiData?.yamaganda?.formatted || fallbackKaal.yamaghanta.formatted;
  const brahmaFormatted = apiData?.brahma_muhurat?.formatted || "04:20 AM – 05:08 AM";
  const vijayaFormatted = apiData?.vijaya_muhurat?.formatted || "01:50 PM – 02:35 PM";
  const godhuliFormatted = apiData?.godhuli_muhurat?.formatted || "05:15 PM – 05:45 PM";

  const filteredMuhurats = React.useMemo(() => {
    if (activeCategory === "all") return MUHURATS;
    return MUHURATS.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  const choghadiyasList = React.useMemo(() => {
    if (!apiData?.choghadiyas) return [];
    return apiData.choghadiyas.filter((c: MuhuratChoghadiyaSlotData) => c.period_type === choghadiyaPeriod);
  }, [apiData, choghadiyaPeriod]);

  const t = {
    badge: lang === "bn" ? "সুইস এফিমেরিস দ্বারা গণিত বৈদিক শুভ মুহূর্ত" : lang === "hi" ? "स्विस एफेमेरिस आधारित वैदिक शुभ मुहूर्त" : "Vedic Muhurat & Swiss Ephemeris Astrometry",
    title: lang === "bn" ? "পবিত্র বৈদিক মুহূর্ত ও কালচক্র" : lang === "hi" ? "पावन वैदिक मुहूर्त एवं कालचक्र" : "Vedic Sacred Muhurat & Timings",
    subtitle:
      lang === "bn"
        ? "মহর্ষি পরাশর ও বরাহমিহিরের জ্যোতিষ শাস্ত্রীয় বিধি অনুসারে প্রতিটি শুভ সংস্কারের সঠিক লগ্ন, নক্ষত্র, তিথি এবং বিজয় মুহূর্ত।"
        : lang === "hi"
        ? "महर्षि पराशर व वराहमिहिर के ज्योतिष शास्त्र अनुसार प्रत्येक शुभ संस्कार का सटीक लग्न, नक्षत्र, तिथि एवं विजय मुहूर्त।"
        : "Ancient Vedic canons derived from Brihat Samhita & Muhurta Chintamani to identify planetary alignments for milestone ventures.",
    todayKaalTitle: lang === "bn" ? "আজকের মুখ্য সময় ও কাল চক্র (Swiss Ephemeris)" : lang === "hi" ? "आज के मुख्य समय एवं काल चक्र (Swiss Ephemeris)" : "Today's Core Kaal Windows (Swiss Ephemeris)",
    abhijitLabel: lang === "bn" ? "অভিজিৎ মুহূর্ত (বিজয় ক্ষণ)" : lang === "hi" ? "अभिजित मुहूर्त (विजय काल)" : "Abhijit Muhurat (Victory Hour)",
    abhijitDesc:
      lang === "bn"
        ? "দিনের অপরাজেয় ক্ষণ — যে কোনো জরুরি শুভ কর্ম নিষ্পত্তির শ্রেষ্ঠ সময়।"
        : lang === "hi"
        ? "दिन का सबसे शक्तिशाली समय — किसी भी महत्वपूर्ण शुभ कार्य हेतु सर्वश्रेष्ठ।"
        : "Midday victory hour capable of dissipating a myriad of minor astrological flaws.",
    rahuLabel: lang === "bn" ? "রাহুকাল (বর্জনীয় সময়)" : lang === "hi" ? "राहुकाल (वर्जित समय)" : "Rahu Kaal (Inauspicious)",
    rahuDesc:
      lang === "bn"
        ? "রাহুর তীব্র দৃষ্টির সময় — যে কোনো নতুন চুক্তি, যাত্রা ও ক্রয় বর্জন করুন।"
        : lang === "hi"
        ? "राहु की कुदृष्टि का समय — कोई भी नया अनुबंध, खरीद या यात्रा टालें।"
        : "Afflicted shadow window — strictly postpone initial transactions and new contracts.",
    gulikaLabel: lang === "bn" ? "গুলিকা কাল" : lang === "hi" ? "गुलिक काल" : "Gulika Kaal",
    yamaghantaLabel: lang === "bn" ? "যমঘণ্ট কাল" : lang === "hi" ? "यमघण्ट काल" : "Yamaghanta Kaal",
    brahmaLabel: lang === "bn" ? "ব্রহ্ম মুহূর্ত" : lang === "hi" ? "ब्रह्म मुहूर्त" : "Brahma Muhurat",
    vijayaLabel: lang === "bn" ? "বিজয় মুহূর্ত" : lang === "hi" ? "विजय मुहूर्त" : "Vijaya Muhurat",
    godhuliLabel: lang === "bn" ? "গোধূলি মুহূর্ত" : lang === "hi" ? "गोधूलि मुहूर्त" : "Godhuli Muhurat",
    categories: {
      all: lang === "bn" ? "সকল মুহূর্ত" : lang === "hi" ? "सभी मुहूर्त" : "All Muhurats",
      milestone: lang === "bn" ? "জীবন সংস্কার" : lang === "hi" ? "जीवन संस्कार" : "Milestones",
      wealth: lang === "bn" ? "অর্থ ও বাণিজ্য" : lang === "hi" ? "धन व व्यापार" : "Wealth & Commerce",
      wisdom: lang === "bn" ? "জ্ঞান ও যাত্রা" : lang === "hi" ? "विद्या व यात्रा" : "Wisdom & Travel",
    },
    nakshatraTitle: lang === "bn" ? "শুভ নক্ষত্র:" : lang === "hi" ? "शुभ नक्षत्र:" : "Best Nakshatras:",
    tithiTitle: lang === "bn" ? "অনুকূল তিথি:" : lang === "hi" ? "अनुकूल तिथि:" : "Favorable Tithis:",
    varaTitle: lang === "bn" ? "অনুকূল বার:" : lang === "hi" ? "अनुकूल वार:" : "Best Weekday:",
    choghadiyaTitle: lang === "bn" ? "শুভ চোগড়িয়া:" : lang === "hi" ? "शुभ चौघड़िया:" : "Best Choghadiya:",
    cautionTitle: lang === "bn" ? "শাস্ত্রীয় সতর্কতা:" : lang === "hi" ? "शास्त्रोक्त सावधानी:" : "Scriptural Caution:",
    consultPrompt:
      lang === "bn"
        ? "আপনার কুষ্ঠি অনুযায়ী ব্যক্তিগত মুহূর্ত বিচার করাতে চান?"
        : lang === "hi"
        ? "अपनी कुंडली अनुसार व्यक्तिगत मुहूर्त निकालना चाहते हैं?"
        : "Need a personalized Muhurat derived strictly from your birth chart?",
    consultBtn: lang === "bn" ? "জ্যোতিষীর সাথে পরামর্শ করুন" : lang === "hi" ? "ज्योतिषी से परामर्श लें" : "Talk to Verified Astrologer",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff8f3] via-[#fff8f3] to-[#fbf8f1] text-[#2a1e17] flex flex-col font-sans">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex-1 w-full space-y-12">
        {/* Hero Header with Ornate Abhijit Clipart */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-amber-100/60 p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
          <div className="mx-auto flex justify-center mb-4">
            <AbhijitSunVictoryClipart size={72} color="#d97706" secondaryColor="#fde68a" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 border border-amber-300">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="mt-3 font-cinzel text-3xl sm:text-5xl font-black text-amber-950 tracking-tight">
            {t.title}
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-[#6b5840]">
            {t.subtitle}
          </p>

          {/* Astronomical Ephemeris Solar Bar */}
          {apiData && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 bg-white/80 border border-amber-300/80 rounded-2xl px-5 py-2.5 shadow-xs text-xs">
              <span className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sunrise className="size-4 text-amber-600" />
                <span>সূর্যোদয়: {apiData.sunrise}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sun className="size-4 text-amber-600" />
                <span>মধ্যাহ্ন: {apiData.solar_noon}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="flex items-center gap-1.5 font-bold text-amber-900">
                <Sunset className="size-4 text-rose-600" />
                <span>সূর্যাস্ত: {apiData.sunset}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="font-semibold text-stone-600">
                দিনমান: {apiData.day_duration_hours}h
              </span>
            </div>
          )}

          {/* Today's Sacred Kaal Timings Dashboard */}
          <div className="mt-8 rounded-2xl border border-amber-200/90 bg-white/90 backdrop-blur-sm p-5 sm:p-6 shadow-sm">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center justify-center gap-2">
              <Clock className="size-4 text-amber-600" />
              <span>{t.todayKaalTitle}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Abhijit Card */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4 transition-all hover:shadow-md relative overflow-hidden">
                {apiData?.abhijit?.is_active && (
                  <span className="absolute top-2 right-2 flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                  </span>
                )}
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <ShubhKaalShieldClipart size={24} isAuspicious={true} />
                  <span>{t.abhijitLabel}</span>
                </div>
                <div className="mt-2 text-lg font-black text-emerald-950">
                  {abhijitFormatted}
                </div>
                <p className="mt-1 text-[11px] text-emerald-800/80 leading-snug">
                  {t.abhijitDesc}
                </p>
              </div>

              {/* Rahu Kaal Alert */}
              <div className="rounded-xl border border-rose-300 bg-rose-50/70 p-4 transition-all hover:shadow-md relative overflow-hidden">
                {apiData?.rahu_kaal?.is_active && (
                  <span className="absolute top-2 right-2 flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-rose-500"></span>
                  </span>
                )}
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <ShubhKaalShieldClipart size={24} isAuspicious={false} />
                  <span>{t.rahuLabel}</span>
                </div>
                <div className="mt-2 text-lg font-black text-rose-950">
                  {rahuFormatted}
                </div>
                <p className="mt-1 text-[11px] text-rose-800/80 leading-snug">
                  {t.rahuDesc}
                </p>
              </div>

              {/* Brahma Muhurat */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                  <Sparkles className="size-4 text-indigo-600" />
                  <span>{t.brahmaLabel}</span>
                </div>
                <div className="mt-2 text-lg font-black text-indigo-950">
                  {brahmaFormatted}
                </div>
                <p className="mt-1 text-[11px] text-indigo-800/80 leading-snug">
                  {lang === "bn" ? "ধ্যান, যোগ ও ঈশ্বর আরাধনার পরম পবিত্র ক্ষণ।" : "Sacred pre-dawn window for meditation & study."}
                </p>
              </div>

              {/* Gulika Kaal */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Sun className="size-4 text-amber-600" />
                  <span>{t.gulikaLabel}</span>
                </div>
                <div className="mt-2 text-lg font-black text-amber-950">
                  {gulikaFormatted}
                </div>
                <p className="mt-1 text-[11px] text-amber-800/80 leading-snug">
                  {lang === "bn" ? "স্থায়ী সম্পদ ক্রয়ের জন্য প্রশমিত শুভ।" : "Steady persistence energy window."}
                </p>
              </div>
            </div>

            {/* Extra Row: Yamaganda, Vijaya, Godhuli */}
            <div className="mt-4 pt-4 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-bold text-stone-700 block">{t.yamaghantaLabel}</span>
                <span className="text-sm font-black text-stone-900">{yamaFormatted}</span>
                <span className="text-[10px] text-stone-500 block">{lang === "bn" ? "নতুন কাজে বর্জনীয়" : "Avoid commencement"}</span>
              </div>
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200">
                <span className="text-[11px] font-bold text-amber-800 block">{t.vijayaLabel}</span>
                <span className="text-sm font-black text-amber-950">{vijayaFormatted}</span>
                <span className="text-[10px] text-amber-700 block">{lang === "bn" ? "মামলা ও চ্যালেঞ্জে বিজয়" : "Triumph & legal resolution"}</span>
              </div>
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 block">{t.godhuliLabel}</span>
                <span className="text-sm font-black text-rose-950">{godhuliFormatted}</span>
                <span className="text-[10px] text-rose-700 block">{lang === "bn" ? "সন্ধ্যা আরতি ও শুভ লগ্ন" : "Twilight sanctification"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* View Mode Switcher: Milestones | 16 Choghadiya | 24 Horas */}
        <section className="flex items-center justify-center gap-2 border-b border-amber-200 pb-4">
          <button
            type="button"
            onClick={() => setActiveSubView("milestones")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubView === "milestones"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-stone-700 border border-stone-200 hover:border-amber-400"
            }`}
          >
            {lang === "bn" ? "শুভ সংস্কার মুহূর্ত (৮টি ক্যানন)" : "Milestone Muhurats"}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView("choghadiya")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubView === "choghadiya"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-stone-700 border border-stone-200 hover:border-amber-400"
            }`}
          >
            {lang === "bn" ? "১৬ বৈদিক চোগড়িয়া চক্র" : "16 Choghadiya Cycle"}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView("horas")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubView === "horas"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-stone-700 border border-stone-200 hover:border-amber-400"
            }`}
          >
            {lang === "bn" ? "২৪ গ্রহের হোরা কাল" : "24 Planetary Horas"}
          </button>
        </section>

        {/* SUBVIEW 1: MILESTONES */}
        {activeSubView === "milestones" && (
          <>
            {/* Category Filter Tabs */}
            <section className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {(["all", "milestone", "wealth", "wisdom"] as FilterCategory[]).map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                      active
                        ? "bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105"
                        : "bg-white text-stone-700 border border-stone-200 hover:border-amber-400 hover:text-amber-800"
                    }`}
                  >
                    {t.categories[cat]}
                  </button>
                );
              })}
            </section>

            {/* 8 Ornate Vedic Muhurat Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {filteredMuhurats.map((m) => {
                const Clipart = m.clipart;
                const apiMilestone = apiData?.milestone_muhurats?.find((item: MuhuratMilestoneItemData) => item.id === m.id);
                const compat = apiMilestone?.today_compatibility || "Favorable";

                return (
                  <div
                    key={m.id}
                    className="group relative overflow-hidden rounded-3xl border border-amber-200/90 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-400 flex flex-col justify-between"
                  >
                    {/* Header Ribbon with Compatibility Badge */}
                    <div className="flex items-start gap-4">
                      <div
                        className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-inner group-hover:scale-105 transition-transform"
                        style={{ borderColor: `${m.accentColor}40` }}
                      >
                        <Clipart size={56} color={m.accentColor} secondaryColor="#d97706" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mb-1"
                            style={{ backgroundColor: `${m.accentColor}18`, color: m.accentColor }}
                          >
                            {m.deckTitle[lang]}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            compat === "Favorable"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-900 border border-amber-300"
                          }`}>
                            {compat === "Favorable" ? (lang === "bn" ? "আজ শুভ" : "Favorable Today") : (lang === "bn" ? "মধ্যম শুভ" : "Moderate")}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                          {m.name[lang]}
                        </h3>
                        <p className="text-xs font-medium text-amber-800/90 mt-0.5">
                          {m.tagline[lang]}
                        </p>
                      </div>
                    </div>

                    {/* Sanskrit Shloka Box */}
                    <div className="my-5 rounded-2xl border-l-4 bg-amber-50/70 p-4 border-amber-500 space-y-1.5">
                      <p className="font-serif text-sm font-bold text-amber-950 tracking-wide">
                        {m.shloka}
                      </p>
                      <p className="text-xs italic text-stone-700 leading-relaxed font-serif">
                        {m.shlokaMeaning[lang]}
                      </p>
                    </div>

                    {/* Classical Details Grid */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-stone-900 block mb-1">
                          {t.nakshatraTitle}
                        </span>
                        <p className="text-stone-700 leading-relaxed bg-stone-50 rounded-xl p-2.5 border border-stone-200/80 text-[11.5px]">
                          {m.bestNakshatras}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="bg-stone-50/80 rounded-xl p-2.5 border border-stone-200/70">
                          <span className="font-bold text-stone-800 text-[11px] block">{t.tithiTitle}</span>
                          <span className="text-[11px] text-stone-600">{m.bestTithis}</span>
                        </div>
                        <div className="bg-stone-50/80 rounded-xl p-2.5 border border-stone-200/70">
                          <span className="font-bold text-stone-800 text-[11px] block">{t.choghadiyaTitle}</span>
                          <span className="text-[11px] text-amber-800 font-semibold">{m.bestChoghadiya}</span>
                        </div>
                      </div>

                      {/* Caution Warning Box */}
                      <div className="rounded-xl border border-rose-200/80 bg-rose-50/60 p-3 flex items-start gap-2 text-rose-900">
                        <AlertTriangle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                        <div>
                          <span className="font-bold text-[11px] block">{t.cautionTitle}</span>
                          <p className="text-[11px] text-rose-800/90 leading-snug mt-0.5">
                            {m.caution}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer Scripture Citation & Action */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <div className="flex items-center gap-1.5 font-medium italic">
                        <BookOpen className="size-3 text-amber-600" />
                        <span>{m.scriptureRef}</span>
                      </div>

                      <Link
                        href="/astrologers"
                        className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-900 transition-colors"
                      >
                        <span>{lang === "bn" ? "পরামর্শ নিন" : lang === "hi" ? "परामर्श लें" : "Consult"}</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </section>
          </>
        )}

        {/* SUBVIEW 2: 16 CHOGHADIYA CYCLE */}
        {activeSubView === "choghadiya" && (
          <section className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setChoghadiyaPeriod("day")}
                className={`px-6 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  choghadiyaPeriod === "day"
                    ? "bg-amber-600 text-white shadow-md"
                    : "bg-white text-stone-700 border border-stone-300"
                }`}
              >
                <Sun className="size-4" />
                <span>{lang === "bn" ? "দিবা চোগড়িয়া (সূর্যোদয় থেকে সূর্যাস্ত)" : "Day Choghadiya (8 Slots)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setChoghadiyaPeriod("night")}
                className={`px-6 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  choghadiyaPeriod === "night"
                    ? "bg-indigo-900 text-white shadow-md"
                    : "bg-white text-stone-700 border border-stone-300"
                }`}
              >
                <Moon className="size-4" />
                <span>{lang === "bn" ? "রাত্রি চোগড়িয়া (সূর্যাস্ত থেকে সূর্যোদয়)" : "Night Choghadiya (8 Slots)"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {choghadiyasList.map((slot: MuhuratChoghadiyaSlotData) => {
                const isSuper = slot.quality === "super_auspicious" || slot.quality === "auspicious";
                const isAshubh = slot.quality === "inauspicious";

                return (
                  <div
                    key={slot.slot_index}
                    className={`rounded-2xl p-4 border transition-all relative ${
                      slot.is_active
                        ? "border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-400/40"
                        : isSuper
                        ? "border-emerald-200 bg-emerald-50/30"
                        : isAshubh
                        ? "border-rose-200 bg-rose-50/30"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    {slot.is_active && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                        {lang === "bn" ? "চলমান মুহূর্ত" : "ACTIVE NOW"}
                      </span>
                    )}

                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                      Slot #{slot.slot_index} · {slot.ruling_planet}
                    </span>

                    <h4 className="font-cinzel font-black text-lg text-stone-900 mt-1">
                      {slot.name_translations[lang] || slot.name}
                    </h4>

                    <div className="mt-2 text-xs font-mono font-bold text-stone-700 bg-white/80 rounded-lg p-1.5 border border-stone-200 inline-block">
                      {slot.start_time} – {slot.end_time}
                    </div>

                    <p className="mt-2 text-[11px] text-stone-600 leading-snug">
                      {slot.description[lang] || slot.description.en}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SUBVIEW 3: 24 PLANETARY HORAS */}
        {activeSubView === "horas" && (
          <section className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 text-center max-w-2xl mx-auto">
              {lang === "bn"
                ? "হোরা হলো প্রাচীন কালডিয়ান ক্রমে বিন্যস্ত গ্রহের ২৪ ঘণ্টার প্রভাববলয়। প্রতিটি নির্দিষ্ট শুভ কর্মের জন্য নির্দিষ্ট গ্রহের হোরা নির্বাচিত হয়।"
                : "Planetary Horas follow the ancient Chaldean celestial order, dividing the 24-hour cycle into 1-hour ruling planetary influences."}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(apiData?.horas || []).map((h: MuhuratHoraSlotData) => (
                <div
                  key={h.hora_index}
                  className={`rounded-2xl p-3 border transition-all text-center ${
                    h.is_active
                      ? "border-amber-500 bg-amber-100/80 shadow-md ring-2 ring-amber-400"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <span className="text-[10px] font-mono text-stone-500 block">
                    {h.start_time} – {h.end_time}
                  </span>
                  <span className="font-cinzel font-black text-base text-amber-950 mt-1 block">
                    {h.lord}
                  </span>
                  <span className="text-[9px] font-bold text-amber-800 block truncate">
                    {h.nature}
                  </span>
                  <p className="mt-1 text-[10px] text-stone-600 line-clamp-2">
                    {h.activities}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Astrologer Consultation CTA Banner */}
        <section className="rounded-3xl border-2 border-amber-300 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide text-amber-100 uppercase">
              {lang === "bn" ? "ব্যক্তিগত মুহূর্ত বিচার" : lang === "hi" ? "व्यक्तिगत मुहूर्त विचार" : "Personalized Muhurat"}
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.consultPrompt}
            </h2>
            <p className="text-sm text-amber-100 max-w-xl">
              {lang === "bn"
                ? "আমাদের যাচাইকৃত অভিজ্ঞ বৈদিক জ্যোতিষীদের সাথে লাইভ কল বা চ্যাটে কথা বলে আপনার জন্মলগ্নের সাথে নিখুঁত মুহূর্ত নির্ধারণ করুন।"
                : "Talk to verified senior Vedic astrologers over live call or chat to pinpoint the exact auspicious second tailored to your birth chart."}
            </p>
          </div>

          <Link
            href="/astrologers"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-extrabold text-amber-900 shadow-lg hover:bg-amber-50 hover:scale-105 transition-all cursor-pointer"
          >
            <span>{t.consultBtn}</span>
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
