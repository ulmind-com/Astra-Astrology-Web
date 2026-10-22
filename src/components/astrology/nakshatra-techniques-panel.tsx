"use client";

/**
 * The client's own nakshatra techniques, applied to this chart.
 *
 * The two nakshatra volumes supplied for this project are organised as numbered
 * "techniques": conditional rules of the form "if the 9th lord sits in this star",
 * "if a malefic aspects it". They were unreadable until the scans were OCR'd, and
 * nothing in the calculator used them.
 *
 * Only techniques whose condition this chart actually satisfies are shown as
 * applying, and each says why. The rest are available to read but clearly separated,
 * because a rule that does not apply to you is reference material, not a reading.
 *
 * Mula to Revati have no techniques at all: the volume covering them was never
 * supplied. That is stated plainly rather than filled with invented content.
 */

import * as React from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  CircleCheck,
  FileText,
  Info,
  Sparkles,
} from "lucide-react";
import type { AstrologyLanguage, ClientNakshatraRules, NakshatraTechnique } from "@/types";

const COPY = {
  en: {
    heading: "What your birth star says about this chart",
    sub: "Every rule below is taken from the nakshatra volumes supplied for this project, and is shown only because your chart meets its condition.",
    applies: "Applies to your chart",
    alsoInBook: "Other techniques for this star",
    alsoSub: "These are recorded for this nakshatra but your chart does not meet their condition.",
    because: "Why this applies",
    starAfflicted: "This star is afflicted in your chart",
    starClear: "This star is not afflicted in your chart",
    noneMatched: "None of the recorded techniques for this star match your chart.",
    bookSays: "As the source book records this star",
    lord: "Lord",
    deity: "Deity",
    symbol: "Symbol",
    padas: "Padas",
    notSupplied: "No techniques available for this birth star",
    showAll: "Show the rest",
    showLess: "Hide the rest",
    matchedCount: (n: number, total: number) => `${n} of ${total} apply`,
  },
  bn: {
    heading: "আপনার জন্মনক্ষত্র এই কুণ্ডলী সম্পর্কে যা বলে",
    sub: "নিচের প্রতিটি নিয়ম এই প্রকল্পের জন্য প্রদত্ত নক্ষত্র-গ্রন্থ থেকে নেওয়া, এবং কেবল তখনই দেখানো হয়েছে যখন আপনার কুণ্ডলী তার শর্ত পূরণ করে।",
    applies: "আপনার কুণ্ডলীতে প্রযোজ্য",
    alsoInBook: "এই নক্ষত্রের অন্যান্য কৌশল",
    alsoSub: "এগুলি এই নক্ষত্রের জন্য লিপিবদ্ধ, তবে আপনার কুণ্ডলী এদের শর্ত পূরণ করে না।",
    because: "কেন প্রযোজ্য",
    starAfflicted: "আপনার কুণ্ডলীতে এই নক্ষত্র পীড়িত",
    starClear: "আপনার কুণ্ডলীতে এই নক্ষত্র পীড়িত নয়",
    noneMatched: "এই নক্ষত্রের লিপিবদ্ধ কোনো কৌশল আপনার কুণ্ডলীর সঙ্গে মেলেনি।",
    bookSays: "মূল গ্রন্থে এই নক্ষত্র সম্পর্কে যা লেখা",
    lord: "অধিপতি",
    deity: "দেবতা",
    symbol: "প্রতীক",
    padas: "পদ",
    notSupplied: "এই জন্মনক্ষত্রের জন্য কোনো কৌশল উপলব্ধ নেই",
    showAll: "বাকিগুলি দেখুন",
    showLess: "বাকিগুলি লুকান",
    matchedCount: (n: number, total: number) => `${total}-টির মধ্যে ${n}-টি প্রযোজ্য`,
  },
  hi: {
    heading: "आपका जन्म नक्षत्र इस कुंडली के विषय में क्या कहता है",
    sub: "नीचे दिया प्रत्येक नियम इस परियोजना हेतु प्रदत्त नक्षत्र-ग्रंथों से लिया गया है, तथा केवल तभी दिखाया गया है जब आपकी कुंडली उसकी शर्त पूरी करती हो।",
    applies: "आपकी कुंडली पर लागू",
    alsoInBook: "इस नक्षत्र की अन्य तकनीकें",
    alsoSub: "ये इस नक्षत्र हेतु दर्ज हैं, किंतु आपकी कुंडली इनकी शर्त पूरी नहीं करती।",
    because: "क्यों लागू है",
    starAfflicted: "आपकी कुंडली में यह नक्षत्र पीड़ित है",
    starClear: "आपकी कुंडली में यह नक्षत्र पीड़ित नहीं है",
    noneMatched: "इस नक्षत्र की कोई भी दर्ज तकनीक आपकी कुंडली से मेल नहीं खाती।",
    bookSays: "मूल ग्रंथ इस नक्षत्र के विषय में जो दर्ज करता है",
    lord: "अधिपति",
    deity: "देवता",
    symbol: "प्रतीक",
    padas: "पाद",
    notSupplied: "इस जन्म नक्षत्र हेतु कोई तकनीक उपलब्ध नहीं",
    showAll: "शेष दिखाएँ",
    showLess: "शेष छिपाएँ",
    matchedCount: (n: number, total: number) => `${total} में से ${n} लागू`,
  },
} as const;

function TechniqueCard({
  technique,
  labels,
  muted = false,
}: {
  technique: NakshatraTechnique;
  labels: (typeof COPY)[keyof typeof COPY];
  muted?: boolean;
}) {
  return (
    <article
      className={`rounded-2xl border p-4 transition-shadow ${
        muted ? "border-border/70 bg-surface-muted/50" : "border-border bg-white hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-900">
          {technique.theme}
        </span>
        {!muted && <CircleCheck className="size-4 shrink-0 text-emerald-600" aria-hidden />}
      </div>

      <p
        className={`mt-2 text-sm leading-relaxed ${
          muted ? "font-medium text-muted-foreground" : "font-semibold text-foreground"
        }`}
      >
        {technique.rule}
      </p>

      {technique.because.length > 0 && (
        <div className="mt-3 rounded-xl bg-brand-50 p-2.5">
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-800">
            <Sparkles className="size-3" />
            {labels.because}
          </p>
          <ul className="mt-1 space-y-0.5">
            {technique.because.map((reason, index) => (
              <li key={index} className="text-[11px] leading-relaxed text-brand-950">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80">
        <FileText className="size-2.5" />
        {technique.source}
      </p>
    </article>
  );
}

export function NakshatraTechniquesPanel({
  rules,
  language,
}: {
  rules: ClientNakshatraRules;
  language: AstrologyLanguage;
}) {
  const copy = COPY[language] ?? COPY.en;
  const [showRest, setShowRest] = React.useState(false);

  // No techniques exist for Mula to Revati, so say that rather than show an
  // empty panel that looks like a loading failure.
  if (!rules.has_client_source) {
    return (
      <section className="rounded-3xl border border-amber-300 bg-amber-50 p-5 sm:p-7">
        <h3 className="flex items-center gap-2 text-base font-extrabold text-amber-950">
          <Info className="size-5 shrink-0 text-amber-600" />
          {copy.notSupplied}
        </h3>
        {rules.unavailable_note && (
          <p className="mt-2 max-w-3xl text-xs leading-relaxed text-amber-900">
            {rules.unavailable_note}
          </p>
        )}
      </section>
    );
  }

  const reference = rules.book_reference;

  return (
    <section className="rounded-3xl border border-border bg-surface-muted/60 p-5 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground sm:text-xl">
            <BookOpen className="size-5 shrink-0 text-brand-600" />
            {copy.heading}
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">{copy.sub}</p>
        </div>
        <span className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-brand-900 shadow-2xs">
          {copy.matchedCount(rules.matched.length, rules.total_available)}
        </span>
      </header>

      {/* Affliction drives many of the conditions, so its state is stated up front. */}
      <div
        className={`mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border p-3 ${
          rules.is_afflicted
            ? "border-amber-300 bg-amber-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        {rules.is_afflicted ? (
          <AlertTriangle className="size-4 shrink-0 text-amber-600" />
        ) : (
          <CircleCheck className="size-4 shrink-0 text-emerald-600" />
        )}
        <span
          className={`text-xs font-bold ${
            rules.is_afflicted ? "text-amber-950" : "text-emerald-900"
          }`}
        >
          {rules.is_afflicted ? copy.starAfflicted : copy.starClear}
        </span>
        {rules.affliction_reasons.map((reason) => (
          <span
            key={reason}
            className="rounded-md bg-white/70 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900"
          >
            {reason}
          </span>
        ))}
      </div>

      {reference && (
        <div className="mt-3 rounded-2xl border border-border bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
            {copy.bookSays}
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                [copy.lord, reference.lord],
                [copy.deity, reference.deity],
                [copy.symbol, reference.symbol],
                [copy.padas, reference.padas],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10px] font-semibold text-muted-foreground">{label}</dt>
                <dd className="text-xs font-bold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 flex items-center gap-1 border-t border-border/70 pt-2 text-[10px] font-medium text-muted-foreground/80">
            <FileText className="size-2.5" />
            {reference.source}
          </p>
        </div>
      )}

      <h4 className="mt-5 text-xs font-bold uppercase tracking-wider text-brand-700">
        {copy.applies}
      </h4>
      {rules.matched.length > 0 ? (
        <div className="mt-2 grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rules.matched.map((technique) => (
            <TechniqueCard
              key={`${technique.source}-${technique.technique_no}`}
              technique={technique}
              labels={copy}
            />
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-2xl border border-border bg-white p-4 text-xs text-muted-foreground">
          {copy.noneMatched}
        </p>
      )}

      {rules.not_matched.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setShowRest((v) => !v)}
            aria-expanded={showRest}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-brand-300 bg-white px-3.5 py-2 text-xs font-bold text-brand-900 transition-colors hover:bg-brand-50"
          >
            {showRest ? copy.showLess : copy.showAll}
            <span className="font-semibold opacity-70">({rules.not_matched.length})</span>
            <ChevronDown
              className={`size-3.5 transition-transform ${showRest ? "rotate-180" : ""}`}
            />
          </button>

          {showRest && (
            <>
              <p className="mt-3 text-[11px] text-muted-foreground">{copy.alsoSub}</p>
              <div className="mt-2 grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                {rules.not_matched.map((technique) => (
                  <TechniqueCard
                    key={`${technique.source}-${technique.technique_no}`}
                    technique={technique}
                    labels={copy}
                    muted
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
