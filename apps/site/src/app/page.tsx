import { Card } from "@apothem/ui";
import {
  Search,
  Plug,
  Brain,
  Zap,
  ShieldCheck,
  FileSearch,
  ScrollText,
  Bot,
  BookOpen,
  BarChart3,
  Building2,
  Wrench,
  UserCheck,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RunPreviewCard } from "@/components/run-preview-card";
import { DemoRequestForm } from "@/components/demo-request-form";
import { Reveal } from "@/components/motion/reveal";

const TRUST_POINTS: { icon: LucideIcon; text: string }[] = [
  { icon: ShieldCheck, text: "Aprovação humana em toda ação de risco" },
  { icon: FileSearch, text: "Evidência rastreável até a fonte" },
  { icon: ScrollText, text: "Auditoria completa, do primeiro run em diante" },
];

const LOOP_STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Search, title: "Entender", body: "Contexto de negócio, políticas e conhecimento autorizado." },
  { icon: Plug, title: "Conectar", body: "Sistemas, dados e ferramentas reais da empresa." },
  { icon: Brain, title: "Raciocinar", body: "Decisões dentro de limites explícitos, com evidência." },
  { icon: Zap, title: "Agir", body: "Execução autorizada, com aprovação e auditoria." },
];

const PILLARS: { icon: LucideIcon; name: string; description: string }[] = [
  {
    icon: Bot,
    name: "Apothem Agents",
    description: "Agentes de IA configurados com objetivo, conhecimento, ferramentas e permissões claras.",
  },
  {
    icon: BookOpen,
    name: "Apothem Knowledge",
    description: "Ingestão e recuperação de conhecimento corporativo, com evidência rastreável até a fonte.",
  },
  {
    icon: BarChart3,
    name: "Apothem Control",
    description: "Governança, auditoria, uso e observabilidade desde o primeiro run.",
  },
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
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Dê aos seus agentes de IA o contexto certo e o controle que sua empresa exige.
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
          </div>

          <Reveal delay={0.15} className="flex justify-center lg:justify-end">
            <RunPreviewCard />
          </Reveal>
        </div>
      </section>

      <section id="como-funciona" className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
              Como funciona
            </h2>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <Card className="flex h-full flex-col gap-2">
                  <step.icon className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight">Construído como plataforma</h2>
              <a href="/produto" className="text-sm text-accent hover:underline">
                Ver todos os pilares →
              </a>
            </div>
            <p className="mt-2 max-w-2xl text-text-muted">
              A APOTHEM é um núcleo de inteligência reutilizável, não um chatbot de propósito único.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.name} delay={i * 0.08}>
                <Card className="h-full">
                  <pillar.icon className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="mt-2 text-base font-semibold">{pillar.name}</h3>
                  <p className="mt-1 text-sm text-text-muted">{pillar.description}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight">Feito para times reais</h2>
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

      <section id="demo" className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20">
        <Reveal>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Pronto para transformar contexto de negócio em ação governada?
            </h2>
            <p className="max-w-xl text-text-muted">
              Conte um pouco sobre sua empresa e entramos em contato para agendar uma
              demonstração.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <DemoRequestForm />
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}
