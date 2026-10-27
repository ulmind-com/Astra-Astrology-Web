"use client";

import { useState } from "react";
import { numerologyApi } from "@/lib/api";
import type { NumerologyCalculateResponse } from "@/types/numerology";
import { Sparkles, Hash, ShieldAlert, Award, Compass, Phone, UserCheck, Flame, BookOpen, Layers } from "lucide-react";

export default function NumerologyPage() {
  const [fullName, setFullName] = useState("Samiran Sasmal");
  const [birthDate, setBirthDate] = useState("1995-10-25");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [predictionYear, setPredictionYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NumerologyCalculateResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"loshu" | "dasha" | "name" | "mobile" | "remedies">("loshu");

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await numerologyApi.calculate({
        full_name: fullName,
        birth_date: birthDate,
        gender,
        mobile_number: mobileNumber.trim() ? mobileNumber : undefined,
        prediction_year: predictionYear || undefined,
      });
      if (res) {
        setData(res);
      } else {
        setError("নিউমারোলজি গণনা সম্পন্ন করা যায়নি। অনুগ্রহ করে তথ্য পুনরায় পরীক্ষা করুন।");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "সার্ভার সংযোগে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#EDEDED] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#E5A93C]/10 via-[#F59E0B]/5 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/20 text-[#E5A93C] text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            বৈদিক ও চ্যালডিয়ান নিউমারোলজি ইঞ্জিন
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
            Vedic Lo Shu & Name Numerology
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-400">
            ১০০% অথরিটেটিভ ক্লায়েন্ট রিসোর্স দ্বারা পরিচালিত বৈদিক ৩×৩ লো-শু গ্রিড, রাজযোগ, সংখ্যা দশা, চ্যালডিয়ান নামের স্পন্দন এবং মোবাইল কনজাংশন অডিট।
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5A93C]/5 rounded-bl-full pointer-events-none" />
          <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                পূর্ণ নাম (Full Name)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5A93C] transition-colors"
                placeholder="যেমন: Samiran Sasmal"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                জন্মতারিখ (Birth Date)
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5A93C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                লিঙ্গ (Gender)
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as "male" | "female" | "other")}
                className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5A93C] transition-colors"
              >
                <option value="male">পুরুষ (Male)</option>
                <option value="female">মহিলা (Female)</option>
                <option value="other">অন্যান্য (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                মোবাইল নম্বর (ঐচ্ছিক)
              </label>
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5A93C] transition-colors"
                placeholder="১০ ডিজিট নম্বর"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] text-zinc-950 font-bold rounded-xl text-sm shadow-lg shadow-[#E5A93C]/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    গণনা করুন
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results Section */}
        {data && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#E5A93C]/40 transition-colors">
                <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">মূলাঙ্ক (Driver)</div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-[#E5A93C] mt-2">
                  {data.mulank.number}
                </div>
                <div className="text-xs text-zinc-300 mt-1 font-medium">{data.mulank.planet}</div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#E5A93C]/40 transition-colors">
                <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">ভাগ্যাঙ্ক (Destiny)</div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-amber-300 mt-2">
                  {data.bhagyank.number}
                </div>
                <div className="text-xs text-zinc-300 mt-1 font-medium">{data.bhagyank.planet}</div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#E5A93C]/40 transition-colors">
                <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">কুয়া সংখ্যা (Kua)</div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-sky-400 mt-2">
                  {data.kua_number}
                </div>
                <div className="text-xs text-zinc-300 mt-1 font-medium">ব্যক্তিগত শক্তি কম্পন</div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-[#E5A93C]/40 transition-colors">
                <div className="text-xs text-zinc-400 uppercase font-semibold tracking-wider">ব্যক্তিগত বছর (Year)</div>
                <div className="text-3xl sm:text-4xl font-serif font-bold text-emerald-400 mt-2">
                  {data.year_prediction_number}
                </div>
                <div className="text-xs text-zinc-300 mt-1 font-medium">{data.year_prediction_summary.slice(0, 20)}...</div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-zinc-800/80 pb-3">
              {[
                { id: "loshu", label: "বৈদিক লো-শু গ্রিড ও যোগ", icon: Layers },
                { id: "dasha", label: "সংখ্যা দশা টাইমলাইন", icon: Compass },
                { id: "name", label: "চ্যালডিয়ান নাম বিশ্লেষণ", icon: UserCheck },
                { id: "mobile", label: "মোবাইল কনজাংশন অডিট", icon: Phone },
                { id: "remedies", label: "অনুপস্থিত সংখ্যা ও প্রতিকার", icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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

            {/* Tab 1: Lo Shu Grid & Planes */}
            {activeTab === "loshu" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 3x3 Lo Shu Grid */}
                <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                      <Hash className="w-4 h-4 text-[#E5A93C]" />
                      বৈদিক ৩×৩ লো-শু গ্রিড (Vedic Sepharial Grid)
                    </h3>
                    <span className="text-xs text-zinc-400">৩-১-৯ / ৬-৭-৫ / ২-৮-৪</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-2 bg-zinc-950/60 rounded-xl border border-zinc-800">
                    {data.lo_shu_grid.map((cell) => (
                      <div
                        key={cell.digit}
                        className={`aspect-square rounded-xl p-3 flex flex-col justify-between border transition-all ${
                          cell.count > 0
                            ? "bg-[#E5A93C]/10 border-[#E5A93C]/40 shadow-inner shadow-[#E5A93C]/10"
                            : "bg-zinc-900/30 border-zinc-800/40 opacity-40"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-xl sm:text-2xl font-serif font-black text-white">
                            {cell.digit}
                          </span>
                          {cell.count > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E5A93C] text-zinc-950">
                              {cell.count}x
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          {cell.element} • {cell.direction}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Raj Yogas */}
                  <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                    <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#E5A93C]" />
                      সক্রিয় রাজযোগ (Special Raj Yogas)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.raj_yogas.map((yoga) => (
                        <div
                          key={yoga.name}
                          className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                            yoga.is_active
                              ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                              : "bg-zinc-950/40 border-zinc-800/40 text-zinc-500"
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span>{yoga.name}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] ${yoga.is_active ? "bg-amber-400 text-zinc-950 font-bold" : "bg-zinc-800 text-zinc-400"}`}>
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
                <div className="lg:col-span-6 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 space-y-5">
                  <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E5A93C]" />
                    লো-শু সমতল ও স্তম্ভ (Planes of Will & Action)
                  </h3>

                  <div className="space-y-4">
                    {data.planes.map((plane) => (
                      <div key={plane.name} className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/60 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-zinc-200">{plane.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            plane.status === "Complete"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : plane.status === "Partial"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-zinc-800 text-zinc-400"
                          }`}>
                            {plane.status} ({plane.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              plane.percentage === 100
                                ? "bg-emerald-400"
                                : plane.percentage >= 50
                                ? "bg-[#E5A93C]"
                                : "bg-zinc-600"
                            }`}
                            style={{ width: `${plane.percentage}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-zinc-400">{plane.significance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Dasha Timeline */}
            {activeTab === "dasha" && (
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#E5A93C]" />
                      বৈদিক সংখ্যা দশা সময়কাল (Vedic Numerology Dasha Hierarchy)
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      ক্লায়েন্টের /৪৫ সূত্র অনুযায়ী মহাদশা (MD), অন্তর্দশা (AD) এবং প্রত্যন্তর্দশা (PD)-র নিখুঁত গণনা।
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {data.dasha_timeline.map((period, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 bg-zinc-950/70 border border-zinc-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[#E5A93C] text-xs font-bold rounded-md">
                            {period.level}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {period.planet} (সংখ্যা {period.number})
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            period.friendship_score === "Favorable"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : period.friendship_score === "Unfavorable"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-zinc-800 text-zinc-300"
                          }`}>
                            {period.friendship_score}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400">{period.guidance}</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-xs font-mono text-zinc-300 font-semibold">
                          {period.start_date} <span className="text-zinc-600">থেকে</span> {period.end_date}
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          স্থায়িত্ব: {period.duration_days} দিন
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Name Numerology */}
            {activeTab === "name" && (
              <div className="space-y-6">
                <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
                    <div>
                      <div className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                        চ্যালডিয়ান নাম বিশ্লেষণ (Chaldean Compound Name)
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-white mt-1">
                        {data.name_analysis.full_name}
                      </h3>
                      <p className="text-xs text-amber-300 font-medium mt-1">
                        কম্পাউন্ড সংখ্যা: {data.name_analysis.compound_number} (একক সংখ্যা: {data.name_analysis.single_number}) — {data.name_analysis.compound_name}
                      </p>
                    </div>

                    <div className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-right">
                      <div className="text-xs text-zinc-400">সামগ্রিক রায়</div>
                      <div className="text-sm font-bold text-emerald-400">{data.name_analysis.overall_name_verdict}</div>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60">
                    {data.name_analysis.compound_description}
                  </p>

                  {/* Syllable Alert */}
                  {data.name_analysis.negative_syllables_found.length > 0 && (
                    <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-xs text-red-200 flex items-start gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-300">সতর্কতা: ক্ষতিকর সিলেবল চিহ্নিত হয়েছে!</div>
                        <p className="mt-1">
                          নামের মধ্যে ক্ষতিকর ধ্বনি ({data.name_analysis.negative_syllables_found.join(", ")}) রয়েছে, যা ক্লায়েন্ট ডকুমেন্ট অনুযায়ী শুভ কম্পাউন্ডকেও ক্ষতিগ্রস্ত করে।
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Letter Vibrations */}
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                      বর্ণভিত্তিক চ্যালডিয়ান স্পন্দন (Letter Sound Vibrations)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                      {data.name_analysis.letters.map((ltr, idx) => (
                        <div key={idx} className="p-3 bg-zinc-950/60 border border-zinc-800/70 rounded-xl text-center space-y-1">
                          <div className="text-lg font-serif font-black text-[#E5A93C]">{ltr.letter}</div>
                          <div className="text-xs font-semibold text-zinc-200">মান: {ltr.value}</div>
                          <div className="text-[10px] text-zinc-400 truncate">{ltr.sound_element}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                    <span className="font-bold">পরামর্শ: </span>
                    {data.name_analysis.recommendation}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Mobile Numerology */}
            {activeTab === "mobile" && data.mobile_analysis && (
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
                  <div>
                    <div className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">
                      মোবাইল নম্বর অডিট (Mobile Number Numerology)
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mt-1">
                      {data.mobile_analysis.mobile_number}
                    </h3>
                    <p className="text-xs text-amber-300 mt-1">
                      যোগফল: {data.mobile_analysis.total_sum} (একক সংখ্যা: {data.mobile_analysis.single_digit}) • {data.mobile_analysis.compound_quality}
                    </p>
                  </div>

                  <div className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-right">
                    <div className="text-xs text-zinc-400">অডিট রায়</div>
                    <div className="text-sm font-bold text-emerald-400">{data.mobile_analysis.overall_verdict}</div>
                  </div>
                </div>

                {/* Consecutive Conjunction Pairs */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E5A93C]" />
                      ক্রমান্বয়ে ২-সংখ্যার জোড়া (৬০% / ৪০% আধিপত্য সূত্র)
                    </h4>
                    <span className="text-[11px] text-zinc-400">১ম ডিজিট ৬০% • ২য় ডিজিট ৪০%</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {data.mobile_analysis.conjunction_pairs.map((p, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                          p.category === "Good"
                            ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                            : p.category === "Malefic"
                            ? "bg-red-950/20 border-red-500/40 text-red-200"
                            : "bg-zinc-950/40 border-zinc-800/60 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-sm font-serif">{p.pair} জোড়া</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            p.category === "Good" ? "bg-emerald-500 text-zinc-950" : p.category === "Malefic" ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-300"
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
                    <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                      মোবাইল গ্রিডের এল-শেপ (Sepharial 3x3 L-Shapes)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.mobile_analysis.l_shapes_formed.map((l, idx) => (
                        <div key={idx} className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl text-xs space-y-1">
                          <div className="font-bold text-amber-300">L-Shape: {l.shape_code}</div>
                          <p className="text-[11px] text-zinc-400">{l.meaning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Missing Numbers & Remedies */}
            {activeTab === "remedies" && (
              <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#E5A93C]" />
                  অনুপস্থিত সংখ্যার প্রতিকার (Missing Numbers & Vedic Remedies)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.missing_numbers_remedies.map((rem) => (
                    <div key={rem.digit} className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-serif font-black text-red-400">অনুপস্থিত {rem.digit}</span>
                        <span className="text-xs text-zinc-400">{rem.element}</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-medium">প্রভাব: {rem.impact}</p>
                      <div className="p-2.5 bg-zinc-900/60 rounded-lg text-xs text-amber-200 border border-zinc-800 space-y-1">
                        <div><span className="font-bold">উপায়:</span> {rem.remedy}</div>
                        <div className="text-[11px] text-zinc-400">রুদ্রাক্ষ: {rem.rudraksha} • ক্রিস্টাল: {rem.crystal}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
