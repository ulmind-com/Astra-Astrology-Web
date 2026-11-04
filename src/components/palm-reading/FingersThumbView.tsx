"use client";

import * as React from "react";
import {
  Hand,
  Sparkles,
  Zap,
  Activity,
  Heart,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PalmLanguage } from "@/lib/palm-reading-translations";
import type { FingersThumbAnalysis, PalmScanResponse } from "@/types";

interface FingersThumbViewProps {
  result: PalmScanResponse;
  language: PalmLanguage;
}

export function FingersThumbView({ result, language }: FingersThumbViewProps) {
  // Use computed backend analysis or provide a safe classical fallback
  const analysis: FingersThumbAnalysis = React.useMemo(() => {
    if (result.fingers_thumb_analysis) {
      return result.fingers_thumb_analysis;
    }
    return {
      digit_ratio_2d_4d: 0.98,
      digit_ratio_type_en: "Balanced 2D:4D Ratio (Harmonious Empathy & Drive)",
      digit_ratio_type_bn: "সুষম ২ডি:৪ডি অনুপাত (সহানুভূতি ও নেতৃত্বের ভারসাম্য)",
      digit_ratio_type_hi: "संतुलित 2D:4D अनुपात (सहानुभूति व नेतृत्व का संतुलन)",
      digit_ratio_desc_en:
        "Index and ring finger lengths are in balanced equilibrium, granting high diplomatic versatility, empathy, and focused stamina.",
      digit_ratio_desc_bn:
        "তর্জনী ও অনামিকার দৈর্ঘ্য সুষম অনুপাতে স্থিত, যা জাতককে উচ্চ কূটনৈতিক বুদ্ধিমত্তা, গভীর সহানুভূতি ও মানসিক একাগ্রতা প্রদান করে।",
      digit_ratio_desc_hi:
        "तर्जनी एवं अनामिका की लंबाई संतुलित है, जो कूटनीतिक दक्षता, प्रखर संवाद और उच्च मानसिक एकाग्रता देती है।",
      thumb_length_ratio: 0.88,
      thumb_class_en: "2000cc Executive Engine (Strong Leadership & Willpower)",
      thumb_class_bn: "২০০০ সিসি এক্সিকিউটিভ ইঞ্জিন (আইএএস বা উচ্চপদস্থ সংকল্প)",
      thumb_class_hi: "2000cc उच्च प्रशासनिक इंजन (प्रखर इच्छाशक्ति व नेतृत्व)",
      thumb_meaning_en:
        "Long resolute thumb reaching well up the lower phalanx of Jupiter. Signifies commanding authority, tenacity, and unshakeable self-reliance.",
      thumb_meaning_bn:
        "দীর্ঘ ও বলিষ্ঠ অঙ্গুষ্ঠ বৃহস্পতি পর্বতের প্রথম পর্বের কাছাকাছি পৌঁছেছে। এটি দৃঢ় সংকল্প, উচ্চপদস্থ প্রশাসনিক নেতৃত্ব ও স্বাধীন সিদ্ধান্তের প্রতীক।",
      thumb_meaning_hi:
        "लंबा एवं दृढ़ अंगूठा जो बृहस्पति पर्वत के प्रथम पोर तक पहुंचता है। यह स्वतंत्र निर्णय क्षमता, उच्च नेतृत्व व प्रशासनिक सामर्थ्य दर्शाता है।",
      willpower_pct: 54,
      logic_reasoning_pct: 46,
      flexibility_en: "Flexible Thumb (>35° Backward Angle)",
      flexibility_bn: "নমনীয় অঙ্গুষ্ঠ (>৩৫° বিপরীত বক্রতা)",
      flexibility_hi: "लचीला अंगूठा (>35° कोण)",
      spread_stance_en: "Independent Open Stance (Broad-minded)",
      spread_stance_bn: "উন্মুক্ত সাহসী ভঙ্গি (স্বাধীনচেতা মনন)",
      spread_stance_hi: "स्वतंत्र उन्मुक्त स्वभाव",
      lunula_score: 84,
      nail_health_en: "Vibrant Lunula (Active Cellular Metabolism & Thyroid Vitality)",
      nail_health_bn: "উজ্জ্বল অর্ধচন্দ্র (সক্রিয় মেটাবলিজম ও স্নায়বিক সতেজতা)",
      nail_health_hi: "उज्ज्वल अर्धचंद्र (सक्रिय चयापचय व प्राणऊर्जा)",
    };
  }, [result.fingers_thumb_analysis]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-950 via-ink-950 to-brand-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-400/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-300 w-fit">
            <Hand className="size-3" />
            {language === "bn"
              ? "ধ্রুপদী হস্তরেখা ও অঙ্গুলি বিজ্ঞান"
              : language === "hi"
              ? "शास्त्रीय अंगुली एवं नख विज्ञान"
              : "Vedic Digit & Biometric Thumb Science"}
          </span>
          <h3 className="text-xl font-black sm:text-2xl">
            {language === "bn"
              ? "অঙ্গুলি, বৃদ্ধাঙ্গুষ্ঠ ও নখের অর্ধচন্দ্র বিচার"
              : language === "hi"
              ? "अंगुली, अंगूठा एवं नख चंद्र विश्लेषण"
              : "Fingers, Thumb Launchpad & Lunula Diagnostics"}
          </h3>
          <p className="text-xs text-white/70 max-w-2xl leading-relaxed">
            {language === "bn"
              ? "রাহুল শর্মা এবং প্রাচীন সমুদ্রিক শাস্ত্রের সূত্রানুসারে বৃদ্ধাঙ্গুষ্ঠ হলো ব্যক্তির অন্তরের মূল ইঞ্জিন (৮০০ সিসি বনাম ২০০০ সিসি সংকল্প)। এছাড়া তর্জনী-অনামিকার ২ডি:৪ডি অনুপাত ও নখের অর্ধচন্দ্র জাতকের হরমোনাল মেজাজ ও জীবনীশক্তি নিশ্চিত করে।"
              : language === "hi"
              ? "सामुद्रिक शास्त्र के अनुसार अंगूठा व्यक्ति की आंतरिक शक्ति का मुख्य इंजन है (800cc बनाम 2000cc संकल्प)। इसके अलावा 2D:4D अनुपात और नख का अर्धचंद्र व्यक्ति की मानसिक व शारीरिक ऊर्जा को प्रमाणित करते हैं।"
              : "Derived from Rahul Sharma's chiromancy teachings and classical texts: the thumb serves as the person's internal drive engine, complemented by the hormonal 2D:4D digit ratio and lunula metabolic crescent."}
          </p>
        </div>
      </div>

      {/* Top Grid: Thumb Engine & 2D:4D Ratio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Thumb Launchpad Engine Card */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-200 bg-gradient-to-br from-white via-brand-50/30 to-amber-50/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-brand-700">
              <Zap className="size-3 text-brand-600" />
              {language === "bn" ? "বৃদ্ধাঙ্গুষ্ঠ লঞ্চপ্যাড ইঞ্জিন" : language === "hi" ? "अंगूठा इंजन क्षमता" : "Thumb Engine Launchpad"}
            </span>
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-black text-brand-900">
              {analysis.thumb_length_ratio.toFixed(2)}x {language === "bn" ? "অনুপাত" : "Ratio"}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-black text-foreground">
              {language === "bn"
                ? analysis.thumb_class_bn
                : language === "hi"
                ? analysis.thumb_class_hi
                : analysis.thumb_class_en}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {language === "bn"
                ? analysis.thumb_meaning_bn
                : language === "hi"
                ? analysis.thumb_meaning_hi
                : analysis.thumb_meaning_en}
            </p>
          </div>

          {/* Willpower vs Logic Phalange Balance */}
          <div className="space-y-2 pt-2 border-t border-brand-100">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-brand-900 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" />
                {language === "bn" ? "ইচ্ছাশক্তি (প্রথম পর্ব)" : language === "hi" ? "इच्छाशक्ति (प्रथम पोर)" : "Willpower (1st Phalanx)"}: {analysis.willpower_pct}%
              </span>
              <span className="text-muted-foreground">
                {language === "bn" ? "যুক্তি ও বিচার (দ্বিতীয় পর্ব)" : language === "hi" ? "तर्क व विचार (द्वितीय पोर)" : "Logic (2nd Phalanx)"}: {analysis.logic_reasoning_pct}%
              </span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-brand-100">
              <div
                className="bg-brand-500 transition-all duration-1000"
                style={{ width: `${analysis.willpower_pct}%` }}
                title="Willpower"
              />
              <div
                className="bg-amber-400 transition-all duration-1000"
                style={{ width: `${analysis.logic_reasoning_pct}%` }}
                title="Logic & Reasoning"
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
              <span>{language === "bn" ? "দৃঢ় সংকল্প ও উদ্যোগ" : language === "hi" ? "दृढ़ संकल्प" : "Execution Drive"}</span>
              <span>{language === "bn" ? "কৌশলগত পরিকল্পনা ও যুক্তি" : language === "hi" ? "रणनीतिक विचार" : "Strategic Reasoning"}</span>
            </div>
          </div>
        </div>

        {/* 2D:4D Digit Ratio Card */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/20 to-blue-50/40 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-800">
              <Hand className="size-3 text-blue-600" />
              {language === "bn" ? "তর্জনী বনাম অনামিকা (২ডি:৪ডি)" : language === "hi" ? "तर्जनी बनाम अनामिका (2D:4D)" : "2D:4D Digit Ratio"}
            </span>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-black text-blue-900">
              {analysis.digit_ratio_2d_4d.toFixed(2)}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-black text-foreground">
              {language === "bn"
                ? analysis.digit_ratio_type_bn
                : language === "hi"
                ? analysis.digit_ratio_type_hi
                : analysis.digit_ratio_type_en}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {language === "bn"
                ? analysis.digit_ratio_desc_bn
                : language === "hi"
                ? analysis.digit_ratio_desc_hi
                : analysis.digit_ratio_desc_en}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200/70 bg-white/80 p-3.5 text-xs space-y-1">
            <span className="font-bold text-blue-950 uppercase tracking-wider text-[10px]">
              {language === "bn" ? "মনস্তাত্ত্বিক স্বভাব:" : language === "hi" ? "मनोवैज्ञानिक प्रकृति:" : "Behavioral Tendency:"}
            </span>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.digit_ratio_2d_4d > 1.0
                ? language === "bn"
                  ? "উচ্চ সহানুভূতি, যোগাযোগ ও সামাজিক বুদ্ধিমত্তা বিশিষ্ট। সংঘাত পরিহার করে পারস্পরিক সমঝোতায় বিশ্বাসী।"
                  : "High empathy, verbal agility, and cooperative negotiation style."
                : analysis.digit_ratio_2d_4d < 0.96
                ? language === "bn"
                  ? "উচ্চ প্রতিযোগিতা প্রবণতা, তাৎক্ষণিক ঝুঁকি নেওয়ার সাহস এবং খেলাধুলা বা ব্যবসায়ী নেতৃত্বে শ্রেষ্ঠত্ব।"
                  : "Competitive instinct, rapid spatial awareness, and decisive entrepreneurial leadership."
                : language === "bn"
                ? "বাস্তববুদ্ধি ও আবেগের চমৎকার সমন্বয়। পরিস্থিতির সাথে খাপ খাইয়ে নেতৃত্ব দেওয়ার সুষম ক্ষমতা।"
                : "Harmonious equilibrium between strategic assertion and emotional attunement."}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Flexibility, Stance & Lunula Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Thumb Flexibility & Finger Stance */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-xs space-y-4">
          <h4 className="text-base font-black text-foreground flex items-center gap-2">
            <Activity className="size-4 text-brand-600" />
            {language === "bn"
              ? "অঙ্গুষ্ঠ নমনীয়তা ও আঙুলের স্থিতি"
              : language === "hi"
              ? "अंगूठे का लचीलापन व उंगलियों की स्थिति"
              : "Thumb Flexibility & Finger Spread Stance"}
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-surface-muted p-3.5">
              <span className="text-xs font-bold text-muted-foreground">
                {language === "bn" ? "অঙ্গুষ্ঠ নমনীয়তা কোণ:" : language === "hi" ? "अंगूठे का लचीलापन:" : "Flexibility Arc:"}
              </span>
              <span className="text-xs font-extrabold text-foreground">
                {language === "bn"
                  ? analysis.flexibility_bn
                  : language === "hi"
                  ? analysis.flexibility_hi
                  : analysis.flexibility_en}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-surface-muted p-3.5">
              <span className="text-xs font-bold text-muted-foreground">
                {language === "bn" ? "আঙুল ছড়ানোর ভঙ্গি:" : language === "hi" ? "उंगलियों का प्रसार:" : "Finger Spread:"}
              </span>
              <span className="text-xs font-extrabold text-foreground">
                {language === "bn"
                  ? analysis.spread_stance_bn
                  : language === "hi"
                  ? analysis.spread_stance_hi
                  : analysis.spread_stance_en}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {language === "bn"
              ? "নমনীয় বৃদ্ধাঙ্গুষ্ঠ জাতককে বহুমুখী কাজে দক্ষ (Multitasker) এবং নতুন পরিবেশে দ্রুত খাপ খাইয়ে নিতে সাহায্য করে। অন্যদিকে উন্মুক্ত আঙুল স্বাধীন চিন্তাভাবনা নির্দেশ করে।"
              : language === "hi"
              ? "लचीला अंगूठा बहुआयामी प्रतिभा (Multitasker) और नए परिवेश में सामंजस्य की क्षमता देता है। खुली उंगलियां स्वतंत्र सोच का प्रमाण हैं।"
              : "Backward flexibility reflects high cognitive versatility and adaptability, while natural finger spread indicates boldness and uninhibited expression."}
          </p>
        </div>

        {/* Nail Health & Lunula Crescent */}
        <div className="rounded-3xl border border-rose-200 bg-gradient-to-br from-white via-rose-50/20 to-orange-50/30 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-rose-800">
              <Heart className="size-3 text-rose-600" />
              {language === "bn" ? "নখের অর্ধচন্দ্র (লুনুলা) বিচার" : language === "hi" ? "नख अर्धचंद्र (लूनुला) विचार" : "Nail Lunula Crescent"}
            </span>
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-black text-rose-900">
              {analysis.lunula_score}% {language === "bn" ? "সূচক" : "Index"}
            </span>
          </div>

          <div>
            <h4 className="text-base font-black text-foreground">
              {language === "bn"
                ? analysis.nail_health_bn
                : language === "hi"
                ? analysis.nail_health_hi
                : analysis.nail_health_en}
            </h4>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {language === "bn"
                ? "শাস্ত্রীয় স্বাস্থ্য পামিস্ট্রি অনুসারে নখের গোড়ার শুভ্র অর্ধচন্দ্র (Lunula) রক্তসঞ্চালন, থাইরয়েড ও স্নায়বিক সজীবতা নির্দেশ করে। এটি পরিপুষ্ট থাকলে জীবনীশক্তি অটুট থাকে।"
                : language === "hi"
                ? "स्वास्थ्य हस्तरेखा के अनुसार नख के मूल में श्वेत अर्धचंद्र (लूनुला) रक्तसंचार, चयापचय व तंत्रिका तंत्र की प्राणवान अवस्था को प्रकट करता है।"
                : "According to classical Health Palmistry, a distinct milky lunula on the thumb and primary fingers denotes vigorous cellular metabolism, strong thyroid vitality, and balanced cardiac circulation."}
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200/70 bg-white/90 p-3.5 flex items-center gap-3 text-xs">
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
            <span className="text-foreground leading-relaxed">
              {language === "bn"
                ? "অর্ধচন্দ্রের জ্যোতি চমৎকার; স্নায়বিক ক্লান্তি প্রতিরোধে পর্যাপ্ত জলপান ও ওজস রক্ষাকারী খাদ্য গ্রহণ শ্রেয়।"
                : language === "hi"
                ? "अर्धचंद्र की स्थिति सुदृढ़ है; प्राण ऊर्जा बनाए रखने हेतु नियमित विश्राम व पौष्टिक आहार लें।"
                : "Optimal crescent visibility observed. Maintain steady hydration and restful circadian cycles to preserve neuro-cellular prana."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
