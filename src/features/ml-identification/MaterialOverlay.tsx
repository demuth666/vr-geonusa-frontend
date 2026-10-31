import { useEffect, useRef, useState } from 'react';
import { useLearningMaterial, useMarkMaterialViewed } from '@/features/learning-session/hooks';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import MicroQuizPanel from '@/features/quiz/MicroQuizPanel';
import InfoPanel from '@/vr/hud/InfoPanel';
import QuizPanel from '@/vr/hud/QuizPanel';

/**
 * Overlay materi pembelajaran (PRD #33) dengan tampilan panel "Geometri
 * Teridentifikasi" LFS. Tetap di atas panorama (tidak pindah halaman);
 * menutupnya mengembalikan siswa ke sudut pandang yang sama (PRD #34).
 * Tombol "📝 Uji Pemahaman" membuka panel kuis LFS (#quiz-overlay).
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
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const markedRef = useRef(false);

  useEffect(() => {
    if (materialQuery.data && !markedRef.current) {
      markedRef.current = true;
      markViewed.mutate(heritageObjectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialQuery.data, heritageObjectId]);

  if (materialQuery.isLoading) {
    return (
      <InfoPanel label="Geometri Teridentifikasi" onClose={onClose}>
        <div className="info-spinner">
          <Spinner label="Memuat materi pembelajaran..." />
        </div>
      </InfoPanel>
    );
  }
  if (materialQuery.isError || !materialQuery.data) {
    return (
      <InfoPanel label="Geometri Teridentifikasi" onClose={onClose}>
        <ErrorState error={materialQuery.error} onRetry={() => materialQuery.refetch()} />
        <button className="vr-secondary-btn" style={{ width: '100%', marginTop: 10 }} onClick={onClose}>
          Kembali ke Panorama
        </button>
      </InfoPanel>
    );
  }

  const material = materialQuery.data;
  const geo = material.geometry;

  if (quizOpen && material.micro_quiz_id) {
    return (
      <QuizPanel label="Uji Pemahaman" onClose={() => setQuizOpen(false)}>
        <MicroQuizPanel
          sessionId={sessionId}
          quizId={material.micro_quiz_id}
          onComplete={() => {
            setQuizDone(true);
            setQuizOpen(false);
          }}
        />
      </QuizPanel>
    );
  }

  return (
    <InfoPanel label="Geometri Teridentifikasi" onClose={onClose} role="dialog">
      <div className="geo-name">{material.heritage_object_name}</div>
      {/* PRD #33: pendekatan, bukan klaim identitas mutlak. */}
      <div className="geo-sub">Dapat didekati sebagai {geo.shape_name.toLowerCase()}</div>
      <div className="element-tag" style={{ marginTop: 8 }}>{geo.shape_name}</div>

      <p className="info-desc">{geo.description}</p>

      <div className="formula-block">
        <div className="formula">
          <b>{geo.formula}</b>
        </div>
      </div>

      <div className="context">
        <div className="ctx-label">Konteks Budaya</div>
        <div>{geo.cultural_context}</div>
      </div>
      <div className="context">
        <div className="ctx-label">Hubungan Budaya &amp; Geometri</div>
        <div>{geo.culture_geometry_relation}</div>
      </div>

      <div className="info-objective">
        <b>Tujuan Belajar</b>
        {material.learning_objective}
      </div>

      {material.micro_quiz_id && !quizDone ? (
        <button id="quiz-trigger-btn" onClick={() => setQuizOpen(true)}>
          📝 Uji Pemahaman
        </button>
      ) : (
        <button id="quiz-trigger-btn" onClick={onClose}>
          Kembali ke Panorama
        </button>
      )}
    </InfoPanel>
  );
}
