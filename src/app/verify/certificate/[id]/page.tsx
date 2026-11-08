"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
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
} from "lucide-react";
import { toast } from "sonner";
import { courseApi } from "@/lib/api";
import { CourseCertificate } from "@/types";

export default function CourseCertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const certificateId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [loading, setLoading] = React.useState(true);
  const [cert, setCert] = React.useState<CourseCertificate | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (!certificateId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    // First attempt public verification
    courseApi
      .verifyCertificate(certificateId)
      .then((res: any) => {
        if (!mounted) return;
        const certData = res.data || res;
        setCert(certData);
      })
      .catch((err: any) => {
        // If certificateId is a course ObjectId, try fetching as authenticated student
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
  }, [certificateId]);

  // Generate QR code once cert data is loaded
  React.useEffect(() => {
    if (!cert) return;

    const targetUrl =
      cert.verification_url ||
      (typeof window !== "undefined" ? window.location.href : "");

    QRCode.toDataURL(targetUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: "#451a03",
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

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share && cert) {
      try {
        await navigator.share({
          title: `${cert.student_name}'s Vedic Astrology Certificate`,
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

  const rawHtmlDownloadUrl = cert
    ? `${process.env.NEXT_PUBLIC_API_URL || "https://astra-astrology-backend.onrender.com/api/v1"}/courses/certificate/verify/${cert.certificate_id}/html`
    : "";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-6 sm:py-12 px-3 sm:px-6">
      {/* Top Action & Verification Bar (Hidden during Print) */}
      <div className="mx-auto max-w-5xl mb-6 print:hidden">
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
                <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Cryptographically Consecrated & Verified
                </span>
              </div>
              <h1 className="font-serif text-sm sm:text-base font-bold text-neutral-100">
                Astra Gurukul Official Credential Verification
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
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
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mx-auto max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-12 text-center shadow-2xl">
          <Loader2 className="mx-auto size-10 animate-spin text-amber-500" />
          <p className="mt-4 font-serif text-lg font-bold text-neutral-200">
            Consulting Celestial Records...
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
          <div className="certificate-border relative overflow-hidden rounded-2xl border-[10px] border-[#c29b38] bg-[#fdfbf7] p-5 sm:p-10 shadow-2xl text-[#2a1705]">
            {/* Inner Golden Inset Border */}
            <div className="relative rounded-lg border-2 border-[#b8860b] p-6 sm:p-12">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-lg sm:text-2xl text-[#b8860b] opacity-80 select-none">
                ☸
              </div>
              <div className="absolute top-2 right-2 text-lg sm:text-2xl text-[#b8860b] opacity-80 select-none">
                ☸
              </div>
              <div className="absolute bottom-2 left-2 text-lg sm:text-2xl text-[#b8860b] opacity-80 select-none">
                ☸
              </div>
              <div className="absolute bottom-2 right-2 text-lg sm:text-2xl text-[#b8860b] opacity-80 select-none">
                ☸
              </div>

              {/* Watermark Cosmic Mandala in Background */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
                <div className="size-[500px] rounded-full border-[30px] border-[#b8860b] flex items-center justify-center text-[280px] font-serif font-black">
                  ॐ
                </div>
              </div>

              {/* Certificate Header */}
              <div className="relative text-center space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#b8860b]/40 bg-[#b8860b]/10 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-[#78350f]">
                  <Sparkles className="size-3 text-[#b8860b]" />
                  <span>Astra Gurukul • অ্যাস্ট্রা গুরুকুল</span>
                  <Sparkles className="size-3 text-[#b8860b]" />
                </div>
                <h2 className="font-serif text-xs sm:text-sm font-semibold tracking-wider text-[#78350f] uppercase">
                  Council of Vedic Astrological Sciences & Celestial Arts
                </h2>
                <div className="pt-2">
                  <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#3b1e08]">
                    Certificate of Vedic Mastery
                  </h1>
                  <p className="font-serif text-xs sm:text-sm italic text-[#854d0e] mt-1">
                    বৈদিক জ্যোতিষ বিদ্যা পারঙ্গত প্রামাণ্যপত্র
                  </p>
                </div>
              </div>

              {/* Divider Ribbon */}
              <div className="relative mx-auto my-6 flex items-center justify-center gap-3 max-w-md">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#b8860b] to-[#b8860b]" />
                <span className="text-sm font-bold text-[#b8860b]">✦ ॐ ✦</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#b8860b] to-[#b8860b]" />
              </div>

              {/* Certification Statement */}
              <div className="relative text-center space-y-4 max-w-3xl mx-auto">
                <p className="font-serif text-xs sm:text-sm uppercase tracking-widest text-[#78350f]">
                  This is to solemnly certify and consecrate that
                </p>

                {/* Recipient Scholar Name */}
                <div className="py-2">
                  <h3 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#311802] tracking-wide underline decoration-[#c29b38]/50 decoration-wavy underline-offset-8">
                    {cert.student_name}
                  </h3>
                </div>

                {/* Distinction Badge */}
                <div className="inline-flex items-center gap-2 rounded-lg border border-[#c29b38]/40 bg-[#faecc7]/50 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#78350f]">
                  <Award className="size-4 text-[#b8860b]" />
                  <span>{cert.distinction}</span>
                </div>

                <p className="font-serif text-xs sm:text-sm text-[#573312] leading-relaxed max-w-2xl mx-auto">
                  has thoroughly mastered the sacred principles, astronomical calculations,
                  predictive methodologies, and remedies prescribed in the classical curriculum of
                </p>

                {/* Course Title */}
                <div className="rounded-xl border border-[#b8860b]/30 bg-[#fdf6e2]/80 p-3 sm:p-4 shadow-xs">
                  <h4 className="font-serif text-lg sm:text-2xl font-bold text-[#3b1e08]">
                    {cert.course_title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#78350f] mt-1">
                    Completed 100% curriculum ({cert.total_lessons_completed} Lessons & Practicums)
                  </p>
                </div>

                {/* Sanskrit Blessing Shloka */}
                <div className="pt-2 text-center">
                  <p className="font-serif text-xs sm:text-sm italic font-medium text-[#78350f]">
                    {cert.digital_seal?.mantra ||
                      "विद्या ददाति विनयं विनयाद्याति पात्रताम् । पात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥"}
                  </p>
                  <p className="text-[10px] text-[#854d0e] mt-0.5">
                    — Hitopadesha (True knowledge bestows humility, worthiness, and supreme fulfillment)
                  </p>
                </div>
              </div>

              {/* Signatures & Seal Section */}
              <div className="relative mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 pt-6 border-t border-[#b8860b]/30">
                {/* Left Signature: Master Instructor */}
                <div className="text-center sm:text-left order-2 sm:order-1">
                  <div className="font-serif italic text-base sm:text-lg text-[#311802] font-bold">
                    {cert.instructor_name}
                  </div>
                  <div className="h-[1.5px] w-44 mx-auto sm:mx-0 my-1 bg-[#311802]/60" />
                  <p className="text-xs font-semibold text-[#573312]">
                    Lead Master & Acharya
                  </p>
                  <p className="text-[10px] text-[#78350f]">
                    {cert.instructor_title}
                  </p>
                </div>

                {/* Center Medallion Seal */}
                <div className="flex flex-col items-center justify-center order-1 sm:order-2">
                  <div className="relative flex size-24 sm:size-28 items-center justify-center rounded-full border-4 border-[#b8860b] bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#b8860b] p-1 shadow-lg ring-4 ring-[#b8860b]/20 text-neutral-900">
                    <div className="flex size-full flex-col items-center justify-center rounded-full border border-dashed border-[#78350f] bg-[#fef8e7] text-center p-1">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#78350f]">
                        Astra Gurukul
                      </span>
                      <span className="text-xl sm:text-2xl text-[#b8860b] leading-none my-0.5">
                        ☸
                      </span>
                      <span className="text-[8px] font-black uppercase tracking-wider text-[#78350f]">
                        Consecrated
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Signature: Council Registrar & QR Code */}
                <div className="flex flex-col items-center sm:items-end text-center sm:text-right order-3">
                  <div className="flex items-center gap-3">
                    {qrCodeDataUrl && (
                      <div className="relative size-14 sm:size-16 rounded-md border border-[#b8860b]/40 bg-white p-1 shadow-xs">
                        <img
                          src={qrCodeDataUrl}
                          alt="Verification QR Code"
                          className="size-full object-contain"
                        />
                      </div>
                    )}
                    <div className="text-center sm:text-right">
                      <div className="font-serif text-sm font-bold text-[#311802]">
                        Board of Astrological Regents
                      </div>
                      <div className="h-[1.5px] w-36 mx-auto sm:ml-auto my-1 bg-[#311802]/60" />
                      <p className="text-xs font-semibold text-[#573312]">
                        Council Registrar
                      </p>
                      <p className="text-[10px] text-[#78350f]">
                        Director of Celestial Credentials
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata & Hash Strip */}
              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#b8860b]/20 pt-3 text-[10px] text-[#78350f] font-mono">
                <div>
                  Certificate ID:{" "}
                  <span className="font-bold text-[#311802]">
                    {cert.certificate_id}
                  </span>
                </div>
                <div>
                  Issued:{" "}
                  <span className="font-semibold text-[#311802]">
                    {cert.issued_at_formatted}
                  </span>
                </div>
                <div className="truncate max-w-xs">
                  Hash:{" "}
                  <span className="text-[9px] opacity-80">
                    {cert.digital_seal?.verification_hash || "VERIFIED-AUTHENTIC"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print-specific Stylesheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 6mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header,
          footer,
          nav,
          .print\\:hidden {
            display: none !important;
          }
          .certificate-page-wrap {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .certificate-border {
            border-width: 6px !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
