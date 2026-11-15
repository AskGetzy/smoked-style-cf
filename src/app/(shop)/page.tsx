import Link from "next/link";
import { formatCents } from "@/lib/format";
import { listCategories, listHolidayProducts, listShopProducts, maxOrderable, photoUrl, stockState } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CateringForm } from "./CateringForm";
import { QuickAdd } from "./QuickAdd";

// Fallback photos shipped with the site; a photo uploaded in Admin → Categories takes priority.
const CATEGORY_PHOTO: Record<string, string> = {
  steaks: "/categories/steaks.jpg",
  smoked: "/categories/smoked.jpg",
  boards: "/categories/boards.jpg",
  jerky: "/categories/jerky.jpg",
  "non-smoked": "/categories/non-smoked.jpg",
};

const HOLIDAY_PHOTOS = [
  { src: "/holiday/1.jpg", alt: "Fish platter arranged as a dreidel: salmon, tuna, smoked fish and jalapeño slices" },
  { src: "/holiday/2.jpg", alt: "Round smoked meat platter with sliced tomahawk, jerky and sauces" },
  { src: "/holiday/3.jpg", alt: "Meat platter arranged as a dreidel with sesame-crusted red edge" },
];

const label = "font-label text-[15px] font-semibold uppercase tracking-[0.24em]";
const h2 = "font-display text-[34px] leading-none md:text-[52px]";
const btn = "inline-flex min-h-14 items-center justify-center px-8 font-label text-[19px] font-semibold uppercase tracking-[0.12em]";
const linkLine = "border-b-2 py-3 font-label text-[17px] font-semibold uppercase tracking-[0.12em]";
const photoPh = "stripe-dark flex items-end p-3.5 font-label text-xs uppercase tracking-[0.18em] text-[#9c8f80]";

export default async function Home() {
  const [categories, products, holiday] = await Promise.all([listCategories(), listShopProducts(), listHolidayProducts()]);
  const best = [...products].sort((a, b) => b.order_count - a.order_count || a.sort_order - b.sort_order).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section id="top" className="relative flex flex-col items-center gap-[22px] overflow-hidden bg-deep px-4 pb-[110px] pt-16 text-center min-[480px]:px-6 text-parchment">
        <img src="/brand/hero-bg.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,16,14,0.9) 0%, rgba(20,16,14,0.72) 40%, rgba(20,16,14,0.72) 100%)" }} />
        <svg aria-hidden="true" width="900" height="520" viewBox="0 0 900 520" className="pointer-events-none absolute left-1/2 top-0 max-w-none -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)]" fill="none" strokeLinecap="round">
          <path className="wisp" d="M300 520 C240 420 380 360 300 250 C240 170 330 110 300 20" stroke="rgba(241,235,225,0.06)" strokeWidth="38" />
          <path className="wisp wisp-2" d="M460 520 C400 410 540 350 450 230 C390 150 480 90 450 0" stroke="rgba(241,235,225,0.05)" strokeWidth="46" />
          <path className="wisp wisp-3" d="M610 520 C560 430 680 370 600 260 C550 190 630 130 600 40" stroke="rgba(241,235,225,0.06)" strokeWidth="34" />
        </svg>
        <span className="relative mt-10 flex items-center gap-2.5 whitespace-nowrap font-label text-[13px] font-semibold uppercase tracking-[0.18em] text-flame min-[480px]:gap-3 min-[480px]:text-[15px] min-[480px]:tracking-[0.24em]">
          <span aria-hidden="true" className="h-0.5 w-5 bg-flame min-[480px]:w-8" />
          CRC certified &middot; Since 2015
          <span aria-hidden="true" className="h-0.5 w-5 bg-flame min-[480px]:w-8" />
        </span>
        <h1 className="relative font-display text-[clamp(40px,10.5vw,80px)] leading-none">
          Kosher never tasted <span className="text-flame">this&nbsp;good.</span>
        </h1>
        <p className="relative max-w-[640px] text-[19px] leading-relaxed text-[#cfc3b3]">
          Brisket, jerky, steaks and boards, smoked low and slow over hardwood since 2015.
        </p>
        <div className="relative flex flex-wrap justify-center gap-3 pt-1.5">
          <Link href="/shop" className={`${btn} bg-ember text-white hover:bg-ember-dark`}>Shop now</Link>
          <Link href="/#catering" className={`${btn} border-2 border-parchment text-parchment hover:bg-parchment hover:text-deep`}>Catering</Link>
        </div>
      </section>

      {/* Chanukah specials */}
      <section id="holiday" className="bg-ember text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-[72px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <span className={`${label} text-[#ffe2c7]`}>Limited time &middot; Holiday boards</span>
              <h2 className={h2}>{SITE.holidayHeading}</h2>
            </div>
            <Link href="/shop" className={`${linkLine} border-white text-white hover:text-white`}>See all holiday boards</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {holiday.length > 0
              ? holiday.map((p) => (
                  <article key={p.id} className="flex min-w-0 flex-col border-[3px] border-deep bg-deep">
                    <Link href={`/p/${p.slug}`} className="block">
                      <div className="stripe-dark aspect-[4/3]">
                        {p.photo_keys[0] && <img src={photoUrl(p.photo_keys[0])} alt={p.name} className="h-full w-full object-cover" />}
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-3 px-5 py-[18px]">
                      <div className="flex min-w-0 flex-col gap-1">
                        <Link href={`/p/${p.slug}`} className="font-label text-[22px] font-semibold uppercase tracking-[0.04em] text-parchment">{p.name}</Link>
                        <span className="font-label text-lg text-flame">{formatCents(p.price_cents)}</span>
                      </div>
                      {stockState(p).kind === "sold_out" ? (
                        <span className="font-label text-base uppercase tracking-[0.1em] text-flame">Sold out</span>
                      ) : (
                        <QuickAdd id={p.id} max={maxOrderable(p)} label="Add to cart" tone="flame" />
                      )}
                    </div>
                  </article>
                ))
              : HOLIDAY_PHOTOS.map((ph) => (
                  <article key={ph.src} className="flex min-w-0 flex-col border-[3px] border-deep bg-deep">
                    <Link href="/shop" className="block">
                      <img src={ph.src} alt={ph.alt} className="aspect-[4/3] w-full object-cover" />
                    </Link>
                    <div className="flex items-center justify-between gap-3 px-5 py-[18px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-label text-[22px] font-semibold uppercase tracking-[0.04em] text-parchment">[Holiday board]</span>
                        <span className="font-label text-lg text-flame">[PRICE]</span>
                      </div>
                      <Link href="/shop" className="inline-flex min-h-[46px] items-center whitespace-nowrap bg-flame px-[18px] font-label text-base font-semibold uppercase tracking-[0.1em] text-deep">Add to cart</Link>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section id="shop" className="mx-auto flex max-w-[1280px] flex-col gap-9 px-6 pb-16 pt-16 md:pt-[88px]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <span className={`${label} text-ember`}>&bull; From the smoker &bull;</span>
          <h2 className={h2}>Shop by category</h2>
        </div>
        <div className="grid grid-cols-2 gap-[18px] md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.id} href={`/shop/${c.slug}`} className="flex min-w-0 flex-col border-[3px] border-charcoal bg-paper text-charcoal">
              {c.photo_key || CATEGORY_PHOTO[c.slug] ? (
                <img src={c.photo_key ? photoUrl(c.photo_key) : CATEGORY_PHOTO[c.slug]} alt={c.name} className="aspect-square w-full object-cover" />
              ) : (
                <div role="img" aria-label={`Photo placeholder: ${c.name}`} className="stripe-dark aspect-square" />
              )}
              <div className="flex flex-col gap-1 border-t-[3px] border-charcoal px-4 py-3.5">
                <span className="font-display text-xl md:text-[22px]">{c.name}</span>
                <span className="font-label text-sm uppercase tracking-[0.08em] text-ember">{c.note}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="border-y-[3px] border-charcoal bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-9 px-6 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <span className={`${label} text-ember`}>&bull; Most ordered &bull;</span>
              <h2 className={h2}>Best sellers</h2>
            </div>
            <Link href="/shop" className={`${linkLine} border-charcoal text-charcoal hover:text-ember`}>Shop all</Link>
          </div>
          {best.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {best.map((p) => {
                const soldOut = stockState(p).kind === "sold_out";
                return (
                  <article key={p.id} className="flex min-w-0 flex-col border-[3px] border-charcoal bg-white">
                    <Link href={`/p/${p.slug}`} className="relative block">
                      <div className="stripe-dark aspect-square">
                        {p.photo_keys[0] && (
                          <img src={photoUrl(p.photo_keys[0])} alt={p.name} className={`h-full w-full object-cover ${soldOut ? "opacity-60" : ""}`} />
                        )}
                      </div>
                      {p.category_name && (
                        <span className="absolute left-3 top-3 bg-flame px-2.5 py-[5px] font-label text-[13px] font-semibold uppercase tracking-[0.12em] text-deep">{p.category_name}</span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col gap-2 p-[18px]">
                      <h3 className="font-display text-[22px] leading-tight">
                        <Link href={`/p/${p.slug}`}>{p.name}</Link>
                      </h3>
                      {p.description && <p className="line-clamp-2 text-sm leading-normal text-ink-soft">{p.description}</p>}
                      <span className="text-[13px] text-ink-soft">[★ rating · # reviews]</span>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-2.5">
                        <span className="font-label text-[22px] font-semibold">{formatCents(p.price_cents)}</span>
                        {soldOut ? <span className="font-label text-base uppercase tracking-[0.1em] text-ember">Sold out</span> : <QuickAdd id={p.id} max={maxOrderable(p)} />}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3.5 border-[3px] border-dashed border-charcoal px-6 py-5">
            <span className="font-display text-[22px]">Make it a spread</span>
            <div className="flex flex-wrap gap-2.5">
              {["[Sauces]", "[Pickles]", "[Wine]", "[Challah]"].map((a) => (
                <span key={a} className="inline-flex min-h-11 items-center border-2 border-charcoal px-4 font-label text-[15px] font-semibold uppercase tracking-[0.1em]">+ {a}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gifting */}
      <section id="gifts" className="border-y-[3px] border-charcoal bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-14 px-6 py-16 md:py-[88px]">
          <div role="img" aria-label="Photo placeholder: gift box with a printed message card" className="stripe-dark flex aspect-[4/3] min-w-0 flex-[1_1_440px] items-center justify-center border-[3px] border-charcoal">
            <div className="flex w-[58%] flex-col items-center gap-3 border-[3px] border-double border-charcoal bg-parchment p-7 text-center shadow-[0_16px_36px_rgba(0,0,0,0.45)]">
              <span className="font-label text-[13px] font-semibold uppercase tracking-[0.24em] text-ember">&bull; A gift for you &bull;</span>
              <span className="text-lg leading-normal">Your message, printed on a card and packed with the order.</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5">
            <span className={`${label} text-ember`}>&bull; Gifting &bull;</span>
            <h2 className="font-display text-[34px] leading-[1.04] md:text-5xl">A gift they&apos;ll actually eat</h2>
            <p className="text-base leading-[1.7] text-ink-soft">
              Boards and jerky make an easy gift. Write a note at checkout and we print it on a card that goes in the box.
            </p>
            <ul className="flex flex-col gap-2.5 font-label text-lg font-medium uppercase tracking-[0.04em]">
              {["Printed gift message card", "Bulk, Purim & holiday orders", "Certified kosher · CRC"].map((t) => (
                <li key={t} className="flex items-center gap-3"><span className="text-ember">&#10005;</span>{t}</li>
              ))}
            </ul>
            <div>
              <Link href="/shop/boards" className={`${btn} bg-charcoal text-parchment hover:bg-ember`}>Shop gift boards</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catering */}
      <section id="catering" className="bg-deep text-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-14 px-6 py-16 md:py-[88px]">
          <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
            <span className={`${label} text-flame`}>&bull; Catering &bull;</span>
            <h2 className="font-display text-[34px] leading-none md:text-[56px]">
              Bring Smoked Style
              <br />
              <span className="text-flame">to your simcha</span>
            </h2>
            <p className="max-w-[460px] text-[17px] leading-[1.7] text-[#cfc3b3]">
              Catering for simchas, gatherings and office lunches, all under CRC supervision. Tell us the date and headcount and we&apos;ll build the menu.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <CateringForm />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto flex max-w-[1280px] flex-col items-center gap-9 px-6 py-16 text-center md:py-[88px]">
        <div className="flex flex-col items-center gap-3">
          <span className={`${label} text-ember`}>[★★★★★ · # Google reviews]</span>
          <h2 className={h2}>Word from the table</h2>
        </div>
        <div className="grid w-full gap-5 text-left md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <figure key={i} className="m-0 flex min-w-0 flex-col gap-3.5 border-[3px] border-charcoal bg-paper p-6">
              <span aria-hidden="true" className="text-xl tracking-[4px] text-flame">★★★★★</span>
              <blockquote className="m-0 text-[17px] leading-normal">&ldquo;[Real customer review]&rdquo;</blockquote>
              <figcaption className="font-label text-[15px] font-semibold uppercase tracking-[0.12em] text-ink-soft">[Name] · [Product]</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}
