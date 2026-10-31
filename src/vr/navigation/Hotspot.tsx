import type { PanoramaHotspot } from '@/types/api';
import { hotspotPosition, hotspotRotation } from './position';

/**
 * Hotspot navigasi antar panorama node — tampilan ring cyan LFS
 * (public/js/tour.js buildHotspot). Posisi SELALU dihitung dari yaw/pitch
 * yang dikirim backend (PRD #25, #26), tidak pernah di-hardcode.
 * Class raycast + listener dipasang di ring itu sendiri (mesh yang kena ray).
 */
export default function Hotspot({
  hotspot,
  onActivate,
}: {
  hotspot: PanoramaHotspot;
  onActivate: (targetNodeId: string) => void;
}) {
  return (
    <a-ring
      class="clickable tour-hotspot-ring"
      position={hotspotPosition(hotspot.yaw, hotspot.pitch)}
      rotation={hotspotRotation(hotspot.yaw, hotspot.pitch)}
      radius-inner="0.28"
      radius-outer="0.4"
      color="#00e5ff"
      opacity="0.85"
      side="double"
      animation__pulse="property: material.opacity; from: 0.55; to: 1; dir: alternate; dur: 800; loop: true; easing: easeInOutSine"
      onClick={() => onActivate(hotspot.target_node_id)}
    >
      <a-text value={hotspot.label} align="center" color="#ffffff" width="2.4" position="0 -0.62 0" />
    </a-ring>
  );
}
