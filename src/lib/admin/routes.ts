export const ADMIN_ROUTES = {
  dashboard: "/admin/dashboard",
  catalog: "/admin/catalog",
  addProduct: "/admin/products/new",
  editProduct: (id: string) => `/admin/products/${id}/edit`,
  profile: "/admin/profile"
} as const;

/** Admin-only product management paths (public PDP lives at /products/[slug]). */
export function isProtectedProductsPath(pathname: string) {
  if (!pathname.startsWith("/products")) return false;
  if (pathname === "/products") return true;
  if (pathname === "/products/new") return true;
  return /^\/products\/[^/]+\/edit$/.test(pathname);
}

export function isAdminAppPath(pathname: string) {
  return pathname.startsWith("/admin") || isProtectedProductsPath(pathname);
}
