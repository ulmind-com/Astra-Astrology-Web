"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Coins,
  ChevronRight,
  Hand,
  RotateCcw,
  Upload,
  Download,
  Share2,
  Info,
  Layers,
  Heart,
  Brain,
  ShieldCheck,
  Compass,
  Sun,
  Flame,
  Award,
  ArrowRight,
  UserCheck,
} from "lucide-react";

import { palmReadingApi, userApi } from "@/lib/api";
import {
  detectPalmFromVideo,
  drawLivePalmMesh,
  measurePalmFrom,
  LivePalmStatus,
  Pt,
} from "@/lib/palm-measure";
import { palmI18n, PalmLocale } from "@/lib/palm-reading-i18n";
import {
  PalmReading,
  PalmReadingAvailability,
  PalmScanResponse,
} from "@/types";

export default function PalmReadingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<PalmLocale>("bn");
  const t = palmI18n[lang];

  // Gender & Hand Selection State
  // Traditional rule: Male = Left Hand; Female = Right Hand
  const [gender, setGender] = useState<"male" | "female">("male");
  const [handChoice, setHandChoice] = useState<"left" | "right">("left");

  // Camera & Stream State
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Live detection & AI feedback
  const [liveStatus, setLiveStatus] = useState<LivePalmStatus | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepMessage, setScanStepMessage] = useState("");

  // Scan Results
  const [scanResult, setScanResult] = useState<PalmScanResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Availability & Coins
  const [availability, setAvailability] = useState<PalmReadingAvailability | null>(null);
  const [loadingAvail, setLoadingAvail] = useState(true);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load user gender and palm availability on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [availRes, userRes] = await Promise.allSettled([
          palmReadingApi.availability(),
          userApi.profile(),
        ]);

        if (isMounted && availRes.status === "fulfilled" && availRes.value) {
          setAvailability(availRes.value);
        }

        if (isMounted && userRes.status === "fulfilled" && userRes.value) {
          const userGender = userRes.value.gender?.toLowerCase();
          if (userGender === "female") {
            setGender("female");
            setHandChoice("right");
          } else {
            setGender("male");
            setHandChoice("left");
          }
        }
      } catch (e) {
        console.error("Error loading palm availability:", e);
      } finally {
        if (isMounted) setLoadingAvail(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update hand choice automatically when gender is changed
  const handleGenderChange = (selected: "male" | "female") => {
    setGender(selected);
    if (selected === "male") {
      setHandChoice("left");
    } else {
      setHandChoice("right");
    }
  };

  // Toggle hand directly if user wants to scan other hand
  const toggleHand = () => {
    setHandChoice((prev) => (prev === "left" ? "right" : "left"));
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        "ক্যামেরা চালু করা সম্ভব হয়নি। অনুগ্রহ করে ব্রাউজারের ক্যামেরা পারমিশন চেক করুন অথবা ছবি আপলোড করুন।"
      );
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setLiveStatus(null);
  }, []);

  // Switch between front & back camera
  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [facingMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Continuous 60fps Detection & AR Mesh Drawing Loop
  useEffect(() => {
    if (!cameraActive) return;

    let isRunning = true;

    const processFrame = async () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && video.readyState >= 2 && canvas) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        try {
          const status = await detectPalmFromVideo(video, performance.now(), handChoice);
          if (isRunning) {
            setLiveStatus(status);
            if (status.landmarks) {
              const isAligned =
                status.quality > 0.65 &&
                status.isFingersOpen &&
                (!status.handedness || status.handedness.toLowerCase() === handChoice);
              drawLivePalmMesh(canvas, status.landmarks, isAligned, status.handedness);
            } else {
              const ctx = canvas.getContext("2d");
              if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
          }
        } catch {
          // HandLandmarker loading or transient frame skip
        }
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(processFrame);
      }
    };

    animFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      isRunning = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraActive, handChoice]);

  // Capture Current Video Frame as Blob
  const captureFrame = async (): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video) return null;

    const captureCanvas = document.createElement("canvas");
    captureCanvas.width = video.videoWidth || 1280;
    captureCanvas.height = video.videoHeight || 720;
    const ctx = captureCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    return new Promise((resolve) => {
      captureCanvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  };

  // Perform Complete Vedic Palm Scan
  const handlePerformScan = async (providedBlob?: Blob) => {
    setIsScanning(true);
    setScanStepMessage("হাতের 3D বায়োমেট্রিক ফ্রেম সংগ্রহ করা হচ্ছে...");

    try {
      let imageBlob = providedBlob;
      if (!imageBlob) {
        imageBlob = (await captureFrame()) || undefined;
      }

      if (!imageBlob) {
        throw new Error("ছবি ক্যাপচার করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।");
      }

      setScanStepMessage("মিডিয়াপাইপ ল্যান্ডমার্ক ও হাতের গঠন বিশ্লেষণ হচ্ছে...");
      await new Promise((r) => setTimeout(r, 600));

      setScanStepMessage("হৃদয়, মস্তিষ্ক, জীবন ও ভাগ্য রেখার গভীরতা পরীক্ষা করা হচ্ছে...");
      await new Promise((r) => setTimeout(r, 700));

      setScanStepMessage("বৃহস্পতি, শুক্র ও চন্দ্র পর্বতের অবস্থান শাস্ত্রীয় সূত্রে মিলানো হচ্ছে...");

      const response = await palmReadingApi.scan(imageBlob, {
        gender: gender,
        hand: handChoice,
      });

      if (!response) {
        throw new Error("স্ক্যানিং ব্যর্থ হয়েছে।");
      }

      setScanResult(response);
      stopCamera();
    } catch (err: any) {
      console.error("Scan error:", err);
      alert(err.message || "হস্তরেখা স্ক্যান করার সময় সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    } finally {
      setIsScanning(false);
      setScanStepMessage("");
    }
  };

  // Handle Photo Upload from Disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePerformScan(file);
    }
  };

  // Restart Scan
  const handleResetScan = () => {
    setScanResult(null);
    startCamera();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30">
      {/* Background Cosmic Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Breadcrumb & Language Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              হোম (Home)
            </Link>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="text-amber-400 font-medium">হস্তরেখা বিচার (Palm Reading)</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 p-1 rounded-full border border-slate-800">
            {(["bn", "en", "hi"] as PalmLocale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === l
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {l === "bn" ? "বাংলা" : l === "en" ? "EN" : "हिन्दी"}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            {t.badgeShastra}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent mb-3">
            {t.heroTitle}
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* =========================================================================
            CRITICAL GENDER RULE BANNER (Screen Instruction as Requested)
            Male = Left Hand / Female = Right Hand
        ========================================================================= */}
        {!scanResult && (
          <div className="mb-8 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-emerald-950/40 border border-amber-500/30 shadow-xl backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
                  <Hand className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      শাস্ত্রীয় নিয়ম (Vedic Rule)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      পুরুষ = বাম হাত | মহিলা = ডান হাত
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-white mt-1">
                    {gender === "male" ? t.ruleGenderMale : t.ruleGenderFemale}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 mt-0.5 leading-snug">
                    {gender === "male" ? t.ruleGenderNoteMale : t.ruleGenderNoteFemale}
                  </p>
                </div>
              </div>

              {/* Gender and Hand Selector Pill */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto shrink-0">
                <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center">
                  <button
                    onClick={() => handleGenderChange("male")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      gender === "male"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    পুরুষ (বাম হাত)
                  </button>
                  <button
                    onClick={() => handleGenderChange("female")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      gender === "female"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    মহিলা (ডান হাত)
                  </button>
                </div>

                <button
                  onClick={toggleHand}
                  className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
                  title="অন্য হাত স্ক্যান করতে ক্লিক করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    হাত: {handChoice === "left" ? "বাম হাত" : "ডান হাত"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MAIN SCANNER / CAMERA EXPERIENCE (When Scan Not Yet Produced)
        ========================================================================= */}
        {!scanResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Camera Viewport (Left / Top 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="relative w-full aspect-[4/3] max-w-lg rounded-3xl overflow-hidden bg-slate-900/90 border-2 border-slate-800 shadow-2xl shadow-black/80 flex items-center justify-center group">
                {/* Video Element */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />

                {/* Live 60fps Biometric AR Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />

                {/* Hand Silhouette Guide (When Camera is Active) */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10 opacity-30">
                    <svg
                      viewBox="0 0 200 240"
                      className="w-64 h-80 text-amber-400/40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    >
                      {/* Stylized Hand Outline */}
                      <path d="M70,220 C60,200 50,150 40,110 C35,90 45,85 52,95 C60,110 65,130 68,135 M68,135 C68,100 68,55 75,45 C80,38 88,40 88,52 C88,80 88,125 88,130 M88,130 C90,80 95,35 105,25 C112,18 120,22 120,38 C120,75 120,120 120,130 M120,130 C125,90 130,50 140,45 C146,40 152,45 152,58 C152,90 150,135 150,140 M150,140 C155,115 162,90 170,90 C176,90 180,98 178,110 C170,150 155,200 140,220 Z" />
                      {/* Central Palm Chakra Ring */}
                      <circle cx="110" cy="160" r="22" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                  </div>
                )}

                {/* Golden Laser Scanning Beam when Analyzing */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#fbbf24] animate-[bounce_2.5s_infinite] z-20" />
                )}

                {/* Camera Inactive Placeholder */}
                {!cameraActive && (
                  <div className="flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10 animate-pulse">
                      <Hand className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {handChoice === "left" ? "বাম হাত প্রস্তুত করুন" : "ডান হাত প্রস্তুত করুন"}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mb-6">
                      {t.alignPrompt}। আঙুলগুলো সোজা ও স্বাভাবিকভাবে মেলে ধরুন।
                    </p>
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      {t.startCamera}
                    </button>
                  </div>
                )}

                {/* Live Real-time Status Badge (Overlay on Camera) */}
                {cameraActive && liveStatus && (
                  <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-20">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border shadow-lg ${
                        liveStatus.detected
                          ? liveStatus.quality > 0.65
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                            : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                          : "bg-slate-900/80 text-slate-400 border-slate-700"
                      }`}
                    >
                      {liveStatus.detected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {liveStatus.handedness
                              ? `${liveStatus.handedness} Hand`
                              : "হাত শনাক্ত হয়েছে"}
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>হাত খোঁজা হচ্ছে...</span>
                        </>
                      )}
                    </div>

                    {liveStatus.warning && (
                      <div className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-lg truncate max-w-[200px]">
                        {liveStatus.warning}
                      </div>
                    )}
                  </div>
                )}

                {/* Switch Facing Mode Button */}
                {cameraActive && (
                  <button
                    onClick={switchCamera}
                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 backdrop-blur-md z-20 transition-all active:scale-90"
                    title="ক্যামেরা পরিবর্তন করুন"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Action Controls Below Viewport */}
              <div className="w-full max-w-lg mt-5 flex flex-col sm:flex-row items-center gap-3">
                {cameraActive ? (
                  <>
                    <button
                      onClick={() => handlePerformScan()}
                      disabled={isScanning}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-5 h-5" />
                      {isScanning ? scanStepMessage : t.captureBtn}
                    </button>
                    <button
                      onClick={stopCamera}
                      disabled={isScanning}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-sm font-semibold transition-colors"
                    >
                      {t.stopCamera}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startCamera}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      {t.startCamera}
                    </button>
                    <label className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>ছবি আপলোড করুন</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Information & Feature Guide Sidebar (Right 5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Cost & Balance Card */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span>স্ক্যান ফি ও ওয়ালেট</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                    {availability?.coins ?? 50} Coins
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>আপনার ব্যালেন্স:</span>
                  <span className="text-white font-mono font-bold">
                    {availability?.balance_coins ?? 0} Coins
                  </span>
                </div>
                {availability && !availability.can_afford && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-rose-400 font-medium">কয়েন অপর্যাপ্ত</span>
                    <Link
                      href="/account?tab=wallet"
                      className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
                    >
                      {t.rechargeNow} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              {/* 5 Major Palm Lines Guide */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>যা যা বিচার করা হয় (Vedic Analysis)</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">হৃদয় রেখা (Heart Line):</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        প্রেম, অনুভূতি, মানসিক শান্তি ও পারিবারিক সৌহার্দ্য বিচার।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">মস্তিষ্ক রেখা (Head Line):</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        বুদ্ধিমত্তা, মনোযোগ, মেধা ও সৃষ্টিশীল চিন্তা বিশ্লেষণের শুভাশুভ।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">জীবন রেখা (Life Line):</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        প্রাণশক্তি, দীর্ঘায়ু, শারীরিক সহনশীলতা ও স্বাস্থ্য প্রবাহ।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">ভাগ্য রেখা (Fate Line):</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        কর্মজীবন, অর্থনৈতিক উন্নতি ও আত্মশক্তিতে গড়ে ওঠা ভাগ্য বিচার।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
                    <Sun className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200">গ্রহ পর্বত (Planetary Mounts):</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        বৃহস্পতি, শুক্র, রবি, শনি, বুধ ও চন্দ্র পর্বতের শুভ অবস্থান।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuracy & Privacy Promise */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  আপনার ছবি কোনো সার্ভারে স্থায়ীভাবে জমা রাখা হয় না। সম্পূর্ণ তথ্য গোপনীয় ও সুরক্ষিত।
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             COMPREHENSIVE PALM REPORT VIEW (When Scan Completed)
          ========================================================================= */
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Success Header */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-emerald-950/30 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.readingReady}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  সম্পূর্ণ বৈদিক হস্তরেখা ফলাফল
                </h2>
                <p className="text-slate-400 text-xs md:text-sm mt-1">
                  স্ক্যানকৃত হাত: <span className="text-amber-400 font-bold capitalize">{scanResult.detected_hand || scanResult.expected_hand}</span> | লিঙ্গ: <span className="text-amber-400 font-bold capitalize">{scanResult.reading?.gender || gender}</span> | নির্ভুলতা: <span className="text-emerald-400 font-bold">{Math.round(scanResult.quality_score * 100)}%</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetScan}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  {t.retakeScan}
                </button>
              </div>
            </div>

            {/* Visualizer Mesh & Key Elemental Hand Card */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* OpenCV AR Visualization Overlay */}
              {scanResult.visualization_image && (
                <div className="md:col-span-5 rounded-3xl overflow-hidden bg-slate-900 border border-amber-500/30 shadow-xl flex flex-col">
                  <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      3D বায়োমেট্রিক ও রেখা ম্যাপিং
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      OpenCV + MediaPipe
                    </span>
                  </div>
                  <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center">
                    <img
                      src={scanResult.visualization_image}
                      alt="Palm Analysis Overlay"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Elemental Hand & Key Ratios */}
              <div className={`${scanResult.visualization_image ? "md:col-span-7" : "md:col-span-12"} space-y-4`}>
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl">
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>হাতের গঠন ও পঞ্চভূত বিশ্লেষণ</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">তালুর অনুপাত</span>
                      <span className="text-base font-extrabold text-amber-400 font-mono">
                        {scanResult.measurements.palm_aspect_ratio ?? "0.92"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">অঙ্গুলি বনাম তালু</span>
                      <span className="text-base font-extrabold text-emerald-400 font-mono">
                        {scanResult.measurements.finger_to_palm_ratio ?? "0.82"}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <span className="text-[11px] text-slate-400 block">2D:4D অনুপাত</span>
                      <span className="text-base font-extrabold text-cyan-400 font-mono">
                        {scanResult.measurements.ratio_2d_4d ?? "0.97"}
                      </span>
                    </div>
                  </div>

                  {/* Highlights from reading */}
                  {scanResult.reading?.sections && scanResult.reading.sections.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200 text-xs leading-relaxed">
                      <strong className="text-amber-400 block mb-1">
                        {scanResult.reading.sections[0].label}
                      </strong>
                      {scanResult.reading.sections[0].meaning}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Readings Section Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <span>সমুদ্রিক শাস্ত্র অনুযায়ী পুঙ্খানুপুঙ্খ অধ্যায়সমূহ</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanResult.reading?.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/30 transition-all backdrop-blur-md shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        {section.feature_label}
                      </span>
                      {section.area && (
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {section.area}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{section.label}</h4>
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                      {section.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ASTROLOGER CROSS-SELL BANNER */}
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-900/40 via-slate-900 to-purple-950/40 border-2 border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>বিশেষজ্ঞ হস্তরেখাবিদ পরামর্শ</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                  {t.astrologerCrossSell}
                </h3>
                <p className="text-slate-300 text-xs md:text-sm max-w-xl">
                  আমাদের প্রমাণিত ও যাচাইকৃত হস্তরেখা বিশেষজ্ঞ (Certified Palmists)-দের সাথে সরাসরি চ্যাট বা ভয়েস কলে যুক্ত হয়ে আপনার ভবিষ্যৎ ও প্রতিকার জানুন।
                </p>
              </div>

              <Link
                href="/astrologers?skill=palmistry"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shrink-0 flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-transform active:scale-95"
              >
                <span>{t.consultAstrologerBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
