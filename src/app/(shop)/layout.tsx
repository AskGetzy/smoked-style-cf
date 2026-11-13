import Link from "next/link";
import { listCategories } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CartLink } from "./CartLink";
import { Logo } from "./Logo";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  const nav = [
    { href: "/shop", label: "Shop" },
    { href: "/shop/boards", label: "Gifts" },
    { href: "/#catering", label: "Catering" },
    { href: "/order", label: "Order status" },
  ];
  return (
    <div className="flex flex-1 flex-col">
      {SITE.banner && <div className="bg-char px-4 py-2 text-center text-xs text-parchment">{SITE.banner}</div>}
      <header className="sticky top-0 z-10 border-b border-line bg-parchment/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-char">
            <Logo />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold sm:text-2xl">{SITE.name}</span>
              <span className="hidden text-[10px] uppercase tracking-[0.2em] text-ink-soft sm:block">
                Smokehouse &amp; Catering
              </span>
            </span>
          </Link>
          <div className="flex-1" />
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            {nav.map((n) => (
              <Link key={n.label} href={n.href} className="hover:text-ember">
                {n.label}
              </Link>
            ))}
          </nav>
          <CartLink />
        </div>
        <nav className="flex gap-4 overflow-x-auto px-4 pb-2 text-sm sm:hidden">
          {nav.map((n) => (
            <Link key={n.label} href={n.href} className="whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2 text-char">
              <Logo className="h-8 w-8" />
              <span className="font-display text-xl font-bold">{SITE.name}</span>
            </div>
            <p className="text-sm text-ink-soft">Small-batch smoked meats and catering.</p>
          </div>
          {(SITE.pickupLocation || SITE.pickupHours) && (
            <div className="space-y-1 text-sm">
              <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">Pickup</h4>
              {SITE.pickupLocation && <p>{SITE.pickupLocation}</p>}
              {SITE.pickupHours && <p>{SITE.pickupHours}</p>}
            </div>
          )}
          {(SITE.phone || SITE.email) && (
            <div className="space-y-1 text-sm">
              <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">Contact</h4>
              {SITE.phone && <p>{SITE.phone}</p>}
              {SITE.email && <p>{SITE.email}</p>}
            </div>
          )}
          <div className="space-y-1 text-sm">
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-ink-soft">Shop</h4>
            {categories.slice(0, 4).map((c) => (
              <p key={c.id}>
                <Link href={`/shop/${c.slug}`} className="underline">
                  {c.name}
                </Link>
              </p>
            ))}
            <p>
              <Link href="/order" className="underline">
                Track an order
              </Link>
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-6xl justify-between px-4 pb-8 text-xs text-ink-soft sm:px-6">
          <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
          <Link href="/admin" className="underline">
            Staff
          </Link>
        </div>
      </footer>
    </div>
  );
}
