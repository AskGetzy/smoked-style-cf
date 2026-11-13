"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/cf";
import { requireStaff } from "@/lib/session";
import { giftCardZpl } from "@/lib/zpl";

export async function testCard(): Promise<void> {
  await requireStaff();
  await db()
    .prepare("INSERT INTO print_jobs (kind, zpl, payload) VALUES ('gift_card', ?, ?)")
    .bind(
      giftCardZpl("Wishing you a happy Chanukah. Enjoy every bite!", "The Smoked Style team"),
      JSON.stringify({ message: "Wishing you a happy Chanukah. Enjoy every bite!", from: "The Smoked Style team" }),
    )
    .run();
  revalidatePath("/admin/print");
}

/** Put a job back in the queue (copy it, so the history stays). */
export async function reprint(id: number): Promise<void> {
  await requireStaff();
  await db()
    .prepare("INSERT INTO print_jobs (order_id, kind, zpl, payload) SELECT order_id, kind, zpl, payload FROM print_jobs WHERE id = ?")
    .bind(id)
    .run();
  revalidatePath("/admin/print");
}
