import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import { useHeritageSite } from '@/features/heritage/hooks';
import { CheckIcon, GlobeIcon, LayersIcon, MapPinIcon, PlayIcon, SearchIcon } from '@/components/icons';

/**
 * Route publik /destinations/:slug. CTA "Mulai Eksplorasi" mengarah ke
 * /app/borobudur/intro (protected). Pengecekan auth dilakukan oleh
 * ProtectedRoute, bukan di sini (PRD #15).
 */
export default function BorobudurDetailPage() {
  const { slug = 'borobudur' } = useParams();
  const siteQuery = useHeritageSite(slug);

  if (siteQuery.isLoading) {
    return (
      <div className="center-screen">
        <Spinner label="Memuat destinasi..." />
      </div>
    );
  }
  if (siteQuery.isError || !siteQuery.data) {
    return (
      <div className="center-screen">
        <div style={{ width: 'min(420px, 100%)' }}>
          <ErrorState error={siteQuery.error} onRetry={() => siteQuery.refetch()} />
        </div>
      </div>
    );
  }

  const site = siteQuery.data;
  const available = site.status === 'available';

  return (
    <div className="page">
      <div className="blob-bg" aria-hidden="true" />
      <Navbar />
      <main className="page-main">
        <section className="section detail-hero">
          <div className="detail-grid">
            <div>
              <div className={`bento-status ${available ? 'status-live' : 'status-soon'}`}>
                <GlobeIcon />
                {available ? 'Foto 360 Aktif' : 'Segera Hadir'}
              </div>
              <h1 className="hero-h1">{site.name}</h1>
              <div className="section-kicker" style={{ color: 'var(--text-2)', textTransform: 'none', letterSpacing: 0 }}>
                <MapPinIcon />
                {site.location}
              </div>
              <p className="hero-sub" style={{ maxWidth: 560, marginBottom: 0 }}>
                {site.description}
              </p>

              <div className="detail-meta">
                <div className="hero-stat">
                  <div className="hero-stat-ico ico-sky">
                    <SearchIcon />
                  </div>
                  <div>
                    <span className="hero-stat-num">{site.available_areas_count}</span>
                    <span className="hero-stat-lbl">Area Panorama</span>
                  </div>
                </div>
                <div className="hero-stat">
                  <div className="hero-stat-ico ico-amber">
                    <LayersIcon />
                  </div>
                  <div>
                    <span className="hero-stat-num">360°</span>
                    <span className="hero-stat-lbl">Foto Panorama</span>
                  </div>
                </div>
              </div>

              {available && (
                <Link to="/app/borobudur/intro" className="btn btn-primary">
                  <PlayIcon />
                  Mulai Eksplorasi
                </Link>
              )}
            </div>

            <div className="detail-photo">
              <img src={site.cover_image_url} alt={site.name} />
              <div className="hero-card-photo-overlay" />
            </div>
          </div>
        </section>

        {(site.learning_objectives.length > 0 || site.experience_features.length > 0) && (
          <section className="section section-alt">
            <div className="detail-lists">
              <div className="step-card detail-list">
                <div className="step-title">
                  <span className="step-num" style={{ margin: 0 }}>
                    <CheckIcon />
                  </span>
                  Tujuan Pembelajaran
                </div>
                <ul>
                  {site.learning_objectives.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>
              <div className="step-card detail-list sky">
                <div className="step-title">
                  <span className="step-num" style={{ margin: 0, background: 'var(--sky-soft)', color: 'var(--sky)' }}>
                    <GlobeIcon />
                  </span>
                  Fitur Pengalaman
                </div>
                <ul>
                  {site.experience_features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
