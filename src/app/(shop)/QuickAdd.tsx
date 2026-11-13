"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function QuickAdd({ id, max }: { id: number; max: number }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      disabled={max < 1}
      className="rounded-full bg-ember px-4 py-1.5 text-sm font-medium text-paper hover:bg-ember-dark disabled:opacity-50"
      onClick={() => {
        addToCart(id, 1, max);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Added" : "Add"}
    </button>
  );
}
