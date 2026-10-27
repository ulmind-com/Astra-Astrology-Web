"use client";

import * as React from "react";
import {
  Compass,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Layers,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import type { AstrologyLanguage } from "@/types";

// ---------------------------------------------------------------------------
// 32 Padas Mathematical Definitions (11.25° each, N5 center at 0° True North)
// N5 spans from 348.75° to 360.0°/0.0°, N6 spans from 0.0° to 11.25°
// ---------------------------------------------------------------------------
export interface CompassPada {
  id: string;
  name: string;
  deity_bn: string;
  deity_en: string;
  quadrant: "North" | "East" | "South" | "West";
  startDeg: number;
  centerDeg: number;
  endDeg: number;
  isGoldenDoor: boolean; // The 8 Golden Doors: N3, N4, E3, E4, S3, S4, W3, W4
  effects_bn: string;
  effects_en: string;
  effects_hi: string;
  challenge_bn: string;
  remedy_bn: string;
}

export const COMPASS_PADAS: CompassPada[] = [
  // North Quadrant
  {
    id: "N6", name: "N6", deity_bn: "ভুজঙ্গ (Bhujanga)", deity_en: "Bhujanga",
    quadrant: "North", startDeg: 0.0, centerDeg: 5.625, endDeg: 11.25, isGoldenDoor: false,
    effects_bn: "পুত্রসন্তানের সাথে অহংকারের সংঘাত ও আত্মীয়দের বৈরিতা।",
    effects_en: "Ego clash with sons, hostility with close relatives.",
    effects_hi: "पुत्र के साथ वैचारिक मतभेद एवं परिजनों से दूरी।",
    challenge_bn: "পারিবারিক একাকীত্ব",
    remedy_bn: "চৌকাঠে রূপার তারের ফ্রেম দিন এবং কাচের পাত্রে ফিটকিরি রাখুন।",
  },
  {
    id: "N7", name: "N7", deity_bn: "অদিতি (Aditi)", deity_en: "Aditi",
    quadrant: "North", startDeg: 11.25, centerDeg: 16.875, endDeg: 22.5, isGoldenDoor: false,
    effects_bn: "গৃহের নারীদের মধ্যে অতিরিক্ত দুশ্চিন্তা ও স্নায়বিক অস্থিরতা।",
    effects_en: "Anxiety and nervous restlessness among female family members.",
    effects_hi: "घर की महिलाओं में अत्यधिक चिंता एवं अशांति।",
    challenge_bn: "নারীদের মানসিক চাপ",
    remedy_bn: "দরজার ওপর একটি রূপার স্বস্তিক প্রতীক স্থাপন করুন।",
  },
  {
    id: "N8", name: "N8", deity_bn: "দিতি (Diti)", deity_en: "Diti",
    quadrant: "North", startDeg: 22.5, centerDeg: 28.125, endDeg: 33.75, isGoldenDoor: false,
    effects_bn: "আয়ের তুলনায় ব্যয়ের আধিক্য ও অপ্রত্যাশিত ঋণ বৃদ্ধি।",
    effects_en: "Excess expenditure exceeding income, growth in debts.",
    effects_hi: "आमदनी से अधिक खर्च और अवांछित कर्ज में वृद्धि।",
    challenge_bn: "অর্থ অপচয়",
    remedy_bn: "দরজার নিচে অ্যালুমিনিয়াম স্ট্রিপ স্থাপন করুন।",
  },

  // East Quadrant
  {
    id: "E1", name: "E1", deity_bn: "শিখী / অগ্নি (Shikhi)", deity_en: "Shikhi",
    quadrant: "East", startDeg: 33.75, centerDeg: 39.375, endDeg: 45.0, isGoldenDoor: false,
    effects_bn: "অগ্নিকাণ্ড বা বৈদ্যুতিক বিপর্যয়ের ঝুঁকি, আকস্মিক আর্থিক ক্ষতি।",
    effects_en: "Fire/electrical hazards and sudden financial damage.",
    effects_hi: "अग्नि भय, शॉर्ट सर्किट और अचानक धन हानि।",
    challenge_bn: "আকস্মিক দুর্যোগ",
    remedy_bn: "ঈশানে রূপার পাত স্থাপন করুন ও লাল রঙ বর্জন করুন।",
  },
  {
    id: "E2", name: "E2", deity_bn: "পর্জন্য (Parjanya)", deity_en: "Parjanya",
    quadrant: "East", startDeg: 45.0, centerDeg: 50.625, endDeg: 56.25, isGoldenDoor: false,
    effects_bn: "কন্যা সন্তানের স্বাস্থ্য সমস্যা ও পরিবারে অনর্থক খরচের চাপ।",
    effects_en: "Health concerns for daughters and redundant expenditures.",
    effects_hi: "कन्या की सेहत में उतार-चढ़ाव और व्यर्थ खर्च।",
    challenge_bn: "পারিবারিক ব্যয়বৃদ্ধি",
    remedy_bn: "দরজায় হালকা সবুজ রঙের পর্দা ও তামার স্বস্তিক লাগান।",
  },
  {
    id: "E3", name: "E3", deity_bn: "জয়ন্ত (Jayanta)", deity_en: "Jayanta",
    quadrant: "East", startDeg: 56.25, centerDeg: 61.875, endDeg: 67.5, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — সর্বত্র বিজয়, রাজকীয় সম্মান, সামাজিক গ্রহণযোগ্যতা ও সৌভাগ্য।",
    effects_en: "Golden Door: Universal victory, social acclaim, enthusiasm, immense fortune.",
    effects_hi: "स्वर्णिम द्वार: सर्वत्र विजय, सम्मान एवं सौभाग्य का विस्तार।",
    challenge_bn: "অহংকার পরিহার করা",
    remedy_bn: "স্বর্ণদ্বারে সর্বদা স্নিগ্ধ আলো ও খাঁটি পিতলের নেমপ্লেট রাখুন।",
  },
  {
    id: "E4", name: "E4", deity_bn: "ইন্দ্র (Indra)", deity_en: "Indra",
    quadrant: "East", startDeg: 67.5, centerDeg: 73.125, endDeg: 78.75, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — সরকারি সহযোগিতা, উচ্চপদস্থদের কৃপা, ক্ষমতা ও প্রতিপত্তি।",
    effects_en: "Golden Door: Royal patronage, power, government favor, influential status.",
    effects_hi: "स्वर्णिम द्वार: प्रशासनिक सहयोग, प्रभाव एवं सत्ता सुख।",
    challenge_bn: "সততা রক্ষা করা",
    remedy_bn: "দরজায় পিতলের সূর্যমণ্ডল বা ওম প্রতীক ঝুলিয়ে রাখুন।",
  },
  {
    id: "E5", name: "E5", deity_bn: "সূর্য (Surya)", deity_en: "Surya",
    quadrant: "East", startDeg: 78.75, centerDeg: 84.375, endDeg: 90.0, isGoldenDoor: false,
    effects_bn: "অতিরিক্ত আত্মম্ভরিতা, উগ্র মেজাজ ও পরিবারের সদস্যদের মধ্যে কলহ।",
    effects_en: "Excess ego, aggressive temper, conflicts among family members.",
    effects_hi: "क्रोध, अहंकार और परिजनों के मध्य विवाद।",
    challenge_bn: "উগ্র মেজাজ",
    remedy_bn: "দরজায় পেস্টাল রঙ ব্যবহার করুন এবং পিতলের ঘন্টা ঝুলান।",
  },
  {
    id: "E6", name: "E6", deity_bn: "সত্য (Satya)", deity_en: "Satya",
    quadrant: "East", startDeg: 90.0, centerDeg: 95.625, endDeg: 101.25, isGoldenDoor: false,
    effects_bn: "বিশ্বাসভঙ্গ, ব্যবসায়িক অংশীদারদের প্রতিশ্রুতি খেলাপ ও আইনি শঙ্কা।",
    effects_en: "Breach of trust, broken commitments, subtle legal disputes.",
    effects_hi: "विश्वासघात, साझेदारी में वादाखिलाफी एवं कानूनी संशय।",
    challenge_bn: "প্রতারণা ঝুঁকি",
    remedy_bn: "চৌকাঠে তামার তার স্থাপন করে এনার্জি ব্যালান্স করুন।",
  },
  {
    id: "E7", name: "E7", deity_bn: "ভৃশ (Bhrisha)", deity_en: "Bhrisha",
    quadrant: "East", startDeg: 101.25, centerDeg: 106.875, endDeg: 112.5, isGoldenDoor: false,
    effects_bn: "অনর্থক ক্রোধ, মানসিক চঞ্চলতা ও আত্মীয়দের সাথে হঠাৎ বিচ্ছেদ।",
    effects_en: "Senseless anger, restlessness, sudden friction with relatives.",
    effects_hi: "व्यर्थ क्रोध, बेचैनी और अचानक संबंधों में खटास।",
    challenge_bn: "হঠকারিতা",
    remedy_bn: "দরজায় হালকা ক্রিম রঙ দিন এবং গাছপালা ব্যালান্স করুন।",
  },
  {
    id: "E8", name: "E8", deity_bn: "অন্তরীক্ষ (Antariksha)", deity_en: "Antariksha",
    quadrant: "East", startDeg: 112.5, centerDeg: 118.125, endDeg: 123.75, isGoldenDoor: false,
    effects_bn: "চুরি, প্রতারণা, সাইবার প্রতারণা বা আকস্মিক আর্থিক লুটপাটের ভয়।",
    effects_en: "Risk of burglary, cyber theft, or unexpected financial pilferage.",
    effects_hi: "चोरी, ठगी या अचानक धन की हानि की संभावना।",
    challenge_bn: "আর্থিক নিরাপত্তাহীনতা",
    remedy_bn: "দরজায় তামার স্ট্রিপ ও পঞ্চমুখী হনুমান যন্ত্র দিন।",
  },

  // South Quadrant
  {
    id: "S1", name: "S1", deity_bn: "অনিল / বায়ু (Anila)", deity_en: "Anila",
    quadrant: "South", startDeg: 123.75, centerDeg: 129.375, endDeg: 135.0, isGoldenDoor: false,
    effects_bn: "সন্তান জন্মদানে জটিলতা, ব্যবসায়িক ধীরগতি ও তীব্র মানসিক হতাশা।",
    effects_en: "Childbirth complications, business sluggishness, bouts of depression.",
    effects_hi: "संतान सुख में विलंब, व्यापार में सुस्ती एवं अवसाद।",
    challenge_bn: "উদ্যমহীনতা",
    remedy_bn: "দরজায় কপার তারের স্ট্রিপ বসান এবং লাল রঙের আলো দিন।",
  },
  {
    id: "S2", name: "S2", deity_bn: "পূষা (Pusna)", deity_en: "Pusna",
    quadrant: "South", startDeg: 135.0, centerDeg: 140.625, endDeg: 146.25, isGoldenDoor: false,
    effects_bn: "পরাধীনতা, দাসত্বসুলভ চাকরি ও কাজের যথাযথ মূল্যায়ন না পাওয়া।",
    effects_en: "Servitude mindset, under-appreciated hard work in employment.",
    effects_hi: "पराधीनता, नौकरी में शोषण और मेहनत का उचित फल न मिलना।",
    challenge_bn: "স্বাধীনতার অভাব",
    remedy_bn: "দরজায় তামার স্বস্তিক প্রতীক ও উষ্ণ হলুদ আলো দিন।",
  },
  {
    id: "S3", name: "S3", deity_bn: "বিতথ (Vitatha)", deity_en: "Vitatha",
    quadrant: "South", startDeg: 146.25, centerDeg: 151.875, endDeg: 157.5, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — সাহসী উদ্যোগে প্রভূত অর্থলাভ, উদ্যোক্তার সাফল্য ও প্রতিপত্তি।",
    effects_en: "Golden Door: Massive gains through daring ventures, entrepreneurial rise.",
    effects_hi: "स्वर्णिम द्वार: साहसिक कार्यों में अपार धनलाभ एवं प्रतिष्ठा।",
    challenge_bn: "ঝুঁকি সঠিক বিশ্লেষণ",
    remedy_bn: "স্বর্ণদ্বারটিকে সুশোভিত রাখুন এবং পিতল বা তামার ঘণ্টা লাগান।",
  },
  {
    id: "S4", name: "S4", deity_bn: "গৃহক্ষত (Gruhakshat)", deity_en: "Gruhakshat",
    quadrant: "South", startDeg: 157.5, centerDeg: 163.125, endDeg: 168.75, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — সন্তানদের সার্বিক উন্নতি, গৃহসুখ, সমৃদ্ধি ও পারিবারিক শান্তি।",
    effects_en: "Golden Door: All-round progeny prosperity, domestic bliss, continuous joy.",
    effects_hi: "स्वर्णिम द्वार: संतान का उत्कर्ष, पारिवारिक सौहार्द एवं ऐश्वर्य।",
    challenge_bn: "শৃঙ্খলা বজায় রাখা",
    remedy_bn: "দরজার কাছে লাল ঘোড়ার চিত্র বা তামার সূর্য স্থাপন করুন।",
  },
  {
    id: "S5", name: "S5", deity_bn: "যম (Yama)", deity_en: "Yama",
    quadrant: "South", startDeg: 168.75, centerDeg: 174.375, endDeg: 180.0, isGoldenDoor: false,
    effects_bn: "চরম সংকট — অকাল মৃত্যুর ভয়, দীর্ঘমেয়াদী রোগব্যাধি ও পুলিশি ঝামেলা।",
    effects_en: "Critical affliction: fear of untoward events, chronic illness, legal summons.",
    effects_hi: "गंभीर संकट: अकाल भय, असाध्य रोग एवं कानूनी अड़चनें।",
    challenge_bn: "মরণসম সংকট",
    remedy_bn: "জরুরি প্রতিকার: দরজার চৌকাঠে ৩ মিমি খাঁটি তামার পাত সিল করে দিন।",
  },
  {
    id: "S6", name: "S6", deity_bn: "গন্ধর্ব (Gandharva)", deity_en: "Gandharva",
    quadrant: "South", startDeg: 180.0, centerDeg: 185.625, endDeg: 191.25, isGoldenDoor: false,
    effects_bn: "অপমান, আর্থিক দেউলিয়াত্ব ও সমাজে অহেতুক মিথ্যা অপযশ রটা।",
    effects_en: "Public humiliation, financial insolvency, slander in society.",
    effects_hi: "अपमान, आर्थिक दिवालियापन एवं सामाजिक अपयश।",
    challenge_bn: "সম্মানহানি",
    remedy_bn: "দরজার ফ্রেমে তামার তার ও মহাবীর হনুমানজির রক্ষা কবচ দিন।",
  },
  {
    id: "S7", name: "S7", deity_bn: "ভৃঙ্গরাজ (Bhrangaraj)", deity_en: "Bhrangaraj",
    quadrant: "South", startDeg: 191.25, centerDeg: 196.875, endDeg: 202.5, isGoldenDoor: false,
    effects_bn: "কঠোর পরিশ্রম সত্ত্বেও কাঙ্ক্ষিত ফল না পাওয়া ও সঞ্চিত অর্থ ক্ষয়।",
    effects_en: "Hard labor yielding minimal outcome, depletion of savings.",
    effects_hi: "कड़े परिश्रम के बाद भी असफलता और संचित धन का क्षय।",
    challenge_bn: "শ্রমে ব্যর্থতা",
    remedy_bn: "দরজার নিচে পিতলের স্ট্রিপ স্থাপন করে বিসর্জন এনার্জি কাট অফ করুন।",
  },
  {
    id: "S8", name: "S8", deity_bn: "মৃগ (Mriga)", deity_en: "Mriga",
    quadrant: "South", startDeg: 202.5, centerDeg: 208.125, endDeg: 213.75, isGoldenDoor: false,
    effects_bn: "সন্তানের রোগ প্রতিরোধ ক্ষমতা কমে যাওয়া ও পরিবারের শক্তির অবক্ষয়।",
    effects_en: "Weakened immunity in youth and deterioration of core family vitality.",
    effects_hi: "संतान में रोग प्रतिरोधक क्षमता की कमी एवं ऊर्जा का ह्रास।",
    challenge_bn: "শক্তিহীনতা",
    remedy_bn: "দরজায় পিতলের স্ট্রিপ ও হলুদ জাইসলমের পাথর লাগান।",
  },

  // West Quadrant
  {
    id: "W1", name: "W1", deity_bn: "পিতৃ / নৈঋত (Pitri)", deity_en: "Pitri",
    quadrant: "West", startDeg: 213.75, centerDeg: 219.375, endDeg: 225.0, isGoldenDoor: false,
    effects_bn: "পিতৃপুরুষের অসন্তোষ, বংশবৃদ্ধি রোধ ও অবিরাম পারিবারিক দারিদ্র্য।",
    effects_en: "Ancestral displeasure (Pitra dosha), stagnation, chronic poverty.",
    effects_hi: "पितृ दोष, वंश वृद्धि में रुकावट और निरंतर दरिद्रता।",
    challenge_bn: "পিতৃ দোষ",
    remedy_bn: "জরুরি প্রতিকার: চৌকাঠে ৩ মিমি পিতলের পাত (Brass Strip) সিল করুন।",
  },
  {
    id: "W2", name: "W2", deity_bn: "দৌবারিক (Dauvarika)", deity_en: "Dauvarika",
    quadrant: "West", startDeg: 225.0, centerDeg: 230.625, endDeg: 236.25, isGoldenDoor: false,
    effects_bn: "দাম্পত্য অবিশ্বাস, অমূলক সন্দেহপ্রবণতা ও সম্পর্কে স্থায়ী তিক্ততা।",
    effects_en: "Marital suspicion, lack of trust, emotional distance.",
    effects_hi: "दांपत्य अविश्वास, शक का माहौल और रिश्तों में दूरी।",
    challenge_bn: "অবিশ্বাস",
    remedy_bn: "দরজায় পিতলের পাত এবং হলুদ রঙের পেইন্ট ব্যবহার করুন।",
  },
  {
    id: "W3", name: "W3", deity_bn: "সুগ্রীব (Sugriva)", deity_en: "Sugriva",
    quadrant: "West", startDeg: 236.25, centerDeg: 241.875, endDeg: 247.5, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — অভূতপূর্ব ব্যবসায়িক সমৃদ্ধি, টেকসই সঞ্চয় ও নির্ভরযোগ্য মিত্রলাভ।",
    effects_en: "Golden Door: Fast business growth, steady wealth accumulation, trusted allies.",
    effects_hi: "स्वर्णिम द्वार: तीव्र व्यावसायिक प्रगति, प्रचुर लाभ एवं निष्ठावान मित्र।",
    challenge_bn: "বিনয়ী থাকা",
    remedy_bn: "স্বর্ণদ্বারে সাদা বা সিলভার রঙের লাইট ও শুভ প্রতীক রাখুন।",
  },
  {
    id: "W4", name: "W4", deity_bn: "পুষ্পদন্ত (Pushpadanta)", deity_en: "Pushpadanta",
    quadrant: "West", startDeg: 247.5, centerDeg: 253.125, endDeg: 258.75, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — অটল ধনসম্পদ, সামাজিক মর্যাদা ও সর্বাঙ্গীন উন্নতি।",
    effects_en: "Golden Door: Unshakeable wealth, fame, societal acclaim, blessing of daughters.",
    effects_hi: "स्वर्णिम द्वार: स्थायी संपत्ति, समाज में ख्याति एवं सर्वतोमुखी उन्नति।",
    challenge_bn: "অহংকার পরিহার",
    remedy_bn: "দরজার ফ্রেমে রূপা বা স্টেইনলেস স্টিল ও সাদা মোটিফ দিন।",
  },
  {
    id: "W5", name: "W5", deity_bn: "বরুণ (Varuna)", deity_en: "Varuna",
    quadrant: "West", startDeg: 258.75, centerDeg: 264.375, endDeg: 270.0, isGoldenDoor: false,
    effects_bn: "অবাস্তব প্রত্যাশা, অতিরিক্ত আকাঙ্ক্ষার কারণে হতাশা ও নেশার ফাঁদ।",
    effects_en: "Unrealistic expectations, chronic disappointment, tendency to addiction.",
    effects_hi: "अवास्तविक अपेक्षाएं, गहरी निराशा एवं व्यसन की आशंका।",
    challenge_bn: "আকাঙ্ক্ষার অপূর্ণতা",
    remedy_bn: "দরজায় স্টেইনলেস স্টিল স্ট্রিপ এবং সাদা বাল্ব ব্যবহার করুন।",
  },
  {
    id: "W6", name: "W6", deity_bn: "অসুর (Asura)", deity_en: "Asura",
    quadrant: "West", startDeg: 270.0, centerDeg: 275.625, endDeg: 281.25, isGoldenDoor: false,
    effects_bn: "আইনি জটিলতা, ইনকাম ট্যাক্স নোটিস ও সরকারি দণ্ডাদেশের শঙ্কা।",
    effects_en: "Tax audits, bureaucratic penalties, unexpected government fines.",
    effects_hi: "आयकर नोटिस, कानूनी विवाद एवं राजकीय दंड की संभावना।",
    challenge_bn: "রাজদণ্ড",
    remedy_bn: "দরজার নিচে স্টেইনলেস স্টিল স্ট্রিপ ও শনিদেবের মন্ত্র জপ করুন।",
  },
  {
    id: "W7", name: "W7", deity_bn: "শোষ (Shesha)", deity_en: "Shesha",
    quadrant: "West", startDeg: 281.25, centerDeg: 286.875, endDeg: 292.5, isGoldenDoor: false,
    effects_bn: "শারীরিক ক্লান্তি, মানসিক অবসাদ ও জীবনীশক্তির ক্রমাগত ক্ষয়।",
    effects_en: "Physical fatigue, chronic exhaustion, loss of vital enthusiasm.",
    effects_hi: "शारीरिक शिथिलता, अवसाद और जीवन शक्ति का निरंतर क्षय।",
    challenge_bn: "হতাশা ও ক্লান্তি",
    remedy_bn: "দরজায় ক্রিম বা সাদা রঙ রাখুন এবং সৈন্ধব লবণ রাখুন।",
  },
  {
    id: "W8", name: "W8", deity_bn: "পাপযক্ষ্মা (Papadayakshma)", deity_en: "Papadayakshma",
    quadrant: "West", startDeg: 292.5, centerDeg: 298.125, endDeg: 303.75, isGoldenDoor: false,
    effects_bn: "অসৎ সঙ্গে জড়িয়ে পড়া, গোপন রোগ ও সমাজে অপ্রত্যাশিত কলঙ্ক।",
    effects_en: "Unethical entanglements, hidden diseases, sudden social stigma.",
    effects_hi: "बुरी संगत, गुप्त रोग एवं समाज में अप्रत्याशित कलंक का भय।",
    challenge_bn: "অসৎ প্রবৃত্তি",
    remedy_bn: "দরজার চৌকাঠে সাদা মার্বেল ও মেটাল স্ট্রিপ বসান।",
  },

  // North-West to North Quadrant
  {
    id: "N1", name: "N1", deity_bn: "রোগ (Roga)", deity_en: "Roga",
    quadrant: "North", startDeg: 303.75, centerDeg: 309.375, endDeg: 315.0, isGoldenDoor: false,
    effects_bn: "দীর্ঘস্থায়ী অসুস্থতা, শরীরে বল না থাকা ও অদৃশ্য শত্রুভীতি বৃদ্ধি।",
    effects_en: "Chronic sickness, persistent lethargy, unexplained fear of foes.",
    effects_hi: "दीर्घकालिक बीमारी, दुर्बलता एवं गुप्त शत्रुओं का भय।",
    challenge_bn: "অসুস্থতা ও দুর্বলতা",
    remedy_bn: "দরজায় রূপা বা অ্যালুমিনিয়াম স্ট্রিপ দিন এবং নীল রঙ পরিহার করুন।",
  },
  {
    id: "N2", name: "N2", deity_bn: "নাগ (Naga)", deity_en: "Naga",
    quadrant: "North", startDeg: 315.0, centerDeg: 320.625, endDeg: 326.25, isGoldenDoor: false,
    effects_bn: "অতিরিক্ত উদ্বেগ, প্রতিবেশীদের সাথে শত্রুতা ও মানসিক অস্থিরতা।",
    effects_en: "Extreme anxiety, hostility with neighbors, nervous instability.",
    effects_hi: "अत्यधिक घबराहट, पड़ोसियों से शत्रुता और मानसिक अस्थिरता।",
    challenge_bn: "মানসিক ক্লেশ",
    remedy_bn: "দরজায় অ্যালুমিনিয়াম স্ট্রিপ এবং সাদা আলো ব্যবহার করুন।",
  },
  {
    id: "N3", name: "N3", deity_bn: "মুখ্য (Mukhya)", deity_en: "Mukhya",
    quadrant: "North", startDeg: 326.25, centerDeg: 331.875, endDeg: 337.5, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — কুবেরের প্রত্যক্ষ কৃপা, বিপুল ধনলাভ, বাণিজ্যিক সমৃদ্ধি ও নতুন অর্থপ্রবাহ।",
    effects_en: "Golden Door: Lord Kuber's grace, tremendous financial abundance, new income streams.",
    effects_hi: "स्वर्णिम द्वार: कुबेर की कृपा, विपुल धनलाभ एवं नवीन अवसरों का आगमन।",
    challenge_bn: "সম্পদের সঠিক সদ্ব্যবহার",
    remedy_bn: "স্বর্ণদ্বারে কুবেরের শ্রীযন্ত্র ও হালকা সবুজ মানিপ্ল্যান্ট রাখুন।",
  },
  {
    id: "N4", name: "N4", deity_bn: "ভল্লাট (Bhallat)", deity_en: "Bhallat",
    quadrant: "North", startDeg: 337.5, centerDeg: 343.125, endDeg: 348.75, isGoldenDoor: true,
    effects_bn: "স্বর্ণদ্বার — পূর্বপুরুষের বিপুল সম্পত্তি লাভ, স্থায়ী ব্যাংকিং সঞ্চয় ও অক্ষয় ঐশ্বর্য।",
    effects_en: "Golden Door: Huge ancestral wealth, permanent savings, lifelong prosperity.",
    effects_hi: "स्वर्णिम द्वार: पैतृक संपत्ति का लाभ, स्थायी बचत एवं अक्षय ऐश्वर्य।",
    challenge_bn: "অহংকারহীন থাকা",
    remedy_bn: "প্রবেশদ্বারে খাঁটি পিতলের কলসি ও উত্তরমুখী কুবের রাখুন।",
  },
  {
    id: "N5", name: "N5", deity_bn: "সোম / কুবের (Soma)", deity_en: "Soma",
    quadrant: "North", startDeg: 348.75, centerDeg: 354.375, endDeg: 360.0, isGoldenDoor: false,
    effects_bn: "পারিবারিক মানসিক দূরত্ব, অতিরিক্ত ধর্মভাবাপন্নতা ও সাংসারিক দায়িত্বে অনীহা।",
    effects_en: "Emotional detachment, excessive reclusiveness, neglect of family duties.",
    effects_hi: "पारिवारिक दूरी, अत्यधिक वैराग्य एवं सांसारिक कार्यों में अरुचि।",
    challenge_bn: "আবেগীয় বিচ্ছিন্নতা",
    remedy_bn: "দরজার ফ্রেমে রূপার তার ও নীল রঙের আলো ব্যবহার করুন।",
  },
];

// ---------------------------------------------------------------------------
// 16 Directional Zones Definitions (22.5° each, Panchabhuta Elements)
// ---------------------------------------------------------------------------
export interface CompassZone {
  code: string;
  name_bn: string;
  name_en: string;
  name_hi: string;
  centerDeg: number;
  element: "Water" | "Air" | "Fire" | "Earth" | "Space";
  element_bn: string;
  element_en: string;
  colorHex: string;
  lifeAspect_bn: string;
  lifeAspect_en: string;
  organs_bn: string;
  organs_en: string;
  favorableItems: string[];
  unfavorableItems: string[];
  remedyMetal: string;
}

export const COMPASS_ZONES: CompassZone[] = [
  {
    code: "N", name_bn: "North (উত্তর / কুবের)", name_en: "North (Wealth & Growth)", name_hi: "उत्तर (कुबेर)",
    centerDeg: 0.0, element: "Water", element_bn: "জল তত্ত্ব (Water)", element_en: "Water",
    colorHex: "#0284C7",
    lifeAspect_bn: "নতুন সুযোগ, আয়ের পথ উন্মোচন ও কুবেরের অর্থকৃপা",
    lifeAspect_en: "New Career Opportunities, Wealth Inflow, Money",
    organs_bn: "কিডনি, মূত্রাশয় ও কান", organs_en: "Kidneys, Bladder, Ears",
    favorableItems: ["entrance", "underground_water", "locker", "living"],
    unfavorableItems: ["kitchen", "toilet", "overhead_tank", "dustbin"],
    remedyMetal: "অ্যালুমিনিয়াম / নীল স্ট্রিপ",
  },
  {
    code: "NNE", name_bn: "NNE (উত্তর-উত্তর-পূর্ব)", name_en: "NNE (Health & Immunity)", name_hi: "उत्तर-उत्तर-पूर्व (स्वास्थ्य)",
    centerDeg: 22.5, element: "Water", element_bn: "জল তত্ত্ব (Water)", element_en: "Water",
    colorHex: "#0EA5E9",
    lifeAspect_bn: "সুস্বাস্থ্য, নিরাময় ও শারীরিক রোগ প্রতিরোধ ক্ষমতা",
    lifeAspect_en: "Health, Vital Immunity, Rapid Healing",
    organs_bn: "ইমিউন সিস্টেম ও জীবনীশক্তি", organs_en: "Immune System, Vitality",
    favorableItems: ["puja_room", "medicine", "underground_water"],
    unfavorableItems: ["toilet", "kitchen", "dustbin"],
    remedyMetal: "অ্যালুমিনিয়াম স্ট্রিপ",
  },
  {
    code: "NE", name_bn: "NE (উত্তর-পূর্ব / ঈশান কোণ)", name_en: "NE (Divine Clarity & Wisdom)", name_hi: "ईशान (उत्तर-पूर्व)",
    centerDeg: 45.0, element: "Water", element_bn: "জল ও আকাশ তত্ত্ব (Water/Ether)", element_en: "Water / Ether",
    colorHex: "#38BDF8",
    lifeAspect_bn: "মানসিক স্পষ্টতা, আত্মিক প্রজ্ঞা, পরম শান্তি ও ঈশ্বর কৃপা",
    lifeAspect_en: "Mental Clarity, Wisdom, Divine Connection",
    organs_bn: "মস্তিষ্ক, স্নায়ুতন্ত্র ও চোখ", organs_en: "Brain, Nervous System, Eyes",
    favorableItems: ["puja_room", "study", "underground_water"],
    unfavorableItems: ["toilet", "kitchen", "master_bed", "overhead_tank", "staircase", "dustbin"],
    remedyMetal: "রূপা / অ্যালুমিনিয়াম স্ট্রিপ (বা পিরামিড)",
  },
  {
    code: "ENE", name_bn: "ENE (পূর্ব-উত্তর-পূর্ব)", name_en: "ENE (Joy & Recreation)", name_hi: "पूर्व-उत्तर-पूर्व (आनंद)",
    centerDeg: 67.5, element: "Air", element_bn: "বায়ু / কাঠ তত্ত্ব (Air/Wood)", element_en: "Air / Wood",
    colorHex: "#10B981",
    lifeAspect_bn: "আনন্দ, চিত্তবিনোদন, পারিবারিক প্রশান্তি ও প্রফুল্লতা",
    lifeAspect_en: "Fun, Joy, Recreation, Mental Refreshment",
    organs_bn: "লিভার ও কাঁধ", organs_en: "Liver, Shoulders",
    favorableItems: ["living", "entrance", "study"],
    unfavorableItems: ["toilet", "overhead_tank"],
    remedyMetal: "স্টেইনলেস স্টিল / সবুজ মার্বেল",
  },
  {
    code: "E", name_bn: "East (পূর্ব / সূর্য স্থান)", name_en: "East (Social Connectivity)", name_hi: "पूर्व (सूर्य)",
    centerDeg: 90.0, element: "Air", element_bn: "বায়ু / কাঠ তত্ত্ব (Air/Wood)", element_en: "Air / Wood",
    colorHex: "#059669",
    lifeAspect_bn: "সামাজিক সংযোগ, প্রভাবশালী ব্যক্তিদের সাথে সম্পর্ক ও সরকারি কাজ",
    lifeAspect_en: "Social Connections, Networking, Government Ties",
    organs_bn: "লিভার ও গলব্লাডার", organs_en: "Liver, Gallbladder",
    favorableItems: ["entrance", "living", "puja_room", "study"],
    unfavorableItems: ["toilet", "kitchen", "overhead_tank"],
    remedyMetal: "তামা / কপার স্ট্রিপ",
  },
  {
    code: "ESE", name_bn: "ESE (পূর্ব-দক্ষিণ-পূর্ব)", name_en: "ESE (Analysis & Churning)", name_hi: "पूर्व-दक्षिण-पूर्व (मंथन)",
    centerDeg: 112.5, element: "Air", element_bn: "বায়ু / কাঠ তত্ত্ব (Air/Wood)", element_en: "Air / Wood",
    colorHex: "#34D399",
    lifeAspect_bn: "গভীর চিন্তাভাবনা, বিশ্লেষণ, মন্থন ও দ্বিধাদ্বন্দ্ব মুক্তি",
    lifeAspect_en: "Analytical Thinking, Churning, Decisiveness",
    organs_bn: "অগ্ন্যাশয় ও পরিপাকতন্ত্র", organs_en: "Pancreas, Digestive Organs",
    favorableItems: ["toilet", "washing_machine"],
    unfavorableItems: ["master_bed", "puja_room", "entrance"],
    remedyMetal: "স্টেইনলেস স্টিল স্ট্রিপ",
  },
  {
    code: "SE", name_bn: "SE (দক্ষিণ-পূর্ব / অগ্নিকোণ)", name_en: "SE (Liquid Cash & Fire)", name_hi: "आग्नेय (दक्षिण-पूर्व)",
    centerDeg: 135.0, element: "Fire", element_bn: "অগ্নি তত্ত্ব (Fire)", element_en: "Fire",
    colorHex: "#EF4444",
    lifeAspect_bn: "নগদ তরল অর্থপ্রবাহ (Cash Flow), উদ্দীপনা, তেজ ও বিলাসিতা",
    lifeAspect_en: "Liquid Cash Flow, Vital Heat, Power, Zeal",
    organs_bn: "জরায়ু ও রক্ত সঞ্চালন", organs_en: "Uterus, Blood Circulation",
    favorableItems: ["kitchen", "electrical"],
    unfavorableItems: ["underground_water", "toilet", "puja_room", "master_bed"],
    remedyMetal: "খাঁটি তামার স্ট্রিপ (Copper Strip)",
  },
  {
    code: "SSE", name_bn: "SSE (দক্ষিণ-দক্ষিণ-পূর্ব)", name_en: "SSE (Confidence & Strength)", name_hi: "दक्षिण-दक्षिण-पूर्व (शक्ति)",
    centerDeg: 157.5, element: "Fire", element_bn: "অগ্নি তত্ত্ব (Fire)", element_en: "Fire",
    colorHex: "#F87171",
    lifeAspect_bn: "দৃঢ় আত্মবিশ্বাস, শারীরিক ক্ষমতা, সাহস ও অটুট মনোবল",
    lifeAspect_en: "Physical Power, Confidence, Unwavering Will",
    organs_bn: "পেশী ও শারীরিক সহনশীলতা", organs_en: "Muscles, Physical Stamina",
    favorableItems: ["kitchen", "gym", "entrance"],
    unfavorableItems: ["toilet", "water"],
    remedyMetal: "তামার স্ট্রিপ (Copper Strip)",
  },
  {
    code: "S", name_bn: "South (দক্ষিণ / যম স্থান)", name_en: "South (Fame & Relaxation)", name_hi: "दक्षिण (यश)",
    centerDeg: 180.0, element: "Fire", element_bn: "অগ্নি তত্ত্ব (Fire)", element_en: "Fire",
    colorHex: "#DC2626",
    lifeAspect_bn: "খ্যাতি, নাম, সামাজিক সুনাম ও সুনিদ্রা",
    lifeAspect_en: "Fame, Social Recognition, Peaceful Sleep",
    organs_bn: "হৃদপিণ্ড ও ধমনী", organs_en: "Heart, Arteries",
    favorableItems: ["master_bed", "staircase", "entrance"],
    unfavorableItems: ["water", "underground_water", "toilet"],
    remedyMetal: "তামার স্ট্রিপ (Copper Strip)",
  },
  {
    code: "SSW", name_bn: "SSW (দক্ষিণ-দক্ষিণ-পশ্চিম)", name_en: "SSW (Disposal Zone)", name_hi: "दक्षिण-दक्षिण-पश्चिम (विसर्जन)",
    centerDeg: 202.5, element: "Earth", element_bn: "পৃথিবী তত্ত্ব (Earth)", element_en: "Earth",
    colorHex: "#D97706",
    lifeAspect_bn: "বিসর্জন জোন — অবাঞ্ছিত বর্জ্য, বিষাদ ও নেতিবাচকতা অপসারণ",
    lifeAspect_en: "Disposal of Waste, Toxicity & Negative Thoughts",
    organs_bn: "রেচনতন্ত্র ও বর্জ্য নিষ্কাশন", organs_en: "Excretory System",
    favorableItems: ["toilet", "dustbin", "drainage"],
    unfavorableItems: ["master_bed", "puja_room", "study", "locker", "entrance"],
    remedyMetal: "পিতলের স্ট্রিপ (Brass Strip)",
  },
  {
    code: "SW", name_bn: "SW (দক্ষিণ-পশ্চিম / নৈঋত কোণ)", name_en: "SW (Relationships & Skills)", name_hi: "नैऋत्य (दक्षिण-पश्चिम)",
    centerDeg: 225.0, element: "Earth", element_bn: "পৃথিবী তত্ত্ব (Earth)", element_en: "Earth",
    colorHex: "#B45309",
    lifeAspect_bn: "দাম্পত্য সম্পর্ক, গৃহকর্তার স্থায়িত্ব, কর্মদক্ষতা ও পিতৃ কৃপা",
    lifeAspect_en: "Relationships, Skills Mastery, Grounded Stability",
    organs_bn: "প্রজনন অঙ্গ, পা ও সন্ধি", organs_en: "Reproductive, Legs, Joints",
    favorableItems: ["master_bed", "staircase", "heavy_storage", "overhead_tank"],
    unfavorableItems: ["toilet", "kitchen", "underground_water", "puja_room", "entrance"],
    remedyMetal: "খাঁটি পিতলের স্ট্রিপ (Brass Strip)",
  },
  {
    code: "WSW", name_bn: "WSW (পশ্চিম-দক্ষিণ-পশ্চিম)", name_en: "WSW (Knowledge & Studies)", name_hi: "पश्चिम-दक्षिण-पश्चिम (विद्या)",
    centerDeg: 247.5, element: "Space", element_bn: "আকাশ / ধাতু তত্ত্ব (Space/Metal)", element_en: "Space / Metal",
    colorHex: "#94A3B8",
    lifeAspect_bn: "বিদ্যাচর্চা, পরীক্ষায় সাফল্য, জ্ঞান সংরক্ষণ ও সঞ্চয়",
    lifeAspect_en: "Knowledge Retention, Academics, Consistent Savings",
    organs_bn: "কণ্ঠনালী ও স্বরযন্ত্র", organs_en: "Throat, Vocal Cords",
    favorableItems: ["study", "books", "locker"],
    unfavorableItems: ["toilet", "kitchen"],
    remedyMetal: "স্টেইনলেস স্টিল / পিতল স্ট্রিপ",
  },
  {
    code: "W", name_bn: "West (পশ্চিম / বরুণ স্থান)", name_en: "West (Gains & Profits)", name_hi: "पश्चिम (लाभ)",
    centerDeg: 270.0, element: "Space", element_bn: "আকাশ / ধাতু তত্ত্ব (Space/Metal)", element_en: "Space / Metal",
    colorHex: "#64748B",
    lifeAspect_bn: "ব্যবসায়িক মুনাফা, আর্থিক লাভ, বৈষয়িক প্রাপ্তি ও মনোবাঞ্ছা পূরণ",
    lifeAspect_en: "Business Profits, Manifestation of Desires, Gains",
    organs_bn: "ফুসফুস ও শ্বাসতন্ত্র", organs_en: "Lungs, Respiration",
    favorableItems: ["dining", "overhead_tank", "locker", "entrance"],
    unfavorableItems: ["kitchen", "plants"],
    remedyMetal: "স্টেইনলেস স্টিল স্ট্রিপ",
  },
  {
    code: "WNW", name_bn: "WNW (পশ্চিম-উত্তর-পশ্চিম)", name_en: "WNW (Depression Detox)", name_hi: "पश्चिम-उत्तर-पश्चिम (डिटॉक्स)",
    centerDeg: 292.5, element: "Space", element_bn: "আকাশ / ধাতু তত্ত্ব (Space/Metal)", element_en: "Space / Metal",
    colorHex: "#CBD5E1",
    lifeAspect_bn: "মানসিক বিষাদমুক্তি, দুঃখ ক্ষরণ ও ডিটক্সিফিকেশন",
    lifeAspect_en: "Emotional Detoxification, Depression Relief",
    organs_bn: "থাইরয়েড ও অনাল গ্রন্থি", organs_en: "Thyroid, Endocrine Glands",
    favorableItems: ["toilet", "washing_machine"],
    unfavorableItems: ["master_bed", "puja_room"],
    remedyMetal: "স্টেইনলেস স্টিল / অ্যালুমিনিয়াম স্ট্রিপ",
  },
  {
    code: "NW", name_bn: "NW (উত্তর-পশ্চিম / বায়ুকোণ)", name_en: "NW (Support & Banking)", name_hi: "वायव्य (उत्तर-पश्चिम)",
    centerDeg: 315.0, element: "Space", element_bn: "আকাশ / ধাতু তত্ত্ব (Space/Metal)", element_en: "Space / Metal",
    colorHex: "#94A3B8",
    lifeAspect_bn: "সহায়তাকারী শুভাকাঙ্ক্ষী, ব্যাংকিং সাপোর্ট ও সরকারি সাহায্য",
    lifeAspect_en: "Supportive Friends, Banking Relations, Assistance",
    organs_bn: "হাত ও কাঁধ", organs_en: "Hands, Shoulders",
    favorableItems: ["guest_bed", "storage", "living"],
    unfavorableItems: ["kitchen", "heavy_safe"],
    remedyMetal: "অ্যালুমিনিয়াম স্ট্রিপ",
  },
  {
    code: "NNW", name_bn: "NNW (উত্তর-উত্তর-পশ্চিম)", name_en: "NNW (Attraction & Bonding)", name_hi: "उत्तर-उत्तर-पश्चिम (आकर्षण)",
    centerDeg: 337.5, element: "Water", element_bn: "জল তত্ত্ব (Water)", element_en: "Water",
    colorHex: "#38BDF8",
    lifeAspect_bn: "পারস্পরিক আকর্ষণ, দাম্পত্য ঘনিষ্ঠতা ও যৌনসুখ",
    lifeAspect_en: "Sex, Mutual Attraction, Marital Intimacy",
    organs_bn: "যৌনাঙ্গ ও হরমোন ব্যালান্স", organs_en: "Reproductive System, Hormones",
    favorableItems: ["newlywed_bed", "dressing_room", "entrance"],
    unfavorableItems: ["toilet", "kitchen", "dustbin"],
    remedyMetal: "অ্যালুমিনিয়াম বা রূপার স্ট্রিপ",
  },
];

// Items user can inspect
export interface InspectItem {
  id: string;
  icon: string;
  title_bn: string;
  title_en: string;
  title_hi: string;
  category: "entrance" | "toilet" | "kitchen" | "master_bed" | "puja_room" | "locker" | "underground_water" | "overhead_tank" | "staircase" | "study" | "living" | "dustbin";
}

export const INSPECT_ITEMS: InspectItem[] = [
  { id: "entrance", icon: "🚪", title_bn: "মূল প্রবেশদ্বার (Main Entrance)", title_en: "Main Entrance", title_hi: "मुख्य द्वार", category: "entrance" },
  { id: "toilet", icon: "🚽", title_bn: "টয়লেট / কমোড (Toilet)", title_en: "Toilet / Commode", title_hi: "शौचालय", category: "toilet" },
  { id: "kitchen", icon: "🍳", title_bn: "রান্নাঘর / গ্যাসের চুলা (Kitchen)", title_en: "Kitchen / Stove", title_hi: "रसोई घर", category: "kitchen" },
  { id: "master_bed", icon: "🛏️", title_bn: "মাস্টার বেডরুম (Master Bed)", title_en: "Master Bedroom", title_hi: "मास्टर बेडरूम", category: "master_bed" },
  { id: "puja_room", icon: "🪔", title_bn: "পূজা ঘর / মন্দির (Puja Room)", title_en: "Puja Room / Temple", title_hi: "पूजा घर / मंदिर", category: "puja_room" },
  { id: "locker", icon: "💰", title_bn: "টাকার সিন্দুক (Cash Locker)", title_en: "Cash Locker / Safe", title_hi: "तिजोरी / लॉकर", category: "locker" },
  { id: "underground_water", icon: "💧", title_bn: "আন্ডারগ্রাউন্ড ট্যাঙ্ক (Borewell)", title_en: "Underground Borewell", title_hi: "भूमिगत जल स्रोत", category: "underground_water" },
  { id: "overhead_tank", icon: "🚰", title_bn: "ওভারহেড জলের ট্যাঙ্ক (Tank)", title_en: "Overhead Water Tank", title_hi: "छत की पानी टंकी", category: "overhead_tank" },
  { id: "staircase", icon: "🪜", title_bn: "সিঁড়ি (Staircase)", title_en: "Staircase", title_hi: "सीढ़ियाँ", category: "staircase" },
  { id: "study", icon: "📚", title_bn: "পড়ার টেবিল (Study Desk)", title_en: "Study Room / Desk", title_hi: "अध्ययन कक्ष", category: "study" },
  { id: "living", icon: "🛋️", title_bn: "ড্রয়িং রুম (Living Room)", title_en: "Living / Drawing Room", title_hi: "ड्राइंग रूम", category: "living" },
  { id: "dustbin", icon: "🗑️", title_bn: "ডাস্টবিন / আবর্জনা (Dustbin)", title_en: "Dustbin / Trash", title_hi: "कूड़ेदान", category: "dustbin" },
];

export interface VastuCompassProps {
  language?: AstrologyLanguage;
  onAngleSelect?: (degree: number) => void;
}

export function VastuCompass({ language = "bn", onAngleSelect }: VastuCompassProps) {
  // Current compass heading (0.0° - 359.9°)
  const [heading, setHeading] = React.useState<number>(0.0);
  const [selectedItemId, setSelectedItemId] = React.useState<string>("entrance");
  const [isSensorActive, setIsSensorActive] = React.useState<boolean>(false);
  const [rotateMode, setRotateMode] = React.useState<"dial" | "needle">("dial");

  const compassRef = React.useRef<SVGSVGElement | null>(null);
  const isDragging = React.useRef<boolean>(false);
  const targetHeadingRef = React.useRef<number>(0.0);
  const animFrameRef = React.useRef<number | null>(null);

  // Find current Pada based on heading
  const currentPada = React.useMemo<CompassPada>(() => {
    const deg = (heading % 360 + 360) % 360;
    for (const p of COMPASS_PADAS) {
      if (p.startDeg > p.endDeg) {
        if (deg >= p.startDeg || deg < p.endDeg) return p;
      } else {
        if (deg >= p.startDeg && deg < p.endDeg) return p;
      }
    }
    return COMPASS_PADAS[0];
  }, [heading]);

  // Find current 16-Zone based on heading
  const currentZone = React.useMemo<CompassZone>(() => {
    const deg = (heading % 360 + 360) % 360;
    for (const z of COMPASS_ZONES) {
      const start = (z.centerDeg - 11.25 + 360) % 360;
      const end = (z.centerDeg + 11.25) % 360;
      if (start > end) {
        if (deg >= start || deg < end) return z;
      } else {
        if (deg >= start && deg < end) return z;
      }
    }
    return COMPASS_ZONES[0];
  }, [heading]);

  // Dynamic evaluation of selected item at current heading
  const itemEvaluation = React.useMemo(() => {
    const sel = INSPECT_ITEMS.find((i) => i.id === selectedItemId) || INSPECT_ITEMS[0];
    const cat = sel.category;
    const zoneCode = currentZone.code;

    // 1. Entrance Evaluation (32 Padas)
    if (cat === "entrance") {
      if (currentPada.isGoldenDoor) {
        return {
          rating: "Golden" as const,
          score: 100,
          badge_bn: "✅ অত্যন্ত শুভ স্বর্ণদ্বার (Auspicious Golden Door)",
          badge_en: "Auspicious Golden Door (100% Auspicious)",
          badge_hi: "अति शुभ स्वर्णिम द्वार (100% शुभ)",
          colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
          iconType: "check",
          title_bn: `পদ ${currentPada.id} — ${currentPada.deity_bn} (স্বর্ণদ্বার)`,
          desc_bn: currentPada.effects_bn,
          remedy_bn: currentPada.remedy_bn,
          metalStrip: null,
        };
      } else {
        return {
          rating: "Challenge" as const,
          score: 25,
          badge_bn: "⚠️ প্রতিকূল প্রবেশদ্বার (Challenge Door)",
          badge_en: "Challenging Entrance (Remedy Required)",
          badge_hi: "प्रतिकूल प्रवेश द्वार (उपाय आवश्यक)",
          colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
          iconType: "warn",
          title_bn: `পদ ${currentPada.id} — ${currentPada.deity_bn} (চ্যালেঞ্জ)`,
          desc_bn: currentPada.effects_bn,
          remedy_bn: currentPada.remedy_bn,
          metalStrip: "চৌকাঠে পিতল বা রূপার তারের ফ্রেম সিল করুন।",
        };
      }
    }

    // 2. Toilet Evaluation
    if (cat === "toilet") {
      if (["SSW", "WNW", "ESE"].includes(zoneCode)) {
        return {
          rating: "Excellent" as const,
          score: 100,
          badge_bn: "✅ আদর্শ বিসর্জন অবস্থান (Ideal Disposal Zone)",
          badge_en: "Perfect Vastu Zone for Toilet (100% Favorable)",
          badge_hi: "शौचालय हेतु सर्वोत्तम विसर्जन क्षेत्र",
          colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
          iconType: "check",
          title_bn: `${currentZone.name_bn} — নির্ভার বিসর্জন`,
          desc_bn: "ঘরের সমস্ত নেতিবাচক শক্তি, ক্লান্তি ও বিষাদ কোনো বাধা ছাড়া স্বাভাবিকভাবে নিষ্কাশিত হয়।",
          remedy_bn: "টয়লেটের ঢাকনা সর্বদা বন্ধ রাখুন এবং পরিচ্ছন্নতা বজায় রাখুন।",
          metalStrip: null,
        };
      } else if (["NE", "SW", "N"].includes(zoneCode)) {
        return {
          rating: "Critical" as const,
          score: 0,
          badge_bn: "🚨 মারাত্মক ক্ষতিকর বাস্তু দোষ (Critical Vastu Flaw)",
          badge_en: "Critical Vastu Flaw: Severe Bio-Energy Damage",
          badge_hi: "अत्यंत गंभीर वास्तु दोष (तत्काल निवारण आवश्यक)",
          colorClass: "text-red-700 dark:text-red-300 bg-red-500/10 border-red-500/30",
          iconType: "alert",
          title_bn: `${currentZone.name_bn} জোনে টয়লেট`,
          desc_bn:
            zoneCode === "NE"
              ? "ঈশান কোণে টয়লেট সরাসরি মস্তিষ্ক, স্নায়ুতন্ত্র, স্মৃতিশক্তি ও পরিবারের আর্থিক অগ্রগতি ধ্বংস করে।"
              : zoneCode === "SW"
              ? "নৈঋত কোণে টয়লেট দাম্পত্য সম্পর্ক, পিতৃকৃপা ও পরিবারের পারস্পরিক বন্ধনকে বিনষ্ট করে।"
              : "উত্তর কুবের জোনে টয়লেট উপার্জনের নতুন সুযোগ ও অর্থের প্রবাহ নর্দমায় ফেলে দেয়।",
          remedy_bn:
            zoneCode === "NE"
              ? "ভাঙচুর ছাড়া প্রতিকার: কমোডের চারপাশের মেঝেতে ৩-৪ মিমি চওড়া অ্যালুমিনিয়াম স্ট্রিপ বসিয়ে এনার্জি কাট অফ করুন। কাচের বাটিতে সৈন্ধব লবণ রাখুন।"
              : zoneCode === "SW"
              ? "কমোডের চারপাশে ৩ মিমি খাঁটি পিতলের স্ট্রিপ (Brass Strip) ফ্লোরিংয়ে পেস্ট বা গ্রুভ করে সিল করে দিন।"
              : "নীল রঙের ট্যাপ বা অ্যালুমিনিয়াম স্ট্রিপ দিয়ে কমোডের চারপাশ আবদ্ধ করুন।",
          metalStrip: zoneCode === "SW" ? "পিতলের স্ট্রিপ (Brass Strip)" : "অ্যালুমিনিয়াম স্ট্রিপ (Aluminum Strip)",
        };
      } else {
        return {
          rating: "Moderate" as const,
          score: 40,
          badge_bn: "⚠️ অনাকাঙ্ক্ষিত অবস্থান (Requires Elemental Neutralization)",
          badge_en: "Sub-Optimal Placement (Requires Strip Blocking)",
          badge_hi: "मध्यम दोष (धातु पट्टी उपचार आवश्यक)",
          colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
          iconType: "warn",
          title_bn: `${currentZone.name_bn} জোনে টয়লেট`,
          desc_bn: "এই জোনের স্বাভাবিক শক্তির বিচ্যুতি ঘটতে পারে। মেটাল স্ট্রিপ ব্লকিং দ্বারা নিরাময় সম্ভব।",
          remedy_bn: `কমোডের চারপাশে ${currentZone.remedyMetal} ফ্লোরিংয়ে বসিয়ে এনার্জি কাট অফ করুন।`,
          metalStrip: currentZone.remedyMetal,
        };
      }
    }

    // 3. Kitchen Evaluation
    if (cat === "kitchen") {
      if (["SE", "SSE"].includes(zoneCode)) {
        return {
          rating: "Excellent" as const,
          score: 100,
          badge_bn: "✅ আদর্শ অগ্নিকোণ (Perfect Fire Element Placement)",
          badge_en: "Ideal Fire Zone (100% Auspicious)",
          badge_hi: "सर्वोत्तम आग्नेय कोण (अति शुभ)",
          colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
          iconType: "check",
          title_bn: `${currentZone.name_bn} — নিখুঁত অগ্নিকোণ`,
          desc_bn: "অগ্নি তত্ত্বের সঠিক অবস্থান — নগদ অর্থের অবিরাম প্রবাহ, গৃহকর্ত্রীর সুস্বাস্থ্য ও পরিবারের তেজস্বী উন্নতি।",
          remedy_bn: "রান্নাঘরে লাল বা ক্রিম রঙের শেড রাখুন, কোনো নীল রঙ রাখবেন না।",
          metalStrip: null,
        };
      } else if (["NE", "SW", "N"].includes(zoneCode)) {
        return {
          rating: "Critical" as const,
          score: 0,
          badge_bn: "🚨 মারাত্মক অগ্নি-জল সংঘাত (Critical Elemental Clash)",
          badge_en: "Critical Clash: Fire vs Water/Earth",
          badge_hi: "गंभीर तत्व संघर्ष (अग्नि-जल दोष)",
          colorClass: "text-red-700 dark:text-red-300 bg-red-500/10 border-red-500/30",
          iconType: "alert",
          title_bn: `${currentZone.name_bn} জোনে রান্নাঘর`,
          desc_bn:
            zoneCode === "NE"
              ? "ঈশানে রান্নাঘর মানে অগ্নিতত্ত্বের দ্বারা দেবস্থানের দহন — মানসিক উত্তেজনা, মাথার রোগ ও আকস্মিক আর্থিক ক্ষয়।"
              : zoneCode === "SW"
              ? "নৈঋতে রান্নাঘর অগ্নি ও পৃথিবী তত্ত্বের সংঘর্ষ ঘটায় — তীব্র দাম্পত্য কলহ ও সম্পর্কের বিচ্ছেদ।"
              : "উত্তরে রান্নাঘর জলের স্থানে আগুন — আয়ের পথ রুদ্ধ হওয়া ও ক্যারিয়ারে স্থবিরতা।",
          remedy_bn:
            zoneCode === "NE"
              ? "কোনো ভাঙচুর ছাড়া সমাধান: গ্যাসের চুলার নিচে একটি সবুজ বরোদা মার্বেল (Green Baroda Marble) স্থাপন করুন।"
              : zoneCode === "SW"
              ? "চুলার নিচে একটি হলুদ জাইসলমের পাথর (Yellow Jaisalmer Stone) স্থাপন করুন।"
              : "চুলার নিচে সবুজ মার্বেল স্ল্যাব রাখুন ও তামার তারের ফ্রেম দিন।",
          metalStrip: "কপার স্ট্রিপ (Copper Strip)",
        };
      } else {
        return {
          rating: "Moderate" as const,
          score: 55,
          badge_bn: "⚠️ মধ্যম অবস্থান (Manageable with Slab Remedy)",
          badge_en: "Neutral / Manageable with Marble Slab",
          badge_hi: "मध्यम प्रभाव (स्लैब उपाय संभव)",
          colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
          iconType: "warn",
          title_bn: `${currentZone.name_bn} জোনে রান্নাঘর`,
          desc_bn: "আগুনের তাপ এই জোনের স্বাভাবিক এনার্জিকে কিছুটা উত্তপ্ত করে। সঠিক পাথরের স্ল্যাব দিয়ে শোধন করুন।",
          remedy_bn: "গ্যাসের চুলার নিচে জোনের রঙ অনুযায়ী মার্বেল স্ল্যাব স্থাপন করুন।",
          metalStrip: null,
        };
      }
    }

    // 4. Master Bedroom Evaluation
    if (cat === "master_bed") {
      if (["SW", "S", "W"].includes(zoneCode)) {
        return {
          rating: "Excellent" as const,
          score: 100,
          badge_bn: "✅ আদর্শ নৈঋত ও পশ্চিম অবস্থান (Solid Stability)",
          badge_en: "Ideal Master Bedroom (Authority & Sound Sleep)",
          badge_hi: "सर्वोत्तम शयनकक्ष (स्थिरता एवं दांपत्य सुख)",
          colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
          iconType: "check",
          title_bn: `${currentZone.name_bn} — কর্তৃত্ব ও স্থায়িত্ব`,
          desc_bn: "গৃহকর্তার অটুট কর্তৃত্ব, মানসিক ভারসাম্য, পারিবারিক স্থিরতা ও চমৎকার দাম্পত্য বন্ধন।",
          remedy_bn: "মাথা সর্বদা দক্ষিণ বা পূর্ব দিকে রেখে ঘুমানোর ব্যবস্থা করুন।",
          metalStrip: null,
        };
      } else if (["NE", "SSW", "ESE"].includes(zoneCode)) {
        return {
          rating: "Critical" as const,
          score: 15,
          badge_bn: "🚨 প্রতিকূল শয়নকক্ষ (Brain Strain or Vitality Drain)",
          badge_en: "Adverse Bedroom Zone: High Mental Stress",
          badge_hi: "प्रतिकूल शयनकक्ष (तनाव एवं अशांति)",
          colorClass: "text-red-700 dark:text-red-300 bg-red-500/10 border-red-500/30",
          iconType: "alert",
          title_bn: `${currentZone.name_bn} জোনে মাস্টার বেড`,
          desc_bn:
            zoneCode === "NE"
              ? "ঈশানে ঘুমালে অতিরিক্ত মানসিক চাপ, অনিদ্রা ও বৈরাগ্য সৃষ্টি হয়।"
              : zoneCode === "SSW"
              ? "বিসর্জন জোনে ঘুমালে শরীর সর্বদা ক্লান্ত থাকে, জীবনীশক্তি ক্ষয় পায়।"
              : "তুচ্ছ বিষয় নিয়ে স্বামী-স্ত্রীর মধ্যে অন্তহীন মন্থন ও বাদানুবাদ লেগে থাকে।",
          remedy_bn: "খাটের নিচে কাচের বাটিতে সৈন্ধব লবণ রাখুন ও হালকা পেস্টাল ক্রিম রঙের চাদর ব্যবহার করুন।",
          metalStrip: "পিতল স্ট্রিপ (Brass Strip)",
        };
      } else {
        return {
          rating: "Moderate" as const,
          score: 65,
          badge_bn: "⚠️ গ্রহণযোগ্য অবস্থান (Acceptable)",
          badge_en: "Acceptable Bedroom Placement",
          badge_hi: "स्वीकार्य शयनकक्ष स्थिति",
          colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
          iconType: "warn",
          title_bn: `${currentZone.name_bn} জোনে বেডরুম`,
          desc_bn: "স্বাভাবিক ঘুম হয়। খাটের মাথা দক্ষিণ বা পূর্বমুখী রাখুন।",
          remedy_bn: "ঘরে কোনো আয়না যেন শোবার সময় শরীরের প্রতিফলন না ঘটায়।",
          metalStrip: null,
        };
      }
    }

    // 5. Puja Room Evaluation
    if (cat === "puja_room") {
      if (["NE", "E", "N", "ENE"].includes(zoneCode)) {
        return {
          rating: "Excellent" as const,
          score: 100,
          badge_bn: "✅ পরম ঈশ্বর স্থান (Divine Spiritual Sanctuary)",
          badge_en: "Ideal Divine Sanctuary (100% Auspicious)",
          badge_hi: "परम पावन देव स्थान (अति शुभ)",
          colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
          iconType: "check",
          title_bn: `${currentZone.name_bn} — দিব্য ঈশ্বর সংযোগ`,
          desc_bn: "ঈশান কোণে পরম ঈশ্বরের কৃপা — অন্তহীন আত্মিক শান্তি, শুদ্ধ মনন ও পরিবারের সকল বিপদমুক্তি।",
          remedy_bn: "মন্দিরে পিতল বা রূপার প্রদীপ জ্বালান এবং স্নিগ্ধ সাদা আলো রাখুন।",
          metalStrip: null,
        };
      } else if (["SSW", "S", "SW"].includes(zoneCode)) {
        return {
          rating: "Critical" as const,
          score: 0,
          badge_bn: "🚨 চরম বাস্তু সংঘাত (Divine Energy Drain / Conflict)",
          badge_en: "Severe Conflict: Prayers Drained / Ancestral Clash",
          badge_hi: "गंभीर वास्तु दोष (प्रार्थना का फल नहीं मिलता)",
          colorClass: "text-red-700 dark:text-red-300 bg-red-500/10 border-red-500/30",
          iconType: "alert",
          title_bn: `${currentZone.name_bn} জোনে মন্দির`,
          desc_bn: "বিসর্জন বা নৈঋতে মন্দির থাকলে পূজার সমস্ত শুভ ফল বিনষ্ট হয় এবং বংশবৃদ্ধিতে বাধা আসে।",
          remedy_bn: "মন্দির অবিলম্বে ঈশান বা পূর্ব দিকে স্থানান্তর করুন। অথবা রূপার ওম প্রতীক ঈশানে রাখুন।",
          metalStrip: null,
        };
      } else {
        return {
          rating: "Moderate" as const,
          score: 60,
          badge_bn: "⚠️ মধ্যম অবস্থান",
          badge_en: "Moderate Placement",
          badge_hi: "सामान्य स्थिति",
          colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
          iconType: "warn",
          title_bn: `${currentZone.name_bn} জোনে পূজা ঘর`,
          desc_bn: "পূজার আসন পূর্বমুখী বা উত্তরমুখী করে বসুন।",
          remedy_bn: "মৃত পূর্বপুরুষের ছবি ঠাকুর ঘরে রাখবেন না।",
          metalStrip: null,
        };
      }
    }

    // Default for other items
    const isFavorable = currentZone.favorableItems.includes(cat);
    const isUnfavorable = currentZone.unfavorableItems.includes(cat);

    if (isFavorable) {
      return {
        rating: "Excellent" as const,
        score: 95,
        badge_bn: "✅ অনুকূল অবস্থান (Favorable Vastu Zone)",
        badge_en: "Favorable Vastu Zone for this item",
        badge_hi: "अनुकूल वास्तु स्थिति",
        colorClass: "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
        iconType: "check",
        title_bn: `${currentZone.name_bn} — অনুকূল এনার্জি`,
        desc_bn: `এই জোনের মূল গুণাবলী (${currentZone.lifeAspect_bn}) এই সামগ্রীর সাথে সামঞ্জস্যপূর্ণ।`,
        remedy_bn: "পরিচ্ছন্ন রাখুন এবং জোনের রঙ অনুসরণ করুন।",
        metalStrip: null,
      };
    } else if (isUnfavorable) {
      return {
        rating: "Critical" as const,
        score: 10,
        badge_bn: "🚨 প্রতিকূল অবস্থান (Vastu Energy Clash)",
        badge_en: "Vastu Energy Conflict Identified",
        badge_hi: "प्रतिकूल वास्तु स्थिति",
        colorClass: "text-red-700 dark:text-red-300 bg-red-500/10 border-red-500/30",
        iconType: "alert",
        title_bn: `${currentZone.name_bn} জোনে প্রতিকূল প্রভাব`,
        desc_bn: `এই সামগ্রীটির জন্য এই জোন অনুচিত। ${currentZone.lifeAspect_bn} ব্যাহত হতে পারে।`,
        remedy_bn: `প্রতিকার: ${currentZone.remedyMetal} ব্যবহার করে এনার্জি ব্যালান্স করুন।`,
        metalStrip: currentZone.remedyMetal,
      };
    } else {
      return {
        rating: "Moderate" as const,
        score: 65,
        badge_bn: "⚠️ সাধারণ / স্বাভাবিক অবস্থান (Neutral)",
        badge_en: "Neutral / Balanced Placement",
        badge_hi: "सामान्य स्थिति",
        colorClass: "text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/30",
        iconType: "warn",
        title_bn: `${currentZone.name_bn} — সাধারণ প্রভাব`,
        desc_bn: "কোনো তীব্র বাস্তু দোষ নেই। নিয়মিত পরিষ্কার-পরিচ্ছন্নতা বজায় রাখুন।",
        remedy_bn: "প্রয়োজনে সংশ্লিষ্ট জোনের শুভ রঙ ব্যবহার করুন।",
        metalStrip: null,
      };
    }
  }, [selectedItemId, currentPada, currentZone]);

  // Smooth animation loop for heading updates
  React.useEffect(() => {
    let current = heading;
    const animate = () => {
      let diff = targetHeadingRef.current - current;
      // Shortest path around circle
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;

      if (Math.abs(diff) > 0.05) {
        current = (current + diff * 0.25 + 360) % 360;
        setHeading(current);
        if (onAngleSelect) onAngleSelect(current);
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onAngleSelect, heading]);

  // Set target heading smoothly
  const setTargetDegree = (deg: number) => {
    const normalized = (deg % 360 + 360) % 360;
    targetHeadingRef.current = normalized;
  };

  // Sensor Permission & Orientation Listener
  const requestSensorPermission = async () => {
    try {
      if (typeof window === "undefined") return;

      const win = window as any;
      if (
        typeof win.DeviceOrientationEvent !== "undefined" &&
        typeof win.DeviceOrientationEvent.requestPermission === "function"
      ) {
        const state = await win.DeviceOrientationEvent.requestPermission();
        if (state === "granted") {
          window.addEventListener("deviceorientation", handleDeviceOrientation, true);
          setIsSensorActive(true);
          toast.success(
            language === "bn"
              ? "ডিভাইস কম্পাস সেন্সর সফলভাবে সক্রিয় হয়েছে!"
              : "Device compass sensor activated successfully!"
          );
        } else {
          toast.error(
            language === "bn"
              ? "সেন্সর পারমিশন অস্বীকৃত হয়েছে। ম্যানুয়াল ডায়াল ব্যবহার করুন।"
              : "Compass permission denied. You can rotate manually."
          );
        }
      } else if ("ondeviceorientationabsolute" in win) {
        window.addEventListener("deviceorientationabsolute" as any, handleDeviceOrientation as any, true);
        setIsSensorActive(true);
        toast.success(
          language === "bn" ? "অ্যান্ড্রয়েড কম্পাস সেন্সর সংযুক্ত!" : "Compass sensor connected!"
        );
      } else if ("ondeviceorientation" in win) {
        window.addEventListener("deviceorientation", handleDeviceOrientation, true);
        setIsSensorActive(true);
        toast.success(
          language === "bn" ? "কম্পাস সেন্সর সংযুক্ত!" : "Compass sensor connected!"
        );
      } else {
        toast.info(
          language === "bn"
            ? "ডিভাইসে ম্যাগনেটিক সেন্সর পাওয়া যায়নি। ম্যানুয়াল ডায়াল ব্যবহার করুন।"
            : "No magnetic sensor detected. Use manual dial."
        );
      }
    } catch (err) {
      console.error("Sensor init error:", err);
      toast.error(
        language === "bn" ? "সেন্সর চালু করা যায়নি। ম্যানুয়াল মোড সক্রিয়।" : "Failed to activate sensor."
      );
    }
  };

  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    let compassDeg: number | null = null;

    // iOS Safari webkitCompassHeading
    if (typeof (event as any).webkitCompassHeading !== "undefined") {
      compassDeg = (event as any).webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android Chrome: alpha 0 is North if absolute
      compassDeg = (360 - event.alpha) % 360;
    }

    if (compassDeg !== null && !isNaN(compassDeg)) {
      setTargetDegree(compassDeg);
    }
  };

  const stopSensor = () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("deviceorientation", handleDeviceOrientation, true);
      window.removeEventListener("deviceorientationabsolute", handleDeviceOrientation as any, true);
    }
    setIsSensorActive(false);
    toast.info(language === "bn" ? "সেন্সর নিষ্ক্রিয় করা হয়েছে।" : "Sensor stopped.");
  };

  // Drag interaction on Compass Wheel
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSensorActive) return; // In sensor mode, let sensor control
    isDragging.current = true;
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !compassRef.current) return;
    const rect = compassRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Angle relative to top 12 o'clock
    let angleRad = Math.atan2(dx, -dy);
    let deg = (angleRad * 180) / Math.PI;
    if (deg < 0) deg += 360;
    setTargetDegree(deg);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="space-y-6">
      {/* =====================================================================
          CONTROL BAR: Sensor Toggle & Dial/Needle Mode
      ===================================================================== */}
      <div className="card-surface p-4 sm:p-5 rounded-2xl border border-border/80 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div
            className={`size-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
              isSensorActive
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 animate-pulse"
                : "bg-surface-muted border-border text-muted-foreground"
            }`}
          >
            <Smartphone className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">
                {language === "bn"
                  ? "স্মার্ট ডিভাইস কম্পাস সেন্সর"
                  : language === "hi"
                  ? "डिवाइस कम्पास सेंसर"
                  : "Live Device Compass Sensor"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isSensorActive
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {isSensorActive
                  ? language === "bn"
                    ? "🟢 সেন্সর সক্রিয়"
                    : "🟢 Sensor Live"
                  : language === "bn"
                  ? "ম্যানুয়াল মোড"
                  : "Manual Mode"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {isSensorActive
                ? language === "bn"
                  ? "ফোনটিকে অনুভূমিকভাবে রেখে লক্ষ্যবস্তুর দিকে তাক করুন।"
                  : "Hold phone flat and point towards the door/room."
                : language === "bn"
                ? "সেন্সর চালু করুন অথবা নিচে ডায়ালটি ঘুরিয়ে কোণ পরিবর্তন করুন।"
                : "Enable sensor or drag the dial to rotate."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {isSensorActive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={stopSensor}
              className="text-xs font-semibold cursor-pointer border-border hover:bg-surface-muted"
            >
              <RotateCcw className="size-3.5 mr-1" />
              {language === "bn" ? "সেন্সর বন্ধ করুন" : "Stop Sensor"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={requestSensorPermission}
              className="text-xs font-bold cursor-pointer bg-brand-500 hover:bg-brand-600 text-brand-foreground shadow-sm flex items-center gap-1.5"
            >
              <Compass className="size-3.5" />
              {language === "bn" ? "কম্পাস সেন্সর চালু করুন" : "Enable Sensor"}
            </Button>
          )}

          <div className="hidden sm:flex items-center p-1 rounded-xl bg-surface border border-border/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRotateMode("dial")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                rotateMode === "dial" ? "bg-brand-500 text-brand-foreground shadow-2xs" : "text-muted-foreground"
              }`}
            >
              {language === "bn" ? "ডায়াল মোড" : "Dial"}
            </button>
            <button
              type="button"
              onClick={() => setRotateMode("needle")}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                rotateMode === "needle" ? "bg-brand-500 text-brand-foreground shadow-2xs" : "text-muted-foreground"
              }`}
            >
              {language === "bn" ? "সূঁচ মোড" : "Needle"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          ITEM TO INSPECT SELECTOR
      ===================================================================== */}
      <div className="card-surface p-4 sm:p-5 rounded-2xl border border-border/80 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-amber-500" />
            {language === "bn"
              ? "কী পরীক্ষা করছেন নির্বাচন করুন (Select Room / Feature)"
              : language === "hi"
              ? "किसकी जांच कर रहे हैं? (कक्षा चुनें)"
              : "What are you inspecting?"}
          </label>
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            {language === "bn"
              ? "রিয়েল-টাইমে বাস্তু ফল দেখুন"
              : "Instant Real-Time Verdict"}
          </span>
        </div>

        {/* Horizontal scrollable pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {INSPECT_ITEMS.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItemId(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-brand-500 text-brand-foreground border-brand-500 shadow-sm shadow-brand-500/20 font-bold"
                    : "bg-surface border-border/80 text-muted-foreground hover:text-foreground hover:bg-surface-muted"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{language === "bn" ? item.title_bn.split(" ")[0] : item.title_en}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          MAIN INTERACTIVE COMPASS CHAKRA + REAL-TIME VERDICT CARD
      ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Circular Vastu Chakra Compass (7 Cols) */}
        <div className="lg:col-span-7 card-surface rounded-2xl border border-border/80 p-4 sm:p-6 shadow-xs flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
          {/* Top Sighting Reticle / Aiming Mark */}
          <div className="flex flex-col items-center space-y-1 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold tracking-wider shadow-2xs">
              <Compass className="size-3.5 text-amber-500" />
              <span>
                {language === "bn" ? "মুখোমুখি দিক:" : "Aiming Direction:"}{" "}
                <strong className="font-mono text-sm text-foreground">{heading.toFixed(1)}°</strong>{" "}
                <span className="text-amber-600 dark:text-amber-400">({currentZone.code})</span>
              </span>
            </div>
            {/* Red Sighting Arrow pointing down into wheel */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-amber-500 filter drop-shadow(0 2px 4px rgba(229,169,60,0.4))" />
          </div>

          {/* SVG VASTU CHAKRA WHEEL */}
          <div
            className="relative w-full max-w-[380px] sm:max-w-[440px] aspect-square flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            {/* Background Outer Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/10 via-brand-500/5 to-transparent blur-xl pointer-events-none" />

            <svg
              ref={compassRef}
              viewBox="0 0 500 500"
              className="w-full h-full transform transition-transform duration-75"
              style={{
                transform: rotateMode === "dial" ? `rotate(${-heading}deg)` : "rotate(0deg)",
              }}
            >
              <defs>
                {/* Central Vastu Purusha Glow & Gradient */}
                <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#1E293B" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0B0F17" stopOpacity="0.95" />
                </radialGradient>

                <linearGradient id="goldNeedleTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#E5A93C" />
                </linearGradient>

                <linearGradient id="silverNeedleBottom" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
              </defs>

              {/* Outer Rim Ring */}
              <circle cx="250" cy="250" r="244" fill="#0B0F17" stroke="#334155" strokeWidth="2.5" />
              <circle cx="250" cy="250" r="236" fill="none" stroke="#E5A93C" strokeWidth="1" strokeOpacity="0.4" />

              {/* 360-degree ticks (Every 10 degrees labeled, every 2.5 degrees ticked) */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const isMajor = deg % 10 === 0;
                const tickLen = isMajor ? 10 : 5;
                const rad = ((deg - 90) * Math.PI) / 180;
                const x1 = 250 + 242 * Math.cos(rad);
                const y1 = 250 + 242 * Math.sin(rad);
                const x2 = 250 + (242 - tickLen) * Math.cos(rad);
                const y2 = 250 + (242 - tickLen) * Math.sin(rad);

                // Degree text at major ticks
                const tx = 250 + 224 * Math.cos(rad);
                const ty = 250 + 224 * Math.sin(rad);

                return (
                  <g key={`tick-${deg}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isMajor ? "#E5A93C" : "#64748B"}
                      strokeWidth={isMajor ? "1.5" : "1"}
                    />
                    {isMajor && (
                      <text
                        x={tx}
                        y={ty + 3}
                        fontSize="7"
                        fontFamily="monospace"
                        fontWeight="bold"
                        fill="#94A3B8"
                        textAnchor="middle"
                        transform={`rotate(${deg}, ${tx}, ${ty})`}
                      >
                        {deg}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* 32 PADAS RING (Radius 214 to 172, 11.25° each) */}
              {COMPASS_PADAS.map((pada) => {
                const c = pada.centerDeg;
                const startAngle = pada.startDeg - 90;
                const endAngle = pada.endDeg - 90;
                const rOuter = 214;
                const rInner = 176;

                const radStart = (startAngle * Math.PI) / 180;
                const radEnd = (endAngle * Math.PI) / 180;

                const x1 = 250 + rOuter * Math.cos(radStart);
                const y1 = 250 + rOuter * Math.sin(radStart);
                const x2 = 250 + rOuter * Math.cos(radEnd);
                const y2 = 250 + rOuter * Math.sin(radEnd);
                const x3 = 250 + rInner * Math.cos(radEnd);
                const y3 = 250 + rInner * Math.sin(radEnd);
                const x4 = 250 + rInner * Math.cos(radStart);
                const y4 = 250 + rInner * Math.sin(radStart);

                const pathData = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;

                const textRad = ((c - 90) * Math.PI) / 180;
                const textX = 250 + 195 * Math.cos(textRad);
                const textY = 250 + 195 * Math.sin(textRad);

                return (
                  <g key={`pada-${pada.id}`}>
                    <path
                      d={pathData}
                      fill={
                        pada.isGoldenDoor
                          ? "#E5A93C"
                          : pada.quadrant === "North"
                          ? "#0369A1"
                          : pada.quadrant === "East"
                          ? "#047857"
                          : pada.quadrant === "South"
                          ? "#B91C1C"
                          : "#475569"
                      }
                      fillOpacity={pada.isGoldenDoor ? "0.35" : "0.15"}
                      stroke={pada.isGoldenDoor ? "#E5A93C" : "#334155"}
                      strokeWidth={pada.isGoldenDoor ? "1.5" : "0.75"}
                    />
                    <text
                      x={textX}
                      y={textY + 2.5}
                      fontSize="7"
                      fontWeight="bold"
                      fill={pada.isGoldenDoor ? "#FDE047" : "#CBD5E1"}
                      textAnchor="middle"
                      transform={`rotate(${c}, ${textX}, ${textY})`}
                    >
                      {pada.name}
                    </text>
                  </g>
                );
              })}

              {/* 16 ZONES RING (Radius 176 to 134, 22.5° each) with Panchabhuta colors */}
              {COMPASS_ZONES.map((zone) => {
                const c = zone.centerDeg;
                const startAngle = c - 11.25 - 90;
                const endAngle = c + 11.25 - 90;
                const rOuter = 176;
                const rInner = 134;

                const radStart = (startAngle * Math.PI) / 180;
                const radEnd = (endAngle * Math.PI) / 180;

                const x1 = 250 + rOuter * Math.cos(radStart);
                const y1 = 250 + rOuter * Math.sin(radStart);
                const x2 = 250 + rOuter * Math.cos(radEnd);
                const y2 = 250 + rOuter * Math.sin(radEnd);
                const x3 = 250 + rInner * Math.cos(radEnd);
                const y3 = 250 + rInner * Math.sin(radEnd);
                const x4 = 250 + rInner * Math.cos(radStart);
                const y4 = 250 + rInner * Math.sin(radStart);

                const pathData = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 0 0 ${x4} ${y4} Z`;

                const textRad = ((c - 90) * Math.PI) / 180;
                const textX = 250 + 155 * Math.cos(textRad);
                const textY = 250 + 155 * Math.sin(textRad);

                return (
                  <g key={`zone-${zone.code}`}>
                    <path
                      d={pathData}
                      fill={zone.colorHex}
                      fillOpacity="0.25"
                      stroke={zone.colorHex}
                      strokeWidth="1"
                    />
                    <text
                      x={textX}
                      y={textY + 3}
                      fontSize="9"
                      fontFamily="serif"
                      fontWeight="black"
                      fill="#FFFFFF"
                      textAnchor="middle"
                      transform={`rotate(${c}, ${textX}, ${textY})`}
                    >
                      {zone.code}
                    </text>
                  </g>
                );
              })}

              {/* LIFE ASPECT RING (Radius 134 to 98) */}
              {COMPASS_ZONES.map((zone) => {
                const c = zone.centerDeg;
                const textRad = ((c - 90) * Math.PI) / 180;
                const textX = 250 + 116 * Math.cos(textRad);
                const textY = 250 + 116 * Math.sin(textRad);

                return (
                  <text
                    key={`aspect-${zone.code}`}
                    x={textX}
                    y={textY + 2}
                    fontSize="6"
                    fontWeight="semibold"
                    fill="#94A3B8"
                    textAnchor="middle"
                    transform={`rotate(${c}, ${textX}, ${textY})`}
                  >
                    {zone.lifeAspect_en.split(" ")[0]}
                  </text>
                );
              })}

              {/* CENTER CIRCLE: Vastu Purusha Mandala & Cardinal Lines */}
              <circle cx="250" cy="250" r="98" fill="url(#centerGradient)" stroke="#E5A93C" strokeWidth="1.5" />
              <circle cx="250" cy="250" r="90" fill="none" stroke="#64748B" strokeWidth="0.75" strokeDasharray="3 3" />

              {/* Cardinal Crosshair Axis (Jaivik / Pranik Source) */}
              <line x1="250" y1="152" x2="250" y2="348" stroke="#E5A93C" strokeWidth="1" strokeOpacity="0.5" />
              <line x1="152" y1="250" x2="348" y2="250" stroke="#E5A93C" strokeWidth="1" strokeOpacity="0.5" />

              {/* Diagonal Lines (NE-SW and NW-SE) */}
              <line x1="181" y1="181" x2="319" y2="319" stroke="#38BDF8" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 2" />
              <line x1="319" y1="181" x2="181" y2="319" stroke="#F87171" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 2" />

              {/* Vastu Purusha Silhouette Line Art (Head in NE, Feet in SW) */}
              <path
                d="M 250 250 Q 265 235 275 225 Q 260 215 250 220 Q 240 215 225 225 Q 235 235 250 250 Z"
                fill="none"
                stroke="#E5A93C"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <circle cx="250" cy="250" r="16" fill="#0B0F17" stroke="#E5A93C" strokeWidth="1.5" />
              <text x="250" y="247" fontSize="5" fontWeight="bold" fill="#E5A93C" textAnchor="middle">
                VASTU
              </text>
              <text x="250" y="254" fontSize="5" fontWeight="bold" fill="#E5A93C" textAnchor="middle">
                CHAKRA
              </text>

              {/* COMPASS NEEDLE (Used when in needle rotate mode) */}
              {rotateMode === "needle" && (
                <g transform={`rotate(${heading}, 250, 250)`}>
                  {/* North Pointing Arrow (Gold) */}
                  <polygon points="250,70 257,250 250,235" fill="url(#goldNeedleTop)" />
                  <polygon points="250,70 243,250 250,235" fill="#D97706" />

                  {/* South Pointing Arrow (Silver) */}
                  <polygon points="250,430 257,250 250,265" fill="url(#silverNeedleBottom)" />
                  <polygon points="250,430 243,250 250,265" fill="#334155" />

                  {/* Center Brass Cap */}
                  <circle cx="250" cy="250" r="9" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
                  <circle cx="250" cy="250" r="4" fill="#0284C7" />
                </g>
              )}
            </svg>
          </div>

          {/* Quick Direction Presets & Fine Slider */}
          <div className="w-full space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">
                {language === "bn" ? "ম্যানুয়াল কোণ নিয়ন্ত্রণ:" : "Angle Adjustment:"}
              </span>
              <div className="flex items-center gap-1 font-mono">
                <button
                  type="button"
                  onClick={() => setTargetDegree(heading - 1)}
                  className="px-2 py-0.5 rounded bg-surface border border-border text-foreground hover:bg-surface-muted cursor-pointer"
                >
                  -1°
                </button>
                <span className="font-bold text-amber-600 dark:text-amber-400 px-2">
                  {heading.toFixed(1)}°
                </span>
                <button
                  type="button"
                  onClick={() => setTargetDegree(heading + 1)}
                  className="px-2 py-0.5 rounded bg-surface border border-border text-foreground hover:bg-surface-muted cursor-pointer"
                >
                  +1°
                </button>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="359.9"
              step="0.5"
              value={heading}
              onChange={(e) => setTargetDegree(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-brand-500"
            />

            {/* 8 Cardinal / Inter-cardinal Quick Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 pt-1">
              {[
                { label: "N (0°)", deg: 0 },
                { label: "NE (45°)", deg: 45 },
                { label: "E (90°)", deg: 90 },
                { label: "SE (135°)", deg: 135 },
                { label: "S (180°)", deg: 180 },
                { label: "SW (225°)", deg: 225 },
                { label: "W (270°)", deg: 270 },
                { label: "NW (315°)", deg: 315 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => setTargetDegree(btn.deg)}
                  className="py-1 px-1 text-[11px] font-semibold rounded-lg bg-surface border border-border/80 text-muted-foreground hover:text-foreground hover:bg-surface-muted transition-all cursor-pointer text-center"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-time Live Diagnostic & Remedial Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Status Badge Card */}
          <div className="card-surface p-5 sm:p-6 rounded-2xl border border-border/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {language === "bn" ? "রিয়েল-টাইম বাস্তু মূল্যায়ন" : "Live Vastu Analysis"}
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${itemEvaluation.colorClass}`}
              >
                {itemEvaluation.iconType === "check" ? (
                  <CheckCircle2 className="size-3.5" />
                ) : itemEvaluation.iconType === "alert" ? (
                  <ShieldAlert className="size-3.5" />
                ) : (
                  <AlertTriangle className="size-3.5" />
                )}
                <span>{itemEvaluation.score}% স্কোর</span>
              </div>
            </div>

            {/* Title & Status */}
            <div>
              <h3 className="text-lg font-serif font-bold text-foreground">
                {itemEvaluation.badge_bn}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                {itemEvaluation.title_bn}
              </p>
            </div>

            {/* Detailed Impact */}
            <div className="p-3.5 rounded-xl bg-surface border border-border/80 text-xs text-foreground/80 leading-relaxed">
              <span className="font-bold text-foreground block mb-1">
                {language === "bn" ? "জীবনের ওপর প্রভাব:" : "Impact on Native & Household:"}
              </span>
              {itemEvaluation.desc_bn}
            </div>

            {/* Non-Demolition Remedy Box */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-500" />
                <span>
                  {language === "bn"
                    ? "ভাঙচুরবিহীন প্রতিকার (Non-Demolition Remedy)"
                    : "Non-Demolition Remedy"}
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {itemEvaluation.remedy_bn}
              </p>

              {itemEvaluation.metalStrip && (
                <div className="pt-2 border-t border-amber-500/20 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Shield className="size-3.5" />
                  <span>
                    {language === "bn"
                      ? `মেটাল স্ট্রিপ ব্লক: ${itemEvaluation.metalStrip}`
                      : `Metal Strip: ${itemEvaluation.metalStrip}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Current Zone & Pada Profile Card */}
          <div className="card-surface p-5 rounded-2xl border border-border/80 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="size-3.5 text-amber-500" />
              {language === "bn" ? "বর্তমান কোণ ও জোনের তাৎপর্য" : "Zone & Pada Bio-Energy"}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                <span className="text-muted-foreground block text-[10px]">সক্রিয় পদ (Pada):</span>
                <span className="font-bold text-foreground">
                  {currentPada.id} — {currentPada.deity_bn.split(" ")[0]}
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  {currentPada.startDeg}° - {currentPada.endDeg}°
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface border border-border/80">
                <span className="text-muted-foreground block text-[10px]">তত্ত্ব (Element):</span>
                <span className="font-bold text-foreground">{currentZone.element_bn}</span>
                <span className="text-[10px] text-muted-foreground block">
                  {currentZone.name_bn.split(" ")[0]} জোন
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-border/80 text-xs space-y-1">
              <div className="text-muted-foreground text-[11px]">
                <strong className="text-foreground">শারীরিক অঙ্গ:</strong> {currentZone.organs_bn}
              </div>
              <div className="text-muted-foreground text-[11px]">
                <strong className="text-foreground">জীবনের ক্ষেত্র:</strong> {currentZone.lifeAspect_bn}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
