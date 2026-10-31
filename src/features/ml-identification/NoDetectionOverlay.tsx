import InfoPanel from '@/vr/hud/InfoPanel';

/** PRD #31 — kosongnya deteksi BUKAN error aplikasi, tapi hasil normal. */
export default function NoDetectionOverlay({ onClose }: { onClose: () => void }) {
  return (
    <InfoPanel label="Hasil Identifikasi" onClose={onClose} role="status">
      <p className="info-msg">Belum ada objek yang dapat diidentifikasi pada pandangan ini.</p>
      <p className="info-hint">Coba arahkan pandangan ke objek lain dan lakukan identifikasi kembali.</p>
      <button className="vr-primary-btn mt" onClick={onClose}>
        Mengerti
      </button>
    </InfoPanel>
  );
}
