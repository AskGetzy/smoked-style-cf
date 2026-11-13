"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, removeLine, setQty, type CartLine } from "@/lib/cart";
import { formatCents } from "@/lib/format";

type Item = {
  id: number;
  name: string;
  slug: string;
  price_cents: number;
  unit_label: string;
  photo: string | null;
  needs_approval: boolean;
  max: number;
  sold_out: boolean;
};

export function CartView() {
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [items, setItems] = useState<Map<number, Item>>(new Map());
  const [failed, setFailed] = useState(false);

  // Load the cart, then ask the server for current prices and limits.
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
      .then((d: { items: Item[] }) => {
        const map = new Map(d.items.map((i) => [i.id, i]));
        setItems(map);
        // Drop anything no longer sold, and trim quantities to what is available now.
        for (const l of local) {
          const it = map.get(l.id);
          if (!it || it.sold_out || it.max === 0) removeLine(l.id);
          else if (l.qty > it.max) setQty(l.id, it.max);
        }
        setLines(getCart());
      })
      .catch(() => setFailed(true));
  }, []);

  if (lines === null) return <p className="text-ink-soft">Loading…</p>;
  if (failed) return <p className="text-ember">Couldn&apos;t load your cart. Please refresh.</p>;

  const live = lines.filter((l) => items.has(l.id));
  if (lines.length === 0 || (items.size > 0 && live.length === 0)) {
    return (
      <div className="card p-8 text-center">
        <p className="mb-4 text-ink-soft">Your cart is empty.</p>
        <Link href="/" className="btn-primary">
          Browse the menu
        </Link>
      </div>
    );
  }
  if (items.size === 0) return <p className="text-ink-soft">Loading…</p>;

  const subtotal = live.reduce((n, l) => n + l.qty * (items.get(l.id)?.price_cents ?? 0), 0);
  const hasApproval = live.some((l) => items.get(l.id)?.needs_approval);

  function change(id: number, qty: number) {
    if (qty <= 0) removeLine(id);
    else setQty(id, qty);
    setLines(getCart());
  }

  return (
    <div className="space-y-4">
      <ul className="card divide-y divide-line">
        {live.map((l) => {
          const it = items.get(l.id)!;
          return (
            <li key={l.id} className="flex gap-3 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-parchment-dark">
                {it.photo && <img src={`/img/${it.photo}`} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/p/${it.slug}`} className="font-medium hover:underline">
                  {it.name}
                </Link>
                <p className="text-sm text-ink-soft">
                  {formatCents(it.price_cents)}
                  {it.unit_label && ` · ${it.unit_label}`}
                </p>
                {it.needs_approval && <span className="badge bg-warn/15 text-warn">By request</span>}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-line bg-paper text-sm">
                    <button className="px-3 py-1.5" aria-label="Less" onClick={() => change(l.id, l.qty - 1)}>
                      &minus;
                    </button>
                    <span className="w-6 text-center">{l.qty}</span>
                    <button
                      className="px-3 py-1.5 disabled:opacity-40"
                      aria-label="More"
                      disabled={l.qty >= it.max}
                      onClick={() => change(l.id, l.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button className="text-sm text-ink-soft underline" onClick={() => change(l.id, 0)}>
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-medium">{formatCents(l.qty * it.price_cents)}</div>
            </li>
          );
        })}
      </ul>

      <div className="card space-y-3 p-4">
        <div className="flex justify-between text-lg">
          <span>Subtotal</span>
          <span className="font-medium">{formatCents(subtotal)}</span>
        </div>
        <p className="text-sm text-ink-soft">Sales tax is added at checkout.</p>
        {hasApproval && (
          <p className="text-sm text-warn">
            Your order includes a by-request item. We confirm it before your card is charged.
          </p>
        )}
        <Link href="/checkout" className="btn-primary w-full text-center">
          Checkout
        </Link>
      </div>
    </div>
  );
}
