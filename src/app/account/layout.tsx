"use client";

import {
  CalendarDays, CalendarHeart, MapPin, ShieldCheck, UserRound, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LoadingBlock } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useRequireAuth } from "@/providers/auth-provider";

const NAV = [
  { href: "/account", label: "Profile", icon: UserRound },
  { href: "/account/birth-details", label: "Birth details", icon: CalendarHeart },
  { href: "/account/wallet", label: "Wallet", icon: Wallet },
  { href: "/account/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/security", label: "Security", icon: ShieldCheck },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Held until the session is confirmed, so a protected page never flashes.
  const { ready } = useRequireAuth();

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:py-10 min-w-0">
        {!ready ? (
          <LoadingBlock label="Checking your session…" />
        ) : (
          <div className="flex flex-col md:grid md:grid-cols-[220px_1fr] gap-6 md:gap-8 min-w-0 w-full">
            <nav className="w-full min-w-0 md:sticky md:top-24 md:self-start">
              <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0 overflow-hidden sm:overflow-visible">
                <ul className="flex gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none md:flex-col md:overflow-visible md:p-0 md:gap-1.5">
                  {NAV.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href} className="shrink-0 md:w-full">
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-2.5 rounded-full md:rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                            active
                              ? "bg-brand-300 text-brand-950 font-semibold shadow-soft border border-brand-400/60"
                              : "bg-surface border border-border/80 text-muted-foreground hover:border-border-strong hover:bg-surface-muted hover:text-foreground",
                          )}
                        >
                          <item.icon className={cn("size-4 shrink-0", active ? "text-brand-900" : "text-muted-foreground")} />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            <div className="w-full min-w-0">{children}</div>
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
