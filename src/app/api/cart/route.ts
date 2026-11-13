import { getShopProductsByIds, maxOrderable, stockState } from "@/lib/products";

// Looks up current prices and limits for the items in a customer's cart.
// The browser only stores product ids and quantities; prices always come from here.
export async function POST(req: Request) {
  let ids: unknown;
  try {
    ids = ((await req.json()) as { ids?: unknown }).ids;
  } catch {
    return Response.json({ items: [] }, { status: 400 });
  }
  if (!Array.isArray(ids)) return Response.json({ items: [] }, { status: 400 });

  const clean = [...new Set(ids.filter((n): n is number => Number.isInteger(n)))].slice(0, 50);
  const products = await getShopProductsByIds(clean);

  return Response.json({
    items: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price_cents: p.price_cents,
      unit_label: p.unit_label,
      photo: p.photo_keys[0] ?? null,
      needs_approval: p.needs_approval,
      taxable: p.taxable,
      max: maxOrderable(p),
      sold_out: stockState(p).kind === "sold_out",
    })),
  });
}
