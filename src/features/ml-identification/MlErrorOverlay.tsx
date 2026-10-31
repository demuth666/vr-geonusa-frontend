import InfoPanel from '@/vr/hud/InfoPanel';

/** PRD #32 — feedback non-destruktif; panorama tetap jalan di belakang. */
export default function MlErrorOverlay({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <InfoPanel label="Identifikasi" onClose={onClose} role="alert">
      <p className="info-msg">Identifikasi sedang tidak tersedia.</p>
      <p className="info-hint">Kamu tetap dapat melanjutkan eksplorasi panorama.</p>
      <div className="info-actions">
        <button className="vr-secondary-btn" onClick={onClose}>
          Tutup
        </button>
        <button className="vr-primary-btn" onClick={onRetry}>
          Coba Lagi
        </button>
      </div>
    </InfoPanel>
  );
}
