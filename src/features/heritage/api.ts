import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import { mapHeritageArea, mapHeritageSite, mapPanoramaNode } from '@/api/adapters';
import type {
  BackendHeritageArea,
  BackendHeritageSite,
  BackendPanoramaNode,
} from '@/api/backend-types';
import * as mock from '@/api/mock/heritage';
import type { HeritageArea, HeritageSite, PanoramaNode } from '@/types/api';

export async function getHeritageSites(): Promise<HeritageSite[]> {
  if (isMock) return mock.getHeritageSites();
  const sites = await http<BackendHeritageSite[]>('GET', '/heritage-sites');
  return sites.map(mapHeritageSite);
}

export async function getHeritageSite(slug: string): Promise<HeritageSite> {
  if (isMock) return mock.getHeritageSite(slug);
  const site = await http<BackendHeritageSite>('GET', `/heritage-sites/${slug}`);
  return mapHeritageSite(site);
}

export async function getHeritageAreas(slug: string): Promise<HeritageArea[]> {
  if (isMock) return mock.getHeritageAreas(slug);
  const areas = await http<BackendHeritageArea[]>('GET', `/heritage-sites/${slug}/areas`);
  return areas.map(mapHeritageArea);
}

export async function getPanoramaNode(nodeId: string): Promise<PanoramaNode> {
  if (isMock) return mock.getPanoramaNode(nodeId);
  const node = await http<BackendPanoramaNode>('GET', `/panorama-nodes/${nodeId}`);
  return mapPanoramaNode(node);
}
