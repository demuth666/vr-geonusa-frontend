import type { StudentProfile } from '@/types/api';
import { delay, fail, isMockAuthed, setMockAuthed } from '@/api/mock/db';

const MOCK_STUDENT: StudentProfile = {
  id: 'student-1',
  name: 'Siswa Demo',
  email: 'student@example.test',
  respondent_code: 'RSP-DEMO01',
  school: 'SMP Demo',
  grade: '8',
};

export async function login(email: string, password: string): Promise<StudentProfile> {
  await delay();
  // Mock: kredensial apa pun yang tidak kosong dianggap valid, supaya alur
  // bisa dicoba tanpa backend. Validasi SUNGGUHAN selalu di backend (PRD #46).
  if (!email.trim() || !password.trim()) {
    fail(401, 'invalid_credentials', 'Email/password tidak boleh kosong');
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
