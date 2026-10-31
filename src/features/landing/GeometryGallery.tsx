import type { ReactNode } from 'react';
import { LayersIcon } from '@/components/icons';

/**
 * Seksi "Kenali Bentuk Geometri" LFS — konten edukasi statis (bukan data
 * riset/backend). Wireframe SVG disalin apa adanya dari LFS.
 */
type Shape = {
  color: 'c-green' | 'c-sky' | 'c-amber' | 'c-coral' | 'c-violet';
  name: string;
  en: string;
  formula: string;
  example: string;
  svg: ReactNode;
};

const SHAPES: Shape[] = [
  {
    color: 'c-green', name: 'Kubus', en: 'Cube', formula: 'V = s × s × s', example: 'Contoh: kotak hadiah, dadu',
    svg: (<>
      <path data-w d="M28 36 50 26l22 10-22 10z" />
      <path data-w d="M28 36v28l22 10 22-10V36" />
      <path data-w2 d="M50 46v28" />
      <path data-w2 d="M28 36 50 46 72 36" />
    </>),
  },
  {
    color: 'c-sky', name: 'Balok', en: 'Rectangular Prism', formula: 'V = p × l × t', example: 'Contoh: bata, kotak sepatu',
    svg: (<>
      <path data-w d="M18 38 42 28 82 36 58 46z" />
      <path data-w d="M18 38v26l40 10V56M58 56l24-8V36" />
      <path data-w2 d="M18 64 42 74 82 62" />
      <path data-w2 d="M58 46 18 38" />
    </>),
  },
  {
    color: 'c-amber', name: 'Tabung', en: 'Cylinder', formula: 'V = π × r² × t', example: 'Contoh: kaleng, drum',
    svg: (<>
      <ellipse data-w cx="50" cy="26" rx="26" ry="9" />
      <path data-w d="M24 26v48M76 26v48" />
      <path data-w d="M24 74a26 9 0 0052 0" />
      <path data-w2 d="M24 74a26 9 0 0052 0" />
    </>),
  },
  {
    color: 'c-coral', name: 'Kerucut', en: 'Cone', formula: 'V = ⅓ × π × r² × t', example: 'Contoh: topi ulang tahun, es krim',
    svg: (<>
      <ellipse data-w cx="50" cy="72" rx="28" ry="9" />
      <path data-w d="M22 72 50 20l28 52" />
      <path data-w2 d="M50 20v52" />
      <path data-w2 d="M22 72a28 9 0 0056 0" />
    </>),
  },
  {
    color: 'c-violet', name: 'Limas Segiempat', en: 'Square Pyramid', formula: 'V = ⅓ × s² × t', example: 'Contoh: Piramida Mesir, atap',
    svg: (<>
      <path data-w d="M22 68 50 78 78 68 50 58z" />
      <path data-w2 d="M50 18 22 68M50 18 78 68M50 18 50 58" />
      <path data-w d="M50 18 22 68M50 18 78 68M50 58 22 68M50 58 78 68" />
    </>),
  },
  {
    color: 'c-green', name: 'Bola', en: 'Sphere', formula: 'V = 4/3 × π × r³', example: 'Contoh: bola sepak, planet',
    svg: (<>
      <circle data-w cx="50" cy="50" r="30" />
      <ellipse data-w2 cx="50" cy="50" rx="30" ry="11" />
      <ellipse data-w2 cx="50" cy="50" rx="11" ry="30" />
    </>),
  },
  {
    color: 'c-sky', name: 'Setengah Bola', en: 'Hemisphere', formula: 'V = ⅔ × π × r³', example: 'Contoh: stupa Borobudur',
    svg: (<>
      <path data-w d="M18 56a32 32 0 0064 0" />
      <ellipse data-w cx="50" cy="56" rx="32" ry="10" />
      <path data-w2 d="M50 24v32" />
      <path data-w2 d="M18 56a32 10 0 0064 0" />
    </>),
  },
  {
    color: 'c-amber', name: 'Prisma Segitiga', en: 'Triangular Prism', formula: 'V = ½ × a × t × T', example: 'Contoh: tenda, potongan kue',
    svg: (<>
      <path data-w d="M24 64 42 40l14 24z" />
      <path data-w d="M24 64 42 72l14-24 18 24 18-8-16-24" />
      <path data-w d="M42 40 60 32l16 24" />
      <path data-w2 d="M56 48 42 40" />
    </>),
  },
];

export default function GeometryGallery() {
  return (
    <section id="geometri" className="section section-teal" aria-labelledby="geo-h2">
      <div className="section-head reveal">
        <div className="section-kicker">
          <LayersIcon />
          Bangun Ruang
        </div>
        <h2 className="section-h2" id="geo-h2">
          Kenali <em>Bentuk Geometri</em>
        </h2>
        <p className="section-desc">
          Arahkan kursor ke kartu untuk melihat wireframe-nya bersinar! Setiap bentuk punya rumus volume yang kamu bisa pelajari.
        </p>
      </div>

      <div className="geo-grid reveal">
        {SHAPES.map((s) => (
          <div key={s.name} className={`geo-card ${s.color}`}>
            <div className="geo-svg-wrap" aria-hidden="true">
              <svg viewBox="0 0 100 100" fill="none">{s.svg}</svg>
            </div>
            <div className="geo-name">{s.name}</div>
            <div className="geo-en">{s.en}</div>
            <div className="geo-formula">{s.formula}</div>
            <div className="geo-example">{s.example}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
