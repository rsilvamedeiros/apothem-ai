import type { ReactNode } from "react";

/** Wraps a UI mockup in a lightweight browser chrome, so it reads as a real product screenshot. */
export function BrowserFrame({ children, url = "app.apothemai.com.br" }: { children: ReactNode; url?: string }) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-3 border-b border-border bg-surface-raised px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="flex-1 rounded-sm bg-surface px-3 py-1 text-center text-[11px] text-text-subtle">
          {url}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
