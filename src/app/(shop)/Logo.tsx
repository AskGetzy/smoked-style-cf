export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M6 24h36a0 0 0 0 1 0 0c0 7-8 12-18 12S6 31 6 24z" />
        <rect x="10" y="38" width="3" height="7" rx="1" />
        <rect x="35" y="38" width="3" height="7" rx="1" />
        <rect x="30" y="8" width="5" height="12" rx="1" />
        <path d="M20 6c-2 3 2 4 0 8 3-1 4-5 0-8z" opacity=".7" />
      </g>
    </svg>
  );
}
