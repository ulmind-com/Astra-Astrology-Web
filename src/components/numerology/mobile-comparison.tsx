"use client";

import * as React from "react";
import { Phone, Plus, Trash2, Trophy, ShieldAlert, CheckCircle2, Sparkles, Briefcase, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import type { MobileCompareResponse, MobileComparisonItem } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";
import { MOBILE_COMPARE_I18N } from "@/lib/numerology-translations";

interface MobileComparisonProps {
  mulank?: number;
  bhagyank?: number;
  birthDate?: string;
  language?: AstrologyLanguage;
}

export function MobileComparisonSection({
  mulank = 1,
  bhagyank = 1,
  birthDate = "",
  language = "bn",
}: MobileComparisonProps) {
  const t = MOBILE_COMPARE_I18N[language] || MOBILE_COMPARE_I18N.en;
  const [numbers, setNumbers] = React.useState<string[]>(["9876543210", "9830124567"]);
  const [profession, setProfession] = React.useState<string>("business");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<MobileCompareResponse | null>(null);

  const handleAddNumber = () => {
    if (numbers.length >= 6) {
      toast.error(t.maxLimit);
      return;
    }
    setNumbers([...numbers, ""]);
  };

  const handleRemoveNumber = (index: number) => {
    if (numbers.length <= 2) {
      toast.error(t.minLimit);
      return;
    }
    setNumbers(numbers.filter((_, i) => i !== index));
  };

  const handleNumberChange = (index: number, val: string) => {
    const next = [...numbers];
    next[index] = val;
    setNumbers(next);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanList = numbers.map((n) => n.trim()).filter((n) => n.length >= 10);
    if (cleanList.length < 2) {
      toast.error(t.validMobileError);
      return;
    }

    setLoading(true);
    try {
      const res = await numerologyApi.compareMobile({
        numbers: cleanList,
        mulank,
        bhagyank,
        profession,
        birth_date: birthDate || undefined,
      });
      if (res) {
        setResult(res);
        toast.success(t.successToast);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to compare mobile numbers.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comparison Form Card */}
      <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Phone className="size-5 text-brand-600 dark:text-brand-400" />
              {t.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border/60">
            <span className="text-muted-foreground">{t.kingNumber}</span>
            <span className="font-bold text-brand-600">{mulank}</span>
            <span className="text-muted-foreground ml-2">{t.bhagyank}</span>
            <span className="font-bold text-brand-600">{bhagyank}</span>
          </div>
        </div>

        <form onSubmit={handleCompare} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {numbers.map((num, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <input
                    type="tel"
                    value={num}
                    onChange={(e) => handleNumberChange(i, e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={15}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-border/80 bg-surface-muted/30 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </div>
                {numbers.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveNumber(i)}
                    className="p-2.5 rounded-xl border border-border/60 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-400/40 text-muted-foreground transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {numbers.length < 6 && (
                <button
                  type="button"
                  onClick={handleAddNumber}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline px-2 py-1"
                >
                  <Plus className="size-4" />
                  {t.addAnother}
                </button>
              )}

              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-muted-foreground" />
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-border/80 bg-surface-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="business">{t.sectorBusiness}</option>
                  <option value="it">{t.sectorIt}</option>
                  <option value="medicine">{t.sectorMedicine}</option>
                  <option value="luxury">{t.sectorLuxury}</option>
                  <option value="real_estate">{t.sectorRealEstate}</option>
                  <option value="education">{t.sectorEducation}</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 px-6 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
            >
              <Zap className="size-4 mr-1.5" />
              {loading ? t.comparing : t.compareBtn}
            </Button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Winner SIM Showcase */}
          <div className="rounded-2xl border-2 border-brand-500 bg-linear-to-r from-brand-500/10 via-surface to-brand-500/5 p-5 sm:p-6 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-brand-500 text-ink-950 flex items-center justify-center font-bold shadow-xs">
                  <Trophy className="size-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                    {t.winnerTitle}
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-black text-foreground">
                    {result.best_number}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs font-bold">
                  {result.items[0]?.grade}
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-950 dark:text-brand-200 text-xs font-mono font-bold">
                  {t.scoreLabel(result.items[0]?.compatibility_score || 0)}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground border-t border-border/60 pt-3">
              {result.recommendations_bn[0]}
            </div>
          </div>

          {/* Cards Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.items.map((item, idx) => {
              const isBest = item.mobile_number === result.best_number;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border p-5 space-y-3.5 transition-all shadow-xs ${
                    isBest
                      ? "border-brand-500 bg-surface ring-2 ring-brand-500/20"
                      : "border-border/80 bg-surface hover:border-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-foreground">
                          {item.mobile_number}
                        </span>
                        {isBest && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-ink-950">
                            Best
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        {item.compound_quality}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-serif font-black text-brand-600">
                        {item.single_digit}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {t.totalSum} {item.compound_number}
                      </span>
                    </div>
                  </div>

                  {/* Score Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{t.compatibilityScore}</span>
                      <span className="text-brand-600">{item.compatibility_score}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.compatibility_score >= 75
                            ? "bg-emerald-500"
                            : item.compatibility_score >= 50
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${item.compatibility_score}%` }}
                      />
                    </div>
                  </div>

                  {/* Pair Breakdown */}
                  <div className="space-y-1.5 text-xs border-t border-border/60 pt-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> {t.positivePairs(item.positive_pairs.length)}
                      </span>
                      <span className="font-mono font-bold text-emerald-600">
                        {item.positive_pairs.slice(0, 4).join(", ") || t.noneText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-rose-700 dark:text-rose-300 font-semibold flex items-center gap-1">
                        <ShieldAlert className="size-3" /> {t.negativePairs(item.negative_pairs.length)}
                      </span>
                      <span className="font-mono font-bold text-rose-600">
                        {item.negative_pairs.slice(0, 4).join(", ") || t.noneText}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/50 pt-2">
                    {item.verdict_bn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Client Document Guidance */}
          <div className="p-4 sm:p-5 rounded-2xl bg-surface-muted/60 border border-border/80 text-xs space-y-2">
            <h5 className="font-bold text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-brand-600" />
              {t.guidanceTitle}
            </h5>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {result.recommendations_bn.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
