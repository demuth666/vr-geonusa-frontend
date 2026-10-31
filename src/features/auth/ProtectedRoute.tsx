import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useMe } from './hooks';
import Spinner from '@/components/Spinner';

/**
 * Melindungi seluruh route /app/*. Status auth SELALU dari GET /me (backend),
 * tidak pernah dari state lokal (PRD #16). Lokasi yang dituju disimpan di
 * router state supaya setelah login berhasil, siswa dikembalikan ke tujuan
 * semula, bukan ke landing page (PRD #15).
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) {
    return (
      <div className="center-screen">
        <Spinner label="Memeriksa status masuk..." />
      </div>
    );
  }

  if (isError || !me) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
