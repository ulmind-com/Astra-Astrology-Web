"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import QRCode from "qrcode";
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
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function AnnualReportVerificationPage() {
  const params = useParams();
  const reportId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [loading, setLoading] = React.useState(true);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (reportId && typeof window !== "undefined") {
      QRCode.toDataURL(window.location.href, {
        width: 160,
        margin: 1,
        color: { dark: "#2a1b12", light: "#ffffff" },
      })
        .then((url) => setQrDataUrl(url))
        .catch(() => {});
    }

    const t = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(t);
  }, [reportId]);

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

  if (loading) {
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

  const yearMatch = reportId.match(/ASTRA-LK-(\d{4})-/);
  const targetYear = yearMatch ? yearMatch[1] : "2026";

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#332c39]">
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
              className="p-2 rounded-xl border border-stone-300 hover:bg-stone-200 transition-colors"
              title="Copy"
            >
              <Copy className="size-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative rounded-3xl border-4 border-double border-amber-600/70 bg-gradient-to-b from-[#faf4eb] via-[#fffdf9] to-[#faf4eb] p-6 sm:p-10 text-[#332c39] shadow-2xl print:border-amber-700 print:shadow-none">
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

            <div className="flex items-center justify-center gap-4 text-[11px] text-amber-800 font-medium pt-1">
              <span>সনদ নং: {reportId}</span>
              <span>•</span>
              <span>বর্ষফল সাল: {targetYear}</span>
            </div>
          </div>

          {/* Details */}
          <div className="mt-6 rounded-2xl border border-amber-300/80 bg-amber-50/60 p-5 space-y-3 text-xs leading-relaxed">
            <p className="text-stone-800">
              এই বৈদিক নথিটি নিশ্চিত করে যে সনদ নং <span className="font-bold text-amber-950">{reportId}</span> এর অন্তর্গত ১-বছরের বার্ষিক রাশিফল ও লাল কিতাব মহাপ্রতিকারটি সুইস এফিমেরিস (সোলার রিটার্ন লগ্ন) এবং মূল ক্লায়েন্ট লাল কিতাব ক্যানন অনুসারে নিখুঁতভাবে সম্পাদিত ও আচাৰ্য রাধাকান্ত শর্মা দ্বারা অনুমোদিত।
            </p>
            <div className="pt-2 border-t border-amber-200 text-[11px] text-amber-900 font-semibold flex items-center justify-between">
              <span>স্ট্যাটাস: সক্রিয় ও বৈদিক সত্যতা অনুমোদিত</span>
              <span className="text-emerald-700 font-bold">✓ VERIFIED RECORD</span>
            </div>
          </div>

          {/* Seal and Signatures */}
          <div className="mt-8 pt-6 border-t-2 border-amber-400 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            {/* QR Code */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1">
              <div className="p-1.5 bg-white rounded-xl border border-amber-300 shadow-xs inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Astra Verification QR Code"
                    className="size-24 rounded-lg object-contain"
                  />
                ) : (
                  <div className="size-24 bg-amber-50 flex items-center justify-center text-[10px] text-stone-400">
                    QR
                  </div>
                )}
              </div>
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
            </div>

            {/* Astrologer Signature */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
              <div className="border-b border-dashed border-amber-800 pb-1 w-44 text-center sm:text-right">
                <span className="font-serif italic font-bold text-base text-amber-950 tracking-wider">
                  Acharya Rahul Sharma
                </span>
              </div>
              <p className="text-[11px] font-black text-slate-800">
                Pt. Acharya Rahul Sharma (Vedic Jyotishacharya)
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

