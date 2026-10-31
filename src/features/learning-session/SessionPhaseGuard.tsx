import { Navigate } from 'react-router-dom';
import { useActiveSession, useSession } from './hooks';
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
  // PRD #20: write token hanya di memory, jadi hilang saat halaman di-refresh.
  // GET /me/learning-sessions/active mengembalikan token lagi (diterapkan di
  // useActiveSession) — tunggu itu dulu sebelum halaman sesi melakukan mutasi.
  // Sesi `completed` tidak lagi aktif dan tidak butuh token (halaman result read-only).
  const activeQuery = useActiveSession();

  if (isLoading || activeQuery.isLoading) {
    return (
      <div className="center-screen">
        <Spinner label="Memuat sesi..." />
      </div>
    );
  }
  if (isError || !session) {
    return (
      <div className="center-screen">
        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }
  if (session.phase !== expectedPhase) {
    return <Navigate to={sessionPhaseToPath(session.id, session.phase)} replace />;
  }
  return <>{children(session)}</>;
}
