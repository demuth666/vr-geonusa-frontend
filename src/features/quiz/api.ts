import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import { mapMicroQuiz, mapQuizAnswer, mapQuizAttempt } from '@/api/adapters';
import type {
  BackendMicroQuiz,
  BackendQuizAnswer,
  BackendQuizAttempt,
} from '@/api/backend-types';
import * as mock from '@/api/mock/quiz';
import type { MicroQuiz, QuizAnswerResult, QuizAttempt } from '@/types/api';

export async function getQuiz(quizId: string): Promise<MicroQuiz> {
  if (isMock) return mock.getQuiz(quizId);
  const quiz = await http<BackendMicroQuiz>('GET', `/quizzes/${quizId}`);
  return mapMicroQuiz(quiz);
}

export async function startQuizAttempt(
  sessionId: string,
  quizId: string
): Promise<QuizAttempt> {
  if (isMock) return mock.startQuizAttempt(sessionId, quizId);
  const attempt = await http<BackendQuizAttempt>(
    'POST',
    `/learning-sessions/${sessionId}/quiz-attempts`,
    { quiz_id: Number(quizId) }
  );
  return mapQuizAttempt(attempt);
}

export async function answerQuizQuestion(
  attemptId: string,
  questionId: string,
  selectedOptionId: string
): Promise<QuizAnswerResult> {
  if (isMock) return mock.answerQuizQuestion(attemptId, questionId, selectedOptionId);
  const answer = await http<BackendQuizAnswer>(
    'PUT',
    `/quiz-attempts/${attemptId}/answers/${questionId}`,
    { selected_option_id: Number(selectedOptionId) }
  );
  return mapQuizAnswer(answer);
}

export async function submitQuizAttempt(attemptId: string): Promise<void> {
  if (isMock) return mock.submitQuizAttempt(attemptId);
  await http<BackendQuizAttempt>('POST', `/quiz-attempts/${attemptId}/submit`);
}
