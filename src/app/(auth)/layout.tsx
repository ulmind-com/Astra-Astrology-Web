import Image from "next/image";
import Link from "next/link";
import { Year } from "@/components/ui";
import { UlmindCredit } from "@/components/ulmind-credit";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* The pitch artwork panel, kept off small screens where it would push the form down. */}
      <aside className="relative hidden flex-col justify-between overflow-hidden p-8 xl:p-12 lg:flex select-none">
        {/* Background Image: Meditating Guru with Golden Mandala Halo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/meditating-guru.png"
            alt="Meditating Guru with Golden Mandala Halo"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Gentle top and bottom vignetting only to ensure logo and credit are crisp, while the meditating guru artwork remains 100% bright and clearly visible */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Top: Brand Logo + Name */}
        <Link href="/" className="relative z-10 flex items-center gap-3 font-semibold text-white group w-fit">
          <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-black/30 border border-white/20 ring-1 ring-amber-400/40 backdrop-blur-md shadow-lg group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="DivinLink"
              width={38}
              height={38}
              className="size-full object-contain p-0.5"
              priority
            />
          </span>
          <span className="font-voyage text-[36px] sm:text-[40px] font-normal tracking-[0.01em] text-white drop-shadow-[0_2px_18px_rgba(243,148,25,0.55)] drop-shadow-[0_1px_6px_rgba(36,22,16,0.85)] inline-flex items-center pt-1">
            DivinLink
          </span>
        </Link>

        {/* Middle: Empty spacer so the Meditating Guru artwork is 100% unobstructed */}
        <div className="flex-1" />

        {/* Bottom: Ulmind Credit + Copyright */}
        <div className="relative z-10 space-y-2.5">
          <UlmindCredit className="bg-black/50 border-white/20 text-white backdrop-blur-md shadow-lg hover:border-amber-400/50" />
          <p className="text-xs text-white/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] font-medium">
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
            <span className="font-voyage text-[30px] font-normal tracking-[0.01em] text-stone-900 dark:text-stone-100 inline-flex items-center pt-0.5">DivinLink</span>
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
