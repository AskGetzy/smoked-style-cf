import Link from "next/link";

// Placeholder until the storefront step (step 4 of the plan).
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-display text-5xl font-bold">Smoked Style</h1>
      <p className="max-w-md text-ink-soft">
        Smoked meats, jerky, steaks and boards. Our online shop is opening soon.
      </p>
      <Link href="/admin" className="text-sm text-ink-soft underline">
        Staff login
      </Link>
    </main>
  );
}
