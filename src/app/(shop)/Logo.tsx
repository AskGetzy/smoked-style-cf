// The SS monogram seal with a wisp of animated smoke, from the approved logo.
export function Logo({ className = "h-[58px] w-[44px]" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 44 58" className={className}>
      <path className="ss-smoke" d="M20 15 C16 11 24 8 20 3" stroke="#8C7F70" strokeWidth={1.3} fill="none" strokeLinecap="round" />
      <path className="ss-smoke ss-smoke-2" d="M25 14 C22 11 28 8 25 4" stroke="#B3A796" strokeWidth={1.1} fill="none" strokeLinecap="round" />
      <circle cx="22" cy="37" r="20" fill="none" stroke="#1C1714" strokeWidth={1.2} />
      <circle cx="22" cy="37" r="16.5" fill="none" stroke="#B08D57" strokeWidth={0.8} />
      <text x="22" y="43.5" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontStyle="italic" fontWeight={600} fontSize={19} fill="#1C1714">
        SS
      </text>
    </svg>
  );
}

export function Wordmark({ size = "text-[26px]" }: { size?: string }) {
  return <span className={`whitespace-nowrap font-display font-semibold uppercase leading-none tracking-[0.16em] ${size}`}>Smoked Style</span>;
}
