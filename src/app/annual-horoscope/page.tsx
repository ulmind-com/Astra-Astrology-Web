"use client";

import * as React from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Scroll,
  Sparkles,
  ShieldCheck,
  Flame,
  RotateCcw,
  Printer,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  MapPin,
  User,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BirthPlaceField, type SelectedPlace } from "@/components/astrology/birth-place-field";
import { astrologyApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import { useLanguage } from "@/providers/language-provider";
import type {
  AnnualHoroscopeRequest,
  AnnualHoroscopeResponse,
  AstrologyLanguage,
} from "@/types";

const TARGET_YEARS = [2026, 2027, 2028];

const PILLAR_ICONS: Record<string, string> = {
  career: "💼",
  finance: "💰",
  health: "🌿",
  love: "❤️",
  family: "🏡",
  luck: "✨",
};

const FOCUS_AREAS = [
  { id: "general", en: "Overall Life", bn: "সার্বিক জীবন", hi: "समग्र जीवन" },
  { id: "career", en: "Career & Business", bn: "কর্ম ও চাকরি", hi: "करियर एवं व्यापार" },
  { id: "finance", en: "Liquid Wealth", bn: "অর্থ ও সঞ্চয়", hi: "धन एवं संचय" },
  { id: "love", en: "Love & Marriage", bn: "প্রেম ও বিবাহ", hi: "प्रेम एवं विवाह" },
  { id: "health", en: "Health & Vitality", bn: "স্বাস্থ্য ও আরোগ্য", hi: "स्वास्थ्य व आरोग्यता" },
  { id: "family", en: "Family Peace", bn: "পারিবারিক শান্তি", hi: "पारिवारिक शांति" },
  { id: "debt", en: "Debt & Legal", bn: "ঋণমুক্তি ও মামলা", hi: "ऋणमुक्ति एवं विवाद" },
] as const;

export default function AnnualHoroscopePage() {
  const { language } = useLanguage();
  const lang = (["en", "bn", "hi"].includes(language) ? language : "en") as AstrologyLanguage;
  const { isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });

  const [targetYear, setTargetYear] = React.useState<number>(2026);
  const [primaryFocus, setPrimaryFocus] = React.useState<string>("general");

  // Form states
  const [clientName, setClientName] = React.useState<string>("");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");
  const [birthDay, setBirthDay] = React.useState<number>(15);
  const [birthMonth, setBirthMonth] = React.useState<number>(8);
  const [birthYear, setBirthYear] = React.useState<number>(1995);
  const [birthHour, setBirthHour] = React.useState<number>(10);
  const [birthMinute, setBirthMinute] = React.useState<number>(30);
  const [birthPeriod, setBirthPeriod] = React.useState<"AM" | "PM">("AM");

  const [selectedPlace, setSelectedPlace] = React.useState<SelectedPlace | null>({
    place: "Kolkata, West Bengal, India",
    displayName: "Kolkata, West Bengal, India",
    latitude: 22.5726,
    longitude: 88.3639,
    timezoneName: "Asia/Kolkata",
    timezoneOffset: 5.5,
    timezoneLabel: "IST (UTC+05:30)",
    timezoneAbbreviation: "IST",
    isDst: false,
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingStep, setLoadingStep] = React.useState<string>("");
  const [report, setReport] = React.useState<AnnualHoroscopeResponse | null>(null);
  const [expandedPillar, setExpandedPillar] = React.useState<string | null>("career");
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");

  // Pre-fill from user profile
  React.useEffect(() => {
    if (profile) {
      if (profile.full_name && !clientName) setClientName(profile.full_name);
      if (profile.gender) setGender(profile.gender as "male" | "female" | "other");
      if (profile.birth?.date_of_birth) {
        const parts = profile.birth.date_of_birth.split("-");
        if (parts.length === 3) {
          setBirthYear(parseInt(parts[0], 10));
          setBirthMonth(parseInt(parts[1], 10));
          setBirthDay(parseInt(parts[2], 10));
        }
      }
      if (profile.birth?.time_of_birth) {
        const tParts = profile.birth.time_of_birth.split(":");
        if (tParts.length >= 2) {
          let h = parseInt(tParts[0], 10);
          const m = parseInt(tParts[1], 10);
          if (h >= 12) {
            setBirthPeriod("PM");
            if (h > 12) h -= 12;
          } else {
            setBirthPeriod("AM");
            if (h === 0) h = 12;
          }
          setBirthHour(h);
          setBirthMinute(m);
        }
      }
    }
  }, [profile]);

  // Generate QR code for report digital seal verification
  React.useEffect(() => {
    if (report?.digital_seal?.verification_url) {
      QRCode.toDataURL(report.digital_seal.verification_url, {
        width: 140,
        margin: 1,
        color: { dark: "#2a1b12", light: "#ffffff" },
      })
        .then((url) => setQrCodeUrl(url))
        .catch(() => {});
    }
  }, [report?.digital_seal?.verification_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error(
        lang === "bn"
          ? "অনুগ্রহ করে আপনার নাম লিখুন।"
          : lang === "hi"
          ? "कृपया अपना नाम दर्ज करें।"
          : "Please enter your name."
      );
      return;
    }

    if (!selectedPlace) {
      toast.error(
        lang === "bn"
          ? "অনুগ্রহ করে জন্মস্থান নির্বাচন করুন।"
          : lang === "hi"
          ? "कृपया जन्म स्थान चुनें।"
          : "Please select your birthplace."
      );
      return;
    }

    const pad = (n: number) => String(n).padStart(2, "0");
    const date_of_birth = `${birthYear}-${pad(birthMonth)}-${pad(birthDay)}`;
    let h24 = birthHour;
    if (birthPeriod === "PM" && h24 < 12) h24 += 12;
    if (birthPeriod === "AM" && h24 === 12) h24 = 0;
    const time_of_birth = `${pad(h24)}:${pad(birthMinute)}`;

    const payload: AnnualHoroscopeRequest = {
      client_name: clientName.trim(),
      date_of_birth,
      time_of_birth,
      city_name: selectedPlace.displayName || selectedPlace.place,
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      timezone: selectedPlace.timezoneOffset ?? 5.5,
      target_year: targetYear,
      language: lang,
      primary_focus: primaryFocus as any,
    };

    setLoading(true);
    setLoadingStep(
      lang === "bn"
        ? "সুইস এফিমেরিস দিয়ে সোলার রিটার্ন গোচর লগ্ন গণনা হচ্ছে..."
        : lang === "hi"
        ? "स्विस एफेमेरिस द्वारा सोलर रिटर्न वर्ष लग्न की गणना हो रही है..."
        : "Computing Solar Return & planetary longitudes via Swiss Ephemeris..."
    );

    try {
      const res = await astrologyApi.annualHoroscope(payload);
      setReport(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success(
        lang === "bn"
          ? `${targetYear} বর্ষফল সনদ সফলভাবে প্রস্তুত হয়েছে!`
          : `${targetYear} Varshphal Dossier generated successfully!`
      );
    } catch (err: any) {
      console.error("Annual horoscope calculation error:", err);
      toast.error(
        err?.message ||
          (lang === "bn"
            ? "বর্ষফল গণনা ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
            : "Failed to generate Varshphal. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && report?.digital_seal?.verification_url) {
      navigator.clipboard.writeText(report.digital_seal.verification_url);
      toast.success(
        lang === "bn"
          ? "ভেরিফিকেশন লিংক কপি হয়েছে!"
          : "Verification link copied to clipboard!"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfbf7] via-[#fffdf9] to-[#fbf8f1] text-[#2a1e17] flex flex-col font-sans">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        {!report ? (
          <>
            {/* Tool Hero */}
            <div className="text-center space-y-4">
              <div className="mx-auto size-16 rounded-full border-2 border-amber-600 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-500 flex items-center justify-center shadow-lg">
                <Scroll className="size-8 text-amber-950" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 border border-amber-300">
                <Sparkles className="size-3.5 text-amber-600" />
                <span>
                  {lang === "bn"
                    ? "সুইস এফিমেরিস ও লাল কিতাব ক্যানন"
                    : lang === "hi"
                    ? "स्विस एफेमेरिस एवं लाल किताब"
                    : "Swiss Ephemeris & Lal Kitab Canon"}
                </span>
              </div>

              <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-amber-950 tracking-tight">
                {lang === "bn"
                  ? "১ বছরের বার্ষিক বর্ষফল ও মহাপ্রতিকার"
                  : lang === "hi"
                  ? "1-वर्षीय वार्षिक वर्षफल व महा-उपाय"
                  : "Annual Lal Kitab Varshphal"}
              </h1>

              <p className="max-w-2xl mx-auto text-sm sm:text-base leading-relaxed text-[#6b5840]">
                {lang === "bn"
                  ? "আপনার জন্মছক ও সোলার রিটার্ন গোচরের ওপর ভিত্তি করে ৬টি প্রধান জীবন স্তম্ভের নিখুঁত ভবিষ্যৎবাণী ও খাঁটি লাল কিতাব মহাটোটকা।"
                  : "Comprehensive 1-year solar return forecast across 6 life pillars with authentic Lal Kitab remedies & Gomti Chakra protocols."}
              </p>
            </div>

            {/* Target Year Picker */}
            <div className="rounded-3xl border border-amber-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                  {lang === "bn" ? "টার্গেট বর্ষফল বছর নির্বাচন করুন:" : "Target Varshphal Year:"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {TARGET_YEARS.map((y) => {
                    const active = targetYear === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setTargetYear(y)}
                        className={`rounded-2xl py-3 text-base font-black transition-all cursor-pointer ${
                          active
                            ? "bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-[1.02]"
                            : "bg-amber-50/60 text-stone-700 border border-amber-200 hover:border-amber-400"
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Focus Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                  {lang === "bn" ? "বিশেষ জীবন স্তম্ভের ওপর জোর দিন:" : "Primary Focus Area:"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((f) => {
                    const active = primaryFocus === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPrimaryFocus(f.id)}
                        className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? "bg-amber-800 text-white shadow-sm"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                        }`}
                      >
                        {lang === "bn" ? f.bn : lang === "hi" ? f.hi : f.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Birth Details Form */}
              <form onSubmit={handleSubmit} className="pt-4 border-t border-amber-100 space-y-5">
                <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
                  <User className="size-4 text-amber-600" />
                  <span>{lang === "bn" ? "জাতক/জাতিকার জন্ম বিবরণ" : "Birth Details"}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {lang === "bn" ? "পূর্ণ নাম" : "Full Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={lang === "bn" ? "আপনার নাম" : "Your Name"}
                      className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {lang === "bn" ? "লিঙ্গ" : "Gender"}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["male", "female", "other"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGender(g)}
                          className={`rounded-xl py-2.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                            gender === g
                              ? "bg-amber-600 text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {g === "male" ? (lang === "bn" ? "পুরুষ" : "Male") : g === "female" ? (lang === "bn" ? "মহিলা" : "Female") : "Other"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-600" />
                    <span>{lang === "bn" ? "জন্ম তারিখ (দিন / মাস / বছর)" : "Birth Date (Day / Month / Year)"}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={birthDay}
                      onChange={(e) => setBirthDay(parseInt(e.target.value, 10))}
                      className="rounded-xl border border-stone-300 px-3 py-2 text-sm text-center focus:border-amber-500 focus:outline-hidden"
                      placeholder="DD"
                    />
                    <select
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(parseInt(e.target.value, 10))}
                      className="rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-hidden"
                    >
                      {[
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                      ].map((m, idx) => (
                        <option key={m} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1920}
                      max={2026}
                      value={birthYear}
                      onChange={(e) => setBirthYear(parseInt(e.target.value, 10))}
                      className="rounded-xl border border-stone-300 px-3 py-2 text-sm text-center focus:border-amber-500 focus:outline-hidden"
                      placeholder="YYYY"
                    />
                  </div>
                </div>

                {/* Birth Time */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-amber-600" />
                    <span>{lang === "bn" ? "জন্ম সময় (ঘণ্টা : মিনিট)" : "Birth Time (Hour : Minute)"}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={birthHour}
                      onChange={(e) => setBirthHour(parseInt(e.target.value, 10))}
                      className="rounded-xl border border-stone-300 px-3 py-2 text-sm text-center focus:border-amber-500 focus:outline-hidden"
                      placeholder="Hour"
                    />
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={birthMinute}
                      onChange={(e) => setBirthMinute(parseInt(e.target.value, 10))}
                      className="rounded-xl border border-stone-300 px-3 py-2 text-sm text-center focus:border-amber-500 focus:outline-hidden"
                      placeholder="Minute"
                    />
                    <div className="grid grid-cols-2 gap-1">
                      {(["AM", "PM"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setBirthPeriod(p)}
                          className={`rounded-xl py-2 text-xs font-bold cursor-pointer ${
                            birthPeriod === p
                              ? "bg-amber-600 text-white"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Birth Place */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-amber-600" />
                    <span>{lang === "bn" ? "জন্মস্থান (শহর বা জেলা)" : "Birth Place (City or District)"}</span>
                  </label>
                  <BirthPlaceField
                    value={selectedPlace}
                    onChange={setSelectedPlace}
                    birthDate={{ year: birthYear, month: birthMonth, day: birthDay }}
                    language={lang}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 py-4 text-base font-black text-white shadow-lg shadow-amber-600/30 transition-all hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>{loadingStep || (lang === "bn" ? "গণনা চলছে..." : "Calculating...")}</span>
                    ) : (
                      <>
                        <Scroll className="size-5" />
                        <span>
                          {lang === "bn"
                            ? `${targetYear} বর্ষফল সনদ তৈরি করুন`
                            : `Generate ${targetYear} Varshphal Dossier`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Report View */
          <div className="space-y-8 animate-in fade-in">
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-200/80 print:hidden">
              <button
                type="button"
                onClick={() => setReport(null)}
                className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-900 shadow-xs hover:bg-amber-50 cursor-pointer"
              >
                <RotateCcw className="size-3.5 text-amber-700" />
                <span>{lang === "bn" ? "অন্য জন্মছক গণনা করুন" : "Calculate Another"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-700 cursor-pointer"
                >
                  <Printer className="size-3.5" />
                  <span>{lang === "bn" ? "PDF ডাউনলোড / প্রিন্ট" : "Download PDF / Print"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 rounded-full border border-stone-300 bg-white hover:bg-stone-100 cursor-pointer"
                  title="Copy verification link"
                >
                  <Copy className="size-4 text-stone-600" />
                </button>
              </div>
            </div>

            {/* Score & Personal Details Card */}
            <div className="rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-white via-amber-50/40 to-white p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="size-24 rounded-full border-4 border-amber-400 bg-amber-100/80 flex flex-col items-center justify-center shadow-inner shrink-0">
                  <span className="text-2xl font-black text-amber-950">{report.overall_score}%</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                    {lang === "bn" ? "শুভত্ব সূচক" : "Auspicious"}
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-amber-200/70 text-[11px] font-bold text-amber-900 mb-1">
                    {report.target_year} {lang === "bn" ? "বার্ষিক বর্ষফল" : "Annual Varshphal"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                    {report.personal_details.name}
                  </h2>
                  <p className="text-xs text-stone-600">
                    {lang === "bn" ? "জন্ম লগ্ন: " : "Natal Lagna: "}
                    <strong className="text-stone-900">{report.personal_details.natal_lagna}</strong> •{" "}
                    {lang === "bn" ? "চন্দ্র রাশি: " : "Moon: "}
                    <strong className="text-stone-900">{report.personal_details.moon_rashi}</strong> •{" "}
                    {lang === "bn" ? "নক্ষত্র: " : "Nakshatra: "}
                    <strong className="text-stone-900">{report.personal_details.nakshatra}</strong>
                  </p>
                  <p className="text-xs text-amber-800 font-semibold pt-1">
                    {lang === "bn" ? "বর্ষফল লগ্ন: " : "Varshphal Lagna: "}
                    <strong>{report.personal_details.varshphal_lagna}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-amber-200/70">
                <p className="text-sm sm:text-base leading-relaxed text-stone-800 font-serif">
                  {report.annual_summary}
                </p>
              </div>
            </div>

            {/* 6 Life Pillars Breakdown Accordion */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                <Sparkles className="size-5 text-amber-600" />
                <span>
                  {lang === "bn"
                    ? "৬টি প্রধান জীবন স্তম্ভের বার্ষিক বিশ্লেষণ"
                    : "6 Life Pillars Annual Breakdown"}
                </span>
              </h3>

              <div className="space-y-3">
                {report.pillars.map((pillar) => {
                  const isExpanded = expandedPillar === pillar.id;
                  const icon = PILLAR_ICONS[pillar.id] || "🔮";
                  return (
                    <div
                      key={pillar.id}
                      className="rounded-2xl border border-amber-200/80 bg-white overflow-hidden shadow-xs transition-all hover:border-amber-400"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedPillar(isExpanded ? null : pillar.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-amber-50/40"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{icon}</span>
                          <div>
                            <h4 className="font-bold text-stone-900 text-sm sm:text-base">{pillar.title}</h4>
                            <p className="text-xs text-stone-500">
                              {pillar.status} • {lang === "bn" ? "শুভ মাস: " : "Key Months: "}
                              <span className="text-stone-800 font-medium">{pillar.key_months}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                            {pillar.score}%
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="size-5 text-stone-400" />
                          ) : (
                            <ChevronDown className="size-5 text-stone-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-stone-100 space-y-3">
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                            {pillar.analysis}
                          </p>
                          {pillar.precautions && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 flex items-start gap-2 text-amber-900">
                              <AlertTriangle className="size-4 shrink-0 text-amber-600 mt-0.5" />
                              <p className="text-xs text-amber-900 leading-snug">
                                {pillar.precautions}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lal Kitab Primary Mahaupay */}
            {report.primary_mahaupay && (
              <div className="rounded-3xl border-2 border-red-300 bg-gradient-to-br from-red-50 via-white to-red-50/40 p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-red-100 text-red-600">
                    <Flame className="size-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-600">
                      {lang === "bn" ? "পবিত্র লাল কিতাব প্রেসক্রিপশন" : "Lal Kitab Canon"}
                    </span>
                    <h3 className="text-lg font-bold text-stone-900">
                      {report.primary_mahaupay.title}
                    </h3>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {report.primary_mahaupay.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800">
                      <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sacred Gomti Chakra Protocols */}
            {report.gomti_chakra_remedies && report.gomti_chakra_remedies.length > 0 && (
              <div className="rounded-3xl border border-amber-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-amber-600" />
                  <h3 className="text-lg font-bold text-amber-950">
                    {lang === "bn" ? "অলৌকিক গোমতী চক্র মহাটোটকা" : "Sacred Gomti Chakra Protocols"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.gomti_chakra_remedies.map((g, idx) => (
                    <div key={idx} className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 space-y-1">
                      <h4 className="text-xs font-bold text-amber-900">{g.problem}</h4>
                      <p className="text-xs text-stone-700 leading-relaxed">{g.remedy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Consecrated Remedies Store Link */}
            {report.store_recommendations && report.store_recommendations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-amber-950">
                    {lang === "bn" ? "বর্ষফল শান্তিকল্পে বিহিত পবিত্র প্রতিকার" : "Recommended Consecrated Remedies"}
                  </h3>
                  <Link
                    href="/shop"
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
                  >
                    <span>{lang === "bn" ? "স্টোরে দেখুন" : "View Store"}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {report.store_recommendations.map((rec) => (
                    <Link
                      key={rec.id}
                      href="/shop"
                      className="group rounded-2xl border border-amber-200/80 bg-white p-4 flex items-center justify-between shadow-xs transition-all hover:shadow-md hover:border-amber-400"
                    >
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-[10px] font-bold text-amber-900">
                          {rec.category}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-stone-500">{rec.sacred_reason}</p>
                        <p className="text-sm font-extrabold text-amber-900">
                          ₹{rec.sale_price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <Package className="size-6 text-amber-600 group-hover:scale-110 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic Digital Seal & Verification Link */}
            {report.digital_seal && (
              <div className="rounded-3xl border-2 border-dashed border-amber-400 bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl}
                    alt="Digital Seal QR"
                    className="size-28 rounded-xl border border-amber-300 shadow-sm shrink-0"
                  />
                )}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-900 font-bold text-sm">
                    <ShieldCheck className="size-5 text-amber-600" />
                    <span>{report.digital_seal.seal_title}</span>
                  </div>
                  <p className="text-xs text-stone-600 font-serif italic">
                    {report.digital_seal.seal_motto}
                  </p>
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    <p>ID: <strong className="text-stone-800">{report.digital_seal.report_id}</strong></p>
                    <p className="truncate">Hash: <strong className="text-stone-800">{report.digital_seal.authenticity_hash}</strong></p>
                  </div>
                  {report.digital_seal.verification_url && (
                    <Link
                      href={report.digital_seal.verification_url}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 pt-1"
                    >
                      <span>{lang === "bn" ? "সনদ অনলাইন যাচাইকরণ" : "Verify Authenticity Online"}</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
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
