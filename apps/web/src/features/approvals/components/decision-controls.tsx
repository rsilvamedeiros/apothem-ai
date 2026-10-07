"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { MAX_DECISION_REASON_LENGTH } from "../approval-commands";
import styles from "./approvals.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Approve or reject one pending proposal. The approval id is bound by the
 * server action; the form only carries the decision and an optional reason.
 */
export function DecisionControls({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, {});
  // Controlled so a refused decision never wipes what the user typed.
  const [reason, setReason] = useState("");

  return (
    <form action={formAction} className={styles.controls}>
      <label className={styles.field}>
        Reason (optional)
        <textarea
          name="reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          maxLength={MAX_DECISION_REASON_LENGTH}
          rows={2}
        />
      </label>
      <div className={styles.row}>
        <Button type="submit" name="decision" value="approve" disabled={pending}>
          Approve
        </Button>
        <Button type="submit" name="decision" value="reject" variant="secondary" disabled={pending}>
          Reject
        </Button>
      </div>
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
