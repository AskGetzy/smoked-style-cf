import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Role } from "./auth";

export type StaffUser = { id: string; name: string; email: string; role: Role };

export async function getStaff(): Promise<StaffUser | null> {
  const session = await auth().api.getSession({ headers: await headers() });
  if (!session) return null;
  const u = session.user as typeof session.user & { role?: Role };
  return { id: u.id, name: u.name, email: u.email, role: u.role ?? "staff" };
}

/** Use at the top of every admin page and server action. */
export async function requireStaff(allowed: Role[] = ["boss", "admin", "staff"]): Promise<StaffUser> {
  const user = await getStaff();
  if (!user) redirect("/login");
  if (!allowed.includes(user.role)) redirect("/admin?denied=1");
  return user;
}
