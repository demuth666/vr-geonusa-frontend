import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import RootLayout from '@/app/layouts/RootLayout';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import Spinner from '@/components/Spinner';

import LandingPage from '@/pages/LandingPage';
import DestinationsPage from '@/pages/DestinationsPage';
import BorobudurDetailPage from '@/pages/BorobudurDetailPage';
import LoginPage from '@/pages/LoginPage';
import TeamPage from '@/pages/TeamPage';
import BorobudurIntroPage from '@/pages/BorobudurIntroPage';
import PretestPage from '@/pages/PretestPage';
import PosttestPage from '@/pages/PosttestPage';
import SelfEfficacyPage from '@/pages/SelfEfficacyPage';
import ResultPage from '@/pages/ResultPage';
import NotFoundPage from '@/pages/NotFoundPage';

// ExplorePage dipisah jadi chunk sendiri secara sengaja: ia (lewat
// PanoramaScene) mengimpor 'aframe', library ~1MB+ yang hanya dibutuhkan
// pada tahap eksplorasi. Halaman publik/pretest/posttest tidak perlu
// menanggung bundle itu di initial load.
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));

function ExplorePageFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <Spinner label="Memuat pengalaman VR..." />
    </div>
  );
}

/**
 * Struktur route mengikuti PRD #12-#19:
 * - Publik: landing, daftar destinasi, detail Borobudur, login.
 * - Protected (/app/...): intro + seluruh siklus session (pretest ->
 *   exploration -> posttest -> self-efficacy -> result), dijaga
 *   ProtectedRoute (auth) dan SessionPhaseGuard per-halaman (phase).
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/destinations', element: <DestinationsPage /> },
      { path: '/destinations/:slug', element: <BorobudurDetailPage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/login', element: <LoginPage /> },

      {
        path: '/app',
        element: <ProtectedRoute />,
        children: [
          { path: 'borobudur/intro', element: <BorobudurIntroPage /> },
          { path: 'borobudur/session/:sessionId/pretest', element: <PretestPage /> },
          {
            path: 'borobudur/session/:sessionId/explore',
            element: (
              <Suspense fallback={<ExplorePageFallback />}>
                <ExplorePage />
              </Suspense>
            ),
          },
          { path: 'borobudur/session/:sessionId/posttest', element: <PosttestPage /> },
          { path: 'borobudur/session/:sessionId/self-efficacy', element: <SelfEfficacyPage /> },
          { path: 'borobudur/session/:sessionId/result', element: <ResultPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
