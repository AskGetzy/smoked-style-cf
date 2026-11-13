"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function QuickAdd({ id, max, label = "Add", tone = "ember" }: { id: number; max: number; label?: string; tone?: "ember" | "gold" }) {
  const [done, setDone] = useState(false);
  const cls = tone === "gold" ? "bg-gold text-char" : done ? "bg-[#2f6b45] text-white" : "bg-ember text-white hover:bg-ember-dark";
  return (
    <button
      type="button"
      disabled={max < 1}
      className={`min-h-11 rounded-md px-5 text-[15px] font-bold disabled:opacity-50 ${cls}`}
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
