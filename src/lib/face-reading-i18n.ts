/**
 * Multi-language translations for Samudrik Shastra Face Reading.
 * Supports English, Bengali (বাংলা), and Hindi (हिंदी).
 */

export type FaceReadingLanguage = "en" | "bn" | "hi";

export interface TranslatedSection {
  featureLabel: string;
  label: string;
  meaning: string;
  areaLabel: string;
}

export const I18N_UI: Record<FaceReadingLanguage, Record<string, string>> = {
  en: {
    title: "Samudrik Shastra Face Reading",
    subtitle: "Ancient Vedic physiognomy reads your character, strengths, and destiny in the classical proportions of your forehead, eyes, nose, lips, and jawline.",
    langLabel: "Reading Language",
    startCamera: "Start Camera Scan",
    uploadPhoto: "Upload a Photo",
    captureNow: "Capture Now",
    cancel: "Cancel",
    readAnother: "Read Another Face",
    eyeLevel: "Eye Level",
    chinPos: "Chin Position",
    aiActive: "AI Vision Active",
    aligned: "Aligned",
    scanning: "Scanning…",
    posInOval: "Position your face inside the oval",
    moveIntoFrame: "Move your face into the frame",
    alignedHold: "Aligned! Hold still",
    faceCaptured: "Face Captured!",
    lookStraight: "Your head is turned. Look straight at the camera.",
    headTilted: "Your head is tilted. Keep it level.",
    tooFar: "Move closer to the camera.",
    tooClose: "Move slightly back from the camera.",
    measuringTitle: "Analyzing Vedic Facial Proportions",
    step1: "Mapping 478 high-precision facial coordinates…",
    step2: "Calculating forehead, eye, and jawline proportions…",
    step3: "Cross-referencing Vedic Samudrik Shastra treatises…",
    step4: "Synthesizing your personalized character & destiny report…",
    resultsTitle: "Your Vedic Physiognomy Analysis",
    scanPrecision: "Scan Precision",
    featuresDecoded: "facial features decoded",
    coinsDebited: "coins debited",
    disclaimer: "Samudrik Shastra is a revered traditional system of character reading offered here for personal self-reflection.",
    tipsTitle: "How to get the most accurate scan",
    tip1: "Look directly at the camera at eye level.",
    tip2: "Ensure soft, even lighting without harsh shadows.",
    tip3: "Keep your hair away from your forehead and eyebrows.",
    tip4: "Maintain a neutral facial expression while holding still.",
    privacyNote: "Zero image storage — 100% processed on your device",
    costLabel: "Cost:",
    balanceLabel: "Balance:",
    coins: "coins",
    cameraReady: "Position your face in the camera frame to begin",
    cameraStarting: "Starting camera and AI vision…",
    stopCamera: "Stop Camera",
    captureReady: "Capture & Read Face",
    captureManual: "Capture Now",
    holdStill: "Hold still for",
    perfectKeepStill: "Perfect! Hold still",
    alignedReady: "Face aligned! Click button below to scan",
    centerFace: "Position face inside oval",
  },
  bn: {
    title: "সামুদ্রিক শাস্ত্র মুখাবয়ব বিশ্লেষণ",
    subtitle: "প্রাচীন বৈদিক সামুদ্রিক শাস্ত্রে আপনার কপাল, চোখ, নাক, ঠোঁট ও চোয়ালের অনুপাত ও লক্ষণ বিশ্লেষণ করে চারিত্রিক বৈশিষ্ট্য, শক্তি ও ভাগ্যের পথ উন্মোচন করা হয়।",
    langLabel: "ফলাফলের ভাষা",
    startCamera: "ক্যামেরা স্ক্যান শুরু করুন",
    uploadPhoto: "ছবি আপলোড করুন",
    captureNow: "এখনই ক্যাপচার করুন",
    cancel: "বাতিল করুন",
    readAnother: "আরেকটি মুখ স্ক্যান করুন",
    eyeLevel: "চোখের স্তর",
    chinPos: "চিবুকের অবস্থান",
    aiActive: "এআই ভিশন সক্রিয়",
    aligned: "সঠিক অবস্থান",
    scanning: "স্ক্যান চলছে…",
    posInOval: "ওভালের ভেতরে মুখ সোজা রাখুন",
    moveIntoFrame: "ক্যামেরার ফ্রেমে মুখ আনুন",
    alignedHold: "সঠিক অবস্থান! স্থির থাকুন",
    faceCaptured: "মুখ ক্যাপচার সম্পন্ন!",
    lookStraight: "মাথা একদিকে ঘোরানো। ক্যামেরার দিকে সোজা তাকান।",
    headTilted: "মাথা কাত হয়ে আছে। সোজা রাখুন।",
    tooFar: "ক্যামেরার আরেকটু কাছে আসুন।",
    tooClose: "ক্যামেরা থেকে সামান্য দূরে যান।",
    measuringTitle: "বৈদিক মুখাবয়ব অনুপাত বিশ্লেষণ করা হচ্ছে",
    step1: "৪৭৮টি সূক্ষ্ম মুখের স্থানাঙ্ক চিহ্নিত করা হচ্ছে…",
    step2: "কপাল, চোখ ও চোয়ালের বৈদিক অনুপাত হিসাব করা হচ্ছে…",
    step3: "সামুদ্রিক শাস্ত্রের সনাতন সূত্রাবলী বিশ্লেষণ করা হচ্ছে…",
    step4: "আপনার ব্যক্তিত্ব ও ভাগ্যফল রিপোর্ট প্রস্তুত করা হচ্ছে…",
    resultsTitle: "আপনার বৈদিক মুখাবয়ব বিশ্লেষণ রিপোর্ট",
    scanPrecision: "স্ক্যান নিখুঁততা",
    featuresDecoded: "টি লক্ষণ বিশ্লেষণ করা হয়েছে",
    coinsDebited: "কয়েন কাটা হয়েছে",
    disclaimer: "সামুদ্রিক শাস্ত্র একটি প্রাচীন সনাতন জ্যোতিষীয় ঐতিহ্য, যা আপনার আত্মোপলব্ধি ও আত্মউন্নয়নের জন্য উপস্থাপন করা হয়েছে।",
    tipsTitle: "নিখুঁত স্ক্যান পাওয়ার সহজ নিয়মাবলী",
    tip1: "ক্যামেরার দিকে চোখের সমান্তরালে সরাসরি তাকান।",
    tip2: "মুখে পর্যাপ্ত ও সমান আলো রাখুন, ছায়া যেন না পড়ে।",
    tip3: "কপাল ও ভ্রুর ওপর থেকে চুল সরিয়ে রাখুন।",
    tip4: "স্ক্যানের সময় মুখের ভাব স্বাভাবিক ও স্থির রাখুন।",
    privacyNote: "ছবি সার্ভারে পাঠানো হয় না — সম্পূর্ণ বিশ্লেষণ আপনার ব্রাউজারে হয়",
    costLabel: "খরচ:",
    balanceLabel: "ব্যালেন্স:",
    coins: "কয়েন",
    cameraReady: "লাইভ ফেস স্ক্যানের জন্য ক্যামেরার সামনে মুখ রাখুন",
    cameraStarting: "ক্যামেরা ও এআই চালু হচ্ছে…",
    stopCamera: "ক্যামেরা বন্ধ করুন",
    captureReady: "এখনই স্ক্যান করুন",
    captureManual: "ছবি তুলুন",
    holdStill: "স্থির থাকুন",
    perfectKeepStill: "নিখুঁত! স্থির থাকুন",
    alignedReady: "মুখের অবস্থান সঠিক! নিচের বাটনে ক্লিক করুন",
    centerFace: "ওভালের ভেতরে মুখ রাখুন",
  },
  hi: {
    title: "सामुद्रिक शास्त्र मुखाकृति विश्लेषण",
    subtitle: "प्राचीन वैदिक सामुद्रिक शास्त्र आपके माथे, आंख, नाक, होंठ और जबड़े के शास्त्रीय अनुपातों के आधार पर आपके चरित्र, शक्तियों और भाग्य का विश्लेषण करता है।",
    langLabel: "परिणाम की भाषा",
    startCamera: "कैमरा स्कैन शुरू करें",
    uploadPhoto: "फोटो अपलोड करें",
    captureNow: "अभी कैप्चर करें",
    cancel: "रद्द करें",
    readAnother: "दूसरा चेहरा स्कैन करें",
    eyeLevel: "नेत्र स्तर",
    chinPos: "ठोड़ी की स्थिति",
    aiActive: "एआई विजन सक्रिय",
    aligned: "सही स्थिति",
    scanning: "स्कैनिंग जारी है…",
    posInOval: "अंडाकार घेरे में अपना चेहरा रखें",
    moveIntoFrame: "कैमरा फ्रेम में चेहरा लाएं",
    alignedHold: "सही स्थिति! स्थिर रहें",
    faceCaptured: "चेहरा कैप्चर हुआ!",
    lookStraight: "सिर एक तरफ मुड़ा है। कैमरे की ओर सीधे देखें।",
    headTilted: "सिर झुका हुआ है। इसे सीधा रखें।",
    tooFar: "कैमरे के थोड़े करीब आएं।",
    tooClose: "कैमरे से थोड़ा पीछे हटें।",
    measuringTitle: "वैदिक मुखाकृति अनुपातों का विश्लेषण",
    step1: "478 सटीक चेहरे के निर्देशांक मैप किए जा रहे हैं…",
    step2: "माथे, आंखों व जबड़े के वैदिक अनुपातों की गणना जारी है…",
    step3: "सामुद्रिक शास्त्र के प्राचीन सूत्रों का विश्लेषण किया जा रहा है…",
    step4: "आपका व्यक्तिगत चरित्र व भविष्यफल रिपोर्ट तैयार हो रहा है…",
    resultsTitle: "आपकी वैदिक मुखाकृति विश्लेषण रिपोर्ट",
    scanPrecision: "स्कैन सटीकता",
    featuresDecoded: "लक्षणों का विश्लेषण हुआ",
    coinsDebited: "सिक्के काटे गए",
    disclaimer: "सामुद्रिक शास्त्र एक प्राचीन वैदिक परंपरा है, जो आत्म-चिंतन और व्यक्तिगत मार्गदर्शन के लिए प्रस्तुत की गई है।",
    tipsTitle: "सटीक स्कैन प्राप्त करने के निर्देश",
    tip1: "कैमरे की ओर आंखों के स्तर पर सीधे देखें।",
    tip2: "चेहरे पर पर्याप्त व एकसमान रोशनी सुनिश्चित करें।",
    tip3: "माथे और भौंहों से बाल हटाकर रखें।",
    tip4: "स्कैन के समय चेहरे के भाव सामान्य और स्थिर रखें।",
    privacyNote: "कोई फोटो सर्वर पर नहीं भेजी जाती — पूर्ण विश्लेषण आपके डिवाइस पर होता है",
    costLabel: "लागत:",
    balanceLabel: "बैलेंस:",
    coins: "सिक्के",
    cameraReady: "लाइव फेस स्कैन के लिए कैमरे के सामने आएं",
    cameraStarting: "कैमरा और एआई शुरू हो रहा है…",
    stopCamera: "कैमरा बंद करें",
    captureReady: "अभी स्कैन करें",
    captureManual: "फोटो लें",
    holdStill: "स्थिर रहें",
    perfectKeepStill: "बिल्कुल सही! स्थिर रहें",
    alignedReady: "चेहरा सही स्थिति में है! नीचे बटन दबाएं",
    centerFace: "अंडाकार घेरे में चेहरा रखें",
  },
};

export const FEATURE_NAMES: Record<string, Record<FaceReadingLanguage, string>> = {
  face_shape: { en: "Face Shape", bn: "মুখের গঠন", hi: "चेहरे की बनावट" },
  forehead: { en: "Forehead", bn: "কপাল", hi: "माथा" },
  eyebrows: { en: "Eyebrows", bn: "ভ্রু", hi: "भौंहें" },
  eyes: { en: "Eyes", bn: "চোখ", hi: "आंखें" },
  nose: { en: "Nose", bn: "নাক", hi: "नाक" },
  lips: { en: "Lips & smile", bn: "ঠোঁট ও হাসি", hi: "होंठ व मुस्कान" },
  chin: { en: "Chin & jaw", bn: "চিবুক ও চোয়াল", hi: "ठोड़ी व जबड़ा" },
  cheeks: { en: "Cheeks", bn: "গাল", hi: "गाल" },
};

export const AREA_NAMES: Record<string, Record<FaceReadingLanguage, string>> = {
  temperament: { en: "Temperament", bn: "প্রকৃতি ও মেজাজ", hi: "स्वभाव व मिजाज" },
  intellect: { en: "Intellect", bn: "বুদ্ধি ও প্রজ্ঞা", hi: "बुद्धि व विचार" },
  energy: { en: "Energy", bn: "কর্মশক্তি ও উদ্যোগ", hi: "ऊर्जा व उत्साह" },
  perception: { en: "Perception", bn: "দৃষ্টিভঙ্গি ও পর্যবেক্ষণ", hi: "दृष्टिकोण व अवलोकन" },
  ambition: { en: "Ambition", bn: "উচ্চাকাঙ্ক্ষা ও নেতৃত্ব", hi: "महत्वाकांक्षा व नेतृत्व" },
  relationships: { en: "Relationships", bn: "সম্পর্ক ও সামাজিকতা", hi: "संबंध व मेलजोल" },
  resolve: { en: "Resolve", bn: "সংকল্প ও ইচ্ছাশক্তি", hi: "दृढ़ संकल्प" },
  vitality: { en: "Vitality", bn: "প্রাণশক্তি ও স্থায়িত্ব", hi: "जीवटता व स्वास्थ्य" },
  expression: { en: "Expression", bn: "অভিব্যক্তি ও আকর্ষণ", hi: "अभिव्यक्ति व आकर्षण" },
  wealth: { en: "Wealth & Prosperity", bn: "অর্থ ও সমৃদ্ধি", hi: "धन व समृद्धि" },
  standing: { en: "Social Standing", bn: "সামাজিক মর্যাদা ও প্রভাব", hi: "सामाजिक प्रतिष्ठा" },
  drive: { en: "Drive & Enterprise", bn: "কর্মপ্রেরণা ও উদ্যোগ", hi: "उद्यम व कर्मशक्ति" },
};


export const RULE_TRANSLATIONS: Record<string, { label: Record<FaceReadingLanguage, string>; meaning: Record<FaceReadingLanguage, string> }> = {
  "face_shape:round": {
    label: { en: "Round face", bn: "গোলাকার মুখ", hi: "गोल चेहरा" },
    meaning: { en: "A face as wide as it is long, with a soft jaw and little angle anywhere, is read as the mark of an approachable nature. The tradition associates it with warmth, sociability and an easy first impression \u2014 people tend to find you unguarded and talk to you readily. The same softness is said to show in how you handle conflict: you would rather smooth a disagreement than win it. Where it is thought to cost you is in holding a hard line; saying no, and meaning it the second time, is the discipline this face is told to practise.", bn: "যে মুখের দৈর্ঘ্য ও প্রস্থ প্রায় সমান এবং চোয়াল কোমল, তা অমায়িক ও স্নেহশীল প্রকৃতির লক্ষণ। আপনি সহজে মানুষের সাথে মিশতে পারেন এবং আপনার আন্তরিকতায় সবাই আকৃষ্ট হয়। বিরোধ দেখা দিলে জেতার চেয়ে শান্তি বজায় রাখাকে আপনি বেশি প্রাধান্য দেন। তবে প্রয়োজনে দৃঢ়ভাবে 'না' বলার অভ্যাস গড়ে তোলার পরামর্শ দেওয়া হয়।", hi: "जिस चेहरे की लंबाई और चौड़ाई लगभग समान हो और जबड़ा सौम्य हो, वह मिलनसार और दयालु स्वभाव का प्रतीक है। लोग आपके साथ जल्दी सहज हो जाते हैं। आप विवादों में उलझने के बजाय शांति बनाए रखना पसंद करते हैं। जरूरत पड़ने पर दृढ़ता से 'ना' कहने का अभ्यास आपके लिए लाभकारी रहेगा।" },
  },
  "face_shape:square": {
    label: { en: "Square face", bn: "চৌকা মুখ", hi: "चौकोर चेहरा" },
    meaning: { en: "A strong jaw carried at nearly the width of the cheekbones is one of the oldest marks of endurance in the tradition. It is read as determination that does not depend on mood: you finish things, and you are the one others rely on when a task turns dull. Authority tends to find you rather than the other way round. The caution attached to it is rigidity \u2014 a face read this way is said to hold a position long after the ground beneath it has shifted, and is advised to revisit decisions it has already made.", bn: "দৃঢ় ও স্পষ্ট চোয়ালবিশিষ্ট চৌকা মুখ প্রাচীন সামুদ্রিক শাস্ত্রে অটল ধৈর্য ও সহনশীলতার প্রতীক। আপনার কাজের আগ্রহ কেবল আবেগের ওপর নির্ভর করে না; আপনি কাজ শুরু করলে তা শেষ করে তবেই ছাড়েন। স্বাভাবিক নেতৃত্বগুণ আপনার মধ্যে প্রকাশ পায়। তবে সিদ্ধান্তের ক্ষেত্রে কিছুটা নমনীয়তা বজায় রাখা উপকারী।", hi: "चौड़ी गाल की हड्डियों के बराबर मजबूत जबड़ा असीम धैर्य और सहनशीलता का प्रतीक है। आप जो काम शुरू करते हैं, उसे पूरा करके ही दम लेते हैं। लोग कठिन समय में आप पर भरोसा करते हैं। हालांकि, लिए गए निर्णयों में समय के अनुसार लचीलापन बनाए रखना आपके लिए हितकर होगा।" },
  },
  "face_shape:long": {
    label: { en: "Long face", bn: "লম্বাটে মুখ", hi: "लंबा चेहरा" },
    meaning: { en: "A face noticeably longer than it is wide is associated with a considered, interior temperament. The reading is of someone who thinks before speaking and is comfortable alone \u2014 drawn to study, planning and work that rewards patience rather than quick reaction. Such a face is said to age well in reputation, being trusted more the longer people know it. Its difficulty is carrying worry privately: the tradition advises saying things out loud earlier than feels natural, since nothing here shows on the surface until it is already heavy.", bn: "প্রস্থের তুলনায় লক্ষণীয়ভাবে লম্বা মুখ গভীর চিন্তাশীল ও অন্তর্মুখী স্বভাব নির্দেশ করে। কথা বলার আগে আপনি গভীরভাবে চিন্তা করেন এবং একাকী পড়াশোনা বা দীর্ঘমেয়াদী পরিকল্পনামূলক কাজে বিশেষ পারদর্শী। সময়ের সাথে সাথে আপনার প্রতি মানুষের সম্মান ও আস্থা বহুগুণ বৃদ্ধি পায়।", hi: "चौड़ाई की तुलना में लंबा चेहरा गंभीर चिंतन और अंतर्मुखी स्वभाव का संकेत है। आप बोलने से पहले विचार करते हैं और अध्ययन, योजना तथा बौद्धिक कार्यों में उत्कृष्ट प्रदर्शन करते हैं। समय के साथ समाज में आपकी प्रतिष्ठा और विश्वसनीयता बढ़ती जाती है।" },
  },
  "face_shape:heart": {
    label: { en: "Heart-shaped face", bn: "হৃদয়াকৃতি মুখ", hi: "हृदयाकार चेहरा" },
    meaning: { en: "A broad upper face tapering to a fine chin is read as imagination sitting above a light practical anchor. The association is with expressiveness, quick sympathy and an eye for what others miss \u2014 faces read this way are placed in creative and persuasive work rather than administrative. Affection comes easily and is given early. The warning in the tradition concerns stamina rather than ability: enthusiasm arrives fast and can leave the same way, so the counsel is to commit to fewer things and see them through.", bn: "প্রশস্ত কপাল এবং সূক্ষ্ম চিবুক কল্পনাশক্তি ও সৃজনশীল মনের পরিচায়ক। আপনি অনুভূতিশীল, গভীর সহমর্মী এবং নতুন ভাবনায় পারদর্শী। শিল্প, যোগাযোগ বা মোটিভেশনাল কাজে আপনি অসাধারণ সফলতা অর্জন করেন।", hi: "चौड़ा माथा और नुकीली ठोड़ी रचनात्मकता और कल्पनाशीलता का प्रतीक है। आप अत्यधिक संवेदनशील और गहरी सहानुभूति रखने वाले व्यक्ति हैं। कला, साहित्य और प्रेरक कार्यों में आपकी स्वाभाविक प्रतिभा निखरती है।" },
  },
  "face_shape:diamond": {
    label: { en: "Diamond face", bn: "হীরাকৃতি মুখ", hi: "डायमंड चेहरा" },
    meaning: { en: "Cheekbones that are the widest part of the face, with both brow and jaw narrower, are read as a self-directed nature. The tradition gives this face precision and a certain unwillingness to be managed: you would rather do a thing properly alone than quickly with others. It is associated with detailed, demanding work and with standards applied first to oneself. The caution is that the same exactness is turned outward without meaning to, and can be felt by others as coldness it was never intended as.", bn: "উন্নত ও প্রশস্ত গাল এবং সংকীর্ণ কপাল ও চিবুক আত্মনির্ভরশীল প্রকৃতির লক্ষণ। আপনি কারো নিয়ন্ত্রণে থাকতে পছন্দ করেন না এবং নিখুঁতভাবে কাজ সম্পন্ন করেন। নিজের ওপর যেমন কঠোর মানদণ্ড বজায় রাখেন, অন্যদের প্রতিও তেমনি স্নেহশীল দৃষ্টি রাখা প্রয়োজন।", hi: "चौड़ी गाल की हड्डियां और संकीर्ण माथा व ठोड़ी स्वतंत्र और आत्मनिर्भर स्वभाव को दर्शाती हैं। आप अपने काम को पूरी बारीकी और उच्च मानकों के साथ करना पसंद करते हैं।" },
  },
  "face_shape:triangular": {
    label: { en: "Triangular face", bn: "ত্রিভুজাকৃতি মুখ", hi: "त्रिकोणीय चेहरा" },
    meaning: { en: "A jaw broader than the upper face reverses the usual proportion, and the tradition reads it as practical force. The association is with physical competence, persistence and a preference for doing over discussing \u2014 such a face is placed in work with visible results. Loyalty is strong and slow to give. What it is advised to watch is the pace at which it decides: once this face commits it rarely reconsiders, so the counsel is to spend longer at the beginning than at the end.", bn: "কপালের তুলনায় চওড়া চোয়াল বাস্তববাদী কর্মক্ষমতা ও শারীরিক শক্তির প্রতীক। কথার চেয়ে কর্মের মাধ্যমে ফলাফল প্রমাণ করতে আপনি বেশি ভালোবাসেন। বন্ধুদের প্রতি আপনার আনুগত্য অত্যন্ত দৃঢ় ও অবিচল।", hi: "माथे की तुलना में चौड़ा जबड़ा व्यावहारिक शक्ति और कर्मठता का प्रतीक है। आप बातों से ज्यादा काम पर विश्वास करते हैं। आपकी निष्ठा और वफादारी अटूट होती है।" },
  },
  "face_shape:oval": {
    label: { en: "Oval face", bn: "ডিম্বাকৃতি মুখ", hi: "अंडाकार चेहरा" },
    meaning: { en: "Balanced proportions, with the face longer than it is wide and no single region dominating, are treated in the tradition as the settled form \u2014 the one other shapes are described against. It is read as adaptability: comfortable in different rooms, able to take a position without needing to hold it forever. Such a face is associated with diplomacy and with being underestimated early and reassessed later. Its own difficulty is diffuseness \u2014 being reasonable about everything can postpone choosing anything, and the tradition asks it to commit sooner.", bn: "অনুপাতযুক্ত নিখুঁত ডিম্বাকৃতি মুখকে শাস্ত্রে ভারসাম্যপূর্ণ ও আদর্শ রূপ হিসেবে গণ্য করা হয়। আপনি যেকোনো পরিবেশে নিজেকে সহজে মানিয়ে নিতে পারেন এবং সংঘাত এড়িয়ে পরিস্থিতি নিয়ন্ত্রণে পারদর্শী।", hi: "संतुलित अनुपात वाला अंडाकार चेहरा आदर्श और सामंजस्यपूर्ण माना जाता है। आप किसी भी माहौल में खुद को आसानी से ढाल लेते हैं और कूटनीतिक रूप से समस्याओं को सुलझाने में माहिर होते हैं।" },
  },
  "forehead:broad_high": {
    label: { en: "Broad and high forehead", bn: "উন্মুক্ত ও উচ্চ কপাল", hi: "विशाल और ऊंचा माथा" },
    meaning: { en: "Height and width together make the forehead the most prominent region of the face, and the tradition treats it as the seat of reasoning. Read together they suggest a wide span of interest held with real capacity \u2014 the kind of mind that takes in a whole problem before working on any part of it. Teaching, planning and advisory work are the classical placements. The caution is staying at the level of ideas: this forehead is said to think a matter through so thoroughly that it never quite begins it.", bn: "কপালের উচ্চতা ও প্রশস্ততা প্রখর বিচারবুদ্ধি ও প্রজ্ঞার আসন নির্দেশ করে। আপনি যেকোনো জটিল সমস্যার সামগ্রিক রূপ গভীরভাবে বুঝতে সক্ষম। শিক্ষকতা, উপদেষ্টা বা নেতৃত্বমূলক কাজে অসাধারণ সাফল্য লাভ করেন।", hi: "माथे की ऊंचाई और चौड़ाई प्रखर बुद्धि और दूरदर्शिता का प्रतीक है। आप किसी भी समस्या की तह तक पहुंचकर उसका समाधान निकालने में सक्षम हैं। अध्यापन, परामर्श और नेतृत्व में विशेष सफलता मिलती है।" },
  },
  "forehead:high": {
    label: { en: "High forehead", bn: "উচ্চ কপাল", hi: "ऊंचा माथा" },
    meaning: { en: "A tall forehead is associated with reflection and with learning that continues past the age most people stop. The reading is of someone who wants to understand the reason behind an instruction before following it, and who is uneasy with being told rather than shown. Independent and analytical work suits it. What the tradition asks of this forehead is patience with people who reach conclusions differently \u2014 quickly, or by feel \u2014 since dismissing them is the habit it falls into most easily.", bn: "উচ্চ কপাল গভীর অন্তর্দৃষ্টি, উচ্চ নৈতিক আদর্শ এবং আদর্শবাদী মানসিকতা প্রকাশ করে। নীতি ও সততা বজায় রেখে কাজ করতে আপনি স্বাচ্ছন্দ্য বোধ করেন।", hi: "ऊंचा माथा गहन अंतर्दृष्टि, उच्च नैतिक आदर्शों और सिद्धांतों पर चलने वाली सोच को दर्शाता है।" },
  },
  "forehead:low": {
    label: { en: "Low forehead", bn: "ছোট কপাল", hi: "छोटा माथा" },
    meaning: { en: "A short forehead is read not as less capacity but as a different route to it: conclusions arrive quickly and by instinct rather than by working through steps. The association is with decisiveness and with being effective under pressure, where waiting costs more than being slightly wrong. Practical, immediate work suits it. The tradition's caution is proportionate \u2014 speed that serves you in a crisis is the same speed that commits you to things on an ordinary afternoon.", bn: "তাত্ত্বিক জটিলতার চেয়ে বাস্তবিক কর্মের প্রতি আপনার আগ্রহ বেশি। সুযোগ এলে আপনি কালবিলম্ব না করে সরাসরি পদক্ষেপ নিতে পছন্দ করেন।", hi: "सैद्धांतिक बहसों की तुलना में आपका रुझान प्रत्यक्ष कर्म की ओर रहता है। आप तत्काल निर्णय लेने और ठोस परिणाम देने में कुशल हैं।" },
  },
  "forehead:wide": {
    label: { en: "Wide forehead", bn: "প্রশস্ত কপাল", hi: "चौड़ा माथा" },
    meaning: { en: "Width across the brow is read as range rather than depth \u2014 an interest in many things at once and an ease in moving between them. Such a face is associated with conversation, with connecting people and ideas that had not met, and with work that would bore someone narrower. The difficulty is finishing: breadth offers a new direction exactly when the current one becomes tedious, and the tradition advises choosing the tedious part on purpose.", bn: "প্রশস্ত কপাল মুক্ত চিন্তাধারা, বহুমুখী কৌতূহল এবং নিত্যনতুন বিষয় দ্রুত আত্মস্থ করার বিশেষ মেধার পরিচায়ক।", hi: "चौड़ा माथा उदार सोच, विविध रुचियों और नई बातें तेजी से सीखने की क्षमता को दर्शाता है।" },
  },
  "forehead:narrow": {
    label: { en: "Narrow forehead", bn: "সংকীর্ণ কপাল", hi: "संकीर्ण माथा" },
    meaning: { en: "A narrow brow concentrates rather than spreads. It is read as focus \u2014 the ability to stay with one matter until it yields, and a corresponding impatience with distraction. Specialist work, craft and anything requiring sustained attention are the classical placements, and the tradition expects such a face to go deeper into one subject than most go into any. Its cost is perspective: absorbed in the detail, it can miss that the surrounding situation has changed.", bn: "সংকীর্ণ কপাল একাগ্র মনোযোগের প্রতীক। আপনি বিক্ষিপ্ত না হয়ে একটি নির্দিষ্ট লক্ষ্য স্থির করে গভীর নিষ্ঠা দিয়ে তা অর্জন করতে পারেন।", hi: "संकीर्ण माथा एकाग्रता का प्रतीक है। आप ध्यान भटकाए बिना किसी एक लक्ष्य पर पूरी शक्ति से जुट जाते हैं।" },
  },
  "forehead:balanced": {
    label: { en: "Even forehead", bn: "ভারসাম্যপূর্ণ কপাল", hi: "संतुलित माथा" },
    meaning: { en: "A forehead in proportion with the rest of the face is read as thought and action kept in balance \u2014 neither deliberating past the moment for acting nor moving before the matter is understood. The tradition treats this as the practical ideal rather than a remarkable sign, associating it with steady judgement and with being trusted to decide on others' behalf. It asks only that the balance be used: an evenness that never commits to a view is indistinguishable from having none.", bn: "আদর্শ পরিমাপের কপাল যুক্তি ও অনুভূতির অপূর্ব সামঞ্জস্য বহন করে। যেকোনো জটিল পরিস্থিতিতে স্থির থেকে সঠিক সিদ্ধান্ত নেওয়ার গুণ আপনার রয়েছে।", hi: "संतुलित माथा बुद्धि और भावना का सुंदर संतुलन दर्शाता है। आप किसी भी परिस्थिति में शांत रहकर संतुलित निर्णय लेते हैं।" },
  },
  "eyebrows:thick": {
    label: { en: "Thick eyebrows", bn: "ঘন ভ্রু", hi: "घनी भौंहें" },
    meaning: { en: "Heavy brows are read as vitality that is visible before you speak. The tradition associates them with physical confidence, a strong will and opinions arrived at early and held firmly. People tend to assume such a face is in charge, which becomes true by repetition. The caution is force applied where persuasion would have done: this brow is said to win arguments it would have been better to lose, and is advised to let smaller points go.", bn: "ঘন ভ্রু প্রবল জীবনীশক্তি, অদম্য আত্মবিশ্বাস ও বলিষ্ঠ চরিত্রের বহিঃপ্রকাশ। কোনো বাধাই আপনাকে সহজে নিরুৎসাহিত করতে পারে না।", hi: "घनी भौंहें असीम जीवन ऊर्जा, प्रबल आत्मविश्वास और दृढ़ चरित्र का प्रतीक हैं। कोई भी बाधा आपको आसानी से डिगा नहीं सकती।" },
  },
  "eyebrows:thin": {
    label: { en: "Thin eyebrows", bn: "পাতলা ভ্রু", hi: "पतली भौंहें" },
    meaning: { en: "Fine brows are associated with sensitivity of perception \u2014 noticing mood, tone and the thing not said. The reading is of someone who reads a room accurately and adjusts, which makes them easy company and effective where tact matters more than force. The difficulty is that the same receptiveness takes on others' moods as if they were its own, and the tradition advises deliberate distance from people who are consistently heavy going.", bn: "পাতলা ভ্রু সূক্ষ্ম রুচিশীলতা, মার্জিত সংবেদনশীলতা ও শান্ত আচরণের লক্ষণ। কোলাহল এড়িয়ে শান্তিপূর্ণ পরিবেশ আপনার পছন্দ।", hi: "पतली भौंहें सौम्य स्वभाव, परिष्कृत रुचि और संवेदनशील मन का संकेत हैं। आप शांत और सौहार्दपूर्ण वातावरण पसंद करते हैं।" },
  },
  "eyebrows:arched": {
    label: { en: "Arched eyebrows", bn: "ধনুকাকৃতি ভ্রু", hi: "धनुषाकार भौंहें" },
    meaning: { en: "A pronounced arch is read as expressiveness \u2014 a face that shows interest and doubt before its owner decides to show them. The association is with curiosity, a feel for drama and ease in front of people; such faces are placed in performance, teaching and selling. The tradition's caution concerns reaction: an arch responds faster than judgement does, and what it reveals cannot be taken back.", bn: "উঁচু ধনুকাকৃতি ভ্রু আকর্ষণীয় সামাজিক ব্যক্তিত্ব ও মানুষকে নিজের প্রতি আকৃষ্ট করার স্বাভাবিক মোহনীয়তা নির্দেশ করে।", hi: "धनुषाकार भौंहें आकर्षक व्यक्तित्व और लोगों को अपनी ओर आकर्षित करने की स्वाभाविक सम्मोहन शक्ति का प्रतीक हैं।" },
  },
  "eyebrows:straight": {
    label: { en: "Straight eyebrows", bn: "সোজা ভ্রু", hi: "सीधी भौंहें" },
    meaning: { en: "Brows with little curve are read as a direct, unornamented manner. The tradition associates them with logic, plain speech and a dislike of theatre \u2014 you say what you mean and expect the same, which makes you restful to deal with and occasionally blunt. Technical and analytical work suits this brow. Its cost is warmth that does not reach the surface: the feeling is present but unshown, and the counsel is to say it rather than assume it is obvious.", bn: "সোজা অনুভূমিক ভ্রু বাস্তবমুখী দৃষ্টিভঙ্গি ও সোজাসাপ্টা বক্তব্যের প্রতীক। আবেগ দ্বারা চালিত না হয়ে আপনি তথ্যের ভিত্তিতে কাজ করেন।", hi: "सीधी भौंहें व्यावहारिक दृष्टिकोण और स्पष्टवादिता का संकेत हैं। आप भावनाओं के बजाय तथ्यों के आधार पर निर्णय लेते हैं।" },
  },
  "eyebrows:joined": {
    label: { en: "Close-set eyebrows", bn: "সংযুক্ত ভ্রু", hi: "जुड़ी हुई भौंहें" },
    meaning: { en: "Brows set close together, with little space above the nose, are read as concentration \u2014 attention that settles on one thing and stays. The tradition gives this brow intensity and a long memory, for obligations and for slights alike. It is associated with persistence that outlasts opposition. What it is advised to watch is the gap between taking something seriously and taking it personally, which this face crosses without noticing.", bn: "দুই ভ্রুর সংযোগস্থল কাছাকাছি থাকা তীব্র মানসিক সক্রিয়তা ও গভীর আবেগের পরিচায়ক। মনের শক্তিকে সঠিক কাজে ব্যবহার করলে অভাবনীয় উন্নতি লাভ হয়।", hi: "समीपस्थ या आपस में जुड़ी भौंहें मानसिक तीव्रता और गहरी ऊर्जा का प्रतीक हैं। यदि इस ऊर्जा को सही दिशा दी जाए तो महान कार्य सिद्ध होते हैं।" },
  },
  "eyebrows:long": {
    label: { en: "Long eyebrows", bn: "লম্বা ভ্রু", hi: "लंबी भौंहें" },
    meaning: { en: "Brows extending well past the eye are traditionally a friendly sign, associated with wide and lasting connection. The reading is of someone who keeps relationships in repair over years, is asked for help often, and benefits later from people they were kind to early. The caution is dilution: a circle this wide is expensive to maintain, and the tradition advises keeping the few that matter rather than all of them equally.", bn: "চোখের সীমানা ছাড়িয়ে যাওয়া দীর্ঘ ভ্রু অটুট পারিবারিক বন্ধন, ধৈর্যশীলতা ও দীর্ঘস্থায়ী সম্পর্কের প্রতীক।", hi: "लंबी भौंहें मजबूत पारिवारिक संबंध, धैर्य और लंबे समय तक चलने वाली मित्रता की सूचक हैं।" },
  },
  "eyebrows:short": {
    label: { en: "Short eyebrows", bn: "ছোট ভ্রু", hi: "छोटी भौंहें" },
    meaning: { en: "Brows stopping short of the eye's end are read as self-sufficiency. The association is with independence, a small and closely held circle, and a preference for getting on with things rather than organising others to help. Such a face is trusted with what it is given. The tradition's advice is specific: ask earlier than feels comfortable, because this face is inclined to carry alone what it need not.", bn: "ছোট ভ্রু দ্রুত কাজ সম্পন্ন করার মানসিকতা ও স্বাবলম্বিতার পরিচায়ক। আপনি নিজের প্রচেষ্টায় কাজ গুছিয়ে নিতে পছন্দ করেন।", hi: "छोटी भौंहें त्वरित निर्णय लेने और आत्मनिर्भरता का संकेत हैं। आप अपने दम पर काम पूरा करने में विश्वास रखते हैं।" },
  },
  "eyebrows:balanced": {
    label: { en: "Even eyebrows", bn: "ভারসাম্যপূর্ণ ভ্রু", hi: "संतुलित भौंहें" },
    meaning: { en: "Brows in proportion to the eyes, neither heavy nor sparse and gently curved, are read as a temperament that neither forces nor withdraws. The tradition treats this as steadiness: able to assert when it matters, content not to when it does not. It is associated with being easy to work alongside over long periods. Its only noted risk is being overlooked in rooms where louder faces are competing.", bn: "পরিমিত ঘন ও নিখুঁত দৈর্ঘ্যের ভ্রু মানসিক স্থিতিশীলতা ও শান্ত বিবেচনাবোধ নির্দেশ করে।", hi: "संतुलित भौंहें मानसिक स्थिरता, आंतरिक संतुलन और संयमित व्यवहार का प्रतीक हैं।" },
  },
  "eyes:large": {
    label: { en: "Large, open eyes", bn: "ডাগর ও উন্মুক্ত চোখ", hi: "बड़ी और खुली आंखें" },
    meaning: { en: "Wide, open eyes are read throughout the tradition as openness of nature \u2014 feeling that reaches the surface and is not hidden well. The association is with warmth, expressiveness and being trusted quickly, because what you think is visible before you say it. Such faces are placed where people must be put at ease. The caution is exposure: openness invites those who will use it, and the counsel is to be slower with new people than instinct wants.", bn: "উন্মুক্ত বড় চোখ স্পষ্টবাদিতা, হৃদয়গ্রাহী আন্তরিকতা ও অনুভূতিশীল মনের নির্দেশক। আপনি কাউকে প্রতারিত করতে পারেন না এবং দ্রুত মানুষের ভালোবাসা লাভ করেন।", hi: "बड़ी और खुली आंखें निष्कपटता, गहरी संवेदनशीलता और स्पष्ट हृदय का प्रतीक हैं। लोग आपसे जल्दी प्रभावित और आकर्षित होते हैं।" },
  },
  "eyes:narrow": {
    label: { en: "Narrow eyes", bn: "সংকীর্ণ চোখ", hi: "संकीर्ण आंखें" },
    meaning: { en: "Narrow eyes are read as discernment \u2014 a gaze that assesses before it accepts. The tradition associates them with concentration, composure under pressure and a reluctance to show a hand early, which is an advantage in negotiation and in any work where judgement matters more than reaction. The cost is being read as distant before you have decided anything, and the advice is to say warmth aloud, since this face does not display it.", bn: "সংকীর্ণ চোখ তীক্ষ্ণ পর্যবেক্ষণ ক্ষমতা ও সতর্কতার পরিচায়ক। বাইরের মানুষের কাছে সহজে নিজের পরিকল্পনা প্রকাশ না করে নিভৃতে কাজ সম্পন্ন করতে ভালোবাসেন।", hi: "संकीर्ण आंखें गहरी अवलोकन क्षमता और गोपनीयता की प्रतीक हैं। आप अपनी योजनाओं को गुप्त रखकर योजनाबद्ध तरीके से काम करते हैं।" },
  },
  "eyes:close_set": {
    label: { en: "Close-set eyes", bn: "কাছাকাছি চোখ", hi: "समीपस्थ आंखें" },
    meaning: { en: "Eyes set near together are associated with focus and precision \u2014 attention that narrows onto a single matter and holds it. The reading is of someone who notices detail others step past and who is uncomfortable leaving a thing half-understood. Specialist work rewards this. The tradition's caution is proportion: absorbed closely, this face can treat a small problem with the seriousness a large one deserved.", bn: "দুই চোখের মাঝের দূরত্ব কম হওয়া খুঁটিনাটি বিষয় নিখুঁতভাবে খেয়াল রাখার বিরল দক্ষতার নির্দেশক। গবেষণামূলক কাজে আপনার মনোযোগ অসাধারণ।", hi: "पास-पास स्थित आंखें बारीकियों को पकड़ने की अद्भुत क्षमता दर्शाती हैं। तकनीकी और अनुसंधान कार्यों में आपका प्रदर्शन बेजोड़ होता है।" },
  },
  "eyes:wide_set": {
    label: { en: "Wide-set eyes", bn: "প্রশস্ত চোখ", hi: "दूर स्थित आंखें" },
    meaning: { en: "Eyes set well apart are read as breadth of view \u2014 taking in the whole situation rather than its parts, and being slow to panic because the panic-worthy detail is seen in context. The association is with tolerance, perspective and an unhurried manner. What it is advised to guard is follow-through on detail: seeing the shape of a thing is not the same as having done it, and this face sometimes mistakes one for the other.", bn: "প্রশস্ত দূরত্বে অবস্থিত চোখ উদার দৃষ্টিভঙ্গি, মুক্তমনা চিন্তা ও ভবিষ্যতের সুদূরপ্রসারী ভাবনার পরিচায়ক।", hi: "दूर-दूर स्थित आंखें उदार सोच, व्यापक दृष्टिकोण और दूरदर्शी योजनाओं का प्रतीक हैं।" },
  },
  "eyes:upturned": {
    label: { en: "Upturned eyes", bn: "উর্ধ্বমুখী চোখ", hi: "ऊपर उठी आंखें" },
    meaning: { en: "Outer corners carried above the inner are read as optimism visible at rest \u2014 a face that looks receptive before it has decided to be. The tradition associates this with ambition held lightly, with recovering quickly from setbacks and with drawing opportunity through manner rather than effort. The caution is that a face which always looks willing is asked for more than it intended to give.", bn: "বাইরের কোণ ঈষৎ উর্ধ্বমুখী হওয়া সহজাত আশাবাদ, প্রফুল্লতা ও ইতিবাচক দৃষ্টিভঙ্গির লক্ষণ। আপনি যেকোনো কঠিন পরিস্থিতিতে আলোর দিশা দেখতে পান।", hi: "ऊपर की ओर उठी आंखें आशावादिता, उत्साह और सकारात्मक ऊर्जा की प्रतीक हैं। आप संकट में भी अवसर तलाश लेते हैं।" },
  },
  "eyes:downturned": {
    label: { en: "Downturned eyes", bn: "নিম্নমুখী চোখ", hi: "नीचे झुकी आंखें" },
    meaning: { en: "Outer corners resting below the inner give a gaze the tradition reads as gentle and considering. The association is with empathy, with being told things people do not tell others, and with judging situations more accurately than cheerful faces do. Its difficulty is appearing troubled when nothing is wrong, so that others approach carefully \u2014 and the counsel is simply to be aware the face is saying something the mind is not.", bn: "চোখের কোণ সামান্য নিম্নমুখী হওয়া গভীর সহমর্মিতা ও বাস্তবসম্মত সতর্কতার প্রকাশ। অন্যের দুঃখ-কষ্ট আপনি সহজেই উপলব্ধি করতে পারেন।", hi: "नीचे की ओर झुकी आंखें गहरी सहानुभूति और यथार्थवादी सोच का संकेत हैं। आप दूसरों के सुख-दुख को गहराई से महसूस करते हैं।" },
  },
  "eyes:uneven": {
    label: { en: "Eyes of different sizes", bn: "অসম আকারের চোখ", hi: "असममित आंखें" },
    meaning: { en: "A visible difference between the two eyes is treated in the tradition as a sign of two natures held in one person \u2014 a public manner and a private one that do not always agree. The reading is of adaptability and of seeing both sides genuinely, which makes such a face a good mediator. What it is asked to watch is deciding: holding both views indefinitely is comfortable, and postpones the moment of choosing.", bn: "দুই চোখের আকারে সামান্য বৈচিত্র্য জীবনে বহুমুখী দৃষ্টিকোণ থেকে চিন্তা করার অনন্য সৃজনশীল শক্তির পরিচায়ক।", hi: "आंखों के आकार में भिन्नता बहुआयामी दृष्टिकोण और जीवन को विभिन्न पहलुओं से देखने की रचनात्मक क्षमता को दर्शाती है।" },
  },
  "eyes:balanced": {
    label: { en: "Even eyes", bn: "ভারসাম্যপূর্ণ চোখ", hi: "संतुलित आंखें" },
    meaning: { en: "Eyes in proportion to the face, evenly set and evenly open, are read as emotional steadiness \u2014 feeling that is neither hidden nor worn openly. The tradition associates this with reliability and with being believed, since nothing about the gaze works against what is said. It is the arrangement other eye signs are measured against, and carries no particular warning beyond being unremarkable at first meeting.", bn: "সমানুপাতিক ও স্থিতিশীল চোখ নির্ভরযোগ্য চরিত্র, একাগ্র দৃষ্টি ও সৎ ব্যক্তিত্বের পরিচয় দেয়।", hi: "संतुलित और स्थिर आंखें भरोसेमंद चरित्र, शांत आत्मविश्वास और सच्चाई का प्रतीक हैं।" },
  },
  "nose:long_straight": {
    label: { en: "Long, straight nose", bn: "লম্বা ও সোজা নাক", hi: "लंबी और सीधी नाक" },
    meaning: { en: "The nose is the tradition's wealth sign, and a long straight one is its most favourable form. It is read as money handled with method rather than luck: earning steadily, spending deliberately and building over years instead of chasing a sudden gain. The association is with discipline, long-range planning and being trusted with other people's resources. The caution is rigidity about money \u2014 a plan that survives every circumstance was not a plan but a habit.", bn: "লম্বা ও সোজা নাসিকা রেখা আত্মমর্যাদাবোধ, আর্থিক বিচক্ষণতা এবং দীর্ঘমেয়াদী উন্নতি অর্জনের শক্তিশালী লক্ষণ।", hi: "लंबी और सीधी नाक स्वाभिमान, वित्तीय कुशलता और निरंतर उन्नति करने की क्षमता का प्रतीक है।" },
  },
  "nose:long": {
    label: { en: "Long nose", bn: "লম্বা নাক", hi: "लंबी नाक" },
    meaning: { en: "Length in the nose is read as patience with money and with work. The association is with slow accumulation, a long view and a distaste for shortcuts; such a face is expected to do better at forty than at twenty-five and to mind that less than most. Professional and advisory work suits it. Its difficulty is acting late: an opportunity examined thoroughly enough is sometimes an opportunity that has gone.", bn: "লম্বা নাক সুপরিকল্পিত কর্মপদ্ধতি, দায়িত্ববোধ ও ভবিষ্যত দূরদৃষ্টির প্রতীক। হঠকারী সিদ্ধান্ত এড়িয়ে ভেবেচিন্তে পথ চলতে আপনি পছন্দ করেন।", hi: "लंबी नाक रणनीतिक सोच, उच्च जिम्मेदारी और दूरदर्शिता का संकेत है। आप जल्दबाजी में निर्णय नहीं लेते।" },
  },
  "nose:short": {
    label: { en: "Short nose", bn: "ছোট নাক", hi: "छोटी नाक" },
    meaning: { en: "A short nose is associated with immediacy rather than accumulation \u2014 money that comes from quick movement, present opportunity and the willingness to begin before the picture is complete. The tradition places such faces in trade and in work paid by result. Flexibility is the strength. The caution is the obvious one: income that arrives easily leaves the same way, and the counsel is to put a fixed share aside before it is spent.", bn: "ছোট নাক উদ্যমী স্বভাব, তাৎক্ষণিক প্রতিক্রিয়া ও ঝামেলাহীন সোজা পথে কাজ করার সহজ মানসিকতা নির্দেশ করে।", hi: "छोटी नाक ऊर्जावान स्वभाव, तुरंत प्रतिक्रिया और सरलता से काम निपटाने की आदत का प्रतीक है।" },
  },
  "nose:broad": {
    label: { en: "Broad nose", bn: "প্রশস্ত নাক", hi: "चौड़ी नाक" },
    meaning: { en: "Width in the nose is read as generosity and reach. The association is with earning through people \u2014 partnership, trade, anything where goodwill returns later as opportunity \u2014 and with an open hand that the tradition counts as a cause of wealth rather than a drain on it. Leadership of teams suits this face. The caution is lending on sympathy rather than judgement, which this nose is said to do repeatedly with the same people.", bn: "প্রশস্ত নাক সামাজিক প্রভাব, উদার মানসিকতা এবং পার্থিব সমৃদ্ধি অর্জনের শুভ লক্ষণ নির্দেশ করে।", hi: "चौड़ी नाक सामाजिक प्रतिष्ठा, खुले दिल से मदद करने का स्वभाव और भौतिक समृद्धि का प्रतीक है।" },
  },
  "nose:narrow": {
    label: { en: "Narrow nose", bn: "তীক্ষ্ণ ও সংকীর্ণ নাক", hi: "संकीर्ण नाक" },
    meaning: { en: "A narrow nose is read as care with resources \u2014 precise about what is spent and on what, and uncomfortable with waste in any form. The association is with refinement, quality over quantity, and work requiring exactness. Little is lost through carelessness. What the tradition warns of is holding too tightly: an opportunity that required spending was still an opportunity, and this face declines some it should have taken.", bn: "সংকীর্ণ ও সূক্ষ্ম নাক নিজস্ব নিয়মানুবর্তিতা, মার্জিত রুচি ও স্বাধীনচেতা মনোভাবের পরিচায়ক।", hi: "संकीर्ण नाक व्यक्तिगत स्वतंत्रता, परिष्कार और अपने उसूलों पर अडिग रहने का संकेत है।" },
  },
  "nose:large_nostrils": {
    label: { en: "Open nostrils", bn: "উন্মুক্ত নাসারন্ধ্র", hi: "खुले नथुने" },
    meaning: { en: "Visibly open nostrils are read as money that moves freely \u2014 earned readily and spent readily, with comfort in both directions. The association is with enjoyment of what is earned, a confident manner about money and a reluctance to let caution become the point of living. The tradition's counsel is structural rather than moral: set aside a share automatically, because deciding to save is not a decision this face makes in the moment.", bn: "উন্মুক্ত নাসারন্ধ্র মুক্তহস্তে খরচ করার প্রবৃত্তি, প্রাণোচ্ছ্বল স্বভাব ও জীবনে বড় ঝুঁকি নেওয়ার সাহসিকতার প্রতীক।", hi: "खुले नथुने उदारता, निडरता और जीवन में बड़े जोखिम उठाने के साहसी स्वभाव को दर्शाते हैं।" },
  },
  "nose:small_nostrils": {
    label: { en: "Tight nostrils", bn: "সংকুচিত নাসারন্ধ্র", hi: "छोटे नथुने" },
    meaning: { en: "Narrow nostrils are read as retention \u2014 money that is kept once it arrives. The association is with prudence, planning for difficulty before it comes, and reaching security earlier than peers. Such a face rarely faces a crisis unprepared. The warning attached is pleasure deferred so long it is forgotten about: the tradition specifically advises spending some of it, deliberately, while it can still be enjoyed.", bn: "সংকুচিত নাসারন্ধ্র সঞ্চয়ী মনোভাব, আর্থিক নিরাপত্তা রক্ষার প্রবৃত্তি ও হিসেবী জীবনের শুভ নির্দেশক।", hi: "छोटे नथुने मितव्ययी सोच, धन संचय करने की आदत और सुरक्षित भविष्य की योजना का संकेत हैं।" },
  },
  "nose:deviated": {
    label: { en: "Uneven nose line", bn: "বাঁকা নাসিকা রেখা", hi: "टेढ़ी नाक की रेखा" },
    meaning: { en: "A nose whose line departs from the face's midline is read as fortune that arrives irregularly rather than steadily. The tradition does not treat this as misfortune but as rhythm: good periods and thin ones alternating, with the person often better at the thin ones than steadier faces are. Resourcefulness is the associated strength. The counsel is to budget against the average rather than the good months.", bn: "প্রথাগত গণ্ডির বাইরে গিয়ে নিজস্ব স্বতন্ত্র উপায়ে সাফল্য অর্জনের তীব্র আকাঙ্ক্ষার লক্ষণ।", hi: "लीक से हटकर अपने अनोखे अंदाज में सफलता हासिल करने की गहरी इच्छा का प्रतीक।" },
  },
  "nose:balanced": {
    label: { en: "Even nose", bn: "ভারসাম্যপূর্ণ নাক", hi: "संतुलित नाक" },
    meaning: { en: "A nose proportionate to the face in both width and length is read as a balanced relationship with money \u2014 neither anxious nor careless, able to spend and to keep. The tradition treats this as the stable form against which the others are described, associating it with steady means arrived at without drama. It carries no specific warning, which in this tradition is itself the point.", bn: "উত্তম পরিমাপের নাক জীবনে সমৃদ্ধি ও সুনামের সমানুপাতিক শুভ স্থায়িত্ব বহন করে।", hi: "सुडौल और संतुलित नाक जीवन में सम्मान, समृद्धि और स्थिरता का प्रतीक है।" },
  },
  "lips:full": {
    label: { en: "Full lips", bn: "ভরাট ঠোঁট", hi: "भरे हुए होंठ" },
    meaning: { en: "Full lips are read as warmth that is given rather than withheld. The association is with generosity in affection, ease in speaking to strangers and a nature that enjoys company and food and comfort without apology. Such faces are placed where persuasion and hospitality matter. The caution concerns saying yes: this mouth agrees in the moment and discovers the cost afterwards, and is advised to leave a pause before answering.", bn: "ভরাট ও পুরু ঠোঁট আন্তরিক স্নেহ, প্রেমময় হৃদয় ও জীবনের প্রতিটি মুহূর্তকে আনন্দ সহকারে উপভোগ করার অনুরাগের পরিচায়ক।", hi: "भरे हुए होंठ स्नेह, गहरी संवेदना और जीवन के सुखों का खुलकर आनंद लेने वाले स्वभाव के सूचक हैं।" },
  },
  "lips:thin": {
    label: { en: "Thin lips", bn: "পাতলা ঠোঁট", hi: "पतले होंठ" },
    meaning: { en: "Thin lips are read as economy of speech \u2014 saying what is needed and stopping. The tradition associates them with discretion, self-control and keeping confidences, which makes such a face trusted with what others cannot hold. Precision in work follows the same pattern. The cost is affection assumed rather than expressed: those close by are left to infer it, and the counsel is to state it plainly rather than rely on being understood.", bn: "পাতলা ঠোঁট আত্মনিয়ন্ত্রণ, পরিমিত কথা ও কর্মে মনোযোগ দেওয়ার মানসিকতা প্রকাশ করে। অহেতুক বাক্যব্যয় আপনার অপছন্দ।", hi: "पतले होंठ आत्म-नियंत्रण, नपा-तुला बोलना और शब्दों से ज्यादा कर्म को प्राथमिकता देने का संकेत हैं।" },
  },
  "lips:upturned": {
    label: { en: "Upturned mouth", bn: "উর্ধ্বমুখী ঠোঁট (হাসিমুখ)", hi: "ऊपर उठे होंठ (मुस्कान)" },
    meaning: { en: "Corners that rest above the centre of the mouth give a face that appears willing before it speaks. The tradition reads this as optimism and as good fortune through manner \u2014 people approach such a face first, and opportunity follows from being approached. Resilience after setbacks is part of the same sign. The caution is being thought untroubled when you are not, so that help is never offered because it never looked needed.", bn: "মুখের কোণ উপরের দিকে থাকা প্রফুল্ল হৃদয়, অমায়িক সৌহার্দ্য ও সবাইকে আশ্বস্ত করার স্বাভাবিক গুণের প্রতীক। আপনার সান্নিধ্যে সবাই স্বস্তি অনুভব করে।", hi: "ऊपर उठे होंठ प्रसन्नचित्त स्वभाव, मधुर वाणी और आशावादी दृष्टिकोण का प्रतीक हैं। लोग आपकी संगति में खुश रहते हैं।" },
  },
  "lips:downturned": {
    label: { en: "Downturned mouth", bn: "নিম্নমুখী ঠোঁট", hi: "नीचे झुके होंठ" },
    meaning: { en: "Corners resting below the mouth's centre are read as seriousness rather than unhappiness \u2014 a face that does not perform a mood it is not in. The association is with sincerity, with being believed when pleased because the pleasure is real, and with judging situations soberly. Its difficulty is first impressions: strangers read discouragement where there is only composure, and the counsel is to greet people more warmly than feels necessary.", bn: "মুখের কোণ সামান্য নিম্নমুখী হওয়া গভীর গাম্ভীর্য, একাগ্র সততা ও মেকি আচরণের প্রতি অনীহার পরিচায়ক। আপনি সবসময় সত্যের পক্ষে কথা বলেন।", hi: "नीचे की ओर झुके होंठ गंभीर स्वभाव, अटूट निष्पक्षता और दिखावे से दूर रहने की प्रवृत्ति को दर्शाते हैं।" },
  },
  "lips:uneven": {
    label: { en: "Uneven lips", bn: "অসম ঠোঁট", hi: "असममित होंठ" },
    meaning: { en: "A mouth that sits differently on each side is read as wit and independence of mind \u2014 the face of someone who finds the angle others miss and says it. The tradition associates it with humour, with persuasion that works by surprise rather than pressure, and with resisting being told what to think. The caution is timing: the remark that is funny among friends is costly in front of people who do not know you.", bn: "ঠোঁটের গড়নে বৈচিত্র্য আকর্ষণীয় প্রকাশভঙ্গি ও বাকপটুতার পরিচায়ক। যুক্তি দিয়ে অপরকে বোঝাতে আপনি অত্যন্ত দক্ষ।", hi: "होंठों की बनावट में विविधता वाकपटुता, चतुराई और संवाद कला में निपुणता का प्रतीक है।" },
  },
  "lips:balanced": {
    label: { en: "Even lips", bn: "ভারসাম্যপূর্ণ ঠোঁট", hi: "संतुलित होंठ" },
    meaning: { en: "Lips in proportion to the face, evenly set and level, are read as measured speech and steady affection \u2014 neither effusive nor withholding. The tradition associates this with being easy to be close to over long periods, and with saying difficult things without damage. It is the settled form, and carries no warning beyond being less immediately striking than the others.", bn: "পরিমিত ও সমান ঠোঁট নির্ভরযোগ্য বন্ধু, মধুর ব্যক্তিত্ব ও সম্পর্কের মর্যাদা রক্ষার শুভ প্রতীক।", hi: "संतुलित होंठ सच्चे मित्र, मीठी बोली और रिश्तों की गरिमा बनाए रखने का प्रतीक हैं।" },
  },
  "chin:square": {
    label: { en: "Square jaw", bn: "চৌকা চোয়াল", hi: "चौकोर जबड़ा" },
    meaning: { en: "A broad, defined jaw is the tradition's clearest mark of resolve. It is read as the capacity to hold a position under pressure and to finish what was begun after the interest has gone. Such a face is given responsibility early and keeps it. The associated difficulty is yielding: this jaw treats changing its mind as losing, and the counsel is to separate the two deliberately, since the strength is wasted defending positions that no longer matter.", bn: "দৃঢ় চৌকা চোয়াল ইস্পাতকঠিন ইচ্ছাশক্তি ও শত প্রতিকূলতার মুখেও লক্ষ্য থেকে বিচ্যুত না হওয়ার অমর লক্ষণ।", hi: "मजबूत चौकोर जबड़ा अटूट इच्छाशक्ति और कठिन परिस्थितियों में भी डटे रहने की अपार शक्ति का प्रतीक है।" },
  },
  "chin:pointed": {
    label: { en: "Pointed chin", bn: "তীক্ষ্ণ চিবুক", hi: "नुकीली ठोड़ी" },
    meaning: { en: "A fine, tapering chin is read as refinement rather than force \u2014 achieving by precision, charm and timing what a heavier jaw achieves by pressure. The association is with artistic and intellectual work, quick perception and an unwillingness to win crudely. The tradition's caution concerns endurance: this chin is said to withdraw from a long contest it could have won, and is advised to stay in them longer.", bn: "তীক্ষ্ণ চিবুক ক্ষুরধার বুদ্ধি, দ্রুত চিন্তাশক্তি এবং নতুন নতুন ভাবনা বাস্তবায়নের তৎপরতা নির্দেশ করে।", hi: "नुकीली ठोड़ी कुशाग्र बुद्धि, तेज सोच और नई संभावनाओं को तुरंत पकड़ने की क्षमता की प्रतीक है।" },
  },
  "chin:round": {
    label: { en: "Rounded chin", bn: "গোলাকার চিবুক", hi: "गोल ठोड़ी" },
    meaning: { en: "A full, rounded chin is read as good nature with staying power underneath \u2014 accommodating by preference but not weak, and capable of settling in when something matters. The association is with family loyalty, hospitality and being the person a group organises itself around. Its difficulty is saying no early: this chin agrees first and resents later, and the tradition advises refusing at the outset rather than withdrawing afterwards.", bn: "কোমল গোলাকার চিবুক ক্ষমাশীল স্বভাব, পারিবারিক শান্তি ও অন্যদের ভালোবেসে কাছে টেনে নেওয়ার পরিচায়ক।", hi: "गोल ठोड़ी दयालु स्वभाव, क्षमाशीलता और अपनों को साथ लेकर चलने की प्रवृत्ति का संकेत है।" },
  },
  "chin:receding": {
    label: { en: "Receding chin", bn: "পশ্চাৎপদ চিবুক", hi: "पीछे की ओर ठोड़ी" },
    meaning: { en: "A chin that sits back from the face's line is read as a nature that prefers accommodation to confrontation. The tradition gives it sensitivity, adaptability and skill at working around obstacles rather than through them \u2014 useful where force would only harden a situation. What it is advised to practise is the direct statement: this face is heard less than it should be, not for lack of a view but for not pressing it.", bn: "নমনীয় স্বভাব, সরাসরি বিবাদে না জড়িয়ে কৌশলে ও বুদ্ধিমত্তার সাথে প্রতিকূল পরিস্থিতি উত্তরণের স্বভাব।", hi: "लचीला स्वभाव, टकराव से बचकर समझदारी व कूटनीति से कार्य सिद्ध करने की कला का प्रतीक।" },
  },
  "chin:balanced": {
    label: { en: "Even chin", bn: "ভারসাম্যপূর্ণ চিবুক", hi: "संतुलित ठोड़ी" },
    meaning: { en: "A chin in proportion to the face is read as resolve held in reserve \u2014 able to insist when it matters without needing to insist generally. The tradition associates this with even-handedness and with being trusted to arbitrate, since neither stubbornness nor retreat is the first instinct. It is the settled form and carries no specific warning.", bn: "পরিমিত চিবুক ধৈর্য ও আত্মবিশ্বাসের অপূর্ব সংমিশ্রণ। আপনি স্থির মনে জীবনকে এগিয়ে নিয়ে যান।", hi: "संतुलित ठोड़ी धैर्य, आत्मविश्वास और स्थिरता का प्रतीक है।" },
  },
  "cheeks:high": {
    label: { en: "High cheekbones", bn: "উন্নত গণ্ডাস্থি", hi: "उभरी हुई गाल की हड्डियां" },
    meaning: { en: "Cheekbones set high and clearly defined are read as standing \u2014 the quality of being noticed and taken seriously before anything is said. The tradition associates them with ambition, with authority that does not need to be claimed, and with reaching positions of visible responsibility. The caution concerns distance: a face carried this way is approached less often than it realises, and is advised to invite people closer on purpose.", bn: "উন্নত গাল সমাজ ও কর্মক্ষেত্রে প্রভাবশালী উপস্থিতি, কর্তৃত্ব ও মর্যাদা লাভের শক্তিশালী প্রতীক।", hi: "उभरी हुई गाल की हड्डियां समाज में प्रभावशाली व्यक्तित्व, अधिकार और उच्च सम्मान का प्रतीक हैं।" },
  },
  "cheeks:full": {
    label: { en: "Full cheeks", bn: "ভরাট গাল", hi: "भरे हुए गाल" },
    meaning: { en: "Full cheeks are read as vitality and welcome. The tradition associates them with physical robustness, good relations across age and station, and the sort of presence that makes a room easier rather than more formal. Support tends to be available when needed, having been earned without effort. The caution is comfort: this face is said to settle into an agreeable situation and stay past the point where it should have moved.", bn: "ভরাট গাল প্রাচুর্য, উষ্ণ আন্তরিকতা এবং জীবনের আনন্দ সবার সাথে ভাগ করে নেওয়ার শুভ লক্ষণ।", hi: "भरे हुए गाल संपन्नता, गर्मजोशी और दूसरों को खुश रखने के स्वभाव का प्रतीक हैं।" },
  },
  "cheeks:hollow": {
    label: { en: "Lean cheeks", bn: "কৃশকায় গাল", hi: "पतले गाल" },
    meaning: { en: "Lean cheeks are read as intensity and self-containment \u2014 energy directed inward at a purpose rather than outward at company. The association is with discipline, with work pursued past the point others stop, and with indifference to approval that makes such a face effective and occasionally isolated. The tradition's counsel is maintenance: this face neglects rest and company while something is unfinished, and pays for it later.", bn: "রোগা গাল আত্মসংযম, একাগ্র সাধনা ও অপ্রয়োজনীয় বাহুল্য এড়িয়ে চলা কঠোর শৃঙ্খলার নির্দেশক।", hi: "पतले गाल आत्म-संयम, गहरी साधना और फिजूलखर्ची से दूर रहने वाले अनुशासित जीवन का प्रतीक हैं।" },
  },
  "cheeks:balanced": {
    label: { en: "Even cheeks", bn: "ভারসাম্যপূর্ণ গাল", hi: "संतुलित गाल" },
    meaning: { en: "Cheeks in proportion to the rest of the face are read as standing that rests on substance rather than impression \u2014 neither commanding a room nor disappearing in it. The tradition associates this with being judged on what you do, and with reputation that accumulates quietly and holds. It is the settled form, and carries no particular warning.", bn: "পরিমিত গাল আকর্ষণীয় লাবণ্য, শারীরিক ভারসাম্য ও স্থির প্রাণশক্তির পরিচায়ক।", hi: "संतुलित गाल सौम्य आकर्षण, शारीरिक संतुलन और सकारात्मक ऊर्जा का प्रतीक हैं।" },
  },
};

export function translateReadingSection(
  section: { feature: string; feature_label?: string; option: string; label: string; meaning: string; area?: string | null },
  lang: FaceReadingLanguage
): TranslatedSection {
  const key = `${section.feature}:${section.option}`;
  const rule = RULE_TRANSLATIONS[key];

  const featureLabel = FEATURE_NAMES[section.feature]?.[lang] || section.feature_label || section.feature;
  const label = rule?.label?.[lang] || section.label;
  const meaning = rule?.meaning?.[lang] || section.meaning;
  const areaLabel = section.area && AREA_NAMES[section.area]?.[lang] ? AREA_NAMES[section.area][lang] : (section.area || "");

  return {
    featureLabel,
    label,
    meaning,
    areaLabel,
  };
}
