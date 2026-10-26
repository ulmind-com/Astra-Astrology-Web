/** Palm reading types. Mirrors app/schemas/palm_reading.py. */

export interface PalmReadingAvailability {
  enabled: boolean;
  coins_required: number;
  wallet_balance: number;
  can_afford: boolean;
  /** What makes a readable photo, stated before the camera opens. */
  requires: string[];
}

export interface PalmQualityCheck {
  name: string;
  passed: boolean;
  value: number;
  threshold: number;
  message: string;
}

export interface PalmCrease {
  name: string;
  /** The client's documents name the creases after elements. */
  elemental_name: string;
  found: boolean;
  strength: number;
  continuity: number;
  /** How far the traced path stands above the surrounding skin. */
  contrast: number;
  length: number;
  curvature: number;
  termination_zone: string | null;
  path: number[][];
  notes: string[];
}

export interface PalmReadingSection {
  feature: string;
  feature_label: string;
  option: string;
  label: string;
  meaning: string;
  area: string | null;
  /** Which client document the rule came from. */
  source: string | null;
  /** The measured values that satisfied the rule. */
  because: string[];
}

export interface PalmSkippedFeature {
  feature: string;
  feature_label: string;
  requirement: string;
  reason: string;
}

export interface PalmScanResponse {
  scan_id: string;
  status: "ok" | "rejected" | "error";
  message: string | null;
  hand_detected: boolean;
  handedness: string | null;
  quality_score: number;
  quality_checks: PalmQualityCheck[];
  hand_type: {
    type?: string;
    reason?: string;
    confidence?: number;
    palm_aspect?: number;
    finger_palm_ratio?: number;
  };
  measurements: Record<string, number>;
  measurement_details: Record<string, { key: string; value: number; description: string }>;
  creases: PalmCrease[];
  crease_relationships: Record<string, number>;
  sections: PalmReadingSection[];
  /** What the client's material covers but this photo could not support. */
  skipped: PalmSkippedFeature[];

  /** 3D world scan coordinates, mount elevations, and depth metrics */
  landmarks_3d?: number[][];
  world_landmarks_mm?: number[][];
  mount_elevations_3d?: Record<string, number>;
  palm_cup_depth_mm?: number;
  finger_flexibility_3d?: {
    dorsiflexion_deg?: number;
    is_spontaneous_flexible?: boolean;
    is_stiff_fingers?: boolean;
    saturn_sun_tilt_deg?: number;
    saturn_leaning_sun?: boolean;
    jupiter_thumb_angle_deg?: number;
    thumb_gap_wide?: boolean;
    [key: string]: unknown;
  };
  finger_inclinations_3d?: Record<string, number>;

  /** Astrological additions: Secondary lines, sacred marks, chronological timeline, skin vitality, karmic summary */
  secondary_lines?: Record<string, PalmCrease>;
  sacred_marks?: Array<{
    id: string;
    name: string;
    sanskrit_name: string;
    found: boolean;
    location_norm: number[];
    significance: string;
    rarity: string;
    auspicious: boolean;
  }>;
  timeline?: Array<{
    age: number;
    age_range: string;
    phase: string;
    primary_line: string;
    vitality_pct: number;
    focus: string;
    forecast: string;
    auspicious: boolean;
  }>;
  skin_vitality?: {
    flush_tone: string;
    ayurvedic_dosha: string;
    vitality_score: number;
    circulation_rating: string;
    temperament: string;
    rgb_ratios: Record<string, number>;
  };
  karmic_summary?: {
    hand: string;
    role: string;
    role_meaning: string;
    counterpart_role: string;
    karmic_harmony: string;
  };

  dermatoglyphic_loops?: DermatoglyphicLoop[];
  marriage_patterns?: MarriagePattern[];
  temperament_archetype?: TemperamentArchetype;
  medical_constitution?: MedicalConstitution;
  kundli_palm_sync?: KundliPalmSync;

  overlay_image: string | null;
  response_image: string | null;
  coins_charged: number;
  wallet_balance: number;
  processing_ms: number;
  warnings: string[];
  reading_id: string | null;
}

export interface DermatoglyphicLoop {
  id: string;
  name: string;
  sanskrit_name: string;
  category: string;
  found: boolean;
  confidence: number;
  location: string;
  meaning: string;
  source: string;
}

export interface MarriagePattern {
  card_id: number;
  image_ref: string;
  name: string;
  vedic_title: string;
  found: boolean;
  category: string;
  auspicious: boolean;
  description: string;
  remedy: string;
}

export interface TemperamentArchetype {
  primary_archetype: string;
  vedic_archetype_name: string;
  elemental_signature: string;
  affinity_score_pct: number;
  description: string;
  vedic_strengths: string[];
  growth_counsel: string;
  secondary_affinity?: {
    title: string;
    vedic_name: string;
    affinity_pct: number;
  };
  source: string;
}

export interface MedicalConstitution {
  pallor_diagnosis: {
    state: string;
    clinical_significance: string;
    constitutional_risk: string;
    ayurvedic_remedy: string;
  };
  neuro_serotonin_axis: {
    status: string;
    contributing_factors: string[];
    explanation: string;
    vedic_neuro_upaya: string;
  };
  organ_sensitivities: Array<{
    organ: string;
    marker: string;
    status: string;
    advice: string;
  }>;
  nail_mineral_diagnostics: Record<string, string>;
  source: string;
}

export interface KundliPalmSync {
  overall_alignment_pct: number;
  karmic_harmony_verdict: string;
  dominant_ruling_graha: string;
  master_remedy: string;
  planets: Array<{
    graha: string;
    english_name: string;
    palm_mount: string;
    elevation_mm: number;
    manifestation_potency: string;
    alignment_status: string;
    alignment_pct: number;
    gemstone_upaya: string;
    vedic_mantra: string;
  }>;
}

export interface PalmReadingRecord {
  id: string;
  hand: string;
  hand_type: Record<string, unknown>;
  sections: PalmReadingSection[];
  skipped: PalmSkippedFeature[];

  landmarks_3d?: number[][];
  world_landmarks_mm?: number[][];
  mount_elevations_3d?: Record<string, number>;
  palm_cup_depth_mm?: number;
  finger_flexibility_3d?: Record<string, unknown>;
  finger_inclinations_3d?: Record<string, number>;

  secondary_lines?: Record<string, PalmCrease>;
  sacred_marks?: Array<{
    id: string;
    name: string;
    sanskrit_name: string;
    found: boolean;
    location_norm: number[];
    significance: string;
    rarity: string;
    auspicious: boolean;
  }>;
  timeline?: Array<{
    age: number;
    age_range: string;
    phase: string;
    primary_line: string;
    vitality_pct: number;
    focus: string;
    forecast: string;
    auspicious: boolean;
  }>;
  skin_vitality?: {
    flush_tone: string;
    ayurvedic_dosha: string;
    vitality_score: number;
    circulation_rating: string;
    temperament: string;
    rgb_ratios: Record<string, number>;
  };
  karmic_summary?: {
    hand: string;
    role: string;
    role_meaning: string;
    counterpart_role: string;
    karmic_harmony: string;
  };

  dermatoglyphic_loops?: DermatoglyphicLoop[];
  marriage_patterns?: MarriagePattern[];
  temperament_archetype?: TemperamentArchetype;
  medical_constitution?: MedicalConstitution;
  kundli_palm_sync?: KundliPalmSync;

  overlay_image: string | null;
  coins_charged: number;
  quality_score: number;
  warnings: string[];
  created_at: string;
}

