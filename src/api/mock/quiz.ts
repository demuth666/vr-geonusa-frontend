import type { MicroQuiz, QuizAnswerResult, QuizAttempt } from '@/types/api';
import { MOCK_MICRO_QUIZ, MOCK_MICRO_QUIZ_ANSWER_KEY } from '@/api/mock/data';
import {
  createQuizAttempt,
  delay,
  fail,
  getQuizAttempt,
  getSessionIdForQuizAttempt,
  setMicroQuizCompleted,
} from '@/api/mock/db';

export async function getQuiz(id: string): Promise<MicroQuiz> {
  await delay(200);
  if (id !== MOCK_MICRO_QUIZ.id) fail(404, 'quiz_not_found', `Quiz "${id}" not found`);
  return MOCK_MICRO_QUIZ;
}

export async function startQuizAttempt(sessionId: string, quizId: string): Promise<QuizAttempt> {
  await delay(200);
  return createQuizAttempt(quizId, sessionId);
}

export async function answerQuizQuestion(
  attemptId: string,
  questionId: string,
  selectedOptionId: string
): Promise<QuizAnswerResult> {
  await delay(300);
  const attempt = getQuizAttempt(attemptId);
  attempt.answers[questionId] = selectedOptionId;
  const correctOptionId = MOCK_MICRO_QUIZ_ANSWER_KEY[questionId];
  const is_correct = correctOptionId === selectedOptionId;
  return {
    question_id: questionId,
    is_correct,
    feedback: is_correct
      ? 'Benar! Jari-jari adalah setengah dari diameter.'
      : 'Belum tepat. Ingat, jari-jari = diameter ÷ 2.',
  };
}

export async function submitQuizAttempt(attemptId: string): Promise<void> {
  await delay(200);
  const attempt = getQuizAttempt(attemptId);
  attempt.submitted = true;
  const sessionId = getSessionIdForQuizAttempt(attemptId);
  setMicroQuizCompleted(sessionId);
}
