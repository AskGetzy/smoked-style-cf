import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { env } from "./cf";

export type Role = "boss" | "admin" | "staff";

function createAuth() {
  const e = env();
  const DB = e.DB;

  return betterAuth({
    database: DB,
    secret: e.BETTER_AUTH_SECRET,
    baseURL: e.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true, minPasswordLength: 8 },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days: stay logged in on the kitchen tablet
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: { type: "string", input: false, defaultValue: "staff" },
      },
    },
    databaseHooks: {
      user: {
        create: {
          // Sign-up is closed: the first account becomes the boss,
          // after that only invited emails can create an account.
          before: async (user) => {
            const count = await DB.prepare('SELECT COUNT(*) AS n FROM "user"').first<{ n: number }>();
            if (!count || count.n === 0) {
              return { data: { ...user, role: "boss" } };
            }
            const invite = await DB.prepare("SELECT role FROM staff_invites WHERE email = ?")
              .bind(String(user.email).toLowerCase())
              .first<{ role: Role }>();
            if (!invite) return false;
            return { data: { ...user, role: invite.role } };
          },
          after: async (user) => {
            await DB.prepare("DELETE FROM staff_invites WHERE email = ?")
              .bind(String(user.email).toLowerCase())
              .run();
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

// One instance per Worker isolate (bindings are stable for its lifetime).
let cached: ReturnType<typeof createAuth> | undefined;
export function auth() {
  cached ??= createAuth();
  return cached;
}
