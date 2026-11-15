"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, photos } from "@/lib/cf";
import { slugify } from "@/lib/format";
import { requireStaff } from "@/lib/session";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/heic": "heic" };

function back(msg: { saved?: string; error?: string }): never {
  const q = new URLSearchParams(msg as Record<string, string>).toString();
  redirect(`/admin/categories?${q}`);
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
}

export async function updateCategory(f: FormData) {
  await requireStaff(["boss", "admin"]);
  const id = Number(f.get("id"));
  const name = String(f.get("name") ?? "").trim();
  const note = String(f.get("note") ?? "").trim().slice(0, 40);
  const sort = Number.parseInt(String(f.get("sort_order") ?? "0"), 10) || 0;
  if (!Number.isInteger(id) || !name) back({ error: "A category needs a name." });

  const row = await db().prepare("SELECT photo_key FROM categories WHERE id = ?").bind(id).first<{ photo_key: string | null }>();
  if (!row) back({ error: "That category no longer exists." });

  let photoKey = row!.photo_key;
  const file = f.get("photo");
  if (file instanceof File && file.size > 0) {
    const ext = PHOTO_TYPES[file.type];
    if (!ext) back({ error: `"${file.name}" isn't a JPG, PNG, WEBP or HEIC photo.` });
    if (file.size > MAX_PHOTO_BYTES) back({ error: `"${file.name}" is over 8 MB.` });
    const key = `categories/${id}/${crypto.randomUUID()}.${ext}`;
    await photos().put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    if (photoKey) await photos().delete(photoKey);
    photoKey = key;
  } else if (f.get("remove_photo") && photoKey) {
    await photos().delete(photoKey);
    photoKey = null;
  }

  try {
    await db().prepare("UPDATE categories SET name = ?, note = ?, sort_order = ?, photo_key = ? WHERE id = ?").bind(name, note, sort, photoKey, id).run();
  } catch {
    back({ error: `There is already a category called "${name}".` });
  }
  refresh();
  back({ saved: name });
}

export async function addCategory(f: FormData) {
  await requireStaff(["boss", "admin"]);
  const name = String(f.get("name") ?? "").trim();
  if (!name) back({ error: "Type a name for the new category." });
  const base = slugify(name) || "category";
  let slug = base;
  for (let i = 2; await db().prepare("SELECT 1 FROM categories WHERE slug = ?").bind(slug).first(); i++) slug = `${base}-${i}`;
  const max = await db().prepare("SELECT COALESCE(MAX(sort_order), 0) AS m FROM categories").first<{ m: number }>();
  try {
    await db().prepare("INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)").bind(name, slug, (max?.m ?? 0) + 1).run();
  } catch {
    back({ error: `There is already a category called "${name}".` });
  }
  refresh();
  back({ saved: name });
}
