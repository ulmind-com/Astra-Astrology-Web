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
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { vastuApi } from "@/lib/api";
import type { AyadiCalculationResponse } from "@/types/vastu";
import type { AstrologyLanguage } from "@/types";

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
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

function computeLocalAyadi(length: number, width: number, unit: "feet" | "meter"): AyadiCalculationResponse {
  const length_ft = unit === "feet" ? length : length * 3.28084;
  const width_ft = unit === "feet" ? width : width * 3.28084;
  const area_sqft = Math.round(length_ft * width_ft * 100) / 100;
  const int_area = Math.max(Math.round(area_sqft), 1);

  const aaya_rem = (int_area * 8) % 8;
  const aaya_num = aaya_rem === 0 ? 8 : aaya_rem;
  const aaya_info = AAYA_DATA[aaya_num];

  const dhana = ((int_area * 8) % 12) || 12;
  const rina = ((int_area * 3) % 8) || 8;
  const is_dhana_dominant = dhana >= rina;
  const aayu_years = ((int_area * 27) % 100) || 100;
  const nakshatra_idx = (int_area * 8) % 27;
  const nakshatra_name = NAKSHATRA_NAMES[nakshatra_idx];

  return {
    length: Math.round(length * 100) / 100,
    width: Math.round(width * 100) / 100,
    area_sqft,
    aaya_number: aaya_num,
    aaya_name: aaya_info.name,
    aaya_name_bn: aaya_info.name_bn,
    is_auspicious: aaya_info.auspicious,
    aaya_significance_bn: aaya_info.significance,
    dhana_score: dhana,
    rina_score: rina,
    is_dhana_dominant,
    structure_longevity_years: aayu_years,
    building_nakshatra_number: nakshatra_idx + 1,
    building_nakshatra_name: nakshatra_name,
    best_facing_directions_bn: aaya_info.directions,
  };
}

interface AyadiShadvargaProps {
  language?: AstrologyLanguage;
}

export function AyadiShadvarga({ language = "bn" }: AyadiShadvargaProps) {
  const [length, setLength] = React.useState<number>(40);
  const [width, setWidth] = React.useState<number>(30);
  const [unit, setUnit] = React.useState<"feet" | "meter">("feet");
  const [result, setResult] = React.useState<AyadiCalculationResponse>(() =>
    computeLocalAyadi(40, 30, "feet")
  );
  const [loading, setLoading] = React.useState(false);

  const handleCalculate = async () => {
    if (length <= 0 || width <= 0) {
      toast.error(language === "bn" ? "সঠিক দৈর্ঘ্য ও প্রস্থ লিখুন।" : "Please enter valid dimensions.");
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
      toast.success(
        language === "bn"
          ? "আয়াদি ষড়বর্গ ফলাফল সফলভাবে নির্ণীত হয়েছে!"
          : "Ayadi Shadvarga calculated successfully!"
      );
    } catch {
      setResult(computeLocalAyadi(length, width, unit));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-surface border border-amber-500/20 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 text-amber-900 dark:text-amber-300 px-3 py-1 text-xs font-bold border border-amber-400/30">
              <Calculator className="size-3.5" />
              <span>
                {language === "bn"
                  ? "শাস্ত্রীয় আয়াদি ষড়বর্গ ক্যালকুলেটর (Classical Ayadi Shadvarga)"
                  : language === "hi"
                  ? "शास्त्रीय आयादि षड्वर्ग गणक"
                  : "Classical Ayadi Shadvarga Vedic Engine"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {language === "bn"
                ? "জমির দৈর্ঘ্য ও প্রস্থ থেকে বৈদিক আয়, ব্যয়, নক্ষত্র ও আয়ু নির্ধারণ করুন"
                : language === "hi"
                ? "भूखंड की लम्बाई-चौड़ाई से वैदिक आय, व्यय, नक्षत्र एवं आयु जानें"
                : "Calculate Vedic Aaya, Longevity & Building Nakshatra"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {language === "bn"
                ? "প্রাচীন সমরঙ্গণসূত্রধার ও বাস্তু প্রদীপের 'আয় প্রকরণ' অনুসারে ঘরের ক্ষেত্রফল শুভ না অশুভ তা ধ্বজ, সিংহ, বৃষভ, ও গজ আয়ার মাধ্যমে নির্ণয় করা হয়। এখানে ধন সবসময় ঋণের চেয়ে বেশি হতে হয়।"
                : language === "hi"
                ? "समरांगणसूत्रधार एवं वास्तु प्रदीप अनुसार ध्वज, सिंह, वृषभ व गज आय परम शुभ मानी जाती हैं।"
                : "Based on classical Samaranganasutradhara & Vastu Pradeepa, a building's area is mathematically tested across 8 Aayas, ensuring Dhana (Income) exceeds Rina (Debt)."}
            </p>
          </div>
        </div>
      </div>

      {/* Input Dimensions Card */}
      <div className="rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Compass className="size-4 text-amber-500" />
            <span>{language === "bn" ? "জমির বা ঘরের মাপ লিখুন" : "Enter Dimensions"}</span>
          </h4>

          {/* Unit Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-surface-muted border border-border/80">
            {(["feet", "meter"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  unit === u
                    ? "bg-amber-500 text-amber-950 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {u === "feet" ? (language === "bn" ? "ফুট (Feet)" : "Feet") : (language === "bn" ? "মিটার (Meter)" : "Meter")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              {language === "bn" ? "দৈর্ঘ্য (Length)" : "Length"} ({unit})
            </label>
            <input
              type="number"
              min="1"
              step="0.5"
              value={length}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-muted/40 border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              {language === "bn" ? "প্রস্থ (Width)" : "Width"} ({unit})
            </label>
            <input
              type="number"
              min="1"
              step="0.5"
              value={width}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-surface-muted/40 border border-border/80 text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <Button
              type="button"
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-sm cursor-pointer"
            >
              <Sparkles className="size-4 mr-1.5" />
              <span>{language === "bn" ? "আয়াদি গণনা করুন" : "Calculate Ayadi"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Result Cards */}
      {result && (
        <div className="space-y-6">
          {/* Main Verdict Card */}
          <div
            className={`rounded-2xl border p-5 sm:p-7 shadow-sm space-y-5 transition-all ${
              result.is_auspicious
                ? "bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-surface border-emerald-500/40"
                : "bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-surface border-rose-500/40"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  {language === "bn" ? "নির্ধারিত বৈদিক আয়" : "Calculated Vedic Aaya"}
                </span>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {result.aaya_name_bn}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold border ${
                    result.is_auspicious
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                      : "bg-rose-500 text-white border-rose-600 shadow-xs"
                  }`}
                >
                  {result.is_auspicious
                    ? language === "bn"
                      ? "🌟 পরম শুভ আয়"
                      : "🌟 Highly Auspicious"
                    : language === "bn"
                    ? "⚠️ অশুভ আয় (সংশোধনযোগ্য)"
                    : "⚠️ Inauspicious Aaya"}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {result.aaya_significance_bn}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Layers className="size-3 text-amber-500" />
                  {language === "bn" ? "মোট ক্ষেত্রফল" : "Total Area"}
                </p>
                <p className="text-sm font-extrabold text-foreground">{result.area_sqft} sq ft</p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <TrendingUp className="size-3 text-emerald-500" />
                  {language === "bn" ? "ধন (আয়) বনাম ঋণ" : "Dhana vs Rina"}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  <span className="text-emerald-800 dark:text-emerald-300">{result.dhana_score}</span> :{" "}
                  <span className="text-rose-800 dark:text-rose-300">{result.rina_score}</span>
                  {result.is_dhana_dominant && (
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 ml-1 font-bold">
                      ({language === "bn" ? "শুভ" : "Good"})
                    </span>
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="size-3 text-blue-500" />
                  {language === "bn" ? "ভবনের আয়ু" : "Longevity"}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  {result.structure_longevity_years} {language === "bn" ? "বছর" : "Years"}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-surface/80 border border-border/70 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Star className="size-3 text-purple-500" />
                  {language === "bn" ? "ভবন নক্ষত্র" : "Nakshatra"}
                </p>
                <p className="text-sm font-extrabold text-foreground">
                  {result.building_nakshatra_name} ({result.building_nakshatra_number})
                </p>
              </div>
            </div>

            {/* Best Facing Directions */}
            <div className="p-4 rounded-xl bg-surface/90 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  {language === "bn" ? "এই আয়ার জন্য শ্রেষ্ঠ প্রবেশদ্বার অভিমুখ" : "Ideal Entrance Directions for this Aaya"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {language === "bn"
                    ? "এই অভিমুখের দরজাই এই আয়াতে সর্বাধিক সমৃদ্ধি প্রদান করে।"
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
        </div>
      )}
    </div>
  );
}
