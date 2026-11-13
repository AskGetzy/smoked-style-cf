import { notFound } from "next/navigation";
import { listCategories, listShopProducts } from "@/lib/products";
import { ProductCard } from "../../ProductCard";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categories = await listCategories();
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();
  const products = await listShopProducts(category);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <h1 className="font-display text-3xl font-bold">{cat.name}</h1>
      {products.length === 0 ? (
        <p className="text-ink-soft">Nothing here right now. Please check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
