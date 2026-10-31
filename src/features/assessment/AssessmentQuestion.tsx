import type { AssessmentItem } from '@/types/api';
import AssessmentOptions from './AssessmentOptions';

/**
 * Tidak pernah merender indikator benar/salah di sini (PRD #21, #22, #39).
 * Komponen ini murni presentasi soal + pilihan jawaban.
 */
export default function AssessmentQuestion({
  item,
  value,
  onChange,
}: {
  item: AssessmentItem;
  value: string | null;
  onChange: (optionId: string) => void;
}) {
  return (
    <div>
      <p className="assess-question">{item.prompt}</p>
      <AssessmentOptions name={item.id} options={item.options} value={value} onChange={onChange} />
    </div>
  );
}
