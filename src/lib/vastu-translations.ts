import type { AstrologyLanguage } from "@/types";

export interface VastuTranslations {
  badge: string;
  title: string;
  subtitle: string;
  featureDisabled: string;
  coinsDeducted: (coins: number) => string;
  auditSuccess: string;

  // Tabs
  tabCompass: string;
  tabMedical: string;
  tabAstroVastu: string;
  tabAyadi: string;
  tabAudit: string;
  tabZones: string;
  tabRemedies: string;

  // Audit Form
  auditSectionTitle: string;
  auditSectionSub: string;
  propertyTypeLabel: string;
  typeResidential: string;
  typeCommercial: string;
  typeIndustrial: string;
  entranceAngleLabel: string;
  goldenDoor: string;
  needsRemedy: string;
  roomPositionsTitle: string;
  generateAuditBtn: string;
  generatingAudit: string;

  // Rooms
  roomKitchen: string;
  roomMasterBed: string;
  roomToilet: string;
  roomPuja: string;
  roomBorewell: string;
  roomOverheadTank: string;
  roomCashLocker: string;
  roomStaircase: string;

  // Audit Results
  gradeLabel: (grade: string) => string;
  harmonyScoreLabel: (score: number) => string;
  criticalFlawsTitle: (count: number) => string;
  zoneEvaluationTitle: string;
  zonePlacedLabel: (zone: string) => string;
  remedyLabel: string;
  metalStripLabel: (strip: string) => string;

  // Compass CTA
  compassCtaTitle: string;
  compassCtaSub: (deg: number) => string;
  openAuditBtn: string;

  // 16 Zones Tab
  zonesTabTitle: string;
  zonesTabSub: string;
  organLabel: string;
  aspectLabel: string;
  colorsLabel: string;
  avoidColorsLabel: string;

  // 120 Remedies Tab
  remedyCatAll: string;
  remedyCatFinance: string;
  remedyCatHealth: string;
  remedyCatFame: string;
  remedyCatSocial: string;
  remedyCatOpportunity: string;
  zoneSuffix: string;
  requiredItemLabel: string;

  // Medical Vastu
  medicalTitle: string;
  medicalSub: string;
  selectAilment: string;
  diagnosedAilment: string;
  elementalDomain: string;
  bodyOrgan: string;
  ayurvedicDosha: string;
  rootCause: string;
  medicalRemedy: string;

  // Astro Vastu
  astroVastuTitle: string;
  astroVastuSub: string;
  activePlanetZone: string;
  dashaSignificance: string;
  criticalDos: string;
  criticalDonts: string;
  talismanicRemedy: string;

  // Ayadi
  ayadiTitle: string;
  ayadiSub: string;
  enterDimensions: string;
  feetUnit: string;
  meterUnit: string;
  lengthLabel: (u: string) => string;
  widthLabel: (u: string) => string;
  calculateAyadiBtn: string;
  calculatedAaya: string;
  totalArea: string;
  dhanaVsRina: string;
  goodStatus: string;
  longevity: string;
  yearsSuffix: (y: number) => string;
  buildingNakshatra: string;
  idealDirections: string;
  validDimensionsError: string;
  ayadiSuccess: string;
}

export const VASTU_I18N: Record<AstrologyLanguage, VastuTranslations> = {
  bn: {
    badge: "বৈজ্ঞানিক বাস্তু শাস্ত্র (১৬টি জোন ও ৩২টি পদ চক্র)",
    title: "১৬-জোন পঞ্চভূত ভারসাম্য ও ভাঙচুরবিহীন মেটাল প্রতিকার",
    subtitle: "অথরিটেটিভ ৩৭৪ পৃষ্ঠার ক্লায়েন্ট ম্যানুয়াল দ্বারা পরিচালিত কোণভিত্তিক ৩২-পদ এনার্জি গ্রিড, স্বর্ণদ্বার এন্ট্রান্স, পঞ্চভূত দোষ শোধন এবং ১২০টি অলৌকিক বাস্তু প্রতিকার।",
    featureDisabled: "বাস্তু শাস্ত্র ফিচারটি বর্তমানে অ্যাডমিন দ্বারা বন্ধ রয়েছে।",
    coinsDeducted: (coins) => `${coins} কয়েন ব্যালেন্স থেকে কাটা হয়েছে`,
    auditSuccess: "৩৬০° বাস্তু অডিট রিপোর্ট সফলভাবে তৈরি হয়েছে!",

    tabCompass: "স্মার্ট কম্পাস ও এআর (Live & AR)",
    tabMedical: "মেডিকেল বাস্তু (Medical Vastu)",
    tabAstroVastu: "অ্যাস্ট্রো-বাস্তু কুণ্ডলী (Astro-Vastu)",
    tabAyadi: "আয়াদি ষড়বর্গ (Ayadi Vedic)",
    tabAudit: "৩৬০° প্রপার্টি অডিট",
    tabZones: "১৬টি দিক ও পঞ্চভূত জোন",
    tabRemedies: "১২০ অলৌকিক প্রতিকার",

    auditSectionTitle: "ভবনের মূল প্রবেশদ্বার ও কক্ষ মূল্যায়ন",
    auditSectionSub: "মূল প্রবেশদ্বারের নিখুঁত কোণ ও কক্ষসমূহের জোন নির্বাচন করে পূর্ণাঙ্গ বাস্তু স্কোর জানুন।",
    propertyTypeLabel: "প্রপার্টির ধরন:",
    typeResidential: "আবাসিক (Residential)",
    typeCommercial: "বাণিজ্যিক (Commercial)",
    typeIndustrial: "শিল্প কারখানা (Industrial)",
    entranceAngleLabel: "মূল প্রবেশদ্বারের কম্পাস কোণ:",
    goldenDoor: "স্বর্ণদ্বার (Golden Door)",
    needsRemedy: "প্রতিকূল (Needs Remedy)",
    roomPositionsTitle: "কক্ষ ও কাঠামোর বর্তমান জোন অবস্থান (Room & Fixture Positions)",
    generateAuditBtn: "বাস্তু অডিট রিপোর্ট তৈরি করুন (Generate Full Audit)",
    generatingAudit: "অডিট তৈরি হচ্ছে...",

    roomKitchen: "রান্নাঘর (Kitchen)",
    roomMasterBed: "মাস্টার বেডরুম (Master Bed)",
    roomToilet: "টয়লেট / কমোড (Toilet)",
    roomPuja: "পূজা ঘর / মন্দির (Puja)",
    roomBorewell: "আন্ডারগ্রাউন্ড ট্যাঙ্ক (Borewell)",
    roomOverheadTank: "ওভারহেড ট্যাঙ্ক (Overhead Tank)",
    roomCashLocker: "টাকার সিন্দুক (Cash Locker)",
    roomStaircase: "সিঁড়ি (Staircase)",

    gradeLabel: (grade) => `গ্রেড: ${grade}`,
    harmonyScoreLabel: (score) => `বাস্তু সঙ্গতি স্কোর: ${score}%`,
    criticalFlawsTitle: (count) => `গুরুতর বাস্তু ত্রুটি চিহ্নিত হয়েছে (${count}টি)`,
    zoneEvaluationTitle: "কক্ষভিত্তিক মূল্যায়ন ও ভাঙচুরবিহীন রেমেডি",
    zonePlacedLabel: (zone) => `অবস্থান: ${zone} জোন`,
    remedyLabel: "প্রতিকার:",
    metalStripLabel: (strip) => `মেটাল স্ট্রিপ ব্লক: ${strip}`,

    compassCtaTitle: "এই কম্পাস কোণটি দিয়ে সম্পূর্ণ ভবনের অডিট করতে চান?",
    compassCtaSub: (deg) => `বর্তমান প্রবেশদ্বার কোণ: ${deg.toFixed(1)}° — রান্নাঘর, মাস্টার বেডরুম, টয়লেট সহ সব কক্ষের পূর্ণাঙ্গ অডিট ও স্কোরকার্ড দেখুন।`,
    openAuditBtn: "৩৬০° প্রপার্টি অডিট খুলুন",

    zonesTabTitle: "১৬টি দিক ও পঞ্চভূত ভারসাম্য জোন",
    zonesTabSub: "প্রত্যেকটি জোনের নিয়ন্ত্রক দেবতা, তত্ত্ব, শুভ-অশুভ রঙ ও শারীরিক অঙ্গ।",
    organLabel: "শারীরিক অঙ্গ:",
    aspectLabel: "জীবন ক্ষেত্র:",
    colorsLabel: "শুভ রঙ:",
    avoidColorsLabel: "বর্জনীয় রঙ:",

    remedyCatAll: "সকল প্রতিকার",
    remedyCatFinance: "আর্থিক সমৃদ্ধি",
    remedyCatHealth: "স্বাস্থ্য ও আরোগ্য",
    remedyCatFame: "যশ ও পরিচিতি",
    remedyCatSocial: "সামাজিক সংযোগ",
    remedyCatOpportunity: "নতুন সুযোগ",
    zoneSuffix: "জোন",
    requiredItemLabel: "প্রয়োজনীয় সামগ্রী:",

    medicalTitle: "মেডিকেল ও প্যাথলজি বাস্তু নির্ণয় (Medical Vastu)",
    medicalSub: "শারীরিক ব্যাধি ও গৃহের ১৬টি জোনের পঞ্চভূত ভারসাম্যহীনতার বৈজ্ঞানিক সম্পর্ক।",
    selectAilment: "লক্ষণ বা রোগ নির্বাচন করুন",
    diagnosedAilment: "চিহ্নিত রোগ / লক্ষণ",
    elementalDomain: "আক্রান্ত পঞ্চভূত তত্ত্ব",
    bodyOrgan: "সংবেদনশীল শারীরবৃত্তীয় অঙ্গ",
    ayurvedicDosha: "আয়ুর্বেদিক দোষ",
    rootCause: "বাস্তুগত মূল কারণ (Root Cause in House)",
    medicalRemedy: "ভাঙচুরবিহীন বৈদিক চিকিৎসা প্রতিকার",

    astroVastuTitle: "অ্যাস্ট্রো-বাস্তু কুণ্ডলী সংযোগ (Astro-Vastu Synergy)",
    astroVastuSub: "চলমান গ্রহের মহাদশা অনুযায়ী কোন দিক সক্রিয় রাখা আবশ্যক এবং কী বর্জনীয়।",
    activePlanetZone: "সক্রিয় গ্রহ ও নিয়ন্ত্রক দিক",
    dashaSignificance: "মহাদশায় এই দিকের গুরুত্ব",
    criticalDos: "বাধ্যতামূলক করণীয় (Critical DOs)",
    criticalDonts: "কঠোরভাবে বর্জনীয় (Critical DONTs)",
    talismanicRemedy: "তালিকাসিদ্ধ বস্তুর সক্রিয়করণ প্রতিকার (Talismanic Object Activation)",

    ayadiTitle: "আয়াদি ষড়বর্গ বৈদিক গৃহ প্রকৌশল (Ayadi Shadvarga)",
    ayadiSub: "ঘর বা প্লটের সঠিক দৈর্ঘ্য ও প্রস্থের মাধ্যমে ধনাত্মক আয়, নক্ষত্র এবং দীর্ঘায়ু নির্ধারণ।",
    enterDimensions: "জমির বা ঘরের মাপ লিখুন",
    feetUnit: "ফুট (Feet)",
    meterUnit: "মিটার (Meter)",
    lengthLabel: (u) => `দৈর্ঘ্য (${u})`,
    widthLabel: (u) => `প্রস্থ (${u})`,
    calculateAyadiBtn: "আয়াদি গণনা করুন",
    calculatedAaya: "নির্ধারিত বৈদিক আয়",
    totalArea: "মোট ক্ষেত্রফল",
    dhanaVsRina: "ধন (আয়) বনাম ঋণ",
    goodStatus: "শুভ",
    longevity: "ভবনের আয়ু",
    yearsSuffix: (y) => `${y} বছর`,
    buildingNakshatra: "ভবন নক্ষত্র",
    idealDirections: "এই আয়ার জন্য শ্রেষ্ঠ প্রবেশদ্বার অভিমুখ",
    validDimensionsError: "সঠিক দৈর্ঘ্য ও প্রস্থ লিখুন।",
    ayadiSuccess: "আয়াদি ষড়বর্গ গণনা সফলভাবে সম্পন্ন হয়েছে!",
  },
  hi: {
    badge: "वैज्ञानिक वास्तु शास्त्र (16 ज़ोन एवं 32 पद चक्र)",
    title: "16-ज़ोन पंचतत्व संतुलन एवं बिना तोड़-फोड़ धातु पट्टी उपचार",
    subtitle: "प्रमाणित 374 पृष्ठों की वास्तु नियमावली द्वारा संचालित कोण-आधारित 32 पद ऊर्जा चक्र, स्वर्णिम द्वार, पंचतत्व विश्लेषण एवं बिना तोड़-फोड़ उपचार।",
    featureDisabled: "वास्तु शास्त्र सुविधा वर्तमान में उपलब्ध नहीं है।",
    coinsDeducted: (coins) => `${coins} सिक्के वॉलेट से काटे गए`,
    auditSuccess: "360° वास्तु ऑडिट रिपोर्ट सफलतापूर्वक तैयार हुई!",

    tabCompass: "स्मार्ट कम्पास एवं एआर",
    tabMedical: "मेडिकल वास्तु निदान",
    tabAstroVastu: "एस्ट्रो-वास्तु कुण्डली",
    tabAyadi: "आयादि षड्वर्ग गणक",
    tabAudit: "360° प्रॉपर्टी ऑडिट",
    tabZones: "16 दिशाएं व पंचतत्व",
    tabRemedies: "120 अचूक उपाय",

    auditSectionTitle: "भवन का मुख्य प्रवेश द्वार एवं कक्ष मूल्यांकन",
    auditSectionSub: "मुख्य प्रवेश द्वार का सटीक कोण और कमरों का क्षेत्र चुनकर संपूर्ण वास्तु स्कोर जानें।",
    propertyTypeLabel: "प्रॉपर्टी का प्रकार:",
    typeResidential: "आवासीय (Residential)",
    typeCommercial: "व्यावसायिक (Commercial)",
    typeIndustrial: "औद्योगिक (Industrial)",
    entranceAngleLabel: "मुख्य प्रवेश द्वार कम्पास कोण:",
    goldenDoor: "स्वर्णिम द्वार (शुभ)",
    needsRemedy: "अशुभ (उपाय आवश्यक)",
    roomPositionsTitle: "कमरों एवं संरचनाओं की वर्तमान स्थिति (Room Placements)",
    generateAuditBtn: "वास्तु ऑडिट रिपोर्ट तैयार करें (Generate Full Audit)",
    generatingAudit: "ऑडिट तैयार हो रहा है...",

    roomKitchen: "रसोई घर (Kitchen)",
    roomMasterBed: "मुख्य शयनकक्ष (Master Bed)",
    roomToilet: "शौचालय (Toilet)",
    roomPuja: "पूजा घर / मंदिर (Temple)",
    roomBorewell: "भूमिगत जल स्रोत (Borewell)",
    roomOverheadTank: "छत पर पानी की टंकी",
    roomCashLocker: "तिजोरी / लॉकर (Cash Locker)",
    roomStaircase: "सीढ़ियाँ (Staircase)",

    gradeLabel: (grade) => `ग्रेड: ${grade}`,
    harmonyScoreLabel: (score) => `वास्तु अनुकूलता स्कोर: ${score}%`,
    criticalFlawsTitle: (count) => `गंभीर वास्तु दोष पाए गए (${count})`,
    zoneEvaluationTitle: "कक्ष-वार मूल्यांकन एवं धातु पट्टी उपचार",
    zonePlacedLabel: (zone) => `स्थिति: ${zone} क्षेत्र`,
    remedyLabel: "उपाय:",
    metalStripLabel: (strip) => `धातु पट्टी ब्लॉक: ${strip}`,

    compassCtaTitle: "क्या आप इस कोण से संपूर्ण भवन का ऑडिट करना चाहते हैं?",
    compassCtaSub: (deg) => `वर्तमान प्रवेश द्वार कोण: ${deg.toFixed(1)}° — रसोई, शयनकक्ष, शौचालय सहित सभी कक्षों का संपूर्ण ऑडिट देखें।`,
    openAuditBtn: "360° प्रॉपर्टी ऑडिट खोलें",

    zonesTabTitle: "16 दिशाएं एवं पंचतत्व संतुलन",
    zonesTabSub: "प्रत्येक ज़ोन के नियंत्रक देवता, तत्व, शुभ-अशुभ रंग एवं शारीरिक अंग।",
    organLabel: "शारीरिक अंग:",
    aspectLabel: "जीवन क्षेत्र:",
    colorsLabel: "शुभ रंग:",
    avoidColorsLabel: "वर्जित रंग:",

    remedyCatAll: "सभी उपाय",
    remedyCatFinance: "आर्थिक समृद्धि",
    remedyCatHealth: "स्वास्थ्य एवं आरोग्य",
    remedyCatFame: "यश एवं ख्याति",
    remedyCatSocial: "सामाजिक संबंध",
    remedyCatOpportunity: "नए अवसर",
    zoneSuffix: "ज़ोन",
    requiredItemLabel: "आवश्यक सामग्री:",

    medicalTitle: "मेडिकल एवं पैथोलॉजी वास्तु निदान (Medical Vastu)",
    medicalSub: "शारीरिक रोग और घर के 16 क्षेत्रों के पंचतत्व असंतुलन का वैज्ञानिक संबंध।",
    selectAilment: "रोग या लक्षण चुनें",
    diagnosedAilment: "चिह्नित रोग / लक्षण",
    elementalDomain: "प्रभावित पंचतत्व",
    bodyOrgan: "संवेदनशील शारीरिक अंग",
    ayurvedicDosha: "आयुर्वेदिक दोष",
    rootCause: "वास्तु मूल कारण (Root Cause in House)",
    medicalRemedy: "बिना तोड़-फोड़ वैदिक उपाय",

    astroVastuTitle: "एस्ट्रो-वास्तु कुण्डली समन्वय (Astro-Vastu Synergy)",
    astroVastuSub: "सक्रिय ग्रह महादशा अनुसार कौन सी दिशा संतुलित रखना आवश्यक है।",
    activePlanetZone: "सक्रिय ग्रह एवं नियंत्रक दिशा",
    dashaSignificance: "इस महादशा में दिशा का महत्व",
    criticalDos: "अनिवार्य नियम (Critical DOs)",
    criticalDonts: "कड़ाई से वर्जित (Critical DONTs)",
    talismanicRemedy: "सिद्ध वस्तु सक्रियण उपाय (Talismanic Object Activation)",

    ayadiTitle: "आयादि षड्वर्ग वैदिक वास्तु गणित (Ayadi Shadvarga)",
    ayadiSub: "भूमि या भवन की लंबाई व चौड़ाई अनुसार आय, नक्षत्र और दीर्घायु निर्धारण।",
    enterDimensions: "भूमि या भवन की माप दर्ज करें",
    feetUnit: "फुट (Feet)",
    meterUnit: "मीटर (Meter)",
    lengthLabel: (u) => `लंबाई (${u})`,
    widthLabel: (u) => `चौड़ाई (${u})`,
    calculateAyadiBtn: "आयादि गणना करें",
    calculatedAaya: "निर्धारित वैदिक आय",
    totalArea: "कुल क्षेत्रफल",
    dhanaVsRina: "धन (आय) बनाम ऋण",
    goodStatus: "शुभ",
    longevity: "भवन की आयु",
    yearsSuffix: (y) => `${y} वर्ष`,
    buildingNakshatra: "भवन नक्षत्र",
    idealDirections: "इस आय के लिए सर्वोत्तम प्रवेश द्वार दिशा",
    validDimensionsError: "कृपया मान्य लंबाई और चौड़ाई दर्ज करें।",
    ayadiSuccess: "आयादि षड्वर्ग गणना सफलतापूर्वक पूरी हुई!",
  },
  en: {
    badge: "Scientific Vastu Shastra (16 Zones & 32 Padas)",
    title: "16-Zone Panchabhuta Energy & Non-Demolition Remedies",
    subtitle: "Authoritative 374-page Vedic manual-driven 32-pada energy grid, 8 golden entrance doors, 16 directional zones with elemental balance, and 120 miraculous non-demolition remedies.",
    featureDisabled: "Vastu Shastra feature is temporarily unavailable.",
    coinsDeducted: (coins) => `${coins} coins deducted from wallet`,
    auditSuccess: "360° Vastu audit report generated successfully!",

    tabCompass: "Smart Compass & AR",
    tabMedical: "Medical Vastu",
    tabAstroVastu: "Astro-Vastu Synergy",
    tabAyadi: "Ayadi Shadvarga",
    tabAudit: "360° Property Audit",
    tabZones: "16 Elemental Zones",
    tabRemedies: "120 Miraculous Remedies",

    auditSectionTitle: "Property Entrance & Room Alignment Audit",
    auditSectionSub: "Set exact entrance compass degree and room positions for a comprehensive Vedic compliance audit.",
    propertyTypeLabel: "Property Type:",
    typeResidential: "Residential",
    typeCommercial: "Commercial",
    typeIndustrial: "Industrial",
    entranceAngleLabel: "Main Entrance Compass Angle:",
    goldenDoor: "Auspicious Golden Door",
    needsRemedy: "Needs Remedy",
    roomPositionsTitle: "Room & Structure Zone Positions",
    generateAuditBtn: "Generate Complete 360° Vastu Audit",
    generatingAudit: "Generating Audit...",

    roomKitchen: "Kitchen",
    roomMasterBed: "Master Bedroom",
    roomToilet: "Toilet / Commode",
    roomPuja: "Puja Room / Temple",
    roomBorewell: "Underground Borewell",
    roomOverheadTank: "Overhead Water Tank",
    roomCashLocker: "Cash Locker / Safe",
    roomStaircase: "Staircase",

    gradeLabel: (grade) => `Grade: ${grade}`,
    harmonyScoreLabel: (score) => `Vastu Harmony Score: ${score}%`,
    criticalFlawsTitle: (count) => `Critical Vastu Flaws Identified (${count})`,
    zoneEvaluationTitle: "Zone Evaluation & Non-Demolition Metal Strip Remedies",
    zonePlacedLabel: (zone) => `Zone: ${zone}`,
    remedyLabel: "Remedy:",
    metalStripLabel: (strip) => `Metal Strip Blocking: ${strip}`,

    compassCtaTitle: "Audit entire property with this compass orientation?",
    compassCtaSub: (deg) => `Current entrance angle: ${deg.toFixed(1)}° — Evaluate all rooms at once.`,
    openAuditBtn: "Open 360° Property Audit",

    zonesTabTitle: "16 Directional Energy Zones",
    zonesTabSub: "Elemental rulers, body organ associations, and auspicious colors for all 16 zones.",
    organLabel: "Body Organ:",
    aspectLabel: "Life Aspect:",
    colorsLabel: "Auspicious Colors:",
    avoidColorsLabel: "Colors to Avoid:",

    remedyCatAll: "All Remedies",
    remedyCatFinance: "Financial Growth",
    remedyCatHealth: "Health & Vitality",
    remedyCatFame: "Brand & Fame",
    remedyCatSocial: "Social Ties",
    remedyCatOpportunity: "New Opportunities",
    zoneSuffix: "Zone",
    requiredItemLabel: "Required Item:",

    medicalTitle: "Medical & Pathology Vastu Diagnostics",
    medicalSub: "Scientific connection between physical ailments and 5-element imbalances in the 16 zones.",
    selectAilment: "Select Ailment or Symptom",
    diagnosedAilment: "Diagnosed Ailment",
    elementalDomain: "Elemental Domain",
    bodyOrgan: "Body Organ",
    ayurvedicDosha: "Ayurvedic Dosha",
    rootCause: "Vastu Root Cause in House",
    medicalRemedy: "Non-Demolition Vedic Remedy",

    astroVastuTitle: "Astro-Vastu Synergy Matrix",
    astroVastuSub: "Align house zones with your active Mahadasha planet for continuous growth.",
    activePlanetZone: "Active Planet & Zone",
    dashaSignificance: "Significance During This Dasha",
    criticalDos: "Critical DOs",
    criticalDonts: "Critical DONTs",
    talismanicRemedy: "Talismanic Object Activation Remedy",

    ayadiTitle: "Ayadi Shadvarga Vedic Engineering",
    ayadiSub: "Calculate wealth inflow, building longevity, and astrological resonance from length and width.",
    enterDimensions: "Enter Room or Plot Dimensions",
    feetUnit: "Feet",
    meterUnit: "Meter",
    lengthLabel: (u) => `Length (${u})`,
    widthLabel: (u) => `Width (${u})`,
    calculateAyadiBtn: "Calculate Ayadi",
    calculatedAaya: "Calculated Vedic Aaya",
    totalArea: "Total Area",
    dhanaVsRina: "Dhana (Income) vs Rina (Debt)",
    goodStatus: "Good",
    longevity: "Building Longevity",
    yearsSuffix: (y) => `${y} Years`,
    buildingNakshatra: "Building Nakshatra",
    idealDirections: "Ideal Entrance Directions for this Aaya",
    validDimensionsError: "Please enter valid dimensions.",
    ayadiSuccess: "Ayadi calculation completed successfully!",
  },
};
