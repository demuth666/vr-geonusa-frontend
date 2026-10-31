import { Link } from 'react-router-dom';
import { CompassIcon } from './icons';

/** Footer LFS (.footer kids.css). Link admin/API status dihapus — di luar scope frontend siswa. */
export default function Footer() {
  return (
    <>
      <footer className="footer" role="contentinfo">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <CompassIcon stroke="#10B981" fill="#10B981" />
            VR-GeoNusa
          </div>
          <p>
            Media pembelajaran geometri ruang berbasis Virtual Reality dan warisan budaya Nusantara.
            Didukung Hibah Fundamental BIMA 2026.
          </p>
        </div>
        <div className="footer-col">
          <h4>Destinasi VR</h4>
          <Link to="/destinations/borobudur">Candi Borobudur</Link>
          <Link to="/#destinasi" style={{ color: '#334155' }}>Candi Prambanan (segera)</Link>
          <Link to="/#destinasi" style={{ color: '#334155' }}>Keraton Yogyakarta (segera)</Link>
        </div>
        <div className="footer-col">
          <h4>Navigasi</h4>
          <Link to="/#cara-main">Cara Bermain</Link>
          <Link to="/#geometri">Bangun Ruang</Link>
          <Link to="/team">Tim Peneliti</Link>
        </div>
        <div className="footer-col">
          <h4>Sumber Daya</h4>
          <Link to="/login">Masuk Siswa</Link>
          <a href="https://github.com/Fathoni89/VR-GeoNusa" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </div>
      </footer>
      <div className="footer-bottom">
        <p>© 2026 Tim VR-GeoNusa · Hibah Fundamental BIMA Kemenristekdikti</p>
        <p>Prototype Tahun 1 · WebXR · A-Frame 1.5</p>
      </div>
    </>
  );
}
