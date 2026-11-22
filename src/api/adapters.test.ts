import { describe, expect, it } from 'vitest';
import {
  mapAssessmentAttempt,
  mapExplorationProgress,
  mapHeritageArea,
  mapLearningMaterial,
  mapLearningSession,
  mapMlPrediction,
  mapPanoramaNode,
  mapSessionResult,
} from './adapters';
import type {
  BackendAssessmentAttempt,
  BackendExplorationProgress,
  BackendHeritageArea,
  BackendLearningMaterial,
  BackendLearningSession,
  BackendMlPrediction,
  BackendPanoramaNode,
  BackendCompletedSessionResult,
} from './backend-types';

describe('backend -> UI adapters', () => {
  it('maps a learning session and its current panorama node', () => {
    const session: BackendLearningSession = {
      id: 12,
      respondent_code: 'RSP-ABC123',
      phase: 'exploration',
      current_panorama_node: {
        id: 4,
        name: 'Stupa Induk',
        slug: 'stupa-induk',
        panorama_url: 'https://cdn.test/stupa.jpg',
      },
      created_at: '2026-11-09T00:00:00Z',
      updated_at: '2026-11-09T00:00:00Z',
      write_token: 'a'.repeat(64),
    };

    const mapped = mapLearningSession(session);

    expect(mapped.id).toBe('12');
    expect(mapped.current_panorama_node_id).toBe('4');
    expect(mapped.phase).toBe('exploration');
    expect(mapped.write_token).toBe('a'.repeat(64));
  });

  it('derives exploration percentage and finishability from required activity arrays', () => {
    const progress: BackendExplorationProgress = {
      panorama_visits: [
        { panorama_node_id: 1, completed: true },
        { panorama_node_id: 2, completed: false },
      ],
      learning_materials: [{ heritage_object_id: 3, completed: true }],
      micro_quizzes: [{ quiz_id: 5, completed: false }],
      completed: false,
    };

    const mapped = mapExplorationProgress(progress);

    expect(mapped.percentage).toBe(50);
    expect(mapped.can_finish).toBe(false);
    expect(mapped.requirements.required_panorama_visited).toBe(false);
    expect(mapped.requirements.micro_quiz_completed).toBe(false);
  });

  it('maps area nodes, panorama links, and drops unresolved ML detections', () => {
    const area: BackendHeritageArea = {
      id: 1,
      name: 'Pelataran Utama',
      slug: 'pelataran-utama',
      description: null,
      panorama_nodes: [{ id: 7, name: 'Timur', slug: 'timur', panorama_url: 'https://cdn.test/7.jpg' }],
    };
    const node: BackendPanoramaNode = {
      id: 7,
      name: 'Timur',
      slug: 'timur',
      panorama_url: 'https://cdn.test/7.jpg',
      area: {
        id: 1,
        name: 'Pelataran Utama',
        slug: 'pelataran-utama',
        heritage_site: { id: 2, name: 'Borobudur', slug: 'borobudur' },
      },
      links: [
        {
          id: 9,
          label: 'Maju',
          yaw: 0,
          pitch: -6,
          target: { id: 8, name: 'Stupa', slug: 'stupa', panorama_url: 'https://cdn.test/8.jpg' },
        },
      ],
      annotations: [],
    };
    const prediction: BackendMlPrediction = {
      model_version: 'dummy-v1',
      inference_ms: 10,
      total_latency_ms: 20,
      detections: [
        {
          class: 'stupa',
          confidence: 0.95,
          bounding_box: [0, 0, 1, 1],
          heritage_object: { id: 3, name: 'Stupa', slug: 'stupa', description: null },
          geometry_mappings: [],
        },
        {
          class: 'unknown',
          confidence: 0.4,
          bounding_box: [0, 0, 1, 1],
          heritage_object: null,
          geometry_mappings: [],
        },
      ],
    };

    expect(mapHeritageArea(area).panorama_node_ids).toEqual(['7']);
    expect(mapPanoramaNode(node).hotspots[0].target_node_id).toBe('8');
    expect(mapMlPrediction(prediction).detections).toEqual([
      { heritage_object_id: '3', label: 'Stupa', confidence: 0.95 },
    ]);
  });

  it('maps learning material including the micro quiz id', () => {
    const material: BackendLearningMaterial = {
      heritage_object: { id: 3, name: 'Stupa', slug: 'stupa', description: 'Objek budaya' },
      geometry_mappings: [
        {
          semantics: 'didekati sebagai',
          micro_quiz_id: 90,
          geometry_shape: {
            id: 2,
            name: 'Setengah Bola',
            slug: 'setengah-bola',
            description: 'Kubah setengah bola.',
          },
          learning_objectives: [
            { id: 1, title: 'Tujuan', content: 'Mengenali setengah bola.', position: 1 },
          ],
        },
      ],
    };

    const mapped = mapLearningMaterial(material);

    expect(mapped.heritage_object_name).toBe('Stupa');
    expect(mapped.micro_quiz_id).toBe('90');
    expect(mapped.geometry.shape_name).toBe('Setengah Bola');
    expect(mapped.learning_objective).toBe('Mengenali setengah bola.');
  });

  it('restores draft assessment answers and position', () => {
    const attempt: BackendAssessmentAttempt = {
      id: 11,
      type: 'pretest',
      title: 'Pretest',
      status: 'draft',
      submitted_at: null,
      items: [
        {
          id: 1,
          prompt: 'Soal 1',
          position: 1,
          selected_option_id: 3,
          options: [{ id: 3, text: 'Bola', position: 1 }],
        },
        {
          id: 2,
          prompt: 'Soal 2',
          position: 2,
          selected_option_id: null,
          options: [{ id: 4, text: 'Kubus', position: 1 }],
        },
      ],
      created_at: '2026-11-09T00:00:00Z',
      updated_at: '2026-11-09T00:00:00Z',
    };

    const mapped = mapAssessmentAttempt(attempt);

    expect(mapped.items[0].selected_option_id).toBe('3');
    expect(mapped.current_index).toBe(1);
    expect(mapped.submitted).toBe(false);
  });

  it('maps a completed session result without exposing scores to the result view', () => {
    const result: BackendCompletedSessionResult = {
      id: 12,
      phase: 'completed',
      pretest_score: 80,
      posttest_score: 90,
      activity_summary: {
        panoramas_visited: 3,
        materials_viewed: 1,
        micro_quizzes_completed: 1,
      },
    };

    const mapped = mapSessionResult(result);

    expect(mapped).toMatchObject({
      session_id: '12',
      panoramas_visited: 3,
      objects_learned: 1,
      micro_quizzes_completed: 1,
    });
    expect(mapped).not.toHaveProperty('pretest_score');
    expect(mapped).not.toHaveProperty('posttest_score');
  });
});
