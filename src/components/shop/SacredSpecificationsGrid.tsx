"use client";

import * as React from "react";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Flame,
  CheckCircle2,
  Activity,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";

import { useLanguage } from "@/providers/language-provider";

interface SacredSpecificationsGridProps {
  rulingPlanet?: string | null;
  deity?: string | null;
  crystalType?: string | null;
  beejMantra?: string | null;
  recommendedRashis?: string[];
  productTitle: string;
  categorySlug?: string | null;
}

// ---------------------------------------------------------------------------
// Planetary Harmony Canon Database
// ---------------------------------------------------------------------------
interface PlanetHarmonyData {
  canonicalName: string;
  nameBn: string;
  nameEn: string;
  symbol: string;
  devataBn: string;
  devataEn: string;
  colorTailwind: string;
  naturalVibration: number; // e.g. 42%
  remedyVibration: number; // e.g. 96%
  harmonicFreq: string;
  chakraBn: string;
  chakraEn: string;
  scripturalQuoteBn: string;
  scripturalQuoteEn: string;
}

const PLANET_HARMONY_MAP: Record<string, PlanetHarmonyData> = {
  jupiter: {
    canonicalName: "Jupiter (Guru)",
    nameBn: "বৃহস্পতি (দেবগুরু)",
    nameEn: "Jupiter (Guru)",
    symbol: "♃",
    devataBn: "ভগবান শিব ও দেবগুরু বৃহস্পতি",
    devataEn: "Lord Shiva & Devaguru Brihaspati",
    colorTailwind: "from-amber-400 to-yellow-500",
    naturalVibration: 42,
    remedyVibration: 96,
    harmonicFreq: "528 Hz (Miracle & Wisdom)",
    chakraBn: "মণিপুর ও আজ্ঞা চক্র (Solar Plexus & Third Eye)",
    chakraEn: "Solar Plexus & Third Eye Chakra",
    scripturalQuoteBn:
      "শিবপুরাণ মতে, পঞ্চমুখী রুদ্রাক্ষ কালাগ্নিরুদ্র স্বরূপ। এটি ধারণে দেবগুরু বৃহস্পতির দুর্বলতা দূরীভূত হয়ে মানসিক একাগ্রতা ও আধ্যাত্মিক জ্ঞান ৯৬% পর্যন্ত কেন্দ্রীভূত হয়।",
    scripturalQuoteEn:
      "According to Shiva Purana, the 5-Mukhi Rudraksha embodies Kalagni Rudra. Wearing it harmonizes Jupiter's cosmic wavelength, amplifying memory, wisdom and aura shield up to 96%.",
  },
  saturn: {
    canonicalName: "Saturn (Shani)",
    nameBn: "শনি (কর্মফলদাতা)",
    nameEn: "Saturn (Shani)",
    symbol: "♄",
    devataBn: "ভগবান হনুমান ও শনিদেব",
    devataEn: "Lord Hanuman & Lord Shani",
    colorTailwind: "from-indigo-600 to-blue-900",
    naturalVibration: 38,
    remedyVibration: 94,
    harmonicFreq: "432 Hz (Universal Stability)",
    chakraBn: "মূলাধার চক্র (Root Chakra)",
    chakraEn: "Root Chakra (Muladhara)",
    scripturalQuoteBn:
      "শনির সাড়ে সাতি ও ঢাইয়ার কুপ্রভাব প্রশমিত করে জীবনে শৃঙ্খলা, স্থায়িত্ব ও কর্মসাফল্যের শুভ কম্পন ৯৪% পর্যন্ত বৃদ্ধি করে।",
    scripturalQuoteEn:
      "Subdues malefic effects of Sade Sati and Dhaiya, instilling deep discipline, perseverance and spiritual grounding up to 94%.",
  },
  mars: {
    canonicalName: "Mars (Mangala)",
    nameBn: "মঙ্গল (সেনাপতি)",
    nameEn: "Mars (Mangal)",
    symbol: "♂",
    devataBn: "ভগবান কার্তিকেয় ও বজরংবলী",
    devataEn: "Lord Kartikeya & Hanuman",
    colorTailwind: "from-rose-500 to-red-700",
    naturalVibration: 40,
    remedyVibration: 95,
    harmonicFreq: "639 Hz (Vitality & Courage)",
    chakraBn: "স্বাধিষ্ঠান ও মূলাধার চক্র",
    chakraEn: "Sacral & Root Chakra",
    scripturalQuoteBn:
      "মাঙ্গলিক দোষ ও অতিরিক্ত ক্রোধ নিয়ন্ত্রণ করে অদম্য সাহস ও রক্তচাপের ভারসাম্য ফিরিয়ে এনে আত্মরক্ষা শক্তি ৯৫% বৃদ্ধি করে।",
    scripturalQuoteEn:
      "Pacifies Mangal Dosha, channelizing intense fiery energy into unwavering courage, physical stamina and protection.",
  },
  sun: {
    canonicalName: "Sun (Surya)",
    nameBn: "সূর্য (আত্মাকারক)",
    nameEn: "Sun (Surya)",
    symbol: "☉",
    devataBn: "ভগবান সূর্যনারায়ণ ও বিষ্ণু",
    devataEn: "Lord Suryanarayana & Vishnu",
    colorTailwind: "from-amber-500 to-orange-600",
    naturalVibration: 45,
    remedyVibration: 98,
    harmonicFreq: "741 Hz (Radiance & Sovereignty)",
    chakraBn: "অনাহত ও মণিপুর চক্র",
    chakraEn: "Heart & Solar Plexus Chakra",
    scripturalQuoteBn:
      "আত্মবিশ্বাস, পিতৃদোষ মুক্তি ও সমাজে রাজসম্মান প্রতিষ্ঠার দিব্য আলো বিকিরণ করে ৯৮% পূর্ণ শুভত্ব প্রদান করে।",
    scripturalQuoteEn:
      "Ignites self-sovereignty, royal charisma, vitality and removes ancestral Pitra Dosha.",
  },
  mercury: {
    canonicalName: "Mercury (Budha)",
    nameBn: "বুধ (বুদ্ধিকারক)",
    nameEn: "Mercury (Budha)",
    symbol: "☿",
    devataBn: "ভগবান গণেশ ও দেবী সরস্বতী",
    devataEn: "Lord Ganesha & Goddess Saraswati",
    colorTailwind: "from-emerald-500 to-teal-700",
    naturalVibration: 44,
    remedyVibration: 95,
    harmonicFreq: "528 Hz (Transformation & Intellect)",
    chakraBn: "বিশুদ্ধ চক্র (Throat Chakra)",
    chakraEn: "Throat Chakra (Vishuddha)",
    scripturalQuoteBn:
      "বাকসিদ্ধি, ব্যবসায়িক দূরদর্শিতা ও পরীক্ষার স্মৃতিশক্তি বৃদ্ধি করে স্নায়বিক উদ্বেগকে ৯৫% পর্যন্ত প্রশমিত করে।",
    scripturalQuoteEn:
      "Sharpens analytical intellect, communication prowess, memory retention and commercial success.",
  },
  venus: {
    canonicalName: "Venus (Shukra)",
    nameBn: "শুক্র (সৌন্দর্য ও ধনকারক)",
    nameEn: "Venus (Shukra)",
    symbol: "♀",
    devataBn: "দেবী মহালক্ষ্মী",
    devataEn: "Goddess Mahalakshmi",
    colorTailwind: "from-pink-400 to-rose-500",
    naturalVibration: 41,
    remedyVibration: 96,
    harmonicFreq: "639 Hz (Harmonious Relationships)",
    chakraBn: "অনাহত চক্র (Heart Chakra)",
    chakraEn: "Heart Chakra (Anahata)",
    scripturalQuoteBn:
      "আকর্ষণ শক্তি, দাম্পত্য সুখ ও আর্থিক সমৃদ্ধির পথ সুগম করে শুক্রের শুভত্ব ৯৬% স্তরে উন্নীত করে।",
    scripturalQuoteEn:
      "Magnetizes luxury, romantic harmony, artistic excellence and divine prosperity.",
  },
  moon: {
    canonicalName: "Moon (Chandra)",
    nameBn: "চন্দ্র (মনঃকারক)",
    nameEn: "Moon (Chandra)",
    symbol: "☽",
    devataBn: "ভগবান শিব ও দেবী পার্বতী",
    devataEn: "Lord Shiva & Goddess Parvati",
    colorTailwind: "from-sky-300 to-cyan-500",
    naturalVibration: 39,
    remedyVibration: 95,
    harmonicFreq: "432 Hz (Emotional Serenity)",
    chakraBn: "সহস্রার ও আজ্ঞা চক্র",
    chakraEn: "Crown & Third Eye Chakra",
    scripturalQuoteBn:
      "মানসিক অস্থিরতা, দুশ্চিন্তা ও বিষণ্ণতা দূর করে গভীর অভ্যন্তরীণ শান্তি ও প্রশান্ত নিদ্রা নিশ্চিত করে।",
    scripturalQuoteEn:
      "Dissolves emotional turmoil, anxiety and mood swings, restoring profound lunar calmness.",
  },
};

function resolvePlanetHarmony(rawPlanet?: string | null): PlanetHarmonyData {
  if (!rawPlanet) return PLANET_HARMONY_MAP.jupiter;
  const lower = rawPlanet.toLowerCase();
  if (lower.includes("guru") || lower.includes("jupiter") || lower.includes("বৃহস্পতি")) {
    return PLANET_HARMONY_MAP.jupiter;
  }
  if (lower.includes("shani") || lower.includes("saturn") || lower.includes("শনি")) {
    return PLANET_HARMONY_MAP.saturn;
  }
  if (lower.includes("mangal") || lower.includes("mars") || lower.includes("মঙ্গল")) {
    return PLANET_HARMONY_MAP.mars;
  }
  if (lower.includes("surya") || lower.includes("sun") || lower.includes("সূর্য")) {
    return PLANET_HARMONY_MAP.sun;
  }
  if (lower.includes("budh") || lower.includes("mercury") || lower.includes("বুধ")) {
    return PLANET_HARMONY_MAP.mercury;
  }
  if (lower.includes("shukra") || lower.includes("venus") || lower.includes("শুক্র")) {
    return PLANET_HARMONY_MAP.venus;
  }
  if (lower.includes("chandra") || lower.includes("moon") || lower.includes("চন্দ্র")) {
    return PLANET_HARMONY_MAP.moon;
  }
  return PLANET_HARMONY_MAP.jupiter;
}

// ---------------------------------------------------------------------------
// 12 Rashis Astrological Canon Database
// ---------------------------------------------------------------------------
interface RashiCanon {
  key: string;
  nameBn: string;
  nameEn: string;
  symbol: string;
  elementBn: string;
  elementEn: string;
  lordBn: string;
  lordEn: string;
  whyBestBn: string;
  whyBestEn: string;
  compatibilityScore: number;
}

const ALL_RASHIS_CANON: RashiCanon[] = [
  {
    key: "mesha",
    nameBn: "মেষ",
    nameEn: "Aries (Mesha)",
    symbol: "♈",
    elementBn: "অগ্নি তত্ত্ব",
    elementEn: "Fire Element",
    lordBn: "মঙ্গল",
    lordEn: "Mars",
    whyBestBn:
      "মঙ্গলের তীব্র তেজকে দেবগুরুর আধ্যাত্মিক শীতলতায় রূপান্তর করে। অতিরিক্ত রাগ ও অস্থিরতা দূর করে নির্ভুল নেতৃত্বের ক্ষমতা দেয়।",
    whyBestEn:
      "Temples Martian aggression with Jupiterian wisdom, fostering calm leadership and strategic focus.",
    compatibilityScore: 95,
  },
  {
    key: "vrishabha",
    nameBn: "বৃষ",
    nameEn: "Taurus (Vrishabha)",
    symbol: "♉",
    elementBn: "পৃথিবী তত্ত্ব",
    elementEn: "Earth Element",
    lordBn: "শুক্র",
    lordEn: "Venus",
    whyBestBn:
      "আর্থিক স্থিতিশীলতা রক্ষা করে এবং বস্তুগত সমৃদ্ধির সাথে আধ্যাত্মিক তৃপ্তি এনে দেয়। ব্যবসায়িক সিদ্ধান্ত নির্ভুল রাখে।",
    whyBestEn:
      "Grounds material ambitions with spiritual contentment and financial discernment.",
    compatibilityScore: 92,
  },
  {
    key: "mithuna",
    nameBn: "মিথুন",
    nameEn: "Gemini (Mithuna)",
    symbol: "♊",
    elementBn: "বায়ু তত্ত্ব",
    elementEn: "Air Element",
    lordBn: "বুধ",
    lordEn: "Mercury",
    whyBestBn:
      "দ্বিধাদ্বন্দ্ব ও স্নায়বিক দুর্বলতা কাটিয়ে গভীর মনঃসংযোগ বৃদ্ধি করে। যোগাযোগ ও সৃজনশীলতায় অনন্য দক্ষতা প্রদান করে।",
    whyBestEn:
      "Eliminates mental duality and nervous stress, supercharging memory and articulate expression.",
    compatibilityScore: 94,
  },
  {
    key: "karka",
    nameBn: "কর্কট",
    nameEn: "Cancer (Karka)",
    symbol: "♋",
    elementBn: "জল তত্ত্ব",
    elementEn: "Water Element",
    lordBn: "চন্দ্র",
    lordEn: "Moon",
    whyBestBn:
      "চন্দ্রের ঘন ঘন মুড সুইং ও মানসিক অতিরিক্ত সংবেদনশীলতাকে শান্ত করে এক শক্তিশালী আত্মিক সুরক্ষাকবচ তৈরি করে।",
    whyBestEn:
      "Soothes lunar emotional turbulence, offering a sanctuary of mental clarity and calm intuition.",
    compatibilityScore: 93,
  },
  {
    key: "simha",
    nameBn: "সিংহ",
    nameEn: "Leo (Simha)",
    symbol: "♌",
    elementBn: "অগ্নি তত্ত্ব",
    elementEn: "Fire Element",
    lordBn: "সূর্য",
    lordEn: "Sun",
    whyBestBn:
      "সূর্য ও বৃহস্পতির পরম মিত্রতা সিংহ রাশির জাতককে অপ্রতিদ্বন্দ্বী তেজ, অহংকারহীন প্রজ্ঞা ও রাজসম্মান এনে দেয়।",
    whyBestEn:
      "Harnesses solar vitality into sovereign dignity, high social honor and noble wisdom.",
    compatibilityScore: 98,
  },
  {
    key: "kanya",
    nameBn: "কন্যা",
    nameEn: "Virgo (Kanya)",
    symbol: "♍",
    elementBn: "পৃথিবী তত্ত্ব",
    elementEn: "Earth Element",
    lordBn: "বুধ",
    lordEn: "Mercury",
    whyBestBn:
      "অতিরিক্ত চিন্তা ও পারফেকশনিজমের মানসিক ক্লান্তি দূর করে আত্মবিশ্বাস ও স্বাস্থ্য রক্ষা করে।",
    whyBestEn:
      "Relieves overthinking and chronic worry, restoring mental ease and practical execution.",
    compatibilityScore: 93,
  },
  {
    key: "tula",
    nameBn: "তুলা",
    nameEn: "Libra (Tula)",
    symbol: "♎",
    elementBn: "বায়ু তত্ত্ব",
    elementEn: "Air Element",
    lordBn: "শুক্র",
    lordEn: "Venus",
    whyBestBn:
      "জীবনের প্রতিটি পদক্ষেপে ভারসাম্য রক্ষা করে। অন্যায্য সম্পর্কের জটিলতা কাটিয়ে সামাজিক শ্রদ্ধা নিশ্চিত করে।",
    whyBestEn:
      "Brings celestial equilibrium, harmonious partnerships and moral clarity.",
    compatibilityScore: 91,
  },
  {
    key: "vrischika",
    nameBn: "বৃশ্চিক",
    nameEn: "Scorpio (Vrischika)",
    symbol: "♏",
    elementBn: "জল তত্ত্ব",
    elementEn: "Water Element",
    lordBn: "মঙ্গল",
    lordEn: "Mars",
    whyBestBn:
      "অভ্যন্তরীণ গোপন ভয় ও নেতিবাচক চিন্তা বিনাশ করে ইচ্ছাশক্তিকে লক্ষ্যভেদী করে তোলে। শত্রুদোষ নিবারণ করে।",
    whyBestEn:
      "Shields from psychic negativity, transmuting internal intensity into immense occult protection.",
    compatibilityScore: 96,
  },
  {
    key: "dhanu",
    nameBn: "ধনু",
    nameEn: "Sagittarius (Dhanu)",
    symbol: "♐",
    elementBn: "অগ্নি তত্ত্ব",
    elementEn: "Fire Element",
    lordBn: "বৃহস্পতি",
    lordEn: "Jupiter",
    whyBestBn:
      "ধনু রাশির নিজস্ব অধিপতি বৃহস্পতি হওয়ায় এই রুদ্রাক্ষ জাতকের ভাগ্যোদয়, উচ্চশিক্ষা, গুরুকৃপা ও পরম আধ্যাত্মিক উৎকর্ষ নিশ্চিত করে।",
    whyBestEn:
      "Own sign of Jupiter — unlocks supreme spiritual fortune, academic mastery, divine guru blessings and Dharma.",
    compatibilityScore: 99,
  },
  {
    key: "makara",
    nameBn: "মকর",
    nameEn: "Capricorn (Makara)",
    symbol: "♑",
    elementBn: "পৃথিবী তত্ত্ব",
    elementEn: "Earth Element",
    lordBn: "শনি",
    lordEn: "Saturn",
    whyBestBn:
      "শনির বিলম্বিত ফল ও কঠোর পরিশ্রমের মাঝে দেবগুরুর করুণায় অপ্রত্যাশিত সুযোগ ও সম্মান তৈরি করে।",
    whyBestEn:
      "Infuses Saturnian endurance with divine grace, turning grueling delays into monumental breakthroughs.",
    compatibilityScore: 94,
  },
  {
    key: "kumbha",
    nameBn: "কুম্ভ",
    nameEn: "Aquarius (Kumbha)",
    symbol: "♒",
    elementBn: "বায়ু তত্ত্ব",
    elementEn: "Air Element",
    lordBn: "শনি",
    lordEn: "Saturn",
    whyBestBn:
      "দূরদর্শী ভাবনা ও মানবকল্যাণের স্বপ্নকে বাস্তবে রূপায়িত করতে মানসিক শক্তি ও আর্থিক প্রাচুর্য আনে।",
    whyBestEn:
      "Grounds revolutionary vision with higher mental endurance and collective prosperity.",
    compatibilityScore: 95,
  },
  {
    key: "meena",
    nameBn: "মীন",
    nameEn: "Pisces (Meena)",
    symbol: "♓",
    elementBn: "জল তত্ত্ব",
    elementEn: "Water Element",
    lordBn: "বৃহস্পতি",
    lordEn: "Jupiter",
    whyBestBn:
      "বৃহস্পতির জলতাত্ত্বিক গৃহ হওয়ায় মীন রাশির আত্মিক চোখ খুলে দেয়। অন্তর্দৃষ্টি, মেডিটেশন ও মোক্ষলাভের পরম পথ প্রদর্শন করে।",
    whyBestEn:
      "Jupiter's water sanctuary — awakens deep intuition, meditative absorption and spiritual liberation (Moksha).",
    compatibilityScore: 99,
  },
];

export function SacredSpecificationsGrid({
  rulingPlanet,
  deity,
  crystalType,
  beejMantra,
  recommendedRashis = [],
  productTitle,
  categorySlug,
}: SacredSpecificationsGridProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  // Planetary Harmony computation
  const harmonyData = resolvePlanetHarmony(rulingPlanet);

  // Audio State & Web Audio Temple Gong Synth
  const [isPlayingAudio, setIsPlayingAudio] = React.useState<boolean>(false);
  const [japaCount, setJapaCount] = React.useState<number>(0);
  const [showJapaModal, setShowJapaModal] = React.useState<boolean>(false);

  // Selected Rashi Modal/Popover
  const [selectedRashi, setSelectedRashi] = React.useState<RashiCanon | null>(null);

  // Default clean mantra fallback
  const effectiveMantra = beejMantra?.trim() || "ॐ ह्रीं नमः";
  const effectiveDeity = deity?.trim() || "ভগবান শিব ও কালাগ্নিরুদ্র";

  // Play sacred mantra audio with authentic temple gong + speech synthesizer
  const handlePlayMantra = () => {
    if (typeof window === "undefined") return;

    if (isPlayingAudio) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);

      // 1. Play authentic resonant 432Hz temple bell harmonic gong via Web Audio API
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        // Base fundamental bell sine (432 Hz Solfeggio Om)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(432, now);
        gain1.gain.setValueAtTime(0.28, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 2.9);

        // Harmonic overtone (864 Hz octave)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(864, now);
        gain2.gain.setValueAtTime(0.12, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now);
        osc2.stop(now + 1.9);

        // Subtle shimmering third overtone (1296 Hz)
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(1296, now);
        gain3.gain.setValueAtTime(0.05, now);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now);
        osc3.stop(now + 1.3);
      }

      // 2. Pronounce the exact Beej Mantra in meditative priest cadence via SpeechSynthesis
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(effectiveMantra);
        utterance.rate = 0.72; // Slow, sacred, solemn recitation
        utterance.pitch = 0.88; // Deep, resonance of Vedic priest

        // Attempt Indian Sanskrit/Hindi localized voice
        const voices = window.speechSynthesis.getVoices();
        const vedicVoice = voices.find(
          (v) =>
            v.lang.includes("hi-IN") ||
            v.lang.includes("sa-IN") ||
            v.lang.includes("bn-IN") ||
            v.name.includes("India")
        );
        if (vedicVoice) utterance.voice = vedicVoice;

        utterance.onend = () => {
          setIsPlayingAudio(false);
          setJapaCount((prev) => Math.min(108, prev + 1));
        };
        utterance.onerror = () => setIsPlayingAudio(false);

        // Delay speech by 350ms so the temple bell chime leads into the chant
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 350);
      } else {
        // Fallback timer if speech synth not available
        setTimeout(() => {
          setIsPlayingAudio(false);
          setJapaCount((prev) => Math.min(108, prev + 1));
        }, 2200);
      }
    } catch (err) {
      console.warn("Mantra audio playback error:", err);
      setIsPlayingAudio(false);
    }
  };

  // Determine which Rashis to highlight as recommended
  const isRecommended = (canon: RashiCanon) => {
    if (recommendedRashis.length === 0) return true; // Default universally compatible
    return recommendedRashis.some(
      (r) =>
        r.toLowerCase().includes(canon.key) ||
        r.toLowerCase().includes(canon.nameBn) ||
        r.toLowerCase().includes(canon.nameEn.toLowerCase().split(" ")[0])
    );
  };

  return (
    <section className="rounded-3xl border border-amber-300/70 bg-gradient-to-br from-amber-50/60 via-stone-50 to-emerald-50/40 p-4 sm:p-6 shadow-sm space-y-6 transition-all duration-300 relative overflow-hidden">
      {/* Sacred Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-500 to-amber-400" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-3">
        <div className="space-y-0.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest">
            <Sparkles className="size-3.5 text-amber-600" />
            <span>{isBn ? "বৈদিক ও জ্যোতিষীয় পরিচয়" : "Sacred Astrological Canon"}</span>
          </div>
          <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <span>{isBn ? "শাস্ত্ৰীয় শক্তিসূচক ও জ্যোতিষ পরিচয়" : "Vedic Energy & Spiritual Specifications"}</span>
          </h3>
        </div>

        <span className="self-start sm:self-center text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="size-3 text-emerald-600" />
          <span>{isBn ? "কাশী পণ্ডিত অনুমোদিত" : "Kashi Pandit Verified"}</span>
        </span>
      </div>

      {/* =================================================================== */}
      {/* 1. Core Vedic Canon Grid (Planet, Deity, Beej Mantra with Audio) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Card 1: Ruling Planet & Devata (5 cols) */}
        <div className="md:col-span-5 rounded-2xl bg-white/90 border border-amber-200/80 p-3.5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <Compass className="size-3 text-amber-600" />
              <span>{isBn ? "অধিপতি গ্রহ ও ইষ্টদেবতা" : "Ruling Planet & Deity"}</span>
            </span>
            <span className="size-7 rounded-xl bg-amber-500/10 text-amber-800 font-cinzel font-bold text-sm flex items-center justify-center">
              {harmonyData.symbol}
            </span>
          </div>

          <div className="space-y-1">
            <p className="font-cinzel text-base sm:text-lg font-extrabold text-stone-950 flex items-center gap-1.5">
              <span>{isBn ? harmonyData.nameBn : harmonyData.nameEn}</span>
            </p>
            <p className="text-xs text-stone-600 flex items-center gap-1 font-medium">
              <span className="text-stone-400">{isBn ? "অধিষ্ঠাত্রী দেবতা:" : "Deity:"}</span>
              <span className="text-amber-950 font-bold">{effectiveDeity}</span>
            </p>
          </div>

          <div className="rounded-xl bg-stone-50 border border-stone-200/80 p-2 text-[11px] text-stone-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-400">{isBn ? "চক্রের অবস্থান:" : "Chakra:"}</span>
              <span className="font-bold text-stone-800">{isBn ? harmonyData.chakraBn : harmonyData.chakraEn}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">{isBn ? "মহাজাগতিক কম্পন:" : "Frequency:"}</span>
              <span className="font-mono font-bold text-emerald-700">{harmonyData.harmonicFreq}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Beej Mantra with Audio & Pronunciation Guide (7 cols) */}
        <div className="md:col-span-7 rounded-2xl bg-gradient-to-br from-amber-950/95 via-[#1d1a1c] to-stone-950 text-white border border-amber-500/40 p-4 space-y-3 shadow-md relative overflow-hidden">
          {/* Subtle Golden Glow */}
          <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-amber-500/20 blur-xl" />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <Flame className="size-3.5 text-amber-400 animate-pulse" />
              <span>{isBn ? "পবিত্র বীজ মন্ত্র ও উচ্চারণ গাইড" : "Sacred Beej Mantra & Chanting Audio"}</span>
            </span>

            {/* Japa Mala Trigger */}
            <button
              type="button"
              onClick={() => setShowJapaModal(true)}
              className="text-[11px] font-bold text-amber-200 hover:text-white bg-white/10 hover:bg-white/15 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-colors flex items-center gap-1"
            >
              <span>{isBn ? `জপ: ${japaCount}/১০৮` : `Japa: ${japaCount}/108`}</span>
            </button>
          </div>

          {/* Mantra Display & Interactive Play Button */}
          <div className="flex items-center justify-between gap-3 bg-white/5 rounded-2xl p-3 border border-amber-500/30">
            <div className="space-y-0.5">
              <p className="font-serif text-lg sm:text-2xl font-black text-amber-200 tracking-wide">
                {effectiveMantra}
              </p>
              <p className="text-[11px] text-stone-300 font-sans">
                {isBn
                  ? "ধারণকালে ১০৮ বার পাঠে রুদ্রাক্ষের শক্তি পূর্ণরূপে জাগ্রত হয়।"
                  : "Chanting 108 times awakens the consecration matrix."}
              </p>
            </div>

            {/* Sacred Audio Play / Stop Button */}
            <button
              type="button"
              onClick={handlePlayMantra}
              title={isPlayingAudio ? "Stop Chanting" : "Listen to Pure Sanskrit Pronunciation"}
              className={`shrink-0 size-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                isPlayingAudio
                  ? "bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/30 scale-105 animate-pulse"
                  : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 hover:scale-105 shadow-amber-500/30"
              }`}
            >
              {isPlayingAudio ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
            </button>
          </div>

          {/* Waveform Animation & Instruction Footer */}
          <div className="flex items-center justify-between text-[11px] text-amber-200/80 pt-1">
            <div className="flex items-center gap-2">
              {isPlayingAudio ? (
                <div className="flex items-center gap-1">
                  <span className="size-1 rounded-full bg-amber-400 animate-ping" />
                  <span className="font-bold text-amber-300">
                    {isBn ? "শুদ্ধ বৈদিক উচ্চারণে শুনছেন..." : "Playing Pure Vedic Chanting..."}
                  </span>
                  {/* Visualizer bars */}
                  <div className="flex items-center gap-0.5 ml-1.5 h-3">
                    <span className="w-0.5 h-2 bg-amber-400 animate-bounce" />
                    <span className="w-0.5 h-3 bg-amber-300 animate-bounce delay-75" />
                    <span className="w-0.5 h-1.5 bg-amber-500 animate-bounce delay-150" />
                  </div>
                </div>
              ) : (
                <span className="text-stone-400">
                  {isBn ? "▶ বাটনে ট্যাপ করে সঠিক উচ্চারণ শুনুন" : "▶ Tap button to hear authentic pronunciation"}
                </span>
              )}
            </div>

            <span className="text-stone-400 text-[10px]">
              {isBn ? "৪৩২ Hz টেম্পল বেল টিউনিং" : "432 Hz Sacred Tone"}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. Planetary Harmony & Aura Vibration Meter */}
      {/* =================================================================== */}
      <div className="rounded-2xl bg-white/90 border border-amber-200/90 p-4 space-y-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Activity className="size-4 text-emerald-600" />
              <span>
                {isBn
                  ? `প্ল্যানেটারি হারমোনি মিটার (${harmonyData.nameBn}র শুভ প্রভাব)`
                  : `Planetary Harmony Meter (${harmonyData.nameEn})`}
              </span>
            </h4>
            <p className="text-[11px] text-stone-500">
              {isBn
                ? "রুদ্রাক্ষ ধারণের পূর্বে জন্মকুণ্ডলীর সাধারণ ভাইব্রেশন বনাম ধারণের পর শুভ শক্তি বৃদ্ধির চিত্র:"
                : "Baseline astrological vibration vs Post-consecration energized aura strength:"}
            </p>
          </div>

          <span className="self-start sm:self-center text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
            +{(harmonyData.remedyVibration - harmonyData.naturalVibration)}% {isBn ? "শক্তি বৃদ্ধি" : "Power Surge"}
          </span>
        </div>

        {/* Dual Bar Vibration Visualizer */}
        <div className="space-y-2">
          {/* Labels */}
          <div className="flex justify-between text-xs font-bold">
            <span className="text-rose-700 flex items-center gap-1">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>{isBn ? "ন্যাচারাল ভাইব্রেশন:" : "Natural Baseline:"} {harmonyData.naturalVibration}%</span>
              <span className="text-[10px] text-stone-400 font-normal">({isBn ? "দুর্বল অবস্থা" : "Afflicted"})</span>
            </span>

            <span className="text-emerald-700 flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>{isBn ? "ধারণের পর শুভ প্রভাব:" : "Energized Aura:"} {harmonyData.remedyVibration}%</span>
              <span className="text-[10px] text-stone-500 font-normal">({isBn ? "সর্বোচ্চ শুভত্ব" : "Optimal Peak"})</span>
            </span>
          </div>

          {/* Interactive Progress Track */}
          <div className="relative h-4 w-full rounded-full bg-stone-200 overflow-hidden p-0.5 shadow-inner">
            {/* Natural Baseline Shading */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-400 to-amber-400 rounded-l-full opacity-60"
              style={{ width: `${harmonyData.naturalVibration}%` }}
            />

            {/* Energized Surge Bar */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-600 transition-all duration-1000 shadow-sm relative overflow-hidden"
              style={{ width: `${harmonyData.remedyVibration}%` }}
            >
              {/* Animated Light Shimmer */}
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>

            {/* Baseline Marker Notch */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-600 z-10"
              style={{ left: `${harmonyData.naturalVibration}%` }}
              title={`Baseline: ${harmonyData.naturalVibration}%`}
            />
          </div>

          {/* Scriptural Context Note */}
          <p className="text-[11px] text-stone-600 leading-relaxed bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 font-medium">
            <span className="font-bold text-amber-900 mr-1">🕉️ {isBn ? "শাস্ত্রীয় ব্যাখ্যা:" : "Vedic Rationale:"}</span>
            {isBn ? harmonyData.scripturalQuoteBn : harmonyData.scripturalQuoteEn}
          </p>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. Interactive Zodiac Affinity Pills (12 Rashis with Detail Popover) */}
      {/* =================================================================== */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Zap className="size-4 text-amber-600" />
              <span>{isBn ? "উপযুক্ত রাশি ও লগ্ন নির্বাচন (Zodiac Affinity)" : "Zodiac Signs & Cosmic Compatibility"}</span>
            </h4>
            <p className="text-[11px] text-stone-500">
              {isBn
                ? "রাশির উপর ক্লিক করে জেনে নিন কেন এই প্রতিকারটি আপনার জন্য সর্বশ্রেষ্ঠ ফলদায়ী:"
                : "Click or tap any zodiac sign to see its detailed Vedic compatibility:"}
            </p>
          </div>

          <div className="self-start sm:self-center inline-flex items-center gap-1 text-[11px] text-stone-600 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
            <CheckCircle2 className="size-3 text-emerald-600" />
            <span>{isBn ? "সকল রাশি ও লগ্নে ১০০% নিরাপদ" : "100% Safe for All Signs"}</span>
          </div>
        </div>

        {/* 12 Rashis Grid Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {ALL_RASHIS_CANON.map((rashi) => {
            const recommended = isRecommended(rashi);
            const isSelected = selectedRashi?.key === rashi.key;

            return (
              <button
                key={rashi.key}
                type="button"
                onClick={() => setSelectedRashi(isSelected ? null : rashi)}
                className={`group relative rounded-2xl p-2.5 text-left border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-amber-600 text-white border-amber-600 shadow-md scale-102 ring-2 ring-amber-400"
                    : recommended
                    ? "bg-white hover:bg-amber-50/80 border-amber-300/80 text-stone-800 shadow-2xs hover:border-amber-400"
                    : "bg-stone-50/80 hover:bg-white border-stone-200 text-stone-600 opacity-90"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-base font-bold ${isSelected ? "text-amber-200" : "text-amber-700"}`}>
                    {rashi.symbol}
                  </span>
                  {recommended && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-amber-800 text-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {rashi.compatibilityScore}%
                    </span>
                  )}
                </div>

                <div className="mt-1.5">
                  <p className={`font-bold text-xs truncate ${isSelected ? "text-white" : "text-stone-900"}`}>
                    {isBn ? rashi.nameBn : rashi.nameEn.split(" ")[0]}
                  </p>
                  <p className={`text-[10px] truncate ${isSelected ? "text-amber-100" : "text-stone-500"}`}>
                    {isBn ? rashi.elementBn : rashi.elementEn}
                  </p>
                </div>

                <span
                  className={`mt-1 text-[9px] font-semibold flex items-center gap-0.5 ${
                    isSelected ? "text-amber-100" : "text-amber-700 group-hover:text-amber-900"
                  }`}
                >
                  <span>{isBn ? "তথ্য দেখুন" : "View Info"}</span>
                  <ChevronRight className="size-2.5" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Rashi Interactive Deep Dive Card */}
        {selectedRashi && (
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-white to-stone-50 border border-amber-400 p-4 space-y-2.5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 relative">
            <button
              type="button"
              onClick={() => setSelectedRashi(null)}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1 rounded-lg transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="size-8 rounded-xl bg-amber-500 text-white font-bold text-lg flex items-center justify-center">
                {selectedRashi.symbol}
              </span>
              <div>
                <h5 className="font-bold text-sm text-stone-900">
                  {isBn ? `${selectedRashi.nameBn} রাশির জন্য কেন এটি সর্বশ্রেষ্ঠ?` : `Why it's best for ${selectedRashi.nameEn}?`}
                </h5>
                <p className="text-[11px] text-stone-500">
                  {isBn ? `অধিপতি গ্রহ: ${selectedRashi.lordBn} • তত্ত্ব: ${selectedRashi.elementBn}` : `Lord: ${selectedRashi.lordEn} • Element: ${selectedRashi.elementEn}`}
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-amber-200/70">
              {isBn ? selectedRashi.whyBestBn : selectedRashi.whyBestEn}
            </p>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>{isBn ? "প্রভাব অনুকূলতা: " : "Cosmic Match: "} {selectedRashi.compatibilityScore}%</span>
              </span>
              <span className="text-amber-800 font-medium">
                {isBn ? "ধারণের শুভ দিন: বৃহস্পতিবার / সোমবার" : "Auspicious Day: Thursday / Monday"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. Japa Mala 108 Counter Modal */}
      {/* =================================================================== */}
      {showJapaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-stone-900 border border-amber-500/50 p-6 text-white text-center space-y-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowJapaModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="size-5" />
            </button>

            <div className="size-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-400/40">
              <Flame className="size-8" />
            </div>

            <div className="space-y-1">
              <h4 className="font-cinzel text-lg font-bold text-amber-200">
                {isBn ? "১০৮ বার বীজ মন্ত্র জপ মালা" : "108 Japa Mantra Counter"}
              </h4>
              <p className="font-serif text-sm text-stone-300">{effectiveMantra}</p>
            </div>

            {/* Clickable Japa Counter Ring */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setJapaCount((prev) => Math.min(108, prev + 1))}
                className="size-28 rounded-full border-4 border-amber-400/80 bg-gradient-to-br from-amber-500/20 to-black flex flex-col items-center justify-center mx-auto hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <span className="font-mono text-3xl font-black text-amber-300">{japaCount}</span>
                <span className="text-[10px] uppercase font-bold text-stone-400">/ ১০৮ জপ</span>
              </button>
              <p className="text-[11px] text-stone-400">
                {isBn ? "প্রতিটি জপ শেষে গোল বৃত্তটিতে ট্যাপ করুন" : "Tap circle after each mantra chant"}
              </p>
            </div>

            {/* Reset & Close Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJapaCount(0)}
                className="flex-1 rounded-xl bg-white/10 hover:bg-white/15 text-stone-300 font-bold py-2 text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                <span>{isBn ? "রিসেট" : "Reset"}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowJapaModal(false)}
                className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-2 text-xs transition-colors"
              >
                <span>{isBn ? "সম্পন্ন" : "Done"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
