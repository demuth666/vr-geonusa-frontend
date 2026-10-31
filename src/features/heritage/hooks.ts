import { useQuery } from '@tanstack/react-query';
import * as api from './api';

export function useHeritageSites() {
  return useQuery({ queryKey: ['heritage-sites'], queryFn: api.getHeritageSites });
}

export function useHeritageSite(slug: string | undefined) {
  return useQuery({
    queryKey: ['heritage-sites', slug],
    queryFn: () => api.getHeritageSite(slug as string),
    enabled: !!slug,
  });
}

export function useHeritageAreas(slug: string | undefined) {
  return useQuery({
    queryKey: ['heritage-sites', slug, 'areas'],
    queryFn: () => api.getHeritageAreas(slug as string),
    enabled: !!slug,
  });
}

export function usePanoramaNode(nodeId: string | null | undefined) {
  return useQuery({
    queryKey: ['panorama-nodes', nodeId],
    queryFn: () => api.getPanoramaNode(nodeId as string),
    enabled: !!nodeId,
    staleTime: 60_000,
  });
}
