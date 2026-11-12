"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/products";
import type { FormState } from "./actions";

type Props = {
  categories: Category[];
  product?: Product;
  action: (prev: FormState, f: FormData) => Promise<FormState>;
  notice?: string;
};

export function ProductForm({ categories, product, action, notice }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const [limitStock, setLimitStock] = useState(product ? product.stock_remaining !== null : false);
  const [limitPerOrder, setLimitPerOrder] = useState(product ? product.max_per_order !== null : false);
  const [previews, setPreviews] = useState<string[]>([]);

  // After a failed save, refill with what was typed (React clears the form after an action).
  const v = state.values;
  const text = (name: string, fallback: string | number | null | undefined) =>
    v ? (v[name] ?? "") : (fallback ?? "");
  const check = (name: string, fallback: boolean) => (v ? v[name] === "on" : fallback);

  return (
    <form action={formAction} className="space-y-6">
      {notice && <p className="rounded-lg bg-ok/10 px-4 py-3 text-sm text-ok">{notice}</p>}
      {state.error && <p className="rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember">{state.error}</p>}

      <div key={state.attempt ?? 0} className="space-y-6">
      {/* ── Details ── */}
      <section className="card space-y-4 p-4 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Details</h2>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required defaultValue={text("name", product?.name)} className="field" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">Price ($)</label>
            <input
              id="price"
              name="price"
              required
              inputMode="decimal"
              placeholder="24.99"
              defaultValue={text("price", product ? (product.price_cents / 100).toFixed(2) : "")}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="unit_label">Unit</label>
            <input
              id="unit_label"
              name="unit_label"
              placeholder="per lb, 8 oz bag…"
              defaultValue={text("unit_label", product?.unit_label)}
              className="field"
            />
          </div>
          <div>
            <label className="label" htmlFor="category_id">Category</label>
            <select id="category_id" name="category_id" defaultValue={text("category_id", product?.category_id)} className="field">
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={text("description", product?.description)}
            className="field"
          />
        </div>
        <div className="sm:w-40">
          <label className="label" htmlFor="sort_order">Sort order</label>
          <input
            id="sort_order"
            name="sort_order"
            inputMode="numeric"
            defaultValue={text("sort_order", product?.sort_order ?? 0)}
            className="field"
          />
          <p className="mt-1 text-xs text-ink-soft">Lower shows first.</p>
        </div>
      </section>

      {/* ── Photos ── */}
      <section className="card space-y-4 p-4 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Photos</h2>
        {product && product.photo_keys.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {product.photo_keys.map((k, i) => (
              <label key={k} className="group relative block cursor-pointer">
                <img src={`/img/${k}`} alt="" className="aspect-square w-full rounded-lg object-cover" />
                {i === 0 && (
                  <span className="badge absolute left-1 top-1 bg-char/80 text-parchment">Main</span>
                )}
                <span className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                  <input type="checkbox" name="remove_photo" value={k} /> Remove
                </span>
              </label>
            ))}
          </div>
        )}
        <div>
          <label className="label" htmlFor="photos">Add photos</label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            multiple
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-parchment-dark file:px-4 file:py-2 file:text-ink"
            onChange={(e) => setPreviews(Array.from(e.target.files ?? []).map((f) => URL.createObjectURL(f)))}
          />
          <p className="mt-1 text-xs text-ink-soft">JPG, PNG, WEBP or HEIC, up to 8 MB each. The first photo is the main one.</p>
        </div>
        {previews.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {previews.map((src) => (
              <img key={src} src={src} alt="" className="aspect-square w-full rounded-lg object-cover opacity-80" />
            ))}
          </div>
        )}
      </section>

      {/* ── Item controls ── */}
      <section className="card space-y-5 p-4 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Item controls</h2>

        <Toggle
          name="active"
          label="Show in shop"
          hint="Off hides this item from customers."
          defaultChecked={check("active", product?.active ?? true)}
        />
        <Toggle
          name="needs_approval"
          label="Needs approval"
          hint="Orders with this item wait for your yes or no. The card is only held until you approve."
          defaultChecked={check("needs_approval", product?.needs_approval ?? false)}
        />
        <Toggle
          name="taxable"
          label="Taxable"
          hint="Adds sales tax for this item at checkout."
          defaultChecked={check("taxable", product?.taxable ?? true)}
        />

        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={limitPerOrder}
              onChange={(e) => setLimitPerOrder(e.target.checked)}
              className="h-5 w-5 shrink-0 accent-ember"
            />
            <span className="font-medium">Limit per order</span>
          </label>
          {limitPerOrder ? (
            <div className="ml-8 sm:w-48">
              <label className="label" htmlFor="max_per_order">Max quantity per order</label>
              <input
                id="max_per_order"
                name="max_per_order"
                inputMode="numeric"
                required
                defaultValue={text("max_per_order", product?.max_per_order ?? 1) || 1}
                className="field"
              />
            </div>
          ) : (
            <input type="hidden" name="max_per_order" value="" />
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={limitStock}
              onChange={(e) => setLimitStock(e.target.checked)}
              className="h-5 w-5 shrink-0 accent-ember"
            />
            <span className="font-medium">Limited stock</span>
          </label>
          {limitStock ? (
            <div className="ml-8 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="stock_remaining">Units left to sell</label>
                <input
                  id="stock_remaining"
                  name="stock_remaining"
                  inputMode="numeric"
                  required
                  defaultValue={text("stock_remaining", product?.stock_remaining ?? 20) || 20}
                  className="field"
                />
                <p className="mt-1 text-xs text-ink-soft">Counts down with each order. 0 shows Sold out.</p>
              </div>
              <div>
                <label className="label" htmlFor="low_stock_at">Show &ldquo;Only N left&rdquo; at</label>
                <input
                  id="low_stock_at"
                  name="low_stock_at"
                  inputMode="numeric"
                  defaultValue={text("low_stock_at", product?.low_stock_at ?? 5)}
                  className="field"
                />
              </div>
            </div>
          ) : (
            <>
              <input type="hidden" name="stock_remaining" value="" />
              <input type="hidden" name="low_stock_at" value={product?.low_stock_at ?? 5} />
            </>
          )}
        </div>
      </section>

      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : product ? "Save changes" : "Add item"}
        </button>
        <Link href="/admin/products" className="btn-ghost">
          Back
        </Link>
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-5 w-5 shrink-0 accent-ember" />
      <span>
        <span className="block font-medium">{label}</span>
        <span className="block text-sm text-ink-soft">{hint}</span>
      </span>
    </label>
  );
}
