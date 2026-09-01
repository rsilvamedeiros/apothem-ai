"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type Step = { icon: ReactNode; title: string; body: string };

const DASH_H =
  "repeating-linear-gradient(90deg,var(--apothem-accent) 0,var(--apothem-accent) 6px,transparent 6px,transparent 12px)";
const DASH_V =
  "repeating-linear-gradient(180deg,var(--apothem-accent) 0,var(--apothem-accent) 6px,transparent 6px,transparent 12px)";

/** Animated connected-flow diagram for the Understand→Connect→Reason→Act loop. */
export function LoopFlowDiagram({ steps }: { steps: Step[] }) {
  return (
    <div className="relative flex flex-col sm:flex-row">
      {/* Desktop: one continuous horizontal line behind all node centers (top: half of h-14). */}
      <motion.div
        className="absolute left-7 right-7 top-7 hidden h-px sm:block"
        style={{ backgroundImage: DASH_H, backgroundSize: "12px 1px" }}
        initial={{ backgroundPositionX: 0 }}
        animate={{ backgroundPositionX: -12 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      {/* Mobile: one continuous vertical line behind all node centers (left: half of h-14). */}
      <motion.div
        className="absolute bottom-7 left-7 top-7 w-px sm:hidden"
        style={{ backgroundImage: DASH_V, backgroundSize: "1px 12px" }}
        initial={{ backgroundPositionY: 0 }}
        animate={{ backgroundPositionY: -12 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />

      {steps.map((step) => (
        <div
          key={step.title}
          className="relative z-10 flex flex-row items-center gap-4 py-4 sm:flex-1 sm:flex-col sm:items-center sm:gap-0 sm:py-0"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface">
            {step.icon}
          </div>
          <div className="flex flex-col gap-0.5 sm:mt-3 sm:items-center sm:text-center">
            <span className="text-sm font-semibold">{step.title}</span>
            <span className="text-xs text-text-muted sm:max-w-[10rem]">{step.body}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
