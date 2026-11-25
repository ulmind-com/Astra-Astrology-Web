import type { AstrologyLanguage } from "@/types";

const WORDS: Record<AstrologyLanguage, string[]> = {
  en: ["Vedic Horoscope", "Kundli Matching", "Nakshatra & Pada", "Vimshottari Dasha", "KP Astrology", "Tarot", "Numerology", "Vastu Shastra", "Palmistry", "Muhurat"],
  bn: ["বৈদিক রাশিফল", "কুণ্ডলী মিলন", "নক্ষত্র ও পদ", "বিংশোত্তরী দশা", "কেপি জ্যোতিষ", "ট্যারো", "সংখ্যাতত্ত্ব", "বাস্তুশাস্ত্র", "হস্তরেখা", "শুভ মুহূর্ত"],
  hi: ["वैदिक राशिफल", "कुंडली मिलान", "नक्षत्र एवं पद", "विंशोत्तरी दशा", "केपी ज्योतिष", "टैरो", "अंक ज्योतिष", "वास्तु शास्त्र", "हस्तरेखा", "शुभ मुहूर्त"],
};

/**
 * A slow ribbon of the disciplines DivinLink covers, between the hero and the
 * long sections. Pure CSS: the list is rendered twice and the track moves by
 * exactly one copy, so the loop is seamless and costs no JavaScript.
 */
export function HomeMarquee({ language }: { language: AstrologyLanguage }) {
  const words = WORDS[language] ?? WORDS.en;
  const row = (hidden: boolean) => (
    <ul className="dl-marquee-row" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <li key={w}>
          <span>{w}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z" />
          </svg>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="dl-marquee" role="presentation">
      <div className="dl-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
