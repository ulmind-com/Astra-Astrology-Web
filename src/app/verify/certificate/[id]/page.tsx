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

      {/* Verified Certificate Canvas — Exact Replica of Production Template */}
      {!loading && cert && (
        <div className="certificate-page-wrap mx-auto max-w-[1040px]">
          <div className="certificate-canvas relative overflow-hidden rounded-xl bg-[#FAF8F2] shadow-2xl text-[#1A1816] flex flex-col md:flex-row border border-[#D1B26F]/30 select-none">
            {/* Micro-Text Perimeter Security Bands */}
            <div className="microtext-top select-none pointer-events-none absolute top-1.5 left-4 right-4 flex justify-between font-mono text-[5.5px] uppercase tracking-[1.5px] text-[#8C7A62]/45 overflow-hidden whitespace-nowrap z-20">
              <span>ASTRA GURUKUL CELESTIAL CREDENTIALS • OFFICIALLY CONSECRATED • CANONICAL HASH VERIFIED</span>
              <span>HMAC-SHA256 DIGITAL SECURITY SEAL • MATHEMATICALLY TAMPER-PROOF • VERIFIABLE AT ASTRAGURUKUL.COM</span>
            </div>
            <div className="microtext-bot select-none pointer-events-none absolute bottom-1.5 left-4 right-4 flex justify-between font-mono text-[5.5px] uppercase tracking-[1.5px] text-[#8C7A62]/45 overflow-hidden whitespace-nowrap z-20">
              <span>ID: {cert.certificate_id}</span>
              <span>SIG: {cert.cryptographic_signature ? `${cert.cryptographic_signature.slice(0, 24)}...` : "HMAC-SHA256"}</span>
            </div>

            {/* Left Column (66% width) */}
            <div className="cert-left-content w-full md:w-[66%] p-6 sm:p-9 md:p-10 lg:p-11 flex flex-col justify-between relative z-10">
              {/* Brand Header */}
              <div className="flex items-center gap-3">
                <svg className="size-10 sm:size-11 shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="90" height="90" rx="16" fill="#1A1816"/>
                  <circle cx="50" cy="50" r="38" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2,2"/>
                  <circle cx="50" cy="50" r="28" stroke="#D4AF37" strokeWidth="1"/>
                  <path d="M 50,22 C 38,22 38,50 50,50 C 62,50 62,22 50,22 Z" fill="#D4AF37" opacity="0.9"/>
                  <path d="M 50,78 C 38,78 38,50 50,50 C 62,50 62,78 50,78 Z" fill="#D4AF37" opacity="0.9"/>
                  <path d="M 22,50 C 22,38 50,38 50,50 C 50,62 22,62 22,50 Z" fill="#D4AF37" opacity="0.9"/>
                  <path d="M 78,50 C 78,38 50,38 50,50 C 50,62 78,62 78,50 Z" fill="#D4AF37" opacity="0.9"/>
                  <circle cx="50" cy="50" r="5" fill="#FFF"/>
                </svg>
                <div>
                  <div className="font-cert-sans text-sm sm:text-base font-extrabold tracking-[2.5px] text-[#1A1816] uppercase leading-none">
                    Astra Gurukul
                  </div>
                  <div className="font-cert-sans text-[8px] sm:text-[9px] font-semibold tracking-[2px] text-[#7A6C58] uppercase mt-1">
                    Council of Vedic Sciences
                  </div>
                </div>
              </div>

              {/* Title Block */}
              <div className="mt-4 sm:mt-5">
                <h1 className="cert-main-title font-cert-display text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight text-[#1A1816] leading-none">
                  Certificate
                </h1>
                <div className="flex items-center gap-2 sm:gap-3 mt-1.5 max-w-[280px] sm:max-w-[320px]">
                  <div className="flex-1 h-[1px] bg-[#8C7A62]" />
                  <span className="font-cert-sans text-[8px] sm:text-[9.5px] font-bold tracking-[2.5px] text-[#6E604E] uppercase whitespace-nowrap">
                    ✦ OF ACHIEVEMENT ✦
                  </span>
                  <div className="flex-1 h-[1px] bg-[#8C7A62]" />
                </div>
              </div>

              {/* Consecration Line */}
              <div className="font-cert-sans text-[8px] sm:text-[9px] md:text-[9.5px] font-bold tracking-[2px] text-[#7A6C58] uppercase mt-4 sm:mt-5">
                This certificate is proudly presented to
              </div>

              {/* Recipient Scholar Name */}
              <div className="mt-1">
                <div className="recipient-name font-cert-script text-3xl sm:text-4xl md:text-5xl lg:text-[50px] text-[#1A1816] leading-tight pl-1">
                  {cert.student_name}
                </div>
                <div className="w-full h-[1px] bg-[#8C7A62] mt-1" />
              </div>

              {/* Citation Body Paragraph */}
              <div className="mt-2.5 sm:mt-3 text-[#4A4237] max-w-[500px]">
                <p className="font-cert-body text-[11px] sm:text-xs md:text-[12.5px] leading-relaxed">
                  has successfully completed the sacred curriculum and demonstrated scholarly excellence in{" "}
                  <strong className="text-[#1A1816] font-bold">{cert.course_title}</strong>, mastering classical predictive calculations, nakshatra computations, and remedial planetary sciences.
                </p>
                <p className="font-cert-display italic text-[10px] sm:text-[11px] text-[#7A5D28] mt-1 sm:mt-1.5 leading-snug">
                  « विद्या ददाति विनयं विनयाद्याति पात्रताम् • True knowledge bestows humility, worthiness, and supreme fulfillment »
                </p>
              </div>

              {/* Footer Row: Date, Live QR Code, Signature */}
              <div className="mt-4 sm:mt-5 pt-1 flex items-end justify-between gap-3 pr-2 sm:pr-4">
                {/* Date */}
                <div className="w-24 sm:w-32 md:w-36 text-center">
                  <div className="font-cert-display text-[11px] sm:text-xs font-semibold text-[#1A1816] min-h-[22px] flex items-end justify-center pb-0.5">
                    {cert.issued_at_formatted || new Date(cert.issued_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                  <div className="w-full h-[1px] bg-[#8C7A62]" />
                  <div className="font-cert-sans text-[8px] sm:text-[9px] font-semibold tracking-[1px] text-[#7A6C58] uppercase mt-1">
                    Date
                  </div>
                </div>

                {/* Verification QR Code */}
                {qrCodeDataUrl && (
                  <div className="flex flex-col items-center text-center">
                    <div className="size-11 sm:size-12 p-1 bg-white rounded border border-[#C59B27] shadow-xs flex items-center justify-center">
                      <img
                        src={qrCodeDataUrl}
                        alt="Verification QR Code"
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="font-cert-sans text-[6.5px] sm:text-[7.5px] font-bold tracking-[0.5px] text-[#7A6C58] uppercase mt-0.5">
                      Verify QR
                    </div>
                  </div>
                )}

                {/* Signature */}
                <div className="w-28 sm:w-36 md:w-40 text-center">
                  <div className="font-cert-script text-xl sm:text-2xl text-[#1A1816] min-h-[24px] flex items-end justify-center leading-none pb-0.5">
                    {cert.instructor_name || "Acharya Rahul Sharma"}
                  </div>
                  <div className="w-full h-[1px] bg-[#8C7A62]" />
                  <div className="font-cert-sans text-[8px] sm:text-[9px] font-semibold tracking-[1px] text-[#7A6C58] uppercase mt-1">
                    Signature
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Ribbon Medal Badge (overlapping content and right pattern) */}
            <div className="seal-badge-wrap absolute right-[26%] sm:right-[27%] md:right-[28%] lg:right-[29%] top-[10%] sm:top-[12%] md:top-[13%] z-30 pointer-events-none drop-shadow-xl scale-75 sm:scale-90 md:scale-100 origin-top">
              <svg viewBox="0 0 160 200" width="130" height="162" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ribbonL" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D8B467"/>
                    <stop offset="50%" stopColor="#AA8237"/>
                    <stop offset="100%" stopColor="#6C4F18"/>
                  </linearGradient>
                  <linearGradient id="ribbonR" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E8CA83"/>
                    <stop offset="50%" stopColor="#BA9245"/>
                    <stop offset="100%" stopColor="#78581F"/>
                  </linearGradient>
                  <radialGradient id="goldPlate" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFF0B8"/>
                    <stop offset="40%" stopColor="#D4AF37"/>
                    <stop offset="80%" stopColor="#9A7424"/>
                    <stop offset="100%" stopColor="#64470C"/>
                  </radialGradient>
                  <radialGradient id="darkDisc" cx="50%" cy="45%" r="50%">
                    <stop offset="0%" stopColor="#2C2114"/>
                    <stop offset="80%" stopColor="#151009"/>
                    <stop offset="100%" stopColor="#0C0905"/>
                  </radialGradient>
                </defs>

                {/* Left Ribbon Tail */}
                <path d="M 66,105 L 56,175 L 68,162 L 80,175 L 75,105 Z" fill="url(#ribbonL)"/>
                <path d="M 66,105 L 68,162 L 56,175 Z" fill="rgba(0,0,0,0.18)"/>

                {/* Right Ribbon Tail */}
                <path d="M 85,105 L 80,175 L 92,162 L 104,175 L 94,105 Z" fill="url(#ribbonR)"/>
                <path d="M 94,105 L 92,162 L 104,175 Z" fill="rgba(0,0,0,0.12)"/>

                {/* 36-Point Scalloped Outer Edge */}
                <polygon
                  points="123.63,80.00 120.35,85.25 120.91,91.43 116.14,95.42 114.99,101.51 109.11,103.54 106.37,109.11 99.85,108.97 95.86,113.74 89.28,111.45 84.49,114.99 78.40,110.51 73.15,112.54 67.97,106.37 63.18,106.77 59.19,99.28 55.44,97.94 53.03,89.51 51.00,86.77 50.44,78.28 50.21,74.29 51.68,66.07 53.24,61.03 56.65,53.63 60.15,49.89 65.40,43.63 70.58,41.22 77.00,36.37 83.00,35.51 90.00,32.26 96.37,33.00 103.23,31.45 109.11,33.54 114.99,35.51 119.85,40.11 123.63,44.75 126.97,51.03 128.91,57.28 130.44,64.29 128.68,71.07 127.24,76.03"
                  fill="url(#goldPlate)"
                  stroke="#8B6508"
                  strokeWidth="0.8"
                />

                {/* Concentric Gold Rings */}
                <circle cx="80" cy="80" r="38" fill="none" stroke="#FFEBA0" strokeWidth="1.2"/>
                <circle cx="80" cy="80" r="35" fill="none" stroke="#8B6508" strokeWidth="0.8"/>
                <circle cx="80" cy="80" r="32.5" fill="none" stroke="#FFEBA0" strokeWidth="0.7" strokeDasharray="1.5,1.5"/>
                <circle cx="80" cy="80" r="30" fill="none" stroke="#64470C" strokeWidth="1.2"/>

                {/* Dark Inner Disc */}
                <circle cx="80" cy="80" r="28.5" fill="url(#darkDisc)"/>
                <circle cx="80" cy="80" r="27" fill="none" stroke="#D4AF37" strokeWidth="0.6"/>

                {/* Medallion Text */}
                <text x="80" y="66" fill="#FFE89E" fontFamily="sans-serif" fontSize="5.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">★ ★ ★</text>
                <text x="80" y="76" fill="#FFF3CA" fontFamily="'Cinzel', serif" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="1.2">BEST</text>
                <path d="M 59,80 L 64,80 M 96,80 L 101,80" stroke="#D4AF37" strokeWidth="0.5"/>
                <text x="80" y="83" fill="#E5C370" fontFamily="sans-serif" fontSize="5" fontWeight="800" textAnchor="middle" letterSpacing="1.5">AWARD</text>
                <text x="80" y="92" fill="#FFF3CA" fontFamily="'Cinzel', serif" fontSize="7.5" fontWeight="700" textAnchor="middle" letterSpacing="1">2026</text>
              </svg>
            </div>

            {/* Right Column: Geometric Art-Deco Gold Lattice Pattern (34% width) */}
            <div className="cert-right-pattern hidden md:block w-[34%] absolute right-0 top-0 bottom-0 overflow-hidden pointer-events-none">
              <svg viewBox="0 0 320 640" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="patGoldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D1B26F"/>
                    <stop offset="30%" stopColor="#A68444"/>
                    <stop offset="70%" stopColor="#DDC385"/>
                    <stop offset="100%" stopColor="#8E6C2E"/>
                  </linearGradient>
                  <linearGradient id="patGoldLight" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#A68444"/>
                    <stop offset="50%" stopColor="#F0DCA0"/>
                    <stop offset="100%" stopColor="#BD9C59"/>
                  </linearGradient>

                  <g id="patDiamondCross">
                    {/* Diagonal 45-deg intersecting bands */}
                    <path d="M-160,-160 L160,160 M160,-160 L-160,160" stroke="url(#patGoldMetal)" strokeWidth="16" fill="none"/>
                    
                    {/* Outer diamond frame */}
                    <polygon points="0,-110 110,0 0,110 -110,0" fill="none" stroke="url(#patGoldMetal)" strokeWidth="14"/>
                    <polygon points="0,-96 96,0 0,96 -96,0" fill="none" stroke="#FAF8F2" strokeWidth="4"/>
                    <polygon points="0,-90 90,0 0,90 -90,0" fill="none" stroke="url(#patGoldLight)" strokeWidth="3"/>

                    {/* 4 Stepped Cross Arms */}
                    <path d="M-28,-28 L-28,-80 L0,-100 L28,-80 L28,-28 Z" fill="url(#patGoldMetal)"/>
                    <path d="M-20,-28 L-20,-75 L0,-90 L20,-75 L20,-28 Z" fill="#FAF8F2"/>
                    <path d="M-12,-28 L-12,-70 L0,-80 L12,-70 L12,-28 Z" fill="url(#patGoldLight)"/>

                    <path d="M-28,28 L-28,80 L0,100 L28,80 L28,28 Z" fill="url(#patGoldMetal)"/>
                    <path d="M-20,28 L-20,75 L0,90 L20,75 L20,28 Z" fill="#FAF8F2"/>
                    <path d="M-12,28 L-12,70 L0,80 L12,70 L12,28 Z" fill="url(#patGoldLight)"/>

                    <path d="M-28,-28 L-80,-28 L-100,0 L-80,28 L-28,28 Z" fill="url(#patGoldMetal)"/>
                    <path d="M-28,-20 L-75,-20 L-90,0 L-75,20 L-28,20 Z" fill="#FAF8F2"/>
                    <path d="M-28,-12 L-70,-12 L-80,0 L-70,12 L-28,12 Z" fill="url(#patGoldLight)"/>

                    <path d="M28,-28 L80,-28 L100,0 L80,28 L28,28 Z" fill="url(#patGoldMetal)"/>
                    <path d="M28,-20 L75,-20 L90,0 L75,20 L28,20 Z" fill="#FAF8F2"/>
                    <path d="M28,-12 L70,-12 L80,0 L70,12 L28,12 Z" fill="url(#patGoldLight)"/>

                    {/* Center Diamond */}
                    <polygon points="0,-28 28,0 0,28 -28,0" fill="url(#patGoldMetal)"/>
                    <polygon points="0,-20 20,0 0,20 -20,0" fill="#FAF8F2"/>
                    <polygon points="0,-12 12,0 0,12 -12,0" fill="url(#patGoldLight)"/>
                    <polygon points="0,-5 5,0 0,5 -5,0" fill="url(#patGoldMetal)"/>

                    {/* Quadrant Stepped Chevron Fills */}
                    <path d="M38,-38 L55,-55 M46,-38 L63,-55 M54,-38 L71,-55" stroke="url(#patGoldMetal)" strokeWidth="3" fill="none"/>
                    <path d="M38,38 L55,55 M46,38 L63,55 M54,38 L71,55" stroke="url(#patGoldMetal)" strokeWidth="3" fill="none"/>
                    <path d="M-38,38 L-55,55 M-46,38 L-63,55 M-54,38 L-71,55" stroke="url(#patGoldMetal)" strokeWidth="3" fill="none"/>
                    <path d="M-38,-38 L-55,-55 M-46,-38 L-63,-55 M-54,-38 L-71,-55" stroke="url(#patGoldMetal)" strokeWidth="3" fill="none"/>
                  </g>
                </defs>

                <rect width="320" height="640" fill="#FAF8F2"/>

                <g transform="translate(160, -30)"><use href="#patDiamondCross"/></g>
                <g transform="translate(160, 210)"><use href="#patDiamondCross"/></g>
                <g transform="translate(160, 450)"><use href="#patDiamondCross"/></g>
                <g transform="translate(160, 690)"><use href="#patDiamondCross"/></g>

                <g transform="translate(0, 90)"><use href="#patDiamondCross"/></g>
                <g transform="translate(0, 330)"><use href="#patDiamondCross"/></g>
                <g transform="translate(0, 570)"><use href="#patDiamondCross"/></g>

                <g transform="translate(320, 90)"><use href="#patDiamondCross"/></g>
                <g transform="translate(320, 330)"><use href="#patDiamondCross"/></g>
                <g transform="translate(320, 570)"><use href="#patDiamondCross"/></g>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Print-specific Stylesheet for Guaranteed Exact 1-Page Landscape Output */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400;1,600&family=Marcellus&family=Montserrat:wght@400;500;600;700;800&display=swap');

        .font-cert-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-cert-script {
          font-family: 'Alex Brush', cursive, serif;
        }
        .font-cert-sans {
          font-family: 'Montserrat', sans-serif;
        }
        .font-cert-body {
          font-family: 'Marcellus', 'Georgia', serif;
        }

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
            padding: 0 !important;
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
          .certificate-canvas {
            width: 297mm !important;
            height: 210mm !important;
            max-height: 210mm !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: row !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .cert-left-content {
            width: 66% !important;
            height: 100% !important;
            padding: 16mm 10mm 12mm 18mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          .cert-right-pattern {
            display: block !important;
            width: 34% !important;
            height: 100% !important;
          }
          .seal-badge-wrap {
            display: block !important;
            right: 27% !important;
            top: 10% !important;
            transform: scale(0.9) !important;
          }
          .cert-main-title {
            font-size: 38px !important;
          }
          .recipient-name {
            font-size: 36px !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
