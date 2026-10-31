import type { ReactNode } from 'react';

/** Panel kanan "#info-overlay" LFS (vr.css). Satu panel aktif pada satu waktu. */
export default function InfoPanel({
  label,
  onClose,
  children,
  role,
}: {
  label: string;
  onClose?: () => void;
  children: ReactNode;
  role?: 'status' | 'alert' | 'dialog';
}) {
  return (
    <div id="info-overlay" style={{ display: 'block' }} role={role} aria-live={role === 'dialog' ? undefined : 'polite'}>
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
