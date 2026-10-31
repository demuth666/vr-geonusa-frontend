import { useEffect, useRef, useState } from 'react';
import 'aframe';
import type { PanoramaNode } from '@/types/api';
import Hotspot from '@/vr/navigation/Hotspot';
import Spinner from '@/components/Spinner';
import { useUiStore } from '@/store/uiStore';

interface Props {
  node: PanoramaNode;
  onNavigate: (targetNodeId: string) => void;
  /** dipanggil host (ExplorePage) supaya identifikasi bisa mengambil screenshot + sudut kamera saat ini. */
  onSceneRef?: (sceneEl: any, cameraEl: any) => void;
}

/**
 * Lapisan WebXR/A-Frame murni untuk render panorama + navigasi hotspot.
 * Tidak tahu apa-apa soal learning session / API — itu tanggung jawab
 * ExplorePage. Lifecycle A-Frame dikelola lewat ref + useEffect (bukan
 * manipulasi DOM lepas di luar siklus React), dengan cleanup saat node
 * berganti supaya tidak ada listener/entity menumpuk.
 */
export default function PanoramaScene({ node, onNavigate, onSceneRef }: Props) {
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const [textureLoaded, setTextureLoaded] = useState(false);
  const setLastCamera = useUiStore((s) => s.setLastCamera);

  useEffect(() => {
    setTextureLoaded(false);
  }, [node.id]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const handleLoaded = () => setTextureLoaded(true);
    scene.addEventListener('loaded', handleLoaded);
    // Jika scene sudah pernah "loaded" sebelumnya (ganti node, scene yang
    // sama dipakai ulang), event 'loaded' A-Frame tidak terpanggil lagi.
    if (scene.hasLoaded) setTextureLoaded(true);
    return () => scene.removeEventListener('loaded', handleLoaded);
  }, []);

  useEffect(() => {
    if (sceneRef.current && cameraRef.current) {
      onSceneRef?.(sceneRef.current, cameraRef.current);
    }
  }, [onSceneRef, node.id]);

  // Catat yaw/pitch terakhir secara berkala supaya overlay materi bisa
  // mengembalikan pandangan siswa ke sudut yang kurang lebih sama (PRD #34).
  useEffect(() => {
    const interval = setInterval(() => {
      const rot = cameraRef.current?.getAttribute?.('rotation');
      if (rot) setLastCamera(rot.y, rot.x);
    }, 1000);
    return () => clearInterval(interval);
  }, [setLastCamera]);

  return (
    <div className="relative h-full w-full bg-slate-900">
      {!textureLoaded && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900">
          <Spinner label="Memuat panorama..." />
        </div>
      )}
      {/* key={node.id}: pastikan A-Frame scene benar2 reinit tiap pindah node
          area, bukan cuma ganti src, supaya tidak ada state kamera yang
          nyangkut aneh dari node sebelumnya. */}
      <a-scene
        key={node.id}
        ref={sceneRef}
        embedded
        renderer="preserveDrawingBuffer: true; antialias: true"
        vr-mode-ui="enabled: true"
        loading-screen="enabled: false"
        style={{ width: '100%', height: '100%' }}
      >
        <a-sky src={node.image_url} rotation="0 -90 0" />
        <a-camera
          ref={cameraRef}
          rotation={`${node.initial_pitch} ${node.initial_yaw} 0`}
          look-controls="reverseMouseDrag: false"
        >
          <a-cursor
            fuse={false}
            raycaster="objects: .clickable"
            geometry="primitive: ring; radiusInner: 0.015; radiusOuter: 0.02"
            material="color: #FFFFFF; shader: flat"
          />
        </a-camera>
        {node.hotspots.map((h) => (
          <Hotspot key={h.id} hotspot={h} onActivate={onNavigate} />
        ))}
      </a-scene>
    </div>
  );
}
