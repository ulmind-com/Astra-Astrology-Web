/** TypeScript interfaces for 16-Zone, 32-Pada Vastu Shastra Analysis. */

export interface PadaInfo {
  pada_id: string;
  quadrant: string;
  deity: string;
  start_degree: number;
  center_degree: number;
  end_degree: number;
  is_auspicious: boolean;
  life_effects: string;
  challenge: string;
}

export interface VastuZoneInfo {
  zone_code: string;
  zone_name: string;
  zone_name_bn: string;
  center_degree: number;
  element: string;
  element_bn: string;
  body_organs: string;
  dosha: string;
  life_aspect: string;
  ideal_placements: string[];
  prohibited_placements: string[];
  self_colors: string[];
  enhancing_colors: string[];
  destructive_colors: string[];
}

export interface PlacementEvaluationItem {
  category_id: string;
  category_name: string;
  placed_zone: string;
  rating: "Excellent" | "Good" | "Acceptable" | "Fault" | "Critical Negative";
  score: number;
  impact_bn: string;
  remedy_bn: string;
  metal_strip_blocking: string | null;
  object_remedy: string | null;
}

export interface VastuRemedyItem {
  remedy_id: number;
  category: string;
  title_bn: string;
  action_bn: string;
  target_zone: string;
  item_required: string;
}

export interface VastuAuditRequest {
  property_type?: "residential" | "commercial" | "industrial";
  main_entrance_degree: number;
  placements: Record<string, string>;
}

export interface VastuAuditResponse {
  overall_score: number;
  grade: string;
  summary_bn: string;
  main_entrance_pada: PadaInfo;
  entrance_verdict: string;
  evaluations: PlacementEvaluationItem[];
  elemental_balance: Record<string, number>;
  key_remedies: VastuRemedyItem[];
  warnings_critical: string[];
}
