/**
 * Complete Multilingual Localization (bn, hi, en) for Kundli Matching (36 Gun Milan / Ashtakoot).
 * Strictly conforms to client resource specifications, classical Sanskrit/Vedic texts, and UI standards.
 */

import type { AstrologyLanguage } from "@/types";
import {
  toLocalizedDigits,
  translatePlanetName,
  translateRashiName,
  translateNakshatraName,
  translateTithi,
  translateKaran,
  translateYoga,
} from "./kundli-translations";

export interface KundliMatchingTranslations {
  pageTitle: string;
  pageSubtitle: string;
  step1Title: string;
  step2Title: string;
  nextStepButton: string;
  backButton: string;
  matchButton: string;
  recalculateButton: string;
  downloadPdfButton: string;

  groomTitle: string;
  brideTitle: string;
  groomLabel: string;
  brideLabel: string;
  ringsBanner: string;

  basicDetailsTitle: string;
  name: string;
  birthDateTime: string;
  birthPlace: string;
  janamRashi: string;
  rashiLord: string;
  janamNakshatra: string;
  nakshatraLord: string;
  pada: string;

  manglikBannerPrefixBoy: string;
  manglikBannerPrefixGirl: string;
  isManglik: string;
  isNotManglik: string;

  tabs: {
    dosha: string;
    dashakoot: string;
    cancellations: string;
    papasamya: string;
    avakahada: string;
    forecast: string;
    planetDetails: string;
    lagnaCharts: string;
    personality: string;
  };

  metricCards: {
    ashtakootTitle: string;
    rajjooDoshaTitle: string;
    vedhaDoshaTitle: string;
    manglikMatchTitle: string;
    yes: string;
    no: string;
    outOf: string;
  };

  pointsTable: {
    title: string;
    subtitle: string;
    colAttribute: string;
    colMale: string;
    colFemale: string;
    colOutOf: string;
    colReceived: string;
    colAreaOfLife: string;
    totalLabel: string;
    overallCompatibility: string;
  };

  attributes: Record<string, { name: string; areaOfLife: string; description: string }>;
  varnaValues: Record<string, string>;
  vashyaValues: Record<string, string>;
  ganaValues: Record<string, string>;
  nadiValues: Record<string, string>;
  yoniValues: Record<string, string>;

  form: {
    fullNameLabel: string;
    fullNamePlaceholder: string;
    dobLabel: string;
    dayPlaceholder: string;
    monthPlaceholder: string;
    yearPlaceholder: string;
    tobLabel: string;
    hourPlaceholder: string;
    minutePlaceholder: string;
    secondPlaceholder: string;
    placeLabel: string;
    placePlaceholder: string;
    advancedSettings: string;
    hideAdvancedSettings: string;
    latitude: string;
    longitude: string;
    timezone: string;
    ayanamsa: string;
    houseSystem: string;
    validationName: string;
    validationDob: string;
    validationPlace: string;
  };

  charts: {
    groomChartTitle: string;
    brideChartTitle: string;
    chartStyleNorth: string;
    chartStyleEast: string;
    chartStyleSouth: string;
  };

  planetTable: {
    planet: string;
    longitude: string;
    sign: string;
    nakshatra: string;
    nakshatraLord: string;
    pada: string;
  };

  verdict: {
    favorable: string;
    unfavorable: string;
  };

  // Extra UI Keys
  timeOptionalSuffix: string;
  calculatingBtn: string;
  featureUnavailable: string;
  toastDisabled: string;
  toastSuccessCoins: (coins: number) => string;
  toastSuccess: string;
  toastErrorCalc: string;
  groomFormHeading: string;
  brideFormHeading: string;
  groomManglikBadge: string;
  groomNonManglikBadge: string;
  brideManglikBadge: string;
  brideNonManglikBadge: string;
  manglikMatchYes: string;
  manglikMatchNo: string;
  manglikDescFavorable: string;
  manglikDescCaution: string;
  auspiciousMatch: string;
  inauspiciousMatch: string;
  doshaFree: string;
  doshaPresent: string;
  cancelledBhanga: string;
  compatibleBadge: string;
  remedyNeededBadge: string;
  verdictAuspiciousTitle: string;
  verdictCautionTitle: string;
  forecastBannerTitle: string;
  forecastBannerSubtitle: (years: string, harmony: string, progeny: string) => string;
  viewFullForecastBtn: string;
  dashakootTitle: string;
  dashakootSummary: (score: string, poruthamCount: string) => string;
  dashakootFavorableBadge: string;
  dashakootModerateBadge: string;
  dashakootTableTitle: string;
  dashakootTableSubtitle: string;
  significanceTh: string;
  attributeTh: string;
  cancellationsTitle: string;
  cancellationsSubtitle: string;
  shastraCitationLabel: string;
  severityLabel: string;
  remedyLabel: string;
  relativesReliefLabel: string;
  manglikAspectsTitle: string;
  papasamyaTitle: string;
  papasamyaSubtitle: (groomPts: string, bridePts: string, diff: string) => string;
  fromLagna: string;
  fromMoon: string;
  fromVenus: string;
  avakahadaTableTitle: string;
  avakahadaTableSubtitle: string;
  personalityTitle: string;
  traitsPositiveTitle: string;
  traitsSensitiveTitle: string;
  forecastAuspiciousTitle: string;
  jupiterTransitSubtitle: string;
  idealMarriageAgeBoy: string;
  idealMarriageAgeGirl: string;
  forecastHarmonyTitle: string;
  forecastProgenyTitle: string;
  forecastTemperamentTitle: string;
  forecastWealthTitle: string;
  forecastMutualTitle: string;
  dashaComparisonTitle: string;
  dashaComparisonSubtitle: string;
  dashaSandhiPresentBadge: string;
  dashaSandhiAbsentBadge: string;
  currentDashaTitle: string;
  mahadashaLabel: string;
  antardashaLabel: string;
  vedicRemediesTitle: string;
  vedicRemediesNotice: string;
  talkAstrologerBtn: string;
  planetsTableTitle: string;
  planetsTableSubtitle: string;
  padaLabel: string;
  chartTypeLabel: string;
  chartTypeD1: string;
  chartTypeD9: string;
  chartTypeChalit: string;
  chartTypeMoon: string;
  chartStyleLabel: string;
  chartD1Desc: string;
  chartD9Desc: string;
  chartChalitDesc: string;
  chartMoonDesc: string;
  groomChartSub: string;
  brideChartSub: string;
  floatingTotal: string;
  floatingFavorable: string;
  floatingCaution: string;
  consultAstrologerBtn: string;
}

export const KUNDLI_MATCHING_STRINGS: Record<AstrologyLanguage, KundliMatchingTranslations> = {
  bn: {
    pageTitle: "কুন্ডলী মিলন (৩৬ গুণ বিচার)",
    pageSubtitle:
      "কুন্ডলী মিলন বা যোটক বিচার হলো একটি প্রাচীন বৈদিক জ্যোতিষ বিজ্ঞান, যা বর ও কনের গ্রহাবস্থান ও অষ্টকূট (৩৬ গুণ) বিচার করে দাম্পত্য জীবনের সুখ, স্বাস্থ্য, মানসিক ঐক্য ও বংশবৃদ্ধির সামঞ্জস্য নির্ধারণ করে।",
    step1Title: "বরের বিবরণ লিখুন ♂",
    step2Title: "কনের বিবরণ লিখুন ♀",
    nextStepButton: "পরবর্তী: কনের বিবরণ ♀",
    backButton: "পেছনে যান",
    matchButton: "কুন্ডলী মিলন দেখুন ➔",
    recalculateButton: "নতুন মিলন গণনা",
    downloadPdfButton: "রিপোর্ট প্রিন্ট / সংরক্ষণ",

    groomTitle: "বরের বিবরণ (Male Details)",
    brideTitle: "কনের বিবরণ (Female Details)",
    groomLabel: "বর",
    brideLabel: "কনে",
    ringsBanner: "বিবাহের যোটক বিচার",

    basicDetailsTitle: "মৌলিক জন্ম বিবরণী",
    name: "নাম",
    birthDateTime: "জন্ম তারিখ ও সময়",
    birthPlace: "জন্মস্থান",
    janamRashi: "জন্ম রাশি",
    rashiLord: "রাশি অধিপতি",
    janamNakshatra: "জন্ম নক্ষত্র",
    nakshatraLord: "নক্ষত্র অধিপতি",
    pada: "পদ",

    manglikBannerPrefixBoy: "বর",
    manglikBannerPrefixGirl: "কনে",
    isManglik: "মাঙ্গলিক",
    isNotManglik: "মাঙ্গলিক নন",

    tabs: {
      dosha: "অষ্টকূট (৩৬ গুণ)",
      dashakoot: "দশকূট (১০ পরুথাম)",
      cancellations: "দোষভঙ্গ ও মহাদোষ",
      papasamya: "পাপসাম্য সামঞ্জস্য",
      avakahada: "অবকহড়া ও পঞ্চাঙ্গ",
      forecast: "দাম্পত্য ভবিষ্যৎ",
      planetDetails: "গ্রহের অবস্থান",
      lagnaCharts: "কুন্ডলী চক্র (D1/D9)",
      personality: "স্বভাব ও ব্যক্তিত্ব",
    },

    metricCards: {
      ashtakootTitle: "অষ্টকূট গুণ",
      rajjooDoshaTitle: "রজ্জু দোষ",
      vedhaDoshaTitle: "বেধ দোষ",
      manglikMatchTitle: "মাঙ্গলিক সামঞ্জস্য",
      yes: "হ্যাঁ",
      no: "না",
      outOf: "এর মধ্যে",
    },

    pointsTable: {
      title: "অষ্টকূট গুণ মিলন পয়েন্ট",
      subtitle: "৩৬ গুণের সম্পূর্ণ বৈদিক বিশ্লেষণ ও ফলাফল",
      colAttribute: "বৈশিষ্ট্য (Attribute)",
      colMale: "বর (Male)",
      colFemale: "কনে (Female)",
      colOutOf: "মোট (Out of)",
      colReceived: "প্রাপ্ত (Received)",
      colAreaOfLife: "জীবনের ক্ষেত্র (Area Of Life)",
      totalLabel: "সর্বমোট পয়েন্ট",
      overallCompatibility: "সার্বিক দাম্পত্য সামঞ্জস্য",
    },

    attributes: {
      Varna: {
        name: "বর্ণ (Varna)",
        areaOfLife: "স্বাভাবিক পরিশীলন / কর্মপ্রকৃতি",
        description: "অহংকার সামঞ্জস্য, কর্মপ্রবণতা ও আত্মিক বিকাশের মূল্যায়ন করে।",
      },
      Vashya: {
        name: "বশ্য (Vashya)",
        areaOfLife: "পারস্পরিক আকর্ষণ ও আত্মনিবেদন",
        description: "দম্পতির মধ্যকার মানসিক আকর্ষণ, প্রেম ও পারস্পরিক নির্ভরতা নির্দেশ করে।",
      },
      Tara: {
        name: "তারা (Tara)",
        areaOfLife: "সুখ - সমৃদ্ধি - স্বাস্থ্য ও ভাগ্য",
        description: "উভয়ের স্বাস্থ্য, শারীরিক সুস্থতা, ভাগ্য ও দীর্ঘায়ু নির্ধারণ করে।",
      },
      Yoni: {
        name: "যোনি (Yoni)",
        areaOfLife: "জৈবিক ও শারীরিক ঘনিষ্ঠতা",
        description: "শারীরিক আকর্ষণ, ইন্দ্রিয় সুখ ও পারস্পরিক অন্তরঙ্গতার সামঞ্জস্য নির্দেশ করে।",
      },
      Maitri: {
        name: "গ্রহ মৈত্রী (Maitri)",
        areaOfLife: "বন্ধুত্ব ও মানসিক ঐক্য",
        description: "মানসিক দৃষ্টিভঙ্গি, বুদ্ধিবৃত্তিক সামঞ্জস্য ও হৃদ্যতাপূর্ণ বন্ধুত্বপূর্ণ সম্পর্ক।",
      },
      Gan: {
        name: "গণ (Gan)",
        areaOfLife: "স্বভাব ও মানসিক গঠন",
        description: "আচার-আচরণ, চারিত্রিক বৈশিষ্ট্য ও পারিবারিক সমন্বয় মূল্যায়ন করে।",
      },
      Bhakut: {
        name: "ভকূট (Bhakut)",
        areaOfLife: "গঠনমূলক সামর্থ্য / সমাজ ও পরিবার",
        description: "অর্থনৈতিক সমৃদ্ধি, বংশমর্যাদা ও ভবিষ্যৎ পারিবারিক বৃদ্ধির দিক নির্দেশ করে।",
      },
      Nadi: {
        name: "নাড়ী (Nadi)",
        areaOfLife: "বংশবৃদ্ধি / জিনগত সুস্থতা",
        description: "বংশবৃদ্ধি, সন্তানের স্বাস্থ্য, স্নায়বিক গঠন ও শারীরিক দীর্ঘায়ু বিচার করে।",
      },
    },

    varnaValues: {
      Brahmin: "ব্রাহ্মণ",
      Kshatriya: "ক্ষত্রিয়",
      Vaishya: "বৈশ্য",
      Shudra: "শূদ্র",
    },

    vashyaValues: {
      Chatushpada: "চতুস্পদ (পশু)",
      Manava: "মানব (দ্বিপদ)",
      Jalachara: "জলচর",
      Vanachara: "বনচর (সিংহ/হিংস্র)",
      Keeta: "কীট (বৃশ্চিক)",
    },

    ganaValues: {
      Deva: "দেব গণ",
      Manushya: "মনুষ্য গণ",
      Rakshasa: "রাক্ষস গণ",
    },

    nadiValues: {
      Adi: "আদি নাড়ী",
      Madhya: "মধ্য নাড়ী",
      Antya: "অন্ত্য নাড়ী",
    },

    yoniValues: {
      "Ashwa (Horse)": "অশ্ব (ঘোড়া)",
      "Gaja (Elephant)": "গজ (হাতি)",
      "Mesha (Sheep)": "মেষ (ভেড়া)",
      "Sarpa (Serpent)": "সর্প (সাপ)",
      "Shwana (Dog)": "শ্বান (কুকুর)",
      "Marjara (Cat)": "মার্জার (বিড়াল)",
      "Mushaka (Rat)": "মূষিক (ইঁদুর)",
      "Gau (Cow)": "গো (গরু)",
      "Mahisha (Buffalo)": "মহিষ",
      "Vyaghra (Tiger)": "ব্যাঘ্র (বাঘ)",
      "Mriga (Deer)": "মৃগ (হরিণ)",
      "Vanara (Monkey)": "বানর",
      "Nakula (Mongoose)": "নকুল (বেজি)",
      "Simha (Lion)": "সিংহ",
    },

    form: {
      fullNameLabel: "পূর্ণ নাম",
      fullNamePlaceholder: "পূর্ণ নাম লিখুন",
      dobLabel: "জন্ম তারিখ (দিন-মাস-বছর)",
      dayPlaceholder: "দিন (DD)",
      monthPlaceholder: "মাস (MM)",
      yearPlaceholder: "বছর (YYYY)",
      tobLabel: "জন্ম সময় (ঘন্টা:মিনিট:সেকেন্ড AM/PM)",
      hourPlaceholder: "ঘন্টা (HH)",
      minutePlaceholder: "মিনিট (MM)",
      secondPlaceholder: "সেকেন্ড (SS)",
      placeLabel: "জন্মস্থান (শহর / রাজ্য / দেশ)",
      placePlaceholder: "শহর বা স্থানের নাম লিখুন",
      advancedSettings: "উন্নত গণনা সেটিংস (অক্ষাংশ, দ্রাঘিমাংশ, অয়নাংশ)",
      hideAdvancedSettings: "উন্নত সেটিংস লুকান",
      latitude: "অক্ষাংশ (Lat)",
      longitude: "দ্রাঘিমাংশ (Lon)",
      timezone: "টাইমজোন (Timezone UTC)",
      ayanamsa: "অয়নাংশ (Ayanamsa)",
      houseSystem: "ভাব পদ্ধতি (House System)",
      validationName: "দয়া করে পূর্ণ নাম লিখুন।",
      validationDob: "সঠিক জন্ম তারিখ (দিন, মাস, বছর) প্রদান করুন।",
      validationPlace: "দয়া করে একটি জন্মস্থান নির্বাচন করুন।",
    },

    charts: {
      groomChartTitle: "বরের লগ্ন কুন্ডলী (D1 Lagna Chart)",
      brideChartTitle: "কনের লগ্ন কুন্ডলী (D1 Lagna Chart)",
      chartStyleNorth: "উত্তর ভারতীয় (North)",
      chartStyleEast: "পূর্ব ভারতীয় (বাংলা)",
      chartStyleSouth: "দক্ষিণ ভারতীয় (South)",
    },

    planetTable: {
      planet: "গ্রহ",
      longitude: "দ্রাঘিমাংশ (ডিগ্রি)",
      sign: "রাশি",
      nakshatra: "নক্ষত্র",
      nakshatraLord: "নক্ষত্র পতি",
      pada: "পদ",
    },

    verdict: {
      favorable:
        "বিবাহের জন্য সমস্ত কারণ অনুকূল। উভয়ের মধ্যে চমৎকার বোঝাপড়া ও সুখময় দাম্পত্য জীবন প্রত্যাশিত। শুভ ফললাভের জন্য বিজ্ঞ জ্যোতিষীর পরামর্শ গ্রহণ করা যেতে পারে।",
      unfavorable:
        "মিলন স্কোর শুভ সীমার নিচে অথবা রাশিকূট বা নাড়ী সম্পর্কিত বৈষম্য রয়েছে। বিবাহ স্থির করার পূর্বে বিজ্ঞ জ্যোতিষীর মাধ্যমে প্রতিকার বিধান একান্ত আবশ্যক।",
    },

    // Extra UI strings
    timeOptionalSuffix: "ঐচ্ছিক — না দিলে ১২:০০ PM",
    calculatingBtn: "গণনা করা হচ্ছে...",
    featureUnavailable: "কুন্ডলী মিলন বৈশিষ্ট্যটি বর্তমানে সাময়িকভাবে নিষ্ক্রিয় রয়েছে।",
    toastDisabled: "কুন্ডলী মিলন ফিচারটি বর্তমানে বন্ধ রাখা হয়েছে।",
    toastSuccessCoins: (coins: number) => `কুন্ডলী মিলন গণনা সম্পন্ন হয়েছে! (${toLocalizedDigits(coins, "bn")} কয়েন খরচ হয়েছে)`,
    toastSuccess: "কুন্ডলী মিলন গণনা সফলভাবে সম্পন্ন হয়েছে!",
    toastErrorCalc: "কুন্ডলী মিলন গণনা করতে সমস্যা হয়েছে। তথ্য পরীক্ষা করুন।",
    groomFormHeading: "বরের বিবরণ লিখুন",
    brideFormHeading: "কনের বিবরণ লিখুন",
    groomManglikBadge: "বর: মাঙ্গলিক",
    groomNonManglikBadge: "বর: অমাঙ্গলিক",
    brideManglikBadge: "কনে: মাঙ্গলিক",
    brideNonManglikBadge: "কনে: অমাঙ্গলিক",
    manglikMatchYes: "মাঙ্গলিক সামঞ্জস্য: হ্যাঁ",
    manglikMatchNo: "মাঙ্গলিক সামঞ্জস্য: না",
    manglikDescFavorable: "উভয়ের মধ্যে মাঙ্গলিক সামঞ্জস্য শুভ ও বিবাহযোগ্য।",
    manglikDescCaution: "মাঙ্গলিক অসামঞ্জস্য রয়েছে, অভিজ্ঞ জ্যোতিষীর পরামর্শ বা শান্তি স্বস্ত্যয়ন প্রয়োজন।",
    auspiciousMatch: "শুভ মিলন",
    inauspiciousMatch: "অশুভ মিলন",
    doshaFree: "দোষ মুক্ত",
    doshaPresent: "দোষ বিদ্যমান",
    cancelledBhanga: "দোষভঙ্গ (বাতিল)",
    compatibleBadge: "অনুকূল",
    remedyNeededBadge: "প্রতিকার সাপেক্ষ",
    verdictAuspiciousTitle: "বিবাহের জন্য শুভ ও অনুকূল যোটক",
    verdictCautionTitle: "সতর্কতা ও জ্যোতিষীয় প্রতিকার পরামর্শিত",
    forecastBannerTitle: "দাম্পত্য ভবিষ্যৎ ও শুভ বিবাহের সময় গণনা প্রস্তুত",
    forecastBannerSubtitle: (years: string, harmony: string, progeny: string) =>
      `শুভ বছর: ${years} • দাম্পত্য সুখ: ${harmony}% • সন্তান সুখ: ${progeny}%`,
    viewFullForecastBtn: "সম্পূর্ণ ভবিষ্যৎ বিশ্লেষণ দেখুন",
    dashakootTitle: "দক্ষিণ ভারতীয় দশকূট মিলন (১০ পরুথাম)",
    dashakootSummary: (score: string, poruthamCount: string) =>
      `মোট প্রাপ্ত স্কোর: ${score} / ৩৬ • অনুকূল পরুথাম: ${poruthamCount} / ১০`,
    dashakootFavorableBadge: "অনুকূল দশকূট মিলন",
    dashakootModerateBadge: "মধ্যম দশকূট মিলন",
    dashakootTableTitle: "দশ পরুথাম বিস্তারিত ফলাফল সারণী",
    dashakootTableSubtitle: "দিন, গণ, যোনি, রাশি, রাশ্যাধিপতি, রজ্জু, বেধ, বশ্য, মহেন্দ্র ও স্ত্রী দীর্ঘ বিচার",
    significanceTh: "তাৎপর্য ও ব্যাখ্যা",
    attributeTh: "পরুথাম (Koota)",
    cancellationsTitle: "মহাদোষ ও শাস্ত্রীয় দোষভঙ্গ (Dosha Cancellation) বিশ্লেষণ",
    cancellationsSubtitle:
      "শাস্ত্রীয় জ্যোতিষ (মুহূর্ত চিন্তামণি ও পরাশর শাস্ত্র) অনুসারে সাধারণ গণনায় দোষ দেখা গেলেও বিশেষ রাশিনাথ মিত্রতা, চরণভেদ ও নক্ষত্রভেদে অনেক দোষ স্বয়ং বিনষ্ট হয় (দোষভঙ্গ)। নিচে বিস্তারিত পরীক্ষা দেওয়া হলো:",
    shastraCitationLabel: "শাস্ত্র সূত্র:",
    severityLabel: "তীব্রতা:",
    remedyLabel: "শাস্ত্রসম্মত প্রতিকার:",
    relativesReliefLabel: "উপশম / নিবৃত্তি:",
    manglikAspectsTitle: "মাঙ্গলিক কারণ ও দৃষ্টি বিশদ বিবরণী (Based On House & Aspects)",
    papasamyaTitle: "পাপসাম্য সামঞ্জস্য সূচক (Papasamya Balance)",
    papasamyaSubtitle: (groomPts: string, bridePts: string, diff: string) =>
      `বরের পাপ পয়েন্ট: ${groomPts} | কনের পাপ পয়েন্ট: ${bridePts} (ব্যবধান: ${diff})`,
    fromLagna: "লগ্ন থেকে",
    fromMoon: "চন্দ্র থেকে",
    fromVenus: "শুক্র থেকে",
    avakahadaTableTitle: "অবকহড়া চক্র ও পঞ্চাঙ্গ তুলনামূলক সারণী",
    avakahadaTableSubtitle: "ক্লায়েন্ট রেফারেন্স রিপোর্ট অনুযায়ী উভয় জাতক-জাতিকার মৌলিক সূচকের তুলনা",
    personalityTitle: "মনস্তাত্ত্বিক ও চারিত্রিক বৈশিষ্ট্য বিশ্লেষণ",
    traitsPositiveTitle: "ইতিবাচক গুণাবলী (Positive Traits)",
    traitsSensitiveTitle: "সতর্কতার ক্ষেত্র (Areas for Patience)",
    forecastAuspiciousTitle: "বিবাহের শুভ বছর ও সময়কাল",
    jupiterTransitSubtitle: "বৃহস্পতি গোচর ও গুরু বল গণনা",
    idealMarriageAgeBoy: "বরের উপযুক্ত বিবাহ বয়স",
    idealMarriageAgeGirl: "কনের উপযুক্ত বিবাহ বয়স",
    forecastHarmonyTitle: "দাম্পত্য জীবন ও প্রেম",
    forecastProgenyTitle: "সন্তানের স্বাস্থ্য ও বংশবৃদ্ধি",
    forecastTemperamentTitle: "ঝগড়াঝাঁটি ও মেজাজের সামঞ্জস্য",
    forecastWealthTitle: "বিয়ের পর অর্থভাগ্য ও যৌথ সমৃদ্ধি",
    forecastMutualTitle: "উভয়ের যৌথ ভবিষ্যৎ ও দীর্ঘস্থায়িত্ব",
    dashaComparisonTitle: "বিংশোত্তরী দশা ও দশা সন্ধি বিচার",
    dashaComparisonSubtitle: "উভয়ের বর্তমান মহাদশা ও অন্তর্দশার সামঞ্জস্যপূর্ণ বিশ্লেষণ",
    dashaSandhiPresentBadge: "দশা সন্ধি বিদ্যমান",
    dashaSandhiAbsentBadge: "দশা সন্ধি মুক্ত",
    currentDashaTitle: "বর্তমান দশা",
    mahadashaLabel: "মহাদশা:",
    antardashaLabel: "অন্তর্দশা:",
    vedicRemediesTitle: "শাস্ত্রীয় বৈদিক প্রতিকার ও মঙ্গল উপায়",
    vedicRemediesNotice:
      "সম্পূর্ণ জন্মছক মিলিয়ে আরও বিস্তারিত যোটক বিচারের জন্য আমাদের অভিজ্ঞ জ্যোতিষীদের সাথে সরাসরি কথা বলুন।",
    talkAstrologerBtn: "জ্যোতিষীর পরামর্শ নিন",
    planetsTableTitle: "উভয়ের গ্রহ অবস্থান তুলনামূলক সারণী",
    planetsTableSubtitle: "বর ও কনের গ্রহের নির্ভুল ডিগ্রি, রাশি ও নক্ষত্র অবস্থান",
    padaLabel: "পাদ",
    chartTypeLabel: "ছক নির্বাচন:",
    chartTypeD1: "D1 লগ্ন ছক",
    chartTypeD9: "D9 নবাংশ ছক (দাম্পত্য)",
    chartTypeChalit: "ভাব চলিত ছক",
    chartTypeMoon: "চন্দ্র কুন্ডলী",
    chartStyleLabel: "শৈলী:",
    chartD1Desc: "D1 জন্ম লগ্ন কুন্ডলী: ব্যক্তিত্ব, দেহগঠন ও সামগ্রিক জীবনের মূল ভিত্তি প্রকাশ করে।",
    chartD9Desc: "D9 নবাংশ কুন্ডলী (Navamsha): বৈদিক জ্যোতিষে বিবাহ, জীবনসঙ্গীর স্বভাব, দাম্পত্য সুখ ও অন্তিম সৌভাগ্যের সুনির্দিষ্ট দিক নির্দেশ করে।",
    chartChalitDesc: "ভাব চলিত কুন্ডলী: শ্রীপতি ভাবারম্ভ পদ্ধতি অনুসারে গ্রহদের প্রকৃত ভাব অবস্থানের দিক নির্দেশ করে।",
    chartMoonDesc: "চন্দ্র কুন্ডলী: মানসিক সংযোগ, সংবেদনশীলতা ও উভয় মনের অভ্যন্তরীণ রসায়ন বোঝার মাপকাঠি।",
    groomChartSub: "বরের কুন্ডলী",
    brideChartSub: "কনের কুন্ডলী",
    floatingTotal: "সর্বমোট পয়েন্ট",
    floatingFavorable: "অনুকূল যোটক",
    floatingCaution: "সতর্কতা প্রয়োজন",
    consultAstrologerBtn: "জ্যোতিষীর পরামর্শ নিন",
  },

  hi: {
    pageTitle: "कुंडली मिलान (३६ गुण मिलान)",
    pageSubtitle:
      "कुंडली मिलान या गुण मिलान एक प्राचीन वैदिक ज्योतिष विज्ञान है जो वर और वधू की जन्म कुंडली का तुलनात्मक विश्लेषण कर सुखी, समृद्ध और सामंजस्यपूर्ण वैवाहिक जीवन का मार्गदर्शन करता है।",
    step1Title: "वर का विवरण दर्ज करें ♂",
    step2Title: "वधू का विवरण दर्ज करें ♀",
    nextStepButton: "अगला: वधू का विवरण ♀",
    backButton: "वापस",
    matchButton: "कुंडली मिलान करें ➔",
    recalculateButton: "नया मिलान गणना",
    downloadPdfButton: "रिपोर्ट प्रिंट / सहेजें",

    groomTitle: "वर का विवरण (Male Details)",
    brideTitle: "वधू का विवरण (Female Details)",
    groomLabel: "वर",
    brideLabel: "वधू",
    ringsBanner: "विवाह गुण मिलान",

    basicDetailsTitle: "मूल जन्म विवरण",
    name: "नाम",
    birthDateTime: "जन्म तिथि व समय",
    birthPlace: "जन्म स्थान",
    janamRashi: "जन्म राशि",
    rashiLord: "राशि स्वामी",
    janamNakshatra: "जन्म नक्षत्र",
    nakshatraLord: "नक्षत्र स्वामी",
    pada: "चरण",

    manglikBannerPrefixBoy: "वर",
    manglikBannerPrefixGirl: "वधू",
    isManglik: "मांगलिक है",
    isNotManglik: "मांगलिक नहीं है",

    tabs: {
      dosha: "अष्टकूट (36 गुण)",
      dashakoot: "दशकूट (10 पोरुथम)",
      cancellations: "दोषभंग व महादोष",
      papasamya: "पापसाम्य संतुलन",
      avakahada: "अवकहड़ा व पंचांग",
      forecast: "दांपत्य भविष्य",
      planetDetails: "ग्रह स्थिति",
      lagnaCharts: "कुंडली चक्र (D1/D9)",
      personality: "स्वभाव व व्यक्तित्व",
    },

    metricCards: {
      ashtakootTitle: "अष्टकूट गुण",
      rajjooDoshaTitle: "रज्जू दोष",
      vedhaDoshaTitle: "वेध दोष",
      manglikMatchTitle: "मांगलिक मिलान",
      yes: "हाँ",
      no: "नहीं",
      outOf: "में से",
    },

    pointsTable: {
      title: "अष्टकूट गुण मिलान बिंदु",
      subtitle: "३६ गुणों का संपूर्ण वैदिक विश्लेषण",
      colAttribute: "गुण (Attribute)",
      colMale: "वर (Male)",
      colFemale: "वधू (Female)",
      colOutOf: "कुल (Out of)",
      colReceived: "प्राप्त (Received)",
      colAreaOfLife: "प्रभाव क्षेत्र (Area Of Life)",
      totalLabel: "कुल प्राप्तांक",
      overallCompatibility: "समग्र वैवाहिक सामंजस्य",
    },

    attributes: {
      Varna: {
        name: "वर्ण (Varna)",
        areaOfLife: "स्वाभाविक संस्कार / कार्यप्रवृत्ति",
        description: "अहंकार सामंजस्य, कार्य निष्ठा तथा आध्यात्मिक तालमेल का विश्लेषण।",
      },
      Vashya: {
        name: "वश्य (Vashya)",
        areaOfLife: "परस्पर आकर्षण व नियंत्रण",
        description: "दंपति के मध्य पारस्परिक समर्पण, चुंबकीय आकर्षण तथा प्रभुत्व संतुलन।",
      },
      Tara: {
        name: "तारा (Tara)",
        areaOfLife: "सुख - समृद्धि - स्वास्थ्य व आयु",
        description: "दोनों के स्वास्थ्य, दीर्घायु तथा भाग्यवृद्धि की अनुकूलता।",
      },
      Yoni: {
        name: "योनि (Yoni)",
        areaOfLife: "जैविक व शारीरिक आकर्षण",
        description: "शारीरिक तालमेल, अंतरंगता तथा काम-सुख की सामंजस्यता।",
      },
      Maitri: {
        name: "ग्रह मैत्री (Maitri)",
        areaOfLife: "मित्रता व मानसिक सामंजस्य",
        description: "मानसिक दृष्टिकोण, बौद्धिक साम्यता तथा सौहार्दपूर्ण संबंध।",
      },
      Gan: {
        name: "गण (Gan)",
        areaOfLife: "स्वभाव व व्यवहार",
        description: "पारिवारिक आचार-व्यवहार, स्वभाव तथा मानसिक संतुलन का आकलन।",
      },
      Bhakut: {
        name: "भकूट (Bhakut)",
        areaOfLife: "रचनात्मक क्षमता / कुल व समाज",
        description: "पारिवारिक समृद्धि, आर्थिक उन्नति तथा जीवन भर एक-दूसरे का संवर्धन।",
      },
      Nadi: {
        name: "नाड़ी (Nadi)",
        areaOfLife: "संतान सुख / आनुवंशिक स्वास्थ्य",
        description: "संतान सुख, वंशवृद्धि, आनुवंशिक स्वास्थ्य तथा दीर्घायु का प्रमुख सूचक।",
      },
    },

    varnaValues: {
      Brahmin: "ब्राह्मण",
      Kshatriya: "क्षत्रिय",
      Vaishya: "वैश्य",
      Shudra: "शूद्र",
    },

    vashyaValues: {
      Chatushpada: "चतुष्पद",
      Manava: "मानव (द्विपद)",
      Jalachara: "जलचर",
      Vanachara: "वनचर",
      Keeta: "कीट",
    },

    ganaValues: {
      Deva: "देव गण",
      Manushya: "मनुष्य गण",
      Rakshasa: "राक्षस गण",
    },

    nadiValues: {
      Adi: "आदि नाड़ी",
      Madhya: "मध्य नाड़ी",
      Antya: "अंत्य नाड़ी",
    },

    yoniValues: {
      "Ashwa (Horse)": "अश्व (घोड़ा)",
      "Gaja (Elephant)": "गज (हाथी)",
      "Mesha (Sheep)": "मेष (भेड़)",
      "Sarpa (Serpent)": "सर्प (साँप)",
      "Shwana (Dog)": "श्वान (कुत्ता)",
      "Marjara (Cat)": "मार्जार (बिल्ली)",
      "Mushaka (Rat)": "मूषक (चूहा)",
      "Gau (Cow)": "गौ (गाय)",
      "Mahisha (Buffalo)": "महिष (भैंस)",
      "Vyaghra (Tiger)": "व्याघ्र (बाघ)",
      "Mriga (Deer)": "मृग (हिरण)",
      "Vanara (Monkey)": "वानर (बंदर)",
      "Nakula (Mongoose)": "नकुल (नेवला)",
      "Simha (Lion)": "सिंह (शेर)",
    },

    form: {
      fullNameLabel: "पूरा नाम",
      fullNamePlaceholder: "पूरा नाम दर्ज करें",
      dobLabel: "जन्म तिथि (दिन-माह-वर्ष)",
      dayPlaceholder: "दिन (DD)",
      monthPlaceholder: "माह (MM)",
      yearPlaceholder: "वर्ष (YYYY)",
      tobLabel: "जन्म समय (घंटा:मिनट:सेकंड AM/PM)",
      hourPlaceholder: "घंटा (HH)",
      minutePlaceholder: "मिनट (MM)",
      secondPlaceholder: "सेकंड (SS)",
      placeLabel: "जन्म स्थान (शहर / राज्य / देश)",
      placePlaceholder: "शहर या स्थान का नाम दर्ज करें",
      advancedSettings: "उन्नत गणना सेटिंग्स (अक्षांश, रेखांश, अयनांश)",
      hideAdvancedSettings: "उन्नत सेटिंग्स छुपाएं",
      latitude: "अक्षांश (Lat)",
      longitude: "रेखांश (Lon)",
      timezone: "समय क्षेत्र (Timezone UTC)",
      ayanamsa: "अयनांश (Ayanamsa)",
      houseSystem: "भाव पद्धति (House System)",
      validationName: "कृपया पूरा नाम दर्ज करें।",
      validationDob: "कृपया सही जन्म तिथि प्रदान करें।",
      validationPlace: "कृपया जन्म स्थान चुनें।",
    },

    charts: {
      groomChartTitle: "वर की लग्न कुंडली (D1 Lagna Chart)",
      brideChartTitle: "वधू की लग्न कुंडली (D1 Lagna Chart)",
      chartStyleNorth: "उत्तर भारतीय (North)",
      chartStyleEast: "पूर्व भारतीय (East)",
      chartStyleSouth: "दक्षिण भारतीय (South)",
    },

    planetTable: {
      planet: "ग्रह",
      longitude: "देशांतर (डिग्री)",
      sign: "राशि",
      nakshatra: "नक्षत्र",
      nakshatraLord: "नक्षत्र स्वामी",
      pada: "चरण",
    },

    verdict: {
      favorable:
        "विवाह हेतु सभी कारक अनुकूल हैं। दांपत्य जीवन सुखमय, समृद्ध और दीर्घायु रहेगा। ज्योतिषी द्वारा बताए गए उपायों का पालन कर विवाह संपन्न किया जा सकता है।",
      unfavorable:
        "गुण मिलान अंक न्यूनतम सीमा से कम हैं अथवा कुंडली में दोष पाया गया है। विवाह निश्चित करने से पूर्व योग्य ज्योतिषी से परामर्श व निवारण उपाय अवश्य करें।",
    },

    // Extra UI strings
    timeOptionalSuffix: "वैकल्पिक — 12:00 PM",
    calculatingBtn: "गणना की जा रही है...",
    featureUnavailable: "कुंडली मिलान सुविधा वर्तमान में अस्थायी रूप से अनुपलब्ध है।",
    toastDisabled: "कुंडली मिलान सुविधा वर्तमान में निष्क्रिय है।",
    toastSuccessCoins: (coins: number) => `कुंडली मिलान गणना पूर्ण हुई! (${toLocalizedDigits(coins, "hi")} सिक्के प्रयुक्त)`,
    toastSuccess: "कुंडली मिलान सफलतापूर्वक पूरा हुआ!",
    toastErrorCalc: "कुंडली मिलान गणना में त्रुटि हुई। कृपया इनपुट जांचें।",
    groomFormHeading: "वर का विवरण दर्ज करें",
    brideFormHeading: "वधू का विवरण दर्ज करें",
    groomManglikBadge: "वर: मांगलिक",
    groomNonManglikBadge: "वर: गैर-मांगलिक",
    brideManglikBadge: "वधू: मांगलिक",
    brideNonManglikBadge: "वधू: गैर-मांगलिक",
    manglikMatchYes: "मांगलिक मिलान: हाँ",
    manglikMatchNo: "मांगलिक मिलान: नहीं",
    manglikDescFavorable: "दोनों के मध्य मांगलिक सामंजस्य शुभ एवं विवाह योग्य है।",
    manglikDescCaution: "मांगलिक असंतुलन है, योग्य ज्योतिषी से परामर्श अथवा शांति उपाय आवश्यक है।",
    auspiciousMatch: "शुभ मिलान",
    inauspiciousMatch: "अशुभ मिलान",
    doshaFree: "दोष मुक्त",
    doshaPresent: "दोष विद्यमान",
    cancelledBhanga: "दोषभंग (प्रभावहीन)",
    compatibleBadge: "अनुकूल",
    remedyNeededBadge: "उपाय आवश्यक",
    verdictAuspiciousTitle: "विवाह हेतु शुभ एवं अनुकूल गठबंधन",
    verdictCautionTitle: "सावधानी एवं ज्योतिषीय उपाय परामर्शित",
    forecastBannerTitle: "दांपत्य भविष्य एवं शुभ विवाह समय गणना उपलब्ध",
    forecastBannerSubtitle: (years: string, harmony: string, progeny: string) =>
      `शुभ वर्ष: ${years} • दांपत्य सामंजस्य: ${harmony}% • संतान सुख: ${progeny}%`,
    viewFullForecastBtn: "संपूर्ण भविष्य देखें",
    dashakootTitle: "दक्षिण भारतीय दशकूट मिलान (10 पोरुथम)",
    dashakootSummary: (score: string, poruthamCount: string) =>
      `कुल प्राप्तांक: ${score} / 36 • अनुकूल पोरुथम: ${poruthamCount} / 10`,
    dashakootFavorableBadge: "अनुकूल दशकूट मिलान",
    dashakootModerateBadge: "मध्यम दशकूट मिलान",
    dashakootTableTitle: "दस पोरुथम विस्तृत परिणाम तालिका",
    dashakootTableSubtitle: "दिन, गण, योनि, राशि, राश्याधिपति, रज्जू, वेध, वश्य, महेंद्र और स्त्री दीर्घ विचार",
    significanceTh: "महत्व एवं विश्लेषण",
    attributeTh: "पोरुथम (कूट)",
    cancellationsTitle: "महादोष एवं शास्त्रीय दोषभंग विश्लेषण",
    cancellationsSubtitle:
      "मुहूर्त चिंतामणि व पराशर शास्त्र के अनुसार कई दोष स्वाभाविक ग्रह मैत्री, चरण भेद या नक्षत्र भेद से स्वयं निष्फल हो जाते हैं। विस्तृत विश्लेषण नीचे प्रस्तुत है:",
    shastraCitationLabel: "शास्त्र संदर्भ:",
    severityLabel: "तीव्रता:",
    remedyLabel: "शास्त्रीय उपाय:",
    relativesReliefLabel: "उपशम / निवारण:",
    manglikAspectsTitle: "मांगलिक कारक एवं दृष्टि विस्तृत विवरण",
    papasamyaTitle: "पापसाम्य संतुलन सूचकांक",
    papasamyaSubtitle: (groomPts: string, bridePts: string, diff: string) =>
      `वर के पाप अंक: ${groomPts} | वधू के पाप अंक: ${bridePts} (अंतर: ${diff})`,
    fromLagna: "लग्न से",
    fromMoon: "चंद्र से",
    fromVenus: "शुक्र से",
    avakahadaTableTitle: "अवकहड़ा चक्र एवं पंचांग तुलनात्मक विवरण",
    avakahadaTableSubtitle: "दोनों जातकों के 16 मूलभूत ज्योतिषीय घटकों का शास्त्रीय तुलनात्मक विश्लेषण",
    personalityTitle: "मनोवैज्ञानिक एवं चारित्रिक विशेषता विश्लेषण",
    traitsPositiveTitle: "अनुकूल चारित्रिक विशेषताएं (Positive Traits)",
    traitsSensitiveTitle: "सावधानी / संवेदनशील पहलू (Areas for Patience)",
    forecastAuspiciousTitle: "विवाह हेतु सर्वाधिक शुभ वर्ष एवं काल",
    jupiterTransitSubtitle: "गुरु गोचर एवं गुरु बल गणना",
    idealMarriageAgeBoy: "वर की उपयुक्त विवाह आयु",
    idealMarriageAgeGirl: "वधू की उपयुक्त विवाह आयु",
    forecastHarmonyTitle: "दांपत्य जीवन एवं प्रेम",
    forecastProgenyTitle: "संतान सुख एवं स्वास्थ्य",
    forecastTemperamentTitle: "विवाद एवं स्वभाव संतुलन",
    forecastWealthTitle: "विवाह उपरांत धन-समृद्धि",
    forecastMutualTitle: "संयुक्त भविष्य एवं दीर्घायु",
    dashaComparisonTitle: "विंशोत्तरी दशा एवं दशा संधि विचार",
    dashaComparisonSubtitle: "दोनों की वर्तमान महादशा और अंतर्दशा का तुलनात्मक सामंजस्य",
    dashaSandhiPresentBadge: "दशा संधि विद्यमान",
    dashaSandhiAbsentBadge: "दशा संधि मुक्त",
    currentDashaTitle: "वर्तमान दशा",
    mahadashaLabel: "महादशा:",
    antardashaLabel: "अंतर्दशा:",
    vedicRemediesTitle: "शास्त्रीय वैदिक उपाय एवं शांति",
    vedicRemediesNotice:
      "विस्तृत जन्मकुंडली मिलान एवं व्यक्तिगत मार्गदर्शन हेतु हमारे अनुभवी वैदिक ज्योतिषियों से परामर्श लें।",
    talkAstrologerBtn: "ज्योतिषी से परामर्श लें",
    planetsTableTitle: "दोनों की ग्रह स्थिति तुलनात्मक तालिका",
    planetsTableSubtitle: "वर और वधू के ग्रहों के सूक्ष्म अंश, राशि एवं नक्षत्र स्थिति",
    padaLabel: "चरण",
    chartTypeLabel: "कुंडली प्रकार:",
    chartTypeD1: "D1 लग्न कुंडली",
    chartTypeD9: "D9 नवांश (दांपत्य)",
    chartTypeChalit: "भाव चलित",
    chartTypeMoon: "चंद्र कुंडली",
    chartStyleLabel: "शैली:",
    chartD1Desc: "D1 जन्म लग्न कुंडली: समग्र व्यक्तित्व एवं जीवन आधार का मुख्य विश्लेषण।",
    chartD9Desc: "D9 नवांश कुंडली: विवाह, जीवनसाथी के स्वभाव एवं दांपत्य सुख का अंतिम शास्त्रीय प्रमाण।",
    chartChalitDesc: "भाव चलित कुंडली: श्रीपति भाव पद्धति अनुसार ग्रहों की वास्तविक भाव स्थिति।",
    chartMoonDesc: "चंद्र कुंडली: मानसिक सामंजस्य एवं भावनात्मक तालमेल का विश्लेषण।",
    groomChartSub: "वर की कुंडली",
    brideChartSub: "वधू की कुंडली",
    floatingTotal: "कुल प्राप्तांक",
    floatingFavorable: "अनुकूल मिलान",
    floatingCaution: "सावधानी अपेक्षित",
    consultAstrologerBtn: "ज्योतिषी से परामर्श लें",
  },

  en: {
    pageTitle: "Kundli Matching (36 Gun Milan)",
    pageSubtitle:
      "Kundli Matching or Horoscope Matching is an ancient Vedic science comparing the planetary positions of the prospective bride and groom to evaluate lifelong harmony, mutual health, spiritual affinity, and prosperous marital union.",
    step1Title: "Enter Groom's Details ♂",
    step2Title: "Enter Bride's Details ♀",
    nextStepButton: "Next: Bride's details ♀",
    backButton: "Back",
    matchButton: "Match Your Kundli ➔",
    recalculateButton: "New Match / Recalculate",
    downloadPdfButton: "Print / Save PDF",

    groomTitle: "Groom's Details (Male)",
    brideTitle: "Bride's Details (Female)",
    groomLabel: "Groom",
    brideLabel: "Bride",
    ringsBanner: "Astrological Match Making",

    basicDetailsTitle: "Basic Birth Details",
    name: "Name",
    birthDateTime: "Birth Date & Time",
    birthPlace: "Birth Place",
    janamRashi: "Moon Sign (Rashi)",
    rashiLord: "Rashi Lord",
    janamNakshatra: "Birth Nakshatra",
    nakshatraLord: "Nakshatra Lord",
    pada: "Pada (Quarter)",

    manglikBannerPrefixBoy: "Groom",
    manglikBannerPrefixGirl: "Bride",
    isManglik: "is Manglik",
    isNotManglik: "is Non-Manglik",

    tabs: {
      dosha: "Ashtakoot (36 Gunas)",
      dashakoot: "Dashakoot (10 Poruthams)",
      cancellations: "Dosha Cancellations",
      papasamya: "Papasamya Scale",
      avakahada: "Avakahada Matrix",
      forecast: "Marriage Forecast",
      planetDetails: "Planetary Positions",
      lagnaCharts: "Kundli Charts (D1/D9)",
      personality: "Traits & Mindset",
    },

    metricCards: {
      ashtakootTitle: "Ashtakoot Guna",
      rajjooDoshaTitle: "Rajju Dosha",
      vedhaDoshaTitle: "Vedha Dosha",
      manglikMatchTitle: "Manglik Match",
      yes: "Yes",
      no: "No",
      outOf: "Out of",
    },

    pointsTable: {
      title: "Ashtakoot Guna Points Table",
      subtitle: "Comprehensive 36 Guna Shastric Analysis",
      colAttribute: "Attribute",
      colMale: "Groom (Male)",
      colFemale: "Bride (Female)",
      colOutOf: "Out of",
      colReceived: "Received",
      colAreaOfLife: "Area of Life",
      totalLabel: "Total Points",
      overallCompatibility: "Overall Compatibility",
    },

    attributes: {
      Varna: {
        name: "Varna",
        areaOfLife: "Ego, Work & Spiritual Temperament",
        description: "Assesses ego compatibility, innate temperament and spiritual disposition.",
      },
      Vashya: {
        name: "Vashya",
        areaOfLife: "Mutual Attraction & Power Dynamic",
        description: "Evaluates mutual attraction, emotional control and dedication in partnership.",
      },
      Tara: {
        name: "Tara",
        areaOfLife: "Health, Longevity & Destiny",
        description: "Measures mutual longevity, health well-being and fortune of the couple.",
      },
      Yoni: {
        name: "Yoni",
        areaOfLife: "Physical & Biological Affinity",
        description: "Evaluates physical harmony, biological compatibility and intimate affinity.",
      },
      Maitri: {
        name: "Graha Maitri",
        areaOfLife: "Friendship & Mental Accord",
        description: "Assesses psychological disposition, intellectual communication and shared values.",
      },
      Gan: {
        name: "Gana",
        areaOfLife: "Temperament & Daily Behaviour",
        description: "Evaluates emotional temperaments, social conduct and family adaptation.",
      },
      Bhakut: {
        name: "Bhakoot",
        areaOfLife: "Family Prosperity & Economic Growth",
        description: "Indicates financial growth, cumulative joy, and lifelong familial bonding.",
      },
      Nadi: {
        name: "Nadi",
        areaOfLife: "Progeny, Health & Genetic Vitality",
        description: "Crucial indicator of healthy progeny, genetic vitality and nervous temperament.",
      },
    },

    varnaValues: {
      Brahmin: "Brahmin",
      Kshatriya: "Kshatriya",
      Vaishya: "Vaishya",
      Shudra: "Shudra",
    },

    vashyaValues: {
      Chatushpada: "Chatushpada (Quadruped)",
      Manava: "Manava (Biped/Human)",
      Jalachara: "Jalachara (Aquatic)",
      Vanachara: "Vanachara (Wild/Carnivore)",
      Keeta: "Keeta (Insect)",
    },

    ganaValues: {
      Deva: "Deva (Divine)",
      Manushya: "Manushya (Human)",
      Rakshasa: "Rakshasa (Demonic)",
    },

    nadiValues: {
      Adi: "Adi (Vata / Nerve)",
      Madhya: "Madhya (Pitta / Bile)",
      Antya: "Antya (Kapha / Phlegm)",
    },

    yoniValues: {
      "Ashwa (Horse)": "Ashwa (Horse)",
      "Gaja (Elephant)": "Gaja (Elephant)",
      "Mesha (Sheep)": "Mesha (Sheep)",
      "Sarpa (Serpent)": "Sarpa (Serpent)",
      "Shwana (Dog)": "Shwana (Dog)",
      "Marjara (Cat)": "Marjara (Cat)",
      "Mushaka (Rat)": "Mushaka (Rat)",
      "Gau (Cow)": "Gau (Cow)",
      "Mahisha (Buffalo)": "Mahisha (Buffalo)",
      "Vyaghra (Tiger)": "Vyaghra (Tiger)",
      "Mriga (Deer)": "Mriga (Deer)",
      "Vanara (Monkey)": "Vanara (Monkey)",
      "Nakula (Mongoose)": "Nakula (Mongoose)",
      "Simha (Lion)": "Simha (Lion)",
    },

    form: {
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Enter full name",
      dobLabel: "Birth Date (Day-Month-Year)",
      dayPlaceholder: "Day (DD)",
      monthPlaceholder: "Month (MM)",
      yearPlaceholder: "Year (YYYY)",
      tobLabel: "Birth Time (HH:MM:SS AM/PM)",
      hourPlaceholder: "HH",
      minutePlaceholder: "MM",
      secondPlaceholder: "SS",
      placeLabel: "Birth Place (City / State / Country)",
      placePlaceholder: "Enter city or town name",
      advancedSettings: "Advanced Coordinates & Settings (Lat, Lon, Ayanamsa)",
      hideAdvancedSettings: "Hide Advanced Settings",
      latitude: "Latitude",
      longitude: "Longitude",
      timezone: "Timezone (UTC)",
      ayanamsa: "Ayanamsa",
      houseSystem: "House System",
      validationName: "Please enter a valid full name.",
      validationDob: "Please provide valid day, month, and year.",
      validationPlace: "Please select a birth place.",
    },

    charts: {
      groomChartTitle: "Groom's Lagna Chart (D1)",
      brideChartTitle: "Bride's Lagna Chart (D1)",
      chartStyleNorth: "North Indian",
      chartStyleEast: "East Indian (Bengali)",
      chartStyleSouth: "South Indian",
    },

    planetTable: {
      planet: "Planet",
      longitude: "Longitude",
      sign: "Sign",
      nakshatra: "Nakshatra",
      nakshatraLord: "Nakshatra Lord",
      pada: "Pada",
    },

    verdict: {
      favorable:
        "All factors are conducive for the match. The couple can go ahead with this alliance only after performing the remedies as suggested by the astrologer.",
      unfavorable:
        "The matching score is below the auspicious threshold or contains astrological discord. Remedial consultation is strongly advised before solemnizing the marriage.",
    },

    // Extra UI strings
    timeOptionalSuffix: "optional — 12:00 PM",
    calculatingBtn: "Calculating...",
    featureUnavailable: "Kundli Matching feature is currently unavailable.",
    toastDisabled: "Kundli matching feature is temporarily unavailable.",
    toastSuccessCoins: (coins: number) => `Kundli matching calculated! (${coins} coins used)`,
    toastSuccess: "Kundli matching calculated successfully!",
    toastErrorCalc: "Failed to calculate Kundli matching. Please check inputs.",
    groomFormHeading: "Enter Groom's Details",
    brideFormHeading: "Enter Bride's Details",
    groomManglikBadge: "Groom: Manglik",
    groomNonManglikBadge: "Groom: Non-Manglik",
    brideManglikBadge: "Bride: Manglik",
    brideNonManglikBadge: "Bride: Non-Manglik",
    manglikMatchYes: "Manglik Match: Yes",
    manglikMatchNo: "Manglik Match: No",
    manglikDescFavorable: "Manglik compatibility is favorable for this marriage.",
    manglikDescCaution: "Manglik disparity detected; astrological consultation recommended.",
    auspiciousMatch: "Auspicious",
    inauspiciousMatch: "Inauspicious",
    doshaFree: "Dosha Free",
    doshaPresent: "Dosha Present",
    cancelledBhanga: "Cancelled (Bhanga)",
    compatibleBadge: "Compatible",
    remedyNeededBadge: "Remedy Needed",
    verdictAuspiciousTitle: "Favorable Alliance for Marriage",
    verdictCautionTitle: "Remedial Consultation Strongly Advised",
    forecastBannerTitle: "Marriage Life Forecast & Auspicious Timing Ready",
    forecastBannerSubtitle: (years: string, harmony: string, progeny: string) =>
      `Auspicious Years: ${years} • Harmony: ${harmony}% • Progeny: ${progeny}%`,
    viewFullForecastBtn: "View Full Forecast",
    dashakootTitle: "South Indian Dashakoota (10 Poruthams)",
    dashakootSummary: (score: string, poruthamCount: string) =>
      `Total Score: ${score} / 36 • Favorable Poruthams: ${poruthamCount} / 10`,
    dashakootFavorableBadge: "Favorable Dashakoot",
    dashakootModerateBadge: "Moderate Dashakoot",
    dashakootTableTitle: "10 Porutham Detailed Agreement Table",
    dashakootTableSubtitle: "Dina, Gana, Yoni, Rasi, Rasyadhipati, Rajju, Vedha, Vashya, Mahendra, Stree Deergha",
    significanceTh: "Significance",
    attributeTh: "Porutham",
    cancellationsTitle: "Maha Dosha & Classical Cancellation Analysis",
    cancellationsSubtitle:
      "According to Brihat Parashara Hora Shastra & Muhurta Chintamani, apparent doshas are often cancelled by planetary friendship and constellation variations:",
    shastraCitationLabel: "Reference:",
    severityLabel: "Severity:",
    remedyLabel: "Remedy:",
    relativesReliefLabel: "Relief:",
    manglikAspectsTitle: "Manglik Breakdown: Based On House & Aspects",
    papasamyaTitle: "Papasamya Malefic Balance",
    papasamyaSubtitle: (groomPts: string, bridePts: string, diff: string) =>
      `Groom Points: ${groomPts} | Bride Points: ${bridePts} (Diff: ${diff})`,
    fromLagna: "From Lagna",
    fromMoon: "From Moon",
    fromVenus: "From Venus",
    avakahadaTableTitle: "Side-by-Side Avakahada Chakra & Panchang Matrix",
    avakahadaTableSubtitle: "16 Astrological attributes side-by-side conforming strictly to classical benchmarks",
    personalityTitle: "Psychological & Trait Compatibility",
    traitsPositiveTitle: "Positive Traits",
    traitsSensitiveTitle: "Areas for Patience",
    forecastAuspiciousTitle: "Most Auspicious Years for Marriage",
    jupiterTransitSubtitle: "Jupiter Transit (Guru Bala) & Timing",
    idealMarriageAgeBoy: "Groom's Ideal Marriage Age",
    idealMarriageAgeGirl: "Bride's Ideal Marriage Age",
    forecastHarmonyTitle: "Marital Harmony & Love",
    forecastProgenyTitle: "Progeny & Child Health",
    forecastTemperamentTitle: "Temperament & Conflict Control",
    forecastWealthTitle: "Post-Marriage Wealth & Growth",
    forecastMutualTitle: "Mutual Future & Longevity",
    dashaComparisonTitle: "Vimshottari Dasha & Dasha Sandhi Match",
    dashaComparisonSubtitle: "Analysis of running Mahadashas and critical transit juncture",
    dashaSandhiPresentBadge: "Dasha Sandhi Alert",
    dashaSandhiAbsentBadge: "No Dasha Sandhi",
    currentDashaTitle: "Current Dasha",
    mahadashaLabel: "Mahadasha:",
    antardashaLabel: "Antardasha:",
    vedicRemediesTitle: "Classical Vedic Remedies & Astrological Guidance",
    vedicRemediesNotice:
      "For in-depth personalized birth chart remedies, consult verified astrologers.",
    talkAstrologerBtn: "Talk to Astrologer",
    planetsTableTitle: "Comparative Planetary Positions",
    planetsTableSubtitle: "High precision sidereal longitudes, signs and nakshatras for Groom & Bride",
    padaLabel: "Pada",
    chartTypeLabel: "Chart Type:",
    chartTypeD1: "D1 Lagna",
    chartTypeD9: "D9 Navamsha",
    chartTypeChalit: "Bhava Chalit",
    chartTypeMoon: "Chandra Kundli",
    chartStyleLabel: "Style:",
    chartD1Desc: "D1 Birth Chart: Core representation of physical constitution and life foundation.",
    chartD9Desc: "D9 Navamsha Chart: The paramount divisional chart for marriage, spouse disposition, and marital harmony.",
    chartChalitDesc: "Bhava Chalit Chart: Actual house placements according to classical house cusps.",
    chartMoonDesc: "Chandra Kundli: Mental disposition, emotional compatibility, and subconscious harmony.",
    groomChartSub: "Groom's Chart",
    brideChartSub: "Bride's Chart",
    floatingTotal: "Total Points",
    floatingFavorable: "Favorable Match",
    floatingCaution: "Caution Needed",
    consultAstrologerBtn: "Consult Astrologer",
  },
};

// =========================================================================
// TRANSLATION HELPER FUNCTIONS
// =========================================================================

export function translateKootaAttribute(attr?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!attr) return "";
  const t = KUNDLI_MATCHING_STRINGS[lang];
  if (t.attributes[attr]?.name) {
    return t.attributes[attr].name;
  }
  const clean = attr.trim();
  const map: Record<string, Record<AstrologyLanguage, string>> = {
    Varna: { bn: "বর্ণ (Varna)", hi: "वर्ण (Varna)", en: "Varna" },
    Vashya: { bn: "বশ্য (Vashya)", hi: "वश्य (Vashya)", en: "Vashya" },
    Tara: { bn: "তারা (Tara)", hi: "तारा (Tara)", en: "Tara" },
    Yoni: { bn: "যোনি (Yoni)", hi: "योनि (Yoni)", en: "Yoni" },
    Maitri: { bn: "গ্রহ মৈত্রী (Maitri)", hi: "ग्रह मैत्री (Maitri)", en: "Graha Maitri" },
    "Graha Maitri": { bn: "গ্রহ মৈত্রী", hi: "ग्रह मैत्री", en: "Graha Maitri" },
    Gan: { bn: "গণ (Gan)", hi: "गण (Gan)", en: "Gana" },
    Gana: { bn: "গণ", hi: "गण", en: "Gana" },
    Bhakut: { bn: "ভকূট (Bhakut)", hi: "भकूट (Bhakut)", en: "Bhakoot" },
    Bhakoot: { bn: "ভকূট", hi: "भकूट", en: "Bhakoot" },
    Nadi: { bn: "নাড়ী (Nadi)", hi: "नाड़ी (Nadi)", en: "Nadi" },
    Dina: { bn: "দিন (Dina)", hi: "दिन (Dina)", en: "Dina" },
    Rasi: { bn: "রাশি (Rasi)", hi: "राशि (Rasi)", en: "Rasi" },
    Rasyadhipati: { bn: "রাশ্যাধিপতি", hi: "राश्याधिपति", en: "Rasyadhipati" },
    Vasya: { bn: "বশ্য", hi: "वश्य", en: "Vasya" },
    Rajju: { bn: "রজ্জু (Rajju)", hi: "रज्जु (Rajju)", en: "Rajju" },
    Rajjoo: { bn: "রজ্জু (Rajjoo)", hi: "रज्जु (Rajjoo)", en: "Rajjoo" },
    Vedha: { bn: "বেধ (Vedha)", hi: "वेध (Vedha)", en: "Vedha" },
    Vriksha: { bn: "বৃক্ষ", hi: "वृक्ष", en: "Vriksha" },
    "Stree Deergha": { bn: "স্ত্রী দীর্ঘ", hi: "स्त्री दीर्घ", en: "Stree Deergha" },
    Mahendra: { bn: "মহেন্দ্র", hi: "महेंद्र", en: "Mahendra" },
  };
  return map[clean]?.[lang] || clean;
}

export function translateKootaValue(attr?: string | null, val?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!val) return "";
  const t = KUNDLI_MATCHING_STRINGS[lang];
  const clean = val.trim();

  // Varna lookup
  if (t.varnaValues[clean]) return t.varnaValues[clean];

  // Vashya lookup
  if (t.vashyaValues[clean]) return t.vashyaValues[clean];

  // Gana lookup
  if (t.ganaValues[clean]) return t.ganaValues[clean];

  // Nadi lookup
  if (t.nadiValues[clean]) return t.nadiValues[clean];

  // Yoni lookup
  if (t.yoniValues[clean]) return t.yoniValues[clean];

  // Check if it's a known rashi or nakshatra
  const trRashi = translateRashiName(clean, lang);
  if (trRashi !== clean) return trRashi;

  const trNak = translateNakshatraName(clean, lang);
  if (trNak !== clean) return trNak;

  // Porutham / Dashakoot statuses
  const statusMap: Record<string, Record<AstrologyLanguage, string>> = {
    Good: { bn: "উত্তম (অনুকূল)", hi: "उत्तम (अनुकूल)", en: "Good" },
    Uttamam: { bn: "উত্তম (অনুকূল)", hi: "उत्तम (अनुकूल)", en: "Uttamam" },
    Moderate: { bn: "মধ্যম", hi: "मध्यम", en: "Moderate" },
    Madhyamam: { bn: "মধ্যম", hi: "मध्यम", en: "Madhyamam" },
    Poor: { bn: "অধম (প্রতিকূল)", hi: "अधम (प्रतिकूल)", en: "Poor" },
    Adhamam: { bn: "অধম (প্রতিকূল)", hi: "अधम (प्रतिकूल)", en: "Adhamam" },
    Applicable: { bn: "প্রযোজ্য", hi: "लागू", en: "Applicable" },
    "Not Applicable": { bn: "প্রযোজ্য নয়", hi: "लागू नहीं", en: "Not Applicable" },
    Compatible: { bn: "সামঞ্জস্যপূর্ণ", hi: "अनुकूल", en: "Compatible" },
    Incompatible: { bn: "অসামঞ্জস্যপূর্ণ", hi: "प्रतिकूल", en: "Incompatible" },
  };

  if (statusMap[clean]?.[lang]) return statusMap[clean][lang];

  return toLocalizedDigits(clean, lang);
}

export function translatePoruthamStatus(status?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!status) return "";
  const s = status.trim();
  const map: Record<string, Record<AstrologyLanguage, string>> = {
    Good: { bn: "উত্তম (অনুকূল)", hi: "उत्तम (अनुकूल)", en: "Good" },
    Uttamam: { bn: "উত্তম (অনুকূল)", hi: "उत्तम (अनुकूल)", en: "Uttamam" },
    Moderate: { bn: "মধ্যম (সন্তোষজনক)", hi: "मध्यम (संतोषजनक)", en: "Moderate" },
    Madhyamam: { bn: "মধ্যম (সন্তোষজনক)", hi: "मध्यम (संतोषजनक)", en: "Madhyamam" },
    Poor: { bn: "অধম (প্রতিকূল)", hi: "अधम (प्रतिकूल)", en: "Poor" },
    Adhamam: { bn: "অধম (প্রতিকূল)", hi: "अधम (प्रतिकूल)", en: "Adhamam" },
  };
  return map[s]?.[lang] || s;
}

export const PERSONALITY_TRAITS_MAP: Record<string, Record<AstrologyLanguage, string>> = {
  Courageous: { bn: "সাহসী ও নির্ভীক", hi: "साहसी एवं निडर", en: "Courageous" },
  Pioneering: { bn: "অগ্রগামী ও উদ্ভাবক", hi: "अग्रणी एवं पथप्रदर्शक", en: "Pioneering" },
  Dynamic: { bn: "উদ্যমী ও গতিশীল", hi: "ऊर्जावान व गतिशील", en: "Dynamic" },
  Energetic: { bn: "কর্মঠ ও তেজস্বী", hi: "कर्मठ एवं उत्साही", en: "Energetic" },
  Assertive: { bn: "দৃঢ়চেতা ও স্পষ্টভাষী", hi: "दृढ़निश्चयी व स्पष्टवादी", en: "Assertive" },
  Impatient: { bn: "অধৈর্য", hi: "अधीर", en: "Impatient" },
  "Quick-tempered": { bn: "উত্তেজনাপ্রবণ / রাগী", hi: "क्रोधी / तुनकमिजाज", en: "Quick-tempered" },
  Aggressive: { bn: "আক্রমণাত্মক মনোভাব", hi: "आक्रामक स्वभाव", en: "Aggressive" },
  Restless: { bn: "চঞ্চল ও অশান্ত মন", hi: "चंचल व अशांत", en: "Restless" },
  Patient: { bn: "ধৈর্যশীল ও শান্ত", hi: "धैर्यवान एवं शांत", en: "Patient" },
  Reliable: { bn: "বিশ্বস্ত ও নির্ভরযোগ্য", hi: "विश्वसनीय व निष्ठावान", en: "Reliable" },
  Warmhearted: { bn: "উষ্ণ হৃদয়ের / দয়ালু", hi: "स्नेहशील व दयालु", en: "Warmhearted" },
  Artistic: { bn: "শিল্পানুরাগী ও নান্দনিক", hi: "कलाप्रेमी व सुरुचिपूर्ण", en: "Artistic" },
  Persistent: { bn: "অধ্যবসায়ী ও দৃঢ়", hi: "लगनशील व दृढ़", en: "Persistent" },
  Stubborn: { bn: "একগুঁয়েমি মনোভাব", hi: "हठी / जिद्दी", en: "Stubborn" },
  Possessive: { bn: "অধিকারপ্রবণ", hi: "अति-अधिकारवादी", en: "Possessive" },
  Inflexible: { bn: "আপসহীন / অনমনীয়", hi: "कठोर / अनम्य", en: "Inflexible" },
  Resentful: { bn: "অভিমানী / ক্ষোভপ্রবণ", hi: "रंजिश रखने वाला", en: "Resentful" },
  Intellectual: { bn: "বুদ্ধিদীপ্ত ও চিন্তাশীল", hi: "बुद्धिजीवी व विचारवान", en: "Intellectual" },
  Adaptable: { bn: "পরিস্থিতির সাথে খাপ খাইয়ে নেওয়া", hi: "अनुकूलनशील", en: "Adaptable" },
  Versatile: { bn: "বহুমুখী প্রতিভাধর", hi: "बहुमुखी प्रतिभा संपन्न", en: "Versatile" },
  Eloquent: { bn: "বাকপটু ও বাকচতুর", hi: "वाक्पटु व प्रभावशाली", en: "Eloquent" },
  Curious: { bn: "অনুসন্ধিৎসু ও কৌতূহলী", hi: "जिज्ञासु व खोजी", en: "Curious" },
  Inconsistent: { bn: "অস্থিরচিত্ত", hi: "असंगत / डांवाडोल", en: "Inconsistent" },
  Nervous: { bn: "উদ্বেগপ্রবণ", hi: "चिंतित / घबराहटयुक्त", en: "Nervous" },
  "Wavering Mind": { bn: "দোদুল্যমান মানসিকতা", hi: "अस्थिर मन", en: "Wavering Mind" },
  Superficial: { bn: "ভাসা-ভাসা চিন্তা", hi: "उथला विचार", en: "Superficial" },
  Compassionate: { bn: "পরোপকারী ও স্নেহশীল", hi: "करुणावान व दयालु", en: "Compassionate" },
  Intuitive: { bn: "স্বজ্ঞাশীল ও দূরদর্শী", hi: "सहजज्ञानी व अंतर्दृष्टि युक्त", en: "Intuitive" },
  Protective: { bn: "পরিবার রক্ষক ও যত্নশীল", hi: "सुरक्षात्मक व संरक्षक", en: "Protective" },
  Devoted: { bn: "একনিষ্ঠ ও উৎসর্গীকৃত", hi: "समर्पित व कर्तव्यनिष्ठ", en: "Devoted" },
  Receptive: { bn: "গ্রহণশীল ও সংবেদনশীল", hi: "ग्रहणशील व संवेदनशील", en: "Receptive" },
  Moody: { bn: "মেজাজী মনোভাব", hi: "भावुक / मिजाजी", en: "Moody" },
  "Over-sensitive": { bn: "অতি-সংবেদনশীল", hi: "अतिसंवेदनशील", en: "Over-sensitive" },
  Cautious: { bn: "অত্যধিক সতর্ক", hi: "अतिसावधान", en: "Cautious" },
  Clinging: { bn: "নির্ভরশীল মনোভাব", hi: "अति-निर्भर", en: "Clinging" },
  Generous: { bn: "উদারচিত্ত ও দানশীল", hi: "उदारमना व दानी", en: "Generous" },
  Creative: { bn: "সৃজনশীল ও কল্পনাপ্রবণ", hi: "सृजनशील व रचनात्मक", en: "Creative" },
  Faithful: { bn: "বিশ্বস্ত ও সৎ", hi: "वफादार व सच्चा", en: "Faithful" },
  Dignified: { bn: "আত্মমর্যাদাবান ও রাশভারী", hi: "स्वाभिमानी व गरिमापूर्ण", en: "Dignified" },
  Arrogant: { bn: "অহংকারী মনোভাব", hi: "अहंकारी स्वभाव", en: "Arrogant" },
  Bossy: { bn: "প্রভুত্বকামী", hi: "हुक्म चलाने वाला", en: "Bossy" },
  Egocentric: { bn: "আত্মকেন্দ্রিক", hi: "आत्मकेंद्रित", en: "Egocentric" },
  Intolerant: { bn: "অসহিষ্ণু", hi: "असहनशील", en: "Intolerant" },
  Planner: { bn: "পরিকল্পনাকারী ও কৌশলী", hi: "रणनीतिकार व योजनाकार", en: "Planner" },
  Logical: { bn: "যুক্তিযুক্ত ও বিশ্লেষণমুখী", hi: "तार्किक व विश्लेषक", en: "Logical" },
  Gossipi: { bn: "অহেতুক আলাপী", hi: "व्यर्थ चर्चाप्रिय", en: "Gossipy" },
  Manipulative: { bn: "কূটকৌশলী", hi: "चालाक / जोड़-तोड़ करने वाला", en: "Manipulative" },
  Diplomatic: { bn: "কূটনৈতিক ও পরিশীলিত", hi: "कूटनीतिक व शालीन", en: "Diplomatic" },
  Romantic: { bn: "রোমান্টিক ও ভাবুক", hi: "रोमांटिक व भावुक", en: "Romantic" },
  Charming: { bn: "আকর্ষণীয় ও মনোহর", hi: "आकर्षक व मनमोहक", en: "Charming" },
  Sociable: { bn: "সামাজিক ও বন্ধুবৎসল", hi: "मिलनसार व सामाजिक", en: "Sociable" },
  Idealistic: { bn: "আদর্শবাদী ও নীতিবান", hi: "आदर्शवादी व सिद्धांतप्रिय", en: "Idealistic" },
  Indecisive: { bn: "সিদ্ধান্তহীনতা", hi: "अनिर्णायक / दुविधाग्रस्त", en: "Indecisive" },
  Gullible: { bn: "সহজবিশ্বাসী / সরল", hi: "भोला-भाला", en: "Gullible" },
  "Easily Influenced": { bn: "সহজে প্রভাবিত হওয়া", hi: "सहज प्रभावित होने वाला", en: "Easily Influenced" },
  Hesitant: { bn: "সংশয়ী", hi: "संकोची / झिझकने वाला", en: "Hesitant" },
  Passionate: { bn: "দৃঢ় অনুরাগী ও একাগ্র", hi: "उत्साही व समर्पित", en: "Passionate" },
  Determined: { bn: "দৃঢ়প্রতিজ্ঞ ও লক্ষ্যনিষ্ঠ", hi: "दृढ़निश्चयी व कर्मठ", en: "Determined" },
  Loyal: { bn: "আনুগত্যশীল ও সত্যনিষ্ঠ", hi: "निष्ठावान व कर्तव्यपरायण", en: "Loyal" },
  Transformative: { bn: "পরিবর্তনকামী ও তেজস্বী", hi: "परिवर्तनकारी", en: "Transformative" },
  Secretive: { bn: "গোপনপ্রিয়তা", hi: "रहस्यमयी / बातें छुपाने वाला", en: "Secretive" },
  Jealous: { bn: "ঈর্ষাপরায়ণতা", hi: "ईर्ष्यालु", en: "Jealous" },
  Optimistic: { bn: "আশাবাদী ও উৎসাহী", hi: "आशावादी व उत्साही", en: "Optimistic" },
  Philosophical: { bn: "দার্শনিক ও তত্ত্বজ্ঞানী", hi: "दार्शनिक व तत्वज्ञानी", en: "Philosophical" },
  Honest: { bn: "সৎ ও স্পষ্টবাদী", hi: "ईमानदार व खरा", en: "Honest" },
  Sincere: { bn: "আন্তরিক ও অকপট", hi: "सच्चा व निष्कपट", en: "Sincere" },
  "Freedom-loving": { bn: "স্বাধীনচেতা ও মুক্তমনা", hi: "स्वतंत्रता प्रेमी", en: "Freedom-loving" },
  Blunt: { bn: "অতিরিক্ত স্পষ্টবাদী", hi: "मुंफट / रुखा", en: "Blunt" },
  "Over-confident": { bn: "অতিরিক্ত আত্মবিশ্বাসী", hi: "अति-आत्मविश्वासी", en: "Over-confident" },
  Impulsive: { bn: "হঠাৎ হঠকারী সিদ্ধান্ত", hi: "आवेगशील", en: "Impulsive" },
  Disciplined: { bn: "শৃঙ্খলাবদ্ধ ও নীতিপরায়ণ", hi: "अनुशासित व नियमबद्ध", en: "Disciplined" },
  Practical: { bn: "বাস্তবধর্মী ও কর্মমুখী", hi: "व्यावहारिक व यथार्थवादी", en: "Practical" },
  Ambitious: { bn: "উচ্চাকাঙ্ক্ষী ও কর্মঠ", hi: "महत्वाकांक्षी", en: "Ambitious" },
  Prudent: { bn: "দূরদর্শী ও হিসেবী", hi: "विवेकशील व दूरदर्शी", en: "Prudent" },
  Rigid: { bn: "অতিরিক্ত কঠোর", hi: "अति-कठोर", en: "Rigid" },
  Fatalistic: { bn: "ভাগ্যের ওপর অতিরিক্ত নির্ভর", hi: "भाग्यवादी", en: "Fatalistic" },
  Pessimistic: { bn: "হতাশাবাদী", hi: "निराशावादी", en: "Pessimistic" },
  Demanding: { bn: "দাবিময় স্বভাব", hi: "अति-अपेक्षा रखने वाला", en: "Demanding" },
  Inventive: { bn: "নতুন চিন্তা ও উদ্ভাবনী", hi: "नवाचारी व रचनात्मक", en: "Inventive" },
  Friendly: { bn: "বন্ধুভাবাপন্ন ও অমায়িক", hi: "मित्रवत व मिलनसार", en: "Friendly" },
  Humanitarian: { bn: "মানবিক ও সংবেদনশীল", hi: "मानवतावादी व दयालु", en: "Humanitarian" },
  Progressive: { bn: "প্রগতিশীল ও আধুনিক", hi: "प्रगतिशील व आधुनिक", en: "Progressive" },
  Original: { bn: "মৌলিক দৃষ্টিভঙ্গিসম্পন্ন", hi: "मौलिक व विशिष्ट", en: "Original" },
  Detached: { bn: "উদাসীন / নিরাসক্ত", hi: "तटस्थ / अलग-थलग", en: "Detached" },
  Aloof: { bn: "দূরত্ব বজায় রাখা", hi: "उदासीन", en: "Aloof" },
  Unpredictable: { bn: "অপ্রত্যাশিত স্বভাব", hi: "अप्रत्याशित", en: "Unpredictable" },
  Rebellious: { bn: "বিদ্রোহী মনোভাব", hi: "विद्रोही स्वभाव", en: "Rebellious" },
  Religious: { bn: "ধর্মপরায়ণ ও সাত্ত্বিক", hi: "धार्मिक व सात्विक", en: "Religious" },
  Grateful: { bn: "কৃতজ্ঞ ও শ্রদ্ধাশীল", hi: "कृतज्ञ व आभारी", en: "Grateful" },
  Superstitious: { bn: "অন্ধবিশ্বাসী মনোভাব", hi: "अंधविश्वासी", en: "Superstitious" },
  "Weak Willed": { bn: "দুর্বল ইচ্ছাশক্তি", hi: "कमजोर इच्छाशक्ति", en: "Weak Willed" },
  Timid: { bn: "ভীতু / দ্বিধাগ্রস্ত", hi: "संकोची / डरपोक", en: "Timid" },
  Depressive: { bn: "বিষাদগ্রস্ত", hi: "उदास / अवसादग्रस्त", en: "Depressive" },
};

export function translatePersonalityTrait(trait?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!trait) return "";
  const clean = trait.trim();
  return PERSONALITY_TRAITS_MAP[clean]?.[lang] || clean;
}

export function translatePersonalitySummary(summary?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!summary) return "";
  const s = summary.trim();
  const summaryMap: Record<string, Record<AstrologyLanguage, string>> = {
    "Active, spontaneous and leadership-oriented nature.": {
      bn: "সক্রিয়, স্বতঃস্ফূর্ত এবং নেতৃত্বমুখী চারিত্রিক বৈশিষ্ট্য।",
      hi: "सक्रिय, सहज और नेतृत्व-उन्मुख चारित्रिक स्वभाव।",
      en: "Active, spontaneous and leadership-oriented nature.",
    },
    "Steadfast, affectionate, seeking security and domestic aesthetic joy.": {
      bn: "দৃঢ়চেতা, স্নেহশীল, স্থিতি ও গৃহসুখ সন্ধানকারী স্বভাব।",
      hi: "दृढ़निश्चयी, स्नेही, सुरक्षा और पारिवारिक सौंदर्य सुख चाहने वाला स्वभाव।",
      en: "Steadfast, affectionate, seeking security and domestic aesthetic joy.",
    },
    "Quick-witted communicator who thrives on mental variety.": {
      bn: "প্রত্যুৎপন্নমতি যোগাযোগকারী, যিনি বহুমুখী ভাবনায় আনন্দ পান।",
      hi: "तीव्र बुद्धि संचारक जो मानसिक विविधता में आनंद पाता है।",
      en: "Quick-witted communicator who thrives on mental variety.",
    },
    "Deeply emotional, empathetic and family-centric guardian.": {
      bn: "গভীর সংবেদনশীল, সহানুভূতিশীল ও পরিবারকেন্দ্রিক অভিভাবক।",
      hi: "गहराई से भावुक, सहानुभूतिपूर्ण और परिवार-केंद्रित संरक्षक।",
      en: "Deeply emotional, empathetic and family-centric guardian.",
    },
    "Magnanimous and noble, with strong self-respect and ambition.": {
      bn: "উদার ও মহৎ স্বভাব, সাথে প্রবল আত্মমর্যাদা ও উচ্চাকাঙ্ক্ষা।",
      hi: "उदार और कुलीन स्वभाव, साथ में प्रबल आत्मसम्मान और महत्वाकांक्षा।",
      en: "Magnanimous and noble, with strong self-respect and ambition.",
    },
    "Methodical, analytical mind with strong practical service ethic.": {
      bn: "শৃঙ্খলাপরায়ণ, বিশ্লেষণধর্মী মন ও ব্যবহারিক সেবামূলক কর্মপ্রবৃত্তি।",
      hi: "व्यवस्थित, विश्लेषणात्मक मन और व्यावहारिक सेवा की प्रवृत्ति।",
      en: "Methodical, analytical mind with strong practical service ethic.",
    },
    "Seeks harmony, aesthetic balance and graceful partnership.": {
      bn: "শান্তি, নান্দনিক ভারসাম্য ও সৌহার্দ্যপূর্ণ অংশীদারিত্ব প্রত্যাশী।",
      hi: "शांति, सौंदर्य संतुलन और गरिमामय साझेदारी का आकांक्षी।",
      en: "Seeks harmony, aesthetic balance and graceful partnership.",
    },
    "Intense emotional depth, unwavering willpower and piercing insight.": {
      bn: "তীব্র অনুভূতিপ্রবণ, অটল ইচ্ছাশক্তি এবং তীক্ষ্ণ অন্তর্দৃষ্টি।",
      hi: "तीव्र भावनात्मक गहराई, अटूट इच्छाशक्ति और गहरी अंतर्दृष्टि।",
      en: "Intense emotional depth, unwavering willpower and piercing insight.",
    },
    "Seeker of truth, adventurous and candid with high ethical ideals.": {
      bn: "সত্যের সন্ধানী, দুঃসাহসিক ও স্পষ্টবাদী এবং উচ্চ নৈতিক আদর্শের অধিকারী।",
      hi: "सत्य के खोजी, साहसी, स्पष्टवादी और उच्च नैतिक आदर्शों वाले।",
      en: "Seeker of truth, adventurous and candid with high ethical ideals.",
    },
    "Unwavering perseverance, focused on societal duty and endurance.": {
      bn: "অবিচল অধ্যবসায়, সামাজিক দায়িত্ব ও সহনশীলতায় নিবেদিত।",
      hi: "अटल लगन, सामाजिक कर्तव्य और सहनशीलता पर केंद्रित स्वभाव।",
      en: "Unwavering perseverance, focused on societal duty and endurance.",
    },
    "Forward-thinking intellectual with deep egalitarian ideals.": {
      bn: "অগ্রগামী বুদ্ধিজীবী ও গভীর সমতাবাদী মানবিক আদর্শসম্পন্ন।",
      hi: "दूरदर्शी बुद्धिजीवी और गहरी समानता की भावना वाले व्यक्तित्व।",
      en: "Forward-thinking intellectual with deep egalitarian ideals.",
    },
    "Poetic and spiritual soul with boundless empathy and creative imagination.": {
      bn: "কাব্যিক ও আধ্যাত্মিক আত্মা, অফুরন্ত সহানুভূতি ও সৃজনশীল কল্পনাশক্তিসম্পন্ন।",
      hi: "काव्यात्मक व आध्यात्मिक आत्मा, असीम करुणा और सृजनशील कल्पना शक्ति।",
      en: "Poetic and spiritual soul with boundless empathy and creative imagination.",
    },
  };
  return summaryMap[s]?.[lang] || s;
}

export function translateSeverity(severity?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!severity) return "";
  const s = severity.trim();
  const map: Record<string, Record<AstrologyLanguage, string>> = {
    None: { bn: "নাই", hi: "कोई नहीं", en: "None" },
    Mild: { bn: "সামান্য", hi: "हल्का", en: "Mild" },
    Moderate: { bn: "মধ্যম", hi: "मध्यम", en: "Moderate" },
    Strong: { bn: "তীব্র", hi: "प्रबल", en: "Strong" },
    Severe: { bn: "মারাত্মক", hi: "गंभीर", en: "Severe" },
    High: { bn: "উচ্চ", hi: "उच्च", en: "High" },
    Low: { bn: "নিম্ন", hi: "निम्न", en: "Low" },
  };
  return map[s]?.[lang] || s;
}

export function translateAvakahadaAttr(attr?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!attr) return "";
  const clean = attr.trim();
  const map: Record<string, Record<AstrologyLanguage, string>> = {
    Varna: { bn: "বর্ণ (Varna)", hi: "वर्ण (Varna)", en: "Varna" },
    Vashya: { bn: "বশ্য (Vashya)", hi: "वश्य (Vashya)", en: "Vashya" },
    Tara: { bn: "তারা (Tara)", hi: "तारा (Tara)", en: "Tara" },
    Yoni: { bn: "যোনি (Yoni)", hi: "योनि (Yoni)", en: "Yoni" },
    Gana: { bn: "গণ (Gana)", hi: "गण (Gana)", en: "Gana" },
    Nadi: { bn: "নাড়ী (Nadi)", hi: "नाड़ी (Nadi)", en: "Nadi" },
    Sign: { bn: "জন্ম রাশি", hi: "जन्म राशि", en: "Moon Sign" },
    Rasi: { bn: "জন্ম রাশি", hi: "जन्म राशि", en: "Rasi" },
    "Sign Lord": { bn: "রাশি অধিপতি", hi: "राशि स्वामी", en: "Sign Lord" },
    "Rasi Lord": { bn: "রাশি অধিপতি", hi: "राशि स्वामी", en: "Rasi Lord" },
    Nakshatra: { bn: "জন্ম নক্ষত্র", hi: "जन्म नक्षत्र", en: "Nakshatra" },
    "Nakshatra Lord": { bn: "নক্ষত্র অধিপতি", hi: "नक्षत्र स्वामी", en: "Nakshatra Lord" },
    Charan: { bn: "চরণ / পদ", hi: "चरण / पद", en: "Charan / Pada" },
    Pada: { bn: "পদ", hi: "चरण", en: "Pada" },
    Karan: { bn: "করণ", hi: "करण", en: "Karan" },
    Karana: { bn: "করণ", hi: "करण", en: "Karana" },
    Yoga: { bn: "যোগ", hi: "योग", en: "Yoga" },
    Tithi: { bn: "তিথি", hi: "तिथि", en: "Tithi" },
    Tatva: { bn: "তত্ত্ব", hi: "तत्त्व", en: "Tatva (Element)" },
    Paya: { bn: "পায়া", hi: "पाया", en: "Paya" },
    "Name Alphabet": { bn: "নামের প্রথম অক্ষর", hi: "नाम का प्रथम अक्षर", en: "Name Alphabet" },
    "Sun Sign": { bn: "সূর্য রাশি", hi: "सूर्य राशि", en: "Sun Sign" },
    Ascendant: { bn: "লগ্ন (Ascendant)", hi: "लग्न", en: "Ascendant" },
    "Ascendant Lord": { bn: "লগ্ন অধিপতি", hi: "लग्न स्वामी", en: "Ascendant Lord" },
  };
  return map[clean]?.[lang] || clean;
}

export function translateAvakahadaValue(attr?: string | null, val?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!val) return "";
  const clean = val.trim();

  // Try Koota value
  const trKoota = translateKootaValue(attr, clean, lang);
  if (trKoota !== clean) return trKoota;

  // Try Tithi
  const trTithi = translateTithi(clean, lang);
  if (trTithi !== clean) return trTithi;

  // Try Karan
  const trKaran = translateKaran(clean, lang);
  if (trKaran !== clean) return trKaran;

  // Try Yoga
  const trYoga = translateYoga(clean, lang);
  if (trYoga !== clean) return trYoga;

  // Try Planet
  const trPlanet = translatePlanetName(clean, lang);
  if (trPlanet !== clean) return trPlanet;

  // Try Rashi
  const trRashi = translateRashiName(clean, lang);
  if (trRashi !== clean) return trRashi;

  // Elements (Tatva)
  const tatvaMap: Record<string, Record<AstrologyLanguage, string>> = {
    Fire: { bn: "অগ্নি তত্ত্ব", hi: "अग्नि तत्त्व", en: "Fire" },
    Earth: { bn: "পৃথিবী তত্ত্ব", hi: "पृथ्वी तत्त्व", en: "Earth" },
    Air: { bn: "বায়ু তত্ত্ব", hi: "वायु तत्त्व", en: "Air" },
    Water: { bn: "জল তত্ত্ব", hi: "जल तत्त्व", en: "Water" },
    Ether: { bn: "আকাশ তত্ত্ব", hi: "आकाश तत्त्व", en: "Ether" },
  };
  if (tatvaMap[clean]?.[lang]) return tatvaMap[clean][lang];

  // Paya (Loha, Tamra, Rupya, Swarna)
  const payaMap: Record<string, Record<AstrologyLanguage, string>> = {
    Iron: { bn: "লৌহ পায়া", hi: "लोहा पाया", en: "Iron (Loha)" },
    Loha: { bn: "লৌহ পায়া", hi: "लोहा पाया", en: "Loha" },
    Copper: { bn: "তাম্র পায়া", hi: "ताम्र पाया", en: "Copper (Tamra)" },
    Tamra: { bn: "তাম্র পায়া", hi: "ताम्र पाया", en: "Tamra" },
    Silver: { bn: "রৌপ্য পায়া", hi: "रजत/चांदी पाया", en: "Silver (Rupya)" },
    Rupya: { bn: "রৌপ্য পায়া", hi: "रजत/चांदी पाया", en: "Rupya" },
    Gold: { bn: "স্বর্ণ পায়া", hi: "स्वर्ण पाया", en: "Gold (Swarna)" },
    Swarna: { bn: "স্বর্ণ পায়া", hi: "स्वर्ण पाया", en: "Swarna" },
  };
  if (payaMap[clean]?.[lang]) return payaMap[clean][lang];

  return toLocalizedDigits(clean, lang);
}

export function translateDoshaName(name?: string | null, lang: AstrologyLanguage = "en"): string {
  if (!name) return "";
  const clean = name.trim();
  const map: Record<string, Record<AstrologyLanguage, string>> = {
    "Manglik Dosha": { bn: "মাঙ্গলিক দোষ (কুজ দোষ)", hi: "मांगलिक दोष (कुज दोष)", en: "Manglik Dosha" },
    "Kuja Dosha": { bn: "কুজ দোষ (মাঙ্গলিক)", hi: "कुज दोष (मांगलिक)", en: "Kuja Dosha" },
    "Nadi Dosha": { bn: "নাড়ী দোষ", hi: "नाड़ी दोष", en: "Nadi Dosha" },
    "Bhakoot Dosha": { bn: "ভকূট দোষ", hi: "भकूट दोष", en: "Bhakoot Dosha" },
    "Bhakut Dosha": { bn: "ভকূট দোষ", hi: "भकूट दोष", en: "Bhakut Dosha" },
    "Gana Dosha": { bn: "গণ দোষ", hi: "गण दोष", en: "Gana Dosha" },
    "Gan Dosha": { bn: "গণ দোষ", hi: "गण दोष", en: "Gan Dosha" },
    "Rajju Dosha": { bn: "রজ্জু দোষ", hi: "रज्जु दोष", en: "Rajju Dosha" },
    "Rajjoo Dosha": { bn: "রজ্জু দোষ", hi: "रज्जु दोष", en: "Rajjoo Dosha" },
    "Vedha Dosha": { bn: "বেধ দোষ", hi: "वेध दोष", en: "Vedha Dosha" },
    "Graha Maitri Dosha": { bn: "গ্রহ মৈত্রী দোষ", hi: "ग्रह मैत्री दोष", en: "Graha Maitri Dosha" },
  };
  return map[clean]?.[lang] || clean;
}
