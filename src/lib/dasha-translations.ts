import type { AstrologyLanguage } from "@/types";
import { translatePlanetName } from "./kundli-translations";

export interface DashaTranslations {
  // Tabs
  tabActiveRadar: string;
  tabVimshottari: string;
  tabYogini: string;
  tabPhala: string;
  tabTransitSandhi: string;
  tabTimelineRemedies: string;

  // Header & Badges
  badgeVimshottari: string;
  titleMain: string;
  subtitleMain: string;
  calculating: string;
  calculateBtn: string;
  resetBtn: string;
  profileSync: string;

  // Form Fields
  formFullName: string;
  formFullNamePlaceholder: string;
  formGender: string;
  formMale: string;
  formFemale: string;
  formOther: string;
  formDob: string;
  formTob: string;
  formPob: string;
  formPobPlaceholder: string;
  formMap: string;
  formAdvancedSettings: string;
  formAyanamsa: string;
  formTimezone: string;
  formFeatureDisabled: string;
  formFeatureInsufficientCoins: string;

  // Analyzed Details Card
  analyzedDetailsTitle: string;
  lagnaPrefix: string;
  moonPrefix: string;

  // Active Radar Section
  activeRadarTitle: string;
  activeRadarSubtitle: string;
  levelMahadasha: string;
  levelAntardasha: string;
  levelPratyantardasha: string;
  levelSookshma: string;
  levelPran: string;
  startDate: string;
  endDate: string;
  remainingDays: string;
  percentageCompleted: string;
  activePathTitle: string;
  antardashaProgress: string;
  mahadashaProgress: string;
  sookshmaTitle: string;
  underPratyantar: string;
  tableLord: string;
  tableStart: string;
  tableEnd: string;
  tableDuration: string;
  tableStatus: string;
  activeNow: string;

  // Vimshottari Tree
  vimshottariTreeTitle: string;
  drilldownHint: string;
  duration: string;
  currentTag: string;
  timeColumn: string;
  allMahadashas: string;
  stepper1: string;
  stepper2: string;
  stepper3: string;

  // Yogini
  yoginiTitle: string;
  yoginiSubtitle: string;
  startingYogini: string;
  balanceAtBirth: string;
  currentRunningYogini: string;
  currentSubYogini: string;
  cycleNumber: string;
  yoginiNature: string;
  rulerPlanet: string;
  yearsSuffix: string;
  runningTag: string;
  antarYoginisUnder: string;

  // Personalized Phala
  phalaTitle: string;
  phalaSubtitle: string;
  lagnaLabel: string;
  functionalRole: string;
  dignityLabel: string;
  placedInHouse: string;
  favorabilityScore: string;
  careerImpact: string;
  wealthImpact: string;
  relationshipImpact: string;
  healthImpact: string;
  gemstoneAlert: string;
  remedyAction: string;
  lagnaAnalysisSuffix: string;
  placedInHouseText: string;
  dignityText: string;

  // Transit & Sandhi
  transitSandhiTitle: string;
  sandhiAlertTitle: string;
  chidraAlertTitle: string;
  daysToTransition: string;
  transitPositionTitle: string;
  transitHouseFromMoon: string;
  sadeSatiTitle: string;
  sadeSatiActive: string;
  sadeSatiNone: string;
  synergyScore: string;
  transitionStabilityMsg: string;
  daysLeft: string;
  transitingIn: string;
  fromMoon: string;
  verdictLabel: string;

  // Life Timeline & Remedies
  timelineTitle: string;
  timelineSubtitle: string;
  ageSpan: string;
  ageLabel: string;
  yearsLabel: string;
  favorablePhase: string;
  neutralPhase: string;
  challengingPhase: string;
  authenticRemediesTitle: string;
  lalKitabRemedy: string;
  beejMantra: string;
  beejMantraInstruction: string;
  gayatriMantra: string;
  gayatriMantraInstruction: string;
  consultationCta: string;
  bookAstrologer: string;
  rashiKundliTitle: string;
}

export const DASHA_I18N: Record<AstrologyLanguage, DashaTranslations> = {
  bn: {
    tabActiveRadar: "বর্তমান লাইভ দশা",
    tabVimshottari: "বিংশোত্তরী ট্রি (৫ স্তর)",
    tabYogini: "যোগিনী দশা (৩৬ বছর)",
    tabPhala: "কুণ্ডলী দশাফল ও লগ্ন",
    tabTransitSandhi: "দশা সন্ধি ও গোচর",
    tabTimelineRemedies: "লাইফলাইন ও প্রতিকার",

    badgeVimshottari: "প্রামাণ্য বৈদিক ও কেপি দশা পদ্ধতি (১০০% নির্ভুল মহাদশা ও অন্তর্দশা)",
    titleMain: "দশা ক্যালকুলেটর - বিংশোত্তরী ও যোগিনী দশা বিশ্লেষণ",
    subtitleMain: "লাহিড়ী ও কৃষ্ণমূর্তি অয়নাংশের সাথে আপনার জন্মকালীন নির্ভুল বিংশোত্তরী (৫ স্তর), যোগিনী দশা, লগ্ন-ভিত্তিক দশাফল ও লাইভ গোচর সিনার্জি জানুন।",
    calculating: "দশার সূক্ষ্ম স্তরসমূহ গণনা করা হচ্ছে...",
    calculateBtn: "দশা গণনা করুন",
    resetBtn: "রিসেট",
    profileSync: "প্রোফাইল থেকে লোড করুন",

    formFullName: "পূর্ণ নাম",
    formFullNamePlaceholder: "আপনার নাম লিখুন",
    formGender: "লিঙ্গ",
    formMale: "পুরুষ",
    formFemale: "মহিলা",
    formOther: "অন্যান্য",
    formDob: "জন্ম তারিখ (দিন - মাস - বছর) *",
    formTob: "জন্ম সময় (ঘণ্টা : মিনিট : সেকেন্ড)",
    formPob: "জন্মস্থান *",
    formPobPlaceholder: "যেমন: Kolkata, West Bengal, India",
    formMap: "মানচিত্র",
    formAdvancedSettings: "উন্নত জ্যোতিষ সেটিংস (অয়নাংশ ও স্থানাঙ্ক)",
    formAyanamsa: "অয়নাংশ পদ্ধতি",
    formTimezone: "টাইমজোন অফসেট",
    formFeatureDisabled: "দশা ক্যালকুলেটর ফিচারটি বর্তমানে অ্যাডমিন দ্বারা বন্ধ রয়েছে।",
    formFeatureInsufficientCoins: "দশা গণনার জন্য পর্যাপ্ত কয়েন নেই। অনুগ্রহ করে কয়েন রিচার্জ করুন।",

    analyzedDetailsTitle: "বিশ্লেষিত জন্ম বিবরণ",
    lagnaPrefix: "লগ্ন:",
    moonPrefix: "চন্দ্র:",

    activeRadarTitle: "বর্তমান সক্রিয় দশা রাডার (Live Running Snapshot)",
    activeRadarSubtitle: "বর্তমান মুহূর্তে আপনার জীবন কোন কোন গ্রহের মহাদশা, অন্তর্দশা, প্রত্যন্তর্দশা, সূক্ষ্ম ও প্রাণ দশার অধীনে পরিচালিত হচ্ছে:",
    levelMahadasha: "মহাদশা (Major)",
    levelAntardasha: "অন্তর্দশা (Sub)",
    levelPratyantardasha: "প্রত্যন্তর্দশা (Sub-Sub)",
    levelSookshma: "সূক্ষ্ম দশা (Sookshma)",
    levelPran: "প্রাণ দশা (Pran)",
    startDate: "শুরু",
    endDate: "শেষ",
    remainingDays: "অবশিষ্ট দিন",
    percentageCompleted: "অতিক্রান্ত",
    activePathTitle: "বর্তমান সক্রিয় মহাজাগতিক প্রবাহ:",
    antardashaProgress: "অন্তর্দশার অগ্রগতি",
    mahadashaProgress: "মহাদশার অগ্রগতি",
    sookshmaTitle: "সূক্ষ্ম দশা (৪র্থ স্তরের অতি-সূক্ষ্ম সময়কাল)",
    underPratyantar: "প্রত্যন্তর্দশার অধীনে:",
    tableLord: "অধিপতি",
    tableStart: "আরম্ভ",
    tableEnd: "সমাপ্তি",
    tableDuration: "সময়কাল",
    tableStatus: "অবস্থা",
    activeNow: "বর্তমান সক্রিয়",

    vimshottariTreeTitle: "বিংশোত্তরী দশা ৫-স্তরের নির্ভুল সময়রেখা",
    drilldownHint: "যেকোনো সারিতে ক্লিক করে পরবর্তী সূক্ষ্ম স্তর ড্রিলডাউন করুন",
    duration: "স্থায়িত্ব",
    currentTag: "চলমান",
    timeColumn: "সময় (Time)",
    allMahadashas: "সকল মহাদশা",
    stepper1: "১. মহাদশা",
    stepper2: "২. অন্তর্দশা",
    stepper3: "৩. প্রত্যন্তর্দশা",

    yoginiTitle: "যোগিনী দশা (৩৬ বছরের বৈদিক চক্র)",
    yoginiSubtitle: "উত্তর ও পূর্ব ভারতের প্রাচীনতম প্রামাণ্য দশা পদ্ধতি, যা জীবনের আকস্মিক ঘটনা ও দ্রুত ফলপ্রসূতা নির্দেশ করে:",
    startingYogini: "জন্মকালীন আরম্ভ যোগিনী",
    balanceAtBirth: "জন্মকালীন অবশিষ্ট ভোগকাল",
    currentRunningYogini: "বর্তমান চলমান যোগিনী",
    currentSubYogini: "বর্তমান উপ-যোগিনী",
    cycleNumber: "চক্র নম্বর",
    yoginiNature: "প্রকৃতি ও প্রভাব",
    rulerPlanet: "নিয়ন্ত্রক গ্রহ",
    yearsSuffix: "বছর",
    runningTag: "চলমান",
    antarYoginisUnder: "-এর অধীনে অন্তর-যোগিনীসমূহ",

    phalaTitle: "কুণ্ডলী-ভিত্তিক ব্যক্তিগত দশাফল (Personalized Phala)",
    phalaSubtitle: "আপনার জন্মলগ্ন, ভাবাধিপত্য ও গ্রহাবস্থানের ভিত্তিতে প্রতিটি গ্রহের প্রকৃত ফলদান:",
    lagnaLabel: "জন্ম লগ্ন",
    functionalRole: "কার্যাত্মক ভূমিকা",
    dignityLabel: "গ্রহের অবস্থা (Dignity)",
    placedInHouse: "অবস্থানকারী ভাব",
    favorabilityScore: "অনুকূলতা স্কোর",
    careerImpact: "কর্ম ও জীবিকা প্রভাব",
    wealthImpact: "আর্থিক ভাগ্য ও সমৃদ্ধি",
    relationshipImpact: "সম্পর্ক ও পারিবারিক সুখ",
    healthImpact: "স্বাস্থ্য ও শারীরিক স্থিতি",
    gemstoneAlert: "রত্ন নির্দেশিকা ও সতর্কতা",
    remedyAction: "সুপারিশকৃত নিত্যকর্ম ও প্রতিকার",
    lagnaAnalysisSuffix: "লগ্ন বিচার",
    placedInHouseText: "ম ভাবে অবস্থিত",
    dignityText: "অবস্থা:",

    transitSandhiTitle: "দশা সন্ধি, ছিদ্র দশা ও লাইভ গোচর সিনার্জি",
    sandhiAlertTitle: "দশা সন্ধি ট্র্যাকার (Dasha Sandhi Alert)",
    chidraAlertTitle: "ছিদ্র দশা সতর্কতা (Chidra Dasha - মহাদশার শেষ অন্তর্দশা)",
    daysToTransition: "মহাদশা পরিবর্তনের বাকি",
    transitPositionTitle: "চলমান দশা লর্ডের বর্তমান গোচর অবস্থান (Live Transit)",
    transitHouseFromMoon: "জন্ম রাশি থেকে অবস্থান",
    sadeSatiTitle: "শনির সাড়ে সাতি ও ঢাইয়া স্থিতি",
    sadeSatiActive: "সাড়ে সাতি সক্রিয় রয়েছে",
    sadeSatiNone: "বর্তমানে সাড়ে সাতির কোনো প্রভাব নেই",
    synergyScore: "দশা-গোচর সমন্বয় স্কোর",
    transitionStabilityMsg: "দশা রূপান্তর স্থিতিশীলতা: আপনি বর্তমানে নিরাপদভাবে আপনার মহাদশার মধ্যবর্তী স্থিতিশীল পর্যায়ে অবস্থান করছেন।",
    daysLeft: "দিন বাকি",
    transitingIn: "রাশিতে গোচররত",
    fromMoon: "চন্দ্র থেকে",
    verdictLabel: "সারসংক্ষেপ ও ফল:",

    timelineTitle: "জীবন পরিক্রমা টাইমলাইন (Life Journey Timeline)",
    timelineSubtitle: "জন্ম থেকে বার্ধক্য পর্যন্ত আপনার জীবনের প্রতিটি দশার রূপরেখা ও শুভ/অশুভ পর্যায়:",
    ageSpan: "বয়স সীমা",
    ageLabel: "বয়স",
    yearsLabel: "বছর",
    favorablePhase: "শুভ ও উন্নতির সময়",
    neutralPhase: "সাধারণ বা মিশ্র সময়",
    challengingPhase: "সংগ্রাম ও সতর্কতামূলক সময়",
    authenticRemediesTitle: "প্রামাণ্য বৈদিক ও লাল কিতাব প্রতিকার ড্যাশবোর্ড",
    lalKitabRemedy: "লাল কিতাব উপাচার",
    beejMantra: "বীজ মন্ত্র",
    beejMantraInstruction: "প্রতিদিন প্রাতঃকালে পূর্বমুখী হয়ে তুলসী বা রুদ্রাক্ষ মালায় ১০৮ বার জপ করলে দশার সকল অশুভ প্রভাব প্রশমিত হয়।",
    gayatriMantra: "গায়ত্রী মন্ত্র",
    gayatriMantraInstruction: "সূর্যোদয়ের সময় গায়ত্রী মন্ত্র জপ করলে প্রধান দশা পরিবর্তনের সময় মহাজাগতিক ভারসাম্য বজায় থাকে।",
    consultationCta: "আপনার চলমান দশা ও ভবিষ্যৎ নিয়ে আমাদের অভিজ্ঞ বৈদিক জ্যোতিষীদের সাথে সরাসরি কথা বলুন।",
    bookAstrologer: "জ্যোতিষী পরামর্শ বুক করুন",
    rashiKundliTitle: "রাশি কুণ্ডলী ও ভাব চক্র",
  },
  en: {
    tabActiveRadar: "Live Active Dasha",
    tabVimshottari: "Vimshottari Tree (5-Tier)",
    tabYogini: "Yogini Dasha (36-Yr)",
    tabPhala: "Personalized Phala",
    tabTransitSandhi: "Transit & Sandhi",
    tabTimelineRemedies: "Timeline & Remedies",

    badgeVimshottari: "Authentic Vedic & KP Dasha Engine (100% Precision Mahadasha & Antardasha)",
    titleMain: "Dasha Calculator - Vimshottari & Yogini Timeline",
    subtitleMain: "Discover your exact active planetary periods (5-tier Vimshottari, Yogini Dasha, Lagna-specific personalized phala, Dasha Sandhi & real-time transit overlay).",
    calculating: "Calculating micro planetary periods...",
    calculateBtn: "Calculate Dasha",
    resetBtn: "Reset",
    profileSync: "Load from Profile",

    formFullName: "Full Name",
    formFullNamePlaceholder: "Enter your full name",
    formGender: "Gender",
    formMale: "Male",
    formFemale: "Female",
    formOther: "Other",
    formDob: "Date of Birth (DD - MM - YYYY) *",
    formTob: "Time of Birth (HH : MM : SS)",
    formPob: "Birth Place *",
    formPobPlaceholder: "e.g., Kolkata, West Bengal, India",
    formMap: "Map",
    formAdvancedSettings: "Advanced Astro Settings (Ayanamsa & Coords)",
    formAyanamsa: "Ayanamsa System",
    formTimezone: "Timezone Offset",
    formFeatureDisabled: "The Dasha calculator feature is temporarily disabled by admin.",
    formFeatureInsufficientCoins: "Insufficient coins for Dasha calculation. Please recharge coins.",

    analyzedDetailsTitle: "Analyzed Birth Details",
    lagnaPrefix: "Lagna:",
    moonPrefix: "Moon:",

    activeRadarTitle: "Live Active Dasha Radar Snapshot",
    activeRadarSubtitle: "Your life at this exact moment is ruled across 5 micro tiers of planetary vibrations:",
    levelMahadasha: "Mahadasha (Major)",
    levelAntardasha: "Antardasha (Sub)",
    levelPratyantardasha: "Pratyantardasha (Sub-Sub)",
    levelSookshma: "Sookshma Dasha (Micro)",
    levelPran: "Pran Dasha (Minute)",
    startDate: "Start Date",
    endDate: "End Date",
    remainingDays: "Days Remaining",
    percentageCompleted: "Elapsed",
    activePathTitle: "Current Active Vibrational Flow:",
    antardashaProgress: "Antardasha Progress",
    mahadashaProgress: "Mahadasha Progress",
    sookshmaTitle: "Sookshma Dashas (Level 4 Micro Periods)",
    underPratyantar: "Under Pratyantardasha:",
    tableLord: "Lord",
    tableStart: "Start",
    tableEnd: "End",
    tableDuration: "Duration",
    tableStatus: "Status",
    activeNow: "Active Now",

    vimshottariTreeTitle: "Vimshottari Dasha 5-Tier Astronomical Timeline",
    drilldownHint: "Click any row to drill down into deeper micro sub-periods",
    duration: "Duration",
    currentTag: "Current",
    timeColumn: "Exact Time",
    allMahadashas: "All Mahadashas",
    stepper1: "1. Mahadasha",
    stepper2: "2. Antardasha",
    stepper3: "3. Pratyantardasha",

    yoginiTitle: "Yogini Dasha (36-Year Classical Cycle)",
    yoginiSubtitle: "Ancient Parashara system widely celebrated in North and East India for rapid manifestation of events:",
    startingYogini: "Birth Starting Yogini",
    balanceAtBirth: "Unconsumed Balance at Birth",
    currentRunningYogini: "Active Major Yogini",
    currentSubYogini: "Active Sub Yogini",
    cycleNumber: "Cycle Number",
    yoginiNature: "Vibrational Nature",
    rulerPlanet: "Governing Planet",
    yearsSuffix: "Years",
    runningTag: "Running",
    antarYoginisUnder: "Antar-Yoginis (Sub-Periods) under",

    phalaTitle: "Personalized Kundli-Aware Dasha Phala",
    phalaSubtitle: "Real astrological effects tailored to your specific Ascendant (Lagna), planetary placement, and dignity:",
    lagnaLabel: "Ascendant (Lagna)",
    functionalRole: "Functional Role",
    dignityLabel: "Planetary Dignity",
    placedInHouse: "House Placement",
    favorabilityScore: "Favorability Score",
    careerImpact: "Career & Livelihood Outlook",
    wealthImpact: "Wealth & Financial Prosperity",
    relationshipImpact: "Family & Relationship Harmony",
    healthImpact: "Health & Vitality Balance",
    gemstoneAlert: "Gemstone Guidance & Warnings",
    remedyAction: "Recommended Vedic Remedies",
    lagnaAnalysisSuffix: "Lagna Analysis",
    placedInHouseText: "th House Placement",
    dignityText: "Dignity:",

    transitSandhiTitle: "Dasha Sandhi, Chidra Dasha & Live Transit Synergy",
    sandhiAlertTitle: "Dasha Sandhi Tracker",
    chidraAlertTitle: "Chidra Dasha Alert (Closing Antardasha of Mahadasha)",
    daysToTransition: "Days Until Mahadasha Transition",
    transitPositionTitle: "Active Dasha Lords Live Transit Positions",
    transitHouseFromMoon: "House Position From Moon",
    sadeSatiTitle: "Saturn Sade Sati & Dhaiya Status",
    sadeSatiActive: "Sade Sati is Currently Active",
    sadeSatiNone: "Currently Free from Sade Sati",
    synergyScore: "Dasha-Transit Synergy Score",
    transitionStabilityMsg: "Dasha Transition Stability: You are currently safely inside your stable mid-period of Mahadasha.",
    daysLeft: "Days Left",
    transitingIn: "Transiting in",
    fromMoon: "from Moon",
    verdictLabel: "Verdict:",

    timelineTitle: "Life Journey Visual Timeline",
    timelineSubtitle: "Visual map of planetary reigns from birth to mature age with favorable and challenging phases:",
    ageSpan: "Age Span",
    ageLabel: "Age",
    yearsLabel: "yrs",
    favorablePhase: "Favorable & Growth Phase",
    neutralPhase: "Balanced / Mixed Phase",
    challengingPhase: "Challenging / Transformation Phase",
    authenticRemediesTitle: "Authentic Vedic & Lal Kitab Remedies Dashboard",
    lalKitabRemedy: "Lal Kitab Remedy",
    beejMantra: "Beej Mantra",
    beejMantraInstruction: "Chant 108 times daily facing East using a Rudraksha or Tulsi mala to dissolve obstacles.",
    gayatriMantra: "Gayatri Mantra",
    gayatriMantraInstruction: "Reciting Gayatri Mantra at sunrise neutralizes malefic transit friction during major Dasha transitions.",
    consultationCta: "Consult our verified Vedic astrologers for deep planetary analysis and custom remedial pujas.",
    bookAstrologer: "Book Astrologer Consultation",
    rashiKundliTitle: "Rashi Kundli & Bhava Chart",
  },
  hi: {
    tabActiveRadar: "वर्तमान सक्रिय दशा",
    tabVimshottari: "विंशोत्तरी ट्री (५ स्तर)",
    tabYogini: "योगिनी दशा (३६ वर्ष)",
    tabPhala: "कुंडली दशाफल एवं लग्न",
    tabTransitSandhi: "दशा संधि एवं गोचर",
    tabTimelineRemedies: "जीवन रेखा एवं उपाय",

    badgeVimshottari: "प्रामाणिक वैदिक एवं केपी दशा प्रणाली (१००% सटीक महादशा व अंतर्दशा)",
    titleMain: "दशा कैलकुलेटर - विंशोत्तरी एवं योगिनी दशा विश्लेषण",
    subtitleMain: "लाहिड़ी एवं कृष्णमूर्ति अयनांश के साथ जन्मकालीन सटीक विंशोत्तरी (५ स्तर), योगिनी दशा, लग्न-आधारित फल एवं लाइव गोचर समन्वय जानें।",
    calculating: "दशा के सूक्ष्म स्तरों की गणना की जा रही है...",
    calculateBtn: "दशा गणना करें",
    resetBtn: "रीसेट",
    profileSync: "प्रोफ़ाइल से लोड करें",

    formFullName: "पूरा नाम",
    formFullNamePlaceholder: "अपना नाम दर्ज करें",
    formGender: "लिंग",
    formMale: "पुरुष",
    formFemale: "महिला",
    formOther: "अन्य",
    formDob: "जन्म तिथि (दिन - माह - वर्ष) *",
    formTob: "जन्म समय (घंटा : मिनट : सेकंड)",
    formPob: "जन्म स्थान *",
    formPobPlaceholder: "जैसे: New Delhi, India या Mumbai, India",
    formMap: "मानचित्र",
    formAdvancedSettings: "उन्नत ज्योतिष सेटिंग्स (अयनांश एवं निर्देशांक)",
    formAyanamsa: "अयनांश प्रणाली",
    formTimezone: "समय क्षेत्र ऑफ़सेट",
    formFeatureDisabled: "दशा कैलकुलेटर सुविधा वर्तमान में व्यवस्थापक द्वारा अक्षम है।",
    formFeatureInsufficientCoins: "दशा गणना के लिए पर्याप्त कॉइन नहीं हैं। कृपया कॉइन रिचार्ज करें।",

    analyzedDetailsTitle: "विश्लेषित जन्म विवरण",
    lagnaPrefix: "लग्न:",
    moonPrefix: "चन्द्र:",

    activeRadarTitle: "वर्तमान सक्रिय दशा राडार (Live Running Snapshot)",
    activeRadarSubtitle: "वर्तमान क्षण में आपका जीवन किन ग्रहों की महादशा, अंतर्दशा, प्रत्यंतर्दशा, सूक्ष्म एवं प्राण दशा के अधीन संचालित है:",
    levelMahadasha: "महादशा (Major)",
    levelAntardasha: "अंतर्दशा (Sub)",
    levelPratyantardasha: "प्रत्यंतर्दशा (Sub-Sub)",
    levelSookshma: "सूक्ष्म दशा (Sookshma)",
    levelPran: "प्राण दशा (Pran)",
    startDate: "आरंभ",
    endDate: "समाप्ति",
    remainingDays: "शेष दिन",
    percentageCompleted: "व्यतीत",
    activePathTitle: "वर्तमान सक्रिय खगोलीय प्रवाह:",
    antardashaProgress: "अंतर्दशा प्रगति",
    mahadashaProgress: "महादशा प्रगति",
    sookshmaTitle: "सूक्ष्म दशा (स्तर ४ अति-सूक्ष्म समयावधि)",
    underPratyantar: "प्रत्यंतर्दशा के अंतर्गत:",
    tableLord: "स्वामी",
    tableStart: "आरंभ",
    tableEnd: "समाप्ति",
    tableDuration: "अवधि",
    tableStatus: "स्थिति",
    activeNow: "वर्तमान सक्रिय",

    vimshottariTreeTitle: "विंशोत्तरी दशा ५-स्तरीय सटीक समयसीमा",
    drilldownHint: "गहरे सूक्ष्म स्तरों को देखने के लिए किसी भी पंक्ति पर क्लिक करें",
    duration: "अवधि",
    currentTag: "सक्रिय",
    timeColumn: "सटीक समय",
    allMahadashas: "सभी महादशाएं",
    stepper1: "१. महादशा",
    stepper2: "२. अंतर्दशा",
    stepper3: "३. प्रत्यंतर्दशा",

    yoginiTitle: "योगिनी दशा (३६ वर्षीय वैदिक चक्र)",
    yoginiSubtitle: "उत्तर एवं पूर्वी भारत की प्राचीनतम प्रामाणिक दशा पद्धति, जो घटनाओं की त्वरित फलीभूतता दर्शाती है:",
    startingYogini: "जन्मकालीन आरंभ योगिनी",
    balanceAtBirth: "जन्म समय शेष भोगकाल",
    currentRunningYogini: "वर्तमान सक्रिय योगिनी",
    currentSubYogini: "वर्तमान उप-योगिनी",
    cycleNumber: "चक्र संख्या",
    yoginiNature: "प्रकृति एवं प्रभाव",
    rulerPlanet: "स्वामी ग्रह",
    yearsSuffix: "वर्ष",
    runningTag: "सक्रिय",
    antarYoginisUnder: "के अंतर्गत अंतर-योगिनियां",

    phalaTitle: "कुंडली-आधारित व्यक्तिगत दशाफल (Personalized Phala)",
    phalaSubtitle: "आपके जन्म लग्न, भावाधिपत्य एवं ग्रह स्थिति के अनुसार प्रत्येक ग्रह का वास्तविक फलदान:",
    lagnaLabel: "जन्म लग्न",
    functionalRole: "कार्यात्मक भूमिका",
    dignityLabel: "ग्रह की स्थिति (Dignity)",
    placedInHouse: "स्थित भाव",
    favorabilityScore: "शुभता स्कोर",
    careerImpact: "करियर एवं आजीविका",
    wealthImpact: "आर्थिक स्थिति एवं धन",
    relationshipImpact: "पारिवारिक संबंध एवं सुख",
    healthImpact: "स्वास्थ्य एवं स्फूर्ति",
    gemstoneAlert: "रत्न परामर्श एवं चेतावनी",
    remedyAction: "अनुशंसित वैदिक उपाय",
    lagnaAnalysisSuffix: "लग्न विश्लेषण",
    placedInHouseText: "वें भाव में स्थित",
    dignityText: "स्थिति:",

    transitSandhiTitle: "दशा संधि, छिद्र दशा एवं लाइव गोचर समन्वय",
    sandhiAlertTitle: "दशा संधि ट्रैकर (Dasha Sandhi Alert)",
    chidraAlertTitle: "छिद्र दशा चेतावनी (Chidra Dasha - महादशा की अंतिम अंतर्दशा)",
    daysToTransition: "महादशा परिवर्तन में शेष दिन",
    transitPositionTitle: "सक्रिय दशा स्वामियों की वर्तमान गोचर स्थिति",
    transitHouseFromMoon: "जन्म राशि से भाव स्थिति",
    sadeSatiTitle: "शनि साढ़े साती एवं ढैया स्थिति",
    sadeSatiActive: "साढ़े साती वर्तमान में सक्रिय है",
    sadeSatiNone: "वर्तमान में साढ़े साती का प्रभाव नहीं है",
    synergyScore: "दशा-गोचर समन्वय स्कोर",
    transitionStabilityMsg: "दशा संक्रमण स्थिरता: आप वर्तमान में अपनी महादशा के स्थिर मध्य काल में सुरक्षित रूप से हैं।",
    daysLeft: "दिन शेष",
    transitingIn: "राशि में गोचररत",
    fromMoon: "चन्द्र से",
    verdictLabel: "निष्कर्ष:",

    timelineTitle: "जीवन यात्रा टाइमलाइन (Life Journey Timeline)",
    timelineSubtitle: "जन्म से वृद्धावस्था तक आपके संपूर्ण जीवन की महादशाओं का दृश्यमान मानचित्र:",
    ageSpan: "आयु सीमा",
    ageLabel: "आयु",
    yearsLabel: "वर्ष",
    favorablePhase: "शुभ एवं उन्नति काल",
    neutralPhase: "सामान्य / संतुलित काल",
    challengingPhase: "चुनौतीपूर्ण / परिवर्तन काल",
    authenticRemediesTitle: "प्रामाणिक वैदिक एवं लाल किताब उपाय डैशबोर्ड",
    lalKitabRemedy: "लाल किताब उपाय",
    beejMantra: "बीज मंत्र",
    beejMantraInstruction: "प्रतिदिन प्रातः पूर्व दिशा की ओर मुख करके रुद्राक्ष अथवा तुलसी माला से १०८ बार जप करने से दशा के समस्त दोष शांत होते हैं।",
    gayatriMantra: "गायत्री मंत्र",
    gayatriMantraInstruction: "सूर्योदय के समय गायत्री मंत्र का पाठ करने से महादशा परिवर्तन काल के प्रतिकूल प्रभाव निष्प्रभावी होते हैं।",
    consultationCta: "अपनी सक्रिय दशा एवं भविष्यफल के लिए हमारे अनुभवी वैदिक ज्योतिषियों से सीधे परामर्श लें।",
    bookAstrologer: "ज्योतिषी परामर्श बुक करें",
    rashiKundliTitle: "राशि कुंडली एवं भाव चक्र",
  },
};

/* ---------------------------------------------------------------------------
   Specialized Dynamic Translators for Results
   ------------------------------------------------------------------------- */
export function translateActivePath(path: string | undefined, lang: AstrologyLanguage): string {
  if (!path) return "";
  return path
    .split("/")
    .map((p) => {
      const trimmed = p.trim();
      return translatePlanetName(trimmed, lang) || trimmed;
    })
    .join(" / ");
}

export function translateFunctionalNature(nature: string | undefined, lang: AstrologyLanguage): string {
  if (!nature) return "";
  const n = nature.toLowerCase();
  if (n.includes("yogakaraka")) {
    return lang === "bn"
      ? "সর্বশ্রেষ্ঠ শুভ যোগকারক গ্রহ (Yogakaraka)"
      : lang === "hi"
      ? "सर्वश्रेष्ठ शुभ योगकारक ग्रह (Yogakaraka)"
      : "Supreme Yogakaraka";
  }
  if (n.includes("benefic")) {
    return lang === "bn"
      ? "শুভ ফলদায়ী গ্রহ (Functional Benefic)"
      : lang === "hi"
      ? "शुभ फलदायी ग्रह (Functional Benefic)"
      : "Functional Benefic";
  }
  if (n.includes("malefic")) {
    return lang === "bn"
      ? "অশুভ প্রতিকূল গ্রহ (Functional Malefic)"
      : lang === "hi"
      ? "अशुभ प्रतिकूल ग्रह (Functional Malefic)"
      : "Functional Malefic";
  }
  if (n.includes("maraka")) {
    return lang === "bn"
      ? "মারক অধিপতি (Maraka Planet)"
      : lang === "hi"
      ? "मारक अधिपति (Maraka Planet)"
      : "Maraka Planet";
  }
  if (n.includes("neutral")) {
    return lang === "bn"
      ? "নিরপেক্ষ সমগ্রহ (Neutral)"
      : lang === "hi"
      ? "तटस्थ समग्रह (Neutral)"
      : "Neutral Planet";
  }
  return nature;
}

export function translateDignity(dignity: string | undefined, lang: AstrologyLanguage): string {
  if (!dignity) return "";
  const d = dignity.toLowerCase();
  if (d.includes("exalt")) return lang === "bn" ? "তুঙ্গী / উচ্চস্থ (Exalted)" : lang === "hi" ? "उच्च (Exalted)" : "Exalted";
  if (d.includes("moolatrikona") || d.includes("mool"))
    return lang === "bn" ? "মূলত্রিকোণ (Moolatrikona)" : lang === "hi" ? "मूलत्रिकोण (Moolatrikona)" : "Moolatrikona";
  if (d.includes("own")) return lang === "bn" ? "স্বক্ষেত্রীয় (Own Sign)" : lang === "hi" ? "स्वक्षेत्रीय (Own Sign)" : "Own Sign";
  if (d.includes("great friend")) return lang === "bn" ? "অধি-মিত্র ক্ষেত্র" : lang === "hi" ? "अति-मित्र क्षेत्र" : "Great Friend";
  if (d.includes("friend")) return lang === "bn" ? "মিত্র ক্ষেত্র" : lang === "hi" ? "मित्र क्षेत्र" : "Friendly";
  if (d.includes("neutral")) return lang === "bn" ? "সম ক্ষেত্র (Neutral)" : lang === "hi" ? "सम क्षेत्र (Neutral)" : "Neutral";
  if (d.includes("great enemy")) return lang === "bn" ? "অধি-শত্রু ক্ষেত্র" : lang === "hi" ? "अति-शत्रु क्षेत्र" : "Great Enemy";
  if (d.includes("enemy")) return lang === "bn" ? "শত্রু ক্ষেত্র" : lang === "hi" ? "शत्रु क्षेत्र" : "Enemy";
  if (d.includes("debilitat")) return lang === "bn" ? "নীচস্থ (Debilitated)" : lang === "hi" ? "नीच (Debilitated)" : "Debilitated";
  return dignity;
}

export function translateSadeSatiPhase(phase: string | undefined, lang: AstrologyLanguage): string {
  if (!phase) return "";
  const p = phase.toLowerCase();
  if (p.includes("rising") || p.includes("1st")) {
    return lang === "bn"
      ? "উত্থান পর্যায় (প্রথম ঢাইয়া - ১২ম ভাব)"
      : lang === "hi"
      ? "आरंभिक चरण (प्रथम ढैया - १२वां भाव)"
      : "Rising Phase (1st Phase)";
  }
  if (p.includes("peak") || p.includes("2nd")) {
    return lang === "bn"
      ? "শীর্ষ পর্যায় (চন্দ্র রাশি ঢাইয়া - ১ম ভাব)"
      : lang === "hi"
      ? "शिखर चरण (जन्म राशि ढैया - प्रथम भाव)"
      : "Peak Phase (2nd Phase)";
  }
  if (p.includes("setting") || p.includes("3rd")) {
    return lang === "bn"
      ? "অবরোহণ পর্যায় (তৃতীয় ঢাইয়া - ২য় ভাব)"
      : lang === "hi"
      ? "अंतिम चरण (तृतीय ढैया - २रा भाव)"
      : "Setting Phase (3rd Phase)";
  }
  if (p.includes("kantaka")) {
    return lang === "bn" ? "কন্টক শনি (৪র্থ/৭ম/১০ম ভাব)" : lang === "hi" ? "कंटक शनि (४/७/१० भाव)" : "Kantaka Shani";
  }
  if (p.includes("ashtama")) {
    return lang === "bn" ? "অষ্টম শনি (৮ম ভাব)" : lang === "hi" ? "अष्टम शनि (८वां भाव)" : "Ashtama Shani";
  }
  if (p.includes("no") || p.includes("none")) {
    return lang === "bn" ? "বর্তমানে সাড়ে সাতির প্রভাব নেই" : lang === "hi" ? "वर्तमान में साढ़े साती नहीं है" : "No Sade Sati Active";
  }
  return phase;
}

export function translateYoginiNature(nature: string | undefined, lang: AstrologyLanguage): string {
  if (!nature) return "";
  const n = nature.toLowerCase();
  if (n.includes("benefic")) return lang === "bn" ? "পরম শুভ" : lang === "hi" ? "शुभ फलदायी" : "Benefic";
  if (n.includes("challeng") || n.includes("malefic"))
    return lang === "bn" ? "সংগ্রামপূর্ণ / সতর্ক" : lang === "hi" ? "चुनौतीपूर्ण / सतर्क" : "Challenging";
  if (n.includes("mixed")) return lang === "bn" ? "মিশ্র ফলদায়ী" : lang === "hi" ? "मिश्रित फल" : "Mixed";
  return nature;
}
