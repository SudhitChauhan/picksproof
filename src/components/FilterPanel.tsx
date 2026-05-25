import type { Category } from "@/lib/data";

type FilterPanelProps = {
  category: Category;
};

export function FilterPanel({ category }: FilterPanelProps) {
  return (
    <aside className="filter-panel">
      <h2>Filter Products</h2>
      <p>Refine by the factors shoppers check before clicking through.</p>
      {Object.entries(category.filters).filter(([, options]) => options.length > 0).map(([group, options]) => (
        <fieldset key={group}>
          <legend>{group}</legend>
          {options.map((option) => (
            <label key={option}>
              <input type="checkbox" />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
    </aside>
  );
}
