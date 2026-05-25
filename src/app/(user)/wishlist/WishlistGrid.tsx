"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartOff, ShoppingBag, Star, Trash2 } from "lucide-react";
import type { Product } from "@/lib/data";

export function WishlistGrid({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);

  if (products.length === 0) {
    return (
      <div className="grid place-items-center rounded-[2rem] border border-admin-line bg-admin-surface px-6 py-20 text-center shadow-[0_24px_70px_rgba(16,42,67,0.10)] dark:border-slate-800 dark:bg-slate-900">
        <div className="flex size-20 items-center justify-center rounded-[1.75rem] bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
          <HeartOff className="size-9" />
        </div>
        <h2 className="mt-6 text-2xl font-black tracking-tight text-admin-ink dark:text-white">
          Your wishlist is empty
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-admin-muted dark:text-slate-400">
          Save products you want to compare later. We will keep your top picks ready when you come
          back.
        </p>
        <Link
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
          href="/"
        >
          <ShoppingBag className="size-4" />
          Explore Top Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <article
          className="group overflow-hidden rounded-[2rem] border border-admin-line bg-admin-surface shadow-[0_24px_70px_rgba(16,42,67,0.10)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(16,42,67,0.16)] dark:border-slate-800 dark:bg-slate-900"
          key={product.slug}
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="size-full object-cover transition duration-500 group-hover:scale-105"
              src={product.image}
            />
            <button
              className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg backdrop-blur transition hover:bg-red-50 dark:bg-slate-950/90 dark:text-red-300"
              onClick={() => setProducts(products.filter((item) => item.slug !== product.slug))}
              type="button"
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Remove {product.name} from wishlist</span>
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-800">
                {product.categoryName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-black text-admin-ink ring-1 ring-admin-line dark:bg-slate-950 dark:text-white dark:ring-slate-700">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-admin-ink dark:text-white">
              {product.name}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-admin-muted dark:text-slate-400">
              {product.summary}
            </p>

            <div className="mt-5 flex items-center justify-between gap-3">
              <strong className="text-lg text-admin-ink dark:text-white">{product.priceLabel}</strong>
              <a
                className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700"
                href={product.affiliateUrl}
                rel="nofollow sponsored noopener"
                target="_blank"
              >
                Check Price
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
