type Props = {
  addedByDay: number[];
  monthLabel: string;
  today: number;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

export function ActivityCalendarCard({ addedByDay, monthLabel, today }: Props) {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const leading = Array.from({ length: firstDay }, () => null);
  const days = [...leading, ...addedByDay.map((count, index) => ({ day: index + 1, count }))];

  return (
    <article className="admin-widget admin-widget--dark admin-widget--stats">
      <div className="admin-widget-head admin-widget-head--dark">
        <h2>Publishing Activity</h2>
        <p>{monthLabel}</p>
      </div>

      <div className="admin-calendar-grid" role="grid" aria-label={`${monthLabel} activity`}>
        {WEEKDAYS.map((label) => (
          <span className="admin-calendar-weekday" key={label}>
            {label}
          </span>
        ))}
        {days.map((entry, index) =>
          entry === null ? (
            <span className="admin-calendar-cell admin-calendar-cell--empty" key={`empty-${index}`} />
          ) : (
            <span
              className={[
                "admin-calendar-cell",
                entry.day === today ? "is-today" : "",
                entry.count > 0 ? "is-active" : "",
                entry.day > today ? "is-future" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={entry.day}
              title={
                entry.count > 0
                  ? `${entry.count} product${entry.count === 1 ? "" : "s"} added`
                  : `Day ${entry.day}`
              }
            >
              {entry.day}
            </span>
          )
        )}
      </div>

      <ul className="admin-legend admin-legend--dark">
        <li>
          <span className="admin-legend-dot admin-legend-dot--signal" />
          Published day
        </li>
        <li>
          <span className="admin-legend-dot admin-legend-dot--canvas" />
          Today
        </li>
        <li>
          <span className="admin-legend-dot admin-legend-dot--muted" />
          Empty day
        </li>
      </ul>
    </article>
  );
}
