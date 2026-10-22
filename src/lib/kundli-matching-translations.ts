/**
 * Complete Multilingual Localization (bn, hi, en) for Kundli Matching (36 Gun Milan / Ashtakoot).
 * Strictly conforms to client resource specifications and Vedic Astrological benchmarks.
 */

import type { AstrologyLanguage } from "@/types";

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
    planetDetails: string;
    lagnaCharts: string;
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
}

export const KUNDLI_MATCHING_STRINGS: Record<AstrologyLanguage, KundliMatchingTranslations> = {
  bn: {
    pageTitle: "কুন্ডলী মিলন (৩৬ গুণ বিচার)",
    pageSubtitle:
      "কুন্ডলী মিলন বা যোটক বিচার হলো একটি প্রাচীন বৈদিক জ্যোতিষ বিজ্ঞান, যা বর ও কনের গ্রহাবস্থান ও অষ্টকূট (৩৬ গুণ) বিচার করে দাম্পত্য জীবনের সুখ, স্বাস্থ্য, মানসিক ঐক্য ও বংশবৃদ্ধির সামঞ্জস্য নির্ধারণ করে।",
    step1Title: "১. বরের বিবরণ লিখুন ♂",
    step2Title: "২. কনের বিবরণ লিখুন ♀",
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
      dosha: "দোষ ও অষ্টকূট",
      planetDetails: "গ্রহের অবস্থান",
      lagnaCharts: "লগ্ন কুন্ডলী",
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
      fullNamePlaceholder: "উদা: সমীরণ সামন্ত",
      dobLabel: "জন্ম তারিখ (দিন-মাস-বছর)",
      dayPlaceholder: "দিন (DD)",
      monthPlaceholder: "মাস (MM)",
      yearPlaceholder: "বছর (YYYY)",
      tobLabel: "জন্ম সময় (ঘন্টা:মিনিট:সেকেন্ড AM/PM)",
      hourPlaceholder: "ঘন্টা (HH)",
      minutePlaceholder: "মিনিট (MM)",
      secondPlaceholder: "সেকেন্ড (SS)",
      placeLabel: "জন্মস্থান (শহর / রাজ্য / দেশ)",
      placePlaceholder: "উদা: Kolkata, WB, India",
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
  },

  hi: {
    pageTitle: "कुंडली मिलान (३६ गुण मिलान)",
    pageSubtitle:
      "कुंडली मिलान या गुण मिलान एक प्राचीन वैदिक ज्योतिष विज्ञान है जो वर और वधू की जन्म कुंडली का तुलनात्मक विश्लेषण कर सुखी, समृद्ध और सामंजस्यपूर्ण वैवाहिक जीवन का मार्गदर्शन करता है।",
    step1Title: "१. वर का विवरण दर्ज करें ♂",
    step2Title: "२. वधू का विवरण दर्ज करें ♀",
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
      dosha: "दोष व अष्टकूट",
      planetDetails: "ग्रह स्थिति",
      lagnaCharts: "लग्न कुंडली",
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
      fullNamePlaceholder: "उदा: समिरन सामंत",
      dobLabel: "जन्म तिथि (दिन-माह-वर्ष)",
      dayPlaceholder: "दिन (DD)",
      monthPlaceholder: "माह (MM)",
      yearPlaceholder: "वर्ष (YYYY)",
      tobLabel: "जन्म समय (घंटा:मिनट:सेकंड AM/PM)",
      hourPlaceholder: "घंटा (HH)",
      minutePlaceholder: "मिनट (MM)",
      secondPlaceholder: "सेकंड (SS)",
      placeLabel: "जन्म स्थान (शहर / राज्य / देश)",
      placePlaceholder: "उदा: Kolkata, WB, India",
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
  },

  en: {
    pageTitle: "Kundli Matching (36 Gun Milan)",
    pageSubtitle:
      "Kundli Matching or Horoscope Matching is an ancient Vedic science comparing the planetary positions of the prospective bride and groom to evaluate lifelong harmony, mutual health, spiritual affinity, and prosperous marital union.",
    step1Title: "1. Enter Groom's Details ♂",
    step2Title: "2. Enter Bride's Details ♀",
    nextStepButton: "Next: Bride's details ♀",
    backButton: "Back",
    matchButton: "Match Your Kundli ➔",
    recalculateButton: "New Match / Recalculate",
    downloadPdfButton: "Print / Save Report",

    groomTitle: "Groom Details (Male Details)",
    brideTitle: "Bride Details (Female Details)",
    groomLabel: "Groom",
    brideLabel: "Bride",
    ringsBanner: "Wedding Horoscope Compatibility",

    basicDetailsTitle: "Basic Astrological Details",
    name: "Name",
    birthDateTime: "Birth Date & Time",
    birthPlace: "Birth Place",
    janamRashi: "Janam Rashi",
    rashiLord: "Rashi Lord",
    janamNakshatra: "Janam Nakshatra",
    nakshatraLord: "Nakshatra Lord",
    pada: "Pada",

    manglikBannerPrefixBoy: "The Boy is",
    manglikBannerPrefixGirl: "The Girl is",
    isManglik: "a Manglik",
    isNotManglik: "Not a Manglik",

    tabs: {
      dosha: "Dosha",
      planetDetails: "Planet Details",
      lagnaCharts: "Lagna Charts",
    },

    metricCards: {
      ashtakootTitle: "Ashtakoot",
      rajjooDoshaTitle: "Rajjoo Dosha",
      vedhaDoshaTitle: "Vedha Dosha",
      manglikMatchTitle: "Manglik Match",
      yes: "Yes",
      no: "No",
      outOf: "Out of",
    },

    pointsTable: {
      title: "Match Ashtakoot Points",
      subtitle: "Detailed 36 Gunas breakdown based on Vedic Muhurta Chintamani",
      colAttribute: "Attribute",
      colMale: "Male",
      colFemale: "Female",
      colOutOf: "Out of",
      colReceived: "Received",
      colAreaOfLife: "Area Of Life",
      totalLabel: "Total Points",
      overallCompatibility: "Overall Compatibility",
    },

    attributes: {
      Varna: {
        name: "Varna",
        areaOfLife: "Natural Refinement / Work",
        description: "Assesses ego compatibility, work ethics, and mutual spiritual disposition.",
      },
      Vashya: {
        name: "Vashya",
        areaOfLife: "Innate Giving / Attraction towards each other",
        description: "Indicates reciprocal emotional magnetic attraction, mutual devotion, and control balance.",
      },
      Tara: {
        name: "Tara",
        areaOfLife: "Comfort - Prosperity - Health",
        description: "Measures health harmony, physical longevity, and fortune bestowed on the couple.",
      },
      Yoni: {
        name: "Yoni",
        areaOfLife: "Intimate Physical",
        description: "Reflects biological intimacy, sensual compatibility, and physical mutual harmony.",
      },
      Maitri: {
        name: "Maitri",
        areaOfLife: "Friendship",
        description: "Shows intellectual alignment, friendship, emotional understanding, and mutual respect.",
      },
      Gan: {
        name: "Gan",
        areaOfLife: "Temperament",
        description: "Evaluates behavioral temperament, psychological constitution, and household harmony.",
      },
      Bhakut: {
        name: "Bhakut",
        areaOfLife: "Constructive Ability / Constructivism / Society and Couple",
        description: "Analyzes financial stability, domestic prosperity, and lifelong joint growth.",
      },
      Nadi: {
        name: "Nadi",
        areaOfLife: "Progeny / Excess",
        description: "Most vital indicator for genetic health, progeny well-being, nervous harmony, and longevity.",
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
      fullNamePlaceholder: "e.g. Samiran Samanta",
      dobLabel: "Birth Date (Day-Month-Year)",
      dayPlaceholder: "Day (DD)",
      monthPlaceholder: "Month (MM)",
      yearPlaceholder: "Year (YYYY)",
      tobLabel: "Birth Time (HH:MM:SS AM/PM)",
      hourPlaceholder: "HH",
      minutePlaceholder: "MM",
      secondPlaceholder: "SS",
      placeLabel: "Birth Place (City / State / Country)",
      placePlaceholder: "e.g. Kolkata, WB, India",
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
  },
};
