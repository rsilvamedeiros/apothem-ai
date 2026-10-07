"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import { INSTRUCTIONS_MAX_LENGTH } from "../agent-form";
import type { ActionState } from "./action-state";
import styles from "./draft-editor.module.css";

type DraftEditorProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initialInstructions: string;
  disabled: boolean;
};

export function DraftEditor({ action, initialInstructions, disabled }: DraftEditorProps) {
  const [state, formAction, pending] = useActionState(action, {});
  // Controlled so a failed save never discards what the user typed.
  const [instructions, setInstructions] = useState(initialInstructions);

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        Instructions
        <textarea
          name="instructions"
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          maxLength={INSTRUCTIONS_MAX_LENGTH}
          rows={12}
          disabled={disabled}
        />
      </label>
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={disabled || pending}>
        {pending ? "Saving…" : "Save draft"}
      </Button>
    </form>
  );
}
