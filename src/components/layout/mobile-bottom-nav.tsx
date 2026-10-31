"use client";

/**
 * The mobile navigation bar.
 *
 * A floating bar rather than a strip welded to the bottom edge, with the active
 * destination lifted out of it into a circle. The circle and the cradle it sits in
 * both slide to the selected item, so switching tabs reads as one object travelling
 * along the bar instead of two icons swapping state.
 *
 * The lift is done with a background-coloured disc behind the white circle: it
 * paints over the top edge of the bar, which produces the scooped cradle without
 * needing an SVG mask that would have to be redrawn whenever the item count or the
 * bar radius changes.
 */

import { CalendarDays, Compass, Home, ScanFace, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, isSignedIn } = useAuth();

  // Hide during live consultations and AI Astrologer so the chat has the whole screen.
  const hidden =
    pathname.startsWith("/chat/") ||
    pathname.startsWith("/call/") ||
    pathname.startsWith("/ai-astrologer");

  const navItems = React.useMemo(
    () => [
      { href: "/", label: "Home", icon: Home, isActive: pathname === "/" },
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
        icon: UserRound,
        isActive: pathname.startsWith("/account") || pathname.startsWith("/login"),
        showAvatar: isSignedIn,
      },
    ],
    [pathname, isSignedIn],
  );

  const activeIndex = navItems.findIndex((item) => item.isActive);
  const hasActive = activeIndex >= 0;
  const activeItem = hasActive ? navItems[activeIndex] : null;
  const ActiveIcon = activeItem?.icon;

  // Centre of the active column, as a percentage of the bar's width.
  const centre = ((activeIndex + 0.5) / navItems.length) * 100;

  if (hidden) return null;

  return (
    <div
      aria-hidden={false}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
    >
      <nav
        aria-label="Primary"
        className="pointer-events-auto relative mx-3 h-[64px]"
      >
        {/* The bar, with a circular bite taken out under the active circle.
            `nav-notch` carries the mask; see globals.css for why the notch
            position is a registered custom property. */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-[26px] bg-surface",
            "shadow-[0_12px_32px_-12px_rgb(26_18_8_/_0.28),0_2px_8px_rgb(26_18_8_/_0.06)]",
            hasActive && "nav-notch",
          )}
          style={hasActive ? ({ "--notch-x": `${centre}%` } as React.CSSProperties) : undefined}
        />

        {/* The lifted circle */}
        {hasActive && ActiveIcon && (
          <span
            aria-hidden
            className={cn(
              "absolute top-0 flex size-[52px] -translate-x-1/2 -translate-y-[28px] items-center justify-center",
              "rounded-full border-[3px] border-brand-500 bg-surface",
              "shadow-[0_8px_20px_-6px_rgb(221_205_33_/_0.75)]",
            )}
            style={{ left: `${centre}%`, transition: `left 420ms ${EASE}` }}
          >
            {activeItem?.showAvatar ? (
              <Avatar
                src={user?.avatar_url}
                name={user?.full_name}
                size="sm"
                className="size-[30px] text-[11px]"
              />
            ) : (
              <ActiveIcon className="size-[22px] stroke-[2.2] text-ink-950" />
            )}
          </span>
        )}

        {/* The row */}
        <ul className="relative flex h-full items-stretch px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={item.isActive ? "page" : undefined}
                  className="group flex h-full flex-col items-center justify-center gap-1 rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                >
                  {/* While this item is active its icon lives in the circle above,
                      so the slot holds the label alone and the icon fades out
                      under the circle rather than vanishing abruptly. */}
                  <span
                    className={cn(
                      "relative flex size-[22px] items-center justify-center",
                      "transition-all duration-300",
                      item.isActive
                        ? "-translate-y-1 scale-50 opacity-0"
                        : "translate-y-0 scale-100 opacity-100",
                    )}
                  >
                    {item.showAvatar ? (
                      <Avatar
                        src={user?.avatar_url}
                        name={user?.full_name}
                        size="sm"
                        className="size-[22px] text-[9px]"
                      />
                    ) : (
                      <Icon className="size-[21px] stroke-[1.9] text-ink-600 transition-transform duration-200 group-active:scale-90" />
                    )}

                    {item.badge && !item.isActive && (
                      <span className="absolute -right-3 -top-1.5 rounded-full bg-brand-400 px-1 text-[8px] font-black uppercase tracking-wider text-ink-950 shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </span>

                  <span
                    className={cn(
                      "text-[10px] leading-none tracking-tight transition-all duration-300",
                      item.isActive
                        ? "-translate-y-1 font-bold text-ink-950"
                        : "translate-y-0 font-medium text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
