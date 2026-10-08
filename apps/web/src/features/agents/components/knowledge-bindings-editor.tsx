"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { useControlledResetKey } from "@/lib/use-controlled-reset-key";
import { KNOWLEDGE_LIMITS, type KnowledgeBaseView } from "@/features/knowledge/knowledge-model";
import { bindingsToSelection, countUnavailable } from "../knowledge-bindings";
import styles from "./tool-bindings-editor.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type KnowledgeBindingsEditorProps = {
  action: Action;
  bases: KnowledgeBaseView[];
  /** The draft's stored bindings; anything stale or malformed is ignored. */
  bindings: unknown;
  /** Whether the saved draft lets the agent call the search tool. */
  searchToolOn: boolean;
  disabled: boolean;
  /** Where knowledge bases are created. */
  knowledgeHref: string;
};

export function KnowledgeBindingsEditor({ action, bases, bindings, searchToolOn, disabled, knowledgeHref }: KnowledgeBindingsEditorProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const saved = bindingsToSelection(bindings);
  const active = bases.filter((base) => base.status === "active");
  const [selected, setSelected] = useState<string[]>(() => saved.filter((id) => active.some((base) => base.id === id)));
  const epoch = useControlledResetKey(state);

  if (active.length === 0) {
    return (
      <p className={styles.hint}>
        There are no knowledge bases to attach yet. <Link href={knowledgeHref}>Create one</Link> and add some text to it.
      </p>
    );
  }

  const unavailable = countUnavailable(saved, bases);

  return (
    <form action={formAction} className={styles.form}>
      <ul className={styles.list}>
        {active.map((base) => {
          const id = `knowledge-${base.id}`;
          return (
            <li key={base.id} className={styles.item}>
              <div className={styles.text}>
                <label htmlFor={id} className={styles.name}>
                  {base.name}
                </label>
                {base.description ? <span className={styles.description}>{base.description}</span> : null}
              </div>
              <input
                key={`${base.id}-${epoch}`}
                id={id}
                type="checkbox"
                name={`base:${base.id}`}
                checked={selected.includes(base.id)}
                onChange={(event) =>
                  setSelected((current) => (event.target.checked ? [...current, base.id] : current.filter((candidate) => candidate !== base.id)))
                }
                disabled={disabled}
              />
            </li>
          );
        })}
      </ul>

      {selected.length > KNOWLEDGE_LIMITS.bindings ? (
        <p role="alert" className={styles.error}>
          An agent can use at most {KNOWLEDGE_LIMITS.bindings} knowledge bases.
        </p>
      ) : null}

      {selected.length > 0 && !searchToolOn ? (
        <p className={styles.warning}>
          The agent can only search these once the “Search knowledge” tool is turned on under Tools. Turn it on and save.
        </p>
      ) : null}
      {selected.length === 0 && searchToolOn ? (
        <p className={styles.warning}>The “Search knowledge” tool is on, but no knowledge base is attached, so it will find nothing.</p>
      ) : null}
      {unavailable > 0 ? (
        <p className={styles.warning}>
          {unavailable === 1 ? "1 attached knowledge base is" : `${unavailable} attached knowledge bases are`} archived or no longer exist. {unavailable === 1 ? "It returns" : "They return"} nothing and {unavailable === 1 ? "is" : "are"} dropped when you save.
        </p>
      ) : null}

      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={disabled || pending}>
        {pending ? "Saving…" : "Save knowledge"}
      </Button>
    </form>
  );
}
