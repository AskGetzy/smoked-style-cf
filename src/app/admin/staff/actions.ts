"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/cf";
import { requireStaff } from "@/lib/session";

export async function inviteStaff(f: FormData): Promise<void> {
  await requireStaff(["boss"]);
  const email = String(f.get("email") ?? "").trim().toLowerCase();
  const role = f.get("role") === "admin" ? "admin" : "staff";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) redirect("/admin/staff?error=Enter+a+valid+email.");

  const existing = await db().prepare('SELECT id FROM "user" WHERE email = ?').bind(email).first();
  if (existing) redirect("/admin/staff?error=That+email+already+has+an+account.");

  await db()
    .prepare("INSERT INTO staff_invites (email, role) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET role = excluded.role")
    .bind(email, role)
    .run();
  revalidatePath("/admin/staff");
}

export async function removeInvite(email: string): Promise<void> {
  await requireStaff(["boss"]);
  await db().prepare("DELETE FROM staff_invites WHERE email = ?").bind(email).run();
  revalidatePath("/admin/staff");
}

export async function removeUser(userId: string): Promise<void> {
  const me = await requireStaff(["boss"]);
  if (userId === me.id) return;
  // Sessions and login records go with the user (ON DELETE CASCADE).
  await db().prepare(`DELETE FROM "user" WHERE id = ? AND role != 'boss'`).bind(userId).run();
  revalidatePath("/admin/staff");
}
