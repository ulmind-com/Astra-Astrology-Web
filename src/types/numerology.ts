/** TypeScript interfaces for Vedic, Chaldean, Name, and Mobile Numerology. */

export interface MulankProfile {
  number: number;
  planet: string;
  planet_hi: string;
  deity: string;
  metal: string;
  colors: string[];
  unlucky_colors: string[];
  direction: string;
  lucky_numbers: number[];
  unlucky_numbers: number[];
  beej_mantra: string;
  jap_count: number;
  gemstone: string;
  lucky_days: string[];
  lucky_months: string[];
  grains_daan: string;
  health_traits: string;
  profession: string;
}

export interface BhagyankProfile {
  number: number;
  planet: string;
  life_path_summary: string;
  strengths: string[];
  karmic_lessons: string;
}

export interface LoShuGridCell {
  digit: number;
  count: number;
  element: string;
  direction: string;
  meaning: string;
}

export interface LoShuPlane {
  name: string;
  digits: number[];
  present_digits: number[];
  status: "Complete" | "Partial" | "Missing";
  percentage: number;
  significance: string;
}

export interface MissingNumberRemedy {
  digit: number;
  element: string;
  impact: string;
  remedy: string;
  rudraksha: string;
  crystal: string;
}

export interface DigitRepetitionItem {
  digit: number;
  count: number;
  effect: string;
}

export interface RajYogaItem {
  name: string;
  digits: number[];
  is_active: boolean;
  description: string;
}

export interface NumerologyDashaPeriod {
  level: string;
  planet: string;
  number: number;
  start_date: string;
  end_date: string;
  duration_days: number;
  friendship_score: "Favorable" | "Neutral" | "Unfavorable";
  guidance: string;
}

export interface LetterSoundProfile {
  letter: string;
  value: number;
  sound_element: string;
  personality_vibration: string;
  health_tendency: string;
  direction_affinity: string;
}

export interface NameAnalysisResponse {
  full_name: string;
  chaldean_total: number;
  single_number: number;
  compound_number: number;
  compound_name: string;
  compound_description: string;
  is_favorable_compound: boolean;
  letters: LetterSoundProfile[];
  negative_syllables_found: string[];
  first_letter_vibration: string;
  harmony_with_mulank: string;
  harmony_with_bhagyank: string;
  overall_name_verdict: string;
  recommendation: string;
}

export interface MobileConjunctionPair {
  pair: string;
  first_digit: number;
  second_digit: number;
  dominance_formula: string;
  category: "Good" | "Neutral" | "Malefic";
  manifestation: string;
  dob_resonance: boolean;
}

export interface MobileLShape {
  corner_digit: number;
  arm_digits: number[];
  shape_code: string;
  meaning: string;
}

export interface MobileAnalysisResponse {
  mobile_number: string;
  total_sum: number;
  single_digit: number;
  compound_number: number;
  compound_quality: string;
  mulank_compatibility: string;
  bhagyank_compatibility: string;
  is_recommended: boolean;
  digit_repetitions: DigitRepetitionItem[];
  conjunction_pairs: MobileConjunctionPair[];
  sepharial_grid: Record<string, number>;
  l_shapes_formed: MobileLShape[];
  remedial_injections: string[];
  profession_affinity: string[];
  warnings_avoid: string[];
  overall_verdict: string;
}

export interface NumerologyCalculateRequest {
  full_name: string;
  birth_date: string;
  gender?: "male" | "female" | "other";
  mobile_number?: string;
  prediction_year?: number;
}

export interface NumerologyCalculateResponse {
  name: string;
  birth_date: string;
  mulank: MulankProfile;
  bhagyank: BhagyankProfile;
  kua_number: number;
  year_prediction_number: number;
  year_prediction_summary: string;
  lo_shu_grid: LoShuGridCell[];
  planes: LoShuPlane[];
  raj_yogas: RajYogaItem[];
  digit_repetitions: DigitRepetitionItem[];
  missing_numbers_remedies: MissingNumberRemedy[];
  dasha_timeline: NumerologyDashaPeriod[];
  name_analysis: NameAnalysisResponse;
  mobile_analysis: MobileAnalysisResponse | null;
}

export interface NameCorrectionRequest {
  name: string;
  mulank?: number;
  bhagyank?: number;
  target_compound?: number;
}

export interface NameCorrectionSuggestion {
  suggested_spelling: string;
  added_letters: string[];
  new_compound: number;
  new_single_digit: number;
  compound_title: string;
  compound_quality: string;
  sound_harmony: string;
  why_auspicious: string;
}

export interface NameCorrectionResponse {
  original_name: string;
  original_compound: number;
  original_quality: string;
  negative_syllables: string[];
  suggestions: NameCorrectionSuggestion[];
  general_guidance: string;
}

export interface MobileCompareRequest {
  numbers: string[];
  mulank?: number;
  bhagyank?: number;
  profession?: string;
  birth_date?: string;
}

export interface MobileComparisonItem {
  mobile_number: string;
  single_digit: number;
  compound_number: number;
  compound_quality: string;
  compatibility_score: number;
  grade: string;
  positive_pairs: string[];
  negative_pairs: string[];
  profession_match: boolean;
  verdict_bn: string;
}

export interface MobileCompareResponse {
  best_number: string;
  items: MobileComparisonItem[];
  recommendations_bn: string[];
}

export interface BusinessNumerologyRequest {
  brand_name: string;
  industry: string;
  owner_mulank?: number;
  owner_bhagyank?: number;
}

export interface BusinessNumerologyResponse {
  brand_name: string;
  industry: string;
  chaldean_compound: number;
  single_digit: number;
  compound_meaning: string;
  industry_suitability: string;
  industry_fit_score: number;
  owner_harmony_score: number;
  favorable_business_numbers: number[];
  actionable_recommendations: string[];
}

export interface VehicleBankAuditRequest {
  audit_type?: "vehicle" | "bank";
  input_string: string;
  mulank?: number;
  bhagyank?: number;
}

export interface VehicleBankAuditResponse {
  input_string: string;
  audit_type: "vehicle" | "bank";
  extracted_digits: string;
  total_sum: number;
  single_digit: number;
  compound_number: number;
  compound_quality: string;
  safety_rating: string;
  risk_alert: string | null;
  remedy_bn: string;
}

