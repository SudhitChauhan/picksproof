import Link from "next/link";
import { categories } from "@/lib/data";

export function Header() {
  return (
    <header className="site-header">
      <Link className="logo" href="/">
        PickProof
      </Link>
      <nav aria-label="Primary navigation">
        {categories.slice(0, 3).map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.slug}>
            {category.title.replace("Best ", "")}
          </Link>
        ))}
        <Link href="/compare/aster-pro-14-vs-nova-lite-13">Compare</Link>
      </nav>
    </header>
  );
}
