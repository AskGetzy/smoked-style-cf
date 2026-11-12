import { db } from "@/lib/cf";
import { requireStaff } from "@/lib/session";
import { inviteStaff, removeInvite, removeUser } from "./actions";

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const me = await requireStaff(["boss"]);
  const { error } = await searchParams;

  const [{ results: users }, { results: invites }] = await Promise.all([
    db().prepare('SELECT id, name, email, role FROM "user" ORDER BY role, name').all<{
      id: string;
      name: string;
      email: string;
      role: string;
    }>(),
    db().prepare("SELECT email, role FROM staff_invites ORDER BY created_at DESC").all<{ email: string; role: string }>(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Staff</h1>

      <section className="card p-4 sm:p-6">
        <h2 className="mb-1 font-display text-xl font-semibold">Invite someone</h2>
        <p className="mb-4 text-sm text-ink-soft">
          They go to the login page, tap &quot;Invited? Create your account&quot;, and sign up with this email.
          Admins can add and edit items. Staff can only view items, hide them, and mark them sold out.
        </p>
        {error && <p className="mb-3 text-sm text-ember">{error}</p>}
        <form action={inviteStaff} className="flex flex-col gap-3 sm:flex-row">
          <input name="email" type="email" required placeholder="name@example.com" className="field sm:flex-1" />
          <select name="role" defaultValue="staff" className="field sm:w-36">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn-primary">Invite</button>
        </form>
      </section>

      {invites.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Waiting to sign up</h2>
          <ul className="card divide-y divide-line">
            {invites.map((i) => (
              <li key={i.email} className="flex items-center justify-between gap-3 p-3">
                <span>
                  {i.email} <span className="badge bg-parchment-dark capitalize">{i.role}</span>
                </span>
                <form action={removeInvite.bind(null, i.email)}>
                  <button className="btn-ghost px-3 py-1.5 text-xs">Cancel</button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">Accounts</h2>
        <ul className="card divide-y divide-line">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-3 p-3">
              <span className="min-w-0">
                <span className="font-medium">{u.name}</span>{" "}
                <span className="badge bg-parchment-dark capitalize">{u.role}</span>
                <span className="block truncate text-sm text-ink-soft">{u.email}</span>
              </span>
              {u.id !== me.id && u.role !== "boss" && (
                <form action={removeUser.bind(null, u.id)}>
                  <button className="btn-danger px-3 py-1.5 text-xs">Remove</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
