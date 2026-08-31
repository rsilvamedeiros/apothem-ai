import { CheckCircle2, Clock } from "lucide-react";

const STEPS = [
  { label: "Contexto recuperado", detail: "3 fontes autorizadas · política de reembolso v4", status: "done" },
  { label: "Ação proposta", detail: "Atualizar status do ticket #4821 para Aprovado", status: "done" },
  { label: "Aprovação humana", detail: "Aguardando: Ana Ferreira (Financeiro)", status: "pending" },
] as const;

/**
 * Static mock of a run/execution timeline, the product's own visual
 * language (docs/13-design-system) rather than decorative "AI thinking"
 * imagery. Doubles as a concrete preview of what the product does.
 */
export function RunPreviewCard() {
  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-medium text-text-muted">Execução · Agente de Suporte</span>
        <span className="text-[11px] font-medium text-accent">Em andamento</span>
      </div>
      <ol className="mt-4 flex flex-col gap-4">
        {STEPS.map((step) => (
          <li key={step.label} className="flex gap-3">
            {step.status === "done" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
            ) : (
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{step.label}</span>
              <span className="text-xs text-text-muted">{step.detail}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
