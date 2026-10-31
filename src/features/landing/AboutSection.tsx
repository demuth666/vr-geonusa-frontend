import { GlobeIcon, LayersIcon, SearchIcon, CompassIcon } from '@/components/icons';

/**
 * PRD #13 "About VR-GeoNusa" — tidak ada di LFS, dibuat dengan komponen
 * visual LFS (section-head + step-card). Isi diturunkan dari PRD #2.
 */
export default function AboutSection() {
  return (
    <section id="tentang" className="section" aria-labelledby="about-h2">
      <div className="section-head reveal">
        <div className="section-kicker">
          <span style={{ display: 'inline-flex', width: 16, height: 16, color: 'var(--green)' }}>
            <CompassIcon stroke="currentColor" fill="currentColor" />
          </span>
          Tentang VR-GeoNusa
        </div>
        <h2 className="section-h2" id="about-h2">
          Belajar Geometri dari <em>Warisan Budaya</em>
        </h2>
        <p className="section-desc">
          VR-GeoNusa adalah platform pembelajaran berbasis Virtual Reality/WebXR yang membantu siswa SMP mempelajari
          konsep geometri melalui eksplorasi situs warisan budaya Nusantara — dimulai dari Candi Borobudur.
        </p>
      </div>

      <div className="steps-grid about-grid reveal">
        <div className="step-card">
          <div className="step-ico step-ico-1" aria-hidden="true">
            <GlobeIcon />
          </div>
          <div className="step-title">Panorama 360° Asli</div>
          <div className="step-desc">
            Jelajahi foto panorama 360° Candi Borobudur dari komputer, HP, atau headset VR.
          </div>
        </div>
        <div className="step-card">
          <div className="step-ico step-ico-2" aria-hidden="true">
            <SearchIcon />
          </div>
          <div className="step-title">Identifikasi Bentuk</div>
          <div className="step-desc">
            Arahkan pandangan ke bagian candi dan biarkan sistem membantu mengenali bentuk geometrinya.
          </div>
        </div>
        <div className="step-card">
          <div className="step-ico step-ico-3" aria-hidden="true">
            <LayersIcon />
          </div>
          <div className="step-title">Materi Kontekstual</div>
          <div className="step-desc">
            Pelajari bangun ruang, rumusnya, dan hubungannya dengan makna budaya setiap bagian candi.
          </div>
        </div>
      </div>
    </section>
  );
}
