/** Konversi yaw/pitch (derajat, dari API) ke posisi 3D di bola panorama. */
const RADIUS = 4.5;

export function hotspotPosition(yawDeg: number, pitchDeg: number): string {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;
  const x = RADIUS * Math.sin(yaw) * Math.cos(pitch);
  const y = RADIUS * Math.sin(pitch);
  const z = -RADIUS * Math.cos(yaw) * Math.cos(pitch);
  return `${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`;
}

/**
 * Rotasi supaya ring hotspot menghadap kamera di titik pusat (pengganti
 * komponen `look-at` di LFS). A-Frame memakai urutan Euler YXZ (derajat).
 */
export function hotspotRotation(yawDeg: number, pitchDeg: number): string {
  return `${pitchDeg} ${-yawDeg} 0`;
}
