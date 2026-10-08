# Retrieval, Reranking and Citations

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Preferred initial retrieval is hybrid: lexical/full-text signals plus vector similarity, followed by metadata/permission filters and optional reranking.

Retrieval result contract includes chunk text, source/item identity, locator (page/section/record), score components, classification and optional freshness metadata.

Citations should link final claims to evidence IDs. The UI can render a readable source preview while runtime/audit stores stable evidence references.

Evaluation metrics can include recall@k on known-answer datasets, reranking quality, citation precision, groundedness and latency.

## Implemented in v1 (ADR-014)

Lexical retrieval only, constrained in SQL by workspace, bound bases, active base and ready document. The evidence contract is `evidenceId` (the chunk id), `knowledgeBaseId`, `documentId`, document `title`, `section` (nearest Markdown heading), `ordinal` and `text`, plus a rank `score` on the API. Agents receive the first five fields and the text, trimmed to the tool result limit; the run step keeps the evidence ids and titles under the run retention policy. Vector candidates, score fusion, reranking and citation rendering in the UI are next.
