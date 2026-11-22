import { isMock } from '@/api/mode';
import { http } from '@/api/client';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/api/auth-token';
import { ApiError } from '@/api/error';
import { mapStudentProfile } from '@/api/adapters';
import type { BackendAuthenticatedStudent, BackendLoginData } from '@/api/backend-types';
import * as mock from '@/api/mock/auth';
import type { StudentProfile } from '@/types/api';

export async function login(email: string, password: string): Promise<StudentProfile> {
  if (isMock) return mock.login(email, password);

  const result = await http<BackendLoginData>('POST', '/auth/login', { email, password });
  setAuthToken(result.token);
  return mapStudentProfile(result.user);
}

export async function logout(): Promise<void> {
  if (isMock) return mock.logout();

  try {
    await http<void>('POST', '/auth/logout');
  } finally {
    clearAuthToken();
  }
}

export async function getMe(): Promise<StudentProfile> {
  if (isMock) return mock.me();

  if (!getAuthToken()) {
    throw new ApiError(401, 'UNAUTHENTICATED', 'Not authenticated');
  }

  const user = await http<BackendAuthenticatedStudent>('GET', '/me');
  return mapStudentProfile(user);
}
