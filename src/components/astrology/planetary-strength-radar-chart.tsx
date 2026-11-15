"use client";

import * as React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PlanetaryDignityItem } from "@/types";

interface PlanetaryStrengthRadarChartProps {
  dignities: PlanetaryDignityItem[];
  language?: "bn" | "hi" | "en";
}

const DIGNITY_SCORES: Record<string, number> = {
  Exalted: 10,
  Moolatrikona: 9,
  "Own Sign": 8,
  "Friendly Sign": 6,
  Neutral: 5,
  "Enemy Sign": 3.5,
  Debilitated: 1.5,
};

const PLANET_NAMES_LOCALIZED: Record<string, { bn: string; hi: string; en: string }> = {
  Sun: { bn: "সূর্য (রবি)", hi: "सूर्य", en: "Sun" },
  Moon: { bn: "চন্দ্র", hi: "चन्द्र", en: "Moon" },
  Mars: { bn: "মঙ্গল", hi: "मंगल", en: "Mars" },
  Mercury: { bn: "বুধ", hi: "बुध", en: "Mercury" },
  Jupiter: { bn: "বৃহস্পতি", hi: "गुरु", en: "Jupiter" },
  Venus: { bn: "শুক্র", hi: "शुक्र", en: "Venus" },
  Saturn: { bn: "শনি", hi: "शनि", en: "Saturn" },
  Rahu: { bn: "রাহু", hi: "राहु", en: "Rahu" },
  Ketu: { bn: "কেতু", hi: "केतु", en: "Ketu" },
};

export function PlanetaryStrengthRadarChart({
  dignities,
  language = "bn",
}: PlanetaryStrengthRadarChartProps) {
  const chartData = React.useMemo(() => {
    if (!dignities || dignities.length === 0) return [];

    return dignities.map((item) => {
      const cleanPlanet = item.planet.replace(/\(.*\)/, "").trim();
      const localized =
        PLANET_NAMES_LOCALIZED[cleanPlanet]?.[language] ||
        (language === "bn" ? item.planet_bn : language === "hi" ? item.planet_hi : cleanPlanet) ||
        cleanPlanet;

      const score = DIGNITY_SCORES[item.dignity] || 5;

      return {
        planet: localized,
        englishPlanet: cleanPlanet,
        score,
        maxScore: 10,
        dignity: language === "bn" ? item.dignity_bn : language === "hi" ? item.dignity_hi : item.dignity,
        sign: item.sign,
        house: item.house,
      };
    });
  }, [dignities, language]);

  if (chartData.length === 0) return null;

  return (
    <div className="w-full rounded-2xl border border-amber-200/90 bg-gradient-to-b from-[#fffefc] to-amber-50/40 p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-amber-200/60 pb-3 mb-4">
        <div>
          <h4 className="font-display text-base sm:text-lg font-bold text-amber-950 flex items-center gap-2">
            <span>✨</span>
            <span>
              {language === "bn"
                ? "নবগ্রহ বল ও তেজ রাডার স্পেকট্রাম (Planetary Power Radar)"
                : language === "hi"
                ? "नवग्रह बल एवं तेज रडार स्पेक्ट्रम"
                : "Navagraha Power & Dignity Radar Spectrum"}
            </span>
          </h4>
          <p className="text-xs text-stone-500 font-medium">
            {language === "bn"
              ? "উচ্চস্থ (Exalted: ১০/১০), মূলত্রিকোণ (৯), স্বক্ষেত্র (৮), মিত্রক্ষেত্র (৬), শত্রুক্ষেত্র (৩.৫), নীচস্থ (১.৫)"
              : "Exalted (10/10), Moolatrikona (9), Own Sign (8), Friend (6), Enemy (3.5), Debilitated (1.5)"}
          </p>
        </div>
        <span className="text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full whitespace-nowrap">
          Recharts 3D Visualizer
        </span>
      </div>

      <div className="h-[280px] sm:h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#eab308" strokeOpacity={0.25} />
            <PolarAngleAxis
              dataKey="planet"
              tick={{ fill: "#451a03", fontSize: 11, fontWeight: 700 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#78350f", fontSize: 9 }}
              stroke="#ca8a04"
              strokeOpacity={0.3}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-amber-300 bg-white/95 p-2.5 shadow-lg backdrop-blur-xs text-xs space-y-1">
                      <p className="font-bold text-amber-950 border-b border-amber-200 pb-1">
                        {data.planet} ({data.englishPlanet})
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-amber-900">
                          {language === "bn" ? "বল স্কোর:" : "Score:"}
                        </span>{" "}
                        <span className="font-bold text-amber-700">{data.score} / 10</span>
                      </p>
                      <p className="text-stone-700">
                        <span className="font-semibold text-amber-900">
                          {language === "bn" ? "মর্যাদা:" : "Dignity:"}
                        </span>{" "}
                        <span className="font-medium text-emerald-800">{data.dignity}</span>
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {language === "bn"
                          ? `${data.sign} রাশি • ${data.house}ম ভাব`
                          : `${data.sign} sign • House ${data.house}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name={language === "bn" ? "গ্রহ বল" : "Planet Strength"}
              dataKey="score"
              stroke="#d97706"
              fill="#f59e0b"
              fillOpacity={0.45}
              strokeWidth={2.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
