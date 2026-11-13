// Payments sit behind this small layer so the real Stripe can replace the fake one later
// without touching checkout or the order pages.
//
// FAKE MODE (what runs today): no money moves. Checkout sends the customer to /pay/fake/<token>,
// a stand-in card page. Test cards:
//   4242 4242 4242 4242  -> approved
//   4000 0000 0000 0002  -> declined
//   4000 0000 0000 9995  -> insufficient funds
export const TEST_CARDS = {
  ok: "4242424242424242",
  declined: "4000000000000002",
  noFunds: "4000000000009995",
};

export function paymentUrl(token: string): string {
  return `/pay/fake/${token}`;
}

export function judgeFakeCard(raw: string): { ok: true } | { ok: false; message: string } {
  const n = raw.replace(/\D/g, "");
  if (n === TEST_CARDS.ok) return { ok: true };
  if (n === TEST_CARDS.declined) return { ok: false, message: "Your card was declined." };
  if (n === TEST_CARDS.noFunds) return { ok: false, message: "Your card has insufficient funds." };
  return { ok: false, message: "Test mode: use card 4242 4242 4242 4242 with any future date and any CVC." };
}
