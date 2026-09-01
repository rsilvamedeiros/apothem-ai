import { Card } from "@apothem/ui";
import type { SourceType } from "../source-types";
import styles from "./source-type-card.module.css";

export function SourceTypeCard({ sourceType }: { sourceType: SourceType }) {
  return (
    <Card className={styles.card}>
      <span className={styles.title}>{sourceType.title}</span>
      <span className={styles.description}>{sourceType.description}</span>
    </Card>
  );
}
