export interface ShopHeroBanner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  badge_text?: string | null;
  image_url: string;
  is_active?: boolean;
  hide_text_overlay?: boolean;
}

export interface MarqueeTrustItem {
  text: string;
}

export interface BestsellerProduct {
  id: string;
  title: string;
  slug: string;
  category: "all" | "zodiac" | "bracelets" | "vastu-home" | "karungali";
  category_label: string;
  subtitle_tag?: string;
  badge?: string;
  badge_type?: "offer" | "numerology" | "trend" | "luxury" | "cert" | "home";
  sale_price: number;
  mrp: number;
  discount_percent: number;
  image: string;
  benefits: string[];
  description: string;
  ruling_planet?: string;
  deity?: string;
}

export interface WhatMattersItem {
  id: string;
  title: string;
  iconName: string;
  desc: string;
  query: string;
}

export interface CustomerReel {
  id: string;
  user_handle: string;
  user_name: string;
  rating: number;
  quote: string;
  thumbnail_url: string;
  video_url: string;
  likes_count: string;
  tagged_product_title: string;
  tagged_product_price: number;
  tagged_product_slug: string;
  is_active?: boolean;
}

export const DEFAULT_HERO_BANNERS: ShopHeroBanner[] = [
  {
    id: "banner-lumus",
    title: "Discover India's First Crystal-Infused Perfumes",
    subtitle: "Where every fragrance meets the energy of crystals.",
    cta_text: "Shop Now",
    cta_link: "/shop?category=perfumes",
    badge_text: "LUMUS × ASTROTALK",
    image_url: "/images/banners/banner-lumus-clean.jpg",
    hide_text_overlay: true,
    is_active: true,
  },
  {
    id: "banner-1",
    title: "Wear Your Zodiac Collection",
    subtitle: "Discover India's finest 925 sterling silver zodiac rings infused with authentic planetary gemstone energies.",
    cta_text: "Shop Now",
    cta_link: "/shop?category=zodiac",
    badge_text: "ASTRA × ZODIAC",
    image_url: "/images/banners/banner-zodiac.jpg",
    is_active: true,
  },
  {
    id: "banner-2",
    title: "Sacred Nepali Siddh Rudraksha",
    subtitle: "100% lab-certified 1 to 14 Mukhi divine beads consecrated with Maha Mrityunjaya Vedic rituals.",
    cta_text: "Shop Now",
    cta_link: "/shop?category=rudraksha",
    badge_text: "DIVINE RUDRAKSHA × VARANASI",
    image_url: "/images/banners/banner-rudraksha.jpg",
    is_active: true,
  },
  {
    id: "banner-3",
    title: "Super Dhan Yog Abundance Band",
    subtitle: "Attract wealth, dissolve debt & activate Lakshmi vibrations with certified Pyrite, Tiger's Eye & Citrine.",
    cta_text: "Shop Now",
    cta_link: "/shop?category=bracelets",
    badge_text: "DHAN YOG × ABUNDANCE",
    image_url: "/images/banners/banner-dhanyog.jpg",
    is_active: true,
  },
  {
    id: "banner-4",
    title: "Original Karungali Ebony Mala",
    subtitle: "Pure black ebony wood beads energized for negative energy protection, evil eye defense & planetary peace.",
    cta_text: "Shop Now",
    cta_link: "/shop?category=karungali",
    badge_text: "KARUNGALI × TOTAL SHIELD",
    image_url: "/images/banners/banner-karungali-landscape.jpg",
    is_active: true,
  },
  {
    id: "banner-5",
    title: "Pran-Pratishthit Natural Gemstones",
    subtitle: "Unheated, untreated Yellow Sapphire, Blue Sapphire, Emerald & Red Coral with certificate of authenticity.",
    cta_text: "Shop Now",
    cta_link: "/shop?category=gemstones",
    badge_text: "GOVT. LAB CERTIFIED RATNA",
    image_url: "/images/banners/banner-gemstones-landscape.jpg",
    is_active: true,
  },
];

export const MARQUEE_TRUST_ITEMS: string[] = [
  "Certified by Govt. Labs",
  "100% Cashback On All Prepaid Orders",
  "7-Day Easy Returns",
  "Energised by Top Astrologers",
  "100% Natural & Authentic",
];

export const BESTSELLER_CATEGORIES = [
  { id: "all", label: "All Bestsellers" },
  { id: "zodiac", label: "Zodiac" },
  { id: "bracelets", label: "Bracelets" },
  { id: "vastu-home", label: "Vastu & Home" },
  { id: "karungali", label: "Karungali" },
] as const;

export const BESTSELLER_PRODUCTS: BestsellerProduct[] = [];

export const SHOP_BY_WHAT_MATTERS: Record<"purpose" | "crystal" | "planet", WhatMattersItem[]> = {
  purpose: [
    {
      id: "wealth",
      title: "Wealth",
      iconName: "Coins",
      desc: "Money magnet, debt removal & luxury growth",
      query: "bracelets",
    },
    {
      id: "love",
      title: "Love",
      iconName: "Heart",
      desc: "Soulmate attraction, marriage bliss & harmony",
      query: "bracelets",
    },
    {
      id: "protection",
      title: "Protection",
      iconName: "Shield",
      desc: "Nazar suraksha, evil eye & negativity shield",
      query: "karungali",
    },
    {
      id: "courage",
      title: "Courage",
      iconName: "Zap",
      desc: "Confidence, fearlessness & leadership boost",
      query: "zodiac",
    },
    {
      id: "peace",
      title: "Peace",
      iconName: "Sparkles",
      desc: "Mental calmness, anxiety relief & sound sleep",
      query: "vastu-home",
    },
    {
      id: "luck",
      title: "Luck",
      iconName: "Award",
      desc: "Favorable destiny, sudden opportunities & grace",
      query: "bracelets",
    },
    {
      id: "gifting",
      title: "Gifting",
      iconName: "Gift",
      desc: "Consecrated blessings for festive & sacred events",
      query: "vastu-home",
    },
    {
      id: "rashi",
      title: "Shop by Rashi",
      iconName: "Compass",
      desc: "Personalized birth sign rings & talisman bands",
      query: "zodiac",
    },
  ],
  crystal: [
    {
      id: "pyrite",
      title: "Pyrite",
      iconName: "Sparkles",
      desc: "The Fool's Gold - Unstoppable wealth magnet",
      query: "bracelets",
    },
    {
      id: "amethyst",
      title: "Amethyst",
      iconName: "Moon",
      desc: "Third eye intuition, stress relief & aura cleanse",
      query: "bracelets",
    },
    {
      id: "tiger-eye",
      title: "Tiger Eye",
      iconName: "Flame",
      desc: "Fierce confidence, willpower & career focus",
      query: "zodiac",
    },
    {
      id: "rose-quartz",
      title: "Rose Quartz",
      iconName: "Heart",
      desc: "Unconditional self-love, emotional harmony & grace",
      query: "bracelets",
    },
    {
      id: "clear-quartz",
      title: "Clear Quartz",
      iconName: "Sparkles",
      desc: "Master energy amplifier & absolute mental clarity",
      query: "vastu-home",
    },
    {
      id: "citrine",
      title: "Citrine",
      iconName: "Sun",
      desc: "Merchant's stone for business expansion & joy",
      query: "bracelets",
    },
    {
      id: "black-tourmaline",
      title: "Black Tourmaline",
      iconName: "Shield",
      desc: "Ultimate electromagnetic & psychic protection",
      query: "karungali",
    },
    {
      id: "green-aventurine",
      title: "Green Aventurine",
      iconName: "Coins",
      desc: "Stone of new opportunities & financial luck",
      query: "bracelets",
    },
  ],
  planet: [
    {
      id: "sun",
      title: "Sun (Surya)",
      iconName: "Sun",
      desc: "Leadership, royal favor, vitality & fame",
      query: "zodiac",
    },
    {
      id: "moon",
      title: "Moon (Chandra)",
      iconName: "Moon",
      desc: "Emotional balance, peaceful mind & mother's grace",
      query: "bracelets",
    },
    {
      id: "mars",
      title: "Mars (Mangal)",
      iconName: "Flame",
      desc: "Energy, courage, property success & Manglik shanti",
      query: "zodiac",
    },
    {
      id: "mercury",
      title: "Mercury (Budh)",
      iconName: "Sparkles",
      desc: "Intellect, commerce, trade & communication",
      query: "bracelets",
    },
    {
      id: "jupiter",
      title: "Jupiter (Brihaspati)",
      iconName: "Award",
      desc: "Divine wisdom, fortune, children's bliss & expansion",
      query: "vastu-home",
    },
    {
      id: "venus",
      title: "Venus (Shukra)",
      iconName: "Heart",
      desc: "Luxury, romance, glamour & aesthetic attraction",
      query: "zodiac",
    },
    {
      id: "saturn",
      title: "Saturn (Shani)",
      iconName: "Shield",
      desc: "Sade Sati protection, patience & karmic stability",
      query: "karungali",
    },
    {
      id: "rahu-ketu",
      title: "Rahu & Ketu",
      iconName: "Compass",
      desc: "Subconscious illusions, sudden windfalls & liberation",
      query: "bracelets",
    },
  ],
};

export const CUSTOMER_REELS: CustomerReel[] = [];
