# PRD — VR-GeoNusa Student Frontend V1

## 1. Document Status

**Product:** VR-GeoNusa  
**Scope:** Student-facing Frontend + Panorama/WebXR Experience  
**Version:** V1 / Borobudur  
**Status:** Engineering Baseline / Frozen V1  
**Backend & Admin Panel:** Dikerjakan oleh Backend/ML Team  
**Machine Learning:** Diakses hanya melalui Laravel Backend API  
**Primary Destination:** Candi Borobudur  

---

# 2. Product Overview

VR-GeoNusa adalah platform pembelajaran berbasis Virtual Reality/WebXR yang membantu siswa SMP mempelajari konsep geometri melalui eksplorasi situs warisan budaya.

Versi pertama difokuskan pada **Candi Borobudur** menggunakan panorama 360°.

Frontend bertanggung jawab atas seluruh pengalaman yang digunakan langsung oleh siswa:

- landing page,
- halaman destinasi,
- Borobudur detail,
- login UI,
- Borobudur intro,
- pretest UI,
- panorama 360° / WebXR,
- navigation hotspot,
- ML identification UI,
- geometry learning material overlay,
- micro quiz UI,
- progress UI,
- posttest UI,
- self-efficacy UI,
- result page.

Frontend **tidak bertanggung jawab** atas:

- Laravel backend API,
- Filament admin panel,
- teacher/researcher back-office,
- database,
- scoring,
- session state transition,
- research-data calculation,
- authentication logic di server,
- ML inference,
- model training/evaluation,
- penentuan jawaban benar/salah.

Semua business rule berasal dari Backend API. Frontend berfungsi sebagai presentation dan interaction layer.

---

# 3. Team Ownership

## Frontend Team

Memiliki tanggung jawab terhadap:

```text
Student UX
Visual design
Responsive layout
Panorama rendering
WebXR interaction
Navigation hotspots
API consumption
Loading/error states
Client-side interaction state
```

## Backend / ML Team

Memiliki tanggung jawab terhadap:

```text
Laravel API
PostgreSQL
Redis
Filament Admin Panel
Teacher/Researcher back-office
Authentication logic
Authorization
Learning session state
Assessment scoring
Research data
OpenAPI contract
FastAPI ML service
ML training/evaluation
Laravel ↔ ML integration
```

## Shared Contract

Titik integrasi utama antar tim adalah:

```text
contracts/openapi.yaml
```

Frontend tidak boleh membuat kontrak API permanen sendiri yang berbeda dari OpenAPI.

Jika frontend membutuhkan field atau endpoint baru:

```text
Frontend raises requirement
        ↓
Backend reviews contract
        ↓
OpenAPI updated
        ↓
Backend implementation
        ↓
Frontend consumption
```

---

# 4. Product Flow

Student journey V1:

```text
Landing Page
      ↓
Pilih Borobudur
      ↓
Borobudur Detail
      ↓
Mulai Eksplorasi
      ↓
Login
      ↓
Borobudur Intro
      ↓
Pretest
      ↓
Panorama Exploration
      │
      ├── Navigate Panorama
      │
      └── Identify Geometry
                ↓
          ML Prediction
                ↓
         Geometry Material
                ↓
            Micro Quiz
                ↓
       Continue Exploration
                ↓
       Finish Exploration
                ↓
            Posttest
                ↓
          Self-Efficacy
                ↓
              Result
```

---

# 5. V1 Scope

## In Scope

### Public Pages

- Landing page
- About VR-GeoNusa
- Destination section
- Borobudur detail
- Team section
- Login page

### Authenticated Student Experience

- Borobudur introduction
- Active-session detection
- Resume session
- Pretest
- Panorama exploration
- Panorama navigation
- ML geometry identification
- Prediction result
- Learning material
- Micro quiz
- Progress indicator
- Finish exploration
- Posttest
- Self-efficacy questionnaire
- Session result

### WebXR

- Panorama 360°
- Mouse drag
- Touch navigation
- Device orientation where supported
- WebXR mode where available
- Navigation hotspots
- Identification action

### Integration

- consume REST API `/api/v1`,
- follow OpenAPI contract,
- send viewport image + camera metadata for ML requests,
- respect backend session state,
- use backend progress/result as source of truth.

---

# 6. Out of Scope V1

Tidak dikerjakan pada fase awal:

- Prambanan experience
- 3D object manipulation
- Filament admin panel
- teacher dashboard
- researcher dashboard
- admin dashboard
- leaderboard
- gamification
- certificate
- offline mode
- native mobile application
- multi-language support
- continuous real-time ML inference
- frontend-side scoring
- dataset annotation UI
- ML model management
- backend business logic
- database schema
- API authorization rules
- ML training/evaluation

Prambanan boleh tampil pada landing page sebagai:

```text
Coming Soon
```

tetapi belum memiliki experience.

---

# 7. Recommended Technology Stack

## Core

- React
- TypeScript
- Vite

## Styling

- Tailwind CSS

## Server State

- TanStack Query

## Client UI State

- Zustand

Gunakan Zustand hanya untuk state UI/client yang memang diperlukan.

Jangan mirror seluruh server state ke Zustand.

## Forms

Boleh menggunakan:

- React Hook Form

jika diperlukan.

## Validation

Gunakan schema validation seperti:

- Zod

jika API client/generator yang digunakan membutuhkannya.

## VR / Panorama

- A-Frame
- Three.js
- WebXR

A-Frame digunakan untuk high-level scene/XR interaction.

Three.js digunakan bila membutuhkan kontrol yang lebih low-level.

---

# 8. Frontend Architecture

Suggested structure:

```text
src/

├── app/
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── features/
│   ├── auth/
│   ├── heritage/
│   ├── learning-session/
│   ├── assessment/
│   ├── quiz/
│   ├── ml-identification/
│   └── progress/
│
├── vr/
│   ├── core/
│   ├── panorama/
│   ├── navigation/
│   ├── interaction/
│   └── ml/
│
├── pages/
│
├── components/
│
├── api/
│
├── hooks/
│
├── types/
│
└── utils/
```

Hindari satu file besar seperti:

```text
BorobudurExperience.tsx
```

yang mengandung seluruh navigation, ML, quiz, material, dan session logic.

---

# 9. Backend Contract

Frontend menggunakan Backend API sebagai source of truth.

API base:

```text
/api/v1
```

Contract berasal dari:

```text
contracts/openapi.yaml
```

Frontend tidak boleh mengarang bentuk request/response berdasarkan asumsi.

Jika API contract berubah:

1. backend mengubah OpenAPI,
2. perubahan dikomunikasikan,
3. frontend menyesuaikan implementation.

---

# 10. Important Integration Rule

Frontend **tidak pernah berkomunikasi langsung dengan ML Service**.

Wajib:

```text
Frontend
    ↓
Laravel API
    ↓
ML Service
    ↓
Laravel API
    ↓
Frontend
```

Dilarang:

```text
Frontend
    ↓
FastAPI ML
```

Laravel menangani:

- authorization,
- session validation,
- ML persistence,
- model version,
- latency logging,
- geometry mapping.

Frontend hanya bertugas menangkap input yang dibutuhkan dan menampilkan hasil dari backend.

---

# 11. Public Routes

Suggested routes:

```text
/

/destinations

/destinations/borobudur

/team

/login
```

---

# 12. Authenticated Routes

```text
/app/borobudur/intro

/app/borobudur/session/:sessionId/pretest

/app/borobudur/session/:sessionId/explore

/app/borobudur/session/:sessionId/posttest

/app/borobudur/session/:sessionId/self-efficacy

/app/borobudur/session/:sessionId/result
```

---

# 13. Landing Page

## Objective

Memperkenalkan VR-GeoNusa sebelum siswa diminta login.

## Recommended Sections

```text
Navbar

Hero

About VR-GeoNusa

Destinations

How It Works

Research / Educational Context

Team

Footer
```

### Destination

Borobudur:

```text
Candi Borobudur

Panorama 360°

[Explore]
```

Prambanan:

```text
Candi Prambanan

Coming Soon
```

---

# 14. Borobudur Detail

Route:

```text
/destinations/borobudur
```

Public.

Display:

- cover image,
- destination name,
- location,
- description,
- learning objectives,
- experience features,
- number of available areas/panoramas where relevant,
- Start Exploration CTA.

CTA:

```text
[Mulai Eksplorasi]
```

---

# 15. Authentication Flow

When user presses:

```text
Mulai Eksplorasi
```

check authentication.

```text
Authenticated?
     │
 ┌───┴────┐
 │        │
NO       YES
 │        │
Login     │
 │        │
 └───┬────┘
     ↓
Borobudur Intro
```

After successful login, redirect user to the original intended page.

Do not redirect back to landing page unnecessarily.

---

# 16. Authentication Storage

Backend authentication is authoritative.

Do not store sensitive authentication tokens in:

```text
localStorage
```

when backend uses secure session cookies.

Frontend should consume authenticated state from:

```text
GET /api/v1/me
```

Do not treat local client state as authentication proof.

---

# 17. Borobudur Intro

Purpose:

- explain learning activity,
- explain VR navigation,
- explain geometry identification,
- prepare student before assessment.

Example content:

```text
Dalam pengalaman ini kamu akan:

- menjelajahi panorama Candi Borobudur,
- mengamati elemen arsitektur,
- mengidentifikasi bentuk,
- mempelajari konsep geometri,
- menjawab aktivitas pembelajaran.
```

CTA:

```text
[Mulai Belajar]
```

---

# 18. Active Session Handling

Before creating a session:

Frontend requests active session.

If none exists:

```text
Create new session
```

If one exists:

Display:

```text
Kamu memiliki eksplorasi
yang belum selesai.

Progress: 40%

[Lanjutkan Eksplorasi]
```

Frontend must respect backend-provided:

```text
phase
next_step
current_panorama_node
progress
```

Do not infer session phase manually.

---

# 19. Learning Session State

Backend states:

```text
pretest
exploration
posttest
self_efficacy
completed
```

Frontend maps state to route:

```text
pretest
→ /pretest

exploration
→ /explore

posttest
→ /posttest

self_efficacy
→ /self-efficacy

completed
→ /result
```

Frontend must NOT modify session phase directly.

Frontend wajib melakukan routing berdasarkan `phase` / `next_step` dari backend, bukan berdasarkan state lokal buatan sendiri.

---

# 20. Session Write Token

Backend may return a session-scoped write token when session is created.

Frontend must keep this token only as required by the agreed backend integration.

For session-scoped mutation requests, send:

```text
X-Learning-Session-Token
```

Do not:

- log the token,
- display it,
- include it in URLs,
- send it to external services.

Backend remains responsible for authorization.

---

# 21. Pretest

UI:

```text
Pretest

Pertanyaan 1 / N

Question

○ A
○ B
○ C
○ D

[Sebelumnya]
[Berikutnya]
```

Frontend receives:

- item ID,
- question text,
- options.

Frontend must never receive or expect:

```text
is_correct
correct_answer
```

Frontend submits:

```text
item_id
selected_option_id
```

Backend determines score.

---

# 22. Pretest UX Rules

Do not display:

```text
Benar
Salah
Score
```

during pretest.

After final submit:

```text
loading
→ backend confirmation
→ exploration
```

The backend controls whether the attempt may be submitted.

---

# 23. Panorama Exploration

Primary route:

```text
/app/borobudur/session/:sessionId/explore
```

Panorama should occupy the majority of the viewport.

Suggested interface:

```text
┌─────────────────────────────────────┐
│ Borobudur          Progress      ☰ │
│                                     │
│                                     │
│          PANORAMA 360°              │
│                                     │
│          ○                          │
│     Navigation            Identify  │
│                                     │
└─────────────────────────────────────┘
```

---

# 24. Panorama Input

Desktop:

```text
mouse drag
```

Mobile:

```text
touch drag
device orientation where supported
```

VR:

```text
WebXR headset/controller
```

Core navigation behavior must remain equivalent across devices.

---

# 25. Panorama Data

Frontend obtains panorama metadata from backend.

Example conceptual response:

```text
PanoramaNode

asset
initial view
navigation links
```

Frontend must not hardcode:

```text
Point A → Point B
```

Navigation comes from Backend API.

---

# 26. Panorama Navigation

Each navigation hotspot contains:

```text
target node
yaw
pitch
label
```

On hotspot activation:

```text
current panorama
        ↓
request target panorama
        ↓
load panorama
        ↓
notify backend panorama visit
```

Show appropriate loading state during texture loading.

Do not blank the screen without feedback.

---

# 27. Panorama Resume

If backend reports:

```text
current_panorama_node_id
```

resume from that panorama.

Frontend should not assume every session starts at the first node.

---

# 28. ML Identification UX

During exploration provide:

```text
[Identifikasi]
```

When activated:

Frontend captures the current panorama viewport/perspective.

Required metadata:

```text
panorama_node_id

camera_yaw

camera_pitch

camera_fov

image
```

Send to Backend API.

Frontend tidak menentukan class geometri atau mapping hasil ML secara lokal.

---

# 29. ML Loading State

Inference is asynchronous from the user's perspective.

Display:

```text
Mengidentifikasi objek...
```

Prevent repeated accidental requests while one inference is pending.

Do not freeze panorama rendering unnecessarily.

---

# 30. ML Prediction Result

Successful example:

```text
Objek Teridentifikasi

STUPA

Keyakinan model: 94%

[Pelajari Bentuk]
```

Frontend may show confidence.

Do not make model latency prominent to students.

Latency is primarily research/technical data.

---

# 31. No Detection

When:

```text
detections = []
```

display:

```text
Belum ada objek yang dapat
diidentifikasi pada pandangan ini.

Coba arahkan pandangan ke objek
lain dan lakukan identifikasi kembali.
```

This is not an application error.

---

# 32. ML Failure

If backend returns service unavailable/error:

Display non-destructive feedback:

```text
Identifikasi sedang tidak tersedia.

Kamu tetap dapat melanjutkan
eksplorasi panorama.

[Coba Lagi]
```

Do not crash or exit the VR experience.

---

# 33. Learning Material

Learning material should appear as an overlay/panel.

Do not navigate the student to a completely separate website page.

Concept:

```text
Panorama
   ↓
Prediction
   ↓
Learning Overlay
```

Display:

- heritage object,
- geometry approximation,
- geometry description,
- formula,
- cultural context,
- culture-geometry relation,
- learning objective.

Important wording:

```text
Bentuk stupa dapat
didekati sebagai
setengah bola.
```

Do not present:

```text
Stupa adalah setengah bola.
```

---

# 34. Return to Panorama

After closing learning material:

Return to:

- same panorama,
- same approximate yaw,
- same approximate pitch.

Do not reset student's view to the initial camera position.

---

# 35. Micro Quiz

Micro quiz is formative learning assessment.

It is different from pretest/posttest.

UI can appear inside the learning overlay.

Example:

```text
Jika diameter stupa adalah
4 meter, berapa jari-jarinya?

○ 1 meter
○ 2 meter
○ 4 meter
○ 8 meter

[Jawab]
```

Frontend sends:

```text
question_id
selected_option_id
```

Backend evaluates correctness.

---

# 36. Micro Quiz Feedback

Unlike pretest/posttest, micro quiz may immediately display:

```text
Benar ✓
```

or:

```text
Belum tepat.
```

along with backend-provided feedback.

Frontend should not calculate correctness independently.

---

# 37. Progress

Progress comes from backend.

Example:

```text
{
  percentage: 75,
  requirements: {
    required_panorama_visited: true,
    geometry_identified: true,
    learning_material_viewed: true,
    micro_quiz_completed: false
  },
  can_finish: false
}
```

Frontend should use:

```text
can_finish
```

to determine button state.

But backend will still validate completion when finish is submitted.

---

# 38. Finish Exploration

Button:

```text
[Selesai Eksplorasi]
```

Disabled when backend reports:

```text
can_finish = false
```

When available, show confirmation:

```text
Selesaikan eksplorasi?

[Kembali]
[Selesai]
```

Then call backend completion endpoint.

Do not locally move the session into `posttest`.

Wait for backend response.

---

# 39. Posttest

UX may reuse assessment components from pretest.

Do not duplicate entire assessment UI implementation.

Recommended reusable structure:

```text
AssessmentPage
AssessmentProgress
AssessmentQuestion
AssessmentOptions
AssessmentNavigation
```

Rules:

- no correctness feedback,
- no correct answers,
- score calculated server-side,
- final transition controlled by backend.

---

# 40. Self-Efficacy

Reuse assessment engine/components where possible.

Self-efficacy differs because there is no correct answer.

Example:

```text
Saya yakin dapat mengenali
bangun ruang dari objek yang
saya lihat.

○ 1
○ 2
○ 3
○ 4
○ 5
```

Labels/content are provided by backend.

Frontend must not define the research instrument itself.

---

# 41. Result Page

After completed session:

```text
Eksplorasi Selesai

Kamu telah menyelesaikan
pembelajaran di Candi Borobudur.

Panorama dikunjungi: 3
Objek dipelajari: 1
Aktivitas selesai: 1
```

Do not show:

```text
Pretest: 50
Posttest: 80
+30
```

unless backend/product requirements explicitly change.

---

# 42. API Endpoints Used by Frontend

## Public

```text
GET /api/v1/heritage-sites

GET /api/v1/heritage-sites/{slug}
```

## Authentication

```text
POST /api/v1/auth/login

POST /api/v1/auth/logout

GET /api/v1/me
```

## Session

```text
GET /api/v1/me/learning-sessions/active

POST /api/v1/learning-sessions

GET /api/v1/learning-sessions/{id}

GET /api/v1/learning-sessions/{id}/progress
```

## Heritage

```text
GET /api/v1/heritage-sites/{slug}/areas

GET /api/v1/panorama-nodes/{id}
```

## Panorama

```text
POST /api/v1/learning-sessions/{id}/panorama-visits
```

## ML

```text
POST /api/v1/learning-sessions/{id}/ml-predictions
```

## Material

```text
GET /api/v1/heritage-objects/{id}/learning-material

POST /api/v1/learning-sessions/{id}/materials/{objectId}/viewed
```

## Micro Quiz

```text
GET /api/v1/quizzes/{id}

POST /api/v1/learning-sessions/{id}/quiz-attempts

PUT /api/v1/quiz-attempts/{attemptId}/answers/{questionId}

POST /api/v1/quiz-attempts/{attemptId}/submit
```

## Assessment

```text
POST /api/v1/learning-sessions/{id}/assessment-attempts

GET /api/v1/assessment-attempts/{id}

PUT /api/v1/assessment-attempts/{attemptId}/answers/{itemId}

POST /api/v1/assessment-attempts/{attemptId}/submit
```

## Exploration

```text
POST /api/v1/learning-sessions/{id}/exploration/complete
```

## Result

```text
GET /api/v1/learning-sessions/{id}/result
```

---

# 43. API Error Handling

Frontend must handle at minimum:

```text
401
→ redirect/login state

403
→ forbidden/session ownership issue

404
→ not found

409
→ invalid learning-session state

422
→ validation error

429
→ request rate limited

500
→ general server error

503
→ ML temporarily unavailable
```

Do not show raw backend stack traces or raw technical error payloads directly to students.

---

# 44. TanStack Query Rules

Use TanStack Query for server state such as:

```text
heritage sites

student profile

learning session

panorama metadata

progress

learning material

quiz

assessment
```

Do not manually duplicate this data into Zustand without a clear reason.

Use query invalidation after relevant mutations.

Example:

```text
complete micro quiz
        ↓
invalidate session progress
        ↓
fetch current progress
```

---

# 45. Zustand Rules

Zustand may be used for transient UI state:

```text
current VR overlay

panorama UI controls

menu open/closed

temporary camera state

local interaction state
```

Do not use Zustand as the source of truth for:

```text
session phase

assessment score

user authentication

research result

server progress
```

---

# 46. Frontend Security Rules

Frontend must never:

- contain production credentials,
- expose correct pre/posttest answers,
- calculate research score,
- trust its own session phase,
- call ML service directly,
- place session tokens in URLs,
- store secrets in source code,
- render raw server errors.

Remember:

```text
Frontend validation
≠
security validation
```

Backend remains authoritative.

---

# 47. Loading States

Every asynchronous screen must define:

```text
loading

success

empty

error
```

Especially:

- authentication,
- destination loading,
- panorama texture loading,
- ML inference,
- assessment submission,
- session resume.

Avoid blank screens.

---

# 48. Responsive Requirements

Minimum supported interaction:

## Desktop

```text
mouse
keyboard where appropriate
```

## Mobile

```text
touch
responsive layout
```

## VR-capable device

```text
WebXR
```

The website must remain usable without VR headset.

VR headset is an enhancement, not a requirement for accessing the learning experience.

---

# 49. Accessibility

At minimum:

- semantic HTML outside WebXR scene,
- keyboard-accessible normal UI,
- clear focus states,
- readable typography,
- sufficient contrast,
- descriptive button labels,
- loading/error messages that do not rely only on color.

WebXR interactions should have non-VR equivalents where practical.

---

# 50. Performance

Panorama assets can be large.

Frontend should:

- load current panorama only when needed,
- preload only likely neighboring panorama nodes,
- avoid preloading all 60 panoramas,
- show loading state during texture transitions,
- release unused textures/resources when appropriate.

Concept:

```text
Current Node
   +
direct neighbors
```

not:

```text
all panorama assets
```

---

# 51. V1 Development Dataset

Do not wait for all Borobudur content before developing.

Frontend V1 should initially work with:

```text
1 destination

1 area

3 panorama nodes

1 heritage object

1 geometry mapping

1 learning material

1 micro quiz

1 pretest

1 posttest

1 self-efficacy instrument
```

Once the flow works, backend data can be expanded without changing frontend architecture.

---

# 52. Frontend Vertical Slices

## Slice 1 — Public Experience

Implement:

```text
Landing
→ Destination
→ Borobudur Detail
```

Uses real backend heritage API.

---

## Slice 2 — Authentication

Implement:

```text
Login
→ GET /me
→ protected route
```

---

## Slice 3 — Session + Pretest

Implement:

```text
Borobudur Intro
→ active session check
→ create/resume session
→ pretest
```

---

## Slice 4 — Panorama

Implement:

```text
Explore
→ one panorama
→ navigation to second panorama
→ panorama visit persistence
```

---

## Slice 5 — Learning

Implement:

```text
Heritage Object
→ learning material
→ micro quiz
→ progress
```

---

## Slice 6 — ML

Implement:

```text
capture viewport
→ backend prediction request
→ prediction overlay
→ learning material
```

---

## Slice 7 — Completion

Implement:

```text
Finish exploration
→ posttest
→ self-efficacy
→ result
```

---

# 53. Mocking Strategy

Frontend development does not need to wait until every backend phase is complete.

Preferred order:

```text
OpenAPI contract
        ↓
typed mock / mock server
        ↓
frontend implementation
        ↓
real backend integration
```

Mocks must follow the OpenAPI contract.

Do not create arbitrary mock response structures that differ from backend.

When real endpoint becomes available:

```text
mock
→ real API
```

should require minimal component changes.

---

# 54. Definition of Done

A frontend feature is complete when:

1. UI matches intended product flow,
2. real or contract-valid mock API is integrated,
3. loading state exists,
4. error state exists,
5. empty state exists where relevant,
6. TypeScript passes,
7. lint passes,
8. relevant tests pass,
9. responsive behavior checked,
10. no business rule duplicated from backend,
11. no sensitive data exposed,
12. API behavior matches OpenAPI contract.

---

# 55. Critical Frontend Tests

At minimum:

```text
unauthenticated student is redirected to login

successful login returns to intended destination

active session resumes correctly

session route follows backend phase

pretest does not reveal correct answer

panorama navigation uses API data

ML no-detection state is handled

ML unavailable state does not crash exploration

micro quiz uses server correctness

finish button follows backend progress

posttest does not reveal correctness

completed session renders result
```

---

# 56. Frontend Success Criteria V1

V1 frontend is considered successful when a student can complete:

```text
Landing
        ↓
Borobudur Detail
        ↓
Login
        ↓
Borobudur Intro
        ↓
Pretest
        ↓
Panorama A
        ↓
Panorama B
        ↓
ML Identification
        ↓
Geometry Material
        ↓
Micro Quiz
        ↓
Finish Exploration
        ↓
Posttest
        ↓
Self-Efficacy
        ↓
Result
```

without:

- frontend-side scoring,
- hardcoded session progression,
- hardcoded panorama navigation,
- direct ML-service access,
- duplicated backend business logic.

---

# 57. Frontend–Backend Collaboration Rules

## Backend Team Owns

```text
OpenAPI contract
business rules
database
authentication
authorization
session state
scoring
research data
ML integration
Filament admin panel
teacher/researcher back-office
```

## Frontend Team Owns

```text
user experience
visual design
responsive behavior
panorama rendering
WebXR interaction
API consumption
loading/error states
client-side interaction state
```

## Shared Responsibility

```text
API contract review
integration testing
session flow verification
ML capture payload
WebXR camera metadata
performance testing
```

If frontend requires data not present in API:

```text
frontend team
      ↓
raise API requirement
      ↓
backend discusses contract
      ↓
OpenAPI updated
      ↓
implementation
```

Do not workaround missing backend data by permanently hardcoding it into frontend.

---

# 58. Main Engineering Principles

Frontend should behave as:

```text
Render backend state
+
Collect user interaction
+
Send valid actions
```

Not:

```text
Reimplement backend rules
```

The backend remains the source of truth for the student's learning journey.

Frontend remains the source of truth for how that journey is presented and interacted with.

Additional rules:

1. Student-facing UI only; no Filament/admin implementation.
2. Backend state is authoritative for session, progress, scoring, and result.
3. Panorama navigation must be data-driven from API.
4. ML service is never called directly from frontend.
5. Pretest/posttest correctness is never calculated or shown by frontend.
6. Micro quiz correctness is displayed only from backend response.
7. OpenAPI is the shared integration contract.
8. Build one vertical slice at a time and integrate early with real API.