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
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { vastuApi } from "@/lib/api";
import type { PadaInfo, VastuAuditResponse, VastuZoneInfo, VastuRemedyItem } from "@/types/vastu";
import type { AstrologyLanguage } from "@/types";

export default function VastuPage() {
  const [language, setLanguage] = React.useState<AstrologyLanguage>("bn");
  const [entranceDegree, setEntranceDegree] = React.useState<number>(335.0);
  const [currentPada, setCurrentPada] = React.useState<PadaInfo | null>(null);
  const [propertyType, setPropertyType] = React.useState<"residential" | "commercial" | "industrial">("residential");
  const [activeTab, setActiveTab] = React.useState<"audit" | "compass" | "zones" | "remedies">("audit");

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
    setAuditLoading(true);
    try {
      const res = await vastuApi.audit({
        property_type: propertyType,
        main_entrance_degree: entranceDegree,
        placements,
      });
      if (res) {
        setAuditResult(res);
        toast.success(
          language === "bn"
            ? "৩৬০° বাস্তু অডিট রিপোর্ট সফলভাবে তৈরি হয়েছে!"
            : language === "hi"
            ? "360° वास्तु ऑडिट रिपोर्ट सफलतापूर्वक तैयार हुई!"
            : "360° Vastu audit report generated successfully!"
        );
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate Vastu audit.");
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
            <span>
              {language === "bn"
                ? "বৈজ্ঞানিক বাস্তু শাস্ত্র (১৬টি জোন ও ৩২টি পদ চক্র)"
                : language === "hi"
                ? "वैज्ञानिक वास्तु शास्त्र (16 ज़ोन एवं 32 पद चक्र)"
                : "Scientific Vastu Shastra (16 Zones & 32 Padas)"}
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {language === "bn"
              ? "১৬-জোন পঞ্চভূত ভারসাম্য ও ভাঙচুরবিহীন মেটাল প্রতিকার"
              : language === "hi"
              ? "16-ज़ोन पंचतत्व संतुलन एवं बिना तोड़-फोड़ धातु पट्टी उपचार"
              : "16-Zone Panchabhuta Energy & Non-Demolition Remedies"}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            {language === "bn"
              ? "অথরিটেটিভ ৩৭৪ পৃষ্ঠার ক্লায়েন্ট ম্যানুয়াল দ্বারা পরিচালিত কোণভিত্তিক ৩২-পদ এনার্জি গ্রিড, স্বর্ণদ্বার এন্ট্রান্স, পঞ্চভূত দোষ শোধন এবং ১২০টি অলৌকিক বাস্তু প্রতিকার।"
              : language === "hi"
              ? "प्रमाणित 374 पृष्ठों की वास्तु नियमावली द्वारा संचालित कोण-आधारित 32 पद ऊर्जा चक्र, स्वर्णिम द्वार, पंचतत्व विश्लेषण एवं बिना तोड़-फोड़ उपचार।"
              : "Authoritative 374-page Vedic manual-driven 32-pada energy grid, 8 golden entrance doors, 16 directional zones with elemental balance, and 120 miraculous non-demolition remedies."}
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
        </div>

        {/* =========================================================================
            NAVIGATION TABS
        ========================================================================= */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-border/60 pb-3">
          {[
            {
              id: "audit",
              label:
                language === "bn"
                  ? "৩৬০° প্রপার্টি অডিট"
                  : language === "hi"
                  ? "360° प्रॉपर्टी ऑडिट"
                  : "360° Property Audit",
              icon: Home,
            },
            {
              id: "compass",
              label:
                language === "bn"
                  ? "৩২-পদ কম্পাস হুইল"
                  : language === "hi"
                  ? "32-पद कम्पास चक्र"
                  : "32-Pada Compass",
              icon: Compass,
            },
            {
              id: "zones",
              label:
                language === "bn"
                  ? "১৬টি দিক ও পঞ্চভূত জোন"
                  : language === "hi"
                  ? "16 दिशाएं व पंचतत्व"
                  : "16 Elemental Zones",
              icon: Layers,
            },
            {
              id: "remedies",
              label:
                language === "bn"
                  ? "১২০ অলৌকিক প্রতিকার"
                  : language === "hi"
                  ? "120 अचूक उपाय"
                  : "120 Miraculous Remedies",
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
                    {language === "bn"
                      ? "ভবনের মূল প্রবেশদ্বার ও কক্ষ মূল্যায়ন"
                      : language === "hi"
                      ? "भवन का मुख्य प्रवेश द्वार एवं कक्ष मूल्यांकन"
                      : "Property Entrance & Room Alignment Audit"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "bn"
                      ? "মূল প্রবেশদ্বারের নিখুঁত কোণ ও কক্ষসমূহের জোন নির্বাচন করে পূর্ণাঙ্গ বাস্তু স্কোর জানুন।"
                      : language === "hi"
                      ? "मुख्य प्रवेश द्वार का सटीक कोण और कमरों का क्षेत्र चुनकर संपूर्ण वास्तु स्कोर जानें।"
                      : "Set exact entrance compass degree and room positions for a comprehensive Vedic compliance audit."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {language === "bn" ? "প্রপার্টির ধরন:" : language === "hi" ? "प्रॉपर्टी का प्रकार:" : "Property Type:"}
                  </span>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="bg-surface border border-input rounded-lg px-2.5 py-1 text-xs text-foreground font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <option value="residential">
                      {language === "bn" ? "আবাসিক (Residential)" : language === "hi" ? "आवासीय (Residential)" : "Residential"}
                    </option>
                    <option value="commercial">
                      {language === "bn" ? "বাণিজ্যিক (Commercial)" : language === "hi" ? "व्यावसायिक (Commercial)" : "Commercial"}
                    </option>
                    <option value="industrial">
                      {language === "bn" ? "শিল্প কারখানা (Industrial)" : language === "hi" ? "औद्योगिक (Industrial)" : "Industrial"}
                    </option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleAudit} className="space-y-6">
                {/* Entrance Angle Slider */}
                <div className="p-4 bg-surface rounded-xl border border-border/80 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {language === "bn"
                        ? "মূল প্রবেশদ্বারের কম্পাস কোণ:"
                        : language === "hi"
                        ? "मुख्य प्रवेश द्वार कम्पास कोण:"
                        : "Main Entrance Compass Angle:"}{" "}
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
                        {currentPada.is_auspicious
                          ? language === "bn"
                            ? "স্বর্ণদ্বার (Golden Door)"
                            : language === "hi"
                            ? "स्वर्णिम द्वार (शुभ)"
                            : "Auspicious Golden Door"
                          : language === "bn"
                          ? "প্রতিকূল (Needs Remedy)"
                          : language === "hi"
                          ? "अशुभ (उपाय आवश्यक)"
                          : "Needs Remedy"}
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
                    {language === "bn"
                      ? "কক্ষ ও কাঠামোর বর্তমান জোন অবস্থান (Room & Fixture Positions)"
                      : language === "hi"
                      ? "कमरों एवं संरचनाओं की वर्तमान स्थिति (Room Placements)"
                      : "Room & Structure Zone Positions"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        id: "kitchen",
                        label: language === "bn" ? "রান্নাঘর (Kitchen)" : language === "hi" ? "रसोई घर (Kitchen)" : "Kitchen",
                      },
                      {
                        id: "master_bed",
                        label:
                          language === "bn"
                            ? "মাস্টার বেডরুম (Master Bed)"
                            : language === "hi"
                            ? "मुख्य शयनकक्ष (Master Bed)"
                            : "Master Bedroom",
                      },
                      {
                        id: "toilet",
                        label:
                          language === "bn"
                            ? "টয়লেট / কমোড (Toilet)"
                            : language === "hi"
                            ? "शौचालय (Toilet)"
                            : "Toilet / Commode",
                      },
                      {
                        id: "puja_room",
                        label:
                          language === "bn"
                            ? "পূজা ঘর / মন্দির (Puja)"
                            : language === "hi"
                            ? "पूजा घर / मंदिर (Temple)"
                            : "Puja Room / Temple",
                      },
                      {
                        id: "underground_water",
                        label:
                          language === "bn"
                            ? "আন্ডারগ্রাউন্ড ট্যাঙ্ক (Borewell)"
                            : language === "hi"
                            ? "भूमिगत जल स्रोत (Borewell)"
                            : "Underground Borewell",
                      },
                      {
                        id: "overhead_tank",
                        label:
                          language === "bn"
                            ? "ওভারহেড ট্যাঙ্ক (Overhead Tank)"
                            : language === "hi"
                            ? "छत पर पानी की टंकी"
                            : "Overhead Water Tank",
                      },
                      {
                        id: "locker",
                        label:
                          language === "bn"
                            ? "টাকার সিন্দুক (Cash Locker)"
                            : language === "hi"
                            ? "तिजोरी / लॉकर (Cash Locker)"
                            : "Cash Locker / Safe",
                      },
                      {
                        id: "staircase",
                        label:
                          language === "bn" ? "সিঁড়ি (Staircase)" : language === "hi" ? "सीढ़ियाँ (Staircase)" : "Staircase",
                      },
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
                      <span>
                        {language === "bn"
                          ? "বাস্তু অডিট রিপোর্ট তৈরি করুন (Generate Full Audit)"
                          : language === "hi"
                          ? "वास्तु ऑडिट रिपोर्ट तैयार करें (Generate Full Audit)"
                          : "Generate Complete 360° Vastu Audit"}
                      </span>
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
                      {language === "bn" ? `গ্রেড: ${auditResult.grade}` : `Grade: ${auditResult.grade}`}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                      {language === "bn"
                        ? `বাস্তু সঙ্গতি স্কোর: ${auditResult.overall_score}%`
                        : language === "hi"
                        ? `वास्तु अनुकूलता स्कोर: ${auditResult.overall_score}%`
                        : `Vastu Harmony Score: ${auditResult.overall_score}%`}
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
                      {language === "bn"
                        ? `গুরুতর বাস্তু ত্রুটি চিহ্নিত হয়েছে (${auditResult.warnings_critical.length}টি)`
                        : language === "hi"
                        ? `गंभीर वास्तु दोष पाए गए (${auditResult.warnings_critical.length})`
                        : `Critical Vastu Flaws Identified (${auditResult.warnings_critical.length})`}
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
                    {language === "bn"
                      ? "কক্ষভিত্তিক মূল্যায়ন ও ভাঙচুরবিহীন রেমেডি"
                      : language === "hi"
                      ? "कक्ष-वार मूल्यांकन एवं धातु पट्टी उपचार"
                      : "Zone Evaluation & Non-Demolition Metal Strip Remedies"}
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
                          {language === "bn"
                            ? `অবস্থান: ${ev.placed_zone} জোন`
                            : language === "hi"
                            ? `स्थिति: ${ev.placed_zone} क्षेत्र`
                            : `Zone: ${ev.placed_zone}`}
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed">{ev.impact_bn}</p>

                        {ev.remedy_bn && (
                          <div className="pt-2 border-t border-border/80 text-[11px] space-y-1">
                            <div>
                              <span className="font-bold text-amber-600 dark:text-amber-400">
                                {language === "bn" ? "প্রতিকার:" : language === "hi" ? "उपाय:" : "Remedy:"}
                              </span>{" "}
                              <span className="text-foreground/90">{ev.remedy_bn}</span>
                            </div>
                            {ev.metal_strip_blocking && (
                              <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                                {language === "bn"
                                  ? `মেটাল স্ট্রিপ ব্লক: ${ev.metal_strip_blocking}`
                                  : `Metal Strip Blocking: ${ev.metal_strip_blocking}`}
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
          <div className="card-surface rounded-2xl border border-border/80 p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xl font-serif font-bold text-foreground flex items-center justify-center gap-2">
                <Compass className="size-5 text-amber-500" />
                {language === "bn"
                  ? "৩২-পদ বৈদিক প্রবেশদ্বার কম্পাস (32 Pada Chakra)"
                  : language === "hi"
                  ? "32-पद वैदिक प्रवेश द्वार कम्पास (32 Pada Chakra)"
                  : "32-Pada Vedic Entrance Compass Chakra"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === "bn"
                  ? "বৃত্তাকার ৩৬০° পরিসীমা প্রতিটি ১১.২৫° কোণের ৩২টি পদে বিভক্ত। যার মধ্যে ৮টি পদ স্বর্ণদ্বার (Golden Doors)।"
                  : language === "hi"
                  ? "360° की परिधि 11.25° के 32 पदों में विभाजित है, जिनमें से 8 स्वर्णिम द्वार (शुभ) हैं।"
                  : "The 360° compass circle is divided into 32 padas (11.25° each), featuring 8 Golden Doors for immense wealth."}
              </p>
            </div>

            {/* Quick Degree Input */}
            <div className="max-w-md mx-auto p-4 bg-surface rounded-xl border border-border/80 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">
                  {language === "bn" ? "ডিগ্রি পরিবর্তন করুন:" : "Adjust Degree Angle:"}
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                  {entranceDegree.toFixed(1)}°
                </span>
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
            </div>

            {currentPada && (
              <div className="max-w-xl mx-auto p-6 bg-surface border border-border/80 rounded-2xl text-center space-y-3 shadow-sm">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                    currentPada.is_auspicious
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30"
                  }`}
                >
                  {currentPada.is_auspicious
                    ? language === "bn"
                      ? "শুভ প্রবেশদ্বার (Golden Door)"
                      : language === "hi"
                      ? "स्वर्णिम द्वार (अति शुभ)"
                      : "Auspicious Golden Door"
                    : language === "bn"
                    ? "প্রতিকূল প্রবেশদ্বার (Challenge Door)"
                    : language === "hi"
                    ? "चुनौतीपूर्ण द्वार"
                    : "Challenging Door"}
                </span>

                <h4 className="text-2xl font-serif font-black text-foreground">
                  {language === "bn"
                    ? `পদ ${currentPada.pada_id} — ${currentPada.deity}`
                    : `Pada ${currentPada.pada_id} — ${currentPada.deity}`}
                </h4>

                <div className="text-xs font-mono text-muted-foreground">
                  {language === "bn"
                    ? `কোণ ব্যাপ্তি: ${currentPada.start_degree}° থেকে ${currentPada.end_degree}° (কেন্দ্র: ${currentPada.center_degree}°)`
                    : `Degree Range: ${currentPada.start_degree}° to ${currentPada.end_degree}° (Center: ${currentPada.center_degree}°)`}
                </div>

                <p className="text-xs text-foreground/80 leading-relaxed">{currentPada.life_effects}</p>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  {language === "bn" ? "চ্যালেঞ্জ:" : "Challenge:"} {currentPada.challenge}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: 16 DIRECTIONAL ZONES
        ========================================================================= */}
        {activeTab === "zones" && (
          <div className="space-y-4">
            <div className="text-center max-w-xl mx-auto space-y-1 mb-2">
              <h3 className="text-xl font-serif font-bold text-foreground">
                {language === "bn"
                  ? "১৬টি দিক ও পঞ্চভূত ভারসাম্য জোন"
                  : language === "hi"
                  ? "16 दिशाएं एवं पंचतत्व संतुलन"
                  : "16 Directional Energy Zones"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {language === "bn"
                  ? "প্রত্যেকটি জোনের নিয়ন্ত্রক দেবতা, তত্ত্ব, শুভ-অশুভ রঙ ও শারীরিক অঙ্গ।"
                  : "Elemental rulers, body organ associations, and auspicious colors for all 16 zones."}
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
                      {language === "bn" ? "শারীরিক অঙ্গ:" : "Organ:"}
                    </span>{" "}
                    {z.body_organs}
                  </div>
                  <div className="text-[11px] text-foreground/80">
                    <span className="font-semibold text-muted-foreground">
                      {language === "bn" ? "জীবন ক্ষেত্র:" : "Aspect:"}
                    </span>{" "}
                    {z.life_aspect}
                  </div>
                  <div className="pt-2 border-t border-border/80 text-[10px] space-y-1">
                    <div className="text-emerald-600 dark:text-emerald-400 truncate">
                      {language === "bn" ? "শুভ রঙ:" : "Colors:"} {z.self_colors.join(", ")}
                    </div>
                    <div className="text-red-500 truncate">
                      {language === "bn" ? "বর্জনীয় রঙ:" : "Avoid:"} {z.destructive_colors.join(", ")}
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
                { id: "all", bn: "সকল প্রতিকার", en: "All Remedies" },
                { id: "Financial Growth", bn: "আর্থিক সমৃদ্ধি", en: "Financial Growth" },
                { id: "Health & Vitality", bn: "স্বাস্থ্য ও আরোগ্য", en: "Health & Vitality" },
                { id: "Brand & Fame", bn: "যশ ও পরিচিতি", en: "Brand & Fame" },
                { id: "Social Ties", bn: "সামাজিক সংযোগ", en: "Social Ties" },
                { id: "Opportunities", bn: "নতুন সুযোগ", en: "Opportunities" },
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
                  {language === "bn" ? cat.bn : cat.en}
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
                      <span className="font-bold text-muted-foreground">{rem.target_zone} জোন</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{rem.title_bn}</h4>
                    <p className="text-xs text-foreground/80 leading-relaxed">{rem.action_bn}</p>
                    <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium pt-2 border-t border-border/80">
                      {language === "bn" ? "প্রয়োজনীয় সামগ্রী:" : "Required Item:"} {rem.item_required}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
