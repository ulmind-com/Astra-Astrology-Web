"use client";

import { Coins, LogOut, Menu, Sparkles, User, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, Button } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import { formatCoins } from "@/types";

const LINKS = [
  { href: "/astrologers", label: "Astrologers" },
  { href: "/appointments", label: "Appointments" },
  { href: "/face-reading", label: "Face reading" },
  { href: "/rashi-calculator", label: "Rashi Calculator" },
  { href: "/nakshatra-calculator", label: "Nakshatra Calculator" },
  { href: "/kp-calculator", label: "KP Astrology" },
  { href: "/dasha-calculator", label: "Dasha Calculator" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const { data: walletData } = useWallet(Boolean(isSignedIn));
  const coinsBalance = walletData?.wallet?.balance_coins;
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll when mobile menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 font-semibold group shrink-0"
          >
            <span className="medallion flex size-9 items-center justify-center rounded-xl text-ink-900 shadow-soft transition-all duration-300 group-hover:scale-105">
              <Sparkles className="size-4" />
            </span>
            <span className="font-display text-[15px] font-bold tracking-wide text-foreground">
              Astra Astrology
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-brand-200/60 text-ink-800 ring-1 ring-brand-500/35 shadow-soft"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {isSignedIn ? (
              <>
                {/* Quick Wallet Button - Visible on Desktop & Mobile */}
                <Link
                  href="/account/wallet"
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border transition-all duration-200",
                    "border-brand-400/50 bg-brand-100/80 hover:bg-brand-200/90 text-brand-950 font-bold",
                    "px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs shadow-2xs hover:shadow-soft active:scale-95",
                  )}
                  title="My Wallet & Coin Balance"
                  aria-label="Wallet"
                >
                  <Coins className="size-3.5 text-brand-800" />
                  <span className="tabular-nums font-bold">
                    {coinsBalance !== undefined ? formatCoins(coinsBalance) : "—"}
                  </span>
                  <span className="hidden sm:inline text-[11px] font-medium text-ink-700">
                    coins
                  </span>
                </Link>

                <Link
                  href="/account"
                  className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-brand-400 transition-all shrink-0"
                  aria-label="My account"
                >
                  <Avatar src={user?.avatar_url} name={user?.full_name} size="sm" />
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:inline-flex"
                  onClick={() => signOut({ redirectTo: "/" })}
                >
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="h-9 px-3 text-xs sm:text-sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" className="hidden sm:inline-flex">
                  <Button size="sm" className="h-9 px-3.5 text-xs sm:text-sm">Get started</Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-xl size-10"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Sheet */}
        {open && (
          <div className="md:hidden border-t border-border/80 bg-surface/98 backdrop-blur-2xl px-4 py-4 shadow-xl max-h-[calc(100dvh-4rem)] overflow-y-auto">
            {/* Signed-in user card on mobile */}
            {isSignedIn && user && (
              <div className="mb-4 rounded-2xl bg-cream-100/90 p-3.5 border border-brand-500/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar src={user.avatar_url} name={user.full_name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-950">{user.full_name || "Welcome"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/account/wallet"
                  onClick={() => setOpen(false)}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-brand-300 px-3 py-1.5 text-xs font-bold text-ink-950 hover:bg-brand-400 transition-colors shadow-2xs"
                >
                  <Coins className="size-3.5 text-brand-800" />
                  <span>{coinsBalance !== undefined ? `${formatCoins(coinsBalance)} coins` : "Wallet"}</span>
                </Link>
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                      active
                        ? "bg-brand-200/70 text-ink-950 font-bold"
                        : "text-ink-700 hover:bg-surface-muted hover:text-foreground",
                    )}
                  >
                    <span>{link.label}</span>
                    {active && <span className="size-1.5 rounded-full bg-brand-700" />}
                  </Link>
                );
              })}

              <div className="mt-3 border-t border-border/60 pt-3">
                {isSignedIn ? (
                  <div className="space-y-1">
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold hover:bg-surface-muted transition-colors text-ink-800"
                    >
                      <User className="size-4 text-brand-700" /> My Account & Settings
                    </Link>
                    <Link
                      href="/account/wallet"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold hover:bg-surface-muted transition-colors text-ink-800"
                    >
                      <span className="flex items-center gap-2.5">
                        <Wallet className="size-4 text-brand-700" /> Wallet & Recharge
                      </span>
                      <span className="text-xs font-bold text-brand-900 bg-brand-200/80 px-2.5 py-0.5 rounded-full tabular-nums">
                        {coinsBalance !== undefined ? `${formatCoins(coinsBalance)} coins` : "Recharge"}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ redirectTo: "/" });
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
                    >
                      <LogOut className="size-4" /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2.5 pt-1">
                    <Link href="/login" onClick={() => setOpen(false)} className="flex-1">
                      <Button variant="secondary" className="w-full h-11 text-sm font-semibold">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)} className="flex-1">
                      <Button className="w-full h-11 text-sm font-semibold shadow-glow">
                        Get started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Dim backdrop when drawer is open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 top-16 z-30 bg-ink-950/20 backdrop-blur-2xs md:hidden"
          aria-hidden
        />
      )}
    </>
  );
}
