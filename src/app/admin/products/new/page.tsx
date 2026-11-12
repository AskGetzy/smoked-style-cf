import { listCategories } from "@/lib/products";
import { requireStaff } from "@/lib/session";
import { createProduct } from "../actions";
import { ProductForm } from "../ProductForm";

export default async function NewProductPage() {
  await requireStaff(["boss", "admin"]);
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Add item</h1>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
