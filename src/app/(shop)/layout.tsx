import Link from "next/link";
import { SITE } from "@/lib/site";
import { CartLink } from "./CartLink";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export const dynamic = "force-dynamic";

const colHead = "mb-1 font-label text-base font-semibold uppercase tracking-[0.14em] text-flame";
const fLink = "py-1.5 hover:text-flame";
const iconBtn = "inline-flex h-[46px] w-[46px] items-center justify-center border-2 border-[#4a3f39] text-parchment hover:border-flame hover:text-flame";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
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
          {" "}Hardwood smoked since 2015 <span className="text-flame">&bull;</span> Pickup &amp; local delivery <span className="text-flame">&bull;</span>
        </span>
      </div>

      {/* Header */}
      <header className="relative border-b-[3px] border-charcoal bg-paper">
        <nav className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-2 min-[820px]:py-2.5">
          <Link href="/" aria-label="Smoked Style home" className="flex items-center">
            <Logo size={84} className="!h-16 !w-16 min-[820px]:!h-[84px] min-[820px]:!w-[84px]" />
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
      <footer className="border-t-4 border-ember bg-deep text-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 pb-24 pt-12 md:pb-8">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[#4a3f39] pb-8">
            <div className="flex min-w-0 items-center gap-5">
              <Logo size={88} />
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="font-display text-2xl leading-none">Smoked Style</span>
                <span className="max-w-[340px] text-sm leading-normal text-[#cfc3b3]">Kosher smokehouse &amp; catering. Hardwood smoked since 2015.</span>
              </div>
            </div>
            <div className="flex gap-2.5">
              <a href={wa} aria-label="WhatsApp" className={iconBtn}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" />
                  <path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .8-.4 1.8c-3.5.3-7.5-3.7-7.2-7.2l1.8-.4.8 2z" />
                </svg>
              </a>
              <a href={SITE.instagramUrl || "/#catering"} aria-label="Instagram" className={iconBtn}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
                </svg>
              </a>
              <a href={SITE.phoneDigits ? `tel:+${SITE.phoneDigits}` : "/#catering"} aria-label="Call us" className={iconBtn}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-[15px] min-[820px]:grid-cols-4">
            <div className="flex min-w-0 flex-col gap-2">
              <span className={colHead}>Pickup</span>
              <span>{SITE.pickupLocation}</span>
              <span>{SITE.pickupHours}</span>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <span className={colHead}>Contact</span>
              <span>{SITE.phone}</span>
              <span>{SITE.email}</span>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className={`${colHead} mb-2`}>Shop</span>
              <Link href="/#holiday" className={fLink}>{SITE.holidayHeading}</Link>
              <Link href="/shop/jerky" className={fLink}>Jerky</Link>
              <Link href="/shop/steaks" className={fLink}>Steaks &amp; smoked</Link>
              <Link href="/shop/boards" className={fLink}>Boards</Link>
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className={`${colHead} mb-2`}>Help</span>
              <Link href="/order" className={fLink}>Track an order</Link>
              <Link href="/#catering" className={fLink}>Catering</Link>
              <span className="py-1.5 text-[#9c8f80]">[Delivery areas]</span>
              <span className="py-1.5 text-[#9c8f80]">[FAQ]</span>
              <Link href="/admin" className="py-1.5 text-[#9c8f80] hover:text-flame">Staff</Link>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-2 border-[#4a3f39] px-4 py-3">
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-parchment">
              <img src="/brand/crc-seal.png" alt="CRC Kashrus" className="h-auto w-[34px]" />
            </span>
            <span className="font-label text-[15px] font-medium uppercase tracking-[0.1em]">Certified kosher under the CRC</span>
          </div>

          <div className="flex flex-wrap justify-between gap-2 font-label text-[13px] uppercase tracking-[0.12em] text-[#9c8f80]">
            <span>&copy; {new Date().getFullYear()} {SITE.name}</span>
            <span>Low &amp; slow since 2015</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp chat */}
      <a
        href={wa}
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-4 right-4 z-10 inline-flex h-12 w-12 min-[820px]:h-14 min-[820px]:w-14 items-center justify-center rounded-full border-[3px] border-flame bg-charcoal text-parchment shadow-[0_8px_22px_rgba(0,0,0,0.3)]"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" />
          <path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1-1.2 2 .8-.4 1.8c-3.5.3-7.5-3.7-7.2-7.2l1.8-.4.8 2z" />
        </svg>
      </a>
    </div>
  );
}
