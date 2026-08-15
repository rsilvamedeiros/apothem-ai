# Retrieval, Reranking and Citations

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Preferred initial retrieval is hybrid: lexical/full-text signals plus vector similarity, followed by metadata/permission filters and optional reranking.

Retrieval result contract includes chunk text, source/item identity, locator (page/section/record), score components, classification and optional freshness metadata.

Citations should link final claims to evidence IDs. The UI can render a readable source preview while runtime/audit stores stable evidence references.

Evaluation metrics can include recall@k on known-answer datasets, reranking quality, citation precision, groundedness and latency.
