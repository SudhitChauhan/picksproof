import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

export default function LegacyNewProductPage() {
  redirect(ADMIN_ROUTES.addProduct);
}
