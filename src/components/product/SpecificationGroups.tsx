import type { SpecificationGroup } from "@/lib/products/product-details-types";

type Props = {
  groups: SpecificationGroup[];
};

export function SpecificationGroups({ groups }: Props) {
  if (groups.length === 0) return null;

  return (
    <section aria-labelledby="specs-heading" className="product-specs">
      <h2 className="eyebrow" id="specs-heading">
        Full specifications
      </h2>
      <div className="product-specs__card">
        {groups.map((group, groupIndex) => (
          <div
            key={group.category}
            className={groupIndex < groups.length - 1 ? "product-specs__group product-specs__group--bordered" : "product-specs__group"}
          >
            <div className="product-specs__group-head">
              <span aria-hidden className="product-specs__group-dot" />
              <h3>{group.category}</h3>
            </div>
            <dl className="product-specs__rows">
              {group.specs.map((spec) => (
                <div key={`${group.category}-${spec.label}`} className="product-specs__row">
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
