import type { AstrologyLanguage } from "@/types";

export interface NakshatraGuideItem {
  id: string;
  index: number;
  name: Record<AstrologyLanguage, string>;
  lord: Record<AstrologyLanguage, string>;
  rashi: Record<AstrologyLanguage, string>;
  personality: Record<AstrologyLanguage, string>;
  career: Record<AstrologyLanguage, string>;
  health: Record<AstrologyLanguage, string>;
  relationship: Record<AstrologyLanguage, string>;
}

export interface NakshatraFaqItem {
  question: Record<AstrologyLanguage, string>;
  answer: Record<AstrologyLanguage, string>;
}

export const NAKSHATRA_STEPS = {
  title: {
    bn: "কীভাবে আপনার জন্ম নক্ষত্র জানবেন?",
    hi: "अपना जन्म नक्षत्र कैसे जानें?",
    en: "How to Calculate Your Birth Nakshatra",
  },
  subtitle: {
    bn: "৩টি সহজ ধাপে আপনার নির্ভুল বৈদিক জন্ম নক্ষত্র ও মহাজাগতিক রূপরেখা আবিষ্কার করুন",
    hi: "3 आसान चरणों में अपना सटीक वैदिक जन्म नक्षत्र और भाग्य जानें",
    en: "Discover your true Vedic Birth Star and cosmic roadmap in 3 simple steps",
  },
  steps: [
    {
      step: 1,
      title: {
        bn: "১. জন্ম তারিখ লিখুন",
        hi: "1. जन्म तिथि दर्ज करें",
        en: "1. Enter Date of Birth",
      },
      desc: {
        bn: "সঠিক দিন, মাস এবং বছর ইনপুট করুন। এটি আপনার জন্মের মুহূর্তের চন্দ্র অবস্থান নির্ণয়ের ভিত্তি।",
        hi: "सही दिन, महीना और वर्ष दर्ज करें। यह जन्म समय के चंद्र स्थिति का आधार है।",
        en: "Input exact day, month, and year. This sets the astronomical baseline for Moon's position.",
      },
    },
    {
      step: 2,
      title: {
        bn: "২. সময় ও জন্মস্থান দিন",
        hi: "2. समय व जन्म स्थान दें",
        en: "2. Enter Time & Birth Place",
      },
      desc: {
        bn: "আপনার জন্মের সময় (ঐচ্ছিক) এবং শহর নির্বাচন করুন। অটোমেটিক ভূ-স্থানাঙ্ক ও টাইমজোন সিঙ্ক হবে।",
        hi: "जन्म समय (वैकल्पिक) और शहर चुनें। अक्षांश व देशांतर स्वतः निर्धारित होंगे।",
        en: "Provide birth time (or noon default) and city. Real geocoding and IANA timezone sync automatically.",
      },
    },
    {
      step: 3,
      title: {
        bn: "৩. নক্ষত্র ফলাফল উন্মোচন করুন",
        hi: "3. नक्षत्र फल प्राप्त करें",
        en: "3. Reveal Your Nakshatra",
      },
      desc: {
        bn: "ক্লিক করলেই জানুন আপনার জন্ম নক্ষত্র, চরণ, গণ, যোনি, নাড়ী, নামাক্রম বর্ণ ও তারাবল।",
        hi: "गणना बटन दबाते ही जन्म नक्षत्र, चरण, गण, योनि, नाड़ी व नामाक्षर जानें।",
        en: "Instantly unlock your Janma Nakshatra, Pada, Avakahada Chakra, baby naming letters, and Tarabala.",
      },
    },
  ],
};

export const NAKSHATRA_ASTROTALK_GUIDE = {
  mainTitle: {
    bn: "নক্ষত্র ও জন্মতারা ক্যালকুলেটর: আপনার মহাজাগতিক ভাগ্য উন্মোচন",
    hi: "नक्षत्र / जन्म तारा कैलकुलेटर: अपने ब्रह्मांडीय भाग्य को जानें",
    en: "Nakshatra / Birth Star Calculator: Unlock Your Cosmic Destiny",
  },
  whatIsTitle: {
    bn: "নক্ষত্র কী? (What Is Nakshatra?)",
    hi: "नक्षत्र क्या है? (What Is Nakshatra?)",
    en: "What Is Nakshatra?",
  },
  whatIsContent: {
    bn: "সমগ্র আকাশমণ্ডলকে ৩৬০ ডিগ্রিতে ২৭টি সমান নক্ষত্রে ভাগ করা হয়েছে, যার প্রতিটির বিস্তার ১৩ ডিগ্রি ২০ মিনিট। চন্দ্রদেব প্রতি প্রায় ২৪ ঘণ্টায় একটি নক্ষত্র ভ্রমণ করেন এবং ২৭.৩ দিনে সমগ্র রাশিচক্রের যাত্রা সম্পন্ন করেন। আপনার জন্মের মুহূর্তে চন্দ্র যে নক্ষত্রে অবস্থান করেন, সেটিই আপনার ‘জন্ম নক্ষত্র’ (Janma Nakshatra)। এটি মানুষের মন, স্বভাব, অন্তর্দৃষ্টি এবং মানসিক চিন্তাধারা পরিচালনা করে।",
    hi: "वैदिक ज्योतिष में संपूर्ण आकाश को 27 नक्षत्रों में विभाजित किया गया है, प्रत्येक का मान 13 अंश 20 कला होता है। चंद्रमा लगभग 27.3 दिनों में सभी 27 नक्षत्रों की यात्रा पूर्ण करता है। जन्म के समय चंद्रमा जिस नक्षत्र में होता है, वही जातक का 'जन्म नक्षत्र' कहलाता है। यह आपके स्वभाव, मन, स्वास्थ्य और जीवन के उद्देश्य का प्रत्यक्ष दर्पण है।",
    en: "The sky is divided into 27 nakshatras, each spanning 13°20'. The moon travels through every nakshatra in roughly 24 hours and completes the entire celestial journey in 27.3 days. The star the moon resides in at your birth instant is your Janma Nakshatra. It governs your subconscious mind, natural temper, innate talents, and emotional destiny.",
  },
  roleTitle: {
    bn: "বৈদিক জ্যোতিষে নক্ষত্রের গুরুত্ব ও ভূমিকা",
    hi: "वैदिक ज्योतिष में नक्षत्र की भूमिका",
    en: "What Is the Role of Nakshatra in Astrology?",
  },
  roles: [
    {
      title: {
        bn: "১. বিবাহ ও রাজযোটক বিচার (Predicts Marriage Compatibility)",
        hi: "1. विवाह एवं कुंडली मिलान (Marriage Compatibility)",
        en: "1. Predicts Marriage Compatibility",
      },
      desc: {
        bn: "যোটক বিচারে অষ্টকূট মিলনের ৩৬ গুণের মধ্যে সিংহভাগই নক্ষত্র ও চরণের উপর নির্ভরশীল — যেমন গণ (স্বভাব), বশ্য (আকর্ষণ), যোনি (শারীরিক সামঞ্জস্য), নাড়ী (স্বাস্থ্য ও বংশধারা), ভকূট ও তারাবল। নক্ষত্র মিলন দাম্পত্য জীবনের দীর্ঘস্থায়ী সুখ নিশ্চিত করে।",
        hi: "विवाह मिलान में अष्टकूट के 36 गुणों की गणना मुख्यतः नक्षत्रों पर आधारित होती है—जैसे गण, वश्य, योनि, नाड़ी (स्वास्थ्य), भकूट एवं तारा। नक्षत्र सामंजस्य से वैवाहिक जीवन में शांति और स्थिरता आती है।",
        en: "In Vedic matchmaking, the 36-point Ashtakoota compatibility system heavily relies on Nakshatras—evaluating Gana (temperament), Yoni (intimacy), Nadi (genetic health), Bhakoot (emotional harmony), and Tara (mutual destiny).",
      },
    },
    {
      title: {
        bn: "২. গুরুত্বপূর্ণ শুভ কাজের সিদ্ধান্ত গ্রহণ (Assesses Important Decisions)",
        hi: "2. शुभ मुहूर्त व महत्वपूर्ण निर्णय (Important Decisions)",
        en: "2. Assesses Important Decisions",
      },
      desc: {
        bn: "দৈনন্দিন জীবনে গৃহপ্রবেশ, বিবাহ, নতুন ব্যবসা শুরু বা বিদ্যাচর্চায় পুষ্যা, হস্তা, অনুরাধা বা অশ্বিনীর মতো শুভ নক্ষত্রের গোচরকে অমৃতসম বিবেচনা করা হয়। আপনার জন্ম নক্ষত্রের সাপেক্ষে গোচর নক্ষত্র মিত্র নাকি প্রত্যরি তা তারাবল গণনা করে নিশ্চিত হওয়া যায়।",
        hi: "नया व्यापार, गृह प्रवेश, विद्यारंभ अथवा वाहन क्रय जैसे महत्वपूर्ण कार्यों के लिए पुष्य, हस्त, अनुराधा या अश्विनी जैसे नक्षत्र शुभ माने जाते हैं। अपने जन्म नक्षत्र से गोचर नक्षत्र का ताराबल देखना अत्यंत फलदायी होता है।",
        en: "Starting education, founding a business, or entering a new home is best aligned with auspicious transit stars like Pushya, Hasta, or Ashwini. Calculating Tarabala reveals whether the day's star is supportive or challenging for your birth star.",
      },
    },
    {
      title: {
        bn: "৩. সন্তানের নির্ভুল বৈদিক নামকরণ (Helps with Child Naming)",
        hi: "3. नवजात शिशु का वैदिक नामकरण (Child Naming)",
        en: "3. Helps with the Naming of the Child",
      },
      desc: {
        bn: "প্রতিটি নক্ষত্র ৪টি চরণে (পাদ) বিভক্ত এবং প্রতি চরণের জন্য একটি নির্দিষ্ট পবিত্র বীজধ্বনি (নামাক্রম অক্ষর) নির্ধারিত থাকে। এই অক্ষর দিয়ে নাম রাখলে শিশুর জীবনে মহাজাগতিক শক্তির পূর্ণ আশীর্বাদ ও ভারসাম্য প্রতিষ্ঠিত হয়।",
        hi: "प्रत्येक नक्षत्र के 4 चरण होते हैं और हर चरण का एक निश्चित नामाक्षर (ध्वनि) होता है। शास्त्रानुसार उस अक्षर से नाम रखने पर बच्चे के जीवन में सकारात्मक ऊर्जा और सौभाग्य का संचार होता है।",
        en: "Every nakshatra has 4 padas (quarters), each carrying a sacred Vedic syllable (Namakshar). Choosing your child's first name starting with this cosmic syllable ensures harmonic resonance and lifelong vitality.",
      },
    },
    {
      title: {
        bn: "৪. পেশা ও ক্যারিয়ারের সঠিক দিকনির্দেশনা (Aids with Professional Career)",
        hi: "4. आजीविका एवं करियर मार्गदर्शन (Professional Career)",
        en: "4. Aids with Professional Career",
      },
      desc: {
        bn: "নক্ষত্রভেদে জাতক-জাতিকার সহজাত কর্মদক্ষতা ভিন্ন হয়। উদাহরণস্বরূপ, অশ্বিনী জাতক চিকিৎসা ও খেলাধুলায়, কৃত্তিকা জাতক রাজনীতি ও পরিচালনায় এবং অনুরাধা জাতক বিজ্ঞান ও গবেষণায় অসামান্য সাফল্য লাভ করেন।",
        hi: "प्रत्येक नक्षत्र की अपनी व्यावसायिक क्षमताएं होती हैं। उदाहरणतः अश्विनी नक्षत्र चिकित्सा एवं खेल में, कृत्तिका नेतृत्व व प्रशासन में, और चित्रा कला व डिजाइन में विशेष सफलता दिलाती है।",
        en: "Nakshatras rule distinctive vocational aptitudes. Ashwini thrives in emergency medicine and sports, Krittika excels in administration, while Chitra leads in design, architecture, and technology.",
      },
    },
    {
      title: {
        bn: "৫. স্বাস্থ্য ও রোগপ্রতিরোধ সংক্রান্ত পূর্বসতর্কতা (Anticipates Health Tendencies)",
        hi: "5. स्वास्थ्य संबंधी पूर्वाभास (Health Tendencies)",
        en: "5. Anticipates Possible Health Issues",
      },
      desc: {
        bn: "শরীরের প্রতিটি অঙ্গ ও ধাতুর নিয়ন্ত্রক কোনো না কোনো নক্ষত্র। জন্ম নক্ষত্রের দুর্বলতা বা পাপগ্রহের দৃষ্টি থাকলে সম্ভাব্য রোগ সম্পর্কে আগে থেকেই জানা যায় এবং বৈদিক জীবনধারা ও খাদ্যাভ্যাসের মাধ্যমে প্রতিরোধ সম্ভব হয়।",
        hi: "शरीर के अंग विशेष नक्षत्रों द्वारा संचालित होते हैं। जन्म नक्षत्र की जानकारी से संभावित मौसमी या दीर्घकालिक रोगों के प्रति पहले से सजग रहकर सही योग व उपचार किया जा सकता है।",
        en: "Every nakshatra rules specific physiological organs and doshas (Vata, Pitta, Kapha). Knowing your birth star allows proactive health habits, ayurvedic alignment, and timely prevention.",
      },
    },
    {
      title: {
        bn: "৬. আধ্যাত্মিক উত্তরণ ও পুরুষার্থ প্রাপ্তি (Aids in Spiritual Growth)",
        hi: "6. आध्यात्मिक उन्नति व जीवन उद्देश्य (Spiritual Growth)",
        en: "6. Aids in Spiritual Growth",
      },
      desc: {
        bn: "প্রতিটি জন্ম নক্ষত্রের সঙ্গে ধর্ম, অর্থ, কাম ও মোক্ষ — এই চার পুরুষার্থের একটি বিশেষ লক্ষ্য জড়িয়ে থাকে। উপাস্য দেবতা ও বীজমন্ত্র জপের মাধ্যমে জীবনের প্রকৃত উদ্দেশ্য ও আত্মার শান্তি উপলব্ধি করা যায়।",
        hi: "प्रत्येक नक्षत्र आत्मा के एक मुख्य उद्देश्य (धर्म, अर्थ, काम, मोक्ष) का प्रतिनिधित्व करता है। अपने इष्ट देव और बीज मंत्र की उपासना से आध्यात्मिक शांति और मानसिक एकाग्रता प्राप्त होती है।",
        en: "Every nakshatra is consecrated to one of the four Vedic life goals: Dharma, Artha, Kama, or Moksha. Chanting your star's Beej Mantra aligns your soul purpose and clears karmic blockages.",
      },
    },
  ],
};

export const ALL_27_NAKSHATRAS: NakshatraGuideItem[] = [
  {
    id: "ashwini",
    index: 1,
    name: { bn: "১. অশ্বিনী", hi: "1. अश्विनी", en: "1. Ashwini" },
    lord: { bn: "কেতু", hi: "केतु", en: "Ketu" },
    rashi: { bn: "মেষ (০° - ১৩°২০')", hi: "मेष (0° - 13°20')", en: "Aries (0° - 13°20')" },
    personality: {
      bn: "দ্রুতগতিসম্পন্ন, প্রাণবন্ত, সাহসী এবং যে কোনো সংকটময় পরিস্থিতিতে তাত্ক্ষণিক সমাধানকারী।",
      hi: "ऊर्जावान, फुर्तीले, साहसी और परिस्थितियों में तुरंत निर्णय लेने वाले।",
      en: "Quick, energetic, pioneering, and an instinctive problem-solver under pressure.",
    },
    career: {
      bn: "চিকিৎসা ও শল্যচিকিৎসা, ক্রীড়া, সেনাবাহিনী, উদ্যোক্তা এবং নিরাময় কলা।",
      hi: "चिकित्सा, खेलकूद, सेना, उद्यमिता और आपातकालीन सेवाएं।",
      en: "Medicine, surgery, athletics, entrepreneurship, and emergency healing arts.",
    },
    health: {
      bn: "মাথাব্যথা, মাইগ্রেন, চোখের সমস্যা এবং আকস্মিক চোট-আঘাত।",
      hi: "माइग्रेन, सिरदर्द, आंखों की समस्या और अचानक चोट।",
      en: "Migraines, head injuries, cerebral tension, and eye strain.",
    },
    relationship: {
      bn: "স্বাধীনচেতা, আবেগপ্রবণ এবং সম্পর্কে সততা ও গতিশীলতা প্রত্যাশী।",
      hi: "उत्साही, स्वतंत्र और रिश्ते में खुलापन पसंद करने वाले।",
      en: "Passionate, spontaneous, fiercely honest, and values personal freedom.",
    },
  },
  {
    id: "bharani",
    index: 2,
    name: { bn: "২. ভরণী", hi: "2. भरणी", en: "2. Bharani" },
    lord: { bn: "শুক্র", hi: "शुक्र", en: "Venus" },
    rashi: { bn: "মেষ (১৩°২০' - ২৬°৪০')", hi: "मेष (13°20' - 26°40')", en: "Aries (13°20' - 26°40')" },
    personality: {
      bn: "সৃজনশীল, দৃঢ়প্রতিজ্ঞ, সত্যনিষ্ঠ এবং জীবন রূপান্তরের অদম্য ক্ষমতার অধিকারী।",
      hi: "सृजनशील, दृढ़ निश्चयी और जीवन में बड़े परिवर्तन लाने वाले।",
      en: "Creative, determined, deeply transformative, and possesses intense willpower.",
    },
    career: {
      bn: "শিল্পকলা, আইন, চলচ্চিত্র, ফ্যাশন, জৈবপ্রযুক্তি এবং বিচার বিভাগ।",
      hi: "कला, कानून, सिनेमा, फैशन, न्यायपालिका और चिकित्सा।",
      en: "Arts, music, law, medicine, luxury fashion, and occult sciences.",
    },
    health: {
      bn: "প্রজনন অঙ্গ, কোমর ও নিম্ন পিঠের ব্যথা এবং অনিদ্রা।",
      hi: "प्रजनन अंग, कमर दर्द और अनिद्रा की समस्या।",
      en: "Reproductive health, lower back pain, and psychosomatic tension.",
    },
    relationship: {
      bn: "অত্যন্ত বিশ্বস্ত, প্রগাঢ় অনুভূতিপ্রবণ এবং গভীর আত্মিক বন্ধনপ্রেমী।",
      hi: "गहराई से निष्ठावान, समर्पित और आत्मिक संबंध चाहने वाले।",
      en: "Intensely loyal, emotionally protective, and forms profound bonds.",
    },
  },
  {
    id: "krittika",
    index: 3,
    name: { bn: "৩. কৃত্তিকা", hi: "3. कृत्तिका", en: "3. Krittika" },
    lord: { bn: "সূর্য", hi: "सूर्य", en: "Sun" },
    rashi: { bn: "মেষ - বৃষ (২৬°৪০' - ৪০°০০')", hi: "मेष - वृषभ (26°40' - 40°00')", en: "Aries - Taurus (26°40' - 40°00')" },
    personality: {
      bn: "তীক্ষ্ণ বুদ্ধিদীপ্ত, তেজস্বী, সত্যবাদী ও নীতিবান এবং অন্যায়ের সাথে আপসহীন।",
      hi: "तेजस्वी, स्पष्टवादी, महत्वाकांक्षी और उच्च नैतिक मूल्यों वाले।",
      en: "Sharp, radiant, ambitious, uncompromisingly truthful, and highly principled.",
    },
    career: {
      bn: "প্রশাসন, সরকারি উচ্চপদ, রাজনীতি, অধ্যাপনা, রন্ধনশিল্প ও প্রকৌশল।",
      hi: "प्रशासन, राजनीति, सैन्य सेवा, शिक्षण, खानपान और इंजीनियरिंग।",
      en: "Politics, public service, military, teaching, culinary arts, and management.",
    },
    health: {
      bn: "গলা, থাইরয়েড, টনসিল এবং উচ্চ রক্তচাপ বা পিত্তপ্রকোপ।",
      hi: "गला, थायरॉयड, टॉन्सिल और पित्त संबंधी विकार।",
      en: "Throat, neck, thyroid issues, fevers, and inflammatory tendencies.",
    },
    relationship: {
      bn: "দায়িত্ববান অভিভাবকসুলভ, স্পষ্টভাষী এবং জীবনসঙ্গীর উচ্চ মানদণ্ডাকাঙ্ক্ষী।",
      hi: "संरक्षक, स्पष्टवादी और जीवनसाथी से उच्च अपेक्षा रखने वाले।",
      en: "Protective, loyal, honest to a fault, and holds high expectations.",
    },
  },
  {
    id: "rohini",
    index: 4,
    name: { bn: "৪. রোহিণী", hi: "4. रोहिणी", en: "4. Rohini" },
    lord: { bn: "চন্দ্র", hi: "चंद्र", en: "Moon" },
    rashi: { bn: "বৃষ (৪০°০০' - ৫৩°২০')", hi: "वृषभ (40°00' - 53°20')", en: "Taurus (10°00' - 23°20')" },
    personality: {
      bn: "সৌন্দর্যপ্রিয়, কোমলভাষী, আকর্ষণীয় ব্যক্তিত্ব ও শিল্পবোধে সমৃদ্ধ।",
      hi: "सौंदर्य प्रेमी, मधुरभाषी, कलात्मक और मनमोहक व्यक्तित्व।",
      en: "Charming, artistic, sensory, charismatic, and emotionally rich.",
    },
    career: {
      bn: "ফ্যাশন, গ্ল্যামার, কৃষিশিল্প, অভ্যন্তর সাজসজ্জা, সংগীত ও খাদ্য ব্যবসা।",
      hi: "फैशन, अभिनय, कृषि, इंटीरियर डिजाइन, संगीत व होटल व्यवसाय।",
      en: "Arts, fashion, beauty, agriculture, interior design, music, and luxury commerce.",
    },
    health: {
      bn: "গলা, সর্দি-কফ, হরমোন ভারসাম্যহীনতা এবং অতিরিক্ত সংবেদনশীলতা।",
      hi: "गले में खराश, कफ, हार्मोनल असंतुलन और त्वचा विकार।",
      en: "Throat, vocal cords, thyroid, water retention, and seasonal colds.",
    },
    relationship: {
      bn: "পরম রোমান্টিক, মায়াময়, বিশ্বস্ত কিন্তু ক্ষেত্রবিশেষে ঈর্ষাকাতর হতে পারেন।",
      hi: "अत्यधिक रोमांटिक, भावुक, वफादार और कभी-कभार अधिकारवादी।",
      en: "Romantic, sensual, nurturing, loyal, but can lean possessive.",
    },
  },
  {
    id: "mrigashira",
    index: 5,
    name: { bn: "৫. মৃগশিরা", hi: "5. मृगशिरा", en: "5. Mrigashira" },
    lord: { bn: "মঙ্গল", hi: "मंगल", en: "Mars" },
    rashi: { bn: "বৃষ - মিথুন (৫৩°২০' - ৬৬°৪০')", hi: "वृषभ - मिथुन (53°20' - 66°40')", en: "Taurus - Gemini (23°20' - 36°40')" },
    personality: {
      bn: "অনুসন্ধিৎসু, চঞ্চল, জ্ঞানপিপাসু ও বন্ধুত্বপূর্ণ স্বভাবের।",
      hi: "जिज्ञासु, चंचल, शोधप्रिय, सौम्य और बहुआयामी प्रतिभा के धनी।",
      en: "Curious, investigative, gentle, restless, and a seeker of truth.",
    },
    career: {
      bn: "গবেষণা, ভ্রমণ ও পর্যটন, সাংবাদিকতা, জনসংযোগ, সফটওয়্যার ও বিক্রয়।",
      hi: "शोध, पत्रकारिता, पर्यटन, संचार, सॉफ्टवेयर और वाणिज्य।",
      en: "Research, travel, journalism, writing, software, sales, and communication.",
    },
    health: {
      bn: "কাঁধ, হাত, শ্বাসনালী এবং নার্ভাস সিস্টেমের ক্লান্তি।",
      hi: "कंधे, हाथ, श्वास नलिका और तंत्रिका तंत्र में कमजोरी।",
      en: "Shoulders, arms, throat, allergies, and nervous tension.",
    },
    relationship: {
      bn: "রোমান্টিক আদর্শবাদী, মানসিক যোগাযোগপ্রিয় এবং বুদ্ধিদীপ্ত সঙ্গকামী।",
      hi: "बौद्धिक आकर्षण पसंद करने वाले, विचारशील और संवेदनशील साथी।",
      en: "Intellectual romantic, affectionate, but requires mental stimulation.",
    },
  },
  {
    id: "ardra",
    index: 6,
    name: { bn: "৬. আর্দ্রা", hi: "6. आर्द्रा", en: "6. Ardra" },
    lord: { bn: "রাহু", hi: "राहु", en: "Rahu" },
    rashi: { bn: "মিথুন (৬৬°৪০' - ৮০°০০')", hi: "मिथुन (66°40' - 80°00')", en: "Gemini (6°40' - 20°00')" },
    personality: {
      bn: "গভীর বিশ্লেষণী মেধা, তীব্র সংবেদনশীলতা ও ঝড় সামলে ওঠার অদ্ভুত ক্ষমতা।",
      hi: "गहन विश्लेषक, जिज्ञासु, परिवर्तनकारी और तूफानी परिस्थितियों से उबरने वाले।",
      en: "Intense, analytical, intellectually powerful, and emotionally resilient.",
    },
    career: {
      bn: "তথ্যপ্রযুক্তি, এআই, ডেটা সায়েন্স, আবহাওয়া বিজ্ঞান, থেরাপি ও ইলেকট্রনিক্স।",
      hi: "आईटी, कृत्रिम बुद्धिमत्ता (AI), डेटा साइंस, अनुसंधान और इलेक्ट्रॉनिक्स।",
      en: "Software engineering, data science, AI, electronics, therapy, and crisis response.",
    },
    health: {
      bn: "ফুসফুস, স্নায়ুরোগ, এলার্জি এবং অতিরিক্ত মানসিক চাপ।",
      hi: "फेफड़े, श्वसन तंत्र, त्वचा की एलर्जी और तनाव।",
      en: "Lungs, respiratory passages, skin allergies, and high nervous fatigue.",
    },
    relationship: {
      bn: "গভীর ভাবাবেগপূর্ণ, নিবেদিতপ্রাণ তবে মেজাজের ওঠানামা সামলাতে হয়।",
      hi: "गहराई से जुड़ने वाले लेकिन भावनात्मक उतार-चढ़ाव से प्रभावित।",
      en: "Devoted, unconventional, seeks authenticity, but prone to mood swings.",
    },
  },
  {
    id: "punarvasu",
    index: 7,
    name: { bn: "৭. পুনর্বসু", hi: "7. पुनर्वसु", en: "7. Punarvasu" },
    lord: { bn: "বৃহস্পতি", hi: "बृहस्पति", en: "Jupiter" },
    rashi: { bn: "মিথুন - কর্কট (৮০°০০' - ৯৩°২০')", hi: "मिथुन - कर्क (80°00' - 93°20')", en: "Gemini - Cancer (20°00' - 33°20')" },
    personality: {
      bn: "আশাবাদী, ক্ষমাশীল, ধার্মিক, সৎ এবং বারবার প্রতিকূলতা পেরিয়ে বিজয়ী।",
      hi: "आशावादी, क्षमाशील, परोपकारी, सात्विक और बार-बार विजय पाने वाले।",
      en: "Optimistic, resilient, benevolent, philosophical, and a natural restorer.",
    },
    career: {
      bn: "শিক্ষকতা, পরামর্শদাতা, আধ্যাত্মিক সাধনা, স্থাপত্য, লেখালেখি ও প্রকাশনা।",
      hi: "शिक्षण, परामर्श, साहित्य, वास्तुकला, समाज सेवा और दर्शनशास्त्र।",
      en: "Education, counseling, architecture, civil aviation, writing, and philanthropy.",
    },
    health: {
      bn: "হৃদয়, ফুসফুস, যকৃত এবং হজমের সমস্যা।",
      hi: "पाचन क्रिया, यकृत (लीवर), फेफड़े और छाती से संबंधित समस्याएं।",
      en: "Chest, liver, stomach acidity, and respiratory allergies.",
    },
    relationship: {
      bn: "স্নেহময়, যত্নশীল, পরিবারকেন্দ্রিক ও বিশ্বস্ত সঙ্গী।",
      hi: "पारिवारिक, स्नेही, शांत और जीवनसाथी को संबल देने वाले।",
      en: "Nurturing, compassionate, family-oriented, and deeply loyal.",
    },
  },
  {
    id: "pushya",
    index: 8,
    name: { bn: "৮. পুষ্যা", hi: "8. पुष्य", en: "8. Pushya" },
    lord: { bn: "শনি", hi: "शनि", en: "Saturn" },
    rashi: { bn: "কর্কট (৯৩°২০' - ১০৬°৪০')", hi: "कर्क (93°20' - 106°40')", en: "Cancer (3°20' - 16°40')" },
    personality: {
      bn: "সমস্ত নক্ষত্রের মধ্যে পরম কল্যাণকারী, পরোপকারী, গম্ভীর ও নিঃস্বার্থ সেবক।",
      hi: "समस्त नक्षत्रों में सर्वश्रेष्ठ पोषक, धर्मपरायण, गंभीर और निःस्वार्थ सेवाभावी।",
      en: "The great nourisher: patient, benevolent, deeply moral, and spiritually elevated.",
    },
    career: {
      bn: "সরকারি প্রশাসন, বিচারালয়, আইন, সামাজিক সেবা, ট্রাস্ট ও শিক্ষা প্রতিষ্ঠান।",
      hi: "न्यायपालिका, उच्च प्रशासनिक पद, अध्यात्म, शिक्षा संस्थान और सामाजिक ट्रस्ट।",
      en: "Public administration, judiciary, philanthropy, spiritual leadership, and education.",
    },
    health: {
      bn: "বুকের সংক্রমণ, গ্যাস্ট্রিক, পিত্তপাথরি এবং রক্তের চাপ।",
      hi: "छाती का संक्रमण, पाचन विकार, पित्त और जोड़ों का दर्द।",
      en: "Stomach ailments, gallbladder, respiratory congestion, and breast tissue issues.",
    },
    relationship: {
      bn: "চিরস্থায়ী বিশ্বস্ততা, গভীর দায়িত্ববোধ ও পারিবারিক অভিভাবকত্ব।",
      hi: "अटूट निष्ठा, सुरक्षा की भावना और मर्यादाओं का पालन करने वाले।",
      en: "Unshakeably loyal, protective, paternal/maternal warmth, values stability.",
    },
  },
  {
    id: "ashlesha",
    index: 9,
    name: { bn: "৯. অশ্লেষা", hi: "9. अश्लेषा", en: "9. Ashlesha" },
    lord: { bn: "বুধ", hi: "बुध", en: "Mercury" },
    rashi: { bn: "কর্কট (১০৬°৪০' - ১২০°০০')", hi: "कर्क (106°40' - 120°00')", en: "Cancer (16°40' - 30°00')" },
    personality: {
      bn: "তীক্ষ্ণ মনস্তাত্ত্বিক বোধ, আত্মরক্ষাশীল, কৌশলবিদ এবং আধ্যাত্মিক কুণ্ডলিনী শক্তির প্রতীক।",
      hi: "कुशाग्र बुद्धि, मनोवैज्ञानिक सूझबूझ, गूढ़ विद्याओं के जानकार और रणनीतिकार।",
      en: "Intuitive, profound, strategic, hypnotic, and possesses sharp psychological insight.",
    },
    career: {
      bn: "মনোবিজ্ঞান, সাইবার নিরাপত্তা, গোয়েন্দা সংস্থা, রসায়নশাস্ত্র ও আধ্যাত্মিক যোগ।",
      hi: "मनोविज्ञान, जासूसी, साइबर सुरक्षा, रसायन शास्त्र और शोध कार्य।",
      en: "Psychology, toxicology, intelligence, pharmaceuticals, politics, and occult research.",
    },
    health: {
      bn: "পেটের নাড়ীভুঁড়ি, বিষক্রিয়া প্রবণতা, মানসিক উদ্বেগ ও বাতবেদনা।",
      hi: "पेट, आंतें, विषाक्तता, मानसिक चिंता और स्नायु विकार।",
      en: "Intestinal tract, stomach ulcers, anxiety, and hypersensitive nerves.",
    },
    relationship: {
      bn: "তীব্র প্রেমময়, অধিকারবোধসম্পন্ন কিন্তু বিশ্বাস অর্জন করতে সময় নেন।",
      hi: "गहरा समर्पण, अधिकार की भावना और विश्वास करने में समय लेने वाले।",
      en: "Intensely devoted, protective, guarded at first, but gives everything once trusted.",
    },
  },
  {
    id: "magha",
    index: 10,
    name: { bn: "১০. মঘা", hi: "10. मघा", en: "10. Magha" },
    lord: { bn: "কেতু", hi: "केतु", en: "Ketu" },
    rashi: { bn: "সিংহ (১২০°০০' - ১৩৩°২০')", hi: "सिंह (120°00' - 133°20')", en: "Leo (0°00' - 13°20')" },
    personality: {
      bn: "রাজকীয় মেজাজ, বংশমর্যাদাসচেতন, আত্মসম্মানী, নেতৃত্বদক্ষ ও পূর্বপুরুষের আশীর্বাদধন্য।",
      hi: "राजसी स्वभाव, स्वाभिमानी, उच्च नेतृत्व क्षमता और कुल परंपरा के संवाहक।",
      en: "Regal, commanding, proud, traditional, and blessed with ancestral dignity.",
    },
    career: {
      bn: "রাজনীতি, প্রশাসনিক শীর্ষপদ, ইতিহাস ও প্রত্নতত্ত্ব, বংশপরম্পরার ব্যবসা।",
      hi: "राजनीति, शीर्ष प्रशासनिक सेवा, पुरातत्व, इतिहास और पैतृक व्यवसाय।",
      en: "Politics, corporate governance, civil services, heritage institutions, and head of state.",
    },
    health: {
      bn: "হৃদপিণ্ড, মেরুদণ্ড, পিঠের ব্যথা এবং চোখের সমস্যা।",
      hi: "हृदय रोग, रीढ़ की हड्डी, पीठ दर्द और रक्तचाप।",
      en: "Heart, spine, back strain, and blood circulation issues.",
    },
    relationship: {
      bn: "মর্যাদাবোধসম্পন্ন, পরিবারপ্রধানের মতো আগলে রাখা কিন্তু অহংবোধ সামলানো জরুরি।",
      hi: "मर्यादापूर्ण, उदार, नेतृत्वकर्ता किंतु अहंकार से बचना आवश्यक।",
      en: "Generous, dignified, fiercely protective of lineage, demands mutual respect.",
    },
  },
  {
    id: "purva_phalguni",
    index: 11,
    name: { bn: "১১. পূর্ব ফাল্গুনী", hi: "11. पूर्वाफाल्गुनी", en: "11. Purva Phalguni" },
    lord: { bn: "শুক্র", hi: "शुक्र", en: "Venus" },
    rashi: { bn: "সিংহ (১৩৩°২০' - ১৪৬°৪০')", hi: "सिंह (133°20' - 146°40')", en: "Leo (13°20' - 26°40')" },
    personality: {
      bn: "আনন্দপ্রিয়, বন্ধুবৎসল, সুরসিক, শিল্প ও বিনোদনপ্রিয় এবং সৌভাগ্যবান।",
      hi: "आनंदप्रिय, मिलनसार, कला-संगीत प्रेमी, आकर्षक और भाग्यशाली।",
      en: "Playful, charming, sociable, affectionate, and a lover of arts and leisure.",
    },
    career: {
      bn: "বিনোদন, থিয়েটার, ফ্যাশন, সঙ্গীত, হোটেল শিল্প ও জনসংযোগ।",
      hi: "सिनेमा, संगीत, फैशन, जनसंपर्क, आतिथ्य (हॉस्पिटैलिटी) और इवेंट मैनेजमेंट।",
      en: "Entertainment, creative writing, cinema, luxury lifestyle, music, and public relations.",
    },
    health: {
      bn: "হৃদযন্ত্র, মেরুদণ্ডের নিচের অংশ ও রক্তসঞ্চালন জনিত জটিলতা।",
      hi: "हृदय, रक्त संचार, थकान और कमर का निचला हिस्सा।",
      en: "Circulatory issues, lumbar spine, and skin sensitivities.",
    },
    relationship: {
      bn: "অতিশয় রোমান্টিক, উদারমনা, দাম্পত্য সুখের প্রতি নিবেদিত।",
      hi: "रोमांस से भरपूर, स्नेही, उदार और जीवनसाथी को खुश रखने वाले।",
      en: "Warm, passionate, thrives on courtship, romance, and shared pleasures.",
    },
  },
  {
    id: "uttara_phalguni",
    index: 12,
    name: { bn: "১২. উত্তর ফাল্গুনী", hi: "12. उत्तराफाल्गुनी", en: "12. Uttara Phalguni" },
    lord: { bn: "সূর্য", hi: "सूर्य", en: "Sun" },
    rashi: { bn: "সিংহ - কন্যা (১৪৬°৪০' - ১৬০°০০')", hi: "सिंह - कन्या (146°40' - 160°00')", en: "Leo - Virgo (26°40' - 40°00')" },
    personality: {
      bn: "পরোপকারী, নির্ভরযোগ্য, প্রতিশ্রুতি রক্ষাকারী, সুশৃঙ্খল ও বন্ধু সহায়ক।",
      hi: "परोपकारी, वचनबद्ध, अनुशासित, सच्चे मित्र और सम्मानित नागरिक।",
      en: "Noble, dependable, philanthropic, disciplined, and an enduring friend.",
    },
    career: {
      bn: "সামাজিক কল্যাণ, দাতব্য ট্রাস্ট, কূটনীতি, আইন ও স্বাস্থ্য খাত।",
      hi: "समाज कल्याण, कूटनीति, कानून, स्वास्थ्य सेवा और वित्त प्रबंधन।",
      en: "Diplomacy, charity foundations, legal advocacy, public health, and auditing.",
    },
    health: {
      bn: "হজমের গোলযোগ, অন্ত্র, পিঠের পেশি এবং লিভারের চাপ।",
      hi: "पाचन संबंधी विकार, आंतें, पीठ की नसें और सिरदर्द।",
      en: "Digestive weakness, colon, lower abdomen, and muscular back stiffness.",
    },
    relationship: {
      bn: "বিবাহ ও সম্পর্কের স্থায়িত্বে বিশ্বাসী, স্থিতিশীল ও বিশ্বস্ত সাথী।",
      hi: "विवाह की पवित्रता में विश्वास, स्थिर और अटूट साथ निभाने वाले।",
      en: "Committed to lifelong marriage, dependable, treats vows with absolute honor.",
    },
  },
  {
    id: "hasta",
    index: 13,
    name: { bn: "১৩. হস্তা", hi: "13. हस्त", en: "13. Hasta" },
    lord: { bn: "চন্দ্র", hi: "चंद्र", en: "Moon" },
    rashi: { bn: "কন্যা (১৬০°০০' - ১৭৩°২০')", hi: "कन्या (160°00' - 173°20')", en: "Virgo (10°00' - 23°20')" },
    personality: {
      bn: "হাতের কাজে নিপুণ, বুদ্ধিমত্তাসম্পন্ন, চতুর, রসিক ও যেকোনো জটিল কাজ সহজকারী।",
      hi: "हस्तशिल्प में निपुण, बुद्धिमान, चतुर, समय के पाबंद और व्यावहारिक।",
      en: "Dexterous, witty, detail-oriented, pragmatic, and skilled with hands and mind.",
    },
    career: {
      bn: "হস্তশিল্প, চারুকলা, সার্জারি, লেখালেখি, হিসাবরক্ষণ ও ম্যাজিক/কৌতুক।",
      hi: "शल्य चिकित्सा (सर्जरी), हस्तशिल्प, चार्टर्ड अकाउंटेंसी, लेखन और आईटी।",
      en: "Surgery, precision engineering, writing, graphic design, accounting, and artisanal craft.",
    },
    health: {
      bn: "হাতের তালু ও কবজি, পেট, নার্ভাস বদহজম এবং চর্মরোগ।",
      hi: "हाथ व कलाई, आंतें, गैस की समस्या और त्वचा विकार।",
      en: "Hands, wrists, digestive flora, IBS, and seasonal allergy.",
    },
    relationship: {
      bn: "ব্যবহারিক যত্নশীল, বুদ্ধিদীপ্ত আলাপচারিতায় সমৃদ্ধ ও সেবাপরায়ণ।",
      hi: "सेवाभावी, संवेदनशील, बातों में निपुण और भरोसेमंद साथी।",
      en: "Helpful, expressive, intellectually companionable, attentive to little details.",
    },
  },
  {
    id: "chitra",
    index: 14,
    name: { bn: "১৪. চিত্রা", hi: "14. चित्रा", en: "14. Chitra" },
    lord: { bn: "মঙ্গল", hi: "मंगल", en: "Mars" },
    rashi: { bn: "কন্যা - তুলা (১৭৩°২০' - ১৮৬°৪০')", hi: "कन्या - तुला (173°20' - 186°40')", en: "Virgo - Libra (23°20' - 36°40')" },
    personality: {
      bn: "স্থপতি বিশ্বকর্মার প্রতীক — মার্জিত রূপকার, নান্দনিক, সৃষ্টিশীল ও দীপ্তিময়।",
      hi: "विश्वकर्मा का स्वरूप—अद्भुत निर्माता, कलाप्रेमी, आत्मविश्वासी और आकर्षक।",
      en: "The master builder: aesthetic, architect of forms, radiant, and intensely creative.",
    },
    career: {
      bn: "স্থাপত্যশিল্প, ইন্টেরিয়র, ফ্যাশন, রত্নব্যবসা, চলচ্চিত্র নির্মাণ ও ইঞ্জিনিয়ারিং।",
      hi: "वास्तुकला (आर्किटेक्चर), फैशन, आभूषण, फिल्म निर्माण और डिजाइनिंग।",
      en: "Architecture, interior design, fine jewelry, cinema direction, structural engineering.",
    },
    health: {
      bn: "বৃক্ক (কিডনি), মূত্রনালী, পেটের নিচের অংশ ও ত্বকের শুষ্কতা।",
      hi: "गुर्दे (किडनी), मूत्राशय, त्वचा विकार और पीठ का निचला भाग।",
      en: "Kidneys, bladder, lower abdominal muscles, and dry skin.",
    },
    relationship: {
      bn: "নান্দনিক সঙ্গী অন্বেষণকারী, আবেগপ্রবণ ও স্বাধীন চিন্তাশীল।",
      hi: "आकर्षक, स्वतंत्र विचारों वाले और सुंदरता व कला की कद्र करने वाले।",
      en: "Appreciates beauty and elegance in partner, passionate, needs personal creative space.",
    },
  },
  {
    id: "swati",
    index: 15,
    name: { bn: "১৫. স্বাতী", hi: "15. स्वाति", en: "15. Swati" },
    lord: { bn: "রাহু", hi: "राहु", en: "Rahu" },
    rashi: { bn: "তুলা (১৮৬°৪০' - ২০০°০০')", hi: "तुला (186°40' - 200°00')", en: "Libra (6°40' - 20°00')" },
    personality: {
      bn: "পবনদেবের প্রতীক — স্বাধীনচেতা, নম্র, দূরদর্শী, মিষ্টভাষী ও গতিশীল।",
      hi: "पवन स्वरूप—स्वतंत्रता प्रेमी, मृदुभाषी, कूटनीतिज्ञ, न्यायप्रिय और लचीले।",
      en: "Free-spirited like the wind: diplomatic, refined, intuitive, and independent.",
    },
    career: {
      bn: "ব্যবসা-বাণিজ্য, এভিয়েশন, আন্তর্জাতিক আমদানি-রপ্তানি, আইন ও রাজনীতি।",
      hi: "विमानन (एविएशन), अंतरराष्ट्रीय व्यापार, कानून, राजनीति और विपणन।",
      en: "International trade, aviation, law, arbitration, sales, and modern media.",
    },
    health: {
      bn: "মূত্রথলি, কিডনি, ত্বকের আর্দ্রতা ও বায়ুর প্রকোপ (গ্যাস/বাত)।",
      hi: "किडनी, त्वचा में रूखापन, वात विकार और यूरिनरी ट्रैक्ट।",
      en: "Kidneys, urinary tract, respiratory allergies, and dry skin.",
    },
    relationship: {
      bn: "শান্তিপূর্ণ সমাধানকামী, উদার, ব্যক্তিগত স্বাধীনতা প্রদানকারী।",
      hi: "शांतिप्रिय, सामंजस्यवादी, उदार और एक-दूसरे के सम्मान में विश्वास रखने वाले।",
      en: "Harmonious, gentle, dislikes conflict, grants partner ample space.",
    },
  },
  {
    id: "vishakha",
    index: 16,
    name: { bn: "১৬. বিশাখা", hi: "16. विशाखा", en: "16. Vishakha" },
    lord: { bn: "বৃহস্পতি", hi: "बृहस्पति", en: "Jupiter" },
    rashi: { bn: "তুলা - বৃশ্চিক (২০০°০০' - ২১৩°২০')", hi: "तुला - वृश्चिक (200°00' - 213°20')", en: "Libra - Scorpio (20°00' - 33°20')" },
    personality: {
      bn: "লক্ষ্যভেদী, অদম্য উচ্চাকাঙ্ক্ষী, অধ্যবসায়ী এবং বিজয় অর্জনে প্রতিজ্ঞাবদ্ধ।",
      hi: "लक्ष्य पर केंद्रित, अत्यंत महत्वाकांक्षी, साहसी और विजय प्राप्त करने वाले।",
      en: "Goal-oriented, ambitious, focused, intensely persevering, and victory-driven.",
    },
    career: {
      bn: "আইন, বিচারালয়, গবেষণা, কূটনীতি, সামরিক কৌশল ও শীর্ষ নেতৃত্ব।",
      hi: "वकालत, राजनीति, शोध, सैन्य कमान, खेल और व्यापारिक विस्तार।",
      en: "Litigation, politics, high-stakes finance, corporate research, and advocacy.",
    },
    health: {
      bn: "প্রজনন অঙ্গ, মূত্রাশয়, রক্তনালী এবং মানসিক ক্লান্তি।",
      hi: "प्रजनन अंग, मूत्राशय, रक्तचाप और अत्यधिक परिश्रम से थकान।",
      en: "Reproductive organs, urinary system, blood pressure, and burnout.",
    },
    relationship: {
      bn: "প্রবল নিষ্ঠাবান কিন্তু সম্পর্কে প্রতিদ্বন্দ্বিতামূলক মনোভাব এড়ানো দরকার।",
      hi: "निष्ठावान, महत्वाकांक्षी लेकिन अहंकार और ईर्ष्या से बचाव जरूरी।",
      en: "Passionate, resolute, loyal, though must guard against possessiveness.",
    },
  },
  {
    id: "anuradha",
    index: 17,
    name: { bn: "১৭. অনুরাধা", hi: "17. अनुराधा", en: "17. Anuradha" },
    lord: { bn: "শনি", hi: "शनि", en: "Saturn" },
    rashi: { bn: "বৃশ্চিক (২১৩°২০' - ২২৬°৪০')", hi: "वृश्चिक (213°20' - 226°40')", en: "Scorpio (3°20' - 16°40')" },
    personality: {
      bn: "মিত্রতা ও দেবভক্তির প্রতীক — খাঁটি বন্ধু, ধৈর্যশীল, সুদূরপ্রসারী সাফল্যকামী।",
      hi: "सच्चे मित्र, भक्ति भाव से युक्त, संगठक, धैर्यवान और विदेशों में सफल।",
      en: "The star of devotion: cooperative, resilient, patient, and a loyal friend.",
    },
    career: {
      bn: "আন্তর্জাতিক সংগঠন, খননশিল্প, প্রকৌশল, সঙ্গীত, সামাজিক ঐক্য ও আধ্যাত্মিকতা।",
      hi: "अंतरराष्ट्रीय संगठन, संगीत, इंजीनियरिंग, यात्रा, सामाजिक कार्य व योग।",
      en: "International organizations, mining, engineering, music, therapy, and foreign affairs.",
    },
    health: {
      bn: "পেটের নিম্নভাগ, পিত্তথলি, কোষ্ঠকাঠিন্য ও অনিয়মিত ঋতুচক্র।",
      hi: "पेट का निचला हिस्सा, बवासीर, कब्ज और मासिक धर्म विकार।",
      en: "Pelvic area, colon, piles/constipation, and reproductive health.",
    },
    relationship: {
      bn: "গভীর প্রেমময়, নিঃস্বার্থ বন্ধুত্বের ভিত্তিতে গড়া প্রেম ও অটুট অঙ্গীকার।",
      hi: "अगाध प्रेम, समर्पण और जीवन के हर मोड़ पर साथ निभाने वाले।",
      en: "Devoted partner, builds romance on genuine friendship and lasting trust.",
    },
  },
  {
    id: "jyeshtha",
    index: 18,
    name: { bn: "১৮. জ্যেষ্ঠা", hi: "18. ज्येष्ठा", en: "18. Jyeshtha" },
    lord: { bn: "বুধ", hi: "बुध", en: "Mercury" },
    rashi: { bn: "বৃশ্চিক (২২৬°৪০' - ২৪০°০০')", hi: "वृश्चिक (226°40' - 240°00')", en: "Scorpio (16°40' - 30°00')" },
    personality: {
      bn: "জ্যেষ্ঠ ভ্রাতৃসুলভ কর্তৃত্ব, ক্ষুরধার মেধা, সাহসী ও আত্মমর্যাদাবান।",
      hi: "नेतृत्ववान, तीक्ष्ण बुद्धि, परिवार के रक्षक, साहसी और मान-प्रतिष्ठा प्रिय।",
      en: "Seniority, protective authority, sharp intellect, courage, and pride.",
    },
    career: {
      bn: "সামরিক বা পুলিশ নেতৃত্ব, প্রশাসন, গোপনীয় তদন্ত, রাজনীতি ও সাংবাদিকতা।",
      hi: "पुलिस व रक्षा सेवा, प्रशासनिक पद, गुप्तचर संस्थाएं, पत्रकारिता और प्रबंधन।",
      en: "Military defense, corporate leadership, investigative journalism, and telecommunications.",
    },
    health: {
      bn: "কোমর, অণ্ডকোষ বা জরায়ু, মাংসপেশির টান ও মানসিক চাপ।",
      hi: "गर्भाशय या प्रजनन अंग, पेट में दर्द, रीढ़ और मांसपेशियों का तनाव।",
      en: "Reproductive organs, pelvic muscles, colon, and high nervous stress.",
    },
    relationship: {
      bn: "প্রতিরক্ষামূলক অভিভাবক, অত্যন্ত বিশ্বস্ত কিন্তু কর্তৃত্বপূর্ণ হতে পারেন।",
      hi: "सुरक्षा देने वाले, समर्पित किंतु कभी-कभार अधिकार जताने वाले।",
      en: "Fiercely protective, loyal guardian, though can lean authoritative.",
    },
  },
  {
    id: "mula",
    index: 19,
    name: { bn: "১৯. মূলা", hi: "19. मूल", en: "19. Mula" },
    lord: { bn: "কেতু", hi: "केतु", en: "Ketu" },
    rashi: { bn: "ধনু (২৪০°০০' - ২৫৩°২০')", hi: "धनु (240°00' - 253°20')", en: "Sagittarius (0°00' - 13°20')" },
    personality: {
      bn: "মূল বা শিকড়সন্ধানী — গভীর আধ্যাত্মিক, গবেষক, নির্ভীক ও সত্যের অন্তরালে পৌঁছাতে উন্মুখ।",
      hi: "जड़ों की खोज करने वाले, निर्भीक, दार्शनिक, खोजी और आध्यात्मिक।",
      en: "Deep-rooted investigator, philosopher, radical truth-seeker, and transformative.",
    },
    career: {
      bn: "গবেষণা, আয়ুর্বেদ ও ভেষজবিজ্ঞান, ভূতত্ত্ব, দর্শনাধ্যাপনা ও আধ্যাত্মিক গুরু।",
      hi: "वैज्ञानिक अनुसंधान, आयुर्वेद, भूगर्भ विज्ञान, दर्शन और अध्यात्म।",
      en: "Deep science research, herbal medicine, geology, philosophy, and spiritual mentoring.",
    },
    health: {
      bn: "কোমর, নিতম্ব, সায়াটিকা নার্ভ ও বাতবেদনা।",
      hi: "नितंब, कूल्हे, साइटिका का दर्द और जोड़ों में सूजन।",
      en: "Hips, thighs, sciatic nerve pain, and rheumatic tendencies.",
    },
    relationship: {
      bn: "সত্যবাদী, জটিলতামুক্ত, তবে স্বাধীনতাবোধের কারণে বোঝাপড়ার প্রয়োজন।",
      hi: "स्पष्टवादी, पारदर्शी, गहरे संबंध पसंद करने वाले किंतु स्वतंत्रता जरूरी।",
      en: "Candid, intense, values truth over comfort, needs mutual autonomy.",
    },
  },
  {
    id: "purva_ashadha",
    index: 20,
    name: { bn: "২০. পূর্বাষাঢ়া", hi: "20. पूर्वाषाढ़ा", en: "20. Purva Ashadha" },
    lord: { bn: "শুক্র", hi: "शुक्र", en: "Venus" },
    rashi: { bn: "ধনু (২৫৩°২০' - ২৬৬°৪০')", hi: "धनु (253°20' - 266°40')", en: "Sagittarius (13°20' - 26°40')" },
    personality: {
      bn: "অপরাজেয় শক্তির প্রতীক — আত্মবিশ্বাসী, প্রজ্ঞাবান, জনপ্রিয় ও আকর্ষণীয় বাগ্মী।",
      hi: "अपराजेय शक्ति के प्रतीक—आत्मविश्वासी, प्रभावशाली वक्ता, लोकप्रिय और दार्शनিক।",
      en: "The unconquerable: charismatic, eloquent, influential, proud, and philosophical.",
    },
    career: {
      bn: "নৌবিদ্যা ও সমুদ্রবাণিজ্য, আইন, চলচ্চিত্র, পর্যটন, অনুপ্রেরণামূলক বক্তা।",
      hi: "समुद्री व्यापार, कानून, कला, पर्यटन, प्रेरक वक्ता (मोटिवेशनल स्पीकर)।",
      en: "Maritime commerce, international law, public speaking, travel, and film arts.",
    },
    health: {
      bn: "উরু, নিতম্ব, ডায়াবেটিস ও রক্তে শর্করা সংক্রান্ত সমস্যা।",
      hi: "जांघें, कूल्हे, रक्त शर्करा (मधुमेह) और श्वसन संबंधी कष्ट।",
      en: "Thighs, hips, blood circulation, bladder, and sugar metabolism.",
    },
    relationship: {
      bn: "উদারমনা, মহিমান্বিত, সম্পর্কের সৌন্দর্য ও মানসিক মর্যাদাকামী।",
      hi: "उदार, निष्ठावान, जीवनसाथी का मान बढ़ाने वाले और स्नेही।",
      en: "Warm, noble, seeks admiration and mutual respect, deeply generous.",
    },
  },
  {
    id: "uttara_ashadha",
    index: 21,
    name: { bn: "২১. উত্তরাষাঢ়া", hi: "21. उत्तराषाढ़ा", en: "21. Uttara Ashadha" },
    lord: { bn: "সূর্য", hi: "सूर्य", en: "Sun" },
    rashi: { bn: "ধনু - মকর (২৬৬°৪০' - ২৮০°০০')", hi: "धनु - मकर (266°40' - 280°00')", en: "Sagittarius - Capricorn (26°40' - 40°00')" },
    personality: {
      bn: "চিরন্তন বিজয়ের প্রতীক — নীতিপরায়ণ, ধৈর্যশীল, সম্মানিত, বিনয়ী ও অটল ব্রতী।",
      hi: "शाश्वत विजय के प्रतीक—धर्मनिष्ठ, धैर्यवान, शांत, विनम्र और दृढ़ संकल्पी।",
      en: "Universal victory: righteous, patient, honorable, humble, and enduringly focused.",
    },
    career: {
      bn: "উচ্চ সরকারি পদ, বিচারালয়, গবেষণা প্রতিষ্ঠান, আন্তর্জাতিক কূটনীতি ও সমাজ সংস্কার।",
      hi: "उच्च प्रशासनिक पद, न्यायपालिका, शोध संस्थान, कूटनीति और समाज सुधार।",
      en: "Judiciary, senior civil service, public reform, scientific research, and diplomacy.",
    },
    health: {
      bn: "হাঁটু, হাড়, ত্বক এবং মানসিক অবসাদ।",
      hi: "घुटने, हड्डियां, त्वचा रोग और जोड़ों में दर्द।",
      en: "Knees, skin, bone density, eye strain, and digestive fire.",
    },
    relationship: {
      bn: "সুদৃঢ় বিশ্বস্ততা, শান্ত গভীর ভালোবাসা ও আদর্শ পারিবারিক স্থায়িত্ব।",
      hi: "अगाध निष्ठा, शांत प्रेम और पारिवारिक मर्यादाओं के प्रति पूर्ण समर्पित।",
      en: "Profoundly dependable, quiet and constant in affection, builds lasting legacy.",
    },
  },
  {
    id: "shravana",
    index: 22,
    name: { bn: "২২. শ্রবণা", hi: "22. श्रवण", en: "22. Shravana" },
    lord: { bn: "চন্দ্র", hi: "चंद्र", en: "Moon" },
    rashi: { bn: "মকর (২৮০°০০' - ২৯৩°২০')", hi: "मकर (280°00' - 293°20')", en: "Capricorn (10°00' - 23°20')" },
    personality: {
      bn: "শ্রবণ ও বিদ্যার প্রতীক — ধৈর্যশীল শ্রোতা, প্রজ্ঞাবান, সুপণ্ডিত ও সদাচরণশীল।",
      hi: "ज्ञान और श्रवण के प्रतीक—उत्कृष्ट श्रोता, विद्वान, सदाचारी और संवेदनशील।",
      en: "The ear of the cosmos: master listener, scholarly, observant, and respectful of tradition.",
    },
    career: {
      bn: "শিক্ষকতা, সংবাদমাধ্যম ও সম্প্রচার, সঙ্গীত, মনোবিজ্ঞান ও লাইব্রেরি সায়েন্স।",
      hi: "शिक्षा, मीडिया व प्रसारण, संगीत, भाषा विज्ञान, परामर्श और लेखन।",
      en: "Broadcasting, music, audio engineering, linguistics, teaching, and counseling.",
    },
    health: {
      bn: "কান, শ্রবণযন্ত্র, হাঁটু, চর্মরোগ ও স্নায়বিক দুর্বলতা।",
      hi: "कान, घुटने, त्वचा रोग और वात संबंधी विकार।",
      en: "Ears, hearing, knees, skin, and lymphatic circulation.",
    },
    relationship: {
      bn: "সঙ্গীর কথা মন দিয়ে শোনেন, পরম সংবেদনশীল ও পারিবারিক শান্তিপ্রিয়।",
      hi: "जीवनसाथी की भावनाओं को समझने वाले, शांत, सहयोगी और स्नेही।",
      en: "Deeply empathetic, attentive listener, creates peaceful domestic harmony.",
    },
  },
  {
    id: "dhanishta",
    index: 23,
    name: { bn: "২৩. ধনিষ্ঠা", hi: "23. धनिष्ठा", en: "23. Dhanishta" },
    lord: { bn: "মঙ্গল", hi: "मंगल", en: "Mars" },
    rashi: { bn: "মকর - কুম্ভ (২৯৩°২০' - ৩০৬°৪০')", hi: "मकर - कुंभ (293°20' - 306°40')", en: "Capricorn - Aquarius (23°20' - 36°40')" },
    personality: {
      bn: "সুর ও ঐশ্বর্যের প্রতীক — সঙ্গীতপ্রিয়, উদারহৃদয়, দুঃসাহসী ও সম্পদশালী।",
      hi: "संगीत व समृद्धि के प्रतीक—उदार, साहसी, लयबद्ध प्रतिभा और धनवान।",
      en: "Rhythm and abundance: musical, generous, bold, athletic, and prosperous.",
    },
    career: {
      bn: "সঙ্গীত ও নৃত্য, ক্রীড়া, রিয়েল এস্টেট, ব্যাংকিং, শল্যচিকিৎসা ও বিনোদন।",
      hi: "संगीत, नृत्य, खेल, रियल एस्टेट, बैंकिंग, सर्जन और अभिनय।",
      en: "Music, choreography, athletics, real estate, investment banking, and surgery.",
    },
    health: {
      bn: "পায়ের গোড়ালি, হাঁটু, রক্তচাপ ও স্নায়ুর টান।",
      hi: "पिंडलियां, घुटने, टखने, रक्त संचार और सूजन।",
      en: "Ankles, shins, cardiac rhythm, and blood circulation.",
    },
    relationship: {
      bn: "উদারমনা, নিবেদিত, তবে স্বাধীন জীবনধারা ও পারিবারিক ভারসাম্যের যত্ন নিতে হয়।",
      hi: "उदार, स्नेही लेकिन स्वतंत्र जीवनशैली पसंद करने वाले।",
      en: "Warm, supportive, protective, needs balance between work and marriage.",
    },
  },
  {
    id: "shatabhisha",
    index: 24,
    name: { bn: "২৪. শতভিষা", hi: "24. शतभिषा", en: "24. Shatabhisha" },
    lord: { bn: "রাহু", hi: "राहु", en: "Rahu" },
    rashi: { bn: "কুম্ভ (৩০৬°৪০' - ৩২০°০০')", hi: "कुंभ (306°40' - 320°00')", en: "Aquarius (6°40' - 20°00')" },
    personality: {
      bn: "শত নিরাময়কারী — রহস্যময়, স্বতন্ত্র চিন্তাবিদ, সত্যান্বেষী ও চিকিৎসাগুণসম্পন্ন।",
      hi: "सौ चिकित्सकों का स्वरूप—गूढ़, स्वतंत्र विचारक, शोधकर्ता और उपचारात्मक शक्ति वाले।",
      en: "The hundred healers: visionary, solitary thinker, scientific, and profoundly healing.",
    },
    career: {
      bn: "ফার্মাসিউটিক্যালস, চিকিৎসাবিজ্ঞান, জ্যোতির্বিজ্ঞান, মহাকাশ গবেষণা ও সাইবার সিকিউরিটি।",
      hi: "औषधि विज्ञान, चिकित्सा, खगोल विज्ञान, अंतरिक्ष शोध और उन्नत तकनीक।",
      en: "Medicine, pharmaceuticals, astronomy, space science, radar, and cybersecurity.",
    },
    health: {
      bn: "পায়ের গোড়ালি, হৃৎপিণ্ডের ছন্দ, অনিদ্রা ও বাতরোগ।",
      hi: "टखने, पिंडलियां, अनिद्रा, हृदय की धड़कन और वात रोग।",
      en: "Ankles, calves, irregular heart rhythms, insomnia, and nervous disorders.",
    },
    relationship: {
      bn: "রহস্যময় আকর্ষণ, একান্ত সময়প্রিয় এবং প্রগাঢ় মানসিক সান্নিধ্যকামী।",
      hi: "गहराई से जुड़ने वाले, एकांतप्रिय और बौद्धिक सामंजस्य चाहने वाले।",
      en: "Introspective, deeply affectionate once trust forms, values personal solitude.",
    },
  },
  {
    id: "purva_bhadrapada",
    index: 25,
    name: { bn: "২৫. পূর্ব ভাদ্রপদ", hi: "25. पूर्वाभाद्रपद", en: "25. Purva Bhadrapada" },
    lord: { bn: "বৃহস্পতি", hi: "बृहस्पति", en: "Jupiter" },
    rashi: { bn: "কুম্ভ - মীন (৩২০°০০' - ৩৩৩°২০')", hi: "कुंभ - मीन (320°00' - 333°20')", en: "Aquarius - Pisces (20°00' - 33°20')" },
    personality: {
      bn: "তীব্র রূপান্তরকামী — ভাবুক, আদর্শবাদী, অতীন্দ্রিয় জ্ঞানের অনুরাগী ও আধ্যাত্মিক যোদ্ধা।",
      hi: "तीव्र रूपांतरणकारी—दार्शनिक, आदर्शवादी, गूढ़ विद्याओं के प्रेमी और आध्यात्मिक।",
      en: "Transformational, mystical, deeply reflective, idealistic, and an esoteric seeker.",
    },
    career: {
      bn: "মনস্তত্ত্ব, আধ্যাত্মিক সাধনা, জ্যোতিষ, উচ্চতর গবেষণা, শিক্ষকতা ও সমাজসংস্কার।",
      hi: "मनोविज्ञान, अध्यात्म, ज्योतिष, उच्च शोध, साहित्य और समाज सुधार।",
      en: "Psychology, occult philosophy, astrology, hospice/palliative care, and literature.",
    },
    health: {
      bn: "পায়ের পাতা, গোড়ালি, রক্তসংবহন ও লিভারের সংবেদনশীলতা।",
      hi: "पैर, टखने, रक्त संचार, लीवर और अनिद्रा।",
      en: "Feet, ankles, circulation, liver sensitivity, and sleep disruptions.",
    },
    relationship: {
      bn: "গভীর ভাবাবেগপূর্ণ, আদর্শিক আত্মিক সঙ্গ অন্বেষণকারী।",
      hi: "गहरी भावनाएं, आत्मिक प्रेम की तलाश और जीवनसाथी को समझने वाले।",
      en: "Intense, soul-level romance, seeks spiritual unity and emotional depth.",
    },
  },
  {
    id: "uttara_bhadrapada",
    index: 26,
    name: { bn: "২৬. উত্তর ভাদ্রপদ", hi: "26. उत्तराभाद्रपद", en: "26. Uttara Bhadrapada" },
    lord: { bn: "শনি", hi: "शनि", en: "Saturn" },
    rashi: { bn: "মীন (৩৩৩°২০' - ৩৪৬°৪০')", hi: "मीन (333°20' - 346°40')", en: "Pisces (3°20' - 16°40')" },
    personality: {
      bn: "মহাশান্ত ও সমুদ্রের ন্যায় গভীর — ধৈর্যশীল, দয়াবান, আত্মসংযমী, সুরক্ষক ও দার্শনিক।",
      hi: "समुद्र जैसी गहराई—शांत, दयालु, आत्म-नियंत्रित, रक्षक और अत्यंत धैर्यवान।",
      en: "Deep wisdom: serene, benevolent, self-controlled, patient, and deeply grounded.",
    },
    career: {
      bn: "মেডিটেশন ও যোগ, সামুদ্রিক বিজ্ঞান, মানবসেবা, চিকিৎসা, উচ্চ আইন ও দর্শনশাস্ত্র।",
      hi: "योग व ध्यान, समुद्र विज्ञान, समाज सेवा, चिकित्सा और दर्शनशास्त्र।",
      en: "Meditation, yoga sciences, oceanography, humanitarian law, and philanthropy.",
    },
    health: {
      bn: "পায়ের পাতা, ঠান্ডা লাগার প্রবণতা, গ্রন্থি ও লসিকা তন্ত্র।",
      hi: "पैर, कफ की अधिकता, लसीका तंत्र (लिम्फैटिक) और पाचन।",
      en: "Feet, toes, lymphatic system, seasonal fluid retention, and colds.",
    },
    relationship: {
      bn: "অকৃত্রিম স্নেহশীল, শান্ত ও ক্ষমাশীল, গভীর শান্তিপ্রদায়ক জীবনসঙ্গী।",
      hi: "अत्यंत स्नेही, क्षमाशील, शांत और जीवनसाथी को आत्मिक शांति देने वाले।",
      en: "Nurturing, compassionate, forgiving, and brings peaceful grounding to family.",
    },
  },
  {
    id: "revati",
    index: 27,
    name: { bn: "২৭. রেবতী", hi: "27. रेवती", en: "27. Revati" },
    lord: { bn: "বুধ", hi: "बुध", en: "Mercury" },
    rashi: { bn: "মীন (৩৪৬°৪০' - ৩৬০°০০')", hi: "मीन (346°40' - 360°00')", en: "Pisces (16°40' - 30°00')" },
    personality: {
      bn: "রাশিচক্রের অন্তিম নক্ষত্র — করুণাময়, মোক্ষপ্রদায়ী, জীবপ্রেমী ও স্বপ্নদর্শী।",
      hi: "अंतिम नक्षत्र—अत्यंत दयालु, परोपकारी, कलात्मक, पशु प्रेमी और मोक्षगामी।",
      en: "The celestial shepherd: compassionate, nurturing, artistic, visionary, and gentle.",
    },
    career: {
      bn: "পশুকल्याण ও পরিবেশবিদ্যা, শিল্পকলা, আধ্যাত্মিক শিক্ষা, সঙ্গীত ও থেরাপি।",
      hi: "पशु कल्याण, पर्यावरण, कला, संगीत, बाल विकास और चिकित्सा सेवा।",
      en: "Animal welfare, environmental sciences, arts, music therapy, and spiritual care.",
    },
    health: {
      bn: "পায়ের পাতা, নখ, অনিদ্রা এবং অ্যালার্জি জনিত সংবেদনশীলতা।",
      hi: "पैर के तलवे, नाखून, नींद की कमी और त्वचा की संवेदनशीलता।",
      en: "Feet, toes, nervous digestion, immunity, and sleep cycles.",
    },
    relationship: {
      bn: "নিঃস্বার্থ প্রেমময়, পরোপকারী, মধুর স্বভাবের স্বপ্নিল সঙ্গী।",
      hi: "निःस्वार्थ प्रेम, कोमल स्वभाव, वफादार और सुख-दुःख में साथ निभाने वाले।",
      en: "Selflessly affectionate, sweet-tempered, romantic idealist, deeply loyal.",
    },
  },
];

export const NAKSHATRA_RELATED_TOOLS = [
  {
    title: { bn: "ফ্রি জন্ম কুণ্ডলী", hi: "फ्री जन्म कुंडली", en: "Free Janam Kundli" },
    desc: {
      bn: "আপনার সম্পূর্ণ জন্মছক, ১২টি ভাব এবং সমস্ত গ্রহের সঠিক ডিগ্রি জানুন।",
      hi: "अपनी संपूर्ण जन्म कुंडली, 12 भाव और सभी ग्रहों की स्थिति जानें।",
      en: "Generate your complete Vedic birth chart with 12 houses and planetary degrees.",
    },
    href: "/kundli",
    icon: "Scroll",
  },
  {
    title: { bn: "কুন্ডলী মিলন ও রাজযোটক", hi: "कुंडली मिलान", en: "Kundli Matching" },
    desc: {
      bn: "৩৬ গুণ মিলন, মাঙ্গলিক দোষ ও রাজযোটক বিচারের প্রামাণ্য বিশ্লেষণ।",
      hi: "अष्टकूट 36 गुण मिलान, मांगलिक दोष एवं संपूर्ण वैवाहिक सामंजस्य।",
      en: "Authentic 36 Guna Ashtakoota compatibility and Manglik dosha analysis.",
    },
    href: "/kundli-matching",
    icon: "Heart",
  },
  {
    title: { bn: "দশা ক্যালকুলেটর", hi: "दशा कैलकुलेटर", en: "Dasha Calculator" },
    desc: {
      bn: "বিংশোত্তরী মহাদশা, অন্তর্দশা ও যোগিনী দশার সূক্ষ্ম সময়রেখা।",
      hi: "विंशोत्तरी महादशा, अंतर्दशा एवं योगिनी दशा की सटीक समय-सारणी।",
      en: "Deep Vimshottari 5-level and Yogini dasha timeline with live transit synergy.",
    },
    href: "/dasha-calculator",
    icon: "Clock",
  },
  {
    title: { bn: "দৈনিক রাশিফল", hi: "दैनिक राशिफल", en: "Daily Horoscope" },
    desc: {
      bn: "চন্দ্রের গোচর অনুসারে আজকের দিনটির ভাগ্য, শুভ রঙ ও শুভ সংখ্যা।",
      hi: "चंद्र गोचर के आधार पर आज का दिन, शुभ रंग व शुभ अंक।",
      en: "Planetary transits for today's career, romance, lucky color, and lucky numbers.",
    },
    href: "/daily-horoscope",
    icon: "Star",
  },
  {
    title: { bn: "এআই বৈদিক জ্যোতিষী", hi: "एआई वैदिक ज्योतिषी", en: "AI Vedic Astrologer" },
    desc: {
      bn: "যে কোনো জ্যোতিষীয় প্রশ্ন করুন এবং শাস্ত্রসম্মত তাৎক্ষণিক উত্তর পান।",
      hi: "किसी भी ज्योतिषीय प्रश्न का प्रामाणिक एवं त्वरित उत्तर पाएं।",
      en: "Ask any personalized question on Vedic astrology, Dasha, and authentic remedies.",
    },
    href: "/ai-astrologer",
    icon: "Sparkles",
  },
];

export const NAKSHATRA_FAQS: NakshatraFaqItem[] = [
  {
    question: {
      bn: "জন্ম নক্ষত্র (Janma Nakshatra) কী এবং এটি কেন গুরুত্বপূর্ণ?",
      hi: "जन्म नक्षत्र क्या है और इसका क्या महत्व है?",
      en: "What is a Janma Nakshatra and why is it important?",
    },
    answer: {
      bn: "আপনার জন্মের মুহূর্তে চন্দ্রদেব আকাশের যে নক্ষত্রে অবস্থান করেন, তাকে ‘জন্ম নক্ষত্র’ বলা হয়। বৈদিক জ্যোতিষে চন্দ্র হলো মনের কারক গ্রহ। তাই জন্ম নক্ষত্র একজন মানুষের অন্তরমনের চিন্তা, মানসিকতা, সহজাত প্রতিভা, স্বাস্থ্য এবং জীবনের মূল দিশা নির্ধারণ করে।",
      hi: "जन्म के समय चंद्रमा जिस नक्षत्र में स्थित होता है, उसे 'जन्म नक्षत्र' कहा जाता है। चंद्रमा मन का कारक है, इसलिए आपका जन्म नक्षत्र आपके स्वभाव, मानसिक संतुलन, प्राकृतिक क्षमताओं और जीवन के लक्ष्यों को तय करता है।",
      en: "The constellation the Moon is located in at your exact time of birth is called your Janma Nakshatra (Birth Star). In Vedic astrology, the Moon rules the mind; hence your Nakshatra reveals your emotional blueprint, subconscious instincts, talents, and destiny.",
    },
  },
  {
    question: {
      bn: "জন্মের সঠিক সময় না জানা থাকলে কি নক্ষত্র জানা সম্ভব?",
      hi: "क्या जन्म समय के बिना भी नक्षत्र जाना जा सकता है?",
      en: "Can I find my Nakshatra if I don't know my exact birth time?",
    },
    answer: {
      bn: "হ্যাঁ, অধিকাংশ ক্ষেত্রে জানা যায়। চন্দ্র একটি নক্ষত্রে প্রায় ২৪ ঘণ্টা অবস্থান করে। তাই সঠিক দিন জানা থাকলে দুপুর ১২:০০ (Noon) ধরে গণনা করলে প্রায়শই সঠিক জন্ম নক্ষত্র পাওয়া যায়। তবে যদি চন্দ্র ওই দিন ঠিক নক্ষত্র পরিবর্তনের সন্ধিক্ষণে থাকে, তবে সঠিক সময় জেনে নেওয়া সর্বোত্তম।",
      hi: "हाँ, अधिकांश मामलों में। चंद्रमा एक नक्षत्र में लगभग 24 घंटे रहता है। यदि जन्म का समय सटीक न भी पता हो, तो दोपहर 12:00 मानकर गणना करने से नक्षत्र ज्ञात हो जाता है। यदि उस दिन नक्षत्र संक्रमण हो रहा हो, तभी समय का अंतर महत्वपूर्ण होता है।",
      en: "Yes, in most cases. The Moon spends approximately 24 hours in a single Nakshatra. If birth time is unknown, our calculator defaults to 12:00 PM (Noon), which accurately resolves the star for the majority of births unless the Moon crossed a boundary that day.",
    },
  },
  {
    question: {
      bn: "চন্দ্র রাশি (Moon Sign) এবং জন্ম নক্ষত্রের মধ্যে পার্থক্য কী?",
      hi: "चंद्र राशि और जन्म नक्षत्र में क्या अंतर है?",
      en: "What is the difference between Moon Sign (Rashi) and Nakshatra?",
    },
    answer: {
      bn: "রাশিচক্রে ১২টি রাশি থাকে, প্রতিটি রাশির বিস্তার ৩০ ডিগ্রি। অন্যদিকে ২৭টি নক্ষত্র থাকে, প্রতিটির বিস্তার ১৩ ডিগ্রি ২০ মিনিট। একটি রাশির ভেতরে আড়াইটি (২.২৫) নক্ষত্র থাকে। তাই রাশি যেখানে সাধারণ স্বভাব প্রকাশ করে, নক্ষত্র সেই ব্যক্তির সূক্ষ্ম চরিত্র ও গভীরতম ভবিষ্যৎ নির্দেশ করে।",
      hi: "राशिचक्र में 12 राशियां (प्रत्येक 30 अंश) और 27 नक्षत्र (प्रत्येक 13 अंश 20 कला) होते हैं। एक राशि में सवा दो (2.25) नक्षत्र आते हैं। इसलिए राशि आपके व्यक्तित्व का ऊपरी स्वरूप बताती है, जबकि नक्षत्र आंतरिक स्वभाव और सूक्ष्म भाग्य को दर्शाता है।",
      en: "A zodiac sign spans 30 degrees (12 signs in total), whereas a Nakshatra spans 13°20' (27 stars in total). One sign encompasses two-and-a-quarter nakshatras. While your sign shows broad archetypes, your Nakshatra reveals the nuanced, precise psychic essence of who you are.",
    },
  },
  {
    question: {
      bn: "নক্ষত্রের চরণ বা পদ (Pada) কী?",
      hi: "नक्षत्र चरण अथवा पद क्या होता है?",
      en: "What is a Nakshatra Pada (Quarter)?",
    },
    answer: {
      bn: "প্রতিটি নক্ষত্র ৪টি সমান ভাগে বিভক্ত, যাকে ‘চরণ’ বা ‘পদ’ বলা হয়। প্রতিটি পদের মান ৩ ডিগ্রি ২০ মিনিট (৩°২০')। ৪টি পদ মিলে নবাংশ চক্রের (D9) একটি করে বিশেষ রাশি নির্দেশ করে এবং সন্তানের নামকরণের জন্য ৪টি আলাদা পবিত্র ধ্বনি (নামাক্রম অক্ষর) প্রদান করে।",
      hi: "प्रत्येक नक्षत्र को 4 बराबर भागों में बांटा गया है, जिन्हें 'चरण' या 'पद' कहते हैं (प्रत्येक 3 अंश 20 कला)। चार चरण मिलकर नवमांश कुंडली (D9) का निर्माण करते हैं और प्रत्येक पद के लिए बच्चे के नामकरण हेतु एक विशेष अक्षर निर्धारित होता है।",
      en: "Each Nakshatra is divided into four equal quarters called Padas (each 3°20'). Together, the 108 padas in the zodiac map to the Navamsha (D9) chart and provide four distinct phonetic sounds for naming a newborn baby.",
    },
  },
  {
    question: {
      bn: "বিবাহের যোটক বিচারে নক্ষত্র মিলনের কী ভূমিকা?",
      hi: "विवाह मिलान में नक्षत्र की क्या भूमिका होती है?",
      en: "How does Nakshatra affect marriage compatibility (Guna Milan)?",
    },
    answer: {
      bn: "বৈদিক রাজযোটক বিচারে পাত্র ও পাত্রীর জন্ম নক্ষত্রের উপর ভিত্তি করেই গণ মিলন (৬ পয়েন্ট), যোনি মিলন (৪ পয়েন্ট), নাড়ী মিলন (৮ পয়েন্ট) এবং তারাবল (৩ পয়েন্ট) পরিমাপ করা হয়। মোট ৩৬ গুণের সিংহভাগই নক্ষত্র ও চরণের সুনির্দিষ্ট সামঞ্জস্যের উপর দাঁড়িয়ে থাকে।",
      hi: "अष्टकूट 36 गुण मिलान में अधिकांश महत्वपूर्ण कूट—जैसे गण (6 अंक), योनि (4 अंक), नाड़ी (8 अंक) और तारा (3 अंक)—दोनों के जन्म नक्षत्रों के आधार पर ही आंके जाते हैं। इससे वैवाहिक जीवन में भावनात्मक, शारीरिक व स्वास्थ्य संबंधी सामंजস্য तय होता है।",
      en: "In Vedic Ashtakoota matchmaking, the majority of the 36 points—including Nadi (8 pts, genetic health), Gana (6 pts, temperament), Yoni (4 pts, sexual/intimate compatibility), and Tara (3 pts, destiny)—are calculated directly from the two partners' Nakshatras.",
    },
  },
];
