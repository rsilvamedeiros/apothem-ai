"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import styles from "./knowledge.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function ArchiveBaseControls({ action, archived }: { action: Action; archived: boolean }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [confirming, setConfirming] = useState(false);

  if (archived) {
    return <p className={styles.hint}>This knowledge base is archived. Agents no longer retrieve from it.</p>;
  }

  return (
    <div className={styles.row}>
      {!confirming ? (
        <Button type="button" variant="secondary" onClick={() => setConfirming(true)}>
          Archive
        </Button>
      ) : (
        <form action={formAction} className={styles.confirm}>
          <p>Archiving stops every agent from retrieving from this knowledge base right away. Its documents are kept.</p>
          <div className={styles.row}>
            <Button type="submit" disabled={pending}>
              Confirm archive
            </Button>
            <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
              Cancel
            </Button>
          </div>
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
