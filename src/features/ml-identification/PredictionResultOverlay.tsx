import type { MlDetection } from '@/types/api';
import InfoPanel from '@/vr/hud/InfoPanel';

/**
 * PRD #30: tampilkan hasil identifikasi dari backend sebelum materi.
 * Tampilan "Geometri Teridentifikasi" + bar confidence LFS. Latency tidak ditampilkan.
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
  const pct = Math.max(0, Math.min(100, Math.round(raw <= 1 ? raw * 100 : raw)));
  // Warna bar persis LFS (public/js/app.js showInfo).
  const color = pct >= 93 ? '#00e676' : pct >= 87 ? '#ffd700' : '#ff7043';

  return (
    <InfoPanel label="Objek Teridentifikasi" onClose={onClose} role="status">
      <div className="geo-name">{detection.label}</div>
      <div className="geo-sub">Hasil identifikasi model</div>

      <div className="conf-row" style={{ marginTop: 12 }}>
        <span className="conf-title">Keyakinan Model</span>
        <span className="conf-text">{pct}%</span>
      </div>
      <div className="conf-bar" aria-hidden="true">
        <div className="conf-fill" style={{ width: `${pct}%`, background: color }} />
      </div>

      <div className="info-actions">
        <button className="vr-secondary-btn" onClick={onClose}>
          Tutup
        </button>
        <button className="vr-primary-btn" onClick={onLearn}>
          Pelajari Bentuk
        </button>
      </div>
    </InfoPanel>
  );
}
