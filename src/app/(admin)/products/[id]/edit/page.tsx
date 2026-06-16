import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "@/lib/admin/routes";

type Props = { params: Promise<{ id: string }> };

export default async function LegacyEditProductPage({ params }: Props) {
  const { id } = await params;
  redirect(ADMIN_ROUTES.editProduct(id));
}
