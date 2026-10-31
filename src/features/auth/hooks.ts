import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/error';
import * as api from './api';

/**
 * Source of truth status auth adalah GET /me (PRD #16), bukan state lokal.
 * 401 di sini bukan "error" aplikasi — itu cuma berarti "belum login", jadi
 * retry dimatikan dan error di-swallow jadi `null` di pemanggil (lihat
 * ProtectedRoute / Navbar) alih-alih dirender sebagai error state.
 */
export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: api.getMe,
    retry: false,
    staleTime: 30_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { identifier: string; password: string }) =>
      api.login(vars.identifier, vars.password),
    onSuccess: (profile) => {
      qc.setQueryData(['me'], profile);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      qc.setQueryData(['me'], null);
      qc.clear();
    },
  });
}

export function isUnauthorized(err: unknown): boolean {
  return err instanceof ApiError && err.status === 401;
}
