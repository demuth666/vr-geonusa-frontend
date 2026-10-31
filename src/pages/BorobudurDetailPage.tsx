import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import { useHeritageSite } from '@/features/heritage/hooks';

/**
 * Route publik /destinations/:slug. CTA "Mulai Eksplorasi" mengarah ke
 * /app/borobudur/intro (protected). Pengecekan auth dilakukan oleh
 * ProtectedRoute, bukan di sini (PRD #15) — kalau belum login, ProtectedRoute
 * yang mengarahkan ke /login sambil menyimpan tujuan semula.
 */
export default function BorobudurDetailPage() {
  const { slug = 'borobudur' } = useParams();
  const siteQuery = useHeritageSite(slug);

  if (siteQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Memuat destinasi..." />
      </div>
    );
  }
  if (siteQuery.isError || !siteQuery.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <ErrorState error={siteQuery.error} onRetry={() => siteQuery.refetch()} />
      </div>
    );
  }

  const site = siteQuery.data;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <img src={site.cover_image_url} alt={site.name} className="aspect-[21/9] w-full object-cover" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-900">{site.name}</h1>
        <p className="mt-1 text-slate-500">{site.location}</p>
        <p className="mt-4 text-slate-700">{site.description}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-bold text-slate-900">Tujuan Pembelajaran</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {site.learning_objectives.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Fitur Pengalaman</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {site.experience_features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          {site.available_areas_count} area panorama tersedia untuk dijelajahi.
        </p>

        <Link to="/app/borobudur/intro" className="mt-8 inline-block">
          <Button>Mulai Eksplorasi</Button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
