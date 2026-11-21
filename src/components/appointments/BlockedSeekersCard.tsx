"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Unlock,
  UserX,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button, Input, Modal } from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { BlacklistedClient } from "@/types";

interface BlockedSeekersCardProps {
  language?: "bn" | "hi" | "en";
}

const BLACKLIST_KEY = ["appointments", "blacklist"];

export function BlockedSeekersCard({ language = "bn" }: BlockedSeekersCardProps) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [unblockingClient, setUnblockingClient] = React.useState<BlacklistedClient | null>(null);

  const { data: clients, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: BLACKLIST_KEY,
    queryFn: () => appointmentApi.getMyBlacklist(),
  });

  const unblockMutation = useMutation({
    mutationFn: (clientUserId: string) => appointmentApi.unblockClient(clientUserId),
    onSuccess: (_, clientUserId) => {
      void queryClient.invalidateQueries({ queryKey: BLACKLIST_KEY });
      const unblocked = unblockingClient?.name || "Client";
      setUnblockingClient(null);
      toast.success(
        language === "bn"
          ? `${unblocked}-কে সফলভাবে আনব্লক করা হয়েছে। তারা এখন আপনার অ্যাপয়েন্টমেন্ট বুক করতে পারবেন।`
          : `${unblocked} has been unblocked. They can now book appointments with you again.`
      );
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Failed to unblock client.");
    },
  });

  const filteredClients = React.useMemo(() => {
    if (!clients) return [];
    if (!searchTerm.trim()) return clients;
    const q = searchTerm.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.last_reason && c.last_reason.toLowerCase().includes(q)) ||
        (c.email_masked && c.email_masked.toLowerCase().includes(q)) ||
        (c.phone_masked && c.phone_masked.toLowerCase().includes(q))
    );
  }, [clients, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-red-950/20 via-neutral-900/90 to-red-950/20 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-500 border border-red-500/40">
              <ShieldAlert className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-foreground">
                  {language === "bn"
                    ? "ব্লক করা ক্লায়েন্টদের তালিকা (Blocked Seekers)"
                    : language === "hi"
                    ? "ब्लॉक किए गए क्लाइंट्स (Blocked Seekers)"
                    : "Blocked Seekers & Red-Flag Audit"}
                </h3>
                <span className="rounded-full bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold">
                  {clients?.length ?? 0} {language === "bn" ? "জন অবরুদ্ধ" : "Blocked"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {language === "bn"
                  ? "যেসব ক্লায়েন্টকে আপনি অশালীন আচরণ বা নীতি লঙ্ঘনের জন্য রেড-ফ্ল্যাগ বা ব্লক করেছেন।"
                  : "Clients restricted from booking consultations with you due to misconduct or red-flag reports."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching || isLoading}
              className="text-xs font-semibold"
            >
              <RefreshCw className={cn("size-3.5 mr-1.5", isRefetching && "animate-spin")} />
              {language === "bn" ? "রিফ্রেশ" : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {clients && clients.length > 0 && (
          <div className="mt-4 relative">
            <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === "bn"
                  ? "ক্লায়েন্টের নাম, কারণ বা যোগাযোগ দিয়ে খুঁজুন..."
                  : "Search blocked clients by name, incident reason, or contact..."
              }
              className="w-full rounded-xl border border-border/80 bg-background/80 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-500/40"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-red-500" />
          <p className="mt-3 font-serif text-sm font-semibold text-muted-foreground">
            {language === "bn"
              ? "অবরুদ্ধ ক্লায়েন্টদের তালিকা লোড হচ্ছে..."
              : "Loading blacklist records..."}
          </p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-center text-xs text-red-700 dark:text-red-300">
          <AlertTriangle className="mx-auto size-6 text-red-500 mb-2" />
          <p>{(error as ApiError).message || "Failed to load blacklist."}</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="size-7" />
          </div>
          <h4 className="mt-4 font-serif text-base font-bold text-foreground">
            {searchTerm
              ? (language === "bn" ? "কোনো মিল খুঁজে পাওয়া যায়নি" : "No matching seekers found")
              : (language === "bn"
                  ? "কোনো অবরুদ্ধ ক্লায়েন্ট নেই"
                  : "Your Consultation Sanctuary is Clear")}
          </h4>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            {searchTerm
              ? (language === "bn"
                  ? `"${searchTerm}" এর সাথে কোনো অবরুদ্ধ ক্লায়েন্ট মেলেনি।`
                  : `No blocked clients matched your query "${searchTerm}".`)
              : (language === "bn"
                  ? "আপনার চেম্বারে কোনো ক্লায়েন্ট ব্লক করা নেই। অসদাচরণের শিকার হলে চেম্বার থেকে সরাসরি ক্লায়েন্টকে রেড-ফ্ল্যাগ করতে পারেন।"
                  : "You have not blocked any seekers. If you ever experience misconduct or policy violations during a consultation, tap 'Report Abuse' inside the chamber.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredClients.map((c) => (
            <div
              key={c.user_id}
              className="rounded-2xl border border-red-500/20 bg-card p-4 transition-all hover:border-red-500/40 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Top Card Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 font-bold border border-red-500/30">
                      <UserX className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                        {c.email_masked && (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="size-3 text-muted-foreground" />
                            {c.email_masked}
                          </span>
                        )}
                        {c.phone_masked && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="size-3 text-muted-foreground" />
                            {c.phone_masked}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="rounded-full bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0">
                    BLOCKED
                  </span>
                </div>

                {/* Reason & Incident Info */}
                <div className="mt-3.5 rounded-xl border border-border/80 bg-neutral-50 dark:bg-neutral-900/60 p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-semibold text-[11.5px]">
                    <AlertTriangle className="size-3.5 shrink-0" />
                    <span>{c.last_reason || "Policy Misconduct / Inappropriate Behavior"}</span>
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-muted-foreground italic pl-5">
                      &quot;{c.notes}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {c.blacklisted_at
                        ? new Date(c.blacklisted_at).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Prior Session"}
                    </span>
                    <span>
                      {c.total_reports > 1
                        ? `${c.total_reports} Incident Reports`
                        : "1 Incident Report"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-3.5 pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Restricted from booking calendar
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setUnblockingClient(c)}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10"
                >
                  <Unlock className="size-3.5 mr-1" />
                  {language === "bn" ? "আনব্লক করুন" : "Unblock Seeker"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal for Unblocking */}
      <Modal
        open={Boolean(unblockingClient)}
        onClose={() => setUnblockingClient(null)}
        title={language === "bn" ? "ক্লায়েন্টকে আনব্লক করতে চান?" : "Unblock Seeker?"}
      >
        {unblockingClient && (
          <div className="max-w-md w-full rounded-2xl bg-card p-6 shadow-2xl border border-border text-foreground">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <Unlock className="size-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold">
                  {language === "bn" ? "ক্লায়েন্টকে আনব্লক করতে চান?" : "Unblock Seeker?"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {unblockingClient.name} ({unblockingClient.email_masked || unblockingClient.phone_masked || "Seeker"})
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground bg-muted/40 p-3 rounded-xl border border-border/60">
              {language === "bn"
                ? `আপনি কি নিশ্চিত যে ${unblockingClient.name}-কে আপনার ব্ল্যাকলিস্ট থেকে সরাতে চান? আনব্লক করার পর তারা আবার আপনার উপলব্ধ স্লটগুলো দেখতে এবং পরামর্শের জন্য বুক করতে পারবেন।`
                : `Are you sure you want to unblock ${unblockingClient.name}? They will regain permission to browse your open calendar and schedule appointments with you.`}
            </p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUnblockingClient(null)}
                disabled={unblockMutation.isPending}
                className="text-xs"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                size="sm"
                onClick={() => unblockMutation.mutate(unblockingClient.user_id)}
                disabled={unblockMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                {unblockMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                    Unblocking…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5 mr-1.5" />
                    {language === "bn" ? "হ্যাঁ, আনব্লক করুন" : "Confirm Unblock"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
