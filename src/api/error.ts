import type { ApiErrorShape } from '@/types/api';

/**
 * Error terstruktur untuk seluruh pemanggilan API (mock maupun real).
 * Komponen UI harus menampilkan pesan ramah lewat `userMessage()`, TIDAK
 * PERNAH raw stack trace / payload teknis backend (PRD #43, #46).
 */
export class ApiError extends Error implements ApiErrorShape {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function userMessage(err: unknown): string {
  if (err instanceof ApiError) {
    switch (err.status) {
      case 401:
        return 'Sesi kamu berakhir. Silakan masuk kembali.';
      case 403:
        return 'Kamu tidak memiliki akses ke eksplorasi ini.';
      case 404:
        return 'Data yang kamu cari tidak ditemukan.';
      case 409:
        return 'Aksi ini tidak dapat dilakukan pada tahap eksplorasi saat ini.';
      case 422:
        return 'Ada isian yang belum valid. Silakan periksa kembali.';
      case 429:
        return 'Terlalu banyak permintaan. Coba lagi sebentar lagi.';
      case 503:
        return 'Layanan identifikasi sedang tidak tersedia. Kamu tetap bisa melanjutkan eksplorasi.';
      default:
        return 'Terjadi kendala. Silakan coba lagi.';
    }
  }
  return 'Terjadi kendala jaringan. Periksa koneksi kamu dan coba lagi.';
}
