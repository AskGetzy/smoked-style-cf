import Link from "next/link";
import { formatCents } from "@/lib/format";
import { listCategories, listShopProducts, maxOrderable, photoUrl, stockState } from "@/lib/products";
import { SITE } from "@/lib/site";
import { CateringForm } from "./CateringForm";
import { QuickAdd } from "./QuickAdd";

const CATEGORY_BLURB: Record<string, string> = {
  jerky: "Packs & bulk",
  steaks: "Smoked & raw",
  boards: "For sharing",
  smoked: "Ready to eat",
  "non-smoked": "Fresh cuts",
};

export default async function Home() {
  const [categories, products] = await Promise.all([listCategories(), listShopProducts()]);
  const best = [...products].sort((a, b) => b.order_count - a.order_count || a.sort_order - b.sort_order).slice(0, 4);
  const heroPhoto = best.find((p) => p.photo_keys[0])?.photo_keys[0];
  const pickup = SITE.pickupLocation && SITE.pickupHours;

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div className="space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-ember">Hardwood smoked &middot; made to order</p>
          <h1 className="font-display text-5xl font-bold leading-[1.05] text-char sm:text-6xl">
            Low and slow.
            <br />
            <em className="font-normal">Worth the wait.</em>
          </h1>
          <p className="max-w-sm text-ink-soft">
            Jerky, steaks, smoked meats and boards, built in small batches. Pre-order online, add a gift note, and pick up
            fresh.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className="rounded-full bg-ember px-6 py-3 font-medium text-paper hover:bg-ember-dark">
              Shop the smokehouse &rarr;
            </Link>
            <Link href="/#catering" className="rounded-full border border-char/60 px-6 py-3 font-medium hover:bg-parchment-dark">
              Book catering
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="stripe-dark aspect-[4/3] overflow-hidden rounded-3xl">
            {heroPhoto && <img src={photoUrl(heroPhoto)} alt="" className="h-full w-full object-cover" />}
          </div>
          {SITE.smokeNote && (
            <div className="absolute -bottom-4 left-4 rounded-xl bg-paper px-4 py-3 shadow-lg">
              <p className="font-display text-lg font-semibold">{SITE.smokeNote}</p>
            </div>
          )}
        </div>
      </section>

      {/* Shop by the cut */}
      <section className="border-y border-line bg-paper/60">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-3xl font-bold text-char sm:text-4xl">Shop by the cut</h2>
            <Link href="/shop" className="text-sm font-medium text-ember underline">View everything &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link key={c.id} href={`/shop/${c.slug}`} className="group space-y-2">
                <div className="stripe-light aspect-[4/5] rounded-2xl transition group-hover:brightness-95" />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-xl font-semibold">{c.name}</span>
                  <span className="text-xs text-ink-soft">{CATEGORY_BLURB[c.slug] ?? ""}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best sellers */}
      {best.length > 0 && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:px-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ember">Most ordered</p>
              <h2 className="font-display text-3xl font-bold text-char sm:text-4xl">Best sellers</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {best.map((p) => {
                const soldOut = stockState(p).kind === "sold_out";
                return (
                  <div key={p.id} className="card overflow-hidden">
                    <Link href={`/p/${p.slug}`} className="relative block">
                      <div className="stripe-dark aspect-[4/3]">
                        {p.photo_keys[0] && (
                          <img src={photoUrl(p.photo_keys[0])} alt={p.name} className={`h-full w-full object-cover ${soldOut ? "opacity-60" : ""}`} />
                        )}
                      </div>
                      {p.category_name && (
                        <span className="absolute left-3 top-3 rounded-full bg-paper px-3 py-1 text-[10px] font-medium uppercase tracking-wider">
                          {p.category_name}
                        </span>
                      )}
                    </Link>
                    <div className="space-y-2 p-4">
                      <Link href={`/p/${p.slug}`} className="block font-display text-xl font-semibold leading-snug">{p.name}</Link>
                      {p.description && <p className="line-clamp-2 text-sm text-ink-soft">{p.description}</p>}
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-medium">
                          {formatCents(p.price_cents)}
                          {p.unit_label && <span className="text-sm text-ink-soft"> / {p.unit_label}</span>}
                        </span>
                        {soldOut ? <span className="text-sm text-ember">Sold out</span> : <QuickAdd id={p.id} max={maxOrderable(p)} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How pre-ordering works */}
      <section className="border-y border-line bg-paper/60">
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-14 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-char sm:text-4xl">How pre-ordering works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              ["01", "Pick your cuts", "Order ahead of time. Some items are limited each batch, so popular ones can sell out."],
              ["02", "Check out as a guest", "No account needed. You pay at checkout and get an email link to track your order."],
              [
                "03",
                "Pick up fresh",
                pickup
                  ? `Collect at ${SITE.pickupLocation}, ${SITE.pickupHours}. We'll email you when it's ready.`
                  : "Pick a date at checkout and we'll email you when it's ready.",
              ],
            ].map(([n, t, d]) => (
              <div key={n} className="border-t-2 border-char pt-5">
                <p className="font-display text-2xl italic text-ember">{n}</p>
                <h3 className="mt-2 font-medium">{t}</h3>
                <p className="mt-1 text-sm text-ink-soft">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gifting */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
          <div className="stripe-light flex aspect-[4/3] items-center justify-center rounded-3xl p-8">
            <div className="w-full max-w-xs rounded-lg bg-paper p-5 shadow-lg">
              <p className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">A gift for you</p>
              <p className="mt-2 font-display text-lg italic">&ldquo;Your message, printed on a card and packed with the order.&rdquo;</p>
              <p className="mt-2 text-xs text-ink-soft">&mdash; from the sender</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ember">Gifting</p>
            <h2 className="font-display text-3xl font-bold text-char sm:text-4xl">Send something they&apos;ll actually eat.</h2>
            <p className="text-ink-soft">
              Boards and jerky packs make easy gifts. Write a note at checkout and we print it on a card that goes in the box.
            </p>
            <ul className="space-y-1 text-sm">
              {["Printed gift message card", "Bulk and holiday orders welcome", "Labeled and packed in-house"].map((t) => (
                <li key={t} className="flex gap-2"><span className="text-ember">&#10003;</span>{t}</li>
              ))}
            </ul>
            <Link href="/shop/boards" className="inline-block rounded-full border border-char/60 px-5 py-2.5 text-sm font-medium hover:bg-parchment-dark">
              Shop gift boards
            </Link>
          </div>
        </div>
      </section>

      {/* Catering */}
      <section id="catering" className="bg-[#1f1510] text-parchment">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-ember">Catering</p>
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">Bring the smokehouse to your event.</h2>
            <p className="max-w-sm text-parchment/70">
              Small catering for gatherings, simchas and office lunches. Tell us the date and headcount and we&apos;ll put a menu
              together.
            </p>
          </div>
          <CateringForm />
        </div>
      </section>
    </div>
  );
}
