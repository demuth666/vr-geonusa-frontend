export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-brand-700" role="status" aria-live="polite">
      <span
        className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"
        aria-hidden="true"
      />
      {label && <span className="text-sm text-slate-600">{label}</span>}
    </div>
  );
}
