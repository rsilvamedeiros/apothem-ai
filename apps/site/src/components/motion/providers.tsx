"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** Respects the OS-level reduced-motion setting across the whole app, per docs/13-design-system. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
