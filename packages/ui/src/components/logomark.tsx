import type { SVGAttributes } from "react";

export type LogomarkProps = SVGAttributes<SVGSVGElement> & {
  size?: number;
};

/**
 * Core-to-edge geometric mark (docs/13-design-system/foundations-tokens.md):
 * a fixed core square with edge nodes, no gradients/neon.
 */
export function Logomark({ size = 24, ...props }: LogomarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="1" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="19" y="1" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="1" y="19" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="19" y="19" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <path d="M5 3H10M14 3H19M5 21H10M14 21H19M3 5V10M3 14V19M21 5V10M21 14V19" stroke="currentColor" strokeWidth="1" opacity="0.35" />
    </svg>
  );
}
