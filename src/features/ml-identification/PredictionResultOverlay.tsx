import Button from '@/components/Button';
import type { MlDetection } from '@/types/api';

/**
 * PRD #30: tampilkan hasil identifikasi dari backend sebelum materi.
 * Confidence boleh ditampilkan; latency sengaja tidak ditampilkan.
 */
export default function PredictionResultOverlay({
  detection,
  onLearn,
  onClose,
}: {
  detection: MlDetection;
  onLearn: () => void;
  onClose: () => void;
}) {
  // Skala confidence belum didefinisikan di openapi.yaml; mock memakai 0..1.
  // Terima juga 0..100 supaya tidak tampil "9400%" bila backend beda skala.
  const raw = detection.confidence;
  const confidencePct = Math.round(raw <= 1 ? raw * 100 : raw);
  return (
    <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-4" role="status">
      <div className="w-full max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
        <p className="text-sm font-medium text-slate-500">Objek Teridentifikasi</p>
        <p className="mt-1 text-2xl font-extrabold uppercase tracking-wide text-brand-700">
          {detection.label}
        </p>
        <p className="mt-1 text-sm text-slate-600">Keyakinan model: {confidencePct}%</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onLearn}>Pelajari Bentuk</Button>
        </div>
      </div>
    </div>
  );
}
