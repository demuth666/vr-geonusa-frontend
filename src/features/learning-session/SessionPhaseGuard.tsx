import { Navigate } from 'react-router-dom';
import { useSession } from './hooks';
import type { LearningSession, SessionPhase } from '@/types/api';
import { sessionPhaseToPath } from '@/utils/session-routing';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';

/**
 * PRD #19: route eksplorasi WAJIB mengikuti `phase` dari backend. Guard ini
 * dipasang di tiap halaman session (pretest/explore/posttest/self-
 * efficacy/result) supaya kalau siswa mencoba buka URL yang tidak sesuai
 * fase session-nya saat ini (mis. buka /pretest padahal sudah di fase
 * exploration), dia otomatis diarahkan ke halaman yang benar — bukan
 * ditebak dari state lokal.
 */
export default function SessionPhaseGuard({
  sessionId,
  expectedPhase,
  children,
}: {
  sessionId: string;
  expectedPhase: SessionPhase;
  children: (session: LearningSession) => React.ReactNode;
}) {
  const { data: session, isLoading, isError, error, refetch } = useSession(sessionId);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Memuat sesi..." />
      </div>
    );
  }
  if (isError || !session) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }
  if (session.phase !== expectedPhase) {
    return <Navigate to={sessionPhaseToPath(session.id, session.phase)} replace />;
  }
  return <>{children(session)}</>;
}
