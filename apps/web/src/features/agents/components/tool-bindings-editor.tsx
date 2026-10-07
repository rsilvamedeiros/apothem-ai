"use client";

import { useActionState, useState } from "react";
import { Button, StatusBadge } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { useControlledResetKey } from "@/lib/use-controlled-reset-key";
import { formatToolName } from "@/features/runs/run-view";
import { bindingsToModes, describeRisk, type BindingMode, type ToolOption } from "../tool-bindings";
import styles from "./tool-bindings-editor.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type ToolBindingsEditorProps = {
  action: Action;
  tools: ToolOption[];
  /** The draft's stored bindings; anything stale or malformed counts as off. */
  bindings: unknown;
  disabled: boolean;
};

export function ToolBindingsEditor({ action, tools, bindings, disabled }: ToolBindingsEditorProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [modes, setModes] = useState<Record<string, BindingMode>>(() => bindingsToModes(bindings, tools));
  const epoch = useControlledResetKey(state);

  if (tools.length === 0) {
    return <p className={styles.hint}>No tools are available yet.</p>;
  }

  const hasAutomaticWrite = tools.some((tool) => tool.risk !== "read_only" && modes[tool.name] === "auto");

  return (
    <form action={formAction} className={styles.form}>
      <ul className={styles.list}>
        {tools.map((tool) => {
          const risk = describeRisk(tool.risk);
          const id = `tool-${tool.name}`;
          return (
            <li key={tool.name} className={styles.item}>
              <div className={styles.text}>
                <label htmlFor={id} className={styles.name}>
                  {formatToolName(tool.name)}
                </label>
                <span className={styles.description}>{tool.description}</span>
                <StatusBadge tone={risk.tone}>{risk.label}</StatusBadge>
              </div>
              <select
                key={`${tool.name}-${epoch}`}
                id={id}
                name={`tool:${tool.name}`}
                value={modes[tool.name] ?? "off"}
                onChange={(event) => setModes((current) => ({ ...current, [tool.name]: event.target.value as BindingMode }))}
                disabled={disabled}
                className={styles.select}
              >
                <option value="off">Off</option>
                <option value="required">Ask a person first (recommended)</option>
                {tool.allowedApprovalModes.includes("auto") ? <option value="auto">Run automatically</option> : null}
              </select>
            </li>
          );
        })}
      </ul>

      {hasAutomaticWrite ? (
        <p className={styles.warning}>
          A tool set to run automatically changes data without asking a person. Use it only for actions that are safe to repeat or undo.
        </p>
      ) : null}

      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={disabled || pending}>
        {pending ? "Saving…" : "Save tools"}
      </Button>
    </form>
  );
}
