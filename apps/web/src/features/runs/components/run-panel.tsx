"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@apothem/ui";
import { MAX_RUN_INPUT_LENGTH, type RunView } from "../run-view";
import { RunResultCard } from "./run-result-card";
import styles from "./runs.module.css";

export type RunPanelState = { message?: string; run?: RunView };

type RunPanelProps = {
  action: (state: RunPanelState, formData: FormData) => Promise<RunPanelState>;
  /** Only an active published agent can run. */
  runnable: boolean;
  /** Path under which run detail pages live (a plain string: functions cannot cross to a client component). */
  detailBasePath?: string;
};

const newKey = () => crypto.randomUUID();

export function RunPanel({ action, runnable, detailBasePath }: RunPanelProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [task, setTask] = useState("");
  // One key per submit attempt: a double click replays the same run instead of paying for two.
  const [idempotencyKey, setIdempotencyKey] = useState(newKey);

  // A finished run consumes the key; the next submit starts a new attempt.
  useEffect(() => {
    if (state.run) setIdempotencyKey(newKey());
  }, [state.run]);

  if (!runnable) {
    return <p className={styles.hint}>Publish the agent to test it. Drafts, disabled and archived agents cannot run.</p>;
  }

  return (
    <div className={styles.panel}>
      <form action={formAction} className={styles.panel}>
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
        <label className={styles.field}>
          Task
          <textarea
            name="task"
            value={task}
            onChange={(event) => setTask(event.target.value)}
            maxLength={MAX_RUN_INPUT_LENGTH}
            rows={4}
            required
          />
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Running…" : "Run agent"}
        </Button>
        {state.message ? (
          <p role="alert" className={styles.error}>
            {state.message}
          </p>
        ) : null}
      </form>

      {state.run ? <RunResultCard run={state.run} {...(detailBasePath ? { detailHref: `${detailBasePath}/${state.run.id}` } : {})} /> : null}
    </div>
  );
}
