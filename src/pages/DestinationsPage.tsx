import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { useHeritageSites } from '@/features/heritage/hooks';

export default function DestinationsPage() {
  const sitesQuery = useHeritageSites();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold text-slate-900">Destinasi</h1>
        <p className="mt-2 text-slate-600">Pilih situs warisan budaya yang ingin kamu jelajahi.</p>

        <div className="mt-8">
          {sitesQuery.isLoading && (
            <div className="flex justify-center">
              <Spinner label="Memuat destinasi..." />
            </div>
          )}
          {sitesQuery.isError && <ErrorState error={sitesQuery.error} onRetry={() => sitesQuery.refetch()} />}
          {sitesQuery.data && sitesQuery.data.length === 0 && (
            <EmptyState title="Belum ada destinasi" />
          )}
          {sitesQuery.data && sitesQuery.data.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              {sitesQuery.data.map((site) => (
                <div key={site.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img
                    src={site.cover_image_url}
                    alt={site.name}
                    className="aspect-video w-full object-cover"
                  />
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-slate-900">{site.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{site.location}</p>
                    <p className="mt-2 text-sm text-slate-600">{site.short_description}</p>
                    {site.status === 'available' ? (
                      <Link to={`/destinations/${site.slug}`} className="mt-4 inline-block">
                        <Button variant="outline">Lihat Detail</Button>
                      </Link>
                    ) : (
                      <span className="mt-4 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        Segera Hadir
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
