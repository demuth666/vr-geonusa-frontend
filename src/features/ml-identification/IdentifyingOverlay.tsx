import Spinner from '@/components/Spinner';
import InfoPanel from '@/vr/hud/InfoPanel';

/** PRD #29 — inferensi ML asinkron, jangan bekukan render panorama di belakangnya. */
export default function IdentifyingOverlay() {
  return (
    <InfoPanel label="Identifikasi Geometri" role="status">
      <div className="info-spinner">
        <Spinner label="Mengidentifikasi objek..." />
      </div>
    </InfoPanel>
  );
}
