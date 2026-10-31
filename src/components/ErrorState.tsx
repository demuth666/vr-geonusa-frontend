import { userMessage } from '@/api/error';
import Button from './Button';

/**
 * Satu-satunya tempat error ditampilkan ke siswa. Selalu lewat userMessage()
 * — tidak pernah merender payload/stack trace mentah dari backend (PRD #43).
 */
export default function ErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
    >
      <p className="text-sm font-medium text-red-700">{userMessage(error)}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
