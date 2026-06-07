import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

/** Section wrapper — content is always visible (no opacity gate on scroll). */
export function ScrollSection({ children, className = "", id }: Props) {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
}
