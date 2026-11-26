import type { SelectedPlace } from "@/components/astrology/birth-place-field";

/**
 * Birth details handed from the home page's birth bar to /kundli.
 *
 * Session storage rather than the URL: a birth date, time and place are
 * personal data and must never sit in a query string, browser history or an
 * analytics log. The entry is read once and removed, and it expires after ten
 * minutes so a stale tab cannot resurrect it.
 */
export interface KundliPrefill {
  name: string;
  gender: "male" | "female" | "other";
  day: number;
  month: number;
  year: number;
  /** null when the birth time is not known; the Kundli page then uses noon. */
  time: { hour: number; minute: number; period: "AM" | "PM" } | null;
  place: SelectedPlace | null;
}

const KEY = "divinlink_kundli_prefill";
const RASHI_KEY = "divinlink_rashi_prefill";
const TTL_MS = 10 * 60 * 1000;

export function saveKundliPrefill(data: KundliPrefill): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable: the Kundli form simply starts empty */
  }
}

export function takeKundliPrefill(): KundliPrefill | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as { at: number; data: KundliPrefill };
    if (!parsed?.data || Date.now() - parsed.at > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function saveRashiPrefill(data: KundliPrefill): void {
  try {
    sessionStorage.setItem(RASHI_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage unavailable */
  }
}

export function takeRashiPrefill(): KundliPrefill | null {
  try {
    const raw = sessionStorage.getItem(RASHI_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RASHI_KEY);
    const parsed = JSON.parse(raw) as { at: number; data: KundliPrefill };
    if (!parsed?.data || Date.now() - parsed.at > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}
