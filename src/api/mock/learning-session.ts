import type {
  LearningMaterial,
  LearningSession,
  MlPredictionResult,
  SessionProgress,
  SessionResult,
} from '@/types/api';
import {
  MOCK_HERITAGE_OBJECT_ID,
  MOCK_HERITAGE_SITES,
  MOCK_LEARNING_MATERIAL,
} from '@/api/mock/data';
import {
  createMockSession,
  delay,
  fail,
  getActiveMockSession,
  getMaterialsViewedCount,
  getMockSession,
  getVisitedPanoramaCount,
  isMaterialViewed,
  isMicroQuizCompleted,
  markMaterialViewed,
  setCurrentPanoramaNode,
  setSessionPhase,
} from '@/api/mock/db';

export async function getActiveSession(): Promise<LearningSession | null> {
  await delay(200);
  return getActiveMockSession();
}

export async function createSession(heritageSiteId: string): Promise<LearningSession> {
  await delay();
  return createMockSession(heritageSiteId);
}

export async function getSession(id: string): Promise<LearningSession> {
  await delay(150);
  return getMockSession(id);
}

export async function getSessionProgress(id: string): Promise<SessionProgress> {
  await delay(150);
  const session = getMockSession(id);
  const visited = getVisitedPanoramaCount(id);
  const materialViewed = getMaterialsViewedCount(id) > 0;
  const quizDone = isMicroQuizCompleted(id);
  const requirements = {
    required_panorama_visited: visited >= 2,
    geometry_identified: materialViewed, // di mock, identifikasi otomatis dianggap sukses saat objek ditemukan
    learning_material_viewed: materialViewed,
    micro_quiz_completed: quizDone,
  };
  const total = Object.values(requirements).filter(Boolean).length;
  const percentage = Math.round((total / 4) * 100);
  const can_finish = session.phase === 'exploration' && total === 4;
  return { percentage, requirements, can_finish };
}

export async function recordPanoramaVisit(sessionId: string, panoramaNodeId: string): Promise<void> {
  await delay(120);
  getMockSession(sessionId); // validasi exist/ownership (mock)
  setCurrentPanoramaNode(sessionId, panoramaNodeId);
}

let pendingPredictionForNode: string | null = null;

export async function predictGeometry(
  sessionId: string,
  panoramaNodeId: string,
  _cameraYaw: number,
  _cameraPitch: number,
  _cameraFov: number,
  _imageDataUrl: string
): Promise<MlPredictionResult> {
  getMockSession(sessionId);
  await delay(900); // inferensi ML lebih lambat dari request biasa

  // Mock heuristik sederhana: node-2 & node-3 "mengandung" stupa, node-1 kosong,
  // supaya alur "No Detection" (PRD #31) juga bisa dicoba dari node-1.
  if (panoramaNodeId === 'node-1') {
    return { detections: [] };
  }

  // Simulasikan kegagalan ML sesekali supaya state "ML Failure" (PRD #32) teruji,
  // tanpa mengganggu pengujian normal (gagal hanya jika dipicu 2x berturut pada node sama).
  if (pendingPredictionForNode === panoramaNodeId) {
    pendingPredictionForNode = null;
    fail(503, 'ml_unavailable', 'ML service temporarily unavailable');
  }
  pendingPredictionForNode = panoramaNodeId;

  return {
    detections: [{ heritage_object_id: MOCK_HERITAGE_OBJECT_ID, label: 'STUPA', confidence: 0.94 }],
  };
}

export async function getLearningMaterial(heritageObjectId: string): Promise<LearningMaterial> {
  await delay(300);
  if (heritageObjectId !== MOCK_HERITAGE_OBJECT_ID) {
    fail(404, 'heritage_object_not_found', `Heritage object "${heritageObjectId}" not found`);
  }
  return MOCK_LEARNING_MATERIAL;
}

export async function markMaterialAsViewed(sessionId: string, heritageObjectId: string): Promise<void> {
  await delay(150);
  getMockSession(sessionId);
  markMaterialViewed(sessionId, heritageObjectId);
}

export async function completeExploration(sessionId: string): Promise<LearningSession> {
  await delay();
  const progress = await getSessionProgress(sessionId);
  if (!progress.can_finish) {
    fail(409, 'exploration_requirements_not_met', 'Exploration requirements are not met yet');
  }
  return setSessionPhase(sessionId, 'posttest', 'posttest');
}

export async function getSessionResult(sessionId: string): Promise<SessionResult> {
  await delay(250);
  const session = getMockSession(sessionId);
  const site = MOCK_HERITAGE_SITES.find((s) => s.id === session.heritage_site_id);
  return {
    session_id: sessionId,
    heritage_site_name: site?.name ?? 'Candi Borobudur',
    panoramas_visited: getVisitedPanoramaCount(sessionId),
    objects_learned: getMaterialsViewedCount(sessionId),
    activities_completed: isMaterialViewed(sessionId, MOCK_HERITAGE_OBJECT_ID) ? 1 : 0,
  };
}

