import type { AstrologyLanguage } from "@/types";

export interface MoonSignGuideItem {
  id: string;
  name: Record<AstrologyLanguage, string>;
  element: Record<AstrologyLanguage, string>;
  ruler: Record<AstrologyLanguage, string>;
  overview: Record<AstrologyLanguage, string>;
  emotionalStyle: Record<AstrologyLanguage, string>;
  relationship: Record<AstrologyLanguage, string>;
  bestMatches: string[];
}

export interface RashiFaqItem {
  question: Record<AstrologyLanguage, string>;
  answer: Record<AstrologyLanguage, string>;
}

export const RASHI_ASTROTALK_ROLE = {
  mainTitle: {
    bn: "রাশি ও চন্দ্র রাশি ক্যালকুলেটর: আপনার অন্তরমনের রহস্য উন্মোচন",
    hi: "राशि / चंद्र राशि कैलकुलेटर: अपने आंतरिक मन के रहस्यों को जानें",
    en: "Rashi/Moon Sign Calculator: Find Your Moon sign & Unlock Life's Mysteries",
  },
  intro: {
    bn: "কীভাবে নিজের জন্ম রাশি জানতে হয় — এটি বহু মানুষের সাধারণ জিজ্ঞাসা। রাশি শুধুমাত্র মানুষের সঙ্গে আপনার সামঞ্জস্য নির্দেশ করে না, বরং মানসিক চাপ সামলানোর কৌশল এবং ক্যারিয়ারের সঠিক পছন্দ বেছে নিতে সাহায্য করে।",
    hi: "अपनी चंद्र राशि कैसे जानें—यह अधिकांश लोगों की मुख्य जिज्ञासा होती है। यह न केवल दूसरों के साथ अनुकूलता बताती है, बल्कि तनाव से निपटने और सही करियर चुनने में भी मार्गदर्शन करती है।",
    en: "How to find moon sign or rashi is a common question for many. It not only reveals how compatible you are with another person, but also your coping mechanisms with stress, and helps you make better career choices.",
  },
  roleHeading: {
    bn: "জ্যোতিষশাস্ত্রে চন্দ্র রাশির (Moon Sign) গুরুত্ব ও ভূমিকা",
    hi: "वैदिक ज्योतिष में चंद्र राशि (Rashi) की भूमिका",
    en: "What Is the Role of Moon Sign(Rashi) in Astrology?",
  },
  roleSub: {
    bn: "বৈদিক জ্যোতিষে চন্দ্র হলো অন্তরমনের অনুভূতি, অবচেতন মন, গভীরতম বাসনা ও স্বভাবজাত আবেগের নিয়ন্ত্রক। প্রতি আড়াই দিনে চন্দ্রের রাশি পরিবর্তন আমাদের মনের ভেতরে যে প্রভাব ফেলে তা নিচের ৪টি ক্ষেত্রে বিশেষভাবে পরিলক্ষিত হয়:",
    hi: "वैदिक ज्योतिष में चंद्रमा मन, अवचेतन वृत्तियों और आंतरिक इच्छाओं का अधिपति है। हर ढाई दिन में चंद्रमा का गोचर आपके व्यक्तित्व को भीतर से प्रभावित करता है:",
    en: "The rashi plays an important role in astrology as it governs your inner emotions, subconscious mind, inner instincts, and deeper desires. As the moon transits every 2.5 days, it reflects your personality from within and affects the areas listed below:",
  },
  roles: [
    {
      title: {
        bn: "১. সম্পর্কের গতিশীলতা (Relationship Dynamics)",
        hi: "1. संबंधों का सामंजस्य (Relationship Dynamics)",
        en: "1. Relationship Dynamics",
      },
      desc: {
        bn: "চন্দ্র রাশি আপনার মানসিক ও আত্মিক চাহিদার পরিচয় দেয়। সম্পর্কের ক্ষেত্রে আপনি নিরাপত্তা, স্বাধীনতা, বৌদ্ধিক সান্নিধ্য নাকি স্নেহ খুঁজছেন—তা নির্দেশ করে। নিজের রাশি জানলে সম্পর্কে ভুল বোঝাবুঝি এড়ানো সম্ভব হয়।",
        hi: "चंद्र राशि आपकी भावनात्मक आवश्यकताओं को दर्शाती है। आप साथी से सुरक्षा, स्वतंत्रता, बौद्धिक जुड़ाव या स्नेह चाहते हैं—यह स्पष्ट कर संबंधों में परिपक्वता लाती है।",
        en: "The moon sign indicates your emotional needs and what you desire from a partner—be it excitement, safety, freedom, or intellectual companionship. It prevents relationship mistakes by bringing self-clarity.",
      },
    },
    {
      title: {
        bn: "২. ক্যারিয়ার ও জীবিকা নির্বাচন (Career Choices)",
        hi: "2. आजीविका एवं करियर चयन (Career Choices)",
        en: "2. Career Choices",
      },
      desc: {
        bn: "ক্যারিয়ার জীবনের সবচেয়ে গুরুত্বপূর্ণ সিদ্ধান্তগুলোর একটি। যে কাজ আপনার অন্তরমনের প্রকৃতির সঙ্গে মেলে না, তাতে সাফল্য এলেও মানসিক তৃপ্তি মেলে না। চন্দ্র রাশির প্রকৃতি জানলে সঠিক কর্মক্ষেত্রে স্থায়িত্ব ও আনন্দ নিশ্চিত হয়।",
        hi: "करियर जीवन का महत्वपूर्ण निर्णय है। जो कार्य आपकी आंतरिक प्रकृति के अनुकूल नहीं होता, उसमें भावनात्मक संतुष्टि नहीं मिलती। चंद्र राशि आपको सही दिशा चुनने में मदद करती है।",
        en: "A career is one of the most important decisions in life. Working in a field aligned with your inner emotional nature brings lasting fulfillment and sustained motivation.",
      },
    },
    {
      title: {
        bn: "৩. পারিবারিক ও গৃহসুখ (Domestic Life)",
        hi: "3. पारिवारिक व घरेलू जीवन (Domestic Life)",
        en: "3. Domestic Life",
      },
      desc: {
        bn: "চন্দ্র মাতৃস্নেহ ও পারিবারিক পরিবেশ পরিচালনা করে। পরিবারে কার সঙ্গে আপনার মানসিক বন্ধন গভীর হবে এবং কোথায় সংযমী হতে হবে—চন্দ্র রাশি তা পূর্বাভাস দেয় এবং সংসারে শান্তি বজায় রাখে।",
        hi: "चंद्रमा पारिवारिक सुख और माता का कारक है। परिवार के सदस्यों से संबंध, सुरक्षा की भावना और घरेलू वातावरण का संतुलन चंद्र राशि से निर्धारित होता है।",
        en: "Moon sign governs your domestic life and relationship with mother and family members. It awakens you to where you find genuine security and how to nurture domestic bonds.",
      },
    },
    {
      title: {
        bn: "৪. মানসিক শান্তি ও আবেগ নিয়ন্ত্রণ (Mental Health)",
        hi: "4. मानसिक स्वास्थ्य व शांति (Mental Health)",
        en: "4. Mental Health",
      },
      desc: {
        bn: "চন্দ্র মননশক্তির কারক। মানসিক চাপ, উদ্বেগ ও অস্থিরতা কীভাবে প্রশমিত করতে হয়—চন্দ্র রাশির দুর্বলতা ও শক্তি জেনে সঠিক রত্ন, ধ্যান ও মন্ত্রের মাধ্যমে মানসিক স্থিরতা বজায় রাখা যায়।",
        hi: "चंद्रमा मन का कारक है। तनाव, चिंता और नकारात्मक विचारों से निपटकर मानसिक शांति और एकाग्रता प्राप्त करने में चंद्र राशि का ज्ञान अत्यंत सहायक होता है।",
        en: "The Moon signifies how you handle stress, process emotions, and cultivate mental peace. Understanding your sign guides effective emotional coping strategies and mindfulness.",
      },
    },
  ],
};

export const ALL_12_MOON_SIGNS: MoonSignGuideItem[] = [
  {
    id: "aries",
    name: { bn: "মেষ রাশি (Aries Moon)", hi: "मेष राशि (Aries Moon)", en: "Aries Moon (Mesha)" },
    element: { bn: "অগ্নি (Fire)", hi: "अग्नि (Fire)", en: "Fire" },
    ruler: { bn: "মঙ্গল (Mars)", hi: "मंगल (Mars)", en: "Mars" },
    overview: {
      bn: "স্বাধীনচেতা, সাহসী এবং দ্রুত সিদ্ধান্ত গ্রহণকারী। সম্পর্কে খোলামেলা সততা ভালোবাসেন এবং আবেগ দীর্ঘক্ষণ চেপে রাখেন না।",
      hi: "साहसी, स्वतंत्र और तुरंत निर्णय लेने वाले। भावनाओं को खुलकर व्यक्त करते हैं और रिश्ते में गतिशीलता पसंद करते हैं।",
      en: "Fierce, independent, and action-oriented in relationships. They process emotions quickly and prefer straightforward honesty.",
    },
    emotionalStyle: {
      bn: "তাৎক্ষণিক প্রতিক্রিয়াশীল, তবে ভেতরে কোনো তিক্ততা পুষে রাখেন না।",
      hi: "त्वरित प्रतिक्रिया, किंतु मन में कोई द्वेष नहीं रखते।",
      en: "Spontaneous, passionate, but needs conscious patience when stressed.",
    },
    relationship: {
      bn: "উদ্যমী ও আত্মবিশ্বাসী সঙ্গীর প্রতি আকৃষ্ট হন, তবে ব্যক্তিগত স্বাধীনতার সম্মান চান।",
      hi: "आत्मविश्वासी साथी पसंद करते हैं, स्वतंत्रता का सम्मान आवश्यक है।",
      en: "Attracted to dynamic, confident partners; requires autonomy and mutual respect.",
    },
    bestMatches: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
  },
  {
    id: "taurus",
    name: { bn: "বৃষ রাশি (Taurus Moon)", hi: "वृषभ राशि (Taurus Moon)", en: "Taurus Moon (Vrishabha)" },
    element: { bn: "পৃথিবী (Earth)", hi: "पृथ्वी (Earth)", en: "Earth" },
    ruler: { bn: "শুক্র (Venus)", hi: "शुक्र (Venus)", en: "Venus" },
    overview: {
      bn: "চন্দ্রদেব এই রাশিতে উচ্চস্থ (Exalted)। ধৈর্যশীল, রুচিশীল, স্থিতিশীল এবং একনিষ্ঠ বিশ্বস্ততার প্রতিমূর্তি।",
      hi: "चंद्रमा यहाँ उच्च का होता है। अत्यंत धैर्यवान, वफादार, सौम्य और स्थिरता पसंद करने वाले।",
      en: "The Moon is exalted here. Enduringly loyal, deeply affectionate, sensory, and seeks stability through emotional and physical comfort.",
    },
    emotionalStyle: {
      bn: "আবেগে অবিচল ও শান্ত, আকস্মিক পরিবর্তন পছন্দ করেন না।",
      hi: "शांत, स्थिर स्वभाव और जल्दबाजी में निर्णय न लेने वाले।",
      en: "Steadfast, calm, dislikes drama, and anchors others during storms.",
    },
    relationship: {
      bn: "একবার সম্পর্ক স্বীকার করলে আজীবন পাশে থাকেন এবং পারিবারিক নির্ভরতা গড়ে তোলেন।",
      hi: "एक बार समर्पित होने पर जीवनभर साथ निभाने वाले सच्चे साथी।",
      en: "Deeply committed, physically affectionate, and builds a dependable home.",
    },
    bestMatches: ["Virgo", "Capricorn", "Cancer", "Pisces"],
  },
  {
    id: "gemini",
    name: { bn: "মিথুন রাশি (Gemini Moon)", hi: "मिथुन राशि (Gemini Moon)", en: "Gemini Moon (Mithuna)" },
    element: { bn: "বায়ু (Air)", hi: "वायु (Air)", en: "Air" },
    ruler: { bn: "বুধ (Mercury)", hi: "बुध (Mercury)", en: "Mercury" },
    overview: {
      bn: "চঞ্চল, অনুসন্ধিৎসু ও বুদ্ধিদীপ্ত। আলাপচারিতা এবং বহুমুখী ভাবনার আদান-প্রদানে মানসিক তৃপ্তি পান।",
      hi: "जिज्ञासु, चंचल, वाकपटु और बौद्धिक चर्चाओं में आनंद लेने वाले।",
      en: "Restless, witty, curious, and intellectually vibrant. They find comfort through conversation and learning new perspectives.",
    },
    emotionalStyle: {
      bn: "যুক্তি দিয়ে আবেগ বিশ্লেষণ করেন এবং দ্রুত যেকোনো পরিস্থিতি মানিয়ে নেন।",
      hi: "तार्किक, बहुमुखी और परिस्थितियों में तुरंत ढलने वाले।",
      en: "Rationalizes feelings, adaptable, but requires mental breathing room.",
    },
    relationship: {
      bn: "বুদ্ধিদীপ্ত যোগাযোগই প্রেমের ভিত্তি; একঘেয়েমি কাটিয়ে আনন্দময় সঙ্গ ভালোবাসেন।",
      hi: "बौद्धिक समानता और रोचक बातचीत को रिश्ते का आधार मानते हैं।",
      en: "Needs lively dialogue, humor, and freedom to experiment and socialize.",
    },
    bestMatches: ["Libra", "Aquarius", "Aries", "Leo"],
  },
  {
    id: "cancer",
    name: { bn: "কর্কট রাশি (Cancer Moon)", hi: "कर्क राशि (Cancer Moon)", en: "Cancer Moon (Karka)" },
    element: { bn: "জল (Water)", hi: "जल (Water)", en: "Water" },
    ruler: { bn: "চন্দ্র (Moon)", hi: "चंद्र (Moon)", en: "Moon" },
    overview: {
      bn: "চন্দ্রের স্বক্ষেত্র (Home Sign)। গভীর অনুভূতিপ্রবণ, মমতাশীল, পরিবারপ্রেমী ও সহজাত অন্তর্দৃষ্টিসম্পন্ন।",
      hi: "चंद्रमा का स्वराशि। अत्यधिक संवेदनशील, स्नेही, पारिवारिक और अंतर्ज्ञानी।",
      en: "The Moon is in its home sign. Deeply intuitive, empathetic, devoted, and prioritizes emotional security and family protection.",
    },
    emotionalStyle: {
      bn: "সমুদ্রের ঢেউয়ের মতো ভাবাবেগপ্রবণ, নিঃস্বার্থ ভালোবাসায় নিবেদিত।",
      hi: "भावुक, संवेदनशील और अपनों की सुरक्षा के लिए समर्पित।",
      en: "Receptive, deeply empathetic, highly protective of loved ones.",
    },
    relationship: {
      bn: "আত্মিক সমবেদনা ও স্নেহের সুদৃঢ় বন্ধন কামনা করেন; জীবনসঙ্গীর বিশ্বস্ত আশ্রয়।",
      hi: "सच्चे समर्पण और आत्मिक आत्मीयता से परिपूर्ण प्रेम।",
      en: "Seeks profound intimacy, loyal protector, thrives on warmth and emotional safety.",
    },
    bestMatches: ["Scorpio", "Pisces", "Taurus", "Virgo"],
  },
  {
    id: "leo",
    name: { bn: "সিংহ রাশি (Leo Moon)", hi: "सिंह राशि (Leo Moon)", en: "Leo Moon (Simha)" },
    element: { bn: "অগ্নি (Fire)", hi: "अग्नि (Fire)", en: "Fire" },
    ruler: { bn: "সূর্য (Sun)", hi: "सूर्य (Sun)", en: "Sun" },
    overview: {
      bn: "উদারহৃদয়, রাজকীয় মর্যাদাসম্পন্ন, অনুপ্রেরণাদায়ী ও সুরক্ষক। স্বীকৃতি ও প্রশংসায় প্রাণবন্ত হয়ে ওঠেন।",
      hi: "उदार, राजसी स्वाभाव, प्रेरक और जीवनसाथी को गौरव दिलाने वाले।",
      en: "Warm-hearted, dramatic, generous, and proud. They love to be cherished and celebrated, expressing affection with royal grandeur.",
    },
    emotionalStyle: {
      bn: "উজ্জ্বল ও প্রকাশ্য আবেগ, হৃদয়ের উষ্ণতায় অন্যকে ভরিয়ে দেন।",
      hi: "उत्साही, स्वाभिमानी और खुले दिल से स्नेह लुटाने वाले।",
      en: "Expressive, generous, loyal, though sensitive to feeling dismissed.",
    },
    relationship: {
      bn: "সঙ্গীকে রাজকীয় ভালোবাসা দেন এবং বিপরীতে শর্তহীন সম্মান ও বিশ্বস্ততা প্রত্যাশা করেন।",
      hi: "रिश्ते में पूरी निष्ठा और सम्मान की अपेक्षा रखने वाले।",
      en: "Fiercely protective and affectionate; flourishes in relationships built on mutual admiration.",
    },
    bestMatches: ["Aries", "Sagittarius", "Gemini", "Libra"],
  },
  {
    id: "virgo",
    name: { bn: "কন্যা রাশি (Virgo Moon)", hi: "कन्या राशि (Virgo Moon)", en: "Virgo Moon (Kanya)" },
    element: { bn: "পৃথিবী (Earth)", hi: "पृथ्वी (Earth)", en: "Earth" },
    ruler: { bn: "বুধ (Mercury)", hi: "बुध (Mercury)", en: "Mercury" },
    overview: {
      bn: "ব্যবহারিক যত্নশীল, সূক্ষ্মদর্শী, সুশৃঙ্খল ও সেবাপরায়ণ। মুখের কথার চেয়ে কাজের মাধ্যমে ভালোবাসা প্রকাশ করেন।",
      hi: "व्यावहारिक, सेवाभावी, अनुशासित और बारीकियों पर ध्यान देने वाले।",
      en: "Analytical, methodical, caring, and service-oriented. They express love through thoughtful acts of service and helpfulness.",
    },
    emotionalStyle: {
      bn: "আবেগকে বিশ্লেষণ করে নিয়ন্ত্রণে রাখেন, সর্বদা পরিস্থিতি শৃঙ্খলায় আনতে চান।",
      hi: "तार्किक, आत्म-नियंत्रित और समस्याओं का समाधान खोजने वाले।",
      en: "Pragmatic, reserved with outward melodrama, seeks to be useful and supportive.",
    },
    relationship: {
      bn: "নির্ভরযোগ্য ও দায়িত্বশীল সঙ্গী; সম্পর্কে সততা, পরিচ্ছন্নতা ও বোঝাপড়াকে মূল্য দেন।",
      hi: "भरोसेमंद, समर्पित और जीवनसाथी की छोटी-छोटी जरूरतों का ध्यान रखने वाले।",
      en: "Dependable, deeply supportive, appreciates clarity and mutual respect.",
    },
    bestMatches: ["Taurus", "Capricorn", "Cancer", "Scorpio"],
  },
  {
    id: "libra",
    name: { bn: "তুলা রাশি (Libra Moon)", hi: "तुला राशि (Libra Moon)", en: "Libra Moon (Tula)" },
    element: { bn: "বায়ু (Air)", hi: "वायु (Air)", en: "Air" },
    ruler: { bn: "শুক্র (Venus)", hi: "शुक्र (Venus)", en: "Venus" },
    overview: {
      bn: "শান্তিপ্রিয়, ন্যায়পরায়ণ, রুচিশীল ও মিলনকামী। সম্পর্কে সৌহার্দ্য ও নান্দনিক ভারসাম্য বজায় রাখাই জীবনের ব্রত।",
      hi: "शांतिप्रिय, न्यायप्रिय, आकर्षक और सामंजस्य स्थापित करने में निपुण।",
      en: "Harmonious, diplomatic, charming, and justice-seeking. They crave partnership and thrive in balanced, aesthetically pleasing environments.",
    },
    emotionalStyle: {
      bn: "কলহ এড়িয়ে চলেন এবং উভয় পক্ষের মতামত শুনে ভারসাম্য আনেন।",
      hi: "शांति से समाधान निकालने वाले और विवादों से दूर रहने वाले।",
      en: "Gentle, conciliatory, dislikes confrontation, seeks mutual consensus.",
    },
    relationship: {
      bn: "আদর্শ রোমান্টিক সঙ্গী, মানসিক বোঝাপড়া ও যৌথ সিদ্ধান্তে বিশ্বাসী।",
      hi: "उत्कृष्ट जीवनसाथी, साझेदारी और परस्पर सम्मान में विश्वास।",
      en: "Naturally collaborative romantic partner; flourishes with considerate companions.",
    },
    bestMatches: ["Gemini", "Aquarius", "Leo", "Sagittarius"],
  },
  {
    id: "scorpio",
    name: { bn: "বৃশ্চিক রাশি (Scorpio Moon)", hi: "वृश्चिक राशि (Scorpio Moon)", en: "Scorpio Moon (Vrischika)" },
    element: { bn: "জল (Water)", hi: "जल (Water)", en: "Water" },
    ruler: { bn: "মঙ্গল ও কেতু", hi: "मंगल व केतु", en: "Mars & Ketu" },
    overview: {
      bn: "চন্দ্রদেব এই রাশিতে নীচস্থ (Debilitated)। তীব্র অনুভূতিপ্রবণ, অদম্য ইচ্ছাশক্তি, গোপনীয় ও আত্মিক রূপান্তরের প্রতীক।",
      hi: "चंद्रमा यहाँ नीच का होता है। अत्यंत गूढ़, गहन भावात्मक, दृढ़ निश्चयी और समर्पित।",
      en: "The Moon is debilitated here. Intensely feeling, deeply transformative, private, and capable of profound emotional resilience.",
    },
    emotionalStyle: {
      bn: "গভীর ভাবাবেগ সহজে প্রকাশ করেন না, কিন্তু ভেতর থেকে সম্পূর্ণ নিবেদিত।",
      hi: "आंतरिक गहराई, भावनाओं को छुपाकर रखने वाले लेकिन अटूट वफादार।",
      en: "Intense, watchful, protective, possesses strong psychological radar.",
    },
    relationship: {
      bn: "অটুট বিশ্বাস ও আনুগত্যের প্রত্যাশী; একবার বিশ্বাস স্থাপন করলে অমর প্রেম দেন।",
      hi: "पूर्ण निष्ठा और समर्पण की अपेक्षा रखने वाले, गहरा आत्मिक प्रेम।",
      en: "Values absolute loyalty and truthfulness; builds profound, soul-merging bonds.",
    },
    bestMatches: ["Cancer", "Pisces", "Virgo", "Capricorn"],
  },
  {
    id: "sagittarius",
    name: { bn: "ধনু রাশি (Sagittarius Moon)", hi: "धनु राशि (Sagittarius Moon)", en: "Sagittarius Moon (Dhanu)" },
    element: { bn: "অগ্নি (Fire)", hi: "अग्नि (Fire)", en: "Fire" },
    ruler: { bn: "বৃহস্পতি (Jupiter)", hi: "बृहस्पति (Jupiter)", en: "Jupiter" },
    overview: {
      bn: "আশাবাদী, জ্ঞানপিপাসু, সত্যসন্ধানী ও উদারমনা। যেকোনো পরিস্থিতিতে ইতিবাচক আলো দেখতে পান।",
      hi: "आशावादी, दार्शनिक, ज्ञानप्रिय और खुले विचारों वाले।",
      en: "Optimistic, philosophical, adventurous, and enthusiastic. They view emotional life through the lens of growth, truth, and possibilities.",
    },
    emotionalStyle: {
      bn: "সহজ-সরল ও খোলামেলা, সংকীর্ণতা বা মানসিক চাপ বেশিক্ষণ ধরে রাখেন না।",
      hi: "उदार, स्पष्टवादी और जीवन को उत्साह से जीने वाले।",
      en: "Expansive, good-humored, needs intellectual space and adventure.",
    },
    relationship: {
      bn: "বন্ধুর মতো জীবনসঙ্গী পছন্দ করেন, যার সঙ্গে জীবনের দীর্ঘ অভিযাত্রা ভাগ করে নেওয়া যায়।",
      hi: "सच्चे मित्र जैसा साथी पसंद करते हैं जो सपनों का सम्मान करे।",
      en: "Thrives with partners who share curiosity, travel, and philosophical alignment.",
    },
    bestMatches: ["Aries", "Leo", "Libra", "Aquarius"],
  },
  {
    id: "capricorn",
    name: { bn: "মকর রাশি (Capricorn Moon)", hi: "मकर राशि (Capricorn Moon)", en: "Capricorn Moon (Makara)" },
    element: { bn: "পৃথিবী (Earth)", hi: "पृथ्वी (Earth)", en: "Earth" },
    ruler: { bn: "শনি (Saturn)", hi: "शनि (Saturn)", en: "Saturn" },
    overview: {
      bn: "ধৈর্যশীল, দায়িত্ববান, বাস্তববাদী ও লক্ষ্যনিষ্ঠ। কঠিন পরিশ্রম ও শৃঙ্খলার মাধ্যমে সাফল্য অর্জন করেন।",
      hi: "धैर्यवान, अनुशासित, व्यावहारिक और कठिन परिश्रम से सफल होने वाले।",
      en: "Grounded, disciplined, patient, and deeply responsible. They value emotional control, long-term security, and structural integrity.",
    },
    emotionalStyle: {
      bn: "আবেগ সংযত রাখেন এবং কাজের মাধ্যমে দায়িত্বের প্রমাণ দেন।",
      hi: "गंभीर, आत्म-नियंत्रित और जिम्मेदारियों को प्राथमिकता देने वाले।",
      en: "Pragmatic, emotionally reserved initially, deeply committed once anchored.",
    },
    relationship: {
      bn: "দীর্ঘস্থায়ী পারিবারিক স্থায়িত্বে বিশ্বাসী; বিশ্বস্ত ও নির্ভরযোগ্য অভিভাবক সঙ্গী।",
      hi: "दीर्घकालिक स्थिरता और पारिवारिक मर्यादाओं के प्रति समर्पित।",
      en: "Unshakeably loyal, builds enduring foundations for family and future.",
    },
    bestMatches: ["Taurus", "Virgo", "Scorpio", "Pisces"],
  },
  {
    id: "aquarius",
    name: { bn: "কুম্ভ রাশি (Aquarius Moon)", hi: "कुंभ राशि (Aquarius Moon)", en: "Aquarius Moon (Kumbha)" },
    element: { bn: "বায়ু (Air)", hi: "वायु (Air)", en: "Air" },
    ruler: { bn: "শনি ও রাহু", hi: "शनि व राहु", en: "Saturn & Rahu" },
    overview: {
      bn: "দূরদর্শী, মানবতাবাদী, স্বতন্ত্র চিন্তাবিদ ও স্বাধীনচেতা। গতানুগতিকতার বাইরে নতুন দিগন্ত উন্মোচনকারী।",
      hi: "दूरदर्शी, मानवतावादी, स्वतंत्र विचारक और प्रगतिशील स्वभाव।",
      en: "Visionary, humanitarian, unconventional, and objective. They approach emotions through intellect and value universal freedom.",
    },
    emotionalStyle: {
      bn: "শান্ত ও নিরপেক্ষ, সংকীর্ণ মানসিকতা পছন্দ করেন না।",
      hi: "शांत, निष्पक्ष और व्यक्तिगत स्वतंत्रता की कद्र करने वाले।",
      en: "Open-minded, independent, seeks intellectual kinship before emotional vulnerability.",
    },
    relationship: {
      bn: "প্রেমের ভিত্তি হলো নিঃস্বার্থ বন্ধুত্ব ও পারস্পরিক স্বাধীনতার প্রতি অগাধ শ্রদ্ধা।",
      hi: "सच्ची मित्रता और स्वतंत्रता के सम्मान पर आधारित प्रेम संबंध।",
      en: "Best friends first; respects individuality and builds collaborative, egalitarian love.",
    },
    bestMatches: ["Gemini", "Libra", "Aries", "Sagittarius"],
  },
  {
    id: "pisces",
    name: { bn: "মীন রাশি (Pisces Moon)", hi: "मीन राशि (Pisces Moon)", en: "Pisces Moon (Meena)" },
    element: { bn: "জল (Water)", hi: "जल (Water)", en: "Water" },
    ruler: { bn: "বৃহস্পতি (Jupiter)", hi: "बृहस्पति (Jupiter)", en: "Jupiter" },
    overview: {
      bn: "করুণাময়, স্বপ্নদর্শী, সংবেদনশীল ও আধ্যাত্মিক ভাবুক। অন্যের কষ্ট হৃদয় দিয়ে অনুভব করার ঈশ্বরপ্রদত্ত ক্ষমতা।",
      hi: "अत्यंत दयालु, संवेदनशील, कलात्मक, स्वप्नद्रष्टा और आध्यात्मिक।",
      en: "Compassionate, poetic, empathic, and spiritually gifted. They feel deeply and dissolve boundaries through unconditional empathy.",
    },
    emotionalStyle: {
      bn: "মহাসমুদ্রের মতো উদার ও মায়াময়, অতীন্দ্রিয় অনুভূতিতে সমৃদ্ধ।",
      hi: "निःस्वार्थ, स्नेही और आत्मिक ऊर्जा को महसूस करने वाले।",
      en: "Mystical, deeply artistic, gentle, easily affected by environmental vibes.",
    },
    relationship: {
      bn: "স্বপ্নিল রোমান্টিক ও নিঃস্বার্থ আত্মিক সমর্পণকারী প্রেমী।",
      hi: "आत्मिक समर्पण और निःस्वार्थ प्रेम करने वाले आदर्श जीवनसाथী।",
      en: "Devoted soulmate, brings gentle magic, unconditional love, and spiritual depth.",
    },
    bestMatches: ["Cancer", "Scorpio", "Taurus", "Capricorn"],
  },
];

export const RASHI_ELEMENT_COMPATIBILITY = {
  title: {
    bn: "চন্দ্র রাশির উপাদান ভিত্তিক মিলন (Moon Sign Compatibility)",
    hi: "चंद्र राशि तत्व अनुकूलता (Moon Sign Compatibility)",
    en: "Moon Sign Compatibility: Check Out The Best Matches",
  },
  subtitle: {
    bn: "বৈদিক জ্যোতিষে ১২টি রাশিকে ৪টি মূল উপাদানে (অগ্নি, পৃথিবী, বায়ু ও জল) ভাগ করা হয়েছে:",
    hi: "वैदिक ज्योतिष में 12 राशियों को 4 मूल तत्वों (अग्नि, पृथ्वी, वायु और जल) में विभाजित किया गया है:",
    en: "In Vedic Astrology, the moon sign (rashi) is divided into 4 primary elements: Fire, Earth, Air, and Water:",
  },
  rules: [
    {
      element: { bn: "অগ্নি রাশি (Fire Signs)", hi: "अग्नि राशियां (Fire Signs)", en: "Fire Moon Signs" },
      signs: { bn: "মেষ, সিংহ ও ধনু", hi: "मेष, सिंह एवं धनु", en: "Aries, Leo, Sagittarius" },
      compatibleWith: {
        bn: "অগ্নি ও বায়ু রাশি (মেষ, সিংহ, ধনু, মিথুন, তুলা, কুম্ভ)",
        hi: "अग्नि व वायु राशियां (मेष, सिंह, धनु, मिथुन, तुला, कुंभ)",
        en: "Fire and Air signs (Aries, Leo, Sagittarius, Gemini, Libra, Aquarius)",
      },
      why: {
        bn: "বায়ু অগ্নির তেজ বৃদ্ধি করে—পরস্পরকে উৎসাহ, নতুন উদ্দীপনা ও জীবনানন্দের প্রেরণা জোগায়।",
        hi: "वायु अग्नि को प्रज्वलित करती है—दोनों मिलकर जीवन में उत्साह व ऊर्जा का संचार करते हैं।",
        en: "Air feeds Fire—sparking inspiration, mutual enthusiasm, and shared adventurous spirit.",
      },
    },
    {
      element: { bn: "জল রাশি (Water Signs)", hi: "जल राशियां (Water Signs)", en: "Water Moon Signs" },
      signs: { bn: "কর্কট, বৃশ্চিক ও মীন", hi: "कर्क, वृश्चिक एवं मीन", en: "Cancer, Scorpio, Pisces" },
      compatibleWith: {
        bn: "জল ও পৃথিবী রাশি (কর্কট, বৃশ্চিক, মীন, বৃষ, কন্যা, মকর)",
        hi: "जल व पृथ्वी राशियां (कर्क, वृश्चिक, मीन, वृषभ, कन्या, मकर)",
        en: "Water and Earth signs (Cancer, Scorpio, Pisces, Taurus, Virgo, Capricorn)",
      },
      why: {
        bn: "জল পৃথিবীকে সিক্ত করে ফসল ফলায়—গভীর আত্মিক নির্ভরতা, নিরাপত্তা ও শান্ত দাম্পত্য গড়ে তোলে।",
        hi: "जल पृथ्वी को उर्वर बनाता है—दोनों मिलकर रिश्ते में सुरक्षा और गहरा भावनात्मक सुकून देते हैं।",
        en: "Water nourishes Earth—fostering deep emotional safety, stability, and enduring loyalty.",
      },
    },
    {
      element: { bn: "পৃথিবী রাশি (Earth Signs)", hi: "पृथ्वी राशियां (Earth Signs)", en: "Earth Moon Signs" },
      signs: { bn: "বৃষ, কন্যা ও মকর", hi: "वृषभ, कन्या एवं मकर", en: "Taurus, Virgo, Capricorn" },
      compatibleWith: {
        bn: "পৃথিবী ও জল রাশি (বৃষ, কন্যা, মকর, কর্কট, বৃশ্চিক, মীন)",
        hi: "पृथ्वी व जल राशियां (वृषभ, कन्या, मकर, कर्क, वृश्चिक, मीन)",
        en: "Earth and Water signs (Taurus, Virgo, Capricorn, Cancer, Scorpio, Pisces)",
      },
      why: {
        bn: "পৃথিবী জলকে আধার দেয়—বাস্তবমুখী পরিকল্পনা, সঞ্চয় ও পারিবারিক শৃঙ্খলার প্রতীক।",
        hi: "पृथ्वी जल को स्थिरता देती है—व्यावहारिक योजना और सुखद भविष्य का निर्माण।",
        en: "Earth provides a secure vessel for Water—bringing pragmatic plans and domestic calm.",
      },
    },
    {
      element: { bn: "বায়ু রাশি (Air Signs)", hi: "वायु राशियां (Air Signs)", en: "Air Moon Signs" },
      signs: { bn: "মিথুন, তুলা ও কুম্ভ", hi: "मिथुन, तुला एवं कुंभ", en: "Gemini, Libra, Aquarius" },
      compatibleWith: {
        bn: "বায়ু ও অগ্নি রাশি (মিথুন, তুলা, কুম্ভ, মেষ, সিংহ, ধনু)",
        hi: "वायु व अग्नि राशियां (मिथुन, तुला, कुंभ, मेष, सिंह, धनु)",
        en: "Air and Fire signs (Gemini, Libra, Aquarius, Aries, Leo, Sagittarius)",
      },
      why: {
        bn: "উন্মুক্ত চিন্তা ও গতিশীলতার সংমিশ্রণ—সম্পর্কে প্রাণচঞ্চলতা ও আজীবন সতেজতা বজায় রাখে।",
        hi: "खुले विचारों और गतिशीलता का संगम—रिश्ते में नवीनता और जीवंतता बनी रहती है।",
        en: "A dynamic synergy of vision and action—keeping relationship fresh, playful, and expressive.",
      },
    },
  ],
};

export const RASHI_FAQS: RashiFaqItem[] = [
  {
    question: {
      bn: "চন্দ্র রাশি (Rashi / Moon Sign) এবং সূর্য রাশি (Sun Sign)-এর মধ্যে তফাৎ কী?",
      hi: "चंद्र राशि और सूर्य राशि में क्या अंतर है?",
      en: "What is the difference between Moon Sign (Rashi) and Sun Sign?",
    },
    answer: {
      bn: "সূর্য রাশি (Sun Sign) নির্দেশ করে বাইরের জগৎ আপনাকে কীভাবে দেখে (অহং ও বহিরঙ্গ চরিত্র)। অন্যদিকে চন্দ্র রাশি (Moon Sign) নির্দেশ করে আপনার অন্তরমনের আবেগ, মানসিক অনুভূতি ও গভীর অবচেতন ইচ্ছা। বৈদিক জ্যোতিষে চন্দ্র রাশিই সর্বাধিক প্রামাণ্য ও কার্যকর।",
      hi: "सूर्य राशि बाहरी दुनिया में आपकी पहचान और अहंकार को दर्शाती है, जबकि चंद्र राशि आपकी आंतरिक भावनाओं, मानसिक संतुलन और मूल प्रकृति का दर्पण है। वैदिक ज्योतिष में भविष्यफल हेतु चंद्र राशि ही सर्वोपरि है।",
      en: "Your Sun sign represents your outer ego, conscious identity, and worldly ambitions. Your Moon sign (Janma Rashi) reveals your inner emotional blueprint, instinctive reactions, and subconscious needs. In Vedic astrology, the Moon sign is paramount.",
    },
  },
  {
    question: {
      bn: "সঠিক জন্মসময় না জানা থাকলে কি রাশি গণনা করা যায়?",
      hi: "क्या जन्म समय के बिना भी सही राशि जानी जा सकती है?",
      en: "Can I find my Moon Sign if I don't know my exact birth time?",
    },
    answer: {
      bn: "চন্দ্র প্রতি একটি রাশিতে প্রায় আড়াই দিন (৬০ ঘণ্টা) অবস্থান করে। তাই সঠিক দিন জানা থাকলে দুপুর ১২:০০ ধরে হিসাব করলে অধিকাংশ ক্ষেত্রে রাশি একদম সঠিক আসে। তবে যদি ওই দিন চন্দ্র রাশি পরিবর্তনের সন্ধিক্ষণে থাকে, তবে জন্মসময় সহায়ক হয়।",
      hi: "चंद्रमा एक राशि में लगभग 2.5 दिन (60 घंटे) रहता है। अतः सही जन्म तिथि होने पर दोपहर 12:00 बजे का समय लेकर गणना करने पर अधिकांश मामलों में सही राशि ज्ञात हो जाती है।",
      en: "Yes, in most cases. The Moon spends about 2.5 days (roughly 60 hours) in a single zodiac sign. If birth time is unknown, our system defaults to 12:00 PM (Noon), which accurately determines the sign unless the Moon shifted signs on that exact date.",
    },
  },
  {
    question: {
      bn: "দৈনিক রাশিফল দেখার সময় কোন রাশি দেখতে হয়—নাম রাশি নাকি জন্ম রাশি?",
      hi: "दैनिक राशिफल देखने के लिए कौन सी राशि सही है—नाम राशि या जन्म राशि?",
      en: "Which sign should I check for Daily Horoscope—Name Sign or Birth Moon Sign?",
    },
    answer: {
      bn: "সর্বদা জন্ম রাশি (Janma Rashi / Moon Sign) অনুসরণ করা উচিত। জন্ম ছকে চন্দ্রের অবস্থানের সাপেক্ষেই প্রতিদিনের গোচর ও চন্দ্রবল নির্ধারিত হয়। ডাকনাম কেবল প্রচলিত লোকরীতি, কিন্তু জন্মতারিখের চন্দ্র রাশিই প্রামাণ্য ফল দেয়।",
      hi: "सदैव जन्म चंद्र राशि के आधार पर ही दैनिक राशिफल देखना चाहिए। ग्रहों का गोचर आपके जन्म के समय चंद्रमा की स्थिति के सापेक्ष ही फलीभूत होता है।",
      en: "Always follow your Birth Moon Sign (Janma Rashi). Planetary transits, daily lunar blessings (Chandra Bala), and Sade Sati interact directly with the Moon's exact astronomical position at your birth.",
    },
  },
  {
    question: {
      bn: "চন্দ্র রাশিতে শনির সাড়ে সাতি (Shani Sade Sati) কীভাবে হিসাব করা হয়?",
      hi: "चंद्र राशि पर शनि की साढ़ेसाती की गणना कैसे होती है?",
      en: "How is Shani Sade Sati calculated for my Moon sign?",
    },
    answer: {
      bn: "শনির সাড়ে সাতি শুরু হয় যখন শনিদেব আপনার জন্ম রাশির পূর্ববর্তী রাশিতে (১২তম ভাব) প্রবেশ করেন, অব্যাহত থাকে যখন জন্ম রাশিতে (১ম ভাব) গোচর করেন, এবং সমাপ্ত হয় যখন পরবর্তী রাশিতে (২য় ভাব) গমন সমাপ্ত করেন। প্রতি রাশিতে শনি আড়াই বছর করে মোট সাড়ে সাত বছর গোচর করেন।",
      hi: "शनि साढ़ेसाती तब प्रारंभ होती है जब शनि आपकी चंद्र राशि से 12वें भाव में आते हैं, चंद्र राशि पर रहते हैं, और दूसरे भाव से निकलते हैं। प्रत्येक भाव में 2.5 वर्ष के मान से कुल साढ़े सात वर्ष का समय होता है।",
      en: "Sade Sati is the 7.5-year transit of Saturn across the 12th house, 1st house (your Moon sign), and 2nd house from your natal Moon sign. Saturn spends roughly 2.5 years in each of these three signs.",
    },
  },
  {
    question: {
      bn: "আমার রাশির জন্য কোন রত্ন ও শুভ রঙ সবচেয়ে কার্যকর?",
      hi: "मेरी राशि के लिए कौन सा रत्न और शुभ रंग श्रेष्ठ है?",
      en: "How do I know my Lucky Gemstone and Lucky Color from my Rashi?",
    },
    answer: {
      bn: "আপনার জন্ম রাশির অধিপতি গ্রহের প্রকৃতির ওপর ভিত্তি করে শুভ রত্ন ও রঙ নির্ধারিত হয়। যেমন—মেষের জন্য প্রবাল ও লাল, বৃষের জন্য হীরা/সাদা ও গোলাপী, কর্কটের জন্য মুক্তা ও শুভ্র বর্ণ। আমাদের ক্যালকুলেটরে প্রতিটি রাশির প্রামাণ্য চার্ট বিস্তারিত দেওয়া আছে।",
      hi: "आपकी चंद्र राशि के स्वामी ग्रह के आधार पर ही शुभ रत्न व रंग निर्धारित होते हैं—जैसे मेष के लिए मूंगा व रक्त लाल, वृषभ के लिए हीरा व सफेद, कर्क के लिए मोती व श्वेत रंग।",
      en: "Your lucky gemstones and colors are governed by your sign's ruling planet and friendly planetary network. Our calculator gives exact authentic recommendations for every sign based on classical treatises.",
    },
  },
];


export const RASHI_RELATED_TOOLS = [
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
    title: { bn: "জন্ম নক্ষত্র ক্যালকুলেটর", hi: "जन्म नक्षत्र ক্যালকুলেটর", en: "Nakshatra Calculator" },
    desc: {
      bn: "আপনার জন্ম নক্ষত্র, ৪ চরণ, অবকহড়া চক্র এবং শুভ নামাক্রম বর্ণ জানুন।",
      hi: "अपना जन्म नक्षत्र, 4 चरण, अवकहड़ा चक्र एवं शुभ नामाक्षर जानें।",
      en: "Discover your birth star, padas, Avakahada chakra, and baby naming letters.",
    },
    href: "/nakshatra-calculator",
    icon: "Star",
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
    icon: "Sparkles",
  },
  {
    title: { bn: "এআই বৈদিক জ্যোতিষী", hi: "एआई वैदिक ज्योतिषी", en: "AI Vedic Astrologer" },
    desc: {
      bn: "যেকোনো জ্যোতিষীয় প্রশ্ন করুন এবং শাস্ত্রসম্মত তাৎক্ষণিক উত্তর পান।",
      hi: "किसी भी ज्योतिषीय प्रश्न का प्रामाणिक एवं त्वरित उत्तर पाएं।",
      en: "Ask any personalized question on Vedic astrology, Dasha, and authentic remedies.",
    },
    href: "/ai-astrologer",
    icon: "Sparkles",
  },
];
