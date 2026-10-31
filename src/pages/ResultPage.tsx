import { useParams } from 'react-router-dom';
import SessionPhaseGuard from '@/features/learning-session/SessionPhaseGuard';
import { useSessionResult } from '@/features/learning-session/hooks';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';

function ResultContent({ sessionId }: { sessionId: string }) {
  const resultQuery = useSessionResult(sessionId);

  if (resultQuery.isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Memuat hasil..." />
      </div>
    );
  }
  if (resultQuery.isError || !resultQuery.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <ErrorState error={resultQuery.error} onRetry={() => resultQuery.refetch()} />
      </div>
    );
  }

  const result = resultQuery.data;

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Eksplorasi Selesai</h1>
      <p className="mt-2 text-slate-600">
        Kamu telah menyelesaikan pembelajaran di {result.heritage_site_name}.
      </p>

      {/* PRD #41: tidak pernah menampilkan skor pretest/posttest/delta di sini. */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <StatCard label="Panorama dikunjungi" value={result.panoramas_visited} />
        <StatCard label="Objek dipelajari" value={result.objects_learned} />
        <StatCard label="Aktivitas selesai" value={result.activities_completed} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-2xl font-bold text-brand-700">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
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
