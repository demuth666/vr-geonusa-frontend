export default function ProgressBar({ percentage }: { percentage: number }) {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <div className="flex items-center gap-2" aria-label={`Progres eksplorasi ${clamped}%`}>
      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600">{clamped}%</span>
    </div>
  );
}
