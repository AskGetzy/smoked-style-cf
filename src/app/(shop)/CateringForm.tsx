"use client";

import { useActionState } from "react";
import { requestCatering, type CateringState } from "./catering-actions";

const f = "min-h-12 w-full border-2 border-[#5a4d45] bg-deep px-3.5 text-base text-parchment outline-none focus:border-flame [color-scheme:dark]";
const l = "flex flex-1 basis-40 flex-col gap-2 font-label text-[15px] font-medium uppercase tracking-[0.1em] text-[#cfc3b3]";

export function CateringForm() {
  const [state, action, pending] = useActionState<CateringState, FormData>(requestCatering, {});
  if (state.ok) {
    return (
      <div className="border-[3px] border-[#4a3f39] bg-charcoal p-8 text-center text-parchment">
        <p className="font-display text-3xl">Thank you!</p>
        <p className="mt-2 text-parchment/70">We got your request and will be in touch soon.</p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-[18px] border-[3px] border-[#4a3f39] bg-charcoal p-7">
      {state.error && <p className="bg-ember/40 px-3 py-2 text-sm text-parchment">{state.error}</p>}
      <div className="flex flex-wrap gap-4">
        <label className={l}>Name<input name="name" required className={f} /></label>
        <label className={l}>Phone or email<input name="contact" required className={f} /></label>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className={l}>Event date<input name="event_date" type="date" className={f} /></label>
        <label className={l}>Headcount<input name="headcount" type="number" min={1} className={f} /></label>
      </div>
      <label className={`${l} basis-auto`}>
        Tell us about the event
        <textarea name="details" rows={3} className={`${f} py-3`} />
      </label>
      <button type="submit" disabled={pending} className="min-h-14 bg-ember font-label text-[19px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-ember-dark disabled:opacity-60">
        {pending ? "Sending…" : "Request a quote"}
      </button>
    </form>
  );
}
