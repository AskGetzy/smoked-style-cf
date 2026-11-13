"use client";

import { useActionState } from "react";
import { requestCatering, type CateringState } from "./catering-actions";

const f = "min-h-12 w-full rounded-[10px] border border-[#5a4838] bg-char px-3.5 text-base text-parchment placeholder:text-parchment/40 outline-none focus:border-gold";
const l = "flex flex-1 basis-40 flex-col gap-2 text-sm font-medium text-[#e3d5be]";

export function CateringForm() {
  const [state, action, pending] = useActionState<CateringState, FormData>(requestCatering, {});
  if (state.ok) {
    return (
      <div className="rounded-[20px] border border-[#47382c] bg-[#2a1f18] p-8 text-center text-parchment">
        <p className="font-display text-2xl">Thank you!</p>
        <p className="mt-2 text-parchment/70">We got your request and will be in touch soon.</p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-[18px] rounded-[20px] border border-[#47382c] bg-[#2a1f18] p-7">
      {state.error && <p className="rounded-lg bg-ember/30 px-3 py-2 text-sm text-parchment">{state.error}</p>}
      <div className="flex flex-wrap gap-4">
        <label className={l}>Name<input name="name" required placeholder="Your name" className={f} /></label>
        <label className={l}>Phone or email<input name="contact" required placeholder="How we reach you" className={f} /></label>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className={l}>Event date<input name="event_date" type="date" className={f} /></label>
        <label className={l}>Headcount<input name="headcount" type="number" min={1} placeholder="e.g. 40" className={f} /></label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-[#e3d5be]">
        What are you planning?
        <textarea name="details" rows={3} placeholder="Type of event, anything we should know" className={`${f} py-3`} />
      </label>
      <button type="submit" disabled={pending} className="min-h-[52px] rounded-full bg-ember text-[17px] font-bold text-white hover:bg-ember-dark disabled:opacity-60">
        {pending ? "Sending…" : "Request a catering quote"}
      </button>
    </form>
  );
}
