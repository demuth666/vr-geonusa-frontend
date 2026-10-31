import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import { setSessionWriteToken } from '@/api/session-token';
import type { LearningSession } from '@/types/api';

function applySessionToken(session: LearningSession) {
  if (session.write_token) setSessionWriteToken(session.write_token);
  return session;
}

export function useActiveSession() {
  return useQuery({
    queryKey: ['learning-sessions', 'active'],
    queryFn: async () => {
      const session = await api.getActiveSession();
      if (session) applySessionToken(session);
      return session;
    },
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (heritageSiteId: string) => api.createSession(heritageSiteId),
    onSuccess: (session) => {
      applySessionToken(session);
      qc.setQueryData(['learning-sessions', 'active'], session);
      qc.setQueryData(['learning-sessions', session.id], session);
    },
  });
}

export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['learning-sessions', sessionId],
    queryFn: () => api.getSession(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useSessionProgress(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['learning-sessions', sessionId, 'progress'],
    queryFn: () => api.getSessionProgress(sessionId as string),
    enabled: !!sessionId,
  });
}

export function useRecordPanoramaVisit(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (panoramaNodeId: string) => api.recordPanoramaVisit(sessionId, panoramaNodeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['learning-sessions', sessionId, 'progress'] });
    },
  });
}

export function usePredictGeometry(sessionId: string) {
  return useMutation({
    mutationFn: (vars: {
      panoramaNodeId: string;
      cameraYaw: number;
      cameraPitch: number;
      cameraFov: number;
      imageDataUrl: string;
    }) =>
      api.predictGeometry(
        sessionId,
        vars.panoramaNodeId,
        vars.cameraYaw,
        vars.cameraPitch,
        vars.cameraFov,
        vars.imageDataUrl
      ),
  });
}

export function useLearningMaterial(heritageObjectId: string | null) {
  return useQuery({
    queryKey: ['learning-material', heritageObjectId],
    queryFn: () => api.getLearningMaterial(heritageObjectId as string),
    enabled: !!heritageObjectId,
  });
}

export function useMarkMaterialViewed(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (heritageObjectId: string) => api.markMaterialAsViewed(sessionId, heritageObjectId),
    onSuccess: () => {
      // PRD #37: setelah aksi yang memengaruhi progress, invalidate supaya
      // tombol "Selesai Eksplorasi" (can_finish) selalu akurat dari backend.
      qc.invalidateQueries({ queryKey: ['learning-sessions', sessionId, 'progress'] });
    },
  });
}

export function useCompleteExploration(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.completeExploration(sessionId),
    onSuccess: (session) => {
      qc.setQueryData(['learning-sessions', sessionId], session);
      qc.invalidateQueries({ queryKey: ['learning-sessions', 'active'] });
    },
  });
}

export function useSessionResult(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['learning-sessions', sessionId, 'result'],
    queryFn: () => api.getSessionResult(sessionId as string),
    enabled: !!sessionId,
  });
}
