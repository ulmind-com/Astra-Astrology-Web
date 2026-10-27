"use client";

import * as React from "react";
import {
  Activity,
  Heart,
  Brain,
  ShieldAlert,
  Sparkles,
  Search,
  Droplets,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Layers,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { vastuApi } from "@/lib/api";
import type { MedicalVastuItem } from "@/types/vastu";
import type { AstrologyLanguage } from "@/types";

// Fallback high-fidelity local catalog directly from 115-page a0df3a72402320df.pdf
const LOCAL_MEDICAL_CATALOG: MedicalVastuItem[] = [
  {
    ailment_id: "depression_sorrow",
    name_bn: "বিষণ্নতা, মানসিক অবসাদ ও একাকীত্ব",
    name_en: "Depression, Anxiety & Emotional Grief",
    affected_zone: "WNW",
    affected_element: "Space/Metal (আকাশ ও ধাতু)",
    body_organ_bn: "থাইরয়েড ও গ্ল্যান্ডুলার নিঃসরণ",
    dosha: "Vata (বায়ু)",
    root_cause_bn: "WNW (পশ্চিম-উত্তর-পশ্চিম) জোনে টয়লেট, ডাস্টবিন, ভারী জিনিস বা লাল রঙের অ্যান্টি-কালার উপস্থিতি।",
    remedy_bn: "WNW কোণে হালকা হলুদ বা অফ-হোয়াইট রঙ ব্যবহার করুন। টয়লেট থাকলে ব্রাস বা অ্যালুমিনিয়াম স্ট্রিপ মেঝের খাঁজে বসিয়ে সিল করুন।",
  },
  {
    ailment_id: "insomnia_overthinking",
    name_bn: "অনিদ্রা, অতিরিক্ত চিন্তা ও মানসিক অস্থিরতা",
    name_en: "Insomnia, Restlessness & Overthinking",
    affected_zone: "NE / ESE",
    affected_element: "Water & Air (জল ও বায়ু)",
    body_organ_bn: "মস্তিষ্ক, স্নায়ুতন্ত্র ও পিনিয়াল গ্ল্যান্ড",
    dosha: "Vata-Kapha",
    root_cause_bn: "ঈশান কোণে (NE) রান্নাঘর (অগ্নি), লাল/গোলাপী রঙ অথবা ESE জোনে বেডরুম স্থাপন।",
    remedy_bn: "ঈশানে হালকা নীল রঙের গ্লাস বা স্ফটিক বল ঝুলিয়ে রাখুন এবং রান্নাঘরের বার্নারের নিচে সবুজ মার্বেল স্ল্যাব স্থাপন করুন।",
  },
  {
    ailment_id: "heart_high_bp",
    name_bn: "হৃদরোগ, বুক ধড়ফড় ও উচ্চ রক্তচাপ",
    name_en: "Heart Palpitations & High Blood Pressure",
    affected_zone: "South / SSW",
    affected_element: "Fire & Earth (অগ্নি ও পৃথিবী)",
    body_organ_bn: "হৃদযন্ত্র ও রক্ত সংবহনতন্ত্র",
    dosha: "Pitta (পিত্ত)",
    root_cause_bn: "দক্ষিণ বা দক্ষিণ-দক্ষিণ-পশ্চিমে (SSW) জলের উপস্থিতি, বোরওয়েল, নীল রঙ অথবা কাটা কোণ।",
    remedy_bn: "দক্ষিণে লাল/গোলাপী রঙ রাখুন ও ৯টি লাল মোমবাতি বা লাল জিরো বাল্ব ব্যবহার করুন। টয়লেটে কপার স্ট্রিপ ব্যবহার করুন।",
  },
  {
    ailment_id: "liver_jaundice_digestion",
    name_bn: "ফ্যাটি লিভার, জন্ডিস ও হজমের সমস্যা",
    name_en: "Fatty Liver, Jaundice & Indigestion",
    affected_zone: "East / ESE",
    affected_element: "Air/Wood (বায়ু ও কাঠ)",
    body_organ_bn: "যকৃৎ (Liver) ও পিত্তথলি (Gall Bladder)",
    dosha: "Pitta",
    root_cause_bn: "পূর্ব দিকে টয়লেট, বাথরুম বা বন্ধ অন্ধকার পরিবেশ যা সূর্যের প্রাণশক্তিকে ব্লক করে।",
    remedy_bn: "পূর্বে সবুজ সতেজ গাছপালা রাখুন এবং দেওয়ালের পূর্ব দিকে ১২ ইঞ্চি পিতলের সূর্যমূর্তি স্থাপন করুন।",
  },
  {
    ailment_id: "kidney_urinary",
    name_bn: "কিডনির সমস্যা ও মূত্রনালীর ইনফেকশন",
    name_en: "Kidney Stones & Urinary Incontinence",
    affected_zone: "North / NNW",
    affected_element: "Water (জল)",
    body_organ_bn: "বৃক্ক (Kidneys) ও মূত্রাশয় (Bladder)",
    dosha: "Kapha (কফ)",
    root_cause_bn: "উত্তরে আগুনের উপস্থিতি (রান্নাঘর), অতিরিক্ত লাল রঙ অথবা উত্তর দিক ব্লক থাকা।",
    remedy_bn: "উত্তর দিকে নীল পাপোশ, মানিপ্ল্যান্ট ও পিতলের কুবের মূর্তি রাখুন। রান্নার ওভেনের নিচে সবুজ স্ল্যাব দিন।",
  },
  {
    ailment_id: "infertility_reproductive",
    name_bn: "প্রজনন সমস্যা ও সন্তানধারণে বিলম্ব",
    name_en: "Infertility & Reproductive Health",
    affected_zone: "SW / SE",
    affected_element: "Earth & Fire (পৃথিবী ও অগ্নি)",
    body_organ_bn: "জরায়ু ও প্রজননতন্ত্র",
    dosha: "Kapha-Pitta",
    root_cause_bn: "দক্ষিণ-পশ্চিমে (SW) টয়লেট, আন্ডারগ্রাউন্ড ওয়াটার বা দক্ষিণ-পূর্বে (SE) রান্নাঘরের অনুপস্থিতি।",
    remedy_bn: "SW-তে হলুদ পাথর, পিতলের স্বস্তিক ও ৪ মিমি ব্রাস স্ট্রিপ সিল করুন। SE-তে ১৫ ওয়াট লাল বাল্ব জ্বালান।",
  },
  {
    ailment_id: "diabetes_pancreas",
    name_bn: "ডায়াবেটিস ও অগ্ন্যাশয়ের সমস্যা",
    name_en: "Diabetes & Pancreas Complications",
    affected_zone: "ESE",
    affected_element: "Air/Wood (বায়ু)",
    body_organ_bn: "অগ্ন্যাশয় (Pancreas)",
    dosha: "Pitta",
    root_cause_bn: "ESE জোনে জলতত্ত্ব বা অতিরিক্ত বিশৃঙ্খলা, যা মানসিক মন্থন ও হরমোন নিঃসরণে বিশৃঙ্খলা আনে।",
    remedy_bn: "ESE জোন পরিষ্কার পরিচ্ছন্ন রাখুন এবং স্টেইনলেস স্টিল স্ট্রিপ ও হালকা বাদামী রঙ ব্যবহার করুন।",
  },
  {
    ailment_id: "lungs_asthma",
    name_bn: "শ্বাসকষ্ট, হাঁপানি ও ফুসফুসের রোগ",
    name_en: "Asthma, Bronchitis & Respiratory Disorders",
    affected_zone: "West / WSW",
    affected_element: "Space/Metal (আকাশ)",
    body_organ_bn: "ফুসফুস (Lungs) ও শ্বাসতন্ত্র",
    dosha: "Vata",
    root_cause_bn: "পশ্চিম দিকে অতিরিক্ত সবুজ রঙ বা অগ্নির উপস্থিতি, যা মেটাল এলিমেন্টকে দহন করে।",
    remedy_bn: "পশ্চিমে সাদা বা রূপালী রঙ করুন এবং গোলাকার সাদা ধাতব ফ্রেমের ছবি ও ধাতব উইন্ডচাইম স্থাপন করুন।",
  },
  {
    ailment_id: "low_immunity_fatigue",
    name_bn: "রোগ প্রতিরোধ ক্ষমতা হ্রাস ও দীর্ঘস্থায়ী ক্লান্তি",
    name_en: "Low Immunity & Chronic Fatigue",
    affected_zone: "NNE",
    affected_element: "Water (জল)",
    body_organ_bn: "ইমিউন সিস্টেম ও লিম্ফ্যাটিক গ্ল্যান্ডস",
    dosha: "Kapha",
    root_cause_bn: "NNE (উত্তর-উত্তর-পূর্ব) জোনে টয়লেট, ইনভার্টার, ডাস্টবিন বা অতিরিক্ত আবর্জনা।",
    remedy_bn: "NNE জোনে পরিবারের যাবতীয় নিত্যদিনের ওষুধ সংরক্ষণ করুন এবং খাঁটি তুলসী পাতা ও জলের পাত্র রাখুন।",
  },
  {
    ailment_id: "financial_drain_debts",
    name_bn: "আটকে থাকা টাকা, দেনা ও আকস্মিক আর্থিক ক্ষতি",
    name_en: "Severe Cashflow Blockage & Growing Debts",
    affected_zone: "SE / SSW",
    affected_element: "Fire & Earth (অগ্নি ও অপচয়)",
    body_organ_bn: "অর্থের তারল্য ও শক্তি সঞ্চয়",
    dosha: "Pitta",
    root_cause_bn: "দক্ষিণ-পূর্বে (SE) টয়লেট বা আন্ডারগ্রাউন্ড ওয়াটার থাকা, যা নগদ টাকার প্রবাহ ভস্মীভূত করে।",
    remedy_bn: "SE জোনে একটি ১৫ ওয়াটের জিরো লাল বাল্ব ২৪ ঘণ্টা জ্বালিয়ে রাখুন ও তামার স্ট্রিপ দিয়ে কমোড বিচ্ছিন্ন করুন।",
  },
  {
    ailment_id: "marital_conflict",
    name_bn: "দাম্পত্য কলহ ও বিবাহ বিচ্ছেদের আশঙ্কা",
    name_en: "Marital Conflict & Relational Discord",
    affected_zone: "SW / ESE",
    affected_element: "Earth & Air (স্থায়িত্ব ও মন্থন)",
    body_organ_bn: "পারিবারিক বন্ধন ও আবেগীয় সমতা",
    dosha: "Kapha-Pitta",
    root_cause_bn: "দক্ষিণ-পশ্চিমে (SW) আয়না, ওয়াশিং মেশিন বা কাটা কোণ থাকা।",
    remedy_bn: "SW বেডরুমে হলুদ চাদর ব্যবহার করুন এবং একজোড়া লাভ বার্ডসের মূর্তি বা গোলাপী কোয়ার্টজ ক্রিস্টাল স্থাপন করুন।",
  },
];

interface MedicalVastuProps {
  language?: AstrologyLanguage;
}

export function MedicalVastu({ language = "bn" }: MedicalVastuProps) {
  const [items, setItems] = React.useState<MedicalVastuItem[]>(LOCAL_MEDICAL_CATALOG);
  const [selectedId, setSelectedId] = React.useState<string>("depression_sorrow");
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    vastuApi
      .getMedicalCatalog()
      .then((res) => {
        if (res && res.length > 0) setItems(res);
      })
      .catch(() => {});
  }, []);

  const selectedItem = items.find((i) => i.ailment_id === selectedId) || items[0];

  const filteredItems = items.filter(
    (i) =>
      i.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.affected_zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-surface border border-rose-500/20 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 px-3 py-1 text-xs font-bold border border-rose-400/30">
              <Activity className="size-3.5" />
              <span>
                {language === "bn"
                  ? "মেডিকেল বাস্তু ও প্যাথলজি ডায়াগনস্টিকস"
                  : language === "hi"
                  ? "मेडिकल वास्तु एवं रोग निदान"
                  : "Medical Vastu & Pathology Diagnostics"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {language === "bn"
                ? "শারীরিক ও মানসিক রোগের কারণ হিসেবে ঘরের দোষ চিহ্নিত করুন"
                : language === "hi"
                ? "रोगों के कारण अनुसार घर के वास्तु दोषों की पहचान करें"
                : "Identify Vastu Flaws Behind Physical & Mental Ailments"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {language === "bn"
                ? "অথরিটেটিভ ১১৫ পৃষ্ঠার ক্লায়েন্ট মেডিকেল ম্যানুয়াল অনুসারে শরীরের প্রতিটি অঙ্গ ও ত্রিদোষ (বাত, পিত্ত, কফ) ১৬টি নির্দিষ্ট বাস্তু জোনের সাথে যুক্ত। নিচে রোগ বা সমস্যা নির্বাচন করে সরাসরি সমাধান জানুন।"
                : language === "hi"
                ? "प्रामाणिक 115 पृष्ठों की वास्तु नियमावली अनुसार शरीर के अंग और त्रिदोष 16 वास्तु ज़ोन से जुड़े हैं। समस्या चुनकर तुरंत उपाय जानें।"
                : "Derived from the client's 115-page clinical manual, human organs and Doshas directly map to the 16 Vastu directional zones. Select an ailment to inspect the exact root cause and non-demolition remedy."}
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ailment Picker & Search */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "bn"
                  ? "রোগ বা সমস্যা খুঁজুন (উদাঃ অনিদ্রা, হার্ট, লিভার...)"
                  : language === "hi"
                  ? "रोग खोजें (उदा: अनिद्रा, हृदय, लीवर...)"
                  : "Search symptom (e.g. insomnia, heart, liver...)"
              }
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-surface border border-border/80 focus:outline-none focus:ring-2 focus:ring-rose-500/40 text-foreground"
            />
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const isSelected = item.ailment_id === selectedId;
              return (
                <button
                  key={item.ailment_id}
                  onClick={() => setSelectedId(item.ailment_id)}
                  type="button"
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-rose-500/10 border-rose-500/60 shadow-xs"
                      : "bg-surface border-border/70 hover:bg-surface-muted/50"
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isSelected ? "text-rose-600 dark:text-rose-400" : "text-foreground"
                      }`}
                    >
                      {language === "bn" ? item.name_bn : item.name_en}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {item.body_organ_bn} • {item.dosha}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      isSelected
                        ? "bg-rose-500 text-white border-rose-600"
                        : "bg-surface-muted text-muted-foreground border-border/80"
                    }`}
                  >
                    {item.affected_zone}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Diagnostic Card */}
        {selectedItem && (
          <div className="lg:col-span-7 rounded-2xl bg-surface border border-border p-5 sm:p-6 space-y-6 shadow-sm">
            {/* Title & Zone Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-rose-800 dark:text-rose-300 font-bold">
                  {language === "bn" ? "চিহ্নিত রোগ / লক্ষণ" : "Diagnosed Ailment"}
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-foreground">
                  {language === "bn" ? selectedItem.name_bn : selectedItem.name_en}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-900 dark:text-amber-300 font-extrabold text-sm shadow-2xs">
                  {selectedItem.affected_zone} জোন
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/60 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Layers className="size-3 text-brand-500" />
                  {language === "bn" ? "আক্রান্ত পঞ্চভূত তত্ত্ব" : "Elemental Domain"}
                </p>
                <p className="text-xs font-bold text-foreground">{selectedItem.affected_element}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/60 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Heart className="size-3 text-rose-500" />
                  {language === "bn" ? "সংবেদনশীল শারীরবৃত্তীয় অঙ্গ" : "Body Organ"}
                </p>
                <p className="text-xs font-bold text-foreground">{selectedItem.body_organ_bn}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-muted/60 border border-border/60 space-y-1">
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Brain className="size-3 text-purple-500" />
                  {language === "bn" ? "আয়ুর্বেদিক দোষ" : "Ayurvedic Dosha"}
                </p>
                <p className="text-xs font-bold text-foreground">{selectedItem.dosha}</p>
              </div>
            </div>

            {/* Root Cause Box */}
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                <AlertTriangle className="size-4" />
                <span>{language === "bn" ? "বাস্তুগত মূল কারণ (Root Cause in House)" : "Vastu Root Cause"}</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {selectedItem.root_cause_bn}
              </p>
            </div>

            {/* Non-Demolition Solution Box */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="size-4" />
                <span>
                  {language === "bn"
                    ? "ভাঙচুরবিহীন সমাধান ও প্রতিকার (Non-Demolition Remedy)"
                    : "Non-Demolition Remedy"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
                {selectedItem.remedy_bn}
              </p>
            </div>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              {language === "bn"
                ? "💡 পরামর্শ: আপনার ঘরের এই দিকটি কম্পাস দিয়ে যাচাই করতে উপরের 'স্মার্ট ডিভাইস কম্পাস' ট্যাবে যান।"
                : "💡 Tip: Switch to the 'Live Compass' tab above to verify this direction in your home."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
