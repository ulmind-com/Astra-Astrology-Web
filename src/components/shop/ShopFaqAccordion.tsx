"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

export function ShopFaqAccordion() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      q_bn: "১০০% ওয়ালেট ক্যাশব্যাক কীভাবে কাজ করে?",
      q_en: "How does the 100% Wallet Cashback offer work?",
      a_bn: "আপনি যখন কোনো সামগ্রীর জন্য অনলাইনে প্রিপেইড পেমেন্ট (UPI, কার্ড বা নেটব্যাঙ্কিং) সম্পন্ন করবেন, পেমেন্ট নিশ্চিত হওয়ার সাথে সাথেই পুরো টাকার সমপরিমাণ কয়েন আপনার Astra Astrology ওয়ালেটে স্বয়ংক্রিয়ভাবে ক্রেডিট হয়ে যাবে। সেই কয়েন দিয়ে আপনি সরাসরি প্ল্যাটফর্মের শীর্ষ জ্যোতিষীদের সাথে লাইভ চ্যাট বা কল কনসালটেশন করতে পারবেন।",
      a_en: "When you place a prepaid order online using UPI, Cards or Net Banking, 100% of the purchase amount is instantly credited back as coins into your Astra Astrology Wallet. You can use these coins anytime to consult certified Vedic astrologers via live chat or call.",
    },
    {
      q_bn: "প্রাণ-প্রতিষ্ঠা ও ব্যক্তিগত সংকল্প কীভাবে সম্পন্ন করা হয়?",
      q_en: "How is Vedic Prana-Pratishtha and personal Sankalpa performed?",
      a_bn: "চেকআউটের সময় আপনি ক্রেতার নাম, গোত্র ও জন্মতারিখ প্রদান করতে পারেন। কাশীর গঙ্গাতীরে বৈদিক পুরোহিতরা আপনার সেই নাম ও গোত্র উচ্চারণ করে সংকল্প বাক্য পাঠ করেন এবং মহামৃত্যুঞ্জয় মন্ত্রে সামগ্রীটি প্রাণ-প্রতিষ্ঠা করে পবিত্র শোধন সম্পন্ন করেন।",
      a_en: "During checkout, you can enter the devotee's Name, Gotra and Date of Birth. Vedic priests on the banks of Varanasi invoke these details in an authentic Sankalpa ritual, chanting consecrated mantras before securely packing the item.",
    },
    {
      q_bn: "প্রতিকার বা রত্ন-ক্রিস্টাল কীভাবে ঘরে বসে নিত্য রিচার্জ ও শুদ্ধ রাখা যায়?",
      q_en: "How can I cleanse and recharge my sacred crystal at home?",
      a_bn: "অমাবস্যা বা পূর্ণিমার রাতে প্রতিকারটি চাঁদের স্নিগ্ধ আলোয় রেখে দিলে অথবা গঙ্গাজল ও ধূপের পবিত্র ধোঁয়ায় স্পর্শ করালে তার নেতিবাচক শক্তি দূর হয়ে শুভ শক্তির প্রবাহ অটুট থাকে। সেলিনাইট প্লেট বা তামার পাত্রেও এটি পবিত্রভাবে সংরক্ষণ করা যায়।",
      a_en: "Exposing your sacred crystal or rudraksha beads to overnight moonlight on Full Moon nights, or gently wafting sacred incense smoke around them cleanses accumulated energies and keeps their spiritual vibrations resonant.",
    },
    {
      q_bn: "আমি কি সরকারি ল্যাব টেস্ট সার্টিফিকেট পাব?",
      q_en: "Do products come with Government Approved Lab Certification?",
      a_bn: "হ্যাঁ, আমাদের প্রতিটি মূল্যবান রত্ন ও রুদ্রাক্ষের সাথে সরকার অনুমোদিত জেমোলজিক্যাল ল্যাব টেস্ট কার্ড প্রদান করা হয়। সার্টিফিকেটে নির্দিষ্ট রিপোর্ট নম্বর ও কিউআর কোড থাকে যার মাধ্যমে আপনি যেকোনো সময় রত্নের সত্যতা ও প্রাকৃতিক গুণাগুণ যাচাই করতে পারবেন।",
      a_en: "Yes! All eligible gemstones and sacred rudraksha beads are tested in government-recognized gemological laboratories and come with an authenticity certificate card featuring a unique report number and QR verification.",
    },
    {
      q_bn: "ডেলিভারি হতে কত দিন সময় লাগে এবং ক্যাশ অন ডেলিভারি কি উপলব্ধ?",
      q_en: "What is the delivery timeline and is Cash on Delivery available?",
      a_bn: "সারা ভারতে সাধারণত ৩ থেকে ৫ কার্যদিবসের মধ্যে ব্লুডার্ট বা দিল্লিভারি এক্সপ্রেস কুরিয়ারের মাধ্যমে ডেলিভারি করা হয়। ক্যাশ অন ডেলিভারি (COD) উপলব্ধ রয়েছে। তবে ১০০% ওয়ালেট ক্যাশব্যাক পেতে প্রিপেইড পেমেন্ট বাঞ্ছনীয়।",
      a_en: "Orders are dispatched via express couriers (BlueDart, Delhivery) and typically arrive within 3-5 business days across India. Cash on Delivery (COD) is supported pan-India.",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <HelpCircle className="size-4 text-amber-600" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-stone-900">
          {language === "bn" ? "সাধারণ জিজ্ঞাসা ও উত্তর" : "Everything You Need to Know"}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-stone-900 flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>{language === "bn" ? f.q_bn : f.q_en}</span>
                <ChevronDown
                  className={`size-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-amber-700" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-stone-600 leading-relaxed font-medium border-t border-stone-100 pt-3 animate-in fade-in duration-200">
                  {language === "bn" ? f.a_bn : f.a_en}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
