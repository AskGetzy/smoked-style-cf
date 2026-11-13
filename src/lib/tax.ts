// Rockland County, NY combined sales tax. Change here if the accountant says otherwise.
export const TAX_RATE = 0.08375;

/** Hold the card (authorize only) when the order is due within this many days; otherwise charge now. */
export const HOLD_WINDOW_DAYS = 5;

export function calcTax(taxableCents: number): number {
  return Math.round(taxableCents * TAX_RATE);
}

/** Today's date in New York as YYYY-MM-DD. */
export function todayNY(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

export function daysUntil(dateStr: string): number {
  const [y1, m1, d1] = todayNY().split("-").map(Number);
  const [y2, m2, d2] = dateStr.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}
