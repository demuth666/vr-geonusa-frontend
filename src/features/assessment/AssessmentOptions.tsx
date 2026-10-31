import type { QuizOption } from '@/types/api';

export default function AssessmentOptions({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: QuizOption[];
  value: string | null;
  onChange: (optionId: string) => void;
}) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Pilihan jawaban">
      {options.map((opt) => (
        <label
          key={opt.id}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition ${
            value === opt.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name={name}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
          />
          {opt.text}
        </label>
      ))}
    </div>
  );
}
