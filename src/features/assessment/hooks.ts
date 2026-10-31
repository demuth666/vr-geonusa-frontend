import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { AssessmentInstrument } from '@/types/api';

export function useStartAssessmentAttempt() {
  return useMutation({
    mutationFn: (vars: { sessionId: string; instrument: AssessmentInstrument }) =>
      api.startAssessmentAttempt(vars.sessionId, vars.instrument),
  });
}

export function useAssessmentAttempt(attemptId: string | null) {
  return useQuery({
    queryKey: ['assessment-attempt', attemptId],
    queryFn: () => api.getAssessmentAttempt(attemptId as string),
    enabled: !!attemptId,
  });
}

export function useAnswerAssessmentItem() {
  return useMutation({
    mutationFn: (vars: { attemptId: string; itemId: string; selectedOptionId: string }) =>
      api.answerAssessmentItem(vars.attemptId, vars.itemId, vars.selectedOptionId),
  });
}

export function useSubmitAssessmentAttempt(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => api.submitAssessmentAttempt(attemptId),
    onSuccess: (session) => {
      qc.setQueryData(['learning-sessions', sessionId], session);
    },
  });
}
