import { CartView } from "./CartView";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Your cart</h1>
      <CartView />
    </div>
  );
}
