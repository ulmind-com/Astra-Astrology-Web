"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { userApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
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

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });

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
            Where orders from the store should be delivered.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="w-full sm:w-auto h-11 sm:h-10 text-base sm:text-sm">
          <Plus className="size-4" />
          Add address
        </Button>
      </header>

      {!addresses || addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses yet"
          description="Add one now and checkout will be a click."
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus className="size-4" />
              Add your first address
            </Button>
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
        onClose={() => setCreating(false)}
        onSaved={() => {
          invalidate();
          setCreating(false);
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
  onClose,
  onSaved,
}: {
  open: boolean;
  address?: StoredAddress;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(address);
  const [form, setForm] = React.useState<AddressInput>(BLANK);

  React.useEffect(() => {
    setForm(
      address
        ? {
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
          }
        : BLANK,
    );
  }, [address, open]);

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
