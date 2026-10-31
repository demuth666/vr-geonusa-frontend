import Button from '@/components/Button';

export default function FinishConfirmOverlay({
  pending,
  onConfirm,
  onCancel,
}: {
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <p className="text-lg font-bold text-slate-900">Selesaikan eksplorasi?</p>
        <p className="mt-1 text-sm text-slate-500">
          Kamu akan melanjutkan ke posttest setelah ini.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            Kembali
          </Button>
          <Button onClick={onConfirm} disabled={pending}>
            {pending ? 'Memproses…' : 'Selesai'}
          </Button>
        </div>
      </div>
    </div>
  );
}
