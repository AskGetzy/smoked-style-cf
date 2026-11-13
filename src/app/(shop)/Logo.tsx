// The smoker mark from the approved logo, with two wisps of animated smoke.
export function Logo({ className = "h-[59px] w-[62px]", light = false }: { className?: string; light?: boolean }) {
  const body = "#1A120D";
  const line = light ? "#F3EADB" : "#FBF6EC";
  return (
    <svg aria-hidden="true" viewBox="0 0 116 110" className={className}>
      <path className="ss-smoke" d="M29 38 C21 30 37 24 29 16 C23 10 31 6 31 2" stroke="#F2A93B" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      <path className="ss-smoke ss-smoke-2" d="M40 34 C34 28 46 22 40 14" stroke="#E4572E" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <rect x="23" y="38" width="13" height="14" fill={body} />
      <rect x="20" y="35" width="19" height="5" rx="1.5" fill={body} />
      <rect x="8" y="50" width="78" height="34" rx="17" fill={body} />
      <path d="M10 66 H84" stroke={line} strokeWidth={2.5} />
      <rect x="39" y="57" width="18" height="4.5" rx="2.25" fill="#E4572E" />
      <rect x="86" y="58" width="26" height="26" rx="3" fill={body} />
      <circle cx="99" cy="71" r="4.5" fill="#E4572E" />
      <circle cx="99" cy="71" r="2" fill="#F2A93B" />
      <path d="M22 84 L16 104 M72 84 L78 104 M19 95 H75" stroke={body} strokeWidth={4} strokeLinecap="round" fill="none" />
      <circle cx="79" cy="103" r="5" fill={body} />
    </svg>
  );
}

export function Wordmark({ size = "text-[30px]" }: { size?: string }) {
  return (
    <span className={`font-display font-extrabold leading-none tracking-tight ${size}`}>
      Smoked <span className="text-ember">Style</span>
    </span>
  );
}
