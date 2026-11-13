"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function QuickAdd({ id, max, label = "Add", tone = "dark" }: { id: number; max: number; label?: string; tone?: "dark" | "gold" }) {
  const [done, setDone] = useState(false);
  const cls =
    tone === "gold"
      ? "border-brass text-[#EDE6DA] hover:bg-brass hover:text-char"
      : "border-ink text-ink hover:bg-ink hover:text-paper";
  return (
    <button
      type="button"
      disabled={max < 1}
      className={`min-h-11 rounded-[2px] border px-5 text-xs font-medium uppercase tracking-[0.16em] transition disabled:opacity-50 ${cls}`}
      onClick={() => {
        addToCart(id, 1, max);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Added" : label}
    </button>
  );
}
