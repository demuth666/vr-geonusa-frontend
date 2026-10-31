export default function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="state-card is-empty">
      <p className="state-title">{title}</p>
      {description && <p className="state-desc">{description}</p>}
    </div>
  );
}
