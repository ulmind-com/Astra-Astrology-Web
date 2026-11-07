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
  Clock,
  CheckCircle2,
  Calendar,
  Palette,
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

  const dominantElemLocalized =
    ELEMENTS_LOCALIZED[language]?.[reading.dominant_element] ||
    reading.dominant_element;

  return (
    <div className="space-y-8">
      {/* High-Precision Prediction Cards: Timeframe & Divine Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Predicted Manifestation Window */}
        <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                {t.predictedTimeframeLabel}
              </span>
            </div>
            <p className="text-base sm:text-lg font-display font-bold text-slate-900 leading-snug">
              {reading.predicted_timeframe || (language === "bn" ? "আসন্ন ৩-৬ মাসের মধ্যে" : "Within 3-6 months")}
            </p>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            {language === "bn"
              ? "তত্ত্বগত গতিপ্রবাহ ও মহাজাগতিক গোচর অনুসারে নিরূপিত"
              : language === "hi"
              ? "तत्व गति व ग्रह गोचर अनुसार निर्धारित"
              : "Calculated via chrono-elemental transit harmonics"}
          </p>
        </div>

        {/* Divine Oracle Likelihood */}
        <div className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                {t.divineVerdictLabel}
              </span>
            </div>
            <p className="text-base sm:text-lg font-display font-bold text-emerald-950 leading-snug">
              {reading.divine_verdict || (language === "bn" ? "অত্যন্ত অনুকূল ও শুভ সংকেত" : "Strongly Favorable")}
            </p>
          </div>
          {reading.favorable_score && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${reading.favorable_score}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-800">
                {reading.favorable_score}%
              </span>
            </div>
          )}
        </div>

        {/* Auspicious Day & Color */}
        <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/50 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                {t.auspiciousGuideLabel}
              </span>
            </div>
            <p className="text-sm sm:text-base font-display font-bold text-slate-900 leading-snug">
              {language === "bn" ? "প্রশস্ত দিন:" : language === "hi" ? "शुभ दिन:" : "Auspicious Day:"}{" "}
              <span className="text-indigo-900">{reading.auspicious_day || "বৃহস্পতিবার"}</span>
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {language === "bn" ? "অনুকূল বর্ণ:" : language === "hi" ? "शुभ रंग:" : "Lucky Color:"}{" "}
              <span className="text-amber-800">{reading.auspicious_color || "সোনালী হলুদ"}</span>
            </p>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            {language === "bn"
              ? "সংশ্লিষ্ট শুভ দিনে গুরুত্বপূর্ণ পদক্ষেপ নিন"
              : language === "hi"
              ? "उक्त शुभ दिन महत्वपूर्ण कार्य आरंभ करें"
              : "Align major actions with this planetary day"}
          </p>
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
                    {cardDetail.numerology && (
                      <span className="text-xs font-semibold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                        Num: {cardDetail.numerology}
                      </span>
                    )}
                    {cardDetail.yes_no && (
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          cardDetail.yes_no.toUpperCase().includes("NO")
                            ? "bg-rose-50 text-rose-900 border-rose-200"
                            : cardDetail.yes_no.toUpperCase().includes("MAYBE")
                            ? "bg-amber-50 text-amber-900 border-amber-200"
                            : "bg-emerald-50 text-emerald-900 border-emerald-200"
                        }`}
                      >
                        {cardDetail.yes_no}
                      </span>
                    )}
                  </div>

                  {cardDetail.one_liner && (
                    <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs font-medium text-amber-950 italic">
                      &ldquo;{cardDetail.one_liner}&rdquo;
                    </div>
                  )}

                  <p className="text-sm text-slate-700 leading-relaxed mb-3.5">
                    {cardDetail.relevant_interpretation}
                  </p>

                  {/* Timing & Solar Ingress Window */}
                  {(cardDetail.timing_speed || cardDetail.timing_window) && (
                    <div className="flex items-center gap-2 flex-wrap mb-3 text-xs">
                      {cardDetail.timing_speed && (
                        <span className="font-semibold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          <span>{cardDetail.timing_speed}</span>
                          {cardDetail.timing_season && <span>• {cardDetail.timing_season}</span>}
                        </span>
                      )}
                      {cardDetail.timing_window && (
                        <span className="font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                          Solar Ingress: {cardDetail.timing_window}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Sacred Esoteric Symbols */}
                  {cardDetail.symbols && cardDetail.symbols.length > 0 && (
                    <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <strong className="text-slate-900 block mb-1">
                        {language === "bn" ? "প্রতীক ও গুহ্য তাৎপর্য:" : language === "hi" ? "गूढ़ प्रतीक एवं रहस्य:" : "Sacred Symbolism:"}
                      </strong>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {cardDetail.symbols.map((sym, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700"
                          >
                            • {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Real-World Career Archetypes */}
                  {cardDetail.professions && cardDetail.professions.length > 0 && (
                    <div className="mb-3 p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs">
                      <strong className="text-emerald-950 block mb-1">
                        {language === "bn" ? "উপযুক্ত জীবিকা ও পেশা:" : language === "hi" ? "अनुकूल आजीविका व करियर:" : "Career & Profession Alignment:"}
                      </strong>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {cardDetail.professions.map((prof, pIdx) => (
                          <span
                            key={pIdx}
                            className="bg-white/80 border border-emerald-200 px-2 py-0.5 rounded text-[11px] text-emerald-900 font-medium"
                          >
                            {prof}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

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
