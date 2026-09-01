import { FileText } from "lucide-react";

const SOURCES = ["Política de reembolso v4", "Manual do produto §3.2", "SLA — Plano Business"];

/** Visual mockup of a grounded answer with source citations, selling Knowledge concretely. */
export function EvidencePreview() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-md border border-border bg-surface-raised p-4">
      <span className="text-xs font-medium text-text-muted">Resposta com evidência</span>
      <p className="text-sm text-text">
        Reembolsos integrais são permitidos em até 7 dias após a compra, sem necessidade de
        justificativa.
      </p>
      <div className="mt-1 flex flex-wrap gap-2">
        {SOURCES.map((source) => (
          <span
            key={source}
            className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface-raised px-2 py-1 text-[11px] text-text-muted"
          >
            <FileText className="h-3 w-3 text-accent" aria-hidden />
            {source}
          </span>
        ))}
      </div>
    </div>
  );
}
