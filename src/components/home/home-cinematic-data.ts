import type { AstrologyLanguage } from "@/types";

/** One string in every language the site ships. */
export type Tr = Record<AstrologyLanguage, string>;

export function tr(text: Tr, lang: AstrologyLanguage): string {
  return text[lang] ?? text.en;
}

const IMG = "/images/home-cinematic";

/* ------------------------------------------------------------------ */
/* Hero slides                                                         */
/* ------------------------------------------------------------------ */

export interface HeroSlide {
  id: string;
  photo: string;
  /** background-position of the photo layer */
  position: string;
  thumb: string;
  /** Title lines; each line is split into words that rise from a mask. */
  title: Record<AstrologyLanguage, string[]>;
  /** "one" = single 8.25vw line, "two" = stacked 9.6vw lines */
  layout: "one" | "two";
  heading: Tr;
  description: Tr;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "welcome",
    photo: `${IMG}/hero-1.webp`,
    position: "center 62%",
    thumb: `${IMG}/rail-1.webp`,
    layout: "one",
    title: {
      en: ["WELCOME TO DIVINLINK"],
      bn: ["ডিভিনলিংকে স্বাগতম"],
      hi: ["डिवाइनलिंक में स्वागत"],
    },
    heading: {
      en: "Discover DivinLink",
      bn: "ডিভিনলিংক আবিষ্কার করুন",
      hi: "डिवाइनलिंक को जानें",
    },
    description: {
      en: "Verified Vedic astrologers, free kundli and daily guidance for you and your family",
      bn: "যাচাই করা বৈদিক জ্যোতিষী, ফ্রি কুণ্ডলী ও প্রতিদিনের দিশা, আপনার ও আপনার পরিবারের জন্য",
      hi: "सत्यापित वैदिक ज्योतिषी, मुफ़्त कुंडली और रोज़ का मार्गदर्शन, आपके और आपके परिवार के लिए",
    },
  },
  {
    id: "guide",
    photo: `${IMG}/hero-2.webp`,
    position: "center 55%",
    thumb: `${IMG}/rail-2.webp`,
    layout: "one",
    title: {
      en: ["FIND YOUR GUIDE"],
      bn: ["আপনার গুরু খুঁজুন"],
      hi: ["अपना गुरु खोजें"],
    },
    heading: {
      en: "Talk to experts",
      bn: "বিশেষজ্ঞের সঙ্গে কথা বলুন",
      hi: "विशेषज्ञों से बात करें",
    },
    description: {
      en: "Chat or call astrologers for love, career, marriage and health questions",
      bn: "প্রেম, কেরিয়ার, বিবাহ ও স্বাস্থ্যের প্রশ্নে জ্যোতিষীর সঙ্গে চ্যাট বা কল করুন",
      hi: "प्रेम, करियर, विवाह और स्वास्थ्य के सवालों पर ज्योतिषी से चैट या कॉल करें",
    },
  },
  {
    id: "stars",
    photo: `${IMG}/hero-3.webp`,
    position: "center 40%",
    thumb: `${IMG}/rail-3.webp`,
    layout: "two",
    title: {
      en: ["EXPLORE", "THE STARS"],
      bn: ["নক্ষত্রের", "সন্ধানে"],
      hi: ["सितारों को", "जानें"],
    },
    heading: {
      en: "Read the stars",
      bn: "নক্ষত্র পড়ুন",
      hi: "सितारों को पढ़ें",
    },
    description: {
      en: "Explore your kundli, panchang and nakshatra through the eyes of Vedic tradition",
      bn: "বৈদিক ঐতিহ্যের চোখে আপনার কুণ্ডলী, পঞ্জিকা ও নক্ষত্র জানুন",
      hi: "वैदिक परंपरा की दृष्टि से अपनी कुंडली, पंचांग और नक्षत्र जानें",
    },
  },
];

/** Rail order top → bottom, as slide indices (slide 3 on top, slide 1 at the bottom). */
export const RAIL_ORDER = [2, 1, 0];

export const CLOUD_IMAGE = "/images/clouds-screen.webp";

/* ------------------------------------------------------------------ */
/* Readings (the card grid + detail page)                              */
/* ------------------------------------------------------------------ */

export interface Reading {
  id: string;
  name: Tr;
  place: Tr;
  category: Tr;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  href: string;
  about: Tr;
}

export const READINGS: Reading[] = [
  {
    id: "janam-kundli",
    name: { en: "Janam Kundli Reading", bn: "জন্ম কুণ্ডলী বিশ্লেষণ", hi: "जन्म कुंडली विश्लेषण" },
    place: { en: "Parashari, Varanasi", bn: "পরাশরী, বারাণসী", hi: "पाराशरी, वाराणसी" },
    category: { en: "Kundli", bn: "কুণ্ডলী", hi: "कुंडली" },
    image: `${IMG}/card-1.webp`,
    price: 499,
    rating: 4.9,
    reviews: 284,
    href: "/kundli",
    about: {
      en: "Your Lagna chart, Navamsa (D9) and Vimshottari Mahadasha read together by a verified Vedic astrologer. Built on the Swiss Ephemeris, explained in plain words, with the yogas and doshas that actually matter for the years ahead.",
      bn: "যাচাই করা বৈদিক জ্যোতিষী একসঙ্গে পড়বেন আপনার লগ্ন কুণ্ডলী, নবাংশ (D9) ও বিংশোত্তরী মহাদশা। সুইস এফিমেরিস নির্ভর গণনা, সহজ ভাষায় ব্যাখ্যা, আর সামনের বছরগুলোর জন্য যে যোগ ও দোষ সত্যিই গুরুত্বপূর্ণ।",
      hi: "सत्यापित वैदिक ज्योतिषी आपकी लग्न कुंडली, नवांश (D9) और विंशोत्तरी महादशा को साथ पढ़ते हैं। स्विस एफ़ेमेरिस पर आधारित गणना, सरल भाषा में व्याख्या, और आने वाले वर्षों के लिए वे योग और दोष जो वास्तव में मायने रखते हैं।",
    },
  },
  {
    id: "kundli-matching",
    name: { en: "Kundli Matching", bn: "কুণ্ডলী মিলন", hi: "कुंडली मिलान" },
    place: { en: "Ashtakoot, Jaipur", bn: "অষ্টকূট, জয়পুর", hi: "अष्टकूट, जयपुर" },
    category: { en: "Matchmaking", bn: "বিবাহ মিলন", hi: "विवाह मिलान" },
    image: `${IMG}/card-2.webp`,
    price: 599,
    rating: 4.9,
    reviews: 218,
    href: "/kundli-matching",
    about: {
      en: "The full 36-point Ashtakoot Guna Milan, Manglik and Nadi checks with their remedies, and a Navamsa comparison of both charts, so a family can decide with clarity rather than a single score.",
      bn: "সম্পূর্ণ ৩৬ গুণের অষ্টকূট মিলন, মাঙ্গলিক ও নাড়ী দোষ বিচার ও তার প্রতিকার, আর দুটি কুণ্ডলীর নবাংশ তুলনা, যাতে পরিবার শুধু একটি সংখ্যা নয়, স্পষ্ট বোঝা নিয়ে সিদ্ধান্ত নিতে পারে।",
      hi: "संपूर्ण 36 गुणों का अष्टकूट मिलान, मांगलिक और नाड़ी दोष की जाँच व उपाय, और दोनों कुंडलियों की नवांश तुलना, ताकि परिवार केवल एक अंक नहीं, स्पष्ट समझ के साथ निर्णय ले सके।",
    },
  },
  {
    id: "navagraha-puja",
    name: { en: "Navagraha Shanti Puja", bn: "নবগ্রহ শান্তি পূজা", hi: "नवग्रह शांति पूजा" },
    place: { en: "Ghats of Kashi", bn: "কাশীর ঘাট", hi: "काशी के घाट" },
    category: { en: "Puja & Remedies", bn: "পূজা ও প্রতিকার", hi: "पूजा एवं उपाय" },
    image: `${IMG}/card-3.webp`,
    price: 1100,
    rating: 4.8,
    reviews: 164,
    href: "/purohit-booking",
    about: {
      en: "A Navagraha Shanti performed by a Kashi purohit with your name and gotra in the sankalpa, for Shani, Rahu-Ketu or Mangal afflictions. Join live on video and receive the completion recording.",
      bn: "আপনার নাম ও গোত্রে সংকল্প করে কাশীর পুরোহিত দ্বারা নবগ্রহ শান্তি পূজা, শনি, রাহু-কেতু বা মঙ্গলের দোষের জন্য। ভিডিওতে লাইভ যোগ দিন, পূজা শেষে রেকর্ডিং পাবেন।",
      hi: "आपके नाम और गोत्र से संकल्प लेकर काशी के पुरोहित द्वारा नवग्रह शांति पूजा, शनि, राहु-केतु या मंगल दोष के लिए। वीडियो पर लाइव जुड़ें और पूजा पूर्ण होने की रिकॉर्डिंग पाएँ।",
    },
  },
  {
    id: "gemstone",
    name: { en: "Gemstone Consultation", bn: "রত্ন পরামর্শ", hi: "रत्न परामर्श" },
    place: { en: "Ratna Shastra, Surat", bn: "রত্নশাস্ত্র, সুরাট", hi: "रत्नशास्त्र, सूरत" },
    category: { en: "Gemstones", bn: "রত্ন", hi: "रत्न" },
    image: `${IMG}/card-4.webp`,
    price: 349,
    rating: 4.8,
    reviews: 142,
    href: "/shop",
    about: {
      en: "Find out whether Neelam, Pukhraj, Panna or Moti strengthens your Lagna lord before you wear one. The astrologer checks your Dasha and Ashtakavarga, then advises the carat, metal, finger and the day to start.",
      bn: "নীলা, পোখরাজ, পান্না বা মুক্তো পরার আগে জেনে নিন সেটি আপনার লগ্নেশকে শক্তিশালী করে কিনা। জ্যোতিষী দশা ও অষ্টকবর্গ দেখে ক্যারেট, ধাতু, আঙুল ও ধারণের দিন বলে দেবেন।",
      hi: "नीलम, पुखराज, पन्ना या मोती पहनने से पहले जानें कि वह आपके लग्नेश को बल देता है या नहीं। ज्योतिषी दशा और अष्टकवर्ग देखकर कैरेट, धातु, उंगली और धारण का दिन बताते हैं।",
    },
  },
  {
    id: "muhurat",
    name: { en: "Muhurat Selection", bn: "শুভ মুহূর্ত নির্ণয়", hi: "शुभ मुहूर्त चयन" },
    place: { en: "Surya Siddhanta, Puri", bn: "সূর্য সিদ্ধান্ত, পুরী", hi: "सूर्य सिद्धांत, पुरी" },
    category: { en: "Muhurat", bn: "মুহূর্ত", hi: "मुहूर्त" },
    image: `${IMG}/card-5.webp`,
    price: 399,
    rating: 4.9,
    reviews: 193,
    href: "/muhurat",
    about: {
      en: "Auspicious windows for griha pravesh, a business launch, a vehicle or a wedding, matched to your own Chandra Bala and Tara Bala, with Rahu Kaal left out and three alternative dates to choose from.",
      bn: "গৃহপ্রবেশ, ব্যবসা শুরু, গাড়ি কেনা বা বিবাহের শুভ সময়, আপনার নিজের চন্দ্রবল ও তারাবল মিলিয়ে, রাহুকাল বাদ দিয়ে, বেছে নেওয়ার জন্য তিনটি বিকল্প তারিখ সহ।",
      hi: "गृह प्रवेश, व्यापार आरंभ, वाहन या विवाह के लिए शुभ समय, आपके अपने चंद्र बल और तारा बल के अनुसार, राहु काल छोड़कर, चुनने के लिए तीन वैकल्पिक तिथियों के साथ।",
    },
  },
  {
    id: "vastu",
    name: { en: "Vastu for Home", bn: "গৃহ বাস্তু", hi: "गृह वास्तु" },
    place: { en: "Vastu Shastra, Delhi", bn: "বাস্তুশাস্ত্র, দিল্লি", hi: "वास्तुशास्त्र, दिल्ली" },
    category: { en: "Vastu", bn: "বাস্তু", hi: "वास्तु" },
    image: `${IMG}/card-6.webp`,
    price: 899,
    rating: 4.8,
    reviews: 175,
    href: "/vastu",
    about: {
      en: "A floor-plan reading of your home's sixteen zones, with the north-east and wealth directions checked first. Every suggestion is a non-demolition remedy you can apply this week.",
      bn: "আপনার বাড়ির ষোলোটি অঞ্চলের নকশা বিশ্লেষণ, প্রথমে ঈশান ও ধন-দিক দেখা হয়। প্রতিটি পরামর্শ ভাঙচুর ছাড়া প্রতিকার, যা এই সপ্তাহেই প্রয়োগ করা যায়।",
      hi: "आपके घर के सोलह ज़ोन का नक्शा विश्लेषण, सबसे पहले ईशान और धन दिशा की जाँच। हर सुझाव बिना तोड़-फोड़ वाला उपाय है जिसे आप इसी सप्ताह अपना सकते हैं।",
    },
  },
  {
    id: "kp-transit",
    name: { en: "KP & Transit Reading", bn: "কেপি ও গোচর বিশ্লেষণ", hi: "केपी एवं गोचर फल" },
    place: { en: "Jantar Mantar, Jaipur", bn: "যন্তর মন্তর, জয়পুর", hi: "जंतर मंतर, जयपुर" },
    category: { en: "KP Astrology", bn: "কেপি জ্যোতিষ", hi: "केपी ज्योतिष" },
    image: `${IMG}/card-7.webp`,
    price: 449,
    rating: 4.9,
    reviews: 132,
    href: "/kp-calculator",
    about: {
      en: "Krishnamurti sub-lord timing for a job change, foreign travel or a pending case, read against the Saturn and Jupiter transits through your twelve houses, ending in a clear date range rather than a vague promise.",
      bn: "চাকরি বদল, বিদেশযাত্রা বা চলতি মামলার জন্য কৃষ্ণমূর্তি সাব-লর্ড পদ্ধতিতে সময় নির্ণয়, আপনার বারোটি ভাবে শনি ও বৃহস্পতির গোচর মিলিয়ে, অস্পষ্ট প্রতিশ্রুতি নয়, একটি স্পষ্ট সময়সীমা।",
      hi: "नौकरी बदलने, विदेश यात्रा या लंबित मामले के लिए कृष्णमूर्ति सब-लॉर्ड पद्धति से समय गणना, आपके बारह भावों में शनि और बृहस्पति के गोचर के साथ, अस्पष्ट वादा नहीं, एक स्पष्ट तिथि सीमा।",
    },
  },
  {
    id: "prashna-tarot",
    name: { en: "Prashna & Tarot", bn: "প্রশ্ন কুণ্ডলী ও ট্যারো", hi: "प्रश्न कुंडली एवं टैरो" },
    place: { en: "Horary, Rishikesh", bn: "প্রশ্নশাস্ত্র, ঋষিকেশ", hi: "प्रश्नशास्त्र, ऋषिकेश" },
    category: { en: "Tarot", bn: "ট্যারো", hi: "टैरो" },
    image: `${IMG}/card-8.webp`,
    price: 299,
    rating: 4.8,
    reviews: 249,
    href: "/tarot",
    about: {
      en: "No birth time needed. When a decision about love or work cannot wait, the reader casts a Prashna chart for the moment you ask and lays a three-card spread beside it.",
      bn: "জন্মসময় লাগবে না। প্রেম বা কাজের কোনো সিদ্ধান্ত যখন অপেক্ষা করতে পারে না, আপনি যে মুহূর্তে প্রশ্ন করেন তার প্রশ্ন কুণ্ডলী তৈরি হয়, পাশে তিন কার্ডের ট্যারো।",
      hi: "जन्म समय की ज़रूरत नहीं। जब प्रेम या काम का कोई निर्णय रुक नहीं सकता, तब आपके प्रश्न के क्षण की प्रश्न कुंडली बनती है और उसके साथ तीन कार्ड का टैरो।",
    },
  },
];

export const DETAIL_GALLERY = [`${IMG}/gal-altar.webp`, `${IMG}/gal-astrolabe.webp`, `${IMG}/gal-ghats.webp`];
export const HOST_AVATAR = `${IMG}/avatar-acharya.webp`;
export const REVIEWER_AVATARS = [`${IMG}/avatar-rev-1.webp`, `${IMG}/avatar-rev-2.webp`, `${IMG}/avatar-rev-3.webp`];

/* ------------------------------------------------------------------ */
/* Interface copy                                                      */
/* ------------------------------------------------------------------ */

export const COPY = {
  readings: { en: "Readings", bn: "পরামর্শ", hi: "परामर्श" },
  linkAstrologers: { en: "Astrologers", bn: "জ্যোতিষী", hi: "ज्योतिषी" },
  linkKundli: { en: "Free Kundli", bn: "ফ্রি কুণ্ডলী", hi: "मुफ़्त कुंडली" },
  linkContact: { en: "Contact Us", bn: "যোগাযোগ", hi: "संपर्क करें" },
  becomeAstrologer: { en: "Become an astrologer", bn: "জ্যোতিষী হোন", hi: "ज्योतिषी बनें" },
  dailyHoroscope: { en: "Daily Horoscope", bn: "দৈনিক রাশিফল", hi: "दैनिक राशिफल" },
  panchang: { en: "Panchang", bn: "পঞ্জিকা", hi: "पंचांग" },
  numerology: { en: "Numerology", bn: "সংখ্যাতত্ত্ব", hi: "अंक ज्योतिष" },
  tarot: { en: "Tarot", bn: "ট্যারো", hi: "टैरो" },
  matching: { en: "Kundli Matching", bn: "কুণ্ডলী মিলন", hi: "कुंडली मिलान" },
  account: { en: "My account", bn: "আমার অ্যাকাউন্ট", hi: "मेरा खाता" },
  signIn: { en: "Sign in", bn: "সাইন ইন", hi: "साइन इन" },

  // Birth bar (the hero's Free Kundli form)
  barTab: { en: "Free Janam Kundli", bn: "ফ্রি জন্ম কুণ্ডলী", hi: "मुफ़्त जन्म कुंडली" },
  barTabSub: { en: "Lagna, Navamsa & Dasha in seconds", bn: "কয়েক সেকেন্ডে লগ্ন, নবাংশ ও দশা", hi: "कुछ सेकंड में लग्न, नवांश और दशा" },
  nameLabel: { en: "Name", bn: "নাম", hi: "नाम" },
  addName: { en: "Who is it for?", bn: "কার জন্য?", hi: "किसके लिए?" },
  namePlaceholder: { en: "Full name", bn: "পুরো নাম", hi: "पूरा नाम" },
  male: { en: "Male", bn: "পুরুষ", hi: "पुरुष" },
  female: { en: "Female", bn: "মহিলা", hi: "महिला" },
  other: { en: "Other", bn: "অন্যান্য", hi: "अन्य" },
  dobLabel: { en: "Birth date", bn: "জন্ম তারিখ", hi: "जन्म तिथि" },
  addDate: { en: "Add date", bn: "তারিখ দিন", hi: "तारीख़ चुनें" },
  tobLabel: { en: "Birth time", bn: "জন্ম সময়", hi: "जन्म समय" },
  addTime: { en: "Add time", bn: "সময় দিন", hi: "समय चुनें" },
  timeUnknown: { en: "Not known", bn: "জানা নেই", hi: "पता नहीं" },
  timeUnknownToggle: { en: "I don't know my birth time", bn: "আমার জন্মসময় জানা নেই", hi: "मुझे जन्म समय नहीं पता" },
  timeUnknownHint: { en: "We'll use 12:00 PM. The Lagna may be less exact.", bn: "দুপুর ১২টা ধরা হবে। লগ্ন কম নির্ভুল হতে পারে।", hi: "दोपहर 12 बजे माना जाएगा। लग्न कम सटीक हो सकता है।" },
  hourLabel: { en: "Hour", bn: "ঘণ্টা", hi: "घंटा" },
  minuteLabel: { en: "Minute", bn: "মিনিট", hi: "मिनट" },
  done: { en: "Done", bn: "ঠিক আছে", hi: "ठीक है" },
  pobLabel: { en: "Birth place", bn: "জন্মস্থান", hi: "जन्म स्थान" },
  addPlace: { en: "Choose city", bn: "শহর বেছে নিন", hi: "शहर चुनें" },
  generate: { en: "Generate free kundli", bn: "ফ্রি কুণ্ডলী তৈরি করুন", hi: "मुफ़्त कुंडली बनाएँ" },
  needName: { en: "Add the name first", bn: "আগে নাম দিন", hi: "पहले नाम डालें" },
  needDob: { en: "Pick the birth date", bn: "জন্ম তারিখ বেছে নিন", hi: "जन्म तिथि चुनें" },
  needPlace: { en: "Choose the birth place", bn: "জন্মস্থান বেছে নিন", hi: "जन्म स्थान चुनें" },

  recommended: { en: "Recommended Readings", bn: "আপনার জন্য প্রস্তাবিত পরামর্শ", hi: "आपके लिए सुझाए गए परामर्श" },
  seeAll: { en: "See All", bn: "সব দেখুন", hi: "सभी देखें" },
  perSession: { en: "/session", bn: "/সেশন", hi: "/सत्र" },

  home: { en: "Home", bn: "হোম", hi: "होम" },
  guidedBy: { en: "Guided by", bn: "পরামর্শ দেবেন", hi: "मार्गदर्शन" },
  verifiedAstrologers: { en: "DivinLink verified astrologers", bn: "ডিভিনলিংক যাচাই করা জ্যোতিষী", hi: "डिवाइनलिंक सत्यापित ज्योतिषी" },
  about: { en: "About", bn: "বিস্তারিত:", hi: "विवरण:" },
  bookNow: { en: "Book Now", bn: "এখনই বুক করুন", hi: "अभी बुक करें" },
  consultVia: { en: "Consult via", bn: "মাধ্যম", hi: "माध्यम" },
  chat: { en: "Chat", bn: "চ্যাট", hi: "चैट" },
  call: { en: "Call", bn: "কল", hi: "कॉल" },
  video: { en: "Video", bn: "ভিডিও", hi: "वीडियो" },
  duration: { en: "Session", bn: "সময়কাল", hi: "अवधि" },
  minutes30: { en: "30 min", bn: "৩০ মিনিট", hi: "30 मिनट" },
  birthDetails: { en: "Birth details", bn: "জন্মের তথ্য", hi: "जन्म विवरण" },
  birthDetailsLater: { en: "Add them on the next step", bn: "পরের ধাপে দেবেন", hi: "अगले चरण में जोड़ें" },
  reviews: { en: "reviews", bn: "রিভিউ", hi: "समीक्षाएँ" },
  rateNow: { en: "Rate Now", bn: "রেটিং দিন", hi: "रेटिंग दें" },
  included: { en: "What's included", bn: "যা যা থাকছে", hi: "क्या शामिल है" },
  similar: { en: "Similar Readings", bn: "একই রকম পরামর্শ", hi: "मिलते-जुलते परामर्श" },
  morePhotos: { en: "+9", bn: "+৯", hi: "+9" },

  incChat: { en: "Live chat or call", bn: "লাইভ চ্যাট বা কল", hi: "लाइव चैट या कॉल" },
  incVerified: { en: "Verified astrologer", bn: "যাচাই করা জ্যোতিষী", hi: "सत्यापित ज्योतिषी" },
  incReport: { en: "PDF report", bn: "পিডিএফ রিপোর্ট", hi: "पीडीएफ़ रिपोर्ट" },
  incRemedies: { en: "Remedies & mantras", bn: "প্রতিকার ও মন্ত্র", hi: "उपाय एवं मंत्र" },
  incPrivate: { en: "100% private", bn: "সম্পূর্ণ গোপনীয়", hi: "पूर्णतः गोपनीय" },
  incFollowUp: { en: "Follow-up support", bn: "পরবর্তী সহায়তা", hi: "फ़ॉलो-अप सहायता" },
} satisfies Record<string, Tr>;

export const MONTHS: Record<AstrologyLanguage, string[]> = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  bn: ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
};

export const WEEKDAYS: Record<AstrologyLanguage, string[]> = {
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  bn: ["সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি", "রবি"],
  hi: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
};

/** "Dec 18" style label in the active language. */
export function shortDate(d: Date, lang: AstrologyLanguage): string {
  const month = MONTHS[lang][d.getMonth()];
  const short = lang === "en" ? month.slice(0, 3) : month;
  return lang === "en" ? `${short} ${d.getDate()}` : `${d.getDate()} ${short}`;
}

export function formatPrice(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}
