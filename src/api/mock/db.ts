import { ApiError } from '@/api/error';
import type {
  AssessmentAttempt,
  AssessmentInstrument,
  LearningSession,
  QuizAttempt,
} from '@/types/api';
import {
  MOCK_PRETEST_ITEMS,
  MOCK_POSTTEST_ITEMS,
  MOCK_SELF_EFFICACY_ITEMS,
} from '@/api/mock/data';

/** Simulasi latensi jaringan supaya loading state sungguh-sungguh teruji. */
export function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function fail(status: number, code: string, message: string): never {
  throw new ApiError(status, code, message);
}

// --- State in-memory (hilang saat reload — ini MOCK, bukan persistensi nyata) ---

let mockAuthed = false;
let nextSessionSeq = 1;
const sessions = new Map<string, LearningSession>();
const quizAttempts = new Map<string, QuizAttempt & { answers: Record<string, string> }>();
const assessmentAttempts = new Map<string, AssessmentAttempt & { answers: Record<string, string> }>();
const panoramaVisits = new Map<string, Set<string>>(); // sessionId -> visited node ids
const materialsViewed = new Map<string, Set<string>>(); // sessionId -> viewed object ids
const microQuizCompleted = new Map<string, boolean>(); // sessionId -> completed
const quizAttemptSession = new Map<string, string>(); // attemptId -> sessionId
const assessmentAttemptSession = new Map<string, string>(); // attemptId -> sessionId

/** Hanya untuk test: kosongkan seluruh state mock in-memory. */
export function resetMockDb(): void {
  mockAuthed = false;
  nextSessionSeq = 1;
  for (const m of [sessions, quizAttempts, assessmentAttempts, panoramaVisits, materialsViewed, microQuizCompleted, quizAttemptSession, assessmentAttemptSession]) {
    m.clear();
  }
}

export function isMockAuthed(): boolean {
  return mockAuthed;
}
export function setMockAuthed(v: boolean): void {
  mockAuthed = v;
}

export function createMockSession(heritageSiteId: string): LearningSession {
  const id = `session-${nextSessionSeq++}`;
  const session: LearningSession = {
    id,
    heritage_site_id: heritageSiteId,
    phase: 'pretest',
    next_step: 'pretest',
    current_panorama_node_id: null,
    progress_percentage: 0,
    write_token: `mock-write-token-${id}`,
  };
  sessions.set(id, session);
  panoramaVisits.set(id, new Set());
  materialsViewed.set(id, new Set());
  microQuizCompleted.set(id, false);
  return session;
}

export function getMockSession(id: string): LearningSession {
  const s = sessions.get(id);
  if (!s) fail(404, 'session_not_found', `Learning session ${id} not found`);
  return s;
}

export function getActiveMockSession(): LearningSession | null {
  for (const s of sessions.values()) {
    if (s.phase !== 'completed') return s;
  }
  return null;
}

export function setSessionPhase(id: string, phase: LearningSession['phase'], nextStep: string): LearningSession {
  const s = getMockSession(id);
  s.phase = phase;
  s.next_step = nextStep;
  return s;
}

export function setCurrentPanoramaNode(id: string, nodeId: string): void {
  const s = getMockSession(id);
  s.current_panorama_node_id = nodeId;
  const visited = panoramaVisits.get(id) ?? new Set<string>();
  visited.add(nodeId);
  panoramaVisits.set(id, visited);
}

export function getVisitedPanoramaCount(id: string): number {
  return panoramaVisits.get(id)?.size ?? 0;
}

export function markMaterialViewed(sessionId: string, objectId: string): void {
  const set = materialsViewed.get(sessionId) ?? new Set<string>();
  set.add(objectId);
  materialsViewed.set(sessionId, set);
}

export function isMaterialViewed(sessionId: string, objectId: string): boolean {
  return materialsViewed.get(sessionId)?.has(objectId) ?? false;
}

export function getMaterialsViewedCount(sessionId: string): number {
  return materialsViewed.get(sessionId)?.size ?? 0;
}

export function setMicroQuizCompleted(sessionId: string): void {
  microQuizCompleted.set(sessionId, true);
}

export function isMicroQuizCompleted(sessionId: string): boolean {
  return microQuizCompleted.get(sessionId) ?? false;
}


export function createQuizAttempt(quizId: string, sessionId: string): QuizAttempt {
  const id = `qa-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
  quizAttempts.set(id, { id, quiz_id: quizId, submitted: false, answers: {} });
  quizAttemptSession.set(id, sessionId);
  return { id, quiz_id: quizId, submitted: false };
}

export function getSessionIdForQuizAttempt(attemptId: string): string {
  const sid = quizAttemptSession.get(attemptId);
  if (!sid) fail(404, 'quiz_attempt_not_found', `Quiz attempt ${attemptId} not found`);
  return sid;
}

export function getSessionIdForAssessmentAttempt(attemptId: string): string {
  const sid = assessmentAttemptSession.get(attemptId);
  if (!sid) fail(404, 'assessment_attempt_not_found', `Assessment attempt ${attemptId} not found`);
  return sid;
}

export function getQuizAttempt(id: string) {
  const a = quizAttempts.get(id);
  if (!a) fail(404, 'quiz_attempt_not_found', `Quiz attempt ${id} not found`);
  return a;
}

function itemsForInstrument(instrument: AssessmentInstrument) {
  switch (instrument) {
    case 'pretest':
      return MOCK_PRETEST_ITEMS;
    case 'posttest':
      return MOCK_POSTTEST_ITEMS;
    case 'self_efficacy':
      return MOCK_SELF_EFFICACY_ITEMS;
  }
}

export function createAssessmentAttempt(
  instrument: AssessmentInstrument,
  sessionId: string
): AssessmentAttempt {
  const id = `aa-${Date.now()}-${Math.round(Math.random() * 1e4)}`;
  const items = itemsForInstrument(instrument);
  assessmentAttempts.set(id, {
    id,
    instrument,
    items,
    current_index: 0,
    submitted: false,
    answers: {},
  });
  assessmentAttemptSession.set(id, sessionId);
  return { id, instrument, items, current_index: 0, submitted: false };
}

export function getAssessmentAttempt(id: string) {
  const a = assessmentAttempts.get(id);
  if (!a) fail(404, 'assessment_attempt_not_found', `Assessment attempt ${id} not found`);
  return a;
}
