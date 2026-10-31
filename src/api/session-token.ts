/**
 * Session-scoped write token (header `X-Learning-Session-Token`, PRD #20).
 *
 * Disimpan HANYA di variabel module-level (memory), sengaja TIDAK pernah:
 * - ditulis ke localStorage/sessionStorage,
 * - dimasukkan ke URL,
 * - di-log atau ditampilkan di UI,
 * - dikirim ke layanan eksternal selain backend Laravel sendiri.
 *
 * Konsekuensinya token ini hilang saat halaman di-refresh — itu disengaja.
 * Saat refresh, frontend memanggil ulang GET /me/learning-sessions/active
 * (lihat features/learning-session) untuk mendapatkan token yang valid lagi,
 * bukan mengandalkan state lokal sebagai bukti otorisasi.
 */
let currentToken: string | null = null;

export function setSessionWriteToken(token: string | null): void {
  currentToken = token;
}

export function getSessionWriteToken(): string | null {
  return currentToken;
}
