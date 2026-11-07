"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Sun,
  Star,
  Sparkles,
  Hash,
  Layers,
  Orbit,
  Compass,
  Hand,
  Home,
  type LucideIcon,
} from "lucide-react";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import { useLanguage } from "@/providers/language-provider";

// featureId -> route + icon + tint. Names/descriptions come from the admin panel (live pricing).
interface ServiceMeta {
  featureId: string;
  href: string;
  Icon: LucideIcon;
  fg: string;
  bg: string;
}

const SERVICE_META: ServiceMeta[] = [
  { featureId: "kundli", href: "/kundli", Icon: BookOpen, fg: "text-amber-600", bg: "bg-amber-100" },
  { featureId: "kundli_matching", href: "/kundli-matching", Icon: HeartHandshake, fg: "text-rose-600", bg: "bg-rose-100" },
  { featureId: "daily_horoscope", href: "/daily-horoscope", Icon: Sun, fg: "text-orange-600", bg: "bg-orange-100" },
  { featureId: "nakshatra_calculator", href: "/nakshatra-calculator", Icon: Star, fg: "text-teal-600", bg: "bg-teal-100" },
  { featureId: "rashi_calculator", href: "/rashi-calculator", Icon: Sparkles, fg: "text-indigo-600", bg: "bg-indigo-100" },
  { featureId: "numerology", href: "/numerology", Icon: Hash, fg: "text-violet-600", bg: "bg-violet-100" },
  { featureId: "tarot", href: "/tarot", Icon: Layers, fg: "text-purple-600", bg: "bg-purple-100" },
  { featureId: "dasha_calculator", href: "/dasha-calculator", Icon: Orbit, fg: "text-blue-600", bg: "bg-blue-100" },
  { featureId: "kp_calculator", href: "/kp-calculator", Icon: Compass, fg: "text-green-600", bg: "bg-green-100" },
  { featureId: "palm_reading", href: "/palm-reading", Icon: Hand, fg: "text-pink-600", bg: "bg-pink-100" },
  { featureId: "vastu", href: "/vastu", Icon: Home, fg: "text-emerald-600", bg: "bg-emerald-100" },
];

export function ConsultRightAstrologer() {
  const { language } = useLanguage();
  const { pricing, isLoading } = useFeaturePricing();

  // Build service cards only from admin-configured features that are enabled.
  const services = React.useMemo(() => {
    if (!pricing) return [];
    return SERVICE_META.map((m) => {
      const f = pricing[m.featureId];
      if (!f || f.enabled === false) return null;
      const name = language === "bn" && f.name_bn ? f.name_bn : f.name;
      return { ...m, name, description: f.description, coins: f.coins };
    }).filter(Boolean) as (ServiceMeta & { name: string; description: string; coins: number })[];
  }, [pricing, language]);

  return (
    <section className="relative bg-transparent py-10 sm:py-14 border-b border-[#f2e9b0]/60">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#c2410c]">
            {language === "bn" ? "আমাদের সেবা" : language === "hi" ? "हमारी सेवाएँ" : "Our Services"}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#1a1208] sm:text-4xl lg:text-5xl">
            {language === "bn" ? (
              <>
                আমাদের{" "}
                <span className="bg-gradient-to-r from-[#e2561f] to-[#c2410c] bg-clip-text text-transparent">
                  সেবা
                </span>
              </>
            ) : language === "hi" ? (
              <>
                हमारी{" "}
                <span className="bg-gradient-to-r from-[#e2561f] to-[#c2410c] bg-clip-text text-transparent">
                  सेवाएँ
                </span>
              </>
            ) : (
              <>
                Our{" "}
                <span className="bg-gradient-to-r from-[#e2561f] to-[#c2410c] bg-clip-text text-transparent">
                  Services
                </span>
              </>
            )}
          </h2>
        </div>

        {/* Cards row (horizontal scroll) */}
        {isLoading && services.length === 0 ? (
          <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[150px] w-[230px] shrink-0 animate-pulse rounded-2xl border border-[#eadf9a]/70 bg-white p-5"
              >
                <div className="size-11 rounded-xl bg-stone-200" />
                <div className="mt-4 h-4 w-2/3 rounded bg-stone-200" />
                <div className="mt-2 h-3 w-full rounded bg-stone-100" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#eadf9a] bg-white/60 p-8 text-center">
            <p className="text-sm font-semibold text-[#1a1208]">
              {language === "bn"
                ? "কোনো সেবা সক্রিয় নেই।"
                : language === "hi"
                ? "कोई सेवा सक्रिय नहीं है।"
                : "No services are active right now."}
            </p>
          </div>
        ) : (
          <div className="scrollbar-none flex gap-4 overflow-x-auto pb-2">
            {services.map((s) => {
              const Icon = s.Icon;
              return (
                <Link
                  key={s.featureId}
                  href={s.href}
                  className="group relative flex w-[230px] shrink-0 flex-col rounded-2xl border border-[#eadf9a] bg-white p-5 shadow-[0_4px_16px_-6px_rgba(26,18,8,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-400 hover:shadow-[0_16px_32px_-12px_rgba(240,210,80,0.55)]"
                >
                  <span className={`flex size-11 items-center justify-center rounded-xl ${s.bg} ${s.fg}`}>
                    <Icon className="size-5" />
                  </span>

                  <h3 className="mt-4 text-base font-bold text-[#1a1208]">{s.name}</h3>
                  {s.description && (
                    <p className="mt-1 line-clamp-2 pr-8 text-xs leading-relaxed text-[#6b5f4d]">
                      {s.description}
                    </p>
                  )}

                  <span
                    className={`absolute bottom-4 right-4 flex size-8 items-center justify-center rounded-full ${s.bg} ${s.fg} transition-transform duration-300 group-hover:translate-x-0.5`}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
