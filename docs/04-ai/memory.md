# Memory Model

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Memory categories:
- **conversation memory** — current thread summaries/state;
- **user memory** — authorized preferences/context;
- **agent memory** — reusable operational learnings/state for that agent;
- **organization memory** — curated institutional knowledge.

Memory must have a purpose, provenance, scope, retention and deletion strategy. Do not automatically persist every model observation as “memory”.

Write-to-memory should be policy-controlled, especially when the content can affect future decisions. High-value durable knowledge is better represented as curated Knowledge than opaque agent memory.
