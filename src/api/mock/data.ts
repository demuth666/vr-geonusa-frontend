import type {
  AssessmentItem,
  GeometryApproximation,
  HeritageArea,
  HeritageSite,
  LearningMaterial,
  MicroQuiz,
  PanoramaNode,
} from '@/types/api';

// Dataset V1 sesuai PRD #51: 1 destinasi, 1 area, 3 panorama node,
// 1 heritage object, 1 geometry mapping, 1 learning material,
// 1 micro quiz, 1 pretest, 1 posttest, 1 instrumen self-efficacy.

export const MOCK_HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'site-borobudur',
    slug: 'borobudur',
    name: 'Candi Borobudur',
    location: 'Magelang, Jawa Tengah',
    cover_image_url: '/assets/images/borobudur.jpg',
    short_description: 'Jelajahi panorama 360° Candi Borobudur dan temukan geometri di baliknya.',
    description:
      'Candi Borobudur adalah candi Buddha terbesar di dunia, dibangun pada abad ke-8 Masehi. ' +
      'Dalam pengalaman ini kamu akan menjelajahi panorama 360° area candi, mengamati elemen ' +
      'arsitektur seperti stupa, dan mempelajari konsep geometri ruang yang tersembunyi di dalamnya.',
    learning_objectives: [
      'Mengidentifikasi bentuk geometri pada elemen arsitektur candi',
      'Memahami pendekatan bangun ruang pada objek budaya nyata',
      'Menghitung besaran geometri sederhana (jari-jari, volume) dari objek yang diamati',
    ],
    experience_features: [
      'Panorama 360° dapat dijelajahi dengan mouse, sentuhan, atau headset VR',
      'Identifikasi geometri dibantu oleh model Machine Learning',
      'Materi pembelajaran kontekstual tiap objek yang ditemukan',
      'Kuis singkat untuk menguji pemahaman',
    ],
    available_areas_count: 1,
    status: 'available',
  },
  {
    id: 'site-prambanan',
    slug: 'prambanan',
    name: 'Candi Prambanan',
    location: 'Sleman, DI Yogyakarta',
    cover_image_url: '/assets/images/prambanan.jpg',
    short_description: 'Segera hadir pada pengembangan berikutnya.',
    description: 'Pengalaman Candi Prambanan sedang dalam pengembangan dan belum tersedia pada V1.',
    learning_objectives: [],
    experience_features: [],
    available_areas_count: 0,
    status: 'coming_soon',
  },
  {
    id: 'site-keraton-yogyakarta',
    slug: 'keraton-yogyakarta',
    name: 'Keraton Yogyakarta',
    location: 'Yogyakarta',
    cover_image_url: '/assets/images/keratonyogya.jpg',
    short_description: 'Dalam pengembangan — Tahun ke-2',
    description: 'Pengalaman Keraton Yogyakarta sedang dalam pengembangan dan belum tersedia pada V1.',
    learning_objectives: [],
    experience_features: [],
    available_areas_count: 0,
    status: 'coming_soon',
  },
];

/**
 * Dataset dev V1 (PRD #51: 3 panorama node). Foto 360° asli dari dokumentasi
 * tim (RICOH THETA V, 2018 — VR-GeoNusa LFS data/tour-borobudur.json):
 *   node-1 = teras-3-04, node-2 = plateu-00, node-3 = plateu-01.
 * Hotspot "Maju" (yaw 0) / "Mundur" (yaw 180) mengikuti `connections` LFS;
 * pitch -6° ≈ tinggi hotspot LFS (1.2 m) dilihat dari mata (1.6 m) pada jarak 4 m.
 * Ini HANYA data mock — di mode real semuanya datang dari backend (PRD #25).
 */
export const MOCK_AREAS: HeritageArea[] = [
  {
    id: 'area-borobudur-arupadhatu',
    heritage_site_id: 'site-borobudur',
    name: 'Teras Arupadhatu & Stupa Induk',
    panorama_node_ids: ['node-1', 'node-2', 'node-3'],
  },
];

export const MOCK_PANORAMA_NODES: Record<string, PanoramaNode> = {
  'node-1': {
    id: 'node-1',
    heritage_site_id: 'site-borobudur',
    name: 'Teras Arupadhatu 3',
    image_url: '/panorama/teras-3-04.jpg',
    initial_yaw: 0,
    initial_pitch: 0,
    hotspots: [{ id: 'hs-1-2', target_node_id: 'node-2', yaw: 0, pitch: -6, label: 'Maju' }],
  },
  'node-2': {
    id: 'node-2',
    heritage_site_id: 'site-borobudur',
    name: 'Plateu Stupa Induk',
    image_url: '/panorama/plateu-00.jpg',
    initial_yaw: 0,
    initial_pitch: 0,
    hotspots: [
      { id: 'hs-2-3', target_node_id: 'node-3', yaw: 0, pitch: -6, label: 'Maju' },
      { id: 'hs-2-1', target_node_id: 'node-1', yaw: 180, pitch: -6, label: 'Mundur' },
    ],
  },
  'node-3': {
    id: 'node-3',
    heritage_site_id: 'site-borobudur',
    name: 'Plateu Stupa Induk — Sisi Dekat',
    image_url: '/panorama/plateu-01.jpg',
    initial_yaw: 0,
    initial_pitch: 0,
    hotspots: [{ id: 'hs-3-2', target_node_id: 'node-2', yaw: 180, pitch: -6, label: 'Mundur' }],
  },
};

export const MOCK_HERITAGE_OBJECT_ID = 'obj-stupa-1';

export const MOCK_GEOMETRY: GeometryApproximation = {
  shape_name: 'Setengah Bola',
  formula: 'V = ⅔ × π × r³',
  description:
    'Bentuk stupa dapat didekati sebagai setengah bola pada bagian kubahnya, ' +
    'ditopang oleh struktur silinder pada bagian dasarnya.',
  cultural_context:
    'Stupa adalah struktur suci dalam arsitektur Buddha yang melambangkan pencerahan. ' +
    'Bentuknya berkembang dari gundukan pemakaman kuno di India.',
  culture_geometry_relation:
    'Pemilihan bentuk melengkung pada stupa bukan kebetulan — bentuk ini efisien secara ' +
    'struktural sekaligus melambangkan kubah langit dalam kosmologi Buddha.',
};

export const MOCK_LEARNING_MATERIAL: LearningMaterial = {
  heritage_object_id: MOCK_HERITAGE_OBJECT_ID,
  heritage_object_name: 'Stupa',
  learning_objective: 'Memahami pendekatan bangun ruang setengah bola pada objek budaya nyata.',
  geometry: MOCK_GEOMETRY,
  micro_quiz_id: 'quiz-stupa-1',
};

export const MOCK_MICRO_QUIZ: MicroQuiz = {
  id: 'quiz-stupa-1',
  title: 'Kuis Singkat — Stupa',
  questions: [
    {
      id: 'q1',
      prompt: 'Jika diameter stupa adalah 4 meter, berapa jari-jarinya?',
      options: [
        { id: 'a', text: '1 meter' },
        { id: 'b', text: '2 meter' },
        { id: 'c', text: '4 meter' },
        { id: 'd', text: '8 meter' },
      ],
    },
  ],
};

// Kunci jawaban ADA di mock, tapi hanya dipakai di dalam mock adapter
// (mensimulasikan evaluasi backend) — TIDAK PERNAH diekspor/dikirim ke UI.
// Lihat src/api/mock/learning-session.ts.
export const MOCK_MICRO_QUIZ_ANSWER_KEY: Record<string, string> = { q1: 'b' };

export const MOCK_PRETEST_ITEMS: AssessmentItem[] = [
  {
    id: 'pre-1',
    prompt: 'Bangun ruang yang memiliki satu sisi lengkung dan tidak memiliki rusuk disebut?',
    options: [
      { id: 'a', text: 'Kubus' },
      { id: 'b', text: 'Tabung' },
      { id: 'c', text: 'Bola' },
      { id: 'd', text: 'Limas' },
    ],
  },
  {
    id: 'pre-2',
    prompt: 'Rumus volume bola adalah?',
    options: [
      { id: 'a', text: 'V = s³' },
      { id: 'b', text: 'V = π × r² × t' },
      { id: 'c', text: 'V = 4/3 × π × r³' },
      { id: 'd', text: 'V = ⅓ × π × r² × t' },
    ],
  },
];

export const MOCK_POSTTEST_ITEMS: AssessmentItem[] = MOCK_PRETEST_ITEMS;

export const MOCK_SELF_EFFICACY_ITEMS: AssessmentItem[] = [
  {
    id: 'se-1',
    prompt: 'Saya yakin dapat mengenali bangun ruang dari objek yang saya lihat.',
    options: [
      { id: '1', text: '1 — Sangat tidak yakin' },
      { id: '2', text: '2' },
      { id: '3', text: '3' },
      { id: '4', text: '4' },
      { id: '5', text: '5 — Sangat yakin' },
    ],
  },
  {
    id: 'se-2',
    prompt: 'Saya yakin dapat menghitung volume bangun ruang sederhana.',
    options: [
      { id: '1', text: '1 — Sangat tidak yakin' },
      { id: '2', text: '2' },
      { id: '3', text: '3' },
      { id: '4', text: '4' },
      { id: '5', text: '5 — Sangat yakin' },
    ],
  },
];
