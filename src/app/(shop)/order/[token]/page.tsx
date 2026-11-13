import { notFound } from "next/navigation";
import { formatCents } from "@/lib/format";
import { getOrderByToken, STATUS_LABEL } from "@/lib/orders";
import { ClearCart } from "./ClearCart";

const PAY_LABEL: Record<string, string> = {
  unpaid: "Not paid yet",
  held: "Card held. Charged once we confirm",
  paid: "Paid",
  refunded: "Refunded",
  released: "Card hold released",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ placed?: string }>;
}) {
  const { token } = await params;
  const { placed } = await searchParams;
  const found = await getOrderByToken(token);
  if (!found) notFound();
  const { order, items } = found;

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-8">
      {placed && <ClearCart />}
      {placed && (
        <p className="rounded-lg bg-ok/10 px-4 py-3 text-ok">
          Thank you! Your order is in. Keep this page: it&apos;s your link to check on it.
        </p>
      )}
      <h1 className="font-display text-3xl font-bold">Order #{order.id}</h1>
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-parchment-dark text-ink">{STATUS_LABEL[order.status] ?? order.status}</span>
        <span className="badge bg-parchment-dark text-ink">{PAY_LABEL[order.payment_status] ?? order.payment_status}</span>
      </div>
      <div className="card space-y-1 p-4 text-sm">
        <p>
          <strong>{order.fulfillment === "delivery" ? "Delivery" : "Pickup"}</strong>
          {order.due_date && <> on {order.due_date}</>}
        </p>
        {order.delivery_address && <p className="text-ink-soft">{order.delivery_address}</p>}
        {order.gift_message && <p className="text-ink-soft">Gift message: {order.gift_message}</p>}
      </div>
      <div className="card space-y-2 p-4">
        <ul className="divide-y divide-line text-sm">
          {items.map((i, n) => (
            <li key={n} className="flex justify-between py-2">
              <span>{i.quantity} × {i.name}</span>
              <span>{formatCents(i.quantity * i.unit_price_cents)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCents(order.subtotal_cents)}</span></div>
        <div className="flex justify-between"><span>Sales tax</span><span>{formatCents(order.tax_cents)}</span></div>
        <div className="flex justify-between text-lg font-medium"><span>Total</span><span>{formatCents(order.total_cents)}</span></div>
      </div>
    </div>
  );
}
