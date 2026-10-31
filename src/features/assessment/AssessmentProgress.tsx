export default function AssessmentProgress({ current, total }: { current: number; total: number }) {
  return (
    <p className="text-sm font-semibold text-slate-500">
      Pertanyaan {current} / {total}
    </p>
  );
}
