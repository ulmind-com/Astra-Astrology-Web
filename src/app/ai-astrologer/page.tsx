"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertCircle,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  ExternalLink,
  Flame,
  HeartHandshake,
  HelpCircle,
  History,
  Home,
  Hourglass,
  Info,
  Languages,
  Loader2,
  MapPin,
  MessageSquare,
  Mic,
  Moon,
  Orbit,
  Plus,
  RefreshCw,
  RotateCcw,
  ScrollText,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Square,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  UserRound,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { AiAvatar } from "@/components/ai/ai-avatar";
import { AiMarkdown } from "@/components/ai/ai-markdown";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { useLanguage } from "@/providers/language-provider";
import { useProfile } from "@/hooks/use-profile";
import { parseProfileBirthDetails } from "@/lib/birth-details";
import {
  askAstrologer,
  canRecord,
  startRecording,
  transcribe,
  type Recorder,
} from "@/lib/ai-stream";
import {
  aiAstrologerApi,
  type AIChatMessage,
} from "@/lib/api";

/* ---------------------------------------------------------------------------
   Multilingual UI Strings
   ------------------------------------------------------------------------- */
const UI_STRINGS = {
  bn: {
    title: "ডিভাইনলিঙ্ক এআই বৈদিক জ্যোতিষী",
    badge: "সুইস এফিমেরিস ২.১০ • পরাশর শাস্ত্র RAG",
    statusLive: "সরাসরি সংযুক্ত • নির্ভুল গণনা",
    heroHeading: "নক্ষত্র ও গ্রহের নির্দেশনায় জীবনের সঠিক দিশা পান",
    heroDesc:
      "মহর্ষি পরাশর হোরা শাস্ত্র, জৈমিনী সূত্র এবং সুইস এফিমেরিসের উচ্চ নির্ভুল জ্যোতির্বিজ্ঞান সূত্রের সমন্বয়ে ২৪ ঘণ্টা ব্যক্তিগত কুন্ডলী, মহাদশা ও বাস্তু বিচার।",
    linkKundli: "কুন্ডলী যুক্ত করুন",
    kundliLinked: "কুন্ডলী সংযুক্ত",
    linkKundliPrompt: "ব্যক্তিগত দশা ও গ্রহ বিচার পেতে আপনার জন্মকুন্ডলী যুক্ত করুন",
    newChat: "নতুন সেশন",
    newChatConfirm: "আপনি কি নিশ্চিতভাবে এই কথোপকথন মুছে নতুন সেশন শুরু করতে চান?",
    newChatSuccess: "নতুন সেশন প্রস্তুত হয়েছে!",
    placeholder: "আপনার যেকোনো জ্যোতিষীয় বা বাস্তু সংক্রান্ত প্রশ্ন লিখুন…",
    send: "জিজ্ঞাসা করুন",
    holdToSpeak: "ভয়েস রেকর্ড করতে ক্লিক করুন",
    listening: "শুনছি… বলা শেষ হলে পুনরায় ক্লিক করুন",
    thinking: "বৈদিক গণনা ও গ্রহস্ফুট বিশ্লেষণ করা হচ্ছে…",
    toolsUsed: "ব্যবহৃত বৈদিক গণনা এনজিন",
    citationsUsed: "শাস্ত্রীয় প্রমাণ ও সূত্র",
    followupHeader: "পরবর্তী সম্ভাব্য শাস্ত্রীয় প্রশ্ন:",
    copySuccess: "বার্তাটি ক্লিপবোর্ডে কপি করা হয়েছে!",
    helpfulPrompt: "এই উত্তরটি কি সহায়ক?",
    feedbackPositive: "ধন্যবাদ! আপনার ইতিবাচক প্রতিক্রিয়া আমাদের উৎসাহিত করে।",
    dislikeTitle: "উত্তরে কী সংশোধন প্রয়োজন?",
    dislikeDesc:
      "আপনার মন্তব্যটি সরাসরি হেড অ্যাস্ট্রোলজার প্যানেলে পাঠানো হবে স্থায়ী বৈদিক সূত্র সংশোধনের জন্য।",
    dislikePlaceholder: "যেমন: মহাদশার হিসাবের সাথে জন্মরাশির প্রতিকার মিলেনি...",
    submitFeedback: "প্রতিক্রিয়া জমা দিন",
    cancel: "বাতিল",
    saveAndSync: "সংরক্ষণ ও কুন্ডলী সক্রিয় করুন",
    dobLabel: "জন্ম তারিখ",
    tobLabel: "জন্ম সময়",
    pobLabel: "জন্ম স্থান (শহর, দেশ)",
    pobPlaceholder: "যেমন: Kolkata, India অথবা Dhaka, Bangladesh",
    autofillProfile: "আমার সেভ করা প্রোফাইল থেকে পূরণ করুন",
    modalTitle: "ব্যক্তিগত জন্মকুন্ডলী সংযোগ (Birth Chart Sync)",
    modalSubtitle: "সঠিক লগ্ন, চন্দ্ররাশি ও বিংশোত্তরী মহাদশা গণনার জন্য আবশ্যক",
    disclaimer:
      "ডিভাইনলিঙ্ক এআই বৈদিক শাস্ত্র ও এফিমেরিস সূত্র প্রয়োগ করে। জটিল প্রতিকার ও রত্নধারণের জন্য আমাদের অভিজ্ঞ জ্যোতিষীদের সাথেও সরাসরি পরামর্শ করতে পারেন।",
    popularTopics: "জনপ্রিয় শাস্ত্রীয় বিষয়সমূহ:",
  },
  en: {
    title: "DivinLink AI Vedic Astrologer",
    badge: "Swiss Ephemeris 2.10 • Parashara Shastra RAG",
    statusLive: "Active • Astronomical Precision",
    heroHeading: "Discover Celestial Clarity Through Vedic Wisdom",
    heroDesc:
      "Synthesized from Brihat Parashara Hora Shastra, Jaimini Sutras, and Swiss Ephemeris astronomical calculations for personalized Kundli, Mahadasha, and authentic remedies.",
    linkKundli: "Link Birth Chart",
    kundliLinked: "Kundli Linked",
    linkKundliPrompt: "Link your birth chart for 100% personalized Dasha & Transit insights",
    newChat: "New Session",
    newChatConfirm: "Are you sure you want to clear this conversation and start a new session?",
    newChatSuccess: "New session started!",
    placeholder: "Ask any question on Vedic astrology, Dasha, or Vastu…",
    send: "Ask",
    holdToSpeak: "Click to record voice",
    listening: "Listening… click again to stop and send",
    thinking: "Calculating planetary longitudes & Shastric rules…",
    toolsUsed: "Vedic Calculation Engines Used",
    citationsUsed: "Scriptural Citations & Sources",
    followupHeader: "Suggested Follow-up Questions:",
    copySuccess: "Message copied to clipboard!",
    helpfulPrompt: "Was this reading helpful?",
    feedbackPositive: "Thank you! Your feedback helps refine our astrological models.",
    dislikeTitle: "How can this answer be improved?",
    dislikeDesc:
      "Your feedback is sent directly to our Chief Astrologer panel to refine Vedic rules.",
    dislikePlaceholder: "e.g., The dasha period did not match my gemstone recommendation...",
    submitFeedback: "Submit Feedback",
    cancel: "Cancel",
    saveAndSync: "Save & Activate Kundli",
    dobLabel: "Date of Birth",
    tobLabel: "Time of Birth",
    pobLabel: "Place of Birth (City, Country)",
    pobPlaceholder: "e.g., Kolkata, India or London, UK",
    autofillProfile: "Auto-fill from saved profile",
    modalTitle: "Personal Vedic Kundli Chart Sync",
    modalSubtitle: "Required for exact Lagna, Moon Sign, Navamsha, and Vimshottari Mahadasha calculations",
    disclaimer:
      "AI guidance applies authentic Vedic texts and ephemeris algorithms. For personalized gemstones and pooja remedies, consult our verified astrologers.",
    popularTopics: "Popular Vedic Topics:",
  },
  hi: {
    title: "डिवाइनलिंक एआई वैदिक ज्योतिषी",
    badge: "स्विस एफेमेरिस २.१० • पराशर शास्त्र RAG",
    statusLive: "सक्रिय • खगोलीय शुद्धता",
    heroHeading: "ग्रह-नक्षत्रों के मार्गदर्शन से अपने जीवन का सही मार्ग जानें",
    heroDesc:
      "बृहत् पराशर होरा शास्त्र, जैमिनी सूत्र एवं स्विस एफेमेरिस की खगोलीय गणनाओं पर आधारित २४ घंटे सटीक जन्मकुंडली, महादशा व वास्तु समाधान।",
    linkKundli: "जन्म विवरण जोड़ें",
    kundliLinked: "कुंडली जुड़ी हुई",
    linkKundliPrompt: "सटीक दशा व गोचर फल के लिए अपनी जन्मकुंडली विवरण जोड़ें",
    newChat: "नया सत्र",
    newChatConfirm: "क्या आप यह बातचीत हटाकर नया सत्र शुरू करना चाहते हैं?",
    newChatSuccess: "नया सत्र प्रारंभ हुआ!",
    placeholder: "वैदिक ज्योतिष, कुंडली या वास्तु से संबंधित प्रश्न पूछें…",
    send: "पूछें",
    holdToSpeak: "बोलने के लिए क्लिक करें",
    listening: "सुन रहा हूँ… बोलने के बाद पुनः क्लिक करें",
    thinking: "ग्रहों की स्पष्ट स्थिति एवं शास्त्रीय सूत्रों का विश्लेषण जारी है…",
    toolsUsed: "प्रयुक्त वैदिक गणना इंजन",
    citationsUsed: "शास्त्रीय प्रमाण एवं स्रोत",
    followupHeader: "अनुशंसित आगामी प्रश्न:",
    copySuccess: "संदेश क्लिपबोर्ड में कॉपी किया गया!",
    helpfulPrompt: "क्या यह उत्तर उपयोगी था?",
    feedbackPositive: "धन्यवाद! आपकी प्रतिक्रिया हमारे लिए बहुमूल्य है।",
    dislikeTitle: "इस उत्तर में क्या सुधार आवश्यक है?",
    dislikeDesc:
      "आपकी टिप्पणी हमारे मुख्य ज्योतिषी पैनल को भेजी जाएगी ताकि वैदिक नियमों में सुधार किया जा सके।",
    dislikePlaceholder: "जैसे: महादशा के अनुसार रत्न सुझाव सही नहीं था...",
    submitFeedback: "प्रतिक्रिया भेजें",
    cancel: "रद्द करें",
    saveAndSync: "सहेजें और कुंडली सक्रिय करें",
    dobLabel: "जन्म तिथि",
    tobLabel: "जन्म समय",
    pobLabel: "जन्म स्थान (शहर, देश)",
    pobPlaceholder: "जैसे: Delhi, India या Mumbai, India",
    autofillProfile: "मेरी सहेजी गई प्रोफ़ाइल से भरें",
    modalTitle: "व्यक्तिगत जन्मकुंडली विवरण जोड़ें",
    modalSubtitle: "सटीक लग्न, चंद्र राशि एवं विंशोत्तरी महादशा गणना के लिए आवश्यक",
    disclaimer:
      "एआई वैदिक शास्त्र एवं स्विस एफेमेरिस के सटीक सूत्र लागू करता है। विशेष रत्न एवं अनुष्ठान के लिए हमारे प्रमाणित ज्योतिषियों से भी परामर्श लें।",
    popularTopics: "लोकप्रिय वैदिक विषय:",
  },
};

/* ---------------------------------------------------------------------------
   Curated Prompt Cards for Instant Consultations
   ------------------------------------------------------------------------- */
const SUGGESTED_PROMPTS = {
  bn: [
    {
      title: "বর্তমান মহাদশা ও ক্যারিয়ার",
      query: "আমার বর্তমান বিংশোত্তরী মহাদশা ও অন্তর্দশা বিচার করে কর্ম ও আর্থিক ভাগ্য বলুন।",
      category: "Dasha & Career",
      icon: Hourglass,
      gradient: "from-amber-500/10 to-amber-600/5 text-amber-700 border-amber-200/70",
    },
    {
      title: "মাঙ্গলিক ও কালসর্প দোষ",
      query: "আমার জন্মকুন্ডলীতে কি মাঙ্গলিক দোষ বা কালসর্প দোষ আছে? প্রতিকার কী?",
      category: "Dosha & Remedies",
      icon: ScrollText,
      gradient: "from-rose-500/10 to-rose-600/5 text-rose-700 border-rose-200/70",
    },
    {
      title: "শনির সাড়ে সাতি ও ঢাইয়া",
      query: "আমার রাশিতে কি শনির সাড়ে সাতি বা কন্টক ঢাইয়া চলছে? শাস্ত্রীয় উপায় কী?",
      category: "Saturn Transit",
      icon: Moon,
      gradient: "from-indigo-500/10 to-indigo-600/5 text-indigo-700 border-indigo-200/70",
    },
    {
      title: "বিবাহ ও প্রেম জীবন",
      query: "কুন্ডলীর সপ্তম ভাব ও বৃহস্পতির দৃষ্টি অনুসারে আমার দাম্পত্য ও বিবাহযোগ কেমন?",
      category: "Marriage & Love",
      icon: HeartHandshake,
      gradient: "from-pink-500/10 to-pink-600/5 text-pink-700 border-pink-200/70",
    },
    {
      title: "আজকের শুভ সময় ও হোরা",
      query: "আজকের দিনের অনুকূল গ্রহ হোরা ও নক্ষত্র তারা বল বিচার করে শুভ সময় নির্দেশ করুন।",
      category: "Muhurat & Hora",
      icon: Sparkles,
      gradient: "from-emerald-500/10 to-emerald-600/5 text-emerald-700 border-emerald-200/70",
    },
    {
      title: "বাস্তু ও উত্তর-পূর্ব কোণ",
      query: "বাড়ির উত্তর-পূর্ব (ঈশান কোণ) বাস্তু দোষ মুক্ত রাখার সর্বোত্তম শাস্ত্রীয় নিয়ম কী?",
      category: "Vastu Shastra",
      icon: Home,
      gradient: "from-teal-500/10 to-teal-600/5 text-teal-700 border-teal-200/70",
    },
  ],
  en: [
    {
      title: "Current Mahadasha & Career",
      query: "Analyze my current Vimshottari Mahadasha and Antardasha for career and financial prospects.",
      category: "Dasha & Career",
      icon: Hourglass,
      gradient: "from-amber-500/10 to-amber-600/5 text-amber-700 border-amber-200/70",
    },
    {
      title: "Manglik & Kaal Sarp Dosha",
      query: "Does my birth chart have Manglik Dosha or Kaal Sarp Dosha? What are the Vedic remedies?",
      category: "Dosha & Remedies",
      icon: ScrollText,
      gradient: "from-rose-500/10 to-rose-600/5 text-rose-700 border-rose-200/70",
    },
    {
      title: "Saturn Sade Sati & Dhaiya",
      query: "Am I going through Saturn Sade Sati or Kantaka Shani? What remedies are recommended?",
      category: "Saturn Transit",
      icon: Moon,
      gradient: "from-indigo-500/10 to-indigo-600/5 text-indigo-700 border-indigo-200/70",
    },
    {
      title: "Marriage & Relationship Timing",
      query: "Based on the 7th house and Jupiter's transit/aspect, what is my marriage outlook?",
      category: "Marriage & Love",
      icon: HeartHandshake,
      gradient: "from-pink-500/10 to-pink-600/5 text-pink-700 border-pink-200/70",
    },
    {
      title: "Today's Planetary Hora & Muhurat",
      query: "Guide me on auspicious Hora timings and favorable planetary positions for today.",
      category: "Muhurat & Hora",
      icon: Sparkles,
      gradient: "from-emerald-500/10 to-emerald-600/5 text-emerald-700 border-emerald-200/70",
    },
    {
      title: "Vastu & Northeast Zone",
      query: "What are the authentic Vedic rules to rectify Vastu defects in the Northeast (Ishanya) corner?",
      category: "Vastu Shastra",
      icon: Home,
      gradient: "from-teal-500/10 to-teal-600/5 text-teal-700 border-teal-200/70",
    },
  ],
  hi: [
    {
      title: "वर्तमान महादशा और करियर",
      query: "मेरी वर्तमान विंशोत्तरी महादशा और अंतर्दशा का विश्लेषण कर करियर और आर्थिक स्थिति बताएं।",
      category: "Dasha & Career",
      icon: Hourglass,
      gradient: "from-amber-500/10 to-amber-600/5 text-amber-700 border-amber-200/70",
    },
    {
      title: "मांगलिक एवं कालसर्प दोष",
      query: "क्या मेरी कुंडली में मांगलिक दोष या कालसर्प दोष है? इसके वैदिक उपाय क्या हैं?",
      category: "Dosha & Remedies",
      icon: ScrollText,
      gradient: "from-rose-500/10 to-rose-600/5 text-rose-700 border-rose-200/70",
    },
    {
      title: "शनि की साढ़े साती और ढैया",
      query: "क्या मेरी राशि पर शनि की साढ़े साती या ढैया चल रही है? कृपया शास्त्रीय उपाय बताएं।",
      category: "Saturn Transit",
      icon: Moon,
      gradient: "from-indigo-500/10 to-indigo-600/5 text-indigo-700 border-indigo-200/70",
    },
    {
      title: "विवाह एवं वैवाहिक जीवन",
      query: "कुंडली के सप्तम भाव और गुरु की दृष्टि अनुसार विवाह और दांपत्य जीवन कैसा रहेगा?",
      category: "Marriage & Love",
      icon: HeartHandshake,
      gradient: "from-pink-500/10 to-pink-600/5 text-pink-700 border-pink-200/70",
    },
    {
      title: "आज का शुभ मुहूर्त एवं होरा",
      query: "आज के अनुकूल ग्रह होरा और नक्षत्र ताराबल के अनुसार शुभ मुहूर्त बताएं।",
      category: "Muhurat & Hora",
      icon: Sparkles,
      gradient: "from-emerald-500/10 to-emerald-600/5 text-emerald-700 border-emerald-200/70",
    },
    {
      title: "वास्तु एवं ईशान कोण",
      query: "घर के ईशान कोण (उत्तर-पूर्व) को वास्तु दोष से मुक्त रखने के शास्त्रीय नियम क्या हैं?",
      category: "Vastu Shastra",
      icon: Home,
      gradient: "from-teal-500/10 to-teal-600/5 text-teal-700 border-teal-200/70",
    },
  ],
};

/* ---------------------------------------------------------------------------
   Welcome Greetings
   ------------------------------------------------------------------------- */
const WELCOME_MESSAGES = {
  bn: {
    content:
      "নমস্কার! আমি **ডিভাইনলিঙ্ক এআই বৈদিক জ্যোতিষী**। মহর্ষি পরাশর ও জৈমিনী শাস্ত্রের প্রাচীন সূত্র এবং সুইস এফিমেরিসের নিখুঁত গণনার ভিত্তিতে আপনার জীবনের প্রতিটি প্রশ্নের শাস্ত্রীয় ও নির্ভুল উত্তর দিতে আমি সদা প্রস্তুত।\n\nআপনি আপনার জন্ম তারিখ, সময় ও স্থান যুক্ত করে ব্যক্তিগত কুন্ডলীর ভিত্তিতে অথবা সাধারণ জ্যোতিষ ও বাস্তু বিষয়ে যেকোনো প্রশ্ন করতে পারেন।",
    suggested_followups: [
      "আমার বর্তমান মহাদশা ও অন্তর্দশা কেমন?",
      "আমার কুন্ডলীতে মাঙ্গলিক দোষ আছে কি?",
      "আজকের দিনে কোন হোরায় শুভ কাজ শুরু করব?",
    ],
  },
  en: {
    content:
      "Greetings! I am **DivinLink AI Vedic Astrologer**. Built on authentic Vedic scriptures (Brihat Parashara Hora Shastra, Jaimini Upadesha Sutras) and Swiss Ephemeris precision, I am here to provide authentic Vedic guidance for all your life questions.\n\nYou can link your birth details (date, time, location) for personalized Kundli readings or ask any questions regarding Vedic astrology, Vastu, and remedies.",
    suggested_followups: [
      "How is my current Mahadasha & Antardasha?",
      "Do I have Manglik Dosha in my Kundli?",
      "What is the most auspicious Hora today for important work?",
    ],
  },
  hi: {
    content:
      "नमस्ते! मैं **डिवाइनलिंक एआई वैदिक ज्योतिषी** हूँ। महर्षि पराशर एवं जैमिनी शास्त्र के प्रामाणिक सूत्रों तथा स्विस एफेमेरिस की सटीक गणनाओं के आधार पर आपके सभी प्रश्नों का शास्त्रीय समाधान देने के लिए तत्पर हूँ।\n\nआप अपनी जन्म तिथि, समय व स्थान जोड़कर व्यक्तिगत जन्मकुंडली आधारित प्रश्न पूछ सकते हैं अथवा सामान्य ज्योतिष व वास्तु संबंधी मार्गदर्शन प्राप्त कर सकते हैं।",
    suggested_followups: [
      "मेरी वर्तमान महादशा और अंतर्दशा कैसी है?",
      "क्या मेरी कुंडली में मांगलिक दोष है?",
      "आज के दिन किस होरा में शुभ कार्य आरंभ करूँ?",
    ],
  },
};

export default function AIAstrologerPage() {
  const { user, isSignedIn } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { data: profileData } = useProfile({ enabled: Boolean(isSignedIn) });
  const t = UI_STRINGS[language] || UI_STRINGS.bn;

  // Stream & Recording state
  const [statusLine, setStatusLine] = React.useState<string | null>(null);
  const streamRef = React.useRef<AbortController | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [transcribing, setTranscribing] = React.useState(false);
  const recorderRef = React.useRef<Recorder | null>(null);

  // Session & Messages state
  const [sessionId, setSessionId] = React.useState<string>("");
  const [messages, setMessages] = React.useState<AIChatMessage[]>([]);
  const [inputQuery, setInputQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Birth details state for personalization
  const [showBirthModal, setShowBirthModal] = React.useState(false);
  const [birthDate, setBirthDate] = React.useState("");
  const [birthTime, setBirthTime] = React.useState("");
  const [birthPlace, setBirthPlace] = React.useState("");
  const [latitude, setLatitude] = React.useState<number | undefined>(undefined);
  const [longitude, setLongitude] = React.useState<number | undefined>(undefined);

  // Expanded tool/citation states
  const [expandedTools, setExpandedTools] = React.useState<Record<number, boolean>>({});
  const [expandedCitations, setExpandedCitations] = React.useState<Record<number, boolean>>({});

  // Feedback states
  const [feedbackGiven, setFeedbackGiven] = React.useState<Record<number, number>>({});
  const [dislikeModalIndex, setDislikeModalIndex] = React.useState<number | null>(null);
  const [dislikeReason, setDislikeReason] = React.useState("");
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const chatBottomRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Initialize session and birth details from localStorage / profile
  React.useEffect(() => {
    const savedSession = localStorage.getItem("astra_ai_session_id");
    if (savedSession) {
      setSessionId(savedSession);
    } else {
      const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setSessionId(newId);
      localStorage.setItem("astra_ai_session_id", newId);
    }

    const savedBirth = localStorage.getItem("astra_ai_birth_profile");
    if (savedBirth) {
      try {
        const b = JSON.parse(savedBirth);
        if (b.date) setBirthDate(b.date);
        if (b.time) setBirthTime(b.time);
        if (b.place) setBirthPlace(b.place);
        if (b.lat) setLatitude(b.lat);
        if (b.lon) setLongitude(b.lon);
      } catch {
        // ignore
      }
    }
  }, []);

  // Auto-fill from signed-in user's profile if local birth details are not set
  React.useEffect(() => {
    if (profileData?.birth && !birthDate) {
      const parsed = parseProfileBirthDetails(profileData.birth);
      if (parsed.year && parsed.month && parsed.day) {
        setBirthDate(`${parsed.year}-${parsed.month}-${parsed.day}`);
      }
      if (parsed.hour && parsed.minute) {
        let h = parseInt(parsed.hour, 10);
        if (parsed.period === "PM" && h < 12) h += 12;
        if (parsed.period === "AM" && h === 12) h = 0;
        setBirthTime(`${String(h).padStart(2, "0")}:${parsed.minute}`);
      }
      if (parsed.place) setBirthPlace(parsed.place);
      if (parsed.selectedPlace?.latitude) setLatitude(parsed.selectedPlace.latitude);
      if (parsed.selectedPlace?.longitude) setLongitude(parsed.selectedPlace.longitude);
    }
  }, [profileData, birthDate]);

  // Set greeting if message list is empty
  React.useEffect(() => {
    if (messages.length === 0) {
      const welcome = WELCOME_MESSAGES[language] || WELCOME_MESSAGES.bn;
      setMessages([
        {
          role: "assistant",
          content: welcome.content,
          timestamp: new Date().toISOString(),
          suggested_followups: welcome.suggested_followups,
        },
      ]);
    } else if (messages.length === 1 && messages[0].role === "assistant") {
      const welcome = WELCOME_MESSAGES[language] || WELCOME_MESSAGES.bn;
      setMessages([
        {
          role: "assistant",
          content: welcome.content,
          timestamp: new Date().toISOString(),
          suggested_followups: welcome.suggested_followups,
        },
      ]);
    }
  }, [language]);

  // Smooth scroll within the message container
  React.useEffect(() => {
    const list = chatBottomRef.current?.parentElement;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, loading, statusLine]);

  function saveBirthProfile() {
    const profile = {
      date: birthDate,
      time: birthTime,
      place: birthPlace,
      lat: latitude || 22.5726,
      lon: longitude || 88.3639,
    };
    localStorage.setItem("astra_ai_birth_profile", JSON.stringify(profile));
    setShowBirthModal(false);
    toast.success(
      language === "bn"
        ? "জন্ম বিবরণ সফলভাবে সংরক্ষিত হয়েছে! পরবর্তী সকল প্রশ্ন আপনার কুন্ডলীর সাথে মিলিয়ে গণনা করা হবে।"
        : language === "hi"
        ? "जन्म विवरण सफलतापूर्वक सहेजा गया! आगामी सभी प्रश्न आपकी कुंडली से मिलाकर जाँचे जाएँगे।"
        : "Birth details saved! All subsequent questions will be analyzed using your chart.",
    );
  }

  function handleAutoFillProfile() {
    if (!profileData?.birth) {
      toast.info(
        language === "bn"
          ? "আপনার অ্যাকাউন্টে কোনো সংরক্ষিত জন্ম বিবরণ পাওয়া যায়নি।"
          : language === "hi"
          ? "आपकी प्रोफ़ाइल में सहेजा गया जन्म विवरण नहीं मिला।"
          : "No saved birth details found in your profile.",
      );
      return;
    }
    const parsed = parseProfileBirthDetails(profileData.birth);
    if (parsed.year && parsed.month && parsed.day) {
      setBirthDate(`${parsed.year}-${parsed.month}-${parsed.day}`);
    }
    if (parsed.hour && parsed.minute) {
      let h = parseInt(parsed.hour, 10);
      if (parsed.period === "PM" && h < 12) h += 12;
      if (parsed.period === "AM" && h === 12) h = 0;
      setBirthTime(`${String(h).padStart(2, "0")}:${parsed.minute}`);
    }
    if (parsed.place) setBirthPlace(parsed.place);
    if (parsed.selectedPlace?.latitude) setLatitude(parsed.selectedPlace.latitude);
    if (parsed.selectedPlace?.longitude) setLongitude(parsed.selectedPlace.longitude);

    toast.success(
      language === "bn"
        ? "প্রোফাইল থেকে তথ্য লোড করা হয়েছে!"
        : language === "hi"
        ? "प्रोफ़ाइल से विवरण सफलतापूर्वक लिया गया!"
        : "Loaded details from profile!",
    );
  }

  function clearChat() {
    if (confirm(t.newChatConfirm)) {
      const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setSessionId(newId);
      localStorage.setItem("astra_ai_session_id", newId);
      const welcome = WELCOME_MESSAGES[language] || WELCOME_MESSAGES.bn;
      setMessages([
        {
          role: "assistant",
          content: welcome.content,
          timestamp: new Date().toISOString(),
          suggested_followups: welcome.suggested_followups,
        },
      ]);
      setFeedbackGiven({});
      toast.success(t.newChatSuccess);
    }
  }

  async function toggleVoiceRecording() {
    if (loading || transcribing) return;

    if (recording) {
      // Stop recording
      const recorder = recorderRef.current;
      recorderRef.current = null;
      setRecording(false);
      if (!recorder) return;

      setTranscribing(true);
      try {
        const audio = await recorder.stop();
        if (audio.size < 1200) return;
        const text = await transcribe(audio);
        setInputQuery((prev) => (prev ? `${prev} ${text}` : text));
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Could not transcribe audio.");
      } finally {
        setTranscribing(false);
      }
    } else {
      // Start recording
      if (!canRecord()) {
        toast.error(
          language === "bn"
            ? "এই ব্রাউজারে ভয়েস রেকর্ডিং সাপোর্ট নেই।"
            : language === "hi"
            ? "इस ब्राउज़र में वॉइस रिकॉर्डिंग उपलब्ध नहीं है।"
            : "Voice recording is not supported in this browser.",
        );
        return;
      }
      try {
        recorderRef.current = await startRecording();
        setRecording(true);
      } catch {
        toast.error(
          language === "bn"
            ? "মাইক্রোফোন ব্যবহারের অনুমতি দিন।"
            : language === "hi"
            ? "कृपया माइक्रोफ़ोन की अनुमति दें।"
            : "Please allow microphone access.",
        );
      }
    }
  }

  async function handleSendMessage(textToSend?: string) {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    setInputQuery("");
    const userMsg: AIChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setStatusLine(t.thinking);

    const slot = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", timestamp: new Date().toISOString() },
    ]);

    const controller = new AbortController();
    streamRef.current?.abort();
    streamRef.current = controller;

    try {
      let streamed = "";
      for await (const event of askAstrologer(
        {
          message: query,
          session_id: sessionId || undefined,
          birth_date: birthDate || undefined,
          birth_time: birthTime || undefined,
          birth_place: birthPlace || undefined,
          latitude: latitude || (birthPlace ? 22.5726 : undefined),
          longitude: longitude || (birthPlace ? 88.3639 : undefined),
          preferred_language: language,
        },
        controller.signal,
      )) {
        if (event.type === "status") {
          setStatusLine(event.message);
        } else if (event.type === "delta") {
          streamed += event.text;
          setStatusLine(null);
          setMessages((prev) => {
            const next = [...prev];
            if (next[slot]) next[slot] = { ...next[slot], content: streamed };
            return next;
          });
        } else if (event.type === "error") {
          throw new Error(event.message);
        } else if (event.type === "done") {
          if (event.session_id && event.session_id !== sessionId) {
            setSessionId(event.session_id);
            localStorage.setItem("astra_ai_session_id", event.session_id);
          }
          setStatusLine(null);
          setMessages((prev) => {
            const next = [...prev];
            if (next[slot]) {
              next[slot] = {
                ...next[slot],
                content: event.reply || streamed,
                tools_called: event.tools_called,
                citations: event.citations as AIChatMessage["citations"],
                suggested_followups: event.suggested_followups,
              };
            }
            return next;
          });
        }
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === "AbortError") return;
      setMessages((prev) => prev.filter((m, i) => !(i === slot && !m.content)));
      console.error("Chat error:", err);
      toast.error(
        language === "bn"
          ? "উত্তর প্রদানে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
          : language === "hi"
          ? "उत्तर देने में समस्या आई। कृपया पुनः प्रयास करें।"
          : "Encountered a momentary connection issue. Please try again.",
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            language === "bn"
              ? "দুঃখিত, বৈদিক গণনা সার্ভারের সাথে সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কয়েক মুহূর্ত পর পুনরায় প্রশ্নটি করুন।"
              : language === "hi"
              ? "क्षमा करें, वैदिक गणना सर्वर से जुड़ने में समस्या हुई। कृपया कुछ क्षण बाद पुनः प्रयास करें।"
              : "Apologies, the astrological computation engine had a temporary connection hiccup. Please ask again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setStatusLine(null);
      streamRef.current = null;
    }
  }

  function handleFeedback(msgIndex: number, rating: number) {
    const msg = messages[msgIndex];
    if (!msg || msg.role !== "assistant") return;

    if (rating === -1) {
      setDislikeModalIndex(msgIndex);
      return;
    }

    setFeedbackGiven((prev) => ({ ...prev, [msgIndex]: 1 }));
    const prevUserMsg = messages
      .slice(0, msgIndex)
      .reverse()
      .find((m) => m.role === "user");

    aiAstrologerApi
      .sendFeedback({
        session_id: sessionId,
        user_query: prevUserMsg?.content || "User Query",
        ai_response: msg.content,
        rating: 1,
      })
      .then(() => toast.success(t.feedbackPositive))
      .catch(() => {});
  }

  function submitDislikeFeedback() {
    if (dislikeModalIndex === null) return;
    const msgIndex = dislikeModalIndex;
    const msg = messages[msgIndex];
    const prevUserMsg = messages
      .slice(0, msgIndex)
      .reverse()
      .find((m) => m.role === "user");

    setFeedbackGiven((prev) => ({ ...prev, [msgIndex]: -1 }));

    aiAstrologerApi
      .sendFeedback({
        session_id: sessionId,
        user_query: prevUserMsg?.content || "User Query",
        ai_response: msg.content,
        rating: -1,
        feedback_reason: dislikeReason.trim(),
      })
      .then(() => {
        toast.info(
          language === "bn"
            ? "আপনার প্রতিক্রিয়া আমাদের প্রধান জ্যোতিষী প্যানেলে পাঠানো হয়েছে সংশোধনের জন্য।"
            : language === "hi"
            ? "आपकी प्रतिक्रिया मुख्य ज्योतिषी पैनल को भेजी गई है।"
            : "Your feedback has been sent to our Chief Astrologer panel.",
        );
        setDislikeModalIndex(null);
        setDislikeReason("");
      })
      .catch(() => {
        setDislikeModalIndex(null);
      });
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success(t.copySuccess);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  const promptList = SUGGESTED_PROMPTS[language] || SUGGESTED_PROMPTS.bn;
  const isFreshConversation = messages.length <= 1;

  return (
    <div
      data-full-viewport="true"
      className="flex h-dvh flex-col overflow-hidden bg-gradient-to-b from-[#fffcf7] via-[#fffdfa] to-[#fbf7f0] text-slate-800"
    >
      <SiteHeader />

      {/* Main Full-Viewport Shell */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Subtle Ambient Celestial Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-gradient-to-br from-amber-300/15 via-gold-400/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 right-10 size-[450px] rounded-full bg-gradient-to-tr from-amber-400/10 to-transparent blur-3xl" />
        </div>

        {/* ===================================================================
            Glassmorphic Header Bar (Compact & High-Tech)
            =================================================================== */}
        <header className="relative z-20 shrink-0 border-b border-amber-200/60 bg-white/85 px-3 py-2.5 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            {/* Left: Brand Identity with live pulse indicator */}
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl shadow-[0_4px_16px_rgba(217,119,6,0.3)] ring-1 ring-amber-300/60">
                <Image
                  src="/logo.png"
                  alt="DivinLink AI Astrologer"
                  width={40}
                  height={40}
                  className="size-full object-contain"
                  priority
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-sm sm:text-base font-bold text-amber-950 tracking-tight leading-none">
                    {t.title}
                  </h1>
                  <span className="hidden items-center gap-1 rounded-full border border-emerald-300/70 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shadow-2xs sm:inline-flex">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Vedic 2.10</span>
                  </span>
                </div>
                <p className="hidden text-[11px] text-amber-900/60 sm:block">
                  {t.badge}
                </p>
              </div>
            </div>

            {/* Right: Actions (Kundli Link, Language, New Chat) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Kundli Link Status Capsule */}
              <button
                type="button"
                onClick={() => setShowBirthModal(true)}
                title={t.modalTitle}
                className={`group flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  birthDate
                    ? "border-amber-300 bg-gradient-to-r from-amber-100/90 via-amber-50 to-amber-100/80 text-amber-900 shadow-2xs hover:shadow-xs hover:border-amber-400"
                    : "border-amber-200/80 bg-white/90 text-amber-800 shadow-2xs hover:bg-amber-50/80 hover:border-amber-300"
                }`}
              >
                <Compass className={`size-3.5 transition-transform group-hover:rotate-45 ${birthDate ? "text-amber-600" : "text-amber-500"}`} />
                <span className="max-w-[110px] truncate sm:max-w-[180px]">
                  {birthDate
                    ? `${birthPlace ? birthPlace.split(",")[0] : "Kundli"} • ${birthDate.split("-")[0]}`
                    : t.linkKundli}
                </span>
                {birthDate && <span className="text-[10px] text-emerald-600 font-bold">✓</span>}
              </button>

              {/* Language Switcher Pill */}
              <div className="inline-flex items-center rounded-xl border border-amber-200/80 bg-white/90 p-0.5 text-xs shadow-2xs">
                {(
                  [
                    { code: "bn", label: "বাং" },
                    { code: "hi", label: "हिं" },
                    { code: "en", label: "EN" },
                  ] as const
                ).map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => void setLanguage(l.code)}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-all ${
                      language === l.code
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs"
                        : "text-slate-600 hover:text-amber-900 hover:bg-amber-50"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* New Session Button */}
              <button
                type="button"
                onClick={clearChat}
                className="flex size-8 items-center justify-center rounded-xl border border-amber-200/70 bg-white/90 text-slate-500 shadow-2xs transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:scale-95 cursor-pointer"
                title={t.newChat}
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* ===================================================================
            Chat Message Stream (Dynamic Viewport Scroller)
            =================================================================== */}
        <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 [scrollbar-width:thin]">
          {/* Welcome Screen / Hero Cards (Shown only on fresh session) */}
          {isFreshConversation && (
            <div className="my-auto py-6 text-center animate-in fade-in duration-500">
              {/* Celestial Orbit Emblem */}
              <div className="relative mx-auto mb-4 flex size-20 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 via-gold-400/20 to-transparent animate-ping opacity-60" />
                <div className="relative flex size-18 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-[0_8px_30px_rgba(217,119,6,0.35)] ring-2 ring-amber-300/60">
                  <Image
                    src="/logo.png"
                    alt="Mandala Emblem"
                    width={64}
                    height={64}
                    className="size-full object-contain"
                    priority
                  />
                </div>
              </div>

              <h2 className="font-display text-xl sm:text-3xl font-extrabold tracking-tight text-amber-950">
                {t.heroHeading}
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.heroDesc}
              </p>

              {/* Kundli Prompt Banner if not linked */}
              {!birthDate && (
                <div className="mx-auto mt-5 max-w-md rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-100/80 via-white to-amber-100/60 p-3 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800">
                      <Sparkles className="size-4 text-amber-600 animate-pulse" />
                    </span>
                    <p className="text-xs font-semibold text-amber-950">
                      {t.linkKundliPrompt}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowBirthModal(true)}
                    className="shrink-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold text-xs shadow-xs hover:from-amber-700 hover:to-amber-800"
                  >
                    {t.linkKundli}
                  </Button>
                </div>
              )}

              {/* Categorized Suggested Prompt Cards */}
              <div className="mt-8 text-left">
                <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900/70">
                  <Wand2 className="size-3.5 text-amber-600" />
                  {t.popularTopics}
                </p>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                  {promptList.map((p, idx) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(p.query)}
                        disabled={loading}
                        className={`group relative flex flex-col justify-between rounded-2xl border bg-white/95 p-3.5 text-left shadow-2xs backdrop-blur-xs transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer ${p.gradient}`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 group-hover:bg-amber-500/20 transition-colors">
                              <Icon className="size-3.5" />
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800/60">
                              {p.category}
                            </span>
                          </div>
                          <h3 className="mt-2 text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                            {p.title}
                          </h3>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[11px] text-slate-500 leading-snug">
                          {p.query}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Messages Feed */}
          <div className="space-y-4">
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";

              // Don't duplicate initial welcome message in active feed if user has sent messages
              if (!isUser && isFreshConversation && idx === 0) {
                return null;
              }

              return (
                <div
                  key={idx}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {/* Assistant Avatar */}
                  {!isUser && (
                    <AiAvatar
                      size={36}
                      className="mt-1 ring-2 ring-amber-300/40"
                      active={loading && idx === messages.length - 1}
                    />
                  )}

                  <div
                    className={`relative max-w-[90%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 transition-shadow ${
                      isUser
                        ? "rounded-tr-xs bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md border border-amber-500/20"
                        : "rounded-tl-xs bg-white/95 border border-amber-200/60 text-slate-800 shadow-[0_4px_20px_-8px_rgba(217,119,6,0.15)] backdrop-blur-md"
                    }`}
                  >
                    {/* Message Body */}
                    {isUser ? (
                      <div className="font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-slate-100">
                        {msg.content}
                      </div>
                    ) : (
                      <AiMarkdown className="font-sans leading-relaxed text-slate-800">
                        {msg.content}
                      </AiMarkdown>
                    )}

                    {/* Tools Called Collapsible Pill */}
                    {!isUser && msg.tools_called && msg.tools_called.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-amber-200/60">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedTools((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer"
                        >
                          <BrainCircuit className="size-3.5 text-amber-600" />
                          <span>
                            {t.toolsUsed} ({msg.tools_called.length})
                          </span>
                          {expandedTools[idx] ? (
                            <ChevronUp className="size-3" />
                          ) : (
                            <ChevronDown className="size-3" />
                          )}
                        </button>

                        {expandedTools[idx] && (
                          <div className="mt-2 rounded-xl border border-amber-200/60 bg-amber-50/50 p-2.5 text-[11px] space-y-1.5 animate-in fade-in">
                            {msg.tools_called.map((tool, tIdx) => (
                              <div key={tIdx} className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-amber-500" />
                                <span className="font-mono font-medium text-amber-950">{tool}</span>
                                <span className="text-[10px] text-slate-500">— Swiss Ephemeris 2.10 verified</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Scriptural Citations Collapsible Pill */}
                    {!isUser && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-amber-200/60">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedCitations((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer"
                        >
                          <BookOpen className="size-3.5 text-amber-600" />
                          <span>
                            {t.citationsUsed} ({msg.citations.length})
                          </span>
                          {expandedCitations[idx] ? (
                            <ChevronUp className="size-3" />
                          ) : (
                            <ChevronDown className="size-3" />
                          )}
                        </button>

                        {expandedCitations[idx] && (
                          <div className="mt-2 space-y-2 animate-in fade-in">
                            {msg.citations.map((cite, cIdx) => (
                              <div
                                key={cIdx}
                                className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-2.5 text-[11px] space-y-1"
                              >
                                <div className="flex items-center justify-between font-bold text-amber-900">
                                  <span>{cite.source}</span>
                                  <span className="uppercase text-[9px] bg-amber-200/60 text-amber-800 px-1.5 py-0.5 rounded-md font-semibold">
                                    {cite.category}
                                  </span>
                                </div>
                                <p className="italic text-slate-600 line-clamp-3">
                                  &ldquo;{cite.snippet}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interactive Suggested Follow-up Pills */}
                    {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-amber-200/60 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">
                          {t.followupHeader}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggested_followups.map((followup, fIdx) => (
                            <button
                              key={fIdx}
                              type="button"
                              onClick={() => handleSendMessage(followup)}
                              disabled={loading}
                              className="group flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-amber-50/70 px-3 py-1 text-[11px] font-medium text-amber-950 shadow-2xs hover:bg-amber-100 hover:border-amber-400 transition-all text-left cursor-pointer"
                            >
                              <span>{followup}</span>
                              <span className="text-amber-600 transition-transform group-hover:translate-x-0.5">➔</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Footer: Copy & Feedback */}
                    {!isUser && msg.content && (
                      <div className="mt-3.5 pt-2.5 border-t border-amber-200/40 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.content, idx)}
                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-amber-100/60 hover:text-amber-900 transition-colors cursor-pointer"
                            title="Copy message"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="size-3 text-emerald-600" />
                                <span className="text-emerald-700 text-[10px] font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="hidden sm:inline text-[11px] text-slate-400">
                            {t.helpfulPrompt}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleFeedback(idx, 1)}
                            disabled={feedbackGiven[idx] !== undefined}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              feedbackGiven[idx] === 1
                                ? "text-emerald-600 bg-emerald-50"
                                : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                            }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleFeedback(idx, -1)}
                            disabled={feedbackGiven[idx] !== undefined}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              feedbackGiven[idx] === -1
                                ? "text-rose-600 bg-rose-50"
                                : "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                            title="Needs improvement"
                          >
                            <ThumbsDown className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="size-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-1 ring-1 ring-amber-400/50">
                      <User className="size-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Calculating / Stream Status Bubble */}
            {loading && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                <AiAvatar size={36} className="mt-1 ring-2 ring-amber-300/40" active />
                <div className="rounded-2xl rounded-tl-xs bg-white/95 border border-amber-200/70 p-4 shadow-sm space-y-2 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <RefreshCw className="size-3.5 animate-spin text-amber-600" />
                    <span>{statusLine || t.thinking}</span>
                  </div>
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="size-2 rounded-full bg-amber-400 animate-bounce" />
                    <span className="size-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="size-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* ===================================================================
            Floating Bottom Composer (Clean, Pinned, Zero Overlap)
            =================================================================== */}
        <div className="relative z-20 shrink-0 border-t border-amber-200/50 bg-white/90 px-3 py-2.5 backdrop-blur-xl sm:px-6">
          <div className="mx-auto max-w-4xl">
            {/* Quick Prompt Pill Drawer (when chatting actively) */}
            {!isFreshConversation && (
              <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-900/60">
                  {language === "bn" ? "পরামর্শ:" : language === "hi" ? "सुझाव:" : "Quick:"}
                </span>
                {promptList.slice(0, 4).map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(p.query)}
                    disabled={loading}
                    className="shrink-0 rounded-full border border-amber-200/80 bg-amber-50/70 px-2.5 py-0.5 text-[11px] font-medium text-amber-950 hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center gap-2 rounded-2xl border border-amber-300/70 bg-white p-1.5 shadow-[0_4px_20px_-6px_rgba(217,119,6,0.2)] transition-all focus-within:border-amber-500 focus-within:shadow-[0_6px_24px_-4px_rgba(217,119,6,0.3)]"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder={t.placeholder}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
                enterKeyHint="send"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-60"
              />

              {/* Voice Record Toggle Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                disabled={loading || transcribing}
                aria-label={t.holdToSpeak}
                title={recording ? t.listening : t.holdToSpeak}
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer ${
                  recording
                    ? "bg-rose-500 text-white animate-pulse shadow-md scale-105"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
                } disabled:opacity-50`}
              >
                {transcribing ? (
                  <Loader2 className="size-4 animate-spin text-amber-700" />
                ) : recording ? (
                  <Square className="size-4 fill-current" />
                ) : (
                  <Mic className="size-4" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 px-4 text-xs font-bold text-white shadow-xs transition-all hover:from-amber-600 hover:to-amber-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
                <span className="hidden sm:inline">{t.send}</span>
              </button>
            </form>

            {/* Voice Active Alert */}
            {recording && (
              <div className="mt-2 flex items-center justify-center gap-2 text-center text-xs font-bold text-rose-600 animate-pulse">
                <span className="size-2 rounded-full bg-rose-500" />
                <span>{t.listening}</span>
              </div>
            )}

            {/* Footer Disclaimer */}
            <p className="mt-2 text-center text-[10px] text-slate-400 sm:text-[11px]">
              {t.disclaimer}
            </p>
          </div>
        </div>

        {/* ===================================================================
            Personalization Modal Dialog (Sleek, Blurred Backdrop)
            =================================================================== */}
        {showBirthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-amber-300/80 bg-white p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-xs">
                    <Compass className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-amber-950">
                      {t.modalTitle}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {t.modalSubtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBirthModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Profile Auto-fill shortcut if signed in */}
              {isSignedIn && (
                <div className="flex items-center justify-between rounded-xl border border-amber-200/70 bg-amber-50/60 px-3.5 py-2">
                  <span className="text-xs font-medium text-amber-900">
                    {user?.full_name ? `${user.full_name}'s Profile` : "Saved Profile"}
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillProfile}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-amber-800 shadow-2xs border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <UserRound className="size-3" />
                    <span>{t.autofillProfile}</span>
                  </button>
                </div>
              )}

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.dobLabel}
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-amber-200/80 bg-amber-50/20 px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.tobLabel}
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full rounded-xl border border-amber-200/80 bg-amber-50/20 px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.pobLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.pobPlaceholder}
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full rounded-xl border border-amber-200/80 bg-amber-50/20 px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBirthModal(false)}
                  className="text-xs cursor-pointer"
                >
                  {t.cancel}
                </Button>
                <Button
                  size="sm"
                  onClick={saveBirthProfile}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {t.saveAndSync}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            Dislike Feedback Modal
            =================================================================== */}
        {dislikeModalIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-amber-300/80 bg-white p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2.5 text-amber-900 font-display font-bold text-base">
                <AlertCircle className="size-5 text-amber-600" />
                <span>{t.dislikeTitle}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.dislikeDesc}
              </p>

              <textarea
                rows={3}
                placeholder={t.dislikePlaceholder}
                value={dislikeReason}
                onChange={(e) => setDislikeReason(e.target.value)}
                className="w-full rounded-2xl border border-amber-200/80 bg-amber-50/20 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDislikeModalIndex(null)}
                  className="text-xs cursor-pointer"
                >
                  {t.cancel}
                </Button>
                <Button
                  size="sm"
                  onClick={submitDislikeFeedback}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {t.submitFeedback}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
