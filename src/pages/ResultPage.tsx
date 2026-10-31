import { useParams } from 'react-router-dom';
import SessionPhaseGuard from '@/features/learning-session/SessionPhaseGuard';
import { useSessionResult } from '@/features/learning-session/hooks';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import { Link } from 'react-router-dom';
import { GlobeIcon, HomeIcon, LayersIcon, StarIcon, CheckIcon } from '@/components/icons';

function ResultContent({ sessionId }: { sessionId: string }) {
  const resultQuery = useSessionResult(sessionId);

  if (resultQuery.isLoading) {
    return (
      <div className="center-screen">
        <Spinner label="Memuat hasil..." />
      </div>
    );
  }
  if (resultQuery.isError || !resultQuery.data) {
    return (
      <div className="center-screen">
        <ErrorState error={resultQuery.error} onRetry={() => resultQuery.refetch()} />
      </div>
    );
  }

  const result = resultQuery.data;

  return (
    <div className="page" style={{ paddingTop: 0 }}>
      <div className="blob-bg" aria-hidden="true" />
      <main className="result-wrap">
        <div className="result-badge" aria-hidden="true">
          <StarIcon />
        </div>
        <div className="section-kicker">Petualangan Selesai</div>
        <h1 className="section-h2">Eksplorasi Selesai</h1>
        <p className="section-desc">Kamu telah menyelesaikan pembelajaran di {result.heritage_site_name}.</p>

        {/* PRD #41: tidak pernah menampilkan skor pretest/posttest/delta di sini. */}
        <div className="result-stats">
          <StatCard icon={<GlobeIcon />} tone="ico-sky" label="Panorama dikunjungi" value={result.panoramas_visited} />
          <StatCard icon={<LayersIcon />} tone="ico-amber" label="Objek dipelajari" value={result.objects_learned} />
          <StatCard icon={<CheckIcon />} tone="ico-green" label="Aktivitas selesai" value={result.activities_completed} />
        </div>

        <Link to="/" className="btn btn-primary">
          <HomeIcon />
          Kembali ke Portal
        </Link>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  tone,
  label,
  value,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: number;
}) {
  return (
    <div className="hero-stat">
      <div className={`hero-stat-ico ${tone}`}>{icon}</div>
      <span className="hero-stat-num">{value}</span>
      <span className="hero-stat-lbl">{label}</span>
    </div>
  );
}

export default function ResultPage() {
  const { sessionId = '' } = useParams();
  return (
    <SessionPhaseGuard sessionId={sessionId} expectedPhase="completed">
      {(session) => <ResultContent sessionId={session.id} />}
    </SessionPhaseGuard>
  );
}
