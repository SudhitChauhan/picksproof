import Link from "next/link";
import { buildLoginHref } from "@/lib/auth/redirect";

type Props = {
  categoryTitle: string;
  returnTo: string;
};

/** Shown when anonymous users try to access product comparison. */
export function ComparisonAuthPrompt({ categoryTitle, returnTo }: Props) {
  const loginHref = buildLoginHref(returnTo);

  return (
    <div className="rounded-[28px] border border-line bg-canvas px-8 py-10 text-center">
      <p className="eyebrow mb-2">Members only</p>
      <h3 className="text-xl text-ink mb-2">Compare {categoryTitle}</h3>
      <p className="text-slate mb-6 max-w-md mx-auto leading-relaxed">
        Register for a free account to compare products side by side with full specifications.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link className="btn-affiliate" href="/register">
          Create account
        </Link>
        <Link className="btn-outline" href={loginHref}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
