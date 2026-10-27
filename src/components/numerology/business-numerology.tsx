"use client";

import * as React from "react";
import { Building2, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, Briefcase, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import type { BusinessNumerologyResponse } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";

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
      toast.error(language === "bn" ? "অনুগ্রহ করে কোম্পানির নাম প্রদান করুন" : "Please enter company/brand name");
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
        toast.success(
          language === "bn"
            ? "ব্যবসা ও ব্র্যান্ড নিউমারোলজি মূল্যায়ন সম্পন্ন হয়েছে!"
            : "Business Numerology evaluated successfully!"
        );
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
              {language === "bn"
                ? "ব্যবসা, ব্র্যান্ড ও কোম্পানি নাম মূল্যায়ন (Business & Brand Numerology)"
                : "Business, Brand & Company Name Numerology"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {language === "bn"
                ? "ক্যালডিয়ান রয়্যাল কম্পাউন্ড, শিল্পের সাথে সামঞ্জস্য এবং প্রতিষ্ঠাতার জন্মশক্তির সাথে মিত্রতা অডিট"
                : "Evaluate brand name vibrations, industry suitability, and founder karmic alignment."}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border/60">
            <span className="text-muted-foreground">প্রতিষ্ঠাতার মূলাঙ্ক:</span>
            <span className="font-bold text-brand-600">{mNum}</span>
            <span className="text-muted-foreground ml-2">ভাগ্যাঙ্ক:</span>
            <span className="font-bold text-brand-600">{bNum}</span>
          </div>
        </div>

        <form onSubmit={handleAudit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="sm:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {language === "bn" ? "কোম্পানি বা ব্র্যান্ডের নাম" : "Company or Brand Name"}
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
              {language === "bn" ? "শিল্প খাত (Industry Sector)" : "Industry Sector"}
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border/80 bg-surface-muted/30 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              <option value="technology">প্রযুক্তি ও সফটওয়্যার (Technology / AI / SaaS)</option>
              <option value="finance">ব্যাংকিং, ফিনান্স ও ট্রেডিং (Finance / Wealth)</option>
              <option value="luxury_fashion">লাক্সারি, ফ্যাশন ও মিডিয়া (Luxury / Fashion / Media)</option>
              <option value="real_estate">রিয়েল এস্টেট ও নির্মাণ (Real Estate / Construction)</option>
              <option value="health">চিকিৎসা ও ফার্মাসিউটিক্যাল (Healthcare / Pharma)</option>
              <option value="food">খাদ্যদ্রব্য ও রেস্তোরাঁ (Food / Restaurant / FMCG)</option>
              <option value="education">শিক্ষা, একাডেমি ও আইন (Education / Legal)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
            >
              <Sparkles className="size-4 mr-1.5" />
              {loading
                ? language === "bn" ? "মূল্যায়ন হচ্ছে..." : "Evaluating..."
                : language === "bn" ? "ব্র্যান্ড অডিট করুন" : "Audit Brand"}
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
                ক্যালডিয়ান কম্পাউন্ড
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-black text-brand-600 dark:text-brand-400">
                  {result.chaldean_compound}
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  (একক মূল: {result.single_digit})
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.compound_meaning}
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                  শিল্প খাতের উপযোগিতা
                </span>
                <span className="text-xs font-bold font-mono text-emerald-600">
                  {result.industry_fit_score}/১০০
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
                  প্রতিষ্ঠাতার জন্ম সামঞ্জস্য
                </span>
                <span className="text-xs font-bold font-mono text-brand-600">
                  {result.owner_harmony_score}/১০০
                </span>
              </div>
              <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${result.owner_harmony_score}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                প্রতিষ্ঠাতার মূলাঙ্ক {mNum} এবং ভাগ্যাঙ্ক {bNum}-এর সাথে ১৮ অক্টোবরের ফ্রেন্ডশিপ ম্যাট্রিক্স দ্বারা যাচাইকৃত।
              </p>
            </div>
          </div>

          {/* Recommended Business Numbers & Recommendations */}
          <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-brand-600" />
                {language === "bn"
                  ? "এই শিল্পের জন্য সর্বাধিক শুভ রয়্যাল কম্পাউন্ড সংখ্যা"
                  : "Favorable Business Compound Numbers for this Sector"}
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
                বাস্তবায়নযোগ্য ব্যবসায়িক পরামর্শ (Actionable Recommendations)
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
