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
import { TarotSpreadLayout } from "@/components/tarot/tarot-spread-layout";
import { TarotReadingDetail } from "@/components/tarot/tarot-reading-detail";
import type {
  SpreadConfig,
  TarotCard,
  TarotDrawResponse,
  QuestionCategory,
  DrawnCardDetail,
} from "@/types/tarot";
import type { AstrologyLanguage } from "@/types";
import { TAROT_I18N } from "@/lib/tarot-translations";

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
        toast.error("Could not load Tarot deck. Please check server.");
      } finally {
        if (mounted) setLoadingData(false);
      }
    }
    loadTarotInitialData();
    return () => {
      mounted = false;
    };
  }, []);

  const activeSpread = spreads.find((s) => s.id === selectedSpreadId) || spreads[0];
  const targetCardCount = activeSpread?.card_count || 3;

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
    toast.info("Celestial deck shuffled with cosmic entropy.");
    setTimeout(() => {
      setIsShuffling(false);
    }, 900);
  };

  // Card Pick in Step 3
  const handleToggleCardPick = (deckIndex: number) => {
    if (selectedCardIndices.includes(deckIndex)) {
      setSelectedCardIndices((prev) => prev.filter((i) => i !== deckIndex));
    } else {
      if (selectedCardIndices.length < targetCardCount) {
        setSelectedCardIndices((prev) => [...prev, deckIndex]);
      } else {
        toast.warning(`You have already chosen all ${targetCardCount} cards for this spread.`);
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
    toast.success(`${targetCardCount} cards intuitively chosen.`);
  };

  // Submit and Reveal Reading
  const handleRevealReading = async () => {
    // Check feature coins / access
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
        question: question.trim() || undefined,
        user_moon_sign: moonSign.trim() || undefined,
        active_dasha_lord: dashaLord.trim() || undefined,
        selected_indices: selectedCardIndices.length > 0 ? selectedCardIndices : undefined,
      });

      if (res && res.drawn_cards) {
        setReadingResult(res);
        // Start all cards face down so seeker can experience dramatic reveal flip
        setFlippedCards(new Array(res.drawn_cards.length).fill(true));
        setStep(4);
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
        const matchAstro = c.astrology.toLowerCase().includes(q);
        const matchGraha = c.vedic_graha.toLowerCase().includes(q);
        if (!matchName && !matchAstro && !matchGraha) return false;
      }
      return true;
    });
  }, [deck, filterArcana, filterSuit, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Header / Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-200 tracking-tight leading-tight">
            {t.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t.subtitle}
          </p>

          {/* Pricing & Language Toggle Bar */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <FeatureCoinBadge
              feature={tarotFeature}
              walletBalance={walletBalance}
              language={language}
            />

            {/* Language Selector */}
            <div className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-1 text-xs">
              <Languages className="w-3.5 h-3.5 mx-2 text-amber-400" />
              {(["en", "bn", "hi"] as AstrologyLanguage[]).map((lng) => (
                <button
                  key={lng}
                  onClick={() => setLanguage(lng)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    language === lng
                      ? "bg-amber-500 text-zinc-950 font-bold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {lng === "en" ? "EN" : lng === "bn" ? "বাংলা" : "हिन्दी"}
                </button>
              ))}
            </div>

            {/* Main Tabs (Reading vs Explorer) */}
            <div className="inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-1 text-xs">
              <button
                onClick={() => setMainTab("reading")}
                className={`px-3 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                  mainTab === "reading"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Tarot Oracle</span>
              </button>
              <button
                onClick={() => setMainTab("explorer")}
                className={`px-3 py-1 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                  mainTab === "explorer"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-950"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.tabDeckExplorer}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature disabled alert if toggled off in admin */}
        {tarotFeature && tarotFeature.enabled === false && (
          <div className="mb-8 max-w-2xl mx-auto">
            <FeatureDisabledAlert featureName={t.title} language={language} />
          </div>
        )}

        {/* ===================== TAB 1: READING WIZARD ===================== */}
        {mainTab === "reading" && (
          <div>
            {/* Step Progress Bar */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { stepNum: 1, label: t.stepChooseSpread },
                  { stepNum: 2, label: t.stepAskQuestion },
                  { stepNum: 3, label: t.stepDrawCards },
                  { stepNum: 4, label: t.stepInterpretation },
                ].map((s) => (
                  <button
                    key={s.stepNum}
                    onClick={() => {
                      if (s.stepNum < step || (s.stepNum === 4 && readingResult)) {
                        setStep(s.stepNum as any);
                      }
                    }}
                    disabled={s.stepNum > step && !(s.stepNum === 4 && readingResult)}
                    className={`py-2 px-1 rounded-lg border transition-all text-center flex flex-col items-center gap-1 ${
                      step === s.stepNum
                        ? "border-amber-500 bg-amber-500/10 text-amber-300 font-bold shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        : step > s.stepNum
                        ? "border-emerald-500/40 bg-zinc-900/60 text-emerald-400"
                        : "border-zinc-800 text-zinc-600 bg-zinc-950/40 opacity-60"
                    }`}
                  >
                    <span className="line-clamp-1">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: SELECT SPREAD */}
            {step === 1 && (
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-serif font-bold text-amber-100">
                    {t.stepChooseSpread}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Select the authentic layout that aligns with your question&apos;s depth.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {spreads.map((s) => {
                    const isSelected = selectedSpreadId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSpreadId(s.id)}
                        className={`rounded-2xl border p-5 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-amber-400 bg-gradient-to-b from-amber-950/40 to-zinc-900 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50"
                            : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 hover:bg-zinc-900/40"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                              {s.card_count} {s.card_count === 1 ? "Card" : "Cards"}
                            </span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                          </div>

                          <h3 className="text-lg font-serif font-bold text-amber-100 mb-2">
                            {s.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                            {s.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 italic">
                          Ideal for: {s.ideal_for}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-6">
                  <Button
                    size="lg"
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-8 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                  >
                    <span>{t.selectSpreadBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: SET QUESTION & HARMONIC RESONANCE */}
            {step === 2 && (
              <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 sm:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-amber-100">
                      {t.stepAskQuestion}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Selected Spread: <span className="text-amber-300 font-semibold">{activeSpread?.name} ({targetCardCount} Cards)</span>
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-zinc-400">
                    Change Spread
                  </Button>
                </div>

                {/* Category Pills */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                    Focus Pillar
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                          className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                            isCatActive
                              ? "border-amber-400 bg-amber-500/10 text-amber-200 shadow-sm"
                              : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isCatActive ? "text-amber-400" : "text-zinc-500"}`} />
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Input */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                    {t.questionLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.questionPlaceholder}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                  />
                </div>

                {/* Optional Astrological Moon Sign & Dasha */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      {t.moonSignLabel}
                    </label>
                    <input
                      type="text"
                      value={moonSign}
                      onChange={(e) => setMoonSign(e.target.value)}
                      placeholder={t.moonSignPlaceholder}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                      {t.dashaLordLabel}
                    </label>
                    <input
                      type="text"
                      value={dashaLord}
                      onChange={(e) => setDashaLord(e.target.value)}
                      placeholder={t.dashaLordPlaceholder}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-zinc-400">
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-6 shadow-md"
                  >
                    <span>{t.startDrawBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: INTERACTIVE TACTILE SHUFFLE & CARD PICKING */}
            {step === 3 && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* Control bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-lg">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-amber-200">
                      {t.stepDrawCards}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {selectedCardIndices.length < targetCardCount
                        ? t.pickCardPrompt(targetCardCount - selectedCardIndices.length, targetCardCount)
                        : t.cardsReadyPrompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShuffle}
                      disabled={isShuffling}
                      className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    >
                      <Shuffle className={`w-3.5 h-3.5 mr-1.5 ${isShuffling ? "animate-spin" : ""}`} />
                      {t.shuffleDeckBtn}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAutoPick}
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                      {t.autoPickBtn}
                    </Button>
                  </div>
                </div>

                {/* Selected Cards preview slots */}
                <div className="p-4 rounded-2xl border border-amber-500/20 bg-zinc-950/50 flex items-center justify-center gap-3 flex-wrap">
                  {Array.from({ length: targetCardCount }).map((_, slotIdx) => {
                    const pickedIndex = selectedCardIndices[slotIdx];
                    const isPicked = pickedIndex !== undefined;
                    return (
                      <div
                        key={slotIdx}
                        className={`w-16 h-24 sm:w-20 sm:h-28 rounded-xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                          isPicked
                            ? "border-amber-400 bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                            : "border-dashed border-zinc-700 bg-zinc-900/40 text-zinc-600"
                        }`}
                      >
                        {isPicked ? (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-400 mb-1" />
                            <span className="text-[10px] font-bold text-amber-300">
                              Card #{slotIdx + 1}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] text-zinc-500">Slot {slotIdx + 1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* The 78-card Celestial Fanned Grid */}
                <div
                  className={`p-6 rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl relative overflow-hidden transition-all duration-500 ${
                    isShuffling ? "scale-95 opacity-50 blur-[1px]" : "scale-100 opacity-100"
                  }`}
                >
                  <p className="text-xs text-center text-zinc-400 mb-4">
                    Touch any cards below to channel your intuitive subconscious energy:
                  </p>

                  <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5 sm:gap-2 justify-items-center max-h-[460px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-zinc-800">
                    {Array.from({ length: 78 }).map((_, cardIndex) => {
                      const isChosen = selectedCardIndices.includes(cardIndex);
                      return (
                        <button
                          key={cardIndex}
                          type="button"
                          onClick={() => handleToggleCardPick(cardIndex)}
                          className={`w-10 h-16 sm:w-12 sm:h-20 rounded-lg border transition-all transform hover:-translate-y-2 hover:shadow-lg flex flex-col items-center justify-center ${
                            isChosen
                              ? "border-amber-400 bg-gradient-to-b from-amber-500/40 to-yellow-600/40 -translate-y-2.5 shadow-[0_0_15px_rgba(245,158,11,0.5)] ring-2 ring-amber-400"
                              : "border-amber-500/30 bg-gradient-to-b from-indigo-950/80 to-zinc-950 hover:border-amber-400/70"
                          }`}
                        >
                          <div className="w-5 h-5 rounded-full border border-amber-400/40 flex items-center justify-center text-[9px] text-amber-300 font-serif">
                            ✦
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action button to reveal reading */}
                <div className="text-center pt-4">
                  <Button
                    size="lg"
                    disabled={selectedCardIndices.length < targetCardCount || drawingReading}
                    onClick={handleRevealReading}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-bold px-10 text-base shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-50"
                  >
                    {drawingReading ? (
                      <>
                        <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                        <span>Channeling Arcana Oracle...</span>
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
              <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
                {/* Interactive Spread Visualization */}
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                    <div>
                      <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                        {readingResult.spread_name}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-amber-100">
                        {readingResult.question || "Sacred Cosmic Spread"}
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFlippedCards((prev) => prev.map(() => true))}
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      {t.flipAllBtn}
                    </Button>
                  </div>

                  {/* Render the Spatial Spread Layout */}
                  <TarotSpreadLayout
                    spreadId={selectedSpreadId}
                    cards={readingResult.drawn_cards}
                    flippedState={flippedCards}
                    onFlipCard={handleFlipCard}
                  />
                </div>

                {/* Master Reading Detail Component */}
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
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
                The Complete 78 Arcana Deck
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Explore canonical Major and Minor Arcana symbolism, elemental dignities, Vedic Grahas, and dual-pole interpretations.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by card name, sign or graha..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Arcana Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-zinc-500 font-medium">Arcana:</span>
                {(["all", "major", "minor"] as const).map((arc) => (
                  <button
                    key={arc}
                    onClick={() => setFilterArcana(arc)}
                    className={`px-3 py-1 rounded-lg border capitalize transition-colors ${
                      filterArcana === arc
                        ? "border-amber-500 bg-amber-500/10 text-amber-300 font-semibold"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {arc}
                  </button>
                ))}
              </div>

              {/* Suit Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-zinc-500 font-medium">Suit:</span>
                {(["all", "wands", "cups", "swords", "pentacles"] as const).map((suit) => (
                  <button
                    key={suit}
                    onClick={() => setFilterSuit(suit)}
                    className={`px-3 py-1 rounded-lg border capitalize transition-colors ${
                      filterSuit === suit
                        ? "border-amber-500 bg-amber-500/10 text-amber-300 font-semibold"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {suit}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredCards.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedExplorerCard(c)}
                  className="cursor-pointer group transform transition-transform hover:-translate-y-1.5"
                >
                  <TarotCardView
                    card={c}
                    isFlipped={true}
                    size="sm"
                    showPositionHeader={false}
                  />
                </div>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No cards match your filter query.
              </div>
            )}
          </div>
        )}

        {/* Selected Card Modal in Explorer */}
        {selectedExplorerCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/40 bg-zinc-950 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedExplorerCard(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-100 p-1 rounded-lg border border-zinc-800"
              >
                ✕
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
                <TarotCardView card={selectedExplorerCard} isFlipped={true} size="md" showPositionHeader={false} />

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                    <span className="text-xs uppercase font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded">
                      {selectedExplorerCard.arcana} Arcana
                    </span>
                    <span className="text-xs text-zinc-400">
                      • {selectedExplorerCard.element}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-amber-100">
                    {selectedExplorerCard.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Astrology: <strong>{selectedExplorerCard.astrology}</strong> | Vedic Graha: <strong>{selectedExplorerCard.vedic_graha}</strong>
                  </p>

                  <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-950/20 text-xs text-amber-200">
                    <strong>Affirmation:</strong> &ldquo;{selectedExplorerCard.affirmation}&rdquo;
                  </div>
                </div>
              </div>

              {/* Interpretations */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
                  <h4 className="font-serif font-bold text-emerald-300 mb-1">
                    Upright Meaning
                  </h4>
                  <p className="text-zinc-300 leading-relaxed mb-2">
                    {selectedExplorerCard.upright.general}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedExplorerCard.upright.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/10">
                  <h4 className="font-serif font-bold text-rose-300 mb-1">
                    Reversed Meaning
                  </h4>
                  <p className="text-zinc-300 leading-relaxed mb-2">
                    {selectedExplorerCard.reversed.general}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedExplorerCard.reversed.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/30 bg-zinc-900/60">
                  <h4 className="font-serif font-bold text-amber-300 mb-1">
                    Astrological Remedy
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
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
      </main>

      <SiteFooter />
    </div>
  );
}
