"use client";

import {
  CalendarDays,
  Compass,
  Home,
  ScanFace,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isSignedIn } = useAuth();

  // Hide during live consultations so the video / chat has 100% of the screen
  if (pathname.startsWith("/chat/") || pathname.startsWith("/call/")) {
    return null;
  }

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/astrologers",
      label: "Astrologers",
      icon: Compass,
      isActive: pathname.startsWith("/astrologers"),
    },
    {
      href: "/face-reading",
      label: "Face Read",
      icon: ScanFace,
      isActive: pathname.startsWith("/face-reading"),
      badge: "3D",
    },
    {
      href: "/appointments",
      label: "Bookings",
      icon: CalendarDays,
      isActive: pathname.startsWith("/appointments"),
    },
    {
      href: isSignedIn ? "/account" : "/login",
      label: isSignedIn ? "Account" : "Sign In",
      icon: User,
      isActive: pathname.startsWith("/account") || pathname.startsWith("/login"),
      showAvatar: isSignedIn,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-surface/95 backdrop-blur-xl md:hidden shadow-[0_-8px_24px_rgba(26,18,8,0.06)]"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom, 0.5rem))" }}
    >
      <div className="mx-auto flex h-14 max-w-md items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex flex-1 flex-col items-center justify-center py-1 text-center transition-all duration-200",
                item.isActive
                  ? "text-brand-900 font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium",
              )}
            >
              {/* Active pill background / indicator */}
              {item.isActive && (
                <span
                  className="absolute -top-1.5 h-0.5 w-7 rounded-full bg-brand-500 shadow-[0_2px_8px_rgba(221,205,33,0.8)]"
                  aria-hidden
                />
              )}

              <div className="relative">
                {item.showAvatar ? (
                  <div className={cn(
                    "size-6 rounded-full ring-2 transition-all",
                    item.isActive ? "ring-brand-500" : "ring-transparent",
                  )}>
                    <Avatar
                      src={user?.avatar_url}
                      name={user?.full_name}
                      size="sm"
                      className="size-6 text-[10px]"
                    />
                  </div>
                ) : (
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-200 group-active:scale-90",
                      item.isActive
                        ? "text-brand-800 scale-105 stroke-[2.35]"
                        : "text-ink-600 stroke-[1.8]",
                    )}
                  />
                )}

                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 rounded-full bg-brand-400 px-1 py-0.2 text-[8px] font-black uppercase tracking-wider text-ink-950 shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "mt-1 text-[10px] tracking-tight leading-none",
                  item.isActive ? "text-brand-950 font-bold" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
