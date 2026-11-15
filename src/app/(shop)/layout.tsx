import Link from "next/link";
import { listCategories } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CartLink } from "./CartLink";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export const dynamic = "force-dynamic";

const colHead = "mb-1 font-label text-base font-semibold uppercase tracking-[0.14em] text-ember";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  const nav = [
    { href: "/#holiday", label: SITE.holidayName, accent: true },
    { href: "/shop", label: "Shop" },
    { href: "/shop/boards", label: "Gifts" },
    { href: "/#catering", label: "Catering" },
    { href: "/order", label: "Track order" },
  ];
  const wa = SITE.whatsappNumber ? `https://wa.me/${SITE.whatsappNumber}` : "/#catering";

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Top bar */}
      <div className="bg-charcoal px-6 py-2.5 text-center font-label text-sm font-medium uppercase tracking-[0.18em] text-parchment">
        <span className="text-flame">&bull;</span> Certified Kosher &middot; CRC <span className="text-flame">&bull;</span>
        <span className="hidden min-[820px]:inline">
          {" "}Hardwood smoked since 2015 <span className="text-flame">&bull;</span> Pre-order by {SITE.cutoffDay} <span className="text-flame">&bull;</span>
        </span>
      </div>

      {/* Header */}
      <header className="relative border-b-[3px] border-charcoal bg-paper">
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-2.5">
          <Link href="/" aria-label="Smoked Style home" className="flex items-center">
            <Logo size={84} />
          </Link>
          <div className="hidden items-center gap-[30px] font-label text-[17px] font-semibold uppercase tracking-[0.1em] min-[820px]:flex">
            {nav.map((n) => (
              <Link key={n.label} href={n.href} className={`py-3 hover:text-ember ${n.accent ? "text-ember" : "text-charcoal"}`}>
                {n.label}
              </Link>
            ))}
            <CartLink />
          </div>
          <MobileNav links={nav} />
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="border-t-[3px] border-charcoal bg-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 pb-24 pt-16 md:pb-10">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div className="flex flex-[1_1_280px] flex-wrap items-center gap-5">
              <Logo size={150} />
              <div className="flex items-center gap-3">
                <img src="/brand/crc-seal.png" alt="CRC Kashrus" className="h-[72px] w-auto" />
                <span className="font-label text-[15px] font-medium uppercase leading-normal tracking-[0.1em]">
                  Certified kosher
                  <br />
                  under the CRC
                </span>
              </div>
            </div>
            <div className="flex flex-[0_1_200px] flex-col gap-2 text-[15px]">
              <span className={colHead}>Pickup</span>
              <span>{SITE.pickupLocation}</span>
              <span>{SITE.pickupHours}</span>
            </div>
            <div className="flex flex-[0_1_200px] flex-col gap-2 text-[15px]">
              <span className={colHead}>Contact</span>
              <span>{SITE.phone}</span>
              <span>{SITE.email}</span>
            </div>
            <div className="flex flex-[0_1_200px] flex-col gap-0.5 text-[15px]">
              <span className={`${colHead} mb-2`}>Shop</span>
              <Link href="/#holiday" className="py-1.5 hover:text-ember">{SITE.holidayHeading}</Link>
              {categories.slice(0, 3).map((c) => (
                <Link key={c.id} href={`/shop/${c.slug}`} className="py-1.5 hover:text-ember">{c.name}</Link>
              ))}
              <Link href="/order" className="py-1.5 hover:text-ember">Track an order</Link>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t-2 border-charcoal pt-[18px] font-label text-sm uppercase tracking-[0.12em] text-ink-soft">
            <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
            <span>Low &amp; slow since 2015</span>
            <Link href="/admin" className="hover:text-ember">Staff</Link>
          </div>
        </div>
      </footer>

      {/* WhatsApp chat */}
      <a
        href={wa}
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-3 right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-flame bg-charcoal text-parchment shadow-[0_8px_22px_rgba(0,0,0,0.3)]"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" />
          <path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .8-.4 1.8c-3.5.3-7.5-3.7-7.2-7.2l1.8-.4.8 2z" />
        </svg>
      </a>
    </div>
  );
}
