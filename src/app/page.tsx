import {
  ArrowRight,
  Compass,
  Hash,
  Heart,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui";

const SERVICES = [
  {
    icon: Compass,
    title: "Kundli & Birth Chart",
    body: "Your planetary positions, dasha periods and what they point to — read by seasoned practitioners.",
    accent: "brand",
  },
  {
    icon: Heart,
    title: "Matchmaking",
    body: "Guna milan across all eight kootas, with the doshas read properly and explained clearly.",
    accent: "gold",
  },
  {
    icon: Hash,
    title: "Numerology",
    body: "Mulank, bhagyank, lucky numbers, and what your name adds up to in your life path.",
    accent: "brand",
  },
  {
    icon: Sparkles,
    title: "Vastu Shastra",
    body: "Room by room, on the sixteen-direction compass — bringing alignment to your spaces.",
    accent: "gold",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Tell us when you were born",
    body: "Date, time and place. Saved once, used by every reading that follows.",
    icon: Star,
  },
  {
    num: "02",
    title: "Pick an astrologer",
    body: "Filter by skill, language and experience. See who is online right now.",
    icon: Users,
  },
  {
    num: "03",
    title: "Chat or call",
    body: "Ask what is actually on your mind. Pay only for the minutes you use.",
    icon: MessageCircle,
  },
];

const TRUST_STATS = [
  { value: "500+", label: "Verified astrologers" },
  { value: "50K+", label: "Consultations completed" },
  { value: "4.9★", label: "Average rating" },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* ─────────────────────────────────────────── HERO */}
        <section className="bg-stars relative overflow-hidden">
          {/* Decorative planets */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="orb animate-float-slow absolute -left-44 -top-32 size-80 opacity-40 blur-[2px] sm:size-[28rem]" />
            <span className="absolute -left-52 -top-40 hidden size-[34rem] rounded-full border border-brand-300/15 [transform:rotate(-18deg)_scaleY(0.3)] sm:block" />
            <span className="orb animate-float-slow absolute -right-28 top-24 size-60 opacity-30 blur-[3px] [animation-delay:-5s] sm:size-80" />
            <span className="orb-gold orb absolute right-20 top-14 size-11 opacity-80 sm:right-32" />
            <span className="orb absolute left-[13%] bottom-20 size-8 opacity-50" />
            <span className="orb absolute right-[22%] bottom-28 size-5 opacity-40" />
            {/* Subtle extra ring */}
            <span className="absolute right-[8%] top-[30%] hidden size-48 rounded-full border border-gold-300/10 [transform:scaleY(0.4)] sm:block" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-28 text-center sm:py-40">
            {/* Eyebrow badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/35 bg-brand-500/12 px-4 py-1.5 text-xs font-semibold tracking-widest text-brand-200 uppercase backdrop-blur-sm shadow-[0_0_20px_-8px_rgb(168_85_247/0.5)]">
              <Sparkles className="size-3.5 text-gold-300" />
              Verified astrologers · Real answers
            </span>

            <h1 className="glow-text mx-auto mt-8 max-w-4xl font-display text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-7xl">
              Clarity,{" "}
              <span className="text-gradient-brand">written in the stars</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-brand-100/70 sm:text-lg">
              Talk to astrologers who have spent years reading charts. Kundli,
              matchmaking, numerology and vastu — whenever a decision needs a second
              perspective.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/astrologers">
                <Button size="lg" className="group w-full sm:w-auto">
                  Find an astrologer
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-brand-300/30 text-brand-100 hover:bg-brand-500/12 hover:border-brand-400/50 sm:w-auto"
                >
                  Create a free account
                </Button>
              </Link>
            </div>

            {/* Trust stats */}
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {TRUST_STATS.map(({ value, label }) => (
                <div
                  key={label}
                  className="card-surface group flex flex-col items-center p-5 text-center hover:card-glow transition-all duration-300"
                >
                  <dt className="font-display text-2xl font-bold text-gradient-brand">{value}</dt>
                  <dd className="mt-1 text-xs font-medium text-muted-foreground tracking-wide">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hairline absolute inset-x-0 bottom-0 h-px" aria-hidden />
        </section>

        {/* ─────────────────────────────────────────── SERVICES */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-brand-500/12 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-300 border border-brand-400/30 mb-4">
              What we offer
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What you can ask about
            </h2>
            <p className="mt-3 mx-auto max-w-lg text-muted-foreground leading-relaxed">
              Traditional methods, interpreted by people who practise them every day.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className="card-surface group relative flex flex-col items-center p-7 text-center hover:card-glow hover:-translate-y-1.5 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Soft background glow on hover */}
                <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-brand-500/5 to-transparent" />

                <span
                  className={`medallion mx-auto flex size-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow ${
                    service.accent === "gold" ? "medallion-gold" : ""
                  }`}
                >
                  <service.icon className="size-7 text-brand-100" />
                </span>
                <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────── HOW IT WORKS */}
        <section id="how-it-works" className="scroll-mt-20 px-4 py-4">
          <div className="card-surface mx-auto max-w-6xl overflow-hidden">
            {/* Top section: heading */}
            <div className="bg-cosmos px-8 py-10 sm:px-12">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-300 border border-brand-400/30 mb-3">
                    How it works
                  </span>
                  <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                    Three steps to clarity
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4 sm:mt-0">
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="size-4 text-brand-300" /> Chat
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-4 text-brand-300" /> Call
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Star className="size-3.5 fill-gold-300 text-gold-300" /> Rated
                  </span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="px-8 py-10 sm:px-12">
              <ol className="grid gap-8 md:grid-cols-3">
                {STEPS.map((step, index) => (
                  <li key={step.title} className="relative flex flex-col gap-4">
                    {/* Connector line for desktop */}
                    {index < STEPS.length - 1 && (
                      <div className="hidden md:block absolute left-[calc(50%+2.5rem)] top-5 h-px w-[calc(100%_-_2.5rem)] bg-gradient-to-r from-brand-400/40 to-transparent" />
                    )}
                    <div className="flex items-start gap-4">
                      <span className="medallion flex size-12 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-brand-100">
                        {step.num}
                      </span>
                      <div className="pt-1">
                        <h3 className="font-semibold tracking-tight text-foreground">{step.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────── WHY US */}
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Verified",
                body: "Every astrologer is reviewed and approved before they appear in our directory.",
                tone: "brand",
              },
              {
                icon: Zap,
                title: "Per minute billing",
                body: "Pay only for what you use. No hidden fees, no packages forced on you.",
                tone: "gold",
              },
              {
                icon: Star,
                title: "Rated after each session",
                body: "Honest reviews keep quality high and help you find the right fit fast.",
                tone: "brand",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card-surface group flex flex-col gap-4 p-7 hover:card-glow hover:-translate-y-1 transition-all duration-300"
              >
                <span
                  className={`medallion flex size-12 shrink-0 items-center justify-center rounded-xl ${
                    item.tone === "gold" ? "medallion-gold" : ""
                  }`}
                >
                  <item.icon className="size-5 text-brand-100" />
                </span>
                <div>
                  <h3 className="font-display font-semibold tracking-tight text-foreground">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─────────────────────────────────────────── CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="bg-stars card-glow relative overflow-hidden rounded-2xl bg-cosmos px-8 py-20 text-center sm:px-16">
            {/* decorative orbs */}
            <span className="orb pointer-events-none absolute -left-16 -top-16 size-48 opacity-35 blur-[2px]" aria-hidden />
            <span className="orb-gold orb pointer-events-none absolute -right-10 -bottom-10 size-40 opacity-25 blur-[3px]" aria-hidden />

            <div className="relative">
              <span className="inline-block rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-300 border border-brand-400/30 mb-6">
                Get started today
              </span>
              <h2 className="glow-text font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Ready when you are
              </h2>
              <p className="mx-auto mt-4 max-w-md text-brand-100/70 leading-relaxed">
                Create an account, add your birth details once, and every reading after
                that is a click away.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Get started — it's free
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-brand-300/30 text-brand-100 hover:bg-brand-500/12 sm:w-auto"
                  >
                    Browse astrologers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
