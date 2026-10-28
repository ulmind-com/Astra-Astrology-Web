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
  /**
   * IANA zone name for the birth place, e.g. "Asia/Dhaka". When sent, the backend
   * resolves the exact offset at the birth instant, so daylight saving and
   * historical zone changes are handled and `timezone` is ignored.
   */
  timezone_name?: string | null;
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

export interface RashiPlanetaryDignity {
  exalted_planets: string[];
  debilitated_planets: string[];
  own_lord: string;
  moolatrikona: string;
  ruler_friends: string[];
  ruler_enemies: string[];
  ruler_neutrals: string[];
}

export interface ChandraBalaInfo {
  current_moon_sign_index: number;
  current_moon_sign_name: string;
  house_from_natal_moon: number;
  is_auspicious: boolean;
  status_label: string;
  description: string;
}

export interface SadeSatiStatus {
  is_active: boolean;
  phase_code: "rising" | "peak" | "setting" | "kantaka" | "ashtama" | "none" | string;
  phase_title: string;
  saturn_sign_index: number;
  saturn_sign_name: string;
  saturn_house_from_moon: number;
  impact_level: "high" | "medium" | "favorable" | string;
  description: string;
  remedy_summary: string;
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

  /** Rules traceable to the client's own resource documents, with citations. */
  client_rules?: ClientSignProfile | null;
  ascendant_client_rules?: ClientSignProfile | null;
  kp_reference?: KpReference;

  /** Extended Classical Precision Fields */
  avakahada_chakra?: AvakahadaChakra | null;
  namakshar?: string;
  navamsha_rashi_index?: number;
  navamsha_rashi_name_en?: string;
  navamsha_rashi_name_bn?: string;
  navamsha_rashi_name_hi?: string;
  is_vargottama?: boolean;
  planetary_dignity?: RashiPlanetaryDignity | null;
  chandra_lagna_planets?: PlanetPosition[];
  chandra_bala?: ChandraBalaInfo | null;
  sade_sati_status?: SadeSatiStatus | null;

  /** How the UTC offset used for this chart was arrived at. */
  timezone_resolution?: TimezoneResolution | null;
  /** The real house cusps for the selected house system. */
  house_cusps?: HouseCusp[];
  calculation?: CalculationMeta | null;
}

export interface GeoSearchResult {
  display_name: string;
  /** Short label for the place, e.g. "Dhaka". */
  place?: string;
  latitude: number;
  longitude: number;
  /** IANA zone name the coordinates fall in, e.g. "Asia/Dhaka". */
  timezone_name?: string | null;
  /** Offset in hours at the supplied birth date, or null when unknown. */
  timezone: number | null;
  /** Pre-formatted offset, e.g. "UTC+06:00". */
  timezone_label?: string | null;
  /** Zone abbreviation in force at that date, e.g. "IST", "BST". */
  timezone_abbreviation?: string | null;
  is_dst?: boolean;
  country?: string;
  state?: string;
  city?: string;
}

export interface TimezoneLookupResult {
  timezone_name: string | null;
  timezone: number | null;
  timezone_label?: string | null;
  timezone_abbreviation?: string | null;
  is_dst?: boolean;
  note?: string | null;
}

/** One classification group transcribed from a client resource document. */
export interface ClientRuleEntry {
  key: string;
  label: string;
  value: string;
  definition: string;
  /** Client file and page this group came from, e.g. "01.pdf p.10". */
  source: string;
  /** The client's own stated predictive use, where they gave one. */
  application?: string | null;
}

export interface GunaReading {
  source: string;
  value: string;
  note: string;
}

export interface DisputedGuna {
  readings: GunaReading[];
  is_disputed: boolean;
  notice?: string | null;
}

export interface ClientSignProfile {
  index: number;
  name_en: string;
  name_sa: string;
  name_bn: string;
  name_hi: string;
  lord: string;
  classifications: ClientRuleEntry[];
  guna: DisputedGuna;
  body_parts: string;
  places: string[];
  trait_keywords: string[];
  sources: string[];
}

export interface TimezoneResolution {
  offset_hours: number;
  offset_label: string;
  zone_name?: string | null;
  abbreviation?: string | null;
  /** "iana" when derived from the birth place, "manual" when supplied, "default" otherwise. */
  source: string;
  is_dst: boolean;
  note?: string | null;
}

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: string;
  sign_index: number;
  degree_in_sign: number;
  degree_formatted: string;
}

export interface CalculationMeta {
  engine: string;
  engine_version?: string | null;
  ephemeris: string;
  ayanamsa_key: string;
  house_system_key: string;
  node_type: string;
  julian_day_ut: number;
  warnings: string[];
}

export interface KpHouseSignification {
  house: number;
  signification: string;
}

export interface KpReference {
  basic_rules?: string[];
  house_significations?: KpHouseSignification[];
  source?: string;
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
  /** IANA zone name; lets the backend resolve the exact offset at the birth instant. */
  timezone_name?: string | null;
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

export interface GandantaInfo {
  is_gandanta: boolean;
  gandanta_type: string | null;
  junction_name_en: string | null;
  junction_name_bn: string | null;
  junction_name_hi: string | null;
  severity: string | null;
  description_en: string | null;
  description_bn: string | null;
  description_hi: string | null;
  remedies_en: string[];
  remedies_bn: string[];
  remedies_hi: string[];
}

export interface PushkaraInfo {
  is_pushkara_navamsha: boolean;
  is_pushkara_bhaga: boolean;
  navamsha_sign_en: string;
  navamsha_sign_bn: string;
  navamsha_sign_hi: string;
  pada_number: number;
  degree_in_sign: number;
  degree_in_sign_formatted: string;
  significance_en: string;
  significance_bn: string;
  significance_hi: string;
}

export interface DashaBalanceAtBirth {
  dasha_lord_en: string;
  dasha_lord_bn: string;
  dasha_lord_hi: string;
  total_cycle_years: number;
  balance_years: number;
  balance_months: number;
  balance_days: number;
  balance_formatted_en: string;
  balance_formatted_bn: string;
  balance_formatted_hi: string;
  elapsed_percentage: number;
  remaining_percentage: number;
}

export interface DailyTaraBalaInfo {
  current_moon_nakshatra_index: number;
  current_moon_nakshatra_name_en: string;
  current_moon_nakshatra_name_bn: string;
  current_moon_nakshatra_name_hi: string;
  tara_step: number;
  tara_name_en: string;
  tara_name_bn: string;
  tara_name_hi: string;
  is_auspicious: boolean;
  status_label_en: string;
  status_label_bn: string;
  status_label_hi: string;
  guidance_en: string;
  guidance_bn: string;
  guidance_hi: string;
}

export interface NakshatraDispositionInfo {
  disposition_en: string;
  disposition_bn: string;
  disposition_hi: string;
  gunas_en: string;
  gunas_bn: string;
  gunas_hi: string;
  caste_varna_en: string;
  caste_varna_bn: string;
  caste_varna_hi: string;
  gender_en: string;
  gender_bn: string;
  gender_hi: string;
  direction_en: string;
  direction_bn: string;
  direction_hi: string;
  sacred_bird_en: string;
  sacred_bird_bn: string;
  sacred_bird_hi: string;
  suitable_activities_en: string[];
  suitable_activities_bn: string[];
  suitable_activities_hi: string[];
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

  /** Panchang elements the client's own reference report lists. */
  panchang?: BirthPanchang | null;
  /** Computed, but it disagrees with the client's reference - see DisputedValue. */
  paya?: DisputedValue | null;
  /** Techniques from the client's nakshatra books, evaluated against this chart. */
  client_rules?: ClientNakshatraRules | null;
  /** Classifications for the Moon's rashi, from the client's 01.pdf. */
  rashi_client_rules?: ClientSignProfile | null;

  /** Classical Enhancements */
  gandanta?: GandantaInfo;
  pushkara?: PushkaraInfo;
  dasha_balance?: DashaBalanceAtBirth;
  daily_tara_bala?: DailyTaraBalaInfo;
  disposition?: NakshatraDispositionInfo;

  timezone_resolution?: TimezoneResolution | null;
  calculation?: CalculationMeta | null;

  planets?: PlanetPosition[];
  ascendant_longitude?: number | null;
  ascendant_rashi_name_en?: string | null;
  ascendant_nakshatra_name?: string | null;
}

export interface PanchangElement {
  index: number;
  name: string;
  name_en: string;
  percentage_elapsed?: number | null;
}

export interface TithiDetail extends PanchangElement {
  paksha: string;
  paksha_en: string;
}

export interface BirthPanchang {
  tithi: TithiDetail;
  yoga: PanchangElement;
  karana: PanchangElement;
  yunja: PanchangElement;
  sunrise?: string | null;
  sunset?: string | null;
}

/** A value we compute but cannot source, where our answer is known to be contested. */
export interface DisputedValue {
  value: string;
  is_disputed: boolean;
  notice?: string | null;
  evidence: string[];
}

export interface NakshatraTechnique {
  technique_no: number;
  theme: string;
  rule: string;
  /** Book and technique number, so it can be checked against the original. */
  source: string;
  /** Why this technique applies to this particular chart. */
  because: string[];
}

export interface NakshatraBookReference {
  lord: string;
  deity: string;
  symbol: string;
  padas: string;
  source: string;
}

export interface ClientNakshatraRules {
  nakshatra_index: number;
  nakshatra_name: string;
  /** False for Mula to Revati: the volume covering them was never supplied. */
  has_client_source: boolean;
  matched: NakshatraTechnique[];
  not_matched: NakshatraTechnique[];
  total_available: number;
  is_afflicted: boolean;
  affliction_reasons: string[];
  book_reference?: NakshatraBookReference | null;
  unavailable_note?: string | null;
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
  /** IANA zone name; lets the backend resolve the exact offset at the birth instant. */
  timezone_name?: string | null;
  ayanamsa?: AyanamsaType;
  house_system?: HouseSystemType;
  language?: AstrologyLanguage;
  horary_number?: number;
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
  is_lagna_star_retrograde?: boolean;
  is_moon_star_retrograde?: boolean;
  discarded_planets?: string[];
  fruitful_planets?: string[];
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
  sub_sub_lord?: string;
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
  sub_sub_lord?: string;
  rashi_house: number;
  bhav_house: number;
  is_retrograde: boolean;
  is_untenanted?: boolean;
}

export interface KPPlanetSignificator {
  planet: string;
  level_a: number[];
  level_b: number[];
  level_c: number[];
  level_d: number[];
  all_signified_houses: number[];
}

export interface KPHouseSignificator {
  house: number;
  level_a: string[];
  level_b: string[];
  level_c: string[];
  level_d: string[];
}

export interface KPEventAnalysisItem {
  category: string;
  title: string;
  primary_cusp: number;
  cuspal_sub_lord: string;
  csl_star_lord: string;
  csl_sub_lord: string;
  favorable_houses: number[];
  unfavorable_houses: number[];
  signified_houses: number[];
  promise_score: number;
  verdict: string;
  description: string;
  timing_hint: string;
}

export interface KPAspectItem {
  planet_1: string;
  planet_2: string;
  aspect_name: string;
  aspect_symbol: string;
  angle_degrees: number;
  orb_degrees: number;
  nature: string;
  significance: string;
}

export interface KPBadhakaMarakaInfo {
  ascendant_type: string;
  badhaka_house: number;
  badhaka_sign: string;
  badhaka_lord: string;
  maraka_houses: number[];
  maraka_lords: string[];
  badhaka_planets: string[];
  maraka_planets: string[];
  notes: string;
}

export interface KPHoraryInfo {
  horary_number: number;
  sub_start_degree: number;
  sub_end_degree: number;
  sub_span_formatted: string;
  sign: string;
  sign_lord: string;
  star_lord: string;
  sub_lord: string;
  sub_sub_lord: string;
}

export interface KPRemedyItem {
  planet: string;
  house_involved: number;
  problem: string;
  lal_kitab_upaya: string;
  vedic_mantra: string;
  charity_recommendation: string;
}

export interface KPDashaInsight {
  overview: string;
  career_and_wealth: string;
  favorable_actions: string[];
  cautions_and_pitfalls: string[];
  remedies: string[];
  lucky_day: string;
  lucky_color: string;
  deity: string;
  beej_mantra: string;
  gayatri_mantra: string;
}

export interface KPDashaPeriod {
  lord: string;
  level: number;
  start_date: string;
  end_date: string;
  duration: string;
  is_current: boolean;
  start_time?: string;
  end_time?: string;
  insight?: KPDashaInsight;
  sub_periods?: KPDashaPeriod[];
}

export interface CurrentRunningDashaInfo {
  mahadasha: string;
  antardasha: string;
  pratyantardasha: string;
  sookshma_dasha?: string;
  pran_dasha?: string;
  active_path?: string;
  md_start?: string;
  md_end?: string;
  ad_start?: string;
  ad_end?: string;
  pd_start?: string;
  pd_end?: string;
  sd_start?: string;
  sd_end?: string;
  pran_start?: string;
  pran_end?: string;
  remaining_days_ad?: number;
  remaining_days_md?: number;
  percentage_completed_ad?: number;
  percentage_completed_md?: number;
  sookshma_periods?: KPDashaPeriod[];
  pran_periods?: KPDashaPeriod[];
}

export interface DashaSandhiChidraInfo {
  is_in_chidra_dasha: boolean;
  is_in_dasha_sandhi: boolean;
  chidra_message: string;
  sandhi_message: string;
  current_md_lord: string;
  next_md_lord: string;
  transition_date: string;
  days_to_transition: number;
  alert_severity: "none" | "warning" | "critical";
  precautions: string[];
  remedial_measures: string[];
}

export interface PersonalizedDashaPhalaItem {
  planet: string;
  lagna: string;
  functional_nature: string;
  houses_owned: number[];
  house_placed: number;
  sign_placed: string;
  dignity: string;
  is_retrograde: boolean;
  favorability_score: number;
  overall_impact: string;
  career_impact: string;
  wealth_impact: string;
  relationship_impact: string;
  health_impact: string;
  gemstone_warning: string;
  recommended_remedy: string;
}

export interface YoginiPeriodItem {
  name: string;
  ruler_planet: string;
  duration_years: number;
  start_date: string;
  end_date: string;
  is_current: boolean;
  nature: string;
  significance: string;
  sub_periods?: YoginiPeriodItem[];
}

export interface YoginiDashaSystem {
  birth_nakshatra: string;
  starting_yogini: string;
  balance_str: string;
  current_yogini: string;
  current_sub_yogini: string;
  current_cycle_number: number;
  periods: YoginiPeriodItem[];
  verdict: string;
}

export interface DashaTransitSynergy {
  md_lord: string;
  md_transit_sign: string;
  md_transit_house_from_moon: number;
  md_transit_nature: string;
  ad_lord: string;
  ad_transit_sign: string;
  ad_transit_house_from_moon: number;
  ad_transit_nature: string;
  sade_sati_active: boolean;
  sade_sati_phase: string;
  sade_sati_description: string;
  synergy_verdict: string;
  synergy_score: number;
}

export interface DashaTimelineSegment {
  lord: string;
  start_date: string;
  end_date: string;
  age_start: number;
  age_end: number;
  duration_years: number;
  nature: "favorable" | "neutral" | "challenging";
  favorability_score: number;
  theme: string;
  is_current: boolean;
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

  untenanted_planets?: string[];
  planet_significators?: KPPlanetSignificator[];
  house_significators?: KPHouseSignificator[];
  life_events?: KPEventAnalysisItem[];
  aspects?: KPAspectItem[];
  badhaka_maraka?: KPBadhakaMarakaInfo;
  horary_details?: KPHoraryInfo;
  remedies?: KPRemedyItem[];

  // Advanced Dasha Capabilities
  current_running_dasha?: CurrentRunningDashaInfo;
  dasha_sandhi_chidra?: DashaSandhiChidraInfo;
  personalized_dasha_phala?: PersonalizedDashaPhalaItem[];
  yogini_dasha?: YoginiDashaSystem;
  dasha_transit_synergy?: DashaTransitSynergy;
  dasha_life_timeline?: DashaTimelineSegment[];

  selected_language: AstrologyLanguage;
  translations: Record<string, any>;
}

// =============================================================================
// Kundli & Planetary Position Types
// =============================================================================

export interface KundliCalculatePayload {
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
  timezone_name?: string | null;
  ayanamsa?: AyanamsaType;
  house_system?: HouseSystemType;
  chart_style?: ChartStyleType;
  language?: AstrologyLanguage;
}

export interface KundliPersonalDetails {
  name: string;
  gender: string;
  date_of_birth: string;
  time_of_birth: string;
  day: string;
  vedic_day: string;
}

export interface KundliAstronomicalInfo {
  julian_day: number;
  ayan_type: string;
  house_system: string;
  place: string;
  longitude_formatted: string;
  latitude_formatted: string;
}

export interface KundliAstroPositions {
  asc_lord: string;
  asc: string;
  yoga: string;
  tithi: string;
  sunset: string;
  sunrise: string;
}

export interface KundliPlanetaryInfo {
  bal_dasa: string;
  karan: string;
  nakshatra_lord: string;
  nakshatra: string;
  rasi_lord: string;
  rasi: string;
}

export interface KundliChartPlanet {
  name: string;
  symbol: string;
  code: string;
  degree: number;
  sign_num: number;
  house_num: number;
  d9_sign_num: number;
  d9_house_num: number;
  is_retrograde: boolean;
}

export interface KundliTableRow {
  name: string;
  longitude_formatted: string;
  sign: string;
  nakshatra: string;
  nakshatra_lord: string;
  pada: number;
  sub_lord: string;
  full_degree_formatted: string;
}

export interface KundliDashaAntar {
  lord: string;
  duration: string;
  end_date: string;
}

export interface KundliDashaCard {
  title: string;
  lord: string;
  years: number;
  antardashas: KundliDashaAntar[];
}

export interface KundliYogaItem {
  name: string;
  is_present: boolean;
  description: string;
  auspicious: boolean;
}

export interface KundliActiveYogaDetail {
  name: string;
  description: string;
  effects: string;
}

export interface PlanetaryDignityItem {
  planet: string;
  planet_bn: string;
  planet_hi: string;
  sign: string;
  sign_bn: string;
  house: number;
  degree: number;
  degree_formatted: string;
  dignity: string;
  dignity_bn: string;
  dignity_hi: string;
  is_combust: boolean;
  is_retrograde: boolean;
  avastha: string;
  avastha_bn: string;
  avastha_hi: string;
  neechabhanga: boolean;
  neechabhanga_reason?: string | null;
}

export interface HousePredictionItem {
  house_number: number;
  house_name: string;
  house_name_bn: string;
  house_name_hi: string;
  sign: string;
  sign_bn: string;
  sign_lord: string;
  sign_lord_bn: string;
  lord_placement_house: number;
  occupants: string[];
  occupants_bn: string[];
  overview: string;
  overview_bn: string;
  overview_hi: string;
  career_wealth_effect: string;
  career_wealth_effect_bn: string;
  career_wealth_effect_hi: string;
  relationship_family_effect: string;
  relationship_family_effect_bn: string;
  relationship_family_effect_hi: string;
}

export interface ExtendedYogaItem {
  name: string;
  name_bn: string;
  name_hi: string;
  category: string;
  category_bn: string;
  is_present: boolean;
  description: string;
  description_bn: string;
  description_hi: string;
  effects: string;
  effects_bn: string;
  effects_hi: string;
}

export interface DoshaAnalysisItem {
  dosha_name: string;
  dosha_name_bn: string;
  dosha_name_hi: string;
  is_present: boolean;
  severity: string;
  severity_bn: string;
  specific_type?: string | null;
  specific_type_bn?: string | null;
  cancellation_reason?: string | null;
  cancellation_reason_bn?: string | null;
  remedy: string;
  remedy_bn: string;
  remedy_hi: string;
}

export interface GemstoneItem {
  category: string;
  category_bn: string;
  stone_name: string;
  stone_name_bn: string;
  stone_name_hi: string;
  sanskrit_name: string;
  ruling_planet: string;
  ruling_planet_bn: string;
  metal: string;
  metal_bn: string;
  finger: string;
  finger_bn: string;
  wearing_day: string;
  wearing_day_bn: string;
  beej_mantra: string;
  benefit: string;
  benefit_bn: string;
}

export interface PersonalRemedies {
  life_stone: GemstoneItem;
  lucky_stone: GemstoneItem;
  career_stone: GemstoneItem;
  rudraksha_recommendation: string;
  rudraksha_recommendation_bn: string;
  rudraksha_recommendation_hi: string;
  ishta_devata: string;
  ishta_devata_bn: string;
  ishta_devata_hi: string;
  lucky_colors: string[];
  lucky_colors_bn: string[];
  lucky_numbers: number[];
  favorable_direction: string;
  favorable_direction_bn: string;
}

export interface CurrentDashaInfo {
  mahadasha_lord: string;
  mahadasha_lord_bn: string;
  antardasha_lord: string;
  antardasha_lord_bn: string;
  start_date: string;
  end_date: string;
  verdict: string;
  verdict_bn: string;
  verdict_hi: string;
  guidance: string;
  guidance_bn: string;
  guidance_hi: string;
}

export interface KundliCalculateResult {
  personal_details: KundliPersonalDetails;
  astronomical_info: KundliAstronomicalInfo;
  astro_positions: KundliAstroPositions;
  planetary_info: KundliPlanetaryInfo;

  d1_planets: KundliChartPlanet[];
  d9_planets: KundliChartPlanet[];
  d1_asc_sign: number;
  d9_asc_sign: number;

  d10_planets?: KundliChartPlanet[];
  d10_asc_sign?: number;
  d7_planets?: KundliChartPlanet[];
  d7_asc_sign?: number;

  planets_table: KundliTableRow[];
  houses_table: KundliTableRow[];
  dashas_grid: KundliDashaCard[];

  yogas_status: KundliYogaItem[];
  active_yogas_details: KundliActiveYogaDetail[];

  planetary_dignities?: PlanetaryDignityItem[];
  house_predictions?: HousePredictionItem[];
  extended_yogas?: ExtendedYogaItem[];
  doshas_analysis?: DoshaAnalysisItem[];
  remedies?: PersonalRemedies;
  current_dasha?: CurrentDashaInfo;

  selected_language: AstrologyLanguage;
  translations?: Record<string, any>;
}

// ---------------------------------------------------------------- Kundli Matching
export interface KundliMatchingPersonInput {
  name: string;
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
  /** IANA zone name; lets the backend resolve the exact offset at the birth instant. */
  timezone_name?: string | null;
  ayanamsa?: AyanamsaType;
  house_system?: HouseSystemType;
}

export interface KundliMatchingPayload {
  groom: KundliMatchingPersonInput;
  bride: KundliMatchingPersonInput;
  language?: AstrologyLanguage;
}

export interface KundliMatchingPersonProfile {
  name: string;
  birth_date_time: string;
  birth_place: string;
  janam_rasi: string;
  rasi_lord: string;
  janam_nakshatra: string;
  nakshatra_lord: string;
  pada: number;
  is_manglik: boolean;
  manglik_status_text: string;
  d1_planets: KundliChartPlanet[];
  d1_asc_sign: number;
  planets_table: KundliTableRow[];
}

export interface KundliMatchingKoota {
  attribute: string;
  male: string;
  female: string;
  out_of: number;
  received: number;
  area_of_life: string;
  description: string;
}

export interface KundliMatchingDoshas {
  ashtakoot_score: number;
  ashtakoot_total: number;
  rajjoo_dosha: boolean;
  rajjoo_text: string;
  vedha_dosha: boolean;
  vedha_text: string;
  manglik_match: boolean;
  manglik_match_text: string;
  boy_manglik_text: string;
  girl_manglik_text: string;
  verdict_summary: string;
}

export interface MarriageLifeForecast {
  ideal_marriage_age_groom: string;
  ideal_marriage_age_bride: string;
  auspicious_marriage_years: number[];
  auspicious_marriage_years_text: string;
  marital_harmony_score: number;
  marital_harmony_verdict: string;
  marital_harmony_description: string;
  children_progeny_score: number;
  children_progeny_verdict: string;
  children_progeny_description: string;
  conflict_friction_score: number;
  conflict_friction_verdict: string;
  conflict_friction_description: string;
  financial_prosperity_score: number;
  financial_prosperity_verdict: string;
  financial_prosperity_description: string;
  future_longevity_score: number;
  future_longevity_verdict: string;
  future_longevity_description: string;
  remedies_guidance: string[];
}

export interface AvakahadaAttributeItem {
  attribute: string;
  male: string;
  female: string;
  description?: string;
}

export interface DashakootItem {
  attribute: string;
  male: string;
  female: string;
  out_of: number;
  received: number;
  description?: string;
  status?: string;
}

export interface DashakootResult {
  items: DashakootItem[];
  total_received: number;
  total_out_of: number;
  porutham_count: number;
  is_favorable: boolean;
  verdict: string;
}

export interface DoshaCancellationInfo {
  dosha_name: string;
  is_present: boolean;
  is_cancelled: boolean;
  cancellation_reason: string;
  shastra_citation: string;
  severity: string;
  remedy: string;
}

export interface RajjuDoshaDetail {
  is_present: boolean;
  rajju_type: string;
  body_part: string;
  classical_impact: string;
  male_rajju: string;
  female_rajju: string;
  remedy: string;
}

export interface PapasamyaPlanetDetail {
  planet: string;
  house_from_lagna?: number | null;
  house_from_moon?: number | null;
  house_from_venus?: number | null;
  points: number;
}

export interface PapasamyaPersonScore {
  total_points: number;
  lagna_points: number;
  moon_points: number;
  venus_points: number;
  details: PapasamyaPlanetDetail[];
}

export interface PapasamyaResult {
  groom_score: PapasamyaPersonScore;
  bride_score: PapasamyaPersonScore;
  difference: number;
  is_balanced: boolean;
  verdict: string;
  description: string;
}

export interface PersonalityTraitReport {
  groom_positive_traits: string[];
  groom_negative_traits: string[];
  groom_summary: string;
  bride_positive_traits: string[];
  bride_negative_traits: string[];
  bride_summary: string;
  compatibility_summary: string;
}

export interface DashaPeriodItem {
  level: string;
  planet: string;
  start_date: string;
  end_date: string;
}

export interface PersonDashaOverview {
  current_mahadasha: string;
  current_antardasha: string;
  current_pratyantardasha: string;
  dasha_sequence: DashaPeriodItem[];
}

export interface DashaComparisonResult {
  groom_dasha: PersonDashaOverview;
  bride_dasha: PersonDashaOverview;
  dasha_sandhi_present: boolean;
  dasha_compatibility_verdict: string;
  dasha_compatibility_description: string;
}

export interface ChartPlanetSet {
  d1_planets: KundliChartPlanet[];
  d9_planets: KundliChartPlanet[];
  chalit_planets: KundliChartPlanet[];
  moon_chart_planets: KundliChartPlanet[];
  d1_asc_sign: number;
  d9_asc_sign: number;
  chalit_asc_sign: number;
  moon_chart_asc_sign: number;
}

export interface KundliMatchingResult {
  groom: KundliMatchingPersonProfile;
  bride: KundliMatchingPersonProfile;
  doshas: KundliMatchingDoshas;
  kootas: KundliMatchingKoota[];
  total_received: number;
  total_out_of: number;
  is_compatible: boolean;
  verdict: string;
  selected_language: AstrologyLanguage;
  translations?: Record<string, any>;
  forecast?: MarriageLifeForecast | null;
  dashakoot?: DashakootResult | null;
  avakahada_comparison?: AvakahadaAttributeItem[];
  cancellations?: DoshaCancellationInfo[];
  rajju_detail?: RajjuDoshaDetail | null;
  papasamya?: PapasamyaResult | null;
  personality?: PersonalityTraitReport | null;
  dasha_comparison?: DashaComparisonResult | null;
  groom_charts?: ChartPlanetSet | null;
  bride_charts?: ChartPlanetSet | null;
  manglik_detail?: Record<string, any>;
  classical_recommendation?: string;
}


export interface DailyHoroscopePayload {
  date?: string | null;
  sign?: string | null;
  language?: AstrologyLanguage;
  latitude?: number;
  longitude?: number;
  timezone?: number;
  birth_nakshatra_index?: number | null;
  birth_date?: string | null;
  birth_time?: string | null;
  birth_rashi_index?: number | null;
  birth_lagna_index?: number | null;
}

export interface ChoghadiyaItem {
  period_index: number;
  is_day: boolean;
  name: string;
  name_bn: string;
  name_hi: string;
  ruler_planet: string;
  start_time: string;
  end_time: string;
  status: string;
  guidance: string;
  guidance_bn: string;
  guidance_hi: string;
}

export interface PanchakStatus {
  is_panchak: boolean;
  panchak_type: string;
  panchak_type_bn: string;
  panchak_type_hi: string;
  severity: string;
  description: string;
  description_bn: string;
  description_hi: string;
  prohibited_activities: string[];
}

export interface PlanetaryDrishtiItem {
  aspecting_planet: string;
  aspect_type: string;
  yoga_name: string;
  yoga_name_bn: string;
  yoga_name_hi: string;
  is_positive: boolean;
  impact: string;
  impact_bn: string;
  impact_hi: string;
  classical_remedy: string;
  classical_remedy_bn: string;
  classical_remedy_hi: string;
}

export interface AshtakavargaTransitPoints {
  sign_index: number;
  sarvashtakavarga_points: number;
  moon_bhinnashtakavarga_points: number;
  strength_grade: string;
  strength_grade_bn: string;
  strength_grade_hi: string;
  score_multiplier: number;
}

export interface NumerologyDailySynergy {
  mulank: number;
  bhagyank: number;
  ruling_planet: string;
  day_relationship: string;
  day_relationship_bn: string;
  day_relationship_hi: string;
  synergy_score_pct: number;
  advice: string;
  advice_bn: string;
  advice_hi: string;
}

export interface BiorhythmHour {
  hour: number;
  time_label: string;
  energy_score: number;
  dominant_graha: string;
  status: string;
  status_bn: string;
  status_hi: string;
}

export interface DualTransitInsight {
  moon_transit_house: number;
  lagna_transit_house: number;
  lagna_sign_name: string;
  emotional_outlook: string;
  emotional_outlook_bn: string;
  emotional_outlook_hi: string;
  physical_event_outlook: string;
  physical_event_outlook_bn: string;
  physical_event_outlook_hi: string;
  synthesis_verdict: string;
  synthesis_verdict_bn: string;
  synthesis_verdict_hi: string;
  dual_harmony_score: number;
}

export interface HoraItem {
  hora_index: number;
  hora_number: number;
  is_day: boolean;
  start_time: string;
  end_time: string;
  planet: string;
  planet_bn: string;
  planet_hi: string;
  planet_sa: string;
  is_auspicious: boolean;
  category: string;
  category_bn: string;
  category_hi: string;
  verdict: string;
  verdict_bn?: string;
  verdict_hi?: string;
  best_activities: string;
  best_activities_bn: string;
  best_activities_hi: string;
}

export interface TaraBalaSummary {
  tara_index: number;
  tara_name: string;
  tara_name_bn: string;
  tara_name_hi: string;
  is_auspicious: boolean;
  score_percent: number;
  verdict: string;
  verdict_bn: string;
  verdict_hi: string;
  guidance: string;
  guidance_bn: string;
  guidance_hi: string;
}

export interface PersonalizedNakshatraProfile {
  birth_nakshatra_index: number;
  birth_nakshatra_name: string;
  birth_nakshatra_name_bn: string;
  birth_nakshatra_name_hi: string;
  birth_nakshatra_lord: string;
  birth_nakshatra_deity: string;
  sacred_tree: string;
  beej_mantra: string;
  tara_bala: TaraBalaSummary;
}

export interface DailySignHoroscope {
  sign_index: number;
  sign_name: string;
  sign_name_sanskrit: string;
  symbol: string;
  transit_house: number;
  transit_house_name: string;
  gochar_verdict: string;
  overall_score: number;
  career_score: number;
  love_score: number;
  finance_score: number;
  health_score: number;
  summary: string;
  career_prediction: string;
  love_prediction: string;
  finance_prediction: string;
  health_prediction: string;
  lucky_number: number;
  lucky_color: string;
  lucky_time: string;
  remedy: string;
  favorable_direction: string;
  // Classical Vedic expansions
  is_chandrashtama?: boolean;
  chandrashtama_advice?: string | null;
  vedha_active?: boolean;
  vedha_planet?: string | null;
  vedha_description?: string | null;
  sade_sati_status?: string | null;
  guru_gochar_verdict?: string | null;
  beej_mantra?: string;
  charity_dana?: string;
  tara_bala?: TaraBalaSummary | null;
  ashtakavarga?: AshtakavargaTransitPoints | null;
  client_classifications?: Record<string, any>;
  nakshatra_pada_shift?: Record<string, any>;
  planetary_drishtis?: PlanetaryDrishtiItem[];
}

export interface DailyPanchangSummary {
  tithi: string;
  paksha: string;
  nakshatra: string;
  nakshatra_pada: number;
  yoga: string;
  karana: string;
  vara: string;
  sunrise: string;
  sunset: string;
  abhijit_muhurat: string;
  rahu_kaal: string;
  disha_shoola?: string;
  disha_remedy?: string;
  favorable_chandra_rashis?: string[];
  horas?: HoraItem[];
  choghadiya?: ChoghadiyaItem[];
  panchak?: PanchakStatus | null;
}

export interface DailyHoroscopeResult {
  date: string;
  day_of_week: string;
  vara_lord: string;
  moon_sign: string;
  moon_sign_sanskrit: string;
  moon_degree: string;
  sun_sign: string;
  panchang: DailyPanchangSummary;
  signs: DailySignHoroscope[];
  personalized_profile?: PersonalizedNakshatraProfile | null;
  numerology_synergy?: NumerologyDailySynergy | null;
  biorhythm_timeline?: BiorhythmHour[];
  dual_transit?: DualTransitInsight | null;
  calculation_meta: {
    engine: string;
    ayanamsha: string;
    calculation_method: string;
    precision: string;
    observer_coordinates: string;
  };
}

export interface FeaturePricingItem {
  feature_id: string;
  name: string;
  name_bn?: string;
  description: string;
  coins: number;
  is_free: boolean;
  enabled: boolean;
}

export type FeaturePricingMap = Record<string, FeaturePricingItem>;






