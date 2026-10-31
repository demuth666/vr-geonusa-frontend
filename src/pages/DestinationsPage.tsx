import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Spinner from '@/components/Spinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { MapPinIcon } from '@/components/icons';
import { useHeritageSites } from '@/features/heritage/hooks';
import DestinationBento from '@/features/landing/DestinationBento';

export default function DestinationsPage() {
  const sitesQuery = useHeritageSites();

  return (
    <div className="page">
      <div className="blob-bg" aria-hidden="true" />
      <Navbar />
      <main className="page-main section">
        <div className="section-head">
          <div className="section-kicker">
            <MapPinIcon />
            Pilih Destinasi
          </div>
          <h1 className="section-h2">
            Jelajahi <em>Candi Indonesia</em>
          </h1>
          <p className="section-desc">Pilih situs warisan budaya yang ingin kamu jelajahi.</p>
        </div>

        {sitesQuery.isLoading && (
          <div className="center-block">
            <Spinner label="Memuat destinasi..." />
          </div>
        )}
        {sitesQuery.isError && <ErrorState error={sitesQuery.error} onRetry={() => sitesQuery.refetch()} />}
        {sitesQuery.data && sitesQuery.data.length === 0 && <EmptyState title="Belum ada destinasi" />}
        {sitesQuery.data && sitesQuery.data.length > 0 && <DestinationBento sites={sitesQuery.data} />}
      </main>
      <Footer />
    </div>
  );
}
