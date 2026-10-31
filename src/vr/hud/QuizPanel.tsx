import type { ReactNode } from 'react';

/** Panel tengah "#quiz-overlay" LFS (vr.css). */
export default function QuizPanel({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose?: () => void;
  children: ReactNode;
}) {
  return (
    <div id="quiz-overlay" style={{ display: 'block' }} role="dialog" aria-modal="false" aria-label={label}>
      {onClose && (
        <button className="close" onClick={onClose} aria-label="Tutup">
          ×
        </button>
      )}
      <div className="panel-label">{label}</div>
      {children}
    </div>
  );
}
