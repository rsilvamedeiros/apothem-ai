import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import { describeAgentStatus } from "../agent-status";
import type { ActionState } from "../components/action-state";
import { DraftEditor } from "../components/draft-editor";
import { StatusControls } from "../components/status-controls";
import { ToolBindingsEditor } from "../components/tool-bindings-editor";
import type { LoadToolsResult } from "../load-tools";
import { RunPanel, type RunPanelState } from "@/features/runs/components/run-panel";
import type { LoadAgentDetailResult } from "../load-agent-detail";
import styles from "./agent-detail-view.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type AgentDetailViewProps = {
  result: LoadAgentDetailResult;
  backHref: string;
  saveDraft: Action;
  publish: Action;
  disable: Action;
  archive: Action;
  startRun: (state: RunPanelState, formData: FormData) => Promise<RunPanelState>;
  runBasePath: string;
  saveTools: Action;
  tools: LoadToolsResult;
};

const SHORT_CHECKSUM_LENGTH = 8;

function failureMessage(result: Exclude<LoadAgentDetailResult, { kind: "ok" }>): string {
  switch (result.kind) {
    case "not_found":
      return "Agent not found.";
    case "unreachable":
      return "apothem-api is unreachable. Try again shortly.";
    case "error":
      return result.message;
  }
}

export function AgentDetailView({ result, backHref, saveDraft, publish, disable, archive, startRun, runBasePath, saveTools, tools }: AgentDetailViewProps) {
  const back = (
    <Link href={backHref} className={styles.back}>
      ← Agents
    </Link>
  );

  if (result.kind !== "ok") {
    return (
      <div className={styles.page}>
        {back}
        <div role="alert" className={styles.alert}>
          {failureMessage(result)}
        </div>
      </div>
    );
  }

  const { agent, draft, versions } = result;
  const status = describeAgentStatus(agent.status);
  const archived = agent.status === "archived";

  return (
    <div className={styles.page}>
      {back}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{agent.name}</h1>
          <span className={styles.slug}>{agent.slug}</span>
          {agent.description ? <p className={styles.description}>{agent.description}</p> : null}
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Draft</h2>
        <p className={styles.hint}>
          The draft is editable. Publishing freezes it into an immutable version; later edits never change a
          published version.
        </p>
        <DraftEditor action={saveDraft} initialInstructions={draft.instructions} disabled={archived} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tools</h2>
        <p className={styles.hint}>
          Tools let the agent act. It can only use the ones listed here, and a tool that changes data should ask a person first.
          Changes apply to the next version you publish.
        </p>
        {tools.kind === "ok" ? (
          <ToolBindingsEditor action={saveTools} tools={tools.tools} bindings={draft.toolBindings} disabled={archived} />
        ) : (
          <p className={styles.hint}>{tools.message}</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Lifecycle</h2>
        <StatusControls status={agent.status} publish={publish} disable={disable} archive={archive} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Test run</h2>
        <RunPanel
          action={startRun}
          runnable={agent.status === "active" && agent.activeVersionId !== null}
          detailBasePath={runBasePath}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Versions</h2>
        {versions.length === 0 ? (
          <p className={styles.hint}>No versions published yet.</p>
        ) : (
          <ul className={styles.versions}>
            {versions.map((version) => (
              <li key={version.id} className={styles.version}>
                <span className={styles.versionName}>Version {version.versionNumber}</span>
                {version.id === agent.activeVersionId ? (
                  <StatusBadge tone="success">Active version</StatusBadge>
                ) : null}
                <span className={styles.checksum} title="Snapshot checksum (SHA-256)">
                  {version.checksum.slice(0, SHORT_CHECKSUM_LENGTH)}
                </span>
                <time dateTime={version.createdAt} className={styles.time}>
                  {new Date(version.createdAt).toISOString().slice(0, 10)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
