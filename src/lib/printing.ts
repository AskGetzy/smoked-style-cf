import { db } from "./cf";
import { giftCardZpl } from "./zpl";

export type PrintJob = {
  id: number;
  order_id: number | null;
  kind: string;
  status: "waiting" | "printed" | "failed";
  created_at: string;
  printed_at: string | null;
};

/** Queue the gift card for an order. Does nothing if there is no gift message, the order still
 *  awaits approval, or a card was already queued (so a page refresh can't print it twice). */
export async function enqueueGiftCard(orderId: number): Promise<void> {
  const d = db();
  const o = await d
    .prepare("SELECT gift_message, gift_from, status FROM orders WHERE id = ?")
    .bind(orderId)
    .first<{ gift_message: string | null; gift_from: string | null; status: string }>();
  if (!o?.gift_message?.trim() || o.status !== "new") return;
  const dup = await d
    .prepare("SELECT 1 AS x FROM print_jobs WHERE order_id = ? AND kind = 'gift_card' LIMIT 1")
    .bind(orderId)
    .first();
  if (dup) return;
  await d
    .prepare("INSERT INTO print_jobs (order_id, kind, zpl, payload) VALUES (?, 'gift_card', ?, ?)")
    .bind(orderId, giftCardZpl(o.gift_message, o.gift_from), JSON.stringify({ message: o.gift_message, from: o.gift_from ?? "" }))
    .run();
}

export async function listPrintJobs(limit = 40): Promise<(PrintJob & { customer: string | null })[]> {
  const { results } = await db()
    .prepare(
      `SELECT j.id, j.order_id, j.kind, j.status, j.created_at, j.printed_at, c.name AS customer
         FROM print_jobs j
         LEFT JOIN orders o ON o.id = j.order_id
         LEFT JOIN customers c ON c.id = o.customer_id
        ORDER BY j.id DESC LIMIT ?`,
    )
    .bind(limit)
    .all<PrintJob & { customer: string | null }>();
  return results;
}
