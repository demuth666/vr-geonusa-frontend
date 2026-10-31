// Tipe-tipe ini mengikuti contracts/openapi.yaml (provisional — lihat catatan
// di file itu). Saat backend merilis OpenAPI resmi, sinkronkan ulang tipe di
// sini (idealnya generate otomatis), tapi bentuk penggunaannya di
// hooks/komponen seharusnya tidak banyak berubah.

export interface HeritageSite {
  id: string;
  slug: string;
  name: string;
  location: string;
  cover_image_url: string;
  short_description: string;
  description: string;
  learning_objectives: string[];
  experience_features: string[];
  available_areas_count: number;
  status: 'available' | 'coming_soon';
}

export interface HeritageArea {
  id: string;
  heritage_site_id: string;
  name: string;
  panorama_node_ids: string[];
}

export interface PanoramaHotspot {
  id: string;
  target_node_id: string;
  yaw: number;
  pitch: number;
  label: string;
}

export interface PanoramaNode {
  id: string;
  heritage_site_id: string;
  name: string;
  image_url: string;
  initial_yaw: number;
  initial_pitch: number;
  hotspots: PanoramaHotspot[];
}

export interface StudentProfile {
  id: string;
  name: string;
  school?: string;
  grade?: string;
}

export type SessionPhase =
  | 'pretest'
  | 'exploration'
  | 'posttest'
  | 'self_efficacy'
  | 'completed';

export interface LearningSession {
  id: string;
  heritage_site_id: string;
  phase: SessionPhase;
  next_step: string;
  current_panorama_node_id: string | null;
  progress_percentage: number;
  /**
   * Hanya dikirim backend sesaat setelah session dibuat/di-resume.
   * Disimpan di memory saja (lihat src/api/session-token.ts) — tidak pernah
   * di localStorage, URL, log, atau UI. Lihat PRD #20.
   */
  write_token?: string;
}

export interface SessionProgress {
  percentage: number;
  requirements: {
    required_panorama_visited: boolean;
    geometry_identified: boolean;
    learning_material_viewed: boolean;
    micro_quiz_completed: boolean;
  };
  can_finish: boolean;
}

export interface MlDetection {
  heritage_object_id: string;
  label: string;
  confidence: number;
}

export interface MlPredictionResult {
  detections: MlDetection[];
}

export interface GeometryApproximation {
  shape_name: string;
  formula: string;
  description: string;
  cultural_context: string;
  culture_geometry_relation: string;
}

export interface LearningMaterial {
  heritage_object_id: string;
  heritage_object_name: string;
  learning_objective: string;
  geometry: GeometryApproximation;
  micro_quiz_id: string | null;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export interface MicroQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  submitted: boolean;
}

export interface QuizAnswerResult {
  question_id: string;
  is_correct: boolean;
  feedback: string;
}

export type AssessmentInstrument = 'pretest' | 'posttest' | 'self_efficacy';

export interface AssessmentItem {
  id: string;
  prompt: string;
  options: QuizOption[];
}

export interface AssessmentAttempt {
  id: string;
  instrument: AssessmentInstrument;
  items: AssessmentItem[];
  /** index soal yang sedang dijawab terakhir kali, buat resume lokal saja (UI, bukan source of truth skor). */
  current_index: number;
  submitted: boolean;
}

export interface SessionResult {
  session_id: string;
  heritage_site_name: string;
  panoramas_visited: number;
  objects_learned: number;
  activities_completed: number;
}

export interface ApiErrorShape {
  status: number;
  code: string;
  message: string;
}
