"use client";

import { CheckCircle2, CircleDashed, Info } from "lucide-react";
import * as React from "react";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
  LoadingBlock,
  Switch,
} from "@/components/ui";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

/**
 * A small, curated list rather than the full IANA set: almost every user is in
 * one of these, and a wrong timezone silently produces a wrong chart.
 */
const TIMEZONES = [
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Kathmandu",
  "Asia/Dhaka",
  "Asia/Colombo",
  "Asia/Karachi",
  "Asia/Singapore",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Australia/Sydney",
];

export default function BirthDetailsPage() {
  const { data: profile, isLoading, error } = useProfile();
  const update = useUpdateProfile({ successMessage: "Birth details saved." });

  const [birth, setBirth] = React.useState({
    date_of_birth: "",
    time_of_birth: "",
    is_time_known: false,
    place: "",
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    timezone: "",
  });
  const [current, setCurrent] = React.useState({
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    timezone: "",
  });

  React.useEffect(() => {
    if (!profile) return;
    const b = profile.birth;
    setBirth({
      date_of_birth: b.date_of_birth ?? "",
      time_of_birth: b.time_of_birth ?? "",
      is_time_known: b.is_time_known,
      place: b.place ?? "",
      city: b.city ?? "",
      state: b.state ?? "",
      country: b.country ?? "",
      latitude: b.latitude?.toString() ?? "",
      longitude: b.longitude?.toString() ?? "",
      timezone: b.timezone ?? "",
    });
    const c = profile.current_location;
    setCurrent({
      city: c.city ?? "",
      state: c.state ?? "",
      country: c.country ?? "",
      latitude: c.latitude?.toString() ?? "",
      longitude: c.longitude?.toString() ?? "",
      timezone: c.timezone ?? "",
    });
  }, [profile]);

  const num = (value: string) => (value.trim() === "" ? null : Number(value));
  const text = (value: string) => (value.trim() === "" ? null : value.trim());

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    update.mutate({
      birth: {
        date_of_birth: text(birth.date_of_birth),
        time_of_birth: text(birth.time_of_birth),
        is_time_known: birth.is_time_known,
        place: text(birth.place),
        city: text(birth.city),
        state: text(birth.state),
        country: text(birth.country),
        latitude: num(birth.latitude),
        longitude: num(birth.longitude),
        timezone: text(birth.timezone),
      },
      current_location: {
        city: text(current.city),
        state: text(current.state),
        country: text(current.country),
        latitude: num(current.latitude),
        longitude: num(current.longitude),
        timezone: text(current.timezone),
      },
    });
  }

  if (isLoading) return <LoadingBlock label="Loading your details…" />;
  if (error) return <Alert tone="error">{(error as ApiError).message}</Alert>;
  if (!profile) return null;

  const fieldErrors = (update.error as ApiError | null)?.fieldErrors ?? {};
  const completeness = profile.completeness;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Birth details</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Entered once. Every kundli, panchang and numerology reading uses this.
        </p>
      </header>

      {completeness && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Kundli", ready: completeness.chart_ready, need: "date, time, place" },
            {
              label: "Panchang",
              ready: completeness.panchang_ready,
              need: "where you live now",
            },
            {
              label: "Numerology",
              ready: completeness.numerology_ready,
              need: "date of birth",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-3.5",
                item.ready
                  ? "border-success/30 bg-success-surface"
                  : "border-border bg-surface-muted",
              )}
            >
              {item.ready ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <CircleDashed className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {item.ready ? "Ready" : `Needs ${item.need}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------------------- birth */}
      <Card>
        <CardHeader>
          <CardTitle>When and where you were born</CardTitle>
          <CardDescription>
            The exact minute matters — the ascendant changes roughly every two hours.
          </CardDescription>
        </CardHeader>

        <CardBody className="grid gap-4 pt-0 sm:grid-cols-2">
          <Field
            label="Date of birth"
            htmlFor="dob"
            error={fieldErrors["birth.date_of_birth"]}
          >
            <Input
              id="dob"
              type="date"
              max={new Date().toISOString().slice(0, 10)}
              value={birth.date_of_birth}
              invalid={Boolean(fieldErrors["birth.date_of_birth"])}
              onChange={(e) => setBirth({ ...birth, date_of_birth: e.target.value })}
            />
          </Field>

          <Field
            label="Time of birth"
            htmlFor="tob"
            hint="24-hour, as written on the certificate"
            error={fieldErrors["birth.time_of_birth"]}
          >
            <Input
              id="tob"
              type="time"
              value={birth.time_of_birth}
              invalid={Boolean(fieldErrors["birth.time_of_birth"])}
              onChange={(e) => setBirth({ ...birth, time_of_birth: e.target.value })}
            />
          </Field>

          <div className="sm:col-span-2">
            <Switch
              checked={birth.is_time_known}
              onChange={(next) => setBirth({ ...birth, is_time_known: next })}
              label="I know my exact birth time"
              description="Without it we can still read your chart, but not the ascendant."
            />
          </div>

          <Field
            label="Birth place"
            htmlFor="place"
            className="sm:col-span-2"
            hint="As you would say it — e.g. Kolkata, West Bengal, India"
          >
            <Input
              id="place"
              value={birth.place}
              onChange={(e) => setBirth({ ...birth, place: e.target.value })}
            />
          </Field>

          <Field label="City" htmlFor="city">
            <Input
              id="city"
              value={birth.city}
              onChange={(e) => setBirth({ ...birth, city: e.target.value })}
            />
          </Field>

          <Field label="State" htmlFor="state">
            <Input
              id="state"
              value={birth.state}
              onChange={(e) => setBirth({ ...birth, state: e.target.value })}
            />
          </Field>

          <Field label="Country" htmlFor="country">
            <Input
              id="country"
              value={birth.country}
              onChange={(e) => setBirth({ ...birth, country: e.target.value })}
            />
          </Field>

          <Field
            label="Timezone"
            htmlFor="tz"
            error={fieldErrors["birth.timezone"]}
            hint="Where you were born, not where you are now"
          >
            <Input
              id="tz"
              list="timezones"
              value={birth.timezone}
              invalid={Boolean(fieldErrors["birth.timezone"])}
              onChange={(e) => setBirth({ ...birth, timezone: e.target.value })}
              placeholder="Asia/Kolkata"
            />
          </Field>

          <Field
            label="Latitude"
            htmlFor="lat"
            error={fieldErrors["birth.latitude"]}
            hint="-90 to 90"
          >
            <Input
              id="lat"
              type="number"
              step="any"
              min={-90}
              max={90}
              value={birth.latitude}
              invalid={Boolean(fieldErrors["birth.latitude"])}
              onChange={(e) => setBirth({ ...birth, latitude: e.target.value })}
              placeholder="22.5726"
            />
          </Field>

          <Field
            label="Longitude"
            htmlFor="lng"
            error={fieldErrors["birth.longitude"]}
            hint="-180 to 180"
          >
            <Input
              id="lng"
              type="number"
              step="any"
              min={-180}
              max={180}
              value={birth.longitude}
              invalid={Boolean(fieldErrors["birth.longitude"])}
              onChange={(e) => setBirth({ ...birth, longitude: e.target.value })}
              placeholder="88.3639"
            />
          </Field>

          <Alert tone="info" className="sm:col-span-2">
            <span className="flex items-start gap-1">
              <Info className="mt-0.5 hidden size-0" aria-hidden />
              Coordinates are typed in for now. Searching for a city and filling them in
              automatically comes with the chart engine.
            </span>
          </Alert>
        </CardBody>
      </Card>

      {/* ----------------------------------------------- where you are now */}
      <Card>
        <CardHeader>
          <CardTitle>Where you live now</CardTitle>
          <CardDescription>
            Sunrise, rahukaal and choghadiya are local — they follow you, not your
            birthplace.
          </CardDescription>
        </CardHeader>

        <CardBody className="grid gap-4 pt-0 sm:grid-cols-2">
          <Field label="City" htmlFor="ccity">
            <Input
              id="ccity"
              value={current.city}
              onChange={(e) => setCurrent({ ...current, city: e.target.value })}
            />
          </Field>

          <Field label="State" htmlFor="cstate">
            <Input
              id="cstate"
              value={current.state}
              onChange={(e) => setCurrent({ ...current, state: e.target.value })}
            />
          </Field>

          <Field label="Country" htmlFor="ccountry">
            <Input
              id="ccountry"
              value={current.country}
              onChange={(e) => setCurrent({ ...current, country: e.target.value })}
            />
          </Field>

          <Field
            label="Timezone"
            htmlFor="ctz"
            error={fieldErrors["current_location.timezone"]}
          >
            <Input
              id="ctz"
              list="timezones"
              value={current.timezone}
              invalid={Boolean(fieldErrors["current_location.timezone"])}
              onChange={(e) => setCurrent({ ...current, timezone: e.target.value })}
              placeholder="Asia/Kolkata"
            />
          </Field>

          <Field label="Latitude" htmlFor="clat" error={fieldErrors["current_location.latitude"]}>
            <Input
              id="clat"
              type="number"
              step="any"
              min={-90}
              max={90}
              value={current.latitude}
              onChange={(e) => setCurrent({ ...current, latitude: e.target.value })}
            />
          </Field>

          <Field
            label="Longitude"
            htmlFor="clng"
            error={fieldErrors["current_location.longitude"]}
          >
            <Input
              id="clng"
              type="number"
              step="any"
              min={-180}
              max={180}
              value={current.longitude}
              onChange={(e) => setCurrent({ ...current, longitude: e.target.value })}
            />
          </Field>
        </CardBody>

        <CardFooter className="justify-end">
          <Button type="submit" loading={update.isPending} className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm">
            Save details
          </Button>
        </CardFooter>
      </Card>

      <datalist id="timezones">
        {TIMEZONES.map((zone) => (
          <option key={zone} value={zone} />
        ))}
      </datalist>
    </form>
  );
}
