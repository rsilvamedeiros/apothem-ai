import type { Metadata } from "next";
import { Card } from "@apothem/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Product — APOTHEM AI",
  description:
    "Apothem Core, Agents, Studio, Knowledge, Connect, Flow and Control — the product architecture behind APOTHEM AI.",
};

const FAMILIES = [
  {
    name: "Apothem Core",
    description:
      "Runtime, orchestration, policies, context and shared platform capability.",
  },
  {
    name: "Apothem Agents",
    description: "Configured AI workers with goals, instructions, knowledge, tools and permissions.",
  },
  {
    name: "Apothem Studio",
    description: "Configuration experience for creating and managing agents.",
  },
  {
    name: "Apothem Knowledge",
    description: "Enterprise knowledge ingestion and retrieval, with permission-aware evidence.",
  },
  {
    name: "Apothem Connect",
    description: "Integrations, credentials and typed tool adapters.",
  },
  {
    name: "Apothem Flow",
    description: "Durable workflows combining deterministic logic and agent reasoning.",
  },
  {
    name: "Apothem Control",
    description: "Governance, audit, usage, security and observability.",
  },
];

export default function ProductPage() {
  return (
    <main className={styles.main}>
      <SiteHeader />

      <section className={styles.intro}>
        <span className={styles.eyebrow}>Product architecture</span>
        <h1 className={styles.headline}>One platform, seven capabilities.</h1>
        <p className={styles.subhead}>
          APOTHEM is built as a reusable intelligence core rather than a
          single-purpose chatbot. Every capability below is a shared
          platform primitive, not a one-off feature.
        </p>
      </section>

      <section className={styles.grid}>
        {FAMILIES.map((family) => (
          <Card key={family.name} className={styles.card}>
            <h2 className={styles.cardTitle}>{family.name}</h2>
            <p className={styles.cardBody}>{family.description}</p>
          </Card>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
