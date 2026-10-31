import type { AstrologyLanguage } from "@/types";
import {
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  toLocalizedDigits,
} from "./kundli-translations";

export interface RashiTranslations {
  // Page Header
  badge: string;
  title: string;
  subtitle: string;
  languageLabel: string;

  // Form Section
  formTitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  dob: string;
  mandatory: string;
  tob: string;
  optionalTob: string;
  pob: string;
  pobPlaceholder: string;
  advancedSettings: string;
  longitude: string;
  latitude: string;
  east: string;
  west: string;
  north: string;
  south: string;
  timezone: string;
  timezoneResolved: string;
  timezoneManualHelp: string;
  ayanamsa: string;
  houseSystem: string;
  chartStyle: string;
  calculateBtn: string;
  calculatingBtn: string;
  featureDisabled: string;
  featureDisabledBtn: string;
  profileSyncWelcome: (name: string) => string;
  profileSyncSaved: string;
  profileSyncNameOnly: string;
  reloadProfile: string;
  clearForm: string;
  signInPrompt: string;
  signInBtn: string;

  // Toasts
  toastFormCleared: string;
  toastProfileLoaded: string;
  toastNameRequired: string;
  toastDobRequired: string;
  toastTobInvalid: string;
  toastPlaceRequired: string;
  toastCalculationSuccess: (rashi: string, nak: string) => string;

  // Results Hero Card
  calculatedFor: (name: string) => string;
  rashiSuffix: string;
  vargottamaBadge: string;
  rulingLord: string;
  moonPosition: string;
  element: string;
  modality: string;
  polarity: string;

  // Metrics Grid
  nakshatraPada: string;
  padaSuffix: (pada: string | number) => string;
  starLordKP: string;
  governsResult: string;
  kpSubLord: string;
  qualifiesOutcome: string;
  ascendantLagna: string;

  // Tabs
  tabCore: string;
  tabRules: string;
  tabKundali: string;
  tabTransit: string;
  tabPredictions: string;

  // Tab 1: Core & Avakahada
  avakahadaHeading: string;
  avakahadaSub: string;
  auspiciousLetter: string;
  varna: string;
  varnaSub: string;
  vashya: string;
  vashyaSub: string;
  yoni: string;
  yoniSub: string;
  gana: string;
  ganaSub: string;
  nadi: string;
  nadiSub: string;
  tatva: string;
  tatvaSub: string;
  payaHeading: string;
  navamshaMoon: string;
  vargottamaStatus: string;
  vargottamaActive: string;
  vargottamaInactive: string;
  wheelHeading: string;
  wheelSub: string;

  // Tab 2: Rules
  rulesUnavailable: string;

  // Tab 3: Kundali & Dignity
  chandraLagnaChart: string;
  chandraLagnaSub: string;
  janmaLagnaChart: string;
  janmaLagnaSub: (ayanamsa: string) => string;
  chandraLagnaBtn: string;
  janmaLagnaBtn: string;
  chartNorth: string;
  chartSouth: string;
  chartEast: string;
  dignityTitle: (rashi: string) => string;
  dignitySub: string;
  exaltedPlanets: string;
  debilitatedPlanets: string;
  moolatrikonaOwn: string;
  noneText: string;
  naturalFriendships: (planet: string) => string;
  friends: string;
  enemies: string;
  neutrals: string;
  noEnemies: string;

  // Tab 4: Transit & Sade Sati
  chandraBalaHeading: string;
  chandraBalaSub: string;
  transitingMoonSign: string;
  houseFromMoon: string;
  houseSuffix: (house: string | number) => string;
  resultCategory: string;
  chandrashtama: string;
  auspiciousTransit: string;
  neutralTransit: string;
  muhurtaRule: string;
  sadeSatiHeading: string;
  sadeSatiSub: string;
  sadeSatiActive: string;
  sadeSatiInactive: string;
  activePhase: string;
  saturnSign: string;
  remedyHeading: string;

  // Tab 5: Predictions, Cautions & Remedies
  cautionsHeading: string;
  cautionsSub: string;
  remediesHeading: string;
  remediesSub: string;
  luckyHeading: string;
  kalapurusha: string;
  luckyGem: string;
  luckyColors: string;
  luckyNumbers: string;
  luckyDay: string;
  rulingDeity: string;
  compatibleSigns: string;
  personalityStrengths: string;

  // Bottom Actions
  recalculateBtn: string;
  consultAstrologerBtn: string;
}

export const RASHI_I18N: Record<AstrologyLanguage, RashiTranslations> = {
  bn: {
    badge: "বৈদিক জ্যোতিষশাস্ত্র ভিত্তিক নির্ভুল রাশি ক্যালকুলেটর",
    title: "জন্মতারিখ দিয়ে নিজের রাশি ও প্রতিকার জানুন — সম্পূর্ণ ফ্রি",
    subtitle:
      "সঠিক চন্দ্রের অবস্থান, ২৭ নক্ষত্র, ৪ পদ, কৃষ্ণমূর্তি (KP) সাব-লর্ড, কী কী থেকে সাবধান থাকবেন এবং কী করলে সৌভাগ্য বৃদ্ধি পাবে তার পূর্ণাঙ্গ বিশ্লেষণ।",
    languageLabel: "ভাষা / Language:",

    formTitle: "আপনার জন্ম বিবরণ প্রবেশ করান",
    fullName: "পূর্ণ নাম",
    fullNamePlaceholder: "আপনার নাম লিখুন...",
    gender: "লিঙ্গ",
    male: "পুরুষ (Male)",
    female: "মহিলা (Female)",
    other: "অন্যান্য (Other)",
    dob: "জন্মতারিখ",
    mandatory: "বাধ্যতামূলক",
    tob: "জন্মসময়",
    optionalTob: "ঐচ্ছিক — না দিলে ১২:০০ PM",
    pob: "জন্মস্থান",
    pobPlaceholder: "যেমন: Kolkata, West Bengal, India",
    advancedSettings: "উন্নত জ্যোতিষ সেটিংস (ঐচ্ছিক)",
    longitude: "দ্রাঘিমাংশ (Longitude)",
    latitude: "অক্ষাংশ (Latitude)",
    east: "পূর্ব (East)",
    west: "পশ্চিম (West)",
    north: "উত্তর (North)",
    south: "দক্ষিণ (South)",
    timezone: "সময়াঞ্চল (Time Zone)",
    timezoneResolved:
      "জন্মস্থান ও জন্মতারিখ অনুসারে সঠিক সময়াঞ্চল নির্ণীত — ডেলাইট সেভিং ও ঐতিহাসিক পরিবর্তন সহ।",
    timezoneManualHelp:
      "UTC থেকে ঘণ্টার হিসেবে, যেমন ভারত 5.5, বাংলাদেশ 6, নেপাল 5.75। তালিকা থেকে জন্মস্থান বেছে নিলে এটি স্বয়ংক্রিয়ভাবে ঠিক হয়ে যাবে।",
    ayanamsa: "অয়নাংশ পদ্ধতি",
    houseSystem: "ভাব পদ্ধতি (House System)",
    chartStyle: "কুষ্ঠি চক্র শৈলী (Chart Style)",
    calculateBtn: "আপনার রাশি জানুন",
    calculatingBtn: "চন্দ্র রাশি গণনা করা হচ্ছে…",
    featureDisabled: "রাশি ক্যালকুলেটর ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে।",
    featureDisabledBtn: "ফিচারটি বন্ধ রয়েছে",
    profileSyncWelcome: (name: string) => `স্বাগত, ${name}!`,
    profileSyncSaved: "আপনার প্রোফাইল থেকে সংরক্ষিত জন্ম বিবরণ স্বয়ংক্রিয়ভাবে লোড করা হয়েছে।",
    profileSyncNameOnly: "আপনার প্রোফাইলের নাম লোড করা হয়েছে।",
    reloadProfile: "রিলোড",
    clearForm: "খালি করুন",
    signInPrompt: "লগ-ইন করলে আপনার প্রোফাইলের সেভ করা জন্ম বিবরণ সরাসরি এখানে পূরণ হয়ে যাবে।",
    signInBtn: "লগ-ইন করুন",

    toastFormCleared: "ফর্ম খালি করা হয়েছে।",
    toastProfileLoaded: "প্রোফাইল থেকে তথ্য পুনরায় লোড করা হয়েছে।",
    toastNameRequired: "অনুগ্রহ করে আপনার নাম লিখুন",
    toastDobRequired: "অনুগ্রহ করে সঠিক জন্মতারিখ দিন (DD-MM-YYYY) — জন্মতারিখ বাধ্যতামূলক",
    toastTobInvalid: "অনুগ্রহ করে সঠিক জন্মসময় দিন (০১-১২ ঘন্টা, ০০-৫৯ মিনিট)",
    toastPlaceRequired:
      "অনুগ্রহ করে তালিকা থেকে জন্মস্থান বেছে নিন — সঠিক লগ্ন ও সময়াঞ্চলের জন্য এটি প্রয়োজন",
    toastCalculationSuccess: (rashi: string, nak: string) =>
      `চন্দ্রের অবস্থান: ${rashi} রাশি (${nak} নক্ষত্র)`,

    calculatedFor: (name: string) => `${name} এর জন্য বৈদিক চন্দ্র রাশি গণনা সম্পন্ন`,
    rashiSuffix: "রাশি",
    vargottamaBadge:
      "পরম শুভ বর্গোত্তম চন্দ্র (Vargottama Moon) — জন্ম রাশি (D1) ও নবাংশ (D9) উভয় চক্রেই একই রাশিতে অবস্থিত!",
    rulingLord: "অধিপতি গ্রহ:",
    moonPosition: "চন্দ্রের অবস্থান:",
    element: "তত্ত্ব:",
    modality: "স্বভাব:",
    polarity: "প্রকৃতি:",

    nakshatraPada: "নক্ষত্র ও পদ",
    padaSuffix: (p: string | number) => `${toLocalizedDigits(p, "bn")} নং পদ`,
    starLordKP: "নক্ষত্রাধিপতি (KP)",
    governsResult: "ফল নির্দেশক",
    kpSubLord: "উপ-অধিপতি (KP Sub)",
    qualifiesOutcome: "ফলাফল নির্ধারক",
    ascendantLagna: "জন্ম লগ্ন (Ascendant)",

    tabCore: "অবকহড়া ও মূল চক্র",
    tabRules: "১৫টি শাস্ত্রীয় নিয়ম",
    tabKundali: "চন্দ্র লগ্ন ও গ্রহ সম্বন্ধ",
    tabTransit: "লাইভ গোচর ও সাড়ে সাতি",
    tabPredictions: "সতর্কতা, প্রতিকার ও জীবন",

    avakahadaHeading: "মহাজাগতিক অবকহড়া চক্র (Avakahada Chakra)",
    avakahadaSub: "ম্যাচমেকিং ও কুণ্ডলী শাস্ত্রের মূল স্তম্ভসমূহ এবং বৈদিক নামাক্ষর",
    auspiciousLetter: "শুভ নামাক্ষর:",
    varna: "১. বর্ণ (Varna)",
    varnaSub: "স্বভাবগত শ্রেণী",
    vashya: "২. বশ্য (Vashya)",
    vashyaSub: "নিয়ন্ত্রণ ও আকর্ষণ",
    yoni: "৩. যোনি প্রাণী (Yoni)",
    yoniSub: "জৈবিক প্রবৃত্তি",
    gana: "৪. গণ (Gana)",
    ganaSub: "মানসিক চরিত্র",
    nadi: "৫. নাড়ী (Nadi)",
    nadiSub: "শারীরিক ধারা",
    tatva: "৬. তত্ত্ব (Tatva)",
    tatvaSub: "মহাজাগতিক মৌল",
    payaHeading: "জন্মকালীন পায়া (Paya of Birth):",
    navamshaMoon: "নবাংশ রাশি (D9 Navamsha Moon):",
    vargottamaStatus: "বর্গোত্তম স্ট্যাটাস:",
    vargottamaActive: "বর্গোত্তম (অত্যন্ত বলবান)",
    vargottamaInactive: "সাধারণ নবাংশ",
    wheelHeading: "১২ রাশি ও ২৭ নক্ষত্রের মহাজাগতিক চক্র (Zodiac Wheel)",
    wheelSub: "আপনার রাশি ও নক্ষত্রের তাৎক্ষণিক মহাজাগতিক অবস্থান নিচে আলোকিত করে নির্দেশ করা হয়েছে।",

    rulesUnavailable: "শাস্ত্রীয় নিয়মের তথ্য উপলব্ধ নয়।",

    chandraLagnaChart: "চন্দ্র লগ্ন কুষ্ঠী চক্র (Chandra Lagna Chart)",
    chandraLagnaSub: "চন্দ্রকে ১ম ভাব (লগ্ন) ধরে মানসিক স্থিতি, দৃষ্টিভঙ্গি ও গোচর প্রভাব নির্ণয়ের প্রামাণ্য চার্ট",
    janmaLagnaChart: "জন্ম লগ্ন কুষ্ঠী চক্র (Janma Lagna D1 Chart)",
    janmaLagnaSub: (ayanamsa: string) => `${ayanamsa} অয়নামশা অনুসারে জন্ম লগ্ন ও ৯টি গ্রহের মূল অবস্থান`,
    chandraLagnaBtn: "চন্দ্র লগ্ন চক্র",
    janmaLagnaBtn: "লগ্ন চক্র (D1)",
    chartNorth: "উত্তর",
    chartSouth: "দক্ষিণ",
    chartEast: "বাংলা / পূর্ব",
    dignityTitle: (rashi: string) => `${rashi} রাশিতে গ্রহদের উচ্চ-নীচ ও নৈসর্গিক মৈত্রী সম্বন্ধ`,
    dignitySub: "সূত্র: বৈদিক কুষ্ঠি শাস্ত্রের মূল গ্রন্থ ও গ্রহ মৈত্রী চক্র",
    exaltedPlanets: "উচ্চ গ্রহ (Exalted Graha):",
    debilitatedPlanets: "নীচ গ্রহ (Debilitated Graha):",
    moolatrikonaOwn: "মূলত্রিকোণ / স্বক্ষেত্র:",
    noneText: "কোনো গ্রহ নেই",
    naturalFriendships: (planet: string) => `${planet} গ্রহের নৈসর্গিক মৈত্রী সম্বন্ধ`,
    friends: "মিত্র গ্রহ (Friends)",
    enemies: "শত্রু গ্রহ (Enemies)",
    neutrals: "সম গ্রহ (Neutrals)",
    noEnemies: "কোনো প্রাকৃতিক শত্রু নেই",

    chandraBalaHeading: "বর্তমান চন্দ্র বল গোচর (Real-Time Chandra Bala)",
    chandraBalaSub: "আজকের দিনে চন্দ্র আপনার জন্ম রাশি থেকে কোন রাশিতে ভ্রমণ করছে তার ভিত্তিতে শুভাশুভ বল",
    transitingMoonSign: "চন্দ্রের বর্তমান রাশি",
    houseFromMoon: "জন্ম রাশি থেকে ভাব",
    houseSuffix: (h: string | number) => `${toLocalizedDigits(h, "bn")} ম ভাব`,
    resultCategory: "ফল নির্ণয়",
    chandrashtama: "চন্দ্রাষ্টম (বিশেষ সতর্কতা)",
    auspiciousTransit: "পরম শুভ ও সহায়ক",
    neutralTransit: "সাধারণ / নিরপেক্ষ",
    muhurtaRule:
      "শাস্ত্রীয় নিয়ম: জন্ম রাশি থেকে ১, ৩, ৬, ৭, ১০, ১১ ভাবে চন্দ্র শুভফলদায়ক; ২, ৫, ৯ মধ্যম; ৪, ৮, ১২ ভাবে সতর্কতা কাম্য।",
    sadeSatiHeading: "শনির সাড়ে সাতি ও ধাইয়া ট্র্যাকার (Saturn Sade Sati Tracker)",
    sadeSatiSub: "জন্ম রাশি সাপেক্ষে শনির বর্তমান গোচর অবস্থান ও শাস্ত্রসম্মত উপশম",
    sadeSatiActive: "প্রভাব সক্রিয়",
    sadeSatiInactive: "অনুকূল অবস্থা (সাড়ে সাতি নেই)",
    activePhase: "শনির বর্তমান পর্যায়",
    saturnSign: "শনির রাশি:",
    remedyHeading: "শাস্ত্রসম্মত শনি শান্তি প্রতিকার:",

    cautionsHeading: "কী কী থেকে সাবধান থাকবেন (সতর্কতা)",
    cautionsSub: "আপনার রাশির স্বভাবজাত দুর্বলতা ও প্রতিকূল ক্ষেত্র",
    remediesHeading: "কী করলে আপনার ভালো হবে (শুভ প্রতিকার)",
    remediesSub: "সৌভাগ্য বৃদ্ধি, মানসিক শান্তি ও সাফল্যের বৈদিক উপায়",
    luckyHeading: "শুভ বৈশিষ্ট্য ও রাশির কারকতা",
    kalapurusha: "শারীরিক শাসন (কালপুরুষ):",
    luckyGem: "শুভ রত্ন",
    luckyColors: "শুভ বর্ণ",
    luckyNumbers: "শুভ সংখ্যা",
    luckyDay: "শুভ বার",
    rulingDeity: "উপাস্য দেবতা",
    compatibleSigns: "অনুকূল রাশি",
    personalityStrengths: "ব্যক্তিত্বের প্রধান শক্তিসমূহ",

    recalculateBtn: "অন্য জন্ম বিবরণ দিয়ে পুনরায় গণনা করুন",
    consultAstrologerBtn: "অভিজ্ঞ জ্যোতিষীর সাথে বিস্তারিত পরামর্শ করুন",
  },

  hi: {
    badge: "वैदिक ज्योतिष सम्मत सटीक चंद्र राशि कैलकुलेटर",
    title: "जन्मतिथि से जानें अपनी राशि, सावधानियां एवं अचूक उपाय",
    subtitle:
      "सटीक चंद्र स्थिति, २७ नक्षत्र, ४ चरण, केपी सब-लॉर्ड, किन बातों से सावधान रहें और किन उपायों से भाग्य चमकेगा—सब कुछ विस्तार से जानें।",
    languageLabel: "भाषा / Language:",

    formTitle: "अपना जन्म विवरण दर्ज करें",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना नाम लिखें...",
    gender: "लिंग",
    male: "पुरुष (Male)",
    female: "महिला (Female)",
    other: "अन्य (Other)",
    dob: "जन्म तिथि",
    mandatory: "अनिवार्य",
    tob: "जन्म समय",
    optionalTob: "वैकल्पिक — नहीं देने पर 12:00 PM",
    pob: "जन्म स्थान",
    pobPlaceholder: "जैसे: Kolkata, West Bengal, India",
    advancedSettings: "उन्नत ज्योतिष सेटिंग्स (वैकल्पिक)",
    longitude: "रेखांश (Longitude)",
    latitude: "अक्षांश (Latitude)",
    east: "पूर्व (East)",
    west: "पश्चिम (West)",
    north: "उत्तर (North)",
    south: "दक्षिण (South)",
    timezone: "समय क्षेत्र (Time Zone)",
    timezoneResolved:
      "जन्म स्थान एवं जन्म तिथि अनुसार सही समय क्षेत्र निर्धारित — डेलाइट सेविंग एवं ऐतिहासिक परिवर्तन सहित।",
    timezoneManualHelp:
      "UTC से घंटों में, जैसे भारत 5.5, बांग्लादेश 6, नेपाल 5.75। सूची से जन्म स्थान चुनने पर यह स्वतः सही हो जाएगा।",
    ayanamsa: "अयनांश पद्धति",
    houseSystem: "भाव पद्धति (House System)",
    chartStyle: "कुंडली चक्र शैली (Chart Style)",
    calculateBtn: "अपनी राशि जानें",
    calculatingBtn: "चंद्र राशि की गणना हो रही है…",
    featureDisabled: "राशि कैलकुलेटर सुविधा वर्तमान में बंद रखी गई है।",
    featureDisabledBtn: "सुविधा बंद है",
    profileSyncWelcome: (name: string) => `स्वागत है, ${name}!`,
    profileSyncSaved: "आपकी प्रोफ़ाइल से सहेजा गया जन्म विवरण स्वतः भर दिया गया है।",
    profileSyncNameOnly: "आपकी प्रोफ़ाइल का नाम लोड किया गया है।",
    reloadProfile: "रीलोड",
    clearForm: "साफ़ करें",
    signInPrompt: "लॉग-इन करने पर आपकी प्रोफ़ाइल का विवरण स्वतः यहाँ भर जाएगा।",
    signInBtn: "लॉग-इन करें",

    toastFormCleared: "फ़ॉर्म साफ़ कर दिया गया है।",
    toastProfileLoaded: "प्रोफ़ाइल से विवरण पुनः लोड किया गया।",
    toastNameRequired: "कृपया अपना नाम दर्ज करें",
    toastDobRequired: "कृपया सही जन्म तिथि दर्ज करें (DD-MM-YYYY) — जन्म तिथि अनिवार्य है",
    toastTobInvalid: "कृपया सही जन्म समय दर्ज करें (01-12 घंटे, 00-59 मिनट)",
    toastPlaceRequired: "कृपया सूची से जन्म स्थान चुनें — सही लग्न एवं समय क्षेत्र हेतु यह आवश्यक है",
    toastCalculationSuccess: (rashi: string, nak: string) =>
      `गणना पूर्ण: ${rashi} राशि (${nak} नक्षत्र)`,

    calculatedFor: (name: string) => `${name} के लिए वैदिक चंद्र राशि गणना पूर्ण`,
    rashiSuffix: "राशि",
    vargottamaBadge:
      "परम शुभ वर्गोत्तम चंद्र (Vargottama Moon) — लग्न (D1) एवं नवांश (D9) दोनों चक्रों में एक ही राशि में स्थित!",
    rulingLord: "स्वामी ग्रह:",
    moonPosition: "चंद्रमा स्थिति:",
    element: "तत्व:",
    modality: "स्वभाव:",
    polarity: "प्रकृति:",

    nakshatraPada: "नक्षत्र एवं चरण",
    padaSuffix: (p: string | number) => `चरण ${toLocalizedDigits(p, "hi")}`,
    starLordKP: "नक्षत्र स्वामी (KP)",
    governsResult: "फल का स्रोत",
    kpSubLord: "उप-स्वामी (KP Sub)",
    qualifiesOutcome: "अंतिम परिणाम",
    ascendantLagna: "जन्म लग्न (Ascendant)",

    tabCore: "अवकहड़ा एवं मूल चक्र",
    tabRules: "१५ शास्त्रीय नियम",
    tabKundali: "चंद्र लग्न एवं ग्रह संबंध",
    tabTransit: "लाइव गोचर एवं साढ़े साती",
    tabPredictions: "सावधानियां एवं उपाय",

    avakahadaHeading: "वैदिक अवकहड़ा चक्र (Avakahada Chakra)",
    avakahadaSub: "कुंडली मिलान एवं व्यक्तित्व के आधारभूत स्तंभ एवं वैदिक नामाक्षर",
    auspiciousLetter: "शुभ नामाक्षर:",
    varna: "१. वर्ण (Varna)",
    varnaSub: "स्वभावगत श्रेणी",
    vashya: "२. वश्य (Vashya)",
    vashyaSub: "नियंत्रण एवं आकर्षण",
    yoni: "३. योनि प्राणी (Yoni)",
    yoniSub: "जैविक प्रवृत्ति",
    gana: "४. गण (Gana)",
    ganaSub: "मानसिक स्वभाव",
    nadi: "५. नाड़ी (Nadi)",
    nadiSub: "शारीरिक प्रकृति",
    tatva: "६. तत्व (Tatva)",
    tatvaSub: "ब्रह्मांडीय तत्व",
    payaHeading: "जन्म कालीन पाया (Paya of Birth):",
    navamshaMoon: "नवांश राशि (D9 Navamsha):",
    vargottamaStatus: "वर्गोत्तम स्थिति:",
    vargottamaActive: "वर्गोत्तम (अत्यंत शुभ व बलवान)",
    vargottamaInactive: "सामान्य नवांश",
    wheelHeading: "१२ राशि एवं २७ नक्षत्रों का ब्रह्मांडीय चक्र (Zodiac Wheel)",
    wheelSub: "आपकी राशि एवं नक्षत्र की खगोलीय स्थिति नीचे चक्र में प्रदर्शित है।",

    rulesUnavailable: "शास्त्रीय नियमों का विवरण उपलब्ध नहीं है।",

    chandraLagnaChart: "चंद्र लग्न कुंडली चक्र (Chandra Lagna Chart)",
    chandraLagnaSub: "चंद्रमा को प्रथम भाव (लग्न) मानकर मानसिक स्थिति, दृष्टिकोण एवं गोचर प्रभाव का प्रामाणिक चक्र",
    janmaLagnaChart: "जन्म लग्न कुंडली चक्र (Janma Lagna D1 Chart)",
    janmaLagnaSub: (ayanamsa: string) => `${ayanamsa} अयनांश अनुसार जन्म लग्न एवं ९ ग्रहों की मूल स्थिति`,
    chandraLagnaBtn: "चंद्र लग्न चक्र",
    janmaLagnaBtn: "लग्न चक्र (D1)",
    chartNorth: "उत्तर",
    chartSouth: "दक्षिण",
    chartEast: "पूर्व",
    dignityTitle: (rashi: string) => `${rashi} राशि में ग्रहों का उच्च-नीच एवं नैसर्गिक मैत्री संबंध`,
    dignitySub: "स्रोत: वैदिक कुंडली शास्त्र एवं ग्रह मैत्री चक्र",
    exaltedPlanets: "उच्च ग्रह (Exalted):",
    debilitatedPlanets: "नीच ग्रह (Debilitated):",
    moolatrikonaOwn: "मूलत्रिकोण / स्वक्षेत्रीय:",
    noneText: "कोई ग्रह नहीं",
    naturalFriendships: (planet: string) => `${planet} ग्रह का नैसर्गिक मैत्री संबंध`,
    friends: "मित्र ग्रह (Friends)",
    enemies: "शत्रु ग्रह (Enemies)",
    neutrals: "सम ग्रह (Neutrals)",
    noEnemies: "कोई प्राकृतिक शत्रु नहीं",

    chandraBalaHeading: "वर्तमान चंद्र बल गोचर (Real-Time Chandra Bala)",
    chandraBalaSub: "आज के दिन चंद्रमा आपकी जन्म राशि से किस भाव में गोचर कर रहा है उसका शुभाशुभ फल",
    transitingMoonSign: "चंद्रमा की वर्तमान राशि",
    houseFromMoon: "जन्म राशि से भाव",
    houseSuffix: (h: string | number) => `${toLocalizedDigits(h, "hi")} वां भाव`,
    resultCategory: "फल श्रेणी",
    chandrashtama: "चंद्राष्टम (विशेष सावधानी)",
    auspiciousTransit: "अत्यंत शुभ एवं सहायक",
    neutralTransit: "सामान्य / मध्यम",
    muhurtaRule:
      "शास्त्रीय नियम: जन्म राशि से १, ३, ६, ७, ১০, ११ भाव में चंद्र शुभ फलदायी; २, ५, ९ मध्यम; ४, ८, १२ भाव में सावधानी आवश्यक है।",
    sadeSatiHeading: "शनि साढ़े साती एवं ढैया ट्रैकर (Saturn Sade Sati Tracker)",
    sadeSatiSub: "जन्म राशि अनुसार शनि का वर्तमान गोचर एवं शास्त्रीय उपाय",
    sadeSatiActive: "प्रभाव सक्रिय",
    sadeSatiInactive: "अनुकूल स्थिति (साढ़े साती नहीं)",
    activePhase: "शनि का वर्तमान चरण",
    saturnSign: "शनि की राशि:",
    remedyHeading: "शास्त्रीय शनि शांति उपाय:",

    cautionsHeading: "किन-किन बातों से सावधान रहें (सावधानियां)",
    cautionsSub: "आपकी राशि की स्वाभाविक कमजोरियां और प्रतिकूल क्षेत्र",
    remediesHeading: "क्या करने से आपका कल्याण होगा (शुभ उपाय)",
    remediesSub: "सौभाग्य, मानसिक शांति और सफलता के अचूक उपाय",
    luckyHeading: "शुभ गुण एवं राशि की विशेषताएं",
    kalapurusha: "शारीरिक शासन (कालपुरुष):",
    luckyGem: "शुभ रत्न",
    luckyColors: "शुभ रंग",
    luckyNumbers: "शुभ अंक",
    luckyDay: "शुभ दिन",
    rulingDeity: "पूज्य देवता",
    compatibleSigns: "अनुकूल राशियां",
    personalityStrengths: "व्यक्तित्व की प्रमुख विशेषताएं",

    recalculateBtn: "अन्य जन्म विवरण से पुनः गणना करें",
    consultAstrologerBtn: "विस्तृत कुंडली विश्लेषण के लिए ज्योतिषी से परामर्श लें",
  },

  en: {
    badge: "Vedic Sidereal Moon Sign & Nakshatra Calculator",
    title: "Find Your Rashi by Date of Birth - Accurate Moon Sign Calculator",
    subtitle:
      "Accurate planetary calculations powered by Vedic Sidereal Ephemeris with KP Sub-Lord, astrological warnings, and Vedic remedies.",
    languageLabel: "Language:",

    formTitle: "Enter Your Birth Details",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your name...",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    dob: "Birth Date",
    mandatory: "Required",
    tob: "Birth Time",
    optionalTob: "Optional — 12:00 PM if omitted",
    pob: "Birth Place",
    pobPlaceholder: "e.g. Kolkata, West Bengal, India",
    advancedSettings: "Advance Settings (Optional)",
    longitude: "Longitude",
    latitude: "Latitude",
    east: "East",
    west: "West",
    north: "North",
    south: "South",
    timezone: "Time Zone",
    timezoneResolved:
      "Resolved from your birth place and date, including daylight saving and historical changes.",
    timezoneManualHelp:
      "Hours from UTC, e.g. India 5.5, Bangladesh 6, Nepal 5.75. Choosing your birth place from the list sets this automatically.",
    ayanamsa: "Ayanamsa System",
    houseSystem: "House System",
    chartStyle: "Chart Style",
    calculateBtn: "Know Your Rashi",
    calculatingBtn: "Calculating Moon Sign…",
    featureDisabled: "Rashi calculator feature is temporarily unavailable.",
    featureDisabledBtn: "Feature Disabled",
    profileSyncWelcome: (name: string) => `Welcome, ${name}!`,
    profileSyncSaved: "Saved birth details loaded from your profile.",
    profileSyncNameOnly: "Name loaded from your profile.",
    reloadProfile: "Reload",
    clearForm: "Clear",
    signInPrompt: "Sign in to automatically load your saved profile and birth details.",
    signInBtn: "Sign In",

    toastFormCleared: "Form cleared.",
    toastProfileLoaded: "Loaded details from your profile.",
    toastNameRequired: "Please enter your name",
    toastDobRequired: "Please enter a valid birth date (DD-MM-YYYY) — DOB is required",
    toastTobInvalid: "Please enter a valid birth time (01-12 hours, 00-59 minutes)",
    toastPlaceRequired:
      "Please choose your birth place from the list — the ascendant and timezone depend on it",
    toastCalculationSuccess: (rashi: string, nak: string) =>
      `Calculated Moon Sign: ${rashi} (${nak} Nakshatra)`,

    calculatedFor: (name: string) => `Vedic Moon Sign Calculated for ${name}`,
    rashiSuffix: "Sign",
    vargottamaBadge:
      "Sacred Vargottama Moon — Positioned in the same sign in both D1 & D9 Navamsha!",
    rulingLord: "Ruling Lord:",
    moonPosition: "Moon Position:",
    element: "Element:",
    modality: "Modality:",
    polarity: "Polarity:",

    nakshatraPada: "Nakshatra & Pada",
    padaSuffix: (p: string | number) => `Pada ${p}`,
    starLordKP: "Star Lord (KP)",
    governsResult: "Governs Result",
    kpSubLord: "KP Sub-Lord",
    qualifiesOutcome: "Qualifies Outcome",
    ascendantLagna: "Ascendant (Lagna)",

    tabCore: "Core & Avakahada",
    tabRules: "15 Classical Rules",
    tabKundali: "Chandra Lagna & Dignity",
    tabTransit: "Transit & Sade Sati",
    tabPredictions: "Cautions & Remedies",

    avakahadaHeading: "Vedic Avakahada Chakra Attributes",
    avakahadaSub: "Foundational attributes transcribed from classical Vedic matchmaking principles",
    auspiciousLetter: "Auspicious Letter:",
    varna: "1. Varna",
    varnaSub: "Temperament",
    vashya: "2. Vashya",
    vashyaSub: "Influence",
    yoni: "3. Yoni Animal",
    yoniSub: "Instinct",
    gana: "4. Gana",
    ganaSub: "Disposition",
    nadi: "5. Nadi",
    nadiSub: "Physiology",
    tatva: "6. Tatva",
    tatvaSub: "Cosmic Element",
    payaHeading: "Birth Foot (Paya):",
    navamshaMoon: "Navamsha Moon Sign (D9):",
    vargottamaStatus: "Vargottama Status:",
    vargottamaActive: "Vargottama (Supreme Fortitude)",
    vargottamaInactive: "Standard Navamsha",
    wheelHeading: "12 Zodiac Signs & 27 Nakshatras Interactive Wheel",
    wheelSub: "Your calculated Moon Sign and Nakshatra are illuminated on the zodiac mandala below.",

    rulesUnavailable: "Classical rules data not available.",

    chandraLagnaChart: "Chandra Lagna Kundali Chart",
    chandraLagnaSub: "Moon placed in 1st House for psychological resilience and transit evaluation",
    janmaLagnaChart: "Janma Lagna D1 Kundali Chart",
    janmaLagnaSub: (ayanamsa: string) => `Ascendant (Lagna) and 9 planets in natal birth horoscope with ${ayanamsa}`,
    chandraLagnaBtn: "Chandra Lagna",
    janmaLagnaBtn: "Lagna D1",
    chartNorth: "North",
    chartSouth: "South",
    chartEast: "East",
    dignityTitle: (rashi: string) => `Planetary Dignities & Natural Friendships for ${rashi}`,
    dignitySub: "Source: Vedic Astrology Principles & Planetary Friendship Matrix",
    exaltedPlanets: "Exalted Planets:",
    debilitatedPlanets: "Debilitated Planets:",
    moolatrikonaOwn: "Moolatrikona / Own:",
    noneText: "None",
    naturalFriendships: (planet: string) => `Natural Friendships of Lord ${planet}`,
    friends: "Friends",
    enemies: "Enemies",
    neutrals: "Neutrals",
    noEnemies: "No natural enemies",

    chandraBalaHeading: "Current Chandra Bala (Lunar Transit Strength)",
    chandraBalaSub: "Daily transit evaluation of Moon relative to your Natal Moon Sign",
    transitingMoonSign: "Transiting Moon Sign",
    houseFromMoon: "House from Natal Moon",
    houseSuffix: (h: string | number) => `${h}th House`,
    resultCategory: "Result Category",
    chandrashtama: "Chandrashtama (Critical Caution)",
    auspiciousTransit: "Highly Auspicious",
    neutralTransit: "Neutral / Moderate",
    muhurtaRule:
      "Classical Muhurta rule: 1st, 3rd, 6th, 7th, 10th, 11th from Moon are auspicious; 4th, 8th, 12th demand mindfulness.",
    sadeSatiHeading: "Saturn Sade Sati & Dhaiya Transit Tracker",
    sadeSatiSub: "Real-time planetary analysis of Saturn's current transit relative to your Moon Sign",
    sadeSatiActive: "Active Transit",
    sadeSatiInactive: "Favorable Transit (No Sade Sati)",
    activePhase: "Active Phase",
    saturnSign: "Saturn Sign:",
    remedyHeading: "Prescribed Classical Remedy:",

    cautionsHeading: "Cautions & Pitfalls (What to Avoid)",
    cautionsSub: "Innate vulnerabilities and traits to be mindful of",
    remediesHeading: "Beneficial Actions & Remedies (What to Do)",
    remediesSub: "Auspicious Vedic practices to enhance luck and peace",
    luckyHeading: "Lucky Attributes & Key Strengths",
    kalapurusha: "Kalapurusha Governance:",
    luckyGem: "Lucky Gem",
    luckyColors: "Lucky Colors",
    luckyNumbers: "Lucky Numbers",
    luckyDay: "Lucky Day",
    rulingDeity: "Ruling Deity",
    compatibleSigns: "Compatible Signs",
    personalityStrengths: "Personality Strengths",

    recalculateBtn: "Recalculate with different details",
    consultAstrologerBtn: "Consult an Astrologer for Detailed Kundali",
  },
};

/**
 * Translates an array of planet names (e.g. ["Sun", "Moon", "Mars"])
 */
export function translatePlanetList(
  planets: string[] | undefined | null,
  lang: AstrologyLanguage
): string {
  if (!planets || planets.length === 0) return "";
  return planets.map((p) => translatePlanetName(p.trim(), lang)).join(", ");
}

/**
 * Translates an array of compatible rashi signs (e.g. ["Leo", "Sagittarius"])
 */
export function translateRashiList(
  rashis: string[] | undefined | null,
  lang: AstrologyLanguage
): string {
  if (!rashis || rashis.length === 0) return "";
  return rashis.map((r) => translateRashiName(r.trim(), lang)).join(", ");
}

/**
 * Translates Avakahada Paya value description
 */
export function translatePayaBadge(paya: string | undefined | null, lang: AstrologyLanguage): string {
  if (!paya) return "";
  const p = paya.toLowerCase();
  if (p.includes("gold") || p.includes("স্বর্ণ") || p.includes("स्वर्ण")) {
    return lang === "bn" ? "স্বর্ণ পায়া (Gold Paya)" : lang === "hi" ? "स्वर्ण पाया (Gold Paya)" : "Gold Paya";
  }
  if (p.includes("silver") || p.includes("রৌপ্য") || p.includes("रजत")) {
    return lang === "bn" ? "রৌপ্য পায়া (Silver Paya)" : lang === "hi" ? "रजत पाया (Silver Paya)" : "Silver Paya";
  }
  if (p.includes("copper") || p.includes("তাম্র") || p.includes("ताम्र")) {
    return lang === "bn" ? "তাম্র পায়া (Copper Paya)" : lang === "hi" ? "ताम्र पाया (Copper Paya)" : "Copper Paya";
  }
  if (p.includes("iron") || p.includes("লৌহ") || p.includes("लोहा")) {
    return lang === "bn" ? "লৌহ পায়া (Iron Paya)" : lang === "hi" ? "लौह पाया (Iron Paya)" : "Iron Paya";
  }
  return paya.split("-")[0].trim();
}

