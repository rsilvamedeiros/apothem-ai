import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import { describeAgentStatus, type AgentStatus } from "../agent-status";
import styles from "./agent-list.module.css";

export type AgentListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: AgentStatus;
  activeVersionId: string | null;
};

export function AgentList({ agents, basePath }: { agents: AgentListItem[]; basePath: string }) {
  if (agents.length === 0) {
    return <div className={styles.empty}>No agents yet in this workspace.</div>;
  }

  return (
    <ul className={styles.list}>
      {agents.map((agent) => {
        const status = describeAgentStatus(agent.status);
        return (
          <li key={agent.id} className={styles.row}>
            <div className={styles.main}>
              <Link href={`${basePath}/${agent.id}`} className={styles.name}>
                {agent.name}
              </Link>
              <span className={styles.slug}>{agent.slug}</span>
              {agent.description ? (
                <span className={styles.description}>{agent.description}</span>
              ) : null}
            </div>
            <div className={styles.meta}>
              <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              <span className={styles.version}>
                {agent.activeVersionId ? "Published" : "Not published"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
