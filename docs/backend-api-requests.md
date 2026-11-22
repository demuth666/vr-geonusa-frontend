# Catatan Integrasi Frontend ↔ Backend

> Status: **selesai** — frontend sudah memakai OpenAPI resmi dari
> `vr-geonusa-backend/contracts/openapi.yaml` sebagai sumber kebenaran.
> Dokumen ini merangkum keputusan integrasi dan perubahan kecil yang
> diperlukan di backend.

## Kontrak resmi

- `contracts/openapi.yaml` di repo frontend adalah salinan dari repo backend.
- `src/api/backend-types.ts` mengikuti DTO OpenAPI.
- `src/api/adapters.ts` memetakan DTO backend ke view model UI di
  `src/types/api.ts`.
- `src/api/contract.test.ts` memastikan setiap panggilan `http()` frontend
  ada di kontrak (path dinormalisasi dari prefix `/api/v1`).

## Autentikasi

Backend memakai **Laravel Sanctum Bearer token**, bukan cookie SPA:

```text
POST /api/v1/auth/login  { email, password }
→ { data: { token, user } }
```

- Frontend menyimpan token di `sessionStorage` (`src/api/auth-token.ts`),
  bukan `localStorage`, dan mengirim `Authorization: Bearer <token>`.
- `GET /api/v1/me` mengembalikan `respondent_code` milik siswa. Frontend
  memakainya otomatis untuk `POST /api/v1/learning-sessions`
  (`{ respondent_code }`), sehingga siswa tidak perlu mengetik kode penelitian.

## Write token sesi

- Header resmi: `X-Session-Write-Token`.
- Token hanya dikembalikan sekali saat sesi dibuat dan hanya disimpan di
  memory frontend.
- Backend diubah agar `GET /api/v1/me/learning-sessions/active` menerbitkan
  token baru setiap resume. Ini membuat refresh halaman tidak mengunci
  siswa dari mutasi sesi.
- `GET /api/v1/learning-sessions/{id}` (read-only) tidak lagi mewajibkan
  write token; ownership tetap dicek. Token tetap wajib untuk semua mutasi.
- `POST /api/v1/learning-sessions/{id}/assessment-attempts` bersifat
  idempotent untuk attempt berstatus draft, sehingga refresh saat pretest/
  posttest/self-efficacy melanjutkan attempt yang sama.

## ML

`POST /api/v1/learning-sessions/{id}/ml-predictions` memakai
`multipart/form-data`, bukan JSON base64:

```text
image (JPEG/PNG/WebP), panorama_node_id, camera_yaw, camera_pitch, camera_fov
```

Respons berisi `model_version`, latency, dan `detections[]`. Frontend hanya
memakai detection yang berhasil dipetakan ke `heritage_object`; detection
tanpa pemetaan ditampilkan sebagai "tidak ada objek".

## Field yang belum ada di API

Agar tidak mengarang konten, UI menyesuaikan diri pada data yang tersedia:

| UI | Perlakuan |
|---|---|
| Lokasi situs | Disembunyikan bila kosong |
| Tujuan pembelajaran situs / fitur pengalaman | Section disembunyikan bila kosong |
| Rumus & konteks budaya materi | Section disembunyikan bila kosong |
| Jumlah area panorama | Diambil dari `GET /heritage-sites/{slug}/areas` |
| Nama situs di halaman hasil | Diambil dari `GET /heritage-sites/{slug}` |
| `micro_quiz_id` | Ditambahkan ke setiap `geometry_mappings[]` pada learning material |

## Data dev

`DemoLearningSeeder` di backend (local/testing) membuat:

- `ResearchParticipant` untuk siswa demo (`student@example.test` / `student`),
- `LearningExperienceRevision` yang sudah dipublikasikan,
- `MlClassMapping` untuk dummy detector (`stupa`, versi `dummy-v1`).

Jalankan `php artisan migrate --seed` (atau `db:seed`) di backend sebelum
mencoba alur siswa end-to-end.
