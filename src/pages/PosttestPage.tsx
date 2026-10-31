import { useNavigate, useParams } from 'react-router-dom';
import SessionPhaseGuard from '@/features/learning-session/SessionPhaseGuard';
import AssessmentPage from '@/features/assessment/AssessmentPage';
import { sessionPhaseToPath } from '@/utils/session-routing';

export default function PosttestPage() {
  const { sessionId = '' } = useParams();
  const navigate = useNavigate();

  return (
    <SessionPhaseGuard sessionId={sessionId} expectedPhase="posttest">
      {() => (
        <AssessmentPage
          sessionId={sessionId}
          instrument="posttest"
          title="Posttest"
          description="Jawab sesuai pemahamanmu setelah eksplorasi. Tidak ada jawaban yang dinilai salah di sini."
          onSubmitted={(session) => navigate(sessionPhaseToPath(session.id, session.phase), { replace: true })}
        />
      )}
    </SessionPhaseGuard>
  );
}
