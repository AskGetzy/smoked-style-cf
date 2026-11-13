import Link from "next/link";
import { formatCents } from "@/lib/format";
import { photoUrl, stockState, type ShopProduct } from "@/lib/products";

export function StockBadge({ p }: { p: Pick<ShopProduct, "stock_remaining" | "low_stock_at"> }) {
  const s = stockState(p);
  if (s.kind === "sold_out") return <span className="badge bg-ember/15 text-ember">Sold out</span>;
  if (s.kind === "low") return <span className="badge bg-warn/15 text-warn">Only {s.left} left</span>;
  return null;
}

export function ProductCard({ p }: { p: ShopProduct }) {
  const thumb = p.photo_keys[0];
  const soldOut = stockState(p).kind === "sold_out";
  return (
    <Link href={`/p/${p.slug}`} className="card group block overflow-hidden transition hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden bg-parchment-dark">
        {thumb ? (
          <img
            src={photoUrl(thumb)}
            alt={p.name}
            className={`h-full w-full object-cover transition group-hover:scale-105 ${soldOut ? "opacity-60" : ""}`}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-parchment-dark text-ink-soft/40"><svg aria-hidden="true" width="40%" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 25 H37 A5 6 0 0 1 37 37 H14" /><ellipse cx="14" cy="31" rx="5" ry="6" /><path d="M8 43 H42" /></svg></div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <h3 className="font-medium leading-snug">{p.name}</h3>
        <p className="text-sm text-ink-soft">
          {formatCents(p.price_cents)}
          {p.unit_label && <span> &middot; {p.unit_label}</span>}
        </p>
        <div className="flex flex-wrap gap-1">
          <StockBadge p={p} />
          {p.needs_approval && <span className="badge bg-parchment-dark text-ink">By request</span>}
        </div>
      </div>
    </Link>
  );
}
