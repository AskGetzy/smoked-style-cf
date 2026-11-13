import Link from "next/link";
import { listCategories } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CartLink } from "./CartLink";
import { Logo, Wordmark } from "./Logo";

export const dynamic = "force-dynamic";

function ShieldCheck({ className, stroke }: { className?: string; stroke: string }) {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const categories = await listCategories();
  const nav = [
    { href: "/shop", label: "Shop" },
    { href: "/shop/boards", label: "Gifts" },
    { href: "/#catering", label: "Catering" },
    { href: "/order", label: "Order status" },
  ];
  const wa = SITE.whatsappNumber ? `https://wa.me/${SITE.whatsappNumber}` : "/#catering";

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Trust bar */}
      <div className="flex flex-wrap justify-center gap-x-[22px] gap-y-1 bg-char px-4 py-2 text-xs tracking-wide text-parchment md:px-6 md:py-2.5 md:text-sm">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck stroke="#F2A93B" />
          <strong>Certified Kosher · CRC</strong>
        </span>
        <span aria-hidden="true" className="hidden text-gold md:inline">&bull;</span>
        <span className="hidden md:inline">Hardwood smoked in-house</span>
        <span aria-hidden="true" className="hidden text-gold md:inline">&bull;</span>
        <span>
          Pre-order by <strong>{SITE.cutoffDay}</strong> for <strong>{SITE.pickupDay}</strong>
        </span>
      </div>

      {/* Nav */}
      <header className="border-b border-line bg-paper">
        <nav className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
          <Link href="/" aria-label="Smoked Style home" className="flex items-center gap-3.5 text-char">
            <Logo className="h-[42px] w-[44px] md:h-[59px] md:w-[62px]" />
            <span className="flex flex-col gap-[3px]">
              <Wordmark size="text-[22px] md:text-[30px]" />
              <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft md:text-xs">Smokehouse &amp; Catering</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-0 text-sm font-medium md:gap-x-[26px] md:text-base">
            <Link href="/#holiday" className="py-2 font-bold text-ember md:py-2.5">
              Chanukah Specials
            </Link>
            {nav.map((n) => (
              <Link key={n.label} href={n.href} className="py-2 text-ink hover:text-ember md:py-2.5">
                {n.label}
              </Link>
            ))}
            <CartLink />
          </div>
        </nav>
      </header>

      <div className="flex-1">{children}</div>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-[1280px] px-6 pb-24 pt-12 md:pb-12 md:pt-16">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="flex flex-[1_1_280px] flex-col gap-4">
            <span className="flex items-center gap-3">
              <Logo className="h-[51px] w-[54px]" />
              <Wordmark size="text-[32px]" />
            </span>
            <span className="leading-relaxed text-ink-soft">Small-batch smoked meats and catering.</span>
            <div className="flex items-center gap-3.5">
              <div
                role="img"
                aria-label="Placeholder for the official CRC kosher seal"
                className="flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-dashed border-[#8c7a68] text-center text-[10px] font-bold text-ink-soft"
              >
                [CRC seal]
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold">Certified Kosher</span>
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
            <Link href="/#holiday" className="py-1.5 text-ember underline">{SITE.holidayName[0].toUpperCase() + SITE.holidayName.slice(1)}</Link>
            {categories.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="py-1.5 text-ember underline">
                {c.name}
              </Link>
            ))}
            <Link href="/order" className="py-1.5 text-ember underline">Track an order</Link>
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
        className="fixed bottom-5 right-5 z-10 inline-flex h-12 w-12 items-center justify-center gap-2.5 rounded-full bg-[#1f7a4d] text-[15px] font-bold text-white shadow-[0_8px_22px_rgba(0,0,0,0.25)] md:w-auto md:px-5"
      >
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" />
          <path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .8-.4 1.8c-3.5.3-7.5-3.7-7.2-7.2l1.8-.4.8 2z" />
        </svg>
        <span className="hidden md:inline">Chat with us</span>
      </a>
    </div>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-[0_1_200px] flex-col gap-2.5 text-base">
      <span className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">{title}</span>
      {children}
    </div>
  );
}
