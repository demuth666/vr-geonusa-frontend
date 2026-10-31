import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import * as mock from '@/api/mock/assessment';
import type { AssessmentAttempt, AssessmentInstrument, LearningSession } from '@/types/api';

export function startAssessmentAttempt(
  sessionId: string,
  instrument: AssessmentInstrument
): Promise<AssessmentAttempt> {
  if (isMock) return mock.startAssessmentAttempt(sessionId, instrument);
  return http<AssessmentAttempt>('POST', `/learning-sessions/${sessionId}/assessment-attempts`, {
    instrument,
  });
}

export function getAssessmentAttempt(id: string): Promise<AssessmentAttempt> {
  if (isMock) return mock.getAssessmentAttemptById(id);
  return http<AssessmentAttempt>('GET', `/assessment-attempts/${id}`);
}

export function answerAssessmentItem(
  attemptId: string,
  itemId: string,
  selectedOptionId: string
): Promise<void> {
  if (isMock) return mock.answerAssessmentItem(attemptId, itemId, selectedOptionId);
  return http<void>('PUT', `/assessment-attempts/${attemptId}/answers/${itemId}`, {
    selected_option_id: selectedOptionId,
  });
}

export function submitAssessmentAttempt(attemptId: string): Promise<LearningSession> {
  if (isMock) return mock.submitAssessmentAttempt(attemptId);
  return http<LearningSession>('POST', `/assessment-attempts/${attemptId}/submit`);
}
