import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import * as mock from '@/api/mock/heritage';
import type { HeritageArea, HeritageSite, PanoramaNode } from '@/types/api';

export function getHeritageSites(): Promise<HeritageSite[]> {
  if (isMock) return mock.getHeritageSites();
  return http<HeritageSite[]>('GET', '/heritage-sites');
}

export function getHeritageSite(slug: string): Promise<HeritageSite> {
  if (isMock) return mock.getHeritageSite(slug);
  return http<HeritageSite>('GET', `/heritage-sites/${slug}`);
}

export function getHeritageAreas(slug: string): Promise<HeritageArea[]> {
  if (isMock) return mock.getHeritageAreas(slug);
  return http<HeritageArea[]>('GET', `/heritage-sites/${slug}/areas`);
}

export function getPanoramaNode(id: string): Promise<PanoramaNode> {
  if (isMock) return mock.getPanoramaNode(id);
  return http<PanoramaNode>('GET', `/panorama-nodes/${id}`);
}
