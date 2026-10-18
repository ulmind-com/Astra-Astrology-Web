"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Loader2,
  Snowflake,
  Wallet as WalletIcon,
} from "lucide-react";
import * as React from "react";

import {
  Alert,
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
  type WalletTransaction,
} from "@/types";

function TransactionRow({ txn }: { txn: WalletTransaction }) {
  const isCredit = txn.direction === "credit";
  return (
    <li className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-0">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full",
          isCredit ? "bg-success-surface text-success" : "bg-warning-surface text-warning",
        )}
      >
        {isCredit ? (
          <ArrowDownLeft className="size-4" />
        ) : (
          <ArrowUpRight className="size-4" />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {txn.note ?? TRANSACTION_REASON_LABELS[txn.reason]}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDateTime(txn.created_at)} · {TRANSACTION_REASON_LABELS[txn.reason]}
          {/* Only on rows where money actually changed hands. */}
          {txn.amount_paise != null && ` · paid ${formatPaise(txn.amount_paise)}`}
        </p>
      </div>

      <div className="text-right">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums",
            isCredit ? "text-success" : "text-foreground",
          )}
        >
          {isCredit ? "+" : "−"}
          {formatCoins(txn.amount_coins)}
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
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
      {/* --------------------------------------------------------- balance */}
      <Card className="overflow-hidden">
        <div className="bg-cosmos px-6 py-7 text-brand-950">
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <WalletIcon className="size-4" />
            Wallet balance
          </div>
          <p className="mt-2 text-4xl font-bold tabular-nums">
            {formatCoins(summary.wallet.balance_coins)}{" "}
            <span className="text-2xl font-semibold text-ink-600">
              {coinWord(summary.wallet.balance_coins)}
            </span>
          </p>
          {summary.wallet.last_transaction_at && (
            <p className="mt-1 text-xs text-ink-600">
              Last activity {formatDateTime(summary.wallet.last_transaction_at)}
            </p>
          )}
        </div>
      </Card>

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

                <form onSubmit={rechargeCustom} className="flex flex-wrap items-end gap-3">
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
                    className="flex-1 min-w-48"
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
                  <Button type="submit" disabled={isBusy}>
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
