import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderApp } from './render';
import {
  createMockSession,
  getMockSession,
  markMaterialViewed,
  setCurrentPanoramaNode,
  setMicroQuizCompleted,
  setMockAuthed,
  setSessionPhase,
} from '@/api/mock/db';
import * as mockSessionApi from '@/api/mock/learning-session';
import * as mockQuizApi from '@/api/mock/quiz';
import { ApiError } from '@/api/error';
import { hotspotPosition } from '@/vr/navigation/position';
import MicroQuizPanel from '@/features/quiz/MicroQuizPanel';
import { MOCK_HERITAGE_OBJECT_ID, MOCK_MICRO_QUIZ } from '@/api/mock/data';
import type { SessionPhase } from '@/types/api';

vi.mock('@/api/mock/learning-session', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/mock/learning-session')>();
  return { ...actual, predictGeometry: vi.fn(actual.predictGeometry) };
});
vi.mock('@/api/mock/quiz', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/mock/quiz')>();
  return { ...actual, answerQuizQuestion: vi.fn(actual.answerQuizQuestion) };
});

const NEXT_STEP: Record<SessionPhase, string> = {
  pretest: 'pretest',
  exploration: 'explore',
  posttest: 'posttest',
  self_efficacy: 'self-efficacy',
  completed: 'result',
};

function authedSession(phase: SessionPhase) {
  setMockAuthed(true);
  const s = createMockSession('site-borobudur');
  setSessionPhase(s.id, phase, NEXT_STEP[phase]);
  return s;
}

const base = (id: string) => `/app/borobudur/session/${id}`;
// Deskripsi pretest sah menyebut "dinilai salah" ("Tidak ada jawaban yang
// dinilai salah"), jadi cari indikator feedback/skor, bukan kata lepas.
const NO_CORRECTNESS = /^(benar|salah|belum tepat)|✓|skor|score/i;

describe('PRD #55 critical frontend tests', () => {
  it('1. unauthenticated student is redirected to login', async () => {
    const { location } = renderApp('/app/borobudur/intro');
    expect(await screen.findByRole('heading', { name: 'Masuk' })).toBeTruthy();
    expect(location.pathname).toBe('/login');
  });

  it('2. successful login returns to intended destination', async () => {
    const user = userEvent.setup();
    const { location } = renderApp('/app/borobudur/intro');
    await screen.findByRole('heading', { name: 'Masuk' });
    await user.type(screen.getByLabelText('NISN / Email'), 'siswa');
    await user.type(screen.getByLabelText('Kata Sandi'), 'rahasia');
    await user.click(screen.getByRole('button', { name: 'Masuk' }));
    await waitFor(() => expect(location.pathname).toBe('/app/borobudur/intro'));
    expect(await screen.findByText('Candi Borobudur')).toBeTruthy();
  });

  it('3. active session resumes correctly', async () => {
    const user = userEvent.setup();
    const s = authedSession('exploration');
    const { location } = renderApp('/app/borobudur/intro');
    await user.click(await screen.findByRole('button', { name: 'Lanjutkan Eksplorasi' }));
    await waitFor(() => expect(location.pathname).toBe(`${base(s.id)}/explore`));
  });

  it('4. session route follows backend phase', async () => {
    const s = authedSession('posttest');
    const { location } = renderApp(`${base(s.id)}/pretest`);
    await waitFor(() => expect(location.pathname).toBe(`${base(s.id)}/posttest`));
  });

  it('5. pretest does not reveal correct answer', async () => {
    const user = userEvent.setup();
    const s = authedSession('pretest');
    const { location } = renderApp(`${base(s.id)}/pretest`);

    await user.click(await screen.findByLabelText('Bola'));
    await user.click(screen.getByRole('button', { name: 'Berikutnya' }));
    await user.click(await screen.findByLabelText('V = 4/3 × π × r³'));
    expect(screen.queryByText(NO_CORRECTNESS)).toBeNull();
    expect(document.body.innerHTML).not.toMatch(/is_correct|correct_answer/);

    await user.click(screen.getByRole('button', { name: 'Selesai' }));
    await waitFor(() => expect(location.pathname).toBe(`${base(s.id)}/explore`));
  });

  it('6. panorama navigation uses API data', async () => {
    const user = userEvent.setup();
    const s = authedSession('exploration');
    renderApp(`${base(s.id)}/explore`);

    const panorama = await screen.findByTestId('panorama');
    expect(panorama.getAttribute('data-node-id')).toBe('node-1');
    // Label & target hotspot berasal dari GET /panorama-nodes/node-1.
    await user.click(screen.getByRole('button', { name: 'Maju' }));
    await waitFor(() =>
      expect(screen.getByTestId('panorama').getAttribute('data-node-id')).toBe('node-2')
    );
    // Kunjungan dilaporkan ke backend.
    await waitFor(() => expect(getMockSession(s.id).current_panorama_node_id).toBe('node-2'));
    // Posisi hotspot dihitung dari yaw/pitch API, bukan hardcode.
    expect(hotspotPosition(90, 0)).toBe('4.50 0.00 -0.00');
    expect(hotspotPosition(0, 0)).toBe('0.00 0.00 -4.50');
  });

  it('7. ML no-detection state is handled', async () => {
    const user = userEvent.setup();
    const s = authedSession('exploration');
    renderApp(`${base(s.id)}/explore`);
    await screen.findByTestId('panorama');
    await user.click(screen.getByRole('button', { name: 'Identifikasi objek pada pandangan saat ini' }));
    expect(await screen.findByText(/Belum ada objek yang dapat diidentifikasi/)).toBeTruthy();
    expect(screen.getByTestId('panorama')).toBeTruthy();
  });

  it('7b. ML prediction result shows label + confidence before material', async () => {
    const user = userEvent.setup();
    const s = authedSession('exploration');
    setCurrentPanoramaNode(s.id, 'node-2');
    renderApp(`${base(s.id)}/explore`);
    await screen.findByTestId('panorama');
    await user.click(screen.getByRole('button', { name: 'Identifikasi objek pada pandangan saat ini' }));
    expect(await screen.findByText('STUPA')).toBeTruthy();
    expect(screen.getByText('Keyakinan Model')).toBeTruthy();
    expect(screen.getByText('94%')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Pelajari Bentuk' }));
    // Overlay materi terbuka, lalu panel kuis dari tombol "Uji Pemahaman".
    expect(await screen.findByText('Dapat didekati sebagai setengah bola')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Uji Pemahaman/ }));
    expect(await screen.findByText(MOCK_MICRO_QUIZ.title)).toBeTruthy();
  });

  it('8. ML unavailable state does not crash exploration', async () => {
    vi.mocked(mockSessionApi.predictGeometry).mockRejectedValueOnce(
      new ApiError(503, 'ml_unavailable', 'ML service temporarily unavailable')
    );
    const user = userEvent.setup();
    const s = authedSession('exploration');
    renderApp(`${base(s.id)}/explore`);
    await screen.findByTestId('panorama');
    await user.click(screen.getByRole('button', { name: 'Identifikasi objek pada pandangan saat ini' }));
    expect(await screen.findByText('Identifikasi sedang tidak tersedia.')).toBeTruthy();
    expect(screen.getByTestId('panorama')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Coba Lagi' })).toBeTruthy();
  });

  it('9. micro quiz uses server correctness', async () => {
    // Server bilang "benar" untuk opsi yang menurut kunci mock salah:
    // UI harus mengikuti server, bukan menghitung sendiri.
    vi.mocked(mockQuizApi.answerQuizQuestion).mockResolvedValueOnce({
      question_id: 'q1',
      is_correct: true,
      feedback: 'Dari server.',
    });
    const user = userEvent.setup();
    const s = authedSession('exploration');
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <MicroQuizPanel sessionId={s.id} quizId={MOCK_MICRO_QUIZ.id} onComplete={() => {}} />
      </QueryClientProvider>
    );
    await user.click(await screen.findByLabelText('8 meter'));
    await user.click(screen.getByRole('button', { name: 'Jawab' }));
    expect(await screen.findByText('Benar ✓')).toBeTruthy();
    expect(screen.getByText('Dari server.')).toBeTruthy();
  });

  it('10. finish button follows backend progress', async () => {
    const s = authedSession('exploration');
    const first = renderApp(`${base(s.id)}/explore`);
    await screen.findByTestId('panorama');
    const btn = await screen.findByRole('button', { name: 'Selesaikan eksplorasi' });
    await waitFor(() => expect((btn as HTMLButtonElement).disabled).toBe(true));
    first.unmount();

    setCurrentPanoramaNode(s.id, 'node-1');
    setCurrentPanoramaNode(s.id, 'node-2');
    markMaterialViewed(s.id, MOCK_HERITAGE_OBJECT_ID);
    setMicroQuizCompleted(s.id);
    renderApp(`${base(s.id)}/explore`);
    await screen.findByTestId('panorama');
    await waitFor(() =>
      expect(
        (screen.getByRole('button', { name: 'Selesaikan eksplorasi' }) as HTMLButtonElement).disabled
      ).toBe(false)
    );
  });

  it('11. posttest does not reveal correctness', async () => {
    const user = userEvent.setup();
    const s = authedSession('posttest');
    const { location } = renderApp(`${base(s.id)}/posttest`);
    await user.click(await screen.findByLabelText('Bola'));
    await user.click(screen.getByRole('button', { name: 'Berikutnya' }));
    await user.click(await screen.findByLabelText('V = 4/3 × π × r³'));
    expect(screen.queryByText(NO_CORRECTNESS)).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Selesai' }));
    await waitFor(() =>
      expect(location.pathname).toBe(`${base(s.id)}/self-efficacy`)
    );
  });

  it('12. completed session renders result', async () => {
    const s = authedSession('completed');
    renderApp(`${base(s.id)}/result`);
    expect(await screen.findByRole('heading', { name: 'Eksplorasi Selesai' })).toBeTruthy();
    expect(screen.getByText('Panorama dikunjungi')).toBeTruthy();
    expect(screen.queryByText(/pretest|posttest|skor|score/i)).toBeNull();
  });
});
