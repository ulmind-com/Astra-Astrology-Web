export type AyanamsaType =
  | "lahiri"
  | "bv_raman"
  | "krishnamurti"
  | "yukteshwar"
  | "suryasiddhanta"
  | "true_pushya"
  | "true_mula";

export type HouseSystemType = "placidus" | "equal" | "whole_sign" | "koch";

export type ChartStyleType = "north_indian" | "south_indian" | "east_indian";

export type AstrologyLanguage = "en" | "bn" | "hi";

export interface RashiCalculatePayload {
  name: string;
  gender: "male" | "female" | "other";
  day: number;
  month: number;
  year: number;
  hour?: number;
  minute?: number;
  second?: number;
  period?: "AM" | "PM" | "24H";
  place: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone: number;
  ayanamsa: AyanamsaType;
  house_system: HouseSystemType;
  chart_style: ChartStyleType;
  language?: AstrologyLanguage;
}

export interface PlanetPosition {
  name: string;
  symbol: string;
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  degree_formatted: string;
  nakshatra: string;
  pada: number;
  house: number;
  is_retrograde: boolean;
}

export interface RashiTraits {
  element: string;
  modality: string;
  polarity: string;
  body_parts: string;
  nature: string;
  overview: string;
  strengths: string[];
  cautions_and_pitfalls: string[];
  beneficial_actions_and_remedies: string[];
  career_fields: string[];
  lucky_color: string;
  lucky_numbers: number[];
  lucky_gemstone: string;
  lucky_day: string;
  ruling_deity: string;
  compatible_rashis: string[];
}

export interface RashiCalculateResult {
  name: string;
  gender: string;
  birth_date_formatted: string;
  birth_time_formatted: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  timezone: number;
  ayanamsa_name: string;
  ayanamsa_degrees: number;

  rashi_index: number;
  rashi_name_en: string;
  rashi_name_hi: string;
  rashi_name_bn: string;
  rashi_symbol: string;
  rashi_lord: string;

  moon_sidereal_longitude: number;
  moon_degree_in_sign: number;
  moon_degree_formatted: string;

  nakshatra_index: number;
  nakshatra_name: string;
  nakshatra_pada: number;
  nakshatra_lord: string;
  kp_sub_lord: string;

  ascendant_longitude: number;
  ascendant_rashi_index: number;
  ascendant_rashi_name_en: string;
  ascendant_degree_formatted: string;

  traits: RashiTraits;
  planets: PlanetPosition[];
  house_system: string;
  chart_style: ChartStyleType;
  selected_language?: AstrologyLanguage;
  translations?: Record<string, any>;
}

export interface GeoSearchResult {
  display_name: string;
  latitude: number;
  longitude: number;
  timezone: number;
  country?: string;
  state?: string;
  city?: string;
}
