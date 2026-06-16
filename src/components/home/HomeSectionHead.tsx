import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  action?: ReactNode;
  align?: "left" | "center";
};

export function HomeSectionHead({ eyebrow, title, lead, action, align = "left" }: Props) {
  return (
    <div className={`section-head home-section-head home-section-head--${align}`}>
      <div className="home-section-head-copy">
        <p className="home-section-tag">
          <span className="home-section-tag-dot" aria-hidden />
          {eyebrow}
        </p>
        <h2 className="home-section-title">{title}</h2>
        {lead ? <p className="section-lead">{lead}</p> : null}
      </div>
      {action ? <div className="home-section-head-action">{action}</div> : null}
    </div>
  );
}
