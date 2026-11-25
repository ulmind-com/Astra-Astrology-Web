"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { DivinLinkQrBadge } from "@/components/ui/divinlink-qr-card";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Printer,
  Copy,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  Award,
  RotateCcw,
  AlertCircle,
  User,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { astrologyApi, type AnnualReportVerificationData } from "@/lib/api";

export default function AnnualReportVerificationPage() {
  const params = useParams();
  const reportId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const pageUrl = React.useSyncExternalStore(
    () => () => {},
    () => window.location.href,
    () => "",
  );

  const {
    data: verifiedData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AnnualReportVerificationData>({
    queryKey: ["annual-report-verification", reportId],
    queryFn: () => astrologyApi.verifyAnnualReport(reportId),
    enabled: Boolean(reportId),
    staleTime: 60_000,
  });

  const isValid = verifiedData?.is_valid ?? false;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("সনদ ভেরিফিকেশন লিংক কপি করা হয়েছে!");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-amber-50/50 via-slate-50 to-amber-100/30 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-amber-200/80 p-8 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="relative mx-auto size-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-40" />
            <div className="size-14 rounded-full bg-linear-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg">
              <Sparkles className="size-7 text-amber-950 animate-spin" />
            </div>
          </div>
          <h2 className="font-cinzel text-lg font-bold text-slate-900">
            বৈদিক বার্ষিক সনদ সত্যতা যাচাই করা হচ্ছে...
          </h2>
          <p className="text-xs text-slate-500">
            Astra Cryptographic Verification Network verifies solar return ledger consecration.
          </p>
        </div>
      </main>
    );
  }

  if (isError || !isValid) {
    return (
      <div className="min-h-screen bg-[#fbeee5] text-[#1d1a1c]">
        <SiteHeader />
        <main className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="size-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-300 shadow-sm">
            <AlertCircle className="size-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-cinzel text-2xl font-black text-rose-950">
              সনদটি স্বীকৃত বা বৈধ নয় (Invalid Record)
            </h1>
            <p className="text-sm text-stone-600">
              প্রদত্ত সনদ নং <span className="font-bold text-stone-900">{reportId || "Unknown"}</span> আস্ট্রা কেন্দ্রীয় লেজারে খুঁজে পাওয়া যায়নি অথবা এর মেয়াদ সমাপ্ত হয়েছে।
            </p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 font-bold text-xs text-stone-800 transition-colors cursor-pointer"
            >
              পুনরায় চেষ্টা করুন
            </button>
            <a
              href="/daily-horoscope"
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shadow-md transition-all"
            >
              দৈনিক রাশিফল ও সেবা সমূহ
            </a>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const targetYear = verifiedData?.target_year || "2026";
  const clientName = verifiedData?.client_name || "সাধক / Seeker";
  const consecrationDate = verifiedData?.consecration_date || verifiedData?.verified_at || "Consecrated Record";
  const authHash = verifiedData?.digital_seal?.authenticity_hash || "SHA256-AUTHENTIC";
  const astrologer = verifiedData?.digital_seal?.chief_astrologer || "Pt. Acharya Rahul Sharma (Vedic Jyotishacharya)";
  const score = verifiedData?.overall_score ?? 80;

  return (
    <div className="min-h-screen bg-[#fbeee5] text-[#1d1a1c]">
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 print:p-0 print:m-0">
        {/* Verification Verified Badge */}
        <div className="mb-6 rounded-2xl border border-emerald-300 bg-emerald-50/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs print:hidden">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <CheckCircle2 className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <span>প্রমাণিত ও সত্যতা নিশ্চিত (Cryptographically Verified)</span>
              </h3>
              <p className="text-xs text-emerald-800">
                এই ১-বছরের বার্ষিক লাল কিতাব সনদটি আস্ট্রা জ্যোতিষ সনদের কেন্দ্রীয় লেজারে নিরূপিত ও সুরক্ষিত।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-all shadow-md cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>প্রিন্ট / PDF</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
              title="Copy Link"
            >
              <Copy className="size-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative rounded-3xl border-4 border-double border-amber-600/70 bg-gradient-to-b from-[#faf4eb] via-[#fff8f3] to-[#faf4eb] p-6 sm:p-10 text-[#1d1a1c] shadow-2xl print:border-amber-700 print:shadow-none">
          {/* Header */}
          <div className="text-center space-y-2 border-b-2 border-amber-500/40 pb-6 relative">
            <div className="mx-auto size-16 rounded-full border-2 border-amber-600 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-500 flex items-center justify-center shadow-md">
              <span className="font-serif text-3xl font-black text-amber-950">ॐ</span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-950">
              আস্ট্রা দিব্য লাল কিতাব বার্ষিক রাশিফল সনদ
            </h1>

            <p className="font-serif italic text-xs sm:text-sm font-semibold text-amber-900/90 tracking-wide">
              धर्मो रक्षति रक्षितः • ग्रहाधीनं जगत्सर्वम्
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-amber-800 font-medium pt-1">
              <span>সনদ নং: <strong className="font-mono text-amber-950">{reportId}</strong></span>
              <span>•</span>
              <span>বর্ষফল সাল: <strong className="text-amber-950">{targetYear}</strong></span>
              <span>•</span>
              <span>অভিমন্ত্রিত সময়: <strong className="text-amber-950">{consecrationDate}</strong></span>
            </div>
          </div>

          {/* Seeker Information Matrix */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/70 border border-amber-200 rounded-2xl p-4 text-center">
            <div className="p-2 border-r border-amber-100 last:border-0">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">জাতক / Seeker</span>
              <span className="font-cinzel font-black text-sm text-amber-950 mt-0.5 block truncate">
                {clientName}
              </span>
            </div>

            <div className="p-2 border-r border-amber-100 last:border-0">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">জন্ম বিবরণ</span>
              <span className="text-xs font-bold text-stone-800 mt-0.5 block">
                {verifiedData?.date_of_birth || "Recorded"}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {verifiedData?.city_name || "Vedic Coordinates"}
              </span>
            </div>

            <div className="p-2 border-r border-amber-100 last:border-0">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">লগ্ন ও রাশি</span>
              <span className="text-xs font-bold text-amber-900 mt-0.5 block">
                {verifiedData?.natal_lagna ? `${verifiedData.natal_lagna} লগ্ন` : "শাস্ত্রীয় লগ্ন"}
              </span>
              <span className="text-[10px] text-stone-500 block">
                {verifiedData?.moon_rashi ? `${verifiedData.moon_rashi} রাশি` : "চন্দ্র রাশি"}
              </span>
            </div>

            <div className="p-2">
              <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">শুভ সূচক স্কোর</span>
              <span className="font-serif font-black text-lg text-emerald-700 mt-0.5 block">
                {score}%
              </span>
              <span className="text-[9px] text-emerald-800 font-semibold block">Cosmic Resilience</span>
            </div>
          </div>

          {/* Details & Scriptural Validation Text */}
          <div className="mt-6 rounded-2xl border border-amber-300/80 bg-amber-50/60 p-5 space-y-3 text-xs leading-relaxed">
            <p className="text-stone-800">
              এই বৈদিক নথিটি নিশ্চিত করে যে সনদ নং <span className="font-mono font-bold text-amber-950">{reportId}</span> এর অন্তর্গত ১-বছরের বার্ষিক রাশিফল ও লাল কিতাব মহাপ্রতিকারটি সুইস এফিমেরিস ২.১০ (সোলার রিটার্ন লগ্ন) এবং মূল ক্লায়েন্ট লাল কিতাব ক্যানন অনুসারে নিখুঁতভাবে সম্পাদিত ও আচাৰ্য দ্বারা অনুমোদিত।
            </p>
            {verifiedData?.summary_text && (
              <p className="text-stone-700 italic border-l-2 border-amber-400 pl-3 py-1">
                “{verifiedData.summary_text}”
              </p>
            )}
            <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-900 font-semibold flex items-center justify-between">
              <span>স্ট্যাটাস: সক্রিয় ও বৈদিক সত্যতা অনুমোদিত</span>
              <span className="text-emerald-700 font-bold">✓ IMMUTABLE VERIFIED RECORD</span>
            </div>
          </div>

          {/* Seal, QR and Signatures */}
          <div className="mt-8 pt-6 border-t-2 border-amber-400 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
              <DivinLinkQrBadge
                value={pageUrl || (reportId ? `https://www.divinlink.com/verify/annual-report/${reportId}` : "")}
                sizeClassName="size-24"
                alt="Astra Verification QR Code"
              />
              <p className="text-[10px] font-bold text-amber-900">
                স্ক্যান করে অনলাইনে সত্যতা যাচাই করুন
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
              <span className="font-mono text-[9px] text-stone-600 truncate max-w-[200px]">
                {authHash}
              </span>
            </div>

            {/* Astrologer Signature */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
              <div className="border-b border-dashed border-amber-800 pb-1 w-44 text-center sm:text-right">
                <span className="font-serif italic font-bold text-base text-amber-950 tracking-wider">
                  {astrologer.split(" (")[0] || "Pt. Rahul Sharma"}
                </span>
              </div>
              <p className="text-[11px] font-black text-slate-800">
                {astrologer}
              </p>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle2 className="size-2.5" />
                <span>Cryptographically Sealed</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-8 text-center print:hidden">
          <a
            href="/daily-horoscope"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-700 hover:underline"
          >
            <span>← দৈনিক রাশিফল ও আরও জ্যোতিষ সেবা দেখুন</span>
          </a>
        </div>
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </div>
  );
}
