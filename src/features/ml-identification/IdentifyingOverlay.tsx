import Spinner from '@/components/Spinner';

/** PRD #29 — inferensi ML asinkron, jangan bekukan render panorama di belakangnya. */
export default function IdentifyingOverlay() {
  return (
    <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center" aria-live="polite">
      <div className="rounded-2xl bg-white/95 px-6 py-4 shadow-xl">
        <Spinner label="Mengidentifikasi objek..." />
      </div>
    </div>
  );
}
