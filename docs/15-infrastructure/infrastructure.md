# Infrastructure Direction

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Infrastructure choice remains open, but required capabilities are clear:
- containerized stateless web/API/worker compute;
- managed PostgreSQL with backups/PITR;
- object storage;
- durable queue/workflow scheduling capability;
- secret manager;
- CDN/WAF for public surfaces;
- centralized observability;
- private networking/egress controls where practical.

Prefer managed infrastructure for MVP to keep engineering focus on product differentiation.
