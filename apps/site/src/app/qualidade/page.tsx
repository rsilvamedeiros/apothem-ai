import type { Metadata } from "next";
import {
  FlaskConical,
  Cpu,
  Activity,
  ShieldOff,
  MessageSquareWarning,
  Wrench,
  Gauge,
  Clock,
  Coins,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Qualidade e confiabilidade | APOTHEM AI",
  description:
    "\"Funcionou no meu chat\" não é padrão de qualidade. Duas dimensões de teste, gate de publicação e degradação graciosa.",
};

const SOFTWARE_TESTS = [
  "Testes unitários de domínio, políticas e parsers",
  "Testes de integração para banco, repositórios e adaptadores",
  "Testes de contrato para API, eventos e conectores",
  "E2E para as jornadas de maior valor",
  "Testes de segurança e isolamento de tenant",
];

const AI_EVALS = [
  "Validação de saída estruturada",
  "Fixtures de recuperação de conhecimento",
  "Avaliação de seleção e argumentos de ferramenta",
  "Cenários de groundedness e conformidade de política",
  "Avaliações de sucesso da tarefa completa",
];

const ONLINE_SIGNALS: { icon: LucideIcon; label: string }[] = [
  { icon: Activity, label: "Taxa de conclusão e falha" },
  { icon: MessageSquareWarning, label: "Correção pelo usuário" },
  { icon: ShieldOff, label: "Taxa de rejeição de aprovação" },
  { icon: Wrench, label: "Erros de ferramenta" },
  { icon: Clock, label: "Latência" },
  { icon: Coins, label: "Uso de token e custo" },
];

export default function QualidadePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Qualidade e confiabilidade
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-accent to-info bg-clip-text text-transparent">
              &ldquo;Funcionou no meu chat&rdquo;
            </span>{" "}
            não é padrão de qualidade.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-text-muted">
            Comportamento de IA exige testes de contrato determinísticos e datasets de
            avaliação para comportamento semântico — não só testar conversando.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-accent" aria-hidden />
              <h2 className="font-heading text-base font-bold">Software determinístico</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {SOFTWARE_TESTS.map((item) => (
                <li key={item} className="text-sm text-text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-accent" aria-hidden />
              <h2 className="font-heading text-base font-bold">Comportamento probabilístico de IA</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {AI_EVALS.map((item) => (
                <li key={item} className="text-sm text-text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <Reveal>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-text-subtle">
              Gate de publicação
            </span>
            <p className="font-heading mt-4 text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              Uma versão crítica de agente não é publicada quando evals obrigatórios de
              política ou segurança regridem além do limite aceito.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Sinais em produção</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Sinais online complementam os evals — nunca os substituem.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ONLINE_SIGNALS.map((signal, i) => (
            <Reveal key={signal.label} delay={i * 0.05} className="flex items-center gap-3 rounded-md border border-border bg-surface p-4">
              <signal.icon className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span className="text-sm text-text-muted">{signal.label}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised">
              <Repeat className="h-4 w-4 text-accent" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Degradação graciosa</h2>
              <p className="mt-2 max-w-2xl text-sm text-text-muted">
                Se o modelo preferido fica indisponível, a política decide: usar um fallback
                permitido, enfileirar e tentar de novo, ou falhar com um motivo transparente.
                Nunca violamos silenciosamente uma restrição de provedor ou privacidade do
                cliente só para manter o run &ldquo;verde&rdquo;.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-4 flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised">
              <Gauge className="h-4 w-4 text-accent" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Orçamento de custo</h2>
              <p className="mt-2 max-w-2xl text-sm text-text-muted">
                Uso de modelo, embedding e reranking é normalizado em custo de provedor e
                unidades internas de uso. Orçamentos existem por organização, workspace,
                agente ou run — e um orçamento de runtime impede um loop de raciocínio fugir
                do controle.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Quer ver um dataset de avaliação real?"
        subtitle="Mostramos como medimos qualidade antes de publicar uma versão de agente."
      />

      <SiteFooter />
    </div>
  );
}
