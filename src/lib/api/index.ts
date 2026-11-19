/** Typed calls, one function per endpoint. */

import { api, apiFetch } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { apiBase } from "@/lib/env";
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
  AnnualHoroscopeRequest,
  AnnualHoroscopeResponse,
  FeaturePricingItem,

  ReviewKind,
  Review,
  PendingReview,
  AppointmentQuote,
  AppointmentDayView,
  Appointment,
  PrivateInviteLink,
  ValidatePrivateInviteResponse,
  WhiteboardData,
  WhiteboardStroke,
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
  CourseListItem,
  CourseDetail,
  CourseEnrollment,
  LessonStreamData,
  CourseOrderCreateResponse,
  CoursePaymentVerifyRequest,
  CoursePaymentSyncResponse,
  CourseQuestion,
  CourseQuestionAnswer,
  CourseCertificate,
} from "@/types";
import type {
  CreateMilanRoomInput,
  MilanRoom,
  MilanRoomSession,
} from "@/types/milan";
import type {
  TarotCard,
  SpreadConfig,
  TarotDrawRequest,
  TarotDrawResponse,
  DailyTarotRequest,
} from "@/types/tarot";

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

  toggleFavorite: (slugOrId: string) =>
    api.post<{ is_favorite: boolean; favorites_count: number; message: string }>(
      endpoints.astrologers.favorite(slugOrId),
      {},
    ),

  favoriteStatus: (slugOrId: string) =>
    api.get<{ is_favorite: boolean; favorites_count: number }>(
      endpoints.astrologers.favorite(slugOrId),
    ),

  myFavorites: () =>
    api.get<AstrologerPublic[]>(endpoints.astrologers.myFavorites),
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

// ------------------------------------------------------------------ milan
/**
 * The multi-party Vedic chamber.
 *
 * The guest calls deliberately pass `auth: false`. A bride's father on an
 * invitation link has no account, and sending a stale token from a browser
 * that happens to be signed in as someone else would only confuse the
 * server about who is taking the seat.
 */
export const milanApi = {
  create: (input: CreateMilanRoomInput) =>
    api.post<MilanRoomSession>(endpoints.milan.create, input),

  active: () => api.get<MilanRoomSession | null>(endpoints.milan.active),

  get: (id: string) => api.get<MilanRoomSession>(endpoints.milan.detail(id)),

  addSeat: (id: string, label: string) =>
    api.post<MilanRoom>(endpoints.milan.seats(id), { label }),

  revokeSeat: (id: string, seatId: string) =>
    api.delete<MilanRoom>(endpoints.milan.seat(id, seatId)),

  extend: (id: string, extra_minutes: number) =>
    api.post<MilanRoom>(endpoints.milan.extend(id), null, {
      query: { extra_minutes },
    }),

  heartbeat: (id: string) => api.post<MilanRoom>(endpoints.milan.heartbeat(id), {}),

  end: (id: string, reason?: string) =>
    api.post<MilanRoom>(endpoints.milan.end(id), null, {
      query: reason ? { reason } : undefined,
    }),

  guestJoin: (join_code: string, display_name?: string) =>
    api.post<MilanRoomSession>(
      endpoints.milan.guestJoin,
      { join_code, display_name },
      { auth: false },
    ),

  guestHeartbeat: (join_code: string) =>
    api.post<MilanRoom>(endpoints.milan.guestHeartbeat, { join_code }, { auth: false }),

  guestLeave: (join_code: string) =>
    api.post<{ message: string }>(
      endpoints.milan.guestLeave,
      { join_code },
      { auth: false },
    ),
};


// -------------------------------------------------------------- whiteboard
export const whiteboardApi = {
  get: (callId: string) =>
    api.get<WhiteboardData>(`/calls/${callId}/whiteboard`),

  sync: (
    callId: string,
    payload: {
      is_open?: boolean;
      chart_style?: string;
      active_tab?: string;
      drishti?: any;
      highlighted_houses?: number[];
      strokes?: WhiteboardStroke[];
      append_stroke?: WhiteboardStroke;
      clear_strokes?: boolean;
    },
  ) => api.post<WhiteboardData>(`/calls/${callId}/whiteboard/sync`, payload),

  clear: (callId: string) =>
    api.post<WhiteboardData>(`/calls/${callId}/whiteboard/clear`, {}),

  toggle: (callId: string) =>
    api.post<WhiteboardData>(`/calls/${callId}/whiteboard/toggle`, {}),

  loadChart: (
    callId: string,
    payload: {
      name?: string;
      date: string;
      time: string;
      place?: string;
      latitude?: number;
      longitude?: number;
      timezone_offset?: number;
    },
  ) => api.post<WhiteboardData>(`/calls/${callId}/whiteboard/load-chart`, payload),
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
  day: (astrologerId: string, on: string, invite_code?: string) =>
    api.get<AppointmentDayView>(endpoints.appointments.day(astrologerId), {
      query: { on, ...(invite_code ? { invite_code } : {}) },
      auth: false,
    }),

  quote: (astrologer_id: string, minutes: number, invite_code?: string, starts_at?: string) =>
    api.post<AppointmentQuote>(endpoints.appointments.quote, {
      astrologer_id,
      minutes,
      ...(invite_code ? { invite_code } : {}),
      ...(starts_at ? { starts_at } : {}),
    }),

  book: (body: {
    astrologer_id: string;
    starts_at: string;
    minutes: number;
    note?: string | null;
    consultation_pillar?: string | null;
    kundli_id?: string | null;
    birth_details?: Record<string, any> | null;
    invite_code?: string | null;
    invite_passcode?: string | null;
  }) => api.post<Appointment>(endpoints.appointments.book, body),

  mine: (upcoming_only = false) =>
    api.get<Appointment[]>(endpoints.appointments.mine, { query: { upcoming_only } }),

  get: (id: string) => api.get<Appointment>(endpoints.appointments.detail(id)),

  cancel: (id: string, reason?: string) =>
    api.post<Appointment>(endpoints.appointments.cancel(id), { reason: reason ?? null }),

  complete: (id: string) =>
    api.post<Appointment>(`/appointments/${id}/complete`, {}),

  validatePrivateInvite: (inviteCode: string) =>
    api.get<ValidatePrivateInviteResponse>(`/appointments/private-links/${inviteCode}/validate`, {
      auth: false,
    }),

  verifyPrivatePasscode: (inviteCode: string, passcode: string) =>
    api.post<{ valid: boolean; astrologer_id: string; message: string }>(
      `/appointments/private-links/${inviteCode}/verify-passcode`,
      { passcode },
      { auth: false }
    ),

  synergy: (astrologer_id: string, dob?: string | null) =>
    api.get<Record<string, any>>(`/appointments/synergy`, {
      query: { astrologer_id, ...(dob ? { dob } : {}) },
      auth: false,
    }),

  getCertificate: (id: string) =>
    api.get<Record<string, any>>(`/appointments/${id}/certificate`),

  getKarmicVault: (id: string) =>
    api.get<Record<string, any>>(`/appointments/${id}/karmic-vault`),

  getCertificateHtmlUrl: (id: string) =>
    `${process.env.NEXT_PUBLIC_API_URL || "https://api.divinlink.com"}/api/v1/appointments/${id}/certificate/html`,

  verifyCertificate: (id: string) =>
    api.get<{
      valid: boolean;
      status: string;
      appointment_id: string;
      certificate_id: string;
      issued_at: string;
      consultation_pillar: string;
      session_duration_minutes: number;
      astrologer: { name: string; title: string; avatar_url?: string };
      client: { name: string };
      sacred_prescription: {
        consecrated_gemstone: string;
        sacred_rudraksha: string;
        vedic_mantra: string;
        japa_count: number;
        daan_charity_ritual: string;
        sankalpa?: string;
        astrologer_guidance: string;
      };
      vedic_shlokas?: Array<{ sanskrit: string; transliteration?: string; meaning: string }>;
      verification_url: string;
      qr_code_url?: string;
      digital_seal: {
        verification_hash: string;
        seal_title: string;
        seal_motto: string;
        status: string;
        signature?: string;
      };
    }>(`/appointments/prescription/${id}/verify`, { auth: false }),

  joinStandby: (id: string) =>
    api.post<{ position: number }>(`/appointments/${id}/standby`, {}),

  joinChamber: (id: string) =>
    api.post<{
      call_id: string;
      room_id: string;
      token: string;
      starts_at: string;
      ends_at: string;
      minutes: number;
    }>(`/appointments/${id}/chamber`, {}),

  brahmaPauseAction: (
    id: string,
    body: { action: "reschedule" | "refund"; new_starts_at?: string; reason?: string },
  ) => api.post<Appointment>(`/appointments/${id}/brahma-pause-action`, body),

  updateBtr: (
    id: string,
    body: {
      birth_date: string;
      birth_time: string;
      birth_place: string;
      latitude?: number | null;
      longitude?: number | null;
      timezone_offset?: number | null;
      notes?: string | null;
    },
  ) => api.post<Appointment>(`/appointments/${id}/update-btr`, body),

  extensionAction: (id: string, action: "accept" | "decline") =>
    api.post<Appointment>(`/appointments/${id}/extension/action`, { action }),

  sendFollowUpMessage: (id: string, text: string) =>
    api.post<Appointment>(`/appointments/${id}/follow-up/message`, { text }),
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

  /** Classical 1-year resolution palm timeline forecast */
  timelineAge: (age: number, gender: string = "male") =>
    api.get<any>(endpoints.palmReading.timelineAge, {
      query: { age, gender },
      auth: false,
    }),

  /** Bilateral dual-hand synastry (Prarabdha vs Purushartha karma evolution) */
  dualMatch: (payload: {
    left_hand_image?: string;
    right_hand_image?: string;
    left_hand_measurements?: Record<string, any>;
    right_hand_measurements?: Record<string, any>;
    primary_handedness?: string;
  }) => api.post<any>(endpoints.palmReading.dualMatch, payload),
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

  /** Classical 100-year timeline forecast for a specific age */
  timelineAge: (age: number, gender: string = "male") =>
    api.get<any>(endpoints.faceReading.timelineAge, {
      query: { age, gender },
      auth: false,
    }),

  /** Samudrika couple facial synastry match */
  coupleMatch: (payload: {
    partner_a_image?: string;
    partner_b_image?: string;
    partner_a_measurements?: Record<string, number>;
    partner_b_measurements?: Record<string, number>;
    partner_a_name?: string;
    partner_b_name?: string;
  }) => api.post<any>(endpoints.faceReading.coupleMatch, payload),
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

  /** Reverse geocodes GPS coordinates into a structured postal address. */
  geoReverse: (lat: number, lon: number) =>
    api.get<{
      display_name: string;
      line1: string;
      line2: string;
      landmark: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      latitude: number;
      longitude: number;
    }>(endpoints.astrology.geoReverse, {
      query: { lat, lon },
      auth: false,
    }),

  /** Automatically detects postal location via client network IP address. */
  geoDetect: () =>
    api.get<{
      display_name: string;
      line1: string;
      line2: string;
      landmark: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      latitude: number;
      longitude: number;
    }>(endpoints.astrology.geoDetect, {
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

  /** Charge 10 coins to open a sign's detailed daily reading (idempotent per day). */
  unlockDailyHoroscope: (signIndex: number) =>
    api.post<{ charged: number; balance: number }>(
      endpoints.astrology.dailyUnlock,
      { sign_index: signIndex },
    ),

  /** 1-Year Annual Horoscope & Lal Kitab Varshphal Prediction Report. */
  annualHoroscope: (payload: AnnualHoroscopeRequest) =>
    api.post<AnnualHoroscopeResponse>(
      endpoints.astrology.annualHoroscope,
      payload,
    ),

  /** Get current feature pricing and availability for all astrology tools. */
  featuresPricing: () =>
    api.get<Record<string, FeaturePricingItem>>(endpoints.astrology.featuresPricing, { auth: false }),

  /** Dynamic Vedic Festival Calendar calculated via Swiss Ephemeris. */
  festivals: (year?: number, category?: string) => {
    const params = new URLSearchParams();
    if (year) params.append("year", String(year));
    if (category && category !== "all") params.append("category", category);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return api.get<WebFestivalCalendarResponse>(`${endpoints.astrology.festivals}${qs}`, { auth: false });
  },

  /** Dynamic Upcoming Vedic Festivals strictly from current date onwards. */
  upcomingFestivals: (limit = 15) =>
    api.get<WebFestivalItem[]>(`${endpoints.astrology.upcomingFestivals}?limit=${limit}`, { auth: false }),
};

export interface WebFestivalItem {
  id: string;
  name: Record<string, string>;
  date: string;
  date_formatted: Record<string, string>;
  day_of_week: Record<string, string>;
  tithi: Record<string, string>;
  category: "major" | "vrat" | "jayanti";
  badge: Record<string, string>;
  accent_color: string;
  muhurat: Record<string, string>;
  shloka: string;
  desc: Record<string, string>;
  rituals: Record<string, string[]>;
  days_remaining: number;
  is_today: boolean;
  is_upcoming: boolean;
  is_past: boolean;
}

export interface WebFestivalCalendarResponse {
  year: number;
  total_count: number;
  next_upcoming: WebFestivalItem | null;
  festivals: WebFestivalItem[];
  engine: string;
  calculated_at: string;
}

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
  NameCorrectionRequest,
  NameCorrectionResponse,
  MobileCompareRequest,
  MobileCompareResponse,
  BusinessNumerologyRequest,
  BusinessNumerologyResponse,
  VehicleBankAuditRequest,
  VehicleBankAuditResponse,
} from "@/types/numerology";

import type {
  VastuAuditRequest,
  VastuAuditResponse,
  PadaInfo,
  VastuZoneInfo,
  VastuRemedyItem,
  AyadiCalculationRequest,
  AyadiCalculationResponse,
  MedicalVastuItem,
  AstroVastuRule,
} from "@/types/vastu";

export const numerologyApi = {
  calculate: (body: NumerologyCalculateRequest) =>
    api.post<NumerologyCalculateResponse>(endpoints.numerology.calculate, body),

  analyzeName: (body: { name: string; mulank?: number; bhagyank?: number }) =>
    api.post<NameAnalysisResponse>(endpoints.numerology.name, body),

  correctName: (body: NameCorrectionRequest) =>
    api.post<NameCorrectionResponse>(endpoints.numerology.nameCorrect, body),

  analyzeMobile: (body: { mobile_number: string; mulank?: number; bhagyank?: number; birth_date?: string }) =>
    api.post<MobileAnalysisResponse>(endpoints.numerology.mobile, body),

  compareMobile: (body: MobileCompareRequest) =>
    api.post<MobileCompareResponse>(endpoints.numerology.mobileCompare, body),

  evaluateBusiness: (body: BusinessNumerologyRequest) =>
    api.post<BusinessNumerologyResponse>(endpoints.numerology.business, body),

  auditVehicleBank: (body: VehicleBankAuditRequest) =>
    api.post<VehicleBankAuditResponse>(endpoints.numerology.vehicleBank, body),

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

  calculateAyadi: (body: AyadiCalculationRequest) =>
    api.post<AyadiCalculationResponse>(endpoints.vastu.ayadi, body),

  getMedicalCatalog: () =>
    api.get<MedicalVastuItem[]>(endpoints.vastu.medical),

  getAstroVastuRules: (planet_id?: string) =>
    api.get<AstroVastuRule[]>(endpoints.vastu.astrovastu, { query: planet_id ? { planet_id } : undefined }),
};

export interface HeroSlide {
  id?: string;
  title: string;
  subtitle: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  badge_text: string;
  badge_rating?: string;
  image_url: string;
  bg_gradient?: string;
  border_color?: string;
}

export interface HeroCardConfig {
  title: string;
  subtitle: string;
  link: string;
  icon: string;
}

export interface TrustStatConfig {
  value: string;
  label: string;
}

export interface HomePageCMSData {
  hero_slides?: HeroSlide[];
  hero_eyebrow?: string;
  hero_title_line1?: string;
  hero_title_line2?: string;
  hero_title_highlight?: string;
  hero_description?: string;
  hero_cta_primary_text?: string;
  hero_cta_primary_link?: string;
  hero_cta_secondary_text?: string;
  hero_cta_secondary_link?: string;
  hero_chakra_image_url?: string;
  hero_chakra_speed_seconds?: number;
  hero_chakra_enabled?: boolean;
  hero_cards?: HeroCardConfig[];
  trust_stats?: TrustStatConfig[];
  services_eyebrow?: string;
  services_title?: string;
  services_description?: string;
  how_it_works_badge?: string;
  how_it_works_title?: string;
  step1_title?: string;
  step1_body?: string;
  step2_title?: string;
  step2_body?: string;
  step3_title?: string;
  step3_body?: string;
  cta_badge?: string;
  cta_title?: string;
  cta_description?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
}

export const cmsApi = {
  getHomepage: () => api.get<HomePageCMSData>(endpoints.cms.homepage, { auth: false }),
};

export const tarotApi = {
  getDeck: (params?: { arcana?: string; suit?: string }) =>
    api.get<TarotCard[]>(endpoints.tarot.deck, { query: params, auth: false }),
  getCard: (id: string) =>
    api.get<TarotCard>(endpoints.tarot.card(id), { auth: false }),
  getSpreads: () =>
    api.get<SpreadConfig[]>(endpoints.tarot.spreads, { auth: false }),
  getSpread: (id: string) =>
    api.get<SpreadConfig>(endpoints.tarot.spread(id), { auth: false }),
  draw: (body: TarotDrawRequest) =>
    api.post<TarotDrawResponse>(endpoints.tarot.draw, body),
  daily: (body: DailyTarotRequest) =>
    api.post<TarotDrawResponse>(endpoints.tarot.daily, body),
};

export interface PasskeyInfo {
  id: string;
  credential_id: string;
  device_name: string;
  transports: string[];
  created_at: string;
  last_used_at: string | null;
}

export const passkeyApi = {
  getRegisterOptions: () => api.post<any>(endpoints.passkeys.registerOptions),
  verifyRegistration: (body: { credential: any; device_name?: string }) =>
    api.post<PasskeyInfo>(endpoints.passkeys.registerVerify, body),
  listMine: () => api.get<PasskeyInfo[]>(endpoints.passkeys.mine),
  delete: (id: string) => api.delete<{ deleted: boolean }>(endpoints.passkeys.delete(id)),
  getLoginOptions: (body?: { email?: string }) =>
    api.post<any>(endpoints.passkeys.loginOptions, body || {}, { auth: false }),
  verifyLogin: (body: { credential: any }) =>
    api.post<AuthResult>(endpoints.passkeys.loginVerify, body, { auth: false }),
};

// ------------------------------------------------------------ Astra AstroStore Public API
export interface ShopProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon_url?: string | null;
  banner_url?: string | null;
  category_type: string;
  product_count: number;
}

export interface ShopProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  short_description: string;
  detailed_description: string;
  category_id: string;
  category_slug: string;
  category_type: string;
  ruling_planet?: string | null;
  deity?: string | null;
  benefits: string[];
  life_pillars: string[];
  purpose_tags?: string[];
  recommended_for_rashis?: string[];
  crystal_type?: string | null;
  beej_mantra?: string | null;
  wear_instructions?: string | null;
  mrp: number;
  sale_price: number;
  discount_percent: number;
  stock_quantity: number;
  in_stock: boolean;
  featured_image: string;
  images: string[];
  free_gift_title?: string | null;
  free_gift_value?: number | null;
  free_gift_badge?: string | null;
  free_gift_image_url?: string | null;
  cashback_percent?: number | null;
  lab_certified?: boolean;
  lab_certificate_name?: string | null;
  lab_certificate_number?: string | null;
  certificate_image_url?: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_energized: boolean;
  average_rating: number;
  review_count: number;
}

export interface ShopHeroBannerItem {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  badge_text?: string | null;
  image_url: string;
  is_active: boolean;
}

export interface ShopStoreReelItem {
  id: string;
  user_handle: string;
  user_name?: string | null;
  rating: number;
  quote: string;
  thumbnail_url: string;
  video_url?: string | null;
  likes_count: string;
  tagged_product_title?: string | null;
  tagged_product_price?: number | null;
  tagged_product_slug?: string | null;
  is_active: boolean;
}

export interface ShopBannerSettings {
  announcement_bar_text?: string | null;
  announcement_bar_link?: string | null;
  announcement_bar_active: boolean;
  marquee_items?: string[];
  hero_banners: ShopHeroBannerItem[];
  cashback_enabled?: boolean;
  cashback_percent?: number;
  free_gift_default_title?: string;
  free_gift_default_value?: number;
  free_gift_default_badge?: string;
  free_shipping_threshold?: number;
  standard_shipping_fee?: number;
  cod_enabled?: boolean;
  cancellation_grace_hours?: number;
  refund_sla_days?: number;
  reels?: ShopStoreReelItem[];
}

export interface ShopCheckoutPayload {
  items: { product_id: string; quantity: number }[];
  shipping_address: {
    recipient_name: string;
    phone_number: string;
    alternate_phone?: string;
    address_line1: string;
    address_line2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    address_type?: string;
  };
  sankalpa?: {
    devotee_name?: string;
    gotra?: string;
    date_of_birth?: string;
    birth_time?: string;
    birth_place?: string;
    special_prayer_wish?: string;
  };
  payment_method: "razorpay" | "cod" | "wallet";
  coupon_code?: string;
}

export interface ShopCheckoutResult {
  order_id: string;
  order_number: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  grand_total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  razorpay_order_id?: string | null;
  razorpay_key_id?: string | null;
  cashback_percent: number;
  cashback_coins_eligible: number;
  free_gifts: any[];
}

export interface ShopOrder {
  id: string;
  order_number: string;
  user_id: string;
  user_email: string;
  user_phone: string;
  shipping_address: any;
  items: any[];
  sankalpa?: any;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  grand_total: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  razorpay_order_id?: string | null;
  cashback_percent: number;
  cashback_coins_eligible: number;
  cashback_coins_credited: number;
  cashback_credited_at?: string | null;
  free_gifts: any[];
  courier_partner?: string | null;
  tracking_id?: string | null;
  tracking_url?: string | null;
  estimated_delivery_date?: string | null;
  delivered_at?: string | null;
  consecration_certificate_url?: string | null;
  refund_status?: string | null;
  refund_amount?: number | null;
  refund_upi_id?: string | null;
  refund_qr_code_url?: string | null;
  refund_requested_at?: string | null;
  refund_sla_days?: number | null;
  refund_completed_at?: string | null;
  refund_transaction_id?: string | null;
  refund_notes?: string | null;
  status_history: any[];
  created_at: string;
}

export interface PincodeResult {
  pincode: string;
  city: string;
  state: string;
  is_serviceable: boolean;
  cod_available: boolean;
  cod_disabled_reason?: string | null;
  estimated_delivery_days: number;
  estimated_delivery_date: string;
}

export interface ShopProductListResponse {
  items: ShopProduct[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface StockReservationResponse {
  success: boolean;
  reserved: boolean;
  product_id: string;
  quantity: number;
  message: string;
}

export interface ShopCouponRecommendation {
  code: string;
  title: string;
  description?: string | null;
  discount_type: "percentage" | "flat" | string;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  discount_amount: number;
  is_applicable: boolean;
  reason_if_inapplicable?: string | null;
  is_best_offer: boolean;
  is_first_order_deal: boolean;
  expiry_date?: string | null;
}

export interface ShopCouponRecommendationsResponse {
  items: ShopCouponRecommendation[];
  best_coupon_code?: string | null;
  max_savings: number;
  user_orders_count: number;
}

export interface ShopCouponValidateResponse {
  is_valid: boolean;
  code: string;
  discount_amount: number;
  new_subtotal: number;
  message: string;
  coupon?: any;
}

export const shopApi = {
  getBanners: () =>
    api.get<ShopBannerSettings>(endpoints.shop.banners, { auth: false }),

  getCategories: () =>
    api.get<ShopProductCategory[]>(endpoints.shop.categories, { auth: false }),

  getProducts: (params?: {
    search?: string;
    category_id?: string;
    ruling_planet?: string;
    in_stock_only?: boolean;
    is_featured?: boolean;
    page?: number;
    limit?: number;
    sort_by?: string;
  }) =>
    api.get<ShopProductListResponse>(endpoints.shop.products, {
      query: params,
      auth: false,
    }),

  getProductDetail: (idOrSlug: string) =>
    api.get<ShopProduct>(endpoints.shop.product(idOrSlug), { auth: false }),

  getRecommendations: (params?: {
    planet?: string;
    dosha?: string;
    rashi?: string;
    life_pillar?: string;
    lang?: string;
    limit?: number;
  }) =>
    api.get<any[]>(endpoints.shop.recommendations, {
      query: params,
      auth: false,
    }),

  reserveStock: (productId: string, quantity = 1) =>
    api.post<StockReservationResponse>(endpoints.shop.reserveStock, {
      product_id: productId,
      quantity,
    }),

  releaseStock: (productId: string, quantity = 1) =>
    api.post<StockReservationResponse>(endpoints.shop.releaseStock, {
      product_id: productId,
      quantity,
    }),

  checkPincode: (pincode: string, phone?: string) =>
    api.get<PincodeResult>(endpoints.shop.checkPincode(pincode, phone), { auth: false }),

  checkout: (payload: ShopCheckoutPayload) =>
    api.post<ShopCheckoutResult>(endpoints.shop.checkout, payload, { auth: true }),

  verifyPayment: (payload: {
    order_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    api.post<ShopOrder>(endpoints.shop.verifyPayment, payload, { auth: true }),

  getMyOrders: (page = 1, limit = 20) =>
    api.get<{ items: ShopOrder[]; total: number; page: number; limit: number; pages: number }>(
      endpoints.shop.myOrders,
      { query: { page, limit }, auth: true }
    ),

  getOrderDetail: (orderKey: string) =>
    api.get<ShopOrder>(endpoints.shop.orderDetail(orderKey), { auth: true }),

  cancelOrder: (
    orderKey: string,
    payload?: {
      reason?: string;
      upi_id?: string;
      qr_code_url?: string;
      qr_code_public_id?: string;
    }
  ) =>
    api.post<ShopOrder>(endpoints.shop.cancelOrder(orderKey), payload || {}, { auth: true }),

  uploadRefundQr: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiFetch<{ url: string; public_id: string }>(
      endpoints.shop.uploadRefundQr,
      {
        method: "POST",
        body: fd,
      }
    );
  },

  validateCoupon: (code: string, subtotal: number) =>
    api.post<ShopCouponValidateResponse>(
      endpoints.shop.couponsValidate,
      { code, subtotal },
      { auth: false }
    ),

  getCouponRecommendations: (subtotal: number) =>
    api.post<ShopCouponRecommendationsResponse>(
      `${endpoints.shop.couponsRecommendations}?subtotal=${subtotal}`,
      {},
      { auth: false }
    ),

  getProductReviews: (
    slug: string,
    params?: { page?: number; limit?: number; rating?: number; sort?: string }
  ) =>
    api.get<ProductReviewsResponse>(endpoints.shop.productReviews(slug), {
      query: params,
      auth: false,
    }),

  checkReviewEligibility: (slug: string) =>
    api.get<ReviewEligibilityResponse>(endpoints.shop.productReviewEligibility(slug), {
      auth: true,
    }),

  submitProductReview: (slug: string, body: ProductReviewCreateInput) =>
    api.post<ProductReviewItem>(endpoints.shop.submitProductReview(slug), body, {
      auth: true,
    }),

  updateProductReview: (slug: string, body: ProductReviewUpdateInput) =>
    api.put<ProductReviewItem>(endpoints.shop.updateProductReview(slug), body, {
      auth: true,
    }),

  toggleReviewHelpful: (reviewId: string) =>
    api.post<{ helpful_count: number; is_helpful_by_me: boolean }>(
      endpoints.shop.reviewHelpful(reviewId),
      {},
      { auth: true }
    ),

  uploadReviewPhoto: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiFetch<{ url: string; public_id: string }>(
      endpoints.shop.uploadReviewPhoto,
      {
        method: "POST",
        body: fd,
      }
    );
  },

  getOrderInvoice: (orderKey: string) =>
    api.get<OrderInvoiceData>(endpoints.shop.orderInvoice(orderKey), { auth: true }),

  getOrderInvoiceHtmlUrl: (orderKey: string, print = true) =>
    `${apiBase}${endpoints.shop.orderInvoiceHtml(orderKey)}?print=${print}`,
};

export interface OrderInvoiceSeller {
  legal_name: string;
  trade_name: string;
  address: string;
  state: string;
  state_code: string;
  phone: string;
  email: string;
  website: string;
  pan: string;
  gstin: string;
  is_gst_registered: boolean;
}

export interface OrderInvoiceBuyer {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gotra?: string | null;
  sankalpa?: string | null;
}

export interface OrderInvoiceItem {
  title: string;
  sku: string;
  energization: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  is_free_gift: boolean;
}

export interface OrderInvoiceData {
  invoice_number: string;
  order_id: string;
  order_key: string;
  invoice_date: string;
  created_at: string;
  payment_method: string;
  payment_status: string;
  seller: OrderInvoiceSeller;
  buyer: OrderInvoiceBuyer;
  items: OrderInvoiceItem[];
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  tax_rate_percent: number;
  tax_amount: number;
  tax_label: string;
  total_amount: number;
  invoice_mode: string;
  footer_notes: string;
  blessing_note: string;
}

export interface ProductReviewItem {
  id: string;
  product_id: string;
  product_slug: string;
  user_id: string;
  order_id: string;
  rating: number;
  title: string | null;
  comment: string;
  images: string[];
  is_verified_buyer: boolean;
  author_name: string;
  author_avatar: string | null;
  helpful_count: number;
  is_helpful_by_me: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductRatingBreakdown {
  stars_5: number;
  stars_4: number;
  stars_3: number;
  stars_2: number;
  stars_1: number;
  stars_5_pct: number;
  stars_4_pct: number;
  stars_3_pct: number;
  stars_2_pct: number;
  stars_1_pct: number;
}

export interface ProductReviewsResponse {
  items: ProductReviewItem[];
  total: number;
  average_rating: number;
  breakdown: ProductRatingBreakdown;
  page: number;
  limit: number;
  pages: number;
}

export interface ReviewEligibilityResponse {
  can_review: boolean;
  already_reviewed: boolean;
  is_delivered_buyer: boolean;
  reason?: string | null;
  existing_review?: ProductReviewItem | null;
  order_id?: string | null;
}

export interface ProductReviewCreateInput {
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
}

export interface ProductReviewUpdateInput {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export const courseApi = {
  getCourses: (params?: {
    category?: string;
    level?: string;
    search?: string;
    limit?: number;
    skip?: number;
  }) =>
    api.get<CourseListItem[]>(endpoints.courses.list, {
      query: params,
      auth: true,
    }),

  getCourseDetail: (slug: string) =>
    api.get<CourseDetail>(endpoints.courses.detail(slug)),

  getMyEnrolledCourses: () =>
    api.get<CourseEnrollment[]>(endpoints.courses.myEnrolled),

  createOrder: (courseId: string) =>
    api.post<CourseOrderCreateResponse>(endpoints.courses.createOrder(courseId)),

  verifyPayment: (courseId: string, payload: CoursePaymentVerifyRequest) =>
    api.post<{ success: boolean; enrollment_id: string; course_id: string; course_slug: string }>(
      endpoints.courses.verifyPayment(courseId),
      payload
    ),

  syncPayment: (courseId: string, payload?: { razorpay_order_id?: string | null }) =>
    api.post<CoursePaymentSyncResponse>(
      endpoints.courses.syncPayment(courseId),
      payload ?? {}
    ),

  getLessonStream: (courseId: string, lessonId: string) =>
    api.get<LessonStreamData>(endpoints.courses.lessonStream(courseId, lessonId)),

  updateProgress: (
    courseId: string,
    lessonId: string,
    payload: { watched_seconds: number; total_seconds: number; mark_completed?: boolean }
  ) =>
    api.post<{ progress_percent: number; is_lesson_completed: boolean; certificate_issued: boolean; certificate_id?: string; certificate_url?: string; message?: string | null }>(
      endpoints.courses.lessonProgress(courseId, lessonId),
      payload
    ),

  getQuestions: (
    courseId: string,
    lessonId: string,
    params?: { sort?: "newest" | "timestamp" | "upvotes"; limit?: number; skip?: number }
  ) =>
    api.get<CourseQuestion[]>(endpoints.courses.questions(courseId, lessonId), {
      query: params,
    }),

  askQuestion: (
    courseId: string,
    lessonId: string,
    payload: { title: string; content: string; timestamp_seconds?: number }
  ) =>
    api.post<CourseQuestion>(endpoints.courses.questions(courseId, lessonId), payload),

  upvoteQuestion: (questionId: string) =>
    api.post<{ question_id: string; upvote_count: number; is_upvoted_by_me: boolean }>(
      endpoints.courses.upvoteQuestion(questionId)
    ),

  answerQuestion: (questionId: string, content: string) =>
    api.post<CourseQuestionAnswer>(endpoints.courses.answerQuestion(questionId), { content }),

  getCertificate: (courseId: string) =>
    api.get<CourseCertificate>(endpoints.courses.certificate(courseId)),

  verifyCertificate: (certificateId: string, sig?: string) =>
    api.get<CourseCertificate>(endpoints.courses.verifyCertificate(certificateId), {
      query: sig ? { sig } : undefined,
      auth: false,
    }),

  getCertificateHtmlUrl: (courseId: string) =>
    `${process.env.NEXT_PUBLIC_API_URL || "https://astra-astrology-backend.onrender.com/api/v1"}${endpoints.courses.certificateHtml(courseId)}`,

  getVerifyCertificateHtmlUrl: (certificateId: string) =>
    `${process.env.NEXT_PUBLIC_API_URL || "https://astra-astrology-backend.onrender.com/api/v1"}${endpoints.courses.verifyCertificateHtml(certificateId)}`,
};

// ------------------------------------------------------------------ Purohit & Live Puja
export interface PurohitPujaItem {
  id: string;
  puja_name: string;
  description: string;
  duration_minutes: number;
  price_inr: number;
  samagri_notes?: string | null;
  is_active: boolean;
}

export interface PurohitData {
  id: string;
  user_id: string;
  display_name: string;
  slug: string;
  title: string;
  bio?: string | null;
  avatar_url?: string | null;
  experience_years: number;
  languages: string[];
  city?: string | null;
  state?: string | null;
  is_online: boolean;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  total_pujas_performed: number;
  starting_price_inr: number;
  pujas: PurohitPujaItem[];
  created_at: string;
  updated_at: string;
}

export interface PujaBookingData {
  id: string;
  booking_number: string;
  user_id: string;
  user_name: string;
  user_phone?: string | null;
  user_email?: string | null;
  purohit_id: string;
  purohit_name: string;
  puja_item_id: string;
  puja_name: string;
  puja_duration_minutes: number;
  amount_inr: number;
  sankalpa_name: string;
  sankalpa_gotra: string;
  sankalpa_wish?: string | null;
  room_id: string;
  zego_app_id?: number;
  zego_token?: string | null;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export const purohitApi = {
  list: (params?: {
    online_only?: boolean;
    search_puja?: string;
    language?: string;
    limit?: number;
    offset?: number;
  }) =>
    api.get<PurohitData[]>(endpoints.purohits.list, {
      query: params,
      auth: false,
    }),

  get: (idOrSlug: string) =>
    api.get<PurohitData>(endpoints.purohits.detail(idOrSlug), {
      auth: false,
    }),

  book: (body: {
    purohit_id: string;
    puja_item_id: string;
    sankalpa_name: string;
    sankalpa_gotra: string;
    sankalpa_wish?: string | null;
  }) => api.post<PujaBookingData>(endpoints.purohits.book, body),

  getMyBookings: () =>
    api.get<PujaBookingData[]>(endpoints.purohits.myBookings),

  getRoomToken: (bookingId: string) =>
    api.get<PujaBookingData>(endpoints.purohits.roomToken(bookingId)),
};




