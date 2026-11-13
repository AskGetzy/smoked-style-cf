// The approved Smoked Style seal (public/logo-seal.png) with live smoke drawn over the log.
// Transparent PNG, so it sits cleanly on any surface.
const WISP = { stroke: "#B08D57", strokeWidth: 5, fill: "none", strokeLinecap: "round" as const };

export function Logo({ className = "h-[60px] w-[60px]" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img src="/logo-seal.png" alt="" aria-hidden="true" className="h-full w-full" />
      <svg aria-hidden="true" viewBox="0 0 800 800" className="pointer-events-none absolute inset-0 h-full w-full">
        <path className="ss-wisp" style={{ animationDelay: "0s" }} d="M400 372 C360 330 440 290 395 250 C365 220 410 195 400 178" {...WISP} />
        <path className="ss-wisp" style={{ animationDelay: "1.4s" }} d="M352 372 C325 340 372 315 350 285 C338 268 352 258 346 246" {...WISP} strokeWidth={4} />
        <path className="ss-wisp" style={{ animationDelay: "2.6s" }} d="M450 372 C422 335 478 312 455 280 C443 262 458 250 452 236" {...WISP} strokeWidth={4} />
      </svg>
    </span>
  );
}
