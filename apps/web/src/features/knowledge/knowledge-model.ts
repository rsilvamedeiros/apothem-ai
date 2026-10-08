import type { StatusTone } from "@apothem/ui";

/** Same limits as apothem-api; the API validates again and its answer wins. */
export const KNOWLEDGE_LIMITS = {
  name: 100,
  description: 500,
  title: 200,
  content: 100_000,
  query: 500,
  /** Knowledge bases one agent version can be bound to. */
  bindings: 5,
} as const;

export type KnowledgeBaseStatus = "active" | "archived";

export type KnowledgeBaseView = {
  id: string;
  name: string;
  description: string | null;
  status: KnowledgeBaseStatus;
  createdAt: string;
  archivedAt: string | null;
};

export type KnowledgeDocumentView = {
  id: string;
  knowledgeBaseId: string;
  title: string;
  checksum: string;
  contentLength: number;
  chunkCount: number;
  createdAt: string;
};

/** One retrieved passage with the identity of its source. */
export type EvidenceView = {
  evidenceId: string;
  knowledgeBaseId: string;
  documentId: string;
  title: string;
  section: string | null;
  ordinal: number;
  text: string;
  score: number;
};

const STATUS_VIEW: Record<KnowledgeBaseStatus, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "success" },
  archived: { label: "Archived", tone: "neutral" },
};

export function describeBaseStatus(status: string): { label: string; tone: StatusTone } {
  return Object.hasOwn(STATUS_VIEW, status) ? STATUS_VIEW[status as KnowledgeBaseStatus] : { label: "Unknown", tone: "neutral" };
}

const SHORT_CHECKSUM_LENGTH = 8;

export function shortChecksum(checksum: string): string {
  return checksum.slice(0, SHORT_CHECKSUM_LENGTH);
}

export function formatDay(iso: string): string {
  const time = new Date(iso).getTime();
  return Number.isNaN(time) ? "unknown date" : new Date(time).toISOString().slice(0, 10);
}

export function formatCharacters(count: number): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? "character" : "characters"}`;
}

/** "Refunds, passage 3" — where in the document a passage came from. */
export function describeSource(evidence: Pick<EvidenceView, "section" | "ordinal">): string {
  const passage = `passage ${evidence.ordinal + 1}`;
  return evidence.section ? `${evidence.section}, ${passage}` : passage;
}
