import { Card } from "@apothem/ui";
import type { UseCaseTemplate } from "../use-case-templates";
import styles from "./use-case-card.module.css";

export function UseCaseCard({ template }: { template: UseCaseTemplate }) {
  return (
    <Card className={styles.card}>
      <span className={styles.title}>{template.title}</span>
      <span className={styles.description}>{template.description}</span>
    </Card>
  );
}
