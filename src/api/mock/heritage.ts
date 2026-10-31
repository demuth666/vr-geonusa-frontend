import type { HeritageArea, HeritageSite, PanoramaNode } from '@/types/api';
import { MOCK_AREAS, MOCK_HERITAGE_SITES, MOCK_PANORAMA_NODES } from '@/api/mock/data';
import { delay, fail } from '@/api/mock/db';

export async function getHeritageSites(): Promise<HeritageSite[]> {
  await delay();
  return MOCK_HERITAGE_SITES;
}

export async function getHeritageSite(slug: string): Promise<HeritageSite> {
  await delay();
  const site = MOCK_HERITAGE_SITES.find((s) => s.slug === slug);
  if (!site) fail(404, 'heritage_site_not_found', `Heritage site "${slug}" not found`);
  return site;
}

export async function getHeritageAreas(slug: string): Promise<HeritageArea[]> {
  await delay();
  const site = MOCK_HERITAGE_SITES.find((s) => s.slug === slug);
  if (!site) fail(404, 'heritage_site_not_found', `Heritage site "${slug}" not found`);
  return MOCK_AREAS.filter((a) => a.heritage_site_id === site.id);
}

export async function getPanoramaNode(id: string): Promise<PanoramaNode> {
  await delay(250);
  const node = MOCK_PANORAMA_NODES[id];
  if (!node) fail(404, 'panorama_node_not_found', `Panorama node "${id}" not found`);
  return node;
}
