import { notFound } from "next/navigation";
import { getProduct, listCategories } from "@/lib/products";
import { requireStaff } from "@/lib/session";
import { deleteProduct, updateProduct } from "../actions";
import { ProductForm } from "../ProductForm";
import { DeleteButton } from "./DeleteButton";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string; photoError?: string }>;
}) {
  await requireStaff(["boss", "admin"]);
  const { id } = await params;
  const { created, saved, photoError } = await searchParams;

  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();
  const [product, categories] = await Promise.all([getProduct(productId), listCategories()]);
  if (!product) notFound();

  const notice = photoError
    ? `Item added, but a photo didn't upload: ${photoError}`
    : created
      ? "Item added."
      : saved
        ? "Saved."
        : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{product.name}</h1>
        <DeleteButton action={deleteProduct.bind(null, product.id)} />
      </div>
      <ProductForm
        key={product.updated_at}
        categories={categories}
        product={product}
        action={updateProduct.bind(null, product.id)}
        notice={notice}
      />
    </div>
  );
}
