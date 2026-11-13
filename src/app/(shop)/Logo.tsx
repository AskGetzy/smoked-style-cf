// The approved Smoked Style seal (public/logo-seal.png). Multiply blend lets its cream
// background melt into whatever light surface it sits on.
export function Logo({ className = "h-[60px] w-[60px]" }: { className?: string }) {
  return <img src="/logo-seal.png" alt="" aria-hidden="true" className={`${className} shrink-0 mix-blend-multiply`} />;
}

export function Wordmark({ size = "text-[26px]" }: { size?: string }) {
  return <span className={`whitespace-nowrap font-display font-semibold uppercase leading-none tracking-[0.16em] ${size}`}>Smoked Style</span>;
}
