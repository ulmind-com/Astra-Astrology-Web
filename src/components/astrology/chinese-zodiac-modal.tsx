"use client";

import { Check, Sparkles, X } from "lucide-react";
import * as React from "react";

export interface ChineseZodiacSign {
  id: string;
  name: string;
  chinese: string;
  pinyin: string;
  element: string;
  traits: string[];
  recentYears: number[];
  luckyNumbers: number[];
  luckyColors: string[];
  compatibleWith: string[];
}

export const CHINESE_ZODIAC_SIGNS: ChineseZodiacSign[] = [
  {
    id: "rat",
    name: "Rat",
    chinese: "鼠",
    pinyin: "Shǔ",
    element: "Water",
    traits: ["Clever", "Resourceful", "Versatile", "Quick-witted"],
    recentYears: [1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020],
    luckyNumbers: [2, 3],
    luckyColors: ["Blue", "Gold", "Green"],
    compatibleWith: ["Dragon", "Monkey", "Ox"],
  },
  {
    id: "ox",
    name: "Ox",
    chinese: "牛",
    pinyin: "Niú",
    element: "Earth",
    traits: ["Honest", "Dependable", "Persistent", "Methodical"],
    recentYears: [1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021],
    luckyNumbers: [1, 4],
    luckyColors: ["White", "Yellow", "Green"],
    compatibleWith: ["Rat", "Snake", "Rooster"],
  },
  {
    id: "tiger",
    name: "Tiger",
    chinese: "虎",
    pinyin: "Hǔ",
    element: "Wood",
    traits: ["Brave", "Confident", "Charismatic", "Daring"],
    recentYears: [1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022],
    luckyNumbers: [1, 3, 4],
    luckyColors: ["Blue", "Grey", "Orange"],
    compatibleWith: ["Dragon", "Horse", "Pig"],
  },
  {
    id: "rabbit",
    name: "Rabbit",
    chinese: "兔",
    pinyin: "Tù",
    element: "Wood",
    traits: ["Gentle", "Elegant", "Compassionate", "Responsible"],
    recentYears: [1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023],
    luckyNumbers: [3, 4, 6],
    luckyColors: ["Red", "Pink", "Purple", "Blue"],
    compatibleWith: ["Goat", "Monkey", "Dog", "Pig"],
  },
  {
    id: "dragon",
    name: "Dragon",
    chinese: "龙",
    pinyin: "Lóng",
    element: "Earth",
    traits: ["Noble", "Ambitious", "Visionary", "Charismatic"],
    recentYears: [1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024],
    luckyNumbers: [1, 6, 7],
    luckyColors: ["Gold", "Silver", "Greyish White"],
    compatibleWith: ["Rooster", "Rat", "Monkey"],
  },
  {
    id: "snake",
    name: "Snake",
    chinese: "蛇",
    pinyin: "Shé",
    element: "Fire",
    traits: ["Wise", "Intuitive", "Enigmatic", "Philosophical"],
    recentYears: [1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025],
    luckyNumbers: [2, 8, 9],
    luckyColors: ["Black", "Red", "Yellow"],
    compatibleWith: ["Dragon", "Rooster"],
  },
  {
    id: "horse",
    name: "Horse",
    chinese: "马",
    pinyin: "Mǎ",
    element: "Fire",
    traits: ["Energetic", "Free-spirited", "Warm-hearted", "Independent"],
    recentYears: [1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026],
    luckyNumbers: [2, 3, 7],
    luckyColors: ["Yellow", "Green"],
    compatibleWith: ["Goat", "Tiger"],
  },
  {
    id: "goat",
    name: "Goat",
    chinese: "羊",
    pinyin: "Yáng",
    element: "Earth",
    traits: ["Mild", "Sympathetic", "Creative", "Peaceful"],
    recentYears: [1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027],
    luckyNumbers: [2, 7],
    luckyColors: ["Brown", "Red", "Purple"],
    compatibleWith: ["Horse", "Pig", "Rabbit"],
  },
  {
    id: "monkey",
    name: "Monkey",
    chinese: "猴",
    pinyin: "Hóu",
    element: "Metal",
    traits: ["Sharp", "Smart", "Curious", "Playful"],
    recentYears: [1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028],
    luckyNumbers: [4, 9],
    luckyColors: ["White", "Blue", "Gold"],
    compatibleWith: ["Ox", "Rabbit"],
  },
  {
    id: "rooster",
    name: "Rooster",
    chinese: "鸡",
    pinyin: "Jī",
    element: "Metal",
    traits: ["Observant", "Hardworking", "Confident", "Punctual"],
    recentYears: [1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029],
    luckyNumbers: [5, 7, 8],
    luckyColors: ["Gold", "Brown", "Yellow"],
    compatibleWith: ["Ox", "Snake"],
  },
  {
    id: "dog",
    name: "Dog",
    chinese: "狗",
    pinyin: "Gǒu",
    element: "Earth",
    traits: ["Loyal", "Honest", "Prudent", "Protective"],
    recentYears: [1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030],
    luckyNumbers: [3, 4, 9],
    luckyColors: ["Red", "Green", "Purple"],
    compatibleWith: ["Rabbit"],
  },
  {
    id: "pig",
    name: "Pig",
    chinese: "猪",
    pinyin: "Zhū",
    element: "Water",
    traits: ["Generous", "Compassionate", "Diligent", "Good-tempered"],
    recentYears: [1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031],
    luckyNumbers: [2, 5, 8],
    luckyColors: ["Yellow", "Grey", "Brown", "Gold"],
    compatibleWith: ["Tiger", "Rabbit", "Goat"],
  },
];

export function getChineseZodiacSignForYear(year: number): ChineseZodiacSign {
  // 1900 was Year of the Rat (offset 0)
  const index = (((year - 1900) % 12) + 12) % 12;
  return CHINESE_ZODIAC_SIGNS[index];
}

interface ChineseZodiacModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChineseZodiacModal({ isOpen, onClose }: ChineseZodiacModalProps) {
  const [searchYear, setSearchYear] = React.useState("");
  const [selectedSign, setSelectedSign] = React.useState<ChineseZodiacSign>(CHINESE_ZODIAC_SIGNS[0]);

  React.useEffect(() => {
    if (searchYear.length === 4) {
      const yr = parseInt(searchYear, 10);
      if (!isNaN(yr) && yr >= 1900 && yr <= 2100) {
        setSelectedSign(getChineseZodiacSignForYear(yr));
      }
    }
  }, [searchYear]);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#e5cebd] bg-[#fffaf5] p-6 sm:p-8 shadow-2xl text-[#372e5c]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#ebd7c8] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#b06d4e]">
              <Sparkles className="size-3.5" />
              <span>Eastern Astrology</span>
            </div>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#372e5c]">
              12 Chinese Zodiac Signs <span className="font-normal text-[#b06d4e]">(生肖)</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#61596f]">
              Discover your Lunar animal sign, innate elemental power, and personality traits.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#7f748d] hover:bg-[#faebd9] hover:text-[#372e5c] transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Year Finder Input */}
        <div className="mt-5 rounded-2xl bg-[#fbf1e7] border border-[#e5cebd] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <label className="text-xs sm:text-sm font-semibold text-[#372e5c]">
            Find your animal by birth year:
          </label>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              min="1900"
              max="2100"
              placeholder="e.g. 1998, 2004"
              value={searchYear}
              onChange={(e) => setSearchYear(e.target.value)}
              className="w-full sm:w-40 px-3.5 py-1.5 rounded-xl border border-[#d6b7a2] bg-white text-sm font-semibold text-[#372e5c] text-center focus:outline-none focus:ring-2 focus:ring-[#b06d4e]"
            />
            {searchYear.length === 4 && (
              <span className="shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                {selectedSign.name} {selectedSign.chinese}
              </span>
            )}
          </div>
        </div>

        {/* Selected Sign Spotlight */}
        <div className="mt-5 rounded-2xl border border-[#d6b7a2] bg-gradient-to-r from-[#fef7f0] to-[#fcf0e4] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#cfae97] bg-[#fffaf5] text-2xl font-serif font-bold text-[#b06d4e] shadow-xs">
                {selectedSign.chinese}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold font-serif text-[#372e5c]">
                    The {selectedSign.name} ({selectedSign.pinyin})
                  </h3>
                  <span className="rounded-full bg-[#faebd9] border border-[#ebd7c8] px-2.5 py-0.5 text-[11px] font-semibold text-[#b06d4e]">
                    Element: {selectedSign.element}
                  </span>
                </div>
                <p className="text-xs text-[#6e667c] mt-0.5">
                  Years: {selectedSign.recentYears.slice(-5).join(", ")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-[#ebd7c8] pt-3.5">
            <div>
              <span className="font-semibold text-[#8b4f32]">Core Traits:</span>
              <p className="text-[#514a60] mt-0.5">{selectedSign.traits.join(" · ")}</p>
            </div>
            <div>
              <span className="font-semibold text-[#8b4f32]">Lucky Numbers & Colors:</span>
              <p className="text-[#514a60] mt-0.5">
                #{selectedSign.luckyNumbers.join(", #")} | {selectedSign.luckyColors.join(", ")}
              </p>
            </div>
            <div>
              <span className="font-semibold text-[#8b4f32]">Best Compatible:</span>
              <p className="text-[#514a60] mt-0.5">{selectedSign.compatibleWith.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* 12 Animals Grid */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b4f32] mb-3">
            All 12 Lunar Signs
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {CHINESE_ZODIAC_SIGNS.map((s) => {
              const isSelected = s.id === selectedSign.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSign(s)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-[#b06d4e] bg-[#faebd9] ring-2 ring-[#b06d4e]/30 shadow-xs"
                      : "border-[#ebd7c8] bg-white/70 hover:bg-[#fbf1e7]"
                  }`}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fffaf5] border border-[#d6b7a2] font-serif font-bold text-sm text-[#b06d4e]">
                    {s.chinese}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#372e5c] truncate">{s.name}</p>
                    <p className="text-[10px] text-[#7f748d] truncate">{s.recentYears[s.recentYears.length - 1]}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-[#ebd7c8] pt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#b06d4e] hover:bg-[#975638] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}
