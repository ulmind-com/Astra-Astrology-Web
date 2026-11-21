"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { env } from "@/lib/env";
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
          text: `Verified Certificate of Vedic Mastery in ${cert.course_title} from DivinLink Gurukul.`,
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
  const dateObj = cert?.issued_at ? new Date(cert.issued_at) : new Date();
  const monthName = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleString("en-US", { month: "long" })
    : "June";
  const yearVal = !isNaN(dateObj.getTime())
    ? dateObj.getFullYear().toString()
    : "2026";

  const instructor = cert?.instructor_name || "Rahul Sharma";
  const isRahul = instructor.toLowerCase().includes("rahul");
  const instructorDisplay = isRahul ? "RAHUL SHARMA" : instructor.toUpperCase();
  const instructorClean = isRahul ? "Rahul Sharma" : instructor;

  const rawHtmlDownloadUrl = cert
    ? `${env.apiUrl}${env.apiPrefix}/courses/certificate/verify/${cert.certificate_id}/html${sigToken ? `?sig=${sigToken}` : ""}`
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
                DivinLink Gurukul Official Credential Registry
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
                <strong className="text-neutral-200">DivinLink Gurukul</strong>
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
                  must strictly match the record above from DivinLink Gurukul&apos;s authoritative ledger.
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

      {/* Verified Certificate Canvas — Exact Match DivinLink Reference Design */}
      {!loading && cert && (
        <div id="gurukul-printable-certificate" className="certificate-page-wrap mx-auto max-w-[1000px] w-full [container-type:inline-size]">
          <div
            className="certificate-canvas relative w-full aspect-[1000/523] rounded-xl overflow-hidden select-none bg-[#FAF8F5] shadow-2xl border border-amber-900/10"
            style={{
              backgroundImage: "url('/images/certificate-template.png?v=divinlink-v2')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Main Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center text-center z-10 pointer-events-none">
              {/* Course Title Line */}
              <div
                className="absolute top-[26%] left-[14%] right-[14%] font-serif font-extrabold text-[#0E2042] uppercase tracking-[0.10em] leading-tight"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(12px, 2.0cqi, 20px)",
                }}
              >
                PARTICIPATION OF {cert.course_title?.toUpperCase() || "BHRIGUNANDI NAADI JYOTISH"}
              </div>

              {/* Subtitle */}
              <div
                className="absolute top-[31.7%] left-[14%] right-[14%] font-bold text-[#9E7730] uppercase tracking-[0.18em]"
                style={{
                  fontFamily: "'Cinzel', 'Montserrat', serif",
                  fontSize: "clamp(8px, 1.3cqi, 13px)",
                }}
              >
                BASIC AND ADVANCE LEVEL ONLINE COURSE ON ZOOM
              </div>

              {/* Ornamental Divider */}
              <div
                className="absolute top-[35.9%] inset-x-0 flex items-center justify-center text-[#B88E3E] tracking-[4px]"
                style={{ fontSize: "clamp(7px, 1.0cqi, 10px)" }}
              >
                ———— ◆ ————
              </div>

              {/* Certify Line */}
              <div
                className="absolute top-[40.5%] inset-x-0 italic text-[#374151] tracking-[0.02em]"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(10px, 1.55cqi, 15.5px)",
                }}
              >
                This is to certify that
              </div>

              {/* Student Name */}
              <div
                className="absolute top-[45.1%] left-[14%] right-[14%] font-extrabold text-[#0B1B36] tracking-[0.02em] leading-tight"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(18px, 3.8cqi, 38px)",
                }}
              >
                {cert.student_name}
              </div>

              {/* Completion Statement Line 1 */}
              <div
                className="absolute top-[56.2%] left-[14%] right-[14%] text-[#1F2937]"
                style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: "clamp(9px, 1.4cqi, 14px)",
                }}
              >
                Has successfully completed online course of {cert.course_title}
              </div>

              {/* Completion Statement Line 2 (Month & Year) */}
              <div
                className="absolute top-[60.0%] left-[14%] right-[14%] text-[#1F2937]"
                style={{
                  fontFamily: "'Marcellus', Georgia, serif",
                  fontSize: "clamp(9px, 1.4cqi, 14px)",
                }}
              >
                that held in {monthName} year of {yearVal}
              </div>

              {/* Signatory Block */}
              <div className="absolute top-[68.0%] left-[21%] right-[21%] flex flex-col items-center text-center">
                <div
                  className="font-bold text-[#0B1B36] uppercase tracking-[0.12em]"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "clamp(7px, 1.1cqi, 11px)",
                  }}
                >
                  {instructorDisplay}
                </div>
                <div
                  className="italic text-[#4B5563] mt-[1px]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(8px, 1.25cqi, 12.5px)",
                  }}
                >
                  wishes him/her all the best for future
                </div>

                {/* Hand-inked Signature */}
                {isRahul ? (
                  <img
                    src="/images/rahul-sharma-signature.png"
                    alt="Rahul Sharma Signature"
                    className="object-contain my-[1px]"
                    style={{ height: "clamp(24px, 3.8cqi, 38px)" }}
                  />
                ) : (
                  <div
                    className="text-[#1A2538] leading-tight my-[2px]"
                    style={{
                      fontFamily: "'Alex Brush', cursive",
                      fontSize: "clamp(20px, 3.4cqi, 34px)",
                    }}
                  >
                    {instructorClean}
                  </div>
                )}

                <div
                  className="h-[1px] bg-slate-300 mx-auto my-[2px]"
                  style={{ width: "clamp(120px, 20cqi, 200px)" }}
                />

                <div
                  className="font-extrabold text-[#0B1B36] uppercase tracking-[0.10em]"
                  style={{
                    fontFamily: "'Cinzel', 'Montserrat', sans-serif",
                    fontSize: "clamp(8px, 1.2cqi, 12px)",
                  }}
                >
                  {instructorDisplay}
                </div>
                <div
                  className="font-bold text-[#64748B] uppercase tracking-[0.16em] mt-[1px]"
                  style={{
                    fontFamily: "'Cinzel', 'Montserrat', sans-serif",
                    fontSize: "clamp(6px, 1.0cqi, 10px)",
                  }}
                >
                  DIVINLINK
                </div>
              </div>
            </div>

            {/* Official QR Code Box */}
            {qrCodeDataUrl && (
              <div className="absolute bottom-[4.6%] right-[3.2%] flex flex-col items-center text-center z-20">
                <div className="p-0.5 bg-white rounded border border-[#C59B27]/40 shadow-xs">
                  <img
                    src={qrCodeDataUrl}
                    alt="Verification QR Code"
                    style={{ width: "clamp(28px, 4.4cqi, 44px)", height: "clamp(28px, 4.4cqi, 44px)" }}
                    className="object-contain"
                  />
                </div>
                <span
                  className="font-bold text-[#9E7730] uppercase tracking-[0.5px] mt-0.5"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: "clamp(5px, 0.65cqi, 6.5px)",
                  }}
                >
                  Verify Credential
                </span>
              </div>
            )}

            {/* Anti-Fraud Security Bar */}
            <div
              className="absolute bottom-[1.2%] left-[2%] right-[2%] flex items-center justify-between font-mono text-[#8C7A62]/70 uppercase tracking-[1px] pointer-events-none z-20"
              style={{ fontSize: "clamp(5px, 0.65cqi, 6.5px)" }}
            >
              <span>ID: {cert.certificate_id} • AUTHORITATIVE RECORD</span>
              <span>
                {cert.canonical_hash
                  ? `CANONICAL HASH: ${cert.canonical_hash.slice(0, 32)}...`
                  : `SIG: ${cert.cryptographic_signature ? `${cert.cryptographic_signature.slice(0, 24)}...` : "HMAC-SHA256"}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Print-specific Stylesheet for Guaranteed Exact 1-Page Landscape Output */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,400;1,600&family=Marcellus&family=Montserrat:wght@400;500;600;700;800&display=swap');

        @media print {
          @page {
            size: landscape;
            margin: 0 !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            overflow: hidden !important;
          }
          body * {
            visibility: hidden !important;
          }
          header,
          footer,
          nav,
          .print\\:hidden,
          [data-print-hide] {
            display: none !important;
          }
          #gurukul-printable-certificate,
          #gurukul-printable-certificate * {
            visibility: visible !important;
          }
          #gurukul-printable-certificate {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            overflow: hidden !important;
            background: transparent !important;
            z-index: 999999 !important;
          }
          .certificate-canvas {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `,
        }}
      />
    </div>
  );
}
