/**
 * Bearer token Sanctum untuk API VR-GeoNusa.
 *
 * Backend mengembalikan plaintext token sekali saat login. Token disimpan di
 * sessionStorage supaya tab bisa bertahan saat refresh tanpa membagikannya ke
 * tab lain dan tanpa menulis ke localStorage.
 *
 * Catatan keamanan: sessionStorage tetap dapat dibaca JavaScript, jadi XSS
 * pada origin ini tetap bisa mencurinya. Backend tetap sumber otorisasi:
 * token bisa dicabut lewat POST /auth/logout dan setiap 401 menghapus token
 * di sisi klien.
 */
const AUTH_TOKEN_KEY = 'vr-geonusa.auth-token';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return storage()?.getItem(AUTH_TOKEN_KEY) ?? null;
}

export function setAuthToken(token: string): void {
  storage()?.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  storage()?.removeItem(AUTH_TOKEN_KEY);
}
