import Link from "next/link";
import type { ActionState } from "@/lib/action-state";
import { ApprovalCard } from "../approvals/components/approval-card";
import type { LoadRunResult } from "./load-runs";
import { RunResultCard } from "./components/run-result-card";
import { describeSource } from "../knowledge/knowledge-model";
import { formatDuration } from "./run-view";
import styles from "./runs-view.module.css";

type RunDetailViewProps = {
  result: LoadRunResult;
  backHref: string;
  /** Link to the agent that ran, built by the page from the run's agent id. */
  agentHref: string;
  /** Returns the server action bound to one approval. */
  decide: (approvalId: string) => (state: ActionState, formData: FormData) => Promise<ActionState>;
};

const SHORT_ID_LENGTH = 8;

function failureMessage(result: Exclude<LoadRunResult, { kind: "ok" }>): string {
  switch (result.kind) {
    case "not_found":
      return "Run not found.";
    case "unreachable":
      return "apothem-api is unreachable. Try again shortly.";
    case "error":
      return result.message;
  }
}

export function RunDetailView({ result, backHref, agentHref, decide }: RunDetailViewProps) {
  const back = (
    <Link href={backHref} className={styles.back}>
      ← Runs
    </Link>
  );

  if (result.kind !== "ok") {
    return (
      <div className={styles.page}>
        {back}
        <div role="alert" className={styles.alert}>
          {failureMessage(result)}
        </div>
      </div>
    );
  }

  const { run, steps, approvals, sources = [] } = result;
  return (
    <div className={styles.page}>
      {back}
      <RunResultCard run={run} />

      <section>
        <h2 className={styles.title}>Record</h2>
        <p className={styles.description}>
          Agent version{" "}
          <span className={styles.mono} title={run.agentVersionId}>
            {run.agentVersionId.slice(0, SHORT_ID_LENGTH)}
          </span>{" "}
          ran exactly this configuration.{" "}
          <Link href={agentHref}>View agent</Link>
        </p>
      </section>

      {sources.length > 0 ? (
        <section>
          <h2 className={styles.title}>Sources consulted</h2>
          <p className={styles.description}>The passages this run read from knowledge before answering. The text itself stays in the knowledge base.</p>
          <ul className={styles.steps} aria-label="Sources consulted">
            {sources.map((source) => (
              <li key={source.evidenceId} className={styles.step}>
                <span>{source.title}</span>
                <span className={styles.mono}>{describeSource(source)}</span>
                <span>step {source.stepSequence}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {approvals.length > 0 ? (
        <section>
          <h2 className={styles.title}>Approvals</h2>
          <ul className={styles.steps}>
            {approvals.map((approval) => (
              <li key={approval.id}>
                <ApprovalCard
                  approval={approval}
                  {...(approval.status === "pending" ? { decide: decide(approval.id) } : {})}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className={styles.title}>Steps</h2>
        {steps.length === 0 ? (
          <p className={styles.description}>No steps were recorded.</p>
        ) : (
          <ul className={styles.steps}>
            {steps.map((step) => (
              <li key={step.id} className={styles.step}>
                <span>{step.sequence}.</span>
                <span className={styles.mono}>{step.type}</span>
                <span>{step.status}</span>
                {step.finishReason ? <span className={styles.mono}>{step.finishReason}</span> : null}
                <span>{formatDuration(step.durationMs)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
