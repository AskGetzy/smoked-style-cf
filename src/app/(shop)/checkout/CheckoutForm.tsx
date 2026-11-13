"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { getCart, type CartLine } from "@/lib/cart";
import { formatCents } from "@/lib/format";
import { calcTax } from "@/lib/tax";
import { GIFT_FROM_MAX, GIFT_MESSAGE_MAX } from "@/lib/zpl";
import { placeOrder, type CheckoutState } from "./actions";

type Item = { id: number; name: string; price_cents: number; taxable: boolean; needs_approval: boolean };

export function CheckoutForm({ today }: { today: string }) {
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [items, setItems] = useState<Map<number, Item>>(new Map());
  const [fulfillment, setFulfillment] = useState("pickup");
  const [giftMsg, setGiftMsg] = useState("");
  const [giftFrom, setGiftFrom] = useState("");

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
        </section>

        <section className="card space-y-4 p-4 sm:p-6">
          <h2 className="font-display text-xl font-semibold">Gift note (optional)</h2>
          <p className="text-sm text-ink-soft">We print your message on a card and pack it in the box.</p>
          <div>
            <label className="label" htmlFor="gift_message">Your message</label>
            <textarea
              id="gift_message"
              name="gift_message"
              rows={3}
              maxLength={GIFT_MESSAGE_MAX}
              value={giftMsg}
              onChange={(e) => setGiftMsg(e.target.value)}
              placeholder="Happy Chanukah! Enjoy."
              className="field"
            />
            <p className="mt-1 text-right text-xs text-ink-soft">{giftMsg.length} / {GIFT_MESSAGE_MAX}</p>
          </div>
          <div>
            <label className="label" htmlFor="gift_from">From</label>
            <input
              id="gift_from"
              name="gift_from"
              maxLength={GIFT_FROM_MAX}
              value={giftFrom}
              onChange={(e) => setGiftFrom(e.target.value)}
              placeholder="Your name"
              className="field"
            />
          </div>
          {giftMsg.trim() && (
            <div className="mx-auto w-full max-w-xs rounded-md border-t-4 border-fire bg-parchment p-6 text-center shadow-md">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">A gift for you</p>
              <p className="mt-3 whitespace-pre-line font-display text-lg italic leading-snug">{giftMsg}</p>
              {giftFrom.trim() && <p className="mt-3 text-sm text-ink-soft">&mdash; {giftFrom}</p>}
            </div>
          )}
        </section>

        <section className="card space-y-4 p-4 sm:p-6">
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
