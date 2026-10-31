import { useState } from 'react';
import { UsersIcon } from '@/components/icons';
import team from '@/content/team.json';

/**
 * Seksi "Tim Peneliti" LFS — data dari team.json LFS (konten profil publik,
 * bukan data riset). Kartu peneliti & mahasiswa memakai class kids.css asli.
 */
type Member = {
  id: string;
  name: string;
  role_type: string;
  institution: string;
  department?: string;
  bio?: string;
  expertise?: string[] | string;
  photo?: string;
  email?: string;
  sinta_id?: string;
  orcid?: string;
  order?: number;
};

const GRAD_CLASSES = ['bg-green', 'bg-amber', 'bg-violet', 'bg-sky', 'bg-coral'];
const ROLE_COLOR = ['', 'sky', 'amber', 'violet'];

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function expertiseOf(m: Member): string[] {
  if (Array.isArray(m.expertise)) return m.expertise;
  return (m.expertise ?? '').split(',').map((s) => s.trim()).filter(Boolean);
}

function Photo({ m, grad }: { m: Member; grad: string }) {
  const [failed, setFailed] = useState(false);
  if (m.photo && !failed) {
    return <img src={m.photo} alt={m.name} loading="lazy" className="tc-img" onError={() => setFailed(true)} />;
  }
  return (
    <div className={`tc-photo-fallback ${grad}`} aria-hidden="true">
      {initials(m.name)}
    </div>
  );
}

const members = [...(team as Member[])].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
const researchers = members.filter((m) => m.role_type !== 'mahasiswa');
const students = members.filter((m) => m.role_type === 'mahasiswa');

export default function TeamSection({ headingLevel = 'h2' }: { headingLevel?: 'h1' | 'h2' }) {
  const Heading = headingLevel;
  return (
    <section id="tim" className="section" aria-labelledby="tim-h2">
      <div className="section-head reveal">
        <div className="section-kicker">
          <UsersIcon />
          Tim Peneliti
        </div>
        <Heading className="section-h2" id="tim-h2">
          Tim di Balik <em>VR-GeoNusa</em>
        </Heading>
        <p className="section-desc">
          Dibuat oleh peneliti, dosen, dan mahasiswa yang semangat menghadirkan cara belajar geometri yang seru.
        </p>
      </div>

      <div id="team-researchers-wrap" className="reveal">
        <div className="tim-group-hdr">Peneliti &amp; Dosen</div>
        <div id="team-researchers" className="researcher-grid">
          {researchers.map((m, i) => {
            const tags = expertiseOf(m);
            const links = [
              m.sinta_id && { href: `https://sinta.kemdikbud.go.id/authors/profile/${m.sinta_id}`, label: 'SINTA' },
              m.orcid && { href: `https://orcid.org/${m.orcid}`, label: 'ORCID' },
              m.email && { href: `mailto:${m.email}`, label: 'Email' },
            ].filter(Boolean) as { href: string; label: string }[];
            return (
              <article key={m.id} className="team-card researcher" aria-label={m.name}>
                <div className="tc-photo">
                  <Photo m={m} grad={GRAD_CLASSES[i % GRAD_CLASSES.length]} />
                </div>
                <div className="tc-body">
                  <span className={`tc-role ${ROLE_COLOR[i % ROLE_COLOR.length]}`}>
                    {m.role_type === 'peneliti' ? 'Peneliti' : 'Dosen'}
                  </span>
                  <div className="tc-name">{m.name}</div>
                  {m.department && <div className="tc-dept">{m.department}</div>}
                  <div className="tc-inst">{m.institution}</div>
                  {m.bio && <div className="tc-bio">{m.bio}</div>}
                  {tags.length > 0 && (
                    <div className="tc-tags">
                      {tags.map((t) => (
                        <span key={t} className="tc-tag">{t}</span>
                      ))}
                    </div>
                  )}
                  {links.length > 0 && (
                    <div className="tc-links">
                      {links.map((l) => (
                        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div id="team-students-wrap" className="reveal">
        <div className="tim-group-hdr">Mahasiswa</div>
        <div id="team-students" className="student-grid">
          {students.map((m, i) => {
            const tags = expertiseOf(m);
            return (
              <article key={m.id} className="team-card student" aria-label={m.name}>
                <div className="ts-photo">
                  <Photo m={m} grad={GRAD_CLASSES[(i + 2) % GRAD_CLASSES.length]} />
                </div>
                <div className="ts-body">
                  <div className="ts-role">Mahasiswa</div>
                  <div className="ts-name">{m.name}</div>
                  {m.department && <div className="ts-dept">{m.department}</div>}
                  <div className="ts-inst">{m.institution}</div>
                  {tags.length > 0 && (
                    <div className="ts-tags">
                      {tags.map((t) => (
                        <span key={t} className="ts-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
