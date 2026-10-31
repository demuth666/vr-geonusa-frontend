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
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const token = getSessionWriteToken();
  if (token) headers['X-Learning-Session-Token'] = token;
  // Laravel (Sanctum SPA / cookie session) menolak request mutasi tanpa
  // header X-XSRF-TOKEN. fetch tidak menyisipkannya otomatis seperti axios,
  // jadi baca dari cookie XSRF-TOKEN bila backend menyetelnya.
  const xsrf = readCookie('XSRF-TOKEN');
  if (xsrf && method !== 'GET') headers['X-XSRF-TOKEN'] = xsrf;

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

  return unwrapData<T>(payload);
}

/**
 * Laravel API Resource membungkus respons dalam `{ data: ... }`. Pakai cek
 * `'data' in payload`, bukan `payload.data ?? payload`: respons
 * `{ data: null }` (mis. tidak ada session aktif) harus jadi `null`, bukan
 * objek pembungkusnya.
 */
export function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

/**
 * Opsional (VITE_SANCTUM_CSRF=true): minta cookie CSRF ke Laravel Sanctum
 * sebelum login. Path di luar /api/v1 sesuai default Sanctum.
 */
export async function ensureCsrfCookie(): Promise<void> {
  if (import.meta.env.VITE_SANCTUM_CSRF !== 'true') return;
  try {
    await fetch(`${apiBaseUrl}/sanctum/csrf-cookie`, { credentials: 'include' });
  } catch {
    throw new ApiError(0, 'network_error', 'Network request failed');
  }
}
