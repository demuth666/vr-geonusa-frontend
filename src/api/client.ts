import { apiBaseUrl } from '@/api/mode';
import { getSessionWriteToken } from '@/api/session-token';
import { clearAuthToken, getAuthToken } from '@/api/auth-token';
import { ApiError } from '@/api/error';

/**
 * HTTP client untuk mode "real". Dipakai hanya ketika VITE_API_MODE=real.
 *
 * Backend Laravel resmi memakai Sanctum Bearer token (lihat OpenAPI), jadi:
 * - token auth dikirim lewat `Authorization: Bearer ...`,
 * - write token sesi dikirim lewat `X-Session-Write-Token`,
 * - request multipart (ML) mengirim FormData tanpa Content-Type manual.
 */
export async function http<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const authToken = getAuthToken();
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const writeToken = getSessionWriteToken();
  if (writeToken) headers['X-Session-Write-Token'] = writeToken;

  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl}/api/v1${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'network_error', 'Network request failed');
  }

  if (res.status === 401) {
    // Backend is the authority: a rejected token must not linger in the tab.
    clearAuthToken();
  }

  if (res.status === 204) return undefined as T;

  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    /* body kosong/non-JSON, biarkan null */
  }

  if (!res.ok) {
    // Kontrak resmi membungkus error sebagai `{ error: { code, message } }`.
    // Dukungan `{ code, message }` lama dipertahankan agar mock/alat lama tetap aman.
    const errorPayload =
      payload && typeof payload === 'object' && 'error' in payload ? payload.error : payload;
    const code = errorPayload?.code ?? `http_${res.status}`;
    const message = errorPayload?.message ?? res.statusText;
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
