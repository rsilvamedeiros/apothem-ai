"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import { describeSource, KNOWLEDGE_LIMITS, type EvidenceView } from "../knowledge-model";
import styles from "./knowledge.module.css";

export type SearchPanelState = { message?: string; query?: string; results?: EvidenceView[] };

type SearchPanelProps = {
  action: (state: SearchPanelState, formData: FormData) => Promise<SearchPanelState>;
  /** An archived base cannot be searched. */
  disabled: boolean;
};

/** Shows exactly what an agent bound to this base would be given for a query. */
export function SearchPanel({ action, disabled }: SearchPanelProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [query, setQuery] = useState("");

  if (disabled) {
    return <p className={styles.hint}>An archived knowledge base cannot be searched.</p>;
  }

  return (
    <div className={styles.form}>
      <form action={formAction} className={styles.form}>
        <label className={styles.field}>
          Question or keywords
          <input
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            maxLength={KNOWLEDGE_LIMITS.query}
            autoComplete="off"
            required
          />
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Searching…" : "Search"}
        </Button>
      </form>

      {state.message ? (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      ) : null}

      {state.results && state.results.length === 0 ? (
        <p role="status" className={styles.hint}>
          No passage matched. An agent would receive nothing for this query.
        </p>
      ) : null}

      {state.results && state.results.length > 0 ? (
        <ol className={styles.results} aria-label="Matching passages">
          {state.results.map((result) => (
            <li key={result.evidenceId} className={styles.result}>
              <span className={styles.source}>
                {result.title} · {describeSource(result)}
              </span>
              <blockquote className={styles.quote}>{result.text}</blockquote>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
