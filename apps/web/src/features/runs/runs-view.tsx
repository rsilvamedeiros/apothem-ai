import Link from "next/link";
import { StatusBadge } from "@apothem/ui";
import type { LoadRunsResult } from "./load-runs";
import { describeRunError, describeRunStatus } from "./run-view";
import styles from "./components/runs.module.css";
import page from "./runs-view.module.css";

type RunsViewProps = {
  result: LoadRunsResult;
  /** Path of the runs page, e.g. /org/:id/workspace/:id/runs. */
  basePath: string;
  isLaterPage?: boolean;
};

const TASK_PREVIEW_LENGTH = 100;

function preview(text: string): string {
  return text.length > TASK_PREVIEW_LENGTH ? `${text.slice(0, TASK_PREVIEW_LENGTH).trimEnd()}…` : text;
}

/** Fixed UTC format so timestamps read the same for every viewer. */
function formatUtc(iso: string): string {
  return `${new Date(iso).toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

export function RunsView({ result, basePath, isLaterPage = false }: RunsViewProps) {
  return (
    <div className={page.page}>
      <header>
        <h1 className={page.title}>Runs</h1>
        <p className={page.description}>
          Every execution of an agent in this workspace, newest first. Each run is kept as a durable record.
        </p>
      </header>

      {result.kind === "error" ? (
        <div role="alert" className={page.alert}>
          {result.message}
        </div>
      ) : null}
      {result.kind === "unreachable" ? (
        <div role="alert" className={page.alert}>
          apothem-api is unreachable. Try again shortly.
        </div>
      ) : null}

      {result.kind === "ok" && result.runs.length === 0 ? (
        <div className={page.empty}>No runs yet. Publish an agent and use its Test run panel.</div>
      ) : null}

      {result.kind === "ok" && result.runs.length > 0 ? (
        <table className={page.table}>
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Task</th>
              <th scope="col">Started</th>
            </tr>
          </thead>
          <tbody>
            {result.runs.map((run) => {
              const status = describeRunStatus(run.status);
              return (
                <tr key={run.id}>
                  <td>
                    <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
                    {run.status === "failed" ? <span className={page.failure}>{describeRunError(run.errorCode).title}</span> : null}
                  </td>
                  <td>
                    <Link href={`${basePath}/${run.id}`} className={styles.link}>
                      {preview(run.input.text)}
                    </Link>
                  </td>
                  <td>
                    <time dateTime={run.createdAt}>{formatUtc(run.createdAt)}</time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      <nav className={page.pager} aria-label="Runs pages">
        {isLaterPage ? <Link href={basePath}>Latest runs</Link> : null}
        {result.kind === "ok" && result.nextCursor ? (
          <Link href={`${basePath}?cursor=${encodeURIComponent(result.nextCursor)}`}>Older runs</Link>
        ) : null}
      </nav>
    </div>
  );
}
