type LegalDataTableProps = {
  rows: Array<{
    type: string;
    collected: string;
    when: string;
  }>;
};

export function LegalDataTable({ rows }: LegalDataTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-about-border">
      <table className="w-full min-w-[520px] text-sm">
        <thead className="bg-about-cream">
          <tr>
            <th className="border-b border-about-border px-4 py-3.5 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-about-orange">
              Type
            </th>
            <th className="border-b border-about-border px-4 py-3.5 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-about-orange">
              What We Collect
            </th>
            <th className="border-b border-about-border px-4 py-3.5 text-left text-[0.7rem] font-bold uppercase tracking-[0.1em] text-about-orange">
              When
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-about-border bg-white">
          {rows.map((row) => (
            <tr key={row.type} className="transition-colors hover:bg-about-cream/60">
              <td className="px-4 py-3.5 font-semibold text-about-dark">{row.type}</td>
              <td className="px-4 py-3.5 text-about-muted">{row.collected}</td>
              <td className="px-4 py-3.5 text-about-muted">{row.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
