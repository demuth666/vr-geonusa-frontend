import { useRef, useState } from 'react';
import { useLearningMaterial, useMarkMaterialViewed } from '@/features/learning-session/hooks';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import Button from '@/components/Button';
import MicroQuizPanel from '@/features/quiz/MicroQuizPanel';

/**
 * Overlay materi pembelajaran (PRD #33). Tetap di atas panorama (tidak
 * pindah halaman) — menutup overlay ini mengembalikan siswa ke panorama,
 * bukan ke halaman lain (ditangani ExplorePage via uiStore.lastCamera).
 */
export default function MaterialOverlay({
  sessionId,
  heritageObjectId,
  onClose,
}: {
  sessionId: string;
  heritageObjectId: string;
  onClose: () => void;
}) {
  const materialQuery = useLearningMaterial(heritageObjectId);
  const markViewed = useMarkMaterialViewed(sessionId);
  const [quizDone, setQuizDone] = useState(false);
  const markedRef = useRef(false);

  if (materialQuery.isLoading) {
    return (
      <Overlay>
        <Spinner label="Memuat materi pembelajaran..." />
      </Overlay>
    );
  }
  if (materialQuery.isError) {
    return (
      <Overlay>
        <ErrorState error={materialQuery.error} onRetry={() => materialQuery.refetch()} />
        <Button variant="ghost" className="mt-3" onClick={onClose}>
          Kembali ke Panorama
        </Button>
      </Overlay>
    );
  }

  const material = materialQuery.data!;

  if (!markedRef.current) {
    markedRef.current = true;
    markViewed.mutate(heritageObjectId);
  }

  return (
    <Overlay>
      <div className="max-h-[80vh] overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Objek Teridentifikasi
        </p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">{material.heritage_object_name}</h3>

        <div className="mt-4 rounded-xl bg-brand-50 p-4">
          <p className="text-sm font-semibold text-brand-800">{material.geometry.shape_name}</p>
          {/* Penting: pendekatan, bukan klaim identitas mutlak (PRD #33). */}
          <p className="mt-1 text-sm text-slate-700">{material.geometry.description}</p>
          <p className="mt-2 font-mono text-sm text-brand-700">{material.geometry.formula}</p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-600">
          <p>{material.geometry.cultural_context}</p>
          <p>{material.geometry.culture_geometry_relation}</p>
        </div>

        {material.micro_quiz_id && !quizDone && (
          <div className="mt-5 border-t border-slate-200 pt-4">
            <MicroQuizPanel
              sessionId={sessionId}
              quizId={material.micro_quiz_id}
              onComplete={() => setQuizDone(true)}
            />
          </div>
        )}

        {(!material.micro_quiz_id || quizDone) && (
          <Button className="mt-5 w-full" onClick={onClose}>
            Kembali ke Panorama
          </Button>
        )}
      </div>
    </Overlay>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl">
        {children}
      </div>
    </div>
  );
}
