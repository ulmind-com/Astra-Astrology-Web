"use client";

import * as React from "react";
import Image from "next/image";
import {
  Coins,
  Flame,
  Maximize2,
  Minimize2,
  Move,
  Search,
  Share2,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export interface GalleryItem {
  url: string;
  tag_bn: string;
  tag_en: string;
  description_bn?: string;
  description_en?: string;
}

interface SacredImageGalleryProps {
  title: string;
  images: string[];
  featuredImage?: string;
  discountPercent?: number;
  cashbackPercent?: number;
  isEnergized?: boolean;
  freeGiftBadge?: string;
  onShare?: () => void;
}

export function SacredImageGallery({
  title,
  images,
  featuredImage,
  discountPercent = 0,
  cashbackPercent = 100,
  isEnergized = true,
  freeGiftBadge,
  onShare,
}: SacredImageGalleryProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // Build unified tagged gallery items
  const galleryItems = React.useMemo<GalleryItem[]>(() => {
    const rawList: string[] = [];
    if (featuredImage && !rawList.includes(featuredImage)) rawList.push(featuredImage);
    if (images && Array.isArray(images)) {
      images.forEach((img) => {
        if (img && !rawList.includes(img)) rawList.push(img);
      });
    }

    if (rawList.length === 0) return [];

    const defaultTags = [
      { bn: "প্রধান দর্শন", en: "Sacred Specimen" },
      { bn: "প্রাকৃতিক খাঁজ ও মুখ", en: "Natural Clefts & Texture" },
      { bn: "ল্যাব সিলমোহর", en: "Lab Certificate" },
      { bn: "ফ্রি সেলিনাইট প্লেট", en: "Free Selenite Plate" },
      { bn: "পবিত্র উপহার বক্স", en: "Sacred Gift Box" },
    ];

    return rawList.map((url, idx) => {
      const lower = url.toLowerCase();
      let tag = defaultTags[idx % defaultTags.length];

      if (lower.includes("cert") || lower.includes("lab")) {
        tag = { bn: "ল্যাব সিলমোহর", en: "Lab Certificate" };
      } else if (lower.includes("selenite") || lower.includes("gift") || lower.includes("plate")) {
        tag = { bn: "ফ্রি সেলিনাইট প্লেট", en: "Free Selenite Plate" };
      } else if (lower.includes("box") || lower.includes("package")) {
        tag = { bn: "পবিত্র উপহার বক্স", en: "Sacred Gift Box" };
      }

      return {
        url,
        tag_bn: tag.bn,
        tag_en: tag.en,
      };
    });
  }, [featuredImage, images]);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);
  const activeItem = galleryItems[activeIndex] || galleryItems[0];
  const activeUrl = activeItem?.url || "";

  // ---------------------------------------------------------------------------
  // Optical Loupe Magnifier State
  // ---------------------------------------------------------------------------
  const [isHovering, setIsHovering] = React.useState(false);
  const [loupePos, setLoupePos] = React.useState({ x: 50, y: 50 }); // percentage 0-100
  const [cursorPixelPos, setCursorPixelPos] = React.useState({ x: 0, y: 0 }); // viewport px
  const [isMobileInspectActive, setIsMobileInspectActive] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const ZOOM_LEVEL = 2.8;
  const LOUPE_SIZE = 148; // px diameter

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const relX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const relY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    setLoupePos({
      x: relX * 100,
      y: relY * 100,
    });

    setCursorPixelPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      setIsHovering(true);
      handlePointerMove(e);
    }
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
  };

  // ---------------------------------------------------------------------------
  // Fullscreen Darkroom Lightbox State
  // ---------------------------------------------------------------------------
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxZoom, setLightboxZoom] = React.useState(1);

  const resetLightboxZoom = () => setLightboxZoom(1);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % galleryItems.length);
        resetLightboxZoom();
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);
        resetLightboxZoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, galleryItems.length]);

  return (
    <div className="w-full space-y-4 select-none">
      {/* =================================================================== */}
      {/* PRIMARY IMAGE CONTAINER WITH GOLDEN HOLOGRAPHIC SHIMMER BORDER */}
      {/* =================================================================== */}
      <div className="relative group/gallery">
        {/* Ambient Vedic Aura Glow Behind Container */}
        <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-amber-500/25 via-yellow-400/30 to-amber-600/20 blur-xl opacity-75 group-hover/gallery:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Main Viewport Card */}
        <div
          ref={containerRef}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className={`relative aspect-square w-full rounded-[2rem] overflow-hidden bg-gradient-to-b from-[#211915] via-[#1a1310] to-[#120d0b] border-2 border-amber-400/60 shadow-[0_10px_35px_-8px_rgba(245,158,11,0.22)] transition-all duration-300 ${
            isHovering || isMobileInspectActive ? "cursor-crosshair" : "cursor-default"
          }`}
          style={{
            touchAction: isMobileInspectActive ? "none" : "auto",
          }}
        >
          {/* Subtle Golden Shimmer Running Line across Border */}
          <div className="absolute inset-0 rounded-[2rem] pointer-events-none border border-yellow-200/40 z-20" />

          {/* Consecrated Vedic Corner Brackets (Sacred Frame Ornaments) */}
          <div className="absolute top-2.5 left-2.5 size-4 border-t-2 border-l-2 border-amber-300/80 z-20 pointer-events-none rounded-tl-sm" />
          <div className="absolute top-2.5 right-2.5 size-4 border-t-2 border-r-2 border-amber-300/80 z-20 pointer-events-none rounded-tr-sm" />
          <div className="absolute bottom-2.5 left-2.5 size-4 border-b-2 border-l-2 border-amber-300/80 z-20 pointer-events-none rounded-bl-sm" />
          <div className="absolute bottom-2.5 right-2.5 size-4 border-b-2 border-r-2 border-amber-300/80 z-20 pointer-events-none rounded-br-sm" />

          {/* Background Radial Light Effect simulating warm temple lamp */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.15)_0%,rgba(0,0,0,0.6)_80%)] pointer-events-none z-1" />

          {/* Base Product Image */}
          {activeUrl ? (
            <Image
              src={activeUrl}
              alt={`${title} - ${isBn ? activeItem?.tag_bn : activeItem?.tag_en}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out z-2"
              unoptimized
            />
          ) : (
            <div className="size-full flex items-center justify-center text-amber-500/40 z-2">
              <Sparkles className="size-16 animate-pulse" />
            </div>
          )}

          {/* =============================================================== */}
          {/* OPTICAL MICROSCOPIC LOUPE (High-Definition Texture Magnifier) */}
          {/* =============================================================== */}
          {(isHovering || isMobileInspectActive) && activeUrl && (
            <div
              className="absolute pointer-events-none rounded-full z-30 shadow-[0_0_25px_rgba(0,0,0,0.7),0_0_0_3px_#f59e0b,0_0_12px_#fbbf24] transition-opacity duration-150 animate-in fade-in"
              style={{
                width: `${LOUPE_SIZE}px`,
                height: `${LOUPE_SIZE}px`,
                left: `${cursorPixelPos.x - LOUPE_SIZE / 2}px`,
                top: `${cursorPixelPos.y - LOUPE_SIZE / 2}px`,
                backgroundImage: `url(${activeUrl})`,
                backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                backgroundSize: `${ZOOM_LEVEL * 100}%`,
                backgroundRepeat: "no-repeat",
                backgroundColor: "#1c140e",
              }}
            >
              {/* Loupe Metallic Brass Bezel & Glass Reflection Sheen */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-200/80 pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />

              {/* Center Crosshair Aim */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                <div className="size-3 border border-amber-300 rounded-full" />
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* FLOATING TOP & BOTTOM SMART BADGES */}
          {/* =============================================================== */}
          {/* Top Left Spiritual Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start z-20 pointer-events-none">
            {discountPercent > 0 && (
              <span className="bg-gradient-to-r from-rose-600 to-rose-700 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider border border-rose-400/30">
                {discountPercent}% OFF
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-800 to-emerald-700 text-emerald-100 text-[10px] font-black px-2.5 py-1 rounded-md shadow-md border border-emerald-500/30">
              <Coins className="size-3 text-amber-300" />
              <span>{cashbackPercent}% Cashback</span>
            </span>
            {isEnergized && (
              <span className="inline-flex items-center gap-1 bg-amber-950/90 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md backdrop-blur-md border border-amber-500/40">
                <Flame className="size-3 text-amber-400 fill-current animate-pulse" />
                <span>{isBn ? "কাশী প্রাণ-প্রতিষ্ঠিত" : "Kashi Consecrated"}</span>
              </span>
            )}
          </div>

          {/* Top Right Actions (Share + Fullscreen Lightbox) */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-20">
            {/* Fullscreen Expand Button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="Expand view in high definition"
              title={isBn ? "পূর্ণ স্ক্রিনে দেখুন" : "View Fullscreen"}
              className="size-9 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-200 hover:text-white hover:bg-stone-900 hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
            >
              <Maximize2 className="size-4" />
            </button>

            {/* Share Button */}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                aria-label="Share product"
                title={isBn ? "শেয়ার করুন" : "Share"}
                className="size-9 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-400/40 flex items-center justify-center text-amber-200 hover:text-white hover:bg-stone-900 hover:scale-105 active:scale-95 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="size-4" />
              </button>
            )}
          </div>

          {/* Bottom Active Angle Tag Overlay */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/85 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-amber-300 border border-amber-500/40 shadow-lg">
              <span className="size-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>{isBn ? activeItem?.tag_bn : activeItem?.tag_en}</span>
            </span>

            {/* Microscopic Loupe Status Pill (Desktop Hint) */}
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-stone-950/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-stone-300 border border-stone-700/50">
              <Search className="size-2.5 text-amber-400" />
              <span>{isBn ? "হোভার করে ফাইবার ও খাঁজ জুম করুন (2.8x)" : "Hover to inspect texture (2.8x)"}</span>
            </span>
          </div>
        </div>

        {/* Mobile-Only Touch-To-Inspect Toggle Button */}
        <div className="sm:hidden flex items-center justify-between px-1 pt-1">
          <button
            type="button"
            onClick={() => setIsMobileInspectActive((v) => !v)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
              isMobileInspectActive
                ? "bg-amber-600 text-white border-amber-700 shadow-sm"
                : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
            }`}
          >
            <Search className="size-3.5 text-amber-500" />
            <span>
              {isMobileInspectActive
                ? isBn
                  ? "✓ মাইক্রোস্কোপিক জুম চালু (স্পর্শ করুন)"
                  : "✓ Loupe Active (Drag to Inspect)"
                : isBn
                ? "🔍 স্পর্শ করে ফাইবার জুম দেখুন"
                : "🔍 Tap to Inspect Texture"}
            </span>
          </button>
          <span className="text-[10px] text-stone-400 font-medium">
            {activeIndex + 1} / {galleryItems.length}
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MULTI-ANGLE THUMBNAIL STRIP WITH DYNAMIC SMART TAGS */}
      {/* =================================================================== */}
      {galleryItems.length > 1 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1 px-1">
            <Sparkles className="size-3 text-amber-600" />
            <span>{isBn ? "বিভিন্ন কোণ থেকে পবিত্র দর্শন" : "Multi-Angle Sacred Perspectives"}</span>
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
            {galleryItems.map((item, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsMobileInspectActive(false);
                  }}
                  className={`group/thumb relative rounded-2xl overflow-hidden p-1 border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                    isSelected
                      ? "border-amber-600 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/30"
                      : "border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Thumbnail Image Viewport */}
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
                    <Image
                      src={item.url}
                      alt={isBn ? item.tag_bn : item.tag_en}
                      fill
                      sizes="90px"
                      className="object-cover group-hover/thumb:scale-106 transition-transform duration-300"
                      unoptimized
                    />

                    {/* Active Selected Glow Dot */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 shadow-xs ring-2 ring-white" />
                    )}
                  </div>

                  {/* Micro-Angle Tag Pill */}
                  <div className="pt-1.5 px-0.5 text-center">
                    <p
                      className={`text-[10px] font-bold truncate leading-tight transition-colors ${
                        isSelected ? "text-amber-900 font-black" : "text-stone-600 group-hover/thumb:text-stone-900"
                      }`}
                    >
                      {isBn ? item.tag_bn : item.tag_en}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* FULLSCREEN DARKROOM LIGHTBOX INSPECTION MODAL */}
      {/* =================================================================== */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
          {/* Top Controls Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="space-y-0.5">
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-200 truncate max-w-xs sm:max-w-md">
                {title}
              </h4>
              <p className="text-xs text-stone-400 flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>{isBn ? activeItem?.tag_bn : activeItem?.tag_en}</span>
                <span>•</span>
                <span>{activeIndex + 1} / {galleryItems.length}</span>
              </p>
            </div>

            {/* Action Bar (Zoom Controls + Close) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.min(3, z + 0.3))}
                disabled={lightboxZoom >= 3}
                aria-label="Zoom in"
                className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxZoom((z) => Math.max(1, z - 0.3))}
                disabled={lightboxZoom <= 1}
                aria-label="Zoom out"
                className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer"
              >
                <ZoomOut className="size-4" />
              </button>
              {lightboxZoom > 1 && (
                <button
                  type="button"
                  onClick={resetLightboxZoom}
                  aria-label="Reset zoom"
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-bold text-amber-300 transition-colors cursor-pointer"
                >
                  Reset ({Math.round(lightboxZoom * 100)}%)
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false);
                  resetLightboxZoom();
                }}
                aria-label="Close fullscreen view"
                className="size-9 rounded-full bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer ml-2"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Main Stage Image */}
          <div className="relative size-full max-w-4xl max-h-[75vh] flex items-center justify-center overflow-hidden">
            {activeUrl && (
              <div
                className="relative size-full transition-transform duration-200"
                style={{
                  transform: `scale(${lightboxZoom})`,
                }}
              >
                <Image
                  src={activeUrl}
                  alt={title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Bottom Thumbnail Strip in Lightbox */}
          {galleryItems.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 overflow-x-auto py-2 z-20">
              {galleryItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    resetLightboxZoom();
                  }}
                  className={`relative size-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeIndex === idx
                      ? "border-amber-400 ring-2 ring-amber-400/50 scale-105"
                      : "border-stone-700 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.tag_en}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
