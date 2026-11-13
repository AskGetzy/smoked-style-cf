"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

const Bag = ({ size }: { size: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

export function CartLink({ variant = "desktop" }: { variant?: "desktop" | "icon" }) {
  const count = useCartCount();
  if (variant === "icon") {
    return (
      <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative inline-flex h-11 w-11 items-center justify-center text-ink">
        <Bag size={22} />
        {count > 0 && (
          <span className="absolute right-1 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
      </Link>
    );
  }
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} className="inline-flex items-center gap-2 py-3 text-ink hover:text-ember">
      <Bag size={20} />({count})
    </Link>
  );
}
