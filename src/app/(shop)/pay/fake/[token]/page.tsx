import { notFound, redirect } from "next/navigation";
import { formatCents } from "@/lib/format";
import { getOrderByToken } from "@/lib/orders";
import { PayForm } from "./PayForm";

export default async function FakePayPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const found = await getOrderByToken(token);
  if (!found) notFound();
  const { order } = found;
  if (order.payment_status !== "unpaid" || order.status === "cancelled") redirect(`/order/${token}`);

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-8">
      <p className="rounded-lg bg-warn/15 px-4 py-3 text-sm text-warn">
        <strong>TEST MODE.</strong> No real money moves. Use card 4242 4242 4242 4242, any future date, any CVC.
        (4000 0000 0000 0002 is declined.)
      </p>
      <h1 className="font-display text-3xl font-bold">Payment</h1>
      <div className="card space-y-1 p-4">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>{formatCents(order.total_cents)}</span>
        </div>
        {order.payment_mode === "hold" && (
          <p className="text-sm text-ink-soft">Your card is only held. It&apos;s charged once we confirm your order.</p>
        )}
      </div>
      <PayForm token={token} />
    </div>
  );
}
