import type { AstrologyLanguage } from "@/types";

export interface NavCategoryTranslation {
  label: string;
  dropdown?: {
    label: string;
    description: string;
    badge?: string;
  }[];
}

export const HEADER_NAV_TRANSLATIONS: Record<
  AstrologyLanguage,
  {
    categories: Record<string, NavCategoryTranslation>;
    actions: {
      signIn: string;
      consultNow: string;
      wallet: string;
      changeLanguage: string;
      notifications: string;
      live: string;
      instant: string;
    };
  }
> = {
  en: {
    categories: {
      Home: { label: "Home" },
      "Consult Now": {
        label: "Consult Now",
        dropdown: [
          {
            label: "Talk to Astrologers",
            description: "Connect instantly via call or chat with 500+ vetted astrologers",
            badge: "Instant",
          },
          {
            label: "Book Appointment",
            description: "Schedule deep-dive 1-on-1 private video consultations",
          },
          {
            label: "Astra Live Streams",
            description: "Free live interactive Q&A sessions with top experts",
          },
        ],
      },
      "Kundli & Horoscope": {
        label: "Kundli & Horoscope",
        dropdown: [
          {
            label: "Daily Horoscope",
            description: "Accurate planetary transits, Gochar & zodiac predictions",
            badge: "Daily",
          },
          {
            label: "Kundli (Janam Patrika)",
            description: "Vedic birth chart, D1/D9 charts & planetary positions",
            badge: "Free",
          },
          {
            label: "Kundli Matching",
            description: "Ashtakoot Milan & 36-point marriage compatibility check",
          },
          {
            label: "KP Astrology",
            description: "Krishnamurti Paddhati sub-lord & cusp calculations",
          },
          {
            label: "Dasha Calculator",
            description: "Vimshottari Dasha, Antardasha & Mahadasha timelines",
          },
        ],
      },
      "AI & Biometrics": {
        label: "AI & Biometrics",
        dropdown: [
          {
            label: "Palm Reading (Hastarekha)",
            description: "3D interactive palm analysis for life, heart & head lines",
            badge: "3D",
          },
          {
            label: "Face Reading (Samudrika)",
            description: "AI camera face scan for personality, wealth & fortune",
            badge: "AI Scan",
          },
          {
            label: "AI Astrologer",
            description: "Chat with an intelligent Vedic AI trained on classical texts",
          },
        ],
      },
      Panchang: { label: "Panchang" },
      Numerology: { label: "Numerology" },
      Vastu: { label: "Vastu" },
      Tarot: { label: "Tarot" },
      Calculators: {
        label: "Calculators",
        dropdown: [
          {
            label: "KP Calculator",
            description: "Accurate planetary cusps & stellar sub-lords",
          },
          {
            label: "Dasha Calculator",
            description: "Planetary period breakdown & current active dasha",
          },
          {
            label: "Nakshatra Calculator",
            description: "Determine your birth star, deity & ruling planet",
          },
          {
            label: "Rashi Calculator",
            description: "Calculate Moon sign and Sun sign instantly",
          },
        ],
      },
      "Free Readings": { label: "Free Readings" },
      "Astra Live": { label: "Astra Live" },
    },
    actions: {
      signIn: "Sign In",
      consultNow: "Consult Astrologer Now",
      wallet: "Wallet",
      changeLanguage: "Change Language",
      notifications: "Notifications",
      live: "Live",
      instant: "Instant",
    },
  },
  bn: {
    categories: {
      Home: { label: "হোম" },
      "Consult Now": {
        label: "পরামর্শ নিন",
        dropdown: [
          {
            label: "জ্যোতিষীর সাথে কথা বলুন",
            description: "৫০০+ অভিজ্ঞ ও ভেরিফাইড জ্যোতিষীর সাথে কল বা চ্যাটে সরাসরি যুক্ত হন",
            badge: "তাৎক্ষণিক",
          },
          {
            label: "অ্যাপয়েন্টমেন্ট বুক করুন",
            description: "ব্যক্তিগত ভিডিও কলে বিস্তারিত জ্যোতিষ আলোচনার জন্য সময় নির্ধারণ করুন",
          },
          {
            label: "অ্যাস্ট্রা লাইভ সেশন",
            description: "শীর্ষ জ্যোতিষীদের সাথে ফ্রি লাইভ প্রশ্নোত্তর পর্ব",
          },
        ],
      },
      "Kundli & Horoscope": {
        label: "কুণ্ডলী ও রাশিফল",
        dropdown: [
          {
            label: "দৈনিক রাশিফল",
            description: "নির্ভুল চন্দ্র গোচর, পঞ্চাঙ্গ ও ১২ রাশির শুভ-অশুভ পূর্বাভাস",
            badge: "দৈনিক",
          },
          {
            label: "জন্ম কুণ্ডলী (পত্রিকা)",
            description: "লগ্ন চার্ট, নবমাংশ, গ্রহের দশা ও বিশদ বৈদিক কুণ্ডলী তৈরি",
            badge: "ফ্রি",
          },
          {
            label: "যোটক বিচার (ম্যাচিং)",
            description: "অষ্টকূট মিলন, ৩৬ গুণ ও মাঙ্গলিক দোষের সম্পূর্ণ বিশ্লেষণ",
          },
          {
            label: "কেপি জ্যোতিষ",
            description: "কৃষ্ণমূর্তি পদ্ধতি, ভাব মধ্য এবং সাব-লর্ড ভিত্তিক বিশ্লেষণ",
          },
          {
            label: "দশা ক্যালকুলেটর",
            description: "বিংশোত্তরী মহাদশা, অন্তর্দশা ও প্রত্যন্তর্দশা সময়সীমা",
          },
        ],
      },
      "AI & Biometrics": {
        label: "এআই ও বায়োমেট্রিক্স",
        dropdown: [
          {
            label: "হস্তরেখা বিচার (৩ডি)",
            description: "আয়ুরেখা, হৃদয়রেখা ও মস্তিস্করেখার ৩ডি ভিজ্যুয়াল স্ক্যান",
            badge: "৩ডি",
          },
          {
            label: "মুখমণ্ডল বিচার (সামুদ্রিক)",
            description: "এআই ক্যামেরা ফেস স্ক্যান দ্বারা ব্যক্তিত্ব, ধন ও ভাগ্য বিশ্লেষণ",
            badge: "এআই স্ক্যান",
          },
          {
            label: "এআই জ্যোতিষী",
            description: "শাস্ত্রীয় বৈদিক গ্রন্থে প্রশিক্ষিত বুদ্ধিমান এআই-এর সাথে চ্যাট করুন",
          },
        ],
      },
      Panchang: { label: "পঞ্চাঙ্গ" },
      Numerology: { label: "সংখ্যাতত্ত্ব" },
      Vastu: { label: "বাস্তু শাস্ত্র" },
      Tarot: { label: "ট্যারোট" },
      Calculators: {
        label: "ক্যালকুলেটরসমূহ",
        dropdown: [
          {
            label: "কেপি ক্যালকুলেটর",
            description: "নির্ভুল ভাব আরম্ভ এবং গ্রহের নক্ষত্র-উপপতি নির্ণয়",
          },
          {
            label: "দশা ক্যালকুলেটর",
            description: "বর্তমান সক্রিয় দশা ও ভবিষ্যৎ সময়চক্রের হিসাব",
          },
          {
            label: "নক্ষত্র ক্যালকুলেটর",
            description: "জন্ম নক্ষত্র, পাদ, ইষ্টদেবতা ও বৃক্ষ নিরূপণ",
          },
          {
            label: "রাশি ক্যালকুলেটর",
            description: "চন্দ্র রাশি ও সূর্য রাশি এক ক্লিকেই গণনা করুন",
          },
        ],
      },
      "Free Readings": { label: "ফ্রি গণনা" },
      "Astra Live": { label: "অ্যাস্ট্রা লাইভ" },
    },
    actions: {
      signIn: "সাইন ইন",
      consultNow: "এখনই জ্যোতিষীর পরামর্শ নিন",
      wallet: "ওয়ালেট",
      changeLanguage: "ভাষা পরিবর্তন করুন",
      notifications: "বিজ্ঞপ্তি",
      live: "লাইভ",
      instant: "তাৎক্ষণিক",
    },
  },
  hi: {
    categories: {
      Home: { label: "होम" },
      "Consult Now": {
        label: "परामर्श लें",
        dropdown: [
          {
            label: "ज्योतिषी से बात करें",
            description: "500+ सत्यापित ज्योतिषियों से कॉल या चैट पर तुरंत जुड़ें",
            badge: "त्वरित",
          },
          {
            label: "अपॉइंटमेंट बुक करें",
            description: "निजी वीडियो परामर्श के लिए समय निर्धारित करें",
          },
          {
            label: "एस्ट्रा लाइव स्ट्रीम",
            description: "शीर्ष विशेषज्ञों के साथ निःशुल्क लाइव प्रश्नोत्तरी",
          },
        ],
      },
      "Kundli & Horoscope": {
        label: "कुंडली एवं राशिफल",
        dropdown: [
          {
            label: "दैनिक राशिफल",
            description: "सटीक ग्रह गोचर, पंचांग एवं 12 राशियों का फलादेश",
            badge: "दैनिक",
          },
          {
            label: "जन्म कुंडली",
            description: "लग्न चार्ट, नवमांश, ग्रह स्थिति एवं संपूर्ण वैदिक कुंडली",
            badge: "मुफ़्त",
          },
          {
            label: "कुंडली मिलान",
            description: "अष्टकूट मिलान, 36 गुण एवं मांगलिक दोष विश्लेषण",
          },
          {
            label: "केपी ज्योतिष",
            description: "कृष्णमूर्ति पद्धति कस्प एवं उप-स्वामी गणनाएं",
          },
          {
            label: "दशा कैलकुलेटर",
            description: "विंशोत्तरी महादशा, अंतर्दशा एवं प्रत्यंतर्दशा समयरेखा",
          },
        ],
      },
      "AI & Biometrics": {
        label: "एआई एवं बायोमेट्रिक्स",
        dropdown: [
          {
            label: "हस्तरेखा विश्लेषण (3D)",
            description: "जीवन, हृदय एवं मस्तिष्क रेखाओं का 3D विज़ुअल विश्लेषण",
            badge: "3D",
          },
          {
            label: "सामुद्रिक मुख लक्षण",
            description: "एआई कैमरा फेस स्कैन द्वारा व्यक्तित्व व भाग्य फलादेश",
            badge: "एआई स्कैन",
          },
          {
            label: "एआई ज्योतिषी",
            description: "वैदिक शास्त्रों पर प्रशिक्षित एआई से सीधे संवाद करें",
          },
        ],
      },
      Panchang: { label: "पंचांग" },
      Numerology: { label: "अंकशास्त्र" },
      Vastu: { label: "वास्तु शास्त्र" },
      Tarot: { label: "टैरो" },
      Calculators: {
        label: "कैलकुलेटर",
        dropdown: [
          {
            label: "केपी कैलकुलेटर",
            description: "सटीक भाव आरंभ एवं नक्षत्र उप-स्वामी",
          },
          {
            label: "दशा कैलकुलेटर",
            description: "सक्रिय दशा व भविष्य कालचक्र की गणना",
          },
          {
            label: "नक्षत्र कैलकुलेटर",
            description: "जन्म नक्षत्र, चरण, आराध्य देव व वृक्ष जानें",
          },
          {
            label: "राशि कैलकुलेटर",
            description: "चंद्र राशि एवं सूर्य राशि तुरंत जानें",
          },
        ],
      },
      "Free Readings": { label: "मुफ़्त फलादेश" },
      "Astra Live": { label: "एस्ट्रा लाइव" },
    },
    actions: {
      signIn: "लॉग इन",
      consultNow: "अभी ज्योतिषी से परामर्श करें",
      wallet: "वॉलेट",
      changeLanguage: "भाषा बदलें",
      notifications: "सूचनाएं",
      live: "लाइव",
      instant: "तुरंत",
    },
  },
};

export const RAIL_LINK_TRANSLATIONS: Record<
  AstrologyLanguage,
  Record<string, string>
> = {
  en: {
    "/ai-astrologer": "AI Astrologer",
    "/daily-horoscope": "Daily Horoscope",
    "/kundli": "Kundli",
    "/kundli-matching": "Kundli Matching",
    "/kp-calculator": "KP Astrology",
    "/dasha-calculator": "Dasha Calculator",
    "/rashi-calculator": "Rashi Calculator",
    "/nakshatra-calculator": "Nakshatra Calculator",
    "/numerology": "Numerology",
    "/vastu": "Vastu Shastra",
    "/tarot": "Tarot Reading",
    "/astrologers": "Astrologers",
    "/appointments": "Appointments",
    "/face-reading": "Face reading",
    "/palm-reading": "Palm reading",
    "/courses": "Gurukul Courses",
    "/shop": "Cosmic Shop",
    "/#services": "Services",
    "/#how-it-works": "How it works",
    myAccount: "My account & settings",
    wallet: "Wallet & recharge",
    signOut: "Sign out",
    signIn: "Sign in",
    getStarted: "Get started",
    language: "Language",
  },
  bn: {
    "/ai-astrologer": "এআই জ্যোতিষী",
    "/daily-horoscope": "দৈনিক রাশিফল",
    "/kundli": "জন্ম কুণ্ডলী",
    "/kundli-matching": "যোটক বিচার",
    "/kp-calculator": "কেপি জ্যোতিষ",
    "/dasha-calculator": "দশা ক্যালকুলেটর",
    "/rashi-calculator": "রাশি ক্যালকুলেটর",
    "/nakshatra-calculator": "নক্ষত্র ক্যালকুলেটর",
    "/numerology": "সংখ্যাতত্ত্ব",
    "/vastu": "বাস্তু শাস্ত্র",
    "/tarot": "ট্যারোট গণনা",
    "/astrologers": "জ্যোতিষীগণ",
    "/appointments": "অ্যাপয়েন্টমেন্ট",
    "/face-reading": "মুখমণ্ডল বিচার",
    "/palm-reading": "হস্তরেখা বিচার",
    "/courses": "গুরুকুল কোর্স",
    "/shop": "কসমিক শপ",
    "/#services": "সেবাসমূহ",
    "/#how-it-works": "কীভাবে কাজ করে",
    myAccount: "আমার অ্যাকাউন্ট ও সেটিংস",
    wallet: "ওয়ালেট ও রিচার্জ",
    signOut: "সাইন আউট",
    signIn: "সাইন ইন",
    getStarted: "শুরু করুন",
    language: "ভাষা নির্বাচন",
  },
  hi: {
    "/ai-astrologer": "एआई ज्योतिषी",
    "/daily-horoscope": "दैनिक राशिफल",
    "/kundli": "जन्म कुंडली",
    "/kundli-matching": "कुंडली मिलान",
    "/kp-calculator": "केपी ज्योतिष",
    "/dasha-calculator": "दशा कैलकुलेटर",
    "/rashi-calculator": "राशि कैलकुलेटर",
    "/nakshatra-calculator": "नक्षत्र कैलकुलेटर",
    "/numerology": "अंकशास्त्र",
    "/vastu": "वास्तु शास्त्र",
    "/tarot": "टैरो कार्ड",
    "/astrologers": "ज्योतिषी",
    "/appointments": "परामर्श समय",
    "/face-reading": "सामुद्रिक मुख लक्षण",
    "/palm-reading": "हस्तरेखा विचार",
    "/courses": "गुरुकुल कोर्सेज",
    "/shop": "कॉस्मिक शॉप",
    "/#services": "सेवाएं",
    "/#how-it-works": "यह कैसे काम करता है",
    myAccount: "मेरा खाता एवं सेटिंग्स",
    wallet: "वॉलेट एवं रिचार्ज",
    signOut: "लॉग आउट",
    signIn: "लॉग इन",
    getStarted: "शुरू करें",
    language: "भाषा चुनें",
  },
};

export const HERO_SLIDES_TRANSLATIONS: Record<
  AstrologyLanguage,
  {
    slides: {
      id: string;
      title: string;
      subtitle: string;
      description: string;
      cta_text: string;
      badge_text: string;
      badge_rating: string;
    }[];
    quickActions: {
      title: string;
      subtitle: string;
    }[];
  }
> = {
  en: {
    slides: [
      {
        id: "slide-1",
        title: "Enjoy your relationship",
        subtitle: "don't stress over it",
        description: "Talk to India's top Vedic astrologers & tarot readers for instant relationship clarity.",
        cta_text: "Consult for FREE",
        badge_text: "India's Best Astrology Platform",
        badge_rating: "4.9/5",
      },
      {
        id: "slide-2",
        title: "Know your destiny & future",
        subtitle: "with free Vedic Janam Kundli",
        description: "Accurate planetary calculations, dosha analysis, and personalized remedies by Vedic experts.",
        cta_text: "Generate Free Kundli",
        badge_text: "100% Free & Accurate Kundli",
        badge_rating: "500k+ Created",
      },
      {
        id: "slide-3",
        title: "Check marriage compatibility",
        subtitle: "find your perfect soulmate",
        description: "Detailed 36-Gun Milan, Manglik Dosha report & life-long harmony analysis for bride & groom.",
        cta_text: "Match Kundli Now",
        badge_text: "Trusted Matchmaking",
        badge_rating: "36 Gunas Score",
      },
      {
        id: "slide-4",
        title: "Unlock secrets in your palm",
        subtitle: "with modern 3D AI biometrics",
        description: "Explore heart, head & life lines with interactive real-time 3D hand visualization.",
        cta_text: "Start Palm Reading",
        badge_text: "Next-Gen 3D Biometrics",
        badge_rating: "99% Precision",
      },
      {
        id: "slide-5",
        title: "Discover your true potential",
        subtitle: "via 78 Arcana Tarot guidance",
        description: "Daily forecasts, love spreads & career clarity synchronized with planetary dasha cycles.",
        cta_text: "Get Tarot Reading",
        badge_text: "Sacred Arcana Cards",
        badge_rating: "78 Cards",
      },
      {
        id: "slide-6",
        title: "Harmonize your living space",
        subtitle: "attract wealth, peace & health",
        description: "Interactive 16-zone Vastu directional compass and elemental balance remedies for home & office.",
        cta_text: "Explore Vastu Guide",
        badge_text: "Ancient Vedic Architecture",
        badge_rating: "16 Zones",
      },
    ],
    quickActions: [
      { title: "Talk", subtitle: "Instant Consultation" },
      { title: "Love", subtitle: "Relationship Clarity" },
      { title: "Chat", subtitle: "Private Messaging" },
      { title: "Horoscope", subtitle: "Today's Prediction" },
      { title: "Kundli", subtitle: "Vedic Birth Chart" },
      { title: "AI Astrologer", subtitle: "Smart Answers" },
    ],
  },
  bn: {
    slides: [
      {
        id: "slide-1",
        title: "সম্পর্কের সুন্দর মুহূর্তগুলো উপভোগ করুন",
        subtitle: "দুশ্চিন্তা ও উদ্বেগ দূরে রাখুন",
        description: "ভারতের শীর্ষ বৈদিক জ্যোতিষী ও ট্যারোট বিশেষজ্ঞদের সাথে তাৎক্ষণিক পরামর্শে সম্পর্কের স্পষ্টতা পান।",
        cta_text: "বিনামূল্যে পরামর্শ নিন",
        badge_text: "ভারতের সেরা জ্যোতিষ প্ল্যাটফর্ম",
        badge_rating: "৪.৯/৫",
      },
      {
        id: "slide-2",
        title: "আপনার ভাগ্য ও ভবিষ্যৎ জানুন",
        subtitle: "বিনামূল্যে বৈদিক জন্ম কুণ্ডলী তৈরি করুন",
        description: "সুইশ এফিমেরিস ভিত্তিক নির্ভুল গ্রহের অবস্থান, দোষ বিচার এবং অভিজ্ঞ বিশেষজ্ঞদের ব্যক্তিগত প্রতিকার।",
        cta_text: "ফ্রি কুণ্ডলী তৈরি করুন",
        badge_text: "১০০% নির্ভুল ও সম্পূর্ণ বিনামূল্যে",
        badge_rating: "৫ লাখ+ তৈরি",
      },
      {
        id: "slide-3",
        title: "বিবাহের যোটক বিচার করুন",
        subtitle: "খুঁজে নিন আপনার সঠিক জীবনসঙ্গী",
        description: "৩৬ গুণ মিলন, মাঙ্গলিক দোষ ও আজীবন সুখ-শান্তির বিস্তারিত বিশ্লেষণ বর ও কনের জন্য।",
        cta_text: "যোটক বিচার করুন",
        badge_text: "বিশ্বস্ত যোটক বিচার",
        badge_rating: "৩৬ গুণ স্কোর",
      },
      {
        id: "slide-4",
        title: "হাতের রেখায় লুকানো রহস্য জানুন",
        subtitle: "আধুনিক ৩ডি এআই বায়োমেট্রিক্সে",
        description: "জীবনরেখা, হৃদয়রেখা ও মস্তিস্করেখা বিশ্লেষণ করুন রিয়েল-টাইম থ্রি-ডি হস্তরেখা স্ক্যানে।",
        cta_text: "হস্তরেখা বিচার শুরু করুন",
        badge_text: "অত্যাধুনিক ৩ডি বায়োমেট্রিক্স",
        badge_rating: "৯৯% নির্ভুল",
      },
      {
        id: "slide-5",
        title: "আপনার আসল সম্ভাবনা ও শক্তি চিনুন",
        subtitle: "৭৮টি পবিত্র আর্খানা ট্যারোট কার্ডে",
        description: "দৈনিক পূর্বাভাস, প্রেমের বিস্তার ও ক্যারিয়ারের পথনির্দেশ পান গ্রহের দশা চক্রের সাথে মিলিয়ে।",
        cta_text: "ট্যারোট রিডিং নিন",
        badge_text: "পবিত্র আর্খানা কার্ড",
        badge_rating: "৭৮টি কার্ড",
      },
      {
        id: "slide-6",
        title: "আপনার বাসস্থান ও কর্মক্ষেত্র সাজান",
        subtitle: "আকর্ষণ করুন ধন, শান্তি ও সুস্বাস্থ্য",
        description: "বাস্তুর ১৬টি দিকের সঠিক কম্পাস বিশ্লেষণ এবং ঘর ও অফিসের জন্য পঞ্চতত্ত্বের ভারসাম্য প্রতিকার।",
        cta_text: "বাস্তু নির্দেশিকা দেখুন",
        badge_text: "প্রাচীন বৈদিক স্থাপত্যবিজ্ঞান",
        badge_rating: "১৬টি দিক",
      },
    ],
    quickActions: [
      { title: "কথা বলুন", subtitle: "তাৎক্ষণিক পরামর্শ" },
      { title: "প্রেম ও সম্পর্ক", subtitle: "সম্পর্কের স্পষ্টতা" },
      { title: "চ্যাট করুন", subtitle: "ব্যক্তিগত বার্তা" },
      { title: "দৈনিক রাশিফল", subtitle: "আজকের ভাগ্য" },
      { title: "জন্ম কুণ্ডলী", subtitle: "বৈদিক জন্মছক" },
      { title: "এআই জ্যোতিষী", subtitle: "স্মার্ট উত্তর" },
    ],
  },
  hi: {
    slides: [
      {
        id: "slide-1",
        title: "अपने रिश्तों का आनंद लें",
        subtitle: "तनाव व चिंता को दूर करें",
        description: "भारत के शीर्ष वैदिक ज्योतिषियों व टैरो रीडर्स से सीधे जुड़कर पाएं रिश्तों में पूर्ण स्पष्टता।",
        cta_text: "मुफ़्त परामर्श लें",
        badge_text: "भारत का सर्वश्रेष्ठ ज्योतिष मंच",
        badge_rating: "4.9/5",
      },
      {
        id: "slide-2",
        title: "अपना भाग्य और भविष्य जानें",
        subtitle: "निःशुल्क वैदिक जन्म कुंडली बनाएं",
        description: "सटीक ग्रह गणना, दोष विश्लेषण एवं वैदिक विशेषज्ञों द्वारा व्यक्तिगत अचूक उपाय।",
        cta_text: "मुफ़्त कुंडली बनाएं",
        badge_text: "100% मुफ़्त एवं सटीक कुंडली",
        badge_rating: "5 लाख+ निर्मित",
      },
      {
        id: "slide-3",
        title: "विवाह हेतु कुंडली मिलान करें",
        subtitle: "पाएं अपना सही जीवनसाथी",
        description: "36 गुण मिलान, मांगलिक दोष रिपोर्ट एवं वर-वधू के लिए जीवनपर्यंत सामंजस्य विश्लेषण।",
        cta_text: "कुंडली मिलान करें",
        badge_text: "विश्वसनीय गुण मिलान",
        badge_rating: "36 गुण प्राप्तांक",
      },
      {
        id: "slide-4",
        title: "हस्तरेखा के रहस्य जानें",
        subtitle: "आधुनिक 3D एआई बायोमेट्रिक्स से",
        description: "हृदय, मस्तिष्क और जीवन रेखा का 3D विज़ुअलाइज़ेशन द्वारा सटीक व त्वरित विश्लेषण।",
        cta_text: "हस्तरेखा देखें",
        badge_text: "नेक्स्ट-जेन 3D बायोमेट्रिक्स",
        badge_rating: "99% सटीकता",
      },
      {
        id: "slide-5",
        title: "अपनी वास्तविक क्षमता पहचानें",
        subtitle: "78 आर्काना टैरो मार्गदर्शन से",
        description: "दैनिक भविष्यफल, प्रेम संबंध एवं करियर स्पष्टता दशा चक्रों के साथ समन्वित।",
        cta_text: "टैरो रीडिंग लें",
        badge_text: "पवित्र आर्काना कार्ड्स",
        badge_rating: "78 कार्ड्स",
      },
      {
        id: "slide-6",
        title: "अपने घर-कार्यालय को समृद्ध बनाएं",
        subtitle: "आकर्षित करें सुख, शांति व आरोग्य",
        description: "16-जोन वास्तु दिशा कम्पास एवं पंचतत्व संतुलन के शास्त्रीय अचूक उपाय।",
        cta_text: "वास्तु गाइड देखें",
        badge_text: "प्राचीन वैदिक वास्तुशास्त्र",
        badge_rating: "16 जोन",
      },
    ],
    quickActions: [
      { title: "बात करें", subtitle: "त्वरित परामर्श" },
      { title: "प्रेम व रिश्ते", subtitle: "रिश्तों में स्पष्टता" },
      { title: "चैट करें", subtitle: "निजी संदेश" },
      { title: "दैनिक राशिफल", subtitle: "आज का फलादेश" },
      { title: "जन्म कुंडली", subtitle: "वैदिक जन्म पत्रिका" },
      { title: "एआई ज्योतिषी", subtitle: "स्मार्ट समाधान" },
    ],
  },
};

export const ZODIAC_PREDICTION_TRANSLATIONS: Record<
  AstrologyLanguage,
  {
    title: string;
    subtitle: string;
    viewAll: string;
    signs: Record<string, { name: string; sanskrit: string; dates: string }>;
  }
> = {
  en: {
    title: "Today's Astrology Prediction",
    subtitle: "Select your zodiac sign to unlock today's personalized horoscope and planetary insights.",
    viewAll: "View All",
    signs: {
      aries: { name: "Aries", sanskrit: "Mesha", dates: "Mar 21 - Apr 19" },
      taurus: { name: "Taurus", sanskrit: "Vrishabha", dates: "Apr 20 - May 20" },
      gemini: { name: "Gemini", sanskrit: "Mithuna", dates: "May 21 - Jun 20" },
      cancer: { name: "Cancer", sanskrit: "Karka", dates: "Jun 21 - Jul 22" },
      leo: { name: "Leo", sanskrit: "Simha", dates: "Jul 23 - Aug 22" },
      virgo: { name: "Virgo", sanskrit: "Kanya", dates: "Aug 23 - Sep 22" },
      libra: { name: "Libra", sanskrit: "Tula", dates: "Sep 23 - Oct 22" },
      scorpio: { name: "Scorpio", sanskrit: "Vrishchika", dates: "Oct 23 - Nov 21" },
      sagittarius: { name: "Sagittarius", sanskrit: "Dhanu", dates: "Nov 22 - Dec 21" },
      capricorn: { name: "Capricorn", sanskrit: "Makara", dates: "Dec 22 - Jan 19" },
      aquarius: { name: "Aquarius", sanskrit: "Kumbha", dates: "Jan 20 - Feb 18" },
      pisces: { name: "Pisces", sanskrit: "Meena", dates: "Feb 19 - Mar 20" },
    },
  },
  bn: {
    title: "আজকের রাশিফল ও গ্রহের পূর্বাভাস",
    subtitle: "আপনার রাশি নির্বাচন করে আজকের নির্ভুল চন্দ্র গোচর, শুভ মুহূর্ত ও জ্যোতিষ দিকনির্দেশনা জেনে নিন।",
    viewAll: "সব দেখুন",
    signs: {
      aries: { name: "মেষ", sanskrit: "মেষ", dates: "২১ মার্চ - ১৯ এপ্রিল" },
      taurus: { name: "বৃষ", sanskrit: "বৃষভ", dates: "২০ এপ্রিল - ২০ মে" },
      gemini: { name: "মিথুন", sanskrit: "মিথুন", dates: "২১ মে - ২০ জুন" },
      cancer: { name: "কর্কট", sanskrit: "কর্কট", dates: "২১ জুন - ২২ জুলাই" },
      leo: { name: "সিংহ", sanskrit: "সিংহ", dates: "২৩ জুলাই - ২২ আগস্ট" },
      virgo: { name: "কন্যা", sanskrit: "কন্যা", dates: "২৩ আগস্ট - ২২ সেপ্টেম্বর" },
      libra: { name: "তুলা", sanskrit: "তুলা", dates: "২৩ সেপ্টেম্বর - ২২ অক্টোবর" },
      scorpio: { name: "বৃশ্চিক", sanskrit: "বৃশ্চিক", dates: "২৩ অক্টোবর - ২১ নভেম্বর" },
      sagittarius: { name: "ধনু", sanskrit: "ধনু", dates: "২২ নভেম্বর - ২১ ডিসেম্বর" },
      capricorn: { name: "মকর", sanskrit: "মকর", dates: "২২ ডিসেম্বর - ১৯ জানুয়ারি" },
      aquarius: { name: "কুম্ভ", sanskrit: "কুম্ভ", dates: "২০ জানুয়ারি - ১৮ ফেব্রুয়ারি" },
      pisces: { name: "মীন", sanskrit: "মীন", dates: "১৯ ফেব্রুয়ারি - ২০ মার্চ" },
    },
  },
  hi: {
    title: "आज का ज्योतिष फलादेश",
    subtitle: "अपनी राशि चुनें और जानें आज का सटीक दैनिक राशिफल एवं ग्रह गोचर फल।",
    viewAll: "सभी देखें",
    signs: {
      aries: { name: "मेष", sanskrit: "मेष", dates: "21 मार्च - 19 अप्रैल" },
      taurus: { name: "वृषभ", sanskrit: "वृषभ", dates: "20 अप्रैल - 20 मई" },
      gemini: { name: "मिथुन", sanskrit: "मिथुन", dates: "21 मई - 20 जून" },
      cancer: { name: "कर्क", sanskrit: "कर्क", dates: "21 जून - 22 जुलाई" },
      leo: { name: "सिंह", sanskrit: "सिंह", dates: "23 जुलाई - 22 अगस्त" },
      virgo: { name: "कन्या", sanskrit: "कन्या", dates: "23 अगस्त - 22 सितंबर" },
      libra: { name: "तुला", sanskrit: "तुला", dates: "23 सितंबर - 22 अक्टूबर" },
      scorpio: { name: "वृश्चिक", sanskrit: "वृश्चिक", dates: "23 अक्टूबर - 21 नवंबर" },
      sagittarius: { name: "धनु", sanskrit: "धनु", dates: "22 नवंबर - 21 दिसंबर" },
      capricorn: { name: "मकर", sanskrit: "मकर", dates: "22 दिसंबर - 19 जनवरी" },
      aquarius: { name: "कुंभ", sanskrit: "कुंभ", dates: "20 जनवरी - 18 फरवरी" },
      pisces: { name: "मीन", sanskrit: "मीन", dates: "19 फरवरी - 20 मार्च" },
    },
  },
};

export const READINGS_TRANSLATIONS: Record<
  AstrologyLanguage,
  {
    title: string;
    subtitle: string;
    items: Record<string, string>;
  }
> = {
  en: {
    title: "Free Astrology Readings",
    subtitle: "Explore traditional Vedic & modern tools — free to start, read by practitioners who consult daily.",
    items: {
      Kundli: "Kundli",
      "Match Making": "Match Making",
      Love: "Love & Romance",
      "Planet Transits": "Planet Transits",
      Panchang: "Panchang",
      Tarot: "Tarot Reading",
      Numerology: "Numerology",
      Vastu: "Vastu Shastra",
      Remedies: "Vedic Remedies",
      "Zodiac Signs": "Zodiac Signs",
      Festivals: "Festivals & Vrat",
      Spirituality: "Spirituality",
    },
  },
  bn: {
    title: "বিনামূল্যে জ্যোতিষ পরামর্শ ও গণনা",
    subtitle: "ঐতিহ্যবাহী বৈদিক ও আধুনিক জ্যোতিষ মাধ্যম — সম্পূর্ণ বিনামূল্যে শুরু করুন।",
    items: {
      Kundli: "জন্ম কুণ্ডলী",
      "Match Making": "যোটক বিচার",
      Love: "প্রেম ও সম্পর্ক",
      "Planet Transits": "গ্রহের গোচর",
      Panchang: "দৈনিক পঞ্চাঙ্গ",
      Tarot: "ট্যারোট রিডিং",
      Numerology: "সংখ্যাতত্ত্ব",
      Vastu: "বাস্তু শাস্ত্র",
      Remedies: "বৈদিক প্রতিকার",
      "Zodiac Signs": "রাশি ও লক্ষণ",
      Festivals: "ব্রত ও উৎসব",
      Spirituality: "আধ্যাত্মিকতা",
    },
  },
  hi: {
    title: "मुफ़्त ज्योतिष फलादेश",
    subtitle: "पारंपरिक वैदिक एवं आधुनिक ज्योतिष उपकरण — निःशुल्क उपयोग करें।",
    items: {
      Kundli: "जन्म कुंडली",
      "Match Making": "कुंडली मिलान",
      Love: "प्रेम संबंध",
      "Planet Transits": "ग्रह गोचर",
      Panchang: "दैनिक पंचांग",
      Tarot: "टैरो विचार",
      Numerology: "अंकशास्त्र",
      Vastu: "वास्तु शास्त्र",
      Remedies: "वैदिक उपाय",
      "Zodiac Signs": "राशियां",
      Festivals: "पर्व एवं व्रत",
      Spirituality: "अध्यात्म",
    },
  },
};

export const CONSULT_CATEGORIES_TRANSLATIONS: Record<
  AstrologyLanguage,
  {
    title: string;
    subtitle: string;
    categories: Record<string, string>;
  }
> = {
  en: {
    title: "Consult The Right Astrologer For You",
    subtitle: "Choose your area of life concern to connect with specialized, top-rated consultants.",
    categories: {
      "Love & Relationship": "Love & Relationship",
      "Marriage & Kundli": "Marriage & Kundli",
      Career: "Career & Job",
      "Woman Astrologer": "Woman Astrologer",
      Business: "Business & Trade",
      Money: "Money & Wealth",
    },
  },
  bn: {
    title: "আপনার জন্য সঠিক জ্যোতিষী নির্বাচন করুন",
    subtitle: "জীবনের যে কোনো সমস্যার সমাধানে অভিজ্ঞ ও বিশেষায়িত উপদেষ্টাদের সাথে যুক্ত হন।",
    categories: {
      "Love & Relationship": "প্রেম ও দাম্পত্য সম্পর্ক",
      "Marriage & Kundli": "বিবাহ ও কুণ্ডলী মিলন",
      Career: "ক্যারিয়ার ও চাকরি",
      "Woman Astrologer": "মহিলা জ্যোতিষী",
      Business: "ব্যবসা ও বাণিজ্য",
      Money: "অর্থ ও সম্পদ বৃদ্ধি",
    },
  },
  hi: {
    title: "अपने लिए सही ज्योतिषी चुनें",
    subtitle: "जीवन के महत्वपूर्ण पहलुओं के समाधान के लिए शीर्ष विशेषज्ञों से परामर्श करें।",
    categories: {
      "Love & Relationship": "प्रेम एवं संबंध",
      "Marriage & Kundli": "विवाह एवं कुंडली मिलान",
      Career: "करियर एवं नौकरी",
      "Woman Astrologer": "महिला ज्योतिषी",
      Business: "व्यापार एवं व्यवसाय",
      Money: "धन एवं संपत्ति",
    },
  },
};

export const HOME_STEPS_AND_TRUST_TRANSLATIONS: Record<
  AstrologyLanguage,
  {
    steps: { num: string; title: string; body: string }[];
    trust: { title: string; body: string }[];
    footer: {
      vedicTools: string;
      consult: string;
      account: string;
      desc: string;
      copyright: string;
      disclaimer: string;
    };
  }
> = {
  en: {
    steps: [
      {
        num: "01",
        title: "Tell us when you were born",
        body: "Date, time, and birthplace. Saved once, used automatically by every calculation.",
      },
      {
        num: "02",
        title: "Pick your verified astrologer",
        body: "Filter by Vedic, Tarot, Numerology, or language. See real-time online status and genuine reviews.",
      },
      {
        num: "03",
        title: "Instant chat or call",
        body: "Ask what is on your heart in 100% private consultation. Pay only for the minutes you use.",
      },
    ],
    trust: [
      {
        title: "100% Verified Astrologers",
        body: "Every single astrologer undergoes rigorous 4-stage background vetting and expertise test.",
      },
      {
        title: "Completely Private & Confidential",
        body: "End-to-end encrypted chats and phone calls. Your birth data and questions remain strictly secure.",
      },
      {
        title: "Per-Minute Transparent Billing",
        body: "No hidden charges, no forced bundles. Clear rates in Rupees per minute with money-back guarantee.",
      },
      {
        title: "Rated 4.9/5 by 500,000+ Users",
        body: "Authentic unedited post-consultation reviews help you connect with the right guide instantly.",
      },
    ],
    footer: {
      vedicTools: "Vedic Tools",
      consult: "Consult",
      account: "Account",
      desc: "Guidance from verified astrologers — kundli, matchmaking, numerology and vastu, whenever you need clarity.",
      copyright: "DivinLink. All rights reserved.",
      disclaimer: "Astrological guidance is offered for personal reflection and is not a substitute for professional medical, legal or financial advice.",
    },
  },
  bn: {
    steps: [
      {
        num: "০১",
        title: "আপনার জন্ম বিবরণ দিন",
        body: "তারিখ, সময় এবং জন্মস্থান। একবার সংরক্ষণ করলে সমস্ত গণনায় স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে।",
      },
      {
        num: "০২",
        title: "পছন্দের ভেরিফাইড জ্যোতিষী বাছুন",
        body: "বৈদিক, ট্যারোট, সংখ্যাতত্ত্ব বা ভাষা অনুযায়ী ফিল্টার করুন। রিয়েল-টাইম অনলাইন স্ট্যাটাস ও রিভিউ দেখুন।",
      },
      {
        num: "০৩",
        title: "তাৎক্ষণিক চ্যাট বা কল করুন",
        body: "১০০% গোপনীয়তায় মনের সব প্রশ্ন জিজ্ঞাসা করুন। শুধুমাত্র ব্যবহৃত সময়ের জন্যই পরিশোধ করুন।",
      },
    ],
    trust: [
      {
        title: "১০০% ভেরিফাইড জ্যোতিষীগণ",
        body: "প্রতিটি জ্যোতিষী ৪-স্তরের পুঙ্খানুপুঙ্খ ব্যাকগ্রাউন্ড যাচাই ও শাস্ত্রীয় দক্ষতা পরীক্ষার মধ্য দিয়ে নির্বাচিত হন।",
      },
      {
        title: "সম্পূর্ণ ব্যক্তিগত ও গোপনীয়",
        body: "এন্ড-টু-এন্ড এনক্রিপ্টেড চ্যাট ও ফোন কল। আপনার জন্ম বিবরণ ও প্রশ্নাবলী সম্পূর্ণ নিরাপদ ও গোপনীয়।",
      },
      {
        title: "মিনিট প্রতি স্বচ্ছ মূল্য",
        body: "কোনো লুকানো চার্জ নেই, কোনো বাধ্যতামূলক বান্ডেল নেই। প্রতি মিনিটের পরিষ্কার রেট ও মানিব্যাক গ্যারান্টি।",
      },
      {
        title: "৫,০০,০০০+ ব্যবহারকারীর ৪.৯/৫ রেটিং",
        body: "আসল ও অবিকৃত ব্যবহারকারী পর্যালোচনা আপনাকে দ্রুত সঠিক পথপ্রদর্শক নির্বাচন করতে সহায়তা করে।",
      },
    ],
    footer: {
      vedicTools: "বৈদিক মাধ্যম",
      consult: "পরামর্শ নিন",
      account: "অ্যাকাউন্ট",
      desc: "বিশ্বস্ত জ্যোতিষীদের কাছ থেকে সঠিক পরামর্শ — কুণ্ডলী, যোটক বিচার, সংখ্যাতত্ত্ব ও বাস্তু, যখনই আপনার প্রয়োজন।",
      copyright: "ডিভিনলিংক। সর্বস্বত্ব সংরক্ষিত।",
      disclaimer: "জ্যোতিষ সংক্রান্ত দিকনির্দেশনা ব্যক্তিগত সচেতনতার জন্য এবং এটি কোনো পেশাদার চিকিৎসা, আইনি বা আর্থিক পরামর্শের বিকল্প নয়।",
    },
  },
  hi: {
    steps: [
      {
        num: "01",
        title: "जन्म का सही विवरण दें",
        body: "तारीख, समय एवं जन्मस्थान। एक बार सुरक्षित करें, हर गणना में स्वतः उपयोग होगा।",
      },
      {
        num: "02",
        title: "सत्यापित ज्योतिषी चुनें",
        body: "वैदिक, टैरो, अंकशास्त्र या भाषा अनुसार चुनें। रीयल-टाइम ऑनलाइन स्थिति व समीक्षाएं देखें।",
      },
      {
        num: "03",
        title: "तुरंत कॉल या चैट करें",
        body: "100% गोपनीयता के साथ अपने मन की बात पूछें। केवल उपयोग किए गए मिनटों का भुगतान करें।",
      },
    ],
    trust: [
      {
        title: "100% सत्यापित ज्योतिषी",
        body: "प्रत्येक ज्योतिषी 4-स्तरीय पृष्ठभूमि सत्यापन एवं शास्त्रीय दक्षता परीक्षा से गुजरता है।",
      },
      {
        title: "पूर्णतः सुरक्षित एवं निजी",
        body: "एंड-टू-एंड एन्क्रिप्टेड चैट एवं कॉल। आपका जन्म विवरण एवं प्रश्न पूर्णतः सुरक्षित हैं।",
      },
      {
        title: "प्रति मिनट पारदर्शी शुल्क",
        body: "कोई छुपा शुल्क नहीं, कोई जबरन पैकेज नहीं। प्रति मिनट स्पष्ट दर एवं मनी-बैक गारंटी।",
      },
      {
        title: "5,00,000+ प्रयोक्ताओं द्वारा 4.9/5 रेटिंग",
        body: "वास्तविक समीक्षाएं आपको सही मार्गदर्शक तुरंत चुनने में मदद करती हैं।",
      },
    ],
    footer: {
      vedicTools: "वैदिक टूल्स",
      consult: "परामर्श",
      account: "अकाउंट",
      desc: "सत्यापित ज्योतिषियों से सही मार्गदर्शन — कुंडली, मिलान, अंकशास्त्र एवं वास्तु समाधान।",
      copyright: "DivinLink. सर्वाधिकार सुरक्षित।",
      disclaimer: "ज्योतिषीय मार्गदर्शन व्यक्तिगत चिंतन हेतु है और यह किसी पेशेवर चिकित्सा, कानूनी या वित्तीय सलाह का विकल्प नहीं है।",
    },
  },
};

