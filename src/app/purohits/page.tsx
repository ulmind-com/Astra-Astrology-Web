"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Globe,
  MapPin,
  Radio,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Avatar, Badge, Button, Card, LoadingBlock } from "@/components/ui";
import { purohitApi, type PurohitData, type PurohitPujaItem } from "@/lib/api";

function PurohitsDirectoryContent() {
  const searchParams = useSearchParams();
  const initialOnlineOnly = searchParams.get("online") === "true";

  const [searchPuja, setSearchPuja] = React.useState("");
  const [onlineOnly, setOnlineOnly] = React.useState(initialOnlineOnly);
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("all");

  const { data: purohits = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["purohits_list", onlineOnly, searchPuja, selectedLanguage],
    queryFn: async () => {
      const res = await purohitApi.list({
        online_only: onlineOnly ? true : undefined,
        search_puja: searchPuja.trim() || undefined,
        language: selectedLanguage !== "all" ? selectedLanguage : undefined,
      });
      return (res as any)?.data || (Array.isArray(res) ? res : []);
    },
  });

  const onlineCount = React.useMemo(() => {
    return purohits.filter((p: PurohitData) => p.is_online).length;
  }, [purohits]);

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-stone-950 pb-20">
      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent pt-12 pb-10 border-b border-amber-200/50 dark:border-amber-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold tracking-wide uppercase shadow-xs">
              <Flame className="size-4 text-amber-600 animate-pulse" />
              <span>অনলাইন পুরোহিত ও লাইভ বৈদিক পূজা সেবা</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 dark:text-white tracking-tight">
              ঘরে বসেই সরাসরি লাইভ ভিডিওতে{" "}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                বৈদিক পুরোহিত
              </span>{" "}
              বুক করুন
            </h1>

            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              কাশী, নবদ্বীপ ও বৃন্দাবনের শাস্ত্রজ্ঞ আচার্যদের সাথে সরাসরি লাইভ পূজা, রুদ্রাভিষেক, সত্যনারায়ণ কথা ও বিশেষ মনস্কামনা সংকল্প গ্রহণ করুন।
            </p>

            {/* Quick Live Stats Pill */}
            <div className="pt-2 flex items-center justify-center gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-stone-900 dark:text-white">{onlineCount} জন পুরোহিত অনলাইনে আছেন</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <CheckCircle2 className="size-3.5 text-emerald-600" />
                <span>১০০% শাস্ত্রীয় বিধি ও বিশুদ্ধ সংকল্প</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SEARCH & FILTERS BAR                                          */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-200 dark:border-stone-800 p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="text"
                value={searchPuja}
                onChange={(e) => setSearchPuja(e.target.value)}
                placeholder="পূজার নাম দিয়ে খুঁজুন (যেমন: লক্ষ্মী পূজা, সত্যনারায়ণ, রুদ্রাভিষেক, গৃহশান্তি...)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 placeholder:text-stone-400"
              />
            </div>

            {/* Online Only Toggle */}
            <button
              type="button"
              onClick={() => setOnlineOnly(!onlineOnly)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                onlineOnly
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200"
              }`}
            >
              <span className={`size-2.5 rounded-full ${onlineOnly ? "bg-white" : "bg-emerald-500 animate-pulse"}`} />
              <span>শুধুমাত্র অনলাইন পুরোহিত ({onlineCount})</span>
            </button>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">সমস্ত ভাষা (All Languages)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Hindi">হিন্দি (Hindi)</option>
              <option value="Sanskrit">সংস্কৃত (Sanskrit)</option>
              <option value="English">ইংরেজি (English)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PUROHITS LISTING GRID                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {isLoading ? (
          <div className="py-20">
            <LoadingBlock label="বৈদিক পুরোহিতদের তালিকা লোড হচ্ছে..." />
          </div>
        ) : purohits.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-stone-300 dark:border-stone-700 max-w-lg mx-auto">
            <Flame className="size-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-white">কোনো পুরোহিত পাওয়া যায়নি</h3>
            <p className="text-xs text-stone-500 mt-1">
              আপনার ফিল্টার অথবা সার্চের নামের সাথে কোনো পুরোহিতের তথ্য মেলেনি। ফিল্টার রিসেট করে পুনরায় চেষ্টা করুন।
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchPuja("");
                setOnlineOnly(false);
                setSelectedLanguage("all");
              }}
              className="mt-4 font-bold text-xs"
            >
              সব ফিল্টার রিসেট করুন
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purohits.map((purohit: PurohitData) => {
              const activePujas = (purohit.pujas || []).filter((p: PurohitPujaItem) => p.is_active);
              return (
                <Card
                  key={purohit.id}
                  className="group relative flex flex-col justify-between border-2 border-stone-200/80 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-600 transition-all rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/5 bg-white dark:bg-stone-900"
                >
                  <div className="p-5 space-y-4">
                    {/* Top Header: Avatar & Online Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <Avatar
                          src={purohit.avatar_url || undefined}
                          name={purohit.display_name}
                          size="lg"
                          className="ring-2 ring-amber-400/50"
                        />
                        {purohit.is_online ? (
                          <span
                            title="Online Now"
                            className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900"
                          >
                            <span className="h-2 w-2 rounded-full bg-white" />
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {purohit.is_online ? (
                          <Badge tone="neutral" className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold text-[11px] animate-pulse">
                            🟢 Online Now
                          </Badge>
                        ) : (
                          <Badge tone="neutral" className="bg-stone-100 text-stone-500 border-stone-200 text-[10px]">
                            ⚪ Offline
                          </Badge>
                        )}
                        <span className="text-[11px] font-bold text-stone-500">
                          দক্ষিণা ₹{purohit.starting_price_inr} থেকে শুরু
                        </span>
                      </div>
                    </div>

                    {/* Purohit Info */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-stone-900 dark:text-white group-hover:text-amber-600 transition-colors">
                          {purohit.display_name}
                        </h3>
                        {purohit.is_verified && (
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                        {purohit.title || "Vedic Acharya & Purohit"}
                      </p>
                    </div>

                    {/* Meta Stats */}
                    <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-1">
                        <Star className="size-3.5 fill-amber-400 text-amber-500" />
                        <span className="font-bold text-stone-800 dark:text-stone-200">
                          {purohit.rating ? purohit.rating.toFixed(1) : "5.0"}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{purohit.experience_years} বছরের অভিজ্ঞতা</span>
                      {purohit.city && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 truncate max-w-[100px]">
                            <MapPin className="size-3 text-stone-400" />
                            {purohit.city}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Languages */}
                    {purohit.languages?.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                        <Globe className="size-3 text-stone-400 shrink-0" />
                        <span className="truncate">{purohit.languages.join(", ")}</span>
                      </div>
                    )}

                    {/* Available Pujas in Catalog */}
                    <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-amber-950 dark:text-amber-200 text-[11px]">
                        <span>পূজা ক্যাটালগ ({activePujas.length} টি পূজা)</span>
                        <span className="text-amber-700 dark:text-amber-400">নির্ধারিত দক্ষিণা</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activePujas.slice(0, 3).map((puja: PurohitPujaItem) => (
                          <span
                            key={puja.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 text-[11px] font-medium text-stone-700 dark:text-stone-300"
                          >
                            <span>{puja.puja_name.split("(")[0]}</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{puja.price_inr}</span>
                          </span>
                        ))}
                        {activePujas.length > 3 && (
                          <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold self-center">
                            +{activePujas.length - 3} আরও
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <div className="p-4 bg-stone-50/80 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-800">
                    <Link href={`/purohits/${purohit.slug || purohit.id}`}>
                      <Button
                        variant="primary"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5"
                      >
                        <Flame className="size-4 text-amber-200" />
                        <span>পূজার তালিকা দেখুন ও বুক করুন</span>
                        <ChevronRight className="size-4 ml-auto" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PurohitsDirectoryPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen py-24 flex items-center justify-center">
          <LoadingBlock label="পুরোহিতদের তালিকা লোড হচ্ছে..." />
        </div>
      }
    >
      <PurohitsDirectoryContent />
    </React.Suspense>
  );
}
