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

// =============================================================================
// Nakshatra (Birth Star) Types
// =============================================================================

export interface NakshatraCalculatePayload {
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
  language?: AstrologyLanguage;
}

export interface AvakahadaChakra {
  gana: string;
  yoni: string;
  yoni_animal: string;
  nadi: string;
  varna: string;
  vashya: string;
  tatva: string;
  paya: string;
}

export interface NakshatraPadaDetail {
  pada: number;
  rashi_index: number;
  rashi_name_en: string;
  rashi_name_bn: string;
  rashi_name_hi: string;
  navamsha_sign: string;
  namakshar: string;
  namakshar_en: string;
  namakshar_bn: string;
  namakshar_hi: string;
  is_native_pada: boolean;
}

export interface TarabalaItem {
  tara_index: number;
  tara_name: string;
  tara_name_bn: string;
  tara_name_hi: string;
  is_auspicious: boolean;
  significance: string;
  nakshatras: string[];
}

export interface NakshatraTraits {
  overview: string;
  strengths: string[];
  cautions_and_pitfalls: string[];
  beneficial_actions_and_remedies: string[];
  career_fields: string[];
  lucky_color: string;
  lucky_numbers: number[];
  lucky_gemstone: string;
  ruling_deity: string;
  symbol: string;
  sacred_tree: string;
  beej_mantra: string;
}

export interface NakshatraCalculateResult {
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

  nakshatra_index: number;
  nakshatra_name_en: string;
  nakshatra_name_bn: string;
  nakshatra_name_hi: string;
  pada: number;
  star_lord: string;
  kp_sub_lord: string;

  moon_sidereal_longitude: number;
  moon_degree_in_nakshatra: number;
  moon_degree_in_nakshatra_formatted: string;
  moon_degree_in_pada: number;
  moon_degree_in_pada_formatted: string;
  nakshatra_elapsed_percentage: number;

  rashi_index: number;
  rashi_name_en: string;
  rashi_name_bn: string;
  rashi_name_hi: string;
  rashi_lord: string;

  symbol: string;
  deity: string;
  sacred_tree: string;
  beej_mantra: string;
  current_namakshar: string;

  avakahada: AvakahadaChakra;
  padas: NakshatraPadaDetail[];
  tarabala: TarabalaItem[];
  traits: NakshatraTraits;

  selected_language: AstrologyLanguage;
  translations: Record<string, any>;
}

// =============================================================================
// KP Astrology (Krishnamurti Paddhati) Types
// =============================================================================

export interface KPCalculatePayload {
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
  ayanamsa?: AyanamsaType;
  house_system?: HouseSystemType;
  language?: AstrologyLanguage;
}

export interface KPPanchang {
  julian_day: number;
  ayanamsa_name: string;
  ayanamsa_degrees: number;
  house_system: string;
  sunrise: string;
  sunset: string;
  tithi: string;
  yoga: string;
  karana: string;
  day_name: string;
  vedic_day_name: string;
  balance_dasha: string;
  ascendant_sign: string;
  ascendant_lord: string;
  ascendant_degree: number;
  ascendant_degree_formatted: string;
  moon_rashi: string;
  moon_rashi_lord: string;
  moon_nakshatra: string;
  moon_nakshatra_lord: string;
  moon_degree_formatted: string;
}

export interface KPRulingPlanets {
  lagna_rashi_lord: string;
  lagna_nakshatra_lord: string;
  lagna_sub_lord: string;
  moon_rashi_lord: string;
  moon_nakshatra_lord: string;
  moon_sub_lord: string;
  day_lord: string;
  date_formatted: string;
  time_formatted: string;
}

export interface KPCuspDetail {
  cusp: number;
  longitude: number;
  degree_formatted: string;
  sign: string;
  sign_index: number;
  sign_lord: string;
  star_lord: string;
  sub_lord: string;
}

export interface KPPlanetDetail {
  name: string;
  symbol: string;
  code: string;
  longitude: number;
  degree_in_sign: number;
  degree_formatted: string;
  sign: string;
  sign_index: number;
  nakshatra: string;
  pada: number;
  sign_lord: string;
  star_lord: string;
  sub_lord: string;
  rashi_house: number;
  bhav_house: number;
  is_retrograde: boolean;
}

export interface KPDashaPeriod {
  lord: string;
  level: number;
  start_date: string;
  end_date: string;
  duration: string;
  is_current: boolean;
  sub_periods?: KPDashaPeriod[];
}

export interface KPCalculateResult {
  name: string;
  gender: string;
  birth_date_formatted: string;
  birth_time_formatted: string;
  birth_place: string;
  latitude: number;
  longitude: number;
  timezone: number;

  panchang: KPPanchang;
  ruling_planets_dob: KPRulingPlanets;
  ruling_planets_casting: KPRulingPlanets;
  cusps: KPCuspDetail[];
  planets: KPPlanetDetail[];
  dashas: KPDashaPeriod[];

  selected_language: AstrologyLanguage;
  translations: Record<string, any>;
}


