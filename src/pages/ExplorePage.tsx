import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SessionPhaseGuard from '@/features/learning-session/SessionPhaseGuard';
import {
  useRecordPanoramaVisit,
  usePredictGeometry,
  useSessionProgress,
  useCompleteExploration,
} from '@/features/learning-session/hooks';
import { useHeritageAreas, useHeritageSite, usePanoramaNode } from '@/features/heritage/hooks';
import { useUiStore } from '@/store/uiStore';
import { sessionPhaseToPath } from '@/utils/session-routing';
import { captureViewport } from '@/vr/ml/capture';
import PanoramaScene from '@/vr/panorama/PanoramaScene';
import { usePreloadNeighborPanoramas } from '@/vr/panorama/preload';
import ProgressBar from '@/features/progress/ProgressBar';
import IdentifyButton from '@/features/ml-identification/IdentifyButton';
import IdentifyingOverlay from '@/features/ml-identification/IdentifyingOverlay';
import NoDetectionOverlay from '@/features/ml-identification/NoDetectionOverlay';
import MlErrorOverlay from '@/features/ml-identification/MlErrorOverlay';
import PredictionResultOverlay from '@/features/ml-identification/PredictionResultOverlay';
import MaterialOverlay from '@/features/ml-identification/MaterialOverlay';
import FinishConfirmOverlay from '@/features/learning-session/FinishConfirmOverlay';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import type { LearningSession, MlDetection } from '@/types/api';

function ExploreContent({ session }: { session: LearningSession }) {
  const sessionId = session.id;
  const navigate = useNavigate();

  const areasQuery = useHeritageAreas('borobudur');
  const siteQuery = useHeritageSite('borobudur');
  const [hintVisible, setHintVisible] = useState(true);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(
    session.current_panorama_node_id
  );
  const recordVisit = useRecordPanoramaVisit(sessionId);
  const progressQuery = useSessionProgress(sessionId);
  const predict = usePredictGeometry(sessionId);
  const completeExploration = useCompleteExploration(sessionId);

  const overlay = useUiStore((s) => s.overlay);
  const setOverlay = useUiStore((s) => s.setOverlay);
  const activeHeritageObjectId = useUiStore((s) => s.activeHeritageObjectId);
  const setActiveHeritageObjectId = useUiStore((s) => s.setActiveHeritageObjectId);

  const [detection, setDetection] = useState<MlDetection | null>(null);

  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const didInitNode = useRef(false);

  // PRD #27: jangan asumsikan session selalu mulai dari node pertama. Hanya
  // tetapkan node awal kalau backend memang belum punya current node.
  useEffect(() => {
    if (!didInitNode.current && !currentNodeId && areasQuery.data?.[0]?.panorama_node_ids?.[0]) {
      didInitNode.current = true;
      const firstNode = areasQuery.data[0].panorama_node_ids[0];
      setCurrentNodeId(firstNode);
      recordVisit.mutate(firstNode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areasQuery.data, currentNodeId]);

  const nodeQuery = usePanoramaNode(currentNodeId);

  // LFS: petunjuk kontrol hilang otomatis setelah 8 detik.
  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 8000);
    return () => clearTimeout(t);
  }, []);
  usePreloadNeighborPanoramas(nodeQuery.data);

  const handleSceneRef = useCallback((sceneEl: any, cameraEl: any) => {
    sceneRef.current = sceneEl;
    cameraRef.current = cameraEl;
  }, []);

  function handleNavigate(targetNodeId: string) {
    setCurrentNodeId(targetNodeId);
    recordVisit.mutate(targetNodeId);
  }

  function handleIdentify() {
    if (!currentNodeId || !sceneRef.current || !cameraRef.current) return;
    setOverlay('identifying');
    const capture = captureViewport(sceneRef.current, cameraRef.current);
    predict.mutate(
      {
        panoramaNodeId: currentNodeId,
        cameraYaw: capture.yaw,
        cameraPitch: capture.pitch,
        cameraFov: capture.fov,
        imageDataUrl: capture.imageDataUrl,
      },
      {
        onSuccess: (result) => {
          const top = result.detections[0];
          if (!top) {
            setOverlay('no-detection');
          } else {
            setDetection(top);
            setOverlay('prediction');
          }
        },
        onError: () => setOverlay('ml-error'),
      }
    );
  }

  function handleFinish() {
    completeExploration.mutate(undefined, {
      onSuccess: (newSession) => {
        navigate(sessionPhaseToPath(newSession.id, newSession.phase), { replace: true });
      },
    });
  }

  if (areasQuery.isLoading || !currentNodeId || nodeQuery.isLoading) {
    return (
      <div className="vr-stage" style={{ display: 'grid', placeItems: 'center' }}>
        <Spinner onDark label="Menyiapkan eksplorasi..." />
      </div>
    );
  }
  if (areasQuery.isError) {
    return (
      <div className="vr-stage" style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
        <ErrorState error={areasQuery.error} onRetry={() => areasQuery.refetch()} />
      </div>
    );
  }
  if (nodeQuery.isError || !nodeQuery.data) {
    return (
      <div className="vr-stage" style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
        <ErrorState error={nodeQuery.error} onRetry={() => nodeQuery.refetch()} />
      </div>
    );
  }

  const progress = progressQuery.data;
  const node = nodeQuery.data;
  const area = areasQuery.data?.find((a) => a.panorama_node_ids.includes(node.id));
  const nodeIndex = area ? area.panorama_node_ids.indexOf(node.id) + 1 : null;
  const site = siteQuery.data;

  return (
    <div className="vr-stage">
      <PanoramaScene node={node} onNavigate={handleNavigate} onSceneRef={handleSceneRef} />

      {/* ── HUD kiri atas (LFS #hud) ── */}
      <div id="hud" style={{ display: 'block' }}>
        <div id="hud-scene">
          <span className="hud-green-dot" aria-hidden="true" />
          <div>
            <div className="hud-label">VR-GeoNusa · Tur 360°</div>
            <div className="hud-name">{site?.name ?? 'Borobudur'}</div>
            <div className="hud-loc">{site?.location ?? 'Magelang, Jawa Tengah'}</div>
          </div>
        </div>
      </div>

      {/* ── Kanan atas: progress (dari backend) + selesai ── */}
      <div className="tour-chip">
        {progress && <ProgressBar percentage={progress.percentage} />}
        <button
          className="tour-finish-btn"
          aria-label="Selesaikan eksplorasi"
          disabled={!progress?.can_finish}
          onClick={() => setOverlay('finish-confirm')}
        >
          Selesai Eksplorasi
        </button>
      </div>

      {/* ── Panel area kiri bawah (LFS #tour-panel) ── */}
      <div id="tour-panel">
        <div className="tour-area-label">Area Saat Ini</div>
        <div className="tour-area-name">{node.name}</div>
        <div className="tour-area-pos">
          {area?.name ?? ''}
          {nodeIndex && area ? ` · Titik ${nodeIndex} dari ${area.panorama_node_ids.length}` : ''}
        </div>
        <div className="tour-area-desc">
          Klik lingkaran untuk berpindah titik, lalu tekan Identifikasi saat melihat bagian candi.
        </div>
      </div>

      {/* ── Petunjuk kontrol (LFS #controls-hint) ── */}
      <div id="controls-hint" className={hintVisible ? '' : 'hidden'}>
        Geser mouse / layar untuk melihat sekeliling &nbsp;·&nbsp; klik atau tatap lingkaran untuk berpindah
        &nbsp;·&nbsp; ikon VR untuk mode headset
      </div>

      {overlay === 'none' && <IdentifyButton onClick={handleIdentify} pending={predict.isPending} />}
      {overlay === 'identifying' && <IdentifyingOverlay />}
      {overlay === 'no-detection' && <NoDetectionOverlay onClose={() => setOverlay('none')} />}
      {overlay === 'ml-error' && <MlErrorOverlay onRetry={handleIdentify} onClose={() => setOverlay('none')} />}
      {overlay === 'prediction' && detection && (
        <PredictionResultOverlay
          detection={detection}
          onLearn={() => {
            setActiveHeritageObjectId(detection.heritage_object_id);
            setDetection(null);
            setOverlay('material');
          }}
          onClose={() => {
            setDetection(null);
            setOverlay('none');
          }}
        />
      )}
      {overlay === 'material' && activeHeritageObjectId && (
        <MaterialOverlay
          sessionId={sessionId}
          heritageObjectId={activeHeritageObjectId}
          onClose={() => {
            setOverlay('none');
            setActiveHeritageObjectId(null);
          }}
        />
      )}
      {overlay === 'finish-confirm' && (
        <FinishConfirmOverlay
          pending={completeExploration.isPending}
          onConfirm={handleFinish}
          onCancel={() => setOverlay('none')}
        />
      )}
      {completeExploration.isError && (
        <div className="vr-toast">
          <ErrorState error={completeExploration.error} />
        </div>
      )}

      {/* ── Kembali ke portal (LFS #scene-btn). Sesi tetap tersimpan di backend. ── */}
      <button id="scene-btn" className="is-visible" onClick={() => navigate('/')}>
        ← Portal
      </button>
    </div>
  );
}

export default function ExplorePage() {
  const { sessionId = '' } = useParams();
  return (
    <SessionPhaseGuard sessionId={sessionId} expectedPhase="exploration">
      {(session) => <ExploreContent session={session} />}
    </SessionPhaseGuard>
  );
}
