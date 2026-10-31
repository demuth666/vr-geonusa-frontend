import { SearchIcon } from '@/components/icons';

export default function IdentifyButton({ onClick, pending }: { onClick: () => void; pending: boolean }) {
  return (
    <button
      id="identify-btn"
      onClick={onClick}
      disabled={pending}
      aria-label="Identifikasi objek pada pandangan saat ini"
    >
      <SearchIcon />
      {pending ? 'Mengidentifikasi…' : 'Identifikasi'}
    </button>
  );
}
