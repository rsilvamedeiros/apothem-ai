import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Solutions — APOTHEM AI",
  description:
    "APOTHEM Product + Solutions operating model: customer implementations built on reusable platform primitives.",
};

export default function SolutionsPage() {
  return (
    <main className={styles.main}>
      <SiteHeader />

      <section className={styles.intro}>
        <span className={styles.eyebrow}>Product + Solutions</span>
        <h1 className={styles.headline}>
          Real business problems, solved with reusable primitives.
        </h1>
        <p className={styles.subhead}>
          APOTHEM can solve concrete enterprise problems before every
          platform surface is self-service — without becoming a generic
          software house whose projects do not strengthen the core.
        </p>
      </section>

      <section className={styles.grid}>
        <Card className={styles.card}>
          <h2 className={styles.cardTitle}>APOTHEM Platform</h2>
          <p className={styles.cardBody}>
            Reusable multi-tenant product capabilities: agents, knowledge,
            connections, flow and control.
          </p>
        </Card>
        <Card className={styles.card}>
          <h2 className={styles.cardTitle}>APOTHEM Solutions</h2>
          <p className={styles.cardBody}>
            Customer-specific configuration, integration and implementation
            built using Platform primitives — not disconnected one-off
            code.
          </p>
        </Card>
      </section>

      <section className={styles.note}>
        <p>
          A solution earns a new platform primitive only when it is likely
          reusable across customers, strategically differentiating, required
          for enterprise readiness, or materially improves the platform
          architecture. Customization debt is tracked deliberately.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
