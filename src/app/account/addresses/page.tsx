"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Compass, MapPin, Navigation, Pencil, Plus, Star, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  ConfirmModal,
  EmptyState,
  Field,
  Input,
  LoadingBlock,
  Modal,
  Switch,
} from "@/components/ui";
import { astrologyApi, userApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { useProfile } from "@/hooks/use-profile";
import type { Address, AddressInput } from "@/types";

const ADDRESSES_KEY = ["addresses"] as const;

/**
 * The generated `Address` has an optional `id`, because the backend gives it a
 * default. An address that has been *stored* always has one, so the list is
 * narrowed once here rather than asserting at every call site.
 */
type StoredAddress = Address & { id: string };

const BLANK: AddressInput = {
  label: "",
  full_name: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  is_default: false,
};

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const { data: addresses, isLoading, error } = useQuery({
    queryKey: ADDRESSES_KEY,
    queryFn: async () => (await userApi.addresses()) as StoredAddress[],
  });

  const [editing, setEditing] = React.useState<StoredAddress | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState<StoredAddress | null>(null);
  const [initialPrefill, setInitialPrefill] = React.useState<Partial<AddressInput> | null>(null);
  const [locatingLive, setLocatingLive] = React.useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });

  const handleQuickLiveLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocatingLive(true);
    toast.loading("Detecting your current GPS location...", { id: "live-loc" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          toast.loading("Resolving your address details from GPS...", { id: "live-loc" });
          const res = await astrologyApi.geoReverse(latitude, longitude);
          toast.success("Live location fetched! Please review & save.", { id: "live-loc" });

          setInitialPrefill({
            label: "Current Location",
            line1: res.line1 || "",
            line2: res.line2 || "",
            landmark: res.landmark || "",
            city: res.city || "",
            state: res.state || "",
            postal_code: res.postal_code || "",
            country: res.country || "India",
          });
          setCreating(true);
        } catch (err) {
          toast.dismiss("live-loc");
          toast.error("Could not resolve address details. Opening manual address form.");
          setInitialPrefill(null);
          setCreating(true);
        } finally {
          setLocatingLive(false);
        }
      },
      (err) => {
        setLocatingLive(false);
        toast.dismiss("live-loc");
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please enter address manually.");
        } else if (err.code === err.TIMEOUT) {
          toast.error("Location request timed out. Please enter manually.");
        } else {
          toast.error("Could not retrieve your location. Please enter manually.");
        }
        setInitialPrefill(null);
        setCreating(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const remove = useMutation({
    mutationFn: (id: string) => userApi.deleteAddress(id),
    onSuccess: () => {
      invalidate();
      setDeleting(null);
      toast.success("Address deleted.");
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  const makeDefault = useMutation({
    mutationFn: (id: string) => userApi.updateAddress(id, { is_default: true }),
    onSuccess: () => {
      invalidate();
      toast.success("Default address updated.");
    },
    onError: (e: ApiError) => toast.error(e.message),
  });

  if (isLoading) return <LoadingBlock label="Loading addresses…" />;
  if (error) return <Alert tone="error">{(error as ApiError).message}</Alert>;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Save delivery addresses manually or detect via device live location.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Use Current Live Location Quick Button */}
          <Button
            variant="secondary"
            onClick={handleQuickLiveLocation}
            loading={locatingLive}
            className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm font-medium border-brand-400/60 bg-brand-50/50 hover:bg-brand-100/70 text-brand-950 dark:text-brand-300"
          >
            <Navigation className="size-4 text-brand-700" />
            Use Current Location
          </Button>

          {/* Add Manual Address Button */}
          <Button
            onClick={() => {
              setInitialPrefill(null);
              setCreating(true);
            }}
            className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm font-semibold"
          >
            <Plus className="size-4" />
            Add address
          </Button>
        </div>
      </header>

      {!addresses || addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses yet"
          description="Add an address manually or fetch your live location in 1 click."
          action={
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Button
                variant="secondary"
                onClick={handleQuickLiveLocation}
                loading={locatingLive}
                className="w-full sm:w-auto border-brand-400/60"
              >
                <Navigation className="size-4 text-brand-700" />
                Use Current Location
              </Button>
              <Button
                onClick={() => {
                  setInitialPrefill(null);
                  setCreating(true);
                }}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                Add manually
              </Button>
            </div>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardBody className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{address.full_name}</p>
                      {address.is_default && <Badge tone="brand">Default</Badge>}
                    </div>
                    {address.label && (
                      <p className="text-xs text-muted-foreground">{address.label}</p>
                    )}
                  </div>
                </div>

                <address className="text-sm leading-relaxed text-muted-foreground not-italic">
                  {address.line1}
                  {address.line2 && (
                    <>
                      <br />
                      {address.line2}
                    </>
                  )}
                  {address.landmark && (
                    <>
                      <br />
                      <span className="text-xs">Near {address.landmark}</span>
                    </>
                  )}
                  <br />
                  {address.city}, {address.state} {address.postal_code}
                  <br />
                  {address.country}
                  <br />
                  <span className="text-xs">{address.phone}</span>
                </address>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button variant="secondary" size="sm" onClick={() => setEditing(address)}>
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  {!address.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      loading={makeDefault.isPending}
                      onClick={() => makeDefault.mutate(address.id)}
                    >
                      <Star className="size-3.5" />
                      Make default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto text-danger hover:bg-danger/15"
                    onClick={() => setDeleting(address)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <AddressModal
        open={creating}
        prefill={initialPrefill}
        onClose={() => {
          setCreating(false);
          setInitialPrefill(null);
        }}
        onSaved={() => {
          invalidate();
          setCreating(false);
          setInitialPrefill(null);
        }}
      />

      <AddressModal
        key={editing?.id}
        open={Boolean(editing)}
        address={editing ?? undefined}
        onClose={() => setEditing(null)}
        onSaved={() => {
          invalidate();
          setEditing(null);
        }}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
        loading={remove.isPending}
        title="Delete this address?"
        description={`${deleting?.line1}, ${deleting?.city}. This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function AddressModal({
  open,
  address,
  prefill,
  onClose,
  onSaved,
}: {
  open: boolean;
  address?: StoredAddress;
  prefill?: Partial<AddressInput> | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { data: profile } = useProfile();
  const isEdit = Boolean(address);
  const [form, setForm] = React.useState<AddressInput>(BLANK);
  const [locatingModal, setLocatingModal] = React.useState(false);
  const [detectedLocationName, setDetectedLocationName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (address) {
      setForm({
        label: address.label ?? "",
        full_name: address.full_name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 ?? "",
        landmark: address.landmark ?? "",
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
        is_default: address.is_default,
      });
      setDetectedLocationName(null);
    } else if (prefill) {
      setForm({
        ...BLANK,
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        ...prefill,
      });
      if (prefill.city || prefill.line1) {
        setDetectedLocationName([prefill.line1, prefill.city, prefill.state].filter(Boolean).join(", "));
      }
    } else {
      setForm({
        ...BLANK,
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
      });
      setDetectedLocationName(null);
    }
  }, [address, prefill, open, profile]);

  const handleFetchModalLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setLocatingModal(true);
    toast.loading("Detecting your GPS location...", { id: "modal-loc" });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          toast.loading("Resolving your address details from GPS...", { id: "modal-loc" });
          const res = await astrologyApi.geoReverse(latitude, longitude);
          toast.success("Live location fetched! Fields auto-filled.", { id: "modal-loc" });

          setForm((prev) => ({
            ...prev,
            label: prev.label || "Current Location",
            line1: res.line1 || prev.line1,
            line2: res.line2 || prev.line2,
            landmark: res.landmark || prev.landmark,
            city: res.city || prev.city,
            state: res.state || prev.state,
            postal_code: res.postal_code || prev.postal_code,
            country: res.country || prev.country || "India",
          }));
          setDetectedLocationName(res.display_name || `${res.city}, ${res.state}`);
        } catch (err) {
          toast.dismiss("modal-loc");
          toast.error("Could not resolve address details. Please type manually.");
        } finally {
          setLocatingModal(false);
        }
      },
      (err) => {
        setLocatingModal(false);
        toast.dismiss("modal-loc");
        if (err.code === err.PERMISSION_DENIED) {
          toast.error("Location permission denied. Please enter address manually.");
        } else if (err.code === err.TIMEOUT) {
          toast.error("Location request timed out. Please enter manually.");
        } else {
          toast.error("Could not retrieve your location. Please enter manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const save = useMutation({
    mutationFn: (body: AddressInput) => {
      const payload = { ...body, label: body.label?.trim() || null };
      return isEdit
        ? userApi.updateAddress(address!.id, payload)
        : userApi.addAddress(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Address updated." : "Address added.");
      onSaved();
    },
    onError: (e: ApiError) => {
      if (e.status !== 422) toast.error(e.message);
    },
  });

  const errors = (save.error as ApiError | null)?.fieldErrors ?? {};
  const set = (key: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit address" : "Add an address"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={save.isPending}>
            Cancel
          </Button>
          <Button
            loading={save.isPending}
            onClick={() => save.mutate(form)}
            form="address-form"
            type="submit"
          >
            {isEdit ? "Save changes" : "Add address"}
          </Button>
        </>
      }
    >
      <form
        id="address-form"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
      >
        {/* Live GPS Location Action Card */}
        <div className="sm:col-span-2 p-3.5 rounded-xl border border-brand-400/50 bg-gradient-to-r from-brand-300/15 via-brand-200/25 to-brand-300/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="size-8 rounded-lg bg-brand-300/40 text-brand-900 dark:text-brand-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                <Navigation className="size-4 text-brand-800 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Fetch Device Live Location (লাইভ লোকেশন)
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Automatically fills address line, city, state and pincode from GPS
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleFetchModalLocation}
              loading={locatingModal}
              className="shrink-0 text-xs font-semibold border-brand-400/60 bg-surface hover:bg-brand-100/70"
            >
              <Compass className="size-3.5" />
              {locatingModal ? "Detecting GPS…" : "Detect Live Location"}
            </Button>
          </div>

          {detectedLocationName && (
            <div className="mt-2.5 pt-2 border-t border-brand-300/30 flex items-center gap-1.5 text-xs text-brand-900 dark:text-brand-300 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Auto-filled: {detectedLocationName}</span>
            </div>
          )}
        </div>

        <div className="sm:col-span-2 flex items-center gap-3 my-0.5">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Address Details (Manual / Editable)
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <Field label="Label" htmlFor="label" hint="Home, Office…">
          <Input id="label" value={form.label ?? ""} onChange={set("label")} />
        </Field>

        <Field label="Full name" htmlFor="full_name" required error={errors.full_name}>
          <Input
            id="full_name"
            required
            value={form.full_name}
            invalid={Boolean(errors.full_name)}
            onChange={set("full_name")}
          />
        </Field>

        <Field label="Phone" htmlFor="aphone" required error={errors.phone}>
          <Input
            id="aphone"
            required
            value={form.phone}
            invalid={Boolean(errors.phone)}
            onChange={set("phone")}
          />
        </Field>

        <Field label="Pincode" htmlFor="postal_code" required error={errors.postal_code}>
          <Input
            id="postal_code"
            required
            value={form.postal_code}
            invalid={Boolean(errors.postal_code)}
            onChange={set("postal_code")}
          />
        </Field>

        <Field
          label="Address line 1"
          htmlFor="line1"
          required
          className="sm:col-span-2"
          error={errors.line1}
        >
          <Input
            id="line1"
            required
            value={form.line1}
            invalid={Boolean(errors.line1)}
            onChange={set("line1")}
          />
        </Field>

        <Field label="Address line 2" htmlFor="line2" className="sm:col-span-2">
          <Input id="line2" value={form.line2 ?? ""} onChange={set("line2")} />
        </Field>

        <Field label="Landmark" htmlFor="landmark" className="sm:col-span-2">
          <Input id="landmark" value={form.landmark ?? ""} onChange={set("landmark")} />
        </Field>

        <Field label="City" htmlFor="acity" required error={errors.city}>
          <Input
            id="acity"
            required
            value={form.city}
            invalid={Boolean(errors.city)}
            onChange={set("city")}
          />
        </Field>

        <Field label="State" htmlFor="astate" required error={errors.state}>
          <Input
            id="astate"
            required
            value={form.state}
            invalid={Boolean(errors.state)}
            onChange={set("state")}
          />
        </Field>

        <Field label="Country" htmlFor="acountry" className="sm:col-span-2">
          <Input id="acountry" value={form.country ?? "India"} onChange={set("country")} />
        </Field>

        <div className="sm:col-span-2">
          <Switch
            checked={Boolean(form.is_default)}
            onChange={(next) => setForm({ ...form, is_default: next })}
            label="Make this my default address"
            description="Used automatically at checkout."
          />
        </div>
      </form>
    </Modal>
  );
}
