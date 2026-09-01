import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

/**
 * Marketing CTA anchor (pill, gradient + hover glow for primary). Distinct
 * from @apothem/ui's Button, which stays flat/conservative for future
 * product-app use — this styling is intentionally more expressive and
 * belongs only to the site.
 */
export function CtaLink({ href, children, variant = "primary", className }: CtaLinkProps) {
  if (variant === "secondary") {
    return (
      <Link
        href={href}
        className={`group inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent ${className ?? ""}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent to-info px-5 py-3 text-sm font-semibold text-on-accent shadow-[0_0_0_0_var(--apothem-accent)] transition-all hover:shadow-[0_0_24px_-4px_var(--apothem-accent)] ${className ?? ""}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
