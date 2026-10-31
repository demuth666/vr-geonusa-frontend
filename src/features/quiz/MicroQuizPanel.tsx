import { useEffect, useState } from 'react';
import { useQuiz, useStartQuizAttempt, useAnswerQuizQuestion, useSubmitQuizAttempt } from './hooks';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import Button from '@/components/Button';
import type { QuizAnswerResult } from '@/types/api';

/**
 * Berbeda dari pretest/posttest: micro quiz BOLEH langsung menampilkan
 * benar/salah + feedback dari backend (PRD #36). Frontend tidak pernah
 * menghitung sendiri correctness-nya.
 */
export default function MicroQuizPanel({
  sessionId,
  quizId,
  onComplete,
}: {
  sessionId: string;
  quizId: string;
  onComplete: () => void;
}) {
  const quizQuery = useQuiz(quizId);
  const startAttempt = useStartQuizAttempt();
  const answerMutation = useAnswerQuizQuestion();
  const submitMutation = useSubmitQuizAttempt(sessionId);

  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<QuizAnswerResult | null>(null);

  useEffect(() => {
    if (quizQuery.data && !attemptId) {
      startAttempt.mutate(
        { sessionId, quizId },
        { onSuccess: (attempt) => setAttemptId(attempt.id) }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizQuery.data]);

  if (quizQuery.isLoading || !attemptId) {
    return <Spinner label="Memuat kuis singkat..." />;
  }
  if (quizQuery.isError) {
    return <ErrorState error={quizQuery.error} onRetry={() => quizQuery.refetch()} />;
  }

  const quiz = quizQuery.data!;
  const question = quiz.questions[index];
  const isLastQuestion = index === quiz.questions.length - 1;

  function handleAnswer() {
    if (!selected || !attemptId) return;
    answerMutation.mutate(
      { attemptId, questionId: question.id, selectedOptionId: selected },
      { onSuccess: (res) => setResult(res) }
    );
  }

  function handleNext() {
    setResult(null);
    setSelected(null);
    if (isLastQuestion) {
      submitMutation.mutate(attemptId as string, { onSuccess: onComplete });
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-brand-700">{quiz.title}</p>
      <p className="font-medium text-slate-800">{question.prompt}</p>

      <div className="space-y-2">
        {question.options.map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm ${
              selected === opt.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              checked={selected === opt.id}
              disabled={!!result}
              onChange={() => setSelected(opt.id)}
            />
            {opt.text}
          </label>
        ))}
      </div>

      {result && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            result.is_correct ? 'bg-brand-50 text-brand-800' : 'bg-amber-50 text-amber-800'
          }`}
          role="status"
        >
          <p className="font-semibold">{result.is_correct ? 'Benar ✓' : 'Belum tepat.'}</p>
          <p>{result.feedback}</p>
        </div>
      )}

      {!result ? (
        <Button onClick={handleAnswer} disabled={!selected || answerMutation.isPending}>
          Jawab
        </Button>
      ) : (
        <Button onClick={handleNext} disabled={submitMutation.isPending}>
          {isLastQuestion ? 'Selesai' : 'Lanjut'}
        </Button>
      )}
    </div>
  );
}
