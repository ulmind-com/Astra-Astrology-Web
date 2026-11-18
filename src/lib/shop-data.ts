export interface ShopHeroBanner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  badge_text?: string | null;
  image_url: string;
  is_active?: boolean;
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
    id: "banner-1",
    title: "WEAR YOUR ZODIAC",
    subtitle: "DISCOVER THE NEW ZODIAC RING COLLECTION.",
    cta_text: "SHOP NOW",
    cta_link: "/shop?category=zodiac",
    badge_text: "NEW LAUNCH",
    image_url: "/images/banners/banner-zodiac.jpg",
    is_active: true,
  },
  {
    id: "banner-2",
    title: "SACRED NEPALI RUDRAKSHA",
    subtitle: "100% LAB-CERTIFIED & ENERGISED BY TOP ASTROLOGERS.",
    cta_text: "EXPLORE MALAS",
    cta_link: "/shop?category=karungali",
    badge_text: "PRANA-PRATISHTHIT",
    image_url: "/images/banners/banner-rudraksha.jpg",
    is_active: true,
  },
  {
    id: "banner-3",
    title: "SUPER DHAN YOG BAND",
    subtitle: "ATTRACT ABUNDANCE, REMOVE DEBT & ACTIVATE LAKSHMI YOG.",
    cta_text: "ORDER NOW",
    cta_link: "/shop?category=bracelets",
    badge_text: "BESTSELLER",
    image_url: "/images/banners/banner-dhanyog.jpg",
    is_active: true,
  },
  {
    id: "banner-4",
    title: "ORIGINAL KARUNGALI MALA",
    subtitle: "NATURAL BLACK EBONY WOOD CONSECRATED FOR TOTAL PROTECTION.",
    cta_text: "VIEW KARUNGALI",
    cta_link: "/shop?category=karungali",
    badge_text: "DIVINE SHIELD",
    image_url: "/images/banners/banner-karungali.jpg",
    is_active: true,
  },
  {
    id: "banner-5",
    title: "PRAN-PRATISHTHIT RATNA",
    subtitle: "GOVERNMENT LAB CERTIFIED YELLOW SAPPHIRE, BLUE SAPPHIRE & CORAL.",
    cta_text: "CONSULT & BUY",
    cta_link: "/shop?category=zodiac",
    badge_text: "LAB CERTIFIED",
    image_url: "/images/banners/banner-gemstones.jpg",
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

export const BESTSELLER_PRODUCTS: BestsellerProduct[] = [
  {
    id: "prod-leo-zodiac-bracelet",
    title: "Leo Zodiac Metal Bracelet with FREE Tiger Eye & Citrine",
    slug: "leo-zodiac-metal-bracelet",
    category: "zodiac",
    category_label: "Zodiac",
    subtitle_tag: "Leo / সিংহ (23 Jul - 22 Aug)",
    badge: "FREE",
    badge_type: "offer",
    sale_price: 999,
    mrp: 1700,
    discount_percent: 41,
    image: "https://images.unsplash.com/photo-1611591475879-166258f33cf2?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "সূর্য গ্রহের আত্মবিশ্বাস ও তেজ বৃদ্ধি",
      "অশুভ নজর ও মানসিক ক্লান্তি থেকে সুরক্ষা",
      "কর্মক্ষেত্রে নেতৃত্ব ও সিদ্ধান্ত গ্রহণের ক্ষমতা বৃদ্ধি",
    ],
    description:
      "খাঁটি অষ্টধাতু ও পবিত্র ধাতুনির্মিত সিংহ রাশির সৌভাগ্য বর্ধক ব্রেসলেট। সাথে সম্পূর্ণ বিনামূল্যে ধন আকর্ষক প্রাকৃতিক টাইগার আই এবং সাইট্রিন ক্রিস্টাল অন্তর্ভুক্ত।",
    ruling_planet: "Sun",
    deity: "Surya Dev",
  },
  {
    id: "prod-pyrite-stud-ring",
    title: "Pyrite Stud Ring (Handcrafted 925 Sterling Silver)",
    slug: "pyrite-stud-ring",
    category: "bracelets",
    category_label: "Ring",
    subtitle_tag: "Fool's Gold • Money Magnet",
    badge: "Bestseller",
    badge_type: "trend",
    sale_price: 799,
    mrp: 1400,
    discount_percent: 43,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "আর্থিক প্রাচুর্য ও নতুন আয়ের পথ উন্মোচন",
      "ব্যাবসায়িক সিদ্ধান্ত গ্রহণে স্পষ্টতা",
      "ধনহানি ও অতিরিক্ত অর্থ অপচয় রোধ",
    ],
    description:
      "আসল প্রাকৃতিক শিমারিং পাইরাইট স্টাড রিং, ৯২৫ স্টার্লিং সিলভারে খচিত। কুবের ও কনকধারা স্তোত্রে ১০৮ বার জপকৃত ও প্রাণ-প্রতিষ্ঠিত।",
    ruling_planet: "Jupiter & Lakshmi",
    deity: "Maha Lakshmi & Kuber",
  },
  {
    id: "prod-mulank-4-rahu",
    title: "Mulank 4 Rahu Crystal Bracelet with Black Agate & Lava Stone",
    slug: "mulank-4-rahu-crystal-bracelet",
    category: "bracelets",
    category_label: "Bracelet",
    subtitle_tag: "Mulank 4 (Born on 4, 13, 22, 31)",
    badge: "Mulank 4",
    badge_type: "numerology",
    sale_price: 999,
    mrp: 2700,
    discount_percent: 63,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "রাহু গ্রহের বিভ্রান্তি ও আকস্মিক ক্ষতি প্রশমন",
      "মানসিক একাগ্রতা ও লক্ষ্য অর্জনে অবিচলতা",
      "আইনি জটিলতা ও শত্রুভয় থেকে মুক্তি",
    ],
    description:
      "৪ মূলাঙ্কের জাতক-জাতিকাদের জন্য বিশেষ রাহুমুখী প্রাকৃতিক ব্ল্যাক অগেট, লাভা স্টোন ও ক্রিস্টাল কম্বিনেশন ব্রেসলেট।",
    ruling_planet: "Rahu",
    deity: "Ganesha & Bhairava",
  },
  {
    id: "prod-super-dhan-yog",
    title: "Super Dhan Yog Band (Wealth & Lakshmi Magnet Multi-Stone)",
    slug: "super-dhan-yog-band",
    category: "bracelets",
    category_label: "Bracelet",
    subtitle_tag: "Multi-Crystal Band",
    badge: "Most Loved",
    badge_type: "luxury",
    sale_price: 1099,
    mrp: 1700,
    discount_percent: 35,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "স্থায়ী ধনলাভ ও ব্যবসায় বিক্রয় বৃদ্ধি",
      "আটকে থাকা অর্থ প্রাপ্তি ও ঋণমুক্তি",
      "ইতিবাচক শক্তি ও সুযোগ আকর্ষণ",
    ],
    description:
      "পাইরাইট, গ্রিন অ্যাভেনচুরিন, সাইট্রিন এবং টাইগার আই-এর ৪ স্তরের শক্তিশালী সংমিশ্রণে তৈরি সুপার ধন যোগ ব্যান্ড।",
    ruling_planet: "Mercury & Jupiter",
    deity: "Maha Lakshmi",
  },
  {
    id: "prod-karungali-mala-108",
    title: "Original Karungali Malai (108 Consecrated Pure Ebony Beads)",
    slug: "original-karungali-malai",
    category: "karungali",
    category_label: "Karungali",
    subtitle_tag: "108 Beads • Silver Capped",
    badge: "Govt. Lab Certified",
    badge_type: "cert",
    sale_price: 1299,
    mrp: 2499,
    discount_percent: 48,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "কু-দৃষ্টি ও নেতিবাচক তন্ত্রবাধা থেকে দিব্য সুরক্ষা",
      "শনি ও মঙ্গল দোষ প্রশমন",
      "রক্তচাপ ও স্নায়বিক উদ্বেগ নিয়ন্ত্রণ",
    ],
    description:
      "১০০% খাঁটি প্রাকৃতিক কালো আবলুস (এবোনি) কাঠের ১০৮ দানার সিদ্ধ মালা। তামিলনাড়ুর প্রাচীন সিদ্ধ ক্ষেত্র থেকে সংগৃহীত এবং প্রাণ-প্রতিষ্ঠিত।",
    ruling_planet: "Mars & Saturn",
    deity: "Murugan & Lord Shiva",
  },
  {
    id: "prod-vastu-kamdhenu",
    title: "Vastu Kamdhenu Cow with Calf & Consecrated Shri Yantra",
    slug: "vastu-kamdhenu-cow-shri-yantra",
    category: "vastu-home",
    category_label: "Vastu & Home",
    subtitle_tag: "Pure Brass • Northeast Placement",
    badge: "Vastu Blessed",
    badge_type: "home",
    sale_price: 1499,
    mrp: 2999,
    discount_percent: 50,
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "গৃহের উত্তর-পূর্ব ঈশান কোণের বাস্তুদোষ নিবারণ",
      "পারিবারিক অশান্তি দূর ও বংশবৃদ্ধি",
      "সমগ্র পরিবারে স্বাস্থ্য ও মানসিক শান্তি",
    ],
    description:
      "খাঁটি পিতলের শ্রী কামধেনু ও বাছুর, যার পেটে খোদাই করা রয়েছে সিদ্ধ শ্রী যন্ত্র। বৈদিক পণ্ডিতদের দ্বারা শোধনকৃত।",
    ruling_planet: "Jupiter & Moon",
    deity: "Kamdhenu & Shri Yantra",
  },
  {
    id: "prod-pyrite-raw-cluster",
    title: "Natural Pyrite Golden Cluster for Cash Box & Work Desk",
    slug: "natural-pyrite-golden-cluster",
    category: "vastu-home",
    category_label: "Vastu & Home",
    subtitle_tag: "250g Mineral Specimen",
    badge: "100% Raw",
    badge_type: "trend",
    sale_price: 699,
    mrp: 1299,
    discount_percent: 46,
    image: "https://images.unsplash.com/photo-1611591475879-166258f33cf2?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "ক্যাশ বাক্স বা ক্যাশ কাউন্টারে অর্থ আকর্ষণ",
      "অনলাইন ব্যবসা ও বিনিয়োগে সৌভাগ্য",
      "কর্মক্ষেত্রে ইলেক্ট্রোম্যাগনেটিক রেডিয়েশন শোষণ",
    ],
    description:
      "প্রাকৃতিক খাঁটি আনকাট পাইরাইট ক্লাস্টার। সোনালী ধাতব আভা যুক্ত আসল খনিজ পাথর, যা অর্থ আকর্ষণের জন্য বিশ্ববিখ্যাত।",
    ruling_planet: "Sun & Jupiter",
    deity: "Lord Kuber",
  },
  {
    id: "prod-aries-zodiac-ring",
    title: "Aries / Mesh Consecrated Zodiac Ring (Adjustable Silver)",
    slug: "aries-mesh-consecrated-zodiac-ring",
    category: "zodiac",
    category_label: "Zodiac",
    subtitle_tag: "Red Jasper • 925 Plated",
    badge: "New Launch",
    badge_type: "trend",
    sale_price: 899,
    mrp: 1599,
    discount_percent: 44,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    benefits: [
      "মঙ্গল গ্রহের তেজ ও আত্মবিশ্বাস বৃদ্ধি",
      "সাহস ও উদ্যম বৃদ্ধি",
      "মাঙ্গলিক দোষ ও শারীরিক দুর্বলতা প্রশমন",
    ],
    description:
      "মেষ রাশির জন্য জ্যোতিষী নির্ধারিত প্রাকৃতিক রেড জ্যাসপার ও রাশি প্রতীকের সমন্বয়ে তৈরি নান্দনিক আঙটি।",
    ruling_planet: "Mars",
    deity: "Hanuman Ji",
  },
];

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

export const CUSTOMER_REELS: CustomerReel[] = [
  {
    id: "reel-1",
    user_handle: "@sneha_vats",
    user_name: "Sneha Vats",
    rating: 5,
    quote: "Wearing the 7-Mukhi Rudraksha cleared my Saturn Sade Sati career blocks in 3 weeks! 🌟",
    thumbnail_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-sparkling-gemstone-41315-large.mp4",
    likes_count: "4.8k",
    tagged_product_title: "খাঁটি নেপালি ৭-মুখী রুদ্রাক্ষ",
    tagged_product_price: 1899,
    tagged_product_slug: "nepali-7-mukhi-rudraksha",
    is_active: true,
  },
  {
    id: "reel-2",
    user_handle: "@rohit_astroglow",
    user_name: "Rohit K.",
    rating: 5,
    quote: "Unboxing my Super Dhan Yog Band! The energy feel is absolutely authentic and energizing. 💰",
    thumbnail_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-woman-wearing-spiritual-beads-bracelet-43098-large.mp4",
    likes_count: "3.9k",
    tagged_product_title: "Super Dhan Yog Band",
    tagged_product_price: 1099,
    tagged_product_slug: "super-dhan-yog-band",
    is_active: true,
  },
  {
    id: "reel-3",
    user_handle: "@dr_kunal",
    user_name: "Dr. Kunal Mehta",
    rating: 5,
    quote: "Pyrite Stud Ring transformed my clinic consultation inquiries within a month! ✨",
    thumbnail_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-shiny-gemstones-and-crystals-on-display-42410-large.mp4",
    likes_count: "5.2k",
    tagged_product_title: "Pyrite Stud Ring",
    tagged_product_price: 799,
    tagged_product_slug: "pyrite-stud-ring",
    is_active: true,
  },
  {
    id: "reel-4",
    user_handle: "@ananya_sen",
    user_name: "Ananya Sen",
    rating: 5,
    quote: "Original Karungali Mala quality is incredible, heavy and pure ebony wood with silver caps. 🙏",
    thumbnail_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-hands-holding-rosary-beads-42998-large.mp4",
    likes_count: "4.1k",
    tagged_product_title: "Original Karungali Malai (108 Beads)",
    tagged_product_price: 1299,
    tagged_product_slug: "original-karungali-malai",
    is_active: true,
  },
  {
    id: "reel-5",
    user_handle: "@vikram_aditya",
    user_name: "Vikram Aditya",
    rating: 5,
    quote: "Mulank 4 Rahu bracelet brought immense mental focus and shielded me from burnout. 🔮",
    thumbnail_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    video_url: "https://assets.mixkit.co/videos/preview/mixkit-person-meditating-with-crystals-in-front-42350-large.mp4",
    likes_count: "2.8k",
    tagged_product_title: "Mulank 4 Rahu Crystal Bracelet",
    tagged_product_price: 999,
    tagged_product_slug: "mulank-4-rahu-crystal-bracelet",
    is_active: true,
  },
];
