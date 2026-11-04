import type { AstrologyLanguage } from "@/types";

export interface SpreadMetaI18n {
  id: string;
  name: string;
  description: string;
  ideal_for: string;
  card_count: number;
}

export const SPREADS_METADATA_I18N: Record<AstrologyLanguage, Record<string, SpreadMetaI18n>> = {
  en: {
    daily_guidance: {
      id: "daily_guidance",
      name: "Card of the Day",
      description: "Daily single-card divine reflection illuminating your prevailing cosmic atmosphere, key challenge, and actionable blessing.",
      ideal_for: "Morning contemplation, daily meditation, or quick focal clarity.",
      card_count: 1,
    },
    past_present_future: {
      id: "past_present_future",
      name: "Past – Present – Future",
      description: "The classic tripartite timeline showing the karmic genesis of your situation, its present manifestation, and where the momentum leads.",
      ideal_for: "General life questions, situational audits, understanding the flow of events.",
      card_count: 3,
    },
    two_choices: {
      id: "two_choices",
      name: "Two Choices Crossroad",
      description: "Invaluable spread when torn between two job offers, two partners, or two major life directions.",
      ideal_for: "Decision-making, career crossroads, relocation choices, or strategic dilemmas.",
      card_count: 4,
    },
    love_soulmate: {
      id: "love_soulmate",
      name: "Love & Soulmate Mirror",
      description: "Deep relationship audit exploring mutual feelings, subconscious blocks, and future union.",
      ideal_for: "Romantic relationships, marriage prospects, healing relationship misunderstandings.",
      card_count: 5,
    },
    career_wealth: {
      id: "career_wealth",
      name: "Career & Wealth Pathway",
      description: "Professional trajectory, hidden financial opportunities, obstacles, and breakthrough advice.",
      ideal_for: "Career transitions, new investments, business launches, promotion guidance.",
      card_count: 5,
    },
    celtic_cross: {
      id: "celtic_cross",
      name: "The Grand Celtic Cross",
      description: "The ultimate 10-card sovereign deep dive unveiling root causes, hopes, fears, and karmic culmination.",
      ideal_for: "Comprehensive life audits, momentous turning points, deep spiritual awakening.",
      card_count: 10,
    },
  },

  bn: {
    daily_guidance: {
      id: "daily_guidance",
      name: "আজকের নির্দেশক কার্ড",
      description: "দৈনন্দিন একক কার্ডের মাধ্যমে জানুন আজকের দিনের মুখ্য মহাজাগতিক শক্তি, মূল চ্যালেঞ্জ এবং শুভ আশীর্বাদ।",
      ideal_for: "প্রাতঃকালীন ধ্যান, দৈনিক নির্দেশনা বা দ্রুত মানসিক স্বচ্ছতা লাভ।",
      card_count: 1,
    },
    past_present_future: {
      id: "past_present_future",
      name: "অতীত – বর্তমান – ভবিষ্যৎ",
      description: "ক্লাসিক্যাল ত্রিমাত্রিক টাইমলাইন—পরিস্থিতির অতীত মূল ভিত্তি, বর্তমান আবর্তন এবং ভবিষ্যৎ সম্ভাবনাময় পরিণতির প্রবাহ।",
      ideal_for: "জীবনের সাধারণ প্রশ্নাবলী, পরিস্থিতির গভীর নিরীক্ষণ ও ঘটনাবলির গতিবিধি উপলব্ধি।",
      card_count: 3,
    },
    two_choices: {
      id: "two_choices",
      name: "দ্বিধা ও দুই পথ স্প্রেড",
      description: "জীবনের গুরুত্বপূর্ণ দুটি সিদ্ধান্তের মধ্যে (বিকল্প ক বনাম বিকল্প খ) কোনটি আপনার জন্য পরম কল্যাণকর তা নিরূপণ করুন।",
      ideal_for: "সিদ্ধান্তহীনতা, কর্মজীবন বা সম্পর্কের গুরুত্বপূর্ণ সন্ধিক্ষণ।",
      card_count: 4,
    },
    love_soulmate: {
      id: "love_soulmate",
      name: "প্রেম ও জীবনসঙ্গী দর্পণ",
      description: "সম্পর্কের গভীর অনুভূতি, মানসিক বাধা, অন্তরের আকুলতা এবং মিলনের ভবিষ্যৎ সম্ভাবনার পূর্ণ প্রতিচ্ছবি।",
      ideal_for: "প্রেম, বৈবাহিক বোঝাপড়া ও আন্তরিক সম্পর্কের গভীর মানসিক নিরীক্ষণ।",
      card_count: 5,
    },
    career_wealth: {
      id: "career_wealth",
      name: "কর্মজীবন ও ধনসম্পদ পথ",
      description: "পেশাগত অগ্রগতি, গোপন আর্থিক সুযোগ, কর্মক্ষেত্রের লুকানো বাধা ও সাফল্যের সঠিক কৌশল।",
      ideal_for: "চাকরি, ব্যবসা, পদোন্নতি, নতুন বিনিয়োগ ও অর্থনৈতিক সমৃদ্ধি।",
      card_count: 5,
    },
    celtic_cross: {
      id: "celtic_cross",
      name: "১০-কার্ড সেল্টিক ক্রস স্প্রেড",
      description: "ট্যারো শাস্ত্রের সবচেয়ে সম্মানিত ও গভীর স্প্রেড—আপনার ভাগ্যের আদ্যোপান্ত ও কার্মিক পরিণতি উন্মোচন করে।",
      ideal_for: "জটিল জীবনের মোড়, দীর্ঘমেয়াদী ভাগ্যচক্র ও গভীর আত্মিক রূপান্তর।",
      card_count: 10,
    },
  },

  hi: {
    daily_guidance: {
      id: "daily_guidance",
      name: "आज का प्रेरक कार्ड",
      description: "दैनिक एकल कार्ड से जानें आज के दिन की प्रमुख ब्रह्मांडीय ऊर्जा, चुनौती और शुभ आशीष।",
      ideal_for: "प्रातःकालीन ध्यान, दैनिक मार्गदर्शन या त्वरित मानसिक स्पष्टता।",
      card_count: 1,
    },
    past_present_future: {
      id: "past_present_future",
      name: "भूत – वर्तमान – भविष्य",
      description: "तीन-कार्ड क्लासिक स्प्रेड—अतीत की जड़ें, वर्तमान परिस्थिति और भविष्य की दिशा स्पष्ट करता है।",
      ideal_for: "सामान्य जीवन प्रश्न, परिस्थिति का सटीक विश्लेषण और घटनाओं का प्रवाह।",
      card_count: 3,
    },
    two_choices: {
      id: "two_choices",
      name: "दो विकल्प चौराहा",
      description: "जीवन के दो अहम विकल्पों (विकल्प क बनाम विकल्प ख) में से कौन सा मार्ग श्रेष्ठ है, यह जानें।",
      ideal_for: "निर्णय लेने में असमंजस, करियर या रिश्तों का अहम मोड़।",
      card_count: 4,
    },
    love_soulmate: {
      id: "love_soulmate",
      name: "प्रेम व जीवनसाथी दर्पण",
      description: "संबंधों की वास्तविक भावनाएं, आंतरिक बाधाएं और मिलन का भविष्य।",
      ideal_for: "प्रेम संबंध, विवाह की संभावना और आपसी समझ।",
      card_count: 5,
    },
    career_wealth: {
      id: "career_wealth",
      name: "करियर व धन मार्ग",
      description: "व्यावसायिक उन्नति, अप्रत्याशित वित्तीय अवसर, कार्यक्षेत्र की चुनौतियां और सफलता की रणनीति।",
      ideal_for: "नौकरी परिवर्तन, नया व्यापार, पदोन्नति और धन लाभ।",
      card_count: 5,
    },
    celtic_cross: {
      id: "celtic_cross",
      name: "10-कार्ड सेल्टिक क्रॉस",
      description: "टैरो का सबसे विस्तृत और शक्तिशाली स्प्रेड—भाग्य के हर पहलू को उजागर करता है।",
      ideal_for: "महत्वपूर्ण जीवन परिवर्तन, दीर्घकालिक भाग्य और आध्यात्मिक जागरण।",
      card_count: 10,
    },
  },
};

export const CARD_NAMES_LOCALIZED: Record<AstrologyLanguage, Record<string, string>> = {
  en: {
    the_fool: "The Fool",
    the_magician: "The Magician",
    the_high_priestess: "The High Priestess",
    the_empress: "The Empress",
    the_emperor: "The Emperor",
    the_hierophant: "The Hierophant",
    the_lovers: "The Lovers",
    the_chariot: "The Chariot",
    strength: "Strength",
    the_hermit: "The Hermit",
    wheel_of_fortune: "Wheel of Fortune",
    justice: "Justice",
    the_hanged_man: "The Hanged Man",
    death: "Death",
    temperance: "Temperance",
    the_devil: "The Devil",
    the_tower: "The Tower",
    the_star: "The Star",
    the_moon: "The Moon",
    the_sun: "The Sun",
    judgement: "Judgement",
    the_world: "The World",
  },
  bn: {
    the_fool: "দ্য ফুল (অবোধ পরিব্রাজক)",
    the_magician: "দ্য ম্যাজিশিয়ান (মায়াবী সাধক)",
    the_high_priestess: "দ্য হাই প্রিস্টেস (রহস্যময়ী দেবী)",
    the_empress: "দ্য এমপ্রেস (মাতৃরূপিণী প্রকৃতি)",
    the_emperor: "দ্য এম্পেরর (সার্বভৌম শাসক)",
    the_hierophant: "দ্য হায়ারোফ্যান্ট (মহাগুরু)",
    the_lovers: "দ্য লাভার্স (পবিত্র প্রণয়ী)",
    the_chariot: "দ্য চ্যারিয়ট (বিজয়ী রথ)",
    strength: "স্ট্রেন্থ (আত্মিক শক্তি)",
    the_hermit: "দ্য হার্মিট (তপস্বী সাধক)",
    wheel_of_fortune: "হুইল অফ ফরচুন (মহাজাগতিক ভাগ্যচক্র)",
    justice: "জাস্টিস (ন্যায়দণ্ড)",
    the_hanged_man: "দ্য হ্যাংড ম্যান (সমর্পিত আত্মা)",
    death: "ডেথ (মহাজাগতিক রূপান্তর)",
    temperance: "টেম্পারেন্স (সংযম ও ভারসাম্য)",
    the_devil: "দ্য ডেভিল (মোহ ও আসক্তি)",
    the_tower: "দ্য টাওয়ার (ভ্রান্তিভঙ্গ ও নবসূচনা)",
    the_star: "দ্য স্টার (আশার আলোকবর্তিকা)",
    the_moon: "দ্য মুন (স্বপ্ন ও অন্তর্লোক)",
    the_sun: "দ্য সান (প্রদীপ্ত সূর্য ও বিজয়)",
    judgement: "জাজমেন্ট (আত্মজাগরণ ও মুক্তি)",
    the_world: "দ্য ওয়ার্ল্ড (পূর্ণতা ও সিদ্ধি)",
  },
  hi: {
    the_fool: "द फूल (निश्चल यात्री)",
    the_magician: "द मैजिशियन (जादूगर)",
    the_high_priestess: "द हाई प्रीस्टेस (गूढ़ साध्वी)",
    the_empress: "द एम्प्रेस (सृजन दात्री)",
    the_emperor: "द एम्परर (सम्राट)",
    the_hierophant: "द हायरोफैंट (धर्मगुरु)",
    the_lovers: "द लवर्स (प्रेमी युगल)",
    the_chariot: "द चेरियट (विजय रथ)",
    strength: "स्ट्रेंथ (आत्मबल)",
    the_hermit: "द हर्मिट (एकांत साधक)",
    wheel_of_fortune: "व्हील ऑफ फॉर्च्यून (भाग्य चक्र)",
    justice: "जस्टिस (न्याय चक्र)",
    the_hanged_man: "द हैंग्ड मैन (समर्पित आत्मा)",
    death: "डेथ (महा-रूपांतरण)",
    temperance: "टेम्परेंस (संयम संतुलन)",
    the_devil: "द डेविल (माया बंधन)",
    the_tower: "द टॉवर (भ्रम ध्वंस)",
    the_star: "द स्टार (दिव्य आशा)",
    the_moon: "द मून (अंतर्मन रहस्य)",
    the_sun: "द सन (दिव्य सूर्य तेज)",
    judgement: "जजमेंट (आत्मजागरण)",
    the_world: "द वर्ल्ड (परम सिद्धि)",
  },
};

export const ELEMENTS_LOCALIZED: Record<AstrologyLanguage, Record<string, string>> = {
  en: {
    Fire: "Fire",
    Water: "Water",
    Air: "Air",
    Earth: "Earth",
    Spirit: "Spirit",
  },
  bn: {
    Fire: "অগ্নি (তেজ)",
    Water: "জল (আপঃ)",
    Air: "বায়ু (মরুৎ)",
    Earth: "পৃথিবী (ক্ষিতি)",
    Spirit: "ব্যোম (আকাশ)",
  },
  hi: {
    Fire: "अग्नि तत्व",
    Water: "जल तत्व",
    Air: "वायु तत्व",
    Earth: "पृथ्वी तत्व",
    Spirit: "आकाश तत्व",
  },
};

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
    badge: "Divine Chrono-Astrological Arcana (100% Authentic)",
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
    uprightBadge: "Upright",
    reversedBadge: "Reversed",
    copySummaryBtn: "Copy Reading Summary",
    copiedToast: "Tarot summary copied to clipboard!",
    newReadingBtn: "Perform Another Reading",
    bookAstrologerCta: "Seek Deeper Personalized Guidance",
    bookAstrologerDesc: "Connect live with certified Tarot Grandmasters and Vedic Astrologers to dive deeper into your spread.",
    consultNowBtn: "Consult Live Astrologer",
  },

  bn: {
    badge: "মহাজাগতিক ক্রোনো-অ্যাস্ট্রোলজিক্যাল ট্যারো ওরাকল (১০০% প্রামাণ্য)",
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
    uprightBadge: "সোজা (জাগ্রত শক্তি)",
    reversedBadge: "উল্টো (অন্তর্মুখী রূপান্তর)",
    copySummaryBtn: "ফলাফল কপি করুন",
    copiedToast: "ট্যারো পাঠের সারাংশ ক্লিপবোর্ডে কপি করা হয়েছে!",
    newReadingBtn: "নতুন ট্যারো পাঠ শুরু করুন",
    bookAstrologerCta: "আরও গভীর ব্যক্তিগত বিশ্লেষণ প্রয়োজন?",
    bookAstrologerDesc: "আমাদের অভিজ্ঞ ট্যারো গ্র্যান্ডমাস্টার এবং জ্যোতিষীদের সাথে সরাসরি লাইভ কথা বলুন।",
    consultNowBtn: "অভিজ্ঞ জ্যোতিষীর সাথে কথা বলুন",
  },

  hi: {
    badge: "दिव्य क्रोनो-एस्ट्रोलॉजिकल टैरो ऑरेकल (100% प्रामाणिक)",
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
