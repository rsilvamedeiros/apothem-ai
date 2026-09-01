import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Roadmap | APOTHEM AI",
  description:
    "Onde a APOTHEM está hoje e as fases até um produto enterprise-ready — sem promessa de data, com critérios de saída explícitos.",
};

type Phase = {
  number: string;
  title: string;
  status: "Em andamento" | "Planejado";
  description: string;
  details?: string[];
};

const PHASES: Phase[] = [
  {
    number: "00",
    title: "Fundação",
    status: "Em andamento",
    description:
      "Documentação, arquitetura, scaffold do repositório, desenvolvimento local, CI e o esqueleto de identidade/tenancy.",
  },
  {
    number: "01",
    title: "Core Agents",
    status: "Planejado",
    description:
      "Organizações/workspaces, draft e versão de agente, gateway de modelo, runs, streaming de status e histórico de execução.",
    details: [
      "Publicar um agente cria uma versão imutável",
      "Um run sempre referencia a versão exata que o gerou",
      "Adaptador mock garante CI determinístico; um provedor real já funciona atrás do gateway",
    ],
  },
  {
    number: "02",
    title: "Knowledge",
    status: "Planejado",
    description:
      "Bases de conhecimento, upload, ingestão assíncrona, parsing, chunking, embeddings/índice híbrido, evidência de fonte e vínculo com agentes.",
    details: [
      "Filtragem por permissão verificada antes da resposta, não depois",
      "Conjunto de avaliação de recuperação com respostas conhecidas",
      "Reprocessamento nunca corrompe a identidade da fonte",
    ],
  },
  {
    number: "03",
    title: "Connect + Actions",
    status: "Planejado",
    description:
      "Modelo de conexão e segredos, primeiro conector relevante para design partner, ferramentas tipadas de leitura/ação, motor de política e aprovação humana.",
    details: [
      "O modelo nunca invoca uma ferramenta não vinculada",
      "Aprovação pausa o run de forma durável; ação rejeitada não tem efeito colateral",
      "Ação aprovada é idempotente; trilha de auditoria completa",
    ],
  },
  {
    number: "04",
    title: "Flow",
    status: "Planejado",
    description:
      "Definições e execuções de workflow versionadas, com nós de gatilho, condição, agente, ferramenta, aprovação e saída.",
  },
  {
    number: "05",
    title: "Control / Enterprise",
    status: "Planejado",
    description:
      "Auditoria avançada, SSO/SCIM, controles de retenção, dashboards de avaliação, orçamentos e políticas enterprise.",
  },
  {
    number: "06",
    title: "Ecossistema",
    status: "Planejado",
    description:
      "API/SDK público, SDK de conector, templates/marketplace e capacidades white-label/embedded.",
  },
];

export default function RoadmapPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Roadmap
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Onde estamos, com{" "}
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              honestidade
            </span>{" "}
            sobre o estágio.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-text-muted">
            A APOTHEM está em fase de fundação. Preferimos mostrar isso com clareza a prometer
            uma data que não vamos cumprir. Cada fase abaixo tem critério de saída explícito,
            não apenas um nome bonito.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8">
        <div className="relative flex flex-col">
          <div className="absolute bottom-6 left-5 top-6 w-px bg-border" aria-hidden />
          {PHASES.map((phase, i) => (
            <Reveal key={phase.number} delay={Math.min(i * 0.05, 0.3)} className="relative flex gap-6 pb-10 last:pb-0">
              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  phase.status === "Em andamento"
                    ? "border-accent bg-accent-muted text-accent"
                    : "border-border bg-surface text-text-subtle"
                }`}
              >
                {phase.number}
              </span>
              <div className="flex flex-1 flex-col gap-2 pt-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-heading text-lg font-bold">{phase.title}</h2>
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[11px] font-medium ${
                      phase.status === "Em andamento"
                        ? "bg-accent-muted text-accent"
                        : "border border-border text-text-subtle"
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>
                <p className="text-sm text-text-muted">{phase.description}</p>
                {phase.details && (
                  <ul className="mt-1 flex flex-col gap-1.5">
                    {phase.details.map((detail) => (
                      <li key={detail} className="text-xs text-text-subtle before:mr-2 before:content-['→']">
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Quer ser um dos primeiros design partners?"
        subtitle="Fases iniciais têm mais espaço para moldar o que construímos a seguir."
      />

      <SiteFooter />
    </div>
  );
}
