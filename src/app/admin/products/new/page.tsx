import { redirect } from "next/navigation";

export default function AdminNewProductRedirect() {
  redirect("/products/new");
}
