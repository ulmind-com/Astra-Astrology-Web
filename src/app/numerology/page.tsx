"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Hash,
  Compass,
  Layers,
  Award,
  BookOpen,
  Phone,
  UserCheck,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Languages,
  Clock,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  Wand2,
  Building2,
  Car,
  Landmark,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useProfile } from "@/hooks/use-profile";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import { NameCorrectionSection } from "@/components/numerology/name-correction";
import { MobileComparisonSection } from "@/components/numerology/mobile-comparison";
import { BusinessNumerologySection } from "@/components/numerology/business-numerology";
import { VehicleBankAuditSection } from "@/components/numerology/vehicle-bank-audit";
import { NUMEROLOGY_I18N } from "@/lib/numerology-translations";
import type { NumerologyCalculateResponse } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";

export default function NumerologyPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const numerologyFeature = getFeature("numerology");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  const { language, setLanguage } = useLanguage();
  const t = NUMEROLOGY_I18N[language] || NUMEROLOGY_I18N.en;
  const [fullName, setFullName] = React.useState("Samiran Sasmal");
  const [birthDate, setBirthDate] = React.useState("1995-10-25");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");
  const [mobileNumber, setMobileNumber] = React.useState("9876543210");
  const [predictionYear, setPredictionYear] = React.useState<number>(new Date().getFullYear());

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<NumerologyCalculateResponse | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    | "loshu"
    | "dasha"
    | "name"
    | "name_correct"
    | "mobile"
    | "mobile_compare"
    | "business"
    | "vehicle_bank"
    | "remedies"
    | "profile"
  >("loshu");
  const hasAutoFilled = React.useRef(false);

  // Auto-populate from user profile if signed in
  React.useEffect(() => {
    if (profile && !hasAutoFilled.current) {
      if (profile.full_name) setFullName(profile.full_name);
      if (profile.birth?.date_of_birth) setBirthDate(profile.birth.date_of_birth);
      if (profile.gender === "male" || profile.gender === "female") setGender(profile.gender);
      hasAutoFilled.current = true;
    }
  }, [profile]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !birthDate) {
      toast.error(language === "bn" ? "অনুগ্রহ করে পূর্ণ নাম ও জন্মতারিখ প্রদান করুন" : "Please provide full name and birth date");
      return;
    }

    const access = checkAccess("numerology");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(
          language === "bn"
            ? "নিউমারোলজি ফিচারটি বর্তমানে অ্যাডমিন দ্বারা বন্ধ রয়েছে।"
            : "Numerology feature is temporarily unavailable."
        );
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await numerologyApi.calculate({
        full_name: fullName.trim(),
        birth_date: birthDate,
        gender,
        mobile_number: mobileNumber.trim() ? mobileNumber.trim() : undefined,
        prediction_year: predictionYear || undefined,
      });
      if (res) {
        setData(res);
        if (numerologyFeature && numerologyFeature.coins > 0) {
          refreshWallet();
          toast.success(
            language === "bn"
              ? `${numerologyFeature.coins} কয়েন ব্যালেন্স থেকে কাটা হয়েছে`
              : `${numerologyFeature.coins} coins deducted from wallet`
          );
        }
        toast.success(
          language === "bn"
            ? "বৈদিক ও চ্যালডিয়ান নিউমারোলজি গণনা সফলভাবে সম্পন্ন হয়েছে!"
            : "Vedic Numerology calculated successfully!"
        );
      }
    } catch (err: any) {
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(err?.message || "Failed to calculate Numerology.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted/30 text-foreground flex flex-col font-sans pb-24">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-3 sm:px-4 py-8 flex-1 w-full space-y-8">
        {/* =========================================================================
            HEADER & HERO BANNER (Matching Kundli & Daily Horoscope)
        ========================================================================= */}
        <div className="mx-auto max-w-4xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-400/30 font-bold px-4 py-1.5 text-xs shadow-2xs">
            <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.badge}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {t.title}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Language Switcher Bar & Pricing Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {(["bn", "en", "hi"] as AstrologyLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  language === lang
                    ? "bg-brand-500 text-ink-950 font-bold shadow-xs"
                    : "bg-surface border border-border/80 text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang === "bn" ? "বাংলা" : lang === "hi" ? "हिन्दी" : "English"}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <FeatureCoinBadge
              feature={numerologyFeature}
              coins={numerologyFeature?.coins ?? 20}
              language={language}
            />
          </div>
        </div>

        {/* =========================================================================
            FORM CARD (Matching Astra Glassmorphic Theme)
        ========================================================================= */}
        <div className="rounded-2xl border border-border/80 bg-surface/90 shadow-sm p-4 sm:p-6 backdrop-blur-md">
          {numerologyFeature && !numerologyFeature.enabled && (
            <div className="mb-4">
              <FeatureDisabledAlert featureName={numerologyFeature?.name} language={language} />
            </div>
          )}
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder={t.fullNamePlaceholder}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {t.birthDate}
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {t.gender}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="male">{t.genderMale}</option>
                  <option value="female">{t.genderFemale}</option>
                  <option value="other">{t.genderOther}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {t.mobileNumber}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder={t.mobileNumberPlaceholder}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  size="lg"
                  className="w-full h-[40px] font-bold text-ink-950 flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:brightness-105"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-ink-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t.calculateBtn}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* =========================================================================
            RESULTS SECTION
        ========================================================================= */}
        {data && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top 4 Quick Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t.driverMulank}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-600 mt-1.5">
                  {data.mulank.number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1">{data.mulank.planet}</div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t.destinyBhagyank}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-amber-500 mt-1.5">
                  {data.bhagyank.number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1">{data.bhagyank.planet}</div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t.kuaNumber}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-sky-500 mt-1.5">
                  {data.kua_number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1">
                  {t.personalVibration}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t.personalYear}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-emerald-500 mt-1.5">
                  {data.year_prediction_number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1 truncate">
                  {data.year_prediction_summary.slice(0, 24)}...
                </div>
              </div>
            </div>

            {/* Pill Navigation Tabs (Matching Daily Horoscope Drawer Tabs) */}
            <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
              {[
                { id: "loshu", label: t.tabLoshu, icon: Layers },
                { id: "dasha", label: t.tabDasha, icon: Compass },
                { id: "name", label: t.tabName, icon: UserCheck },
                { id: "name_correct", label: t.tabNameCorrect, icon: Wand2 },
                { id: "mobile", label: t.tabMobile, icon: Phone },
                { id: "mobile_compare", label: t.tabMobileCompare, icon: Trophy },
                { id: "business", label: t.tabBusiness, icon: Building2 },
                { id: "vehicle_bank", label: t.tabVehicleBank, icon: Car },
                { id: "remedies", label: t.tabRemedies, icon: BookOpen },
                { id: "profile", label: t.tabProfile, icon: Award },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-brand-500 text-ink-950 font-bold shadow-xs"
                        : "bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Lo Shu Grid & Planes */}
            {activeTab === "loshu" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                {/* 3x3 Lo Shu Grid */}
                <div className="lg:col-span-6 rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-border/70 pb-3">
                    <h3 className="text-base font-display font-bold text-foreground flex items-center gap-2">
                      <Hash className="size-4 text-brand-600" />
                      {t.loShuGridTitle}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">{t.loShuSequence}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3 bg-surface-muted/50 rounded-2xl border border-border/70">
                    {data.lo_shu_grid.map((cell) => (
                      <div
                        key={cell.digit}
                        className={`aspect-square rounded-xl p-3 flex flex-col justify-between border transition-all ${
                          cell.count > 0
                            ? "bg-brand-500/15 border-brand-500/40 shadow-xs"
                            : "bg-surface/50 border-border/50 opacity-40"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-2xl sm:text-3xl font-serif font-black text-foreground">
                            {cell.digit}
                          </span>
                          {cell.count > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500 text-ink-950">
                              {cell.count}x
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate font-medium">
                          {cell.element} • {cell.direction}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Raj Yogas */}
                  <div className="space-y-3 pt-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="size-4 text-brand-600" />
                      {t.rajYogasTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.raj_yogas.map((yoga) => (
                        <div
                          key={yoga.name}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                            yoga.is_active
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-950 dark:text-amber-200"
                              : "bg-surface-muted/40 border-border/60 text-muted-foreground"
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span className="truncate">{yoga.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              yoga.is_active ? "bg-amber-400 text-amber-950" : "bg-surface text-muted-foreground border border-border/80"
                            }`}>
                              {yoga.is_active ? t.activeStatus : t.inactiveStatus}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed opacity-90">{yoga.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Planes Progress */}
                <div className="lg:col-span-6 rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="border-b border-border/70 pb-3">
                    <h3 className="text-base font-display font-bold text-foreground flex items-center gap-2">
                      <Layers className="size-4 text-brand-600" />
                      {t.planesTitle}
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {data.planes.map((plane) => (
                      <div key={plane.name} className="p-3 bg-surface-muted/40 rounded-xl border border-border/70 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-foreground">{plane.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            plane.status === "Complete"
                              ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                              : plane.status === "Partial"
                              ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                              : "bg-surface text-muted-foreground border border-border/80"
                          }`}>
                            {plane.status === "Complete" ? t.statusComplete : plane.status === "Partial" ? t.statusPartial : t.statusMissing} ({plane.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              plane.percentage === 100
                                ? "bg-emerald-500"
                                : plane.percentage >= 50
                                ? "bg-brand-500"
                                : "bg-muted-foreground/40"
                            }`}
                            style={{ width: `${plane.percentage}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground">{plane.significance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Dasha Timeline */}
            {activeTab === "dasha" && (
              <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-border/70 pb-3">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <Compass className="size-5 text-brand-600" />
                    {t.dashaTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.dashaSub}
                  </p>
                </div>

                <div className="space-y-3.5">
                  {data.dasha_timeline.map((period, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-border/70 bg-surface-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-brand-500/20 text-brand-800 dark:text-brand-300 font-bold text-xs rounded-md">
                            {period.level}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-foreground">
                            {period.planet} ({t.numberLabel(period.number)})
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            period.friendship_score === "Favorable"
                              ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                              : period.friendship_score === "Unfavorable"
                              ? "bg-red-500/20 text-red-800 dark:text-red-300"
                              : "bg-surface border border-border/80 text-muted-foreground"
                          }`}>
                            {period.friendship_score === "Favorable" ? t.favorable : period.friendship_score === "Unfavorable" ? t.unfavorable : t.neutral}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{period.guidance}</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-foreground">
                          {period.start_date} <span className="text-muted-foreground">➔</span> {period.end_date}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {language === "bn" ? `স্থায়িত্ব: ${period.duration_days} দিন` : language === "hi" ? `अवधि: ${period.duration_days} दिन` : `Duration: ${period.duration_days} days`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Name Analysis */}
            {activeTab === "name" && (
              <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t.nameAnalysisTitle}
                    </div>
                    <h3 className="text-2xl font-serif font-black text-foreground mt-1">
                      {data.name_analysis.full_name}
                    </h3>
                    <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mt-1">
                      {t.compoundNumber}: {data.name_analysis.compound_number} ({t.singleDigitVibration}: {data.name_analysis.single_number}) — {data.name_analysis.compound_name}
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-surface-muted/60 border border-border/80 rounded-xl text-left sm:text-right">
                    <div className="text-[11px] text-muted-foreground">{t.auditVerdict}</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {data.name_analysis.overall_name_verdict}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-muted/40 border border-border/70 text-xs sm:text-sm leading-relaxed text-foreground">
                  {data.name_analysis.compound_description}
                </div>

                {/* Syllable Alert */}
                {data.name_analysis.negative_syllables_found.length > 0 && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5">
                    <ShieldAlert className="size-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">
                        {language === "bn"
                          ? "সতর্কতা: ক্ষতিকর সিলেবল চিহ্নিত হয়েছে!"
                          : language === "hi"
                          ? "सावधानी: नकारात्मक ध्वनि खंड पहचाने गए!"
                          : "Warning: Negative Syllables Detected!"}
                      </div>
                      <p className="mt-1">
                        {language === "bn"
                          ? `নামের মধ্যে ক্ষতিকর ধ্বনি (${data.name_analysis.negative_syllables_found.join(", ")}) রয়েছে, যা ক্লায়েন্ট ডকুমেন্ট (Name Numerology/01.pdf) অনুযায়ী শুভ কম্পাউন্ডকেও ক্ষতিগ্রস্ত করে।`
                          : language === "hi"
                          ? `नाम में नकारात्मक ध्वनि (${data.name_analysis.negative_syllables_found.join(", ")}) मौजूद है, जो शास्त्र अनुसार शुभ संयुक्त अंक को भी प्रभावित करती है।`
                          : `The name contains negative syllables (${data.name_analysis.negative_syllables_found.join(", ")}) that can impair auspicious compound vibrations.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Letters Sound Vibrations */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t.letterSoundsTitle}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {data.name_analysis.letters.map((ltr, idx) => (
                      <div key={idx} className="p-3 bg-surface-muted/40 border border-border/70 rounded-xl text-center space-y-1">
                        <div className="text-xl font-serif font-black text-brand-600">{ltr.letter}</div>
                        <div className="text-xs font-semibold text-foreground">{t.valueLabel} {ltr.value}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{ltr.sound_element}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 dark:text-amber-200">
                  <span className="font-bold">{t.recommendationLabel} </span>
                  {data.name_analysis.recommendation}
                </div>
              </div>
            )}

            {/* Tab 4: Mobile Numerology */}
            {activeTab === "mobile" && data.mobile_analysis && (
              <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {t.mobileAuditTitle}
                    </div>
                    <h3 className="text-2xl font-serif font-black text-foreground mt-1">
                      {data.mobile_analysis.mobile_number}
                    </h3>
                    <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mt-1">
                      {t.mobileTotalSum} {data.mobile_analysis.total_sum} ({t.singleDigitSum} {data.mobile_analysis.single_digit}) • {data.mobile_analysis.compound_quality}
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-surface-muted/60 border border-border/80 rounded-xl text-left sm:text-right">
                    <div className="text-[11px] text-muted-foreground">{t.auditVerdict}</div>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {data.mobile_analysis.overall_verdict}
                    </div>
                  </div>
                </div>

                {/* Consecutive Conjunction Pairs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="size-4 text-brand-600" />
                      {t.conjunctionPairsTitle}
                    </h4>
                    <span className="text-[11px] text-muted-foreground">{t.conjunctionFormula}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {data.mobile_analysis.conjunction_pairs.map((p, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          p.category === "Good"
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200"
                            : p.category === "Malefic"
                            ? "bg-red-500/10 border-red-500/40 text-red-950 dark:text-red-200"
                            : "bg-surface-muted/40 border-border/70 text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-sm font-serif">{p.pair} {t.pairSuffix}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            p.category === "Good"
                              ? "bg-emerald-500 text-white"
                              : p.category === "Malefic"
                              ? "bg-red-500 text-white"
                              : "bg-surface border border-border/80 text-muted-foreground"
                          }`}>
                            {p.category}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90 leading-relaxed">{p.manifestation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sepharial L-Shapes */}
                {data.mobile_analysis.l_shapes_formed.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {t.lShapesTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.mobile_analysis.l_shapes_formed.map((l, idx) => (
                        <div key={idx} className="p-3 bg-surface-muted/40 border border-border/70 rounded-xl text-xs space-y-1">
                          <div className="font-bold text-brand-700 dark:text-brand-400">L-Shape: {l.shape_code}</div>
                          <p className="text-[11px] text-muted-foreground">{l.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Missing Numbers & Remedies */}
            {activeTab === "remedies" && (
              <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-border/70 pb-3">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <Flame className="size-5 text-brand-600" />
                    {t.missingNumbersTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.missing_numbers_remedies.map((rem) => (
                    <div key={rem.digit} className="p-4 rounded-xl border border-border/80 bg-surface-muted/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-serif font-black text-red-500">{t.missingPrefix(rem.digit)}</span>
                        <span className="text-xs text-muted-foreground">{rem.element}</span>
                      </div>
                      <p className="text-xs text-foreground font-medium">{t.impactLabel} {rem.impact}</p>
                      <div className="p-2.5 bg-surface rounded-lg text-xs border border-border/70 space-y-1">
                        <div><span className="font-bold text-brand-700 dark:text-brand-400">{t.remedyLabel}</span> {rem.remedy}</div>
                        <div className="text-[11px] text-muted-foreground">{t.rudrakshaLabel} {rem.rudraksha} • {t.crystalLabel} {rem.crystal}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 6: 20-Field Profile from `NEW NUMRO.docx` */}
            {activeTab === "profile" && (
              <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-7 shadow-xs space-y-6">
                <div className="border-b border-border/70 pb-3">
                  <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
                    <Award className="size-5 text-brand-600" />
                    {t.profileTitle(data.mulank.number)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.profileSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.rulingPlanetDeity}</span>
                    <p className="font-bold text-foreground text-sm">{language === "hi" && data.mulank.planet_hi ? data.mulank.planet_hi : data.mulank.planet} • {data.mulank.deity}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.metalGemstone}</span>
                    <p className="font-bold text-foreground">{data.mulank.metal} • {data.mulank.gemstone}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.luckyDirection}</span>
                    <p className="font-bold text-foreground">{data.mulank.direction}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.luckyColors}</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{data.mulank.colors.join(", ")}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.unluckyColors}</span>
                    <p className="font-bold text-red-500">{data.mulank.unlucky_colors.join(", ")}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.luckyDaysMonths}</span>
                    <p className="font-bold text-foreground">{data.mulank.lucky_days.join(", ")}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-brand-500/10 border border-brand-500/30 rounded-xl space-y-1.5">
                    <span className="text-brand-800 dark:text-brand-300 font-bold">{t.beejMantraJap}</span>
                    <p className="font-mono font-bold text-foreground text-sm">{data.mulank.beej_mantra} {t.japCountSuffix(data.mulank.jap_count)}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-surface-muted/50 border border-border/80 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.grainsDaan}</span>
                    <p className="text-foreground">{data.mulank.grains_daan}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-surface-muted/50 border border-border/80 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.healthTraits}</span>
                    <p className="text-foreground">{data.mulank.health_traits}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-surface-muted/50 border border-border/80 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-semibold">{t.suitableProfession}</span>
                    <p className="text-foreground">{data.mulank.profession}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Name Correction & Spelling Harmonizer */}
            {activeTab === "name_correct" && (
              <NameCorrectionSection
                initialName={fullName}
                mulank={data.mulank.number}
                bhagyank={data.bhagyank.number}
                language={language}
              />
            )}

            {/* Tab 8: Mobile Sim Comparison Suite */}
            {activeTab === "mobile_compare" && (
              <MobileComparisonSection
                mulank={data.mulank.number}
                bhagyank={data.bhagyank.number}
                birthDate={birthDate}
                language={language}
              />
            )}

            {/* Tab 9: Business & Brand Numerology Evaluator */}
            {activeTab === "business" && (
              <BusinessNumerologySection
                ownerMulank={data.mulank.number}
                ownerBhagyank={data.bhagyank.number}
                language={language}
              />
            )}

            {/* Tab 10: Vehicle Plate & Bank Account Numerology Audit */}
            {activeTab === "vehicle_bank" && (
              <VehicleBankAuditSection
                mulank={data.mulank.number}
                bhagyank={data.bhagyank.number}
                language={language}
              />
            )}

            {/* Bottom Actions: Recalculate & Consult CTA */}
            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setData(null);
                  window.scrollTo({ top: 150, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>{t.recalculateBtn}</span>
              </button>

              <div className="flex items-center gap-2">
                <Link href="/appointments">
                  <Button size="sm" className="bg-amber-500 text-amber-950 font-black hover:bg-amber-400">
                    {t.consultAstrologerBtn}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={numerologyFeature?.name || (language === "bn" ? "সংখ্যা জ্যোতিষ (নিউমারোলজি)" : language === "hi" ? "अंक ज्योतिष (न्यूमरोलॉजी)" : "Numerology")}
        requiredCoins={numerologyFeature?.coins ?? 20}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
