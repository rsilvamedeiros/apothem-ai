import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { describeApprovalStatus, formatToolName, type ApprovalView } from "../../runs/run-view";
import { DecisionControls } from "./decision-controls";
import styles from "./approvals.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type ApprovalCardProps = {
  approval: ApprovalView;
  /** Server action bound to this approval. Without it (or once decided) no controls are shown. */
  decide?: Action;
  runHref?: string;
};

const MAX_VALUE_LENGTH = 300;
const SHORT_ID_LENGTH = 8;

/** Fixed UTC format so timestamps read the same for every viewer. */
function formatUtc(iso: string): string {
  return `${new Date(iso).toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  const text = typeof value === "string" ? value : typeof value === "object" ? JSON.stringify(value) : String(value);
  return text.length > MAX_VALUE_LENGTH ? `${text.slice(0, MAX_VALUE_LENGTH).trimEnd()}…` : text;
}

export function ApprovalCard({ approval, decide, runHref }: ApprovalCardProps) {
  const status = describeApprovalStatus(approval.status);
  const entries = Object.entries(approval.arguments);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.tool}>{formatToolName(approval.toolName)}</span>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </header>

      <p className={styles.note}>An agent wants to do this. Nothing happens until a person approves it.</p>

      <dl className={styles.args} data-testid="approval-arguments">
        {entries.map(([key, value]) => (
          <div key={key} style={{ display: "contents" }}>
            <dt>{key}</dt>
            <dd>{formatValue(value)}</dd>
          </div>
        ))}
      </dl>

      <p className={styles.meta}>
        Requested <time dateTime={approval.createdAt}>{formatUtc(approval.createdAt)}</time> · Expires{" "}
        <time dateTime={approval.expiresAt}>{formatUtc(approval.expiresAt)}</time>
      </p>

      {approval.decidedAt ? (
        <p className={styles.meta}>
          Decided <time dateTime={approval.decidedAt}>{formatUtc(approval.decidedAt)}</time>
          {approval.decidedByPrincipalId ? (
            <>
              {" "}
              by{" "}
              <span title={approval.decidedByPrincipalId}>{approval.decidedByPrincipalId.slice(0, SHORT_ID_LENGTH)}</span>
            </>
          ) : null}
          {approval.decisionReason ? <> — “{approval.decisionReason}”</> : null}
        </p>
      ) : null}

      {approval.selfApproved ? (
        <p className={styles.note}>Self-approved: the person who started the run was the only approver available.</p>
      ) : null}

      {approval.status === "pending" && decide ? <DecisionControls action={decide} /> : null}

      {runHref ? <Link href={runHref}>View run</Link> : null}
    </article>
  );
}
