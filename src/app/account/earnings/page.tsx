"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  Flame,
  HelpCircle,
  IndianRupee,
  Info,
  Loader2,
  MessageCircle,
  Phone,
  QrCode,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  User,
  Video,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { LoadingBlock } from "@/components/ui";
import { earningsApi } from "@/lib/api";
import { cn, formatDateTime, timeAgo } from "@/lib/utils";
import { useAuth, useRequireAuth } from "@/providers/auth-provider";
import {
  formatEarning,
  type AstrologerEarningsBalance,
  type AstrologerPayoutRecord,
  type EarningRow,
  type EarningsSummary,
} from "@/types";

export default function AccountEarningsPage() {
  const { user } = useAuth();
  const { ready } = useRequireAuth();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = React.useState<"overview" | "history" | "payouts" | "settings">("overview");

  // Balance & Payouts State
  const [balance, setBalance] = React.useState<AstrologerEarningsBalance | null>(null);
  const [summary, setSummary] = React.useState<EarningsSummary | null>(null);
  const [payouts, setPayouts] = React.useState<AstrologerPayoutRecord[]>([]);
  const [earningsRows, setEarningsRows] = React.useState<EarningRow[]>([]);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [tableLoading, setTableLoading] = React.useState(false);

  // Search & Filter
  const [search, setSearch] = React.useState("");
  const [filterMode, setFilterMode] = React.useState("");

  // Modals
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = React.useState(false);
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [withdrawMethod, setWithdrawMethod] = React.useState<"bank_transfer" | "upi">("bank_transfer");
  const [submittingWithdraw, setSubmittingWithdraw] = React.useState(false);

  // Bank & UPI Settings Form
  const [bankForm, setBankForm] = React.useState({
    account_holder_name: "",
    account_number: "",
    confirm_account_number: "",
    ifsc: "",
    bank_name: "",
    upi_id: "",
    pan_card: "",
  });
  const [savingBank, setSavingBank] = React.useState(false);

  // QR Code Upload State
  const [uploadingQr, setUploadingQr] = React.useState(false);
  const [deletingQr, setDeletingQr] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Initial Load
  const fetchFinancials = React.useCallback(async () => {
    try {
      setLoading(true);
      const [balRes, sumRes, payoutsRes] = await Promise.all([
        earningsApi.balance(),
        earningsApi.summary().catch(() => null),
        earningsApi.myPayouts(50).catch(() => []),
      ]);

      const balData = (balRes as any)?.data || balRes;
      const sumData = (sumRes as any)?.data || sumRes;
      const payData = (payoutsRes as any)?.data || payoutsRes || [];

      setBalance(balData);
      setSummary(sumData);
      setPayouts(Array.isArray(payData) ? payData : []);

      // Populate banking form
      if (balData) {
        setBankForm((prev) => ({
          ...prev,
          account_holder_name: balData.account_holder_name || "",
          bank_name: balData.bank_name || "",
          ifsc: balData.ifsc || "",
          upi_id: balData.upi_id || "",
          pan_card: balData.pan_card || "",
        }));
        if (balData.upi_id && !balData.account_number_last4) {
          setWithdrawMethod("upi");
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load financial records.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaginatedLedger = React.useCallback(async () => {
    try {
      setTableLoading(true);
      const res = await earningsApi.paginated({
        page,
        limit: 10,
        mode: filterMode || undefined,
        search: search.trim() || undefined,
      });
      const data = (res as any)?.data || res;
      setEarningsRows(data.items || []);
      setTotalPages(data.meta?.total_pages || 1);
    } catch {
      // Fallback if no ledger items yet
      setEarningsRows([]);
    } finally {
      setTableLoading(false);
    }
  }, [page, filterMode, search]);

  React.useEffect(() => {
    if (ready) {
      fetchFinancials();
    }
  }, [ready, fetchFinancials]);

  React.useEffect(() => {
    if (ready) {
      fetchPaginatedLedger();
    }
  }, [ready, fetchPaginatedLedger]);

  // Request Payout Submission
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountFloat = parseFloat(withdrawAmount);
    if (isNaN(amountFloat) || amountFloat < 500) {
      toast.error("Minimum withdrawal amount is ₹500.");
      return;
    }
    const amountPaise = Math.round(amountFloat * 100);
    const availablePaise = balance?.withdrawable_balance_paise || 0;

    if (amountPaise > availablePaise) {
      toast.error(`Cannot withdraw more than available balance (₹${availablePaise / 100}).`);
      return;
    }

    if (withdrawMethod === "upi" && !balance?.upi_id && !balance?.upi_qr_url) {
      toast.error("Please add and save your UPI ID or QR code before requesting UPI payout.");
      return;
    }

    if (withdrawMethod === "bank_transfer" && !balance?.ifsc) {
      toast.error("Please fill and save your Bank Account Number & IFSC before requesting transfer.");
      return;
    }

    try {
      setSubmittingWithdraw(true);
      await earningsApi.requestPayout({
        amount_paise: amountPaise,
        payout_method: withdrawMethod,
      });
      toast.success(`Withdrawal request for ₹${amountFloat.toLocaleString()} submitted successfully!`);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      fetchFinancials();
    } catch (err: any) {
      toast.error(err?.message || "Could not submit withdrawal request.");
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  // Save Bank Details
  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bankForm.account_number && bankForm.account_number !== bankForm.confirm_account_number) {
      toast.error("Bank Account Number and confirmation do not match!");
      return;
    }

    try {
      setSavingBank(true);
      await earningsApi.updateBankDetails({
        account_holder_name: bankForm.account_holder_name || undefined,
        account_number: bankForm.account_number || undefined,
        ifsc: bankForm.ifsc || undefined,
        bank_name: bankForm.bank_name || undefined,
        upi_id: bankForm.upi_id || undefined,
        pan_card: bankForm.pan_card || undefined,
      });
      toast.success("Bank & UPI settlement coordinates updated securely!");
      fetchFinancials();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update banking coordinates.");
    } finally {
      setSavingBank(false);
    }
  };

  // Upload QR Code
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    try {
      setUploadingQr(true);
      const res = await earningsApi.uploadUpiQr(file);
      toast.success("UPI QR Code uploaded and linked to your payout profile!");
      fetchFinancials();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload UPI QR code.");
    } finally {
      setUploadingQr(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Delete QR Code
  const handleDeleteQr = async () => {
    if (!confirm("Are you sure you want to permanently delete your UPI QR code?")) return;

    try {
      setDeletingQr(true);
      await earningsApi.deleteUpiQr();
      toast.success("UPI QR code removed and storage purged.");
      fetchFinancials();
    } catch (err: any) {
      toast.error(err?.message || "Failed to remove UPI QR code.");
    } finally {
      setDeletingQr(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const isPurohit = (user?.role as string) === "purohit" || balance?.beneficiary_type === "purohit";
  const roleTitle = isPurohit ? "Vedic Purohit (Pandit Ji)" : "Vedic Astrologer Partner";

  if (!ready || loading) {
    return <LoadingBlock label="Fetching your real-time earnings ledger and bank coordinates..." />;
  }

  const withdrawableRupees = (balance?.withdrawable_balance_paise || 0) / 100;
  const pendingRupees = (balance?.total_pending_paise || 0) / 100;
  const totalEarnedRupees = (balance?.total_earned_paise || 0) / 100;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950/40 border border-amber-500/20 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 mb-2">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>{roleTitle} Treasury</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
              Earnings & Bank Payouts
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-xl">
              Track live consult & puja settlements, upload UPI QR for instant scans, and request direct bank disbursements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              disabled={withdrawableRupees < 500}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-transform active:scale-95 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Banknote className="size-4" />
              <span>Request Bank Payout</span>
            </button>
            <button
              onClick={() => fetchFinancials()}
              className="inline-flex size-9 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-800/60 text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
              title="Refresh ledger"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Available Balance */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-neutral-900/80 p-6 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Withdrawable Balance
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-400">
              <Wallet className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-3xl font-black text-white">
              ₹{withdrawableRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Min. withdrawal threshold: <strong className="text-neutral-300">₹500</strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Direct settlement to</span>
            <span className="font-semibold text-emerald-300">
              {balance?.payout_method === "upi" || balance?.upi_id ? "UPI / VPA" : "Bank Account"}
            </span>
          </div>
        </div>

        {/* Card 2: Pending Payouts */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-neutral-900/80 p-6 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              In-Transit Clearance
            </span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-400">
              <RefreshCw className="size-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-3xl font-black text-amber-200">
              ₹{pendingRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Under admin verification & bank dispatch
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Pending Requests</span>
            <span className="font-semibold text-amber-300 font-mono">
              {payouts.filter((p) => p.status === "pending" || p.status === "approved").length} active
            </span>
          </div>
        </div>

        {/* Card 3: Total Gross Earned */}
        <div className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <IndianRupee className="size-3.5 text-neutral-400" />
              Total Lifetime Earned
            </span>
            <div className="rounded-xl bg-neutral-800 p-2 text-neutral-300">
              <CheckCircle2 className="size-5 text-neutral-300" />
            </div>
          </div>
          <div className="mt-3">
            <div className="font-mono text-2xl sm:text-3xl font-black text-neutral-200">
              ₹{totalEarnedRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">
              Settled to your account:{" "}
              <strong className="text-emerald-400">
                ₹{((balance?.total_settled_paise || 0) / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </strong>
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
            <span className="text-neutral-400">Verification</span>
            <span className="font-semibold text-neutral-300">100% Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
        {[
          { id: "overview", label: "Overview & QR", icon: QrCode },
          { id: "history", label: isPurohit ? "Puja Earnings" : "Consultation Ledger", icon: IndianRupee },
          { id: "payouts", label: "Payout Tracking & UTR", icon: Banknote },
          { id: "settings", label: "Bank & UPI Settings", icon: Building },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer",
                active
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
              )}
            >
              <tab.icon className="size-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: OVERVIEW & UPI QR CODE MANAGEMENT ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: UPI QR Code Card */}
          <div className="lg:col-span-5 rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <QrCode className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-neutral-100">
                    Your UPI QR Code
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Enables Admin to scan & disburse instantly
                  </p>
                </div>
              </div>

              {balance?.upi_qr_url && (
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Active
                </span>
              )}
            </div>

            {/* QR Code Canvas / Preview */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center text-center">
              {balance?.upi_qr_url ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="relative p-3 bg-white rounded-2xl shadow-xl border border-amber-500/40">
                    <img
                      src={balance.upi_qr_url}
                      alt="Uploaded UPI QR Code"
                      className="size-48 object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-xs font-bold text-neutral-200">
                      {balance.account_holder_name || user?.full_name}
                    </p>
                    <p className="font-mono text-xs text-amber-300 font-semibold select-all mt-0.5">
                      {balance.upi_id || "Direct UPI QR"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 space-y-3 flex flex-col items-center">
                  <div className="size-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                    <QrCode className="size-8" />
                  </div>
                  <div>
                    <p className="font-serif text-xs font-bold text-neutral-300">
                      No UPI QR Code Uploaded
                    </p>
                    <p className="text-[11px] text-neutral-500 max-w-[240px] mt-1">
                      Upload your Google Pay, PhonePe, or Paytm QR code image for faster settlements.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions for QR Code */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleQrUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingQr}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {uploadingQr ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                <span>{balance?.upi_qr_url ? "Replace QR Image" : "Upload UPI QR"}</span>
              </button>

              {balance?.upi_qr_url && (
                <button
                  type="button"
                  onClick={handleDeleteQr}
                  disabled={deletingQr}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/20 px-3 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Permanently delete QR code from Cloudinary"
                >
                  {deletingQr ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                  <span>Delete</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-neutral-500 text-center">
              * Replacing or deleting cleans up previous Cloudinary assets permanently.
            </p>
          </div>

          {/* Right Column: Active Bank Coordinates Card */}
          <div className="lg:col-span-7 rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Building className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-neutral-100">
                    Linked Bank & Settlement Coordinates
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Verified destination for automated withdrawals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("settings")}
                className="text-xs font-semibold text-amber-400 hover:underline"
              >
                Edit Details →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-1">
                <span className="text-neutral-400">Account Holder:</span>
                <p className="font-serif font-bold text-neutral-200">
                  {balance?.account_holder_name || "Not Configured"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-1">
                <span className="text-neutral-400">Bank Name:</span>
                <p className="font-bold text-neutral-200">
                  {balance?.bank_name || "Not Specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-1">
                <span className="text-neutral-400">Account Number:</span>
                <p className="font-mono font-bold text-neutral-200 select-all">
                  {balance?.account_number_last4 ? `••••••••${balance.account_number_last4}` : "Not Added"}
                </p>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-1">
                <span className="text-neutral-400">IFSC Code:</span>
                <p className="font-mono font-bold text-amber-300 select-all">
                  {balance?.ifsc || "Not Added"}
                </p>
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">UPI ID (VPA):</span>
                  {balance?.upi_id && (
                    <button
                      onClick={() => copyToClipboard(balance.upi_id!, "UPI ID")}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="size-3" /> Copy
                    </button>
                  )}
                </div>
                <p className="font-mono font-bold text-emerald-300 select-all">
                  {balance?.upi_id || "No UPI ID set"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-200/90 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Payout requests are processed by Admin through direct NEFT/RTGS bank transfer or instantaneous UPI disbursement. Once settled, you will receive an official email confirmation with the unique bank UTR number.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: CONSULTATION / PUJA EARNINGS LEDGER ── */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-neutral-900 border border-neutral-800 p-4">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 size-4 text-neutral-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isPurohit ? "Search devotee or puja..." : "Search client name..."}
                className="h-9 w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/40"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="h-9 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="">All Services</option>
                <option value="chat">Chat Consultations</option>
                <option value="call">Voice Calls</option>
                <option value="video">Video Calls</option>
                <option value="appointment">Appointments & Pujas</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/90 shadow-xl">
            {tableLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="mx-auto size-6 animate-spin text-amber-500" />
                <p className="mt-2 text-xs text-neutral-400">Loading ledger records...</p>
              </div>
            ) : earningsRows.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-500">
                <IndianRupee className="mx-auto size-8 text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-400">No earnings recorded yet</p>
                <p className="text-[11px] mt-1">Earnings from completed consultations and sacred pujas will show here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/60 font-semibold uppercase tracking-wider text-[10px] text-neutral-400">
                      <th className="py-3.5 pl-6 pr-4">Service & Client</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 pr-6 pl-4 text-right">Earned Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {earningsRows.map((row) => (
                      <tr key={row.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-4 pl-6 pr-4">
                          <p className="font-bold text-neutral-200">
                            {row.user_name || "Blessed Devotee"}
                          </p>
                          <span className="text-[11px] text-amber-400/80 font-mono capitalize">
                            {row.mode === "appointment" ? "Vedic Offering" : `${row.mode} Consultation`}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-neutral-300">
                          {row.minutes} mins
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="block text-neutral-200">{formatDateTime(row.created_at)}</span>
                          <span className="text-[10px] text-neutral-500">{timeAgo(row.created_at)}</span>
                        </td>
                        <td className="py-4 pr-6 pl-4 text-right font-mono font-bold text-emerald-400 text-sm whitespace-nowrap">
                          +₹{(row.earning_paise / 100).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-800 p-4 text-xs">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-neutral-300 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-neutral-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-neutral-300 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: PAYOUT TRACKING & UTR DESK ── */}
      {activeTab === "payouts" && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/90 shadow-xl">
            {payouts.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-500">
                <Banknote className="mx-auto size-8 text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-400">No withdrawal requests yet</p>
                <p className="text-[11px] mt-1">Submit your first payout request once your balance reaches ₹500.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 bg-neutral-950/60 font-semibold uppercase tracking-wider text-[10px] text-neutral-400">
                      <th className="py-3.5 pl-6 pr-4">Request Date</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Channel</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 pr-6 pl-4">Bank UTR / Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    {payouts.map((p) => {
                      const isPending = p.status === "pending" || p.status === "approved";
                      const isSettled = p.status === "settled";
                      const isRejected = p.status === "rejected";

                      return (
                        <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="py-4 pl-6 pr-4 whitespace-nowrap">
                            <span className="block text-neutral-200 font-semibold">
                              {formatDateTime(p.requested_at)}
                            </span>
                            <span className="text-[10px] text-neutral-500">{timeAgo(p.requested_at)}</span>
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-sm text-neutral-100 whitespace-nowrap">
                            ₹{(p.net_payable_paise / 100).toFixed(2)}
                          </td>
                          <td className="py-4 px-4 capitalize font-semibold text-neutral-300">
                            {p.payout_method === "upi" ? "UPI VPA" : "Bank Transfer"}
                          </td>
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                isPending && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                                isSettled && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                                isRejected && "bg-red-500/10 text-red-400 border border-red-500/30"
                              )}
                            >
                              {isPending && <Clock className="size-3" />}
                              {isSettled && <CheckCircle2 className="size-3" />}
                              {isRejected && <X className="size-3" />}
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 pr-6 pl-4 whitespace-nowrap">
                            {p.utr_number ? (
                              <div className="flex items-center gap-1.5 font-mono text-emerald-300 font-bold select-all">
                                <span>{p.utr_number}</span>
                                <button
                                  onClick={() => copyToClipboard(p.utr_number!, "UTR")}
                                  className="text-neutral-400 hover:text-white"
                                >
                                  <Copy className="size-3" />
                                </button>
                              </div>
                            ) : isRejected ? (
                              <span className="text-[11px] text-red-400 font-semibold">
                                Reason: {p.rejection_reason || "Invalid coordinates"}
                              </span>
                            ) : (
                              <span className="text-[11px] text-neutral-500 italic">
                                Processing clearance...
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: BANK & UPI SETTINGS FORM ── */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveBankDetails} className="rounded-3xl border border-neutral-800 bg-neutral-900/90 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h3 className="font-serif text-base font-bold text-neutral-100">
                Bank & UPI Settlement Settings
              </h3>
              <p className="text-xs text-neutral-400">
                Update account details for administrative disbursements
              </p>
            </div>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300">
              256-Bit SSL Secured
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-300 block mb-1.5">
                Account Holder Full Name *
              </label>
              <input
                type="text"
                required
                value={bankForm.account_holder_name}
                onChange={(e) => setBankForm({ ...bankForm, account_holder_name: e.target.value })}
                placeholder="e.g. Acharya Rahul Sharma"
                className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1.5">
                Bank Name *
              </label>
              <input
                type="text"
                required
                value={bankForm.bank_name}
                onChange={(e) => setBankForm({ ...bankForm, bank_name: e.target.value })}
                placeholder="e.g. HDFC Bank, State Bank of India"
                className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1.5">
                Bank Account Number
              </label>
              <input
                type="password"
                value={bankForm.account_number}
                onChange={(e) => setBankForm({ ...bankForm, account_number: e.target.value })}
                placeholder="Enter complete account number"
                className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1.5">
                Confirm Bank Account Number
              </label>
              <input
                type="text"
                value={bankForm.confirm_account_number}
                onChange={(e) => setBankForm({ ...bankForm, confirm_account_number: e.target.value })}
                placeholder="Re-type account number to verify"
                className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1.5">
                IFSC Code *
              </label>
              <input
                type="text"
                required
                value={bankForm.ifsc}
                onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })}
                placeholder="e.g. HDFC0001234"
                className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 font-mono uppercase text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="font-semibold text-neutral-300 block mb-1.5">
                UPI ID / VPA (Optional)
              </label>
              <input
                type="text"
                value={bankForm.upi_id}
                onChange={(e) => setBankForm({ ...bankForm, upi_id: e.target.value })}
                placeholder="e.g. name@okaxis, yourname@upi"
                className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 font-mono text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="submit"
              disabled={savingBank}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {savingBank && <Loader2 className="size-4 animate-spin" />}
              <span>Save Settlement Coordinates</span>
            </button>
          </div>
        </form>
      )}

      {/* ── MODAL: REQUEST WITHDRAWAL ── */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsWithdrawModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Banknote className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-neutral-100">
                    Request Payout Withdrawal
                  </h3>
                  <p className="text-[11px] text-neutral-400">Disbursed directly to your account</p>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawModalOpen(false)}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-neutral-950 p-4 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Available Net Balance:</span>
              <span className="font-mono text-base font-black text-emerald-400">
                ₹{withdrawableRupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Withdrawal Amount (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-neutral-400">₹</span>
                  <input
                    type="number"
                    min="500"
                    max={withdrawableRupees}
                    step="1"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount (min ₹500)"
                    className="h-10 w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-8 pr-3 font-mono text-sm font-bold text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                {/* Quick Selection Chips */}
                <div className="flex items-center gap-1.5 mt-2">
                  {[500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={withdrawableRupees < amt}
                      onClick={() => setWithdrawAmount(amt.toString())}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] font-semibold text-neutral-300 hover:bg-neutral-800 disabled:opacity-30"
                    >
                      ₹{amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(Math.floor(withdrawableRupees).toString())}
                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20"
                  >
                    All (₹{Math.floor(withdrawableRupees)})
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                  Payout Method *
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod("bank_transfer")}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-3 border text-left cursor-pointer transition-all",
                      withdrawMethod === "bank_transfer"
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800/60"
                    )}
                  >
                    <Building className="size-4 shrink-0 text-amber-400" />
                    <div>
                      <p className="font-bold">Bank Transfer</p>
                      <span className="text-[10px] text-neutral-500 block truncate">
                        {balance?.account_number_last4 ? `••${balance.account_number_last4}` : "Via IFSC"}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithdrawMethod("upi")}
                    className={cn(
                      "flex items-center gap-2 rounded-xl p-3 border text-left cursor-pointer transition-all",
                      withdrawMethod === "upi"
                        ? "border-emerald-500 bg-emerald-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800/60"
                    )}
                  >
                    <QrCode className="size-4 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-bold">UPI / QR Code</p>
                      <span className="text-[10px] text-neutral-500 block truncate">
                        {balance?.upi_id ? balance.upi_id : balance?.upi_qr_url ? "Uploaded QR" : "Set in Settings"}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingWithdraw}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                >
                  {submittingWithdraw && <Loader2 className="size-4 animate-spin" />}
                  <span>Confirm Withdrawal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
