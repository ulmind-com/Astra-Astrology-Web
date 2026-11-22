import Image from "next/image";
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
      <aside className="relative hidden flex-col justify-between overflow-hidden p-8 xl:p-12 lg:flex select-none">
        {/* Background Image: Meditating Guru with Golden Mandala Halo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/meditating-guru.png"
            alt="Meditating Guru with Golden Mandala Halo"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000 hover:scale-100"
          />
          {/* Subtle Dark Celestial Overlay for Pristine Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/55 to-stone-950/75" />
          <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-stone-950/80 pointer-events-none" />
        </div>

        {/* Top: Brand Logo + Name */}
        <Link href="/" className="relative z-10 flex items-center gap-3 font-semibold text-white group w-fit">
          <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-tr from-amber-500/25 to-yellow-500/20 ring-1 ring-amber-400/50 backdrop-blur-md shadow-lg group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="DivinLink"
              width={42}
              height={42}
              className="size-full object-contain p-0.5"
              priority
            />
          </span>
          <span className="font-display tracking-wide text-2xl font-bold text-white drop-shadow-md">
            DivinLink
          </span>
        </Link>

        {/* Middle: Cosmic Wisdom Card */}
        <div className="relative z-10 my-auto max-w-lg rounded-3xl bg-black/45 border border-white/15 p-7 xl:p-9 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-4 shadow-sm">
            <span>✨</span>
            <span>Vedic Wisdom &amp; Celestial Guidance</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold leading-snug text-white drop-shadow-md">
            The sky has been keeping notes since the day you were born.
          </h2>

          <ul className="mt-6 space-y-3.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-stone-200">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
                <span className="leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: Ulmind Credit + Copyright */}
        <div className="relative z-10 space-y-3 pt-6">
          <UlmindCredit className="bg-black/60 border-white/20 text-white backdrop-blur-md shadow-lg hover:border-amber-400/50" />
          <p className="text-xs text-stone-400 font-medium">
            © <Year /> DivinLink. Verified Vedic Consultation Platform.
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 font-semibold lg:hidden"
          >
            <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-soft">
              <Image
                src="/logo.png"
                alt="DivinLink"
                width={36}
                height={36}
                className="size-full object-contain"
                priority
              />
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
