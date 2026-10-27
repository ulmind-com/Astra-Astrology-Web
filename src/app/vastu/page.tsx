"use client";

import { useEffect, useState } from "react";
import { vastuApi } from "@/lib/api";
import type { PadaInfo, VastuAuditResponse, VastuZoneInfo, VastuRemedyItem } from "@/types/vastu";
import { Compass, Sparkles, ShieldAlert, CheckCircle2, Home, Layers, Palette, Flame, Shield, ArrowUpRight } from "lucide-react";

export default function VastuPage() {
  const [entranceDegree, setEntranceDegree] = useState<number>(335.0);
  const [currentPada, setCurrentPada] = useState<PadaInfo | null>(null);
  const [propertyType, setPropertyType] = useState<"residential" | "commercial" | "industrial">("residential");
  const [activeTab, setActiveTab] = useState<"audit" | "compass" | "zones" | "remedies">("audit");

  // Placement selections
  const [placements, setPlacements] = useState<Record<string, string>>({
    kitchen: "SE",
    master_bed: "SW",
    toilet: "SSW",
    puja_room: "NE",
    underground_water: "N",
    overhead_tank: "W",
    locker: "N",
    staircase: "S",
  });

  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<VastuAuditResponse | null>(null);
  const [allZones, setAllZones] = useState<VastuZoneInfo[]>([]);
  const [allRemedies, setAllRemedies] = useState<VastuRemedyItem[]>([]);
  const [selectedRemedyCat, setSelectedRemedyCat] = useState<string>("all");

  // Fetch initial compass pada & zones
  useEffect(() => {
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
      if (res) setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  const ZONES_LIST = [
    { code: "N", label: "North (উত্তর)" },
    { code: "NNE", label: "NNE (উত্তর-উত্তর-পূর্ব)" },
    { code: "NE", label: "NE (উত্তর-পূর্ব / ঈশান)" },
    { code: "ENE", label: "ENE (পূর্ব-উত্তর-পূর্ব)" },
    { code: "E", label: "East (পূর্ব)" },
    { code: "ESE", label: "ESE (পূর্ব-দক্ষিণ-পূর্ব)" },
    { code: "SE", label: "SE (দক্ষিণ-পূর্ব / অগ্নি)" },
    { code: "SSE", label: "SSE (দক্ষিণ-দক্ষিণ-পূর্ব)" },
    { code: "S", label: "South (দক্ষিণ)" },
    { code: "SSW", label: "SSW (দক্ষিণ-দক্ষিণ-পশ্চিম)" },
    { code: "SW", label: "SW (দক্ষিণ-পশ্চিম / নৈঋত)" },
    { code: "WSW", label: "WSW (পশ্চিম-দক্ষিণ-পশ্চিম)" },
    { code: "W", label: "West (পশ্চিম)" },
    { code: "WNW", label: "WNW (পশ্চিম-উত্তর-পশ্চিম)" },
    { code: "NW", label: "NW (উত্তর-পশ্চিম / বায়ু)" },
    { code: "NNW", label: "NNW (উত্তর-উত্তর-পশ্চিম)" },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEDED] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#E5A93C]/10 via-amber-600/5 to-transparent blur-[140px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/20 text-[#E5A93C] text-xs font-medium tracking-wide">
            <Compass className="w-3.5 h-3.5" />
            ১৬-জোন ও ৩২-পদ বৈজ্ঞানিক বাস্তু ইঞ্জিন
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            16-Zone & 32-Pada Vastu Shastra
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
            ক্লায়েন্টের ৩৭৪ পৃষ্ঠার অথরিটেটিভ বাস্তু ম্যানুয়াল দ্বারা পরিচালিত কোণভিত্তিক ৩২-পদ এনার্জি গ্রিড, পঞ্চভূত ভারসাম্য, এবং ভাঙচুরবিহীন মেটাল স্ট্রিপ ও পিরামিড প্রতিকার।
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-zinc-800/80 pb-3">
          {[
            { id: "audit", label: "৩৬০° প্রপার্টি অডিট (Vastu Audit)", icon: Home },
            { id: "compass", label: "৩২-পদ কম্পাস হুইল (Compass Wheel)", icon: Compass },
            { id: "zones", label: "১৬টি দিক ও পঞ্চভূত জোন (16 Zones)", icon: Layers },
            { id: "remedies", label: "১২০ অলৌকিক প্রতিকার (Remedies)", icon: Flame },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#E5A93C] text-zinc-950 shadow-md shadow-[#E5A93C]/20"
                    : "bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Vastu Audit */}
        {activeTab === "audit" && (
          <div className="space-y-8">
            {/* Audit Input Form */}
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#E5A93C]" />
                    সম্পূর্ণ ভবনের কক্ষ ও পদ মূল্যায়ন
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    মূল প্রবেশদ্বারের কোণ ও কক্ষসমূহের বর্তমান অবস্থান নির্বাচন করে পূর্ণাঙ্গ রিপোর্ট জানুন।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">প্রপার্টি ধরন:</span>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as any)}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-white"
                  >
                    <option value="residential">আবাসিক (Residential)</option>
                    <option value="commercial">বাণিজ্যিক (Commercial)</option>
                    <option value="industrial">শিল্প কারখানা (Industrial)</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleAudit} className="space-y-6">
                {/* Entrance Angle Slider */}
                <div className="p-4 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                      মূল প্রবেশদ্বারের কোণ (Entrance Compass Degree): <span className="text-[#E5A93C] font-mono font-bold text-sm">{entranceDegree}°</span>
                    </label>
                    {currentPada && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        currentPada.is_auspicious ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {currentPada.pada_id} ({currentPada.deity}) — {currentPada.is_auspicious ? "শুভ (Golden Door)" : "প্রতিকূল (Challenge)"}
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
                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#E5A93C]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>0° (North N5)</span>
                    <span>90° (East E5)</span>
                    <span>180° (South S5)</span>
                    <span>270° (West W5)</span>
                    <span>359°</span>
                  </div>
                </div>

                {/* Rooms Matrix */}
                <div>
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                    কক্ষসমূহের বর্তমান অবস্থান (Room & Fixture Placements)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: "kitchen", label: "রান্নাঘর (Kitchen)" },
                      { id: "master_bed", label: "মাস্টার বেডরুম (Master Bed)" },
                      { id: "toilet", label: "টয়লেট / কমোড (Toilet)" },
                      { id: "puja_room", label: "পূজা ঘর / মন্দির (Puja)" },
                      { id: "underground_water", label: "আন্ডারগ্রাউন্ড ট্যাঙ্ক (Borewell)" },
                      { id: "overhead_tank", label: "ওভারহেড ট্যাঙ্ক (Overhead Tank)" },
                      { id: "locker", label: "টাকার সিন্দুক (Cash Locker)" },
                      { id: "staircase", label: "সিঁড়ি (Staircase)" },
                    ].map((item) => (
                      <div key={item.id} className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl space-y-1.5">
                        <label className="block text-xs font-medium text-zinc-300 truncate">{item.label}</label>
                        <select
                          value={placements[item.id] || "N"}
                          onChange={(e) => setPlacements({ ...placements, [item.id]: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E5A93C]"
                        >
                          {ZONES_LIST.map((z) => (
                            <option key={z.code} value={z.code}>{z.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={auditLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-zinc-950 font-bold rounded-xl text-sm shadow-lg shadow-[#E5A93C]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {auditLoading ? (
                    <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      বাস্তু অডিট রিপোর্ট তৈরি করুন (Generate Full Audit)
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Audit Results */}
            {auditResult && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Score & Summary Banner */}
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="inline-block px-3 py-1 bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-bold rounded-full">
                      গ্রেড: {auditResult.grade}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                      বাস্তু সঙ্গতি স্কোর: {auditResult.overall_score}%
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed">
                      {auditResult.summary_bn}
                    </p>
                  </div>

                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="10" className="text-zinc-800" fill="transparent" />
                      <circle
                        cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="10"
                        className={auditResult.overall_score >= 80 ? "text-emerald-400" : auditResult.overall_score >= 60 ? "text-[#E5A93C]" : "text-red-400"}
                        strokeDasharray={339.29}
                        strokeDashoffset={339.29 - (339.29 * auditResult.overall_score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-serif font-black text-white">{auditResult.overall_score}</span>
                      <span className="text-[10px] text-zinc-400">/১০০</span>
                    </div>
                  </div>
                </div>

                {/* Critical Warnings */}
                {auditResult.warnings_critical.length > 0 && (
                  <div className="p-5 bg-red-950/30 border border-red-800/50 rounded-2xl space-y-2">
                    <div className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      গুরুতর বাস্তু ত্রুটি চিহ্নিত হয়েছে ({auditResult.warnings_critical.length}টি)
                    </div>
                    <ul className="space-y-1.5 text-xs text-red-200">
                      {auditResult.warnings_critical.map((w, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-400 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Room by Room Breakdown */}
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E5A93C]" />
                    কক্ষভিত্তিক মূল্যায়ন ও নন-ডিমোলিশন রেমেডি
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {auditResult.evaluations.map((ev) => (
                      <div key={ev.category_id} className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{ev.category_name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ev.rating === "Excellent"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : ev.rating === "Good"
                              ? "bg-sky-500/20 text-sky-300"
                              : ev.rating === "Acceptable"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-red-500/20 text-red-300"
                          }`}>
                            {ev.rating} ({ev.score}%)
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 font-medium">
                          অবস্থান: <span className="text-zinc-200">{ev.placed_zone} জোন</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed">{ev.impact_bn}</p>

                        {ev.remedy_bn && (
                          <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-amber-200 space-y-1">
                            <div><span className="font-bold text-[#E5A93C]">প্রতিকার:</span> {ev.remedy_bn}</div>
                            {ev.metal_strip_blocking && (
                              <div className="text-emerald-400 font-medium">
                                মেটাল স্ট্রিপ: {ev.metal_strip_blocking}
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

        {/* Tab 2: 32 Padas Visualizer */}
        {activeTab === "compass" && (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-xl font-serif font-bold text-white flex items-center justify-center gap-2">
                <Compass className="w-5 h-5 text-[#E5A93C]" />
                ৩২-পদ বৈদিক প্রবেশদ্বার কম্পাস (32 Pada Chakra)
              </h3>
              <p className="text-xs text-zinc-400">
                বৃত্তাকার ৩৬০° পরিসীমা প্রতিটি ১১.২৫° কোণের ৩২টি পদে বিভক্ত। যার মধ্যে ৮টি পদ স্বর্ণদ্বার (Golden Doors)।
              </p>
            </div>

            {/* Quick Degree Input */}
            <div className="max-w-md mx-auto p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">ডিগ্রি পরিবর্তন করুন:</span>
                <span className="font-mono font-bold text-[#E5A93C] text-sm">{entranceDegree}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359.9"
                step="0.5"
                value={entranceDegree}
                onChange={(e) => handleDegreeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#E5A93C]"
              />
            </div>

            {currentPada && (
              <div className="max-w-xl mx-auto p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-3 shadow-xl">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  currentPada.is_auspicious ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {currentPada.is_auspicious ? "শুভ প্রবেশদ্বার (Golden Door)" : "প্রতিকূল প্রবেশদ্বার"}
                </span>
                <h4 className="text-2xl font-serif font-black text-white">
                  পদ {currentPada.pada_id} — {currentPada.deity}
                </h4>
                <div className="text-xs font-mono text-zinc-400">
                  কোণ ব্যাপ্তি: {currentPada.start_degree}° থেকে {currentPada.end_degree}° (কেন্দ্র: {currentPada.center_degree}°)
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">{currentPada.life_effects}</p>
                <div className="text-xs text-amber-300 font-medium">চ্যালেঞ্জ: {currentPada.challenge}</div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 16 Zones Directory */}
        {activeTab === "zones" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allZones.map((z) => (
              <div key={z.zone_code} className="p-5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-serif font-bold text-white">{z.zone_code}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">{z.center_degree}°</span>
                </div>
                <div className="text-xs font-bold text-[#E5A93C]">{z.zone_name_bn}</div>
                <div className="text-xs text-zinc-400">{z.element_bn} • {z.dosha}</div>
                <div className="text-[11px] text-zinc-300">
                  <span className="font-semibold text-zinc-400">শারীরিক অঙ্গ:</span> {z.body_organs}
                </div>
                <div className="text-[11px] text-zinc-300">
                  <span className="font-semibold text-zinc-400">জীবন ক্ষেত্র:</span> {z.life_aspect}
                </div>
                <div className="pt-2 border-t border-zinc-800/80 text-[10px] space-y-1">
                  <div className="text-emerald-400 truncate">শুভ রঙ: {z.self_colors.join(", ")}</div>
                  <div className="text-red-400 truncate">বর্জনীয় রঙ: {z.destructive_colors.join(", ")}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: 120 Remedies Catalog */}
        {activeTab === "remedies" && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {["all", "Financial Growth", "Health & Vitality", "Brand & Fame", "Social Ties", "Opportunities"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedRemedyCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedRemedyCat === cat ? "bg-[#E5A93C] text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat === "all" ? "সকল প্রতিকার" : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRemedies
                .filter((r) => selectedRemedyCat === "all" || r.category === selectedRemedyCat)
                .map((rem) => (
                  <div key={rem.remedy_id} className="p-5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-[#E5A93C]/10 text-[#E5A93C] font-bold border border-[#E5A93C]/20">
                        {rem.category}
                      </span>
                      <span className="font-bold text-zinc-400">{rem.target_zone} জোন</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{rem.title_bn}</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">{rem.action_bn}</p>
                    <div className="text-[11px] text-amber-300 font-medium pt-2 border-t border-zinc-800">
                      প্রয়োজনীয় সামগ্রী: {rem.item_required}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
