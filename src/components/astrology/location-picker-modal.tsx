"use client";

import * as React from "react";
import { Search, MapPin, Check, Loader2, Navigation } from "lucide-react";
import { Modal, Button } from "@/components/ui";
import { astrologyApi } from "@/lib/api";
import type { GeoSearchResult } from "@/types";

interface LocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (location: {
    place: string;
    latitude: number;
    longitude: number;
    timezone: number;
  }) => void;
  currentPlace?: string;
  currentLat?: number | null;
  currentLon?: number | null;
}

export function LocationPickerModal({
  open,
  onClose,
  onSelect,
  currentPlace = "",
  currentLat,
  currentLon,
}: LocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = React.useState(currentPlace);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<GeoSearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = React.useState<{
    place: string;
    latitude: number;
    longitude: number;
    timezone: number;
  } | null>(
    currentLat && currentLon
      ? {
          place: currentPlace || "Selected Location",
          latitude: currentLat,
          longitude: currentLon,
          timezone: 5.5,
        }
      : null,
  );

  // Debounced search for places
  React.useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await astrologyApi.geoSearch(searchQuery.trim());
        setResults(res || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleApply = () => {
    if (selectedLocation) {
      onSelect(selectedLocation);
      onClose();
    }
  };

  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const tz = -new Date().getTimezoneOffset() / 60;
          setSelectedLocation({
            place: `Current Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
            latitude: lat,
            longitude: lon,
            timezone: tz,
          });
          setLoading(false);
        },
        () => {
          setLoading(false);
        },
      );
    }
  };

  // Convert decimal to deg/min/dir for preview
  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? "N" : "S") : val >= 0 ? "E" : "W";
    const absVal = Math.abs(val);
    const deg = Math.floor(absVal);
    const min = Math.round((absVal - deg) * 60);
    return `${deg}° ${min}' ${dir}`;
  };

  return (
    <Modal open={open} onClose={onClose} title="Select Birth Place" size="md">
      <div className="space-y-4 pt-1">
        <p className="text-xs text-muted-foreground">
          Search your city or place of birth to accurately compute exact astronomical latitude, longitude, and timezone offset.
        </p>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, town, district, or country (e.g. Kolkata, Mumbai, London)..."
            className="w-full rounded-xl border border-border bg-card pl-9 pr-9 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/70 focus:outline-hidden focus:ring-1 focus:ring-brand-500 shadow-2xs"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-brand-600 animate-spin" />
          )}
        </div>

        {/* Current Location button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <Navigation className="size-3.5" />
            <span>Use My Current GPS Location</span>
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected =
                selectedLocation?.latitude === item.latitude &&
                selectedLocation?.longitude === item.longitude;
              return (
                <button
                  key={`${item.latitude}-${item.longitude}-${idx}`}
                  type="button"
                  onClick={() =>
                    setSelectedLocation({
                      place: item.city || item.display_name.split(",")[0] || item.display_name,
                      latitude: item.latitude,
                      longitude: item.longitude,
                      timezone: item.timezone,
                    })
                  }
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${
                    isSelected
                      ? "border-brand-500 bg-brand-500/10 text-foreground ring-1 ring-brand-500/30"
                      : "border-border/70 bg-card hover:bg-surface-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MapPin className="size-4 shrink-0 text-brand-600 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground truncate">{item.display_name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Lat: {formatCoord(item.latitude, true)} · Lon: {formatCoord(item.longitude, false)} · UTC{item.timezone >= 0 ? "+" : ""}{item.timezone}h
                    </p>
                  </div>
                  {isSelected && <Check className="size-4 text-brand-600 shrink-0 mt-0.5" />}
                </button>
              );
            })
          ) : searchQuery.trim().length >= 2 && !loading ? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              No matching locations found. Try typing city and country name.
            </div>
          ) : (
            <div className="rounded-xl border border-border/60 bg-surface-muted/30 p-4 text-center text-xs text-muted-foreground">
              Type at least 2 characters above to search across worldwide cities.
            </div>
          )}
        </div>

        {/* Selected Coordinates Preview Card */}
        {selectedLocation && (
          <div className="rounded-xl border border-brand-500/20 bg-brand-500/[0.04] p-3.5 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-brand-600" />
                <span>Selected: {selectedLocation.place}</span>
              </span>
              <span className="rounded-md bg-brand-500/15 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:text-brand-300">
                UTC{selectedLocation.timezone >= 0 ? "+" : ""}{selectedLocation.timezone}h
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
              <span>Latitude: <strong className="text-foreground">{formatCoord(selectedLocation.latitude, true)}</strong></span>
              <span>Longitude: <strong className="text-foreground">{formatCoord(selectedLocation.longitude, false)}</strong></span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" disabled={!selectedLocation} onClick={handleApply}>
            Apply Location
          </Button>
        </div>
      </div>
    </Modal>
  );
}
