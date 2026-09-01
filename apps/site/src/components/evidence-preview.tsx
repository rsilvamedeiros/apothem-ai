import { FileText } from "lucide-react";

const ANSWERS = [
  {
    question: "Posso reembolsar um pedido fora do prazo?",
    answer:
      "Reembolsos integrais são permitidos em até 7 dias após a compra, sem necessidade de justificativa.",
    sources: ["Política de reembolso v4"],
  },
  {
    question: "Qual o SLA de resposta para o plano Business?",
    answer: "Primeira resposta em até 4 horas úteis, com escalonamento automático após 8 horas.",
    sources: ["SLA — Plano Business", "Manual do produto §3.2"],
  },
];

/** Visual mockup of grounded answers with source citations, selling Knowledge concretely. */
export function EvidencePreview() {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-surface-raised p-4">
      <span className="text-xs font-medium text-text-muted">Respostas com evidência</span>
      {ANSWERS.map((item) => (
        <div key={item.question} className="flex flex-col gap-2 border-t border-border pt-3 first:border-t-0 first:pt-0">
          <span className="text-xs text-text-subtle">{item.question}</span>
          <p className="text-sm text-text">{item.answer}</p>
          <div className="flex flex-wrap gap-2">
            {item.sources.map((source) => (
              <span
                key={source}
                className="inline-flex items-center gap-1 rounded-sm border border-border bg-surface px-2 py-1 text-[11px] text-text-muted"
              >
                <FileText className="h-3 w-3 text-accent" aria-hidden />
                {source}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
