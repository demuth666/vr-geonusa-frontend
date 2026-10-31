import { useEffect, useState } from 'react';
import {
  useStartAssessmentAttempt,
  useAssessmentAttempt,
  useAnswerAssessmentItem,
  useSubmitAssessmentAttempt,
} from './hooks';
import type { AssessmentInstrument, LearningSession } from '@/types/api';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import AssessmentProgress from './AssessmentProgress';
import AssessmentQuestion from './AssessmentQuestion';
import AssessmentNavigation from './AssessmentNavigation';

interface Props {
  sessionId: string;
  instrument: AssessmentInstrument;
  title: string;
  description?: string;
  /** Dipanggil setelah backend konfirmasi attempt submitted, membawa session dengan phase baru. */
  onSubmitted: (session: LearningSession) => void;
}

/**
 * Engine assessment yang dipakai ulang oleh Pretest, Posttest, dan
 * Self-Efficacy (PRD #39, #40) — hanya beda instrument + title + copy.
 * Tidak pernah menampilkan/menerima is_correct/correct_answer (PRD #21).
 * Transisi fase session HANYA terjadi setelah backend mengonfirmasi submit.
 */
export default function AssessmentPage({ sessionId, instrument, title, description, onSubmitted }: Props) {
  const startAttempt = useStartAssessmentAttempt();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    startAttempt.mutate(
      { sessionId, instrument },
      { onSuccess: (attempt) => setAttemptId(attempt.id) }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, instrument]);

  const attemptQuery = useAssessmentAttempt(attemptId);
  const answerItem = useAnswerAssessmentItem();
  const submitAttempt = useSubmitAssessmentAttempt(sessionId);

  if (startAttempt.isPending || attemptQuery.isLoading || !attemptQuery.data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label={`Memuat ${title.toLowerCase()}...`} />
      </div>
    );
  }
  if (startAttempt.isError) {
    return <ErrorState error={startAttempt.error} onRetry={() => startAttempt.mutate({ sessionId, instrument })} />;
  }
  if (attemptQuery.isError) {
    return <ErrorState error={attemptQuery.error} onRetry={() => attemptQuery.refetch()} />;
  }

  const attempt = attemptQuery.data;
  const item = attempt.items[index];
  const isLast = index === attempt.items.length - 1;
  const selected = answers[item.id] ?? null;

  function handleSelect(optionId: string) {
    setAnswers((prev) => ({ ...prev, [item.id]: optionId }));
    answerItem.mutate({ attemptId: attemptId as string, itemId: item.id, selectedOptionId: optionId });
  }

  function handleNext() {
    if (isLast) {
      submitAttempt.mutate(attemptId as string, { onSuccess: onSubmitted });
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}

      <div className="mt-6">
        <AssessmentProgress current={index + 1} total={attempt.items.length} />
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <AssessmentQuestion item={item} value={selected} onChange={handleSelect} />
        <AssessmentNavigation
          canGoBack={index > 0}
          isLast={isLast}
          disabled={!selected}
          submitting={submitAttempt.isPending}
          onBack={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={handleNext}
        />
      </div>

      {submitAttempt.isError && (
        <div className="mt-4">
          <ErrorState error={submitAttempt.error} />
        </div>
      )}
    </div>
  );
}
