import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-extrabold text-brand-700">
          VR-Geo<span className="text-amber-500">Nusa</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/destinations" className="hover:text-brand-700">Destinasi</Link>
          <Link to="/destinations/borobudur" className="hover:text-brand-700">Borobudur</Link>
          <Link to="/team" className="hover:text-brand-700">Tim</Link>
        </nav>
        <Link
          to="/login"
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Masuk
        </Link>
      </div>
    </header>
  );
}
