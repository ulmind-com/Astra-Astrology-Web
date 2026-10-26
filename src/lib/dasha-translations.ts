import type { AstrologyLanguage } from "@/types";

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

  // Vimshottari Tree
  vimshottariTreeTitle: string;
  drilldownHint: string;
  duration: string;
  currentTag: string;
  timeColumn: string;

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

  // Life Timeline & Remedies
  timelineTitle: string;
  timelineSubtitle: string;
  ageSpan: string;
  favorablePhase: string;
  neutralPhase: string;
  challengingPhase: string;
  authenticRemediesTitle: string;
  lalKitabRemedy: string;
  beejMantra: string;
  gayatriMantra: string;
  consultationCta: string;
  bookAstrologer: string;
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

    vimshottariTreeTitle: "বিংশোত্তরী দশা ৫-স্তরের নির্ভুল সময়রেখা",
    drilldownHint: "যেকোনো সারিতে ক্লিক করে পরবর্তী সূক্ষ্ম স্তর ড্রিলডাউন করুন",
    duration: "স্থায়িত্ব",
    currentTag: "চলমান",
    timeColumn: "সময় (Time)",

    yoginiTitle: "যোগিনী দশা (Yogini Dasha - ৩৬ বছরের বৈদিক চক্র)",
    yoginiSubtitle: "উত্তর ও পূর্ব ভারতের প্রাচীনতম প্রামাণ্য দশা পদ্ধতি, যা জীবনের আকস্মিক ঘটনা ও দ্রুত ফলপ্রসূতা নির্দেশ করে:",
    startingYogini: "জন্মকালীন আরম্ভ যোগিনী",
    balanceAtBirth: "জন্মকালীন অবশিষ্ট ভোগকাল",
    currentRunningYogini: "বর্তমান চলমান যোগিনী",
    currentSubYogini: "বর্তমান উপ-যোগিনী",
    cycleNumber: "চক্র নম্বর",
    yoginiNature: "প্রকৃতি ও প্রভাব",
    rulerPlanet: "নিয়ন্ত্রক গ্রহ",

    phalaTitle: "কুণ্ডলী-ভিত্তিক ব্যক্তিগতকৃত দশাফল (Personalized Kundli Phala)",
    phalaSubtitle: "আপনার জন্ম লগ্ন, ভাবাধিপত্য ও গ্রহের অবস্থানের সাপেক্ষে প্রতিটি গ্রহের বাস্তব ফলপ্রদান ক্ষমতা:",
    lagnaLabel: "জন্ম লগ্ন",
    functionalRole: "কার্যকরী প্রকৃতি",
    dignityLabel: "গ্রহের অবস্থা (Dignity)",
    placedInHouse: "অবস্থানরত ভাব",
    favorabilityScore: "শুভত্ব স্কোর",
    careerImpact: "কর্মজীবন ও পেশা",
    wealthImpact: "আর্থিক স্থিতি ও সম্পদ",
    relationshipImpact: "সম্পর্ক ও পারিবারিক সুখ",
    healthImpact: "স্বাস্থ্য ও শারীরিক স্থিতি",
    gemstoneAlert: "রত্ন নির্দেশিকা ও সতর্কতা",
    remedyAction: "সুপারিশকৃত নিত্যকর্ম ও প্রতিকার",

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

    timelineTitle: "জীবন পরিক্রমা টাইমলাইন (Life Journey Timeline)",
    timelineSubtitle: "জন্ম থেকে বার্ধক্য পর্যন্ত আপনার জীবনের প্রতিটি দশার রূপরেখা ও শুভ/অশুভ পর্যায়:",
    ageSpan: "বয়স সীমা",
    favorablePhase: "শুভ ও উন্নতির সময়",
    neutralPhase: "সাধারণ বা মিশ্র সময়",
    challengingPhase: "সংগ্রাম ও সতর্কতামূলক সময়",
    authenticRemediesTitle: "প্রামাণ্য বৈদিক ও লাল কিতাব প্রতিকার ড্যাশবোর্ড",
    lalKitabRemedy: "লাল কিতাব উপাচার",
    beejMantra: "বীজ মন্ত্র",
    gayatriMantra: "গায়ত্রী মন্ত্র",
    consultationCta: "আপনার চলমান দশা ও ভবিষ্যৎ নিয়ে আমাদের অভিজ্ঞ বৈদিক জ্যোতিষীদের সাথে সরাসরি কথা বলুন।",
    bookAstrologer: "জ্যোতিষী পরামর্শ বুক করুন",
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

    vimshottariTreeTitle: "Vimshottari Dasha 5-Tier Astronomical Timeline",
    drilldownHint: "Click any row to drill down into deeper micro sub-periods",
    duration: "Duration",
    currentTag: "Current",
    timeColumn: "Exact Time",

    yoginiTitle: "Yogini Dasha (36-Year Classical Cycle)",
    yoginiSubtitle: "Ancient Parashara system widely celebrated in North and East India for rapid manifestation of events:",
    startingYogini: "Birth Starting Yogini",
    balanceAtBirth: "Unconsumed Balance at Birth",
    currentRunningYogini: "Active Major Yogini",
    currentSubYogini: "Active Sub Yogini",
    cycleNumber: "Cycle Number",
    yoginiNature: "Vibrational Nature",
    rulerPlanet: "Governing Planet",

    phalaTitle: "Personalized Kundli-Aware Dasha Phala",
    phalaSubtitle: "Real astrological effects tailored to your specific Ascendant (Lagna), planetary placement, and dignity:",
    lagnaLabel: "Ascendant (Lagna)",
    functionalRole: "Functional Role",
    dignityLabel: "Planetary Dignity",
    placedInHouse: "House Placement",
    favorabilityScore: "Favorability Score",
    careerImpact: "Career & Profession",
    wealthImpact: "Wealth & Finance",
    relationshipImpact: "Relationships & Family",
    healthImpact: "Health & Vitality",
    gemstoneAlert: "Gemstone Guidance & Warnings",
    remedyAction: "Recommended Practice & Remedy",

    transitSandhiTitle: "Dasha Sandhi, Chidra Dasha & Real-Time Transit Synergy",
    sandhiAlertTitle: "Dasha Sandhi Transition Tracker",
    chidraAlertTitle: "Chidra Dasha Notice (Final Antardasha of Mahadasha)",
    daysToTransition: "Days to Mahadasha Shift",
    transitPositionTitle: "Live Planetary Transit of Dasha Lords",
    transitHouseFromMoon: "House from Natal Moon",
    sadeSatiTitle: "Saturn Sade Sati & Dhaiya Status",
    sadeSatiActive: "Sade Sati is Currently Active",
    sadeSatiNone: "No Sade Sati Pressure at Present",
    synergyScore: "Dasha-Transit Alignment Score",

    timelineTitle: "Life Journey Visual Timeline",
    timelineSubtitle: "Visual map of all Mahadashas across your entire lifespan with favorability grading:",
    ageSpan: "Age Range",
    favorablePhase: "Favorable / Growth Phase",
    neutralPhase: "Neutral / Balanced Phase",
    challengingPhase: "Challenging / Transformative Phase",
    authenticRemediesTitle: "Authentic Vedic & Lal Kitab Remedies Dashboard",
    lalKitabRemedy: "Lal Kitab Upaya",
    beejMantra: "Beej Mantra",
    gayatriMantra: "Gayatri Mantra",
    consultationCta: "Need personalized guidance for your current running Dasha? Consult our verified Vedic astrologers.",
    bookAstrologer: "Book Astrologer Consultation",
  },
  hi: {
    tabActiveRadar: "वर्तमान सक्रिय दशा",
    tabVimshottari: "विंशोत्तरी ट्री (5 स्तर)",
    tabYogini: "योगिनी दशा (36 वर्ष)",
    tabPhala: "कुंडली दशाफल एवं लग्न",
    tabTransitSandhi: "दशा संधि एवं गोचर",
    tabTimelineRemedies: "लाइफलाइन एवं उपाय",

    badgeVimshottari: "प्रमाणिक वैदिक एवं केपी दशा प्रणाली (100% सटीक महादशा एवं अंतर्दशा)",
    titleMain: "दशा कैलकुलेटर - विंशोत्तरी एवं योगिनी दशा विश्लेषण",
    subtitleMain: "लाहिड़ी एवं कृष्णमूर्ति अयनांश के साथ अपनी जन्मकालीन सटीक विंशोत्तरी (5 स्तर), योगिनी दशा, लग्न-आधारित दशाफल एवं लाइव गोचर समन्वय जानें।",
    calculating: "दशा के सूक्ष्म स्तरों की गणना की जा रही है...",
    calculateBtn: "दशा गणना करें",
    resetBtn: "रीसेट",
    profileSync: "प्रोफ़ाइल से लोड करें",

    activeRadarTitle: "वर्तमान सक्रिय दशा रडार (Live Running Snapshot)",
    activeRadarSubtitle: "वर्तमान समय में आपका जीवन किन ग्रहों की महादशा, अंतर्दशा, प्रत्यंतर्दशा, सूक्ष्म एवं प्राण दशा द्वारा संचालित हो रहा है:",
    levelMahadasha: "महादशा (Major)",
    levelAntardasha: "अंतर्दशा (Sub)",
    levelPratyantardasha: "प्रत्यंतर्दशा (Sub-Sub)",
    levelSookshma: "सूक्ष्म दशा (Sookshma)",
    levelPran: "प्राण दशा (Pran)",
    startDate: "प्रारंभ",
    endDate: "समाप्ति",
    remainingDays: "शेष दिन",
    percentageCompleted: "व्यतीत",
    activePathTitle: "वर्तमान सक्रिय प्रवाह:",

    vimshottariTreeTitle: "विंशोत्तरी दशा 5-स्तरीय सटीक समयसीमा",
    drilldownHint: "गहरे सूक्ष्म स्तरों को देखने के लिए किसी भी पंक्ति पर क्लिक करें",
    duration: "अवधि",
    currentTag: "सक्रिय",
    timeColumn: "सटीक समय",

    yoginiTitle: "योगिनी दशा (36 वर्षीय वैदिक चक्र)",
    yoginiSubtitle: "उत्तर एवं पूर्वी भारत की प्राचीनतम प्रामाणिक दशा पद्धति, जो घटनाओं की त्वरित फलीभूतता दर्शाती है:",
    startingYogini: "जन्मकालीन आरंभ योगिनी",
    balanceAtBirth: "जन्म समय शेष भोगकाल",
    currentRunningYogini: "वर्तमान सक्रिय योगिनी",
    currentSubYogini: "वर्तमान उप-योगिनी",
    cycleNumber: "चक्र संख्या",
    yoginiNature: "प्रकृति एवं प्रभाव",
    rulerPlanet: "स्वामी ग्रह",

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

    timelineTitle: "जीवन यात्रा टाइमलाइन (Life Journey Timeline)",
    timelineSubtitle: "जन्म से वृद्धावस्था तक आपके संपूर्ण जीवन की महादशाओं का दृश्यमान मानचित्र:",
    ageSpan: "आयु सीमा",
    favorablePhase: "शुभ एवं उन्नति काल",
    neutralPhase: "सामान्य / संतुलित काल",
    challengingPhase: "चुनौतीपूर्ण / परिवर्तन काल",
    authenticRemediesTitle: "प्रामाणिक वैदिक एवं लाल किताब उपाय डैशबोर्ड",
    lalKitabRemedy: "लाल किताब उपाय",
    beejMantra: "बीज मंत्र",
    gayatriMantra: "गायत्री मंत्र",
    consultationCta: "अपनी सक्रिय दशा एवं भविष्यफल के लिए हमारे अनुभवी वैदिक ज्योतिषियों से सीधे परामर्श लें।",
    bookAstrologer: "ज्योतिषी परामर्श बुक करें",
  },
};
