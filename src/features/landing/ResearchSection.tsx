import { BookIcon, CheckIcon, FlagIcon, StarIcon } from '@/components/icons';

/**
 * PRD #13 "Research / Educational Context" — tidak ada di LFS, dibuat dengan
 * komponen visual LFS. Hanya menjelaskan alur; TIDAK menampilkan skor atau
 * data riset apa pun (PRD #41, #46).
 */
export default function ResearchSection() {
  return (
    <section id="penelitian" className="section section-alt" aria-labelledby="research-h2">
      <div className="section-head reveal">
        <div className="section-kicker">
          <FlagIcon />
          Konteks Penelitian
        </div>
        <h2 className="section-h2" id="research-h2">
          Bagian dari <em>Riset Pendidikan</em>
        </h2>
        <p className="section-desc">
          VR-GeoNusa dikembangkan dalam penelitian Hibah Fundamental BIMA 2026 tentang pembelajaran geometri berbasis
          Virtual Reality dan warisan budaya. Setiap sesi belajar mengikuti alur berikut.
        </p>
      </div>

      <div className="steps-grid reveal">
        <div className="step-card">
          <div className="step-num" aria-hidden="true">1</div>
          <div className="step-ico step-ico-1" aria-hidden="true">
            <BookIcon />
          </div>
          <div className="step-title">Pretest</div>
          <div className="step-desc">Beberapa soal singkat untuk mengetahui pemahaman awalmu.</div>
        </div>
        <div className="step-card">
          <div className="step-num" aria-hidden="true">2</div>
          <div className="step-ico step-ico-4" aria-hidden="true">
            <StarIcon />
          </div>
          <div className="step-title">Eksplorasi & Kuis</div>
          <div className="step-desc">Jelajahi candi, kenali bentuknya, lalu uji pemahaman lewat kuis singkat.</div>
        </div>
        <div className="step-card">
          <div className="step-num" aria-hidden="true">3</div>
          <div className="step-ico step-ico-2" aria-hidden="true">
            <CheckIcon />
          </div>
          <div className="step-title">Posttest</div>
          <div className="step-desc">Soal setelah eksplorasi untuk melihat perkembangan pemahamanmu.</div>
        </div>
        <div className="step-card">
          <div className="step-num" aria-hidden="true">4</div>
          <div className="step-ico step-ico-3" aria-hidden="true">
            <FlagIcon />
          </div>
          <div className="step-title">Self-Efficacy</div>
          <div className="step-desc">Kuesioner keyakinan diri — tidak ada jawaban benar atau salah.</div>
        </div>
      </div>
    </section>
  );
}
