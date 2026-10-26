/**
 * Localization (bn, hi, en) for Palm Reading (হস্তরেখা বিচার / हस्तरेखा विज्ञान).
 * Derived directly from client palmistry documents and Vedic Chiromancy traditions.
 */

export type PalmLanguage = "bn" | "hi" | "en";

export interface PalmTranslations {
  badge: string;
  title: string;
  subtitle: string;
  scanWithCamera: string;
  scanCameraSubtitle: string;
  uploadPhoto: string;
  captureNow: string;
  captureReady: string;
  captureManual: string;
  alignedReady: string;
  handFramingGuide: string;
  stopCamera: string;
  scanningAgain: string;
  scanningText: string;
  coinsCost: string;
  freeCost: string;
  balance: string;
  signInPrompt: string;

  guidanceTitle: string;
  lookingForHand: string;
  holdStill: string;
  handDetected: string;
  leftHand: string;
  rightHand: string;

  rejectedTitle: string;
  notCharged: string;

  resultsTitle: string;
  resultsSubtitle: string;
  handTypeTitle: string;
  creasesTitle: string;
  contrastTooltip: string;
  tracedLabel: string;
  notClearLabel: string;
  endsAtMount: string;
  measuredLabel: string;
  sourceDocLabel: string;
  notAssessedTitle: string;
  notAssessedSubtitle: string;
  scanSpeedFooter: string;

  tabs: {
    overview: string;
    timeline: string;
    sacred_marks: string;
    archetype: string;
    marriage: string;
    loops: string;
    medical: string;
    kundli_sync: string;
    lines: string;
    forecasts: string;
    details: string;
    scan3d: string;
  };

  elements: {
    earth: { title: string; subtitle: string; desc: string };
    air: { title: string; subtitle: string; desc: string };
    fire: { title: string; subtitle: string; desc: string };
    water: { title: string; subtitle: string; desc: string };
  };

  lines: {
    heart: { name: string; element: string; desc: string };
    head: { name: string; element: string; desc: string };
    life: { name: string; element: string; desc: string };
    fate: { name: string; element: string; desc: string };
    sun: { name: string; element: string; desc: string };
    mercury: { name: string; element: string; desc: string };
    mars: { name: string; element: string; desc: string };
  };

  areas: Record<string, string>;
  featureLabels: Record<string, string>;
}

export const PALM_TRANSLATIONS: Record<PalmLanguage, PalmTranslations> = {
  bn: {
    badge: "হস্তরেখা বিচার",
    title: "আপনার হাতের তালু স্ক্যান করুন",
    subtitle:
      "ক্যামেরার সামনে আপনার উন্মুক্ত হাতটি সোজা করে ধরুন। হাতের ২১টি বিন্দু শনাক্ত করে স্বয়ংক্রিয়ভাবে রেখাগুলো স্ক্যান করা হবে এবং ক্লায়েন্টের বৈদিক হস্তরেখা নিয়মাবলি অনুসারে পুঙ্খানুপুঙ্খ ফলাফল প্রদান করা হবে।",
    scanWithCamera: "ক্যামেরা দিয়ে সরাসরি স্ক্যান করুন",
    scanCameraSubtitle: "আপনার খোলা হাতের তালু ফ্রেমের মধ্যে সোজা রাখুন এবং প্রস্তুত হলে ক্যাপচার বাটনে চাপ দিন",
    uploadPhoto: "অথবা হাতের স্পষ্ট ছবি আপলোড করুন",
    captureNow: "এখনই ছবি তুলুন",
    captureReady: "হাতের তালু প্রস্তুত! ক্যাপচার ও ৩ডি স্ক্যান করুন",
    captureManual: "ছবি তুলুন ও ৩ডি স্ক্যান করুন",
    alignedReady: "হাতের অবস্থান সম্পূর্ণ সঠিক! ক্যাপচার বাটনে চাপ দিন",
    handFramingGuide: "হাতের তালু নির্দেশক ফ্রেমের ভেতরে সোজা রাখুন",
    stopCamera: "ক্যামেরা বন্ধ করুন",
    scanningAgain: "পুনরায় স্ক্যান করুন",
    scanningText: "হস্তরেখা ও সূক্ষ্ম গভীরতা বিশ্লেষণ করা হচ্ছে…",
    coinsCost: "কয়েন প্রতি রিডিং",
    freeCost: "সম্পূর্ণ বিনামূল্যে",
    balance: "ব্যালেন্স",
    signInPrompt: "হস্তরেখা স্ক্যান করতে অনুগ্রহ করে সাইন ইন করুন।",

    guidanceTitle: "সঠিক স্ক্যানের জন্য নির্দেশিকা",
    lookingForHand: "আপনার হাতের তালু খুঁজছে…",
    holdStill: "একটু স্থির রাখুন…",
    handDetected: "হাত শনাক্ত হয়েছে",
    leftHand: "বাম হাত",
    rightHand: "ডান হাত",

    rejectedTitle: "ছবিটি সঠিকভাবে পড়া সম্ভব হয়নি",
    notCharged: "আপনার কোনো কয়েন কাটা হয়নি।",

    resultsTitle: "আপনার হস্তরেখা বিশ্লেষণের ফলাফল",
    resultsSubtitle: "নিচের রেখা ও পরিমাপগুলোর ওপর ভিত্তি করে নিখুঁত গণনা প্রস্তুত করা হয়েছে।",
    handTypeTitle: "হাতের মূল উপাদান ও প্রকৃতি (Hand Element)",
    creasesTitle: "প্রধান হস্তরেখা বিশ্লেষণ",
    contrastTooltip: "ত্বকের সাপেক্ষে রেখার গভীরতা ও স্পষ্টতার অনুপাত",
    tracedLabel: "স্পষ্টভাবে স্ক্যান সম্পন্ন",
    notClearLabel: "এই ছবিতে রেখাটি স্পষ্ট নয়",
    endsAtMount: "পর্বতে গিয়ে সমাপ্ত হয়েছে",
    measuredLabel: "পরিমাপকৃত উপাত্ত",
    sourceDocLabel: "শাস্ত্রীয় তথ্যসূত্র",
    notAssessedTitle: "যা এই ছবিতে বিশ্লেষণযোগ্য নয়",
    notAssessedSubtitle: "হাতের আঙুলের ছাপ বা ত্বকের ছিদ্র সাধারণ ফটোতে দৃশ্যমান না হওয়ায় এগুলো বাদ রাখা হয়েছে।",
    scanSpeedFooter: "মিলিসেকেন্ডে প্রসেস করা হয়েছে",

    tabs: {
      overview: "সামগ্রিক বিবরণ",
      timeline: "আয়ু ও কালক্রম",
      sacred_marks: "পবিত্র চিহ্ন ও যোগ",
      archetype: "স্বভাব ও প্রকৃতি",
      marriage: "বিবাহ ও দাম্পত্য",
      loops: "চর্মরেখা লুপ",
      medical: "স্বাস্থ্য ও আয়ুর্বেদ",
      kundli_sync: "কুণ্ডলী ও গ্রহ যোগ",
      lines: "রেখাসমূহ",
      forecasts: "ভবিষ্যদ্বাণী",
      details: "জ্যামিতিক পরিমাপ",
      scan3d: "ত্রিমাত্রিক ৩ডি স্ক্যান",
    },

    elements: {
      earth: {
        title: "পৃথিবী তত্ত্ব (Earth Hand)",
        subtitle: "বর্গাকার তালু ও দৃঢ় আঙুল",
        desc: "বাস্তবধর্মী, পরিশ্রমী, সৎ, নির্ভরযোগ্য এবং বস্তুনিষ্ঠ কাজে নিবেদিতপ্রাণ। আবেগের চেয়ে যুক্তিতে বিশ্বাসী।",
      },
      air: {
        title: "বায়ু তত্ত্ব (Air Hand)",
        subtitle: "বর্গাকার তালু ও লম্বা আঙুল",
        desc: "উচ্চ চিন্তাশীল, তীক্ষ্ণ বুদ্ধিসম্পন্ন, গবেষক, বাকপটু ও দূরদর্শী। যেকোনো জটিল বিষয় দ্রুত অনুধাবন করতে পারেন।",
      },
      fire: {
        title: "অগ্নি তত্ত্ব (Fire Hand)",
        subtitle: "লম্বা তালু ও সক্রিয় আঙুল",
        desc: "প্রচণ্ড ইচ্ছাশক্তি, তেজস্বী নেতৃত্ব, উচ্চাকাঙ্ক্ষা ও দ্রুত সিদ্ধান্ত গ্রহণের অধিকারী। কর্মক্ষেত্রে অদম্য উদ্যমী।",
      },
      water: {
        title: "জল তত্ত্ব (Water Hand)",
        subtitle: "লম্বা তালু ও দীর্ঘ কমনীয় আঙুল",
        desc: "প্রবল অন্তর্দৃষ্টিসম্পন্ন, অনুভূতিপ্রবণ, সহানুভূতিশীল ও সৃজনশীল। শিল্প, পরামর্শ ও আধ্যাত্মিকতায় অত্যন্ত পারদর্শী।",
      },
    },

    lines: {
      heart: {
        name: "হৃদয় রেখা (Water Line)",
        element: "জল তত্ত্ব",
        desc: "প্রেম, প্রণয়, মানসিক দৃঢ়তা, সহমর্মিতা ও সম্পর্কের স্থায়ীত্ব নির্দেশ করে।",
      },
      head: {
        name: "মস্তিষ্ক রেখা (Air Line)",
        element: "বায়ু তত্ত্ব",
        desc: "বুদ্ধিমত্তা, যুক্তিবোধ, স্মৃতিশক্তি, কৌশল এবং সিদ্ধান্ত গ্রহণের গভীরতা নির্দেশ করে।",
      },
      life: {
        name: "জীবন রেখা (Earth Line)",
        element: "পৃথিবী তত্ত্ব",
        desc: "শারীরিক জীবনীশক্তি, রোগ প্রতিরোধ ক্ষমতা, শেকড়, গৃহ এবং ভাগ্যোন্নয়নের বিস্তার।",
      },
      fate: {
        name: "ভাগ্য রেখা (Fire Line)",
        element: "অগ্নি তত্ত্ব",
        desc: "কর্মজীবন, আত্মপ্রতিষ্ঠা, পেশাগত লক্ষ্য ও সমাজে সাফল্যের গতিপথ নির্দেশ করে।",
      },
      sun: {
        name: "রবি রেখা (Sun Line / Apollo)",
        element: "সূর্য তত্ত্ব",
        desc: "খ্যাতি, সামাজিক মর্যাদা, অর্থনৈতিক সাফল্য, সৃজনশীল প্রতিভা ও রাজকীয় স্বীকৃতি নির্দেশ করে।",
      },
      mercury: {
        name: "বুধ রেখা (Health / Mercury Line)",
        element: "বুধ তত্ত্ব",
        desc: "শারীরিক পরিপাকতন্ত্র, স্নায়বিক সুস্থতা, ব্যবসায়িক দূরদর্শিতা ও বাগ্মিতা নির্দেশ করে।",
      },
      mars: {
        name: "মঙ্গল রেখা (Sanjeevani / Sister Life)",
        element: "মঙ্গল তত্ত্ব",
        desc: "দৈব সুরক্ষা কবচ, সংকটে অপ্রত্যাশিত সাহায্য, রোগমুক্তি ও দীর্ঘায়ু নির্দেশ করে।",
      },
    },

    areas: {
      Temperament: "ব্যক্তিত্ব ও প্রকৃতি",
      Disposition: "আচরণ ও দৃষ্টিভঙ্গি",
      Thinking: "বুদ্ধিমত্তা ও চিন্তাধারা",
      Will: "ইচ্ছাশক্তি ও সংকল্প",
      Authority: "নেতৃত্ব ও মর্যাদা",
      Work: "কর্মজীবন ও সমৃদ্ধি",
      Relationships: "প্রেম ও দাম্পত্য সম্পর্ক",
      Vitality: "শারীরিক শক্তি ও স্বাস্থ্য",
      Orientation: "জীবনের অভিমুখ",
      Mounts: "গ্রহ পর্বত ও উচ্চতা",
      Flexibility: "আঙুলের নমনীয়তা ও গতি",
      Fortitude: "অভ্যন্তরীণ স্থায়িত্ব ও মঙ্গল তল",
    },

    featureLabels: {
      hand_type: "হাতের উপাদান ও প্রকৃতি",
      palm_shape: "তালুর জ্যামিতি ও গড়ন",
      fingers: "আঙুলের অনুপাত",
      finger_length: "চিন্তার গতি ও গভীরতা",
      finger_dynamics: "সামাজিক অবস্থান ও স্বভাব",
      thumb: "বৃদ্ধাঙ্গুলি ও ইচ্ছাশক্তি",
      jupiter_finger: "বৃহস্পতি আঙুল (নেতৃত্ব ও নীতি)",
      mercury_finger: "বুধ আঙুল (ব্যবসা ও বাকশক্তি)",
      phalanges: "আঙুলের পর্বের শক্তিবিন্যাস",
      heart_line: "হৃদয় রেখা (মানসিক অনুভূতি)",
      head_line: "মস্তিষ্ক রেখা (বুদ্ধি ও কৌশল)",
      life_line: "জীবন রেখা (শারীরিক শক্তি ও স্থায়িত্ব)",
      fate_line: "ভাগ্য রেখা (কর্ম ও অগ্রগতি)",
      line_relationship: "মন ও হৃদয়ের ভারসাম্য",
      career_forecast: "কর্মজীবন ও আর্থিক পূর্বাভাস",
      relationship_forecast: "দাম্পত্য ও সম্পর্কের পূর্বাভাস",
      health_forecast: "স্বাস্থ্য ও জীবনীশক্তির পূর্বাভাস",
      mounts_3d: "ত্রিমাত্রিক গ্রহ পর্বত ও উচ্চতা (3D Mounts)",
      finger_flexibility_3d: "ত্রিমাত্রিক আঙুলের নমনীয়তা ও গতিশীলতা (3D Flexibility)",
      palm_hollow_3d: "ত্রিমাত্রিক তালুর গভীরতা ও মঙ্গল তল (Plain of Mars)",
      sun_line: "রবি রেখা (Sun Line / Apollo)",
      mars_line: "মঙ্গল ও সঞ্জীবনী রেখা (Divine Shield)",
      sacred_marks: "পবিত্র বৈদিক শুভ যোগ ও চিহ্ন",
      skin_vitality: "আয়ুর্বেদিক ওজঃ ও কান্তি বিচার",
    },
  },

  hi: {
    badge: "हस्तरेखा विज्ञान",
    title: "अपनी हथेली को लाइव स्कैन करें",
    subtitle:
      "कैमरे के सामने अपनी खुली हथेली को सीधा रखें। इक्कीस मुख्य बिंदुओं को ट्रैक करके वैदिक हस्तरेखा सिद्धांतों के अनुसार आपकी रेखाओं और पर्वतों का सटीक, प्रामाणिक विश्लेषण किया जाएगा।",
    scanWithCamera: "कैमरे से लाइव स्कैन करें",
    scanCameraSubtitle: "अपनी खुली हथेली को फ्रेम में सीधा रखें और तैयार होने पर कैप्चर बटन दबाएं",
    uploadPhoto: "या हथेली की स्पष्ट फोटो अपलोड करें",
    captureNow: "अभी फोटो लें",
    captureReady: "हथेली संरेखित! कैप्चर एवं 3D स्कैन करें",
    captureManual: "फोटो लें और 3D स्कैन करें",
    alignedReady: "हथेली सही स्थिति में है! कैप्चर बटन दबाएं",
    handFramingGuide: "हथेली को गाइड फ्रेम के अंदर सीधा रखें",
    stopCamera: "कैमरा बंद करें",
    scanningAgain: "फिर से स्कैन करें",
    scanningText: "हस्तरेखाओं का सूक्ष्म विश्लेषण जारी है…",
    coinsCost: "सिक्के प्रति रीडिंग",
    freeCost: "बिल्कुल मुफ्त",
    balance: "बैलेंस",
    signInPrompt: "हस्तरेखा देखने के लिए कृपया साइन इन करें।",

    guidanceTitle: "स्पष्ट स्कैन के लिए निर्देश",
    lookingForHand: "आपकी हथेली खोजी जा रही है…",
    holdStill: "कृपया स्थिर रहें…",
    handDetected: "हाथ पहचान लिया गया",
    leftHand: "बायाँ हाथ",
    rightHand: "दायाँ हाथ",

    rejectedTitle: "फोटो स्पष्ट रूप से नहीं पढ़ी जा सकी",
    notCharged: "आपके कोई सिक्के नहीं काटे गए हैं।",

    resultsTitle: "आपकी हस्तरेखा का विस्तृत विश्लेषण",
    resultsSubtitle: "आपकी हथेली की रेखाओं और अनुपातों के आधार पर तैयार किया गया व्यक्तिगत परिणाम।",
    handTypeTitle: "हस्त तत्व एवं प्रकृति (Hand Element)",
    creasesTitle: "प्रमुख हस्तरेखाओं का विवरण",
    contrastTooltip: "त्वचा की तुलना में रेखा की गहराई और स्पष्टता का पैमाना",
    tracedLabel: "सफलतापूर्वक स्कैन हुआ",
    notClearLabel: "इस फोटो में रेखा स्पष्ट नहीं है",
    endsAtMount: "पर्वत पर समाप्त होती है",
    measuredLabel: "मापे गए आंकड़े",
    sourceDocLabel: "वैदिक संदर्भ",
    notAssessedTitle: "जो इस फोटो में नहीं देखा जा सका",
    notAssessedSubtitle: "उंगलियों के सूक्ष्म निशान या त्वचा की बनावट सामान्य फोटो में नहीं दिखते, इसलिए इन्हें छोड़ा गया है।",
    scanSpeedFooter: "मिलीसेकंड में प्रोसेस किया गया",

    tabs: {
      overview: "समग्र विवरण",
      timeline: "आयु एवं कालक्रम",
      sacred_marks: "पवित्र चिह्न एवं योग",
      archetype: "प्रकृति और स्वभाव",
      marriage: "विवाह एवं संबंध",
      loops: "त्वचा-रेखा लूप",
      medical: "स्वास्थ्य एवं आयुर्वेद",
      kundli_sync: "कुंडली एवं ग्रह संरेखण",
      lines: "हस्तरेखाएं",
      forecasts: "भविष्यवाणी",
      details: "माप और अनुपात",
      scan3d: "त्रिविमीय 3D स्कैन",
    },

    elements: {
      earth: {
        title: "पृथ्वी तत्व (Earth Hand)",
        subtitle: "चौकोर हथेली और मजबूत उंगलियां",
        desc: "व्यावहारिक, मेहनती, ईमानदार, धैर्यवान और ठोस परिणामों में विश्वास रखने वाले।",
      },
      air: {
        title: "वायु तत्व (Air Hand)",
        subtitle: "चौकोर हथेली और लंबी उंगलियां",
        desc: "बुद्धिमान, तार्किक, संवाद में निपुण, जिज्ञासु और गहरी सोच रखने वाले।",
      },
      fire: {
        title: "अग्नि तत्व (Fire Hand)",
        subtitle: "लंबी हथेली और छोटी उंगलियां",
        desc: "ऊर्जावान, महत्वाकांक्षी, स्वाभाविक नेतृत्वकर्ता और त्वरित निर्णय लेने वाले।",
      },
      water: {
        title: "जल तत्व (Water Hand)",
        subtitle: "लंबी हथेली और लंबी सुकुमार उंगलियां",
        desc: "अति संवेदनशील, सहज ज्ञानी, कलाप्रेमी, सहानुभूतिपूर्ण और रचनात्मक।",
      },
    },

    lines: {
      heart: {
        name: "हृदय रेखा (Water Line)",
        element: "जल तत्व",
        desc: "भावनाओं, प्रेम, पारिवारिक समर्पण और रिश्तों की गहराई को दर्शाती है।",
      },
      head: {
        name: "मस्तिष्क रेखा (Air Line)",
        element: "वायु तत्व",
        desc: "सोचने की शैली, तर्क, मानसिक एकाग्रता और विवेक का प्रतीक है।",
      },
      life: {
        name: "जीवन रेखा (Earth Line)",
        element: "पृथ्वी तत्व",
        desc: "शारीरिक ऊर्जा, जीवन शक्ति, स्वास्थ्य और मूल निवास का विस्तार।",
      },
      fate: {
        name: "भाग्य रेखा (Fire Line)",
        element: "अग्नि तत्व",
        desc: "आजीविका, करियर की दिशा, सफलता और जिम्मेदारियों का मार्ग।",
      },
      sun: {
        name: "सूर्य रेखा (Sun Line / Apollo)",
        element: "सूर्य तत्व",
        desc: "यश, सामाजिक प्रतिष्ठा, वित्तीय समृद्धि, रचनात्मक प्रतिभा और राजयोग का प्रतीक है।",
      },
      mercury: {
        name: "बुध रेखा (Health / Mercury Line)",
        element: "बुध तत्व",
        desc: "शारीरिक स्वास्थ्य, तंत्रिका तंत्र, व्यापारिक कुशलता और वाकपटुता को दर्शाती है।",
      },
      mars: {
        name: "मंगल रेखा (संजीवनी / Sister Life Line)",
        element: "मंगल तत्व",
        desc: "दैवीय सुरक्षा कवच, जीवन संकटों से रक्षा, रोग मुक्ति और दीर्घायु प्रदान करती है।",
      },
    },

    areas: {
      Temperament: "प्रकृति एवं स्वभाव",
      Disposition: "दृष्टिकोण एवं आचरण",
      Thinking: "बुद्धि एवं चिंतन",
      Will: "इच्छाशक्ति एवं संकल्प",
      Authority: "अधिकार एवं नेतृत्व",
      Work: "करियर एवं आजीविका",
      Relationships: "प्रेम एवं दांपत्य",
      Vitality: "स्वास्थ्य एवं जीवन ऊर्जा",
      Orientation: "जीवन की प्राथमिकताएं",
      Mounts: "ग्रह पर्वत एवं उभार",
      Flexibility: "उंगलियों का लचीलापन",
      Fortitude: "आंतरिक सहनशक्ति (मंगल तल)",
    },

    featureLabels: {
      hand_type: "हस्त तत्व एवं प्रकृति",
      palm_shape: "हथेली की बनावट",
      fingers: "उंगलियों का अनुपात",
      finger_length: "सोचने की गति",
      finger_dynamics: "सामाजिक व्यवहार",
      thumb: "अंगूठा (इच्छाशक्ति एवं तर्क)",
      jupiter_finger: "तर्जनी उंगली (नेतृत्व एवं नीति)",
      mercury_finger: "कनिष्ठिका (व्यापार एवं संवाद)",
      phalanges: "पोरों का शक्ति संतुलन",
      heart_line: "हृदय रेखा (भावनात्मक प्रवाह)",
      head_line: "मस्तिष्क रेखा (बुद्धि एवं रणनीति)",
      life_line: "जीवन रेखा (जीवन शक्ति एवं स्वास्थ्य)",
      fate_line: "भाग्य रेखा (करियर एवं गंतव्य)",
      line_relationship: "मन और हृदय का संतुलन",
      career_forecast: "करियर एवं धन संबंधी भविष्यवाणी",
      relationship_forecast: "दांपत्य एवं संबंध संबंधी भविष्यवाणी",
      health_forecast: "स्वास्थ्य एवं ऊर्जा संबंधी भविष्यवाणी",
      mounts_3d: "3D ग्रह पर्वत और उभार",
      finger_flexibility_3d: "3D उंगलियों का लचीलापन",
      palm_hollow_3d: "3D हथेली का गड्ढा एवं मंगल तल",
      sun_line: "सूर्य रेखा (Sun Line / Apollo)",
      mars_line: "मंगल एवं संजीवनी रेखा (Mars Line)",
      sacred_marks: "पवित्र वैदिक शुभ चिह्न एवं योग",
      skin_vitality: "आयुर्वेदिक ओज एवं कांति विचार",
    },
  },

  en: {
    badge: "Palm Reading",
    title: "Scan your palm, live",
    subtitle:
      "Hold your open palm steady in front of the camera. Twenty-one anatomical points are tracked in real time, the primary creases are precisely traced, and a 100% personalized reading is generated based on authentic Vedic palmistry principles.",
    scanWithCamera: "Scan with Live Camera",
    scanCameraSubtitle: "Hold open palm flat inside frame, then click capture when ready",
    uploadPhoto: "Or upload a high-resolution palm photo",
    captureNow: "Capture Photo Now",
    captureReady: "Palm Aligned! Capture & 3D Scan",
    captureManual: "Capture & 3D Scan",
    alignedReady: "Palm perfectly aligned! Ready to capture",
    handFramingGuide: "Position palm flat within the guide frame",
    stopCamera: "Stop Camera",
    scanningAgain: "Scan Another Hand",
    scanningText: "Tracing creases and measuring depth…",
    coinsCost: "coins per reading",
    freeCost: "Free",
    balance: "Balance",
    signInPrompt: "Please sign in to scan your palm.",

    guidanceTitle: "Guidelines for a readable photo",
    lookingForHand: "Looking for your hand…",
    holdStill: "Hold steady…",
    handDetected: "Hand detected",
    leftHand: "Left hand",
    rightHand: "Right hand",

    rejectedTitle: "That photo could not be read",
    notCharged: "You have not been charged.",

    resultsTitle: "Your Personal Palmistry Findings",
    resultsSubtitle: "Every finding below is directly derived from actual measured geometric and crease features.",
    handTypeTitle: "Hand Element & Constitution",
    creasesTitle: "Principal Palm Creases",
    contrastTooltip: "Ratio of crease depth and clarity against surrounding skin texture",
    tracedLabel: "Traced & Verified",
    notClearLabel: "Crease not sharp enough in this shot",
    endsAtMount: "mount termination",
    measuredLabel: "Measured Metric",
    sourceDocLabel: "Provenance Document",
    notAssessedTitle: "Not assessed from this photo",
    notAssessedSubtitle: "Fine fingerprint ridges and skin micropores require specialized macro sensors and are omitted.",
    scanSpeedFooter: "Processed in ms",

    tabs: {
      overview: "Overview",
      timeline: "Age Timeline",
      sacred_marks: "Sacred Marks",
      archetype: "Vedic Archetype",
      marriage: "Marriage Cards",
      loops: "Dermatoglyphic Loops",
      medical: "Medical Chirology",
      kundli_sync: "Kundli-Palm Sync",
      lines: "Palm Creases",
      forecasts: "Life Forecasts",
      details: "Measurements",
      scan3d: "3D Palm Scan",
    },

    elements: {
      earth: {
        title: "Earth Hand",
        subtitle: "Square palm with sturdy fingers",
        desc: "Practical, hard-working, grounded, trustworthy, and realistic. Values tangible outcomes over speculation.",
      },
      air: {
        title: "Air Hand",
        subtitle: "Square palm with long fingers",
        desc: "Intellectually agile, analytical, eloquent, and diplomatic. Thrives on curiosity and abstract ideas.",
      },
      fire: {
        title: "Fire Hand",
        subtitle: "Long palm with energetic fingers",
        desc: "Decisive, passionate, ambitious, and charismatic. Natural leadership with quick momentum.",
      },
      water: {
        title: "Water Hand",
        subtitle: "Long palm with slender graceful fingers",
        desc: "Intuitive, receptive, empathetic, and imaginative. Exceptional emotional sensitivity and artistic flair.",
      },
    },

    lines: {
      heart: {
        name: "Heart Line (Water)",
        element: "Water Element",
        desc: "Reflects emotional flow, affection, loyalty, romantic devotion, and relationship depth.",
      },
      head: {
        name: "Head Line (Air)",
        element: "Air Element",
        desc: "Governs intellectual strategy, concentration, reasoning, imagination, and decision-making.",
      },
      life: {
        name: "Life Line (Earth)",
        element: "Earth Element",
        desc: "Reveals physical vitality, stamina, domestic grounding, ancestral roots, and expansion.",
      },
      fate: {
        name: "Fate Line (Fire)",
        element: "Fire Element",
        desc: "Traces vocational trajectory, self-directed ambition, public recognition, and life path.",
      },
      sun: {
        name: "Sun Line (Apollo / Ravi Rekha)",
        element: "Solar Element",
        desc: "Governs public recognition, brilliance, financial prosperity, artistic legacy, and charisma.",
      },
      mercury: {
        name: "Mercury Line (Health / Budha Rekha)",
        element: "Mercurial Element",
        desc: "Indicates nervous system vitality, digestive constitution, commercial sharpness, and eloquence.",
      },
      mars: {
        name: "Mars Line (Sanjeevani / Sister Life)",
        element: "Martian Element",
        desc: "Divine shielding, crisis resilience, regenerative immunity, and extended vitality.",
      },
    },

    areas: {
      Temperament: "Temperament & Constitution",
      Disposition: "Social Disposition & Stance",
      Thinking: "Mind & Intellect",
      Will: "Willpower & Logic",
      Authority: "Authority & Ambition",
      Work: "Career & Commerce",
      Relationships: "Love & Partnership",
      Vitality: "Vitality & Health",
      Orientation: "Energy Orientation",
      Mounts: "Planetary Mounts",
      Flexibility: "Joint Flexibility",
      Fortitude: "Core Fortitude (Mars)",
    },

    featureLabels: {
      hand_type: "Hand Element & Constitution",
      palm_shape: "Palm Geometry & Proportion",
      fingers: "Finger Proportion",
      finger_length: "Mental Processing Pace",
      finger_dynamics: "Temperament & Social Stance",
      thumb: "Willpower & Logic (Thumb)",
      jupiter_finger: "Ambition & Authority (Jupiter)",
      mercury_finger: "Communication & Commerce (Mercury)",
      phalanges: "Phalangeal Orientation",
      heart_line: "Emotional Flow (Water Line)",
      head_line: "Intellect & Strategy (Air Line)",
      life_line: "Vitality & Roots (Earth Line)",
      fate_line: "Career & Destiny (Fire Line)",
      line_relationship: "Mind-Heart Equilibrium",
      career_forecast: "Career & Financial Synthesis",
      relationship_forecast: "Love & Marriage Synthesis",
      health_forecast: "Vitality & Wellness Synthesis",
      mounts_3d: "3D Mount Topography & Planetary Energies",
      finger_flexibility_3d: "3D Joint Flexibility & Spontaneity",
      palm_hollow_3d: "3D Plain of Mars & Core Fortitude",
      sun_line: "Sun Line (Apollo / Ravi Rekha)",
      mars_line: "Mars Line (Sanjeevani / Divine Shield)",
      sacred_marks: "Sacred Vedic Marks & Auspicious Yogas",
      skin_vitality: "Ayurvedic Prana & Vitality Tone",
    },
  },
};
