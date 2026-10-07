import Link from "next/link";
import type { LoadAuditEventsResult } from "./load-audit-events";
import styles from "./audit-view.module.css";

type AuditViewProps = {
  result: LoadAuditEventsResult;
  /** Path of the audit page, e.g. /org/:id/audit. */
  basePath: string;
  /** True when a cursor is in use, i.e. not the first page. */
  isLaterPage?: boolean;
};

const SHORT_ID_LENGTH = 8;

function ShortId({ id }: { id: string }) {
  return (
    <span className={styles.id} title={id}>
      {id.slice(0, SHORT_ID_LENGTH)}
    </span>
  );
}

/** Fixed UTC format so audit timestamps read the same for every viewer. */
function formatUtc(iso: string): string {
  return `${new Date(iso).toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

export function AuditView({ result, basePath, isLaterPage = false }: AuditViewProps) {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Audit log</h1>
        <p className={styles.description}>
          Immutable record of security and business-relevant actions in this organization, newest first.
        </p>
      </header>

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

      {result.kind === "ok" && result.events.length === 0 ? (
        <div className={styles.empty}>No audit events yet.</div>
      ) : null}

      {result.kind === "ok" && result.events.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">Action</th>
              <th scope="col">Actor</th>
              <th scope="col">Target</th>
              <th scope="col">Workspace</th>
            </tr>
          </thead>
          <tbody>
            {result.events.map((event) => (
              <tr key={event.id}>
                <td>
                  <time dateTime={event.createdAt}>{formatUtc(event.createdAt)}</time>
                </td>
                <td className={styles.action}>{event.action}</td>
                <td>
                  <ShortId id={event.actorPrincipalId} />
                </td>
                <td>
                  {event.targetType} <ShortId id={event.targetId} />
                </td>
                <td>{event.workspaceId ? <ShortId id={event.workspaceId} /> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <nav className={styles.pager} aria-label="Audit log pages">
        {isLaterPage ? <Link href={basePath}>Latest events</Link> : null}
        {result.kind === "ok" && result.nextCursor ? (
          <Link href={`${basePath}?cursor=${encodeURIComponent(result.nextCursor)}`}>Older events</Link>
        ) : null}
      </nav>
    </div>
  );
}
