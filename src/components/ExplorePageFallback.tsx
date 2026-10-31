import Spinner from '@/components/Spinner';

export default function ExplorePageFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <Spinner label="Memuat pengalaman VR..." />
    </div>
  );
}
