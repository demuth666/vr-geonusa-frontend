import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorState from '@/components/ErrorState';
import { SplashLogo } from '@/components/icons';
import { useLogin } from '@/features/auth/hooks';

/**
 * Login siswa — tampilan splash tur 360° LFS (#splash, vr.css).
 * Mode "Tamu" LFS tidak dipakai: PRD V1 mewajibkan login sebelum sesi.
 */
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
    <main id="splash">
      <div className="logo-wrap">
        <SplashLogo />
      </div>
      <h1>Masuk</h1>
      <p className="tagline">Masuk untuk memulai eksplorasi pembelajaran.</p>

      <form onSubmit={handleSubmit} className="splash-form">
        <input
          id="identifier"
          className="splash-input"
          aria-label="NISN / Email"
          placeholder="NISN / Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          autoComplete="username"
        />
        <input
          id="password"
          className="splash-input"
          type="password"
          aria-label="Kata Sandi"
          placeholder="Kata Sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {login.isError && (
          <div className="splash-error-box">
            <ErrorState error={login.error} />
          </div>
        )}

        <button type="submit" disabled={login.isPending}>
          {login.isPending ? 'Memproses…' : 'Masuk'}
        </button>
      </form>

      <div className="meta">
        Gunakan akun siswa dari sekolahmu.
        <br />
        Komputer, HP, atau headset VR — semuanya bisa!
      </div>
      <Link to="/" className="splash-back">
        ← Kembali ke Portal
      </Link>
    </main>
  );
}
