import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

export default function LegacyProductsPage() {
  redirect(ADMIN_ROUTES.dashboard);
}
