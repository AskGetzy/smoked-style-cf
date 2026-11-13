"use server";

import { db } from "@/lib/cf";

export type CateringState = { ok?: boolean; error?: string };

export async function requestCatering(_p: CateringState, f: FormData): Promise<CateringState> {
  const get = (k: string) => String(f.get(k) ?? "").trim();
  const name = get("name");
  const contact = get("contact");
  if (!name || !contact) return { error: "Please enter your name and a phone or email." };
  const headcount = parseInt(get("headcount"), 10);
  await db()
    .prepare("INSERT INTO catering_requests (name, contact, event_date, headcount, details) VALUES (?, ?, ?, ?, ?)")
    .bind(
      name.slice(0, 120),
      contact.slice(0, 160),
      /^\d{4}-\d{2}-\d{2}$/.test(get("event_date")) ? get("event_date") : null,
      Number.isFinite(headcount) && headcount > 0 ? headcount : null,
      get("details").slice(0, 2000) || null,
    )
    .run();
  return { ok: true };
}
