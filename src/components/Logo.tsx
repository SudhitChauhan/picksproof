import Link from "next/link";

export const LOGO_SRC = "/images/picksproof-logo.png";
export const LOGO_ALT = "PicksProof — Smart Picks. Proven Choices.";

type LogoProps = {
  href?: string;
  /** nav = header pill, auth = sign-in pages, footer = dark footer */
  variant?: "nav" | "auth" | "footer";
  className?: string;
};

export function Logo({ href = "/", variant = "nav", className = "" }: LogoProps) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={LOGO_ALT}
      className={`logo-img logo-img--${variant}`}
      height={variant === "auth" ? 68 : variant === "footer" ? 48 : 44}
      src={LOGO_SRC}
      width={variant === "auth" ? 320 : variant === "footer" ? 260 : 360}
    />
  );

  const inner = (
    <span className={`logo-mark logo-mark--${variant} ${className}`.trim()}>{img}</span>
  );

  if (!href) return inner;

  return (
    <Link className={`logo-link logo-link--${variant}`} href={href}>
      {inner}
    </Link>
  );
}
