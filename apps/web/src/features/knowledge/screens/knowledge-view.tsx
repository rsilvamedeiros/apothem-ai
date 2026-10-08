import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { CreateBaseForm } from "../components/create-base-form";
import type { LoadKnowledgeBasesResult } from "../load-knowledge";
import { describeBaseStatus, formatDay } from "../knowledge-model";
import styles from "./knowledge-view.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type KnowledgeViewProps = {
  result: LoadKnowledgeBasesResult;
  /** Path of the knowledge list, e.g. /org/:id/workspace/:id/knowledge. */
  basePath: string;
  createBase: Action;
};

export function KnowledgeView({ result, basePath, createBase }: KnowledgeViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Knowledge</h1>
          <p className={styles.description}>
            Collections of text that agents can search. An agent only reads the collections attached to its published version.
          </p>
        </div>
      </div>

      {result.kind === "ok" ? (
        result.bases.length === 0 ? (
          <div className={styles.empty}>No knowledge bases yet in this workspace.</div>
        ) : (
          <ul className={styles.list}>
            {result.bases.map((base) => {
              const status = describeBaseStatus(base.status);
              return (
                <li key={base.id} className={styles.item}>
                  <div className={styles.itemText}>
                    <Link href={`${basePath}/${base.id}`} className={styles.itemTitle}>
                      {base.name}
                    </Link>
                    {base.description ? <span className={styles.description}>{base.description}</span> : null}
                    <span className={styles.meta}>Created {formatDay(base.createdAt)}</span>
                  </div>
                  <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                </li>
              );
            })}
          </ul>
        )
      ) : null}
      {result.kind === "error" ? (
        <div role="alert" className={styles.alert}>
          {result.message}
        </div>
      ) : null}
      {result.kind === "unreachable" ? (
        <div role="alert" className={styles.alert}>
          apothem-api is unreachable. Try again shortly.
        </div>
      ) : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>New knowledge base</h2>
        <p className={styles.hint}>
          For now, add text by pasting it. Files, web pages and connectors are not supported yet.
        </p>
        <CreateBaseForm action={createBase} />
      </section>
    </div>
  );
}
