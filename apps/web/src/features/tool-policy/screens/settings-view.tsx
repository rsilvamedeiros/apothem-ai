import type { ActionState } from "@/lib/action-state";
import type { LoadToolsResult } from "@/features/agents/load-tools";
import { ToolPolicyEditor } from "../components/tool-policy-editor";
import type { LoadToolPoliciesResult } from "../load-tool-policies";
import styles from "./settings-view.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type SettingsViewProps = {
  tools: LoadToolsResult;
  policies: LoadToolPoliciesResult;
  saveToolPolicies: Action;
};

function failure(tools: LoadToolsResult, policies: LoadToolPoliciesResult): string | null {
  if (tools.kind === "error") return tools.message;
  if (policies.kind === "error") return policies.message;
  if (policies.kind === "unreachable") return "apothem-api is unreachable. Try again shortly.";
  return null;
}

export function SettingsView({ tools, policies, saveToolPolicies }: SettingsViewProps) {
  const message = failure(tools, policies);

  return (
    <div className={styles.page}>
      <div>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.description}>Governance defaults for this workspace.</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tool policy</h2>
        <p className={styles.hint}>
          Agent authors choose which tools an agent can use. These rules are a ceiling on top of that: a rule can block a tool or make it always ask a
          person first, and it never turns a tool on. Rules apply to the next run, and to approvals still waiting. Only owners and admins can change them.
        </p>
        {message === null && tools.kind === "ok" && policies.kind === "ok" ? (
          <ToolPolicyEditor action={saveToolPolicies} tools={tools.tools} rules={policies.rules} />
        ) : (
          <div role="alert" className={styles.alert}>
            {message}
          </div>
        )}
      </section>
    </div>
  );
}
