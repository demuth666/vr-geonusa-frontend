import type { AssessmentAttempt, AssessmentInstrument, LearningSession } from '@/types/api';
import {
  createAssessmentAttempt,
  delay,
  getAssessmentAttempt,
  getSessionIdForAssessmentAttempt,
  setSessionPhase,
} from '@/api/mock/db';

export async function startAssessmentAttempt(
  sessionId: string,
  instrument: AssessmentInstrument
): Promise<AssessmentAttempt> {
  await delay();
  return createAssessmentAttempt(instrument, sessionId);
}

export async function getAssessmentAttemptById(id: string): Promise<AssessmentAttempt> {
  await delay(150);
  const a = getAssessmentAttempt(id);
  return { id: a.id, instrument: a.instrument, items: a.items, current_index: a.current_index, submitted: a.submitted };
}

export async function answerAssessmentItem(
  attemptId: string,
  itemId: string,
  selectedOptionId: string
): Promise<void> {
  await delay(200);
  const attempt = getAssessmentAttempt(attemptId);
  attempt.answers[itemId] = selectedOptionId;
  attempt.current_index = Math.min(
    attempt.items.findIndex((it) => it.id === itemId) + 1,
    attempt.items.length
  );
}

/**
 * Submit attempt. Tidak pernah mengembalikan skor ke frontend (PRD #22, #39).
 * Yang dikembalikan hanya sesi dengan phase baru, supaya frontend tahu harus
 * routing ke mana — bukan menentukan sendiri transisi fase-nya.
 */
export async function submitAssessmentAttempt(attemptId: string): Promise<LearningSession> {
  await delay(300);
  const attempt = getAssessmentAttempt(attemptId);
  attempt.submitted = true;
  const sessionId = getSessionIdForAssessmentAttempt(attemptId);

  if (attempt.instrument === 'pretest') {
    return setSessionPhase(sessionId, 'exploration', 'explore');
  }
  if (attempt.instrument === 'posttest') {
    return setSessionPhase(sessionId, 'self_efficacy', 'self-efficacy');
  }
  return setSessionPhase(sessionId, 'completed', 'result');
}
