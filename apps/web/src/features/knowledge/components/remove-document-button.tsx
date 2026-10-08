"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import styles from "./knowledge.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

/** Removing deletes the text and its passages, so it asks twice. */
export function RemoveDocumentButton({ action, title }: { action: Action; title: string }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={styles.row}>
      {!confirming ? (
        <Button type="button" variant="secondary" onClick={() => setConfirming(true)} aria-label={`Remove ${title}`}>
          Remove
        </Button>
      ) : (
        <form action={formAction} className={styles.row}>
          <span className={styles.hint}>Remove “{title}”? This cannot be undone.</span>
          <Button type="submit" disabled={pending}>
            Confirm remove
          </Button>
          <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
            Cancel
          </Button>
        </form>
      )}
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
