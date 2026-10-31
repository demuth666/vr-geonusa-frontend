import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CompassIcon, UserIcon } from './icons';
import { useMe } from '@/features/auth/hooks';

/**
 * Navbar LFS (.nav kids.css). Link section memakai "/#id" supaya bekerja
 * dari halaman mana pun; "Tim" ke route publik /team (PRD #11).
 * Tombol kanan: LFS memakai "Admin Panel" — admin di luar scope frontend
 * (PRD #6), jadi diganti tombol Masuk / Ruang Belajar dengan gaya sama.
 */
export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Tutup menu mobile setiap pindah halaman/anchor.
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);
  const { data: me } = useMe();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`nav${solid ? ' is-solid' : ''}`} id="main-nav">
      <Link to="/" className="nav-brand" aria-label="VR-GeoNusa beranda">
        <span className="nav-brand-ico" aria-hidden="true">
          <CompassIcon />
        </span>
        <span className="nav-brand-name">
          VR-Geo<span>Nusa</span>
        </span>
      </Link>
      <nav className="nav-links" aria-label="Navigasi utama">
        <Link to="/#tentang">Tentang</Link>
        <Link to="/#destinasi">Destinasi</Link>
        <Link to="/#cara-main">Cara Main</Link>
        <Link to="/#geometri">Bangun Ruang</Link>
        <Link to="/team">Tim</Link>
      </nav>
      <div className="nav-spacer" />
      {me ? (
        <Link to="/app/borobudur/intro" className="nav-admin is-primary">
          <UserIcon />
          Ruang Belajar
        </Link>
      ) : (
        <Link to="/login" className="nav-admin">
          <UserIcon />
          Masuk
        </Link>
      )}
      <button
        type="button"
        className="nav-menu-btn"
        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={menuOpen}
        aria-controls="nav-mobile"
        onClick={() => setMenuOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {menuOpen ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {menuOpen && (
        <nav id="nav-mobile" className="nav-mobile" aria-label="Navigasi utama (mobile)">
          <Link to="/#tentang">Tentang</Link>
          <Link to="/#destinasi">Destinasi</Link>
          <Link to="/#cara-main">Cara Main</Link>
          <Link to="/#geometri">Bangun Ruang</Link>
          <Link to="/team">Tim</Link>
        </nav>
      )}
    </header>
  );
}
