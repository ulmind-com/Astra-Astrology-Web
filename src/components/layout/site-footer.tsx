import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Year } from "@/components/ui";
import { UlmindCredit } from "@/components/ulmind-credit";

const COLUMNS = [
  {
    title: "Consult",
    links: [
      { href: "/astrologers", label: "All astrologers" },
      { href: "/astrologers?online_only=true", label: "Online now" },
      { href: "/astrologers?skill=vedic_astrology", label: "Vedic astrology" },
      { href: "/astrologers?skill=numerology", label: "Numerology" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "My profile" },
      { href: "/account/birth-details", label: "Birth details" },
      { href: "/account/addresses", label: "Addresses" },
      { href: "/account/security", label: "Security" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-20 bg-night-950/55 backdrop-blur-xl">
      <div className="hairline absolute inset-x-0 top-0 h-px" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="medallion flex size-9 items-center justify-center rounded-xl text-brand-100">
                <Sparkles className="size-4" />
              </span>
              <span className="font-display tracking-wide">Astra Astrology</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Guidance from verified astrologers — kundli, matchmaking, numerology and
              vastu, whenever you need clarity.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-foreground">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <UlmindCredit />
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© <Year /> Astra Astrology. All rights reserved.</p>
          <p className="max-w-md sm:text-right">
            Astrological guidance is offered for personal reflection and is not a
            substitute for professional medical, legal or financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
