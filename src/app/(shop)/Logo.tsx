// Smoked Style marks, taken from the approved Logo board (SVG, no raster images).
const BRASS = "#B08D57";
const EMBER = "#9E3A1C";

/** Smoker badge from the approved header design (animated smoke via .ss-smoke). */
const SMOKER = (
  <>
    <rect x="52" y="48" width="11" height="22" rx="2" fill="#F5F0E6" />
    <rect x="34" y="68" width="76" height="34" rx="17" fill="#F5F0E6" />
    <rect x="66" y="78" width="20" height="5" rx="2.5" fill="#C8461F" />
    <rect x="108" y="76" width="22" height="26" rx="4" fill="#F5F0E6" />
    <path d="M119 98 C113 94 114 87 119 81 C120 86 124 88 124 93 C124 96 122 98 119 98Z" fill="#C8461F" />
    <rect x="44" y="100" width="6" height="22" rx="3" fill="#F5F0E6" />
    <rect x="94" y="100" width="6" height="22" rx="3" fill="#F5F0E6" />
    <path d="M60 128 C54 124 56 118 60 114 C61 118 64 119 64 123 C64 126 62 128 60 128Z M80 130 C72 125 74 116 80 110 C81 116 86 118 86 124 C86 128 83 130 80 130Z M100 128 C94 124 96 118 100 114 C101 118 104 119 104 123 C104 126 102 128 100 128Z" fill="#F2A93B" />
  </>
);

export function Logo({ className = "h-[52px] w-[52px]" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 160" fill="none" strokeLinecap="round" className={`${className} shrink-0`}>
      <circle cx="80" cy="86" r="62" fill="#1C1714" />
      <path className="ss-smoke" d="M58 44 C48 32 64 22 56 4" stroke="#B9AE9F" strokeWidth={7} />
      <path className="ss-smoke ss-smoke-2" d="M72 40 C66 30 78 22 72 8" stroke="#D3CABD" strokeWidth={6} />
      {SMOKER}
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
