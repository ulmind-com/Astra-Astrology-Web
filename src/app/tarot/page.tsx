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
import {
  TAROT_I18N,
  SPREADS_METADATA_I18N,
  CARD_NAMES_LOCALIZED,
  ELEMENTS_LOCALIZED,
} from "@/lib/tarot-translations";

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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      <SiteHeader />

      {/* Hero Header - Matching Dasha Calculator Exactly */}
      <div className="relative border-b border-amber-200/60 bg-gradient-to-b from-amber-500/10 via-amber-50/40 to-background py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {/* Language Switcher Bar */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              {language === "bn" ? "ভাষা:" : language === "hi" ? "भाषा:" : "Language:"}
            </span>
            {(
              [
                { code: "bn", label: "বাংলা" },
                { code: "en", label: "English" },
                { code: "hi", label: "हिन्दी" },
              ] as const
            ).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`min-h-9 inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-bold press transition-all ${
                  language === lang.code
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-900">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{t.badge}</span>
          </div>

          <h1 className="mt-3.5 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950">
            {t.title}
          </h1>

          <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base text-slate-600 leading-relaxed">
            {t.subtitle}
          </p>

          {/* Pricing & Navigation Bar */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <FeatureCoinBadge
              feature={tarotFeature}
              walletBalance={walletBalance}
              language={language}
            />

            {/* Navigation Tabs (Tarot Oracle vs 78 Cards Deck) */}
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white p-1 text-xs shadow-2xs">
              <button
                onClick={() => setMainTab("reading")}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                  mainTab === "reading"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
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
                onClick={() => setMainTab("explorer")}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${
                  mainTab === "explorer"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.tabDeckExplorer}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 flex-1 w-full space-y-10">
        {/* Feature disabled alert if toggled off in admin */}
        {tarotFeature && tarotFeature.enabled === false && (
          <div className="max-w-2xl mx-auto">
            <FeatureDisabledAlert featureName={t.title} language={language} />
          </div>
        )}

        {/* ===================== TAB 1: READING WIZARD ===================== */}
        {mainTab === "reading" && (
          <div>
            {/* Step Progress Bar */}
            <div className="max-w-3xl mx-auto mb-8">
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
                    className={`py-2 px-1.5 rounded-xl border transition-all text-center flex flex-col items-center gap-1 ${
                      step === s.stepNum
                        ? "border-2 border-amber-500 bg-amber-50/90 text-amber-950 font-bold shadow-xs"
                        : step > s.stepNum
                        ? "border-emerald-300 bg-emerald-50/60 text-emerald-800 font-semibold"
                        : "border-slate-200 text-slate-400 bg-white"
                    }`}
                  >
                    <span className="line-clamp-1">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 1: SELECT SPREAD */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-display font-bold text-slate-900">
                    {t.stepChooseSpread}
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
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
                        className={`rounded-2xl p-6 cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-2 border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-400/20"
                            : "border border-slate-200 bg-white hover:border-amber-300 hover:shadow-xs"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full shadow-2xs">
                              {s.card_count} {language === "bn" ? "কার্ড" : language === "hi" ? "कार्ड" : s.card_count === 1 ? "Card" : "Cards"}
                            </span>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-amber-600" />}
                          </div>

                          <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
                            {s.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                            {s.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 text-xs text-amber-800 font-medium">
                          {language === "bn" ? "উপযুক্ত:" : language === "hi" ? "उपयुक्त:" : "Ideal for:"} {s.ideal_for}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center pt-6">
                  <Button
                    size="lg"
                    onClick={() => setStep(2)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-md shadow-amber-500/20"
                  >
                    <span>{t.selectSpreadBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: SET QUESTION & HARMONIC RESONANCE */}
            {step === 2 && (
              <div className="max-w-2xl mx-auto rounded-2xl border border-amber-300/80 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-xl font-display font-bold text-slate-900">
                      {t.stepAskQuestion}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
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
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    {language === "bn" ? "স্প্রেড পরিবর্তন" : language === "hi" ? "स्प्रेड बदलें" : "Change Spread"}
                  </Button>
                </div>

                {/* Focus Pillar Pills */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
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
                          className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                            isCatActive
                              ? "border-2 border-amber-500 bg-amber-50 text-amber-950 shadow-xs"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isCatActive ? "text-amber-600" : "text-slate-400"}`} />
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sacred Question Input */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {t.questionLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.questionPlaceholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                  />
                </div>

                {/* Optional Astrological Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      {t.moonSignLabel}
                    </label>
                    <input
                      type="text"
                      value={moonSign}
                      onChange={(e) => setMoonSign(e.target.value)}
                      placeholder={t.moonSignPlaceholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      {t.dashaLordLabel}
                    </label>
                    <input
                      type="text"
                      value={dashaLord}
                      onChange={(e) => setDashaLord(e.target.value)}
                      placeholder={t.dashaLordPlaceholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-600">
                    {language === "bn" ? "পেছনে যান" : language === "hi" ? "वापस जाएं" : "Back"}
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div>
                    <h2 className="text-lg font-display font-bold text-slate-900">
                      {t.stepDrawCards}
                    </h2>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">
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
                      className="inline-flex items-center justify-center rounded-xl border border-amber-300 bg-amber-50/80 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 shadow-2xs transition-colors"
                    >
                      <Shuffle className={`w-3.5 h-3.5 mr-1.5 ${isShuffling ? "animate-spin" : ""}`} />
                      <span>{t.shuffleDeckBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAutoPick}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                      <span>{t.autoPickBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Selected Cards Preview Slots */}
                <div className="p-4 rounded-2xl border border-amber-300/80 bg-amber-50/40 flex items-center justify-center gap-3 flex-wrap">
                  {Array.from({ length: targetCardCount }).map((_, slotIdx) => {
                    const pickedIndex = selectedCardIndices[slotIdx];
                    const isPicked = pickedIndex !== undefined;
                    return (
                      <div
                        key={slotIdx}
                        className={`w-16 h-24 sm:w-20 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center transition-all ${
                          isPicked
                            ? "border-amber-500 bg-white shadow-md ring-2 ring-amber-400/20"
                            : "border-dashed border-slate-300 bg-white/70 text-slate-400"
                        }`}
                      >
                        {isPicked ? (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
                            <span className="text-[10px] font-bold text-amber-900">
                              {language === "bn" ? `কার্ড #${slotIdx + 1}` : language === "hi" ? `कार्ड #${slotIdx + 1}` : `Card #${slotIdx + 1}`}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">
                            {language === "bn" ? `স্থান ${slotIdx + 1}` : language === "hi" ? `स्थान ${slotIdx + 1}` : `Slot ${slotIdx + 1}`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* The 78-card Celestial Fanned Grid */}
                <div
                  className={`p-6 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden transition-all duration-500 ${
                    isShuffling ? "scale-98 opacity-50" : "scale-100 opacity-100"
                  }`}
                >
                  <p className="text-xs text-center text-slate-600 font-medium mb-4">
                    {language === "bn"
                      ? "আপনার অন্তর্নিহিত অনুভূতি দিয়ে নিচের যেকোনো কার্ড স্পর্শ করে বেছে নিন:"
                      : language === "hi"
                      ? "अपनी सहज अंतर्ज्ञान से नीचे दिए गए किसी भी कार्ड को स्पर्श करके चुनें:"
                      : "Touch any cards below to channel your intuitive subconscious energy:"}
                  </p>

                  <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1.5 sm:gap-2 justify-items-center max-h-[460px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {Array.from({ length: 78 }).map((_, cardIndex) => {
                      const isChosen = selectedCardIndices.includes(cardIndex);
                      return (
                        <button
                          key={cardIndex}
                          type="button"
                          onClick={() => handleToggleCardPick(cardIndex)}
                          className={`w-10 h-16 sm:w-12 sm:h-20 rounded-xl border-2 transition-all transform hover:-translate-y-2 hover:shadow-md flex flex-col items-center justify-center ${
                            isChosen
                              ? "border-amber-500 bg-amber-500 text-white -translate-y-2.5 shadow-md ring-2 ring-amber-400/40"
                              : "border-amber-400/80 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-amber-300 hover:border-amber-500 shadow-2xs"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-serif ${
                              isChosen
                                ? "border-white/60 text-white font-bold"
                                : "border-amber-300/40 text-amber-300"
                            }`}
                          >
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
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-10 py-3.5 rounded-xl text-base shadow-md shadow-amber-500/20 disabled:opacity-50"
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
                {/* Interactive Spread Visualization Container */}
                <div className="rounded-2xl border border-amber-300/80 bg-white p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        {readingResult.spread_name}
                      </span>
                      <h3 className="text-xl font-display font-bold text-slate-900">
                        {readingResult.question || activeSpreadMeta.name}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFlippedCards((prev) => prev.map(() => true))}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      <span>{t.flipAllBtn}</span>
                    </button>
                  </div>

                  {/* Render the Spatial Spread Layout */}
                  <TarotSpreadLayout
                    spreadId={selectedSpreadId}
                    cards={readingResult.drawn_cards}
                    flippedState={flippedCards}
                    onFlipCard={handleFlipCard}
                    language={language}
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
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-950">
                {language === "bn"
                  ? "৭৮টি প্রামাণ্য ট্যারো আর্খানা সংগ্রহ"
                  : language === "hi"
                  ? "78 प्रामाणिक टैरो आर्काना संग्रह"
                  : "The Complete 78 Arcana Deck"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {language === "bn"
                  ? "মেজর ও মাইনর আর্খানার প্রতীকী অর্থ, পঞ্চভূত তত্ত্ব, বৈদিক গ্রহ সংযোগ ও দ্বি-মুখী ব্যাখ্যা জানুন।"
                  : language === "hi"
                  ? "मेजर व माइनर आर्काना के प्रतीक, पंचतत्व, वैदिक ग्रह संबंध और द्विपक्षीय अर्थ समझें।"
                  : "Explore canonical Major and Minor Arcana symbolism, elemental dignities, Vedic Grahas, and dual-pole interpretations."}
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Arcana Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 font-semibold">
                  {language === "bn" ? "আর্খানা:" : language === "hi" ? "आर्काना:" : "Arcana:"}
                </span>
                {(["all", "major", "minor"] as const).map((arc) => (
                  <button
                    key={arc}
                    onClick={() => setFilterArcana(arc)}
                    className={`px-3 py-1 rounded-full border capitalize transition-colors font-semibold ${
                      filterArcana === arc
                        ? "border-amber-500 bg-amber-500 text-white shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {arc}
                  </button>
                ))}
              </div>

              {/* Suit Filter */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-500 font-semibold">
                  {language === "bn" ? "স্যুট:" : language === "hi" ? "सूट:" : "Suit:"}
                </span>
                {(["all", "wands", "cups", "swords", "pentacles"] as const).map((suit) => (
                  <button
                    key={suit}
                    onClick={() => setFilterSuit(suit)}
                    className={`px-3 py-1 rounded-full border capitalize transition-colors font-semibold ${
                      filterSuit === suit
                        ? "border-amber-500 bg-amber-500 text-white shadow-2xs"
                        : "border-slate-200 bg-white text-slate-600 hover:text-slate-900"
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
                    language={language}
                  />
                </div>
              ))}
            </div>

            {filteredCards.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="relative w-full max-w-2xl rounded-2xl border border-amber-300 bg-white p-6 sm:p-8 shadow-xl overflow-y-auto max-h-[90vh]">
              <button
                type="button"
                onClick={() => setSelectedExplorerCard(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1.5 rounded-lg border border-slate-200"
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
                    <span className="text-xs uppercase font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                      {selectedExplorerCard.arcana} Arcana
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      • {ELEMENTS_LOCALIZED[language]?.[selectedExplorerCard.element] || selectedExplorerCard.element}
                    </span>
                  </div>

                  <h3 className="text-2xl font-display font-bold text-slate-950">
                    {CARD_NAMES_LOCALIZED[language]?.[selectedExplorerCard.id] || selectedExplorerCard.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Astrology: <strong>{selectedExplorerCard.astrology}</strong> | Vedic Graha: <strong>{selectedExplorerCard.vedic_graha}</strong>
                  </p>

                  <div className="mt-4 p-3 rounded-xl border border-amber-200 bg-amber-50/60 text-xs text-amber-950">
                    <strong>{language === "bn" ? "সংকল্প বাণী:" : language === "hi" ? "सकारात्मक विचार:" : "Affirmation:"}</strong> &ldquo;{selectedExplorerCard.affirmation}&rdquo;
                  </div>
                </div>
              </div>

              {/* Interpretations */}
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <h4 className="font-display font-bold text-emerald-950 mb-1">
                    {language === "bn" ? "সোজা (জাগ্রত অবস্থা)" : language === "hi" ? "सीधी स्थिति (सकारात्मक)" : "Upright Meaning"}
                  </h4>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    {selectedExplorerCard.upright.general}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedExplorerCard.upright.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-semibold text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-2xs">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
                  <h4 className="font-display font-bold text-rose-950 mb-1">
                    {language === "bn" ? "উল্টো (অন্তর্মুখী রূপান্তর)" : language === "hi" ? "उल्टी स्थिति (आंतरिक बदलाव)" : "Reversed Meaning"}
                  </h4>
                  <p className="text-slate-700 leading-relaxed mb-2">
                    {selectedExplorerCard.reversed.general}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedExplorerCard.reversed.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-semibold text-rose-800 bg-white border border-rose-200 px-2 py-0.5 rounded shadow-2xs">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
                  <h4 className="font-display font-bold text-amber-950 mb-1">
                    {language === "bn" ? "শাস্ত্রীয় বৈদিক প্রতিকার" : language === "hi" ? "वैदिक ज्योतिषीय उपाय" : "Astrological Remedy"}
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
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
