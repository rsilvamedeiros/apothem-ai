import Link from "next/link";
import { Card } from "@apothem/ui";
import styles from "./overview.module.css";

const STATS = [
  { label: "Agents", value: 0 },
  { label: "Knowledge sources", value: 0 },
  { label: "Connections", value: 0 },
  { label: "Pending approvals", value: 0 },
] as const;

const QUICK_START = [
  {
    segment: "agents",
    title: "Create an agent",
    description: "Start from a template or a blank agent and define its job.",
  },
  {
    segment: "knowledge",
    title: "Add knowledge",
    description: "Connect a source so agents can retrieve and cite evidence.",
  },
  {
    segment: "connections",
    title: "Add a connection",
    description: "Give an agent a typed tool contract to act on your systems.",
  },
] as const;

type PageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function OverviewPage({ params }: PageProps) {
  const { organizationId, workspaceId } = await params;
  const basePath = `/org/${organizationId}/workspace/${workspaceId}`;

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1 className={styles.title}>Overview</h1>
        <p className={styles.description}>
          A snapshot of agent activity, pending approvals, and workspace health.
        </p>
      </div>

      <div className={styles.statRow}>
        {STATS.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <span className={styles.statValue}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </Card>
        ))}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Get started</h2>
        <div className={styles.quickStartGrid}>
          {QUICK_START.map((item) => (
            <Card key={item.segment} className={styles.quickStartCard}>
              <Link href={`${basePath}/${item.segment}`} className={styles.quickStartLink}>
                <span className={styles.quickStartTitle}>{item.title}</span>
                <span className={styles.quickStartDescription}>{item.description}</span>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent activity</h2>
        <div className={styles.activityEmpty}>
          No runs yet. Activity from agents and flows will show up here as a timeline.
        </div>
      </section>
    </div>
  );
}
