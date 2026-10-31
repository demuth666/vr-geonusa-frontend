import Button from '@/components/Button';

/** PRD #32 — kegagalan ML tidak boleh menghentikan/menutup eksplorasi panorama. */
export default function MlErrorOverlay({
  onRetry,
  onClose,
}: {
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-4" role="alert">
      <div className="max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
        <p className="font-semibold text-slate-800">Identifikasi sedang tidak tersedia.</p>
        <p className="mt-1 text-sm text-slate-500">Kamu tetap dapat melanjutkan eksplorasi panorama.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onRetry}>Coba Lagi</Button>
        </div>
      </div>
    </div>
  );
}
