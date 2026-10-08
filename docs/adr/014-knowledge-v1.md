# ADR-014 — Knowledge, v1

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

Agents can now run, call tools and ask for approval ([ADR-013](013-tools-and-approvals-v1.md)), but they only know what the model knows. Phase 2 of the roadmap adds Knowledge: workspace content an agent may ground its answers on, with the source of every passage preserved so an answer can be traced back to authorized evidence. The target architecture (`05-knowledge/`) is hybrid retrieval with embeddings, connectors and object storage. This ADR fixes the first slice so the safety properties exist before the heavy parts do.

## Decision

1. **Scope of v1.** A **knowledge base** belongs to one workspace. It holds **documents** added as plain text or Markdown through the API. Ingestion is synchronous and bounded. Files, URLs, connectors, PDFs and spreadsheets are out of scope; they need the queue, object storage and sandboxed parsers.
2. **The document is authoritative, the index is rebuildable.** The normalized text is stored with the document, together with a SHA-256 checksum. **Chunks** are derived from it by a deterministic, versioned chunker (`chunkerVersion` is stored) and can be regenerated without changing source identity. Adding the same content twice to a base returns the existing document.
3. **Format-aware chunking, source identity kept.** The chunker keeps paragraphs together, tracks the nearest Markdown heading as the `section` of each chunk, and never emits a chunk above the hard maximum. Every chunk carries `knowledgeBaseId`, `documentId`, `ordinal` and `section`, which is the locator returned as evidence.
4. **Lexical retrieval first.** Retrieval uses PostgreSQL full-text search (`simple` configuration, no stemming, so it is language neutral) over a generated `tsvector`. The query is tokenized in application code into letters and digits only and combined with OR, so a user or a model can never inject query operators. Terms of three or more characters match by **prefix** (so "refund" finds "refunds" without stemming); shorter terms match exactly. Ranking uses `ts_rank_cd`. Embeddings and `pgvector` (ADR-003) come next, behind a new embedding method on the Model Gateway; they will be fused with the lexical score, not replace it.
5. **Permission before retrieval, derived from the server.** The retrieval query is constrained in SQL by `workspace_id`, by the knowledge base ids allowed for the caller, by an `active` base and by a `ready` document. Nothing is filtered after ranking. The tenant and workspace come from the authenticated context, never from a payload or from model output. A binding to a base that belongs to another workspace simply matches nothing.
6. **Agents reach knowledge through a tool.** The catalog gains `search_knowledge` (`read_only`, argument `{ query }`). It is available only if the agent version binds it in `toolBindings` **and** lists bases in `knowledgeBindings: [{ "knowledgeBaseId": "<uuid>" }]` (strict, at most 5, no duplicates, validated at publish). The runtime passes the bound base ids to the executor; the model cannot choose or widen them.
7. **Evidence, bounded and untrusted.** A search returns at most 3 passages. Each result has `evidenceId` (the chunk id), the document title, the locator and the text, and the whole result fits the tool result limit (2000 characters) so it is never cut mid-structure. It re-enters the model context like every tool output: delimited, user-role, untrusted data. Retrieved text is never trusted as instructions.
8. **Roles.** Managing bases and documents needs `knowledge.manage` (owner, admin, builder). Searching from the API needs `knowledge.use`. An agent run reads only the bases bound to its published version; the person who published that version made that choice.
9. **Limits.** At most 20 active bases per workspace, 100 documents per base, 100,000 characters per document, 500 characters per chunk, 200-character titles, 12 query terms. Control characters are removed and line endings normalized before storage.
10. **Audit.** Creating or archiving a base and adding or removing a document are audited with ids, checksums and sizes. Document text and queries are never copied into audit events. What an agent retrieved is recorded in the run step (evidence ids and titles), under the run's retention.
11. **Removing a document deletes its chunks.** Deletion is a hard delete of the document and its derived chunks (the audit event remains); archiving a base makes all its content ineligible for retrieval immediately.

## Consequences

- Three new tables (`knowledge_bases`, `knowledge_documents`, `knowledge_chunks`) and a GIN index on the generated `tsvector`; migration `0005`.
- The tool executor receives the allowed base ids in its execution context; the run service reads them from the pinned version.
- Quality of retrieval is measurable from day one with a small known-answer corpus (recall@k) in tests; this is the seed of the knowledge evaluation described in `05-knowledge/knowledge-architecture.md`.
- Lexical-only retrieval misses paraphrases and accent variants. That limitation is accepted for v1 and is the reason embeddings are next.

## Alternatives

- **Start with embeddings:** rejected for now; it needs an embedding method on the gateway, a cost policy and an eval corpus, and would delay the permission and citation guarantees that matter most.
- **Retrieve globally and filter by permission afterwards:** rejected; unauthorized text could influence ranking and context (`05-knowledge/knowledge-architecture.md`).
- **Let the model name the knowledge bases to search:** rejected; scope is a binding made by a person at publish time, never model output.
- **Store files in object storage first:** rejected for v1; text bodies are small and bounded, and storage arrives with real file ingestion.
