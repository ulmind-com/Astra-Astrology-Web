"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Home,
  Layers,
  Flame,
  Shield,
  Languages,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
  Check,
  Award,
  Activity,
  Calculator,
  Sun,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { vastuApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import { VastuCompass } from "@/components/vastu/vastu-compass";
import { MedicalVastu } from "@/components/vastu/medical-vastu";
import { AstroVastu } from "@/components/vastu/astro-vastu";
import { AyadiShadvarga } from "@/components/vastu/ayadi-shadvarga";
import type { PadaInfo, VastuAuditResponse, VastuZoneInfo, VastuRemedyItem } from "@/types/vastu";
import type { AstrologyLanguage } from "@/types";
import { VASTU_I18N } from "@/lib/vastu-translations";

export default function VastuPage() {
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const vastuFeature = getFeature("vastu");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<"unauthorized" | "insufficient_coins" | "disabled">("insufficient_coins");

  const { language, setLanguage } = useLanguage();
  const t = VASTU_I18N[language] || VASTU_I18N.en;
  const [entranceDegree, setEntranceDegree] = React.useState<number>(335.0);
  const [currentPada, setCurrentPada] = React.useState<PadaInfo | null>(null);
  const [propertyType, setPropertyType] = React.useState<"residential" | "commercial" | "industrial">("residential");
  const [activeTab, setActiveTab] = React.useState<"compass" | "medical" | "astrovastu" | "ayadi" | "audit" | "zones" | "remedies">("compass");


  // Placement selections
  const [placements, setPlacements] = React.useState<Record<string, string>>({
    kitchen: "SE",
    master_bed: "SW",
    toilet: "SSW",
    puja_room: "NE",
    underground_water: "N",
    overhead_tank: "W",
    locker: "N",
    staircase: "S",
  });

  const [auditLoading, setAuditLoading] = React.useState(false);
  const [auditResult, setAuditResult] = React.useState<VastuAuditResponse | null>(null);
  const [allZones, setAllZones] = React.useState<VastuZoneInfo[]>([]);
  const [allRemedies, setAllRemedies] = React.useState<VastuRemedyItem[]>([]);
  const [selectedRemedyCat, setSelectedRemedyCat] = React.useState<string>("all");

  // Fetch initial compass pada & zones & remedies
  React.useEffect(() => {
    vastuApi.resolveDegree(entranceDegree).then((res) => {
      if (res) setCurrentPada(res);
    });
    vastuApi.getZones().then((res) => {
      if (res) setAllZones(res);
    });
    vastuApi.getRemedies().then((res) => {
      if (res) setAllRemedies(res);
    });
  }, []);

  const handleDegreeChange = async (deg: number) => {
    setEntranceDegree(deg);
    try {
      const res = await vastuApi.resolveDegree(deg);
      if (res) setCurrentPada(res);
    } catch {}
  };

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();

    const access = checkAccess("vastu");
    if (!access.allowed) {
      if (access.reason === "disabled") {
        toast.error(t.featureDisabled);
        return;
      }
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    setAuditLoading(true);
    try {
      const res = await vastuApi.audit({
        property_type: propertyType,
        main_entrance_degree: entranceDegree,
        placements,
      });
      if (res) {
        setAuditResult(res);
        if (vastuFeature && vastuFeature.coins > 0) {
          refreshWallet();
          toast.success(t.coinsDeducted(vastuFeature.coins));
        }
        toast.success(t.auditSuccess);
      }
    } catch (err: any) {
      if (err?.code === "insufficient_coins") {
        setCoinModalReason("insufficient_coins");
        setCoinModalOpen(true);
      } else if (err?.code === "authentication_required" || err?.status === 401) {
        setCoinModalReason("unauthorized");
        setCoinModalOpen(true);
      } else {
        toast.error(err?.message || (err instanceof Error ? err.message : "Failed to generate Vastu audit."));
      }
    } finally {
      setAuditLoading(false);
    }
  };

  const ZONES_LIST = [
    { code: "N", bn: "North (উত্তর - কুবের)", en: "North (N - Wealth & Growth)", hi: "उत्तर (कुबेर)" },
    { code: "NNE", bn: "NNE (উত্তর-উত্তর-পূর্ব - স্বাস্থ্য)", en: "NNE (Health & Healing)", hi: "उत्तर-उत्तर-पूर्व (स्वास्थ्य)" },
    { code: "NE", bn: "NE (উত্তর-পূর্ব - ঈশান / স্বচ্ছতা)", en: "NE (Clarity & Spiritual)", hi: "ईशान (उत्तर-पूर्व)" },
    { code: "ENE", bn: "ENE (পূর্ব-উত্তর-পূর্ব - আনন্দ)", en: "ENE (Fun & Recreation)", hi: "पूर्व-उत्तर-पूर्व (आनंद)" },
    { code: "E", bn: "East (পূর্ব - সামাজিক সংযোগ)", en: "East (E - Social Connections)", hi: "पूर्व (सामाजिक संबंध)" },
    { code: "ESE", bn: "ESE (পূর্ব-দক্ষিণ-পূর্ব - মন্থন)", en: "ESE (Churning & Anxiety)", hi: "पूर्व-दक्षिण-पूर्व (मंथन)" },
    { code: "SE", bn: "SE (দক্ষিণ-পূর্ব - অগ্নি / তারল্য)", en: "SE (Cash Flow & Fire)", hi: "आग्नेय (दक्षिण-पूर्व / अग्नि)" },
    { code: "SSE", bn: "SSE (দক্ষিণ-দক্ষিণ-পূর্ব - আত্মবিশ্বাস)", en: "SSE (Power & Confidence)", hi: "दक्षिण-दक्षिण-पूर्व (शक्ति)" },
    { code: "S", bn: "South (দক্ষিণ - যশ ও খ্যাতি)", en: "South (S - Fame & Relaxation)", hi: "दक्षिण (यश एवं ख्याति)" },
    { code: "SSW", bn: "SSW (দক্ষিণ-দক্ষিণ-পশ্চিম - বিসর্জন)", en: "SSW (Disposal & Waste)", hi: "दक्षिण-दक्षिण-पश्चिम (विसर्जन)" },
    { code: "SW", bn: "SW (দক্ষিণ-পশ্চিম - নৈঋত / সম্পর্ক)", en: "SW (Relationships & Skills)", hi: "नैऋत्य (दक्षिण-पश्चिम / स्थायित्व)" },
    { code: "WSW", bn: "WSW (পশ্চিম-দক্ষিণ-পশ্চিম - বিদ্যা)", en: "WSW (Knowledge & Studies)", hi: "पश्चिम-दक्षिण-पश्चिम (विद्या)" },
    { code: "W", bn: "West (পশ্চিম - বরুণ / প্রাপ্তি)", en: "West (W - Gains & Profits)", hi: "पश्चिम (प्राप्ति एवं लाभ)" },
    { code: "WNW", bn: "WNW (পশ্চিম-উত্তর-পশ্চিম - বিষাদ)", en: "WNW (Depression & Detox)", hi: "पश्चिम-उत्तर-पश्चिम (रुदन/डिटॉक्स)" },
    { code: "NW", bn: "NW (উত্তর-পশ্চিম - বায়ু / সহায়তা)", en: "NW (Support & Banking)", hi: "वायव्य (उत्तर-पश्चिम / सहयोग)" },
    { code: "NNW", bn: "NNW (উত্তর-উত্তর-পশ্চিম - আকর্ষণ)", en: "NNW (Sex & Attraction)", hi: "उत्तर-उत्तर-पश्चिम (आकर्षण)" },
  ];

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

          {/* Language Switcher Bar */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Languages className="size-4 text-muted-foreground" />
            <div className="inline-flex p-1 rounded-xl bg-surface border border-border/80 shadow-2xs">
              {(
                [
                  { code: "bn", label: "বাংলা" },
                  { code: "en", label: "English" },
                  { code: "hi", label: "हिन्दी" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    language === lang.code
                      ? "bg-brand-500 text-brand-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <FeatureCoinBadge
              feature={vastuFeature}
              coins={vastuFeature?.coins ?? 25}
              language={language}
            />
          </div>
        </div>

        {vastuFeature && !vastuFeature.enabled && (
          <div className="max-w-4xl mx-auto">
            <FeatureDisabledAlert featureName={vastuFeature?.name} language={language} />
          </div>
        )}

        {/* =========================================================================
            NAVIGATION TABS
        ========================================================================= */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-border/60 pb-3">
          {[
            {
              id: "compass",
              label: t.tabCompass,
              icon: Compass,
            },
            {
              id: "medical",
              label: t.tabMedical,
              icon: Activity,
            },
            {
              id: "astrovastu",
              label: t.tabAstroVastu,
              icon: Sun,
            },
            {
              id: "ayadi",
              label: t.tabAyadi,
              icon: Calculator,
            },
            {
              id: "audit",
              label: t.tabAudit,
              icon: Home,
            },
            {
              id: "zones",
              label: t.tabZones,
              icon: Layers,
            },
            {
              id: "remedies",
              label: t.tabRemedies,
              icon: Flame,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-brand-500 text-brand-foreground shadow-sm shadow-brand-500/20"
                    : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                }`}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: 360° VASTU AUDIT
        ========================================================================= */}
        {activeTab === "audit" && (
          <div className="space-y-8">
            {/* Audit Input Form */}
            <div className="card-surface rounded-2xl border border-border/80 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-amber-500" />
                    {t.auditSectionTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.auditSectionSub}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {t.propertyTypeLabel}
                  </span>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="bg-surface border border-input rounded-lg px-2.5 py-1 text-xs text-foreground font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <option value="residential">{t.typeResidential}</option>
                    <option value="commercial">{t.typeCommercial}</option>
                    <option value="industrial">{t.typeIndustrial}</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleAudit} className="space-y-6">
                {/* Entrance Angle Slider */}
                <div className="p-4 bg-surface rounded-xl border border-border/80 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {t.entranceAngleLabel}{" "}
                      <span className="text-amber-600 dark:text-amber-400 font-mono font-bold text-sm">
                        {entranceDegree.toFixed(1)}°
                      </span>
                    </label>
                    {currentPada && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          currentPada.is_auspicious
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                            : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30"
                        }`}
                      >
                        {currentPada.is_auspicious ? (
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                        ) : (
                          <ShieldAlert className="size-3.5 text-red-500" />
                        )}
                        {currentPada.pada_id} ({currentPada.deity}) —{" "}
                        {currentPada.is_auspicious ? t.goldenDoor : t.needsRemedy}
                      </span>
                    )}
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="359.9"
                    step="0.5"
                    value={entranceDegree}
                    onChange={(e) => handleDegreeChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />

                  <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                    <span>0° N (North)</span>
                    <span>90° E (East)</span>
                    <span>180° S (South)</span>
                    <span>270° W (West)</span>
                    <span>359.5°</span>
                  </div>
                </div>

                {/* Rooms Matrix */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                    {t.roomPositionsTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: "kitchen", label: t.roomKitchen },
                      { id: "master_bed", label: t.roomMasterBed },
                      { id: "toilet", label: t.roomToilet },
                      { id: "puja_room", label: t.roomPuja },
                      { id: "underground_water", label: t.roomBorewell },
                      { id: "overhead_tank", label: t.roomOverheadTank },
                      { id: "locker", label: t.roomCashLocker },
                      { id: "staircase", label: t.roomStaircase },
                    ].map((item) => (
                      <div key={item.id} className="p-3 bg-surface rounded-xl border border-border/80 space-y-1.5">
                        <label className="block text-xs font-semibold text-foreground truncate">{item.label}</label>
                        <select
                          value={placements[item.id] || "N"}
                          onChange={(e) => setPlacements({ ...placements, [item.id]: e.target.value })}
                          className="w-full bg-surface-muted/60 border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 font-medium"
                        >
                          {ZONES_LIST.map((z) => (
                            <option key={z.code} value={z.code}>
                              {language === "bn" ? z.bn : language === "hi" ? z.hi : z.en}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={auditLoading}
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-brand-foreground font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {auditLoading ? (
                    <span className="size-4 border-2 border-brand-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="size-4" />
                      <span>{t.generateAuditBtn}</span>
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Audit Results */}
            {auditResult && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Score & Summary Banner */}
                <div className="card-surface rounded-2xl border border-border/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full">
                      {t.gradeLabel(auditResult.grade)}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                      {t.harmonyScoreLabel(auditResult.overall_score)}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                      {auditResult.summary_bn}
                    </p>
                  </div>

                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="currentColor"
                        strokeWidth="10"
                        className={
                          auditResult.overall_score >= 80
                            ? "text-emerald-500"
                            : auditResult.overall_score >= 60
                            ? "text-amber-500"
                            : "text-red-500"
                        }
                        strokeDasharray={339.29}
                        strokeDashoffset={339.29 - (339.29 * auditResult.overall_score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-serif font-black text-foreground">
                        {auditResult.overall_score}
                      </span>
                      <span className="text-[10px] text-muted-foreground">/100</span>
                    </div>
                  </div>
                </div>

                {/* Critical Warnings */}
                {auditResult.warnings_critical.length > 0 && (
                  <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="size-4 text-red-500" />
                      {t.criticalFlawsTitle(auditResult.warnings_critical.length)}
                    </div>
                    <ul className="space-y-1.5 text-xs text-red-900 dark:text-red-200">
                      {auditResult.warnings_critical.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Room by Room Breakdown */}
                <div className="card-surface rounded-2xl border border-border/80 p-6 sm:p-8 space-y-4 shadow-xs">
                  <h3 className="text-base font-serif font-bold text-foreground flex items-center gap-2">
                    <Layers className="size-4 text-amber-500" />
                    {t.zoneEvaluationTitle}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {auditResult.evaluations.map((ev) => (
                      <div
                        key={ev.category_id}
                        className="p-4 bg-surface rounded-xl border border-border/80 space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-foreground">{ev.category_name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ev.rating === "Excellent"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                                : ev.rating === "Good"
                                ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
                                : ev.rating === "Acceptable"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                                : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
                            }`}
                          >
                            {ev.rating} ({ev.score}%)
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {t.zonePlacedLabel(ev.placed_zone)}
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed">{ev.impact_bn}</p>

                        {ev.remedy_bn && (
                          <div className="pt-2 border-t border-border/80 text-[11px] space-y-1">
                            <div>
                              <span className="font-bold text-amber-600 dark:text-amber-400">
                                {t.remedyLabel}
                              </span>{" "}
                              <span className="text-foreground/90">{ev.remedy_bn}</span>
                            </div>
                            {ev.metal_strip_blocking && (
                              <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {t.metalStripLabel(ev.metal_strip_blocking)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: 32 PADAS COMPASS WHEEL
        ========================================================================= */}
        {activeTab === "compass" && (
          <div className="space-y-6">
            <VastuCompass
              language={language}
              onAngleSelect={(deg) => {
                setEntranceDegree(deg);
                vastuApi.resolveDegree(deg).then((res) => {
                  if (res) setCurrentPada(res);
                }).catch(() => {});
              }}
            />

            {/* Quick CTA to Full Audit */}
            <div className="card-surface p-4 sm:p-5 rounded-2xl border border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs font-bold text-foreground flex items-center justify-center sm:justify-start gap-1.5">
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span>{t.compassCtaTitle}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t.compassCtaSub(entranceDegree)}
                </div>
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setActiveTab("audit")}
                className="shrink-0 text-xs font-bold cursor-pointer bg-brand-500 hover:bg-brand-600 text-brand-foreground shadow-sm flex items-center gap-1.5"
              >
                <Home className="size-3.5" />
                {t.openAuditBtn}
              </Button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: MEDICAL & PATHOLOGY VASTU
        ========================================================================= */}
        {activeTab === "medical" && (
          <MedicalVastu language={language} />
        )}

        {/* =========================================================================
            TAB: ASTRO-VASTU SYNERGY
        ========================================================================= */}
        {activeTab === "astrovastu" && (
          <AstroVastu language={language} />
        )}

        {/* =========================================================================
            TAB: AYADI SHADVARGA VEDIC ENGINE
        ========================================================================= */}
        {activeTab === "ayadi" && (
          <AyadiShadvarga language={language} />
        )}

        {/* =========================================================================
            TAB 3: 16 DIRECTIONAL ZONES
        ========================================================================= */}

        {activeTab === "zones" && (
          <div className="space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-2">
              <h3 className="text-xl font-serif font-bold text-foreground">
                {t.zonesTabTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t.zonesTabSub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allZones.map((z) => (
                <div
                  key={z.zone_code}
                  className="card-surface p-5 rounded-2xl border border-border/80 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-serif font-bold text-foreground">{z.zone_code}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-surface-muted text-muted-foreground">
                      {z.center_degree}°
                    </span>
                  </div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{z.zone_name_bn}</div>
                  <div className="text-xs text-muted-foreground">
                    {z.element_bn} • {z.dosha}
                  </div>
                  <div className="text-[11px] text-foreground/80">
                    <span className="font-semibold text-muted-foreground">
                      {t.organLabel}
                    </span>{" "}
                    {z.body_organs}
                  </div>
                  <div className="text-[11px] text-foreground/80">
                    <span className="font-semibold text-muted-foreground">
                      {t.aspectLabel}
                    </span>{" "}
                    {z.life_aspect}
                  </div>
                  <div className="pt-2 border-t border-border/80 text-[10px] space-y-1">
                    <div className="text-emerald-600 dark:text-emerald-400 truncate">
                      {t.colorsLabel} {z.self_colors.join(", ")}
                    </div>
                    <div className="text-red-500 truncate">
                      {t.avoidColorsLabel} {z.destructive_colors.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: 120 REMEDIES CATALOG
        ========================================================================= */}
        {activeTab === "remedies" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { id: "all", label: t.remedyCatAll },
                { id: "Financial Growth", label: t.remedyCatFinance },
                { id: "Health & Vitality", label: t.remedyCatHealth },
                { id: "Brand & Fame", label: t.remedyCatFame },
                { id: "Social Ties", label: t.remedyCatSocial },
                { id: "Opportunities", label: t.remedyCatOpportunity },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedRemedyCat(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRemedyCat === cat.id
                      ? "bg-brand-500 text-brand-foreground shadow-2xs"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRemedies
                .filter((r) => selectedRemedyCat === "all" || r.category === selectedRemedyCat)
                .map((rem) => (
                  <div
                    key={rem.remedy_id}
                    className="card-surface p-5 rounded-2xl border border-border/80 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/20">
                        {rem.category}
                      </span>
                      <span className="font-bold text-muted-foreground">{rem.target_zone} {t.zoneSuffix}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{rem.title_bn}</h4>
                    <p className="text-xs text-foreground/80 leading-relaxed">{rem.action_bn}</p>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-2 border-t border-border/80">
                      {t.requiredItemLabel} {rem.item_required}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      <FeatureCoinModal
        open={coinModalOpen}
        onClose={() => setCoinModalOpen(false)}
        featureName={vastuFeature?.name || (language === "bn" ? "বাস্তু শাস্ত্র" : "Vastu Shastra")}
        requiredCoins={vastuFeature?.coins ?? 25}
        walletBalance={walletBalance}
        reason={coinModalReason}
        language={language}
      />

      <SiteFooter />
    </div>
  );
}
