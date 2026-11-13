"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/cf";
import { cancelAndRestock, getOrderByToken } from "@/lib/orders";
import { judgeFakeCard } from "@/lib/payments";
import { enqueueGiftCard } from "@/lib/printing";

export type PayState = { error?: string };

export async function payFake(token: string, _prev: PayState, f: FormData): Promise<PayState> {
  const found = await getOrderByToken(token);
  if (!found) return { error: "Order not found." };
  const { order } = found;
  if (order.status === "cancelled") return { error: "This order was cancelled." };
  if (order.payment_status === "unpaid") {
    const verdict = judgeFakeCard(String(f.get("card") ?? ""));
    if (!verdict.ok) return { error: verdict.message };
    await db()
      .prepare(
        "UPDATE orders SET payment_status = ?, stripe_payment_intent_id = ?, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?",
      )
      .bind(order.payment_mode === "hold" ? "held" : "paid", `fake_pi_${token.slice(0, 12)}`, order.id)
      .run();
    await enqueueGiftCard(order.id);
  }
  redirect(`/order/${token}?placed=1`);
}

export async function cancelUnpaid(token: string) {
  const found = await getOrderByToken(token);
  if (found && found.order.payment_status === "unpaid") await cancelAndRestock(found.order.id);
  redirect("/cart");
}
