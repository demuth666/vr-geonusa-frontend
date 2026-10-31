import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import ErrorState from '@/components/ErrorState';
import { useLogin } from '@/features/auth/hooks';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? '/app/borobudur/intro';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    login.mutate(
      { identifier, password },
      {
        // PRD #15: setelah login sukses, kembali ke tujuan semula — bukan ke landing.
        onSuccess: () => navigate(from, { replace: true }),
      }
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Masuk</h1>
        <p className="mt-1 text-sm text-slate-500">Masuk untuk memulai eksplorasi pembelajaran.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-slate-700">
              NISN / Email
            </label>
            <input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              autoComplete="current-password"
            />
          </div>

          {login.isError && <ErrorState error={login.error} />}

          <Button type="submit" disabled={login.isPending} className="w-full">
            {login.isPending ? 'Memproses…' : 'Masuk'}
          </Button>
        </form>
      </div>
    </div>
  );
}
