import { create } from 'zustand';

export type ExplorationOverlay =
  | 'none'
  | 'identifying'
  | 'no-detection'
  | 'ml-error'
  | 'prediction'
  | 'material'
  | 'finish-confirm';

interface UiState {
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  overlay: ExplorationOverlay;
  setOverlay: (overlay: ExplorationOverlay) => void;

  /**
   * Kamera yaw/pitch terakhir di panorama, murni transient UI (PRD #45).
   * Dipakai supaya saat overlay materi ditutup, siswa kembali ke sudut
   * pandang yang sama (PRD #34) — BUKAN source of truth apa pun untuk
   * backend, cuma kenyamanan render Three.js/A-Frame.
   */
  lastCameraYaw: number;
  lastCameraPitch: number;
  setLastCamera: (yaw: number, pitch: number) => void;

  /** id heritage object yang terakhir berhasil diidentifikasi, untuk overlay materi. */
  activeHeritageObjectId: string | null;
  setActiveHeritageObjectId: (id: string | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),

  overlay: 'none',
  setOverlay: (overlay) => set({ overlay }),

  lastCameraYaw: 0,
  lastCameraPitch: 0,
  setLastCamera: (yaw, pitch) => set({ lastCameraYaw: yaw, lastCameraPitch: pitch }),

  activeHeritageObjectId: null,
  setActiveHeritageObjectId: (id) => set({ activeHeritageObjectId: id }),
}));
