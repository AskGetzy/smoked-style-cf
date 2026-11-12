"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LoginForm({ firstRun, hasInvites }: { firstRun: boolean; hasInvites: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">(firstRun ? "signup" : "signin");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim().toLowerCase();
    const password = String(f.get("password"));

    const res =
      mode === "signup"
        ? await authClient.signUp.email({ email, password, name: String(f.get("name")).trim() })
        : await authClient.signIn.email({ email, password });

    setBusy(false);
    if (res.error) {
      setError(
        mode === "signup"
          ? "Couldn't create the account. Ask the boss to invite this email first."
          : "Wrong email or password.",
      );
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "signup" && (
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required className="field" autoComplete="name" />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required className="field" autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="field"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
      </div>
      {error && <p className="text-sm text-ember">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
      {!firstRun && hasInvites && (
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-sm text-ink-soft underline"
        >
          {mode === "signin" ? "Invited? Create your account" : "Back to sign in"}
        </button>
      )}
    </form>
  );
}
