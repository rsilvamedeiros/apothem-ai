"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

export function WorkspaceNav({ basePath }: { basePath: string }) {
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
          </Link>
        );
      })}
    </nav>
  );
}
