import { isMock } from '@/api/mode';
import { http } from '@/api/client';
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
  return http<LearningSession | null>('GET', '/me/learning-sessions/active');
}

export function createSession(heritageSiteId: string): Promise<LearningSession> {
  if (isMock) return mock.createSession(heritageSiteId);
  return http<LearningSession>('POST', '/learning-sessions', { heritage_site_id: heritageSiteId });
}

export function getSession(id: string): Promise<LearningSession> {
  if (isMock) return mock.getSession(id);
  return http<LearningSession>('GET', `/learning-sessions/${id}`);
}

export function getSessionProgress(id: string): Promise<SessionProgress> {
  if (isMock) return mock.getSessionProgress(id);
  return http<SessionProgress>('GET', `/learning-sessions/${id}/progress`);
}

export function recordPanoramaVisit(sessionId: string, panoramaNodeId: string): Promise<void> {
  if (isMock) return mock.recordPanoramaVisit(sessionId, panoramaNodeId);
  return http<void>('POST', `/learning-sessions/${sessionId}/panorama-visits`, {
    panorama_node_id: panoramaNodeId,
  });
}

export function predictGeometry(
  sessionId: string,
  panoramaNodeId: string,
  cameraYaw: number,
  cameraPitch: number,
  cameraFov: number,
  imageDataUrl: string
): Promise<MlPredictionResult> {
  if (isMock) {
    return mock.predictGeometry(sessionId, panoramaNodeId, cameraYaw, cameraPitch, cameraFov, imageDataUrl);
  }
  // Frontend TIDAK PERNAH memanggil FastAPI ML langsung — selalu lewat
  // endpoint Laravel ini (PRD #10, #28).
  return http<MlPredictionResult>('POST', `/learning-sessions/${sessionId}/ml-predictions`, {
    panorama_node_id: panoramaNodeId,
    camera_yaw: cameraYaw,
    camera_pitch: cameraPitch,
    camera_fov: cameraFov,
    image: imageDataUrl,
  });
}

export function getLearningMaterial(heritageObjectId: string): Promise<LearningMaterial> {
  if (isMock) return mock.getLearningMaterial(heritageObjectId);
  return http<LearningMaterial>('GET', `/heritage-objects/${heritageObjectId}/learning-material`);
}

export function markMaterialAsViewed(sessionId: string, heritageObjectId: string): Promise<void> {
  if (isMock) return mock.markMaterialAsViewed(sessionId, heritageObjectId);
  return http<void>('POST', `/learning-sessions/${sessionId}/materials/${heritageObjectId}/viewed`);
}

export function completeExploration(sessionId: string): Promise<LearningSession> {
  if (isMock) return mock.completeExploration(sessionId);
  return http<LearningSession>('POST', `/learning-sessions/${sessionId}/exploration/complete`);
}

export function getSessionResult(sessionId: string): Promise<SessionResult> {
  if (isMock) return mock.getSessionResult(sessionId);
  return http<SessionResult>('GET', `/learning-sessions/${sessionId}/result`);
}
