import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import { mapAssessmentAttempt } from '@/api/adapters';
import type { BackendAssessmentAttempt } from '@/api/backend-types';
import * as mock from '@/api/mock/assessment';
import { getSession } from '@/features/learning-session/api';
import type { AssessmentAttempt, AssessmentInstrument, LearningSession } from '@/types/api';

export async function startAssessmentAttempt(
  sessionId: string,
  instrument: AssessmentInstrument
): Promise<AssessmentAttempt> {
  if (isMock) return mock.startAssessmentAttempt(sessionId, instrument);
  // The backend selects the instrument from the session's current phase, so
  // the client must not send an instrument or any other server-owned state.
  const attempt = await http<BackendAssessmentAttempt>(
    'POST',
    `/learning-sessions/${sessionId}/assessment-attempts`
  );
  return mapAssessmentAttempt(attempt);
}

export async function getAssessmentAttempt(attemptId: string): Promise<AssessmentAttempt> {
  if (isMock) return mock.getAssessmentAttemptById(attemptId);
  const attempt = await http<BackendAssessmentAttempt>('GET', `/assessment-attempts/${attemptId}`);
  return mapAssessmentAttempt(attempt);
}

export async function answerAssessmentItem(
  attemptId: string,
  itemId: string,
  selectedOptionId: string
): Promise<void> {
  if (isMock) return mock.answerAssessmentItem(attemptId, itemId, selectedOptionId);
  await http<BackendAssessmentAttempt>(
    'PUT',
    `/assessment-attempts/${attemptId}/answers/${itemId}`,
    { selected_option_id: Number(selectedOptionId) }
  );
}

export async function submitAssessmentAttempt(
  sessionId: string,
  attemptId: string
): Promise<LearningSession> {
  if (isMock) return mock.submitAssessmentAttempt(attemptId);
  await http<BackendAssessmentAttempt>('POST', `/assessment-attempts/${attemptId}/submit`);
  // The submit resource returns the attempt, not the session. The session is
  // the source of truth for the next phase, so read it back after submission.
  return getSession(sessionId);
}
