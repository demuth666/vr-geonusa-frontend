# VR-GeoNusa — Student Frontend (V1)

Frontend React untuk pengalaman belajar geometri berbasis panorama 360°/WebXR
di Candi Borobudur, sesuai PRD V1. **Repo ini HANYA berisi frontend** —
backend Laravel, service ML (FastAPI), dan admin panel ada di repo terpisah
milik tim masing-masing.

## Mengapa cuma frontend yang di-push ke sini

PRD menyebutkan tiga repo terpisah: Laravel (backend), FastAPI (ML), dan
React (frontend — repo ini). Jangan gabungkan `node_modules/`, `dist/`,
`.env`, atau file backend lain ke repo ini — `.gitignore` sudah menahan
`node_modules/` dan `dist/`, tapi tetap cek `git status` sebelum commit
pertama kalau folder ini sebelumnya pernah dipakai bareng project lain.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS + TanStack Query + Zustand +
A-Frame (WebXR panorama). Lihat `package.json`.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env.local   # default VITE_API_MODE=mock, jalan tanpa backend
npm run dev
```

Buka `http://localhost:5173`. Dengan `VITE_API_MODE=mock` (default),
**seluruh alur bisa dicoba tanpa backend sama sekali** — ada mock API
in-memory di `src/api/mock/` yang meniru endpoint Laravel sesuai
`contracts/openapi.yaml`. Login bisa pakai identifier/password apa saja yang
tidak kosong.

Untuk konek ke backend sungguhan:

```bash
# di .env.local
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8000   # sesuaikan
```

## Struktur Proyek

```
contracts/openapi.yaml   — kontrak API (provisional, lihat catatan di file itu)
src/
  api/                   — HTTP client (mode "real") + mock/ (mode "mock")
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
  types/api.ts            — tipe data sesuai contracts/openapi.yaml
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
- **Token tulis sesi (`X-Learning-Session-Token`)** disimpan HANYA di memory
  (`api/session-token.ts`) — tidak pernah di localStorage/URL/log. Hilang
  saat refresh secara sengaja; halaman intro akan mengambil ulang lewat
  `GET /me/learning-sessions/active`.
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

File ini **ditulis oleh tim frontend sebagai kontrak sementara**, murni
diturunkan dari bentuk payload yang dideskripsikan di PRD — backend belum
membagikan OpenAPI resminya saat V1 ini dikerjakan. Begitu backend merilis
kontrak asli:

1. Ganti `contracts/openapi.yaml` dengan versi resmi.
2. Cocokkan ulang `src/types/api.ts` terhadap skema resmi.
3. Set `VITE_API_MODE=real` dan uji tiap endpoint satu per satu terhadap
   `src/api/mock/*` yang sudah ada — mock dibuat 1:1 dengan fungsi di
   `src/features/*/api.ts` supaya penggantian "mock → real" tidak mengubah
   satu pun kode di hooks/komponen (lihat PRD, strategi mocking).

## Testing yang sudah benar-benar dijalankan

- ✅ `npx tsc --noEmit` — 0 error.
- ✅ `npm run build` (tsc -b && vite build) — sukses. `ExplorePage` (yang
  memuat A-Frame, ~1.3MB) sengaja dipisah jadi chunk sendiri via
  `React.lazy` di `app/router/index.tsx`, supaya landing/login/pretest tidak
  ikut menanggung bundle itu.
- ✅ `npx eslint . --ext ts,tsx` — 0 error, 1 warning kosmetik (fast-refresh,
  tidak mempengaruhi fungsi).
- ✅ `npx vitest run` — 3/3 test lulus:
  - `utils/session-routing.test.ts` — pemetaan phase → path.
  - `api/mock/learning-session.test.ts` — alur progress end-to-end
    (kunjungan panorama → materi dilihat → micro quiz selesai → `can_finish`
    jadi `true` → `completeExploration` sukses; dan `completeExploration`
    ditolak 409 selama syarat belum lengkap).

## Yang BELUM diverifikasi

- **Belum pernah dibuka di browser sungguhan / di headset VR.** Tidak ada
  bukti screenshot interaksi WebXR nyata — hanya build & unit test yang
  lulus. Jalankan `npm run dev` dan coba sendiri alur
  login → intro → pretest → explore (panorama + identifikasi + materi +
  kuis) → selesai eksplorasi → posttest → self-efficacy → result.
- **Belum pernah terhubung ke backend Laravel/ML sungguhan** — hanya diuji
  lewat mock. `contracts/openapi.yaml` adalah tebakan terstruktur dari PRD,
  BUKAN kontrak resmi — kemungkinan ada field/endpoint yang perlu disesuaikan
  begitu backend sungguhan tersedia.
- **Belum ada pengujian WebXR/headset VR nyata** (mode VR A-Frame, kontrol
  trigger, dst) — hanya jalur non-VR (mouse/tap) yang ditulis & diuji logic-nya.
- **Kompatibilitas lintas-browser (Safari iOS, dst)** belum dicoba.
