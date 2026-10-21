/**
 * Client-side UI translations for Birth Star & Nakshatra Calculator
 * across English (en), Bengali (bn), and Hindi (hi).
 */

export interface NakshatraUITranslations {
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
  dayPlaceholder: string;
  monthPlaceholder: string;
  yearPlaceholder: string;
  tobLabel: string;
  tobNotice: string;
  hourPlaceholder: string;
  minutePlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  searchCity: string;
  ayanamsaLabel: string;
  calculateBtn: string;
  calculating: string;
  syncProfileBtn: string;
  syncProfileNotice: string;
  resetBtn: string;

  // Results Section
  reportHeading: string;
  reportSubheading: string;
  padaLabel: string;
  starLordLabel: string;
  kpSubLordLabel: string;
  rashiLabel: string;
  moonLongitudeLabel: string;
  degreeInNakLabel: string;
  degreeInPadaLabel: string;
  elapsedLabel: string;

  // Tabs / Cards
  sacredIdentityHeading: string;
  deityLabel: string;
  symbolLabel: string;
  sacredTreeLabel: string;
  beejMantraLabel: string;
  currentNamaksharLabel: string;
  luckyColorLabel: string;
  luckyNumbersLabel: string;
  luckyGemstoneLabel: string;

  // Avakahada Chakra
  avakahadaHeading: string;
  ganaLabel: string;
  yoniLabel: string;
  nadiLabel: string;
  varnaLabel: string;
  vashyaLabel: string;
  tatvaLabel: string;
  payaLabel: string;

  // Padas
  padasHeading: string;
  padasSubheading: string;
  nativePadaBadge: string;
  navamshaSignLabel: string;
  syllableLabel: string;

  // Traits
  overviewHeading: string;
  strengthsHeading: string;
  cautionsHeading: string;
  remediesHeading: string;
  careerHeading: string;

  // Tarabala
  tarabalaHeading: string;
  tarabalaSubheading: string;
  auspiciousBadge: string;
  inauspiciousBadge: string;

  // Wheel
  wheelHeading: string;
  wheelSubheading: string;
}

export const NAKSHATRA_UI_TEXTS: Record<"en" | "bn" | "hi", NakshatraUITranslations> = {
  en: {
    badge: "Vedic Astronomy & KP Star Engine",
    title: "Birth Star & Janma Nakshatra Calculator",
    subtitle:
      "Discover your true Vedic Birth Star, Pada, Avakahada Chakra (Gana, Yoni, Nadi, Paya), Auspicious Baby Naming Letters, and Tarabala with 100% astronomical accuracy.",
    formTitle: "Enter Birth Details",
    nameLabel: "Full Name",
    namePlaceholder: "Enter native's name",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    dobLabel: "Date of Birth (Mandatory)",
    dobNotice: "DD / MM / YYYY format",
    dayPlaceholder: "DD",
    monthPlaceholder: "MM",
    yearPlaceholder: "YYYY",
    tobLabel: "Birth Time (Optional)",
    tobNotice: "If unknown, defaults to 12:00 PM noon",
    hourPlaceholder: "HH",
    minutePlaceholder: "MM",
    locationLabel: "Birth Place",
    locationPlaceholder: "Search city (e.g. Kolkata, Mumbai, London)",
    searchCity: "Search City",
    ayanamsaLabel: "Ayanamsa System",
    calculateBtn: "Calculate Janma Nakshatra",
    calculating: "Computing Planetary Moon Position...",
    syncProfileBtn: "Auto-fill My Profile",
    syncProfileNotice: "Loaded your logged-in profile data",
    resetBtn: "Clear Form",

    reportHeading: "Vedic Birth Star & Janma Tara Report",
    reportSubheading: "Calculated using high-precision Sidereal Lahiri Ephemeris",
    padaLabel: "Pada (Quarter)",
    starLordLabel: "Vimshottari Star Lord",
    kpSubLordLabel: "KP Sub-Lord",
    rashiLabel: "Moon Sign (Rashi)",
    moonLongitudeLabel: "Sidereal Moon Longitude",
    degreeInNakLabel: "Moon Degree in Star",
    degreeInPadaLabel: "Degree in Pada",
    elapsedLabel: "Star Elapsed",

    sacredIdentityHeading: "Sacred Identity & Divine Attributes",
    deityLabel: "Ruling Deity",
    symbolLabel: "Cosmic Symbol",
    sacredTreeLabel: "Sacred Vriksha (Tree)",
    beejMantraLabel: "Sacred Beej Mantra",
    currentNamaksharLabel: "Native Name Syllable (নামাক্রম)",
    luckyColorLabel: "Auspicious Color",
    luckyNumbersLabel: "Lucky Numbers",
    luckyGemstoneLabel: "Benefic Gemstone",

    avakahadaHeading: "Avakahada Chakra (অবকহড়া চক্র)",
    ganaLabel: "Gana (গণ)",
    yoniLabel: "Yoni & Animal (যোনি)",
    nadiLabel: "Nadi (নাড়ী)",
    varnaLabel: "Varna (বর্ণ)",
    vashyaLabel: "Vashya (বশ্য)",
    tatvaLabel: "Element (তত্ত্ব)",
    payaLabel: "Paya (পায়া - Foot of Arrival)",

    padasHeading: "Auspicious Name Syllables across 4 Padas",
    padasSubheading: "Canonical Vedic syllables for child naming and Navamsha signs",
    nativePadaBadge: "Your Native Pada",
    navamshaSignLabel: "Navamsha Sign",
    syllableLabel: "Naming Letter",

    overviewHeading: "Nakshatra Personality Essence",
    strengthsHeading: "Distinct Strengths & Natural Gifts",
    cautionsHeading: "Cautions, Pitfalls & Vulnerabilities",
    remediesHeading: "Vedic Remedies & Beneficial Actions",
    careerHeading: "Prosperous Career & Vocation Paths",

    tarabalaHeading: "Tarabala Chakra (শুভ ও প্রতিকূল জন্মতারা)",
    tarabalaSubheading: "Daily auspiciousness mapping for major decisions, travels, and investments",
    auspiciousBadge: "Auspicious",
    inauspiciousBadge: "Inauspicious",

    wheelHeading: "The 27 Cosmic Constellations (নক্ষত্র মণ্ডল)",
    wheelSubheading: "Zodiacal sequence of all 27 Vedic Nakshatras highlighting your birth star",
  },

  bn: {
    badge: "বৈদিক জ্যোতির্বিজ্ঞান ও কেপি স্টার ইঞ্জিন",
    title: "জন্ম নক্ষত্র ও জন্মতারা ক্যালকুলেটর",
    subtitle:
      "১০০% নির্ভুল বৈদিক গণনায় জানুন আপনার জন্ম নক্ষত্র, চরণ (পদ), অবকহড়া চক্র (গণ, যোনি, নাড়ী, পায়া), শুভ নামাক্রম অক্ষর ও তারাবল চক্র।",
    formTitle: "জন্মের বিবরণ প্রদান করুন",
    nameLabel: "পূর্ণ নাম",
    namePlaceholder: "জাতক বা জাতিকার নাম লিখুন",
    genderLabel: "লিঙ্গ",
    genderMale: "পুরুষ",
    genderFemale: "মহিলা",
    genderOther: "অন্যান্য",
    dobLabel: "জন্ম তারিখ (বাধ্যতামূলক)",
    dobNotice: "দিন / মাস / বছর (DD / MM / YYYY)",
    dayPlaceholder: "দিন",
    monthPlaceholder: "মাস",
    yearPlaceholder: "বছর",
    tobLabel: "জন্মের সময় (ঐচ্ছিক)",
    tobNotice: "সময় জানা না থাকলে ফাঁকা রাখুন, দুপুর ১২:০০ দিয়ে নির্ভুল হিসাব হবে",
    hourPlaceholder: "ঘণ্টা",
    minutePlaceholder: "মিনিট",
    locationLabel: "জন্মস্থান",
    locationPlaceholder: "শহরের নাম লিখুন (যেমন: কলকাতা, ঢাকা, লন্ডন)",
    searchCity: "শহর খুঁজুন",
    ayanamsaLabel: "আয়নাংশ পদ্ধতি",
    calculateBtn: "জন্ম নক্ষত্র গণনা করুন",
    calculating: "চন্দ্রের সূক্ষ্ম অবস্থান নির্ণয় করা হচ্ছে...",
    syncProfileBtn: "প্রোফাইল থেকে তথ্য নিন",
    syncProfileNotice: "আপনার লগইন প্রোফাইল থেকে তথ্য স্বয়ংক্রিয়ভাবে যুক্ত হয়েছে",
    resetBtn: "ফর্ম পরিষ্কার করুন",

    reportHeading: "আপনার জন্ম নক্ষত্র ও জন্মতারা রিপোর্ট",
    reportSubheading: "লাহিড়ী চিত্রপক্ষ আয়নাংশে নির্ভুল চন্দ্রের দ্রাঘিমাংশ ভিত্তিক ফলাফল",
    padaLabel: "চরণ / পদ",
    starLordLabel: "নক্ষত্রাধিপতি (Star Lord)",
    kpSubLordLabel: "কেপি সাব-লর্ড (KP Sub-Lord)",
    rashiLabel: "চন্দ্র রাশি (Moon Sign)",
    moonLongitudeLabel: "চন্দ্রের স্পষ্ট দ্রাঘিমাংশ",
    degreeInNakLabel: "নক্ষত্রে চন্দ্রের ভোগাংশ",
    degreeInPadaLabel: "পাদ ভোগাংশ",
    elapsedLabel: "নক্ষত্র অতিক্রম",

    sacredIdentityHeading: "আদি পরিচয় ও পবিত্র প্রতীকসমূহ",
    deityLabel: "উপাস্য দেবতা",
    symbolLabel: "মহাজাগতিক প্রতীক",
    sacredTreeLabel: "আরাধ্য বৃক্ষ",
    beejMantraLabel: "পবিত্র বীজ মন্ত্র",
    currentNamaksharLabel: "শুভ নামাক্রম ধ্বনি (Naming Letter)",
    luckyColorLabel: "শুভ বর্ণ",
    luckyNumbersLabel: "শুভ সংখ্যা",
    luckyGemstoneLabel: "শুভ রত্ন",

    avakahadaHeading: "অবকহড়া চক্র (Avakahada Chakra)",
    ganaLabel: "গণ",
    yoniLabel: "যোনি ও প্রাণী",
    nadiLabel: "নাড়ী",
    varnaLabel: "বর্ণ",
    vashyaLabel: "বশ্য",
    tatvaLabel: "তত্ত্ব / উপাদান",
    payaLabel: "পায়া (আগমনের পায়া)",

    padasHeading: "৪ চরণের শুভ নামাক্রম ও নবাংশ রাশি",
    padasSubheading: "সন্তানের নামকরণ এবং নবাংশ নির্ধারণের প্রামাণ্য শাস্ত্রীয় অক্ষর",
    nativePadaBadge: "আপনার জন্ম পদ",
    navamshaSignLabel: "নবাংশ রাশি",
    syllableLabel: "নামের অক্ষর",

    overviewHeading: "নক্ষত্রের স্বভাবজাত ব্যক্তিত্ব",
    strengthsHeading: "ব্যক্তিত্বের বিশেষ শক্তিসমূহ",
    cautionsHeading: "কী কী থেকে সাবধান থাকবেন (সতর্কতা)",
    remediesHeading: "শুভ প্রতিকার ও কল্যাণকর বিধি",
    careerHeading: "উপযুক্ত কর্মক্ষেত্র ও জীবিকা",

    tarabalaHeading: "শুভ ও প্রতিকূল জন্মতারা চক্র (তারাবল)",
    tarabalaSubheading: "গুরুত্বপূর্ণ সিদ্ধান্ত, যাত্রা, চুক্তি ও বিনিয়োগের ক্ষেত্রে শুভাশুভ নির্ণয়",
    auspiciousBadge: "পরম শুভ",
    inauspiciousBadge: "প্রতিকূল / সাবধান",

    wheelHeading: "২৭টি মহাজাগতিক নক্ষত্র মণ্ডল",
    wheelSubheading: "রাশিচক্রের ২৭টি বৈদিক নক্ষত্রের মধ্যে আপনার জন্ম নক্ষত্রের অবস্থান",
  },

  hi: {
    badge: "वैदिक खगोल व केपी स्टार इंजन",
    title: "जन्म नक्षत्र व जन्म तारा कैलकुलेटर",
    subtitle:
      "100% शुद्ध खगोलीय गणना से जानें अपना जन्म नक्षत्र, पद, अवकहड़ा चक्र (गण, योनि, नाड़ी, पाया), नामाक्षर और ताराबल चक्र।",
    formTitle: "जन्म विवरण दर्ज करें",
    nameLabel: "पूरा नाम",
    namePlaceholder: "जातक का नाम लिखें",
    genderLabel: "लिंग",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य",
    dobLabel: "जन्म तिथि (अनिवार्य)",
    dobNotice: "दिन / माह / वर्ष (DD / MM / YYYY)",
    dayPlaceholder: "दिन",
    monthPlaceholder: "माह",
    yearPlaceholder: "वर्ष",
    tobLabel: "जन्म समय (वैकल्पिक)",
    tobNotice: "समय ज्ञात न होने पर खाली छोड़ें, दोपहर 12:00 से सटीक गणना होगी",
    hourPlaceholder: "घंटे",
    minutePlaceholder: "मिनट",
    locationLabel: "जन्म स्थान",
    locationPlaceholder: "शहर का नाम खोजें (जैसे: दिल्ली, वाराणसी, कोलकाता)",
    searchCity: "शहर खोजें",
    ayanamsaLabel: "अयनांश पद्धति",
    calculateBtn: "जन्म नक्षत्र की गणना करें",
    calculating: "चंद्रमा की स्थिति की सूक्ष्म गणना हो रही है...",
    syncProfileBtn: "प्रोफाइल से डेटा लें",
    syncProfileNotice: "आपकी प्रोफाइल से विवरण सफलतापूर्वक लोड किया गया",
    resetBtn: "फॉर्म साफ करें",

    reportHeading: "आपका जन्म नक्षत्र व जन्म तारा रिपोर्ट",
    reportSubheading: "लाहिड़ी अयनांश के आधार पर चंद्रमा की शुद्ध स्थिति पर आधारित",
    padaLabel: "चरण / पद",
    starLordLabel: "नक्षत्र स्वामी (Star Lord)",
    kpSubLordLabel: "केपी उप-स्वामी (Sub-Lord)",
    rashiLabel: "चंद्र राशि (Moon Sign)",
    moonLongitudeLabel: "चंद्र स्पष्ट भोगांश",
    degreeInNakLabel: "नक्षत्र में चंद्र अंश",
    degreeInPadaLabel: "पद भोगांश",
    elapsedLabel: "नक्षत्र भोगांश प्रतिशत",

    sacredIdentityHeading: "मूल पहचान व पवित्र प्रतीक",
    deityLabel: "आराध्य देवता",
    symbolLabel: "ब्रह्मांडीय प्रतीक",
    sacredTreeLabel: "आराध्य वृक्ष",
    beejMantraLabel: "पवित्र बीज मंत्र",
    currentNamaksharLabel: "शुभ नामाक्षर (Naming Letter)",
    luckyColorLabel: "शुभ रंग",
    luckyNumbersLabel: "शुभ अंक",
    luckyGemstoneLabel: "शुभ रत्न",

    avakahadaHeading: "अवकहड़ा चक्र (Avakahada Chakra)",
    ganaLabel: "गण",
    yoniLabel: "योनि व प्राणी",
    nadiLabel: "नाड़ी",
    varnaLabel: "वर्ण",
    vashyaLabel: "वश्य",
    tatvaLabel: "तत्व",
    payaLabel: "पाया (स्वर्ण/रजत/ताम्र/लौह)",

    padasHeading: "चारों पदों के शुभ नामाक्षर व नवांश राशि",
    padasSubheading: "शिशु के नामकरण व नवांश राशि निर्धारण हेतु शास्त्रीय अक्षर",
    nativePadaBadge: "आपका जन्म पद",
    navamshaSignLabel: "नवांश राशि",
    syllableLabel: "नामाक्षर",

    overviewHeading: "नक्षत्र का स्वभाव व व्यक्तित्व",
    strengthsHeading: "विशिष्ट खूबियां व प्राकृतिक प्रतिभा",
    cautionsHeading: "सावधानियां व कमजोरियां",
    remediesHeading: "वैदिक उपाय व कल्याणकारी नियम",
    careerHeading: "अनुकूल कार्यक्षेत्र व करियर",

    tarabalaHeading: "ताराबल चक्र (शुभ व अशुभ जन्म तारा)",
    tarabalaSubheading: "दैनिक मांगलिक कार्यों, यात्रा व निवेश के लिए शुभ व अशुभ तारों की तालिका",
    auspiciousBadge: "अत्यंत शुभ",
    inauspiciousBadge: "अशुभ / वर्जित",

    wheelHeading: "27 नक्षत्रों का ब्रह्मांडीय चक्र",
    wheelSubheading: "समस्त 27 वैदिक नक्षत्रों में आपके जन्म नक्षत्र की स्थिति",
  },
};
