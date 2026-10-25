"use client";

import * as React from "react";
import Link from "next/link";
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
  HelpCircle,
  History,
  Info,
  Languages,
  MapPin,
  MessageSquare,
  Moon,
  Plus,
  RefreshCw,
  Send,
  Share2,
  ShieldAlert,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  User,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui";
import { useFeaturePricing } from "@/hooks/use-feature-pricing";
import {
  aiAstrologerApi,
  type AIChatMessage,
  type AIChatResponse,
} from "@/lib/api";

const SUGGESTED_PROMPTS = [
  {
    title: "বর্তমান মহাদশা ও ফলাফল",
    query: "আমার বর্তমান বিংশোত্তরী মহাদশা ও অন্তর্দশা বিচার করে কর্ম ও আর্থিক ভাগ্য বলুন।",
    category: "dasha",
  },
  {
    title: "মাঙ্গলিক ও কালসর্প দোষ",
    query: "আমার জন্মকুন্ডলীতে কি মাঙ্গলিক দোষ বা কালসর্প দোষ আছে? প্রতিকার কী?",
    category: "kundli",
  },
  {
    title: "শনির সাড়ে সাতি ও ঢাইয়া",
    query: "আমার রাশিতে কি শনির সাড়ে সাতি বা কন্টক ঢাইয়া চলছে? শাস্ত্রীয় উপায় কী?",
    category: "saturn",
  },
  {
    title: "আজকের গ্রহ হোরা ও শুভ সময়",
    query: "আজকের দিনের অনুকূল গ্রহ হোরা ও নক্ষত্র তারা বল বিচার করে শুভ সময় নির্দেশ করুন।",
    category: "horoscope",
  },
  {
    title: "বিবাহ ও প্রেম জীবন",
    query: "কুন্ডলীর সপ্তম ভাব ও বৃহস্পতির দৃষ্টি অনুসারে আমার দাম্পত্য ও বিবাহযোগ কেমন?",
    category: "marriage",
  },
  {
    title: "বাস্তু ও উত্তর-পূর্ব কোণ",
    query: "বাড়ির উত্তর-পূর্ব (ঈশান কোণ) বাস্তু দোষ মুক্ত রাখার সর্বোত্তম শাস্ত্রীয় নিয়ম কী?",
    category: "vastu",
  },
];

export default function AIAstrologerPage() {
  const { pricing } = useFeaturePricing();
  const [messages, setMessages] = React.useState<AIChatMessage[]>([
    {
      role: "assistant",
      content:
        "নমস্কার! আমি **অ্যাস্ট্রা এআই বৈদিক জ্যোতিষী**। মহর্ষি পরাশর ও জৈমিনী শাস্ত্রের প্রাচীন সূত্র এবং সুইস এফিমেরিসের নিখুঁত গণনার ভিত্তিতে আপনার জীবনের প্রতিটি প্রশ্নের শাস্ত্রীয় ও নির্ভুল উত্তর দিতে আমি সদা প্রস্তুত।\n\nআপনি আপনার জন্ম তারিখ, সময় ও স্থান যুক্ত করে ব্যক্তিগত কুন্ডলীর ভিত্তিতে অথবা সাধারণ জ্যোতিষ ও বাস্তু বিষয়ে যেকোনো প্রশ্ন করতে পারেন।",
      timestamp: new Date().toISOString(),
      suggested_followups: [
        "আমার বর্তমান মহাদশা ও অন্তর্দশা কেমন?",
        "আমার কুন্ডলীতে মাঙ্গলিক দোষ আছে কি?",
        "আজকের দিনে কোন হোরায় শুভ কাজ শুরু করব?",
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = React.useState("");
  const [sessionId, setSessionId] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [language, setLanguage] = React.useState<"bn" | "en" | "hi">("bn");

  // Birth details state for personalization
  const [showBirthDrawer, setShowBirthDrawer] = React.useState(false);
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

  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  // Initialize session from localStorage or create new
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
        setBirthDate(b.date || "");
        setBirthTime(b.time || "");
        setBirthPlace(b.place || "");
        setLatitude(b.lat);
        setLongitude(b.lon);
      } catch {
        // ignore
      }
    }
  }, []);

  // Scroll to bottom on new message
  React.useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function saveBirthProfile() {
    const profile = {
      date: birthDate,
      time: birthTime,
      place: birthPlace,
      lat: latitude || 22.5726,
      lon: longitude || 88.3639,
    };
    localStorage.setItem("astra_ai_birth_profile", JSON.stringify(profile));
    setShowBirthDrawer(false);
    toast.success("জন্ম বিবরণ সফলভাবে সংরক্ষিত হয়েছে! পরবর্তী সকল প্রশ্ন আপনার কুন্ডলীর সাথে মিলিয়ে গণনা করা হবে।");
  }

  function clearChat() {
    if (confirm("আপনি কি নিশ্চিতভাবে এই কথোপকথন মুছে নতুন সেশন শুরু করতে চান?")) {
      const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      setSessionId(newId);
      localStorage.setItem("astra_ai_session_id", newId);
      setMessages([
        {
          role: "assistant",
          content: "নমস্কার! নতুন সেশন শুরু হয়েছে। আপনার জ্যোতিষ সংক্রান্ত যেকোনো প্রশ্ন জিজ্ঞাসা করুন।",
          timestamp: new Date().toISOString(),
        },
      ]);
      setFeedbackGiven({});
      toast.success("নতুন সেশন প্রস্তুত!");
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

    try {
      const res = await aiAstrologerApi.chat({
        message: query,
        session_id: sessionId || undefined,
        birth_date: birthDate || undefined,
        birth_time: birthTime || undefined,
        birth_place: birthPlace || undefined,
        latitude: latitude || (birthPlace ? 22.5726 : undefined),
        longitude: longitude || (birthPlace ? 88.3639 : undefined),
        preferred_language: language,
      });

      if (res.session_id && res.session_id !== sessionId) {
        setSessionId(res.session_id);
        localStorage.setItem("astra_ai_session_id", res.session_id);
      }

      const assistantMsg: AIChatMessage = {
        role: "assistant",
        content: res.reply,
        tools_called: res.tools_called,
        citations: res.citations,
        suggested_followups: res.suggested_followups,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      console.error("Chat error:", err);
      toast.error("উত্তর প্রদানে কিছুটা সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "দুঃখিত, বৈদিক গণনা সার্ভারের সাথে সংযোগে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কয়েক মুহূর্ত পর পুনরায় প্রশ্নটি করুন।",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleFeedback(msgIndex: number, rating: number) {
    const msg = messages[msgIndex];
    if (!msg || msg.role !== "assistant") return;

    if (rating === -1) {
      setDislikeModalIndex(msgIndex);
      return;
    }

    // Upvote
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
      .then(() => toast.success("ধন্যবাদ! আপনার ইতিবাচক প্রতিক্রিয়া আমাদের উৎসাহিত করে।"))
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
        toast.info("আপনার প্রতিক্রিয়া আমাদের প্রধান জ্যোতিষী প্যানেলে পাঠানো হয়েছে সংশোধনের জন্য।");
        setDislikeModalIndex(null);
        setDislikeReason("");
      })
      .catch(() => {
        setDislikeModalIndex(null);
      });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("বার্তাটি ক্লিপবোর্ডে কপি করা হয়েছে");
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#4D4664]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-[#b06d4e]/30 bg-gradient-to-br from-[#fbf4eb] via-[#fffaf5] to-[#ebd7c8]/40 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#b06d4e]/10 px-3 py-1 text-xs font-semibold text-[#b06d4e]">
                <Sparkles className="size-3.5" />
                <span>শাস্ত্রীয় RAG এনজিন • সুইস এফিমেরিস ২.১০ নির্ভুল গণনা</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4D4664] tracking-tight">
                অ্যাস্ট্রা এআই বৈদিক জ্যোতিষী
              </h1>
              <p className="text-xs sm:text-sm text-[#4D4664]/80 max-w-2xl leading-relaxed">
                বৃহৎ পরাশর শাস্ত্র, জৈমিনী সূত্র এবং ক্লায়েন্টের খাঁটি বৈদিক নথির ভিত্তিতে ২৪ ঘণ্টা সরাসরি নির্ভুল জ্যোতিষীয় সমাধান ও ব্যক্তিগত পরামর্শ।
              </p>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBirthDrawer(!showBirthDrawer)}
                className={`border-[#b06d4e]/40 text-[#b06d4e] hover:bg-[#b06d4e]/10 ${
                  birthDate ? "bg-[#b06d4e]/15 font-semibold" : ""
                }`}
              >
                <User className="mr-1.5 size-3.5" />
                {birthDate ? "কুন্ডলী সংযুক্ত ✓" : "জন্ম বিবরণ যুক্ত করুন"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-[#4D4664]/70 hover:text-red-600"
                title="নতুন সেশন"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Personalization Drawer */}
          {showBirthDrawer && (
            <div className="mt-5 rounded-2xl border border-[#b06d4e]/30 bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#b06d4e]/15">
                <span className="font-serif font-bold text-sm sm:text-base text-[#4D4664] flex items-center gap-2">
                  <Compass className="size-4 text-[#b06d4e]" />
                  ব্যক্তিগত জন্মকুন্ডলী বিবরণ (Personalized Chart Details)
                </span>
                <span className="text-xs text-[#4D4664]/60">
                  সঠিক লগ্ন ও দশা নির্ণয়ের জন্য প্রয়োজনীয়
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4D4664]/80 mb-1">
                    জন্ম তারিখ (Date of Birth)
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-[#b06d4e]/30 bg-white px-3 py-2 text-xs sm:text-sm text-[#4D4664] focus:outline-none focus:ring-2 focus:ring-[#b06d4e]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4D4664]/80 mb-1">
                    জন্ম সময় (Time of Birth)
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full rounded-xl border border-[#b06d4e]/30 bg-white px-3 py-2 text-xs sm:text-sm text-[#4D4664] focus:outline-none focus:ring-2 focus:ring-[#b06d4e]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4D4664]/80 mb-1">
                    জন্ম স্থান (Place of Birth)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Kolkata, Dhaka, Delhi"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full rounded-xl border border-[#b06d4e]/30 bg-white px-3 py-2 text-xs sm:text-sm text-[#4D4664] focus:outline-none focus:ring-2 focus:ring-[#b06d4e]/40"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBirthDrawer(false)}
                  className="text-xs"
                >
                  বাতিল
                </Button>
                <Button
                  size="sm"
                  onClick={saveBirthProfile}
                  className="bg-[#b06d4e] hover:bg-[#975c40] text-white text-xs"
                >
                  সংরক্ষণ ও কুন্ডলী সক্রিয় করুন
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-[#4D4664]/70 mb-2 flex items-center gap-1.5">
            <Wand2 className="size-3.5 text-[#b06d4e]" />
            দ্রুত শাস্ত্রীয় পরামর্শের জন্য প্রশ্ন নির্বাচন করুন:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {SUGGESTED_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                disabled={loading}
                className="shrink-0 rounded-2xl border border-[#b06d4e]/20 bg-white/70 px-3.5 py-1.5 text-xs text-[#4D4664] font-medium shadow-2xs hover:bg-[#b06d4e]/10 hover:border-[#b06d4e]/40 transition-all text-left"
              >
                <span className="font-semibold text-[#b06d4e] block">{p.title}</span>
                <span className="text-[11px] text-[#4D4664]/70 line-clamp-1">{p.query}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="mt-4 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
              >
                {!isUser && (
                  <div className="size-9 rounded-2xl bg-gradient-to-tr from-[#b06d4e] to-[#c7886a] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="size-5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-2xs ${
                    isUser
                      ? "bg-[#4D4664] text-white rounded-br-xs"
                      : "bg-white border border-[#b06d4e]/25 rounded-bl-xs text-[#4D4664]"
                  }`}
                >
                  {/* Content */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Tools Called Expandable Pill */}
                  {!isUser && msg.tools_called && msg.tools_called.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#b06d4e]/15">
                      <button
                        onClick={() =>
                          setExpandedTools((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b06d4e] hover:underline"
                      >
                        <BrainCircuit className="size-3.5" />
                        <span>ব্যবহৃত বৈদিক গণনা এনজিন ({msg.tools_called.length})</span>
                        {expandedTools[idx] ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        )}
                      </button>

                      {expandedTools[idx] && (
                        <div className="mt-2 rounded-xl bg-[#fbf4eb] p-2.5 text-[11px] text-[#4D4664]/90 space-y-1">
                          {msg.tools_called.map((tool, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-1.5">
                              <span className="size-1.5 rounded-full bg-[#b06d4e]" />
                              <span className="font-mono">{tool}</span>
                              <span className="text-muted-foreground text-[10px]">— নির্ভুল গাণিতিক গণনা সম্পন্ন</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Citations Expandable Pill */}
                  {!isUser && msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[#b06d4e]/15">
                      <button
                        onClick={() =>
                          setExpandedCitations((prev) => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b06d4e] hover:underline"
                      >
                        <BookOpen className="size-3.5" />
                        <span>শাস্ত্রীয় প্রমাণ ও ক্লায়েন্ট সূত্র ({msg.citations.length})</span>
                        {expandedCitations[idx] ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        )}
                      </button>

                      {expandedCitations[idx] && (
                        <div className="mt-2 space-y-2">
                          {msg.citations.map((cite, cIdx) => (
                            <div
                              key={cIdx}
                              className="rounded-xl border border-[#b06d4e]/20 bg-[#fffaf5] p-2.5 text-[11px] space-y-1"
                            >
                              <div className="flex items-center justify-between font-semibold text-[#b06d4e]">
                                <span>{cite.source}</span>
                                <span className="uppercase text-[9px] bg-[#b06d4e]/10 px-1.5 py-0.5 rounded">
                                  {cite.category}
                                </span>
                              </div>
                              <p className="text-[#4D4664]/80 italic line-clamp-3">
                                &ldquo;{cite.snippet}&rdquo;
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Suggested Followups */}
                  {!isUser && msg.suggested_followups && msg.suggested_followups.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#b06d4e]/15 space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-[#b06d4e] tracking-wider">
                        পরবর্তী সম্ভাব্য প্রশ্ন:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggested_followups.map((followup, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSendMessage(followup)}
                            disabled={loading}
                            className="rounded-full border border-[#b06d4e]/25 bg-[#fbf4eb] px-2.5 py-1 text-[11px] text-[#4D4664] hover:bg-[#b06d4e]/15 transition-all text-left"
                          >
                            {followup}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions: Copy & Feedback */}
                  {!isUser && (
                    <div className="mt-3 pt-2.5 border-t border-[#b06d4e]/10 flex items-center justify-between text-xs text-[#4D4664]/60">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-1 rounded-md hover:bg-[#b06d4e]/10 hover:text-[#4D4664]"
                          title="কপি করুন"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px]">এই উত্তরটি কি সহায়ক?</span>
                        <button
                          onClick={() => handleFeedback(idx, 1)}
                          disabled={feedbackGiven[idx] !== undefined}
                          className={`p-1 rounded-md transition-colors ${
                            feedbackGiven[idx] === 1
                              ? "text-emerald-600 bg-emerald-50"
                              : "hover:bg-[#b06d4e]/10 hover:text-emerald-600"
                          }`}
                          title="হ্যাঁ, সহায়ক"
                        >
                          <ThumbsUp className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(idx, -1)}
                          disabled={feedbackGiven[idx] !== undefined}
                          className={`p-1 rounded-md transition-colors ${
                            feedbackGiven[idx] === -1
                              ? "text-red-600 bg-red-50"
                              : "hover:bg-[#b06d4e]/10 hover:text-red-600"
                          }`}
                          title="ভুল বা অসন্তোষজনক"
                        >
                          <ThumbsDown className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="size-9 rounded-2xl bg-[#4D4664] text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <User className="size-5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start animate-in fade-in duration-300">
              <div className="size-9 rounded-2xl bg-gradient-to-tr from-[#b06d4e] to-[#c7886a] text-white flex items-center justify-center shrink-0 shadow-sm mt-1 animate-pulse">
                <Bot className="size-5" />
              </div>
              <div className="rounded-3xl rounded-bl-xs bg-white border border-[#b06d4e]/25 p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#b06d4e] font-semibold">
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>গ্রহস্ফুট ও বৈদিক নথি অনুসন্ধান করা হচ্ছে...</span>
                </div>
                <div className="flex gap-1.5 py-1">
                  <span className="size-2 rounded-full bg-[#b06d4e]/40 animate-bounce" />
                  <span className="size-2 rounded-full bg-[#b06d4e]/70 animate-bounce [animation-delay:0.2s]" />
                  <span className="size-2 rounded-full bg-[#b06d4e] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 mt-6 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 rounded-3xl border border-[#b06d4e]/30 bg-white/95 p-2 shadow-lg backdrop-blur-md"
          >
            <input
              type="text"
              placeholder="আপনার প্রশ্ন এখানে লিখুন (যেমন: শনির সাড়ে সাতি প্রতিকার, ক্যারিয়ার বা মাঙ্গলিক বিচার)..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-[#4D4664] placeholder:text-[#4D4664]/50 focus:outline-none"
            />

            <Button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="rounded-2xl bg-[#b06d4e] hover:bg-[#975c40] text-white px-4 py-2.5 shrink-0 shadow-xs transition-all"
            >
              <Send className="size-4 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline text-xs font-semibold">জিজ্ঞাসা করুন</span>
            </Button>
          </form>

          <p className="text-[11px] text-center text-[#4D4664]/60 mt-2">
            অ্যাস্ট্রা এআই বৈদিক শাস্ত্র ও এফিমেরিস নির্ভুল সূত্র প্রয়োগ করে। জটিল প্রতিকারের ক্ষেত্রে আমাদের অভিজ্ঞ জ্যোতিষীদের সাথেও সরাসরি পরামর্শ করতে পারেন।
          </p>
        </div>

        {/* Dislike Feedback Modal for Human-in-the-Loop */}
        {dislikeModalIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl border border-[#b06d4e]/30 bg-white p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2.5 text-amber-700 font-serif font-bold text-base">
                <AlertCircle className="size-5" />
                <span>কী কারণে উত্তরটি ভুল বা অসন্তোষজনক মনে হলো?</span>
              </div>

              <p className="text-xs text-[#4D4664]/80 leading-relaxed">
                আপনার বিস্তারিত মন্তব্যটি সরাসরি আমাদের হেড অ্যাস্ট্রোলজার প্যানেলে পাঠানো হবে যাতে এই প্রশ্নের জন্য স্থায়ী সঠিক ব্যাখ্যা শেখানো যায়।
              </p>

              <textarea
                rows={3}
                placeholder="যেমন: মহাদশার হিসাবের সাথে জন্মরাশির প্রতিকার মিলেনি..."
                value={dislikeReason}
                onChange={(e) => setDislikeReason(e.target.value)}
                className="w-full rounded-2xl border border-[#b06d4e]/30 bg-[#fffaf5] p-3 text-xs text-[#4D4664] focus:outline-none focus:ring-2 focus:ring-[#b06d4e]/40"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#b06d4e]/15">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDislikeModalIndex(null)}
                  className="text-xs"
                >
                  বাতিল
                </Button>
                <Button
                  size="sm"
                  onClick={submitDislikeFeedback}
                  className="bg-[#b06d4e] hover:bg-[#975c40] text-white text-xs"
                >
                  প্রতিক্রিয়া জমা দিন
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
