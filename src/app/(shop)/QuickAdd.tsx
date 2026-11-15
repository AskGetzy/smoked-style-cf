"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function QuickAdd({ id, max, label = "Add", tone = "ember" }: { id: number; max: number; label?: string; tone?: "ember" | "flame" }) {
  const [done, setDone] = useState(false);
  const cls = done ? "bg-charcoal text-white" : tone === "flame" ? "bg-flame text-deep hover:bg-white" : "bg-ember text-white hover:bg-ember-dark";
  return (
    <button
      type="button"
      disabled={max < 1}
      className={`min-h-[46px] whitespace-nowrap px-5 font-label text-base font-semibold uppercase tracking-[0.1em] transition disabled:opacity-50 ${cls}`}
      onClick={() => {
        addToCart(id, 1, max);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Added ✓" : label}
    </button>
  );
}
