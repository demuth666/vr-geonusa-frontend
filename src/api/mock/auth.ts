import type { StudentProfile } from '@/types/api';
import { delay, fail, isMockAuthed, setMockAuthed } from '@/api/mock/db';

const MOCK_STUDENT: StudentProfile = {
  id: 'student-1',
  name: 'Siswa Demo',
  school: 'SMP Demo',
  grade: '8',
};

export async function login(identifier: string, password: string): Promise<StudentProfile> {
  await delay();
  // Mock: kredensial apa pun yang tidak kosong dianggap valid, supaya alur
  // bisa dicoba tanpa backend. Validasi SUNGGUHAN selalu di backend (PRD #46).
  if (!identifier.trim() || !password.trim()) {
    fail(401, 'invalid_credentials', 'Identifier/password tidak boleh kosong');
  }
  setMockAuthed(true);
  return MOCK_STUDENT;
}

export async function logout(): Promise<void> {
  await delay(150);
  setMockAuthed(false);
}

export async function me(): Promise<StudentProfile> {
  await delay(150);
  if (!isMockAuthed()) fail(401, 'not_authenticated', 'Not authenticated');
  return MOCK_STUDENT;
}
