"use client";

import { LogOut, Menu, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar, Button } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/astrologers", label: "Astrologers" },
  { href: "/appointments", label: "Appointments" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isSignedIn, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 bg-night-950/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 font-semibold group">
          <span className="medallion flex size-9 items-center justify-center rounded-xl text-brand-100 shadow-[0_0_16px_-4px_rgb(168_85_247/0.6)] transition-all duration-300 group-hover:shadow-[0_0_24px_-4px_rgb(168_85_247/0.9)]">
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
                  ? "bg-brand-500/15 text-brand-200 ring-1 ring-brand-400/35 shadow-[0_0_12px_-4px_rgb(168_85_247/0.4)]"
                  : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Link href="/account" className="hidden md:block" aria-label="My account">
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
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-xl"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      <div className="hairline h-px w-full" aria-hidden />

      {open && (
        <div className="bg-night-900/96 px-4 py-3 backdrop-blur-2xl md:hidden">
          <nav className="flex flex-col gap-0.5">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border/60 pt-3">
              {isSignedIn ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium hover:bg-surface-muted transition-colors"
                  >
                    <User className="size-4" /> My account
                  </Link>
                  <button
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
                  >
                    <LogOut className="size-4" /> Sign out
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">Get started</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
