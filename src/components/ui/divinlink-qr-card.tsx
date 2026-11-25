"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Unified DivinLink QR Emblem / Scannable QR Code Badge.
 *
 * Matches the warm cream, stone-900, and amber-gold visual language used across
 * `/shop/products/[slug]` and verification certificates.
 * - When `value` is passed, renders a deterministic, high-contrast scannable SVG QR
 *   code (Error Correction Level H) with rounded finder eyes and a subtle center
 *   amber sparkle emblem.
 * - When `value` is omitted, renders the iconic DivinLink holographic QR seal mark.
 */
export function DivinLinkQrBadge({
  value,
  sizeClassName = "size-16",
  style,
  className,
  alt = "DivinLink Verification QR Code",
  spinSparkle = true,
}: {
  value?: string | null;
  sizeClassName?: string;
  style?: React.CSSProperties;
  className?: string;
  alt?: string;
  spinSparkle?: boolean;
}) {
  const qrMatrix = React.useMemo(() => {
    const clean = typeof value === "string" ? value.trim() : "";
    if (!clean) return null;
    try {
      const qr = QRCode.create(clean, { errorCorrectionLevel: "H" });
      return {
        size: qr.modules.size,
        data: qr.modules.data,
      };
    } catch {
      return null;
    }
  }, [value]);

  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-stone-200 p-1.5 shadow-2xs shrink-0 flex items-center justify-center relative overflow-hidden",
        sizeClassName,
        className,
      )}
      style={style}
      role="img"
      aria-label={alt}
    >
      {qrMatrix ? (
        <ScannableBrandedQrSvg size={qrMatrix.size} data={qrMatrix.data} />
      ) : (
        <div className="size-full bg-stone-900 rounded-sm p-1 flex flex-col justify-between">
          <div className="flex justify-between">
            <div className="size-3 bg-white rounded-xs flex items-center justify-center">
              <div className="size-1.5 bg-stone-900" />
            </div>
            <div className="size-3 bg-white rounded-xs flex items-center justify-center">
              <div className="size-1.5 bg-stone-900" />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Sparkles
              className={cn(
                "size-2.5 text-amber-300",
                spinSparkle && "animate-spin",
              )}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="size-3 bg-white rounded-xs flex items-center justify-center">
              <div className="size-1.5 bg-stone-900" />
            </div>
            <div className="size-1.5 bg-amber-400 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

function isFinderZone(row: number, col: number, size: number): boolean {
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= size - 7;
  const inBottomLeft = row >= size - 7 && col < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

function renderFinderEye(x: number, y: number, key: string) {
  return (
    <g key={key}>
      <rect x={x} y={y} width={7} height={7} rx={1.35} fill="#1d1a1c" />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.75} fill="#ffffff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.55} fill="#1d1a1c" />
    </g>
  );
}

function ScannableBrandedQrSvg({
  size,
  data,
}: {
  size: number;
  data: Uint8Array;
}) {
  const margin = 1.5;
  const viewSize = size + margin * 2;
  const center = size / 2;
  // Clear a very small center patch (~4.4x4.4 modules, <3% of total area vs 30% Level-H ECC).
  const cutoutHalf = Math.min(2.2, size * 0.085);

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinderZone(r, c, size)) continue;
      if (!data[r * size + c]) continue;

      const dx = c + 0.5 - center;
      const dy = r + 0.5 - center;
      if (Math.abs(dx) < cutoutHalf && Math.abs(dy) < cutoutHalf) continue;

      // Color the lower-right alignment center pixel warm bronze-amber (strong dark contrast)
      // to echo the signature amber accent dot in the DivinLink shop seal.
      const isAccentDot = r === size - 7 && c === size - 7;

      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c + margin + 0.04}
          y={r + margin + 0.04}
          width={0.92}
          height={0.92}
          rx={0.26}
          fill={isAccentDot ? "#b0610c" : "#1d1a1c"}
        />,
      );
    }
  }

  const badgeR = cutoutHalf + 0.35;

  return (
    <svg
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      className="size-full block"
      shapeRendering="geometricPrecision"
    >
      <rect x={0} y={0} width={viewSize} height={viewSize} fill="#ffffff" />
      {renderFinderEye(margin, margin, "tl")}
      {renderFinderEye(size - 7 + margin, margin, "tr")}
      {renderFinderEye(margin, size - 7 + margin, "bl")}
      {cells}
      {/* Center Amber Sparkle Emblem */}
      <rect
        x={viewSize / 2 - badgeR}
        y={viewSize / 2 - badgeR}
        width={badgeR * 2}
        height={badgeR * 2}
        rx={badgeR * 0.55}
        fill="#ffffff"
      />
      <path
        d={`M ${viewSize / 2} ${viewSize / 2 - cutoutHalf * 0.88} Q ${viewSize / 2 + cutoutHalf * 0.14} ${viewSize / 2 - cutoutHalf * 0.14} ${viewSize / 2 + cutoutHalf * 0.88} ${viewSize / 2} Q ${viewSize / 2 + cutoutHalf * 0.14} ${viewSize / 2 + cutoutHalf * 0.14} ${viewSize / 2} ${viewSize / 2 + cutoutHalf * 0.88} Q ${viewSize / 2 - cutoutHalf * 0.14} ${viewSize / 2 + cutoutHalf * 0.14} ${viewSize / 2 - cutoutHalf * 0.88} ${viewSize / 2} Q ${viewSize / 2 - cutoutHalf * 0.14} ${viewSize / 2 - cutoutHalf * 0.14} ${viewSize / 2} ${viewSize / 2 - cutoutHalf * 0.88} Z`}
        fill="#d97b0b"
      />
    </svg>
  );
}

export interface DivinLinkQrCardProps {
  title: string;
  badgeText?: string;
  description: string;
  metaText?: string;
  verificationUrl?: string | null;
  badgeSizeClassName?: string;
  action?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Standard DivinLink QR Authenticity & Verification Card.
 * Matches the exact visual design of the product authenticity card.
 */
export function DivinLinkQrCard({
  title,
  badgeText,
  description,
  metaText,
  verificationUrl,
  badgeSizeClassName = "size-16",
  action,
  className,
  style,
}: DivinLinkQrCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50/70 via-stone-50 to-white p-3.5 sm:p-4 shadow-xs",
        className,
      )}
      style={style}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        <DivinLinkQrBadge
          value={verificationUrl}
          sizeClassName={badgeSizeClassName}
          alt={title}
        />

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs sm:text-[13px] font-bold text-stone-900">
              {title}
            </span>
            {badgeText && (
              <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 whitespace-nowrap">
                ✓ {badgeText}
              </span>
            )}
          </div>
          <p className="text-[11px] sm:text-xs text-stone-600 leading-snug">
            {description}
          </p>
          {metaText && (
            <p className="text-[10px] font-mono text-amber-900 font-semibold truncate">
              {metaText}
            </p>
          )}
          {action && <div className="pt-0.5">{action}</div>}
        </div>
      </div>
    </div>
  );
}
