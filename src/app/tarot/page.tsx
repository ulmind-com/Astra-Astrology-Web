"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Compass,
  RotateCw,
  Shuffle,
  Eye,
  CheckCircle2,
  ChevronRight,
  Languages,
  BookOpen,
  Star,
  Search,
  Filter,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Crown,
  Heart,
  CircleDot,
  ArrowRight,
  ShieldAlert,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui";
import { tarotApi } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  FeatureCoinBadge,
  FeatureDisabledAlert,
  FeatureCoinModal,
} from "@/components/astrology/feature-pricing-banner";
import { TarotCardView } from "@/components/tarot/tarot-card-view";
import { TarotFanDeck } from "@/components/tarot/tarot-fan-deck";
import { TarotLanternHero } from "@/components/tarot/tarot-lantern-hero";
import { TarotSpreadLayout } from "@/components/tarot/tarot-spread-layout";
import { TarotReadingDetail } from "@/components/tarot/tarot-reading-detail";
import { fireCelestialConfetti } from "@/components/ui/confetti";
import type {
  SpreadConfig,
  TarotCard,
  TarotDrawResponse,
  QuestionCategory,
  DrawnCardDetail,
} from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import {
  TAROT_I18N,
  SPREADS_METADATA_I18N,
  CARD_NAMES_LOCALIZED,
  ELEMENTS_LOCALIZED,
} from "@/lib/tarot-translations";

function MiniSpreadDiagram({ count, active }: { count: number; active: boolean }) {
  const tone = active
    ? "bg-amber-500 border-amber-600"
    : "bg-amber-200/70 border-amber-400/70 group-hover:bg-amber-400/80";
  const slots = Math.min(count, 6);
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: slots }).map((_, idx) => (
        <span
          key={idx}
          className={`inline-block w-2 h-3 rounded-[2px] border transition-colors ${tone}`}
        />
      ))}
      {count > 6 && (
        <span className="text-[10px] font-bold text-amber-700 ml-0.5">+{count - 6}</span>
      )}
    </div>
  );
}

export default function TarotPage() {
  const { getFeature, checkAccess, walletBalance, refresh: refreshWallet } = useFeaturePricing();
  const tarotFeature = getFeature("tarot");
  const [coinModalOpen, setCoinModalOpen] = React.useState(false);
  const [coinModalReason, setCoinModalReason] = React.useState<
    "unauthorized" | "insufficient_coins" | "disabled"
  >("insufficient_coins");

  const { language, setLanguage } = useLanguage();
  const t = TAROT_I18N[language] || TAROT_I18N.en;

  // Navigation mode: "reading" (wizard) | "explorer" (78 cards catalog)
  const [mainTab, setMainTab] = React.useState<"reading" | "explorer">("reading");

  // Wizard steps: 1 = choose spread, 2 = question & cosmic parameters, 3 = card drawing, 4 = reading results
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Spreads & Deck data from API
  const [spreads, setSpreads] = React.useState<SpreadConfig[]>([]);
  const [deck, setDeck] = React.useState<TarotCard[]>([]);
  const [loadingData, setLoadingData] = React.useState(true);

  // User selections
  const [selectedSpreadId, setSelectedSpreadId] = React.useState<string>("past_present_future");
  const [category, setCategory] = React.useState<QuestionCategory>("general");
  const [question, setQuestion] = React.useState<string>("");
  const [moonSign, setMoonSign] = React.useState<string>("");
  const [dashaLord, setDashaLord] = React.useState<string>("");

  // Interactive draw state
  const [selectedCardIndices, setSelectedCardIndices] = React.useState<number[]>([]);
  const [isShuffling, setIsShuffling] = React.useState(false);
  const [drawingReading, setDrawingReading] = React.useState(false);
  const [readingResult, setReadingResult] = React.useState<TarotDrawResponse | null>(null);
  const [flippedCards, setFlippedCards] = React.useState<boolean[]>([]);

  // Explorer Tab State
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterArcana, setFilterArcana] = React.useState<"all" | "major" | "minor">("all");
  const [filterSuit, setFilterSuit] = React.useState<"all" | "wands" | "cups" | "swords" | "pentacles">("all");
  const [selectedExplorerCard, setSelectedExplorerCard] = React.useState<TarotCard | null>(null);

  // Load initial spreads and deck
  React.useEffect(() => {
    let mounted = true;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab") === "explorer") {
        setMainTab("explorer");
      }
    }
    async function loadTarotInitialData() {
      try {
        setLoadingData(true);
        const [spreadsRes, deckRes] = await Promise.all([
          tarotApi.getSpreads(),
          tarotApi.getDeck(),
        ]);
        if (mounted) {
          if (spreadsRes) setSpreads(spreadsRes);
          if (deckRes) setDeck(deckRes);
        }
      } catch (err) {
        console.error("Failed to load Tarot data:", err);
      } finally {
        if (mounted) setLoadingData(false);
      }
    }
    loadTarotInitialData();
    return () => {
      mounted = false;
    };
  }, []);

  const activeSpreadMeta =
    SPREADS_METADATA_I18N[language]?.[selectedSpreadId] ||
    SPREADS_METADATA_I18N.en[selectedSpreadId] ||
    SPREADS_METADATA_I18N.en.past_present_future;

  const targetCardCount = activeSpreadMeta.card_count;

  // Handle Spread Selection
  const handleSelectSpread = (spreadId: string) => {
    setSelectedSpreadId(spreadId);
    setSelectedCardIndices([]);
    setStep(2);
  };

  // Trigger Shuffle Animation
  const handleShuffle = () => {
    setIsShuffling(true);
    setSelectedCardIndices([]);
    toast.info(
      language === "bn"
        ? "মহাজাগতিক ডেক সফলভাবে শাফেল করা হয়েছে।"
        : language === "hi"
        ? "ब्रह्मांडीय डेक सफलतापूर्वक शफ़ल किया गया।"
        : "Celestial deck shuffled with cosmic entropy."
    );
    setTimeout(() => {
      setIsShuffling(false);
    }, 800);
  };

  // Card Pick in Step 3
  const handleToggleCardPick = (deckIndex: number) => {
    if (selectedCardIndices.includes(deckIndex)) {
      setSelectedCardIndices((prev) => prev.filter((i) => i !== deckIndex));
    } else {
      if (selectedCardIndices.length < targetCardCount) {
        setSelectedCardIndices((prev) => [...prev, deckIndex]);
      } else {
        toast.warning(
          language === "bn"
            ? `আপনি ইতিমধ্যে এই স্প্রেডের সব ${targetCardCount}টি কার্ড বেছে নিয়েছেন।`
            : language === "hi"
            ? `आप पहले ही इस स्प्रेड के सभी ${targetCardCount} कार्ड चुन चुके हैं।`
            : `You have already chosen all ${targetCardCount} cards for this spread.`
        );
      }
    }
  };

  // Auto-Pick for Seeker
  const handleAutoPick = () => {
    const indices: number[] = [];
    const pool = Array.from({ length: 78 }, (_, i) => i);
    while (indices.length < targetCardCount && pool.length > 0) {
      const randIdx = Math.floor(Math.random() * pool.length);
      indices.push(pool.splice(randIdx, 1)[0]);
    }
    setSelectedCardIndices(indices);
    toast.success(
      language === "bn"
        ? `${targetCardCount}টি কার্ড স্বয়ংক্রিয়ভাবে বেছে নেওয়া হয়েছে।`
        : language === "hi"
        ? `${targetCardCount} कार्ड स्वतः चुन लिए गए हैं।`
        : `${targetCardCount} cards intuitively chosen.`
    );
  };

  // Submit and Reveal Reading
  const handleRevealReading = async () => {
    const access = checkAccess("tarot");
    if (!access.allowed) {
      setCoinModalReason(access.reason || "insufficient_coins");
      setCoinModalOpen(true);
      return;
    }

    try {
      setDrawingReading(true);
      const res = await tarotApi.draw({
        spread_id: selectedSpreadId,
        category,
        language,
        question: question.trim() || undefined,
        user_moon_sign: moonSign.trim() || undefined,
        active_dasha_lord: dashaLord.trim() || undefined,
        selected_indices: selectedCardIndices.length > 0 ? selectedCardIndices : undefined,
      });

      if (res && res.drawn_cards) {
        setReadingResult(res);
        setFlippedCards(new Array(res.drawn_cards.length).fill(true));
        setStep(4);
        fireCelestialConfetti();
        refreshWallet();
        if (access.requiredCoins > 0) {
          toast.success(t.coinsDeducted(access.requiredCoins));
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Tarot reading failed. Please retry.");
    } finally {
      setDrawingReading(false);
    }
  };

  // Flip Individual Card
  const handleFlipCard = (index: number) => {
    setFlippedCards((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  // Reset to Step 1
  const handleReset = () => {
    setSelectedCardIndices([]);
    setReadingResult(null);
    setQuestion("");
    setStep(1);
  };

  // Explorer filtered cards
  const filteredCards = React.useMemo(() => {
    return deck.filter((c) => {
      if (filterArcana !== "all" && c.arcana !== filterArcana) return false;
      if (filterSuit !== "all" && c.suit !== filterSuit) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchLoc = (CARD_NAMES_LOCALIZED[language]?.[c.id] || "").toLowerCase().includes(q);
        const matchAstro = c.astrology.toLowerCase().includes(q);
        const matchGraha = c.vedic_graha.toLowerCase().includes(q);
        if (!matchName && !matchLoc && !matchAstro && !matchGraha) return false;
      }
      return true;
    });
  }, [deck, filterArcana, filterSuit, searchQuery, language]);

  const spreadList = Object.values(
    SPREADS_METADATA_I18N[language] || SPREADS_METADATA_I18N.en
  );

  return (
    <div className="min-h-screen bg-[#fbf6f3] text-stone-900 flex flex-col font-sans pb-24 selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader overlay />

      {/* =========================================================================
          1. LANTERN ARCADE INTERACTIVE HERO (Full-Bleed under Dynamic Notch)
      ========================================================================= */}
      <TarotLanternHero title={t.title} />

      <main id="tarot-workspace" className="mx-auto max-w-6xl px-3 sm:px-6 pb-8 flex-1 w-full space-y-8 scroll-mt-20">
        {/* Architectural Sanctuary Threshold Card overlapping Hero horizon smoothly */}
        <section className="relative z-20 -mt-10 sm:-mt-12 rounded-3xl border border-amber-200/90 bg-[#fffcf9]/95 backdrop-blur-md p-4 sm:p-6 shadow-[0_18px_50px_rgba(64,31,7,0.09)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 border-b border-stone-200/70 pb-3">
            <div className="flex items-center gap-1.5 uppercase tracking-wider font-semibold">
              <Link href="/" className="hover:text-amber-700 transition-colors">
                {language === "bn" ? "হোম" : language === "hi" ? "होम" : "Home"}
              </Link>
              <span className="text-stone-300">&gt;</span>
              <span className="text-stone-900 font-bold">{t.title}</span>
            </div>
            <span className="text-stone-500 font-medium">
              {language === "bn"
                ? "আলো ছড়াতে মন্দিরের ওপর মাউস বা আঙুল নাড়ুন · ৭৮টি প্রামাণ্য কার্ড"
                : language === "hi"
                ? "रोशनी फैलाने के लिए मंदिर पर कर्सर घुमाएं · 78 प्रामाणिक कार्ड"
                : "Carry the lantern across the temple arcade above · 78 Arcana"}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-0.5 text-[11px] font-bold text-amber-900">
                  <Sparkles className="size-3 text-amber-600" />
                  <span>{t.badge}</span>
                </div>
                <FeatureCoinBadge
                  feature={tarotFeature}
                  walletBalance={walletBalance}
                  language={language}
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
                {t.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Language Switcher Bar */}
              <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5 text-xs font-semibold shadow-2xs">
                {(
                  [
                    { code: "bn", label: "বাংলা" },
                    { code: "hi", label: "हिन्दी" },
                    { code: "en", label: "English" },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`min-h-7 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-all cursor-pointer ${
                      language === lang.code
                        ? "bg-[#f39419] text-stone-950 shadow-2xs font-extrabold"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Navigation Tabs (Tarot Oracle vs 78 Cards Deck) */}
              <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-100/70 p-1 text-xs shadow-2xs">
                <button
                  type="button"
                  onClick={() => setMainTab("reading")}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mainTab === "reading"
                      ? "bg-[#f39419] text-[#1d1a1c] border border-[#d97b0b] shadow-2xs font-extrabold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>
                    {language === "bn"
                      ? "ট্যারো ওরাকল"
                      : language === "hi"
                      ? "टैरो ऑरेकल"
                      : "Tarot Oracle"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setMainTab("explorer")}
                  className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    mainTab === "explorer"
                      ? "bg-[#f39419] text-[#1d1a1c] border border-[#d97b0b] shadow-2xs font-extrabold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.tabDeckExplorer}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      <div className="space-y-10">
        {/* Feature disabled alert if toggled off in admin */}
        {tarotFeature && tarotFeature.enabled === false && (
          <div className="max-w-2xl mx-auto">
            <FeatureDisabledAlert featureName={t.title} language={language} />
          </div>
        )}

        {/* ===================== TAB 1: READING WIZARD ===================== */}
        {mainTab === "reading" && (
          <div>
            {/* Connected Medallion Stepper */}
            <div className="relative max-w-4xl mx-auto mb-8">
              <div
                aria-hidden="true"
                className="hidden sm:block absolute top-1/2 left-10 right-10 h-px -translate-y-1/2 bg-gradient-to-r from-amber-300/60 via-stone-300 to-amber-300/60"
              />
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {[
                  { stepNum: 1, label: t.stepChooseSpread },
                  { stepNum: 2, label: t.stepAskQuestion },
                  { stepNum: 3, label: t.stepDrawCards },
                  { stepNum: 4, label: t.stepInterpretation },
                ].map((s) => {
                  const isActive = step === s.stepNum;
                  const isDone = step > s.stepNum;
                  const canJump = s.stepNum < step || (s.stepNum === 4 && readingResult);
                  return (
                    <button
                      key={s.stepNum}
                      type="button"
                      onClick={() => {
                        if (canJump) setStep(s.stepNum as 1 | 2 | 3 | 4);
                      }}
                      disabled={!canJump && !isActive}
                      className={`py-2.5 px-3 rounded-2xl border transition-all flex items-center justify-center gap-2 ${
                        isActive
                          ? "border-amber-500 bg-amber-50 text-stone-950 font-bold shadow-sm ring-2 ring-amber-400/20"
                          : isDone
                          ? "border-emerald-300 bg-white text-emerald-900 font-semibold hover:bg-emerald-50/70 cursor-pointer"
                          : "border-stone-200 text-stone-400 bg-white/85"
                      }`}
                    >
                      <span
                        className={`size-5 rounded-full text-[10px] font-bold inline-flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-[#f39419] text-stone-950"
                            : isDone
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {isDone ? "✓" : `0${s.stepNum}`}
                      </span>
                      <span className="line-clamp-1">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 1: SELECT SPREAD */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                    {t.stepChooseSpread}
                  </h2>
                  <p className="text-sm text-stone-600 mt-1">
                    {language === "bn"
                      ? "আপনার প্রশ্নের গভীরতার সাথে সামঞ্জস্যপূর্ণ প্রামাণ্য স্প্রেডটি বেছে নিন।"
                      : language === "hi"
                      ? "अपने प्रश्न की गंभीरता के अनुसार उपयुक्त स्प्रेड चुनें।"
                      : "Select the authentic layout that aligns with your question's depth."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {spreadList.map((s) => {
                    const isSelected = selectedSpreadId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSpreadId(s.id)}
                        onPointerMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          e.currentTarget.style.setProperty("--card-mx", `${e.clientX - rect.left}px`);
                          e.currentTarget.style.setProperty("--card-my", `${e.clientY - rect.top}px`);
                        }}
                        className={`group tarot-magnetic-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-2 border-amber-500 bg-gradient-to-b from-amber-50/90 to-white shadow-md ring-2 ring-amber-400/25 -translate-y-0.5"
                            : "border border-stone-200/90 bg-white hover:border-amber-300 hover:shadow-md hover:-translate-y-1"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/80 px-3 py-0.5 rounded-full shadow-2xs">
                              {s.card_count} {language === "bn" ? "কার্ড" : language === "hi" ? "कार्ड" : s.card_count === 1 ? "Card" : "Cards"}
                            </span>
                            <div className="flex items-center gap-2">
                              <MiniSpreadDiagram count={s.card_count} active={isSelected} />
                              {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />}
                            </div>
                          </div>

                          <h3 className="text-lg font-serif font-bold text-stone-900 mb-2">
                            {s.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                            {s.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-stone-100 text-xs text-amber-800 font-semibold flex items-center justify-between gap-2">
                          <span>
                            {language === "bn" ? "উপযুক্ত:" : language === "hi" ? "उपयुक्त:" : "Ideal for:"} {s.ideal_for}
                          </span>
                          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? "text-amber-700 translate-x-0.5" : "text-stone-300 group-hover:text-amber-600"}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-[#f39419] to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-extrabold px-8 py-3.5 rounded-full shadow-md shadow-amber-500/20"
                  >
                    <span>{t.selectSpreadBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: SET QUESTION & HARMONIC RESONANCE */}
            {step === 2 && (
              <div className="max-w-2xl mx-auto rounded-3xl border border-amber-300/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-stone-900">
                      {t.stepAskQuestion}
                    </h2>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {language === "bn" ? "নির্বাচিত স্প্রেড:" : language === "hi" ? "चयनित स्प्रेड:" : "Selected Spread:"}{" "}
                      <span className="text-amber-800 font-bold">
                        {activeSpreadMeta.name} ({targetCardCount} {language === "bn" ? "কার্ড" : language === "hi" ? "कार्ड" : "Cards"})
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(1)}
                    className="text-xs text-stone-500 hover:text-stone-900"
                  >
                    {language === "bn" ? "স্প্রেড পরিবর্তন" : language === "hi" ? "स्प्रेड बदलें" : "Change Spread"}
                  </Button>
                </div>

                {/* Focus Pillar Pills */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                    {language === "bn" ? "প্রশ্নের মুখ্য ক্ষেত্র" : language === "hi" ? "प्रश्न का मुख्य क्षेत्र" : "Focus Pillar"}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { key: "general", label: t.catGeneral, icon: Compass },
                      { key: "love", label: t.catLove, icon: Heart },
                      { key: "career", label: t.catCareer, icon: Crown },
                      { key: "finance", label: t.catFinance, icon: CircleDot },
                      { key: "spiritual", label: t.catSpiritual, icon: Sparkles },
                    ].map((c) => {
                      const Icon = c.icon;
                      const isCatActive = category === c.key;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          onClick={() => setCategory(c.key as QuestionCategory)}
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                            isCatActive
                              ? "border-2 border-amber-500 bg-amber-50 text-amber-950 shadow-xs"
                              : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isCatActive ? "text-amber-600" : "text-stone-400"}`} />
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sacred Question Input */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t.questionLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.questionPlaceholder}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                {/* Optional Astrological Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">
                      {t.moonSignLabel}
                    </label>
                    <input
                      type="text"
                      value={moonSign}
                      onChange={(e) => setMoonSign(e.target.value)}
                      placeholder={t.moonSignPlaceholder}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1.5">
                      {t.dashaLordLabel}
                    </label>
                    <input
                      type="text"
                      value={dashaLord}
                      onChange={(e) => setDashaLord(e.target.value)}
                      placeholder={t.dashaLordPlaceholder}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-stone-600">
                    {language === "bn" ? "পেছনে যান" : language === "hi" ? "वापस जाएं" : "Back"}
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-[#f39419] to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-extrabold px-6 py-2.5 rounded-full shadow-xs"
                  >
                    <span>{t.startDrawBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: INTERACTIVE TACTILE SHUFFLE & CARD PICKING */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Control Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-stone-900">
                      {t.stepDrawCards}
                    </h2>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">
                      {selectedCardIndices.length < targetCardCount
                        ? t.pickCardPrompt(targetCardCount - selectedCardIndices.length, targetCardCount)
                        : t.cardsReadyPrompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleShuffle}
                      disabled={isShuffling}
                      className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50/80 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Shuffle className={`w-3.5 h-3.5 mr-1.5 ${isShuffling ? "animate-spin" : ""}`} />
                      <span>{t.shuffleDeckBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoPick}
                      className="inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                      <span>{t.autoPickBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Selected Cards Preview Slots */}
                <div className="p-5 rounded-3xl border border-[#d4af37]/40 bg-gradient-to-b from-[#1b1018] via-[#120a11] to-[#0c050a] flex items-center justify-center gap-3.5 sm:gap-4 flex-wrap shadow-inner">
                  {Array.from({ length: targetCardCount }).map((_, slotIdx) => {
                    const pickedIndex = selectedCardIndices[slotIdx];
                    const isPicked = pickedIndex !== undefined;
                    return (
                      <button
                        key={slotIdx}
                        type="button"
                        onClick={() => isPicked && handleToggleCardPick(pickedIndex)}
                        title={isPicked ? "Click to remove card" : undefined}
                        className={`relative overflow-hidden w-18 h-28 sm:w-22 sm:h-32 rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                          isPicked
                            ? "border-[#d4af37] bg-[#1a0b0e] text-[#fae8b2] shadow-lg ring-2 ring-[#d4af37]/45 hover:-translate-y-1 cursor-pointer"
                            : "border-dashed border-[#d4af37]/30 bg-black/30 text-[#d4ba94]/60 cursor-default"
                        }`}
                      >
                        {isPicked ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/tarot/card-back-fan.webp"
                              alt=""
                              draggable={false}
                              className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
                            />
                            <div className="relative z-10 px-2 py-0.5 rounded-full bg-black/75 border border-[#d4af37]/75 text-[10px] font-serif font-bold text-[#fae8b2] tracking-wide shadow-sm">
                              #{slotIdx + 1}
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-serif font-bold text-[#d4ba94]/50 mb-0.5">
                              {slotIdx + 1}
                            </span>
                            <span className="text-[9px] text-[#d4ba94]/60 font-medium">
                              {language === "bn" ? `স্থান` : language === "hi" ? `स्थान` : `Slot`}
                            </span>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Curved Interactive 3D Fanned Arc Tarot Deck */}
                <TarotFanDeck
                  selectedIndices={selectedCardIndices}
                  targetCount={targetCardCount}
                  isShuffling={isShuffling}
                  onTogglePick={handleToggleCardPick}
                  language={language}
                />

                {/* Action button to reveal reading */}
                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    disabled={selectedCardIndices.length < targetCardCount || drawingReading}
                    onClick={handleRevealReading}
                    className="bg-gradient-to-r from-[#f39419] to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-extrabold px-10 py-3.5 rounded-full text-base shadow-md shadow-amber-500/20 disabled:opacity-50"
                  >
                    {drawingReading ? (
                      <>
                        <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                        <span>
                          {language === "bn"
                            ? "মহাজাগতিক ফলাফল তৈরি হচ্ছে..."
                            : language === "hi"
                            ? "ब्रह्मांडीय फलादेश प्रकट हो रहा है..."
                            : "Channeling Arcana Oracle..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span>{t.revealReadingBtn}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: DIVINE READING & RESULTS */}
            {step === 4 && readingResult && (
              <div className="space-y-8 animate-fadeIn">
                {/* Unified Master Spread Container */}
                <div className="rounded-3xl border border-[#d4af37]/40 bg-gradient-to-b from-[#180e16] via-[#120910] to-[#090407] p-6 sm:p-8 shadow-xl text-stone-100">
                  {/* Master Header with Question and Actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#d4af37]/20">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs uppercase font-bold tracking-wider text-[#fae8b2] bg-[#1f121a]/80 border border-[#d4af37]/40 px-3 py-0.5 rounded-full shadow-2xs">
                          {readingResult.spread_name}
                        </span>
                        <span className="text-xs text-[#d4ba94] font-bold uppercase tracking-wide">
                          • {category.toUpperCase()}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fffaf0] via-[#fdefcc] to-[#dfba6f]">
                        {readingResult.question || activeSpreadMeta.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#d4ba94] mt-1">
                        {t.readingSubtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setFlippedCards((prev) => prev.map(() => true))}
                        className="inline-flex items-center justify-center rounded-xl border border-[#d4af37]/35 bg-[#1f121a]/70 px-3.5 py-2 text-xs font-bold text-[#fae8b2] hover:bg-[#2c1a25] shadow-2xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1.5 text-[#d4af37]" />
                        <span>{t.flipAllBtn}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center rounded-xl border border-amber-500/50 bg-gradient-to-r from-[#f39419] to-amber-500 px-3.5 py-2 text-xs font-bold text-stone-950 hover:from-amber-500 hover:to-amber-600 shadow-2xs transition-colors cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5 mr-1.5 text-stone-950" />
                        <span>{t.newReadingBtn}</span>
                      </button>
                    </div>
                  </div>

                  {/* Render the Spatial Spread Layout with full breathing room */}
                  <TarotSpreadLayout
                    spreadId={selectedSpreadId}
                    cards={readingResult.drawn_cards}
                    flippedState={flippedCards}
                    onFlipCard={handleFlipCard}
                    language={language}
                  />
                </div>

                {/* Master Reading Detail Component (Predictions, Synthesis, Remedies, Mantras) */}
                <TarotReadingDetail
                  reading={readingResult}
                  language={language}
                  onReset={handleReset}
                />
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 2: 78 ARCANA DECK EXPLORER ===================== */}
        {mainTab === "explorer" && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950">
                {language === "bn"
                  ? "৭৮টি প্রামাণ্য ট্যারো আর্খানা সংগ্রহ"
                  : language === "hi"
                  ? "78 प्रामाणिक टैरो आर्काना संग्रह"
                  : "The Complete 78 Arcana Deck"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {language === "bn"
                  ? "মেজর ও মাইনর আর্খানার প্রতীকী অর্থ, পঞ্চভূত তত্ত্ব, বৈদিক গ্রহ সংযোগ ও দ্বি-মুখী ব্যাখ্যা জানুন।"
                  : language === "hi"
                  ? "मेजर व माइनर आर्काना के प्रतीक, पंचतत्व, वैदिक ग्रह संबंध और द्विपक्षीय अर्थ समझें।"
                  : "Explore canonical Major and Minor Arcana symbolism, elemental dignities, Vedic Grahas, and dual-pole interpretations."}
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === "bn"
                      ? "কার্ডের নাম বা গ্রহ দিয়ে খুঁজুন..."
                      : language === "hi"
                      ? "कार्ड का नाम या ग्रह से खोजें..."
                      : "Search by card name, sign or graha..."
                  }
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/60 pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Arcana Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-stone-500 font-semibold">
                  {language === "bn" ? "আর্খানা:" : language === "hi" ? "आर्काना:" : "Arcana:"}
                </span>
                {(["all", "major", "minor"] as const).map((arc) => (
                  <button
                    key={arc}
                    onClick={() => setFilterArcana(arc)}
                    className={`px-3 py-1 rounded-full border capitalize transition-colors font-semibold cursor-pointer ${
                      filterArcana === arc
                        ? "border-amber-500 bg-[#f39419] text-stone-950 font-bold shadow-2xs"
                        : "border-stone-200 bg-white text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {arc}
                  </button>
                ))}
              </div>

              {/* Suit Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-stone-500 font-semibold">
                  {language === "bn" ? "স্যুট:" : language === "hi" ? "सूट:" : "Suit:"}
                </span>
                {(["all", "wands", "cups", "swords", "pentacles"] as const).map((suit) => (
                  <button
                    key={suit}
                    onClick={() => setFilterSuit(suit)}
                    className={`px-3 py-1 rounded-full border capitalize transition-colors font-semibold cursor-pointer ${
                      filterSuit === suit
                        ? "border-amber-500 bg-[#f39419] text-stone-950 font-bold shadow-2xs"
                        : "border-stone-200 bg-white text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    {suit}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
              {filteredCards.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedExplorerCard(c)}
                  className="cursor-pointer group"
                >
                  <TarotCardView
                    card={c}
                    isFlipped={true}
                    size="sm"
                    showPositionHeader={false}
                    language={language}
                  />
                </div>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12 text-stone-500 text-sm">
                {language === "bn"
                  ? "কোনো কার্ড খুঁজে পাওয়া যায়নি।"
                  : language === "hi"
                  ? "कोई कार्ड नहीं मिला।"
                  : "No cards match your filter query."}
              </div>
            )}
          </div>
        )}

        {/* Selected Card Modal in Explorer */}
        {selectedExplorerCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-3xl border border-[#d4af37]/45 bg-gradient-to-b from-[#1a0f18] via-[#120a11] to-[#090407] text-stone-100 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                type="button"
                onClick={() => setSelectedExplorerCard(null)}
                className="absolute top-4 right-4 text-[#d4ba94] hover:text-white p-1.5 rounded-lg border border-[#d4af37]/30 bg-[#22131e]/70 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                <TarotCardView
                  card={selectedExplorerCard}
                  isFlipped={true}
                  size="md"
                  showPositionHeader={false}
                  language={language}
                />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1.5">
                    <span className="text-xs uppercase font-bold text-[#fae8b2] bg-[#22131e]/80 border border-[#d4af37]/40 px-2.5 py-0.5 rounded-full shadow-2xs">
                      {selectedExplorerCard.arcana} Arcana
                    </span>
                    <span className="text-xs text-[#d4ba94] font-semibold">
                      • {ELEMENTS_LOCALIZED[language]?.[selectedExplorerCard.element] || selectedExplorerCard.element}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fffaf0] via-[#fdefcc] to-[#dfba6f]">
                    {CARD_NAMES_LOCALIZED[language]?.[selectedExplorerCard.id] || selectedExplorerCard.name}
                  </h3>
                  <p className="text-xs text-[#d4ba94] font-medium mt-1">
                    Astrology: <strong className="text-[#fae8b2]">{selectedExplorerCard.astrology}</strong> | Vedic Graha: <strong className="text-[#fae8b2]">{selectedExplorerCard.vedic_graha}</strong>
                  </p>

                  <div className="mt-4 p-3 rounded-xl border border-[#d4af37]/30 bg-[#22131e]/60 text-xs text-[#fae8b2]">
                    <strong>{language === "bn" ? "সংকল্প বাণী:" : language === "hi" ? "सकारात्मक विचार:" : "Affirmation:"}</strong> &ldquo;{selectedExplorerCard.affirmation}&rdquo;
                  </div>
                </div>
              </div>

              {/* Interpretations */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30">
                  <h4 className="font-serif font-bold text-emerald-300 mb-1">
                    {language === "bn" ? "সোজা (জাগ্রত অবস্থা)" : language === "hi" ? "सीधी स्थिति (सकारात्मक)" : "Upright Meaning"}
                  </h4>
                  <p className="text-stone-300 leading-relaxed mb-2">
                    {selectedExplorerCard.upright.general}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedExplorerCard.upright.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-semibold text-emerald-300 bg-[#0c1e14] border border-emerald-500/40 px-2 py-0.5 rounded shadow-2xs">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/30">
                  <h4 className="font-serif font-bold text-rose-300 mb-1">
                    {language === "bn" ? "উল্টো (অন্তর্মুখী রূপান্তর)" : language === "hi" ? "उल्टी स्थिति (आंतरिक बदलाव)" : "Reversed Meaning"}
                  </h4>
                  <p className="text-stone-300 leading-relaxed mb-2">
                    {selectedExplorerCard.reversed.general}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedExplorerCard.reversed.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-semibold text-rose-300 bg-[#220e14] border border-rose-500/40 px-2 py-0.5 rounded shadow-2xs">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/30">
                  <h4 className="font-serif font-bold text-[#fae8b2] mb-1">
                    {language === "bn" ? "শাস্ত্রীয় বৈদিক প্রতিকার" : language === "hi" ? "वैदिक ज्योतिषीय उपाय" : "Astrological Remedy"}
                  </h4>
                  <p className="text-stone-300 leading-relaxed">
                    {selectedExplorerCard.remedy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Coin Modal */}
        <FeatureCoinModal
          open={coinModalOpen}
          onClose={() => setCoinModalOpen(false)}
          featureName={t.title}
          requiredCoins={tarotFeature?.coins ?? 0}
          walletBalance={walletBalance}
          reason={coinModalReason}
          language={language}
        />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
