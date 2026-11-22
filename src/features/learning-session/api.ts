import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import {
  mapExplorationProgress,
  mapLearningMaterial,
  mapLearningSession,
  mapMlPrediction,
  mapSessionResult,
} from '@/api/adapters';
import type {
  BackendCompletedSessionResult,
  BackendExplorationProgress,
  BackendLearningMaterial,
  BackendLearningSession,
  BackendMlPrediction,
} from '@/api/backend-types';
import * as mock from '@/api/mock/learning-session';
import type {
  LearningMaterial,
  LearningSession,
  MlPredictionResult,
  SessionProgress,
  SessionResult,
} from '@/types/api';

export function getActiveSession(): Promise<LearningSession | null> {
  if (isMock) return mock.getActiveSession();
  return http<BackendLearningSession | null>('GET', '/me/learning-sessions/active').then(
    (session) => (session ? mapLearningSession(session) : null)
  );
}

export async function createSession(respondentCode: string): Promise<LearningSession> {
  if (isMock) return mock.createSession(respondentCode);
  const session = await http<BackendLearningSession>('POST', '/learning-sessions', {
    respondent_code: respondentCode,
  });
  return mapLearningSession(session);
}

export function getSession(sessionId: string): Promise<LearningSession> {
  if (isMock) return mock.getSession(sessionId);
  return http<BackendLearningSession>('GET', `/learning-sessions/${sessionId}`).then(
    mapLearningSession
  );
}

export function getSessionProgress(sessionId: string): Promise<SessionProgress> {
  if (isMock) return mock.getSessionProgress(sessionId);
  return http<BackendExplorationProgress>(
    'GET',
    `/learning-sessions/${sessionId}/progress`
  ).then(mapExplorationProgress);
}

export function recordPanoramaVisit(sessionId: string, panoramaNodeId: string): Promise<void> {
  if (isMock) return mock.recordPanoramaVisit(sessionId, panoramaNodeId);
  return http<void>('POST', `/learning-sessions/${sessionId}/panorama-visits`, {
    panorama_node_id: Number(panoramaNodeId),
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, encoded] = dataUrl.split(',');
  const mime = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';
  const binary = atob(encoded ?? '');
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mime });
}

export async function predictGeometry(
  sessionId: string,
  panoramaNodeId: string,
  cameraYaw: number,
  cameraPitch: number,
  cameraFov: number,
  imageDataUrl: string
): Promise<MlPredictionResult> {
  if (isMock) {
    return mock.predictGeometry(
      sessionId,
      panoramaNodeId,
      cameraYaw,
      cameraPitch,
      cameraFov,
      imageDataUrl
    );
  }

  // Frontend TIDAK PERNAH memanggil FastAPI ML langsung - selalu lewat
  // endpoint Laravel ini (PRD #10, #28). Kontrak resmi memakai
  // multipart/form-data, bukan JSON base64.
  const form = new FormData();
  form.append('image', dataUrlToBlob(imageDataUrl), 'viewport.jpg');
  form.append('panorama_node_id', String(Number(panoramaNodeId)));
  form.append('camera_yaw', String(cameraYaw));
  form.append('camera_pitch', String(cameraPitch));
  form.append('camera_fov', String(cameraFov));

  const prediction = await http<BackendMlPrediction>(
    'POST',
    `/learning-sessions/${sessionId}/ml-predictions`,
    form
  );

  return mapMlPrediction(prediction);
}

export function getLearningMaterial(heritageObjectId: string): Promise<LearningMaterial> {
  if (isMock) return mock.getLearningMaterial(heritageObjectId);
  return http<BackendLearningMaterial>(
    'GET',
    `/heritage-objects/${heritageObjectId}/learning-material`
  ).then(mapLearningMaterial);
}

export function markMaterialAsViewed(
  sessionId: string,
  heritageObjectId: string
): Promise<void> {
  if (isMock) return mock.markMaterialAsViewed(sessionId, heritageObjectId);
  return http<void>('POST', `/learning-sessions/${sessionId}/materials/${heritageObjectId}/viewed`);
}

export function completeExploration(sessionId: string): Promise<LearningSession> {
  if (isMock) return mock.completeExploration(sessionId);
  return http<BackendLearningSession>(
    'POST',
    `/learning-sessions/${sessionId}/exploration/complete`
  ).then(mapLearningSession);
}

export function getSessionResult(sessionId: string): Promise<SessionResult> {
  if (isMock) return mock.getSessionResult(sessionId);
  return http<BackendCompletedSessionResult>(
    'GET',
    `/learning-sessions/${sessionId}/result`
  ).then(mapSessionResult);
}
