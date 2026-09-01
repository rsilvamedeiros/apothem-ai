import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import { Layers, Puzzle, Search, Map, Wrench, Repeat } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Soluções | APOTHEM AI",
  description:
    "Modelo de operação Product + Solutions da APOTHEM: implementações de cliente construídas sobre primitivos reutilizáveis da plataforma.",
};

const PROCESS = [
  {
    icon: Search,
    title: "Diagnóstico",
    description: "Entendemos o processo, os sistemas envolvidos e o resultado que a solução precisa entregar.",
  },
  {
    icon: Map,
    title: "Mapeamento em primitivos",
    description: "Desenhamos a solução usando os primitivos já existentes da Platform sempre que possível.",
  },
  {
    icon: Wrench,
    title: "Implementação",
    description: "Configuramos agentes, conhecimento, conexões e políticas específicas do seu caso de uso.",
  },
  {
    icon: Repeat,
    title: "Assinatura contínua",
    description: "A solução roda sobre a plataforma, com evolução e suporte contínuos.",
  },
];

const EXAMPLES = [
  {
    title: "Revisão financeira/documental",
    description: "Um documento entra na fila. O agente extrai campos, valida contra regras de negócio e sinaliza anomalias.",
  },
  {
    title: "Tratamento de exceção operacional",
    description: "Regras determinísticas filtram o caso; o agente analisa o contexto não estruturado e resolve ou escala.",
  },
  {
    title: "Assistente técnico interno",
    description: "O agente usa documentação e runbooks para diagnosticar problemas — ferramentas que alteram produção continuam restritas.",
  },
];

export default function SolucoesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Produto + Soluções
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Problemas reais de negócio, resolvidos com{" "}
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              primitivos reutilizáveis
            </span>
            .
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-text-muted">
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
            <h2 className="font-heading mt-2 text-base font-bold">Apothem Platform</h2>
            <p className="mt-1 text-sm text-text-muted">
              Capacidades de produto multi-tenant reutilizáveis: agentes, conhecimento,
              conexões, flow e control.
            </p>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="h-full">
            <Puzzle className="h-5 w-5 text-accent" aria-hidden />
            <h2 className="font-heading mt-2 text-base font-bold">Apothem Solutions</h2>
            <p className="mt-1 text-sm text-text-muted">
              Configuração, integração e implementação específicas do cliente, construídas
              sobre os primitivos da Platform, não código isolado de projeto.
            </p>
          </Card>
        </Reveal>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Como funciona uma Solution
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 rounded-xl border border-border bg-surface p-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.06} className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-raised">
                  <step.icon className="h-4 w-4 text-accent" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Exemplos de solução</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {EXAMPLES.map((example, i) => (
            <Reveal key={example.title} delay={i * 0.06}>
              <div className="flex flex-col gap-2 border-l-2 border-border pl-4">
                <h3 className="text-sm font-semibold">{example.title}</h3>
                <p className="text-sm text-text-muted">{example.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
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
