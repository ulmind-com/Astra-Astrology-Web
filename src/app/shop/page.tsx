"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Search,
  Filter,
  Flame,
  CheckCircle2,
  Package,
  ShieldCheck,
  ShoppingBag,
  Coins,
  Gift,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { shopApi, type ShopProduct, type ShopProductCategory, type ShopBannerSettings } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";
import { useCartStore } from "@/lib/stores/use-cart-store";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ShopAnnouncementMarquee } from "@/components/shop/ShopAnnouncementMarquee";
import { ShopHeroSlider } from "@/components/shop/ShopHeroSlider";
import { ShopCategoryPills } from "@/components/shop/ShopCategoryPills";
import { ShopByWhatMatters } from "@/components/shop/ShopByWhatMatters";
import { ShopBestsellers } from "@/components/shop/ShopBestsellers";
import { CashbackPromoBanner } from "@/components/shop/CashbackPromoBanner";
import { AstraPromiseSection } from "@/components/shop/AstraPromiseSection";
import { ShopFaqAccordion } from "@/components/shop/ShopFaqAccordion";

const FALLBACK_PRODUCTS: ShopProduct[] = [
  {
    id: "prod-saturn-7m",
    title: "খাঁটি নেপালি ৭-মুখী রুদ্রাক্ষ (৭-Mukhi Siddh Nepali Rudraksha)",
    slug: "nepali-7-mukhi-rudraksha",
    sku: "ASTRA-RUD-7M",
    short_description: "শনির সাড়ে সাতি, ধাইয়া ও কণ্টক শনির অশুভ প্রভাব প্রশমনকারী মহালক্ষ্মী ও শনিসিদ্ধ পবিত্র রুদ্রাক্ষ।",
    detailed_description: "নেপালের উচ্চ পার্বত্য অঞ্চল থেকে সংগৃহীত ১০০% প্রাকৃতিক ও আদি ৭-মুখী রুদ্রাক্ষ। কাশীর পুরোহিত দ্বারা ১০৮ বার মহামৃত্যুঞ্জয় মন্ত্রে প্রাণ-প্রতিষ্ঠিত।",
    category_id: "cat-rudraksha",
    category_slug: "rudraksha",
    category_type: "rudraksha",
    ruling_planet: "Saturn",
    deity: "Mahalakshmi & Shani Dev",
    benefits: ["শনির সাড়েসাতি প্রশমন", "কর্মক্ষেত্রে প্রমোশন", "আকস্মিক অর্থক্ষতি রোধ"],
    life_pillars: ["career", "finance"],
    purpose_tags: ["dosha", "career", "protection"],
    free_gift_title: "Raw Selenite Charging Plate",
    free_gift_value: 729,
    free_gift_badge: "FREE Raw Selenite Plate worth ₹729",
    cashback_percent: 100,
    lab_certified: true,
    lab_certificate_name: "Govt. Approved Gemological Lab",
    lab_certificate_number: "IGL-RUD-2026-7789",
    mrp: 3999,
    sale_price: 1899,
    discount_percent: 52,
    stock_quantity: 12,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.9,
    review_count: 84,
  },
  {
    id: "prod-pyrite-ring",
    title: "খাঁটি পায়রাইট ধন আকর্ষণ আংটি ও রিং (Natural Pyrite Stud Ring)",
    slug: "natural-pyrite-stud-ring",
    sku: "ASTRA-PYR-RING",
    short_description: "আর্থিক সমৃদ্ধি, আটকে থাকা টাকা উদ্ধার ও ব্যবসা বৃদ্ধিতে প্রত্যক্ষ ফলদায়ী দেবগুরু ও বুধ যোগের সিদ্ধ রিং।",
    detailed_description: "প্রাকৃতিক গোল্ডেন পায়রাইট পাথর খচিত প্রিমিয়াম রিং। এটি ধারণে আত্মবিশ্বাস ও আর্থিক সুযোগ আকর্ষিত হয়।",
    category_id: "cat-pyrite",
    category_slug: "pyrite",
    category_type: "crystal_bracelet",
    ruling_planet: "Sun & Mercury",
    deity: "Maha Lakshmi & Kuber",
    benefits: ["স্থায়ী ধনবৃদ্ধি", "আটকে থাকা টাকা ফেরত", "কর্মক্ষেত্রে সাফল্য"],
    life_pillars: ["finance", "career"],
    purpose_tags: ["wealth", "career"],
    free_gift_title: "Raw Selenite Charging Plate",
    free_gift_value: 729,
    free_gift_badge: "FREE Raw Selenite Plate worth ₹729",
    cashback_percent: 100,
    lab_certified: true,
    lab_certificate_name: "Govt. Approved Gemological Lab",
    lab_certificate_number: "VGL-PYR-2026-4412",
    mrp: 2499,
    sale_price: 999,
    discount_percent: 60,
    stock_quantity: 25,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1611591475879-166258f33cf2?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1611591475879-166258f33cf2?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 5.0,
    review_count: 142,
  },
  {
    id: "prod-leo-zodiac-band",
    title: "সিংহ রাশি মেটাল ও ক্রিস্টাল ব্রেসলেট (Leo Zodiac Metal Bracelet)",
    slug: "leo-zodiac-metal-bracelet-free-selenite",
    sku: "ASTRA-ZOD-LEO",
    short_description: "সিংহ রাশির রবি গ্রহের তেজ, আত্মবিশ্বাস ও নেতৃত্ব গুণাবলী বৃদ্ধির বিশেষ সূর্যকান্ত ব্রেসলেট।",
    detailed_description: "প্রাকৃতিক সানস্টোন, টাইগার আই ও খাঁটি মেটাল চার্ম খচিত সিংহ রাশি ব্রেসলেট। সাথে সম্পূর্ণ ফ্রি ₹৭২৯ মূল্যের সেলিনাইট প্লেট।",
    category_id: "cat-zodiac",
    category_slug: "zodiac",
    category_type: "crystal_bracelet",
    ruling_planet: "Sun",
    deity: "Surya Bhagavan",
    benefits: ["নেতৃত্ব ও সম্মান বৃদ্ধি", "রবি গ্রহের শুভত্ব", "পিতৃদোষ নিবারণ"],
    life_pillars: ["luck", "career"],
    purpose_tags: ["zodiac", "career"],
    free_gift_title: "Raw Selenite Charging Plate",
    free_gift_value: 729,
    free_gift_badge: "FREE Raw Selenite Plate worth ₹729",
    cashback_percent: 100,
    lab_certified: true,
    lab_certificate_name: "Govt. Approved Gemological Lab",
    mrp: 2800,
    sale_price: 999,
    discount_percent: 64,
    stock_quantity: 18,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.9,
    review_count: 110,
  },
  {
    id: "prod-mars-coral",
    title: "ন্যাচারাল রক্তপ্রবাল (Certified Red Coral) ও ৩-মুখী রুদ্রাক্ষ কবচ",
    slug: "certified-red-coral-mars-kavach",
    sku: "ASTRA-GEM-CORAL",
    short_description: "মাঙ্গলিক দোষ প্রশমন, রক্তপীড়া ও ভূমি-সম্পত্তি সংক্রান্ত সংকট নিরসনে দেব সেনাপতি মঙ্গলের বিহিত মহাপ্রতিকার।",
    detailed_description: "প্রাকৃতিক খাঁটি ইতালীয় রক্তপ্রবাল ও অগ্নিস্বরূপ ৩-মুখী রুদ্রাক্ষের সমন্বয়ে তৈরি পবিত্র রক্ষা কবচ।",
    category_id: "cat-gemstones",
    category_slug: "gemstones",
    category_type: "gemstone",
    ruling_planet: "Mars",
    deity: "Hanuman & Kartikeya",
    benefits: ["মাঙ্গলিক দোষ নিবারণ", "বীর্য ও জীবনীশক্তি বৃদ্ধি", "সম্পত্তি সংকট মোচন"],
    life_pillars: ["love", "family"],
    purpose_tags: ["dosha", "love"],
    free_gift_title: "Raw Selenite Charging Plate",
    free_gift_value: 729,
    free_gift_badge: "FREE Raw Selenite Plate worth ₹729",
    cashback_percent: 100,
    lab_certified: true,
    lab_certificate_name: "Govt. Approved Gemological Lab",
    mrp: 4999,
    sale_price: 2499,
    discount_percent: 50,
    stock_quantity: 8,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 5.0,
    review_count: 49,
  },
  {
    id: "prod-gomti-chakra-set",
    title: "৮টি অলৌকিক সিদ্ধ গোমতী চক্র ও কনসেক্রেটেড শ্রীকুবের কয়েন",
    slug: "8-sacred-gomti-chakra-miracle-set",
    sku: "ASTRA-GOMTI-8X",
    short_description: "আটকে থাকা টাকা আদায়, গৃহের বাস্তুদোষ নিবারণ ও ধনলক্ষ্মীর চিরস্থায়ী কৃপাপ্রাপ্তির জন্য অলৌকিক তন্ত্রোক্ত টোটকা।",
    detailed_description: "গোমতী নদীগর্ভ থেকে সংগৃহীত ৮টি প্রাকৃতিক শ্বেত গোমতী চক্র, গঙ্গাজল ও ধনদা মন্ত্রে ১০৮ বার জপকৃত।",
    category_id: "cat-gomti",
    category_slug: "gomti_chakra",
    category_type: "gomti_chakra",
    ruling_planet: "Jupiter & Lakshmi",
    deity: "Maha Lakshmi & Kuber",
    benefits: ["আটকে থাকা টাকা ফেরত", "স্থায়ী ধনবৃদ্ধি", "ঋণমুক্তি"],
    life_pillars: ["finance", "family"],
    purpose_tags: ["wealth"],
    free_gift_title: "Raw Selenite Charging Plate",
    free_gift_value: 729,
    free_gift_badge: "FREE Raw Selenite Plate worth ₹729",
    cashback_percent: 100,
    lab_certified: true,
    mrp: 2199,
    sale_price: 999,
    discount_percent: 55,
    stock_quantity: 25,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1611591475879-166258f33cf2?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1611591475879-166258f33cf2?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.9,
    review_count: 112,
  },
  {
    id: "prod-karungali-mala",
    title: "সিদ্ধ ১০৮ দানার করুঙ্গালি কাঠের মালা (Original Karungali Mala)",
    slug: "original-karungali-mala-108-beads",
    sku: "ASTRA-KAR-108",
    short_description: "নেতিবাচক শক্তি, শত্রুদমন, নজরদোষ ও কালো জাদু বিনাশী ভগবান মুরুগান সিদ্ধ পবিত্র কালো আবলুস কাঠের মালা।",
    detailed_description: "দক্ষিণ ভারতের খাঁটি কালো আবলুস (Karungali) কাঠ থেকে নির্মিত পবিত্র ১০৮ দানার জপমালা।",
    category_id: "cat-karungali",
    category_slug: "karungali",
    category_type: "mala_rosary",
    ruling_planet: "Mars & Murugan",
    deity: "Lord Murugan",
    benefits: ["নজরদোষ বিনাশ", "শত্রুভয় নিবারণ", "আত্মরক্ষা কবচ"],
    life_pillars: ["health", "luck"],
    purpose_tags: ["protection"],
    free_gift_title: "Raw Selenite Charging Plate",
    free_gift_value: 729,
    free_gift_badge: "FREE Raw Selenite Plate worth ₹729",
    cashback_percent: 100,
    lab_certified: true,
    mrp: 2999,
    sale_price: 1399,
    discount_percent: 53,
    stock_quantity: 14,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.9,
    review_count: 88,
  },
];

function ShopInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialPlanet = searchParams.get("planet") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPurpose = searchParams.get("purpose") || "";

  const [selectedPlanet, setSelectedPlanet] = React.useState<string>(initialPlanet);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [selectedPurpose, setSelectedPurpose] = React.useState<string>(initialPurpose);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  const { openCart, getItemCount } = useCartStore();
  const cartItemCount = getItemCount();

  React.useEffect(() => {
    if (initialPlanet) setSelectedPlanet(initialPlanet);
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialPurpose) setSelectedPurpose(initialPurpose);
  }, [initialPlanet, initialCategory, initialPurpose]);

  // Fetch Public Banners
  const { data: bannerSettings } = useQuery<ShopBannerSettings | null>({
    queryKey: ["shop_public_banners"],
    queryFn: async () => {
      try {
        const res = await shopApi.getBanners();
        return res;
      } catch {
        return null;
      }
    },
  });

  // Fetch Public Products
  const { data: serverProductData, isLoading } = useQuery({
    queryKey: ["shop_public_products", selectedPlanet, selectedCategory, searchTerm],
    queryFn: async () => {
      try {
        const res = await shopApi.getProducts({
          ruling_planet: selectedPlanet || undefined,
          category_id: selectedCategory || undefined,
          search: searchTerm || undefined,
          in_stock_only: false,
          limit: 50,
        });
        return res;
      } catch {
        return null;
      }
    },
  });

  const products: ShopProduct[] =
    serverProductData && serverProductData.items && serverProductData.items.length > 0
      ? serverProductData.items
      : FALLBACK_PRODUCTS.filter((p) => {
          if (selectedPlanet && p.ruling_planet?.toLowerCase() !== selectedPlanet.toLowerCase()) {
            return false;
          }
          if (selectedCategory && p.category_slug !== selectedCategory) {
            return false;
          }
          if (selectedPurpose && !p.purpose_tags?.includes(selectedPurpose)) {
            return false;
          }
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
              p.title.toLowerCase().includes(term) ||
              p.short_description.toLowerCase().includes(term) ||
              p.sku.toLowerCase().includes(term)
            );
          }
          return true;
        });

  const handleSelectFilter = (type: string, val: string) => {
    if (type === "purpose") setSelectedPurpose(val);
    if (type === "rashi") {
      setSearchTerm(val);
    }
    if (type === "planet") setSelectedPlanet(val);
    if (type === "crystal") setSearchTerm(val);

    // Scroll smoothly to products section
    const el = document.getElementById("all-products-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#332c39]">
      {/* 1. Top Announcement Bar & Infinite Marquee */}
      <ShopAnnouncementMarquee
        announcementText={bannerSettings?.announcement_bar_text}
        announcementLink={bannerSettings?.announcement_bar_link}
        marqueeItems={bannerSettings?.marquee_items}
      />

      <SiteHeader />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10 space-y-12">
        {/* 2. Hero Banner Slider */}
        <ShopHeroSlider banners={bannerSettings?.hero_banners} />

        {/* 3. Category Pills (Circular Icons inspired by Astrotalk) */}
        <ShopCategoryPills />

        {/* 4. "Shop by What Matters" Tabs (Purpose / Rashi / Planet / Crystal) */}
        <ShopByWhatMatters onSelectFilter={handleSelectFilter} />

        {/* 5. Most Loved Bestsellers with Badges & 1-Click Quick Add */}
        <ShopBestsellers products={products} />

        {/* 6. 100% Wallet Cashback Promo Hook Banner */}
        <CashbackPromoBanner />

        {/* 7. All Products Listing & Search Filter Bar */}
        <section id="all-products-section" className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="size-5 text-amber-700" />
                  <span>
                    {language === "bn"
                      ? `সমস্ত বৈদিক প্রতিকার ও রত্ন (${products.length})`
                      : `All Consecrated Remedies (${products.length})`}
                  </span>
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  {language === "bn"
                    ? "১০০% ওয়ালেট ক্যাশব্যাক ও ফ্রি সেলিনাইট প্লেট অন্তর্ভুক্ত।"
                    : "Includes 100% Wallet Cashback & Free Selenite Plate on all prepaid orders."}
                </p>
              </div>

              {(selectedPlanet || selectedCategory || selectedPurpose || searchTerm) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlanet("");
                    setSelectedCategory("");
                    setSelectedPurpose("");
                    setSearchTerm("");
                  }}
                  className="text-xs font-bold text-rose-700 hover:underline cursor-pointer bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200"
                >
                  {language === "bn" ? "সমস্ত ফিল্টার মুছুন ✕" : "Clear All Filters ✕"}
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "রুদ্রাক্ষ, নীলম, রক্তপ্রবাল, গোমতী চক্র বা উদ্দেশ্য লিখে খুঁজুন..."
                    : "Search Siddh Rudraksha, Blue Sapphire, Red Coral, Pyrite, Gomti Chakra..."
                }
                className="w-full rounded-2xl border border-stone-300 bg-stone-50 pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-amber-600 focus:bg-white focus:outline-hidden transition-colors"
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RotateCcw className="size-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-medium">
                {language === "bn" ? "পবিত্র রত্ন ও রুদ্রাক্ষ লোড হচ্ছে..." : "Loading consecrated remedies..."}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center space-y-3">
              <Package className="size-12 text-stone-300 mx-auto" />
              <h4 className="font-bold text-base text-stone-800">
                {language === "bn" ? "কোনো প্রতিকার খুঁজে পাওয়া যায়নি" : "No remedies matched your filter"}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {language === "bn"
                  ? "অন্য কোনো গ্রহ, রাশি বা সামগ্রীর নাম লিখে অনুসন্ধান করুন।"
                  : "Try searching another planet, rashi or keyword."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => {
                const discount = p.discount_percent || Math.round(((p.mrp - p.sale_price) / p.mrp) * 100);
                const freeGiftBadge = p.free_gift_badge || "FREE Raw Selenite Plate worth ₹729";

                return (
                  <div
                    key={p.id}
                    className="rounded-3xl border-2 border-stone-200/90 bg-white p-3.5 shadow-xs hover:border-amber-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      {/* Image */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
                        <Link href={`/shop/products/${p.slug}`}>
                          {p.featured_image ? (
                            <Image
                              src={p.featured_image}
                              alt={p.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 25vw"
                              className="object-cover group-hover:scale-106 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="size-full flex items-center justify-center text-stone-300">
                              <ShoppingBag className="size-12" />
                            </div>
                          )}
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                          {discount > 0 && (
                            <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                              {discount}% OFF
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 bg-emerald-700 text-emerald-100 text-[9px] font-black px-2 py-0.5 rounded shadow-xs">
                            <Coins className="size-2.5 text-amber-300" />
                            <span>100% Cashback</span>
                          </span>
                        </div>
                      </div>

                      {/* Gift Badge */}
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 flex items-center gap-1.5 text-[9px] font-bold text-amber-900 truncate">
                        <Gift className="size-2.5 text-amber-600 shrink-0" />
                        <span className="truncate">{freeGiftBadge}</span>
                      </div>

                      {/* Title */}
                      <Link
                        href={`/shop/products/${p.slug}`}
                        className="font-bold text-xs text-stone-900 line-clamp-2 hover:text-amber-700 transition-colors block"
                      >
                        {p.title}
                      </Link>

                      <p className="text-[11px] text-stone-500 line-clamp-2">
                        {p.short_description}
                      </p>
                    </div>

                    {/* Pricing & Add */}
                    <div className="pt-3 mt-2 border-t border-stone-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-sm sm:text-base text-stone-900">
                            ₹{p.sale_price.toLocaleString("en-IN")}
                          </span>
                          {p.mrp > p.sale_price && (
                            <span className="text-[11px] text-stone-400 line-through">
                              ₹{p.mrp.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-emerald-700 font-extrabold uppercase">
                          In Stock
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/shop/products/${p.slug}`}
                          className="py-2 px-2 rounded-xl border border-stone-200 text-stone-700 font-bold text-[11px] hover:bg-stone-50 transition-colors text-center"
                        >
                          Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            useCartStore.getState().addItem(p, 1);
                            toast.success(`${p.title} added to cart! Free gift included.`);
                          }}
                          className="py-2 px-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="size-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 8. The Astra Promise Section */}
        <AstraPromiseSection />

        {/* 9. FAQs */}
        <ShopFaqAccordion />
      </main>

      {/* Floating Cart Trigger on Mobile / Desktop */}
      {cartItemCount > 0 && (
        <button
          type="button"
          onClick={openCart}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer border-2 border-amber-300"
        >
          <div className="relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-black size-4 rounded-full flex items-center justify-center shadow-xs">
              {cartItemCount}
            </span>
          </div>
          <span>View Cart</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-black">
            ₹{useCartStore.getState().getSubtotal().toLocaleString("en-IN")}
          </span>
        </button>
      )}

      <SiteFooter />
    </div>
  );
}

export default function ShopPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
          <div className="size-8 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ShopInner />
    </React.Suspense>
  );
}
