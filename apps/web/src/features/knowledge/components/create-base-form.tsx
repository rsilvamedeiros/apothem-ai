"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { KNOWLEDGE_LIMITS } from "../knowledge-model";
import styles from "./knowledge.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function CreateBaseForm({ action }: { action: Action }) {
  const [state, formAction, pending] = useActionState(action, {});
  // Controlled so a refused submit never wipes what the person typed.
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form action={formAction} className={styles.form}>
      <label className={styles.field}>
        Name
        <input
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={KNOWLEDGE_LIMITS.name}
          autoComplete="off"
          required
        />
      </label>
      <label className={styles.field}>
        Description (optional)
        <textarea
          name="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={KNOWLEDGE_LIMITS.description}
          rows={2}
        />
      </label>
      {state.message ? (
        <p role="alert" className={styles.error}>
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create knowledge base"}
      </Button>
    </form>
  );
}
