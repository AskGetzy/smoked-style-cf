"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { getCart, type CartLine } from "@/lib/cart";
import { formatCents } from "@/lib/format";
import { calcTax } from "@/lib/tax";
import { placeOrder, type CheckoutState } from "./actions";

type Item = { id: number; name: string; price_cents: number; taxable: boolean; needs_approval: boolean };

export function CheckoutForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [items, setItems] = useState<Map<number, Item>>(new Map());
  const [fulfillment, setFulfillment] = useState("pickup");

  useEffect(() => {
    const local = getCart();
    queueMicrotask(() => setLines(local));
    if (local.length === 0) return;
    fetch("/api/cart", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: local.map((l) => l.id) }),
    })
      .then((r) => r.json() as Promise<{ items: Item[] }>)
      .then((d) => setItems(new Map(d.items.map((i) => [i.id, i]))))
      .catch(() => {});
  }, []);

  if (lines === null) return <p className="text-ink-soft">Loading…</p>;
  const live = lines.filter((l) => items.has(l.id));
  if (lines.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4 text-ink-soft">Your cart is empty.</p>
        <Link href="/" className="btn-primary">Browse the menu</Link>
      </div>
    );
  }
  if (live.length === 0) return <p className="text-ink-soft">Loading…</p>;

  const subtotal = live.reduce((n, l) => n + l.qty * items.get(l.id)!.price_cents, 0);
  const taxable = live.reduce((n, l) => (items.get(l.id)!.taxable ? n + l.qty * items.get(l.id)!.price_cents : n), 0);
  const tax = calcTax(taxable);
  const v = state.values;
  const val = (k: string) => v?.[k] ?? "";

  return (
    <form action={formAction} className="space-y-6">
      {state.error && <p className="rounded-lg bg-ember/10 px-4 py-3 text-sm text-ember">{state.error}</p>}
      <input type="hidden" name="cart" value={JSON.stringify(lines)} />

      <div key={state.values ? "retry" : "first"} className="space-y-6">
        <section className="card space-y-4 p-4 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Your details</h2>
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" name="name" required autoComplete="name" defaultValue={val("name")} className="field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" defaultValue={val("email")} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" defaultValue={val("phone")} className="field" />
            </div>
          </div>
        </section>

        <section className="card space-y-4 p-4 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Pickup or delivery</h2>
          <div className="flex gap-3">
            {["pickup", "delivery"].map((o) => (
              <label key={o} className="flex items-center gap-2">
                <input type="radio" name="fulfillment" value={o} checked={fulfillment === o} onChange={() => setFulfillment(o)} />
                {o === "pickup" ? "Pickup" : "Delivery"}
              </label>
            ))}
          </div>
          {fulfillment === "delivery" && (
            <div>
              <label className="label" htmlFor="address">Delivery address</label>
              <input id="address" name="address" required defaultValue={val("address")} className="field" />
            </div>
          )}
          <div>
            <label className="label" htmlFor="due_date">Date you want it</label>
            <input id="due_date" name="due_date" type="date" required min={today} defaultValue={val("due_date")} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="gift_message">Gift message (optional)</label>
            <input id="gift_message" name="gift_message" defaultValue={val("gift_message")} className="field" />
          </div>
          <div>
            <label className="label" htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" name="notes" rows={2} defaultValue={val("notes")} className="field" />
          </div>
        </section>
      </div>

      <section className="card space-y-2 p-4 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Order summary</h2>
        <ul className="divide-y divide-line text-sm">
          {live.map((l) => {
            const it = items.get(l.id)!;
            return (
              <li key={l.id} className="flex justify-between py-2">
                <span>{l.qty} × {it.name}</span>
                <span>{formatCents(l.qty * it.price_cents)}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCents(subtotal)}</span></div>
        <div className="flex justify-between"><span>Sales tax</span><span>{formatCents(tax)}</span></div>
        <div className="flex justify-between text-lg font-medium"><span>Total</span><span>{formatCents(subtotal + tax)}</span></div>
        {live.some((l) => items.get(l.id)!.needs_approval) && (
          <p className="text-sm text-warn">Your order includes a by-request item. We confirm it before it&apos;s final.</p>
        )}
        <button type="submit" disabled={pending} className="btn-primary mt-2 w-full">
          {pending ? "Placing order…" : "Continue to payment"}
        </button>
      </section>
    </form>
  );
}
