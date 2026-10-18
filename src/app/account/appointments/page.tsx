"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import {
  Avatar,
  Badge,
  Button,
  ConfirmModal,
  EmptyState,
  LoadingBlock,
} from "@/components/ui";
import { appointmentApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { APPOINTMENT_STATUS_LABELS } from "@/types";

const KEY = ["appointments", "mine"] as const;

function rupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function MyAppointmentsPage() {
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = React.useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: KEY,
    queryFn: () => appointmentApi.mine(false),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => appointmentApi.cancel(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KEY });
      setCancelling(null);
      toast.success("Appointment cancelled.");
    },
    onError: (e: ApiError) => {
      setCancelling(null);
      toast.error(e.message);
    },
  });

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight">My appointments</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          What you have booked, soonest first.
        </p>
      </header>

      {isLoading ? (
        <LoadingBlock />
      ) : !data?.length ? (
        <EmptyState
          icon={CalendarDays}
          title="No appointments yet"
          description="Book a time with an astrologer instead of waiting for one to be free."
          action={
            <Link href="/appointments">
              <Button>Find a time</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {data.map((a) => {
            const starts = new Date(a.starts_at);
            const upcoming = a.status === "booked" && starts.getTime() > Date.now();
            return (
              <li key={a.id} className="card-surface p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Avatar src={a.peer?.avatar_url} name={a.peer?.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{a.peer?.name ?? "Astrologer"}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {starts.toLocaleDateString([], {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      ·{" "}
                      <span className="tabular-nums">
                        {starts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>{" "}
                      · {a.minutes} min
                    </p>
                  </div>
                  <Badge tone={a.status === "booked" ? "green" : "neutral"}>
                    {APPOINTMENT_STATUS_LABELS[a.status]}
                  </Badge>
                </div>

                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-sm">
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-medium tabular-nums">₹{rupees(a.price_paise)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">Paid to hold</dt>
                    <dd className="font-medium tabular-nums">₹{rupees(a.deposit_paise)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted-foreground">
                      {a.status === "cancelled" ? "Not charged" : "Due at the appointment"}
                    </dt>
                    <dd className="font-medium tabular-nums">
                      ₹{rupees(a.balance_due_paise)}
                    </dd>
                  </div>
                </dl>

                {upcoming && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 text-danger hover:bg-danger/15"
                    onClick={() => setCancelling(a.id)}
                  >
                    Cancel
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmModal
        open={Boolean(cancelling)}
        onClose={() => setCancelling(null)}
        onConfirm={() => cancelling && cancel.mutate(cancelling)}
        title="Cancel this appointment?"
        description="The amount you paid to hold the slot is not refunded."
        confirmLabel="Cancel it"
        loading={cancel.isPending}
      />
    </div>
  );
}
