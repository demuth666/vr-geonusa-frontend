export default function ProgressBar({ percentage }: { percentage: number }) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <div className="tour-chip-progress" aria-label={`Progres eksplorasi ${clamped}%`}>
      <span className="tour-chip-label">Progress</span>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${clamped}%` }} />
      </div>
      <span>{clamped}%</span>
    </div>
  );
}
