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
const KICKER: Record<AssessmentInstrument, string> = {
  pretest: 'Sebelum Petualangan',
  posttest: 'Setelah Petualangan',
  self_efficacy: 'Kuesioner',
};

export default function AssessmentPage({ sessionId, instrument, title, description, onSubmitted }: Props) {
  const kicker = KICKER[instrument];
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
      <div className="center-screen">
        <Spinner label={`Memuat ${title.toLowerCase()}...`} />
      </div>
    );
  }
  if (startAttempt.isError) {
    return (
      <div className="center-screen">
        <ErrorState error={startAttempt.error} onRetry={() => startAttempt.mutate({ sessionId, instrument })} />
      </div>
    );
  }
  if (attemptQuery.isError) {
    return (
      <div className="center-screen">
        <ErrorState error={attemptQuery.error} onRetry={() => attemptQuery.refetch()} />
      </div>
    );
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
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="blob-bg" aria-hidden="true" />
      <main className="assess-wrap">
        <div className="assess-head">
          <div className="section-kicker">{kicker}</div>
          <h1 className="section-h2">{title}</h1>
          {description && <p className="section-desc">{description}</p>}
        </div>

        <div className="clay-card">
          <AssessmentProgress current={index + 1} total={attempt.items.length} />
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
          <div style={{ marginTop: 16 }}>
            <ErrorState error={submitAttempt.error} />
          </div>
        )}
      </main>
    </div>
  );
}
