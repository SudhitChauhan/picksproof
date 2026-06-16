export const ADMIN_ROUTES = {
  dashboard: "/admin/dashboard",
  catalog: "/admin/catalog",
  addProduct: "/admin/products/new",
  editProduct: (id: string) => `/admin/products/${id}/edit`,
  profile: "/admin/profile"
} as const;

export function isAdminAppPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/products");
}
