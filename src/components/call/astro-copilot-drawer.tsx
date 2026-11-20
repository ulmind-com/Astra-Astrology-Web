"use client";

/**
 * The Astro Co-Pilot Drawer for live video & audio chambers.
 *
 * Provides real-time instant astrological cheat-sheet during a consultation:
 * - Lagna (Ascendant), Moon Sign (Rashi) & Nakshatra
 * - 9 Planetary Placements (houses, signs, degrees, retrograde status)
 * - Running Vimshottari Mahadasha & Antardasha with elapsed progress
 * - Saturn's Sade Sati / Dhaiya phase and transit impact
 * - Instant Remedy Focus (Gemstone, Metal, Finger, Beej Mantra, Deity)
 * - In-Chamber Live Birth Rectification & Entry Form with auto-geocoding
 *
 * Supports seamless Light & Dark themes.
 */

import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Check,
  Clock,
  Compass,
  Edit3,
  Flame,
  Gem,
  Info,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { COPILOT_KEY, useCoPilot } from "@/hooks/use-copilot";
import { callApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type {
  CoPilotBirthDetailsInput,
  CoPilotDashaPeriod,
  CoPilotPlanetPosition,
  CoPilotSadeSati,
  CoPilotSummary,
} from "@/types/copilot";

const SADE_SATI_TONE_DARK: Record<CoPilotSadeSati["impact_level"], string> = {
  high: "border-rose-500/40 bg-rose-950/60 text-rose-200",
  medium: "border-amber-500/40 bg-amber-950/60 text-amber-200",
  favorable: "border-emerald-500/40 bg-emerald-950/60 text-emerald-200",
};

const SADE_SATI_TONE_LIGHT: Record<CoPilotSadeSati["impact_level"], string> = {
  high: "border-rose-300 bg-rose-50 text-rose-900",
  medium: "border-amber-300 bg-amber-50 text-amber-900",
  favorable: "border-emerald-300 bg-emerald-50 text-emerald-900",
};

const COMMON_CITIES = [
  "Kolkata",
  "Howrah",
  "Siliguri",
  "Dhaka",
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Patna",
  "Guwahati",
];

function DashaRow({
  label,
  period,
  isDark,
}: {
  label: string;
  period: CoPilotDashaPeriod;
  isDark: boolean;
}) {
  const pct = Math.max(0, Math.min(100, period.percent_complete));
  return (
    <div
      className={cn(
        "rounded-xl border p-2.5 transition-all",
        isDark
          ? "border-white/10 bg-white/[0.04] text-white"
          : "border-amber-200/80 bg-amber-50/60 text-amber-950 shadow-xs",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p
          className={cn(
            "text-[10px] font-bold tracking-wider",
            isDark ? "text-amber-400" : "text-amber-800",
          )}
        >
          {label}
        </p>
        <p className={cn("shrink-0 text-[10px]", isDark ? "text-white/60" : "text-slate-600")}>
          {period.days_remaining} দিন বাকি ({period.days_remaining}d left)
        </p>
      </div>
      <div className="mt-0.5 flex items-baseline justify-between">
        <p
          className={cn(
            "truncate text-base font-bold",
            isDark ? "text-amber-200" : "text-amber-950",
          )}
        >
          {period.lord_label}
        </p>
        <span className={cn("text-[10px] font-medium", isDark ? "text-white/60" : "text-slate-600")}>
          {pct.toFixed(0)}% সমাপ্ত
        </span>
      </div>
      <p className={cn("text-[10px]", isDark ? "text-white/60" : "text-slate-500")}>
        {period.starts_on} → {period.ends_on}
      </p>
      <div
        className={cn(
          "mt-1.5 h-[4px] overflow-hidden rounded-full",
          isDark ? "bg-white/10" : "bg-amber-200/60",
        )}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function GrahaGrid({
  planets,
  isDark,
}: {
  planets: CoPilotPlanetPosition[];
  isDark: boolean;
}) {
  if (!planets || planets.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-[10px] font-bold tracking-wider",
            isDark ? "text-amber-300/80" : "text-amber-900/80",
          )}
        >
          PLANETARY POSITIONS (গ্রহাবস্থান)
        </p>
        <span className={cn("text-[9px]", isDark ? "text-white/40" : "text-slate-500")}>
          Vedic Bhava (ভাব)
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {planets.map((p) => (
          <div
            key={p.name}
            className={cn(
              "flex flex-col rounded-lg border p-1.5 transition-colors",
              isDark
                ? "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]"
                : "border-amber-200/70 bg-white/90 hover:bg-amber-50/50 shadow-xs",
            )}
          >
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "truncate text-[11px] font-bold",
                  isDark ? "text-amber-200" : "text-amber-950",
                )}
              >
                {p.label}
              </span>
              {p.is_retrograde && (
                <span className="rounded bg-rose-500/20 px-1 py-0.2 text-[8px] font-bold text-rose-500">
                  বক্রী [R]
                </span>
              )}
            </div>
            <div className="mt-0.5 flex items-baseline justify-between text-[10px]">
              <span className="font-semibold text-amber-500">{p.house}H</span>
              <span
                className={cn("truncate", isDark ? "text-white/70" : "text-slate-600")}
                title={p.sign}
              >
                {p.sign_label}
              </span>
            </div>
            {p.degree_formatted && (
              <span className={cn("text-[9px]", isDark ? "text-white/40" : "text-slate-400")}>
                {p.degree_formatted}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BirthEntryForm({
  callId,
  initialPlace = "",
  initialDate = "",
  initialTime = "",
  isDark,
  onSuccess,
  onCancel,
}: {
  callId: string;
  initialPlace?: string;
  initialDate?: string;
  initialTime?: string;
  isDark: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const [dateOfBirth, setDateOfBirth] = React.useState(initialDate);
  const [timeOfBirth, setTimeOfBirth] = React.useState(initialTime);
  const [isTimeUnknown, setIsTimeUnknown] = React.useState(!initialTime);
  const [place, setPlace] = React.useState(initialPlace);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateOfBirth) {
      toast.error("অনুগ্রহ করে ক্লায়েন্টের জন্মতারিখ প্রদান করুন");
      return;
    }
    if (!place.trim()) {
      toast.error("অনুগ্রহ করে ক্লায়েন্টের জন্মস্থান প্রদান করুন");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CoPilotBirthDetailsInput = {
        date_of_birth: dateOfBirth,
        time_of_birth: isTimeUnknown ? null : timeOfBirth || null,
        is_time_known: !isTimeUnknown,
        place: place.trim(),
      };

      await callApi.updateCopilotBirthDetails(callId, payload);
      await queryClient.invalidateQueries({ queryKey: [...COPILOT_KEY, callId] });
      toast.success("জন্ম বিবরণ আপডেট ও চার্ট সফলভাবে রিক্যালকুলেট হয়েছে! ✨");
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "জন্ম বিবরণ আপডেট করা যায়নি");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-3 rounded-xl p-3 border",
        isDark
          ? "border-amber-500/20 bg-slate-900/60"
          : "border-amber-200 bg-amber-50/40",
      )}
    >
      <div className="flex items-center justify-between border-b pb-2">
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs font-bold",
            isDark ? "text-amber-300" : "text-amber-900",
          )}
        >
          <Calendar className="size-3.5 text-amber-500" />
          <span>জন্ম বিবরণ সম্পাদনা (Edit Birth Details)</span>
        </p>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "text-[10px] font-semibold",
              isDark ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-800",
            )}
          >
            বাতিল (Cancel)
          </button>
        )}
      </div>

      <div>
        <label
          className={cn(
            "block text-[10px] font-semibold tracking-wider",
            isDark ? "text-white/70" : "text-slate-700",
          )}
        >
          DATE OF BIRTH (জন্মতারিখ) *
        </label>
        <div className="relative mt-1">
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
            className={cn(
              "w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none",
              isDark
                ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-amber-400"
                : "border-amber-300/80 bg-white text-slate-900 placeholder-slate-400 focus:border-amber-500",
            )}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            className={cn(
              "block text-[10px] font-semibold tracking-wider",
              isDark ? "text-white/70" : "text-slate-700",
            )}
          >
            TIME OF BIRTH (সময়)
          </label>
          <label
            className={cn(
              "flex cursor-pointer items-center gap-1.5 text-[10px]",
              isDark ? "text-amber-300/90" : "text-amber-800",
            )}
          >
            <input
              type="checkbox"
              checked={isTimeUnknown}
              onChange={(e) => {
                setIsTimeUnknown(e.target.checked);
                if (e.target.checked) setTimeOfBirth("");
              }}
              className="size-3 rounded border-amber-300 text-amber-500 focus:ring-0"
            />
            অজানা / আনুমানিক
          </label>
        </div>
        {!isTimeUnknown && (
          <div className="relative mt-1">
            <input
              type="time"
              value={timeOfBirth}
              onChange={(e) => setTimeOfBirth(e.target.value)}
              className={cn(
                "w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none",
                isDark
                  ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-amber-400"
                  : "border-amber-300/80 bg-white text-slate-900 placeholder-slate-400 focus:border-amber-500",
              )}
            />
          </div>
        )}
      </div>

      <div>
        <label
          className={cn(
            "block text-[10px] font-semibold tracking-wider",
            isDark ? "text-white/70" : "text-slate-700",
          )}
        >
          BIRTHPLACE / CITY (জন্মস্থান) *
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="e.g. Kolkata, West Bengal"
            required
            className={cn(
              "w-full rounded-lg border px-2.5 py-1.5 text-xs focus:outline-none",
              isDark
                ? "border-white/15 bg-white/5 text-white placeholder-white/40 focus:border-amber-400"
                : "border-amber-300/80 bg-white text-slate-900 placeholder-slate-400 focus:border-amber-500",
            )}
          />
        </div>

        {/* Quick city suggestions */}
        <div className="mt-1.5 flex flex-wrap gap-1">
          {COMMON_CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setPlace(c)}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[9px] transition-colors",
                isDark
                  ? "border-white/10 bg-white/5 text-white/70 hover:border-amber-300/40 hover:bg-white/10 hover:text-white"
                  : "border-amber-200 bg-white text-amber-900 hover:border-amber-400 hover:bg-amber-50",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-2 text-xs font-bold text-slate-950 shadow-md transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>কুন্ডলী চার্ট গণনা করা হচ্ছে...</span>
          </>
        ) : (
          <>
            <Sparkles className="size-3.5" />
            <span>চার্ট রি-ক্যালকুলেট করুন (Calculate Chart)</span>
          </>
        )}
      </button>
    </form>
  );
}

export function AstroCoPilotDrawer({
  callId,
  isOpen,
  onClose,
  theme = "light",
}: {
  callId: string | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  const { data, isLoading, isError, refetch } = useCoPilot(callId, isOpen);
  const [isEditing, setIsEditing] = React.useState(false);

  if (!isOpen || !callId) return null;

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 bottom-0 z-40 w-full sm:w-[420px] md:w-[450px] flex flex-col shadow-2xl transition-all duration-300 border-l backdrop-blur-2xl animate-in slide-in-from-right",
        isDark
          ? "border-amber-500/30 bg-slate-950/95 text-slate-100"
          : "border-[#ebdca5] bg-[#fffdf9]/95 text-slate-900",
      )}
    >
      {/* Drawer Header */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 border-b px-4 py-3 shrink-0",
          isDark ? "border-white/10 bg-black/40" : "border-amber-200/80 bg-amber-50/70",
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-500">
            <Compass className="size-4" />
          </div>
          <div className="min-w-0">
            <h3
              className={cn(
                "truncate text-xs font-bold leading-none",
                isDark ? "text-amber-200" : "text-amber-950",
              )}
            >
              Astro Co-Pilot
            </h3>
            <p className={cn("truncate text-[10px] mt-0.5", isDark ? "text-white/60" : "text-slate-500")}>
              {data?.client_name ? `ক্লায়েন্ট: ${data.client_name}` : "লাইভ চেম্বার অ্যাসিস্ট্যান্ট"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {data?.is_ready && (
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              title="Edit / Rectify client birth details"
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors border",
                isEditing
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-500"
                  : isDark
                    ? "border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    : "border-amber-200 text-amber-900 hover:bg-amber-100/60",
              )}
            >
              <Edit3 className="size-3" />
              <span className="hidden sm:inline">জন্ম বিবরণ</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Co-Pilot Drawer"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              isDark
                ? "text-white/70 hover:bg-white/10 hover:text-white"
                : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-900",
            )}
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <Sparkles className="size-8 animate-spin text-amber-500" />
            <p className={cn("text-xs font-semibold", isDark ? "text-white/80" : "text-slate-700")}>
              লাইভ কুন্ডলী ও গোচর দশা রিড করা হচ্ছে...
            </p>
            <span className={cn("text-[11px]", isDark ? "text-white/50" : "text-slate-500")}>
              Reading Vedic chart & transit...
            </span>
          </div>
        ) : isError || !data ? (
          <div
            className={cn(
              "space-y-3 rounded-2xl border p-4 text-center",
              isDark ? "border-amber-500/25 bg-white/5" : "border-amber-200 bg-amber-50/50",
            )}
          >
            <p className={cn("text-xs font-bold", isDark ? "text-white/80" : "text-slate-800")}>
              Co-Pilot ডাটা লোড করা যায়নি
            </p>
            <p className={cn("text-[11px]", isDark ? "text-white/60" : "text-slate-600")}>
              Could not load client astrological summary.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                আবার চেষ্টা করুন
              </button>
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "text-xs font-semibold underline",
                  isDark ? "text-white/60" : "text-slate-600",
                )}
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : isEditing ? (
          <BirthEntryForm
            callId={callId}
            initialPlace={data.birth_place_str}
            initialDate={
              data.birth_date_str ? data.birth_date_str.split("-").reverse().join("-") : ""
            }
            initialTime={data.is_birth_time_known ? data.birth_time_str : ""}
            isDark={isDark}
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        ) : !data.is_ready ? (
          <div className="space-y-3">
            <div
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-3",
                isDark
                  ? "border-amber-500/30 bg-amber-950/40 text-amber-200"
                  : "border-amber-300 bg-amber-50 text-amber-900",
              )}
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <p className="text-[11px] leading-snug font-medium">{data.unavailable_reason}</p>
            </div>

            <BirthEntryForm
              callId={callId}
              isDark={isDark}
              onSuccess={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <>
            {/* Accuracy alert */}
            {data.accuracy_note && (
              <div
                className={cn(
                  "flex items-start gap-2 rounded-xl border p-2.5",
                  isDark
                    ? "border-amber-500/30 bg-amber-950/40 text-amber-200"
                    : "border-amber-300 bg-amber-50 text-amber-900",
                )}
              >
                <TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                <p className="text-[10px] leading-snug">{data.accuracy_note}</p>
              </div>
            )}

            {/* Vedic Identity Card */}
            <div
              className={cn(
                "rounded-xl border p-3 space-y-2",
                isDark
                  ? "border-amber-500/25 bg-amber-950/20"
                  : "border-amber-200 bg-amber-50/50 shadow-xs",
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Compass className="size-3.5 text-amber-500" />
                  <span className={cn("font-semibold", isDark ? "text-white/70" : "text-slate-600")}>
                    লগ্ন (Lagna):
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      isDark ? "text-amber-300" : "text-amber-900",
                    )}
                  >
                    {data.ascendant || "Aries"}
                    {data.ascendant_degree ? ` (${data.ascendant_degree})` : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] border-t pt-1.5 border-dashed border-amber-300/40">
                <div>
                  <span className={cn(isDark ? "text-white/50" : "text-slate-500")}>
                    চন্দ্র রাশি:&nbsp;
                  </span>
                  <span
                    className={cn(
                      "font-bold",
                      isDark ? "text-amber-200" : "text-amber-950",
                    )}
                  >
                    {data.moon_sign}
                  </span>
                </div>
                <div>
                  <span className={cn(isDark ? "text-white/50" : "text-slate-500")}>
                    নক্ষত্র:&nbsp;
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      isDark ? "text-white/85" : "text-slate-700",
                    )}
                  >
                    {data.nakshatra}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "flex flex-wrap items-center gap-2 border-t pt-1.5 text-[10px]",
                  isDark ? "border-white/10 text-white/60" : "border-amber-200 text-slate-600",
                )}
              >
                {data.birth_date_str && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-2.5 text-amber-500" />
                    {data.birth_date_str}
                  </span>
                )}
                {data.birth_time_str && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-2.5 text-amber-500" />
                    {data.birth_time_str}
                  </span>
                )}
                {data.birth_place_str && (
                  <span
                    className="flex items-center gap-1 truncate max-w-[170px]"
                    title={data.birth_place_str}
                  >
                    <MapPin className="size-2.5 shrink-0 text-amber-500" />
                    <span className="truncate">{data.birth_place_str}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Planetary Placements (Graha Sthiti) */}
            {data.planets && data.planets.length > 0 && (
              <GrahaGrid planets={data.planets} isDark={isDark} />
            )}

            {/* Vimshottari Dasha */}
            <div className="space-y-2">
              {data.mahadasha && (
                <DashaRow
                  label="চলতি মহাদশা (CURRENT MAHADASHA)"
                  period={data.mahadasha}
                  isDark={isDark}
                />
              )}
              {data.antardasha && (
                <DashaRow
                  label="চলতি অন্তর্দশা (CURRENT ANTARDASHA)"
                  period={data.antardasha}
                  isDark={isDark}
                />
              )}
            </div>

            {/* Sade Sati Analysis */}
            {data.sade_sati && (
              <div
                className={cn(
                  "rounded-xl border p-2.5",
                  isDark
                    ? SADE_SATI_TONE_DARK[data.sade_sati.impact_level]
                    : SADE_SATI_TONE_LIGHT[data.sade_sati.impact_level],
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-wider opacity-70">
                    শনি গোচর (SATURN TRANSIT)
                  </p>
                  <span className="rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-bold capitalize">
                    {data.sade_sati.impact_level} প্রভাব
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] font-bold leading-snug">
                  {data.sade_sati.phase_title}
                </p>
                <p className="mt-0.5 text-[10px] opacity-75">
                  শনি {data.sade_sati.saturn_sign}-এ · চন্দ্র থেকে {data.sade_sati.saturn_house_from_moon}ম ভাবে অবস্থান
                </p>
                <p className="mt-1 text-[10px] leading-snug opacity-90">
                  {data.sade_sati.description}
                </p>
                {data.sade_sati.remedy_summary && (
                  <p className="mt-1.5 border-t border-current/20 pt-1 text-[10px] font-medium">
                    💡 {data.sade_sati.remedy_summary}
                  </p>
                )}
              </div>
            )}

            {/* Remedy Focus */}
            {data.remedy_focus && (
              <div
                className={cn(
                  "space-y-1.5 rounded-xl border p-2.5",
                  isDark
                    ? "border-amber-500/25 bg-amber-950/20 text-white"
                    : "border-amber-200 bg-amber-50/50 text-amber-950 shadow-xs",
                )}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      "text-[10px] font-bold tracking-wider",
                      isDark ? "text-amber-300" : "text-amber-800",
                    )}
                  >
                    REMEDY FOCUS (প্রধান প্রতিকার)
                  </p>
                  <span className="text-xs font-bold text-amber-500">
                    {data.remedy_focus.planet_label}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-[10px] leading-snug",
                    isDark ? "text-white/80" : "text-slate-700",
                  )}
                >
                  {data.remedy_focus.reason}
                </p>

                {data.remedy_focus.gemstone && (
                  <div
                    className={cn(
                      "flex items-start gap-1.5 rounded-lg p-1.5 text-[10px]",
                      isDark ? "bg-black/30" : "bg-white border border-amber-200/70",
                    )}
                  >
                    <Gem className="size-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <span className="font-semibold text-amber-600">রত্ন (Gemstone):&nbsp;</span>
                      <span className={cn(isDark ? "text-white/90" : "text-slate-800")}>
                        {data.remedy_focus.gemstone}
                        {data.remedy_focus.gemstone_metal
                          ? ` (${data.remedy_focus.gemstone_metal} ধাতু · ${data.remedy_focus.gemstone_finger} আঙুল · ${data.remedy_focus.gemstone_day})`
                          : ""}
                      </span>
                    </div>
                  </div>
                )}

                {data.remedy_focus.beej_mantra && (
                  <div
                    className={cn(
                      "flex items-start gap-1.5 rounded-lg p-1.5 text-[10px]",
                      isDark ? "bg-amber-950/40" : "bg-amber-100/50 border border-amber-200",
                    )}
                  >
                    <Flame className="size-3.5 shrink-0 text-amber-500 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-600">বীজ মন্ত্র:&nbsp;</span>
                      <span className="font-medium">{data.remedy_focus.beej_mantra}</span>
                    </div>
                  </div>
                )}

                {data.remedy_focus.remedies && data.remedy_focus.remedies.length > 0 && (
                  <ul
                    className={cn(
                      "space-y-1 pt-1 text-[10px]",
                      isDark ? "text-white/80" : "text-slate-700",
                    )}
                  >
                    {data.remedy_focus.remedies.slice(0, 3).map((line) => (
                      <li key={line} className="flex items-start gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Bottom In-Chamber Birth Edit CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold transition-all border shadow-xs cursor-pointer",
                  isDark
                    ? "border-amber-500/30 bg-white/5 text-amber-300 hover:bg-white/10"
                    : "border-amber-300 bg-white text-amber-900 hover:bg-amber-50",
                )}
              >
                <Edit3 className="size-3.5 text-amber-500" />
                <span>সঠিক জন্ম বিবরণ সম্পাদনা (Edit Birth Time / Details)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
