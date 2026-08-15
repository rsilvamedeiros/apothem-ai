# Open Questions for the Implementation Phase

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

These questions are intentionally not guessed in the foundation. Resolve when implementation evidence is available.

## Authentication
Use a managed auth platform, framework integration or direct OIDC? Requirements: multi-org users, future enterprise SSO, service accounts, secure sessions and provider portability.

## ORM/query technology
Evaluate migration ergonomics, typed SQL/query capability, pgvector support, transaction control and performance transparency.

## Queue/workflow technology
For MVP, decide whether Redis-backed jobs are enough or a durable workflow engine is justified early. Human approvals and timers eventually require durable continuation semantics; avoid locking Flow architecture to a simplistic queue API.

## Cloud
Choose based on team experience, managed PostgreSQL/object/secrets/container options, cost and Brazil/customer requirements. No document assumes AWS/Azure/GCP specifically.

## Observability
Start OpenTelemetry-compatible and decide vendor based on cost/AI trace needs. Raw prompt storage must remain configurable.

## First real connector/use case
This should be driven by first design partner because it determines which tool/approval semantics receive production validation first.

## First production model provider
The gateway should support a mock and one real provider first. Add a second when routing/portability is tested, not for checkbox completeness.
