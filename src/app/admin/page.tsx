import { redirect } from "next/navigation";

// The orders dashboard lands here in step 5. Until then, start on products.
export default function AdminHome() {
  redirect("/admin/products");
}
