import { describe, expect, it } from 'vitest';
import { sessionPhaseToPath } from './session-routing';

describe('sessionPhaseToPath', () => {
  const sessionId = 'session-123';

  it('maps every phase to its dedicated route', () => {
    expect(sessionPhaseToPath(sessionId, 'pretest')).toBe(
      '/app/borobudur/session/session-123/pretest'
    );
    expect(sessionPhaseToPath(sessionId, 'exploration')).toBe(
      '/app/borobudur/session/session-123/explore'
    );
    expect(sessionPhaseToPath(sessionId, 'posttest')).toBe(
      '/app/borobudur/session/session-123/posttest'
    );
    expect(sessionPhaseToPath(sessionId, 'self_efficacy')).toBe(
      '/app/borobudur/session/session-123/self-efficacy'
    );
    expect(sessionPhaseToPath(sessionId, 'completed')).toBe(
      '/app/borobudur/session/session-123/result'
    );
  });
});
