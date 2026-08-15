# Docker and Local Development

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Local development should be one-command reproducible for core dependencies without requiring cloud credentials.

Expected local services after scaffold: PostgreSQL (+ pgvector), object storage emulator/S3-compatible service, queue/cache if selected, and optional local mail sink. External model providers use developer keys or mocked adapters.

Provide seeded demo organization/workspace and deterministic mock model/tool adapters for tests. Do not make the entire test suite depend on paid external model calls.
