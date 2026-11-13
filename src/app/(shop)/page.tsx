import Link from "next/link";
import { formatCents } from "@/lib/format";
import { listCategories, listHolidayProducts, listShopProducts, maxOrderable, photoUrl, stockState } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CateringForm } from "./CateringForm";
import { QuickAdd } from "./QuickAdd";

const CATEGORY_NOTE: Record<string, string> = {
  jerky: "Packs & bulk",
  steaks: "Smoked & raw",
  boards: "For sharing",
  smoked: "Ready to eat",
  "non-smoked": "Fresh cuts",
};

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.3em]";
const h2 = "font-display text-[36px] font-medium leading-[1.1] md:text-[54px]";
const btn = "inline-flex min-h-[52px] items-center justify-center rounded-[2px] px-8 text-[12px] font-medium uppercase tracking-[0.16em] md:text-[13px]";
const photoPh = "stripe-dark flex items-end p-4 text-[11px] uppercase tracking-[0.14em] text-[#B3A796]";
const romans = ["i.", "ii.", "iii."];

export default async function Home() {
  const [categories, products, holiday] = await Promise.all([listCategories(), listShopProducts(), listHolidayProducts()]);
  const best = [...products].sort((a, b) => b.order_count - a.order_count || a.sort_order - b.sort_order).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section id="top" className="bg-char text-[#EDE6DA]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-12 px-6 pb-16 pt-14 md:gap-16 md:pb-28 md:pt-24">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-7">
            <p className={`${eyebrow} flex items-center gap-4 text-brass`}>
              <span aria-hidden="true" className="h-px w-10 bg-brass" />
              Under CRC supervision
            </p>
            <h1 className="font-display text-[clamp(48px,7vw,92px)] font-medium leading-[0.98] tracking-[-0.01em]">
              Low and slow.
              <br />
              <em className="font-medium text-brass">Worth the wait.</em>
            </h1>
            <p className="max-w-[500px] text-[17px] leading-[1.7] text-[#B3A796]">
              Real hardwood smoke and real bark, made in small batches. Jerky, smoked steaks and boards, pre-ordered online and
              picked up fresh.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/shop" className={`${btn} bg-ember text-white hover:bg-ember-dark`}>Shop the smokehouse</Link>
              <Link href="/#catering" className={`${btn} border border-[#EDE6DA]/50 text-[#EDE6DA] hover:border-brass hover:text-brass`}>Catering</Link>
            </div>
          </div>
          <div className="min-w-0 flex-[1_1_480px]">
            <div role="img" aria-label="Photo placeholder: sliced smoked brisket on dark slate" className={`${photoPh} aspect-[5/4] rounded-[2px]`}>
              [Hero photo — overhead on dark slate, smoke ring visible]
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#B3A796]">
              {SITE.smokeHours} on the smoke &middot; {SITE.woodType}
            </p>
          </div>
        </div>
      </section>

      {/* Holiday */}
      <section id="holiday" className="bg-[#1F1915] text-[#EDE6DA]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className={`${eyebrow} text-brass`}>Limited run &middot; order by {SITE.holidayOrderBy}</p>
              <h2 className={h2}>{SITE.holidayHeading}</h2>
            </div>
            <Link href="/shop" className="py-3 text-xs font-medium uppercase tracking-[0.16em] text-brass">View the collection &rarr;</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {holiday.length > 0
              ? holiday.map((p) => (
                  <article key={p.id} className="flex min-w-0 flex-col gap-4">
                    <Link href={`/p/${p.slug}`} className="block">
                      <div className="stripe-dark aspect-[4/3] overflow-hidden rounded-[2px]">
                        {p.photo_keys[0] && <img src={photoUrl(p.photo_keys[0])} alt={p.name} className="h-full w-full object-cover" />}
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-col gap-1">
                        <Link href={`/p/${p.slug}`} className="font-display text-2xl font-medium">{p.name}</Link>
                        <span className="text-sm text-brass">{formatCents(p.price_cents)}</span>
                      </div>
                      {stockState(p).kind === "sold_out" ? (
                        <span className="text-xs uppercase tracking-[0.16em] text-brass">Sold out</span>
                      ) : (
                        <QuickAdd id={p.id} max={maxOrderable(p)} label="Pre-order" tone="gold" />
                      )}
                    </div>
                  </article>
                ))
              : ["[Photo — themed Chanukah board]", "[Photo — jerky gift box]", "[Photo — party platter]"].map((ph) => (
                  <article key={ph} className="flex min-w-0 flex-col gap-4">
                    <div role="img" aria-label="Photo placeholder" className={`${photoPh} aspect-[4/3] rounded-[2px]`}>{ph}</div>
                    <div className="flex flex-col gap-1">
                      <span className="font-display text-2xl font-medium">[Holiday board name]</span>
                      <span className="text-sm text-brass">[PRICE]</span>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="shop" className="border-b border-line bg-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-16 md:py-24">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className={`${eyebrow} text-ember`}>The smokehouse</p>
            <h2 className={h2}>Shop by the cut</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="group flex min-w-0 flex-[1_1_200px] flex-col gap-4 text-center text-ink">
                <div role="img" aria-label={`Photo placeholder: ${c.name}`} className={`${photoPh} aspect-[3/4] rounded-[2px]`}>[Photo]</div>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-[26px] font-medium group-hover:text-ember">{c.name}</span>
                  <span className="text-[11px] uppercase tracking-[0.22em] text-ink-soft">{CATEGORY_NOTE[c.slug] ?? ""}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      {best.length > 0 && (
        <section className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 pb-8 pt-16 md:pt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className={`${eyebrow} text-ember`}>Most ordered</p>
              <h2 className={h2}>Best sellers</h2>
            </div>
            <Link href="/shop" className="py-3 text-xs font-medium uppercase tracking-[0.16em] text-ink hover:text-ember">Shop all &rarr;</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {best.map((p) => {
              const soldOut = stockState(p).kind === "sold_out";
              return (
                <article key={p.id} className="flex min-w-0 flex-col gap-4">
                  <Link href={`/p/${p.slug}`} className="block">
                    <div className="stripe-dark aspect-square overflow-hidden rounded-[2px]">
                      {p.photo_keys[0] && (
                        <img src={photoUrl(p.photo_keys[0])} alt={p.name} className={`h-full w-full object-cover ${soldOut ? "opacity-60" : ""}`} />
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col gap-2">
                    {p.category_name && <span className="text-[10px] uppercase tracking-[0.24em] text-ink-soft">{p.category_name}</span>}
                    <h3 className="font-display text-2xl font-medium leading-tight">
                      <Link href={`/p/${p.slug}`}>{p.name}</Link>
                    </h3>
                    {p.description && <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>}
                    <span className="text-xs text-ink-soft">[★ rating · # reviews]</span>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <span className="text-base font-medium">{formatCents(p.price_cents)}</span>
                      {soldOut ? <span className="text-xs uppercase tracking-[0.16em] text-ember">Sold out</span> : <QuickAdd id={p.id} max={maxOrderable(p)} />}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Add-ons */}
      <section className="mx-auto max-w-[1280px] px-6 pb-16 md:pb-24">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-line py-6">
          <span className="font-display text-2xl italic">Make it a spread &mdash;</span>
          {["[Sauces]", "[Pickles]", "[Wine]", "[Challah]"].map((a) => (
            <span key={a} className="py-2 text-xs font-medium uppercase tracking-[0.16em] text-ink">+ {a}</span>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-6 py-16 md:py-24">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className={`${eyebrow} text-ember`}>How it works</p>
            <h2 className={h2}>Pre-order, then pick up</h2>
          </div>
          <ol className="flex flex-wrap gap-10">
            {[
              ["Choose your cuts", "Order before the cutoff. Some items are limited each batch, so popular ones can sell out."],
              ["Check out as a guest", "No account needed. You pay at checkout and get an email link to track your order."],
              ["Pick up fresh", `Collect on ${SITE.pickupDay} at ${SITE.pickupLocation}. We'll email you when it's ready.`],
            ].map(([t, d], i) => (
              <li key={t} className="flex min-w-0 flex-[1_1_260px] flex-col gap-3 border-t border-line pt-6">
                <span className="font-display text-4xl italic text-brass">{romans[i]}</span>
                <h3 className="font-display text-[26px] font-medium">{t}</h3>
                <p className="text-[15px] leading-[1.7] text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Gifts */}
      <section id="gifts" className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-12 px-6 py-16 md:gap-16 md:py-24">
        <div role="img" aria-label="Photo placeholder: gift box with printed message card" className="stripe-dark flex aspect-[4/3] min-w-0 flex-[1_1_440px] items-center justify-center rounded-[2px]">
          <div className="flex w-[58%] flex-col gap-3 border border-brass bg-char p-7 text-[#EDE6DA]">
            <span className="text-[10px] uppercase tracking-[0.26em] text-brass">A gift for you</span>
            <span className="font-display text-2xl italic leading-snug">&ldquo;Your message, printed on a card and packed with the order.&rdquo;</span>
            <span className="text-xs text-[#B3A796]">&mdash; from the sender</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
          <p className={`${eyebrow} text-ember`}>Gifting</p>
          <h2 className={h2}>A gift they&apos;ll actually eat.</h2>
          <p className="text-[17px] leading-[1.7] text-ink-soft">
            Boards and jerky packs make easy gifts. Write a note at checkout and we print it on a card that goes in the box.
          </p>
          <ul className="flex flex-col text-[15px]">
            {["Printed gift message card", "Bulk, Purim and holiday orders welcome", "Certified kosher by CRC"].map((t) => (
              <li key={t} className="border-t border-line py-3 last:border-b">{t}</li>
            ))}
          </ul>
          <div>
            <Link href="/shop/boards" className={`${btn} bg-char text-[#EDE6DA] hover:bg-ember`}>Shop gift boards</Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-10 px-6 py-16 text-center md:py-24">
          <div className="flex flex-col items-center gap-3">
            <p className={`${eyebrow} text-ember`}>Reviews</p>
            <h2 className={h2}>From our customers</h2>
            <span className="text-sm text-ink-soft">[★★★★★ · # reviews]</span>
          </div>
          <div className="flex w-full flex-wrap gap-6 text-left">
            {[1, 2, 3].map((i) => (
              <figure key={i} className="m-0 flex min-w-0 flex-[1_1_280px] flex-col gap-4 border border-dashed border-[#c9bda9] bg-parchment p-7">
                <blockquote className="m-0 font-display text-2xl italic leading-snug">[Customer review]</blockquote>
                <figcaption className="text-[11px] uppercase tracking-[0.2em] text-ink-soft">[Customer name] · [Product]</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Catering */}
      <section id="catering" className="bg-char text-[#EDE6DA]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-12 px-6 py-16 md:gap-16 md:py-28">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
            <p className={`${eyebrow} text-brass`}>Catering</p>
            <h2 className="font-display text-[40px] font-medium leading-[1.05] md:text-[64px]">
              The smokehouse,
              <br />
              <em className="text-brass">at your table.</em>
            </h2>
            <p className="max-w-[500px] text-[17px] leading-[1.7] text-[#B3A796]">
              Small catering for gatherings, simchas and office lunches, all under CRC supervision. Tell us the date and
              headcount and we&apos;ll put a menu together.
            </p>
          </div>
          <div className="min-w-0 flex-[1_1_420px]">
            <CateringForm />
          </div>
        </div>
      </section>
    </div>
  );
}
