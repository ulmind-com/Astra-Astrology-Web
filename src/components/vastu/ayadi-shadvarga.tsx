"use client";

import * as React from "react";
import {
  Calculator,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Layers,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  Printer,
  Sliders,
  Ruler,
  Maximize2,
  Building2,
  ShieldCheck,
  Moon,
  Sun,
  Shield,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { vastuApi } from "@/lib/api";
import type { AyadiCalculationResponse } from "@/types/vastu";
import type { AstrologyLanguage } from "@/types";
import { VASTU_I18N } from "@/lib/vastu-translations";

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_NAMES_BN = [
  "অশ্বিনী", "ভরণী", "কৃত্তিকা", "রোহিণী", "মৃগশিরা", "আর্দ্রা",
  "পুনর্বসু", "পুষ্যা", "অশ্লেষা", "মঘা", "পূর্বফল্গুনী", "উত্তরফল্গুনী",
  "হস্তা", "চিত্রা", "স্বাতী", "বিশাখা", "অনুরাধা", "জ্যেষ্ঠা",
  "মূলা", "পূর্বাষাঢ়া", "উত্তরাষাঢ়া", "শ্রবণা", "ধনিষ্ঠা",
  "শতভিষা", "পূর্ব ভাদ্রপদ", "উত্তর ভাদ্রপদ", "রেবতী",
];

const AAYA_DATA: Record<number, { name: string; name_bn: string; auspicious: boolean; significance: string; directions: string[] }> = {
  1: { name: "Dhwaja Aaya", name_bn: "ধ্বজ আয় (১)", auspicious: true, significance: "ধ্বজ আয় — অপার অর্থপ্রাপ্তি, প্রতিষ্ঠা, রাজকীয় সম্মান ও দীর্ঘস্থায়ী ঐশ্বর্য নির্দেশ করে।", directions: ["পূর্ব (East)", "উত্তর (North)"] },
  2: { name: "Dhuma Aaya", name_bn: "ধূম্র আয় (২)", auspicious: false, significance: "ধূম্র আয় — অতিরিক্ত মানসিক উদ্বেগ, অগ্নিভয় ও আর্থিক অনিশ্চয়তা সৃষ্টি করে।", directions: ["প্রতিকার প্রয়োজন"] },
  3: { name: "Simha Aaya", name_bn: "সিংহ আয় (৩)", auspicious: true, significance: "সিংহ আয় — বিজয়, অতুলনীয় কর্তৃত্ব, সামাজিক খ্যাতি ও সর্বকাজে সাফল্য দেয়।", directions: ["দক্ষিণ (South)", "পূর্ব (East)"] },
  4: { name: "Shwana Aaya", name_bn: "শ্বান আয় (৪)", auspicious: false, significance: "শ্বান আয় — অপযশ, কলহ ও পরিবারের মধ্যে আত্মিক দূরত্বের কারণ হয়।", directions: ["প্রতিকার প্রয়োজন"] },
  5: { name: "Vrisha Aaya", name_bn: "বৃষভ আয় (৫)", auspicious: true, significance: "বৃষভ আয় — স্থাবর সম্পত্তি, বংশবৃদ্ধি, মানসিক স্থিরতা ও দীর্ঘমেয়াদী সমৃদ্ধি আনে।", directions: ["পশ্চিম (West)", "উত্তর (North)"] },
  6: { name: "Khara Aaya", name_bn: "খর আয় (৬)", auspicious: false, significance: "খর আয় — অতিরিক্ত শ্রম সত্ত্বেও অপ্রতুল প্রতিদান ও পরাধীনতার সৃষ্টি করে।", directions: ["প্রতিকার প্রয়োজন"] },
  7: { name: "Gaja Aaya", name_bn: "গজ আয় (৭)", auspicious: true, significance: "গজ আয় — রাজকীয় ঐশ্বর্য, সৌভাগ্য, মিত্রলাভ ও ব্যবসা-বাণিজ্যে অটল স্থায়িত্ব দেয়।", directions: ["উত্তর (North)", "পূর্ব (East)"] },
  8: { name: "Kaka Aaya", name_bn: "কাক আয় (৮)", auspicious: false, significance: "কাক আয় — অর্থনাশ, শোক ও পরিবারের অগ্রগতিতে অনাকাঙ্ক্ষিত বাধা তৈরি করে।", directions: ["প্রতিকার প্রয়োজন"] },
};

const YONI_DATA: Record<number, { name: string; name_bn: string; direction: string; significance: string }> = {
  1: { name: "Dhwaja", name_bn: "ধ্বজ যোনি (১)", direction: "পূর্ব (East)", significance: "অতুলনীয় খ্যাতি, সামাজিক প্রতিপত্তি ও দীর্ঘস্থায়ী সমৃদ্ধি দেয়।" },
  2: { name: "Dhuma", name_bn: "ধূম্র যোনি (২)", direction: "দক্ষিণ-পূর্ব (SE / অগ্নি)", significance: "উত্তেজনা, অগ্নিভয় ও আর্থিক অনিশ্চয়তা সৃষ্টি করতে পারে।" },
  3: { name: "Simha", name_bn: "সিংহ যোনি (৩)", direction: "দক্ষিণ (South)", significance: "বিজয়, শত্রু দমন, পরাক্রম ও সর্বকাজে রাজকীয় কর্তৃত্ব দেয়।" },
  4: { name: "Shwana", name_bn: "শ্বান যোনি (৪)", direction: "দক্ষিণ-পশ্চিম (SW / নৈঋত)", significance: "অশান্তি, কলহ ও পারিবারিক দূরত্বের সৃষ্টি করে।" },
  5: { name: "Vrisha", name_bn: "বৃষভ যোনি (৫)", direction: "পশ্চিম (West)", significance: "স্থাবর সম্পত্তি, বংশবৃদ্ধি, মানসিক স্থিরতা ও অর্থ স্থায়িত্ব আনে।" },
  6: { name: "Khara", name_bn: "খর যোনি (৬)", direction: "উত্তর-পশ্চিম (NW / বায়ু)", significance: "অতিরিক্ত শারীরিক শ্রম সত্ত্বেও অপ্রতুল ফল নির্দেশ করে।" },
  7: { name: "Gaja", name_bn: "গজ যোনি (৭)", direction: "উত্তর (North)", significance: "রাজকীয় ঐশ্বর্য, কুবেরের আশিস ও ব্যবসা-বাণিজ্যে অটল বৃদ্ধি।" },
  8: { name: "Kaka", name_bn: "কাক যোনি (৮)", direction: "উত্তর-পূর্ব (NE / ঈশান)", significance: "অর্থনাশ, মানসিক অবসাদ ও বাধার সৃষ্টি করে।" },
};

const VARNA_DATA: Record<number, { name: string; name_bn: string; significance: string }> = {
  1: { name: "Brahmin", name_bn: "ব্রাহ্মণ বর্ণ (জ্ঞানের প্রতিমূর্তি)", significance: "আধ্যাত্মিক জ্ঞান, মানসিক শান্তি, পবিত্রতা, অধ্যয়ন ও গবেষণার অনুকূল।" },
  2: { name: "Kshatriya", name_bn: "ক্ষত্রিয় বর্ণ (সুরক্ষা ও শক্তি)", significance: "নেতृत्व, বীরত্ব, রাজনৈতিক ও প্রশাসনিক কর্তৃত্ব এবং পারিবারিক পরাক্রম।" },
  3: { name: "Vaishya", name_bn: "বৈশ্য বর্ণ (বাণিজ্য ও প্রাচুর্য)", significance: "ব্যবসা-বাণিজ্য, লাভ, অর্থনৈতিক গতিশীলতা, নগদ প্রবাহ ও ধনসম্পদ।" },
  4: { name: "Shudra", name_bn: "শূদ্র বর্ণ (পরিশ্রম ও সেবা)", significance: "সেবামূলক সাফল্য, শিল্পকর্ম, উৎপাদনশীলতা ও কায়িক শ্রমের বিকাশ।" },
};

const TITHI_NAMES = [
  { en: "Shukla Pratipada", bn: "শুক্ল প্রতিপদ" },
  { en: "Shukla Dvitiya", bn: "শুক্ল দ্বিতীয়া" },
  { en: "Shukla Tritiya", bn: "শুক্ল তৃতীয়া" },
  { en: "Shukla Chaturthi", bn: "শুক্ল চতুর্থী" },
  { en: "Shukla Panchami", bn: "শুক্ল পঞ্চমী" },
  { en: "Shukla Shashthi", bn: "শুক্ল ষষ্ঠী" },
  { en: "Shukla Saptami", bn: "শুক্ল সপ্তমী" },
  { en: "Shukla Ashtami", bn: "শুক্ল অষ্টমী" },
  { en: "Shukla Navami", bn: "শুক্ল নবমী" },
  { en: "Shukla Dashami", bn: "শুক্ল দশমী" },
  { en: "Shukla Ekadashi", bn: "শুক্ল একাদশী" },
  { en: "Shukla Dvadashi", bn: "শুক্ল দ্বাদশী" },
  { en: "Shukla Trayodashi", bn: "শুক্ল ত্রয়োদশী" },
  { en: "Shukla Chaturdashi", bn: "শুক্ল চতুর্দশী" },
  { en: "Purnima", bn: "পূর্ণিমা (পরম শুভ)" },
  { en: "Krishna Pratipada", bn: "কৃষ্ণ প্রতিপদ" },
  { en: "Krishna Dvitiya", bn: "কৃষ্ণ দ্বিতীয়া" },
  { en: "Krishna Tritiya", bn: "কৃষ্ণ তৃতীয়া" },
  { en: "Krishna Chaturthi", bn: "কৃষ্ণ চতুর্থী" },
  { en: "Krishna Panchami", bn: "কৃষ্ণ পঞ্চমী" },
  { en: "Krishna Shashthi", bn: "কৃষ্ণ ষষ্ঠী" },
  { en: "Krishna Saptami", bn: "কৃষ্ণ সপ্তমী" },
  { en: "Krishna Ashtami", bn: "কৃষ্ণ অষ্টমী" },
  { en: "Krishna Navami", bn: "কৃষ্ণ নবমী" },
  { en: "Krishna Dashami", bn: "কৃষ্ণ দশমী" },
  { en: "Krishna Ekadashi", bn: "কৃষ্ণ একাদশী" },
  { en: "Krishna Dvadashi", bn: "কৃষ্ণ দ্বাদশী" },
  { en: "Krishna Trayodashi", bn: "কৃষ্ণ ত্রয়োদশী" },
  { en: "Krishna Chaturdashi", bn: "কৃষ্ণ চতুর্দশী" },
  { en: "Amavasya", bn: "অমাবস্যা" },
];

const VARA_DATA: Record<number, { en: string; bn: string }> = {
  1: { en: "Sunday", bn: "রবিবার (সূর্য - প্রভাব, মর্যাদা ও স্বাস্থ্য)" },
  2: { en: "Monday", bn: "সোমবার (চন্দ্র - মানসিক শান্তি ও গৃহস্নেহ)" },
  3: { en: "Tuesday", bn: "মঙ্গলবার (মঙ্গল - তেজ, পরাক্রম ও উদ্যোগ)" },
  4: { en: "Wednesday", bn: "বুধবার (বুধ - প্রজ্ঞা, হিসাব ও ব্যবসায় সমৃদ্ধি)" },
  5: { en: "Thursday", bn: "বৃহস্পতিবার (বৃহস্পতি - পরম সৌভাগ্য, বিদ্যা ও ঐশ্বর্য)" },
  6: { en: "Friday", bn: "শুক্রবার (শুক্র - বিলাসিতা, নান্দনিকতা ও বৈষয়িক আনন্দ)" },
  7: { en: "Saturday", bn: "শনিবার (শনি - স্থায়িত্ব, শৃঙ্খলা ও ধৈর্য)" },
};

function computeLocalAyadi(length: number, width: number, unit: "feet" | "meter" | "hasta"): AyadiCalculationResponse {
  let length_ft = length;
  let width_ft = width;
  if (unit === "meter") {
    length_ft = length * 3.28084;
    width_ft = width * 3.28084;
  } else if (unit === "hasta") {
    length_ft = length * 1.5;
    width_ft = width * 1.5;
  }

  const area_sqft = Math.round(length_ft * width_ft * 100) / 100;
  const area_hasta = Math.round((area_sqft / 2.25) * 100) / 100;
  const perimeter_ft = Math.round(2 * (length_ft + width_ft) * 100) / 100;
  const perimeter_hasta = Math.round((perimeter_ft / 1.5) * 100) / 100;
  const int_area = Math.max(Math.round(area_sqft), 1);

  const aaya_rem = (int_area * 8) % 8;
  const aaya_num = aaya_rem === 0 ? 8 : aaya_rem;
  const aaya_info = AAYA_DATA[aaya_num];

  const dhana = ((int_area * 8) % 12) || 12;
  const rina = ((int_area * 3) % 8) || 8;
  const is_dhana_dominant = dhana >= rina;

  const yoni_num = aaya_num;
  const yoni_info = YONI_DATA[yoni_num];

  const varna_num = (int_area % 4) + 1;
  const varna_info = VARNA_DATA[varna_num];

  const aayu_years = ((int_area * 27) % 100) || 100;
  const nakshatra_idx = (int_area * 8) % 27;
  const nakshatra_name = NAKSHATRA_NAMES[nakshatra_idx];
  const nakshatra_name_bn = NAKSHATRA_NAMES_BN[nakshatra_idx];

  const tithi_val = ((int_area * 8) % 30) || 30;
  const tithi_entry = TITHI_NAMES[tithi_val - 1] || TITHI_NAMES[0];

  const vara_val = ((int_area * 9) % 7) || 7;
  const vara_entry = VARA_DATA[vara_val] || VARA_DATA[1];

  let score = 0;
  if (aaya_info.auspicious) score += 30;
  if (dhana > rina) score += 25;
  else if (dhana === rina) score += 15;
  if ([2, 4, 5, 6].includes(vara_val)) score += 15;
  else if (vara_val === 1) score += 10;
  else score += 5;
  if ([2, 3, 5, 7, 10, 11, 13, 15].includes(tithi_val)) score += 10;
  else score += 5;
  if (aayu_years >= 60) score += 20;
  else if (aayu_years >= 40) score += 12;
  else score += 5;
  score = Math.min(score, 100);

  let grade = "A";
  let verdict = "";
  if (score >= 85) {
    grade = "A+ (পরম কল্যাণকর)";
    verdict = `এই পরিমাপটি শাস্ত্রীয় ষড়বর্গে পরম শুভ। ${aaya_info.name_bn} এবং ধন-ব্যয়ের অনুকূল অনুপাত পরিবারে স্থায়ী শ্রী ও সমৃদ্ধি প্রদান করবে।`;
  } else if (score >= 70) {
    grade = "A (উত্তম বাস্তু মাত্রা)";
    verdict = "পরিমাপটি বাস্তু মতে প্রশংসনীয়। ধন ব্যয় অপেক্ষা শ্রেয় এবং ভবনের দীর্ঘস্থায়িত্ব নিশ্চিত।";
  } else if (score >= 50) {
    grade = "B (মধ্যম মাত্রা)";
    verdict = "পরিমাপটি মধ্যম শ্রেণীর। সামান্য কয়েক ইঞ্চি বাড়িয়ে বা কমিয়ে এটিকে গজ বা ধ্বজ আয়ে রূপান্তর করা সম্ভব।";
  } else {
    grade = "C (সংশোধন বাঞ্ছনীয়)";
    verdict = "বর্তমান মাত্রায় ব্যয় আয়ের চেয়ে বেশি অথবা অশুভ আয়া নির্দেশিত। নিচের স্থাপত্য সংশোধন পরামর্শ অনুসরণ করুন।";
  }

  const rectifications: string[] = [];
  if (!aaya_info.auspicious) {
    rectifications.push(
      `বর্তমান ${aaya_info.name_bn} এর পরিবর্তে দৈর্ঘ্য বা প্রস্থ ১ থেকে ২ ফুট পরিবর্তন করে গজ আয় (৭) বা ধ্বজ আয় (১) গ্রহণ করা অতীব শুভ।`
    );
  }
  if (!is_dhana_dominant) {
    rectifications.push(
      `ঋণ (${rina}) ধন (${dhana}) অপেক্ষা বেশি হওয়ায় আয়ের অপচয় হতে পারে; প্লটের ক্ষেত্রফল সমন্বয় করে ধন সংখ্যা বৃদ্ধি করুন।`
    );
  }
  if (aayu_years < 50) {
    rectifications.push(
      `ভবনের আয়ু ${aayu_years} বছর — দৈর্ঘ্য-প্রস্থের অনুপাত ১:১.২ বা ১:১.৫ রাখলে পরমায়ু বৃদ্ধি পায়।`
    );
  }
  if (rectifications.length === 0) {
    rectifications.push("বর্তমান পরিমাপ সম্পূর্ণ ভারসাম্যপূর্ণ ও দোষমুক্ত। কোনো পরিমাপ পরিবর্তনের প্রয়োজন নেই।");
  }
  rectifications.push(`এই মাত্রার জন্য শ্রেষ্ঠ প্রবেশদ্বার অভিমুখ: ${aaya_info.directions.join(", ")}।`);

  return {
    length: Math.round(length * 100) / 100,
    width: Math.round(width * 100) / 100,
    unit,
    area_sqft,
    area_hasta,
    perimeter_ft,
    perimeter_hasta,
    aaya_number: aaya_num,
    aaya_name: aaya_info.name,
    aaya_name_bn: aaya_info.name_bn,
    is_auspicious: aaya_info.auspicious,
    aaya_significance_bn: aaya_info.significance,
    dhana_score: dhana,
    rina_score: rina,
    vyaya_score: rina,
    is_dhana_dominant,
    yoni_number: yoni_num,
    yoni_name: yoni_info.name,
    yoni_name_bn: yoni_info.name_bn,
    yoni_direction: yoni_info.direction,
    yoni_significance_bn: yoni_info.significance,
    varna_name: varna_info.name,
    varna_name_bn: varna_info.name_bn,
    varna_significance_bn: varna_info.significance,
    structure_longevity_years: aayu_years,
    longevity_verdict_bn: `${aayu_years} বছর — ${aayu_years >= 60 ? "দীর্ঘ পরমায়ু (পরম শুভ)" : aayu_years >= 40 ? "মধ্যম পরমায়ু" : "স্বল্প পরমায়ু"}`,
    building_nakshatra_number: nakshatra_idx + 1,
    building_nakshatra_name: nakshatra_name,
    building_nakshatra_name_bn: nakshatra_name_bn,
    tithi_number: tithi_val,
    tithi_name: tithi_entry.en,
    tithi_name_bn: tithi_entry.bn,
    vara_name: vara_entry.en,
    vara_name_bn: vara_entry.bn,
    shadvarga_score: score,
    shadvarga_grade: grade,
    shadvarga_verdict_bn: verdict,
    best_facing_directions_bn: aaya_info.directions,
    rectification_suggestions_bn: rectifications,
  };
}

interface AyadiShadvargaProps {
  language?: AstrologyLanguage;
}

export function AyadiShadvarga({ language = "bn" }: AyadiShadvargaProps) {
  const t = VASTU_I18N[language] || VASTU_I18N.en;
  const [length, setLength] = React.useState<number>(40);
  const [width, setWidth] = React.useState<number>(30);
  const [unit, setUnit] = React.useState<"feet" | "meter" | "hasta">("feet");
  const [result, setResult] = React.useState<AyadiCalculationResponse>(() =>
    computeLocalAyadi(40, 30, "feet")
  );
  const [loading, setLoading] = React.useState(false);

  const presets = [
    { label: language === "bn" ? "আদর্শ ৩-বেডরুম (৪০×৩০ ফুট)" : language === "hi" ? "आदर्श 3-BHK (40×30 फुट)" : "Standard 3-BHK (40×30 ft)", l: 40, w: 30, u: "feet" as const },
    { label: language === "bn" ? "কমপ্যাক্ট ২-বেডরুম (৩০×২০ ফুট)" : language === "hi" ? "कॉम्पैक्ट 2-BHK (30×20 फुट)" : "Compact 2-BHK (30×20 ft)", l: 30, w: 20, u: "feet" as const },
    { label: language === "bn" ? "বিশাল ভিলা (৬০×৪০ ফুট)" : language === "hi" ? "भव्य विला (60×40 फुट)" : "Luxury Villa (60×40 ft)", l: 60, w: 40, u: "feet" as const },
    { label: language === "bn" ? "শাস্ত্রীয় হস্ত মাপ (২৪×১৬ হাত)" : language === "hi" ? "वैदिक हस्त माप (24×16 हाथ)" : "Classical Hasta (24×16 cubits)", l: 24, w: 16, u: "hasta" as const },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setLength(p.l);
    setWidth(p.w);
    setUnit(p.u);
    setResult(computeLocalAyadi(p.l, p.w, p.u));
  };

  const handleCalculate = async () => {
    if (length <= 0 || width <= 0) {
      toast.error(t.validDimensionsError);
      return;
    }
    setLoading(true);
    try {
      const res = await vastuApi.calculateAyadi({ length, width, unit });
      if (res) {
        setResult(res);
      } else {
        setResult(computeLocalAyadi(length, width, unit));
      }
      toast.success(t.ayadiSuccess);
    } catch {
      setResult(computeLocalAyadi(length, width, unit));
      toast.success(t.ayadiSuccess);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Aspect ratio calculation
  const ratio = width > 0 ? (length / width).toFixed(2) : "1.00";

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-surface border border-amber-500/20 p-5 sm:p-6 shadow-sm print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 px-3 py-1 text-xs font-bold border border-amber-400/30">
              <Building2 className="size-3.5" />
              <span>{t.ayadiTitle}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {t.ayadiSub}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {language === "bn"
                ? "প্রাচীন সমরঙ্গণসূত্রধার, মানসার ও বাস্তুপ্রদীপের 'আয়াদি ষড়বর্গ' মতে ভবনের দৈর্ঘ্য-প্রস্থের সমন্বয়ে গঠিত ক্ষেত্রফল ও পরিসীমা থেকে ৮টি মূল অঙ্গ (আয়, ব্যয়, যোনি, বর্ণ, নক্ষত্র, তিথি, বার ও পরমায়ু) পরীক্ষা করা হয়। এর মূল লক্ষ্য: ধন যেন ঋণ অপেক্ষা সর্বদা অধিক হয় এবং পরমায়ু দীর্ঘ হয়।"
                : language === "hi"
                ? "समरांगणसूत्रधार एवं मानसार अनुसार भवन की लंबाई-चौड़ाई से 8 प्रमुख अंगों (आय, व्यय, योनि, वर्ण, नक्षत्र, तिथि, वार एवं परमायु) की गणना की जाती है।"
                : "According to classical Samaranganasutradhara & Manasara, 8 vital Vedic pillars (Aaya, Vyaya, Yoni, Varna, Tara, Tithi, Vara, and Longevity) are audited from dimensions to ensure Dhana > Vyaya and enduring prosperity."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrint}
              className="text-xs font-bold flex items-center gap-1.5 rounded-xl border-stone-300 hover:bg-stone-100 cursor-pointer"
            >
              <Printer className="size-3.5 text-stone-600" />
              <span>{t.printAuditBtn}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="rounded-2xl bg-surface border border-border p-4 shadow-2xs print:hidden space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Sliders className="size-3.5 text-amber-500" />
          <span>{t.quickPresetsTitle}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-surface-muted/50 hover:bg-amber-500/10 hover:border-amber-500/40 text-xs font-medium text-foreground transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Dimensions Card */}
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Compass className="size-4 text-amber-500" />
            <span>{t.enterDimensions}</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600">
              Ratio 1:{ratio}
            </span>
          </h4>

          {/* Unit Toggle: Feet, Meter, Hasta */}
          <div className="inline-flex p-1 rounded-xl bg-surface-muted border border-border/80 print:hidden">
            {(
              [
                { id: "feet", label: t.feetUnit },
                { id: "meter", label: t.meterUnit },
                { id: "hasta", label: t.hastaUnit },
              ] as const
            ).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setUnit(u.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  unit === u.id
                    ? "bg-amber-500 text-amber-950 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 items-end">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-muted-foreground">
                {t.lengthLabel(unit === "hasta" ? t.hastaUnit : unit === "meter" ? t.meterUnit : t.feetUnit)}
              </label>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{length}</span>
            </div>
            <input
              type="number"
              min="1"
              step="0.5"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-muted/40 border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <input
              type="range"
              min="5"
              max="150"
              step="0.5"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              className="w-full accent-amber-500 cursor-pointer print:hidden"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-semibold text-muted-foreground">
                {t.widthLabel(unit === "hasta" ? t.hastaUnit : unit === "meter" ? t.meterUnit : t.feetUnit)}
              </label>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{width}</span>
            </div>
            <input
              type="number"
              min="1"
              step="0.5"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-muted/40 border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
            <input
              type="range"
              min="5"
              max="150"
              step="0.5"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full accent-amber-500 cursor-pointer print:hidden"
            />
          </div>

          <div className="print:hidden">
            <Button
              type="button"
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-sm cursor-pointer"
            >
              <Sparkles className="size-4 mr-1.5" />
              <span>{loading ? "গণনা হচ্ছে..." : t.calculateAyadiBtn}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result Presentation */}
      {result && (
        <div className="space-y-6">
          {/* Main Verdict & Score Banner */}
          <div
            className={`rounded-2xl border p-5 sm:p-7 shadow-sm space-y-5 transition-all ${
              result.is_auspicious
                ? "bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-surface border-emerald-500/40"
                : "bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-surface border-rose-500/40"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                    {t.calculatedAaya}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-900 dark:text-amber-300">
                    No. {result.aaya_number}
                  </span>
                </div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {result.aaya_name_bn}
                </h4>
              </div>

              {/* Score & Verdict Pill */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase">{t.scoreLabel}</p>
                  <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                    {result.shadvarga_score ?? 85} / 100
                  </p>
                </div>
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border ${
                    result.is_auspicious
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                      : "bg-rose-500 text-white border-rose-600 shadow-xs"
                  }`}
                >
                  {result.shadvarga_grade || (result.is_auspicious ? "🌟 পরম শুভ আয়" : "⚠️ অশুভ আয়")}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {result.shadvarga_verdict_bn || result.aaya_significance_bn}
            </p>

            {/* Quick Dimensional Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Layers className="size-3 text-amber-500" />
                  {t.totalArea}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  {result.area_sqft} sq ft
                  {result.area_hasta ? (
                    <span className="block text-[10px] text-muted-foreground font-normal">
                      ≈ {result.area_hasta} বর্গহাত
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Ruler className="size-3 text-blue-500" />
                  {t.perimeterLabel}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  {result.perimeter_ft ?? (2 * (length + width))} ft
                  {result.perimeter_hasta ? (
                    <span className="block text-[10px] text-muted-foreground font-normal">
                      ≈ {result.perimeter_hasta} হাত
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <TrendingUp className="size-3 text-emerald-500" />
                  {t.dhanaVsRina}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  <span className="text-emerald-700 dark:text-emerald-400">{result.dhana_score}</span> :{" "}
                  <span className="text-rose-700 dark:text-rose-400">{result.rina_score}</span>
                  {result.is_dhana_dominant && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 ml-1 font-bold">
                      ({t.goodStatus})
                    </span>
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="size-3 text-amber-500" />
                  {t.longevity}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  {t.yearsSuffix(result.structure_longevity_years)}
                </p>
              </div>
            </div>

            {/* Best Facing Directions */}
            <div className="p-4 rounded-xl bg-surface/90 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  {t.idealDirections}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "bn"
                    ? "এই অভিমুখের দরজাই এই আয়াতে সর্বাধিক সমৃদ্ধি ও শ্রী প্রদান করে।"
                    : language === "hi"
                    ? "इस दिशा के प्रवेश द्वार इस आय में सर्वाधिक समृद्धि प्रदान करते हैं।"
                    : "Entrances facing these cardinal zones yield maximum abundance."}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.best_facing_directions_bn.map((dir, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 text-xs font-bold"
                  >
                    {dir}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2D Architectural Blueprint Diagram */}
          <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Maximize2 className="size-4 text-amber-500" />
                <span>{t.blueprintTitle}</span>
              </h4>
              <span className="text-xs text-muted-foreground font-mono">
                {result.length} × {result.width} {unit}
              </span>
            </div>

            <div className="relative w-full h-64 sm:h-72 rounded-xl bg-stone-900 overflow-hidden border border-stone-800 flex items-center justify-center p-4">
              {/* Background Architectural Grid Pattern */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(#fcd404 1px, transparent 1px), radial-gradient(#ffffff 1px, #0f172a 1px)",
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 10px 10px",
                }}
              />

              {/* Cardinal Compass Markers */}
              <span className="absolute top-2 font-bold text-xs text-amber-400 font-mono tracking-wider">
                NORTH (উত্তর)
              </span>
              <span className="absolute bottom-2 font-bold text-xs text-stone-400 font-mono tracking-wider">
                SOUTH (দক্ষিণ)
              </span>
              <span className="absolute left-2 font-bold text-xs text-stone-400 font-mono tracking-wider">
                WEST (পশ্চিম)
              </span>
              <span className="absolute right-2 font-bold text-xs text-amber-400 font-mono tracking-wider">
                EAST (পূর্ব)
              </span>

              {/* 2D Plot Box */}
              <div
                className="relative border-2 border-amber-400/90 bg-amber-500/10 rounded-lg flex flex-col items-center justify-center shadow-lg transition-all"
                style={{
                  width: `${Math.min(Math.max((result.width / Math.max(result.length, result.width)) * 260, 140), 300)}px`,
                  height: `${Math.min(Math.max((result.length / Math.max(result.length, result.width)) * 200, 120), 220)}px`,
                }}
              >
                {/* Central Brahmasthan Marker */}
                <div className="size-3 rounded-full bg-amber-400 border-2 border-amber-950 animate-pulse" />
                <span className="text-[10px] text-amber-300 font-bold mt-1 uppercase tracking-widest">
                  ব্রহ্মস্থান
                </span>

                <div className="text-center mt-2">
                  <p className="text-xs font-bold text-white font-mono">
                    {result.area_sqft} sq ft
                  </p>
                  <p className="text-[10px] text-amber-200">
                    {result.aaya_name_bn}
                  </p>
                </div>

                {/* Length & Width dimension annotations */}
                <span className="absolute -top-5 text-[10px] font-mono text-amber-400 font-bold">
                  W: {result.width} {unit}
                </span>
                <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] font-mono text-amber-400 font-bold -rotate-90">
                  L: {result.length} {unit}
                </span>
              </div>
            </div>
          </div>

          {/* Complete 8 Classical Shadvarga Pillars Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <span>শাস্ত্রীয় অষ্ট-অঙ্গ বিশ্লেষণ (Classical 8 Shadvarga Pillars)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Aaya */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">১. আয় (Aaya)</span>
                  <span className="text-amber-600 font-mono">{result.aaya_number} / 8</span>
                </div>
                <h5 className="text-base font-bold text-foreground">{result.aaya_name_bn}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">{result.aaya_significance_bn}</p>
              </div>

              {/* 2. Vyaya / Dhana */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">২. ব্যয় ও ঋণ (Vyaya)</span>
                  <span className={result.is_dhana_dominant ? "text-emerald-600" : "text-rose-600"}>
                    {result.is_dhana_dominant ? "উদ্বৃত্ত লাভ" : "ঘাটতি"}
                  </span>
                </div>
                <h5 className="text-base font-bold text-foreground">
                  ধন {result.dhana_score} : ঋণ {result.rina_score}
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {result.is_dhana_dominant
                    ? "আয় ব্যয় অপেক্ষা অধিক হওয়ায় পরিবারের সঞ্চয় ও স্থাবর সম্পদে সমৃদ্ধি নিশ্চিত।"
                    : "ব্যয় সংখ্যা অধিক হওয়ায় অর্থ অপচয়ের ঝুঁকি রয়েছে। সামান্য মাপ বৃদ্ধি বাঞ্ছনীয়।"}
                </p>
              </div>

              {/* 3. Yoni */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">৩. যোনি (Yoni)</span>
                  <span className="text-amber-600">{result.yoni_direction || "দিকশক্তি"}</span>
                </div>
                <h5 className="text-base font-bold text-foreground">{result.yoni_name_bn || result.aaya_name_bn}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {result.yoni_significance_bn || "দিকগত জীবনীশক্তি ও গৃহের প্রাণশক্তি সুষম রাখে।"}
                </p>
              </div>

              {/* 4. Varna */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">৪. বর্ণ (Varna)</span>
                  <span className="text-purple-600">বৃত্তিমূলক শক্তি</span>
                </div>
                <h5 className="text-base font-bold text-foreground">{result.varna_name_bn || "ব্রাহ্মণ বর্ণ"}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {result.varna_significance_bn || "গৃহবাসীদের মানসিক শান্তি, গবেষণা ও আধ্যাত্মিক চর্চার অনুকূল পরিবেশ।"}
                </p>
              </div>

              {/* 5. Tara / Nakshatra */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">৫. নক্ষত্র (Building Tara)</span>
                  <span className="text-blue-600 font-mono">{result.building_nakshatra_number} / 27</span>
                </div>
                <h5 className="text-base font-bold text-foreground">
                  {result.building_nakshatra_name_bn || result.building_nakshatra_name}
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ভবনের নিজস্ব বৈদিক নক্ষত্র। গৃহস্বামীর জন্ম নক্ষত্রের সাথে সম্প্রীতি রক্ষা করে।
                </p>
              </div>

              {/* 6. Tithi */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">৬. বাস্তু তিথি (Tithi)</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <Moon className="size-3" />
                    {result.tithi_number ? `তিথি ${result.tithi_number}` : "পূর্ণিমা"}
                  </span>
                </div>
                <h5 className="text-base font-bold text-foreground">{result.tithi_name_bn || "শুক্ল প্রতিপদ"}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  চন্দ্রকলার প্রভাবে গৃহে শুভ শক্তি ও স্নায়বিক স্থিরতা প্রদান করে।
                </p>
              </div>

              {/* 7. Vara */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">৭. বার ও দিনেশ (Vara)</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    <Sun className="size-3" /> গ্রহাধিপতি
                  </span>
                </div>
                <h5 className="text-base font-bold text-foreground">{result.vara_name_bn || "বৃহস্পতিবার (বৃহস্পতি)"}</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  অধিপতি গ্রহের রশ্মি ভবনে প্রবেশ করে সুখ ও সমৃদ্ধি বিকশিত করে।
                </p>
              </div>

              {/* 8. Longevity */}
              <div className="card-surface p-4 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">৮. পরমায়ু (Longevity)</span>
                  <span className="text-emerald-600 font-mono">{result.structure_longevity_years} বছর</span>
                </div>
                <h5 className="text-base font-bold text-foreground">
                  {result.longevity_verdict_bn || `${result.structure_longevity_years} বছর পরমায়ু`}
                </h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ভবনটির স্থায়িত্ব ও পারিবারিক প্রজন্মের ধারাবাহিক রক্ষাকবচ।
                </p>
              </div>
            </div>
          </div>

          {/* Architectural Rectification Engine */}
          {result.rectification_suggestions_bn && result.rectification_suggestions_bn.length > 0 && (
            <div className="rounded-2xl bg-amber-500/5 border border-amber-500/30 p-5 sm:p-6 space-y-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-amber-600" />
                <span>{t.rectificationTitle}</span>
              </h4>
              <p className="text-xs text-muted-foreground">
                বাস্তু স্থপতিদের ক্লাসিক্যাল সূত্র অনুসারে সামান্য কয়েক ইঞ্চি বা ফুট পরিবর্তনের মাধ্যমে সর্বোচ্চ শুভত্ব অর্জনের দিকনির্দেশনা:
              </p>
              <div className="space-y-2 pt-1">
                {result.rectification_suggestions_bn.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <ArrowRight className="size-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
