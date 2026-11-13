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

const eyebrow = "text-[13px] font-bold uppercase tracking-[0.2em]";
const h2 = "font-display font-bold tracking-tight text-[48px] leading-[1.1]";
const photoPh = "stripe-dark flex items-end p-4 text-xs uppercase tracking-[0.12em] text-[#c9b79e]";

export default async function Home() {
  const [categories, products, holiday] = await Promise.all([listCategories(), listShopProducts(), listHolidayProducts()]);
  const best = [...products].sort((a, b) => b.order_count - a.order_count || a.sort_order - b.sort_order).slice(0, 4);
  const holidayHeading = SITE.holidayName[0].toUpperCase() + SITE.holidayName.slice(1);

  return (
    <div>
      {/* Hero */}
      <section id="top" className="bg-char text-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-14 px-6 pb-24 pt-20">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-7">
            <span className="inline-flex items-center gap-2.5 self-start rounded-full border-[1.5px] border-gold px-4 py-2 text-[13px] font-bold uppercase tracking-[0.14em] text-gold">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Certified kosher · CRC
            </span>
            <h1 className="font-display text-[clamp(48px,6vw,88px)] font-extrabold leading-none tracking-[-0.02em]">
              Low and slow.
              <br />
              <em className="font-medium text-fire">Worth the wait.</em>
            </h1>
            <p className="max-w-[520px] text-[19px] leading-relaxed text-[#d8c8b0]">
              Real hardwood smoke, real bark, made in small batches. Jerky, smoked steaks and boards you can&apos;t get from a
              deli case. Pre-order online and pick up fresh.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/shop" className="inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-ember px-7 text-[17px] font-bold text-white hover:bg-ember-dark">
                Shop the smokehouse
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </Link>
              <Link href="/#holiday" className="inline-flex min-h-[52px] items-center rounded-full border-2 border-gold px-7 text-[17px] font-bold text-gold">
                {holidayHeading}
              </Link>
            </div>
          </div>
          <div className="relative min-w-0 flex-[1_1_480px]">
            <div role="img" aria-label="Photo placeholder: sliced smoked brisket on dark slate" className={`${photoPh} aspect-[5/4] rounded-[20px] p-6 text-[13px] tracking-[0.14em]`}>
              [Hero photo — overhead on dark slate, smoke ring visible]
            </div>
            <div className="absolute -bottom-7 -left-5 flex items-center gap-3.5 rounded-2xl bg-paper px-5 py-4 text-ink shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
              <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C9431C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 0-7.5z" />
                <path d="M6 21h12" />
              </svg>
              <div>
                <div className="font-display text-xl font-bold">{SITE.smokeHours} on the smoke</div>
                <div className="text-sm text-ink-soft">{SITE.woodType} · smoked in-house</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Holiday specials */}
      <section id="holiday" className="bg-ember text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-[72px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2.5">
              <p className={`${eyebrow} text-[#ffe7c2]`}>Limited run · order by {SITE.holidayOrderBy}</p>
              <h2 className="font-display text-[52px] font-extrabold leading-tight tracking-tight">{holidayHeading}</h2>
            </div>
            <Link href="/shop" className="py-2.5 text-base font-bold text-white">See all holiday boards &rarr;</Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {holiday.length > 0
              ? holiday.map((p) => (
                  <article key={p.id} className="flex min-w-0 flex-[1_1_280px] flex-col overflow-hidden rounded-[18px] bg-char">
                    <Link href={`/p/${p.slug}`} className="block">
                      <div className="stripe-dark aspect-[4/3]">
                        {p.photo_keys[0] && <img src={photoUrl(p.photo_keys[0])} alt={p.name} className="h-full w-full object-cover" />}
                      </div>
                    </Link>
                    <div className="flex items-center justify-between gap-3 p-5">
                      <div className="flex flex-col gap-1">
                        <Link href={`/p/${p.slug}`} className="font-display text-[22px] font-bold text-parchment">{p.name}</Link>
                        <span className="text-base font-bold text-gold">{formatCents(p.price_cents)}</span>
                      </div>
                      {stockState(p).kind === "sold_out" ? (
                        <span className="text-sm font-bold text-gold">Sold out</span>
                      ) : (
                        <QuickAdd id={p.id} max={maxOrderable(p)} label="Pre-order" tone="gold" />
                      )}
                    </div>
                  </article>
                ))
              : ["[Photo — themed Chanukah board]", "[Photo — jerky gift box]", "[Photo — party platter]"].map((ph) => (
                  <article key={ph} className="flex min-w-0 flex-[1_1_280px] flex-col overflow-hidden rounded-[18px] bg-char">
                    <div role="img" aria-label="Photo placeholder" className={`${photoPh} aspect-[4/3]`}>{ph}</div>
                    <div className="flex items-center justify-between gap-3 p-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-display text-[22px] font-bold text-parchment">[Holiday board name]</span>
                        <span className="text-base font-bold text-gold">[PRICE]</span>
                      </div>
                      <span className="inline-flex min-h-11 items-center rounded-full bg-gold px-[18px] text-[15px] font-bold text-char">Pre-order</span>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="shop" className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-9 px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={h2}>Shop by the cut</h2>
            <Link href="/shop" className="py-2.5 text-base font-bold text-ember underline">View everything &rarr;</Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="flex min-w-0 flex-[1_1_200px] flex-col gap-3.5 text-ink">
                <div role="img" aria-label={`Photo placeholder: ${c.name}`} className={`${photoPh} aspect-[4/5] rounded-2xl`}>[Photo]</div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-[26px] font-bold">{c.name}</span>
                  <span className="text-sm text-ink-soft">{CATEGORY_NOTE[c.slug] ?? ""}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      {best.length > 0 && (
        <section className="mx-auto flex max-w-[1280px] flex-col gap-9 px-6 pb-14 pt-[88px]">
          <div className="flex flex-col gap-2.5">
            <p className={`${eyebrow} text-ember`}>Most ordered</p>
            <h2 className={h2}>Best sellers</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {best.map((p) => {
              const soldOut = stockState(p).kind === "sold_out";
              return (
                <article key={p.id} className="flex min-w-0 flex-[1_1_260px] flex-col overflow-hidden rounded-[18px] border border-line bg-paper">
                  <Link href={`/p/${p.slug}`} className="relative block">
                    <div className="stripe-dark aspect-[4/3]">
                      {p.photo_keys[0] && (
                        <img src={photoUrl(p.photo_keys[0])} alt={p.name} className={`h-full w-full object-cover ${soldOut ? "opacity-60" : ""}`} />
                      )}
                    </div>
                    {p.category_name && (
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-gold px-2.5 py-1.5 text-xs font-bold uppercase tracking-widest text-char">
                        {p.category_name}
                      </span>
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <h3 className="font-display text-2xl font-bold">
                      <Link href={`/p/${p.slug}`}>{p.name}</Link>
                    </h3>
                    <span className="text-sm text-ink-soft">[★ rating · # reviews]</span>
                    {p.description && <p className="line-clamp-2 text-[15px] leading-normal text-ink-soft">{p.description}</p>}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <span className="text-xl font-bold">{formatCents(p.price_cents)}</span>
                      {soldOut ? <span className="text-sm font-bold text-ember">Sold out</span> : <QuickAdd id={p.id} max={maxOrderable(p)} />}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Add-ons */}
      <section className="mx-auto max-w-[1280px] px-6 pb-[88px]">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-6 rounded-[20px] border border-line bg-paper p-8">
          <div className="flex flex-[1_1_300px] flex-col gap-2">
            <h2 className="font-display text-[32px] font-bold">Make it a spread</h2>
            <p className="text-base leading-normal text-ink-soft">Add extras to any order at checkout.</p>
          </div>
          <div className="flex flex-[2_1_520px] flex-wrap gap-3">
            {["[Sauce trio]", "[Pickles]", "[Wine]", "[Challah]"].map((a) => (
              <span key={a} className="inline-flex min-h-12 items-center gap-2.5 rounded-full border-[1.5px] border-char px-5 text-[15px] font-bold">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How pre-ordering works */}
      <section className="border-y border-line bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10 px-6 py-20">
          <h2 className={h2}>How pre-ordering works</h2>
          <ol className="flex flex-wrap gap-8">
            {[
              ["01", "Pick your cuts", "Order before the cutoff. Some items are limited each batch, so popular ones can sell out."],
              ["02", "Check out as a guest", "No account needed. You pay at checkout and get an email link to track your order."],
              ["03", "Pick up fresh", `Collect on ${SITE.pickupDay} at ${SITE.pickupLocation}. We'll email you when it's ready.`],
            ].map(([n, t, d]) => (
              <li key={n} className="flex min-w-0 flex-[1_1_260px] flex-col gap-3 border-t-[3px] border-ember pt-5">
                <span className="font-display text-[40px] italic text-ember">{n}</span>
                <h3 className="text-[21px] font-bold">{t}</h3>
                <p className="text-base leading-relaxed text-ink-soft">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Gifts */}
      <section id="gifts" className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-14 px-6 py-[88px]">
        <div role="img" aria-label="Photo placeholder: gift box with printed message card" className="stripe-dark flex aspect-[4/3] min-w-0 flex-[1_1_440px] items-center justify-center rounded-[20px]">
          <div className="flex w-[62%] flex-col gap-3.5 rounded-md border-t-[5px] border-fire bg-paper p-7 shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
            <span className="text-xs uppercase tracking-[0.18em] text-ink-soft">A gift for you</span>
            <span className="font-display text-2xl italic leading-snug">&ldquo;Your message, printed on a card and packed with the order.&rdquo;</span>
            <span className="text-sm text-ink-soft">&mdash; from the sender</span>
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[22px]">
          <p className={`${eyebrow} text-ember`}>Gifting</p>
          <h2 className={h2}>Send something they&apos;ll actually eat.</h2>
          <p className="text-lg leading-relaxed text-ink-soft">
            Boards and jerky packs make easy gifts. Write a note at checkout and we print it on a card that goes in the box.
          </p>
          <ul className="flex flex-col gap-3 text-[17px]">
            {["Printed gift message card", "Bulk, Purim and holiday orders welcome", "Certified kosher by CRC"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9431C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5 9-10" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
          <div>
            <Link href="/shop/boards" className="inline-flex min-h-[52px] items-center rounded-full bg-char px-7 text-[17px] font-bold text-parchment">
              Shop gift boards
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-line bg-paper">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-9 px-6 py-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div aria-hidden="true" className="flex gap-1 text-fire">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
                </svg>
              ))}
            </div>
            <h2 className="font-display text-[44px] font-bold">What customers are saying</h2>
            <span className="text-[15px] text-ink-soft">{SITE.reviewCount}</span>
          </div>
          <div className="flex w-full flex-wrap gap-5 text-left">
            {[1, 2, 3].map((i) => (
              <figure key={i} className="m-0 flex min-w-0 flex-[1_1_280px] flex-col gap-3.5 rounded-2xl border border-dashed border-[#b5a48f] bg-parchment p-6">
                <blockquote className="m-0 font-display text-xl italic leading-snug">[Customer review]</blockquote>
                <figcaption className="text-sm font-bold text-ink-soft">[Customer name] · [Product]</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Catering */}
      <section id="catering" className="bg-char text-parchment">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-start gap-14 px-6 py-24">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-[22px]">
            <p className={`${eyebrow} text-gold`}>Catering</p>
            <h2 className="font-display text-[56px] font-bold leading-[1.05] tracking-tight">Bring the smokehouse to your event.</h2>
            <p className="max-w-[520px] text-lg leading-relaxed text-[#d8c8b0]">
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
