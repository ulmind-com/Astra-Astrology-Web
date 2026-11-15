"use client";

import React from "react";
import dynamic from "next/dynamic";
import { X, Sparkles, ShieldCheck } from "lucide-react";

// Dynamically import the 3D Viewer with SSR disabled to ensure zero hydration mismatch
const Sacred3DViewer = dynamic(
  () => import("./sacred-3d-viewer").then((mod) => mod.Sacred3DViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-[280px] h-[280px] flex flex-col items-center justify-center gap-2 text-xs text-amber-700">
        <div className="size-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <span>Loading Sacred 3D Gem Model...</span>
      </div>
    ),
  }
);

interface Product3DModalProps {
  open: boolean;
  onClose: () => void;
  productName?: string;
  category?: string;
  product?: { title: string; category_slug?: string; category_type?: string } | null;
}

export function Product3DModal({
  open,
  onClose,
  productName: productNameProp,
  category: categoryProp,
  product,
}: Product3DModalProps) {
  if (!open) return null;

  const productName = productNameProp || product?.title || "Sacred Item";
  const category = categoryProp || product?.category_slug || product?.category_type || "gemstone";

  // Derive gem color dynamically based on product name/category
  const name = productName.toLowerCase();
  let gemColor = "#f59e0b"; // Golden/Citrine default
  if (name.includes("sapphire") || name.includes("neelam") || name.includes("নীলম")) {
    gemColor = "#2563eb"; // Blue Sapphire
  } else if (name.includes("emerald") || name.includes("panna") || name.includes("পান্না")) {
    gemColor = "#059669"; // Emerald Green
  } else if (name.includes("ruby") || name.includes("manik") || name.includes("চুনি") || name.includes("coral")) {
    gemColor = "#dc2626"; // Ruby Red
  } else if (name.includes("rudraksha") || name.includes("রুদ্রাক্ষ")) {
    gemColor = "#92400e"; // Sacred Mukhi Rudraksha Wood Amber
  } else if (name.includes("amethyst") || name.includes("জ্যামেথিস্ট")) {
    gemColor = "#7c3aed"; // Sacred Purple
  } else if (name.includes("pyrite") || name.includes("গোল্ড")) {
    gemColor = "#eab308"; // Golden Pyrite
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm rounded-3xl border border-amber-200/90 bg-[#faf8f5] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="text-center space-y-1 mb-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
            <Sparkles className="size-3 text-amber-600" />
            <span>3D Occult Specimen</span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
            {productName}
          </h3>
          <p className="text-xs text-stone-500">
            Consecrated Vedic Energy & Sacred Crystallography
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="flex justify-center bg-white/70 rounded-2xl border border-stone-200/80 my-3 shadow-inner">
          <Sacred3DViewer gemColor={gemColor} gemName={productName} />
        </div>

        <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-200">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>100% Lab Certified</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#fcd404] hover:bg-[#e6be00] text-stone-950 font-extrabold px-4 py-1.5 text-xs shadow-xs border border-[#d9af00] cursor-pointer"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
}
