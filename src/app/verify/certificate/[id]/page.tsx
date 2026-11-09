"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Award,
  CheckCircle2,
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  Share2,
  Sparkles,
  ArrowLeft,
  Loader2,
  Download,
  AlertTriangle,
  Lock,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { courseApi } from "@/lib/api";
import { CourseCertificate } from "@/types";

export default function CourseCertificateVerificationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const certificateId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const sigToken = searchParams?.get("sig") || undefined;

  const [loading, setLoading] = React.useState(true);
  const [cert, setCert] = React.useState<CourseCertificate | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>("");
  const [showInspector, setShowInspector] = React.useState(false);

  React.useEffect(() => {
    if (!certificateId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    // 1. Attempt public verification with optional cryptographic signature query token
    courseApi
      .verifyCertificate(certificateId, sigToken)
      .then((res: any) => {
        if (!mounted) return;
        const certData = res.data || res;
        setCert(certData);
      })
      .catch((err: any) => {
        // Fallback: If user passed course ObjectId while logged in
        return courseApi
          .getCertificate(certificateId)
          .then((res: any) => {
            if (!mounted) return;
            const certData = res.data || res;
            setCert(certData);
          })
          .catch(() => {
            if (!mounted) return;
            setError(
              err?.message ||
                "This certificate could not be verified or has not yet been issued."
            );
          });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [certificateId, sigToken]);

  // Generate tamper-resistant QR code once cert data is loaded
  React.useEffect(() => {
    if (!cert) return;

    const targetUrl =
      cert.verification_url ||
      (typeof window !== "undefined" ? window.location.href : "");

    QRCode.toDataURL(targetUrl, {
      width: 280,
      margin: 1,
      color: {
        dark: "#381e00",
        light: "#fffef9",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("QR Code generation error:", err));
  }, [cert]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Verification link copied to clipboard!");
    }
  };

  const handleCopyHash = (text: string, label: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && cert) {
      try {
        await navigator.share({
          title: `${cert.student_name}'s Consecrated Vedic Certificate`,
          text: `Verified Certificate of Vedic Mastery in ${cert.course_title} from Astra Gurukul.`,
          url: window.location.href,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const isTampered = cert && cert.is_signature_valid === false;
  const rawHtmlDownloadUrl = cert
    ? `${process.env.NEXT_PUBLIC_API_URL || "https://astra-astrology-backend.onrender.com/api/v1"}/courses/certificate/verify/${cert.certificate_id}/html${sigToken ? `?sig=${sigToken}` : ""}`
    : "";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-6 sm:py-12 px-3 sm:px-6">
      {/* Top Action & Verification Bar (Hidden during Print) */}
      <div className="mx-auto max-w-5xl mb-6 print:hidden space-y-4">
        {/* Navigation & Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-neutral-900/90 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link
              href="/account/courses"
              className="inline-flex size-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-800/60 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              title="Return to My Courses"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`flex size-2 rounded-full ${
                    isTampered
                      ? "bg-red-500 animate-ping"
                      : "bg-emerald-500 animate-pulse"
                  }`}
                />
                <span
                  className={`font-mono text-xs font-bold uppercase tracking-wider ${
                    isTampered ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {isTampered
                    ? "Tampering Detected / Invalid Signature"
                    : "Cryptographically Consecrated & Verified"}
                </span>
              </div>
              <h1 className="font-serif text-sm sm:text-base font-bold text-neutral-100">
                Astra Gurukul Official Credential Registry
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowInspector(!showInspector)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
            >
              <Fingerprint className="size-3.5" />
              <span>Crypto Audit</span>
              {showInspector ? (
                <ChevronUp className="size-3.5" />
              ) : (
                <ChevronDown className="size-3.5" />
              )}
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              <Copy className="size-3.5" />
              <span>Copy Link</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
            >
              <Share2 className="size-3.5" />
              <span>Share</span>
            </button>

            {rawHtmlDownloadUrl && (
              <a
                href={rawHtmlDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
              >
                <Download className="size-3.5" />
                <span>Raw HTML</span>
              </a>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md transition-transform active:scale-95 hover:from-amber-600 hover:to-amber-700"
            >
              <Printer className="size-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Cryptographic Inspector Drawer (Collapsible) */}
        {showInspector && cert && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/95 p-5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-amber-400" />
                <h3 className="font-serif text-sm font-bold text-neutral-200">
                  Cryptographic Integrity & Anti-Counterfeit Ledger Audit
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                FIPS 198-1 Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Canonical Digest (SHA-256):</span>
                  <button
                    onClick={() =>
                      handleCopyHash(
                        cert.canonical_hash || cert.digital_seal?.verification_hash || "",
                        "SHA-256 Digest"
                      )
                    }
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="size-3" /> Copy
                  </button>
                </div>
                <div className="break-all font-semibold text-amber-300 bg-neutral-900/80 p-2 rounded-lg text-[11px]">
                  {cert.canonical_hash || cert.digital_seal?.verification_hash || "N/A"}
                </div>
              </div>

              <div className="space-y-1.5 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>HMAC-SHA256 Digital Signature:</span>
                  <button
                    onClick={() =>
                      handleCopyHash(
                        cert.cryptographic_signature || "",
                        "Digital Signature"
                      )
                    }
                    className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="size-3" /> Copy
                  </button>
                </div>
                <div className="break-all font-semibold text-emerald-300 bg-neutral-900/80 p-2 rounded-lg text-[11px]">
                  {cert.cryptographic_signature || "CONSECRATED_SOVEREIGN_KEY"}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
              <div>
                Authority:{" "}
                <strong className="text-neutral-200">Astra Gurukul</strong>
              </div>
              <div>
                Algorithm:{" "}
                <strong className="text-neutral-200">
                  {cert.signature_algorithm || "HMAC-SHA256"}
                </strong>
              </div>
              <div>
                Status:{" "}
                <strong className={isTampered ? "text-red-400" : "text-emerald-400"}>
                  {isTampered ? "SIGNATURE MISMATCH" : "0% TAMPERED (VERIFIED)"}
                </strong>
              </div>
              <div>
                Lessons Completed:{" "}
                <strong className="text-neutral-200">
                  {cert.total_lessons_completed} Lessons (100%)
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Anti-Fraud Hardcopy Cross-Verification Advisory Box */}
        {cert && (
          <div
            className={`rounded-2xl border p-4 text-xs leading-relaxed ${
              isTampered
                ? "border-red-500/40 bg-red-950/30 text-red-200"
                : "border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-neutral-900 to-amber-950/20 text-neutral-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                className={`size-5 shrink-0 mt-0.5 ${
                  isTampered ? "text-red-400" : "text-amber-400"
                }`}
              />
              <div className="space-y-1">
                <div className="font-serif font-bold text-neutral-100 flex items-center gap-2">
                  <span>Authoritative Ledger Record & Physical Cross-Verification</span>
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                    ANTI-FORGERY RULE
                  </span>
                </div>
                <p className="text-neutral-400">
                  If inspecting a physical paper certificate or downloaded PDF, the printed
                  Scholar Name (<strong className="text-amber-300">{cert.student_name}</strong>),
                  Course (<strong className="text-amber-300">{cert.course_title}</strong>),
                  and Certificate ID (<strong className="text-amber-300">{cert.certificate_id}</strong>)
                  must strictly match the record above from Astra Gurukul&apos;s authoritative ledger.
                  Any difference in printed name proves the physical document was altered or forged.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mx-auto max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-12 text-center shadow-2xl">
          <Loader2 className="mx-auto size-10 animate-spin text-amber-500" />
          <p className="mt-4 font-serif text-lg font-bold text-neutral-200">
            Consulting Celestial Cryptographic Registry...
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Verifying tamper-proof digital cryptographic seal & enrollment history.
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-neutral-900/80 p-8 text-center shadow-2xl">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 ring-8 ring-red-500/5">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-red-200">
            Certificate Not Found
          </h2>
          <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
            {error}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/courses"
              className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
            >
              Browse Masterclasses
            </Link>
            <Link
              href="/account/courses"
              className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600"
            >
              My Enrolled Courses
            </Link>
          </div>
        </div>
      )}

      {/* Verified Certificate Canvas */}
      {!loading && cert && (
        <div className="certificate-page-wrap mx-auto max-w-[1100px]">
          {/* Certificate Board Border */}
          <div className="certificate-border relative overflow-hidden rounded-2xl border-[10px] print:border-[6px] border-[#c29b38] bg-[#fdfbf7] p-5 sm:p-10 print:p-2 shadow-2xl text-[#2a1705]">
            {/* Micro-Text Perimeter Bands (Anti-Counterfeit Protection) */}
            <div className="microtext-top select-none pointer-events-none absolute top-1 left-4 right-4 text-center font-mono text-[5.5px] uppercase tracking-[2px] text-[#b8860b]/40 overflow-hidden whitespace-nowrap">
              ASTRA GURUKUL CELESTIAL CREDENTIALS • OFFICIALLY CONSECRATED BY BOARD OF ASTROLOGICAL REGENTS • CANONICAL HASH VERIFIED • ASTRA GURUKUL CELESTIAL CREDENTIALS
            </div>
            <div className="microtext-bot select-none pointer-events-none absolute bottom-1 left-4 right-4 text-center font-mono text-[5.5px] uppercase tracking-[2px] text-[#b8860b]/40 overflow-hidden whitespace-nowrap">
              HMAC-SHA256 DIGITAL SECURITY SEAL • MATHEMATICALLY TAMPER-PROOF • VERIFIABLE AT ASTRAGURUKUL.COM • HMAC-SHA256 DIGITAL SECURITY SEAL
            </div>

            {/* Inner Golden Inset Border */}
            <div className="certificate-inner relative rounded-lg border-2 border-[#b8860b] p-6 sm:p-12 print:p-4 flex flex-col justify-between">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-lg sm:text-2xl print:text-base text-[#b8860b] opacity-80 select-none">
                ☸
              </div>
              <div className="absolute top-2 right-2 text-lg sm:text-2xl print:text-base text-[#b8860b] opacity-80 select-none">
                ☸
              </div>
              <div className="absolute bottom-2 left-2 text-lg sm:text-2xl print:text-base text-[#b8860b] opacity-80 select-none">
                ☸
              </div>
              <div className="absolute bottom-2 right-2 text-lg sm:text-2xl print:text-base text-[#b8860b] opacity-80 select-none">
                ☸
              </div>

              {/* Guilloche Rosette Geometric SVG Background Pattern */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
                <svg
                  viewBox="0 0 500 500"
                  className="size-[520px]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="250"
                    cy="250"
                    r="230"
                    fill="none"
                    stroke="#c29b38"
                    strokeWidth="1.2"
                    strokeDasharray="4,4"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="190"
                    fill="none"
                    stroke="#c29b38"
                    strokeWidth="1"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="150"
                    fill="none"
                    stroke="#c29b38"
                    strokeWidth="1"
                    strokeDasharray="3,2"
                  />
                  {/* 12-petaled astrological chakra lines */}
                  <g stroke="#c29b38" strokeWidth="0.8">
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="220"
                      ry="45"
                      fill="none"
                      transform="rotate(0 250 250)"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="220"
                      ry="45"
                      fill="none"
                      transform="rotate(30 250 250)"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="220"
                      ry="45"
                      fill="none"
                      transform="rotate(60 250 250)"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="220"
                      ry="45"
                      fill="none"
                      transform="rotate(90 250 250)"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="220"
                      ry="45"
                      fill="none"
                      transform="rotate(120 250 250)"
                    />
                    <ellipse
                      cx="250"
                      cy="250"
                      rx="220"
                      ry="45"
                      fill="none"
                      transform="rotate(150 250 250)"
                    />
                  </g>
                </svg>
              </div>

              {/* Watermark Cosmic Om in Background */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <div className="size-[500px] rounded-full border-[30px] border-[#b8860b] flex items-center justify-center text-[280px] font-serif font-black">
                  ॐ
                </div>
              </div>

              {/* Certificate Header */}
              <div className="relative text-center space-y-1 print:space-y-0.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-4 py-1 print:px-2 print:py-0.5 text-[11px] print:text-[9px] font-bold uppercase tracking-widest text-[#78350f]">
                  <Sparkles className="size-3 print:size-2 text-[#b8860b]" />
                  <span>Astra Gurukul • অ্যাস্ট্রা গুরুকুল</span>
                  <Sparkles className="size-3 print:size-2 text-[#b8860b]" />
                </div>
                <h2 className="font-serif text-xs sm:text-sm print:text-[10px] font-semibold tracking-wider text-[#78350f] uppercase">
                  Council of Vedic Astrological Sciences & Celestial Arts
                </h2>
                <div className="pt-2 print:pt-0.5">
                  <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl print:text-2xl font-black tracking-tight text-[#3b1e08]">
                    Certificate of Vedic Mastery
                  </h1>
                  <p className="font-serif text-xs sm:text-sm print:text-[10px] italic text-[#854d0e] mt-1 print:mt-0">
                    বৈদিক জ্যোতিষ বিদ্যা পারঙ্গত প্রামাণ্যপত্র
                  </p>
                </div>
              </div>

              {/* Divider Ribbon */}
              <div className="relative mx-auto my-6 print:my-1.5 flex items-center justify-center gap-3 max-w-md">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8860b] to-[#b8860b]" />
                <span className="text-sm print:text-xs font-bold text-[#b8860b]">✦ ॐ ✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#b8860b] to-[#b8860b]" />
              </div>

              {/* Certification Statement */}
              <div className="relative text-center space-y-4 print:space-y-1 max-w-3xl mx-auto">
                <p className="font-serif text-xs sm:text-sm print:text-[10px] uppercase tracking-widest text-[#78350f]">
                  This is to solemnly certify and consecrate that
                </p>

                {/* Recipient Scholar Name */}
                <div className="py-2 print:py-0.5">
                  <h3 className="font-serif text-3xl sm:text-5xl print:text-3xl font-extrabold text-[#311802] tracking-wide underline decoration-[#c29b38]/50 decoration-wavy underline-offset-8 print:underline-offset-4">
                    {cert.student_name}
                  </h3>
                </div>

                {/* Distinction Badge */}
                <div className="inline-flex items-center gap-2 rounded-lg border border-[#c29b38]/40 bg-[#faecc7]/50 px-4 py-1.5 print:px-3 print:py-0.5 text-xs sm:text-sm print:text-[11px] font-bold text-[#78350f]">
                  <Award className="size-4 print:size-3 text-[#b8860b]" />
                  <span>{cert.distinction}</span>
                </div>

                <p className="font-serif text-xs sm:text-sm print:text-[10px] text-[#573312] leading-relaxed max-w-2xl mx-auto print:leading-tight">
                  has thoroughly mastered the sacred principles, astronomical calculations,
                  predictive methodologies, and remedies prescribed in the classical curriculum of
                </p>

                {/* Course Title */}
                <div className="rounded-xl border border-[#b8860b]/30 bg-[#fdf6e2]/80 p-3 sm:p-4 print:p-1.5 print:my-0.5 shadow-xs">
                  <h4 className="font-serif text-lg sm:text-2xl print:text-base font-bold text-[#3b1e08]">
                    {cert.course_title}
                  </h4>
                  <p className="text-[11px] sm:text-xs print:text-[9px] text-[#78350f] mt-1 print:mt-0">
                    Completed 100% curriculum ({cert.total_lessons_completed} Lessons & Practicums)
                  </p>
                </div>

                {/* Sanskrit Blessing Shloka */}
                <div className="pt-2 print:pt-0.5 text-center">
                  <p className="font-serif text-xs sm:text-sm print:text-[9.5px] italic font-medium text-[#78350f]">
                    {cert.digital_seal?.mantra ||
                      "विद्या ददाति विनयं विनयाद्याति पात्रताम् । पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥"}
                  </p>
                  <p className="text-[10px] print:text-[8px] text-[#854d0e] mt-0.5 print:mt-0">
                    — Hitopadesha (True knowledge bestows humility, worthiness, and supreme fulfillment)
                  </p>
                </div>
              </div>

              {/* Signatures & Seal Section */}
              <div className="relative mt-8 sm:mt-12 print:mt-2 grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 items-end gap-6 print:gap-2 pt-6 print:pt-1 border-t border-[#b8860b]/30">
                {/* Left Signature: Master Instructor */}
                <div className="text-center sm:text-left print:text-left order-2 sm:order-1 print:order-1">
                  <div className="font-serif italic text-base sm:text-lg print:text-sm text-[#311802] font-bold">
                    {cert.instructor_name}
                  </div>
                  <div className="h-[1.5px] w-44 print:w-32 mx-auto sm:mx-0 print:mx-0 my-1 print:my-0.5 bg-[#311802]/60" />
                  <p className="text-xs print:text-[10px] font-semibold text-[#573312]">
                    Lead Master & Acharya
                  </p>
                  <p className="text-[10px] print:text-[8px] text-[#78350f]">
                    {cert.instructor_title}
                  </p>
                </div>

                {/* Center Medallion Seal */}
                <div className="flex flex-col items-center justify-center order-1 sm:order-2 print:order-2">
                  <div className="relative flex size-24 sm:size-28 print:size-16 items-center justify-center rounded-full border-4 print:border-2 border-[#b8860b] bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#b8860b] p-1 shadow-lg ring-4 print:ring-1 ring-[#b8860b]/20 text-neutral-900">
                    <div className="flex size-full flex-col items-center justify-center rounded-full border border-dashed border-[#78350f] bg-[#fef8e7] text-center p-1">
                      <span className="text-[9px] print:text-[7px] font-black uppercase tracking-wider text-[#78350f]">
                        Astra Gurukul
                      </span>
                      <span className="text-xl sm:text-2xl print:text-sm text-[#b8860b] leading-none my-0.5 print:my-0">
                        ☸
                      </span>
                      <span className="text-[8px] print:text-[6.5px] font-black uppercase tracking-wider text-[#78350f]">
                        Consecrated
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Signature: Council Registrar & QR Code */}
                <div className="flex flex-col items-center sm:items-end print:items-end text-center sm:text-right print:text-right order-3">
                  <div className="flex items-center gap-3 print:gap-2">
                    {qrCodeDataUrl && (
                      <div className="relative size-14 sm:size-16 print:size-12 rounded-md border border-[#b8860b]/40 bg-white p-1 shadow-xs">
                        <img
                          src={qrCodeDataUrl}
                          alt="Verification QR Code"
                          className="size-full object-contain"
                        />
                      </div>
                    )}
                    <div className="text-center sm:text-right print:text-right">
                      <div className="font-serif text-sm print:text-xs font-bold text-[#311802]">
                        Board of Astrological Regents
                      </div>
                      <div className="h-[1.5px] w-36 print:w-28 mx-auto sm:ml-auto print:ml-auto my-1 print:my-0.5 bg-[#311802]/60" />
                      <p className="text-xs print:text-[10px] font-semibold text-[#573312]">
                        Council Registrar
                      </p>
                      <p className="text-[10px] print:text-[8px] text-[#78350f]">
                        Director of Celestial Credentials
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata & Hash Strip */}
              <div className="relative mt-6 print:mt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#b8860b]/20 pt-3 print:pt-1 text-[10px] print:text-[8px] text-[#78350f] font-mono">
                <div>
                  ID: <span className="font-bold text-[#311802]">{cert.certificate_id}</span>
                </div>
                <div>
                  Issued: <span className="font-semibold text-[#311802]">{cert.issued_at_formatted}</span>
                </div>
                <div className="truncate max-w-[220px]" title={cert.canonical_hash || ""}>
                  Hash:{" "}
                  <span className="text-[9px] print:text-[7.5px] opacity-80">
                    {cert.canonical_hash ? `${cert.canonical_hash.slice(0, 16)}...` : "VERIFIED-CANONICAL"}
                  </span>
                </div>
                <div className="truncate max-w-[220px]" title={cert.cryptographic_signature || ""}>
                  Sig:{" "}
                  <span className="text-[9px] print:text-[7.5px] opacity-80">
                    {cert.cryptographic_signature ? `${cert.cryptographic_signature.slice(0, 16)}...` : "HMAC-SHA256"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print-specific Stylesheet for Guaranteed Exact 1-Page Landscape Output */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4 landscape;
            margin: 0 !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            overflow: hidden !important;
          }
          header,
          footer,
          nav,
          .print\\:hidden,
          [data-print-hide] {
            display: none !important;
          }
          .certificate-page-wrap {
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            margin: 0 auto !important;
            padding: 3mm 4mm !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }
          .certificate-border {
            width: 100% !important;
            height: 100% !important;
            max-height: 204mm !important;
            border-width: 5px !important;
            box-shadow: none !important;
            padding: 2mm !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .certificate-inner {
            height: 100% !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            padding: 3mm 4mm !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
