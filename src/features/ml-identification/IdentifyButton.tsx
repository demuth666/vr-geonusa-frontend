import Button from '@/components/Button';

export default function IdentifyButton({
  onClick,
  pending,
}: {
  onClick: () => void;
  pending: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={pending}
      className="absolute bottom-6 right-6 z-20 shadow-lg"
      aria-label="Identifikasi objek pada pandangan saat ini"
    >
      {pending ? 'Mengidentifikasi…' : 'Identifikasi'}
    </Button>
  );
}
