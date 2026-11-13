import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCents } from "@/lib/format";
import { getShopProduct, maxOrderable, photoUrl, stockState } from "@/lib/products";
import { StockBadge } from "../../ProductCard";
import { AddToCart } from "./AddToCart";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getShopProduct(slug);
  if (!p) notFound();

  const soldOut = stockState(p).kind === "sold_out";
  const max = maxOrderable(p);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {p.category_slug && (
        <Link href={`/shop/${p.category_slug}`} className="text-sm text-ink-soft underline">
          &larr; {p.category_name}
        </Link>
      )}
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-parchment-dark">
            {p.photo_keys[0] ? (
              <img src={photoUrl(p.photo_keys[0])} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-parchment-dark text-ink-soft/40"><svg aria-hidden="true" width="40%" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 25 H37 A5 6 0 0 1 37 37 H14" /><ellipse cx="14" cy="31" rx="5" ry="6" /><path d="M8 43 H42" /></svg></div>
            )}
          </div>
          {p.photo_keys.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {p.photo_keys.slice(1, 5).map((k) => (
                <img key={k} src={photoUrl(k)} alt="" className="aspect-square rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="font-display text-3xl font-bold">{p.name}</h1>
          <p className="text-2xl">
            {formatCents(p.price_cents)}
            {p.unit_label && <span className="text-base text-ink-soft"> &middot; {p.unit_label}</span>}
          </p>
          <StockBadge p={p} />
          {p.description && <p className="whitespace-pre-line text-ink-soft">{p.description}</p>}

          {p.needs_approval && (
            <p className="rounded-lg bg-warn/10 px-4 py-3 text-sm text-warn">
              This item is by request. We confirm your order before your card is charged.
            </p>
          )}
          {p.max_per_order !== null && (
            <p className="text-sm text-ink-soft">Limit {p.max_per_order} per order.</p>
          )}

          {soldOut ? (
            <button disabled className="btn-primary w-full sm:w-auto">
              Sold out
            </button>
          ) : (
            <AddToCart id={p.id} max={max} />
          )}
        </div>
      </div>
    </div>
  );
}
