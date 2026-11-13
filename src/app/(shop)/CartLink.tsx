"use client";

import Link from "next/link";
import { useCartCount } from "@/lib/cart";

export function CartLink() {
  const count = useCartCount();
  return (
    <Link
      href="/cart"
      className="whitespace-nowrap rounded-full bg-ember px-4 py-2 text-sm font-medium text-paper hover:bg-ember-dark"
    >
      Cart &middot; {count}
    </Link>
  );
}
