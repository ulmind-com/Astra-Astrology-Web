"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  RefreshCw,
  ScrollText,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { Badge, Button, Card, LoadingBlock } from "@/components/ui";
import { purohitApi, type PujaBookingData } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";

export default function MyPujaBookingsPage() {
  const { isSignedIn } = useAuth();

  const {
    data: bookings = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["my_puja_bookings"],
    queryFn: async () => {
      const res = await purohitApi.getMyBookings();
      return (res as any)?.data || (Array.isArray(res) ? res : []);
    },
    enabled: Boolean(isSignedIn),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Flame className="size-6 text-amber-600" />
            <span>আমার অনলাইন পূজা বুকিং (My Puja Bookings)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            আপনার সম্পন্ন ও লাইভ বৈদিক পূজার রেকর্ড এবং সরাসরি লাইভ ভিডিও রুমে প্রবেশের লিংক।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            loading={isFetching}
            className="text-xs"
          >
            <RefreshCw className="size-3.5 mr-1" />
            রিফ্রেশ
          </Button>

          <Link href="/purohits">
            <Button
              variant="primary"
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              <Plus className="size-3.5 mr-1" />
              নতুন পূজা বুক করুন
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingBlock label="পূজা বুকিং লোড হচ্ছে..." />
      ) : bookings.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-stone-300 dark:border-stone-700">
          <Flame className="size-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800 dark:text-white">
            আপনার কোনো পূজা বুকিং নেই
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            আমাদের শাস্ত্রজ্ঞ বৈদিক পুরোহিতদের সাথে সরাসরি ১-অন-১ লাইভ ভিডিওতে পূজা ও সংকল্প গ্রহণ করতে এখনই বুক করুন।
          </p>
          <Link href="/purohits">
            <Button variant="primary" size="sm" className="mt-4 bg-amber-600 font-bold text-xs">
              অনলাইন পুরোহিতদের তালিকা দেখুন &rarr;
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b: PujaBookingData) => {
            const isLive = b.status === "confirmed" || b.status === "in_progress";
            return (
              <Card
                key={b.id}
                className="p-5 border-2 border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white dark:bg-stone-900"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                      #{b.booking_number}
                    </span>
                    <span className="text-stone-300 dark:text-stone-700">•</span>
                    <span className="text-xs text-stone-500">
                      {new Date(b.created_at).toLocaleString("en-IN")}
                    </span>
                    <Badge
                      tone="neutral"
                      className={`text-[10px] font-bold ${
                        isLive
                          ? "bg-emerald-100 text-emerald-900 border-emerald-300 animate-pulse"
                          : "bg-stone-100 text-stone-600 border-stone-200"
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {b.puja_name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300">
                      আচার্য: <b>{b.purohit_name}</b> | সময়কাল: {b.puja_duration_minutes} মিনিট | দক্ষিণা: ₹{b.amount_inr}
                    </p>
                  </div>

                  {/* Sankalpa detail card */}
                  <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 text-xs text-amber-950 dark:text-amber-200 flex items-center gap-2 flex-wrap">
                    <ScrollText className="size-3.5 text-amber-600 shrink-0" />
                    <span>সংকল্প নাম: <b>{b.sankalpa_name}</b></span>
                    <span>•</span>
                    <span>গোত্র: <b>{b.sankalpa_gotra}</b></span>
                    {b.sankalpa_wish && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">মনস্কামনা: "{b.sankalpa_wish}"</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  {isLive ? (
                    <Link href={`/purohit-booking/${b.id}/room`} className="w-full md:w-auto">
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 shadow-md shadow-emerald-600/20"
                      >
                        <Video className="size-4 mr-1.5" />
                        লাইভ ভিডিও রুমে যোগ দিন &rarr;
                      </Button>
                    </Link>
                  ) : (
                    <Badge tone="neutral" className="bg-stone-100 text-stone-600 border-stone-200 text-xs px-3 py-1.5 font-bold">
                      <CheckCircle2 className="size-3.5 mr-1 text-emerald-600 inline" />
                      পূজা সম্পন্ন
                    </Badge>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
