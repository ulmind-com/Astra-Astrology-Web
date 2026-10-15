import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Year } from "@/components/ui";

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
        <Link href="/" className="relative flex items-center gap-2 font-semibold text-white">
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            <Sparkles className="size-4" />
          </span>
          Astra Astrology
        </Link>

        <div className="relative">
          <h2 className="max-w-sm text-3xl font-bold leading-tight text-white">
            The sky has been keeping notes since the day you were born.
          </h2>
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-sm text-brand-100/85">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-brand-100/50">
          © <Year /> Astra Astrology
        </p>
      </aside>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 font-semibold lg:hidden"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Sparkles className="size-4" />
            </span>
            Astra Astrology
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
