# Permintaan Kontrak API untuk Tim Backend

> Status: **menunggu respons backend** · Dibuat: 2026-11-01 · Alur sesuai PRD §3 / §57
> (frontend mengajukan kebutuhan → backend mereview kontrak → OpenAPI diperbarui → implementasi → frontend menyesuaikan).

Frontend V1 (siswa) sudah selesai dan saat ini berjalan di atas **mock** (`VITE_API_MODE=mock`).
`contracts/openapi.yaml` di repo ini **masih sementara** — disusun frontend dari PRD §42, bukan kontrak resmi.
Supaya bisa pindah ke API asli, frontend membutuhkan hal-hal berikut.

## 1. OpenAPI resmi

`contracts/openapi.yaml` resmi untuk semua endpoint PRD §42, lengkap dengan schema request/response dan bentuk error.
Begitu ada, frontend mengganti file sementara dan mencocokkan `src/types/api.ts`.
Test `src/api/contract.test.ts` otomatis gagal bila ada panggilan frontend yang tidak tercantum di OpenAPI.

## 2. Autentikasi

Mohon konfirmasi:

- Pakai **Laravel Sanctum SPA** (cookie + `GET /sanctum/csrf-cookie` + header `X-XSRF-TOKEN`) atau mekanisme lain?
  Frontend sudah siap untuk Sanctum lewat `VITE_SANCTUM_CSRF=true`.
- Domain cookie & CORS untuk dev/staging. Frontend mengirim `credentials: 'include'`.
- Body `POST /auth/login`: frontend saat ini mengirim `{ identifier, password }`.

## 3. Bentuk respons

- Apakah respons dibungkus `{ data: ... }`? Frontend meng-unwrap otomatis bila ada.
- Bila tidak ada sesi aktif, `GET /me/learning-sessions/active` mengembalikan `{ data: null }` atau `404`?
- Format error. Asumsi frontend: body `{ code, message }` dengan status 401 / 403 / 404 / 409 / 422 / 429 / 500 / 503 (PRD §43).

## 4. Write token sesi (PRD §20)

- Frontend menyimpan `write_token` **hanya di memory** dan mengirimnya lewat header `X-Learning-Session-Token`.
- Token hilang saat halaman di-refresh; frontend mengambil ulang lewat `GET /me/learning-sessions/active`.
  **Mohon endpoint ini ikut mengembalikan `write_token`**, atau beri tahu mekanisme penggantinya.

## 5. Respons ML — `POST /learning-sessions/{id}/ml-predictions`

Saat ini belum ada schema. Asumsi frontend:

```json
{ "detections": [{ "heritage_object_id": "obj-stupa-1", "label": "STUPA", "confidence": 0.94 }] }
```

- `detections: []` = tidak ada objek terdeteksi (bukan error, PRD §31).
- **Skala `confidence`: 0–1 atau 0–100?** (UI saat ini menerima keduanya.)
- Layanan ML tidak tersedia → **503**?
- Request yang dikirim frontend: `panorama_node_id`, `camera_yaw`, `camera_pitch`, `camera_fov`, `image` (base64 JPEG).

## 6. Field yang dipakai frontend

Mohon cek kecocokan nama dan tipe:

| Resource | Field |
|---|---|
| Panorama node | `id`, `name`, `image_url`, `initial_yaw`, `initial_pitch`, `hotspots[{ id, target_node_id, yaw, pitch, label }]` — derajat; yaw 0 = depan, yaw positif = ke kanan |
| Heritage site | `id`, `slug`, `name`, `location`, `cover_image_url`, `short_description`, `description`, `learning_objectives[]`, `experience_features[]`, `available_areas_count`, `status` (`available` / `coming_soon`) |
| Area | `id`, `name`, `panorama_node_ids[]` |
| Learning session | `id`, `phase`, `next_step`, `current_panorama_node_id`, `progress_percentage`, `write_token` |
| Progress | `percentage`, `requirements{ required_panorama_visited, geometry_identified, learning_material_viewed, micro_quiz_completed }`, `can_finish` |
| Learning material | `heritage_object_name`, `learning_objective`, `geometry{ shape_name, formula, description, cultural_context, culture_geometry_relation }`, `micro_quiz_id` |
| Jawaban micro quiz | `{ question_id, is_correct, feedback }` — boleh untuk micro quiz (PRD §36) |
| Assessment | item & opsi **tanpa** `is_correct` / `correct_answer` (PRD §21) |
| Result | `heritage_site_name`, `panoramas_visited`, `objects_learned`, `activities_completed` |

Definisi lengkap ada di `src/types/api.ts`.

## 7. Data panorama

Repo lama (VR-GeoNusa LFS) sudah punya 60 foto 360° beserta sambungan antar titiknya di `data/tour-borobudur.json`
(`connections`: `"Maju"` = `local_angle` 0, `"Mundur"` = 180). Bisa dipakai untuk seeding `panorama-nodes`.
Untuk dev, mock frontend saat ini memakai 3 node dari sana (`teras-3-04`, `plateu-00`, `plateu-01`).

## Setelah OpenAPI resmi tersedia

Mohon share **URL staging** supaya kita bisa uji integrasi bersama (`VITE_API_MODE=real`).
Kalau ada field yang berbeda dari daftar di atas, kirim saja OpenAPI-nya — frontend yang menyesuaikan.
