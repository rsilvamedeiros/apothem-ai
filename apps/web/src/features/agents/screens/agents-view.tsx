import { Button } from "@apothem/ui";
import { AgentList } from "../components/agent-list";
import { UseCaseCard } from "../components/use-case-card";
import type { LoadAgentsResult } from "../load-agents";
import { USE_CASE_TEMPLATES } from "../use-case-templates";
import styles from "./agents-view.module.css";

type AgentsViewProps = {
  result: LoadAgentsResult;
  /** True only in development; production never shows demo data. */
  allowDemo: boolean;
  /** Path of the agents list, e.g. /org/:id/workspace/:id/agents. */
  basePath: string;
};

export function AgentsView({ result, allowDemo, basePath }: AgentsViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Agents</h1>
          <p className={styles.description}>
            Agents defined for this workspace, their published version, and draft state.
          </p>
        </div>
        <Button href={`${basePath}/new`}>New agent</Button>
      </div>

      {result.kind === "ok" ? <AgentList agents={result.agents} /> : null}
      {result.kind === "error" ? (
        <div role="alert" className={styles.alert}>
          {result.message}
        </div>
      ) : null}
      {result.kind === "unreachable" ? (
        <div role="alert" className={styles.alert}>
          {allowDemo
            ? "Demo data — apothem-api is not running, so no agents can be shown."
            : "apothem-api is unreachable. Try again shortly."}
        </div>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Start from a use case</h2>
        <p className={styles.sectionHint}>
          Template selection isn&apos;t wired up yet — these previews show what new agents
          will start from.
        </p>
        <div className={styles.templateGrid}>
          {USE_CASE_TEMPLATES.map((template) => (
            <UseCaseCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );
}
