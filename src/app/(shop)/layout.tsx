import Link from "next/link";
import { listCategories } from "@/lib/products";
import { CartLink } from "./CartLink";

export const dynamic = "force-dynamic";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-char text-parchment">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link href="/" className="whitespace-nowrap font-display text-xl font-bold sm:text-2xl">
            Smoked Style
          </Link>
          <nav className="hidden flex-1 gap-1 text-sm sm:flex">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="rounded-md px-3 py-1.5 hover:bg-white/10">
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="flex-1 sm:hidden" />
          <CartLink />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 text-sm sm:hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop/${c.slug}`}
              className="whitespace-nowrap rounded-full border border-white/20 px-3 py-1"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="border-t border-line px-4 py-6 text-center text-sm text-ink-soft">
        Smoked Style &middot; Smoked meats, jerky, steaks and boards &middot;{" "}
        <Link href="/admin" className="underline">
          Staff
        </Link>
      </footer>
    </div>
  );
}
