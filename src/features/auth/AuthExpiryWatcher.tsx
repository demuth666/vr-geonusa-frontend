import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@/api/error';
import { setSessionWriteToken } from '@/api/session-token';

function isUnauthorized(err: unknown) {
  return err instanceof ApiError && err.status === 401;
}

/**
 * PRD #43: 401 -> redirect/login state. Memantau seluruh query & mutation
 * TanStack Query; bila ada 401 saat siswa berada di area /app (sesi
 * backend berakhir di tengah jalan), status auth lokal dibuang dan siswa
 * diarahkan ke /login dengan tujuan semula disimpan (PRD #15).
 */
export default function AuthExpiryWatcher() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith('/app')) return;

    const handle = (err: unknown) => {
      if (!isUnauthorized(err)) return;
      setSessionWriteToken(null);
      qc.setQueryData(['me'], null);
      navigate('/login', { replace: true, state: { from: location } });
    };

    const unsubQ = qc.getQueryCache().subscribe((e) => {
      if (e.type === 'updated' && e.action.type === 'error') handle(e.action.error);
    });
    const unsubM = qc.getMutationCache().subscribe((e) => {
      if (e.type === 'updated' && e.action.type === 'error') handle(e.action.error);
    });
    return () => {
      unsubQ();
      unsubM();
    };
  }, [qc, navigate, location]);

  return null;
}
