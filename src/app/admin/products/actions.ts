"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, photos } from "@/lib/cf";
import { parseDollars, slugify } from "@/lib/format";
import { getProduct } from "@/lib/products";
import { requireStaff } from "@/lib/session";

export type FormState = { error?: string; values?: Record<string, string>; attempt?: number };

/** Echo the typed values back so a failed save doesn't wipe the form (React resets it after an action). */
function failed(error: string, f: FormData): FormState {
  const values: Record<string, string> = {};
  for (const [k, v] of f.entries()) if (typeof v === "string") values[k] = v;
  return { error, values, attempt: Date.now() };
}

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
};

type ParsedProduct = {
  name: string;
  category_id: number | null;
  description: string;
  price_cents: number;
  unit_label: string;
  sort_order: number;
  active: number;
  needs_approval: number;
  max_per_order: number | null;
  stock_remaining: number | null;
  low_stock_at: number;
  taxable: number;
};

/** Blank → null; otherwise a whole number ≥ min, or an error message. */
function optionalInt(raw: FormDataEntryValue | null, label: string, min: number): number | null | string {
  const s = String(raw ?? "").trim();
  if (s === "") return null;
  if (!/^\d+$/.test(s) || Number(s) < min) return `${label} must be a whole number of at least ${min}, or left blank.`;
  return Number(s);
}

function parse(f: FormData): ParsedProduct | string {
  const name = String(f.get("name") ?? "").trim();
  if (!name) return "Name is required.";

  const price = parseDollars(String(f.get("price") ?? ""));
  if (price === null) return "Price must be an amount like 24.99.";

  const max = optionalInt(f.get("max_per_order"), "Max per order", 1);
  if (typeof max === "string") return max;
  const stock = optionalInt(f.get("stock_remaining"), "Stock", 0);
  if (typeof stock === "string") return stock;
  const low = optionalInt(f.get("low_stock_at"), "Low-stock warning", 0);
  if (typeof low === "string") return low;
  const sort = optionalInt(f.get("sort_order"), "Sort order", 0);
  if (typeof sort === "string") return sort;

  const cat = String(f.get("category_id") ?? "");
  return {
    name,
    category_id: cat ? Number(cat) : null,
    description: String(f.get("description") ?? "").trim(),
    price_cents: price,
    unit_label: String(f.get("unit_label") ?? "").trim(),
    sort_order: sort ?? 0,
    active: f.get("active") === "on" ? 1 : 0,
    needs_approval: f.get("needs_approval") === "on" ? 1 : 0,
    max_per_order: max,
    stock_remaining: stock,
    low_stock_at: low ?? 5,
    taxable: f.get("taxable") === "on" ? 1 : 0,
  };
}

async function uniqueSlug(name: string, exceptId?: number): Promise<string> {
  const base = slugify(name) || "item";
  let slug = base;
  for (let i = 2; ; i++) {
    const hit = await db()
      .prepare("SELECT id FROM products WHERE slug = ? AND id != ?")
      .bind(slug, exceptId ?? -1)
      .first();
    if (!hit) return slug;
    slug = `${base}-${i}`;
  }
}

/** Uploads new photos to R2 and returns their keys. Skips empty file inputs. */
async function uploadPhotos(productId: number, f: FormData): Promise<string[] | string> {
  const files = f.getAll("photos").filter((v): v is File => v instanceof File && v.size > 0);
  const keys: string[] = [];
  for (const file of files) {
    const ext = PHOTO_TYPES[file.type];
    if (!ext) return `"${file.name}" isn't a JPG, PNG, WEBP or HEIC photo.`;
    if (file.size > MAX_PHOTO_BYTES) return `"${file.name}" is over 8 MB.`;
    const key = `products/${productId}/${crypto.randomUUID()}.${ext}`;
    await photos().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    keys.push(key);
  }
  return keys;
}

export async function createProduct(_prev: FormState, f: FormData): Promise<FormState> {
  await requireStaff(["boss", "admin"]);
  const p = parse(f);
  if (typeof p === "string") return failed(p, f);

  const slug = await uniqueSlug(p.name);
  const row = await db()
    .prepare(
      `INSERT INTO products
        (name, slug, category_id, description, price_cents, unit_label, sort_order,
         active, needs_approval, max_per_order, stock_remaining, low_stock_at, taxable)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    )
    .bind(
      p.name, slug, p.category_id, p.description, p.price_cents, p.unit_label, p.sort_order,
      p.active, p.needs_approval, p.max_per_order, p.stock_remaining, p.low_stock_at, p.taxable,
    )
    .first<{ id: number }>();
  if (!row) return failed("Couldn't save. Try again.", f);

  const keys = await uploadPhotos(row.id, f);
  if (typeof keys === "string") {
    revalidatePath("/admin/products");
    redirect(`/admin/products/${row.id}?photoError=${encodeURIComponent(keys)}`);
  }
  if (keys.length) {
    await db().prepare("UPDATE products SET photo_keys = ? WHERE id = ?").bind(JSON.stringify(keys), row.id).run();
  }

  revalidatePath("/admin/products");
  redirect(`/admin/products/${row.id}?created=1`);
}

export async function updateProduct(id: number, _prev: FormState, f: FormData): Promise<FormState> {
  await requireStaff(["boss", "admin"]);
  const existing = await getProduct(id);
  if (!existing) return { error: "This product no longer exists." };

  const p = parse(f);
  if (typeof p === "string") return failed(p, f);

  const removed = new Set(f.getAll("remove_photo").map(String));
  const added = await uploadPhotos(id, f);
  if (typeof added === "string") return failed(added, f);

  const kept = existing.photo_keys.filter((k) => !removed.has(k));
  const slug = p.name === existing.name ? existing.slug : await uniqueSlug(p.name, id);

  await db()
    .prepare(
      `UPDATE products SET
         name = ?, slug = ?, category_id = ?, description = ?, price_cents = ?, unit_label = ?,
         sort_order = ?, photo_keys = ?, active = ?, needs_approval = ?, max_per_order = ?,
         stock_remaining = ?, low_stock_at = ?, taxable = ?,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       WHERE id = ?`,
    )
    .bind(
      p.name, slug, p.category_id, p.description, p.price_cents, p.unit_label, p.sort_order,
      JSON.stringify([...kept, ...added]), p.active, p.needs_approval, p.max_per_order,
      p.stock_remaining, p.low_stock_at, p.taxable, id,
    )
    .run();

  // Delete removed photos after the row no longer points at them.
  const toDelete = existing.photo_keys.filter((k) => removed.has(k));
  if (toDelete.length) await photos().delete(toDelete);

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  // Redirect (not just return) so the form reloads clean: no stale file picks or remove ticks.
  redirect(`/admin/products/${id}?saved=1`);
}

export async function deleteProduct(id: number): Promise<void> {
  await requireStaff(["boss", "admin"]);
  const existing = await getProduct(id);
  if (existing) {
    await db().prepare("DELETE FROM products WHERE id = ?").bind(id).run();
    if (existing.photo_keys.length) await photos().delete(existing.photo_keys);
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

/** One-tap controls from the product list (any staff role, so the kitchen can mark sold out). */
export async function setActive(id: number, active: boolean): Promise<void> {
  await requireStaff();
  await db()
    .prepare("UPDATE products SET active = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
    .bind(active ? 1 : 0, id)
    .run();
  revalidatePath("/admin/products");
}

export async function markSoldOut(id: number): Promise<void> {
  await requireStaff();
  await db()
    .prepare("UPDATE products SET stock_remaining = 0, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
    .bind(id)
    .run();
  revalidatePath("/admin/products");
}
