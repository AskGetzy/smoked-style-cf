"use client";

import { useActionState } from "react";
import { requestCatering, type CateringState } from "./catering-actions";

const f = "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-parchment placeholder:text-parchment/40 outline-none focus:border-ember";
const l = "mb-1 block text-xs text-parchment/70";

export function CateringForm() {
  const [state, action, pending] = useActionState<CateringState, FormData>(requestCatering, {});
  if (state.ok) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-parchment">
        <p className="font-display text-2xl">Thank you!</p>
        <p className="mt-2 text-parchment/70">We got your request and will be in touch soon.</p>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      {state.error && <p className="rounded-lg bg-ember/20 px-3 py-2 text-sm text-parchment">{state.error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={l} htmlFor="c-name">Name</label>
          <input id="c-name" name="name" required placeholder="Your name" className={f} />
        </div>
        <div>
          <label className={l} htmlFor="c-contact">Phone or email</label>
          <input id="c-contact" name="contact" required placeholder="How we reach you" className={f} />
        </div>
        <div>
          <label className={l} htmlFor="c-date">Event date</label>
          <input id="c-date" name="event_date" type="date" className={f} />
        </div>
        <div>
          <label className={l} htmlFor="c-head">Headcount</label>
          <input id="c-head" name="headcount" inputMode="numeric" placeholder="e.g. 40" className={f} />
        </div>
      </div>
      <div>
        <label className={l} htmlFor="c-details">What are you planning?</label>
        <textarea id="c-details" name="details" rows={3} placeholder="Type of event, anything we should know" className={f} />
      </div>
      <button type="submit" disabled={pending} className="w-full rounded-full bg-ember py-3 font-medium text-paper hover:bg-ember-dark disabled:opacity-60">
        {pending ? "Sending…" : "Request a catering quote"}
      </button>
    </form>
  );
}
