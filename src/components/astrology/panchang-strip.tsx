"use client";

/**
 * The five panchang elements, plus sunrise and sunset.
 *
 * These are here because the client's own reference report prints them beside the
 * Avakahada Chakra and the calculator produced none of them. Every value shown has
 * been checked against that report on both of its worked charts.
 */

import * as React from "react";
import { Moon, Sunrise, Sunset } from "lucide-react";
import type { AstrologyLanguage, BirthPanchang } from "@/types";

const COPY = {
  en: {
    heading: "Panchang at birth",
    sub: "The five limbs of the Vedic calendar for this moment.",
    tithi: "Tithi",
    yoga: "Yoga",
    karana: "Karana",
    yunja: "Yunja",
    nakshatra: "Nakshatra",
    sunrise: "Sunrise",
    sunset: "Sunset",
    notAvailable: "Does not occur on this date at this latitude",
    elapsed: "elapsed",
  },
  bn: {
    heading: "জন্মকালীন পঞ্চাঙ্গ",
    sub: "এই মুহূর্তের বৈদিক পঞ্জিকার পাঁচটি অঙ্গ।",
    tithi: "তিথি",
    yoga: "যোগ",
    karana: "করণ",
    yunja: "যুঞ্জ",
    nakshatra: "নক্ষত্র",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    notAvailable: "এই অক্ষাংশে এই তারিখে ঘটে না",
    elapsed: "অতিবাহিত",
  },
  hi: {
    heading: "जन्मकालीन पंचांग",
    sub: "इस क्षण की वैदिक पंचांग के पाँच अंग।",
    tithi: "तिथि",
    yoga: "योग",
    karana: "करण",
    yunja: "युंज",
    nakshatra: "नक्षत्र",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    notAvailable: "इस अक्षांश पर इस तिथि को नहीं होता",
    elapsed: "व्यतीत",
  },
} as const;

function Cell({
  label,
  value,
  sub,
  progress,
}: {
  label: string;
  value: string;
  sub?: string | null;
  progress?: number | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">{label}</p>
      <p className="mt-1 text-sm font-extrabold leading-snug text-foreground">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{sub}</p>}
      {typeof progress === "number" && (
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-muted"
          role="presentation"
        >
          <div
            className="h-full rounded-full bg-brand-400"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export function PanchangStrip({
  panchang,
  nakshatraName,
  language,
}: {
  panchang: BirthPanchang;
  nakshatraName?: string;
  language: AstrologyLanguage;
}) {
  const copy = COPY[language] ?? COPY.en;
  const pct = (v?: number | null) =>
    typeof v === "number" ? `${Math.round(v)}% ${copy.elapsed}` : null;

  return (
    <section className="rounded-3xl border border-border bg-surface-muted/60 p-5 sm:p-7">
      <header>
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
          <Moon className="size-5 shrink-0 text-brand-600" />
          {copy.heading}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{copy.sub}</p>
      </header>

      <div className="mt-4 grid grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Cell
          label={copy.tithi}
          value={panchang.tithi.name}
          sub={panchang.tithi.paksha}
          progress={panchang.tithi.percentage_elapsed}
        />
        {nakshatraName && <Cell label={copy.nakshatra} value={nakshatraName} />}
        <Cell
          label={copy.yoga}
          value={panchang.yoga.name}
          sub={pct(panchang.yoga.percentage_elapsed)}
          progress={panchang.yoga.percentage_elapsed}
        />
        <Cell
          label={copy.karana}
          value={panchang.karana.name}
          sub={pct(panchang.karana.percentage_elapsed)}
          progress={panchang.karana.percentage_elapsed}
        />
        <Cell label={copy.yunja} value={panchang.yunja.name} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(
          [
            [copy.sunrise, panchang.sunrise, <Sunrise key="r" className="size-4 text-amber-500" />],
            [copy.sunset, panchang.sunset, <Sunset key="s" className="size-4 text-rose-500" />],
          ] as const
        ).map(([label, value, icon]) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3"
          >
            {icon}
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
              {label}
            </span>
            <span
              className={`ml-auto font-extrabold tabular-nums ${
                value ? "text-sm text-foreground" : "text-[11px] text-muted-foreground"
              }`}
            >
              {value ?? copy.notAvailable}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
