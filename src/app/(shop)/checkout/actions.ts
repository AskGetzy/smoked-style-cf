"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/cf";
import { paymentUrl } from "@/lib/payments";
import { getShopProductsByIds, maxOrderable } from "@/lib/products";
import { GIFT_FROM_MAX, GIFT_MESSAGE_MAX } from "@/lib/zpl";
import { calcTax, daysUntil, HOLD_WINDOW_DAYS } from "@/lib/tax";

export type CheckoutState = { error?: string; values?: Record<string, string> };

export async function placeOrder(_prev: CheckoutState, f: FormData): Promise<CheckoutState> {
  const get = (k: string) => String(f.get(k) ?? "").trim();
  const values = Object.fromEntries(
    ["name", "email", "phone", "fulfillment", "address", "due_date", "notes", "gift_message", "gift_from", "cart"].map((k) => [k, get(k)]),
  );
  const fail = (error: string): CheckoutState => ({ error, values });

  const email = get("email").toLowerCase();
  if (!get("name")) return fail("Please enter your name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Please enter a valid email so we can send your receipt.");
  if (get("phone").replace(/\D/g, "").length < 10) return fail("Please enter a phone number we can reach you on.");
  const fulfillment = get("fulfillment") === "delivery" ? "delivery" : "pickup";
  if (fulfillment === "delivery" && !get("address")) return fail("Please enter your delivery address.");
  const due = get("due_date");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due) || daysUntil(due) < 0) return fail("Please pick a date that isn't in the past.");

  let cart: { id: number; qty: number }[] = [];
  try {
    const parsed: unknown = JSON.parse(get("cart"));
    if (Array.isArray(parsed)) {
      cart = parsed
        .filter((l): l is { id: number; qty: number } => Number.isInteger(l?.id) && Number.isInteger(l?.qty) && l.qty > 0)
        .slice(0, 50);
    }
  } catch {}
  if (cart.length === 0) return fail("Your cart is empty.");

  const products = await getShopProductsByIds(cart.map((l) => l.id));
  const byId = new Map(products.map((p) => [p.id, p]));
  for (const l of cart) {
    const p = byId.get(l.id);
    if (!p) return fail("An item in your cart is no longer available. Please review your cart.");
    if (l.qty > maxOrderable(p)) {
      return fail(`Sorry, we can only do ${maxOrderable(p)} of ${p.name} right now. Please update your cart.`);
    }
  }

  // Reserve stock first. Each update only succeeds if enough is left, so two people can't oversell.
  const d = db();
  const reserved: { id: number; qty: number }[] = [];
  const release = () =>
    d.batch(
      reserved.map((r) =>
        d.prepare("UPDATE products SET stock_remaining = stock_remaining + ? WHERE id = ?").bind(r.qty, r.id),
      ),
    );
  for (const l of cart) {
    const p = byId.get(l.id)!;
    if (p.stock_remaining === null) continue;
    const res = await d
      .prepare("UPDATE products SET stock_remaining = stock_remaining - ? WHERE id = ? AND stock_remaining >= ?")
      .bind(l.qty, l.id, l.qty)
      .run();
    if (!res.meta.changes) {
      if (reserved.length) await release();
      return fail(`Sorry, ${p.name} just sold out. Please update your cart.`);
    }
    reserved.push({ id: l.id, qty: l.qty });
  }

  const subtotal = cart.reduce((n, l) => n + l.qty * byId.get(l.id)!.price_cents, 0);
  const taxable = cart.reduce((n, l) => (byId.get(l.id)!.taxable ? n + l.qty * byId.get(l.id)!.price_cents : n), 0);
  const tax = calcTax(taxable);
  const needsApproval = cart.some((l) => byId.get(l.id)!.needs_approval);
  // Approval orders near the due date only hold the card (holds expire in about a week).
  // Everything else is charged now; if we later decline an approval order, we refund it.
  const mode = needsApproval && daysUntil(due) <= HOLD_WINDOW_DAYS ? "hold" : "charge";
  const token = crypto.randomUUID().replace(/-/g, "");

  try {
    const cust = await d
      .prepare(
        `INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)
         ON CONFLICT (email) WHERE email IS NOT NULL DO UPDATE SET name = excluded.name, phone = excluded.phone
         RETURNING id`,
      )
      .bind(get("name"), email, get("phone"), fulfillment === "delivery" ? get("address") : null)
      .first<{ id: number }>();

    const order = await d
      .prepare(
        `INSERT INTO orders (public_token, customer_id, status, source, fulfillment, due_date, delivery_address,
                             gift_message, gift_from, notes, subtotal_cents, tax_cents, total_cents, payment_mode)
         VALUES (?, ?, ?, 'web', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      )
      .bind(
        token,
        cust!.id,
        needsApproval ? "awaiting_approval" : "new",
        fulfillment,
        due,
        fulfillment === "delivery" ? get("address") : null,
        get("gift_message").slice(0, GIFT_MESSAGE_MAX) || null,
        get("gift_message") ? get("gift_from").slice(0, GIFT_FROM_MAX) || null : null,
        get("notes") || null,
        subtotal,
        tax,
        subtotal + tax,
        mode,
      )
      .first<{ id: number }>();

    await d.batch(
      cart.map((l) => {
        const p = byId.get(l.id)!;
        return d
          .prepare(
            "INSERT INTO order_items (order_id, product_id, name, unit_price_cents, quantity, taxable) VALUES (?, ?, ?, ?, ?, ?)",
          )
          .bind(order!.id, p.id, p.name, p.price_cents, l.qty, p.taxable ? 1 : 0);
      }),
    );
  } catch {
    if (reserved.length) await release();
    return fail("Something went wrong placing your order. Please try again.");
  }

  redirect(paymentUrl(token));
}
