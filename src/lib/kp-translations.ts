/**
 * Client-side UI & Domain translations for KP Astrology (Krishnamurti Paddhati)
 * across English (en), Bengali (bn), and Hindi (hi).
 * Includes detailed Dasha Insights, Favorable actions, Cautions & Vedic Remedies.
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

  // Dasha Insights & Remedies
  dashaInsightsTitle: string;
  overviewTitle: string;
  careerWealthTitle: string;
  favorableTitle: string;
  cautionsTitle: string;
  remediesTitle: string;
  luckyDeity: string;
  luckyDay: string;
  luckyColor: string;
  beejMantra: string;
  gayatriMantra: string;
  viewInsightsBtn: string;
  hideInsightsBtn: string;
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

    dashaInsightsTitle: "Dasha Influences & Remedies",
    overviewTitle: "What to Expect (General Influence)",
    careerWealthTitle: "Career & Financial Prospects",
    favorableTitle: "Recommended Actions (Do's)",
    cautionsTitle: "Cautions & Pitfalls (Don'ts)",
    remediesTitle: "Remedies & Good Karma (Upayas)",
    luckyDeity: "Presiding Deity",
    luckyDay: "Auspicious Day",
    luckyColor: "Auspicious Color",
    beejMantra: "Beej Mantra",
    gayatriMantra: "Gayatri Mantra",
    viewInsightsBtn: "View Guidance & Remedies",
    hideInsightsBtn: "Hide Guidance",
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

    dashaInsightsTitle: "দশার শুভাশুভ ফল ও প্রতিকার",
    overviewTitle: "কী ঘটবে আপনার সাথে? (সম্ভাব্য প্রভাব)",
    careerWealthTitle: "ক্যারিয়ার ও আর্থিক ক্ষেত্র",
    favorableTitle: "কী কী করা উচিত? (শুভ কর্ম)",
    cautionsTitle: "কী কী থেকে সাবধান থাকবেন? (সতর্কতা)",
    remediesTitle: "কী করলে ভালো হবে? (জ্যোতিষীয় প্রতিকার)",
    luckyDeity: "উপাস্য দেবতা",
    luckyDay: "অনুকূল বার",
    luckyColor: "অনুকূল রং",
    beejMantra: "বীজ মন্ত্র",
    gayatriMantra: "গায়ত্রী মন্ত্র",
    viewInsightsBtn: "পরামর্শ ও প্রতিকার দেখুন",
    hideInsightsBtn: "পরামর্শ বন্ধ করুন",
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

    planetsHeading: "ग्रह स्थिति, भाव चलিত एवं सब लॉर्ड सारणी",
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

    dashaInsightsTitle: "दशा प्रभाव एवं उपाय",
    overviewTitle: "संभावित प्रभाव एवं परिणाम",
    careerWealthTitle: "करियर एवं आर्थिक स्थिति",
    favorableTitle: "क्या करें (अनुकूल कार्य)",
    cautionsTitle: "सावधानियां (क्या न करें)",
    remediesTitle: "ज्योतिषीय उपाय एवं कर्म",
    luckyDeity: "उपास्य देवता",
    luckyDay: "शुभ दिन",
    luckyColor: "शुभ रंग",
    beejMantra: "बीज मंत्र",
    gayatriMantra: "गायत्री मंत्र",
    viewInsightsBtn: "मार्गदर्शन एवं उपाय देखें",
    hideInsightsBtn: "मार्गदर्शन बंद करें",
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

export interface LocalizedDashaInsight {
  overview: string;
  career_and_wealth: string;
  favorable_actions: string[];
  cautions_and_pitfalls: string[];
  remedies: string[];
  lucky_day: string;
  lucky_color: string;
  deity: string;
  beej_mantra: string;
  gayatri_mantra: string;
}

export const KP_LOCALIZED_DASHA_INSIGHTS: Record<
  string,
  Record<"en" | "bn" | "hi", LocalizedDashaInsight>
> = {
  Ketu: {
    en: {
      overview:
        "Spiritual awakening, detachment from toxic ties, deep research mindset, intuition, and closing of past karmic chapters.",
      career_and_wealth:
        "Strong progress in technical analysis, coding, data research, astrology, auditing, and autonomous roles. Avoid speculative gambling.",
      favorable_actions: [
        "Cultivate meditation, introspection, and spiritual sadhana",
        "Deep-dive into research, coding, analytics, and problem solving",
        "Streamline life by letting go of toxic habits and redundant associations",
        "Engage in charitable and selfless community activities",
      ],
      cautions_and_pitfalls: [
        "Avoid abrupt career abandonment or emotional resignation without backup",
        "Do not alienate close family members through extreme isolation",
        "Be mindful of spinal, joint, or urinary tract health",
        "Stay clear of hasty legal or unverified business contracts",
      ],
      remedies: [
        "Offer sweet bread or chapatis to stray dogs regularly (as per KP & Lal Kitab)",
        "Chant Ketu Gayatri Mantra daily: 'Om Chitra varnaya vidhmahe, sarparoopaya dhimahi, Tanno Ketu Prachodayat !'",
        "Worship Lord Ganesha with Modaks and Durva grass to dissolve hurdles",
        "Maintain cordial, respectful relations with maternal grandfather",
      ],
      lucky_day: "Tuesday / Thursday",
      lucky_color: "Grey / Multi-color / Smoky Brown",
      deity: "Lord Ganesha",
      beej_mantra: "Om Stram Streem Stroum Sah Ketave Namah",
      gayatri_mantra: "Om Chitra varnaya vidhmahe, sarparoopaya dhimahi, Tanno Ketu Prachodayat !",
    },
    bn: {
      overview:
        "আধ্যাত্মিক জাগরণ, বৈরাগ্য, অপ্রয়োজনীয় সম্পর্কের অবসান, রিসার্চ, গুপ্তবিদ্যা বা কোডিং ও অকাল্ট অ্যানালিটিক্সে গভীর একাগ্রতা এবং অতীতের কর্মফল সমাপ্তির পর্ব।",
      career_and_wealth:
        "টেকনিক্যাল রিসার্চ, সফটওয়্যার কোডিং, ডাটা সায়েন্স, অডিট ও স্বাধীন প্রজেক্টে বিশেষ অগ্রগতি। ফটকাবাজি বা জুয়ার মতো ঝুঁকিপূর্ণ ক্ষেত্র এড়িয়ে চলুন।",
      favorable_actions: [
        "প্রতিদিন ধ্যান, আত্মউন্নয়ন ও নির্জন আত্মানুসন্ধান করা",
        "গবেষণা, কোডিং, গভীর বিশ্লেষণাত্মক কাজে মনোনিবেশ করা",
        "জীবনকে সহজ-সরল করা ও নেতিবাচক সম্পর্ক থেকে দূরে থাকা",
        "নিঃস্বার্থ জনকল্যাণ ও সেবামূলক কাজে অংশ নেওয়া",
      ],
      cautions_and_pitfalls: [
        "আবেগতাড়িত হয়ে আকস্মিক চাকরি ত্যাগ বা কাজ ছাড়া এড়িয়ে চলুন",
        "অতি-বিচ্ছিন্ন হয়ে পরিবার ও আপনজনদের থেকে দূরে সরে যাবেন না",
        "মেরুদণ্ড, জয়েন্টের ব্যথা বা ইউরিনারি ইনফেকশন সম্পর্কে সচেতন থাকুন",
        "অযাচাইকৃত আর্থিক বা ব্যবসায়িক চুক্তি থেকে সাবধান থাকুন",
      ],
      remedies: [
        "রাস্তার কুকুরকে নিয়মিত মিষ্টি রুটি বা সাধারণ খাবার দিন (কেপি ও লাল কিতাব নিয়ম)",
        "প্রতিদিন কেতু গায়ত্রী মন্ত্র জপ করুন: 'ওঁ চিত্রবর্ণায় বিদ্মহে সর্প রূপায় ধীমহি তন্নঃ কেতুঃ প্রচোদয়াৎ'",
        "বাধা কাটাতে ভগবান শ্রী গণেশজির চরণে মোদক ও দূর্বা ঘাস নিবেদন করুন",
        "মাতামহ (দাদু/নানা)-এর সাথে সুসম্পর্ক ও শ্রদ্ধা বজায় রাখুন",
      ],
      lucky_day: "মঙ্গলবার / বৃহস্পতিবার",
      lucky_color: "ধূসর / বহুবর্ণ / স্মোকি ব্রাউন",
      deity: "শ্রী গণেশজি",
      beej_mantra: "ওঁ স্রাং স্রীং স্রৌং সঃ কেতবে নমঃ",
      gayatri_mantra: "ওঁ চিত্রবর্ণায় বিদ্মহে সর্প রূপায় ধীমহি তন্নঃ কেতুঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "आध्यात्मिक जागृति, अनावश्यक बंधनों से मुक्ति, शोध प्रवृत्ति, गहन अंतर्दृष्टि और पूर्व जन्म के कर्मों के समापन का समय।",
      career_and_wealth:
        "तकनीकी शोध, कोडिंग, डेटा विश्लेषण, गूढ़ विद्या और स्वतंत्र परियोजनाओं में विशेष उन्नति। सट्टेबाजी से बचें।",
      favorable_actions: [
        "नियमित ध्यान, आत्मनिरीक्षण और आध्यात्मिक साधना करें",
        "गहन शोध, कोडिंग और विश्लेषणात्मक कार्यों पर ध्यान केंद्रित करें",
        "जीवन को सरल बनाएं और नकारात्मक संगति से दूर रहें",
        "निःस्वार्थ सेवा और परोपकारी कार्यों में भाग लें",
      ],
      cautions_and_pitfalls: [
        "भावुक होकर अचानक नौकरी या व्यवसाय न छोड़ें",
        "परिवार और प्रियजनों से अत्यधिक दूरी न बनाएं",
        "रीढ़ की हड्डी, जोड़ों के दर्द और मूत्र संबंधी स्वास्थ्य का ध्यान रखें",
        "बिना जांचे-परखे किसी कानूनी अनुबंध पर हस्ताक्षर न करें",
      ],
      remedies: [
        "गली के कुत्तों को मीठी रोटी खिलाएं (केपी व लाल किताब नियम)",
        "केतु गायत्री मंत्र का जप करें: 'ॐ चित्रवर्णाय विद्महे सर्परूपाय धीमहि तन्नो केतुः प्रचोदयात्'",
        "विघ्नहर्ता श्री गणेशजी को मोदक और दूर्वा अर्पित करें",
        "नानाजी का सम्मान करें और उनके साथ मधुर संबंध रखें",
      ],
      lucky_day: "मंगलवार / गुरुवार",
      lucky_color: "धूसर (Grey) / बहुरंगी / भूरा",
      deity: "भगवान श्री गणेश",
      beej_mantra: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
      gayatri_mantra: "ॐ चित्रवर्णाय विद्महे सर्परूपाय धीमहि तन्नो केतुः प्रचोदयात्",
    },
  },
  Venus: {
    en: {
      overview:
        "Period of material abundance, romantic harmony, artistic excellence, vehicle and home comforts, social charm, and elevated luxury.",
      career_and_wealth:
        "Booming financial gains, high success in creative arts, tech, media, luxury goods, design, cosmetics, and diplomatic partnerships.",
      favorable_actions: [
        "Invest in creative, tech, media, branding, and design initiatives",
        "Nurture relationships, marital bliss, and strategic business alliances",
        "Acquire vehicles, interior enhancements, or property investments",
        "Cultivate refined public presentation, diplomacy, and charm",
      ],
      cautions_and_pitfalls: [
        "Avoid reckless expenditures on superficial status symbols",
        "Beware of overindulgence, hormonal imbalances, and blood sugar issues",
        "Do not compromise ethics or transparency in financial dealings",
        "Prevent ego friction in romantic and domestic partnerships",
      ],
      remedies: [
        "Serve green fodder to cows or care for animals on Fridays",
        "Chant Venus Gayatri Mantra: 'Om Rajad abhaaya vidmahe, Brigu suthaya dhimahi, Tanno sukrah prachodayat !'",
        "Offer white sweets or mishri to Goddess Mahalakshmi on Friday evenings",
        "Wear fresh, neat attire and subtle floral fragrances",
      ],
      lucky_day: "Friday",
      lucky_color: "Pearl White / Cream / Soft Pink",
      deity: "Goddess Mahalakshmi",
      beej_mantra: "Om Dram Dreem Droum Sah Shukraya Namah",
      gayatri_mantra: "Om Rajad abhaaya vidmahe, Brigu suthaya dhimahi, Tanno sukrah prachodayat !",
    },
    bn: {
      overview:
        "সুখ-স্বাচ্ছন্দ্য, অর্থপ্রাপ্তি, প্রেম-রোমান্স, বৈবাহিক আনন্দ, সৃজনশীল আর্টস, গাড়ি বা বাসস্থান ক্রয় এবং সমাজে প্রভাব ও আকর্ষণ বৃদ্ধির সুবর্ণ সময়।",
      career_and_wealth:
        "ডিজাইন, টেকনোলজি, মিডিয়া, ফ্যাশন, প্রসাধন, ব্র্যান্ডিং এবং পাবলিক রিলেশনে প্রচুর আর্থিক সমৃদ্ধি ও অগ্রগতি।",
      favorable_actions: [
        "সৃজনশীল উদ্যোগ, ডিজাইন, মিডিয়া ও ব্র্যান্ডিংয়ে বিনিয়োগ",
        "দাম্পত্য সম্পর্ক মজবুত করা ও ব্যবসায়িক অংশীদারিত্ব জোরদার করা",
        "নতুন গাড়ি, বিলাসবহুল আসবাব বা প্রপার্টিতে সুচিন্তিত বিনিয়োগ",
        "কূটনৈতিক শিষ্টাচার ও শালীন ব্যক্তিত্ব বজায় রেখে নেটওয়ার্কিং",
      ],
      cautions_and_pitfalls: [
        "লোকদেখানো অপচয় ও অপ্রয়োজনীয় বিলাসিতায় লাগাম টানুন",
        "অতিরিক্ত মিষ্টি খাওয়া, ডায়াবেটিস ও হরমোনাল ভারসাম্যহীনতা থেকে সাবধান",
        "অনৈতিক সম্পর্ক ও পার্টনারের সাথে অপ্রয়োজনীয় অহংকার এড়িয়ে চলুন",
        "আর্থিক লেনদেনে অস্বচ্ছতা পরিহার করুন",
      ],
      remedies: [
        "শুক্রবার সকালে গরুকে কাঁচা ঘাস বা সবুজ খাবার খাওয়ান",
        "মা লক্ষ্মীর আরাধনা করুন এবং শুক্রবার সন্ধ্যায় সাদা মিষ্টি বা মিছরি ভোগ দিন",
        "শুক্র গায়ত্রী মন্ত্র জপ করুন: 'ওঁ রজদাভায় বিদ্মহে ভৃগুসুতায় ধীমহি তন্নঃ শুক্ৰঃ প্রচোদয়াৎ'",
        "সর্বদা পরিষ্কার-পরিচ্ছন্ন বস্ত্র পরিধান করুন ও মনোরম সুগন্ধি ব্যবহার করুন",
      ],
      lucky_day: "শুক্রবার",
      lucky_color: "দুধে-সাদা / ক্রিম / হালকা গোলাপি",
      deity: "মা মহালক্ষ্মী",
      beej_mantra: "ওঁ দ্রাং দ্রীং দ্রৌং সঃ শুক্রায় নমঃ",
      gayatri_mantra: "ওঁ রজদাভায় বিদ্মহে ভৃগুসুতায় ধীমহি তন্নঃ শুক্ৰঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "भौतिक सुख-समृद्धि, वैवाहिक आनंद, कलात्मक रचनात्मकता, वाहन व गृह सुख, आकर्षण और समाज में मान-सम्मान का स्वर्णिम काल।",
      career_and_wealth:
        "डिजाइन, तकनीकी कला, मीडिया, फैशन, विलासिता उत्पाद और साझेदारी व्यापार में उत्कृष्ट वित्तीय लाभ।",
      favorable_actions: [
        "रचनात्मक कार्यों, मीडिया, डिजाइन और ब्रांडिंग में निवेश करें",
        "दाम्पत्य संबंधों और व्यावसायिक साझेदारियों को सुदृढ़ करें",
        "वाहन, गृह सज्जा या सुख-सुविधाओं की संपत्ति खरीदें",
        "शिष्ट व्यवहार और आकर्षक व्यक्तित्व के साथ नेटवर्क बढ़ाएं",
      ],
      cautions_and_pitfalls: [
        "दिखावे और अनावश्यक फिजूलखर्ची पर नियंत्रण रखें",
        "मधुमेह, हार्मोनल असंतुलन और त्वचा रोगों से सतर्क रहें",
        "अनैतिक संबंधों और अहंकार के टकराव से बचें",
        "वित्तीय लेन-देन में पूर्ण पारदर्शिता बनाए रखें",
      ],
      remedies: [
        "शुक्रवार को गाय को हरा चारा खिलाएं",
        "शुक्र गायत्री मंत्र का जप करें: 'ॐ रजदाभाय विद्महे भृगुसुताय धीमहि तन्नो शुक्रः प्रचोदयात्'",
        "शुक्रवार शाम माता महालक्ष्मी को सफेद मिठाई या मिश्री का भोग लगाएं",
        "स्वच्छ, सुव्यवस्थित वस्त्र पहनें और सुगंधित इत्र का प्रयोग करें",
      ],
      lucky_day: "शुक्रवार",
      lucky_color: "सफेद / क्रीम / हल्का गुलाबी",
      deity: "माता महालक्ष्मी",
      beej_mantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
      gayatri_mantra: "ॐ रजदाभाय विद्महे भृगुसुताय धीमहि तन्नो शुक्रः प्रचोदयात्",
    },
  },
  Sun: {
    en: {
      overview:
        "Dynamic rise in self-confidence, leadership, vital life force, executive status, authority, and recognition from government or corporate superiors.",
      career_and_wealth:
        "Promotions to authoritative ranks, administrative honors, government contracts, brand elevation, and executive authority.",
      favorable_actions: [
        "Step up to command high-impact projects and leadership positions",
        "Strengthen bonds with father, mentors, and senior leaders",
        "Adopt early morning routines, rigorous discipline, and fitness regimes",
        "Pursue competitive examinations, licenses, and public authorizations",
      ],
      cautions_and_pitfalls: [
        "Keep ego, haughtiness, and authoritarian anger strictly in check",
        "Avoid head-on clashes with father, state officials, or superiors",
        "Monitor blood pressure, cardiovascular health, and eye strain",
        "Do not disregard the feedback and contributions of team members",
      ],
      remedies: [
        "Offer pure water (Arghya) in a copper vessel to the rising Sun daily",
        "Chant Sun Gayatri Mantra: 'Om Asva dhvajaya vidmahe, pasha hasteye dhimahi, Tanno Suryah prachodayat !'",
        "Recite Aditya Hridaya Stotra on Sundays for victory in endeavors",
        "Donate jaggery, wheat, or copper vessels to the needy on Sundays",
      ],
      lucky_day: "Sunday",
      lucky_color: "Ruby Red / Saffron / Golden Amber",
      deity: "Lord Surya / Lord Shiva",
      beej_mantra: "Om Hram Hreem Hroum Sah Suryaya Namah",
      gayatri_mantra: "Om Asva dhvajaya vidmahe, pasha hasteye dhimahi, Tanno Suryah prachodayat !",
    },
    bn: {
      overview:
        "আত্মবিশ্বাস বৃদ্ধি, নেতৃত্ব দেওয়ার সুযোগ, উচ্চপদস্থ কর্মকর্তা বা সরকারের কাছ থেকে সম্মান ও স্বীকৃতি এবং প্রভাবশালী ব্যক্তিত্ব গঠন।",
      career_and_wealth:
        "প্রমোশন, প্রশাসনিক ক্ষমতা বৃদ্ধি, সরকারি কাজ বা কনসাল্টিংয়ে সাফল্য এবং ব্র্যান্ডের মর্যাদা বৃদ্ধি।",
      favorable_actions: [
        "দায়িত্বপূর্ণ নেতৃত্ব গ্রহণ করা ও বড় প্রকল্পে আত্মবিশ্বাস দেখানো",
        "পিতা, গুরুজন ও উচ্চপদস্থ কর্মকর্তাদের সাথে সুসম্পর্ক স্থাপন",
        "সূর্যোদয়ের সাথে দিন শুরু করা ও স্বাস্থ্যকর নিয়মনিষ্ঠ রুটিন মেনে চলা",
        "প্রতিযোগিতামূলক পরীক্ষা ও সরকারি অনুমোদনের কাজে উদ্যোগ নেওয়া",
      ],
      cautions_and_pitfalls: [
        "অহংকার, ক্রোধ ও একনায়কতান্ত্রিক মনোভাব নিয়ন্ত্রণে রাখা",
        "পিতা বা উচ্চপদস্থ বসের সাথে অহেতুক বিরোধ এড়িয়ে চলা",
        "রক্তচাপ, হৃদযন্ত্রের যত্ন ও চোখের স্ট্রেইন মনিটর করা",
        "সহকর্মীদের পরামর্শ ও অবদানকে উপেক্ষা না করা",
      ],
      remedies: [
        "প্রতিদিন সকালে তামার পাত্রে সূর্যদেবকে অর্ঘ্য (জল) নিবেদন করুন",
        "সূর্য গায়ত্রী মন্ত্র পাঠ করুন: 'ওঁ অশ্বধ্বজায় বিদ্মহে পাশহস্তায় ধীমহি তন্নঃ সূর্যঃ প্রচোদয়াৎ'",
        "রবিবার গুড়, গম বা তামার বাসন দরিদ্র ব্যক্তিকে দান করুন",
        "পিতা ও জ্যেষ্ঠ ব্যক্তিদের সেবা ও শ্রদ্ধা করুন",
      ],
      lucky_day: "রবিবার",
      lucky_color: "জাফরান / রক্তলাল / সোনালী",
      deity: "সূর্যদেব / শ্রী দেবাদিদেব মহাদেব",
      beej_mantra: "ওঁ হ্রাং হ্রীং হ্রৌং সঃ সূর্যায় নমঃ",
      gayatri_mantra: "ওঁ অশ্বধ্বজায় বিদ্মহে পাশহস্তায় ধীমহি তন্নঃ সূর্যঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "आत्मविश्वास, नेतृत्व क्षमता, प्राण ऊर्जा, अधिकार, प्रतिष्ठा और शासन-प्रशासन से मान-सम्मान में प्रबल वृद्धि।",
      career_and_wealth:
        "पदोन्नति, उच्च प्रशासनिक पद, सरकारी अनुबंध और कार्यक्षेत्र में प्रमुख प्रभाव का योग।",
      favorable_actions: [
        "महत्वपूर्ण परियोजनाओं का नेतृत्व संभालें और साहस दिखाएं",
        "पिता, वरिष्ठ अधिकारियों और गुरुजनों से मार्गदर्शन प्राप्त करें",
        "प्रातःकाल जल्दी उठने और अनुशासित दिनचर्या का पालन करें",
        "प्रतियोगी परीक्षाओं और सरकारी कार्यों में पूर्ण प्रयास करें",
      ],
      cautions_and_pitfalls: [
        "अहंकार, क्रोध और तानाशाही रवैये पर नियंत्रण रखें",
        "पिता या उच्चाधिकारियों से व्यर्थ टकराव न करें",
        "रक्तचाप, हृदय स्वास्थ्य और आंखों का ध्यान रखें",
        "सहयोगियों के विचारों की उपेक्षा न करें",
      ],
      remedies: [
        "प्रतिदिन प्रातः तांबे के लोटे से सूर्यदेव को जल अर्पित करें",
        "सूर्य गायत्री मंत्र का जप करें: 'ॐ अश्वध्वजाय विद्महे पाशहस्ताय धीमहि तन्नो सूर्यः प्रचोदयात्'",
        "रविवार को आदित्य हृदय स्तोत्र का पाठ करें",
        "रविवार को गुड़, गेहूं या तांबे के बर्तन का दान करें",
      ],
      lucky_day: "रविवार",
      lucky_color: "केसरिया / स्वर्णिम / लाल",
      deity: "भगवान सूर्य / भगवान शिव",
      beej_mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
      gayatri_mantra: "ॐ अश्वध्वजाय विद्महे पाशहस्ताय धीमहि तन्नो सूर्यः प्रचोदयात्",
    },
  },
  Moon: {
    en: {
      overview:
        "Heightened mental sensitivity, creative imagination, popularity among masses, journeys, family warmth, and emotional peace.",
      career_and_wealth:
        "Success in client-facing businesses, marketing, public relations, hospitality, food, liquid commodities, and creative professions.",
      favorable_actions: [
        "Focus on creative writing, public networking, and intuitive decision-making",
        "Build strong emotional bonds with mother and family members",
        "Engage in meditation and mindfulness to maintain emotional serenity",
        "Travel to serene waterfronts or natural retreats to recharge creative energy",
      ],
      cautions_and_pitfalls: [
        "Avoid emotional overthinking, mood swings, and pessimistic worries",
        "Never make major financial commitments during high emotional states",
        "Take care of respiratory health, cough, cold, and hydration balance",
        "Do not allow emotional guilt to compromise your business boundaries",
      ],
      remedies: [
        "Perform Jalabhishek on Shiva Lingam with pure water and milk on Mondays",
        "Keep a vessel of water or milk near headside at night and pour on a plant at dawn",
        "Chant Moon Gayatri Mantra: 'Om Nisa karaaya vidmahe, kalanaathaya dhimahi, Tanno Somah prachodayat !'",
        "Donate white rice, milk, or white clothes to elderly women on Mondays",
      ],
      lucky_day: "Monday",
      lucky_color: "Silver / Pearl White / Light Blue",
      deity: "Lord Shiva / Goddess Parvati",
      beej_mantra: "Om Shram Shreem Shroum Sah Chandraya Namah",
      gayatri_mantra: "Om Nisa karaaya vidmahe, kalanaathaya dhimahi, Tanno Somah prachodayat !",
    },
    bn: {
      overview:
        "মানসিক সংবেদনশীলতা, সৃজনশীল কল্পনাশক্তি, জনসমাদর, দেশ-বিদেশ ভ্রমণ এবং পারিবারিক শান্তি ও মাতৃস্নেহ বৃদ্ধির সময়।",
      career_and_wealth:
        "পাবলিক রিলেশন, মার্কেটিং, খাদ্য ও আতিথেয়তা, জলভিত্তিক পণ্য, ক্রিয়েটিভ লেখালেখিতে উন্নতি ও তরল অর্থের প্রবাহ বৃদ্ধি।",
      favorable_actions: [
        "সৃজনশীল কাজে মন দেওয়া ও দূরদর্শী পরিকল্পনা গ্রহণ",
        "মায়ের যত্ন নেওয়া ও পারিবারিকভাবে শান্ত পরিবেশ গড়ে তোলা",
        "প্রতিদিন মেডিটেশন করে মনের স্থিরতা বজায় রাখা",
        "শান্ত জলাশয় বা প্রাকৃতিক পরিবেশে ভ্রমণ করে ক্লান্তি দূর করা",
      ],
      cautions_and_pitfalls: [
        "অতিরিক্ত চিন্তা (Overthinking), মুড সুইং ও অমূলক দুশ্চিন্তা এড়ানো",
        "অতি-আবেগে পড়ে কোনো বড় আর্থিক চুক্তি বা বিনিয়োগ না করা",
        "সর্দি, কাশি, ফুসফুস ও শরীরে জলের ভারসাম্যহীনতা থেকে সাবধান",
        "ব্যবসায় অতিরিক্ত অন্ধ বিশ্বাস পরিহার করা",
      ],
      remedies: [
        "সোমবার শিবলিঙ্গে জল ও কাঁচা দুধ দিয়ে জলাভিষেক করুন",
        "রাত্রে মাথার কাছে জল বা দুধ রেখে সকালে কাঁটাযুক্ত গাছে ঢালুন (কেপি নিয়ম)",
        "চন্দ্র গায়ত্রী মন্ত্র জপ করুন: 'ওঁ নিশাকরায় বিদ্মহে কলানাথায় ধীমহি তন্নঃ সোমঃ প্রচোদয়াৎ'",
        "সোমবার বয়স্ক কোনো নারীকে সাদা চাল, দুধ বা বস্ত্র দান করুন",
      ],
      lucky_day: "সোমবার",
      lucky_color: "রুপালি / মুক্তা সাদা / হালকা আকাশি",
      deity: "ভগবান শিব ও মা পার্বতী",
      beej_mantra: "ওঁ শ্রাং শ্রীং শ্রৌং সঃ চন্দ্রায় নমঃ",
      gayatri_mantra: "ওঁ নিশাকরায় বিদ্মহে কলানাথায় ধীমহি তন্নঃ সোমঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "मानसिक संवेदनशीलता, रचनात्मकता, जनसंपर्क, यात्राएं, पारिवारिक सुख और मन की शांति का काल।",
      career_and_wealth:
        "विपणन (Marketing), परामर्श, खाद्य व्यवसाय, पेय पदार्थ, रचनात्मक लेखन और जनसेवा में उत्तम लाभ।",
      favorable_actions: [
        "रचनात्मक कार्यों और सहज अंतर्ज्ञान पर विश्वास करें",
        "माता की सेवा करें और पारिवारिक सौहार्द बढ़ाएं",
        "नियमित ध्यान और प्राणायाम से मन को शांत रखें",
        "प्राकृतिक जलस्रोतों के पास समय बिताकर ऊर्जा प्राप्त करें",
      ],
      cautions_and_pitfalls: [
        "अत्यधिक सोच (Overthinking), मनोदशा में उतार-चढ़ाव से बचें",
        "अति-भावुकता में कोई बड़ा वित्तीय फैसला न लें",
        "कफ, सर्दी और फेफड़ों के स्वास्थ्य का विशेष ध्यान रखें",
        "व्यापारिक मामलों में भावनात्मक दुर्बलता न आने दें",
      ],
      remedies: [
        "सोमवार को शिवलिंग पर शुद्ध जल व कच्चे दूध से अभिषेक करें",
        "रात को सिरहाने जल का लोटा रखें और सुबह किसी कांटेदार पौधे में डालें",
        "चंद्र गायत्री मंत्र का जप करें: 'ॐ निशाकराय विद्महे कलानाथाय धीमहि तन्नो सोमः प्रचोदयात्'",
        "सोमवार को वृद्ध महिला को सफेद चावल, दूध या वस्त्र दान करें",
      ],
      lucky_day: "सोमवार",
      lucky_color: "चांदी जैसा सफेद / मोती / हल्का नीला",
      deity: "भगवान शिव / माता पार्वती",
      beej_mantra: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
      gayatri_mantra: "ॐ निशाकराय विद्महे कलानाथाय धीमहि तन्नो सोमः प्रचोदयात्",
    },
  },
  Mars: {
    en: {
      overview:
        "High physical vitality, bold determination, overcoming adversaries, acquisition of landed property or vehicles, and decisive breakthroughs.",
      career_and_wealth:
        "Rapid progress in engineering, technical architecture, real estate, software systems, surgery, defense, and venture leadership.",
      favorable_actions: [
        "Channel intense drive into physical fitness, gym, sports, or martial arts",
        "Execute ambitious property acquisitions, renovations, or technical upgrades",
        "Stand firm and courageous in challenging negotiations and project milestones",
        "Inspire and command teams through high-pressure operational cycles",
      ],
      cautions_and_pitfalls: [
        "Rein in rash temper, reckless driving, and combative speech",
        "Exercise extreme caution to prevent sharp cuts, burns, or physical injuries",
        "Avoid bitter disputes over inheritance or property with younger siblings",
        "Refrain from impulsive financial speculation without thorough due diligence",
      ],
      remedies: [
        "Recite the Hanuman Chalisa or Kartikeya Stotra every Tuesday morning",
        "Chant Mars Gayatri Mantra: 'Om Angarkaya vidmahe, bhoomi palaya dhimahi, Tanno Kujah prachodayat !'",
        "Donate red lentils (masoor dal), copper, or jaggery on Tuesdays",
        "Practice deep, calming breathwork (Pranayama) to cool Martian heat",
      ],
      lucky_day: "Tuesday",
      lucky_color: "Bright Coral / Crimson Red / Scarlet",
      deity: "Lord Hanuman / Lord Kartikeya",
      beej_mantra: "Om Kram Kreem Kroum Sah Bhaumaya Namah",
      gayatri_mantra: "Om Angarkaya vidmahe, bhoomi palaya dhimahi, Tanno Kujah prachodayat !",
    },
    bn: {
      overview:
        "প্রবল আত্মবল, সাহস, প্রতিযোগীদের পরাজিত করার ক্ষমতা, জমি-বাড়ি বা গাড়ি অর্জন এবং সিদ্ধান্তমূলক কাজে সাফল্য।",
      career_and_wealth:
        "ইঞ্জিনিয়ারিং, রিয়েল এস্টেট, সফটওয়্যার আর্কিটেকচার, সার্জারি, ডিফেন্স ও কঠিন প্রজেক্ট ম্যানেজমেন্টে দ্রুত উন্নতি।",
      favorable_actions: [
        "শারীরিক কসরত, জিম, খেলাধুলা বা যোগব্যায়ামে শক্তিকে পরিচালিত করা",
        "প্রপার্টি ক্রয়, গৃহনির্মাণ বা কারিগরি কাজে অগ্রণী ভূমিকা নেওয়া",
        "চ্যালেঞ্জিং আলোচনায় নির্ভীক ও সুস্পষ্ট অবস্থান বজায় রাখা",
        "কাজের ক্ষেত্রে সময়মতো দৃঢ় সিদ্ধান্ত গ্রহণ করা",
      ],
      cautions_and_pitfalls: [
        "উগ্র মেজাজ, দ্রুত গাড়ি চালানো ও কটু ভাষা প্রয়োগ পরিহার করুন",
        "আগুন, ধারালো জিনিস ও রক্তপাতজনিত দুর্ঘটনা থেকে অতিরিক্ত সাবধান থাকুন",
        "ছোট ভাই বা বন্ধুদের সাথে জমি-সম্পত্তি নিয়ে তিক্ত বিবাদ এড়িয়ে চলুন",
        "অযাচাইকৃত আর্থিক ঝুঁকি বা জুয়ায় অর্থ বিনিয়োগ করবেন না",
      ],
      remedies: [
        "প্রতি মঙ্গলবার সকালে শ্রী হনুমান চালিসা বা কার্তিকেয় স্তোত্র পাঠ করুন",
        "মঙ্গল গায়ত্রী মন্ত্র জপ করুন: 'ওঁ অঙ্গারকায় বিদ্মহে ভূমিপালয় ধীমহি তন্নঃ কুজঃ প্রচোদয়াৎ'",
        "মঙ্গলবার লাল ডাল (মসুর ডাল), তামা বা গুড় দান করুন",
        "উষ্ণতা প্রশমিত করতে প্রাণায়াম ও দীর্ঘ শ্বাসের অভ্যাস করুন",
      ],
      lucky_day: "মঙ্গলবার",
      lucky_color: "রক্তলাল / প্রবাল / স্কারলেট",
      deity: "শ্রী হনুমানজি / ভগবান কার্তিকেয়",
      beej_mantra: "ওঁ ক্রাং ক্রীং ক্রৌং সঃ ভৌমায় নমঃ",
      gayatri_mantra: "ওঁ অঙ্গারকায় বিদ্মহে ভূমিপালয় ধীমহি তন্নঃ কুজঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "अदम्य साहस, पराक्रम, विरोधियों पर विजय, भूमि-भवन या वाहन का लाभ और साहसिक निर्णयों में सफलता।",
      career_and_wealth:
        "इंजीनियरिंग, रियल एस्टेट, तकनीकी प्रबंधन, रक्षा, चिकित्सा व सर्जरी में तेज गति से उन्नति।",
      favorable_actions: [
        "शारीरिक व्यायाम, जिम या योग में ऊर्जा को सकारात्मक दिशा दें",
        "भूमि, भवन निर्माण या तकनीकी कार्यों में सक्रियता दिखाएं",
        "कठिन परिस्थितियों में अडिग रहकर स्पष्ट निर्णय लें",
        "लक्ष्य प्राप्ति के लिए पूरे उत्साह से आगे बढ़ें",
      ],
      cautions_and_pitfalls: [
        "क्रोध, उतावलापन और कटु वाणी पर नियंत्रण रखें",
        "वाहन सावधानी से चलाएं, चोट-चपेट या अग्नि से सतर्क रहें",
        "छोटे भाइयों से संपत्ति या अन्य विवादों से बचें",
        "जोखिम भरे वित्तीय सट्टे में धन न लगाएं",
      ],
      remedies: [
        "प्रति मंगलवार श्री हनुमान चालीसा का पाठ करें",
        "मंगल गायत्री मंत्र का जप करें: 'ॐ अंगारकाय विद्महे भूमिपालाय धीमहि तन्नो कुजः प्रचोदयात्'",
        "मंगलवार को मसूर दाल, तांबा या गुड़ का दान करें",
        "शांत रहने के लिए नियमित भ्रामरी प्राणायाम करें",
      ],
      lucky_day: "मंगलवार",
      lucky_color: "लाल / मूंगा / गहरा संतरी",
      deity: "भगवान श्री हनुमान / भगवान कार्तिकेय",
      beej_mantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
      gayatri_mantra: "ॐ अंगारकाय विद्महे भूमिपालाय धीमहि तन्नो कुजः प्रचोदयात्",
    },
  },
  Rahu: {
    en: {
      overview:
        "Unconventional era of exponential expansion, global connections, breakthrough technologies, unexpected surprises, and high ambition.",
      career_and_wealth:
        "Phenomenal opportunities in digital technology, AI, foreign trade, media platforms, innovative startups, and unconventional ventures.",
      favorable_actions: [
        "Master advanced cutting-edge technologies and modern business strategies",
        "Explore international collaborations, foreign clients, and digital expansion",
        "Think outside conventional boundaries to disrupt and innovate in your industry",
        "Ensure meticulous compliance and legal review for every business contract",
      ],
      cautions_and_pitfalls: [
        "Beware of glittering illusions, speculative gambles, and get-rich-quick traps",
        "Strictly avoid intoxicants, dubious associations, and unethical shortcuts",
        "Guard against sudden paranoia, insomnia, and erratic lifestyle habits",
        "Verify all facts independently before reacting to unverified rumours",
      ],
      remedies: [
        "Donate radish or throw wooden coal into flowing water (as per KP & Lal Kitab)",
        "Chant Rahu Gayatri Mantra: 'Om Sook dantaya vidmahe, Ugra roopaya dhimahi, Tanno Rahuh Prachodayat !'",
        "Feed birds and fish with grains regularly on Saturday mornings",
        "Worship Goddess Saraswati or Lord Bhairava for intellectual clarity",
      ],
      lucky_day: "Saturday",
      lucky_color: "Electric Blue / Dark Charcoal / Indigo",
      deity: "Goddess Saraswati / Lord Bhairava",
      beej_mantra: "Om Bhram Bhreem Bhroum Sah Rahave Namah",
      gayatri_mantra: "Om Sook dantaya vidmahe, Ugra roopaya dhimahi, Tanno Rahuh Prachodayat !",
    },
    bn: {
      overview:
        "আকস্মিক রূপান্তর, দ্রুত বিশ্বব্যাপী প্রসার, ডিজিটাল টেকনোলজি ও ইন্টারনেটে বিরাট অগ্রগতি, উচ্চাভিলাষ এবং চমকপ্রদ পরিবর্তন।",
      career_and_wealth:
        "আইটি, কৃত্রিম বুদ্ধিমত্তা (AI), আন্তর্জাতিক ক্লায়েন্ট, মিডিয়া ও স্টার্টআপে বিপুল অগ্রগতি। অপ্রত্যাশিত অর্থাগম।",
      favorable_actions: [
        "অত্যাধুনিক প্রযুক্তি, ডিজিটাল প্রোডাক্ট ও অনলাইন স্ট্র্যাটেজি গ্রহণ",
        "আন্তর্জাতিক স্তরে নেটওয়ার্ক ও দূরবর্তী ক্লায়েন্টদের সাথে কাজের বিস্তার",
        "কনভেনশনাল নিয়মের বাইরে গিয়ে উদ্ভাবনী সমাধান তৈরি করা",
        "প্রতিটি চুক্তিপত্র ও আইনি ডকুমেন্টের পুঙ্খানুপুঙ্খ যাচাই করা",
      ],
      cautions_and_pitfalls: [
        "রাতভর ধনী হওয়ার প্রলোভন, জুয়া, বেটিং ও শর্টকাট থেকে দূরে থাকুন",
        "নেশাদ্রব্য, অসাধু লোক ও অনৈতিক কাজ কঠোরভাবে বর্জন করুন",
        "অহেতুক বিভ্রান্তি, অনিদ্রা ও অতিরিক্ত সন্দেহ প্রবণতা থেকে সাবধান",
        "গুজবে বিশ্বাস করে কোনো হঠকারী প্রতিক্রিয়া দেখাবেন না",
      ],
      remedies: [
        "শনিবার সকালে পাখি ও মাছকে শস্য বা খাবার দিন",
        "প্রবহমান জলে মূলা অথবা কাঠকয়লা বিসর্জন দিন (কেপি ও লাল কিতাব নিয়ম)",
        "রাহু গায়ত্রী মন্ত্র জপ করুন: 'ওঁ সূকদন্তায় বিদ্মহে উগ্ররূপায় ধীমহি তন্নঃ রাহুঃ প্রচোদয়াৎ'",
        "মানসিক স্বচ্ছতার জন্য মা সরস্বতী বা ভগবান ভৈরবের আরাধনা করুন",
      ],
      lucky_day: "শনিবার",
      lucky_color: "ইলেকট্রিক ব্লু / গাঢ় চারকোল / নেভি ব্লু",
      deity: "মা সরস্বতী / ভগবান শ্রী ভৈরব",
      beej_mantra: "ওঁ ভ্রাং ভ্রীং ভ্রৌং সঃ রাহবে নমঃ",
      gayatri_mantra: "ওঁ সূকদন্তায় বিদ্মহে উগ্ররূপায় ধীমহি তন্নঃ রাহুঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "आकस्मिक परिवर्तन, डिजिटल व इंटरनेट तकनीक में क्रांतिकारी प्रगति, विदेश से संबंध, उच्च महत्वाकांक्षा और अप्रत्याशित अवसर।",
      career_and_wealth:
        "आईटी, कृत्रिम बुद्धिमत्ता (AI), विदेशी व्यापार, मीडिया और नए स्टार्टअप्स में अपार वित्तीय सफलता।",
      favorable_actions: [
        "नवीनतम तकनीक और डिजिटल व्यापार रणनीतियों को अपनाएं",
        "वैश्विक संपर्कों और विदेशी क्लाइंट्स के साथ कार्य का विस्तार करें",
        "परंपरागत सीमाओं से बाहर निकलकर नवोन्मेषी समाधान खोजें",
        "सभी कानूनी दस्तावेजों की बारीकी से जांच करें",
      ],
      cautions_and_pitfalls: [
        "रातों-रात अमीर बनने के लालच, सट्टेबाजी और जुए से बचें",
        "नशे, संदिग्ध संगति और अनैतिक रास्तों से पूरी तरह दूर रहें",
        "भ्रम, अनिद्रा और व्यर्थ के वहम से बचें",
        "अफवाहों पर ध्यान न देकर तथ्यों की पुष्टि करें",
      ],
      remedies: [
        "शनिवार को पक्षियों और मछलियों को दाना डालें",
        "बहते जल में मूली या कच्चा कोयला प्रवाहित करें",
        "राहु गायत्री मंत्र का जप करें: 'ॐ सूकदन्ताय विद्महे उग्ररूपाय धीमहि तन्नो राहुः प्रचोदयात्'",
        "बुद्धि की स्पष्टता के लिए माता सरस्वती या भगवान भैरव की पूजा करें",
      ],
      lucky_day: "शनिवार",
      lucky_color: "गहरा नीला / चारकोल / स्लेटी",
      deity: "माता सरस्वती / भगवान भैरव",
      beej_mantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
      gayatri_mantra: "ॐ सूकदन्ताय विद्महे उग्ररूपाय धीमहि तन्नो राहुः प्रचोदयात्",
    },
  },
  Jupiter: {
    en: {
      overview:
        "Golden era of supreme wisdom, divine protection, ethical achievements, intellectual mastery, financial security, and spiritual blessings.",
      career_and_wealth:
        "Prominent success in advisory, legal counsel, education, enterprise finance, institutional leadership, and publishing.",
      favorable_actions: [
        "Pursue advanced certifications, higher academics, and knowledge mastery",
        "Invest in stable, long-term wealth assets and value-driven enterprises",
        "Provide ethical mentorship and support noble educational charities",
        "Regularly seek the blessings and guidance of gurus, teachers, and elders",
      ],
      cautions_and_pitfalls: [
        "Guard against passive complacency and over-optimistic execution delays",
        "Monitor liver wellness, healthy body weight, and balanced sugar intake",
        "Do not assume verbal promises as guaranteed legal outcomes",
        "Avoid dogmatic or condescending attitudes during professional debates",
      ],
      remedies: [
        "Apply pure saffron (kesar) or sandalwood tilak on forehead and navel daily",
        "Chant Jupiter Gayatri Mantra: 'Om Sura achaarya Vidmahe, Sura shreshtaya dhimahi, tanno guruh prachodayat !'",
        "Donate yellow gram (chana dal), turmeric, or yellow fruits on Thursdays",
        "Read Vishnu Sahasranama or Brihaspati Stotra on Thursday mornings",
      ],
      lucky_day: "Thursday",
      lucky_color: "Golden Yellow / Saffron / Topaz",
      deity: "Lord Vishnu / Lord Brihaspati",
      beej_mantra: "Om Gram Greem Groum Sah Gurave Namah",
      gayatri_mantra: "Om Sura achaarya Vidmahe, Sura shreshtaya dhimahi, tanno guruh prachodayat !",
    },
    bn: {
      overview:
        "জ্ঞান, আধ্যাত্মিক সুরক্ষা, অর্থনৈতিক স্থিতিশীলতা, পারিবারিক সমৃদ্ধি, গুরুকৃপা এবং সৎ কর্মের জন্য সমাজে সম্মান লাভের পরম শুভ সময়।",
      career_and_wealth:
        "আইন, পরামর্শদাতা (Advisory), শিক্ষা, প্রতিষ্ঠান পরিচালনা, ফাইন্যান্স ও প্রকাশনায় অসাধারণ সাফল্য।",
      favorable_actions: [
        "উচ্চতর জ্ঞানার্জন, স্পেশাল সার্টিফিকেশন ও গুরুজনের সান্নিধ্য লাভ",
        "দীর্ঘমেয়াদী ও নির্ভরযোগ্য সম্পত্তিতে সুপরিকল্পিত বিনিয়োগ",
        "অন্যদের সৎ পরামর্শ দেওয়া ও শিক্ষা সংক্রান্ত দাতব্য কাজে সাহায্য করা",
        "গুরু, শিক্ষক ও পিতা-মাতার আশীর্বাদ নিয়মিত গ্রহণ করা",
      ],
      cautions_and_pitfalls: [
        "অতিরিক্ত নিশ্চিন্তভাব ও কাজে ঢিলেমি দেওয়ার প্রবণতা নিয়ন্ত্রণ করুন",
        "লিভারের যত্ন, অতিরিক্ত ওজন ও মিষ্টি খাবারে সংযম বজায় রাখুন",
        "কাউকে অতিরিক্ত অন্ধ বিশ্বাস করে অর্থনৈতিক গ্যারান্টি দেবেন না",
        "অন্যের ওপর নিজের মতামত চাপিয়ে দেওয়ার প্রবণতা বর্জন করুন",
      ],
      remedies: [
        "কপালে ও নাভিতে প্রতিদিন খাঁটি জাফরান (কেশর) বা চন্দনের তিলক লাগান",
        "বৃহস্পতি গায়ত্রী মন্ত্র জপ করুন: 'ওঁ সুরাচার্য্যায় বিদ্মহে সুরশ্রেষ্ঠায় ধীমহি তন্নো গুরুঃ প্রচোদয়াৎ'",
        "বৃহস্পতিবার ছোলার ডাল, হলুদ, কলা বা হলুদ মিষ্টি দান করুন",
        "বৃহস্পতিবার সকালে শ্রী বিষ্ণু সহস্রনাম বা বৃহস্পতি স্তোত্র পাঠ করুন",
      ],
      lucky_day: "বৃহস্পতিবার",
      lucky_color: "হলুদ / বাসন্তী / সোনালী",
      deity: "শ্রী হরি বিষ্ণু / দেবগুরু বৃহস্পতি",
      beej_mantra: "ওঁ গ্রাং গ্রীং গ্রৌং সঃ গুরবে নমঃ",
      gayatri_mantra: "ওঁ সুরাচার্য্যায় বিদ্মহে সুরশ্রেষ্ঠায় ধীমহি তন্নো গুরুঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "ज्ञान, ईश्वरीय कृपा, नीतिगत सफलता, आध्यात्मिक उन्नति, पारिवारिक सुख और समाज में प्रतिष्ठा का काल।",
      career_and_wealth:
        "परामर्श, शिक्षा, कानून, वित्तीय प्रबंधन, उच्च पद और बौद्धिक कार्यों में भारी सफलता।",
      favorable_actions: [
        "उच्च शिक्षा और ज्ञान संवर्धन में समय लगाएं",
        "दीर्घकालिक और सुरक्षित संपत्तियों में निवेश करें",
        "सद्परामर्श दें और शैक्षणिक कार्यों में सहयोग करें",
        "गुरुजनों, माता-पिता और विद्वानों का आशीर्वाद लें",
      ],
      cautions_and_pitfalls: [
        "अति-उत्साह या आलस्य में कार्य को अधूरा न छोड़ें",
        "लिवर स्वास्थ्य, वजन और शर्करा (शुगर) का ध्यान रखें",
        "मौखिक वादों पर पूर्ण विश्वास न कर लिखित अनुबंध करें",
        "कठोर या उपदेशात्मक व्यवहार से बचें",
      ],
      remedies: [
        "प्रतिदिन माथे और नाभि पर केसर या चंदन का तिलक लगाएं",
        "गुरु गायत्री मंत्र का जप करें: 'ॐ सुराचार्याय विद्महे सुरश्रेष्ठाय धीमहि तन्नो गुरुः प्रचोदयात्'",
        "गुरुवार को चने की दाल, हल्दी या पीले फल का दान करें",
        "गुरुवार को श्री विष्णु सहस्रनाम का पाठ करें",
      ],
      lucky_day: "गुरुवार",
      lucky_color: "पीला / स्वर्णिम / केसरिया",
      deity: "भगवान श्री हरि विष्णु / देवगुरु बृहस्पति",
      beej_mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
      gayatri_mantra: "ॐ सुराचार्याय विद्महे सुरश्रेष्ठाय धीमहि तन्नो गुरुः प्रचोदयात्",
    },
  },
  Saturn: {
    en: {
      overview:
        "Period of foundational karmic discipline, endurance, organizational mastery, structured perseverance, and permanent long-term stability.",
      career_and_wealth:
        "Enduring triumphs earned through systematic labor in law, heavy engineering, manufacturing, operations, and resilient leadership.",
      favorable_actions: [
        "Establish disciplined work routines, exceptional punctuality, and patience",
        "Build robust enterprise infrastructure, standard operating procedures, and assets",
        "Treat manual laborers, service staff, and subordinates with honor and dignity",
        "Focus on long-term sustainability rather than immediate gratification",
      ],
      cautions_and_pitfalls: [
        "Do not succumb to defeatist thinking, lethargy, or chronic procrastination",
        "Never mistreat or underpay working-class assistants and helpers",
        "Take preventive care of joint flexibility, dental health, and back ergonomics",
        "Do not look for lazy short-cuts—Saturn rewards solely sustained honest dedication",
      ],
      remedies: [
        "Perform Chhaya Daan: look at your shadow in mustard oil in a bowl and donate on Saturdays",
        "Light a sesame (til) oil lamp under a sacred Peepal tree on Saturday evenings",
        "Chant Saturn Gayatri Mantra: 'Om Sanaischaraya vidhamhe, Sooryaputraya dhimahi, Tanno manda prachodayat !'",
        "Donate black sesame, iron utensils, or warm blankets to underprivileged individuals",
      ],
      lucky_day: "Saturday",
      lucky_color: "Midnight Blue / Black / Slate",
      deity: "Lord Shani / Lord Shiva",
      beej_mantra: "Om Pram Preem Proum Sah Shanaishcharaya Namah",
      gayatri_mantra: "Om Sanaischaraya vidhamhe, Sooryaputraya dhimahi, Tanno manda prachodayat !",
    },
    bn: {
      overview:
        "জীবনের দীর্ঘস্থায়ী ভিত্তি গড়ার সময়। কঠোর পরিশ্রম, শৃঙ্খলা, ধৈর্য, বাস্তববাদ এবং দীর্ঘমেয়াদী সাফল্যের নিরাপত্তা নিশ্চিতকরণ।",
      career_and_wealth:
        "আইন, ভারী শিল্প, ইঞ্জিনিয়ারিং, ম্যানুফ্যাকচারিং, সিস্টেম অপারেশনস এবং একাগ্র গবেষণায় অবিচল উন্নতি।",
      favorable_actions: [
        "সময়ানুবর্তিতা, অটল শৃঙ্খলা ও কাজের প্রতি পূর্ণ একাগ্রতা বজায় রাখা",
        "দীর্ঘস্থায়ী ও সুদৃঢ় প্রাতিষ্ঠানিক পরিকাঠামো নির্মাণে মনোনিবেশ করা",
        "শ্রমজীবী ও সেবাকর্মীদের উপযুক্ত পারিশ্রমিক ও সসম্মান মর্যাদা প্রদান",
        "অপ্রয়োজনীয় অহংকার ত্যাগ করে নিরহংকার ও সত্যনিষ্ঠ থাকা",
      ],
      cautions_and_pitfalls: [
        "হতাশা, আলস্য ও কাজের দীর্ঘসূত্রিতা থেকে দূরে থাকুন",
        "অধস্তন কর্মচারী বা দরিদ্র মানুষদের অবহেলা বা অসম্মান করবেন না",
        "হাড়, দাঁত, স্নায়ু ও জয়েন্টের ব্যথার প্রতি বিশেষ যত্ন নিন",
        "শর্টকাট এড়িয়ে চলুন—শনিদেব কেবল সৎ পরিশ্রমেই পূর্ণ ফল দেন",
      ],
      remedies: [
        "ছায়া দান: একটি বাটিতে সর্ষের তেল নিয়ে নিজের ছায়া দেখে শনিবার দান করুন (কেপি নিয়ম)",
        "শনিবার সন্ধ্যায় অশ্বত্থ (পিপল) গাছের নিচে তিলের তেলের প্রদীপ প্রজ্বলন করুন",
        "শনি গায়ত্রী মন্ত্র জপ করুন: 'ওঁ শনৈশ্চরায় বিদ্মহে সূর্যপুত্রায় ধীমহি তন্নো মন্দঃ প্রচোদয়াৎ'",
        "অসহায় দরিদ্র ব্যক্তিদের কালো তিল, লোহার সামগ্রী বা শীতবস্ত্র দান করুন",
      ],
      lucky_day: "শনিবার",
      lucky_color: "নীল / কালো / স্লেট গ্রে",
      deity: "শনিদেব / দেবাদিদেব মহাদেব",
      beej_mantra: "ওঁ প্রাং প্রীং প্রৌং সঃ শনৈশ্চরায় নমঃ",
      gayatri_mantra: "ওঁ শনৈশ্চরায় বিদ্মহে সূর্যপুত্রায় ধীমহি তন্নো মন্দঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "जीवन की मजबूत नींव रखने का समय। कठोर परिश्रम, अनुशासन, धैर्य और दीर्घकालिक स्थायी सफलता का काल।",
      career_and_wealth:
        "कानून, विनिर्माण (Manufacturing), इंजीनियरिंग, परिचालन और सतत प्रयासों से प्राप्त स्थाई उपलब्धि।",
      favorable_actions: [
        "कठोर कार्य अनुशासन, समयबद्धता और धैर्य का पालन करें",
        "मजबूत व्यवस्था और दीर्घकालिक योजनाओं पर ध्यान दें",
        "श्रमजीवियों और सहायकों का पूर्ण सम्मान करें और उचित पारिश्रमिक दें",
        "अहंकार से दूर रहकर सत्य और सादगी से कार्य करें",
      ],
      cautions_and_pitfalls: [
        "निराशा, आलस्य और काम टालने की आदत से बचें",
        "अधीनस्थ कर्मचारियों का कभी अपमान या शोषण न करें",
        "हड्डियों, जोड़ों और दांतों के स्वास्थ्य का ध्यान रखें",
        "शॉर्टकट से बचें—शनिदेव केवल सच्चे परिश्रम का ही फल देते हैं",
      ],
      remedies: [
        "छाया दान: शनिवार को कटोरी में सरसों का तेल भरकर अपना चेहरा देखें और दान करें",
        "शनिवार शाम पीपल के वृक्ष के नीचे तिल के तेल का दीपक जलाएं",
        "शनि गायत्री मंत्र का जप करें: 'ॐ शनैश्चराय विद्महे सूर्यपुत्राय धीमहि तन्नो मन्दः प्रचोदयात्'",
        "निर्धनों को काले तिल, कंबल या लोहे की वस्तुएं दान करें",
      ],
      lucky_day: "शनिवार",
      lucky_color: "गहरा नीला / काला / सलेटी",
      deity: "भगवान शनिदेव / भगवान शिव",
      beej_mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
      gayatri_mantra: "ॐ शनैश्चराय विद्महे सूर्यपुत्राय धीमहि तन्नो मन्दः प्रचोदयात्",
    },
  },
  Mercury: {
    en: {
      overview:
        "Period of intellectual agility, commercial diplomacy, sharp analytical skills, persuasive communication, and expansive networking.",
      career_and_wealth:
        "High-volume growth in commerce, software development, data science, financial trading, public relations, and advisory services.",
      favorable_actions: [
        "Launch new entrepreneurial projects, digital trading channels, and communication hubs",
        "Sharpen technical coding, mathematical models, and persuasive writing skills",
        "Broaden high-value professional networks and client negotiations",
        "Maintain organized accounts, systematic contracts, and transparent records",
      ],
      cautions_and_pitfalls: [
        "Avoid cognitive overload, nervous exhaustion, and over-committing deadlines",
        "Guard against deceptive promises, manipulative speech, or biting sarcasm",
        "Protect nervous system balance, skin allergy triggers, and vocal health",
        "Never sign contracts or legal agreements without verifying details thoroughly",
      ],
      remedies: [
        "Feed fresh green fodder or spinach to cows on Wednesday mornings",
        "Throw a round copper coin with a central hole into running water (as per KP & Lal Kitab)",
        "Chant Mercury Gayatri Mantra: 'Om Budha grahaya vidmahe, indu putraya dhimahi, Tanno somya prachodayat !'",
        "Worship Lord Ganesha with fresh Durva grass and green moong dal on Wednesdays",
      ],
      lucky_day: "Wednesday",
      lucky_color: "Emerald Green / Jade / Mint",
      deity: "Lord Ganesha / Lord Vishnu",
      beej_mantra: "Om Bram Breem Broum Sah Budhaya Namah",
      gayatri_mantra: "Om Budha grahaya vidmahe, indu putraya dhimahi, Tanno somya prachodayat !",
    },
    bn: {
      overview:
        "মেধার বিকাশ, উপস্থিত বুদ্ধি, ব্যবসায়িক সাফল্য, কার্যকর যোগাযোগ, নেটওয়ার্কিং ও দ্রুত হিসাব-নিকাশ করার অসাধারণ অনুকূল সময়।",
      career_and_wealth:
        "ট্রেডিং, সফটওয়্যার কোডিং, ডাটা সায়েন্স, পরামর্শ, গণমাধ্যম, লেখালেখি ও কমার্শিয়াল ডিলিংসে প্রচুর আয় ও অগ্রগতি।",
      favorable_actions: [
        "নতুন বাণিজ্যিক উদ্যোগ, ট্রেডিং চ্যানেল ও ডিজিটাল নেটওয়ার্কিং বিস্তার",
        "কোডিং, ডাটা অ্যানালাইটিক্স ও আধুনিক ভাষাগত দক্ষতা শাণিত করা",
        "গুরুত্বপূর্ণ ক্লায়েন্ট মিটিং ও অংশীদারিত্বমূলক চুক্তিতে সক্রিয় অংশ নেওয়া",
        "আয়-ব্যয়ের নিখুঁত হিসাব ও পরিষ্কার কাগজপত্র সংরক্ষণ করা",
      ],
      cautions_and_pitfalls: [
        "একসাথে অনেক কাজ হাতে নিয়ে স্নায়বিক দুর্বলতা বা চাপ তৈরি করবেন না",
        "দ্বিমুখী কথাবার্তা বা অতিরিক্ত চালাকি করা থেকে বিরত থাকুন",
        "ত্বক, অ্যালার্জি ও গলার স্বাস্থ্যের যত্ন নিন",
        "আইনি কাগজপত্র না পড়ে কোনো নথিতে সই করবেন না",
      ],
      remedies: [
        "বুধবার সকালে গরুকে সবুজ ঘাস বা পালং শাক খাওয়ান",
        "প্রবহমান জলে মাঝে ফুটোযুক্ত তামার মুদ্রা বিসর্জন দিন (কেপি ও লাল কিতাব নিয়ম)",
        "শ্রী গণেশজির চরণে সবুজ দূর্বা ঘাস ও লাড্ডু অর্পণ করুন",
        "বুধ গায়ত্রী মন্ত্র জপ করুন: 'ওঁ বুধগ্রহায় বিদ্মহে ইন্দু পুত্রায় ধীমহি তন্নো সৌম্যঃ প্রচোদয়াৎ'",
      ],
      lucky_day: "বুধবার",
      lucky_color: "পান্না সবুজ / প্যারট গ্রিন / হালকা সবুজ",
      deity: "শ্রী গণেশজি / শ্রী নারায়ণ",
      beej_mantra: "ওঁ ব্রাং ব্রীং ব্রৌং সঃ বুধায় নমঃ",
      gayatri_mantra: "ওঁ বুধগ্রহায় বিদ্মহে ইন্দু পুত্রায় ধীমহি তন্নো সৌম্যঃ প্রচোদয়াৎ",
    },
    hi: {
      overview:
        "तीव्र बौद्धिक विकास, व्यापारिक कुशलता, प्रभावी संवाद, विश्लेषण क्षमता और संपर्कों के विस्तार का समय।",
      career_and_wealth:
        "व्यापार, कोडिंग, डेटा विश्लेषण, जनसंपर्क, वित्तीय लेन-देन और लेखन में उत्तम आर्थिक उन्नति।",
      favorable_actions: [
        "नए व्यापारिक प्रोजेक्ट, डिजिटल ट्रेडिंग और संचार तंत्र शुरू करें",
        "तकनीकी कोडिंग, गणितीय समझ और प्रभावी संवाद को निखारें",
        "व्यावसायिक नेटवर्क और रणनीतिक समझौतों का विस्तार करें",
        "लेखा-जोखा और अनुबंधों का पूरा हिसाब व्यवस्थित रखें",
      ],
      cautions_and_pitfalls: [
        "मानसिक तनाव, नसों की कमजोरी और एक साथ कई काम हाथ में लेने से बचें",
        "कपटपूर्ण व्यवहार या व्यंग्यात्मक वाणी से बचें",
        "त्वचा, एलर्जी और वाणी तंत्र के स्वास्थ्य का ध्यान रखें",
        "बिना पढ़े किसी व्यावसायिक अनुबंध पर हस्ताक्षर न करें",
      ],
      remedies: [
        "बुधवार को गाय को हरा चारा या पालक खिलाएं",
        "बहते जल में छेद वाला तांबे का सिक्का प्रवाहित करें (केपी नियम)",
        "भगवान श्री गणेश को दूर्वा और मोदक अर्पित करें",
        "बुध गायत्री मंत्र का जप करें: 'ॐ बुधग्रहाय विद्महे इन्दुपुत्राय धीमहि तन्नो सौम्यः प्रचोदयात्'",
      ],
      lucky_day: "बुधवार",
      lucky_color: "पन्ना हरा / तोतिया हरा",
      deity: "भगवान श्री गणेश / श्री विष्णु",
      beej_mantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
      gayatri_mantra: "ॐ बुधग्रहाय विद्महे इन्दुपुत्राय धीमहि तन्नो सौम्यः प्रचोदयात्",
    },
  },
};
