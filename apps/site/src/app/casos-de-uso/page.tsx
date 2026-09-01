import type { Metadata } from "next";
import { BookOpen, Users2, FileCheck2, ClipboardCheck, AlertTriangle, Wrench, type LucideIcon } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Casos de uso | APOTHEM AI",
  description:
    "Seis cenários prioritários que validam entender, conectar, raciocinar e agir em conjunto, do somente-leitura à ação com aprovação.",
};

type UseCase = {
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
  loop: string[];
  risk: "Somente leitura" | "Aprovação obrigatória";
};

const USE_CASES: UseCase[] = [
  {
    icon: BookOpen,
    code: "UC-01",
    title: "Analista de conhecimento corporativo",
    description:
      "Um usuário faz uma pergunta de política ou processo. O agente recupera apenas conhecimento autorizado, sintetiza uma resposta e cita as fontes. Sem efeito colateral.",
    loop: ["Entender", "Raciocinar"],
    risk: "Somente leitura",
  },
  {
    icon: Users2,
    code: "UC-02",
    title: "Pesquisa de cliente/lead com contexto de CRM",
    description:
      "O agente recebe um identificador de empresa ou cliente, lê o CRM e o contexto interno/público permitido, resume o que importa e sugere o próximo passo.",
    loop: ["Entender", "Conectar", "Raciocinar"],
    risk: "Somente leitura",
  },
  {
    icon: FileCheck2,
    code: "UC-03",
    title: "Revisão financeira e documental",
    description:
      "Um documento entra em uma fila de trabalho. O agente extrai campos, valida contra regras de negócio e uma consulta ao ERP, sinaliza anomalias e prepara uma revisão estruturada.",
    loop: ["Entender", "Raciocinar"],
    risk: "Somente leitura",
  },
  {
    icon: ClipboardCheck,
    code: "UC-04",
    title: "Atualização com aprovação",
    description:
      "O agente prepara uma ação — atualizar status no CRM, criar um ticket, enviar uma mensagem externa ou registrar um item interno. Um humano autorizado vê exatamente o payload proposto, aprova, e a execução é retomada.",
    loop: ["Raciocinar", "Agir"],
    risk: "Aprovação obrigatória",
  },
  {
    icon: AlertTriangle,
    code: "UC-05",
    title: "Tratamento de exceção operacional",
    description:
      "Um gatilho agendado ou de evento detecta uma condição. Regras determinísticas restringem o caso, o agente analisa o contexto não estruturado, e o workflow resolve automaticamente dentro de um limite de baixo risco ou solicita intervenção humana.",
    loop: ["Conectar", "Raciocinar", "Agir"],
    risk: "Aprovação obrigatória",
  },
  {
    icon: Wrench,
    code: "UC-06",
    title: "Assistente técnico interno",
    description:
      "O agente usa documentação, runbooks e ferramentas de observabilidade aprovadas para diagnosticar um problema e sugerir remediação. Ferramentas que alteram produção continuam restritas ou exigem aprovação.",
    loop: ["Entender", "Raciocinar"],
    risk: "Somente leitura",
  },
];

export default function CasosDeUsoPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Casos de uso
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Seis cenários que validam{" "}
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              entender, conectar, raciocinar e agir
            </span>{" "}
            em conjunto.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-text-muted">
            De respostas somente-leitura com evidência a ações que exigem aprovação humana
            explícita antes de tocar em um sistema real.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {USE_CASES.map((useCase, i) => (
            <Reveal key={useCase.code} delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex items-center gap-3 sm:w-64 sm:shrink-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised">
                    <useCase.icon className="h-4 w-4 text-accent" aria-hidden />
                  </span>
                  <div>
                    <span className="font-mono text-[11px] text-text-subtle">{useCase.code}</span>
                    <h2 className="font-heading text-sm font-bold">{useCase.title}</h2>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <p className="text-sm text-text-muted">{useCase.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-sm px-2 py-1 text-[11px] font-medium ${
                        useCase.risk === "Aprovação obrigatória"
                          ? "bg-warning/15 text-warning"
                          : "bg-accent-muted text-accent"
                      }`}
                    >
                      {useCase.risk}
                    </span>
                    {useCase.loop.map((step) => (
                      <span
                        key={step}
                        className="rounded-sm border border-border px-2 py-1 text-[11px] text-text-muted"
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Reconhece um desses cenários no seu dia a dia?"
        subtitle="Vamos conversar sobre como mapear ele em um piloto."
        ctaLabel="Solicitar demonstração"
      />

      <SiteFooter />
    </div>
  );
}
