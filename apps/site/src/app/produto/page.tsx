import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import {
  Layers,
  Bot,
  Wand2,
  BookOpen,
  Plug,
  Workflow,
  ShieldCheck,
  Check,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Produto | APOTHEM AI",
  description:
    "Apothem Core, Agents, Studio, Knowledge, Connect, Flow e Control: a arquitetura de produto por trás da APOTHEM AI.",
};

const FAMILIES: { icon: LucideIcon; name: string; description: string; features: string[] }[] = [
  {
    icon: Layers,
    name: "Apothem Core",
    description: "Runtime, orquestração, políticas, contexto e capacidade compartilhada da plataforma.",
    features: [
      "Orçamento de execução por run: duração, chamadas de modelo, ferramentas e custo",
      "Retomada de execuções pausadas, sem manter conexão aberta esperando aprovação",
      "Streaming de progresso tolerante a reconexão e eventos fora de ordem",
      "Taxonomia de erro estável, sem depender de texto de provedor",
    ],
  },
  {
    icon: Bot,
    name: "Apothem Agents",
    description: "Agentes de IA configurados com objetivo, instruções, conhecimento, ferramentas e permissões.",
    features: [
      "Versão publicada e imutável: todo run referencia exatamente uma configuração",
      "Draft separado de produção, sem alterar o comportamento de um processo ativo",
      "Validação contínua: conhecimento ausente, ferramenta inválida ou política impossível",
      "Reconstrução histórica: qualquer run pode ser explicado pela versão que o gerou",
    ],
  },
  {
    icon: Wand2,
    name: "Apothem Studio",
    description: "Experiência de configuração para criar e gerenciar agentes.",
    features: [
      "Editor de instruções, conhecimento e ferramentas em um só lugar",
      "Resumo de versão antes de publicar, sem exigir diffs complexos",
      "Ambiente de teste antes de expor o agente a operadores reais",
    ],
  },
  {
    icon: BookOpen,
    name: "Apothem Knowledge",
    description: "Ingestão e recuperação de conhecimento corporativo, com evidência ciente de permissões.",
    features: [
      "Permissão verificada antes da recuperação, nunca filtrada depois da geração",
      "Citações e evidência rastreável até a fonte original",
      "Sincronização e frescor: cada fonte expõe quando foi processada pela última vez",
      "Avaliação contínua de recall e precisão de citação com corpora de referência",
    ],
  },
  {
    icon: Plug,
    name: "Apothem Connect",
    description: "Integrações, credenciais e adaptadores de ferramentas tipadas.",
    features: [
      "Execução de ferramentas isolada: o modelo nunca recebe credenciais em texto puro",
      "Um agente só usa as ferramentas explicitamente vinculadas à sua versão",
      "Versionamento de conector sem quebrar agentes já publicados",
      "Falhas normalizadas (permissão, limite de taxa, indisponibilidade) em vez de erro genérico",
    ],
  },
  {
    icon: Workflow,
    name: "Apothem Flow",
    description: "Workflows duráveis combinando lógica determinística e raciocínio de agente.",
    features: [
      "Execução durável: retoma após reinício ou espera humana longa",
      "Nós de gatilho, transformação, condição, agente, ferramenta, aprovação e espera",
      "Lógica determinística para roteamento e limites; IA apenas onde há interpretação",
    ],
  },
  {
    icon: ShieldCheck,
    name: "Apothem Control",
    description: "Governança, auditoria, uso, segurança e observabilidade.",
    features: [
      "Registro imutável de identidade, política e decisão em cada ação privilegiada",
      "Telemetria de uso e custo por execução, agente e workspace",
      "Visibilidade de falhas e jobs pendentes antes que virem incidente",
    ],
  },
];

export default function ProdutoPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Arquitetura de produto
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Uma plataforma, sete capacidades.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-text-muted">
            A APOTHEM é construída como um núcleo de inteligência reutilizável, não como um
            chatbot de propósito único. Cada capacidade abaixo é um primitivo compartilhado
            da plataforma, não uma funcionalidade isolada.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8">
        {FAMILIES.map((family, i) => (
          <Reveal key={family.name} delay={Math.min(i * 0.05, 0.3)}>
            <Card className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr] sm:items-start">
              <div className="flex flex-col gap-2">
                <family.icon className="h-5 w-5 text-accent" aria-hidden />
                <h2 className="text-lg font-semibold">{family.name}</h2>
                <p className="text-sm text-text-muted">{family.description}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {family.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Casos de uso prioritários</h2>
            <p className="mt-2 max-w-2xl text-text-muted">
              Cenários concretos que validam entender, conectar, raciocinar e agir em conjunto.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 rounded-xl border border-border bg-surface p-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  title: "Analista de conhecimento corporativo",
                  description:
                    "O agente recupera apenas conhecimento autorizado, sintetiza uma resposta e cita as fontes, sem efeito colateral.",
                },
                {
                  title: "Pesquisa de cliente/lead com contexto de CRM",
                  description:
                    "O agente lê CRM e contexto interno permitido, resume o que importa e sugere o próximo passo.",
                },
                {
                  title: "Atualização com aprovação",
                  description:
                    "O agente prepara uma ação, como atualizar um status ou criar um ticket, e um humano autorizado aprova antes da execução.",
                },
              ].map((useCase) => (
                <div key={useCase.title} className="flex flex-col gap-2 border-l-2 border-border pl-4">
                  <h3 className="text-sm font-semibold">{useCase.title}</h3>
                  <p className="text-sm text-text-muted">{useCase.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Veja a APOTHEM aplicada ao seu processo"
        subtitle="Agende uma demonstração com um dos nossos especialistas."
      />

      <SiteFooter />
    </div>
  );
}
