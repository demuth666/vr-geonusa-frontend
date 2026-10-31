import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getPanoramaNode } from '@/features/heritage/api';
import type { PanoramaNode } from '@/types/api';

/**
 * PRD #50: preload HANYA node tetangga langsung (target hotspot dari API),
 * bukan seluruh panorama. Image yang sudah tidak bertetangga dilepas
 * referensinya supaya bisa di-GC browser.
 */
const preloadedImages = new Map<string, HTMLImageElement>(); // image_url -> Image

/** id node tetangga langsung, murni dari data hotspot backend. */
export function neighborNodeIds(node: PanoramaNode): string[] {
  return [...new Set(node.hotspots.map((h) => h.target_node_id))].filter((id) => id !== node.id);
}

export function preloadImage(url: string): void {
  if (!url || preloadedImages.has(url)) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  preloadedImages.set(url, img);
}

/** Lepas semua image preload kecuali yang ada di `keepUrls`. */
export function releaseImagesExcept(keepUrls: Set<string>): void {
  for (const [url, img] of preloadedImages) {
    if (!keepUrls.has(url)) {
      img.src = '';
      preloadedImages.delete(url);
    }
  }
}

/** Untuk test. */
export function preloadedImageUrls(): string[] {
  return [...preloadedImages.keys()];
}

export function usePreloadNeighborPanoramas(node: PanoramaNode | undefined): void {
  const qc = useQueryClient();

  useEffect(() => {
    if (!node) return;
    let cancelled = false;
    const ids = neighborNodeIds(node);

    Promise.allSettled(
      ids.map((id) =>
        qc.fetchQuery({
          queryKey: ['panorama-nodes', id],
          queryFn: () => getPanoramaNode(id),
          staleTime: 60_000,
        })
      )
    ).then((results) => {
      if (cancelled) return;
      const keep = new Set<string>([node.image_url]);
      for (const r of results) {
        if (r.status === 'fulfilled') {
          keep.add(r.value.image_url);
          preloadImage(r.value.image_url);
        }
      }
      releaseImagesExcept(keep);
    });

    return () => {
      cancelled = true;
    };
  }, [node, qc]);
}
