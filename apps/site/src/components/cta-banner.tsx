import { Reveal } from "@/components/motion/reveal";
import { CtaLink } from "@/components/cta-link";

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
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-text-muted">{subtitle}</p>}
        </div>
        <CtaLink href={href} className="shrink-0">
          {ctaLabel}
        </CtaLink>
      </Reveal>
    </section>
  );
}
