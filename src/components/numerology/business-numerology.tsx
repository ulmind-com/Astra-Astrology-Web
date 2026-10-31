"use client";

import * as React from "react";
import { Building2, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, Briefcase, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import type { BusinessNumerologyResponse } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";
import { BUSINESS_NUMEROLOGY_I18N } from "@/lib/numerology-translations";

interface BusinessNumerologyProps {
  ownerMulank?: number;
  ownerBhagyank?: number;
  language?: AstrologyLanguage;
}

export function BusinessNumerologySection({
  ownerMulank = 1,
  ownerBhagyank = 1,
  language = "bn",
}: BusinessNumerologyProps) {
  const t = BUSINESS_NUMEROLOGY_I18N[language] || BUSINESS_NUMEROLOGY_I18N.en;
  const [brandName, setBrandName] = React.useState("Astra Technologies");
  const [industry, setIndustry] = React.useState("technology");
  const [mNum, setMNum] = React.useState(ownerMulank);
  const [bNum, setBNum] = React.useState(ownerBhagyank);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<BusinessNumerologyResponse | null>(null);

  React.useEffect(() => {
    if (ownerMulank) setMNum(ownerMulank);
    if (ownerBhagyank) setBNum(ownerBhagyank);
  }, [ownerMulank, ownerBhagyank]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      toast.error(t.emptyBrandError);
      return;
    }
    setLoading(true);
    try {
      const res = await numerologyApi.evaluateBusiness({
        brand_name: brandName.trim(),
        industry,
        owner_mulank: mNum,
        owner_bhagyank: bNum,
      });
      if (res) {
        setResult(res);
        toast.success(t.successToast);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to evaluate business numerology.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-5 text-brand-600 dark:text-brand-400" />
              {t.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border/60">
            <span className="text-muted-foreground">{t.founderMulank}</span>
            <span className="font-bold text-brand-600">{mNum}</span>
            <span className="text-muted-foreground ml-2">{t.founderBhagyank}</span>
            <span className="font-bold text-brand-600">{bNum}</span>
          </div>
        </div>

        <form onSubmit={handleAudit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t.brandNameLabel}
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Astra Technologies"
              className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-surface-muted/30 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {t.industryLabel}
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border/80 bg-surface-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="technology">{t.sectorTech}</option>
              <option value="finance">{t.sectorFinance}</option>
              <option value="luxury_fashion">{t.sectorLuxury}</option>
              <option value="real_estate">{t.sectorRealEstate}</option>
              <option value="health">{t.sectorHealth}</option>
              <option value="food">{t.sectorFood}</option>
              <option value="education">{t.sectorEducation}</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
            >
              <Sparkles className="size-4 mr-1.5" />
              {loading ? t.evaluating : t.auditBtn}
            </Button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Score Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-xs space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                {t.chaldeanCompound}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-black text-brand-600 dark:text-brand-400">
                  {result.chaldean_compound}
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {t.rootSingle(result.single_digit)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.compound_meaning}
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {t.industryFit}
                </span>
                <span className="text-xs font-bold font-mono text-emerald-600">
                  {result.industry_fit_score}/100
                </span>
              </div>
              <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${result.industry_fit_score}%` }}
                />
              </div>
              <p className="text-xs text-foreground font-medium pt-1">
                {result.industry_suitability}
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  {t.founderHarmony}
                </span>
                <span className="text-xs font-bold font-mono text-brand-600">
                  {result.owner_harmony_score}/100
                </span>
              </div>
              <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${result.owner_harmony_score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                {t.founderVerifyText(mNum, bNum)}
              </p>
            </div>
          </div>

          {/* Recommended Business Numbers & Recommendations */}
          <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-brand-600" />
                {t.favorableNumbersTitle}
              </h4>
              <div className="flex gap-1.5">
                {result.favorable_business_numbers.map((n) => (
                  <span
                    key={n}
                    className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/30 text-brand-950 dark:text-brand-300 font-mono font-bold text-xs"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="size-4 text-amber-500" />
                {t.recommendationsTitle}
              </span>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.actionable_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
