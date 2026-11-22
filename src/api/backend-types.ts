/**
 * DTO backend sesuai contracts/openapi.yaml resmi (Laravel).
 *
 * Tipe-tipe ini sengaja dipisah dari `src/types/api.ts` (view model UI).
 * ID backend berupa integer; adapter di `src/api/adapters.ts` memetakannya
 * ke view model yang sudah dipakai komponen (ID string, field UI).
 */

export type BackendSessionPhase =
  | 'pretest'
  | 'exploration'
  | 'posttest'
  | 'self_efficacy'
  | 'completed';

export interface BackendSchool {
  id: number;
  name: string;
}

export interface BackendClassroom {
  id: number;
  name: string;
}

export interface BackendStudentProfile {
  id: number;
  name: string;
  student_number: string;
  school: BackendSchool;
  classrooms: BackendClassroom[];
}

export interface BackendAuthenticatedStudent {
  id: number;
  email: string;
  respondent_code: string | null;
  student_profile: BackendStudentProfile | null;
}

export interface BackendLoginData {
  token: string;
  user: BackendAuthenticatedStudent;
}

export interface BackendHeritageSite {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  cover_image_url: string;
}

export interface BackendPanoramaNodeSummary {
  id: number;
  name: string;
  slug: string;
  panorama_url: string;
}

export interface BackendHeritageArea {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  panorama_nodes: BackendPanoramaNodeSummary[];
}

export interface BackendHeritageSiteReference {
  id: number;
  name: string;
  slug: string;
}

export interface BackendHeritageAreaReference {
  id: number;
  name: string;
  slug: string;
  heritage_site: BackendHeritageSiteReference;
}

export interface BackendHeritageObjectSummary {
  id: number;
  name: string;
  slug: string;
}

export interface BackendHeritageObject extends BackendHeritageObjectSummary {
  description: string | null;
}

export interface BackendPanoramaLink {
  id: number;
  label: string;
  yaw: number;
  pitch: number;
  target: BackendPanoramaNodeSummary;
}

export interface BackendPanoramaAnnotation {
  id: number;
  heritage_object: BackendHeritageObjectSummary;
}

export interface BackendPanoramaNode extends BackendPanoramaNodeSummary {
  area: BackendHeritageAreaReference;
  links: BackendPanoramaLink[];
  annotations: BackendPanoramaAnnotation[];
}

export interface BackendLearningSession {
  id: number;
  respondent_code: string;
  phase: BackendSessionPhase;
  current_panorama_node: BackendPanoramaNodeSummary | null;
  created_at: string;
  updated_at: string;
  write_token?: string;
}

export interface BackendRequiredPanoramaProgress {
  panorama_node_id: number;
  completed: boolean;
}

export interface BackendRequiredMaterialProgress {
  heritage_object_id: number;
  completed: boolean;
}

export interface BackendRequiredQuizProgress {
  quiz_id: number;
  completed: boolean;
}

export interface BackendExplorationProgress {
  panorama_visits: BackendRequiredPanoramaProgress[];
  learning_materials: BackendRequiredMaterialProgress[];
  micro_quizzes: BackendRequiredQuizProgress[];
  completed: boolean;
}

export interface BackendGeometryShape {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface BackendGeometryMappingSummary {
  semantics: string;
  geometry_shape: BackendGeometryShape;
}

export interface BackendLearningObjective {
  id: number;
  title: string;
  content: string;
  position: number;
}

export interface BackendMaterialGeometryMapping extends BackendGeometryMappingSummary {
  micro_quiz_id: number | null;
  learning_objectives: BackendLearningObjective[];
}

export interface BackendLearningMaterial {
  heritage_object: BackendHeritageObject;
  geometry_mappings: BackendMaterialGeometryMapping[];
}

export interface BackendMlDetection {
  class: string;
  confidence: number;
  bounding_box: number[];
  heritage_object: BackendHeritageObject | null;
  geometry_mappings: BackendGeometryMappingSummary[];
}

export interface BackendMlPrediction {
  model_version: string;
  inference_ms: number;
  total_latency_ms: number;
  detections: BackendMlDetection[];
}

export interface BackendQuizOption {
  id: number;
  text: string;
  position: number;
}

export interface BackendQuizQuestion {
  id: number;
  prompt: string;
  position: number;
  options: BackendQuizOption[];
}

export interface BackendMicroQuiz {
  id: number;
  title: string;
  heritage_geometry_mapping: {
    id: number;
    semantics: string;
    heritage_object: BackendHeritageObjectSummary;
    geometry_shape: BackendGeometryShape;
  };
  questions: BackendQuizQuestion[];
}

export interface BackendQuizAttempt {
  id: number;
  quiz_id: number;
  status: 'draft' | 'submitted';
  score: number | null;
  submitted_at: string | null;
  created_at: string;
}

export interface BackendQuizAnswer {
  id: number;
  question_id: number;
  selected_option_id: number;
  is_correct: boolean;
  feedback: string;
  answered_at: string;
}

export interface BackendAssessmentOption {
  id: number;
  text: string;
  position: number;
}

export interface BackendAssessmentItem {
  id: number;
  prompt: string;
  position: number;
  selected_option_id: number | null;
  options: BackendAssessmentOption[];
}

export type BackendAssessmentType = 'pretest' | 'posttest' | 'self_efficacy';

export interface BackendAssessmentAttempt {
  id: number;
  type: BackendAssessmentType;
  title: string;
  status: 'draft' | 'submitted';
  submitted_at: string | null;
  items: BackendAssessmentItem[];
  created_at: string;
  updated_at: string;
}

export interface BackendCompletedSessionResult {
  id: number;
  phase: 'completed';
  pretest_score: number | null;
  posttest_score: number | null;
  activity_summary: {
    panoramas_visited: number;
    materials_viewed: number;
    micro_quizzes_completed: number;
  };
}
