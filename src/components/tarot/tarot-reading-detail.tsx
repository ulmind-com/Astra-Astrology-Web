"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Sun,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Shield,
  Star,
  Compass,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import type { TarotDrawResponse, DrawnCardDetail } from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { TAROT_I18N } from "@/lib/tarot-translations";

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
  Air: "bg-sky-400",
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
    toast.success("Vedic mantra copied to clipboard!");
    setTimeout(() => setCopiedMantra(false), 2000);
  };

  const handleCopySummary = () => {
    const text = `
=== Astra Astrology Tarot Reading ===
Spread: ${reading.spread_name} (${reading.category.toUpperCase()})
Question: ${reading.question || "Universal Reflection"}

Cards Drawn:
${reading.drawn_cards.map((c) => `- ${c.position_title}: ${c.card.name} (${c.orientation})`).join("\n")}

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

  return (
    <div className="space-y-8 mt-10">
      {/* Top Banner: Spread Name & Question */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-purple-950/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-semibold tracking-wider text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-0.5 rounded-full">
                {reading.spread_name}
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-wide">
                • {reading.category}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              {reading.question || t.readingTitle}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              {t.readingSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="border-amber-500/40 hover:bg-amber-500/10 text-amber-200"
            >
              {copiedSummary ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1" />}
              {t.copySummaryBtn}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="border-zinc-700 hover:bg-zinc-800 text-zinc-300"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t.newReadingBtn}
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: Karmic Synthesis + Actionable Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Karmic Destiny Synthesis */}
        <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/80 p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-amber-200">
                {t.karmicSynthesisTitle}
              </h3>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              {reading.karmic_synthesis}
            </p>
          </div>

          {/* Active Grahas Pill List */}
          {reading.astrological_resonance.active_grahas.length > 0 && (
            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-zinc-400 font-medium">Active Planetary Energies:</span>
              {reading.astrological_resonance.active_grahas.map((graha) => (
                <span
                  key={graha}
                  className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full"
                >
                  {graha}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actionable Guidance & Strategy */}
        <div className="rounded-2xl border border-amber-500/30 bg-zinc-950/80 p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center">
                <Compass className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-lg font-serif font-bold text-emerald-200">
                {t.actionableGuidanceTitle}
              </h3>
            </div>
            <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
              {reading.actionable_guidance}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800">
            <span className="text-xs text-zinc-400 font-medium">{t.karmicMomentumLabel}:</span>
            <p className="text-xs text-amber-300 font-medium mt-1">
              {reading.astrological_resonance.karmic_momentum}
            </p>
          </div>
        </div>
      </div>

      {/* Elemental Dignity & Planetary Balance Meters */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/30 flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-100">
              {t.elementalBreakdownTitle}
            </h3>
          </div>
          <div className="text-xs text-amber-300 bg-amber-950/50 border border-amber-500/30 px-3 py-1 rounded-full self-start">
            {t.dominantElementLabel}: <strong className="text-amber-200">{reading.dominant_element}</strong>
          </div>
        </div>

        {/* Elemental Progress Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {Object.entries(reading.elemental_breakdown).map(([elem, count]) => {
            const pct = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;
            return (
              <div key={elem} className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/60 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-zinc-300 font-medium">{elem}</span>
                  <span className="text-amber-400 font-bold">{count} ({pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ELEMENT_BAR_COLORS[elem] || "bg-amber-400"
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
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 to-zinc-950 p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif font-bold text-amber-200">
              {t.prescribedRemedyTitle}
            </h3>
          </div>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {reading.prescribed_remedy}
          </p>
        </div>

        {/* Sacred Vedic Graha Mantra */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-purple-950/30 to-zinc-950 p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-400/30 flex items-center justify-center">
                  <Star className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-purple-200">
                  {t.vedicMantraTitle}
                </h3>
              </div>
              <button
                onClick={handleCopyMantra}
                className="text-xs text-amber-300 hover:text-amber-100 p-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 flex items-center gap-1 transition-colors"
                title="Copy Mantra"
              >
                {copiedMantra ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMantra ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="text-base sm:text-lg font-serif font-medium text-amber-200/95 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-purple-500/20">
              {reading.vedic_mantra}
            </p>
          </div>
          <p className="text-xs text-zinc-400 mt-3">
            Chant 108 times at sunrise or dusk to harmonize planetary vibrations and dissipate negative karmic residues.
          </p>
        </div>
      </div>

      {/* Detailed Card Breakdowns */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-lg">
        <h3 className="text-xl font-serif font-bold text-amber-100 mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Card-by-Card Arcana Interpretation</span>
        </h3>

        <div className="space-y-6">
          {reading.drawn_cards.map((cardDetail, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-zinc-800 hover:border-amber-500/40 bg-zinc-900/60 transition-all flex flex-col md:flex-row gap-5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <span className="text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    Position {cardDetail.position_index}: {cardDetail.position_title}
                  </span>
                  <span className="text-base font-serif font-bold text-zinc-100">
                    {cardDetail.card.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      cardDetail.orientation === "reversed"
                        ? "border-rose-500/40 bg-rose-950/50 text-rose-300"
                        : "border-emerald-500/40 bg-emerald-950/50 text-emerald-300"
                    }`}
                  >
                    {cardDetail.orientation === "reversed" ? t.reversedBadge : t.uprightBadge}
                  </span>
                  <span className="text-xs text-zinc-400">
                    ({cardDetail.card.astrology} • Graha: {cardDetail.card.vedic_graha})
                  </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-3">
                  {cardDetail.relevant_interpretation}
                </p>

                <div className="text-xs text-amber-200/90 bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-lg mb-3">
                  <strong>Advice:</strong> {cardDetail.advice}
                </div>

                {cardDetail.elemental_harmony && (
                  <p className="text-xs text-zinc-400 italic">
                    {cardDetail.elemental_harmony}
                  </p>
                )}

                {/* Keywords */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {cardDetail.keywords.map((kw, kIdx) => (
                    <span
                      key={kIdx}
                      className="text-[11px] text-zinc-400 bg-zinc-800/80 border border-zinc-700 px-2 py-0.5 rounded"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Astrologer Consultation CTA */}
      <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-zinc-950 to-indigo-950/60 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Grandmaster Tarot Consultation</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-amber-100">
            {t.bookAstrologerCta}
          </h3>
          <p className="text-sm text-zinc-300 mt-2">
            {t.bookAstrologerDesc}
          </p>
        </div>

        <Link href="/astrologers?skill=tarot">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-8 shadow-[0_0_25px_rgba(245,158,11,0.4)]"
          >
            <span>{t.consultNowBtn}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

