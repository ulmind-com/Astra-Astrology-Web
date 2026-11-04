"use client";

import * as React from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { PalmLanguage } from "@/lib/palm-reading-translations";
import type { PalmScanResponse } from "@/types";

interface AudioGuruPlayerProps {
  result: PalmScanResponse;
  language: PalmLanguage;
  className?: string;
}

export function AudioGuruPlayer({ result, language, className }: AudioGuruPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [playbackRate, setPlaybackRate] = React.useState<number>(1.0);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(true);
  const [activeVoiceName, setActiveVoiceName] = React.useState<string>("");

  const synthRef = React.useRef<SpeechSynthesis | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Build spiritual and scientific narration text based on palm findings
  const narrationScript = React.useMemo(() => {
    const handType = result.hand_type?.type || "Balanced";
    const karmaRole = result.karmic_summary?.role || "";
    const vitality = result.skin_vitality?.vitality_score ?? 85;
    const dosha = result.skin_vitality?.ayurvedic_dosha || "Pitta-Vata";
    const foundMarks = (result.sacred_marks || [])
      .filter((m) => m.found)
      .map((m) => (language === "bn" ? m.sanskrit_name : m.name));
    const thumbClass = result.fingers_thumb_analysis
      ? language === "bn"
        ? result.fingers_thumb_analysis.thumb_class_bn
        : language === "hi"
        ? result.fingers_thumb_analysis.thumb_class_hi
        : result.fingers_thumb_analysis.thumb_class_en
      : "";
    const digitRatioType = result.fingers_thumb_analysis
      ? language === "bn"
        ? result.fingers_thumb_analysis.digit_ratio_type_bn
        : language === "hi"
        ? result.fingers_thumb_analysis.digit_ratio_type_hi
        : result.fingers_thumb_analysis.digit_ratio_type_en
      : "";

    if (language === "bn") {
      let script = `নমস্কার। সমুদ্রিক হস্তরেখা বিজ্ঞানে আপনার হস্ত বিশ্লেষণ প্রস্তুত। `;
      script += `আপনার হাতের প্রকৃতি হলো ${handType} তত্ত্ব। এটি আপনার সহজাত মানসিক একাগ্রতা এবং স্বভাবকে রূপায়িত করে। `;
      if (karmaRole) {
        script += `কার্মিক বিচারে এই হস্তটি আপনার ${karmaRole} নির্দেশ করছে। `;
      }
      script += `আপনার সামগ্রিক প্রাণশক্তি সূচক ${vitality} শতাংশ, যেখানে আয়ুর্বেদিক ${dosha} প্রকৃতির গভীর প্রভাব দৃশ্যমান। `;
      if (thumbClass) {
        script += `আপনার বৃদ্ধাঙ্গুষ্ঠটি সমুদ্রিক শাস্ত্র অনুযায়ী ${thumbClass} নির্দেশ করে, যা আপনার দুর্নিবার সংকল্প এবং কার্যকর নেতৃত্ব ক্ষমতার লক্ষণ। `;
      }
      if (digitRatioType) {
        script += `তর্জনী ও অনামিকার টু-ডি ফোর-ডি অনুপাত অনুযায়ী আপনার মনস্তাত্ত্বিক রূপরেখা: ${digitRatioType}। `;
      }
      if (foundMarks.length > 0) {
        script += `আপনার করতলে বিশেষ দুর্লভ ও পবিত্র শুভ চিহ্ন যেমন ${foundMarks.join(", ")} সনাক্ত হয়েছে, যা পূর্বজন্মের পুণ্যফল ও দৈব সুরক্ষা প্রদান করে। `;
      }
      script += `আপনার কর্ম ও ইচ্ছাশক্তির সুষম সমন্বয় ঘটিয়ে এগিয়ে চলুন। আপনার জীবন সাফল্য ও শান্তিতে পরিপূর্ণ হোক। শুভমস্তু।`;
      return script;
    } else if (language === "hi") {
      let script = `नमस्ते। सामुद्रिक हस्तरेखा विज्ञान में आपकी हथेली का विश्लेषण प्रस्तुत है। `;
      script += `आपकी हथेली का मुख्य तत्व ${handType} है, जो आपकी मौलिक कार्यशैली और विचारप्रणाली को दर्शाता है। `;
      if (karmaRole) {
        script += `कर्म विधान के अनुसार यह हाथ आपके ${karmaRole} को अभिव्यक्त करता है। `;
      }
      script += `आपकी जीवन ऊर्जा और प्राणशक्ति स्तर ${vitality} प्रतिशत है, तथा आपकी नाड़ी प्रकृति ${dosha} से संचालित है। `;
      if (thumbClass) {
        script += `सामुद्रिक शास्त्र के अनुसार आपका अंगूठा ${thumbClass} का प्रमाण देता है, जो उच्च संकल्पशक्ति और दृढ़ इच्छाशक्ति का सूचक है। `;
      }
      if (digitRatioType) {
        script += `तर्जनी और अनामिका का अनुपात: ${digitRatioType}। `;
      }
      if (foundMarks.length > 0) {
        script += `आपकी हथेली में विशेष शुभ राजयोग एवं मांगलिक चिह्न जैसे ${foundMarks.join(", ")} उपस्थित हैं। यह पूर्व संचित पुण्यों का द्योतक है। `;
      }
      script += `अपने कर्म और निष्ठा पर विश्वास रखें। आपका जीवन उत्तरोत्तर कल्याणमय हो। शुभमस्तु।`;
      return script;
    } else {
      let script = `Greetings. Welcome to your authentic Vedic Palmistry reading. `;
      script += `Your hand embodies the ${handType} archetype, reflecting your core temperament and subconscious tendencies. `;
      if (karmaRole) {
        script += `According to Karmic chiromancy, this hand governs your ${karmaRole}. `;
      }
      script += `Your measured Ayurvedic vitality stands at ${vitality} percent, modulated by a ${dosha} constitutional balance. `;
      if (thumbClass) {
        script += `The biometric thumb launchpad indicates a ${thumbClass}, signifying executive leadership and resolute willpower. `;
      }
      if (digitRatioType) {
        script += `Your 2D to 4D digit ratio reveals: ${digitRatioType}. `;
      }
      if (foundMarks.length > 0) {
        script += `Auspicous sacred marks identified include: ${foundMarks.join(", ")}, imparting divine protection and heightened intuition. `;
      }
      script += `Harness your conscious purushartha and align your daily actions with wisdom. May destiny favor your highest aspirations.`;
      return script;
    }
  }, [result, language]);

  // Check support & initialize synth
  React.useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }
    synthRef.current = window.speechSynthesis;

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const stopAudio = React.useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const handlePlay = React.useCallback(() => {
    if (!synthRef.current) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Stop any existing utterance
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(narrationScript);
    utteranceRef.current = utterance;
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick best matching voice
    const voices = synthRef.current.getVoices();
    const langCode = language === "bn" ? "bn" : language === "hi" ? "hi" : "en";
    const matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langCode));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
      setActiveVoiceName(matchingVoice.name);
    } else {
      utterance.lang = language === "bn" ? "bn-IN" : language === "hi" ? "hi-IN" : "en-US";
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
  }, [isPaused, language, narrationScript, playbackRate]);

  const handlePause = React.useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  }, []);

  const handleRateChange = (newRate: number) => {
    setPlaybackRate(newRate);
    if (isPlaying) {
      stopAudio();
      setTimeout(() => handlePlay(), 80);
    }
  };

  if (!isSupported) return null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-brand-300/80 bg-gradient-to-r from-brand-950 via-ink-950 to-brand-950 p-5 text-white shadow-xl sm:p-6",
        className,
      )}
    >
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 size-48 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Info & Soundwave visualizer */}
        <div className="flex items-center gap-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 shadow-md">
            <Headphones className="size-7 text-white" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex size-3.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex size-3.5 rounded-full bg-amber-500" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-brand-300 border border-brand-400/30">
                <Sparkles className="size-3 text-amber-300" />
                {language === "bn"
                  ? "অ্যাস্ট্রো-গুরু অডিও কথন"
                  : language === "hi"
                  ? "एस्ट्रो-गुरु वाणी"
                  : "AI Astrologer Guru Voice"}
              </span>

              {/* Animated Soundwave Bars */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-3.5">
                  <span className="w-0.5 rounded-full bg-amber-400 animate-[bounce_0.8s_infinite_100ms] h-3" />
                  <span className="w-0.5 rounded-full bg-amber-400 animate-[bounce_0.6s_infinite_250ms] h-3.5" />
                  <span className="w-0.5 rounded-full bg-amber-400 animate-[bounce_0.9s_infinite_400ms] h-2" />
                  <span className="w-0.5 rounded-full bg-amber-400 animate-[bounce_0.7s_infinite_150ms] h-3.5" />
                  <span className="w-0.5 rounded-full bg-amber-400 animate-[bounce_0.5s_infinite_300ms] h-2.5" />
                </div>
              )}
            </div>

            <h4 className="text-sm font-black sm:text-base">
              {language === "bn"
                ? "শুনুন আপনার হস্তরেখার সম্পূর্ণ আধ্যাত্মিক বিচার"
                : language === "hi"
                ? "सुनिए अपनी हस्तरेखा का संपूर्ण आध्यात्मिक फलादेश"
                : "Listen to Your Sacred Palm Chiromancy Reading"}
            </h4>

            <p className="text-xs text-white/70 line-clamp-1">
              {activeVoiceName
                ? `${language === "bn" ? "ভয়েস:" : language === "hi" ? "स्वर:" : "Voice:"} ${activeVoiceName}`
                : language === "bn"
                ? "স্বয়ংক্রিয় এআই কথন চালুর জন্য প্লে বাটনে চাপুন"
                : language === "hi"
                ? "सुनने के लिए प्ले बटन दबाएं"
                : "Synthesized in authentic Vedic chiromancy tone"}
            </p>
          </div>
        </div>

        {/* Right: Controls & Speed */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed Pills */}
          <div className="flex items-center rounded-xl bg-white/10 p-1 border border-white/10 text-[11px] font-bold">
            {[0.85, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleRateChange(rate)}
                className={cn(
                  "rounded-lg px-2 py-1 transition-all",
                  playbackRate === rate
                    ? "bg-amber-500 text-ink-950 font-black shadow-xs"
                    : "text-white/70 hover:text-white",
                )}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Play / Pause Button */}
          {isPlaying ? (
            <Button
              onClick={handlePause}
              className="gap-2 bg-amber-500 font-bold text-ink-950 hover:bg-amber-400 shadow-md"
            >
              <Pause className="size-4" />
              {language === "bn" ? "বিরতি" : language === "hi" ? "विराम" : "Pause"}
            </Button>
          ) : (
            <Button
              onClick={handlePlay}
              className="gap-2 bg-amber-500 font-bold text-ink-950 hover:bg-amber-400 shadow-md"
            >
              <Play className="size-4 fill-current" />
              {isPaused
                ? language === "bn"
                  ? "চালিয়ে যান"
                  : language === "hi"
                  ? "जारी रखें"
                  : "Resume"
                : language === "bn"
                ? "শুনুন"
                : language === "hi"
                ? "सुनें"
                : "Play Audio"}
            </Button>
          )}

          {/* Reset / Stop Button */}
          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={stopAudio}
              className="rounded-xl border border-white/15 bg-white/10 p-2 text-white/80 hover:bg-white/20 transition-all"
              title="Stop audio"
            >
              <RotateCcw className="size-4" />
            </button>
          )}

          {/* Toggle Transcript */}
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/20 transition-all"
          >
            <FileText className="size-3.5" />
            <span>{language === "bn" ? "পাঠ্য" : language === "hi" ? "पाठ" : "Script"}</span>
            {showTranscript ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </div>
      </div>

      {/* Transcript Accordion */}
      {showTranscript && (
        <div className="mt-4 rounded-2xl border border-white/15 bg-black/40 p-4 text-xs leading-relaxed text-white/90">
          <p className="font-semibold text-amber-300 mb-1">
            📜 {language === "bn" ? "কথনের লিখিত পাঠ্য:" : language === "hi" ? "कथन का मूल पाठ:" : "Speech Narration Script:"}
          </p>
          <p>{narrationScript}</p>
        </div>
      )}
    </div>
  );
}
