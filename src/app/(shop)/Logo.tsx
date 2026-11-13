// The badge photo has no smoke baked in; the wisps above the chimney are drawn here and animated.
export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  const wisp = "smoke-wisp fill-none";
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img src="/logo.png" alt="Smoked Style" className="h-full w-full rounded-full" />
      <svg
        viewBox="0 0 100 170"
        className="pointer-events-none absolute"
        style={{ left: "36%", top: "21%", width: "14%", height: "24%", overflow: "visible" }}
        aria-hidden="true"
      >
        <g className="smoke-sway">
          <path
            className={wisp}
            pathLength={100}
            stroke="#c4b49c"
            strokeWidth={9}
            strokeLinecap="round"
            style={{ animationDelay: "0s" }}
            d="M45 170 C 20 140, 75 120, 45 90 C 20 62, 60 40, 40 5"
          />
          <path
            className={wisp}
            pathLength={100}
            stroke="#8f7f6d"
            strokeWidth={8}
            strokeLinecap="round"
            style={{ animationDelay: "1.4s" }}
            d="M62 170 C 85 145, 40 125, 65 98 C 88 72, 52 50, 70 18"
          />
          <path
            className={wisp}
            pathLength={100}
            stroke="#c4b49c"
            strokeWidth={7}
            strokeLinecap="round"
            style={{ animationDelay: "2.8s" }}
            d="M52 170 C 30 150, 70 128, 52 100 C 36 76, 66 54, 50 22"
          />
        </g>
      </svg>
    </span>
  );
}
