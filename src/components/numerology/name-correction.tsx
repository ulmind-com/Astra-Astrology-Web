"use client";

import * as React from "react";
import { Sparkles, Wand2, ShieldAlert, CheckCircle2, ArrowRight, BookOpen, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import type { NameCorrectionResponse, NameCorrectionSuggestion } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";
import { NAME_CORRECTION_I18N } from "@/lib/numerology-translations";

interface NameCorrectionProps {
  initialName?: string;
  mulank?: number;
  bhagyank?: number;
  language?: AstrologyLanguage;
}

export function NameCorrectionSection({
  initialName = "Samiran Sasmal",
  mulank = 1,
  bhagyank = 1,
  language = "bn",
}: NameCorrectionProps) {
  const t = NAME_CORRECTION_I18N[language] || NAME_CORRECTION_I18N.en;
  const [name, setName] = React.useState(initialName);
  const [targetCompound, setTargetCompound] = React.useState<number | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<NameCorrectionResponse | null>(null);

  // Sync initial name if changed externally
  React.useEffect(() => {
    if (initialName) setName(initialName);
  }, [initialName]);

  const handleHarmonize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      toast.error(t.emptyNameError);
      return;
    }
    setLoading(true);
    try {
      const res = await numerologyApi.correctName({
        name: name.trim(),
        mulank,
        bhagyank,
        target_compound: targetCompound,
      });
      if (res) {
        setResult(res);
        toast.success(t.successToast);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to harmonize name spelling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Harmonization Form Card */}
      <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Wand2 className="size-5 text-brand-600 dark:text-brand-400" />
              {t.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border/60">
            <span className="text-muted-foreground">{t.mulank}</span>
            <span className="font-bold text-brand-600">{mulank}</span>
            <span className="text-muted-foreground ml-2">{t.bhagyank}</span>
            <span className="font-bold text-brand-600">{bhagyank}</span>
          </div>
        </div>

        <form onSubmit={handleHarmonize} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="sm:col-span-6 space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t.nameLabel}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Samiran Sasmal"
              className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-surface-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 font-medium"
            />
          </div>

          <div className="sm:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t.targetLabel}
            </label>
            <select
              value={targetCompound || ""}
              onChange={(e) => setTargetCompound(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full h-10 px-3 rounded-xl border border-border/80 bg-surface-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="">{t.autoBest}</option>
              <option value="19">19 - Prince of Heaven (1)</option>
              <option value="23">23 - Royal Star of Lion (5)</option>
              <option value="24">24 - Venusian Prosperity (6)</option>
              <option value="32">32 - The Magnetic Word (5)</option>
              <option value="37">37 - Sceptre of Royalty (1)</option>
              <option value="41">41 - Sovereign Magnetism (5)</option>
              <option value="42">42 - Harmonious Partner (6)</option>
              <option value="46">46 - Crown of Authority (1)</option>
              <option value="51">51 - Warrior Prince (6)</option>
              <option value="55">55 - Universal Prana (1)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
            >
              <Sparkles className="size-4 mr-1.5" />
              {loading ? t.harmonizing : t.harmonizeBtn}
            </Button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Diagnostic Banner */}
          <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {t.currentStatus}
                </span>
                <div className="text-xl sm:text-2xl font-serif font-black text-foreground mt-0.5">
                  {result.original_name}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">{t.currentCompound}</div>
                  <div className="text-lg font-bold text-foreground">
                    {result.original_compound}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      ({t.quality}: {result.original_quality})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Negative Syllable Alert */}
            {result.negative_syllables.length > 0 ? (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 text-xs">
                <ShieldAlert className="size-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-bold">
                    {language === "bn"
                      ? "সতর্কতা: ক্ষতিকর ধ্বনিখণ্ড সনাক্ত হয়েছে!"
                      : language === "hi"
                      ? "चेतावनी: हानिकारक ध्वनि खंड पाए गए!"
                      : "Warning: Malefic syllables detected!"}
                  </span>{" "}
                  {language === "bn"
                    ? "নামের মধ্যে "
                    : language === "hi"
                    ? "नाम में "
                    : "Found in name: "}
                  <span className="font-mono font-bold uppercase underline">
                    {result.negative_syllables.join(", ")}
                  </span>{" "}
                  {language === "bn"
                    ? "বিদ্যমান, যা সৌভাগ্যের গতি শ্লথ করে এবং মানসিক বিষাদ সৃষ্টি করতে পারে। নিম্নের শুভ বিকল্প বাঞ্ছনীয়।"
                    : language === "hi"
                    ? "मौजूद है, जो प्रगति को बाधित कर मानसिक तनाव दे सकता है। नीचे दिए गए शुभ विकल्प अपनाएं।"
                    : "which can obstruct progress and cause tension. Adopting an auspicious spelling below is recommended."}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>{t.alertClean}</span>
              </div>
            )}
          </div>

          {/* Suggestions Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="size-4 text-brand-600" />
                {t.alternativesTitle}
              </h4>
              <span className="text-xs text-muted-foreground">
                {t.topAlternatives(result.suggestions.length)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-brand-500/30 bg-surface p-5 shadow-xs hover:border-brand-500 transition-all space-y-3.5 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-xl font-bold font-serif text-brand-600 dark:text-brand-400">
                          {sug.suggested_spelling}
                        </span>
                        {sug.added_letters.length > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-400/30">
                            +{sug.added_letters.join(", ")}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-muted-foreground mt-0.5">
                        {sug.compound_title}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-2xl font-serif font-black text-brand-600 dark:text-brand-400">
                        {sug.new_compound}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {t.rootDigit(sug.new_single_digit)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs border-t border-border/60 pt-3">
                    <div className="flex items-start gap-1.5 text-muted-foreground">
                      <span className="font-semibold text-foreground shrink-0">{t.soundHarmony}</span>
                      <span>{sug.sound_harmony}</span>
                    </div>

                    <div className="flex items-start gap-1.5 text-muted-foreground">
                      <span className="font-semibold text-brand-700 dark:text-brand-300 shrink-0">{t.auspiciousResult}</span>
                      <span className="leading-relaxed">{sug.why_auspicious}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {sug.compound_quality}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sug.suggested_spelling);
                        toast.success(t.copiedToast(sug.suggested_spelling));
                      }}
                      className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      {t.copyBtn} <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Master 43-Day Guidance Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-950 dark:text-amber-200 text-xs leading-relaxed space-y-2">
            <div className="font-bold flex items-center gap-2 text-sm text-amber-900 dark:text-amber-100">
              <BookOpen className="size-4" />
              {t.ritualTitle}
            </div>
            <p>{result.general_guidance}</p>
          </div>
        </div>
      )}
    </div>
  );
}
