import { todayNY } from "@/lib/tax";
import { CheckoutForm } from "./CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <CheckoutForm today={todayNY()} />
    </div>
  );
}
