import type { PanoramaHotspot } from '@/types/api';
import { hotspotPosition } from './position';

/**
 * Hotspot navigasi antar panorama node. Posisi SELALU dihitung dari
 * yaw/pitch yang dikirim backend (PRD #25, #26) — tidak pernah
 * "Point A -> Point B" yang di-hardcode di frontend.
 */
export default function Hotspot({
  hotspot,
  onActivate,
}: {
  hotspot: PanoramaHotspot;
  onActivate: (targetNodeId: string) => void;
}) {
  return (
    <a-entity
      position={hotspotPosition(hotspot.yaw, hotspot.pitch)}
      class="clickable"
      onClick={() => onActivate(hotspot.target_node_id)}
    >
      <a-entity
        geometry="primitive: ring; radiusInner: 0.3; radiusOuter: 0.45"
        material="color: #10B981; shader: flat; opacity: 0.9"
        animation__pulse="property: scale; dir: alternate; dur: 900; loop: true; to: 1.15 1.15 1.15"
      />
      <a-entity
        text={`value: ${hotspot.label}; align: center; color: #FFFFFF; width: 4`}
        position="0 -0.6 0"
      />
    </a-entity>
  );
}
