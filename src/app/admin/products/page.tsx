import Link from "next/link";
import { formatCents } from "@/lib/format";
import { listProducts, photoUrl, stockState, type Product } from "@/lib/products";
import { requireStaff } from "@/lib/session";
import { markSoldOut, setActive } from "./actions";

export default async function ProductsPage() {
  const user = await requireStaff();
  const canEdit = user.role !== "staff";
  const products = await listProducts();

  const groups = new Map<string, typeof products>();
  for (const p of products) {
    const k = p.category_name ?? "No category";
    groups.set(k, [...(groups.get(k) ?? []), p]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        {canEdit && (
          <Link href="/admin/products/new" className="btn-primary">
            + Add item
          </Link>
        )}
      </div>

      {products.length === 0 && (
        <div className="card p-8 text-center text-ink-soft">
          No items yet.{" "}
          {canEdit && (
            <Link href="/admin/products/new" className="text-ember underline">
              Add the first one
            </Link>
          )}
        </div>
      )}

      {[...groups].map(([category, items]) => (
        <section key={category} className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{category}</h2>
          <ul className="card divide-y divide-line">
            {items.map((p) => (
              <ProductRow key={p.id} p={p} canEdit={canEdit} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ProductRow({ p, canEdit }: { p: Product; canEdit: boolean }) {
  const stock = stockState(p);
  const thumb = p.photo_keys[0];

  return (
    <li className="flex items-center gap-3 p-3">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-parchment-dark">
        {thumb && <img src={photoUrl(thumb)} alt="" className="h-full w-full object-cover" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {canEdit ? (
            <Link href={`/admin/products/${p.id}`} className="font-medium hover:underline">
              {p.name}
            </Link>
          ) : (
            <span className="font-medium">{p.name}</span>
          )}
          <span className="text-sm text-ink-soft">
            {formatCents(p.price_cents)}
            {p.unit_label && ` ${p.unit_label}`}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-1">
          {!p.active && <span className="badge bg-ink/10 text-ink-soft">Hidden</span>}
          {p.needs_approval && <span className="badge bg-warn/15 text-warn">Needs approval</span>}
          {p.max_per_order !== null && (
            <span className="badge bg-parchment-dark text-ink">Max {p.max_per_order}/order</span>
          )}
          {stock.kind === "sold_out" && <span className="badge bg-ember/15 text-ember">Sold out</span>}
          {stock.kind === "low" && <span className="badge bg-warn/15 text-warn">Only {stock.left} left</span>}
          {stock.kind === "in_stock" && (
            <span className="badge bg-ok/15 text-ok">{stock.left} in stock</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <form action={setActive.bind(null, p.id, !p.active)}>
          <button className="btn-ghost w-full px-3 py-1.5 text-xs">{p.active ? "Hide" : "Show"}</button>
        </form>
        {stock.kind !== "sold_out" && stock.kind !== "unlimited" && (
          <form action={markSoldOut.bind(null, p.id)}>
            <button className="btn-ghost w-full px-3 py-1.5 text-xs">Sold out</button>
          </form>
        )}
      </div>
    </li>
  );
}
