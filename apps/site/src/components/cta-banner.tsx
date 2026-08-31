import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";

export function CtaBanner({
  title,
  subtitle,
  ctaLabel = "Falar com a gente",
  href = "/contato",
}: {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  href?: string;
}) {
  return (
    <section className="border-b border-border bg-surface/40">
      <Reveal className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-text-muted">{subtitle}</p>}
        </div>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
        >
          {ctaLabel}
        </Link>
      </Reveal>
    </section>
  );
}
