"use client";

/**
 * The classification groups the client's own resource documents define for a sign.
 *
 * The calculator previously surfaced four of these groups - element, modality,
 * polarity and body parts - out of the fifteen that 01.pdf sets out, so most of what
 * the client supplied never reached the screen. All of them are shown here, each with
 * the client's own definition, the predictive use they stated where they gave one,
 * and a citation back to the file and page it was transcribed from.
 */

import * as React from "react";
import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  Compass,
  FileText,
  Lightbulb,
  MapPinned,
  Sparkles,
} from "lucide-react";
import type { AstrologyLanguage, ClientSignProfile, KpReference } from "@/types";

interface ClientRulesPanelProps {
  profile: ClientSignProfile;
  /** Rules for the ascendant sign, shown as a second tab when present. */
  ascendantProfile?: ClientSignProfile | null;
  kpReference?: KpReference;
  language: AstrologyLanguage;
}

const COPY = {
  en: {
    heading: "Classical rules for your sign",
    sub: "Every classification below is transcribed from the resource documents supplied for this project, with the source noted on each card.",
    moonTab: "Moon sign",
    ascTab: "Ascendant",
    places: "Places and significations",
    traits: "Described traits",
    bodyParts: "Body parts governed",
    guna: "Guna (inherent nature)",
    gunaDisputed: "The source document gives two different answers here",
    application: "How it is used",
    definition: "What this means",
    sources: "Sources",
    kpHeading: "The five basic rules of the KP system",
    kpSub: "Quoted from the KP reference supplied for this project.",
    showMore: "Show all classifications",
    showLess: "Show fewer",
  },
  bn: {
    heading: "আপনার রাশির শাস্ত্রীয় শ্রেণিবিভাগ",
    sub: "নিচের প্রতিটি শ্রেণিবিভাগ এই প্রকল্পের জন্য প্রদত্ত মূল নথি থেকে প্রতিলিপি করা, প্রতিটি কার্ডে উৎস উল্লিখিত।",
    moonTab: "চন্দ্ররাশি",
    ascTab: "লগ্ন",
    places: "স্থান ও কারকত্ব",
    traits: "বর্ণিত লক্ষণ",
    bodyParts: "অধিকৃত অঙ্গ",
    guna: "গুণ (সহজাত প্রকৃতি)",
    gunaDisputed: "মূল নথিতে এই বিষয়ে দুটি ভিন্ন উত্তর রয়েছে",
    application: "কীভাবে ব্যবহৃত হয়",
    definition: "এর অর্থ",
    sources: "উৎস",
    kpHeading: "KP পদ্ধতির পাঁচটি মূল নিয়ম",
    kpSub: "এই প্রকল্পের জন্য প্রদত্ত KP নথি থেকে উদ্ধৃত।",
    showMore: "সব শ্রেণিবিভাগ দেখুন",
    showLess: "কম দেখুন",
  },
  hi: {
    heading: "आपकी राशि के शास्त्रीय वर्गीकरण",
    sub: "नीचे दिया प्रत्येक वर्गीकरण इस परियोजना हेतु प्रदत्त मूल दस्तावेज़ों से प्रतिलिपित है, प्रत्येक कार्ड पर स्रोत अंकित है।",
    moonTab: "चंद्र राशि",
    ascTab: "लग्न",
    places: "स्थान एवं कारकत्व",
    traits: "वर्णित लक्षण",
    bodyParts: "अधिकृत अंग",
    guna: "गुण (सहज प्रकृति)",
    gunaDisputed: "मूल दस्तावेज़ इस विषय पर दो भिन्न उत्तर देता है",
    application: "किस प्रकार प्रयुक्त",
    definition: "इसका अर्थ",
    sources: "स्रोत",
    kpHeading: "KP पद्धति के पाँच मूल नियम",
    kpSub: "इस परियोजना हेतु प्रदत्त KP दस्तावेज़ से उद्धृत।",
    showMore: "सभी वर्गीकरण देखें",
    showLess: "कम दिखाएँ",
  },
} as const;

type Labels = (typeof COPY)[keyof typeof COPY];

/** The groups most readers look for first, kept visible before "show all". */
const PRIMARY_KEYS = [
  "triplicity",
  "quadruplicity",
  "quality",
  "varna",
  "dosha",
  "day_night",
  "colour",
  "kalapurusha",
];

function RuleCard({
  label,
  value,
  definition,
  application,
  source,
  labels,
}: {
  label: string;
  value: string;
  definition: string;
  application?: string | null;
  source: string;
  labels: Labels;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="group rounded-2xl border border-border bg-white p-4 transition-shadow hover:shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">{label}</p>
      <p className="mt-1 text-sm font-bold leading-snug text-foreground">{value}</p>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-800 transition-colors hover:text-brand-900"
      >
        {labels.definition}
        <ChevronDown
          className={`size-3 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 border-t border-border/70 pt-2">
          <p className="text-[11px] leading-relaxed text-muted-foreground">{definition}</p>
          {application && (
            <div className="rounded-xl bg-brand-50 p-2.5">
              <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-brand-800">
                <Lightbulb className="size-3" /> {labels.application}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-brand-950">{application}</p>
            </div>
          )}
          <p className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground/80">
            <FileText className="size-2.5" /> {source}
          </p>
        </div>
      )}
    </div>
  );
}

function ChipList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
        {icon}
        {title}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-lg bg-surface-muted px-2 py-1 text-[11px] font-semibold text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClientRulesPanel({
  profile,
  ascendantProfile,
  kpReference,
  language,
}: ClientRulesPanelProps) {
  const copy = COPY[language] ?? COPY.en;
  const [tab, setTab] = React.useState<"moon" | "ascendant">("moon");
  const [showAll, setShowAll] = React.useState(false);

  const active = tab === "ascendant" && ascendantProfile ? ascendantProfile : profile;

  const localName =
    language === "bn" ? active.name_bn : language === "hi" ? active.name_hi : active.name_en;

  const visible = showAll
    ? active.classifications
    : active.classifications.filter((entry) => PRIMARY_KEYS.includes(entry.key));

  return (
    <section className="rounded-3xl border border-border bg-surface-muted/60 p-5 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground sm:text-xl">
            <BookOpen className="size-5 shrink-0 text-brand-600" />
            {copy.heading}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">{copy.sub}</p>
        </div>

        {ascendantProfile && ascendantProfile.index !== profile.index && (
          <div
            role="tablist"
            aria-label={copy.heading}
            className="flex shrink-0 gap-1 rounded-xl bg-white p-1 shadow-2xs"
          >
            {(
              [
                ["moon", copy.moonTab, profile],
                ["ascendant", copy.ascTab, ascendantProfile],
              ] as const
            ).map(([key, label, data]) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors ${
                  tab === key
                    ? "bg-brand-300 text-brand-950"
                    : "text-muted-foreground hover:bg-surface-muted"
                }`}
              >
                {label}
                <span className="ml-1 font-semibold opacity-70">
                  {language === "bn"
                    ? data.name_bn
                    : language === "hi"
                      ? data.name_hi
                      : data.name_en}
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      <p className="mt-4 text-sm font-bold text-foreground">
        {localName}
        <span className="ml-2 text-xs font-semibold text-muted-foreground">
          {active.name_sa} · {active.lord}
        </span>
      </p>

      <div className="mt-4 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((entry) => (
          <RuleCard
            key={entry.key}
            label={entry.label}
            value={entry.value}
            definition={entry.definition}
            application={entry.application}
            source={entry.source}
            labels={copy}
          />
        ))}
      </div>

      {active.classifications.length > visible.length || showAll ? (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-brand-300 bg-white px-3.5 py-2 text-xs font-bold text-brand-900 transition-colors hover:bg-brand-50"
        >
          {showAll ? copy.showLess : copy.showMore}
          <span className="font-semibold opacity-70">
            ({active.classifications.length})
          </span>
          <ChevronDown className={`size-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      ) : null}

      {/* Guna is the one place the client's own document contradicts itself, so both
          readings are shown rather than one being picked silently. */}
      {active.guna?.readings?.length ? (
        <div
          className={`mt-4 rounded-2xl border p-4 ${
            active.guna.is_disputed
              ? "border-amber-300 bg-amber-50"
              : "border-border bg-white"
          }`}
        >
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            {active.guna.is_disputed ? (
              <AlertTriangle className="size-3 text-amber-600" />
            ) : (
              <Sparkles className="size-3" />
            )}
            {copy.guna}
          </p>

          {active.guna.is_disputed ? (
            <>
              <p className="mt-1.5 text-xs font-bold text-amber-900">{copy.gunaDisputed}</p>
              <ul className="mt-2 space-y-1.5">
                {active.guna.readings.map((reading) => (
                  <li key={reading.source} className="text-[11px] leading-relaxed">
                    <span className="font-bold text-foreground">{reading.value}</span>
                    <span className="ml-1.5 text-muted-foreground">— {reading.source}</span>
                  </li>
                ))}
              </ul>
              {active.guna.notice && (
                <p className="mt-2 border-t border-amber-200 pt-2 text-[10px] leading-relaxed text-amber-900/90">
                  {active.guna.notice}
                </p>
              )}
            </>
          ) : (
            <p className="mt-1 text-sm font-bold text-foreground">
              {active.guna.readings[0]?.value}
            </p>
          )}
        </div>
      ) : null}

      <div className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
        <ChipList
          icon={<Sparkles className="size-3" />}
          title={copy.traits}
          items={active.trait_keywords ?? []}
        />
        <ChipList
          icon={<MapPinned className="size-3" />}
          title={copy.places}
          items={active.places ?? []}
        />
        {active.body_parts && (
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
              <Compass className="size-3" />
              {copy.bodyParts}
            </p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground">
              {active.body_parts}
            </p>
          </div>
        )}
      </div>

      {kpReference?.basic_rules?.length ? (
        <div className="mt-4 rounded-2xl border border-border bg-white p-4 sm:p-5">
          <p className="text-sm font-extrabold text-foreground">{copy.kpHeading}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{copy.kpSub}</p>
          <ol className="mt-3 space-y-2">
            {kpReference.basic_rules.map((rule, index) => (
              <li key={index} className="flex gap-2.5 text-xs leading-relaxed">
                <span className="mt-px flex size-5 shrink-0 items-center justify-center rounded-lg bg-brand-300 text-[10px] font-extrabold text-brand-950">
                  {index + 1}
                </span>
                <span className="text-foreground">{rule}</span>
              </li>
            ))}
          </ol>
          {kpReference.source && (
            <p className="mt-3 flex items-center gap-1 border-t border-border/70 pt-2 text-[10px] font-medium text-muted-foreground/80">
              <FileText className="size-2.5" /> {kpReference.source}
            </p>
          )}
        </div>
      ) : null}

      {active.sources?.length ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-muted-foreground/80">
          <FileText className="size-2.5" />
          <span className="font-bold uppercase tracking-wide">{copy.sources}:</span>
          {active.sources.join(" · ")}
        </p>
      ) : null}
    </section>
  );
}
