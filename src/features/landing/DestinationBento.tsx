import { Link } from 'react-router-dom';
import type { HeritageSite } from '@/types/api';
import { ClockIcon, GlobeIcon, MapPinIcon, PlayIcon } from '@/components/icons';

/**
 * Bento grid destinasi LFS (.bento kids.css). Daftar & status situs datang
 * dari GET /heritage-sites (PRD #13) — situs `available` pertama jadi kartu
 * utama, sisanya tile "Segera Hadir" (Prambanan = Coming Soon, PRD #6).
 */
export default function DestinationBento({ sites }: { sites: HeritageSite[] }) {
  const primary = sites.find((s) => s.status === 'available');
  const others = sites.filter((s) => s !== primary);

  return (
    <div className={`bento${others.length === 1 ? ' has-2' : ''}`}>
      {primary && (
        <Link
          to={`/destinations/${primary.slug}`}
          className="bento-card bento-primary"
          aria-label={`Masuk tur 360 ${primary.name}`}
        >
          <img className="bento-img" src={primary.cover_image_url} alt={primary.name} />
          <div className="bento-overlay" aria-hidden="true" />
          <div className="bento-body">
            <div className="bento-status status-live">
              <GlobeIcon />
              Foto 360 Aktif
            </div>
            <div className="bento-name">{primary.name}</div>
            <div className="bento-loc">
              <MapPinIcon thin />
              {primary.location}
            </div>
            <span className="bento-btn" aria-hidden="true">
              <PlayIcon />
              Masuk Tur 360
            </span>
          </div>
        </Link>
      )}

      {others.map((site) => (
        <div key={site.id} className={`bento-card bento-soon${others.length === 1 ? ' bento-tall' : ''}`} aria-label={`${site.name} — segera hadir`}>
          <img className="bento-img" src={site.cover_image_url} alt={site.name} />
          <div className="bento-overlay" aria-hidden="true" />
          <div className="bento-tile-body">
            <div className="bento-status status-soon">
              <ClockIcon />
              Segera Hadir
            </div>
            <div className="bento-name-sm">{site.name}</div>
            <div className="bento-loc-sm">
              <MapPinIcon thin />
              {site.location}
            </div>
            <div className="bento-soon-note">{site.short_description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
