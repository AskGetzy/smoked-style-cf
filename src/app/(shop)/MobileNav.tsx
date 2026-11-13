"use client";

import Link from "next/link";
import { useState } from "react";
import { CartLink } from "./CartLink";

export function MobileNav({ links }: { links: { href: string; label: string; accent?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-1 min-[820px]:hidden">
        <CartLink variant="icon" />
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="inline-flex h-11 w-11 items-center justify-center text-ink"
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d={open ? "M5 5l14 14M19 5L5 19" : "M4 7h16M4 12h16M4 17h16"} />
          </svg>
        </button>
      </div>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 flex flex-col border-t border-line bg-paper px-6 pb-4 pt-2 text-sm font-medium uppercase tracking-[0.14em] shadow-md min-[820px]:hidden">
          {links.map((l, i) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-3.5 ${l.accent ? "text-ember" : "text-ink"} ${i < links.length - 1 ? "border-b border-line" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
