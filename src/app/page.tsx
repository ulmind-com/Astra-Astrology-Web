import {
  ArrowRight,
  Compass,
  Hash,
  Heart,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui";

const SERVICES = [
  {
    icon: Compass,
    title: "Kundli & birth chart",
    body: "Your planetary positions, dasha periods and what they point to.",
  },
  {
    icon: Heart,
    title: "Matchmaking",
    body: "Guna milan across all eight kootas, with the doshas read properly.",
  },
  {
    icon: Hash,
    title: "Numerology",
    body: "Mulank, bhagyank, lucky numbers, and what your name adds up to.",
  },
  {
    icon: Sparkles,
    title: "Vastu",
    body: "Room by room, on the sixteen-direction compass.",
  },
];

const STEPS = [
  {
    title: "Tell us when you were born",
    body: "Date, time and place. Saved once, used by every reading.",
  },
  {
    title: "Pick an astrologer",
    body: "Filter by skill, language and experience. See who is online now.",
  },
  {
    title: "Chat or call",
    body: "Ask what is actually on your mind. Pay only for the minutes you use.",
  },
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* ------------------------------------------------------- hero */}
        <section className="bg-stars relative overflow-hidden">
          {/* Planets. Decoration only — they carry no meaning, so they are
              hidden from assistive tech and sit behind the content. */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="orb animate-float-slow absolute -left-28 -top-24 size-80 opacity-80" />
            <span className="absolute -left-36 -top-32 size-[26rem] rounded-full border border-brand-300/20 [transform:rotate(-18deg)_scaleY(0.32)]" />
            <span className="orb animate-float-slow absolute -right-16 top-24 size-56 opacity-70 [animation-delay:-4s]" />
            <span className="orb-gold orb absolute right-28 top-10 size-12 opacity-90" />
            <span className="orb absolute left-[18%] bottom-16 size-8 opacity-70" />
            <span className="orb absolute right-[22%] bottom-24 size-5 opacity-60" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-100 backdrop-blur">
              <Sparkles className="size-3.5" />
              Verified astrologers, real answers
            </span>

            <h1 className="glow-text mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.15] tracking-tight text-white sm:text-6xl">
              Clarity, <span className="text-gradient-brand">written in the stars</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-100/75 sm:text-lg">
              Talk to astrologers who have spent years reading charts. Kundli,
              matchmaking, numerology and vastu — whenever a decision needs a second
              perspective.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/astrologers">
                <Button size="lg" className="w-full sm:w-auto">
                  Find an astrologer
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-brand-300/35 text-brand-100 hover:bg-brand-500/15 sm:w-auto"
                >
                  Create a free account
                </Button>
              </Link>
            </div>

            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Verified", "Every astrologer reviewed"],
                ["Private", "Your birth data stays yours"],
                ["Per minute", "Pay only for what you use"],
              ].map(([term, detail]) => (
                <div key={term} className="card-surface p-4">
                  <dt className="font-display text-sm font-semibold text-white">{term}</dt>
                  <dd className="mt-1 text-xs text-brand-100/70">{detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hairline absolute inset-x-0 bottom-0 h-px" aria-hidden />
        </section>

        {/* --------------------------------------------------- services */}
        <section id="services" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight">What you can ask about</h2>
            <p className="mt-3 text-muted-foreground">
              Traditional methods, read by people who practise them daily.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="card-surface group p-6 text-center transition-all hover:card-glow hover:-translate-y-1"
              >
                <span className="medallion mx-auto flex size-16 items-center justify-center rounded-full text-brand-100 transition-transform group-hover:scale-105">
                  <service.icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display font-semibold">{service.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------- how it works */}
        <section id="how-it-works" className="scroll-mt-20 px-4">
          <div className="card-surface mx-auto max-w-6xl px-6 py-16 sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>

            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative">
                  <span className="medallion flex size-11 items-center justify-center rounded-full font-display text-sm font-semibold text-brand-100">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="size-4 text-brand-300" /> Chat consultations
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="size-4 text-brand-300" /> Voice calls
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="size-4 text-gold-300" /> Rated after every session
              </span>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- cta */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="bg-stars card-glow relative overflow-hidden rounded-2xl bg-cosmos px-6 py-16 text-center sm:px-12">
            <h2 className="glow-text relative font-display text-3xl font-bold tracking-tight text-white">
              Ready when you are
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-brand-100/75">
              Create an account, add your birth details once, and every reading after
              that is a click away.
            </p>
            <Link href="/register" className="relative mt-8 inline-block">
              <Button size="lg">
                Get started
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
