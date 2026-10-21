"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Compass,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Star,
  Globe,
  ArrowRight,
  User,
  HeartHandshake,
  HelpCircle,
  Gem,
  Palette,
  Eye,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button, LoadingBlock } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import { LocationPickerModal } from "@/components/astrology/location-picker-modal";
import { MoonSignWheel } from "@/components/astrology/moon-sign-wheel";
import { KundaliChart } from "@/components/astrology/kundali-chart";
import type {
  AyanamsaType,
  ChartStyleType,
  HouseSystemType,
  RashiCalculatePayload,
  RashiCalculateResult,
} from "@/types";

export default function RashiCalculatorPage() {
  // Form State
  const [name, setName] = React.useState("Samiran");
  const [gender, setGender] = React.useState<"male" | "female" | "other">("male");

  // Birth Day (DD-MM-YYYY)
  const [day, setDay] = React.useState("30");
  const [month, setMonth] = React.useState("06");
  const [year, setYear] = React.useState("2004");

  // Time (HH:mm:ss AM/PM)
  const [hour, setHour] = React.useState("06");
  const [minute, setMinute] = React.useState("48");
  const [second, setSecond] = React.useState("20");
  const [period, setPeriod] = React.useState<"AM" | "PM">("PM");

  // Place
  const [place, setPlace] = React.useState("Kolkata, West Bengal, India");
  const [isMapModalOpen, setIsMapModalOpen] = React.useState(false);

  // Advance Settings (Optional)
  const [showAdvance, setShowAdvance] = React.useState(false);
  const [lonDeg, setLonDeg] = React.useState("87");
  const [lonMin, setLonMin] = React.useState("51");
  const [lonDir, setLonDir] = React.useState<"E" | "W">("E");

  const [latDeg, setLatDeg] = React.useState("22");
  const [latMin, setLatMin] = React.useState("26");
  const [latDir, setLatDir] = React.useState<"N" | "S">("N");

  const [timezone, setTimezone] = React.useState("5.5");
  const [ayanamsa, setAyanamsa] = React.useState<AyanamsaType>("lahiri");
  const [houseSystem, setHouseSystem] = React.useState<HouseSystemType>("placidus");
  const [chartStyle, setChartStyle] = React.useState<ChartStyleType>("north_indian");

  // Calculation State
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<RashiCalculateResult | null>(null);

  const resultsRef = React.useRef<HTMLDivElement>(null);

  // Auto-fill coordinates helper from location picker
  const handleLocationSelect = (loc: {
    place: string;
    latitude: number;
    longitude: number;
    timezone: number;
  }) => {
    setPlace(loc.place);
    setTimezone(String(loc.timezone));

    // Latitude
    const absLat = Math.abs(loc.latitude);
    const dLat = Math.floor(absLat);
    const mLat = Math.round((absLat - dLat) * 60);
    setLatDeg(String(dLat));
    setLatMin(String(mLat));
    setLatDir(loc.latitude >= 0 ? "N" : "S");

    // Longitude
    const absLon = Math.abs(loc.longitude);
    const dLon = Math.floor(absLon);
    const mLon = Math.round((absLon - dLon) * 60);
    setLonDeg(String(dLon));
    setLonMin(String(mLon));
    setLonDir(loc.longitude >= 0 ? "E" : "W");

    toast.success("Coordinates updated from map", {
      description: `${loc.place} (Lat: ${dLat}°${mLat}'${loc.latitude >= 0 ? "N" : "S"}, Lon: ${dLon}°${mLon}'${loc.longitude >= 0 ? "E" : "W"})`,
    });
  };

  // Convert DMS to decimal
  const getDecimalCoords = () => {
    const lat = (Number(latDeg) || 0) + (Number(latMin) || 0) / 60;
    const finalLat = latDir === "S" ? -lat : lat;

    const lon = (Number(lonDeg) || 0) + (Number(lonMin) || 0) / 60;
    const finalLon = lonDir === "W" ? -lon : lon;

    return { lat: finalLat, lon: finalLon };
  };

  const handleCalculate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Validation
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const h = parseInt(hour, 10);
    const min = parseInt(minute, 10);
    const sec = parseInt(second, 10) || 0;

    if (isNaN(d) || d < 1 || d > 31 || isNaN(m) || m < 1 || m > 12 || isNaN(y) || y < 1900) {
      toast.error("Please enter a valid birth date (DD-MM-YYYY)");
      return;
    }
    if (isNaN(h) || h < 1 || h > 12 || isNaN(min) || min < 0 || min > 59) {
      toast.error("Please enter a valid birth time (HH:mm:ss)");
      return;
    }

    const { lat, lon } = getDecimalCoords();

    const payload: RashiCalculatePayload = {
      name: name.trim() || "Seeker",
      gender,
      day: d,
      month: m,
      year: y,
      hour: h,
      minute: min,
      second: sec,
      period,
      place: place.trim() || "Kolkata, India",
      latitude: lat,
      longitude: lon,
      timezone: parseFloat(timezone) || 5.5,
      ayanamsa,
      house_system: houseSystem,
      chart_style: chartStyle,
    };

    setLoading(true);
    try {
      const res = await astrologyApi.calculateRashi(payload);
      if (res) {
        setResult(res);
        toast.success(`Calculated Moon Sign: ${res.rashi_name_en} (${res.rashi_name_hi})`);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to calculate Rashi. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-surface-muted/30 pb-20">
        {/* =========================================================================
            HEADER & BREADCRUMBS (Matching screenshot 1)
        ========================================================================= */}
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Find Your Rashi by Date of Birth - Accurate Rashi Calculator & Rashi Finder Free
          </h1>

          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <span className="text-amber-500 font-bold">—</span>
            <span className="text-foreground font-semibold">Find Your Rashi</span>
          </div>
        </div>

        {/* =========================================================================
            FORM SECTION (Matching screenshot 1 & 2)
        ========================================================================= */}
        <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
          <div className="rounded-[28px] border border-border/80 bg-card p-6 sm:p-9 shadow-[0_12px_40px_-15px_rgba(26,18,8,0.08)] backdrop-blur-md">
            <h2 className="text-center font-display text-xl sm:text-2xl font-bold text-foreground mb-8">
              Enter Your Details
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5 text-xs sm:text-sm">
              {/* 1. Name */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <User className="size-4 text-amber-500" />
                  <span>Name</span>
                </label>
                <div className="sm:col-span-9">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 2. Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <HeartHandshake className="size-4 text-indigo-400" />
                  <span>Gender</span>
                </label>
                <div className="sm:col-span-9">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* 3. Birth Day (DD-MM-YYYY in 3 separate inputs) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <Calendar className="size-4 text-amber-500" />
                  <span>
                    Birth Day<span className="text-[11px] font-normal text-rose-500 ml-1">(DD-MM-YYYY)</span>
                  </span>
                </label>
                <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="DD"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="MM"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                  <input
                    type="number"
                    min="1900"
                    max="2035"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="YYYY"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* 4. Time (HH:mm:ss in 3 inputs + AM/PM dropdown) */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <Clock className="size-4 text-amber-500" />
                  <span>
                    Time<span className="text-[11px] font-normal text-rose-500 ml-1">(HH:mm:ss)</span>
                  </span>
                </label>
                <div className="sm:col-span-9 grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="HH"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2.5 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    placeholder="mm"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2.5 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={second}
                    onChange={(e) => setSecond(e.target.value)}
                    placeholder="ss"
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2.5 py-2.5 text-center text-xs sm:text-sm font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2.5 text-center text-xs sm:text-sm font-bold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs cursor-pointer"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* 5. Birth Place & Map trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                  <MapPin className="size-4 text-amber-500" />
                  <span>Birth Place</span>
                </label>
                <div className="sm:col-span-9 flex items-center gap-2">
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder="Enter your Birth Place..."
                    className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2.5 text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(true)}
                    className="shrink-0 rounded-xl border border-brand-500/40 bg-brand-500/10 px-3 py-2.5 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-500/20 transition-all flex items-center gap-1.5 shadow-2xs"
                    title="Select on interactive map"
                  >
                    <Globe className="size-3.5" />
                    <span className="hidden sm:inline">Pick on Map</span>
                  </button>
                </div>
              </div>

              {/* Toggle Advance Setting */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvance(!showAdvance)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  {showAdvance ? (
                    <>
                      <ChevronUp className="size-3.5" />
                      <span>[-] Advance Setting</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="size-3.5" />
                      <span>[+] Advance Setting</span>
                    </>
                  )}
                </button>
              </div>

              {/* =====================================================================
                  ADVANCE SETTINGS SECTION (Matching screenshot 2 & 5)
              ===================================================================== */}
              {showAdvance && (
                <div className="mt-4 pt-4 border-t border-border/80 space-y-4 animate-in fade-in-50 duration-200">
                  <h3 className="text-center font-display text-base font-bold text-foreground mb-4">
                    Advanced Settings
                  </h3>

                  {/* Longitude */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Compass className="size-4 text-sky-500" />
                      <span>Longitude</span>
                    </label>
                    <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={lonDeg}
                        onChange={(e) => setLonDeg(e.target.value)}
                        placeholder="Deg (87)"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                      <input
                        type="number"
                        value={lonMin}
                        onChange={(e) => setLonMin(e.target.value)}
                        placeholder="Min (51)"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                      <select
                        value={lonDir}
                        onChange={(e) => setLonDir(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-bold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="E">E</option>
                        <option value="W">W</option>
                      </select>
                    </div>
                  </div>

                  {/* Latitude */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Compass className="size-4 text-sky-500" />
                      <span>Latitude</span>
                    </label>
                    <div className="sm:col-span-9 grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={latDeg}
                        onChange={(e) => setLatDeg(e.target.value)}
                        placeholder="Deg (22)"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                      <input
                        type="number"
                        value={latMin}
                        onChange={(e) => setLatMin(e.target.value)}
                        placeholder="Min (26)"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3 py-2 text-center text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                      <select
                        value={latDir}
                        onChange={(e) => setLatDir(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-2 py-2 text-center text-xs font-bold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="N">N</option>
                        <option value="S">S</option>
                      </select>
                    </div>
                  </div>

                  {/* Time Zone */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Clock className="size-4 text-amber-500" />
                      <span>Time Zone</span>
                    </label>
                    <div className="sm:col-span-9">
                      <input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="5.5 (IST)"
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  {/* Ayanamsa (Exact 7 options from screenshot 5) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Sliders className="size-4 text-amber-500" />
                      <span>Ayanamsa</span>
                    </label>
                    <div className="sm:col-span-9">
                      <select
                        value={ayanamsa}
                        onChange={(e) => setAyanamsa(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="lahiri">Lahiri (Default - Chitra Paksha)</option>
                        <option value="bv_raman">BV Raman</option>
                        <option value="krishnamurti">Krishnamurti (KP)</option>
                        <option value="yukteshwar">Yukteshwar</option>
                        <option value="suryasiddhanta">Suryasiddhanta</option>
                        <option value="true_pushya">True Pushya (PVRN Rao)</option>
                        <option value="true_mula">True Mula (Chandra Hari)</option>
                      </select>
                    </div>
                  </div>

                  {/* House System */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Sliders className="size-4 text-amber-500" />
                      <span>House System</span>
                    </label>
                    <div className="sm:col-span-9">
                      <select
                        value={houseSystem}
                        onChange={(e) => setHouseSystem(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="placidus">Placidus (Standard in KP)</option>
                        <option value="equal">Equal House</option>
                        <option value="whole_sign">Whole Sign</option>
                        <option value="koch">Koch</option>
                      </select>
                    </div>
                  </div>

                  {/* Chart Style */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-3 flex items-center gap-2 font-bold text-foreground">
                      <Sliders className="size-4 text-indigo-400" />
                      <span>Chart Style</span>
                    </label>
                    <div className="sm:col-span-9">
                      <select
                        value={chartStyle}
                        onChange={(e) => setChartStyle(e.target.value as any)}
                        className="w-full rounded-xl border border-border bg-surface-muted/40 px-3.5 py-2 text-xs font-semibold text-foreground focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
                      >
                        <option value="north_indian">North Indian (Diamond)</option>
                        <option value="south_indian">South Indian (Square)</option>
                        <option value="east_indian">East Indian (Bengali)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit CTA (Matching button in screenshot 2) */}
              <div className="pt-4 flex justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-brand-500 to-amber-600 text-ink-950 font-black text-sm shadow-[0_8px_24px_rgba(234,179,8,0.35)] hover:shadow-[0_12px_32px_rgba(234,179,8,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin text-base">✦</span> Calculating Moon Sign…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span>Know Your Rashi</span>
                      <ArrowRight className="size-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* =========================================================================
            RESULTS DASHBOARD (When Calculated)
        ========================================================================= */}
        {result && (
          <div ref={resultsRef} className="mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8 space-y-8 animate-in fade-in-50 duration-300">
            {/* 1. Main Rashi Announcement Hero Card */}
            <div className="rounded-[32px] border border-amber-500/30 bg-gradient-to-br from-card via-brand-500/[0.04] to-card p-6 sm:p-10 shadow-[0_20px_50px_-20px_rgba(234,179,8,0.18)] text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/25 mb-4 shadow-2xs">
                <Sparkles className="size-3.5" />
                <span>Vedic Moon Sign Calculated for {result.name}</span>
              </div>

              {/* Big Sign Name & Glyphs */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-6xl sm:text-7xl font-extrabold select-none mb-2 text-amber-500 drop-shadow-md">
                  {result.rashi_symbol}
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-black text-foreground tracking-tight">
                  {result.rashi_name_en}{" "}
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-2xl sm:text-3xl">
                    ({result.rashi_name_hi} / {result.rashi_name_bn})
                  </span>
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl">
                  {result.traits.overview}
                </p>
              </div>

              {/* Badges strip */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
                <span className="rounded-xl bg-surface-muted px-3 py-1.5 text-foreground border border-border/80">
                  Ruling Lord: <strong className="text-amber-600 dark:text-amber-400">{result.rashi_lord}</strong>
                </span>
                <span className="rounded-xl bg-surface-muted px-3 py-1.5 text-foreground border border-border/80">
                  Moon Position: <strong className="tabular-nums">{result.moon_degree_formatted}</strong>
                </span>
                <span className="rounded-xl bg-surface-muted px-3 py-1.5 text-foreground border border-border/80">
                  Element: <strong>{result.traits.element}</strong>
                </span>
                <span className="rounded-xl bg-surface-muted px-3 py-1.5 text-foreground border border-border/80">
                  Modality: <strong>{result.traits.modality}</strong>
                </span>
                <span className="rounded-xl bg-surface-muted px-3 py-1.5 text-foreground border border-border/80">
                  Polarity: <strong>{result.traits.polarity}</strong>
                </span>
              </div>
            </div>

            {/* 2. Nakshatra & KP Sub-Lord Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Nakshatra & Pada
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-foreground">
                  {result.nakshatra_name}
                </p>
                <span className="inline-block mt-0.5 rounded-full bg-brand-500/10 px-2 py-0.2 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                  Pada {result.nakshatra_pada}
                </span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Star Lord (KP)
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-foreground">
                  {result.nakshatra_lord}
                </p>
                <span className="text-[10px] text-muted-foreground">Governs Result</span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  KP Sub-Lord
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-foreground">
                  {result.kp_sub_lord}
                </p>
                <span className="text-[10px] text-muted-foreground">Qualifies Outcome</span>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Ascendant (Lagna)
                </p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-foreground">
                  {result.ascendant_rashi_name_en}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {result.ascendant_degree_formatted}
                </span>
              </div>
            </div>

            {/* 3. CRITICAL SECTION REQUESTED BY USER:
                - What to Be Cautious About (কি কি থেকে সাবধান থাকতে হবে)
                - What is Beneficial & Auspicious (কি করলে ভালো হবে)
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Warnings & Cautions (সাবধানতা ও দুর্বলতা) */}
              <div className="rounded-[26px] border border-rose-500/25 bg-gradient-to-br from-rose-500/[0.04] via-card to-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-rose-500/15">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      কী কী থেকে সাবধান থাকবেন (Cautions & Pitfalls)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      আপনার রাশির স্বভাবজাত দুর্বলতা ও প্রতিকূল ক্ষেত্র
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-[13px] text-foreground/90">
                  {result.traits.cautions_and_pitfalls.map((caution, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span className="leading-relaxed">{caution}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Beneficial Actions & Remedies (করণীয় ও বৈদিক প্রতিকার) */}
              <div className="rounded-[26px] border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.04] via-card to-card p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-500/15">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      কী করলে আপনার ভালো হবে (Beneficial Remedies)
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      সৌভাগ্য বৃদ্ধি, মানসিক শান্তি ও সাফল্যের বৈদিক উপায়
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-[13px] text-foreground/90">
                  {result.traits.beneficial_actions_and_remedies.map((remedy, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="leading-relaxed">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Lucky Attributes & Strengths */}
            <div className="rounded-[26px] border border-border/80 bg-card p-6 sm:p-7 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Star className="size-4 text-amber-500 fill-amber-500" />
                  <span>Lucky Attributes & Key Strengths</span>
                </h3>
                <span className="text-xs text-muted-foreground">
                  Body Governance: <strong className="text-foreground">{result.traits.body_parts}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Gem className="size-3 text-amber-500" /> Lucky Gem
                  </p>
                  <p className="mt-1 font-bold text-foreground">{result.traits.lucky_gemstone}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <Palette className="size-3 text-brand-600" /> Lucky Colors
                  </p>
                  <p className="mt-1 font-bold text-foreground truncate">{result.traits.lucky_color}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Lucky Numbers</p>
                  <p className="mt-1 font-bold text-foreground">{result.traits.lucky_numbers.join(", ")}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Lucky Day</p>
                  <p className="mt-1 font-bold text-foreground">{result.traits.lucky_day}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Ruling Deity</p>
                  <p className="mt-1 font-bold text-foreground truncate">{result.traits.ruling_deity}</p>
                </div>

                <div className="rounded-xl bg-surface-muted/60 p-3 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">Compatible Signs</p>
                  <p className="mt-1 font-bold text-foreground truncate">{result.traits.compatible_rashis.join(", ")}</p>
                </div>
              </div>

              {/* Strengths Pills */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Personality Strengths
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {result.traits.strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="rounded-xl bg-brand-500/10 px-3 py-1 font-semibold text-brand-800 dark:text-brand-300 border border-brand-500/20"
                    >
                      ✦ {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Kundali Chart Visualization with Style Switcher */}
            <div className="rounded-[28px] border border-border/80 bg-card p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border/60">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <Eye className="size-4 text-amber-500" />
                    <span>Birth Kundali Chart Visualization</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ascendant (Lagna) and Moon placement calculated with {result.ayanamsa_name}
                  </p>
                </div>

                {/* Style selector pills */}
                <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-muted p-1 text-xs font-semibold">
                  {(["north_indian", "south_indian", "east_indian"] as ChartStyleType[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setChartStyle(style)}
                      className={`rounded-lg px-2.5 py-1 transition-all ${
                        chartStyle === style
                          ? "bg-brand-600 text-white shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {style === "north_indian"
                        ? "North Indian"
                        : style === "south_indian"
                        ? "South Indian"
                        : "East Indian"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Renderer */}
              <div className="py-2">
                <KundaliChart
                  planets={result.planets}
                  ascendantRashiIndex={result.ascendant_rashi_index}
                  chartStyle={chartStyle}
                />
              </div>

              {/* Re-calculate or Consult Callouts */}
              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    window.scrollTo({ top: 150, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Recalculate with different details</span>
                </button>

                <div className="flex items-center gap-2">
                  <Link href="/appointments">
                    <Button size="sm">
                      Consult an Astrologer for Detailed Kundali
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            EDUCATIONAL & SEO CONTENT (Matching screenshot 3, 4 & user image wheel)
        ========================================================================= */}
        <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6 lg:px-8 space-y-12">
          {/* Section 1: What is Rashi? & How It Works */}
          <div className="rounded-[30px] border border-border/80 bg-card p-6 sm:p-10 shadow-xs space-y-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                Rashi Calculator - Discover Your Moon Sign by Date of Birth
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Are you searching for &quot;What is my rashi?&quot; or want to know your authentic rashi name by date of birth?
                In Indian Vedic and KP astrology, your **Rashi** (Moon Sign or Chandra Rashi) refers to the exact zodiac sign
                in which the Moon was traversing at the precise moment and geographic coordinates of your birth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Moon Sign Wheel from user screenshot */}
              <div className="md:col-span-6 flex justify-center">
                <MoonSignWheel
                  activeRashiIndex={result?.rashi_index ?? null}
                  activeNakshatraIndex={result?.nakshatra_index ?? null}
                />
              </div>

              {/* Right Column: Explanatory text */}
              <div className="md:col-span-6 space-y-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1.5">
                    What is Rashi? (Moon Sign)
                  </h3>
                  <p>
                    In Indian astrology, there are 12 zodiac signs: Aries (Mesha), Taurus (Vrisha), Gemini (Mithuna),
                    Cancer (Karka), Leo (Simha), Virgo (Kanya), Libra (Tula), Scorpio (Vrischika), Sagittarius (Dhanu),
                    Capricorn (Makara), Aquarius (Kumbha), and Pisces (Meena). Unlike Western astrology which primarily focuses
                    on the Sun sign, Vedic astrology places paramount importance on the Moon Sign because the Moon governs your mind
                    (Manas), emotional subconscious, mental peace, and life fortunes.
                  </p>
                </div>

                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-1.5">
                    How the Rashi Calculator Works
                  </h3>
                  <p>
                    Our high-precision calculator determines the exact mathematical degree of the Moon using ephemeris data.
                    It computes the sidereal Nirayana zodiac by subtracting the correct Ayanamsa (such as Lahiri, KP Krishnamurti,
                    or BV Raman), taking into account exact local coordinates and timezone offsets.
                  </p>
                </div>

                <div className="rounded-2xl border border-brand-500/20 bg-brand-500/[0.04] p-4 text-foreground/90">
                  <p className="font-semibold text-xs text-brand-700 dark:text-brand-300 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="size-4 text-brand-600" />
                    <span>Astronomical Precision Guarantee</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Calculated directly using Swiss Ephemeris with sub-arcsecond accuracy, aligning with genuine Hindu panchangam
                    and KP astrological principles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: FAQ Accordion (Screenshot 4) */}
          <div className="rounded-[30px] border border-border/80 bg-card p-6 sm:p-10 shadow-xs space-y-6">
            <div className="text-center">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                FAQ — Frequently Asked Questions
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Common questions about finding your accurate Moon Sign and Nakshatra
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm">
              <details className="group rounded-2xl border border-border/80 bg-surface-muted/30 p-4 transition-all open:bg-surface-muted/60">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground list-none">
                  <span>What is the difference between Moon Sign (Rashi) and Sun Sign?</span>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Your Sun Sign represents your outer ego, conscious personality, and career drives based on which zodiac sign
                  the Sun was in (taking approximately 30 days per sign). Your Moon Sign (Rashi) represents your inner soul,
                  emotional nature, subconscious patterns, and mental health. Because the Moon changes signs every 2.25 days,
                  it is vastly more personalized and accurate for daily predictions and matchmaking in Vedic astrology.
                </p>
              </details>

              <details className="group rounded-2xl border border-border/80 bg-surface-muted/30 p-4 transition-all open:bg-surface-muted/60">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground list-none">
                  <span>Why is birth time so important for finding my Rashi?</span>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  The Moon travels roughly 13 degrees per day (more than half a degree every hour). If you were born on a day
                  when the Moon was transitioning between two signs (for instance, moving from Libra to Scorpio), even a few minutes
                  can shift your Moon Sign and Nakshatra Pada. Providing an exact time of birth ensures 100% astronomical accuracy.
                </p>
              </details>

              <details className="group rounded-2xl border border-border/80 bg-surface-muted/30 p-4 transition-all open:bg-surface-muted/60">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground list-none">
                  <span>What is Ayanamsa and which one should I choose?</span>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Ayanamsa is the angular difference between the Tropical (Sayana) and Sidereal (Nirayana) zodiac caused by the precession
                  of equinoxes. **Lahiri (Chitra Paksha)** is the official standard adopted by the Government of India and the majority of
                  Vedic astrologers. If you practice KP Astrology, choose **Krishnamurti (KP)**. If following Dr. B.V. Raman&apos;s system, select **BV Raman**.
                </p>
              </details>

              <details className="group rounded-2xl border border-border/80 bg-surface-muted/30 p-4 transition-all open:bg-surface-muted/60">
                <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground list-none">
                  <span>How does my Rashi affect my daily life and decisions?</span>
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  Your Rashi determines your innate mental temperament, how you react to stress, your emotional triggers,
                  compatibility in romantic relationships, and favorable timings for major life decisions (Gochar / transits of planets
                  like Saturn, Jupiter, and Rahu are always read from your Moon sign).
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Location Picker Modal */}
        <LocationPickerModal
          open={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onSelect={handleLocationSelect}
          currentPlace={place}
        />
      </main>

      <SiteFooter />
    </>
  );
}
