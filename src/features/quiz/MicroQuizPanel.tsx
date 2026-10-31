import { useEffect, useState } from 'react';
import { useQuiz, useStartQuizAttempt, useAnswerQuizQuestion, useSubmitQuizAttempt } from './hooks';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import type { QuizAnswerResult } from '@/types/api';

/**
 * Berbeda dari pretest/posttest: micro quiz BOLEH langsung menampilkan
 * benar/salah + feedback dari backend (PRD #36). Frontend tidak pernah
 * menghitung sendiri correctness-nya — hanya pilihan siswa yang diberi
 * warna, sesuai `is_correct` dari server. Tampilan: kuis LFS.
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
      startAttempt.mutate({ sessionId, quizId }, { onSuccess: (attempt) => setAttemptId(attempt.id) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizQuery.data]);

  if (quizQuery.isError) {
    return <ErrorState error={quizQuery.error} onRetry={() => quizQuery.refetch()} />;
  }
  if (startAttempt.isError) {
    return <ErrorState error={startAttempt.error} onRetry={() => startAttempt.mutate({ sessionId, quizId }, { onSuccess: (a) => setAttemptId(a.id) })} />;
  }
  if (quizQuery.isLoading || !attemptId) {
    return (
      <div className="info-spinner">
        <Spinner label="Memuat kuis singkat..." />
      </div>
    );
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

  function optionClass(optId: string) {
    if (selected !== optId) return 'quiz-option';
    if (!result) return 'quiz-option is-selected';
    return `quiz-option ${result.is_correct ? 'correct' : 'wrong'}`;
  }

  return (
    <div>
      <div className="quiz-title">{quiz.title}</div>
      <div className="quiz-question">{question.prompt}</div>

      <div className="quiz-options">
        {question.options.map((opt) => (
          <label key={opt.id} className={optionClass(opt.id)}>
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
        <div className={`quiz-feedback ${result.is_correct ? 'correct' : 'wrong'}`} role="status">
          <p className="fb-title">{result.is_correct ? 'Benar ✓' : 'Belum tepat.'}</p>
          <p>{result.feedback}</p>
        </div>
      )}

      {answerMutation.isError && (
        <div style={{ marginTop: 10 }}>
          <ErrorState error={answerMutation.error} />
        </div>
      )}

      {!result ? (
        <button className="vr-primary-btn mt" onClick={handleAnswer} disabled={!selected || answerMutation.isPending}>
          Jawab
        </button>
      ) : (
        <button className="vr-primary-btn mt" onClick={handleNext} disabled={submitMutation.isPending}>
          {isLastQuestion ? 'Selesai' : 'Lanjut'}
        </button>
      )}
    </div>
  );
}
