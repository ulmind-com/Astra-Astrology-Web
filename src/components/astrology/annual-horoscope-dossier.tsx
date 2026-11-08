"use client";

import * as React from "react";
import QRCode from "qrcode";
import {
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Copy,
  Check,
  X,
  Briefcase,
  Heart,
  Activity,
  Home,
  Scale,
  Award,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Flame,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import { useLanguage } from "@/providers/language-provider";
import type {
  AnnualHoroscopeRequest,
  AnnualHoroscopeResponse,
  AstrologyLanguage,
} from "@/types";

interface AnnualHoroscopeDossierProps {
  onOpenWalletRecharge?: () => void;
}

export function AnnualHoroscopeHeroBanner({
  onGenerateClick,
}: {
  onGenerateClick: () => void;
}) {
  const { language } = useLanguage();
  const { getFeature, walletBalance } = useFeaturePricing();
  const feature = getFeature("annual_horoscope");
  const cost = feature?.coins ?? 50;
  const isFree = feature ? feature.is_free : false;
  const isEnabled = feature ? feature.enabled : true;

  if (!isEnabled) {
    return null;
  }

  const t = {
    bn: {
      tag: "বিশুদ্ধ লাল কিতাব সংহিতা • বার্ষিক বর্ষফল ও মহাপ্রতিকার",
      title: "১ বছরের বার্ষিক রাশিফল ও লাল কিতাব মহাপ্রতিকার সনদ",
      subtitle:
        "আপনার জন্মছক ও সোলার রিটার্ন গোচরের ওপর ভিত্তি করে ৬টি প্রধান জীবন স্তম্ভের নিখুঁত ভবিষ্যৎবাণী, ক্লায়েন্টের বিশুদ্ধ লাল কিতাব মহাপ্রতিকার ও ৮টি অলৌকিক গোমতী চক্র টোটকা সহ রাজকীয় বৈদিক সনদ।",
      cta: "১ বছরের পূর্ণাঙ্গ রিপোর্ট তৈরি করুন",
      freeTag: "সম্পূর্ণ বিনামূল্যে",
      coinsTag: `${cost} কয়েন ব্যয় হবে`,
      balance: `আপনার ব্যালেন্স: ${walletBalance} কয়েন`,
    },
    hi: {
      tag: "प्रामाणिक लाल किताब संहिता • वार्षिक वर्षफल व महा-उपाय",
      title: "1-वर्षीय वार्षिक राशिफल व लाल किताब महा-उपाय प्रमाणपत्र",
      subtitle:
        "आपकी जन्म कुंडली एवं सोलर रिटर्न गोचर के आधार पर 6 मुख्य जीवन स्तंभों का सटीक विश्लेषण, प्रामाणिक लाल किताब उपाय एवं 8 गोमती चक्र चमत्कारी टोटकों से सुसज्जित राजसी वैदिक दस्तावेज।",
      cta: "1-वर्षीय संपूर्ण रिपोर्ट तैयार करें",
      freeTag: "पूर्णतः निःशुल्क",
      coinsTag: `${cost} कॉइन खर्च होंगे`,
      balance: `आपका बैलेंस: ${walletBalance} कॉइन`,
    },
    en: {
      tag: "Authentic Lal Kitab Canon • 1-Year Varshphal & Remedies Dossier",
      title: "1-Year Annual Horoscope & Lal Kitab Prediction Certificate",
      subtitle:
        "Comprehensive 1-year solar return forecast across 6 life pillars with authentic Lal Kitab remedies, 8 sacred Gomti Chakra protocols, and royal printable certificate.",
      cta: "Generate 1-Year Lal Kitab Dossier",
      freeTag: "100% Free",
      coinsTag: `Costs ${cost} Coins`,
      balance: `Your Balance: ${walletBalance} Coins`,
    },
  }[language in ["bn", "hi", "en"] ? language : "en"];

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-[#2a1b12] via-[#3a2519] to-[#1f1510] p-6 sm:p-8 text-white shadow-2xl mb-10">
      {/* Decorative celestial background elements */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-orange-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-4 right-6 text-7xl font-serif text-amber-500/10 select-none">
        ॐ
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/15 px-3.5 py-1 text-xs font-semibold text-amber-200">
            <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
            <span>{t.tag}</span>
          </div>

          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-tight text-amber-100">
            {t.title}
          </h2>

          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
            {t.subtitle}
          </p>

          <div className="flex items-center gap-3 pt-1 text-xs text-amber-300/90 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-bold bg-amber-900/60 border border-amber-600/50 px-2.5 py-1 rounded-lg">
              <Coins className="size-3.5 text-amber-400" />
              {isFree ? t.freeTag : t.coinsTag}
            </span>
            <span>•</span>
            <span>{t.balance}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
          <button
            type="button"
            onClick={onGenerateClick}
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-6 py-3.5 text-sm font-bold text-amber-950 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <BookOpen className="size-4" />
            <span>{t.cta}</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AnnualHoroscopeGeneratorModal({
  open,
  onClose,
  onReportGenerated,
  onOpenWalletRecharge,
}: {
  open: boolean;
  onClose: () => void;
  onReportGenerated: (report: AnnualHoroscopeResponse) => void;
  onOpenWalletRecharge?: () => void;
}) {
  const { language } = useLanguage();
  const { isSignedIn } = useAuth();
  const { data: profile } = useProfile({ enabled: isSignedIn });
  const { getFeature, walletBalance } = useFeaturePricing();

  const feature = getFeature("annual_horoscope");
  const cost = feature?.coins ?? 50;
  const isFree = feature ? feature.is_free : false;
  const hasEnoughCoins = isFree || walletBalance >= cost;

  // Form states
  const [clientName, setClientName] = React.useState<string>("");
  const [birthDate, setBirthDate] = React.useState<string>("");
  const [birthTime, setBirthTime] = React.useState<string>("12:00");
  const [cityName, setCityName] = React.useState<string>("Kolkata");
  const [latitude, setLatitude] = React.useState<number>(22.5726);
  const [longitude, setLongitude] = React.useState<number>(88.3639);
  const [timezoneOffset, setTimezoneOffset] = React.useState<number>(5.5);
  const [targetYear, setTargetYear] = React.useState<number>(() => new Date().getFullYear());
  const [selectedLanguage, setSelectedLanguage] = React.useState<AstrologyLanguage>(language);
  const [primaryFocus, setPrimaryFocus] = React.useState<string>("general");

  const [loading, setLoading] = React.useState<boolean>(false);
  const [loadingStep, setLoadingStep] = React.useState<string>("");

  // Pre-fill from profile
  React.useEffect(() => {
    if (profile) {
      if (profile.full_name && !clientName) setClientName(profile.full_name);
      if (profile.birth?.date_of_birth && !birthDate) setBirthDate(profile.birth.date_of_birth);
      if (profile.birth?.time_of_birth && birthTime === "12:00") setBirthTime(profile.birth.time_of_birth);
      const bCity = profile.birth?.city || profile.birth?.place;
      if (bCity && cityName === "Kolkata") setCityName(bCity);
    }
  }, [profile, clientName, birthDate, birthTime, cityName]);

  React.useEffect(() => {
    setSelectedLanguage(language);
  }, [language]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate) {
      toast.error(
        selectedLanguage === "bn"
          ? "অনুগ্রহ করে জন্ম তারিখ নির্বাচন করুন।"
          : selectedLanguage === "hi"
          ? "कृपया जन्म तिथि का चयन करें।"
          : "Please select your date of birth."
      );
      return;
    }

    if (!hasEnoughCoins) {
      toast.error(
        selectedLanguage === "bn"
          ? `আপনার ওয়ালেটে পর্যাপ্ত কয়েন নেই। প্রয়োজন ${cost} কয়েন।`
          : selectedLanguage === "hi"
          ? `आपके वॉलेट में पर्याप्त कॉइन नहीं हैं। आवश्यकता: ${cost} कॉइन।`
          : `Insufficient wallet balance. Required: ${cost} coins.`
      );
      if (onOpenWalletRecharge) onOpenWalletRecharge();
      return;
    }

    setLoading(true);
    setLoadingStep(
      selectedLanguage === "bn"
        ? "সুইস এফিমেরিস দিয়ে সোলার রিটার্ন গোচর লগ্ন গণনা হচ্ছে..."
        : selectedLanguage === "hi"
        ? "स्विस एफेमेरिस द्वारा सोलर रिटर्न वर्ष लग्न की गणना हो रही है..."
        : "Computing Solar Return & Varshphal planetary longitudes..."
    );

    try {
      setTimeout(() => {
        setLoadingStep(
          selectedLanguage === "bn"
            ? "বিশুদ্ধ লাল কিতাব ১০৮ ভাব প্রতিকার ও গোমতী চক্র সংকলন চলছে..."
            : selectedLanguage === "hi"
            ? "प्रामाणिक लाल किताब 108 भाव उपाय व गोमती चक्र संकलन जारी है..."
            : "Compiling authentic Lal Kitab remedies & Gomti Chakra totkes..."
        );
      }, 1200);

      const payload: AnnualHoroscopeRequest = {
        date_of_birth: birthDate,
        time_of_birth: birthTime || "12:00",
        latitude,
        longitude,
        timezone: timezoneOffset,
        city_name: cityName,
        client_name: clientName || undefined,
        target_year: targetYear,
        language: selectedLanguage,
        primary_focus: primaryFocus as any,
      };

      const res = await astrologyApi.annualHoroscope(payload);
      toast.success(
        selectedLanguage === "bn"
          ? "১ বছরের বার্ষিক রাশিফল সনদ সফলভাবে তৈরি হয়েছে!"
          : selectedLanguage === "hi"
          ? "1-वर्षीय वार्षिक राशिफल प्रमाणपत्र सफलतापूर्वक तैयार हो गया!"
          : "1-Year Annual Horoscope & Lal Kitab Dossier generated successfully!"
      );
      onReportGenerated(res);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to generate report";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const focusOptions = [
    { id: "general", bn: "সার্বিক ভাগ্য ও উন্নতি", hi: "समग्र भाग्य व उन्नति", en: "General Life & Luck" },
    { id: "career", bn: "কর্ম ও ব্যবসা (চাকরি/প্রমোশন)", hi: "आजीविका व व्यापार (प्रमोशन)", en: "Career & Business Elevation" },
    { id: "finance", bn: "আটকে থাকা টাকা ও ধনলাভ", hi: "अटका धन व आर्थिक लाभ", en: "Wealth & Blocked Money Recovery" },
    { id: "health", bn: "রোগমুক্তি ও স্বাস্থ্য সুরক্ষা", hi: "रोग मुक्ति व स्वास्थ्य रक्षा", en: "Health Protection & Longevity" },
    { id: "love", bn: "দাম্পত্য সুখ ও প্রেম বৃদ্ধি", hi: "वैवाहिक सुख व संबंध मधुरता", en: "Love & Marital Harmony" },
    { id: "family", bn: "সন্তান বাধা দূরীকরণ ও বংশসুখ", hi: "संतान सुख व पारिवारिक शांति", en: "Progeny Blessing & Family Peace" },
    { id: "debt", bn: "ঋণমুক্তি ও দেনা শোধ", hi: "कर्ज मुक्ति व वित्तीय स्थिरता", en: "Debt Relief & Freedom" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-amber-500/50 bg-[#faf6f0] p-6 sm:p-8 text-[#332c39] shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#ebd7c8]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
              <Sparkles className="size-3" />
              <span>
                {selectedLanguage === "bn"
                  ? "বৈদিক বর্ষফল কনফিগারেশন"
                  : selectedLanguage === "hi"
                  ? "वैदिक वर्षफल कॉन्फ़िगरेशन"
                  : "Vedic Varshphal Configuration"}
              </span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#4D4664]">
              {selectedLanguage === "bn"
                ? "১ বছরের বার্ষিক রাশিফল ও লাল কিতাব সনদ"
                : selectedLanguage === "hi"
                ? "1-वर्षीय वार्षिक राशिफल व लाल किताब प्रमाणपत्र"
                : "1-Year Annual Horoscope & Lal Kitab Dossier"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-4">
            <div className="relative mx-auto size-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-amber-300 animate-ping opacity-40" />
              <div className="size-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg">
                <RotateCcw className="size-8 text-amber-950 animate-spin" />
              </div>
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#4D4664]">
              {loadingStep}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              {selectedLanguage === "bn"
                ? "সুইস এফিমেরিস ও লাল কিতাব ক্যানন অনুসারে আপনার কুষ্ঠি ও মহাপ্রতিকার প্রস্তুত হচ্ছে..."
                : selectedLanguage === "hi"
                ? "स्विस एफेमेरिस एवं लाल किताब शास्त्र के अनुसार आपकी कुंडली व महा-उपाय तैयार हो रहे हैं..."
                : "Synthesizing Swiss Ephemeris Solar Return & authentic Lal Kitab canon..."}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {selectedLanguage === "bn" ? "আপনার নাম (ঐচ্ছিক)" : selectedLanguage === "hi" ? "आपका नाम (वैकल्पिक)" : "Full Name (Optional)"}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 size-4 text-stone-400" />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={selectedLanguage === "bn" ? "যেমন: রাহুল ভট্টাচার্য" : selectedLanguage === "hi" ? "जैसे: राहुल शर्मा" : "e.g. Rahul Sharma"}
                  className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Birth Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedLanguage === "bn" ? "জন্ম তারিখ *" : selectedLanguage === "hi" ? "जन्म तिथि *" : "Date of Birth *"}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 size-4 text-stone-400" />
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedLanguage === "bn" ? "জন্ম সময় *" : selectedLanguage === "hi" ? "जन्म समय *" : "Time of Birth *"}
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 size-4 text-stone-400" />
                  <input
                    type="time"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* City & Target Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedLanguage === "bn" ? "জন্মস্থান / শহর" : selectedLanguage === "hi" ? "जन्म स्थान / शहर" : "Birth City"}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 size-4 text-stone-400" />
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Kolkata, Delhi, Dhaka..."
                    className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-3 py-2 text-sm focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedLanguage === "bn" ? "কোন বছরের ভবিষ্যৎবাণী?" : selectedLanguage === "hi" ? "किस वर्ष का भविष्यफल?" : "Forecast Target Year"}
                </label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-600 focus:outline-hidden"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2025}>2025</option>
                </select>
              </div>
            </div>

            {/* Language & Primary Focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedLanguage === "bn" ? "রিপোর্টের ভাষা" : selectedLanguage === "hi" ? "रिपोर्ट की भाषा" : "Report Language"}
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "bn", label: "বাংলা" },
                    { id: "hi", label: "हिन्दी" },
                    { id: "en", label: "English" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedLanguage(l.id as any)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedLanguage === l.id
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {selectedLanguage === "bn" ? "বিশেষ গুরুত্বের বিষয়" : selectedLanguage === "hi" ? "विशेष प्राथमिकता" : "Primary Focus Area"}
                </label>
                <select
                  value={primaryFocus}
                  onChange={(e) => setPrimaryFocus(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm focus:border-amber-600 focus:outline-hidden"
                >
                  {focusOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt[selectedLanguage in ["bn", "hi", "en"] ? selectedLanguage : "en"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing check & CTA */}
            <div className="pt-3 border-t border-[#ebd7c8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
                <Coins className="size-4 text-amber-600" />
                <span>
                  {isFree
                    ? selectedLanguage === "bn" ? "বিনামূল্যে উৎপন্ন হবে" : selectedLanguage === "hi" ? "निःशुल्क उत्पन्न होगा" : "Free of charge"
                    : `${cost} কয়েন ব্যয় হবে • ব্যালেন্স: ${walletBalance}`}
                </span>
              </div>

              {!hasEnoughCoins ? (
                <button
                  type="button"
                  onClick={onOpenWalletRecharge}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-sm"
                >
                  {selectedLanguage === "bn" ? "ওয়ালেট রিচার্জ করুন" : selectedLanguage === "hi" ? "वॉलेट रिचार्ज करें" : "Recharge Wallet"}
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs hover:from-amber-700 hover:to-amber-600 transition-all shadow-md cursor-pointer"
                >
                  {selectedLanguage === "bn"
                    ? "রিপোর্ট তৈরি করুন"
                    : selectedLanguage === "hi"
                    ? "रिपोर्ट तैयार करें"
                    : "Generate Royal Report"}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AnnualHoroscopeDossierModal({
  report,
  onClose,
}: {
  report: AnnualHoroscopeResponse | null;
  onClose: () => void;
}) {
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>("");
  const lang = report?.language || "en";

  React.useEffect(() => {
    if (report?.digital_seal?.verification_url) {
      QRCode.toDataURL(report.digital_seal.verification_url, {
        width: 160,
        margin: 1,
        color: { dark: "#2a1b12", light: "#ffffff" },
      })
        .then((url) => setQrCodeUrl(url))
        .catch(() => {});
    }
  }, [report?.digital_seal?.verification_url]);

  if (!report) return null;

  const handlePrint = () => {
    if (typeof window === "undefined") return;

    const printableElement = document.getElementById("annual-dossier-printable-content");
    if (!printableElement) {
      window.print();
      return;
    }

    try {
      // Create dedicated hidden iframe for pristine, isolated PDF printing
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      iframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        return;
      }

      // Collect CSS styles
      const styleTags = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
        .map((tag) => tag.outerHTML)
        .join("\n");

      const pageTitle = `${report.digital_seal.seal_title} - ${report.report_id}`;

      // Clone content and remove any no-print control bars
      const clone = printableElement.cloneNode(true) as HTMLElement;
      clone.querySelectorAll(".dossier-no-print").forEach((el) => el.remove());

      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="${lang}">
          <head>
            <title>${pageTitle}</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
            ${styleTags}
            <style>
              @page {
                size: A4 portrait;
                margin: 10mm 10mm 10mm 10mm;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              html, body {
                background-color: #fffdfa !important;
                color: #332c39 !important;
                margin: 0 !important;
                padding: 0 !important;
                font-family: 'Poppins', 'Noto Sans Bengali', 'Noto Sans Devanagari', system-ui, sans-serif !important;
              }
              .print-container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 auto !important;
                padding: 16px !important;
                box-sizing: border-box !important;
                background-color: #fffdfa !important;
              }
              .dossier-no-print {
                display: none !important;
              }
              .page-avoid {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
            </style>
          </head>
          <body>
            <div class="print-container">
              ${clone.innerHTML}
            </div>
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          window.print();
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 2000);
        }
      }, 350);
    } catch {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined" && report.digital_seal.verification_url) {
      navigator.clipboard.writeText(report.digital_seal.verification_url);
      toast.success(
        lang === "bn"
          ? "সনদ ভেরিফিকেশন লিংক কপি হয়েছে!"
          : lang === "hi"
          ? "प्रमाणपत्र सत्यापन लिंक कॉपी हो गया!"
          : "Verification link copied to clipboard!"
      );
    }
  };

  return (
    <div className="dossier-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in print:p-0 print:bg-white print:static print:inset-auto">
      <div
        id="annual-dossier-printable-content"
        className="relative w-full max-w-4xl my-auto rounded-3xl border-4 border-double border-amber-600/70 bg-gradient-to-b from-[#faf4eb] via-[#fffdf9] to-[#faf4eb] p-6 sm:p-10 text-[#332c39] shadow-2xl max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-amber-700 print:rounded-none print:p-6 print:m-0"
      >
        
        {/* Floating Top Action Bar (Hidden in Print) */}
        <div className="dossier-no-print flex items-center justify-between pb-4 mb-6 border-b-2 border-amber-400/50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full border border-amber-400">
              <ShieldCheck className="size-3.5 text-amber-800" />
              <span>{report.report_id}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all shadow-md cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>{lang === "bn" ? "PDF ডাউনলোড / প্রিন্ট" : lang === "hi" ? "PDF डाउनलोड / प्रिंट" : "Download PDF / Print"}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-200 transition-colors"
              title="Copy link"
            >
              <Copy className="size-4 text-stone-600" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-200 transition-colors"
              title="Close"
            >
              <X className="size-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* -------------------- ROYAL VEDIC DOSSIER BODY -------------------- */}
        
        {/* Header with Mandala & Golden Om */}
        <div className="text-center space-y-2 border-b-2 border-amber-500/40 pb-6 relative">
          <div className="mx-auto size-16 rounded-full border-2 border-amber-600 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-500 flex items-center justify-center shadow-md">
            <span className="font-serif text-3xl font-black text-amber-950">ॐ</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-amber-950">
            {report.digital_seal.seal_title}
          </h1>

          <p className="font-serif italic text-xs sm:text-sm font-semibold text-amber-900/90 tracking-wide">
            {report.digital_seal.seal_motto}
          </p>

          <div className="flex items-center justify-center gap-4 text-[11px] text-amber-800 font-medium pt-1">
            <span>{lang === "bn" ? "সনদ নং:" : lang === "hi" ? "प्रमाणपत्र सं:" : "Certificate ID:"} {report.report_id}</span>
            <span>•</span>
            <span>{lang === "bn" ? "প্রতিষ্ঠাকাল:" : lang === "hi" ? "अंकन तिथि:" : "Consecration:"} {report.consecration_date}</span>
          </div>
        </div>

        {/* Personal & Astrological Profile Grid */}
        <div className="mt-6 rounded-2xl border border-amber-300/80 bg-amber-50/60 p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {lang === "bn" ? "জাতক / জাতিকা" : lang === "hi" ? "जातक" : "Client Name"}
            </span>
            <span className="font-bold text-stone-900 text-sm">{report.personal_details.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {lang === "bn" ? "জন্ম বিবরণ" : lang === "hi" ? "जन्म विवरण" : "Birth Details"}
            </span>
            <span className="font-semibold text-stone-800">
              {report.personal_details.date_of_birth} ({report.personal_details.time_of_birth})
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {lang === "bn" ? "জন্ম রাশি ও নক্ষত্র" : lang === "hi" ? "जन्म राशि व नक्षत्र" : "Moon Sign & Nakshatra"}
            </span>
            <span className="font-bold text-stone-900">
              {report.personal_details.moon_rashi} • {report.personal_details.nakshatra} (পদ {report.personal_details.pada})
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {lang === "bn" ? `${report.target_year} বর্ষফল লগ্ন` : lang === "hi" ? `${report.target_year} वर्षफल लग्न` : `${report.target_year} Varshphal Lagna`}
            </span>
            <span className="font-bold text-amber-900 text-sm">
              {report.personal_details.varshphal_lagna} লগ্ন
            </span>
          </div>
        </div>

        {/* Overall Cosmic Score Banner */}
        <div className="mt-6 rounded-2xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-amber-600 text-white flex flex-col items-center justify-center font-bold shadow-md shrink-0">
              <span className="text-xl leading-none">{report.overall_score}%</span>
              <span className="text-[9px] uppercase tracking-wider">{lang === "bn" ? "স্কোর" : lang === "hi" ? "स्कोर" : "Score"}</span>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 mb-1">
                <CheckCircle2 className="size-3" />
                <span>
                  {report.overall_score >= 80
                    ? lang === "bn" ? "অত্যন্ত শুভ ও সিদ্ধিদায়ক বছর" : lang === "hi" ? "अत्यंत शुभ व फलदायी वर्ष" : "Highly Auspicious Year"
                    : lang === "bn" ? "শুভ ও প্রতিকার সাপেক্ষে প্রগতিশীল" : lang === "hi" ? "शुभ व उपाय सापेक्ष प्रगति" : "Favorable with Prescribed Upay"}
                </span>
              </span>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {report.annual_summary}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Life Pillars Grid */}
        <div className="mt-8 space-y-3">
          <h2 className="font-cinzel text-lg font-bold text-[#4D4664] flex items-center gap-2 border-b border-amber-300/80 pb-2">
            <BookOpen className="size-4 text-amber-700" />
            <span>
              {lang === "bn"
                ? "৬টি প্রধান জীবন স্তম্ভের বার্ষিক বিশ্লেষণ (6 Life Pillars Analysis)"
                : lang === "hi"
                ? "6 मुख्य जीवन स्तंभों का वार्षिक विश्लेषण (6 Life Pillars)"
                : "6 Core Life Pillars Annual Forecast"}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="rounded-2xl border border-stone-200 bg-white/90 p-4 shadow-xs space-y-2 hover:border-amber-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                    {pillar.id === "career" && <Briefcase className="size-4 text-amber-700" />}
                    {pillar.id === "finance" && <Coins className="size-4 text-amber-700" />}
                    {pillar.id === "health" && <Activity className="size-4 text-rose-600" />}
                    {pillar.id === "love" && <Heart className="size-4 text-pink-600" />}
                    {pillar.id === "family" && <Home className="size-4 text-indigo-600" />}
                    {pillar.id === "luck" && <Sparkles className="size-4 text-amber-600" />}
                    <span>{pillar.title}</span>
                  </h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                    {pillar.score}%
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">{pillar.analysis}</p>

                <div className="pt-2 border-t border-stone-100 text-[11px] space-y-1">
                  <p className="text-amber-900 font-semibold">
                    <span className="font-bold text-amber-950">⚠️ {lang === "bn" ? "সতর্কতা:" : lang === "hi" ? "सावधानी:" : "Precaution:"}</span> {pillar.precautions}
                  </p>
                  <p className="text-stone-500">
                    <span className="font-semibold text-stone-700">📅 {lang === "bn" ? "অনুকূল মাস:" : lang === "hi" ? "शुभ मास:" : "Key Months:"}</span> {pillar.key_months}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Quarters Seasonal Roadmap */}
        <div className="mt-8 space-y-3">
          <h2 className="font-cinzel text-lg font-bold text-[#4D4664] flex items-center gap-2 border-b border-amber-300/80 pb-2">
            <Calendar className="size-4 text-amber-700" />
            <span>
              {lang === "bn"
                ? "৪ ত্রৈমাসিক বর্ষফল সময়রেখা (4 Quarters Timeline)"
                : lang === "hi"
                ? "4 त्रैमासिक वर्षफल समय-सारणी (4 Quarters Timeline)"
                : "4 Quarters Seasonal Roadmap"}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {report.quarters.map((q) => (
              <div
                key={q.quarter}
                className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span className="bg-amber-600 text-white px-2 py-0.5 rounded-md text-[10px]">
                    {q.quarter}
                  </span>
                  <span className="text-[10px] text-stone-500 font-normal">{q.dates}</span>
                </div>
                <h5 className="font-bold text-xs text-stone-900">{q.title}</h5>
                <p className="text-[11px] text-stone-700 leading-relaxed">{q.guidance}</p>
                <div className="pt-1.5 border-t border-amber-200/60 text-[10px] space-y-0.5">
                  <span className="text-emerald-800 font-bold block">✓ {lang === "bn" ? "শুভ তারিখ:" : lang === "hi" ? "शुभ तिथियां:" : "Favorable:"} {q.favorable_dates}</span>
                  <span className="text-rose-800 font-bold block">⚠ {lang === "bn" ? "সতর্ক তারিখ:" : lang === "hi" ? "सावधान तिथियां:" : "Caution:"} {q.caution_dates}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shubh Phal & Ashubh Phal Split Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Shubh Phal */}
          <div className="rounded-2xl border-2 border-emerald-300/80 bg-emerald-50/60 p-4 sm:p-5 space-y-3">
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-emerald-950 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <span>
                {lang === "bn" ? "শুভ ফল ও দৈব আশীর্বাদ (Shubh Phal)" : lang === "hi" ? "शुभ फल व दैवीय कृपा (Shubh Phal)" : "Auspicious Influences (Shubh Phal)"}
              </span>
            </h3>
            <ul className="space-y-2 text-xs text-emerald-900 leading-relaxed">
              {report.shubh_phal.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ashubh Phal / Graha Peeda */}
          <div className="rounded-2xl border-2 border-amber-400/80 bg-amber-50/70 p-4 sm:p-5 space-y-3">
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-700" />
              <span>
                {lang === "bn" ? "সতর্কবার্তা ও গ্রহপীড়া নিবারণ (Ashubh Phal)" : lang === "hi" ? "सावधानियां व ग्रह पीड़ा (Ashubh Phal)" : "Challenging Transits & Cautionary Points"}
              </span>
            </h3>
            <ul className="space-y-2 text-xs text-amber-950 leading-relaxed">
              {report.ashubh_phal.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold">⚠️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Varshphal 9 Planets Chart Table */}
        <div className="mt-8 space-y-3">
          <h2 className="font-cinzel text-lg font-bold text-[#4D4664] flex items-center gap-2 border-b border-amber-300/80 pb-2">
            <Scale className="size-4 text-amber-700" />
            <span>
              {lang === "bn"
                ? `বর্ষফল ১২ ভাব ও নবগ্রহ চক্র (${report.target_year} Planetary Grid)`
                : lang === "hi"
                ? `वर्षफल 12 भाव एवं नवग्रह चक्र (${report.target_year} Planetary Grid)`
                : `${report.target_year} Varshphal Planetary House Placements`}
            </span>
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-amber-200">
            <table className="w-full text-xs text-left bg-white/80">
              <thead className="bg-amber-100/70 text-amber-950 font-bold text-[11px] uppercase">
                <tr>
                  <th className="p-2.5">{lang === "bn" ? "গ্রহ" : lang === "hi" ? "ग्रह" : "Planet"}</th>
                  <th className="p-2.5">{lang === "bn" ? "বর্ষ ভাব" : lang === "hi" ? "वर्ष भाव" : "Varsh Bhava"}</th>
                  <th className="p-2.5">{lang === "bn" ? "গোচর রাশি" : lang === "hi" ? "गोचर राशि" : "Zodiac Sign"}</th>
                  <th className="p-2.5">{lang === "bn" ? "অংশ" : lang === "hi" ? "डिग्री" : "Degree"}</th>
                  <th className="p-2.5">{lang === "bn" ? "প্রকৃতি" : lang === "hi" ? "प्रकृति" : "Lal Kitab Nature"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {report.varshphal_planets.map((p) => (
                  <tr key={p.planet_id} className="hover:bg-amber-50/50">
                    <td className="p-2.5 font-bold flex items-center gap-1.5 text-stone-900">
                      <span className="text-amber-700 font-serif">{p.symbol}</span>
                      <span>{p.name}</span>
                    </td>
                    <td className="p-2.5 font-semibold text-amber-900">
                      {p.house}{lang === "bn" ? "ম ভাব" : lang === "hi" ? " भाव" : "th House"}
                    </td>
                    <td className="p-2.5 text-stone-800">{p.sign}</td>
                    <td className="p-2.5 text-stone-600">{p.degree}°</td>
                    <td className="p-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.nature === "shubh"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : p.nature === "ashubh"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}
                      >
                        {p.nature === "shubh"
                          ? lang === "bn" ? "শুভ ফলদায়ী" : lang === "hi" ? "शुभ फलदायी" : "Benefic"
                          : p.nature === "ashubh"
                          ? lang === "bn" ? "প্রতিকার আবশ্যক" : lang === "hi" ? "उपाय अनिवार्य" : "Caution"
                          : lang === "bn" ? "মিশ্র প্রভাব" : lang === "hi" ? "मिश्रित प्रभाव" : "Mixed"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Authentic Lal Kitab Remedies Section */}
        <div className="mt-8 space-y-4">
          <div className="border-b-2 border-amber-500/60 pb-2">
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
              <Flame className="size-5 text-amber-700" />
              <span>
                {lang === "bn"
                  ? "বিশুদ্ধ লাল কিতাব শাস্ত্রীয় মহাপ্রতিকার ও সাবধানতা (Lal Kitab Canon Upay)"
                  : lang === "hi"
                  ? "प्रामाणिक लाल किताब शास्त्रीय महा-उपाय व सावधानियां"
                  : "Authentic Lal Kitab Canonical Remedies & Precautions"}
              </span>
            </h2>
            <p className="text-xs text-amber-800/80">
              {lang === "bn"
                ? "ক্লায়েন্ট রিসোর্স সংহিতা অনুসারে আপনার বর্ষফলের জন্য বিশেষভাবে নির্ধারিত নিখুঁত টোটকা ও অনুশাসন।"
                : lang === "hi"
                ? "स्रोत संहिता के अनुसार आपके वर्षफल हेतु विशेष रूप से निर्धारित अचूक उपाय व आचार-संहिता।"
                : "Strictly tailored to your Varshphal planetary house placements from the authentic canon."}
            </p>
          </div>

          <div className="space-y-4">
            {report.lal_kitab_remedies.map((rem, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-amber-300 bg-white/95 p-4 sm:p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                    <span className="font-serif text-amber-700 text-lg">{rem.symbol}</span>
                    <span>{rem.title}</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                    {lang === "bn" ? "বর্ষ প্রতিকার" : lang === "hi" ? "वर्ष उपाय" : "Varsh Upay"}
                  </span>
                </div>

                {/* Dos & Don'ts */}
                {rem.dos_and_donts.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                      ⚠️ {lang === "bn" ? "সাবধানতা ও অনুশাসন (Do's & Don'ts):" : lang === "hi" ? "सावधानियां (Do's & Don'ts):" : "Precautions (Do's & Don'ts):"}
                    </h5>
                    <ul className="list-disc list-inside text-xs text-stone-700 space-y-1">
                      {rem.dos_and_donts.map((d, dIdx) => (
                        <li key={dIdx}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Upay */}
                {rem.upay_list.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      🌿 {lang === "bn" ? "শাস্ত্রীয় সমাধান ও প্রতিবিধান (Authentic Remedies):" : lang === "hi" ? "उपाय (Authentic Remedies):" : "Authentic Remedies (Upay):"}
                    </h5>
                    <ul className="list-disc list-inside text-xs text-emerald-950 font-medium space-y-1">
                      {rem.upay_list.map((u, uIdx) => (
                        <li key={uIdx}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* High-Impact Special Problem Mahaupay */}
        {report.primary_mahaupay && (
          <div className="mt-8 rounded-2xl border-2 border-amber-500 bg-gradient-to-r from-amber-100/60 via-amber-50 to-amber-100/60 p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-amber-300 pb-2">
              <Award className="size-5 text-amber-800" />
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-950">
                {report.primary_mahaupay.title}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-stone-800 leading-relaxed font-medium">
              {report.primary_mahaupay.items.map((it, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-700 font-bold">✦</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 8 Sacred Gomti Chakra Miracle Remedies */}
        <div className="mt-8 space-y-3">
          <div className="border-b-2 border-amber-500/60 pb-2">
            <h2 className="font-cinzel text-lg font-bold text-amber-950 flex items-center gap-2">
              <ShieldCheck className="size-5 text-amber-700" />
              <span>
                {lang === "bn"
                  ? "৮টি অলৌকিক গোমতী চক্র শাস্ত্রীয় মহাপ্রতিকার (8 Gomti Chakra Remedies)"
                  : lang === "hi"
                  ? "गोमती चक्र के 8 अचूक शास्त्रीय उपाय (8 Gomti Chakra Remedies)"
                  : "8 Sacred Gomti Chakra Miracle Protocols"}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.gomti_chakra_remedies.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-amber-200 bg-white/90 p-3.5 text-xs space-y-1 shadow-2xs"
              >
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span className="size-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span>{item.problem}</span>
                </div>
                <p className="text-stone-700 pl-6 leading-relaxed font-medium">{item.remedy}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Universal Lal Kitab Moral Ethics */}
        <div className="mt-8 rounded-2xl border border-stone-300 bg-stone-50/70 p-4 space-y-2">
          <h4 className="font-cinzel text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="size-3.5 text-amber-700" />
            <span>
              {lang === "bn"
                ? "লাল কিতাবের সর্বজনীন সদাচার ও নৈতিক অনুশাসন"
                : lang === "hi"
                ? "लाल किताब के सार्वभौमिक नैतिक नियम"
                : "Universal Lal Kitab Ethical Codes"}
            </span>
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-stone-600 list-disc list-inside">
            {report.general_precautions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>

        {/* -------------------- ROYAL SEAL & SIGNATURE FOOTER -------------------- */}
        <div className="mt-10 pt-6 border-t-2 border-amber-400 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* QR Code */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
            <div className="p-1.5 bg-white rounded-xl border border-amber-300 shadow-xs inline-block">
              {qrCodeUrl ? (
                <img
                  src={qrCodeUrl}
                  alt="Astra Verification QR Code"
                  className="size-24 rounded-lg object-contain"
                />
              ) : (
                <div className="size-24 bg-amber-50 flex items-center justify-center text-[10px] text-stone-400">
                  QR Loading...
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-amber-900">
              {lang === "bn" ? "স্ক্যান করে অনলাইনে সত্যতা যাচাই করুন" : lang === "hi" ? "स्कैन कर ऑनलाइन सत्यापन करें" : "Scan to verify online authenticity"}
            </p>
          </div>

          {/* Official Royal Seal */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="size-20 rounded-full border-4 border-double border-amber-600 bg-gradient-to-tr from-amber-400 via-amber-300 to-amber-500 shadow-md flex flex-col items-center justify-center p-1 text-amber-950">
              <span className="text-[8px] font-black uppercase tracking-widest">ASTRA SEAL</span>
              <span className="text-xl font-serif">ॐ</span>
              <span className="text-[7px] font-extrabold tracking-tighter">CONSECRATED</span>
            </div>
            <p className="font-serif font-black text-xs text-amber-950 mt-1">
              ASTRA DIVINE JYOTISH SANSTHAN
            </p>
            <p className="text-[9px] font-serif italic text-amber-800">
              "{report.digital_seal.seal_motto}"
            </p>
          </div>

          {/* Astrologer Signature */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
            <div className="border-b border-dashed border-amber-800 pb-1 w-44 text-center sm:text-right">
              <span className="font-serif italic font-bold text-base text-amber-950 tracking-wider">
                Acharya Radhakant
              </span>
            </div>
            <p className="text-[11px] font-black text-slate-800">
              {report.digital_seal.chief_astrologer}
            </p>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="size-2.5" />
              <span>{report.digital_seal.authenticity_hash}</span>
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-2.5 bg-amber-950 text-amber-200/80 text-[10px] text-center font-medium rounded-xl">
          {lang === "bn"
            ? `সনদটি আস্ট্রা অ্যাস্ট্রোলজি ভেরিফিকেশন ইঞ্জিন দ্বারা অনুমোদিত এবং এর সত্যতা অনলাইনে সংরক্ষিত। সর্বস্বত্ব সংরক্ষিত © ${new Date().getFullYear()} Astra Astrology Inc.`
            : lang === "hi"
            ? `यह प्रमाणपत्र अस्ट्रा ज्योतिष सत्यापन इंजन द्वारा प्रमाणित है। सर्वाधिकार सुरक्षित © ${new Date().getFullYear()} Astra Astrology Inc.`
            : `Consecrated by the Astra Astrology Verification Engine. All rights reserved © ${new Date().getFullYear()} Astra Astrology Inc.`}
        </div>
      </div>
    </div>
  );
}
