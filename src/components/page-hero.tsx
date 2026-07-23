export function PageHero({
  eyebrow,
  title,
  description,
  index,
  indexLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  index: string;
  indexLabel: string;
}) {
  return (
    <header className="page-hero">
      <div className="shell page-hero-inner">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-copy">{description}</p>
        </div>
        <div className="page-index" aria-hidden="true">
          <span>{index}</span>
          <strong>{indexLabel}</strong>
        </div>
      </div>
    </header>
  );
}
