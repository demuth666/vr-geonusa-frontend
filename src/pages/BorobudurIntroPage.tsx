import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import { useActiveSession, useCreateSession } from '@/features/learning-session/hooks';
import { useHeritageSite } from '@/features/heritage/hooks';
import { sessionPhaseToPath } from '@/utils/session-routing';

/**
 * PRD #17/#18: jelaskan aktivitas, lalu deteksi active session — resume
 * kalau ada, buat baru kalau belum ada. Frontend tidak pernah menebak fase
 * sendiri; routing berikutnya selalu memakai phase dari respons backend.
 */
export default function BorobudurIntroPage() {
  const navigate = useNavigate();
  const siteQuery = useHeritageSite('borobudur');
  const activeSessionQuery = useActiveSession();
  const createSession = useCreateSession();

  if (siteQuery.isLoading || activeSessionQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Memuat..." />
      </div>
    );
  }
  if (siteQuery.isError || !siteQuery.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <ErrorState error={siteQuery.error} onRetry={() => siteQuery.refetch()} />
      </div>
    );
  }

  const activeSession = activeSessionQuery.data;

  function handleCreate() {
    createSession.mutate(siteQuery.data!.id, {
      onSuccess: (session) => navigate(sessionPhaseToPath(session.id, session.phase)),
    });
  }

  function handleResume() {
    if (activeSession) navigate(sessionPhaseToPath(activeSession.id, activeSession.phase));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-900 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">Candi Borobudur</h1>

        {activeSession ? (
          <>
            <p className="mt-4 text-slate-700">
              Kamu memiliki eksplorasi yang belum selesai.
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-700">
              Progress: {activeSession.progress_percentage}%
            </p>
            <Button className="mt-6" onClick={handleResume}>
              Lanjutkan Eksplorasi
            </Button>
          </>
        ) : (
          <>
            <p className="mt-4 text-left text-slate-700">Dalam pengalaman ini kamu akan:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-left text-sm text-slate-600">
              <li>menjelajahi panorama Candi Borobudur,</li>
              <li>mengamati elemen arsitektur,</li>
              <li>mengidentifikasi bentuk,</li>
              <li>mempelajari konsep geometri,</li>
              <li>menjawab aktivitas pembelajaran.</li>
            </ul>
            {createSession.isError && (
              <div className="mt-4">
                <ErrorState error={createSession.error} onRetry={handleCreate} />
              </div>
            )}
            <Button className="mt-6" onClick={handleCreate} disabled={createSession.isPending}>
              {createSession.isPending ? 'Menyiapkan…' : 'Mulai Belajar'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
