"use client";

/**
 * The desktop navigation rail.
 *
 * It replaces a top bar that was trying to hold eleven links across one row. At
 * 1440px the last item wrapped onto three lines and the whole strip read as a wall
 * of text. A vertical rail has room for every destination at a comfortable size,
 * and collapses to icons so it costs 76px of width when you are not using it.
 *
 * Interaction: collapsed by default, expands on hover or on keyboard focus moving
 * inside it. The active item is marked by a single pill that slides between rows
 * rather than eleven pills fading in and out, which is what makes the movement
 * read as one object moving instead of a flicker.
 *
 * The `data-site-rail` attribute is what `globals.css` keys the page's left
 * padding off, so no page has to know the rail exists.
 */

import {
  Bot,
  CalendarDays,
  Coins,
  Compass,
  HeartHandshake,
  Hand,
  Hash,
  HelpCircle,
  Home,
  Hourglass,
  LayoutGrid,
  LogOut,
  Moon,
  Orbit,
  ScanFace,
  ScrollText,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar } from "@/components/ui";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { formatCoins } from "@/types";

export const RAIL_LINKS = [
  { href: "/ai-astrologer", label: "AI Astrologer", icon: Bot },
  { href: "/daily-horoscope", label: "Daily Horoscope", icon: Sparkles },
  { href: "/kundli", label: "Kundli", icon: ScrollText },
  { href: "/kundli-matching", label: "Kundli Matching", icon: HeartHandshake },
  { href: "/kp-calculator", label: "KP Astrology", icon: Orbit },
  { href: "/dasha-calculator", label: "Dasha Calculator", icon: Hourglass },
  { href: "/rashi-calculator", label: "Rashi Calculator", icon: Moon },
  { href: "/nakshatra-calculator", label: "Nakshatra Calculator", icon: Star },
  { href: "/numerology", label: "Numerology", icon: Hash },
  { href: "/vastu", label: "Vastu Shastra", icon: Home },
  { href: "/astrologers", label: "Astrologers", icon: Compass },
  { href: "/appointments", label: "Appointments", icon: CalendarDays },
  { href: "/face-reading", label: "Face reading", icon: ScanFace },
  { href: "/palm-reading", label: "Palm reading", icon: Hand },
  { href: "/#services", label: "Services", icon: LayoutGrid },
  { href: "/#how-it-works", label: "How it works", icon: HelpCircle },
] as const;

/** Row pitch in pixels. The sliding pill is positioned from this, so it has to
 *  match the rendered height of a row exactly. */
const ROW_PITCH = 48;

function isLinkActive(pathname: string, href: string) {
  // Hash links point at sections of the landing page, so they are only "active"
  // when you are actually on the landing page.
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteRail() {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const { data: walletData } = useWallet(Boolean(isSignedIn));
  const coinsBalance = walletData?.wallet?.balance_coins;

  const [expanded, setExpanded] = React.useState(false);

  const activeIndex = RAIL_LINKS.findIndex((link) => isLinkActive(pathname, link.href));

  return (
    <nav
      data-site-rail
      aria-label="Primary"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(event) => {
        // Only collapse when focus has genuinely left the rail, not when it moves
        // between two rows inside it.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setExpanded(false);
        }
      }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 hidden md:flex",
        "flex-col gap-2 border-r border-border/70 bg-surface/90 py-4 backdrop-blur-xl",
        "shadow-[8px_0_32px_-24px_rgb(26_18_8_/_0.4)]",
        "transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        expanded ? "w-[248px]" : "w-[76px]",
      )}
    >
      {/* Brand */}
      <Link
        href="/"
        className="group mx-3 flex h-12 shrink-0 items-center gap-3 rounded-2xl px-2.5 outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        <span className="medallion flex size-9 shrink-0 items-center justify-center rounded-xl text-ink-900 shadow-soft transition-transform duration-300 group-hover:scale-105">
          <Sparkles className="size-4" />
        </span>
        <span
          className={cn(
            "font-display whitespace-nowrap text-[15px] font-bold tracking-wide text-foreground",
            "transition-all duration-300",
            expanded ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-2 opacity-0",
          )}
        >
          Astra Astrology
        </span>
      </Link>

      {/* Destinations */}
      <div className="relative mt-1 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* One pill that slides, rather than eleven that fade. */}
        {activeIndex >= 0 && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-3 right-3 h-[40px] rounded-2xl",
              "bg-brand-300 shadow-[0_6px_18px_-8px_rgb(221_205_33_/_0.9)]",
              "transition-transform duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            )}
            style={{ top: 4, transform: `translateY(${activeIndex * ROW_PITCH}px)` }}
          />
        )}

        <ul className="relative">
          {RAIL_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(pathname, link.href);
            return (
              <li key={link.href} style={{ height: ROW_PITCH }} className="flex items-center">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  title={expanded ? undefined : link.label}
                  className={cn(
                    "group relative flex h-10 w-full items-center gap-3 rounded-2xl px-2.5 outline-none",
                    "transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-600",
                    active
                      ? "text-ink-950"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {/* Hover wash sits under the icon only while collapsed, so the
                      row does not look half-highlighted. */}
                  {!active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl bg-surface-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  )}
                  <span className="relative flex size-[22px] shrink-0 items-center justify-center">
                    <Icon
                      className={cn(
                        "size-[19px] transition-transform duration-300",
                        active
                          ? "scale-105 stroke-[2.3] text-ink-950"
                          : "stroke-[1.8] group-hover:scale-105",
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "relative whitespace-nowrap text-[13px] transition-all duration-300",
                      active ? "font-bold" : "font-medium",
                      expanded
                        ? "translate-x-0 opacity-100"
                        : "pointer-events-none -translate-x-2 opacity-0",
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Account */}
      <div className="mx-3 shrink-0 space-y-1 border-t border-border/70 pt-3">
        {isSignedIn ? (
          <>
            <Link
              href="/account/wallet"
              title={expanded ? undefined : "Wallet"}
              className="group flex h-10 items-center gap-3 rounded-2xl px-2.5 outline-none transition-colors hover:bg-brand-100 focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <span className="flex size-[22px] shrink-0 items-center justify-center">
                <Coins className="size-[19px] text-brand-700" />
              </span>
              <span
                className={cn(
                  "flex min-w-0 flex-1 items-center justify-between gap-2 whitespace-nowrap transition-all duration-300",
                  expanded
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-2 opacity-0",
                )}
              >
                <span className="text-[13px] font-medium text-muted-foreground">Wallet</span>
                <span className="rounded-full bg-brand-200/80 px-2 py-0.5 text-[11px] font-bold tabular-nums text-brand-950">
                  {coinsBalance !== undefined ? formatCoins(coinsBalance) : "—"}
                </span>
              </span>
            </Link>

            <Link
              href="/account"
              title={expanded ? undefined : user?.full_name || "Account"}
              className="group flex h-10 items-center gap-3 rounded-2xl px-2.5 outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <span className="flex size-[22px] shrink-0 items-center justify-center">
                <Avatar
                  src={user?.avatar_url}
                  name={user?.full_name}
                  size="sm"
                  className="size-[22px] text-[9px] ring-2 ring-brand-300/70"
                />
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-[13px] font-semibold text-foreground transition-all duration-300",
                  expanded
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-2 opacity-0",
                )}
              >
                {user?.full_name || "My account"}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => signOut({ redirectTo: "/" })}
              title={expanded ? undefined : "Sign out"}
              className="group flex h-10 w-full items-center gap-3 rounded-2xl px-2.5 text-left outline-none transition-colors hover:bg-danger/10 focus-visible:ring-2 focus-visible:ring-danger"
            >
              <span className="flex size-[22px] shrink-0 items-center justify-center">
                <LogOut className="size-[19px] text-danger" />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[13px] font-medium text-danger transition-all duration-300",
                  expanded
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-2 opacity-0",
                )}
              >
                Sign out
              </span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              title={expanded ? undefined : "Sign in"}
              className="flex h-10 items-center gap-3 rounded-2xl px-2.5 outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-600"
            >
              <span className="flex size-[22px] shrink-0 items-center justify-center">
                <UserRound className="size-[19px] text-muted-foreground" />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[13px] font-medium text-foreground transition-all duration-300",
                  expanded
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-2 opacity-0",
                )}
              >
                Sign in
              </span>
            </Link>

            <Link
              href="/register"
              title={expanded ? undefined : "Get started"}
              className={cn(
                "flex h-10 items-center gap-3 rounded-2xl bg-brand-300 px-2.5 outline-none",
                "transition-colors hover:bg-brand-400 focus-visible:ring-2 focus-visible:ring-brand-700",
              )}
            >
              <span className="flex size-[22px] shrink-0 items-center justify-center">
                <Sparkles className="size-[19px] text-ink-950" />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-[13px] font-bold text-ink-950 transition-all duration-300",
                  expanded
                    ? "translate-x-0 opacity-100"
                    : "pointer-events-none -translate-x-2 opacity-0",
                )}
              >
                Get started
              </span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
