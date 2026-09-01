import { CheckCircle2, Clock, Bot, FileCheck2, Timer } from "lucide-react";

const STEPS = [
  {
    label: "Contexto recuperado",
    detail: "3 fontes autorizadas · política de reembolso v4",
    time: "09:41",
    status: "done",
  },
  {
    label: "Ação proposta",
    detail: "Atualizar status do ticket #4821 para Aprovado",
    time: "09:42",
    status: "done",
  },
  {
    label: "Aprovação humana",
    detail: "Aguardando: Ana Ferreira (Financeiro)",
    time: "09:42",
    status: "pending",
  },
] as const;

const PROGRESS_PERCENT = 66;

/**
 * Static mock of a run/execution dashboard, the product's own visual
 * language (docs/13-design-system) rather than decorative "AI thinking"
 * imagery. Doubles as a concrete preview of what the product does.
 */
export function RunPreviewCard() {
  return (
    <div className="relative w-full max-w-sm">
      <div className="rounded-lg border border-border bg-surface p-5 shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-muted">
              <Bot className="h-4 w-4 text-accent" aria-hidden />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Agente de Suporte</span>
              <span className="text-[11px] text-text-muted">Execução #run_8f21</span>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-accent">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Em andamento
          </span>
        </div>

        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-raised">
          <div className="h-full rounded-full bg-accent" style={{ width: `${PROGRESS_PERCENT}%` }} />
        </div>

        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((step) => (
            <li key={step.label} className="flex gap-3">
              {step.status === "done" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              ) : (
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{step.label}</span>
                  <span className="text-[11px] text-text-subtle">{step.time}</span>
                </div>
                <span className="text-xs text-text-muted">{step.detail}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <Timer className="h-3 w-3" aria-hidden />
            Duração: 8s
          </span>
          <span>gpt-4.1 · normalizado</span>
        </div>
      </div>

      <div className="absolute -left-6 -top-5 hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:flex">
        <FileCheck2 className="h-3.5 w-3.5 text-success" aria-hidden />
        3 fontes citadas
      </div>
      <div className="absolute -bottom-5 -right-4 hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:flex">
        <Clock className="h-3.5 w-3.5 text-warning" aria-hidden />
        1 aprovação pendente
      </div>
    </div>
  );
}
