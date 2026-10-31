import type { AstrologyLanguage } from "@/types";

export interface AstrologersTranslations {
  liveDirectoryBadge: string;
  heading: string;
  subtitle: string;
  searchPlaceholder: string;
  filtersBtn: string;
  onlineNow: string;
  featuredPill: string;
  countAstrologers: (count: number) => string;
  specialityLabel: string;
  anySpeciality: string;
  languageLabel: string;
  anyLanguage: string;
  availableForLabel: string;
  anyMode: string;
  minYearsLabel: string;
  maxCoinsLabel: string;
  clearFiltersBtn: string;
  errorTitle: string;
  tryAgainBtn: string;
  noMatchTitle: string;
  noMatchDesc: string;

  // Card
  ratingLabel: string;
  expLabel: string;
  consultsLabel: string;
  rateLabel: string;
  perMinute: string;
  getInTouch: string;
  featuredBadge: string;
  bookmarkRemoved: string;
  bookmarkSaved: string;
  yearsSuffix: string;

  // Detail Page
  backAll: string;
  loadingProfile: string;
  notAvailableTitle: string;
  notAvailableDesc: string;
  browseOthersBtn: string;
  inSessionBadge: string;
  onlineBadge: string;
  offlineBadge: string;
  expYrsLabel: string;
  consultsCountLabel: string;
  startConsultationTitle: string;
  startConsultationDesc: string;
  notTakingYet: (name: string) => string;
  offlineRightNow: string;
  chatPaused: string;
  callPaused: string;
  videoPaused: string;
  signInNotice: string;
  specialitiesTitle: string;
  aboutTitle: string;
  qualificationsTitle: string;
  reviewsTitle: string;
  reviewsDesc: string;
  galleryTitle: string;
}

export const ASTROLOGERS_I18N: Record<AstrologyLanguage, AstrologersTranslations> = {
  bn: {
    liveDirectoryBadge: "✦ লাইভ ডিরেক্টরি",
    heading: "অভিজ্ঞ জ্যোতিষীবৃন্দ",
    subtitle: "যাচাইকৃত অভিজ্ঞ জ্যোতিষীদের তালিকা। যিনি এখন অনলাইনে আছেন তিনি সবার প্রথমে প্রদর্শিত হবেন।",
    searchPlaceholder: "নাম বা বিশেষজ্ঞতা দিয়ে খুঁজুন",
    filtersBtn: "ফিল্টার",
    onlineNow: "অনলাইন আছেন",
    featuredPill: "★ বিশিষ্ট",
    countAstrologers: (count) => `${count} জন জ্যোতিষী`,
    specialityLabel: "বিশেষজ্ঞতা",
    anySpeciality: "যে কোনো বিশেষজ্ঞতা",
    languageLabel: "ভাষা",
    anyLanguage: "যে কোনো ভাষা",
    availableForLabel: "পরামর্শের মাধ্যম",
    anyMode: "যে কোনো মাধ্যম",
    minYearsLabel: "ন্যূনতম অভিজ্ঞতা (বছর)",
    maxCoinsLabel: "সর্বোচ্চ কয়েন/মিনিট",
    clearFiltersBtn: "ফিল্টার মুছুন",
    errorTitle: "জ্যোতিষীদের তালিকা লোড করা যায়নি",
    tryAgainBtn: "পুনরায় চেষ্টা করুন",
    noMatchTitle: "কোনো জ্যোতিষী পাওয়া যায়নি",
    noMatchDesc: "অনুগ্রহ করে ফিল্টার শিথিল করুন অথবা অন্য কিছু লিখে খুঁজুন।",

    ratingLabel: "রেটিং",
    expLabel: "অভিজ্ঞতা",
    consultsLabel: "পরামর্শ",
    rateLabel: "ফি",
    perMinute: "/মিনিট",
    getInTouch: "পরামর্শ নিন",
    featuredBadge: "✦ বিশিষ্ট",
    bookmarkRemoved: "পছন্দের তালিকা থেকে সরানো হয়েছে",
    bookmarkSaved: "পছন্দের তালিকায় যুক্ত হয়েছে",
    yearsSuffix: "+ বছর",

    backAll: "সকল জ্যোতিষী",
    loadingProfile: "প্রোফাইল লোড হচ্ছে…",
    notAvailableTitle: "এই জ্যোতিষী বর্তমানে উপলব্ধ নন",
    notAvailableDesc: "তাঁকে সাময়িকভাবে ডিরেক্টরি থেকে সরানো হতে পারে। অনুগ্রহ করে অন্যান্য জ্যোতিষীদের দেখুন।",
    browseOthersBtn: "অন্যান্য জ্যোতিষী দেখুন",
    inSessionBadge: "◉ সেশনে ব্যস্ত",
    onlineBadge: "● অনলাইন",
    offlineBadge: "○ অফলাইন",
    expYrsLabel: "বছর অভিজ্ঞতা",
    consultsCountLabel: "পরামর্শ",
    startConsultationTitle: "পরামর্শ শুরু করুন",
    startConsultationDesc: "লাইভ চ্যাট, অডিও কল অথবা ভিডিও কলে সরাসরি যুক্ত হন।",
    notTakingYet: (name) => `${name} বর্তমানে পরামর্শ নিচ্ছেন না।`,
    offlineRightNow: "বর্তমানে অফলাইন",
    chatPaused: "চ্যাট সাময়িক বন্ধ",
    callPaused: "কল সাময়িক বন্ধ",
    videoPaused: "ভিডিও সাময়িক বন্ধ",
    signInNotice: "পরামর্শ শুরু করতে প্রথমে লগইন করতে হবে।",
    specialitiesTitle: "বিশেষজ্ঞতা",
    aboutTitle: "পরিচিতি",
    qualificationsTitle: "শিক্ষাগত যোগ্যতা",
    reviewsTitle: "ব্যবহারকারীদের পর্যালোচনা",
    reviewsDesc: "যাঁরা প্রকৃতপক্ষে এই জ্যোতিষীর পরামর্শ গ্রহণ করেছেন।",
    galleryTitle: "গ্যালারি",
  },
  hi: {
    liveDirectoryBadge: "✦ लाइव डायरेक्टरी",
    heading: "अनुभवी ज्योतिषी",
    subtitle: "सत्यापित अनुभवी ज्योतिषियों की सूची। जो अभी ऑनलाइन हैं वे सबसे पहले दिखाई देंगे।",
    searchPlaceholder: "नाम या विशेषज्ञता से खोजें",
    filtersBtn: "फिल्टर",
    onlineNow: "ऑनलाइन हैं",
    featuredPill: "★ विशिष्ट",
    countAstrologers: (count) => `${count} ज्योतिषी`,
    specialityLabel: "विशेषज्ञता",
    anySpeciality: "कोई भी विशेषज्ञता",
    languageLabel: "भाषा",
    anyLanguage: "कोई भी भाषा",
    availableForLabel: "परामर्श माध्यम",
    anyMode: "कोई भी माध्यम",
    minYearsLabel: "न्यूनतम अनुभव (वर्ष)",
    maxCoinsLabel: "अधिकतम सिक्के/मिनट",
    clearFiltersBtn: "फिल्टर हटाएं",
    errorTitle: "ज्योतिषियों की सूची लोड नहीं हो सकी",
    tryAgainBtn: "पुनः प्रयास करें",
    noMatchTitle: "कोई ज्योतिषी नहीं मिला",
    noMatchDesc: "कृपया फिल्टर हटाएं या कुछ और लिखकर खोजें।",

    ratingLabel: "रेटिंग",
    expLabel: "अनुभव",
    consultsLabel: "परामर्श",
    rateLabel: "दर",
    perMinute: "/मिनट",
    getInTouch: "परामर्श लें",
    featuredBadge: "✦ विशिष्ट",
    bookmarkRemoved: "पसंदीदा सूची से हटाया गया",
    bookmarkSaved: "पसंदीदा सूची में सहेजा गया",
    yearsSuffix: "+ वर्ष",

    backAll: "सभी ज्योतिषी",
    loadingProfile: "प्रोफाइल लोड हो रही है…",
    notAvailableTitle: "यह ज्योतिषी वर्तमान में उपलब्ध नहीं हैं",
    notAvailableDesc: "इन्हें सूची से हटाया गया हो सकता है। कृपया अन्य ज्योतिषियों को देखें।",
    browseOthersBtn: "अन्य ज्योतिषी देखें",
    inSessionBadge: "◉ सत्र में व्यस्त",
    onlineBadge: "● ऑनलाइन",
    offlineBadge: "○ ऑफलाइन",
    expYrsLabel: "वर्ष अनुभव",
    consultsCountLabel: "परामर्श",
    startConsultationTitle: "परामर्श शुरू करें",
    startConsultationDesc: "लाइव चैट, ऑडियो या वीडियो कॉल से तुरंत जुड़ें।",
    notTakingYet: (name) => `${name} अभी परामर्श नहीं ले रहे हैं।`,
    offlineRightNow: "अभी ऑफलाइन हैं",
    chatPaused: "चैट रुकी हुई है",
    callPaused: "कॉल रुकी हुई है",
    videoPaused: "वीडियो रुकी हुई है",
    signInNotice: "परामर्श शुरू करने के लिए पहले लॉगिन करना होगा।",
    specialitiesTitle: "विशेषज्ञताएं",
    aboutTitle: "परिचय",
    qualificationsTitle: "योग्यताएं",
    reviewsTitle: "उपयोगकर्ता समीक्षाएं",
    reviewsDesc: "जिन लोगों ने वास्तव में इनसे परामर्श लिया है।",
    galleryTitle: "गैलरी",
  },
  en: {
    liveDirectoryBadge: "✦ Live directory",
    heading: "Astrologers",
    subtitle: "Verified practitioners, ready when you are. Whoever is online shows first.",
    searchPlaceholder: "Search by name or speciality",
    filtersBtn: "Filters",
    onlineNow: "Online now",
    featuredPill: "★ Featured",
    countAstrologers: (count) => `${count} astrologer${count === 1 ? "" : "s"}`,
    specialityLabel: "Speciality",
    anySpeciality: "Any speciality",
    languageLabel: "Language",
    anyLanguage: "Any language",
    availableForLabel: "Available for",
    anyMode: "Any mode",
    minYearsLabel: "Min. years",
    maxCoinsLabel: "Max coins/min",
    clearFiltersBtn: "Clear all filters",
    errorTitle: "Could not load astrologers",
    tryAgainBtn: "Try again",
    noMatchTitle: "No astrologers match that",
    noMatchDesc: "Try removing a filter, or search for something broader.",

    ratingLabel: "rating",
    expLabel: "exp",
    consultsLabel: "consults",
    rateLabel: "rate",
    perMinute: "/min",
    getInTouch: "Get In Touch",
    featuredBadge: "✦ Featured",
    bookmarkRemoved: "Removed from saved astrologers.",
    bookmarkSaved: "Saved to favorites.",
    yearsSuffix: "+ yrs",

    backAll: "All astrologers",
    loadingProfile: "Loading profile…",
    notAvailableTitle: "This astrologer is not available",
    notAvailableDesc: "They may have been taken off the directory. Browse the others instead.",
    browseOthersBtn: "Browse astrologers",
    inSessionBadge: "◉ In Session",
    onlineBadge: "● Online",
    offlineBadge: "○ Offline",
    expYrsLabel: "yrs exp",
    consultsCountLabel: "consults",
    startConsultationTitle: "Start a consultation",
    startConsultationDesc: "Connect instantly via live chat, audio, or video.",
    notTakingYet: (name) => `${name} is not taking consultations yet.`,
    offlineRightNow: "Offline right now",
    chatPaused: "Chat paused",
    callPaused: "Calls paused",
    videoPaused: "Video paused",
    signInNotice: "You will be asked to sign in first.",
    specialitiesTitle: "Specialities",
    aboutTitle: "About",
    qualificationsTitle: "Qualifications",
    reviewsTitle: "Reviews",
    reviewsDesc: "From people who have actually consulted them.",
    galleryTitle: "Gallery",
  },
};

