type Props = {
  summary: string;
  hiddenIssues: string[];
};

export function LongTermOwnership({ summary, hiddenIssues }: Props) {
  if (!summary && hiddenIssues.length === 0) return null;

  return (
    <section aria-labelledby="ownership-heading" className="product-ownership">
      <h2 className="eyebrow" id="ownership-heading">
        Long-term ownership
      </h2>
      {summary ? <p className="product-ownership__summary">{summary}</p> : null}
      {hiddenIssues.length > 0 ? (
        <ul className="product-ownership__warnings" role="list">
          {hiddenIssues.map((issue) => (
            <li key={issue} className="product-ownership__warning">
              <span aria-hidden className="product-ownership__warning-dot" />
              <p>
                <strong>Hidden issue:</strong> {issue}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
