import type { Metadata } from "next";
import {
  Users2,
  Headset,
  Table2,
  MessageCircle,
  Globe,
  Database,
  Link2,
  ShieldCheck,
  Bot,
  Activity,
  Check,
  Webhook,
  Plug,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Integrações | APOTHEM AI",
  description:
    "Como a APOTHEM se conecta aos seus sistemas: categorias suportadas, ciclo de vida de conexão e segurança de credenciais.",
};

const CATEGORIES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Users2, title: "CRM", description: "Leitura e atualização controlada de clientes e oportunidades." },
  { icon: Headset, title: "Central de atendimento", description: "Tickets, filas e histórico de conversas." },
  { icon: Table2, title: "Planilhas & BI", description: "Dados estruturados como fonte de conhecimento ou consulta." },
  { icon: MessageCircle, title: "Comunicação", description: "Mensagens e notificações para times e operadores." },
  { icon: Globe, title: "API / REST", description: "Operações tipadas predefinidas, não acesso livre a qualquer URL." },
  { icon: Database, title: "Banco de dados", description: "Views aprovadas e templates de consulta parametrizados, não SQL irrestrito." },
];

const LIFECYCLE = [
  {
    icon: Link2,
    title: "Conectar",
    description: "Inicia OAuth com contexto de tenant/workspace; validação de state/PKCE no retorno.",
  },
  {
    icon: ShieldCheck,
    title: "Autorizar escopos mínimos",
    description: "O token é armazenado no cofre de segredos, nunca em texto puro ou em log.",
  },
  {
    icon: Bot,
    title: "Vincular ferramentas",
    description: "Um agente só usa as ferramentas explicitamente vinculadas à sua versão publicada.",
  },
  {
    icon: Activity,
    title: "Executar com isolamento",
    description: "O executor da ferramenta usa a credencial; o modelo de IA nunca a recebe.",
  },
];

const SECURITY_POINTS = [
  "Sem SQL irrestrito por padrão — apenas views aprovadas, templates parametrizados ou operações específicas",
  "Allowlist de host, validação de schema, timeout e limite de tamanho de resposta",
  "Resultados sanitizados e limitados antes de entrar no contexto do modelo",
  "Status de conexão distingue válida, degradada, expirada, revogada e permissão alterada",
  "Tokens de acesso e atualização nunca aparecem em log",
];

export default function IntegracoesPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Integrações
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Conecta ao que sua empresa{" "}
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              já usa
            </span>
            , sem expor credenciais ao modelo.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-text-muted">
            A arquitetura Connect traduz sistemas externos em ferramentas tipadas e auditáveis.
            Uma conexão sozinha não concede capacidade nenhuma a um agente — só ferramentas
            explicitamente vinculadas concedem.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, i) => (
            <Reveal key={category.title} delay={Math.min(i * 0.05, 0.3)}>
              <Card className="h-full">
                <category.icon className="h-5 w-5 text-accent" aria-hidden />
                <h2 className="font-heading mt-2 text-base font-bold">{category.title}</h2>
                <p className="mt-1 text-sm text-text-muted">{category.description}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Como uma integração funciona
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 rounded-xl border border-border bg-surface p-8 sm:grid-cols-2 lg:grid-cols-4">
            {LIFECYCLE.map((step, i) => (
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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Segurança nas integrações</h2>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SECURITY_POINTS.map((point, i) => (
            <Reveal key={point} delay={i * 0.05}>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                {point}
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">MCP e webhooks</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Reveal delay={0.05}>
              <Card className="h-full">
                <Plug className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="font-heading mt-2 text-base font-bold">Model Context Protocol</h3>
                <p className="mt-1 text-sm text-text-muted">
                  MCP dá interoperabilidade com servidores de ferramentas, mas a política da
                  APOTHEM continua sendo a autoridade. Uma ferramenta anunciada via MCP é
                  capacidade descoberta, não automaticamente autorizada — passa pelo mesmo
                  modelo de validação, vínculo, política e auditoria das ferramentas nativas.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card className="h-full">
                <Webhook className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="font-heading mt-2 text-base font-bold">Webhooks</h3>
                <p className="mt-1 text-sm text-text-muted">
                  Webhooks de entrada autenticam e verificam assinatura, deduplicam e enfileiram
                  o processamento. Webhooks de saída são assinados, com retry e backoff, log de
                  entrega e IDs de evento estáveis.
                </p>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Não vê o seu sistema na lista?"
        subtitle="Conectores específicos são desenhados junto com o time de Solutions."
        ctaLabel="Conversar sobre um conector"
      />

      <SiteFooter />
    </div>
  );
}
