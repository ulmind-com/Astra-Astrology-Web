"use client";

/**
 * Unified Site Header
 *
 * Uses the flagship AstroyogiHeader across all application pages, ensuring
 * a seamless top navigation bar, brand identity, multlingual dropdown,
 * real-time coin balance, and mobile drawer that matches the homepage design language.
 */

import { AstroyogiHeader } from "@/components/home/astroyogi-header";

export function SiteHeader({ overlay = false }: { overlay?: boolean } = {}) {
  return <AstroyogiHeader overlay={overlay} />;
}
