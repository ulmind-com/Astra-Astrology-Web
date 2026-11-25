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
  Compass,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  HelpCircle,
  Mail,
  MapPin,
  Moon,
  Orbit,
  Phone,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UploadCloud,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { Badge, Button, Card, CardBody, Input } from "@/components/ui";
import { astrologerApi, type AstrologerApplicationData } from "@/lib/api";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";

const ASTROLOGICAL_SKILLS = [
  { id: "vedic_astrology", label: "বৈদিক জ্যোতিষ (Vedic Astrology)", icon: Sun },
  { id: "kp_astrology", label: "কেপি জ্যোতিষ (KP System)", icon: Orbit },
  { id: "tarot", label: "ট্যারো কার্ড রিডিং (Tarot)", icon: Sparkles },
  { id: "palmistry", label: "হস্তরেখা বিচার (Palmistry)", icon: Award },
  { id: "numerology", label: "সংখ্যাতত্ত্ব (Numerology)", icon: Star },
  { id: "vastu", label: "বাস্তু শাস্ত্র (Vastu Shastra)", icon: Compass },
  { id: "nadi", label: "নাড়ী জ্যোতিষ (Nadi Astrology)", icon: BookOpen },
  { id: "prashna", label: "প্রশ্ন কুষ্ঠি (Prashna Chart)", icon: Moon },
  { id: "lal_kitab", label: "লাল কিতাব প্রতিকার (Lal Kitab)", icon: Flame },
  { id: "face_reading", label: "মুখমণ্ডল বিচার (Face Reading)", icon: User },
];

const SPECIALISATIONS = [
  "কর্মজীবন ও ব্যবসা (Career & Business)",
  "প্রেম ও সম্পর্ক (Love & Relationship)",
  "বিবাহ ও যোটক মিলন (Marriage & Compatibility)",
  "আর্থিক সমৃদ্ধি ও বিনিয়োগ (Finance & Wealth)",
  "স্বাস্থ্য ও দৈহিক শান্তি (Health & Vitality)",
  "শিক্ষা ও বিদেশ যাত্রা (Education & Foreign Travel)",
  "রত্ন পাথর ও বৈদিক প্রতিকার (Gemstones & Remedies)",
  "সন্তান ভাগ্য ও পরিবার (Children & Family)",
  "আইনি জটিলতা ও শত্রু নাশ (Legal & Conflict)",
];

const POPULAR_LANGUAGES = [
  "বাংলা",
  "ইংরেজি",
  "হিন্দি",
  "সংস্কৃত",
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

export default function BecomeAnAstrologerPage() {
  // Step indicator: 1 to 4 (5 is success confirmation)
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Form State - Step 1: Personal
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState("male");
  const [age, setAge] = React.useState<number | "">(38);
  const [city, setCity] = React.useState("");
  const [stateName, setStateName] = React.useState("West Bengal");
  const [pincode, setPincode] = React.useState("");
  const [address, setAddress] = React.useState("");

  // Email OTP State
  const [otpCode, setOtpCode] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [isOtpVerified, setIsOtpVerified] = React.useState(false);
  const [uploadToken, setUploadToken] = React.useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = React.useState(false);
  const [resendCountdown, setResendCountdown] = React.useState(0);

  // Form State - Step 2: Astrological Competence
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([
    "vedic_astrology",
    "kp_astrology",
  ]);
  const [selectedSpecialisations, setSelectedSpecialisations] = React.useState<string[]>([
    "কর্মজীবন ও ব্যবসা (Career & Business)",
    "প্রেম ও সম্পর্ক (Love & Relationship)",
    "বিবাহ ও যোটক মিলন (Marriage & Compatibility)",
  ]);
  const [experienceYears, setExperienceYears] = React.useState<number>(10);
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>([
    "বাংলা",
    "ইংরেজি",
  ]);
  const [qualificationsText, setQualificationsText] = React.useState(
    "জ্যোতিষ রত্ন, স্বর্ণপদক প্রাপ্ত জ্যোতিষাচার্য"
  );
  const [bio, setBio] = React.useState("");

  // Form State - Step 3: Media & Documents & Bank
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const [identityProofUrl, setIdentityProofUrl] = React.useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = React.useState(false);

  const [bankAccountNumber, setBankAccountNumber] = React.useState("");
  const [bankIfsc, setBankIfsc] = React.useState("");
  const [bankAccountHolder, setBankAccountHolder] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [upiId, setUpiId] = React.useState("");
  const [panCard, setPanCard] = React.useState("");

  // Agreement
  const [acceptedTerms, setAcceptedTerms] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedApp, setSubmittedApp] = React.useState<AstrologerApplicationData | null>(null);
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
      await astrologerApi.sendApplicationOtp(email.trim().toLowerCase());
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
      const res = await astrologerApi.verifyApplicationOtp(email.trim().toLowerCase(), otpCode.trim());
      if (res?.upload_token) {
        setUploadToken(res.upload_token);
      }
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
    if (!uploadToken) {
      toast.error("নথি আপলোডের আগে অনুগ্রহ করে ইমেইল ওটিপি যাচাই করুন।");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ছবির আকার সর্বোচ্চ ১০ মেগাবাইট হতে পারবে।");
      return;
    }
    try {
      setIsUploadingAvatar(true);
      const res = await astrologerApi.uploadApplicationDoc(file, uploadToken);
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
    if (!uploadToken) {
      toast.error("নথি আপলোডের আগে অনুগ্রহ করে ইমেইল ওটিপি যাচাই করুন।");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error("নথিপত্রের আকার সর্বোচ্চ ১৫ মেগাবাইট হতে পারবে।");
      return;
    }
    try {
      setIsUploadingDoc(true);
      const res = await astrologerApi.uploadApplicationDoc(file, uploadToken);
      const data = (res as any)?.data || res;
      setIdentityProofUrl(data.url);
      toast.success("সনদপত্র / পরিচয়পত্র সফলভাবে আপলোড হয়েছে!");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "নথিপত্র আপলোড ব্যর্থ হয়েছে।";
      toast.error(msg);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  // Toggle Skill
  const toggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      if (selectedSkills.length === 1) {
        toast.error("কমপক্ষে একটি শাস্ত্রীয় পদ্ধতি নির্বাচন করা আবশ্যক।");
        return;
      }
      setSelectedSkills(selectedSkills.filter((s) => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  // Toggle Specialisation
  const toggleSpecialisation = (item: string) => {
    if (selectedSpecialisations.includes(item)) {
      if (selectedSpecialisations.length === 1) {
        toast.error("কমপক্ষে একটি পরামর্শের ক্ষেত্র নির্বাচন করা আবশ্যক।");
        return;
      }
      setSelectedSpecialisations(selectedSpecialisations.filter((s) => s !== item));
    } else {
      setSelectedSpecialisations([...selectedSpecialisations, item]);
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
    if (selectedSkills.length === 0) {
      toast.error("কমপক্ষে একটি শাস্ত্রীয় দক্ষতা নির্বাচন করুন।");
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
      toast.error("অনুগ্রহ করে জ্যোতিষীয় সেবার অঙ্গীকারনামায় সম্মতি দিন।");
      return;
    }

    try {
      setIsSubmitting(true);
      const qualifications = qualificationsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        otp_code: otpCode.trim(),
        gender,
        age: age ? Number(age) : null,
        city: city.trim(),
        state: stateName.trim(),
        pincode: pincode.trim() || null,
        address: address.trim() || null,
        skills: selectedSkills,
        specialisations: selectedSpecialisations,
        experience_years: experienceYears,
        languages: selectedLanguages,
        qualifications,
        bio: bio.trim() || null,
        avatar_url: avatarUrl || null,
        identity_proof_url: identityProofUrl || null,
        bank_account_number: bankAccountNumber.trim() || null,
        bank_ifsc: bankIfsc.trim().toUpperCase() || null,
        bank_account_holder: bankAccountHolder.trim() || null,
        bank_name: bankName.trim() || null,
        upi_id: upiId.trim() || null,
        pan_card: panCard.trim().toUpperCase() || null,
      };

      const res = await astrologerApi.submitApplication(payload);
      const app = (res as any)?.data || res;
      setSubmittedApp(app);
      setCurrentStep(5); // Show success confirmation
      toast.success("আপনার জ্যোতিষী আবেদন সফলভাবে দাখিল হয়েছে!");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "আবেদন দাখিল করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
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
      {/* SACRED ASTROLOGER HERO BANNER                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-700 via-amber-800 to-stone-900 text-white pt-14 pb-20 shadow-md">
        {/* Subtle Constellation / Star Ornament */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="size-4 text-amber-300 animate-pulse" />
            <span>দিব্য অ্যাস্ট্রোলজি প্যানেল অনবোর্ডিং</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            প্রখ্যাত জ্যোতিষী হিসেবে যুক্ত হন
          </h1>

          <p className="text-amber-100 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            ভারত ও বিদেশের লক্ষ লক্ষ ভক্ত ও জাতক-জাতিকার সাথে সরাসরি কল, চ্যাট ও ভিডিও কনসাল্টেশনের মাধ্যমে শাস্ত্রীয় সমাধান প্রদান করুন।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-amber-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-amber-300" /> সর্বোচ্চ আয়ের সুযোগ ও সময়মতো পেমেন্ট
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-amber-300" /> সরাসরি মোবাইল/ওয়েব থেকে কনসাল্টেশন
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-amber-300" /> ১০০% সুরক্ষিত ও সম্মানজনক পরিবেশ
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
                { num: 1, label: "ব্যক্তিগত তথ্য" },
                { num: 2, label: "জ্যোতিষ জ্ঞান" },
                { num: 3, label: "সনদপত্র ও ব্যাংক" },
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
        {/* STEP 1: PERSONAL INFORMATION & EMAIL OTP VERIFICATION                      */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <Card className="border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <User className="size-5 text-amber-600" />
                  ধাপ ১: ব্যক্তিগত পরিচয় ও ইমেইল যাচাইকরণ
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  অনুগ্রহ করে আপনার প্রকৃত তথ্য দিন। প্রদত্ত ইমেইলে গোপন ওটিপি কোড পাঠিয়ে পরিচয় নিশ্চিত করা হবে।
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    পুরো নাম (উপাধি সহ) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="উদাঃ আচার্য দেবাশীষ ভট্টাচার্য"
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
                      placeholder="astrologer@example.com"
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

                {/* Phone & Gender & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
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
                      লিঙ্গ
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm font-medium focus:border-amber-600 focus:outline-none"
                    >
                      <option value="male">পুরুষ (Male)</option>
                      <option value="female">মহিলা (Female)</option>
                      <option value="other">অন্যান্য (Other)</option>
                    </select>
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

                {/* City & State & Pincode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      শহর / জেলা <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="উদাঃ কলকাতা / ঢাকা"
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
                    চেম্বার / বাসস্থানের ঠিকানা
                  </label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="রাস্তা, ল্যান্ডমার্ক বা চেম্বারের নাম"
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
        {/* STEP 2: ASTROLOGICAL SKILLS, SPECIALISATIONS & EXPERIENCE                   */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <Card className="border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <CardBody className="p-6 sm:p-8 space-y-6">
              <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Award className="size-5 text-amber-600" />
                  ধাপ ২: শাস্ত্রীয় জ্ঞান, পদ্ধতি ও বিশেষত্ব
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  আপনি যেসব জ্যোতিষীয় পদ্ধতিতে গণনা ও জাতকের সমাধান দিতে দক্ষ তা নির্বাচন করুন।
                </p>
              </div>

              <div className="space-y-6">
                {/* Core Disciplines / Systems */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      জ্যোতিষীয় পদ্ধতিসমূহ (যেসব বিষয়ে আপনি পারদর্শী) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-amber-700 font-semibold">
                      {selectedSkills.length}টি পদ্ধতি নির্বাচিত
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ASTROLOGICAL_SKILLS.map((item) => {
                      const isSelected = selectedSkills.includes(item.id);
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleSkill(item.id)}
                          className={cn(
                            "cursor-pointer p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all select-none",
                            isSelected
                              ? "border-amber-600 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-200 font-bold"
                              : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-amber-300"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={cn("size-4", isSelected ? "text-amber-600" : "text-stone-400")} />
                            <span>{item.label}</span>
                          </div>
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

                {/* Consultation Focus Areas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                      পরামর্শের বিশেষত্ব (Primary Consultation Focus) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-xs text-amber-700 font-semibold">
                      {selectedSpecialisations.length}টি ক্ষেত্র নির্বাচিত
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SPECIALISATIONS.map((spec) => {
                      const isSelected = selectedSpecialisations.includes(spec);
                      return (
                        <div
                          key={spec}
                          onClick={() => toggleSpecialisation(spec)}
                          className={cn(
                            "cursor-pointer p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all select-none",
                            isSelected
                              ? "border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold"
                              : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-amber-300"
                          )}
                        >
                          <span>{spec}</span>
                          <span
                            className={cn(
                              "size-4 rounded-md flex items-center justify-center shrink-0 ml-2 text-xs",
                              isSelected
                                ? "bg-amber-600 text-white"
                                : "border border-stone-300 dark:border-stone-700"
                            )}
                          >
                            {isSelected && <Check className="size-3 stroke-[3]" />}
                          </span>
                        </div>
                      );
                    })}
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
                      max={80}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value) || 0)}
                      className="text-sm font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                      কথপোকথনের ভাষা
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
                              "px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer",
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

                {/* Qualifications & Titles */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    শাস্ত্রীয় উপাধি ও ডিগ্রি (কমা দিয়ে লিখুন)
                  </label>
                  <Input
                    value={qualificationsText}
                    onChange={(e) => setQualificationsText(e.target.value)}
                    placeholder="উদাঃ জ্যোতিষ রত্ন, জ্যোতিষ ভারতী, কেপি গোল্ড মেডেলিস্ট"
                    className="text-sm font-medium"
                  />
                </div>

                {/* Bio / Consultation Philosophy */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    গুরুকুল শিক্ষা, বংশপরম্পরা ও আত্মপরিচয় (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="উদাঃ ভারতীয় বৈদিক জ্যোতিষ ও কেপি পদ্ধতিতে বিগত ১০ বৎসর যাবত গবেষণা ও জাতকের বিভিন্ন সমস্যার নির্ভুল গণনা ও সঠিক প্রতিকার প্রদান করিয়া আসিতেছি..."
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
        {/* STEP 3: MEDIA, CERTIFICATES & PAYOUT BANK / UPI DETAILS                    */}
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
                  জাতক-জাতিকাদের সামনে আপনার স্পষ্ট প্রোফাইল প্রদর্শন এবং প্রতি সপ্তাহের কনসাল্টেশন আয় হস্তান্তরের ব্যাংক তথ্য।
                </p>
              </div>

              <div className="space-y-6">
                {/* Media Upload Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Avatar Upload */}
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-center space-y-3">
                    <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                      জ্যোতিষী প্রোফাইল ছবি (মার্জিত পোশাক)
                    </span>

                    <div className="relative size-24 rounded-2xl overflow-hidden bg-amber-100 mx-auto border-2 border-amber-300">
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
                      <p className="text-[10px] text-stone-400 mt-1">মার্জিত বেশভূষার স্পষ্ট মুখমণ্ডল ছবি</p>
                    </div>
                  </div>

                  {/* Certificate Upload */}
                  <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-center space-y-3 flex flex-col justify-between">
                    <div>
                      <span className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                        জ্যোতিষ সনদপত্র / পরিচয়পত্র
                      </span>
                      <p className="text-[11px] text-stone-500">
                        ইনস্টিটিউট সার্টিফিকেট / আধার কার্ড / ভোটার কার্ড (JPG/PDF)
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

                {/* Bank & Payout Information */}
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-amber-700" />
                    <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                      কনসাল্টেশন দক্ষিণা হস্তান্তরের বিবরণ (Payout Details)
                    </h4>
                  </div>

                  {/* UPI ID & PAN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                        UPI ID (দ্রুত আয়ের জন্য, যেমন: Google Pay / PhonePe)
                      </label>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="astrologer@okhdfcbank"
                        className="text-sm font-mono bg-white dark:bg-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                        প্যান কার্ড নম্বর (PAN Card Number)
                      </label>
                      <Input
                        value={panCard}
                        onChange={(e) => setPanCard(e.target.value)}
                        placeholder="ABCDE1234F"
                        className="text-sm font-mono uppercase bg-white dark:bg-stone-900"
                      />
                    </div>
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
                        placeholder="HDFC0001234"
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
                  ধাপ ৪: আপনার জ্যোতিষী আবেদনের সারসংক্ষেপ
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  দাখিল করার পূর্বে আপনার সমস্ত শাস্ত্রীয় দক্ষতা ও ব্যক্তিগত তথ্য পুনরায় যাচাই করে নিন।
                </p>
              </div>

              {/* Summary Card */}
              <div className="space-y-4">
                {/* 1. Identity Box */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 flex items-start gap-4">
                  <div className="relative size-16 rounded-2xl overflow-hidden bg-amber-100 shrink-0 border border-amber-300">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={fullName} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="size-full flex items-center justify-center text-amber-700 font-bold text-xl">
                        {fullName.charAt(0) || "A"}
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

                {/* 2. Astrological Skills Box */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-2 text-xs">
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
                      পদ্ধতিসমূহ:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedSkills.map((skillId, i) => {
                        const sk = ASTROLOGICAL_SKILLS.find((x) => x.id === skillId);
                        return (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border border-amber-300/60 text-[11px] font-medium"
                          >
                            {sk?.label || skillId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {selectedSpecialisations.length > 0 && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                        পরামর্শের বিশেষত্ব:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedSpecialisations.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px]"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {qualificationsText && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                      <span className="font-bold text-stone-800 dark:text-stone-200">উপাধি / ডিগ্রি: </span>
                      <span className="text-stone-700 dark:text-stone-300">{qualificationsText}</span>
                    </div>
                  )}

                  {bio && (
                    <div className="pt-2 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 leading-relaxed">
                      <b>আত্মপরিচয়:</b> {bio}
                    </div>
                  )}
                </div>

                {/* 3. Payout Details Box */}
                <div className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 text-xs space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200 mb-1">দক্ষিণা ও প্রণামী বিবরণ:</div>
                  {upiId && <div>UPI ID: <b className="font-mono">{upiId}</b></div>}
                  {panCard && <div>PAN Card: <b className="font-mono uppercase">{panCard}</b></div>}
                  {bankAccountNumber && <div>ব্যাংক অ্যাকাউন্ট: <b className="font-mono">{bankAccountNumber}</b> ({bankIfsc})</div>}
                  {bankAccountHolder && <div>অ্যাকাউন্ট হোল্ডার: {bankAccountHolder}</div>}
                  {identityProofUrl && (
                    <div className="text-emerald-600 font-semibold pt-1">
                      ✓ সনদপত্র / পরিচয়পত্র সংযুক্ত করা হয়েছে
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
                      আমি শপথ করছি যে আবেদনে প্রদত্ত সমস্ত জ্যোতিষীয় জ্ঞান ও ব্যক্তিগত তথ্য সম্পূর্ণ সত্য। আমি জ্যোতিষ শাস্ত্রের নৈতিক অনুশাসন, গ্রাহক গোপনীয়তা ও পবিত্র নিষ্ঠা অক্ষুণ্ণ রেখে জাতক-জাতিকাদের সঠিক পথপ্রদর্শন করব।
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
                  আপনার জ্যোতিষী আবেদন সফলভাবে গৃহীত হয়েছে!
                </h2>
                <p className="text-stone-600 dark:text-stone-300 text-sm max-w-md mx-auto leading-relaxed">
                  আপনার আবেদনের তথ্য ও শাস্ত্রীয় প্রশংসাপত্র আমাদের অ্যাস্ট্রোলজি প্যানেলের পর্যালোচনায় সংরক্ষিত হয়েছে।
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
                    className="p-1.5 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 hover:bg-amber-100 text-stone-600 cursor-pointer"
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
                    আমাদের অভিজ্ঞ পরিষদ ২৪ ঘণ্টার মধ্যে আপনার পরিচয় ও শাস্ত্রীয় বিশেষত্ব যাচাই করবেন।
                  </li>
                  <li>
                    অনুমোদিত হওয়ার সাথে সাথে আপনার নিবন্ধিত ইমেইল (<b>{submittedApp.email}</b>)-এ গোপন পাসওয়ার্ড ও অ্যাক্টিভেশন নিশ্চিতকরণ পাঠানো হবে।
                  </li>
                  <li>
                    অনুমোদনের পর আপনি সরাসরি জ্যোতিষী পোর্টালে (
                    <span className="font-mono text-amber-700 font-bold">https://admin.divinlink.com/login</span>
                    ) লগইন করে অনলাইন কল ও চ্যাট কনসাল্টেশন শুরু করতে পারবেন।
                  </li>
                </ol>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/">
                  <Button variant="outline" className="text-xs font-bold px-6 py-2.5">
                    মূল ওয়েবসাইটে ফিরে যান
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-2.5 shadow-md">
                    অন্যান্য জ্যোতিষীদের তালিকা দেখুন
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
