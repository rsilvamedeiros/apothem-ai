# Documentation Map

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

The APOTHEM documentation is organized by **decision domain**, not by meeting or chronology. The goal is that a future engineer or coding agent can enter a subject and understand both the intended behavior and the constraints around it.

## Authority order

When documents appear to conflict, use this order:

1. accepted ADR;
2. security/tenant constraints;
3. current domain/product specification;
4. roadmap/MVP scope;
5. original source vision.

The preserved source vision records intent and history, but later documents may intentionally narrow or formalize it.

## Sections

| Directory | Scope |
|---|---|
| `00-context` | Vision, positioning, vocabulary, principles, explicit non-goals |
| `01-product` | Product requirements, personas, journeys, permissions, acceptance |
| `02-architecture` | Platform architecture, boundaries, events, jobs, scaling |
| `03-domain` | Domain entities, aggregates and business state |
| `04-ai` | Agent runtime, model gateway, prompts, memory, tools, evals |
| `05-knowledge` | Ingestion, RAG, retrieval, citations and permissions |
| `06-connect` | Integrations, credentials, OAuth, MCP, connectors |
| `07-flow` | Workflow engine, triggers, nodes, retries and execution |
| `08-security` | Identity, tenancy, secrets, LGPD, threat model |
| `09-data` | PostgreSQL model, ERD, indexes, vectors and migrations |
| `10-api` | API conventions, errors, idempotency, rate limits, webhooks |
| `11-frontend` | Frontend architecture and interaction boundaries |
| `12-ux` | Information architecture and core product flows |
| `13-design-system` | Visual/product UI foundations |
| `14-observability` | Logs, traces, AI telemetry, usage and cost |
| `15-infrastructure` | Environments, domains, deployment, backups |
| `16-testing` | Test pyramid plus AI evaluation strategy |
| `17-roadmap` | MVP and phased implementation sequence |
| `18-business` | Product + Solutions, GTM, pricing, white-label |
| `19-handoff` | Claude Code startup context and unresolved implementation choices |
| `adr` | Architecture Decision Records |

## Suggested reading paths

### Product / business
`00-context → 01-product → 12-ux → 17-roadmap → 18-business`

### Backend / architecture
`02-architecture → 03-domain → 09-data → 10-api → 08-security`

### AI / agents
`04-ai → 05-knowledge → 06-connect → 07-flow → 14-observability`

### Frontend
`01-product → 11-frontend → 12-ux → 13-design-system → 10-api`
