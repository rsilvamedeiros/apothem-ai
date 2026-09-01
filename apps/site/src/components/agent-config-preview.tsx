import { Bot } from "lucide-react";

const CONFIG = [
  { label: "Conhecimento", value: "Base de políticas internas" },
  { label: "Ferramenta", value: "CRM — leitura de tickets" },
  { label: "Aprovação", value: "Obrigatória para ações de risco" },
];

/** Visual mockup of an agent's bound configuration, selling Agents concretely. */
export function AgentConfigPreview() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-accent" aria-hidden />
        <span className="text-sm font-medium">Agente de Suporte — v3</span>
      </div>
      <dl className="flex flex-col gap-2 text-sm">
        {CONFIG.map((item) => (
          <div key={item.label} className="flex justify-between gap-4">
            <dt className="text-text-muted">{item.label}</dt>
            <dd className="text-right">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
