import type { HTMLAttributes } from "react";
import styles from "./status-badge.module.css";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: StatusTone;
};

export function StatusBadge({ tone = "neutral", className, ...props }: StatusBadgeProps) {
  const classes = [styles.badge, styles[tone], className].filter(Boolean).join(" ");
  return <span className={classes} {...props} />;
}
