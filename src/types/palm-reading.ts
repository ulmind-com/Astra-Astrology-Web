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
  overlay_image: string | null;
  coins_charged: number;
  quality_score: number;
  warnings: string[];
  created_at: string;
}
