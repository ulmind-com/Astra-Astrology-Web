/**
 * Complete Multilingual Localization (en, bn, hi) for Kundli Calculator
 * Translates all cards, tables, dasha timeline, Vedic yogas, and planet details.
 */

export type KundliLanguage = "en" | "bn" | "hi";

export const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const HINDI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toLocalizedDigits(str: string | number | undefined | null, lang: KundliLanguage): string {
  if (str === undefined || str === null) return "";
  const s = String(str);
  if (lang === "bn") {
    return s.replace(/\d/g, (d) => BENGALI_DIGITS[parseInt(d, 10)]);
  }
  if (lang === "hi") {
    return s.replace(/\d/g, (d) => HINDI_DIGITS[parseInt(d, 10)]);
  }
  return s;
}

// 1. Planets (9 Vedic Grahas + Ascendant + outer planets)
export const KUNDLI_PLANET_NAMES: Record<string, Record<KundliLanguage, string>> = {
  Asc: { en: "Ascendant (Asc)", bn: "লগ্ন (Asc)", hi: "लग्न (Asc)" },
  Ascendant: { en: "Ascendant", bn: "লগ্ন", hi: "लग्न" },
  Sun: { en: "Sun", bn: "সূর্য", hi: "सूर्य" },
  Moon: { en: "Moon", bn: "চন্দ্র", hi: "चन्द्र" },
  Mars: { en: "Mars", bn: "মঙ্গল", hi: "मंगल" },
  Mercury: { en: "Mercury", bn: "বুধ", hi: "बुध" },
  Jupiter: { en: "Jupiter", bn: "বৃহস্পতি", hi: "बृहस्पति" },
  Venus: { en: "Venus", bn: "শুক্র", hi: "शुक्र" },
  Saturn: { en: "Saturn", bn: "শনি", hi: "शनि" },
  Rahu: { en: "Rahu", bn: "রাহু", hi: "राहु" },
  Ketu: { en: "Ketu", bn: "কেতু", hi: "केतु" },
  Uranus: { en: "Uranus", bn: "ইউরেনাস", hi: "यूरेनस" },
  Neptune: { en: "Neptune", bn: "নেপচুন", hi: "नेपच्यून" },
  Pluto: { en: "Pluto", bn: "প্লুটো", hi: "प्लूटो" },
};

export function translatePlanetName(name: string, lang: KundliLanguage): string {
  if (!name) return "";
  const isRetro = name.includes("®") || name.includes("(R)");
  const cleanName = name.replace(/[®()R]/g, "").trim();

  const found =
    KUNDLI_PLANET_NAMES[cleanName]?.[lang] ||
    KUNDLI_PLANET_NAMES[cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase()]?.[lang] ||
    cleanName;

  if (isRetro) {
    if (lang === "bn") return `${found} (বক্রী®)`;
    if (lang === "hi") return `${found} (वक्री®)`;
    return `${found} (R)`;
  }
  return found;
}

// 2. Rashis (12 Zodiac Signs)
export const KUNDLI_RASHI_NAMES: Record<string, Record<KundliLanguage, string>> = {
  Aries: { en: "Aries", bn: "মেষ", hi: "मेष" },
  Taurus: { en: "Taurus", bn: "বৃষ", hi: "वृषभ" },
  Gemini: { en: "Gemini", bn: "মিথুন", hi: "मिथुन" },
  Cancer: { en: "Cancer", bn: "কর্কট", hi: "कर्क" },
  Leo: { en: "Leo", bn: "সিংহ", hi: "सिंह" },
  Virgo: { en: "Virgo", bn: "কন্যা", hi: "कन्या" },
  Libra: { en: "Libra", bn: "তুলা", hi: "तुला" },
  Scorpio: { en: "Scorpio", bn: "বৃশ্চিক", hi: "वृश्चिक" },
  Sagittarius: { en: "Sagittarius", bn: "ধনু", hi: "धनु" },
  Capricorn: { en: "Capricorn", bn: "মকর", hi: "मकर" },
  Aquarius: { en: "Aquarius", bn: "কুম্ভ", hi: "कुंभ" },
  Pisces: { en: "Pisces", bn: "মীন", hi: "मीन" },
};

export function translateRashiName(sign: string, lang: KundliLanguage): string {
  if (!sign) return "";
  const clean = sign.trim();
  return KUNDLI_RASHI_NAMES[clean]?.[lang] || clean;
}

// 3. Nakshatras (27 Lunar Mansions)
export const KUNDLI_NAKSHATRA_NAMES: Record<string, Record<KundliLanguage, string>> = {
  Ashwini: { en: "Ashwini", bn: "অশ্বিনী", hi: "अश्विनी" },
  Bharani: { en: "Bharani", bn: "ভরণী", hi: "भरणी" },
  Krittika: { en: "Krittika", bn: "কৃত্তিকা", hi: "कृत्तिका" },
  Rohini: { en: "Rohini", bn: "রোহিণী", hi: "रोहिणी" },
  Mrigashira: { en: "Mrigashira", bn: "মৃগশিরা", hi: "मृगशिरा" },
  Ardra: { en: "Ardra", bn: "আর্দ্রা", hi: "आर्द्रा" },
  Punarvasu: { en: "Punarvasu", bn: "পুনর্বসু", hi: "पुनर्वसु" },
  Pushya: { en: "Pushya", bn: "পুষ্যা", hi: "पुष्य" },
  Ashlesha: { en: "Ashlesha", bn: "অশ্লেষা", hi: "आश्लेषा" },
  Magha: { en: "Magha", bn: "মঘা", hi: "मघा" },
  "Purva Phalguni": { en: "Purva Phalguni", bn: "পূর্ব ফাল্গুনী", hi: "पूर्वा फाल्गुनी" },
  "Uttara Phalguni": { en: "Uttara Phalguni", bn: "উত্তর ফাল্গুনী", hi: "उत्तरा फाल्गुनी" },
  Hasta: { en: "Hasta", bn: "হস্তা", hi: "हस्त" },
  Chitra: { en: "Chitra", bn: "চিত্রা", hi: "चित्रा" },
  Swati: { en: "Swati", bn: "স্বাতী", hi: "स्वाति" },
  Vishakha: { en: "Vishakha", bn: "বিশাখা", hi: "विशाखा" },
  Anuradha: { en: "Anuradha", bn: "অনুরাধা", hi: "अनुराधा" },
  Jyeshtha: { en: "Jyeshtha", bn: "জ্যেষ্ঠা", hi: "ज्येष्ठा" },
  Moola: { en: "Moola", bn: "মূলা", hi: "मूल" },
  "Purva Ashadha": { en: "Purva Ashadha", bn: "পূর্বাষাঢ়া", hi: "पूर्वाषाढ़ा" },
  "Uttara Ashadha": { en: "Uttara Ashadha", bn: "উত্তরাষাঢ়া", hi: "उत्तराषाढ़ा" },
  Shravana: { en: "Shravana", bn: "শ্রবণা", hi: "श्रवण" },
  Dhanishta: { en: "Dhanishta", bn: "ধনিষ্ঠা", hi: "धनिष्ठा" },
  Shatabhisha: { en: "Shatabhisha", bn: "শতভিষা", hi: "शतभिषा" },
  "Purva Bhadrapada": { en: "Purva Bhadrapada", bn: "পূর্বভাদ্রপদ", hi: "पूर्वा भाद्रपद" },
  "Uttara Bhadrapada": { en: "Uttara Bhadrapada", bn: "উত্তরভাদ্রপদ", hi: "उत्तरा भाद्रपद" },
  Revati: { en: "Revati", bn: "রেবতী", hi: "रेवती" },
};

export function translateNakshatraName(nak: string, lang: KundliLanguage): string {
  if (!nak) return "";
  const clean = nak.trim();
  return KUNDLI_NAKSHATRA_NAMES[clean]?.[lang] || clean;
}

// 4. Days of Week
export const KUNDLI_DAY_NAMES: Record<string, Record<KundliLanguage, string>> = {
  Sunday: { en: "Sunday", bn: "রবিবার", hi: "रविवार" },
  Monday: { en: "Monday", bn: "সোমবার", hi: "सोमवार" },
  Tuesday: { en: "Tuesday", bn: "মঙ্গলবার", hi: "मंगलवार" },
  Wednesday: { en: "Wednesday", bn: "বুধবার", hi: "बुधवार" },
  Thursday: { en: "Thursday", bn: "বৃহস্পতিবার", hi: "गुरुवार" },
  Friday: { en: "Friday", bn: "শুক্রবার", hi: "शुक्रवार" },
  Saturday: { en: "Saturday", bn: "শনিবার", hi: "शनिवार" },
};

export function translateDayName(day: string, lang: KundliLanguage): string {
  if (!day) return "";
  const clean = day.trim();
  return KUNDLI_DAY_NAMES[clean]?.[lang] || clean;
}

// 5. Gender
export const KUNDLI_GENDER_NAMES: Record<string, Record<KundliLanguage, string>> = {
  male: { en: "Male", bn: "পুরুষ", hi: "पुरुष" },
  female: { en: "Female", bn: "মহিলা", hi: "महिला" },
  other: { en: "Other", bn: "অন্যান্য", hi: "अन्य" },
};

// 6. Panchang Elements (Tithi, Karan, Yoga)
export const KUNDLI_TITHI_NAMES: Record<string, Record<KundliLanguage, string>> = {
  Pratipada: { en: "Pratipada", bn: "প্রতিপদ", hi: "प्रतिपदा" },
  Dwitiya: { en: "Dwitiya", bn: "দ্বিতীয়া", hi: "द्वितीया" },
  Tritiya: { en: "Tritiya", bn: "তৃতীয়া", hi: "तृतीया" },
  Chaturthi: { en: "Chaturthi", bn: "চতুর্থী", hi: "चतुर्थी" },
  Panchami: { en: "Panchami", bn: "পঞ্চমী", hi: "पंचमी" },
  Shasthi: { en: "Shasthi", bn: "ষষ্ঠী", hi: "षष्ठी" },
  Saptami: { en: "Saptami", bn: "সপ্তমী", hi: "सप्तमी" },
  Ashtami: { en: "Ashtami", bn: "অষ্টমী", hi: "अष्टमी" },
  Navami: { en: "Navami", bn: "নবমী", hi: "नवमी" },
  Dashami: { en: "Dashami", bn: "দশমী", hi: "दशमी" },
  Ekadashi: { en: "Ekadashi", bn: "একাদশী", hi: "एकादशी" },
  Dwadashi: { en: "Dwadashi", bn: "দ্বাদশী", hi: "द्वादशी" },
  Trayodashi: { en: "Trayodashi", bn: "ত্রয়োদশী", hi: "त्रयोदशी" },
  Chaturdashi: { en: "Chaturdashi", bn: "চতুর্দশী", hi: "चतुर्दशी" },
  Purnima: { en: "Purnima", bn: "পূর্ণিমা", hi: "पूर्णिमा" },
  Amavasya: { en: "Amavasya", bn: "অমাবস্যা", hi: "अमावस्या" },
};

export function translateTithi(tithi: string, lang: KundliLanguage): string {
  if (!tithi) return "";
  let res = tithi;
  if (lang === "bn") {
    res = res.replace(/Shukla/gi, "শুক্ল").replace(/Krishna/gi, "কৃষ্ণ");
    Object.entries(KUNDLI_TITHI_NAMES).forEach(([en, dict]) => {
      res = res.replace(new RegExp(en, "gi"), dict.bn);
    });
  } else if (lang === "hi") {
    res = res.replace(/Shukla/gi, "शुक्ल").replace(/Krishna/gi, "कृष्ण");
    Object.entries(KUNDLI_TITHI_NAMES).forEach(([en, dict]) => {
      res = res.replace(new RegExp(en, "gi"), dict.hi);
    });
  }
  return res;
}

export const KUNDLI_KARAN_NAMES: Record<string, Record<KundliLanguage, string>> = {
  Bava: { en: "Bava", bn: "বব", hi: "बव" },
  Balava: { en: "Balava", bn: "বালব", hi: "बालव" },
  Kaulava: { en: "Kaulava", bn: "কৌলব", hi: "कौलव" },
  Taitila: { en: "Taitila", bn: "তৈতিল", hi: "तैतिल" },
  Gara: { en: "Gara", bn: "গর", hi: "गर" },
  Vanija: { en: "Vanija", bn: "বনিজ", hi: "वणिज" },
  "Vishti (Bhadra)": { en: "Vishti (Bhadra)", bn: "ভাদ্রা (বিষ্টী)", hi: "भद्रा (विष्टि)" },
  Vishti: { en: "Vishti", bn: "বিষ্টী", hi: "विष्टि" },
  Shakuni: { en: "Shakuni", bn: "শকুনি", hi: "शकुनि" },
  Chatushpada: { en: "Chatushpada", bn: "চতুস্পদ", hi: "चतुष्पद" },
  Naga: { en: "Naga", bn: "নাগ", hi: "नाग" },
  Kintughna: { en: "Kintughna", bn: "কিমস্তুঘ্ন", hi: "किंस्तुघ्न" },
};

export function translateKaran(karan: string, lang: KundliLanguage): string {
  if (!karan) return "";
  return KUNDLI_KARAN_NAMES[karan.trim()]?.[lang] || karan;
}

export const KUNDLI_PANCHANG_YOGAS: Record<string, Record<KundliLanguage, string>> = {
  Vishkambha: { en: "Vishkambha", bn: "বিষ্কম্ভ", hi: "विष्कुंभ" },
  Priti: { en: "Priti", bn: "প্রীতি", hi: "प्रीति" },
  Ayushman: { en: "Ayushman", bn: "আয়ুষ্মান", hi: "आयुष्मान" },
  Saubhagya: { en: "Saubhagya", bn: "সৌভাগ্য", hi: "सौभाग्य" },
  Shobhana: { en: "Shobhana", bn: "শোভন", hi: "शोभन" },
  Atiganda: { en: "Atiganda", bn: "অতিগণ্ড", hi: "अतिगण्ड" },
  Sukarma: { en: "Sukarma", bn: "সুকর্মা", hi: "सुकर्मा" },
  Dhriti: { en: "Dhriti", bn: "ধৃতি", hi: "धृति" },
  Shula: { en: "Shula", bn: "শূল", hi: "शूल" },
  Ganda: { en: "Ganda", bn: "গণ্ড", hi: "गण्ड" },
  Vriddhi: { en: "Vriddhi", bn: "বৃদ্ধি", hi: "वृद्धि" },
  Dhruva: { en: "Dhruva", bn: "ধ্রুব", hi: "ध्रुव" },
  Vyaghata: { en: "Vyaghata", bn: "ব্যাঘাত", hi: "व्याघात" },
  Harshana: { en: "Harshana", bn: "হর্ষণ", hi: "हर्षण" },
  Vajra: { en: "Vajra", bn: "বজ্র", hi: "वज्र" },
  Siddhi: { en: "Siddhi", bn: "সিদ্ধি", hi: "सिद्धि" },
  Vyatipata: { en: "Vyatipata", bn: "ব্যতীপাত", hi: "व्यतीपात" },
  Variyan: { en: "Variyan", bn: "বরীয়ান", hi: "वरीयान" },
  Parigha: { en: "Parigha", bn: "পরিঘ", hi: "परिघ" },
  Shiva: { en: "Shiva", bn: "শিব", hi: "शिव" },
  Siddha: { en: "Siddha", bn: "সিদ্ধ", hi: "सिद्ध" },
  Sadhya: { en: "Sadhya", bn: "সাধ্য", hi: "साध्य" },
  Shubha: { en: "Shubha", bn: "শুভ", hi: "शुभ" },
  Shukla: { en: "Shukla", bn: "শুক্ল", hi: "शुक्ल" },
  Brahma: { en: "Brahma", bn: "ব্রহ্ম", hi: "ब्रह्म" },
  Indra: { en: "Indra", bn: "ইন্দ্র", hi: "इन्द्र" },
  Vaidhriti: { en: "Vaidhriti", bn: "বৈধৃতি", hi: "वैधृति" },
};

export function translateYoga(yoga: string, lang: KundliLanguage): string {
  if (!yoga) return "";
  return KUNDLI_PANCHANG_YOGAS[yoga.trim()]?.[lang] || yoga;
}

// 7. DMS & Degrees Translation (e.g., "21° Leo 35 ' 55\"" -> "২১° সিংহ ৩৫' ৫৫\"")
export function translateDmsStyled(dms: string, lang: KundliLanguage): string {
  if (!dms) return "";
  if (lang === "en") return dms;

  let localized = dms;
  Object.entries(KUNDLI_RASHI_NAMES).forEach(([signEn, dict]) => {
    localized = localized.replace(new RegExp(`\\b${signEn}\\b`, "g"), dict[lang]);
  });
  return toLocalizedDigits(localized, lang);
}

// 8. House Name Translation (e.g., "house 1" -> "১ম ভাব")
export function translateHouseName(hName: string, lang: KundliLanguage): string {
  if (!hName) return "";
  const match = hName.match(/house\s*(\d+)/i);
  if (!match) return hName;

  const num = parseInt(match[1], 10);
  if (lang === "bn") {
    const suffixes: Record<number, string> = {
      1: "১ম ভাব",
      2: "২য় ভাব",
      3: "৩য় ভাব",
      4: "৪র্থ ভাব",
      5: "৫ম ভাব",
      6: "৬ষ্ঠ ভাব",
      7: "৭ম ভাব",
      8: "৮ম ভাব",
      9: "৯ম ভাব",
      10: "১০ম ভাব",
      11: "১১তম ভাব",
      12: "১২তম ভাব",
    };
    return suffixes[num] || `${toLocalizedDigits(num, "bn")}তম ভাব`;
  }
  if (lang === "hi") {
    const hindiHouses: Record<number, string> = {
      1: "प्रथम भाव (१)",
      2: "द्वितीय भाव (२)",
      3: "तृतीय भाव (३)",
      4: "चतुर्थ भाव (४)",
      5: "पंचम भाव (५)",
      6: "षष्ठ भाव (६)",
      7: "सप्तम भाव (७)",
      8: "अष्टम भाव (८)",
      9: "नवम भाव (९)",
      10: "दशम भाव (१०)",
      11: "एकादश भाव (११)",
      12: "द्वादश भाव (१२)",
    };
    return hindiHouses[num] || `भाव ${toLocalizedDigits(num, "hi")}`;
  }
  return `House ${num}`;
}

// 9. Dasha Card Title Translation (e.g. "Balance Mahadasha: Ketu 3 Y 4 M 15 D" or "Mahadasha: Ketu - 7 Years")
export function translateDashaCardTitle(title: string, lang: KundliLanguage): string {
  if (!title) return "";
  if (lang === "en") return title;

  // Pattern 1: Balance Mahadasha: Ketu 3 Y 4 M 15 D
  const balMatch = title.match(/Balance\s+Mahadasha:\s*(\w+)\s*(\d+)\s*Y\s*(\d+)\s*M\s*(\d+)\s*D/i);
  if (balMatch) {
    const p = translatePlanetName(balMatch[1], lang);
    const y = toLocalizedDigits(balMatch[2], lang);
    const m = toLocalizedDigits(balMatch[3], lang);
    const d = toLocalizedDigits(balMatch[4], lang);
    if (lang === "bn") return `জন্মকালীন ব্যালেন্স মহাদশা: ${p} (${y} বছর ${m} মাস ${d} দিন)`;
    if (lang === "hi") return `जन्म समय महादशा शेष: ${p} (${y} वर्ष ${m} मास ${d} दिन)`;
  }

  // Pattern 2: Mahadasha: Ketu - 7 Years
  const mdMatch = title.match(/Mahadasha:\s*(\w+)\s*[-–]\s*(\d+)\s*Years?/i);
  if (mdMatch) {
    const p = translatePlanetName(mdMatch[1], lang);
    const y = toLocalizedDigits(mdMatch[2], lang);
    if (lang === "bn") return `${p} মহাদশা — ${y} বছর`;
    if (lang === "hi") return `${p} महादशा — ${y} वर्ष`;
  }

  return title;
}

// 10. Dasha Duration Translation (e.g. "0 Y, 4 M, 27 D" -> "০ বছর, ৪ মাস, ২৭ দিন")
export function translateDashaDuration(dur: string, lang: KundliLanguage): string {
  if (!dur || dur === "-") return "-";
  if (lang === "en") return dur;

  const match = dur.match(/(\d+)\s*Y,\s*(\d+)\s*M,\s*(\d+)\s*D/i);
  if (match) {
    const y = toLocalizedDigits(match[1], lang);
    const m = toLocalizedDigits(match[2], lang);
    const d = toLocalizedDigits(match[3], lang);
    if (lang === "bn") return `${y} বছর, ${m} মাস, ${d} দিন`;
    if (lang === "hi") return `${y} वर्ष, ${m} मास, ${d} दिन`;
  }
  return toLocalizedDigits(dur, lang);
}

// 11. Balance Dasha string (e.g., "Ketu 3 Y 4 M 15 D")
export function translateBalDasa(str: string, lang: KundliLanguage): string {
  if (!str) return "";
  if (lang === "en") return str;

  const match = str.match(/(\w+)\s*(\d+)\s*Y\s*(\d+)\s*M\s*(\d+)\s*D/i);
  if (match) {
    const p = translatePlanetName(match[1], lang);
    const y = toLocalizedDigits(match[2], lang);
    const m = toLocalizedDigits(match[3], lang);
    const d = toLocalizedDigits(match[4], lang);
    if (lang === "bn") return `${p} ${y} বছর ${m} মাস ${d} দিন`;
    if (lang === "hi") return `${p} ${y} वर्ष ${m} मास ${d} दिन`;
  }
  return toLocalizedDigits(str, lang);
}

// 12. Classical Vedic Yogas & Doshas Translations
export interface LocalizedYogaMeta {
  name: string;
  description: string;
  effects: string;
}

export const KUNDLI_YOGAS_TRANSLATIONS: Record<string, Record<KundliLanguage, LocalizedYogaMeta>> = {
  Mangalik: {
    en: {
      name: "Mangalik Dosha",
      description: "Mars placement in relationship houses. In this chart, Mars is neutralized through Cancer debilitation & Kendra Jupiter aspect.",
      effects: "Mars placement scrutinized for relationship equilibrium. Cancellation factors neutralize adverse planetary friction.",
    },
    bn: {
      name: "মাঙ্গলিক দোষ বিচার",
      description: "লগ্ন বা চন্দ্র হতে ১, ২, ৪, ৭, ৮ বা ১২তম ভাবে মঙ্গলের অবস্থান বিচার। এই কুন্ডলীতে শুভ গ্রহের দৃষ্টি বা নীচভঙ্গে মাঙ্গলিক প্রভাব প্রশমিত।",
      effects: "মঙ্গলের অবস্থান বৈবাহিক ও কর্মক্ষেত্রে শক্তি দান করে। মিত্র ও শুভ গ্রহের কারণে প্রতিকূল দোষ প্রশমিত ও ভারসাম্যে পরিণত হয়েছে।",
    },
    hi: {
      name: "मांगलिक दोष विचार",
      description: "लग्न अथवा चन्द्र से १, २, ४, ७, ८, १२वें भाव में मंगल की स्थिति का विश्लेषण। शुभ दृष्टि से प्रभाव संतुलित है।",
      effects: "मंगल का प्रभाव साहस एवं पराक्रम दिलाता है। शुभ ग्रहों के योग से दांपत्य एवं कार्यक्षेत्र में शांति बनी रहती है।",
    },
  },
  "Kaal Sarp Dosh": {
    en: {
      name: "Kaal Sarp Dosh",
      description: "Formed when all planets are placed between Rahu and Ketu axis.",
      effects: "Indicates intense karmic destiny, transformation, and significant turning points after rigorous early efforts.",
    },
    bn: {
      name: "কালসর্প দোষ বিচার",
      description: "যখন সমস্ত গ্রহ রাহু ও কেতুর অক্ষের মধ্যে আবদ্ধ থাকে, তখন এই যোগ গঠিত হয়।",
      effects: "এটি জীবনের প্রারম্ভিক পর্বে তীব্র কর্মের পরীক্ষা দেয় এবং পরবর্তীতে আধ্যাত্মিক জাগরণ ও বিশেষ সাফল্যের দ্বার উন্মোচন করে।",
    },
    hi: {
      name: "कालसर्प दोष विचार",
      description: "जब सभी सातों ग्रह राहु और केतु की धुरी के बीच स्थित हों।",
      effects: "कठिन परिश्रम के पश्चात जीवन में अप्रत्याशित सफलता एवं आध्यात्मिक उन्नति के योग बनते हैं।",
    },
  },
  "Budhaditya Yoga": {
    en: {
      name: "Budhaditya Yoga",
      description: "Intellectual brilliance formed by close conjunction of Sun and Mercury.",
      effects: "Sharp analytical intellect, public eloquence, administrative leadership, and executive prowess.",
    },
    bn: {
      name: "বুধাদিত্য যোগ",
      description: "রবি ও বুধের শুভ যুতির ফলে এই অত্যন্ত মর্যাদাপূর্ণ রাজযোগ গঠিত হয়।",
      effects: "প্রখর বিশ্লেষণ ক্ষমতা, ব্যবসায়িক দূরদর্শিতা, প্রশাসনিক মেধা ও সমাজে উচ্চ বিদ্যাবত্তার সম্মান দান করে।",
    },
    hi: {
      name: "बुधादित्य योग",
      description: "सूर्य और बुध की शुभ युति से निर्मित प्रतिष्ठित राजयोग।",
      effects: "प्रखर बुद्धिमत्ता, प्रशासनिक योग्यता, व्यापारिक चातुर्य एवं उच्च सम्मान की प्राप्ति कराता है।",
    },
  },
  "Gaja Kesari Yoga": {
    en: {
      name: "Gaja Kesari Yoga",
      description: "Powerful royal yoga formed when Jupiter is in Kendra (1st, 4th, 7th, 10th) from Moon.",
      effects: "Grants high social reputation, enduring intellect, administrative respect, wealth, and moral authority in leadership.",
    },
    bn: {
      name: "গজকেশরী যোগ",
      description: "চন্দ্র হতে কেন্দ্র ভাবে (১ম, ৪র্থ, ৭ম বা ১০ম) দেবগুরু বৃহস্পতির অবস্থানে এই শক্তিশালী রাজযোগ গঠিত হয়।",
      effects: "সমাজে সুউচ্চ প্রতিষ্ঠা, দীর্ঘস্থায়ী যশ, প্রখর প্রজ্ঞা, নেতৃত্ব, অর্থভাগ ও নীতিপরায়ণ নেতৃত্বের প্রভাব দান করে।",
    },
    hi: {
      name: "गजकेसरी योग",
      description: "चन्द्रमा से केन्द्र भाव (१, ४, ७, १०) में गुरु बृहस्पति की शुभ स्थिति।",
      effects: "समाज में मान-सम्मान, उच्च पद, बौद्धिक क्षमता, प्रशासनिक नेतृत्व एवं स्थायी धन-संपदा प्रदान करता है।",
    },
  },
  "Kemadruma Yoga": {
    en: {
      name: "Kemadruma Yoga",
      description: "Absence of planets in 2nd and 12th from Moon; requires spiritual grounding and mental focus.",
      effects: "Teaches self-reliance, mental detachment, and deep introspective focus. Practicing Shiva meditation and charity brings auspicious results.",
    },
    bn: {
      name: "কেমদ্রুম যোগ",
      description: "চন্দ্রের উভয় পার্শ্বে (২য় ও ১২তম ভাবে) কোনো শুভ গ্রহ না থাকলে এই যোগ তৈরি হয়।",
      effects: "এটি আত্মনির্ভরশীলতা ও গভীর অন্তর্দৃষ্টি শেখায়। ভগবান শিবের আরাধনা ও সৎকর্মে মনের শান্তি এবং সৌভাগ্য ফিরে আসে।",
    },
    hi: {
      name: "केमद्रुम योग",
      description: "चन्द्रमा के आगे-पीछे (द्वितीय व द्वादश भाव) कोई ग्रह न होने पर निर्मित योग।",
      effects: "यह स्वावलंबन एवं आत्म-चिंतन सिखाता है। भगवान शिव की आराधना एवं दान से इसके दोष दूर होते हैं।",
    },
  },
  "Sinapha Yoga": {
    en: {
      name: "Sunapha Yoga",
      description: "Benefic planetary disposition in the 2nd house from natal Moon.",
      effects: "Provides self-earned prosperity, eloquence, sharp intelligence, and financial recovery after initial life struggles.",
    },
    bn: {
      name: "সুনফা যোগ",
      description: "চন্দ্র হতে দ্বিতীয় ভাবে শুভ গ্রহের অবস্থানের ফলে জাতক স্বোপার্জিত সম্পদে বলীয়ান হন।",
      effects: "স্বোপার্জিত ধন-সম্পদ, বাকপটুতা, তীক্ষ্ণ বিচারবুদ্ধি এবং আত্মপ্রচেষ্টায় জীবনে ব্যাপক সমৃদ্ধি সূচিত করে।",
    },
    hi: {
      name: "सुनफा योग",
      description: "चन्द्रमा से दूसरे भाव में शुभ ग्रहों की उपस्थिति।",
      effects: "स्व-अर्जित धन-धान्य, वाकपटुता, प्रखर बुद्धि एवं जीवन में आत्मनिर्भर प्रगति दिलाता है।",
    },
  },
  "Sinapha Yoga 2": {
    en: {
      name: "Sunapha Yoga 2",
      description: "Favorable disposition of wealth houses and lunar support.",
      effects: "Provides self-earned prosperity, eloquence, sharp intelligence, and financial recovery after initial life struggles.",
    },
    bn: {
      name: "সুনফা যোগ (২)",
      description: "চন্দ্রের সাথে ধনভাব ও বাকস্থানের শুভ গ্রহের সংযোগ।",
      effects: "আর্থিক স্বচ্ছলতা, সুবক্তা হওয়ার গুণ এবং জীবনের প্রারম্ভিক সংগ্রামের পর দীর্ঘমেয়াদী অর্থনৈতিক মুক্তি এনে দেয়।",
    },
    hi: {
      name: "सुनफा योग (२)",
      description: "धन भाव एवं चन्द्रमा के मध्य शुभ समन्वय।",
      effects: "आर्थिक स्थिरता, उत्तम वक्तृत्व कला एवं संघर्ष के बाद सुदृढ़ वित्तीय संपन्नता।",
    },
  },
  "Sinapha Yoga 3": {
    en: {
      name: "Sunapha Yoga 3",
      description: "Planetary harmony connecting natal Moon with royal trines.",
      effects: "Enhances mental peace, family stability, philosophical wisdom, and enduring societal respect.",
    },
    bn: {
      name: "সুনফা যোগ (৩)",
      description: "চন্দ্রের সাথে শুভ ত্রিকোণ ও রাজগ্রহের সামঞ্জস্য।",
      effects: "মানসিক স্থৈর্য, পারিবারিক সম্প্রীতি, দার্শনিক দৃষ্টিভঙ্গি এবং সমাজে দীর্ঘস্থায়ী শ্রদ্ধা ও সম্মান বৃদ্ধি করে।",
    },
    hi: {
      name: "सुनफा योग (३)",
      description: "चन्द्र एवं त्रिकोण ग्रहों का शुभ योग।",
      effects: "मानसिक शांति, पारिवारिक संतुलन एवं समाज में दीर्घकालिक प्रतिष्ठा प्रदान करता है।",
    },
  },
};

export function translateYogaName(name: string, lang: KundliLanguage): string {
  if (!name) return "";
  const found = KUNDLI_YOGAS_TRANSLATIONS[name.trim()]?.[lang]?.name;
  return found || name;
}

export function translateYogaDetails(
  name: string,
  desc: string,
  effects: string,
  lang: KundliLanguage
): { name: string; description: string; effects: string } {
  const meta = KUNDLI_YOGAS_TRANSLATIONS[name.trim()]?.[lang];
  if (meta) {
    return {
      name: meta.name,
      description: meta.description,
      effects: meta.effects,
    };
  }
  return { name, description: desc, effects };
}

// 13. Metals, Fingers and Wearing Days Localization
export const KUNDLI_METALS: Record<string, Record<KundliLanguage, string>> = {
  "Gold / Copper": { en: "Gold / Copper", bn: "স্বর্ণ বা তামা", hi: "स्वर्ण या तांबा" },
  "Silver": { en: "Silver", bn: "রূপা", hi: "चांदी" },
  "Copper / Gold": { en: "Copper / Gold", bn: "তামা বা অষ্টধাতু", hi: "तांबा या अष्टधातु" },
  "Gold / Bronze": { en: "Gold / Bronze", bn: "স্বর্ণ বা ব্রোঞ্জ", hi: "स्वर्ण या कांस्य" },
  "Gold": { en: "Gold", bn: "স্বর্ণ বা পিতল", hi: "स्वर्ण या पीतल" },
  "Silver / Platinum": { en: "Silver / Platinum", bn: "রূপা বা প্লাটিনাম", hi: "चांदी या प्लैटिनम" },
  "Silver / Iron": { en: "Silver / Iron", bn: "পঞ্চধাতু বা রূপা", hi: "पंचधातु या चांदी" },
};

export const KUNDLI_FINGERS: Record<string, Record<KundliLanguage, string>> = {
  "Ring finger": { en: "Ring finger", bn: "অনামিকা অঙ্গুলি", hi: "अनामिका अंगुली" },
  "Little finger": { en: "Little finger", bn: "কনিষ্ঠা অঙ্গুলি", hi: "कनिष्ठिका अंगुली" },
  "Index finger": { en: "Index finger", bn: "তর্জনী অঙ্গুলি", hi: "तर्जनी अंगुली" },
  "Middle finger": { en: "Middle finger", bn: "মধ্যমা অঙ্গুলি", hi: "मध्यमा अंगुली" },
  "Middle or Little finger": { en: "Middle or Little finger", bn: "মধ্যমা বা কনিষ্ঠা অঙ্গুলি", hi: "मध्यमा या कनिष्ठिका" },
};

export const KUNDLI_WEARING_DAYS: Record<string, Record<KundliLanguage, string>> = {
  "Sunday morning": { en: "Sunday morning", bn: "রবিবার প্রাতঃকালে", hi: "रविवार प्रातःकाल" },
  "Monday morning": { en: "Monday morning", bn: "সোমবার প্রাতঃকালে", hi: "सोमवार प्रातःकाल" },
  "Tuesday morning": { en: "Tuesday morning", bn: "মঙ্গলবার প্রাতঃকালে", hi: "मंगलवार प्रातःकाल" },
  "Wednesday morning": { en: "Wednesday morning", bn: "বুধবার প্রাতঃকালে", hi: "बुधवार प्रातःकाल" },
  "Thursday morning": { en: "Thursday morning", bn: "বৃহস্পতিবার প্রাতঃকালে", hi: "गुरुवार प्रातःकाल" },
  "Friday morning": { en: "Friday morning", bn: "শুক্রবার প্রাতঃকালে", hi: "शुक्रवार प्रातःकाल" },
  "Saturday evening": { en: "Saturday evening", bn: "শনিবার গোধূলি লগ্নে", hi: "शनिवार सायंकाल" },
};

export function translateMetal(metal: string, lang: KundliLanguage): string {
  if (!metal) return "";
  return KUNDLI_METALS[metal.trim()]?.[lang] || metal;
}

export function translateFinger(finger: string, lang: KundliLanguage): string {
  if (!finger) return "";
  return KUNDLI_FINGERS[finger.trim()]?.[lang] || finger;
}

export function translateWearingDay(day: string, lang: KundliLanguage): string {
  if (!day) return "";
  return KUNDLI_WEARING_DAYS[day.trim()]?.[lang] || day;
}

// 14. UI Elements Dictionary
export interface KundliUiStrings {
  badge: string;
  title: string;
  subtitle: string;
  formTitle: string;
  nameLabel: string;
  namePlaceholder: string;
  genderLabel: string;
  dobLabel: string;
  tobLabel: string;
  placeLabel: string;
  advancedSettings: string;
  ayanamsaLabel: string;
  houseSystemLabel: string;
  calculateBtn: string;
  calculating: string;
  createNewKundli: string;
  saveKundli: string;
  editDetails: string;
  profileTitle: string;
  kundliDetailsTitle: string;
  personalDetailsCard: string;
  astronomicalInfoCard: string;
  astroPositionsCard: string;
  planetaryInfoCard: string;
  chartStyleTitle: string;
  lagnaChartTitle: string;
  navamsaChartTitle: string;
  rasiChartTitle: string;
  divisionalChartsTitle: string;
  planetTableTitle: string;
  houseTableTitle: string;
  vimshottariDashaTitle: string;
  yogaAnalysisTitle: string;
  kundliYogaBanner: string;
  presentBadge: string;
  notPresentBadge: string;
  downloadBtn: string;
  consultBtn: string;
  thPlanet: string;
  thHouse: string;
  thLongitude: string;
  thNakshatra: string;
  thNakshatraLord: string;
  thPada: string;
  thSubLord: string;
  thFullDegree: string;
  thAntarDasha: string;
  thDuration: string;
  thEndDate: string;
  lblAscLord: string;
  lblAsc: string;
  lblYoga: string;
  lblTithi: string;
  lblSunset: string;
  lblSunrise: string;
  lblBalDasa: string;
  lblKaran: string;
  lblRasiLord: string;
  lblRasi: string;
  lblJulianDay: string;
  lblAyanType: string;
  lblHouseSystem: string;
  lblPlace: string;
  lblLatitude: string;
  lblLongitude: string;
  lblDay: string;
  lblVedicDay: string;

  // Toast & Validation
  toastEnterName: string;
  toastEnterDob: string;
  toastChoosePlace: string;
  toastProfileLoaded: string;
  toastDisabled: string;
  toastSuccess: string;
  toastSuccessCoins: (coins: number) => string;
  toastSaved: string;

  // Header & Profile Banner
  languageLabel: string;
  profileSynced: string;
  profileSyncSub: string;
  reloadBtn: string;
  clearBtn: string;
  signInPrompt: string;
  signInBtn: string;

  // Form Fields
  genderMale: string;
  genderFemale: string;
  genderOther: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  tobOptional: string;
  calculationFee: string;
  freeBadge: string;
  coinsBadge: string;

  // Dasha Banner
  currentRunningDasha: string;
  dashaEndsLabel: string;

  // Chart Styles
  styleNorth: string;
  styleEast: string;
  styleSouth: string;
  styleDiamond: string;

  // Tables
  dignitiesTableTitle: string;
  dignitiesTableSub: string;
  thDignity: string;
  thAvastha: string;
  thCombustion: string;
  thSpecialYoga: string;
  retroTag: string;
  houseSuffix: string;
  combustTag: string;
  normalTag: string;
  neechabhangaTag: string;

  // 12 Houses
  housesSynthesisTitle: string;
  housesSynthesisSub: string;
  houseOverviewLabel: string;
  houseTitleSuffix: string;
  signLabel: string;
  lordLabel: string;
  placementSuffix: string;
  occupantsLabel: string;
  emptyHouseNote: string;
  significanceLabel: string;
  careerWealthLabel: string;
  familyRelationshipsLabel: string;

  // Divisional Charts
  d10Title: string;
  d10Sub: string;
  d7Title: string;
  d7Sub: string;
  d1Desc: string;
  d9Desc: string;
  d10Desc: string;
  d7Desc: string;
  d1Tab: string;
  d9Tab: string;
  d10Tab: string;
  d7Tab: string;

  // Yogas & Doshas
  extendedYogasTitle: string;
  extendedYogasSub: string;
  effectsLabel: string;
  doshasAnalysisTitle: string;
  doshasAnalysisSub: string;
  doshaActive: string;
  doshaClean: string;
  doshaTypeLabel: string;
  cancellationLabel: string;
  remedyLabel: string;

  // Remedies & Gemstones
  remediesTitle: string;
  remediesSub: string;
  lifeStoneTitle: string;
  lifeStoneBadge: string;
  luckyStoneTitle: string;
  luckyStoneBadge: string;
  careerStoneTitle: string;
  careerStoneBadge: string;
  metalLabel: string;
  fingerLabel: string;
  wearingDayLabel: string;
  rudrakshaTitle: string;
  ishtaDevataTitle: string;
  favorableElementsTitle: string;
  favorableDirectionLabel: string;
  favorableColorsLabel: string;
  favorableNumbersLabel: string;
}

export const KUNDLI_UI_STRINGS: Record<KundliLanguage, KundliUiStrings> = {
  bn: {
    badge: "বৈদিক জ্যোতিষশাস্ত্র ভিত্তিক নির্ভুল কুন্ডলী ক্যালকুলেটর",
    title: "জন্মতারিখ দিয়ে কুন্ডলী ও গ্রহের অবস্থান — সম্পূর্ণ ফ্রি",
    subtitle:
      "সঠিক লগ্ন, ১২টি ভাব, নবাংশ (D9) চার্ট, বিংশোত্তরী দশা ও বৈদিক যোগের পূর্ণাঙ্গ বিশ্লেষণ।",
    formTitle: "আপনার জন্ম বিবরণ পূরণ করুন",
    nameLabel: "নাম",
    namePlaceholder: "আপনার নাম লিখুন...",
    genderLabel: "লিঙ্গ",
    dobLabel: "জন্মতারিখ",
    tobLabel: "জন্মসময়",
    placeLabel: "জন্মস্থান",
    advancedSettings: "উন্নত সেটিংস (অয়নাংশ ও ভাব পদ্ধতি)",
    ayanamsaLabel: "অয়নাংশ পদ্ধতি",
    houseSystemLabel: "ভাব গণনা পদ্ধতি",
    calculateBtn: "কুন্ডলী গণনা করুন",
    calculating: "কুন্ডলী গণনা করা হচ্ছে...",
    createNewKundli: "নতুন কুন্ডলী তৈরি করুন",
    saveKundli: "কুন্ডলী সংরক্ষণ করুন",
    editDetails: "বিবরণ পরিবর্তন করুন",
    profileTitle: "প্রোফাইল",
    kundliDetailsTitle: "কুন্ডলী বিবরণ ও চার্ট",
    personalDetailsCard: "ব্যক্তিগত বিবরণ",
    astronomicalInfoCard: "জ্যোতির্বৈজ্ঞানিক তথ্য",
    astroPositionsCard: "জ্যোতিষ অবস্থান",
    planetaryInfoCard: "গ্রহ ও নক্ষত্র তথ্য",
    chartStyleTitle: "চার্ট শৈলী নির্বাচন করুন",
    lagnaChartTitle: "লগ্ন কুন্ডলী (D1)",
    navamsaChartTitle: "নবাংশ চার্ট (D9)",
    rasiChartTitle: "পূর্ণ রাশি চক্র (D1)",
    divisionalChartsTitle: "বর্গ কুন্ডলী (Divisional Charts)",
    planetTableTitle: "গ্রহের অবস্থান ও সাব লর্ড",
    houseTableTitle: "ভাব চালিত বিবরণ",
    vimshottariDashaTitle: "বিংশোত্তরী দশা",
    yogaAnalysisTitle: "বৈদিক যোগ ও দোষ বিশ্লেষণ",
    kundliYogaBanner: "কুন্ডলী যোগ ও দোষ",
    presentBadge: "উপস্থিত",
    notPresentBadge: "অনুপস্থিত",
    downloadBtn: "ডাউনলোড",
    consultBtn: "জ্যোতিষীর পরামর্শ",
    thPlanet: "গ্রহ",
    thHouse: "ভাব",
    thLongitude: "ডিগ্রি ও রাশি",
    thNakshatra: "নক্ষত্র",
    thNakshatraLord: "নক্ষত্র পতি",
    thPada: "পদ",
    thSubLord: "সাব লর্ড",
    thFullDegree: "মোট দ্রাঘিমা",
    thAntarDasha: "অন্তর্দশা",
    thDuration: "মেয়াদ",
    thEndDate: "শেষের তারিখ",
    lblAscLord: "লগ্ন অধিপতি",
    lblAsc: "লগ্ন",
    lblYoga: "যোগ",
    lblTithi: "তিথি",
    lblSunset: "সূর্যাস্ত",
    lblSunrise: "সূর্যোদয়",
    lblBalDasa: "জন্মকালীন দশা ব্যালেন্স",
    lblKaran: "করণ",
    lblRasiLord: "রাশি অধিপতি",
    lblRasi: "চন্দ্র রাশি",
    lblJulianDay: "জুলিয়ান দিন",
    lblAyanType: "অয়নাংশ",
    lblHouseSystem: "ভাব পদ্ধতি",
    lblPlace: "জন্মস্থান",
    lblLatitude: "অক্ষাংশ",
    lblLongitude: "দ্রাঘিমাংশ",
    lblDay: "বার (দিন)",
    lblVedicDay: "বৈদিক বার",

    // Toast & Validation
    toastEnterName: "অনুগ্রহ করে আপনার নাম লিখুন",
    toastEnterDob: "সঠিক জন্মতারিখ (দিন, মাস ও সাল) প্রদান করুন",
    toastChoosePlace: "অনুগ্রহ করে তালিকা থেকে আপনার জন্মস্থান নির্বাচন করুন",
    toastProfileLoaded: "প্রোফাইল থেকে তথ্য লোড করা হয়েছে",
    toastDisabled: "কুন্ডলী ফিচারটি বর্তমানে অ্যাডমিন দ্বারা বন্ধ রাখা হয়েছে।",
    toastSuccess: "কুন্ডলী ও গ্রহের অবস্থান সফলভাবে গণনা সম্পন্ন হয়েছে!",
    toastSuccessCoins: (coins: number) => `কুন্ডলী গণনা সম্পন্ন হয়েছে! (${coins} কয়েন খরচ হয়েছে)`,
    toastSaved: "কুন্ডলী আপনার অ্যাকাউন্টে সংরক্ষিত হয়েছে!",

    // Header & Profile Banner
    languageLabel: "ভাষা / Language:",
    profileSynced: "প্রোফাইল তথ্য লোড করা হয়েছে",
    profileSyncSub: "আপনার সংরক্ষিত জন্ম বিবরণ স্বয়ংক্রিয়ভাবে যুক্ত হয়েছে",
    reloadBtn: "রিলোড",
    clearBtn: "খালি করুন",
    signInPrompt: "আপনার সংরক্ষিত বিবরণ স্বয়ংক্রিয়ভাবে পূরণ করতে লগ-ইন করুন",
    signInBtn: "লগ-ইন করুন",

    // Form Fields
    genderMale: "পুরুষ (Male)",
    genderFemale: "মহিলা (Female)",
    genderOther: "অন্যান্য (Other)",
    dobDay: "দিন (DD)",
    dobMonth: "মাস (MM)",
    dobYear: "সাল (YYYY)",
    tobOptional: "ঐচ্ছিক — না দিলে ১২:০০ PM",
    calculationFee: "গণনা খরচ",
    freeBadge: "সম্পূর্ণ ফ্রি",
    coinsBadge: "কয়েন",

    // Dasha Banner
    currentRunningDasha: "চলমান বিংশোত্তরী দশা মার্গদর্শন",
    dashaEndsLabel: "সমাপ্তি:",

    // Chart Styles
    styleNorth: "উত্তর ভারত",
    styleEast: "পূর্ব ভারত",
    styleSouth: "দক্ষিণ ভারত",
    styleDiamond: "ডায়মন্ড চার্ট",

    // Tables
    dignitiesTableTitle: "গ্রহের বলবত্তা, দগ্ধাবস্থা ও পঞ্চাবস্থা বিচার",
    dignitiesTableSub: "পরাশর হোরা শাস্ত্র অনুসারে প্রতিটি গ্রহের উচ্চ/নীচ বলবত্তা, সূর্যের সান্নিধ্যে দগ্ধাবস্থা এবং জাগ্রত শক্তির মাত্রা।",
    thDignity: "বলবত্তা (Dignity)",
    thAvastha: "পঞ্চাবস্থা",
    thCombustion: "দগ্ধাবস্থা",
    thSpecialYoga: "বিশেষ মর্যাদা",
    retroTag: "বক্রী",
    houseSuffix: "ম ভাব",
    combustTag: "সূর্যদগ্ধ",
    normalTag: "অক্ষত",
    neechabhangaTag: "নীচভঙ্গ রাজযোগ",

    // 12 Houses
    housesSynthesisTitle: "দ্বাদশ ভাব ও জীবনের ১২টি ক্ষেত্রের ফলাফল",
    housesSynthesisSub: "আপনার কুন্ডলীর প্রতিটি ভাবের রাশিপতি, অবস্থানরত গ্রহ এবং ক্যারিয়ার, অর্থ ও সম্পর্কের ওপর প্রভাব।",
    houseOverviewLabel: "ভাব পরিচয়",
    houseTitleSuffix: "ম ভাব:",
    signLabel: "রাশি:",
    lordLabel: "ভাবাধিপতি:",
    placementSuffix: "মে অবস্থান",
    occupantsLabel: "অবস্থানরত গ্রহ:",
    emptyHouseNote: "কোন প্রত্যক্ষ গ্রহ নেই (দৃষ্টির প্রভাব প্রযোজ্য)",
    significanceLabel: "মূল তাৎপর্য",
    careerWealthLabel: "কর্ম ও অর্থভাগ্য",
    familyRelationshipsLabel: "সম্পর্ক ও পারিবারিক সুখ",

    // Divisional Charts
    d10Title: "দশমাংশ চক্র (D10) — কর্ম ও রাজসম্মান",
    d10Sub: "দশমাংশ কুন্ডলী (D10) কর্মজীবন, পেশাগত সাফল্য, পদমর্যাদা, খ্যাতি এবং সমাজে অর্জিত প্রতিষ্ঠা নির্দেশ করে।",
    d7Title: "সপ্তাংশ চক্র (D7) — সন্তান ও সৃজনশীলতা",
    d7Sub: "সপ্তাংশ কুন্ডলী (D7) সন্তানসুখ, বংশধর, উদ্ভাবনী ক্ষমতা এবং সৃষ্টিশীল মেধা নির্দেশ করে।",
    d1Desc: "लग्न কুন্ডলী (D1) সমগ্র মানবজীবনের শারীরিক গঠন, স্বাস্থ্য, প্রবৃত্তি এবং ভাগ্যের মূল স্তম্ভ নির্দেশ করে।",
    d9Desc: "নবাংশ কুন্ডলী (D9) আত্মার অন্তর্নিহিত শক্তি, আধ্যাত্মিক সাধনা এবং দাম্পত্য জীবনের পূর্ণতা নির্দেশ করে।",
    d10Desc: "দশমাংশ কুন্ডলী (D10) কর্মজীবন, পেশাগত সাফল্য, পদমর্যাদা, খ্যাতি এবং সমাজে অর্জিত প্রতিষ্ঠা নির্দেশ করে।",
    d7Desc: "সপ্তাংশ কুন্ডলী (D7) সন্তানসুখ, বংশধর, উদ্ভাবনী ক্ষমতা এবং সৃষ্টিশীল মেধা নির্দেশ করে।",
    d1Tab: "D1: লগ্ন ছক (সাধারণ জীবন)",
    d9Tab: "D9: নবাংশ ছক (দাম্পত্য ও ভাগ্য)",
    d10Tab: "D10: দশমাংশ ছক (ক্যারিয়ার ও পদমর্যাদা)",
    d7Tab: "D7: সপ্তাংশ ছক (সন্তান ও সৃজনশীলতা)",

    // Yogas & Doshas
    extendedYogasTitle: "পঞ্চ মহাপুরুষ, রাজযোগ ও ধনযোগ বিশ্লেষণ",
    extendedYogasSub: "পরাশর হোরা শাস্ত্র ও জাতক পারিজাত অনুসারে গঠিত বিশেষ গ্রহ সংস্থান ও জীবনের শুভ ফলাফল।",
    effectsLabel: "প্রভাব:",
    doshasAnalysisTitle: "প্রধান বৈদিক দোষ বিশ্লেষণ ও প্রতিকার",
    doshasAnalysisSub: "মাঙ্গলিক, কালসর্প, পিতৃ ও গুরু চণ্ডাল দোষের গভীর বিচার, ভঙ্গ নির্ণয় এবং নিশ্চিত বৈদিক প্রতিকার।",
    doshaActive: "সক্রিয়",
    doshaClean: "দোষমুক্ত / প্রশমিত",
    doshaTypeLabel: "প্রকৃতি:",
    cancellationLabel: "দোষভঙ্গ যোগ:",
    remedyLabel: "প্রস্তাবিত বৈদিক প্রতিকার:",

    // Remedies & Gemstones
    remediesTitle: "ব্যক্তিগত রত্ন, রুদ্রাক্ষ ও ইষ্টদেবতা নির্দেশিকা",
    remediesSub: "বৃহৎ সংহিতা ও জাতক পারিজাত মতে আপনার কুণ্ডলীর ত্রিকোণাধিপতি অনুযায়ী প্রাণ রত্ন, ভাগ্য রত্ন ও রুদ্রাক্ষ বিধান।",
    lifeStoneTitle: "প্রাণ রত্ন (লগ্ন রত্ন)",
    lifeStoneBadge: "১ম ভাবাধিপতি",
    luckyStoneTitle: "ভাগ্য রত্ন (ত্রিকোণ রত্ন)",
    luckyStoneBadge: "৯ম ভাবাধিপতি",
    careerStoneTitle: "কর্ম রত্ন (পেশাগত রত্ন)",
    careerStoneBadge: "১০ম ভাবাধিপতি",
    metalLabel: "ধাতু:",
    fingerLabel: "আঙুল:",
    wearingDayLabel: "ধারণের বার:",
    rudrakshaTitle: "অনুকূল রুদ্রাক্ষ",
    ishtaDevataTitle: "ইষ্টদেবতা ও সাধনা",
    favorableElementsTitle: "অনুকূল দিক, বর্ণ ও সংখ্যা",
    favorableDirectionLabel: "শুভ দিক:",
    favorableColorsLabel: "শুভ বর্ণ:",
    favorableNumbersLabel: "শুভ সংখ্যা:",
  },
  hi: {
    badge: "वैदिक ज्योतिष शास्त्र आधारित सटीक कुण्डली कैलकुलेटर",
    title: "जन्म तिथि से कुण्डली एवं ग्रह स्थिति — पूर्णतः निःशुल्क",
    subtitle:
      "सटीक लग्न, १२ भाव, नवांश (D9) चक्र, विंशोत्तरी दशा एवं वैदिक योगों का संपूर्ण विश्लेषण।",
    formTitle: "अपना जन्म विवरण दर्ज करें",
    nameLabel: "नाम",
    namePlaceholder: "अपना नाम लिखें...",
    genderLabel: "लिंग",
    dobLabel: "जन्म तिथि",
    tobLabel: "जन्म समय",
    placeLabel: "जन्म स्थान",
    advancedSettings: "उन्नत सेटिंग्स (अयनांश एवं भाव पद्धति)",
    ayanamsaLabel: "अयनांश प्रणाली",
    houseSystemLabel: "भाव गणना पद्धति",
    calculateBtn: "कुण्डली की गणना करें",
    calculating: "कुण्डली की गणना हो रही है...",
    createNewKundli: "नई कुण्डली बनाएं",
    saveKundli: "कुण्डली सहेजें",
    editDetails: "विवरण बदलें",
    profileTitle: "प्रोफ़ाइल",
    kundliDetailsTitle: "कुण्डली विवरण एवं चक्र",
    personalDetailsCard: "व्यक्तिगत विवरण",
    astronomicalInfoCard: "खगोलीय जानकारी",
    astroPositionsCard: "ज्योतिष स्थिति",
    planetaryInfoCard: "ग्रह व नक्षत्र स्थिति",
    chartStyleTitle: "चार्ट शैली चुनें",
    lagnaChartTitle: "लग्न कुण्डली (D1)",
    navamsaChartTitle: "नवांश कुण्डली (D9)",
    rasiChartTitle: "पूर्ण राशि चक्र (D1)",
    divisionalChartsTitle: "वर्ग कुण्डली (Divisional Charts)",
    planetTableTitle: "ग्रह स्थिति एवं सब लॉर्ड",
    houseTableTitle: "भाव चलित विवरण",
    vimshottariDashaTitle: "विंशोत्तरी दशा",
    yogaAnalysisTitle: "वैदिक योग एवं दोष विश्लेषण",
    kundliYogaBanner: "कुण्डली योग एवं दोष",
    presentBadge: "उपस्थित",
    notPresentBadge: "अनुपस्थित",
    downloadBtn: "डाउनलोड",
    consultBtn: "ज्योतिषी परामर्श",
    thPlanet: "ग्रह",
    thHouse: "भाव",
    thLongitude: "अंश व राशि",
    thNakshatra: "नक्षत्र",
    thNakshatraLord: "नक्षत्र स्वामी",
    thPada: "चरण / पद",
    thSubLord: "सब लॉर्ड",
    thFullDegree: "पूर्ण रेखांश",
    thAntarDasha: "अंतर्दशा",
    thDuration: "अवधि",
    thEndDate: "समाप्ति तिथि",
    lblAscLord: "लग्न स्वामी",
    lblAsc: "लग्न",
    lblYoga: "योग",
    lblTithi: "तिथि",
    lblSunset: "सूर्यास्त",
    lblSunrise: "सूर्योदय",
    lblBalDasa: "जन्म समय दशा शेष",
    lblKaran: "करण",
    lblRasiLord: "राशि स्वामी",
    lblRasi: "चन्द्र राशि",
    lblJulianDay: "जूलियन दिन",
    lblAyanType: "अयनांश",
    lblHouseSystem: "भाव पद्धति",
    lblPlace: "जन्म स्थान",
    lblLatitude: "अक्षांश",
    lblLongitude: "रेखांश",
    lblDay: "वार (दिन)",
    lblVedicDay: "वैदिक वार",

    // Toast & Validation
    toastEnterName: "कृपया अपना नाम दर्ज करें",
    toastEnterDob: "कृपया मान्य जन्म तिथि दर्ज करें",
    toastChoosePlace: "कृपया सूची से अपना जन्म स्थान चुनें",
    toastProfileLoaded: "प्रोफ़ाइल से जानकारी लोड की गई",
    toastDisabled: "कुंडली सुविधा वर्तमान में अनुपलब्ध है।",
    toastSuccess: "कुण्डली एवं ग्रह स्थिति की सफल गणना हो गई!",
    toastSuccessCoins: (coins: number) => `कुण्डली गणना पूर्ण! (${coins} सिक्के प्रयुक्त)`,
    toastSaved: "कुण्डली आपके खाते में सुरक्षित हो गई है!",

    // Header & Profile Banner
    languageLabel: "भाषा / Language:",
    profileSynced: "प्रोफ़ाइल जानकारी लोड की गई",
    profileSyncSub: "आपका सहेजा गया जन्म विवरण स्वतः भर दिया गया है",
    reloadBtn: "रीलोड",
    clearBtn: "साफ़ करें",
    signInPrompt: "सहेजे गए विवरण को स्वतः भरने के लिए लॉग-इन करें",
    signInBtn: "लॉग-इन करें",

    // Form Fields
    genderMale: "पुरुष (Male)",
    genderFemale: "महिला (Female)",
    genderOther: "अन्य (Other)",
    dobDay: "दिन (DD)",
    dobMonth: "माह (MM)",
    dobYear: "वर्ष (YYYY)",
    tobOptional: "वैकल्पिक — 12:00 PM",
    calculationFee: "गणना शुल्क",
    freeBadge: "पूर्णतः निःशुल्क",
    coinsBadge: "सिक्के",

    // Dasha Banner
    currentRunningDasha: "वर्तमान विंशोत्तरी दशा मार्गदर्शन",
    dashaEndsLabel: "समाप्ति:",

    // Chart Styles
    styleNorth: "उत्तर भारत",
    styleEast: "पूर्व भारत",
    styleSouth: "दक्षिण भारत",
    styleDiamond: "डायमंड चक्र",

    // Tables
    dignitiesTableTitle: "ग्रहों का बलाबल, दग्धावस्था एवं पंचावस्था",
    dignitiesTableSub: "पाराशर होरा शास्त्र के अनुसार ग्रहों की उच्च/नीच स्थिति, अस्त अवस्था एवं बाल्यादि जाग्रत शक्ति का विश्लेषण।",
    thDignity: "बलावस्था (Dignity)",
    thAvastha: "पंचावस्था",
    thCombustion: "दग्धावस्था",
    thSpecialYoga: "विशेष मर्यादा",
    retroTag: "वक्री",
    houseSuffix: " भाव",
    combustTag: "सूर्य अस्त",
    normalTag: "सामान्य",
    neechabhangaTag: "नीचभंग राजयोग",

    // 12 Houses
    housesSynthesisTitle: "द्वादश भाव एवं जीवन के १२ क्षेत्रों का फल",
    housesSynthesisSub: "आपकी कुण्डली के प्रत्येक भाव के भावेश, स्थित ग्रह एवं आजीविका, धन व संबंधों पर प्रभाव का विश्लेषण।",
    houseOverviewLabel: "भाव परिचय",
    houseTitleSuffix: "वां भाव:",
    signLabel: "राशि:",
    lordLabel: "भावेश:",
    placementSuffix: "वें भाव में स्थिति",
    occupantsLabel: "स्थित ग्रह:",
    emptyHouseNote: "कोई प्रत्यक्ष ग्रह नहीं (दृष्टि प्रभाव लागू)",
    significanceLabel: "मूल तात्पर्य",
    careerWealthLabel: "करियर एवं धन भाग्य",
    familyRelationshipsLabel: "संबंध एवं पारिवारिक सुख",

    // Divisional Charts
    d10Title: "दशमांश चक्र (D10) — कर्म व राजसम्मान",
    d10Sub: "दशमांश कुण्डली (D10) आजीविका, व्यावसायिक सफलता, पद-प्रतिष्ठा और सामाजिक ख्याति को दर्शाती है।",
    d7Title: "सप्तांश चक्र (D7) — संतान व रचनात्मकता",
    d7Sub: "सप्तांश कुण्डली (D7) संतान सुख, वंश वृद्धि, रचनात्मक प्रतिभा एवं नवाचार क्षमता का विश्लेषण करती है।",
    d1Desc: "लग्न कुण्डली (D1) मानव जीवन की शारीरिक संरचना, स्वास्थ्य, स्वभाव एवं समग्र भाग्य का आधार है।",
    d9Desc: "नवांश कुण्डली (D9) आत्मा की आंतरिक शक्ति, आध्यात्मिक उन्नति एवं दांपत्य जीवन की स्थिरता का कारक है।",
    d10Desc: "दशमांश कुण्डली (D10) आजीविका, व्यावसायिक सफलता, पद-प्रतिष्ठा और सामाजिक ख्याति को दर्शाती है।",
    d7Desc: "सप्तांश कुण्डली (D7) संतान सुख, वंश वृद्धि, रचनात्मक प्रतिभा एवं नवाचार क्षमता का विश्लेषण करती है।",
    d1Tab: "D1: लग्न कुंडली (जीवन)",
    d9Tab: "D9: नवांश कुंडली (भाग्य/दांपत्य)",
    d10Tab: "D10: दशमांश कुंडली (करियर)",
    d7Tab: "D7: सप्तांश कुंडली (संतान)",

    // Yogas & Doshas
    extendedYogasTitle: "पंच महापुरुष, राजयोग एवं धनयोग विश्लेषण",
    extendedYogasSub: "पाराशर होरा शास्त्र एवं जातक पारिजात के अनुसार विशेष ग्रहीय युति एवं शुभ जीवन फल।",
    effectsLabel: "प्रभाव:",
    doshasAnalysisTitle: "प्रमुख वैदिक दोष विश्लेषण एवं उपाय",
    doshasAnalysisSub: "मांगलिक, कालसर्प, पितृ एवं गुरु चांडाल दोष का गहन परीक्षण, भंग योग एवं प्रामाणिक वैदिक उपाय।",
    doshaActive: "सक्रिय",
    doshaClean: "दोषमुक्त / शांत",
    doshaTypeLabel: "प्रकृति:",
    cancellationLabel: "दोषभंग योग:",
    remedyLabel: "प्रस्तावित वैदिक उपाय:",

    // Remedies & Gemstones
    remediesTitle: "व्यक्तिगत रत्न, रुद्राक्ष एवं इष्टदेवता मार्गदर्शन",
    remediesSub: "बृहत्संहिता एवं जातक पारिजात के अनुसार आपकी कुण्डली के त्रिकोण स्वामियों के आधार पर प्राण रत्न, भाग्य रत्न एवं रुद्राक्ष निर्देश।",
    lifeStoneTitle: "प्राण रत्न (लग्न रत्न)",
    lifeStoneBadge: "प्रथम भावेश (१)",
    luckyStoneTitle: "भाग्य रत्न (त्रिकोण रत्न)",
    luckyStoneBadge: "नवम भावेश (९)",
    careerStoneTitle: "कर्म रत्न (आजीविका रत्न)",
    careerStoneBadge: "दशम भावेश (१०)",
    metalLabel: "धातु:",
    fingerLabel: "अंगुली:",
    wearingDayLabel: "धारण वार:",
    rudrakshaTitle: "अनुकूल रुद्राक्ष",
    ishtaDevataTitle: "इष्टदेवता एवं साधना",
    favorableElementsTitle: "अनुकूल दिशा, रंग एवं अंक",
    favorableDirectionLabel: "शुभ दिशा:",
    favorableColorsLabel: "शुभ रंग:",
    favorableNumbersLabel: "शुभ अंक:",
  },
  en: {
    badge: "Vedic Astrology Certified Accurate Kundli Calculator",
    title: "Birth Chart & Planetary Position — 100% Free",
    subtitle:
      "Accurate Lagna, 12 Bhavas, Navamsha (D9) Chart, Vimshottari Dasha, and Classical Vedic Yogas.",
    formTitle: "Enter Birth Details",
    nameLabel: "Name",
    namePlaceholder: "Enter your name...",
    genderLabel: "Gender",
    dobLabel: "Birth Date",
    tobLabel: "Birth Time",
    placeLabel: "Birth Place",
    advancedSettings: "Advanced Settings (Ayanamsa & House System)",
    ayanamsaLabel: "Ayanamsa System",
    houseSystemLabel: "House System",
    calculateBtn: "Calculate Kundli",
    calculating: "Calculating Kundli...",
    createNewKundli: "Create New Kundli",
    saveKundli: "Save Kundli",
    editDetails: "Edit Details",
    profileTitle: "Profile",
    kundliDetailsTitle: "Kundli Details & Chart",
    personalDetailsCard: "PERSONAL DETAILS",
    astronomicalInfoCard: "ASTRONOMICAL INFO",
    astroPositionsCard: "ASTRO POSITIONS",
    planetaryInfoCard: "PLANETARY INFO",
    chartStyleTitle: "Choose Chart Style",
    lagnaChartTitle: "Lagna Chart (D1)",
    navamsaChartTitle: "Navamsa Chart (D9)",
    rasiChartTitle: "RASI CHART (D1)",
    divisionalChartsTitle: "Divisional Charts",
    planetTableTitle: "Planet Positions",
    houseTableTitle: "House Positions",
    vimshottariDashaTitle: "Vimshottari Dasha",
    yogaAnalysisTitle: "Vedic Yoga & Dosha Analysis",
    kundliYogaBanner: "Kundli Yoga",
    presentBadge: "Present",
    notPresentBadge: "Not Present",
    downloadBtn: "Download",
    consultBtn: "Consult",
    thPlanet: "Planet",
    thHouse: "House",
    thLongitude: "Longitude",
    thNakshatra: "Nakshatra",
    thNakshatraLord: "Nakshatra Lord",
    thPada: "Pada",
    thSubLord: "Sub Lord",
    thFullDegree: "Full Degree",
    thAntarDasha: "Antar Dasha",
    thDuration: "Duration",
    thEndDate: "End Date",
    lblAscLord: "Asc Lord",
    lblAsc: "Asc",
    lblYoga: "Yoga",
    lblTithi: "Tithi",
    lblSunset: "Sunset",
    lblSunrise: "Sunrise",
    lblBalDasa: "Bal. Dasa",
    lblKaran: "Karan",
    lblRasiLord: "Rasi Lord",
    lblRasi: "Rasi",
    lblJulianDay: "Julian Day",
    lblAyanType: "Ayan Type",
    lblHouseSystem: "House",
    lblPlace: "Place",
    lblLatitude: "Latitude",
    lblLongitude: "Longitude",
    lblDay: "Day",
    lblVedicDay: "Vedic Day",

    // Toast & Validation
    toastEnterName: "Please enter your name",
    toastEnterDob: "Please enter a valid birth date (DD, MM, YYYY)",
    toastChoosePlace: "Please choose your birth place from the list",
    toastProfileLoaded: "Details reloaded from your profile",
    toastDisabled: "Kundli feature is temporarily unavailable.",
    toastSuccess: "Kundli & Planetary Position calculated successfully!",
    toastSuccessCoins: (coins: number) => `Kundli calculated! (${coins} coins used)`,
    toastSaved: "Kundli saved to your account!",

    // Header & Profile Banner
    languageLabel: "Language:",
    profileSynced: "Profile Details Synced",
    profileSyncSub: "Your saved birth details have been auto-filled",
    reloadBtn: "Reload",
    clearBtn: "Clear",
    signInPrompt: "Sign in to auto-fill your saved details",
    signInBtn: "Sign In",

    // Form Fields
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    dobDay: "Day (DD)",
    dobMonth: "Month (MM)",
    dobYear: "Year (YYYY)",
    tobOptional: "Optional — 12:00 PM if omitted",
    calculationFee: "Calculation Fee",
    freeBadge: "100% Free",
    coinsBadge: "coins",

    // Dasha Banner
    currentRunningDasha: "Current Vimshottari Dasha Insight",
    dashaEndsLabel: "Ends:",

    // Chart Styles
    styleNorth: "North",
    styleEast: "East",
    styleSouth: "South",
    styleDiamond: "Diamond Chart",

    // Tables
    dignitiesTableTitle: "Planetary Dignities, Combustion & Avasthas",
    dignitiesTableSub: "Classical Brihat Parashara analysis of planetary dignity, combustion and operational vitality.",
    thDignity: "Dignity",
    thAvastha: "Avastha",
    thCombustion: "Combustion",
    thSpecialYoga: "Special Yoga",
    retroTag: "Retro",
    houseSuffix: "th House",
    combustTag: "Combust",
    normalTag: "Normal",
    neechabhangaTag: "Neechabhanga",

    // 12 Houses
    housesSynthesisTitle: "12 Houses Deep Astrological Synthesis",
    housesSynthesisSub: "Comprehensive house-by-house analysis of career, wealth, health and relationships.",
    houseOverviewLabel: "House Overview",
    houseTitleSuffix: "th House:",
    signLabel: "Sign:",
    lordLabel: "Lord:",
    placementSuffix: "th house placement",
    occupantsLabel: "Occupants:",
    emptyHouseNote: "No direct occupants (aspectual influence applies)",
    significanceLabel: "Significance",
    careerWealthLabel: "Career & Wealth",
    familyRelationshipsLabel: "Family & Relationships",

    // Divisional Charts
    d10Title: "Dasamsha Chart (D10) — Career & Honor",
    d10Sub: "Dasamsha Chart (D10) governs profession, authority, achievements and social stature.",
    d7Title: "Saptamsha Chart (D7) — Children & Creativity",
    d7Sub: "Saptamsha Chart (D7) governs children, progeny, lineage and creative intellect.",
    d1Desc: "Lagna Chart (D1) represents the foundational core, physical life, vitality and basic destiny.",
    d9Desc: "Navamsha Chart (D9) reveals soul destiny, spiritual evolution and marriage longevity.",
    d10Desc: "Dasamsha Chart (D10) governs profession, authority, achievements and social stature.",
    d7Desc: "Saptamsha Chart (D7) governs children, progeny, lineage and creative intellect.",
    d1Tab: "D1: Rasi (Foundation)",
    d9Tab: "D9: Navamsha (Destiny)",
    d10Tab: "D10: Dasamsha (Career)",
    d7Tab: "D7: Saptamsha (Children)",

    // Yogas & Doshas
    extendedYogasTitle: "Pancha Mahapurusha, Raj Yogas & Dhana Yogas",
    extendedYogasSub: "Classical Vedic planetary configurations conferring wealth, authority, wisdom and fortune.",
    effectsLabel: "Effects:",
    doshasAnalysisTitle: "Classical Vedic Dosha Analysis & Remedies",
    doshasAnalysisSub: "Authentic Parashari checks for Manglik, Kaal Sarp, Pitra and Guru Chandal doshas.",
    doshaActive: "Active",
    doshaClean: "Clean / Cancelled",
    doshaTypeLabel: "Type:",
    cancellationLabel: "Cancellation:",
    remedyLabel: "Recommended Remedy:",

    // Remedies & Gemstones
    remediesTitle: "Personalized Gemstones, Rudraksha & Ishta Devata Guide",
    remediesSub: "Classical Brihat Samhita prescriptions for Life Stone, Lucky Stone, Rudraksha and Ishta Devata.",
    lifeStoneTitle: "Life Stone (Lagna Stone)",
    lifeStoneBadge: "1st Lord",
    luckyStoneTitle: "Lucky Stone (Fortune Stone)",
    luckyStoneBadge: "9th Lord",
    careerStoneTitle: "Career Stone",
    careerStoneBadge: "10th Lord",
    metalLabel: "Metal:",
    fingerLabel: "Finger:",
    wearingDayLabel: "Day:",
    rudrakshaTitle: "Auspicious Rudraksha",
    ishtaDevataTitle: "Ishta Devata",
    favorableElementsTitle: "Favorable Elements",
    favorableDirectionLabel: "Direction:",
    favorableColorsLabel: "Colors:",
    favorableNumbersLabel: "Numbers:",
  },
};
