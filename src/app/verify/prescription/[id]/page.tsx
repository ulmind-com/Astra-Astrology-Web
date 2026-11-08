"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import QRCode from "qrcode";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Printer,
  Copy,
  ExternalLink,
  Gem,
  Flame,
  BookOpen,
  HeartHandshake,
  ScrollText,
  AlertCircle,
  Loader2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { appointmentApi } from "@/lib/api";

interface VerificationData {
  valid: boolean;
  status: string;
  appointment_id: string;
  certificate_id: string;
  issued_at: string;
  consultation_pillar: string;
  session_duration_minutes: number;
  astrologer: {
    name: string;
    title: string;
    avatar_url?: string;
  };
  client: {
    name: string;
  };
  sacred_prescription: {
    consecrated_gemstone: string;
    sacred_rudraksha: string;
    vedic_mantra: string;
    japa_count: number;
    daan_charity_ritual: string;
    sankalpa?: string;
    astrologer_guidance: string;
  };
  vedic_shlokas?: Array<{
    sanskrit: string;
    transliteration?: string;
    meaning: string;
  }>;
  verification_url: string;
  qr_code_url?: string;
  digital_seal: {
    verification_hash: string;
    seal_title: string;
    seal_motto: string;
    status: string;
    signature?: string;
  };
}

export default function PrescriptionVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<VerificationData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (!appointmentId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    appointmentApi
      .verifyCertificate(appointmentId)
      .then((res) => {
        if (!mounted) return;
        setData(res);
        // Generate high-resolution QR
        const verifyUrl = res.verification_url || window.location.href;
        QRCode.toDataURL(verifyUrl, {
          width: 256,
          margin: 1,
          color: {
            dark: "#3b1e08",
            light: "#fffdfa",
          },
        })
          .then((url) => {
            if (mounted) setQrDataUrl(url);
          })
          .catch(() => {});
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.message ||
            "সনদটি যাচাই করা সম্ভব হয়নি বা কোনো বৈধ দৈব প্রেসক্রিপশন সনদ খুঁজে পাওয়া যায়নি।"
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [appointmentId]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("সনদ ভেরিফিকেশন লিংক কপি করা হয়েছে!");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
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
          <h2 className="font-display text-lg font-bold text-slate-900">
            বৈদিক সনদ সত্যতা যাচাই করা হচ্ছে...
          </h2>
          <p className="text-xs text-slate-500">
            Astra Cryptographic Verification Network connects to decentralized planetary ledger.
          </p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-linear-to-b from-rose-50/60 via-slate-50 to-amber-50/40 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-rose-200 p-8 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="mx-auto size-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <AlertCircle className="size-8" />
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900">
            সনদ সত্যতা যাচাই ব্যর্থ হয়েছে
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {error || "সনদটি পাওয়া যায়নি অথবা এটি আস্ট্রা প্ল্যাটফর্ম থেকে ইস্যু করা হয়নি।"}
          </p>
          <div className="pt-2">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              হোমপেজে ফিরে যান
            </button>
          </div>
        </div>
      </main>
    );
  }

  const p = data.sacred_prescription;
  const seal = data.digital_seal;

  return (
    <main className="min-h-screen bg-linear-to-b from-amber-50/60 via-orange-50/20 to-amber-100/40 py-8 px-4 sm:px-6 lg:px-8 selection:bg-amber-200">
      {/* Top Banner Navigation (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="size-8 rounded-lg bg-amber-600 text-amber-950 font-black flex items-center justify-center text-sm shadow-xs">
            ॐ
          </span>
          <div>
            <h1 className="font-display font-black text-sm text-slate-900 tracking-wide">
              ASTRA ASTROLOGY • দিব্য পরামর্শ সনদ ভেরিফিকেশন
            </h1>
            <p className="text-[11px] text-slate-500">
              Government standard cryptographic seal & tamper-proof verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Copy className="size-3.5" />
            <span>লিংক কপি</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="size-3.5" />
            <span>সনদ প্রিন্ট / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Royal Vedic Certificate Card */}
      <div className="max-w-4xl mx-auto bg-[#fffdf8] rounded-3xl border-4 border-double border-amber-600/60 shadow-2xl overflow-hidden relative print:border-amber-700 print:shadow-none print:m-0 print:p-0">
        {/* Ornate Corner Accents */}
        <div className="absolute top-2 left-3 text-amber-500 font-serif text-2xl select-none opacity-70">
          ⚜
        </div>
        <div className="absolute top-2 right-3 text-amber-500 font-serif text-2xl select-none opacity-70">
          ⚜
        </div>
        <div className="absolute bottom-2 left-3 text-amber-500 font-serif text-2xl select-none opacity-70">
          ⚜
        </div>
        <div className="absolute bottom-2 right-3 text-amber-500 font-serif text-2xl select-none opacity-70">
          ⚜
        </div>

        {/* Certificate Header Section */}
        <div className="px-6 sm:px-12 pt-10 pb-6 text-center border-b border-amber-200/70 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-2xs mb-3">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>VERIFIED & CONSECRATED OFFICIAL CERTIFICATE</span>
          </div>

          <div className="text-amber-800 text-2xl sm:text-3xl font-serif tracking-widest my-1 select-none">
            ॐ श्री परमात्मने नमः
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-black text-amber-950 tracking-tight">
            দিব্য পরামর্শ ও বৈদিক প্রতিকার সনদ
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-amber-800/80 mt-1">
            DIVYA PARAMARSHA • SACRED REMEDIAL PRESCRIPTION
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-medium">
            <span className="bg-amber-100/60 text-amber-900 px-3 py-1 rounded-lg border border-amber-200">
              সনদ নং: <strong className="font-mono">{data.certificate_id}</strong>
            </span>
            <span className="bg-amber-100/60 text-amber-900 px-3 py-1 rounded-lg border border-amber-200">
              ইস্যুর তারিখ: <strong>{new Date(data.issued_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</strong>
            </span>
          </div>
        </div>

        {/* Consultation Context & Parties */}
        <div className="px-6 sm:px-12 py-6 bg-amber-50/30 border-b border-amber-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-2xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              দিব্য পরামর্শদাতা জ্যোতিষী (Astrologer)
            </p>
            <p className="font-display font-bold text-base text-slate-900 mt-1">
              {data.astrologer.name}
            </p>
            <p className="text-xs text-slate-500">{data.astrologer.title}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200/60 shadow-2xs">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              গ্রহশান্তি প্রার্থনাকারী জাতক/জাতিকা (Client)
            </p>
            <p className="font-display font-bold text-base text-slate-900 mt-1">
              {data.client.name}
            </p>
            <p className="text-xs text-slate-500">
              পরামর্শ ক্ষেত্র: <span className="font-bold text-amber-900">{data.consultation_pillar}</span> ({data.session_duration_minutes} মিনিট কনসালটেশন)
            </p>
          </div>
        </div>

        {/* 5-Pillar Sacred Remedies Grid */}
        <div className="px-6 sm:px-12 py-8 space-y-6">
          <div className="text-center">
            <h3 className="font-display text-lg font-bold text-slate-900 inline-flex items-center gap-2">
              <Sparkles className="size-4 text-amber-600" />
              <span>পঞ্চমুখী দৈব বিধান ও সুরক্ষা কবচ</span>
              <Sparkles className="size-4 text-amber-600" />
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Five-Pillar Consecrated Cosmic Prescription formulated according to Parashara Hora Shastra
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Gemstone */}
            <div className="p-4 rounded-2xl border-2 border-amber-200/80 bg-linear-to-br from-amber-50/70 to-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800">
                <Gem className="size-4 text-amber-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  ১. প্রাণপ্রতিষ্ঠিত রত্ন বিধান (Consecrated Gemstone)
                </h4>
              </div>
              <p className="text-sm font-black text-slate-900 pl-6">
                {p.consecrated_gemstone}
              </p>
            </div>

            {/* 2. Rudraksha */}
            <div className="p-4 rounded-2xl border-2 border-amber-200/80 bg-linear-to-br from-amber-50/70 to-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800">
                <Flame className="size-4 text-amber-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  ২. সিদ্ধ রুদ্রাক্ষ ধারণ (Sacred Rudraksha)
                </h4>
              </div>
              <p className="text-sm font-black text-slate-900 pl-6">
                {p.sacred_rudraksha}
              </p>
            </div>

            {/* 3. Beej Mantra */}
            <div className="p-4 rounded-2xl border-2 border-amber-200/80 bg-linear-to-br from-amber-50/70 to-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800">
                <BookOpen className="size-4 text-amber-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  ৩. বৈদিক বীজমন্ত্র ও জপ (Sacred Mantra & Japa)
                </h4>
              </div>
              <p className="text-sm font-black text-amber-950 font-serif pl-6">
                {p.vedic_mantra}
              </p>
              <p className="text-[11px] text-amber-800 font-bold pl-6">
                নিয়মিত জপ সংখ্যা: {p.japa_count} বার
              </p>
            </div>

            {/* 4. Daan & Puja */}
            <div className="p-4 rounded-2xl border-2 border-amber-200/80 bg-linear-to-br from-amber-50/70 to-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-amber-800">
                <HeartHandshake className="size-4 text-amber-600" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  ৪. দান ও পূজার সংকল্প (Daan & Ritual Ritual)
                </h4>
              </div>
              <p className="text-sm font-bold text-slate-900 pl-6">
                {p.daan_charity_ritual}
              </p>
            </div>
          </div>

          {/* 5. Sankalpa (Full Width) */}
          {p.sankalpa && (
            <div className="p-4 rounded-2xl border-2 border-purple-200/80 bg-linear-to-r from-purple-50/60 via-amber-50/40 to-purple-50/60 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2 text-purple-900">
                <ScrollText className="size-4 text-purple-700" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  ৫. বৈদিক সংকল্প ও আধ্যাত্মিক ব্রত (Sacred Sankalpa & Vow)
                </h4>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed pl-6">
                {p.sankalpa}
              </p>
            </div>
          )}

          {/* Astrologer Guidance Note */}
          {p.astrologer_guidance && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-1">
              <h5 className="font-bold text-xs text-amber-900">
                জ্যোতিষীর বিশেষ নির্দেশাবলী ও পথপ্রদর্শন (Astrologer Guidance):
              </h5>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "{p.astrologer_guidance}"
              </p>
            </div>
          )}

          {/* Vedic Shlokas Section */}
          {data.vedic_shlokas && data.vedic_shlokas.length > 0 && (
            <div className="pt-4 border-t border-amber-200/70 space-y-3">
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-amber-800">
                পবিত্র বৈদিক শান্তি ও কল্যাণ শ্লোক (Sacred Consecration Shlokas)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.vedic_shlokas.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-amber-100/30 border border-amber-200 text-center space-y-1"
                  >
                    <p className="font-serif font-black text-amber-950 text-xs sm:text-sm">
                      {s.sanskrit}
                    </p>
                    <p className="text-[11px] text-slate-600 font-serif italic">
                      {s.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Seal, Signature & QR Code Footer */}
        <div className="px-6 sm:px-12 py-6 bg-linear-to-r from-amber-100/40 via-amber-50 to-amber-100/40 border-t-2 border-amber-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* 1. QR Code */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="p-1.5 bg-white rounded-xl border border-amber-300 shadow-2xs">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Astra Authenticity QR Code"
                  className="size-24 rounded-lg object-contain"
                />
              ) : (
                <div className="size-24 bg-amber-50 flex items-center justify-center">
                  <Loader2 className="size-6 text-amber-600 animate-spin" />
                </div>
              )}
            </div>
            <p className="text-[9px] font-mono text-amber-900 tracking-tighter max-w-[140px] truncate">
              {seal.verification_hash}
            </p>
            <p className="text-[9px] font-bold text-amber-800">
              স্ক্যান করে অনলাইনে সত্যতা যাচাই করুন
            </p>
          </div>

          {/* 2. Official Golden Seal */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="size-20 rounded-full border-4 border-double border-amber-600 bg-linear-to-tr from-amber-400 via-amber-300 to-amber-500 shadow-md flex flex-col items-center justify-center p-1 text-amber-950">
              <span className="text-[8px] font-black uppercase tracking-widest">
                ASTRA SEAL
              </span>
              <span className="text-xl font-serif">ॐ</span>
              <span className="text-[7px] font-extrabold tracking-tighter">
                CONSECRATED
              </span>
            </div>
            <p className="font-serif font-black text-xs text-amber-950 mt-1">
              {seal.seal_title}
            </p>
            <p className="text-[9px] font-serif italic text-amber-800">
              "{seal.seal_motto}"
            </p>
          </div>

          {/* 3. Astrologer Digital Signature */}
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-1">
            <div className="border-b border-dashed border-amber-800 pb-1 w-44 text-right">
              <span className="font-serif italic font-bold text-lg text-amber-950 tracking-wider">
                {seal.signature || data.astrologer.name}
              </span>
            </div>
            <p className="text-[11px] font-black text-slate-800">
              জ্যোতিষীর ডিজিটাল স্বাক্ষর
            </p>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <CheckCircle2 className="size-2.5" />
              <span>Cryptographically Verified</span>
            </span>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="px-6 py-2.5 bg-amber-950 text-amber-200/80 text-[10px] text-center font-medium">
          সনদটি আস্ট্রা অ্যাস্ট্রোলজি ভেরিফিকেশন ইঞ্জিন দ্বারা অনুমোদিত এবং এর সত্যতা অনলাইনে সংরক্ষিত। সর্বস্বত্ব সংরক্ষিত © {new Date().getFullYear()} Astra Astrology Inc.
        </div>
      </div>

      {/* Floating Action Button on Bottom (Hidden in print) */}
      <div className="max-w-4xl mx-auto mt-6 text-center print:hidden">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-700 hover:underline"
        >
          <span>← আস্ট্রা প্ল্যাটফর্মে আরও জ্যোতিষ সেবা দেখুন</span>
        </a>
      </div>
    </main>
  );
}
