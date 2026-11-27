"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  CheckCircle2,
  Edit2,
  Flame,
  Loader2,
  PhoneOff,
  Plus,
  Trash2,
  Video,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfirmModal,
  EmptyState,
  Field,
  Input,
  LoadingBlock,
  Modal,
  Switch,
  Textarea,
} from "@/components/ui";
import { earningsApi, purohitApi, type PujaBookingData, type PurohitPujaItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useRealtime } from "@/providers/realtime-provider";

type DeskTab = "bookings" | "pujas" | "earnings" | "profile";

export default function WebPurohitDeskPage() {
  const { user } = useAuth();
  const { onPujaEvent } = useRealtime();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = React.useState<DeskTab>("bookings");

  const isPurohit = (user?.role as string) === "purohit" || user?.role === "admin";

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["purohit", "me", "profile"],
    queryFn: () => purohitApi.getMyProfile(),
    enabled: isPurohit,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["purohit", "me", "bookings"],
    queryFn: () => purohitApi.getMyPurohitBookings(),
    enabled: isPurohit,
  });

  const { data: earningsBalance, isLoading: earningsLoading } = useQuery({
    queryKey: ["purohit", "me", "earnings", "balance"],
    queryFn: () => earningsApi.balance(),
    enabled: isPurohit,
  });

  const { data: myPayouts = [] } = useQuery({
    queryKey: ["purohit", "me", "payouts"],
    queryFn: () => earningsApi.myPayouts(25),
    enabled: isPurohit,
  });

  const [payoutAmountInr, setPayoutAmountInr] = React.useState("");
  const [payoutUpiId, setPayoutUpiId] = React.useState("");
  const requestPayoutMutation = useMutation({
    mutationFn: async () => {
      const amountNum = Number(payoutAmountInr);
      if (!Number.isFinite(amountNum) || amountNum < 500) {
        throw new Error("Minimum payout request is ₹500.");
      }
      return earningsApi.requestPayout({
        amount_paise: Math.round(amountNum * 100),
        payout_method: "upi",
        upi_id: payoutUpiId.trim() || undefined,
      });
    },
    onSuccess: () => {
      setPayoutAmountInr("");
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "earnings"] });
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "payouts"] });
      toast.success("Payout withdrawal request submitted!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to submit payout request"),
  });

  const [isOnline, setIsOnline] = React.useState(false);

  React.useEffect(() => {
    if (!profile) return;
    setIsOnline(Boolean(profile.is_online));
  }, [profile]);

  React.useEffect(() => {
    if (!isPurohit) return;
    return onPujaEvent(() => {
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
    });
  }, [isPurohit, onPujaEvent, queryClient]);

  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => purohitApi.uploadMyAvatar(file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
      toast.success("Purohit profile photo updated!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to upload avatar"),
  });

  const updateAvailabilityMutation = useMutation({
    mutationFn: (nextOnline?: boolean) =>
      purohitApi.updateMyAvailability({
        is_online: nextOnline ?? isOnline,
      }),
    onSuccess: (updated) => {
      setIsOnline(updated.is_online);
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
      toast.success(
        updated.is_online ? "You are now Online for live Pujas!" : "You are now Offline."
      );
    },
    onError: (err: any) => toast.error(err?.message || "Failed to update availability"),
  });

  const acceptBookingMutation = useMutation({
    mutationFn: (bookingId: string) => purohitApi.acceptBooking(bookingId),
    onSuccess: (booking: any) => {
      const id = booking?.id || booking?.data?.id;
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
      toast.success("Puja accepted! Opening live room...");
      if (id) router.push(`/purohit-booking/${id}/room`);
    },
    onError: (err: any) => toast.error(err?.message || "Could not accept booking"),
  });

  const declineBookingMutation = useMutation({
    mutationFn: (bookingId: string) => purohitApi.declineBooking(bookingId, "Purohit unavailable right now"),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
      toast.info("Request declined and devotee refunded 100%.");
    },
    onError: (err: any) => toast.error(err?.message || "Could not decline booking"),
  });

  const completeBookingMutation = useMutation({
    mutationFn: (bookingId: string) => purohitApi.completeBooking(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "bookings"] });
      toast.success("Puja ritual marked as completed!");
    },
    onError: (err: any) => toast.error(err?.message || "Could not complete booking"),
  });

  // Puja Catalog Modal State
  const [pujaModalOpen, setPujaModalOpen] = React.useState(false);
  const [editingPuja, setEditingPuja] = React.useState<PurohitPujaItem | null>(null);
  const [deletingPujaId, setDeletingPujaId] = React.useState<string | null>(null);
  const [pujaForm, setPujaForm] = React.useState({
    puja_name: "",
    description: "",
    duration_minutes: 45,
    price_inr: 501,
    samagri_notes: "",
    is_active: true,
  });

  const savePujaMutation = useMutation({
    mutationFn: () => {
      if (!pujaForm.puja_name.trim()) throw new Error("Puja name is required");
      if (editingPuja) {
        return purohitApi.updateMyPuja(editingPuja.id, pujaForm);
      }
      return purohitApi.addMyPuja(pujaForm);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
      setPujaModalOpen(false);
      setEditingPuja(null);
      toast.success(editingPuja ? "Puja updated!" : "New Puja added to your catalog!");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to save Puja offering"),
  });

  const deletePujaMutation = useMutation({
    mutationFn: (pujaId: string) => purohitApi.deleteMyPuja(pujaId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["purohit", "me", "profile"] });
      setDeletingPujaId(null);
      toast.success("Puja removed from catalog.");
    },
    onError: (err: any) => toast.error(err?.message || "Failed to delete Puja"),
  });

  const openAddPuja = () => {
    setEditingPuja(null);
    setPujaForm({
      puja_name: "",
      description: "",
      duration_minutes: 45,
      price_inr: 501,
      samagri_notes: "",
      is_active: true,
    });
    setPujaModalOpen(true);
  };

  const openEditPuja = (item: PurohitPujaItem) => {
    setEditingPuja(item);
    setPujaForm({
      puja_name: item.puja_name,
      description: item.description || "",
      duration_minutes: item.duration_minutes || 45,
      price_inr: item.price_inr || 501,
      samagri_notes: item.samagri_notes || "",
      is_active: item.is_active !== false,
    });
    setPujaModalOpen(true);
  };

  if (!isPurohit) {
    return (
      <Card>
        <CardBody>
          <EmptyState
            icon={Flame}
            title="Purohit Partner Access Required"
            description="This dedicated desk is for verified Vedic Purohits to manage rituals, Sankalpa bookings, and dakshina pricing."
            action={
              <Link href="/become-a-purohit">
                <Button>Apply as a Vedic Purohit</Button>
              </Link>
            }
          />
        </CardBody>
      </Card>
    );
  }

  if (profileLoading) {
    return <LoadingBlock label="Loading your Purohit Desk..." />;
  }

  const pujasCatalog = profile?.pujas || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-amber-300/70 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar src={profile?.avatar_url} name={profile?.display_name || "Pandit Ji"} size="lg" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-bold text-stone-900">
                  {profile?.display_name || "Purohit Partner Desk"}
                </h1>
                <Badge tone={isOnline ? "green" : "neutral"}>
                  {isOnline ? "Live Online" : "Offline"}
                </Badge>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {profile?.title || "Sacred Vedic Rituals & Sankalpa Desk"} ·{" "}
                {profile?.total_pujas_performed ?? 0} Pujas Completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-2.5 border border-amber-200/80 shadow-2xs">
            <span className="text-xs font-bold text-stone-800">Online for Pujas</span>
            <Switch
              checked={isOnline}
              disabled={updateAvailabilityMutation.isPending}
              onChange={(checked) => {
                setIsOnline(checked);
                updateAvailabilityMutation.mutate(checked);
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: "bookings", label: `Live Bookings (${bookings.length})` },
            { id: "pujas", label: `Puja Catalog (${pujasCatalog.length})` },
            { id: "earnings", label: "Earnings & Payouts" },
            { id: "profile", label: "Profile & Avatar" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer",
              tab === item.id
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BOOKINGS */}
      {tab === "bookings" && (
        <div className="space-y-4">
          {bookingsLoading ? (
            <LoadingBlock label="Fetching devotee Sankalpa bookings..." />
          ) : bookings.length === 0 ? (
            <EmptyState
              icon={Flame}
              title="No Puja Bookings Yet"
              description="Toggle your status Online and keep your Puja catalog updated so devotees can book live Sankalpa rituals."
            />
          ) : (
            bookings.map((b: PujaBookingData) => (
              <Card key={b.id}>
                <CardBody className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-stone-900">{b.puja_name}</h3>
                        <Badge tone={b.status === "completed" ? "green" : b.status === "in_progress" ? "gold" : "neutral"}>
                          {b.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        #{b.booking_number} · Devotee: {b.user_name} · {b.puja_duration_minutes} mins · ₹{b.amount_inr}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {(b.status === "confirmed" || b.status === "awaiting_acceptance") && (
                        <>
                          <Button
                            size="sm"
                            loading={acceptBookingMutation.isPending}
                            onClick={() => acceptBookingMutation.mutate(b.id)}
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Video className="size-3.5" />
                            {b.status === "awaiting_acceptance" ? "Accept (Pay অপেক্ষা)" : "Accept & Enter Live Room"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            loading={declineBookingMutation.isPending}
                            onClick={() => declineBookingMutation.mutate(b.id)}
                            className="gap-1.5 border-rose-300 text-rose-700 hover:bg-rose-50"
                          >
                            <PhoneOff className="size-3.5" />
                            Decline
                          </Button>
                        </>
                      )}
                      {b.status === "in_progress" && (
                        <>
                          <Link href={`/purohit-booking/${b.id}/room`}>
                            <Button size="sm" className="gap-1.5">
                              <Video className="size-3.5" />
                              Enter Live Chamber
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            loading={completeBookingMutation.isPending}
                            onClick={() => completeBookingMutation.mutate(b.id)}
                            className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="size-3.5" />
                            Mark Complete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Sankalpa Details */}
                  <div className="rounded-xl bg-amber-50/70 border border-amber-200/70 p-3 text-xs grid sm:grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold text-amber-950">Sankalpa Name: </span>
                      <span className="text-stone-700">{b.sankalpa_name}</span>
                    </div>
                    <div>
                      <span className="font-bold text-amber-950">Gotra: </span>
                      <span className="text-stone-700">{b.sankalpa_gotra}</span>
                    </div>
                    {b.sankalpa_nakshatra && (
                      <div>
                        <span className="font-bold text-amber-950">Nakshatra: </span>
                        <span className="text-stone-700">{b.sankalpa_nakshatra}</span>
                      </div>
                    )}
                    {b.sankalpa_wish && (
                      <div className="sm:col-span-2">
                        <span className="font-bold text-amber-950">Prayer / Wish: </span>
                        <span className="text-stone-700">{b.sankalpa_wish}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 2: PUJA CATALOG */}
      {tab === "pujas" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">Manage your custom Puja offerings and Dakshina pricing.</p>
            <Button size="sm" onClick={openAddPuja} className="gap-1.5">
              <Plus className="size-4" />
              Add Puja Offering
            </Button>
          </div>

          {pujasCatalog.length === 0 ? (
            <EmptyState
              icon={Flame}
              title="No Pujas in Catalog"
              description="Add your first sacred ritual with duration, samagri checklist, and dakshina amount."
              action={<Button onClick={openAddPuja}>Add Puja Offering</Button>}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {pujasCatalog.map((item) => (
                <Card key={item.id}>
                  <CardBody className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm text-stone-900">{item.puja_name}</h3>
                        <p className="text-xs font-extrabold text-amber-700 mt-0.5">
                          ₹{item.price_inr} · {item.duration_minutes} mins
                        </p>
                      </div>
                      <Badge tone={item.is_active ? "green" : "neutral"}>
                        {item.is_active ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-xs text-stone-600 line-clamp-2">{item.description}</p>
                    )}
                    {item.samagri_notes && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 rounded-lg p-2">
                        Samagri: {item.samagri_notes}
                      </p>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                      <Button size="sm" variant="outline" onClick={() => openEditPuja(item)} className="gap-1">
                        <Edit2 className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeletingPujaId(item.id)}
                        className="text-danger hover:bg-danger/10 gap-1"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EARNINGS & PAYOUTS */}
      {tab === "earnings" && (
        <div className="space-y-4">
          {earningsLoading ? (
            <LoadingBlock label="Fetching Purohit earnings ledger..." />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardBody>
                    <p className="text-xs text-muted-foreground">Withdrawable Balance</p>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">
                      ₹{(((earningsBalance as any)?.available_paise ?? (earningsBalance as any)?.withdrawable_paise ?? 0) / 100).toLocaleString("en-IN")}
                    </p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <p className="text-xs text-muted-foreground">Pending Settlements</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">
                      ₹{(((earningsBalance as any)?.pending_paise ?? 0) / 100).toLocaleString("en-IN")}
                    </p>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <p className="text-xs text-muted-foreground">Lifetime Earned</p>
                    <p className="text-2xl font-bold text-stone-900 mt-1">
                      ₹{(((earningsBalance as any)?.total_earned_paise ?? 0) / 100).toLocaleString("en-IN")}
                    </p>
                  </CardBody>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="size-4 text-amber-600" />
                    Request Payout &amp; Ledger
                  </CardTitle>
                  <CardDescription>
                    Request settlement to your verified UPI ID or manage full bank &amp; QR details on{" "}
                    <Link href="/account/earnings" className="underline font-semibold text-amber-700">
                      Earnings Desk
                    </Link>
                    .
                  </CardDescription>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                    <Field label="Amount (INR)" htmlFor="purohit-payout-inr">
                      <Input
                        id="purohit-payout-inr"
                        type="number"
                        min={500}
                        placeholder="500"
                        value={payoutAmountInr}
                        onChange={(e) => setPayoutAmountInr(e.target.value)}
                      />
                    </Field>
                    <Field label="UPI ID (optional if saved)" htmlFor="purohit-payout-upi">
                      <Input
                        id="purohit-payout-upi"
                        placeholder="pandit@upi"
                        value={payoutUpiId}
                        onChange={(e) => setPayoutUpiId(e.target.value)}
                      />
                    </Field>
                    <Button
                      loading={requestPayoutMutation.isPending}
                      onClick={() => requestPayoutMutation.mutate()}
                    >
                      Request Payout
                    </Button>
                  </div>

                  {myPayouts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      <h4 className="text-xs font-bold text-stone-700">Recent Payout Requests</h4>
                      {myPayouts.slice(0, 5).map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                          <span>₹{((p.amount_paise ?? 0) / 100).toLocaleString("en-IN")} · {p.payout_method}</span>
                          <Badge tone={p.status === "paid" ? "green" : p.status === "rejected" ? "red" : "neutral"}>
                            {p.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardBody>
              </Card>
            </>
          )}
        </div>
      )}

      {/* TAB 5: PROFILE */}
      {tab === "profile" && (
        <Card>
          <CardHeader>
            <CardTitle>Purohit Credentials & Avatar</CardTitle>
            <CardDescription>
              Keep your portrait photo updated for the public DivinLink Purohit Directory.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar src={profile?.avatar_url} name={profile?.display_name || "Pandit Ji"} size="xl" />
              <div className="space-y-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadAvatarMutation.mutate(file);
                    e.target.value = "";
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  loading={uploadAvatarMutation.isPending}
                  onClick={() => avatarInputRef.current?.click()}
                  className="gap-1.5"
                >
                  <Camera className="size-4" />
                  Upload Purohit Portrait
                </Button>
                <p className="text-xs text-muted-foreground">
                  Languages: {profile?.languages?.join(", ") || "Sanskrit, Hindi, Bengali"} · {profile?.experience_years ?? 5} yrs exp
                </p>
              </div>
            </div>
            {profile?.bio && (
              <div className="rounded-xl bg-surface-muted p-3.5 text-xs text-stone-700 leading-relaxed">
                {profile.bio}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Add / Edit Puja Modal */}
      <Modal
        open={pujaModalOpen}
        onClose={() => {
          setPujaModalOpen(false);
          setEditingPuja(null);
        }}
        title={editingPuja ? "Edit Puja Offering" : "Add New Puja Offering"}
      >
        <div className="space-y-3">
          <Field label="Puja Name" htmlFor="puja-name" required>
            <Input
              id="puja-name"
              placeholder="e.g. Satyanarayan Katha & Maha Aarti"
              value={pujaForm.puja_name}
              onChange={(e) => setPujaForm((p) => ({ ...p, puja_name: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Dakshina (INR)" htmlFor="puja-price" required>
              <Input
                id="puja-price"
                type="number"
                min={101}
                value={pujaForm.price_inr}
                onChange={(e) => setPujaForm((p) => ({ ...p, price_inr: Number(e.target.value) || 0 }))}
              />
            </Field>
            <Field label="Duration (Minutes)" htmlFor="puja-duration" required>
              <Input
                id="puja-duration"
                type="number"
                min={15}
                value={pujaForm.duration_minutes}
                onChange={(e) => setPujaForm((p) => ({ ...p, duration_minutes: Number(e.target.value) || 30 }))}
              />
            </Field>
          </div>
          <Field label="Ritual Description" htmlFor="puja-desc">
            <Textarea
              id="puja-desc"
              rows={3}
              placeholder="Describe the Vedic Vidhi and spiritual benefits..."
              value={pujaForm.description}
              onChange={(e) => setPujaForm((p) => ({ ...p, description: e.target.value }))}
            />
          </Field>
          <Field label="Samagri Checklist Notes" htmlFor="puja-samagri">
            <Textarea
              id="puja-samagri"
              rows={2}
              placeholder="Items devotee should keep ready before joining..."
              value={pujaForm.samagri_notes}
              onChange={(e) => setPujaForm((p) => ({ ...p, samagri_notes: e.target.value }))}
            />
          </Field>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-stone-700">Active in Public Catalog</span>
            <Switch
              checked={pujaForm.is_active}
              onChange={(checked) => setPujaForm((p) => ({ ...p, is_active: checked }))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" onClick={() => setPujaModalOpen(false)}>
              Cancel
            </Button>
            <Button
              loading={savePujaMutation.isPending}
              onClick={() => savePujaMutation.mutate()}
              className="gap-1.5"
            >
              {savePujaMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {editingPuja ? "Save Changes" : "Add Puja"}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(deletingPujaId)}
        onClose={() => setDeletingPujaId(null)}
        onConfirm={() => {
          if (deletingPujaId) deletePujaMutation.mutate(deletingPujaId);
        }}
        title="Delete Puja Offering"
        description="Remove this ritual from your public catalog? Past bookings are unaffected."
        confirmLabel="Delete Puja"
        tone="danger"
        loading={deletePujaMutation.isPending}
      />
    </div>
  );
}
