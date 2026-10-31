import { userMessage } from '@/api/error';
import Button from './Button';

/**
 * Satu-satunya tempat error ditampilkan ke siswa. Selalu lewat userMessage()
 * — tidak pernah merender payload/stack trace mentah dari backend (PRD #43).
 */
export default function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="state-card is-error" role="alert">
      <p>{userMessage(error)}</p>
      {onRetry && (
        <Button variant="outline" className="btn-sm" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
