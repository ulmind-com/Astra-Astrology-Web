"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Flame,
  Info,
  Link2,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Unlock,
  User,
  Zap,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  Alert,
  Badge,
  Button,
  ConfirmModal,
  LoadingBlock,
  Modal,
} from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import type { PrivateInviteLink } from "@/types";

const PRIVATE_LINKS_QUERY_KEY = ["appointments", "me", "private_links"] as const;

function formatPaiseToRupees(paise: number): string {
  return "₹" + (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export function PrivateLinksManager() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [revokingLinkId, setRevokingLinkId] = React.useState<string | null>(null);

  // Form State
  const [title, setTitle] = React.useState("");
  const [clientName, setClientName] = React.useState("");
  const [clientEmail, setClientEmail] = React.useState("");
  const [pricingMode, setPricingMode] = React.useState<"standard" | "fixed" | "discount" | "tatkal">("standard");
  const [customRupees, setCustomRupees] = React.useState("");
  const [discountPercent, setDiscountPercent] = React.useState<number>(20);
  const [passcode, setPasscode] = React.useState("");
  const [maxUses, setMaxUses] = React.useState<number>(1);
  const [expiresInHours, setExpiresInHours] = React.useState<number>(48);
  const [notes, setNotes] = React.useState("");

  const { data: links, isLoading, isError } = useQuery({
    queryKey: PRIVATE_LINKS_QUERY_KEY,
    queryFn: () => appointmentApi.getMyPrivateLinks(),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      let customPaise: number | undefined = undefined;
      let discount: number | undefined = undefined;
      let isTatkal = false;

      if (pricingMode === "fixed" && customRupees) {
        customPaise = Math.round(Number(customRupees) * 100);
      } else if (pricingMode === "discount") {
        discount = discountPercent;
      } else if (pricingMode === "tatkal") {
        isTatkal = true;
      }

      return appointmentApi.createPrivateLink({
        title: title.trim(),
        client_name: clientName.trim() || undefined,
        client_email: clientEmail.trim() || undefined,
        passcode: passcode.trim() || undefined,
        custom_price_paise: customPaise,
        discount_percent: discount,
        is_tatkal: isTatkal,
        max_uses: maxUses,
        expires_in_hours: expiresInHours > 0 ? expiresInHours : undefined,
        notes: notes.trim() || undefined,
      });
    },
    onSuccess: (newLink) => {
      toast.success(
        isBn
          ? "ভিআইপি প্রাইভেট ইনভাইট লিংক সফলভাবে তৈরি হয়েছে!"
          : "VIP private booking link created successfully!"
      );
      void queryClient.invalidateQueries({ queryKey: PRIVATE_LINKS_QUERY_KEY });
      setOpenCreateModal(false);
      resetForm();

      // Automatically copy new link to clipboard
      if (newLink?.invite_code) {
        handleCopyLink(newLink.invite_code);
      }
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to create VIP private link.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentApi.deletePrivateLink(id),
    onSuccess: () => {
      toast.success(
        isBn
          ? "প্রাইভেট লিংক সফলভাবে নিষ্ক্রিয় করা হয়েছে।"
          : "Private invite link deactivated successfully."
      );
      void queryClient.invalidateQueries({ queryKey: PRIVATE_LINKS_QUERY_KEY });
      setRevokingLinkId(null);
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to deactivate private link.");
      setRevokingLinkId(null);
    },
  });

  const resetForm = () => {
    setTitle("");
    setClientName("");
    setClientEmail("");
    setPricingMode("standard");
    setCustomRupees("");
    setDiscountPercent(20);
    setPasscode("");
    setMaxUses(1);
    setExpiresInHours(48);
    setNotes("");
  };

  const getFullPrivateUrl = (inviteCode: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/appointments/private/${inviteCode}`;
  };

  const handleCopyLink = async (inviteCode: string) => {
    const fullUrl = getFullPrivateUrl(inviteCode);
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      }
      setCopiedCode(inviteCode);
      toast.success(
        isBn
          ? "ভিআইপি প্রাইভেট লিংক ক্লিপবোর্ডে কপি করা হয়েছে!"
          : "VIP private invite link copied to clipboard!"
      );
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      toast.info(`Link: ${fullUrl}`);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(isBn ? "অনুগ্রহ করে লিংকের একটি শিরোনাম লিখুন" : "Please provide a title for the link");
      return;
    }
    if (pricingMode === "fixed" && (!customRupees || Number(customRupees) <= 0)) {
      toast.error(isBn ? "সঠিক কাস্টম ফি নির্ধারণ করুন" : "Please enter a valid fixed price");
      return;
    }
    createMutation.mutate();
  };

  const allLinks = links || [];
  const activeCount = allLinks.filter((l) => {
    const isExpired = l.expires_at ? new Date(l.expires_at).getTime() < Date.now() : false;
    const isExhausted = l.uses_count >= l.max_uses;
    return l.is_active && !isExpired && !isExhausted;
  }).length;

  return (
    <div className="space-y-6">
      {/* VIP Authority Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-brand-500/5 to-amber-600/10 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
              <Sparkles className="size-3 text-amber-600 dark:text-amber-400" />
              <span>{isBn ? "ভিআইপি ও স্পেশাল ইনভাইট অথরিটি" : "VIP & Private Invite Authority"}</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {isBn ? "সিক্রেট ভিআইপি ইনভাইট বুকিং লিংক" : "Discreet VIP Private Booking Links"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {isBn
                ? "বিশেষ সেলিব্রিটি, হাই-প্রোফাইল ক্লায়েন্ট বা ভিআইপি সন্ধানীদের জন্য গোপনীয় বুকিং লিংক তৈরি করুন। এই লিংকগুলো আপনার সাধারণ পাবলিক প্রোফাইলে দেখা যায় না এবং সিক্রেট পাসকোড দিয়ে লক করা যায়।"
                : "Issue discreet, invite-only booking links for celebrity seekers and private clients. Links bypass public listings and can be secured with custom PIN passcodes and preferential rates."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => {
                resetForm();
                setOpenCreateModal(true);
              }}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-md cursor-pointer px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Plus className="size-4 stroke-[2.5]" />
              <span>{isBn ? "নতুন ভিআইপি লিংক তৈরি করুন" : "Create VIP Link"}</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mt-5 pt-4 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-background/60 backdrop-blur-xs p-3 border border-border/60">
            <span className="text-[11px] text-muted-foreground">{isBn ? "মোট লিংক" : "Total Links"}</span>
            <p className="font-display font-bold text-base text-foreground mt-0.5">{allLinks.length}</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/30">
            <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
              {isBn ? "সক্রিয় লিংক" : "Active Links"}
            </span>
            <p className="font-display font-bold text-base text-emerald-700 dark:text-emerald-300 mt-0.5">
              {activeCount}
            </p>
          </div>
          <div className="rounded-xl bg-background/60 backdrop-blur-xs p-3 border border-border/60">
            <span className="text-[11px] text-muted-foreground">{isBn ? "মোট ভিআইপি বুকিং" : "Total VIP Bookings"}</span>
            <p className="font-display font-bold text-base text-foreground mt-0.5">
              {allLinks.reduce((acc, curr) => acc + (curr.uses_count || 0), 0)}
            </p>
          </div>
          <div className="rounded-xl bg-background/60 backdrop-blur-xs p-3 border border-border/60">
            <span className="text-[11px] text-muted-foreground">{isBn ? "পাসকোড সুরক্ষিত" : "PIN Protected"}</span>
            <p className="font-display font-bold text-base text-amber-700 dark:text-amber-400 mt-0.5">
              {allLinks.filter((l) => l.has_passcode).length}
            </p>
          </div>
        </div>
      </div>

      {/* Directory Table / Cards */}
      <div className="rounded-2xl border border-border bg-card shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-border/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="size-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-display text-sm font-bold text-foreground">
              {isBn ? "প্রাইভেট লিংক তালিকা ও স্ট্যাটাস" : "Generated VIP Links Directory"}
            </h3>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {allLinks.length} {isBn ? "টি লিংক পাওয়া গেছে" : "links listed"}
          </span>
        </div>

        {isLoading ? (
          <div className="p-8">
            <LoadingBlock label={isBn ? "প্রাইভেট লিংক লোড করা হচ্ছে..." : "Loading private invite links…"} />
          </div>
        ) : allLinks.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <Link2 className="size-6" />
            </div>
            <h4 className="font-bold text-sm text-foreground">
              {isBn ? "কোনো ভিআইপি লিংক তৈরি করা হয়নি" : "No Private Links Generated Yet"}
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              {isBn
                ? "বিশেষ বা সেলিব্রিটি ক্লায়েন্টদের জন্য কাস্টম ফি ও পাসকোড দিয়ে প্রথম ভিআইপি লিংক তৈরি করুন।"
                : "Generate your first discreet booking link with custom pricing, optional PIN passcode, and usage quotas."}
            </p>
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => {
                  resetForm();
                  setOpenCreateModal(true);
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
              >
                <Plus className="size-3.5 mr-1" />
                {isBn ? "প্রথম ভিআইপি লিংক তৈরি করুন" : "Create First Private Link"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {allLinks.map((link) => {
              const isExhausted = link.uses_count >= link.max_uses;
              const isExpired = link.expires_at ? new Date(link.expires_at).getTime() < Date.now() : false;
              const isLive = link.is_active && !isExhausted && !isExpired;
              const fullUrl = getFullPrivateUrl(link.invite_code);
              const isCopied = copiedCode === link.invite_code;

              return (
                <div
                  key={link.id}
                  className={cn(
                    "p-4 sm:p-5 transition-all space-y-3.5",
                    isLive ? "hover:bg-surface-muted/40" : "bg-muted/30 opacity-75"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Title & Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          isLive
                            ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30"
                            : isExhausted
                            ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isLive ? "bg-emerald-500 animate-pulse" : isExhausted ? "bg-amber-500" : "bg-rose-500"
                          )}
                        />
                        {isLive
                          ? isBn ? "সক্রিয় লিংক" : "Active Link"
                          : isExhausted
                          ? isBn ? "কোটা সমাপ্ত" : "Quota Exhausted"
                          : isBn ? "মেয়াদোত্তীর্ণ" : "Expired / Revoked"}
                      </span>

                      {link.has_passcode ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <Lock className="size-2.5 text-amber-600" />
                          <span>{isBn ? "পাসকোড সুরক্ষিত" : "PIN Protected"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-surface-muted border border-border/60 px-2 py-0.5 rounded-full">
                          <Unlock className="size-2.5 text-muted-foreground" />
                          <span>{isBn ? "সরাসরি প্রবেশ" : "Direct Access"}</span>
                        </span>
                      )}

                      {link.is_tatkal && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                          <Zap className="size-2.5 fill-amber-600 text-amber-600" />
                          <span>Tatkal</span>
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCopyLink(link.invite_code)}
                        className="text-xs font-semibold cursor-pointer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3.5 mr-1 text-emerald-600" />
                            <span>{isBn ? "কপি হয়েছে" : "Copied"}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5 mr-1" />
                            <span>{isBn ? "লিংক কপি" : "Copy Link"}</span>
                          </>
                        )}
                      </Button>

                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground hover:bg-surface-muted transition-colors cursor-pointer"
                        title={isBn ? "লিংক প্রিভিউ দেখুন" : "Preview Private Page"}
                      >
                        <ExternalLink className="size-3.5 text-muted-foreground" />
                      </a>

                      {link.is_active && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRevokingLinkId(link.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 p-2 cursor-pointer"
                          title={isBn ? "লিংক নিষ্ক্রিয় করুন" : "Deactivate Link"}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Details Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs pt-1">
                    <div className="md:col-span-6 space-y-1">
                      <p className="font-display font-bold text-sm text-foreground">{link.title}</p>
                      {link.client_name && (
                        <p className="text-muted-foreground flex items-center gap-1.5">
                          <User className="size-3 text-amber-600" />
                          <span>
                            {isBn ? "ক্লায়েন্ট:" : "VIP Client:"}{" "}
                            <span className="font-semibold text-foreground">{link.client_name}</span>
                          </span>
                        </p>
                      )}
                      {link.client_email && (
                        <p className="text-[11px] text-muted-foreground font-mono">{link.client_email}</p>
                      )}
                      {link.notes && (
                        <p className="text-[11px] text-muted-foreground italic mt-1 bg-surface-muted/60 p-2 rounded-lg border border-border/40">
                          "{link.notes}"
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-6 flex flex-col justify-between sm:items-end gap-1.5 text-muted-foreground">
                      <div className="flex flex-wrap items-center sm:justify-end gap-2 text-xs">
                        <span className="text-muted-foreground">{isBn ? "কনসালটেশন ফি:" : "Rate:"}</span>
                        <span className="font-bold text-foreground">
                          {link.custom_price_paise
                            ? `${formatPaiseToRupees(link.custom_price_paise)} Fixed`
                            : link.discount_percent
                            ? `${link.discount_percent}% Off`
                            : link.is_tatkal
                            ? (isBn ? "তাতকাল প্রিমিয়াম ফি" : "Tatkal Premium Rate")
                            : (isBn ? "স্ট্যান্ডার্ড কার্ড রেট" : "Standard Card Rate")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground">
                          {isBn ? "ব্যবহার:" : "Quota:"}{" "}
                          <span className="font-semibold text-foreground">{link.uses_count}</span> /{" "}
                          <span className="font-semibold text-foreground">{link.max_uses}</span>{" "}
                          {isBn ? "বার বুকিং" : "bookings"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="size-3 text-amber-600 shrink-0" />
                        <span>
                          {link.expires_at ? (
                            isBn
                              ? `মেয়াদ শেষ: ${new Date(link.expires_at).toLocaleDateString([], {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                              : `Expires: ${new Date(link.expires_at).toLocaleDateString([], {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`
                          ) : (
                            isBn ? "মেয়াদ: আজীবন (কোনো মেয়াদ শেষ নেই)" : "No expiration set"
                          )}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-muted-foreground/80 truncate max-w-full select-all">
                        {fullUrl}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: Create New VIP Private Link */}
      {openCreateModal && (
        <Modal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title={isBn ? "🔒 নতুন ভিআইপি প্রাইভেট বুকিং লিংক তৈরি করুন" : "🔒 Generate VIP Private Booking Link"}
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <Alert tone="info">
              {isBn
                ? "এই গোপনীয় ইনভাইট লিংকটি শুধুমাত্র যাদের সাথে শেয়ার করবেন তারাই অ্যাক্সেস করতে পারবেন। পাবলিক সার্চ বা প্রোফাইলে দেখা যাবে না।"
                : "This invite link is strictly unlisted. Only seekers with the link (and optional passcode) can view and book."}
            </Alert>

            {/* Title / Purpose */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {isBn ? "লিংকের শিরোনাম / উদ্দেশ্য *" : "Link Title / Purpose *"}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  isBn
                    ? "যেমন: বিশেষ সেলিব্রিটি কুন্ডলী ও ক্যারিয়ার বিশ্লেষণ"
                    : "e.g. Exclusive VIP Celebrity Astrological Consultation"
                }
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Client Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {isBn ? "ক্লায়েন্টের নাম (ঐচ্ছিক)" : "Client Name (Optional)"}
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Mr. S. Sharma"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {isBn ? "ক্লায়েন্টের ইমেল (ঐচ্ছিক)" : "Client Email (Optional)"}
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@vip.com"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Pricing Mode Selector */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {isBn ? "ফি ও রেট পলিসি নির্ধারণ" : "Pricing & Rate Policy"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "standard", label: isBn ? "স্ট্যান্ডার্ড" : "Standard" },
                  { id: "fixed", label: isBn ? "কাস্টম নির্দিষ্ট ফি" : "Fixed Price" },
                  { id: "discount", label: isBn ? "ডিসকাউন্ট (%)" : "Discount" },
                  { id: "tatkal", label: isBn ? "তাতকাল প্রিমিয়াম" : "Tatkal Premium" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPricingMode(mode.id as any)}
                    className={cn(
                      "p-2 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer",
                      pricingMode === mode.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200"
                        : "border-border bg-background text-muted-foreground hover:bg-surface-muted"
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Fixed Price Input */}
            {pricingMode === "fixed" && (
              <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <label className="font-semibold text-foreground">
                  {isBn ? "নির্দিষ্ট কাস্টম ফি (টাকায় / ₹)" : "Custom Fixed Rate (INR ₹)"}
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={customRupees}
                  onChange={(e) => setCustomRupees(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Discount Percent Input */}
            {pricingMode === "discount" && (
              <div className="space-y-1.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <label className="font-semibold text-foreground">
                  {isBn ? "ডিসকাউন্ট শতাংশ (% ছাড়)" : "Discount Percentage (% Off)"}
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Passcode Security */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground flex items-center justify-between">
                <span>{isBn ? "সিক্রেট পিন / পাসকোড (ঐচ্ছিক)" : "Secret PIN / Passcode (Optional)"}</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  {isBn ? "ফাঁকা রাখলে সরাসরি প্রবেশযোগ্য" : "Leave blank for direct access"}
                </span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="e.g. 7890 or VIP2026"
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Max Uses & Expiry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {isBn ? "সর্বোচ্চ বুকিং সংখ্যা" : "Max Allowed Bookings"}
                </label>
                <select
                  value={maxUses}
                  onChange={(e) => setMaxUses(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={1}>{isBn ? "১ বার বুকিং (একবার ব্যবহারযোগ্য)" : "1 Booking (Single-use)"}</option>
                  <option value={2}>{isBn ? "২ বার বুকিং" : "2 Bookings"}</option>
                  <option value={5}>{isBn ? "৫ বার বুকিং" : "5 Bookings"}</option>
                  <option value={10}>{isBn ? "১০ বার বুকিং" : "10 Bookings"}</option>
                  <option value={50}>{isBn ? "৫০ বার বুকিং" : "50 Bookings"}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">
                  {isBn ? "লিংকের মেয়াদ" : "Link Expiration Window"}
                </label>
                <select
                  value={expiresInHours}
                  onChange={(e) => setExpiresInHours(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value={24}>{isBn ? "২৪ ঘণ্টা (১ দিন)" : "24 Hours (1 Day)"}</option>
                  <option value={48}>{isBn ? "৪৮ ঘণ্টা (২ দিন - প্রস্তাবিত)" : "48 Hours (2 Days - Standard)"}</option>
                  <option value={72}>{isBn ? "৭২ ঘণ্টা (৩ দিন)" : "72 Hours (3 Days)"}</option>
                  <option value={168}>{isBn ? "৭ দিন (১ সপ্তাহ)" : "7 Days (1 Week)"}</option>
                  <option value={720}>{isBn ? "৩০ দিন (১ মাস)" : "30 Days (1 Month)"}</option>
                  <option value={0}>{isBn ? "কোনো মেয়াদ নেই (আজীবন)" : "Never Expire"}</option>
                </select>
              </div>
            </div>

            {/* Astrologer Internal Notes */}
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">
                {isBn ? "জ্যোতিষীর নিজস্ব নোট / মন্তব্য (ঐচ্ছিক)" : "Private Astrologer Notes (Optional)"}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isBn
                    ? "যেমন: বিশেষ রেফারেন্স ক্লায়েন্ট, জরুরি কুণ্ডলী মিলন ও ব্যবসায়িক সিদ্ধান্ত।"
                    : "e.g. Special reference client, discreet session."
                }
                rows={2}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-border/80">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenCreateModal(false)}
              >
                {isBn ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                {createMutation.isPending
                  ? isBn ? "তৈরি করা হচ্ছে..." : "Generating Link..."
                  : isBn ? "ভিআইপি লিংক তৈরি করুন" : "Generate VIP Link"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* CONFIRM MODAL: Deactivate Private Link */}
      {revokingLinkId && (
        <ConfirmModal
          open={Boolean(revokingLinkId)}
          onClose={() => setRevokingLinkId(null)}
          onConfirm={() => revokingLinkId && deleteMutation.mutate(revokingLinkId)}
          title={isBn ? "প্রাইভেট লিংক নিষ্ক্রিয় করবেন?" : "Deactivate this VIP private link?"}
          description={
            isBn
              ? "আপনি কি নিশ্চিত? এই লিংকটি নিষ্ক্রিয় করলে ক্লায়েন্টরা আর এই লিংকের মাধ্যমে বুকিং করতে পারবে না।"
              : "Are you sure? Once deactivated, seekers with this invitation code will no longer be able to access or book consultations."
          }
          confirmLabel={isBn ? "হ্যাঁ, নিষ্ক্রিয় করুন" : "Yes, deactivate link"}
          loading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
