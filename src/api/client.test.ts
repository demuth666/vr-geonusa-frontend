import { describe, expect, it } from 'vitest';
import { unwrapData } from './client';

describe('unwrapData (Laravel { data } envelope)', () => {
  it('unwraps data, including null', () => {
    expect(unwrapData({ data: { id: 1 } })).toEqual({ id: 1 });
    expect(unwrapData({ data: null })).toBeNull();
    expect(unwrapData({ data: [] })).toEqual([]);
  });
  it('passes through unwrapped payloads', () => {
    expect(unwrapData([1, 2])).toEqual([1, 2]);
    expect(unwrapData({ id: 1 })).toEqual({ id: 1 });
    expect(unwrapData(null)).toBeNull();
  });
});
