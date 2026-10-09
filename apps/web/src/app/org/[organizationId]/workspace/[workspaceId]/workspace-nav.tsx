"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { describePending, formatPendingCount } from "@/features/approvals/approval-summary";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { label: "Overview", segment: "overview" },
  { label: "Agents", segment: "agents" },
  { label: "Knowledge", segment: "knowledge" },
  { label: "Connections", segment: "connections" },
  { label: "Flows", segment: "flows" },
  { label: "Approvals", segment: "approvals" },
  { label: "Runs", segment: "runs" },
  { label: "Settings", segment: "settings" },
] as const;

type WorkspaceNavProps = {
  basePath: string;
  /** Approvals waiting for a person; the badge only appears when it is above zero. */
  pendingApprovals?: number;
};

export function WorkspaceNav({ basePath, pendingApprovals = 0 }: WorkspaceNavProps) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const href = `${basePath}/${item.segment}`;
        const isActive = pathname === href;
        return (
          <Link
            key={item.segment}
            href={href}
            className={isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem}
          >
            {item.label}
            {item.segment === "approvals" && pendingApprovals > 0 ? (
              <>
                <span className={styles.navBadge} aria-hidden="true">
                  {formatPendingCount(pendingApprovals)}
                </span>
                <span className={styles.visuallyHidden}>{describePending(pendingApprovals)}</span>
              </>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
