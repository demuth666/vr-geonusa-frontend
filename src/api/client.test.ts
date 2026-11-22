import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, unwrapData } from './client';
import { clearAuthToken, setAuthToken } from './auth-token';
import { setSessionWriteToken } from './session-token';
import { ApiError } from './error';

describe('unwrapData (Laravel { data } envelope)', () => {
  it('unwraps data, including null', () => {
    expect(unwrapData({ data: { id: 1 } })).toEqual({ id: 1 });
    expect(unwrapData({ data: null })).toBeNull();
    expect(unwrapData({ data: [] })).toEqual([]);
  });
  it('passes through unwrapped payloads', () => {
    expect(unwrapData([1, 2])).toEqual([1, 2]);
    expect(unwrapData({ id: 1 })).toEqual({ id: 1 });
    expect(unwrapData(null)).toBeNull();
  });
});

describe('http integration headers and errors', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearAuthToken();
    setSessionWriteToken(null);
  });

  it('sends the Sanctum bearer token and the session write token', async () => {
    setAuthToken('auth-token');
    setSessionWriteToken('write-token');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { id: 1 } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    await http('GET', '/me');

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe('Bearer auth-token');
    expect(headers['X-Session-Write-Token']).toBe('write-token');
  });

  it('sends FormData without forcing a JSON content type', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { ok: true } }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    vi.stubGlobal('fetch', fetchMock);
    const form = new FormData();
    form.append('camera_yaw', '0');

    await http('POST', '/learning-sessions/1/ml-predictions', form);

    const init = fetchMock.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers['Content-Type']).toBeUndefined();
    expect(init.body).toBe(form);
  });

  it('maps the official { error } envelope to ApiError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: { code: 'CONFLICT', message: 'Exploration incomplete.' } }),
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        )
      )
    );

    await expect(http('GET', '/learning-sessions/1')).rejects.toMatchObject({
      status: 409,
      code: 'CONFLICT',
      message: 'Exploration incomplete.',
    });
    await expect(http('GET', '/learning-sessions/1')).rejects.toBeInstanceOf(ApiError);
  });
});
