"use client";

import { RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import * as React from "react";

import { HoroscopeContent } from "../page";

export default function SignHoroscopePage() {
  const params = useParams();
  const sign = String(params?.sign ?? "aries");

  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#faf6f0]">
          <RotateCcw className="size-8 animate-spin text-[#b06d4e]" />
        </div>
      }
    >
      <HoroscopeContent detailSign={sign} />
    </React.Suspense>
  );
}
