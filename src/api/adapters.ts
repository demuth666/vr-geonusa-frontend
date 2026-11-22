import type {
  BackendAssessmentAttempt,
  BackendAuthenticatedStudent,
  BackendCompletedSessionResult,
  BackendExplorationProgress,
  BackendHeritageArea,
  BackendHeritageSite,
  BackendLearningMaterial,
  BackendLearningSession,
  BackendMicroQuiz,
  BackendMlPrediction,
  BackendPanoramaNode,
  BackendQuizAnswer,
  BackendQuizAttempt,
} from '@/api/backend-types';
import type {
  AssessmentAttempt,
  HeritageArea,
  HeritageSite,
  LearningMaterial,
  LearningSession,
  MicroQuiz,
  MlPredictionResult,
  PanoramaNode,
  QuizAnswerResult,
  QuizAttempt,
  SessionProgress,
  SessionResult,
  StudentProfile,
} from '@/types/api';

const id = (value: number | string): string => String(value);

export function mapStudentProfile(user: BackendAuthenticatedStudent): StudentProfile {
  const profile = user.student_profile;

  return {
    id: id(user.id),
    name: profile?.name ?? user.email,
    email: user.email,
    respondent_code: user.respondent_code,
    student_number: profile?.student_number,
    school: profile?.school.name,
    grade: undefined,
  };
}

export function mapHeritageSite(site: BackendHeritageSite): HeritageSite {
  return {
    id: id(site.id),
    slug: site.slug,
    name: site.name,
    // The backend does not model marketing location/status fields yet. The
    // UI hides sections whose content is empty instead of inventing content.
    location: '',
    cover_image_url: site.cover_image_url,
    short_description: site.description ?? '',
    description: site.description ?? '',
    learning_objectives: [],
    experience_features: [],
    available_areas_count: 0,
    status: 'available',
  };
}

export function mapHeritageArea(area: BackendHeritageArea): HeritageArea {
  return {
    id: id(area.id),
    heritage_site_id: '',
    name: area.name,
    panorama_node_ids: area.panorama_nodes.map((node) => id(node.id)),
  };
}

export function mapPanoramaNode(node: BackendPanoramaNode): PanoramaNode {
  return {
    id: id(node.id),
    heritage_site_id: id(node.area.heritage_site.id),
    name: node.name,
    image_url: node.panorama_url,
    // Panorama orientation is not part of the API contract yet.
    initial_yaw: 0,
    initial_pitch: 0,
    hotspots: node.links.map((link) => ({
      id: id(link.id),
      target_node_id: id(link.target.id),
      yaw: link.yaw,
      pitch: link.pitch,
      label: link.label,
    })),
  };
}

export function mapLearningSession(session: BackendLearningSession): LearningSession {
  return {
    id: id(session.id),
    heritage_site_id: '',
    phase: session.phase,
    next_step: session.phase,
    current_panorama_node_id: session.current_panorama_node
      ? id(session.current_panorama_node.id)
      : null,
    progress_percentage: 0,
    write_token: session.write_token,
  };
}

export function mapExplorationProgress(progress: BackendExplorationProgress): SessionProgress {
  const checks = [
    ...progress.panorama_visits.map((item) => item.completed),
    ...progress.learning_materials.map((item) => item.completed),
    ...progress.micro_quizzes.map((item) => item.completed),
  ];
  const total = checks.length;
  const completed = checks.filter(Boolean).length;
  const all = (values: boolean[]) => values.every(Boolean);

  return {
    percentage: total === 0 ? (progress.completed ? 100 : 0) : Math.round((completed / total) * 100),
    requirements: {
      required_panorama_visited: all(progress.panorama_visits.map((item) => item.completed)),
      geometry_identified: all(progress.learning_materials.map((item) => item.completed)),
      learning_material_viewed: all(progress.learning_materials.map((item) => item.completed)),
      micro_quiz_completed: all(progress.micro_quizzes.map((item) => item.completed)),
    },
    can_finish: progress.completed,
  };
}

export function mapMlPrediction(prediction: BackendMlPrediction): MlPredictionResult {
  return {
    model_version: prediction.model_version,
    inference_ms: prediction.inference_ms,
    total_latency_ms: prediction.total_latency_ms,
    detections: prediction.detections.flatMap((detection) => {
      if (!detection.heritage_object) return [];

      return [
        {
          heritage_object_id: id(detection.heritage_object.id),
          label: detection.heritage_object.name,
          confidence: detection.confidence,
        },
      ];
    }),
  };
}

export function mapLearningMaterial(material: BackendLearningMaterial): LearningMaterial {
  const mapping = material.geometry_mappings[0];
  const shape = mapping?.geometry_shape;

  return {
    heritage_object_id: id(material.heritage_object.id),
    heritage_object_name: material.heritage_object.name,
    learning_objective:
      mapping?.learning_objectives.map((objective) => objective.content).join(' ') ?? '',
    geometry: {
      shape_name: shape?.name ?? '',
      formula: '',
      description: shape?.description ?? material.heritage_object.description ?? '',
      cultural_context: '',
      culture_geometry_relation: mapping?.semantics ?? '',
    },
    micro_quiz_id: mapping?.micro_quiz_id != null ? id(mapping.micro_quiz_id) : null,
  };
}

export function mapMicroQuiz(quiz: BackendMicroQuiz): MicroQuiz {
  return {
    id: id(quiz.id),
    title: quiz.title,
    questions: quiz.questions.map((question) => ({
      id: id(question.id),
      prompt: question.prompt,
      options: question.options.map((option) => ({
        id: id(option.id),
        text: option.text,
      })),
    })),
  };
}

export function mapQuizAttempt(attempt: BackendQuizAttempt): QuizAttempt {
  return {
    id: id(attempt.id),
    quiz_id: id(attempt.quiz_id),
    submitted: attempt.status === 'submitted',
  };
}

export function mapQuizAnswer(answer: BackendQuizAnswer): QuizAnswerResult {
  return {
    question_id: id(answer.question_id),
    is_correct: answer.is_correct,
    feedback: answer.feedback,
  };
}

export function mapAssessmentAttempt(attempt: BackendAssessmentAttempt): AssessmentAttempt {
  const firstUnanswered = attempt.items.findIndex((item) => item.selected_option_id === null);

  return {
    id: id(attempt.id),
    instrument: attempt.type,
    items: attempt.items.map((item) => ({
      id: id(item.id),
      prompt: item.prompt,
      options: item.options.map((option) => ({
        id: id(option.id),
        text: option.text,
      })),
      selected_option_id:
        item.selected_option_id != null ? id(item.selected_option_id) : null,
    })),
    current_index:
      firstUnanswered === -1 ? Math.max(0, attempt.items.length - 1) : firstUnanswered,
    submitted: attempt.status === 'submitted',
  };
}

export function mapSessionResult(result: BackendCompletedSessionResult): SessionResult {
  return {
    session_id: id(result.id),
    // The result resource does not carry the site name; the result page reads
    // it from the heritage-site endpoint instead of hardcoding content here.
    heritage_site_name: '',
    panoramas_visited: result.activity_summary.panoramas_visited,
    objects_learned: result.activity_summary.materials_viewed,
    activities_completed:
      result.activity_summary.materials_viewed + result.activity_summary.micro_quizzes_completed,
    micro_quizzes_completed: result.activity_summary.micro_quizzes_completed,
  };
}
