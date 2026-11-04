"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Shield,
  Star,
  Compass,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import type { TarotDrawResponse, DrawnCardDetail } from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { TAROT_I18N, CARD_NAMES_LOCALIZED, ELEMENTS_LOCALIZED } from "@/lib/tarot-translations";

interface TarotReadingDetailProps {
  reading: TarotDrawResponse;
  language: AstrologyLanguage;
  onReset: () => void;
  selectedCardModal?: DrawnCardDetail | null;
  onSelectCardModal?: (card: DrawnCardDetail | null) => void;
}

const ELEMENT_BAR_COLORS: Record<string, string> = {
  Fire: "bg-amber-500",
  Water: "bg-cyan-500",
  Air: "bg-sky-500",
  Earth: "bg-emerald-500",
  Spirit: "bg-purple-500",
};

export function TarotReadingDetail({
  reading,
  language,
  onReset,
}: TarotReadingDetailProps) {
  const t = TAROT_I18N[language] || TAROT_I18N.en;
  const [copiedMantra, setCopiedMantra] = React.useState(false);
  const [copiedSummary, setCopiedSummary] = React.useState(false);

  const totalCards = reading.drawn_cards.length;

  const handleCopyMantra = () => {
    navigator.clipboard.writeText(reading.vedic_mantra);
    setCopiedMantra(true);
    toast.success(
      language === "bn"
        ? "বৈদিক মন্ত্র ক্লিপবোর্ডে কপি করা হয়েছে!"
        : language === "hi"
        ? "वैदिक मंत्र क्लिपबोर्ड पर कॉपी हो गया!"
        : "Vedic mantra copied to clipboard!"
    );
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  const handleCopySummary = () => {
    const text = `
=== Astra Astrology Tarot Reading ===
Spread: ${reading.spread_name} (${reading.category.toUpperCase()})
Question: ${reading.question || "Universal Reflection"}

Cards Drawn:
${reading.drawn_cards
  .map(
    (c) =>
      `- ${c.position_title}: ${
        CARD_NAMES_LOCALIZED[language]?.[c.card.id] || c.card.name
      } (${c.orientation})`
  )
  .join("\n")}

Dominant Element: ${reading.dominant_element}
Karmic Momentum: ${reading.astrological_resonance.karmic_momentum}

Karmic Synthesis:
${reading.karmic_synthesis}

Actionable Guidance:
${reading.actionable_guidance}

Prescribed Remedy:
${reading.prescribed_remedy}

Vedic Mantra:
${reading.vedic_mantra}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    toast.success(t.copiedToast);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const dominantElemLocalized =
    ELEMENTS_LOCALIZED[language]?.[reading.dominant_element] ||
    reading.dominant_element;

  return (
    <div className="space-y-8 mt-10">
      {/* Top Banner: Spread Name & Question */}
      <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full shadow-2xs">
                {reading.spread_name}
              </span>
              <span className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
                • {reading.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
              {reading.question || t.readingTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {t.readingSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-50 shadow-2xs transition-colors"
            >
              {copiedSummary ? (
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              )}
              {t.copySummaryBtn}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              {t.newReadingBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Karmic Synthesis + Actionable Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karmic Destiny Synthesis */}
        <div className="rounded-2xl border border-amber-300/80 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="text-lg font-display font-bold text-slate-900">
                {t.karmicSynthesisTitle}
              </h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {reading.karmic_synthesis}
            </p>
          </div>

          {/* Active Grahas Pill List */}
          {reading.astrological_resonance.active_grahas.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-semibold">
                {language === "bn"
                  ? "সক্রিয় গ্রহের প্রভাব:"
                  : language === "hi"
                  ? "सक्रिय ग्रह प्रभाव:"
                  : "Active Planetary Energies:"}
              </span>
              {reading.astrological_resonance.active_grahas.map((graha) => (
                <span
                  key={graha}
                  className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full"
                >
                  {graha}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Guidance & Strategy */}
        <div className="rounded-2xl border border-emerald-300/80 bg-white p-6 sm:p-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 flex items-center justify-center">
                <Compass className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="text-lg font-display font-bold text-emerald-950">
                {t.actionableGuidanceTitle}
              </h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {reading.actionable_guidance}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-semibold">
              {t.karmicMomentumLabel}:
            </span>
            <p className="text-xs text-amber-900 font-bold mt-1">
              {reading.astrological_resonance.karmic_momentum}
            </p>
          </div>
        </div>
      </div>

      {/* Elemental Dignity & Planetary Balance Meters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900">
              {t.elementalBreakdownTitle}
            </h3>
          </div>
          <div className="text-xs text-amber-950 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full font-bold self-start">
            {t.dominantElementLabel}:{" "}
            <strong className="text-amber-800">{dominantElemLocalized}</strong>
          </div>
        </div>

        {/* Elemental Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {Object.entries(reading.elemental_breakdown).map(([elem, count]) => {
            const pct =
              totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;
            const elemName =
              ELEMENTS_LOCALIZED[language]?.[elem] || elem;
            return (
              <div
                key={elem}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-700 font-semibold">{elemName}</span>
                  <span className="text-slate-900 font-bold">
                    {count} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ELEMENT_BAR_COLORS[elem] || "bg-amber-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vedic Remedy & Sacred Mantra */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prescribed Remedy */}
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-300 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-lg font-display font-bold text-amber-950">
              {t.prescribedRemedyTitle}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
            {reading.prescribed_remedy}
          </p>
        </div>

        {/* Sacred Vedic Graha Mantra */}
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/40 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-300 flex items-center justify-center">
                  <Star className="w-4 h-4 text-indigo-700" />
                </div>
                <h3 className="text-lg font-display font-bold text-indigo-950">
                  {t.vedicMantraTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyMantra}
                className="text-xs text-indigo-900 hover:text-indigo-950 font-bold px-2.5 py-1 rounded-lg border border-indigo-200 bg-white flex items-center gap-1 shadow-2xs transition-colors"
              >
                {copiedMantra ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                )}
                <span>{copiedMantra ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-base sm:text-lg font-serif font-semibold text-indigo-950 leading-relaxed bg-white/90 p-4 rounded-xl border border-indigo-200 shadow-2xs">
              {reading.vedic_mantra}
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3.5 font-medium">
            {language === "bn"
              ? "সূর্যোদয় বা গোধূলিলগ্নে শান্ত মনে ১০৮ বার জপ করলে গ্রহগত শান্তি ও শুভ ফল লাভ হয়।"
              : language === "hi"
              ? "सूर्योदय अथवा संध्याकाल में 108 बार जप करने से ग्रह शांति और कल्याण प्राप्त होता है।"
              : "Chant 108 times at sunrise or dusk to harmonize planetary vibrations."}
          </p>
        </div>
      </div>

      {/* Detailed Card Breakdowns */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-display font-bold text-slate-900 mb-6 flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <span>
            {language === "bn"
              ? "কার্ডভিত্তিক আর্খানা বিশ্লেষণ"
              : language === "hi"
              ? "कार्ड अनुसार विस्तृत विश्लेषण"
              : "Card-by-Card Arcana Interpretation"}
          </span>
        </h3>

        <div className="space-y-5">
          {reading.drawn_cards.map((cardDetail, idx) => {
            const locName =
              CARD_NAMES_LOCALIZED[language]?.[cardDetail.card.id] ||
              cardDetail.card.name;
            const orientBadge =
              cardDetail.orientation === "reversed"
                ? t.reversedBadge
                : t.uprightBadge;

            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-amber-300 bg-slate-50/50 transition-all flex flex-col md:flex-row gap-5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full shadow-2xs">
                      {cardDetail.position_title}
                    </span>
                    <span className="text-base font-display font-bold text-slate-900">
                      {locName}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${
                        cardDetail.orientation === "reversed"
                          ? "border-rose-200 bg-rose-50 text-rose-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {orientBadge}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      ({cardDetail.card.astrology} • Graha:{" "}
                      {cardDetail.card.vedic_graha})
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed mb-3.5">
                    {cardDetail.relevant_interpretation}
                  </p>

                  <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200 p-3 rounded-xl mb-3 font-medium">
                    <strong className="text-amber-900">
                      {language === "bn"
                        ? "পরামর্শ:"
                        : language === "hi"
                        ? "मार्गदर्शन:"
                        : "Advice:"}
                    </strong>{" "}
                    {cardDetail.advice}
                  </div>

                  {cardDetail.elemental_harmony && (
                    <p className="text-xs text-slate-500 italic">
                      {cardDetail.elemental_harmony}
                    </p>
                  )}

                  {/* Keywords */}
                  <div className="mt-3.5 flex items-center gap-1.5 flex-wrap">
                    {cardDetail.keywords.map((kw, kIdx) => (
                      <span
                        key={kIdx}
                        className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md shadow-2xs"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Astrologer Consultation CTA */}
      <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-100/70 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full mb-2.5">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>
              {language === "bn"
                ? "ট্যারো গ্র্যান্ডমাস্টার পরামর্শ"
                : language === "hi"
                ? "टैरो ग्रैंडमास्टर परामर्श"
                : "Grandmaster Tarot Consultation"}
            </span>
          </div>
          <h3 className="text-2xl font-display font-bold text-slate-950">
            {t.bookAstrologerCta}
          </h3>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {t.bookAstrologerDesc}
          </p>
        </div>

        <Link href="/astrologers?skill=tarot">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 shadow-md rounded-xl"
          >
            <span>{t.consultNowBtn}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
