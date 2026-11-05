"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function PalmReadingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log error to console for debugging
    console.error("PalmReading error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-ink-950 text-white">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-400 mb-4">
          <AlertTriangle className="size-7" />
        </div>

        <h2 className="text-xl font-black text-white sm:text-2xl">
          হস্তরেখা পাতাটি লোড হতে সমস্যা হয়েছে
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
          ছবি স্ক্যান বা প্রক্রিয়া করার সময় সাময়িক ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।
        </p>

        {error?.message && (
          <div className="mt-4 rounded-xl bg-black/50 p-2.5 text-[11px] font-mono text-amber-300/80 border border-white/10 truncate">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto gap-2 bg-brand-500 font-bold text-ink-950 hover:bg-brand-400 cursor-pointer"
          >
            <RefreshCw className="size-4" />
            পুনরায় চেষ্টা করুন
          </Button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all gap-2 cursor-pointer"
          >
            <Home className="size-4" />
            হোমে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
