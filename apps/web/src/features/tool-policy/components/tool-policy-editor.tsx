"use client";

import { useActionState, useState } from "react";
import { Button, StatusBadge } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { useControlledResetKey } from "@/lib/use-controlled-reset-key";
import { formatToolName } from "@/features/runs/run-view";
import { describeRisk, type ToolOption } from "@/features/agents/tool-bindings";
import { RULE_OPTIONS, type RuleChoice, type ToolRules } from "../tool-policy-model";
import styles from "./tool-policy.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type ToolPolicyEditorProps = {
  action: Action;
  tools: ToolOption[];
  /** The rules in force, one per tool at most. */
  rules: ToolRules;
};

const EFFECT: Record<RuleChoice, string | null> = {
  none: null,
  approval_required: "Every use asks a person first, even when an agent is set to run this tool automatically.",
  blocked: "No agent in this workspace can use this tool. It is not offered to the model.",
};

export function ToolPolicyEditor({ action, tools, rules }: ToolPolicyEditorProps) {
  const [state, formAction, pending] = useActionState(action, {});
  const [choices, setChoices] = useState<Record<string, RuleChoice>>(() =>
    Object.fromEntries(tools.map((tool) => [tool.name, Object.hasOwn(rules, tool.name) ? rules[tool.name]! : "none"])),
  );
  const epoch = useControlledResetKey(state);

  if (tools.length === 0) {
    return <p className={styles.hint}>No tools are available yet.</p>;
  }

  return (
    <form action={formAction} className={styles.form}>
      <ul className={styles.list}>
        {tools.map((tool) => {
          const risk = describeRisk(tool.risk);
          const id = `rule-${tool.name}`;
          const choice = choices[tool.name] ?? "none";
          const effect = EFFECT[choice];
          return (
            <li key={tool.name} className={styles.item}>
              <div className={styles.text}>
                <label htmlFor={id} className={styles.name}>
                  {formatToolName(tool.name)}
                </label>
                <span className={styles.description}>{tool.description}</span>
                <StatusBadge tone={risk.tone}>{risk.label}</StatusBadge>
                {effect ? <span className={styles.effect}>{effect}</span> : null}
              </div>
              <select
                key={`${tool.name}-${epoch}`}
                id={id}
                name={`rule:${tool.name}`}
                value={choice}
                onChange={(event) => setChoices((current) => ({ ...current, [tool.name]: event.target.value as RuleChoice }))}
                className={styles.select}
              >
                {RULE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </li>
          );
        })}
      </ul>

      {state.message ? (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? styles.ok : styles.error}>
          {state.message}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save policy"}
      </Button>
    </form>
  );
}
