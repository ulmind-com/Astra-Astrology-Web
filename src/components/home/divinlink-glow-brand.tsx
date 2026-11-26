"use client";

import * as React from "react";
import { Sparkles, MousePointerClick, Orbit, Zap, RefreshCw, Flame, Eye } from "lucide-react";
import { logo, type EffectInstance } from "glowdots";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";

interface DivinLinkGlowBrandProps {
  className?: string;
  source?: string;
  bloom?: number;
  clickBurst?: boolean;
}

export function DivinLinkGlowBrand({
  className,
  source = "/logo.svg",
  bloom = 0.4,
  clickBurst = true,
}: DivinLinkGlowBrandProps) {
  const { language } = useLanguage();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<EffectInstance | null>(null);

  const [interactionMode, setInteractionMode] = React.useState<"repel" | "swirl" | "ripple">("swirl");
  const [isCharged, setIsCharged] = React.useState(false);
  const [burstCount, setBurstCount] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize glowdots GPU particle effect
  React.useEffect(() => {
    if (!isClient) return;

    // Support both ID selector requested by user (#brand) and container ref
    const target = containerRef.current;
    if (!target) return;

    try {
      // Clean up previous instance if any
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }

      // Exact implementation requested by user:
      // logo('#brand', { source: '/logo.svg', preserveColors: true, bloom: 0.4, clickBurst: true })
      const inst = logo(target, {
        source,
        preserveColors: true,
        bloom,
        clickBurst,
        count: 26000,
        size: 1.6,
        intensity: 1.35,
        softness: 0.3,
        dust: 0.12,
        scale: 1.05,
        depth: 0.08,
        interaction: interactionMode,
        interactionRadius: 0.45,
        interactionStrength: 0.75,
        holdCharge: true,
        orbit: true,
        orbitDamping: 0.94,
        idleMotion: true,
        entranceDuration: 1.2,
      });

      instanceRef.current = inst;

      inst.on("charge:release", () => {
        setIsCharged(false);
        setBurstCount((c) => c + 1);
      });
    } catch (err) {
      console.warn("[glowdots] Logo initialization error:", err);
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [isClient, source, bloom, clickBurst, interactionMode]);

  const handleModeChange = (mode: "repel" | "swirl" | "ripple") => {
    setInteractionMode(mode);
    if (instanceRef.current) {
      instanceRef.current.update({ interaction: mode });
    }
  };

  const handleTriggerBurst = () => {
    setBurstCount((c) => c + 1);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickEvent = new MouseEvent("click", {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
        bubbles: true,
      });
      containerRef.current.querySelector("canvas")?.dispatchEvent(clickEvent);
    }
  };

  const t = {
    badge: language === "bn" ? "মহাজাগতিক স্টার্ডাস্ট এম্বলেম" : language === "hi" ? "कॉस्मिक स्टारडस्ट एम्बलम" : "Cosmic Stardust Emblem",
    title: language === "bn" ? "স্পর্শ করুন ও অনুভব করুন মহাজাগতিক শক্তি" : language === "hi" ? "स्पर्श करें और ब्रह्मांडीय ऊर्जा का अनुभव करें" : "Touch & Experience Cosmic Stardust",
    desc: language === "bn"
      ? "DivinLink-এর পবিত্র শ্রীযন্ত্র ও ওম প্রতীকটি ২৬,০০০+ ভাস্বর জিপিইউ কোয়ান্টাম কণা দ্বারা গঠিত। মাউস নাড়ান, ক্লিক করে সুপারনোভা বিস্ফোরণ ঘটান বা টেনে ধরে ৩৬০° কোণে ঘুরিয়ে দেখুন।"
      : language === "hi"
      ? "DivinLink का दिव्य श्रीयंत्र और ॐ प्रतीक 26,000+ चमकीले कणों से निर्मित है। कर्सर हिलाएं, क्लिक करके सुपरनोवा विस्फोट देखें या 360° घुमाएं।"
      : "DivinLink's sacred Sri Yantra & Om seal woven from 26,000+ glowing GPU quantum particles. Hover to swirl, click for supernova burst, or drag to orbit in 3D.",
    swirl: language === "bn" ? "ঘূর্ণন (Swirl)" : language === "hi" ? "भंवर (Swirl)" : "Swirl",
    repel: language === "bn" ? "বিকর্ষণ (Repel)" : language === "hi" ? "विकर्षण (Repel)" : "Repel",
    ripple: language === "bn" ? "তরঙ্গ (Ripple)" : language === "hi" ? "तरंग (Ripple)" : "Ripple",
    burstBtn: language === "bn" ? "বিস্ফোরণ ঘটান ✨" : language === "hi" ? "विस्फोट करें ✨" : "Burst Particles ✨",
    hint: language === "bn" ? "💡 ক্লিক করুন বা মাউস চেপে ধরে সুপারচার্জ করুন" : language === "hi" ? "💡 क्लिक करें या माउस दबाकर सुपरचार्ज करें" : "💡 Click to burst or hold mouse down to supercharge",
  };

  return (
    <section className={cn("relative py-12 sm:py-16 overflow-hidden", className)}>
      {/* Ambient Celestial Glow Orbs in Background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] sm:size-[800px] rounded-full bg-gradient-to-tr from-amber-400/15 via-orange-500/10 to-yellow-300/10 blur-3xl opacity-75" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* Header Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 px-4 py-1.5 shadow-xs mb-3.5 backdrop-blur-md">
            <Sparkles className="size-3.5 text-amber-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
              {t.badge}
            </span>
            <span className="size-1.5 rounded-full bg-amber-500 animate-ping" />
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ink-950 mb-3">
            {t.title}
          </h2>

          <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {t.desc}
          </p>
        </div>

        {/* Interactive Stardust Canvas Glass Stage */}
        <div className="relative mx-auto max-w-3xl rounded-[32px] sm:rounded-[36px] border border-amber-300/60 bg-gradient-to-b from-white/90 via-amber-50/40 to-white/95 p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(217,119,6,0.22)] backdrop-blur-xl">
          {/* Top Bar Controls & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-b border-black/[0.06] mb-2 text-xs">
            {/* Interaction mode toggles */}
            <div className="flex items-center gap-1 bg-surface-muted/80 p-1 rounded-full border border-black/[0.06]">
              <button
                type="button"
                onClick={() => handleModeChange("swirl")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold transition-all duration-200 text-[11px] sm:text-xs",
                  interactionMode === "swirl"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                🌀 {t.swirl}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("repel")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold transition-all duration-200 text-[11px] sm:text-xs",
                  interactionMode === "repel"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                ✨ {t.repel}
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("ripple")}
                className={cn(
                  "px-3 py-1 rounded-full font-semibold transition-all duration-200 text-[11px] sm:text-xs",
                  interactionMode === "ripple"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                🌊 {t.ripple}
              </button>
            </div>

            {/* Manual Burst Button */}
            <button
              type="button"
              onClick={handleTriggerBurst}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-1 text-[11px] sm:text-xs font-bold text-white shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="size-3" />
              <span>{t.burstBtn}</span>
              {burstCount > 0 && (
                <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                  {burstCount}
                </span>
              )}
            </button>
          </div>

          {/* 
            Container ID #brand matching user specification:
            logo('#brand', { source: '/logo.svg', preserveColors: true, bloom: 0.4, clickBurst: true })
          */}
          <div
            id="brand"
            ref={containerRef}
            className="relative h-[340px] sm:h-[420px] w-full overflow-hidden rounded-[24px] sm:rounded-[28px] bg-[#140d07] shadow-inner cursor-crosshair select-none"
            style={{ touchAction: "none" }}
          >
            {/* Subtle background cosmic nebula gradient inside canvas */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-[#180e07]/80 to-[#0d0703]" />

            {/* Interactive hint overlay */}
            <div className="pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-[10px] sm:text-xs font-medium text-amber-200/90 border border-amber-500/20 shadow-md">
              {t.hint}
            </div>

            {/* Corner 3D Orbit Badge */}
            <div className="pointer-events-none absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-amber-400 border border-amber-500/20">
              <Orbit className="size-3 animate-spin" style={{ animationDuration: "8s" }} />
              <span>3D Orbit Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
