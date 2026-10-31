"use client";

import * as React from "react";
import {
  Sparkles,
  Sun,
  Moon,
  Flame,
  Compass,
  Shield,
  CheckCircle2,
  XCircle,
  Award,
  Layers,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { vastuApi } from "@/lib/api";
import type { AstroVastuRule } from "@/types/vastu";
import type { AstrologyLanguage } from "@/types";
import { VASTU_I18N } from "@/lib/vastu-translations";

const LOCAL_PLANETS_RULES: AstroVastuRule[] = [
  {
    planet_id: "sun",
    planet_name_bn: "রবি (Sun)",
    governing_direction: "East (পূর্ব দিক)",
    element: "Fire/Air (অগ্নি ও বায়ু)",
    importance_during_dasha_bn: "সূর্যের মহাদশায় পদোন্নতি, সরকারি সাহায্য, আত্মমর্যাদা ও পিতা-পুত্রের সম্পর্ক বজায় রাখতে পূর্ব দিক সক্রিয় রাখা বাধ্যতামূলক।",
    critical_dos_bn: ["পূর্ব দেওয়ালে ১২ ইঞ্চি পিতলের সূর্য টাঙান", "পূর্ব দিক সবসময় খোলা ও আলোকময় রাখুন", "সকালে সূর্য প্রণাম করুন"],
    critical_donts_bn: ["পূর্বে কোনো ভারী স্টোররুম বা আবর্জনা রাখবেন না", "পূর্বে টয়লেট বা অন্ধকার রাখবেন না"],
    talismanic_remedy_bn: "পূর্ব দেওয়ালে ৫ ফুট উচ্চতায় খাঁটি ব্রাস বা তামার সূর্যের প্রতিকৃতি স্থাপন করুন।",
  },
  {
    planet_id: "moon",
    planet_name_bn: "চন্দ্র (Moon)",
    governing_direction: "NW (উত্তর-পশ্চিম দিক)",
    element: "Air/Water (বায়ু ও জল)",
    importance_during_dasha_bn: "চন্দ্রের মহাদশায় মানসিক শান্তি, বিদেশযাত্রা, তরল অর্থ ও মাতার স্বাস্থ্য রক্ষায় উত্তর-পশ্চিম জোন ভারসাম্যপূর্ণ হওয়া আবশ্যক।",
    critical_dos_bn: ["উত্তর-পশ্চিমে সিলভার উইন্ডচাইম বা পারদ শিবলিঙ্গ রাখুন", "সাদা ফুল বা রূপার স্বস্তিক লাগান"],
    critical_donts_bn: ["উত্তর-পশ্চিমে অগ্নিতত্ত্ব বা গ্যাস ওভেন রাখবেন না", "অতিরিক্ত ভারী আলমারি রাখবেন না"],
    talismanic_remedy_bn: "উত্তর-পশ্চিম কোণে কাচের পাত্রে খাঁটি কর্পূর ও রূপার চাঁদের প্রতীক স্থাপন করুন।",
  },
  {
    planet_id: "mars",
    planet_name_bn: "মঙ্গল (Mars)",
    governing_direction: "South (দক্ষিণ দিক)",
    element: "Fire (অগ্নি)",
    importance_during_dasha_bn: "মঙ্গলের মহাদশায় সাহস, জমি-সম্পত্তি, ভ্রাতৃসুখ ও রক্ত সংবহনের সুস্থতায় দক্ষিণ দিক ও অগ্নিকোণ সক্রিয় রাখা প্রয়োজন।",
    critical_dos_bn: ["দক্ষিণ দেওয়ালে লাল রঙ বা লাল ঘোড়ার ছবি রাখুন", "অগ্নিকোণ পরিষ্কার রাখুন"],
    critical_donts_bn: ["দক্ষিণে আন্ডারগ্রাউন্ড ওয়াটার বা নীল রঙ রাখবেন না", "দক্ষিণ খোলা রেখে উত্তর বন্ধ করবেন না"],
    talismanic_remedy_bn: "দক্ষিণ দেওয়ালে উত্তরমূখী ১২টি তেজস্বী লাল ঘোড়ার প্রতিকৃতি স্থাপন করুন।",
  },
  {
    planet_id: "mercury",
    planet_name_bn: "বুধ (Mercury)",
    governing_direction: "North (উত্তর দিক)",
    element: "Water/Earth (জল ও বুধ)",
    importance_during_dasha_bn: "বুধের মহাদশায় ব্যবসা, বুদ্ধিদীপ্ত সিদ্ধান্ত, নতুন ক্লায়েন্ট ও তারল্য বৃদ্ধিতে উত্তর দিক সক্রিয় রাখা সর্বোত্তম।",
    critical_dos_bn: ["উত্তরে সবুজ মানিপ্ল্যান্ট ও পিতলের কুবের মূর্তি রাখুন", "উত্তর দিক খোলামেলা ও পরিষ্কার রাখুন"],
    critical_donts_bn: ["উত্তরে লাল/কমলা রঙ বা রান্নাঘরের বার্নার রাখবেন না", "উত্তরে ভারী লোহালক্কড় রাখবেন না"],
    talismanic_remedy_bn: "উত্তর দেওয়ালে একটি সমৃদ্ধ সবুজ বনের দৃশ্য বা পিতলের কুবের যন্ত্র স্থাপন করুন।",
  },
  {
    planet_id: "jupiter",
    planet_name_bn: "বৃহস্পতি (Jupiter)",
    governing_direction: "NE (উত্তর-পূর্ব / ঈশান)",
    element: "Water/Ether (জল ও আকাশ)",
    importance_during_dasha_bn: "বৃহস্পতির মহাদশায় উচ্চশিক্ষা, আধ্যাত্মিক জ্ঞান, সুসন্তান ও দীর্ঘস্থায়ী ভাগ্যোন্নয়নে ঈশান কোণ ১০০% পবিত্র থাকতে হবে।",
    critical_dos_bn: ["ঈশানে পূজা ঘর ও স্ফটিক মালা রাখুন", "হালকা হলুদ বা অফ-হোয়াইট রঙ রাখুন"],
    critical_donts_bn: ["ঈশানে জুতো, ডাস্টবিন, ভারী সিঁড়ি বা টয়লেট রাখবেন না", "ঈশানে রান্নাঘর রাখবেন না"],
    talismanic_remedy_bn: "ঈশান কোণে পিতলের পাত্রে পবিত্র গঙ্গাজল ও একটি কাঁচা হলুদ রাখুন।",
  },
  {
    planet_id: "venus",
    planet_name_bn: "শুক্র (Venus)",
    governing_direction: "SE (দক্ষিণ-পূর্ব / অগ্নিকোণ)",
    element: "Fire (অগ্নি)",
    importance_during_dasha_bn: "শুক্রের মহাদশায় বৈবাহিক সৌভাগ্য, লাক্সারি, নারী সঙ্গ ও নগদ অর্থের প্রাচুর্য পেতে দক্ষিণ-পূর্ব কোণ প্রজ্বলিত থাকা দরকার।",
    critical_dos_bn: ["দক্ষিণ-পূর্বে রান্নাঘর রাখুন এবং ১৫ ওয়াট লাল বাল্ব জ্বালান", "রুপোর পাত্রে চন্দন রাখুন"],
    critical_donts_bn: ["দক্ষিণ-পূর্বে জলের ট্যাপ, ওয়াশ বেসিন বা নীল রঙ রাখবেন না"],
    talismanic_remedy_bn: "দক্ষিণ-পূর্ব দেওয়ালে একটি জ্বলন্ত প্রদীপের চিত্র বা গোলাপী কোয়ার্টজ ক্রিস্টাল রাখুন।",
  },
  {
    planet_id: "saturn",
    planet_name_bn: "শনি (Saturn)",
    governing_direction: "West (পশ্চিম দিক)",
    element: "Space/Air (আকাশ ও বায়ু)",
    importance_during_dasha_bn: "শনির মহাদশায় কর্মক্ষেত্রে দীর্ঘস্থায়ী লাভ, ধৈর্য ও স্থায়িত্ব অর্জনের জন্য পশ্চিম দিক সুশৃঙ্খল থাকা আবশ্যক।",
    critical_dos_bn: ["পশ্চিমে ডাইনিং রুম বা অধ্যয়নের স্থান রাখুন", "ধাতব বা রূপালী আসবাব রাখুন"],
    critical_donts_bn: ["পশ্চিমে আবর্জনা বা লাল রঙের ছটা রাখবেন না", "পশ্চিম দিক নিচু করবেন না"],
    talismanic_remedy_bn: "পশ্চিম দিকে কালো ঘোড়ার নাল বা স্টেইনলেস স্টিল চক্র স্থাপন করুন।",
  },
  {
    planet_id: "rahu",
    planet_name_bn: "রাহু (Rahu)",
    governing_direction: "SW (দক্ষিণ-পশ্চিম / নৈঋত)",
    element: "Earth (পৃথিবী)",
    importance_during_dasha_bn: "রাহুর মহাদশায় আকস্মিক দুর্ঘটনা, আইনি ঝামেলা ও পারিবারিক সংকট এড়াতে দক্ষিণ-পশ্চিম কোণ সুরক্ষিত রাখা জীবনরক্ষাকারী।",
    critical_dos_bn: ["দক্ষিণ-পশ্চিম সবচেয়ে উঁচু ও ভারী রাখুন", "হলুদ বা মাটির রঙ ব্যবহার করুন", "মাস্টার বেডরুম এখানে রাখুন"],
    critical_donts_bn: ["নৈঋতে টয়লেট বা আন্ডারগ্রাউন্ড ওয়াটার চরম বিপর্যয় ডেকে আনে", "SW-তে কাটা কোণ রাখবেন না"],
    talismanic_remedy_bn: "দক্ষিণ-পশ্চিমের মেঝের খাঁজে ৪ মিমি ব্রাস ও লেড স্ট্রিপ বসিয়ে সিল করুন এবং ভারী পিতলের হাতি রাখুন।",
  },
  {
    planet_id: "ketu",
    planet_name_bn: "কেতু (Ketu)",
    governing_direction: "NE / Brahmasthan (কেন্দ্র ও ঈশান)",
    element: "Ether (আকাশ)",
    importance_during_dasha_bn: "কেতুর মহাদশায় মোক্ষ, গুপ্তবিদ্যা ও আত্মিক জাগরণে ব্রহ্মস্থান সম্পূর্ণ ফাঁকা ও আলোকিত রাখা উচিত।",
    critical_dos_bn: ["ঘরের কেন্দ্র সম্পূর্ণ ভারমুক্ত ও পরিচ্ছন্ন রাখুন", "ঈশানে রূপার স্বস্তিক প্রতীক রাখুন"],
    critical_donts_bn: ["ব্রহ্মস্থানে পিলার, ভারী দেওয়াল বা সেপটিক ট্যাংক রাখবেন না"],
    talismanic_remedy_bn: "ব্রহ্মস্থানে একটি অষ্টকোণী পিতলের সূর্য বা শ্রীযন্ত্র স্থাপন করুন।",
  },
];

interface AstroVastuProps {
  language?: AstrologyLanguage;
}

export function AstroVastu({ language = "bn" }: AstroVastuProps) {
  const t = VASTU_I18N[language] || VASTU_I18N.en;
  const [rules, setRules] = React.useState<AstroVastuRule[]>(LOCAL_PLANETS_RULES);
  const [activePlanet, setActivePlanet] = React.useState<string>("rahu");

  React.useEffect(() => {
    vastuApi
      .getAstroVastuRules()
      .then((res) => {
        if (res && res.length > 0) setRules(res);
      })
      .catch(() => {});
  }, []);

  const selectedRule = rules.find((r) => r.planet_id === activePlanet) || rules[0];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-surface border border-indigo-500/20 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 text-indigo-900 dark:text-indigo-300 px-3 py-1 text-xs font-bold border border-indigo-400/30">
              <Sparkles className="size-3.5" />
              <span>
                {language === "bn"
                  ? "অ্যাস্ট্রো-বাস্তু সাইনার্জি ইঞ্জিন (Astro-Vastu Synergy)"
                  : language === "hi"
                  ? "एस्ट्रो-वास्तु कुण्डली तालमेल"
                  : "Astro-Vastu Synergy Engine"}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {language === "bn"
                ? "আপনার বর্তমান মহাদশার গ্রহ অনুসারে ঘরের সক্রিয় কোণ ব্যালেন্স করুন"
                : language === "hi"
                ? "अपनी महादशा ग्रह अनुसार घर के सक्रिय वास्तु कोण को संतुलित करें"
                : "Align Your House Directions with Your Active Planetary Dasha"}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              {language === "bn"
                ? "দীপক রাজপুতের অ্যাডভান্সড বাস্তু ম্যানুয়াল (অধ্যায় ৬) অনুসারে একই বাড়ি সব মানুষের ওপর সমান ফল দেয় না। যে গ্রহের মহাদশা চলমান, সেই গ্রহের সংশ্লিষ্ট দিক সবচেয়ে বেশি সক্রিয় হয়ে ওঠে।"
                : language === "hi"
                ? "दीपक राजपूत वास्तु नियमावली (अध्याय 6) अनुसार कुंडली की महादशा का ग्रह घर की संबंधित दिशा को सक्रिय करता है।"
                : "According to Deepak Rajput's Advanced Vastu manual (Chapter 6), a house affects each native differently depending on their active Mahadasha planet."}
            </p>
          </div>
        </div>
      </div>

      {/* Planetary Selector Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {rules.map((rule) => {
          const isSelected = rule.planet_id === activePlanet;
          return (
            <button
              key={rule.planet_id}
              onClick={() => setActivePlanet(rule.planet_id)}
              type="button"
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-sm scale-102"
                  : "bg-surface border-border/80 text-muted-foreground hover:text-foreground hover:bg-surface-muted"
              }`}
            >
              <span>{rule.planet_name_bn}</span>
              <span className="text-[10px] opacity-75 font-normal">({rule.governing_direction.split(" ")[0]})</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Planetary Guidance Card */}
      {selectedRule && (
        <div className="rounded-2xl bg-surface border border-border p-5 sm:p-7 space-y-6 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-indigo-800 dark:text-indigo-300 font-bold">
                {t.activePlanetZone}
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-foreground">
                {selectedRule.planet_name_bn}
              </h4>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-300 font-extrabold text-xs sm:text-sm shadow-2xs">
                {selectedRule.governing_direction}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-surface-muted border border-border text-muted-foreground text-xs font-semibold">
                {selectedRule.element}
              </span>
            </div>
          </div>

          {/* Dasha Importance */}
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
            <p className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              {t.dashaSignificance}
            </p>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              {selectedRule.importance_during_dasha_bn}
            </p>
          </div>

          {/* Critical DOs and DONTs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DOs */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/25 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="size-4" />
                <span>{t.criticalDos}</span>
              </div>
              <ul className="space-y-2">
                {selectedRule.critical_dos_bn.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-foreground/90 flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DONTs */}
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/25 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
                <XCircle className="size-4" />
                <span>{t.criticalDonts}</span>
              </div>
              <ul className="space-y-2">
                {selectedRule.critical_donts_bn.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-sm text-foreground/90 flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Talismanic Remedy */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <Award className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">
                {t.talismanicRemedy}
              </p>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-semibold">
                {selectedRule.talismanic_remedy_bn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
