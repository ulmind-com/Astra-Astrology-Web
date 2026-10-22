/**
 * Turn a saved profile's birth block into form values.
 *
 * This exists because `/kundli` auto-filled from the signed-in user's saved birth
 * details and `/kundli-matching` did not. A signed-in user therefore got their
 * stored date, time and coordinates on one page and a blank form on the other, and
 * whatever they re-typed on the second page drove a different chart. A tester hit
 * exactly that: one page said Manglik, the other said not.
 *
 * Parsing it in one place means the two pages cannot read the same saved profile
 * differently either.
 */

import type { SelectedPlace } from "@/components/astrology/birth-place-field";

export interface ParsedBirthDetails {
  day: string;
  month: string;
  year: string;
  hour: string;
  minute: string;
  second: string;
  period: "AM" | "PM" | null;
  place: string;
  /** Null when the saved profile has no coordinates, which must not be guessed. */
  selectedPlace: SelectedPlace | null;
}

/** A saved birth block, as the profile endpoint returns it. */
export interface ProfileBirthBlock {
  date_of_birth?: string | null;
  time_of_birth?: string | null;
  place?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  timezone?: string | null;
  timezone_offset?: number | null;
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  // ISO first, since that is what the API stores.
  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) {
    return { day: iso[3].padStart(2, "0"), month: iso[2].padStart(2, "0"), year: iso[1] };
  }
  const dmy = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmy) {
    return { day: dmy[1].padStart(2, "0"), month: dmy[2].padStart(2, "0"), year: dmy[3] };
  }
  return null;
}

function parseTime(value: string | null | undefined) {
  if (!value) return null;
  const match = value.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!match) return null;

  const rawHour = parseInt(match[1], 10);
  const minute = match[2];
  const second = match[3] || "00";
  const explicitPeriod = match[4]?.toUpperCase() as "AM" | "PM" | undefined;

  if (explicitPeriod) {
    return {
      hour: String(rawHour).padStart(2, "0"),
      minute,
      second,
      period: explicitPeriod,
    };
  }

  // No AM/PM marker means the stored value is 24-hour. Converting it here rather
  // than leaving the form's default in place is what stops a morning birth being
  // silently read as an evening one: the period control defaults to PM.
  if (rawHour >= 12) {
    return {
      hour: String(rawHour > 12 ? rawHour - 12 : 12).padStart(2, "0"),
      minute,
      second,
      period: "PM" as const,
    };
  }
  return {
    hour: String(rawHour === 0 ? 12 : rawHour).padStart(2, "0"),
    minute,
    second,
    period: "AM" as const,
  };
}

function toNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Returns the parts of the birth block that could be read. Anything missing comes
 * back undefined rather than defaulted, so a caller never silently inherits a
 * placeholder birth date or a placeholder city.
 */
export function parseProfileBirthDetails(
  birth: ProfileBirthBlock | null | undefined,
): Partial<ParsedBirthDetails> {
  if (!birth) return {};

  const out: Partial<ParsedBirthDetails> = {};

  const date = parseDate(birth.date_of_birth);
  if (date) Object.assign(out, date);

  const time = parseTime(birth.time_of_birth);
  if (time) Object.assign(out, time);

  const placeName =
    birth.place || [birth.city, birth.state, birth.country].filter(Boolean).join(", ");
  if (placeName) out.place = placeName;

  const latitude = toNumber(birth.latitude);
  const longitude = toNumber(birth.longitude);

  // Only build a resolved place when there are real coordinates. Without them the
  // chart has no ascendant worth trusting, and the form should ask rather than
  // fall back to a default city.
  if (latitude !== null && longitude !== null && placeName) {
    out.selectedPlace = {
      place: placeName,
      displayName: placeName,
      latitude,
      longitude,
      timezoneName: typeof birth.timezone === "string" ? birth.timezone : null,
      timezoneOffset: birth.timezone_offset ?? null,
      timezoneLabel: null,
      timezoneAbbreviation: null,
      isDst: false,
    };
  }

  return out;
}
