import type { Complaint } from "@/lib/products/product-details-types";

type Props = {
  complaints: Complaint[];
};

const severityClass: Record<Complaint["severity"], string> = {
  Common: "product-complaint__severity--common",
  Occasional: "product-complaint__severity--occasional",
  Rare: "product-complaint__severity--rare"
};

export function RecurringComplaints({ complaints }: Props) {
  if (complaints.length === 0) return null;

  return (
    <section aria-labelledby="complaints-heading" className="product-complaints">
      <h2 className="eyebrow" id="complaints-heading">
        Recurring complaints
      </h2>
      <ul className="product-complaints__list" role="list">
        {complaints.map((complaint) => (
          <li key={complaint.title} className="product-complaints__item">
            <div className="product-complaints__main">
              <span
                aria-hidden
                className={`product-complaints__dot product-complaints__dot--${complaint.severity.toLowerCase()}`}
              />
              <span>{complaint.title}</span>
            </div>
            <span className={`product-complaint__severity ${severityClass[complaint.severity]}`}>
              {complaint.severity}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
