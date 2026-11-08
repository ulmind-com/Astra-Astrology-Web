export interface CourseListItem {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  level: string;
  language: string;
  instructor_name: string;
  instructor_title: string;
  instructor_avatar?: string | null;
  thumbnail_url: string;
  price: number;
  mrp: number;
  discount_percent: number;
  currency: string;
  duration_hours: number;
  total_lessons: number;
  total_students: number;
  average_rating: number;
  rating_count: number;
  is_featured: boolean;
  certificate_enabled: boolean;
}

export interface LessonResource {
  title: string;
  url: string;
  type: string;
}

export interface CourseLesson {
  id: string;
  section_id: string;
  title: string;
  order: number;
  duration_minutes: number;
  is_free_preview: boolean;
  summary?: string | null;
  resources_count: number;
  video_provider?: string | null;
  video_id?: string | null;
  is_completed: boolean;
}

export interface CourseSection {
  id: string;
  title: string;
  order: number;
  description?: string | null;
  lessons: CourseLesson[];
}

export interface CourseDetail extends CourseListItem {
  description: string;
  promo_video_url?: string | null;
  promo_video_provider: string;
  what_you_will_learn: string[];
  prerequisites: string[];
  tags: string[];
  sections: CourseSection[];
  is_enrolled: boolean;
  user_progress_percent: number;
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  course_title?: string | null;
  course_slug?: string | null;
  thumbnail_url?: string | null;
  instructor_name?: string | null;
  enrolled_at: string;
  expires_at?: string | null;
  progress_percent: number;
  completed_lesson_ids: string[];
  certificate_issued: boolean;
  certificate_url?: string | null;
}

export interface LessonStreamData {
  lesson_id: string;
  title: string;
  video_provider: string;
  video_id: string;
  library_id?: string | null;
  embed_url: string;
  token?: string | null;
  expires_at?: number | null;
  watermark_text?: string | null;
  notes_markdown?: string | null;
  resources: LessonResource[];
}

export interface CourseOrderCreateResponse {
  free_enrolled: boolean;
  order_id?: string | null;
  amount_paise: number;
  amount_inr: number;
  currency: string;
  key_id?: string | null;
  course_id: string;
  course_title: string;
  course_slug: string;
}

export interface CoursePaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
