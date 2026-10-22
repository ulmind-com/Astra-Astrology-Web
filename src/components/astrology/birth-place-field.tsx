"use client";

/**
 * Birth-place field with inline geocoding and exact timezone resolution.
 *
 * The birth place used to be a plain text input. Typing a city did nothing: the
 * coordinates only changed if you noticed a separate Map button, searched again
 * inside a modal and pressed Apply. Anyone who simply typed "Delhi" and pressed
 * Calculate got a chart cast for the hard-coded Kolkata default, which moves the
 * ascendant by about seven degrees and silently changes every house placement.
 *
 * This field geocodes as you type, and nothing can be submitted until a real place
 * has been chosen. Each suggestion carries the IANA timezone its coordinates fall
 * in, resolved at the birth date, so Dhaka gets +06:00 rather than Indian Standard
 * Time and a 1900 Kolkata birth gets +05:21:10 rather than +05:30.
 */

import * as React from "react";
import { Check, Clock, Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { astrologyApi } from "@/lib/api";
import type { AstrologyLanguage, GeoSearchResult } from "@/types";

export interface SelectedPlace {
  place: string;
  displayName: string;
  latitude: number;
  longitude: number;
  timezoneName: string | null;
  timezoneOffset: number | null;
  timezoneLabel: string | null;
  timezoneAbbreviation: string | null;
  isDst: boolean;
}

interface BirthPlaceFieldProps {
  value: SelectedPlace | null;
  onChange: (place: SelectedPlace | null) => void;
  /** Birth date, so the offset returned is the one in force then. */
  birthDate: { year?: number; month?: number; day?: number };
  language: AstrologyLanguage;
  /** Shown in red when the user has tried to submit without choosing a place. */
  invalid?: boolean;
  id?: string;
}

const COPY = {
  en: {
    placeholder: "Start typing a city or town…",
    searching: "Searching…",
    noResults: "No place found. Try a different spelling, or add the district or country.",
    useMyLocation: "Use my current location",
    clear: "Clear",
    hint: "Pick your birth place from the list so the exact coordinates and timezone are used.",
    required: "Please choose your birth place from the list.",
    resolving: "Resolving timezone…",
    currentLocation: "Current location",
    locationDenied: "Location permission was denied. Please search for your birth place instead.",
    locationUnsupported: "This browser cannot share a location. Please search instead.",
    tzUnknown: "Timezone could not be determined — set it manually in Advanced settings.",
    dst: "daylight saving in force",
  },
  bn: {
    placeholder: "শহর বা গ্রামের নাম লিখতে শুরু করুন…",
    searching: "খোঁজা হচ্ছে…",
    noResults: "কোনো স্থান পাওয়া যায়নি। বানান বদলে দেখুন, বা জেলা বা দেশের নাম যোগ করুন।",
    useMyLocation: "আমার বর্তমান অবস্থান ব্যবহার করুন",
    clear: "মুছে ফেলুন",
    hint: "তালিকা থেকে জন্মস্থান বেছে নিন, যাতে সঠিক অক্ষাংশ-দ্রাঘিমাংশ ও সময়াঞ্চল ব্যবহার হয়।",
    required: "অনুগ্রহ করে তালিকা থেকে আপনার জন্মস্থান বেছে নিন।",
    resolving: "সময়াঞ্চল নির্ণয় হচ্ছে…",
    currentLocation: "বর্তমান অবস্থান",
    locationDenied: "অবস্থানের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে জন্মস্থান খুঁজে নিন।",
    locationUnsupported: "এই ব্রাউজার অবস্থান জানাতে পারে না। অনুগ্রহ করে খুঁজে নিন।",
    tzUnknown: "সময়াঞ্চল নির্ণয় করা যায়নি — অ্যাডভান্সড সেটিংসে নিজে বসিয়ে দিন।",
    dst: "ডেলাইট সেভিং চালু ছিল",
  },
  hi: {
    placeholder: "शहर या कस्बे का नाम लिखना शुरू करें…",
    searching: "खोज रहे हैं…",
    noResults: "कोई स्थान नहीं मिला। वर्तनी बदलकर देखें, या जिला अथवा देश जोड़ें।",
    useMyLocation: "मेरा वर्तमान स्थान उपयोग करें",
    clear: "हटाएँ",
    hint: "सूची से अपना जन्म स्थान चुनें, जिससे सही अक्षांश-देशांतर एवं समय क्षेत्र प्रयोग हो।",
    required: "कृपया सूची से अपना जन्म स्थान चुनें।",
    resolving: "समय क्षेत्र निर्धारित हो रहा है…",
    currentLocation: "वर्तमान स्थान",
    locationDenied: "स्थान की अनुमति नहीं मिली। कृपया जन्म स्थान खोजें।",
    locationUnsupported: "यह ब्राउज़र स्थान साझा नहीं कर सकता। कृपया खोजें।",
    tzUnknown: "समय क्षेत्र निर्धारित नहीं हो सका — एडवांस सेटिंग्स में स्वयं भरें।",
    dst: "डेलाइट सेविंग लागू थी",
  },
} as const;

function formatCoordinate(value: number, isLatitude: boolean) {
  const direction = isLatitude ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutes = Math.round((absolute - degrees) * 60);
  return `${degrees}°${String(minutes).padStart(2, "0")}′ ${direction}`;
}

function toSelected(item: GeoSearchResult): SelectedPlace {
  return {
    place: item.place || item.city || item.display_name.split(",")[0] || item.display_name,
    displayName: item.display_name,
    latitude: item.latitude,
    longitude: item.longitude,
    timezoneName: item.timezone_name ?? null,
    timezoneOffset: item.timezone ?? null,
    timezoneLabel: item.timezone_label ?? null,
    timezoneAbbreviation: item.timezone_abbreviation ?? null,
    isDst: Boolean(item.is_dst),
  };
}

export function BirthPlaceField({
  value,
  onChange,
  birthDate,
  language,
  invalid = false,
  id = "birth-place",
}: BirthPlaceFieldProps) {
  const copy = COPY[language] ?? COPY.en;

  const [query, setQuery] = React.useState(value?.place ?? "");
  const [results, setResults] = React.useState<GeoSearchResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [locating, setLocating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listboxId = `${id}-listbox`;

  // A request that resolves after the user has typed further must not overwrite
  // newer results, so each search carries a sequence number.
  const requestSeq = React.useRef(0);

  // Keep the visible text in step when the parent resets or prefills the field.
  // Adjusted during render rather than in an effect, so there is no second render
  // pass showing the stale text first.
  const externalPlace = value?.place ?? "";
  const [lastExternalPlace, setLastExternalPlace] = React.useState(externalPlace);
  if (externalPlace !== lastExternalPlace) {
    setLastExternalPlace(externalPlace);
    setQuery(externalPlace);
  }

  const trimmedQuery = query.trim();
  // Nothing to search for while the box still holds the place already chosen,
  // otherwise selecting a suggestion would immediately search for it again.
  const shouldSearch = trimmedQuery.length >= 2 && trimmedQuery !== externalPlace;
  // Derived rather than stored, so no state has to be cleared when the query
  // becomes unsearchable.
  const visibleResults = shouldSearch ? results : [];

  // The birth date arrives as a fresh object literal on every parent render, so the
  // primitives are what the effect depends on. Depending on the object itself would
  // restart the debounce on every render and the search could never fire.
  const { year: birthYear, month: birthMonth, day: birthDay } = birthDate;

  React.useEffect(() => {
    if (!shouldSearch) return;

    const seq = ++requestSeq.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await astrologyApi.geoSearch(trimmedQuery, {
          year: birthYear,
          month: birthMonth,
          day: birthDay,
        });
        if (seq !== requestSeq.current) return;
        setResults(found ?? []);
        setActiveIndex((found ?? []).length > 0 ? 0 : -1);
        setOpen(true);
      } catch {
        if (seq !== requestSeq.current) return;
        setResults([]);
      } finally {
        if (seq === requestSeq.current) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [trimmedQuery, shouldSearch, birthYear, birthMonth, birthDay]);

  // Close on an outside click so the dropdown never traps the page.
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const select = React.useCallback(
    (item: GeoSearchResult) => {
      const selected = toSelected(item);
      onChange(selected);
      setQuery(selected.place);
      setOpen(false);
      setResults([]);
      setActiveIndex(-1);
      setError(null);
    },
    [onChange],
  );

  const clear = () => {
    onChange(null);
    setQuery("");
    setResults([]);
    setOpen(false);
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || visibleResults.length === 0) {
      if (event.key === "ArrowDown" && visibleResults.length > 0) setOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % visibleResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + visibleResults.length) % visibleResults.length);
    } else if (event.key === "Enter") {
      // Only intercept Enter while a suggestion is highlighted, so Enter still
      // submits the form once a place has been chosen.
      if (activeIndex >= 0 && visibleResults[activeIndex]) {
        event.preventDefault();
        select(visibleResults[activeIndex]);
      }
    } else if (event.key === "Tab" && activeIndex >= 0 && visibleResults[activeIndex]) {
      select(visibleResults[activeIndex]);
    }
  };

  const useCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      setError(copy.locationUnsupported);
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const tz = await astrologyApi.lookupTimezone({
            latitude,
            longitude,
            year: birthDate.year || new Date().getFullYear(),
            month: birthDate.month || 1,
            day: birthDate.day || 1,
            hour: 12,
          });
          const label = `${copy.currentLocation} (${formatCoordinate(
            latitude,
            true,
          )}, ${formatCoordinate(longitude, false)})`;
          onChange({
            place: label,
            displayName: label,
            latitude,
            longitude,
            timezoneName: tz?.timezone_name ?? null,
            timezoneOffset: tz?.timezone ?? null,
            timezoneLabel: tz?.timezone_label ?? null,
            timezoneAbbreviation: tz?.timezone_abbreviation ?? null,
            isDst: Boolean(tz?.is_dst),
          });
          setQuery(label);
          setOpen(false);
        } catch {
          setError(copy.tzUnknown);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setError(copy.locationDenied);
      },
      { timeout: 10_000 },
    );
  };

  const showEmptyState =
    open && searched && shouldSearch && !loading && visibleResults.length === 0;

  return (
    <div className="space-y-2" ref={containerRef}>
      <div className="relative">
        <div
          className={`flex items-center gap-2 rounded-2xl border bg-white px-3 shadow-2xs transition-all focus-within:ring-2 ${
            invalid && !value
              ? "border-rose-400 focus-within:ring-rose-300"
              : "border-border focus-within:border-brand-500 focus-within:ring-brand-400/40"
          }`}
        >
          <Search className="size-4 shrink-0 text-brand-600" aria-hidden />
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
            }
            aria-invalid={invalid && !value}
            aria-describedby={`${id}-hint`}
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (value) onChange(null);
            }}
            onFocus={() => {
              if (visibleResults.length > 0) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={copy.placeholder}
            className="min-w-0 flex-1 bg-transparent py-3 text-sm font-medium text-foreground outline-hidden placeholder:text-muted-foreground/70"
          />
          {loading && <Loader2 className="size-4 shrink-0 animate-spin text-brand-600" aria-hidden />}
          {!loading && value && (
            <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
          )}
          {!loading && (query || value) && (
            <button
              type="button"
              onClick={clear}
              aria-label={copy.clear}
              className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {(open || showEmptyState) && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-white p-1.5 shadow-xl"
          >
            {loading && visibleResults.length === 0 && (
              <p className="flex items-center gap-2 px-3 py-3 text-xs font-medium text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> {copy.searching}
              </p>
            )}

            {showEmptyState && (
              <p className="px-3 py-3 text-xs font-medium text-muted-foreground">
                {copy.noResults}
              </p>
            )}

            {visibleResults.map((item, index) => {
              const label =
                item.place || item.city || item.display_name.split(",")[0] || item.display_name;
              const rest = item.display_name
                .split(",")
                .slice(1)
                .join(",")
                .trim();
              return (
                <button
                  key={`${item.latitude}-${item.longitude}-${index}`}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(item)}
                  className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    index === activeIndex ? "bg-brand-100" : "hover:bg-surface-muted"
                  }`}
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {label}
                    </span>
                    {rest && (
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {rest}
                      </span>
                    )}
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium text-muted-foreground">
                      <span className="tabular-nums">
                        {formatCoordinate(item.latitude, true)} ·{" "}
                        {formatCoordinate(item.longitude, false)}
                      </span>
                      {item.timezone_label && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-brand-100 px-1.5 py-0.5 font-semibold text-brand-900">
                          <Clock className="size-2.5" />
                          {item.timezone_label}
                          {item.timezone_abbreviation ? ` ${item.timezone_abbreviation}` : ""}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 text-[11px] font-semibold text-brand-800 transition-colors hover:bg-brand-100 disabled:opacity-60"
        >
          {locating ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Navigation className="size-3" />
          )}
          {copy.useMyLocation}
        </button>

        {value && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <Clock className="size-3 text-brand-600" />
            {value.timezoneName ? (
              <>
                <span className="font-semibold text-foreground">{value.timezoneName}</span>
                {value.timezoneLabel && <span className="tabular-nums">{value.timezoneLabel}</span>}
                {value.isDst && <span className="text-amber-700">· {copy.dst}</span>}
              </>
            ) : (
              <span className="text-amber-700">{copy.tzUnknown}</span>
            )}
          </span>
        )}
      </div>

      <p id={`${id}-hint`} className="text-[11px] leading-relaxed text-muted-foreground">
        {invalid && !value ? (
          <span className="font-semibold text-rose-600">{copy.required}</span>
        ) : (
          copy.hint
        )}
      </p>

      {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
