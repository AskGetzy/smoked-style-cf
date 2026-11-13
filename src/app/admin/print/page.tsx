import { listPrintJobs } from "@/lib/printing";
import { reprint, testCard } from "./actions";

const KIND: Record<string, string> = { gift_card: "Gift card", label: "Label" };
const STATUS: Record<string, string> = {
  waiting: "bg-warn/15 text-warn",
  printed: "bg-ok/15 text-ok",
  failed: "bg-ember/15 text-ember",
};

export default async function PrintPage() {
  const jobs = await listPrintJobs();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Printing</h1>
        <form action={testCard}>
          <button className="btn-primary">Print a test gift card</button>
        </form>
      </div>
      <p className="text-sm text-ink-soft">
        Gift cards are queued automatically when an order with a gift message is paid. The printer picks them up within a few
        seconds. &ldquo;Waiting&rdquo; for a long time means the Raspberry Pi is off or can&apos;t reach the internet.
      </p>
      {jobs.length === 0 ? (
        <p className="card p-6 text-center text-ink-soft">Nothing has been queued yet.</p>
      ) : (
        <ul className="card divide-y divide-line">
          {jobs.map((j) => (
            <li key={j.id} className="flex items-center gap-3 p-3 text-sm">
              <span className="w-10 text-ink-soft">#{j.id}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">
                  {KIND[j.kind] ?? j.kind}
                  {j.order_id ? <span className="text-ink-soft"> · order #{j.order_id}{j.customer ? ` · ${j.customer}` : ""}</span> : <span className="text-ink-soft"> · test</span>}
                </div>
                <div className="text-xs text-ink-soft">{new Date(j.created_at).toLocaleString("en-US", { timeZone: "America/New_York" })}</div>
              </div>
              <span className={`badge ${STATUS[j.status]}`}>{j.status}</span>
              <form action={reprint.bind(null, j.id)}>
                <button className="btn-ghost px-3 py-1.5">Reprint</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
