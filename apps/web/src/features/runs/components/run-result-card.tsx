import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import { describeRunError, describeRunStatus, formatDuration, type RunView } from "../run-view";
import styles from "./runs.module.css";

type RunResultCardProps = {
  run: RunView;
  /** When set, shows a link to the run's detail page. */
  detailHref?: string;
};

function durationMs(run: RunView): number | null {
  if (!run.startedAt || !run.finishedAt) return null;
  return Math.max(0, new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime());
}

export function RunResultCard({ run, detailHref }: RunResultCardProps) {
  const status = describeRunStatus(run.status);
  const guidance = run.status === "failed" ? describeRunError(run.errorCode) : null;
  const hasUsage = run.inputTokens !== null && run.outputTokens !== null;
  const duration = durationMs(run);

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
        {detailHref ? (
          <Link href={detailHref} className={styles.link}>
            View run details
          </Link>
        ) : null}
      </header>

      <section>
        <h3 className={styles.label}>Task</h3>
        <p className={styles.text}>{run.input.text}</p>
      </section>

      {run.output ? (
        <section>
          <h3 className={styles.label}>Answer</h3>
          <p className={styles.text}>{run.output.text}</p>
        </section>
      ) : null}

      {run.status === "waiting_approval" ? (
        <p role="status" className={styles.hint}>
          The agent proposed an action that needs a person. An owner or admin must approve it before anything happens.
        </p>
      ) : null}

      {guidance ? (
        <div role="alert" className={styles.alert}>
          <strong>{guidance.title}</strong>
          <span>{guidance.hint}</span>
          {run.errorCode && guidance.title !== "The run failed" ? <code>{run.errorCode}</code> : null}
        </div>
      ) : null}

      <dl className={styles.meta} data-testid="run-meta">
        {run.modelProvider && run.model ? (
          <div>
            <dt>Model</dt>
            <dd>{`${run.modelProvider} / ${run.model}`}</dd>
          </div>
        ) : null}
        {hasUsage ? (
          <div>
            <dt>Usage</dt>
            <dd>{`${run.inputTokens} in / ${run.outputTokens} out tokens`}</dd>
          </div>
        ) : null}
        {duration !== null ? (
          <div>
            <dt>Duration</dt>
            <dd>{formatDuration(duration)}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
