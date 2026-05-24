type ProsConsListProps = {
  pros: string[];
  cons: string[];
};

export function ProsConsList({ pros, cons }: ProsConsListProps) {
  return (
    <div className="pros-cons">
      <div>
        <h3>The Good</h3>
        <ul>
          {pros.map((pro) => (
            <li className="positive" key={pro}>
              <span aria-hidden="true">✓</span>
              {pro}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>The Bad</h3>
        <ul>
          {cons.map((con) => (
            <li className="negative" key={con}>
              <span aria-hidden="true">X</span>
              {con}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
