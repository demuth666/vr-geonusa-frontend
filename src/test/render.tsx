import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation, useRoutes } from 'react-router-dom';
import { routes } from '@/app/router';

/**
 * Render aplikasi lengkap (route asli) mulai dari `path`. Pakai MemoryRouter +
 * useRoutes (bukan createMemoryRouter): data router membuat `Request` dengan
 * AbortSignal jsdom yang ditolak undici Node.
 */
export function renderApp(path: string, state?: unknown) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const current = { pathname: path };

  function App() {
    const location = useLocation();
    current.pathname = location.pathname;
    return useRoutes(routes);
  }

  const utils = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[{ pathname: path, state }]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return { ...utils, location: current, queryClient };
}
