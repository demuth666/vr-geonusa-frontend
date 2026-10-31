import { apiBaseUrl } from '@/api/mode';
import { getSessionWriteToken } from '@/api/session-token';
import { ApiError } from '@/api/error';

/**
 * HTTP client untuk mode "real". Dipakai hanya ketika VITE_API_MODE=real.
 *
 * - credentials: 'include' -> backend Laravel pakai secure session cookie,
 *   frontend TIDAK menyimpan token auth sendiri (PRD #16, #46).
 * - Header X-Learning-Session-Token disisipkan otomatis bila ada token aktif
 *   di memory (lihat session-token.ts), tanpa pernah disimpan permanen.
 */
export async function http<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getSessionWriteToken();
  if (token) headers['X-Learning-Session-Token'] = token;

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api/v1${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'network_error', 'Network request failed');
  }

  if (res.status === 204) return undefined as T;

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    /* body kosong/non-JSON, biarkan null */
  }

  if (!res.ok) {
    const code = payload?.code ?? `http_${res.status}`;
    const message = payload?.message ?? res.statusText;
    throw new ApiError(res.status, code, message);
  }

  return (payload?.data ?? payload) as T;
}
