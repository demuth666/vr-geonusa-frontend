import { Link } from 'react-router-dom';
import Button from '@/components/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
      <p className="text-slate-500">Halaman yang kamu cari tidak tersedia.</p>
      <Link to="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  );
}
