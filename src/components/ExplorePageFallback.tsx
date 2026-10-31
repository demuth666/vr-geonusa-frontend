import Spinner from '@/components/Spinner';

export default function ExplorePageFallback() {
  return (
    <div className="vr-stage" style={{ display: 'grid', placeItems: 'center' }}>
      <Spinner onDark label="Memuat pengalaman VR..." />
    </div>
  );
}
