"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import {
  AlertCircle,
  ArrowRight,
  Coins,
  Gift,
  Lock,
  PlusCircle,
  Sparkles,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { FeaturePricingItem } from "@/types";

interface FeatureCoinBadgeProps {
  feature?: FeaturePricingItem;
  coins?: number;
  walletBalance?: number;
  language?: "bn" | "en" | "hi";
  className?: string;
  showWallet?: boolean;
}

export function FeatureCoinBadge({
  feature,
  coins: explicitCoins,
  walletBalance,
  language = "bn",
  className,
  showWallet = true,
}: FeatureCoinBadgeProps) {
  const { isSignedIn } = useAuth();
  const cost = explicitCoins !== undefined ? explicitCoins : feature ? feature.coins : 0;
  const isFree = cost <= 0;
  const isEnabled = feature ? feature.enabled !== false : true;

  if (!isEnabled) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 shadow-sm",
          className,
        )}
      >
        <AlertCircle className="size-3.5 text-rose-600" />
        <span>
          {language === "bn"
            ? "ফিচারটি বর্তমানে বন্ধ রয়েছে"
            : "Feature Currently Unavailable"}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-2",
        className,
      )}
    >
      {/* Price Pill */}
      {isFree ? (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm">
          <Gift className="size-3.5 text-emerald-600 animate-pulse" />
          <span>
            {language === "bn"
              ? "সম্পূর্ণ বিনামূল্যে"
              : language === "hi"
              ? "बिल्कुल मुफ्त"
              : "100% Free"}
          </span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-50 to-amber-100/70 px-3 py-1 text-xs font-bold text-amber-900 shadow-sm">
          <Coins className="size-3.5 text-amber-600" />
          <span>
            {cost}{" "}
            {language === "bn" ? "কয়েন প্রতি গণনা" : language === "hi" ? "कॉइन्स" : "Coins / use"}
          </span>
        </div>
      )}

      {/* User Wallet Balance Indicator if charged */}
      {!isFree && showWallet && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-foreground">
          <Wallet className="size-3 text-muted-foreground" />
          {isSignedIn ? (
            <span>
              {language === "bn" ? "ওয়ালেট" : "Wallet"}:{" "}
              <strong
                className={cn(
                  "font-bold",
                  (walletBalance ?? 0) >= cost
                    ? "text-emerald-700"
                    : "text-amber-700",
                )}
              >
                {walletBalance ?? 0}
              </strong>{" "}
              {language === "bn" ? "কয়েন" : "coins"}
            </span>
          ) : (
            <Link
              href={`/login?redirect=${typeof window !== "undefined" ? encodeURIComponent(window.location.pathname) : ""}`}
              className="text-primary hover:underline font-semibold"
            >
              {language === "bn" ? "লগইন করুন" : "Sign in"}
            </Link>
          )}

          {isSignedIn && (walletBalance ?? 0) < cost && (
            <Link
              href="/account/wallet"
              className="ml-1 inline-flex items-center gap-0.5 text-amber-800 hover:text-amber-950 font-bold underline text-[11px]"
            >
              <PlusCircle className="size-3" />
              {language === "bn" ? "রিচার্জ" : "Recharge"}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function FeatureDisabledAlert({
  featureName = "এই ফিচারটি",
  language = "bn",
}: {
  featureName?: string;
  language?: "bn" | "en" | "hi";
}) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-semibold">
            {language === "bn"
              ? "ফিচারটি সাময়িকভাবে বন্ধ আছে"
              : "Feature Temporarily Disabled"}
          </h4>
          <p className="text-xs text-rose-800 leading-relaxed">
            {language === "bn"
              ? `${featureName} অ্যাডমিন দ্বারা সাময়িকভাবে বন্ধ রাখা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।`
              : `${featureName} is temporarily turned off by administration. Please check back later.`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FeatureCoinModalProps {
  open: boolean;
  onClose: () => void;
  featureName: string;
  requiredCoins: number;
  walletBalance: number;
  reason?: "unauthorized" | "insufficient_coins" | "disabled";
  language?: "bn" | "en" | "hi";
}

export function FeatureCoinModal({
  open,
  onClose,
  featureName,
  requiredCoins,
  walletBalance,
  reason = "insufficient_coins",
  language = "bn",
}: FeatureCoinModalProps) {
  const router = useRouter();
  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

  const isAuth = reason === "unauthorized";
  const missing = Math.max(0, requiredCoins - walletBalance);

  const title = isAuth
    ? language === "bn"
      ? "লগইন প্রয়োজন"
      : "Sign In Required"
    : language === "bn"
    ? "পর্যাপ্ত কয়েন ব্যালেন্স নেই"
    : "Insufficient Coins";

  const handleSignIn = () => {
    onClose();
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
  };

  const handleRecharge = () => {
    onClose();
    router.push("/account/wallet");
  };

  return (
    <Modal open={open} onClose={onClose} title={title} size="md">
      <div className="space-y-5 py-2">
        {/* Header Visual Box */}
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-surface to-brand-50/60 p-5 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 shadow-sm">
            {isAuth ? <Lock className="size-6" /> : <Coins className="size-6" />}
          </div>
          <h3 className="mt-3 font-semibold text-foreground text-base">
            {featureName}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {language === "bn"
              ? `এই জ্যোতিষ গণনাটি করতে ${requiredCoins} কয়েন প্রয়োজন`
              : `Calculating this feature requires ${requiredCoins} coins`}
          </p>
        </div>

        {/* Balance Breakdown Table */}
        {!isAuth && (
          <div className="rounded-2xl border border-border bg-surface-muted/40 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{language === "bn" ? "প্রয়োজনীয় কয়েন" : "Coins Required"}:</span>
              <span className="font-bold text-foreground">{requiredCoins} coins</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span>{language === "bn" ? "আপনার বর্তমান ব্যালেন্স" : "Current Balance"}:</span>
              <span className="font-bold text-foreground">{walletBalance} coins</span>
            </div>
            <div className="h-px bg-border my-1" />
            <div className="flex justify-between items-center text-amber-900 font-semibold">
              <span>{language === "bn" ? "ঘাটতি কয়েন" : "Coins Needed"}:</span>
              <span className="font-extrabold text-amber-700 text-sm">+{missing} coins</span>
            </div>
          </div>
        )}

        {isAuth ? (
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {language === "bn"
              ? "ফলাফল দেখতে ও আপনার ওয়ালেট থেকে কয়েন ব্যবহার করতে লগইন করুন।"
              : "Sign in with your account to access your coin balance and unlock detailed Vedic charts."}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground leading-relaxed text-center">
            {language === "bn"
              ? "অল্প কিছু টাকায় আপনার ওয়ালেটে কয়েন রিচার্জ করে তাৎক্ষণিক পূর্ণাঙ্গ কুন্ডলী গণনা সম্পন্ন করুন।"
              : "Recharge your wallet instantly via UPI, Cards, or Netbanking to generate this reading."}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full text-xs"
            onClick={onClose}
          >
            {language === "bn" ? "পরে করবো" : "Cancel"}
          </Button>

          {isAuth ? (
            <Button
              type="button"
              className="flex-1 rounded-full text-xs font-semibold gap-1.5 shadow-glow"
              onClick={handleSignIn}
            >
              <Sparkles className="size-3.5" />
              {language === "bn" ? "লগইন করুন" : "Sign In Now"}
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1 rounded-full text-xs font-semibold gap-1.5 shadow-glow"
              onClick={handleRecharge}
            >
              <Coins className="size-3.5 text-amber-900" />
              {language === "bn" ? "ওয়ালেট রিচার্জ করুন" : "Recharge Wallet"}
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
