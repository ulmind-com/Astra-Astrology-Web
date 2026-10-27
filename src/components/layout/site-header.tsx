"use client";

/**
 * The site chrome.
 *
 * On desktop this renders the vertical rail and nothing else: the rail carries the
 * brand, every destination and the account controls, so a top bar would only repeat
 * them. On mobile it renders a slim top bar holding the brand, the coin balance and
 * a menu, because the floating bottom bar only has room for five of the eleven
 * destinations and the other six still have to be reachable.
 *
 * Pages import this one component, so neither the rail nor the mobile bar has to be
 * wired into each page separately.
 */

import { Coins, LogOut, Menu, Sparkles, User, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, Button } from "@/components/ui";
import { RAIL_LINKS, SiteRail } from "@/components/layout/site-rail";
import { useAuth } from "@/providers/auth-provider";
import { useWallet } from "@/hooks/use-wallet";
import { cn } from "@/lib/utils";
import { formatCoins } from "@/types";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const { data: walletData } = useWallet(Boolean(isSignedIn));
  const coinsBalance = walletData?.wallet?.balance_coins;
  const [open, setOpen] = React.useState(false);

  // Navigating closes the sheet. Adjusted during render rather than in an effect,
  // so the new page never paints for a frame with the old page's menu still over it.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  // Lock the page behind the sheet, and restore on the way out.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes the sheet, which a tap-outside alone does not cover for keyboards.
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <SiteRail />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl md:hidden">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="medallion flex size-8 items-center justify-center rounded-xl text-ink-900 shadow-soft transition-transform duration-300 group-active:scale-95">
              <Sparkles className="size-[15px]" />
            </span>
            <span className="font-display text-[14px] font-bold tracking-wide text-foreground">
              DivinLink
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isSignedIn && (
              <Link
                href="/account/wallet"
                aria-label="Wallet and coin balance"
                className="flex items-center gap-1.5 rounded-full border border-brand-400/50 bg-brand-100/80 px-2.5 py-1 text-xs font-bold text-brand-950 shadow-2xs transition-all active:scale-95"
              >
                <Coins className="size-3.5 text-brand-800" />
                <span className="tabular-nums">
                  {coinsBalance !== undefined ? formatCoins(coinsBalance) : "—"}
                </span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative flex size-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-surface-muted active:scale-95"
            >
              {/* Both icons are mounted so they can cross-fade and rotate into
                  each other rather than popping. */}
              <Menu
                className={cn(
                  "absolute size-5 transition-all duration-300",
                  open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100",
                )}
              />
              <X
                className={cn(
                  "absolute size-5 transition-all duration-300",
                  open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-ink-950/25 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Menu sheet. It is always mounted so it can slide rather than appear. */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-14 z-40 md:hidden",
          "max-h-[calc(100dvh-7.5rem)] overflow-y-auto overscroll-contain",
          "rounded-b-[28px] border-b border-border/80 bg-surface/98 px-4 pb-6 pt-4 shadow-2xl backdrop-blur-2xl",
          "transition-all duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0",
        )}
        {...(open ? {} : { inert: "" as unknown as boolean })}
      >
        {isSignedIn && user && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-brand-500/20 bg-cream-100/90 p-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar src={user.avatar_url} name={user.full_name} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink-950">
                  {user.full_name || "Welcome"}
                </p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Link
              href="/account/wallet"
              className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-300 px-3 py-1.5 text-xs font-bold text-ink-950 shadow-2xs transition-colors hover:bg-brand-400"
            >
              <Coins className="size-3.5 text-brand-800" />
              <span>
                {coinsBalance !== undefined ? `${formatCoins(coinsBalance)} coins` : "Wallet"}
              </span>
            </Link>
          </div>
        )}

        <nav aria-label="All destinations" className="grid grid-cols-2 gap-2">
          {RAIL_LINKS.map((link, index) => {
            const Icon = link.icon;
            const active =
              !link.href.startsWith("/#") &&
              (pathname === link.href || pathname.startsWith(`${link.href}/`));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-[52px] items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-[13px] font-semibold",
                  "transition-all duration-300",
                  active
                    ? "border-brand-500/40 bg-brand-200/70 text-ink-950"
                    : "border-border/70 bg-surface-muted/60 text-ink-700 active:scale-[0.97]",
                  // Rows stagger in behind the sheet so the list arrives rather
                  // than snapping into place all at once.
                  open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
                style={{ transitionDelay: open ? `${60 + index * 22}ms` : "0ms" }}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "stroke-[2.3] text-brand-900" : "stroke-[1.9] text-ink-500",
                  )}
                />
                <span className="leading-tight">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t border-border/60 pt-4">
          {isSignedIn ? (
            <div className="space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold text-ink-800 transition-colors hover:bg-surface-muted"
              >
                <User className="size-4 text-brand-700" /> My Account &amp; Settings
              </Link>
              <Link
                href="/account/wallet"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-ink-800 transition-colors hover:bg-surface-muted"
              >
                <span className="flex items-center gap-2.5">
                  <Wallet className="size-4 text-brand-700" /> Wallet &amp; Recharge
                </span>
                <span className="rounded-full bg-brand-200/80 px-2.5 py-0.5 text-xs font-bold tabular-nums text-brand-900">
                  {coinsBalance !== undefined ? `${formatCoins(coinsBalance)} coins` : "Recharge"}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ redirectTo: "/" });
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-danger transition-colors hover:bg-danger/10"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <Link href="/login" className="flex-1">
                <Button variant="secondary" className="h-11 w-full text-sm font-semibold">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="h-11 w-full text-sm font-semibold shadow-glow">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
