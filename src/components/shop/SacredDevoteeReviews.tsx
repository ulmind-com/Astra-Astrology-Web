"use client";

import * as React from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Filter,
  Flame,
  Camera,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import {
  shopApi,
  type ShopProduct,
  type ProductReviewItem,
  type ProductReviewCreateInput,
} from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";

interface SacredDevoteeReviewsProps {
  product: ShopProduct;
}

const RATING_LABELS_BN: Record<number, string> = {
  1: "১/৫ - আশানুরূপ নয়",
  2: "২/৫ - মোটামুটি",
  3: "৩/৫ - সন্তোষজনক",
  4: "৪/৫ - অত্যন্ত ভালো ও ফলপ্রসূ",
  5: "৫/৫ - স্বর্গীয়, সিদ্ধ ও অলৌকিক অনুভূতি",
};

const RATING_LABELS_EN: Record<number, string> = {
  1: "1/5 - Below Expectations",
  2: "2/5 - Fair",
  3: "3/5 - Good",
  4: "4/5 - Very Good & Positive",
  5: "5/5 - Divine, Siddh & Highly Potent",
};

export function SacredDevoteeReviews({ product }: SacredDevoteeReviewsProps) {
  const { user, isSignedIn } = useAuth();
  const { language } = useLanguage();
  const isBn = language === "bn";
  const queryClient = useQueryClient();

  // Filters & Pagination State
  const [page, setPage] = React.useState<number>(1);
  const [ratingFilter, setRatingFilter] = React.useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = React.useState<string>("recent");

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [starRating, setStarRating] = React.useState<number>(5);
  const [hoverRating, setHoverRating] = React.useState<number>(0);
  const [headline, setHeadline] = React.useState<string>("");
  const [comment, setComment] = React.useState<string>("");
  const [images, setImages] = React.useState<string[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 1. Fetch Reviews & Rating Breakdown
  const { data: reviewData, isLoading, isFetching } = useQuery({
    queryKey: ["shop_product_reviews", product.slug, page, ratingFilter, sortBy],
    queryFn: async () => {
      return await shopApi.getProductReviews(product.slug, {
        page,
        limit: 8,
        rating: ratingFilter,
        sort: sortBy,
      });
    },
    enabled: Boolean(product.slug),
  });

  // 2. Fetch Review Eligibility for logged-in user
  const { data: eligibility, isLoading: eligLoading, refetch: refetchEligibility } = useQuery({
    queryKey: ["shop_review_eligibility", product.slug, user?.id],
    queryFn: async () => {
      if (!isSignedIn) return null;
      try {
        return await shopApi.checkReviewEligibility(product.slug);
      } catch {
        return null;
      }
    },
    enabled: Boolean(product.slug && isSignedIn),
  });

  const reviews = reviewData?.items || [];
  const totalReviews = reviewData?.total || 0;
  const avgRating = reviewData?.average_rating || product.average_rating || 5.0;
  const breakdown = reviewData?.breakdown;
  const totalPages = reviewData?.pages || 1;

  // Handle Submit Review Mutation
  const submitMutation = useMutation({
    mutationFn: async (payload: ProductReviewCreateInput) => {
      return await shopApi.submitProductReview(product.slug, payload);
    },
    onSuccess: () => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      toast.success(
        isBn
          ? "ধন্যবাদ! আপনার পবিত্র রিভিউ সফলভাবে প্রকাশিত হয়েছে।"
          : "Thank you! Your verified devotee review has been submitted."
      );
      setIsModalOpen(false);
      setHeadline("");
      setComment("");
      setImages([]);
      queryClient.invalidateQueries({ queryKey: ["shop_product_reviews", product.slug] });
      queryClient.invalidateQueries({ queryKey: ["shop_product_detail", product.slug] });
      refetchEligibility();
    },
    onError: (err: any) => {
      toast.error(err?.message || (isBn ? "রিভিউ জমা দেওয়া সম্ভব হয়নি।" : "Failed to submit review."));
    },
  });

  // Handle Photo Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length >= 3) {
      toast.error(isBn ? "সর্বোচ্চ ৩টি ছবি আপলোড করা যাবে।" : "Maximum 3 photos allowed.");
      return;
    }

    const file = files[0];
    if (file.size > 8 * 1024 * 1024) {
      toast.error(isBn ? "ছবির সাইজ ৮ মেগাবাইটের কম হতে হবে।" : "Photo size must be under 8MB.");
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const res = await shopApi.uploadReviewPhoto(file);
      setImages((prev) => [...prev, res.url]);
      toast.success(isBn ? "ছবি আপলোড সম্পন্ন হয়েছে।" : "Photo uploaded successfully.");
    } catch (err: any) {
      toast.error(err?.message || (isBn ? "ছবি আপলোড ব্যর্থ হয়েছে।" : "Failed to upload photo."));
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Helpful Upvote
  const handleHelpfulClick = async (reviewId: string) => {
    if (!isSignedIn) {
      toast.info(isBn ? "ভোট দিতে দয়া করে সাইন ইন করুন।" : "Please sign in to vote helpful.");
      return;
    }

    try {
      await shopApi.toggleReviewHelpful(reviewId);
      queryClient.invalidateQueries({ queryKey: ["shop_product_reviews", product.slug] });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update vote.");
    }
  };

  const handleOpenReviewModal = () => {
    if (!isSignedIn) {
      toast.info(
        isBn
          ? "রিভিউ লিখতে অনুগ্রহ করে আপনার একাউন্টে সাইন ইন করুন।"
          : "Please sign in to submit a review."
      );
      return;
    }

    if (eligibility?.already_reviewed) {
      toast.info(
        isBn
          ? "আপনি ইতিমধ্যে এই প্রতিকারের জন্য রিভিউ জমা দিয়েছেন।"
          : "You have already reviewed this product."
      );
      return;
    }

    if (!eligibility?.can_review) {
      toast.error(
        eligibility?.reason ||
          (isBn
            ? "শুধুমাত্র যে সকল ভক্তদের কাছে এই প্রতিকারটি সফলভাবে ডেলিভারি হয়েছে, কেবল তারাই রিভিউ দিতে পারেন।"
            : "Only verified buyers with a delivered order can review this remedy.")
      );
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || comment.trim().length < 5) {
      toast.error(
        isBn ? "অনুগ্রহ করে অন্তত ৫ অক্ষরের রিভিউ লিখুন।" : "Please write a review of at least 5 characters."
      );
      return;
    }

    submitMutation.mutate({
      rating: starRating,
      title: headline.trim() || undefined,
      comment: comment.trim(),
      images,
    });
  };

  return (
    <section id="devotee-reviews" className="space-y-6 pt-4">
      {/* =================================================================== */}
      {/* 1. Header with Temple Aesthetics */}
      {/* =================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-900/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-500 animate-ping" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <span>{isBn ? "ভক্তদের দিব্য অভিজ্ঞতা ও রেটিং" : "Sacred Devotee Blessings & Reviews"}</span>
            </h3>
          </div>
          <p className="text-xs text-stone-500 pt-0.5">
            {isBn
              ? "কাশীর পণ্ডিতদের দ্বারা সিদ্ধ প্রতিকার ধারণের পর ভক্তদের প্রত্যক্ষ অনুভূতি ও সত্য প্রমাণ"
              : "Genuine testimonials from devotees whose consecrated orders have been successfully delivered"}
          </p>
        </div>

        {/* Write Review CTA Button */}
        <div>
          <button
            type="button"
            onClick={handleOpenReviewModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-600 to-amber-700 px-5 py-2.5 text-xs font-bold text-white hover:from-amber-700 hover:to-amber-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <Star className="size-4 fill-amber-300 text-amber-300" />
            <span>{isBn ? "আপনার রিভিউ লিখুন" : "Write a Devotee Review"}</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. Rating Summary & Progress Breakdown Card */}
      {/* =================================================================== */}
      <div className="rounded-3xl border border-amber-200/80 bg-linear-to-br from-amber-50/60 via-white to-amber-50/40 p-5 sm:p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Big Score Display */}
          <div className="md:col-span-4 text-center md:text-left space-y-1.5 md:border-r border-amber-900/10 md:pr-6">
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="font-cinzel text-4xl sm:text-5xl font-black text-amber-950">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-stone-400 text-lg font-bold">/ 5.0</span>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center md:justify-start gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`size-4 ${
                    s <= Math.round(avgRating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-stone-200 fill-stone-100"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs font-bold text-stone-700 pt-0.5">
              {totalReviews > 0
                ? isBn
                  ? `মোট ${totalReviews} জন যাচাইকৃত ভক্তের রেটিং`
                  : `Based on ${totalReviews} verified devotee review${totalReviews > 1 ? "s" : ""}`
                : isBn
                ? "এখনও কোনো রিভিউ যুক্ত হয়নি"
                : "No customer reviews yet"}
            </p>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>{isBn ? "১০০% যাচাইকৃত ক্রেতা গ্যারান্টি" : "100% Verified Buyer Guarantee"}</span>
            </div>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((r) => {
              const count =
                r === 5
                  ? breakdown?.stars_5 || 0
                  : r === 4
                  ? breakdown?.stars_4 || 0
                  : r === 3
                  ? breakdown?.stars_3 || 0
                  : r === 2
                  ? breakdown?.stars_2 || 0
                  : breakdown?.stars_1 || 0;

              const pct =
                r === 5
                  ? breakdown?.stars_5_pct || 0
                  : r === 4
                  ? breakdown?.stars_4_pct || 0
                  : r === 3
                  ? breakdown?.stars_3_pct || 0
                  : r === 2
                  ? breakdown?.stars_2_pct || 0
                  : breakdown?.stars_1_pct || 0;

              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRatingFilter(ratingFilter === r ? undefined : r);
                    setPage(1);
                  }}
                  className={`w-full flex items-center gap-3 text-xs group text-left cursor-pointer rounded-lg p-1 -m-1 transition-colors ${
                    ratingFilter === r ? "bg-amber-100/70" : "hover:bg-amber-50/50"
                  }`}
                >
                  <span className="w-12 font-bold text-stone-700 flex items-center gap-1 shrink-0">
                    <span>{r}</span>
                    <Star className="size-3 fill-amber-500 text-amber-500" />
                  </span>

                  <div className="flex-1 h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="w-10 text-right font-semibold text-stone-500 text-[11px] shrink-0">
                    {pct}%
                  </span>
                  <span className="w-8 text-right text-stone-400 text-[10px] shrink-0">
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. Filter Navigation & Sort Bar */}
      {/* =================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setRatingFilter(undefined);
              setPage(1);
            }}
            className={`rounded-xl px-3 py-1.5 font-bold transition-all cursor-pointer ${
              ratingFilter === undefined
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white border border-stone-200 text-stone-700 hover:border-amber-400"
            }`}
          >
            {isBn ? "সমস্ত রিভিউ" : "All Reviews"} ({totalReviews})
          </button>
          {[5, 4, 3].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRatingFilter(ratingFilter === r ? undefined : r);
                setPage(1);
              }}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 font-bold transition-all cursor-pointer ${
                ratingFilter === r
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white border border-stone-200 text-stone-700 hover:border-amber-400"
              }`}
            >
              <span>{r}</span>
              <Star className="size-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium">{isBn ? "ক্রমানুসার:" : "Sort By:"}</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-bold text-stone-800 focus:border-amber-500 focus:outline-none transition-colors"
          >
            <option value="recent">{isBn ? "সর্বশেষ (Recent)" : "Most Recent"}</option>
            <option value="highest">{isBn ? "সর্বোচ্চ রেটিং (Highest)" : "Highest Rating"}</option>
            <option value="lowest">{isBn ? "সর্বনিম্ন রেটিং (Lowest)" : "Lowest Rating"}</option>
            <option value="helpful">{isBn ? "সবচেয়ে সহায়ক (Most Helpful)" : "Most Helpful"}</option>
          </select>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 4. Reviews List */}
      {/* =================================================================== */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-stone-500">
          <Loader2 className="size-6 animate-spin text-amber-600 mx-auto mb-2" />
          <span>{isBn ? "ভক্ত রিভিউ লোড হচ্ছে..." : "Loading devotee reviews..."}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center space-y-3">
          <div className="size-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Sparkles className="size-6" />
          </div>
          <h4 className="font-bold text-sm text-stone-900">
            {ratingFilter
              ? isBn
                ? `${ratingFilter} স্টার রেটিংয়ের কোনো রিভিউ নেই`
                : `No ${ratingFilter}-star reviews found`
              : isBn
              ? "এখনও এই প্রতিকারের কোনো রিভিউ নেই"
              : "Be the first verified devotee to share your blessing!"}
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {isBn
              ? "আপনি যদি এই পণ্যটি কিনে থাকেন, তবে ডেলিভারি পাওয়ার পর আপনার অভিজ্ঞতা শেয়ার করুন।"
              : "Purchased this consecrated remedy? Once your parcel arrives at your doorstep, leave a review to inspire fellow devotees."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-3xl border border-stone-200/90 bg-white p-5 shadow-xs hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                {/* Devotee Info Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full bg-linear-to-br from-amber-400 to-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {rev.author_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-stone-900">{rev.author_name}</span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-800">
                          <Check className="size-2.5 text-emerald-600 stroke-[3]" />
                          <span>{isBn ? "যাচাইকৃত ক্রেতা" : "Verified Buyer"}</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400">
                        {new Date(rev.created_at).toLocaleDateString(
                          isBn ? "bn-IN" : "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Stars Row */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`size-3.5 ${
                          s <= rev.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Headline */}
                {rev.title && (
                  <h5 className="font-bold text-xs text-stone-900 pt-1">
                    &ldquo;{rev.title}&rdquo;
                  </h5>
                )}

                {/* Comment */}
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {rev.comment}
                </p>

                {/* Uploaded Devotee Parcel Photos */}
                {rev.images && rev.images.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {rev.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLightboxImage(img)}
                        className="relative size-14 rounded-xl overflow-hidden border border-amber-200 bg-stone-100 hover:scale-105 transition-transform cursor-pointer"
                      >
                        <Image
                          src={img}
                          alt="Devotee parcel photo"
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

              {/* Bottom Helpful Action */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <button
                  type="button"
                  onClick={() => handleHelpfulClick(rev.id)}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 transition-colors cursor-pointer ${
                    rev.is_helpful_by_me
                      ? "bg-amber-100 text-amber-900 font-bold"
                      : "hover:bg-stone-100 text-stone-600"
                  }`}
                >
                  <ThumbsUp
                    className={`size-3 ${
                      rev.is_helpful_by_me ? "fill-amber-600 text-amber-600" : ""
                    }`}
                  />
                  <span>
                    {isBn ? "সহায়ক" : "Helpful"}{" "}
                    {rev.helpful_count > 0 && `(${rev.helpful_count})`}
                  </span>
                </button>

                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="size-3" />
                  <span>{isBn ? "প্রমাণিত বিতরণ" : "Delivered Order"}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. Pagination */}
      {/* =================================================================== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
          <span className="text-stone-500">
            {isBn
              ? `পৃষ্ঠা ${page} / ${totalPages} (মোট ${totalReviews}টি রিভিউ)`
              : `Page ${page} of ${totalPages} (${totalReviews} reviews)`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-bold text-stone-700 hover:border-amber-400 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {isBn ? "পূর্ববর্তী" : "Previous"}
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 font-bold text-stone-700 hover:border-amber-400 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {isBn ? "পরবর্তী" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* Review Submission Modal */}
      {/* =================================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-300 bg-[#fffdfa] p-6 shadow-2xl space-y-4 my-8">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="size-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 mb-1">
                <ShieldCheck className="size-3 text-emerald-600" />
                <span>{isBn ? "যাচাইকৃত ক্রেতা রিভিউ" : "Verified Buyer Review"}</span>
              </div>
              <h3 className="font-cinzel text-lg font-bold text-stone-900">
                {isBn ? "আপনার পবিত্র অনুভূতি প্রকাশ করুন" : "Share Your Sacred Experience"}
              </h3>
              <p className="text-xs text-stone-500">
                {product.title}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-2 text-center">
                <span className="text-xs font-bold text-stone-700 block">
                  {isBn ? "প্রতিকারের সামগ্রিক রেটিং দিন:" : "Rate Your Consecrated Remedy:"}
                </span>

                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setStarRating(s)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      aria-label={`Rate ${s} stars`}
                    >
                      <Star
                        className={`size-7 sm:size-8 ${
                          s <= (hoverRating || starRating)
                            ? "text-amber-500 fill-amber-500 drop-shadow-xs"
                            : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-amber-900">
                  {isBn
                    ? RATING_LABELS_BN[hoverRating || starRating]
                    : RATING_LABELS_EN[hoverRating || starRating]}
                </p>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isBn ? "রিভিউয়ের শিরোনাম (ঐচ্ছিক)" : "Review Headline (Optional)"}
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder={
                    isBn
                      ? "যেমন: অসাধারণ খাঁটি রুদ্রাক্ষ ও মানসিক শান্তি"
                      : "e.g. Authentic Rudraksha with profound calming energy"
                  }
                  maxLength={150}
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Detailed Testimony */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  {isBn ? "বিস্তারিত অভিজ্ঞতা ও অনুভূতি *" : "Detailed Experience & Feedback *"}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isBn
                      ? "পণ্যটির গুণগত মান, কাশীর প্রাণ-প্রতিষ্ঠার অনুভূতি এবং ধারণ করার পর আপনার জীবনের পরিবর্তন সম্পর্কে লিখুন..."
                      : "Share how wearing this Siddh remedy influenced your energy, the packaging, authenticity certificate, etc..."
                  }
                  rows={4}
                  required
                  minLength={5}
                  maxLength={3000}
                  className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs text-stone-900 focus:border-amber-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Upload Parcel/Item Proof Photos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <Camera className="size-3.5 text-amber-600" />
                    <span>{isBn ? "প্রাপ্ত সামগ্রীর ছবি যোগ করুন (সর্বোচ্চ ৩টি)" : "Add Photos of Your Received Item (Max 3)"}</span>
                  </label>
                  <span className="text-[11px] text-stone-400 font-semibold">{images.length}/3</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative size-16 rounded-xl overflow-hidden border border-amber-300 group"
                    >
                      <Image
                        src={img}
                        alt="Upload preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 size-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}

                  {images.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="size-16 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-500 bg-stone-50 hover:bg-amber-50/50 flex flex-col items-center justify-center text-stone-500 hover:text-amber-700 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingPhoto ? (
                        <Loader2 className="size-4 animate-spin text-amber-600" />
                      ) : (
                        <>
                          <Upload className="size-4 mb-0.5" />
                          <span className="text-[9px] font-bold">{isBn ? "ছবি দিন" : "Upload"}</span>
                        </>
                      )}
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitMutation.isPending || !comment.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-amber-600 to-amber-700 px-6 py-3 text-xs font-bold text-white hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 transition-all shadow-md cursor-pointer"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>{isBn ? "জমা হচ্ছে..." : "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 text-amber-300" />
                      <span>{isBn ? "রিভিউ প্রকাশ করুন" : "Publish Verified Review"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* Lightbox Photo Preview */}
      {/* =================================================================== */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-xl max-h-[85vh] w-full bg-white rounded-3xl overflow-hidden p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 size-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X className="size-4" />
            </button>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-950">
              <Image
                src={lightboxImage}
                alt="Enlarged devotee review photo"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
