# Monorepo Architecture

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Intended future structure

```text
apps/
  site/         public website
  web/          authenticated product
  api/          HTTP API / webhooks
workers/
  ai/           long-running run, ingestion and workflow jobs
packages/
  domain/       pure domain concepts
  application/  use cases / ports
  contracts/    API/event schemas
  db/           repositories, migrations, generated DB types
  ai/           model gateway and provider adapters
  auth/         identity/authorization helpers
  ui/           APOTHEM design system
  observability/
  config/
infra/
tooling/
```

## Dependency direction

`domain` imports no framework/provider packages. `application` depends on domain and ports. Infrastructure packages implement ports. Delivery apps compose them.

Avoid a giant `shared` package. Shared code must have an explicit responsibility. Cross-context reuse of business entities is a smell; use contracts/events instead.

## Build/deploy independence

A monorepo does not imply one deployment. `site`, `web`, `api` and worker may release independently while sharing validated contracts. Database migrations require coordinated compatibility and expand/contract discipline.
