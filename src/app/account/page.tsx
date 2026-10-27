"use client";

import { Camera, Check, Globe, Languages, Sparkles, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useLanguage, AVAILABLE_LANGUAGES, type LanguageOption } from "@/providers/language-provider";

import {
  Alert,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  Input,
  LoadingBlock,
  Select,
  Switch,
} from "@/components/ui";
import { useProfile, useUpdateProfile, PROFILE_KEY } from "@/hooks/use-profile";
import { userApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { GENDER_LABELS, MARITAL_LABELS, type Gender, type MaritalStatus } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();
  const queryClient = useQueryClient();
  const update = useUpdateProfile({ successMessage: "Profile updated." });
  const { language, setLanguage } = useLanguage();
  const [form, setForm] = React.useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    phone: "",
    gender: "undisclosed" as Gender,
    marital_status: "undisclosed" as MaritalStatus,
    occupation: "",
    language: "bn",
  });
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Fill the form once the profile arrives, and again if it is refetched.
  React.useEffect(() => {
    if (!profile) return;
    setForm({
      first_name: profile.first_name,
      middle_name: profile.middle_name ?? "",
      last_name: profile.last_name ?? "",
      phone: profile.phone ?? "",
      gender: profile.gender,
      marital_status: profile.marital_status,
      occupation: profile.occupation ?? "",
      language: profile.language || language || "bn",
    });
  }, [profile, language]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    update.mutate({
      first_name: form.first_name,
      // An empty box means "remove this", which the API spells as null.
      middle_name: form.middle_name.trim() || null,
      last_name: form.last_name.trim() || null,
      phone: form.phone.trim() || null,
      gender: form.gender,
      marital_status: form.marital_status,
      occupation: form.occupation.trim() || null,
      language: form.language,
    });
    if (form.language !== language && (form.language === "bn" || form.language === "en" || form.language === "hi")) {
      void setLanguage(form.language as any, { silent: true });
    }
  }

  async function onPickAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const updated = await userApi.uploadAvatar(file);
      queryClient.setQueryData(PROFILE_KEY, updated);
      toast.success("Profile picture updated.");
    } catch (caught) {
      toast.error((caught as ApiError).message);
    } finally {
      setUploading(false);
      // Reset, so picking the same file again still fires a change event.
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removeAvatar() {
    setUploading(true);
    try {
      const updated = await userApi.removeAvatar();
      queryClient.setQueryData(PROFILE_KEY, updated);
      toast.success("Profile picture removed.");
    } catch (caught) {
      toast.error((caught as ApiError).message);
    } finally {
      setUploading(false);
    }
  }

  if (isLoading) return <LoadingBlock label="Loading your profile…" />;
  if (error) return <Alert tone="error">{(error as ApiError).message}</Alert>;
  if (!profile) return null;

  const fieldErrors = (update.error as ApiError | null)?.fieldErrors ?? {};

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How you appear across DivinLink.
        </p>
      </header>

      {/* ------------------------------------------------------- picture */}
      <Card>
        <CardBody className="flex items-start gap-3.5 sm:gap-5">
          <div className="relative shrink-0">
            <Avatar src={profile.avatar_url} name={profile.full_name} size="lg" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-base sm:text-lg truncate">{profile.full_name}</p>
            <p className="truncate text-xs sm:text-sm text-muted-foreground mt-0.5">{profile.email}</p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickAvatar}
              />
              <Button
                variant="secondary"
                size="sm"
                loading={uploading}
                onClick={() => fileRef.current?.click()}
                className="h-8 sm:h-9 px-3 text-xs sm:text-sm"
              >
                <Camera className="size-3.5" />
                {profile.avatar_url ? "Change picture" : "Upload picture"}
              </Button>

              {profile.avatar_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={uploading}
                  onClick={removeAvatar}
                  className="text-danger hover:bg-danger/15 h-8 sm:h-9 px-2.5 text-xs sm:text-sm"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* --------------------------------------------------------- details */}
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Your details</CardTitle>
          </CardHeader>

          <CardBody className="grid grid-cols-1 gap-4 pt-0 sm:grid-cols-2">
            <Field label="First name" htmlFor="first_name" required error={fieldErrors.first_name}>
              <Input
                id="first_name"
                required
                value={form.first_name}
                invalid={Boolean(fieldErrors.first_name)}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </Field>

            <Field label="Middle name" htmlFor="middle_name" error={fieldErrors.middle_name}>
              <Input
                id="middle_name"
                value={form.middle_name}
                onChange={(e) => setForm({ ...form, middle_name: e.target.value })}
              />
            </Field>

            <Field label="Last name" htmlFor="last_name" error={fieldErrors.last_name}>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </Field>

            <Field
              label="Phone"
              htmlFor="phone"
              error={fieldErrors.phone}
              hint={
                profile.phone && !profile.is_phone_verified
                  ? "Not verified yet"
                  : "Digits only — we strip the rest"
              }
            >
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                invalid={Boolean(fieldErrors.phone)}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="98300 12345"
              />
            </Field>

            <Field label="Gender" htmlFor="gender">
              <Select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}
              >
                {Object.entries(GENDER_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Marital status" htmlFor="marital_status">
              <Select
                id="marital_status"
                value={form.marital_status}
                onChange={(e) =>
                  setForm({ ...form, marital_status: e.target.value as MaritalStatus })
                }
              >
                {Object.entries(MARITAL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Occupation"
              htmlFor="occupation"
              className="sm:col-span-2"
              error={fieldErrors.occupation}
            >
              <Input
                id="occupation"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                placeholder="Software engineer"
              />
            </Field>

            <Field label="Preferred Language" htmlFor="language" className="sm:col-span-2" hint="Central language for Kundli, Numerology, Vastu, Palm, AI readings & horoscopes.">
              <Select
                id="language"
                value={form.language}
                onChange={(e) => {
                  const val = e.target.value as "bn" | "en" | "hi";
                  setForm({ ...form, language: val });
                  void setLanguage(val);
                }}
              >
                {AVAILABLE_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flagSymbol} {l.nameNative} ({l.nameEn})
                  </option>
                ))}
              </Select>
            </Field>

            <div className="sm:col-span-2">
              <Field label="Email" hint="Your sign-in address — it cannot be changed here.">
                <Input value={profile.email} disabled readOnly />
              </Field>
            </div>
          </CardBody>

          <CardFooter className="justify-end">
            <Button type="submit" loading={update.isPending} className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm">
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* --------------------------------------------------- language preference */}
      <LanguagePreferenceCard />

      {/* --------------------------------------------------- notifications */}
      <NotificationCard />
    </div>
  );
}

function NotificationCard() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile({ successMessage: "Notification preferences saved." });

  if (!profile) return null;
  const prefs = profile.notifications;

  const toggle = (key: keyof typeof prefs) => (next: boolean) =>
    update.mutate({ notifications: { ...prefs, [key]: next } });

  const ROWS: { key: keyof typeof prefs; label: string; description: string }[] = [
    { key: "push", label: "Push", description: "Alerts on your phone" },
    { key: "email", label: "Email", description: "Receipts and account notices" },
    { key: "sms", label: "SMS", description: "Text messages" },
    { key: "whatsapp", label: "WhatsApp", description: "Messages on WhatsApp" },
    {
      key: "daily_horoscope",
      label: "Daily horoscope",
      description: "Your reading, every morning",
    },
    {
      key: "remedy_reminders",
      label: "Remedy reminders",
      description: "Nudges for mantras and fasting days",
    },
    { key: "marketing", label: "Offers", description: "Discounts and campaigns" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardBody className="divide-y divide-border/60 pt-0">
        {ROWS.map((row) => (
          <div key={row.key} className="py-3 first:pt-0 last:pb-0">
            <Switch
              checked={prefs[row.key]}
              onChange={toggle(row.key)}
              disabled={update.isPending}
              label={row.label}
              description={row.description}
            />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

function LanguagePreferenceCard() {
  const { language, setLanguage } = useLanguage();

  return (
    <Card className="border-primary/20 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Languages className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                Preferred Language
                <span className="text-xs font-normal text-muted-foreground hidden sm:inline">
                  (পছন্দের ভাষা / पसंदीदा भाषा)
                </span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                All 12 astrology tools, readings, charts, and reports will automatically load in this language.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary tracking-wide">
              {AVAILABLE_LANGUAGES.find((l) => l.code === language)?.nameNative || language}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AVAILABLE_LANGUAGES.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => void setLanguage(item.code)}
                className={`relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/25 shadow-sm"
                    : "border-border/60 hover:border-primary/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label={item.nameEn}>
                      {item.flagSymbol}
                    </span>
                    <span className="font-semibold text-foreground text-sm">
                      {item.nameNative}
                    </span>
                  </div>
                  {isSelected ? (
                    <span className="size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="size-5 rounded-full border border-border/80 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  {item.nameEn} • {item.taglineNative}
                </p>
                <span className="mt-2 text-[11px] text-muted-foreground/85 line-clamp-1">
                  {item.taglineEn}
                </span>
              </button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
