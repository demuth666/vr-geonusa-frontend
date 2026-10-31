import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SessionPhaseGuard from '@/features/learning-session/SessionPhaseGuard';
import {
  useRecordPanoramaVisit,
  usePredictGeometry,
  useSessionProgress,
  useCompleteExploration,
} from '@/features/learning-session/hooks';
import { useHeritageAreas, usePanoramaNode } from '@/features/heritage/hooks';
import { useUiStore } from '@/store/uiStore';
import { sessionPhaseToPath } from '@/utils/session-routing';
import { captureViewport } from '@/vr/ml/capture';
import PanoramaScene from '@/vr/panorama/PanoramaScene';
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
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Spinner label="Menyiapkan eksplorasi..." />
      </div>
    );
  }
  if (areasQuery.isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 px-4">
        <ErrorState error={areasQuery.error} onRetry={() => areasQuery.refetch()} />
      </div>
    );
  }
  if (nodeQuery.isError || !nodeQuery.data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 px-4">
        <ErrorState error={nodeQuery.error} onRetry={() => nodeQuery.refetch()} />
      </div>
    );
  }

  const progress = progressQuery.data;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900">
      {/* Top bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent px-4 py-3 text-white">
        <span className="font-semibold">Borobudur</span>
        {progress && <ProgressBar percentage={progress.percentage} />}
        <button
          aria-label="Selesaikan eksplorasi"
          className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          disabled={!progress?.can_finish}
          onClick={() => setOverlay('finish-confirm')}
        >
          Selesai Eksplorasi
        </button>
      </div>

      <PanoramaScene node={nodeQuery.data} onNavigate={handleNavigate} onSceneRef={handleSceneRef} />

      {overlay === 'none' && <IdentifyButton onClick={handleIdentify} pending={predict.isPending} />}
      {overlay === 'identifying' && <IdentifyingOverlay />}
      {overlay === 'no-detection' && <NoDetectionOverlay onClose={() => setOverlay('none')} />}
      {overlay === 'ml-error' && (
        <MlErrorOverlay onRetry={handleIdentify} onClose={() => setOverlay('none')} />
      )}
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
        <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
          <div className="w-full max-w-sm">
            <ErrorState error={completeExploration.error} />
          </div>
        </div>
      )}
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
