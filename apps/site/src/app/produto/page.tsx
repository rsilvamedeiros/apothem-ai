import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Produto — APOTHEM AI",
  description:
    "Apothem Core, Agents, Studio, Knowledge, Connect, Flow e Control — a arquitetura de produto por trás da APOTHEM AI.",
};

const FAMILIES = [
  {
    name: "Apothem Core",
    description: "Runtime, orquestração, políticas, contexto e capacidade compartilhada da plataforma.",
  },
  {
    name: "Apothem Agents",
    description: "Agentes de IA configurados com objetivo, instruções, conhecimento, ferramentas e permissões.",
  },
  {
    name: "Apothem Studio",
    description: "Experiência de configuração para criar e gerenciar agentes.",
  },
  {
    name: "Apothem Knowledge",
    description: "Ingestão e recuperação de conhecimento corporativo, com evidência ciente de permissões.",
  },
  {
    name: "Apothem Connect",
    description: "Integrações, credenciais e adaptadores de ferramentas tipadas.",
  },
  {
    name: "Apothem Flow",
    description: "Workflows duráveis combinando lógica determinística e raciocínio de agente.",
  },
  {
    name: "Apothem Control",
    description: "Governança, auditoria, uso, segurança e observabilidade.",
  },
];

const USE_CASES = [
  {
    title: "Analista de conhecimento corporativo",
    description:
      "O agente recupera apenas conhecimento autorizado, sintetiza uma resposta e cita as fontes — sem efeito colateral.",
  },
  {
    title: "Pesquisa de cliente/lead com contexto de CRM",
    description:
      "O agente lê CRM e contexto interno permitido, resume o que importa e sugere o próximo passo.",
  },
  {
    title: "Atualização com aprovação",
    description:
      "O agente prepara uma ação — atualizar um status, criar um ticket, enviar uma mensagem — e um humano autorizado aprova antes da execução.",
  },
];

export default function ProdutoPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
          Arquitetura de produto
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Uma plataforma, sete capacidades.
        </h1>
        <p className="text-lg text-text-muted">
          A APOTHEM é construída como um núcleo de inteligência reutilizável, não como um
          chatbot de propósito único. Cada capacidade abaixo é um primitivo compartilhado
          da plataforma, não uma funcionalidade isolada.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {FAMILIES.map((family) => (
          <Card key={family.name}>
            <h2 className="text-base font-semibold">{family.name}</h2>
            <p className="mt-1 text-sm text-text-muted">{family.description}</p>
          </Card>
        ))}
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Casos de uso prioritários</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Cenários concretos que validam entender, conectar, raciocinar e agir em conjunto.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {USE_CASES.map((useCase) => (
              <div key={useCase.title} className="flex flex-col gap-2 border-l-2 border-border pl-4">
                <h3 className="text-sm font-semibold">{useCase.title}</h3>
                <p className="text-sm text-text-muted">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
