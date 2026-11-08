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
  ExternalLink,
  ChevronRight,
  PhoneCall,
  Clock,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { shopApi, type ShopProduct, type ShopProductCategory } from "@/lib/api";
import { useLanguage } from "@/providers/language-provider";

const FALLBACK_PRODUCTS: ShopProduct[] = [
  {
    id: "prod-saturn-7m",
    title: "খাঁটি নেপালি ৭-মুখী রুদ্রাক্ষ (৭-Mukhi Nepali Rudraksha)",
    slug: "nepali-7-mukhi-rudraksha",
    sku: "ASTRA-RUD-7M",
    short_description: "শনির সাড়ে সাতি, ধাইয়া ও কণ্টক শনির অশুভ প্রভাব প্রশমনকারী মহালক্ষ্মী ও শনিসিদ্ধ পবিত্র রুদ্রাক্ষ।",
    detailed_description: "নেপালের উচ্চ পার্বত্য অঞ্চল থেকে সংগৃহীত ১০০% প্রাকৃতিক ও আদি ৭-মুখী রুদ্রাক্ষ।",
    category_id: "cat-rudraksha",
    category_slug: "rudraksha",
    category_type: "rudraksha",
    ruling_planet: "Saturn",
    deity: "Mahalakshmi & Shani Dev",
    benefits: ["শনির সাড়েসাতি প্রশমন", "কর্মক্ষেত্রে প্রমোশন", "আকস্মিক অর্থক্ষতি রোধ"],
    life_pillars: ["career", "finance"],
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
    id: "prod-rahu-silver",
    title: "বিশুদ্ধ ৪ গ্রাম নিরেট চৌকো রুপোর পাত ও ৮-মুখী রুদ্রাক্ষ",
    slug: "solid-square-silver-rahu-combo",
    sku: "ASTRA-LK-RAHU-SILVER",
    short_description: "৮ম ও ১২শ ভাবে রাহুর পীড়া, মানসিক বিভ্রান্তি, দুঃস্বপ্ন ও ভয় দূরীকরণে বিশুদ্ধ শাস্ত্রীয় লাল কিতাব ক্যানন।",
    detailed_description: "৯৯.৯% খাঁটি নিরেট চারকোনা রুপোর টুকরো এবং প্রস্ফুটিত ৮-মুখী রুদ্রাক্ষের সম্মিলিত সুরক্ষা বলয়।",
    category_id: "cat-silver",
    category_slug: "silver",
    category_type: "ritual_items",
    ruling_planet: "Rahu",
    deity: "Ganesha & Bhairava",
    benefits: ["রাহুর গোচর শান্তি", "মানসিক উদ্বেগ মুক্তি", "আকস্মিক দুর্ঘটনার সুরক্ষা"],
    life_pillars: ["health", "luck"],
    mrp: 2999,
    sale_price: 1499,
    discount_percent: 50,
    stock_quantity: 18,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1611591475879-166258f33cf2?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1611591475879-166258f33cf2?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.8,
    review_count: 62,
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
    category_type: "gemstones",
    ruling_planet: "Mars",
    deity: "Hanuman & Kartikeya",
    benefits: ["মাঙ্গলিক দোষ নিবারণ", "বীর্য ও জীবনীশক্তি বৃদ্ধি", "সম্পত্তি সংকট মোচন"],
    life_pillars: ["love", "family"],
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
    id: "prod-jupiter-5m",
    title: "নেপালি ৫-মুখী রুদ্রাক্ষ ও কাঁচা হলুদের সিদ্ধ মালা",
    slug: "nepali-5-mukhi-haldi-mala",
    sku: "ASTRA-RUD-5M-HALDI",
    short_description: "বৃহস্পতি গ্রহের শুভত্ব বৃদ্ধি, আধ্যাত্মিক জ্ঞান, উচ্চশিক্ষা ও দাম্পত্য সুখের জন্য দেবগুরু বিহিত প্রতিকার।",
    detailed_description: "কাঁচা হলুদের গাঁট দিয়ে তৈরি সিদ্ধ মালা ও নেপালি ৫-মুখী পঞ্চমুখী রুদ্রাক্ষ।",
    category_id: "cat-rudraksha",
    category_slug: "rudraksha",
    category_type: "rudraksha",
    ruling_planet: "Jupiter",
    deity: "Brihaspati & Lord Shiva",
    benefits: ["জ্ঞান ও মেধা বিকাশ", "সন্তানসুখ", "বিবাহ বাধা নিরসন"],
    life_pillars: ["career", "family"],
    mrp: 2499,
    sale_price: 1199,
    discount_percent: 52,
    stock_quantity: 14,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.7,
    review_count: 38,
  },
  {
    id: "prod-sun-yantra-12m",
    title: "বিশুদ্ধ তাম্র সূর্য যন্ত্র ও ১২-মুখী রুদ্রাক্ষ কম্বো",
    slug: "pure-copper-surya-yantra-12m",
    sku: "ASTRA-YAN-SURYA-12M",
    short_description: "সরকারি চাকরি, পদোন্নতি, পিতৃসুখ, আত্মবিশ্বাস ও সমাজে উচ্চ সম্মান বৃদ্ধির জন্য রবি গ্রহের অব্যর্থ প্রতিকার।",
    detailed_description: "খাঁটি তামার পাত্রে খোদাই করা ত্রিকোণ সূর্য যন্ত্র এবং মহাবলশালী দ্বাদশমুখী সূর্য রুদ্রাক্ষ।",
    category_id: "cat-yantra",
    category_slug: "yantra",
    category_type: "yantra",
    ruling_planet: "Sun",
    deity: "Surya Bhagavan",
    benefits: ["সরকারি পদলাভ", "আত্মবিশ্বাস বৃদ্ধি", "পিতৃদোষ নিবারণ"],
    life_pillars: ["career", "luck"],
    mrp: 3299,
    sale_price: 1599,
    discount_percent: 51,
    stock_quantity: 10,
    in_stock: true,
    featured_image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"],
    is_active: true,
    is_featured: true,
    is_energized: true,
    average_rating: 4.9,
    review_count: 53,
  },
];

function ShopInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialPlanet = searchParams.get("planet") || "";
  const initialCategory = searchParams.get("category") || "";

  const [selectedPlanet, setSelectedPlanet] = React.useState<string>(initialPlanet);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = React.useState<ShopProduct | null>(null);

  React.useEffect(() => {
    if (initialPlanet) setSelectedPlanet(initialPlanet);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialPlanet, initialCategory]);

  // Fetch Public Categories
  const { data: serverCategories = [] } = useQuery<ShopProductCategory[]>({
    queryKey: ["shop_public_categories"],
    queryFn: async () => {
      try {
        const res = await shopApi.getCategories();
        return res || [];
      } catch {
        return [];
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
          limit: 30,
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

  const planetFilters = [
    { id: "", label_bn: "সব গ্রহ", label_hi: "सभी ग्रह", label_en: "All Planets" },
    { id: "saturn", label_bn: "♄ শনি দেব", label_hi: "♄ शनि", label_en: "♄ Saturn" },
    { id: "jupiter", label_bn: "♃ বৃহস্পতি", label_hi: "♃ गुरु", label_en: "♃ Jupiter" },
    { id: "mars", label_bn: "♂ মঙ্গল", label_hi: "♂ मंगल", label_en: "♂ Mars" },
    { id: "rahu", label_bn: "☊ রাহু", label_hi: "☊ राहु", label_en: "☊ Rahu" },
    { id: "sun", label_bn: "☉ সূর্য", label_hi: "☉ सूर्य", label_en: "☉ Sun" },
    { id: "moon", label_bn: "☽ চন্দ্র", label_hi: "☽ चंद्र", label_en: "☽ Moon" },
    { id: "venus", label_bn: "♀ শুক্র", label_hi: "♀ शुक्र", label_en: "♀ Venus" },
    { id: "mercury", label_bn: "☿ বুধ", label_hi: "☿ बुध", label_en: "☿ Mercury" },
  ];

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#332c39]">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-[#2a1b12] via-[#3a2519] to-[#1f1510] p-6 sm:p-10 text-white shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute top-4 right-8 text-8xl font-serif text-amber-500/10 select-none">
            ॐ
          </div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-200">
              <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
              <span>
                {language === "bn"
                  ? "আস্ট্রা দিব্য এস্ট্রোস্টোর • ১০০% খাঁটি ও প্রাণ-প্রতিষ্ঠিত প্রতিকার"
                  : language === "hi"
                  ? "अस्ट्रा दिव्य एस्ट्रोस्टोर • 100% प्रामाणिक व प्राण-प्रतिष्ठित सामग्री"
                  : "Astra Consecrated AstroStore • 100% Lab Certified Vedic Remedies"}
              </span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
              {language === "bn"
                ? "শাস্ত্রীয় রুদ্রাক্ষ, পবিত্র রত্ন ও দৈব যন্ত্র"
                : language === "hi"
                ? "शास्त्रीय रुद्राक्ष, प्राकृतिक रत्न व सिद्ध यंत्र"
                : "Sacred Rudraksha, Certified Gemstones & Yantras"}
            </h1>

            <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed font-medium">
              {language === "bn"
                ? "আপনার জন্মছক ও বর্ষফলের অশুভ গ্রহপীড়া নিবারণে প্রতিটি সামগ্রী বারাণসীর গঙ্গাতীরে বৈদিক মন্ত্রোচ্চারণে প্রাণ-প্রতিষ্ঠা ও শোধন করে প্রদান করা হয়।"
                : language === "hi"
                ? "आपकी कुंडली के ग्रह दोष निवारण हेतु प्रत्येक सामग्री वाराणसी में वैदिक रीति से अभिमंत्रित व प्रतिष्ठित की जाती है।"
                : "Every sacred remedy is laboratory tested and individually consecrated on the banks of Varanasi with authentic Vedic mantras."}
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-amber-300/90 font-semibold flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>{language === "bn" ? "ল্যাব সার্টিফাইড গ্যারান্টি" : language === "hi" ? "लैब प्रमाणित" : "Lab Certified"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Flame className="size-4 text-amber-400" />
                <span>{language === "bn" ? "মন্ত্রপূত প্রাণ-প্রতিষ্ঠা" : language === "hi" ? "प्राण-प्रतिष्ठित" : "Prana-Pratishthit"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span>{language === "bn" ? "সরাসরি ক্যাশ অন ডেলিভারি / অনলাইন" : language === "hi" ? "सुरक्षित डिलीवरी" : "Pan-India Delivery"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="rounded-2xl border border-[#ebd7c8] bg-[#fbf5ee]/95 p-4 sm:p-5 shadow-sm space-y-4">
          {/* Planet Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              {language === "bn" ? "গ্রহ ভিত্তিক প্রতিকার ফিল্টার:" : language === "hi" ? "ग्रह अनुसार फिल्टर:" : "Filter by Ruling Planet:"}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {planetFilters.map((pl) => (
                <button
                  key={pl.id}
                  type="button"
                  onClick={() => setSelectedPlanet(pl.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedPlanet.toLowerCase() === pl.id.toLowerCase()
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                  }`}
                >
                  {pl[`label_${language}` as "label_bn" | "label_hi" | "label_en"] || pl.label_en}
                </button>
              ))}
            </div>
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
                  ? "রুদ্রাক্ষ, নীলম, রক্তপ্রবাল, গোমতী চক্র বা সুবিধা লিখে খুঁজুন..."
                  : language === "hi"
                  ? "रुद्राक्ष, नीलम, मूंगा, गोमती चक्र खोजें..."
                  : "Search sacred Rudraksha, Blue Sapphire, Red Coral, Gomti Chakra..."
              }
              className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-2.5 text-sm focus:border-amber-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag className="size-5 text-amber-700" />
              <span>
                {language === "bn"
                  ? `উপলব্ধ সামগ্রী (${products.length})`
                  : language === "hi"
                  ? `उपलब्ध सामग्री (${products.length})`
                  : `Sacred Products (${products.length})`}
              </span>
            </h2>
            {selectedPlanet && (
              <button
                type="button"
                onClick={() => setSelectedPlanet("")}
                className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
              >
                {language === "bn" ? "ফিল্টার মুছুন ✕" : language === "hi" ? "फिल्टर हटाएं ✕" : "Clear Filter ✕"}
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RotateCcw className="size-8 text-amber-600 animate-spin mx-auto" />
              <p className="text-xs text-stone-500">
                {language === "bn" ? "পবিত্র রত্ন ও রুদ্রাক্ষ লোড হচ্ছে..." : "Loading consecrated remedies..."}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-12 text-center space-y-2">
              <Package className="size-10 text-stone-400 mx-auto" />
              <h4 className="font-bold text-sm text-stone-700">
                {language === "bn" ? "কোনো পণ্য পাওয়া যায়নি" : "No remedies matched your filter"}
              </h4>
              <p className="text-xs text-stone-500">
                {language === "bn" ? "অন্য কোনো গ্রহ বা নাম দিয়ে খুঁজে দেখুন।" : "Try searching another planet or keyword."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-3xl border-2 border-stone-200/90 bg-white p-4 shadow-xs hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Thumbnail */}
                    <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-100">
                      {p.featured_image ? (
                        <Image
                          src={p.featured_image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-stone-300">
                          <Package className="size-12" />
                        </div>
                      )}
                      {p.is_energized && (
                        <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-amber-900/90 backdrop-blur-xs text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/50">
                          <Flame className="size-2.5 text-amber-400 fill-current" />
                          <span>{language === "bn" ? "প্রাণ-প্রতিষ্ঠিত" : "Consecrated"}</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.ruling_planet && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                          <Sparkles className="size-2.5 text-amber-600" />
                          <span>{p.ruling_planet}</span>
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md capitalize">
                        {p.category_slug.replace(/-/g, " ")}
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2">
                      {p.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {p.short_description}
                    </p>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-extrabold text-stone-900 text-lg">
                          ₹{p.sale_price.toLocaleString("en-IN")}
                        </span>
                        {p.mrp > p.sale_price && (
                          <span className="text-xs text-stone-400 line-through">
                            ₹{p.mrp.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      {p.discount_percent > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700">
                          {p.discount_percent}% {language === "bn" ? "ছাড়" : "OFF"}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModalProduct(p)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs hover:from-amber-700 hover:to-amber-600 transition-all shadow-xs cursor-pointer"
                    >
                      <span>{language === "bn" ? "বিবরণ ও অর্ডার" : "Details & Order"}</span>
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Product Quick-View & Consultation Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-amber-500 bg-[#faf6f0] p-6 sm:p-8 text-[#332c39] shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#ebd7c8]">
              <div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  <ShieldCheck className="size-3 text-amber-700" />
                  <span>{activeModalProduct.sku}</span>
                </span>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#4D4664] mt-1">
                  {activeModalProduct.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalProduct(null)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              {activeModalProduct.featured_image && (
                <Image
                  src={activeModalProduct.featured_image}
                  alt={activeModalProduct.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                {language === "bn" ? "শাস্ত্রমত উপকারিতা ও বিধান:" : "Sacred Benefits & Blessings:"}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {activeModalProduct.detailed_description || activeModalProduct.short_description}
              </p>
            </div>

            {activeModalProduct.benefits.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-900 block">
                  ✦ {language === "bn" ? "প্রধান শুভ ফল:" : "Key Astrological Influences:"}
                </span>
                <ul className="text-xs text-stone-700 space-y-1 list-disc list-inside">
                  {activeModalProduct.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-[#ebd7c8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-stone-900">
                    ₹{activeModalProduct.sale_price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{activeModalProduct.mrp.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700">
                  {language === "bn" ? "১০০% প্রামাণ্য খাঁটি সার্টিফিকেট সহ" : "Includes Authenticity Certificate"}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    toast.success(
                      language === "bn"
                        ? "আপনার অনুরোধ সংরক্ষিত হয়েছে! বৈদিক আচার্য অবিলম্বে যোগাযোগ করবেন।"
                        : "Consecration request placed! An Acharya will guide you shortly."
                    );
                    setActiveModalProduct(null);
                  }}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-xs hover:from-amber-700 hover:to-amber-600 transition-all shadow-md cursor-pointer text-center"
                >
                  {language === "bn" ? "অর্ডার সম্পন্ন করুন (₹" + activeModalProduct.sale_price + ")" : "Complete Order (₹" + activeModalProduct.sale_price + ")"}
                </button>
              </div>
            </div>
          </div>
        </div>
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
          <RotateCcw className="size-8 text-amber-600 animate-spin" />
        </div>
      }
    >
      <ShopInner />
    </React.Suspense>
  );
}
