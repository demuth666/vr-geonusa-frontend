export interface ViewportCapture {
  yaw: number;
  pitch: number;
  fov: number;
  imageDataUrl: string;
}

/**
 * Mengambil metadata kamera + screenshot viewport panorama saat ini.
 * Dipakai HANYA untuk dikirim ke backend Laravel (PRD #28) — tidak pernah
 * untuk menentukan geometri di sisi frontend sendiri.
 *
 * `sceneEl` harus berupa elemen <a-scene> dengan atribut
 * `renderer="preserveDrawingBuffer: true"` supaya toDataURL() tidak
 * mengembalikan kanvas kosong (default WebGL membersihkan buffer setelah
 * setiap frame).
 */
export function captureViewport(sceneEl: any, cameraEl: any): ViewportCapture {
  const rotation = cameraEl?.getAttribute?.('rotation') ?? { x: 0, y: 0, z: 0 };
  const cameraData = cameraEl?.getAttribute?.('camera') ?? {};
  const canvas: HTMLCanvasElement | undefined = sceneEl?.canvas;

  let imageDataUrl = '';
  try {
    imageDataUrl = canvas ? canvas.toDataURL('image/jpeg', 0.6) : '';
  } catch {
    // Canvas tainted atau belum siap — biarkan string kosong, backend akan
    // menolak dengan 422 dan UI menampilkan error state, bukan crash.
    imageDataUrl = '';
  }

  return {
    yaw: Math.round(rotation.y ?? 0),
    pitch: Math.round(rotation.x ?? 0),
    fov: cameraData.fov ?? 80,
    imageDataUrl,
  };
}
