import { db } from "./cf";

export type OrderRow = {
  id: number;
  public_token: string;
  status: string;
  fulfillment: string;
  due_date: string | null;
  delivery_address: string | null;
  gift_message: string | null;
  gift_from: string | null;
  notes: string | null;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  payment_mode: string;
  payment_status: string;
  created_at: string;
};

export type OrderItemRow = { name: string; unit_price_cents: number; quantity: number };

export async function getOrderByToken(token: string) {
  const order = await db().prepare("SELECT * FROM orders WHERE public_token = ?").bind(token).first<OrderRow>();
  if (!order) return null;
  const { results } = await db()
    .prepare("SELECT name, unit_price_cents, quantity FROM order_items WHERE order_id = ? ORDER BY id")
    .bind(order.id)
    .all<OrderItemRow>();
  return { order, items: results };
}

/** Cancels an order and puts its items back in stock. Safe to call twice. */
export async function cancelAndRestock(orderId: number, status: "cancelled" | "declined" = "cancelled") {
  const d = db();
  const res = await d
    .prepare(
      "UPDATE orders SET status = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ? AND status NOT IN ('cancelled','declined')",
    )
    .bind(status, orderId)
    .run();
  if (!res.meta.changes) return;
  const { results } = await d
    .prepare("SELECT product_id, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL")
    .bind(orderId)
    .all<{ product_id: number; quantity: number }>();
  await d.batch(
    results.map((i) =>
      d
        .prepare("UPDATE products SET stock_remaining = stock_remaining + ? WHERE id = ? AND stock_remaining IS NOT NULL")
        .bind(i.quantity, i.product_id),
    ),
  );
}

export const STATUS_LABEL: Record<string, string> = {
  awaiting_approval: "Waiting for our OK",
  new: "Received",
  in_progress: "Being made",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
};
