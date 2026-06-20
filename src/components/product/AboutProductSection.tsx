type Props = {
  content: string;
};

function renderAboutContent(content: string) {
  const blocks = content.split(/\n\n+/).filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const isList = lines.every((line) => line.startsWith("- "));

    if (isList) {
      return (
        <ul key={`list-${index}`} className="product-about__list" role="list">
          {lines.map((line) => (
            <li key={line}>{line.replace(/^-+\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={`p-${index}`} className="product-about__paragraph">
        {block}
      </p>
    );
  });
}

export function AboutProductSection({ content }: Props) {
  if (!content.trim()) return null;

  return (
    <section aria-labelledby="about-heading" className="product-about">
      <h2 className="eyebrow" id="about-heading">
        About this product
      </h2>
      <div className="product-about__content">{renderAboutContent(content)}</div>
    </section>
  );
}
