import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Year } from "@/components/ui";
import { UlmindCredit } from "@/components/ulmind-credit";

const POINTS = [
  "Your birth details, saved once and reused by every reading",
  "Verified astrologers, filtered by skill and language",
  "Pay by the minute — no subscription",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* The pitch, kept off small screens where it would push the form down. */}
      <aside className="bg-stars relative hidden flex-col justify-between overflow-hidden bg-cosmos p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <span className="orb animate-float-slow absolute -right-20 top-10 size-64 opacity-75" />
          <span className="orb-gold orb absolute left-10 bottom-32 size-10 opacity-85" />
        </div>
        <Link href="/" className="relative flex items-center gap-2 font-semibold text-brand-950">
          <span className="medallion flex size-9 items-center justify-center rounded-xl">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display tracking-wide">DivinLink</span>
        </Link>

        <div className="relative">
          <h2 className="glow-text max-w-sm font-display text-3xl font-bold leading-tight text-brand-950">
            The sky has been keeping notes since the day you were born.
          </h2>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-ink-600">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative space-y-4">
          <UlmindCredit />
          <p className="text-xs text-ink-500">
            © <Year /> DivinLink
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 font-semibold lg:hidden"
          >
            <span className="medallion flex size-9 items-center justify-center rounded-xl text-ink-900">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display tracking-wide">DivinLink</span>
          </Link>
          {children}

          {/* Small screens never see the panel on the left, so the credit
              rides with the form instead. */}
          <div className="mt-10 flex justify-center lg:hidden">
            <UlmindCredit />
          </div>
        </div>
      </main>
    </div>
  );
}
