"use client";

import { useActionState, useState } from "react";
import { Button } from "@apothem/ui";
import { AGENT_LIMITS, type CreateAgentFieldErrors } from "../agent-form";
import styles from "./create-agent-form.module.css";

export type CreateAgentFormState = {
  errors?: CreateAgentFieldErrors;
  message?: string;
};

type CreateAgentFormProps = {
  action: (state: CreateAgentFormState, formData: FormData) => Promise<CreateAgentFormState>;
};

export function CreateAgentForm({ action }: CreateAgentFormProps) {
  const [state, formAction, pending] = useActionState(action, {});
  // Controlled so a failed submit never wipes what the user typed.
  const [values, setValues] = useState({ name: "", slug: "", description: "" });
  const errors = state.errors ?? {};

  const bind = (field: keyof typeof values) => ({
    name: field,
    value: values[field],
    onChange: (event: { target: { value: string } }) =>
      setValues((current) => ({ ...current, [field]: event.target.value })),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  return (
    <form action={formAction} className={styles.form} noValidate>
      {state.message ? (
        <div role="alert" className={styles.alert}>
          {state.message}
        </div>
      ) : null}

      <label className={styles.field}>
        Name
        <input {...bind("name")} required maxLength={AGENT_LIMITS.name} autoComplete="off" />
        {errors.name ? (
          <span id="name-error" className={styles.error}>
            {errors.name}
          </span>
        ) : null}
      </label>

      <label className={styles.field}>
        Slug (optional — generated from the name)
        <input {...bind("slug")} maxLength={AGENT_LIMITS.slug} autoComplete="off" />
        {errors.slug ? (
          <span id="slug-error" className={styles.error}>
            {errors.slug}
          </span>
        ) : null}
      </label>

      <label className={styles.field}>
        Description (optional)
        <textarea {...bind("description")} maxLength={AGENT_LIMITS.description} rows={3} />
        {errors.description ? (
          <span id="description-error" className={styles.error}>
            {errors.description}
          </span>
        ) : null}
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create agent"}
      </Button>
    </form>
  );
}
