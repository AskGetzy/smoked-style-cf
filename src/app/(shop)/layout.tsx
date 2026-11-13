import Link from "next/link";
import { listCategories } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CartLink } from "./CartLink";
import { Logo, Seal, Wordmark } from "./Logo";
import { MobileNav } from "./MobileNav";

export const dynamic = "force-dynamic";

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
      {/* Trust bar */}
      <div className="bg-char px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-[#EDE6DA]">
        Certified Kosher &middot; CRC
        <span className="hidden min-[820px]:inline"> &middot; Hardwood smoked in-house &middot; Pre-order by {SITE.cutoffDay}</span>
      </div>

      {/* Nav */}
      <header className="relative border-b border-line bg-paper">
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-[13px] min-[820px]:py-[18px]">
          <Link href="/" aria-label="Smoked Style home" className="flex items-center gap-3.5 text-ink">
            <Logo />
            <span className="flex flex-col gap-1">
              <Wordmark size="text-[19px] min-[820px]:text-[26px]" />
              <span className="text-[8px] font-medium uppercase tracking-[0.28em] text-ink-soft min-[820px]:text-[10px] min-[820px]:tracking-[0.32em]">Smokehouse &middot; Catering</span>
            </span>
          </Link>
          <div className="hidden items-center gap-x-8 text-[13px] font-medium uppercase tracking-[0.14em] min-[820px]:flex">
            {nav.map((n) => (
              <Link key={n.label} href={n.href} className={`py-3 hover:text-ember ${n.accent ? "text-ember" : "text-ink"}`}>
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
      <footer className="mx-auto w-full max-w-[1280px] px-6 pb-24 pt-12 md:pb-12 md:pt-16">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex flex-[1_1_280px] flex-col gap-4">
            <span className="flex items-center gap-3">
              <Seal />
            </span>
            <span className="leading-relaxed text-ink-soft">Small-batch smoked meats and catering.</span>
            <div className="flex items-center gap-3.5">
              <div
                role="img"
                aria-label="Placeholder for the official CRC kosher seal"
                className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-ink-soft text-center text-[10px] font-bold text-ink-soft"
              >
                [CRC seal]
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold">Certified Kosher</span>
                <span className="text-sm text-ink-soft">Under the supervision of the CRC</span>
              </div>
            </div>
          </div>
          <FooterCol title="Pickup">
            <span>{SITE.pickupLocation}</span>
            <span>{SITE.pickupHours}</span>
          </FooterCol>
          <FooterCol title="Contact">
            <span>{SITE.phone}</span>
            <span>{SITE.email}</span>
          </FooterCol>
          <FooterCol title="Shop">
            <Link href="/#holiday" className="py-1.5 hover:text-ember">{SITE.holidayName}</Link>
            {categories.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="py-1.5 hover:text-ember">
                {c.name}
              </Link>
            ))}
            <Link href="/order" className="py-1.5 hover:text-ember">Track an order</Link>
          </FooterCol>
        </div>
        <div className="mt-10 flex justify-between border-t border-line pt-6 text-sm text-ink-soft">
          <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
          <Link href="/admin" className="underline">Staff</Link>
        </div>
      </footer>

      {/* WhatsApp chat */}
      <a
        href={wa}
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-10 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-brass bg-char text-[#EDE6DA] shadow-[0_8px_22px_rgba(0,0,0,0.25)]"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" />
          <path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .8-.4 1.8c-3.5.3-7.5-3.7-7.2-7.2l1.8-.4.8 2z" />
        </svg>
      </a>
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-[0_1_200px] flex-col gap-2.5 text-base">
      <span className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-soft">{title}</span>
      {children}
    </div>
  );
}
