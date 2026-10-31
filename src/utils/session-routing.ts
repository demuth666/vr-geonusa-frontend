import type { SessionPhase } from '@/types/api';

/**
 * PRD #19: frontend routing WAJIB ikut `phase` dari backend, bukan state
 * lokal buatan sendiri. Satu-satunya tempat pemetaan phase -> path ada di
 * sini supaya tidak ada halaman yang diam-diam menebak fase sendiri.
 */
export function sessionPhaseToPath(sessionId: string, phase: SessionPhase): string {
  const base = `/app/borobudur/session/${sessionId}`;
  switch (phase) {
    case 'pretest':
      return `${base}/pretest`;
    case 'exploration':
      return `${base}/explore`;
    case 'posttest':
      return `${base}/posttest`;
    case 'self_efficacy':
      return `${base}/self-efficacy`;
    case 'completed':
      return `${base}/result`;
  }
}
