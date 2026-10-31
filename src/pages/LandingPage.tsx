import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useHeritageSites } from '@/features/heritage/hooks';
import DestinationBento from '@/features/landing/DestinationBento';
import HowToPlay from '@/features/landing/HowToPlay';
import GeometryGallery from '@/features/landing/GeometryGallery';
import TeamSection from '@/features/landing/TeamSection';
import { useReveal } from '@/hooks/useReveal';
import {
  BookIcon,
  FlagIcon,
  GlobeThinIcon,
  HomeIcon,
  LayersIcon,
  MapPinIcon,
  PlayIcon,
  SearchIcon,
} from '@/components/icons';

/**
 * Landing page — desain & isi dari VR-GeoNusa LFS (public/index.html).
 * Data destinasi dari GET /heritage-sites (PRD #13), sisanya konten statis.
 */
export default function LandingPage() {
  const sitesQuery = useHeritageSites();
  const sites = sitesQuery.data ?? [];
  const primary = sites.find((s) => s.status === 'available');
  const activeCount = sites.filter((s) => s.status === 'available').length;
  const areaCount = sites.reduce((n, s) => n + (s.status === 'available' ? s.available_areas_count : 0), 0);

  useReveal([sitesQuery.status]);

  return (
    <>
      <div className="blob-bg" aria-hidden="true" />
      <a href="#destinasi" className="skip-link">
        Lewati ke konten
      </a>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="hero" aria-labelledby="hero-h1">
        <div className="hero-left">
          <div className="hero-kicker" aria-label="Hibah Fundamental BIMA 2026">
            <FlagIcon />
            Hibah Fundamental BIMA 2026
          </div>

          <h1 className="hero-h1" id="hero-h1">
            Petualangan
            <br />
            <span className="accent-green">Geometri</span> di
            <br />
            <span className="accent-amber">Candi Nusantara</span>
          </h1>
          <p className="hero-sub">
            Masuki dunia Virtual Reality dan temukan bentuk-bentuk geometri yang tersembunyi di dalam arsitektur
            Candi Borobudur dan Prambanan. Belajar matematika dengan cara yang seru!
          </p>

          <div className="hero-btns">
            <a href="#destinasi" className="btn btn-primary">
              <PlayIcon />
              Mulai Petualangan 360
            </a>
            <a href="#cara-main" className="btn btn-outline">
              <BookIcon />
              Cara Bermain
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-ico ico-green">
                <HomeIcon />
              </div>
              <div>
                <span className="hero-stat-num" id="stat-scenes">{sitesQuery.data ? activeCount : '–'}</span>
                <span className="hero-stat-lbl">Candi Aktif</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-ico ico-sky">
                <SearchIcon />
              </div>
              <div>
                <span className="hero-stat-num" id="stat-objects">{sitesQuery.data ? areaCount : '–'}</span>
                <span className="hero-stat-lbl">Area Panorama</span>
              </div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-ico ico-amber">
                <LayersIcon />
              </div>
              <div>
                <span className="hero-stat-num">8</span>
                <span className="hero-stat-lbl">Bangun Ruang</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right" aria-hidden="true">
          <div className="hero-card">
            <div className="hero-card-photo">
              <img src={primary?.cover_image_url ?? '/assets/images/borobudur.jpg'} alt="Candi Borobudur" />
              <div className="hero-card-photo-overlay" />
              <div className="hero-card-photo-badge">
                <span className="badge-live-dot" />
                <GlobeThinIcon />
                Tur 360 Aktif
              </div>
              <div className="hero-card-caption">
                <strong>{primary?.name ?? 'Candi Borobudur'}</strong>
                <span>Magelang, Jawa Tengah · Abad ke-8 M</span>
              </div>
            </div>
            <div className="hero-card-body">
              <div className="hero-card-stat">
                <div className="float-stat-ico">
                  <LayersIcon />
                </div>
                <div>
                  <span className="float-stat-num">8</span>
                  <span className="float-stat-lbl">Bangun Ruang</span>
                </div>
              </div>
              <Link to="/destinations/borobudur" className="btn btn-primary hero-card-cta" tabIndex={-1}>
                <PlayIcon />
                Mulai Petualangan 360
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DESTINASI ═══ */}
      <section id="destinasi" className="section section-alt" aria-labelledby="dest-h2">
        <div className="section-head reveal">
          <div className="section-kicker">
            <MapPinIcon />
            Pilih Destinasi
          </div>
          <h2 className="section-h2" id="dest-h2">
            Jelajahi <em>Candi Indonesia</em>
          </h2>
          <p className="section-desc">
            Pilih candi yang ingin kamu masuki dan temukan bentuk geometri yang tersembunyi di setiap sudutnya!
          </p>
        </div>

        {sitesQuery.isLoading && (
          <div className="center-block">
            <Spinner label="Memuat destinasi..." />
          </div>
        )}
        {sitesQuery.isError && <ErrorState error={sitesQuery.error} onRetry={() => sitesQuery.refetch()} />}
        {sitesQuery.data && sitesQuery.data.length === 0 && <EmptyState title="Belum ada destinasi" />}
        {sitesQuery.data && sitesQuery.data.length > 0 && (
          <div className="reveal in">
            <DestinationBento sites={sitesQuery.data} />
          </div>
        )}
      </section>

      <HowToPlay />
      <GeometryGallery />
      <TeamSection />

      <Footer />
    </>
  );
}
