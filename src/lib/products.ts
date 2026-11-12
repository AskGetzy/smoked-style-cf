import { db } from "./cf";

export type Category = { id: number; name: string; slug: string; sort_order: number };

export type Product = {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  unit_label: string;
  photo_keys: string[];
  sort_order: number;
  active: boolean;
  needs_approval: boolean;
  max_per_order: number | null;
  stock_remaining: number | null;
  low_stock_at: number;
  taxable: boolean;
  order_count: number;
  updated_at: string;
};

type ProductRow = Omit<Product, "photo_keys" | "active" | "needs_approval" | "taxable"> & {
  photo_keys: string;
  active: number;
  needs_approval: number;
  taxable: number;
};

function fromRow(r: ProductRow): Product {
  let keys: string[] = [];
  try {
    keys = JSON.parse(r.photo_keys);
  } catch {}
  return {
    ...r,
    photo_keys: Array.isArray(keys) ? keys : [],
    active: r.active === 1,
    needs_approval: r.needs_approval === 1,
    taxable: r.taxable === 1,
  };
}

export async function listCategories(): Promise<Category[]> {
  const { results } = await db()
    .prepare("SELECT id, name, slug, sort_order FROM categories ORDER BY sort_order, name")
    .all<Category>();
  return results;
}

export async function listProducts(): Promise<(Product & { category_name: string | null })[]> {
  const { results } = await db()
    .prepare(
      `SELECT p.*, c.name AS category_name
         FROM products p LEFT JOIN categories c ON c.id = p.category_id
        ORDER BY c.sort_order, p.sort_order, p.name`,
    )
    .all<ProductRow & { category_name: string | null }>();
  return results.map((r) => ({ ...fromRow(r), category_name: r.category_name }));
}

export async function getProduct(id: number): Promise<Product | null> {
  const row = await db().prepare("SELECT * FROM products WHERE id = ?").bind(id).first<ProductRow>();
  return row ? fromRow(row) : null;
}

/** What the shop shows for stock, used by admin badges now and the storefront later. */
export function stockState(p: Pick<Product, "stock_remaining" | "low_stock_at">):
  | { kind: "unlimited" }
  | { kind: "in_stock"; left: number }
  | { kind: "low"; left: number }
  | { kind: "sold_out" } {
  if (p.stock_remaining === null) return { kind: "unlimited" };
  if (p.stock_remaining <= 0) return { kind: "sold_out" };
  if (p.stock_remaining <= p.low_stock_at) return { kind: "low", left: p.stock_remaining };
  return { kind: "in_stock", left: p.stock_remaining };
}

export function photoUrl(key: string): string {
  return `/img/${key}`;
}
