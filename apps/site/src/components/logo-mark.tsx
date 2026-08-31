/** Restrained geometric brand mark (core-to-edge motif), per docs/13-design-system. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="1" y="1" width="22" height="22" rx="6" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" />
      <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />
    </svg>
  );
}
