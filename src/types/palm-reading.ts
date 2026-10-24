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

  overlay_image: string | null;
  response_image: string | null;
  coins_charged: number;
  wallet_balance: number;
  processing_ms: number;
  warnings: string[];
  reading_id: string | null;
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

  overlay_image: string | null;
  coins_charged: number;
  quality_score: number;
  warnings: string[];
  created_at: string;
}

