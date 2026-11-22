# VR-GeoNusa — Student Frontend (V1)

Frontend React untuk pengalaman belajar geometri berbasis panorama 360°/WebXR
di Candi Borobudur, sesuai PRD V1. **Repo ini HANYA berisi frontend** —
backend Laravel, service ML (FastAPI), dan admin panel ada di repo terpisah
milik tim masing-masing.

> **Status integrasi:** frontend sudah terhubung ke OpenAPI resmi backend
> (`contracts/openapi.yaml` disalin dari repo `vr-geonusa-backend`). Mode
> default untuk pengembangan tanpa backend tetap `mock`; set
> `VITE_API_MODE=real` untuk memakai Laravel. Catatan integrasi ada di
> [`docs/backend-api-requests.md`](docs/backend-api-requests.md).

## Mengapa cuma frontend yang di-push ke sini

PRD menyebutkan tiga repo terpisah: Laravel (backend), FastAPI (ML), dan
React (frontend — repo ini). Jangan gabungkan `node_modules/`, `dist/`,
`.env`, atau file backend lain ke repo ini — `.gitignore` sudah menahan
`node_modules/` dan `dist/`, tapi tetap cek `git status` sebelum commit
pertama kalau folder ini sebelumnya pernah dipakai bareng project lain.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + Zustand +
A-Frame (WebXR panorama). Lihat `package.json`.

## Desain visual

Tampilan mengikuti aplikasi lama **VR-GeoNusa LFS** (gaya *claymorphism*, font
Nunito + Baloo 2):

- `src/styles/kids.css` — salinan `public/css/kids.css` LFS (landing, kartu, tombol).
- `src/styles/vr.css` — salinan `public/css/ui.css` LFS (HUD tur 360°, splash), tanpa
  aturan `body { overflow: hidden }` global.
- `src/styles/app.css` — tambahan untuk layar alur PRD yang tidak ada di LFS
  (assessment, result, detail), menu mobile, dan penyesuaian responsif.

Admin Panel, mode Tamu, dan Mode Dataset dari LFS sengaja tidak dibawa karena di
luar scope frontend siswa (PRD §6).

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # default VITE_API_MODE=mock, jalan tanpa backend
npm run dev
```

Buka `http://localhost:5173`. Dengan `VITE_API_MODE=mock` (default),
**seluruh alur bisa dicoba tanpa backend sama sekali** — ada mock API
in-memory di `src/api/mock/` yang meniru endpoint Laravel sesuai
`contracts/openapi.yaml`. Di mode mock, login bisa pakai email/password apa saja
yang tidak kosong.

Dataset dev mock (PRD §51): 1 destinasi aktif (Borobudur) + Prambanan
"Segera Hadir", 1 area, **3 panorama asli** dari dokumentasi tim (RICOH THETA V,
2018 — `public/panorama/teras-3-04.jpg`, `plateu-00.jpg`, `plateu-01.jpg`),
1 objek (stupa), 1 materi, 1 micro quiz, pretest/posttest/self-efficacy.
Di mode mock, identifikasi di node pertama sengaja mengembalikan "belum ada
objek" untuk menguji state itu; node 2–3 mengembalikan STUPA.

Untuk konek ke backend sungguhan:

```bash
# di .env.local
VITE_API_MODE=real
# Kosongkan untuk memakai Vite dev proxy (/api/v1 -> http://localhost:8000).
VITE_API_BASE_URL=
```

Jalankan backend Laravel di `http://localhost:8000`, lalu `npm run dev`.
Jika memakai URL absolut, pastikan CORS backend mengizinkan origin frontend
dan header `Authorization` + `X-Session-Write-Token`.

Catatan mode real:

- Auth memakai **Sanctum Bearer token** dari `POST /auth/login`. Token
  disimpan di `sessionStorage` (per tab, bertahan saat refresh) dan dikirim
  lewat `Authorization: Bearer ...`.
- Header write token sesi adalah `X-Session-Write-Token`. Token hanya
  disimpan di memory; `GET /me/learning-sessions/active` menerbitkan token
  baru setiap resume sehingga refresh tidak membuat sesi macet.
- `GET /me` mengembalikan `respondent_code` milik siswa; frontend
  mengirimkannya otomatis saat `POST /learning-sessions`.
- Respons Laravel `{ "data": ... }` di-unwrap otomatis (`{ "data": null }` → `null`).
  Error resmi `{ "error": { code, message } }` dipetakan ke `ApiError`.
- Endpoint ML memakai `multipart/form-data` (bukan JSON base64).
- Skala `confidence` ML mengikuti kontrak resmi: 0-1.

## Struktur Proyek

```
contracts/openapi.yaml   — kontrak API resmi, disalin dari repo backend
src/
  api/                   — HTTP client (mode "real"), adapter DTO, mock/ (mode "mock")
  app/                   — router, providers (TanStack Query), layout akar
  components/            — komponen UI generik (Button, Spinner, dst)
  features/
    auth/                — login, GET /me, ProtectedRoute
    heritage/             — data situs/area/panorama node
    learning-session/    — session, progress, SessionPhaseGuard, finish-confirm
    assessment/           — engine generik untuk pretest/posttest/self-efficacy
    quiz/                 — micro quiz (feedback langsung, beda dari assessment)
    ml-identification/    — tombol identifikasi + overlay hasil/no-detection/error/materi
    progress/             — ProgressBar
  vr/
    panorama/             — <PanoramaScene> (A-Frame)
    navigation/            — hotspot antar node
    ml/                    — capture viewport (screenshot + yaw/pitch/fov) untuk ML
  pages/                  — satu file per route
  store/uiStore.ts        — state UI transient (overlay aktif, kamera terakhir)
  api/backend-types.ts    — DTO backend sesuai contracts/openapi.yaml
  api/adapters.ts         — pemetaan DTO backend -> view model UI
  types/api.ts            — view model yang dipakai komponen/hooks
```

## Keputusan desain penting (ikuti PRD)

- **Routing session SELALU ikut `phase` dari backend** (`utils/session-routing.ts`
  + `features/learning-session/SessionPhaseGuard.tsx`) — tidak ada halaman
  yang menebak fase dari state lokal. Buka URL yang tidak cocok dengan phase
  session saat ini akan otomatis dialihkan ke route yang benar.
- **Status auth selalu dari `GET /me`** (`features/auth/hooks.ts`), bukan
  flag lokal. `ProtectedRoute` menyimpan tujuan semula (`location.state.from`)
  supaya setelah login siswa kembali ke halaman yang ingin dituju, bukan ke
  landing page.
- **Token tulis sesi (`X-Session-Write-Token`)** disimpan HANYA di memory
  (`api/session-token.ts`) — tidak pernah di localStorage/URL/log. Hilang
  saat refresh; `SessionPhaseGuard` meminta `GET /me/learning-sessions/active`
  yang menerbitkan token baru sebelum halaman sesi melakukan mutasi.
- **401 di tengah sesi** (`features/auth/AuthExpiryWatcher.tsx`) membuang
  status auth + token dan mengarahkan ke `/login` dengan tujuan semula.
- **Panorama data-driven:** posisi hotspot dihitung dari `yaw`/`pitch` API.
  Selain ring di dalam scene, hotspot juga tersedia sebagai tombol HTML di
  panel "Area Saat Ini" (padanan keyboard/non-VR, PRD §49). Hanya node
  tetangga yang di-preload; texture lama dilepas (PRD §50).
- **Frontend tidak pernah memanggil FastAPI ML langsung** — selalu lewat
  endpoint Laravel `POST /learning-sessions/:id/ml-predictions`
  (`features/learning-session/api.ts`).
- **Pretest/Posttest/Self-Efficacy tidak pernah menerima/menampilkan
  jawaban benar, skor, atau delta** — berbeda dari micro quiz yang memang
  boleh menampilkan feedback benar/salah langsung.
- Kegagalan ML atau hasil "tidak ada objek terdeteksi" BUKAN error aplikasi
  — eksplorasi panorama tetap bisa dilanjutkan (lihat
  `features/ml-identification/NoDetectionOverlay.tsx` &
  `MlErrorOverlay.tsx`).

## Perihal `contracts/openapi.yaml`

File ini adalah **kontrak resmi dari repo `vr-geonusa-backend`**
(`contracts/openapi.yaml`), bukan lagi kontrak sementara frontend. Jika backend
mengubah kontrak:

1. Salin ulang file dari repo backend.
2. Sesuaikan `src/api/backend-types.ts` dan `src/api/adapters.ts` bila bentuk
   DTO berubah. Komponen UI tetap memakai view model di `src/types/api.ts`.
3. Jalankan `npm test` — `api/contract.test.ts` akan gagal bila ada panggilan
   `http()` frontend yang tidak ada di kontrak.

Daftar kebutuhan integrasi awal (sudah diselesaikan) tetap tersimpan di
[`docs/backend-api-requests.md`](docs/backend-api-requests.md).

## Testing yang sudah benar-benar dijalankan

- ✅ `npm run typecheck` — 0 error.
- ✅ `npm run lint` — 0 error, 0 warning.
- ✅ `npm run build` — sukses. `ExplorePage` (memuat A-Frame, ~1.3MB) dipisah
  jadi chunk sendiri via `React.lazy`, supaya landing/login/pretest ringan.
- ✅ `npm test` — 33 test lulus:
  - `test/critical-flows.test.tsx` — 16 test kritis PRD §55 + hasil prediksi
    ML, pemulihan write token setelah refresh, 401 → login, dan navigasi
    hotspot lewat keyboard. Render route asli dengan mock API; A-Frame diganti
    stub (jsdom tanpa WebGL).
  - `api/contract.test.ts` — setiap `http()` di `src/features/*/api.ts` ada di
    `contracts/openapi.yaml`.
  - `api/adapters.test.ts` — DTO backend -> view model (session, progress, ML,
    materi, assessment, result).
  - `api/client.test.ts` — unwrap envelope `{ data }`, header Bearer/write
    token, multipart FormData, dan error `{ error }`.
  - `vr/panorama/preload.test.ts` — preload hanya node tetangga.
  - `utils/session-routing.test.ts`, `api/mock/learning-session.test.ts`.
- ✅ Dicek manual di Chrome (desktop 1440px dan simulasi HP 390px / 360px):
  landing, detail, tim, login, intro, pretest, eksplorasi (panorama asli,
  hotspot, identifikasi, materi, micro quiz).

## Yang BELUM diverifikasi

- **Belum terhubung ke backend Laravel/ML sungguhan** — menunggu OpenAPI resmi
  dan URL staging (lihat `docs/backend-api-requests.md`).
- **Belum diuji di HP fisik maupun headset VR** (mode VR A-Frame, kontrol
  controller) — baru Chrome desktop dan simulasi mobile.
- **Kompatibilitas Safari iOS** belum dicoba.
