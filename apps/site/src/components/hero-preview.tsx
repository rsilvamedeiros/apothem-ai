import { Clock, FileCheck2 } from "lucide-react";
import { BrowserFrame } from "@/components/browser-frame";
import { RunPreviewCard } from "@/components/run-preview-card";

export function HeroPreview() {
  return (
    <div className="relative w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-accent opacity-[0.12] blur-3xl"
        aria-hidden
      />
      <BrowserFrame>
        <RunPreviewCard />
      </BrowserFrame>

      <div className="absolute -left-8 -top-6 hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:flex">
        <FileCheck2 className="h-3.5 w-3.5 text-success" aria-hidden />
        3 fontes citadas
      </div>
      <div className="absolute -bottom-6 -right-6 hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.55)] sm:flex">
        <Clock className="h-3.5 w-3.5 text-warning" aria-hidden />
        1 aprovação pendente
      </div>
    </div>
  );
}
