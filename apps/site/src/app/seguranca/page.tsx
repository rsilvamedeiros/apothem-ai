import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import {
  Building2,
  KeyRound,
  Lock,
  ScrollText,
  ShieldAlert,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaBanner } from "@/components/cta-banner";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Segurança | APOTHEM AI",
  description:
    "Isolamento multi-tenant, autorização por capacidade, segredos criptografados, auditoria imutável e um modelo de ameaças específico para IA.",
};

const CONTROLS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Isolamento multi-tenant",
    description:
      "Todo recurso carrega organização e workspace. O contexto de tenant é resolvido a partir da identidade autenticada, nunca de um valor enviado pelo cliente, e é aplicado em repositórios, cache, jobs e observabilidade.",
  },
  {
    icon: ShieldCheck,
    title: "Autorização por capacidade",
    description:
      "Papéis concedem capacidades explícitas (como agent.publish ou approval.decide), refinadas por atributos de recurso. O agente nunca tem identidade própria com permissão global: ele age dentro da identidade do run e das ferramentas vinculadas à sua versão.",
  },
  {
    icon: KeyRound,
    title: "Segredos e credenciais",
    description:
      "Credenciais de provedores, tokens OAuth e senhas ficam em um cofre criptografado, nunca em tabelas normais ou logs. O modelo de IA nunca recebe um token em texto puro — o executor da ferramenta usa identidade de servidor para obter o segredo.",
  },
  {
    icon: ScrollText,
    title: "Auditoria e retenção",
    description:
      "Ações privilegiadas geram registro imutável de identidade, política e decisão. Categorias de dado (conteúdo de negócio, entradas/saídas de modelo, evidência de conhecimento, eventos de auditoria) têm propósito e retenção definidos, alinhados a princípios de minimização de dados da LGPD.",
  },
  {
    icon: ShieldAlert,
    title: "Modelo de ameaças de IA",
    description:
      "Conteúdo recuperado ou retornado por ferramentas é tratado como dado não confiável, nunca como instrução. Isso mitiga injeção de prompt, abuso de ferramentas e envenenamento de conhecimento — não depende só de um system prompt mais forte.",
  },
  {
    icon: Lock,
    title: "Falha seguindo o lado seguro",
    description:
      "Quando autorização ou estado de política é ambíguo, o sistema nega por padrão. Conexão revogada interrompe novas chamadas de ferramenta. Aprovação expirada nunca é aprovada automaticamente. Fonte sem permissão verificável é excluída da resposta.",
  },
];

const THREATS = [
  { title: "Acesso cross-tenant", mitigation: "Contexto de tenant explícito, testes de escalonamento horizontal, recuperação ciente de permissão." },
  { title: "Injeção de prompt", mitigation: "Conteúdo de documentos e ferramentas tratado como dado, não instrução; allowlist de ferramentas." },
  { title: "Abuso de ferramentas", mitigation: "Ferramentas tipadas, menor privilégio, política de aprovação, limites e idempotência." },
  { title: "Roubo de credencial", mitigation: "Cofre de segredos, sem exposição ao modelo ou à UI, acesso de runtime com escopo mínimo." },
  { title: "Envenenamento de conhecimento", mitigation: "Proveniência de fonte, controles de ingestão, metadados de frescor, avaliação contínua." },
  { title: "Exaustão de custo", mitigation: "Cotas, orçamento por run, limites de taxa e concorrência, loops com teto." },
];

export default function SegurancaPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <section className="mx-auto flex max-w-3xl flex-col gap-4 px-6 pb-8 pt-20">
        <Reveal>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Segurança e governança
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Segurança não é um adendo. É a fundação.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg text-text-muted">
            Um agente nunca deve ganhar mais autoridade do que a organização concede
            intencionalmente, e nenhum tenant observa ou influencia dados de outro. Esses
            princípios estão no modelo de dados desde a fundação, não como camada adicionada
            depois.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {CONTROLS.map((control, i) => (
          <Reveal key={control.title} delay={Math.min(i * 0.06, 0.3)}>
            <Card className="h-full">
              <control.icon className="h-5 w-5 text-accent" aria-hidden />
              <h2 className="mt-2 text-base font-semibold">{control.title}</h2>
              <p className="mt-1 text-sm text-text-muted">{control.description}</p>
            </Card>
          </Reveal>
        ))}
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contra o que projetamos</h2>
            <p className="mt-2 max-w-2xl text-text-muted">
              IA muda a superfície de ataque. Entrada de modelo pode conter instruções
              hostis vindas de usuários, documentos ou ferramentas — tratamos isso como
              manipulação de dado não confiável, não como algo resolvido só com um prompt.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {THREATS.map((threat, i) => (
              <Reveal key={threat.title} delay={i * 0.05}>
                <div className="flex flex-col gap-1 border-l-2 border-border pl-4">
                  <span className="text-sm font-semibold">{threat.title}</span>
                  <span className="text-sm text-text-muted">{threat.mitigation}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Maturidade em estágios</h2>
          <p className="mt-2 max-w-2xl text-text-muted">
            Somos honestos sobre onde estamos: a plataforma está em fase de fundação. Antes de
            um piloto externo, revisamos tenancy, autenticação, segredos, aprovação de
            ferramentas e tratamento de dados por provedor. Antes de um SLA enterprise, o
            processo inclui revisão formal de ameaças, plano de resposta a incidentes,
            evidência de restauração de backup e teste de penetração.
          </p>
        </Reveal>
      </section>

      <CtaBanner
        title="Quer revisar nosso modelo de segurança em detalhe?"
        subtitle="Conversamos com o seu time de segurança antes de qualquer piloto."
        ctaLabel="Falar com a gente"
      />

      <SiteFooter />
    </div>
  );
}
