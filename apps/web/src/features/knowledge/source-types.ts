import type { StatusTone } from "@apothem/ui";

/**
 * Knowledge source kinds, per docs/03-domain/knowledge.md — "Knowledge Source
 * represents the origin/lifecycle: uploaded file, folder sync, URL/domain
 * source, database source or connector-managed source."
 */
export type SourceType = {
  id: string;
  title: string;
  description: string;
};

export const SOURCE_TYPES: SourceType[] = [
  {
    id: "uploaded-file",
    title: "Uploaded file",
    description: "PDF, Word, or text documents uploaded directly.",
  },
  {
    id: "folder-sync",
    title: "Folder sync",
    description: "A shared drive folder kept in sync automatically.",
  },
  {
    id: "url-domain",
    title: "URL or domain",
    description: "Public or internal pages crawled from a URL or domain.",
  },
  {
    id: "database",
    title: "Database",
    description: "Structured records pulled from a connected database.",
  },
  {
    id: "connector-managed",
    title: "Connector-managed",
    description: "A source owned and kept current by a connection's tool.",
  },
];

/**
 * Source lifecycle, per docs/03-domain/knowledge.md: "pending → processing →
 * ready → partially_failed/failed → syncing → disabled/archived."
 */
export const SOURCE_STATUS_TONE: Record<string, StatusTone> = {
  pending: "neutral",
  processing: "info",
  ready: "success",
  partially_failed: "warning",
  failed: "danger",
  syncing: "info",
  disabled: "neutral",
  archived: "neutral",
};
