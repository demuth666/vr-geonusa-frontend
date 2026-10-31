import { useNavigate, useParams } from 'react-router-dom';
import SessionPhaseGuard from '@/features/learning-session/SessionPhaseGuard';
import AssessmentPage from '@/features/assessment/AssessmentPage';
import { sessionPhaseToPath } from '@/utils/session-routing';

export default function SelfEfficacyPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();

  return (
    <SessionPhaseGuard sessionId={sessionId} expectedPhase="self_efficacy">
      {() => (
        <AssessmentPage
          sessionId={sessionId}
          instrument="self_efficacy"
          title="Kuesioner Self-Efficacy"
          description="Tidak ada jawaban benar atau salah — jawab sesuai keyakinan dirimu."
          onSubmitted={(session) => navigate(sessionPhaseToPath(session.id, session.phase), { replace: true })}
        />
      )}
    </SessionPhaseGuard>
  );
}
