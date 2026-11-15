"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AshtakootaRadarChartProps {
  scores: {
    varna: { obtained: number; total: number };
    vashya: { obtained: number; total: number };
    tara: { obtained: number; total: number };
    yoni: { obtained: number; total: number };
    graha_maitri: { obtained: number; total: number };
    gana: { obtained: number; total: number };
    bhakoot: { obtained: number; total: number };
    nadi: { obtained: number; total: number };
  };
  language?: "bn" | "hi" | "en";
}

const KOOTA_LABELS = {
  varna: { bn: "বর্ণ (Varna)", hi: "वर्ण (Varna)", en: "Varna" },
  vashya: { bn: "বশ্য (Vashya)", hi: "वश्य (Vashya)", en: "Vashya" },
  tara: { bn: "তারা (Tara)", hi: "तारा (Tara)", en: "Tara" },
  yoni: { bn: "যোনি (Yoni)", hi: "योनि (Yoni)", en: "Yoni" },
  graha_maitri: { bn: "গ্রহমৈত্রী (Maitri)", hi: "ग्रहमैत्री (Maitri)", en: "Graha Maitri" },
  gana: { bn: "গণ (Gana)", hi: "गण (Gana)", en: "Gana" },
  bhakoot: { bn: "ভকূট (Bhakoot)", hi: "भकूट (Bhakoot)", en: "Bhakoot" },
  nadi: { bn: "নাড়ী (Nadi)", hi: "नाड़ी (Nadi)", en: "Nadi" },
};

export function AshtakootaRadarChart({
  scores,
  language = "en",
}: AshtakootaRadarChartProps) {
  // Normalize each koota to 100% scale for balanced spider polygon visualization
  const data = [
    {
      koota: KOOTA_LABELS.varna[language] || KOOTA_LABELS.varna.en,
      obtained: scores.varna.obtained,
      total: scores.varna.total,
      percentage: Math.round((scores.varna.obtained / scores.varna.total) * 100),
    },
    {
      koota: KOOTA_LABELS.vashya[language] || KOOTA_LABELS.vashya.en,
      obtained: scores.vashya.obtained,
      total: scores.vashya.total,
      percentage: Math.round((scores.vashya.obtained / scores.vashya.total) * 100),
    },
    {
      koota: KOOTA_LABELS.tara[language] || KOOTA_LABELS.tara.en,
      obtained: scores.tara.obtained,
      total: scores.tara.total,
      percentage: Math.round((scores.tara.obtained / scores.tara.total) * 100),
    },
    {
      koota: KOOTA_LABELS.yoni[language] || KOOTA_LABELS.yoni.en,
      obtained: scores.yoni.obtained,
      total: scores.yoni.total,
      percentage: Math.round((scores.yoni.obtained / scores.yoni.total) * 100),
    },
    {
      koota: KOOTA_LABELS.graha_maitri[language] || KOOTA_LABELS.graha_maitri.en,
      obtained: scores.graha_maitri.obtained,
      total: scores.graha_maitri.total,
      percentage: Math.round((scores.graha_maitri.obtained / scores.graha_maitri.total) * 100),
    },
    {
      koota: KOOTA_LABELS.gana[language] || KOOTA_LABELS.gana.en,
      obtained: scores.gana.obtained,
      total: scores.gana.total,
      percentage: Math.round((scores.gana.obtained / scores.gana.total) * 100),
    },
    {
      koota: KOOTA_LABELS.bhakoot[language] || KOOTA_LABELS.bhakoot.en,
      obtained: scores.bhakoot.obtained,
      total: scores.bhakoot.total,
      percentage: Math.round((scores.bhakoot.obtained / scores.bhakoot.total) * 100),
    },
    {
      koota: KOOTA_LABELS.nadi[language] || KOOTA_LABELS.nadi.en,
      obtained: scores.nadi.obtained,
      total: scores.nadi.total,
      percentage: Math.round((scores.nadi.obtained / scores.nadi.total) * 100),
    },
  ];

  return (
    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#eadf9a" strokeDasharray="3 3" opacity={0.6} />
          <PolarAngleAxis
            dataKey="koota"
            tick={{ fill: "#1a1208", fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Score %"
            dataKey="percentage"
            stroke="#f59e0b"
            strokeWidth={2.5}
            fill="#fcd404"
            fillOpacity={0.45}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl border border-amber-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm text-xs font-sans">
                    <p className="font-bold text-stone-900">{item.koota}</p>
                    <p className="text-amber-800 font-extrabold mt-0.5">
                      {item.obtained} / {item.total} pts ({item.percentage}%)
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
