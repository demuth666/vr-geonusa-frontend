import { Link, useNavigate } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import { SplashLogo } from '@/components/icons';
import { useActiveSession, useCreateSession } from '@/features/learning-session/hooks';
import { useHeritageSite } from '@/features/heritage/hooks';
import { sessionPhaseToPath } from '@/utils/session-routing';

/**
 * PRD #17/#18: jelaskan aktivitas, lalu deteksi active session — resume
 * kalau ada, buat baru kalau belum ada. Frontend tidak pernah menebak fase
 * sendiri; routing berikutnya selalu memakai phase dari respons backend.
 * Tampilan: splash tur 360° LFS.
 */
export default function BorobudurIntroPage() {
  const navigate = useNavigate();
  const siteQuery = useHeritageSite('borobudur');
  const activeSessionQuery = useActiveSession();
  const createSession = useCreateSession();

  if (siteQuery.isLoading || activeSessionQuery.isLoading) {
    return (
      <div className="center-screen">
        <Spinner label="Memuat..." />
      </div>
    );
  }
  if (siteQuery.isError || !siteQuery.data) {
    return (
      <div className="center-screen">
        <div style={{ width: 'min(420px, 100%)' }}>
          <ErrorState error={siteQuery.error} onRetry={() => siteQuery.refetch()} />
        </div>
      </div>
    );
  }

  const site = siteQuery.data;
  const activeSession = activeSessionQuery.data;

  function handleCreate() {
    createSession.mutate(site.id, {
      onSuccess: (session) => navigate(sessionPhaseToPath(session.id, session.phase)),
    });
  }

  function handleResume() {
    if (activeSession) navigate(sessionPhaseToPath(activeSession.id, activeSession.phase));
  }

  return (
    <main id="splash">
      <div className="logo-wrap">
        <SplashLogo />
      </div>
      <h1>{site.name}</h1>
      <p className="tagline">Tur 360° — Foto Panorama Asli</p>

      {activeSession ? (
        <>
          <div className="intro-resume">
            <p>Kamu memiliki eksplorasi yang belum selesai.</p>
            <div className="resume-progress progress-track">
              <div className="progress-fill" style={{ width: `${activeSession.progress_percentage}%` }} />
            </div>
            <p className="resume-pct">Progress: {activeSession.progress_percentage}%</p>
          </div>
          <button type="button" onClick={handleResume}>
            Lanjutkan Eksplorasi
          </button>
        </>
      ) : (
        <>
          <ul className="intro-list" aria-label="Dalam pengalaman ini kamu akan">
            <li>menjelajahi panorama Candi Borobudur,</li>
            <li>mengamati elemen arsitektur,</li>
            <li>mengidentifikasi bentuk,</li>
            <li>mempelajari konsep geometri,</li>
            <li>menjawab aktivitas pembelajaran.</li>
          </ul>
          {createSession.isError && (
            <div className="splash-error-box">
              <ErrorState error={createSession.error} onRetry={handleCreate} />
            </div>
          )}
          <button type="button" onClick={handleCreate} disabled={createSession.isPending}>
            {createSession.isPending ? 'Menyiapkan…' : 'Mulai Belajar'}
          </button>
        </>
      )}

      <div className="meta">
        Pretest singkat → jelajahi panorama 360° → identifikasi bentuk → kuis → posttest.
        <br />
        Klik lingkaran untuk berpindah titik · tekan "Identifikasi" untuk mengenali bentuk
      </div>
      <Link to="/" className="splash-back">
        ← Portal
      </Link>
    </main>
  );
}
