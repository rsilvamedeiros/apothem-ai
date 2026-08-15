# Request and Execution Lifecycle

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Synchronous CRUD request
`authenticate → resolve tenant/workspace → authorize capability → validate input → execute use case → persist → audit if privileged → return normalized response`.

## Agent run request

```mermaid
sequenceDiagram
  participant U as User/API
  participant A as API
  participant R as Run Service
  participant Q as Durable Queue
  participant W as AI Worker
  U->>A: POST /runs
  A->>A: auth + tenant scope
  A->>R: create durable run
  R->>Q: enqueue run id
  A-->>U: 202/run accepted
  Q->>W: process run
  W->>W: resolve immutable agent version
  W->>W: assemble context + model route
  W->>W: reasoning/tool loop
  W->>R: append states/artifacts
  R-->>U: stream/poll/webhook updates
```

A user disconnecting from streaming must not cancel the durable run unless an explicit cancellation command is authorized.
