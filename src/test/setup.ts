import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { resetMockDb } from '@/api/mock/db';
import { setSessionWriteToken } from '@/api/session-token';
import { useUiStore } from '@/store/uiStore';

// Mock API tanpa latensi buatan supaya test cepat & deterministik.
vi.mock('@/api/mock/db', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/mock/db')>();
  return { ...actual, delay: () => Promise.resolve() };
});

// A-Frame/WebGL tidak jalan di jsdom. Ganti scene dengan stub; navigasi diuji
// lewat tombol hotspot HTML di ExplorePage (padanan keyboard, PRD #49).
vi.mock('@/vr/panorama/PanoramaScene', async () => {
  const React = await import('react');
  return {
    default: function PanoramaSceneStub({
      node,
      onNavigate,
      onSceneRef,
    }: {
      node: import('@/types/api').PanoramaNode;
      onNavigate: (id: string) => void;
      onSceneRef?: (scene: unknown, camera: unknown) => void;
    }) {
      React.useEffect(() => {
        const camera = {
          getAttribute: (name: string) =>
            name === 'rotation' ? { x: 5, y: 30, z: 0 } : name === 'camera' ? { fov: 80 } : undefined,
        };
        onSceneRef?.({ canvas: undefined }, camera);
      }, [node.id, onSceneRef]);
      void onNavigate;
      return React.createElement('div', { 'data-testid': 'panorama', 'data-node-id': node.id });
    },
  };
});

afterEach(() => {
  cleanup();
  resetMockDb();
  setSessionWriteToken(null);
  useUiStore.setState({ overlay: 'none', activeHeritageObjectId: null });
});
