"use client";

/**
 * The old homepage's closing blocks, in the DivinLink style:
 * live trust stats, the three steps to clarity, why DivinLink, and the
 * bottom call to action (whose description the admin CMS can override).
 */

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Lock, Shield, Sparkles, Star, Zap } from "lucide-react";

import type { HomePageCMSData } from "@/lib/api";
import { HOME_STEPS_AND_TRUST_TRANSLATIONS } from "@/lib/home-translations";
import type { AstrologyLanguage } from "@/types";

function pick(lang: AstrologyLanguage, en: string, bn: string, hi: string): string {
  return lang === "bn" ? bn : lang === "hi" ? hi : en;
}

/** Adds `is-in` once the element scrolls into view; used to start counters and line draws. */
function useInView<T extends Element>(margin = "0px 0px -12% 0px") {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

/**
 * Counts the leading number of a stat ("12", "100%", "4.8★") up from zero
 * once visible, keeping whatever prefix and suffix surround it.
 */
function CountUp({ value, run }: { value: string; run: boolean }) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2]) : NaN;
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
  const [shown, setShown] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!run || isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(target));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now();
    const DURATION = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);

  if (!match || isNaN(target)) return <>{value}</>;
  const number = shown === null ? (run ? 0 : target) : shown;
  return (
    <>
      {match[1]}
      {number.toFixed(decimals)}
      {match[3]}
    </>
  );
}

interface TrustProps {
  language: AstrologyLanguage;
  liveAstrologerCount: number;
}

export function HomeTrustSections({ language, liveAstrologerCount }: TrustProps) {
  const t = HOME_STEPS_AND_TRUST_TRANSLATIONS[language] || HOME_STEPS_AND_TRUST_TRANSLATIONS.en;
  const [statsRef, statsIn] = useInView<HTMLDivElement>();
  const [stepsRef, stepsIn] = useInView<HTMLDivElement>();

  const stats = [
    {
      value: `${liveAstrologerCount}`,
      label: pick(language, "Verified astrologers", "শীর্ষ যাচাইকৃত জ্যোতিষী", "सत्यापित शीर्ष ज्योतिषी"),
    },
    {
      value: "100%",
      label: pick(language, "Swiss Ephemeris accuracy", "সুইস এফিমেরিস সঠিক গণনা", "स्विस एफेमेरिस शुद्ध गणना"),
    },
    {
      value: "4.8★",
      label: pick(language, "Average client rating", "গড় ক্লায়েন্ট সন্তুষ্টি", "औसत ग्राहक रेटिंग"),
    },
  ];

  const trustIcons = [Shield, Lock, Zap, Star];

  return (
    <>
      {/* Live trust stats */}
      <section className="dl-stats-sec" aria-label={pick(language, "DivinLink in numbers", "সংখ্যায় ডিভিনলিংক", "आंकड़ों में डिवाइनलिंक")}>
        <div ref={statsRef} className={`dl-stats${statsIn ? " is-in" : ""}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="dl-stat">
              <div className="dl-stat-value">
                <CountUp value={stat.value} run={statsIn} />
              </div>
              <div className="dl-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Three steps to clarity */}
      <section id="how-it-works" className="dl-steps-sec">
        <div className="dl-sec-inner">
          <header className="dl-sec-head is-center">
            <div>
              <p className="dl-kicker">{pick(language, "Simple & Seamless", "সহজ ও নির্ভরযোগ্য", "सरल एवं सहज")}</p>
              <h2 className="dl-sec-title">
                {pick(language, "Three Steps to Clarity", "স্পষ্টতা ও দিকনির্দেশনার ৩টি সহজ ধাপ", "मार्गदर्शन के 3 सरल चरण")}
              </h2>
              <p className="dl-sec-lede">
                {pick(
                  language,
                  "Get instant guidance on your life, love, and destiny in under 2 minutes.",
                  "মাত্র ২ মিনিটে জীবন, প্রেম এবং ভবিষ্যতের নির্ভুল দিকনির্দেশনা পান।",
                  "मात्र 2 मिनट में अपने जीवन, प्रेम एवं भविष्य का मार्गदर्शन प्राप्त करें।",
                )}
              </p>
            </div>
          </header>

          <div ref={stepsRef} className={`dl-steps${stepsIn ? " is-in" : ""}`}>
            <span className="dl-steps-line" aria-hidden />
            {t.steps.map((step, idx) => (
              <article key={step.num} className="dl-step" style={{ "--i": idx } as React.CSSProperties}>
                <span className="dl-step-num" aria-hidden>
                  {step.num}
                </span>
                <span className="dl-step-badge">{pick(language, `Step ${idx + 1}`, `ধাপ ${idx + 1}`, `चरण ${idx + 1}`)}</span>
                <h3 className="dl-step-title">{step.title}</h3>
                <p className="dl-step-body">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why DivinLink */}
      <section className="dl-why-sec">
        <div className="dl-sec-inner">
          <header className="dl-sec-head is-center">
            <div>
              <p className="dl-kicker">{pick(language, "Trust & Safety", "আস্থা ও নিরাপত্তা", "भरोसा एवं सुरक्षा")}</p>
              <h2 className="dl-sec-title">
                {pick(language, "Why Choose DivinLink", "কেন ডিভিনলিংক-এ আস্থা রাখবেন", "डिविनलिंक पर क्यों भरोसा करें")}
              </h2>
              <p className="dl-sec-lede">
                {pick(
                  language,
                  "Rigorously vetted Vedic scholars, transparent pricing, and complete privacy guaranteed.",
                  "শাস্ত্রজ্ঞ বৈদিক পন্ডিত, স্বচ্ছ মূল্য এবং ১০০% নির্ভরযোগ্য গোপনীয়তা।",
                  "सत्यापित वैदिक विद्वान, पारदर्शी शुल्क और पूर्ण गोपनीयता की गारंटी।",
                )}
              </p>
            </div>
          </header>

          <div className="dl-why-grid">
            {t.trust.map((item, i) => {
              const Icon = trustIcons[i] || Shield;
              return (
                <article key={item.title} className="dl-why-card">
                  <span className="dl-why-icon">
                    <Icon strokeWidth={1.5} />
                  </span>
                  <h3 className="dl-why-title">{item.title}</h3>
                  <p className="dl-why-body">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export function HomeBottomCta({
  language,
  cms,
}: {
  language: AstrologyLanguage;
  cms: HomePageCMSData | null | undefined;
}) {
  return (
    <section className="dl-cta-sec">
      <div className="dl-sec-inner">
        <div className="dl-cta">
          <span className="dl-cta-orb dl-cta-orb--a" aria-hidden />
          <span className="dl-cta-orb dl-cta-orb--b" aria-hidden />
          <div className="dl-cta-inner">
            <p className="dl-kicker is-pill">
              <Sparkles className="size-3.5" />
              {pick(language, "Start With Confidence", "আত্মবিশ্বাসের সাথে শুরু করুন", "विश्वास के साथ शुरुआत करें")}
            </p>
            <h2 className="dl-cta-title">
              {pick(
                language,
                "Ready to Consult with an Expert?",
                "অভিজ্ঞ জ্যোতিষীর সাথে পরামর্শ করতে প্রস্তুত?",
                "विशेषज्ञ से परामर्श के लिए तैयार हैं?",
              )}
            </h2>
            <p className="dl-cta-body">
              {/* The CMS copy is written in English; showing it inside a Bengali
                  or Hindi page would mix languages, so it only replaces the
                  English default. */}
              {(language === "en" && cms?.cta_description) ||
                pick(
                  language,
                  "Find authentic clarity and personalized Vedic guidance for love, career, and life. Start your journey today.",
                  "প্রেম, ক্যারিয়ার, বিয়ে ও স্বাস্থ্যে শাস্ত্রীয় স্পষ্টতা ও সঠিক প্রতিকার পান। প্রথম কনসালটেশন দিয়ে আজই শুরু করুন।",
                  "प्रेम, करियर और जीवन में शास्त्रीय मार्गदर्शन एवं सटीक उपाय पाएं। प्रथम परामर्श से आज ही शुरुआत करें।",
                )}
            </p>
            <div className="dl-cta-actions">
              <Link href="/astrologers" className="dl-btn-orange">
                {pick(language, "Consult for FREE", "ফ্রি পরামর্শ নিন", "मुफ़्त परामर्श लें")}
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/kundli" className="dl-btn-ghost">
                {pick(language, "Generate Free Kundli", "ফ্রি কুণ্ডলী তৈরি করুন", "मुफ़्त कुंडली बनाएं")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
