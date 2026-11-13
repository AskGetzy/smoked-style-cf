import Link from "next/link";
import { listCategories, listShopProducts } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export default async function Home() {
  const [categories, products] = await Promise.all([listCategories(), listShopProducts()]);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <section className="rounded-2xl bg-char px-6 py-10 text-center text-parchment sm:py-14">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Smoked Style</h1>
        <p className="mx-auto mt-3 max-w-md text-parchment/80">
          Slow-smoked meats, jerky, steaks and party boards.
        </p>
      </section>

      {products.length === 0 && (
        <p className="py-10 text-center text-ink-soft">Our menu is being updated. Please check back soon.</p>
      )}

      {categories.map((c) => {
        const items = products.filter((p) => p.category_slug === c.slug);
        if (items.length === 0) return null;
        return (
          <section key={c.id} className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
              <Link href={`/shop/${c.slug}`} className="text-sm text-ember underline">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.slice(0, 4).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
