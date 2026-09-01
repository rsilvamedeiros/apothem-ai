import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Preços | APOTHEM AI",
  description: "Planos APOTHEM AI: Starter, Business, Enterprise e Solutions.",
};

const TIERS = [
  {
    name: "Starter",
    description: "Para validar o primeiro caso de uso com um design partner.",
    features: ["Seats e agentes limitados", "Uso incluído para piloto", "Suporte por e-mail"],
  },
  {
    name: "Business",
    description: "Para operar múltiplos workspaces em produção.",
    features: ["Mais workspaces e conectores", "Fila de aprovações", "Retenção estendida e acesso à API"],
  },
  {
    name: "Enterprise",
    description: "Para requisitos de segurança e governança corporativa.",
    features: ["SSO e políticas avançadas", "Auditoria avançada", "Limites dedicados e suporte contratual"],
  },
];

export default function PrecosPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">Preços</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Um plano para cada estágio de adoção.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-text-muted">
            Ainda não publicamos valores fechados: o modelo comercial evolui junto com o uso
            medido de cada cliente. Fale com a gente para uma proposta de acordo com o seu
            caso de uso.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-8 sm:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <Card className="flex h-full flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">{tier.name}</h2>
                <p className="mt-1 text-sm text-text-muted">{tier.description}</p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-text-muted">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-8">
        <Reveal>
          <Card>
            <h2 className="text-lg font-semibold">Solutions</h2>
            <p className="mt-1 text-sm text-text-muted">
              Implementação e integração específicas do seu negócio, combinadas com a
              assinatura contínua da plataforma. Veja como em{" "}
              <a href="/solucoes" className="text-accent hover:underline">
                Soluções
              </a>
              .
            </p>
          </Card>
        </Reveal>
      </section>

      <CtaBanner
        title="Quer uma proposta sob medida?"
        subtitle="Fale com a gente e definimos o plano certo para o seu estágio."
        ctaLabel="Falar com vendas"
      />

      <SiteFooter />
    </div>
  );
}
