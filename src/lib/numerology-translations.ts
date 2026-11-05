import type { AstrologyLanguage } from "@/types";

export interface NumerologyTranslations {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  birthDate: string;
  gender: string;
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  mobileNumber: string;
  mobileNumberPlaceholder: string;
  calculateBtn: string;
  calculating: string;
  validationError: string;
  featureDisabled: string;

  // Stat Cards
  driverMulank: string;
  destinyBhagyank: string;
  kuaNumber: string;
  personalVibration: string;
  personalYear: string;

  // Tabs
  tabLoshu: string;
  tabDasha: string;
  tabName: string;
  tabNameCorrect: string;
  tabMobile: string;
  tabMobileCompare: string;
  tabBusiness: string;
  tabVehicleBank: string;
  tabRemedies: string;
  tabProfile: string;

  // Lo Shu & Raj Yogas
  loShuGridTitle: string;
  loShuSequence: string;
  rajYogasTitle: string;
  activeStatus: string;
  inactiveStatus: string;
  planesTitle: string;
  statusComplete: string;
  statusPartial: string;
  statusMissing: string;

  // Dasha
  dashaTitle: string;
  dashaSub: string;
  numberLabel: (num: number) => string;
  favorable: string;
  neutral: string;
  unfavorable: string;

  // Name Analysis
  nameAnalysisTitle: string;
  nameAnalysisSub: string;
  compoundNumber: string;
  singleDigitVibration: string;
  letterSoundsTitle: string;
  valueLabel: string;
  soundElement: string;
  recommendationLabel: string;

  // Mobile Audit
  mobileAuditTitle: string;
  mobileTotalSum: string;
  singleDigitSum: string;
  auditVerdict: string;
  conjunctionPairsTitle: string;
  conjunctionFormula: string;
  pairSuffix: string;
  lShapesTitle: string;

  // Remedies
  missingNumbersTitle: string;
  missingPrefix: (digit: number) => string;
  impactLabel: string;
  remedyLabel: string;
  rudrakshaLabel: string;
  crystalLabel: string;

  // 20-Field Profile
  profileTitle: (num: number) => string;
  profileSub: string;
  rulingPlanetDeity: string;
  metalGemstone: string;
  luckyDirection: string;
  luckyColors: string;
  unluckyColors: string;
  luckyDaysMonths: string;
  beejMantraJap: string;
  japCountSuffix: (count: number) => string;
  grainsDaan: string;
  healthTraits: string;
  suitableProfession: string;

  // Recalculate
  recalculateBtn: string;
  consultAstrologerBtn: string;
}

export const NUMEROLOGY_I18N: Record<AstrologyLanguage, NumerologyTranslations> = {
  bn: {
    badge: "বৈদিক, চ্যালডিয়ান ও লো-শু নিউমারোলজি",
    title: "পূর্ণাঙ্গ বৈদিক সংখ্যাজ্যোতিষ (নিউমারোলজি)",
    subtitle:
      "মূলাঙ্ক, ভাগ্যাঙ্ক, ৩×৩ লো-শু গ্রিড, রাজযোগ, চ্যালডিয়ান নাম সংশোধন ও মোবাইল অডিটের বৈদিক প্ল্যাটফর্ম।",
    formTitle: "আপনার বিবরণ প্রদান করুন",
    fullName: "পূর্ণ নাম",
    fullNamePlaceholder: "আপনার পূর্ণ নাম লিখুন",
    birthDate: "জন্মতারিখ",
    gender: "লিঙ্গ",
    genderMale: "পুরুষ",
    genderFemale: "মহিলা",
    genderOther: "অন্যান্য",
    mobileNumber: "মোবাইল নম্বর (ঐচ্ছিক)",
    mobileNumberPlaceholder: "১০ ডিজিট মোবাইল নম্বর",
    calculateBtn: "গণনা করুন",
    calculating: "গণনা হচ্ছে...",
    validationError: "অনুগ্রহ করে পূর্ণ নাম ও জন্মতারিখ প্রদান করুন",
    featureDisabled: "ফিচারটি বন্ধ রয়েছে",

    driverMulank: "মূলাঙ্ক (Driver)",
    destinyBhagyank: "ভাগ্যাঙ্ক (Destiny)",
    kuaNumber: "কুয়া সংখ্যা (Kua)",
    personalVibration: "ব্যক্তিগত শুভ কম্পন",
    personalYear: "ব্যক্তিগত বছর (Personal Year)",

    tabLoshu: "বৈদিক লো-শু গ্রিড ও যোগ",
    tabDasha: "সংখ্যা দশা টাইমলাইন",
    tabName: "চ্যালডিয়ান নাম বিশ্লেষণ",
    tabNameCorrect: "নাম সংশোধন ও শুভ বানান",
    tabMobile: "মোবাইল অডিট",
    tabMobileCompare: "সিম তুলনা স্যুট",
    tabBusiness: "ব্যবসা ও ব্র্যান্ড অডিট",
    tabVehicleBank: "গাড়ি ও ব্যাংক অ্যাকাউন্ট",
    tabRemedies: "অনুপস্থিত সংখ্যা প্রতিকার",
    tabProfile: "মূলাঙ্ক ২০-ক্ষেত্র বিবরণ",

    loShuGridTitle: "বৈদিক ৩×৩ লো-শু গ্রিড",
    loShuSequence: "৩-১-৯ / ৬-৭-৫ / ২-৮-৪",
    rajYogasTitle: "সক্রিয় রাজযোগ (Special Raj Yogas)",
    activeStatus: "সক্রিয় (Active)",
    inactiveStatus: "অনুপস্থিত",
    planesTitle: "লো-শু সমতল ও স্তম্ভ (Planes of Will & Action)",
    statusComplete: "সম্পূর্ণ (১০০%)",
    statusPartial: "আংশিক",
    statusMissing: "অনুপস্থিত (০%)",

    dashaTitle: "বৈদিক সংখ্যা দশা সময়কাল (Vedic Dasha Hierarchy)",
    dashaSub: "মহাদশা (MD), অন্তর্দশা (AD) ও প্রত্যন্তর্দশা (PD) স্তরীয় সময়কাল",
    numberLabel: (num) => `সংখ্যা ${num}`,
    favorable: "অনুকূল",
    neutral: "নিরপেক্ষ",
    unfavorable: "প্রতিকূল",

    nameAnalysisTitle: "চ্যালডিয়ান নাম বিশ্লেষণ (Chaldean Compound Name)",
    nameAnalysisSub: "নামের প্রতিটি অক্ষরের সংখ্যাগত কম্পন ও যৌগিক সংখ্যার প্রভাব",
    compoundNumber: "যৌগিক সংখ্যা",
    singleDigitVibration: "একক সংখ্যা কম্পন",
    letterSoundsTitle: "বর্ণভিত্তিক চ্যালডিয়ান স্পন্দন (Letter Sound Profiles)",
    valueLabel: "মান:",
    soundElement: "ধ্বনি মৌল:",
    recommendationLabel: "পরামর্শ:",

    mobileAuditTitle: "মোবাইল নম্বর অডিট (Mobile Number Numerology)",
    mobileTotalSum: "যোগফল:",
    singleDigitSum: "একক সংখ্যা:",
    auditVerdict: "অডিট রায়",
    conjunctionPairsTitle: "ক্রমান্বয়ে ২-সংখ্যার জোড়া (৬০% / ৪০% আধিপত্য সূত্র)",
    conjunctionFormula: "১ম ডিজিট ৬০% • ২য় ডিজিট ৪০%",
    pairSuffix: "জোড়া",
    lShapesTitle: "মোবাইল গ্রিডের এল-শেপ (Sepharial 3x3 L-Shapes)",

    missingNumbersTitle: "অনুপস্থিত সংখ্যার প্রতিকার (Missing Numbers & Vedic Remedies)",
    missingPrefix: (digit) => `অনুপস্থিত ${digit}`,
    impactLabel: "প্রভাব:",
    remedyLabel: "উপায়:",
    rudrakshaLabel: "রুদ্রাক্ষ:",
    crystalLabel: "ক্রিস্টাল:",

    profileTitle: (num) => `মূলাঙ্ক ${num}-এর পূর্ণাঙ্গ ২০-ক্ষেত্র শাস্ত্রীয় বিবরণ (NEW NUMRO)`,
    profileSub: "ক্লায়েন্ট কর্তৃক প্রদত্ত অথরিটেটিভ হস্তলিখিত নিয়মাবলীর পূর্ণাঙ্গ রূপান্তর।",
    rulingPlanetDeity: "অধিপতি গ্রহ ও ইষ্টদেবতা:",
    metalGemstone: "ধাতু ও রত্ন:",
    luckyDirection: "শুভ দিক:",
    luckyColors: "শুভ রঙ:",
    unluckyColors: "বর্জনীয় রঙ:",
    luckyDaysMonths: "শুভ বার ও মাস:",
    beejMantraJap: "মূল বৈদিক বীজ মন্ত্র ও জপ সংখ্যা:",
    japCountSuffix: (count) => `(${count.toLocaleString()} বার জপ)`,
    grainsDaan: "দান সামগ্রী (Grains Daan):",
    healthTraits: "স্বাস্থ্য সতর্কতা ও রোগ প্রবণতা:",
    suitableProfession: "উপযুক্ত পেশা ও জীবিকা ক্ষেত্র:",

    recalculateBtn: "অন্য বিবরণ দিয়ে পুনরায় গণনা করুন",
    consultAstrologerBtn: "অভিজ্ঞ জ্যোতিষীর সাথে বিস্তারিত পরামর্শ করুন",
  },

  hi: {
    badge: "वैदिक, कैल्डियन एवं लो-शु अंक ज्योतिष",
    title: "सम्पूर्ण वैदिक अंक ज्योतिष (न्यूमरोलॉजी)",
    subtitle:
      "मूलांक, भाग्यांक, ३×३ लो-शु ग्रिड, राजयोग, कैल्डियन नाम सुधार व मोबाइल ऑडिट का वैदिक मंच।",
    formTitle: "अपना जन्म विवरण दर्ज करें",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम लिखें",
    birthDate: "जन्म तिथि",
    gender: "लिंग",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य",
    mobileNumber: "मोबाइल नंबर (वैकल्पिक)",
    mobileNumberPlaceholder: "10 अंकों का मोबाइल नंबर",
    calculateBtn: "गणना करें",
    calculating: "गणना हो रही है...",
    validationError: "कृपया पूरा नाम एवं जन्म तिथि प्रदान करें",
    featureDisabled: "सुविधा अक्षम है",

    driverMulank: "मूलांक (Driver)",
    destinyBhagyank: "भाग्यांक (Destiny)",
    kuaNumber: "कुआ नंबर (Kua)",
    personalVibration: "व्यक्तिगत शुभ कंपन",
    personalYear: "व्यक्तिगत वर्ष (Personal Year)",

    tabLoshu: "वैदिक लो-शु ग्रिड व राजयोग",
    tabDasha: "अंक दशा समय सारणी",
    tabName: "कैल्डियन नाम विश्लेषण",
    tabNameCorrect: "नाम सुधार एवं शुभ वर्तनी",
    tabMobile: "मोबाइल नंबर ऑडिट",
    tabMobileCompare: "सिम तुलना सूट",
    tabBusiness: "व्यापार एवं ब्रांड ऑडिट",
    tabVehicleBank: "वाहन व बैंक खाता अंक",
    tabRemedies: "अनुपस्थित अंक उपाय",
    tabProfile: "मूलांक २०-क्षेत्र विवरण",

    loShuGridTitle: "वैदिक ३×३ लो-शु ग्रिड",
    loShuSequence: "३-१-९ / ६-७-५ / २-८-४",
    rajYogasTitle: "सक्रिय राजयोग (Special Raj Yogas)",
    activeStatus: "सक्रिय (Active)",
    inactiveStatus: "अनुपस्थित",
    planesTitle: "लो-शु समतल व स्तंभ (Planes of Will & Action)",
    statusComplete: "पूर्ण (100%)",
    statusPartial: "आंशिक",
    statusMissing: "अनुपस्थित (0%)",

    dashaTitle: "वैदिक अंक दशा समय सारणी (Vedic Dasha Hierarchy)",
    dashaSub: "महादशा (MD), अंतर्दशा (AD) एवं प्रत्यंतर्दशा (PD) समय अवधि",
    numberLabel: (num) => `अंक ${num}`,
    favorable: "अनुकूल",
    neutral: "तटस्थ",
    unfavorable: "प्रतिकूल",

    nameAnalysisTitle: "कैल्डियन नाम विश्लेषण (Chaldean Compound Name)",
    nameAnalysisSub: "नाम के प्रत्येक अक्षर का संख्यात्मक कंपन एवं संयुक्त अंक प्रभाव",
    compoundNumber: "संयुक्त अंक",
    singleDigitVibration: "एकल अंक कंपन",
    letterSoundsTitle: "वर्ण आधारित कैल्डियन ध्वनि कंपन (Letter Sound Profiles)",
    valueLabel: "मान:",
    soundElement: "तत्व:",
    recommendationLabel: "परामर्श:",

    mobileAuditTitle: "मोबाइल नंबर ऑडिट (Mobile Number Numerology)",
    mobileTotalSum: "कुल योग:",
    singleDigitSum: "एकल अंक:",
    auditVerdict: "ऑडिट निर्णय",
    conjunctionPairsTitle: "क्रमिक २-अंकों के जोड़े (60% / 40% प्रभुत्व नियम)",
    conjunctionFormula: "पहला अंक 60% • दूसरा अंक 40%",
    pairSuffix: "जोड़ा",
    lShapesTitle: "मोबाइल ग्रिड एल-आकार (Sepharial 3x3 L-Shapes)",

    missingNumbersTitle: "अनुपस्थित अंकों के वैदिक उपाय (Missing Numbers & Remedies)",
    missingPrefix: (digit) => `अनुपस्थित अंक ${digit}`,
    impactLabel: "प्रभाव:",
    remedyLabel: "उपाय:",
    rudrakshaLabel: "रुद्राक्ष:",
    crystalLabel: "क्रिस्टल:",

    profileTitle: (num) => `मूलांक ${num} का सम्पूर्ण २०-क्षेत्रीय शास्त्रीय विवरण (NEW NUMRO)`,
    profileSub: "प्रामाणिक शास्त्रीय हस्तलिखित नियमों का सम्पूर्ण संकलन।",
    rulingPlanetDeity: "स्वामी ग्रह एवं इष्टदेवता:",
    metalGemstone: "धातु एवं रत्न:",
    luckyDirection: "शुभ दिशा:",
    luckyColors: "शुभ रंग:",
    unluckyColors: "वर्जित रंग:",
    luckyDaysMonths: "शुभ दिन व माह:",
    beejMantraJap: "मूल वैदिक बीज मंत्र व जप संख्या:",
    japCountSuffix: (count) => `(${count.toLocaleString()} बार जप)`,
    grainsDaan: "दान सामग्री (Grains Daan):",
    healthTraits: "स्वास्थ्य सावधानियां एवं रोग प्रवृत्ति:",
    suitableProfession: "अनुकूल कार्यक्षेत्र व आजीविका:",

    recalculateBtn: "अन्य विवरण से पुनः गणना करें",
    consultAstrologerBtn: "विस्तृत मार्गदर्शन हेतु ज्योतिषी से संपर्क करें",
  },

  en: {
    badge: "Vedic, Chaldean & Lo Shu Numerology",
    title: "Complete Vedic Numerology Platform",
    subtitle:
      "Vedic platform for Mulank (Driver), Bhagyank (Destiny), 3x3 Lo Shu Grid, Raj Yogas, Chaldean Name Correction & Mobile Audit.",
    formTitle: "Enter Birth & Personal Details",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    birthDate: "Birth Date",
    gender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    mobileNumber: "Mobile Number (Optional)",
    mobileNumberPlaceholder: "10-digit mobile number",
    calculateBtn: "Calculate Numerology",
    calculating: "Calculating...",
    validationError: "Please provide full name and birth date",
    featureDisabled: "Feature Disabled",

    driverMulank: "Driver (Mulank)",
    destinyBhagyank: "Destiny (Bhagyank)",
    kuaNumber: "Kua Number",
    personalVibration: "Personal Vibration",
    personalYear: "Personal Year",

    tabLoshu: "Lo Shu Grid & Yogas",
    tabDasha: "Dasha Timeline",
    tabName: "Name Analysis",
    tabNameCorrect: "Name Correction",
    tabMobile: "Mobile Audit",
    tabMobileCompare: "SIM Compare",
    tabBusiness: "Business & Brand",
    tabVehicleBank: "Vehicle & Bank",
    tabRemedies: "Missing Remedies",
    tabProfile: "20-Field Profile",

    loShuGridTitle: "Vedic 3x3 Lo Shu Grid",
    loShuSequence: "3-1-9 / 6-7-5 / 2-8-4",
    rajYogasTitle: "Active Special Raj Yogas",
    activeStatus: "Active",
    inactiveStatus: "Inactive",
    planesTitle: "Lo Shu Planes & Columns (Planes of Will & Action)",
    statusComplete: "Complete (100%)",
    statusPartial: "Partial",
    statusMissing: "Missing (0%)",

    dashaTitle: "Vedic Numerology Dasha Hierarchy",
    dashaSub: "Mahadasha (MD), Antardasha (AD) and Pratyantardasha (PD) timeline",
    numberLabel: (num) => `Number ${num}`,
    favorable: "Favorable",
    neutral: "Neutral",
    unfavorable: "Unfavorable",

    nameAnalysisTitle: "Chaldean Compound Name Analysis",
    nameAnalysisSub: "Numerological vibration of each letter and compound number impact",
    compoundNumber: "Compound Number",
    singleDigitVibration: "Single Digit Vibration",
    letterSoundsTitle: "Letter Sound Profiles (Chaldean Acoustic Vibrations)",
    valueLabel: "Value:",
    soundElement: "Sound Element:",
    recommendationLabel: "Guidance:",

    mobileAuditTitle: "Mobile Number Numerology Audit",
    mobileTotalSum: "Total Sum:",
    singleDigitSum: "Single Digit:",
    auditVerdict: "Audit Verdict",
    conjunctionPairsTitle: "Consecutive 2-Digit Conjunction Pairs (60% / 40% Dominance Rule)",
    conjunctionFormula: "1st Digit 60% • 2nd Digit 40%",
    pairSuffix: "Pair",
    lShapesTitle: "Sepharial 3x3 L-Shapes (Grid Geometry)",

    missingNumbersTitle: "Missing Numbers & Vedic Remedies",
    missingPrefix: (digit) => `Missing ${digit}`,
    impactLabel: "Impact:",
    remedyLabel: "Remedy:",
    rudrakshaLabel: "Rudraksha:",
    crystalLabel: "Crystal:",

    profileTitle: (num) => `Comprehensive 20-Field Classical Profile for Mulank ${num} (NEW NUMRO)`,
    profileSub: "Full translation of client-provided authoritative handwritten numerology guidelines.",
    rulingPlanetDeity: "Ruling Planet & Deity:",
    metalGemstone: "Metal & Gemstone:",
    luckyDirection: "Lucky Direction:",
    luckyColors: "Lucky Colors:",
    unluckyColors: "Colors to Avoid:",
    luckyDaysMonths: "Lucky Days & Months:",
    beejMantraJap: "Vedic Beej Mantra & Chanting Count:",
    japCountSuffix: (count) => `(${count.toLocaleString()} chants)`,
    grainsDaan: "Grains Donation (Daan):",
    healthTraits: "Health Warnings & Vulnerabilities:",
    suitableProfession: "Prosperous Careers & Professions:",

    recalculateBtn: "Recalculate with different details",
    consultAstrologerBtn: "Consult an Astrologer for Detailed Numerology",
  },
};

export const NAME_CORRECTION_I18N = {
  bn: {
    title: "নাম সংশোধন ও বানান সুসংগতি (Chaldean Royal Spelling Harmonizer)",
    subtitle: "১৯৩ পৃষ্ঠার ক্যালডিয়ান মাস্টার বিশ্বকোষ অনুযায়ী ১৯, ২৩, ৩৭, ৪১, ৪৬, ৫৫ শুভ রাজকীয় কম্পাউন্ডে বানান রূপান্তর",
    mulank: "মূলাঙ্ক:",
    bhagyank: "ভাগ্যাঙ্ক:",
    nameLabel: "বিশ্লেষণ ও সংশোধনের নাম",
    targetLabel: "নির্দিষ্ট লক্ষ্য কম্পাউন্ড (ঐচ্ছিক)",
    autoBest: "স্বয়ংক্রিয় সেরা পছন্দ (Auto Best)",
    harmonizing: "গণনা হচ্ছে...",
    harmonizeBtn: "বানান সংশোধন করুন",
    currentStatus: "বর্তমান নামের স্থিতি",
    currentCompound: "বর্তমান কম্পাউন্ড",
    quality: "গুণমান",
    alertClean: "কোনো নেতিবাচক ধ্বনিখণ্ড (Negative Syllable) নেই — মূল নামটি স্বাভাবিক ও বিশুদ্ধ।",
    alternativesTitle: "প্রস্তাবিত রাজকীয় শুভ বানানসমূহ (Auspicious Alternatives)",
    topAlternatives: (count: number) => `${count}টি শীর্ষ বিকল্প প্রদর্শিত`,
    rootDigit: (d: number) => `মূল ${d}`,
    soundHarmony: "ধ্বনি সামঞ্জস্য:",
    auspiciousResult: "শুভ ফল:",
    copyBtn: "কপি করুন",
    copiedToast: (spelling: string) => `"${spelling}" ক্লিপবোর্ডে কপি করা হয়েছে!`,
    ritualTitle: "ক্লায়েন্ট রিসোর্স নির্দেশিকা — ৪৩ দিনের লাল কালির সক্রিয়করণ নিয়ম",
    emptyNameError: "অনুগ্রহ করে একটি নাম লিখুন",
    successToast: "নামের শুভ বানান বিকল্পসমূহ তৈরি করা হয়েছে!",
  },
  hi: {
    title: "नाम संशोधन एवं वर्तनी सामंजस्य (Chaldean Royal Spelling Harmonizer)",
    subtitle: "193 पृष्ठों के कैल्डियन ग्रंथ अनुसार 19, 23, 37, 41, 46, 55 शुभ राजसी संयुक्त अंकों में वर्तनी परिवर्तन",
    mulank: "मूलांक:",
    bhagyank: "भाग्यांक:",
    nameLabel: "विश्लेषण एवं संशोधन का नाम",
    targetLabel: "लक्षित संयुक्त अंक (वैकल्पिक)",
    autoBest: "स्वचालित सर्वोत्तम विकल्प (Auto Best)",
    harmonizing: "गणना हो रही है...",
    harmonizeBtn: "वर्तनी सुधारें",
    currentStatus: "वर्तमान नाम की स्थिति",
    currentCompound: "वर्तमान कंपाउंड",
    quality: "गुणवत्ता",
    alertClean: "कोई नकारात्मक ध्वनि खंड नहीं है — मूल नाम शुद्ध और संतुलित है।",
    alternativesTitle: "प्रस्तावित राजसी शुभ वर्तनियाँ (Auspicious Alternatives)",
    topAlternatives: (count: number) => `${count} शीर्ष विकल्प प्रदर्शित`,
    rootDigit: (d: number) => `मूल ${d}`,
    soundHarmony: "ध्वनि सामंजस्य:",
    auspiciousResult: "शुभ प्रभाव:",
    copyBtn: "कॉपी करें",
    copiedToast: (spelling: string) => `"${spelling}" क्लिपबोर्ड में कॉपी किया गया!`,
    ritualTitle: "मार्गदर्शिका — 43 दिवसीय लाल स्याही सक्रियण नियम",
    emptyNameError: "कृपया एक नाम दर्ज करें",
    successToast: "शुभ नाम वर्तनी विकल्प सफलतापूर्वक तैयार किए गए!",
  },
  en: {
    title: "Chaldean Name Correction & Royal Spelling Harmonizer",
    subtitle: "Harmonize spelling into royal auspicious compounds (19, 23, 37, 41, 46, 55) avoiding malefic syllables.",
    mulank: "Mulank:",
    bhagyank: "Bhagyank:",
    nameLabel: "Name for Correction",
    targetLabel: "Target Compound (Optional)",
    autoBest: "Auto Best Selection",
    harmonizing: "Harmonizing...",
    harmonizeBtn: "Harmonize Spelling",
    currentStatus: "Current Name Status",
    currentCompound: "Current Compound",
    quality: "Quality",
    alertClean: "No negative syllables detected — original name is clean and balanced.",
    alternativesTitle: "Auspicious Spelling Alternatives",
    topAlternatives: (count: number) => `${count} top alternatives displayed`,
    rootDigit: (d: number) => `Root ${d}`,
    soundHarmony: "Sound Harmony:",
    auspiciousResult: "Auspicious Effect:",
    copyBtn: "Copy",
    copiedToast: (spelling: string) => `"${spelling}" copied to clipboard!`,
    ritualTitle: "Authoritative 43-Day Red Ink Activation Ritual",
    emptyNameError: "Please enter a name",
    successToast: "Name spelling alternatives harmonized successfully!",
  },
};

export const MOBILE_COMPARE_I18N = {
  bn: {
    title: "মোবাইল সিম তুলনা স্যুট (Mobile SIM Comparison Suite)",
    subtitle: "কিং সংখ্যা ও ৬০%/৪০% প্রভাব সূত্রে সিমের সঠিক মূল্যায়ন",
    kingNumber: "কিং সংখ্যা (মূল):",
    bhagyank: "ভাগ্যাঙ্ক:",
    addAnother: "আরও একটি নম্বর যোগ করুন",
    comparing: "তুলনা হচ্ছে...",
    compareBtn: "সিম তুলনা সম্পন্ন করুন",
    winnerTitle: "চূড়ান্ত বিজয়ী নম্বর (Top Recommended SIM)",
    scoreLabel: (score: number) => `স্কোর: ${score}/১০০`,
    compatibilityScore: "সামঞ্জস্য স্কোর",
    positivePairs: (count: number) => `শুভ জোড়া (${count}):`,
    negativePairs: (count: number) => `প্রতিকূল জোড়া (${count}):`,
    noneText: "নেই",
    guidanceTitle: "ক্লায়েন্ট নির্দেশিকা — ৬০%/৪০% জোড়া আধিপত্য নীতি",
    totalSum: "যোগফল:",
    maxLimit: "সর্বোচ্চ ৬টি সিম নম্বর একসাথে তুলনা করা সম্ভব",
    minLimit: "তুলনার জন্য অন্তত ২টি নম্বর আবশ্যক",
    validMobileError: "অনুগ্রহ করে অন্তত ২টি সঠিক ১০-সংখ্যার মোবাইল নম্বর দিন",
    successToast: "মোবাইল সিম নম্বরের ৬০%/৪০% তুলনা সফলভাবে সম্পন্ন হয়েছে!",
    sectorBusiness: "ব্যবসা ও বাণিজ্য (Business/Finance)",
    sectorIt: "আইটি ও প্রযুক্তি (IT/Tech/Software)",
    sectorMedicine: "চিকিৎসা ও স্বাস্থ্য (Health/Medicine)",
    sectorLuxury: "মিডিয়া ও ফ্যাশন (Luxury/Fashion/Media)",
    sectorRealEstate: "রিয়েল এস্টেট (Real Estate/Law)",
    sectorEducation: "শিক্ষা ও পরামর্শ (Education/Consulting)",
  },
  hi: {
    title: "मोबाइल सिम तुलना सूट (Mobile SIM Comparison Suite)",
    subtitle: "किंग संख्या व 60%/40% प्रभाव नियम अनुसार सिम का सटीक मूल्यांकन",
    kingNumber: "किंग संख्या (मूल):",
    bhagyank: "भाग्यांक:",
    addAnother: "एक और नंबर जोड़ें",
    comparing: "तुलना हो रही है...",
    compareBtn: "सिम तुलना करें",
    winnerTitle: "सर्वोत्तम अनुशंसित सिम (Winner Recommended SIM)",
    scoreLabel: (score: number) => `स्कोर: ${score}/100`,
    compatibilityScore: "सामंजस्य स्कोर",
    positivePairs: (count: number) => `शुभ जोड़े (${count}):`,
    negativePairs: (count: number) => `प्रतिकूल जोड़े (${count}):`,
    noneText: "कोई नहीं",
    guidanceTitle: "मार्गदर्शिका — 60%/40% युगल प्रभाव नियम",
    totalSum: "योग:",
    maxLimit: "अधिकतम 6 सिम नंबरों की तुलना की जा सकती है",
    minLimit: "तुलना के लिए कम से कम 2 नंबर आवश्यक हैं",
    validMobileError: "कृपया कम से कम 2 मान्य 10-अंकीय मोबाइल नंबर दर्ज करें",
    successToast: "मोबाइल सिम तुलना सफलतापूर्वक पूरी हुई!",
    sectorBusiness: "व्यापार एवं वित्त (Business/Finance)",
    sectorIt: "आईटी एवं तकनीक (IT/Tech/Software)",
    sectorMedicine: "स्वास्थ्य एवं चिकित्सा (Health/Medicine)",
    sectorLuxury: "मीडिया एवं फैशन (Luxury/Fashion/Media)",
    sectorRealEstate: "रियल एस्टेट एवं कानून (Real Estate/Law)",
    sectorEducation: "शिक्षा एवं परामर्श (Education/Consulting)",
  },
  en: {
    title: "Mobile SIM Comparison Suite",
    subtitle: "Compare 2-6 SIM numbers using King number harmony and the 60%/40% pair dominance law.",
    kingNumber: "King Number:",
    bhagyank: "Bhagyank:",
    addAnother: "Add Another SIM",
    comparing: "Comparing...",
    compareBtn: "Compare SIMs",
    winnerTitle: "Winner Recommended SIM",
    scoreLabel: (score: number) => `Score: ${score}/100`,
    compatibilityScore: "Compatibility Score",
    positivePairs: (count: number) => `Favorable Pairs (${count}):`,
    negativePairs: (count: number) => `Malefic Pairs (${count}):`,
    noneText: "None",
    guidanceTitle: "Authoritative 60%/40% Pair Dominance Law",
    totalSum: "Sum:",
    maxLimit: "Maximum 6 numbers can be compared",
    minLimit: "At least 2 numbers required for comparison",
    validMobileError: "Please provide at least 2 valid 10-digit mobile numbers",
    successToast: "Mobile SIM numbers compared successfully!",
    sectorBusiness: "Business & Finance",
    sectorIt: "IT, Tech & Software",
    sectorMedicine: "Health & Medicine",
    sectorLuxury: "Luxury, Fashion & Media",
    sectorRealEstate: "Real Estate & Law",
    sectorEducation: "Education & Consulting",
  },
};

export const BUSINESS_NUMEROLOGY_I18N = {
  bn: {
    title: "ব্যবসা, ব্র্যান্ড ও কোম্পানি নাম মূল্যায়ন (Business & Brand Numerology)",
    subtitle: "ক্যালডিয়ান রয়্যাল কম্পাউন্ড, শিল্পের সাথে সামঞ্জস্য এবং প্রতিষ্ঠাতার জন্মশক্তির সাথে মিত্রতা অডিট",
    founderMulank: "প্রতিষ্ঠাতার মূলাঙ্ক:",
    founderBhagyank: "ভাগ্যাঙ্ক:",
    brandNameLabel: "কোম্পানি বা ব্র্যান্ডের নাম",
    industryLabel: "শিল্প খাত (Industry Sector)",
    evaluating: "मूल্যায়ন হচ্ছে...",
    auditBtn: "ব্র্যান্ড অডিট করুন",
    chaldeanCompound: "ক্যালডিয়ান কম্পাউন্ড",
    rootSingle: (d: number) => `(একক মূল: ${d})`,
    industryFit: "শিল্প খাতের উপযোগিতা",
    founderHarmony: "প্রতিষ্ঠাতার জন্ম সামঞ্জস্য",
    founderVerifyText: (m: number, b: number) => `প্রতিষ্ঠাতার মূলাঙ্ক ${m} এবং ভাগ্যাঙ্ক ${b}-এর সাথে ফ্রেন্ডশিপ ম্যাট্রিক্স দ্বারা যাচাইকৃত।`,
    favorableNumbersTitle: "এই শিল্পের জন্য সর্বাধিক শুভ রয়্যাল কম্পাউন্ড সংখ্যা",
    recommendationsTitle: "বাস্তবায়নযোগ্য ব্যবসায়িক পরামর্শ (Actionable Recommendations)",
    emptyBrandError: "অনুগ্রহ করে কোম্পানির নাম প্রদান করুন",
    successToast: "ব্যবসা ও ব্র্যান্ড নিউমারোলজি মূল্যায়ন সম্পন্ন হয়েছে!",
    sectorTech: "প্রযুক্তি ও সফটওয়্যার (Technology / AI / SaaS)",
    sectorFinance: "ব্যাংকিং, ফিনান্স ও ট্রেডিং (Finance / Wealth)",
    sectorLuxury: "লাক্সারি, ফ্যাশন ও মিডিয়া (Luxury / Fashion / Media)",
    sectorRealEstate: "রিয়েল এস্টেট ও নির্মাণ (Real Estate / Construction)",
    sectorHealth: "চিকিৎসা ও ফার্মাসিউটিক্যাল (Healthcare / Pharma)",
    sectorFood: "খাদ্যদ্রব্য ও রেস্তোরাঁ (Food / Restaurant / FMCG)",
    sectorEducation: "শিক্ষা, একাডেমি ও আইন (Education / Legal)",
  },
  hi: {
    title: "व्यापार, ब्रांड एवं कंपनी नाम मूल्यांकन (Business & Brand Numerology)",
    subtitle: "कैल्डियन रॉयल कंपाउंड, उद्योग अनुकूलता एवं संस्थापक की ऊर्जा के साथ सामंजस्य ऑडिट",
    founderMulank: "संस्थापक मूलांक:",
    founderBhagyank: "भाग्यांक:",
    brandNameLabel: "कंपनी या ब्रांड का नाम",
    industryLabel: "उद्योग क्षेत्र (Industry Sector)",
    evaluating: "मूल्यांकन हो रहा है...",
    auditBtn: "ब्रांड ऑडिट करें",
    chaldeanCompound: "कैल्डियन कंपाउंड",
    rootSingle: (d: number) => `(एकल मूल: ${d})`,
    industryFit: "उद्योग उपयुक्तता",
    founderHarmony: "संस्थापक जन्म सामंजस्य",
    founderVerifyText: (m: number, b: number) => `संस्थापक के मूलांक ${m} और भाग्यांक ${b} के साथ मित्रता मैट्रिक्स द्वारा सत्यापित।`,
    favorableNumbersTitle: "इस उद्योग के लिए सर्वाधिक शुभ रॉयल कंपाउंड अंक",
    recommendationsTitle: "कार्यान्वयन योग्य व्यापारिक सलाह (Actionable Recommendations)",
    emptyBrandError: "कृपया कंपनी या ब्रांड का नाम दर्ज करें",
    successToast: "व्यापार व ब्रांड अंकज्योतिष मूल्यांकन सफलतापूर्वक संपन्न हुआ!",
    sectorTech: "प्रौद्योगिकी एवं सॉफ्टवेयर (Technology / AI / SaaS)",
    sectorFinance: "बैंकिंग, वित्त एवं ट्रेडिंग (Finance / Wealth)",
    sectorLuxury: "लक्ज़री, फैशन एवं मीडिया (Luxury / Fashion / Media)",
    sectorRealEstate: "रियल एस्टेट एवं निर्माण (Real Estate / Construction)",
    sectorHealth: "चिकित्सा एवं फार्मा (Healthcare / Pharma)",
    sectorFood: "खाद्य उत्पाद एवं रेस्तरां (Food / Restaurant / FMCG)",
    sectorEducation: "शिक्षा, अकादमी एवं कानून (Education / Legal)",
  },
  en: {
    title: "Business, Brand & Company Name Numerology",
    subtitle: "Evaluate brand name vibrations, industry suitability, and founder karmic alignment.",
    founderMulank: "Founder Mulank:",
    founderBhagyank: "Bhagyank:",
    brandNameLabel: "Company or Brand Name",
    industryLabel: "Industry Sector",
    evaluating: "Evaluating...",
    auditBtn: "Audit Brand",
    chaldeanCompound: "Chaldean Compound",
    rootSingle: (d: number) => `(Single Root: ${d})`,
    industryFit: "Industry Fit",
    founderHarmony: "Founder Alignment",
    founderVerifyText: (m: number, b: number) => `Verified with founder's Mulank ${m} and Bhagyank ${b} friendship matrix.`,
    favorableNumbersTitle: "Favorable Business Compound Numbers for this Sector",
    recommendationsTitle: "Actionable Business Recommendations",
    emptyBrandError: "Please enter company/brand name",
    successToast: "Business Numerology evaluated successfully!",
    sectorTech: "Technology / AI / SaaS",
    sectorFinance: "Banking, Finance & Trading",
    sectorLuxury: "Luxury, Fashion & Media",
    sectorRealEstate: "Real Estate & Construction",
    sectorHealth: "Healthcare & Pharma",
    sectorFood: "Food, Restaurant & FMCG",
    sectorEducation: "Education, Academy & Legal",
  },
};

export const VEHICLE_BANK_I18N = {
  bn: {
    title: "গাড়ির নম্বর প্লেট ও ব্যাংক অ্যাকাউন্ট নিউমারোলজি অডিট",
    subtitle: "গাড়ির ক্ষেত্রে পথদুর্ঘটনা ও জরিমানা ঝুঁকি এবং ব্যাংকের ক্ষেত্রে অর্থ ধরে রাখার ক্ষমতা পরীক্ষা ও প্রতিকার",
    mulank: "মূলাঙ্ক:",
    bhagyank: "ভাগ্যাঙ্ক:",
    vehicleTab: "গাড়ির নম্বর (Vehicle)",
    bankTab: "ব্যাংক অ্যাকাউন্ট (Bank)",
    vehicleInputLabel: "গাড়ির সম্পূর্ণ নম্বর প্লেট (অক্ষর ও সংখ্যা সহ)",
    bankInputLabel: "সম্পূর্ণ ব্যাংক অ্যাকাউন্ট নম্বর",
    auditing: "অডিট হচ্ছে...",
    auditBtn: "অডিট সম্পন্ন করুন",
    extractedTotal: "নিষ্কাশিত মান ও টোটাল",
    compoundLabel: (c: number) => `(কম্পাউন্ড: ${c})`,
    vehicleRatingTitle: "নিরাপত্তা ও দুর্ঘটনা রেটিং",
    bankRatingTitle: "আর্থিক প্রবাহ ও সঞ্চয় রেটিং",
    compoundQuality: "কম্পাউন্ড গুণমান:",
    riskAlertTitle: "সতর্কতামূলক বার্তা: ",
    remedyTitle: "বৈদিক বাস্তু ও নিউমারোলজি নিশ্চিত প্রতিষেধক (Auspicious Remedy)",
    emptyInputError: "অনুগ্রহ করে গাড়ির নম্বর অথবা ব্যাংক অ্যাকাউন্ট নম্বর দিন",
    successToast: (type: "vehicle" | "bank") => `${type === "vehicle" ? "গাড়ির নম্বর" : "ব্যাংক অ্যাকাউন্ট"} অডিট সফলভাবে সম্পন্ন হয়েছে!`,
  },
  hi: {
    title: "वाहन नंबर प्लेट एवं बैंक खाता अंकज्योतिष ऑडिट",
    subtitle: "वाहन के लिए दुर्घटना जोखिम और बैंक खाते के लिए धन संचय क्षमता की जांच व उपाय",
    mulank: "मूलांक:",
    bhagyank: "भाग्यांक:",
    vehicleTab: "वाहन नंबर (Vehicle)",
    bankTab: "बैंक खाता (Bank)",
    vehicleInputLabel: "वाहन की पूरी नंबर प्लेट (अक्षर व अंक सहित)",
    bankInputLabel: "पूरा बैंक खाता नंबर",
    auditing: "ऑडिट हो रहा है...",
    auditBtn: "ऑडिट करें",
    extractedTotal: "निष्कर्षित मान एवं योग",
    compoundLabel: (c: number) => `(कंपाउंड: ${c})`,
    vehicleRatingTitle: "सुरक्षा एवं दुर्घटना रेटिंग",
    bankRatingTitle: "वित्तीय प्रवाह एवं बचत रेटिंग",
    compoundQuality: "कंपाउंड गुणवत्ता:",
    riskAlertTitle: "चेतावनी संदेश: ",
    remedyTitle: "वैदिक वास्तु एवं अंकज्योतिष सिद्ध उपाय (Auspicious Remedy)",
    emptyInputError: "कृपया वाहन नंबर अथवा बैंक खाता संख्या दर्ज करें",
    successToast: (type: "vehicle" | "bank") => `${type === "vehicle" ? "वाहन नंबर" : "बैंक खाता"} ऑडिट सफलतापूर्वक पूरा हुआ!`,
  },
  en: {
    title: "Vehicle Number Plate & Bank Account Numerology Audit",
    subtitle: "Check vehicle accident vulnerability and bank account wealth retention with precise remedies.",
    mulank: "Mulank:",
    bhagyank: "Bhagyank:",
    vehicleTab: "Vehicle Plate",
    bankTab: "Bank Account",
    vehicleInputLabel: "Complete Vehicle Plate (Letters & Digits)",
    bankInputLabel: "Complete Bank Account Number",
    auditing: "Auditing...",
    auditBtn: "Run Audit",
    extractedTotal: "Extracted Value & Sum",
    compoundLabel: (c: number) => `(Compound: ${c})`,
    vehicleRatingTitle: "Safety & Accident Rating",
    bankRatingTitle: "Wealth Flow & Retention Rating",
    compoundQuality: "Compound Quality:",
    riskAlertTitle: "Warning Alert: ",
    remedyTitle: "Vedic Numerology & Vastu Verified Remedy",
    emptyInputError: "Please enter a vehicle plate or bank account number",
    successToast: (type: "vehicle" | "bank") => `${type === "vehicle" ? "Vehicle plate" : "Bank account"} audit completed successfully!`,
  },
};

