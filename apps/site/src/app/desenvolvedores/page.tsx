import type { Metadata } from "next";
import {
  KeyRound,
  ListOrdered,
  AlertOctagon,
  Radio,
  Gauge,
  Webhook,
  Search,
  FileCode,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { CodeBlock } from "@/components/code-block";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Desenvolvedores | APOTHEM AI",
  description:
    "APOTHEM é API-first mesmo quando o único consumidor inicial é o nosso próprio app: recursos tipados, idempotência, paginação por cursor e webhooks assinados.",
};

const ENDPOINTS = [
  "POST   /v1/organizations/:orgId/workspaces",
  "GET    /v1/workspaces/:workspaceId/agents",
  "PATCH  /v1/agents/:agentId/draft",
  "POST   /v1/agents/:agentId/publish",
  "POST   /v1/agents/:agentId/runs",
  "GET    /v1/runs/:runId",
  "POST   /v1/runs/:runId/cancel",
  "POST   /v1/approvals/:approvalId/approve",
];

const CONVENTIONS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: KeyRound,
    title: "Credenciais escopadas",
    description: "Credenciais de API pertencem a um principal de tenant e expõem escopos explícitos, nunca acesso amplo implícito.",
  },
  {
    icon: ListOrdered,
    title: "Paginação por cursor",
    description: "Coleções grandes usam cursor estável, não offset de banco — seguro mesmo em tabelas de eventos de alto crescimento.",
  },
  {
    icon: AlertOctagon,
    title: "Erros normalizados",
    description: "Formato de erro estável com código, mensagem e requestId. Nunca expomos stack trace, token ou segredo de provedor.",
  },
  {
    icon: Radio,
    title: "Streaming com recuperação",
    description: "Eventos de run referenciam estado persistido. Se o stream cair, o cliente recupera com GET /runs/:id.",
  },
  {
    icon: Gauge,
    title: "Idempotência",
    description: "Endpoints de criação/ação aceitam chave de idempotência onde execução duplicada seria prejudicial.",
  },
  {
    icon: Webhook,
    title: "Webhooks assinados",
    description: "Payload com ID de evento, tipo, versão de schema e assinatura HMAC. Retry com backoff exponencial.",
  },
];

const API_ROADMAP = [
  {
    icon: Search,
    title: "MVP",
    description: "API privada/estável usada pelo web da APOTHEM e por design partners selecionados.",
  },
  {
    icon: FileCode,
    title: "Pós-MVP",
    description: "Documentação pública formal, API keys/service accounts, webhooks, cotas de uso e SDK TypeScript.",
  },
  {
    icon: Code2,
    title: "Depois",
    description: "SDK Python, superfícies de agente white-label/embedded, SDK de conector e APIs de marketplace.",
  },
];

export default function DesenvolvedoresPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-8 pt-20 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Para desenvolvedores
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              API-first, mesmo quando o único{" "}
              <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
                consumidor
              </span>{" "}
              somos nós.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-text-muted">
              O próprio app da APOTHEM consome os mesmos contratos que um cliente externo vai
              usar. Comandos de ciclo de vida (publicar, aprovar, cancelar) são endpoints
              explícitos, não CRUD disfarçado.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <CodeBlock lines={ENDPOINTS} />
        </Reveal>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Convenções</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONVENTIONS.map((item, i) => (
              <Reveal key={item.title} delay={Math.min(i * 0.05, 0.3)} className="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-5">
                <item.icon className="h-5 w-5 text-accent" aria-hidden />
                <div>
                  <h3 className="font-heading text-sm font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Roadmap da API pública</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Lançamento de API pública exige garantias de compatibilidade mais fortes do que
            rotas internas — não expomos endpoints moldados pela implementação antes da hora.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {API_ROADMAP.map((stage, i) => (
            <Reveal key={stage.title} delay={i * 0.08}>
              <div className="flex flex-col gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-raised">
                  <stage.icon className="h-4 w-4 text-accent" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{stage.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{stage.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Quer acesso antecipado à API?"
        subtitle="Design partners ajudam a moldar os contratos antes da documentação pública."
      />

      <SiteFooter />
    </div>
  );
}
