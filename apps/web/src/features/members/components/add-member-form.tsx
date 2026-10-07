"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { useControlledResetKey } from "@/lib/use-controlled-reset-key";
import { MEMBER_ROLES } from "../member-roles";
import styles from "./members.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function AddMemberForm({ action }: { action: Action }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("auditor");

  const wrapped: Action = async (previous, formData) => {
    const result = await action(previous, formData);
    if (result.ok) setEmail("");
    return result;
  };
  const [state, formAction, pending] = useActionState(wrapped, {});
  const resetKey = useControlledResetKey(state);

  return (
    <form action={formAction} className={styles.addForm}>
      <label className={styles.field}>
        Email
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          maxLength={320}
          autoComplete="off"
        />
      </label>
      <label className={styles.field}>
        Role
        <select key={resetKey} name="role" value={role} onChange={(event) => setRole(event.target.value)}>
          {MEMBER_ROLES.map((value) => (
            <option key={value} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add member"}
      </Button>
      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
