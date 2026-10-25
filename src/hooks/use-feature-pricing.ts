"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";

import { astrologyApi } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useWallet, WALLET_KEY } from "@/hooks/use-wallet";
import type { FeaturePricingItem } from "@/types";

export const FEATURE_PRICING_KEY = ["features", "pricing"] as const;

export type AccessCheckResult = {
  allowed: boolean;
  reason?: "disabled" | "unauthorized" | "insufficient_coins";
  feature?: FeaturePricingItem;
  requiredCoins: number;
  balance: number;
  missingCoins: number;
};

export function useFeaturePricing() {
  const queryClient = useQueryClient();
  const { isSignedIn } = useAuth();
  const { data: walletSummary } = useWallet(isSignedIn);

  const {
    data: pricing,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: FEATURE_PRICING_KEY,
    queryFn: astrologyApi.featuresPricing,
    staleTime: 60 * 1000, // 1 minute fresh cache
  });

  const walletBalance = walletSummary?.wallet.balance_coins ?? 0;

  const getFeature = React.useCallback(
    (featureId: string): FeaturePricingItem | undefined => {
      return pricing ? pricing[featureId] : undefined;
    },
    [pricing],
  );

  const coins = React.useCallback(
    (featureId: string): number => {
      const feat = getFeature(featureId);
      return feat ? feat.coins : 0;
    },
    [getFeature],
  );

  const isFree = React.useCallback(
    (featureId: string): boolean => {
      const feat = getFeature(featureId);
      return !feat || feat.coins <= 0;
    },
    [getFeature],
  );

  const isEnabled = React.useCallback(
    (featureId: string): boolean => {
      const feat = getFeature(featureId);
      return feat ? feat.enabled !== false : true;
    },
    [getFeature],
  );

  const canAfford = React.useCallback(
    (featureId: string): boolean => {
      const feat = getFeature(featureId);
      if (!feat || feat.coins <= 0) return true;
      if (!isSignedIn) return false;
      return walletBalance >= feat.coins;
    },
    [getFeature, isSignedIn, walletBalance],
  );

  const checkAccess = React.useCallback(
    (featureId: string): AccessCheckResult => {
      const feat = getFeature(featureId);
      const required = feat ? feat.coins : 0;
      const enabled = feat ? feat.enabled !== false : true;

      if (!enabled) {
        return {
          allowed: false,
          reason: "disabled",
          feature: feat,
          requiredCoins: required,
          balance: walletBalance,
          missingCoins: 0,
        };
      }

      if (required <= 0) {
        return {
          allowed: true,
          feature: feat,
          requiredCoins: 0,
          balance: walletBalance,
          missingCoins: 0,
        };
      }

      if (!isSignedIn) {
        return {
          allowed: false,
          reason: "unauthorized",
          feature: feat,
          requiredCoins: required,
          balance: 0,
          missingCoins: required,
        };
      }

      if (walletBalance < required) {
        return {
          allowed: false,
          reason: "insufficient_coins",
          feature: feat,
          requiredCoins: required,
          balance: walletBalance,
          missingCoins: Math.max(0, required - walletBalance),
        };
      }

      return {
        allowed: true,
        feature: feat,
        requiredCoins: required,
        balance: walletBalance,
        missingCoins: 0,
      };
    },
    [getFeature, isSignedIn, walletBalance],
  );

  const refreshAll = React.useCallback(() => {
    void refetch();
    void queryClient.invalidateQueries({ queryKey: WALLET_KEY });
  }, [refetch, queryClient]);

  return {
    pricing,
    isLoading,
    walletBalance,
    getFeature,
    coins,
    isFree,
    isEnabled,
    canAfford,
    checkAccess,
    refresh: refreshAll,
  };
}
