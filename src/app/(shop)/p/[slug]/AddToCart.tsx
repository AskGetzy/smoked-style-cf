"use client";

import Link from "next/link";
import { useState } from "react";
import { addToCart } from "@/lib/cart";

export function AddToCart({ id, max }: { id: number; max: number }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-line bg-paper">
          <button
            type="button"
            aria-label="Less"
            className="px-4 py-2.5 text-lg disabled:opacity-40"
            disabled={qty <= 1}
            onClick={() => setQty(qty - 1)}
          >
            &minus;
          </button>
          <span className="w-8 text-center font-medium">{qty}</span>
          <button
            type="button"
            aria-label="More"
            className="px-4 py-2.5 text-lg disabled:opacity-40"
            disabled={qty >= max}
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn-primary flex-1 sm:flex-none"
          onClick={() => {
            addToCart(id, qty, max);
            setAdded(true);
            setQty(1);
            setTimeout(() => setAdded(false), 4000);
          }}
        >
          Add to cart
        </button>
      </div>
      {added && (
        <p className="text-sm text-ok">
          Added.{" "}
          <Link href="/cart" className="underline">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
