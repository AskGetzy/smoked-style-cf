"use client";

import { useSyncExternalStore } from "react";

export type CartLine = { id: number; qty: number };

const KEY = "ss-cart";
const EVENT = "ss-cart-change";

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((l) => Number.isInteger(l?.id) && Number.isInteger(l?.qty) && l.qty > 0)
      .map((l) => ({ id: l.id as number, qty: l.qty as number }));
  } catch {
    return [];
  }
}

function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function getCart(): CartLine[] {
  return read();
}

export function addToCart(id: number, qty: number, max: number): number {
  const lines = read();
  const existing = lines.find((l) => l.id === id);
  const next = Math.min(max, (existing?.qty ?? 0) + qty);
  if (existing) existing.qty = next;
  else lines.push({ id, qty: next });
  write(lines.filter((l) => l.qty > 0));
  return next;
}

export function setQty(id: number, qty: number) {
  write(read().map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0));
}

export function removeLine(id: number) {
  write(read().filter((l) => l.id !== id));
}

export function clearCart() {
  write([]);
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCartCount(): number {
  return useSyncExternalStore(
    subscribe,
    () => read().reduce((n, l) => n + l.qty, 0),
    () => 0,
  );
}
