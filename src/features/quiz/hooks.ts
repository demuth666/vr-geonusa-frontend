import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export function useQuiz(quizId: string | null) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => api.getQuiz(quizId as string),
    enabled: !!quizId,
  });
}

export function useStartQuizAttempt() {
  return useMutation({
    mutationFn: (vars: { sessionId: string; quizId: string }) =>
      api.startQuizAttempt(vars.sessionId, vars.quizId),
  });
}

export function useAnswerQuizQuestion() {
  return useMutation({
    mutationFn: (vars: { attemptId: string; questionId: string; selectedOptionId: string }) =>
      api.answerQuizQuestion(vars.attemptId, vars.questionId, vars.selectedOptionId),
  });
}

export function useSubmitQuizAttempt(sessionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => api.submitQuizAttempt(attemptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['learning-sessions', sessionId, 'progress'] });
    },
  });
}
