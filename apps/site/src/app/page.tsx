import {
  Search,
  Plug,
  Brain,
  Zap,
  ShieldCheck,
  FileSearch,
  ScrollText,
  Building2,
  Wrench,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  Check,
  X,
  KeyRound,
  Lock,
  Users2,
  Headset,
  Table2,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroPreview } from "@/components/hero-preview";
import { LoopFlowDiagram } from "@/components/loop-flow-diagram";
import { AgentConfigPreview } from "@/components/agent-config-preview";
import { EvidencePreview } from "@/components/evidence-preview";
import { AuditLogPreview } from "@/components/audit-log-preview";
import { Faq } from "@/components/faq";
import { LeadForm } from "@/components/lead-form";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

const TRUST_POINTS: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "Aprovação humana em toda ação de risco" },
  { icon: FileSearch, text: "Evidência rastreável até a fonte" },
  { icon: ScrollText, text: "Auditoria completa, do primeiro run em diante" },
];

const RISKS = [
  "Agentes com acesso amplo demais e sem trilha de auditoria",
  "Respostas sem evidência, difíceis de confiar em decisões reais",
  "Automação que ninguém revisa antes de agir sobre um sistema real",
];

const iconClass = "h-5 w-5 text-accent";

const LOOP_STEPS = [
  {
    icon: <Search className={iconClass} aria-hidden />,
    title: "Entender",
    body: "Contexto de negócio, políticas e conhecimento autorizado.",
  },
  {
    icon: <Plug className={iconClass} aria-hidden />,
    title: "Conectar",
    body: "Sistemas, dados e ferramentas reais da empresa.",
  },
  {
    icon: <Brain className={iconClass} aria-hidden />,
    title: "Raciocinar",
    body: "Decisões dentro de limites explícitos, com evidência.",
  },
  {
    icon: <Zap className={iconClass} aria-hidden />,
    title: "Agir",
    body: "Execução autorizada, com aprovação e auditoria.",
  },
];

const SHOWCASE = [
  {
    name: "Apothem Knowledge",
    description: "Cada resposta baseada em conhecimento corporativo cita a fonte de onde veio.",
    preview: <EvidencePreview />,
    span: "lg:col-span-7 lg:row-span-2",
  },
  {
    name: "Apothem Agents",
    description: "Agentes configurados com objetivo, conhecimento, ferramentas e permissões claras.",
    preview: <AgentConfigPreview />,
    span: "lg:col-span-5",
  },
  {
    name: "Apothem Control",
    description: "Toda ação relevante fica registrada, com identidade, política e decisão.",
    preview: <AuditLogPreview />,
    span: "lg:col-span-5",
  },
];

const DIFFERENTIATORS = [
  {
    title: "Chatbot genérico",
    description: "Responde perguntas, mas não age nos seus sistemas nem preserva evidência.",
    highlight: false,
  },
  {
    title: "Construir internamente",
    description: "Alto custo de engenharia para reconstruir aprovação, auditoria e evidência do zero.",
    highlight: false,
  },
  {
    title: "APOTHEM",
    description: "Plataforma pronta, com aprovação, auditoria e evidência desde o primeiro agente.",
    highlight: true,
  },
];

const SECURITY_HIGHLIGHTS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Isolamento multi-tenant",
    description: "Contexto de organização e workspace resolvido pela identidade autenticada, nunca pelo cliente.",
  },
  {
    icon: KeyRound,
    title: "Segredos criptografados",
    description: "Credenciais nunca chegam ao modelo ou à UI — o executor da ferramenta usa identidade de servidor.",
  },
  {
    icon: Lock,
    title: "Falha para o lado seguro",
    description: "Autorização ambígua nega por padrão. Aprovação expirada nunca é aprovada automaticamente.",
  },
];

const INTEGRATION_CATEGORIES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Users2, title: "CRM", description: "Leitura e atualização controlada de clientes e oportunidades." },
  { icon: Headset, title: "Central de atendimento", description: "Tickets, filas e histórico de conversas." },
  { icon: Table2, title: "Planilhas & BI", description: "Dados estruturados como fonte de conhecimento ou consulta." },
  { icon: MessageCircle, title: "Comunicação", description: "Mensagens e notificações para times e operadores." },
];

const PERSONAS: { icon: LucideIcon; role: string; need: string }[] = [
  { icon: Building2, role: "Dono do negócio", need: "Controle e valor mensurável, sem acesso não governado." },
  { icon: Wrench, role: "Builder / Automation Lead", need: "Configurar comportamento sem reescrever a plataforma." },
  { icon: UserCheck, role: "Operador de negócio", need: "Resultado do trabalho, com evidência e próximos passos claros." },
  { icon: ShieldAlert, role: "Segurança / Auditoria", need: "Histórico completo de identidade, política, ferramenta e decisão." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <Reveal>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
                Plataforma de IA para empresas
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Dê aos seus agentes de IA{" "}
                <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
                  o contexto certo
                </span>{" "}
                e o controle que sua empresa exige.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-lg text-text-muted">
                A APOTHEM conecta conhecimento, sistemas e políticas da sua empresa a agentes de
                IA que executam trabalho real, com evidência, aprovação humana e auditoria
                completa em cada ação.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-strong"
                >
                  Solicitar demonstração
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-border-strong"
                >
                  Ver como funciona
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="mt-2 flex flex-col gap-2 text-sm text-text-muted">
                {TRUST_POINTS.map((point) => (
                  <li key={point.text} className="flex items-center gap-2">
                    <point.icon className="h-4 w-4 text-accent" aria-hidden />
                    {point.text}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4 text-xs text-text-subtle">
                <span>Aplicável a</span>
                {["Suporte", "Financeiro", "Operações", "TI"].map((area) => (
                  <span key={area} className="rounded-sm border border-border px-2 py-1">
                    {area}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex justify-center pt-6 lg:justify-end lg:pt-0">
            <HeroPreview />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-14 sm:grid-cols-3">
          {[
            { n: "01", label: "Evidência sempre, em cada resposta baseada em conhecimento." },
            { n: "02", label: "Aprovação sempre, em toda ação com risco real." },
            { n: "03", label: "Auditoria sempre, do primeiro run em diante." },
          ].map((item, i) => (
            <Reveal key={item.n} delay={i * 0.08} className="flex items-start gap-4">
              <span className="text-4xl font-semibold tracking-tight text-border-strong sm:text-5xl">
                {item.n}
              </span>
              <span className="pt-1 text-sm text-text-muted">{item.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2">
          <Reveal className="flex flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              O problema real
            </span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Sua empresa já tem acesso a modelos poderosos. O que falta é controle.
            </h2>
            <p className="text-text-muted">
              O gargalo não é acesso a um LLM. É a ausência de uma camada operacional que
              converta contexto de negócio em ação segura, conectada aos seus sistemas e
              respeitando suas políticas e permissões.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-3">
            {RISKS.map((risk) => (
              <div key={risk} className="flex items-start gap-3 rounded-md border border-border bg-surface p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
                <span className="text-sm text-text-muted">{risk}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="como-funciona" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
              Como funciona
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <LoopFlowDiagram steps={LOOP_STEPS} />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Construído como plataforma, não como um chatbot avulso.
            </h2>
            <div className="flex flex-col gap-3">
              <p className="text-text-muted">
                A APOTHEM é um núcleo de inteligência reutilizável. Isto é o que acontece por
                trás de cada agente, antes mesmo de você ver a primeira resposta.
              </p>
              <a href="/produto" className="w-fit text-sm text-accent hover:underline">
                Ver todos os pilares →
              </a>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:grid-rows-2">
            {SHOWCASE.map((item, i) => (
              <Reveal
                key={item.name}
                delay={i * 0.08}
                className={`flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 ${item.span}`}
              >
                {item.preview}
                <div>
                  <h3 className="text-base font-semibold">{item.name}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Por que não é só mais um chatbot</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {DIFFERENTIATORS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <Card
                  className={
                    "h-full " + (item.highlight ? "border-accent bg-accent-muted/30" : undefined)
                  }
                >
                  {item.highlight ? (
                    <Check className="h-5 w-5 text-accent" aria-hidden />
                  ) : (
                    <X className="h-5 w-5 text-text-subtle" aria-hidden />
                  )}
                  <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Segurança de nível enterprise, desde o primeiro agente
              </h2>
              <a href="/seguranca" className="text-sm text-accent hover:underline">
                Ver modelo completo →
              </a>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {SECURITY_HIGHLIGHTS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <Card className="h-full">
                  <item.icon className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Conecta ao que sua empresa já usa</h2>
            <p className="mt-2 max-w-2xl text-text-muted">
              A arquitetura Connect traduz sistemas externos em ferramentas tipadas e
              auditáveis, sem expor credenciais ao modelo.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {INTEGRATION_CATEGORIES.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <Card className="h-full">
                  <item.icon className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="mt-2 text-base font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Quer ver os planos disponíveis?"
        subtitle="Do primeiro piloto ao contrato enterprise."
        ctaLabel="Ver planos"
        href="/precos"
      />

      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Feito para times reais</h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PERSONAS.map((persona, i) => (
              <Reveal key={persona.role} delay={i * 0.06}>
                <div className="flex gap-3 border-l-2 border-border pl-4">
                  <persona.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">{persona.role}</span>
                    <span className="text-sm text-text-muted">{persona.need}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Perguntas frequentes</h2>
          </Reveal>
          <div className="mt-8">
            <Faq />
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20">
        <Reveal>
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Pronto para transformar contexto de negócio em ação governada?
            </h2>
            <p className="max-w-xl text-text-muted">
              Conte um pouco sobre sua empresa e entramos em contato para agendar uma
              demonstração.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <LeadForm />
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
