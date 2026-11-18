"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className || "size-3.5"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface Props {
  announcementText?: string | null;
  announcementLink?: string | null;
  marqueeItems?: string[];
}

export function ShopAnnouncementMarquee({
  announcementText,
  announcementLink = "/shop",
}: Props) {
  const { language } = useLanguage();

  const defaultText =
    announcementText ||
    (language === "bn"
      ? "আমাদের নতুন লাক্সারি কালেকশনগুলো দেখুন 🎉✨"
      : "Check out our exciting new launches 🎉✨");

  return (
    <div className="w-full bg-black text-white text-[11px] sm:text-xs py-2 px-4 select-none border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Arrow Icon */}
        <button
          type="button"
          aria-label="Previous announcement"
          className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
        >
          <ChevronLeft className="size-3.5" />
        </button>

        {/* Centered Announcement Message */}
        <Link
          href={announcementLink || "/shop"}
          className="hover:text-amber-300 transition-colors font-medium text-center truncate mx-4 flex items-center justify-center gap-1.5"
        >
          <span>{defaultText}</span>
        </Link>

        {/* Right Side: Next Chevron & Social Icons (Exact Astrotalk Header Match) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Next announcement"
            className="text-stone-400 hover:text-white transition-colors cursor-pointer p-0.5"
          >
            <ChevronRight className="size-3.5" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-stone-700 text-stone-400">
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="size-3.5" />
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
              aria-label="Contact Us"
            >
              <Mail className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
