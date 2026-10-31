import QuizPanel from '@/vr/hud/QuizPanel';

export default function FinishConfirmOverlay({
  pending,
  onConfirm,
  onCancel,
}: {
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <QuizPanel label="Selesai Eksplorasi" onClose={onCancel}>
      <div className="quiz-question">Selesaikan eksplorasi?</div>
      <p className="confirm-sub">Kamu akan melanjutkan ke posttest setelah ini.</p>
      <div className="info-actions">
        <button className="vr-secondary-btn" onClick={onCancel}>
          Kembali
        </button>
        <button className="vr-primary-btn" onClick={onConfirm} disabled={pending}>
          {pending ? 'Memproses…' : 'Selesai'}
        </button>
      </div>
    </QuizPanel>
  );
}
