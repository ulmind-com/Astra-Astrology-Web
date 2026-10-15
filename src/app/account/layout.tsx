"use client";

import { CalendarHeart, MapPin, ShieldCheck, UserRound } from "lucide-react";
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

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        {!ready ? (
          <LoadingBlock label="Checking your session…" />
        ) : (
          <div className="grid gap-8 md:grid-cols-[210px_1fr]">
            <nav className="md:sticky md:top-24 md:self-start">
              <ul className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
                {NAV.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href} className="shrink-0">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-brand-600 text-white"
                            : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                        )}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="min-w-0">{children}</div>
          </div>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
