import Button from '@/components/Button';

/** PRD #31 — kosongnya deteksi BUKAN error aplikasi, tapi hasil normal. */
export default function NoDetectionOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-x-0 bottom-24 z-20 flex justify-center px-4" role="status">
      <div className="max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-xl">
        <p className="font-semibold text-slate-800">
          Belum ada objek yang dapat diidentifikasi pada pandangan ini.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Coba arahkan pandangan ke objek lain dan lakukan identifikasi kembali.
        </p>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Mengerti
        </Button>
      </div>
    </div>
  );
}
