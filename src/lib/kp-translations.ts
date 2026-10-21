/**
 * Client-side UI & Domain translations for KP Astrology (Krishnamurti Paddhati)
 * across English (en), Bengali (bn), and Hindi (hi).
 * Ensures instant 0ms language switching on the frontend.
 */

export interface KPUITranslations {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  genderLabel: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  dobLabel: string;
  dobNotice: string;
  tobLabel: string;
  tobNotice: string;
  locationLabel: string;
  locationPlaceholder: string;
  searchCity: string;
  ayanamsaLabel: string;
  calculateBtn: string;
  calculating: string;
  syncProfileBtn: string;
  resetBtn: string;

  // KP Details Card
  detailsHeading: string;
  ayanamsaTitle: string;
  castingTimeTitle: string;
  julianDayTitle: string;
  panchangHeading: string;
  tithiLabel: string;
  karanaLabel: string;
  yogaLabel: string;
  dayLabel: string;
  sunTimesHeading: string;
  sunriseLabel: string;
  sunsetLabel: string;
  dashaBalanceHeading: string;
  balanceDashaLabel: string;

  // Chart Viewer
  chartHeading: string;
  chartSubheading: string;
  toggleCombine: string;
  toggleRashi: string;
  toggleBhav: string;
  styleNorth: string;
  styleSouth: string;
  styleEast: string;
  styleWheel: string;
  activePlanetFilter: string;
  allPlanets: string;

  // Ruling Planets
  rpHeading: string;
  rpSubheading: string;
  rpDobTitle: string;
  rpCastingTitle: string;
  lagnaSignLord: string;
  lagnaStarLord: string;
  lagnaSubLord: string;
  moonSignLord: string;
  moonStarLord: string;
  moonSubLord: string;
  dayLordLabel: string;

  // Cusps Table
  cuspsHeading: string;
  cuspCol: string;
  degreeCol: string;
  signCol: string;
  signLordCol: string;
  starLordCol: string;
  subLordCol: string;
  subSubLordCol: string;

  // Planets Table
  planetsHeading: string;
  planetCol: string;
  motionCol: string;
  directText: string;
  retrogradeText: string;
  houseCol: string;

  // Vimshottari Dasha
  dashaHeading: string;
  dashaSubheading: string;
  mahadashaTitle: string;
  antardashaTitle: string;
  pratyantardashaTitle: string;
  startDateCol: string;
  endDateCol: string;
  durationCol: string;
  activeStatus: string;
  expandHint: string;
}

export const KP_UI_TRANSLATIONS: Record<"en" | "bn" | "hi", KPUITranslations> = {
  en: {
    badge: "Krishnamurti Paddhati (KP System)",
    title: "KP Astrology & Nirayana Bhava Chalit",
    subtitle:
      "Advanced Krishnamurti Paddhati analysis with Placidus Cusp Division, Sub Lord calculations, Dual Ruling Planets (DOB & Casting), and 3-Tier Vimshottari Dasha timeline.",
    formTitle: "Enter Birth & Astrological Details",
    nameLabel: "Full Name",
    namePlaceholder: "Enter your full name",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    dobLabel: "Date of Birth *",
    dobNotice: "Mandatory (DD-MM-YYYY)",
    tobLabel: "Time of Birth",
    tobNotice: "Optional (defaults to 12:00 PM if unknown)",
    locationLabel: "Birth Place *",
    locationPlaceholder: "Search city or town (e.g. Kolaghat, Kolkata, Delhi)",
    searchCity: "Search City",
    ayanamsaLabel: "Ayanamsa System",
    calculateBtn: "Calculate KP Astrology Chart",
    calculating: "Computing Placidus Cusps & Sub Lords...",
    syncProfileBtn: "Auto-fill From My Profile",
    resetBtn: "Reset Form",

    detailsHeading: "KP Astrological Key Metrics",
    ayanamsaTitle: "KP New Ayanamsa",
    castingTimeTitle: "Casting Time (Horary)",
    julianDayTitle: "Julian Day",
    panchangHeading: "Vedic Panchang",
    tithiLabel: "Tithi",
    karanaLabel: "Karana",
    yogaLabel: "Yoga",
    dayLabel: "Vara (Day)",
    sunTimesHeading: "Solar Timings",
    sunriseLabel: "Sunrise",
    sunsetLabel: "Sunset",
    dashaBalanceHeading: "Dasha Balance at Birth",
    balanceDashaLabel: "Balance Period",

    chartHeading: "Nirayana Bhava Chalit Chart",
    chartSubheading:
      "Accurate representation of Krishnamurti Paddhati unequal house division with planetary degrees.",
    toggleCombine: "Combine",
    toggleRashi: "Rashi",
    toggleBhav: "Bhav",
    styleNorth: "North",
    styleSouth: "South",
    styleEast: "East",
    styleWheel: "Wheel",
    activePlanetFilter: "Select Planet to Highlight",
    allPlanets: "Show All",

    rpHeading: "KP Ruling Planets (RP)",
    rpSubheading:
      "The master key of KP Astrology. Evaluates the divine planetary rulers at Birth and at the moment of Query/Casting.",
    rpDobTitle: "Ruling Planets (At Date of Birth)",
    rpCastingTitle: "Ruling Planets (At Casting Time)",
    lagnaSignLord: "Lagna Sign Lord",
    lagnaStarLord: "Lagna Star Lord (Nakshatra)",
    lagnaSubLord: "Lagna Sub Lord",
    moonSignLord: "Moon Sign Lord",
    moonStarLord: "Moon Star Lord (Nakshatra)",
    moonSubLord: "Moon Sub Lord",
    dayLordLabel: "Day Lord (Vara Lord)",

    cuspsHeading: "Placidus House Cusps (1 to 12 Bhava)",
    cuspCol: "Cusp",
    degreeCol: "Degree (DMS)",
    signCol: "Sign",
    signLordCol: "Sign Lord",
    starLordCol: "Star Lord",
    subLordCol: "Sub Lord",
    subSubLordCol: "Sub-Sub",

    planetsHeading: "Planetary Positions & Sub Lord Distribution",
    planetCol: "Planet",
    motionCol: "Motion",
    directText: "Direct",
    retrogradeText: "Retrograde",
    houseCol: "Bhava House",

    dashaHeading: "Vimshottari Dasha Timeline",
    dashaSubheading:
      "Interactive 3-tier hierarchy: Mahadasha -> Antardasha -> Pratyantardasha calculated from exact Moon balance at birth.",
    mahadashaTitle: "Mahadasha (MD)",
    antardashaTitle: "Antardasha (AD)",
    pratyantardashaTitle: "Pratyantardasha (PD)",
    startDateCol: "Start Date",
    endDateCol: "End Date",
    durationCol: "Duration",
    activeStatus: "ACTIVE NOW",
    expandHint: "Click to explore sub-periods",
  },
  bn: {
    badge: "কেপি জ্যোতিষ পদ্ধতি (Krishnamurti Paddhati)",
    title: "কেপি অ্যাস্ট্রোলজি ও নির্ভুল নিরয়ণ ভাব চলিত",
    subtitle:
      "কৃষ্ণমূর্তি পদ্ধতি (KP) অনুসারে প্লাসিডাস অসম ভাব মধ্য, সাব-লর্ড বিভাগ, দ্বৈত রুলিং প্ল্যানেট (জন্ম ও গণনাকালীন) এবং ৩-স্তরের বিংশোত্তরী দশা টাইমলাইন।",
    formTitle: "আপনার জন্ম বিবরণ ও স্থান প্রদান করুন",
    nameLabel: "পূর্ণ নাম",
    namePlaceholder: "আপনার নাম লিখুন",
    genderLabel: "লিঙ্গ",
    genderMale: "পুরুষ",
    genderFemale: "মহিলা",
    genderOther: "অন্যান্য",
    dobLabel: "জন্ম তারিখ *",
    dobNotice: "বাধ্যতামূলক (দিন-মাস-সাল)",
    tobLabel: "জন্মের সময়",
    tobNotice: "ঐচ্ছিক (অজানা থাকলে দুপুর ১২:০০ ধরা হবে)",
    locationLabel: "জন্মস্থান *",
    locationPlaceholder: "শহর বা স্থানের নাম খুঁজুন (যেমন কোলাঘাট, কলকাতা, দিল্লি)",
    searchCity: "শহর অনুসন্ধান",
    ayanamsaLabel: "অয়নাংশ পদ্ধতি",
    calculateBtn: "কেপি জ্যোতিষ গণনা করুন",
    calculating: "প্লাসিডাস ভাব ও সাব লর্ড নির্ণয় করা হচ্ছে...",
    syncProfileBtn: "প্রোফাইল থেকে তথ্য নিন",
    resetBtn: "ফর্ম রিসেট করুন",

    detailsHeading: "কেপি জ্যোতিষের গুরুত্বপূর্ণ সূচক",
    ayanamsaTitle: "কেপি নিউ অয়নাংশ",
    castingTimeTitle: "গণনার সময় (Casting Time)",
    julianDayTitle: "জুলিয়ান দিন (Julian Day)",
    panchangHeading: "বৈদিক পঞ্চাঙ্গ",
    tithiLabel: "তিথি",
    karanaLabel: "করণ",
    yogaLabel: "যোগ",
    dayLabel: "বার (দিন)",
    sunTimesHeading: "সূর্যোদয় ও সূর্যাস্ত",
    sunriseLabel: "সূর্যোদয়",
    sunsetLabel: "সূর্যাস্ত",
    dashaBalanceHeading: "জন্মকালীন দশা ব্যালেন্স",
    balanceDashaLabel: "অবশিষ্ট মেয়াদ",

    chartHeading: "নিরয়ণ ভাব চলিত কুষ্ঠি",
    chartSubheading: "কৃষ্ণমূর্তি পদ্ধতিতে প্লাসিডাস অসম ভাব বিভাজন ও সুনির্দিষ্ট গ্রহের দ্রাঘিমাংশ।",
    toggleCombine: "সম্মিলিত (Combine)",
    toggleRashi: "রাশি (Rashi)",
    toggleBhav: "ভাব (Bhav)",
    styleNorth: "উত্তর ভারত",
    styleSouth: "দক্ষিণ ভারত",
    styleEast: "পূর্ব ভারত",
    styleWheel: "চক্রাকার হুইল",
    activePlanetFilter: "গ্রহ হাইলাইট করুন",
    allPlanets: "সকল গ্রহ",

    rpHeading: "কেপি রুলিং প্ল্যানেটস (Ruling Planets - RP)",
    rpSubheading:
      "কেপি পদ্ধতির মূল চাবিকাঠি। জন্মলগ্নে এবং চার্ট গণনাকালে ঐশ্বরিক নির্দেশক গ্রহসমূহের সুনির্দিষ্ট বিন্যাস।",
    rpDobTitle: "জন্মকালীন রুলিং প্ল্যানেট (Birth RP)",
    rpCastingTitle: "চার্ট গণনাকালীন রুলিং প্ল্যানেট (Casting RP)",
    lagnaSignLord: "লগ্ন রাশি অধিপতি (Sign Lord)",
    lagnaStarLord: "লগ্ন নক্ষত্র অধিপতি (Star Lord)",
    lagnaSubLord: "লগ্ন সাব লর্ড (Sub Lord)",
    moonSignLord: "চন্দ্র রাশি অধিপতি (Sign Lord)",
    moonStarLord: "চন্দ্র নক্ষত্র অধিপতি (Star Lord)",
    moonSubLord: "চন্দ্র সাব লর্ড (Sub Lord)",
    dayLordLabel: "বারাধিপতি (Day Lord)",

    cuspsHeading: "প্লাসিডাস ভাব মধ্য ও সাব লর্ড (১ থেকে ১২ ভাব)",
    cuspCol: "ভাব (Cusp)",
    degreeCol: "ডিগ্রি ও দ্রাঘিমা",
    signCol: "রাশি",
    signLordCol: "রাশি লর্ড",
    starLordCol: "নক্ষত্র লর্ড",
    subLordCol: "সাব লর্ড",
    subSubLordCol: "সাব-সাব",

    planetsHeading: "গ্রহাবস্থান, ভাব নির্দেশক ও সাব লর্ড তালিকা",
    planetCol: "গ্রহ",
    motionCol: "গতি",
    directText: "মার্গী",
    retrogradeText: "বক্রী (®)",
    houseCol: "ভাব চলিত ঘর",

    dashaHeading: "বিংশোত্তরী দশা কালানুক্রম (Vimshottari Dasha)",
    dashaSubheading:
      "ইন্টারেক্টিভ ৩-স্তরীয় বিন্যাস: মহাদশা -> অন্তর্দশা -> প্রত্যন্তর্দশা (চন্দ্র নক্ষত্র ব্যালেন্স থেকে গণনাকৃত)।",
    mahadashaTitle: "মহাদশা (MD)",
    antardashaTitle: "অন্তর্দশা (AD)",
    pratyantardashaTitle: "প্রত্যন্তর্দশা (PD)",
    startDateCol: "শুরুর তারিখ",
    endDateCol: "শেষের তারিখ",
    durationCol: "মেয়াদ",
    activeStatus: "বর্তমানে সক্রিয়",
    expandHint: "শাখা দশা দেখতে ক্লিক করুন",
  },
  hi: {
    badge: "कृष्णमूर्ति पद्धति (KP System)",
    title: "केपी ज्योतिष और निरयण भाव चलित",
    subtitle:
      "उन्नत कृष्णमूर्ति पद्धति (KP) विश्लेषण, प्लेसिडस भाव मध्य, सब लॉर्ड गणना, द्वैत रूलिंग प्लैनेट्स (DOB व प्रश्न काल) और त्रि-स्तरीय विंशोत्तरी दशा।",
    formTitle: "जन्म विवरण एवं स्थान दर्ज करें",
    nameLabel: "पूरा नाम",
    namePlaceholder: "अपना पूरा नाम लिखें",
    genderLabel: "लिंग",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य",
    dobLabel: "जन्म तिथि *",
    dobNotice: "अनिवार्य (DD-MM-YYYY)",
    tobLabel: "जन्म समय",
    tobNotice: "वैकल्पिक (अज्ञात होने पर दोपहर 12:00 माना जाएगा)",
    locationLabel: "जन्म स्थान *",
    locationPlaceholder: "शहर या स्थान खोजें (उदा. कोलाघाट, कोलकाता, दिल्ली)",
    searchCity: "शहर खोजें",
    ayanamsaLabel: "अयनांश प्रणाली",
    calculateBtn: "केपी ज्योतिष गणना करें",
    calculating: "प्लेसिडस भाव एवं सब लॉर्ड की गणना हो रही है...",
    syncProfileBtn: "प्रोफ़ाइल से विवरण भरें",
    resetBtn: "फ़ॉर्म रीसेट करें",

    detailsHeading: "केपी ज्योतिष मुख्य संकेतक",
    ayanamsaTitle: "केपी न्यू अयनांश",
    castingTimeTitle: "गणना समय (Casting Time)",
    julianDayTitle: "जूलियन दिन",
    panchangHeading: "वैदिक पंचांग",
    tithiLabel: "तिथि",
    karanaLabel: "करण",
    yogaLabel: "योग",
    dayLabel: "वार (दिन)",
    sunTimesHeading: "सूर्योदय व सूर्यास्त",
    sunriseLabel: "सूर्योदय",
    sunsetLabel: "सूर्यास्त",
    dashaBalanceHeading: "जन्मकालीन दशा शेष",
    balanceDashaLabel: "शेष अवधि",

    chartHeading: "निरयण भाव चलित चक्र",
    chartSubheading: "कृष्णमूर्ति पद्धति प्लेसिडस असमान भाव विभाजन एवं सटीक ग्रहीय अंश।",
    toggleCombine: "संयुक्त (Combine)",
    toggleRashi: "राशि (Rashi)",
    toggleBhav: "भाव (Bhav)",
    styleNorth: "उत्तर भारत",
    styleSouth: "दक्षिण भारत",
    styleEast: "पूर्व भारत",
    styleWheel: "वृत्ताकार चक्र",
    activePlanetFilter: "ग्रह हाईलाइट करें",
    allPlanets: "सभी ग्रह",

    rpHeading: "केपी रूलिंग प्लैनेट्स (Ruling Planets - RP)",
    rpSubheading:
      "केपी ज्योतिष की मास्टर कुंजी। जन्म काल और प्रश्न/गणना काल के दिव्य संचालक ग्रहों का सटीक विवरण।",
    rpDobTitle: "रूलिंग प्लैनेट्स (जन्म तिथि अनुसार)",
    rpCastingTitle: "रूलिंग प्लैनेट्स (चार्ट गणना समय अनुसार)",
    lagnaSignLord: "लग्न राशि स्वामी (Sign Lord)",
    lagnaStarLord: "लग्न नक्षत्र स्वामी (Star Lord)",
    lagnaSubLord: "लग्न सब लॉर्ड (Sub Lord)",
    moonSignLord: "चंद्र राशि स्वामी (Sign Lord)",
    moonStarLord: "चंद्र नक्षत्र स्वामी (Star Lord)",
    moonSubLord: "चंद्र सब लॉर्ड (Sub Lord)",
    dayLordLabel: "वार स्वामी (Day Lord)",

    cuspsHeading: "प्लेसिडस भाव मध्य एवं सब लॉर्ड (1 से 12 भाव)",
    cuspCol: "भाव (Cusp)",
    degreeCol: "अंश व रेखांश (DMS)",
    signCol: "राशि",
    signLordCol: "राशि स्वामी",
    starLordCol: "नक्षत्र स्वामी",
    subLordCol: "सब लॉर्ड",
    subSubLordCol: "सब-सब",

    planetsHeading: "ग्रह स्थिति, भाव चलित एवं सब लॉर्ड सारणी",
    planetCol: "ग्रह",
    motionCol: "गति",
    directText: "मार्गी",
    retrogradeText: "वक्री (®)",
    houseCol: "भाव चलित घर",

    dashaHeading: "विंशोत्तरी दशा समय-सारणी",
    dashaSubheading:
      "इंटरैक्टिव 3-स्तरीय पदानुक्रम: महादशा -> अंतर्दशा -> प्रत्यंतर्दशा (जन्म समय चंद्र नक्षत्र शेष से संगणित)।",
    mahadashaTitle: "महादशा (MD)",
    antardashaTitle: "अंतर्दशा (AD)",
    pratyantardashaTitle: "प्रत्यंतर्दशा (PD)",
    startDateCol: "प्रारंभ तिथि",
    endDateCol: "समाप्ति तिथि",
    durationCol: "अवधि",
    activeStatus: "वर्तमान में सक्रिय",
    expandHint: "विस्तृत दशा देखने के लिए क्लिक करें",
  },
};

export const KP_PLANET_NAMES: Record<string, Record<"en" | "bn" | "hi", string>> = {
  Asc: { en: "Ascendant (Asc)", bn: "লগ্ন (Asc)", hi: "लग्न (Asc)" },
  Su: { en: "Sun (Su)", bn: "সূর্য (Su)", hi: "सूर्य (Su)" },
  Mo: { en: "Moon (Mo)", bn: "চন্দ্র (Mo)", hi: "चन्द्र (Mo)" },
  Ma: { en: "Mars (Ma)", bn: "মঙ্গল (Ma)", hi: "मंगल (Ma)" },
  Me: { en: "Mercury (Me)", bn: "বুধ (Me)", hi: "बुध (Me)" },
  Ju: { en: "Jupiter (Ju)", bn: "বৃহস্পতি (Ju)", hi: "बृहस्पति (Ju)" },
  Ve: { en: "Venus (Ve)", bn: "শুক্র (Ve)", hi: "शुक्र (Ve)" },
  Sa: { en: "Saturn (Sa)", bn: "শনি (Sa)", hi: "शनि (Sa)" },
  Ra: { en: "Rahu (Ra)", bn: "রাহু (Ra)", hi: "राहु (Ra)" },
  Ke: { en: "Ketu (Ke)", bn: "কেতু (Ke)", hi: "केतु (Ke)" },
  Ur: { en: "Uranus", bn: "ইউরেনাস", hi: "युरेनस" },
  Ne: { en: "Neptune", bn: "নেপচুন", hi: "नेपच्यून" },
  Pl: { en: "Pluto", bn: "প্লুটো", hi: "प्लूटो" },
};

export const KP_SIGN_NAMES: Record<string, Record<"en" | "bn" | "hi", string>> = {
  Aries: { en: "Aries", bn: "মেষ", hi: "मेष" },
  Taurus: { en: "Taurus", bn: "বৃষ", hi: "वृषभ" },
  Gemini: { en: "Gemini", bn: "মিথুন", hi: "मिथुन" },
  Cancer: { en: "Cancer", bn: "কর্কট", hi: "कर्क" },
  Leo: { en: "Leo", bn: "সিংহ", hi: "सिंह" },
  Virgo: { en: "Virgo", bn: "কন্যা", hi: "कन्या" },
  Libra: { en: "Libra", bn: "তুলা", hi: "तुला" },
  Scorpio: { en: "Scorpio", bn: "বৃশ্চিক", hi: "वृश्चिक" },
  Sagittarius: { en: "Sagittarius", bn: "ধনু", hi: "धनु" },
  Capricorn: { en: "Capricorn", bn: "মকর", hi: "मकर" },
  Aquarius: { en: "Aquarius", bn: "কুম্ভ", hi: "कुंभ" },
  Pisces: { en: "Pisces", bn: "মীন", hi: "मीन" },
};
