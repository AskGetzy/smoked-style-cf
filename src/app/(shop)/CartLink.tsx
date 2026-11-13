"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartLink() {
  const count = useCartCount();
  return (
    <Link href="/cart" className="whitespace-nowrap rounded-lg bg-ember px-3 py-1.5 text-sm font-medium text-paper hover:bg-ember-dark">
      Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
