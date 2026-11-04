import type { AstrologyLanguage } from "@/types";

export interface TarotTranslations {
  badge: string;
  title: string;
  subtitle: string;
  featureDisabled: string;
  coinsDeducted: (coins: number) => string;

  // Tabs / Steps
  stepChooseSpread: string;
  stepAskQuestion: string;
  stepDrawCards: string;
  stepInterpretation: string;
  tabDeckExplorer: string;

  // Spreads
  spreadDaily: string;
  spreadDailyDesc: string;
  spreadTimeline: string;
  spreadTimelineDesc: string;
  spreadTwoChoices: string;
  spreadTwoChoicesDesc: string;
  spreadLove: string;
  spreadLoveDesc: string;
  spreadCareer: string;
  spreadCareerDesc: string;
  spreadCeltic: string;
  spreadCelticDesc: string;

  // Categories
  catGeneral: string;
  catLove: string;
  catCareer: string;
  catFinance: string;
  catSpiritual: string;

  // Form
  questionLabel: string;
  questionPlaceholder: string;
  moonSignLabel: string;
  moonSignPlaceholder: string;
  dashaLordLabel: string;
  dashaLordPlaceholder: string;
  selectSpreadBtn: string;
  startDrawBtn: string;
  shuffleDeckBtn: string;
  autoPickBtn: string;
  flipAllBtn: string;
  pickCardPrompt: (remaining: number, total: number) => string;
  cardsReadyPrompt: string;
  revealReadingBtn: string;

  // Results
  readingTitle: string;
  readingSubtitle: string;
  karmicSynthesisTitle: string;
  actionableGuidanceTitle: string;
  prescribedRemedyTitle: string;
  vedicMantraTitle: string;
  elementalBreakdownTitle: string;
  dominantElementLabel: string;
  karmicMomentumLabel: string;
  uprightBadge: string;
  reversedBadge: string;
  copySummaryBtn: string;
  copiedToast: string;
  newReadingBtn: string;
  bookAstrologerCta: string;
  bookAstrologerDesc: string;
  consultNowBtn: string;
}

export const TAROT_I18N: Record<AstrologyLanguage, TarotTranslations> = {
  en: {
    badge: "Divine Chrono-Astrological Arcana",
    title: "Tarot Card Reading & Vedic Oracle",
    subtitle:
      "Unlock deep subconscious wisdom with canonical 78-card Tarot synchronized with planetary Dashas, elemental dignities, and Vedic remedial mantras.",
    featureDisabled: "Tarot Reading feature is temporarily unavailable.",
    coinsDeducted: (c: number) => `${c} coins deducted for authentic Tarot reading.`,

    stepChooseSpread: "1. Select Spread",
    stepAskQuestion: "2. Set Intention",
    stepDrawCards: "3. Interactive Draw",
    stepInterpretation: "4. Divine Oracle",
    tabDeckExplorer: "78 Arcana Deck",

    spreadDaily: "Card of the Day",
    spreadDailyDesc: "Single card divine snapshot illuminating today's dominant cosmic vibration and mindset.",
    spreadTimeline: "Past – Present – Future",
    spreadTimelineDesc: "The classic tripartite timeline unveiling root genesis, current vortex, and unfolding horizon.",
    spreadTwoChoices: "Two Choices Crossroad",
    spreadTwoChoicesDesc: "Dual-path comparative oracle clarifying the cosmic outcome of Option A versus Option B.",
    spreadLove: "Love & Soulmate Mirror",
    spreadLoveDesc: "Deep relationship audit exploring mutual feelings, subconscious blocks, and future union.",
    spreadCareer: "Career & Wealth Pathway",
    spreadCareerDesc: "Professional trajectory, hidden financial opportunities, obstacles, and breakthrough advice.",
    spreadCeltic: "The Grand Celtic Cross",
    spreadCelticDesc: "The ultimate 10-card sovereign deep dive unveiling root causes, hopes, fears, and karmic culmination.",

    catGeneral: "General Life",
    catLove: "Love & Union",
    catCareer: "Career & Mission",
    catFinance: "Wealth & Finance",
    catSpiritual: "Spiritual Path",

    questionLabel: "Your Question or Sacred Intention",
    questionPlaceholder: "e.g. What energy will surround my career breakthrough in the coming months?",
    moonSignLabel: "Your Moon Sign (Rashi - Optional)",
    moonSignPlaceholder: "e.g. Aries, Taurus, Cancer...",
    dashaLordLabel: "Active Dasha Lord (Optional)",
    dashaLordPlaceholder: "e.g. Jupiter (Guru), Venus (Shukra), Sun (Surya)...",
    selectSpreadBtn: "Select This Spread",
    startDrawBtn: "Proceed to Shuffle & Draw",
    shuffleDeckBtn: "Shuffle Celestial Deck",
    autoPickBtn: "Intuitive Auto-Draw",
    flipAllBtn: "Flip All Cards",
    pickCardPrompt: (rem, tot) => `Select ${rem} more card${rem > 1 ? "s" : ""} from the celestial deck (${tot - rem}/${tot} chosen)`,
    cardsReadyPrompt: "All cards selected! Tap below to reveal the cosmic reading.",
    revealReadingBtn: "Reveal Divine Reading",

    readingTitle: "Sacred Tarot Interpretation",
    readingSubtitle: "Holistic synthesis of archetype symbols, elemental dignities, and planetary resonances.",
    karmicSynthesisTitle: "Karmic Destiny Synthesis",
    actionableGuidanceTitle: "Actionable Guidance & Strategy",
    prescribedRemedyTitle: "Prescribed Astrological Remedy",
    vedicMantraTitle: "Sacred Vedic Graha Mantra",
    elementalBreakdownTitle: "Elemental Balance & Dignities",
    dominantElementLabel: "Dominant Element",
    karmicMomentumLabel: "Karmic Destiny Momentum",
    uprightBadge: "Upright (জাগ্রত)",
    reversedBadge: "Reversed (অন্তর্মুখী)",
    copySummaryBtn: "Copy Reading Summary",
    copiedToast: "Tarot summary copied to clipboard!",
    newReadingBtn: "Perform Another Reading",
    bookAstrologerCta: "Seek Deeper Personalized Guidance",
    bookAstrologerDesc: "Connect live with certified Tarot Grandmasters and Vedic Astrologers to dive deeper into your spread.",
    consultNowBtn: "Consult Live Astrologer",
  },

  bn: {
    badge: "মহাজাগতিক ক্রোনো-অ্যাস্ট্রোলজিক্যাল ট্যারো ওরাকল",
    title: "ট্যারো কার্ড রিডিং ও বৈদিক ভবিষ্যৎবাণী",
    subtitle:
      "৭৮টি প্রামাণ্য ট্যারো আর্খানা, গ্রহগত দশা সংযোগ, পঞ্চভূত ভারসাম্য এবং বৈদিক প্রতিকার মন্ত্রের সমন্বয়ে সর্বোচ্চ নির্ভুল আধ্যাত্মিক পথনির্দেশিকা।",
    featureDisabled: "ট্যারো রিডিং ফিচারটি সাময়িকভাবে বন্ধ আছে।",
    coinsDeducted: (c: number) => `ট্যারো রিডিংয়ের জন্য ${c} কয়েন খরচ হয়েছে।`,

    stepChooseSpread: "১. স্প্রেড নির্বাচন",
    stepAskQuestion: "২. প্রশ্ন ও সংকল্প",
    stepDrawCards: "৩. কার্ড ড্র করুন",
    stepInterpretation: "৪. পূর্ণাঙ্গ ফলাফল",
    tabDeckExplorer: "৭৮টি কার্ড প্রদর্শনী",

    spreadDaily: "আজকের নির্দেশক কার্ড",
    spreadDailyDesc: "দৈনন্দিন একক কার্ডের মাধ্যমে জানুন আজকের দিনের মুখ্য মহাজাগতিক শক্তি ও শুভ প্রেরণা।",
    spreadTimeline: "অতীত – বর্তমান – ভবিষ্যৎ",
    spreadTimelineDesc: "ত্রিমাত্রিক স্প্রেড—সমস্যার অতীত মূল কারণ, বর্তমান অবস্থা এবং ভবিষ্যৎ পরিণতি প্রকাশ করে।",
    spreadTwoChoices: "দ্বিধা ও দুই পথ স্প্রেড",
    spreadTwoChoicesDesc: "জীবনের গুরুত্বপূর্ণ দুটি সিদ্ধান্তের মধ্যে কোন পথটি আপনার জন্য শুভ তা নিরূপণ করুন।",
    spreadLove: "প্রেম ও জীবনসঙ্গী দর্পণ",
    spreadLoveDesc: "সম্পর্কের গভীর অনুভূতি, মানসিক বাধা এবং মিলনের ভবিষ্যৎ সম্ভাবনার পূর্ণ চিত্র।",
    spreadCareer: "কর্মজীবন ও ধনসম্পদ পথ",
    spreadCareerDesc: "পেশাগত অগ্রগতি, আর্থিক সুযোগ, কর্মক্ষেত্রের শত্রুতা ও সাফল্যের সঠিক পদক্ষেপ।",
    spreadCeltic: "১০-কার্ড সেল্টিক ক্রস স্প্রেড",
    spreadCelticDesc: "ট্যারো শাস্ত্রের সবচেয়ে শক্তিশালী ও গভীর স্প্রেড—আপনার ভাগ্যের আদ্যোপান্ত উন্মোচন করে।",

    catGeneral: "সার্বিক জীবন",
    catLove: "প্রেম ও সম্পর্ক",
    catCareer: "কর্ম ও জীবিকা",
    catFinance: "অর্থ ও সম্পত্তি",
    catSpiritual: "আধ্যাত্মিক সাধনা",

    questionLabel: "আপনার প্রশ্ন বা পবিত্র সংকল্প",
    questionPlaceholder: "যেমন: আগামী ৩ মাসে আমার নতুন ব্যবসা বা চাকরির সুযোগ কেমন হবে?",
    moonSignLabel: "আপনার চন্দ্র রাশি (ঐচ্ছিক)",
    moonSignPlaceholder: "যেমন: মেষ, বৃষ, মিথুন, কর্কট, সিংহ...",
    dashaLordLabel: "বর্তমান মহাদশা অধিপতি (ঐচ্ছিক)",
    dashaLordPlaceholder: "যেমন: বৃহস্পতি (গুরু), শুক্র, শনি, রবি...",
    selectSpreadBtn: "এই স্প্রেডটি বেছে নিন",
    startDrawBtn: "কার্ড শাফেল ও ড্র করতে এগিয়ে যান",
    shuffleDeckBtn: "কার্ডগুলো শাফেল করুন",
    autoPickBtn: "স্বয়ংক্রিয় মহাজাগতিক ড্র",
    flipAllBtn: "সবগুলো কার্ড উন্মোচন করুন",
    pickCardPrompt: (rem, tot) => `ডেক থেকে আরও ${rem}টি কার্ড স্পর্শ করে বেছে নিন (${tot - rem}/${tot} নির্বাচিত)`,
    cardsReadyPrompt: "সব কার্ড নির্বাচন সম্পন্ন! ফলাফল দেখতে নিচে চাপুন।",
    revealReadingBtn: "ঐশ্বরিক ফলাফল উন্মোচন করুন",

    readingTitle: "ট্যারো কার্ডের পবিত্র ফলাফল ও ব্যাখ্যা",
    readingSubtitle: "কার্ডের প্রতীকী তত্ত্ব, পঞ্চভূত সমীকরণ এবং বৈদিক গ্রহের নিখুঁত সমন্বয়।",
    karmicSynthesisTitle: "কার্মিক পরিণতির সারসংক্ষেপ",
    actionableGuidanceTitle: "করণীয় কৌশল ও সতর্কবার্তা",
    prescribedRemedyTitle: "শাস্ত্রীয় বৈদিক প্রতিকার",
    vedicMantraTitle: "পবিত্র বৈদিক গ্রহ মন্ত্র",
    elementalBreakdownTitle: "পঞ্চভূত ভারসাম্য ও প্রভাব",
    dominantElementLabel: "প্রধান উপাদান (তত্ত্ব)",
    karmicMomentumLabel: "ভাগ্যের গতির তীব্রতা",
    uprightBadge: "সোজা (উজ্জ্বল শক্তি)",
    reversedBadge: "উল্টো (অন্তর্মুখী রূপান্তর)",
    copySummaryBtn: "ফলাফল কপি করুন",
    copiedToast: "ট্যারো পাঠের সারাংশ ক্লিপবোর্ডে কপি করা হয়েছে!",
    newReadingBtn: "নতুন ট্যারো পাঠ শুরু করুন",
    bookAstrologerCta: "আরও গভীর ব্যক্তিগত বিশ্লেষণ প্রয়োজন?",
    bookAstrologerDesc: "আমাদের অভিজ্ঞ ট্যারো গ্র্যান্ডমাস্টার এবং জ্যোতিষীদের সাথে সরাসরি লাইভ কথা বলুন।",
    consultNowBtn: "অভিজ্ঞ জ্যোতিষীর সাথে কথা বলুন",
  },

  hi: {
    badge: "दिव्य क्रोनो-एस्ट्रोलॉजिकल टैरो ऑरेकल",
    title: "टैरो कार्ड रीडिंग एवं वैदिक भविष्यकथन",
    subtitle:
      "78 प्रामाणिक टैरो आर्काना, ग्रहीय दशा, पंचतत्व संतुलन और वैदिक निवारक मंत्रों के साथ विश्वस्तरीय अचूक मार्गदर्शन।",
    featureDisabled: "टैरो रीडिंग सुविधा अस्थायी रूप से अनुपलब्ध है।",
    coinsDeducted: (c: number) => `टैरो रीडिंग के लिए ${c} सिक्के काटे गए।`,

    stepChooseSpread: "1. स्प्रेड चुनें",
    stepAskQuestion: "2. प्रश्न व संकल्प",
    stepDrawCards: "3. कार्ड ड्रा करें",
    stepInterpretation: "4. दिव्य फलादेश",
    tabDeckExplorer: "78 कार्ड संग्रह",

    spreadDaily: "आज का प्रेरक कार्ड",
    spreadDailyDesc: "दैनिक एकल कार्ड से जानें आज के दिन की प्रमुख ब्रह्मांडीय ऊर्जा और शुभ विचार।",
    spreadTimeline: "भूत – वर्तमान – भविष्य",
    spreadTimelineDesc: "तीन-कार्ड स्प्रेड—अतीत की जड़ें, वर्तमान परिस्थिति और भविष्य की दिशा स्पष्ट करता है।",
    spreadTwoChoices: "दो विकल्प चौराहा स्प्रेड",
    spreadTwoChoicesDesc: "जीवन के दो अहम विकल्पों में से आपके लिए कौन सा मार्ग श्रेष्ठ है, यह जानें।",
    spreadLove: "प्रेम व जीवनसाथी दर्पण",
    spreadLoveDesc: "संबंधों की वास्तविक भावनाएं, आंतरिक बाधाएं और मिलन का भविष्य।",
    spreadCareer: "करियर व धन मार्ग",
    spreadCareerDesc: "व्यावसायिक उन्नति, आर्थिक अवसर, कार्यक्षेत्र की चुनौतियां और सफलता की रणनीति।",
    spreadCeltic: "10-कार्ड सेल्टिक क्रॉस",
    spreadCelticDesc: "टैरो का सबसे विस्तृत और शक्तिशाली स्प्रेड—भाग्य के हर पहलू को उजागर करता है।",

    catGeneral: "सामान्य जीवन",
    catLove: "प्रेम व संबंध",
    catCareer: "करियर व आजीविका",
    catFinance: "धन व संपत्ति",
    catSpiritual: "आध्यात्मिक मार्ग",

    questionLabel: "आपका प्रश्न या पवित्र संकल्प",
    questionPlaceholder: "जैसे: आने वाले महीनों में मेरे करियर या व्यापार में क्या बदलाव होंगे?",
    moonSignLabel: "आपकी चंद्र राशि (वैकल्पिक)",
    moonSignPlaceholder: "जैसे: मेष, वृषभ, मिथुन, कर्क, सिंह...",
    dashaLordLabel: "सक्रिय दशा स्वामी (वैकल्पिक)",
    dashaLordPlaceholder: "जैसे: गुरु (बृहस्पति), शुक्र, सूर्य, शनि...",
    selectSpreadBtn: "यह स्प्रेड चुनें",
    startDrawBtn: "शफ़ल व कार्ड चयन की ओर बढ़ें",
    shuffleDeckBtn: "कार्ड शफ़ल करें",
    autoPickBtn: "स्वतः ब्रह्मांडीय चयन",
    flipAllBtn: "सभी कार्ड प्रकट करें",
    pickCardPrompt: (rem, tot) => `डेक से और ${rem} कार्ड स्पर्श करके चुनें (${tot - rem}/${tot} चयनित)`,
    cardsReadyPrompt: "सभी कार्ड चुन लिए गए हैं! फलादेश देखने के लिए नीचे क्लिक करें।",
    revealReadingBtn: "दिव्य फलादेश देखें",

    readingTitle: "टैरो कार्ड का पवित्र फलादेश",
    readingSubtitle: "प्रतीकात्मक अर्थ, पंचतत्व संतुलन और वैदिक ग्रहों का संपूर्ण समन्वय।",
    karmicSynthesisTitle: "कार्मिक नियति का सार",
    actionableGuidanceTitle: "सटीक रणनीति व मार्गदर्शन",
    prescribedRemedyTitle: "वैदिक ज्योतिषीय उपाय",
    vedicMantraTitle: "पवित्र वैदिक ग्रह मंत्र",
    elementalBreakdownTitle: "पंचतत्व संतुलन",
    dominantElementLabel: "प्रमुख तत्व",
    karmicMomentumLabel: "कार्मिक प्रभाव की तीव्रता",
    uprightBadge: "सीधा (सकारात्मक ऊर्जा)",
    reversedBadge: "उल्टा (आंतरिक रूपांतरण)",
    copySummaryBtn: "फलादेश कॉपी करें",
    copiedToast: "टैरो फलादेश क्लिपबोर्ड पर कॉपी हो गया!",
    newReadingBtn: "नया टैरो पठन शुरू करें",
    bookAstrologerCta: "और अधिक व्यक्तिगत मार्गदर्शन चाहिए?",
    bookAstrologerDesc: "हमारे प्रमाणित टैरो ग्रैंडमास्टर्स और वैदिक ज्योतिषियों से तुरंत लाइव परामर्श लें।",
    consultNowBtn: "ज्योतिषी से लाइव बात करें",
  },
};
