import type { Metadata } from "next";
import { X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { ApothemDiagram } from "@/components/apothem-diagram";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Sobre | APOTHEM AI",
  description:
    "North star, princípios de produto e engenharia, e os limites explícitos do que a APOTHEM não tenta ser.",
};

const PRINCIPLES = [
  { title: "Inteligência precisa se conectar à operação", body: "Uma resposta que não pode usar ou afetar o contexto de negócio tem valor operacional limitado." },
  { title: "Menor privilégio antes de máxima autonomia", body: "A capacidade do agente é limitada por permissões explícitas, políticas de ferramenta e exigência de aprovação." },
  { title: "Aprovação humana é primitivo de produto", body: "Não é uma limitação temporária da qualidade do modelo. É um mecanismo permanente de governança." },
  { title: "Modelos são provedores substituíveis", body: "As capacidades do provedor importam, mas o modelo de domínio da APOTHEM sobrevive a trocas de provedor." },
  { title: "Toda execução importante é rastreável", body: "O sistema explica qual versão de agente, decisão de modelo, fonte e aprovação participou de um resultado." },
  { title: "Lógica determinística continua determinística", body: "Não pedimos a um modelo de linguagem que decida fatos ou regras que o código pode aplicar de forma confiável." },
  { title: "Comportamento de IA precisa ser avaliado", body: "\"Funcionou no meu chat\" não é padrão de qualidade. Mantemos datasets e critérios de aceitação mensuráveis." },
  { title: "Multi-tenancy é estrutural", body: "Isolamento de tenant não é uma convenção de query adicionada depois." },
  { title: "Complexidade precisa se justificar", body: "Não adicionamos infraestrutura distribuída porque a visão é grande. Começamos modular e extraímos com evidência." },
  { title: "Soluções precisam fortalecer a plataforma", body: "Trabalho específico de cliente deve criar primitivos de plataforma reutilizáveis sempre que possível." },
];

const NON_GOALS = [
  { title: "Substituto de ERP", body: "Integramos com sistemas de registro. Não replicamos suítes completas de finanças, RH, CRM ou supply chain." },
  { title: "Plataforma no-code genérica na v1", body: "Um editor visual de workflow pode vir depois. A prioridade é um modelo de execução confiável, não um canvas." },
  { title: "Agentes autônomos irrestritos", body: "Autonomia é limitada por escopo de ferramenta, política e regras de aprovação — não há acesso irrestrito a sistema/banco." },
  { title: "Marketplace no MVP", body: "Templates e conectores reutilizáveis são arquitetados para isso, mas a economia de marketplace público é pós-MVP." },
  { title: "Promessa de raciocínio perfeito", body: "A promessa do produto é assistência/ação controlada e observável — não infalibilidade." },
];

export default function SobrePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-8 pt-20 lg:grid-cols-[1.1fr_0.6fr]">
        <div className="flex flex-col gap-4">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Sobre a APOTHEM
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              O apótema é o segmento do{" "}
              <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
                centro
              </span>{" "}
              até a borda.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-text-muted">
              É por isso que escolhemos o nome: colocamos a inteligência no centro do negócio,
              conectada às bordas operacionais — sistemas, pessoas, processos e políticas.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="flex justify-center">
          <ApothemDiagram className="h-40 w-40 sm:h-56 sm:w-56" />
        </Reveal>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-text-subtle">
              North star
            </span>
            <p className="font-heading mt-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              Tornar-se a camada de inteligência entre as empresas, seus dados, seus sistemas e
              suas operações.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Princípios</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Regras que orientam decisão de produto e engenharia, não slogans soltos.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {PRINCIPLES.map((principle, i) => (
            <Reveal key={principle.title} delay={Math.min(i * 0.04, 0.3)} className="flex gap-4">
              <span className="font-heading shrink-0 text-2xl font-bold text-border-strong">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-sm font-semibold">{principle.title}</h3>
                <p className="mt-1 text-sm text-text-muted">{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">O que não somos</h2>
            <p className="mt-2 max-w-2xl text-text-muted">
              Ambição sem limite explícito vira promessa vazia. Estes são os limites deliberados.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {NON_GOALS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06} className="flex items-start gap-3 rounded-md border border-border bg-surface p-4">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Quer entender se a APOTHEM se encaixa no seu caso?"
        subtitle="Conversamos com honestidade sobre onde a plataforma está hoje."
      />

      <SiteFooter />
    </div>
  );
}
