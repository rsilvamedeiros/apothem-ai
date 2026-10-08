import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import type { ActionState } from "@/lib/action-state";
import { AddDocumentForm } from "../components/add-document-form";
import { ArchiveBaseControls } from "../components/archive-base-controls";
import { RemoveDocumentButton } from "../components/remove-document-button";
import { SearchPanel, type SearchPanelState } from "../components/search-panel";
import type { LoadKnowledgeBaseResult } from "../load-knowledge";
import { describeBaseStatus, formatCharacters, formatDay, shortChecksum } from "../knowledge-model";
import styles from "./knowledge-view.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type KnowledgeBaseViewProps = {
  result: LoadKnowledgeBaseResult;
  backHref: string;
  addDocument: Action;
  /** Builds the remove action for one document; called here, on the server, so only the resulting action crosses to the client. */
  removeDocument: (documentId: string) => Action;
  archive: Action;
  search: (state: SearchPanelState, formData: FormData) => Promise<SearchPanelState>;
};

function failureMessage(result: Exclude<LoadKnowledgeBaseResult, { kind: "ok" }>): string {
  switch (result.kind) {
    case "not_found":
      return "Knowledge base not found.";
    case "unreachable":
      return "apothem-api is unreachable. Try again shortly.";
    case "error":
      return result.message;
  }
}

export function KnowledgeBaseView({ result, backHref, addDocument, removeDocument, archive, search }: KnowledgeBaseViewProps) {
  const back = (
    <Link href={backHref} className={styles.back}>
      ← Knowledge
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

  const { base, documents } = result;
  const status = describeBaseStatus(base.status);
  const archived = base.status === "archived";

  return (
    <div className={styles.page}>
      {back}

      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{base.name}</h1>
          {base.description ? <p className={styles.description}>{base.description}</p> : null}
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Documents</h2>
        {documents.length === 0 ? (
          <div className={styles.empty}>No documents yet. Add text below and agents can search it.</div>
        ) : (
          <ul className={styles.list}>
            {documents.map((document) => (
              <li key={document.id} className={styles.item}>
                <div className={styles.itemText}>
                  <span className={styles.itemTitle}>{document.title}</span>
                  <span className={styles.meta}>
                    {formatCharacters(document.contentLength)} · {document.chunkCount} {document.chunkCount === 1 ? "passage" : "passages"} · added{" "}
                    {formatDay(document.createdAt)} · <span className={styles.mono} title="Content checksum (SHA-256)">{shortChecksum(document.checksum)}</span>
                  </span>
                </div>
                <RemoveDocumentButton action={removeDocument(document.id)} title={document.title} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Add a document</h2>
        <p className={styles.hint}>
          Paste plain text or Markdown. The text is split into passages by paragraph and heading, and the source of each passage is kept.
          Adding the same text twice does nothing.
        </p>
        <AddDocumentForm action={addDocument} disabled={archived} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Try a search</h2>
        <p className={styles.hint}>See which passages an agent would receive for a question. The search only looks inside this knowledge base.</p>
        <SearchPanel action={search} disabled={archived} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Lifecycle</h2>
        <ArchiveBaseControls action={archive} archived={archived} />
      </section>
    </div>
  );
}
