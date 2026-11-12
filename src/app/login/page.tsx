import { redirect } from "next/navigation";
import { db } from "@/lib/cf";
import { getStaff } from "@/lib/session";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getStaff()) redirect("/admin");

  const users = await db().prepare('SELECT COUNT(*) AS n FROM "user"').first<{ n: number }>();
  const invites = await db().prepare("SELECT COUNT(*) AS n FROM staff_invites").first<{ n: number }>();
  const firstRun = !users || users.n === 0;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="card w-full max-w-sm p-6">
        <h1 className="font-display text-3xl font-bold">Smoked Style</h1>
        <p className="mb-6 mt-1 text-sm text-ink-soft">
          {firstRun ? "Create the boss account. This only appears once." : "Staff sign in"}
        </p>
        <LoginForm firstRun={firstRun} hasInvites={(invites?.n ?? 0) > 0} />
      </div>
    </main>
  );
}
