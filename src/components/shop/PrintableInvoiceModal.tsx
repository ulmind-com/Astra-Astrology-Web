"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Printer,
  Download,
  ExternalLink,
  X,
  FileText,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCw,
} from "lucide-react";

import { shopApi, type OrderInvoiceData } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";

interface PrintableInvoiceModalProps {
  orderKey: string;
  orderNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function PrintableInvoiceModal({
  orderKey,
  orderNumber,
  isOpen,
  onClose,
}: PrintableInvoiceModalProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const {
    data: invoice,
    isLoading,
    isError,
    refetch,
  } = useQuery<OrderInvoiceData>({
    queryKey: ["shop_order_invoice", orderKey],
    queryFn: () => shopApi.getOrderInvoice(orderKey),
    enabled: isOpen && !!orderKey,
    staleTime: 5 * 60 * 1000,
  });

  const printHtmlUrl = React.useMemo(() => {
    if (!orderKey) return "";
    return shopApi.getOrderInvoiceHtmlUrl(orderKey, true);
  }, [orderKey]);

  const handlePrint = () => {
    if (printHtmlUrl) {
      window.open(printHtmlUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5 overflow-y-auto backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-200 bg-stone-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileText className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>{isBn ? "অফিসিয়াল চালান ও ইনভয়েস" : "Official Invoice & Packing Slip"}</span>
                <span className="text-xs font-mono font-normal text-stone-500">#{orderNumber}</span>
              </h3>
              <p className="text-[11px] text-stone-500">
                {invoice?.invoice_mode || "Retail Invoice / Bill of Supply"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isLoading || isError}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>{isBn ? "প্রিন্ট / PDF ডাউনলোড" : "Print / Download PDF"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-stone-100 flex-1">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RotateCw className="size-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-stone-600">
                {isBn ? "ইনভয়েস ডাটা প্রস্তুত করা হচ্ছে..." : "Generating authentic invoice document..."}
              </p>
            </div>
          ) : isError || !invoice ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-xl p-6 border border-stone-200">
              <AlertCircle className="size-8 text-rose-500 mx-auto" />
              <p className="text-xs font-semibold text-stone-700">
                {isBn ? "ইনভয়েস লোড করতে সমস্যা হয়েছে।" : "Unable to retrieve invoice data."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold"
              >
                {isBn ? "পুনরায় চেষ্টা করুন" : "Retry"}
              </button>
            </div>
          ) : (
            /* Luxury Invoice Sheet Replicating Screenshot Exactly */
            <div className="bg-[#faf8f5] text-stone-800 rounded-xl border border-[#e8e2d2] p-6 sm:p-10 shadow-md max-w-2xl mx-auto space-y-8 font-sans">
              {/* Header: Sacred Lotus Emblem + INVOICE Serif Title */}
              <div className="flex items-start justify-between border-b border-[#e5dec9] pb-6">
                {/* Gold Sacred Lotus SVG Emblem */}
                <div className="flex items-center gap-3">
                  <svg
                    className="w-14 h-14 text-[#c59b27]"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M32 8 C32 20 22 28 22 38 C22 46 27 52 32 54 C37 52 42 46 42 38 C42 28 32 20 32 8 Z" fill="#c59b27" fillOpacity="0.12" />
                    <path d="M22 26 C16 29 10 37 12 45 C13 50 18 53 24 53 C27 49 27 43 25 36" />
                    <path d="M42 26 C48 29 54 37 52 45 C51 50 46 53 40 53 C37 49 37 43 39 36" />
                    <path d="M12 43 C6 44 4 50 8 54 C12 56 18 56 22 53" />
                    <path d="M52 43 C58 44 60 50 56 54 C52 56 46 56 42 53" />
                  </svg>
                  <div>
                    <h1 className="text-base font-serif tracking-wide text-stone-900 font-bold uppercase">
                      {invoice.seller.trade_name || "DivinLink"}
                    </h1>
                    <p className="text-[10px] tracking-widest uppercase text-[#9e7a20] font-semibold">
                      Vedic Sanatan Seva
                    </p>
                  </div>
                </div>

                {/* INVOICE Right Serif Heading */}
                <div className="text-right">
                  <h2 className="text-2xl sm:text-3xl font-serif tracking-wider text-stone-900 font-semibold uppercase">
                    INVOICE
                  </h2>
                  <p className="text-[10px] tracking-wider uppercase text-stone-500 font-medium">
                    {invoice.invoice_mode}
                  </p>
                </div>
              </div>

              {/* Billed To & Invoice Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                {/* Left: BILLED TO */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold tracking-wider text-stone-900 uppercase">
                    BILLED TO:
                  </div>
                  <div className="font-semibold text-stone-900 text-sm">{invoice.buyer.name}</div>
                  <div className="text-stone-600 leading-relaxed text-xs">
                    {invoice.buyer.address}
                    <br />
                    {invoice.buyer.city}, {invoice.buyer.state} - {invoice.buyer.pincode}
                  </div>
                  <div className="text-stone-500 text-[11px]">Phone: {invoice.buyer.phone}</div>
                  {invoice.buyer.gotra && (
                    <div className="text-[#9e7a20] text-[11px] font-medium pt-0.5">
                      Gotra: {invoice.buyer.gotra}
                    </div>
                  )}
                  {invoice.buyer.sankalpa && (
                    <div className="text-stone-500 text-[11px] italic">
                      Sankalpa: "{invoice.buyer.sankalpa}"
                    </div>
                  )}
                </div>

                {/* Right: Invoice Metadata */}
                <div className="space-y-1.5 sm:text-right">
                  <div>
                    <span className="text-stone-500 text-[11px]">Invoice No. </span>
                    <span className="font-bold text-stone-900 font-mono">{invoice.invoice_number}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px]">Order ID: </span>
                    <span className="font-bold text-stone-800 font-mono">#{invoice.order_id}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px]">Invoice Date: </span>
                    <span className="font-semibold text-stone-800">{invoice.invoice_date}</span>
                  </div>
                  <div className="pt-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Payment: {invoice.payment_method === "razorpay" ? "Prepaid Online" : "Cash on Delivery"} • {invoice.payment_status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-stone-900 text-stone-900 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-2.5 pr-2">Item</th>
                      <th className="py-2.5 px-3 text-center">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 pl-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ece5d5]">
                    {invoice.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30">
                        <td className="py-3 pr-2">
                          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                            {item.is_free_gift && <span>🎁</span>}
                            <span>{item.title}</span>
                          </div>
                          {item.energization && (
                            <div className="text-[10px] text-[#9e7a20] font-medium">
                              ✨ {item.energization}
                            </div>
                          )}
                          {item.sku && (
                            <div className="text-[9px] font-mono text-stone-400">
                              SKU: {item.sku}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center font-medium text-stone-700">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-stone-700">
                          {item.is_free_gift ? (
                            <span className="text-emerald-700 font-semibold">₹0</span>
                          ) : (
                            formatINR(item.unit_price)
                          )}
                        </td>
                        <td className="py-3 pl-3 text-right font-semibold text-stone-900">
                          {item.is_free_gift ? (
                            <span className="text-emerald-700 font-bold">Free</span>
                          ) : (
                            formatINR(item.total_price)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Subtotal, Tax and Grand Total */}
              <div className="flex justify-end pt-2 border-t border-[#e5dec9]">
                <div className="w-full sm:w-64 space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between py-0.5">
                    <span className="text-stone-500 font-medium">Subtotal</span>
                    <span className="font-semibold text-stone-900">{formatINR(invoice.subtotal)}</span>
                  </div>

                  {invoice.discount_amount > 0 && (
                    <div className="flex justify-between py-0.5 text-emerald-800 font-medium">
                      <span>Vedic Coupon Discount</span>
                      <span>-{formatINR(invoice.discount_amount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-0.5">
                    <span className="text-stone-500 font-medium">Express Insured Cargo</span>
                    <span className="font-semibold text-stone-900">
                      {invoice.shipping_fee > 0 ? formatINR(invoice.shipping_fee) : "₹0 (Free)"}
                    </span>
                  </div>

                  <div className="flex justify-between py-0.5 border-t border-[#ece5d5]">
                    <span className="text-stone-500 font-medium">
                      {invoice.tax_label}
                    </span>
                    <span className="font-semibold text-stone-900">
                      {invoice.tax_amount > 0 ? formatINR(invoice.tax_amount) : "₹0"}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t-2 border-stone-900 text-base font-extrabold text-stone-900">
                    <span className="tracking-wide">Total</span>
                    <span className="font-serif">{formatINR(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Thank you Blessing Section */}
              <div className="pt-4 border-t border-[#e5dec9] space-y-1">
                <h3 className="font-serif text-lg font-bold text-stone-900">Thank you!</h3>
                <p className="text-xs text-stone-600 leading-relaxed max-w-lg">
                  {invoice.blessing_note}
                </p>
              </div>

              {/* Bottom Footer: PAYMENT INFORMATION & SOLD BY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-[#e5dec9] text-[11px] text-stone-600">
                <div className="space-y-1">
                  <div className="font-bold text-stone-900 uppercase tracking-wider text-[10px]">
                    PAYMENT INFORMATION
                  </div>
                  <div>Payment Method: {invoice.payment_method === "razorpay" ? "Online Razorpay / UPI / Card" : "Cash on Delivery"}</div>
                  <div>Payment Status: {invoice.payment_status.toUpperCase()}</div>
                  <div className="text-[10px] text-stone-500 pt-1">
                    {invoice.seller.is_gst_registered
                      ? `GSTIN: ${invoice.seller.gstin} | State Code: ${invoice.seller.state_code}`
                      : "Operating under Statutory Exemption (Sec 22/24 CGST Act, 0% Tax)"}
                  </div>
                </div>

                <div className="sm:text-right space-y-1">
                  <div className="font-serif font-bold text-sm text-stone-900">
                    {invoice.seller.trade_name || "DivinLink"}
                  </div>
                  <div className="text-stone-600 leading-tight">
                    {invoice.seller.address}
                  </div>
                  <div className="text-stone-500 text-[10px]">
                    Dispatch State: {invoice.seller.state} ({invoice.seller.state_code})
                  </div>
                  <div className="text-stone-500 text-[10px]">
                    {invoice.seller.phone} • {invoice.seller.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-5 py-3 border-t border-stone-200 bg-white flex items-center justify-between shrink-0">
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            A4 Standard Printable Packing Slip & Tax/Retail Invoice
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isLoading || isError}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="size-4 text-amber-400" />
              <span>{isBn ? "প্রিন্ট করুন" : "Print Invoice"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
            >
              {isBn ? "বন্ধ করুন" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
