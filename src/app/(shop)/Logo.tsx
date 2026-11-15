// The approved Smoked Style badge (public/brand). Transparent PNG, so it sits on any surface.
export function Logo({ size = 84, hi = false, className = "" }: { size?: number; hi?: boolean; className?: string }) {
  return (
    <img
      src={hi ? "/brand/badge-512.png" : "/brand/badge-256.png"}
      alt="Smoked Style, CRC certified, since 2015"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`block shrink-0 ${className}`}
    />
  );
}
