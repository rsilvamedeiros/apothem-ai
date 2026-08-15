# Document Processing and Chunking

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Document parsing should preserve logical structure: title, headings, pages/slides/sheets, tables where possible, source position and metadata.

Chunking is format-aware rather than one universal character count. Requirements:
- keep semantically related text together;
- preserve source/page/section identifiers;
- avoid leaking content across authorization boundaries;
- support re-chunking/index upgrades without changing source identity;
- store parser/chunker version for reproducibility.

Large spreadsheets/database sources may require structured retrieval instead of flattening every cell into embeddings.
