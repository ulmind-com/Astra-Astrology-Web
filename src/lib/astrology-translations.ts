/**
 * Client-side complete localized translations for all 12 Rashis (Moon Signs)
 * across English (en), Bengali (bn), and Hindi (hi).
 * Ensures instant 0ms language switching on the frontend.
 */

export interface LocalizedTraits {
  name: string; 
  element: string;
  modality: string;
  polarity: string;
  body_parts: string;
  nature: string;
  overview: string;
  strengths: string[];
  cautions_and_pitfalls: string[];
  beneficial_actions_and_remedies: string[];
  career_fields: string[];
  lucky_color: string;
  lucky_gemstone: string;
  lucky_day: string;
  ruling_deity: string;
  compatible_rashis: string[];
} 

export const CLIENT_RASHI_TRANSLATIONS: Record<number, Record<"en" | "bn" | "hi", LocalizedTraits>> = {
  // 0. ARIES
  0: {
    en: {
      name: "Aries",
      element: "Fiery",
      modality: "Movable / Cardinal",
      polarity: "Masculine / Day Sign",
      body_parts: "Head, brain, forehead, skull, cranial vessels",
      nature: "Dynamic, enterprising, valiant, energetic, impulsive, leadership-driven",
      overview:
        "Ruled by Mars, Aries represents the spark of life and initial impulse. Individuals with Moon in Aries are natural pioneers who thrive on action, challenges, and courageous initiatives. They possess a lean physique, prominent forehead, sharp gaze, and spontaneous enthusiasm.",
      strengths: [
        "Fearless leadership and pioneering initiative",
        "High stamina, quick problem solving, and determination",
        "Honest, direct, and straightforward communication",
        "Protective towards dependents and team members",
      ],
      cautions_and_pitfalls: [
        "Hot temper, rash irritability, and speaking without forethought",
        "Impulsive financial gambles and leaping before looking",
        "Starting many ambitious projects but losing momentum halfway through",
        "Prone to headaches, migraines, fevers, and face/head injuries due to rush",
        "Inability to accept delays, advice, or subordination gracefully",
      ],
      beneficial_actions_and_remedies: [
        "Daily morning meditation or slow breathwork (Pranayama) to cool Mars fire",
        "Recite Hanuman Chalisa or Kartikeya Stotra on Tuesdays for mental calm",
        "Channel intense energy into sports, martial arts, gym, or executive management",
        "Donate red lentils (masoor dal), copper vessels, or sweet jaggery on Tuesdays",
        "Practice pausing for 10 seconds before reacting in heated arguments",
      ],
      career_fields: [
        "Defense, police, military & security",
        "Surgery, medicine & emergency services",
        "Entrepreneurship, venture capital & startup leadership",
        "Engineering, mechanics, real estate & construction",
        "Athletics, competitive sports & sports training",
      ],
      lucky_color: "Crimson Red, Coral & Saffron",
      lucky_gemstone: "Red Coral (Moonga)",
      lucky_day: "Tuesday",
      ruling_deity: "Lord Hanuman & Lord Kartikeya",
      compatible_rashis: ["Leo", "Sagittarius", "Gemini", "Aquarius"],
    },
    bn: {
      name: "মেষ",
      element: "অগ্নি তত্ত্ব",
      modality: "চর রাশি (Movable)",
      polarity: "পুরুষ / দিবা রাশি",
      body_parts: "মাথা, মস্তিষ্ক, কপাল, খুলি এবং রক্তনালী",
      nature: "উদ্যমী, সাহসী, পরাক্রমশালী, স্পষ্টভাষী, নেতৃত্বমুখী ও তেজস্বী",
      overview:
        "মঙ্গল গ্রহ দ্বারা শাসিত মেষ রাশি হলো জীবনের সূচনা ও প্রাণশক্তির প্রতীক। মেষ রাশির জাতক-জাতিকারা জন্মগতভাবে অগ্রদূত ও নির্ভীক হয়ে থাকেন। তারা যে কোনো চ্যালেঞ্জ গ্রহণ করতে ভালোবাসেন এবং যেকোনো কাজে দ্রুত নেতৃত্ব দিতে পারেন।",
      strengths: [
        "নির্ভীক নেতৃত্বদান এবং যেকোনো কাজে তাৎক্ষণিক অগ্রণী ভূমিকা গ্রহণ",
        "উচ্চ শারীরিক সহনশীলতা, প্রত্যুৎপন্নমতিত্ব এবং দৃঢ় সংকল্প",
        "সরাসরি, অকপট এবং সত্যবাদী কথাবার্তা",
        "অধীনস্থ ও দুর্বল মানুষদের রক্ষা করার আন্তরিক মনোভাব",
      ],
      cautions_and_pitfalls: [
        "উগ্র মেজাজ, দ্রুত রেগে যাওয়া এবং চিন্তা না করে হঠাৎ কথা বলা থেকে সাবধান",
        "যাচাই না করে হুটহাট ঝুঁকিপূর্ণ আর্থিক সিদ্ধান্ত বা ফাটকা ব্যবসায় জড়ানো",
        "একসাথে একাধিক কাজ শুরু করে মাঝপথে ধৈর্য ও উৎসাহ হারিয়ে ফেলা",
        "অতিরিক্ত তাড়াহুড়ো ও অস্থিরতার কারণে মাথা বা মুখে আঘাতের ঝুঁকি",
        "কাজে অনাকাঙ্ক্ষিত দেরি, অন্যের ভালো উপদেশ বা অধীনতা সহজে মেনে নিতে না পারা",
      ],
      beneficial_actions_and_remedies: [
        "প্রতিদিন সকালে প্রাণায়াম ও ধ্যানের মাধ্যমে মনের অতিরিক্ত উত্তেজনা শান্ত রাখুন",
        "প্রতি মঙ্গলবার ভক্তিভরে শ্রী হনুমান চালিসা বা কার্তিকেয় স্তোত্র পাঠ করুন",
        "অতিরিক্ত শারীরিক শক্তিকে শরীরচর্চা, যোগাসন বা গঠনমূলক কাজে নিয়োজিত করুন",
        "মঙ্গলবার লাল মুসুর ডাল, তামার সামগ্রী বা লাল মিষ্টান্ন অভাবীদের দান করুন",
        "উত্তেজিত পরিস্থিতিতে তাৎক্ষণিক প্রতিক্রিয়া না জানিয়ে অন্তত ১০ সেকেন্ড শান্ত থাকুন",
      ],
      career_fields: [
        "প্রতিরক্ষা, পুলিশ, সেনাবহিনী ও নিরাপত্তা বিভাগ",
        "শল্যচিকিৎসা (সার্জারি), চিকিৎসাবিজ্ঞান ও জরুরি স্বাস্থ্যসেবা",
        "উদ্যোক্তা, স্টার্টআপ নেতৃত্ব ও ব্যবসা প্রশাসন",
        "মেকানিক্যাল ইঞ্জিনিয়ারিং, রিয়েল এস্টেট ও নির্মাণশিল্প",
        "ক্রীড়া, অ্যাথলেটিক্স ও সামরিক প্রশিক্ষণ",
      ],
      lucky_color: "গাঢ় লাল, প্রবাল ও জাফরান",
      lucky_gemstone: "রক্ত প্রবাল (Red Coral)",
      lucky_day: "মঙ্গলবার",
      ruling_deity: "ভগবান হনুমান ও কার্তিকেয়",
      compatible_rashis: ["সিংহ", "ধনু", "মিথুন", "কুম্ভ"],
    },
    hi: {
      name: "मेष",
      element: "अग्नि तत्व",
      modality: "चर राशि (Movable)",
      polarity: "पुरुष / दिवा राशि",
      body_parts: "मस्तिष्क, सिर, ललाट, कपाल और रक्त वाहिकाएं",
      nature: "ऊर्जावान, साहसी, पराक्रमी, स्पष्टवादी, नेतृत्व-कुशल एवं ओजस्वी",
      overview:
        "मंगल ग्रह द्वारा शासित मेष राशि जीवन की ऊर्जा और साहस का प्रतीक है। मेष राशि के जातक जन्मजात रूप से साहसी और किसी भी कार्य में अग्रणी भूमिका निभाने वाले होते हैं। वे चुनौतियों का डटकर मुकाबला करते हैं और स्वतंत्र विचार रखते हैं।",
      strengths: [
        "निर्भीक नेतृत्व और कठिन परिस्थितियों में तुरंत निर्णय लेने की क्षमता",
        "उच्च शारीरिक ऊर्जा, त्वरित समाधान और अटूट संकल्प शक्ति",
        "स्पष्ट, ईमानदार और सच्चा व्यवहार",
        "आश्रितों और साथियों की रक्षा करने की स्वाभाविक भावना",
      ],
      cautions_and_pitfalls: [
        "उग्र स्वभाव, शीघ्र क्रोधित होना और बिना सोचे-समझे कटु वचन बोलने से बचें",
        "जल्दबाजी में वित्तीय जोखिम या सट्टेबाजी के मामलों में नुकसान उठाना",
        "अनेक कार्य एक साथ शुरू करके बीच में ही उत्साह खो देना",
        "जल्दबाजी के कारण सिरदर्द, माइग्रेन या सिर-चेहरे पर चोट का जोखिम",
        "काम में देरी, दूसरों की नेक सलाह या किसी के अधीन काम करने में असहज होना",
      ],
      beneficial_actions_and_remedies: [
        "प्रतिदिन सुबह प्राणायाम और ध्यान द्वारा मानसिक शांति बनाए रखें",
        "प्रत्येक मंगलवार को श्री हनुमान चालीसा या सुंदरकांड का पाठ करें",
        "अतिरिक्त ऊर्जा को खेलकूद, व्यायाम या रचनात्मक कार्यों में लगाएं",
        "मंगलवार को लाल मसूर की दाल, तांबे का बर्तन या गुड़ का दान करें",
        "क्रोध या विवाद की स्थिति में तुरंत बोलने के बजाय १० सेकंड मौन रहें",
      ],
      career_fields: [
        "सेना, पुलिस, रक्षा एवं सुरक्षा सेवाएं",
        "शल्य चिकित्सा (सर्जरी), चिकित्सा एवं आपातकालीन सेवाएं",
        "उद्यमिता, व्यापारिक नेतृत्व एवं स्टार्टअप",
        "मैकेनिकल इंजीनियरिंग, निर्माण एवं रियल एस्टेट",
        "खेलकूद, एथलेटिक्स एवं सुरक्षा परामर्श",
      ],
      lucky_color: "गहरा लाल, मूंगा रंग एवं केसरिया",
      lucky_gemstone: "लाल मूंगा (Red Coral)",
      lucky_day: "मंगलवार",
      ruling_deity: "भगवान श्री हनुमान एवं कार्तिकेय",
      compatible_rashis: ["सिंह", "धनु", "मिथुन", "कुंभ"],
    },
  },

  // 1. TAURUS
  1: {
    en: {
      name: "Taurus",
      element: "Earthy",
      modality: "Fixed / Static",
      polarity: "Feminine / Night Sign",
      body_parts: "Face, neck, throat, vocal cords, thyroid, chin",
      nature: "Stable, loyal, patient, luxury-loving, artistic, dependable, methodical",
      overview:
        "Ruled by Venus, Taurus embodies stability, endurance, and sensual beauty. Those with Moon in Taurus have a peaceful demeanor, attractive face, fine teeth, and an eye for aesthetics. They value financial security, domestic comfort, and lasting loyalty.",
      strengths: [
        "Rock-solid dependability, patience, and loyalty",
        "Superb financial planning and resource management",
        "Refined taste in fine arts, music, culinary delights, and luxury",
        "Calm resilience under pressure and steadfast endurance",
      ],
      cautions_and_pitfalls: [
        "Extreme stubbornness and resistance to necessary modern changes",
        "Overindulgence in heavy food, sweets, and material luxuries",
        "Tendency towards sluggishness, procrastination, and physical lethargy",
        "Possessiveness and insecurity in emotional relationships",
        "Vulnerability to throat infections, vocal strain, and thyroid imbalances",
      ],
      beneficial_actions_and_remedies: [
        "Embrace flexibility and practice letting go of rigid mental stances",
        "Worship Goddess Mahalakshmi on Fridays; offer white flowers and kheer",
        "Regular throat gargling and vocal care; spend time in lush gardens/nature",
        "Donate white garments, rice, dairy products, or silver items on Fridays",
        "Incorporate light cardio and outdoor walking into your daily routine",
      ],
      career_fields: [
        "Banking, financial advisory, wealth management & accounting",
        "Fashion, jewelry, cosmetics, beauty & interior design",
        "Culinary arts, restaurant business, hospitality & luxury hotels",
        "Music, singing, fine arts & voice artistry",
        "Agriculture, horticulture & luxury real estate",
      ],
      lucky_color: "White, Cream, Pearl & Rose Pink",
      lucky_gemstone: "Diamond (Heera) or White Sapphire",
      lucky_day: "Friday",
      ruling_deity: "Goddess Lakshmi",
      compatible_rashis: ["Virgo", "Capricorn", "Cancer", "Pisces"],
    },
    bn: {
      name: "বৃষ",
      element: "পৃথ্বী তত্ত্ব (Earth)",
      modality: "স্থির রাশি (Fixed)",
      polarity: "স্ত্রী / রাত্রি রাশি",
      body_parts: "মুখমণ্ডল, গলা, কণ্ঠনালী, থাইরয়েড ও চিবুক",
      nature: "ধৈর্যশীল, বিশ্বস্ত, শান্ত, সৌন্দর্যপ্রিয়, বাস্তববাদী ও নির্ভরযোগ্য",
      overview:
        "শুক্র গ্রহের শাসনাধীন বৃষ রাশি স্থায়িত্ব, সৌন্দর্য ও সমৃদ্ধির প্রতীক। বৃষ রাশির জাতক-জাতিকাদের ব্যক্তিত্ব শান্ত ও সৌম্য। তারা আর্থিক নিরাপত্তা, পারিবারিক শান্তি এবং রুচিশীল জীবনযাপন পছন্দ করেন।",
      strengths: [
        "অটল ধৈর্য, নির্ভরযোগ্যতা এবং আজীবন অটুট আনুগত্য",
        "উচ্চমানের অর্থনৈতিক পরিকল্পনা ও সম্পদ সঞ্চয় করার অসাধারণ ক্ষমতা",
        "শিল্পকলা, সংগীত, রসনা বিলাস ও সৌন্দর্যের গভীর সমঝদার",
        "যেকোনো প্রতিকূল পরিস্থিতিতেও শান্ত থেকে পরিস্থিতি সামলানোর ক্ষমতা",
      ],
      cautions_and_pitfalls: [
        "চরম একগুঁয়ে মনোভাব এবং প্রয়োজনীয় গঠনমূলক পরিবর্তনকে অস্বীকার করা",
        "অতিরিক্ত মিষ্টি, গুরুপাক খাদ্য এবং অলস বিলাসবহুল অভ্যাসে আসক্তি",
        "কাজে দীর্ঘসূত্রতা, আলস্য এবং শারীরিক স্থবিরতার প্রবণতা",
        "সম্পর্কের ক্ষেত্রে অতিরিক্ত অধিকারবোধ ও নিরাপত্তাহীনতায় ভোগা",
        "গলা ও শ্বাসনালীর সংক্রমণ, থাইরয়েড ও কণ্ঠস্বরের দুর্বলতা থেকে সাবধান",
      ],
      beneficial_actions_and_remedies: [
        "মানসিক নমনীয়তা বৃদ্ধি করুন এবং অন্যের যৌক্তিক মতামতের প্রতি শ্রদ্ধাশীল হন",
        "প্রতি শুক্রবার মা মহালক্ষ্মীর আরাধনা করুন এবং সাদা ফুল বা পায়েস নিবেদন করুন",
        "কণ্ঠের যত্ন নিন এবং মানসিক প্রশান্তির জন্য সুদৃশ্য বাগান ও প্রকৃতির সান্নিধ্যে সময় কাটান",
        "শুক্রবার সাদা পোশাক, চাল, দুধ বা মিষ্টান্ন অভাবীদের দান করুন",
        "দৈনিক নিয়মিত প্রাতঃভ্রমণ ও শরীরচর্চা করুন যাতে অলসতা দূর হয়",
      ],
      career_fields: [
        "ব্যাংকিং, ফিন্যান্সিয়াল প্ল্যানিং ও সম্পদ ব্যবস্থাপনা",
        "ফ্যাশন, জুয়েলারি, কসমেটিকস ও ইন্টেরিয়র ডিজাইন",
        "হোটেল ম্যানেজমেন্ট, ক্যাটারিং ও খাদ্যপণ্য ব্যবসা",
        "সংগীত, চারুকলা, কন্ঠশিল্পী ও বিজ্ঞাপন জগৎ",
        "কৃষিশিল্প, নার্সারি ও আবাসন (রিয়েল এস্টেট)",
      ],
      lucky_color: "দুধসাদা, ক্রিম, মুক্তা ও হালকা গোলাপি",
      lucky_gemstone: "হীরক (Diamond) বা সাদা অপাল",
      lucky_day: "শুক্রবার",
      ruling_deity: "দেবী মহালক্ষ্মী",
      compatible_rashis: ["কন্যা", "মকর", "কর্কট", "মীন"],
    },
    hi: {
      name: "वृषभ",
      element: "पृथ्वी तत्व",
      modality: "स्थिर राशि (Fixed)",
      polarity: "स्त्री / रात्रि राशि",
      body_parts: "मुख, गला, कंठ, थायरॉयड ग्रंथि और ठोड़ी",
      nature: "धैर्यवान, निष्ठावान, शांत, कलाप्रिय, व्यावहारिक और सुदृढ़",
      overview:
        "शुक्र देव द्वारा शासित वृषभ राशि स्थिरता, सौंदर्य और सुख-समृद्धि का प्रतीक है। वृषभ राशि के जातक शांत स्वभाव, आकर्षक व्यक्तित्व और व्यावहारिक सोच वाले होते हैं। वे जीवन में आर्थिक सुरक्षा और पारिवारिक सामंजस्य को सर्वोच्च प्राथमिकता देते हैं।",
      strengths: [
        "अटूट धैर्य, विश्वसनीयता और जीवनपर्यंत निभाने वाली वफादारी",
        "उत्कृष्ट वित्तीय समझ और संपत्ति संचय करने की अद्भुत कला",
        "संगीत, ललित कला, उत्तम भोजन और विलासिता के पारखी",
        "दबाव और विपरीत परिस्थितियों में भी शांत रहकर कार्य करने की क्षमता",
      ],
      cautions_and_pitfalls: [
        "अत्यधिक जिद्दी स्वभाव और आवश्यक बदलावों का विरोध करने से बचें",
        "अत्यधिक गरिष्ठ भोजन, मिष्ठान्न और शारीरिक आलस्य में लिप्तता",
        "काम को टालने की आदत और अत्यधिक सुस्ती का शिकार होना",
        "पारिवारिक या प्रेम संबंधों में अत्यधिक अधिकार जताना",
        "गले के संक्रमण, आवाज में खराश और थायरॉयड की समस्याओं के प्रति सतर्क रहें",
      ],
      beneficial_actions_and_remedies: [
        "अपने विचारों में लचीलापन लाएं और दूसरों की राय का भी सम्मान करें",
        "शुक्रवार को माता महालक्ष्मी की पूजा करें और सफेद पुष्प या खीर अर्पित करें",
        "गले की उचित देखभाल करें और प्राकृतिक उद्यानों में समय व्यतीत करें",
        "शुक्रवार को सफेद वस्त्र, चावल, दूध, मिश्री या चांदी की वस्तु का दान करें",
        "दैनिक जीवन में सुबह की सैर और हल्का व्यायाम अनिवार्य रूप से शामिल करें",
      ],
      career_fields: [
        "बैंकिंग, वित्तीय परामर्श एवं धन प्रबंधन",
        "फैशन डिजाइनिंग, आभूषण, सौंदर्य प्रसाधन एवं इंटीरियर डिजाइन",
        "होटल प्रबंधन, खाद्य उद्योग एवं रेस्तरां व्यवसाय",
        "संगीत, गायन, अभिनय एवं कलात्मक क्षेत्र",
        "कृषि, बागवानी एवं रियल एस्टेट",
      ],
      lucky_color: "सफेद, क्रीम, मोती जैसा रंग एवं हल्का गुलाबी",
      lucky_gemstone: "हीरा (Diamond) या सफेद पुखराज",
      lucky_day: "शुक्रवार",
      ruling_deity: "माता महालक्ष्मी",
      compatible_rashis: ["कन्या", "मकर", "कर्क", "मीन"],
    },
  },

  // 7. SCORPIO
  7: {
    en: {
      name: "Scorpio",
      element: "Watery",
      modality: "Fixed / Static",
      polarity: "Feminine / Night Sign",
      body_parts: "Reproductive organs, pelvis, excretory system, bladder",
      nature: "Intense, penetrating, secretive, transformative, loyal, resilient",
      overview:
        "Ruled by Mars and representing the deep mystical waters, Scorpio is the sign of profound regeneration and hidden power. Moon in Scorpio bestows penetrating intuition, iron willpower, unwavering loyalty, and the ability to resurrect from life's greatest tribulations.",
      strengths: [
        "Unshakeable willpower, resilience, and transformative capacity",
        "Profound psychological penetration and lie-detection ability",
        "Fierce, lifelong loyalty to those who earn their trust",
        "Mastery over research, occult mysteries, and confidential matters",
      ],
      cautions_and_pitfalls: [
        "Harboring deep resentment, jealousy, and revenge fantasies",
        "Extreme secrecy and paranoia pushing loving people away",
        "Emotional all-or-nothing extremes leading to self-sabotage",
        "Vulnerability to reproductive, urinary, or pelvic inflammation",
        "Difficulty forgiving past betrayals or emotional wounds",
      ],
      beneficial_actions_and_remedies: [
        "Practice conscious forgiveness and release mental grudges daily",
        "Worship Lord Shiva (Maha Mrityunjaya Mantra) or Lord Hanuman on Tuesdays",
        "Donate blood voluntarily or donate red lentils/copper on Tuesdays",
        "Channel intensity into investigative work, occult research, or psychotherapy",
        "Maintain hygienic reproductive/pelvic health and practice grounding meditation",
      ],
      career_fields: [
        "Investigative journalism, espionage, intelligence & detective work",
        "Surgery, pathology, oncology & psychiatric psychotherapy",
        "Cybersecurity, forensic science & data forensics",
        "Mining, geology, petroleum, metallurgy & marine engineering",
        "Astrology, occult sciences, metaphysics & deep research",
      ],
      lucky_color: "Deep Maroon, Rust Brown, Black & Dark Red",
      lucky_gemstone: "Red Coral (Moonga) or Carnelian",
      lucky_day: "Tuesday",
      ruling_deity: "Lord Shiva & Lord Hanuman",
      compatible_rashis: ["Cancer", "Pisces", "Virgo", "Capricorn"],
    },
    bn: {
      name: "বৃশ্চিক",
      element: "জল তত্ত্ব (Water)",
      modality: "স্থির রাশি (Fixed)",
      polarity: "স্ত্রী / রাত্রি রাশি",
      body_parts: "প্রজনন অঙ্গ, পেলভিস, মূত্রনালী ও রেচনতন্ত্র",
      nature: "গভীর, আত্মপ্রত্যয়ী, রহস্যময়, অদম্য মনোবলের অধিকারী ও দৃঢ়চেতা",
      overview:
        "মঙ্গল গ্রহের শাসনাধীন বৃশ্চিক রাশি গভীর রহস্য, আত্মিক রূপান্তর ও অদম্য ইচ্ছাশক্তির প্রতীক। বৃশ্চিক রাশির জাতক-জাতিকাদের মন অত্যন্ত গভীর ও রহস্যভেদী। তারা মানুষের আসল রূপ এক পলকেই চিনে নিতে পারেন এবং জীবনের যেকোনো কঠিন বিপর্যয় থেকেও ফিনিক্স পাখির মতো নতুন শক্তিতে জেগে উঠতে পারেন।",
      strengths: [
        "অটল ইচ্ছাশক্তি, অদম্য মানসিক সহনশীলতা ও ঘুরে দাঁড়ানোর অসাধারণ ক্ষমতা",
        "গভীর মনস্তাত্ত্বিক দূরদৃষ্টি ও মিথ্যা বা প্রতারণা সহজেই ধরে ফেলার বিশেষ ক্ষমতা",
        "বিশ্বাসভাজন প্রিয়জনদের প্রতি আজীবন অটুট ও নিঃশর্ত আনুগত্য",
        "গভীর গবেষণা, গোপন বিষয়াদি ও আধ্যাত্মিক রহস্য উন্মোচনে অনন্য দক্ষতা",
      ],
      cautions_and_pitfalls: [
        "গভীর ক্ষোভ, ঈর্ষা বা প্রতিশোধস্পৃহা মনে পুষে রাখা থেকে সাবধান",
        "অতিরিক্ত গোপনীয়তা ও অহেতুক সন্দেহবাতিকতা যা আপনজনদের দূরে সরিয়ে দেয়",
        "সবকিছুতেই চরমপন্থা (Extreme All-or-Nothing) অবলম্বন করে নিজের ক্ষতি করা",
        "প্রজনন অঙ্গ, পেলভিক বা মূত্রনালীর প্রদাহজনিত সমস্যা থেকে সাবধান",
        "অতীতের বিশ্বাসঘাতকতা বা আঘাত সহজে ক্ষমা করতে না পারা",
      ],
      beneficial_actions_and_remedies: [
        "প্রতিদিন ক্ষমাশীলতার অনুশীলন করুন এবং মনের দীর্ঘদিনের ক্ষোভ মুক্ত করুন",
        "প্রতি মঙ্গলবার ভগবান শিবের মহামৃত্যুঞ্জয় মন্ত্র বা হনুমান চালিসা পাঠ করুন",
        "স্বেচ্ছায় রক্তদান করুন অথবা মঙ্গলবার লাল মুসুর ডাল ও তামা অভাবীদের দান করুন",
        "মনের তীব্র একাগ্রতাকে গভীর গবেষণা, আধ্যাত্মিক চর্চা বা কঠিন কাজে লাগান",
        "প্রজনন ও মূত্রনালীর স্বাস্থ্যবিধি মেনে চলুন এবং গ্রাউন্ডিং মেডিটেশন করুন",
      ],
      career_fields: [
        "গোয়েন্দা বিভাগ, সাইবার সিকিউরিটি, গোয়েন্দা সাংবাদিকতা ও ফরেনসিক",
        "শল্যচিকিৎসা (সার্জারি), প্যাথলজি, সাইকিয়াট্রি ও সাইকোথেরাপি",
        "খনিজ সম্পদ, ভূতত্ত্ব, পেট্রোলিয়াম ও গভীর সমুদ্র অনুসন্ধান",
        "জ্যোতির্বিদ্যা, গুপ্তবিদ্যা (Occult), অধিবিদ্যা ও গভীর বৈজ্ঞানিক গবেষণা",
        "জরুরি সংকট ব্যবস্থাপনা ও ডিফেন্স স্ট্র্যাটেজি",
      ],
      lucky_color: "গাঢ় খয়েরি, রক্তলাল ও মেটালিক কালো",
      lucky_gemstone: "রক্ত প্রবাল (Red Coral)",
      lucky_day: "মঙ্গলবার",
      ruling_deity: "দেবাদিদেব মহাদেব ও শ্রী হনুমানজি",
      compatible_rashis: ["কর্কট", "মীন", "কন্যা", "মকর"],
    },
    hi: {
      name: "वृश्चिक",
      element: "जल तत्व",
      modality: "स्थिर राशि (Fixed)",
      polarity: "स्त्री / रात्रि राशि",
      body_parts: "प्रजनन अंग, मूत्राशय, पेल्विस और उत्सर्जन तंत्र",
      nature: "गंभीर, दृढ़-संकल्पी, रहस्यमयी, परिवर्तनकारी और निष्ठावान",
      overview:
        "मंगल देव द्वारा शासित वृश्चिक राशि गूढ़ रहस्य, गहन इच्छाशक्ति और रूपांतरण की प्रतीक है। वृश्चिक राशि के जातक तीव्र अंतर्दृष्टि, अटूट संकल्प और साहसी मनोबल वाले होते हैं। वे जीवन की सबसे बड़ी विपदाओं से भी राख से उठने वाले फीनिक्स की तरह पुनः उठ खड़े होने की क्षमता रखते हैं।",
      strengths: [
        "अटूट इच्छाशक्ति, मानसिक दृढ़ता और जीवन को पुनः संवारने की अद्भुत क्षमता",
        "गहरी मनोवैज्ञानिक पकड़ और झूठ को तुरंत पकड़ लेने की स्वाभाविक योग्यता",
        "जिन पर भरोसा करते हैं, उनके प्रति आजीवन सच्ची वफादारी",
        "अनुसंधान, गुप्त विद्याओं और कठिन रहस्यों को सुलझाने में महारत",
      ],
      cautions_and_pitfalls: [
        "मन में गहरा क्रोध, ईर्ष्या या बदले की भावना रखने से बचें",
        "अत्यधिक गोपनीयता और अविश्वास के कारण अपनों को दूर करना",
        "चरमपंथी सोच (सब कुछ या कुछ नहीं) के कारण आत्मघाती निर्णय लेना",
        "प्रजनन अंगों, मूत्राशय और पेल्विक क्षेत्र के संक्रमण के प्रति सतर्क रहें",
        "अतीत के विश्वासघात या भावनात्मक चोटों को क्षमा न कर पाना",
      ],
      beneficial_actions_and_remedies: [
        "मन में क्षमा भाव रखें और पुराने गिले-शिकवे त्यागने का अभ्यास करें",
        "प्रत्येक मंगलवार को महामृत्युंजय मंत्र या हनुमान चालीसा का पाठ करें",
        "स्वैच्छिक रक्तदान करें या मंगलवार को लाल मसूर की दाल और तांबे का दान करें",
        "अपनी तीव्र ऊर्जा को गूढ़ अनुसंधान, अध्यात्म या रचनात्मक कार्यों में लगाएं",
        "शारीरिक स्वच्छता पर विशेष ध्यान दें और दैनिक ध्यान का अभ्यास करें",
      ],
      career_fields: [
        "जासूसी विभाग, खुफिया एजेंसी, साइबर सुरक्षा एवं फॉरेंसिक विज्ञान",
        "शल्य चिकित्सा (सर्जरी), पैथोलॉजी एवं मनोचिकित्सा",
        "खनन, पेट्रोलियम, भूविज्ञान एवं समुद्री इंजीनियरिंग",
        "ज्योतिष, गूढ़ रहस्य विज्ञान, अध्यात्म एवं गहन शोध",
        "आपदा प्रबंधन एवं रक्षा रणनीति",
      ],
      lucky_color: "गहरा महरून, रस्ट ब्राउन एवं लाल",
      lucky_gemstone: "लाल मूंगा (Red Coral)",
      lucky_day: "मंगलवार",
      ruling_deity: "भगवान शिव एवं श्री हनुमान",
      compatible_rashis: ["कर्क", "मीन", "कन्या", "मकर"],
    },
  },
};

/**
 * Returns localized traits for any rashi index and language.
 * Falls back safely to English or dynamic backend result if not present.
 */
export function getClientRashiTraits(
  rashiIndex: number,
  lang: "en" | "bn" | "hi",
  fallbackTraits?: any,
  translationsMap?: Record<string, any>
): LocalizedTraits {
  // If backend provided translationsMap for requested language, use it!
  if (translationsMap && translationsMap[lang]) {
    return translationsMap[lang];
  }

  const safeIdx = rashiIndex % 12;
  const match = CLIENT_RASHI_TRANSLATIONS[safeIdx];
  if (match && match[lang]) {
    return match[lang];
  }

  // Otherwise return fallback or match['en']
  return match ? match.en : (fallbackTraits as LocalizedTraits);
}
