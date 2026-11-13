"use client";

import { useActionState } from "react";
import { requestCatering, type CateringState } from "./catering-actions";

const f = "min-h-12 w-full rounded-none border-0 border-b border-[#5a4d40] bg-transparent px-0 text-base text-[#EDE6DA] placeholder:text-[#EDE6DA]/35 outline-none focus:border-brass";
const l = "flex flex-1 basis-40 flex-col gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#B3A796]";

export function CateringForm() {
  const [state, action, pending] = useActionState<CateringState, FormData>(requestCatering, {});
  if (state.ok) {
    return (
      <div className="rounded-[2px] border border-[#3a3029] bg-[#1F1915] p-8 text-center text-parchment">
        <p className="font-display text-3xl italic">Thank you.</p>
        <p className="mt-2 text-parchment/70">We got your request and will be in touch soon.</p>
      </div>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-[18px] rounded-[2px] border border-[#3a3029] bg-[#1F1915] p-7">
      {state.error && <p className="rounded-[2px] bg-ember/30 px-3 py-2 text-sm text-parchment">{state.error}</p>}
      <div className="flex flex-wrap gap-4">
        <label className={l}>Name<input name="name" required placeholder="Your name" className={f} /></label>
        <label className={l}>Phone or email<input name="contact" required placeholder="How we reach you" className={f} /></label>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className={l}>Event date<input name="event_date" type="date" className={f} /></label>
        <label className={l}>Headcount<input name="headcount" type="number" min={1} placeholder="e.g. 40" className={f} /></label>
      </div>
      <label className="flex flex-col gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-[#B3A796]">
        What are you planning?
        <textarea name="details" rows={3} placeholder="Type of event, anything we should know" className={`${f} py-3`} />
      </label>
      <button type="submit" disabled={pending} className="min-h-[52px] rounded-[2px] bg-ember text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-ember-dark disabled:opacity-60">
        {pending ? "Sending…" : "Request a quote"}
      </button>
    </form>
  );
}
