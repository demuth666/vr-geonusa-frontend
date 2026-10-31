import { describe, expect, it } from 'vitest';
import { neighborNodeIds, preloadImage, preloadedImageUrls, releaseImagesExcept } from './preload';
import { MOCK_PANORAMA_NODES } from '@/api/mock/data';

describe('panorama preload (PRD #50)', () => {
  it('only direct neighbors from API hotspots, never all nodes', () => {
    expect(neighborNodeIds(MOCK_PANORAMA_NODES['node-1'])).toEqual(['node-2']);
    expect(neighborNodeIds(MOCK_PANORAMA_NODES['node-2']).sort()).toEqual(['node-1', 'node-3']);
  });

  it('releases images that are no longer neighbors', () => {
    preloadImage('/a.jpg');
    preloadImage('/b.jpg');
    preloadImage('/c.jpg');
    releaseImagesExcept(new Set(['/b.jpg']));
    expect(preloadedImageUrls()).toEqual(['/b.jpg']);
  });
});
