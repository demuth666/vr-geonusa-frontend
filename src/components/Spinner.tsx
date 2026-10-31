export default function Spinner({ label, onDark = false }: { label?: string; onDark?: boolean }) {
  return (
    <div className={`spinner${onDark ? ' on-dark' : ''}`} role="status" aria-live="polite">
      <span className="spinner-ring" aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
