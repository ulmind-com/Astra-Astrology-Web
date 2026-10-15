"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import * as React from "react";

import { Badge, Button, Input, Select, Switch } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  COMMON_LANGUAGES,
  MODES,
  MODE_LABELS,
  SKILLS,
  SKILL_LABELS,
  type ConsultationMode,
  type Skill,
} from "@/types";

export type Filters = {
  search: string;
  skill: Skill | "";
  language: string;
  mode: ConsultationMode | "";
  online_only: boolean;
  featured_only: boolean;
  min_experience: string;
  max_rate: string;
};

export const EMPTY_FILTERS: Filters = {
  search: "",
  skill: "",
  language: "",
  mode: "",
  online_only: false,
  featured_only: false,
  min_experience: "",
  max_rate: "",
};

export function countActive(filters: Filters): number {
  return Object.entries(filters).filter(
    ([key, value]) => key !== "search" && value !== "" && value !== false,
  ).length;
}

export function DirectoryFilters({
  filters,
  onChange,
  total,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  total?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const active = countActive(filters);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => set("search", e.target.value)}
            placeholder="Search by name or speciality"
            className="pl-9"
            aria-label="Search astrologers"
          />
          {filters.search && (
            <button
              onClick={() => set("search", "")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          variant={open || active > 0 ? "primary" : "secondary"}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {active > 0 && (
            <span className="ml-0.5 rounded-full bg-white/25 px-1.5 text-xs">{active}</span>
          )}
        </Button>
      </div>

      {/* Quick toggles stay visible — they are the two people reach for most. */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => set("online_only", !filters.online_only)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            filters.online_only
              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "border-border text-muted-foreground hover:border-border-strong",
          )}
        >
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Online now
        </button>

        <button
          onClick={() => set("featured_only", !filters.featured_only)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            filters.featured_only
              ? "border-gold-300 bg-gold-50 text-gold-800 dark:border-gold-500/40 dark:bg-gold-500/10 dark:text-gold-300"
              : "border-border text-muted-foreground hover:border-border-strong",
          )}
        >
          ★ Featured
        </button>

        {typeof total === "number" && (
          <span className="ml-auto text-sm text-muted-foreground">
            {total} astrologer{total === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {open && (
        <div className="card-surface grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Speciality</span>
            <Select value={filters.skill} onChange={(e) => set("skill", e.target.value as Skill)}>
              <option value="">Any speciality</option>
              {SKILLS.map((skill) => (
                <option key={skill} value={skill}>
                  {SKILL_LABELS[skill]}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Language</span>
            <Select value={filters.language} onChange={(e) => set("language", e.target.value)}>
              <option value="">Any language</option>
              {COMMON_LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </Select>
          </label>

          <label className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Available for</span>
            <Select
              value={filters.mode}
              onChange={(e) => set("mode", e.target.value as ConsultationMode)}
            >
              <option value="">Any mode</option>
              {MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {MODE_LABELS[mode]}
                </option>
              ))}
            </Select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Min. years</span>
              <Input
                type="number"
                min={0}
                max={90}
                value={filters.min_experience}
                onChange={(e) => set("min_experience", e.target.value)}
                placeholder="0"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">Max ₹/min</span>
              <Input
                type="number"
                min={0}
                value={filters.max_rate}
                onChange={(e) => set("max_rate", e.target.value)}
                placeholder="Any"
              />
            </label>
          </div>

          {active > 0 && (
            <div className="sm:col-span-2 lg:col-span-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ ...EMPTY_FILTERS, search: filters.search })}
              >
                <X className="size-4" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** The chips under the search bar showing what is currently applied. */
export function ActiveFilterChips({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const chips: { key: keyof Filters; label: string }[] = [];
  if (filters.skill) chips.push({ key: "skill", label: SKILL_LABELS[filters.skill] });
  if (filters.language) chips.push({ key: "language", label: filters.language });
  if (filters.mode) chips.push({ key: "mode", label: MODE_LABELS[filters.mode] });
  if (filters.min_experience)
    chips.push({ key: "min_experience", label: `${filters.min_experience}+ yrs` });
  if (filters.max_rate) chips.push({ key: "max_rate", label: `≤ ₹${filters.max_rate}/min` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Badge key={chip.key} tone="brand" className="pr-1">
          {chip.label}
          <button
            onClick={() => onChange({ ...filters, [chip.key]: "" })}
            className="rounded-full p-0.5 hover:bg-black/10"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="size-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
