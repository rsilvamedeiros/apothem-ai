import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import { Layers, Puzzle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Soluções | APOTHEM AI",
  description:
    "Modelo de operação Product + Solutions da APOTHEM: implementações de cliente construídas sobre primitivos reutilizáveis da plataforma.",
};

export default function SolucoesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Produto + Soluções
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Problemas reais de negócio, resolvidos com primitivos reutilizáveis.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-text-muted">
            A APOTHEM pode resolver problemas concretos da empresa antes que toda a plataforma
            seja self-service, sem virar uma fábrica de software genérica cujos projetos não
            fortalecem o núcleo.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-8 sm:grid-cols-2">
        <Reveal>
          <Card className="h-full">
            <Layers className="h-5 w-5 text-accent" aria-hidden />
            <h2 className="mt-2 text-base font-semibold">Apothem Platform</h2>
            <p className="mt-1 text-sm text-text-muted">
              Capacidades de produto multi-tenant reutilizáveis: agentes, conhecimento,
              conexões, flow e control.
            </p>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="h-full">
            <Puzzle className="h-5 w-5 text-accent" aria-hidden />
            <h2 className="mt-2 text-base font-semibold">Apothem Solutions</h2>
            <p className="mt-1 text-sm text-text-muted">
              Configuração, integração e implementação específicas do cliente, construídas
              sobre os primitivos da Platform, não código isolado de projeto.
            </p>
          </Card>
        </Reveal>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-text-muted">
          <Reveal>
            <p>
              Uma solução só justifica um novo primitivo de plataforma quando é provavelmente
              reutilizável entre clientes, estrategicamente diferenciadora, necessária para
              prontidão enterprise, ou melhora materialmente a arquitetura da plataforma.
              Dívida de customização é rastreada deliberadamente.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Tem um caso de uso específico em mente?"
        subtitle="Vamos entender o problema e desenhar a solução junto com você."
        ctaLabel="Conversar com a gente"
      />

      <SiteFooter />
    </div>
  );
}
