import { listShopProducts } from "@/lib/products";
import { ProductCard } from "../ProductCard";

export default async function ShopAll() {
  const products = await listShopProducts();
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-bold">Shop everything</h1>
      {products.length === 0 ? (
        <p className="text-ink-soft">Our menu is being updated. Please check back soon.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
