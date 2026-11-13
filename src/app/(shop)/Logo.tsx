// Smoked Style marks, taken from the approved Logo board (SVG, no raster images).
const BRASS = "#B08D57";
const EMBER = "#9E3A1C";

/** Log-with-smoke mark used in the header (animated smoke via .ss-smoke). */
export function Logo({ className = "h-[46px] w-[46px]" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round" className={`${className} shrink-0`}>
      <path className="ss-smoke" d="M21 21 C17 16 25 13 21 6" stroke="#8C7F70" strokeWidth={1.3} />
      <path className="ss-smoke ss-smoke-2" d="M28 20 C25 16 31 13 28 8" stroke="#B3A796" strokeWidth={1.1} />
      <path d="M14 25 H37 A5 6 0 0 1 37 37 H14" stroke="#1C1714" strokeWidth={1.4} />
      <ellipse cx="14" cy="31" rx="5" ry="6" fill="#FBF8F2" stroke="#1C1714" strokeWidth={1.4} />
      <ellipse cx="14" cy="31" rx="2.2" ry="2.8" stroke={BRASS} strokeWidth={0.9} />
      <path d="M21 28.5 H31 M23 33.5 H34" stroke="#1C1714" strokeWidth={0.8} />
      <path d="M8 43 H42" stroke={BRASS} strokeWidth={0.9} />
      <circle cx="19" cy="40.5" r="1.3" fill={EMBER} stroke="none" />
      <circle cx="25" cy="41" r="1.1" fill={EMBER} stroke="none" />
      <circle cx="31" cy="40.5" r="1.3" fill={EMBER} stroke="none" />
    </svg>
  );
}

export function Wordmark({ size = "text-[26px]" }: { size?: string }) {
  return <span className={`whitespace-nowrap font-display font-semibold uppercase leading-none tracking-[0.16em] ${size}`}>Smoked Style</span>;
}

/** The full round seal ("Seal" on the Logo board). Footer only. */
export function Seal({ className = "h-[120px] w-[120px]" }: { className?: string }) {
  return (
    <svg role="img" aria-label="Smoked Style seal" viewBox="0 0 400 400" className={`${className} shrink-0`}>
      <defs>
        <path id="ssTopA" d="M 50 200 A 150 150 0 0 1 350 200" />
        <path id="ssBotA" d="M 38 200 A 162 162 0 0 0 362 200" />
      </defs>
      <circle cx="200" cy="200" r="190" fill="none" stroke="#1C1714" strokeWidth={1.5} />
      <circle cx="200" cy="200" r="182" fill="none" stroke="#1C1714" strokeWidth={0.6} />
      <circle cx="200" cy="200" r="124" fill="none" stroke="#1C1714" strokeWidth={1.2} />
      <circle cx="200" cy="200" r="118" fill="none" stroke={BRASS} strokeWidth={0.7} />
      <text fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight={600} fontSize={30} letterSpacing={11} fill="#1C1714">
        <textPath href="#ssTopA" startOffset="50%" textAnchor="middle">SMOKED STYLE</textPath>
      </text>
      <text fontFamily="Inter, sans-serif" fontWeight={500} fontSize={12} letterSpacing={7} fill="#6B5D50">
        <textPath href="#ssBotA" startOffset="50%" textAnchor="middle">SMOKEHOUSE · CATERING</textPath>
      </text>
      <path d="M44 200 l4 -4 l4 4 l-4 4z" fill={BRASS} />
      <path d="M348 200 l4 -4 l4 4 l-4 4z" fill={BRASS} />
      <g transform="translate(140 112) scale(2.5)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 21 C17 16 25 13 21 6" stroke="#8C7F70" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
        <path d="M28 20 C25 16 31 13 28 8" stroke="#B3A796" strokeWidth={1.3} vectorEffect="non-scaling-stroke" />
        <path d="M14 25 H37 A5 6 0 0 1 37 37 H14" stroke="#1C1714" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <ellipse cx="14" cy="31" rx="5" ry="6" fill="#FBF8F2" stroke="#1C1714" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        <ellipse cx="14" cy="31" rx="2.2" ry="2.8" stroke={BRASS} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <path d="M21 28.5 H31 M23 33.5 H34" stroke="#1C1714" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <path d="M8 43 H42" stroke={BRASS} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        <circle cx="19" cy="40.5" r="1.3" fill={EMBER} />
        <circle cx="25" cy="41" r="1.1" fill={EMBER} />
        <circle cx="31" cy="40.5" r="1.3" fill={EMBER} />
      </g>
    </svg>
  );
}
