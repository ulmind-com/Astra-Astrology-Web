/**
 * Friendly names for the schemas in `api.d.ts`.
 *
 * `api.d.ts` is generated from the backend's OpenAPI document — never edit it.
 * Regenerate with:
 *   npx openapi-typescript src/types/openapi.json -o src/types/api.d.ts
 */

import type { components } from "./api";

type S = components["schemas"];

// ---------------------------------------------------------------- envelope
/** Every successful response from the API has this shape. */
export type ApiEnvelope<T> = { success: boolean; message: string; data: T | null };

export type ValidationDetail = { field: string; message: string; type: string };

export type ApiErrorBody = {
  success: false;
  message: string;
  error_code: string;
  details?: ValidationDetail[] | Record<string, unknown> | null;
};

export type PageMeta = S["PageMeta"];

// -------------------------------------------------------------------- auth
export type AuthResult = S["AuthResult"];
export type TokenPair = S["TokenPair"];
export type UserPublic = S["UserPublic"];
export type OtpSentResult = S["OtpSentResult"];
export type EmailAvailability = S["EmailAvailability"];
export type UserRole = S["UserRole"];
export type AccountStatus = S["AccountStatus"];
export type AuthProvider = S["AuthProvider"];

// ----------------------------------------------------------------- profile
export type UserProfile = S["UserProfile"];
export type ProfileUpdate = S["ProfileUpdate"];
export type ProfileCompleteness = S["ProfileCompleteness"];
export type BirthDetails = S["BirthDetails"];
export type BirthDetailsInput = S["BirthDetailsInput"];
export type CurrentLocation = S["CurrentLocation"];
export type CurrentLocationInput = S["CurrentLocationInput"];
export type NotificationPreferences = S["NotificationPreferences"];
export type Address = S["Address"];
export type AddressInput = S["AddressInput"];
export type AddressUpdate = S["AddressUpdate"];
export type Gender = S["Gender"];
export type MaritalStatus = S["MaritalStatus"];

// -------------------------------------------------------------- astrologer
export type AstrologerPublic = S["AstrologerPublic"] & {
  banner_image_url?: string | null;
};
export type AstrologerProfile = S["AstrologerProfile"] & {
  banner_image_url?: string | null;
};
export type AstrologerCreate = S["AstrologerCreate"];
export type AstrologerCreated = S["AstrologerCreated"];
export type AstrologerUpdate = S["AstrologerUpdate"];
export type AstrologerAdminUpdate = S["AstrologerAdminUpdate"];
export type AvailabilityUpdate = S["AvailabilityUpdate"];
export type Availability = S["Availability"];
export type RateCard = S["RateCard"];
export type ResolvedRates = S["ResolvedRates"];
export type RatingSummary = S["RatingSummary"];
export type BankDetails = S["BankDetails"];
export type GalleryImage = S["GalleryImage"];
export type GalleryUploadResult = S["GalleryUploadResult"];
export type Skill = S["Skill"];
export type ConsultationMode = S["ConsultationMode"];

/** `Paginated[AstrologerPublic]`, which openapi-typescript names awkwardly. */
export type PaginatedAstrologers = S["Paginated_AstrologerPublic_"];

// ------------------------------------------------------------------ health
export type HealthStatus = S["HealthStatus"];

// ------------------------------------------------------------------ labels
export const SKILL_LABELS: Record<Skill, string> = {
  vedic_astrology: "Vedic Astrology",
  numerology: "Numerology",
  tarot: "Tarot",
  vastu: "Vastu",
  palmistry: "Palmistry",
  face_reading: "Face Reading",
  kp_astrology: "KP Astrology",
  lal_kitab: "Lal Kitab",
  nadi: "Nadi",
  prashna: "Prashna",
  love_relationship: "Love & Relationship",
  career_business: "Career & Business",
  finance_wealth: "Finance & Wealth",
};

export const SKILLS = Object.keys(SKILL_LABELS) as Skill[];

export const MODE_LABELS: Record<ConsultationMode, string> = {
  chat: "Chat",
  call: "Call",
  video: "Video",
};

export const MODES = Object.keys(MODE_LABELS) as ConsultationMode[];

export const GENDER_LABELS: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  undisclosed: "Prefer not to say",
};

export const MARITAL_LABELS: Record<MaritalStatus, string> = {
  single: "Single",
  engaged: "Engaged",
  married: "Married",
  divorced: "Divorced",
  widowed: "Widowed",
  undisclosed: "Prefer not to say",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "User",
  astrologer: "Astrologer",
  admin: "Admin",
  super_admin: "Super Admin",
};

/** The languages the platform starts with. Free text, so this is only a hint. */
export const COMMON_LANGUAGES = [
  "Hindi",
  "English",
  "Bengali",
  "Marathi",
  "Telugu",
  "Tamil",
  "Gujarati",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Odia",
  "Assamese",
  "Urdu",
];

// ------------------------------------------------------------------ wallet
export interface ConsultationMetadata {
  session_id?: string | null;
  astrologer_id?: string | null;
  astrologer_name?: string | null;
  astrologer_avatar?: string | null;
  mode?: "chat" | "call" | "video" | "appointment" | string | null;
  duration_seconds?: number | null;
}

export type WalletBalance = S["WalletBalance"];
export type WalletSummary = S["WalletSummary"];
export type WalletTransaction = S["TransactionOut"] & {
  consultation?: ConsultationMetadata | null;
};
export type TransactionDirection = S["TransactionDirection"];
export type TransactionReason = S["TransactionReason"] | "feature_usage";
export type RechargeOptions = S["RechargeOptions"];
export type RechargePack = S["RechargePack"];
export type CreateOrderResponse = S["CreateOrderResponse"];
export type VerifyPaymentResponse = S["VerifyPaymentResponse"];
export type PaymentOrder = S["PaymentOrderOut"];
export type PaymentOrderStatus = S["PaymentOrderStatus"];
export type AdminWallet = S["AdminWalletOut"];
export type AdminTransaction = S["AdminTransactionOut"];
export type ReconcileResult = S["ReconcileResult"];

/** What a ledger row is called on screen. */
export const TRANSACTION_REASON_LABELS: Record<TransactionReason, string> = {
  recharge: "Recharge",
  consultation: "Consultation",
  refund: "Refund",
  adjustment: "Adjustment",
  bonus: "Bonus",
  payout: "Payout",
  reversal: "Reversal",
  appointment_deposit: "Appointment booking",
  feature_usage: "Feature usage",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentOrderStatus, string> = {
  created: "Started",
  paid: "Paid",
  failed: "Failed",
  expired: "Expired",
};

export type PlatformSettings = S["PlatformSettingsOut"];
export type CoinRateChange = S["CoinRateChangeOut"];

/**
 * Money crosses the wire as integer paise and is only turned into rupees here,
 * so the two apps can never disagree about what a balance means.
 */
export function formatPaise(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

export function rupeesToPaise(rupees: number): number {
  // Rounded, never truncated: 0.1 + 0.2 in floating point is 0.30000000000000004.
  return Math.round(rupees * 100);
}

/**
 * Coins are what the wallet actually holds. They are never shown as a rupee
 * value, because the admin can change the rate and coins already bought keep
 * the rate they were bought at — so there is no one rupee figure for a balance.
 */
export function formatCoins(coins: number): string {
  return new Intl.NumberFormat("en-IN").format(coins);
}

export function coinWord(coins: number): string {
  return coins === 1 ? "coin" : "coins";
}

// ------------------------------------------------------------------- calls
export type Call = S["CallOut"];
export type CallCredentials = S["CallCredentials"];
export type CallSession = S["CallSessionOut"];
export type CallStatus = S["CallStatus"];
export type CallParty = S["CallParty"];

/** A call in one of these is still going on. */
export const LIVE_CALL_STATUSES: CallStatus[] = ["ringing", "active"];

export function isCallLive(status: CallStatus): boolean {
  return LIVE_CALL_STATUSES.includes(status);
}

export const CALL_STATUS_LABELS: Record<CallStatus, string> = {
  ringing: "Ringing",
  active: "In progress",
  ended: "Ended",
  declined: "Declined",
  missed: "Missed",
  cancelled: "Cancelled",
  failed: "Failed",
};

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// -------------------------------------------------------------------- chat
export type Chat = S["ChatOut"];
export type ChatSession = S["ChatSessionOut"];
export type ChatStatus = S["ChatStatus"];

export const LIVE_CHAT_STATUSES: ChatStatus[] = ["requested", "active"];

export function isChatLive(status: ChatStatus): boolean {
  return LIVE_CHAT_STATUSES.includes(status);
}

export const CHAT_STATUS_LABELS: Record<ChatStatus, string> = {
  requested: "Waiting for the astrologer",
  active: "In progress",
  ended: "Ended",
  declined: "Declined",
  missed: "Not picked up",
  cancelled: "Cancelled",
};

// --------------------------------------------------------------- billing
export type ConsultationQuote = S["ConsultationQuote"];
export type SessionBilling = S["SessionBilling"];
export type EarningsSummary = S["EarningsSummary"];
export type EarningsBucket = S["EarningsBucket"];
export type EarningRow = S["EarningRow"];
export type AdminEarningRow = S["AdminEarningRow"];
export type AdminEarningsSummary = S["AdminEarningsSummary"];

/** Earnings are money, so they are paise — never coins. */
export function formatEarning(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: paise % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(paise / 100);
}

// ------------------------------------------------------------- appointments
export type Appointment = S["AppointmentOut"];
export type AppointmentQuote = S["AppointmentQuote"];
export type AppointmentStatus = S["AppointmentStatus"];
export type AppointmentCard = S["AppointmentCardOut"];
export type AvailabilityWindow = S["WindowOut"];
export type AppointmentDayView = S["DayView"];

/** What a booking's state is called on screen. */
export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  booked: "Booked",
  cancelled: "Cancelled",
  completed: "Completed",
  missed: "Missed",
};

// ----------------------------------------------------------------- reviews
export type Review = S["ReviewOut"] & {
  author_avatar?: string | null;
  session_id?: string | null;
};
export type ReviewPage = S["ReviewPage"];
export type ReviewSummary = S["ReviewSummary"];
export type PendingReview = S["PendingReview"];
export type ReviewKind = S["ReviewKind"];

/** What each kind of consultation is called in a review. */
export const REVIEW_KIND_LABELS: Record<ReviewKind, string> = {
  chat: "Chat",
  call: "Voice call",
  video: "Video call",
  appointment: "Appointment",
};

// ------------------------------------------------------------ face reading
export type FaceReading = S["FaceReadingOut"] & {
  tri_zone_analysis?: TriZoneAnalysis | null;
  pancha_mahabhuta?: PanchaMahabhuta | null;
  kundli_sync?: KundliFaceSync | null;
  forehead_lines_count?: number;
  forehead_lines_shastra?: {
    title_bn?: string;
    title_en?: string;
    meaning_bn?: string;
    meaning_en?: string;
  } | null;
  forehead_lines_data?: Array<{
    y_center: number;
    x_start: number;
    x_end: number;
    width_px: number;
    prominence: number;
    is_continuous: boolean;
    planet_name: string;
  }>;
};
export type FaceReadingSection = S["ReadingSectionOut"];
export type FaceReadingAvailability = S["FaceReadingAvailability"];
export type FaceRule = S["RuleOut"];

export type HeadPose = {
  yaw: number;
  pitch: number;
  roll: number;
  is_frontal: boolean;
};

export type QualityChecks = {
  is_valid: boolean;
  status: "ACCEPTED" | "RETAKE_RECOMMENDED" | "REJECTED";
  face_count: number;
  face_coverage_pct: number;
  blur_score: number;
  brightness_mean: number;
  contrast_std: number;
  lighting_symmetry_ratio: number;
  head_pose: HeadPose | null;
  issues: string[];
  recommendations: string[];
};

export type MeasurementDetail = {
  name: string;
  value: number;
  description: string;
  formula: string;
  landmarks_used: number[];
  status: string;
};

export type TriZoneEraDetail = {
  era_name: string;
  era_name_bn?: string;
  age_span: string;
  score_pct: number;
  rulers: string;
  deity?: string;
  forecast_en: string;
  forecast_bn?: string;
};

export type TriZoneAnalysis = {
  upper_pct: number;
  middle_pct: number;
  lower_pct: number;
  ratio_str: string;
  status: "balanced" | "upper_dominant" | "middle_dominant" | "lower_dominant";
  title_en: string;
  desc_en: string;
  desc_bn?: string;
  desc_hi?: string;
  eras: TriZoneEraDetail[];
};

export type PanchaMahabhuta = {
  dominant_element: string;
  element_bn?: string;
  element_hi?: string;
  mahapurusha: string;
  mahapurusha_bn?: string;
  traits_en: string;
  traits_bn?: string;
  traits_hi?: string;
  scores: Record<string, number>;
};

export type HouseZoneCorrelation = {
  house: number;
  house_name: string;
  house_name_bn?: string;
  house_name_hi?: string;
  face_part: string;
  face_part_bn?: string;
  face_part_hi?: string;
  planets_occupying?: string;
  significance_en: string;
  significance_bn?: string;
  significance_hi?: string;
  status_note_en?: string;
  status_note_bn?: string;
  status_note_hi?: string;
};

export type KundliFaceSync = {
  sync_available: boolean;
  message?: string;
  ascendant_sign: string;
  ascendant_sign_bn?: string;
  ascendant_sign_hi?: string;
  ascendant_lord: string;
  physiognomy_traits: Record<string, any>;
  first_house_conjunction?: {
    title_en: string;
    title_bn?: string;
    title_hi?: string;
    meaning_en: string;
    meaning_bn?: string;
    meaning_hi?: string;
  } | null;
  house_correlations: HouseZoneCorrelation[];
  kalpurush_highlight?: {
    nakshatra: string;
    lord: string;
    body_part_en: string;
    body_part_bn?: string;
    body_part_hi?: string;
    explanation_en: string;
    explanation_bn?: string;
    explanation_hi?: string;
  } | null;
  til_masaka: Array<{
    planet: string;
    type_en: string;
    type_bn?: string;
    type_hi?: string;
    zone_en: string;
    zone_bn?: string;
    zone_hi?: string;
    body_correlation_en: string;
    body_correlation_bn?: string;
    body_correlation_hi?: string;
  }>;
  remedies: Array<{
    category: string;
    upaya_en: string;
    upaya_bn?: string;
    upaya_hi?: string;
    gemstone?: string;
  }>;
};

export type FaceScanResponse = {
  scan_id: string;
  status: "ACCEPTED" | "RETAKE_RECOMMENDED" | "REJECTED";
  quality_score: number;
  quality_checks: QualityChecks;
  head_pose: HeadPose | null;
  measurements: Record<string, number>;
  measurement_details: Record<string, MeasurementDetail>;
  measurement_status: "valid" | "retake_recommended" | "rejected";
  visualization_image: string | null;
  reading: FaceReading | null;
  coins_charged: number;
  forehead_lines_count?: number;
  forehead_lines_data?: Array<{
    y_center: number;
    x_start: number;
    x_end: number;
    width_px: number;
    prominence: number;
    is_continuous: boolean;
    planet_name: string;
  }>;
  forehead_lines_shastra?: {
    title_bn?: string;
    title_en?: string;
    meaning_bn?: string;
    meaning_en?: string;
  };
  tri_zone_analysis?: TriZoneAnalysis | null;
  pancha_mahabhuta?: PanchaMahabhuta | null;
  kundli_sync?: KundliFaceSync | null;
  landmark_mapping_version: string;
  model_version: string;
  processing_duration_ms: number;
  warnings: string[];
  error_message: string | null;
};

export * from "./astrology";
export * from "./palm-reading";
