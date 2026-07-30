export function PageHero({
  eyebrow,
  title,
  description,
  index,
  indexLabel,
  showIndex = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  index?: string;
  indexLabel?: string;
  showIndex?: boolean;
}) {
  return (
    <header className="page-hero">
      <div
        className={`shell page-hero-inner${showIndex ? "" : " page-hero-inner-single"}`}
      >
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {description ? <p className="page-hero-copy">{description}</p> : null}
        </div>
        {showIndex && index && indexLabel ? (
          <div className="page-index" aria-hidden="true">
            <span>{index}</span>
            <strong>{indexLabel}</strong>
          </div>
        ) : null}
      </div>
    </header>
  );
}
