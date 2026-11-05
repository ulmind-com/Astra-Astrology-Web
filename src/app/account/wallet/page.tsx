"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Coins,
  ExternalLink,
  Loader2,
  Lock,
  MessageSquare,
  Phone,
  ShieldCheck,
  Snowflake,
  Video,
  Wallet as WalletIcon,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Field,
  Input,
  LoadingBlock,
  Pagination,
} from "@/components/ui";
import { useProfile } from "@/hooks/use-profile";
import {
  useRecharge,
  useRechargeOptions,
  useTransactions,
  useWallet,
} from "@/hooks/use-wallet";
import { ApiError } from "@/lib/api/client";
import { cn, formatDateTime } from "@/lib/utils";
import {
  TRANSACTION_REASON_LABELS,
  coinWord,
  formatCoins,
  formatPaise,
  rupeesToPaise,
  type ActiveConsultationHold,
  type WalletTransaction,
} from "@/types";

function TransactionRow({ txn }: { txn: WalletTransaction }) {
  const isCredit = txn.direction === "credit";
  const rawRef = (txn.ref as Record<string, any>) || {};
  const consultation = txn.consultation;
  const astroName = txn.astrologer_name || consultation?.astrologer_name || rawRef.astrologer_name;
  const astroImg = txn.astrologer_image_url || txn.astrologer_avatar || consultation?.astrologer_avatar || rawRef.astrologer_image_url;
  const mode = (txn.consultation_mode || consultation?.mode || rawRef.consultation_mode || "").toLowerCase();
  const isConsultation = txn.reason === "consultation" || Boolean(astroName);

  const getModeBadge = () => {
    if (mode === "video") {
      return {
        label: "Video Call",
        icon: Video,
        cls: "bg-purple-50 text-purple-700 border-purple-200/80",
      };
    }
    if (mode === "call") {
      return {
        label: "Voice Call",
        icon: Phone,
        cls: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      };
    }
    return {
      label: "Chat",
      icon: MessageSquare,
      cls: "bg-amber-50 text-amber-700 border-amber-200/80",
    };
  };

  const modeBadge = isConsultation && mode ? getModeBadge() : null;
  const ModeIcon = modeBadge?.icon;

  return (
    <li className="flex items-center gap-3 border-b border-border px-3.5 sm:px-5 py-3.5 sm:py-4 last:border-0 hover:bg-black/[0.015] transition-colors">
      {/* Icon or Astrologer Avatar */}
      {isConsultation && astroName ? (
        <div className="relative shrink-0">
          <Avatar
            src={astroImg}
            name={astroName}
            size="sm"
            className="size-9 sm:size-10 ring-1 ring-border/80 shadow-xs"
          />
          {ModeIcon && (
            <span className="absolute -bottom-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-white shadow-xs border border-border">
              <ModeIcon className="size-2.5 text-ink-950" />
            </span>
          )}
        </div>
      ) : (
        <span
          className={cn(
            "flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-full shadow-xs",
            isCredit ? "bg-success-surface text-success" : "bg-warning-surface text-warning",
          )}
        >
          {isCredit ? (
            <ArrowDownLeft className="size-4" />
          ) : (
            <ArrowUpRight className="size-4" />
          )}
        </span>
      )}

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <p className="truncate text-xs sm:text-sm font-semibold text-ink-950">
            {astroName ? `Consultation with ${astroName}` : (txn.note ?? TRANSACTION_REASON_LABELS[txn.reason])}
          </p>
          {modeBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                modeBadge.cls,
              )}
            >
              <modeBadge.icon className="size-2.5" />
              {modeBadge.label}
            </span>
          )}
        </div>
        <p className="text-[11px] sm:text-xs text-muted-foreground truncate mt-0.5">
          {formatDateTime(txn.created_at)}
          {consultation?.duration_seconds != null && consultation.duration_seconds > 0 && (
            ` · ${Math.max(1, Math.round(consultation.duration_seconds / 60))} mins`
          )}
          {txn.note && astroName && ` · ${txn.note}`}
          {txn.amount_paise != null && ` · paid ${formatPaise(txn.amount_paise)}`}
        </p>
      </div>

      {/* Coins & Balance */}
      <div className="shrink-0 text-right">
        <p
          className={cn(
            "text-xs sm:text-sm font-bold tabular-nums",
            isCredit ? "text-success" : "text-ink-950",
          )}
        >
          {isCredit ? "+" : "−"}
          {formatCoins(txn.amount_coins)}
        </p>
        <p className="text-[11px] sm:text-xs text-muted-foreground tabular-nums">
          {formatCoins(txn.balance_after_coins)} left
        </p>
      </div>
    </li>
  );
}

export default function WalletPage() {
  const { data: profile } = useProfile();
  const { data: summary, isLoading, error } = useWallet();
  const { data: options } = useRechargeOptions();
  const { start, state, isBusy } = useRecharge();

  const [page, setPage] = React.useState(1);
  const { data: history, isLoading: loadingHistory } = useTransactions(page);

  const [custom, setCustom] = React.useState("");
  const [customError, setCustomError] = React.useState<string | null>(null);

  const frozen = summary?.wallet.is_frozen ?? false;

  function recharge(amountPaise: number) {
    if (!profile) return;
    void start(amountPaise, {
      name: profile.full_name,
      email: profile.email,
      contact: profile.phone,
    });
  }

  function rechargeCustom(event: React.FormEvent) {
    event.preventDefault();
    setCustomError(null);

    const rupees = Number(custom);
    if (!custom.trim() || Number.isNaN(rupees) || rupees <= 0) {
      setCustomError("Enter an amount.");
      return;
    }
    if (!Number.isInteger(rupees)) {
      // The backend refuses this too: Rs 99.55 at 10 coins/rupee would be
      // 995.5 coins, and a coin cannot be half.
      setCustomError("Enter a whole number of rupees.");
      return;
    }
    const paise = rupeesToPaise(rupees);
    if (options && paise < options.min_paise) {
      setCustomError(`The smallest recharge is ${formatPaise(options.min_paise)}.`);
      return;
    }
    if (options && paise > options.max_paise) {
      setCustomError(`The largest recharge is ${formatPaise(options.max_paise)}.`);
      return;
    }
    recharge(paise);
  }

  if (isLoading) return <LoadingBlock label="Loading your wallet…" />;
  if (error) return <Alert tone="error">{(error as ApiError).message}</Alert>;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------------- balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Available / Spendable Balance */}
        <Card className="overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
          <div className="px-5 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <WalletIcon className="size-4 text-emerald-600" />
                Spendable Balance
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-emerald-950 tabular-nums">
              {formatCoins(summary.wallet.available_coins ?? (summary.wallet.balance_coins - (summary.wallet.blocked_coins || 0)))}{" "}
              <span className="text-sm font-semibold text-emerald-700">
                {coinWord(summary.wallet.available_coins ?? (summary.wallet.balance_coins - (summary.wallet.blocked_coins || 0)))}
              </span>
            </p>
            <p className="mt-1 text-xs text-emerald-800/80">
              Usable for calls, chats, tarot & new bookings
            </p>
          </div>
        </Card>

        {/* Card 2: Blocked in Escrow for Consultations */}
        <Card className="overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent">
          <div className="px-5 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Lock className="size-4 text-amber-600" />
                Escrow Reserved
              </span>
              {(summary.wallet.blocked_coins || 0) > 0 ? (
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-900 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Locked
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-400">
                  0 locked
                </span>
              )}
            </div>
            <p className="mt-3 text-3xl font-extrabold text-amber-950 tabular-nums">
              {formatCoins(summary.wallet.blocked_coins ?? 0)}{" "}
              <span className="text-sm font-semibold text-amber-800">
                {coinWord(summary.wallet.blocked_coins ?? 0)}
              </span>
            </p>
            <p className="mt-1 text-xs text-amber-900/80">
              Safely held for confirmed upcoming appointments
            </p>
          </div>
        </Card>

        {/* Card 3: Total Account Balance */}
        <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-slate-100/80 via-white to-transparent">
          <div className="px-5 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Coins className="size-4 text-slate-500" />
                Total Balance
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Ledger</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900 tabular-nums">
              {formatCoins(summary.wallet.balance_coins)}{" "}
              <span className="text-sm font-semibold text-slate-500">
                {coinWord(summary.wallet.balance_coins)}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {summary.wallet.last_transaction_at ? (
                `Last activity ${formatDateTime(summary.wallet.last_transaction_at)}`
              ) : (
                "Total balance across all reserves"
              )}
            </p>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------ Active Escrow Holds Section */}
      {summary.wallet.active_holds && summary.wallet.active_holds.length > 0 && (
        <Card className="border-amber-500/30 overflow-hidden shadow-xs">
          <CardHeader className="bg-amber-50/50 pb-3 border-b border-amber-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-800">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold text-amber-950">
                    Active Appointment Escrow Reserves
                  </CardTitle>
                  <CardDescription className="text-xs text-amber-900/80">
                    Coins held in escrow guarantees your slot without risk. Funds are captured only when consultation completes.
                  </CardDescription>
                </div>
              </div>
              <Link
                href="/account/appointments"
                className="text-xs font-bold text-amber-800 hover:text-amber-950 inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </CardHeader>
          <div className="divide-y divide-border/60">
            {summary.wallet.active_holds.map((hold: ActiveConsultationHold) => (
              <div key={hold.appointment_id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-amber-50/20 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {hold.astrologer_name}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                      <Lock className="size-2.5" />
                      Held in Escrow
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
                    <Calendar className="size-3 text-amber-600" />
                    <span>{new Date(hold.starts_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                    <span>•</span>
                    <span>{hold.minutes} mins session</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-muted-foreground">Escrow Hold</p>
                    <p className="text-sm font-extrabold text-amber-900 tabular-nums">
                      {formatCoins(hold.held_coins)} coins
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      (Deposit paid: {hold.deposit_coins} coins)
                    </p>
                  </div>
                  <Link
                    href="/account/appointments"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-semibold text-amber-900 bg-white hover:bg-amber-50 transition-colors"
                  >
                    <span>Manage</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {frozen && (
        <Alert tone="warning" title="This wallet is on hold">
          <span className="flex items-start gap-2">
            <Snowflake className="mt-0.5 size-4 shrink-0" />
            <span>
              {summary.wallet.frozen_reason ??
                "Money cannot move in or out right now."}{" "}
              Please contact support.
            </span>
          </span>
        </Alert>
      )}

      {/* -------------------------------------------------------- recharge */}
      {!frozen && (
        <Card>
          <CardHeader>
            <CardTitle>Add money</CardTitle>
            <CardDescription>
              Pay by UPI, card or netbanking. Your coins arrive as soon as the payment is
              confirmed.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-5">
            {options && !options.enabled ? (
              <Alert tone="warning">
                Payments are not switched on yet. Please try again later.
              </Alert>
            ) : (
              <>
                {options && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-surface-muted/50 px-3.5 py-2.5 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Coins className="size-4 text-gold-600" />
                      ₹1 ={" "}
                      <strong className="text-brand-700 dark:text-brand-700">
                        {options.coins_per_rupee} {coinWord(options.coins_per_rupee)}
                      </strong>
                    </span>
                    <span className="text-muted-foreground">
                      Minimum {formatPaise(options.min_paise)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {options?.packs.map((pack) => (
                    <button
                      key={pack.amount_paise}
                      type="button"
                      disabled={isBusy}
                      onClick={() => recharge(pack.amount_paise)}
                      className={cn(
                        "rounded-xl border border-border bg-surface px-4 py-3.5 text-center",
                        "transition-colors hover:border-brand-500/50 hover:bg-brand-100",
                        "disabled:cursor-not-allowed disabled:opacity-60",
                        "dark:hover:bg-brand-100",
                      )}
                    >
                      <span className="block text-base font-semibold">
                        {formatPaise(pack.amount_paise)}
                      </span>
                      <span className="mt-0.5 block text-xs text-brand-700 dark:text-brand-700">
                        {formatCoins(pack.coins)} {coinWord(pack.coins)}
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={rechargeCustom} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <Field
                    label="Or another amount"
                    error={customError ?? undefined}
                    hint={
                      options && custom && Number(custom) > 0
                        ? `${formatCoins(Math.floor(Number(custom)) * options.coins_per_rupee)} ${coinWord(options.coins_per_rupee)}`
                        : options
                          ? `Whole rupees, ${formatPaise(options.min_paise)} or more`
                          : "Whole rupees"
                    }
                    className="flex-1 min-w-0 sm:min-w-48"
                  >
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      placeholder="₹ amount"
                      value={custom}
                      invalid={Boolean(customError)}
                      onChange={(e) => setCustom(e.target.value)}
                      disabled={isBusy}
                    />
                  </Field>
                  <Button type="submit" disabled={isBusy} className="w-full sm:w-auto h-11 sm:h-10">
                    {isBusy && <Loader2 className="size-4 animate-spin" />}
                    {state === "verifying" ? "Confirming…" : "Add money"}
                  </Button>
                </form>

                {state === "pending" && (
                  <Alert tone="info">
                    We are confirming your payment. If money was debited, your balance will
                    update on its own — there is no need to pay again.
                  </Alert>
                )}
              </>
            )}
          </CardBody>
        </Card>
      )}

      {/* --------------------------------------------------------- history */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Every credit and debit on this wallet.</CardDescription>
        </CardHeader>

        {loadingHistory && !history ? (
          <CardBody>
            <LoadingBlock label="Loading transactions…" />
          </CardBody>
        ) : !history || history.items.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={WalletIcon}
              title="Nothing here yet"
              description="Add coins to your wallet and every credit and debit will show up here."
            />
          </CardBody>
        ) : (
          <>
            <ul>
              {history.items.map((txn) => (
                <TransactionRow key={txn.id} txn={txn} />
              ))}
            </ul>
            <CardBody>
              <Pagination meta={history.meta} onPage={setPage} />
            </CardBody>
          </>
        )}
      </Card>
    </div>
  );
}
