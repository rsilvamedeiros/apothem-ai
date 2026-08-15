# Backups and Disaster Recovery

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Minimum production expectations:
- managed DB backups and point-in-time recovery;
- versioning/retention for critical object storage where appropriate;
- infrastructure/configuration reproducibility;
- secret recovery/rotation procedures;
- documented restore test cadence;
- RPO/RTO objectives established before contractual enterprise SLA.

Queues and derived indexes should be rebuildable where possible. Source-of-truth data and audit evidence receive stronger recovery priority than caches/vector materialization.
