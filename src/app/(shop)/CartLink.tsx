"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

const Bag = ({ size }: { size: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export function CartLink({ variant = "desktop" }: { variant?: "desktop" | "icon" }) {
  const count = useCartCount();
  if (variant === "icon") {
    return (
      <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative inline-flex h-[46px] w-[46px] items-center justify-center bg-ember text-white">
        <Bag size={20} />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center bg-char px-1 font-label text-[11px] font-semibold text-white">
            {count}
          </span>
        )}
      </Link>
    );
  }
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} className="inline-flex min-h-[46px] items-center gap-2 bg-ember px-5 text-white hover:bg-ember-dark">
      <Bag size={18} />
      Cart ({count})
    </Link>
  );
}
