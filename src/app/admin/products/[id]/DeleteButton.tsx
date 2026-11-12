"use client";

import { useState } from "react";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn-danger">
        Delete
      </button>
    );
  }

  return (
    <form action={action} className="flex items-center gap-2">
      <span className="text-sm text-ink-soft">Delete for good?</span>
      <button type="submit" className="btn-danger">
        Yes, delete
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="btn-ghost">
        Keep
      </button>
    </form>
  );
}
