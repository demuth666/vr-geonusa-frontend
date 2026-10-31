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
    <div className="assess-options" role="radiogroup" aria-label="Pilihan jawaban">
      {options.map((opt) => (
        <label key={opt.id} className={`assess-option${value === opt.id ? ' is-selected' : ''}`}>
          <input type="radio" name={name} checked={value === opt.id} onChange={() => onChange(opt.id)} />
          {opt.text}
        </label>
      ))}
    </div>
  );
}
