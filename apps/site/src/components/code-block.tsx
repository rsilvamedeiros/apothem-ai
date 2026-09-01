const METHOD_COLORS: Record<string, string> = {
  GET: "text-info",
  POST: "text-accent",
  PATCH: "text-warning",
  DELETE: "text-danger",
};

export function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-surface p-6 font-mono text-sm leading-relaxed">
      <code>
        {lines.map((line, i) => {
          const [method, ...rest] = line.trim().split(/\s+/);
          const color = METHOD_COLORS[method];
          return (
            <div key={i} className="text-text-muted">
              {color ? <span className={`font-semibold ${color}`}>{method}</span> : method}
              {rest.length > 0 && <span> {rest.join(" ")}</span>}
            </div>
          );
        })}
      </code>
    </pre>
  );
}
