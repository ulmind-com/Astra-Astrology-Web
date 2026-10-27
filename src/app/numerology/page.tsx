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
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import type { NumerologyCalculateResponse } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";

export default function NumerologyPage() {
  const { user, isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");
  const [fullName, setFullName] = React.useState("Samiran Sasmal");
  const [birthDate, setBirthDate] = React.useState("1995-10-25");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");
  const [mobileNumber, setMobileNumber] = React.useState("9876543210");
  const [predictionYear, setPredictionYear] = React.useState<number>(new Date().getFullYear());

  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<NumerologyCalculateResponse | null>(null);
  const [activeTab, setActiveTab] = React.useState<"loshu" | "dasha" | "name" | "mobile" | "remedies" | "profile">("loshu");
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
        toast.success(
          language === "bn"
            ? "বৈদিক ও চ্যালডিয়ান নিউমারোলজি গণনা সফলভাবে সম্পন্ন হয়েছে!"
            : "Vedic Numerology calculated successfully!"
        );
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to calculate Numerology.");
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
            <span>
              {language === "bn"
                ? "বৈদিক ও চ্যালডিয়ান নিউমারোলজি ইঞ্জিন (লো-শু গ্রিড ও সংখ্যা দশা)"
                : language === "hi"
                ? "वैदिक एवं कैल्डियन अंकशास्त्र इंजन (लो-शु ग्रिड एवं दशा)"
                : "Vedic & Chaldean Numerology Engine (Lo Shu Grid & Dasha)"}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {language === "bn"
              ? "বৈদিক লো-শু গ্রিড, নাম স্পন্দন ও মোবাইল নিউমারোলজি"
              : language === "hi"
              ? "वैदिक लो-शु ग्रिड, नाम कम्पन एवं मोबाइल अंक ज्योतिष"
              : "Vedic Lo Shu Grid, Name Vibrations & Mobile Numerology"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {language === "bn"
              ? "ক্লায়েন্টের অথরিটেটিভ রিসোর্স অনুসারে মূলাঙ্ক, ভাগ্যাঙ্ক, চ্যালডিয়ান ১-১০০ নাম কম্পাউন্ড, সংখ্যা দশা (/৪৫ সূত্র) এবং মোবাইল কনজাংশন পেয়ার বিশ্লেষণ।"
              : language === "hi"
              ? "मूलांक, भाग्यांक, कैल्डियन १-१०० नाम कम्पन, वैदिक दशा चक्र एवं मोबाइल युति विश्लेषण।"
              : "Accurate Driver, Destiny, Chaldean 1-100 Compound Names, Numerology Dasha (/45 law) and Mobile Conjunction Pairs."}
          </p>

          {/* Language Switcher Bar */}
          <div className="flex items-center justify-center gap-2 pt-1">
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
        </div>

        {/* =========================================================================
            FORM CARD (Matching Astra Glassmorphic Theme)
        ========================================================================= */}
        <div className="rounded-2xl border border-border/80 bg-surface/90 shadow-sm p-4 sm:p-6 backdrop-blur-md">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {language === "bn" ? "পূর্ণ নাম (Full Name)" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder="e.g. Samiran Sasmal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {language === "bn" ? "জন্মতারিখ (Birth Date)" : "Birth Date"}
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
                  {language === "bn" ? "লিঙ্গ (Gender)" : "Gender"}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                >
                  <option value="male">{language === "bn" ? "পুরুষ (Male)" : "Male"}</option>
                  <option value="female">{language === "bn" ? "মহিলা (Female)" : "Female"}</option>
                  <option value="other">{language === "bn" ? "অন্যান্য (Other)" : "Other"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground-muted mb-1.5">
                  {language === "bn" ? "মোবাইল নম্বর (ঐচ্ছিক)" : "Mobile Number (Optional)"}
                </label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-surface border border-border/80 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  placeholder="১০ ডিজিট নম্বর"
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
                      {language === "bn" ? "গণনা করুন" : "Calculate"}
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
                  {language === "bn" ? "মূলাঙ্ক (Driver)" : "Driver (Mulank)"}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-brand-600 mt-1.5">
                  {data.mulank.number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1">{data.mulank.planet}</div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "ভাগ্যাঙ্ক (Destiny)" : "Destiny (Bhagyank)"}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-amber-500 mt-1.5">
                  {data.bhagyank.number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1">{data.bhagyank.planet}</div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "কুয়া সংখ্যা (Kua)" : "Kua Number"}
                </div>
                <div className="text-3xl sm:text-4xl font-serif font-black text-sky-500 mt-1.5">
                  {data.kua_number}
                </div>
                <div className="text-xs font-medium text-foreground mt-1">
                  {language === "bn" ? "ব্যক্তিগত শুভ কম্পন" : "Personal Vibration"}
                </div>
              </div>

              <div className="rounded-2xl border border-border/80 bg-surface p-4 sm:p-5 shadow-xs relative overflow-hidden">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {language === "bn" ? "ব্যক্তিগত বছর (Personal Year)" : "Personal Year"}
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
                { id: "loshu", label: language === "bn" ? "বৈদিক লো-শু গ্রিড ও যোগ" : "Lo Shu Grid & Yogas", icon: Layers },
                { id: "dasha", label: language === "bn" ? "সংখ্যা দশা টাইমলাইন" : "Dasha Timeline", icon: Compass },
                { id: "name", label: language === "bn" ? "চ্যালডিয়ান নাম বিশ্লেষণ" : "Name Analysis", icon: UserCheck },
                { id: "mobile", label: language === "bn" ? "মোবাইল কনজাংশন অডিট" : "Mobile Audit", icon: Phone },
                { id: "remedies", label: language === "bn" ? "অনুপস্থিত সংখ্যা প্রতিকার" : "Missing Remedies", icon: BookOpen },
                { id: "profile", label: language === "bn" ? "মূলাঙ্ক ২০-ক্ষেত্র বিবরণ" : "20-Field Profile", icon: Award },
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
                      {language === "bn" ? "বৈদিক ৩×৩ লো-শু গ্রিড" : "Vedic 3x3 Lo Shu Grid"}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">৩-১-৯ / ৬-৭-৫ / ২-৮-৪</span>
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
                      {language === "bn" ? "সক্রিয় রাজযোগ (Special Raj Yogas)" : "Active Raj Yogas"}
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
                              {yoga.is_active ? "সক্রিয় (Active)" : "অনুপস্থিত"}
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
                      {language === "bn" ? "লো-শু সমতল ও স্তম্ভ (Planes of Will & Action)" : "Lo Shu Planes & Columns"}
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
                            {plane.status} ({plane.percentage}%)
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
                    {language === "bn" ? "বৈদিক সংখ্যা দশা সময়কাল (Vedic Dasha Hierarchy)" : "Vedic Numerology Dasha"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ক্লায়েন্টের অথরিটেটিভ /৪৫ সূত্র ($AD = \frac{"{MD \\times AD}"}{"{45}"}$) এবং ১৮ অক্টোবরের ফ্রেন্ডশিপ ম্যাট্রিক্স অনুযায়ী মহাদশা, অন্তর্দশা ও প্রত্যন্তর্দশা।
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
                            {period.planet} ({language === "bn" ? `সংখ্যা ${period.number}` : `Number ${period.number}`})
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            period.friendship_score === "Favorable"
                              ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                              : period.friendship_score === "Unfavorable"
                              ? "bg-red-500/20 text-red-800 dark:text-red-300"
                              : "bg-surface border border-border/80 text-muted-foreground"
                          }`}>
                            {period.friendship_score}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{period.guidance}</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xs font-mono font-bold text-foreground">
                          {period.start_date} <span className="text-muted-foreground">➔</span> {period.end_date}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          স্থায়িত্ব: {period.duration_days} দিন
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
                      {language === "bn" ? "চ্যালডিয়ান নাম বিশ্লেষণ" : "Chaldean Compound Name Analysis"}
                    </div>
                    <h3 className="text-2xl font-serif font-black text-foreground mt-1">
                      {data.name_analysis.full_name}
                    </h3>
                    <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mt-1">
                      কম্পাউন্ড সংখ্যা: {data.name_analysis.compound_number} (একক সংখ্যা: {data.name_analysis.single_number}) — {data.name_analysis.compound_name}
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-surface-muted/60 border border-border/80 rounded-xl text-left sm:text-right">
                    <div className="text-[11px] text-muted-foreground">সামগ্রিক রায়</div>
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
                      <div className="font-bold">সতর্কতা: ক্ষতিকর সিলেবল চিহ্নিত হয়েছে!</div>
                      <p className="mt-1">
                        নামের মধ্যে ক্ষতিকর ধ্বনি ({data.name_analysis.negative_syllables_found.join(", ")}) রয়েছে, যা ক্লায়েন্ট ডকুমেন্ট (`Name Numerology/01.pdf`) অনুযায়ী শুভ কম্পাউন্ডকেও ক্ষতিগ্রস্ত করে।
                      </p>
                    </div>
                  </div>
                )}

                {/* Letters Sound Vibrations */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    বর্ণভিত্তিক চ্যালডিয়ান স্পন্দন (Letter Sound Profiles)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {data.name_analysis.letters.map((ltr, idx) => (
                      <div key={idx} className="p-3 bg-surface-muted/40 border border-border/70 rounded-xl text-center space-y-1">
                        <div className="text-xl font-serif font-black text-brand-600">{ltr.letter}</div>
                        <div className="text-xs font-semibold text-foreground">মান: {ltr.value}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{ltr.sound_element}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 dark:text-amber-200">
                  <span className="font-bold">পরামর্শ: </span>
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
                      মোবাইল নম্বর অডিট (Mobile Number Numerology)
                    </div>
                    <h3 className="text-2xl font-serif font-black text-foreground mt-1">
                      {data.mobile_analysis.mobile_number}
                    </h3>
                    <p className="text-xs font-semibold text-brand-700 dark:text-brand-400 mt-1">
                      যোগফল: {data.mobile_analysis.total_sum} (একক সংখ্যা: {data.mobile_analysis.single_digit}) • {data.mobile_analysis.compound_quality}
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-surface-muted/60 border border-border/80 rounded-xl text-left sm:text-right">
                    <div className="text-[11px] text-muted-foreground">অডিট রায়</div>
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
                      ক্রমান্বয়ে ২-সংখ্যার জোড়া (৬০% / ৪০% আধিপত্য সূত্র)
                    </h4>
                    <span className="text-[11px] text-muted-foreground">১ম ডিজিট ৬০% • ২য় ডিজিট ৪০%</span>
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
                          <span className="text-sm font-serif">{p.pair} জোড়া</span>
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
                      মোবাইল গ্রিডের এল-শেপ (Sepharial 3x3 L-Shapes)
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
                    অনুপস্থিত সংখ্যার প্রতিকার (Missing Numbers & Vedic Remedies)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.missing_numbers_remedies.map((rem) => (
                    <div key={rem.digit} className="p-4 rounded-xl border border-border/80 bg-surface-muted/30 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-serif font-black text-red-500">অনুপস্থিত {rem.digit}</span>
                        <span className="text-xs text-muted-foreground">{rem.element}</span>
                      </div>
                      <p className="text-xs text-foreground font-medium">প্রভাব: {rem.impact}</p>
                      <div className="p-2.5 bg-surface rounded-lg text-xs border border-border/70 space-y-1">
                        <div><span className="font-bold text-brand-700 dark:text-brand-400">উপায়:</span> {rem.remedy}</div>
                        <div className="text-[11px] text-muted-foreground">রুদ্রাক্ষ: {rem.rudraksha} • ক্রিস্টাল: {rem.crystal}</div>
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
                    মূলাঙ্ক {data.mulank.number}-এর পূর্ণাঙ্গ ২০-ক্ষেত্র শাস্ত্রীয় বিবরণ (NEW NUMRO)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    ক্লায়েন্ট কর্তৃক প্রদত্ত অথরিটেটিভ হস্তলিখিত নিয়মাবলীর পূর্ণাঙ্গ রূপান্তর।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">অধিপতি গ্রহ ও ইষ্টদেবতা:</span>
                    <p className="font-bold text-foreground text-sm">{data.mulank.planet} • {data.mulank.deity}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">ধাতু ও রত্ন:</span>
                    <p className="font-bold text-foreground">{data.mulank.metal} • {data.mulank.gemstone}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">শুভ দিক:</span>
                    <p className="font-bold text-foreground">{data.mulank.direction}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">শুভ রঙ:</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">{data.mulank.colors.join(", ")}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">বর্জনীয় রঙ:</span>
                    <p className="font-bold text-red-500">{data.mulank.unlucky_colors.join(", ")}</p>
                  </div>
                  <div className="p-3.5 bg-surface-muted/40 rounded-xl border border-border/70 space-y-1">
                    <span className="text-muted-foreground font-semibold">শুভ বার ও মাস:</span>
                    <p className="font-bold text-foreground">{data.mulank.lucky_days.join(", ")}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-brand-500/10 border border-brand-500/30 rounded-xl space-y-1.5">
                    <span className="text-brand-800 dark:text-brand-300 font-bold">মূল বৈদিক বীজ মন্ত্র ও জপ সংখ্যা:</span>
                    <p className="font-mono font-bold text-foreground text-sm">{data.mulank.beej_mantra} ({data.mulank.jap_count.toLocaleString()} বার জপ)</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-surface-muted/50 border border-border/80 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-semibold">দান সামগ্রী (Grains Daan):</span>
                    <p className="text-foreground">{data.mulank.grains_daan}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-surface-muted/50 border border-border/80 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-semibold">স্বাস্থ্য সতর্কতা ও রোগ প্রবণতা:</span>
                    <p className="text-foreground">{data.mulank.health_traits}</p>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3 p-4 bg-surface-muted/50 border border-border/80 rounded-xl space-y-1">
                    <span className="text-muted-foreground font-semibold">উপযুক্ত পেশা ও জীবিকা ক্ষেত্র:</span>
                    <p className="text-foreground">{data.mulank.profession}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
