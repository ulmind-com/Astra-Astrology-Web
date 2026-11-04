/**
 * TypeScript types for Tarot Card Reading and Chrono-Astrological Resonance Engine.
 */

export type ArcanaType = "major" | "minor";
export type SuitType = "wands" | "cups" | "swords" | "pentacles";
export type OrientationType = "upright" | "reversed";
export type QuestionCategory = "general" | "love" | "career" | "finance" | "spiritual";

export interface CardAspectInterpretation {
  general: string;
  love: string;
  career: string;
  finance: string;
  spiritual: string;
  keywords: string[];
}

export interface TarotCard {
  id: string;
  name: string;
  arcana: ArcanaType;
  suit?: SuitType | null;
  number: number;
  element: string;
  astrology: string;
  vedic_graha: string;
  upright: CardAspectInterpretation;
  reversed: CardAspectInterpretation;
  remedy: string;
  affirmation: string;
  image_slug: string;
}

export interface SpreadPosition {
  index: number;
  title: string;
  role: string;
  description: string;
}

export interface SpreadConfig {
  id: string;
  name: string;
  category: string;
  card_count: number;
  description: string;
  ideal_for: string;
  positions: SpreadPosition[];
}

export interface DrawnCardDetail {
  position_index: number;
  position_title: string;
  position_role: string;
  position_description: string;
  card: TarotCard;
  orientation: OrientationType;
  relevant_interpretation: string;
  keywords: string[];
  advice: string;
  elemental_harmony?: string | null;
}

export interface TarotDrawRequest {
  spread_id: string;
  category: QuestionCategory;
  question?: string | null;
  user_moon_sign?: string | null;
  active_dasha_lord?: string | null;
  selected_indices?: number[] | null;
  intention_seed?: number | null;
}

export interface TarotDrawResponse {
  draw_id: string;
  timestamp: string;
  spread_id: string;
  spread_name: string;
  category: QuestionCategory;
  question?: string | null;
  drawn_cards: DrawnCardDetail[];
  elemental_breakdown: Record<string, number>;
  dominant_element: string;
  astrological_resonance: {
    major_arcana_percentage: number;
    karmic_momentum: string;
    active_grahas: string[];
    dominant_element: string;
    aligned_with_user_moon: boolean;
    aligned_with_active_dasha: boolean;
  };
  karmic_synthesis: string;
  actionable_guidance: string;
  prescribed_remedy: string;
  vedic_mantra: string;
}

export interface DailyTarotRequest {
  category?: QuestionCategory;
  date_str?: string | null;
  moon_sign?: string | null;
}
