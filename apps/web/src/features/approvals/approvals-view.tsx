import Link from "next/link";
import type { ActionState } from "@/lib/action-state";
import { ApprovalCard } from "./components/approval-card";
import type { LoadApprovalsResult } from "./load-approvals";
import type { ApprovalStatus } from "../runs/run-view";
import styles from "../runs/runs-view.module.css";
import list from "./components/approvals.module.css";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

type ApprovalsViewProps = {
  result: LoadApprovalsResult;
  /** Path of the approvals page, e.g. /org/:id/workspace/:id/approvals. */
  basePath: string;
  runBasePath: string;
  status: ApprovalStatus;
  /** Returns the server action bound to one approval. */
  decide: (approvalId: string) => Action;
};

const TABS: readonly { status: ApprovalStatus; label: string }[] = [
  { status: "pending", label: "Pending" },
  { status: "approved", label: "Approved" },
  { status: "rejected", label: "Rejected" },
  { status: "expired", label: "Expired" },
];

export function ApprovalsView({ result, basePath, runBasePath, status, decide }: ApprovalsViewProps) {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.title}>Approvals</h1>
        <p className={styles.description}>
          Actions agents want to take. Nothing is performed until an owner or admin approves it, and
          you can&apos;t approve a request you started while another approver is available.
        </p>
      </header>

      <nav aria-label="Approval status" className={styles.pager}>
        {TABS.map((tab) => (
          <Link
            key={tab.status}
            href={`${basePath}?status=${tab.status}`}
            aria-current={tab.status === status ? "page" : undefined}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

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

      {result.kind === "ok" && result.approvals.length === 0 ? (
        <div className={styles.empty}>No {status} approvals.</div>
      ) : null}

      {result.kind === "ok" && result.approvals.length > 0 ? (
        <ul className={list.list}>
          {result.approvals.map((approval) => (
            <li key={approval.id}>
              <ApprovalCard
                approval={approval}
                runHref={`${runBasePath}/${approval.runId}`}
                {...(approval.status === "pending" ? { decide: decide(approval.id) } : {})}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {result.kind === "ok" && result.nextCursor ? (
        <nav className={styles.pager} aria-label="Approval pages">
          <Link href={`${basePath}?status=${status}&cursor=${encodeURIComponent(result.nextCursor)}`}>Older</Link>
        </nav>
      ) : null}
    </div>
  );
}
