/**
 * Single source of truth for the Unified 32-Pada N5 Vastu Compass System.
 * Faithfully adapted from Newmeric Compass (N5 coordinate system).
 *
 * True North (0.0° / 360.0°) is the exact center of Pada N5 (Soma / Kubera).
 * Each Pada spans exactly 11.25°.
 * Each 16-Wind Direction spans 22.5° and encompasses 2 Padas.
 */

export interface VastuPada {
  code: string;               // e.g. "N5", "E3"
  index: number;              // 1..32
  quadrant: "N" | "E" | "S" | "W";
  quadrant_index: number;     // 1..8
  center_deg: number;         // e.g. 0.0, 11.25, ..., 348.75
  start_deg: number;          // e.g. 354.375, 5.625, ...
  end_deg: number;            // e.g. 5.625, 16.875, ...
  direction16: string;        // "N", "NNE", "NE", etc.
  direction16_full: string;   // "North", "North-North-East", etc.
  direction8: string;         // "N", "NE", "E", "SE", "S", "SW", "W", "NW"
  name: string;               // Deity name in English
  deity_bn: string;           // Deity name in Bengali
  deity_hi: string;           // Deity name in Hindi
  isGoldenDoor: boolean;      // The 8 Golden Doors: N3, N4, E3, E4, S3, S4, W3, W4
  entrance_challenge: string; // Vastu challenge if main entrance placed here
  entrance_challenge_bn: string;
  entrance_rating: "excellent" | "good" | "conditional" | "challenging" | "avoid";
  entrance_rating_label: string;
  entrance_rating_color: string;
  element: "Water" | "Air" | "Fire" | "Earth";
  dosha: string;
  organ: string;
  life_aspect: string;
  life_aspect_bn: string;
  nakshatra: string;
  color: string;              // Authentic pastel zone color
  corner: string;             // Kon name (e.g. "Ishanya Kon")
  lord: string;               // Asta Dikpala Deity
  deity_english: string;
  vastu_association: string;
  planet: string;
  day: string;
  metal: string;
  shape: string;
  primary_element: string;
  self_colour: string;
  enhance_colour: string;
  acceptable_colour: string;
  destruct_colour: string;
  exhaust_colour: string;
  art_image?: string;         // Relative path in /vastu/
}

export const DIR16_ORDER = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
] as const;

export const DIR16_FULL: Record<string, string> = {
  N: "North", NNE: "North-North-East", NE: "North-East", ENE: "East-North-East",
  E: "East", ESE: "East-South-East", SE: "South-East", SSE: "South-South-East",
  S: "South", SSW: "South-South-West", SW: "South-West", WSW: "West-South-West",
  W: "West", WNW: "West-North-West", NW: "North-West", NNW: "North-North-West",
};

export const DIR16_FULL_BN: Record<string, string> = {
  N: "উত্তর (কুবের স্থান)", NNE: "উত্তর-উত্তর-পূর্ব (স্বাস্থ্য ও আরোগ্য)",
  NE: "উত্তর-পূর্ব (ঈশান কোণ)", ENE: "পূর্ব-উত্তর-পূর্ব (আনন্দ ও উল্লাস)",
  E: "পূর্ব (ইন্দ্র স্থান)", ESE: "পূর্ব-দক্ষিণ-পূর্ব (মন্থন ও বিশ্লেষণ)",
  SE: "দক্ষিণ-পূর্ব (আগ্নেয় কোণ)", SSE: "দক্ষিণ-দক্ষিণ-পূর্ব (শক্তি ও আত্মবিশ্বাস)",
  S: "দক্ষিণ (যম স্থান)", SSW: "দক্ষিণ-দক্ষিণ-পশ্চিম (বিসর্জন ও ব্যয়)",
  SW: "দক্ষিণ-পশ্চিম (নৈঋত্য কোণ)", WSW: "পশ্চিম-দক্ষিণ-পশ্চিম (বিদ্যা ও সঞ্চয়)",
  W: "পশ্চিম (বরুণ স্থান)", WNW: "পশ্চিম-উত্তর-পশ্চিম (বিষণ্নতা মুক্তি)",
  NW: "উত্তর-পশ্চিম (বায়ব্য কোণ)", NNW: "উত্তর-উত্তর-পশ্চিম (আকর্ষণ ও কাম)",
};

/** Authentic Pastel Zone Color Palette directly from Newmeric Compass */
export const ZONE_COLORS: Record<string, string> = {
  N: "#CFE8F5", NNE: "#CFE8F5", NE: "#CFE9C6", ENE: "#C9E7B0",
  E: "#C4E4A6", ESE: "#D8E9A6", SE: "#F4C8D6", SSE: "#F2BCCB",
  S: "#F3C2CB", SSW: "#F3E6A6", SW: "#EFE296", WSW: "#ECE6AE",
  W: "#DDCFEC", WNW: "#D9C8E9", NW: "#ECE0C6", NNW: "#D0E6EC",
};

export const ENTRANCE_RATINGS = {
  excellent:   { label: "Excellent",   category: "Strongly favourable",     color: "#1B7F4B", verdict: "excellent" },
  good:        { label: "Good",        category: "Generally supportive",    color: "#4CAF50", verdict: "good" },
  conditional: { label: "Conditional", category: "Depends strongly on use", color: "#E7B416", verdict: "average" },
  challenging: { label: "Challenging", category: "Needs careful application", color: "#F2711C", verdict: "bad" },
  avoid:       { label: "Generally Avoid for Main Entrance", category: "Traditionally difficult", color: "#D5432E", verdict: "bad" },
} as const;

// ---------------------------------------------------------------------------
// 32 Padas Master Definitions (Calculated for N5 center = 0.0° True North)
//
// `entrance_rating` is capped by the client's own rule. RESOURCES-MASTER.md
// §20.1, drawn from the Rahul Pandat Vastu PDFs, names exactly eight
// auspicious entrance padas — the Golden Doors, flagged here as
// `isGoldenDoor` — and states that the other twenty-four "produce distinct
// afflictions when used as main entrances", naming W5 Dauvarika as an example.
//
// The upstream Newmeric Compass app grades five further padas (N5, N8, E5, E6,
// W5) as excellent or good. Those are capped at "conditional" here, because the
// backend's paid Vastu audit (`vastu_engine.py`, locked by
// `test_auspicious_entrances`) follows the client's eight. Left as they were,
// this compass would call a due-north N5 entrance "Excellent" while the audit
// called the same entrance প্রতিকূল and docked its score — one product giving two
// opposite answers about the same door.
//
// The gradation below the cap is still the upstream app's.
// ---------------------------------------------------------------------------
export const VASTU_PADAS: VastuPada[] = [
  // 1: N5 (Center 0.0°)
  {
    code: "N5", index: 1, quadrant: "N", quadrant_index: 5,
    center_deg: 0.0, start_deg: 354.375, end_deg: 5.625,
    direction16: "N", direction16_full: "North", direction8: "N",
    name: "Soma / Kubera", deity_bn: "সোম (কুবের)", deity_hi: "सोम (कुबेर)",
    isGoldenDoor: false,
    entrance_challenge: "Calm, spiritual and domestic energy; excessive emotionality or introversion can occur.",
    entrance_challenge_bn: "শান্তিপূর্ণ ও আধ্যাত্মিক শক্তি, তবে অতিরিক্ত ভাবাবেগ ও পারিবারিক মানসিক চাপ দেখা দিতে পারে।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Water", dosha: "Kapha", organ: "Kidney",
    life_aspect: "Money & Opportunities", life_aspect_bn: "অর্থোপার্জন ও নতুন সুযোগ",
    nakshatra: "Pushya", color: "#CFE8F5", corner: "Uttar Disha (Kubera Sthan)",
    lord: "Kubera", deity_english: "Lord of Wealth", vastu_association: "Wealth, finance, abundance",
    planet: "Mercury", day: "Wednesday", metal: "Brass", shape: "Wave / Rectangle",
    primary_element: "Water", self_colour: "Light Blue, Aqua",
    enhance_colour: "Sea Green, Mint, Blue-Green", acceptable_colour: "White, Silver, Light Grey",
    destruct_colour: "Strong Red, Deep Orange", exhaust_colour: "Excessive Yellow, Mustard, Heavy Brown",
    art_image: "/vastu/lord_kubera.png",
  },
  // 2: N6 (Center 11.25°)
  {
    code: "N6", index: 2, quadrant: "N", quadrant_index: 6,
    center_deg: 11.25, start_deg: 5.625, end_deg: 16.875,
    direction16: "NNE", direction16_full: "North-North-East", direction8: "N",
    name: "Bhujanga", deity_bn: "ভুজঙ্গ", deity_hi: "भुजंग",
    isGoldenDoor: false,
    entrance_challenge: "Opposition, quarrels, conflicts, resistance, communication gaps and feeling unheard.",
    entrance_challenge_bn: "পুত্রসন্তানের সাথে মনোমালিন্য, অহংকার ও পারিবারিক বিরোধ তৈরি হতে পারে।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Water", dosha: "Kapha", organ: "Pericardium",
    life_aspect: "Health & Immunity", life_aspect_bn: "স্বাস্থ্য ও রোগ প্রতিরোধ ক্ষমতা",
    nakshatra: "Ashlesha", color: "#CFE8F5", corner: "Uttar Disha (Kubera Sthan)",
    lord: "Kubera", deity_english: "Lord of Wealth", vastu_association: "Wealth, finance, abundance",
    planet: "Mercury", day: "Wednesday", metal: "Brass", shape: "Wave / Rectangle",
    primary_element: "Water", self_colour: "Light Blue, Aqua",
    enhance_colour: "Sea Green, Mint, Blue-Green", acceptable_colour: "White, Silver, Light Grey",
    destruct_colour: "Strong Red, Deep Orange", exhaust_colour: "Excessive Yellow, Mustard, Heavy Brown",
    art_image: "/vastu/lord_kubera.png",
  },
  // 3: N7 (Center 22.5°)
  {
    code: "N7", index: 3, quadrant: "N", quadrant_index: 7,
    center_deg: 22.5, start_deg: 16.875, end_deg: 28.125,
    direction16: "NNE", direction16_full: "North-North-East", direction8: "NE",
    name: "Aditi", deity_bn: "অদিতি", deity_hi: "अदिति",
    isGoldenDoor: false,
    entrance_challenge: "Traditional interpretations associate it with domestic/feminine-family anxiety and restlessness.",
    entrance_challenge_bn: "গৃহের নারীদের মধ্যে অস্থিরতা, দুশ্চিন্তা ও মানসিক চাপ দেখা দিতে পারে।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Water", dosha: "Kapha", organ: "Pericardium",
    life_aspect: "Health & Immunity", life_aspect_bn: "শারীরিক সুস্থতা ও আরোগ্য",
    nakshatra: "Magha", color: "#CFE8F5", corner: "Ishanya Kon (ঈশান্য কোণ)",
    lord: "Isanya / Shiva", deity_english: "Divine aspect of Lord Shiva", vastu_association: "Spirituality, wisdom, purity",
    planet: "Jupiter", day: "Thursday", metal: "Gold", shape: "Wave / Rectangle",
    primary_element: "Water / Spiritual", self_colour: "Very Light Yellow, Cream, White",
    enhance_colour: "Light Blue, Aqua, Pale Green", acceptable_colour: "Ivory, Soft Beige, Silver",
    destruct_colour: "Black, Charcoal, Dark Red", exhaust_colour: "Excessive Orange, Maroon, Heavy Brown",
    art_image: "/vastu/lord_shiva.png",
  },
  // 4: N8 (Center 33.75°)
  {
    code: "N8", index: 4, quadrant: "N", quadrant_index: 8,
    center_deg: 33.75, start_deg: 28.125, end_deg: 39.375,
    direction16: "NE", direction16_full: "North-East", direction8: "NE",
    name: "Diti", deity_bn: "দিতি", deity_hi: "दिति",
    isGoldenDoor: false,
    entrance_challenge: "Savings and financial accumulation; can increase possessiveness, expenditure, or material attachment.",
    entrance_challenge_bn: "আয়ের তুলনায় ব্যয়ের প্রবণতা ও অনর্থক খরচ বৃদ্ধি পেতে পারে।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Water", dosha: "Kapha", organ: "Head",
    life_aspect: "Ideas & Vision", life_aspect_bn: "প্রজ্ঞা, স্পষ্ট দৃষ্টি ও মানসিক শক্তি",
    nakshatra: "Purva Phalguni", color: "#CFE9C6", corner: "Ishanya Kon (ঈশান্য কোণ)",
    lord: "Isanya / Shiva", deity_english: "Divine aspect of Lord Shiva", vastu_association: "Spirituality, wisdom, purity",
    planet: "Jupiter", day: "Thursday", metal: "Gold", shape: "Wave / Rectangle",
    primary_element: "Water / Spiritual", self_colour: "Very Light Yellow, Cream, White",
    enhance_colour: "Light Blue, Aqua, Pale Green", acceptable_colour: "Ivory, Soft Beige, Silver",
    destruct_colour: "Black, Charcoal, Dark Red", exhaust_colour: "Excessive Orange, Maroon, Heavy Brown",
    art_image: "/vastu/lord_shiva.png",
  },
  // 5: E1 (Center 45.0°)
  {
    code: "E1", index: 5, quadrant: "E", quadrant_index: 1,
    center_deg: 45.0, start_deg: 39.375, end_deg: 50.625,
    direction16: "NE", direction16_full: "North-East", direction8: "NE",
    name: "Shikhi", deity_bn: "শিখী (অগ্নি)", deity_hi: "शिखी (अग्नि)",
    isGoldenDoor: false,
    entrance_challenge: "Fire-related concerns, short circuits, sudden expenses, and impulsive family friction.",
    entrance_challenge_bn: "অগ্নিকাণ্ড বা বৈদ্যুতিক বিপর্যয়ের ঝুঁকি, আকস্মিক আর্থিক ক্ষয়ক্ষতি।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Water", dosha: "Kapha", organ: "Head",
    life_aspect: "Ideas & Vision", life_aspect_bn: "মানসিক শান্তি ও অন্তর্দৃষ্টি",
    nakshatra: "Uttara Phalguni", color: "#CFE9C6", corner: "Ishanya Kon (ঈশান্য কোণ)",
    lord: "Isanya / Shiva", deity_english: "Divine aspect of Lord Shiva", vastu_association: "Spirituality, wisdom, purity",
    planet: "Jupiter", day: "Thursday", metal: "Gold", shape: "Wave / Rectangle",
    primary_element: "Water / Spiritual", self_colour: "Very Light Yellow, Cream, White",
    enhance_colour: "Light Blue, Aqua, Pale Green", acceptable_colour: "Ivory, Soft Beige, Silver",
    destruct_colour: "Black, Charcoal, Dark Red", exhaust_colour: "Excessive Orange, Maroon, Heavy Brown",
    art_image: "/vastu/lord_shiva.png",
  },
  // 6: E2 (Center 56.25°)
  {
    code: "E2", index: 6, quadrant: "E", quadrant_index: 2,
    center_deg: 56.25, start_deg: 50.625, end_deg: 61.875,
    direction16: "ENE", direction16_full: "East-North-East", direction8: "NE",
    name: "Parjanya", deity_bn: "পর্জন্য", deity_hi: "पर्जन्य",
    isGoldenDoor: false,
    entrance_challenge: "Unnecessary expenditure, resources may not accumulate easily; female health concerns.",
    entrance_challenge_bn: "কন্যা সন্তানের স্বাস্থ্য সমস্যা ও পরিবারে অনর্থক খরচের চাপ তৈরি হতে পারে।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Air", dosha: "Kapha", organ: "Nervous",
    life_aspect: "Leisure & Joy", life_aspect_bn: "আনন্দ, উল্লাস ও মানসিক সতেজতা",
    nakshatra: "Hasta", color: "#C9E7B0", corner: "Ishanya Kon (ঈশান্য কোণ)",
    lord: "Isanya / Shiva", deity_english: "Divine aspect of Lord Shiva", vastu_association: "Spirituality, wisdom, purity",
    planet: "Jupiter", day: "Thursday", metal: "Gold", shape: "Rectangle",
    primary_element: "Water / Spiritual", self_colour: "Very Light Yellow, Cream, White",
    enhance_colour: "Light Blue, Aqua, Pale Green", acceptable_colour: "Ivory, Soft Beige, Silver",
    destruct_colour: "Black, Charcoal, Dark Red", exhaust_colour: "Excessive Orange, Maroon, Heavy Brown",
    art_image: "/vastu/lord_shiva.png",
  },
  // 7: E3 (Center 67.5°) - GOLDEN DOOR
  {
    code: "E3", index: 7, quadrant: "E", quadrant_index: 3,
    center_deg: 67.5, start_deg: 61.875, end_deg: 73.125,
    direction16: "ENE", direction16_full: "East-North-East", direction8: "E",
    name: "Jayanta", deity_bn: "জয়ন্ত", deity_hi: "जयंत",
    isGoldenDoor: true,
    entrance_challenge: "Highly favourable, brings victory and royal fame; excessive ambition can become a secondary concern.",
    entrance_challenge_bn: "স্বর্ণদ্বার! বিজয়, সামাজিক সম্মান ও সৌভাগ্য নিশ্চিত করে; অতি-উচ্চাকাঙ্ক্ষা নিয়ন্ত্রণ রাখতে হয়।",
    entrance_rating: "excellent", entrance_rating_label: "Excellent (Golden Door)", entrance_rating_color: "#1B7F4B",
    element: "Air", dosha: "Kapha", organ: "Nervous",
    life_aspect: "Leisure & Joy", life_aspect_bn: "আনন্দ ও সামাজিক মর্যাদা",
    nakshatra: "Chitra", color: "#C9E7B0", corner: "Purva Disha (Indra Sthan)",
    lord: "Indra", deity_english: "Lord Indra", vastu_association: "Power, authority, prosperity, leadership",
    planet: "Sun", day: "Sunday", metal: "Gold", shape: "Rectangle",
    primary_element: "Wood / Solar", self_colour: "Light Green, Leaf Green",
    enhance_colour: "Fresh Green, Mint, Soft Yellow", acceptable_colour: "White, Ivory, Light Beige",
    destruct_colour: "Black, Charcoal, Deep Grey", exhaust_colour: "Excessive Red, Orange, Strong Purple",
    art_image: "/vastu/lord_indra.png",
  },
  // 8: E4 (Center 78.75°) - GOLDEN DOOR
  {
    code: "E4", index: 8, quadrant: "E", quadrant_index: 4,
    center_deg: 78.75, start_deg: 73.125, end_deg: 84.375,
    direction16: "E", direction16_full: "East", direction8: "E",
    name: "Indra", deity_bn: "ইন্দ্র", deity_hi: "इन्द्र",
    isGoldenDoor: true,
    entrance_challenge: "Brings immense governmental favor, authority and prestige; can increase ego struggles.",
    entrance_challenge_bn: "স্বর্ণদ্বার! সরকারি পৃষ্ঠপোষকতা, প্রভাব ও সামাজিক সমৃদ্ধি; অহংকার পরিহার বাঞ্ছনীয়।",
    entrance_rating: "excellent", entrance_rating_label: "Excellent (Golden Door)", entrance_rating_color: "#1B7F4B",
    element: "Air", dosha: "Tamas", organ: "Liver",
    life_aspect: "Social Associations", life_aspect_bn: "সামাজিক যোগাযোগ ও প্রতিপত্তি",
    nakshatra: "Swati", color: "#C4E4A6", corner: "Purva Disha (Indra Sthan)",
    lord: "Indra", deity_english: "Lord Indra", vastu_association: "Power, authority, prosperity, leadership",
    planet: "Sun", day: "Sunday", metal: "Gold", shape: "Rectangle",
    primary_element: "Wood / Solar", self_colour: "Light Green, Leaf Green",
    enhance_colour: "Fresh Green, Mint, Soft Yellow", acceptable_colour: "White, Ivory, Light Beige",
    destruct_colour: "Black, Charcoal, Deep Grey", exhaust_colour: "Excessive Red, Orange, Strong Purple",
    art_image: "/vastu/lord_indra.png",
  },
  // 9: E5 (Center 90.0° - Due East)
  {
    code: "E5", index: 9, quadrant: "E", quadrant_index: 5,
    center_deg: 90.0, start_deg: 84.375, end_deg: 95.625,
    direction16: "E", direction16_full: "East", direction8: "E",
    name: "Surya", deity_bn: "সূর্য", deity_hi: "सूर्य",
    isGoldenDoor: false,
    entrance_challenge: "Aggression, irritability, ego clashes, and hasty family decisions under stress.",
    entrance_challenge_bn: "অতিরিক্ত আত্মম্ভরিতা, ক্রোধ ও পরিবারের সদস্যদের মধ্যে বিরোধের ঝুঁকি।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Air", dosha: "Tamas", organ: "Liver",
    life_aspect: "Social Associations", life_aspect_bn: "সামাজিক নেটওয়ার্ক ও নেতৃত্ব",
    nakshatra: "Vishakha", color: "#C4E4A6", corner: "Purva Disha (Indra Sthan)",
    lord: "Indra", deity_english: "Lord Indra", vastu_association: "Power, authority, prosperity, leadership",
    planet: "Sun", day: "Sunday", metal: "Gold", shape: "Rectangle",
    primary_element: "Wood / Solar", self_colour: "Light Green, Leaf Green",
    enhance_colour: "Fresh Green, Mint, Soft Yellow", acceptable_colour: "White, Ivory, Light Beige",
    destruct_colour: "Black, Charcoal, Deep Grey", exhaust_colour: "Excessive Red, Orange, Strong Purple",
    art_image: "/vastu/lord_indra.png",
  },
  // 10: E6 (Center 101.25°)
  {
    code: "E6", index: 10, quadrant: "E", quadrant_index: 6,
    center_deg: 101.25, start_deg: 95.625, end_deg: 106.875,
    direction16: "ESE", direction16_full: "East-South-East", direction8: "E",
    name: "Satya", deity_bn: "সত্য", deity_hi: "सत्य",
    isGoldenDoor: false,
    entrance_challenge: "Traditional interpretation associates it with commitment issues, deceit or unreliability.",
    entrance_challenge_bn: "প্রতিশ্রুতি পালনে জটিলতা ও মিথ্যা অপবাদের ঝুঁকি।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Fire", dosha: "Tamas", organ: "Gall Bladder",
    life_aspect: "Analysis & Churning", life_aspect_bn: "চিন্তন ও গভীর বিশ্লেষণ",
    nakshatra: "Anuradha", color: "#D8E9A6", corner: "Purva Disha (Indra Sthan)",
    lord: "Indra", deity_english: "Lord Indra", vastu_association: "Power, authority, prosperity, leadership",
    planet: "Sun", day: "Sunday", metal: "Gold", shape: "Triangle",
    primary_element: "Wood / Solar", self_colour: "Light Green, Leaf Green",
    enhance_colour: "Fresh Green, Mint, Soft Yellow", acceptable_colour: "White, Ivory, Light Beige",
    destruct_colour: "Black, Charcoal, Deep Grey", exhaust_colour: "Excessive Red, Orange, Strong Purple",
    art_image: "/vastu/lord_indra.png",
  },
  // 11: E7 (Center 112.5°)
  {
    code: "E7", index: 11, quadrant: "E", quadrant_index: 7,
    center_deg: 112.5, start_deg: 106.875, end_deg: 118.125,
    direction16: "ESE", direction16_full: "East-South-East", direction8: "SE",
    name: "Bhrisha", deity_bn: "ভৃশ", deity_hi: "भृश",
    isGoldenDoor: false,
    entrance_challenge: "Insensitivity, impulsiveness, conflicts, domestic opposition and friction.",
    entrance_challenge_bn: "হঠকারিতা, পারিবারিক ক্রোধ ও সম্পর্কের তিক্ততা বৃদ্ধি পায়।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Fire", dosha: "Tamas", organ: "Gall Bladder",
    life_aspect: "Analysis & Churning", life_aspect_bn: "মন্থন ও বিশ্লেষণের ভারসাম্য",
    nakshatra: "Jyeshtha", color: "#D8E9A6", corner: "Agneya Kon (আग्नेय कोण / Fire Corner)",
    lord: "Agni", deity_english: "God of Fire", vastu_association: "Fire, energy, transformation",
    planet: "Venus", day: "Friday", metal: "Silver", shape: "Triangle",
    primary_element: "Fire", self_colour: "Light Red, Coral, Peach",
    enhance_colour: "Orange, Terracotta, Rose, Warm Pink", acceptable_colour: "Cream, Beige, Light Green",
    destruct_colour: "Black, Dark Blue, Deep Navy", exhaust_colour: "Excessive White, Silver, Grey",
    art_image: "/vastu/lord_agni.png",
  },
  // 12: E8 (Center 123.75°)
  {
    code: "E8", index: 12, quadrant: "E", quadrant_index: 8,
    center_deg: 123.75, start_deg: 118.125, end_deg: 129.375,
    direction16: "SE", direction16_full: "South-East", direction8: "SE",
    name: "Antariksha", deity_bn: "অন্তরীক্ষ", deity_hi: "अंतरिक्ष",
    isGoldenDoor: false,
    entrance_challenge: "Financial leakage, accidents, health concerns and theft-related vulnerability.",
    entrance_challenge_bn: "অর্থের অপচয়, প্রতারণার ঝুঁকি ও পরিবারের স্বাস্থ্যে নেতিবাচক প্রভাব।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Fire", dosha: "Pitta", organ: "Gall Bladder",
    life_aspect: "Cash Liquidity", life_aspect_bn: "নগদ অর্থপ্রবাহ ও সমৃদ্ধি",
    nakshatra: "Mula", color: "#F4C8D6", corner: "Agneya Kon (আग्नेय कोण / Fire Corner)",
    lord: "Agni", deity_english: "God of Fire", vastu_association: "Fire, energy, transformation",
    planet: "Venus", day: "Friday", metal: "Silver", shape: "Triangle",
    primary_element: "Fire", self_colour: "Light Red, Coral, Peach",
    enhance_colour: "Orange, Terracotta, Rose, Warm Pink", acceptable_colour: "Cream, Beige, Light Green",
    destruct_colour: "Black, Dark Blue, Deep Navy", exhaust_colour: "Excessive White, Silver, Grey",
    art_image: "/vastu/lord_agni.png",
  },
  // 13: S1 (Center 135.0°)
  {
    code: "S1", index: 13, quadrant: "S", quadrant_index: 1,
    center_deg: 135.0, start_deg: 129.375, end_deg: 140.625,
    direction16: "SE", direction16_full: "South-East", direction8: "SE",
    name: "Anil / Savita", deity_bn: "অনিল (বায়ু)", deity_hi: "अनिल",
    isGoldenDoor: false,
    entrance_challenge: "Family or son-related tensions, reproductive complications, and instability.",
    entrance_challenge_bn: "পারিবারিক অশান্তি ও ব্যবসায়িক উদ্যমে অনাকাঙ্ক্ষিত বাধা।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Fire", dosha: "Pitta", organ: "Gall Bladder",
    life_aspect: "Cash Liquidity", life_aspect_bn: "নগদ অর্থের সংস্থান",
    nakshatra: "Purva Ashadha", color: "#F4C8D6", corner: "Agneya Kon (আग्नेय कोण / Fire Corner)",
    lord: "Agni", deity_english: "God of Fire", vastu_association: "Fire, energy, transformation",
    planet: "Venus", day: "Friday", metal: "Silver", shape: "Triangle",
    primary_element: "Fire", self_colour: "Light Red, Coral, Peach",
    enhance_colour: "Orange, Terracotta, Rose, Warm Pink", acceptable_colour: "Cream, Beige, Light Green",
    destruct_colour: "Black, Dark Blue, Deep Navy", exhaust_colour: "Excessive White, Silver, Grey",
    art_image: "/vastu/lord_agni.png",
  },
  // 14: S2 (Center 146.25°)
  {
    code: "S2", index: 14, quadrant: "S", quadrant_index: 2,
    center_deg: 146.25, start_deg: 140.625, end_deg: 151.875,
    direction16: "SSE", direction16_full: "South-South-East", direction8: "SE",
    name: "Pusha", deity_bn: "পূষা", deity_hi: "पूषा",
    isGoldenDoor: false,
    entrance_challenge: "Relative-related complications, inconsistent support, and work subordination.",
    entrance_challenge_bn: "পরাধীনতা ও কর্মক্ষেত্রে ন্যায্য মূল্যায়নের অভাব ঘটতে পারে।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Fire", dosha: "Pitta", organ: "Spleen",
    life_aspect: "Power & Confidence", life_aspect_bn: "শারীরিক বল ও আত্মবিশ্বাস",
    nakshatra: "Uttara Ashadha", color: "#F2BCCB", corner: "Agneya Kon (আग्नेय कोण / Fire Corner)",
    lord: "Agni", deity_english: "God of Fire", vastu_association: "Fire, energy, transformation",
    planet: "Venus", day: "Friday", metal: "Silver", shape: "Triangle",
    primary_element: "Fire", self_colour: "Light Red, Coral, Peach",
    enhance_colour: "Orange, Terracotta, Rose, Warm Pink", acceptable_colour: "Cream, Beige, Light Green",
    destruct_colour: "Black, Dark Blue, Deep Navy", exhaust_colour: "Excessive White, Silver, Grey",
    art_image: "/vastu/lord_agni.png",
  },
  // 15: S3 (Center 157.5°) - GOLDEN DOOR
  {
    code: "S3", index: 15, quadrant: "S", quadrant_index: 3,
    center_deg: 157.5, start_deg: 151.875, end_deg: 163.125,
    direction16: "SSE", direction16_full: "South-South-East", direction8: "S",
    name: "Vitatha", deity_bn: "বিতথ", deity_hi: "वितथ",
    isGoldenDoor: true,
    entrance_challenge: "Supports commercial prosperity and entrepreneurship; ethical conduct must be strictly preserved.",
    entrance_challenge_bn: "স্বর্ণদ্বার! ব্যবসায় বিপুল মুনাফা ও অদম্য কর্মশক্তি; অনৈতিক পথ বর্জনীয়।",
    entrance_rating: "good", entrance_rating_label: "Good (Golden Door)", entrance_rating_color: "#4CAF50",
    element: "Fire", dosha: "Pitta", organ: "Spleen",
    life_aspect: "Power & Confidence", life_aspect_bn: "আত্মবিশ্বাস ও সমৃদ্ধি",
    nakshatra: "Shravana", color: "#F2BCCB", corner: "Dakshin Disha (Yama Sthan)",
    lord: "Yama", deity_english: "Lord of Dharma & Death", vastu_association: "Discipline, justice, restraint",
    planet: "Mars", day: "Tuesday", metal: "Copper", shape: "Triangle",
    primary_element: "Fire", self_colour: "Red, Coral, Terracotta",
    enhance_colour: "Orange, Peach, Maroon, Warm Pink", acceptable_colour: "Cream, Beige, Light Brown",
    destruct_colour: "Black, Deep Blue, Dark Navy", exhaust_colour: "Excessive White, Silver, Metallic Grey",
    art_image: "/vastu/lord_yama.png",
  },
  // 16: S4 (Center 168.75°) - GOLDEN DOOR
  {
    code: "S4", index: 16, quadrant: "S", quadrant_index: 4,
    center_deg: 168.75, start_deg: 163.125, end_deg: 174.375,
    direction16: "S", direction16_full: "South", direction8: "S",
    name: "Grihakshata", deity_bn: "গৃহক্ষত", deity_hi: "गृहक्षत",
    isGoldenDoor: true,
    entrance_challenge: "One of the strongest South entrances; brings wealth and children's welfare; competition may rise.",
    entrance_challenge_bn: "স্বর্ণদ্বার! পারিবারিক প্রতিপত্তি ও সন্তানদের সমৃদ্ধি নিশ্চিত করে।",
    entrance_rating: "excellent", entrance_rating_label: "Excellent (Golden Door)", entrance_rating_color: "#1B7F4B",
    element: "Fire", dosha: "Rajas", organ: "Stomach",
    life_aspect: "Fame & Relaxation", life_aspect_bn: "যশ, খ্যাতি ও স্বস্তি",
    nakshatra: "Dhanishta", color: "#F3C2CB", corner: "Dakshin Disha (Yama Sthan)",
    lord: "Yama", deity_english: "Lord of Dharma & Death", vastu_association: "Discipline, justice, restraint",
    planet: "Mars", day: "Tuesday", metal: "Copper", shape: "Triangle",
    primary_element: "Fire", self_colour: "Red, Coral, Terracotta",
    enhance_colour: "Orange, Peach, Maroon, Warm Pink", acceptable_colour: "Cream, Beige, Light Brown",
    destruct_colour: "Black, Deep Blue, Dark Navy", exhaust_colour: "Excessive White, Silver, Metallic Grey",
    art_image: "/vastu/lord_yama.png",
  },
  // 17: S5 (Center 180.0° - Due South)
  {
    code: "S5", index: 17, quadrant: "S", quadrant_index: 5,
    center_deg: 180.0, start_deg: 174.375, end_deg: 185.625,
    direction16: "S", direction16_full: "South", direction8: "S",
    name: "Yama", deity_bn: "যম", deity_hi: "यम",
    isGoldenDoor: false,
    entrance_challenge: "Debt, financial pressure, fear, obstacles and heaviness; legal and debt concerns.",
    entrance_challenge_bn: "ঋণগ্রস্ততা, স্বাস্থ্যসংকট ও পুলিশি বা আইনি জটিলতার ঝুঁকি।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Fire", dosha: "Rajas", organ: "Stomach",
    life_aspect: "Fame & Relaxation", life_aspect_bn: "সামাজিক অবস্থান ও প্রশান্তি",
    nakshatra: "Shatabhisha", color: "#F3C2CB", corner: "Dakshin Disha (Yama Sthan)",
    lord: "Yama", deity_english: "Lord of Dharma & Death", vastu_association: "Discipline, justice, restraint",
    planet: "Mars", day: "Tuesday", metal: "Copper", shape: "Triangle",
    primary_element: "Fire", self_colour: "Red, Coral, Terracotta",
    enhance_colour: "Orange, Peach, Maroon, Warm Pink", acceptable_colour: "Cream, Beige, Light Brown",
    destruct_colour: "Black, Deep Blue, Dark Navy", exhaust_colour: "Excessive White, Silver, Metallic Grey",
    art_image: "/vastu/lord_yama.png",
  },
  // 18: S6 (Center 191.25°)
  {
    code: "S6", index: 18, quadrant: "S", quadrant_index: 6,
    center_deg: 191.25, start_deg: 185.625, end_deg: 196.875,
    direction16: "SSW", direction16_full: "South-South-West", direction8: "S",
    name: "Gandharva", deity_bn: "গন্ধর্ব", deity_hi: "गन्धर्व",
    isGoldenDoor: false,
    entrance_challenge: "Reputation problems, instability, unnecessary expenditure, and loss of public goodwill.",
    entrance_challenge_bn: "সম্মানহানি, আর্থিক অপচয় ও অনর্থক সামাজিক অপযশ।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Earth", dosha: "Rajas", organ: "Stomach",
    life_aspect: "Disposal & Spending", life_aspect_bn: "বর্জ্য নিষ্কাশন ও অপ্রয়োজনীয় ব্যয় রোধ",
    nakshatra: "Purva Bhadrapada", color: "#F3E6A6", corner: "Dakshin Disha (Yama Sthan)",
    lord: "Yama", deity_english: "Lord of Dharma & Death", vastu_association: "Discipline, justice, restraint",
    planet: "Mars", day: "Tuesday", metal: "Copper", shape: "Square",
    primary_element: "Fire", self_colour: "Red, Coral, Terracotta",
    enhance_colour: "Orange, Peach, Maroon, Warm Pink", acceptable_colour: "Cream, Beige, Light Brown",
    destruct_colour: "Black, Deep Blue, Dark Navy", exhaust_colour: "Excessive White, Silver, Metallic Grey",
    art_image: "/vastu/lord_yama.png",
  },
  // 19: S7 (Center 202.5°)
  {
    code: "S7", index: 19, quadrant: "S", quadrant_index: 7,
    center_deg: 202.5, start_deg: 196.875, end_deg: 208.125,
    direction16: "SSW", direction16_full: "South-South-West", direction8: "SW",
    name: "Bhringraj", deity_bn: "ভৃঙ্গরাজ", deity_hi: "भृंगराज",
    isGoldenDoor: false,
    entrance_challenge: "Effort-to-result imbalance, reduced motivation, frustration and financial drainage.",
    entrance_challenge_bn: "চরম পরিশ্রমেও কাঙ্ক্ষিত সাফল্য না পাওয়া ও সঞ্চিত অর্থ ক্ষয়।",
    entrance_rating: "avoid", entrance_rating_label: "Generally Avoid", entrance_rating_color: "#D5432E",
    element: "Earth", dosha: "Rajas", organ: "Stomach",
    life_aspect: "Disposal & Spending", life_aspect_bn: "ব্যয় নিয়ন্ত্রণ",
    nakshatra: "Uttara Bhadrapada", color: "#F3E6A6", corner: "Nairitya Kon (नैऋत्य कोण)",
    lord: "Nairṛitya", deity_english: "Deity of dissolution / protection", vastu_association: "Stability, protection, containment",
    planet: "Rahu", day: "Saturday", metal: "Lead", shape: "Square",
    primary_element: "Earth", self_colour: "Beige, Sand, Cream, Earth Brown",
    enhance_colour: "Mustard, Ochre, Terracotta, Warm Yellow", acceptable_colour: "Peach, Soft Pink, Light Brown",
    destruct_colour: "Deep Blue, Black, Excessive Green", exhaust_colour: "Excessive Red, Bright Orange",
    art_image: "/vastu/lord_nairritya.png",
  },
  // 20: S8 (Center 213.75°)
  {
    code: "S8", index: 20, quadrant: "S", quadrant_index: 8,
    center_deg: 213.75, start_deg: 208.125, end_deg: 219.375,
    direction16: "SW", direction16_full: "South-West", direction8: "SW",
    name: "Mriga", deity_bn: "মৃগ", deity_hi: "मृग",
    isGoldenDoor: false,
    entrance_challenge: "Isolation, harshness, social disconnection and vitality depletion.",
    entrance_challenge_bn: "পুত্রসন্তানের দুর্বল স্বাস্থ্য ও পরিবারের শক্তি ক্ষয়।",
    entrance_rating: "avoid", entrance_rating_label: "Generally Avoid", entrance_rating_color: "#D5432E",
    element: "Earth", dosha: "Rajas", organ: "Heart",
    life_aspect: "Relationship & Skills", life_aspect_bn: "পারিবারিক সম্পর্ক ও দক্ষতা",
    nakshatra: "Revati", color: "#EFE296", corner: "Nairitya Kon (नैऋत्य कोण)",
    lord: "Nairṛitya", deity_english: "Deity of dissolution / protection", vastu_association: "Stability, protection, containment",
    planet: "Rahu", day: "Saturday", metal: "Lead", shape: "Square",
    primary_element: "Earth", self_colour: "Beige, Sand, Cream, Earth Brown",
    enhance_colour: "Mustard, Ochre, Terracotta, Warm Yellow", acceptable_colour: "Peach, Soft Pink, Light Brown",
    destruct_colour: "Deep Blue, Black, Excessive Green", exhaust_colour: "Excessive Red, Bright Orange",
    art_image: "/vastu/lord_nairritya.png",
  },
  // 21: W1 (Center 225.0°)
  {
    code: "W1", index: 21, quadrant: "W", quadrant_index: 1,
    center_deg: 225.0, start_deg: 219.375, end_deg: 230.625,
    direction16: "SW", direction16_full: "South-West", direction8: "SW",
    name: "Pitru", deity_bn: "পিতৃ (নৈঋত)", deity_hi: "पितृ",
    isGoldenDoor: false,
    entrance_challenge: "Associated with ancestral unrest, stagnation, reduced vitality and financial distress.",
    entrance_challenge_bn: "পিতৃ দোষ, আর্থিক অনটন ও পারিবারিক সম্পর্কের স্থায়ী দূরত্ব।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Earth", dosha: "Rajas", organ: "Heart",
    life_aspect: "Relationship & Skills", life_aspect_bn: "স্থায়িত্ব ও সম্পর্ক",
    nakshatra: "Ashwini", color: "#EFE296", corner: "Nairitya Kon (नैऋत्य कोण)",
    lord: "Nairṛitya", deity_english: "Deity of dissolution / protection", vastu_association: "Stability, protection, containment",
    planet: "Rahu", day: "Saturday", metal: "Lead", shape: "Square",
    primary_element: "Earth", self_colour: "Beige, Sand, Cream, Earth Brown",
    enhance_colour: "Mustard, Ochre, Terracotta, Warm Yellow", acceptable_colour: "Peach, Soft Pink, Light Brown",
    destruct_colour: "Deep Blue, Black, Excessive Green", exhaust_colour: "Excessive Red, Bright Orange",
    art_image: "/vastu/lord_nairritya.png",
  },
  // 22: W2 (Center 236.25°)
  {
    code: "W2", index: 22, quadrant: "W", quadrant_index: 2,
    center_deg: 236.25, start_deg: 230.625, end_deg: 241.875,
    direction16: "WSW", direction16_full: "West-South-West", direction8: "SW",
    name: "Dauvarika", deity_bn: "দৌবারিক", deity_hi: "दौवारिक",
    isGoldenDoor: false,
    entrance_challenge: "Career instability, insecurity and domestic mistrust / relationship distance.",
    entrance_challenge_bn: "কর্মক্ষেত্রে অস্থিরতা ও দাম্পত্য সম্পর্কে অতিরিক্ত সন্দেহ।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Earth", dosha: "Vata", organ: "Heart",
    life_aspect: "Education & Savings", life_aspect_bn: "জ্ঞানার্জন ও অর্থ সঞ্চয়",
    nakshatra: "Bharani", color: "#ECE6AE", corner: "Nairitya Kon (नैऋत्य कोण)",
    lord: "Nairṛitya", deity_english: "Deity of dissolution / protection", vastu_association: "Stability, protection, containment",
    planet: "Rahu", day: "Saturday", metal: "Lead", shape: "Square",
    primary_element: "Earth", self_colour: "Beige, Sand, Cream, Earth Brown",
    enhance_colour: "Mustard, Ochre, Terracotta, Warm Yellow", acceptable_colour: "Peach, Soft Pink, Light Brown",
    destruct_colour: "Deep Blue, Black, Excessive Green", exhaust_colour: "Excessive Red, Bright Orange",
    art_image: "/vastu/lord_nairritya.png",
  },
  // 23: W3 (Center 247.5°) - GOLDEN DOOR
  {
    code: "W3", index: 23, quadrant: "W", quadrant_index: 3,
    center_deg: 247.5, start_deg: 241.875, end_deg: 253.125,
    direction16: "WSW", direction16_full: "West-South-West", direction8: "W",
    name: "Sugriva", deity_bn: "সুগ্রীব", deity_hi: "सुग्रीव",
    isGoldenDoor: true,
    entrance_challenge: "Strong West entrance; supports fast wealth, expansion, and dependable allies.",
    entrance_challenge_bn: "স্বর্ণদ্বার! দ্রুত বস্তুগত সমৃদ্ধি ও নির্ভরযোগ্য মিত্রলাভ নিশ্চিত করে।",
    entrance_rating: "good", entrance_rating_label: "Good (Golden Door)", entrance_rating_color: "#4CAF50",
    element: "Earth", dosha: "Vata", organ: "Heart",
    life_aspect: "Education & Savings", life_aspect_bn: "বিদ্যা ও সঞ্চিত সম্পদ",
    nakshatra: "Krittika", color: "#ECE6AE", corner: "Paschim Disha (Varuna Sthan)",
    lord: "Varuna", deity_english: "Lord of Cosmic Waters", vastu_association: "Water, depth, law, flow",
    planet: "Saturn", day: "Saturday", metal: "Stainless Steel", shape: "Circle / Rectangle",
    primary_element: "Metal", self_colour: "White, Off-White, Silver",
    enhance_colour: "Light Grey, Metallic, Cream", acceptable_colour: "Beige, Soft Blue",
    destruct_colour: "Strong Red, Bright Orange", exhaust_colour: "Excessive Green, Deep Brown",
    art_image: "/vastu/lord_varuna.png",
  },
  // 24: W4 (Center 258.75°) - GOLDEN DOOR
  {
    code: "W4", index: 24, quadrant: "W", quadrant_index: 4,
    center_deg: 258.75, start_deg: 253.125, end_deg: 264.375,
    direction16: "W", direction16_full: "West", direction8: "W",
    name: "Pushpadanta", deity_bn: "পুষ্পদন্ত", deity_hi: "पुष्पदंत",
    isGoldenDoor: true,
    entrance_challenge: "Auspicious entrance; secures lasting wealth, social prestige and children's prosperity.",
    entrance_challenge_bn: "স্বর্ণদ্বার! অটল ধনসম্পদ, সামাজিক প্রতিপত্তি ও কন্যা সন্তানের সৌভাগ্য।",
    entrance_rating: "excellent", entrance_rating_label: "Excellent (Golden Door)", entrance_rating_color: "#1B7F4B",
    element: "Air", dosha: "Vata", organ: "Large Intestine",
    life_aspect: "Gains & Fulfillment", life_aspect_bn: "লাভ, সমৃদ্ধি ও ইচ্ছা পূরণ",
    nakshatra: "Rohini", color: "#DDCFEC", corner: "Paschim Disha (Varuna Sthan)",
    lord: "Varuna", deity_english: "Lord of Cosmic Waters", vastu_association: "Water, depth, law, flow",
    planet: "Saturn", day: "Saturday", metal: "Stainless Steel", shape: "Circle / Rectangle",
    primary_element: "Metal", self_colour: "White, Off-White, Silver",
    enhance_colour: "Light Grey, Metallic, Cream", acceptable_colour: "Beige, Soft Blue",
    destruct_colour: "Strong Red, Bright Orange", exhaust_colour: "Excessive Green, Deep Brown",
    art_image: "/vastu/lord_varuna.png",
  },
  // 25: W5 (Center 270.0° - Due West)
  {
    code: "W5", index: 25, quadrant: "W", quadrant_index: 5,
    center_deg: 270.0, start_deg: 264.375, end_deg: 275.625,
    direction16: "W", direction16_full: "West", direction8: "W",
    name: "Varuna", deity_bn: "বরুণ", deity_hi: "वरुण",
    isGoldenDoor: false,
    entrance_challenge: "Financial opportunities but also over-ambition, high expectations and perfectionism.",
    entrance_challenge_bn: "আকাঙ্ক্ষার অপূর্ণতা, প্রত্যাশার চাপ ও মানসিক হতাশার ঝুঁকি।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Air", dosha: "Vata", organ: "Large Intestine",
    life_aspect: "Gains & Fulfillment", life_aspect_bn: "ব্যবসায়িক লাভ ও সাফল্য",
    nakshatra: "Mrigashira", color: "#DDCFEC", corner: "Paschim Disha (Varuna Sthan)",
    lord: "Varuna", deity_english: "Lord of Cosmic Waters", vastu_association: "Water, depth, law, flow",
    planet: "Saturn", day: "Saturday", metal: "Stainless Steel", shape: "Circle / Rectangle",
    primary_element: "Metal", self_colour: "White, Off-White, Silver",
    enhance_colour: "Light Grey, Metallic, Cream", acceptable_colour: "Beige, Soft Blue",
    destruct_colour: "Strong Red, Bright Orange", exhaust_colour: "Excessive Green, Deep Brown",
    art_image: "/vastu/lord_varuna.png",
  },
  // 26: W6 (Center 281.25°)
  {
    code: "W6", index: 26, quadrant: "W", quadrant_index: 6,
    center_deg: 281.25, start_deg: 275.625, end_deg: 286.875,
    direction16: "WNW", direction16_full: "West-North-West", direction8: "W",
    name: "Asura", deity_bn: "অসুর", deity_hi: "असुर",
    isGoldenDoor: false,
    entrance_challenge: "Mental pressure, authority/government complications and tax-related notices.",
    entrance_challenge_bn: "সরকারি আইনি জটিলতা, নোটিশ ও কর্তৃপক্ষের সাথে বিরোধ।",
    entrance_rating: "conditional", entrance_rating_label: "Conditional", entrance_rating_color: "#E7B416",
    element: "Air", dosha: "Vata", organ: "Colon",
    life_aspect: "Depression & Detox", life_aspect_bn: "বিষণ্নতা মুক্তি ও মানসিক পরিচ্ছন্নতা",
    nakshatra: "Ardra", color: "#D9C8E9", corner: "Paschim Disha (Varuna Sthan)",
    lord: "Varuna", deity_english: "Lord of Cosmic Waters", vastu_association: "Water, depth, law, flow",
    planet: "Saturn", day: "Saturday", metal: "Stainless Steel", shape: "Circle / Rectangle",
    primary_element: "Metal", self_colour: "White, Off-White, Silver",
    enhance_colour: "Light Grey, Metallic, Cream", acceptable_colour: "Beige, Soft Blue",
    destruct_colour: "Strong Red, Bright Orange", exhaust_colour: "Excessive Green, Deep Brown",
    art_image: "/vastu/lord_varuna.png",
  },
  // 27: W7 (Center 292.5°)
  {
    code: "W7", index: 27, quadrant: "W", quadrant_index: 7,
    center_deg: 292.5, start_deg: 286.875, end_deg: 298.125,
    direction16: "WNW", direction16_full: "West-North-West", direction8: "NW",
    name: "Shosha", deity_bn: "শোষ", deity_hi: "शोष",
    isGoldenDoor: false,
    entrance_challenge: "Physical weakness, chronic fatigue, depressive thoughts and financial drainage.",
    entrance_challenge_bn: "শারীরিক দুর্বলতা, বিষণ্নতা ও জীবনীশক্তির অবক্ষয়।",
    entrance_rating: "avoid", entrance_rating_label: "Generally Avoid", entrance_rating_color: "#D5432E",
    element: "Air", dosha: "Vata", organ: "Colon",
    life_aspect: "Depression & Detox", life_aspect_bn: "মনোভাবের ভারসাম্য",
    nakshatra: "Punarvasu", color: "#D9C8E9", corner: "Vayavya Kon (वायव्य कोण / Air Corner)",
    lord: "Vaayu / Vayavya Kon", deity_english: "God of Wind", vastu_association: "Movement, circulation, change",
    planet: "Moon", day: "Monday", metal: "Silver", shape: "Circle / Rectangle",
    primary_element: "Air / Metal", self_colour: "White, Light Grey",
    enhance_colour: "Silver, Cream, Very Light Blue", acceptable_colour: "Beige, Soft Green",
    destruct_colour: "Deep Red, Dark Orange", exhaust_colour: "Excessive Black, Heavy Brown, Deep Green",
    art_image: "/vastu/lord_vaayu.png",
  },
  // 28: W8 (Center 303.75°)
  {
    code: "W8", index: 28, quadrant: "W", quadrant_index: 8,
    center_deg: 303.75, start_deg: 298.125, end_deg: 309.375,
    direction16: "NW", direction16_full: "North-West", direction8: "NW",
    name: "Papyakshma", deity_bn: "পাপযক্ষ্মা", deity_hi: "पापयक्ष्मा",
    isGoldenDoor: false,
    entrance_challenge: "Unethical temptations, separation, secret ailments and legal complications.",
    entrance_challenge_bn: "অসৎ প্রবৃত্তি, আইনি বিতর্ক ও সামাজিক কলঙ্কের ঝুঁকি।",
    entrance_rating: "avoid", entrance_rating_label: "Generally Avoid", entrance_rating_color: "#D5432E",
    element: "Air", dosha: "Vata", organ: "Intestine",
    life_aspect: "Bank & Support", life_aspect_bn: "ব্যাংকিং ও সার্বিক সহায়তা",
    nakshatra: "Pushya", color: "#ECE0C6", corner: "Vayavya Kon (वायव्य कोण / Air Corner)",
    lord: "Vaayu / Vayavya Kon", deity_english: "God of Wind", vastu_association: "Movement, circulation, change",
    planet: "Moon", day: "Monday", metal: "Silver", shape: "Circle / Rectangle",
    primary_element: "Air / Metal", self_colour: "White, Light Grey",
    enhance_colour: "Silver, Cream, Very Light Blue", acceptable_colour: "Beige, Soft Green",
    destruct_colour: "Deep Red, Dark Orange", exhaust_colour: "Excessive Black, Heavy Brown, Deep Green",
    art_image: "/vastu/lord_vaayu.png",
  },
  // 29: N1 (Center 315.0°)
  {
    code: "N1", index: 29, quadrant: "N", quadrant_index: 1,
    center_deg: 315.0, start_deg: 309.375, end_deg: 320.625,
    direction16: "NW", direction16_full: "North-West", direction8: "NW",
    name: "Roga", deity_bn: "রোগ", deity_hi: "रोग",
    isGoldenDoor: false,
    entrance_challenge: "Health-related difficulties, negative thoughts, jealousy and lowered vitality.",
    entrance_challenge_bn: "দীর্ঘস্থায়ী অসুস্থতা, ঈর্ষা ও শত্রুভীতি বৃদ্ধি পায়।",
    entrance_rating: "avoid", entrance_rating_label: "Generally Avoid", entrance_rating_color: "#D5432E",
    element: "Air", dosha: "Vata", organ: "Intestine",
    life_aspect: "Bank & Support", life_aspect_bn: "সহযোগিতা ও সমর্থন",
    nakshatra: "Ashlesha", color: "#ECE0C6", corner: "Vayavya Kon (वायव्य कोण / Air Corner)",
    lord: "Vaayu / Vayavya Kon", deity_english: "God of Wind", vastu_association: "Movement, circulation, change",
    planet: "Moon", day: "Monday", metal: "Silver", shape: "Circle / Rectangle",
    primary_element: "Air / Metal", self_colour: "White, Light Grey",
    enhance_colour: "Silver, Cream, Very Light Blue", acceptable_colour: "Beige, Soft Green",
    destruct_colour: "Deep Red, Dark Orange", exhaust_colour: "Excessive Black, Heavy Brown, Deep Green",
    art_image: "/vastu/lord_vaayu.png",
  },
  // 30: N2 (Center 326.25°)
  {
    code: "N2", index: 30, quadrant: "N", quadrant_index: 2,
    center_deg: 326.25, start_deg: 320.625, end_deg: 331.875,
    direction16: "NNW", direction16_full: "North-North-West", direction8: "NW",
    name: "Naga", deity_bn: "নাগ", deity_hi: "नाग",
    isGoldenDoor: false,
    entrance_challenge: "Fear, suspicion, domestic opposition and friction with relatives.",
    entrance_challenge_bn: "উদ্বেগ, আত্মীয়দের সাথে বৈরিতা ও মানসিক অস্থিরতা।",
    entrance_rating: "challenging", entrance_rating_label: "Challenging", entrance_rating_color: "#F2711C",
    element: "Water", dosha: "Kapha", organ: "Bladder",
    life_aspect: "Sex & Attraction", life_aspect_bn: "আকর্ষণ ও সম্পর্কের টান",
    nakshatra: "Magha", color: "#D0E6EC", corner: "Vayavya Kon (वायव्य कोण / Air Corner)",
    lord: "Vaayu / Vayavya Kon", deity_english: "God of Wind", vastu_association: "Movement, circulation, change",
    planet: "Moon", day: "Monday", metal: "Silver", shape: "Wave / Rectangle",
    primary_element: "Air / Metal", self_colour: "White, Light Grey",
    enhance_colour: "Silver, Cream, Very Light Blue", acceptable_colour: "Beige, Soft Green",
    destruct_colour: "Deep Red, Dark Orange", exhaust_colour: "Excessive Black, Heavy Brown, Deep Green",
    art_image: "/vastu/lord_vaayu.png",
  },
  // 31: N3 (Center 337.5°) - GOLDEN DOOR
  {
    code: "N3", index: 31, quadrant: "N", quadrant_index: 3,
    center_deg: 337.5, start_deg: 331.875, end_deg: 343.125,
    direction16: "NNW", direction16_full: "North-North-West", direction8: "N",
    name: "Mukhya", deity_bn: "মুখ্য", deity_hi: "मुख्य",
    isGoldenDoor: true,
    entrance_challenge: "One of the strongest North positions; unlocks vast wealth and commercial prosperity.",
    entrance_challenge_bn: "স্বর্ণদ্বার! বিপুল ধনলাভ, বাণিজ্যিক সমৃদ্ধি ও নতুন অর্থপ্রবাহের পথ উন্মোচন।",
    entrance_rating: "excellent", entrance_rating_label: "Excellent (Golden Door)", entrance_rating_color: "#1B7F4B",
    element: "Water", dosha: "Kapha", organ: "Bladder",
    life_aspect: "Sex & Attraction", life_aspect_bn: "সম্মোহন ও সমৃদ্ধি",
    nakshatra: "Purva Phalguni", color: "#D0E6EC", corner: "Uttar Disha (Kubera Sthan)",
    lord: "Kubera", deity_english: "Lord of Wealth", vastu_association: "Wealth, finance, abundance",
    planet: "Mercury", day: "Wednesday", metal: "Brass", shape: "Wave / Rectangle",
    primary_element: "Water", self_colour: "Light Blue, Aqua",
    enhance_colour: "Sea Green, Mint, Blue-Green", acceptable_colour: "White, Silver, Light Grey",
    destruct_colour: "Strong Red, Deep Orange", exhaust_colour: "Excessive Yellow, Mustard, Heavy Brown",
    art_image: "/vastu/lord_kubera.png",
  },
  // 32: N4 (Center 348.75°) - GOLDEN DOOR
  {
    code: "N4", index: 32, quadrant: "N", quadrant_index: 4,
    center_deg: 348.75, start_deg: 343.125, end_deg: 354.375,
    direction16: "N", direction16_full: "North", direction8: "N",
    name: "Bhallata", deity_bn: "ভল্লাট", deity_hi: "भल्लाट",
    isGoldenDoor: true,
    entrance_challenge: "Strong prosperity potential; ancestral assets, steady wealth and monumental accumulation.",
    entrance_challenge_bn: "স্বর্ণদ্বার! পূর্বপুরুষের সম্পত্তি লাভ, প্রচুর সঞ্চয় ও অক্ষয় ঐশ্বর্য।",
    entrance_rating: "excellent", entrance_rating_label: "Excellent (Golden Door)", entrance_rating_color: "#1B7F4B",
    element: "Water", dosha: "Kapha", organ: "Kidney",
    life_aspect: "Money & Opportunities", life_aspect_bn: "স্থায়ী সম্পত্তি ও আর্থিক স্থায়িত্ব",
    nakshatra: "Uttara Phalguni", color: "#CFE8F5", corner: "Uttar Disha (Kubera Sthan)",
    lord: "Kubera", deity_english: "Lord of Wealth", vastu_association: "Wealth, finance, abundance",
    planet: "Mercury", day: "Wednesday", metal: "Brass", shape: "Wave / Rectangle",
    primary_element: "Water", self_colour: "Light Blue, Aqua",
    enhance_colour: "Sea Green, Mint, Blue-Green", acceptable_colour: "White, Silver, Light Grey",
    destruct_colour: "Strong Red, Deep Orange", exhaust_colour: "Excessive Yellow, Mustard, Heavy Brown",
    art_image: "/vastu/lord_kubera.png",
  },
];

// ---------------------------------------------------------------------------
// 38 Vastu Categories with Exact Best and Avoid Directions
// ---------------------------------------------------------------------------
export interface VastuCategory {
  slug: string;
  name: string;
  name_bn: string;
  name_hi: string;
  category_group: "architecture" | "objects";
  icon: string;
  best_directions: string[];
  avoid_directions: string[];
  benefit: string;
  benefit_bn: string;
  remedy: string;
  remedy_bn: string;
}

export const VASTU_CATEGORIES: VastuCategory[] = [
  {
    slug: "main-entrance", name: "Main Entrance", name_bn: "মূল প্রবেশদ্বার", name_hi: "मुख्य द्वार",
    category_group: "architecture", icon: "🚪",
    best_directions: ["N", "NNE", "NE", "ENE", "E"],
    avoid_directions: ["SSW", "SW", "WSW", "S", "WNW"],
    benefit: "Money, career opportunities and overall family prosperity.",
    benefit_bn: "ধনপ্রাপ্তি, কর্মের নতুন দ্বার উন্মোচন ও সার্বিক সুখ-সমৃদ্ধি।",
    remedy: "Install a brass Swastik or silver wire frame at the threshold; keep the entrance brightly lit.",
    remedy_bn: "চৌকাঠে রূপার তার বা পিতলের স্বস্তিক স্থাপন করুন এবং সর্বদা আলোকিত রাখুন।",
  },
  {
    slug: "bedroom", name: "Master Bedroom", name_bn: "মাস্টার বেডরুম", name_hi: "मास्टर बेडरूम",
    category_group: "architecture", icon: "🛏️",
    best_directions: ["SW", "SSW", "S"],
    avoid_directions: ["NE", "ENE", "SE", "NW"],
    benefit: "Marital stability, sound restorative sleep and commanding authority.",
    benefit_bn: "দাম্পত্য মধুরতা, সুগভীর ঘুম ও পরিবারের নেতৃত্বের স্থায়িত্ব।",
    remedy: "Sleep with head pointing South; add earth-element tones (beige/terracotta) in SW.",
    remedy_bn: "দক্ষিণে মাথা রেখে ঘুমান এবং ঘরে হালকা বাদামী বা মাটির রঙ ব্যবহার করুন।",
  },
  {
    slug: "kitchen", name: "Kitchen / Stove", name_bn: "রান্নাঘর / গ্যাসের চুলা", name_hi: "रसोई घर / गैस चूल्हा",
    category_group: "architecture", icon: "🍳",
    best_directions: ["SE", "SSE"],
    avoid_directions: ["NE", "N", "SW", "WSW"],
    benefit: "Health, vigorous digestion and cash liquidity / fire energy.",
    benefit_bn: "উত্তম স্বাস্থ্য, সুপাচ্য হজমশক্তি ও ঘরে নগদ অর্থপ্রবাহ।",
    remedy: "Face East while cooking; keep the gas burner isolated from water taps; use green/yellow slab.",
    remedy_bn: "পূর্বমুখী হয়ে রান্না করুন; ভুল জোনে চুলার নিচে সবুজ মার্বেল বা ব্রাস প্লেট দিন।",
  },
  {
    slug: "toilet", name: "Toilet / Commode", name_bn: "টয়লেট / কমোড", name_hi: "शौचालय / कमोड",
    category_group: "architecture", icon: "🚽",
    best_directions: ["SSW", "WNW", "NW"],
    avoid_directions: ["NE", "N", "E", "SW", "SE"],
    benefit: "Proper disposal of toxins and negative mental waste.",
    benefit_bn: "নেতিবাচক শক্তির সঠিক নির্গমন ও সুস্থ মানসিকতা।",
    remedy: "Keep lid closed; install a 3-4mm metal strip (Copper in SE, Brass in S/SW, Aluminum in N/NE) around commode.",
    remedy_bn: "কমোডের চারপাশে ৩-৪ মিমি ধাতব স্ট্রিপ (ব্রাস/কপার/অ্যালুমিনিয়াম) সিল করুন ও কাচের পাত্রে সামুদ্রিক লবণ রাখুন।",
  },
  {
    slug: "temple", name: "Puja Room / Temple", name_bn: "পূজা ঘর / মন্দির", name_hi: "पूजा घर / मंदिर",
    category_group: "architecture", icon: "🪔",
    best_directions: ["NE", "NNE", "N", "E"],
    avoid_directions: ["S", "SSW", "SW", "WNW"],
    benefit: "Divine grace, spiritual clarity, wisdom and positive vibration.",
    benefit_bn: "ঈশ্বরীয় কৃপা, প্রজ্ঞা, মানসিক শান্তি ও আধ্যাত্মিক একাগ্রতা।",
    remedy: "Face East or North while praying; use white marble, light yellow or off-white decor.",
    remedy_bn: "প্রার্থনার সময় পূর্ব বা উত্তরমুখী হন; সাদা, হলুদ বা হালকা ক্রিম রঙ ব্যবহার করুন।",
  },
  {
    slug: "safe-locker", name: "Safe / Cash Locker", name_bn: "টাকার সিন্দুক / লকার", name_hi: "तिजोरी / लॉकर",
    category_group: "objects", icon: "💰",
    best_directions: ["N", "SW", "W"],
    avoid_directions: ["SE", "SSW", "WNW", "NE"],
    benefit: "Continuous wealth accumulation and protection of savings.",
    benefit_bn: "সঞ্চিত সম্পদের প্রবৃদ্ধি ও আর্থিক অপচয় রোধ।",
    remedy: "Place locker against the South wall opening toward the North; wrap cash in red cloth.",
    remedy_bn: "সিন্দুকটি এমনভাবে রাখুন যেন তার পাল্লা উত্তর বা পূর্ব দিকে খোলে।",
  },
  {
    slug: "borewell", name: "Borewell / Underground Tank", name_bn: "আন্ডারগ্রাউন্ড ওয়াটার / বোরওয়েল", name_hi: "भूमिगत जल स्रोत",
    category_group: "architecture", icon: "💧",
    best_directions: ["NE", "NNE", "N", "ENE"],
    avoid_directions: ["SE", "SSE", "S", "SW", "WSW"],
    benefit: "Abundant prosperity, mental tranquility and health vitality.",
    benefit_bn: "অপ্রতিরোধ্য সমৃদ্ধি, মানসিক শান্তি ও সুস্থ জীবনীশক্তি।",
    remedy: "Borewell in SW/SE creates severe defect; install non-demolition blocking and keep covered.",
    remedy_bn: "দক্ষিণ বা অগ্নিকোণে জলের গর্ত থাকলে অবিলম্বে ড্রেনেজ সংশোধন করুন ও কপার থেরাপি করুন।",
  },
  {
    slug: "water-tank", name: "Overhead Water Tank", name_bn: "ছাদের জলের ট্যাঙ্ক", name_hi: "छत की पानी टंकी",
    category_group: "objects", icon: "🚰",
    best_directions: ["W", "WSW", "SW", "S"],
    avoid_directions: ["NE", "N", "ENE", "E"],
    benefit: "Stable weight on the correct zone, protecting prosperity.",
    benefit_bn: "ভারসাম্যপূর্ণ ওজন ও পারিবারিক স্থিতিশীলতা।",
    remedy: "Paint the tank yellow or light cream in SW/W; never place heavy tank directly in NE.",
    remedy_bn: "ট্যাঙ্কটি হলুদ বা হালকা রঙ করুন; ঈশানে থাকলে অবিলম্বে স্থান পরিবর্তন করুন।",
  },
  {
    slug: "study-room", name: "Study Room / Desk", name_bn: "পড়ার ঘর / টেবিল", name_hi: "अध्ययन कक्ष / टेबल",
    category_group: "architecture", icon: "📚",
    best_directions: ["WSW", "NE", "E", "N"],
    avoid_directions: ["SSW", "WNW", "SE", "S"],
    benefit: "Razor-sharp concentration, academic retention and exam success.",
    benefit_bn: "তীক্ষ্ণ স্মৃতিশক্তি, পড়াশোনায় একাগ্রতা ও পরীক্ষায় সাফল্য।",
    remedy: "Sit facing East or North; place Saraswati Yantra or yellow stationery on the desk.",
    remedy_bn: "পড়ার সময় উত্তর বা পূর্ব দিকে মুখ করুন; টেবিলে সরস্বতী যন্ত্র স্থাপন করুন।",
  },
  {
    slug: "living-room", name: "Living / Drawing Room", name_bn: "লিভিং / ড্রয়িং রুম", name_hi: "लिविंग / बैठक कक्ष",
    category_group: "architecture", icon: "🛋️",
    best_directions: ["N", "E", "NE", "ENE", "NW"],
    avoid_directions: ["SW", "SSW"],
    benefit: "Warm social networking, guest hospitality and household harmony.",
    benefit_bn: "সৌহার্দ্যপূর্ণ সামাজিক সম্পর্ক ও পরিবারে ইতিবাচক মেলবন্ধন।",
    remedy: "Keep center (Brahmasthan) open and clean; heavier sofa sets in South or West.",
    remedy_bn: "ভারী সোফা দক্ষিণ বা পশ্চিম দেওয়াল ঘেঁষে রাখুন; ঘরের মধ্যভাগ ফাঁকা রাখুন।",
  },
  {
    slug: "dining-hall", name: "Dining Hall", name_bn: "ডাইনিং হল", name_hi: "भोजन कक्ष",
    category_group: "architecture", icon: "🍽️",
    best_directions: ["W", "E", "S"],
    avoid_directions: ["NE", "SW", "SSW"],
    benefit: "Family nourishment, healthy bonding and cheerful appetite.",
    benefit_bn: "পুষ্টিকর খাদ্যাভ্যাস ও পরিবারের সদস্যদের মধ্যে আন্তরিক বন্ধন।",
    remedy: "Sit facing East or North while eating; hang fruit or greenery artwork.",
    remedy_bn: "আহার গ্রহণের সময় পূর্ব বা উত্তরমুখী হন; দেওয়ালে সুদৃশ্য ফলের ছবি টাঙান।",
  },
  {
    slug: "kids-room", name: "Kids Room", name_bn: "বাচ্চাদের ঘর", name_hi: "बच्चों का कमरा",
    category_group: "architecture", icon: "🧒",
    best_directions: ["W", "NW", "E", "NE"],
    avoid_directions: ["SW", "SE", "SSW"],
    benefit: "Creative growth, emotional balance and playful intelligence.",
    benefit_bn: "সৃজনশীল মানসিক বিকাশ ও প্রফুল্ল স্বাস্থ্য।",
    remedy: "Let children sleep with head toward East; use cheerful pastel colors.",
    remedy_bn: "বাচ্চাদের মাথা পূর্ব দিকে রেখে শোয়ান; ঘরে হালকা সবুজ বা আসমানী রঙ দিন।",
  },
  {
    slug: "store-room", name: "Store Room", name_bn: "স্টোর রুম", name_hi: "भंडार कक्ष",
    category_group: "architecture", icon: "📦",
    best_directions: ["SW", "S", "W"],
    avoid_directions: ["NE", "NNE", "ENE", "E"],
    benefit: "Orderly storage without heavy stagnating energy.",
    benefit_bn: "শৃঙ্খলাবদ্ধ সঞ্চয় ও সামগ্রিক স্থায়িত্ব।",
    remedy: "Keep heavy items on South and West racks; never store clutter in NE.",
    remedy_bn: "ভারী মালামাল দক্ষিণ-পশ্চিম কোণে রাখুন; উত্তর-পূর্ব কোণ সম্পূর্ণ ফাঁকা রাখুন।",
  },
  {
    slug: "staircase", name: "Staircase", name_bn: "সিঁড়ি", name_hi: "सीढ़ियाँ",
    category_group: "architecture", icon: "🪜",
    best_directions: ["S", "SW", "W", "NW"],
    avoid_directions: ["NE", "N", "E"],
    benefit: "Steady step-by-step progress without weighing down energy centers.",
    benefit_bn: "ধাপে ধাপে উন্নতি ও গৃহের ইতিবাচক শক্তির অবাধ সঞ্চালন।",
    remedy: "Never build the staircase through the Brahmasthan, the centre of the plot. Climb stairs clockwise, and never place a toilet or puja under the staircase.",
    remedy_bn: "গৃহের কেন্দ্রস্থল (ব্রহ্মস্থান) দিয়ে কখনও সিঁড়ি করবেন না। সিঁড়ি ঘড়ির কাঁটার দিকে ঘোরান; সিঁড়ির নিচে টয়লেট বা মন্দির করবেন না।",
  },
  {
    slug: "dustbin", name: "Dustbin / Trash Can", name_bn: "ডাস্টবিন / ময়লার ঝুড়ি", name_hi: "कूड़ेदान",
    category_group: "objects", icon: "🗑️",
    best_directions: ["SSW", "WNW", "S"],
    avoid_directions: ["NE", "N", "E", "SE", "SW"],
    benefit: "Effortless disposal of negative energy and household waste.",
    benefit_bn: "নেতিবাচক আবর্জনা সহজে নিষ্কাশন ও সুস্থ পরিবেশ।",
    remedy: "Use a covered bin; empty daily; never keep trash in NE, N or temple area.",
    remedy_bn: "সবসময় ঢাকনাযুক্ত ডাস্টবিন ব্যবহার করুন এবং প্রতিদিন পরিষ্কার রাখুন।",
  },
  {
    slug: "washing-area", name: "Washing Area", name_bn: "ওয়াশিং এরিয়া / লন্ড্রি", name_hi: "धुलाई क्षेत्र",
    category_group: "architecture", icon: "🧺",
    best_directions: ["NW", "W", "SE"],
    avoid_directions: ["NE", "SW"],
    benefit: "Smooth daily cleanliness routines and mental clarity.",
    benefit_bn: "দৈনন্দিন কাজের গতি ও পারিবারিক পরিষ্কার-পরিচ্ছন্নতা।",
    remedy: "Ensure drain slope points toward North or East; keep area dry.",
    remedy_bn: "জলের ঢাল উত্তর বা পূর্ব দিকে রাখুন এবং মেঝে শুকনো রাখুন।",
  },
  {
    slug: "septic-tank", name: "Septic Tank", name_bn: "সেপটিক ট্যাঙ্ক", name_hi: "सेप्टिक टैंक",
    category_group: "architecture", icon: "🕳️",
    best_directions: ["SSW", "WNW", "NW"],
    avoid_directions: ["NE", "N", "E", "SE", "SW"],
    benefit: "Safe drainage of waste without destroying vital energy grids.",
    benefit_bn: "দূষিত জলের নিরাপদ নিষ্কাশন ও বাস্তুর মূল শক্তি অক্ষুণ্ণ রাখা।",
    remedy: "Septic tank in NE/SW is fatal; install non-demolition copper/brass isolation strips.",
    remedy_bn: "ঈশানে সেপটিক ট্যাঙ্ক থাকলে অবিলম্বে কপার থেরাপির মাধ্যমে বাস্তু দোষ নিবারণ করুন।",
  },
  {
    slug: "inverter", name: "Inverter / Power Backup", name_bn: "ইনভার্টার / ব্যাটারি", name_hi: "इन्वर्टर / बैटरी",
    category_group: "objects", icon: "⚡",
    best_directions: ["SE", "SSE", "S", "NW"],
    avoid_directions: ["NE", "N", "SW"],
    benefit: "Reliable power backup and fire-element harmonic balance.",
    benefit_bn: "অগ্নি তত্ত্বের সঠিক ভারসাম্য ও নিরবচ্ছিন্ন বিদ্যুৎ সংযোগ।",
    remedy: "Keep batteries elevated on a stand in SE; keep off NE.",
    remedy_bn: "ইনভার্টার অগ্নিকোণে রাখুন এবং উত্তর-পূর্ব থেকে দূরে রাখুন।",
  },
  {
    slug: "heater", name: "Water Heater / Geyser", name_bn: "গিজার / ওয়াটার হিটার", name_hi: "गीजर / हीटर",
    category_group: "objects", icon: "🔥",
    best_directions: ["SE", "SSE", "S"],
    avoid_directions: ["NE", "N", "NW"],
    benefit: "Fire element vitality and swift hot water delivery.",
    benefit_bn: "অগ্নিশক্তির সঠিক সঞ্চালন ও ঘরে প্রাণবন্ত ভাব।",
    remedy: "Mount geyser on South or East wall of bathroom; avoid North wall.",
    remedy_bn: "বাথরুমের দক্ষিণ বা পূর্ব দেওয়ালে গিজার স্থাপন করুন।",
  },
  {
    slug: "ac", name: "Air Conditioner (AC)", name_bn: "এয়ার কন্ডিশনার (AC)", name_hi: "एयर कंडीशनर",
    category_group: "objects", icon: "❄️",
    best_directions: ["W", "NW", "N"],
    avoid_directions: ["SE", "SW"],
    benefit: "Cool comfort, balanced airflow and restful environment.",
    benefit_bn: "আরামদায়ক শীতলতা ও বিশুদ্ধ বায়ুর প্রবাহ।",
    remedy: "Mount indoor unit on North or West wall; keep outdoor unit in NW/SE.",
    remedy_bn: "উত্তর বা পশ্চিম দেওয়ালে এসি স্থাপন করুন; আগ্নেয় কোণ এড়িয়ে চলুন।",
  },
  {
    slug: "refrigerator-freezer", name: "Refrigerator / Fridge", name_bn: "রেফ্রিজারেটর / ফ্রিজ", name_hi: "फ्रिज",
    category_group: "objects", icon: "🧊",
    best_directions: ["SE", "W", "NW", "S"],
    avoid_directions: ["NE", "SW"],
    benefit: "Fresh nourishment preservation and balanced thermodynamic energy.",
    benefit_bn: "খাদ্যদ্রব্যের তাজা ভাব বজায় থাকা ও ইতিবাচক এনার্জি।",
    remedy: "Keep fridge a few inches off the wall; avoid opening directly facing stove.",
    remedy_bn: "ফ্রিজের দরজা যেন চুলার মুখোমুখি না হয় সেদিকে খেয়াল রাখুন।",
  },
  {
    slug: "television-music-system", name: "TV / Music System", name_bn: "টিভি / সাউন্ড সিস্টেম", name_hi: "टीवी / म्यूजिक सिस्टम",
    category_group: "objects", icon: "📺",
    best_directions: ["ENE", "E", "SE", "N"],
    avoid_directions: ["SW", "SSW"],
    benefit: "Joyful family entertainment, constructive news and positive energy.",
    benefit_bn: "পারিবারিক আনন্দ-বিনোদন ও ইতিবাচক তথ্যের আদান-প্রদান।",
    remedy: "Place on East or North wall; screen should face West/South.",
    remedy_bn: "টিভি পূর্ব বা উত্তর দেওয়ালে স্থাপন করুন।",
  },
  {
    slug: "office-room", name: "Home Office / Workstation", name_bn: "হোম অফিস / কাজের ডেস্ক", name_hi: "कार्य कक्ष / वर्कस्टेशन",
    category_group: "architecture", icon: "💻",
    best_directions: ["N", "NE", "W", "SW"],
    avoid_directions: ["SSW", "WNW", "SE"],
    benefit: "Lucrative business deals, sharp intellect and career promotions.",
    benefit_bn: "বাণিজ্যিক চুক্তি স্বাক্ষর, তীক্ষ্ণ মেধা ও কর্মজীবনে দ্রুত পদোন্নতি।",
    remedy: "Sit with solid wall behind back facing North or East; keep desk clutter-free.",
    remedy_bn: "পেছনে শক্ত দেওয়াল রেখে উত্তর বা পূর্বমুখী হয়ে বসুন।",
  },
  {
    slug: "wardrobe", name: "Wardrobe / Clothes Almirah", name_bn: "আলমারি / ওয়ারড্রোব", name_hi: "अलमारी",
    category_group: "objects", icon: "👗",
    best_directions: ["SW", "S", "W"],
    avoid_directions: ["NE", "ENE", "N"],
    benefit: "Heavy grounding weight in South/West providing household stability.",
    benefit_bn: "ভারসাম্যপূর্ণ স্থিতিশীলতা ও পারিবারিক সুরক্ষা।",
    remedy: "Place against South or West wall so doors open toward North or East.",
    remedy_bn: "দক্ষিণ বা পশ্চিম দেওয়াল ঘেঁষে রাখুন যেন পাল্লা উত্তর বা পূর্বে খোলে।",
  },
  {
    slug: "dressing-table", name: "Dressing Table / Mirror", name_bn: "ড্রেসিং টেবিল / আয়না", name_hi: "ड्रेसिंग टेबल / दर्पण",
    category_group: "objects", icon: "🪞",
    best_directions: ["N", "E", "NNW"],
    avoid_directions: ["S", "SW", "SE"],
    benefit: "Personal grooming, visual expansion of wealth and positive reflection.",
    benefit_bn: "সৌন্দর্য বৃদ্ধি ও অর্থের ইতিবাচক প্রতিফলন।",
    remedy: "Mirror should reflect North or East; never reflect the bed while sleeping.",
    remedy_bn: "ঘুমানোর সময় যেন বিছানার প্রতিফলন আয়নায় না দেখা যায়।",
  },
  {
    slug: "guest-room", name: "Guest Room", name_bn: "গেস্ট রুম / অতিথিশালা", name_hi: "अतिथि कक्ष",
    category_group: "architecture", icon: "🧳",
    best_directions: ["NW", "W"],
    avoid_directions: ["SW", "NE"],
    benefit: "Cordially pleasant visits and harmonious guest relations.",
    benefit_bn: "অতিথিদের সাথে চমৎকার সম্পর্ক ও আনন্দময় আতিথেয়তা।",
    remedy: "Do not provide guest bedroom in master SW zone (preserves owner's authority).",
    remedy_bn: "দক্ষিণ-পশ্চিমে গেস্ট রুম করবেন না; উত্তর-পশ্চিমেই সবচেয়ে আদর্শ।",
  },
  {
    slug: "sofa", name: "Living Room Sofa", name_bn: "ড্রয়িং রুমের সোফা", name_hi: "सोफा",
    category_group: "objects", icon: "🛋️",
    best_directions: ["S", "W", "SW"],
    avoid_directions: ["NE"],
    benefit: "Comfortable seating allowing host to face North or East.",
    benefit_bn: "গৃহকর্তার কর্তৃত্বপূর্ণ বসার অবস্থান ও ইতিবাচক ভাববিনিময়।",
    remedy: "Owner should sit on South/West sofa facing North/East during discussions.",
    remedy_bn: "গৃহকর্তা দক্ষিণ বা পশ্চিমে বসে উত্তর বা পূর্ব দিকে মুখ করে কথা বলুন।",
  },
  {
    slug: "shoe-rack", name: "Shoe Rack", name_bn: "জুতার র্যাক", name_hi: "जूता स्टैंड",
    category_group: "objects", icon: "👟",
    best_directions: ["NW", "W", "SSW"],
    avoid_directions: ["NE", "N", "E"],
    benefit: "Keeping outside dirt and lower energy isolated from sanctified areas.",
    benefit_bn: "বাইরের নেতিবাচক ধূলিকণা ও শক্তি ঘরের পবিত্র স্থান থেকে দূরে রাখা।",
    remedy: "Keep shoe rack covered; never place directly in front of main entrance or near puja.",
    remedy_bn: "জুতার র্যাক সর্বদা বন্ধ রাখুন এবং মন্দিরের কাছ থেকে দূরে রাখুন।",
  },
  {
    slug: "balcony", name: "Balcony / Open Terrace", name_bn: "বারান্দা / খোলা ছাদ", name_hi: "बालकनी / छत",
    category_group: "architecture", icon: "🌅",
    best_directions: ["NE", "N", "E"],
    avoid_directions: ["SW", "S"],
    benefit: "Inviting refreshing morning solar rays and ambient prana.",
    benefit_bn: "সকালের প্রাণবন্ত সৌররশ্মি ও পজিটিভ প্রাণশক্তির অবাধ প্রবেশ।",
    remedy: "Keep North and East balconies lower and well-lit with small flowering plants.",
    remedy_bn: "বারান্দায় ছোট সুন্দর ফুলের টব রাখুন এবং পরিচ্ছন্ন রাখুন।",
  },
  {
    slug: "bar", name: "Home Bar", name_bn: "হোম বার / মদ্যশালা", name_hi: "होम बार",
    category_group: "objects", icon: "🍸",
    best_directions: ["W", "NW"],
    avoid_directions: ["NE", "N", "E", "SW"],
    benefit: "Restricting intoxicants to Western/Varuna zone of leisure without harming vision.",
    benefit_bn: "নেতিবাচক প্রভাব এড়িয়ে আনন্দ ও আপ্যায়ন রক্ষা।",
    remedy: "Never place in sacred NE/East; keep enclosed in cabinet in West.",
    remedy_bn: "ঈশান বা পূর্ব কোণে কখনই অ্যালকোহল রাখবেন না; পশ্চিমে ড্রয়ারে রাখুন।",
  },
  {
    slug: "elders-parents-room", name: "Elders / Parents Room", name_bn: "পিতামাতা / গুরুজনদের ঘর", name_hi: "बुजुर्गों का कमरा",
    category_group: "architecture", icon: "👴",
    best_directions: ["SW", "S", "W"],
    avoid_directions: ["NW", "SE", "NE"],
    benefit: "Reverence, longevity, dignity and serene twilight years.",
    benefit_bn: "দীর্ঘায়ু, সম্মান, মানসিক প্রশান্তি ও বার্ধক্যের সুস্বাস্থ্য।",
    remedy: "Warm earth-tones; head toward South for peaceful rest.",
    remedy_bn: "মাটির রঙের চাদর দিন এবং দক্ষিণাভিমুখী হয়ে ঘুমানোর ব্যবস্থা করুন।",
  },
  {
    slug: "childrens-room", name: "Children's Bedroom", name_bn: "সন্তানদের শয়নকক্ষ", name_hi: "बच्चों का शयनकक्ष",
    category_group: "architecture", icon: "🧸",
    best_directions: ["W", "NW", "E"],
    avoid_directions: ["SW", "SE", "SSW"],
    benefit: "Joyous childhood, obedient habits and mental development.",
    benefit_bn: "আনন্দময় শৈশব, প্রখর বুদ্ধি ও সুস্বাস্থ্য।",
    remedy: "Provide ample natural light and keep books in the North/East.",
    remedy_bn: "বইয়ের তাক উত্তর বা পূর্বে রাখুন এবং প্রচুর আলোর ব্যবস্থা রাখুন।",
  },
  {
    slug: "gym", name: "Fitness / Gym Equipment", name_bn: "ব্যায়ামাগার / জিম সামগ্রী", name_hi: "जिम / व्यायाम उपकरण",
    category_group: "architecture", icon: "🏋️",
    best_directions: ["S", "SE", "W"],
    avoid_directions: ["NE", "N"],
    benefit: "Vigorous stamina, physical vitality and muscular power.",
    benefit_bn: "শারীরিক শক্তি, অদম্য মনোবল ও দীর্ঘস্থায়ী স্ট্যামিনা।",
    remedy: "Place heavy dumbbells and weights in South/SW; keep NE free.",
    remedy_bn: "ভারী ডাম্বেল ও রড দক্ষিণ বা পশ্চিমে রাখুন।",
  },
  {
    slug: "lift-engineering", name: "Elevator / Lift Shaft", name_bn: "লিফট / এলিভেটর", name_hi: "लिफ्ट",
    category_group: "architecture", icon: "🛗",
    best_directions: ["S", "SW", "W"],
    avoid_directions: ["NE", "N"],
    benefit: "Heavy vertical machinery anchored safely in heavy zones.",
    benefit_bn: "ভারী যন্ত্রপাতির ভারসাম্যপূর্ণ অবস্থান।",
    remedy: "Never construct lift in center Brahmasthan or NE corner.",
    remedy_bn: "ঘরের কেন্দ্রস্থল বা উত্তর-পূর্বে কখনও লিফটের গর্ত করবেন না।",
  },
  {
    slug: "musical-instrument", name: "Musical Instruments", name_bn: "বাদ্যযন্ত্র / সংগীত সরঞ্জাম", name_hi: "संगीत वाद्ययंत्र",
    category_group: "objects", icon: "🎻",
    best_directions: ["ENE", "N", "E"],
    avoid_directions: ["SW", "SSW"],
    benefit: "Artistic inspiration, melodious voice and Saraswati's blessing.",
    benefit_bn: "সঙ্গীতের সিদ্ধি, সুমধুর কণ্ঠ ও সরস্বতীর আশীর্বাদ।",
    remedy: "Keep instruments tuned and cleaned in joy/learning zone ENE/E.",
    remedy_bn: "আনন্দ ও প্রজ্ঞার জোন ENE বা পূর্বে বাদ্যযন্ত্র সংরক্ষণ করুন।",
  },
  {
    slug: "staff-servants", name: "Staff / Servants Quarter", name_bn: "সহকারী / কর্মীদের থাকার জায়গা", name_hi: "कर्मचारी कक्ष",
    category_group: "architecture", icon: "🤝",
    best_directions: ["NW", "SE"],
    avoid_directions: ["SW", "NE"],
    benefit: "Faithful service, mutual respect and disciplined assistance.",
    benefit_bn: "বিশ্বস্ত সেবা ও গৃহকর্মে আন্তরিক সহযোগিতা।",
    remedy: "Never place servants in master SW corner (can cause insubordination).",
    remedy_bn: "দক্ষিণ-পশ্চিমে কর্মীদের ঘর দেবেন না; উত্তর-পশ্চিমেই সর্বোত্তম।",
  },
  {
    slug: "dining-table", name: "Dining Table", name_bn: "খাবারের টেবিল", name_hi: "डाइनिंग टेबल",
    category_group: "objects", icon: "🍲",
    best_directions: ["W", "E"],
    avoid_directions: ["NE", "SW"],
    benefit: "Peaceful family meals and hearty appetite.",
    benefit_bn: "পরিবারের একসাথে আহার ও সুস্বাস্থ্য।",
    remedy: "Square or rectangular dining table; avoid circular / irregular shapes.",
    remedy_bn: "বর্গাকার বা আয়তাকার টেবিল ব্যবহার করুন; গোল বা এলোমেলো আকার এড়িয়ে চলুন।",
  },
  {
    slug: "drawing-room", name: "Drawing Room", name_bn: "ড্রয়িং রুম", name_hi: "ड्राइंग रूम",
    category_group: "architecture", icon: "🪑",
    best_directions: ["N", "E", "NE"],
    avoid_directions: ["SW", "SE"],
    benefit: "Social connections, public standing and warm interactions.",
    benefit_bn: "সামাজিক প্রতিপত্তি ও অতিথি আপ্যায়ন।",
    remedy: "Head of the family seats facing East or North.",
    remedy_bn: "গৃহকর্তা পূর্ব বা উত্তরমুখী হয়ে বসুন।",
  },
];

// ---------------------------------------------------------------------------
// Mathematical Trigonometric Functions
// ---------------------------------------------------------------------------

/**
 * Maps any angle (0° to 359.99°) to Pada index 0..31.
 * N5 is index 0, centered on Due North (0.0°).
 */
export function padaIndexForDegree(degree: number): number {
  const n = ((degree % 360) + 360) % 360;
  return Math.floor(((n + 5.625) % 360) / 11.25);
}

/**
 * 16-Wind Direction code for any compass bearing.
 */
export function direction16(degree: number): string {
  const n = ((degree % 360) + 360) % 360;
  return DIR16_ORDER[Math.floor(((n + 11.25) % 360) / 22.5) % 16];
}

/**
 * Center bearing of a 16-wind direction code.
 */
export function dirCenter(dir: string): number {
  const i = DIR16_ORDER.indexOf(dir as any);
  return i < 0 ? 0 : i * 22.5;
}

/**
 * Shortest signed angle (-180°..+180°) to turn from `from` heading to `to` heading.
 */
export function signedDelta(from: number, to: number): number {
  let d = ((to - from + 540) % 360) - 180;
  if (d === -180) d = 180;
  return d;
}

/**
 * Finds the nearest "best" direction to the current heading and calculates turn degrees.
 */
export function bestGuidance(heading: number, best: string[]): { dir: string; delta: number } | null {
  if (!best?.length) return null;
  let chosen: { dir: string; delta: number } | null = null;
  for (const d of best) {
    const delta = signedDelta(heading, dirCenter(d));
    if (!chosen || Math.abs(delta) < Math.abs(chosen.delta)) {
      chosen = { dir: d, delta };
    }
  }
  return chosen;
}

/**
 * Resolves the active VastuPada from a heading bearing.
 */
export function activePada(degree: number, padas: VastuPada[] = VASTU_PADAS): VastuPada {
  const idx = padaIndexForDegree(degree);
  return padas[idx] || padas[0];
}

