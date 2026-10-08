"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { KNOWLEDGE_LIMITS } from "../knowledge-model";
import styles from "./knowledge.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type AddDocumentFormProps = {
  action: Action;
  /** An archived base cannot receive documents. */
  disabled: boolean;
};

export function AddDocumentForm({ action, disabled }: AddDocumentFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  // Controlled so a refused submit keeps the pasted text; a successful one empties the form.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (state.ok) {
      setTitle("");
      setContent("");
    }
  }, [state]);

  if (disabled) {
    return <p className={styles.hint}>This knowledge base is archived, so documents can no longer be added.</p>;
  }

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        Title
        <input
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={KNOWLEDGE_LIMITS.title}
          autoComplete="off"
          required
        />
      </label>
      <label className={styles.field}>
        Text
        <textarea
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={KNOWLEDGE_LIMITS.content}
          rows={10}
          required
        />
        <span className={styles.counter}>
          {content.length.toLocaleString("en-US")} / {KNOWLEDGE_LIMITS.content.toLocaleString("en-US")} characters. Plain text or Markdown; headings become sections.
        </span>
      </label>
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add document"}
      </Button>
    </form>
  );
}
