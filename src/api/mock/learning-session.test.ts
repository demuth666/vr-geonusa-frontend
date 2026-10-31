import { describe, expect, it } from 'vitest';
import { createSession, getSessionProgress, markMaterialAsViewed, completeExploration } from './learning-session';
import { submitQuizAttempt, startQuizAttempt, answerQuizQuestion } from './quiz';
import { startAssessmentAttempt, submitAssessmentAttempt } from './assessment';
import { MOCK_HERITAGE_OBJECT_ID, MOCK_MICRO_QUIZ } from './data';
import { recordPanoramaVisit } from './learning-session';

/**
 * Tes ini memverifikasi logika progress/can_finish di mock layer — supaya
 * kontrak yang dipakai halaman Explore (requirements -> can_finish) teruji
 * tanpa perlu browser/A-Frame sungguhan (PRD "Testing").
 */
describe('mock learning-session progress flow', () => {
  it('can_finish is false until all four requirements are met, then true', async () => {
    const session = await createSession('site-borobudur');

    // Session baru selalu mulai di phase "pretest" (PRD #17) — harus lewat
    // pretest dulu sebelum masuk "exploration", baru can_finish relevan.
    const pretestAttempt = await startAssessmentAttempt(session.id, 'pretest');
    await submitAssessmentAttempt(pretestAttempt.id);

    let progress = await getSessionProgress(session.id);
    expect(progress.can_finish).toBe(false);
    expect(progress.requirements.required_panorama_visited).toBe(false);

    await recordPanoramaVisit(session.id, 'node-1');
    await recordPanoramaVisit(session.id, 'node-2');

    progress = await getSessionProgress(session.id);
    expect(progress.requirements.required_panorama_visited).toBe(true);
    expect(progress.can_finish).toBe(false); // materi & kuis belum

    await markMaterialAsViewed(session.id, MOCK_HERITAGE_OBJECT_ID);
    progress = await getSessionProgress(session.id);
    expect(progress.requirements.learning_material_viewed).toBe(true);
    expect(progress.can_finish).toBe(false); // kuis belum

    const attempt = await startQuizAttempt(session.id, MOCK_MICRO_QUIZ.id);
    await answerQuizQuestion(attempt.id, 'q1', 'b');
    await submitQuizAttempt(attempt.id);

    progress = await getSessionProgress(session.id);
    expect(progress.requirements.micro_quiz_completed).toBe(true);
    expect(progress.can_finish).toBe(true);
    expect(progress.percentage).toBe(100);

    const newSession = await completeExploration(session.id);
    expect(newSession.phase).toBe('posttest');
  });

  it('rejects completeExploration while requirements are unmet (409)', async () => {
    const session = await createSession('site-borobudur');
    await expect(completeExploration(session.id)).rejects.toMatchObject({ status: 409 });
  });
});
