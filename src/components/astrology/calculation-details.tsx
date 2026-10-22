"use client";

/**
 * Shows how the chart was actually calculated: the timezone that was used and why,
 * the real house cusps, and any caveat the engine raised.
 *
 * This exists because the old calculator gave no way to tell a correct chart from a
 * silently wrong one. The timezone was guessed from longitude, the house-system
 * selector had no effect, and a KP sub-lord was shown without saying which ayanamsa
 * it came from. Surfacing all three means a mis-geocoded birth is visible rather
 * than invisible.
 */

import * as React from "react";
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  Globe2,
  Grid3x3,
  Info,
} from "lucide-react";
import type {
  AstrologyLanguage,
  CalculationMeta,
  HouseCusp,
  TimezoneResolution,
} from "@/types";

interface CalculationDetailsProps {
  timezone?: TimezoneResolution | null;
  cusps?: HouseCusp[];
  calculation?: CalculationMeta | null;
  ayanamsaName: string;
  houseSystem: string;
  language: AstrologyLanguage;
}

const COPY = {
  en: {
    heading: "How this chart was calculated",
    timezone: "Timezone used",
    derivedFromPlace: "Derived from your birth place",
    enteredManually: "Entered manually",
    assumedDefault: "Assumed default",
    dstActive: "Daylight saving was in force",
    ayanamsa: "Ayanamsa",
    houseSystem: "House system",
    engine: "Engine",
    cusps: "House cusps",
    house: "House",
    position: "Position",
    checkThis: "Worth checking",
    details: "Calculation details",
    manualWarning:
      "No timezone could be derived from the birth place, so daylight saving and historical changes are not accounted for. Choosing the birth place from the search list fixes this.",
  },
  bn: {
    heading: "এই কুণ্ডলী কীভাবে গণনা করা হয়েছে",
    timezone: "ব্যবহৃত সময়াঞ্চল",
    derivedFromPlace: "আপনার জন্মস্থান থেকে নির্ণীত",
    enteredManually: "নিজে বসানো",
    assumedDefault: "অনুমিত ডিফল্ট",
    dstActive: "ডেলাইট সেভিং চালু ছিল",
    ayanamsa: "অয়নাংশ",
    houseSystem: "ভাব পদ্ধতি",
    engine: "গণনা ইঞ্জিন",
    cusps: "ভাবসন্ধি",
    house: "ভাব",
    position: "অবস্থান",
    checkThis: "যা দেখে নেওয়া ভালো",
    details: "গণনার বিবরণ",
    manualWarning:
      "জন্মস্থান থেকে সময়াঞ্চল নির্ণয় করা যায়নি, তাই ডেলাইট সেভিং ও ঐতিহাসিক পরিবর্তন ধরা হয়নি। খোঁজার তালিকা থেকে জন্মস্থান বেছে নিলে এটি ঠিক হয়ে যাবে।",
  },
  hi: {
    heading: "यह कुंडली कैसे गणना की गई",
    timezone: "प्रयुक्त समय क्षेत्र",
    derivedFromPlace: "आपके जन्म स्थान से निर्धारित",
    enteredManually: "स्वयं भरा गया",
    assumedDefault: "अनुमानित डिफ़ॉल्ट",
    dstActive: "डेलाइट सेविंग लागू थी",
    ayanamsa: "अयनांश",
    houseSystem: "भाव पद्धति",
    engine: "गणना इंजन",
    cusps: "भाव संधि",
    house: "भाव",
    position: "स्थिति",
    checkThis: "ध्यान देने योग्य",
    details: "गणना विवरण",
    manualWarning:
      "जन्म स्थान से समय क्षेत्र निर्धारित नहीं हो सका, अतः डेलाइट सेविंग एवं ऐतिहासिक परिवर्तन सम्मिलित नहीं हैं। खोज सूची से जन्म स्थान चुनने पर यह ठीक हो जाएगा।",
  },
} as const;

export function CalculationDetails({
  timezone,
  cusps,
  calculation,
  ayanamsaName,
  houseSystem,
  language,
}: CalculationDetailsProps) {
  const copy = COPY[language] ?? COPY.en;
  const [open, setOpen] = React.useState(false);

  const warnings = calculation?.warnings ?? [];
  const sourceLabel =
    timezone?.source === "iana"
      ? copy.derivedFromPlace
      : timezone?.source === "manual"
        ? copy.enteredManually
        : copy.assumedDefault;

  const needsAttention = timezone?.source !== "iana" || warnings.length > 0;

  return (
    <section className="rounded-3xl border border-border bg-white p-5 sm:p-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <Info className="size-4 shrink-0 text-brand-600" />
          <span className="truncate text-sm font-extrabold text-foreground">{copy.heading}</span>
          {needsAttention && (
            <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
              {warnings.length || 1}
            </span>
          )}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* The timezone summary stays visible even when collapsed, because a wrong
          offset is the single most likely cause of a wrong chart. */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-muted px-2.5 py-1.5 text-[11px] font-semibold text-foreground">
          <Clock className="size-3 text-brand-600" />
          <span className="tabular-nums">{timezone?.offset_label ?? "—"}</span>
          {timezone?.abbreviation && (
            <span className="text-muted-foreground">{timezone.abbreviation}</span>
          )}
        </span>
        {timezone?.zone_name && (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-surface-muted px-2.5 py-1.5 text-[11px] font-semibold text-foreground">
            <Globe2 className="size-3 text-brand-600" />
            {timezone.zone_name}
          </span>
        )}
        <span
          className={`rounded-xl px-2.5 py-1.5 text-[11px] font-semibold ${
            timezone?.source === "iana"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-900"
          }`}
        >
          {sourceLabel}
        </span>
        {timezone?.is_dst && (
          <span className="rounded-xl bg-brand-100 px-2.5 py-1.5 text-[11px] font-semibold text-brand-900">
            {copy.dstActive}
          </span>
        )}
      </div>

      {timezone?.source === "manual" && (
        <p className="mt-2.5 flex gap-2 rounded-xl bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
          <AlertTriangle className="mt-px size-3.5 shrink-0" />
          {copy.manualWarning}
        </p>
      )}

      {open && (
        <div className="mt-4 space-y-4 border-t border-border pt-4">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              [copy.ayanamsa, ayanamsaName],
              [copy.houseSystem, houseSystem],
              [copy.engine, calculation?.ephemeris ?? "—"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-surface-muted p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                  {label}
                </dt>
                <dd className="mt-0.5 text-[11px] font-semibold leading-snug text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                <AlertTriangle className="size-3" />
                {copy.checkThis}
              </p>
              <ul className="mt-2 space-y-1.5">
                {warnings.map((warning, index) => (
                  <li
                    key={index}
                    className="text-[11px] leading-relaxed text-amber-950"
                  >
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cusps && cusps.length === 12 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                <Grid3x3 className="size-3" />
                {copy.cusps}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                {cusps.map((cusp) => (
                  <div
                    key={cusp.house}
                    className="flex items-baseline gap-2 rounded-xl bg-surface-muted px-2.5 py-2"
                  >
                    <span className="text-[10px] font-extrabold text-brand-700">
                      {cusp.house}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-foreground">
                      {cusp.sign}
                    </span>
                    <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                      {cusp.degree_formatted}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
