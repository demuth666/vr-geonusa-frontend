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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<any>(null);
  // Simpan id node yang texture-nya SUDAH termuat, bukan boolean. Dengan
  // begitu status "loaded" otomatis false begitu node berganti (dihitung saat
  // render, tanpa effect reset yang bisa kalah balapan dengan event texture).
  const [loadedNodeId, setLoadedNodeId] = useState<string | null>(null);
  const textureLoaded = loadedNodeId === node.id;
  const setLastCamera = useUiStore((s) => s.setLastCamera);

  // PRD #26/#47: spinner mengikuti texture panorama (a-sky), bukan event
  // 'loaded' scene. <a-scene> di-remount tiap ganti node (key={node.id}),
  // jadi listener dipasang SEKALI di wrapper div (tidak ikut remount) dan
  // menangkap event 'materialtextureloaded' yang bubble dari <a-sky>.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const handleTextureLoaded = (e: Event) => {
      const target = e.target as Element | null;
      const nodeId = target?.getAttribute?.('data-node-id');
      if (nodeId) setLoadedNodeId(nodeId);
    };
    wrapper.addEventListener('materialtextureloaded', handleTextureLoaded);
    return () => wrapper.removeEventListener('materialtextureloaded', handleTextureLoaded);
  }, []);

  // Fallback: A-Frame tidak meng-emit event saat texture gagal dimuat.
  // Jangan biarkan spinner menutup layar selamanya.
  useEffect(() => {
    const timer = setTimeout(() => setLoadedNodeId(node.id), 15000);
    return () => clearTimeout(timer);
  }, [node.id]);

  // PRD #50: lepas texture panorama lama saat pindah node / unmount. Scene
  // di-remount (key), renderer di-dispose A-Frame, tapi texture sky tetap
  // di-dispose eksplisit supaya memori GPU tidak menumpuk.
  useEffect(() => {
    const sky = skyRef.current;
    return () => {
      const mesh = sky?.getObject3D?.('mesh');
      const material = mesh?.material;
      material?.map?.dispose?.();
      material?.dispose?.();
    };
  }, [node.id]);

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
    <div ref={wrapperRef} className="vr-stage">
      {/* Loading texture: #loading-bar + #tour-fade LFS (vr.css). */}
      <div id="loading-bar" className={textureLoaded ? '' : 'is-loading'} aria-hidden="true" />
      <div id="tour-fade" className={textureLoaded ? '' : 'active'} aria-hidden="true" />
      {!textureLoaded && (
        <div className="tour-loading-label">
          <Spinner onDark label="Memuat panorama..." />
        </div>
      )}
      {/* key={node.id}: pastikan A-Frame scene benar2 reinit tiap pindah node
          area, bukan cuma ganti src, supaya tidak ada state kamera yang
          nyangkut aneh dari node sebelumnya. */}
      <a-scene
        key={node.id}
        ref={sceneRef}
        embedded
        renderer="colorManagement: true; preserveDrawingBuffer: true; antialias: true"
        vr-mode-ui="enabled: true"
        loading-screen="enabled: false"
        style={{ width: '100%', height: '100%' }}
      >
        <a-sky ref={skyRef} data-node-id={node.id} src={node.image_url} rotation="0 -90 0" />
        <a-camera
          ref={cameraRef}
          rotation={`${node.initial_pitch} ${node.initial_yaw} 0`}
          look-controls="pointerLockEnabled: false; reverseMouseDrag: false"
          wasd-controls="enabled: false"
        >
          {/* Kursor gaze LFS: cyan, fuse 1 detik (bisa dipakai di headset tanpa controller). */}
          <a-cursor
            fuse="true"
            fuse-timeout="1000"
            color="#00e5ff"
            opacity="0.8"
            raycaster="objects: .clickable; far: 25"
            animation__fusing="property: scale; from: 1 1 1; to: 0.5 0.5 0.5; dur: 1000; startEvents: fusing"
            animation__defuse="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
          />
        </a-camera>
        {node.hotspots.map((h) => (
          <Hotspot key={h.id} hotspot={h} onActivate={onNavigate} />
        ))}
      </a-scene>
    </div>
  );
}
