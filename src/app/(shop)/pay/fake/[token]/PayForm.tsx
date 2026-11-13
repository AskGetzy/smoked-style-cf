"use client";

import { useActionState } from "react";
import { cancelUnpaid, payFake, type PayState } from "./actions";

export function PayForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<PayState, FormData>(payFake.bind(null, token), {});
  return (
    <div className="space-y-3">
      <form action={formAction} className="card space-y-4 p-4">
        {state.error && <p className="rounded-lg bg-ember/10 px-3 py-2 text-sm text-ember">{state.error}</p>}
        <div>
          <label className="label" htmlFor="card">Card number</label>
          <input id="card" name="card" inputMode="numeric" autoComplete="off" placeholder="4242 4242 4242 4242" required className="field" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="exp">Expiry</label>
            <input id="exp" name="exp" placeholder="12 / 30" className="field" />
          </div>
          <div>
            <label className="label" htmlFor="cvc">CVC</label>
            <input id="cvc" name="cvc" placeholder="123" className="field" />
          </div>
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full">
          {pending ? "Processing…" : "Pay (test)"}
        </button>
      </form>
      <form action={cancelUnpaid.bind(null, token)}>
        <button type="submit" className="w-full text-sm text-ink-soft underline">Cancel and go back to cart</button>
      </form>
    </div>
  );
}
