"use client";

/**
 * The hero's birth bar: the four things a Janam Kundli needs (name, birth
 * date, birth time, birth place) in the cinematic search-bar shape. The send
 * button hands them to /kundli, which casts the chart.
 *
 * Each popover leads into the next one, the way the travel bar's check-out
 * opened the guest picker: name → date → time → place.
 */

import * as React from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

import { BirthPlaceField, type SelectedPlace } from "@/components/astrology/birth-place-field";
import { COPY, MONTHS, WEEKDAYS, shortDate, tr } from "@/components/home/home-cinematic-data";
import type { AstrologyLanguage } from "@/types";

export interface BirthState {
  name: string;
  gender: "male" | "female" | "other";
  dob: Date | null;
  /** hour 1–12; null until set */
  hour: number | null;
  minute: number;
  period: "AM" | "PM";
  timeUnknown: boolean;
  place: SelectedPlace | null;
}

export const EMPTY_BIRTH: BirthState = {
  name: "",
  gender: "male",
  dob: null,
  hour: null,
  minute: 0,
  period: "AM",
  timeUnknown: false,
  place: null,
};

type Panel = "name" | "dob" | "tob" | "pob" | null;

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function formatBirthDate(d: Date, lang: AstrologyLanguage): string {
  return `${shortDate(d, lang)} ${d.getFullYear()}`;
}

export function formatBirthTime(b: BirthState, lang: AstrologyLanguage): string | null {
  if (b.timeUnknown) return tr(COPY.timeUnknown, lang);
  if (b.hour === null) return null;
  return `${b.hour}:${String(b.minute).padStart(2, "0")} ${b.period}`;
}

function clampInt(raw: string, min: number, max: number): number | null {
  const n = parseInt(raw.replace(/\D/g, ""), 10);
  if (isNaN(n)) return null;
  return Math.min(max, Math.max(min, n));
}

/** Hour and minute as free text while typing, written back as numbers. */
function TimeInputs({
  language,
  value,
  onChange,
}: {
  language: AstrologyLanguage;
  value: BirthState;
  onChange: (next: BirthState) => void;
}) {
  const [hourText, setHourText] = React.useState(value.hour === null ? "" : String(value.hour));
  const [minuteText, setMinuteText] = React.useState(
    value.hour === null ? "" : String(value.minute).padStart(2, "0"),
  );
  const digits = (raw: string) => raw.replace(/\D/g, "").slice(0, 2);

  return (
    <div className={`dl-time-row${value.timeUnknown ? " is-off" : ""}`}>
      <label className="dl-time-box">
        <span>{tr(COPY.hourLabel, language)}</span>
        <input
          inputMode="numeric"
          autoComplete="off"
          value={hourText}
          placeholder="10"
          disabled={value.timeUnknown}
          onChange={(e) => {
            const text = digits(e.target.value);
            setHourText(text);
            onChange({ ...value, hour: text ? clampInt(text, 1, 12) : null });
          }}
          onBlur={() => {
            if (value.hour !== null) setHourText(String(value.hour));
          }}
        />
      </label>
      <span className="dl-time-colon">:</span>
      <label className="dl-time-box">
        <span>{tr(COPY.minuteLabel, language)}</span>
        <input
          inputMode="numeric"
          autoComplete="off"
          value={minuteText}
          placeholder="30"
          disabled={value.timeUnknown}
          onFocus={(e) => e.target.select()}
          onChange={(e) => {
            const text = digits(e.target.value);
            setMinuteText(text);
            onChange({ ...value, minute: text ? clampInt(text, 0, 59) ?? 0 : 0 });
          }}
          onBlur={() => {
            if (minuteText) setMinuteText(String(value.minute).padStart(2, "0"));
          }}
        />
      </label>
      <div className="dl-seg dl-seg--col" role="radiogroup" aria-label="AM or PM">
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            type="button"
            role="radio"
            aria-checked={value.period === p}
            className={value.period === p ? "is-on" : ""}
            disabled={value.timeUnknown}
            onClick={() => onChange({ ...value, period: p })}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

interface BarProps {
  language: AstrologyLanguage;
  value: BirthState;
  onChange: (next: BirthState) => void;
  onSubmit: () => void;
}

export function CinematicSearch({ language, value, onChange, onSubmit }: BarProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const [panel, setPanel] = React.useState<Panel>(null);
  const [raised, setRaised] = React.useState<Exclude<Panel, null>>("dob");
  const [hint, setHint] = React.useState<string | null>(null);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [view, setView] = React.useState(() => new Date(today.getFullYear() - 25, 0, 1));
  const years = React.useMemo(() => {
    const list: number[] = [];
    for (let y = today.getFullYear(); y >= 1900; y--) list.push(y);
    return list;
  }, [today]);

  const open = React.useCallback((p: Exclude<Panel, null>) => {
    setRaised(p);
    setHint(null);
    setPanel((cur) => (cur === p ? null : p));
  }, []);

  // Close on outside click or Escape.
  React.useEffect(() => {
    if (!panel) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [panel]);

  React.useEffect(() => {
    if (panel === "name") nameInputRef.current?.focus();
    if (panel === "pob") rootRef.current?.querySelector<HTMLInputElement>(".dl-pop--place input")?.focus();
  }, [panel]);

  const openDob = () => {
    const anchor = value.dob ?? new Date(today.getFullYear() - 25, 0, 1);
    setView(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    open("dob");
  };

  const goNext = (from: Exclude<Panel, null>) => {
    setHint(null);
    if (from === "name") {
      const anchor = value.dob ?? new Date(today.getFullYear() - 25, 0, 1);
      setView(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
      setRaised("dob");
      setPanel("dob");
    } else if (from === "dob") {
      setRaised("tob");
      setPanel("tob");
    } else if (from === "tob") {
      setRaised("pob");
      setPanel("pob");
    } else {
      setPanel(null);
    }
  };

  const submit = () => {
    if (!value.name.trim()) {
      setHint(tr(COPY.needName, language));
      setRaised("name");
      setPanel("name");
      return;
    }
    if (!value.dob) {
      setHint(tr(COPY.needDob, language));
      openDob();
      return;
    }
    if (!value.place) {
      setHint(tr(COPY.needPlace, language));
      setRaised("pob");
      setPanel("pob");
      return;
    }
    setPanel(null);
    onSubmit();
  };

  // Calendar grid, Monday first.
  const cells = React.useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7;
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= days; d++) out.push(new Date(view.getFullYear(), view.getMonth(), d));
    return out;
  }, [view]);

  const atLatestMonth =
    view.getFullYear() === today.getFullYear() && view.getMonth() >= today.getMonth();
  const atEarliestMonth = view.getFullYear() <= 1900 && view.getMonth() === 0;

  const genderOptions: { id: BirthState["gender"]; label: string }[] = [
    { id: "male", label: tr(COPY.male, language) },
    { id: "female", label: tr(COPY.female, language) },
    { id: "other", label: tr(COPY.other, language) },
  ];

  const timeText = formatBirthTime(value, language);
  const fieldClass = (key: Exclude<Panel, null>, extra = "") =>
    `dl-field${extra}${raised === key ? " is-raised" : ""}`;

  return (
    <div ref={rootRef} className="dl-search" role="search" aria-label={tr(COPY.barTab, language)}>
      <div className="dl-search-tab" aria-hidden>
        <Sparkles strokeWidth={1.8} />
        <strong>{tr(COPY.barTab, language)}</strong>
        <span>{tr(COPY.barTabSub, language)}</span>
      </div>

      <button type="button" className={fieldClass("name")} onClick={() => open("name")} aria-expanded={panel === "name"}>
        <span className="dl-field-top">
          <UserRound strokeWidth={1.5} />
          <span className="dl-field-label">{tr(COPY.nameLabel, language)}</span>
        </span>
        <span className={`dl-field-sub${value.name ? " is-set" : ""}`}>
          {value.name.trim() || tr(COPY.addName, language)}
        </span>
      </button>

      <button type="button" className={fieldClass("dob")} onClick={openDob} aria-expanded={panel === "dob"}>
        <span className="dl-field-top">
          <CalendarDays strokeWidth={1.5} />
          <span className="dl-field-label">{tr(COPY.dobLabel, language)}</span>
        </span>
        <span className={`dl-field-sub${value.dob ? " is-set" : ""}`}>
          {value.dob ? formatBirthDate(value.dob, language) : tr(COPY.addDate, language)}
        </span>
      </button>

      <button type="button" className={fieldClass("tob")} onClick={() => open("tob")} aria-expanded={panel === "tob"}>
        <span className="dl-field-top">
          <Clock strokeWidth={1.5} />
          <span className="dl-field-label">{tr(COPY.tobLabel, language)}</span>
        </span>
        <span className={`dl-field-sub${timeText ? " is-set" : ""}`}>{timeText ?? tr(COPY.addTime, language)}</span>
      </button>

      <button
        type="button"
        className={fieldClass("pob", " dl-field--wide")}
        onClick={() => open("pob")}
        aria-expanded={panel === "pob"}
      >
        <span className="dl-field-top">
          <MapPin strokeWidth={1.5} />
          <span className="dl-field-label">{tr(COPY.pobLabel, language)}</span>
        </span>
        <span className={`dl-field-sub${value.place ? " is-set" : ""}`}>
          {value.place?.place ?? tr(COPY.addPlace, language)}
        </span>
      </button>

      <button type="button" className="dl-send" onClick={submit} aria-label={tr(COPY.generate, language)} title={tr(COPY.generate, language)}>
        <Send strokeWidth={1.7} />
        <span className="dl-send-text">{tr(COPY.generate, language)}</span>
      </button>

      {/* ---------- Name ---------- */}
      {panel === "name" && (
        <div className="dl-pop dl-pop--name">
          {hint && <p className="dl-pop-hint">{hint}</p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (value.name.trim()) goNext("name");
            }}
          >
            <input
              ref={nameInputRef}
              className="dl-pop-input"
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              placeholder={tr(COPY.namePlaceholder, language)}
              autoComplete="name"
              maxLength={80}
              aria-label={tr(COPY.nameLabel, language)}
            />
            <div className="dl-seg" role="radiogroup">
              {genderOptions.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  role="radio"
                  aria-checked={value.gender === g.id}
                  className={value.gender === g.id ? "is-on" : ""}
                  onClick={() => onChange({ ...value, gender: g.id })}
                >
                  {g.label}
                </button>
              ))}
            </div>
            <button type="submit" className="dl-pop-done" disabled={!value.name.trim()}>
              {tr(COPY.done, language)}
            </button>
          </form>
        </div>
      )}

      {/* ---------- Birth date ---------- */}
      {panel === "dob" && (
        <div className="dl-pop dl-pop--cal">
          {hint && <p className="dl-pop-hint">{hint}</p>}
          <div className="dl-cal-head">
            <button
              type="button"
              className="dl-cal-nav"
              disabled={atEarliestMonth}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft strokeWidth={1.6} />
            </button>
            <div className="dl-cal-selects">
              <select
                value={view.getMonth()}
                onChange={(e) => {
                  const m = Number(e.target.value);
                  const y = view.getFullYear() === today.getFullYear() ? Math.min(m, today.getMonth()) : m;
                  setView(new Date(view.getFullYear(), y, 1));
                }}
                aria-label="Month"
              >
                {MONTHS[language].map((m, i) => (
                  <option key={m} value={i} disabled={view.getFullYear() === today.getFullYear() && i > today.getMonth()}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={view.getFullYear()}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  const m = y === today.getFullYear() ? Math.min(view.getMonth(), today.getMonth()) : view.getMonth();
                  setView(new Date(y, m, 1));
                }}
                aria-label="Year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="dl-cal-nav"
              disabled={atLatestMonth}
              onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
              aria-label="Next month"
            >
              <ChevronRight strokeWidth={1.6} />
            </button>
          </div>
          <div className="dl-cal-grid">
            {WEEKDAYS[language].map((w) => (
              <span key={w} className="dl-cal-wd">
                {w}
              </span>
            ))}
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const picked = value.dob?.getTime() === d.getTime();
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  className={`dl-cal-day${picked ? " is-end" : ""}`}
                  disabled={d.getTime() > today.getTime()}
                  onClick={() => {
                    onChange({ ...value, dob: d });
                    goNext("dob");
                  }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------- Birth time ---------- */}
      {panel === "tob" && (
        <div className="dl-pop dl-pop--time">
          <TimeInputs language={language} value={value} onChange={onChange} />
          <label className="dl-check">
            <input
              type="checkbox"
              checked={value.timeUnknown}
              onChange={(e) => onChange({ ...value, timeUnknown: e.target.checked })}
            />
            <span>{tr(COPY.timeUnknownToggle, language)}</span>
          </label>
          {value.timeUnknown && <p className="dl-pop-note">{tr(COPY.timeUnknownHint, language)}</p>}
          <button
            type="button"
            className="dl-pop-done"
            disabled={!value.timeUnknown && value.hour === null}
            onClick={() => goNext("tob")}
          >
            {tr(COPY.done, language)}
          </button>
        </div>
      )}

      {/* ---------- Birth place ---------- */}
      {panel === "pob" && (
        <div className="dl-pop dl-pop--place">
          {hint && <p className="dl-pop-hint">{hint}</p>}
          <BirthPlaceField
            id="home-birth-place"
            value={value.place}
            onChange={(place) => {
              onChange({ ...value, place });
              if (place) setPanel(null);
            }}
            birthDate={{
              year: value.dob?.getFullYear(),
              month: value.dob ? value.dob.getMonth() + 1 : undefined,
              day: value.dob?.getDate(),
            }}
            language={language}
          />
        </div>
      )}
    </div>
  );
}
