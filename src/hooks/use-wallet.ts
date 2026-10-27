"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { toast } from "sonner";

import { walletApi } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import type { CreateOrderResponse, TransactionReason } from "@/types";

export const WALLET_KEY = ["wallet"] as const;
export const WALLET_TXNS_KEY = ["wallet", "transactions"] as const;

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayHandlerResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void; on: (e: string, cb: (x: unknown) => void) => void };

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

/** Loads Razorpay's script once and reuses it afterwards. */
function loadCheckout(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("checkout failed to load")));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("checkout failed to load"));
    document.body.appendChild(script);
  });
}

export function useWallet(enabled = true) {
  return useQuery({
    queryKey: WALLET_KEY,
    queryFn: walletApi.summary,
    enabled,
  });
}

export function useRechargeOptions() {
  return useQuery({
    queryKey: ["wallet", "recharge-options"],
    queryFn: walletApi.rechargeOptions,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTransactions(page: number, reason?: TransactionReason) {
  return useQuery({
    queryKey: [...WALLET_TXNS_KEY, page, reason ?? "all"],
    queryFn: () => walletApi.transactions({ page, limit: 20, reason }),
    placeholderData: (previous) => previous,
  });
}

type RechargeState = "idle" | "starting" | "checkout" | "verifying" | "pending";

/**
 * Runs a recharge end to end.
 *
 * The browser callback is the fast path, not the authority — if it never
 * arrives because the user's UPI app took over and the tab was dropped, the
 * webhook still credits the wallet. That is why a dismissed checkout reports
 * "pending" rather than "failed": the money may well be on its way.
 */
export function useRecharge() {
  const queryClient = useQueryClient();
  const [state, setState] = React.useState<RechargeState>("idle");

  const refresh = React.useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: WALLET_KEY });
    void queryClient.invalidateQueries({ queryKey: WALLET_TXNS_KEY });
  }, [queryClient]);

  const start = React.useCallback(
    async (amountPaise: number, profile: { name: string; email: string; contact?: string | null }) => {
      let order: CreateOrderResponse;
      setState("starting");
      try {
        await loadCheckout();
        order = await walletApi.createOrder(amountPaise);
      } catch (error) {
        setState("idle");
        toast.error(
          error instanceof ApiError ? error.message : "Could not reach the payment page.",
        );
        return;
      }

      if (!window.Razorpay) {
        setState("idle");
        toast.error("Could not load the payment window. Check your connection.");
        return;
      }

      setState("checkout");
      const checkout = new window.Razorpay({
        key: order.key_id,
        order_id: order.razorpay_order_id,
        amount: order.amount_paise,
        currency: order.currency,
        name: "DivinLink",
        description: "Wallet recharge",
        prefill: { name: profile.name, email: profile.email, contact: profile.contact ?? "" },
        theme: { color: "#7c3aed" },
        handler: async (response: RazorpayHandlerResponse) => {
          setState("verifying");
          try {
            const result = await walletApi.verify(response);
            refresh();
            setState("idle");
            toast.success(
              result.credited ? "Wallet recharged." : "This payment was already credited.",
            );
          } catch (error) {
            // The money may still land: the webhook confirms independently.
            setState("pending");
            refresh();
            toast.message("Payment received, confirming…", {
              description:
                error instanceof ApiError
                  ? error.message
                  : "Your balance will update in a moment.",
            });
          }
        },
        modal: {
          ondismiss: () => {
            setState("idle");
            // Deliberately not called a failure — a UPI payment can complete
            // after the window is closed, and the webhook will credit it.
            toast.message("Payment window closed.", {
              description: "If money was debited, your balance updates automatically.",
            });
            refresh();
          },
        },
      });

      checkout.on("payment.failed", () => {
        setState("idle");
        toast.error("The payment did not go through. Nothing was charged.");
      });

      checkout.open();
    },
    [refresh],
  );

  return { start, state, isBusy: state !== "idle" };
}
