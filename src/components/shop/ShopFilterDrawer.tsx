"use client";

import * as React from "react";
import { Drawer } from "vaul";
import { Filter, X, Check, Sparkles, RotateCcw } from "lucide-react";

import type { ShopProductCategory } from "@/lib/api";

interface ShopFilterDrawerProps {
  categories?: ShopProductCategory[];
  selectedCategory: string;
  onSelectCategory: (val: string) => void;
  selectedPlanet: string;
  onSelectPlanet: (val: string) => void;
  selectedPurpose: string;
  onSelectPurpose: (val: string) => void;
  onResetFilters: () => void;
  activeCount: number;
  language?: "bn" | "hi" | "en";
}

const PLANETS = [
  { id: "Sun", bn: "সূর্য (রবি)", en: "Sun" },
  { id: "Moon", bn: "চন্দ্র", en: "Moon" },
  { id: "Mars", bn: "মঙ্গল", en: "Mars" },
  { id: "Mercury", bn: "বুধ", en: "Mercury" },
  { id: "Jupiter", bn: "বৃহস্পতি (গুরু)", en: "Jupiter" },
  { id: "Venus", bn: "শুক্র", en: "Venus" },
  { id: "Saturn", bn: "শনি দেব", en: "Saturn" },
  { id: "Rahu", bn: "রাহু", en: "Rahu" },
  { id: "Ketu", bn: "কেতু", en: "Ketu" },
];

const PURPOSES = [
  { id: "wealth", bn: "ধন ও অর্থ আকর্ষণ", en: "Wealth & Prosperity" },
  { id: "career", bn: "চাকরি ও পদোন্নতি", en: "Career & Promotion" },
  { id: "protection", bn: "নজর দোষ ও সুরক্ষা", en: "Evil Eye & Protection" },
  { id: "dosha", bn: "শনি সাড়েসাতি ও মাঙ্গলিক", en: "Dosha Nivaran" },
  { id: "love", bn: "প্রেম ও দাম্পত্য সুখ", en: "Love & Harmony" },
  { id: "health", bn: "স্বাস্থ্য ও মানসিক শান্তি", en: "Health & Peace" },
];

const DEFAULT_CATEGORIES = [
  { id: "rudraksh", bn: "রুদ্রাক্ষ", en: "Rudraksh" },
  { id: "zodiac", bn: "রাশি কালেকশন", en: "Zodiac Collection" },
  { id: "bracelets", bn: "ব্রেসলেট ও আংটি", en: "Bracelets & Rings" },
  { id: "rudraksha", bn: "নেপালি রুদ্রাক্ষ", en: "Nepali Rudraksha" },
  { id: "karungali", bn: "আসল করুঙ্গালি", en: "Original Karungali" },
  { id: "vastu-home", bn: "বাস্তু ও গৃহ সামগ্রী", en: "Vastu & Home" },
];

export function ShopFilterDrawer({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedPlanet,
  onSelectPlanet,
  selectedPurpose,
  onSelectPurpose,
  onResetFilters,
  activeCount,
  language = "bn",
}: ShopFilterDrawerProps) {
  const [open, setOpen] = React.useState(false);

  const activeCategories = React.useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((c) => ({
        id: c.slug,
        bn: c.name,
        en: c.name,
      }));
    }
    return DEFAULT_CATEGORIES;
  }, [categories]);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          className="relative inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-900 shadow-xs hover:bg-amber-500/20 active:scale-95 transition-all md:hidden cursor-pointer"
        >
          <Filter className="size-3.5 text-amber-700" />
          <span>{language === "bn" ? "ফিল্টার ও বাছাই" : "Filter Remedies"}</span>
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-black text-white">
              {activeCount}
            </span>
          )}
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-[32px] bg-white border-t border-amber-300 shadow-2xl focus:outline-hidden">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-stone-300" />

          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <div>
              <Drawer.Title className="font-cinzel text-base font-bold text-stone-900 flex items-center gap-1.5">
                <Sparkles className="size-4 text-amber-600" />
                <span>{language === "bn" ? "প্রতিকার বাছাই ফিল্টার" : "Filter Sacred Remedies"}</span>
              </Drawer.Title>
              <Drawer.Description className="text-[11px] text-stone-500">
                {language === "bn"
                  ? "গ্রহ, উদ্দেশ্য ও সামগ্রী অনুযায়ী তাৎক্ষণিক খুঁজুন"
                  : "Filter by ruling planet, purpose, and remedy category"}
              </Drawer.Description>
            </div>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200"
              >
                <RotateCcw className="size-3" />
                <span>{language === "bn" ? "রিসেট" : "Reset"}</span>
              </button>
            )}
          </div>

          {/* Drawer Body Scroll */}
          <div className="overflow-y-auto p-6 space-y-6 text-xs">
            {/* Category Filter */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                {language === "bn" ? "ক্যাটাগরি (Category)" : "Category"}
              </h5>
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(isSelected ? "" : cat.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-amber-700 text-white shadow-xs"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {isSelected && <Check className="size-3 text-white" />}
                      <span>{language === "bn" ? cat.bn : cat.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ruling Planet */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                {language === "bn" ? "গ্রহ ও গ্রহদোষ (Ruling Planet)" : "Ruling Planet"}
              </h5>
              <div className="grid grid-cols-3 gap-2">
                {PLANETS.map((planet) => {
                  const isSelected = selectedPlanet === planet.id;
                  return (
                    <button
                      key={planet.id}
                      type="button"
                      onClick={() => onSelectPlanet(isSelected ? "" : planet.id)}
                      className={`rounded-xl px-2.5 py-2 text-center text-xs font-semibold transition-all border ${
                        isSelected
                          ? "border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs"
                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {language === "bn" ? planet.bn : planet.en}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purpose */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                {language === "bn" ? "উদ্দেশ্য (Life Goal / Need)" : "Purpose"}
              </h5>
              <div className="flex flex-wrap gap-2">
                {PURPOSES.map((pur) => {
                  const isSelected = selectedPurpose === pur.id;
                  return (
                    <button
                      key={pur.id}
                      type="button"
                      onClick={() => onSelectPurpose(isSelected ? "" : pur.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs"
                          : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      {isSelected && <Check className="size-3 text-emerald-700" />}
                      <span>{language === "bn" ? pur.bn : pur.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Drawer Footer CTA */}
          <div className="border-t border-stone-200 p-4 bg-stone-50 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-2xl bg-amber-700 py-3 text-center text-xs font-bold text-white shadow-md active:scale-98 transition-all hover:bg-amber-800"
            >
              {language === "bn" ? "প্রতিকার দেখুন (Apply)" : "Show Remedies"}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
