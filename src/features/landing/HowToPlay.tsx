import { GamepadIcon, HeadsetIcon, MouseIcon, NavigateIcon, SearchIcon } from '@/components/icons';

/** Seksi "Cara Bermain" LFS — teks disesuaikan dengan alur PRD V1. */
export default function HowToPlay() {
  return (
    <section id="cara-main" className="section" aria-labelledby="cara-h2">
      <div className="section-head reveal">
        <div className="section-kicker">
          <GamepadIcon />
          Cara Bermain
        </div>
        <h2 className="section-h2" id="cara-h2">
          Mudah <em>Dimainkan</em>
        </h2>
        <p className="section-desc">
          Ikuti 4 langkah mudah ini dan kamu siap berpetualangan di dalam dunia Virtual Reality!
        </p>
      </div>

      <div className="steps-grid reveal">
        <div className="step-card">
          <div className="step-num" aria-hidden="true">1</div>
          <div className="step-ico step-ico-1" aria-hidden="true">
            <NavigateIcon />
          </div>
          <div className="step-title">Pilih Candi</div>
          <div className="step-desc">
            Pilih candi yang ingin kamu kunjungi — mulai dari Candi Borobudur. Klik tombol "Masuk Tur" untuk mulai!
          </div>
        </div>

        <div className="step-card">
          <div className="step-num" aria-hidden="true">2</div>
          <div className="step-ico step-ico-2" aria-hidden="true">
            <MouseIcon />
          </div>
          <div className="step-title">Gerakkan Tampilan</div>
          <div className="step-desc">
            <strong>Komputer:</strong> Geser mouse.
            <br />
            <strong>HP:</strong> Sentuh dan geser layar.
            <br />
            <strong>Headset:</strong> Gerakkan kepala.
          </div>
        </div>

        <div className="step-card">
          <div className="step-num" aria-hidden="true">3</div>
          <div className="step-ico step-ico-3" aria-hidden="true">
            <SearchIcon />
          </div>
          <div className="step-title">Temukan Geometri</div>
          <div className="step-desc">
            Arahkan pandangan ke bagian candi, lalu tekan tombol "Identifikasi" untuk melihat nama bentuk geometrinya!
          </div>
        </div>

        <div className="step-card">
          <div className="step-num" aria-hidden="true">4</div>
          <div className="step-ico step-ico-4" aria-hidden="true">
            <HeadsetIcon />
          </div>
          <div className="step-title">Buka Mode VR</div>
          <div className="step-desc">
            Punya kacamata VR? Klik ikon VR di pojok layar untuk masuk ke mode imersif penuh!
          </div>
        </div>
      </div>
    </section>
  );
}
