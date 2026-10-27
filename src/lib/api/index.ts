/** Typed calls, one function per endpoint. */

import { api, apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type {
  Address,
  FaceReadingAvailability,
  FaceReading,
  FaceScanResponse,
  GeoSearchResult,
  PalmReadingAvailability,
  PalmScanResponse,
  PalmReadingRecord,
  TimezoneLookupResult,
  ClientSignProfile,
  KpReference,
  AstrologyLanguage,
  ReviewPage,
  RashiCalculatePayload,
  RashiCalculateResult,
  NakshatraCalculatePayload,
  NakshatraCalculateResult,
  KPCalculatePayload,
  KPCalculateResult,
  KundliCalculatePayload,
  KundliCalculateResult,
  KundliMatchingPayload,
  KundliMatchingResult,
  DailyHoroscopePayload,
  DailyHoroscopeResult,
  FeaturePricingItem,

  ReviewKind,
  Review,
  PendingReview,
  AppointmentQuote,
  AppointmentDayView,
  Appointment,
  AddressInput,
  AddressUpdate,
  AstrologerAdminUpdate,
  AstrologerCreate,
  AstrologerCreated,
  AstrologerProfile,
  AstrologerPublic,
  AstrologerUpdate,
  AuthResult,
  AvailabilityUpdate,
  Call,
  CallSession,
  Chat,
  ChatSession,
  ConsultationMode,
  ConsultationQuote,
  CreateOrderResponse,
  EmailAvailability,
  GalleryUploadResult,
  HealthStatus,
  OtpSentResult,
  PageMeta,
  PaginatedAstrologers,
  ProfileUpdate,
  RechargeOptions,
  Skill,
  TransactionReason,
  UserProfile,
  UserPublic,
  VerifyPaymentResponse,
  WalletSummary,
  WalletTransaction,
} from "@/types";

// ------------------------------------------------------------------- auth
export const authApi = {
  checkEmail: (email: string) =>
    api.get<EmailAvailability>(endpoints.auth.emailAvailable, {
      query: { email },
      auth: false,
    }),

  register: (body: {
    email: string;
    password: string;
    first_name: string;
    middle_name?: string | null;
    last_name?: string | null;
  }) => api.post<OtpSentResult>(endpoints.auth.registerEmail, body, { auth: false }),

  verifyRegistration: (email: string, code: string) =>
    api.post<AuthResult>(endpoints.auth.registerVerify, { email, code }, { auth: false }),

  resendCode: (email: string) =>
    api.post<OtpSentResult>(endpoints.auth.registerResend, { email }, { auth: false }),

  login: (email: string, password: string) =>
    api.post<AuthResult>(endpoints.auth.login, { email, password }, { auth: false }),

  google: (idToken: string) =>
    api.post<AuthResult>(endpoints.auth.google, { id_token: idToken }, { auth: false }),

  me: () => api.get<UserPublic>(endpoints.auth.me),

  forgotPassword: (email: string) =>
    api.post<OtpSentResult>(endpoints.auth.forgotPassword, { email }, { auth: false }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    api.post<null>(
      endpoints.auth.resetPassword,
      { email, code, new_password: newPassword },
      { auth: false },
    ),

  changePassword: (newPassword: string, currentPassword?: string | null) =>
    api.post<null>(endpoints.auth.changePassword, {
      new_password: newPassword,
      current_password: currentPassword ?? null,
    }),
};

// ---------------------------------------------------------------- profile
export const userApi = {
  profile: () => api.get<UserProfile>(endpoints.users.me),

  updateProfile: (body: ProfileUpdate) => api.patch<UserProfile>(endpoints.users.me, body),

  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<UserProfile>(endpoints.users.avatar, { method: "POST", body: form });
  },

  removeAvatar: () => api.delete<UserProfile>(endpoints.users.avatar),

  addresses: () => api.get<Address[]>(endpoints.users.addresses),
  addAddress: (body: AddressInput) => api.post<Address>(endpoints.users.addresses, body),
  updateAddress: (id: string, body: AddressUpdate) =>
    api.patch<Address>(endpoints.users.address(id), body),
  deleteAddress: (id: string) => api.delete<null>(endpoints.users.address(id)),
};

// ------------------------------------------------------------- astrologers
export type DirectoryFilters = {
  search?: string;
  skill?: Skill;
  language?: string;
  mode?: ConsultationMode;
  online_only?: boolean;
  featured_only?: boolean;
  min_experience?: number;
  max_coins_per_minute?: number;
  page?: number;
  limit?: number;
};

export const astrologerApi = {
  quote: (astrologerId: string, mode: ConsultationMode) =>
    api.get<ConsultationQuote>(endpoints.astrologers.quote(astrologerId), {
      query: { mode },
    }),

  list: (filters: DirectoryFilters = {}) =>
    api.get<PaginatedAstrologers>(endpoints.astrologers.list, {
      query: filters,
      auth: false,
    }),

  detail: (slugOrId: string) =>
    api.get<AstrologerPublic>(endpoints.astrologers.detail(slugOrId), { auth: false }),

  // the signed-in astrologer's own
  me: () => api.get<AstrologerProfile>(endpoints.astrologers.me),

  updateMe: (body: AstrologerUpdate) =>
    api.patch<AstrologerProfile>(endpoints.astrologers.me, body),

  setAvailability: (body: AvailabilityUpdate) =>
    api.patch<AstrologerProfile>(endpoints.astrologers.availability, body),

  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<AstrologerProfile>(endpoints.astrologers.image, {
      method: "POST",
      body: form,
    });
  },

  removeImage: () => api.delete<AstrologerProfile>(endpoints.astrologers.image),

  addGalleryImage: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiFetch<GalleryUploadResult>(endpoints.astrologers.gallery, {
      method: "POST",
      body: form,
    });
  },

  removeGalleryImage: (publicId: string) =>
    api.delete<null>(endpoints.astrologers.galleryImage(publicId)),
};

// ------------------------------------------------------------------ admin
export const adminApi = {
  listAstrologers: (params: { search?: string; skip?: number; limit?: number } = {}) =>
    api.get<AstrologerProfile[]>(endpoints.admin.astrologers, { query: params }),

  getAstrologer: (id: string) => api.get<AstrologerProfile>(endpoints.admin.astrologer(id)),

  createAstrologer: (body: AstrologerCreate) =>
    api.post<AstrologerCreated>(endpoints.admin.astrologers, body),

  updateAstrologer: (id: string, body: AstrologerAdminUpdate) =>
    api.patch<AstrologerProfile>(endpoints.admin.astrologer(id), body),

  deactivateAstrologer: (id: string) => api.delete<null>(endpoints.admin.astrologer(id)),
};

// ----------------------------------------------------------------- health
export const healthApi = {
  check: () => api.get<HealthStatus>(endpoints.health, { auth: false }),
};

// ----------------------------------------------------------------- wallet
export const walletApi = {
  summary: () => api.get<WalletSummary>(endpoints.wallet.summary),

  transactions: (params: { page?: number; limit?: number; reason?: TransactionReason } = {}) =>
    api.get<{ items: WalletTransaction[]; meta: PageMeta }>(endpoints.wallet.transactions, {
      query: { page: params.page, limit: params.limit, reason: params.reason },
    }),

  rechargeOptions: () => api.get<RechargeOptions>(endpoints.wallet.rechargeOptions),

  createOrder: (amount_paise: number) =>
    api.post<CreateOrderResponse>(endpoints.wallet.rechargeOrder, { amount_paise }),

  verify: (body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post<VerifyPaymentResponse>(endpoints.wallet.rechargeVerify, body),
};

// ------------------------------------------------------------------- calls
export const callApi = {
  start: (astrologer_id: string, mode: ConsultationMode, requested_minutes: number) =>
    api.post<CallSession>(endpoints.calls.start, {
      astrologer_id,
      mode,
      requested_minutes,
    }),

  active: () => api.get<CallSession | null>(endpoints.calls.active),

  get: (id: string) => api.get<CallSession>(endpoints.calls.detail(id)),

  accept: (id: string) => api.post<CallSession>(endpoints.calls.accept(id), {}),

  decline: (id: string) => api.post<Call>(endpoints.calls.decline(id), {}),

  end: (id: string, reason?: string) => api.post<Call>(endpoints.calls.end(id), { reason }),

  heartbeat: (id: string) => api.post<Call>(endpoints.calls.heartbeat(id), {}),

  extend: (id: string, extra_minutes: number) =>
    api.post<Call>(endpoints.calls.extend(id), { extra_minutes }),

  history: (params: { page?: number; limit?: number } = {}) =>
    api.get<{ items: Call[]; meta: PageMeta }>(endpoints.calls.history, { query: params }),
};

// -------------------------------------------------------------------- chat
export const chatApi = {
  start: (astrologer_id: string, requested_minutes: number) =>
    api.post<ChatSession>(endpoints.chats.start, { astrologer_id, requested_minutes }),

  active: () => api.get<ChatSession | null>(endpoints.chats.active),

  get: (id: string) => api.get<ChatSession>(endpoints.chats.detail(id)),

  accept: (id: string) => api.post<ChatSession>(endpoints.chats.accept(id), {}),

  decline: (id: string) => api.post<Chat>(endpoints.chats.decline(id), {}),

  end: (id: string, reason?: string) => api.post<Chat>(endpoints.chats.end(id), { reason }),

  heartbeat: (id: string) => api.post<Chat>(endpoints.chats.heartbeat(id), {}),

  extend: (id: string, extra_minutes: number) =>
    api.post<Chat>(endpoints.chats.extend(id), { extra_minutes }),

  history: (params: { page?: number; limit?: number } = {}) =>
    api.get<{ items: Chat[]; meta: PageMeta }>(endpoints.chats.history, { query: params }),
};

// ------------------------------------------------------------ appointments
export const appointmentApi = {
  /** What is open and what is taken on one day, for the chooser. */
  day: (astrologerId: string, on: string) =>
    api.get<AppointmentDayView>(endpoints.appointments.day(astrologerId), {
      query: { on },
      auth: false,
    }),

  quote: (astrologer_id: string, minutes: number) =>
    api.post<AppointmentQuote>(endpoints.appointments.quote, { astrologer_id, minutes }),

  book: (body: {
    astrologer_id: string;
    starts_at: string;
    minutes: number;
    note?: string | null;
  }) => api.post<Appointment>(endpoints.appointments.book, body),

  mine: (upcoming_only = false) =>
    api.get<Appointment[]>(endpoints.appointments.mine, { query: { upcoming_only } }),

  get: (id: string) => api.get<Appointment>(endpoints.appointments.detail(id)),

  cancel: (id: string, reason?: string) =>
    api.post<Appointment>(endpoints.appointments.cancel(id), { reason: reason ?? null }),
};

// ----------------------------------------------------------------- reviews
export const reviewApi = {
  /** Public: what people said about an astrologer. */
  forAstrologer: (astrologerId: string, params: { skip?: number; limit?: number } = {}) =>
    api.get<ReviewPage>(endpoints.reviews.forAstrologer(astrologerId), {
      query: params,
      auth: false,
    }),

  /** Consultations this person finished but has not reviewed — drives the prompt. */
  pending: () => api.get<PendingReview[]>(endpoints.reviews.pending),

  mine: () => api.get<Review[]>(endpoints.reviews.mine),

  leave: (body: {
    kind: ReviewKind;
    session_id: string;
    stars: number;
    text?: string | null;
  }) => api.post<Review>(endpoints.reviews.leave, body),
};

// ------------------------------------------------------------ face reading
export const palmReadingApi = {
  /** Cost and availability, plus the photo guidance, asked before the camera opens. */
  availability: () =>
    api.get<PalmReadingAvailability>(endpoints.palmReading.availability),

  /** Scan a palm photo with optional Kundli chart synchronization. Nothing is charged unless a reading is produced. */
  scan: (image: File | Blob | string, birth_details?: Record<string, any>) => {
    if (typeof image === "string") {
      return api.post<PalmScanResponse>(endpoints.palmReading.scan, { image, birth_details });
    }
    const form = new FormData();
    form.append("file", image, image instanceof File ? image.name : "palm_capture.jpg");
    if (birth_details) {
      if (birth_details.birth_date) form.append("birth_date", birth_details.birth_date);
      if (birth_details.birth_time) form.append("birth_time", birth_details.birth_time);
      if (birth_details.latitude) form.append("latitude", String(birth_details.latitude));
      if (birth_details.longitude) form.append("longitude", String(birth_details.longitude));
      if (birth_details.timezone_offset) form.append("timezone_offset", String(birth_details.timezone_offset));
    }
    return apiFetch<PalmScanResponse>(endpoints.palmReading.scan, {
      method: "POST",
      body: form,
    });
  },

  mine: () => api.get<PalmReadingRecord[]>(endpoints.palmReading.mine),

  detail: (id: string) => api.get<PalmReadingRecord>(endpoints.palmReading.detail(id)),
};

export const faceReadingApi = {
  /** Cost and availability, asked before the camera opens. */
  availability: () =>
    api.get<FaceReadingAvailability>(endpoints.faceReading.availability),

  /** Production 3D MediaPipe + OpenCV facial scanning pipeline with optional Kundli Sync */
  scan: (image: File | Blob | string, birth_details?: Record<string, any>) => {
    if (typeof image === "string") {
      return api.post<FaceScanResponse>(endpoints.faceReading.scan, { image, birth_details });
    }
    const form = new FormData();
    form.append("file", image, image instanceof File ? image.name : "face_capture.jpg");
    if (birth_details) {
      form.append("birth_details", JSON.stringify(birth_details));
    }
    return apiFetch<FaceScanResponse>(endpoints.faceReading.scan, {
      method: "POST",
      body: form,
    });
  },

  /** Sends measurements only — legacy fallback. */
  submit: (measurements: Record<string, number>, quality: number) =>
    api.post<FaceReading>(endpoints.faceReading.submit, { measurements, quality }),

  mine: () => api.get<FaceReading[]>(endpoints.faceReading.mine),

  get: (id: string) => api.get<FaceReading>(endpoints.faceReading.detail(id)),
};

// -------------------------------------------------------------- astrology
export const astrologyApi = {
  calculateRashi: (body: RashiCalculatePayload) =>
    api.post<RashiCalculateResult>(endpoints.astrology.rashi, body),

  rashis: () => api.get<any[]>(endpoints.astrology.rashis, { auth: false }),

  calculateNakshatra: (body: NakshatraCalculatePayload) =>
    api.post<NakshatraCalculateResult>(endpoints.astrology.nakshatra, body),

  nakshatras: () => api.get<any[]>(endpoints.astrology.nakshatras, { auth: false }),

  calculateKp: (body: KPCalculatePayload) =>
    api.post<KPCalculateResult>(endpoints.astrology.kp, body),

  calculateDasha: (body: KPCalculatePayload) =>
    api.post<KPCalculateResult>(endpoints.astrology.dasha, body),

  calculateKundli: (body: KundliCalculatePayload) =>
    api.post<KundliCalculateResult>(endpoints.astrology.kundli, body),

  calculateKundliMatching: (body: KundliMatchingPayload) =>
    api.post<KundliMatchingResult>(endpoints.astrology.kundliMatching, body),

  /**
   * Geocode a birth place. Passing the birth date makes the returned offset the one
   * actually in force then, so daylight saving and historical changes are reflected.
   */
  geoSearch: (q: string, birthDate?: { year?: number; month?: number; day?: number }) =>
    api.get<GeoSearchResult[]>(endpoints.astrology.geoSearch, {
      query: {
        q,
        ...(birthDate?.year ? { year: birthDate.year } : {}),
        ...(birthDate?.month ? { month: birthDate.month } : {}),
        ...(birthDate?.day ? { day: birthDate.day } : {}),
      },
      auth: false,
    }),

  /** Exact UTC offset for one coordinate at one local wall-clock instant. */
  lookupTimezone: (params: {
    latitude: number;
    longitude: number;
    year: number;
    month: number;
    day: number;
    hour?: number;
    minute?: number;
  }) =>
    api.get<TimezoneLookupResult>(endpoints.astrology.timezone, {
      query: params as unknown as Record<string, string | number>,
      auth: false,
    }),

  /** The client-sourced rule set for one sign, with a citation on every group. */
  clientRules: (signIndex: number, language: AstrologyLanguage = "en") =>
    api.get<ClientSignProfile & { kp_reference: KpReference }>(
      endpoints.astrology.clientRules(signIndex),
      { query: { language }, auth: false },
    ),

  /** 100% In-house Vedic Daily Horoscope (Moon Transit Gochar & Panchang). */
  dailyHoroscope: (payload?: DailyHoroscopePayload) =>
    api.post<DailyHoroscopeResult>(
      endpoints.astrology.dailyHoroscope,
      payload || {},
    ),

  /** Get current feature pricing and availability for all astrology tools. */
  featuresPricing: () =>
    api.get<Record<string, FeaturePricingItem>>(endpoints.astrology.featuresPricing, { auth: false }),
};

// ------------------------------------------------------------ AI Vedic Astrologer
export interface AIChatMessage {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  tools_called?: string[];
  citations?: Array<{ source: string; category: string; snippet: string }>;
  suggested_followups?: string[];
  timestamp?: string;
}

export interface AIChatResponse {
  session_id: string;
  reply: string;
  language: string;
  tools_called: string[];
  citations: Array<{ source: string; category: string; snippet: string }>;
  suggested_followups: string[];
}

export interface AIChatSessionData {
  session_id: string;
  title: string;
  birth_details?: Record<string, unknown>;
  messages: AIChatMessage[];
  updated_at: string;
}

export const aiAstrologerApi = {
  chat: (body: {
    message: string;
    session_id?: string;
    birth_date?: string;
    birth_time?: string;
    birth_place?: string;
    latitude?: number;
    longitude?: number;
    preferred_language?: string;
  }) => api.post<AIChatResponse>(endpoints.aiAstrologer.chat, body),

  getSession: (sessionId: string) =>
    api.get<AIChatSessionData>(endpoints.aiAstrologer.session(sessionId)),

  sendFeedback: (body: {
    session_id: string;
    user_query: string;
    ai_response: string;
    rating: number;
    feedback_reason?: string;
  }) => api.post<{ status: string }>(endpoints.aiAstrologer.feedback, body),
};

// ------------------------------------------------------------------- Numerology & Vastu
import type {
  NumerologyCalculateRequest,
  NumerologyCalculateResponse,
  NameAnalysisResponse,
  MobileAnalysisResponse,
  MulankProfile,
} from "@/types/numerology";

import type {
  VastuAuditRequest,
  VastuAuditResponse,
  PadaInfo,
  VastuZoneInfo,
  VastuRemedyItem,
} from "@/types/vastu";

export const numerologyApi = {
  calculate: (body: NumerologyCalculateRequest) =>
    api.post<NumerologyCalculateResponse>(endpoints.numerology.calculate, body),

  analyzeName: (body: { name: string; mulank?: number; bhagyank?: number }) =>
    api.post<NameAnalysisResponse>(endpoints.numerology.name, body),

  analyzeMobile: (body: { mobile_number: string; mulank?: number; bhagyank?: number; birth_date?: string }) =>
    api.post<MobileAnalysisResponse>(endpoints.numerology.mobile, body),

  getProfile: (number: number) =>
    api.get<MulankProfile>(endpoints.numerology.profile(number)),
};

export const vastuApi = {
  audit: (body: VastuAuditRequest) =>
    api.post<VastuAuditResponse>(endpoints.vastu.audit, body),

  resolveDegree: (degree: number) =>
    api.get<PadaInfo>(endpoints.vastu.compassResolve, { query: { degree } }),

  getPadas: () =>
    api.get<PadaInfo[]>(endpoints.vastu.compassPadas),

  getZones: () =>
    api.get<VastuZoneInfo[]>(endpoints.vastu.zones),

  getRemedies: (category?: string) =>
    api.get<VastuRemedyItem[]>(endpoints.vastu.remedies, { query: category ? { category } : undefined }),
};


