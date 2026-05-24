type TrustBadgeProps = {
  label: string;
  detail: string;
};

export function TrustBadge({ label, detail }: TrustBadgeProps) {
  return (
    <div className="trust-badge">
      <span>{label}</span>
      <small>{detail}</small>
    </div>
  );
}
