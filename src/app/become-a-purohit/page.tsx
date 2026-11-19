"use client";

import {
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  FileText,
  Flame,
  Globe,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { Badge, Button, Card, CardBody, Input } from "@/components/ui";
import { purohitApi, type PurohitApplicationData } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const VEDIC_SHAKHAS = [
  "যজুর্বেদীয় (শুক্ল / কৃষ্ণ)",
  "সামবেদীয় (কৌথুম শাখা)",
  "ঋগবেদীয় স্মার্ত আচার্য",
  "অথর্ববেদীয় পরম্পরা",
  "স্মার্ত আচার্য ও পৌরাণিক বিধি",
  "অন্যান্য বৈদিক শাখা",
];

const POPULAR_SPECIALIZATIONS = [
  "শ্রী রুদ্রাভিষেক ও মহাদেব অভিষেক",
  "শ্রী সত্যনারায়ণ ব্রতকথা ও পূজা",
  "কালসর্প ও নবগ্রহ দোষ শান্তি পূজা",
  "গৃহপ্রবেশ ও বাস্তু শান্তি যজ্ঞ",
  "মহালক্ষ্মী পূজা ও দীপাবলি মহোৎসব",
  "শ্রী সংকটমোচন হনুমান পূজা ও আরতি",
  "বিবাহ ও উপনয়ন সংস্কার",
  "মহামৃত্যুঞ্জয় জপ ও শান্তি হোম",
  "শ্রী চণ্ডী পাঠ ও দুর্গোৎসব বিধি",
  "অন্নপ্রাশন ও নামকরণ সংস্কার",
  "শ্রাদ্ধ ও তর্পণ বৈদিক ক্রিয়া",
  "অন্যান্য বিশেষ পূজা ও যজ্ঞ",
];

const POPULAR_LANGUAGES = [
  "বাংলা",
  "সংস্কৃত",
  "হিন্দি",
  "ইংরেজি",
  "ওড়িয়া",
  "অসমীয়া",
  "মৈথিলী",
];

const INDIAN_STATES = [
  "West Bengal",
  "Tripura",
  "Assam",
  "Odisha",
  "Bihar",
  "Jharkhand",
  "Uttar Pradesh",
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Other",
];

export default function BecomeAPurohitPage() {
  // Step indicator: 1 to 4 (5 is success confirmation)
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Form State
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [age, setAge] = React.useState<number | "">(35);
  const [city, setCity] = React.useState("");
  const [stateName, setStateName] = React.useState("West Bengal");
  const [pincode, setPincode] = React.useState("");
  const [address, setAddress] = React.useState("");

  // Email OTP State
  const [otpCode, setOtpCode] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [isOtpVerified, setIsOtpVerified] = React.useState(false);
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [resendCountdown, setResendCountdown] = React.useState(0);

  // Vedic Details
  const [vedicShakha, setVedicShakha] = React.useState(VEDIC_SHAKHAS[0]);
  const [experienceYears, setExperienceYears] = React.useState<number>(8);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([
    "বাংলা",
    "সংস্কৃত",
  ]);
  const [selectedSpecializations, setSelectedSpecializations] = React.useState<string[]>([
    "শ্রী রুদ্রাভিষেক ও মহাদেব অভিষেক",
    "শ্রী সত্যনারায়ণ ব্রতকথা ও পূজা",
    "গৃহপ্রবেশ ও বাস্তু শান্তি যজ্ঞ",
  ]);
  const [bio, setBio] = React.useState("");

  // Media & Documents
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [identityProofUrl, setIdentityProofUrl] = React.useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = React.useState(false);

  // Bank & UPI Details
  const [bankAccountNumber, setBankAccountNumber] = React.useState("");
  const [bankIfsc, setBankIfsc] = React.useState("");
  const [bankAccountHolder, setBankAccountHolder] = React.useState("");
  const [upiId, setUpiId] = React.useState("");

  // Agreement
  const [acceptedTerms, setAcceptedTerms] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedApp, setSubmittedApp] = React.useState<PurohitApplicationData | null>(null);
  const [copiedAppNumber, setCopiedAppNumber] = React.useState(false);

  // Resend Countdown Timer
  React.useEffect(() => {
    if (resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCountdown]);

  // Handle Send OTP
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      toast.error("অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন।");
      return;
    }
    try {
      setIsSendingOtp(true);
      await purohitApi.sendApplicationOtp(email.trim().toLowerCase());
      setIsOtpSent(true);
      setResendCountdown(60);
      toast.success(`আপনার ${email} ইমেইলে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে।`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "ইমেইলে ওটিপি পাঠাতে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.trim().length < 4) {
      toast.error("অনুগ্রহ করে সঠিক ওটিপি কোডটি লিখুন।");
      return;
    }
    try {
      setIsVerifyingOtp(true);
      await purohitApi.verifyApplicationOtp(email.trim().toLowerCase(), otpCode.trim());
      setIsOtpVerified(true);
      toast.success("ইমেইল সফলভাবে ভেরিফাই করা হয়েছে!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "ভুল ওটিপি কোড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
      toast.error(msg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Avatar Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ছবির আকার সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।");
      return;
    }
    try {
      setIsUploadingAvatar(true);
      const res = await purohitApi.uploadApplicationDoc(file);
      const data = (res as any)?.data || res;
      setAvatarUrl(data.url);
      toast.success("প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "ছবি আপলোড ব্যর্থ হয়েছে।";
      toast.error(msg);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle Document Upload
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("নথিপত্রের আকার সর্বোচ্চ ১৫ মেগাবাইট হতে পারবে।");
      return;
    }
    try {
      setIsUploadingDoc(true);
      const res = await purohitApi.uploadApplicationDoc(file);
      const data = (res as any)?.data || res;
      setIdentityProofUrl(data.url);
      toast.success("পরিচয়পত্র / প্রশংসাপত্র সফলভাবে আপলোড হয়েছে!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "নথিপত্র আপলোড ব্যর্থ হয়েছে।";
      toast.error(msg);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Toggle Specialization
  const toggleSpecialization = (item: string) => {
    if (selectedSpecializations.includes(item)) {
      if (selectedSpecializations.length === 1) {
        toast.error("কমপক্ষে একটি পূজার বিশেষত্ব নির্বাচন করা আবশ্যক।");
        return;
      }
      setSelectedSpecializations(selectedSpecializations.filter((s) => s !== item));
    } else {
      setSelectedSpecializations([...selectedSpecializations, item]);
    }
  };

  // Toggle Language
  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length === 1) {
        toast.error("কমপক্ষে একটি ভাষা নির্বাচন করা আবশ্যক।");
        return;
      }
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!fullName.trim() || fullName.trim().length < 3) {
      toast.error("অনুগ্রহ করে আপনার পুরো নাম লিখুন।");
      return false;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error("অনুগ্রহ করে আপনার ১০-সংখ্যার মোবাইল নম্বর লিখুন।");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("অনুগ্রহ করে আপনার ইমেইল ঠিকানা লিখুন।");
      return false;
    }
    if (!isOtpVerified) {
      toast.error("আবেদন এগিয়ে নিতে অনুগ্রহ করে আপনার ইমেইল ওটিপি ভেরিফাই করুন।");
      return false;
    }
    if (!city.trim()) {
      toast.error("অনুগ্রহ করে আপনার শহরের নাম লিখুন।");
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (selectedSpecializations.length === 0) {
      toast.error("কমপক্ষে একটি পূজার বিশেষত্ব নির্বাচন করুন।");
      return false;
    }
    if (selectedLanguages.length === 0) {
      toast.error("কমপক্ষে একটি ভাষা নির্বাচন করুন।");
      return false;
    }
    return true;
  };

  // Handle Final Submit
  const handleSubmitApplication = async () => {
    if (!acceptedTerms) {
      toast.error("অনুগ্রহ করে শাস্ত্রীয় সেবার অঙ্গীকারনামায় সম্মতি দিন।");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        otp_code: otpCode.trim(),
        age: age ? Number(age) : null,
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim() || null,
        address: address.trim() || null,
        vedic_shakha: vedicShakha,
        specializations: selectedSpecializations,
        experience_years: experienceYears,
        languages: selectedLanguages,
        bio: bio.trim() || null,
        avatar_url: avatarUrl || null,
        identity_proof_url: identityProofUrl || null,
        bank_account_number: bankAccountNumber.trim() || null,
        bank_ifsc: bankIfsc.trim().toUpperCase() || null,
        bank_account_holder: bankAccountHolder.trim() || null,
        upi_id: upiId.trim() || null,
      };

      const res = await purohitApi.submitApplication(payload);
      const app = (res as any)?.data || res;
      setSubmittedApp(app);
      setCurrentStep(5); // Show success screen
      toast.success("আপনার বৈদিক আবেদন সফলভাবে দাখিল হয়েছে!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "আবেদন দাখিল করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAppNumber = () => {
    if (submittedApp?.application_number) {
      navigator.clipboard.writeText(submittedApp.application_number);
      setCopiedAppNumber(true);
      toast.success("আবেদন নম্বর কপি করা হয়েছে!");
      setTimeout(() => setCopiedAppNumber(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 pb-24">
      {/* ------------------------------------------------------------- */}
      {/* SACRED HERO BANNER                                            */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 text-white pt-14 pb-20 shadow-md">
        {/* Subtle Mandala Background Ornament */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-amber-100 text-xs font-bold uppercase tracking-wider">
            <Flame className="size-4 text-amber-300 animate-pulse" />
            <span>দিব্য বৈদিক পরিষদ স্বাগতম</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            বৈদিক পুরোহিত ও আচার্য হিসেবে যুক্ত হন
          </h1>

          <p className="text-amber-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            কাশী, নবদ্বীপ ও সনাতন পরম্পরার শাস্ত্রজ্ঞ পুরোহিতদের জন্য সরাসরি অনলাইন লাইভ পূজা ও সংকল্প সেবার পবিত্রতম ডিজিটাল প্ল্যাটফর্ম।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-amber-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-amber-300" /> ১০০% শাস্ত্রীয় সম্মান ও শ্রদ্ধা
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-amber-300" /> সরাসরি ভক্তদের থেকে দক্ষিণা
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-amber-300" /> পছন্দমতো সময় ও অনলাইন পূজা
            </span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* WIZARD CONTAINER                                              */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-20">
        {/* Step Indicator Header (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-800 p-4 mb-6">
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { num: 1, label: "প্রাথমিক তথ্য" },
                { num: 2, label: "শাস্ত্রীয় জ্ঞান" },
                { num: 3, label: "নথিপত্র ও ব্যাংক" },
                { num: 4, label: "পর্যালোচনা" },
              ].map((step) => {
                const isActive = currentStep === step.num;
                const isDone = currentStep > step.num;
                return (
                  <div key={step.num} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "size-9 rounded-full flex items-center justify-center font-bold text-xs transition-all mb-1",
                        isDone
                          ? "bg-emerald-600 text-white"
                          : isActive
                          ? "bg-amber-600 text-white ring-4 ring-amber-100 dark:ring-amber-950/60"
                          : "bg-stone-100 dark:bg-stone-800 text-stone-500"
                      )}
                    >
                      {isDone ? <Check className="size-4 stroke-[3]" /> : step.num}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold hidden sm:inline-block",
                        isActive
                          ? "text-amber-800 dark:text-amber-400 font-bold"
                          : isDone
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-stone-400"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: BASIC INFORMATION & EMAIL OTP VERIFICATION                         */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <Card className="border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <User className="size-5 text-amber-600" />
                  ধাপ ১: প্রাথমিক পরিচয় ও ইমেইল যাচাইকরণ
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  অনুগ্রহ করে আপনার সঠিক পরিচয় দিন। ইমেইলে ভেরিফিকেশন কোড পাঠিয়ে পরিচয় নিশ্চিত করা হবে।
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    পুরো নাম (শ্রী / পণ্ডিত সহ) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="উদাঃ পণ্ডিত সুব্রত শাস্ত্রী"
                    className="text-sm font-medium"
                    required
                  />
                </div>

                {/* Email with OTP Verification */}
                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-amber-950 dark:text-amber-200">
                      ইমেইল ঠিকানা (OTP দ্বারা যাচাইকৃত হবে) <span className="text-rose-500">*</span>
                    </label>
                    {isOtpVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="size-3.5" /> ভেরিফাইড
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      disabled={isOtpVerified}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setIsOtpSent(false);
                        setIsOtpVerified(false);
                      }}
                      placeholder="acharya@gmail.com"
                      className="text-sm bg-white dark:bg-stone-900"
                    />
                    {!isOtpVerified && (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        loading={isSendingOtp}
                        disabled={isSendingOtp || resendCountdown > 0}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 px-4"
                      >
                        {resendCountdown > 0 ? `${resendCountdown}s অপেক্ষা করুন` : isOtpSent ? "পুনরায় পাঠান" : "OTP পাঠান"}
                      </Button>
                    )}
                  </div>

                  {/* OTP Input Row */}
                  {isOtpSent && !isOtpVerified && (
                    <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2">
                      <Input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="৬ সংখ্যার OTP কোড লিখুন"
                        maxLength={8}
                        className="text-sm font-mono tracking-widest max-w-[200px] bg-white dark:bg-stone-900"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        loading={isVerifyingOtp}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      >
                        <Check className="size-3.5 mr-1" /> কোড যাচাই করুন
                      </Button>
                    </div>
                  )}
                </div>

                {/* Phone & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      মোবাইল নম্বর (হোয়াটসঅ্যাপ ও কল) <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      বয়স (বছরে)
                    </label>
                    <Input
                      type="number"
                      min={18}
                      max={100}
                      value={age}
                      onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
                      placeholder="উদাঃ 42"
                      className="text-sm font-medium"
                    />
                  </div>
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      শহর / জেলা <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="উদাঃ কলকাতা / নবদ্বীপ"
                      className="text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      রাজ্য <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm font-medium focus:border-amber-600 focus:outline-none"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      পিনকোড
                    </label>
                    <Input
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="উদাঃ 700001"
                      className="text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    আবাসস্থল / আশ্রমের ঠিকানা
                  </label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="গ্রাম/রাস্তা, পোস্ট অফিস, ল্যান্ডমার্ক"
                    className="text-sm font-medium"
                  />
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4 border-t border-stone-200 dark:border-stone-800">
                <Button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) {
                      setCurrentStep(2);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 shadow-md shadow-amber-600/20"
                >
                  পরবর্তী ধাপে যান <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: VEDIC TRADITION, SPECIALIZATIONS, EXPERIENCE & BIO                 */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <Card className="border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Award className="size-5 text-amber-600" />
                  ধাপ ২: শাস্ত্রীয় জ্ঞান, বৈদিক শাখা ও পূজার বিশেষত্ব
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  আপনার অর্জিত শাস্ত্রীয় জ্ঞান, গুরুকুল পরম্পরা ও আপনি যেসব বৈদিক পূজা সম্পন্ন করতে সক্ষম তা নির্বাচন করুন।
                </p>
              </div>

              <div className="space-y-5">
                {/* Vedic Shakha */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    বৈদিক শাখা ও পরম্পরা <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VEDIC_SHAKHAS.map((shakha) => (
                      <button
                        key={shakha}
                        type="button"
                        onClick={() => setVedicShakha(shakha)}
                        className={cn(
                          "text-left p-3 rounded-xl border text-xs font-bold transition-all",
                          vedicShakha === shakha
                            ? "border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20"
                            : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
                        )}
                      >
                        {shakha}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience in Years & Languages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      অভিজ্ঞতা (বছরে) <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={75}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value) || 0)}
                      className="text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      জানা ভাষা (মন্ত্রোচ্চারণ ও কথপোকথন)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_LANGUAGES.map((lang) => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => toggleLanguage(lang)}
                            className={cn(
                              "px-3 py-1 rounded-lg text-xs font-bold transition-colors",
                              isSelected
                                ? "bg-amber-600 text-white"
                                : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                            )}
                          >
                            {lang} {isSelected && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Puja Specializations */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      পূজার বিশেষত্ব (যেসব পূজা আপনি সম্পন্ন করবেন) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-amber-700 font-semibold">
                      {selectedSpecializations.length}টি পূজা নির্বাচিত
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {POPULAR_SPECIALIZATIONS.map((spec) => {
                      const isSelected = selectedSpecializations.includes(spec);
                      return (
                        <div
                          key={spec}
                          onClick={() => toggleSpecialization(spec)}
                          className={cn(
                            "cursor-pointer p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all select-none",
                            isSelected
                              ? "border-amber-600 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 font-bold"
                              : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-amber-300"
                          )}
                        >
                          <span>{spec}</span>
                          <span
                            className={cn(
                              "size-5 rounded-md flex items-center justify-center shrink-0 ml-2 text-xs",
                              isSelected
                                ? "bg-amber-600 text-white"
                                : "border border-stone-300 dark:border-stone-700"
                            )}
                          >
                            {isSelected && <Check className="size-3.5 stroke-[3]" />}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bio / Gurukul Lineage */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    গুরুকুল শিক্ষা, বংশপরম্পরা ও আত্মপরিচয় (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="উদাঃ নবদ্বীপ চতুষ্পাঠী হইতে ব্যাকরণ ও স্মৃতিতীর্থ উত্তীর্ণ। বিগত ১৫ বৎসর যাবত বৈদিক ক্রিয়াকাণ্ড, হোম ও রুদ্রাভিষেক সুচারুরূপে সম্পন্ন করিয়া আসিতেছি..."
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-3 text-xs focus:border-amber-600 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Prev & Next Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="font-bold text-xs"
                >
                  <ChevronLeft className="size-4 mr-1" /> পূর্ববর্তী ধাপ
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) {
                      setCurrentStep(3);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 shadow-md shadow-amber-600/20"
                >
                  পরবর্তী ধাপে যান <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: MEDIA, CERTIFICATES & DAKSHINA BANK / UPI DETAILS                  */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <Card className="border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="size-5 text-amber-600" />
                  ধাপ ৩: নথিপত্র ও দক্ষিণার ব্যাংক / UPI বিবরণ
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  ভক্তদের সামনে আপনার স্পষ্ট পরিচয় প্রদর্শন এবং পূজা সম্পন্ন হওয়ার পর সরাসরি প্রণামী/দক্ষিণা হস্তান্তরের তথ্য।
                </p>
              </div>

              <div className="space-y-6">
                {/* Media Upload Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Avatar Upload */}
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-center space-y-3">
                    <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                      পুরোহিত প্রোফাইল ছবি (পবিত্র বেশভূষা সহ)
                    </span>

                    <div className="relative size-24 rounded-full overflow-hidden bg-amber-100 mx-auto border-2 border-amber-300">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt="Avatar" fill className="object-cover" unoptimized />
                      ) : (
                        <div className="size-full flex items-center justify-center text-amber-700">
                          <User className="size-10 opacity-40" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-amber-50">
                        <UploadCloud className="size-3.5 text-amber-600" />
                        {isUploadingAvatar ? "আপলোড হচ্ছে..." : avatarUrl ? "ছবি পরিবর্তন করুন" : "ছবি আপলোড করুন"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploadingAvatar}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-stone-400 mt-1">ধুতি/উত্তরীয় বা তিলক সহ স্পষ্ট ছবি</p>
                    </div>
                  </div>

                  {/* ID / Certificate Upload */}
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-center space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                        পরিচয়পত্র / শাস্ত্রীয় সনদপত্র
                      </span>
                      <p className="text-[11px] text-stone-500">
                        আধার কার্ড / ভোটার কার্ড / গুরুকুল প্রশংসাপত্র (JPG/PDF)
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900">
                      {identityProofUrl ? (
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="size-4" /> নথি সফলভাবে আপলোড হয়েছে
                        </div>
                      ) : (
                        <FileText className="size-8 text-stone-300 mx-auto" />
                      )}
                    </div>

                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-amber-50">
                        <UploadCloud className="size-3.5 text-amber-600" />
                        {isUploadingDoc ? "আপলোড হচ্ছে..." : identityProofUrl ? "অন্য নথি আপলোড করুন" : "নথি নির্বাচন করুন"}
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleDocUpload}
                          disabled={isUploadingDoc}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bank & UPI Information for Payouts */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-amber-700" />
                    <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                      দক্ষিণা ও প্রণামী হস্তান্তরের বিবরণ (Payout Details)
                    </h4>
                  </div>

                  {/* UPI ID */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      UPI ID (তাত্ক্ষণিক দক্ষিণার জন্য, যেমন: Google Pay / PhonePe / Paytm)
                    </label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="acharya@okhdfcbank"
                      className="text-sm font-mono bg-white dark:bg-stone-900"
                    />
                  </div>

                  {/* Bank Account Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                        অ্যাকাউন্ট হোল্ডারের নাম
                      </label>
                      <Input
                        value={bankAccountHolder}
                        onChange={(e) => setBankAccountHolder(e.target.value)}
                        placeholder="পাসবুক অনুযায়ী নাম"
                        className="text-sm bg-white dark:bg-stone-900"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                        ব্যাংক অ্যাকাউন্ট নম্বর
                      </label>
                      <Input
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="Account Number"
                        className="text-sm font-mono bg-white dark:bg-stone-900"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                        IFSC কোড
                      </label>
                      <Input
                        value={bankIfsc}
                        onChange={(e) => setBankIfsc(e.target.value)}
                        placeholder="SBIN0001234"
                        className="text-sm font-mono uppercase bg-white dark:bg-stone-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Prev & Next Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="font-bold text-xs"
                >
                  <ChevronLeft className="size-4 mr-1" /> পূর্ববর্তী ধাপ
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setCurrentStep(4);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-6 py-2.5 shadow-md shadow-amber-600/20"
                >
                  পর্যালোচনা ও আবেদন করুন <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW & SUBMIT APPLICATION                                        */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <Card className="border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="size-5 text-amber-600" />
                  ধাপ ৪: আপনার বৈদিক আবেদনের সারসংক্ষেপ
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  দাখিল করার পূর্বে আপনার সমস্ত শাস্ত্রীয় ও ব্যক্তিগত তথ্য পুনরায় যাচাই করে নিন।
                </p>
              </div>

              {/* Summary Card */}
              <div className="space-y-4">
                {/* 1. Identity Box */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-start gap-4">
                  <div className="relative size-16 rounded-xl overflow-hidden bg-amber-100 shrink-0 border border-amber-300">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={fullName} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="size-full flex items-center justify-center text-amber-700 font-bold text-xl">
                        {fullName.charAt(0) || "P"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <h4 className="text-base font-bold text-stone-900 dark:text-white">{fullName}</h4>
                    <p className="text-stone-600 dark:text-stone-300">
                      ইমেইল: <b className="text-stone-900 dark:text-white">{email}</b> (ভেরিফাইড)
                    </p>
                    <p className="text-stone-600 dark:text-stone-300">
                      মোবাইল: <b className="text-stone-900 dark:text-white">{phone}</b>
                    </p>
                    <p className="text-stone-600 dark:text-stone-300">
                      ঠিকানা: {city}, {stateName} {pincode ? `(${pincode})` : ""}
                    </p>
                  </div>
                </div>

                {/* 2. Vedic Knowledge Box */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200">বৈদিক শাখা:</span>
                    <Badge tone="neutral" className="bg-amber-100 text-amber-900 border-amber-300 font-bold">
                      {vedicShakha}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200">অভিজ্ঞতা:</span>
                    <span>{experienceYears} বছর</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 dark:text-stone-200">জানা ভাষা:</span>
                    <span>{selectedLanguages.join(", ")}</span>
                  </div>

                  <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                      পূজার বিশেষত্বসমূহ:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSpecializations.map((spec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-300/60 text-[11px] font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {bio && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 leading-relaxed">
                      <b>গুরুকুল ও বংশপরিচয়:</b> {bio}
                    </div>
                  )}
                </div>

                {/* 3. Payout Details Box */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-xs space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200 mb-1">দক্ষিণা ও প্রণামী বিবরণ:</div>
                  {upiId && <div>UPI ID: <b className="font-mono">{upiId}</b></div>}
                  {bankAccountNumber && <div>ব্যাংক অ্যাকাউন্ট: <b className="font-mono">{bankAccountNumber}</b> ({bankIfsc})</div>}
                  {bankAccountHolder && <div>অ্যাকাউন্ট হোল্ডার: {bankAccountHolder}</div>}
                  {identityProofUrl && (
                    <div className="text-emerald-600 font-semibold pt-1">
                      ✓ পরিচয়পত্র / শাস্ত্রীয় সনদপত্র সংযুক্ত করা হয়েছে
                    </div>
                  )}
                </div>

                {/* Agreement Checkbox */}
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 size-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                      আমি শপথ করছি যে আবেদনে প্রদত্ত সমস্ত শাস্ত্রীয় জ্ঞান ও ব্যক্তিগত তথ্য সম্পূর্ণ সত্য। আমি শাস্ত্রীয় অনুশাসন, পবিত্র নিষ্ঠা ও শুদ্ধাচার অক্ষুণ্ণ রেখে ভক্তদের সেবা প্রদান করব।
                    </span>
                  </label>
                </div>
              </div>

              {/* Prev & Submit Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(3)}
                  disabled={isSubmitting}
                  className="font-bold text-xs"
                >
                  <ChevronLeft className="size-4 mr-1" /> পূর্ববর্তী ধাপ
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmitApplication}
                  loading={isSubmitting}
                  disabled={isSubmitting || !acceptedTerms}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-8 py-3 shadow-lg shadow-amber-600/30"
                >
                  <Send className="size-4 mr-1.5" />
                  আবেদন দাখিল করুন (Submit Application)
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SUCCESS & APPLICATION CONFIRMATION SCREEN                           */}
        {/* ========================================================================= */}
        {currentStep === 5 && submittedApp && (
          <Card className="border border-emerald-300 dark:border-emerald-900 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden">
            <CardBody className="p-8 sm:p-12 text-center space-y-6">
              {/* Sacred Success Mandala */}
              <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto text-emerald-600 border-4 border-emerald-200">
                <Check className="size-10 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                  নমস্কার আচার্য মহাশয়
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
                  আপনার বৈদিক আবেদন সফলভাবে গৃহীত হয়েছে!
                </h2>
                <p className="text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
                  আপনার আবেদনের তথ্য ও শাস্ত্রীয় নথিপত্র আমাদের বৈদিক পরিষদের পর্যালোচনায় সংরক্ষিত হয়েছে।
                </p>
              </div>

              {/* Reference Application Number */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 max-w-md mx-auto">
                <span className="text-xs text-stone-500 font-medium block mb-1">
                  আপনার আবেদন রেফারেন্স নম্বর
                </span>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-black text-amber-800 dark:text-amber-300 tracking-wider">
                    {submittedApp.application_number}
                  </span>
                  <button
                    onClick={copyAppNumber}
                    className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 hover:bg-amber-100 text-stone-600"
                    title="কপি করুন"
                  >
                    {copiedAppNumber ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="text-left text-xs space-y-3 p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 max-w-lg mx-auto">
                <h4 className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                  <Clock className="size-4 text-amber-600" />
                  পরবর্তী পদক্ষেপসমূহ:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-stone-600 dark:text-stone-300 leading-relaxed">
                  <li>
                    আমাদের পরিষদ ২৪ ঘণ্টার মধ্যে আপনার পরিচয় ও শাস্ত্রীয় বিশেষত্ব যাচাই করবেন।
                  </li>
                  <li>
                    অনুমোদিত হওয়ার সাথে সাথে আপনার নিবন্ধিত ইমেইল (<b>{submittedApp.email}</b>)-এ গোপন পাসওয়ার্ড ও সক্রিয়করণ নিশ্চিতকরণ পাঠানো হবে।
                  </li>
                  <li>
                    অনুমোদনের পর আপনি সরাসরি পুরোহিত পোর্টালে (
                    <span className="font-mono text-amber-700 font-bold">https://admin.divinlink.com/purohit-dashboard</span>
                    ) লগইন করে অনলাইন পূজা পরিচালনা করতে পারবেন।
                  </li>
                </ol>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/">
                  <Button variant="outline" className="text-xs font-bold px-6 py-2.5">
                    মূল ওয়েবসাইটে ফিরে যান
                  </Button>
                </Link>
                <Link href="/purohits">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-2.5 shadow-md">
                    অন্যান্য পুরোহিত ও পূজার তালিকা দেখুন
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
