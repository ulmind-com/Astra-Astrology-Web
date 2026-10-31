"use client";

import * as React from "react";
import { Car, Landmark, ShieldAlert, CheckCircle2, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import { numerologyApi } from "@/lib/api";
import type { VehicleBankAuditResponse } from "@/types/numerology";
import type { AstrologyLanguage } from "@/types";
import { VEHICLE_BANK_I18N } from "@/lib/numerology-translations";

interface VehicleBankAuditProps {
  mulank?: number;
  bhagyank?: number;
  language?: AstrologyLanguage;
}

export function VehicleBankAuditSection({
  mulank = 1,
  bhagyank = 1,
  language = "bn",
}: VehicleBankAuditProps) {
  const t = VEHICLE_BANK_I18N[language] || VEHICLE_BANK_I18N.en;
  const [auditType, setAuditType] = React.useState<"vehicle" | "bank">("vehicle");
  const [inputString, setInputString] = React.useState("WB 02 AK 1234");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<VehicleBankAuditResponse | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputString.trim()) {
      toast.error(t.emptyInputError);
      return;
    }

    setLoading(true);
    try {
      const res = await numerologyApi.auditVehicleBank({
        input_string: inputString.trim(),
        audit_type: auditType,
        mulank,
        bhagyank,
      });
      if (res) {
        setResult(res);
        toast.success(t.successToast(auditType));
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to audit vehicle/bank number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Audit Form Card */}
      <div className="rounded-2xl border border-border/80 bg-surface p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-foreground flex items-center gap-2">
              {auditType === "vehicle" ? (
                <Car className="size-5 text-brand-600 dark:text-brand-400" />
              ) : (
                <Landmark className="size-5 text-brand-600 dark:text-brand-400" />
              )}
              {t.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-surface-muted/60 px-3 py-1.5 rounded-lg border border-border/60">
            <span className="text-muted-foreground">{t.mulank}</span>
            <span className="font-bold text-brand-600">{mulank}</span>
            <span className="text-muted-foreground ml-2">{t.bhagyank}</span>
            <span className="font-bold text-brand-600">{bhagyank}</span>
          </div>
        </div>

        {/* Audit Type Toggle */}
        <div className="flex p-1 bg-surface-muted/60 rounded-xl border border-border/70 max-w-sm">
          <button
            type="button"
            onClick={() => {
              setAuditType("vehicle");
              setInputString("WB 02 AK 1234");
              setResult(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              auditType === "vehicle"
                ? "bg-surface text-brand-600 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Car className="size-3.5" />
            {t.vehicleTab}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuditType("bank");
              setInputString("123456789012");
              setResult(null);
            }}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              auditType === "bank"
                ? "bg-surface text-brand-600 shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Landmark className="size-3.5" />
            {t.bankTab}
          </button>
        </div>

        <form onSubmit={handleAudit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
          <div className="sm:col-span-9 space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              {auditType === "vehicle" ? t.vehicleInputLabel : t.bankInputLabel}
            </label>
            <input
              type="text"
              value={inputString}
              onChange={(e) => setInputString(e.target.value)}
              placeholder={auditType === "vehicle" ? "e.g. DL 01 AB 1234 or WB 02 AK 9999" : "e.g. 123456789012"}
              className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-surface-muted/30 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="sm:col-span-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs"
            >
              <Sparkles className="size-4 mr-1.5" />
              {loading ? t.auditing : t.auditBtn}
            </Button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-xs space-y-2">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                {t.extractedTotal}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif font-black text-brand-600 dark:text-brand-400">
                  {result.single_digit}
                </span>
                <span className="text-xs font-mono font-bold text-muted-foreground">
                  {t.compoundLabel(result.compound_number)}
                </span>
              </div>
              <p className="text-[11px] font-mono text-muted-foreground truncate">
                {result.extracted_digits}
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface p-5 shadow-xs space-y-2 md:col-span-2">
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                {result.audit_type === "vehicle" ? t.vehicleRatingTitle : t.bankRatingTitle}
              </span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-brand-600" />
                <span className="text-base sm:text-lg font-bold text-foreground">
                  {result.safety_rating}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.compoundQuality} {result.compound_quality}
              </p>
            </div>
          </div>

          {/* Risk Alert Warning if present */}
          {result.risk_alert && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <ShieldAlert className="size-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-bold">{t.riskAlertTitle}</span>
                {result.risk_alert}
              </div>
            </div>
          )}

          {/* Remedial Guidance Card */}
          <div className="rounded-2xl border border-emerald-500/30 bg-surface p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {t.remedyTitle}
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {result.remedy_bn}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
