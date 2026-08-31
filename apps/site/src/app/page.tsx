import { Button, Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const LOOP_STEPS = [
  { title: "Entender", body: "Contexto de negócio, políticas e conhecimento autorizado." },
  { title: "Conectar", body: "Sistemas, dados e ferramentas reais da empresa." },
  { title: "Raciocinar", body: "Decisões dentro de limites explícitos, com evidência." },
  { title: "Agir", body: "Execução autorizada, com aprovação e auditoria." },
];

const PILLARS = [
  {
    name: "Apothem Agents",
    description: "Agentes de IA configurados com objetivo, conhecimento, ferramentas e permissões claras.",
  },
  {
    name: "Apothem Knowledge",
    description: "Ingestão e recuperação de conhecimento corporativo, com evidência rastreável até a fonte.",
  },
  {
    name: "Apothem Control",
    description: "Governança, auditoria, uso e observabilidade — do primeiro run em diante.",
  },
];

const PERSONAS = [
  { role: "Dono do negócio", need: "Controle e valor mensurável, sem acesso não governado." },
  { role: "Builder / Automation Lead", need: "Configurar comportamento sem reescrever a plataforma." },
  { role: "Operador de negócio", need: "Resultado do trabalho, com evidência e próximos passos claros." },
  { role: "Segurança / Auditoria", need: "Histórico completo de identidade, política, ferramenta e decisão." },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-16 pt-20 sm:pt-28">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Inteligência no centro do negócio
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          A camada de inteligência entre o contexto da sua empresa e a ação autorizada.
        </h1>
        <p className="max-w-2xl text-lg text-text-muted">
          A APOTHEM conecta conhecimento, sistemas, pessoas, processos e políticas a agentes
          de IA que raciocinam dentro de limites explícitos e executam trabalho real —
          com aprovações, auditoria e evidência rastreável desde o primeiro dia.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button href="mailto:hello@apothemai.com.br">Falar com a gente</Button>
          <Button href="/produto" variant="secondary">
            Ver o produto
          </Button>
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
            Como funciona
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP_STEPS.map((step, i) => (
              <Card key={step.title} className="flex flex-col gap-2">
                <span className="text-xs font-medium text-accent">0{i + 1}</span>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-text-muted">{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">Construído como plataforma</h2>
          <a href="/produto" className="text-sm text-accent hover:underline">
            Ver todos os pilares →
          </a>
        </div>
        <p className="mt-2 max-w-2xl text-text-muted">
          A APOTHEM é um núcleo de inteligência reutilizável, não um chatbot de propósito único.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <Card key={pillar.name}>
              <h3 className="text-base font-semibold">{pillar.name}</h3>
              <p className="mt-1 text-sm text-text-muted">{pillar.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Feito para times reais</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PERSONAS.map((persona) => (
              <div key={persona.role} className="flex flex-col gap-1 border-l-2 border-border pl-4">
                <span className="text-sm font-semibold">{persona.role}</span>
                <span className="text-sm text-text-muted">{persona.need}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Pronto para transformar contexto de negócio em ação governada?
        </h2>
        <Button href="mailto:hello@apothemai.com.br">Falar com a gente</Button>
      </section>

      <SiteFooter />
    </div>
  );
}
