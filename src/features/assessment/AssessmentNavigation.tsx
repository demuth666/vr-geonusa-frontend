import Button from '@/components/Button';

export default function AssessmentNavigation({
  canGoBack,
  isLast,
  disabled,
  submitting,
  onBack,
  onNext,
}: {
  canGoBack: boolean;
  isLast: boolean;
  disabled: boolean;
  submitting: boolean;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-6 flex justify-between">
      <Button variant="outline" onClick={onBack} disabled={!canGoBack}>
        Sebelumnya
      </Button>
      <Button onClick={onNext} disabled={disabled || submitting}>
        {submitting ? 'Mengirim…' : isLast ? 'Selesai' : 'Berikutnya'}
      </Button>
    </div>
  );
}
