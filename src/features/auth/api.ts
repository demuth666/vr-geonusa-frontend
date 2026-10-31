import { isMock } from '@/api/mode';
import { ensureCsrfCookie, http } from '@/api/client';
import * as mock from '@/api/mock/auth';
import type { StudentProfile } from '@/types/api';

export async function login(identifier: string, password: string): Promise<StudentProfile> {
  if (isMock) return mock.login(identifier, password);
  await ensureCsrfCookie();
  return http<StudentProfile>('POST', '/auth/login', { identifier, password });
}

export function logout(): Promise<void> {
  if (isMock) return mock.logout();
  return http<void>('POST', '/auth/logout');
}

export function getMe(): Promise<StudentProfile> {
  if (isMock) return mock.me();
  return http<StudentProfile>('GET', '/me');
}
