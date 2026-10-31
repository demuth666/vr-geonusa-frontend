import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    </header>
  );
}
