const ENTRIES = [
  { actor: "Ana Ferreira", action: "aprovou atualização de ticket #4821", time: "há 2 min" },
  { actor: "Agente de Suporte", action: "propôs atualização de status", time: "há 3 min" },
  { actor: "Agente de Suporte", action: "recuperou 3 fontes de conhecimento", time: "há 4 min" },
];

/** Visual mockup of an audit trail, selling Control concretely. */
export function AuditLogPreview() {
  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-5">
      <span className="text-xs font-medium text-text-muted">Trilha de auditoria</span>
      <ul className="flex flex-col gap-3">
        {ENTRIES.map((entry) => (
          <li key={entry.action} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
            <div className="flex flex-col">
              <span>
                <span className="font-medium">{entry.actor}</span> {entry.action}
              </span>
              <span className="text-xs text-text-muted">{entry.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
