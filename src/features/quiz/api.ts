import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import * as mock from '@/api/mock/quiz';
import type { MicroQuiz, QuizAnswerResult, QuizAttempt } from '@/types/api';

export function getQuiz(id: string): Promise<MicroQuiz> {
  if (isMock) return mock.getQuiz(id);
  return http<MicroQuiz>('GET', `/quizzes/${id}`);
}

export function startQuizAttempt(sessionId: string, quizId: string): Promise<QuizAttempt> {
  if (isMock) return mock.startQuizAttempt(sessionId, quizId);
  return http<QuizAttempt>('POST', `/learning-sessions/${sessionId}/quiz-attempts`, { quiz_id: quizId });
}

export function answerQuizQuestion(
  attemptId: string,
  questionId: string,
  selectedOptionId: string
): Promise<QuizAnswerResult> {
  if (isMock) return mock.answerQuizQuestion(attemptId, questionId, selectedOptionId);
  return http<QuizAnswerResult>('PUT', `/quiz-attempts/${attemptId}/answers/${questionId}`, {
    selected_option_id: selectedOptionId,
  });
}

export function submitQuizAttempt(attemptId: string): Promise<void> {
  if (isMock) return mock.submitQuizAttempt(attemptId);
  return http<void>('POST', `/quiz-attempts/${attemptId}/submit`);
}
