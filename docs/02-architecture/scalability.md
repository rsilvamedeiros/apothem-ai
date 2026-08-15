# Scalability Strategy

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Early scale should come from stateless API replicas, horizontally scalable workers, queue backpressure and database/index optimization — not immediate microservice decomposition.

Likely pressure points:
- model request concurrency and rate limits;
- ingestion/embedding bursts;
- vector search volume;
- connector API limits;
- workflow timers/retries;
- audit/telemetry volume;
- large tenant noisy-neighbor behavior.

Controls should include per-tenant quotas/concurrency, provider routing, job prioritization, batching for embeddings, connection pools and data/index partition strategies when measured.

A service extraction proposal should name the bottleneck/boundary and expected operational improvement.
