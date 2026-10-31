import { Link } from 'react-router-dom';
import { HomeIcon } from '@/components/icons';

export default function NotFoundPage() {
  return (
    <div className="center-screen" style={{ textAlign: 'center' }}>
      <div className="blob-bg" aria-hidden="true" />
      <div>
        <div className="nf-code" aria-hidden="true">404</div>
        <h1 className="section-h2" style={{ marginTop: 8 }}>Halaman Tidak Ditemukan</h1>
        <p className="section-desc" style={{ marginBottom: 24 }}>Halaman yang kamu cari tidak tersedia.</p>
        <Link to="/" className="btn btn-primary">
          <HomeIcon />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
